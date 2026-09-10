"use client";

import { useEffect, useRef } from "react";
import { useBackgroundMusic } from "@/hooks/useSettings";

export default function BackgroundAudioPlayer() {
  const { data: musicData } = useBackgroundMusic();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const unlockedRef = useRef(false); // آیا مرورگر پخش خودکار رو آزاد کرده؟

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (musicData?.is_active && musicData.music) {
      // فقط اگه منبع فرق کرده src رو عوض کن (جلوگیری از قطع و وصل شدن غیرضروری)
      if (audio.src !== musicData.music) {
        audio.src = musicData.music;
      }
      audio.loop = true;
      audio.volume = 0.3;

      const tryPlay = () => {
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              unlockedRef.current = true;
            })
            .catch((error) => {
              console.log("Auto-play prevented by browser policy:", error);
            });
        }
      };

      tryPlay();

      // اگه به هر دلیلی (مثلاً ورود مستقیم به لندینگ بدون تعامل قبلی) پخش بلاک شد،
      // با اولین کلیک/لمس کاربر در هر جای صفحه دوباره تلاش می‌کنیم.
      const unlockOnInteraction = () => {
        if (unlockedRef.current) return;
        tryPlay();
      };

      document.addEventListener("click", unlockOnInteraction);
      document.addEventListener("touchstart", unlockOnInteraction);

      return () => {
        document.removeEventListener("click", unlockOnInteraction);
        document.removeEventListener("touchstart", unlockOnInteraction);
      };
    } else {
      audio.pause();
      audio.src = "";
    }
  }, [musicData]);

  return <audio ref={audioRef} className="hidden" />;
}