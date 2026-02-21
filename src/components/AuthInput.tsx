import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface AuthInputProps {
  id: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  icon: LucideIcon;
  error?: string;
  autoFocus?: boolean;
}

const AuthInput = ({
  id,
  type = "text",
  placeholder,
  value,
  onChange,
  icon: Icon,
  error,
  autoFocus,
}: AuthInputProps) => (
  <div>
    <div className={`relative ${error ? "animate-shake" : ""}`}>
      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoFocus={autoFocus}
        className="w-full h-11 pl-10 pr-4 rounded-xl border border-border bg-background text-foreground text-sm
          outline-none input-glow transition-all duration-200
          placeholder:text-muted-foreground"
      />
    </div>
    {error && (
      <motion.p
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-xs text-destructive mt-1.5 ml-1"
      >
        {error}
      </motion.p>
    )}
  </div>
);

export default AuthInput;
