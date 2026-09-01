"use client";

import { useState, useRef, useEffect } from "react";
import { FiPlay, FiPause, FiVolume2, FiVolumeX } from "react-icons/fi";

interface CustomAudioPlayerProps {
  src: string;
  title?: string;
}

export default function CustomAudioPlayer({ src, title }: CustomAudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const setAudioData = () => setDuration(audio.duration);
    const setAudioTime = () => setCurrentTime(audio.currentTime);
    const onEnded = () => setIsPlaying(false);

    audio.addEventListener("loadeddata", setAudioData);
    audio.addEventListener("timeupdate", setAudioTime);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("loadeddata", setAudioData);
      audio.removeEventListener("timeupdate", setAudioTime);
      audio.removeEventListener("ended", onEnded);
    };
  }, []);

  const togglePlay = () => {
    if (audioRef.current?.paused) {
      audioRef.current.play();
      setIsPlaying(true);
    } else {
      audioRef.current?.pause();
      setIsPlaying(false);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    if (audioRef.current) audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div className="w-full bg-gradient-to-br from-[#1a3c34] to-[#0b2622] rounded-2xl p-5 border border-gold/20 shadow-lg relative overflow-hidden group">
      {/* افکت پس‌زمینه متحرک */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold/50 to-transparent opacity-50" />

      <audio ref={audioRef} src={src} preload="metadata" />

      <div className="flex flex-col gap-4 relative z-10">
        {/* اطلاعات و کنترل اصلی */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`h-10 w-10 rounded-full flex items-center justify-center ${isPlaying ? 'bg-gold text-deep animate-pulse' : 'bg-gold/10 text-gold'}`}>
              <FiVolume2 size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-white">{title || "پیام صوتی"}</p>
              <p className="text-xs text-gold/60">فرمت صوتی</p>
            </div>
          </div>

          <button
            onClick={togglePlay}
            className="h-12 w-12 rounded-full bg-gold text-deep flex items-center justify-center hover:bg-white hover:scale-105 transition-all shadow-[0_0_20px_rgba(201,162,77,0.4)]"
          >
            {isPlaying ? <FiPause size={20} /> : <FiPlay size={20} className="ml-1" />}
          </button>
        </div>

        {/* نوار پیشرفت */}
        <div className="space-y-2">
          <input
            type="range"
            min="0"
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1.5 bg-deep/50 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gold [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(201,162,77,0.8)]"
            style={{
              backgroundImage: `linear-gradient(to right, #c9a24d ${(currentTime / duration) * 100}%, rgba(255,255,255,0.1) ${(currentTime / duration) * 100}%)`
            }}
          />
          <div className="flex justify-between text-[10px] text-cream/40 font-mono">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* کنترل صدا */}
        <div className="flex items-center gap-2 pt-2 border-t border-white/5">
           <button onClick={toggleMute} className="text-cream/40 hover:text-gold transition-colors">
             {isMuted ? <FiVolumeX size={16} /> : <FiVolume2 size={16} />}
           </button>
           <input
             type="range"
             min="0"
             max="1"
             step="0.1"
             value={isMuted ? 0 : volume}
             onChange={(e) => {
               const val = Number(e.target.value);
               setVolume(val);
               if(audioRef.current) audioRef.current.volume = val;
             }}
             className="w-20 h-1 bg-deep/50 rounded-lg appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cream/50"
           />
        </div>
      </div>
    </div>
  );
}