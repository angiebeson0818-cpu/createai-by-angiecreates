import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useCreateUserProfile, useUserProfile } from "../hooks/useQueries";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

export default function AuthModal({ open, onClose }: AuthModalProps) {
  const [username, setUsername] = useState("");
  const [step, setStep] = useState<"login" | "signup">("login");
  const { login, isLoggingIn } = useInternetIdentity();
  const { data: profile } = useUserProfile();
  const createProfile = useCreateUserProfile();

  const handleLogin = async () => {
    login();
    // After login the identity will be set; if no profile exists, prompt signup
    if (!profile) {
      setTimeout(() => setStep("signup"), 800);
    } else {
      onClose();
    }
  };

  const handleSignup = async () => {
    if (!username.trim()) return;
    try {
      await createProfile.mutateAsync(username.trim());
      toast.success("Welcome to CREATEai by angieCREATEs!");
      onClose();
    } catch {
      toast.error("Failed to create profile. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        className="bg-card border-border max-w-md"
        data-ocid="auth.dialog"
      >
        {/* Shimmer top accent */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent rounded-t-lg" />

        <DialogHeader>
          <div className="flex items-center gap-2.5 mb-2">
            <img
              src="/assets/onyx_500-019d4b2d-dc4c-7172-9071-c2b206069bbc.png"
              alt="CREATEai Logo"
              className="w-7 h-7 object-contain rounded-full ring-1 ring-gold/30"
            />
            <DialogTitle className="font-display text-2xl gradient-text">
              {step === "login" ? "Welcome to CREATEai" : "Create Your Profile"}
            </DialogTitle>
          </div>
          {step === "login" && (
            <p className="text-xs text-muted-foreground font-body italic">
              by angieCREATEs — fashion AI for every visionary
            </p>
          )}
        </DialogHeader>

        {step === "login" ? (
          <div className="space-y-6 py-2" data-ocid="auth.login_step">
            <p className="text-muted-foreground text-sm font-body leading-relaxed">
              Sign in with Internet Identity to access your studios, designs,
              credits, and creative workspace.
            </p>
            <Button
              className="w-full bg-gold text-background hover:opacity-90 font-semibold h-12 font-body"
              onClick={handleLogin}
              disabled={isLoggingIn}
              data-ocid="auth.primary_button"
            >
              {isLoggingIn ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4 mr-2" />
              )}
              {isLoggingIn ? "Connecting..." : "Sign In with Internet Identity"}
            </Button>
            <p className="text-xs text-muted-foreground text-center font-body">
              By signing in you agree to our{" "}
              <a href="/terms" className="text-gold hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="/privacy" className="text-gold hover:underline">
                Privacy Policy
              </a>
            </p>
          </div>
        ) : (
          <div className="space-y-6 py-2" data-ocid="auth.signup_step">
            <p className="text-muted-foreground text-sm font-body">
              Choose a display name for your CREATEai profile.
            </p>
            <div className="space-y-2">
              <Label htmlFor="username" className="font-body text-sm">
                Display Name
              </Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="visionary_designer"
                className="bg-background border-border font-body"
                data-ocid="auth.username_input"
                onKeyDown={(e) => e.key === "Enter" && handleSignup()}
              />
            </div>
            <Button
              className="w-full bg-gold text-background hover:opacity-90 font-semibold h-12 font-body"
              onClick={handleSignup}
              disabled={createProfile.isPending || !username.trim()}
              data-ocid="auth.submit_button"
            >
              {createProfile.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : null}
              {createProfile.isPending ? "Creating..." : "Start Creating"}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
