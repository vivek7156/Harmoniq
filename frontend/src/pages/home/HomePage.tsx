import { useEffect, useState } from "react";
import { axiosInstance } from "@/lib/axios";
import Topbar from "@/components/Topbar";
import FeaturedSection from "./components/FeaturedSection";
import { ScrollArea } from "@/components/ui/scroll-area";
import SectionGrid from "./components/SectionGrid";
import { usePlayerStore } from "@/stores/usePlayerStore";

export default function HomePage() {
  const [madeForYouSongs, setMadeForYouSongs] = useState([]);
  const [featuredSongs, setFeaturedSongs] = useState([]);
  const [trendingSongs, setTrendingSongs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { initializeQueue } = usePlayerStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [madeRes, featuredRes, trendingRes] = await Promise.all([
          axiosInstance.get("/songs/made-for-you"),
          axiosInstance.get("/songs/featured"),
          axiosInstance.get("/songs/trending"),
        ]);
        setMadeForYouSongs(madeRes.data);
        setFeaturedSongs(featuredRes.data);
        setTrendingSongs(trendingRes.data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

	useEffect(() => {
		if (madeForYouSongs.length > 0 && featuredSongs.length > 0 && trendingSongs.length > 0) {
			const allSongs = [...featuredSongs, ...madeForYouSongs, ...trendingSongs];
			initializeQueue(allSongs);
		}
	}, [initializeQueue, madeForYouSongs, trendingSongs, featuredSongs]);

  return (
		<main className='rounded-md overflow-hidden h-full bg-gradient-to-b from-zinc-800 to-zinc-900'>
			<Topbar />
			<ScrollArea className='h-[calc(100vh-180px)]'>
				<div className='p-4 sm:p-6'>
					<h1 className='text-2xl sm:text-3xl font-bold mb-6'>Good afternoon</h1>
					<FeaturedSection featuredSongs={featuredSongs} isLoading={isLoading} />

					<div className='space-y-8'>
						<SectionGrid title='Made For You' songs={madeForYouSongs} isLoading={isLoading} />
						<SectionGrid title='Trending' songs={trendingSongs} isLoading={isLoading} />
					</div>
				</div>
			</ScrollArea>
		</main>
  );
}