import { Button } from "@/components/ui/button";
import { Leaf, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export default function LoginPage() {
  const { login, loginStatus } = useInternetIdentity();
  const isLoggingIn = loginStatus === "logging-in";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background relative overflow-hidden">
      <div className="blob-bg" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 flex flex-col items-center max-w-md w-full px-6 text-center"
      >
        <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 shadow-card">
          <Leaf className="w-10 h-10 text-primary" />
        </div>

        <h1 className="font-display text-5xl font-bold text-foreground mb-3 leading-tight">
          Wellness
          <br />
          <span className="text-primary">Tracker</span>
        </h1>

        <p className="text-muted-foreground text-lg mb-10 max-w-sm leading-relaxed">
          Track your moods, activities, and discover patterns that help you
          thrive.
        </p>

        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="w-full"
        >
          <Button
            data-ocid="auth.primary_button"
            size="lg"
            className="w-full h-14 text-base font-semibold rounded-xl shadow-glow"
            onClick={login}
            disabled={isLoggingIn}
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Signing in…
              </>
            ) : (
              "Sign in to get started"
            )}
          </Button>
        </motion.div>

        <p className="mt-4 text-sm text-muted-foreground">
          Secure, private sign-in — no passwords needed.
        </p>
      </motion.div>

      <footer className="absolute bottom-6 z-10 text-xs text-muted-foreground">
        © {new Date().getFullYear()}.{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noreferrer"
          className="hover:text-primary transition-colors"
        >
          Built with love using caffeine.ai
        </a>
      </footer>
    </div>
  );
}
