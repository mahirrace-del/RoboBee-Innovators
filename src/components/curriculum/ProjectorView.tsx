"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import styles from "./projectorView.module.css";
import { RoboticsLesson } from "@/lib/curriculumData";
import {
  SlideColorTheme,
  THEME_PALETTE_CONFIG,
  PresentationMediaFrame,
} from "./Class1WorkshopDeck";
import {
  EditableClassDeck,
  getOrBuildDeckForLesson,
  SEED_CLASS_01_DECK,
  normalizeDeckToFreeform,
} from "@/lib/slideStudioStore";
import { FreeformSlideStage } from "./freeform/FreeformSlideStage";
import { HardwareLabDrawer } from "./HardwareLabDrawer";
import {
  Play,
  Pause,
  RotateCcw,
  Maximize,
  X,
  ArrowLeft,
  ArrowRight,
  Clock,
  BookOpen,
  Layers,
  Palette,
  Crosshair,
  ZoomIn,
  LayoutGrid,
  Cpu,
  Edit3,
  Volume2,
  VolumeX,
  Sparkles,
  Sun,
  Pin,
  PinOff,
  Check,
} from "lucide-react";
import {
  playPop,
  playChime,
  playClick,
  playFanfare,
  launchConfetti,
} from "./presentationEffects";
import { db } from "@/lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import {
  normalizeInventoryItem,
  verifyLessonBOMStock,
  RelationalInventoryItem,
} from "@/lib/portalRelations";
import {
  saveSessionAttendance,
  ScheduledClassSession,
} from "@/lib/scheduleAttendance";

interface ProjectorViewProps {
  lesson: RoboticsLesson;
  onClose: () => void;
  initialSlide?: number;
  customDeck?: EditableClassDeck;
  onEditDeck?: (deck: EditableClassDeck, slideIdx: number) => void;
}

export const FRIDAY_LAB_5_STAGES = [
  { id: 1, range: "00–15m", label: "Hook & Live Demo", startMin: 0, endMin: 15, duration: 15, desc: "Hook & Live Demo" },
  { id: 2, range: "15–40m", label: "Interactive Concept & Pinout", startMin: 15, endMin: 40, duration: 25, desc: "Interactive Concept & Pinout" },
  { id: 3, range: "40–75m", label: "Breadboard Wiring & Assembly", startMin: 40, endMin: 75, duration: 35, desc: "Breadboard Wiring & Assembly" },
  { id: 4, range: "75–100m", label: "Code & Serial Debugging", startMin: 75, endMin: 100, duration: 25, desc: "Code & Serial Debugging" },
  { id: 5, range: "100–120m", label: "Game Challenge & Showoff", startMin: 100, endMin: 120, duration: 20, desc: "Game Challenge & Showoff" },
];

export function ProjectorView({
  lesson,
  onClose,
  initialSlide = 0,
  customDeck,
  onEditDeck,
}: ProjectorViewProps) {
  const [mounted, setMounted] = useState<boolean>(false);
  const [activeDeck, setActiveDeck] = useState<EditableClassDeck>(
    () => normalizeDeckToFreeform(customDeck || getOrBuildDeckForLesson(lesson))
  );
  const [currentSlide, setCurrentSlide] = useState<number>(initialSlide);
  const [stepRevealCount, setStepRevealCount] = useState<number>(0);

  // Dynamic Theme Override ('auto' or one of the curated themes)
  const [themeOverride, setThemeOverride] = useState<SlideColorTheme | "auto">("auto");

  // Zen Cinema Mode: Hides bars for clean presentation projection
  const [isZenMode, setIsZenMode] = useState<boolean>(false);

  // Classroom Sound Effects (Web Audio synth toggle)
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Slide Thumbnail Filmstrip / Grid Overview Modal
  const [showThumbnailStrip, setShowThumbnailStrip] = useState<boolean>(false);

  // Interactive Hardware Lab & Simulation Drawer ('H' key or Dock button)
  const [showHardwareLab, setShowHardwareLab] = useState<boolean>(false);

  // Laser Pointer Mode ('L' key or Dock button)
  const [laserActive, setLaserActive] = useState<boolean>(false);

  // Spotlight Mode ('S' key or Dock button)
  const [spotlightActive, setSpotlightActive] = useState<boolean>(false);

  // Pointer position for Laser & Spotlight
  const [laserPos, setLaserPos] = useState<{ x: number; y: number }>({
    x: -100,
    y: -100,
  });

  // Fullscreen Image Lightbox Zoom ('Z' key or clicking any slide image)
  const [zoomedMedia, setZoomedMedia] = useState<{
    src: string;
    caption: string;
  } | null>(null);

  // Rhythm duration mode: 120m standard vs 60m compact
  const defaultDuration =
    activeDeck.durationMinutes || lesson.durationMinutes || 120;
  const [isCompactMode, setIsCompactMode] = useState<boolean>(false);
  const [timerSeconds, setTimerSeconds] = useState<number>(defaultDuration * 60);
  const [timerRunning, setTimerRunning] = useState<boolean>(false);

  // Font scaling controls (100%, 125%, 150%)
  const [fontScale, setFontScale] = useState<number>(100);

  // Collapsible Instructor Speaker Notes Drawer & Dual-Screen Presenter Console
  const [showSpeakerNotes, setShowSpeakerNotes] = useState<boolean>(false);
  const [showPresenterConsole, setShowPresenterConsole] = useState<boolean>(false);

  // Touch swipe tracking for tablet/mobile
  const touchStartX = useRef<number | null>(null);

  // Live Lab Inventory & Student Attendance for Presenter Console
  const [inventoryItems, setInventoryItems] = useState<RelationalInventoryItem[]>([]);
  const [activeSession, setActiveSession] = useState<ScheduledClassSession | null>(null);
  const [clubMembers, setClubMembers] = useState<any[]>([]);

  useEffect(() => {
    if (customDeck) {
      setActiveDeck(normalizeDeckToFreeform(customDeck));
    } else {
      setActiveDeck(normalizeDeckToFreeform(getOrBuildDeckForLesson(lesson)));
    }
  }, [customDeck, lesson]);

  useEffect(() => {
    setStepRevealCount(0);
  }, [currentSlide]);

  const slides = activeDeck.slides.length > 0 ? activeDeck.slides : SEED_CLASS_01_DECK.slides;
  const totalSlides = slides.length;
  const safeSlideIndex = Math.min(Math.max(0, currentSlide), totalSlides - 1);
  const activeSlide = slides[safeSlideIndex] || slides[0];

  const effectiveTheme: SlideColorTheme =
    themeOverride === "auto" ? activeSlide.theme : themeOverride;
  const activePalette = THEME_PALETTE_CONFIG[effectiveTheme] || THEME_PALETTE_CONFIG["robobee-dark"];

  useEffect(() => {
    setMounted(true);
    document.body.style.overflow = "hidden";

    // Read stored sound preference
    try {
      const storedSound = localStorage.getItem("robobee_presenter_sound");
      if (storedSound !== null) {
        setSoundEnabled(storedSound === "true");
      }
    } catch {}

    if (initialSlide === 0) {
      try {
        const params = new URLSearchParams(window.location.search);
        const slideParam = params.get("slide");
        if (slideParam !== null) {
          const parsed = parseInt(slideParam, 10);
          if (!isNaN(parsed) && parsed >= 1 && parsed <= totalSlides) {
            setCurrentSlide(parsed - 1);
          }
        }
      } catch {}
    }

    const unsubInv = onSnapshot(collection(db, "inventory"), (snap) => {
      setInventoryItems(
        snap.docs.map((d) => normalizeInventoryItem(d.id, d.data()))
      );
    });
    const unsubSessions = onSnapshot(collection(db, "sessions"), (snap) => {
      const match = snap.docs
        .map((d) => ({ id: d.id, ...d.data() } as ScheduledClassSession))
        .find((s) => s.lessonId === activeDeck.id || s.lessonId === lesson.id || s.status === "active");
      setActiveSession(match || null);
    });
    const unsubUsers = onSnapshot(collection(db, "users"), (snap) => {
      setClubMembers(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    return () => {
      document.body.style.overflow = "";
      unsubInv();
      unsubSessions();
      unsubUsers();
    };
  }, [activeDeck.id, lesson.id, totalSlides, initialSlide]);

  // Sync currentSlide to URL query parameter (?slide=N)
  useEffect(() => {
    if (!mounted) return;
    try {
      const url = new URL(window.location.href);
      url.searchParams.set("slide", String(safeSlideIndex + 1));
      window.history.replaceState({}, "", url.toString());
    } catch {}
  }, [safeSlideIndex, mounted]);

  const toggleSound = useCallback(() => {
    setSoundEnabled((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("robobee_presenter_sound", String(next));
      } catch {}
      if (next) playPop(true);
      return next;
    });
  }, []);

  const nextSlide = useCallback(() => {
    if (safeSlideIndex < totalSlides - 1) {
      setCurrentSlide((prev) => prev + 1);
      playPop(soundEnabled);
    }
  }, [totalSlides, safeSlideIndex, soundEnabled]);

  const prevSlide = useCallback(() => {
    if (safeSlideIndex > 0) {
      setCurrentSlide((prev) => prev - 1);
      playPop(soundEnabled);
    }
  }, [safeSlideIndex, soundEnabled]);

  const stepRevealElements = (activeSlide.elements || []).filter(
    (el) => el.animation?.type === "step-reveal"
  );

  const handleAdvanceStepOrSlide = useCallback(() => {
    if (stepRevealCount < stepRevealElements.length) {
      setStepRevealCount((prev) => prev + 1);
      playPop(soundEnabled);
    } else {
      nextSlide();
    }
  }, [stepRevealCount, stepRevealElements.length, nextSlide, soundEnabled]);

  const handleStepBackOrSlide = useCallback(() => {
    if (stepRevealCount > 0) {
      setStepRevealCount((prev) => prev - 1);
      playPop(soundEnabled);
    } else {
      prevSlide();
    }
  }, [stepRevealCount, prevSlide, soundEnabled]);

  const toggleFullScreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else if (document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    }
  }, []);

  const toggleZoomCurrentSlide = useCallback(() => {
    setZoomedMedia((prev) =>
      prev
        ? null
        : {
            src: activeSlide.heroImage,
            caption: activeSlide.imageCaption,
          }
    );
  }, [activeSlide]);

  const handleCelebrate = useCallback(() => {
    launchConfetti();
    playFanfare(soundEnabled);
  }, [soundEnabled]);

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showHardwareLab) {
        if (e.key === "Escape") {
          setShowHardwareLab(false);
        }
        return;
      }
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        handleAdvanceStepOrSlide();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        handleStepBackOrSlide();
      } else if (e.key === "Escape") {
        if (zoomedMedia) {
          setZoomedMedia(null);
        } else if (isZenMode) {
          setIsZenMode(false);
        } else if (showThumbnailStrip) {
          setShowThumbnailStrip(false);
        } else if (showSpeakerNotes) {
          setShowSpeakerNotes(false);
        } else if (showPresenterConsole) {
          setShowPresenterConsole(false);
        } else {
          onClose();
        }
      } else if (e.key.toLowerCase() === "f") {
        toggleFullScreen();
      } else if (e.key.toLowerCase() === "g") {
        setShowThumbnailStrip((prev) => !prev);
        playPop(soundEnabled);
      } else if (e.key.toLowerCase() === "l") {
        setLaserActive((prev) => !prev);
        setSpotlightActive(false);
        playPop(soundEnabled);
      } else if (e.key.toLowerCase() === "s") {
        setSpotlightActive((prev) => !prev);
        setLaserActive(false);
        playPop(soundEnabled);
      } else if (e.key.toLowerCase() === "c") {
        handleCelebrate();
      } else if (e.key.toLowerCase() === "m") {
        toggleSound();
      } else if (e.key.toLowerCase() === "z") {
        if (zoomedMedia) {
          setZoomedMedia(null);
        } else {
          const slideImg =
            activeSlide.elements?.find((el) => el.type === "image")?.content ||
            activeSlide.heroImage;
          if (slideImg) {
            setZoomedMedia({
              src: slideImg,
              caption: activeSlide.imageCaption || activeSlide.title,
            });
            playPop(soundEnabled);
          } else {
            setIsZenMode((prev) => !prev);
            playPop(soundEnabled);
          }
        }
      } else if (e.key.toLowerCase() === "n") {
        setShowSpeakerNotes((prev) => !prev);
      } else if (e.key.toLowerCase() === "h") {
        setShowHardwareLab((prev) => !prev);
      } else if (e.key.toLowerCase() === "t") {
        setTimerRunning((r) => !r);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    handleAdvanceStepOrSlide,
    handleStepBackOrSlide,
    onClose,
    toggleFullScreen,
    handleCelebrate,
    toggleSound,
    isZenMode,
    zoomedMedia,
    showThumbnailStrip,
    showHardwareLab,
    showSpeakerNotes,
    showPresenterConsole,
    soundEnabled,
  ]);

  // Rhythm timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((s) => (s > 0 ? s - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning, timerSeconds]);

  const resetTimer = (durationMins?: number) => {
    setTimerRunning(false);
    const mins =
      durationMins !== undefined
        ? durationMins
        : isCompactMode
        ? 60
        : defaultDuration;
    setTimerSeconds(mins * 60);
  };

  const handleToggleCompact = () => {
    const nextMode = !isCompactMode;
    setIsCompactMode(nextMode);
    resetTimer(nextMode ? 60 : 120);
  };

  const formatTimer = (totalSec: number) => {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const progressPercentage = ((safeSlideIndex + 1) / totalSlides) * 100;

  if (!mounted) return null;

  const modalContent = (
    <div
      className={styles.projectorOverlay}
      onMouseMove={(e) => {
        setLaserPos({ x: e.clientX, y: e.clientY });
      }}
      onTouchStart={(e) => {
        touchStartX.current = e.touches[0]?.clientX ?? null;
      }}
      onTouchEnd={(e) => {
        if (touchStartX.current === null) return;
        const deltaX = (e.changedTouches[0]?.clientX ?? 0) - touchStartX.current;
        if (deltaX < -50) handleAdvanceStepOrSlide();
        if (deltaX > 50) handleStepBackOrSlide();
        touchStartX.current = null;
      }}
      style={{
        background: activePalette.canvasBg,
        cursor: laserActive ? "none" : "default",
      }}
    >
      {/* Top Glowing Progress Bar */}
      <div className={`${styles.topProgressBar} ${isZenMode ? styles.zenHidden : ""}`}>
        <div
          className={styles.topProgressBarFill}
          style={{
            width: `${progressPercentage}%`,
            background: `linear-gradient(90deg, ${activePalette.accentPrimary}, ${activePalette.accentSecondary})`,
          }}
        />
      </div>

      {/* Top Glassmorphic Studio Bar */}
      <header className={`${styles.topBar} ${isZenMode ? styles.zenHidden : ""}`}>
        <div className={styles.brandGroup}>
          <span className={styles.classCodeTag}>
            {activeDeck.classCode} • LIVE PRESENTATION
          </span>
          <span className={styles.classTitleText}>
            {activeDeck.title}
          </span>
          {stepRevealElements.length > 0 && (
            <span
              style={{
                fontSize: "0.72rem",
                fontWeight: 800,
                color: "#38BDF8",
                background: "rgba(56, 189, 248, 0.15)",
                border: "1px solid rgba(56, 189, 248, 0.3)",
                borderRadius: "999px",
                padding: "2px 8px",
              }}
            >
              Step {Math.min(stepRevealCount, stepRevealElements.length)} / {stepRevealElements.length}
            </span>
          )}
        </div>

        {/* 2-Hour (120-Minute) Friday Lab 5-Stage Phase Tracker */}
        <div className={styles.phaseTracker} title="2-Hour Friday Lab 5-Stage Pacing Engine">
          {FRIDAY_LAB_5_STAGES.map((stg) => {
            const elapsedMinutes = Math.max(0, Math.floor(((defaultDuration * 60) - timerSeconds) / 60));
            const isActive = elapsedMinutes >= stg.startMin && elapsedMinutes < stg.endMin;
            const isCompleted = elapsedMinutes >= stg.endMin;

            return (
              <button
                key={stg.id}
                type="button"
                onClick={() => {
                  setTimerSeconds(Math.max(0, (defaultDuration - stg.startMin) * 60));
                  playPop(soundEnabled);
                }}
                className={`${styles.phasePill} ${isActive ? styles.phasePillActive : isCompleted ? styles.phasePillCompleted : ""}`}
                title={`Phase ${stg.id}: ${stg.desc} (${stg.range}) • Click to jump timer to this phase`}
              >
                <span className={styles.phaseTimeTag}>{stg.range}</span>
                <span>{isCompleted ? `✓ ${stg.label}` : stg.label}</span>
              </button>
            );
          })}
        </div>

        {/* Classroom Rhythm Timer */}
        <div className={styles.timerWidget}>
          <Clock size={14} color="#00F5D4" />
          <span className={styles.timerClock}>
            {formatTimer(timerSeconds)}
          </span>
          <button
            type="button"
            onClick={() => setTimerRunning((r) => !r)}
            className={styles.timerBtn}
            title={timerRunning ? "Pause timer (T)" : "Start timer (T)"}
          >
            {timerRunning ? <Pause size={12} /> : <Play size={12} />}
          </button>
          <button
            type="button"
            onClick={() => resetTimer()}
            className={styles.timerBtn}
            title="Reset timer"
          >
            <RotateCcw size={12} />
          </button>
          <button
            type="button"
            onClick={handleToggleCompact}
            className={styles.timerDurationPill}
            style={{
              background: isCompactMode ? "#00F5D4" : "rgba(255,255,255,0.12)",
              color: isCompactMode ? "#0F172A" : "#FFFFFF",
            }}
          >
            {isCompactMode ? "60m" : "120m"}
          </button>
        </div>

        {/* Font Scale & Top Actions */}
        <div className={styles.controlsGroup}>
          <div
            style={{
              display: "flex",
              background: "rgba(255,255,255,0.08)",
              borderRadius: "8px",
              padding: "2px",
            }}
          >
            {[100, 125, 150].map((scale) => (
              <button
                key={scale}
                type="button"
                onClick={() => setFontScale(scale)}
                style={{
                  background: fontScale === scale ? "#00F5D4" : "transparent",
                  color: fontScale === scale ? "#0F172A" : "#E2E8F0",
                  border: "none",
                  padding: "3px 8px",
                  borderRadius: "6px",
                  fontSize: "0.72rem",
                  fontWeight: 800,
                  cursor: "pointer",
                }}
              >
                {scale}%
              </button>
            ))}
          </div>

          {onEditDeck && (
            <button
              type="button"
              onClick={() => onEditDeck(activeDeck, safeSlideIndex)}
              className={styles.actionBtn}
              style={{
                background: "rgba(56, 189, 248, 0.16)",
                borderColor: "#38BDF8",
                color: "#38BDF8",
              }}
              title="Customize this slide in Slide Studio"
            >
              <Edit3 size={14} />
              <span>Edit Slide</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setShowHardwareLab(true)}
            className={styles.actionBtn}
            style={{
              background: "rgba(16, 185, 129, 0.16)",
              borderColor: "#10B981",
              color: "#10B981",
            }}
            title="Open Interactive Hardware Lab & Circuit Simulator (H)"
          >
            <Cpu size={14} />
            <span>Hardware Lab (H)</span>
          </button>

          <button
            type="button"
            onClick={() => setShowPresenterConsole((prev) => !prev)}
            className={styles.actionBtn}
            style={{
              background: showPresenterConsole ? "#00F5D4" : "rgba(255,255,255,0.08)",
              color: showPresenterConsole ? "#0F172A" : "#FFFFFF",
            }}
          >
            <Layers size={14} />
            <span>Presenter Console</span>
          </button>

          <button
            type="button"
            onClick={toggleFullScreen}
            className={styles.actionBtn}
            title="Fullscreen (F)"
          >
            <Maximize size={14} />
            <span>Fullscreen (F)</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className={`${styles.actionBtn} ${styles.closeBtn}`}
            title="Exit Projector (Esc)"
          >
            <X size={15} />
            <span>Exit</span>
          </button>
        </div>
      </header>

      {/* Main 16:9 Presentation Stage Area (Reserves 5.5rem bottom space to NEVER overlap dock!) */}
      <main className={styles.presentationStageArea}>
        <div
          style={{
            width: "100%",
            height: "100%",
            maxWidth: "1360px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            fontSize: `${fontScale}%`,
          }}
        >
          <FreeformSlideStage
            slide={activeSlide}
            mode="presenter"
            themeOverride={themeOverride}
            onZoomImage={(src, caption) => setZoomedMedia({ src, caption })}
            stepRevealCount={stepRevealCount}
            soundEnabled={soundEnabled}
            spotlightActive={spotlightActive}
            spotlightPos={laserPos}
          />

          {/* Collapsible Speaker Notes Drawer */}
          {showSpeakerNotes && (
            <div
              style={{
                position: "absolute",
                bottom: "10px",
                left: "2rem",
                right: "2rem",
                maxHeight: "180px",
                overflowY: "auto",
                background: "rgba(15, 23, 42, 0.94)",
                backdropFilter: "blur(20px)",
                border: "1.5px solid #00F5D4",
                borderRadius: "16px",
                padding: "1rem 1.4rem",
                color: "#F8FAFC",
                boxShadow: "0 20px 50px rgba(0,0,0,0.85)",
                zIndex: 1000001,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "0.4rem",
                }}
              >
                <span
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 900,
                    color: "#00F5D4",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                  }}
                >
                  🎙️ Instructor Teaching Prompt — Slide {activeSlide.numberLabel}: {activeSlide.title}
                </span>
                <button
                  type="button"
                  onClick={() => setShowSpeakerNotes(false)}
                  style={{
                    background: "rgba(255,255,255,0.1)",
                    border: "none",
                    color: "#94A3B8",
                    borderRadius: "6px",
                    padding: "2px 6px",
                    cursor: "pointer",
                    fontSize: "0.75rem",
                  }}
                >
                  Close (N)
                </button>
              </div>
              <div
                style={{
                  fontSize: "0.95rem",
                  lineHeight: 1.55,
                  color: "#E2E8F0",
                }}
              >
                {activeSlide.speakerNotes || "Engage the room with questions before advancing to the next card."}
              </div>
            </div>
          )}

          {/* Dual-Screen Presenter Console Drawer */}
          {showPresenterConsole && (
            <div
              style={{
                position: "absolute",
                bottom: "10px",
                left: "2rem",
                right: "2rem",
                maxHeight: "220px",
                overflowY: "auto",
                background: "rgba(15, 23, 42, 0.96)",
                border: "1.5px solid rgba(0, 245, 212, 0.6)",
                borderRadius: "16px",
                padding: "1rem 1.25rem",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: "1rem",
                boxShadow: "0 25px 60px rgba(0,0,0,0.9)",
                zIndex: 1000001,
              }}
            >
              {/* Up Next in Deck */}
              <div
                style={{
                  background: "#0F172A",
                  padding: "0.85rem",
                  borderRadius: "10px",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <div
                  style={{
                    fontSize: "0.72rem",
                    fontWeight: 800,
                    color: "#00F5D4",
                    textTransform: "uppercase",
                    marginBottom: "0.35rem",
                  }}
                >
                  ⏭ Up Next in Deck
                </div>
                <div style={{ fontSize: "0.92rem", fontWeight: 800, color: "#FFFFFF" }}>
                  {safeSlideIndex + 1 < totalSlides
                    ? `Slide ${slides[safeSlideIndex + 1].numberLabel}: ${slides[safeSlideIndex + 1].title}`
                    : "End of Deck — Final Action Roadmap"}
                </div>
              </div>

              {/* Lab Kit Stock Check */}
              <div
                style={{
                  background: "#0F172A",
                  padding: "0.85rem",
                  borderRadius: "10px",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <div
                  style={{
                    fontSize: "0.72rem",
                    fontWeight: 800,
                    color: "#38BDF8",
                    textTransform: "uppercase",
                    marginBottom: "0.35rem",
                  }}
                >
                  🔧 Lab Bench Kit Live Stock Check
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.28rem",
                    maxHeight: "95px",
                    overflowY: "auto",
                  }}
                >
                  {verifyLessonBOMStock(
                    activeDeck.hardwareKit || lesson.physicalBuildPack?.componentList || [],
                    inventoryItems
                  )
                    .slice(0, 5)
                    .map((item, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          fontSize: "0.75rem",
                          color: "#E2E8F0",
                        }}
                      >
                        <span>{item.partName}</span>
                        <span
                          style={{
                            fontFamily: "monospace",
                            fontWeight: 700,
                            color:
                              item.status === "in_stock"
                                ? "#10B981"
                                : item.status === "low_stock"
                                ? "#FBBF24"
                                : "#F43F5E",
                          }}
                        >
                          {item.availableInLab > 0 ? `${item.availableInLab} in lab` : "Verify Locker"}
                        </span>
                      </div>
                    ))}
                </div>
              </div>

              {/* Live Student Attendance Roll Call */}
              <div
                style={{
                  background: "#0F172A",
                  padding: "0.85rem",
                  borderRadius: "10px",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <div
                  style={{
                    fontSize: "0.72rem",
                    fontWeight: 800,
                    color: "#10B981",
                    textTransform: "uppercase",
                    marginBottom: "0.35rem",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <span>✅ Live Student Attendance</span>
                  <span>
                    {activeSession ? `${(activeSession.attendees || []).length} Present` : "On-Demand Mode"}
                  </span>
                </div>
                {!activeSession ? (
                  <div style={{ fontSize: "0.76rem", color: "#94A3B8" }}>
                    Activate a session in Attendance Manager to toggle live roll call here.
                  </div>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "0.35rem",
                      maxHeight: "95px",
                      overflowY: "auto",
                    }}
                  >
                    {clubMembers.slice(0, 12).map((m) => {
                      const uidOrEmail = m.id;
                      const isPresent = (activeSession.attendees || []).includes(uidOrEmail);
                      return (
                        <button
                          key={m.id}
                          type="button"
                          onClick={async () => {
                            const currentList = activeSession.attendees || [];
                            const nextList = isPresent
                              ? currentList.filter((a) => a !== uidOrEmail)
                              : [...currentList, uidOrEmail];
                            try {
                              await saveSessionAttendance(
                                activeSession.id,
                                activeSession,
                                nextList,
                                clubMembers
                              );
                            } catch (e) {
                              console.error("Failed to save attendance:", e);
                            }
                          }}
                          style={{
                            padding: "0.2rem 0.5rem",
                            borderRadius: "6px",
                            fontSize: "0.72rem",
                            fontWeight: 700,
                            cursor: "pointer",
                            border: "1px solid",
                            borderColor: isPresent ? "#10B981" : "rgba(255,255,255,0.12)",
                            background: isPresent
                              ? "rgba(16, 185, 129, 0.18)"
                              : "rgba(255,255,255,0.04)",
                            color: isPresent ? "#10B981" : "#94A3B8",
                          }}
                        >
                          {isPresent ? "✓ " : ""}
                          {m.name || m.email?.split("@")[0] || "Student"}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Slide Thumbnail Filmstrip / Grid Overview Modal */}
      {showThumbnailStrip && (
        <div
          onClick={() => setShowThumbnailStrip(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.88)",
            backdropFilter: "blur(20px)",
            zIndex: 1000006,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            padding: "2rem",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#0F172A",
              border: "2px solid #00F5D4",
              borderRadius: "24px",
              padding: "1.5rem",
              maxWidth: "1360px",
              width: "100%",
              margin: "0 auto 4rem auto",
              boxShadow: "0 25px 60px rgba(0, 0, 0, 0.8)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <LayoutGrid size={18} color="#00F5D4" />
                <span style={{ fontWeight: 900, color: "#FFFFFF", fontSize: "1.05rem" }}>
                  {activeDeck.classCode} Visual Slide Filmstrip ({totalSlides} Interactive Slides)
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowThumbnailStrip(false)}
                style={{
                  background: "rgba(255,255,255,0.1)",
                  border: "none",
                  color: "#FFFFFF",
                  padding: "0.35rem 0.85rem",
                  borderRadius: "999px",
                  cursor: "pointer",
                  fontWeight: 700,
                  fontSize: "0.8rem",
                }}
              >
                Close Strip (Esc)
              </button>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                gap: "0.85rem",
                maxHeight: "55vh",
                overflowY: "auto",
              }}
            >
              {slides.map((s, idx) => {
                const sTheme = THEME_PALETTE_CONFIG[s.theme] || THEME_PALETTE_CONFIG["robobee-dark"];
                const isCurrent = safeSlideIndex === idx;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      setCurrentSlide(idx);
                      setShowThumbnailStrip(false);
                      playPop(soundEnabled);
                    }}
                    style={{
                      background: sTheme.canvasBg,
                      color: sTheme.headingColor,
                      border: `2px solid ${isCurrent ? "#00F5D4" : sTheme.cardBorder}`,
                      borderRadius: "14px",
                      padding: "0.9rem",
                      textAlign: "left",
                      cursor: "pointer",
                      boxShadow: isCurrent ? "0 0 20px #00F5D466" : "none",
                      transition: "transform 0.2s ease",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "0.7rem",
                        fontWeight: 900,
                        marginBottom: "0.35rem",
                        color: sTheme.accentPrimary,
                      }}
                    >
                      <span>SLIDE {s.numberLabel}</span>
                      <span>{s.layout}</span>
                    </div>
                    <div style={{ fontSize: "0.86rem", fontWeight: 800, lineHeight: 1.3 }}>
                      {s.title}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Dedicated Non-Overlapping Bottom Presenter Bar */}
      <footer className={`${styles.bottomBar} ${isZenMode ? styles.zenHidden : ""}`}>
        {/* Navigation Group (Left) */}
        <div className={styles.barNavGroup}>
          <button
            type="button"
            onClick={handleStepBackOrSlide}
            disabled={safeSlideIndex === 0 && stepRevealCount === 0}
            className={styles.barNavBtn}
            title="Previous Step or Slide (ArrowLeft)"
          >
            <ArrowLeft size={14} />
            <span>Prev</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setShowThumbnailStrip((prev) => !prev);
              playPop(soundEnabled);
            }}
            className={styles.barSlideCounterPill}
            title="Open Visual Slide Filmstrip"
          >
            <LayoutGrid size={13} />
            <span>
              {String(safeSlideIndex + 1).padStart(2, "0")} / {String(totalSlides).padStart(2, "0")}
            </span>
          </button>

          <button
            type="button"
            onClick={handleAdvanceStepOrSlide}
            disabled={safeSlideIndex === totalSlides - 1 && stepRevealCount >= stepRevealElements.length}
            className={styles.barNextBtn}
            title="Advance Step or Slide (Space / ArrowRight)"
          >
            <span>Next</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {/* Center Theme Palette Selector (Inline Chips — Zero Overlap!) */}
        <div className={styles.themeSelectorGroup}>
          <span className={styles.themeLabel}>Theme</span>
          {[
            { id: "auto", name: "Auto", color: "#00F5D4" },
            { id: "daylight-studio", name: "Pure Light", color: "#2563EB" },
            { id: "robobee-dark", name: "Solar Dark", color: "#F5B800" },
            { id: "electric-indigo", name: "Cyber Twilight", color: "#818CF8" },
            { id: "arduino-teal", name: "Lab Emerald", color: "#2DD4BF" },
            { id: "cyber-blueprint", name: "Neon Quest", color: "#FB923C" },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                setThemeOverride(t.id as SlideColorTheme | "auto");
                playPop(soundEnabled);
              }}
              className={`${styles.themeChip} ${themeOverride === t.id ? styles.themeChipActive : ""}`}
              title={`Switch presentation theme to ${t.name}`}
            >
              <span
                className={styles.themeChipDot}
                style={{
                  background: t.color,
                  boxShadow: `0 0 6px ${t.color}`,
                }}
              />
              <span>{t.name}</span>
            </button>
          ))}
        </div>

        {/* Tools Group (Right) */}
        <div className={styles.barToolsGroup}>
          {/* Laser Pointer (L) */}
          <button
            type="button"
            onClick={() => {
              setLaserActive((prev) => !prev);
              setSpotlightActive(false);
              playPop(soundEnabled);
            }}
            className={`${styles.barToolBtn} ${laserActive ? styles.barToolBtnActive : ""}`}
            style={
              laserActive
                ? { background: "rgba(244, 63, 94, 0.25)", borderColor: "#F43F5E", color: "#FDA4AF" }
                : undefined
            }
            title="Toggle Glowing Laser Pointer (Key: L)"
          >
            <Crosshair size={13} color={laserActive ? "#F43F5E" : "#00F5D4"} />
            <span>Laser (L)</span>
          </button>

          {/* High-Res Image Zoom Lightbox (Z) */}
          <button
            type="button"
            onClick={() => {
              if (zoomedMedia) {
                setZoomedMedia(null);
              } else {
                const slideImg =
                  activeSlide.elements?.find((el) => el.type === "image")?.content ||
                  activeSlide.heroImage;
                if (slideImg) {
                  setZoomedMedia({
                    src: slideImg,
                    caption: activeSlide.imageCaption || activeSlide.title,
                  });
                  playPop(soundEnabled);
                }
              }
            }}
            className={`${styles.barToolBtn} ${zoomedMedia ? styles.barToolBtnActive : ""}`}
            title="High-Res Circuit Diagram & Image Zoom Lightbox (Key: Z)"
          >
            <ZoomIn size={13} color="#38BDF8" />
            <span>Zoom (Z)</span>
          </button>

          {/* Slide Grid Sorter (G) */}
          <button
            type="button"
            onClick={() => {
              setShowThumbnailStrip((prev) => !prev);
              playPop(soundEnabled);
            }}
            className={`${styles.barToolBtn} ${showThumbnailStrip ? styles.barToolBtnActive : ""}`}
            title="Open Slide Grid Sorter Filmstrip (Key: G)"
          >
            <LayoutGrid size={13} color="#00F5D4" />
            <span>Grid (G)</span>
          </button>

          {/* Spotlight Tool (S) */}
          <button
            type="button"
            onClick={() => {
              setSpotlightActive((prev) => !prev);
              setLaserActive(false);
              playPop(soundEnabled);
            }}
            className={`${styles.barToolBtn} ${spotlightActive ? styles.barToolBtnActive : ""}`}
            title="Toggle Focused Spotlight on Stage (Key: S)"
          >
            <Sun size={13} color={spotlightActive ? "#00F5D4" : "#E2E8F0"} />
            <span>Spotlight (S)</span>
          </button>

          {/* Celebration Confetti Cannon (C) */}
          <button
            type="button"
            onClick={handleCelebrate}
            className={styles.barToolBtn}
            style={{
              background: "linear-gradient(90deg, rgba(245, 184, 0, 0.2), rgba(244, 63, 94, 0.2))",
              border: "1px solid rgba(245, 184, 0, 0.45)",
              color: "#FBBF24",
            }}
            title="Celebrate student achievement with Confetti & Fanfare! (Key: C)"
          >
            <Sparkles size={13} color="#FBBF24" />
            <span>Celebrate (C)</span>
          </button>

          {/* Sound Toggle (M) */}
          <button
            type="button"
            onClick={toggleSound}
            className={`${styles.barToolBtn} ${soundEnabled ? styles.barToolBtnActive : ""}`}
            title={soundEnabled ? "Mute classroom sound effects (Key: M)" : "Enable classroom sound effects (Key: M)"}
          >
            {soundEnabled ? <Volume2 size={13} color="#00F5D4" /> : <VolumeX size={13} color="#94A3B8" />}
            <span>{soundEnabled ? "Sound ON" : "Muted"}</span>
          </button>

          {/* Hardware Lab Simulator (H) */}
          <button
            type="button"
            onClick={() => {
              setShowHardwareLab(true);
              playPop(soundEnabled);
            }}
            className={styles.barToolBtn}
            style={{
              background: "rgba(16, 185, 129, 0.16)",
              border: "1px solid #10B981",
              color: "#6EE7B7",
            }}
            title="Open Interactive Hardware Pinout & Circuit Simulator Lab (Key: H)"
          >
            <Cpu size={13} color="#10B981" />
            <span>Pinout & Lab Sim (H)</span>
          </button>

          {/* Speaker Notes (N) */}
          <button
            type="button"
            onClick={() => setShowSpeakerNotes((prev) => !prev)}
            className={`${styles.barToolBtn} ${showSpeakerNotes ? styles.barToolBtnActive : ""}`}
            title="Toggle Speaker Notes Prompt Drawer (Key: N)"
          >
            <BookOpen size={13} color="#38BDF8" />
            <span>Notes (N)</span>
          </button>

          {/* Zen Cinema Mode (Z) */}
          <button
            type="button"
            onClick={() => {
              setIsZenMode((prev) => !prev);
              playPop(soundEnabled);
            }}
            className={`${styles.barToolBtn} ${isZenMode ? styles.barToolBtnActive : ""}`}
            title="Zen Cinema Mode — Hide Top & Bottom Bars (Key: Z / Esc to exit)"
          >
            <Maximize size={13} color={isZenMode ? "#00F5D4" : "#E2E8F0"} />
            <span>Zen (Z)</span>
          </button>
        </div>
      </footer>

      {/* Glowing Laser Pointer Particle */}
      {laserActive && (
        <div
          className={styles.laserDot}
          style={{
            left: laserPos.x,
            top: laserPos.y,
          }}
        />
      )}

      {/* Fullscreen Image Lightbox Zoom Modal */}
      {zoomedMedia && (
        <div
          onClick={() => setZoomedMedia(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(7, 11, 20, 0.94)",
            backdropFilter: "blur(20px)",
            zIndex: 1000008,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
          }}
        >
          <button
            type="button"
            onClick={() => setZoomedMedia(null)}
            style={{
              position: "absolute",
              top: "24px",
              right: "28px",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              padding: "0.55rem 1.1rem",
              borderRadius: "999px",
              background: "rgba(255,255,255,0.14)",
              border: "1px solid rgba(255,255,255,0.3)",
              color: "#FFFFFF",
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            <X size={18} /> Close Fullscreen Zoom (Esc / Z)
          </button>
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: "1180px",
              width: "100%",
              borderRadius: "22px",
              overflow: "hidden",
            }}
          >
            <PresentationMediaFrame
              src={zoomedMedia.src}
              alt={zoomedMedia.caption}
              caption={zoomedMedia.caption}
              height="76vh"
              accentColor="#00F5D4"
            />
          </div>
        </div>
      )}

      {/* Non-Overlapping Hardware Lab & Circuit Simulator Drawer */}
      {showHardwareLab && (
        <HardwareLabDrawer
          deck={activeDeck}
          lesson={lesson}
          onClose={() => setShowHardwareLab(false)}
        />
      )}
    </div>
  );

  return createPortal(modalContent, document.body);
}
