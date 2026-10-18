"use client";

import React, { useState } from "react";
import {
  EditableClassDeck,
  EditableSlide,
  EditableSlideCard,
  EditableHotspotPin,
  SlideImageItem,
  createBlankSlide,
  saveDeckToStorageAndCloud,
} from "@/lib/slideStudioStore";
import {
  THEME_PALETTE_CONFIG,
  SlideColorTheme,
} from "@/components/curriculum/Class1WorkshopDeck";
import { EditableSlideCanvas } from "@/components/curriculum/EditableSlideCanvas";
import {
  ArrowLeft,
  Save,
  Tv,
  Plus,
  Trash2,
  Copy,
  ArrowUp,
  ArrowDown,
  Palette,
  Layout,
  Type,
  Sparkles,
  Image as ImageIcon,
  Layers,
  MapPin,
  Check,
  Upload,
  AlignLeft,
  AlignCenter,
} from "lucide-react";

interface SlideStudioEditorProps {
  initialDeck: EditableClassDeck;
  onClose: () => void;
  onSaveDeck?: (updatedDeck: EditableClassDeck) => void;
  onDeckSaved?: (updatedDeck: EditableClassDeck) => void;
  onLaunchProjector: (deck: EditableClassDeck, startSlideIdx: number) => void;
}

export function SlideStudioEditor({
  initialDeck,
  onClose,
  onSaveDeck,
  onDeckSaved,
  onLaunchProjector,
}: SlideStudioEditorProps) {
  const [deck, setDeck] = useState<EditableClassDeck>(initialDeck);
  const [activeSlideIdx, setActiveSlideIdx] = useState<number>(0);
  const [inspectorTab, setInspectorTab] = useState<"design" | "text" | "media">("design");
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [saving, setSaving] = useState<boolean>(false);
  const [savedToast, setSavedToast] = useState<boolean>(false);

  const currentSlide: EditableSlide = deck.slides[activeSlideIdx] || deck.slides[0];
  const palette = THEME_PALETTE_CONFIG[currentSlide?.theme || "robobee-dark"] || THEME_PALETTE_CONFIG["robobee-dark"];

  const relabelSlides = (slides: EditableSlide[]): EditableSlide[] =>
    slides.map((s, idx) => ({
      ...s,
      numberLabel: String(idx + 1).padStart(2, "0"),
    }));

  const updateCurrentSlide = (patch: Partial<EditableSlide>) => {
    setDeck((prev) => {
      const nextSlides = [...prev.slides];
      nextSlides[activeSlideIdx] = { ...nextSlides[activeSlideIdx], ...patch };
      return { ...prev, slides: nextSlides };
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveDeckToStorageAndCloud(deck);
      onSaveDeck?.(deck);
      onDeckSaved?.(deck);
      setSavedToast(true);
      setTimeout(() => setSavedToast(false), 2500);
    } finally {
      setSaving(false);
    }
  };

  // Slide Filmstrip Operations
  const handleAddSlide = () => {
    const newSlide = createBlankSlide(deck.slides.length + 1, currentSlide?.theme || "robobee-dark");
    const nextSlides = relabelSlides([
      ...deck.slides.slice(0, activeSlideIdx + 1),
      newSlide,
      ...deck.slides.slice(activeSlideIdx + 1),
    ]);
    setDeck((prev) => ({ ...prev, slides: nextSlides }));
    setActiveSlideIdx(activeSlideIdx + 1);
  };

  const handleDuplicateSlide = (idx: number) => {
    const source = deck.slides[idx];
    const cloned: EditableSlide = {
      ...JSON.parse(JSON.stringify(source)),
      id: `slide-${Date.now()}`,
      title: `${source.title} (Copy)`,
    };
    const nextSlides = relabelSlides([
      ...deck.slides.slice(0, idx + 1),
      cloned,
      ...deck.slides.slice(idx + 1),
    ]);
    setDeck((prev) => ({ ...prev, slides: nextSlides }));
    setActiveSlideIdx(idx + 1);
  };

  const handleDeleteSlide = (idx: number) => {
    if (deck.slides.length <= 1) {
      alert("A presentation deck must have at least 1 slide.");
      return;
    }
    const nextSlides = relabelSlides(deck.slides.filter((_, i) => i !== idx));
    setDeck((prev) => ({ ...prev, slides: nextSlides }));
    setActiveSlideIdx(Math.max(0, Math.min(activeSlideIdx, nextSlides.length - 1)));
  };

  const handleMoveSlide = (idx: number, direction: -1 | 1) => {
    const targetIdx = idx + direction;
    if (targetIdx < 0 || targetIdx >= deck.slides.length) return;
    const copy = [...deck.slides];
    const [moved] = copy.splice(idx, 1);
    copy.splice(targetIdx, 0, moved);
    const relabeled = relabelSlides(copy);
    setDeck((prev) => ({ ...prev, slides: relabeled }));
    setActiveSlideIdx(targetIdx);
  };

  // Card Operations
  const handleAddCard = () => {
    const newCard: EditableSlideCard = {
      id: `card-${Date.now()}`,
      badge: `POINT 0${currentSlide.cards.length + 1}`,
      title: "New Engineering Callout Card",
      body: "Click in the right inspector panel to customize this card's text, badge, and accent color.",
      accentColor: palette.accentPrimary,
    };
    updateCurrentSlide({ cards: [...currentSlide.cards, newCard] });
    setSelectedElementId(newCard.id);
    setInspectorTab("media");
  };

  const handleUpdateCard = (cardId: string, patch: Partial<EditableSlideCard>) => {
    const nextCards = currentSlide.cards.map((c) => (c.id === cardId ? { ...c, ...patch } : c));
    updateCurrentSlide({ cards: nextCards });
  };

  const handleDeleteCard = (cardId: string) => {
    updateCurrentSlide({ cards: currentSlide.cards.filter((c) => c.id !== cardId) });
  };

  // Hotspot Pin Operations
  const handleAddHotspot = () => {
    const nextNum = currentSlide.hotspots.length + 1;
    const newPin: EditableHotspotPin = {
      id: `hs-${Date.now()}`,
      number: nextNum,
      xPercent: 50,
      yPercent: 50,
      title: `Component Pin #${nextNum}`,
      badge: `PIN 0${nextNum} • HARDWARE`,
      description: "Drag this numbered pin directly on the slide image to position it, and edit its description here.",
      color: "#F5B800",
    };
    updateCurrentSlide({
      layout: "interactive-hotspot",
      hotspots: [...currentSlide.hotspots, newPin],
    });
    setSelectedElementId(newPin.id);
    setInspectorTab("media");
  };

  const handleUpdateHotspot = (pinId: string, patch: Partial<EditableHotspotPin>) => {
    const nextPins = currentSlide.hotspots.map((h) => (h.id === pinId ? { ...h, ...patch } : h));
    updateCurrentSlide({ hotspots: nextPins });
  };

  const handleDeleteHotspot = (pinId: string) => {
    const filtered = currentSlide.hotspots
      .filter((h) => h.id !== pinId)
      .map((h, i) => ({ ...h, number: i + 1 }));
    updateCurrentSlide({ hotspots: filtered });
  };

  // Multi-Photo Gallery Operations
  const handleAddGalleryPhoto = () => {
    const newImg: SlideImageItem = {
      id: `img-${Date.now()}`,
      url: "/illustrations/class1-external-blink-wiring.svg",
      caption: `Gallery Photo #${(currentSlide.galleryImages?.length || 0) + 2}`,
      fallbackVariant: "arduino",
    };
    updateCurrentSlide({
      galleryImages: [...(currentSlide.galleryImages || []), newImg],
    });
    setInspectorTab("media");
  };

  const handleUpdateGalleryPhoto = (imgId: string, patch: Partial<SlideImageItem>) => {
    const nextImgs = (currentSlide.galleryImages || []).map((img) =>
      img.id === imgId ? { ...img, ...patch } : img
    );
    updateCurrentSlide({ galleryImages: nextImgs });
  };

  const handleDeleteGalleryPhoto = (imgId: string) => {
    updateCurrentSlide({
      galleryImages: (currentSlide.galleryImages || []).filter((img) => img.id !== imgId),
    });
  };

  // Local Image File Upload (converts user's local image to Data URL for immediate embedding)
  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    target: "hero" | string
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || "");
      if (target === "hero") {
        updateCurrentSlide({ heroImage: result });
      } else {
        handleUpdateGalleryPhoto(target, { url: result });
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 95000,
        background: "#161B26",
        color: "#FFFFFF",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* =================================================================== */}
      {/* SINGLE-ROW H-14 (56px) STUDIO HEADER (NO WRAPPING TOOLBAR COLLISION) */}
      {/* =================================================================== */}
      <header
        style={{
          height: "56px",
          minHeight: "56px",
          maxHeight: "56px",
          background: "#1E2533",
          borderBottom: "1px solid #2E374B",
          padding: "0 1.25rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
          flexShrink: 0,
        }}
      >
        {/* Left: <- Back + Class Code + Editable Class Title */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", minWidth: 0, flex: 1 }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: "#161B26",
              color: "#E2E8F0",
              border: "1px solid #2E374B",
              borderRadius: "8px",
              padding: "0.42rem 0.85rem",
              fontSize: "0.8rem",
              fontWeight: 800,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              flexShrink: 0,
            }}
          >
            <ArrowLeft size={15} /> Back
          </button>

          <span
            style={{
              background: "rgba(245, 184, 0, 0.14)",
              border: "1px solid rgba(245, 184, 0, 0.4)",
              color: "#F5B800",
              padding: "0.22rem 0.6rem",
              borderRadius: "6px",
              fontSize: "0.72rem",
              fontWeight: 900,
              flexShrink: 0,
            }}
          >
            {deck.classCode}
          </span>

          <input
            type="text"
            value={deck.title}
            onChange={(e) => setDeck((prev) => ({ ...prev, title: e.target.value }))}
            style={{
              background: "transparent",
              border: "1px solid transparent",
              color: "#FFFFFF",
              fontSize: "0.95rem",
              fontWeight: 800,
              padding: "0.25rem 0.5rem",
              borderRadius: "6px",
              width: "100%",
              maxWidth: "460px",
            }}
            title="Click to rename class presentation title"
          />
        </div>

        {/* Right: Preview Projector & Save Changes */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", flexShrink: 0 }}>
          <button
            type="button"
            onClick={async () => {
              await saveDeckToStorageAndCloud(deck);
              onSaveDeck?.(deck);
              onDeckSaved?.(deck);
              onLaunchProjector(deck, activeSlideIdx);
            }}
            style={{
              background: "#161B26",
              color: "#FFFFFF",
              border: "1px solid #2E374B",
              borderRadius: "8px",
              padding: "0.45rem 0.9rem",
              fontSize: "0.8rem",
              fontWeight: 800,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
            }}
          >
            <Tv size={15} color="#F5B800" /> Preview Projector
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            style={{
              background: savedToast ? "#10B981" : "#6B0F24",
              color: "#FFFFFF",
              border: "1px solid #F5B800",
              borderRadius: "8px",
              padding: "0.45rem 1.05rem",
              fontSize: "0.82rem",
              fontWeight: 800,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
            }}
          >
            {savedToast ? <Check size={15} /> : <Save size={15} color="#F5B800" />}
            {savedToast ? "Saved!" : saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </header>

      {/* =================================================================== */}
      {/* 3-COLUMN WORKSPACE: LEFT FILMSTRIP | CENTER STAGE | RIGHT INSPECTOR */}
      {/* =================================================================== */}
      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "250px 1fr 370px", overflow: "hidden" }}>
        {/* 1. LEFT SIDEBAR: SLIDE FILMSTRIP & SORTER */}
        <div
          style={{
            background: "#161B26",
            borderRight: "1px solid #2E374B",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "0.85rem 1rem",
              borderBottom: "1px solid #2E374B",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: "0.76rem", fontWeight: 800, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Slides ({deck.slides.length})
            </span>
            <button
              type="button"
              onClick={handleAddSlide}
              style={{
                background: "#F5B800",
                color: "#161B26",
                border: "none",
                borderRadius: "6px",
                padding: "0.28rem 0.6rem",
                fontSize: "0.74rem",
                fontWeight: 900,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.25rem",
              }}
            >
              <Plus size={13} /> New Slide
            </button>
          </div>

          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "0.75rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.65rem",
            }}
          >
            {deck.slides.map((s, idx) => {
              const isSelected = idx === activeSlideIdx;
              const sPalette = THEME_PALETTE_CONFIG[s.theme] || THEME_PALETTE_CONFIG["robobee-dark"];
              return (
                <div
                  key={s.id}
                  onClick={() => setActiveSlideIdx(idx)}
                  style={{
                    background: isSelected ? "#1E2533" : "#161B26",
                    border: `2px solid ${isSelected ? "#F5B800" : "#2E374B"}`,
                    borderRadius: "10px",
                    padding: "0.65rem",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
                    <span
                      style={{
                        fontSize: "0.68rem",
                        fontWeight: 800,
                        padding: "0.14rem 0.45rem",
                        borderRadius: "6px",
                        background: sPalette.canvasBg,
                        color: sPalette.headingColor,
                        border: `1px solid ${sPalette.cardBorder}`,
                      }}
                    >
                      {s.numberLabel} • {sPalette.name.split(" ")[0]}
                    </span>

                    <div style={{ display: "flex", gap: "0.2rem" }} onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => handleMoveSlide(idx, -1)}
                        disabled={idx === 0}
                        style={{ background: "transparent", border: "none", color: idx === 0 ? "#334155" : "#94A3B8", cursor: "pointer", padding: "2px" }}
                        title="Move Slide Up"
                      >
                        <ArrowUp size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveSlide(idx, 1)}
                        disabled={idx === deck.slides.length - 1}
                        style={{ background: "transparent", border: "none", color: idx === deck.slides.length - 1 ? "#334155" : "#94A3B8", cursor: "pointer", padding: "2px" }}
                        title="Move Slide Down"
                      >
                        <ArrowDown size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDuplicateSlide(idx)}
                        style={{ background: "transparent", border: "none", color: "#F5B800", cursor: "pointer", padding: "2px" }}
                        title="Duplicate Slide"
                      >
                        <Copy size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteSlide(idx)}
                        style={{ background: "transparent", border: "none", color: "#F43F5E", cursor: "pointer", padding: "2px" }}
                        title="Delete Slide"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  <div
                    style={{
                      fontSize: "0.8rem",
                      fontWeight: 800,
                      color: "#F8FAFC",
                      lineHeight: 1.3,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {s.title}
                  </div>
                  <div style={{ fontSize: "0.68rem", color: "#94A3B8", marginTop: "0.25rem", textTransform: "uppercase", fontWeight: 700 }}>
                    {s.layout} • {1 + (s.galleryImages?.length || 0)} photo(s)
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. CENTER STAGE: LIVE WYSIWYG SLIDE CANVAS */}
        <div
          style={{
            background: "#0F141D",
            overflowY: "auto",
            padding: "1.5rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Quick Action Strip Above Canvas */}
          <div
            style={{
              width: "100%",
              maxWidth: "1120px",
              marginBottom: "0.85rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "0.5rem",
            }}
          >
            <div style={{ fontSize: "0.8rem", color: "#94A3B8", fontWeight: 700 }}>
              Editing <strong>Slide {currentSlide.numberLabel} of {String(deck.slides.length).padStart(2, "0")}</strong> • Theme: <strong style={{ color: "#F5B800" }}>{palette.name}</strong>
            </div>

            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={handleAddCard}
                style={{
                  background: "#1E2533",
                  color: "#F5B800",
                  border: "1px solid #2E374B",
                  borderRadius: "8px",
                  padding: "0.35rem 0.7rem",
                  fontSize: "0.75rem",
                  fontWeight: 800,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.3rem",
                }}
              >
                <Plus size={13} /> Add Callout Card
              </button>
              <button
                type="button"
                onClick={handleAddGalleryPhoto}
                style={{
                  background: "#1E2533",
                  color: "#E2E8F0",
                  border: "1px solid #2E374B",
                  borderRadius: "8px",
                  padding: "0.35rem 0.7rem",
                  fontSize: "0.75rem",
                  fontWeight: 800,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.3rem",
                }}
              >
                <ImageIcon size={13} /> Add Extra Photo
              </button>
              <button
                type="button"
                onClick={handleAddHotspot}
                style={{
                  background: "#1E2533",
                  color: "#E2E8F0",
                  border: "1px solid #2E374B",
                  borderRadius: "8px",
                  padding: "0.35rem 0.7rem",
                  fontSize: "0.75rem",
                  fontWeight: 800,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.3rem",
                }}
              >
                <MapPin size={13} /> Add Hotspot Pin
              </button>
            </div>
          </div>

          {/* 16:9 Live Slide Stage */}
          <div
            style={{
              width: "100%",
              maxWidth: "1120px",
              minHeight: "620px",
              background: palette.canvasBg,
              backgroundImage: palette.gridOverlay
                ? `${palette.gridOverlay}, ${palette.canvasBg}`
                : palette.canvasBg,
              backgroundSize: palette.gridOverlay ? "24px 24px, 100% 100%" : "100% 100%",
              border: `2px solid ${palette.cardBorder}`,
              borderRadius: "20px",
              padding: "2rem",
              boxShadow: "0 24px 60px rgba(0, 0, 0, 0.55)",
            }}
          >
            <EditableSlideCanvas
              slide={currentSlide}
              isEditorMode={true}
              onUpdateSlide={(updated) => updateCurrentSlide(updated)}
              selectedElementId={selectedElementId}
              onSelectElement={(id) => {
                setSelectedElementId(id);
                setInspectorTab("media");
              }}
            />
          </div>
        </div>

        {/* 3. RIGHT SIDEBAR: INSPECTOR PANEL (1. DESIGN & LAYOUT | 2. TEXT & NOTES | 3. MEDIA & CARDS) */}
        <div
          style={{
            background: "#161B26",
            borderLeft: "1px solid #2E374B",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Inspector Tabs */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              borderBottom: "1px solid #2E374B",
              background: "#1E2533",
            }}
          >
            <button
              type="button"
              onClick={() => setInspectorTab("design")}
              style={{
                background: inspectorTab === "design" ? "#161B26" : "transparent",
                color: inspectorTab === "design" ? "#F5B800" : "#94A3B8",
                border: "none",
                borderBottom: inspectorTab === "design" ? "2px solid #F5B800" : "2px solid transparent",
                padding: "0.75rem 0.35rem",
                fontSize: "0.73rem",
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              1. Design &amp; Layout
            </button>
            <button
              type="button"
              onClick={() => setInspectorTab("text")}
              style={{
                background: inspectorTab === "text" ? "#161B26" : "transparent",
                color: inspectorTab === "text" ? "#F5B800" : "#94A3B8",
                border: "none",
                borderBottom: inspectorTab === "text" ? "2px solid #F5B800" : "2px solid transparent",
                padding: "0.75rem 0.35rem",
                fontSize: "0.73rem",
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              2. Text &amp; Notes
            </button>
            <button
              type="button"
              onClick={() => setInspectorTab("media")}
              style={{
                background: inspectorTab === "media" ? "#161B26" : "transparent",
                color: inspectorTab === "media" ? "#F5B800" : "#94A3B8",
                border: "none",
                borderBottom: inspectorTab === "media" ? "2px solid #F5B800" : "2px solid transparent",
                padding: "0.75rem 0.35rem",
                fontSize: "0.73rem",
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              3. Media &amp; Cards
            </button>
          </div>

          {/* Inspector Scroll Body */}
          <div style={{ flex: 1, overflowY: "auto", padding: "1.1rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
            {/* TAB 1: DESIGN & LAYOUT (Theme, Layout Template, Typography Font/Size, Alignment, Animation) */}
            {inspectorTab === "design" && (
              <>
                <div style={{ background: "#1E2533", border: "1px solid #2E374B", borderRadius: "10px", padding: "0.9rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  <div style={{ fontSize: "0.78rem", fontWeight: 800, color: "#F5B800", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <Palette size={14} /> Slide Color Theme
                  </div>
                  <select
                    value={currentSlide.theme}
                    onChange={(e) => updateCurrentSlide({ theme: e.target.value as SlideColorTheme })}
                    style={{ width: "100%", padding: "0.55rem", borderRadius: "8px", background: "#161B26", border: "1px solid #2E374B", color: "#FFFFFF", fontSize: "0.82rem", fontWeight: 700 }}
                  >
                    <option value="robobee-dark">RoboBEE Dark Studio (#161B26 / #F5B800)</option>
                    <option value="daylight-studio">Daylight Studio (Projector High-Contrast Light)</option>
                    <option value="electric-indigo">Electric Indigo</option>
                    <option value="arduino-teal">Arduino Teal</option>
                    <option value="cyber-blueprint">Cyber Blueprint</option>
                  </select>
                </div>

                <div style={{ background: "#1E2533", border: "1px solid #2E374B", borderRadius: "10px", padding: "0.9rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  <div style={{ fontSize: "0.78rem", fontWeight: 800, color: "#F5B800", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <Layout size={14} /> Slide Layout Template
                  </div>
                  <select
                    value={currentSlide.layout}
                    onChange={(e) => updateCurrentSlide({ layout: e.target.value as EditableSlide["layout"] })}
                    style={{ width: "100%", padding: "0.55rem", borderRadius: "8px", background: "#161B26", border: "1px solid #2E374B", color: "#FFFFFF", fontSize: "0.82rem", fontWeight: 700 }}
                  >
                    <option value="hero-title">Hero Title Banner</option>
                    <option value="split-media">Split Media + Cards</option>
                    <option value="interactive-grid">Interactive Bento Grid</option>
                    <option value="timeline-stepper">120-Minute Timeline Stepper</option>
                    <option value="interactive-hotspot">Hardware Hotspot Pins</option>
                    <option value="photo-gallery">Multi-Photo Gallery</option>
                  </select>
                </div>

                <div style={{ background: "#1E2533", border: "1px solid #2E374B", borderRadius: "10px", padding: "0.9rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  <div style={{ fontSize: "0.78rem", fontWeight: 800, color: "#F5B800", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <Type size={14} /> Typography &amp; Alignment
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.72rem", color: "#94A3B8", marginBottom: "0.25rem" }}>
                      Font Family
                    </label>
                    <select
                      value={currentSlide.fontFamily || "sans"}
                      onChange={(e) => updateCurrentSlide({ fontFamily: e.target.value as EditableSlide["fontFamily"] })}
                      style={{ width: "100%", padding: "0.5rem", borderRadius: "8px", background: "#161B26", border: "1px solid #2E374B", color: "#FFFFFF", fontSize: "0.8rem" }}
                    >
                      <option value="sans">Inter Sans (Clean UI)</option>
                      <option value="display">Space Display (Headlines)</option>
                      <option value="mono">JetBrains Mono (Code &amp; Schematics)</option>
                      <option value="serif">Editorial Serif</option>
                    </select>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "0.5rem", alignItems: "end" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.72rem", color: "#94A3B8", marginBottom: "0.25rem" }}>
                        Headline Size
                      </label>
                      <select
                        value={currentSlide.titleSize || "standard"}
                        onChange={(e) => updateCurrentSlide({ titleSize: e.target.value as EditableSlide["titleSize"] })}
                        style={{ width: "100%", padding: "0.5rem", borderRadius: "8px", background: "#161B26", border: "1px solid #2E374B", color: "#FFFFFF", fontSize: "0.8rem" }}
                      >
                        <option value="compact">Compact</option>
                        <option value="standard">Standard</option>
                        <option value="large">Large</option>
                        <option value="hero">Hero XL</option>
                      </select>
                    </div>

                    <div style={{ display: "inline-flex", background: "#161B26", borderRadius: "8px", border: "1px solid #2E374B", overflow: "hidden" }}>
                      <button
                        type="button"
                        onClick={() => updateCurrentSlide({ textAlign: "left" })}
                        style={{
                          background: currentSlide.textAlign !== "center" ? "#F5B800" : "transparent",
                          color: currentSlide.textAlign !== "center" ? "#161B26" : "#CBD5E1",
                          border: "none",
                          padding: "0.5rem 0.65rem",
                          cursor: "pointer",
                        }}
                        title="Align Left"
                      >
                        <AlignLeft size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => updateCurrentSlide({ textAlign: "center" })}
                        style={{
                          background: currentSlide.textAlign === "center" ? "#F5B800" : "transparent",
                          color: currentSlide.textAlign === "center" ? "#161B26" : "#CBD5E1",
                          border: "none",
                          padding: "0.5rem 0.65rem",
                          cursor: "pointer",
                        }}
                        title="Align Center"
                      >
                        <AlignCenter size={14} />
                      </button>
                    </div>
                  </div>
                </div>

                <div style={{ background: "#1E2533", border: "1px solid #2E374B", borderRadius: "10px", padding: "0.9rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                  <div style={{ fontSize: "0.78rem", fontWeight: 800, color: "#F5B800", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <Sparkles size={14} /> Slide Transition Animation
                  </div>
                  <select
                    value={currentSlide.animation || "fade-up"}
                    onChange={(e) => updateCurrentSlide({ animation: e.target.value as EditableSlide["animation"] })}
                    style={{ width: "100%", padding: "0.5rem", borderRadius: "8px", background: "#161B26", border: "1px solid #2E374B", color: "#FFFFFF", fontSize: "0.8rem" }}
                  >
                    <option value="fade-up">Fade &amp; Rise</option>
                    <option value="zoom-in">Keynote Zoom</option>
                    <option value="slide-right">Slide Glide</option>
                    <option value="cyber-glow">Subtle Highlight</option>
                    <option value="none">Instant (No Animation)</option>
                  </select>
                </div>
              </>
            )}

            {/* TAB 2: SLIDE HEADLINES & SPEAKER NOTES */}
            {inspectorTab === "text" && (
              <>
                <div>
                  <label style={{ display: "block", fontSize: "0.74rem", fontWeight: 800, color: "#94A3B8", marginBottom: "0.3rem" }}>
                    Top Pill Badge Text
                  </label>
                  <input
                    type="text"
                    value={currentSlide.badge}
                    onChange={(e) => updateCurrentSlide({ badge: e.target.value })}
                    style={{ width: "100%", padding: "0.55rem 0.7rem", borderRadius: "8px", background: "#1E2533", border: "1px solid #2E374B", color: "#F8FAFC", fontSize: "0.84rem" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.74rem", fontWeight: 800, color: "#94A3B8", marginBottom: "0.3rem" }}>
                    Slide Headline Title
                  </label>
                  <textarea
                    rows={2}
                    value={currentSlide.title}
                    onChange={(e) => updateCurrentSlide({ title: e.target.value })}
                    style={{ width: "100%", padding: "0.55rem 0.7rem", borderRadius: "8px", background: "#1E2533", border: "1px solid #2E374B", color: "#F8FAFC", fontSize: "0.9rem", fontWeight: 700 }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.74rem", fontWeight: 800, color: "#94A3B8", marginBottom: "0.3rem" }}>
                    Slide Subtitle / Key Takeaway
                  </label>
                  <textarea
                    rows={3}
                    value={currentSlide.subtitle}
                    onChange={(e) => updateCurrentSlide({ subtitle: e.target.value })}
                    style={{ width: "100%", padding: "0.55rem 0.7rem", borderRadius: "8px", background: "#1E2533", border: "1px solid #2E374B", color: "#F8FAFC", fontSize: "0.84rem" }}
                  />
                </div>

                {currentSlide.layout === "hero-title" && (
                  <div>
                    <label style={{ display: "block", fontSize: "0.74rem", fontWeight: 800, color: "#94A3B8", marginBottom: "0.3rem" }}>
                      CTA Button Label (Optional)
                    </label>
                    <input
                      type="text"
                      value={currentSlide.ctaText || ""}
                      onChange={(e) => updateCurrentSlide({ ctaText: e.target.value })}
                      placeholder="e.g. Begin 120-Minute Session ->"
                      style={{ width: "100%", padding: "0.55rem 0.7rem", borderRadius: "8px", background: "#1E2533", border: "1px solid #2E374B", color: "#F8FAFC", fontSize: "0.84rem" }}
                    />
                  </div>
                )}

                <div>
                  <label style={{ display: "block", fontSize: "0.74rem", fontWeight: 800, color: "#F5B800", marginBottom: "0.3rem" }}>
                    Instructor Speaker Notes (Shown in Presenter Dock)
                  </label>
                  <textarea
                    rows={5}
                    value={currentSlide.speakerNotes}
                    onChange={(e) => updateCurrentSlide({ speakerNotes: e.target.value })}
                    style={{ width: "100%", padding: "0.55rem 0.7rem", borderRadius: "8px", background: "#1E2533", border: "1px solid #2E374B", color: "#F8FAFC", fontSize: "0.82rem", lineHeight: 1.5 }}
                  />
                </div>
              </>
            )}

            {/* TAB 3: MEDIA, GALLERY, CARDS & HOTSPOTS */}
            {inspectorTab === "media" && (
              <>
                <div style={{ background: "#1E2533", border: "1px solid #2E374B", borderRadius: "12px", padding: "0.9rem" }}>
                  <div style={{ fontSize: "0.78rem", fontWeight: 900, color: "#F5B800", marginBottom: "0.5rem" }}>
                    Primary Slide Photo / Local SVG Diagram
                  </div>
                  <label style={{ display: "block", fontSize: "0.72rem", color: "#94A3B8", marginBottom: "0.25rem" }}>
                    Image URL or Local SVG Path (/illustrations/*.svg)
                  </label>
                  <input
                    type="text"
                    value={currentSlide.heroImage}
                    onChange={(e) => updateCurrentSlide({ heroImage: e.target.value })}
                    style={{ width: "100%", padding: "0.5rem", borderRadius: "6px", background: "#161B26", border: "1px solid #2E374B", color: "#F8FAFC", fontSize: "0.8rem", marginBottom: "0.5rem" }}
                  />

                  <label
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.4rem",
                      background: "#161B26",
                      color: "#F5B800",
                      border: "1px solid #2E374B",
                      borderRadius: "6px",
                      padding: "0.38rem 0.7rem",
                      fontSize: "0.75rem",
                      fontWeight: 800,
                      cursor: "pointer",
                      marginBottom: "0.65rem",
                    }}
                  >
                    <Upload size={13} /> Upload Image From Computer
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, "hero")}
                      style={{ display: "none" }}
                    />
                  </label>

                  <label style={{ display: "block", fontSize: "0.72rem", color: "#94A3B8", marginBottom: "0.25rem" }}>
                    Caption Bar Text (Labeled Reference Illustration / Photo)
                  </label>
                  <input
                    type="text"
                    value={currentSlide.imageCaption}
                    onChange={(e) => updateCurrentSlide({ imageCaption: e.target.value })}
                    style={{ width: "100%", padding: "0.5rem", borderRadius: "6px", background: "#161B26", border: "1px solid #2E374B", color: "#F8FAFC", fontSize: "0.8rem" }}
                  />
                </div>

                {/* Multi-Photo Gallery List */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.25rem" }}>
                  <span style={{ fontSize: "0.8rem", fontWeight: 900, color: "#F8FAFC" }}>
                    Additional Slide Photos ({currentSlide.galleryImages?.length || 0})
                  </span>
                  <button
                    type="button"
                    onClick={handleAddGalleryPhoto}
                    style={{
                      background: "#1E2533",
                      color: "#F5B800",
                      border: "1px solid #2E374B",
                      borderRadius: "6px",
                      padding: "0.32rem 0.65rem",
                      fontSize: "0.74rem",
                      fontWeight: 900,
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.25rem",
                    }}
                  >
                    <Plus size={13} /> Add Photo
                  </button>
                </div>

                {(currentSlide.galleryImages || []).map((img, i) => (
                  <div
                    key={img.id}
                    style={{
                      background: "#1E2533",
                      border: "1px solid #2E374B",
                      borderRadius: "10px",
                      padding: "0.8rem",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
                      <strong style={{ fontSize: "0.76rem", color: "#F5B800" }}>Gallery Photo #{i + 2}</strong>
                      <button
                        type="button"
                        onClick={() => handleDeleteGalleryPhoto(img.id)}
                        style={{ background: "transparent", border: "none", color: "#F43F5E", cursor: "pointer" }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <input
                      type="text"
                      value={img.url}
                      onChange={(e) => handleUpdateGalleryPhoto(img.id, { url: e.target.value })}
                      placeholder="Image URL"
                      style={{ width: "100%", padding: "0.45rem", borderRadius: "6px", background: "#161B26", border: "1px solid #2E374B", color: "#F8FAFC", fontSize: "0.78rem", marginBottom: "0.4rem" }}
                    />
                    <label
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.3rem",
                        background: "#161B26",
                        color: "#E2E8F0",
                        borderRadius: "6px",
                        padding: "0.28rem 0.55rem",
                        fontSize: "0.72rem",
                        fontWeight: 800,
                        cursor: "pointer",
                        marginBottom: "0.4rem",
                      }}
                    >
                      <Upload size={12} /> Upload File
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, img.id)}
                        style={{ display: "none" }}
                      />
                    </label>
                    <input
                      type="text"
                      value={img.caption}
                      onChange={(e) => handleUpdateGalleryPhoto(img.id, { caption: e.target.value })}
                      placeholder="Photo caption"
                      style={{ width: "100%", padding: "0.45rem", borderRadius: "6px", background: "#161B26", border: "1px solid #2E374B", color: "#F8FAFC", fontSize: "0.78rem" }}
                    />
                  </div>
                ))}

                {/* Slide Cards & Hotspot Pins */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.5rem" }}>
                  <span style={{ fontSize: "0.8rem", fontWeight: 900, color: "#F5B800" }}>
                    Slide Cards ({currentSlide.cards.length})
                  </span>
                  <button
                    type="button"
                    onClick={handleAddCard}
                    style={{
                      background: "#F5B800",
                      color: "#161B26",
                      border: "none",
                      borderRadius: "6px",
                      padding: "0.28rem 0.6rem",
                      fontSize: "0.73rem",
                      fontWeight: 900,
                      cursor: "pointer",
                    }}
                  >
                    + Add Card
                  </button>
                </div>

                {currentSlide.cards.map((card, cIdx) => (
                  <div
                    key={card.id}
                    style={{
                      background: selectedElementId === card.id ? "#1E293B" : "#0F172A",
                      border: `1px solid ${selectedElementId === card.id ? "#FBBF24" : "#334155"}`,
                      borderRadius: "10px",
                      padding: "0.8rem",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.45rem",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <strong style={{ fontSize: "0.75rem", color: "#FBBF24" }}>Card #{cIdx + 1}</strong>
                      <button
                        type="button"
                        onClick={() => handleDeleteCard(card.id)}
                        style={{ background: "transparent", border: "none", color: "#F43F5E", cursor: "pointer" }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <input
                      type="text"
                      value={card.badge || ""}
                      onChange={(e) => handleUpdateCard(card.id, { badge: e.target.value })}
                      placeholder="Badge (e.g. STEP 01)"
                      style={{ width: "100%", padding: "0.4rem", borderRadius: "6px", background: "#070B14", border: "1px solid #334155", color: "#F8FAFC", fontSize: "0.76rem" }}
                    />
                    <input
                      type="text"
                      value={card.title}
                      onChange={(e) => handleUpdateCard(card.id, { title: e.target.value })}
                      placeholder="Card Title"
                      style={{ width: "100%", padding: "0.4rem", borderRadius: "6px", background: "#070B14", border: "1px solid #334155", color: "#F8FAFC", fontSize: "0.8rem", fontWeight: 700 }}
                    />
                    <textarea
                      rows={2}
                      value={card.body}
                      onChange={(e) => handleUpdateCard(card.id, { body: e.target.value })}
                      placeholder="Card explanation"
                      style={{ width: "100%", padding: "0.4rem", borderRadius: "6px", background: "#070B14", border: "1px solid #334155", color: "#F8FAFC", fontSize: "0.76rem" }}
                    />
                    <input
                      type="text"
                      value={card.detail || ""}
                      onChange={(e) => handleUpdateCard(card.id, { detail: e.target.value })}
                      placeholder="Optional expandable tip / detail"
                      style={{ width: "100%", padding: "0.4rem", borderRadius: "6px", background: "#070B14", border: "1px solid #334155", color: "#F8FAFC", fontSize: "0.75rem" }}
                    />
                  </div>
                ))}

                {/* Hotspot Pins Editor */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.65rem" }}>
                  <span style={{ fontSize: "0.8rem", fontWeight: 900, color: "#FBBF24" }}>
                    Hotspot Pins ({currentSlide.hotspots.length})
                  </span>
                  <button
                    type="button"
                    onClick={handleAddHotspot}
                    style={{
                      background: "#FBBF24",
                      color: "#090D16",
                      border: "none",
                      borderRadius: "6px",
                      padding: "0.28rem 0.6rem",
                      fontSize: "0.73rem",
                      fontWeight: 900,
                      cursor: "pointer",
                    }}
                  >
                    + Add Pin
                  </button>
                </div>

                {currentSlide.hotspots.map((pin) => (
                  <div
                    key={pin.id}
                    style={{
                      background: "#0F172A",
                      border: "1px solid #334155",
                      borderRadius: "10px",
                      padding: "0.8rem",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.45rem",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <strong style={{ fontSize: "0.76rem", color: pin.color }}>
                        Pin #{pin.number} (X: {pin.xPercent}%, Y: {pin.yPercent}%)
                      </strong>
                      <button
                        type="button"
                        onClick={() => handleDeleteHotspot(pin.id)}
                        style={{ background: "transparent", border: "none", color: "#F43F5E", cursor: "pointer" }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <input
                      type="text"
                      value={pin.title}
                      onChange={(e) => handleUpdateHotspot(pin.id, { title: e.target.value })}
                      placeholder="Pin Title"
                      style={{ width: "100%", padding: "0.4rem", borderRadius: "6px", background: "#070B14", border: "1px solid #334155", color: "#F8FAFC", fontSize: "0.78rem", fontWeight: 700 }}
                    />
                    <textarea
                      rows={2}
                      value={pin.description}
                      onChange={(e) => handleUpdateHotspot(pin.id, { description: e.target.value })}
                      placeholder="Pin explanation"
                      style={{ width: "100%", padding: "0.4rem", borderRadius: "6px", background: "#070B14", border: "1px solid #334155", color: "#F8FAFC", fontSize: "0.75rem" }}
                    />
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
