"use client";

import React, { useRef } from "react";
import {
  SlideElement,
  EditableSlide,
  SlideColorTheme,
  THEME_PALETTE_CONFIG,
} from "@/lib/slideStudioStore";
import {
  Sliders,
  Palette,
  Type,
  Image as ImageIcon,
  Layers,
  Sparkles,
  BookOpen,
  Cpu,
  Upload,
  Lock,
  Unlock,
  Check,
} from "lucide-react";

interface InspectorPanelProps {
  slide: EditableSlide;
  selectedElement?: SlideElement | null;
  onUpdateElement?: (elementId: string, patch: Partial<SlideElement>) => void;
  onUpdateSlide?: (patch: Partial<EditableSlide>) => void;
  onApplyLayoutPreset?: (presetKey: string) => void;
}

const COLOR_SWATCHES = [
  "#FFFFFF",
  "#F5B700",
  "#6B0F24",
  "#00F5D4",
  "#38BDF8",
  "#10B981",
  "#F43F5E",
  "#A855F7",
  "#94A3B8",
  "#1E2533",
  "#0F172A",
];

export function InspectorPanel({
  slide,
  selectedElement,
  onUpdateElement,
  onUpdateSlide,
  onApplyLayoutPreset,
}: InspectorPanelProps) {
  const imageUploadRef = useRef<HTMLInputElement | null>(null);

  const themeKey = slide.theme || "robobee-dark";
  const palette = THEME_PALETTE_CONFIG[themeKey] || THEME_PALETTE_CONFIG["robobee-dark"];

  // ==========================================================================
  // VIEW A: ELEMENT INSPECTOR (WHEN AN ELEMENT IS SELECTED)
  // ==========================================================================
  if (selectedElement) {
    const isText = ["heading", "subheading", "textbox", "callout"].includes(
      selectedElement.type
    );
    const isImg = selectedElement.type === "image";
    const isCode = selectedElement.type === "code";

    const updateStyle = (patch: Partial<SlideElement["style"]>) => {
      onUpdateElement?.(selectedElement.id, {
        style: { ...selectedElement.style, ...patch },
      });
    };

    return (
      <div
        style={{
          width: "300px",
          backgroundColor: "#11141C",
          borderLeft: "1px solid #1F2430",
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
          padding: "16px",
          gap: "16px",
          userSelect: "none",
          flexShrink: 0,
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid #1F2430",
            paddingBottom: "10px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <Sliders size={14} color="#F5B700" />
            <span
              style={{
                fontSize: "12px",
                fontWeight: 900,
                color: "#E2E8F0",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              {selectedElement.type} Properties
            </span>
          </div>
          <span
            style={{
              fontSize: "10px",
              fontFamily: "monospace",
              color: "#64748B",
            }}
          >
            ID: {selectedElement.id.slice(0, 8)}
          </span>
        </div>

        {/* 1. POSITION & DIMENSIONS */}
        <div style={sectionStyle}>
          <div style={sectionTitleStyle}>Position & Size</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
            <div>
              <label style={labelStyle}>X (px)</label>
              <input
                type="number"
                value={selectedElement.x}
                onChange={(e) =>
                  onUpdateElement?.(selectedElement.id, { x: Number(e.target.value) })
                }
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Y (px)</label>
              <input
                type="number"
                value={selectedElement.y}
                onChange={(e) =>
                  onUpdateElement?.(selectedElement.id, { y: Number(e.target.value) })
                }
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Width</label>
              <input
                type="number"
                value={selectedElement.width}
                onChange={(e) =>
                  onUpdateElement?.(selectedElement.id, { width: Number(e.target.value) })
                }
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Height</label>
              <input
                type="number"
                value={selectedElement.height}
                onChange={(e) =>
                  onUpdateElement?.(selectedElement.id, { height: Number(e.target.value) })
                }
                style={inputStyle}
              />
            </div>
          </div>
        </div>

        {/* 2. TYPOGRAPHY (IF TEXT/HEADING/CALLOUT) */}
        {isText && (
          <div style={sectionStyle}>
            <div style={sectionTitleStyle}>Typography</div>

            {/* Font Family */}
            <div style={{ marginBottom: "8px" }}>
              <label style={labelStyle}>Font Family</label>
              <select
                value={selectedElement.style.fontFamily || "sans"}
                onChange={(e) => updateStyle({ fontFamily: e.target.value })}
                style={selectStyle}
              >
                <option value="sans">Modern Sans (Inter)</option>
                <option value="display">Tech Display (Space Grotesk)</option>
                <option value="mono">Terminal Monospace (JetBrains Mono)</option>
                <option value="serif">Editorial Serif (Playfair)</option>
              </select>
            </div>

            {/* Quick Typography Presets */}
            <div style={{ marginBottom: "8px" }}>
              <label style={labelStyle}>Style Presets</label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px" }}>
                <button
                  type="button"
                  onClick={() => updateStyle({ fontSize: 40, fontWeight: 900 })}
                  style={presetBtnStyle}
                >
                  H1 Hero
                </button>
                <button
                  type="button"
                  onClick={() => updateStyle({ fontSize: 30, fontWeight: 800 })}
                  style={presetBtnStyle}
                >
                  H2 Section
                </button>
                <button
                  type="button"
                  onClick={() => updateStyle({ fontSize: 18, fontWeight: 500 })}
                  style={presetBtnStyle}
                >
                  Subheading
                </button>
                <button
                  type="button"
                  onClick={() => updateStyle({ fontSize: 14, fontWeight: 400 })}
                  style={presetBtnStyle}
                >
                  Body Text
                </button>
              </div>
            </div>

            {/* Text Color Swatches */}
            <div>
              <label style={labelStyle}>Text Color</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {COLOR_SWATCHES.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => updateStyle({ color })}
                    style={{
                      width: "20px",
                      height: "20px",
                      borderRadius: "50%",
                      backgroundColor: color,
                      border:
                        selectedElement.style.color === color
                          ? "2px solid #F5B700"
                          : "1px solid rgba(255,255,255,0.2)",
                      cursor: "pointer",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 3. IMAGE PROPERTIES (IF IMAGE) */}
        {isImg && (
          <div style={sectionStyle}>
            <div style={sectionTitleStyle}>Image Source & Fit</div>

            <input
              ref={imageUploadRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (uploadEv) => {
                  const url = uploadEv.target?.result as string;
                  if (url) {
                    onUpdateElement?.(selectedElement.id, {
                      content: url,
                      caption: file.name.replace(/\.[^/.]+$/, ""),
                    });
                  }
                };
                reader.readAsDataURL(file);
              }}
            />

            <button
              type="button"
              onClick={() => imageUploadRef.current?.click()}
              style={{
                width: "100%",
                background: "rgba(245, 183, 0, 0.15)",
                border: "1px solid rgba(245, 183, 0, 0.35)",
                borderRadius: "8px",
                padding: "8px",
                color: "#F5B700",
                fontSize: "12px",
                fontWeight: 800,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                marginBottom: "8px",
              }}
            >
              <Upload size={14} />
              <span>Replace from Computer</span>
            </button>

            <div style={{ marginBottom: "8px" }}>
              <label style={labelStyle}>Image URL</label>
              <input
                type="text"
                value={selectedElement.content}
                onChange={(e) =>
                  onUpdateElement?.(selectedElement.id, { content: e.target.value })
                }
                style={inputStyle}
                placeholder="https://..."
              />
            </div>

            <div style={{ marginBottom: "8px" }}>
              <label style={labelStyle}>Fit Mode</label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
                <button
                  type="button"
                  onClick={() => updateStyle({ objectFit: "cover" })}
                  style={{
                    ...presetBtnStyle,
                    borderColor:
                      selectedElement.style.objectFit === "cover" ? "#F5B700" : "#2E374B",
                  }}
                >
                  Cover (Photos)
                </button>
                <button
                  type="button"
                  onClick={() => updateStyle({ objectFit: "contain" })}
                  style={{
                    ...presetBtnStyle,
                    borderColor:
                      selectedElement.style.objectFit === "contain"
                        ? "#F5B700"
                        : "#2E374B",
                  }}
                >
                  Contain (Circuit)
                </button>
              </div>
            </div>

            <div>
              <label style={labelStyle}>Caption</label>
              <input
                type="text"
                value={selectedElement.caption || ""}
                onChange={(e) =>
                  onUpdateElement?.(selectedElement.id, { caption: e.target.value })
                }
                style={inputStyle}
                placeholder="Image caption text..."
              />
            </div>
          </div>
        )}

        {/* 4. CARD / BOX STYLING */}
        <div style={sectionStyle}>
          <div style={sectionTitleStyle}>Surface & Borders</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
            <div>
              <label style={labelStyle}>Corner Radius</label>
              <input
                type="number"
                value={selectedElement.style.borderRadius ?? 14}
                onChange={(e) =>
                  updateStyle({ borderRadius: Number(e.target.value) })
                }
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Border (px)</label>
              <input
                type="number"
                value={selectedElement.style.borderWidth ?? 1}
                onChange={(e) =>
                  updateStyle({ borderWidth: Number(e.target.value) })
                }
                style={inputStyle}
              />
            </div>
          </div>
        </div>

        {/* 5. ANIMATION ON CLICK */}
        <div style={sectionStyle}>
          <div style={sectionTitleStyle}>Animation & Reveal</div>
          <label style={labelStyle}>Trigger in Projector</label>
          <select
            value={selectedElement.animation?.type || "none"}
            onChange={(e) =>
              onUpdateElement?.(selectedElement.id, {
                animation: {
                  type: e.target.value as any,
                  order: selectedElement.animation?.order || 1,
                },
              })
            }
            style={selectStyle}
          >
            <option value="none">Immediate (Always Visible)</option>
            <option value="step-reveal">Step Reveal (Advances on click)</option>
            <option value="fade">Fade In</option>
            <option value="slide-up">Slide Up</option>
            <option value="zoom">Zoom In</option>
          </select>
        </div>
      </div>
    );
  }

  // ==========================================================================
  // VIEW B: SLIDE & PRESENTER SETTINGS (WHEN NO ELEMENT SELECTED)
  // ==========================================================================
  return (
    <div
      style={{
        width: "300px",
        backgroundColor: "#11141C",
        borderLeft: "1px solid #1F2430",
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
        padding: "16px",
        gap: "16px",
        userSelect: "none",
        flexShrink: 0,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid #1F2430",
          paddingBottom: "10px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <Palette size={14} color="#F5B700" />
          <span
            style={{
              fontSize: "12px",
              fontWeight: 900,
              color: "#E2E8F0",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            Slide Settings
          </span>
        </div>
        <span
          style={{
            fontSize: "11px",
            fontWeight: 800,
            color: "#38BDF8",
          }}
        >
          Slide #{slide.numberLabel}
        </span>
      </div>

      {/* 1. SLIDE COLOR THEMES */}
      <div style={sectionStyle}>
        <div style={sectionTitleStyle}>Classroom Palette</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          {(
            [
              { id: "robobee-dark", name: "RoboBEE Dark Studio", color: "#F5B700" },
              { id: "daylight-studio", name: "Daylight Studio (White)", color: "#2563EB" },
              { id: "electric-indigo", name: "Electric Indigo", color: "#00F5D4" },
              { id: "arduino-teal", name: "Arduino Teal", color: "#2DD4BF" },
              { id: "cyber-blueprint", name: "Cyber Blueprint", color: "#38BDF8" },
            ] as const
          ).map((t) => {
            const isSelected = (slide.theme || "robobee-dark") === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => onUpdateSlide?.({ theme: t.id })}
                style={{
                  background: isSelected ? "rgba(245, 183, 0, 0.15)" : "#161B26",
                  border: isSelected ? "1px solid #F5B700" : "1px solid #2E374B",
                  borderRadius: "8px",
                  padding: "8px 10px",
                  color: isSelected ? "#FFFFFF" : "#94A3B8",
                  fontSize: "12px",
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div
                    style={{
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%",
                      backgroundColor: t.color,
                    }}
                  />
                  <span>{t.name}</span>
                </div>
                {isSelected && <Check size={14} color="#F5B700" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. SPEAKER NOTES & TAKEAWAYS */}
      <div style={sectionStyle}>
        <div style={sectionTitleStyle}>Instructor Notes</div>
        <textarea
          rows={6}
          value={slide.speakerNotes || ""}
          onChange={(e) => onUpdateSlide?.({ speakerNotes: e.target.value })}
          style={{
            ...inputStyle,
            height: "120px",
            resize: "vertical",
            lineHeight: 1.45,
          }}
          placeholder="Add prompts, demo instructions, and talking points for the presenter view..."
        />
      </div>

      {/* 3. QUICK LAYOUT PRESETS */}
      <div style={sectionStyle}>
        <div style={sectionTitleStyle}>Re-Layout Elements</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
          <button
            type="button"
            onClick={() => onApplyLayoutPreset?.("hardware-2col")}
            style={presetBtnStyle}
          >
            2-Col Hardware
          </button>
          <button
            type="button"
            onClick={() => onApplyLayoutPreset?.("code-split")}
            style={presetBtnStyle}
          >
            Code Split
          </button>
          <button
            type="button"
            onClick={() => onApplyLayoutPreset?.("gallery")}
            style={presetBtnStyle}
          >
            3-Photo Gallery
          </button>
          <button
            type="button"
            onClick={() => onApplyLayoutPreset?.("title")}
            style={presetBtnStyle}
          >
            Hero Title
          </button>
        </div>
      </div>
    </div>
  );
}

const sectionStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "6px",
};

const sectionTitleStyle: React.CSSProperties = {
  fontSize: "11px",
  fontWeight: 800,
  color: "#94A3B8",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  marginBottom: "2px",
};

const labelStyle: React.CSSProperties = {
  fontSize: "11px",
  color: "#64748B",
  fontWeight: 600,
  marginBottom: "2px",
  display: "block",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  backgroundColor: "#161B26",
  border: "1px solid #2E374B",
  borderRadius: "6px",
  padding: "6px 8px",
  color: "#FFFFFF",
  fontSize: "12px",
  boxSizing: "border-box",
};

const selectStyle: React.CSSProperties = {
  width: "100%",
  backgroundColor: "#161B26",
  border: "1px solid #2E374B",
  borderRadius: "6px",
  padding: "6px 8px",
  color: "#FFFFFF",
  fontSize: "12px",
  boxSizing: "border-box",
  cursor: "pointer",
};

const presetBtnStyle: React.CSSProperties = {
  backgroundColor: "#161B26",
  border: "1px solid #2E374B",
  borderRadius: "6px",
  padding: "6px 8px",
  color: "#CBD5E1",
  fontSize: "11px",
  fontWeight: 700,
  cursor: "pointer",
  textAlign: "center",
};
