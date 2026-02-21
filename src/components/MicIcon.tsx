import { motion } from "framer-motion";

const MicIcon = ({ size = 32 }: { size?: number }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5, ease: "easeOut" }}
    className="animate-icon-glow inline-flex"
  >
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="hsl(var(--primary))"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" x2="12" y1="19" y2="22" />
      {/* Sound waves */}
      <motion.path
        d="M8.5 7.5c-.7-.5-1.5-.2-1.5.5s.8 1 1.5.5"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.6, 0] }}
        transition={{ duration: 2, repeat: Infinity, delay: 0 }}
        stroke="hsl(var(--primary))"
        strokeWidth="1"
      />
      <motion.path
        d="M15.5 7.5c.7-.5 1.5-.2 1.5.5s-.8 1-1.5.5"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.6, 0] }}
        transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
        stroke="hsl(var(--primary))"
        strokeWidth="1"
      />
    </svg>
  </motion.div>
);

export default MicIcon;
