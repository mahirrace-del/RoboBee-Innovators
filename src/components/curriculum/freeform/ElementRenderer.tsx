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
  ExternalLink,
} from "lucide-react";

interface ElementRendererProps {
  element: SlideElement;
  isEditorMode?: boolean;
  isSelected?: boolean;
  isEditing?: boolean;
  onStartEditing?: () => void;
  onFinishEditing?: () => void;
  onUpdateElement?: (patch: Partial<SlideElement>) => void;
  onZoomImage?: (src: string, caption: string) => void;
  stepRevealVisible?: boolean;
}

export function ElementRenderer({
  element,
  isEditorMode = false,
  isSelected = false,
  isEditing = false,
  onStartEditing,
  onFinishEditing,
  onUpdateElement,
  onZoomImage,
  stepRevealVisible = true,
}: ElementRendererProps) {
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const textEditRef = useRef<HTMLTextAreaElement | null>(null);

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
    color: style.color || "#FFFFFF",
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
            outline: "2px solid #F5B700",
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
            outline: "2px solid #F5B700",
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
          fontSize: style.fontSize ? `${style.fontSize}px` : "18px",
          color: style.color || "#94A3B8",
          wordBreak: "break-word",
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
            outline: "2px solid #F5B700",
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
        }}
      >
        {content || "Double click to enter body text or bullet points..."}
      </div>
    );
  }

  // 4. IMAGE ELEMENT
  if (type === "image") {
    return (
      <div
        style={{
          ...baseInnerStyle,
          display: "flex",
          flexDirection: "column",
          cursor: !isEditorMode ? "zoom-in" : "default",
        }}
        onClick={() => {
          if (!isEditorMode && onZoomImage && content) {
            onZoomImage(content, element.caption || "Image Preview");
          }
        }}
      >
        <img
          src={content || "/illustrations/class1-external-blink-wiring.svg"}
          alt={element.caption || "Slide Visual"}
          draggable={false}
          style={{
            width: "100%",
            height: element.caption ? "calc(100% - 28px)" : "100%",
            objectFit: style.objectFit || "cover",
            display: "block",
            pointerEvents: isEditorMode ? "none" : "auto",
            userSelect: "none",
          }}
          loading="lazy"
        />
        {element.caption && (
          <div
            style={{
              height: "28px",
              padding: "0 10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontSize: "12px",
              fontWeight: 600,
              color: "#94A3B8",
              backgroundColor: "rgba(15, 23, 42, 0.85)",
              borderTop: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {element.caption}
            </span>
            {!isEditorMode && (
              <span style={{ display: "flex", alignItems: "center", gap: "4px", color: "#38BDF8" }}>
                <ZoomIn size={12} /> Click to zoom
              </span>
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
          backgroundColor: style.backgroundColor || "#0D1117",
          borderColor: style.borderColor || "#2E374B",
          borderWidth: "1px",
          borderStyle: "solid",
          borderRadius: style.borderRadius || 12,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Code Header Bar */}
        <div
          style={{
            padding: "8px 14px",
            backgroundColor: "rgba(255, 255, 255, 0.04)",
            borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Code2 size={14} color="#00F5D4" />
            <span
              style={{
                fontSize: "11px",
                fontWeight: 800,
                color: "#00F5D4",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              {(element.language || "cpp").toUpperCase()} CODE LAB
            </span>
          </div>
          <button
            type="button"
            onClick={handleCopy}
            style={{
              background: "rgba(255, 255, 255, 0.08)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              borderRadius: "6px",
              padding: "4px 8px",
              color: "#E2E8F0",
              fontSize: "11px",
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            {copiedCode ? <Check size={12} color="#10B981" /> : <Copy size={12} />}
            <span>{copiedCode ? "Copied!" : "Copy"}</span>
          </button>
        </div>

        {/* Code Lines */}
        <pre
          style={{
            margin: 0,
            padding: "14px 18px",
            overflow: "auto",
            fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
            fontSize: style.fontSize ? `${style.fontSize}px` : "13px",
            lineHeight: 1.5,
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

  // 6. SHAPE / ARROW / CALLOUT BADGE
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
                <path d="M 0 0 L 10 5 L 0 10 z" fill={style.color || "#F5B700"} />
              </marker>
            </defs>
            <line
              x1="5"
              y1="20"
              x2="90"
              y2="20"
              stroke={style.color || "#F5B700"}
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

  // 7. CALLOUT BENTO CARD
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
            outline: "2px solid #F5B700",
            resize: "none",
            background: "rgba(15, 23, 42, 0.95)",
          }}
        />
      );
    }

    // Split markdown-style title ### and body
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

    return (
      <div
        onDoubleClick={onStartEditing}
        style={{
          ...baseInnerStyle,
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        {element.badgeText && (
          <div style={{ display: "inline-flex" }}>
            <span
              style={{
                fontSize: "11px",
                fontWeight: 900,
                color: "#F5B700",
                backgroundColor: "rgba(245, 183, 0, 0.15)",
                border: "1px solid rgba(245, 183, 0, 0.35)",
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
              fontSize: style.fontSize ? `${Math.min(22, style.fontSize + 2)}px` : "18px",
              fontWeight: 800,
              color: style.color || "#FFFFFF",
              lineHeight: 1.3,
            }}
          >
            {displayTitle}
          </div>
        )}
        <div
          style={{
            fontSize: style.fontSize ? `${style.fontSize}px` : "14px",
            color: "#CBD5E1",
            lineHeight: 1.5,
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
      <div style={{ ...baseInnerStyle, backgroundColor: "#000000" }}>
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
              color: "#94A3B8",
            }}
          >
            <Play size={32} color="#F5B700" />
            <span>Enter Video URL in Inspector to Embed</span>
          </div>
        )}
      </div>
    );
  }

  // 9. PINOUT CARD ELEMENT
  if (type === "pinout-card") {
    const pins = element.pinItems || [
      { number: 1, label: "5V Power", pinName: "5V", note: "Powers breadboard positive rail" },
      { number: 2, label: "Ground", pinName: "GND", note: "Common reference zero-volt rail" },
      { number: 3, label: "Digital Signal", pinName: "D13", note: "Built-in LED control pin" },
    ];

    return (
      <div
        style={{
          ...baseInnerStyle,
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <Pin size={14} color="#00F5D4" />
          <span style={{ fontSize: "12px", fontWeight: 800, color: "#00F5D4", textTransform: "uppercase" }}>
            {element.caption || "HARDWARE PINOUT MAP"}
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "6px", overflowY: "auto" }}>
          {pins.map((p, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "6px 10px",
                background: "rgba(255, 255, 255, 0.04)",
                borderRadius: "8px",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                fontSize: "12px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span
                  style={{
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    backgroundColor: "#F5B700",
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
                <span style={{ fontWeight: 700, color: "#FFFFFF" }}>{p.label}</span>
              </div>
              <span
                style={{
                  fontFamily: "var(--font-mono, monospace)",
                  fontSize: "11px",
                  fontWeight: 800,
                  color: "#38BDF8",
                }}
              >
                {p.pinName}
              </span>
            </div>
          ))}
        </div>
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
