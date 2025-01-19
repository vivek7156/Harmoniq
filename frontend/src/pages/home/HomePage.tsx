import { useEffect, useState } from "react";
import { axiosInstance } from "@/lib/axios";
import Topbar from "@/components/Topbar";
import FeaturedSection from "./components/FeaturedSection";
import { ScrollArea } from "@/components/ui/scroll-area";
import SectionGrid from "./components/SectionGrid";

export default function HomePage() {
  const [madeForYouSongs, setMadeForYouSongs] = useState([]);
  const [featuredSongs, setFeaturedSongs] = useState([]);
  const [trendingSongs, setTrendingSongs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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

  return (
		<main className='rounded-md overflow-hidden h-full bg-gradient-to-b from-zinc-800 to-zinc-900'>
			<Topbar />
			<ScrollArea className='h-[calc(100vh-180px)]'>
				<div className='p-4 sm:p-6'>
					<h1 className='text-2xl sm:text-3xl font-bold mb-6'>Good afternoon</h1>
					<FeaturedSection />

					<div className='space-y-8'>
						<SectionGrid title='Made For You' songs={madeForYouSongs} isLoading={isLoading} />
						<SectionGrid title='Trending' songs={trendingSongs} isLoading={isLoading} />
					</div>
				</div>
			</ScrollArea>
		</main>
  );
}