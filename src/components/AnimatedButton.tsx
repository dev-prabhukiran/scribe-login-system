import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type ButtonState = "idle" | "loading" | "success";

interface AnimatedButtonProps {
  children: React.ReactNode;
  onClick?: () => void | Promise<void>;
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit";
}

const Spinner = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" className="animate-spin">
    <circle
      cx="10"
      cy="10"
      r="8"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeDasharray="40"
      strokeDashoffset="10"
      strokeLinecap="round"
    />
  </svg>
);

const Checkmark = () => (
  <motion.svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    transition={{ type: "spring", stiffness: 300, damping: 20 }}
  >
    <motion.path
      d="M5 10l3.5 3.5L15 7"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    />
  </motion.svg>
);

const AnimatedButton = ({
  children,
  onClick,
  disabled = false,
  className = "",
  type = "button",
}: AnimatedButtonProps) => {
  const [state, setState] = useState<ButtonState>("idle");

  const handleClick = async () => {
    if (state !== "idle" || disabled) return;
    setState("loading");
    try {
      await onClick?.();
      setState("success");
      setTimeout(() => setState("idle"), 1500);
    } catch {
      setState("idle");
    }
  };

  return (
    <motion.button
      type={type}
      disabled={disabled || state !== "idle"}
      onClick={handleClick}
      whileHover={state === "idle" && !disabled ? { scale: 1.02 } : {}}
      whileTap={state === "idle" && !disabled ? { scale: 0.98 } : {}}
      className={`
        relative w-full h-11 rounded-xl bg-primary text-primary-foreground font-semibold text-[15px]
        transition-shadow duration-200
        hover:shadow-[0_0_20px_hsl(var(--primary)/0.3)]
        disabled:opacity-50 disabled:cursor-not-allowed
        flex items-center justify-center
        ${className}
      `}
    >
      <AnimatePresence mode="wait">
        {state === "idle" && (
          <motion.span
            key="text"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {children}
          </motion.span>
        )}
        {state === "loading" && (
          <motion.span
            key="spinner"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
          >
            <Spinner />
          </motion.span>
        )}
        {state === "success" && (
          <motion.span
            key="check"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <Checkmark />
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

export default AnimatedButton;
