import PlaylistSkeleton from "@/components/skeletons/PlaylistSkeleton";
import { buttonVariants } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { SignedIn } from "@clerk/clerk-react";
import { Library, MenuIcon, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";

const LeftSidebar = () => {
    const { data: albums, isLoading } = useQuery({
        queryKey: ["albums"],
        queryFn: async () => {
          const response = await axiosInstance.get("/albums");
          return response.data;
        },
      });
    
  return (
    <div className="flex flex-col h-full gap-2">
      {/* Menu */}
      <div className="rounded-lg bg-zinc-900 p-4">
        <div className="space-y-2">
          <Link
            to={"/"}
            className={cn(
              buttonVariants({
                variant: "ghost",
                className: "w-full justify-start hover:bg-zinc-800 text-white",
              })
            )}
          >
            <MenuIcon className="mr-2 size-5" />
            <span className="md:inline hidden">Home</span>
          </Link>

          <SignedIn>
            <Link
              to={"/chat"}
              className={cn(
                buttonVariants({
                  variant: "ghost",
                  className: "w-full justify-start hover:bg-zinc-800 text-white",
                })
              )}
            >
              <MessageCircle className="mr-2 size-5" />
              <span className="md:inline hidden">Messages</span>
            </Link>
          </SignedIn>
        </div>
      </div>

      {/* Library */}
      <div className="flex-1 rounded-lg bg-zinc-900 p-4">
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center text-white px-2">
                <Library className="mr-2 size-5" />
                <span className="md:inline hidden">Playlists</span>
            </div>
        </div>
        <ScrollArea className="h-[calc(100vh-300px)]">
            <div className="space-y-2">
              { isLoading ? (
                <PlaylistSkeleton />
              ) : (
                albums.map((album: { _id: string; imageUrl: string; title: string; artist: string }) => 
                <Link to={`/albums/${album._id}`} 
                key={album._id} 
                className= "p-2 hover:bg-zinc-800 rounded-md flex items-center gap-3 group cursor-pointer">
                    <img src={album.imageUrl} alt="Playlist img" className="size-12 rounded-md flex-shrink-0 object-cover"/>
                    <div className="flex-1 min-w-0 hidden md:block">
                        <p className="font-medium truncate">
                            {album.title}
                        </p>
                        <p className="text-sm text-zinc-400 truncate">
                            Album {album.artist}
                        </p>
                    </div>
                </Link>
                )
              )}
            </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default LeftSidebar;
