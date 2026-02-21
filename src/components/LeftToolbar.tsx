import { useState } from "react";
import {
  Maximize,
  Settings,
  FilePlus,
  FolderOpen,
  Mail,
  Download,
  Printer,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface LeftToolbarProps {
  onNewFile: () => void;
  onToggleHelper: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onPrint: () => void;
  onDownload: (format: "txt" | "doc") => void;
  autoSave: boolean;
  onAutoSaveToggle: () => void;
}

const LeftToolbar = ({
  onNewFile,
  onToggleHelper,
  onZoomIn,
  onZoomOut,
  onPrint,
  onDownload,
  autoSave,
  onAutoSaveToggle,
}: LeftToolbarProps) => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [downloadOpen, setDownloadOpen] = useState(false);
  const [mailOpen, setMailOpen] = useState(false);

  const iconBtn =
    "w-11 h-11 flex items-center justify-center rounded-xl text-muted-foreground hover:text-foreground hover:bg-primary/10 transition-all duration-200 hover:scale-105 relative";

  const ToolbarIcon = ({
    icon: Icon,
    label,
    onClick,
    to,
  }: {
    icon: any;
    label: string;
    onClick?: () => void;
    to?: string;
  }) => (
    <Tooltip>
      <TooltipTrigger asChild>
        {to ? (
          <Link to={to} className={iconBtn}>
            <Icon className="w-5 h-5" />
          </Link>
        ) : (
          <button className={iconBtn} onClick={onClick}>
            <Icon className="w-5 h-5" />
          </button>
        )}
      </TooltipTrigger>
      <TooltipContent side="right" className="text-xs">
        {label}
      </TooltipContent>
    </Tooltip>
  );

  return (
    <div className="w-14 border-r border-border bg-card/60 flex flex-col items-center py-3 gap-1 shrink-0 overflow-y-auto">
      <ToolbarIcon
        icon={Maximize}
        label="Fullscreen"
        onClick={() => {
          if (document.fullscreenElement) document.exitFullscreen();
          else document.documentElement.requestFullscreen();
        }}
      />

      {/* Settings popover */}
      <div className="relative">
        <Tooltip>
          <TooltipTrigger asChild>
            <button className={iconBtn} onClick={() => setSettingsOpen(!settingsOpen)}>
              <Settings className="w-5 h-5" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right" className="text-xs">Settings</TooltipContent>
        </Tooltip>
        <AnimatePresence>
          {settingsOpen && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              className="absolute left-full top-0 ml-2 w-52 rounded-xl bg-popover border border-border shadow-lg p-3 z-50"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-foreground">Auto-save</span>
                <button
                  onClick={onAutoSaveToggle}
                  className={`w-9 h-5 rounded-full transition-colors relative ${autoSave ? "bg-primary" : "bg-muted"}`}
                >
                  <motion.div
                    className="w-4 h-4 rounded-full bg-primary-foreground absolute top-0.5"
                    animate={{ left: autoSave ? 18 : 2 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-foreground">Helper Panel</span>
                <button
                  onClick={() => { onToggleHelper(); setSettingsOpen(false); }}
                  className="text-xs text-primary hover:underline"
                >
                  Toggle
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <ToolbarIcon icon={FilePlus} label="New File" onClick={onNewFile} />
      <ToolbarIcon icon={FolderOpen} label="Files" to="/files" />

      {/* Mail popover */}
      <div className="relative">
        <Tooltip>
          <TooltipTrigger asChild>
            <button className={iconBtn} onClick={() => setMailOpen(!mailOpen)}>
              <Mail className="w-5 h-5" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right" className="text-xs">Mail</TooltipContent>
        </Tooltip>
        <AnimatePresence>
          {mailOpen && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              className="absolute left-full top-0 ml-2 w-44 rounded-xl bg-popover border border-border shadow-lg py-1 z-50"
            >
              {["Gmail", "Outlook"].map((app) => (
                <button
                  key={app}
                  className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-accent/50 transition-colors"
                  onClick={() => setMailOpen(false)}
                >
                  {app}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Download popover */}
      <div className="relative">
        <Tooltip>
          <TooltipTrigger asChild>
            <button className={iconBtn} onClick={() => setDownloadOpen(!downloadOpen)}>
              <Download className="w-5 h-5" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right" className="text-xs">Download</TooltipContent>
        </Tooltip>
        <AnimatePresence>
          {downloadOpen && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              className="absolute left-full top-0 ml-2 w-48 rounded-xl bg-popover border border-border shadow-lg py-1 z-50"
            >
              <button
                className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-accent/50"
                onClick={() => { onDownload("txt"); setDownloadOpen(false); }}
              >
                Download as .txt
              </button>
              <button
                className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-accent/50"
                onClick={() => { onDownload("doc"); setDownloadOpen(false); }}
              >
                Download as .doc
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <ToolbarIcon icon={Printer} label="Print (Ctrl+P)" onClick={onPrint} />

      <div className="mt-auto flex flex-col items-center gap-1">
        <ToolbarIcon icon={ZoomIn} label="Zoom In" onClick={onZoomIn} />
        <ToolbarIcon icon={ZoomOut} label="Zoom Out" onClick={onZoomOut} />
      </div>
    </div>
  );
};

export default LeftToolbar;
