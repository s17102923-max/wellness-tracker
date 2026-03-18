import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import {
  BarChart2,
  FileText,
  LayoutDashboard,
  Leaf,
  Lightbulb,
  LogOut,
  Smile,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import type { ReactNode } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export type View =
  | "dashboard"
  | "mood"
  | "activity"
  | "analytics"
  | "suggestions"
  | "report";

interface LayoutProps {
  children: ReactNode;
  currentView: View;
  onNavigate: (view: View) => void;
  userName: string;
}

const navItems: { view: View; label: string; icon: typeof LayoutDashboard }[] =
  [
    { view: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { view: "mood", label: "Mood", icon: Smile },
    { view: "activity", label: "Activity", icon: Zap },
    { view: "analytics", label: "Analytics", icon: BarChart2 },
    { view: "suggestions", label: "Suggestions", icon: Lightbulb },
    { view: "report", label: "Report", icon: FileText },
  ];

export default function Layout({
  children,
  currentView,
  onNavigate,
  userName,
}: LayoutProps) {
  const { clear } = useInternetIdentity();
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="blob-bg" />

      {/* Header */}
      <header className="relative z-10 border-b border-border bg-card/80 backdrop-blur-sm sticky top-0">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center">
              <Leaf className="w-4 h-4 text-primary" />
            </div>
            <span className="font-display font-bold text-lg text-foreground">
              Wellness Tracker
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden sm:block">
              Hi, {userName} 👋
            </span>
            <Button
              data-ocid="nav.button"
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-muted-foreground hover:text-foreground gap-1.5"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sign out</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Bottom nav (mobile) / Side nav (desktop) */}
      <div className="relative z-10 flex flex-1">
        {/* Desktop sidebar */}
        <nav className="hidden md:flex flex-col w-52 shrink-0 border-r border-border bg-card/60 backdrop-blur-sm p-3 gap-1">
          {navItems.map(({ view, label, icon: Icon }) => (
            <button
              type="button"
              key={view}
              data-ocid={`nav.${view}.link`}
              onClick={() => onNavigate(view)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                currentView === view
                  ? "bg-primary text-primary-foreground shadow-card"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </button>
          ))}
        </nav>

        {/* Main content */}
        <main className="flex-1 overflow-auto">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-3xl mx-auto px-4 py-8"
          >
            {children}
          </motion.div>
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-20 bg-card/90 backdrop-blur-sm border-t border-border flex">
        {navItems.map(({ view, icon: Icon }) => (
          <button
            type="button"
            key={view}
            data-ocid={`nav.${view}.link`}
            onClick={() => onNavigate(view)}
            className={`flex-1 flex flex-col items-center justify-center py-2.5 gap-1 text-[10px] font-medium transition-colors ${
              currentView === view ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <Icon className="h-5 w-5" />
            {view.charAt(0).toUpperCase() + view.slice(1)}
          </button>
        ))}
      </nav>

      <footer className="relative z-10 text-center py-4 text-xs text-muted-foreground border-t border-border mb-14 md:mb-0 bg-card/40">
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
