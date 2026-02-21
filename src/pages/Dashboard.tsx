import { useState, useCallback, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import LeftToolbar from "@/components/LeftToolbar";
import Canvas from "@/components/Canvas";
import HelperPanel from "@/components/HelperPanel";
import { useNotes } from "@/hooks/useNotes";
import { toast } from "@/hooks/use-toast";

const Dashboard = () => {
  const {
    activeNote,
    createNote,
    updateContent,
    autoSave,
    setAutoSave,
  } = useNotes();

  const [showHelper, setShowHelper] = useState(true);
  const [fontSize, setFontSize] = useState(16);
  const [insertText, setInsertText] = useState<string | null>(null);

  const handleZoomIn = () => setFontSize((s) => Math.min(s + 2, 28));
  const handleZoomOut = () => setFontSize((s) => Math.max(s - 2, 12));

  const handlePrint = () => window.print();

  const handleDownload = useCallback(
    (format: "txt" | "doc") => {
      if (!activeNote) return;
      const content = activeNote.content;
      const blob =
        format === "txt"
          ? new Blob([content], { type: "text/plain" })
          : new Blob([content], { type: "application/msword" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${activeNote.title}.${format}`;
      a.click();
      URL.revokeObjectURL(url);
    },
    [activeNote]
  );

  const handleInsert = (text: string) => setInsertText(text);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "n") {
        e.preventDefault();
        createNote();
        toast({ title: "New note created", duration: 1500 });
      }
      if (e.ctrlKey && e.key === "s") {
        e.preventDefault();
        toast({ title: "Saved", duration: 1500 });
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [createNote]);

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <Navbar />
      <div className="flex flex-1 min-h-0">
        <LeftToolbar
          onNewFile={createNote}
          onToggleHelper={() => setShowHelper(!showHelper)}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onPrint={handlePrint}
          onDownload={handleDownload}
          autoSave={autoSave}
          onAutoSaveToggle={() => setAutoSave(!autoSave)}
        />

        <Canvas
          note={activeNote}
          onContentChange={updateContent}
          onInsertText={insertText}
          onInsertConsumed={() => setInsertText(null)}
          fontSize={fontSize}
          autoSave={autoSave}
        />

        <AnimatePresence>
          {showHelper && <HelperPanel onInsert={handleInsert} />}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Dashboard;
