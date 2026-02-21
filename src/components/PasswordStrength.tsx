import { motion } from "framer-motion";

interface PasswordStrengthProps {
  password: string;
}

const getStrength = (password: string): { level: number; label: string; color: string } => {
  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { level: 1, label: "Weak", color: "hsl(0 84% 60%)" };
  if (score <= 3) return { level: 2, label: "Fair", color: "hsl(40 96% 53%)" };
  return { level: 3, label: "Strong", color: "hsl(var(--primary))" };
};

const PasswordStrength = ({ password }: PasswordStrengthProps) => {
  if (!password) return null;
  const { level, label, color } = getStrength(password);

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="mt-2"
    >
      <div className="flex gap-1 mb-1">
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="h-1 flex-1 rounded-full overflow-hidden bg-muted"
          >
            {i <= level && (
              <motion.div
                className="h-full rounded-full animate-strength-fill"
                style={{ backgroundColor: color }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
              />
            )}
          </motion.div>
        ))}
      </div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-xs"
        style={{ color }}
      >
        {label}
      </motion.p>
    </motion.div>
  );
};

export default PasswordStrength;
