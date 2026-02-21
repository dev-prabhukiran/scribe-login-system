import { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, User } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
import AuthInput from "@/components/AuthInput";
import PasswordInput from "@/components/PasswordInput";
import PasswordStrength from "@/components/PasswordStrength";
import AnimatedButton from "@/components/AnimatedButton";
import SocialAuth from "@/components/SocialAuth";

const Signup = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Name is required";
    if (!email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Enter a valid email";
    if (!password) e.password = "Password is required";
    else if (password.length < 6) e.password = "Must be at least 6 characters";
    if (confirm !== password) e.confirm = "Passwords don't match";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) throw new Error("validation");
    await new Promise((r) => setTimeout(r, 1500));
    setTimeout(() => navigate("/"), 500);
  };

  const onFormSubmit = (e: FormEvent) => e.preventDefault();
  const isValid = name.length > 0 && email.length > 0 && password.length > 0 && confirm.length > 0;

  return (
    <AuthLayout>
      <form onSubmit={onFormSubmit} className="space-y-5">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold text-foreground">Create your account</h1>
          <p className="text-sm text-muted-foreground mt-1.5">
            Start turning voice into text instantly.
          </p>
        </div>

        <div className="space-y-3.5">
          <AuthInput
            id="name"
            placeholder="Full name"
            value={name}
            onChange={(v) => { setName(v); setErrors((e) => ({ ...e, name: undefined })); }}
            icon={User}
            error={errors.name}
            autoFocus
          />

          <AuthInput
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(v) => { setEmail(v); setErrors((e) => ({ ...e, email: undefined })); }}
            icon={Mail}
            error={errors.email}
          />

          <div>
            <PasswordInput
              id="password"
              placeholder="Create a password"
              value={password}
              onChange={(v) => { setPassword(v); setErrors((e) => ({ ...e, password: undefined })); }}
            />
            <PasswordStrength password={password} />
            {errors.password && (
              <p className="text-xs text-destructive mt-1.5 ml-1">{errors.password}</p>
            )}
          </div>

          <div>
            <PasswordInput
              id="confirm"
              placeholder="Confirm password"
              value={confirm}
              onChange={(v) => { setConfirm(v); setErrors((e) => ({ ...e, confirm: undefined })); }}
            />
            {errors.confirm && (
              <p className="text-xs text-destructive mt-1.5 ml-1">{errors.confirm}</p>
            )}
          </div>
        </div>

        <AnimatedButton onClick={handleSubmit} disabled={!isValid}>
          Create Account
        </AnimatedButton>

        <SocialAuth />

        <p className="text-center text-sm text-muted-foreground pt-2">
          Already have an account?{" "}
          <Link to="/login" className="text-primary link-underline font-medium">
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Signup;
