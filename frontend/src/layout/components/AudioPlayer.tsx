import { Song } from "@/types";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { useEffect, useRef } from "react";

const AudioPlayer = () => {
	const audioRef = useRef<HTMLAudioElement>(null);
	const prevSongRef = useRef<string | null>(null);

	const { currentSong, isPlaying, playNext } = usePlayerStore()

	useEffect(() => {
		if (isPlaying) audioRef.current?.play();
		else audioRef.current?.pause();
	  }, [isPlaying, currentSong]);

	useEffect(() => {
		const audio = audioRef.current;

		const handleCanPlay = () => {
			if (isPlaying) {
			  audio?.play().catch((error) => {
				console.error("Error playing audio:", error);
			  });
			}
		  };

		const handleEnded = () => {
			playNext();
		};
		const handleError = () => {
			console.error("Error playing audio:", audio?.error);
		  };

		audio?.addEventListener("canplay", handleCanPlay);
		audio?.addEventListener("ended", handleEnded);
		audio?.addEventListener("error", handleError);

		return () => {
			audio?.removeEventListener("canplay", handleCanPlay);
			audio?.removeEventListener("ended", handleEnded);
			audio?.removeEventListener("error", handleError);
		};

	}, [playNext]);

	useEffect(() => {
		if (!audioRef.current || !currentSong) return;

		const audio = audioRef.current;
		const isSongChange = prevSongRef.current !== currentSong?.audioUrl;
		if (isSongChange) {
			audio.src = currentSong?.audioUrl;
			audio.currentTime = 0;

			prevSongRef.current = currentSong?.audioUrl;

			if (isPlaying) audio.play();
		}
	}, [currentSong, isPlaying]);

	return <audio ref={audioRef} />;
};
export default AudioPlayer;