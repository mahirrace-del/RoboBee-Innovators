"use client";

import { useEffect, useRef } from "react";
import styles from "./InteractiveRobotScene.module.css";

export default function InteractiveRobotScene() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Ensure fallback is hidden once video is ready
    const hideFallback = () => {
      const fallback = video.parentElement?.parentElement?.querySelector(".robotFallback");
      if (fallback) fallback.setAttribute("hidden", "");
    };

    video.addEventListener("canplay", hideFallback);
    video.addEventListener("playing", hideFallback);

    // Guaranteed seamless loop across Safari/iOS/Chrome
    const handleEnded = () => {
      video.currentTime = 0;
      video.play().catch(() => {});
    };
    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("canplay", hideFallback);
      video.removeEventListener("playing", hideFallback);
      video.removeEventListener("ended", handleEnded);
    };
  }, []);

  return (
    <div className={styles.container} aria-label="RoboBee Humanoid Robot Workshop">
      <video
        ref={videoRef}
        src="/hero-robot-lab.mp4"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className={styles.video}
      />
    </div>
  );
}
