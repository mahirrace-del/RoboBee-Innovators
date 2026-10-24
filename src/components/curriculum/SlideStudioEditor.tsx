"use client";

import React, { useState, useCallback, useEffect } from "react";
import {
  EditableClassDeck,
  EditableSlide,
  SlideElement,
  SlideColorTheme,
  normalizeDeckToFreeform,
  createBlankSlide,
  saveDeckToStorageAndCloud,
  THEME_PALETTE_CONFIG,
} from "@/lib/slideStudioStore";
import { TopRibbonBar } from "./freeform/TopRibbonBar";
import { SlideFilmstrip } from "./freeform/SlideFilmstrip";
import { FreeformSlideStage } from "./freeform/FreeformSlideStage";
import { InspectorPanel } from "./freeform/InspectorPanel";
import { useCanvasHistory } from "./freeform/useCanvasHistory";

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
  // Normalize deck so all slides immediately possess freeform coordinates (1280x720)
  const [deck, setDeck] = useState<EditableClassDeck>(() =>
    normalizeDeckToFreeform(initialDeck)
  );
  const [activeSlideIdx, setActiveSlideIdx] = useState<number>(0);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [saving, setSaving] = useState<boolean>(false);
  const [savedToast, setSavedToast] = useState<boolean>(false);

  const currentSlide: EditableSlide =
    deck.slides[activeSlideIdx] || deck.slides[0];
  const elements = currentSlide.elements || [];
  const selectedElement = elements.find((el) => el.id === selectedElementId) || null;

  const palette =
    THEME_PALETTE_CONFIG[currentSlide.theme || "robobee-dark"] ||
    THEME_PALETTE_CONFIG["robobee-dark"];

  // History hook for Undo/Redo & Clipboard
  const {
    pushState,
    undo,
    redo,
    canUndo,
    canRedo,
    copyElement,
    pasteElement,
  } = useCanvasHistory(elements);

  const relabelSlides = (slides: EditableSlide[]): EditableSlide[] =>
    slides.map((s, idx) => ({
      ...s,
      numberLabel: String(idx + 1).padStart(2, "0"),
    }));

  const updateCurrentSlide = useCallback(
    (patch: Partial<EditableSlide>) => {
      setDeck((prev) => {
        const nextSlides = [...prev.slides];
        nextSlides[activeSlideIdx] = {
          ...nextSlides[activeSlideIdx],
          ...patch,
        };
        return { ...prev, slides: nextSlides };
      });
    },
    [activeSlideIdx]
  );

  // Update specific element
  const handleUpdateElement = useCallback(
    (elementId: string, patch: Partial<SlideElement>) => {
      const nextElements = elements.map((el) =>
        el.id === elementId ? { ...el, ...patch } : el
      );
      updateCurrentSlide({ elements: nextElements });
      pushState(nextElements);
    },
    [elements, updateCurrentSlide, pushState]
  );

  // Update current slide elements array directly
  const handleUpdateElements = useCallback(
    (newElements: SlideElement[]) => {
      updateCurrentSlide({ elements: newElements });
      pushState(newElements);
    },
    [updateCurrentSlide, pushState]
  );

  // Undo / Redo handlers
  const handleUndo = () => {
    const prevElements = undo();
    if (prevElements) {
      updateCurrentSlide({ elements: prevElements });
    }
  };

  const handleRedo = () => {
    const nextElements = redo();
    if (nextElements) {
      updateCurrentSlide({ elements: nextElements });
    }
  };

  // Keyboard Copy / Paste / Undo / Redo listeners & Clipboard Image Paste (Ctrl+V)
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      const isInput =
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement;

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z" && !e.shiftKey) {
        if (!isInput) {
          e.preventDefault();
          handleUndo();
        }
      } else if (
        (e.ctrlKey || e.metaKey) &&
        (e.key.toLowerCase() === "y" || (e.key.toLowerCase() === "z" && e.shiftKey))
      ) {
        if (!isInput) {
          e.preventDefault();
          handleRedo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "c") {
        if (!isInput && selectedElement) {
          copyElement(selectedElement);
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "v") {
        if (!isInput) {
          const pasted = pasteElement();
          if (pasted) {
            handleUpdateElements([...elements, pasted]);
            setSelectedElementId(pasted.id);
          }
        }
      }
    };

    const handlePaste = (e: ClipboardEvent) => {
      const isInput =
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement;
      if (isInput) return;

      // 1. Check for clipboard image files
      const items = e.clipboardData?.items;
      if (items) {
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          if (item.type.indexOf("image") !== -1) {
            e.preventDefault();
            const file = item.getAsFile();
            if (file) {
              const reader = new FileReader();
              reader.onload = (uploadEvt) => {
                const url = uploadEvt.target?.result as string;
                if (url) {
                  const newEl: SlideElement = {
                    id: `el-img-${Date.now()}`,
                    type: "image",
                    x: 360,
                    y: 180,
                    width: 540,
                    height: 380,
                    zIndex: elements.length + 1,
                    content: url,
                    caption: "Pasted Clipboard Image",
                    style: {
                      borderRadius: 16,
                      borderColor: palette.cardBorder,
                      borderWidth: 1.5,
                      boxShadow: palette.cardShadow,
                      objectFit: "cover",
                    },
                  };
                  handleUpdateElements([...elements, newEl]);
                  setSelectedElementId(newEl.id);
                }
              };
              reader.readAsDataURL(file);
              return;
            }
          }
        }
      }

      // 2. Check if clipboard text is an image URL
      const text = e.clipboardData?.getData("text")?.trim();
      if (
        text &&
        (text.startsWith("http://") || text.startsWith("https://")) &&
        (text.match(/\.(png|jpg|jpeg|svg|webp|gif)($|\?)/i) ||
          text.includes("unsplash.com") ||
          text.includes("cloudinary.com"))
      ) {
        e.preventDefault();
        const newEl: SlideElement = {
          id: `el-img-${Date.now()}`,
          type: "image",
          x: 360,
          y: 180,
          width: 540,
          height: 380,
          zIndex: elements.length + 1,
          content: text,
          caption: "Pasted Image URL",
          style: {
            borderRadius: 16,
            borderColor: palette.cardBorder,
            borderWidth: 1.5,
            boxShadow: palette.cardShadow,
            objectFit: "cover",
          },
        };
        handleUpdateElements([...elements, newEl]);
        setSelectedElementId(newEl.id);
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    window.addEventListener("paste", handlePaste);
    return () => {
      window.removeEventListener("keydown", handleGlobalKeyDown);
      window.removeEventListener("paste", handlePaste);
    };
  }, [selectedElement, elements, copyElement, pasteElement, handleUpdateElements, palette]);

  // Save Deck
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

  // Export JSON
  const handleExportJson = () => {
    const dataStr =
      "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(deck, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute(
      "download",
      `${deck.id || "deck"}_robobee_slides.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import JSON
  const handleImportJson = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target?.result as string);
        if (parsed && Array.isArray(parsed.slides)) {
          const normalized = normalizeDeckToFreeform(parsed);
          setDeck(normalized);
          setActiveSlideIdx(0);
          saveDeckToStorageAndCloud(normalized);
          alert("Deck imported successfully!");
        } else {
          alert("Invalid deck JSON structure.");
        }
      } catch {
        alert("Failed to parse deck JSON.");
      }
    };
    reader.readAsText(file);
  };

  // Slide Filmstrip Actions
  const handleAddSlide = (presetKey: string = "blank") => {
    const newSlide = createBlankSlide(
      deck.slides.length + 1,
      currentSlide.theme || "robobee-dark"
    );

    if (presetKey !== "blank") {
      applyLayoutPresetToSlide(newSlide, presetKey);
    }

    const nextSlides = relabelSlides([
      ...deck.slides.slice(0, activeSlideIdx + 1),
      newSlide,
      ...deck.slides.slice(activeSlideIdx + 1),
    ]);
    setDeck((prev) => ({ ...prev, slides: nextSlides }));
    setActiveSlideIdx(activeSlideIdx + 1);
    setSelectedElementId(null);
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
    setSelectedElementId(null);
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

  // Insert Elements Tools
  const handleInsertHeading = () => {
    const newEl: SlideElement = {
      id: `el-heading-${Date.now()}`,
      type: "heading",
      x: 100,
      y: 120,
      width: 800,
      height: 60,
      zIndex: elements.length + 1,
      content: "Enter Big Bold Headline Here",
      style: {
        fontSize: 36,
        fontWeight: 900,
        color: palette.headingColor,
      },
    };
    handleUpdateElements([...elements, newEl]);
    setSelectedElementId(newEl.id);
  };

  const handleInsertSubheading = () => {
    const newEl: SlideElement = {
      id: `el-sub-${Date.now()}`,
      type: "subheading",
      x: 100,
      y: 190,
      width: 700,
      height: 40,
      zIndex: elements.length + 1,
      content: "Add your concise engineering explanation or classroom prompt here.",
      style: {
        fontSize: 18,
        fontWeight: 500,
        color: palette.mutedColor,
      },
    };
    handleUpdateElements([...elements, newEl]);
    setSelectedElementId(newEl.id);
  };

  const handleInsertTextBox = () => {
    const newEl: SlideElement = {
      id: `el-text-${Date.now()}`,
      type: "textbox",
      x: 100,
      y: 250,
      width: 500,
      height: 180,
      zIndex: elements.length + 1,
      content: "• First key engineering takeaway\n• Second key engineering takeaway\n• Third key takeaway or task checklist",
      style: {
        fontSize: 15,
        color: palette.bodyColor,
        lineHeight: 1.6,
      },
    };
    handleUpdateElements([...elements, newEl]);
    setSelectedElementId(newEl.id);
  };

  const handleInsertImages = (files: FileList) => {
    const fileList = Array.from(files);
    Promise.all(
      fileList.map(
        (file, idx) =>
          new Promise<SlideElement>((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
              const url = (e.target?.result as string) || "";
              resolve({
                id: `el-img-${Date.now()}-${idx}`,
                type: "image",
                x: 200 + idx * 40,
                y: 180 + idx * 40,
                width: 520,
                height: 360,
                zIndex: elements.length + 1 + idx,
                content: url,
                caption: file.name.replace(/\.[^/.]+$/, ""),
                style: {
                  borderRadius: 16,
                  borderColor: palette.cardBorder,
                  borderWidth: 1,
                  boxShadow: palette.cardShadow,
                  objectFit: "cover",
                },
              });
            };
            reader.readAsDataURL(file);
          })
      )
    ).then((newElements) => {
      if (newElements.length > 0) {
        handleUpdateElements([...elements, ...newElements]);
        setSelectedElementId(newElements[newElements.length - 1].id);
      }
    });
  };

  const handleInsertCodeBlock = () => {
    const newEl: SlideElement = {
      id: `el-code-${Date.now()}`,
      type: "code",
      x: 580,
      y: 200,
      width: 620,
      height: 440,
      zIndex: elements.length + 1,
      language: "cpp",
      content: `void setup() {\n  pinMode(13, OUTPUT);\n}\n\nvoid loop() {\n  digitalWrite(13, HIGH);\n  delay(1000);\n  digitalWrite(13, LOW);\n  delay(1000);\n}`,
      style: {
        fontSize: 13,
        borderRadius: 14,
        borderColor: "#2E374B",
      },
    };
    handleUpdateElements([...elements, newEl]);
    setSelectedElementId(newEl.id);
  };

  const handleInsertShape = (shapeType: "rectangle" | "circle" | "arrow-right") => {
    const newEl: SlideElement = {
      id: `el-shape-${Date.now()}`,
      type: "shape",
      shapeType,
      x: 200,
      y: 200,
      width: shapeType === "arrow-right" ? 180 : 120,
      height: shapeType === "arrow-right" ? 50 : 120,
      zIndex: elements.length + 1,
      content: "",
      style: {
        backgroundColor: shapeType === "arrow-right" ? "transparent" : "rgba(245, 183, 0, 0.2)",
        borderColor: "#F5B700",
        borderWidth: 2,
        borderRadius: shapeType === "circle" ? 999 : 12,
        color: "#F5B700",
      },
    };
    handleUpdateElements([...elements, newEl]);
    setSelectedElementId(newEl.id);
  };

  const handleInsertVideo = () => {
    const newEl: SlideElement = {
      id: `el-video-${Date.now()}`,
      type: "video",
      x: 580,
      y: 200,
      width: 600,
      height: 380,
      zIndex: elements.length + 1,
      content: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      caption: "Classroom Demo Video",
      style: {
        borderRadius: 16,
        borderColor: palette.cardBorder,
        borderWidth: 1,
      },
    };
    handleUpdateElements([...elements, newEl]);
    setSelectedElementId(newEl.id);
  };

  const handleInsertDiagram = () => {
    const newEl: SlideElement = {
      id: `el-diag-${Date.now()}`,
      type: "diagram",
      diagramType: "ultrasonic-radar",
      x: 360,
      y: 190,
      width: 620,
      height: 440,
      zIndex: elements.length + 1,
      content: "",
      caption: "Interactive Hardware Simulation",
      style: {
        borderRadius: 18,
        borderColor: palette.cardBorder,
        borderWidth: 1.5,
        boxShadow: palette.cardShadow,
      },
    };
    handleUpdateElements([...elements, newEl]);
    setSelectedElementId(newEl.id);
  };

  const handleInsertImageUrl = () => {
    const url = window.prompt("Enter direct image URL (PNG, JPG, SVG, WebP):");
    if (!url || !url.trim()) return;
    const cleanUrl = url.trim();
    const newEl: SlideElement = {
      id: `el-img-${Date.now()}`,
      type: "image",
      x: 360,
      y: 180,
      width: 540,
      height: 380,
      zIndex: elements.length + 1,
      content: cleanUrl,
      caption: "Web Image Visual",
      style: {
        borderRadius: 16,
        borderColor: palette.cardBorder,
        borderWidth: 1.5,
        boxShadow: palette.cardShadow,
        objectFit: "cover",
      },
    };
    handleUpdateElements([...elements, newEl]);
    setSelectedElementId(newEl.id);
  };

  // Layering & Ordering
  const handleBringToFront = () => {
    if (!selectedElement) return;
    const maxZ = elements.reduce((m, el) => Math.max(m, el.zIndex || 1), 1);
    handleUpdateElement(selectedElement.id, { zIndex: maxZ + 1 });
  };

  const handleSendToBack = () => {
    if (!selectedElement) return;
    const minZ = elements.reduce((m, el) => Math.min(m, el.zIndex || 1), 1);
    handleUpdateElement(selectedElement.id, { zIndex: Math.max(1, minZ - 1) });
  };

  const handleBringForward = () => {
    if (!selectedElement) return;
    const currentZ = selectedElement.zIndex || 1;
    handleUpdateElement(selectedElement.id, { zIndex: currentZ + 1 });
  };

  const handleSendBackward = () => {
    if (!selectedElement) return;
    const currentZ = selectedElement.zIndex || 1;
    handleUpdateElement(selectedElement.id, { zIndex: Math.max(1, currentZ - 1) });
  };

  const handleDuplicateElement = () => {
    if (!selectedElement) return;
    const cloned: SlideElement = {
      ...selectedElement,
      id: `el-${Date.now()}`,
      x: Math.min(1280 - selectedElement.width, selectedElement.x + 24),
      y: Math.min(720 - selectedElement.height, selectedElement.y + 24),
      zIndex: (selectedElement.zIndex || 1) + 1,
    };
    handleUpdateElements([...elements, cloned]);
    setSelectedElementId(cloned.id);
  };

  const handleToggleLockElement = () => {
    if (!selectedElement) return;
    handleUpdateElement(selectedElement.id, { locked: !selectedElement.locked });
  };

  const handleDeleteElement = () => {
    if (!selectedElement) return;
    handleUpdateElements(elements.filter((el) => el.id !== selectedElement.id));
    setSelectedElementId(null);
  };

  // Re-layout Presets Helper
  const applyLayoutPresetToSlide = (targetSlide: EditableSlide, presetKey: string) => {
    const pal =
      THEME_PALETTE_CONFIG[targetSlide.theme || "robobee-dark"] ||
      THEME_PALETTE_CONFIG["robobee-dark"];

    if (presetKey === "title") {
      targetSlide.elements = [
        {
          id: `el-badge-${Date.now()}`,
          type: "callout",
          x: 440,
          y: 120,
          width: 400,
          height: 36,
          zIndex: 1,
          content: "ROBOBEE INNOVATORS • MASTERCLASS",
          style: {
            fontSize: 13,
            fontWeight: 800,
            color: pal.badgeText,
            backgroundColor: pal.badgeBg,
            borderColor: pal.accentPrimary,
            borderWidth: 1,
            borderRadius: 999,
            textAlign: "center",
          },
        },
        {
          id: `el-title-${Date.now()}`,
          type: "heading",
          x: 100,
          y: 180,
          width: 1080,
          height: 100,
          zIndex: 2,
          content: targetSlide.title || "Welcome to Robotics Engineering",
          style: {
            fontSize: 48,
            fontWeight: 900,
            color: pal.headingColor,
            textAlign: "center",
          },
        },
        {
          id: `el-sub-${Date.now()}`,
          type: "subheading",
          x: 140,
          y: 290,
          width: 1000,
          height: 50,
          zIndex: 3,
          content: targetSlide.subtitle || "Build, Code, and Innovate with RoboBee",
          style: {
            fontSize: 20,
            color: pal.mutedColor,
            textAlign: "center",
          },
        },
        {
          id: `el-img-${Date.now()}`,
          type: "image",
          x: 240,
          y: 360,
          width: 800,
          height: 320,
          zIndex: 4,
          content:
            targetSlide.heroImage ||
            "/illustrations/class1-external-blink-wiring.svg",
          caption: "RoboBee Laboratory Workbench",
          style: {
            borderRadius: 18,
            objectFit: "cover",
            borderColor: pal.cardBorder,
            borderWidth: 1,
            boxShadow: pal.cardShadow,
          },
        },
      ];
    } else if (presetKey === "code-split") {
      targetSlide.elements = [
        {
          id: `el-title-${Date.now()}`,
          type: "heading",
          x: 60,
          y: 50,
          width: 1160,
          height: 50,
          zIndex: 1,
          content: targetSlide.title || "Circuit & Arduino Code Lab",
          style: { fontSize: 32, fontWeight: 900, color: pal.headingColor },
        },
        {
          id: `el-img-${Date.now()}`,
          type: "image",
          x: 60,
          y: 120,
          width: 550,
          height: 540,
          zIndex: 2,
          content:
            targetSlide.heroImage ||
            "/illustrations/class1-external-blink-wiring.svg",
          caption: "Point-to-point breadboard wiring diagram",
          style: {
            borderRadius: 16,
            objectFit: "contain",
            backgroundColor: "rgba(0,0,0,0.3)",
            borderColor: pal.cardBorder,
            borderWidth: 1,
          },
        },
        {
          id: `el-code-${Date.now()}`,
          type: "code",
          x: 640,
          y: 120,
          width: 580,
          height: 540,
          zIndex: 3,
          language: "cpp",
          content: `// RoboBee Innovators Lab Code\nvoid setup() {\n  pinMode(13, OUTPUT);\n}\n\nvoid loop() {\n  digitalWrite(13, HIGH);\n  delay(1000);\n  digitalWrite(13, LOW);\n  delay(1000);\n}`,
          style: { fontSize: 13, borderRadius: 16 },
        },
      ];
    } else if (presetKey === "gallery") {
      targetSlide.elements = [
        {
          id: `el-title-${Date.now()}`,
          type: "heading",
          x: 60,
          y: 50,
          width: 1160,
          height: 50,
          zIndex: 1,
          content: targetSlide.title || "Lab Photo Gallery",
          style: { fontSize: 32, fontWeight: 900, color: pal.headingColor },
        },
        {
          id: `el-img-1-${Date.now()}`,
          type: "image",
          x: 60,
          y: 140,
          width: 360,
          height: 500,
          zIndex: 2,
          content:
            "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
          caption: "Workbench & Sensors",
          style: { borderRadius: 14, objectFit: "cover" },
        },
        {
          id: `el-img-2-${Date.now()}`,
          type: "image",
          x: 460,
          y: 140,
          width: 360,
          height: 500,
          zIndex: 3,
          content:
            "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80",
          caption: "Code Meets Hardware",
          style: { borderRadius: 14, objectFit: "cover" },
        },
        {
          id: `el-img-3-${Date.now()}`,
          type: "image",
          x: 860,
          y: 140,
          width: 360,
          height: 500,
          zIndex: 4,
          content:
            "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80",
          caption: "Competition Arena",
          style: { borderRadius: 14, objectFit: "cover" },
        },
      ];
    }
  };

  const handleApplyLayoutPreset = (presetKey: string) => {
    const updated = { ...currentSlide };
    applyLayoutPresetToSlide(updated, presetKey);
    updateCurrentSlide(updated);
    pushState(updated.elements || []);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        backgroundColor: "#0B0E14",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* ZONE A: TOP POWERPOINT RIBBON BAR (56px) */}
      <TopRibbonBar
        deckTitle={deck.title}
        onUpdateDeckTitle={(newTitle) => setDeck((p) => ({ ...p, title: newTitle }))}
        courseBadge={deck.classCode || "RoboBee Studio"}
        onClose={onClose}
        onSave={handleSave}
        isSaving={saving}
        savedToast={savedToast}
        onLaunchProjector={() => onLaunchProjector(deck, activeSlideIdx)}
        onUndo={handleUndo}
        onRedo={handleRedo}
        canUndo={canUndo}
        canRedo={canRedo}
        onExportJson={handleExportJson}
        onImportJson={handleImportJson}
        onResetSlide={() => handleApplyLayoutPreset("hardware-2col")}
        onInsertHeading={handleInsertHeading}
        onInsertSubheading={handleInsertSubheading}
        onInsertTextBox={handleInsertTextBox}
        onInsertImages={handleInsertImages}
        onInsertImageUrl={handleInsertImageUrl}
        onInsertCodeBlock={handleInsertCodeBlock}
        onInsertDiagram={handleInsertDiagram}
        onInsertShape={handleInsertShape}
        onInsertVideo={handleInsertVideo}
        selectedElement={selectedElement}
        onUpdateSelectedElement={(patch) => {
          if (selectedElement) handleUpdateElement(selectedElement.id, patch);
        }}
        onBringForward={handleBringForward}
        onSendBackward={handleSendBackward}
        onBringToFront={handleBringToFront}
        onSendToBack={handleSendToBack}
        onDuplicateElement={handleDuplicateElement}
        onToggleLockElement={handleToggleLockElement}
        onDeleteElement={handleDeleteElement}
      />

      {/* WORKSPACE: LEFT FILMSTRIP (Zone B) + CENTER CANVAS (Zone C) + RIGHT INSPECTOR (Zone D) */}
      <div
        style={{
          flex: 1,
          display: "flex",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* ZONE B: LEFT FILMSTRIP (240px) */}
        <SlideFilmstrip
          slides={deck.slides}
          activeSlideIdx={activeSlideIdx}
          onSelectSlide={(idx) => {
            setActiveSlideIdx(idx);
            setSelectedElementId(null);
          }}
          onAddSlide={handleAddSlide}
          onDuplicateSlide={handleDuplicateSlide}
          onDeleteSlide={handleDeleteSlide}
          onMoveSlide={handleMoveSlide}
        />

        {/* ZONE C: CENTER 16:9 FREEFORM STAGE */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <FreeformSlideStage
            slide={currentSlide}
            mode="editor"
            selectedElementId={selectedElementId}
            onSelectElement={(id) => setSelectedElementId(id)}
            onUpdateElement={handleUpdateElement}
            onUpdateSlide={updateCurrentSlide}
          />
        </div>

        {/* ZONE D: RIGHT INSPECTOR PANEL (300px) */}
        <InspectorPanel
          slide={currentSlide}
          selectedElement={selectedElement}
          onUpdateElement={handleUpdateElement}
          onUpdateSlide={updateCurrentSlide}
          onApplyLayoutPreset={handleApplyLayoutPreset}
        />
      </div>
    </div>
  );
}
