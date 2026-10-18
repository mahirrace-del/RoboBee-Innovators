"use client";

import React, { useState, useRef } from "react";
import {
  EditableSlide,
  EditableSlideCard,
  EditableHotspotPin,
} from "@/lib/slideStudioStore";
import {
  THEME_PALETTE_CONFIG,
  PresentationMediaFrame,
  SlideColorTheme,
} from "@/components/curriculum/Class1WorkshopDeck";
import {
  Sparkles,
  Plus,
  RotateCcw,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Layers,
  Images,
  Move,
} from "lucide-react";

interface EditableSlideCanvasProps {
  slide: EditableSlide;
  themeOverride?: SlideColorTheme | "auto";
  onNextSlide?: () => void;
  onZoomImage?: (src: string, caption: string) => void;
  // Editor mode hooks (when rendered inside SlideStudioEditor)
  isEditorMode?: boolean;
  onUpdateSlide?: (updated: EditableSlide) => void;
  selectedElementId?: string | null;
  onSelectElement?: (id: string | null) => void;
}

const FONT_FAMILY_MAP: Record<EditableSlide["fontFamily"], string> = {
  sans: "var(--font-sans, 'Inter', system-ui, sans-serif)",
  display: "'Space Grotesk', 'Inter', system-ui, sans-serif",
  mono: "var(--font-mono, 'JetBrains Mono', monospace)",
  serif: "'Georgia', 'Playfair Display', serif",
};

const TITLE_SIZE_MAP: Record<EditableSlide["titleSize"], string> = {
  compact: "clamp(1.45rem, 2.2vw, 2rem)",
  standard: "clamp(1.75rem, 2.8vw, 2.55rem)",
  large: "clamp(2.1rem, 3.4vw, 3.1rem)",
  hero: "clamp(2.25rem, 3.8vw, 3.45rem)",
};

export function EditableSlideCanvas({
  slide,
  themeOverride = "auto",
  onNextSlide,
  onZoomImage,
  isEditorMode = false,
  onUpdateSlide,
  selectedElementId,
  onSelectElement,
}: EditableSlideCanvasProps) {
  const effectiveThemeKey: SlideColorTheme =
    themeOverride === "auto" ? slide.theme : themeOverride;
  const palette = THEME_PALETTE_CONFIG[effectiveThemeKey];

  // Interactive classroom states per slide
  const [pollVotes, setPollVotes] = useState<Record<string, number>>({});
  const [flippedQuizCards, setFlippedQuizCards] = useState<Record<string, boolean>>({});
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});
  const [activeTimelineIdx, setActiveTimelineIdx] = useState<number>(0);
  const [activeHotspotIdx, setActiveHotspotIdx] = useState<number>(0);
  const [activePhotoIdx, setActivePhotoIdx] = useState<number>(0);

  // Hotspot drag support in Editor Mode
  const hotspotContainerRef = useRef<HTMLDivElement | null>(null);
  const [draggingHotspotId, setDraggingHotspotId] = useState<string | null>(null);

  // Combine primary heroImage + any extra galleryImages for multi-photo switching
  const allSlidePhotos = [
    {
      id: "hero-primary",
      url: slide.heroImage,
      caption: slide.imageCaption,
      fallbackVariant: slide.fallbackVariant,
    },
    ...(slide.galleryImages || []),
  ];
  const currentPhoto = allSlidePhotos[activePhotoIdx] || allSlidePhotos[0];

  const handleHotspotPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isEditorMode || !draggingHotspotId || !hotspotContainerRef.current || !onUpdateSlide) {
      return;
    }
    const rect = hotspotContainerRef.current.getBoundingClientRect();
    const xPct = Math.max(6, Math.min(94, Math.round(((e.clientX - rect.left) / rect.width) * 100)));
    const yPct = Math.max(8, Math.min(92, Math.round(((e.clientY - rect.top) / rect.height) * 100)));

    const nextHotspots = slide.hotspots.map((h) =>
      h.id === draggingHotspotId ? { ...h, xPercent: xPct, yPercent: yPct } : h
    );
    onUpdateSlide({ ...slide, hotspots: nextHotspots });
  };

  const handleHotspotPointerUp = () => {
    if (draggingHotspotId) {
      setDraggingHotspotId(null);
    }
  };

  // Animation keyframe class inline style
  const animationStyle: React.CSSProperties =
    slide.animation === "zoom-in"
      ? { transition: "all 0.35s cubic-bezier(0.16, 1, 0.3, 1)" }
      : slide.animation === "slide-right"
      ? { transition: "all 0.35s ease-out" }
      : { transition: "all 0.3s ease" };

  // Helper to render Multi-Photo Switcher + PresentationMediaFrame
  const renderMediaColumn = (height = "350px") => (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <PresentationMediaFrame
        src={currentPhoto.url}
        alt={slide.title}
        caption={currentPhoto.caption || slide.imageCaption}
        fallbackVariant={currentPhoto.fallbackVariant || slide.fallbackVariant}
        accentColor={palette.accentPrimary}
        height={height}
        onZoom={onZoomImage}
      />

      {/* If multiple photos exist on this slide, show thumbnail switcher bar */}
      {allSlidePhotos.length > 1 && (
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            alignItems: "center",
            overflowX: "auto",
            padding: "0.35rem 0.5rem",
            background: palette.isLight ? "rgba(15, 23, 42, 0.06)" : "rgba(15, 23, 42, 0.55)",
            borderRadius: "12px",
            border: `1px solid ${palette.cardBorder}`,
          }}
        >
          <span
            style={{
              fontSize: "0.7rem",
              fontWeight: 900,
              color: palette.accentPrimary,
              display: "inline-flex",
              alignItems: "center",
              gap: "0.3rem",
              paddingRight: "0.35rem",
              whiteSpace: "nowrap",
            }}
          >
            <Images size={13} /> {allSlidePhotos.length} Photos:
          </span>
          {allSlidePhotos.map((p, pIdx) => {
            const isSelected = pIdx === activePhotoIdx;
            return (
              <button
                key={p.id || pIdx}
                type="button"
                onClick={() => setActivePhotoIdx(pIdx)}
                style={{
                  background: isSelected ? palette.accentPrimary : "transparent",
                  color: isSelected ? (palette.isLight ? "#FFFFFF" : "#090D16") : palette.headingColor,
                  border: `1px solid ${isSelected ? palette.accentPrimary : palette.cardBorder}`,
                  borderRadius: "8px",
                  padding: "0.28rem 0.65rem",
                  fontSize: "0.73rem",
                  fontWeight: 800,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                Photo #{pIdx + 1}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );

  // Helper to render a single Bento / Poll / Flip-Quiz Card
  const renderCard = (card: EditableSlideCard, idx: number) => {
    const accent = card.accentColor || palette.accentPrimary;
    const isSelectedInEditor = isEditorMode && selectedElementId === card.id;

    // 1. Interactive Flip-Quiz Card (Machine vs Robot, Safe vs Short Circuit)
    if (card.isQuizCard) {
      const isFlipped = !!flippedQuizCards[card.id];
      const verdictColor = card.quizIsPositive ? "#10B981" : "#F43F5E";
      return (
        <div
          key={card.id}
          onClick={() => {
            if (isEditorMode && onSelectElement) onSelectElement(card.id);
            setFlippedQuizCards((prev) => ({ ...prev, [card.id]: !prev[card.id] }));
          }}
          style={{
            background: isFlipped
              ? card.quizIsPositive
                ? "rgba(16, 185, 129, 0.16)"
                : "rgba(244, 63, 94, 0.16)"
              : palette.cardBg,
            border: `2px solid ${
              isSelectedInEditor
                ? "#FBBF24"
                : isFlipped
                ? verdictColor
                : palette.cardBorder
            }`,
            boxShadow: palette.cardShadow,
            borderRadius: "18px",
            padding: "1.15rem 1.3rem",
            cursor: "pointer",
            transition: "all 0.25s ease",
            backdropFilter: "blur(16px)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.5rem", marginBottom: "0.4rem" }}>
            <span
              style={{
                fontSize: "0.7rem",
                fontWeight: 900,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: isFlipped ? verdictColor : accent,
              }}
            >
              {card.badge || `CHALLENGE 0${idx + 1}`}
            </span>
            <span
              style={{
                fontSize: "0.72rem",
                fontWeight: 800,
                padding: "0.2rem 0.6rem",
                borderRadius: "999px",
                background: isFlipped ? verdictColor : palette.badgeBg,
                color: isFlipped ? "#FFFFFF" : palette.badgeText,
              }}
            >
              {isFlipped ? "Click to Reset" : "Click to Flip Verdict ➔"}
            </span>
          </div>

          <h3
            style={{
              margin: "0 0 0.35rem 0",
              fontSize: "1.12rem",
              fontWeight: 900,
              color: palette.headingColor,
            }}
          >
            {card.title}
          </h3>
          <p style={{ margin: 0, fontSize: "0.88rem", color: palette.bodyColor, lineHeight: 1.5 }}>
            {card.body}
          </p>

          {isFlipped && (
            <div
              style={{
                marginTop: "0.75rem",
                paddingTop: "0.65rem",
                borderTop: `1px solid ${verdictColor}`,
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                color: verdictColor,
                fontWeight: 900,
                fontSize: "0.88rem",
              }}
            >
              {card.quizIsPositive ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
              <span>{card.quizVerdict}</span>
            </div>
          )}
        </div>
      );
    }

    // 2. Interactive Live Classroom Poll Card (+1 Vote Counter)
    if (card.isPollCard) {
      const votes = pollVotes[card.id] ?? card.pollInitialVotes ?? 0;
      return (
        <div
          key={card.id}
          onClick={() => {
            if (isEditorMode && onSelectElement) onSelectElement(card.id);
          }}
          style={{
            background: palette.cardBg,
            border: `2px solid ${isSelectedInEditor ? "#FBBF24" : votes > 0 ? accent : palette.cardBorder}`,
            boxShadow: palette.cardShadow,
            borderRadius: "18px",
            padding: "1.2rem 1.35rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            gap: "0.85rem",
            backdropFilter: "blur(16px)",
          }}
        >
          <div>
            {card.badge && (
              <div
                style={{
                  fontSize: "0.72rem",
                  fontWeight: 900,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: accent,
                  marginBottom: "0.35rem",
                }}
              >
                {card.badge}
              </div>
            )}
            <h3 style={{ margin: "0 0 0.4rem 0", fontSize: "1.15rem", fontWeight: 900, color: palette.headingColor }}>
              {card.title}
            </h3>
            <p style={{ margin: 0, fontSize: "0.88rem", color: palette.bodyColor, lineHeight: 1.55 }}>
              {card.body}
            </p>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.75rem", paddingTop: "0.5rem", borderTop: `1px solid ${palette.cardBorder}` }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: "0.4rem" }}>
              <span style={{ fontSize: "1.65rem", fontWeight: 900, color: accent }}>{votes}</span>
              <span style={{ fontSize: "0.78rem", fontWeight: 800, color: palette.mutedColor }}>Students</span>
            </div>

            <div style={{ display: "flex", gap: "0.4rem" }}>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setPollVotes((prev) => ({ ...prev, [card.id]: (prev[card.id] ?? 0) + 1 }));
                }}
                style={{
                  background: accent,
                  color: "#090D16",
                  border: "none",
                  borderRadius: "10px",
                  padding: "0.45rem 0.85rem",
                  fontSize: "0.82rem",
                  fontWeight: 900,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.3rem",
                }}
              >
                <Plus size={14} /> +1 Vote
              </button>
              {votes > 0 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPollVotes((prev) => ({ ...prev, [card.id]: 0 }));
                  }}
                  style={{
                    background: "rgba(255,255,255,0.1)",
                    color: palette.headingColor,
                    border: `1px solid ${palette.cardBorder}`,
                    borderRadius: "10px",
                    padding: "0.45rem 0.6rem",
                    cursor: "pointer",
                  }}
                  title="Reset Votes"
                >
                  <RotateCcw size={13} />
                </button>
              )}
            </div>
          </div>
        </div>
      );
    }

    // 3. Standard Expandable Bento Card
    const isExpanded = !!expandedCards[card.id];
    return (
      <div
        key={card.id}
        onClick={() => {
          if (isEditorMode && onSelectElement) onSelectElement(card.id);
          if (card.detail) {
            setExpandedCards((prev) => ({ ...prev, [card.id]: !prev[card.id] }));
          }
        }}
        style={{
          background: palette.cardBg,
          border: `2px solid ${isSelectedInEditor ? "#FBBF24" : palette.cardBorder}`,
          borderLeft: `5px solid ${accent}`,
          boxShadow: palette.cardShadow,
          borderRadius: "18px",
          padding: "1.15rem 1.35rem",
          cursor: card.detail || isEditorMode ? "pointer" : "default",
          transition: "all 0.2s ease",
          backdropFilter: "blur(16px)",
        }}
      >
        {card.badge && (
          <div
            style={{
              fontSize: "0.72rem",
              fontWeight: 900,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: accent,
              marginBottom: "0.35rem",
            }}
          >
            {card.badge}
          </div>
        )}
        <h3
          style={{
            margin: "0 0 0.4rem 0",
            fontSize: "1.12rem",
            fontWeight: 900,
            color: palette.headingColor,
            lineHeight: 1.3,
          }}
        >
          {card.title}
        </h3>
        <p
          style={{
            margin: 0,
            fontSize: "0.9rem",
            color: palette.bodyColor,
            lineHeight: 1.55,
          }}
        >
          {card.body}
        </p>
        {card.detail && (
          <div
            style={{
              marginTop: "0.65rem",
              paddingTop: "0.55rem",
              borderTop: `1px dashed ${palette.cardBorder}`,
              fontSize: "0.82rem",
              fontWeight: 700,
              color: accent,
            }}
          >
            💡 {card.detail}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      style={{
        width: "100%",
        fontFamily: FONT_FAMILY_MAP[slide.fontFamily || "sans"],
        color: palette.headingColor,
        ...animationStyle,
      }}
    >
      {/* SLIDE HEADER AREA */}
      <div
        style={{
          textAlign: slide.textAlign || "left",
          marginBottom: "1.5rem",
          display: "flex",
          flexDirection: "column",
          alignItems: slide.textAlign === "center" ? "center" : "flex-start",
          gap: "0.55rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              background: palette.badgeBg,
              color: palette.badgeText,
              border: `1px solid ${palette.cardBorder}`,
              padding: "0.32rem 0.9rem",
              borderRadius: "999px",
              fontSize: "0.76rem",
              fontWeight: 900,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            <Sparkles size={13} />
            {slide.badge || `SLIDE ${slide.numberLabel}`}
          </span>
        </div>

        <h1
          style={{
            margin: 0,
            fontSize: TITLE_SIZE_MAP[slide.titleSize || "standard"],
            fontWeight: 900,
            color: palette.headingColor,
            lineHeight: 1.12,
            letterSpacing: "-0.02em",
            maxWidth: "1050px",
          }}
        >
          {slide.title}
        </h1>

        {slide.subtitle && (
          <p
            style={{
              margin: 0,
              fontSize: "clamp(0.98rem, 1.35vw, 1.18rem)",
              color: palette.bodyColor,
              lineHeight: 1.5,
              maxWidth: "920px",
              fontWeight: 500,
            }}
          >
            {slide.subtitle}
          </p>
        )}
      </div>

      {/* ===================================================================== */}
      {/* LAYOUT 1: HERO-TITLE */}
      {/* ===================================================================== */}
      {slide.layout === "hero-title" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.35rem" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
              gap: "1.5rem",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {slide.cards.map((card, i) => renderCard(card, i))}

              {slide.ctaText && onNextSlide && (
                <div>
                  <button
                    type="button"
                    onClick={onNextSlide}
                    style={{
                      background: `linear-gradient(135deg, ${palette.accentPrimary}, ${palette.accentSecondary})`,
                      color: "#090D16",
                      border: "none",
                      borderRadius: "14px",
                      padding: "0.95rem 1.75rem",
                      fontSize: "1.02rem",
                      fontWeight: 900,
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.6rem",
                      boxShadow: "0 14px 32px rgba(0, 245, 212, 0.3)",
                    }}
                  >
                    <span>{slide.ctaText}</span>
                    <ArrowRight size={19} />
                  </button>
                </div>
              )}
            </div>

            {renderMediaColumn("370px")}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* LAYOUT 2: SPLIT-MEDIA */}
      {/* ===================================================================== */}
      {slide.layout === "split-media" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
            gap: "1.6rem",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "0.95rem" }}>
            {slide.cards.map((card, i) => renderCard(card, i))}
          </div>

          {renderMediaColumn("390px")}
        </div>
      )}

      {/* ===================================================================== */}
      {/* LAYOUT 3: INTERACTIVE-GRID */}
      {/* ===================================================================== */}
      {slide.layout === "interactive-grid" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.35rem" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "1.1rem",
            }}
          >
            {slide.cards.map((card, i) => renderCard(card, i))}
          </div>

          {/* Optional visual strip if galleryImages exist or user wants image preview */}
          {slide.galleryImages && slide.galleryImages.length > 0 && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: "1rem",
              }}
            >
              {allSlidePhotos.map((photo, idx) => (
                <PresentationMediaFrame
                  key={photo.id || idx}
                  src={photo.url}
                  alt={photo.caption || slide.title}
                  caption={photo.caption || slide.imageCaption}
                  fallbackVariant={photo.fallbackVariant || slide.fallbackVariant}
                  accentColor={palette.accentPrimary}
                  height="210px"
                  onZoom={onZoomImage}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ===================================================================== */}
      {/* LAYOUT 4: TIMELINE-STEPPER */}
      {/* ===================================================================== */}
      {slide.layout === "timeline-stepper" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.3rem" }}>
          {/* Horizontal Stepper Pills */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${Math.max(1, slide.cards.length)}, minmax(150px, 1fr))`,
              gap: "0.75rem",
              overflowX: "auto",
            }}
          >
            {slide.cards.map((stepCard, idx) => {
              const isCurrent = idx === activeTimelineIdx;
              const accent = stepCard.accentColor || palette.accentPrimary;
              return (
                <button
                  key={stepCard.id}
                  type="button"
                  onClick={() => {
                    setActiveTimelineIdx(idx);
                    if (isEditorMode && onSelectElement) onSelectElement(stepCard.id);
                  }}
                  style={{
                    background: isCurrent ? accent : palette.cardBg,
                    color: isCurrent ? "#090D16" : palette.headingColor,
                    border: `2px solid ${isCurrent ? accent : palette.cardBorder}`,
                    borderRadius: "14px",
                    padding: "0.75rem 1rem",
                    textAlign: "left",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.7rem",
                      fontWeight: 900,
                      textTransform: "uppercase",
                      letterSpacing: "0.07em",
                      opacity: isCurrent ? 0.9 : 0.75,
                    }}
                  >
                    {stepCard.badge || `STEP 0${idx + 1}`}
                  </div>
                  <div
                    style={{
                      fontSize: "0.92rem",
                      fontWeight: 900,
                      marginTop: "0.2rem",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {stepCard.title}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Timeline Detail + Media */}
          {slide.cards[activeTimelineIdx] && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                gap: "1.5rem",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  background: palette.cardBg,
                  border: `2px solid ${slide.cards[activeTimelineIdx].accentColor || palette.accentPrimary}`,
                  boxShadow: palette.cardShadow,
                  borderRadius: "22px",
                  padding: "1.65rem",
                  backdropFilter: "blur(16px)",
                }}
              >
                <div
                  style={{
                    fontSize: "0.78rem",
                    fontWeight: 900,
                    color: slide.cards[activeTimelineIdx].accentColor || palette.accentPrimary,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    marginBottom: "0.45rem",
                  }}
                >
                  {slide.cards[activeTimelineIdx].badge}
                </div>
                <h2
                  style={{
                    margin: "0 0 0.45rem 0",
                    fontSize: "1.55rem",
                    fontWeight: 900,
                    color: palette.headingColor,
                  }}
                >
                  {slide.cards[activeTimelineIdx].title}
                </h2>
                {slide.cards[activeTimelineIdx].subtitle && (
                  <div
                    style={{
                      fontSize: "0.95rem",
                      fontWeight: 700,
                      color: palette.accentSecondary,
                      marginBottom: "0.75rem",
                    }}
                  >
                    {slide.cards[activeTimelineIdx].subtitle}
                  </div>
                )}
                <p
                  style={{
                    margin: 0,
                    fontSize: "1.02rem",
                    color: palette.bodyColor,
                    lineHeight: 1.65,
                  }}
                >
                  {slide.cards[activeTimelineIdx].body}
                </p>
              </div>

              {renderMediaColumn("320px")}
            </div>
          )}
        </div>
      )}

      {/* ===================================================================== */}
      {/* LAYOUT 5: INTERACTIVE-HOTSPOT */}
      {/* ===================================================================== */}
      {slide.layout === "interactive-hotspot" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
            gap: "1.5rem",
            alignItems: "center",
          }}
        >
          {/* Left: Interactive Image / Diagram with Numbered Hotspot Pins */}
          <div
            ref={hotspotContainerRef}
            onPointerMove={handleHotspotPointerMove}
            onPointerUp={handleHotspotPointerUp}
            style={{ position: "relative", userSelect: "none" }}
          >
            <PresentationMediaFrame
              src={currentPhoto.url}
              alt={slide.title}
              caption={
                isEditorMode
                  ? "TIP: Drag any numbered pin (1–5) on the image to reposition it!"
                  : currentPhoto.caption || slide.imageCaption
              }
              fallbackVariant={currentPhoto.fallbackVariant || slide.fallbackVariant}
              accentColor={palette.accentPrimary}
              height="380px"
              onZoom={onZoomImage}
            />

            {slide.hotspots.map((pin: EditableHotspotPin, idx: number) => {
              const isSelected = idx === activeHotspotIdx;
              return (
                <button
                  key={pin.id}
                  type="button"
                  onPointerDown={(e) => {
                    e.stopPropagation();
                    setActiveHotspotIdx(idx);
                    if (isEditorMode) {
                      setDraggingHotspotId(pin.id);
                      if (onSelectElement) onSelectElement(pin.id);
                    }
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveHotspotIdx(idx);
                  }}
                  style={{
                    position: "absolute",
                    left: `${pin.xPercent}%`,
                    top: `${pin.yPercent}%`,
                    transform: "translate(-50%, -50%)",
                    width: isSelected ? "44px" : "36px",
                    height: isSelected ? "44px" : "36px",
                    borderRadius: "50%",
                    background: isSelected ? pin.color : "#090D16",
                    color: isSelected ? "#090D16" : "#FFFFFF",
                    border: `3px solid ${pin.color}`,
                    boxShadow: isSelected
                      ? `0 0 0 8px ${pin.color}44, 0 8px 20px rgba(0,0,0,0.6)`
                      : "0 4px 14px rgba(0,0,0,0.65)",
                    fontWeight: 900,
                    fontSize: "0.95rem",
                    cursor: isEditorMode ? "grab" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: isSelected ? 30 : 20,
                    transition: draggingHotspotId === pin.id ? "none" : "all 0.2s ease",
                  }}
                  title={pin.title}
                >
                  {pin.number}
                </button>
              );
            })}
          </div>

          {/* Right: Active Hotspot Inspector Card + Selector Strip */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {slide.hotspots.map((pin, idx) => {
                const isSelected = idx === activeHotspotIdx;
                return (
                  <button
                    key={pin.id}
                    type="button"
                    onClick={() => {
                      setActiveHotspotIdx(idx);
                      if (isEditorMode && onSelectElement) onSelectElement(pin.id);
                    }}
                    style={{
                      background: isSelected ? pin.color : palette.cardBg,
                      color: isSelected ? "#090D16" : palette.headingColor,
                      border: `1.5px solid ${isSelected ? pin.color : palette.cardBorder}`,
                      borderRadius: "10px",
                      padding: "0.45rem 0.85rem",
                      fontSize: "0.8rem",
                      fontWeight: 900,
                      cursor: "pointer",
                    }}
                  >
                    Pin #{pin.number}: {pin.title.split(" (")[0]}
                  </button>
                );
              })}
            </div>

            {slide.hotspots[activeHotspotIdx] && (
              <div
                style={{
                  background: palette.cardBg,
                  border: `2px solid ${slide.hotspots[activeHotspotIdx].color}`,
                  boxShadow: palette.cardShadow,
                  borderRadius: "22px",
                  padding: "1.6rem",
                  backdropFilter: "blur(16px)",
                }}
              >
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    fontSize: "0.75rem",
                    fontWeight: 900,
                    color: slide.hotspots[activeHotspotIdx].color,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    marginBottom: "0.5rem",
                  }}
                >
                  {isEditorMode && <Move size={13} />}
                  {slide.hotspots[activeHotspotIdx].badge}
                </div>
                <h2
                  style={{
                    margin: "0 0 0.6rem 0",
                    fontSize: "1.5rem",
                    fontWeight: 900,
                    color: palette.headingColor,
                  }}
                >
                  {slide.hotspots[activeHotspotIdx].number}. {slide.hotspots[activeHotspotIdx].title}
                </h2>
                <p
                  style={{
                    margin: 0,
                    fontSize: "1rem",
                    color: palette.bodyColor,
                    lineHeight: 1.65,
                  }}
                >
                  {slide.hotspots[activeHotspotIdx].description}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* LAYOUT 6: PHOTO-GALLERY (MULTI-PHOTO SHOWCASE) */}
      {/* ===================================================================== */}
      {slide.layout === "photo-gallery" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))",
              gap: "1.15rem",
            }}
          >
            {allSlidePhotos.map((photo, idx) => (
              <PresentationMediaFrame
                key={photo.id || idx}
                src={photo.url}
                alt={photo.caption || slide.title}
                caption={photo.caption || `Gallery Photo #${idx + 1}`}
                fallbackVariant={photo.fallbackVariant || slide.fallbackVariant}
                accentColor={palette.accentPrimary}
                height="260px"
                onZoom={onZoomImage}
              />
            ))}
          </div>

          {slide.cards.length > 0 && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: "1rem",
              }}
            >
              {slide.cards.map((card, i) => renderCard(card, i))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
