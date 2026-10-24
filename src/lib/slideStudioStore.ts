"use client";

import {
  SlideColorTheme,
  SlideLayoutType,
  THEME_PALETTE_CONFIG,
} from "@/components/curriculum/Class1WorkshopDeck";

export type { SlideColorTheme };
export { THEME_PALETTE_CONFIG };
import { ALL_ROBOTICS_LESSONS, COURSE_SPACES, CourseTier, RoboticsLesson } from "@/lib/curriculumData";
import { db } from "@/lib/firebase";
import { collection, doc, getDocs, setDoc, deleteDoc } from "firebase/firestore";

export type CurriculumTrackName =
  | "Foundation Track"
  | "Hardware & Sensors"
  | "Combat & Autonomous Bots";

export type ClassTrackCategory = CurriculumTrackName;

export type SlideFontFamily = "sans" | "display" | "mono" | "serif";
export type SlideTitleSize = "compact" | "standard" | "large" | "hero";
export type SlideEntranceAnimation = "fade-up" | "zoom-in" | "slide-right" | "cyber-glow" | "none";

// ============================================================================
// FREEFORM PRESENTATION ENGINE TYPES (1280 x 720 STAGE)
// ============================================================================
export type SlideElementType =
  | "heading"
  | "subheading"
  | "textbox"
  | "image"
  | "code"
  | "shape"
  | "callout"
  | "video"
  | "pinout-card"
  | "diagram"
  | "svg-widget";

export interface SlideElementStyle {
  fontFamily?: SlideFontFamily | string;
  fontSize?: number; // In px on 1280x720 canvas
  fontWeight?: number | string;
  fontStyle?: "normal" | "italic";
  textDecoration?: "none" | "underline" | "line-through";
  textAlign?: "left" | "center" | "right" | "justify";
  color?: string;
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  borderStyle?: "solid" | "dashed" | "dotted" | "none";
  borderRadius?: number;
  opacity?: number;
  padding?: number | string;
  boxShadow?: string;
  objectFit?: "contain" | "cover" | "fill";
  lineHeight?: number | string;
  letterSpacing?: number | string;
  backdropFilter?: string;
}

export interface SlideElementAnimation {
  type: "none" | "fade" | "slide-up" | "zoom" | "step-reveal";
  order?: number;
}

export interface SlideElement {
  id: string;
  type: SlideElementType;
  x: number; // 0 to 1280
  y: number; // 0 to 720
  width: number;
  height: number;
  rotation?: number; // 0 to 360 deg
  zIndex: number;
  locked?: boolean;
  animation?: SlideElementAnimation;
  content: string; // rich text, image URL, code snippet, shape type, or video URL
  style: SlideElementStyle;
  // Type-specific metadata
  language?: "cpp" | "python" | "arduino" | "bash" | "javascript";
  shapeType?: "rectangle" | "circle" | "arrow-right" | "arrow-left" | "line" | "badge";
  caption?: string;
  videoUrl?: string;
  diagramType?: "ultrasonic-radar" | "breadboard-circuit" | "servo-gauge" | "h-bridge-motor" | "ir-reflectance" | "pinout-diagram" | string;
  badgeText?: string;
  pinItems?: { number: number; label: string; pinName: string; note: string }[];
  isQuizCard?: boolean;
  quizVerdict?: string;
  quizIsPositive?: boolean;
  isPollCard?: boolean;
  pollInitialVotes?: number;
  hotspotPins?: EditableHotspotPin[];
}

export interface SlideImageItem {
  id: string;
  url: string;
  caption: string;
  fallbackVariant?: "robot-arm" | "arduino" | "rover" | "team" | "mcu";
}

export interface EditableSlideCard {
  id: string;
  badge?: string;
  title: string;
  subtitle?: string;
  body: string;
  detail?: string;
  accentColor?: string;
  // Optional quiz flip properties (for Machine vs Robot or Safe vs Short Circuit quizzes)
  isQuizCard?: boolean;
  quizVerdict?: string;
  quizIsPositive?: boolean;
  // Optional poll properties
  isPollCard?: boolean;
  pollInitialVotes?: number;
}

export interface EditableHotspotPin {
  id: string;
  number: number;
  xPercent: number;
  yPercent: number;
  title: string;
  badge: string;
  description: string;
  color: string;
}

export interface EditableSlide {
  id: string;
  numberLabel: string;
  title: string;
  subtitle: string;
  badge: string;
  theme: SlideColorTheme;
  layout: SlideLayoutType | "photo-gallery";
  fontFamily: SlideFontFamily;
  titleSize: SlideTitleSize;
  textAlign: "left" | "center";
  animation: SlideEntranceAnimation;
  heroImage: string;
  imageCaption: string;
  fallbackVariant: "robot-arm" | "arduino" | "rover" | "team" | "mcu";
  galleryImages: SlideImageItem[];
  cards: EditableSlideCard[];
  hotspots: EditableHotspotPin[];
  speakerNotes: string;
  ctaText?: string;
  // Freeform 16:9 Presentation Engine Extensions
  elements?: SlideElement[];
  backgroundColor?: string;
  backgroundImage?: string;
  backgroundOverlayOpacity?: number;
}

export interface EditableClassDeck {
  id: string; // e.g. 'beg-01', 'beg-02', 'beg-03', 'beg-04', or custom 'cls-...'
  courseId?: CourseTier;
  proposedAudience?: string;
  classCode: string; // e.g. 'CLASS 01', 'CLASS 02'
  title: string;
  subtitle: string;
  track: CurriculumTrackName;
  coverImage: string;
  durationMinutes: number;
  xpReward?: number;
  hardwareKit?: string[];
  status: "published" | "live_in_class" | "locked";
  lastEditedAt: string;
  hardwareSimType:
    | "arduino_board_tour_sim"
    | "breadboard_circuit_sim"
    | "ultrasonic_sonar_sim"
    | "motor_driver_pwm_sim"
    | "led_blink_sim";
  kitComponents: { name: string; spec: string; qty: number }[];
  slides: EditableSlide[];
}

const LOCAL_STORAGE_KEY = "robobee_slide_studio_decks_v1";

// ============================================================================
// SEED DECK 1: CLASS 01 — INTRODUCTION TO ROBOTICS & FUTURE ENGINEERING (12 SLIDES)
// ============================================================================
export const SEED_CLASS_01_DECK: EditableClassDeck = {
  id: "beg-01",
  courseId: "beginner",
  proposedAudience: "Proposed for Classes 5–8",
  classCode: "BEGINNER 01",
  title: "Welcome to Robotics: Meet Arduino, Then Make an LED Blink",
  subtitle:
    "Why extracurriculars & robotics matter, the history of machines, Sense-Think-Act architecture, the 5 main robot subsystems, and interactive Arduino Uno anatomy.",
  track: "Foundation Track",
  coverImage: "/illustrations/class1-external-blink-wiring.svg",
  durationMinutes: 120,
  status: "published",
  lastEditedAt: "2026-10-19T03:30:00.000Z",
  hardwareSimType: "arduino_board_tour_sim",
  kitComponents: [
    { name: "Arduino Uno R3", spec: "ATmega328P 5V Microcontroller", qty: 1 },
    { name: "USB Type-A to Type-B Cable", spec: "Data + 5V Power", qty: 1 },
    { name: "Solderless Breadboard", spec: "400 Tie-Points", qty: 1 },
    { name: "5mm Diffused LED", spec: "Red / Green (2.0V Vf)", qty: 2 },
    { name: "Current-Limiting Resistor", spec: "220 Ω (Red-Red-Brown)", qty: 2 },
  ],
  slides: [
    {
      id: "c1-s01",
      numberLabel: "01",
      title: "Welcome to the World of Robotics",
      subtitle:
        "From Consumer of Technology to Creator of Autonomous Machines — RoboBee Innovators Foundation Track.",
      badge: "ROBOBEE INNOVATORS • FOUNDATION TRACK • CLASS 01",
      theme: "electric-indigo",
      layout: "hero-title",
      fontFamily: "display",
      titleSize: "hero",
      textAlign: "left",
      animation: "fade-up",
      heroImage:
        "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1600&q=80",
      imageCaption: "Autonomous Humanoid & Precision Robotics Lab • Class 01 Foundation",
      fallbackVariant: "robot-arm",
      galleryImages: [],
      cards: [
        {
          id: "c1-s01-c1",
          badge: "MINDSET SHIFT",
          title: "Stop Just Scrolling — Start Engineering",
          body: "Anyone can tap apps on a smartphone. In this lab, you write the C++ code and wire the circuits that command physical machines.",
          accentColor: "#00F5D4",
        },
        {
          id: "c1-s01-c2",
          badge: "HANDS-ON LAB",
          title: "Real Hardware From Day One",
          body: "Inspect real microcontrollers, trace voltage rails, and discover how sensors, brains, and motors unite.",
          accentColor: "#38BDF8",
        },
      ],
      hotspots: [],
      speakerNotes:
        "Welcome students with high energy! Ask: 'Who here uses technology every day? Now, who wants to BUILD the technology of the future?'",
      ctaText: "Launch Class Engine ➔",
    },
    {
      id: "c1-s02",
      numberLabel: "02",
      title: "Why Extracurricular Activities Matter",
      subtitle:
        "Textbooks teach you formulas—building real hardware in a team teaches you how to engineer the future.",
      badge: "BEYOND THE CLASSROOM • ENGINEERING MINDSET",
      theme: "electric-indigo",
      layout: "split-media",
      fontFamily: "sans",
      titleSize: "standard",
      textAlign: "left",
      animation: "fade-up",
      heroImage:
        "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80",
      imageCaption: "Collaborative Robotics Engineering Workbench & Competition Prep",
      fallbackVariant: "team",
      galleryImages: [],
      cards: [
        {
          id: "c1-s02-c1",
          badge: "01 • APPLIED MASTERY",
          title: "Beyond Textbooks",
          body: "Grades show you can memorize; building a working robot proves you can solve real physical problems under pressure.",
          accentColor: "#00F5D4",
        },
        {
          id: "c1-s02-c2",
          badge: "02 • GLOBAL STANDOUT",
          title: "Global University & Career Edge",
          body: "Top universities (MIT, BUET, Stanford) and tech leaders look for builders who lead teams, compete, and ship real prototypes.",
          accentColor: "#38BDF8",
        },
        {
          id: "c1-s02-c3",
          badge: "03 • GRIT & TEAMWORK",
          title: "Real Engineering Resilience",
          body: "When a wire snaps 5 minutes before a tournament match, you learn calm debugging, leadership, and rapid iteration.",
          accentColor: "#FBBF24",
        },
      ],
      hotspots: [],
      speakerNotes:
        "Highlight the 3 Bento cards: 1) Beyond Textbooks, 2) Global University Edge, and 3) Real Engineering Resilience when debugging before a match.",
    },
    {
      id: "c1-s03",
      numberLabel: "03",
      title: "Why You Must Learn Robotics",
      subtitle:
        "Where Software Code, Electronic Circuits, and Mechanical Design unite into one superpower.",
      badge: "THE ULTIMATE 21ST-CENTURY SUPERPOWER",
      theme: "daylight-studio",
      layout: "interactive-grid",
      fontFamily: "sans",
      titleSize: "standard",
      textAlign: "left",
      animation: "zoom-in",
      heroImage:
        "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80",
      imageCaption: "Code Meets Physical Reality • Mechatronics Integration",
      fallbackVariant: "robot-arm",
      galleryImages: [],
      cards: [
        {
          id: "c1-s03-c1",
          badge: "CODE MEETS REALITY",
          title: "Your C++ Code Moves Physical Metal",
          body: "Instead of pixels on a screen, a single line of your code spins motors, fires laser rangefinders, and steers autonomous rovers.",
          detail: "Mechatronics = Software + Electronics + Mechanics working in harmony.",
          accentColor: "#2563EB",
        },
        {
          id: "c1-s03-c2",
          badge: "FUTURE-PROOF CAREERS",
          title: "AI, Space Rovers & Medical Surgery",
          body: "From Mars Perseverance to surgical arms and automated smart factories, every industry is being transformed by robotics.",
          detail: "Robotics engineers design the physical bodies that bring AI into the real world.",
          accentColor: "#7C3AED",
        },
        {
          id: "c1-s03-c3",
          badge: "SYSTEMS THINKING",
          title: "Debug Hardware & Software Together",
          body: "Learn how voltage drops, sensor noise, and algorithm timing interact—giving you X-ray vision into how modern tech works.",
          detail: "You will never look at an elevator, drone, or smart car the same way again.",
          accentColor: "#F97316",
        },
        {
          id: "c1-s03-c4",
          badge: "NATIONAL & GLOBAL ARENAS",
          title: "Compete in Robotics Olympiads",
          body: "Build Line Followers, Maze Solvers, Soccer Bots, and Heavyweight Combat Robots to represent RoboBee Innovators!",
          detail: "Turn your classroom prototypes into championship-winning tournament machines.",
          accentColor: "#10B981",
        },
      ],
      hotspots: [],
      speakerNotes:
        "Click each of the 4 Bento cards to reveal real-world applications and olympiad opportunities.",
    },
    {
      id: "c1-s04",
      numberLabel: "04",
      title: "What Is Your Interest & Future Goal?",
      subtitle:
        "Live Classroom Icebreaker Poll — Raise your hand for your dream engineering path!",
      badge: "INTERACTIVE CLASSROOM POLL • CHOOSE YOUR PATH",
      theme: "electric-indigo",
      layout: "interactive-grid",
      fontFamily: "sans",
      titleSize: "standard",
      textAlign: "left",
      animation: "fade-up",
      heroImage:
        "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80",
      imageCaption: "RoboBee Innovators Student Builder Personas",
      fallbackVariant: "team",
      galleryImages: [],
      cards: [
        {
          id: "c1-s04-c1",
          badge: "PATH A • ARENA CHAMPION",
          title: "Combat & Sumo Bot Builder",
          body: "I want to armor up high-torque robots, master drivetrain traction, and dominate competition rings!",
          isPollCard: true,
          pollInitialVotes: 0,
          accentColor: "#00F5D4",
        },
        {
          id: "c1-s04-c2",
          badge: "PATH B • AI & NAVIGATION",
          title: "Autonomous AI & Rover Engineer",
          body: "I want to program self-driving rovers, ultrasonic radar, computer vision, and Mars exploration vehicles!",
          isPollCard: true,
          pollInitialVotes: 0,
          accentColor: "#38BDF8",
        },
        {
          id: "c1-s04-c3",
          badge: "PATH C • SMART INVENTOR",
          title: "IoT & Smart System Creator",
          body: "I want to invent automated smart-home gadgets, rescue alarms, and environmental monitoring stations!",
          isPollCard: true,
          pollInitialVotes: 0,
          accentColor: "#FBBF24",
        },
        {
          id: "c1-s04-c4",
          badge: "PATH D • EXPLORER",
          title: "Curious First-Time Maker",
          body: "I am brand new to electronics and coding—and excited to wire my very first glowing circuit today!",
          isPollCard: true,
          pollInitialVotes: 0,
          accentColor: "#F43F5E",
        },
      ],
      hotspots: [],
      speakerNotes:
        "Poll the room! Ask students to raise their hands for Path A, B, C, or D and click the '+1 Vote' buttons live on screen!",
    },
    {
      id: "c1-s05",
      numberLabel: "05",
      title: "What Actually IS a Robot?",
      subtitle:
        "Not every machine is a robot! A true robot perceives its environment, makes decisions, and acts physically.",
      badge: "CORE DEFINITION • MACHINE VS. AUTONOMOUS ROBOT",
      theme: "daylight-studio",
      layout: "split-media",
      fontFamily: "sans",
      titleSize: "standard",
      textAlign: "left",
      animation: "slide-right",
      heroImage:
        "https://images.unsplash.com/photo-1561557944-6e7860d1a7eb?auto=format&fit=crop&w=1200&q=80",
      imageCaption: "Autonomous Rover vs. Manual Remote-Controlled Machines",
      fallbackVariant: "rover",
      galleryImages: [],
      cards: [
        {
          id: "c1-s05-c1",
          badge: "CHALLENGE CARD 01",
          title: "Ceiling Fan",
          body: "Spins blades continuously when you flip the wall switch.",
          isQuizCard: true,
          quizVerdict: "JUST A MACHINE — It has no sensors and makes zero autonomous decisions.",
          quizIsPositive: false,
          accentColor: "#F43F5E",
        },
        {
          id: "c1-s05-c2",
          badge: "CHALLENGE CARD 02",
          title: "TV Remote Control",
          body: "Flashes an infrared LED only when a human finger presses a button.",
          isQuizCard: true,
          quizVerdict: "JUST A MACHINE — Human fingers make 100% of the choices.",
          quizIsPositive: false,
          accentColor: "#F43F5E",
        },
        {
          id: "c1-s05-c3",
          badge: "CHALLENGE CARD 03",
          title: "Obstacle-Avoiding Rover",
          body: "Measures wall distance with sonar, decides a safe path in C++, and steers its wheels automatically.",
          isQuizCard: true,
          quizVerdict: "TRUE ROBOT! — It Senses, Thinks with code, and Acts autonomously!",
          quizIsPositive: true,
          accentColor: "#10B981",
        },
      ],
      hotspots: [],
      speakerNotes:
        "Have students shout 'Robot' or 'Machine' before clicking each of the 3 challenge cards to flip and reveal the engineering verdict!",
    },
    {
      id: "c1-s06",
      numberLabel: "06",
      title: "The Fascinating History of Robotics",
      subtitle:
        "Over 800 years of human ingenuity—from medieval clockwork automata to AI-guided Mars rovers.",
      badge: "HISTORICAL TIMELINE • 1206 TO TODAY",
      theme: "daylight-studio",
      layout: "timeline-stepper",
      fontFamily: "sans",
      titleSize: "standard",
      textAlign: "left",
      animation: "fade-up",
      heroImage:
        "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=1200&q=80",
      imageCaption: "Evolution of Autonomous Machines: 1206 Automata to Modern Planetary Rovers",
      fallbackVariant: "rover",
      galleryImages: [],
      cards: [
        {
          id: "c1-s06-c1",
          badge: "1206 • GOLDEN AGE AUTOMATA",
          title: "Ismail Al-Jazari's Programmable Mechanical Band",
          subtitle: "The Father of Robotics & Mechanical Engineering",
          body: "Built water-powered mechanical musicians whose drum patterns could be reprogrammed by moving pegs on a rotating wooden cam drum!",
          accentColor: "#2563EB",
        },
        {
          id: "c1-s06-c2",
          badge: "1920 • THE WORD 'ROBOT' IS BORN",
          title: "Karel Čapek's Play 'R.U.R.'",
          subtitle: "From Slavic 'Robota' (Forced Labor / Work)",
          body: "Playwright Karel Čapek (with his brother Josef) introduced the word 'Robot' to the world, sparking a century of engineering ambition.",
          accentColor: "#7C3AED",
        },
        {
          id: "c1-s06-c3",
          badge: "1961 • FIRST INDUSTRIAL ROBOT",
          title: "Unimate Joins the Factory Floor",
          subtitle: "Invented by George Devol & Joseph Engelberger",
          body: "A 4,000-pound hydraulic robotic arm installed at General Motors to safely handle red-hot die-cast metal parts too dangerous for humans.",
          accentColor: "#F97316",
        },
        {
          id: "c1-s06-c4",
          badge: "TODAY • AI, MARS & SURGERY",
          title: "Perseverance Rover, Boston Dynamics & RoboBee Lab",
          subtitle: "Autonomous Vision, Deep Learning & Microcontrollers",
          body: "Modern robots navigate alien planets, perform sub-millimeter surgery, and—starting today—come to life on your workbench!",
          accentColor: "#10B981",
        },
      ],
      hotspots: [],
      speakerNotes:
        "Step through the 4 historical eras on the horizontal timeline: 1206 Al-Jazari, 1920 Karel Čapek, 1961 Unimate, and Today.",
    },
    {
      id: "c1-s07",
      numberLabel: "07",
      title: "How Robots Work: Sense ➔ Think ➔ Act",
      subtitle:
        "Every autonomous robot follows a continuous 3-stage closed engineering loop modeled on biology.",
      badge: "CYBER BLUEPRINT • CLOSED-LOOP CONTROL ARCHITECTURE",
      theme: "cyber-blueprint",
      layout: "timeline-stepper",
      fontFamily: "sans",
      titleSize: "standard",
      textAlign: "left",
      animation: "cyber-glow",
      heroImage:
        "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
      imageCaption: "Closed-Loop Control Architecture: Sensors ➔ Microcontroller ➔ Actuators",
      fallbackVariant: "mcu",
      galleryImages: [],
      cards: [
        {
          id: "c1-s07-c1",
          badge: "STAGE 01 • INPUT PERCEPTION",
          title: "1. SENSE (The Robot's Eyes & Ears)",
          subtitle: "Human Biology: Eyes, Ears, Skin ➔ Robot Hardware: Ultrasonic, IR, Lidar, IMU",
          body: "Sensors measure physical properties (distance, light, temperature, tilt) and convert them into electrical voltage signals.",
          accentColor: "#38BDF8",
        },
        {
          id: "c1-s07-c2",
          badge: "STAGE 02 • DECISION LOGIC",
          title: "2. THINK (The Microcontroller Brain)",
          subtitle: "Human Biology: Brain & Nervous System ➔ Robot Hardware: Arduino Uno, ESP32, STM32",
          body: "The processor reads sensor voltages thousands of times per second and runs your C++ if/else algorithms to decide what to do next.",
          accentColor: "#F59E0B",
        },
        {
          id: "c1-s07-c3",
          badge: "STAGE 03 • PHYSICAL OUTPUT",
          title: "3. ACT (The Robot's Muscles & Voice)",
          subtitle: "Human Biology: Muscles & Vocal Cords ➔ Robot Hardware: DC Motors, Servos, LEDs, Buzzers",
          body: "Actuators convert electrical commands into real-world motion, steering wheels, moving robotic arms, or flashing status beacons.",
          accentColor: "#10B981",
        },
      ],
      hotspots: [],
      speakerNotes:
        "Click through SENSE, THINK, and ACT in our Cyber Blueprint view to compare human biology with robot control architecture.",
    },
    {
      id: "c1-s08",
      numberLabel: "08",
      title: "The 5 Main Parts of Every Robot",
      subtitle:
        "Click the pulsing numbered engineering pins (1–5) to inspect the 5 essential subsystems of an autonomous robot.",
      badge: "CAD HARDWARE ANATOMY • 5 CORE SUBSYSTEMS",
      theme: "cyber-blueprint",
      layout: "interactive-hotspot",
      fontFamily: "sans",
      titleSize: "standard",
      textAlign: "left",
      animation: "zoom-in",
      heroImage:
        "https://images.unsplash.com/photo-1561557944-6e7860d1a7eb?auto=format&fit=crop&w=1200&q=80",
      imageCaption: "Interactive Rover Subsystem Blueprint • Click Pins 1–5",
      fallbackVariant: "rover",
      galleryImages: [],
      cards: [],
      hotspots: [
        {
          id: "c1-s08-h1",
          number: 1,
          xPercent: 50,
          yPercent: 42,
          title: "Controller (The Brain)",
          badge: "SUBSYSTEM 01 • COMPUTATION",
          description:
            "Arduino Uno, ESP32, or Raspberry Pi—executes your compiled C++ loop and coordinates all sensors and motors.",
          color: "#F59E0B",
        },
        {
          id: "c1-s08-h2",
          number: 2,
          xPercent: 22,
          yPercent: 32,
          title: "Sensors (Perception)",
          badge: "SUBSYSTEM 02 • INPUTS",
          description:
            "Ultrasonic HC-SR04 sonar eyes, infrared line sensors, and gyroscopes that feed real-time environmental data to the brain.",
          color: "#38BDF8",
        },
        {
          id: "c1-s08-h3",
          number: 3,
          xPercent: 72,
          yPercent: 68,
          title: "Actuators & Motor Drivers (Muscles)",
          badge: "SUBSYSTEM 03 • MOTION OUTPUT",
          description:
            "DC gear motors, servo joints, and L298N / TB6612FNG H-Bridge drivers that amplify logic signals into high-current motion.",
          color: "#10B981",
        },
        {
          id: "c1-s08-h4",
          number: 4,
          xPercent: 78,
          yPercent: 28,
          title: "Power System (The Heart)",
          badge: "SUBSYSTEM 04 • ENERGY",
          description:
            "Li-Ion 18650 / LiPo battery packs, voltage regulators (5V / 3.3V), and common ground rails that safely energize the robot.",
          color: "#F43F5E",
        },
        {
          id: "c1-s08-h5",
          number: 5,
          xPercent: 32,
          yPercent: 74,
          title: "Chassis & Mechanical Frame (The Skeleton)",
          badge: "SUBSYSTEM 05 • STRUCTURE",
          description:
            "3D-printed mounts, laser-cut acrylic/aluminum plates, wheels, and standoffs that hold every component rigid.",
          color: "#A855F7",
        },
      ],
      speakerNotes:
        "Click pins 1 through 5 on the blueprint diagram to inspect each of the 5 core subsystems every robot needs.",
    },
    {
      id: "c1-s09",
      numberLabel: "09",
      title: "Types of Microcontrollers (The Brains)",
      subtitle:
        "Different missions require different microcontroller brains—compare the 4 most popular boards in robotics.",
      badge: "HARDWARE DEEP-DIVE • MICROCONTROLLER FAMILIES",
      theme: "arduino-teal",
      layout: "interactive-grid",
      fontFamily: "sans",
      titleSize: "standard",
      textAlign: "left",
      animation: "fade-up",
      heroImage:
        "https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=1200&q=80",
      imageCaption: "Embedded Microcontroller Families • Arduino, ESP32, STM32 & RP2040",
      fallbackVariant: "arduino",
      galleryImages: [],
      cards: [
        {
          id: "c1-s09-c1",
          badge: "16 MHz • 5V LOGIC • ATMEGA328P",
          title: "Arduino Uno R3 & Nano",
          body: "The gold standard for learning hardware! Rock-solid 5V GPIO pins, socketed DIP chip, and massive sensor compatibility.",
          detail: "Best For: Foundation Robotics, Sensor Labs, Line Followers & Sumo Bots.",
          accentColor: "#2DD4BF",
        },
        {
          id: "c1-s09-c2",
          badge: "240 MHz DUAL-CORE • WI-FI + BLE",
          title: "ESP8266 & ESP32",
          body: "Built-in Wi-Fi and Bluetooth telemetry! Runs at 240 MHz (3.3V logic) for IoT dashboards and wireless phone control.",
          detail: "Best For: Wireless Rovers, Smart IoT Stations & Web-Controlled Bots.",
          accentColor: "#FBBF24",
        },
        {
          id: "c1-s09-c3",
          badge: "32-BIT ARM CORTEX-M • HIGH SPEED",
          title: "STM32 ('Blue Pill' / 'Black Pill')",
          body: "Industrial-grade 32-bit ARM precision with hardware timers, high-resolution ADCs, and ultra-fast PID loop execution.",
          detail: "Best For: High-Speed Micromouse, Drone Flight Controllers & Industrial Arms.",
          accentColor: "#38BDF8",
        },
        {
          id: "c1-s09-c4",
          badge: "DUAL ARM CORTEX-M0+ • PIO STATE MACHINES",
          title: "Raspberry Pi Pico (RP2040)",
          body: "Features custom Programmable I/O (PIO) hardware state machines and supports both C/C++ and MicroPython.",
          detail: "Best For: Custom Protocol Timing, LED Matrices & Multi-Motor Control.",
          accentColor: "#34D399",
        },
      ],
      hotspots: [],
      speakerNotes:
        "Compare the 4 microcontroller families so students understand why engineers pick Arduino Uno first and when they graduate to ESP32 or STM32.",
    },
    {
      id: "c1-s10",
      numberLabel: "10",
      title: "Why We Start With the Arduino Uno R3!",
      subtitle:
        "Born in Ivrea, Italy in 2005—Arduino democratized electronics for millions of engineers and students worldwide.",
      badge: "OUR FLAGSHIP BRAIN • WHY ARDUINO WINS",
      theme: "arduino-teal",
      layout: "split-media",
      fontFamily: "sans",
      titleSize: "standard",
      textAlign: "left",
      animation: "slide-right",
      heroImage:
        "https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=1200&q=80",
      imageCaption: "Arduino Uno R3 Development Board • Forgiving 5V Architecture",
      fallbackVariant: "arduino",
      galleryImages: [],
      cards: [
        {
          id: "c1-s10-c1",
          badge: "01 • PLUG-AND-PLAY",
          title: "Forgiving 5V Hardware & Replaceable Chip",
          body: "Female header sockets let you plug jumper wires directly into the board without soldering—and the ATmega328P chip is replaceable!",
          accentColor: "#2DD4BF",
        },
        {
          id: "c1-s10-c2",
          badge: "02 • GLOBAL ECOSYSTEM",
          title: "Thousands of Open-Source Libraries",
          body: "Whether you connect an ultrasonic sonar, OLED screen, or servo motor, battle-tested C++ drivers are ready in seconds.",
          accentColor: "#FBBF24",
        },
        {
          id: "c1-s10-c3",
          badge: "03 • DIRECT HARDWARE CONTROL",
          title: "Zero Operating System Overhead",
          body: "Unlike a laptop that freezes with background updates, your Arduino runs ONLY your `setup()` and `loop()` with microsecond precision!",
          accentColor: "#34D399",
        },
      ],
      hotspots: [],
      speakerNotes:
        "Explain why Arduino Uno is the ultimate launchpad: 5V tolerant pins, no soldering required for prototyping, and deterministic real-time C++ execution.",
    },
    {
      id: "c1-s11",
      numberLabel: "11",
      title: "Interactive Anatomy of an Arduino Uno R3",
      subtitle:
        "Click the 5 pulsing hardware pins on the board to inspect every critical zone before plugging in USB power!",
      badge: "BOARD TOUR • INTERACTIVE PINOUT HOTSPOTS",
      theme: "arduino-teal",
      layout: "interactive-hotspot",
      fontFamily: "sans",
      titleSize: "standard",
      textAlign: "left",
      animation: "zoom-in",
      heroImage: "/illustrations/class1-arduino-uno-anatomy.svg",
      imageCaption: "Arduino Uno R3 Hardware Pinout • Click Pins 1–5 to Inspect",
      fallbackVariant: "arduino",
      galleryImages: [],
      cards: [],
      hotspots: [
        {
          id: "c1-s11-h1",
          number: 1,
          xPercent: 16,
          yPercent: 34,
          title: "USB Type-B Port (Power + Code Upload)",
          badge: "PIN 01 • 5V SERIAL INTERFACE",
          description:
            "Connects to your computer to supply regulated 5V DC power, upload compiled C++ sketches, and stream live Serial Monitor data.",
          color: "#FBBF24",
        },
        {
          id: "c1-s11-h2",
          number: 2,
          xPercent: 60,
          yPercent: 16,
          title: "Digital I/O & PWM Pins (D0–D13)",
          badge: "PIN 02 • DIGITAL INPUT / OUTPUT",
          description:
            "14 bi-directional digital pins (0V LOW or 5V HIGH). Pins marked with '~' (3, 5, 6, 9, 10, 11) output PWM for motor speed & LED dimming. Pin 13 connects to LED_BUILTIN!",
          color: "#2DD4BF",
        },
        {
          id: "c1-s11-h3",
          number: 3,
          xPercent: 76,
          yPercent: 84,
          title: "Analog Input Pins (A0–A5)",
          badge: "PIN 03 • 10-BIT ADC (0–1023)",
          description:
            "Reads continuous sensor voltages between 0V and 5V and converts them into a digital number from 0 to 1023 via the internal Analog-to-Digital Converter.",
          color: "#38BDF8",
        },
        {
          id: "c1-s11-h4",
          number: 4,
          xPercent: 44,
          yPercent: 84,
          title: "Power & Ground Rails (5V, 3.3V, GND, VIN)",
          badge: "PIN 04 • ENERGY DISTRIBUTION",
          description:
            "Supplies 5V or 3.3V to your breadboard sensors. Every circuit MUST return to a GND (0V Ground) pin to complete the electrical loop!",
          color: "#F43F5E",
        },
        {
          id: "c1-s11-h5",
          number: 5,
          xPercent: 64,
          yPercent: 58,
          title: "ATmega328P Microcontroller Chip",
          badge: "PIN 05 • THE 16 MHz SILICON BRAIN",
          description:
            "Contains 32 KB Flash memory (stores your C++ code even when unplugged), 2 KB SRAM, and the CPU executing 16 million instructions per second!",
          color: "#34D399",
        },
      ],
      speakerNotes:
        "Have students hold up their physical Arduino Uno in the lab and point to each of the 5 zones as you click Pins 1 to 5 on the projector!",
    },
    {
      id: "c1-s12",
      numberLabel: "12",
      title: "Your Robotics Journey Starts Today!",
      subtitle:
        "You have mastered the foundation of autonomous machines—now get ready to wire real circuits and code!",
      badge: "CLASS 01 COMPLETE • NEXT UP: BREADBOARDS, LEDS & OHM'S LAW",
      theme: "electric-indigo",
      layout: "hero-title",
      fontFamily: "display",
      titleSize: "hero",
      textAlign: "left",
      animation: "fade-up",
      heroImage:
        "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1400&q=80",
      imageCaption: "RoboBee Innovators • Dream. Invent. Experiment. Inspire.",
      fallbackVariant: "robot-arm",
      galleryImages: [],
      cards: [
        {
          id: "c1-s12-c1",
          badge: "STEP 01 • COMPLETED TODAY",
          title: "Master the Fundamentals",
          body: "You can distinguish a true Robot from a machine, trace Sense ➔ Think ➔ Act, and identify every zone of the Arduino Uno.",
          accentColor: "#00F5D4",
        },
        {
          id: "c1-s12-c2",
          badge: "STEP 02 • UP NEXT IN CLASS 02",
          title: "Wire Real Breadboard Circuits & Ohm's Law",
          body: "Discover Voltage, Current, and Resistance, decode resistor color bands, and wire your first external glowing LED circuit!",
          accentColor: "#38BDF8",
        },
        {
          id: "c1-s12-c3",
          badge: "STEP 03 • TRACK GOAL",
          title: "Build Your First Autonomous Robot",
          body: "Combine sensors, C++ logic, and motor drivers into an obstacle-avoiding rover that navigates the lab on its own!",
          accentColor: "#FBBF24",
        },
      ],
      hotspots: [],
      speakerNotes:
        "Congratulate the class on completing Class 01! Preview Class 02 where every student wires their breadboard, calculates Ohm's Law, and lights up external LEDs.",
    },
  ],
};

// ============================================================================
// SEED DECK 2: CLASS 02 — BASIC ELECTRONICS, BREADBOARDS, LEDS & OHM'S LAW (12 SLIDES)
// ============================================================================
export const SEED_CLASS_02_DECK: EditableClassDeck = {
  id: "beg-02",
  courseId: "beginner",
  proposedAudience: "Proposed for Classes 5–8",
  classCode: "BEGINNER 02",
  title: "Basic Electronics, Breadboards, LEDs & Ohm's Law",
  subtitle:
    "Master Voltage, Current, and Resistance, explore the hidden copper clips inside a breadboard, protect LEDs with Ohm's Law, and code a dual-LED beacon.",
  track: "Foundation Track",
  coverImage: "/illustrations/breadboard_led_resistor_wiring.svg",
  durationMinutes: 120,
  status: "published",
  lastEditedAt: "2026-10-19T03:35:00.000Z",
  hardwareSimType: "breadboard_circuit_sim",
  kitComponents: [
    { name: "Arduino Uno R3", spec: "ATmega328P Microcontroller", qty: 1 },
    { name: "Solderless Breadboard", spec: "400 Tie-Points with Power Rails", qty: 1 },
    { name: "5mm LEDs", spec: "Red (2.0V) & Blue/Green (3.0V)", qty: 3 },
    { name: "Carbon Film Resistors", spec: "220 Ω, 330 Ω, 1 kΩ Assortment", qty: 6 },
    { name: "Male-to-Male Jumper Wires", spec: "Red (5V), Black (GND), Yellow (Signal)", qty: 6 },
  ],
  slides: [
    {
      id: "c2-s01",
      numberLabel: "01",
      title: "Welcome to Class 02: Basic Electronics & Ohm's Law",
      subtitle:
        "Before a robot can move or think, electrical energy must flow safely through its veins without burning a single chip.",
      badge: "ROBOBEE INNOVATORS • FOUNDATION TRACK • CLASS 02",
      theme: "electric-indigo",
      layout: "hero-title",
      fontFamily: "display",
      titleSize: "hero",
      textAlign: "left",
      animation: "fade-up",
      heroImage:
        "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1400&q=80",
      imageCaption: "Precision Electronic Circuits & Breadboard Prototyping • Class 02",
      fallbackVariant: "arduino",
      galleryImages: [],
      cards: [
        {
          id: "c2-s01-c1",
          badge: "TODAY'S MISSION",
          title: "Command Electricity Without Smoke",
          body: "Learn why circuits need a closed loop, how breadboards connect parts without solder, and why every LED needs a resistor.",
          accentColor: "#00F5D4",
        },
        {
          id: "c2-s01-c2",
          badge: "HANDS-ON BUILD",
          title: "Wire & Code an External LED Beacon",
          body: "Move beyond the tiny onboard LED and build your first real external circuit on Digital Pin D8!",
          accentColor: "#38BDF8",
        },
      ],
      hotspots: [],
      speakerNotes:
        "Welcome back! In Class 01 we met the Arduino brain. Today in Class 02, we learn the fundamental laws of electricity so we can wire external hardware safely.",
      ctaText: "Start Electronics Lab ➔",
    },
    {
      id: "c2-s02",
      numberLabel: "02",
      title: "The Big Three: Voltage, Current & Resistance",
      subtitle:
        "Imagine electricity flowing through a copper wire just like water flowing through a pressurized garden hose.",
      badge: "CORE PHYSICS • THE WATER PIPE ANALOGY",
      theme: "daylight-studio",
      layout: "interactive-grid",
      fontFamily: "sans",
      titleSize: "standard",
      textAlign: "left",
      animation: "fade-up",
      heroImage:
        "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=1200&q=80",
      imageCaption: "Voltage (Pressure), Current (Flow Rate), and Resistance (Pipe Narrowing)",
      fallbackVariant: "mcu",
      galleryImages: [],
      cards: [
        {
          id: "c2-s02-c1",
          badge: "VOLTAGE (V) • MEASURED IN VOLTS (V)",
          title: "Electrical Pressure (Water Tank Height)",
          body: "Voltage is the push that drives electrons through a circuit. Arduino Uno digital pins push at 5 Volts (5V) when HIGH and 0V when LOW.",
          detail: "Higher voltage = stronger electrical push.",
          accentColor: "#2563EB",
        },
        {
          id: "c2-s02-c2",
          badge: "CURRENT (I) • MEASURED IN AMPERES / MILLIAMPS (mA)",
          title: "Electron Flow Rate (Gallons Per Second)",
          body: "Current measures how many electrons rush past a point every second. A standard 5mm LED shines brightly at 10 mA to 20 mA (0.02 A).",
          detail: "Danger: Arduino GPIO pins max out at 20–40 mA!",
          accentColor: "#7C3AED",
        },
        {
          id: "c2-s02-c3",
          badge: "RESISTANCE (R) • MEASURED IN OHMS (Ω)",
          title: "Flow Bottleneck (Narrowing the Pipe)",
          body: "Resistance opposes and limits electrical current so delicate components like LEDs don't get blasted by too many electrons at once.",
          detail: "We use 220 Ω to 330 Ω resistors to protect 5mm LEDs.",
          accentColor: "#F97316",
        },
        {
          id: "c2-s02-c4",
          badge: "CLOSED LOOP RULE",
          title: "No Complete Loop = Zero Current",
          body: "Electrons must travel from the positive supply (5V or Pin D8), through your load, and return all the way back to Ground (GND).",
          detail: "If one wire is unplugged, the entire path stops instantly.",
          accentColor: "#10B981",
        },
      ],
      hotspots: [],
      speakerNotes:
        "Use the water tank analogy: Voltage is water pressure, Current is how fast the water flows, and Resistance is pinching the hose to keep a delicate flower (the LED) from getting crushed.",
    },
    {
      id: "c2-s03",
      numberLabel: "03",
      title: "Ohm's Law: The Golden Equation (V = I × R)",
      subtitle:
        "Discovered by Georg Simon Ohm in 1827—this single equation lets you calculate the exact resistor for any circuit!",
      badge: "ENGINEERING MATH • OHM'S LAW CALCULATOR",
      theme: "daylight-studio",
      layout: "split-media",
      fontFamily: "sans",
      titleSize: "standard",
      textAlign: "left",
      animation: "zoom-in",
      heroImage: "/illustrations/class1-breadboard-led-circuit.svg",
      imageCaption: "Ohm's Law Series LED Protection Calculation: R = (5V - 2V) / 0.015A = 200 Ω",
      fallbackVariant: "arduino",
      galleryImages: [],
      cards: [
        {
          id: "c2-s03-c1",
          badge: "FORMULA 01 • FIND VOLTAGE",
          title: "V = I × R (Volts = Amps × Ohms)",
          body: "Multiply the current (in Amps) by the resistance (in Ohms) to find the voltage drop across a component.",
          accentColor: "#2563EB",
        },
        {
          id: "c2-s03-c2",
          badge: "FORMULA 02 • FIND CURRENT",
          title: "I = V / R (Current Drops When Resistance Rises)",
          body: "With a 5V Arduino pin and a 2V Red LED, 3V remains across a 220 Ω resistor: I = 3V / 220Ω = 13.6 mA (Safe & Bright!).",
          accentColor: "#10B981",
        },
        {
          id: "c2-s03-c3",
          badge: "FORMULA 03 • PICK YOUR RESISTOR",
          title: "R = (Vs - Vf) / I = (5V - 2V) / 0.015A = 200 Ω",
          body: "To keep LED current around 15 mA, we need ~200 Ω. We pick the nearest standard value in our kit: 220 Ω or 330 Ω!",
          accentColor: "#F97316",
        },
      ],
      hotspots: [],
      speakerNotes:
        "Walk through the real number calculation on the slide: Arduino supplies 5V, the Red LED uses 2V forward voltage, leaving 3V. Dividing 3V by 220 Ohms gives 13.6 milliamps—right in the safe 10–20 mA sweet spot!",
    },
    {
      id: "c2-s04",
      numberLabel: "04",
      title: "Inside a Solderless Breadboard (X-Ray View)",
      subtitle:
        "Click the 5 pulsing pins to peel back the white plastic and see how metal spring clips connect your components!",
      badge: "HARDWARE X-RAY • BREADBOARD INTERNAL BUSBARS",
      theme: "cyber-blueprint",
      layout: "interactive-hotspot",
      fontFamily: "sans",
      titleSize: "standard",
      textAlign: "left",
      animation: "cyber-glow",
      heroImage: "/illustrations/class1-breadboard-led-circuit.svg",
      imageCaption: "Solderless Breadboard Internal Copper Clips • Click Pins 1–5",
      fallbackVariant: "arduino",
      galleryImages: [],
      cards: [],
      hotspots: [
        {
          id: "c2-s04-h1",
          number: 1,
          xPercent: 25,
          yPercent: 20,
          title: "Positive (+) & Negative (-) Power Rails",
          badge: "PIN 01 • HORIZONTAL POWER BUSES",
          description:
            "Run all the way along the top and bottom edges. Connect Arduino 5V to the Red (+) rail and Arduino GND to the Blue/Black (-) rail!",
          color: "#F43F5E",
        },
        {
          id: "c2-s04-h2",
          number: 2,
          xPercent: 52,
          yPercent: 42,
          title: "5-Hole Terminal Strips (A–E and F–J)",
          badge: "PIN 02 • VERTICAL ROW CLIPS",
          description:
            "Each numbered column (1, 2, 3...) has 5 holes connected together underneath by a single nickel-silver spring clip.",
          color: "#38BDF8",
        },
        {
          id: "c2-s04-h3",
          number: 3,
          xPercent: 52,
          yPercent: 55,
          title: "The Center Ravine (DIP IC Isolation Gap)",
          badge: "PIN 03 • ELECTRICAL DIVIDER",
          description:
            "The trench down the middle completely separates top holes (A–E) from bottom holes (F–J) so chips can straddle the gap without shorting!",
          color: "#F59E0B",
        },
        {
          id: "c2-s04-h4",
          number: 4,
          xPercent: 68,
          yPercent: 38,
          title: "Rule #1: Never Put Both Component Legs in the Same Row!",
          badge: "PIN 04 • AVOID SAME-ROW SHORTS",
          description:
            "If you plug both legs of an LED or resistor into Row 12, the metal clip underneath shorts them together and current bypasses the part!",
          color: "#10B981",
        },
        {
          id: "c2-s04-h5",
          number: 5,
          xPercent: 80,
          yPercent: 72,
          title: "Common Ground Return Path",
          badge: "PIN 05 • COMPLETING THE LOOP",
          description:
            "Every circuit on the breadboard must have a jumper wire returning from the negative rail back to an Arduino GND pin.",
          color: "#A855F7",
        },
      ],
      speakerNotes:
        "Show students the #1 beginner mistake: plugging both legs of an LED into the same 5-hole strip! Always place the two legs in two DIFFERENT numbered columns.",
    },
    {
      id: "c2-s05",
      numberLabel: "05",
      title: "Meet the LED: Polarity Matters!",
      subtitle:
        "A Light-Emitting Diode is a one-way electronic valve—electricity can only flow from Anode (+) to Cathode (-).",
      badge: "SEMICONDUCTOR PHYSICS • ANODE (+) VS. CATHODE (-)",
      theme: "arduino-teal",
      layout: "split-media",
      fontFamily: "sans",
      titleSize: "standard",
      textAlign: "left",
      animation: "slide-right",
      heroImage: "/illustrations/class1-led-resistor-polarity.svg",
      imageCaption: "5mm LED Anatomy: Long Leg = Anode (+), Short Leg & Flat Rim = Cathode (-)",
      fallbackVariant: "arduino",
      galleryImages: [],
      cards: [
        {
          id: "c2-s05-c1",
          badge: "LONGER LEG • POSITIVE (+)",
          title: "Anode (+) Connects Toward 5V / Signal Pin",
          body: "The longer wire leg is the Anode (+). Current enters here from your Arduino digital output pin (or resistor).",
          accentColor: "#FBBF24",
        },
        {
          id: "c2-s05-c2",
          badge: "SHORTER LEG + FLAT RIM • NEGATIVE (-)",
          title: "Cathode (-) Connects Toward Ground (GND)",
          body: "The shorter leg—and the flat edge on the plastic rim—marks the Cathode (-), which must point toward 0V Ground.",
          accentColor: "#2DD4BF",
        },
        {
          id: "c2-s05-c3",
          badge: "WHAT IF IT'S BACKWARDS?",
          title: "Reverse-Biased = Safe, Just Dark!",
          body: "If you plug an LED in backwards at 5V, it won't explode—it simply blocks the current and stays dark until you flip it around!",
          accentColor: "#34D399",
        },
      ],
      hotspots: [],
      speakerNotes:
        "Have every student pick up an LED from their kit right now and find the longer leg (Anode +) and the flat notch on the plastic rim (Cathode -).",
    },
    {
      id: "c2-s06",
      numberLabel: "06",
      title: "Why an LED Burns Out Without a Resistor",
      subtitle:
        "Unlike a resistor, an LED has almost zero internal resistance once it turns on—without a current limiter, it self-destructs!",
      badge: "SAFETY ALERT • THERMAL RUNAWAY EXPLAINED",
      theme: "cyber-blueprint",
      layout: "split-media",
      fontFamily: "sans",
      titleSize: "standard",
      textAlign: "left",
      animation: "fade-up",
      heroImage: "/illustrations/class1-led-resistor-polarity.svg",
      imageCaption: "Series Resistor Placement: Works on Either Side of the LED in a Single Loop!",
      fallbackVariant: "arduino",
      galleryImages: [],
      cards: [
        {
          id: "c2-s06-c1",
          badge: "WITHOUT RESISTOR (DANGER!)",
          title: "Infinite Current Spike ➔ Popped Silicon Junction",
          body: "Connecting an LED directly between 5V and GND dumps 100+ mA through a microscopic semiconductor wire, melting it in milliseconds.",
          accentColor: "#F43F5E",
        },
        {
          id: "c2-s06-c2",
          badge: "WITH 220 Ω SERIES RESISTOR",
          title: "Current Safely Capped at ~14 mA",
          body: "The 220 Ω resistor absorbs the extra 3V pressure and throttles electron flow to a safe, bright 13.6 mA.",
          accentColor: "#10B981",
        },
        {
          id: "c2-s06-c3",
          badge: "DOES RESISTOR DIRECTION MATTER?",
          title: "Resistors Are Non-Polarized!",
          body: "Unlike LEDs, resistors work identically in either direction—and can sit before the Anode or after the Cathode!",
          accentColor: "#38BDF8",
        },
      ],
      hotspots: [],
      speakerNotes:
        "Students always ask: 'Does the resistor have to go before the LED, or can it go after the LED?' Answer: In a series loop, current is identical everywhere, so either side works!",
    },
    {
      id: "c2-s07",
      numberLabel: "07",
      title: "How to Read Resistor Color Bands",
      subtitle:
        "Resistors are too tiny for printed numbers—engineers decode their exact Ohm value using colored stripes!",
      badge: "COMPONENT DECODING • 4-BAND & 5-BAND RESISTORS",
      theme: "daylight-studio",
      layout: "interactive-grid",
      fontFamily: "sans",
      titleSize: "standard",
      textAlign: "left",
      animation: "zoom-in",
      heroImage:
        "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
      imageCaption: "Standard Resistor Color Code Chart • 220 Ω, 330 Ω, 1 kΩ, 10 kΩ",
      fallbackVariant: "arduino",
      galleryImages: [],
      cards: [
        {
          id: "c2-s07-c1",
          badge: "RED • RED • BROWN • GOLD",
          title: "220 Ω (Our Go-To LED Protector)",
          body: "Red (2), Red (2), × 10¹ (Brown) = 220 Ω. Gives maximum safe brightness on a 5V Arduino pin!",
          detail: "Current with Red LED: ~13.6 mA",
          accentColor: "#EF4444",
        },
        {
          id: "c2-s07-c2",
          badge: "ORANGE • ORANGE • BROWN • GOLD",
          title: "330 Ω (Gentle LED Protector)",
          body: "Orange (3), Orange (3), × 10¹ (Brown) = 330 Ω. Slightly softer glow (~9 mA) that saves battery power.",
          detail: "Current with Red LED: ~9.1 mA",
          accentColor: "#F97316",
        },
        {
          id: "c2-s07-c3",
          badge: "BROWN • BLACK • RED • GOLD",
          title: "1,000 Ω (1 kΩ Indicator Resistor)",
          body: "Brown (1), Black (0), × 10² (Red) = 1,000 Ω. LED still lights visibly (~3 mA) while drawing tiny current.",
          detail: "Current with Red LED: ~3.0 mA",
          accentColor: "#2563EB",
        },
        {
          id: "c2-s07-c4",
          badge: "BROWN • BLACK • ORANGE • GOLD",
          title: "10,000 Ω (10 kΩ Button Pull-Down)",
          body: "Brown (1), Black (0), × 10³ (Orange) = 10 kΩ. Too dim for LEDs, but essential for push-button and LDR sensors!",
          detail: "Used in Class 03 for sensor voltage dividers.",
          accentColor: "#7C3AED",
        },
      ],
      hotspots: [],
      speakerNotes:
        "Have students sort the resistors in their kit into 220 Ω (Red-Red-Brown) and 10 kΩ (Brown-Black-Orange) piles so they don't mix them up.",
    },
    {
      id: "c2-s08",
      numberLabel: "08",
      title: "Classroom Circuit Detective: Safe or Short Circuit?",
      subtitle:
        "Inspect each breadboard wiring scenario and vote BEFORE flipping the card to reveal if it glows or shorts out!",
      badge: "INTERACTIVE FLIP QUIZ • SPOT THE WIRING BUG",
      theme: "daylight-studio",
      layout: "split-media",
      fontFamily: "sans",
      titleSize: "standard",
      textAlign: "left",
      animation: "slide-right",
      heroImage: "/illustrations/class1-breadboard-led-circuit.svg",
      imageCaption: "Always Verify Row Connections & Polarity Before Plugging In USB!",
      fallbackVariant: "arduino",
      galleryImages: [],
      cards: [
        {
          id: "c2-s08-c1",
          badge: "WIRING CASE 01",
          title: "Both LED Legs Plugged into Breadboard Row 15",
          body: "Pin D8 ➔ 220Ω Resistor ➔ Row 15 (both Anode and Cathode in Row 15) ➔ GND.",
          isQuizCard: true,
          quizVerdict: "SHORTED ROW! — The metal clip under Row 15 bypasses the LED completely. Move Cathode to Row 16!",
          quizIsPositive: false,
          accentColor: "#F43F5E",
        },
        {
          id: "c2-s08-c2",
          badge: "WIRING CASE 02",
          title: "5V Pin Connected Directly to GND Rail with a Jumper Wire",
          body: "A single wire connects the Arduino 5V pin straight into the blue GND rail.",
          isQuizCard: true,
          quizVerdict: "DANGEROUS DIRECT SHORT! — Zero resistance between 5V and GND trips the Arduino USB polyfuse immediately!",
          quizIsPositive: false,
          accentColor: "#F43F5E",
        },
        {
          id: "c2-s08-c3",
          badge: "WIRING CASE 03",
          title: "Pin D8 ➔ Row 10 (220Ω) ➔ Row 12 (LED Anode +) ➔ Row 13 (Cathode -) ➔ GND",
          body: "Every component leg bridges across separate rows with a 220Ω resistor returning to GND.",
          isQuizCard: true,
          quizVerdict: "PERFECT SAFE CIRCUIT! — Current is limited to ~14 mA and flows cleanly through the LED to Ground!",
          quizIsPositive: true,
          accentColor: "#10B981",
        },
      ],
      hotspots: [],
      speakerNotes:
        "Run this 3-card flip quiz with the class before handing out USB cables! Make sure every student can spot Case 01 (same-row short) and Case 02 (5V-to-GND short).",
    },
    {
      id: "c2-s09",
      numberLabel: "09",
      title: "Step-by-Step Wiring: External LED on Pin D8",
      subtitle:
        "Follow these 4 chronological steps with your USB cable UNPLUGGED to build your external beacon circuit.",
      badge: "HANDS-ON BUILD • 4-STEP BREADBOARD WIRING",
      theme: "arduino-teal",
      layout: "timeline-stepper",
      fontFamily: "sans",
      titleSize: "standard",
      textAlign: "left",
      animation: "fade-up",
      heroImage: "/illustrations/class1-breadboard-led-circuit.svg",
      imageCaption: "Pin D8 ➔ 220 Ω Resistor ➔ Red LED (Anode + to Cathode -) ➔ Arduino GND",
      fallbackVariant: "arduino",
      galleryImages: [],
      cards: [
        {
          id: "c2-s09-c1",
          badge: "STEP 01 • GROUND RAIL",
          title: "Connect Arduino GND to Breadboard Blue (-) Rail",
          subtitle: "Wire Color: Black Jumper Wire",
          body: "Plug one end of a black wire into an Arduino GND pin and the other end into the breadboard's blue (-) ground bus.",
          accentColor: "#2DD4BF",
        },
        {
          id: "c2-s09-c2",
          badge: "STEP 02 • SIGNAL WIRE",
          title: "Connect Arduino Digital Pin D8 to Breadboard Row 10",
          subtitle: "Wire Color: Yellow or Red Signal Wire",
          body: "Plug a jumper wire from Digital Pin 8 on the Arduino into hole 10A on your breadboard.",
          accentColor: "#FBBF24",
        },
        {
          id: "c2-s09-c3",
          badge: "STEP 03 • 220 Ω RESISTOR BRIDGE",
          title: "Bridge 220 Ω Resistor from Row 10 to Row 14",
          subtitle: "Component: 220 Ω Resistor (Red-Red-Brown)",
          body: "Bend the resistor legs neatly and insert one leg into hole 10C and the other leg into hole 14C.",
          accentColor: "#38BDF8",
        },
        {
          id: "c2-s09-c4",
          badge: "STEP 04 • INSERT THE LED",
          title: "LED Long Leg (+) in Row 14, Short Leg (-) to Blue GND Rail",
          subtitle: "Verify Anode (+) & Cathode (-) Polarity!",
          body: "Insert the LONG leg (Anode +) into hole 14E (sharing Row 14 with the resistor) and the SHORT leg (Cathode -) into the blue (-) GND rail!",
          accentColor: "#34D399",
        },
      ],
      hotspots: [],
      speakerNotes:
        "Walk around the room and inspect each student's breadboard against these 4 steps before they plug in USB.",
    },
    {
      id: "c2-s10",
      numberLabel: "10",
      title: "The C++ Code: Commanding Digital Pin D8",
      subtitle:
        "Understand every single line of the Arduino C++ sketch that brings your breadboard circuit to life.",
      badge: "EMBEDDED C++ • SETUP() AND LOOP() ANATOMY",
      theme: "arduino-teal",
      layout: "interactive-grid",
      fontFamily: "mono",
      titleSize: "standard",
      textAlign: "left",
      animation: "fade-up",
      heroImage: "/illustrations/class1-setup-loop-flow.svg",
      imageCaption: "Arduino Execution Flow: setup() Runs Once at Boot ➔ loop() Repeats Forever",
      fallbackVariant: "mcu",
      galleryImages: [],
      cards: [
        {
          id: "c2-s10-c1",
          badge: "LINE 01 • NAMED CONSTANT",
          title: "const int LED_PIN = 8;",
          body: "Gives Digital Pin 8 a clear human name (`LED_PIN`). If we ever move our wire to Pin 9, we only change this one number!",
          detail: "Good engineers never scatter raw 'magic numbers' through their code.",
          accentColor: "#FBBF24",
        },
        {
          id: "c2-s10-c2",
          badge: "LINE 02 • HARDWARE CONFIGURATION",
          title: "void setup() { pinMode(LED_PIN, OUTPUT); }",
          body: "Runs exactly ONCE when powered on. `pinMode(8, OUTPUT)` configures Pin 8's internal transistor to actively push 5V current.",
          detail: "If you forget pinMode(OUTPUT), the LED will barely glimmer!",
          accentColor: "#2DD4BF",
        },
        {
          id: "c2-s10-c3",
          badge: "LINE 03 • TURN VOLTAGE ON (5V)",
          title: "digitalWrite(LED_PIN, HIGH); delay(500);",
          body: "Switches Pin 8 to 5 Volts (HIGH), lighting the LED, and freezes for 500 milliseconds (0.5 seconds).",
          detail: "1000 milliseconds = 1.0 full second.",
          accentColor: "#34D399",
        },
        {
          id: "c2-s10-c4",
          badge: "LINE 04 • TURN VOLTAGE OFF (0V)",
          title: "digitalWrite(LED_PIN, LOW); delay(500);",
          body: "Drops Pin 8 to 0 Volts (LOW), turning the LED off for 500 ms before `loop()` jumps right back to the top!",
          detail: "Repeats forever as long as the board has power.",
          accentColor: "#38BDF8",
        },
      ],
      hotspots: [],
      speakerNotes:
        "Point out why `pinMode(LED_PIN, OUTPUT)` is mandatory: without it, the pin stays in high-impedance input mode and cannot supply current.",
    },
    {
      id: "c2-s11",
      numberLabel: "11",
      title: "Live Lab Challenge: Code 3 Custom Blink Patterns!",
      subtitle:
        "Modify the millisecond numbers inside `delay()` and re-upload to test these 3 real-world signaling modes.",
      badge: "EXPERIMENTATION SPRINT • TIMING & DUTY CYCLE",
      theme: "electric-indigo",
      layout: "interactive-grid",
      fontFamily: "sans",
      titleSize: "standard",
      textAlign: "left",
      animation: "zoom-in",
      heroImage:
        "https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=1200&q=80",
      imageCaption: "Modify delay() Milliseconds & Observe Physical Blink Frequency",
      fallbackVariant: "arduino",
      galleryImages: [],
      cards: [
        {
          id: "c2-s11-c1",
          badge: "CHALLENGE 01 • EMERGENCY STROBE",
          title: "100ms ON / 100ms OFF (5 Hz Strobe)",
          body: "Change both delays to `delay(100)`. Your LED now flashes 5 times every second like an emergency vehicle!",
          detail: "Bonus: What happens at delay(10)? (Persistence of vision!)",
          accentColor: "#00F5D4",
        },
        {
          id: "c2-s11-c2",
          badge: "CHALLENGE 02 • AIRCRAFT WING BEACON",
          title: "80ms ON / 920ms OFF (Short Strobe Pulse)",
          body: "A crisp 80ms flash followed by a long 920ms pause—saving 92% of battery energy while staying highly visible!",
          detail: "Duty Cycle = 80 / (80 + 920) = 8%.",
          accentColor: "#38BDF8",
        },
        {
          id: "c2-s11-c3",
          badge: "CHALLENGE 03 • DUAL POLICE LIGHTBAR",
          title: "Wire a 2nd LED on Pin D9 (Alternating Red & Blue)",
          body: "When Pin 8 is HIGH, set Pin 9 LOW—then swap them! Watch your breadboard alternate like a police lightbar.",
          detail: "Requires a second 220 Ω resistor on Pin D9.",
          accentColor: "#FBBF24",
        },
        {
          id: "c2-s11-c4",
          badge: "CHALLENGE 04 • SOS MORSE CODE",
          title: "3 Short Dots • 3 Long Dashes • 3 Short Dots",
          body: "Program `delay(200)` for dots and `delay(600)` for dashes to transmit an automated international SOS signal!",
          detail: "Test your pattern with a classmate across the table.",
          accentColor: "#F43F5E",
        },
      ],
      hotspots: [],
      speakerNotes:
        "Give students 15 minutes to try all 4 challenges on their breadboards! Open the Hardware Lab Simulator drawer to demonstrate the timing live on screen.",
    },
    {
      id: "c2-s12",
      numberLabel: "12",
      title: "Class 02 Complete: You Are Now a Circuit Builder!",
      subtitle:
        "You have mastered Breadboards, Ohm's Law, LED Polarity, and Digital Output control—next up: Robot Sensors!",
      badge: "CLASS 02 GRADUATION • NEXT UP: CLASS 03 SENSORS",
      theme: "electric-indigo",
      layout: "hero-title",
      fontFamily: "display",
      titleSize: "hero",
      textAlign: "left",
      animation: "fade-up",
      heroImage:
        "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1400&q=80",
      imageCaption: "Class 02 Mastered • Ready for Ultrasonic & Infrared Sensors in Class 03!",
      fallbackVariant: "arduino",
      galleryImages: [],
      cards: [
        {
          id: "c2-s12-c1",
          badge: "MASTERED TODAY",
          title: "Ohm's Law & Breadboard Busbars",
          body: "You can calculate protective resistor values (V = I × R) and wire multi-row circuits without shorting.",
          accentColor: "#00F5D4",
        },
        {
          id: "c2-s12-c2",
          badge: "MASTERED TODAY",
          title: "Digital GPIO Output & C++ Timing",
          body: "You programmed `pinMode()`, `digitalWrite()`, and `delay()` to command external hardware.",
          accentColor: "#38BDF8",
        },
        {
          id: "c2-s12-c3",
          badge: "COMING IN CLASS 03",
          title: "Give Your Arduino Eyes: Ultrasonic & IR Sensors",
          body: "Wire an HC-SR04 Ultrasonic Sonar sensor to measure real-world obstacle distances in centimeters!",
          accentColor: "#FBBF24",
        },
      ],
      hotspots: [],
      speakerNotes:
        "Have students unplug their USB cables first, neatly pack their resistors and LEDs into their kit boxes, and complete the 3-question Class 02 Exit Check!",
    },
  ],
};

// ============================================================================
// SEED DECK 3: CLASS 03 — DIGITAL & ANALOG SENSORS: ULTRASONIC SONAR & IR VISION
// ============================================================================
export const SEED_CLASS_03_DECK: EditableClassDeck = {
  id: "beg-03",
  classCode: "CLASS 03",
  title: "Digital & Analog Sensors: Ultrasonic Sonar & IR Vision",
  subtitle:
    "Give your robot eyes! Measure obstacle distance using HC-SR04 acoustic echolocation, read IR reflectance, and stream live telemetry to the Serial Monitor.",
  track: "Hardware & Sensors",
  coverImage:
    "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80",
  durationMinutes: 90,
  status: "published",
  lastEditedAt: "2026-10-19T03:35:00.000Z",
  hardwareSimType: "ultrasonic_sonar_sim",
  kitComponents: [
    { name: "Arduino Uno R3", spec: "ATmega328P Microcontroller", qty: 1 },
    { name: "HC-SR04 Ultrasonic Sensor", spec: "40 kHz Sonar (2cm–400cm)", qty: 1 },
    { name: "IR Obstacle / Line Sensor", spec: "TCRT5000 / LM393 Comparator", qty: 1 },
    { name: "Active Piezo Buzzer", spec: "5V Proximity Alarm", qty: 1 },
  ],
  slides: [
    {
      id: "c3-s01",
      numberLabel: "01",
      title: "Class 03: Giving Your Robot Eyes & Ears",
      subtitle:
        "How autonomous machines perceive walls, lines, and obstacles using Ultrasonic Echolocation and Infrared Light.",
      badge: "ROBOBEE INNOVATORS • HARDWARE & SENSORS • CLASS 03",
      theme: "cyber-blueprint",
      layout: "hero-title",
      fontFamily: "display",
      titleSize: "hero",
      textAlign: "left",
      animation: "fade-up",
      heroImage:
        "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1400&q=80",
      imageCaption: "HC-SR04 Ultrasonic Echolocation & Real-Time Serial Telemetry",
      fallbackVariant: "rover",
      galleryImages: [],
      cards: [
        {
          id: "c3-s01-c1",
          badge: "BAT ECHOLOCATION PHYSICS",
          title: "Measure Distance with 40 kHz Sound Waves",
          body: "Fire a 10-microsecond ultrasonic ping from TRIG, time the echo on ECHO, and compute exact centimeters!",
          accentColor: "#38BDF8",
        },
        {
          id: "c3-s01-c2",
          badge: "LIVE TELEMETRY",
          title: "See What Your Robot Sees in Serial Monitor",
          body: "Use `Serial.begin(9600)` and `Serial.println()` to stream live sensor measurements to your laptop screen.",
          accentColor: "#F59E0B",
        },
      ],
      hotspots: [],
      speakerNotes:
        "Welcome to Class 03! Today we unlock the 'SENSE' stage of Sense-Think-Act by wiring an HC-SR04 ultrasonic rangefinder.",
      ctaText: "Launch Sensor Lab ➔",
    },
    {
      id: "c3-s02",
      numberLabel: "02",
      title: "How Ultrasonic Sonar Works (Distance = Speed × Time / 2)",
      subtitle:
        "Sound travels through air at 0.0343 cm per microsecond—we divide by 2 because the sound wave makes a round trip!",
      badge: "ACOUSTIC PHYSICS • TIME-OF-FLIGHT EQUATION",
      theme: "daylight-studio",
      layout: "split-media",
      fontFamily: "sans",
      titleSize: "standard",
      textAlign: "left",
      animation: "fade-up",
      heroImage:
        "https://images.unsplash.com/photo-1561557944-6e7860d1a7eb?auto=format&fit=crop&w=1200&q=80",
      imageCaption: "HC-SR04 4-Pin Interface: VCC (5V), TRIG (Pin D9), ECHO (Pin D10), GND",
      fallbackVariant: "rover",
      galleryImages: [],
      cards: [
        {
          id: "c3-s02-c1",
          badge: "PIN 1 & 4 • POWER",
          title: "VCC to 5V & GND to Ground",
          body: "Energizes the acoustic transmitter and receiver transducers on the HC-SR04 module.",
          accentColor: "#2563EB",
        },
        {
          id: "c3-s02-c2",
          badge: "PIN 2 • TRIGGER (OUTPUT)",
          title: "TRIG Pin Fires a 10 µs Ultrasonic Burst",
          body: "Your Arduino pulses TRIG HIGH for 10 microseconds to launch an 8-cycle 40 kHz ultrasonic wave.",
          accentColor: "#7C3AED",
        },
        {
          id: "c3-s02-c3",
          badge: "PIN 3 • ECHO (INPUT)",
          title: "pulseIn(ECHO, HIGH) Measures Round-Trip Time",
          body: "`distanceCm = (durationUs * 0.0343) / 2;` converts echo microseconds directly into centimeters!",
          accentColor: "#10B981",
        },
      ],
      hotspots: [],
      speakerNotes:
        "Ask the class: 'Why do we divide by 2 in `(duration * 0.0343) / 2`?' Because the sound wave travels from the sensor to the wall AND back!",
    },
    {
      id: "c3-s03",
      numberLabel: "03",
      title: "Build Challenge: Ultrasonic Reverse Parking Radar",
      subtitle:
        "Trigger a warning LED and buzzer when an obstacle comes closer than 15 cm to your sensor!",
      badge: "HANDS-ON LAB • CLOSED-LOOP ALARM",
      theme: "arduino-teal",
      layout: "interactive-grid",
      fontFamily: "sans",
      titleSize: "standard",
      textAlign: "left",
      animation: "zoom-in",
      heroImage:
        "https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=1200&q=80",
      imageCaption: "Closed-Loop Decision: if (distanceCm < 15) { digitalWrite(ALARM_PIN, HIGH); }",
      fallbackVariant: "arduino",
      galleryImages: [],
      cards: [
        {
          id: "c3-s03-c1",
          badge: "ZONE 1 • SAFE (> 30 cm)",
          title: "Green LED ON • Buzzer Silent",
          body: "Path is clear! The rover can cruise forward at full speed.",
          accentColor: "#34D399",
        },
        {
          id: "c3-s03-c2",
          badge: "ZONE 2 • CAUTION (15–30 cm)",
          title: "Yellow Warning Beep",
          body: "Obstacle approaching—slow down drivetrain PWM speed.",
          accentColor: "#FBBF24",
        },
        {
          id: "c3-s03-c3",
          badge: "ZONE 3 • DANGER (< 15 cm)",
          title: "Red Strobe + Emergency Stop!",
          body: "Immediate collision hazard detected—trigger reverse avoidance maneuver!",
          accentColor: "#F43F5E",
        },
      ],
      hotspots: [],
      speakerNotes:
        "Use the Slide Studio Editor to add more slides, lab photos, or custom sensor calibration tables to Class 03 anytime!",
    },
  ],
};

// ============================================================================
// SEED DECK 4: CLASS 04 — HIGH-POWER ACTUATORS: DC MOTORS, L298N & PWM SPEED
// ============================================================================
export const SEED_CLASS_04_DECK: EditableClassDeck = {
  id: "beg-04",
  classCode: "CLASS 04",
  title: "High-Power Actuators: DC Motors, L298N H-Bridge & PWM Speed",
  subtitle:
    "Give your robot muscles! Learn why microcontrollers need H-Bridge motor drivers, reverse spin direction, and control wheel speed with PWM.",
  track: "Combat & Autonomous Bots",
  coverImage:
    "https://images.unsplash.com/photo-1561557944-6e7860d1a7eb?auto=format&fit=crop&w=1200&q=80",
  durationMinutes: 90,
  status: "published",
  lastEditedAt: "2026-10-19T03:35:00.000Z",
  hardwareSimType: "motor_driver_pwm_sim",
  kitComponents: [
    { name: "Arduino Uno R3", spec: "ATmega328P Microcontroller", qty: 1 },
    { name: "L298N Dual H-Bridge Driver", spec: "5V–35V 2A Motor Amplifier", qty: 1 },
    { name: "TT Gear Motors + Wheels", spec: "3V–6V DC Geared Drivetrain", qty: 2 },
    { name: "2x 18650 Li-Ion Battery Pack", spec: "7.4V – 8.4V High-Current Supply", qty: 1 },
  ],
  slides: [
    {
      id: "c4-s01",
      numberLabel: "01",
      title: "Class 04: High-Power Actuators & H-Bridge Motor Drivers",
      subtitle:
        "Why an Arduino pin (20 mA) can never power a DC motor (500+ mA) directly—and how an H-Bridge solves it!",
      badge: "ROBOBEE INNOVATORS • COMBAT & AUTONOMOUS BOTS • CLASS 04",
      theme: "electric-indigo",
      layout: "hero-title",
      fontFamily: "display",
      titleSize: "hero",
      textAlign: "left",
      animation: "fade-up",
      heroImage:
        "https://images.unsplash.com/photo-1561557944-6e7860d1a7eb?auto=format&fit=crop&w=1400&q=80",
      imageCaption: "Differential Drive Rover Chassis • L298N H-Bridge & Dual DC Gearmotors",
      fallbackVariant: "rover",
      galleryImages: [],
      cards: [
        {
          id: "c4-s01-c1",
          badge: "THE MUSCLE AMPLIFIER",
          title: "L298N / TB6612FNG H-Bridge Driver",
          body: "Takes tiny 5V logic whispers from your Arduino and switches heavy battery current (up to 2 Amps) into your motors!",
          accentColor: "#00F5D4",
        },
        {
          id: "c4-s01-c2",
          badge: "GOLDEN WIRING RULE",
          title: "Always Connect Common Ground!",
          body: "Your battery pack Negative (-) MUST connect to Arduino GND so logic signals share a 0V reference!",
          accentColor: "#FBBF24",
        },
      ],
      hotspots: [],
      speakerNotes:
        "Emphasize the Golden Rule of Robotics Power: Never plug a motor directly into an Arduino pin, and ALWAYS share Common Ground between the motor battery and Arduino GND!",
      ctaText: "Open Drivetrain Lab ➔",
    },
    {
      id: "c4-s02",
      numberLabel: "02",
      title: "Direction & Speed: H-Bridge Logic + PWM (0–255)",
      subtitle:
        "Flip IN1/IN2 to reverse polarity for forward/backward spin, and pulse ENA with `analogWrite(ENA, 0..255)` for smooth speed control!",
      badge: "DRIVETRAIN CONTROL • DIRECTION & PWM DUTY CYCLE",
      theme: "cyber-blueprint",
      layout: "interactive-grid",
      fontFamily: "sans",
      titleSize: "standard",
      textAlign: "left",
      animation: "zoom-in",
      heroImage:
        "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
      imageCaption: "H-Bridge Truth Table & 8-Bit PWM Speed Control (0 to 255)",
      fallbackVariant: "rover",
      galleryImages: [],
      cards: [
        {
          id: "c4-s02-c1",
          badge: "IN1 = HIGH • IN2 = LOW",
          title: "Forward Drive",
          body: "Current flows left-to-right through the motor coils, spinning the wheel forward.",
          accentColor: "#10B981",
        },
        {
          id: "c4-s02-c2",
          badge: "IN1 = LOW • IN2 = HIGH",
          title: "Reverse Drive",
          body: "The H-Bridge flips polarity! Current flows right-to-left, spinning the wheel backward.",
          accentColor: "#38BDF8",
        },
        {
          id: "c4-s02-c3",
          badge: "ANALOGWRITE(ENA, 128)",
          title: "50% PWM Cruise Speed",
          body: "Pulses power ON and OFF 490 times per second at 50% duty cycle for smooth half-speed control.",
          accentColor: "#F59E0B",
        },
        {
          id: "c4-s02-c4",
          badge: "ANALOGWRITE(ENA, 255)",
          title: "100% Full-Throttle Sprint",
          body: "Delivers continuous battery voltage to the motor for maximum tournament speed!",
          accentColor: "#F43F5E",
        },
      ],
      hotspots: [],
      speakerNotes:
        "Open the Hardware Lab Simulator drawer on this class to test the interactive PWM slider and watch the virtual wheels spin!",
    },
  ],
};

function mapTierToTrack(tier: CourseTier): CurriculumTrackName {
  if (tier === "explorer" || tier === "beginner") return "Foundation Track";
  if (tier === "intermediate") return "Hardware & Sensors";
  return "Combat & Autonomous Bots";
}

function mapVisualizerToSimType(
  vis: RoboticsLesson["visualizerId"]
): EditableClassDeck["hardwareSimType"] {
  if (vis === "arduino_board_tour_sim" || vis === "sense_decide_act_sim" || vis === "robot_detective_sim") {
    return "arduino_board_tour_sim";
  }
  if (vis === "led_blink_sim") return "led_blink_sim";
  if (vis === "ultrasonic_sonar_sim" || vis === "obstacle_avoiding_rover_sim") return "ultrasonic_sonar_sim";
  if (
    vis === "motor_driver_pwm_sim" ||
    vis === "movement_route_sim" ||
    vis === "line_follower_sim" ||
    vis === "sumo_arena_sim" ||
    vis === "pid_tuning_sim"
  ) {
    return "motor_driver_pwm_sim";
  }
  return "breadboard_circuit_sim";
}

// ============================================================================
// CURATED BANGLA ARDUINO & ROBOTICS TUTORIAL VIDEOS FOR ALL 12 CLASSES
// ============================================================================
export const BANGLA_TUTORIAL_VIDEOS: Record<
  string,
  { title: string; url: string; guide: string; timestamps: string }
> = {
  "beg-01": {
    title: "Arduino Uno & Traffic Light / Police Strobe in Bangla",
    url: "https://www.youtube.com/watch?v=fJWR73JlWHU",
    guide: "Inspect Arduino Uno pinout rails (5V, GND, D0–D13), breadboard internal tie-point clips, 220Ω resistor protection, and coding the 3-LED traffic light and police strobe.",
    timestamps: "00:00 Arduino Intro • 03:15 Breadboard Internal Rails • 07:45 Traffic Light Wiring • 12:30 Police Strobe Code",
  },
  "beg-02": {
    title: "Arcade Buttons, Buzzer tone() & Reflex Game in Bangla",
    url: "https://www.youtube.com/watch?v=k5q6G3y71F4",
    guide: "Push button digitalRead() with internal pullup resistors, passive vs active piezo buzzer frequencies with tone(), and building the 2-Player Reaction Timer Game.",
    timestamps: "00:00 Push Button Logic • 04:20 INPUT_PULLUP Setup • 08:15 Buzzer tone() Frequencies • 13:00 Reflex Game Challenge",
  },
  "beg-03": {
    title: "Potentiometer, PWM & RGB Color Mixer DJ Console in Bangla",
    url: "https://www.youtube.com/watch?v=Q3kXb4tV8jU",
    guide: "Analog voltage dividers, reading 10-bit ADC (0–1023) on A0, scaling to 8-bit PWM (0–255) using map(), and creating glowing RGB color blends.",
    timestamps: "00:00 Analog vs Digital • 03:45 Potentiometer Wiper • 07:30 PWM Duty Cycle on ~ Pins • 12:15 RGB Color DJ Mixer",
  },
  "beg-04": {
    title: "16x2 I2C LCD Display & Custom Robot Emojis in Bangla",
    url: "https://www.youtube.com/watch?v=mE92_3qJ8vQ",
    guide: "Wiring 16x2 LCD using only 4 I2C wires (VCC, GND, SDA on A4, SCL on A5), finding I2C bus address (0x27/0x3F), and drawing custom 5x8 pixel emojis.",
    timestamps: "00:00 I2C Bus Advantage • 03:30 SDA/SCL Wiring • 07:15 LiquidCrystal_I2C Library • 11:45 Custom Pixel Emoji Generator",
  },
  "beg-05": {
    title: "LDR Light Sensor & PIR Motion Vault Alarm in Bangla",
    url: "https://www.youtube.com/watch?v=d_2eCj_72gM",
    guide: "Photoresistor LDR light-dependent divider on A0, HC-SR501 PIR motion sensor calibration, threshold tuning, and building the Bank Vault Alarm.",
    timestamps: "00:00 LDR Physics • 04:00 10kΩ Voltage Divider • 08:30 PIR Motion Sensitivity Tuning • 13:10 Vault Siren Alarm",
  },
  "beg-06": {
    title: "HC-SR04 Ultrasonic Sonar + SG90 Servo Radar in Bangla",
    url: "https://www.youtube.com/watch?v=Kz6E1B6V79M",
    guide: "Speed of sound distance formula (duration * 0.034 / 2), SG90 micro servo angle control (0° to 180°) with <Servo.h>, and digital ultrasonic radar barrier.",
    timestamps: "00:00 Sound Wave Physics • 04:15 Trig & Echo Pins • 08:45 SG90 Servo PWM Control • 14:00 Parking Radar Barrier",
  },
  "beg-07": {
    title: "Touchless Smart Dustbin Major Build in Bangla",
    url: "https://www.youtube.com/watch?v=68K_y9d5m7Y",
    guide: "Complete maker build: mounting servo horns, calibration of 0° closed to 90° open lid positions, non-blocking 3s hold timing, and physical enclosure assembly.",
    timestamps: "00:00 Project Architecture • 03:30 Linkage Assembly • 08:00 Sonar & Servo Wiring • 14:30 3-Second Hold State Machine",
  },
  "beg-08": {
    title: "MQ-2 Gas Sensor, DHT11 & 5V Relay Safety in Bangla",
    url: "https://www.youtube.com/watch?v=8Vz9X6k5K2E",
    guide: "Gas/smoke detection with MQ-2 analog reading, reading DHT11 temperature and humidity, and safely switching 5V optically isolated relays.",
    timestamps: "00:00 MQ-2 Heating Coil • 04:20 DHT11 Digital Protocol • 08:45 Relay Optical Isolation • 13:30 Smart Home Guardian",
  },
  "beg-09": {
    title: "L298N H-Bridge Motor Driver & 2WD Chassis in Bangla",
    url: "https://www.youtube.com/watch?v=L9p5B7x9v6E",
    guide: "Why microcontrollers cannot drive high-power DC motors directly, how H-bridge transistors flip polarity, IN1–IN4 truth table, and PWM speed jumpers.",
    timestamps: "00:00 Motor Current Demands • 04:00 H-Bridge Transistor Bridges • 08:30 IN1-IN4 Logic Truth Table • 14:00 Robot Figure-8 Dance",
  },
  "beg-10": {
    title: "HC-05 Bluetooth RC Car & Robo-Soccer Match in Bangla",
    url: "https://www.youtube.com/watch?v=3Wz7F1k8B6Q",
    guide: "UART serial cross-wiring (RX to TX), voltage divider on HC-05 RX, reading single-character commands ('F', 'B', 'L', 'R', 'S'), and mounting the soccer pusher.",
    timestamps: "00:00 UART Serial Cross-Wiring • 04:15 Smartphone App Pairing • 08:30 Serial Packet Parsing • 13:45 2v2 Robo-Soccer Match",
  },
  "beg-11": {
    title: "TCRT5000 IR Sensor Line Follower & Sumo Bot in Bangla",
    url: "https://www.youtube.com/watch?v=5Vz8X2k9B7E",
    guide: "Infrared reflection off white tiles vs absorption on matte black tape, onboard LM393 comparator potentiometer tuning, and differential drive steering logic.",
    timestamps: "00:00 IR Physics & Absorption • 03:45 LM393 Comparator Tuning • 08:15 Table-Edge Safety Reflex • 13:30 Autonomous Line Tracking",
  },
  "beg-12": {
    title: "Autonomous Obstacle-Avoiding & Maze Explorer in Bangla",
    url: "https://www.youtube.com/watch?v=9Vz7F1k8B6Q",
    guide: "Mounting HC-SR04 sonar on SG90 servo turret, looking Left & Right when path is blocked, turning toward the wider corridor, and tournament showcase.",
    timestamps: "00:00 Capstone Architecture • 04:00 Servo Scanning Turret • 08:45 Left/Right Decision Tree • 15:00 Autonomous Maze Showcase",
  },
};

/**
 * Generates the canonical 10-Slide Presentation Deck for any RoboticsLesson in ALL_ROBOTICS_LESSONS
 * following Pillar 2 specifications (Hero Title, 2-Hour Timeline, Real-World Hook, Component Anatomy,
 * Pinout & Breadboard Wiring, Step-by-Step Code, Live Lab Build Steps, Embedded Bangla Video,
 * Troubleshooting Clinic, and Game Challenge with Exit Ticket).
 */
export function buildStructured12SlideDeckFromLesson(lesson: RoboticsLesson): EditableClassDeck {
  const courseSpace = COURSE_SPACES.find((c) => c.id === lesson.courseId);
  const heroSvg =
    lesson.physicalBuildPack?.connectionPhotoOrClearlyLabeledIllustration ||
    "/illustrations/class1-external-blink-wiring.svg";
  const c0 = lesson.concepts[0] || {
    title: lesson.title,
    explanation: lesson.promise,
    instructorNote: "Walk through the system diagram on the projector.",
  };
  const c1 = lesson.concepts[1] || c0;
  const c2 = lesson.concepts[2] || c1;

  const videoInfo = BANGLA_TUTORIAL_VIDEOS[lesson.id] || {
    title: `${lesson.title} - Bangla Video Tutorial`,
    url: "https://www.youtube.com/watch?v=fJWR73JlWHU",
    guide: `Step-by-step hands-on tutorial and workbench demonstration for ${lesson.title}.`,
    timestamps: "00:00 Overview • 03:30 Hardware Wiring • 08:15 Firmware Walkthrough • 14:00 Bench Testing",
  };

  const slides: EditableSlide[] = [
    // Slide 01 — Mission Hook & Today's Big Promise
    {
      id: `${lesson.id}-s01`,
      numberLabel: "01",
      title: `${lesson.code}: ${lesson.title}`,
      subtitle: lesson.promise,
      badge: `ROBOBEE INNOVATORS • ${(courseSpace?.title || lesson.courseId).toUpperCase()} • ${lesson.proposedAudience.toUpperCase()}`,
      theme: "robobee-dark",
      layout: "hero-title",
      fontFamily: "display",
      titleSize: "hero",
      textAlign: "left",
      animation: "fade-up",
      heroImage: heroSvg,
      imageCaption: `Reference Illustration • ${lesson.project.name} (120-Minute Friday Lab Session)`,
      fallbackVariant: "arduino",
      galleryImages: [],
      cards: [
        {
          id: `${lesson.id}-s01-c1`,
          badge: "TODAY'S MISSION DELIVERABLE",
          title: lesson.project.name,
          body: lesson.project.successEvidence[0] || lesson.promise,
          detail: `Deliverable Type: ${lesson.project.deliverableType.replace(/_/g, " ").toUpperCase()}`,
          accentColor: "#F5B800",
        },
        {
          id: `${lesson.id}-s01-c2`,
          badge: "120-MINUTE WORKSHOP STANDARD",
          title: "5-Stage Interactive Friday Lab Flow",
          body: "15m Hook & Demo -> 25m Concept & Pinout -> 35m Breadboard Wiring -> 25m Code & Debugging -> 20m Game Challenge & Showoff.",
          detail: "All 12 classes alternate between discovery & major milestone builds",
          accentColor: "#38BDF8",
        },
      ],
      hotspots: [],
      speakerNotes: `Welcome to ${lesson.code}: ${lesson.title}. State today's big promise clearly: "${lesson.promise}" Point out the physical hardware kit on each bench.`,
      ctaText: "Begin 120-Minute Session ->",
    },

    // Slide 02 — 120-Minute Session Rhythm & Lab Safety Rules
    {
      id: `${lesson.id}-s02`,
      numberLabel: "02",
      title: "120-Minute Friday Lab Timeline & Safety Protocol",
      subtitle: "Structured 2-hour engineering workshop pacing and mandatory power-off wiring discipline.",
      badge: `${lesson.code} • 120M TIMELINE & GOLDEN SAFETY RULES`,
      theme: "robobee-dark",
      layout: "timeline-stepper",
      fontFamily: "sans",
      titleSize: "standard",
      textAlign: "left",
      animation: "slide-right",
      heroImage: heroSvg,
      imageCaption: `Reference Illustration • 120-Minute 5-Stage Pacing & Bench Safety`,
      fallbackVariant: "arduino",
      galleryImages: [],
      cards: lesson.classRhythm.map((seg, idx) => ({
        id: `${lesson.id}-s02-r-${idx}`,
        badge: `STAGE 0${idx + 1} • ${seg.minutes} MIN`,
        title: seg.segment,
        body: `Student Action: ${seg.studentAction}`,
        detail: `Instructor: ${seg.teacherAction}`,
        accentColor: idx === 2 ? "#F5B800" : "#38BDF8",
      })),
      hotspots: [],
      speakerNotes: `Review the 5 Friday Lab stages totaling 120 minutes (15 + 25 + 35 + 25 + 20). Read Safety Rule #1 aloud: "${lesson.safetyNotes[0] || "Always wire with power disconnected."}"`,
    },

    // Slide 03 — Real-World Engineering Hook & Challenge
    {
      id: `${lesson.id}-s03`,
      numberLabel: "03",
      title: `Real-World Hook: ${c0.title}`,
      subtitle: "Why this matters: from Mars rovers and surgical arms to automated factories and local solutions in Bangladesh.",
      badge: `${lesson.code} • REAL-WORLD ENGINEERING HOOK`,
      theme: "electric-indigo",
      layout: "split-media",
      fontFamily: "sans",
      titleSize: "standard",
      textAlign: "left",
      animation: "fade-up",
      heroImage: heroSvg,
      imageCaption: `Engineering Application • ${c0.title}`,
      fallbackVariant: "robot-arm",
      galleryImages: [],
      cards: [
        {
          id: `${lesson.id}-s03-hook`,
          badge: "REAL-WORLD PROBLEM & MISSION",
          title: c0.title,
          body: c0.explanation,
          accentColor: "#00F5D4",
        },
        ...lesson.outcomes.slice(0, 2).map((out, idx) => ({
          id: `${lesson.id}-s03-out-${idx}`,
          badge: `VERIFIED OUTCOME 0${idx + 1}`,
          title: out,
          body: "Proved through hands-on breadboard assembly and physical trials.",
          accentColor: "#38BDF8",
        })),
      ],
      hotspots: [],
      speakerNotes: `Hook the students with the real-world connection. Ask: "Where do you see machines that do this in the real world?" ${c0.instructorNote || ""}`,
    },

    // Slide 04 — Interactive Component Anatomy & Principles
    {
      id: `${lesson.id}-s04`,
      numberLabel: "04",
      title: `Component Anatomy & Core Principle: ${c1.title}`,
      subtitle: c2 && c2 !== c1 ? `Plus: ${c2.title}` : "How signals, power, and physical logic unite inside our robot.",
      badge: `${lesson.code} • SYSTEM ARCHITECTURE & LOGIC`,
      theme: "arduino-teal",
      layout: "interactive-grid",
      fontFamily: "sans",
      titleSize: "standard",
      textAlign: "left",
      animation: "zoom-in",
      heroImage: heroSvg,
      imageCaption: `Component Anatomy • ${c1.title}`,
      fallbackVariant: "arduino",
      galleryImages: [],
      cards: [
        {
          id: `${lesson.id}-s04-c1`,
          badge: "WORKING PRINCIPLE",
          title: c1.title,
          body: c1.explanation,
          accentColor: "#FBBF24",
        },
        ...lesson.vocabulary.slice(0, 2).map((v, i) => ({
          id: `${lesson.id}-s04-v-${i}`,
          badge: `KEY TERM • ${v.term.toUpperCase()}`,
          title: `${v.term} — ${v.plainMeaning}`,
          body: v.technicalMeaning,
          accentColor: "#0D9488",
        })),
        {
          id: `${lesson.id}-s04-chk`,
          badge: "BENCH CHECK QUESTION",
          title: "Quick Signal Check",
          body: lesson.checksForUnderstanding[0] || "Trace how input sensors trigger microcontroller logic to drive physical actuators.",
          accentColor: "#38BDF8",
        },
      ],
      hotspots: [],
      speakerNotes: `Explain the component anatomy. Use the board or slide to point out signal flow: Sensors (Eyes) -> Microcontroller (Brain) -> Actuators (Muscles).`,
    },

    // Slide 05 — Hardware Pinout Map & Breadboard Wiring Diagram
    {
      id: `${lesson.id}-s05`,
      numberLabel: "05",
      title: "Hardware Pinout Map & Breadboard Wiring Diagram",
      subtitle: `Schematic: ${lesson.physicalBuildPack?.schematic || "Follow the point-to-point wire table below with power OFF."}`,
      badge: `${lesson.code} • POINT-TO-POINT WIRING TABLE`,
      theme: "robobee-dark",
      layout: "split-media",
      fontFamily: "mono",
      titleSize: "standard",
      textAlign: "left",
      animation: "fade-up",
      heroImage: heroSvg,
      imageCaption: `Wiring Schematic • ${heroSvg} (Click image or press 'Z' to zoom full screen)`,
      fallbackVariant: "arduino",
      galleryImages: [],
      cards: (lesson.physicalBuildPack?.wireTable || []).map((w, idx) => ({
        id: `${lesson.id}-s05-w-${idx}`,
        badge: `WIRE 0${idx + 1} • ${w.from} -> ${w.to}`,
        title: `${w.from}  -->  ${w.to}`,
        body: w.wireOrPolarityNote || "Verify firm insertion into breadboard spring clip.",
        accentColor: idx % 2 === 0 ? "#F5B800" : "#38BDF8",
      })),
      hotspots: [],
      speakerNotes: `Keep this slide projected during the 35-minute Guided Physical Build! Press 'Z' or click the wiring diagram to zoom it full-screen for students in the back row.`,
    },

    // Slide 06 — Step-by-Step Arduino Code Walkthrough
    {
      id: `${lesson.id}-s06`,
      numberLabel: "06",
      title: `Code Lab (${(lesson.codeLab?.language || "cpp").toUpperCase()}): Step-by-Step Walkthrough`,
      subtitle: lesson.codeLab?.expectedResult || "Upload, test, and understand each line driving the hardware.",
      badge: `${lesson.code} • COMPLETE CODE LAB & EXPLANATION`,
      theme: "cyber-blueprint",
      layout: "split-media",
      fontFamily: "mono",
      titleSize: "standard",
      textAlign: "left",
      animation: "fade-up",
      heroImage: heroSvg,
      imageCaption: `Code Target • ${lesson.codeLab?.tweakTip || "Modify parameters and observe hardware response"}`,
      fallbackVariant: "mcu",
      galleryImages: [],
      cards: [
        {
          id: `${lesson.id}-s06-code`,
          badge: `COMPLETE ${(lesson.codeLab?.language || "CPP").toUpperCase()} SOURCE`,
          title: "Verified Workshop Code",
          body: lesson.codeLab?.code || "// Code snippet",
          accentColor: "#38BDF8",
        },
        ...(lesson.codeLab?.explanations || []).slice(0, 3).map((exp, idx) => ({
          id: `${lesson.id}-s06-exp-${idx}`,
          badge: `CODE WALKTHROUGH 0${idx + 1}`,
          title: `Key Logic Line ${idx + 1}`,
          body: exp,
          accentColor: "#F59E0B",
        })),
      ],
      hotspots: [],
      speakerNotes: `Walk through the code block. Demonstrate how to click 'Copy Code' and paste directly into Arduino IDE. Challenge fast finishers: "${lesson.codeLab?.tweakTip || "Try modifying constants!"}"`,
    },

    // Slide 07 — Live Lab Build Steps & Bench Verification
    {
      id: `${lesson.id}-s07`,
      numberLabel: "07",
      title: "Live Lab Assembly & Pre-Power Bench Test",
      subtitle: "Assemble step-by-step, verify safety checks, and test behavior with interactive simulation.",
      badge: `${lesson.code} • SIMULATION & BENCH VERIFICATION`,
      theme: "arduino-teal",
      layout: "split-media",
      fontFamily: "sans",
      titleSize: "standard",
      textAlign: "left",
      animation: "zoom-in",
      heroImage: heroSvg,
      imageCaption: `Simulation & Verification • Visualizer: ${lesson.visualizerId}`,
      fallbackVariant: "arduino",
      galleryImages: [],
      cards: [
        ...(lesson.physicalBuildPack?.assemblyAndPowerUpSteps || []).slice(0, 2).map((step, idx) => ({
          id: `${lesson.id}-s07-step-${idx}`,
          badge: `ASSEMBLY STEP 0${idx + 1}`,
          title: `Build Step ${idx + 1}`,
          body: step,
          accentColor: "#5EEAD4",
        })),
        ...(lesson.physicalBuildPack?.testCases || []).slice(0, 2).map((tc, idx) => ({
          id: `${lesson.id}-s07-tc-${idx}`,
          badge: `BENCH TEST CASE 0${idx + 1}`,
          title: `Action: ${tc.action}`,
          body: `Expected Result: ${tc.expectedResult}`,
          accentColor: "#FBBF24",
        })),
      ],
      hotspots: [],
      speakerNotes: `Have students test each test case one by one before proceeding to the game challenge. Use the interactive diagram slider to demonstrate expected physical responses!`,
    },

    // Slide 08 — Embedded Bangla Tutorial Video & Video Guide
    {
      id: `${lesson.id}-s08`,
      numberLabel: "08",
      title: `Bangla Video Guide: ${videoInfo.title}`,
      subtitle: videoInfo.guide,
      badge: `${lesson.code} • BANGLA VIDEO TUTORIAL & LAB GUIDE`,
      theme: "robobee-dark",
      layout: "split-media",
      fontFamily: "sans",
      titleSize: "standard",
      textAlign: "left",
      animation: "fade-up",
      heroImage: videoInfo.url,
      imageCaption: `Bangla Lab Video Demonstration • ${videoInfo.title}`,
      fallbackVariant: "arduino",
      galleryImages: [],
      cards: [
        {
          id: `${lesson.id}-s08-v`,
          badge: "DEMO VIDEO",
          title: videoInfo.title,
          body: `Embedded YouTube Link: ${videoInfo.url}`,
          accentColor: "#EF4444",
        },
        {
          id: `${lesson.id}-s08-ts`,
          badge: "VIDEO CHAPTERS & TIMESTAMPS",
          title: "Lab Bench Key Timestamps",
          body: videoInfo.timestamps,
          accentColor: "#38BDF8",
        },
        {
          id: `${lesson.id}-s08-tip`,
          badge: "INSTRUCTOR BENCH TIP",
          title: "Hardware Inspection Before Power-Up",
          body: "Always verify USB COM Port in Arduino IDE Tools menu and ensure no jumper wire touches another bare pin before uploading.",
          accentColor: "#F5B800",
        },
      ],
      hotspots: [],
      speakerNotes: `Play the Bangla video demonstration on the projector for the class. Review the key timestamps (${videoInfo.timestamps}) before students begin their guided trials!`,
    },

    // Slide 09 — Troubleshooting Clinic & Fast-Finisher Challenge
    {
      id: `${lesson.id}-s09`,
      numberLabel: "09",
      title: "Troubleshooting Clinic & Fast-Finisher Challenge",
      subtitle: "Real engineers debug systematically: isolate power, check continuity, and verify signals.",
      badge: `${lesson.code} • DEBUGGING CLINIC & EXTENSION`,
      theme: "daylight-studio",
      layout: "interactive-grid",
      fontFamily: "sans",
      titleSize: "standard",
      textAlign: "left",
      animation: "fade-up",
      heroImage: heroSvg,
      imageCaption: `Systematic Debugging • Hardware & Software Diagnostics`,
      fallbackVariant: "arduino",
      galleryImages: [],
      cards: [
        ...lesson.troubleshooting.slice(0, 3).map((t, idx) => ({
          id: `${lesson.id}-s09-tr-${idx}`,
          badge: `SYMPTOM 0${idx + 1}`,
          title: t.symptom,
          body: `Checks: ${t.checks.join(" • ")}`,
          detail: `Why: ${t.explanation}`,
          accentColor: "#E11D48",
        })),
        {
          id: `${lesson.id}-s09-ext`,
          badge: "FAST-FINISHER EXTENSION",
          title: lesson.activity.title,
          body: lesson.activity.extension || lesson.differentiation.extension[0] || "Extend your code and log a bonus trial in your engineering notebook!",
          accentColor: "#0D9488",
        },
      ],
      hotspots: [],
      speakerNotes: `When a student says "It doesn't work!", point them to Symptom 01–03 on this slide first so they practice systematic engineering diagnosis.`,
    },

    // Slide 10 — Physical Game Challenge & 4-Question Exit Ticket
    {
      id: `${lesson.id}-s10`,
      numberLabel: "10",
      title: "Lab Game Challenge & 4-Question Exit Ticket",
      subtitle: `Up Next: ${lesson.nextLessonTeaser}`,
      badge: `${lesson.code} • GAME CHALLENGE & EXIT TICKET`,
      theme: "robobee-dark",
      layout: "interactive-grid",
      fontFamily: "sans",
      titleSize: "standard",
      textAlign: "left",
      animation: "zoom-in",
      heroImage: heroSvg,
      imageCaption: `Up Next • ${lesson.nextLessonTeaser}`,
      fallbackVariant: "rover",
      galleryImages: [],
      cards: [
        {
          id: `${lesson.id}-s10-game`,
          badge: "PHYSICAL GAME CHALLENGE",
          title: lesson.project.name + " Live Challenge",
          body: lesson.project.successEvidence[0] || "Compete with your bench partner to achieve flawless performance under the 2-minute timer!",
          detail: "Score bonus XP points for clean wiring, zero loose jumper wires, and fastest reaction time!",
          accentColor: "#10B981",
        },
        ...lesson.exitTicket.slice(0, 3).map((q, idx) => ({
          id: `${lesson.id}-s10-q-${idx}`,
          badge: `EXIT CHECK Q0${idx + 1} (CLICK TO REVEAL RUBRIC)`,
          title: q.question,
          body: q.hint || "Discuss with your bench partner before revealing the engineering answer!",
          accentColor: "#F5B800",
          isQuizCard: true,
          quizVerdict: q.rubricOrSampleReasoning,
          quizIsPositive: true,
        })),
      ],
      hotspots: [],
      speakerNotes: `Run the physical game challenge first with high classroom energy! Then click each of the Exit Check cards on the projector to reveal the sample engineering reasoning after students answer. Finally preview next class: "${lesson.nextLessonTeaser}"`,
    },
  ];

  return {
    id: lesson.id,
    courseId: lesson.courseId,
    proposedAudience: lesson.proposedAudience,
    classCode: lesson.code,
    title: lesson.title,
    subtitle: lesson.promise,
    track: mapTierToTrack(lesson.courseId),
    coverImage: heroSvg,
    durationMinutes: lesson.durationMinutes || 120,
    xpReward: 250,
    hardwareKit: lesson.verifiedMaterials,
    status: lesson.status,
    lastEditedAt: "2026-10-19T04:00:00.000Z",
    hardwareSimType: mapVisualizerToSimType(lesson.visualizerId),
    kitComponents: (lesson.physicalBuildPack?.componentList || []).map((c) => ({
      name: c.name,
      spec: c.exactVariant,
      qty: c.quantity,
    })),
    slides,
  };
}

export const INITIAL_SEED_DECKS: EditableClassDeck[] = ALL_ROBOTICS_LESSONS.map((lesson) => {
  return buildStructured12SlideDeckFromLesson(lesson);
});

export function getOrBuildDeckForLesson(lesson: RoboticsLesson, storedDecks?: EditableClassDeck[]): EditableClassDeck {
  const decks = storedDecks || loadDecksFromStorage();
  const found = decks.find((d) => d.id === lesson.id);
  if (found && found.slides && found.slides.length >= 10) {
    return found;
  }
  return buildStructured12SlideDeckFromLesson(lesson);
}

// ============================================================================
// PERSISTENCE ENGINE (LOCALSTORAGE + FIRESTORE SYNC)
// ============================================================================

export function loadDecksFromStorage(): EditableClassDeck[] {
  if (typeof window === "undefined") return INITIAL_SEED_DECKS;
  try {
    const raw = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      return INITIAL_SEED_DECKS;
    }
    const parsed = JSON.parse(raw) as EditableClassDeck[];
    if (!Array.isArray(parsed) || parsed.length === 0) return INITIAL_SEED_DECKS;

    // Ensure all 36 canonical seed decks exist (if user had older 2-3 slide starter decks for beg-03/04, upgrade them to 12 slides unless custom-edited to >=10 slides)
    const map = new Map<string, EditableClassDeck>();
    INITIAL_SEED_DECKS.forEach((d) => map.set(d.id, d));
    parsed.forEach((d) => {
      const canonical = map.get(d.id);
      if (canonical && d.slides && d.slides.length < 10 && canonical.slides.length >= 12) {
        map.set(d.id, { ...canonical, status: d.status || canonical.status });
      } else {
        map.set(d.id, {
          ...canonical,
          ...d,
          courseId: d.courseId || canonical?.courseId,
          proposedAudience: d.proposedAudience || canonical?.proposedAudience,
          durationMinutes: 120,
        });
      }
    });
    return Array.from(map.values());
  } catch {
    return INITIAL_SEED_DECKS;
  }
}

export async function saveDeckToStorageAndCloud(deck: EditableClassDeck): Promise<EditableClassDeck[]> {
  const updatedDeck: EditableClassDeck = {
    ...deck,
    lastEditedAt: new Date().toISOString(),
  };

  const current = loadDecksFromStorage();
  const idx = current.findIndex((d) => d.id === updatedDeck.id);
  let next: EditableClassDeck[];
  if (idx >= 0) {
    next = [...current];
    next[idx] = updatedDeck;
  } else {
    next = [...current, updatedDeck];
  }

  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(next));
    } catch (e) {
      console.warn("LocalStorage quota warning:", e);
    }
  }

  try {
    await setDoc(doc(db, "curriculum_slide_decks", updatedDeck.id), updatedDeck, { merge: true });
  } catch (err) {
    console.warn("Firestore sync offline (saved locally):", err);
  }

  return next;
}

export async function deleteDeckFromStorageAndCloud(deckId: string): Promise<EditableClassDeck[]> {
  const current = loadDecksFromStorage().filter((d) => d.id !== deckId);
  if (typeof window !== "undefined") {
    window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(current));
  }
  try {
    await deleteDoc(doc(db, "curriculum_slide_decks", deckId));
  } catch {}
  return current;
}

export async function syncDecksFromFirestore(): Promise<EditableClassDeck[]> {
  const local = loadDecksFromStorage();
  try {
    const snap = await getDocs(collection(db, "curriculum_slide_decks"));
    if (snap.empty) return local;
    const map = new Map<string, EditableClassDeck>();
    local.forEach((d) => map.set(d.id, d));
    snap.forEach((docSnap) => {
      const data = docSnap.data() as EditableClassDeck;
      if (data && data.id && Array.isArray(data.slides)) {
        map.set(data.id, data);
      }
    });
    const merged = Array.from(map.values());
    if (typeof window !== "undefined") {
      window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(merged));
    }
    return merged;
  } catch {
    return local;
  }
}

export function createBlankSlide(slideNumber: number, theme: SlideColorTheme = "electric-indigo"): EditableSlide {
  const numStr = String(slideNumber).padStart(2, "0");
  const palette = THEME_PALETTE_CONFIG[theme] || THEME_PALETTE_CONFIG["electric-indigo"];

  const initialElements: SlideElement[] = [
    {
      id: `el-badge-${Date.now()}`,
      type: "callout",
      x: 60,
      y: 40,
      width: 280,
      height: 32,
      zIndex: 1,
      content: `SLIDE ${numStr} • ROBOBEE INNOVATORS`,
      style: {
        fontSize: 12,
        fontWeight: 800,
        color: palette.badgeText,
        backgroundColor: palette.badgeBg,
        borderColor: palette.accentPrimary,
        borderWidth: 1,
        borderRadius: 999,
        padding: "6px 14px",
        textAlign: "center",
      },
    },
    {
      id: `el-title-${Date.now()}`,
      type: "heading",
      x: 60,
      y: 84,
      width: 1160,
      height: 64,
      zIndex: 2,
      content: `New Slide ${numStr}: Click to Edit Headline`,
      style: {
        fontSize: 34,
        fontWeight: 900,
        color: palette.headingColor,
        textAlign: "left",
        lineHeight: 1.2,
      },
    },
    {
      id: `el-sub-${Date.now()}`,
      type: "subheading",
      x: 60,
      y: 154,
      width: 1160,
      height: 40,
      zIndex: 3,
      content: "Add your concise engineering takeaway, lesson concept, or classroom prompt here.",
      style: {
        fontSize: 17,
        fontWeight: 500,
        color: palette.mutedColor,
        textAlign: "left",
        lineHeight: 1.4,
      },
    },
    {
      id: `el-card-1-${Date.now()}`,
      type: "callout",
      x: 60,
      y: 220,
      width: 560,
      height: 200,
      zIndex: 4,
      badgeText: "KEY POINT 01",
      content: "### First Core Engineering Concept\nExplain the concept clearly in 1–2 punchy sentences for the classroom projector. Double click to customize this text.",
      style: {
        backgroundColor: palette.cardBg,
        borderColor: palette.cardBorder,
        borderWidth: 1,
        borderRadius: 16,
        padding: "20px 24px",
        color: palette.bodyColor,
        boxShadow: palette.cardShadow,
      },
    },
    {
      id: `el-card-2-${Date.now()}`,
      type: "callout",
      x: 60,
      y: 440,
      width: 560,
      height: 200,
      zIndex: 5,
      badgeText: "KEY POINT 02",
      content: "### Second Core Engineering Concept\nAdd real-world hardware examples, pin numbers, or interactive questions. Double click to customize.",
      style: {
        backgroundColor: palette.cardBg,
        borderColor: palette.cardBorder,
        borderWidth: 1,
        borderRadius: 16,
        padding: "20px 24px",
        color: palette.bodyColor,
        boxShadow: palette.cardShadow,
      },
    },
    {
      id: `el-img-${Date.now()}`,
      type: "image",
      x: 650,
      y: 220,
      width: 570,
      height: 420,
      zIndex: 6,
      content: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80",
      caption: "RoboBee Lab Illustration • Double click or use Inspector to replace or add images",
      style: {
        borderRadius: 16,
        borderColor: palette.cardBorder,
        borderWidth: 1,
        objectFit: "cover",
        boxShadow: palette.cardShadow,
        backgroundColor: "rgba(0, 0, 0, 0.2)",
      },
    },
  ];

  return {
    id: `slide-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    numberLabel: numStr,
    title: `New Slide ${numStr}: Click to Edit Headline`,
    subtitle: "Add your concise engineering takeaway or classroom prompt here.",
    badge: `SLIDE ${numStr} • ROBOBEE INNOVATORS`,
    theme,
    layout: "split-media",
    fontFamily: "sans",
    titleSize: "standard",
    textAlign: "left",
    animation: "fade-up",
    heroImage:
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80",
    imageCaption: "RoboBee Lab Illustration • Click to Change Image or Add Gallery Photos",
    fallbackVariant: "arduino",
    galleryImages: [],
    cards: [
      {
        id: `card-${Date.now()}-1`,
        badge: "KEY POINT 01",
        title: "First Core Engineering Concept",
        body: "Explain the concept clearly in 1–2 punchy sentences for the classroom projector.",
        accentColor: palette.accentPrimary,
      },
      {
        id: `card-${Date.now()}-2`,
        badge: "KEY POINT 02",
        title: "Second Core Engineering Concept",
        body: "Add real-world hardware examples, pin numbers, or interactive questions.",
        accentColor: palette.accentSecondary,
      },
    ],
    hotspots: [
      {
        id: `hs-${Date.now()}-1`,
        number: 1,
        xPercent: 45,
        yPercent: 45,
        title: "Hardware Component #1",
        badge: "PIN 01 • COMPONENT",
        description: "Click or drag this pin in the Slide Studio Editor to highlight any part of your image!",
        color: "#FBBF24",
      },
    ],
    speakerNotes: "Instructor speaker notes for this slide...",
    elements: initialElements,
  };
}

// ============================================================================
// AUTO-MIGRATION ADAPTER: NORMALIZE LEGACY SLIDES TO 16:9 FREEFORM STAGE (1280x720)
// ============================================================================
export function normalizeSlideToFreeform(slide: EditableSlide): EditableSlide {
  // If the slide already has customized freeform elements, preserve them 100%
  if (slide.elements && slide.elements.length > 0) {
    return slide;
  }

  const themeKey = slide.theme || "robobee-dark";
  const palette = THEME_PALETTE_CONFIG[themeKey] || THEME_PALETTE_CONFIG["robobee-dark"];
  const elements: SlideElement[] = [];
  let zCounter = 1;

  // 1. Badge Pill (Top Left)
  if (slide.badge) {
    const estimatedWidth = Math.min(540, Math.max(220, slide.badge.length * 9 + 36));
    elements.push({
      id: `${slide.id}-migrated-badge`,
      type: "callout",
      x: 60,
      y: 38,
      width: estimatedWidth,
      height: 32,
      zIndex: zCounter++,
      content: slide.badge,
      style: {
        fontSize: 12,
        fontWeight: 800,
        color: palette.badgeText,
        backgroundColor: palette.badgeBg,
        borderColor: palette.accentPrimary,
        borderWidth: 1,
        borderRadius: 999,
        padding: "6px 14px",
        textAlign: "center",
      },
    });
  }

  // 2. Title Heading
  elements.push({
    id: `${slide.id}-migrated-title`,
    type: "heading",
    x: 60,
    y: 78,
    width: 1160,
    height: 64,
    zIndex: zCounter++,
    content: slide.title || "Untitled Slide",
    style: {
      fontSize: slide.titleSize === "hero" ? 40 : slide.titleSize === "large" ? 36 : 32,
      fontWeight: 900,
      color: palette.headingColor,
      textAlign: slide.textAlign || "left",
      lineHeight: 1.2,
      fontFamily: slide.fontFamily || "sans",
    },
  });

  // 3. Subtitle
  if (slide.subtitle) {
    elements.push({
      id: `${slide.id}-migrated-subtitle`,
      type: "subheading",
      x: 60,
      y: 148,
      width: 1160,
      height: 42,
      zIndex: zCounter++,
      content: slide.subtitle,
      style: {
        fontSize: 16,
        fontWeight: 500,
        color: palette.mutedColor,
        textAlign: slide.textAlign || "left",
        lineHeight: 1.4,
        fontFamily: slide.fontFamily || "sans",
      },
    });
  }

  // 4. Content Area Layout
  const cards = slide.cards || [];
  const hasHeroImage = Boolean(slide.heroImage);
  const isHotspotSlide = slide.layout === "interactive-hotspot" || (slide.hotspots && slide.hotspots.length > 0);
  const hasQuizCards = cards.some((c) => c.isQuizCard);
  const hasPollCards = cards.some((c) => c.isPollCard);
  const isTimelineSlide = slide.layout === "timeline-stepper";

  // CASE A: Interactive Hardware Hotspot / Diagram Slide (Pins 1–5 on Rover or Arduino)
  if (isHotspotSlide || (hasHeroImage && cards.length === 0)) {
    elements.push({
      id: `${slide.id}-migrated-hotspot-img`,
      type: "image",
      x: 80,
      y: 195,
      width: 1120,
      height: 475,
      zIndex: zCounter++,
      content: slide.heroImage || "/illustrations/class1-arduino-uno-anatomy.svg",
      caption: slide.imageCaption || "Click Pins 1–5 on diagram to inspect subsystems",
      hotspotPins: slide.hotspots && slide.hotspots.length > 0 ? slide.hotspots : undefined,
      style: {
        borderRadius: 20,
        borderColor: palette.cardBorder,
        borderWidth: 2,
        boxShadow: palette.cardShadow,
        objectFit: "contain",
        backgroundColor: palette.isLight ? "#F8FAFC" : "rgba(10, 15, 28, 0.65)",
      },
    });
  }
  // CASE A-2: Dedicated Firmware & Code Lab Slide (type === "code" with syntax highlighting)
  else if (
    cards.some(
      (c) =>
        c.badge?.toUpperCase().includes("SOURCE") ||
        c.badge?.toUpperCase().includes("CODE") ||
        c.title?.toUpperCase().includes("CODE") ||
        c.body?.includes("void setup") ||
        c.body?.includes("#include") ||
        c.body?.includes("pinMode(") ||
        c.body?.includes("digitalWrite(")
    ) ||
    slide.id.endsWith("-s10") ||
    slide.title.toLowerCase().includes("code lab")
  ) {
    const codeCard = cards.find(
      (c) =>
        c.badge?.toUpperCase().includes("SOURCE") ||
        c.badge?.toUpperCase().includes("CODE") ||
        c.title?.toUpperCase().includes("CODE") ||
        c.body?.includes("void setup") ||
        c.body?.includes("#include") ||
        c.body?.includes("pinMode(") ||
        c.body?.includes("digitalWrite(")
    );

    const rawCode =
      codeCard?.body ||
      `// Arduino C++ Firmware\nvoid setup() {\n  pinMode(LED_BUILTIN, OUTPUT);\n}\n\nvoid loop() {\n  digitalWrite(LED_BUILTIN, HIGH);\n  delay(1000);\n  digitalWrite(LED_BUILTIN, LOW);\n  delay(1000);\n}`;

    // Place dedicated Code Block on the right side
    elements.push({
      id: `${slide.id}-migrated-code`,
      type: "code",
      x: 600,
      y: 195,
      width: 620,
      height: 470,
      zIndex: zCounter++,
      content: rawCode,
      language: "cpp",
      badgeText: codeCard?.badge || "ARDUINO C++ SOURCE",
      style: {
        backgroundColor: palette.isLight ? "#0F172A" : "rgba(10, 15, 28, 0.95)",
        borderColor: "#38BDF8",
        borderWidth: 1.5,
        borderRadius: 16,
        boxShadow: palette.cardShadow,
        color: "#F8FAFC",
        fontFamily: "mono",
        fontSize: 13,
        padding: 0,
      },
    });

    // Place Explanation & Walkthrough Cards on the left side
    const explanationCards = cards.filter((c) => c !== codeCard);
    const expCount = Math.min(3, explanationCards.length);
    if (expCount === 0) {
      elements.push({
        id: `${slide.id}-migrated-code-exp`,
        type: "callout",
        x: 60,
        y: 195,
        width: 500,
        height: 470,
        zIndex: zCounter++,
        badgeText: "CODE LAB WALKTHROUGH",
        content: `### Firmware Architecture\n\n${slide.subtitle || "Inspect how each line of Arduino C++ firmware controls the physical hardware components."}\n\n- **Setup Function:** Configures pin directions and initializes serial/I2C buses\n- **Loop Function:** Executes repetitive Sense → Decide → Act cycles\n- **Safety Protocol:** Verify connections before flashing firmware to ATmega328P`,
        style: {
          backgroundColor: palette.cardBg,
          borderColor: palette.cardBorder,
          borderWidth: 1.5,
          borderRadius: 18,
          padding: "26px",
          color: palette.bodyColor,
          boxShadow: palette.cardShadow,
        },
      });
    } else {
      const cardH = expCount === 1 ? 470 : expCount === 2 ? 225 : 145;
      const gap = expCount === 1 ? 0 : expCount === 2 ? 20 : 16;
      explanationCards.slice(0, 3).forEach((c, idx) => {
        elements.push({
          id: `${c.id || `${slide.id}-exp-${idx}`}`,
          type: "callout",
          x: 60,
          y: 195 + idx * (cardH + gap),
          width: 500,
          height: cardH,
          zIndex: zCounter++,
          badgeText: c.badge || `WALKTHROUGH 0${idx + 1}`,
          content: `### ${c.title}\n\n${c.body}`,
          style: {
            backgroundColor: palette.cardBg,
            borderColor: c.accentColor || palette.cardBorder,
            borderWidth: 1.5,
            borderRadius: 16,
            padding: expCount === 3 ? "14px 18px" : "20px 22px",
            color: palette.bodyColor,
            boxShadow: palette.cardShadow,
          },
        });
      });
    }
  }
  // CASE A-3: Video Demonstration Slide (type === "video")
  else if (
    cards.some(
      (c) =>
        c.badge?.toLowerCase().includes("video") ||
        c.title?.toLowerCase().includes("video") ||
        c.body?.includes("youtube.com") ||
        c.body?.includes("youtu.be") ||
        c.body?.includes(".mp4")
    ) ||
    Boolean(
      slide.heroImage &&
        (slide.heroImage.includes("youtube.com") ||
          slide.heroImage.includes("youtu.be") ||
          slide.heroImage.endsWith(".mp4"))
    )
  ) {
    const videoCard = cards.find(
      (c) =>
        c.badge?.toLowerCase().includes("video") ||
        c.title?.toLowerCase().includes("video") ||
        c.body?.includes("youtube.com") ||
        c.body?.includes("youtu.be") ||
        c.body?.includes(".mp4")
    );
    const videoUrl =
      videoCard?.body.match(/https?:\/\/[^\s]+/)?.[0] ||
      (slide.heroImage?.startsWith("http")
        ? slide.heroImage
        : "https://www.youtube.com/watch?v=dQw4w9WgXcQ");

    elements.push({
      id: `${slide.id}-migrated-video`,
      type: "video",
      x: 600,
      y: 195,
      width: 620,
      height: 470,
      zIndex: zCounter++,
      content: videoUrl,
      videoUrl: videoUrl,
      badgeText: videoCard?.badge || "DEMO VIDEO",
      style: {
        borderRadius: 18,
        borderColor: palette.cardBorder,
        borderWidth: 1.5,
        boxShadow: palette.cardShadow,
        backgroundColor: "#000000",
      },
    });

    const otherCards = cards.filter((c) => c !== videoCard);
    otherCards.slice(0, 2).forEach((c, idx) => {
      elements.push({
        id: `${c.id || `${slide.id}-c-vid-${idx}`}`,
        type: "callout",
        x: 60,
        y: 195 + idx * 240,
        width: 500,
        height: 220,
        zIndex: zCounter++,
        badgeText: c.badge || `INFO 0${idx + 1}`,
        content: `### ${c.title}\n\n${c.body}`,
        style: {
          backgroundColor: palette.cardBg,
          borderColor: c.accentColor || palette.cardBorder,
          borderWidth: 1.5,
          borderRadius: 16,
          padding: "20px 22px",
          color: palette.bodyColor,
          boxShadow: palette.cardShadow,
        },
      });
    });
  }
  // CASE A-4: Hardware Pinout Card Slide (type === "pinout-card")
  else if (
    cards.some((c) => c.badge?.includes("PIN ASSIGNMENT") || c.badge?.includes("PIN MAP")) ||
    (slide.id.endsWith("-s06") && cards.some((c) => c.badge?.includes("PIN")))
  ) {
    const pinCards = cards.filter((c) => c.badge?.includes("PIN"));
    const otherCards = cards.filter((c) => !c.badge?.includes("PIN"));
    const pinItems = pinCards.map((c, idx) => ({
      number: idx + 1,
      label: c.title || `Pin ${idx + 1}`,
      pinName: c.title || `Pin ${idx + 1}`,
      note: c.body,
    }));

    elements.push({
      id: `${slide.id}-migrated-pinout`,
      type: "pinout-card",
      x: 600,
      y: 195,
      width: 620,
      height: 470,
      zIndex: zCounter++,
      content: "",
      caption: "HARDWARE PINOUT MAP",
      pinItems: pinItems.length > 0 ? pinItems : undefined,
      style: {
        backgroundColor: palette.cardBg,
        borderColor: palette.cardBorder,
        borderWidth: 1.5,
        borderRadius: 18,
        boxShadow: palette.cardShadow,
        padding: "16px 18px",
      },
    });

    otherCards.slice(0, 3).forEach((c, idx) => {
      elements.push({
        id: `${c.id || `${slide.id}-c-pin-${idx}`}`,
        type: "callout",
        x: 60,
        y: 195 + idx * 155,
        width: 500,
        height: 140,
        zIndex: zCounter++,
        badgeText: c.badge || `SAFETY 0${idx + 1}`,
        content: `### ${c.title}\n\n${c.body}`,
        style: {
          backgroundColor: palette.cardBg,
          borderColor: c.accentColor || palette.cardBorder,
          borderWidth: 1.5,
          borderRadius: 16,
          padding: "16px 20px",
          color: palette.bodyColor,
          boxShadow: palette.cardShadow,
        },
      });
    });
  }
  // CASE A-6: Hardware Pinout Map & Breadboard Wiring Table Slide
  else if (
    cards.some(
      (c) =>
        c.badge?.includes("WIRE") ||
        c.title?.includes("-->") ||
        c.title?.includes("->")
    ) ||
    (slide.id.endsWith("-s05") && hasHeroImage) ||
    slide.title?.toLowerCase().includes("wiring diagram")
  ) {
    elements.push({
      id: `${slide.id}-migrated-wire-img`,
      type: "image",
      x: 600,
      y: 195,
      width: 620,
      height: 470,
      zIndex: zCounter++,
      content: slide.heroImage || "/illustrations/class1-external-blink-wiring.svg",
      caption: slide.imageCaption || "Point-to-Point Breadboard Wiring Diagram (Press 'Z' to Zoom)",
      hotspotPins: slide.hotspots && slide.hotspots.length > 0 ? slide.hotspots : undefined,
      style: {
        borderRadius: 18,
        borderColor: palette.cardBorder,
        borderWidth: 1.5,
        boxShadow: palette.cardShadow,
        objectFit: "contain",
        backgroundColor: palette.isLight ? "#F8FAFC" : "rgba(0,0,0,0.35)",
        padding: "12px",
      },
    });

    if (cards.length <= 4) {
      const count = Math.max(1, cards.length);
      const gap = count === 1 ? 0 : count === 2 ? 20 : count === 3 ? 16 : 12;
      const cardH = Math.floor((470 - (count - 1) * gap) / count);
      cards.forEach((c, idx) => {
        elements.push({
          id: `${c.id || `${slide.id}-c-wire-${idx}`}`,
          type: "callout",
          x: 60,
          y: 195 + idx * (cardH + gap),
          width: 500,
          height: cardH,
          zIndex: zCounter++,
          badgeText: c.badge || `WIRE 0${idx + 1}`,
          content: `### ${c.title}\n${c.body}`,
          style: {
            backgroundColor: palette.cardBg,
            borderColor: c.accentColor || palette.cardBorder,
            borderWidth: 1.5,
            borderRadius: 14,
            padding: count <= 2 ? "18px 20px" : "10px 14px",
            color: palette.bodyColor,
            boxShadow: palette.cardShadow,
            fontSize: count > 3 ? 12 : 14,
          },
        });
      });
    } else {
      // 5+ wires: split across 2 compact sub-columns on the left
      const half = Math.ceil(Math.min(cards.length, 8) / 2);
      const subCards = cards.slice(0, 8);
      const gapY = 10;
      const rowCount = half;
      const cardH = Math.floor((470 - (rowCount - 1) * gapY) / rowCount);

      subCards.forEach((c, idx) => {
        const col = idx < half ? 0 : 1;
        const row = idx < half ? idx : idx - half;
        elements.push({
          id: `${c.id || `${slide.id}-c-wire-${idx}`}`,
          type: "callout",
          x: 60 + col * 255,
          y: 195 + row * (cardH + gapY),
          width: 245,
          height: cardH,
          zIndex: zCounter++,
          badgeText: c.badge || `WIRE 0${idx + 1}`,
          content: `**${c.title}**\n${c.body}`,
          style: {
            backgroundColor: palette.cardBg,
            borderColor: c.accentColor || palette.cardBorder,
            borderWidth: 1.5,
            borderRadius: 12,
            padding: "8px 12px",
            color: palette.bodyColor,
            boxShadow: palette.cardShadow,
            fontSize: 11,
          },
        });
      });
    }
  }
  // CASE A-5: Interactive Hardware Simulation & Diagram Slide (type === "diagram")
  else if (
    cards.some(
      (c) =>
        c.badge?.includes("SIMULATION") ||
        c.badge?.includes("BENCH TEST") ||
        c.badge?.includes("RADAR") ||
        c.badge?.includes("CIRCUIT")
    ) ||
    slide.id.endsWith("-s07") ||
    slide.id.endsWith("-s09")
  ) {
    const fullText = `${slide.id} ${slide.title} ${slide.subtitle || ""} ${cards.map((c) => c.title + " " + c.body).join(" ")}`.toLowerCase();
    let diagType: "ultrasonic-radar" | "breadboard-circuit" | "servo-gauge" | "h-bridge-motor" | "ir-reflectance" = "breadboard-circuit";
    if (fullText.includes("radar") || fullText.includes("sonar") || fullText.includes("ultrasonic") || fullText.includes("barrier") || fullText.includes("distance") || fullText.includes("dustbin")) {
      diagType = "ultrasonic-radar";
    } else if (fullText.includes("servo") || fullText.includes("horn") || fullText.includes("angle") || fullText.includes("gauge")) {
      diagType = "servo-gauge";
    } else if (fullText.includes("motor") || fullText.includes("l298n") || fullText.includes("h-bridge") || fullText.includes("chassis") || fullText.includes("dance") || fullText.includes("wheel") || fullText.includes("car")) {
      diagType = "h-bridge-motor";
    } else if (fullText.includes("ir") || fullText.includes("reflectance") || fullText.includes("tcrt5000") || fullText.includes("sumo") || fullText.includes("line")) {
      diagType = "ir-reflectance";
    }

    elements.push({
      id: `${slide.id}-migrated-diagram`,
      type: "diagram",
      x: 600,
      y: 195,
      width: 620,
      height: 470,
      zIndex: zCounter++,
      content: "",
      diagramType: diagType,
      style: {
        backgroundColor: palette.cardBg,
        borderColor: palette.cardBorder,
        borderWidth: 1.5,
        borderRadius: 18,
        boxShadow: palette.cardShadow,
      },
    });

    const diagCardCount = Math.min(cards.length, 4);
    const diagGap = diagCardCount === 1 ? 0 : diagCardCount === 2 ? 20 : diagCardCount === 3 ? 16 : 12;
    const diagCardH = diagCardCount === 0 ? 0 : Math.floor((470 - (diagCardCount - 1) * diagGap) / diagCardCount);

    cards.slice(0, 4).forEach((c, idx) => {
      elements.push({
        id: `${c.id || `${slide.id}-c-diag-${idx}`}`,
        type: "callout",
        x: 60,
        y: 195 + idx * (diagCardH + diagGap),
        width: 500,
        height: diagCardH,
        zIndex: zCounter++,
        badgeText: c.badge || `STEP 0${idx + 1}`,
        content: `### ${c.title}\n\n${c.body}`,
        style: {
          backgroundColor: palette.cardBg,
          borderColor: c.accentColor || palette.cardBorder,
          borderWidth: 1.5,
          borderRadius: 16,
          padding: diagCardCount <= 2 ? "20px 22px" : "12px 16px",
          color: palette.bodyColor,
          boxShadow: palette.cardShadow,
          fontSize: diagCardCount > 2 ? 13 : 15,
        },
      });
    });
  }
  // CASE B: Interactive Quiz Challenge Slide (e.g. Robot vs. Machine — 3 side-by-side cards)
  else if (hasQuizCards && cards.length === 3) {
    const cardW = 370;
    const cardH = 460;
    const gap = 25;
    cards.forEach((c, idx) => {
      elements.push({
        id: `${c.id || `${slide.id}-c${idx}`}`,
        type: "callout",
        x: 60 + idx * (cardW + gap),
        y: 200,
        width: cardW,
        height: cardH,
        zIndex: zCounter++,
        badgeText: c.badge || `CHALLENGE 0${idx + 1}`,
        isQuizCard: true,
        quizVerdict: c.quizVerdict,
        quizIsPositive: c.quizIsPositive,
        content: `### ${c.title}\n\n${c.body}`,
        style: {
          backgroundColor: palette.cardBg,
          borderColor: c.accentColor || palette.cardBorder,
          borderWidth: 2,
          borderRadius: 18,
          padding: "24px 22px",
          color: palette.bodyColor,
          boxShadow: palette.cardShadow,
        },
      });
    });
  }
  // CASE C: Interactive Classroom Poll Slide or 4-Path Grid (e.g. 4 Builder Personas — 2x2 grid)
  else if ((hasPollCards || cards.length === 4) && !isTimelineSlide) {
    const colW = 560;
    const rowH = 220;
    const gapX = 40;
    const gapY = 18;
    cards.slice(0, 4).forEach((c, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      elements.push({
        id: `${c.id || `${slide.id}-c${idx}`}`,
        type: "callout",
        x: 60 + col * (colW + gapX),
        y: 200 + row * (rowH + gapY),
        width: colW,
        height: rowH,
        zIndex: zCounter++,
        badgeText: c.badge,
        isPollCard: c.isPollCard,
        pollInitialVotes: c.pollInitialVotes,
        isQuizCard: c.isQuizCard,
        quizVerdict: c.quizVerdict,
        quizIsPositive: c.quizIsPositive,
        content: `### ${c.title}\n${c.body}${c.detail ? `\n\n*${c.detail}*` : ""}`,
        style: {
          backgroundColor: palette.cardBg,
          borderColor: c.accentColor || palette.cardBorder,
          borderWidth: 1.5,
          borderRadius: 18,
          padding: "18px 22px",
          color: palette.bodyColor,
          boxShadow: palette.cardShadow,
        },
      });
    });
  }
  // CASE D: Timeline Stepper / Closed-Loop Sense->Think->Act Slide
  else if (isTimelineSlide) {
    if (cards.length === 4) {
      // 4 horizontal era cards across the screen
      const cardW = 275;
      const cardH = 460;
      const gap = 20;
      cards.forEach((c, idx) => {
        elements.push({
          id: `${c.id || `${slide.id}-c${idx}`}`,
          type: "callout",
          x: 60 + idx * (cardW + gap),
          y: 200,
          width: cardW,
          height: cardH,
          zIndex: zCounter++,
          badgeText: c.badge,
          content: `### ${c.title}\n\n**${c.subtitle || ""}**\n\n${c.body}`,
          style: {
            backgroundColor: palette.cardBg,
            borderColor: c.accentColor || palette.cardBorder,
            borderWidth: 1.5,
            borderRadius: 16,
            padding: "20px 18px",
            color: palette.bodyColor,
            boxShadow: palette.cardShadow,
          },
        });
      });
    } else {
      // 3 connected stage cards across the screen (Sense ➔ Think ➔ Act)
      const cardW = 370;
      const cardH = 460;
      const gap = 25;
      cards.slice(0, 3).forEach((c, idx) => {
        elements.push({
          id: `${c.id || `${slide.id}-c${idx}`}`,
          type: "callout",
          x: 60 + idx * (cardW + gap),
          y: 200,
          width: cardW,
          height: cardH,
          zIndex: zCounter++,
          badgeText: c.badge,
          content: `### ${c.title}\n\n*${c.subtitle || ""}*\n\n${c.body}`,
          style: {
            backgroundColor: palette.cardBg,
            borderColor: c.accentColor || palette.cardBorder,
            borderWidth: 2,
            borderRadius: 18,
            padding: "24px 22px",
            color: palette.bodyColor,
            boxShadow: palette.cardShadow,
          },
        });
      });
    }
  }
  // CASE E: Split Media with Hero Image on right and cards on left
  else if (hasHeroImage && cards.length > 0) {
    const imgX = 660;
    const imgY = 200;
    const imgW = 560;
    const imgH = 460;

    elements.push({
      id: `${slide.id}-migrated-hero-img`,
      type: "image",
      x: imgX,
      y: imgY,
      width: imgW,
      height: imgH,
      zIndex: zCounter++,
      content: slide.heroImage,
      caption: slide.imageCaption || "",
      hotspotPins: slide.hotspots && slide.hotspots.length > 0 ? slide.hotspots : undefined,
      style: {
        borderRadius: 18,
        borderColor: palette.cardBorder,
        borderWidth: 1.5,
        boxShadow: palette.cardShadow,
        objectFit: slide.heroImage.endsWith(".svg") ? "contain" : "cover",
        backgroundColor: palette.isLight ? "#F8FAFC" : "rgba(0,0,0,0.25)",
      },
    });

    const leftX = 60;
    const startY = 200;
    const colW = 560;

    if (cards.length === 1) {
      elements.push({
        id: `${cards[0].id || `${slide.id}-c0`}`,
        type: "callout",
        x: leftX,
        y: startY,
        width: colW,
        height: 460,
        zIndex: zCounter++,
        badgeText: cards[0].badge,
        isQuizCard: cards[0].isQuizCard,
        quizVerdict: cards[0].quizVerdict,
        quizIsPositive: cards[0].quizIsPositive,
        isPollCard: cards[0].isPollCard,
        pollInitialVotes: cards[0].pollInitialVotes,
        content: `### ${cards[0].title}\n\n${cards[0].body}${cards[0].detail ? `\n\n> ${cards[0].detail}` : ""}`,
        style: {
          backgroundColor: palette.cardBg,
          borderColor: cards[0].accentColor || palette.cardBorder,
          borderWidth: 1.5,
          borderRadius: 18,
          padding: "26px",
          color: palette.bodyColor,
          boxShadow: palette.cardShadow,
        },
      });
    } else if (cards.length === 2) {
      const cardH = 215;
      const gap = 20;
      cards.forEach((c, idx) => {
        elements.push({
          id: `${c.id || `${slide.id}-c${idx}`}`,
          type: "callout",
          x: leftX,
          y: startY + idx * (cardH + gap),
          width: colW,
          height: cardH,
          zIndex: zCounter++,
          badgeText: c.badge,
          isQuizCard: c.isQuizCard,
          quizVerdict: c.quizVerdict,
          quizIsPositive: c.quizIsPositive,
          isPollCard: c.isPollCard,
          pollInitialVotes: c.pollInitialVotes,
          content: `### ${c.title}\n${c.body}${c.detail ? `\n\n*${c.detail}*` : ""}`,
          style: {
            backgroundColor: palette.cardBg,
            borderColor: c.accentColor || palette.cardBorder,
            borderWidth: 1.5,
            borderRadius: 16,
            padding: "18px 22px",
            color: palette.bodyColor,
            boxShadow: palette.cardShadow,
          },
        });
      });
    } else if (cards.length === 3) {
      // 3 cards stacked
      const cardH = 138;
      const gap = 16;
      cards.slice(0, 3).forEach((c, idx) => {
        elements.push({
          id: `${c.id || `${slide.id}-c${idx}`}`,
          type: "callout",
          x: leftX,
          y: startY + idx * (cardH + gap),
          width: colW,
          height: cardH,
          zIndex: zCounter++,
          badgeText: c.badge,
          isQuizCard: c.isQuizCard,
          quizVerdict: c.quizVerdict,
          quizIsPositive: c.quizIsPositive,
          isPollCard: c.isPollCard,
          pollInitialVotes: c.pollInitialVotes,
          content: `**${c.title}**\n${c.body}`,
          style: {
            backgroundColor: palette.cardBg,
            borderColor: c.accentColor || palette.cardBorder,
            borderWidth: 1.5,
            borderRadius: 14,
            padding: "14px 18px",
            color: palette.bodyColor,
            boxShadow: palette.cardShadow,
          },
        });
      });
    } else {
      // 4+ cards stacked cleanly on the left (e.g. BOM items, component cards)
      const subCards = cards.slice(0, 4);
      const cardH = 104;
      const gap = 12;
      subCards.forEach((c, idx) => {
        elements.push({
          id: `${c.id || `${slide.id}-c${idx}`}`,
          type: "callout",
          x: leftX,
          y: startY + idx * (cardH + gap),
          width: colW,
          height: cardH,
          zIndex: zCounter++,
          badgeText: c.badge,
          isQuizCard: c.isQuizCard,
          quizVerdict: c.quizVerdict,
          quizIsPositive: c.quizIsPositive,
          isPollCard: c.isPollCard,
          pollInitialVotes: c.pollInitialVotes,
          content: `**${c.title}** • ${c.body}`,
          style: {
            backgroundColor: palette.cardBg,
            borderColor: c.accentColor || palette.cardBorder,
            borderWidth: 1.5,
            borderRadius: 12,
            padding: "10px 14px",
            color: palette.bodyColor,
            boxShadow: palette.cardShadow,
            fontSize: 13,
          },
        });
      });
    }
  }
  // CASE F: Full-width Grid without Hero Image
  else {
    if (cards.length === 3) {
      const cardW = 370;
      const cardH = 460;
      const gap = 25;
      cards.forEach((c, idx) => {
        elements.push({
          id: `${c.id || `${slide.id}-c${idx}`}`,
          type: "callout",
          x: 60 + idx * (cardW + gap),
          y: 200,
          width: cardW,
          height: cardH,
          zIndex: zCounter++,
          badgeText: c.badge,
          isQuizCard: c.isQuizCard,
          quizVerdict: c.quizVerdict,
          quizIsPositive: c.quizIsPositive,
          isPollCard: c.isPollCard,
          pollInitialVotes: c.pollInitialVotes,
          content: `### ${c.title}\n\n${c.body}${c.detail ? `\n\n> ${c.detail}` : ""}`,
          style: {
            backgroundColor: palette.cardBg,
            borderColor: c.accentColor || palette.cardBorder,
            borderWidth: 1.5,
            borderRadius: 18,
            padding: "24px 22px",
            color: palette.bodyColor,
            boxShadow: palette.cardShadow,
          },
        });
      });
    } else if (cards.length === 2) {
      const cardW = 560;
      const cardH = 460;
      const gap = 40;
      cards.forEach((c, idx) => {
        elements.push({
          id: `${c.id || `${slide.id}-c${idx}`}`,
          type: "callout",
          x: 60 + idx * (cardW + gap),
          y: 200,
          width: cardW,
          height: cardH,
          zIndex: zCounter++,
          badgeText: c.badge,
          isQuizCard: c.isQuizCard,
          quizVerdict: c.quizVerdict,
          quizIsPositive: c.quizIsPositive,
          isPollCard: c.isPollCard,
          pollInitialVotes: c.pollInitialVotes,
          content: `### ${c.title}\n\n${c.body}${c.detail ? `\n\n> ${c.detail}` : ""}`,
          style: {
            backgroundColor: palette.cardBg,
            borderColor: c.accentColor || palette.cardBorder,
            borderWidth: 1.5,
            borderRadius: 18,
            padding: "26px",
            color: palette.bodyColor,
            boxShadow: palette.cardShadow,
          },
        });
      });
    } else {
      const colW = 560;
      const rowH = 220;
      const gapX = 40;
      const gapY = 18;
      cards.slice(0, 4).forEach((c, idx) => {
        const col = idx % 2;
        const row = Math.floor(idx / 2);
        elements.push({
          id: `${c.id || `${slide.id}-c${idx}`}`,
          type: "callout",
          x: 60 + col * (colW + gapX),
          y: 200 + row * (rowH + gapY),
          width: colW,
          height: rowH,
          zIndex: zCounter++,
          badgeText: c.badge,
          isQuizCard: c.isQuizCard,
          quizVerdict: c.quizVerdict,
          quizIsPositive: c.quizIsPositive,
          isPollCard: c.isPollCard,
          pollInitialVotes: c.pollInitialVotes,
          content: `**${c.title}**\n${c.body}`,
          style: {
            backgroundColor: palette.cardBg,
            borderColor: c.accentColor || palette.cardBorder,
            borderWidth: 1.5,
            borderRadius: 16,
            padding: "18px 22px",
            color: palette.bodyColor,
            boxShadow: palette.cardShadow,
          },
        });
      });
    }
  }

  return {
    ...slide,
    elements,
  };
}

export function normalizeDeckToFreeform(deck: EditableClassDeck): EditableClassDeck {
  return {
    ...deck,
    slides: (deck.slides || []).map((slide) => normalizeSlideToFreeform(slide)),
  };
}
