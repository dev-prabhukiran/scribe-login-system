import { useState, FormEvent } from "react";
import { Link } from "react-router-dom";
import { Mail, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AuthLayout from "@/components/AuthLayout";
import AuthInput from "@/components/AuthInput";
import AnimatedButton from "@/components/AnimatedButton";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError("Enter a valid email");
      throw new Error("validation");
    }
    await new Promise((r) => setTimeout(r, 1500));
    setSent(true);
  };

  const onFormSubmit = (e: FormEvent) => e.preventDefault();

  return (
    <AuthLayout>
      <AnimatePresence mode="wait">
        {!sent ? (
          <motion.form
            key="form"
            onSubmit={onFormSubmit}
            className="space-y-5"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="text-center mb-6">
              <h1 className="text-2xl font-semibold text-foreground">Reset your password</h1>
              <p className="text-sm text-muted-foreground mt-1.5">
                Enter your email and we'll send you a reset link.
              </p>
            </div>

            <AuthInput
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(v) => { setEmail(v); setError(""); }}
              icon={Mail}
              error={error}
              autoFocus
            />

            <AnimatedButton onClick={handleSubmit} disabled={!email}>
              Send Reset Link
            </AnimatedButton>

            <p className="text-center text-sm text-muted-foreground pt-2">
              <Link to="/login" className="text-primary link-underline font-medium">
                Back to sign in
              </Link>
            </p>
          </motion.form>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-center py-4"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
              className="inline-flex mb-4"
            >
              <CheckCircle className="w-12 h-12 text-primary" />
            </motion.div>
            <h2 className="text-xl font-semibold text-foreground mb-2">Check your email</h2>
            <p className="text-sm text-muted-foreground mb-6">
              We've sent reset instructions to <strong className="text-foreground">{email}</strong>
            </p>
            <Link
              to="/login"
              className="text-sm text-primary link-underline font-medium"
            >
              Back to sign in
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </AuthLayout>
  );
};

export default ForgotPassword;
