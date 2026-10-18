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
  loadDecksFromStorage,
  SEED_CLASS_01_DECK,
} from "@/lib/slideStudioStore";
import { EditableSlideCanvas } from "./EditableSlideCanvas";
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
} from "lucide-react";
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

export function ProjectorView({
  lesson,
  onClose,
  initialSlide = 0,
  customDeck,
  onEditDeck,
}: ProjectorViewProps) {
  const [mounted, setMounted] = useState<boolean>(false);
  const [activeDeck, setActiveDeck] = useState<EditableClassDeck>(
    customDeck || SEED_CLASS_01_DECK
  );
  const [currentSlide, setCurrentSlide] = useState<number>(initialSlide);

  // Dynamic Multi-Palette Theme Override ('auto' or one of the 4 curated themes)
  const [themeOverride, setThemeOverride] = useState<SlideColorTheme | "auto">(
    "auto"
  );

  // Slide Thumbnail Filmstrip / Grid Overview Modal
  const [showThumbnailStrip, setShowThumbnailStrip] = useState<boolean>(false);

  // Interactive Hardware Lab & Simulation Drawer ('H' key or Dock button)
  const [showHardwareLab, setShowHardwareLab] = useState<boolean>(false);

  // Laser Pointer Mode ('L' key or Dock button)
  const [laserActive, setLaserActive] = useState<boolean>(false);
  const [laserPos, setLaserPos] = useState<{ x: number; y: number }>({
    x: -100,
    y: -100,
  });

  // Fullscreen Image Lightbox Zoom ('Z' key or clicking any slide image)
  const [zoomedMedia, setZoomedMedia] = useState<{
    src: string;
    caption: string;
  } | null>(null);

  // Rhythm duration mode: 90m vs 60m
  const defaultDuration =
    activeDeck.durationMinutes || lesson.durationMinutes || 90;
  const [isCompactMode, setIsCompactMode] = useState<boolean>(false);
  const [timerSeconds, setTimerSeconds] = useState<number>(defaultDuration * 60);
  const [timerRunning, setTimerRunning] = useState<boolean>(false);

  // Font scaling controls (100%, 125%, 150%)
  const [fontScale, setFontScale] = useState<number>(100);
  // Collapsible Instructor Speaker Notes Drawer & Dual-Screen Presenter Console
  const [showSpeakerNotes, setShowSpeakerNotes] = useState<boolean>(false);
  const [showPresenterConsole, setShowPresenterConsole] =
    useState<boolean>(false);

  // Touch swipe tracking for tablet/mobile
  const touchStartX = useRef<number | null>(null);

  // Live Lab Inventory & Student Attendance for Presenter Console
  const [inventoryItems, setInventoryItems] = useState<
    RelationalInventoryItem[]
  >([]);
  const [activeSession, setActiveSession] =
    useState<ScheduledClassSession | null>(null);
  const [clubMembers, setClubMembers] = useState<any[]>([]);

  useEffect(() => {
    if (customDeck) {
      setActiveDeck(customDeck);
    } else {
      const stored = loadDecksFromStorage();
      const matched = stored.find((d) => d.id === lesson.id);
      if (matched) {
        setActiveDeck(matched);
      }
    }
  }, [customDeck, lesson.id]);

  const slides = activeDeck.slides.length > 0 ? activeDeck.slides : SEED_CLASS_01_DECK.slides;
  const totalSlides = slides.length;
  const safeSlideIndex = Math.min(Math.max(0, currentSlide), totalSlides - 1);
  const activeSlide = slides[safeSlideIndex] || slides[0];

  const effectiveTheme: SlideColorTheme =
    themeOverride === "auto" ? activeSlide.theme : themeOverride;
  const activePalette = THEME_PALETTE_CONFIG[effectiveTheme];

  useEffect(() => {
    setMounted(true);
    document.body.style.overflow = "hidden";

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

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev < totalSlides - 1 ? prev + 1 : prev));
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev > 0 ? prev - 1 : prev));
  }, []);

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

  // Keyboard navigation: ArrowRight/Space (Next), ArrowLeft (Prev), L (Laser), Z (Zoom), H (Hardware Lab), F (Fullscreen), N (Notes), Escape
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
        nextSlide();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        prevSlide();
      } else if (e.key === "Escape") {
        if (zoomedMedia) {
          setZoomedMedia(null);
        } else if (showThumbnailStrip) {
          setShowThumbnailStrip(false);
        } else {
          onClose();
        }
      } else if (e.key.toLowerCase() === "f") {
        toggleFullScreen();
      } else if (e.key.toLowerCase() === "l") {
        setLaserActive((prev) => !prev);
      } else if (e.key.toLowerCase() === "z") {
        toggleZoomCurrentSlide();
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
    nextSlide,
    prevSlide,
    onClose,
    toggleFullScreen,
    toggleZoomCurrentSlide,
    zoomedMedia,
    showThumbnailStrip,
    showHardwareLab,
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
    resetTimer(nextMode ? 60 : 90);
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
        if (laserActive) {
          setLaserPos({ x: e.clientX, y: e.clientY });
        }
      }}
      onTouchStart={(e) => {
        touchStartX.current = e.touches[0]?.clientX ?? null;
      }}
      onTouchEnd={(e) => {
        if (touchStartX.current === null) return;
        const deltaX = (e.changedTouches[0]?.clientX ?? 0) - touchStartX.current;
        if (deltaX < -50) nextSlide();
        if (deltaX > 50) prevSlide();
        touchStartX.current = null;
      }}
      style={{
        background: activePalette.canvasBg,
        zIndex: 999999,
        cursor: laserActive ? "none" : "default",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        transition: "background 0.45s ease",
      }}
    >
      {/* Top Progress Bar */}
      <div
        style={{
          width: "100%",
          height: "4px",
          background: "rgba(255, 255, 255, 0.14)",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: `${progressPercentage}%`,
            height: "100%",
            background: `linear-gradient(90deg, ${activePalette.accentPrimary}, ${activePalette.accentSecondary})`,
            transition: "width 0.3s ease",
          }}
        />
      </div>

      {/* Top Glassmorphic Studio Bar */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0.65rem 1.5rem",
          background: "rgba(15, 23, 42, 0.85)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.12)",
          flexWrap: "wrap",
          gap: "0.75rem",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <span
            style={{
              padding: "0.28rem 0.75rem",
              borderRadius: "999px",
              background: "rgba(0, 245, 212, 0.18)",
              border: "1px solid #00F5D4",
              color: "#00F5D4",
              fontSize: "0.75rem",
              fontWeight: 900,
              letterSpacing: "0.06em",
            }}
          >
            {activeDeck.classCode} • LIVE DECK
          </span>
          <span
            style={{
              fontWeight: 800,
              color: "#FFFFFF",
              fontSize: "0.95rem",
            }}
          >
            {activeDeck.title}
          </span>
        </div>

        {/* Classroom Rhythm Timer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            background: "rgba(255, 255, 255, 0.07)",
            padding: "0.3rem 0.75rem",
            borderRadius: "999px",
            border: "1px solid rgba(255, 255, 255, 0.14)",
          }}
        >
          <Clock size={15} color="#00F5D4" />
          <span
            style={{
              fontFamily: "monospace",
              fontWeight: 900,
              color: "#FFFFFF",
              fontSize: "0.92rem",
            }}
          >
            {formatTimer(timerSeconds)}
          </span>
          <button
            type="button"
            onClick={() => setTimerRunning((r) => !r)}
            className={styles.actionBtn}
            title={timerRunning ? "Pause timer (T)" : "Start timer (T)"}
          >
            {timerRunning ? <Pause size={13} /> : <Play size={13} />}
          </button>
          <button
            type="button"
            onClick={() => resetTimer()}
            className={styles.actionBtn}
            title="Reset timer"
          >
            <RotateCcw size={13} />
          </button>
          <button
            type="button"
            onClick={handleToggleCompact}
            className={styles.actionBtn}
            style={{
              background: isCompactMode ? "#00F5D4" : "rgba(255,255,255,0.1)",
              color: isCompactMode ? "#0F172A" : "#FFFFFF",
              fontWeight: 800,
            }}
          >
            {isCompactMode ? "60m" : "90m"}
          </button>
        </div>

        {/* Font Scale & Top Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
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
                border: "1px solid #38BDF8",
                color: "#38BDF8",
                fontWeight: 800,
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
              border: "1px solid #10B981",
              color: "#10B981",
              fontWeight: 800,
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
              background: showPresenterConsole
                ? "#00F5D4"
                : "rgba(255,255,255,0.08)",
              color: showPresenterConsole ? "#0F172A" : "#FFFFFF",
              fontWeight: 800,
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

      {/* Main 16:9 Widescreen Slide Stage */}
      <main
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "1.25rem 2rem 5.5rem 2rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "1360px",
            fontSize: `${fontScale}%`,
          }}
        >
          <EditableSlideCanvas
            slide={activeSlide}
            themeOverride={themeOverride}
            onNextSlide={nextSlide}
            onZoomImage={(src, caption) => setZoomedMedia({ src, caption })}
          />

          {/* Collapsible Speaker Notes Drawer */}
          {showSpeakerNotes && (
            <div
              style={{
                marginTop: "1rem",
                background: "rgba(15, 23, 42, 0.92)",
                backdropFilter: "blur(16px)",
                border: "1px solid #00F5D4",
                borderRadius: "16px",
                padding: "1rem 1.35rem",
                color: "#F8FAFC",
              }}
            >
              <div
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 900,
                  color: "#00F5D4",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: "0.35rem",
                }}
              >
                🎙️ Instructor Teaching Prompt — Slide {activeSlide.numberLabel}:{" "}
                {activeSlide.title}
              </div>
              <div
                style={{
                  fontSize: "0.95rem",
                  lineHeight: 1.55,
                  color: "#E2E8F0",
                }}
              >
                {activeSlide.speakerNotes}
              </div>
            </div>
          )}

          {/* Dual-Screen Presenter Console (Next Slide + Live BOM Stock + Attendance Checklist) */}
          {showPresenterConsole && (
            <div
              style={{
                marginTop: "1rem",
                background: "rgba(15, 23, 42, 0.94)",
                border: "1px solid rgba(0, 245, 212, 0.45)",
                borderRadius: "16px",
                padding: "1rem 1.25rem",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: "1rem",
              }}
            >
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
                  ⏭ Up Next in Deck (URL Synced: ?slide={safeSlideIndex + 1})
                </div>
                <div
                  style={{
                    fontSize: "0.92rem",
                    fontWeight: 800,
                    color: "#FFFFFF",
                  }}
                >
                  {safeSlideIndex + 1 < totalSlides
                    ? `Slide ${slides[safeSlideIndex + 1].numberLabel}: ${
                        slides[safeSlideIndex + 1].title
                      }`
                    : "End of Deck — Final Action Roadmap"}
                </div>
              </div>

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
                    maxHeight: "100px",
                    overflowY: "auto",
                  }}
                >
                  {verifyLessonBOMStock(
                    activeDeck.hardwareKit ||
                      lesson.physicalBuildPack?.componentList ||
                      [],
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
                          {item.availableInLab > 0
                            ? `${item.availableInLab} in lab`
                            : "Verify Locker"}
                        </span>
                      </div>
                    ))}
                </div>
              </div>

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
                    {activeSession
                      ? `${(activeSession.attendees || []).length} Present`
                      : "On-Demand Mode"}
                  </span>
                </div>
                {!activeSession ? (
                  <div style={{ fontSize: "0.76rem", color: "#94A3B8" }}>
                    Activate a session in Attendance Manager to toggle live roll
                    call here.
                  </div>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "0.35rem",
                      maxHeight: "100px",
                      overflowY: "auto",
                    }}
                  >
                    {clubMembers.slice(0, 12).map((m) => {
                      const uidOrEmail = m.id;
                      const isPresent = (activeSession.attendees || []).includes(
                        uidOrEmail
                      );
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
                            borderColor: isPresent
                              ? "#10B981"
                              : "rgba(255,255,255,0.12)",
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
            backdropFilter: "blur(16px)",
            zIndex: 1000001,
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
              boxShadow: "0 25px 60px rgba(0, 0, 0, 0.75)",
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
                <span
                  style={{
                    fontWeight: 900,
                    color: "#FFFFFF",
                    fontSize: "1.05rem",
                  }}
                >
                  {activeDeck.classCode} Visual Slide Filmstrip ({totalSlides}{" "}
                  Interactive Slides)
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowThumbnailStrip(false)}
                style={{
                  background: "rgba(255,255,255,0.1)",
                  border: "none",
                  color: "#FFFFFF",
                  padding: "0.35rem 0.75rem",
                  borderRadius: "999px",
                  cursor: "pointer",
                  fontWeight: 700,
                }}
              >
                Close Strip
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
                const sTheme = THEME_PALETTE_CONFIG[s.theme];
                const isCurrent = safeSlideIndex === idx;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      setCurrentSlide(idx);
                      setShowThumbnailStrip(false);
                    }}
                    style={{
                      background: sTheme.canvasBg,
                      color: sTheme.headingColor,
                      border: `2px solid ${
                        isCurrent ? "#00F5D4" : sTheme.cardBorder
                      }`,
                      borderRadius: "14px",
                      padding: "0.9rem",
                      textAlign: "left",
                      cursor: "pointer",
                      boxShadow: isCurrent ? "0 0 20px #00F5D466" : "none",
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
                    <div
                      style={{
                        fontSize: "0.86rem",
                        fontWeight: 800,
                        lineHeight: 1.3,
                      }}
                    >
                      {s.title}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Floating Glassmorphic Presenter Control Dock (Bottom) */}
      <footer
        style={{
          position: "fixed",
          bottom: "14px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1000002,
          display: "flex",
          alignItems: "center",
          gap: "0.55rem",
          padding: "0.55rem 1rem",
          borderRadius: "999px",
          background: "rgba(15, 23, 42, 0.88)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.22)",
          boxShadow: "0 20px 50px rgba(0, 0, 0, 0.65)",
          maxWidth: "96vw",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {/* Prev Slide Button */}
        <button
          type="button"
          onClick={prevSlide}
          disabled={safeSlideIndex === 0}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.35rem",
            padding: "0.45rem 0.85rem",
            borderRadius: "999px",
            border: "1px solid rgba(255,255,255,0.18)",
            background:
              safeSlideIndex === 0
                ? "rgba(255,255,255,0.04)"
                : "rgba(255,255,255,0.12)",
            color: safeSlideIndex === 0 ? "#64748B" : "#FFFFFF",
            fontWeight: 800,
            fontSize: "0.8rem",
            cursor: safeSlideIndex === 0 ? "not-allowed" : "pointer",
          }}
        >
          <ArrowLeft size={15} /> Prev
        </button>

        {/* Slide Counter Pill */}
        <button
          type="button"
          onClick={() => setShowThumbnailStrip((prev) => !prev)}
          title="Click to open Visual Slide Filmstrip"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.45rem",
            padding: "0.45rem 1rem",
            borderRadius: "999px",
            border: "1px solid #00F5D4",
            background: "rgba(0, 245, 212, 0.16)",
            color: "#00F5D4",
            fontWeight: 900,
            fontSize: "0.84rem",
            fontFamily: "monospace",
            cursor: "pointer",
          }}
        >
          <LayoutGrid size={14} />
          <span>
            Slide {activeSlide.numberLabel} /{" "}
            {String(totalSlides).padStart(2, "0")}
          </span>
        </button>

        {/* Next Slide Button */}
        <button
          type="button"
          onClick={nextSlide}
          disabled={safeSlideIndex === totalSlides - 1}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.35rem",
            padding: "0.45rem 0.9rem",
            borderRadius: "999px",
            border: "none",
            background:
              safeSlideIndex === totalSlides - 1
                ? "rgba(255,255,255,0.06)"
                : "linear-gradient(90deg, #00F5D4, #38BDF8)",
            color: safeSlideIndex === totalSlides - 1 ? "#64748B" : "#0F172A",
            fontWeight: 900,
            fontSize: "0.8rem",
            cursor:
              safeSlideIndex === totalSlides - 1 ? "not-allowed" : "pointer",
          }}
        >
          Next <ArrowRight size={15} />
        </button>

        {/* Divider */}
        <div
          style={{
            width: "1px",
            height: "22px",
            background: "rgba(255,255,255,0.18)",
          }}
        />

        {/* Theme Switcher Override Pill Selector */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.3rem",
            background: "rgba(255,255,255,0.07)",
            padding: "0.25rem 0.5rem",
            borderRadius: "999px",
            border: "1px solid rgba(255,255,255,0.15)",
          }}
        >
          <Palette size={14} color="#38BDF8" />
          {(
            [
              { id: "auto", label: "Auto Dynamic" },
              { id: "daylight-studio", label: "Daylight Studio" },
              { id: "electric-indigo", label: "Electric Indigo" },
              { id: "arduino-teal", label: "Arduino Teal" },
              { id: "cyber-blueprint", label: "Cyber Blueprint" },
            ] as const
          ).map((t) => {
            const active = themeOverride === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setThemeOverride(t.id)}
                style={{
                  padding: "0.25rem 0.6rem",
                  borderRadius: "999px",
                  border: "none",
                  background: active ? "#38BDF8" : "transparent",
                  color: active ? "#0F172A" : "#CBD5E1",
                  fontSize: "0.72rem",
                  fontWeight: active ? 900 : 600,
                  cursor: "pointer",
                }}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Interactive Classroom Tools: Hardware Lab (H), Laser Pointer (L), Image Zoom (Z), Speaker Notes (N) */}
        <button
          type="button"
          onClick={() => setShowHardwareLab(true)}
          title="Open Virtual Breadboard & Circuit Simulator (Key: H)"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.35rem",
            padding: "0.42rem 0.8rem",
            borderRadius: "999px",
            border: "1px solid #10B981",
            background: "rgba(16, 185, 129, 0.2)",
            color: "#6EE7B7",
            fontSize: "0.76rem",
            fontWeight: 800,
            cursor: "pointer",
          }}
        >
          <Cpu size={14} color="#10B981" />
          <span>Lab Sim (H)</span>
        </button>

        <button
          type="button"
          onClick={() => setLaserActive((prev) => !prev)}
          title="Toggle Glowing Laser Pointer (Key: L)"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.35rem",
            padding: "0.42rem 0.8rem",
            borderRadius: "999px",
            border: `1px solid ${
              laserActive ? "#F43F5E" : "rgba(255,255,255,0.18)"
            }`,
            background: laserActive
              ? "rgba(244, 63, 94, 0.25)"
              : "rgba(255,255,255,0.08)",
            color: laserActive ? "#FDA4AF" : "#FFFFFF",
            fontSize: "0.76rem",
            fontWeight: 800,
            cursor: "pointer",
          }}
        >
          <Crosshair size={14} color={laserActive ? "#F43F5E" : "#00F5D4"} />
          <span>Laser (L)</span>
        </button>

        <button
          type="button"
          onClick={toggleZoomCurrentSlide}
          title="Zoom Current Slide Image Fullscreen (Key: Z)"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.35rem",
            padding: "0.42rem 0.8rem",
            borderRadius: "999px",
            border: "1px solid rgba(255,255,255,0.18)",
            background: zoomedMedia
              ? "rgba(0, 245, 212, 0.22)"
              : "rgba(255,255,255,0.08)",
            color: "#FFFFFF",
            fontSize: "0.76rem",
            fontWeight: 800,
            cursor: "pointer",
          }}
        >
          <ZoomIn size={14} color="#00F5D4" />
          <span>Zoom (Z)</span>
        </button>

        <button
          type="button"
          onClick={() => setShowSpeakerNotes((prev) => !prev)}
          title="Toggle Speaker Notes (Key: N)"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.35rem",
            padding: "0.42rem 0.8rem",
            borderRadius: "999px",
            border: "1px solid rgba(255,255,255,0.18)",
            background: showSpeakerNotes
              ? "rgba(0, 245, 212, 0.22)"
              : "rgba(255,255,255,0.08)",
            color: "#FFFFFF",
            fontSize: "0.76rem",
            fontWeight: 800,
            cursor: "pointer",
          }}
        >
          <BookOpen size={14} color="#38BDF8" />
          <span>Notes (N)</span>
        </button>
      </footer>

      {/* Glowing Laser Pointer Dot Overlay */}
      {laserActive && (
        <div
          style={{
            position: "fixed",
            left: laserPos.x,
            top: laserPos.y,
            transform: "translate(-50%, -50%)",
            width: "22px",
            height: "22px",
            borderRadius: "999px",
            background: "radial-gradient(circle, #FFFFFF 15%, #F43F5E 65%)",
            boxShadow:
              "0 0 18px 6px rgba(244, 63, 94, 0.85), 0 0 40px 12px rgba(0, 245, 212, 0.45)",
            pointerEvents: "none",
            zIndex: 1000005,
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
            zIndex: 1000004,
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
