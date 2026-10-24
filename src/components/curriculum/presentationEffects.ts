"use client";

/**
 * Presentation Audio & Visual Celebration Effects
 * Zero external assets: uses native Web Audio API and HTML5 Canvas.
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  try {
    if (!audioCtx) {
      const AudioCtxClass =
        window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        audioCtx = new AudioCtxClass();
      }
    }
    if (audioCtx && audioCtx.state === "suspended") {
      audioCtx.resume().catch(() => {});
    }
    return audioCtx;
  } catch {
    return null;
  }
}

/**
 * Soft tactile bubble pop for card flips and slide switches
 */
export function playPop(soundEnabled = true) {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    const now = ctx.currentTime;
    osc.frequency.setValueAtTime(420, now);
    osc.frequency.exponentialRampToValueAtTime(180, now + 0.09);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.09);
  } catch {}
}

/**
 * Cheerful major-third bell chime for correct quiz answers
 */
export function playChime(soundEnabled = true) {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const notes = [587.33, 880]; // D5, A5
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      const startTime = now + idx * 0.08;
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.22, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.45);
    });
  } catch {}
}

/**
 * Crisp wooden click for +1 live classroom poll voting
 */
export function playClick(soundEnabled = true) {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "triangle";
    const now = ctx.currentTime;
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(120, now + 0.05);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.05);
  } catch {}
}

/**
 * Celebratory 4-note victory fanfare for milestones and confetti bursts
 */
export function playFanfare(soundEnabled = true) {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    // C5, E5, G5, C6 arpeggio
    const chord = [523.25, 659.25, 783.99, 1046.5];
    chord.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = idx === chord.length - 1 ? "triangle" : "sine";
      const start = now + idx * 0.09;
      const duration = idx === chord.length - 1 ? 0.6 : 0.25;

      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.25, start + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, start + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(start);
      osc.stop(start + duration);
    });
  } catch {}
}

/**
 * Canvas Confetti Particle Blast
 * Self-contained: creates a high-performance transparent canvas overlay,
 * animates colorful confetti particles, and automatically removes itself.
 */
export function launchConfetti() {
  if (typeof window === "undefined" || typeof document === "undefined") return;

  const canvas = document.createElement("canvas");
  canvas.style.position = "fixed";
  canvas.style.inset = "0";
  canvas.style.width = "100vw";
  canvas.style.height = "100vh";
  canvas.style.pointerEvents = "none";
  canvas.style.zIndex = "9999999";
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    canvas.remove();
    return;
  }

  const width = (canvas.width = window.innerWidth);
  const height = (canvas.height = window.innerHeight);

  const colors = [
    "#F5B800", // RoboBee Gold
    "#00F5D4", // Electric Cyan
    "#38BDF8", // Sky Blue
    "#FF3B69", // Racing Coral
    "#10B981", // Emerald Mint
    "#8B5CF6", // Purple Neon
    "#FBBF24", // Amber
    "#FFFFFF", // Crisp White
  ];

  interface Particle {
    x: number;
    y: number;
    w: number;
    h: number;
    color: string;
    vx: number;
    vy: number;
    rotation: number;
    vRot: number;
    opacity: number;
    shape: "rect" | "circle" | "ribbon";
  }

  const particles: Particle[] = [];
  const particleCount = 90;

  // Origin from bottom-center/sides for high-energy burst
  for (let i = 0; i < particleCount; i++) {
    const angle = (Math.random() * Math.PI * 0.8) + Math.PI * 0.1; // upward fan
    const speed = 12 + Math.random() * 22;
    particles.push({
      x: width * 0.5 + (Math.random() - 0.5) * 200,
      y: height * 0.75,
      w: 8 + Math.random() * 8,
      h: 12 + Math.random() * 12,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: Math.cos(angle) * speed * (Math.random() > 0.5 ? 1 : -1),
      vy: -Math.sin(angle) * speed,
      rotation: Math.random() * 360,
      vRot: (Math.random() - 0.5) * 16,
      opacity: 1,
      shape: Math.random() > 0.4 ? "rect" : Math.random() > 0.5 ? "circle" : "ribbon",
    });
  }

  let animFrameId: number;
  const startTime = Date.now();

  function render() {
    if (!ctx) return;
    const elapsed = Date.now() - startTime;
    ctx.clearRect(0, 0, width, height);

    let activeParticles = 0;

    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.45; // gravity
      p.vx *= 0.985; // drag
      p.rotation += p.vRot;

      if (elapsed > 1200) {
        p.opacity = Math.max(0, p.opacity - 0.025);
      }

      if (p.opacity > 0 && p.y < height + 50) {
        activeParticles++;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;

        if (p.shape === "circle") {
          ctx.beginPath();
          ctx.arc(0, 0, p.w * 0.5, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.shape === "ribbon") {
          ctx.fillRect(-p.w * 0.5, -p.h * 0.5, p.w * 0.6, p.h * 1.5);
        } else {
          ctx.fillRect(-p.w * 0.5, -p.h * 0.5, p.w, p.h);
        }

        ctx.restore();
      }
    }

    if (activeParticles > 0 && elapsed < 3200) {
      animFrameId = requestAnimationFrame(render);
    } else {
      cancelAnimationFrame(animFrameId);
      canvas.remove();
    }
  }

  render();
}
