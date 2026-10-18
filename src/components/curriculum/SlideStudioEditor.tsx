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
  const [inspectorTab, setInspectorTab] = useState<"text" | "media" | "elements">("text");
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [saving, setSaving] = useState<boolean>(false);
  const [savedToast, setSavedToast] = useState<boolean>(false);

  const currentSlide: EditableSlide = deck.slides[activeSlideIdx] || deck.slides[0];
  const palette = THEME_PALETTE_CONFIG[currentSlide?.theme || "electric-indigo"];

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
    const newSlide = createBlankSlide(deck.slides.length + 1, currentSlide?.theme || "electric-indigo");
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
    setInspectorTab("elements");
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
      color: "#FBBF24",
    };
    updateCurrentSlide({
      layout: "interactive-hotspot",
      hotspots: [...currentSlide.hotspots, newPin],
    });
    setSelectedElementId(newPin.id);
    setInspectorTab("elements");
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
      url: "https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=1200&q=80",
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
        background: "#070B14",
        color: "#F8FAFC",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* =================================================================== */}
      {/* TOP POWERPOINT / CANVA RIBBON TOOLBAR */}
      {/* =================================================================== */}
      <div
        style={{
          height: "66px",
          background: "#0F172A",
          borderBottom: "1px solid #1E293B",
          padding: "0 1.25rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
          flexShrink: 0,
        }}
      >
        {/* Left: Back + Class Title */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: "#1E293B",
              color: "#E2E8F0",
              border: "1px solid #334155",
              borderRadius: "10px",
              padding: "0.5rem 0.9rem",
              fontSize: "0.82rem",
              fontWeight: 800,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
            }}
          >
            <ArrowLeft size={15} /> Back to Class Hub
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span
              style={{
                background: "rgba(0, 245, 212, 0.15)",
                border: "1px solid #00F5D4",
                color: "#00F5D4",
                padding: "0.25rem 0.65rem",
                borderRadius: "6px",
                fontSize: "0.75rem",
                fontWeight: 900,
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
                fontSize: "1rem",
                fontWeight: 900,
                padding: "0.25rem 0.5rem",
                borderRadius: "6px",
                width: "310px",
              }}
              title="Click to rename class presentation title"
            />
          </div>
        </div>

        {/* Center: Quick Formatting Ribbon (Theme, Layout, Font, Size, Alignment, Animation) */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.55rem", flexWrap: "wrap" }}>
          {/* Theme Picker */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", background: "#1E293B", padding: "0.3rem 0.6rem", borderRadius: "8px", border: "1px solid #334155" }}>
            <Palette size={14} color="#38BDF8" />
            <select
              value={currentSlide.theme}
              onChange={(e) => updateCurrentSlide({ theme: e.target.value as SlideColorTheme })}
              style={{ background: "#1E293B", color: "#F8FAFC", border: "none", fontSize: "0.78rem", fontWeight: 800, cursor: "pointer" }}
              title="Slide Color Palette"
            >
              <option value="electric-indigo">Theme: Electric Indigo</option>
              <option value="daylight-studio">Theme: Daylight Studio (White)</option>
              <option value="arduino-teal">Theme: Arduino Teal</option>
              <option value="cyber-blueprint">Theme: Cyber Blueprint</option>
            </select>
          </div>

          {/* Layout Picker */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", background: "#1E293B", padding: "0.3rem 0.6rem", borderRadius: "8px", border: "1px solid #334155" }}>
            <Layout size={14} color="#00F5D4" />
            <select
              value={currentSlide.layout}
              onChange={(e) =>
                updateCurrentSlide({ layout: e.target.value as EditableSlide["layout"] })
              }
              style={{ background: "#1E293B", color: "#F8FAFC", border: "none", fontSize: "0.78rem", fontWeight: 800, cursor: "pointer" }}
              title="Slide Layout Template"
            >
              <option value="hero-title">Layout: Hero Title Banner</option>
              <option value="split-media">Layout: Split Media + Cards</option>
              <option value="interactive-grid">Layout: Interactive Bento Grid</option>
              <option value="timeline-stepper">Layout: Timeline Stepper</option>
              <option value="interactive-hotspot">Layout: Hardware Hotspot Pins</option>
              <option value="photo-gallery">Layout: Multi-Photo Gallery</option>
            </select>
          </div>

          {/* Font Family Picker */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", background: "#1E293B", padding: "0.3rem 0.6rem", borderRadius: "8px", border: "1px solid #334155" }}>
            <Type size={14} color="#FBBF24" />
            <select
              value={currentSlide.fontFamily || "sans"}
              onChange={(e) =>
                updateCurrentSlide({ fontFamily: e.target.value as EditableSlide["fontFamily"] })
              }
              style={{ background: "#1E293B", color: "#F8FAFC", border: "none", fontSize: "0.78rem", fontWeight: 800, cursor: "pointer" }}
              title="Font Family"
            >
              <option value="sans">Font: Inter Sans</option>
              <option value="display">Font: Space Display</option>
              <option value="mono">Font: Technical Mono</option>
              <option value="serif">Font: Editorial Serif</option>
            </select>
          </div>

          {/* Title Size Picker */}
          <select
            value={currentSlide.titleSize || "standard"}
            onChange={(e) =>
              updateCurrentSlide({ titleSize: e.target.value as EditableSlide["titleSize"] })
            }
            style={{ background: "#1E293B", color: "#F8FAFC", border: "1px solid #334155", padding: "0.35rem 0.55rem", borderRadius: "8px", fontSize: "0.78rem", fontWeight: 800, cursor: "pointer" }}
            title="Headline Size"
          >
            <option value="compact">Size: Compact</option>
            <option value="standard">Size: Standard</option>
            <option value="large">Size: Large</option>
            <option value="hero">Size: Hero XL</option>
          </select>

          {/* Alignment Buttons */}
          <div style={{ display: "inline-flex", background: "#1E293B", borderRadius: "8px", border: "1px solid #334155", overflow: "hidden" }}>
            <button
              type="button"
              onClick={() => updateCurrentSlide({ textAlign: "left" })}
              style={{
                background: currentSlide.textAlign !== "center" ? "#38BDF8" : "transparent",
                color: currentSlide.textAlign !== "center" ? "#090D16" : "#CBD5E1",
                border: "none",
                padding: "0.35rem 0.5rem",
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
                background: currentSlide.textAlign === "center" ? "#38BDF8" : "transparent",
                color: currentSlide.textAlign === "center" ? "#090D16" : "#CBD5E1",
                border: "none",
                padding: "0.35rem 0.5rem",
                cursor: "pointer",
              }}
              title="Align Center"
            >
              <AlignCenter size={14} />
            </button>
          </div>

          {/* Animation Picker */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", background: "#1E293B", padding: "0.3rem 0.6rem", borderRadius: "8px", border: "1px solid #334155" }}>
            <Sparkles size={14} color="#A855F7" />
            <select
              value={currentSlide.animation || "fade-up"}
              onChange={(e) =>
                updateCurrentSlide({ animation: e.target.value as EditableSlide["animation"] })
              }
              style={{ background: "#1E293B", color: "#F8FAFC", border: "none", fontSize: "0.78rem", fontWeight: 800, cursor: "pointer" }}
              title="Slide Entrance Animation"
            >
              <option value="fade-up">Anim: Fade &amp; Rise</option>
              <option value="zoom-in">Anim: Keynote Zoom</option>
              <option value="slide-right">Anim: Slide Glide</option>
              <option value="cyber-glow">Anim: Cyber Pulse</option>
              <option value="none">Anim: Instant</option>
            </select>
          </div>
        </div>

        {/* Right: Present & Save Buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
          <button
            type="button"
            onClick={async () => {
              await saveDeckToStorageAndCloud(deck);
              onSaveDeck?.(deck);
              onDeckSaved?.(deck);
              onLaunchProjector(deck, activeSlideIdx);
            }}
            style={{
              background: "#1E293B",
              color: "#38BDF8",
              border: "1px solid #38BDF8",
              borderRadius: "10px",
              padding: "0.52rem 0.95rem",
              fontSize: "0.82rem",
              fontWeight: 900,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
            }}
          >
            <Tv size={15} /> Present Slide {currentSlide.numberLabel}
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            style={{
              background: savedToast
                ? "#10B981"
                : "linear-gradient(135deg, #00F5D4 0%, #38BDF8 100%)",
              color: "#090D16",
              border: "none",
              borderRadius: "10px",
              padding: "0.55rem 1.15rem",
              fontSize: "0.85rem",
              fontWeight: 900,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              boxShadow: "0 6px 20px rgba(0, 245, 212, 0.25)",
            }}
          >
            {savedToast ? <Check size={16} /> : <Save size={16} />}
            {savedToast ? "Saved!" : saving ? "Saving..." : "Save Deck"}
          </button>
        </div>
      </div>

      {/* =================================================================== */}
      {/* 3-COLUMN WORKSPACE: LEFT FILMSTRIP | CENTER STAGE | RIGHT INSPECTOR */}
      {/* =================================================================== */}
      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "250px 1fr 370px", overflow: "hidden" }}>
        {/* 1. LEFT SIDEBAR: SLIDE FILMSTRIP & SORTER */}
        <div
          style={{
            background: "#0B1120",
            borderRight: "1px solid #1E293B",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "0.85rem 1rem",
              borderBottom: "1px solid #1E293B",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: "0.78rem", fontWeight: 900, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Slides ({deck.slides.length})
            </span>
            <button
              type="button"
              onClick={handleAddSlide}
              style={{
                background: "#00F5D4",
                color: "#090D16",
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
              const sPalette = THEME_PALETTE_CONFIG[s.theme];
              return (
                <div
                  key={s.id}
                  onClick={() => setActiveSlideIdx(idx)}
                  style={{
                    background: isSelected ? "#1E293B" : "#0F172A",
                    border: `2px solid ${isSelected ? "#00F5D4" : "#1E293B"}`,
                    borderRadius: "12px",
                    padding: "0.65rem",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
                    <span
                      style={{
                        fontSize: "0.7rem",
                        fontWeight: 900,
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
                        style={{ background: "transparent", border: "none", color: "#38BDF8", cursor: "pointer", padding: "2px" }}
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
                  <div style={{ fontSize: "0.68rem", color: "#64748B", marginTop: "0.25rem", textTransform: "uppercase", fontWeight: 700 }}>
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
            background: "#050811",
            overflowY: "auto",
            padding: "1.75rem",
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
              marginBottom: "1rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "0.5rem",
            }}
          >
            <div style={{ fontSize: "0.8rem", color: "#94A3B8", fontWeight: 700 }}>
              Editing <strong>Slide {currentSlide.numberLabel} of {String(deck.slides.length).padStart(2, "0")}</strong> • Theme: <strong style={{ color: "#38BDF8" }}>{palette.name}</strong>
            </div>

            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={handleAddCard}
                style={{
                  background: "#1E293B",
                  color: "#00F5D4",
                  border: "1px solid #00F5D4",
                  borderRadius: "8px",
                  padding: "0.38rem 0.75rem",
                  fontSize: "0.76rem",
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
                  background: "#1E293B",
                  color: "#38BDF8",
                  border: "1px solid #38BDF8",
                  borderRadius: "8px",
                  padding: "0.38rem 0.75rem",
                  fontSize: "0.76rem",
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
                  background: "#1E293B",
                  color: "#FBBF24",
                  border: "1px solid #FBBF24",
                  borderRadius: "8px",
                  padding: "0.38rem 0.75rem",
                  fontSize: "0.76rem",
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
              borderRadius: "24px",
              padding: "2.25rem",
              boxShadow: "0 28px 70px rgba(0, 0, 0, 0.65)",
            }}
          >
            <EditableSlideCanvas
              slide={currentSlide}
              isEditorMode={true}
              onUpdateSlide={(updated) => updateCurrentSlide(updated)}
              selectedElementId={selectedElementId}
              onSelectElement={(id) => {
                setSelectedElementId(id);
                setInspectorTab("elements");
              }}
            />
          </div>
        </div>

        {/* 3. RIGHT SIDEBAR: INSPECTOR PANEL (TEXT, MULTI-PHOTO GALLERY, CARDS & HOTSPOTS) */}
        <div
          style={{
            background: "#0B1120",
            borderLeft: "1px solid #1E293B",
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
              borderBottom: "1px solid #1E293B",
              background: "#0F172A",
            }}
          >
            <button
              type="button"
              onClick={() => setInspectorTab("text")}
              style={{
                background: inspectorTab === "text" ? "#1E293B" : "transparent",
                color: inspectorTab === "text" ? "#00F5D4" : "#94A3B8",
                border: "none",
                borderBottom: inspectorTab === "text" ? "2px solid #00F5D4" : "2px solid transparent",
                padding: "0.75rem 0.4rem",
                fontSize: "0.76rem",
                fontWeight: 900,
                cursor: "pointer",
              }}
            >
              1. Text &amp; Notes
            </button>
            <button
              type="button"
              onClick={() => setInspectorTab("media")}
              style={{
                background: inspectorTab === "media" ? "#1E293B" : "transparent",
                color: inspectorTab === "media" ? "#38BDF8" : "#94A3B8",
                border: "none",
                borderBottom: inspectorTab === "media" ? "2px solid #38BDF8" : "2px solid transparent",
                padding: "0.75rem 0.4rem",
                fontSize: "0.76rem",
                fontWeight: 900,
                cursor: "pointer",
              }}
            >
              2. Photos ({1 + (currentSlide.galleryImages?.length || 0)})
            </button>
            <button
              type="button"
              onClick={() => setInspectorTab("elements")}
              style={{
                background: inspectorTab === "elements" ? "#1E293B" : "transparent",
                color: inspectorTab === "elements" ? "#FBBF24" : "#94A3B8",
                border: "none",
                borderBottom: inspectorTab === "elements" ? "2px solid #FBBF24" : "2px solid transparent",
                padding: "0.75rem 0.4rem",
                fontSize: "0.76rem",
                fontWeight: 900,
                cursor: "pointer",
              }}
            >
              3. Cards ({currentSlide.cards.length + currentSlide.hotspots.length})
            </button>
          </div>

          {/* Inspector Scroll Body */}
          <div style={{ flex: 1, overflowY: "auto", padding: "1.1rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
            {/* TAB 1: SLIDE HEADLINES & SPEAKER NOTES */}
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
                    style={{ width: "100%", padding: "0.55rem 0.7rem", borderRadius: "8px", background: "#0F172A", border: "1px solid #334155", color: "#F8FAFC", fontSize: "0.84rem" }}
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
                    style={{ width: "100%", padding: "0.55rem 0.7rem", borderRadius: "8px", background: "#0F172A", border: "1px solid #334155", color: "#F8FAFC", fontSize: "0.9rem", fontWeight: 700 }}
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
                    style={{ width: "100%", padding: "0.55rem 0.7rem", borderRadius: "8px", background: "#0F172A", border: "1px solid #334155", color: "#F8FAFC", fontSize: "0.84rem" }}
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
                      placeholder="e.g. Launch Class Engine ➔"
                      style={{ width: "100%", padding: "0.55rem 0.7rem", borderRadius: "8px", background: "#0F172A", border: "1px solid #334155", color: "#F8FAFC", fontSize: "0.84rem" }}
                    />
                  </div>
                )}

                <div>
                  <label style={{ display: "block", fontSize: "0.74rem", fontWeight: 800, color: "#FBBF24", marginBottom: "0.3rem" }}>
                    Instructor Speaker Notes (Shown in Presenter Dock)
                  </label>
                  <textarea
                    rows={5}
                    value={currentSlide.speakerNotes}
                    onChange={(e) => updateCurrentSlide({ speakerNotes: e.target.value })}
                    style={{ width: "100%", padding: "0.55rem 0.7rem", borderRadius: "8px", background: "#0F172A", border: "1px solid #334155", color: "#F8FAFC", fontSize: "0.82rem", lineHeight: 1.5 }}
                  />
                </div>
              </>
            )}

            {/* TAB 2: PRIMARY PHOTO & MULTI-IMAGE GALLERY */}
            {inspectorTab === "media" && (
              <>
                <div style={{ background: "#0F172A", border: "1px solid #1E293B", borderRadius: "12px", padding: "0.9rem" }}>
                  <div style={{ fontSize: "0.78rem", fontWeight: 900, color: "#38BDF8", marginBottom: "0.5rem" }}>
                    Primary Slide Photo / Diagram
                  </div>
                  <label style={{ display: "block", fontSize: "0.72rem", color: "#94A3B8", marginBottom: "0.25rem" }}>
                    Image URL or SVG Path
                  </label>
                  <input
                    type="text"
                    value={currentSlide.heroImage}
                    onChange={(e) => updateCurrentSlide({ heroImage: e.target.value })}
                    style={{ width: "100%", padding: "0.5rem", borderRadius: "6px", background: "#070B14", border: "1px solid #334155", color: "#F8FAFC", fontSize: "0.8rem", marginBottom: "0.5rem" }}
                  />

                  <label
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.4rem",
                      background: "#1E293B",
                      color: "#00F5D4",
                      border: "1px solid #00F5D4",
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
                    Caption Bar Text
                  </label>
                  <input
                    type="text"
                    value={currentSlide.imageCaption}
                    onChange={(e) => updateCurrentSlide({ imageCaption: e.target.value })}
                    style={{ width: "100%", padding: "0.5rem", borderRadius: "6px", background: "#070B14", border: "1px solid #334155", color: "#F8FAFC", fontSize: "0.8rem" }}
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
                      background: "#38BDF8",
                      color: "#090D16",
                      border: "none",
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
                      background: "#0F172A",
                      border: "1px solid #334155",
                      borderRadius: "10px",
                      padding: "0.8rem",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
                      <strong style={{ fontSize: "0.76rem", color: "#00F5D4" }}>Gallery Photo #{i + 2}</strong>
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
                      style={{ width: "100%", padding: "0.45rem", borderRadius: "6px", background: "#070B14", border: "1px solid #334155", color: "#F8FAFC", fontSize: "0.78rem", marginBottom: "0.4rem" }}
                    />
                    <label
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.3rem",
                        background: "#1E293B",
                        color: "#38BDF8",
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
                      style={{ width: "100%", padding: "0.45rem", borderRadius: "6px", background: "#070B14", border: "1px solid #334155", color: "#F8FAFC", fontSize: "0.78rem" }}
                    />
                  </div>
                ))}
              </>
            )}

            {/* TAB 3: CARDS & HOTSPOT PINS */}
            {inspectorTab === "elements" && (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "0.8rem", fontWeight: 900, color: "#00F5D4" }}>
                    Slide Cards ({currentSlide.cards.length})
                  </span>
                  <button
                    type="button"
                    onClick={handleAddCard}
                    style={{
                      background: "#00F5D4",
                      color: "#090D16",
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
