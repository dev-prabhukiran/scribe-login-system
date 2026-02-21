import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { User, Settings, LogOut, Keyboard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ProfileDropdown = () => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  // Mock: no auth, show login/signup
  const isLoggedIn = false;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (!isLoggedIn) {
    return (
      <div className="flex items-center gap-2">
        <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          Login
        </Link>
        <Link
          to="/signup"
          className="text-sm px-4 py-1.5 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
        >
          Sign Up
        </Link>
      </div>
    );
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center hover:bg-primary/30 transition-colors"
      >
        <User className="w-4 h-4 text-primary" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-48 rounded-xl bg-popover border border-border shadow-lg backdrop-blur-sm py-1 z-50"
          >
            {[
              { icon: User, label: "Profile" },
              { icon: Settings, label: "Settings" },
              { icon: Keyboard, label: "Shortcuts" },
            ].map(({ icon: Icon, label }) => (
              <button
                key={label}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-foreground hover:bg-accent/50 transition-colors"
                onClick={() => setOpen(false)}
              >
                <Icon className="w-4 h-4 text-muted-foreground" />
                {label}
              </button>
            ))}
            <div className="border-t border-border my-1" />
            <button
              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
              onClick={() => setOpen(false)}
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileDropdown;
