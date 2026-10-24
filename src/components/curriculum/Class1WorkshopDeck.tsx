"use client";

import React, { useState } from "react";
import { RoboticsLesson } from "@/lib/curriculumData";
import {
  Sparkles,
  Rocket,
  Cpu,
  Zap,
  Award,
  CheckCircle2,
  XCircle,
  ZoomIn,
  X,
  Plus,
  RotateCcw,
  Compass,
  Clock,
  Eye,
  Brain,
  Cog,
  BatteryCharging,
  ShieldCheck,
  Wifi,
  Gauge,
  Layers,
  Code2,
  ArrowRight,
  HelpCircle,
  Trophy,
  Globe,
  Wrench,
} from "lucide-react";

export type SlideColorTheme =
  | "robobee-dark"
  | "daylight-studio"
  | "electric-indigo"
  | "arduino-teal"
  | "cyber-blueprint";

export type SlideLayoutType =
  | "hero-title"
  | "split-media"
  | "interactive-grid"
  | "interactive-hotspot"
  | "timeline-stepper";

export interface Class1SlideMeta {
  index: number;
  numberLabel: string;
  title: string;
  subtitle: string;
  theme: SlideColorTheme;
  layout: SlideLayoutType;
  heroImage: string;
  imageCaption: string;
  speakerNotes: string;
}

export const CLASS_01_SLIDES: Class1SlideMeta[] = [
  {
    index: 0,
    numberLabel: "01",
    title: "Welcome to the World of Robotics",
    subtitle:
      "From Consumer of Technology to Creator of Autonomous Machines — RoboBee Innovators Foundation Track.",
    theme: "electric-indigo",
    layout: "hero-title",
    heroImage:
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1600&q=80",
    imageCaption: "Autonomous Humanoid & Precision Robotics Lab • Class 01 Foundation",
    speakerNotes:
      "Welcome students with high energy! Ask: 'Who here uses technology every day? Now, who wants to BUILD the technology of the future?' Click 'Launch Class Engine' to trigger the HUD boot transition into Slide 02.",
  },
  {
    index: 1,
    numberLabel: "02",
    title: "Why Extracurricular Activities Matter",
    subtitle:
      "Textbooks teach you formulas—building real hardware in a team teaches you how to engineer the future.",
    theme: "electric-indigo",
    layout: "split-media",
    heroImage:
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80",
    imageCaption: "Collaborative Robotics Engineering Workbench & Competition Prep",
    speakerNotes:
      "Highlight the 3 Bento cards on the left: 1) Beyond Textbooks, 2) Global University Edge (MIT, top engineering schools love hands-on makers), and 3) Real Engineering Resilience when debugging 5 minutes before a match.",
  },
  {
    index: 2,
    numberLabel: "03",
    title: "Why You Must Learn Robotics",
    subtitle:
      "Where Software Code, Electronic Circuits, and Mechanical Design unite into one superpower.",
    theme: "daylight-studio",
    layout: "interactive-grid",
    heroImage:
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80",
    imageCaption: "Code Meets Physical Reality • Mechatronics Integration",
    speakerNotes:
      "Notice how the slide shifts to our bright Daylight Studio theme for crisp conceptual clarity! Click each of the 4 Bento cards to reveal real-world applications and olympiad opportunities.",
  },
  {
    index: 3,
    numberLabel: "04",
    title: "What Is Your Interest & Future Goal?",
    subtitle:
      "Live Classroom Icebreaker Poll — Raise your hand for your dream engineering path!",
    theme: "electric-indigo",
    layout: "interactive-grid",
    heroImage:
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80",
    imageCaption: "RoboBee Innovators Student Builder Personas",
    speakerNotes:
      "Poll the room! Ask students to raise their hands for Path A (Combat & Sumo), Path B (Autonomous AI), Path C (Smart System Inventor), or Path D (Curious First-Timer). Click the '+1 Vote' buttons live on screen!",
  },
  {
    index: 4,
    numberLabel: "05",
    title: "What Actually IS a Robot?",
    subtitle:
      "Not every machine is a robot! A true robot perceives its environment, makes decisions, and acts physically.",
    theme: "daylight-studio",
    layout: "split-media",
    heroImage:
      "https://images.unsplash.com/photo-1561557944-6e7860d1a7eb?auto=format&fit=crop&w=1200&q=80",
    imageCaption: "Autonomous Rover vs. Manual Remote-Controlled Machines",
    speakerNotes:
      "Emphasize that a remote-controlled car is just an extension of human fingers. Then run the 3-card interactive Classroom Flip Quiz on the right: have students shout 'Robot' or 'Machine' before clicking each card!",
  },
  {
    index: 5,
    numberLabel: "06",
    title: "The Fascinating History of Robotics",
    subtitle:
      "Over 800 years of human ingenuity—from medieval clockwork automata to AI-guided Mars rovers.",
    theme: "daylight-studio",
    layout: "timeline-stepper",
    heroImage:
      "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=1200&q=80",
    imageCaption: "Evolution of Autonomous Machines: 1206 Automata to Modern Planetary Rovers",
    speakerNotes:
      "Step through the 4 historical eras on the horizontal timeline: 1206 (Al-Jazari's programmable automata), 1920 (Karel Čapek coins 'Robota'), 1961 (Unimate first industrial robot arm), and Today (Mars Perseverance & AI quadrupeds).",
  },
  {
    index: 6,
    numberLabel: "07",
    title: "How Robots Work: Sense ➔ Think ➔ Act",
    subtitle:
      "Every autonomous robot follows a continuous 3-stage closed engineering loop modeled on biology.",
    theme: "cyber-blueprint",
    layout: "timeline-stepper",
    heroImage:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    imageCaption: "Closed-Loop Control Architecture: Sensors ➔ Microcontroller ➔ Actuators",
    speakerNotes:
      "We are now in the Cyber Blueprint engineering view! Click through SENSE (Eyes/Ultrasonic & IR), THINK (Brain/Microcontroller C++ logic), and ACT (Muscles/Motor Drivers & Servos) to compare human biology with robot architecture.",
  },
  {
    index: 7,
    numberLabel: "08",
    title: "The 5 Main Parts of Every Robot",
    subtitle:
      "Click each pulsing numbered hotspot (1–5) on the robot blueprint to inspect its core subsystems.",
    theme: "cyber-blueprint",
    layout: "interactive-hotspot",
    heroImage:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    imageCaption: "5-Subsystem Mobile Robot Anatomical Architecture",
    speakerNotes:
      "Click hotspots 1 through 5 on the interactive robot schematic: 1) Controller Brain, 2) Sensor Eyes, 3) Actuators & Motor Drivers, 4) LiPo & Buck Power Heart, and 5) 3D-Printed/Aluminum Chassis Skeleton.",
  },
  {
    index: 8,
    numberLabel: "09",
    title: "Types of Microcontrollers (The Brains)",
    subtitle:
      "Choosing the right silicon brain for starter bots, IoT dashboards, and high-speed PID competition robots.",
    theme: "arduino-teal",
    layout: "interactive-grid",
    heroImage:
      "https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=1200&q=80",
    imageCaption: "Embedded Microcontroller Lineup: AVR, Xtensa Dual-Core, ARM Cortex-M4 & RP2040",
    speakerNotes:
      "Notice our Arduino Teal hardware theme! Compare the 4 essential boards: Arduino Uno/Nano (16MHz 5V classic), ESP32 (240MHz Wi-Fi/BT), STM32 Black Pill (32-bit ARM for fast PID Line Followers), and Raspberry Pi Pico (RP2040).",
  },
  {
    index: 9,
    numberLabel: "10",
    title: "Why We Start With Arduino!",
    subtitle:
      "The undisputed global standard for mastering hardware interfacing, sensors, and embedded C/C++.",
    theme: "arduino-teal",
    layout: "split-media",
    heroImage:
      "https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=1200&q=80",
    imageCaption: "Arduino Uno R3 Development Board • 5V Logic & Plug-and-Play Ecosystem",
    speakerNotes:
      "Explain why every great robotics engineer starts with Arduino: forgiving 5V pins that resist accidental damage, millions of open-source sensor libraries, and clean setup()/loop() C++ fundamentals.",
  },
  {
    index: 10,
    numberLabel: "11",
    title: "Interactive Anatomy of an Arduino Uno",
    subtitle:
      "Click the 5 pulsing hardware pins on the board to master every connector, header, and microchip.",
    theme: "arduino-teal",
    layout: "interactive-hotspot",
    heroImage:
      "https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=1200&q=80",
    imageCaption: "Arduino Uno R3 Interactive Pinout & Silicon Tour",
    speakerNotes:
      "Have students hold up their physical Arduino Uno boards while you click Pins 1 to 5 on screen: 1) USB Port & Power Barrel, 2) Digital & PWM Pins (D0-D13), 3) Analog Inputs (A0-A5), 4) Power Rails (5V/GND/VIN), and 5) ATmega328P.",
  },
  {
    index: 11,
    numberLabel: "12",
    title: "Your Robotics Journey Starts Today!",
    subtitle:
      "Dream. Invent. Experiment. Inspire. — Here is our 3-Phase Roadmap at RoboBee Innovators.",
    theme: "electric-indigo",
    layout: "hero-title",
    heroImage:
      "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1600&q=80",
    imageCaption: "RoboBee Innovators Competition Squads & Autonomous Robotics Track",
    speakerNotes:
      "Close with maximum inspiration! Walk through Phase 1 (Master Electronics & Arduino), Phase 2 (Build & Code Your First Autonomous Bot), and Phase 3 (Compete with RoboBee Innovators in National & Global Olympiads).",
  },
];

export const THEME_PALETTE_CONFIG: Record<
  SlideColorTheme,
  {
    name: string;
    canvasBg: string;
    gridOverlay?: string;
    cardBg: string;
    cardBorder: string;
    cardShadow: string;
    headingColor: string;
    bodyColor: string;
    mutedColor: string;
    accentPrimary: string;
    accentSecondary: string;
    badgeBg: string;
    badgeText: string;
    isLight: boolean;
  }
> = {
  "robobee-dark": {
    name: "RoboBee Solar Dark",
    canvasBg:
      "radial-gradient(ellipse 90% 65% at 50% -10%, rgba(245, 184, 0, 0.16), transparent 75%), linear-gradient(180deg, #0A0E18 0%, #121827 50%, #0A0E18 100%)",
    gridOverlay:
      "radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.06) 1.2px, transparent 1.2px)",
    cardBg: "#141A29",
    cardBorder: "rgba(245, 184, 0, 0.45)",
    cardShadow:
      "0 18px 45px -10px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.08)",
    headingColor: "#FFFFFF",
    bodyColor: "#F1F5F9",
    mutedColor: "#94A3B8",
    accentPrimary: "#F5B800",
    accentSecondary: "#00F5D4",
    badgeBg: "rgba(245, 184, 0, 0.18)",
    badgeText: "#FBBF24",
    isLight: false,
  },
  "electric-indigo": {
    name: "Cyber Twilight",
    canvasBg:
      "radial-gradient(circle at 85% 15%, rgba(99, 102, 241, 0.32) 0%, transparent 55%), radial-gradient(circle at 10% 85%, rgba(0, 245, 212, 0.18) 0%, transparent 45%), linear-gradient(165deg, #0B0D1F 0%, #16153B 45%, #0B0E22 100%)",
    gridOverlay:
      "linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)",
    cardBg: "#171A3B",
    cardBorder: "rgba(129, 140, 248, 0.45)",
    cardShadow:
      "0 20px 50px -10px rgba(0, 0, 0, 0.75), 0 0 25px -4px rgba(99, 102, 241, 0.35)",
    headingColor: "#FFFFFF",
    bodyColor: "#E0E7FF",
    mutedColor: "#A5B4FC",
    accentPrimary: "#00F5D4",
    accentSecondary: "#818CF8",
    badgeBg: "rgba(0, 245, 212, 0.2)",
    badgeText: "#00F5D4",
    isLight: false,
  },
  "daylight-studio": {
    name: "Apple Keynote Pure Light",
    canvasBg:
      "linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 50%, #F1F5F9 100%)",
    gridOverlay:
      "linear-gradient(rgba(15, 23, 42, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(15, 23, 42, 0.04) 1px, transparent 1px)",
    cardBg: "#FFFFFF",
    cardBorder: "#E2E8F0",
    cardShadow:
      "0 18px 45px -12px rgba(15, 23, 42, 0.12), 0 0 0 1.5px rgba(15, 23, 42, 0.06)",
    headingColor: "#0F172A",
    bodyColor: "#1E293B",
    mutedColor: "#475569",
    accentPrimary: "#2563EB",
    accentSecondary: "#7C3AED",
    badgeBg: "rgba(37, 99, 235, 0.12)",
    badgeText: "#1D4ED8",
    isLight: true,
  },
  "arduino-teal": {
    name: "Hardware Lab Emerald",
    canvasBg:
      "radial-gradient(circle at 85% 15%, rgba(45, 212, 191, 0.22) 0%, transparent 50%), linear-gradient(160deg, #031F1A 0%, #08372F 50%, #031B17 100%)",
    gridOverlay:
      "linear-gradient(rgba(94, 234, 212, 0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(94, 234, 212, 0.07) 1px, transparent 1px)",
    cardBg: "#0B2D26",
    cardBorder: "rgba(45, 212, 191, 0.45)",
    cardShadow:
      "0 20px 50px -10px rgba(1, 28, 24, 0.8), 0 0 25px -4px rgba(45, 212, 191, 0.35)",
    headingColor: "#FFFFFF",
    bodyColor: "#ECFDF5",
    mutedColor: "#6EE7B7",
    accentPrimary: "#FACC15",
    accentSecondary: "#2DD4BF",
    badgeBg: "rgba(250, 204, 21, 0.22)",
    badgeText: "#FACC15",
    isLight: false,
  },
  "cyber-blueprint": {
    name: "Arcade Blueprint Neon",
    canvasBg:
      "radial-gradient(circle at 85% 15%, rgba(56, 189, 248, 0.22) 0%, transparent 50%), linear-gradient(165deg, #051630 0%, #0B254E 50%, #05152D 100%)",
    gridOverlay:
      "linear-gradient(rgba(56, 189, 248, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(56, 189, 248, 0.1) 1px, transparent 1px)",
    cardBg: "#0B2244",
    cardBorder: "rgba(56, 189, 248, 0.5)",
    cardShadow:
      "0 20px 50px -10px rgba(0, 10, 26, 0.8), 0 0 25px -4px rgba(56, 189, 248, 0.35)",
    headingColor: "#FFFFFF",
    bodyColor: "#E0F2FE",
    mutedColor: "#7DD3FC",
    accentPrimary: "#FB923C",
    accentSecondary: "#38BDF8",
    badgeBg: "rgba(251, 146, 60, 0.22)",
    badgeText: "#FB923C",
    isLight: false,
  },
};

/**
 * Custom Multi-Layered Vector Hardware Illustration Fallback
 * Guarantees zero broken image icons even if offline or blocked.
 */
function FallbackHardwareArtwork({
  variant,
  caption,
}: {
  variant: "robot-arm" | "arduino" | "rover" | "team" | "mcu";
  caption: string;
}) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        minHeight: "260px",
        background:
          variant === "arduino"
            ? "linear-gradient(135deg, #042F2E 0%, #0F766E 100%)"
            : "linear-gradient(135deg, #0F172A 0%, #1E1B4B 60%, #0C4A6E 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <svg
        viewBox="0 0 600 360"
        style={{ width: "100%", maxWidth: "460px", height: "auto" }}
      >
        <defs>
          <linearGradient id="cyanGlow" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#00F5D4" />
            <stop offset="100%" stopColor="#38BDF8" />
          </linearGradient>
          <linearGradient id="amberGlow" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FBBF24" />
            <stop offset="100%" stopColor="#F97316" />
          </linearGradient>
        </defs>
        {/* Subtle technical grid */}
        <g stroke="rgba(255,255,255,0.08)" strokeWidth="1">
          <line x1="0" y1="60" x2="600" y2="60" />
          <line x1="0" y1="120" x2="600" y2="120" />
          <line x1="0" y1="180" x2="600" y2="180" />
          <line x1="0" y1="240" x2="600" y2="240" />
          <line x1="0" y1="300" x2="600" y2="300" />
          <line x1="120" y1="0" x2="120" y2="360" />
          <line x1="240" y1="0" x2="240" y2="360" />
          <line x1="360" y1="0" x2="360" y2="360" />
          <line x1="480" y1="0" x2="480" y2="360" />
        </g>

        {variant === "arduino" ? (
          <g>
            {/* Arduino Uno PCB Vector */}
            <rect
              x="90"
              y="50"
              width="420"
              height="260"
              rx="18"
              fill="#0D9488"
              stroke="#5EEAD4"
              strokeWidth="3"
            />
            {/* USB Port */}
            <rect
              x="65"
              y="85"
              width="55"
              height="65"
              rx="6"
              fill="#CBD5E1"
              stroke="#475569"
              strokeWidth="2"
            />
            {/* DC Barrel Jack */}
            <rect
              x="65"
              y="215"
              width="60"
              height="55"
              rx="6"
              fill="#1E293B"
              stroke="#64748B"
              strokeWidth="2"
            />
            {/* Digital Header Strip */}
            <rect x="160" y="62" width="310" height="22" rx="4" fill="#0F172A" />
            <text x="175" y="77" fill="#5EEAD4" fontSize="11" fontWeight="bold" fontFamily="monospace">
              D13 D12 ~D11 ~D10 ~D9 D8   D7 ~D6 ~D5 D4 ~D3 D2 TX RX
            </text>
            {/* ATmega328P DIP Chip */}
            <rect
              x="250"
              y="165"
              width="210"
              height="62"
              rx="6"
              fill="#1E293B"
              stroke="#FBBF24"
              strokeWidth="2.5"
            />
            <text x="275" y="200" fill="#FBBF24" fontSize="14" fontWeight="bold" fontFamily="monospace">
              ATmega328P • 16MHz
            </text>
            {/* Power & Analog Headers */}
            <rect x="160" y="276" width="140" height="22" rx="4" fill="#0F172A" />
            <text x="172" y="291" fill="#FBBF24" fontSize="11" fontWeight="bold" fontFamily="monospace">
              IOREF RST 3.3V 5V GND VIN
            </text>
            <rect x="320" y="276" width="150" height="22" rx="4" fill="#0F172A" />
            <text x="335" y="291" fill="#38BDF8" fontSize="11" fontWeight="bold" fontFamily="monospace">
              A0  A1  A2  A3  A4  A5
            </text>
            {/* Glowing Pin 13 LED */}
            <circle cx="240" cy="122" r="10" fill="#FBBF24" />
            <circle cx="240" cy="122" r="18" fill="rgba(251, 191, 36, 0.35)" />
            <text x="265" y="127" fill="#FFFFFF" fontSize="13" fontWeight="bold">
              ONBOARD LED (L) + RX/TX
            </text>
          </g>
        ) : (
          <g>
            {/* Autonomous Robot & Sensor Wave Illustration */}
            <rect
              x="160"
              y="110"
              width="280"
              height="150"
              rx="24"
              fill="#1E293B"
              stroke="url(#cyanGlow)"
              strokeWidth="3"
            />
            {/* Wheels */}
            <rect x="130" y="125" width="26" height="55" rx="8" fill="#F59E0B" />
            <rect x="130" y="195" width="26" height="55" rx="8" fill="#F59E0B" />
            <rect x="444" y="125" width="26" height="55" rx="8" fill="#F59E0B" />
            <rect x="444" y="195" width="26" height="55" rx="8" fill="#F59E0B" />
            {/* Ultrasonic Sonar Eyes */}
            <circle cx="260" cy="110" r="22" fill="#0F172A" stroke="#00F5D4" strokeWidth="3" />
            <circle cx="340" cy="110" r="22" fill="#0F172A" stroke="#00F5D4" strokeWidth="3" />
            {/* Sonar Waves */}
            <path
              d="M 245 70 Q 300 40 355 70"
              fill="none"
              stroke="#00F5D4"
              strokeWidth="3"
              strokeDasharray="6 4"
            />
            <path
              d="M 220 48 Q 300 12 380 48"
              fill="none"
              stroke="#38BDF8"
              strokeWidth="2.5"
              strokeDasharray="6 4"
            />
            {/* Brain Core */}
            <rect
              x="215"
              y="150"
              width="170"
              height="75"
              rx="10"
              fill="#0F766E"
              stroke="#5EEAD4"
              strokeWidth="2"
            />
            <text x="235" y="185" fill="#FFFFFF" fontSize="14" fontWeight="bold" fontFamily="monospace">
              SENSE ➔ THINK ➔ ACT
            </text>
            <text x="242" y="207" fill="#FEF3C7" fontSize="11" fontFamily="monospace">
              ROBOBEE AUTONOMOUS CORE
            </text>
          </g>
        )}
      </svg>
      <div
        style={{
          marginTop: "0.5rem",
          fontSize: "0.78rem",
          color: "#E0E7FF",
          fontWeight: 700,
          textAlign: "center",
        }}
      >
        {caption}
      </div>
    </div>
  );
}

/**
 * Presentation Media Frame with Rounded Corners, Glowing Border,
 * Floating Glassmorphic Caption Pill, Fullscreen Zoom Badge, and Strict onError SVG Fallback.
 */
export function PresentationMediaFrame({
  src,
  alt,
  caption,
  fallbackVariant = "robot-arm",
  height = "340px",
  accentColor = "#00F5D4",
  onZoom,
}: {
  src: string;
  alt: string;
  caption: string;
  fallbackVariant?: "robot-arm" | "arduino" | "rover" | "team" | "mcu";
  height?: string;
  accentColor?: string;
  onZoom?: (src: string, caption: string) => void;
}) {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      onClick={() => onZoom && onZoom(src, caption)}
      style={{
        position: "relative",
        width: "100%",
        height,
        borderRadius: "20px",
        overflow: "hidden",
        border: `2px solid ${accentColor}`,
        boxShadow: `0 20px 50px -12px rgba(0, 0, 0, 0.45), 0 0 24px -6px ${accentColor}`,
        cursor: onZoom ? "zoom-in" : "default",
        background: "#0F172A",
      }}
    >
      {!imgError ? (
        <img
          src={src}
          alt={alt}
          onError={() => setImgError(true)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        />
      ) : (
        <FallbackHardwareArtwork variant={fallbackVariant} caption={caption} />
      )}

      {/* Subtle Bottom Gradient Vignette for Caption Readability */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to top, rgba(15, 23, 42, 0.88) 0%, rgba(15, 23, 42, 0.15) 45%, transparent 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Top-Right Click to Zoom Fullscreen Magnifier Badge */}
      {onZoom && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onZoom(src, caption);
          }}
          style={{
            position: "absolute",
            top: "14px",
            right: "14px",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            padding: "0.4rem 0.75rem",
            borderRadius: "999px",
            background: "rgba(15, 23, 42, 0.78)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255, 255, 255, 0.28)",
            color: "#FFFFFF",
            fontSize: "0.74rem",
            fontWeight: 700,
            cursor: "pointer",
            zIndex: 2,
          }}
        >
          <ZoomIn size={14} color={accentColor} />
          <span>Click to Zoom Fullscreen</span>
        </button>
      )}

      {/* Bottom-Left Floating Glassmorphic Caption Pill */}
      <div
        style={{
          position: "absolute",
          bottom: "14px",
          left: "14px",
          right: "14px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "0.5rem",
          padding: "0.55rem 0.95rem",
          borderRadius: "12px",
          background: "rgba(15, 23, 42, 0.78)",
          backdropFilter: "blur(14px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          color: "#F8FAFC",
          fontSize: "0.8rem",
          fontWeight: 600,
        }}
      >
        <span>{caption}</span>
        <span
          style={{
            fontSize: "0.68rem",
            fontWeight: 800,
            color: accentColor,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            flexShrink: 0,
          }}
        >
          HD Visual
        </span>
      </div>
    </div>
  );
}

interface Class1WorkshopDeckProps {
  lesson: RoboticsLesson;
  currentSlide: number;
  setCurrentSlide: (slide: number) => void;
  fontScale: number;
  activeThemeOverride?: SlideColorTheme | "auto";
  onOpenZoom?: (src: string, caption: string) => void;
}

export function Class1WorkshopDeck({
  currentSlide,
  setCurrentSlide,
  fontScale,
  activeThemeOverride = "auto",
  onOpenZoom,
}: Class1WorkshopDeckProps) {
  const slideMeta = CLASS_01_SLIDES[currentSlide] || CLASS_01_SLIDES[0];
  const resolvedThemeKey: SlideColorTheme =
    activeThemeOverride === "auto" ? slideMeta.theme : activeThemeOverride;
  const palette = THEME_PALETTE_CONFIG[resolvedThemeKey];

  // Fullscreen Image Lightbox State (internal fallback if parent doesn't supply onOpenZoom)
  const [lightboxMedia, setLightboxMedia] = useState<{
    src: string;
    caption: string;
  } | null>(null);

  const handleZoom = (src: string, caption: string) => {
    if (onOpenZoom) {
      onOpenZoom(src, caption);
    } else {
      setLightboxMedia({ src, caption });
    }
  };

  // Slide 01: HUD Boot animation state
  const [bootingEngine, setBootingEngine] = useState(false);
  const handleStartEngine = () => {
    setBootingEngine(true);
    setTimeout(() => {
      setBootingEngine(false);
      setCurrentSlide(1);
    }, 550);
  };

  // Slide 03: Interactive Bento Grid Expanded Card
  const [expandedWhyCard, setExpandedWhyCard] = useState<number>(0);

  // Slide 04: Classroom Icebreaker Poll (+1 live student hand tally)
  const [pollVotes, setPollVotes] = useState<number[]>([8, 6, 5, 9]);
  const [selectedPollCard, setSelectedPollCard] = useState<number | null>(null);

  // Slide 05: Machine vs. Robot 3-Card Flip Quiz
  const [revealedQuizCards, setRevealedQuizCards] = useState<Record<number, boolean>>({});

  // Slide 06: History of Robotics Timeline Stepper
  const [historyEraIdx, setHistoryEraIdx] = useState<number>(0);

  // Slide 07: Sense -> Think -> Act Pipeline Stepper
  const [loopStageIdx, setLoopStageIdx] = useState<number>(0);

  // Slide 08: 5 Main Parts of Every Robot Pulsing Hotspot (1..5)
  const [robotPartHotspot, setRobotPartHotspot] = useState<number>(0);

  // Slide 09: Microcontroller Comparison Active Card
  const [selectedMcuIdx, setSelectedMcuIdx] = useState<number>(0);

  // Slide 11: Interactive Anatomy of an Arduino Uno Pulsing Hotspot (1..5)
  const [arduinoPinHotspot, setArduinoPinHotspot] = useState<number>(0);

  const scaleMultiplier = fontScale === 100 ? 1 : fontScale === 125 ? 1.12 : 1.22;

  return (
    <div
      style={{
        width: "100%",
        minHeight: "calc(100vh - 150px)",
        borderRadius: "24px",
        background: palette.canvasBg,
        backgroundImage: palette.gridOverlay
          ? `${palette.gridOverlay}, ${palette.canvasBg}`
          : palette.canvasBg,
        backgroundSize: palette.gridOverlay ? "24px 24px, 100% 100%" : "100% 100%",
        color: palette.bodyColor,
        padding: "2rem 2.4rem",
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 25px 60px -15px rgba(0, 0, 0, 0.55)",
        border: `1px solid ${palette.cardBorder}`,
        transition: "background 0.45s ease, color 0.3s ease",
        fontSize: `${scaleMultiplier}rem`,
      }}
    >
      {/* Top Slide Header Badge Row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "0.75rem",
          marginBottom: "1.35rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", flexWrap: "wrap" }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              padding: "0.35rem 0.9rem",
              borderRadius: "999px",
              background: palette.badgeBg,
              color: palette.badgeText,
              border: `1px solid ${palette.accentPrimary}`,
              fontSize: "0.76rem",
              fontWeight: 900,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            <Sparkles size={13} />
            CLASS 01 • SLIDE {slideMeta.numberLabel} OF 12
          </span>

          <span
            style={{
              padding: "0.3rem 0.75rem",
              borderRadius: "999px",
              background: palette.isLight
                ? "rgba(15, 23, 42, 0.06)"
                : "rgba(255, 255, 255, 0.08)",
              color: palette.headingColor,
              fontSize: "0.72rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Theme: {palette.name} • Layout: {slideMeta.layout}
          </span>
        </div>

        <div
          style={{
            fontSize: "0.78rem",
            fontWeight: 800,
            color: palette.mutedColor,
            letterSpacing: "0.04em",
          }}
        >
          ROBOBEE INNOVATORS • FOUNDATION TRACK
        </div>
      </div>

      {/* =====================================================================
          SLIDE 01: WELCOME TO THE WORLD OF ROBOTICS (Theme: electric-indigo | Layout: hero-title)
         ===================================================================== */}
      {currentSlide === 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
            gap: "2rem",
            alignItems: "center",
            minHeight: "500px",
          }}
        >
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.45rem 1rem",
                borderRadius: "999px",
                background: "rgba(0, 245, 212, 0.15)",
                border: "1px solid #00F5D4",
                color: "#00F5D4",
                fontWeight: 900,
                fontSize: "0.82rem",
                letterSpacing: "0.08em",
                marginBottom: "1.1rem",
              }}
            >
              <Rocket size={16} /> CLASS 01 • FOUNDATION MASTERCLASS
            </div>

            <h1
              style={{
                fontSize: "clamp(2.3rem, 4vw, 3.6rem)",
                fontWeight: 900,
                lineHeight: 1.08,
                color: "#FFFFFF",
                margin: "0 0 1rem 0",
                letterSpacing: "-0.02em",
              }}
            >
              Welcome to{" "}
              <span
                style={{
                  background: "linear-gradient(90deg, #00F5D4 0%, #38BDF8 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Robotics &amp; Future Engineering
              </span>
            </h1>

            <p
              style={{
                fontSize: "1.18rem",
                lineHeight: 1.55,
                color: "#E0E7FF",
                margin: "0 0 1.6rem 0",
                maxWidth: "600px",
              }}
            >
              From Consumer of Technology to Creator of Autonomous Machines — discover how
              sensors, microcontrollers, and C++ code bring physical hardware to life.
            </p>

            {/* 3 Visual Bento Quick Pills */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "0.85rem",
                marginBottom: "1.8rem",
              }}
            >
              {[
                {
                  icon: <Eye size={18} color="#00F5D4" />,
                  title: "Sense & Perceive",
                  desc: "Sonar, LiDAR, IR & AI Vision",
                },
                {
                  icon: <Cpu size={18} color="#38BDF8" />,
                  title: "Think in Code",
                  desc: "Arduino, ESP32 & STM32 Brains",
                },
                {
                  icon: <Zap size={18} color="#FBBF24" />,
                  title: "Act Physically",
                  desc: "Motors, Servos & Autonomous Bots",
                },
              ].map((bento, idx) => (
                <div
                  key={idx}
                  style={{
                    background: palette.cardBg,
                    border: `1px solid ${palette.cardBorder}`,
                    backdropFilter: "blur(16px)",
                    borderRadius: "16px",
                    padding: "0.9rem",
                  }}
                >
                  <div style={{ marginBottom: "0.35rem" }}>{bento.icon}</div>
                  <div style={{ fontWeight: 800, color: "#FFFFFF", fontSize: "0.9rem" }}>
                    {bento.title}
                  </div>
                  <div style={{ fontSize: "0.76rem", color: "#E0E7FF", marginTop: "0.15rem" }}>
                    {bento.desc}
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={handleStartEngine}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "1rem 2rem",
                borderRadius: "999px",
                border: "none",
                background: bootingEngine
                  ? "linear-gradient(90deg, #10B981 0%, #00F5D4 100%)"
                  : "linear-gradient(90deg, #00F5D4 0%, #38BDF8 100%)",
                color: "#0F172A",
                fontWeight: 900,
                fontSize: "1.05rem",
                cursor: "pointer",
                boxShadow: "0 0 30px rgba(0, 245, 212, 0.45)",
                transform: bootingEngine ? "scale(1.04)" : "scale(1)",
                transition: "all 0.25s ease",
              }}
            >
              <Rocket size={20} />
              <span>
                {bootingEngine
                  ? "INITIALIZING ROBOBEE HUD..."
                  : "Launch Class Engine ➔"}
              </span>
            </button>
          </div>

          <PresentationMediaFrame
            src={slideMeta.heroImage}
            alt="Welcome to the World of Robotics"
            caption={slideMeta.imageCaption}
            fallbackVariant="robot-arm"
            height="430px"
            accentColor="#00F5D4"
            onZoom={handleZoom}
          />
        </div>
      )}

      {/* =====================================================================
          SLIDE 02: WHY EXTRACURRICULAR ACTIVITIES MATTER (Theme: electric-indigo | Layout: split-media)
         ===================================================================== */}
      {currentSlide === 1 && (
        <div>
          <div style={{ marginBottom: "1.5rem" }}>
            <h2
              style={{
                fontSize: "clamp(1.9rem, 3.2vw, 2.75rem)",
                fontWeight: 900,
                color: palette.headingColor,
                margin: "0 0 0.4rem 0",
              }}
            >
              Why Extracurricular Activities Matter
            </h2>
            <p style={{ fontSize: "1.05rem", color: palette.bodyColor, margin: 0 }}>
              {slideMeta.subtitle}
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
              gap: "1.75rem",
              alignItems: "stretch",
            }}
          >
            {/* Left: 3 Vibrant Glass Bento Cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {[
                {
                  badge: "01 • HANDS-ON MASTERY",
                  icon: <Wrench size={22} color="#00F5D4" />,
                  title: "Beyond Textbook Theory",
                  desc: "Exam grades show you can memorize formulas; building and wiring a working robot proves you can solve real-world physical problems.",
                },
                {
                  badge: "02 • PORTFOLIO POWER",
                  icon: <Globe size={22} color="#38BDF8" />,
                  title: "Global University & Career Edge",
                  desc: "Top universities and global tech pioneers look for hands-on makers, robotics olympiad competitors, and collaborative team leaders.",
                },
                {
                  badge: "03 • GRIT & TEAMWORK",
                  icon: <Trophy size={22} color="#FBBF24" />,
                  title: "Real Engineering Resilience",
                  desc: "Debugging a sensor array 5 minutes before a tournament match builds unshakeable confidence and problem-solving grit under pressure.",
                },
              ].map((card, idx) => (
                <div
                  key={idx}
                  style={{
                    background: palette.cardBg,
                    border: `1px solid ${palette.cardBorder}`,
                    backdropFilter: "blur(16px)",
                    borderRadius: "18px",
                    padding: "1.2rem 1.35rem",
                    boxShadow: palette.cardShadow,
                    display: "flex",
                    gap: "1rem",
                    alignItems: "flex-start",
                  }}
                >
                  <div
                    style={{
                      width: "46px",
                      height: "46px",
                      borderRadius: "12px",
                      background: "rgba(0, 245, 212, 0.14)",
                      border: "1px solid rgba(0, 245, 212, 0.35)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {card.icon}
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: "0.7rem",
                        fontWeight: 900,
                        color: "#00F5D4",
                        letterSpacing: "0.08em",
                        marginBottom: "0.2rem",
                      }}
                    >
                      {card.badge}
                    </div>
                    <div
                      style={{
                        fontSize: "1.18rem",
                        fontWeight: 800,
                        color: "#FFFFFF",
                        marginBottom: "0.3rem",
                      }}
                    >
                      {card.title}
                    </div>
                    <div style={{ fontSize: "0.95rem", color: "#E0E7FF", lineHeight: 1.5 }}>
                      {card.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right: High-Res Team Robotics Photo */}
            <PresentationMediaFrame
              src={slideMeta.heroImage}
              alt="Students collaborating on a robotics competition table"
              caption={slideMeta.imageCaption}
              fallbackVariant="team"
              height="100%"
              accentColor="#38BDF8"
              onZoom={handleZoom}
            />
          </div>
        </div>
      )}

      {/* =====================================================================
          SLIDE 03: WHY YOU MUST LEARN ROBOTICS (Theme: daylight-studio | Layout: interactive-grid)
         ===================================================================== */}
      {currentSlide === 2 && (
        <div>
          <div style={{ marginBottom: "1.4rem" }}>
            <h2
              style={{
                fontSize: "clamp(1.9rem, 3.2vw, 2.75rem)",
                fontWeight: 900,
                color: palette.headingColor,
                margin: "0 0 0.35rem 0",
              }}
            >
              Why You Must Learn Robotics
            </h2>
            <p style={{ fontSize: "1.05rem", color: palette.bodyColor, margin: 0 }}>
              Click any of the 4 Bento Pillars below to explore real-world engineering impact:
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "1.15rem",
              marginBottom: "1.35rem",
            }}
          >
            {[
              {
                num: "01",
                title: "Code Meets Physical World",
                short: "The Ultimate Superpower combining Mechanical CAD, Electronics, and Software Code.",
                example:
                  "Real-World Impact: Instead of code staying trapped inside a laptop screen, a single line of C++ physically spins motors, reads laser sensors, and moves robotic grippers!",
                color: "#2563EB",
                image:
                  "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=900&q=80",
              },
              {
                num: "02",
                title: "Future-Proof AI & Automation",
                short: "Autonomous vehicles, surgical arms, and smart factories are transforming every industry.",
                example:
                  "Real-World Impact: From precision agricultural drones in Bangladesh to automated warehouse rovers and robotic surgery, mechatronics literacy is the #1 future engineering skill.",
                color: "#7C3AED",
                image:
                  "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=900&q=80",
              },
              {
                num: "03",
                title: "National & Global Olympiads",
                short: "Compete in Sumo Bot, High-Speed Line Follower, Robo Soccer, and Invention Olympiads.",
                example:
                  "Real-World Impact: Represent RoboBee Innovators at national university techfests, World Robot Olympiad (WRO), and international autonomous robotics challenges!",
                color: "#F97316",
                image:
                  "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=900&q=80",
              },
              {
                num: "04",
                title: "Invent Real Solutions",
                short: "Turn an idea sketched in your notebook into a moving, thinking machine on your desk.",
                example:
                  "Real-World Impact: Build fire-detecting rescue rovers, smart irrigation controllers for farmers, or ultrasonic assistive glasses for the visually impaired.",
                color: "#059669",
                image:
                  "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=900&q=80",
              },
            ].map((card, idx) => {
              const isSelected = expandedWhyCard === idx;
              return (
                <div
                  key={idx}
                  onClick={() => setExpandedWhyCard(idx)}
                  style={{
                    background: palette.cardBg,
                    border: `2px solid ${isSelected ? card.color : palette.cardBorder}`,
                    borderRadius: "18px",
                    padding: "1.25rem",
                    boxShadow: isSelected
                      ? `0 22px 45px -12px ${card.color}33`
                      : palette.cardShadow,
                    cursor: "pointer",
                    transition: "all 0.25s ease",
                    transform: isSelected ? "translateY(-4px)" : "none",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "0.75rem",
                    }}
                  >
                    <span
                      style={{
                        padding: "0.25rem 0.7rem",
                        borderRadius: "999px",
                        background: `${card.color}18`,
                        color: card.color,
                        fontWeight: 900,
                        fontSize: "0.78rem",
                      }}
                    >
                      PILLAR {card.num}
                    </span>
                    <span
                      style={{
                        fontSize: "0.74rem",
                        fontWeight: 800,
                        color: card.color,
                      }}
                    >
                      {isSelected ? "● Active Spotlight" : "Click to Expand ➔"}
                    </span>
                  </div>

                  <h3
                    style={{
                      fontSize: "1.22rem",
                      fontWeight: 900,
                      color: palette.headingColor,
                      margin: "0 0 0.45rem 0",
                    }}
                  >
                    {card.title}
                  </h3>
                  <p
                    style={{
                      fontSize: "0.92rem",
                      color: palette.bodyColor,
                      lineHeight: 1.5,
                      margin: 0,
                    }}
                  >
                    {card.short}
                  </p>

                  {isSelected && (
                    <div
                      style={{
                        marginTop: "0.9rem",
                        paddingTop: "0.85rem",
                        borderTop: `1px solid ${palette.cardBorder}`,
                        fontSize: "0.86rem",
                        color: "#1E293B",
                        fontWeight: 600,
                        lineHeight: 1.5,
                      }}
                    >
                      {card.example}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <PresentationMediaFrame
            src={slideMeta.heroImage}
            alt="Mechatronics and Robotics Engineering"
            caption={slideMeta.imageCaption}
            fallbackVariant="robot-arm"
            height="220px"
            accentColor="#2563EB"
            onZoom={handleZoom}
          />
        </div>
      )}

      {/* =====================================================================
          SLIDE 04: WHAT IS YOUR INTEREST & FUTURE GOAL? (Theme: electric-indigo | Layout: interactive-grid)
         ===================================================================== */}
      {currentSlide === 3 && (
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              flexWrap: "wrap",
              gap: "1rem",
              marginBottom: "1.4rem",
            }}
          >
            <div>
              <h2
                style={{
                  fontSize: "clamp(1.9rem, 3.2vw, 2.75rem)",
                  fontWeight: 900,
                  color: palette.headingColor,
                  margin: "0 0 0.35rem 0",
                }}
              >
                Student Icebreaker: What Is Your Future Goal?
              </h2>
              <p style={{ fontSize: "1.05rem", color: palette.bodyColor, margin: 0 }}>
                Raise your hand for the builder persona that excites you most! Instructor clicks{" "}
                <strong style={{ color: "#00F5D4" }}>+1 Vote</strong> to tally the room live:
              </p>
            </div>

            <button
              type="button"
              onClick={() => setPollVotes([0, 0, 0, 0])}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                padding: "0.45rem 0.9rem",
                borderRadius: "999px",
                background: "rgba(255, 255, 255, 0.1)",
                border: "1px solid rgba(255, 255, 255, 0.22)",
                color: "#E0E7FF",
                fontSize: "0.78rem",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              <RotateCcw size={14} /> Reset Classroom Tally
            </button>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "1.15rem",
            }}
          >
            {[
              {
                path: "PATH A",
                title: "Combat & Sumo Builder",
                quote:
                  "“I want to build fast Mini-Sumo Bots, Robo-Soccer machines, and win tournament trophies!”",
                focus: "High-torque gear motors, armor CAD & tactical sensors",
                accent: "#00F5D4",
              },
              {
                path: "PATH B",
                title: "Autonomous AI Coder",
                quote:
                  "“I want to make robots see with cameras, solve mazes, and navigate on their own!”",
                focus: "PID Line Followers, Ultrasonic mapping & Computer Vision",
                accent: "#38BDF8",
              },
              {
                path: "PATH C",
                title: "Smart System Inventor",
                quote:
                  "“I want to build automated farming systems, medical arms, and smart IoT machines!”",
                focus: "ESP32 Wi-Fi dashboards, servo robotic arms & environmental sensors",
                accent: "#FBBF24",
              },
              {
                path: "PATH D",
                title: "Curious First-Timer",
                quote:
                  "“I have zero experience, and I want to see how electronics and code come alive!”",
                focus: "Step-by-step breadboard circuits, LEDs & your first Arduino C++ sketch",
                accent: "#F472B6",
              },
            ].map((item, idx) => {
              const totalVotes = Math.max(
                1,
                pollVotes.reduce((a, b) => a + b, 0)
              );
              const pct = Math.round((pollVotes[idx] / totalVotes) * 100);
              const isHighlighted = selectedPollCard === idx;

              return (
                <div
                  key={idx}
                  onClick={() => setSelectedPollCard(idx)}
                  style={{
                    background: palette.cardBg,
                    border: `2px solid ${isHighlighted ? item.accent : palette.cardBorder}`,
                    backdropFilter: "blur(16px)",
                    borderRadius: "20px",
                    padding: "1.35rem",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    boxShadow: isHighlighted
                      ? `0 0 32px ${item.accent}44`
                      : palette.cardShadow,
                    cursor: "pointer",
                    transition: "all 0.25s ease",
                  }}
                >
                  <div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "0.75rem",
                      }}
                    >
                      <span
                        style={{
                          padding: "0.25rem 0.7rem",
                          borderRadius: "999px",
                          background: `${item.accent}22`,
                          color: item.accent,
                          fontWeight: 900,
                          fontSize: "0.76rem",
                          border: `1px solid ${item.accent}`,
                        }}
                      >
                        {item.path}
                      </span>
                      <span
                        style={{
                          fontFamily: "monospace",
                          fontSize: "1.15rem",
                          fontWeight: 900,
                          color: item.accent,
                        }}
                      >
                        {pollVotes[idx]} Hands ({pct}%)
                      </span>
                    </div>

                    <h3
                      style={{
                        fontSize: "1.28rem",
                        fontWeight: 900,
                        color: "#FFFFFF",
                        margin: "0 0 0.5rem 0",
                      }}
                    >
                      {item.title}
                    </h3>

                    <p
                      style={{
                        fontSize: "0.95rem",
                        color: "#E0E7FF",
                        fontStyle: "italic",
                        lineHeight: 1.5,
                        margin: "0 0 0.85rem 0",
                      }}
                    >
                      {item.quote}
                    </p>

                    <div
                      style={{
                        fontSize: "0.8rem",
                        color: "#A5B4FC",
                        marginBottom: "1rem",
                      }}
                    >
                      <strong style={{ color: "#FFFFFF" }}>Core Tech:</strong> {item.focus}
                    </div>
                  </div>

                  <div>
                    {/* Progress Bar */}
                    <div
                      style={{
                        width: "100%",
                        height: "8px",
                        borderRadius: "999px",
                        background: "rgba(255, 255, 255, 0.12)",
                        overflow: "hidden",
                        marginBottom: "0.85rem",
                      }}
                    >
                      <div
                        style={{
                          width: `${pct}%`,
                          height: "100%",
                          background: item.accent,
                          transition: "width 0.3s ease",
                        }}
                      />
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPollCard(idx);
                        setPollVotes((prev) =>
                          prev.map((v, i) => (i === idx ? v + 1 : v))
                        );
                      }}
                      style={{
                        width: "100%",
                        padding: "0.65rem",
                        borderRadius: "12px",
                        border: `1px solid ${item.accent}`,
                        background: `${item.accent}26`,
                        color: "#FFFFFF",
                        fontWeight: 800,
                        fontSize: "0.88rem",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "0.4rem",
                        cursor: "pointer",
                      }}
                    >
                      <Plus size={16} color={item.accent} /> +1 Student Hand Tally
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =====================================================================
          SLIDE 05: WHAT ACTUALLY IS A ROBOT? (Theme: daylight-studio | Layout: split-media + Quiz)
         ===================================================================== */}
      {currentSlide === 4 && (
        <div>
          <div style={{ marginBottom: "1.35rem" }}>
            <h2
              style={{
                fontSize: "clamp(1.9rem, 3.2vw, 2.75rem)",
                fontWeight: 900,
                color: palette.headingColor,
                margin: "0 0 0.35rem 0",
              }}
            >
              What Actually IS a Robot?
            </h2>
            <p style={{ fontSize: "1.05rem", color: palette.bodyColor, margin: 0 }}>
              {slideMeta.subtitle}
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
              gap: "1.6rem",
              alignItems: "start",
            }}
          >
            {/* Left: Visual Definition + High-Res Comparison Photo */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div
                style={{
                  background: "#FFFFFF",
                  border: "2px solid #2563EB",
                  borderRadius: "18px",
                  padding: "1.2rem 1.35rem",
                  boxShadow: palette.cardShadow,
                }}
              >
                <div
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 900,
                    color: "#2563EB",
                    letterSpacing: "0.08em",
                    marginBottom: "0.3rem",
                  }}
                >
                  THE GOLDEN ENGINEERING DEFINITION
                </div>
                <div
                  style={{
                    fontSize: "1.12rem",
                    fontWeight: 800,
                    color: "#0F172A",
                    lineHeight: 1.45,
                  }}
                >
                  A true robot is an{" "}
                  <span style={{ color: "#2563EB" }}>autonomous or semi-autonomous machine</span>{" "}
                  that Senses its environment, Thinks with programmed logic, and Acts physically.
                </div>
              </div>

              <PresentationMediaFrame
                src={slideMeta.heroImage}
                alt="Autonomous Robot vs Regular Machine"
                caption={slideMeta.imageCaption}
                fallbackVariant="rover"
                height="280px"
                accentColor="#2563EB"
                onZoom={handleZoom}
              />
            </div>

            {/* Right: Interactive 3-Card Classroom Flip Quiz */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.95rem" }}>
              <div
                style={{
                  fontSize: "0.85rem",
                  fontWeight: 900,
                  color: "#7C3AED",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                🎯 Interactive Classroom Quiz — Click Each Card to Reveal Verdict!
              </div>

              {[
                {
                  name: "1. Kitchen Blender / Washing Machine",
                  prompt: "Spins a high-speed motor when you press a button or set a fixed timer.",
                  isRobot: false,
                  verdictTitle: "REGULAR MACHINE (NOT A ROBOT)",
                  verdictReason:
                    "It follows a blind mechanical timer—it cannot sense obstacles or make autonomous decisions.",
                },
                {
                  name: "2. Standard Remote-Controlled (RC) Toy Car",
                  prompt: "Drives fast when a human pushes the wireless joystick left or right.",
                  isRobot: false,
                  verdictTitle: "REMOTE-CONTROLLED MACHINE",
                  verdictReason:
                    "A human brain makes 100% of the steering decisions. Without onboard sensors and autonomous code, it's an extension of your fingers!",
                },
                {
                  name: "3. Autonomous Line Follower / Obstacle Rover",
                  prompt: "Reads IR & Ultrasonic sensors, calculates path error in C++, and steers motors automatically.",
                  isRobot: true,
                  verdictTitle: "TRUE AUTONOMOUS ROBOT!",
                  verdictReason:
                    "It Senses lines/walls, Thinks with an onboard microcontroller, and Acts via motor drivers with zero human hands!",
                },
              ].map((q, idx) => {
                const isRevealed = !!revealedQuizCards[idx];
                const burstColor = q.isRobot ? "#10B981" : "#F43F5E";

                return (
                  <div
                    key={idx}
                    onClick={() =>
                      setRevealedQuizCards((prev) => ({ ...prev, [idx]: !prev[idx] }))
                    }
                    style={{
                      background: isRevealed
                        ? q.isRobot
                          ? "#ECFDF5"
                          : "#FFF1F2"
                        : "#FFFFFF",
                      border: `2px solid ${isRevealed ? burstColor : "#C7D2FE"}`,
                      borderRadius: "18px",
                      padding: "1.1rem 1.25rem",
                      boxShadow: palette.cardShadow,
                      cursor: "pointer",
                      transition: "all 0.25s ease",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "1.08rem",
                          fontWeight: 900,
                          color: "#0F172A",
                        }}
                      >
                        {q.name}
                      </div>
                      <span
                        style={{
                          padding: "0.25rem 0.7rem",
                          borderRadius: "999px",
                          fontSize: "0.74rem",
                          fontWeight: 900,
                          background: isRevealed ? burstColor : "#EEF2FF",
                          color: isRevealed ? "#FFFFFF" : "#2563EB",
                        }}
                      >
                        {isRevealed ? q.verdictTitle : "Click to Flip Verdict"}
                      </span>
                    </div>

                    <p
                      style={{
                        fontSize: "0.9rem",
                        color: "#334155",
                        margin: "0.35rem 0 0 0",
                      }}
                    >
                      {q.prompt}
                    </p>

                    {isRevealed && (
                      <div
                        style={{
                          marginTop: "0.65rem",
                          paddingTop: "0.65rem",
                          borderTop: `1px solid ${burstColor}44`,
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          fontSize: "0.88rem",
                          fontWeight: 700,
                          color: q.isRobot ? "#065F46" : "#9F1239",
                        }}
                      >
                        {q.isRobot ? (
                          <CheckCircle2 size={18} color="#10B981" />
                        ) : (
                          <XCircle size={18} color="#F43F5E" />
                        )}
                        <span>{q.verdictReason}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          SLIDE 06: THE FASCINATING HISTORY OF ROBOTICS (Theme: daylight-studio | Layout: timeline-stepper)
         ===================================================================== */}
      {currentSlide === 5 && (
        <div>
          <div style={{ marginBottom: "1.25rem" }}>
            <h2
              style={{
                fontSize: "clamp(1.9rem, 3.2vw, 2.75rem)",
                fontWeight: 900,
                color: palette.headingColor,
                margin: "0 0 0.35rem 0",
              }}
            >
              The Fascinating History of Robotics
            </h2>
            <p style={{ fontSize: "1.05rem", color: palette.bodyColor, margin: 0 }}>
              Click each historical milestone on the timeline stepper below:
            </p>
          </div>

          {(() => {
            const eras = [
              {
                year: "1206",
                title: "Al-Jazari’s Programmable Automata",
                tag: "Golden Age Mechanical Engineering",
                summary:
                  "Muslim polymath Ismail al-Jazari invented water-powered mechanical peacocks, hand-washing automata, and a programmable musical boat using pegged camshafts.",
                milestone: "First recorded programmable mechanical machine in human history.",
                image:
                  "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80",
                caption: "1206 CE • Camshaft-Driven Programmable Mechanical Automata",
              },
              {
                year: "1920",
                title: "Karel Čapek Coins the Word 'Robot'",
                tag: "Origin of the Term 'Robota'",
                summary:
                  "Czech writer Karel Čapek (with his brother Josef) introduced the word 'Robot'—from the Slavic word 'Robota' meaning 'forced labor'—in his famous sci-fi play R.U.R.",
                milestone: "Gave humanity the universal name for artificial autonomous workers.",
                image:
                  "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80",
                caption: "1920 • Rossum's Universal Robots (R.U.R.) Introduces 'Robot'",
              },
              {
                year: "1961",
                title: "Unimate — First Industrial Robot Arm",
                tag: "Factory Automation Revolution",
                summary:
                  "Invented by George Devol and Joseph Engelberger, 'Unimate' was installed on a General Motors assembly line to handle red-hot die-cast metal car parts safely.",
                milestone: "Launched modern industrial manufacturing and multi-axis servo arms.",
                image:
                  "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80",
                caption: "1961 • Unimate Industrial Robotic Arm Transforms Manufacturing",
              },
              {
                year: "Today",
                title: "Mars Rovers, Agile Quadrupeds & AI Vision",
                tag: "Autonomous Intelligence Era",
                summary:
                  "From NASA’s Perseverance Rover navigating Martian craters autonomously to Boston Dynamics quadrupeds and AI-guided surgical & agricultural robots.",
                milestone: "Real-time SLAM, embedded microcontrollers, and onboard AI perception.",
                image:
                  "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=1200&q=80",
                caption: "1997–Today • Autonomous Planetary Rovers & AI Vision Systems",
              },
            ];
            const activeEra = eras[historyEraIdx];

            return (
              <>
                {/* Horizontal Timeline Stepper */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gap: "0.85rem",
                    marginBottom: "1.4rem",
                  }}
                >
                  {eras.map((e, idx) => {
                    const active = historyEraIdx === idx;
                    return (
                      <button
                        key={e.year}
                        type="button"
                        onClick={() => setHistoryEraIdx(idx)}
                        style={{
                          padding: "0.95rem 1rem",
                          borderRadius: "16px",
                          border: `2px solid ${active ? "#2563EB" : "#C7D2FE"}`,
                          background: active ? "#2563EB" : "#FFFFFF",
                          color: active ? "#FFFFFF" : "#0F172A",
                          textAlign: "left",
                          cursor: "pointer",
                          boxShadow: palette.cardShadow,
                          transition: "all 0.2s ease",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "1.35rem",
                            fontWeight: 900,
                            color: active ? "#FFFFFF" : "#F97316",
                          }}
                        >
                          {e.year}
                        </div>
                        <div
                          style={{
                            fontSize: "0.85rem",
                            fontWeight: 800,
                            marginTop: "0.2rem",
                          }}
                        >
                          {e.title}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Active Era Spotlight Split View */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
                    gap: "1.6rem",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      background: "#FFFFFF",
                      border: "2px solid #C7D2FE",
                      borderRadius: "20px",
                      padding: "1.6rem",
                      boxShadow: palette.cardShadow,
                    }}
                  >
                    <span
                      style={{
                        display: "inline-block",
                        padding: "0.3rem 0.85rem",
                        borderRadius: "999px",
                        background: "rgba(124, 58, 237, 0.12)",
                        color: "#7C3AED",
                        fontWeight: 900,
                        fontSize: "0.78rem",
                        marginBottom: "0.75rem",
                      }}
                    >
                      ERA {activeEra.year} • {activeEra.tag}
                    </span>

                    <h3
                      style={{
                        fontSize: "1.75rem",
                        fontWeight: 900,
                        color: "#0F172A",
                        margin: "0 0 0.75rem 0",
                      }}
                    >
                      {activeEra.title}
                    </h3>

                    <p
                      style={{
                        fontSize: "1.02rem",
                        color: "#334155",
                        lineHeight: 1.6,
                        margin: "0 0 1.1rem 0",
                      }}
                    >
                      {activeEra.summary}
                    </p>

                    <div
                      style={{
                        padding: "0.9rem 1.1rem",
                        borderRadius: "14px",
                        background: "#EEF2FF",
                        borderLeft: "4px solid #2563EB",
                        color: "#1E293B",
                        fontWeight: 700,
                        fontSize: "0.92rem",
                      }}
                    >
                      🏆 Engineering Breakthrough: {activeEra.milestone}
                    </div>
                  </div>

                  <PresentationMediaFrame
                    src={activeEra.image}
                    alt={activeEra.title}
                    caption={activeEra.caption}
                    fallbackVariant="robot-arm"
                    height="330px"
                    accentColor="#2563EB"
                    onZoom={handleZoom}
                  />
                </div>
              </>
            );
          })()}
        </div>
      )}

      {/* =====================================================================
          SLIDE 07: HOW ROBOTS WORK: SENSE ➔ THINK ➔ ACT (Theme: cyber-blueprint | Layout: timeline-stepper)
         ===================================================================== */}
      {currentSlide === 6 && (
        <div>
          <div style={{ marginBottom: "1.25rem" }}>
            <h2
              style={{
                fontSize: "clamp(1.9rem, 3.2vw, 2.75rem)",
                fontWeight: 900,
                color: palette.headingColor,
                margin: "0 0 0.35rem 0",
              }}
            >
              How Robots Work: The &ldquo;Sense ➔ Think ➔ Act&rdquo; Loop
            </h2>
            <p style={{ fontSize: "1.05rem", color: palette.bodyColor, margin: 0 }}>
              Click each stage of the blueprint pipeline to compare Human Biology vs. Robot Architecture:
            </p>
          </div>

          {(() => {
            const stages = [
              {
                step: "STAGE 01",
                name: "SENSE (Input & Perception)",
                human: "Human Eyes, Ears & Skin nerve endings detect light, sound, and touch.",
                robot:
                  "Ultrasonic Sonar (HC-SR04), Infrared (IR) Photodiodes, LiDAR, and AI Cameras measure distance, reflectance, and objects as electrical voltages.",
                examples: ["Ultrasonic Distance Sensor", "8-Channel IR Line Array", "MPU-6050 Gyroscope"],
                accent: "#38BDF8",
              },
              {
                step: "STAGE 02",
                name: "THINK (Processing & Control)",
                human: "The Human Brain analyzes sensory signals and decides which way to move.",
                robot:
                  "The Microcontroller (Arduino Uno, ESP32, STM32) reads sensor voltages, runs C++ / Python algorithms at millions of cycles per second, and outputs control commands.",
                examples: ["if (distance < 20cm) turnRight();", "PID Error Calculation", "State Machine Logic"],
                accent: "#F59E0B",
              },
              {
                step: "STAGE 03",
                name: "ACT (Physical Output & Motion)",
                human: "Human Muscles contract to move arms, legs, and vocal cords.",
                robot:
                  "Motor Drivers (L298N / TB6612FNG), DC Gear Motors, Servo Motors, and LEDs convert electrical signals into real-world torque, speed, and light!",
                examples: ["DC Gear Motors + Wheels", "SG90 / MG996R Servo Gripper", "High-Brightness Status LEDs"],
                accent: "#10B981",
              },
            ];
            const current = stages[loopStageIdx];

            return (
              <>
                {/* 3-Stage Stepper Header */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "1rem",
                    marginBottom: "1.4rem",
                  }}
                >
                  {stages.map((st, idx) => {
                    const isSelected = loopStageIdx === idx;
                    return (
                      <button
                        key={st.step}
                        type="button"
                        onClick={() => setLoopStageIdx(idx)}
                        style={{
                          padding: "1.1rem 1.25rem",
                          borderRadius: "18px",
                          background: isSelected
                            ? "rgba(15, 23, 42, 0.9)"
                            : palette.cardBg,
                          border: `2px solid ${isSelected ? st.accent : "rgba(255,255,255,0.2)"}`,
                          color: "#FFFFFF",
                          textAlign: "left",
                          cursor: "pointer",
                          boxShadow: isSelected ? `0 0 28px ${st.accent}55` : "none",
                          transition: "all 0.25s ease",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "0.74rem",
                            fontWeight: 900,
                            color: st.accent,
                            letterSpacing: "0.08em",
                          }}
                        >
                          {st.step}
                        </div>
                        <div style={{ fontSize: "1.22rem", fontWeight: 900, marginTop: "0.2rem" }}>
                          {st.name}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Comparison Cards + Blueprint Diagram */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
                    gap: "1.5rem",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      background: palette.cardBg,
                      border: `2px solid ${current.accent}`,
                      borderRadius: "20px",
                      padding: "1.5rem",
                      backdropFilter: "blur(14px)",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "0.78rem",
                        fontWeight: 900,
                        color: current.accent,
                        letterSpacing: "0.08em",
                        marginBottom: "0.4rem",
                      }}
                    >
                      {current.step} • HUMAN BIOLOGY VS. ROBOT ARCHITECTURE
                    </div>
                    <h3 style={{ fontSize: "1.6rem", fontWeight: 900, color: "#FFFFFF", margin: "0 0 1rem 0" }}>
                      {current.name}
                    </h3>

                    <div
                      style={{
                        padding: "0.9rem 1rem",
                        borderRadius: "14px",
                        background: "rgba(255, 255, 255, 0.07)",
                        marginBottom: "0.85rem",
                      }}
                    >
                      <div style={{ fontSize: "0.75rem", fontWeight: 800, color: "#67E8F9" }}>
                        🧬 HUMAN BODY ANALOGY
                      </div>
                      <div style={{ fontSize: "0.95rem", color: "#FFFFFF", marginTop: "0.2rem" }}>
                        {current.human}
                      </div>
                    </div>

                    <div
                      style={{
                        padding: "0.9rem 1rem",
                        borderRadius: "14px",
                        background: "rgba(16, 185, 129, 0.12)",
                        border: `1px solid ${current.accent}`,
                        marginBottom: "1rem",
                      }}
                    >
                      <div style={{ fontSize: "0.75rem", fontWeight: 800, color: current.accent }}>
                        🤖 ROBOT HARDWARE EQUIVALENT
                      </div>
                      <div style={{ fontSize: "0.95rem", color: "#FFFFFF", marginTop: "0.2rem" }}>
                        {current.robot}
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                      {current.examples.map((ex, i) => (
                        <span
                          key={i}
                          style={{
                            padding: "0.3rem 0.7rem",
                            borderRadius: "999px",
                            background: "rgba(56, 189, 248, 0.16)",
                            border: "1px solid #38BDF8",
                            color: "#67E8F9",
                            fontSize: "0.78rem",
                            fontWeight: 700,
                            fontFamily: "monospace",
                          }}
                        >
                          {ex}
                        </span>
                      ))}
                    </div>
                  </div>

                  <PresentationMediaFrame
                    src="/illustrations/class1-sense-decide-act.svg"
                    alt="Sense Think Act Blueprint Diagram"
                    caption="Closed-Loop Engineering Architecture: Sense ➔ Think ➔ Act"
                    fallbackVariant="rover"
                    height="335px"
                    accentColor={current.accent}
                    onZoom={handleZoom}
                  />
                </div>
              </>
            );
          })()}
        </div>
      )}

      {/* =====================================================================
          SLIDE 08: THE 5 MAIN PARTS OF EVERY ROBOT (Theme: cyber-blueprint | Layout: interactive-hotspot)
         ===================================================================== */}
      {currentSlide === 7 && (
        <div>
          <div style={{ marginBottom: "1.25rem" }}>
            <h2
              style={{
                fontSize: "clamp(1.9rem, 3.2vw, 2.75rem)",
                fontWeight: 900,
                color: palette.headingColor,
                margin: "0 0 0.35rem 0",
              }}
            >
              The 5 Main Parts of Every Robot
            </h2>
            <p style={{ fontSize: "1.05rem", color: palette.bodyColor, margin: 0 }}>
              {slideMeta.subtitle}
            </p>
          </div>

          {(() => {
            const hotspots = [
              {
                num: 1,
                title: "1. The Brain (Controller)",
                top: "44%",
                left: "48%",
                role: "Executes embedded C++/Python logic and coordinates all sensors & motors.",
                hardware: "Arduino Uno / Nano, ESP32 Dual-Core, STM32 Black Pill, Raspberry Pi Pico",
                specs: "5V / 3.3V Digital Logic, PWM Speed Channels, ADC Inputs, UART/I2C/SPI Buses",
              },
              {
                num: 2,
                title: "2. The Eyes & Ears (Sensors)",
                top: "20%",
                left: "26%",
                role: "Measures physical distance, reflected infrared light, tilt, and visual targets.",
                hardware: "Ultrasonic HC-SR04, 8-Channel IR Array, VL53L0X Laser ToF, HuskyLens AI Camera",
                specs: "Converts physical world phenomena into analog voltages or digital pulses",
              },
              {
                num: 3,
                title: "3. The Muscles (Actuators & Drivers)",
                top: "68%",
                left: "24%",
                role: "Amplifies low-current logic signals into high-current motor rotation and gripper motion.",
                hardware: "N20 / TT DC Gear Motors, SG90 / MG996R Servos, L298N, TB6612FNG & BTS7960 Drivers",
                specs: "H-Bridge bidirectional direction control + PWM duty-cycle speed modulation",
              },
              {
                num: 4,
                title: "4. The Heart (Power System)",
                top: "30%",
                left: "76%",
                role: "Supplies high-discharge current to motors and clean regulated 5V to the microcontroller.",
                hardware: "2S/3S LiPo Batteries (7.4V–11.1V), 18650 Li-Ion Pack, LM2596 Buck Converter",
                specs: "Mandatory Common Ground (GND) shared between battery pack and logic board",
              },
              {
                num: 5,
                title: "5. The Skeleton (Chassis & Mechanics)",
                top: "74%",
                left: "73%",
                role: "Holds motors, sensors, and circuit boards in rigid alignment during high-speed turns.",
                hardware: "3D-Printed PLA/PETG Frames, Laser-Cut Acrylic, Anodized Aluminum, Silicone Tires",
                specs: "Low center of gravity, precision M3 standoffs, and vibration-isolated sensor mounts",
              },
            ];
            const activeSpot = hotspots[robotPartHotspot];

            return (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
                  gap: "1.6rem",
                  alignItems: "stretch",
                }}
              >
                {/* Left: Interactive Anatomical Blueprint with 5 Pulsing Numbered Pins */}
                <div
                  style={{
                    position: "relative",
                    borderRadius: "20px",
                    overflow: "hidden",
                    border: "2px solid #38BDF8",
                    minHeight: "370px",
                    background: "#091526",
                    boxShadow: palette.cardShadow,
                  }}
                >
                  <img
                    src={slideMeta.heroImage}
                    alt="Robot Anatomy Diagram"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = "none";
                    }}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      opacity: 0.45,
                      position: "absolute",
                      inset: 0,
                    }}
                  />

                  {/* Blueprint Vector Overlay */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "radial-gradient(circle at center, rgba(12, 74, 110, 0.35) 0%, rgba(15, 23, 42, 0.85) 100%)",
                    }}
                  />

                  {/* 5 Pulsing Numbered Pins */}
                  {hotspots.map((spot, idx) => {
                    const isSelected = robotPartHotspot === idx;
                    return (
                      <button
                        key={spot.num}
                        type="button"
                        onClick={() => setRobotPartHotspot(idx)}
                        style={{
                          position: "absolute",
                          top: spot.top,
                          left: spot.left,
                          transform: "translate(-50%, -50%)",
                          width: isSelected ? "54px" : "44px",
                          height: isSelected ? "54px" : "44px",
                          borderRadius: "999px",
                          background: isSelected ? "#F59E0B" : "#0F172A",
                          border: `3px solid ${isSelected ? "#FFFFFF" : "#38BDF8"}`,
                          color: "#FFFFFF",
                          fontWeight: 900,
                          fontSize: "1.1rem",
                          cursor: "pointer",
                          boxShadow: isSelected
                            ? "0 0 0 8px rgba(245, 158, 11, 0.35), 0 0 25px #F59E0B"
                            : "0 0 0 6px rgba(56, 189, 248, 0.25)",
                          transition: "all 0.2s ease",
                          zIndex: 5,
                        }}
                        title={spot.title}
                      >
                        {spot.num}
                      </button>
                    );
                  })}

                  <div
                    style={{
                      position: "absolute",
                      bottom: "14px",
                      left: "14px",
                      right: "14px",
                      padding: "0.6rem 0.9rem",
                      borderRadius: "12px",
                      background: "rgba(15, 23, 42, 0.85)",
                      border: "1px solid rgba(56, 189, 248, 0.4)",
                      color: "#67E8F9",
                      fontSize: "0.78rem",
                      fontWeight: 700,
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <span>Click numbered pins (1–5) to inspect subsystem</span>
                    <button
                      type="button"
                      onClick={() => handleZoom(slideMeta.heroImage, slideMeta.imageCaption)}
                      style={{
                        background: "transparent",
                        border: "none",
                        color: "#FBBF24",
                        fontWeight: 800,
                        cursor: "pointer",
                        fontSize: "0.76rem",
                      }}
                    >
                      Zoom Photo ➔
                    </button>
                  </div>
                </div>

                {/* Right: Subsystem Selector Pills + Active Specification Card */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                    {hotspots.map((spot, idx) => (
                      <button
                        key={spot.num}
                        type="button"
                        onClick={() => setRobotPartHotspot(idx)}
                        style={{
                          padding: "0.45rem 0.85rem",
                          borderRadius: "10px",
                          border: `1px solid ${
                            robotPartHotspot === idx ? "#F59E0B" : "rgba(255,255,255,0.2)"
                          }`,
                          background:
                            robotPartHotspot === idx
                              ? "rgba(245, 158, 11, 0.22)"
                              : "rgba(15, 23, 42, 0.6)",
                          color: "#FFFFFF",
                          fontWeight: 800,
                          fontSize: "0.8rem",
                          cursor: "pointer",
                        }}
                      >
                        {spot.title}
                      </button>
                    ))}
                  </div>

                  <div
                    style={{
                      background: palette.cardBg,
                      border: "2px solid #F59E0B",
                      borderRadius: "20px",
                      padding: "1.5rem",
                      backdropFilter: "blur(16px)",
                      boxShadow: palette.cardShadow,
                      flex: 1,
                    }}
                  >
                    <div
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: 900,
                        color: "#FBBF24",
                        letterSpacing: "0.08em",
                        marginBottom: "0.35rem",
                      }}
                    >
                      SUBSYSTEM HOTSPOT #{activeSpot.num} OF 5
                    </div>
                    <h3
                      style={{
                        fontSize: "1.6rem",
                        fontWeight: 900,
                        color: "#FFFFFF",
                        margin: "0 0 0.7rem 0",
                      }}
                    >
                      {activeSpot.title}
                    </h3>
                    <p
                      style={{
                        fontSize: "1rem",
                        color: "#E0F2FE",
                        lineHeight: 1.55,
                        margin: "0 0 1rem 0",
                      }}
                    >
                      {activeSpot.role}
                    </p>

                    <div
                      style={{
                        padding: "0.85rem 1rem",
                        borderRadius: "12px",
                        background: "rgba(56, 189, 248, 0.12)",
                        border: "1px solid rgba(56, 189, 248, 0.35)",
                        marginBottom: "0.75rem",
                      }}
                    >
                      <div style={{ fontSize: "0.72rem", fontWeight: 900, color: "#67E8F9" }}>
                        VERIFIED ROBOBEE LAB HARDWARE
                      </div>
                      <div style={{ fontSize: "0.92rem", color: "#FFFFFF", fontWeight: 700, marginTop: "0.2rem" }}>
                        {activeSpot.hardware}
                      </div>
                    </div>

                    <div
                      style={{
                        padding: "0.85rem 1rem",
                        borderRadius: "12px",
                        background: "rgba(245, 158, 11, 0.12)",
                        border: "1px solid rgba(245, 158, 11, 0.35)",
                      }}
                    >
                      <div style={{ fontSize: "0.72rem", fontWeight: 900, color: "#FBBF24" }}>
                        KEY ENGINEERING SPECIFICATION
                      </div>
                      <div style={{ fontSize: "0.88rem", color: "#FEF3C7", marginTop: "0.2rem" }}>
                        {activeSpot.specs}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* =====================================================================
          SLIDE 09: TYPES OF MICROCONTROLLERS (THE BRAINS) (Theme: arduino-teal | Layout: interactive-grid)
         ===================================================================== */}
      {currentSlide === 8 && (
        <div>
          <div style={{ marginBottom: "1.3rem" }}>
            <h2
              style={{
                fontSize: "clamp(1.9rem, 3.2vw, 2.75rem)",
                fontWeight: 900,
                color: palette.headingColor,
                margin: "0 0 0.35rem 0",
              }}
            >
              Types of Microcontrollers — Choosing the Right Brain
            </h2>
            <p style={{ fontSize: "1.05rem", color: palette.bodyColor, margin: 0 }}>
              Click any microcontroller family below to compare clock speeds, connectivity, and competition use-cases:
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(255px, 1fr))",
              gap: "1.1rem",
            }}
          >
            {[
              {
                name: "Arduino Uno / Nano",
                chip: "ATmega328P (8-bit AVR)",
                clock: "16 MHz",
                voltage: "5V Logic",
                wireless: "USB Serial (UART)",
                bestFor:
                  "Best for learning electronics fundamentals, breadboard sensor interfacing, and starter autonomous rovers.",
                badge: "STARTER KING",
                accent: "#FBBF24",
              },
              {
                name: "ESP8266 & ESP32",
                chip: "Xtensa Dual-Core 32-bit",
                clock: "Up to 240 MHz",
                voltage: "3.3V Logic",
                wireless: "Built-in Wi-Fi + Bluetooth BLE",
                bestFor:
                  "Best for IoT cloud dashboards, wireless smartphone Robo-Soccer bots, and smart home/agriculture automation.",
                badge: "WIRELESS & IOT",
                accent: "#5EEAD4",
              },
              {
                name: "STM32 'Black Pill'",
                chip: "ARM Cortex-M4 (STM32F411)",
                clock: "100 MHz 32-bit",
                voltage: "3.3V (5V-tolerant I/O)",
                wireless: "High-Speed SPI/I2C/USART",
                bestFor:
                  "Best for ultra-fast PID Line Follower robots and Mini-Sumo bots requiring high-resolution PWM & fast ADC reads.",
                badge: "COMPETITION SPEED",
                accent: "#38BDF8",
              },
              {
                name: "Raspberry Pi Pico",
                chip: "RP2040 Dual Cortex-M0+",
                clock: "133 MHz Dual-Core",
                voltage: "3.3V Logic",
                wireless: "PIO State Machines (Pico W Wi-Fi)",
                bestFor:
                  "Best for flexible embedded control running either MicroPython or C/C++ with programmable I/O hardware.",
                badge: "PYTHON + C/C++",
                accent: "#F472B6",
              },
            ].map((mcu, idx) => {
              const active = selectedMcuIdx === idx;
              return (
                <div
                  key={mcu.name}
                  onClick={() => setSelectedMcuIdx(idx)}
                  style={{
                    background: active
                      ? "rgba(4, 47, 46, 0.88)"
                      : palette.cardBg,
                    border: `2px solid ${active ? mcu.accent : palette.cardBorder}`,
                    backdropFilter: "blur(16px)",
                    borderRadius: "20px",
                    padding: "1.3rem",
                    boxShadow: active ? `0 0 30px ${mcu.accent}44` : palette.cardShadow,
                    cursor: "pointer",
                    transition: "all 0.25s ease",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "0.65rem",
                    }}
                  >
                    <span
                      style={{
                        padding: "0.22rem 0.65rem",
                        borderRadius: "999px",
                        background: `${mcu.accent}22`,
                        border: `1px solid ${mcu.accent}`,
                        color: mcu.accent,
                        fontSize: "0.72rem",
                        fontWeight: 900,
                      }}
                    >
                      {mcu.badge}
                    </span>
                    <span
                      style={{
                        fontFamily: "monospace",
                        fontSize: "0.82rem",
                        fontWeight: 900,
                        color: "#FEF3C7",
                      }}
                    >
                      ⚡ {mcu.clock}
                    </span>
                  </div>

                  <h3
                    style={{
                      fontSize: "1.3rem",
                      fontWeight: 900,
                      color: "#FFFFFF",
                      margin: "0 0 0.25rem 0",
                    }}
                  >
                    {mcu.name}
                  </h3>
                  <div
                    style={{
                      fontSize: "0.8rem",
                      fontFamily: "monospace",
                      color: "#5EEAD4",
                      marginBottom: "0.85rem",
                    }}
                  >
                    {mcu.chip}
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.35rem",
                      fontSize: "0.82rem",
                      color: "#F0FDF4",
                      marginBottom: "0.9rem",
                      padding: "0.65rem 0.8rem",
                      borderRadius: "12px",
                      background: "rgba(0, 0, 0, 0.25)",
                    }}
                  >
                    <div>
                      <strong style={{ color: "#FBBF24" }}>Operating Logic:</strong> {mcu.voltage}
                    </div>
                    <div>
                      <strong style={{ color: "#5EEAD4" }}>Interface:</strong> {mcu.wireless}
                    </div>
                  </div>

                  <p
                    style={{
                      fontSize: "0.88rem",
                      color: "#FEF3C7",
                      lineHeight: 1.5,
                      margin: 0,
                    }}
                  >
                    {mcu.bestFor}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =====================================================================
          SLIDE 10: WHY WE START WITH ARDUINO! (Theme: arduino-teal | Layout: split-media)
         ===================================================================== */}
      {currentSlide === 9 && (
        <div>
          <div style={{ marginBottom: "1.4rem" }}>
            <h2
              style={{
                fontSize: "clamp(1.9rem, 3.2vw, 2.75rem)",
                fontWeight: 900,
                color: palette.headingColor,
                margin: "0 0 0.35rem 0",
              }}
            >
              Why We Start With Arduino!
            </h2>
            <p style={{ fontSize: "1.05rem", color: palette.bodyColor, margin: 0 }}>
              {slideMeta.subtitle}
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
              gap: "1.75rem",
              alignItems: "stretch",
            }}
          >
            {/* Left: 3 High-Impact Visual Bento Points */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {[
                {
                  badge: "01 • HARDWARE RESILIENCE",
                  title: "Forgiving 5V Plug-and-Play Pins",
                  desc: "Rugged 5V logic headers, socketed replaceable ATmega328P chip, effortless USB upload, and direct compatibility with 99% of classroom sensors.",
                },
                {
                  badge: "02 • OPEN-SOURCE ECOSYSTEM",
                  title: "Massive Global Sensor Library",
                  desc: "Millions of engineers share open-source drivers for ultrasonic sonar, OLED screens, servos, and motor controllers—you never get stuck alone!",
                },
                {
                  badge: "03 • UNIVERSAL EMBEDDED CODE",
                  title: "C/C++ Foundation for All Boards",
                  desc: "Mastering setup(), loop(), pinMode(), and digitalWrite() on Arduino transfers directly to ESP32, STM32 Black Pill, and industrial robotics.",
                },
              ].map((pt, idx) => (
                <div
                  key={idx}
                  style={{
                    background: palette.cardBg,
                    border: `1px solid ${palette.cardBorder}`,
                    backdropFilter: "blur(16px)",
                    borderRadius: "18px",
                    padding: "1.2rem 1.35rem",
                    boxShadow: palette.cardShadow,
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.72rem",
                      fontWeight: 900,
                      color: "#FBBF24",
                      letterSpacing: "0.08em",
                      marginBottom: "0.25rem",
                    }}
                  >
                    {pt.badge}
                  </div>
                  <div
                    style={{
                      fontSize: "1.2rem",
                      fontWeight: 900,
                      color: "#FFFFFF",
                      marginBottom: "0.3rem",
                    }}
                  >
                    {pt.title}
                  </div>
                  <div style={{ fontSize: "0.95rem", color: "#F0FDF4", lineHeight: 1.5 }}>
                    {pt.desc}
                  </div>
                </div>
              ))}
            </div>

            {/* Right: High-Res Glowing Arduino Close-Up */}
            <PresentationMediaFrame
              src={slideMeta.heroImage}
              alt="Arduino Uno R3 Close-up"
              caption={slideMeta.imageCaption}
              fallbackVariant="arduino"
              height="100%"
              accentColor="#FBBF24"
              onZoom={handleZoom}
            />
          </div>
        </div>
      )}

      {/* =====================================================================
          SLIDE 11: INTERACTIVE ANATOMY OF AN ARDUINO UNO (Theme: arduino-teal | Layout: interactive-hotspot)
         ===================================================================== */}
      {currentSlide === 10 && (
        <div>
          <div style={{ marginBottom: "1.25rem" }}>
            <h2
              style={{
                fontSize: "clamp(1.9rem, 3.2vw, 2.75rem)",
                fontWeight: 900,
                color: palette.headingColor,
                margin: "0 0 0.35rem 0",
              }}
            >
              Interactive Anatomy of an Arduino Uno
            </h2>
            <p style={{ fontSize: "1.05rem", color: palette.bodyColor, margin: 0 }}>
              {slideMeta.subtitle}
            </p>
          </div>

          {(() => {
            const pins = [
              {
                num: 1,
                name: "1. USB Port & DC Power Barrel",
                top: "38%",
                left: "16%",
                summary:
                  "The Type-B USB port uploads compiled C++ code from your computer and supplies 5V power (up to 500mA). The DC Barrel Jack accepts 7V–12V battery power for untethered mobile robots.",
                rule: "Always unplug the USB cable while wiring or modifying your breadboard circuit!",
              },
              {
                num: 2,
                name: "2. Digital PWM Pins (D0–D13 & ~)",
                top: "18%",
                left: "60%",
                summary:
                  "14 bidirectional digital pins that read or output HIGH (5V) or LOW (0V). Pins marked with a tilde (~3, ~5, ~6, ~9, ~10, ~11) generate PWM signals for motor speed and LED dimming.",
                rule: "Pin 13 is wired to the onboard orange 'L' test LED! Max safe current per pin is 20mA.",
              },
              {
                num: 3,
                name: "3. Analog Input Pins (A0–A5)",
                top: "82%",
                left: "74%",
                summary:
                  "6 channels connected to a 10-bit Analog-to-Digital Converter (ADC). Instead of just ON/OFF, they measure continuous sensor voltages from 0V to 5V as numbers between 0 and 1023!",
                rule: "Used for IR reflectance sensors, potentiometers, and battery voltage dividers.",
              },
              {
                num: 4,
                name: "4. Power Rails (5V, 3.3V, GND, VIN)",
                top: "82%",
                left: "40%",
                summary:
                  "Provides regulated 5V and 3.3V power to breadboard sensors, plus Ground (GND) return pins. Every circuit MUST form a complete closed loop back to GND.",
                rule: "Never short-circuit the 5V pin directly to GND—that triggers the polyfuse and shuts down the board!",
              },
              {
                num: 5,
                name: "5. ATmega328P Microchip (The Brain)",
                top: "58%",
                left: "64%",
                summary:
                  "The 28-pin black silicon microcontroller running at 16 Million clock cycles per second (16 MHz). Contains 32KB Flash memory (stores your sketch) and 2KB SRAM.",
                rule: "Your code stays saved inside Flash memory even when battery power is turned off!",
              },
            ];
            const activePin = pins[arduinoPinHotspot];

            return (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
                  gap: "1.6rem",
                  alignItems: "stretch",
                }}
              >
                {/* Left: Interactive Visual Diagram of the Arduino Uno with 5 Pulsing Pins */}
                <div
                  style={{
                    position: "relative",
                    borderRadius: "20px",
                    overflow: "hidden",
                    border: "2px solid #2DD4BF",
                    background: "#042F2E",
                    minHeight: "365px",
                    boxShadow: palette.cardShadow,
                  }}
                >
                  <FallbackHardwareArtwork
                    variant="arduino"
                    caption="Interactive Arduino Uno R3 Pinout Map — Click Pins 1 to 5"
                  />

                  {pins.map((p, idx) => {
                    const isSelected = arduinoPinHotspot === idx;
                    return (
                      <button
                        key={p.num}
                        type="button"
                        onClick={() => setArduinoPinHotspot(idx)}
                        style={{
                          position: "absolute",
                          top: p.top,
                          left: p.left,
                          transform: "translate(-50%, -50%)",
                          width: isSelected ? "52px" : "42px",
                          height: isSelected ? "52px" : "42px",
                          borderRadius: "999px",
                          background: isSelected ? "#FBBF24" : "#0F172A",
                          border: `3px solid ${isSelected ? "#FFFFFF" : "#5EEAD4"}`,
                          color: isSelected ? "#0F172A" : "#FFFFFF",
                          fontWeight: 900,
                          fontSize: "1.05rem",
                          cursor: "pointer",
                          boxShadow: isSelected
                            ? "0 0 0 8px rgba(251, 191, 36, 0.38), 0 0 25px #FBBF24"
                            : "0 0 0 6px rgba(94, 234, 212, 0.28)",
                          transition: "all 0.2s ease",
                          zIndex: 5,
                        }}
                        title={p.name}
                      >
                        {p.num}
                      </button>
                    );
                  })}
                </div>

                {/* Right: Pin Selector + Specification Card */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem" }}>
                    {pins.map((p, idx) => (
                      <button
                        key={p.num}
                        type="button"
                        onClick={() => setArduinoPinHotspot(idx)}
                        style={{
                          padding: "0.45rem 0.8rem",
                          borderRadius: "10px",
                          border: `1px solid ${
                            arduinoPinHotspot === idx ? "#FBBF24" : "rgba(255,255,255,0.2)"
                          }`,
                          background:
                            arduinoPinHotspot === idx
                              ? "rgba(251, 191, 36, 0.22)"
                              : "rgba(4, 47, 46, 0.65)",
                          color: "#FFFFFF",
                          fontWeight: 800,
                          fontSize: "0.78rem",
                          cursor: "pointer",
                        }}
                      >
                        Pin {p.num}
                      </button>
                    ))}
                  </div>

                  <div
                    style={{
                      background: palette.cardBg,
                      border: "2px solid #FBBF24",
                      borderRadius: "20px",
                      padding: "1.5rem",
                      backdropFilter: "blur(16px)",
                      boxShadow: palette.cardShadow,
                      flex: 1,
                    }}
                  >
                    <div
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: 900,
                        color: "#FBBF24",
                        letterSpacing: "0.08em",
                        marginBottom: "0.35rem",
                      }}
                    >
                      ARDUINO HARDWARE ZONE #{activePin.num} OF 5
                    </div>
                    <h3
                      style={{
                        fontSize: "1.55rem",
                        fontWeight: 900,
                        color: "#FFFFFF",
                        margin: "0 0 0.75rem 0",
                      }}
                    >
                      {activePin.name}
                    </h3>
                    <p
                      style={{
                        fontSize: "1rem",
                        color: "#F0FDF4",
                        lineHeight: 1.6,
                        margin: "0 0 1.1rem 0",
                      }}
                    >
                      {activePin.summary}
                    </p>

                    <div
                      style={{
                        padding: "0.9rem 1rem",
                        borderRadius: "14px",
                        background: "rgba(251, 191, 36, 0.16)",
                        border: "1px solid #FBBF24",
                        color: "#FEF3C7",
                        fontSize: "0.9rem",
                        fontWeight: 700,
                      }}
                    >
                      ⚡ Lab Golden Rule: {activePin.rule}
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* =====================================================================
          SLIDE 12: YOUR ROBOTICS JOURNEY STARTS TODAY! (Theme: electric-indigo | Layout: hero-title + Roadmap)
         ===================================================================== */}
      {currentSlide === 11 && (
        <div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
              gap: "1.8rem",
              alignItems: "center",
              marginBottom: "1.5rem",
            }}
          >
            <div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.45rem",
                  padding: "0.4rem 0.95rem",
                  borderRadius: "999px",
                  background: "rgba(0, 245, 212, 0.16)",
                  border: "1px solid #00F5D4",
                  color: "#00F5D4",
                  fontSize: "0.78rem",
                  fontWeight: 900,
                  marginBottom: "0.9rem",
                }}
              >
                <Award size={15} /> ROBOBEE INNOVATORS ACTION ROADMAP
              </div>

              <h2
                style={{
                  fontSize: "clamp(2rem, 3.6vw, 3rem)",
                  fontWeight: 900,
                  color: "#FFFFFF",
                  lineHeight: 1.1,
                  margin: "0 0 0.75rem 0",
                }}
              >
                Your Robotics Journey Starts Today!
              </h2>

              <p
                style={{
                  fontSize: "1.08rem",
                  color: "#E0E7FF",
                  lineHeight: 1.55,
                  margin: "0 0 1.2rem 0",
                }}
              >
                You now know what separates a true autonomous robot from an ordinary machine,
                how the <strong>Sense ➔ Think ➔ Act</strong> loop operates, and what every pin on
                your Arduino Uno does. Here is what we will build together:
              </p>
            </div>

            <PresentationMediaFrame
              src={slideMeta.heroImage}
              alt="Combat robots, line followers, and robotic arms"
              caption={slideMeta.imageCaption}
              fallbackVariant="team"
              height="270px"
              accentColor="#00F5D4"
              onZoom={handleZoom}
            />
          </div>

          {/* 3-Step Visual Roadmap */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "1.15rem",
            }}
          >
            {[
              {
                phase: "PHASE 01 • ELECTRONICS & C++",
                title: "Learn Electronics & Arduino",
                desc: "Wire solderless breadboards, LEDs, pushbuttons, ultrasonic sonar sensors, and motor drivers with clean C++ code.",
                color: "#00F5D4",
              },
              {
                phase: "PHASE 02 • AUTONOMOUS BUILD",
                title: "Build Your First Autonomous Bot",
                desc: "Assemble your 2WD/4WD chassis, calibrate IR & sonar arrays, and program closed-loop obstacle avoidance and line tracking.",
                color: "#38BDF8",
              },
              {
                phase: "PHASE 03 • TOURNAMENT ARENA",
                title: "Compete with RoboBee Innovators",
                desc: "Join specialized RoboBee Competition Squads for National Line Follower, Mini-Sumo, Robo-Soccer, and Invention Olympiads!",
                color: "#FBBF24",
              },
            ].map((step, idx) => (
              <div
                key={idx}
                style={{
                  background: palette.cardBg,
                  border: `2px solid ${step.color}`,
                  backdropFilter: "blur(16px)",
                  borderRadius: "20px",
                  padding: "1.35rem",
                  boxShadow: palette.cardShadow,
                }}
              >
                <div
                  style={{
                    fontSize: "0.74rem",
                    fontWeight: 900,
                    color: step.color,
                    letterSpacing: "0.08em",
                    marginBottom: "0.35rem",
                  }}
                >
                  {step.phase}
                </div>
                <h3
                  style={{
                    fontSize: "1.28rem",
                    fontWeight: 900,
                    color: "#FFFFFF",
                    margin: "0 0 0.45rem 0",
                  }}
                >
                  {step.title}
                </h3>
                <p style={{ fontSize: "0.92rem", color: "#E0E7FF", lineHeight: 1.5, margin: 0 }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Fullscreen Image Lightbox Modal */}
      {lightboxMedia && (
        <div
          onClick={() => setLightboxMedia(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(7, 11, 20, 0.94)",
            backdropFilter: "blur(18px)",
            zIndex: 1000000,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
          }}
        >
          <button
            type="button"
            onClick={() => setLightboxMedia(null)}
            style={{
              position: "absolute",
              top: "24px",
              right: "28px",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              padding: "0.55rem 1rem",
              borderRadius: "999px",
              background: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.25)",
              color: "#FFFFFF",
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            <X size={18} /> Close Zoom (Esc)
          </button>
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: "1100px",
              width: "100%",
              borderRadius: "20px",
              overflow: "hidden",
              border: "2px solid #00F5D4",
              background: "#0F172A",
              boxShadow: "0 25px 70px rgba(0, 0, 0, 0.8)",
            }}
          >
            <PresentationMediaFrame
              src={lightboxMedia.src}
              alt={lightboxMedia.caption}
              caption={lightboxMedia.caption}
              height="72vh"
              accentColor="#00F5D4"
            />
          </div>
        </div>
      )}
    </div>
  );
}
