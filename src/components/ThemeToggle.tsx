import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains("dark")
  );

  useEffect(() => {
    document.documentElement.style.transition = "background-color 300ms ease, color 300ms ease";
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="relative flex items-center w-16 h-8 rounded-full bg-secondary border border-border p-1 cursor-pointer"
      aria-label="Toggle theme"
    >
      <Sun className="absolute left-1.5 w-4 h-4 text-muted-foreground" />
      <Moon className="absolute right-1.5 w-4 h-4 text-muted-foreground" />
      <motion.div
        className="w-6 h-6 rounded-full bg-primary shadow-md"
        animate={{ x: isDark ? 32 : 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      />
    </button>
  );
};

export default ThemeToggle;
