import { useState } from "react";
import { Link } from "react-router-dom";
import { Edit3, Check, MoreVertical, Trash2, Copy, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import { useNotes, Note } from "@/hooks/useNotes";

const Files = () => {
  const { notes, setActiveNoteId, renameNote, deleteNote, duplicateNote } = useNotes();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [menuId, setMenuId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const startRename = (note: Note) => {
    setEditingId(note.id);
    setEditTitle(note.title);
    setMenuId(null);
  };

  const finishRename = (id: string) => {
    if (editTitle.trim()) renameNote(id, editTitle.trim());
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    deleteNote(id);
    setDeleteConfirm(null);
  };

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <Navbar />
      <div className="flex-1 overflow-y-auto p-6 lg:p-10">
        <div className="flex items-center gap-3 mb-6">
          <Link
            to="/dashboard"
            className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-accent/50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </Link>
          <h1 className="text-2xl font-semibold text-foreground">Your Files</h1>
        </div>

        {notes.length === 0 ? (
          <p className="text-muted-foreground text-sm">No notes yet. Create one from the dashboard.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {notes.map((note, i) => (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="group relative rounded-xl border border-border bg-card p-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer"
                onClick={() => setActiveNoteId(note.id)}
              >
                <Link to="/dashboard" className="absolute inset-0 z-0" />

                {/* Title row */}
                <div className="flex items-center justify-between mb-2 relative z-10">
                  {editingId === note.id ? (
                    <div className="flex items-center gap-1.5 flex-1">
                      <input
                        className="text-sm font-medium bg-transparent border-b border-primary outline-none text-foreground flex-1"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onBlur={() => finishRename(note.id)}
                        onKeyDown={(e) => { if (e.key === "Enter") finishRename(note.id); }}
                        autoFocus
                        onClick={(e) => e.preventDefault()}
                      />
                      <button onClick={(e) => { e.preventDefault(); finishRename(note.id); }}>
                        <Check className="w-4 h-4 text-primary" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <h3 className="text-sm font-medium text-foreground truncate">{note.title}</h3>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => { e.preventDefault(); startRename(note); }}
                          className="p-1 hover:bg-accent/50 rounded"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-muted-foreground" />
                        </button>
                        <div className="relative">
                          <button
                            onClick={(e) => { e.preventDefault(); setMenuId(menuId === note.id ? null : note.id); }}
                            className="p-1 hover:bg-accent/50 rounded"
                          >
                            <MoreVertical className="w-3.5 h-3.5 text-muted-foreground" />
                          </button>
                          <AnimatePresence>
                            {menuId === note.id && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="absolute right-0 top-full mt-1 w-36 rounded-lg bg-popover border border-border shadow-lg py-1 z-20"
                              >
                                <button
                                  className="w-full text-left px-3 py-1.5 text-xs hover:bg-accent/50 flex items-center gap-2"
                                  onClick={(e) => { e.preventDefault(); startRename(note); }}
                                >
                                  <Edit3 className="w-3 h-3" /> Rename
                                </button>
                                <button
                                  className="w-full text-left px-3 py-1.5 text-xs hover:bg-accent/50 flex items-center gap-2"
                                  onClick={(e) => { e.preventDefault(); duplicateNote(note.id); setMenuId(null); }}
                                >
                                  <Copy className="w-3 h-3" /> Duplicate
                                </button>
                                <button
                                  className="w-full text-left px-3 py-1.5 text-xs text-destructive hover:bg-destructive/10 flex items-center gap-2"
                                  onClick={(e) => { e.preventDefault(); setDeleteConfirm(note.id); setMenuId(null); }}
                                >
                                  <Trash2 className="w-3 h-3" /> Delete
                                </button>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <p className="text-xs text-muted-foreground mb-2">{note.createdAt} · {note.wordCount} words</p>
                <p className="text-xs text-muted-foreground/70 line-clamp-2">
                  {note.content.substring(0, 120) || "Empty note"}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Delete confirm modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
            onClick={() => setDeleteConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card border border-border rounded-xl p-6 w-80 shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-base font-semibold text-foreground mb-2">Delete Note?</h3>
              <p className="text-sm text-muted-foreground mb-5">This action cannot be undone.</p>
              <div className="flex gap-2 justify-end">
                <button
                  className="px-4 py-1.5 rounded-lg text-sm text-foreground hover:bg-accent/50 transition-colors"
                  onClick={() => setDeleteConfirm(null)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-1.5 rounded-lg text-sm bg-destructive text-destructive-foreground hover:opacity-90 transition-opacity"
                  onClick={() => handleDelete(deleteConfirm)}
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Files;
