"use client";

import { useEffect, useRef, useState } from "react";
import { useBackgroundMusic } from "@/hooks/useSettings";
import { FiPlay, FiPause } from "react-icons/fi";

// رویدادهایی که مرورگر آن‌ها را «تعامل کاربر» حساب می‌کند و اجازه‌ی پخش صدا می‌دهد
const UNLOCK_EVENTS = [
  "pointerdown",
  "pointerup",
  "touchend",
  "click",
  "keydown",
] as const;

export default function BackgroundAudioPlayer() {
  const { data: musicData } = useBackgroundMusic();

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const userPausedRef = useRef(false); // اگر کاربر خودش دکمه‌ی توقف را زد، دیگر خودکار پخش نکن

  const [isPlaying, setIsPlaying] = useState(false);

  const isActive = Boolean(musicData?.is_active && musicData?.music);
  const musicSrc = musicData?.music ?? "";

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!isActive) {
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
      return;
    }

    audio.src = musicSrc;
    audio.loop = true;
    audio.volume = 0.3;
    userPausedRef.current = false;

    const removeUnlockListeners = () => {
      UNLOCK_EVENTS.forEach((ev) =>
        window.removeEventListener(ev, handleFirstInteraction, true),
      );
    };

    // اولین تعاملِ کاربر با صفحه (تپ، کلیک، کلید) → پخش را دوباره امتحان کن
    const handleFirstInteraction = (e: Event) => {
      // اگر روی خود دکمه‌ی موزیک زد، اجازه بده togglePlay کار خودش را بکند
      if (buttonRef.current?.contains(e.target as Node)) return;

      if (userPausedRef.current || !audio.paused) {
        removeUnlockListeners();
        return;
      }

      audio
        .play()
        .then(removeUnlockListeners)
        .catch(() => {
          // هنوز مرورگر اجازه نداد؛ لیسنرها می‌مانند تا تعامل بعدی
        });
    };

    // لیسنرها همیشه وصل می‌شوند (روی موبایل ممکن است play() اولیه نه موفق شود نه خطا بدهد)
    // capture=true: حتی اگر المانی جلوی رسیدن رویداد به بالا را بگیرد، ما آن را می‌گیریم
    UNLOCK_EVENTS.forEach((ev) =>
      window.addEventListener(ev, handleFirstInteraction, {
        capture: true,
        passive: true,
      }),
    );

    // اول سعی کن مستقیم پخش کنی (اگر مرورگر اجازه بدهد همین‌جا شروع می‌شود)
    audio
      .play()
      .then(removeUnlockListeners)
      .catch(() => {});

    return () => {
      removeUnlockListeners();
    };
  }, [isActive, musicSrc]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio || !isActive) return;

    try {
      if (audio.paused) {
        userPausedRef.current = false;
        await audio.play();
      } else {
        userPausedRef.current = true;
        audio.pause();
      }
    } catch (error) {
      console.error("Failed to play background music:", error);
    }
  };

  return (
    <>
      {/* audio همیشه رندر می‌شود تا audioRef از همان اولین رندر مقدار داشته باشد */}
      <audio
        ref={audioRef}
        className="hidden"
        preload="auto"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
      />

      {isActive && (
        <button
          ref={buttonRef}
          type="button"
          onClick={togglePlay}
          aria-label={
            isPlaying ? "Pause background music" : "Play background music"
          }
          title={isPlaying ? "توقف موزیک" : "پخش موزیک"}
          className="fixed right-5 bottom-[calc(5rem+env(safe-area-inset-bottom))] lg:bottom-5 z-[60] flex h-12 w-12 items-center justify-center rounded-full bg-black/70 text-white shadow-lg backdrop-blur-md transition hover:scale-105 hover:bg-black/90"
        >
          {isPlaying ? <FiPause size={21} /> : <FiPlay size={21} />}
        </button>
      )}
    </>
  );
}
