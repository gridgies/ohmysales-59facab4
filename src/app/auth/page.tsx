'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { z } from "zod";

const authSchema = z.object({
  email: z.string().trim().email({ message: "Ungültige E-Mail-Adresse" }).max(255),
  password: z.string().min(6, { message: "Passwort muss mindestens 6 Zeichen lang sein" }).max(100),
});

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const { signIn, signUp, user } = useAuth();
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  const validateForm = () => {
    try {
      authSchema.parse({ email, password });
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: { email?: string; password?: string } = {};
        error.issues.forEach((issue) => {
          if (issue.path[0] === "email") newErrors.email = issue.message;
          if (issue.path[0] === "password") newErrors.password = issue.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      if (isSignUp) {
        await signUp(email, password);
      } else {
        await signIn(email, password);
      }
      router.push("/");
    } catch (error) {
      // Error handling is done in useAuth
    }
  };

  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-light text-foreground mb-2">
            {isSignUp ? "Konto erstellen" : "Anmelden"}
          </h1>
          <p className="text-muted-foreground font-light">
            {isSignUp
              ? "Erstellen Sie ein Admin-Konto für ohmysales"
              : "Melden Sie sich bei Ihrem Admin-Konto an"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="font-light">
              E-Mail
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="font-light"
              required
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="font-light">
              Passwort
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="font-light"
              required
            />
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-foreground text-background hover:bg-primary hover:text-primary-foreground font-light uppercase tracking-wider"
          >
            {isSignUp ? "Registrieren" : "Anmelden"}
          </Button>
        </form>

        <div className="text-center">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-sm text-muted-foreground hover:text-primary font-light"
          >
            {isSignUp
              ? "Haben Sie bereits ein Konto? Anmelden"
              : "Noch kein Konto? Registrieren"}
          </button>
        </div>
      </div>
    </div>
  );
}
