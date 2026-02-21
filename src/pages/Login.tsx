import { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
import AuthInput from "@/components/AuthInput";
import PasswordInput from "@/components/PasswordInput";
import AnimatedButton from "@/components/AnimatedButton";
import SocialAuth from "@/components/SocialAuth";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const e: typeof errors = {};
    if (!email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Enter a valid email";
    if (!password) e.password = "Password is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) throw new Error("validation");
    await new Promise((r) => setTimeout(r, 1500));
    // Navigate after success animation
    setTimeout(() => navigate("/"), 500);
  };

  const onFormSubmit = (e: FormEvent) => {
    e.preventDefault();
  };

  const isValid = email.length > 0 && password.length > 0;

  return (
    <AuthLayout>
      <form onSubmit={onFormSubmit} className="space-y-5">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold text-foreground">Welcome back</h1>
          <p className="text-sm text-muted-foreground mt-1.5">
            Speak smarter. Sign in to continue.
          </p>
        </div>

        <div className="space-y-3.5">
          <AuthInput
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(v) => { setEmail(v); setErrors((e) => ({ ...e, email: undefined })); }}
            icon={Mail}
            error={errors.email}
            autoFocus
          />

          <div>
            <PasswordInput
              id="password"
              value={password}
              onChange={(v) => { setPassword(v); setErrors((e) => ({ ...e, password: undefined })); }}
            />
            {errors.password && (
              <p className="text-xs text-destructive mt-1.5 ml-1">{errors.password}</p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="w-3.5 h-3.5 rounded border-border accent-primary"
            />
            <span className="text-xs text-muted-foreground">Remember me</span>
          </label>
          <Link
            to="/forgot-password"
            className="text-xs text-primary link-underline font-medium"
          >
            Forgot password?
          </Link>
        </div>

        <AnimatedButton onClick={handleSubmit} disabled={!isValid}>
          Sign In
        </AnimatedButton>

        <SocialAuth />

        <p className="text-center text-sm text-muted-foreground pt-2">
          Don't have an account?{" "}
          <Link to="/signup" className="text-primary link-underline font-medium">
            Sign up
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Login;
