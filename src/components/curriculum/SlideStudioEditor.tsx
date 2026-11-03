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
import {
  ROBOBEE_HARDWARE_ASSET_LIBRARY,
  HardwareVisualAsset,
} from "@/lib/hardwareAssetLibrary";
import {
  downloadFrontendSlidesDeck,
  openFrontendSlidesInNewTab,
} from "@/lib/frontendSlidesExporter";

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
  const [showHardwareLibrary, setShowHardwareLibrary] = useState<boolean>(false);
  const [hwCategoryFilter, setHwCategoryFilter] = useState<
    "ALL" | HardwareVisualAsset["category"]
  >("ALL");

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
    } else if (presetKey === "3band-challenge") {
      targetSlide.elements = [
        {
          id: `el-badge-${Date.now()}`,
          type: "callout",
          x: 60,
          y: 38,
          width: 480,
          height: 32,
          zIndex: 1,
          content: `${deck.classCode} • 3-BAND DIFFERENTIATED SPRINT (CLASS 3–12)`,
          style: {
            fontSize: 12,
            fontWeight: 800,
            color: pal.badgeText,
            backgroundColor: pal.badgeBg,
            borderColor: pal.accentPrimary,
            borderWidth: 1,
            borderRadius: 999,
            padding: "6px 14px",
            textAlign: "center",
          },
        },
        {
          id: `el-title-${Date.now()}`,
          type: "heading",
          x: 60,
          y: 78,
          width: 1160,
          height: 54,
          zIndex: 2,
          content: "3-Band Differentiated Friday Lab Sprint (Class 3 to Class 12)",
          style: { fontSize: 32, fontWeight: 900, color: pal.headingColor },
        },
        {
          id: `el-sub-${Date.now()}`,
          type: "subheading",
          x: 60,
          y: 138,
          width: 1160,
          height: 38,
          zIndex: 3,
          content:
            "Stage 4 (5:15–5:45 PM • 30 Mins): Every student builds the core hardware first, then tackles their age-band challenge!",
          style: { fontSize: 16, color: pal.mutedColor },
        },
        {
          id: `el-band-a-${Date.now()}`,
          type: "callout",
          x: 60,
          y: 195,
          width: 370,
          height: 465,
          zIndex: 4,
          badgeText: "BAND A • CLASS 3–5 (WONDER BUILDERS)",
          content: `### Guided Tactile & Visual Challenge\n\n${
            deck.bandChallenges?.bandA ||
            "Complete the core breadboard wiring with color-coded jumpers and pass 3 bench trials."
          }`,
          style: {
            backgroundColor: pal.cardBg,
            borderColor: "#F5B800",
            borderWidth: 2,
            borderRadius: 18,
            padding: "22px",
            color: pal.bodyColor,
            boxShadow: pal.cardShadow,
          },
        },
        {
          id: `el-band-b-${Date.now()}`,
          type: "callout",
          x: 455,
          y: 195,
          width: 370,
          height: 465,
          zIndex: 5,
          badgeText: "BAND B • CLASS 6–8 (TACTICAL MAKERS)",
          content: `### Core Logic & Parameter Tuning\n\n${
            deck.bandChallenges?.bandB ||
            "Customize C++ timing/threshold constants and complete the timed arena challenge."
          }`,
          style: {
            backgroundColor: pal.cardBg,
            borderColor: "#00F5D4",
            borderWidth: 2,
            borderRadius: 18,
            padding: "22px",
            color: pal.bodyColor,
            boxShadow: pal.cardShadow,
          },
        },
        {
          id: `el-band-c-${Date.now()}`,
          type: "callout",
          x: 850,
          y: 195,
          width: 370,
          height: 465,
          zIndex: 6,
          badgeText: "BAND C • CLASS 9–12 (SYSTEMS ENGINEERS)",
          content: `### Advanced Algorithm & Telemetry\n\n${
            deck.bandChallenges?.bandC ||
            "Implement custom C++ helper functions, log empirical multimeter/serial measurements, and defend your design."
          }`,
          style: {
            backgroundColor: pal.cardBg,
            borderColor: "#F43F5E",
            borderWidth: 2,
            borderRadius: 18,
            padding: "22px",
            color: pal.bodyColor,
            boxShadow: pal.cardShadow,
          },
        },
      ];
    }
  };

  const handleInsertHardwareAsset = (
    asset: HardwareVisualAsset,
    replaceSelected: boolean = false
  ) => {
    if (replaceSelected && selectedElement && selectedElement.type === "image") {
      handleUpdateElement(selectedElement.id, {
        content: asset.url,
        caption: asset.caption,
        style: {
          ...selectedElement.style,
          objectFit: asset.url.endsWith(".svg") ? "contain" : "cover",
        },
      });
      setShowHardwareLibrary(false);
      return;
    }

    const newEl: SlideElement = {
      id: `el-hw-${Date.now()}`,
      type: "image",
      x: 620,
      y: 195,
      width: 580,
      height: 450,
      zIndex: elements.length + 1,
      content: asset.url,
      caption: asset.caption,
      style: {
        borderRadius: 18,
        borderColor: palette.cardBorder,
        borderWidth: 1.5,
        boxShadow: palette.cardShadow,
        objectFit: asset.url.endsWith(".svg") ? "contain" : "cover",
        backgroundColor: asset.url.endsWith(".svg")
          ? "rgba(10, 15, 28, 0.75)"
          : "transparent",
        padding: asset.url.endsWith(".svg") ? "12px" : 0,
      },
    };
    handleUpdateElements([...elements, newEl]);
    setSelectedElementId(newEl.id);
    setShowHardwareLibrary(false);
  };

  const handleInsertPinoutFromAsset = (asset: HardwareVisualAsset) => {
    const newEl: SlideElement = {
      id: `el-pinout-${Date.now()}`,
      type: "pinout-card",
      x: 600,
      y: 195,
      width: 620,
      height: 460,
      zIndex: elements.length + 1,
      content: "",
      caption: `${asset.name.toUpperCase()} PINOUT MAP`,
      pinItems: asset.defaultPins || [
        { number: 1, label: "VCC / Power", pinName: "5V / VCC", note: asset.pinSummary || "Power supply" },
        { number: 2, label: "GND", pinName: "Common GND", note: "0V common reference" },
      ],
      style: {
        backgroundColor: palette.cardBg,
        borderColor: palette.cardBorder,
        borderWidth: 1.5,
        borderRadius: 18,
        boxShadow: palette.cardShadow,
        padding: "16px 18px",
      },
    };
    handleUpdateElements([...elements, newEl]);
    setSelectedElementId(newEl.id);
    setShowHardwareLibrary(false);
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
        onOpenHardwareLibrary={() => setShowHardwareLibrary(true)}
        onInsertCodeBlock={handleInsertCodeBlock}
        onInsertDiagram={handleInsertDiagram}
        onInsertShape={handleInsertShape}
        onInsertVideo={handleInsertVideo}
        onExportFrontendSlidesHtml={() => downloadFrontendSlidesDeck(deck)}
        onOpenFrontendSlidesPlayer={() => openFrontendSlidesInNewTab(deck)}
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

      {/* HARDWARE, SCHEMATICS & LAB PHOTO LIBRARY MODAL */}
      {showHardwareLibrary && (
        <div
          onClick={() => setShowHardwareLibrary(false)}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(7, 10, 18, 0.85)",
            backdropFilter: "blur(10px)",
            zIndex: 10050,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: "1080px",
              maxHeight: "86vh",
              backgroundColor: "#111622",
              border: "1.5px solid #F5B800",
              borderRadius: "18px",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              boxShadow: "0 28px 80px rgba(0, 0, 0, 0.8)",
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: "16px 22px",
                backgroundColor: "#0B0E17",
                borderBottom: "1px solid #1E293B",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "12px",
                flexWrap: "wrap",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: 900,
                    color: "#F5B800",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  ROBOBEE SLIDE STUDIO • HARDWARE &amp; VISUAL ASSET LIBRARY
                </div>
                <h3 style={{ margin: "2px 0 0 0", fontSize: "18px", fontWeight: 900, color: "#FFFFFF" }}>
                  Insert Robotics Components, Wiring Diagrams, Pinouts &amp; Lab Photos
                </h3>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <button
                  type="button"
                  onClick={() => handleApplyLayoutPreset("3band-challenge")}
                  style={{
                    background: "rgba(0, 245, 212, 0.14)",
                    border: "1px solid #00F5D4",
                    color: "#00F5D4",
                    padding: "7px 12px",
                    borderRadius: "8px",
                    fontSize: "12px",
                    fontWeight: 800,
                    cursor: "pointer",
                  }}
                >
                  + Apply 3-Band Challenge Layout (Class 3–12)
                </button>
                <button
                  type="button"
                  onClick={() => setShowHardwareLibrary(false)}
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.16)",
                    color: "#E2E8F0",
                    padding: "7px 12px",
                    borderRadius: "8px",
                    fontSize: "12px",
                    fontWeight: 800,
                    cursor: "pointer",
                  }}
                >
                  ✕ Close
                </button>
              </div>
            </div>

            {/* Category Filter Tabs */}
            <div
              style={{
                padding: "12px 22px",
                backgroundColor: "#141A29",
                borderBottom: "1px solid #1E293B",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                flexWrap: "wrap",
              }}
            >
              {[
                { id: "ALL", label: "All Visuals (23)" },
                { id: "wiring_schematics", label: "Wiring Schematics" },
                { id: "microcontrollers", label: "Arduino / ESP32 / Power" },
                { id: "sensors", label: "Sensors & Sonar" },
                { id: "motors", label: "Motors, Servos & Rovers" },
                { id: "robotics_photos", label: "Lab & Robot Photos" },
              ].map((tab) => {
                const active = hwCategoryFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setHwCategoryFilter(tab.id as any)}
                    style={{
                      padding: "6px 14px",
                      borderRadius: "999px",
                      border: `1px solid ${active ? "#F5B800" : "#2E374B"}`,
                      backgroundColor: active ? "#6B0F24" : "#0F1420",
                      color: active ? "#FFFFFF" : "#94A3B8",
                      fontSize: "12px",
                      fontWeight: 800,
                      cursor: "pointer",
                    }}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Grid of Assets */}
            <div
              style={{
                padding: "20px 22px",
                overflowY: "auto",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "16px",
              }}
            >
              {ROBOBEE_HARDWARE_ASSET_LIBRARY.filter(
                (a) => hwCategoryFilter === "ALL" || a.category === hwCategoryFilter
              ).map((asset) => (
                <div
                  key={asset.id}
                  style={{
                    backgroundColor: "#182032",
                    border: "1px solid #2E374B",
                    borderRadius: "14px",
                    padding: "12px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    gap: "10px",
                  }}
                >
                  <div>
                    <div
                      style={{
                        height: "145px",
                        backgroundColor: "#0B0F19",
                        borderRadius: "10px",
                        border: "1px solid #1E293B",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "hidden",
                        marginBottom: "10px",
                        padding: asset.url.endsWith(".svg") ? "8px" : "0",
                      }}
                    >
                      <img
                        src={asset.url}
                        alt={asset.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: asset.url.endsWith(".svg") ? "contain" : "cover",
                        }}
                      />
                    </div>
                    <span
                      style={{
                        fontSize: "10px",
                        fontWeight: 800,
                        color: "#F5B800",
                        backgroundColor: "rgba(245, 184, 0, 0.14)",
                        padding: "2px 8px",
                        borderRadius: "999px",
                      }}
                    >
                      {asset.specBadge}
                    </span>
                    <h4
                      style={{
                        margin: "6px 0 4px 0",
                        fontSize: "14px",
                        fontWeight: 800,
                        color: "#FFFFFF",
                      }}
                    >
                      {asset.name}
                    </h4>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "11px",
                        color: "#94A3B8",
                        lineHeight: 1.4,
                      }}
                    >
                      {asset.caption}
                    </p>
                  </div>

                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "4px" }}>
                    <button
                      type="button"
                      onClick={() => handleInsertHardwareAsset(asset, false)}
                      style={{
                        flex: 1,
                        backgroundColor: "#6B0F24",
                        border: "1px solid #F5B800",
                        color: "#FFFFFF",
                        padding: "7px 10px",
                        borderRadius: "8px",
                        fontSize: "11px",
                        fontWeight: 800,
                        cursor: "pointer",
                      }}
                    >
                      + Insert on Slide
                    </button>
                    {selectedElement && selectedElement.type === "image" && (
                      <button
                        type="button"
                        onClick={() => handleInsertHardwareAsset(asset, true)}
                        style={{
                          backgroundColor: "rgba(56, 189, 248, 0.18)",
                          border: "1px solid #38BDF8",
                          color: "#38BDF8",
                          padding: "7px 10px",
                          borderRadius: "8px",
                          fontSize: "11px",
                          fontWeight: 800,
                          cursor: "pointer",
                        }}
                      >
                        Replace Selected
                      </button>
                    )}
                    {asset.defaultPins && (
                      <button
                        type="button"
                        onClick={() => handleInsertPinoutFromAsset(asset)}
                        style={{
                          backgroundColor: "rgba(16, 185, 129, 0.16)",
                          border: "1px solid #10B981",
                          color: "#10B981",
                          padding: "7px 10px",
                          borderRadius: "8px",
                          fontSize: "11px",
                          fontWeight: 800,
                          cursor: "pointer",
                        }}
                      >
                        + Pinout Card
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
