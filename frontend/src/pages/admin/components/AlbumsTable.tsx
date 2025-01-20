import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, Music, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { axiosInstance } from "@/lib/axios";
import toast from "react-hot-toast";

const AlbumsTable = () => {
    const [albums, setAlbums] = useState([]);
    const [isLoadingAlbums, setIsLoadingAlbums] = useState(true);
    const [error, setError] = useState<string | null>(null);
  
    useEffect(() => {
      const fetchAlbums = async () => {
        try {
          const response = await axiosInstance.get("/albums");
          setAlbums(response.data);
        } catch (error) {
          console.error("Error fetching albums:", error);
          setError("Error fetching albums");
        } finally {
          setIsLoadingAlbums(false);
        }
      };
      fetchAlbums();
    }, []);

    const deleteAlbum = async (albumId: string) => {
        try {
          await axiosInstance.delete(`/admin/albums/${albumId}`);
          setAlbums((prevAlbums) => prevAlbums.filter((album) => album._id !== albumId));
          toast.success("Album deleted successfully");
        } catch (error) {
          console.error("Error deleting album:", error);
          setError("Error deleting album");
        }
      };
    
      if (isLoadingAlbums) {
        return (
          <div className='flex items-center justify-center py-8'>
            <div className='text-zinc-400'>Loading albums...</div>
          </div>
        );
      }
    
      if (error) {
        return (
          <div className='flex items-center justify-center py-8'>
            <div className='text-red-400'>{error}</div>
          </div>
        );
      }

	return (
		<Table>
			<TableHeader>
				<TableRow className='hover:bg-zinc-800/50'>
					<TableHead className='w-[50px]'></TableHead>
					<TableHead>Title</TableHead>
					<TableHead>Artist</TableHead>
					<TableHead>Release Year</TableHead>
					<TableHead>Songs</TableHead>
					<TableHead className='text-right'>Actions</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{albums.map((album) => (
					<TableRow key={album._id} className='hover:bg-zinc-800/50'>
						<TableCell>
							<img src={album.imageUrl} alt={album.title} className='w-10 h-10 rounded object-cover' />
						</TableCell>
						<TableCell className='font-medium'>{album.title}</TableCell>
						<TableCell>{album.artist}</TableCell>
						<TableCell>
							<span className='inline-flex items-center gap-1 text-zinc-400'>
								<Calendar className='h-4 w-4' />
								{album.releaseYear}
							</span>
						</TableCell>
						<TableCell>
							<span className='inline-flex items-center gap-1 text-zinc-400'>
								<Music className='h-4 w-4' />
								{album.songs.length} songs
							</span>
						</TableCell>
						<TableCell className='text-right'>
							<div className='flex gap-2 justify-end'>
								<Button
									variant='ghost'
									size='sm'
									onClick={() => deleteAlbum(album._id)}
									className='text-red-400 hover:text-red-300 hover:bg-red-400/10'
								>
									<Trash2 className='h-4 w-4' />
								</Button>
							</div>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
};
export default AlbumsTable;