"use client";

import { useEffect, useRef } from "react";
import styles from "./InteractiveRobotScene.module.css";

export default function InteractiveRobotScene() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Ensure loop repeats smoothly without pause across all browsers
    const handleEnded = () => {
      video.currentTime = 0;
      video.play().catch(() => {});
    };
    video.addEventListener("ended", handleEnded);

    // If user prefers reduced motion, pause the video and show poster
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      video.pause();
    }

    return () => {
      video.removeEventListener("ended", handleEnded);
    };
  }, []);

  return (
    <div className={styles.container} aria-label="RoboBee Humanoid Robotics Workshop">
      <video
        ref={videoRef}
        src="/hero-robot-lab.mp4"
        poster="/hero-robot-poster.jpg"
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
