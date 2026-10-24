"use client";

import React, { useRef } from "react";
import {
  ArrowLeft,
  Save,
  Tv,
  Plus,
  Type,
  Heading,
  FileText,
  Image as ImageIcon,
  Code2,
  Square,
  ArrowRight,
  PlaySquare,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  BringToFront,
  SendToBack,
  ChevronsUp,
  ChevronsDown,
  Activity,
  Link as LinkIcon,
  Copy,
  Lock,
  Unlock,
  Trash2,
  Undo2,
  Redo2,
  Download,
  Upload,
  Check,
  RotateCcw,
} from "lucide-react";
import { SlideElement } from "@/lib/slideStudioStore";

interface TopRibbonBarProps {
  deckTitle: string;
  onUpdateDeckTitle: (newTitle: string) => void;
  courseBadge?: string;
  onClose: () => void;
  onSave: () => void;
  isSaving: boolean;
  savedToast: boolean;
  onLaunchProjector: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onExportJson: () => void;
  onImportJson: (file: File) => void;
  onResetSlide: () => void;
  // Insert tool handlers
  onInsertHeading: () => void;
  onInsertSubheading: () => void;
  onInsertTextBox: () => void;
  onInsertImages: (files: FileList) => void;
  onInsertImageUrl?: () => void;
  onInsertCodeBlock: () => void;
  onInsertDiagram?: () => void;
  onInsertShape: (shapeType: "rectangle" | "circle" | "arrow-right") => void;
  onInsertVideo: () => void;
  // Selected Element formatting
  selectedElement?: SlideElement | null;
  onUpdateSelectedElement?: (patch: Partial<SlideElement>) => void;
  onBringForward?: () => void;
  onSendBackward?: () => void;
  onBringToFront?: () => void;
  onSendToBack?: () => void;
  onDuplicateElement?: () => void;
  onToggleLockElement?: () => void;
  onDeleteElement?: () => void;
}

export function TopRibbonBar({
  deckTitle,
  onUpdateDeckTitle,
  courseBadge = "RoboBee Curriculum",
  onClose,
  onSave,
  isSaving,
  savedToast,
  onLaunchProjector,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onExportJson,
  onImportJson,
  onResetSlide,
  onInsertHeading,
  onInsertSubheading,
  onInsertTextBox,
  onInsertImages,
  onInsertImageUrl,
  onInsertCodeBlock,
  onInsertDiagram,
  onInsertShape,
  onInsertVideo,
  selectedElement,
  onUpdateSelectedElement,
  onBringForward,
  onSendBackward,
  onBringToFront,
  onSendToBack,
  onDuplicateElement,
  onToggleLockElement,
  onDeleteElement,
}: TopRibbonBarProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const jsonInputRef = useRef<HTMLInputElement | null>(null);

  const isTextElement =
    selectedElement &&
    ["heading", "subheading", "textbox", "callout"].includes(selectedElement.type);

  return (
    <div
      style={{
        height: "56px",
        backgroundColor: "#0F1117",
        borderBottom: "1px solid #1F2430",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 14px",
        gap: "12px",
        userSelect: "none",
        zIndex: 50,
      }}
    >
      {/* Hidden File Inputs */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            onInsertImages(e.target.files);
            e.target.value = "";
          }
        }}
      />
      <input
        ref={jsonInputRef}
        type="file"
        accept=".json"
        style={{ display: "none" }}
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            onImportJson(e.target.files[0]);
            e.target.value = "";
          }
        }}
      />

      {/* ZONE 1: LEFT CONTROLS (Back, Title, Badge, Save) */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
        <button
          type="button"
          onClick={onClose}
          style={{
            background: "rgba(255, 255, 255, 0.06)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            borderRadius: "8px",
            padding: "6px 10px",
            color: "#E2E8F0",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "12px",
            fontWeight: 700,
            cursor: "pointer",
          }}
          title="Exit to Curriculum Hub"
        >
          <ArrowLeft size={14} />
          <span>Hub</span>
        </button>

        {/* Editable Deck Title */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <input
            type="text"
            value={deckTitle}
            onChange={(e) => onUpdateDeckTitle(e.target.value)}
            style={{
              background: "transparent",
              border: "1px solid transparent",
              borderRadius: "6px",
              padding: "4px 8px",
              color: "#FFFFFF",
              fontSize: "14px",
              fontWeight: 800,
              width: "220px",
              textOverflow: "ellipsis",
            }}
            onFocus={(e) => (e.target.style.border = "1px solid #38BDF8")}
            onBlur={(e) => (e.target.style.border = "1px solid transparent")}
          />
          <span
            style={{
              fontSize: "10px",
              fontWeight: 900,
              color: "#F5B700",
              backgroundColor: "rgba(245, 183, 0, 0.15)",
              border: "1px solid rgba(245, 183, 0, 0.35)",
              padding: "2px 8px",
              borderRadius: "999px",
              textTransform: "uppercase",
            }}
          >
            {courseBadge}
          </span>
        </div>

        {/* Manual Save Button & Status */}
        <button
          type="button"
          onClick={onSave}
          disabled={isSaving}
          style={{
            background: savedToast
              ? "rgba(16, 185, 129, 0.2)"
              : "rgba(255, 255, 255, 0.06)",
            border: savedToast
              ? "1px solid #10B981"
              : "1px solid rgba(255, 255, 255, 0.12)",
            borderRadius: "8px",
            padding: "6px 10px",
            color: savedToast ? "#10B981" : "#E2E8F0",
            fontSize: "12px",
            fontWeight: 700,
            cursor: isSaving ? "wait" : "pointer",
            display: "flex",
            alignItems: "center",
            gap: "5px",
          }}
        >
          {savedToast ? <Check size={14} /> : <Save size={14} />}
          <span>{savedToast ? "Saved!" : isSaving ? "Saving..." : "Save"}</span>
        </button>
      </div>

      {/* ZONE 2: CENTER INSERT & CONTEXTUAL FORMATTING RIBBON */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          overflowX: "auto",
          padding: "0 6px",
        }}
      >
        {/* Insert Tools */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            paddingRight: "8px",
            borderRight: "1px solid rgba(255, 255, 255, 0.12)",
          }}
        >
          <button
            type="button"
            onClick={onInsertHeading}
            style={ribbonBtnStyle}
            title="Insert Heading Box"
          >
            <Heading size={14} color="#00F5D4" />
            <span>Heading</span>
          </button>
          <button
            type="button"
            onClick={onInsertSubheading}
            style={ribbonBtnStyle}
            title="Insert Subheading Box"
          >
            <Type size={14} color="#38BDF8" />
            <span>Subheading</span>
          </button>
          <button
            type="button"
            onClick={onInsertTextBox}
            style={ribbonBtnStyle}
            title="Insert Rich Text / Bullet Box"
          >
            <FileText size={14} color="#FBBF24" />
            <span>Text</span>
          </button>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            style={ribbonBtnStyle}
            title="Upload 1 or Multiple Images"
          >
            <ImageIcon size={14} color="#F43F5E" />
            <span>Image(s)</span>
          </button>
          {onInsertImageUrl && (
            <button
              type="button"
              onClick={onInsertImageUrl}
              style={ribbonBtnStyle}
              title="Insert Image by Web URL"
            >
              <LinkIcon size={14} color="#F43F5E" />
              <span>URL</span>
            </button>
          )}
          <button
            type="button"
            onClick={onInsertCodeBlock}
            style={ribbonBtnStyle}
            title="Insert Arduino C++ / Python Code Box"
          >
            <Code2 size={14} color="#A855F7" />
            <span>Code</span>
          </button>
          {onInsertDiagram && (
            <button
              type="button"
              onClick={onInsertDiagram}
              style={ribbonBtnStyle}
              title="Insert Interactive Circuit / Sensor Diagram"
            >
              <Activity size={14} color="#00F5D4" />
              <span>Diagram</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => onInsertShape("rectangle")}
            style={ribbonBtnStyle}
            title="Insert Rectangle Shape"
          >
            <Square size={14} color="#10B981" />
            <span>Shape</span>
          </button>
          <button
            type="button"
            onClick={onInsertVideo}
            style={ribbonBtnStyle}
            title="Insert Embedded Video"
          >
            <PlaySquare size={14} color="#EF4444" />
            <span>Video</span>
          </button>
        </div>

        {/* Contextual Text Formatting (Visible when text selected) */}
        {isTextElement && selectedElement && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              paddingRight: "8px",
              borderRight: "1px solid rgba(255, 255, 255, 0.12)",
            }}
          >
            {/* Font Size Stepper */}
            <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
              <input
                type="number"
                min={12}
                max={96}
                value={selectedElement.style.fontSize || 24}
                onChange={(e) =>
                  onUpdateSelectedElement?.({
                    style: {
                      ...selectedElement.style,
                      fontSize: Number(e.target.value),
                    },
                  })
                }
                style={{
                  width: "48px",
                  background: "#161B26",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  borderRadius: "6px",
                  color: "#FFFFFF",
                  fontSize: "12px",
                  fontWeight: 700,
                  padding: "4px 6px",
                  textAlign: "center",
                }}
              />
              <span style={{ fontSize: "11px", color: "#64748B" }}>px</span>
            </div>

            {/* Bold */}
            <button
              type="button"
              onClick={() => {
                const currentWeight = selectedElement.style.fontWeight;
                const nextWeight =
                  currentWeight === 700 || currentWeight === "bold" ? 400 : 700;
                onUpdateSelectedElement?.({
                  style: { ...selectedElement.style, fontWeight: nextWeight },
                });
              }}
              style={{
                ...iconBtnStyle,
                background:
                  selectedElement.style.fontWeight === 700 ||
                  selectedElement.style.fontWeight === "bold"
                    ? "rgba(245, 183, 0, 0.25)"
                    : "transparent",
              }}
              title="Bold"
            >
              <Bold size={13} />
            </button>

            {/* Italic */}
            <button
              type="button"
              onClick={() => {
                const nextStyle =
                  selectedElement.style.fontStyle === "italic" ? "normal" : "italic";
                onUpdateSelectedElement?.({
                  style: { ...selectedElement.style, fontStyle: nextStyle },
                });
              }}
              style={{
                ...iconBtnStyle,
                background:
                  selectedElement.style.fontStyle === "italic"
                    ? "rgba(245, 183, 0, 0.25)"
                    : "transparent",
              }}
              title="Italic"
            >
              <Italic size={13} />
            </button>

            {/* Underline */}
            <button
              type="button"
              onClick={() => {
                const nextDeco =
                  selectedElement.style.textDecoration === "underline"
                    ? "none"
                    : "underline";
                onUpdateSelectedElement?.({
                  style: { ...selectedElement.style, textDecoration: nextDeco },
                });
              }}
              style={{
                ...iconBtnStyle,
                background:
                  selectedElement.style.textDecoration === "underline"
                    ? "rgba(245, 183, 0, 0.25)"
                    : "transparent",
              }}
              title="Underline"
            >
              <Underline size={13} />
            </button>

            {/* Alignments */}
            <button
              type="button"
              onClick={() =>
                onUpdateSelectedElement?.({
                  style: { ...selectedElement.style, textAlign: "left" },
                })
              }
              style={{
                ...iconBtnStyle,
                background:
                  selectedElement.style.textAlign === "left"
                    ? "rgba(56, 189, 248, 0.2)"
                    : "transparent",
              }}
              title="Align Left"
            >
              <AlignLeft size={13} />
            </button>
            <button
              type="button"
              onClick={() =>
                onUpdateSelectedElement?.({
                  style: { ...selectedElement.style, textAlign: "center" },
                })
              }
              style={{
                ...iconBtnStyle,
                background:
                  selectedElement.style.textAlign === "center"
                    ? "rgba(56, 189, 248, 0.2)"
                    : "transparent",
              }}
              title="Align Center"
            >
              <AlignCenter size={13} />
            </button>
            <button
              type="button"
              onClick={() =>
                onUpdateSelectedElement?.({
                  style: { ...selectedElement.style, textAlign: "right" },
                })
              }
              style={{
                ...iconBtnStyle,
                background:
                  selectedElement.style.textAlign === "right"
                    ? "rgba(56, 189, 248, 0.2)"
                    : "transparent",
              }}
              title="Align Right"
            >
              <AlignRight size={13} />
            </button>
            <button
              type="button"
              onClick={() =>
                onUpdateSelectedElement?.({
                  style: { ...selectedElement.style, textAlign: "justify" },
                })
              }
              style={{
                ...iconBtnStyle,
                background:
                  selectedElement.style.textAlign === "justify"
                    ? "rgba(56, 189, 248, 0.2)"
                    : "transparent",
              }}
              title="Align Justify"
            >
              <AlignJustify size={13} />
            </button>

            {/* Text Color Picker */}
            <div style={{ display: "flex", alignItems: "center", gap: "2px", marginLeft: "4px" }} title="Text Color">
              <input
                type="color"
                value={selectedElement.style.color || "#FFFFFF"}
                onChange={(e) =>
                  onUpdateSelectedElement?.({
                    style: { ...selectedElement.style, color: e.target.value },
                  })
                }
                style={{
                  width: "22px",
                  height: "22px",
                  borderRadius: "4px",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  background: "transparent",
                  cursor: "pointer",
                  padding: 0,
                }}
              />
            </div>

            {/* Background Color Picker */}
            <div style={{ display: "flex", alignItems: "center", gap: "2px" }} title="Background Fill Color">
              <input
                type="color"
                value={
                  selectedElement.style.backgroundColor?.startsWith("#")
                    ? selectedElement.style.backgroundColor
                    : "#1E2533"
                }
                onChange={(e) =>
                  onUpdateSelectedElement?.({
                    style: { ...selectedElement.style, backgroundColor: e.target.value },
                  })
                }
                style={{
                  width: "22px",
                  height: "22px",
                  borderRadius: "4px",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  background: "transparent",
                  cursor: "pointer",
                  padding: 0,
                }}
              />
            </div>
          </div>
        )}

        {/* Layer & Alignment controls (when any element selected) */}
        {selectedElement && (
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            {onBringToFront && (
              <button
                type="button"
                onClick={onBringToFront}
                style={iconBtnStyle}
                title="Bring to Front (Top Layer)"
              >
                <ChevronsUp size={13} />
              </button>
            )}
            <button
              type="button"
              onClick={onBringForward}
              style={iconBtnStyle}
              title="Bring Forward (Up 1 Layer)"
            >
              <BringToFront size={13} />
            </button>
            <button
              type="button"
              onClick={onSendBackward}
              style={iconBtnStyle}
              title="Send Backward (Down 1 Layer)"
            >
              <SendToBack size={13} />
            </button>
            {onSendToBack && (
              <button
                type="button"
                onClick={onSendToBack}
                style={iconBtnStyle}
                title="Send to Back (Bottom Layer)"
              >
                <ChevronsDown size={13} />
              </button>
            )}
            <button
              type="button"
              onClick={onDuplicateElement}
              style={iconBtnStyle}
              title="Duplicate (Ctrl+D)"
            >
              <Copy size={13} />
            </button>
            <button
              type="button"
              onClick={onToggleLockElement}
              style={{
                ...iconBtnStyle,
                color: selectedElement.locked ? "#F5B700" : "#94A3B8",
              }}
              title={selectedElement.locked ? "Unlock Element" : "Lock Element"}
            >
              {selectedElement.locked ? <Lock size={13} /> : <Unlock size={13} />}
            </button>
            <button
              type="button"
              onClick={onDeleteElement}
              style={{ ...iconBtnStyle, color: "#EF4444" }}
              title="Delete Element (Del)"
            >
              <Trash2 size={13} />
            </button>
          </div>
        )}
      </div>

      {/* ZONE 3: RIGHT ACTION BUTTONS (Undo/Redo, JSON backup, Projector CTA) */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
        {/* Undo / Redo */}
        <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
          <button
            type="button"
            onClick={onUndo}
            disabled={!canUndo}
            style={{
              ...iconBtnStyle,
              opacity: canUndo ? 1 : 0.4,
              cursor: canUndo ? "pointer" : "not-allowed",
            }}
            title="Undo (Ctrl+Z)"
          >
            <Undo2 size={14} />
          </button>
          <button
            type="button"
            onClick={onRedo}
            disabled={!canRedo}
            style={{
              ...iconBtnStyle,
              opacity: canRedo ? 1 : 0.4,
              cursor: canRedo ? "pointer" : "not-allowed",
            }}
            title="Redo (Ctrl+Y)"
          >
            <Redo2 size={14} />
          </button>
        </div>

        {/* JSON Backup Buttons */}
        <button
          type="button"
          onClick={onExportJson}
          style={iconBtnStyle}
          title="Export Deck JSON Backup"
        >
          <Download size={13} />
        </button>
        <button
          type="button"
          onClick={() => jsonInputRef.current?.click()}
          style={iconBtnStyle}
          title="Import Deck JSON"
        >
          <Upload size={13} />
        </button>

        {/* Reset Slide to Clean Template */}
        <button
          type="button"
          onClick={onResetSlide}
          style={iconBtnStyle}
          title="Reset Slide to Clean Layout"
        >
          <RotateCcw size={13} />
        </button>

        {/* Primary Golden CTA Button: GO LIVE / PRESENT */}
        <button
          type="button"
          onClick={onLaunchProjector}
          style={{
            background: "linear-gradient(135deg, #F5B700 0%, #D99B00 100%)",
            border: "1px solid #FFE082",
            borderRadius: "8px",
            padding: "8px 14px",
            color: "#0F1117",
            fontWeight: 900,
            fontSize: "12px",
            letterSpacing: "0.04em",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            boxShadow: "0 4px 14px rgba(245, 183, 0, 0.35)",
          }}
          title="Launch Live Classroom Projector View"
        >
          <Tv size={15} />
          <span>Go Live (Projector)</span>
        </button>
      </div>
    </div>
  );
}

const ribbonBtnStyle: React.CSSProperties = {
  background: "rgba(255, 255, 255, 0.05)",
  border: "1px solid rgba(255, 255, 255, 0.08)",
  borderRadius: "6px",
  padding: "5px 8px",
  color: "#E2E8F0",
  fontSize: "11px",
  fontWeight: 700,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: "5px",
};

const iconBtnStyle: React.CSSProperties = {
  background: "transparent",
  border: "1px solid transparent",
  borderRadius: "6px",
  padding: "6px",
  color: "#94A3B8",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};
