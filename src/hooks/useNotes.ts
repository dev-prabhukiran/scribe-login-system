import { useState, useEffect, useCallback, useRef } from "react";

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  wordCount: number;
  charCount: number;
}

const generateId = () => Math.random().toString(36).substring(2, 10);

const getDateStr = () => {
  const d = new Date();
  return d.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
};

const loadNotes = (): Note[] => {
  try {
    const raw = localStorage.getItem("voicescribe_notes");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveNotes = (notes: Note[]) => {
  localStorage.setItem("voicescribe_notes", JSON.stringify(notes));
};

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>(loadNotes);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [autoSave, setAutoSave] = useState(true);
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout>>();

  // Initialize with first note or create one
  useEffect(() => {
    if (notes.length === 0) {
      createNote();
    } else if (!activeNoteId) {
      setActiveNoteId(notes[0].id);
    }
  }, []);

  const activeNote = notes.find((n) => n.id === activeNoteId) || notes[0] || null;

  const persist = useCallback((updated: Note[]) => {
    setNotes(updated);
    saveNotes(updated);
  }, []);

  const createNote = useCallback(() => {
    const count = notes.length + 1;
    const note: Note = {
      id: generateId(),
      title: `Note_${count}`,
      content: "",
      createdAt: getDateStr(),
      updatedAt: getDateStr(),
      wordCount: 0,
      charCount: 0,
    };
    const updated = [note, ...notes];
    persist(updated);
    setActiveNoteId(note.id);
    return note;
  }, [notes, persist]);

  const updateContent = useCallback(
    (content: string) => {
      if (!activeNoteId) return;
      const words = content.trim() ? content.trim().split(/\s+/).length : 0;
      const updated = notes.map((n) =>
        n.id === activeNoteId
          ? { ...n, content, wordCount: words, charCount: content.length, updatedAt: getDateStr() }
          : n
      );
      persist(updated);
    },
    [activeNoteId, notes, persist]
  );

  const renameNote = useCallback(
    (id: string, title: string) => {
      const updated = notes.map((n) => (n.id === id ? { ...n, title } : n));
      persist(updated);
    },
    [notes, persist]
  );

  const deleteNote = useCallback(
    (id: string) => {
      const updated = notes.filter((n) => n.id !== id);
      persist(updated);
      if (activeNoteId === id) {
        setActiveNoteId(updated[0]?.id || null);
      }
    },
    [notes, activeNoteId, persist]
  );

  const duplicateNote = useCallback(
    (id: string) => {
      const original = notes.find((n) => n.id === id);
      if (!original) return;
      const dup: Note = {
        ...original,
        id: generateId(),
        title: `${original.title} (copy)`,
        createdAt: getDateStr(),
        updatedAt: getDateStr(),
      };
      const updated = [dup, ...notes];
      persist(updated);
    },
    [notes, persist]
  );

  // Auto-save debounce
  const scheduleAutoSave = useCallback(
    (content: string) => {
      if (!autoSave) return;
      if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
      autoSaveTimer.current = setTimeout(() => updateContent(content), 800);
    },
    [autoSave, updateContent]
  );

  return {
    notes,
    activeNote,
    activeNoteId,
    setActiveNoteId,
    createNote,
    updateContent,
    renameNote,
    deleteNote,
    duplicateNote,
    autoSave,
    setAutoSave,
    scheduleAutoSave,
  };
}
