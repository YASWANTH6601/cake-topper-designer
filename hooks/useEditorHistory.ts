"use client";

import { useCallback, useRef, useState } from "react";

const HISTORY_LIMIT = 50;
const GROUP_WINDOW_MS = 900;

type HistoryState<T> = {
  past: T[];
  present: T;
  future: T[];
};

type CommitOptions = {
  groupKey?: string;
};

export default function useEditorHistory<T>(initialState: T) {
  const [history, setHistory] = useState<HistoryState<T>>({ past: [], present: initialState, future: [] });
  const activeGroupRef = useRef<{ key: string; updatedAt: number } | null>(null);

  const endGroup = useCallback(() => {
    activeGroupRef.current = null;
  }, []);

  const commit = useCallback((updater: (current: T) => T, options: CommitOptions = {}) => {
    const now = Date.now();
    setHistory((current) => {
      const next = updater(current.present);
      if (Object.is(next, current.present)) return current;

      const activeGroup = activeGroupRef.current;
      const grouped = Boolean(
        options.groupKey
        && activeGroup?.key === options.groupKey
        && now - activeGroup.updatedAt <= GROUP_WINDOW_MS,
      );

      activeGroupRef.current = options.groupKey ? { key: options.groupKey, updatedAt: now } : null;
      return {
        past: grouped ? current.past : [...current.past, current.present].slice(-HISTORY_LIMIT),
        present: next,
        future: [],
      };
    });
  }, []);

  const undo = useCallback(() => {
    endGroup();
    setHistory((current) => {
      const previous = current.past.at(-1);
      if (!previous) return current;
      return {
        past: current.past.slice(0, -1),
        present: previous,
        future: [current.present, ...current.future].slice(0, HISTORY_LIMIT),
      };
    });
  }, [endGroup]);

  const redo = useCallback(() => {
    endGroup();
    setHistory((current) => {
      const next = current.future[0];
      if (!next) return current;
      return {
        past: [...current.past, current.present].slice(-HISTORY_LIMIT),
        present: next,
        future: current.future.slice(1),
      };
    });
  }, [endGroup]);

  const reset = useCallback((state: T) => {
    activeGroupRef.current = null;
    setHistory({ past: [], present: state, future: [] });
  }, []);

  return {
    state: history.present,
    commit,
    undo,
    redo,
    reset,
    endGroup,
    canUndo: history.past.length > 0,
    canRedo: history.future.length > 0,
  };
}
