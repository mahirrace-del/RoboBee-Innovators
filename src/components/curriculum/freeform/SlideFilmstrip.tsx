"use client";

import React, { useState } from "react";
import {
  EditableSlide,
  SlideElement,
  THEME_PALETTE_CONFIG,
} from "@/lib/slideStudioStore";
import {
  Plus,
  Trash2,
  Copy,
  ChevronUp,
  ChevronDown,
  LayoutTemplate,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";

interface SlideFilmstripProps {
  slides: EditableSlide[];
  activeSlideIdx: number;
  onSelectSlide: (idx: number) => void;
  onAddSlide: (presetKey?: string) => void;
  onDuplicateSlide: (idx: number) => void;
  onDeleteSlide: (idx: number) => void;
  onMoveSlide: (idx: number, direction: -1 | 1) => void;
}

export function SlideFilmstrip({
  slides,
  activeSlideIdx,
  onSelectSlide,
  onAddSlide,
  onDuplicateSlide,
  onDeleteSlide,
  onMoveSlide,
}: SlideFilmstripProps) {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [showPresetsMenu, setShowPresetsMenu] = useState<boolean>(false);

  if (collapsed) {
    return (
      <div
        style={{
          width: "40px",
          backgroundColor: "#11141C",
          borderRight: "1px solid #1F2430",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "12px 0",
          gap: "12px",
          userSelect: "none",
        }}
      >
        <button
          type="button"
          onClick={() => setCollapsed(false)}
          style={{
            background: "rgba(255, 255, 255, 0.08)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            borderRadius: "6px",
            color: "#94A3B8",
            padding: "6px",
            cursor: "pointer",
          }}
          title="Expand Filmstrip"
        >
          <ChevronRight size={14} />
        </button>
        <span
          style={{
            writingMode: "vertical-rl",
            color: "#64748B",
            fontSize: "11px",
            fontWeight: 800,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          {slides.length} SLIDES
        </span>
      </div>
    );
  }

  return (
    <div
      style={{
        width: "240px",
        backgroundColor: "#11141C",
        borderRight: "1px solid #1F2430",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        userSelect: "none",
        flexShrink: 0,
        position: "relative",
      }}
    >
      {/* Top Header */}
      <div
        style={{
          padding: "10px 14px",
          borderBottom: "1px solid #1F2430",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <LayoutTemplate size={14} color="#F5B700" />
          <span
            style={{
              fontSize: "11px",
              fontWeight: 800,
              color: "#E2E8F0",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            Slides ({slides.length})
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <button
            type="button"
            onClick={() => setShowPresetsMenu((p) => !p)}
            style={{
              background: "rgba(245, 183, 0, 0.15)",
              border: "1px solid rgba(245, 183, 0, 0.35)",
              borderRadius: "6px",
              padding: "4px 8px",
              color: "#F5B700",
              fontSize: "11px",
              fontWeight: 800,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
            title="Add Slide from Preset"
          >
            <Plus size={12} />
            <span>Add</span>
          </button>
          <button
            type="button"
            onClick={() => setCollapsed(true)}
            style={{
              background: "transparent",
              border: "none",
              color: "#64748B",
              padding: "4px",
              cursor: "pointer",
            }}
            title="Collapse Filmstrip"
          >
            <ChevronLeft size={14} />
          </button>
        </div>
      </div>

      {/* Preset Picker Dropdown */}
      {showPresetsMenu && (
        <div
          style={{
            position: "absolute",
            top: "48px",
            left: "14px",
            right: "14px",
            backgroundColor: "#161B26",
            border: "1px solid #F5B700",
            borderRadius: "10px",
            padding: "8px",
            zIndex: 100,
            boxShadow: "0 12px 30px rgba(0,0,0,0.7)",
            display: "flex",
            flexDirection: "column",
            gap: "4px",
          }}
        >
          <div
            style={{
              fontSize: "10px",
              fontWeight: 800,
              color: "#94A3B8",
              textTransform: "uppercase",
              padding: "4px 8px",
            }}
          >
            Choose Slide Layout
          </div>
          {[
            { id: "blank", name: "Blank Freeform Slide", desc: "Empty canvas for custom builds" },
            { id: "title", name: "Title & Hook Hero", desc: "Large bold title with hero visual" },
            { id: "hardware-2col", name: "2-Column Hardware", desc: "Component breakdown cards + wiring" },
            { id: "code-split", name: "Circuit + Code Split", desc: "Schematic left, Arduino C++ right" },
            { id: "gallery", name: "3-Image Lab Gallery", desc: "Multiple photos for robot showcase" },
            { id: "friday-task", name: "Friday Lab Challenge", desc: "Sprint goal, timer, rules" },
            { id: "quiz", name: "Concept Check / Quiz", desc: "Interactive question + 2 verdict cards" },
          ].map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => {
                onAddSlide(preset.id);
                setShowPresetsMenu(false);
              }}
              style={{
                background: "rgba(255, 255, 255, 0.04)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "6px",
                padding: "6px 8px",
                color: "#E2E8F0",
                fontSize: "11px",
                fontWeight: 700,
                textAlign: "left",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                gap: "2px",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "rgba(245, 183, 0, 0.15)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.04)")
              }
            >
              <span style={{ color: "#F5B700" }}>{preset.name}</span>
              <span style={{ fontSize: "10px", color: "#64748B" }}>{preset.desc}</span>
            </button>
          ))}
        </div>
      )}

      {/* Thumbnails Scroll Area */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "10px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        {slides.map((slide, idx) => {
          const isActive = idx === activeSlideIdx;
          const themeKey = slide.theme || "robobee-dark";
          const palette =
            THEME_PALETTE_CONFIG[themeKey] || THEME_PALETTE_CONFIG["robobee-dark"];

          return (
            <div
              key={slide.id || `thumb-${idx}`}
              onClick={() => onSelectSlide(idx)}
              style={{
                borderRadius: "10px",
                border: isActive ? "2px solid #F5B700" : "1px solid #1F2430",
                backgroundColor: "#161B26",
                padding: "8px",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                gap: "6px",
                boxShadow: isActive ? "0 0 14px rgba(245, 183, 0, 0.3)" : "none",
                transition: "all 0.15s ease",
              }}
            >
              {/* Mini Header: Slide # & Action Buttons */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span
                    style={{
                      width: "18px",
                      height: "18px",
                      borderRadius: "4px",
                      backgroundColor: isActive ? "#F5B700" : "rgba(255,255,255,0.08)",
                      color: isActive ? "#0F1117" : "#94A3B8",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "10px",
                      fontWeight: 900,
                    }}
                  >
                    {idx + 1}
                  </span>
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 700,
                      color: isActive ? "#FFFFFF" : "#94A3B8",
                      maxWidth: "120px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {slide.title || `Slide ${idx + 1}`}
                  </span>
                </div>

                {/* Micro Actions */}
                <div
                  style={{ display: "flex", alignItems: "center", gap: "2px" }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    onClick={() => onMoveSlide(idx, -1)}
                    disabled={idx === 0}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: idx === 0 ? "#334155" : "#64748B",
                      cursor: idx === 0 ? "default" : "pointer",
                      padding: "2px",
                    }}
                    title="Move Slide Up"
                  >
                    <ChevronUp size={12} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onMoveSlide(idx, 1)}
                    disabled={idx === slides.length - 1}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: idx === slides.length - 1 ? "#334155" : "#64748B",
                      cursor: idx === slides.length - 1 ? "default" : "pointer",
                      padding: "2px",
                    }}
                    title="Move Slide Down"
                  >
                    <ChevronDown size={12} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDuplicateSlide(idx)}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "#64748B",
                      cursor: "pointer",
                      padding: "2px",
                    }}
                    title="Duplicate Slide"
                  >
                    <Copy size={11} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteSlide(idx)}
                    disabled={slides.length <= 1}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: slides.length <= 1 ? "#334155" : "#EF4444",
                      cursor: slides.length <= 1 ? "default" : "pointer",
                      padding: "2px",
                    }}
                    title="Delete Slide"
                  >
                    <Trash2 size={11} />
                  </button>
                </div>
              </div>

              {/* 16:9 Scaled Mini Slide Preview */}
              <div
                style={{
                  width: "100%",
                  aspectRatio: "16 / 9",
                  borderRadius: "6px",
                  background: palette.canvasBg,
                  overflow: "hidden",
                  position: "relative",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                }}
              >
                {/* Simplified visual skeleton preview */}
                <div style={{ padding: "6px", display: "flex", flexDirection: "column", gap: "4px" }}>
                  <div
                    style={{
                      width: "35%",
                      height: "3px",
                      backgroundColor: palette.badgeText,
                      borderRadius: "2px",
                    }}
                  />
                  <div
                    style={{
                      width: "80%",
                      height: "5px",
                      backgroundColor: palette.headingColor,
                      borderRadius: "2px",
                    }}
                  />
                  <div style={{ display: "flex", gap: "4px", marginTop: "4px" }}>
                    <div
                      style={{
                        flex: 1,
                        height: "24px",
                        backgroundColor: palette.cardBg,
                        border: `1px solid ${palette.cardBorder}`,
                        borderRadius: "3px",
                      }}
                    />
                    {slide.heroImage && (
                      <div
                        style={{
                          width: "35%",
                          height: "24px",
                          backgroundColor: "rgba(0,0,0,0.3)",
                          borderRadius: "3px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <span style={{ fontSize: "8px", color: "#64748B" }}>IMG</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
