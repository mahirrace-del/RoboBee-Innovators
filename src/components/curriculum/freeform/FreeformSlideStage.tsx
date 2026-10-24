"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  EditableSlide,
  SlideElement,
  THEME_PALETTE_CONFIG,
  SlideColorTheme,
} from "@/lib/slideStudioStore";
import { SnapLine, ResizeHandle, DragState, CanvasMode } from "./types";
import { SnapGuidesOverlay } from "./SnapGuidesOverlay";
import { ElementRenderer } from "./ElementRenderer";

interface FreeformSlideStageProps {
  slide: EditableSlide;
  mode?: CanvasMode;
  themeOverride?: SlideColorTheme | "auto";
  selectedElementId?: string | null;
  onSelectElement?: (id: string | null) => void;
  onUpdateElement?: (elementId: string, patch: Partial<SlideElement>) => void;
  onUpdateSlide?: (patch: Partial<EditableSlide>) => void;
  onZoomImage?: (src: string, caption: string) => void;
  stepRevealCount?: number;
  soundEnabled?: boolean;
  spotlightActive?: boolean;
  spotlightPos?: { x: number; y: number };
}

export const STAGE_WIDTH = 1280;
export const STAGE_HEIGHT = 720;
const SNAP_THRESHOLD = 6;

export function FreeformSlideStage({
  slide,
  mode = "editor",
  themeOverride = "auto",
  selectedElementId = null,
  onSelectElement,
  onUpdateElement,
  onUpdateSlide,
  onZoomImage,
  stepRevealCount = 999,
  soundEnabled = true,
  spotlightActive = false,
  spotlightPos,
}: FreeformSlideStageProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);

  const [scale, setScale] = useState<number>(1);
  const [editingElementId, setEditingElementId] = useState<string | null>(null);
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [snapLines, setSnapLines] = useState<SnapLine[]>([]);

  const isEditor = mode === "editor";
  const effectiveTheme: SlideColorTheme =
    themeOverride === "auto" ? slide.theme || "robobee-dark" : themeOverride;
  const palette =
    THEME_PALETTE_CONFIG[effectiveTheme] || THEME_PALETTE_CONFIG["robobee-dark"];

  // Responsive 1280x720 scaling via ResizeObserver
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          const s = Math.min(width / STAGE_WIDTH, height / STAGE_HEIGHT);
          setScale(s);
        }
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const elements = slide.elements || [];
  const selectedElement = elements.find((e) => e.id === selectedElementId);

  // Convert client pointer coordinates to 1280x720 virtual stage coordinates
  const getStageCoords = useCallback(
    (clientX: number, clientY: number) => {
      if (!stageRef.current) return { x: 0, y: 0 };
      const rect = stageRef.current.getBoundingClientRect();
      return {
        x: (clientX - rect.left) / scale,
        y: (clientY - rect.top) / scale,
      };
    },
    [scale]
  );

  // Keyboard controls in Editor mode (Nudge, Delete, Duplicate)
  useEffect(() => {
    if (!isEditor) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }

      if (!selectedElement) return;

      const step = e.shiftKey ? 10 : 1;

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        onUpdateElement?.(selectedElement.id, {
          x: Math.max(0, selectedElement.x - step),
        });
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        onUpdateElement?.(selectedElement.id, {
          x: Math.min(STAGE_WIDTH - selectedElement.width, selectedElement.x + step),
        });
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        onUpdateElement?.(selectedElement.id, {
          y: Math.max(0, selectedElement.y - step),
        });
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        onUpdateElement?.(selectedElement.id, {
          y: Math.min(STAGE_HEIGHT - selectedElement.height, selectedElement.y + step),
        });
      } else if (e.key === "Delete" || e.key === "Backspace") {
        e.preventDefault();
        const nextElements = elements.filter((el) => el.id !== selectedElement.id);
        onUpdateSlide?.({ elements: nextElements });
        onSelectElement?.(null);
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "d") {
        e.preventDefault();
        const cloned: SlideElement = {
          ...selectedElement,
          id: `el-${Date.now()}`,
          x: Math.min(STAGE_WIDTH - selectedElement.width, selectedElement.x + 24),
          y: Math.min(STAGE_HEIGHT - selectedElement.height, selectedElement.y + 24),
          zIndex: (selectedElement.zIndex || 1) + 1,
        };
        onUpdateSlide?.({ elements: [...elements, cloned] });
        onSelectElement?.(cloned.id);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isEditor, selectedElement, elements, onUpdateElement, onUpdateSlide, onSelectElement]);

  // Pointer Down for Dragging / Resizing
  const handlePointerDown = (
    e: React.PointerEvent,
    element: SlideElement,
    handle?: ResizeHandle
  ) => {
    if (!isEditor) return;
    e.stopPropagation();

    // Select the element immediately
    onSelectElement?.(element.id);

    if (element.locked) {
      return;
    }

    const coords = getStageCoords(e.clientX, e.clientY);

    setDragState({
      elementId: element.id,
      startX: coords.x,
      startY: coords.y,
      origElemX: element.x,
      origElemY: element.y,
      origWidth: element.width,
      origHeight: element.height,
      handle,
    });
  };

  // Window-level Pointer Move & Pointer Up while dragging/resizing
  useEffect(() => {
    if (!dragState || !isEditor) return;

    const handleWindowPointerMove = (e: PointerEvent) => {
      const coords = getStageCoords(e.clientX, e.clientY);
      const dx = coords.x - dragState.startX;
      const dy = coords.y - dragState.startY;

      const el = elements.find((item) => item.id === dragState.elementId);
      if (!el) return;

      if (!dragState.handle) {
        // Moving element
        let nextX = dragState.origElemX + dx;
        let nextY = dragState.origElemY + dy;

        const activeSnapLines: SnapLine[] = [];

        const centerX = nextX + el.width / 2;
        const centerY = nextY + el.height / 2;

        if (Math.abs(centerX - STAGE_WIDTH / 2) < SNAP_THRESHOLD) {
          nextX = STAGE_WIDTH / 2 - el.width / 2;
          activeSnapLines.push({ orientation: "vertical", position: STAGE_WIDTH / 2 });
        } else if (Math.abs(nextX - 60) < SNAP_THRESHOLD) {
          nextX = 60;
          activeSnapLines.push({ orientation: "vertical", position: 60 });
        }

        if (Math.abs(centerY - STAGE_HEIGHT / 2) < SNAP_THRESHOLD) {
          nextY = STAGE_HEIGHT / 2 - el.height / 2;
          activeSnapLines.push({ orientation: "horizontal", position: STAGE_HEIGHT / 2 });
        } else if (Math.abs(nextY - 40) < SNAP_THRESHOLD) {
          nextY = 40;
          activeSnapLines.push({ orientation: "horizontal", position: 40 });
        }

        setSnapLines(activeSnapLines);
        onUpdateElement?.(el.id, {
          x: Math.round(nextX),
          y: Math.round(nextY),
        });
      } else {
        // Resizing element via handle
        const h = dragState.handle;
        let { origElemX, origElemY, origWidth, origHeight } = dragState;
        let newX = origElemX;
        let newY = origElemY;
        let newW = origWidth;
        let newH = origHeight;

        if (h.includes("e")) newW = Math.max(30, origWidth + dx);
        if (h.includes("s")) newH = Math.max(20, origHeight + dy);
        if (h.includes("w")) {
          const potentialW = origWidth - dx;
          if (potentialW >= 30) {
            newW = potentialW;
            newX = origElemX + dx;
          }
        }
        if (h.includes("n")) {
          const potentialH = origHeight - dy;
          if (potentialH >= 20) {
            newH = potentialH;
            newY = origElemY + dy;
          }
        }

        setSnapLines([]);
        onUpdateElement?.(el.id, {
          x: Math.round(newX),
          y: Math.round(newY),
          width: Math.round(newW),
          height: Math.round(newH),
        });
      }
    };

    const handleWindowPointerUp = () => {
      setDragState(null);
      setSnapLines([]);
    };

    window.addEventListener("pointermove", handleWindowPointerMove);
    window.addEventListener("pointerup", handleWindowPointerUp);
    return () => {
      window.removeEventListener("pointermove", handleWindowPointerMove);
      window.removeEventListener("pointerup", handleWindowPointerUp);
    };
  }, [dragState, isEditor, elements, getStageCoords, onUpdateElement]);

  // Drag and drop image files directly onto the stage
  const handleStageDrop = (e: React.DragEvent) => {
    if (!isEditor) return;
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter((f) =>
      f.type.startsWith("image/")
    );
    if (files.length === 0) return;

    const coords = getStageCoords(e.clientX, e.clientY);

    Promise.all(
      files.map(
        (file, index) =>
          new Promise<SlideElement>((resolve) => {
            const reader = new FileReader();
            reader.onload = (uploadEvent) => {
              const resultUrl = (uploadEvent.target?.result as string) || "";
              resolve({
                id: `el-img-${Date.now()}-${index}`,
                type: "image",
                x: Math.min(STAGE_WIDTH - 300, Math.max(20, coords.x + index * 30)),
                y: Math.min(STAGE_HEIGHT - 220, Math.max(20, coords.y + index * 30)),
                width: 480,
                height: 320,
                zIndex: (elements.length || 0) + 1 + index,
                content: resultUrl,
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
    ).then((newImageElements) => {
      onUpdateSlide?.({
        elements: [...(slide.elements || []), ...newImageElements],
      });
      if (newImageElements.length > 0) {
        onSelectElement?.(newImageElements[newImageElements.length - 1].id);
      }
    });
  };

  // Stage Background Styling
  const stageBackground = slide.backgroundColor
    ? slide.backgroundColor
    : slide.backgroundImage
    ? `url(${slide.backgroundImage}) center/cover no-repeat`
    : palette.canvasBg;

  // Render 8 Resize Handles on selected element
  const renderResizeHandles = (el: SlideElement) => {
    const handleSize = 10;
    const handles: { h: ResizeHandle; cursor: string; top: string; left: string }[] = [
      { h: "nw", cursor: "nwse-resize", top: "0%", left: "0%" },
      { h: "n", cursor: "ns-resize", top: "0%", left: "50%" },
      { h: "ne", cursor: "nesw-resize", top: "0%", left: "100%" },
      { h: "e", cursor: "ew-resize", top: "50%", left: "100%" },
      { h: "se", cursor: "nwse-resize", top: "100%", left: "100%" },
      { h: "s", cursor: "ns-resize", top: "100%", left: "50%" },
      { h: "sw", cursor: "nesw-resize", top: "100%", left: "0%" },
      { h: "w", cursor: "ew-resize", top: "50%", left: "0%" },
    ];

    return (
      <>
        {handles.map(({ h, cursor, top, left }) => (
          <div
            key={h}
            onPointerDown={(e) => handlePointerDown(e, el, h)}
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "absolute",
              top,
              left,
              width: `${handleSize}px`,
              height: `${handleSize}px`,
              backgroundColor: "#F5B700",
              border: "2px solid #0F172A",
              borderRadius: "2px",
              transform: "translate(-50%, -50%)",
              cursor,
              zIndex: 1000,
              pointerEvents: "auto",
            }}
          />
        ))}
      </>
    );
  };

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        backgroundColor: isEditor ? "#0B0E14" : "transparent",
      }}
      onClick={(e) => {
        // Deselect only if clicking the outer workspace background directly
        if (isEditor && e.target === containerRef.current) {
          onSelectElement?.(null);
          setEditingElementId(null);
        }
      }}
    >
      {/* 16:9 Scaled Virtual Canvas Container */}
      <div
        ref={stageRef}
        onDragOver={(e) => isEditor && e.preventDefault()}
        onDrop={handleStageDrop}
        onClick={(e) => {
          // Deselect only if clicking the stage canvas background directly
          if (
            isEditor &&
            (e.target === stageRef.current || e.target === e.currentTarget)
          ) {
            onSelectElement?.(null);
            setEditingElementId(null);
          }
        }}
        style={{
          width: `${STAGE_WIDTH}px`,
          height: `${STAGE_HEIGHT}px`,
          transform: `scale(${scale})`,
          transformOrigin: "center center",
          position: "relative",
          background: stageBackground,
          backgroundImage:
            palette.gridOverlay && !slide.backgroundColor && !slide.backgroundImage
              ? `${palette.gridOverlay}, ${palette.canvasBg}`
              : undefined,
          backgroundSize: palette.gridOverlay ? "24px 24px, 100% 100%" : undefined,
          borderRadius: isEditor ? "0px" : "20px",
          border: isEditor ? "none" : "1px solid rgba(255, 255, 255, 0.14)",
          boxShadow: isEditor
            ? "0 25px 60px -15px rgba(0, 0, 0, 0.75), 0 0 0 1px rgba(255, 255, 255, 0.08)"
            : "0 25px 65px -15px rgba(0, 0, 0, 0.75), 0 0 35px -10px rgba(0, 0, 0, 0.5)",
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        {/* Background Dark Overlay if custom image */}
        {slide.backgroundImage && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: `rgba(15, 23, 42, ${slide.backgroundOverlayOpacity ?? 0.65})`,
              pointerEvents: "none",
              zIndex: 0,
            }}
          />
        )}

        {/* Snap guidelines overlay */}
        <SnapGuidesOverlay snapLines={snapLines} />

        {/* Elements Layer */}
        {elements
          .slice()
          .sort((a, b) => (a.zIndex || 1) - (b.zIndex || 1))
          .map((el, idx) => {
            const isSelected = isEditor && selectedElementId === el.id;
            const isEditing = isEditor && editingElementId === el.id;

            // Step reveal calculation in presenter mode
            const isStepReveal = el.animation?.type === "step-reveal";
            const isVisible =
              isEditor || !isStepReveal || (el.animation?.order ?? idx) <= stepRevealCount;

            return (
              <div
                key={el.id}
                onPointerDown={(e) => handlePointerDown(e, el)}
                onClick={(e) => {
                  if (!isEditor) return;
                  e.stopPropagation();
                  onSelectElement?.(el.id);
                }}
                style={{
                  position: "absolute",
                  left: `${el.x}px`,
                  top: `${el.y}px`,
                  width: `${el.width}px`,
                  height: `${el.height}px`,
                  transform: el.rotation ? `rotate(${el.rotation}deg)` : undefined,
                  zIndex: el.zIndex || 1,
                  cursor: isEditor ? (el.locked ? "not-allowed" : "move") : "default",
                  boxSizing: "border-box",
                }}
              >
                {/* Element Render Body */}
                <ElementRenderer
                  element={el}
                  palette={palette}
                  isEditorMode={isEditor}
                  isSelected={isSelected}
                  isEditing={isEditing}
                  onStartEditing={() => setEditingElementId(el.id)}
                  onFinishEditing={() => setEditingElementId(null)}
                  onUpdateElement={(patch) => onUpdateElement?.(el.id, patch)}
                  onZoomImage={onZoomImage}
                  stepRevealVisible={isVisible}
                  soundEnabled={soundEnabled}
                />

                {/* Selection Bounding Box & Resize Handles */}
                {isSelected && (
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      border: "2px solid #F5B700",
                      pointerEvents: "none",
                      boxShadow: "0 0 12px rgba(245, 183, 0, 0.4)",
                    }}
                  >
                    {!el.locked && renderResizeHandles(el)}
                  </div>
                )}
              </div>
            );
          })}

        {/* Drag Shield: prevents iframes and embedded widgets from intercepting pointermove/up */}
        {isEditor && dragState !== null && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 99998,
              cursor: dragState.handle ? "crosshair" : "grabbing",
              pointerEvents: "auto",
            }}
          />
        )}

        {/* Presenter Spotlight Overlay */}
        {!isEditor && spotlightActive && spotlightPos && stageRef.current && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              zIndex: 99999,
              background: `radial-gradient(circle 160px at ${(spotlightPos.x - stageRef.current.getBoundingClientRect().left) / scale}px ${(spotlightPos.y - stageRef.current.getBoundingClientRect().top) / scale}px, rgba(0,0,0,0) 0%, rgba(5, 8, 16, 0.88) 100%)`,
              transition: "background 0.04s ease-out",
            }}
          />
        )}
      </div>
    </div>
  );
}
