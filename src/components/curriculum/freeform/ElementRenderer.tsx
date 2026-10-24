"use client";

import React, { useState, useRef, useEffect } from "react";
import { SlideElement } from "@/lib/slideStudioStore";
import {
  Copy,
  Check,
  Code2,
  ZoomIn,
  Play,
  ArrowRight,
  ArrowLeft,
  Pin,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  Plus,
  HelpCircle,
  Trophy,
  Zap,
  Award,
} from "lucide-react";
import {
  playPop,
  playChime,
  playClick,
  launchConfetti,
} from "../presentationEffects";

interface ElementRendererProps {
  element: SlideElement;
  palette?: any;
  isEditorMode?: boolean;
  isSelected?: boolean;
  isEditing?: boolean;
  onStartEditing?: () => void;
  onFinishEditing?: () => void;
  onUpdateElement?: (patch: Partial<SlideElement>) => void;
  onZoomImage?: (src: string, caption: string) => void;
  stepRevealVisible?: boolean;
  soundEnabled?: boolean;
}

export function ElementRenderer({
  element,
  palette,
  isEditorMode = false,
  isSelected = false,
  isEditing = false,
  onStartEditing,
  onFinishEditing,
  onUpdateElement,
  onZoomImage,
  stepRevealVisible = true,
  soundEnabled = true,
}: ElementRendererProps) {
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const textEditRef = useRef<HTMLTextAreaElement | null>(null);

  // Interactive Quiz Card State (Flip front/back)
  const [quizFlipped, setQuizFlipped] = useState<boolean>(false);

  // Interactive Classroom Poll State (+1 tally)
  const [pollVotes, setPollVotes] = useState<number>(element.pollInitialVotes ?? 0);
  const [hasVoted, setHasVoted] = useState<boolean>(false);

  // Active Hotspot Pin inspection state
  const [activeHotspotId, setActiveHotspotId] = useState<string | null>(null);

  // Active Pinout Card state
  const [selectedPinIdx, setSelectedPinIdx] = useState<number | null>(null);

  useEffect(() => {
    if (isEditing && textEditRef.current) {
      textEditRef.current.focus();
      textEditRef.current.select();
    }
  }, [isEditing]);

  if (!stepRevealVisible) {
    return null;
  }

  const { style, type, content } = element;

  const fontFam =
    style.fontFamily === "display"
      ? "'Space Grotesk', system-ui, sans-serif"
      : style.fontFamily === "mono"
      ? "var(--font-mono, 'JetBrains Mono', monospace)"
      : style.fontFamily === "serif"
      ? "'Georgia', 'Playfair Display', serif"
      : "var(--font-sans, 'Inter', system-ui, sans-serif)";

  const isLight = Boolean(palette?.isLight);
  const textColor = style.color || (palette ? palette.headingColor : isLight ? "#0F172A" : "#FFFFFF");
  const bodyTextColor = palette ? palette.bodyColor : isLight ? "#1E293B" : "#F1F5F9";
  const mutedTextColor = palette ? palette.mutedColor : isLight ? "#475569" : "#94A3B8";
  const cardBackground = style.backgroundColor || (palette ? palette.cardBg : isLight ? "#FFFFFF" : "#141A29");
  const cardBorderColor = style.borderColor || (palette ? palette.cardBorder : isLight ? "#E2E8F0" : "rgba(255, 255, 255, 0.18)");

  // Common wrapper style for inner content
  const baseInnerStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    fontFamily: fontFam,
    fontSize: style.fontSize ? `${style.fontSize}px` : undefined,
    fontWeight: style.fontWeight || "normal",
    fontStyle: style.fontStyle || "normal",
    textDecoration: style.textDecoration || "none",
    textAlign: style.textAlign || "left",
    color: style.color || textColor,
    backgroundColor: style.backgroundColor || "transparent",
    borderColor: style.borderColor || "transparent",
    borderWidth: style.borderWidth ? `${style.borderWidth}px` : undefined,
    borderStyle: style.borderStyle || (style.borderWidth ? "solid" : "none"),
    borderRadius: style.borderRadius ? `${style.borderRadius}px` : undefined,
    opacity: style.opacity ?? 1,
    padding: typeof style.padding === "number" ? `${style.padding}px` : style.padding || 0,
    boxShadow: style.boxShadow || "none",
    lineHeight: style.lineHeight || 1.35,
    letterSpacing: style.letterSpacing ? `${style.letterSpacing}px` : undefined,
    backdropFilter: style.backdropFilter || undefined,
    boxSizing: "border-box",
    overflow: "hidden",
    position: "relative",
    userSelect: isEditorMode && !isEditing ? "none" : "auto",
  };

  // 1. HEADING ELEMENT
  if (type === "heading") {
    if (isEditing && isEditorMode) {
      return (
        <textarea
          ref={textEditRef}
          value={content}
          onChange={(e) => onUpdateElement?.({ content: e.target.value })}
          onBlur={onFinishEditing}
          onClick={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
          onKeyDown={(e) => {
            if (e.key === "Escape") onFinishEditing?.();
          }}
          style={{
            ...baseInnerStyle,
            outline: "2px solid #F5B800",
            resize: "none",
            background: "rgba(15, 23, 42, 0.95)",
          }}
        />
      );
    }
    return (
      <div
        onDoubleClick={onStartEditing}
        style={{
          ...baseInnerStyle,
          display: "flex",
          alignItems: "center",
          fontWeight: style.fontWeight || 900,
          fontSize: style.fontSize ? `${style.fontSize}px` : "34px",
          wordBreak: "break-word",
          letterSpacing: "-0.02em",
        }}
      >
        {content || "Double click to edit heading..."}
      </div>
    );
  }

  // 2. SUBHEADING ELEMENT
  if (type === "subheading") {
    if (isEditing && isEditorMode) {
      return (
        <textarea
          ref={textEditRef}
          value={content}
          onChange={(e) => onUpdateElement?.({ content: e.target.value })}
          onBlur={onFinishEditing}
          onClick={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
          onKeyDown={(e) => {
            if (e.key === "Escape") onFinishEditing?.();
          }}
          style={{
            ...baseInnerStyle,
            outline: "2px solid #F5B800",
            resize: "none",
            background: "rgba(15, 23, 42, 0.95)",
          }}
        />
      );
    }
    return (
      <div
        onDoubleClick={onStartEditing}
        style={{
          ...baseInnerStyle,
          display: "flex",
          alignItems: "center",
          fontWeight: style.fontWeight || 500,
          fontSize: style.fontSize ? `${style.fontSize}px` : "17px",
          color: style.color || "#94A3B8",
          wordBreak: "break-word",
          lineHeight: 1.45,
        }}
      >
        {content || "Double click to edit subheading..."}
      </div>
    );
  }

  // 3. TEXT BOX ELEMENT
  if (type === "textbox") {
    if (isEditing && isEditorMode) {
      return (
        <textarea
          ref={textEditRef}
          value={content}
          onChange={(e) => onUpdateElement?.({ content: e.target.value })}
          onBlur={onFinishEditing}
          onClick={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
          onKeyDown={(e) => {
            if (e.key === "Escape") onFinishEditing?.();
          }}
          style={{
            ...baseInnerStyle,
            outline: "2px solid #F5B800",
            resize: "none",
            background: "rgba(15, 23, 42, 0.95)",
          }}
        />
      );
    }
    return (
      <div
        onDoubleClick={onStartEditing}
        style={{
          ...baseInnerStyle,
          fontSize: style.fontSize ? `${style.fontSize}px` : "15px",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          lineHeight: 1.6,
        }}
      >
        {content || "Double click to enter body text or bullet points..."}
      </div>
    );
  }

  // 4. IMAGE ELEMENT (WITH PULSING HOTSPOT PINS OVERLAY)
  if (type === "image") {
    const pins = element.hotspotPins || [];
    const activePin = pins.find((p) => p.id === activeHotspotId);

    return (
      <div
        style={{
          ...baseInnerStyle,
          display: "flex",
          flexDirection: "column",
          cursor: !isEditorMode && !pins.length ? "zoom-in" : "default",
          position: "relative",
          overflow: "hidden",
        }}
        onClick={() => {
          if (!isEditorMode && onZoomImage && content && !pins.length) {
            onZoomImage(content, element.caption || "Image Preview");
          }
        }}
      >
        <div style={{ position: "relative", width: "100%", height: element.caption ? "calc(100% - 32px)" : "100%" }}>
          <img
            src={content || "/illustrations/class1-external-blink-wiring.svg"}
            alt={element.caption || "Slide Visual"}
            draggable={false}
            style={{
              width: "100%",
              height: "100%",
              objectFit: style.objectFit || "cover",
              display: "block",
              pointerEvents: isEditorMode ? "none" : "auto",
              userSelect: "none",
            }}
            loading="lazy"
          />

          {/* Interactive Hotspot Pins Overlay on Image */}
          {!isEditorMode && pins.length > 0 && (
            <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
              {pins.map((pin) => {
                const isActive = activeHotspotId === pin.id;
                const pinColor = pin.color || "#F5B800";
                return (
                  <button
                    key={pin.id}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      playPop(soundEnabled);
                      setActiveHotspotId((prev) => (prev === pin.id ? null : pin.id));
                    }}
                    style={{
                      position: "absolute",
                      left: `${pin.xPercent}%`,
                      top: `${pin.yPercent}%`,
                      transform: "translate(-50%, -50%)",
                      width: "36px",
                      height: "36px",
                      borderRadius: "50%",
                      background: isActive ? pinColor : "rgba(15, 23, 42, 0.9)",
                      border: `2px solid ${pinColor}`,
                      color: isActive ? "#0F172A" : "#FFFFFF",
                      boxShadow: isActive
                        ? `0 0 25px 8px ${pinColor}88`
                        : `0 0 16px 2px ${pinColor}55`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "13px",
                      fontWeight: 900,
                      cursor: "pointer",
                      pointerEvents: "auto",
                      transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
                      zIndex: isActive ? 20 : 10,
                    }}
                    title={`${pin.number}. ${pin.title}`}
                  >
                    {pin.number}
                  </button>
                );
              })}

              {/* Active Hotspot Detail Card Popup */}
              {activePin && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    position: "absolute",
                    bottom: "12px",
                    left: "12px",
                    right: "12px",
                    background: isLight ? "rgba(255, 255, 255, 0.96)" : "rgba(15, 23, 42, 0.95)",
                    backdropFilter: "blur(16px)",
                    border: `2px solid ${activePin.color || (palette?.accentPrimary || "#F5B800")}`,
                    borderRadius: "14px",
                    padding: "0.85rem 1.15rem",
                    boxShadow: isLight ? "0 15px 35px rgba(0,0,0,0.15)" : "0 15px 40px rgba(0,0,0,0.75)",
                    pointerEvents: "auto",
                    zIndex: 25,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "0.75rem",
                  }}
                >
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.2rem" }}>
                      <span
                        style={{
                          fontSize: "0.68rem",
                          fontWeight: 900,
                          textTransform: "uppercase",
                          letterSpacing: "0.06em",
                          color: activePin.color || (palette?.accentPrimary || "#F5B800"),
                          background: isLight ? "rgba(0,0,0,0.06)" : "rgba(245, 184, 0, 0.15)",
                          padding: "2px 8px",
                          borderRadius: "999px",
                        }}
                      >
                        {activePin.badge || `PIN 0${activePin.number}`}
                      </span>
                      <span style={{ fontSize: "0.95rem", fontWeight: 800, color: textColor }}>
                        {activePin.title}
                      </span>
                    </div>
                    <div style={{ fontSize: "0.82rem", color: bodyTextColor, lineHeight: 1.4 }}>
                      {activePin.description}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveHotspotId(null)}
                    style={{
                      background: isLight ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.1)",
                      border: "none",
                      color: mutedTextColor,
                      borderRadius: "6px",
                      padding: "4px 8px",
                      fontSize: "0.72rem",
                      cursor: "pointer",
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    Dismiss
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {element.caption && (
          <div
            style={{
              height: "32px",
              padding: "0 12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontSize: "12px",
              fontWeight: 600,
              color: mutedTextColor,
              backgroundColor: isLight ? "#F1F5F9" : "rgba(15, 23, 42, 0.90)",
              borderTop: isLight ? "1px solid #E2E8F0" : "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {element.caption}
            </span>
            {!isEditorMode && onZoomImage && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onZoomImage(content, element.caption || "Image Preview");
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  color: "#38BDF8",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "11px",
                  fontWeight: 700,
                }}
              >
                <ZoomIn size={12} /> Zoom
              </button>
            )}
          </div>
        )}
      </div>
    );
  }

  // 5. CODE BLOCK ELEMENT
  if (type === "code") {
    const handleCopy = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (content) {
        navigator.clipboard.writeText(content);
        setCopiedCode(true);
        setTimeout(() => setCopiedCode(false), 2000);
      }
    };

    if (isEditing && isEditorMode) {
      return (
        <textarea
          ref={textEditRef}
          value={content}
          onChange={(e) => onUpdateElement?.({ content: e.target.value })}
          onBlur={onFinishEditing}
          onClick={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
          style={{
            ...baseInnerStyle,
            fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
            fontSize: "13px",
            background: "#0D1117",
            color: "#E2E8F0",
            padding: "16px",
            outline: "2px solid #00F5D4",
            resize: "none",
          }}
        />
      );
    }

    return (
      <div
        onDoubleClick={onStartEditing}
        style={{
          ...baseInnerStyle,
          backgroundColor: style.backgroundColor || "#0B0F19",
          borderColor: style.borderColor || "#2A364F",
          borderWidth: "1.5px",
          borderStyle: "solid",
          borderRadius: style.borderRadius || 16,
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 18px 40px -10px rgba(0, 0, 0, 0.75)",
        }}
      >
        {/* Modern macOS / Code Window Header */}
        <div
          style={{
            padding: "10px 14px",
            backgroundColor: "rgba(255, 255, 255, 0.04)",
            borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ display: "flex", gap: "5px" }}>
              <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#EF4444" }} />
              <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#F59E0B" }} />
              <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#10B981" }} />
            </div>
            <span
              style={{
                marginLeft: "8px",
                fontSize: "11px",
                fontWeight: 800,
                color: "#38BDF8",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                fontFamily: "var(--font-mono, monospace)",
              }}
            >
              {(element.language || "cpp").toUpperCase()} • ARDUINO CODE LAB
            </span>
          </div>
          <button
            type="button"
            onClick={handleCopy}
            style={{
              background: copiedCode ? "rgba(16, 185, 129, 0.2)" : "rgba(255, 255, 255, 0.08)",
              border: `1px solid ${copiedCode ? "#10B981" : "rgba(255, 255, 255, 0.15)"}`,
              borderRadius: "6px",
              padding: "4px 8px",
              color: copiedCode ? "#10B981" : "#E2E8F0",
              fontSize: "11px",
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              transition: "all 0.2s ease",
            }}
          >
            {copiedCode ? <Check size={12} /> : <Copy size={12} />}
            <span>{copiedCode ? "Copied!" : "Copy Code"}</span>
          </button>
        </div>

        {/* Code Content */}
        <pre
          style={{
            margin: 0,
            padding: "16px 18px",
            overflow: "auto",
            fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
            fontSize: style.fontSize ? `${style.fontSize}px` : "13.5px",
            lineHeight: 1.55,
            color: style.color || "#F8FAFC",
            whiteSpace: "pre",
            flex: 1,
          }}
        >
          <code>{content || "// Enter Arduino C++ or Python code here..."}</code>
        </pre>
      </div>
    );
  }

  // 6. SHAPE / ARROW / BADGE
  if (type === "shape") {
    const shape = element.shapeType || "rectangle";

    if (shape === "arrow-right") {
      return (
        <div
          style={{
            ...baseInnerStyle,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg viewBox="0 0 100 40" style={{ width: "100%", height: "100%" }}>
            <defs>
              <marker
                id={`arr-${element.id}`}
                viewBox="0 0 10 10"
                refX="5"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill={style.color || "#F5B800"} />
              </marker>
            </defs>
            <line
              x1="5"
              y1="20"
              x2="90"
              y2="20"
              stroke={style.color || "#F5B800"}
              strokeWidth={style.borderWidth || 4}
              markerEnd={`url(#arr-${element.id})`}
            />
          </svg>
        </div>
      );
    }

    if (shape === "circle") {
      return (
        <div
          style={{
            ...baseInnerStyle,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {content && <span>{content}</span>}
        </div>
      );
    }

    return (
      <div
        style={{
          ...baseInnerStyle,
          display: "flex",
          alignItems: "center",
          justifyContent: style.textAlign || "center",
        }}
      >
        {content && <span>{content}</span>}
      </div>
    );
  }

  // 7. CALLOUT ELEMENT (WITH INTERACTIVE FLIP QUIZ & POLL CARDS)
  if (type === "callout") {
    if (isEditing && isEditorMode) {
      return (
        <textarea
          ref={textEditRef}
          value={content}
          onChange={(e) => onUpdateElement?.({ content: e.target.value })}
          onBlur={onFinishEditing}
          onClick={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
          style={{
            ...baseInnerStyle,
            padding: "16px",
            outline: "2px solid #F5B800",
            resize: "none",
            background: "rgba(15, 23, 42, 0.95)",
          }}
        />
      );
    }

    // Parse markdown-style title ### and body
    let displayTitle = "";
    let displayBody = content;
    if (content.startsWith("### ")) {
      const parts = content.split("\n");
      displayTitle = parts[0].replace("### ", "").trim();
      displayBody = parts.slice(1).join("\n").trim();
    } else if (content.startsWith("**") && content.includes("**\n")) {
      const parts = content.split("\n");
      displayTitle = parts[0].replace(/\*\*/g, "").trim();
      displayBody = parts.slice(1).join("\n").trim();
    }

    // ------------------------------------------------------------------------
    // A. INTERACTIVE FLIP QUIZ CARD (e.g. Robot vs Machine Challenge)
    // ------------------------------------------------------------------------
    if (element.isQuizCard) {
      const verdictColor = element.quizIsPositive ? "#10B981" : "#F43F5E";

      const handleToggleQuizFlip = () => {
        if (isEditorMode) return;
        const nextFlipped = !quizFlipped;
        setQuizFlipped(nextFlipped);

        if (nextFlipped) {
          playPop(soundEnabled);
          if (element.quizIsPositive) {
            playChime(soundEnabled);
            launchConfetti();
          }
        } else {
          playPop(soundEnabled);
        }
      };

      const quizBg = quizFlipped
        ? element.quizIsPositive
          ? isLight
            ? "linear-gradient(145deg, #ECFDF5 0%, #D1FAE5 100%)"
            : "linear-gradient(145deg, rgba(16, 185, 129, 0.22) 0%, rgba(6, 78, 59, 0.45) 100%)"
          : isLight
          ? "linear-gradient(145deg, #FFF1F2 0%, #FFE4E6 100%)"
          : "linear-gradient(145deg, rgba(244, 63, 94, 0.22) 0%, rgba(136, 19, 55, 0.45) 100%)"
        : cardBackground;

      const verdictTextColor = quizFlipped
        ? element.quizIsPositive
          ? isLight ? "#065F46" : "#34D399"
          : isLight ? "#9F1239" : "#FDA4AF"
        : textColor;

      return (
        <div
          onClick={handleToggleQuizFlip}
          style={{
            ...baseInnerStyle,
            cursor: !isEditorMode ? "pointer" : "default",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            background: quizBg,
            borderColor: quizFlipped ? verdictColor : cardBorderColor,
            borderWidth: quizFlipped ? "2.5px" : "1.5px",
            borderStyle: "solid",
            borderRadius: style.borderRadius || 18,
            boxShadow: quizFlipped
              ? `0 20px 45px -10px ${verdictColor}55, 0 0 24px ${verdictColor}33`
              : style.boxShadow || (isLight ? "0 10px 30px rgba(15,23,42,0.08)" : "0 18px 40px -10px rgba(0, 0, 0, 0.6)"),
            padding: "20px 22px",
            transition: "all 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {/* Top Badge & Status */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px" }}>
            <span
              style={{
                fontSize: "11px",
                fontWeight: 900,
                color: quizFlipped ? verdictColor : (palette?.badgeText || "#F5B800"),
                backgroundColor: quizFlipped
                  ? (isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.08)")
                  : (palette?.badgeBg || "rgba(245, 184, 0, 0.16)"),
                border: `1px solid ${quizFlipped ? verdictColor : "rgba(245, 184, 0, 0.35)"}`,
                borderRadius: "999px",
                padding: "3px 10px",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              {element.badgeText || "CHALLENGE CARD"}
            </span>

            <span
              style={{
                fontSize: "11px",
                fontWeight: 800,
                color: quizFlipped ? (isLight ? "#0F172A" : "#FFFFFF") : (palette?.accentPrimary || "#38BDF8"),
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              {quizFlipped ? (
                <>
                  <RotateCcw size={12} /> Tap to Reset
                </>
              ) : (
                <>
                  <Sparkles size={12} /> Tap to Reveal Verdict ➔
                </>
              )}
            </span>
          </div>

          {/* Card Body */}
          <div style={{ margin: "10px 0", flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div
              style={{
                fontSize: style.fontSize ? `${Math.min(22, style.fontSize + 2)}px` : "20px",
                fontWeight: 900,
                color: quizFlipped ? (isLight ? "#0F172A" : "#FFFFFF") : textColor,
                marginBottom: "6px",
                lineHeight: 1.25,
              }}
            >
              {displayTitle || "Interactive Challenge"}
            </div>
            <div
              style={{
                fontSize: "14px",
                color: quizFlipped ? (isLight ? "#1E293B" : "#F1F5F9") : bodyTextColor,
                lineHeight: 1.5,
              }}
            >
              {displayBody}
            </div>
          </div>

          {/* Flipped Verdict Banner or Tap Prompt */}
          {quizFlipped ? (
            <div
              style={{
                paddingTop: "10px",
                borderTop: `1.5px solid ${verdictColor}66`,
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: verdictTextColor,
                fontWeight: 900,
                fontSize: "13.5px",
                lineHeight: 1.35,
              }}
            >
              {element.quizIsPositive ? <CheckCircle2 size={20} color={verdictColor} /> : <XCircle size={20} color={verdictColor} />}
              <span>{element.quizVerdict || (element.quizIsPositive ? "TRUE ROBOT!" : "JUST A MACHINE")}</span>
            </div>
          ) : (
            <div
              style={{
                paddingTop: "8px",
                borderTop: isLight ? "1px solid rgba(0, 0, 0, 0.08)" : "1px solid rgba(255, 255, 255, 0.08)",
                fontSize: "12px",
                color: mutedTextColor,
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <HelpCircle size={14} color={palette?.accentPrimary || "#F5B800"} />
              <span>Ask the class: &ldquo;Robot or Machine?&rdquo; then tap card</span>
            </div>
          )}
        </div>
      );
    }

    // ------------------------------------------------------------------------
    // B. INTERACTIVE CLASSROOM POLL CARD (+1 Hand Tally & Live Progress Bar)
    // ------------------------------------------------------------------------
    if (element.isPollCard) {
      const handleVote = (e: React.MouseEvent) => {
        if (isEditorMode) return;
        e.stopPropagation();
        setPollVotes((prev) => prev + 1);
        setHasVoted(true);
        playClick(soundEnabled);
      };

      const accentColor = style.borderColor || palette?.accentPrimary || "#00F5D4";

      return (
        <div
          style={{
            ...baseInnerStyle,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            background: cardBackground,
            borderColor: hasVoted ? accentColor : cardBorderColor,
            borderWidth: "1.5px",
            borderStyle: "solid",
            borderRadius: style.borderRadius || 18,
            boxShadow: hasVoted
              ? `0 20px 45px -10px ${accentColor}44, 0 0 16px ${accentColor}25`
              : style.boxShadow || (isLight ? "0 10px 30px rgba(15,23,42,0.08)" : "0 18px 40px -10px rgba(0, 0, 0, 0.6)"),
            padding: "18px 20px",
            transition: "all 0.3s ease",
          }}
        >
          {/* Top Badge */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px" }}>
            <span
              style={{
                fontSize: "11px",
                fontWeight: 900,
                color: accentColor,
                backgroundColor: isLight ? "rgba(0,0,0,0.05)" : "rgba(255, 255, 255, 0.08)",
                border: `1px solid ${accentColor}66`,
                borderRadius: "999px",
                padding: "3px 10px",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              {element.badgeText || "STUDENT PATHWAY"}
            </span>

            <span
              style={{
                fontFamily: "var(--font-mono, monospace)",
                fontSize: "13px",
                fontWeight: 900,
                color: isLight ? "#0F172A" : "#FFFFFF",
                background: isLight ? "rgba(0, 0, 0, 0.06)" : "rgba(255, 255, 255, 0.1)",
                padding: "2px 8px",
                borderRadius: "6px",
              }}
            >
              {pollVotes} {pollVotes === 1 ? "Hand" : "Hands"}
            </span>
          </div>

          {/* Title & Body */}
          <div style={{ margin: "10px 0", flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div
              style={{
                fontSize: style.fontSize ? `${Math.min(20, style.fontSize + 2)}px` : "18px",
                fontWeight: 900,
                color: textColor,
                marginBottom: "4px",
                lineHeight: 1.25,
              }}
            >
              {displayTitle || "Classroom Poll"}
            </div>
            <div
              style={{
                fontSize: "13.5px",
                color: bodyTextColor,
                lineHeight: 1.45,
              }}
            >
              {displayBody}
            </div>
          </div>

          {/* Bottom Action: +1 Vote Button & Animated Fill Bar */}
          <div>
            <div
              style={{
                width: "100%",
                height: "6px",
                background: isLight ? "rgba(0, 0, 0, 0.08)" : "rgba(255, 255, 255, 0.1)",
                borderRadius: "999px",
                overflow: "hidden",
                marginBottom: "10px",
              }}
            >
              <div
                style={{
                  width: `${Math.min(100, pollVotes * 10)}%`,
                  height: "100%",
                  background: `linear-gradient(90deg, ${accentColor}, ${palette?.accentSecondary || "#38BDF8"})`,
                  transition: "width 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                  borderRadius: "999px",
                }}
              />
            </div>

            <button
              type="button"
              onClick={handleVote}
              disabled={isEditorMode}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                padding: "8px 12px",
                borderRadius: "10px",
                border: "none",
                background: hasVoted
                  ? `linear-gradient(90deg, ${accentColor}, ${palette?.accentSecondary || "#38BDF8"})`
                  : isLight
                  ? "rgba(15, 23, 42, 0.08)"
                  : "rgba(255, 255, 255, 0.12)",
                color: hasVoted ? "#0F172A" : isLight ? "#0F172A" : "#FFFFFF",
                fontWeight: 900,
                fontSize: "12.5px",
                cursor: isEditorMode ? "default" : "pointer",
                transition: "all 0.2s ease",
              }}
            >
              <Plus size={14} />
              <span>+1 Raise Hand ({pollVotes})</span>
            </button>
          </div>
        </div>
      );
    }

    // ------------------------------------------------------------------------
    // C. STANDARD BENTO CALLOUT CARD
    // ------------------------------------------------------------------------
    return (
      <div
        onDoubleClick={onStartEditing}
        style={{
          ...baseInnerStyle,
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          borderRadius: style.borderRadius || 18,
          borderWidth: style.borderWidth || "1.5px",
          borderStyle: "solid",
          background: cardBackground,
          borderColor: cardBorderColor,
          boxShadow: style.boxShadow || (isLight ? "0 10px 30px rgba(15,23,42,0.08)" : "0 18px 40px -10px rgba(0, 0, 0, 0.6)"),
          padding: "20px 24px",
        }}
      >
        {element.badgeText && (
          <div style={{ display: "inline-flex" }}>
            <span
              style={{
                fontSize: "11px",
                fontWeight: 900,
                color: palette?.badgeText || "#F5B800",
                backgroundColor: palette?.badgeBg || "rgba(245, 184, 0, 0.16)",
                border: `1px solid ${palette?.accentPrimary ? `${palette.accentPrimary}55` : "rgba(245, 184, 0, 0.35)"}`,
                borderRadius: "999px",
                padding: "3px 10px",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              {element.badgeText}
            </span>
          </div>
        )}
        {displayTitle && (
          <div
            style={{
              fontSize: style.fontSize ? `${Math.min(22, style.fontSize + 2)}px` : "20px",
              fontWeight: 900,
              color: textColor,
              lineHeight: 1.3,
              letterSpacing: "-0.01em",
            }}
          >
            {displayTitle}
          </div>
        )}
        <div
          style={{
            fontSize: style.fontSize ? `${style.fontSize}px` : "14.5px",
            color: bodyTextColor,
            lineHeight: 1.55,
            whiteSpace: "pre-wrap",
            flex: 1,
          }}
        >
          {displayBody}
        </div>
      </div>
    );
  }

  // 8. VIDEO EMBED ELEMENT
  if (type === "video") {
    const videoUrl = element.videoUrl || content;
    const isYouTube = videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be");
    let embedSrc = videoUrl;
    if (isYouTube) {
      const videoIdMatch = videoUrl.match(/(?:youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/);
      const videoId = videoIdMatch && videoIdMatch[1].length === 11 ? videoIdMatch[1] : null;
      embedSrc = videoId ? `https://www.youtube.com/embed/${videoId}` : videoUrl;
    }

    return (
      <div style={{ ...baseInnerStyle, backgroundColor: "#000000", borderRadius: style.borderRadius || 16 }}>
        {embedSrc ? (
          <iframe
            src={embedSrc}
            title={element.caption || "Video Player"}
            style={{ width: "100%", height: "100%", border: "none" }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              color: mutedTextColor,
            }}
          >
            <Play size={32} color={palette?.accentPrimary || "#F5B800"} />
            <span>Enter Video URL in Inspector to Embed</span>
          </div>
        )}
      </div>
    );
  }

  // 9. PINOUT CARD ELEMENT (INTERACTIVE HARDWARE PINOUT TOUR)
  if (type === "pinout-card") {
    const pins = element.pinItems || [
      { number: 1, label: "5V Power", pinName: "5V", note: "Powers breadboard positive rail with regulated 5 volts" },
      { number: 2, label: "Ground", pinName: "GND", note: "Common zero-volt circuit return rail" },
      { number: 3, label: "Digital Signal", pinName: "D13", note: "Connected to onboard LED (L); commands HIGH/LOW" },
    ];

    const activePin = selectedPinIdx !== null ? pins[selectedPinIdx] : null;

    return (
      <div
        style={{
          ...baseInnerStyle,
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          borderRadius: style.borderRadius || 18,
          padding: "16px 18px",
          background: cardBackground,
          borderColor: cardBorderColor,
          borderWidth: "1.5px",
          borderStyle: "solid",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <Pin size={14} color={palette?.accentPrimary || "#00F5D4"} />
            <span style={{ fontSize: "12px", fontWeight: 800, color: palette?.accentPrimary || "#00F5D4", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              {element.caption || "HARDWARE PINOUT MAP"}
            </span>
          </div>
          <span style={{ fontSize: "11px", color: mutedTextColor, fontWeight: 700 }}>Tap pin to inspect</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "6px", overflowY: "auto", flex: 1 }}>
          {pins.map((p, idx) => {
            const isSelected = selectedPinIdx === idx;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  if (isEditorMode) return;
                  playPop(soundEnabled);
                  setSelectedPinIdx((prev) => (prev === idx ? null : idx));
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "8px 12px",
                  background: isSelected
                    ? (isLight ? "rgba(37, 99, 235, 0.12)" : "rgba(0, 245, 212, 0.16)")
                    : (isLight ? "rgba(0,0,0,0.03)" : "rgba(255, 255, 255, 0.04)"),
                  borderRadius: "10px",
                  border: `1.5px solid ${isSelected ? (palette?.accentPrimary || "#00F5D4") : (isLight ? "#E2E8F0" : "rgba(255, 255, 255, 0.08)")}`,
                  cursor: isEditorMode ? "default" : "pointer",
                  textAlign: "left",
                  transition: "all 0.2s ease",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span
                    style={{
                      width: "22px",
                      height: "22px",
                      borderRadius: "50%",
                      backgroundColor: isSelected ? (palette?.accentPrimary || "#00F5D4") : (palette?.accentPrimary ? palette.accentPrimary : "#F5B800"),
                      color: "#0F172A",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "11px",
                      fontWeight: 900,
                    }}
                  >
                    {p.number}
                  </span>
                  <span style={{ fontWeight: 700, color: textColor, fontSize: "13px" }}>{p.label}</span>
                </div>
                <span
                  style={{
                    fontFamily: "var(--font-mono, monospace)",
                    fontSize: "12px",
                    fontWeight: 800,
                    color: isSelected ? (palette?.accentPrimary || "#00F5D4") : (palette?.accentSecondary || "#38BDF8"),
                  }}
                >
                  {p.pinName}
                </span>
              </button>
            );
          })}
        </div>

        {activePin && (
          <div
            style={{
              padding: "8px 12px",
              background: isLight ? "rgba(37, 99, 235, 0.08)" : "rgba(0, 245, 212, 0.12)",
              border: `1px solid ${palette?.accentPrimary || "#00F5D4"}`,
              borderRadius: "8px",
              fontSize: "12px",
              color: textColor,
              lineHeight: 1.4,
            }}
          >
            <strong style={{ color: palette?.accentPrimary || "#00F5D4" }}>{activePin.pinName} Function:</strong> {activePin.note}
          </div>
        )}
      </div>
    );
  }

  // Fallback
  return (
    <div style={baseInnerStyle}>
      {content || "Empty Element"}
    </div>
  );
}
