import { SlideElement, SlideElementType } from "@/lib/slideStudioStore";

export type CanvasMode = "editor" | "presenter" | "preview";

export type ResizeHandle = "n" | "s" | "e" | "w" | "nw" | "ne" | "sw" | "se";

export interface SnapLine {
  orientation: "horizontal" | "vertical";
  position: number; // in 1280x720 canvas coordinates
}

export interface DragState {
  elementId: string;
  startX: number;
  startY: number;
  origElemX: number;
  origElemY: number;
  origWidth: number;
  origHeight: number;
  handle?: ResizeHandle;
}

export interface PresetLayoutOption {
  id: string;
  name: string;
  description: string;
  iconName: string;
  createElements: (themeKey: string) => SlideElement[];
}
