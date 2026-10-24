"use client";

import { useState, useCallback, useRef } from "react";
import { SlideElement } from "@/lib/slideStudioStore";

const MAX_HISTORY = 50;

export function useCanvasHistory(initialElements: SlideElement[]) {
  const [history, setHistory] = useState<SlideElement[][]>([initialElements]);
  const [historyIdx, setHistoryIdx] = useState<number>(0);
  const clipboardRef = useRef<SlideElement | null>(null);

  // Push new state to history
  const pushState = useCallback((newElements: SlideElement[]) => {
    setHistory((prev) => {
      const upToCurrent = prev.slice(0, historyIdx + 1);
      const nextHistory = [...upToCurrent, newElements];
      if (nextHistory.length > MAX_HISTORY) {
        nextHistory.shift();
      }
      return nextHistory;
    });
    setHistoryIdx((prev) => Math.min(MAX_HISTORY - 1, prev + 1));
  }, [historyIdx]);

  // Undo
  const undo = useCallback((): SlideElement[] | null => {
    if (historyIdx > 0) {
      const prevIdx = historyIdx - 1;
      setHistoryIdx(prevIdx);
      return history[prevIdx];
    }
    return null;
  }, [historyIdx, history]);

  // Redo
  const redo = useCallback((): SlideElement[] | null => {
    if (historyIdx < history.length - 1) {
      const nextIdx = historyIdx + 1;
      setHistoryIdx(nextIdx);
      return history[nextIdx];
    }
    return null;
  }, [historyIdx, history]);

  // Clipboard operations
  const copyElement = useCallback((element: SlideElement) => {
    clipboardRef.current = JSON.parse(JSON.stringify(element));
  }, []);

  const pasteElement = useCallback((): SlideElement | null => {
    if (!clipboardRef.current) return null;
    const pasted: SlideElement = {
      ...JSON.parse(JSON.stringify(clipboardRef.current)),
      id: `el-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      x: Math.min(1280 - (clipboardRef.current.width || 200), clipboardRef.current.x + 24),
      y: Math.min(720 - (clipboardRef.current.height || 100), clipboardRef.current.y + 24),
      zIndex: (clipboardRef.current.zIndex || 1) + 1,
    };
    return pasted;
  }, []);

  return {
    pushState,
    undo,
    redo,
    canUndo: historyIdx > 0,
    canRedo: historyIdx < history.length - 1,
    copyElement,
    pasteElement,
  };
}
