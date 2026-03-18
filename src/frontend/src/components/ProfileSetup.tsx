import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Leaf, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { useSaveCallerUserProfile } from "../hooks/useQueries";

export default function ProfileSetup() {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const { mutate, isPending } = useSaveCallerUserProfile();

  const validate = (value: string): string => {
    if (!value.trim()) return "Name is required.";
    if (value.trim().length < 2) return "Name must be at least 2 characters.";
    if (value.trim().length > 50) return "Name must be 50 characters or fewer.";
    if (!/^[a-zA-Z\s'-]+$/.test(value.trim()))
      return "Name can only contain letters, spaces, hyphens, and apostrophes.";
    return "";
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    if (error) setError(validate(e.target.value));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validate(name);
    if (validationError) {
      setError(validationError);
      return;
    }
    mutate(
      { name: name.trim() },
      {
        onError: () => setError("Failed to save profile. Please try again."),
      },
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      <div className="blob-bg" />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-sm px-6"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Leaf className="w-8 h-8 text-primary" />
          </div>
          <h2 className="font-display text-3xl font-bold text-foreground">
            Welcome!
          </h2>
          <p className="text-muted-foreground mt-2">What should we call you?</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="space-y-2">
            <Label htmlFor="name">Your name</Label>
            <Input
              id="name"
              data-ocid="profile.input"
              value={name}
              onChange={handleChange}
              onBlur={() => setError(validate(name))}
              placeholder="e.g. Alex"
              className={`h-12 ${error ? "border-destructive focus-visible:ring-destructive" : ""}`}
              autoFocus
              autoComplete="given-name"
              aria-describedby={error ? "name-error" : undefined}
              aria-invalid={!!error}
            />
            {error && (
              <p
                id="name-error"
                data-ocid="profile.error_state"
                className="text-sm text-destructive flex items-center gap-1"
                role="alert"
              >
                {error}
              </p>
            )}
          </div>
          <Button
            data-ocid="profile.submit_button"
            type="submit"
            className="w-full h-12"
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            {isPending ? "Saving…" : "Start my wellness journey"}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
