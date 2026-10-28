"use client";

import { useEffect, useRef, useCallback } from "react";
import styles from "./InteractiveRobotScene.module.css";

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
  decay: number;
}

export default function InteractiveRobotScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Sparks particle system
  const sparksRef = useRef<Spark[]>([]);

  // Add spark burst helper
  const addSparks = useCallback((originX: number, originY: number, count = 10) => {
    const colors = ["#ffd54f", "#ffb300", "#ff8f00", "#4fc3f7", "#ffffff", "#c99225"];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.2 + Math.random() * 3.2;
      sparksRef.current.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.7,
        size: 1.5 + Math.random() * 2.2,
        alpha: 0.9 + Math.random() * 0.1,
        color: colors[Math.floor(Math.random() * colors.length)],
        decay: 0.018 + Math.random() * 0.024,
      });
    }
  }, []);

  // Handle Mouse Movement for 3D Tilt & Interactive Sparks
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    const tilt = tiltRef.current;
    if (!container || !tilt) return;

    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Normalized coordinates (-0.5 to 0.5)
    const normX = x / rect.width - 0.5;
    const normY = y / rect.height - 0.5;

    // Subtle 3D tilt
    const rotateY = normX * 10;
    const rotateX = -normY * 8;

    tilt.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;

    // Spawn sparks if moving near the welding area (left-center)
    const welderAreaX = rect.width * 0.35;
    const welderAreaY = rect.height * 0.32;
    const distToWelder = Math.hypot(x - welderAreaX, y - welderAreaY);
    if (distToWelder < rect.width * 0.22 && Math.random() < 0.35) {
      addSparks(x, y, 2);
    }
  };

  const handleMouseLeave = () => {
    const tilt = tiltRef.current;
    if (tilt) {
      tilt.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      addSparks(clickX, clickY, 16);
    }
  };

  // Particle render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    const resize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }
    };
    resize();
    window.addEventListener("resize", resize);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Periodically emit subtle ambient sparks near the robot welding torch
      if (Math.random() < 0.25) {
        const torchX = canvas.width * 0.36 + (Math.random() - 0.5) * 10;
        const torchY = canvas.height * 0.32 + (Math.random() - 0.5) * 10;
        addSparks(torchX, torchY, 1);
      }

      // Update and draw existing sparks
      const sparks = sparksRef.current;
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.08;
        s.alpha -= s.decay;

        if (s.alpha <= 0) {
          sparks.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, s.alpha);
        ctx.fillStyle = s.color;
        ctx.shadowBlur = 6;
        ctx.shadowColor = s.color;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, [addSparks]);

  // Video fallback hiding
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const hideFallback = () => {
      const fallback = video.parentElement?.parentElement?.querySelector(".robotFallback");
      if (fallback) fallback.setAttribute("hidden", "");
    };

    video.addEventListener("canplay", hideFallback);
    video.addEventListener("playing", hideFallback);

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
    <div
      ref={containerRef}
      className={styles.container}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      role="region"
      aria-label="Interactive 3D Robotics Lab Hangar"
    >
      <div ref={tiltRef} className={styles.tiltWrapper}>
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
        <canvas ref={canvasRef} className={styles.particleCanvas} />
      </div>

      {/* Top Left Live Indicator Pill */}
      <div className={styles.livePill}>
        <span className={styles.liveDot} />
        <span>RoboBee Lab · Hangar 01</span>
      </div>
    </div>
  );
}
