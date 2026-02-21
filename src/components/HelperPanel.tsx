import { motion } from "framer-motion";

const commands = [
  { say: "Period", insert: "." },
  { say: "Comma", insert: "," },
  { say: "Question mark", insert: "?" },
  { say: "Colon", insert: ":" },
  { say: "Semi Colon", insert: ";" },
  { say: "Exclamation mark", insert: "!" },
  { say: "Dash", insert: "-" },
  { say: "New line", insert: "↵" },
  { say: "New paragraph", insert: "↵↵" },
  { say: "Open parentheses", insert: "(" },
  { say: "Close parentheses", insert: ")" },
  { say: "Smiley", insert: ":-)" },
  { say: "Sad face", insert: ":-(" },
];

interface HelperPanelProps {
  onInsert: (text: string) => void;
}

const HelperPanel = ({ onInsert }: HelperPanelProps) => {
  const getActualInsert = (insert: string) => {
    if (insert === "↵") return "\n";
    if (insert === "↵↵") return "\n\n";
    return insert;
  };

  return (
    <motion.div
      initial={{ width: 0, opacity: 0 }}
      animate={{ width: 240, opacity: 1 }}
      exit={{ width: 0, opacity: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="border-l border-border bg-card/60 overflow-hidden shrink-0"
    >
      <div className="w-60 p-4 h-full overflow-y-auto">
        <h3 className="text-sm font-semibold text-foreground mb-1">Say or Click</h3>
        <p className="text-xs text-muted-foreground mb-4">
          Tip: Press Enter to finalize speech instantly.
        </p>

        <div className="space-y-0.5">
          <div className="grid grid-cols-[1fr_auto] gap-2 text-xs text-muted-foreground font-medium mb-2">
            <span>Say</span>
            <span>Insert</span>
          </div>
          {commands.map(({ say, insert }) => (
            <button
              key={say}
              onClick={() => onInsert(getActualInsert(insert))}
              className="w-full grid grid-cols-[1fr_auto] gap-2 items-center px-2 py-1.5 rounded-lg text-sm text-foreground hover:bg-primary/10 transition-colors group"
            >
              <span className="text-left">{say}</span>
              <span className="text-muted-foreground group-hover:text-primary transition-colors font-mono">
                {insert}
              </span>
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default HelperPanel;
