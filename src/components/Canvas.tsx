import { useState, useRef, useEffect, useCallback } from "react";
import { Mic, Volume2, Copy, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { Note } from "@/hooks/useNotes";
import { toast } from "@/hooks/use-toast";

interface CanvasProps {
  note: Note | null;
  onContentChange: (content: string) => void;
  onInsertText?: string | null;
  onInsertConsumed?: () => void;
  fontSize: number;
  autoSave: boolean;
}

const emptyStateLines = [
  "Click the mic to start dictating.",
  "",
  "Quick tips:",
  '① Use the speaker icon for proof reading.',
  '② Punctuate by dictating or using the helper panel.',
  '③ Press Enter to finalize speech.',
  '④ Say "Start recording" to begin.',
  '⑤ Say "Stop recording" to end.',
  "",
  "Enjoy note-talking :)",
];

const Canvas = ({ note, onContentChange, onInsertText, onInsertConsumed, fontSize, autoSave }: CanvasProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [copied, setCopied] = useState(false);
  const [savedIndicator, setSavedIndicator] = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState(note?.title || "");

  const content = note?.content || "";

  const onFinalTranscript = useCallback(
    (text: string) => {
      const newContent = content + (content && !content.endsWith(" ") ? " " : "") + text;
      onContentChange(newContent);
    },
    [content, onContentChange]
  );

  const { isListening, interimText, toggleListening } = useSpeechRecognition(onFinalTranscript);
  const { isSpeaking, speak, stop } = useTextToSpeech();

  // Handle insert from helper panel
  useEffect(() => {
    if (onInsertText) {
      const newContent = content + onInsertText;
      onContentChange(newContent);
      onInsertConsumed?.();
    }
  }, [onInsertText]);

  // Update title when note changes
  useEffect(() => {
    setTitleValue(note?.title || "");
  }, [note?.id]);

  // Auto-save indicator
  useEffect(() => {
    if (autoSave && content) {
      setSavedIndicator(true);
      const t = setTimeout(() => setSavedIndicator(false), 2000);
      return () => clearTimeout(t);
    }
  }, [content, autoSave]);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTTS = () => {
    if (isSpeaking) stop();
    else speak(content);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey && e.key === "s") {
      e.preventDefault();
      onContentChange(content);
      toast({ title: "Saved", duration: 1500 });
    }
    if (e.ctrlKey && e.key === "p") {
      e.preventDefault();
      window.print();
    }
  };

  const showEmptyState = !content && !isListening;

  return (
    <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative">
      {/* Recording indicator */}
      <AnimatePresence>
        {isListening && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-3 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1 rounded-full bg-destructive/10 border border-destructive/20 z-10"
          >
            <span className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
            <span className="text-xs text-destructive font-medium">Recording…</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Canvas header */}
      <div className="flex items-center justify-between px-8 lg:px-16 pt-5 pb-2 shrink-0">
        <div>
          <div className="flex items-center gap-2">
            {editingTitle ? (
              <input
                className="text-lg font-semibold bg-transparent border-b border-primary outline-none text-foreground"
                value={titleValue}
                onChange={(e) => setTitleValue(e.target.value)}
                onBlur={() => setEditingTitle(false)}
                onKeyDown={(e) => { if (e.key === "Enter") setEditingTitle(false); }}
                autoFocus
              />
            ) : (
              <h2
                className="text-lg font-semibold text-foreground cursor-pointer hover:text-primary transition-colors"
                onClick={() => setEditingTitle(true)}
              >
                {note?.title || "Untitled"}
              </h2>
            )}
            <AnimatePresence>
              {savedIndicator && autoSave && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-xs text-primary"
                >
                  Saved
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            {note?.createdAt || "Today"} — {" "}
            <motion.span key={note?.wordCount} initial={{ opacity: 0.5 }} animate={{ opacity: 1 }}>
              {note?.wordCount || 0} words
            </motion.span>{" "}
            •{" "}
            <motion.span key={note?.charCount} initial={{ opacity: 0.5 }} animate={{ opacity: 1 }}>
              {note?.charCount || 0} characters
            </motion.span>
          </p>
        </div>

        {/* Mic button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={toggleListening}
              className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 ${
                isListening
                  ? "bg-primary text-primary-foreground shadow-[0_0_20px_hsl(168_83%_47%/0.4)]"
                  : "border border-primary/40 text-primary hover:bg-primary/10 hover:shadow-[0_0_12px_hsl(168_83%_47%/0.2)]"
              }`}
            >
              <Mic className="w-5 h-5" />
              {isListening && (
                <span className="absolute top-0 right-0 w-2.5 h-2.5 rounded-full bg-destructive border-2 border-card" />
              )}
            </button>
          </TooltipTrigger>
          <TooltipContent>{isListening ? "Stop recording" : "Start recording"}</TooltipContent>
        </Tooltip>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-y-auto px-8 lg:px-16 pb-20 scrollbar-thin">
        {showEmptyState ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pt-12"
          >
            {emptyStateLines.map((line, i) => (
              <p key={i} className="text-muted-foreground/50 text-sm leading-relaxed">
                {line || <br />}
              </p>
            ))}
          </motion.div>
        ) : (
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => onContentChange(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full h-full min-h-[60vh] bg-transparent resize-none outline-none text-foreground leading-relaxed placeholder:text-muted-foreground/30"
            style={{ fontSize: `${fontSize}px`, maxWidth: "720px" }}
            placeholder="Start typing or use the mic..."
          />
        )}

        {/* Interim speech bubble */}
        <AnimatePresence>
          {interimText && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              className="mt-2 inline-block px-3 py-1.5 rounded-lg bg-muted text-sm text-muted-foreground italic"
            >
              {interimText}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom-right controls */}
      <div className="absolute bottom-4 right-4 flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={handleTTS}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                isSpeaking
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-primary/10"
              }`}
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent>{isSpeaking ? "Stop speaking" : "Read aloud"}</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={handleCopy}
              className="w-9 h-9 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-primary/10 transition-all"
            >
              {copied ? (
                <Check className="w-4 h-4 text-primary" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </TooltipTrigger>
          <TooltipContent>{copied ? "Copied!" : "Copy to clipboard"}</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
};

export default Canvas;
