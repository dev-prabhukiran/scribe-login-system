import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import MicIcon from "./MicIcon";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  const location = useLocation();

  return (
    <div className="auth-bg min-h-screen flex flex-col items-center justify-center px-4 py-8">
      {/* Brand */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-2.5 mb-8"
      >
        <MicIcon />
        <motion.span
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="text-2xl font-semibold tracking-tight text-foreground"
        >
          VoiceScribe
        </motion.span>
      </motion.div>

      {/* Card with route transitions */}
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="glass-card w-full max-w-[420px] p-8"
        >
          {children}
        </motion.div>
      </AnimatePresence>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="mt-8 text-xs text-muted-foreground text-center"
      >
        <p>© 2026 VoiceScribe</p>
        <p className="mt-1">
          <span className="link-underline cursor-pointer">Privacy</span>
          <span className="mx-2">·</span>
          <span className="link-underline cursor-pointer">Terms</span>
        </p>
      </motion.footer>
    </div>
  );
};

export default AuthLayout;
