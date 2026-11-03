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
  isSupportLab?: boolean;
  bandChallenges?: {
    bandA: string;
    bandB: string;
    bandC: string;
  };
  slides: EditableSlide[];
}

export const LOCAL_STORAGE_KEY = "robobee_slide_studio_decks_v2026_master";

// ============================================================================
// CANONICAL BANGLA TUTORIAL VIDEO REGISTRY
// ============================================================================
export const BANGLA_TUTORIAL_VIDEOS: Record<
  string,
  { title: string; url: string; guide: string; timestamps: string }
> = {
  "exp-01": {
    title: "Class 01: Electricity, LEDs & The Breadboard X-Ray in Bangla",
    url: "https://www.youtube.com/watch?v=fJWR73JlWHU",
    guide: "Internal metal spring clips, forward voltage limits, calculating 220Ω resistor, and breadboard circuit assembly.",
    timestamps: "00:00 Circuit Path • 03:15 Breadboard Anatomy • 07:45 Current Limiting Resistor • 12:30 First LED Glow",
  },
  "beg-01": {
    title: "Class 01: Electricity, LEDs & The Breadboard X-Ray in Bangla",
    url: "https://www.youtube.com/watch?v=fJWR73JlWHU",
    guide: "Internal metal spring clips, forward voltage limits, calculating 220Ω resistor, and breadboard circuit assembly.",
    timestamps: "00:00 Circuit Path • 03:15 Breadboard Anatomy • 07:45 Current Limiting Resistor • 12:30 First LED Glow",
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

function mapTierToTrack(courseId?: string): CurriculumTrackName {
  if (!courseId) return "Foundation Track";
  if (courseId.includes("level-1")) return "Foundation Track";
  if (courseId.includes("level-2")) return "Hardware & Sensors";
  if (courseId.includes("level-3") || courseId.includes("level-4")) return "Combat & Autonomous Bots";
  return "Foundation Track";
}

function mapVisualizerToSimType(
  visualizerId?: string
):
  | "arduino_board_tour_sim"
  | "breadboard_circuit_sim"
  | "ultrasonic_sonar_sim"
  | "motor_driver_pwm_sim"
  | "led_blink_sim" {
  if (!visualizerId) return "breadboard_circuit_sim";
  if (visualizerId.includes("sonar") || visualizerId.includes("ultrasonic") || visualizerId.includes("radar")) {
    return "ultrasonic_sonar_sim";
  }
  if (visualizerId.includes("motor") || visualizerId.includes("pwm") || visualizerId.includes("l298n")) {
    return "motor_driver_pwm_sim";
  }
  if (visualizerId.includes("blink") || visualizerId.includes("traffic") || visualizerId.includes("led")) {
    return "led_blink_sim";
  }
  if (visualizerId.includes("arduino") || visualizerId.includes("uno") || visualizerId.includes("board")) {
    return "arduino_board_tour_sim";
  }
  return "breadboard_circuit_sim";
}

/**
 * Builds the canonical 9-Slide Presentation Deck for any RoboticsLesson in ALL_ROBOTICS_LESSONS.
 * Follows the exact visual and pedagogical architecture of the Canva Master Deck:
 * 1. Hero Cover & Class Title (Friday 4:00–6:00 PM, 120 Mins)
 * 2. 4-Level Master Curriculum Roadmap & What We Will Learn (Class 3 to Class 12)
 * 3. 120-Minute Friday Hands-On Lab Flow & Mandatory Safety Rules (5 Stages)
 * 4. Core Working Principle & Electronic Laws (Ohm's Law, Semiconductor Physics)
 * 5. Hardware Anatomy, Pinout & Breadboard X-Ray (Point-to-Point Wire Table)
 * 6. Complete Firmware & Step-by-Step Code Lab (C++ Source & Walkthrough)
 * 7. 3-Band Differentiated Lab Sprint (Class 3 to Class 12: Band A, Band B, Band C)
 * 8. Hands-On Exit Ticket & Formative Reflection (4 Flip-Cards with Engineering Answers)
 * 9. Up Next: Next Class Teaser & Lab Mission
 */
export function buildStructured12SlideDeckFromLesson(lesson: RoboticsLesson): EditableClassDeck {
  const courseSpace = COURSE_SPACES.find((c) => c.id === lesson.courseId);
  const heroSvg =
    lesson.physicalBuildPack?.connectionPhotoOrClearlyLabeledIllustration ||
    "/illustrations/class1-external-blink-wiring.svg";

  const c0 = lesson.concepts[0] || {
    title: lesson.title,
    explanation: lesson.promise,
    instructorNote: "Walk through the hardware diagram on the projector.",
  };

  const slides: EditableSlide[] = [
    // Slide 01 — Mission Hero & Class Title
    {
      id: `${lesson.id}-s01`,
      numberLabel: "01",
      title: `${lesson.code}: ${lesson.title}`,
      subtitle: lesson.promise,
      badge: `ROBOBEE INNOVATORS • ${(courseSpace?.title || lesson.courseId).toUpperCase()} • FRIDAY 4:00–6:00 PM (120 MINS)`,
      theme: "robobee-dark",
      layout: "hero-title",
      fontFamily: "display",
      titleSize: "hero",
      textAlign: "left",
      animation: "fade-up",
      heroImage: heroSvg,
      imageCaption: `Reference Illustration • ${lesson.project.name} (Friday 4:00–6:00 PM Lab)`,
      fallbackVariant: "arduino",
      galleryImages: [],
      cards: [
        {
          id: `${lesson.id}-s01-c1`,
          badge: "TODAY'S PRACTICAL DELIVERABLE",
          title: lesson.project.name,
          body: lesson.project.successEvidence[0] || lesson.promise,
          detail: `Deliverable Type: ${lesson.project.deliverableType.replace(/_/g, " ").toUpperCase()}`,
          accentColor: "#F5B800",
        },
        {
          id: `${lesson.id}-s01-c2`,
          badge: "120-MINUTE WORKSHOP RHYTHM",
          title: "5 Structured Practical Stages",
          body: "15m Hook & Demo -> 25m Concept & Pinout -> 40m Breadboard Assembly -> 25m Code & Debug -> 15m 3-Band Sprint.",
          detail: "Zero passive lectures — real physical hardware from day one",
          accentColor: "#38BDF8",
        },
      ],
      hotspots: [],
      speakerNotes: `Welcome to ${lesson.code}: ${lesson.title}. Introduce today's big promise: "${lesson.promise}" Direct each bench to inspect their component tray.`,
      ctaText: "Begin 120-Minute Session ->",
    },

    // Slide 02 — Master 4-Level Curriculum Roadmap & What We Will Learn
    {
      id: `${lesson.id}-s02`,
      numberLabel: "02",
      title: "Master Robotics Curriculum Roadmap (Class 3 to Class 12)",
      subtitle: "4 Progressive Levels + 8 Supportive Catch-Up Labs • Friday 4:00–6:00 PM • Narayanganj Maker Lab",
      badge: "ROBOBEE INNOVATORS • 4-LEVEL CURRICULUM ARCHITECTURE",
      theme: "robobee-dark",
      layout: "interactive-grid",
      fontFamily: "sans",
      titleSize: "standard",
      textAlign: "left",
      animation: "fade-up",
      heroImage: heroSvg,
      imageCaption: "4-Level Engineering Roadmap • Class 3 to Class 12",
      fallbackVariant: "arduino",
      galleryImages: [],
      cards: [
        {
          id: `${lesson.id}-s02-l1`,
          badge: "LEVEL 1 • FOUNDATIONS (CLASS 01–10 + S1–S3)",
          title: "Electronics, Breadboards & Smart Gadgets",
          body: "Breadboard continuity, C++ syntax, Ohm's law, digital/analog sensors, servo mechanics, LCD I2C, and Touchless Hygiene Gadgets.",
          accentColor: lesson.courseId === "explorer" || lesson.courseId === "beginner" ? "#F5B800" : "#64748B",
        },
        {
          id: `${lesson.id}-s02-l2`,
          badge: "LEVEL 2 • ROVERS (CLASS 11–20 + S4–S5)",
          title: "Mobile Robots & Autonomous Vehicles",
          body: "Motor drivers, L298N H-bridge, 2WD chassis kinematics, Bluetooth RC, Robo-Soccer, TCRT5000 line tracking, and autonomous maze exploration.",
          accentColor: lesson.courseId === "intermediate" ? "#00F5D4" : "#64748B",
        },
        {
          id: `${lesson.id}-s02-l3`,
          badge: "LEVEL 3 • CAD & IOT (CLASS 21–28 + S6–S7)",
          title: "3D CAD, 4-DOF Robotic Arms & ESP32 IoT",
          body: "Mechanical 3D CAD modeling, 3D printing slicers, multi-axis servo robotic arms, forward kinematics, and ESP32 Wi-Fi IoT web servers.",
          accentColor: lesson.courseId === "advanced" ? "#38BDF8" : "#64748B",
        },
        {
          id: `${lesson.id}-s02-l4`,
          badge: "LEVEL 4 • COMPETITIONS (CLASS 29–36 + S8)",
          title: "Combat Robotics, PID Line Followers & Fairs",
          body: "High-speed PID line tracking, Micromouse flood-fill maze solving, 3kg combat sumo bots, fire-fighting bots, and national science fair defense.",
          accentColor: "#F43F5E",
        },
      ],
      hotspots: [],
      speakerNotes: "Show students where today's lesson fits into the grand 4-Level engineering journey. Highlight that every module builds tangible skills toward autonomous systems.",
    },

    // Slide 03 — 120-Minute Friday Hands-On Lab Flow & Safety Discipline
    {
      id: `${lesson.id}-s03`,
      numberLabel: "03",
      title: "120-Minute Friday Hands-On Lab Flow (4:00 PM – 6:00 PM)",
      subtitle: "Structured 2-hour engineering workshop pacing with zero passive lectures and strict pre-power safety checks.",
      badge: `${lesson.code} • 120M TIMELINE & MANDATORY SAFETY RULES`,
      theme: "robobee-dark",
      layout: "timeline-stepper",
      fontFamily: "sans",
      titleSize: "standard",
      textAlign: "left",
      animation: "slide-right",
      heroImage: heroSvg,
      imageCaption: "120-Minute 5-Stage Friday Lab Flow & Safety Protocol",
      fallbackVariant: "arduino",
      galleryImages: [],
      cards: [
        {
          id: `${lesson.id}-s03-stg1`,
          badge: "STAGE 01 • 15 MIN (4:00–4:15 PM)",
          title: "1. Hook & Live Table Demo",
          body: "Instructor demonstrates working prototype. Students inspect new hardware components on their trays.",
          accentColor: "#38BDF8",
        },
        {
          id: `${lesson.id}-s03-stg2`,
          badge: "STAGE 02 • 25 MIN (4:15–4:40 PM)",
          title: "2. Visual Concept & Pin Blueprint",
          body: "Circuit paths, voltage limits, and electronic laws (zero walls of text).",
          accentColor: "#00F5D4",
        },
        {
          id: `${lesson.id}-s03-stg3`,
          badge: "STAGE 03 • 40 MIN (4:40–5:20 PM)",
          title: "3. Guided Hardware Assembly (Power OFF!)",
          body: "Step-by-step breadboard or chassis wiring using color-coded pin tables. Mandatory safety checks.",
          accentColor: "#F5B800",
        },
        {
          id: `${lesson.id}-s03-stg4`,
          badge: "STAGE 04 • 25 MIN (5:20–5:45 PM)",
          title: "4. Code Lab, Upload & Serial Debug",
          body: "Write/flash C++ sketch, verify real-world behavior, and complete age-band modifications.",
          accentColor: "#38BDF8",
        },
        {
          id: `${lesson.id}-s03-stg5`,
          badge: "STAGE 05 • 15 MIN (5:45–6:00 PM)",
          title: "5. 3-Band Lab Sprint & Pack-Up",
          body: "Age-band challenge, troubleshoot faults, submit exit tickets, and sort components into trays.",
          accentColor: "#10B981",
        },
      ],
      hotspots: [],
      speakerNotes: `Review the 5 Friday Lab stages totaling 120 minutes. Read Safety Rule #1 aloud: "${lesson.safetyNotes[0] || 'Always wire circuits with USB and batteries disconnected!'}"`,
    },

    // Slide 04 — Core Working Principle & Science
    {
      id: `${lesson.id}-s04`,
      numberLabel: "04",
      title: `Working Principle: ${c0.title}`,
      subtitle: "The physical logic, voltage limits, and semiconductor principles driving our circuit.",
      badge: `${lesson.code} • WORKING PRINCIPLE & ELECTRONIC LAWS`,
      theme: "arduino-teal",
      layout: "interactive-grid",
      fontFamily: "sans",
      titleSize: "standard",
      textAlign: "left",
      animation: "zoom-in",
      heroImage: heroSvg,
      imageCaption: `Component Anatomy & Physics • ${c0.title}`,
      fallbackVariant: "arduino",
      galleryImages: [],
      cards: [
        {
          id: `${lesson.id}-s04-c1`,
          badge: "CORE WORKING PRINCIPLE",
          title: c0.title,
          body: c0.explanation,
          accentColor: "#FBBF24",
        },
        {
          id: `${lesson.id}-s04-v1`,
          badge: `KEY VOCABULARY • ${(lesson.vocabulary[0]?.term || "HARDWARE").toUpperCase()}`,
          title: `${lesson.vocabulary[0]?.term || "Hardware"} — ${lesson.vocabulary[0]?.plainMeaning || ""}`,
          body: lesson.vocabulary[0]?.technicalMeaning || "Electronic circuit component operating under real-time microcontroller control.",
          accentColor: "#0D9488",
        },
        {
          id: `${lesson.id}-s04-chk`,
          badge: "BENCH SIGNAL CHECK",
          title: "Quick Signal & Voltage Check",
          body: lesson.checksForUnderstanding[0] || "Trace how input sensors trigger microcontroller logic to command actuators.",
          accentColor: "#38BDF8",
        },
      ],
      hotspots: [],
      speakerNotes: `Explain the physical principle. Ask students: "Why do we need this component in our robot?" ${c0.instructorNote || ""}`,
    },

    // Slide 05 — Hardware Anatomy, Pinout & Breadboard X-Ray
    {
      id: `${lesson.id}-s05`,
      numberLabel: "05",
      title: "Hardware Pinout Map & Point-to-Point Breadboard X-Ray",
      subtitle: `Schematic: ${lesson.physicalBuildPack?.schematic || "Follow the point-to-point table with power OFF."}`,
      badge: `${lesson.code} • POINT-TO-POINT BREADBOARD X-RAY`,
      theme: "robobee-dark",
      layout: "split-media",
      fontFamily: "mono",
      titleSize: "standard",
      textAlign: "left",
      animation: "fade-up",
      heroImage: heroSvg,
      imageCaption: `Wiring Schematic • ${lesson.physicalBuildPack?.schematic || "Point-to-Point Breadboard Connections"}`,
      fallbackVariant: "arduino",
      galleryImages: [],
      cards: (lesson.physicalBuildPack?.wireTable || []).slice(0, 6).map((w, idx) => ({
        id: `${lesson.id}-s05-w-${idx}`,
        badge: `WIRE 0${idx + 1} • ${w.from} -> ${w.to}`,
        title: `${w.from}  -->  ${w.to}`,
        body: w.wireOrPolarityNote || "Verify firm insertion into breadboard spring clip.",
        accentColor: idx % 2 === 0 ? "#F5B800" : "#38BDF8",
      })),
      hotspots: [],
      speakerNotes: "Keep this slide projected during the 40-minute Guided Breadboard Assembly. Ensure students connect wires with power disconnected!",
    },

    // Slide 06 — Complete Firmware & Code Lab
    {
      id: `${lesson.id}-s06`,
      numberLabel: "06",
      title: `Complete Workshop Firmware (${(lesson.codeLab?.language || "cpp").toUpperCase()})`,
      subtitle: lesson.codeLab?.expectedResult || "Upload, test, and understand each line driving the physical actuators.",
      badge: `${lesson.code} • COMPLETE ARDUINO C++ FIRMWARE`,
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
          body: lesson.codeLab?.code || "// Verified RoboBee Arduino sketch\nvoid setup() {\n  // Setup code\n}\nvoid loop() {\n  // Main loop\n}",
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
      speakerNotes: "Walk through the code block. Explain setup() vs loop(). Show students how to copy or flash code directly into Arduino IDE.",
    },

    // Slide 07 — 3-Band Differentiated Lab Sprint (Class 3 to Class 12)
    {
      id: `${lesson.id}-s07`,
      numberLabel: "07",
      title: "3-Band Differentiated Lab Sprint (Class 3 to Class 12)",
      subtitle: "Stage 5 (5:20–5:45 PM): Every student builds the core circuit, then tackles their age-band challenge!",
      badge: `${lesson.code} • 3-BAND DIFFERENTIATION (ZERO BOREDOM, ZERO OVERWHELM)`,
      theme: "robobee-dark",
      layout: "interactive-grid",
      fontFamily: "sans",
      titleSize: "standard",
      textAlign: "left",
      animation: "fade-up",
      heroImage: heroSvg,
      imageCaption: `3-Band Multi-Age Differentiation • ${lesson.title}`,
      fallbackVariant: "arduino",
      galleryImages: [],
      cards: [
        {
          id: `${lesson.id}-s07-ba`,
          badge: "BAND A • CLASS 3–5 (WONDER BUILDERS)",
          title: "Guided Tactile & Visual Challenge",
          body:
            lesson.bandChallenges?.bandA ||
            lesson.differentiation?.support?.[0] ||
            `Complete the guided ${lesson.project.name} wiring and pass 3 bench test trials with zero polarity errors.`,
          accentColor: "#10B981",
        },
        {
          id: `${lesson.id}-s07-bb`,
          badge: "BAND B • CLASS 6–8 (TACTICAL MAKERS)",
          title: "Core Logic & Parameter Tuning Sprint",
          body:
            lesson.bandChallenges?.bandB ||
            `Complete ${lesson.activity.title}, customize timing/threshold parameters in C++ code, and verify on the arena bench.`,
          accentColor: "#F5B800",
        },
        {
          id: `${lesson.id}-s07-bc`,
          badge: "BAND C • CLASS 9–12 (SYSTEMS ENGINEERS)",
          title: "Advanced Algorithm & Telemetry Challenge",
          body:
            lesson.bandChallenges?.bandC ||
            lesson.differentiation?.extension?.[0] ||
            lesson.activity.extension ||
            `Extend ${lesson.project.name} with custom C++ functions, empirical measurement logging, and edge-case protection.`,
          accentColor: "#38BDF8",
        },
      ],
      hotspots: [],
      speakerNotes: "Project this 3-Band Challenge slide during the 25-minute sprint. Point Class 3–5 to Band A, Class 6–8 to Band B, and Class 9–12 to Band C!",
    },

    // Slide 08 — Hands-On Exit Ticket & Formative Reflection
    {
      id: `${lesson.id}-s08`,
      numberLabel: "08",
      title: "Hands-On Exit Ticket & Engineering Reflection",
      subtitle: "Discuss with your bench partner, then click each card to reveal the verified engineering answer!",
      badge: `${lesson.code} • FORMATIVE ASSESSMENT & BENCH REFLECTION`,
      theme: "robobee-dark",
      layout: "interactive-grid",
      fontFamily: "sans",
      titleSize: "standard",
      textAlign: "left",
      animation: "zoom-in",
      heroImage: heroSvg,
      imageCaption: `Exit Check • 4-Question Formative Reflection`,
      fallbackVariant: "arduino",
      galleryImages: [],
      cards: (lesson.exitTicket || []).slice(0, 4).map((q, idx) => ({
        id: `${lesson.id}-s08-q-${idx}`,
        badge: `EXIT CHECK Q0${idx + 1} (CLICK TO REVEAL)`,
        title: q.question,
        body: q.hint || "Discuss with your bench partner before revealing the engineering answer!",
        accentColor: idx === 0 ? "#38BDF8" : idx === 1 ? "#00F5D4" : idx === 2 ? "#F5B800" : "#10B981",
        isQuizCard: true,
        quizVerdict: q.rubricOrSampleReasoning,
        quizIsPositive: true,
      })),
      hotspots: [],
      speakerNotes: "Click each card on the projector to reveal the verified engineering answer after students share their thinking!",
    },

    // Slide 09 — Up Next: Next Class Teaser & Lab Mission
    {
      id: `${lesson.id}-s09`,
      numberLabel: "09",
      title: `Up Next: ${lesson.nextLessonTeaser}`,
      subtitle: "Next Friday 4:00–6:00 PM • Bring your engineering logbook & lab kit.",
      badge: `${lesson.code} • UP NEXT ON FRIDAY 4:00 PM`,
      theme: "robobee-dark",
      layout: "hero-title",
      fontFamily: "display",
      titleSize: "hero",
      textAlign: "left",
      animation: "fade-up",
      heroImage: heroSvg,
      imageCaption: `Next Friday Lab Preview • ${lesson.nextLessonTeaser}`,
      fallbackVariant: "rover",
      galleryImages: [],
      cards: [
        {
          id: `${lesson.id}-s09-next`,
          badge: "NEXT FRIDAY'S HARDWARE BUILD",
          title: "Next Practical Challenge",
          body: lesson.nextLessonTeaser,
          detail: "Lab Hours: Every Friday 4:00 PM – 6:00 PM (120 Minutes)",
          accentColor: "#F5B800",
        },
        {
          id: `${lesson.id}-s09-log`,
          badge: "ENGINEERING LOGBOOK REQUIREMENT",
          title: "Workbench Pack-Up Protocol",
          body: "Disconnect USB power first, place all jumper wires and sensors back in your bench kit tray, and submit your Exit Ticket.",
          detail: "RoboBee Innovators • Narayanganj Maker Lab",
          accentColor: "#10B981",
        },
      ],
      hotspots: [],
      speakerNotes: `Congratulate the students on completing today's build! Preview next Friday's mission: "${lesson.nextLessonTeaser}"`,
      ctaText: "Session Complete! See You Next Friday 4:00 PM ->",
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
    lastEditedAt: "2026-11-03T12:00:00.000Z",
    hardwareSimType: mapVisualizerToSimType(lesson.visualizerId),
    kitComponents: (lesson.physicalBuildPack?.componentList || []).map((c) => ({
      name: c.name,
      spec: c.exactVariant,
      qty: c.quantity,
    })),
    isSupportLab: lesson.isSupportLab,
    bandChallenges: lesson.bandChallenges,
    slides,
  };
}

export const INITIAL_SEED_DECKS: EditableClassDeck[] = ALL_ROBOTICS_LESSONS.map((lesson) => {
  return buildStructured12SlideDeckFromLesson(lesson);
});

export const SEED_CLASS_01_DECK: EditableClassDeck = INITIAL_SEED_DECKS[0];
export const SEED_CLASS_02_DECK: EditableClassDeck = INITIAL_SEED_DECKS[1] || INITIAL_SEED_DECKS[0];
export const SEED_CLASS_03_DECK: EditableClassDeck = INITIAL_SEED_DECKS[2] || INITIAL_SEED_DECKS[0];
export const SEED_CLASS_04_DECK: EditableClassDeck = INITIAL_SEED_DECKS[3] || INITIAL_SEED_DECKS[0];


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
    // Purge legacy storage keys from previous versions so the browser never resurrects outdated presentations
    window.localStorage.removeItem("robobee_slide_studio_decks_v1");
    window.localStorage.removeItem("robobee_slide_studio_decks_v2");
    window.localStorage.removeItem("robobee_slide_studio_decks_v3");
    window.localStorage.removeItem("robobee_curriculum_decks_v1");
    window.localStorage.removeItem("robobee_curriculum_decks_v2");

    const raw = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      return INITIAL_SEED_DECKS;
    }
    const parsed = JSON.parse(raw) as EditableClassDeck[];
    if (!Array.isArray(parsed) || parsed.length === 0) return INITIAL_SEED_DECKS;

    // Ensure all 44 canonical seed decks exist matching the updated 2026 Master Curriculum
    const map = new Map<string, EditableClassDeck>();
    INITIAL_SEED_DECKS.forEach((d) => map.set(d.id, d));
    parsed.forEach((d) => {
      const canonical = map.get(d.id);
      if (canonical) {
        if (!d.slides || d.slides.length < 8) {
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
      } else {
        map.set(d.id, d);
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
      const data = docSnap.data() as EditableClassDeck & { curriculumVersion?: string };
      // Only merge Firestore decks if they match the 2026_master curriculum or were edited recently to prevent resurrecting legacy slides
      if (
        data &&
        data.id &&
        Array.isArray(data.slides) &&
        (data.curriculumVersion === "2026_master" ||
          (data.lastEditedAt && data.lastEditedAt > "2026-11-01"))
      ) {
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
