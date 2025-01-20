import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, Trash2 } from "lucide-react";
import { useState, useEffect } from 'react';
import { axiosInstance } from "@/lib/axios";
import toast from "react-hot-toast";

const SongsTable = () => {
    const [songs, setSongs] = useState([]);
    const [isLoadingSongs, setIsLoadingSongs] = useState(true);
	const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSongs = async () => {
          try {
            const response = await axiosInstance.get("/songs");
            setSongs(response.data);
          } catch (error) {
            console.error("Error fetching songs:", error);
          } finally {
            setIsLoadingSongs(false);
          }
        };
        fetchSongs();
      }, []);

	const deleteSong = async (songId: string) => {
		try {
		  await axiosInstance.delete(`/admin/songs/${songId}`);
		  setSongs((prevSongs) => prevSongs.filter((song) => song._id !== songId));
		  toast.success("Song deleted successfully");
		} catch (error) {
		  console.error("Error deleting song:", error);
		  setError("Error deleting song");
		}
	  };
    
	if (isLoadingSongs) {
		return (
			<div className='flex items-center justify-center py-8'>
				<div className='text-zinc-400'>Loading songs...</div>
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
					<TableHead>Release Date</TableHead>
					<TableHead className='text-right'>Actions</TableHead>
				</TableRow>
			</TableHeader>

			<TableBody>
				{songs.map((song) => (
					<TableRow key={song._id} className='hover:bg-zinc-800/50'>
						<TableCell>
							<img src={song.imageUrl} alt={song.title} className='size-10 rounded object-cover' />
						</TableCell>
						<TableCell className='font-medium'>{song.title}</TableCell>
						<TableCell>{song.artist}</TableCell>
						<TableCell>
							<span className='inline-flex items-center gap-1 text-zinc-400'>
								<Calendar className='h-4 w-4' />
								{song.createdAt.split("T")[0]}
							</span>
						</TableCell>

						<TableCell className='text-right'>
							<div className='flex gap-2 justify-end'>
								<Button
									variant={"ghost"}
									size={"sm"}
									className='text-red-400 hover:text-red-300 hover:bg-red-400/10'
									onClick={() => deleteSong(song._id)}
								>
									<Trash2 className='size-4' />
								</Button>
							</div>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
};
export default SongsTable;