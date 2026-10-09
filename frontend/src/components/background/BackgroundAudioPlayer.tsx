"use client";

import {useEffect, useRef, useState} from "react";
import {useBackgroundMusic} from "@/hooks/useSettings";
import {Play, Pause, Volume2, VolumeX} from "lucide-react";

export default function BackgroundAudioPlayer() {
    const {data: musicData} = useBackgroundMusic();

    const audioRef = useRef<HTMLAudioElement | null>(null);

    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        if (musicData?.is_active && musicData.music) {
            audio.src = musicData.music;
            audio.loop = true;
            audio.volume = 0.3;

            audio.play()
                .then(() => setIsPlaying(true))
                .catch((error) => {
                    // ممکن است مرورگر پخش خودکار را مسدود کند.
                    console.warn("Autoplay was blocked:", error);
                });
        } else {
            audio.pause();
            audio.removeAttribute("src");
            audio.load();
            setIsPlaying(false);
        }
    }, [musicData]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handlePlay = () => setIsPlaying(true);
        const handlePause = () => setIsPlaying(false);

        audio.addEventListener("play", handlePlay);
        audio.addEventListener("pause", handlePause);
        audio.addEventListener("ended", handlePause);

        return () => {
            audio.removeEventListener("play", handlePlay);
            audio.removeEventListener("pause", handlePause);
            audio.removeEventListener("ended", handlePause);
        };
    }, []);

    const togglePlay = async () => {
        const audio = audioRef.current;

        if (!audio || !musicData?.is_active || !musicData.music) return;

        try {
            if (audio.paused) {
                await audio.play();
            } else {
                audio.pause();
            }
        } catch (error) {
            console.error("Failed to play background music:", error);
        }
    };

    if (!musicData?.is_active || !musicData.music) return null;

    return (
        <>
            <audio ref={audioRef} className="hidden"/>

            <button
                type="button"
                onClick={togglePlay}
                aria-label={isPlaying ? "Pause background music" : "Play background music"}
                title={isPlaying ? "توقف موزیک" : "پخش موزیک"}
                className="fixed bottom-5 right-5 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-black/70 text-white shadow-lg backdrop-blur-md transition hover:scale-105 hover:bg-black/90"
            >
                {isPlaying ? (
                    <Pause size={21}/>
                ) : (
                    <Play size={21}/>
                )}
            </button>
        </>
    );
}