import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock } from "lucide-react";

interface PasswordInputProps {
  id: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
}

const PasswordInput = ({ id, placeholder = "••••••••", value, onChange }: PasswordInputProps) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
      <input
        id={id}
        type={visible ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-11 pl-10 pr-10 rounded-xl border border-border bg-background text-foreground text-sm
          outline-none input-glow transition-all duration-200"
      />
      <motion.button
        type="button"
        onClick={() => setVisible(!visible)}
        whileTap={{ scale: 0.85 }}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
      >
        {visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </motion.button>
    </div>
  );
};

export default PasswordInput;
