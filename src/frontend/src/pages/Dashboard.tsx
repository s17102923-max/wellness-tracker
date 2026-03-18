import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowRight,
  BarChart2,
  FileText,
  Flame,
  Lightbulb,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import type { View } from "../components/Layout";
import {
  Mood,
  useAddMoodEntry,
  useGetMoodStreak,
  useGetMostRecentMood,
} from "../hooks/useQueries";

const MOODS: { mood: Mood; emoji: string; label: string; color: string }[] = [
  {
    mood: Mood.happy,
    emoji: "😊",
    label: "Happy",
    color:
      "bg-chart-1/10 hover:bg-chart-1/20 border-chart-1/30 text-[oklch(0.60_0.14_192)]",
  },
  {
    mood: Mood.sad,
    emoji: "😢",
    label: "Sad",
    color:
      "bg-chart-2/10 hover:bg-chart-2/20 border-chart-2/30 text-[oklch(0.52_0.13_262)]",
  },
  {
    mood: Mood.neutral,
    emoji: "😐",
    label: "Neutral",
    color:
      "bg-chart-3/10 hover:bg-chart-3/20 border-chart-3/30 text-[oklch(0.72_0.15_82)]",
  },
  {
    mood: Mood.angry,
    emoji: "😡",
    label: "Angry",
    color:
      "bg-chart-4/10 hover:bg-chart-4/20 border-chart-4/30 text-[oklch(0.54_0.20_25)]",
  },
  {
    mood: Mood.stressed,
    emoji: "😰",
    label: "Stressed",
    color:
      "bg-chart-5/10 hover:bg-chart-5/20 border-chart-5/30 text-[oklch(0.56_0.15_310)]",
  },
];

const QUICK_LINKS: {
  view: View;
  icon: typeof BarChart2;
  label: string;
  description: string;
}[] = [
  {
    view: "activity",
    icon: Zap,
    label: "Log Activity",
    description: "Record what you did today",
  },
  {
    view: "analytics",
    icon: BarChart2,
    label: "Analytics",
    description: "See your mood patterns",
  },
  {
    view: "suggestions",
    icon: Lightbulb,
    label: "Suggestions",
    description: "Get personalized tips",
  },
  {
    view: "report",
    icon: FileText,
    label: "History",
    description: "Review your recent entries",
  },
];

interface DashboardProps {
  onNavigate: (view: View) => void;
  userName: string;
}

export default function Dashboard({ onNavigate, userName }: DashboardProps) {
  const { mutate: addMood, isPending } = useAddMoodEntry();
  const { data: recentMood, isLoading: moodLoading } = useGetMostRecentMood();
  const { data: streak, isLoading: streakLoading } = useGetMoodStreak();

  const streakCount = streak !== undefined ? Number(streak) : 0;

  const handleMood = (mood: Mood, label: string) => {
    addMood(mood, {
      onSuccess: () => toast.success(`Mood logged: ${label} — keep it up! 🌿`),
      onError: () => toast.error("Failed to log mood. Please try again."),
    });
  };

  return (
    <div data-ocid="dashboard.page" className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">
          Good day, {userName}! 🌿
        </h1>
        <p className="text-muted-foreground mt-1">
          {moodLoading ? (
            <Skeleton className="h-4 w-48 inline-block" />
          ) : recentMood ? (
            `Last mood: ${recentMood.mood}`
          ) : (
            "Start by logging your mood below."
          )}
        </p>
      </div>

      {/* Streak Counter */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <Card
          data-ocid="dashboard.streak.card"
          className="bg-primary/5 border-primary/20 shadow-card overflow-hidden relative"
        >
          <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
            <Flame className="w-full h-full text-primary" />
          </div>
          <CardContent className="p-6 flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-primary/15 flex items-center justify-center shrink-0">
              <Flame className="w-8 h-8 text-primary" />
            </div>
            <div>
              {streakLoading ? (
                <Skeleton className="h-10 w-20 mb-1" />
              ) : (
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-5xl font-bold text-primary">
                    {streakCount}
                  </span>
                  <span className="text-lg font-semibold text-muted-foreground">
                    day{streakCount !== 1 ? "s" : ""}
                  </span>
                </div>
              )}
              <p className="text-sm text-muted-foreground font-medium">
                {streakCount > 0
                  ? streakCount >= 7
                    ? "🔥 Incredible streak! Keep it up!"
                    : streakCount >= 3
                      ? "✨ Great consistency!"
                      : "🌱 You're building a habit!"
                  : "Log your mood to start a streak!"}
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Mood Log */}
      <section>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-3">
          How are you feeling?
        </h2>
        <div className="grid grid-cols-5 gap-2 sm:gap-3">
          {MOODS.map(({ mood, emoji, label, color }, i) => (
            <motion.button
              type="button"
              key={mood}
              data-ocid={`mood.item.${i + 1}`}
              disabled={isPending}
              onClick={() => handleMood(mood, label)}
              className={`flex flex-col items-center gap-1.5 p-3 sm:p-4 rounded-xl border-2 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed ${color}`}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: i * 0.07,
                ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-2xl sm:text-3xl">{emoji}</span>
              <span className="text-xs sm:text-sm font-semibold">{label}</span>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Quick links */}
      <section>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-3">
          Explore
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {QUICK_LINKS.map(({ view, label, description }, i) => (
            <motion.div
              key={view}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.1 + i * 0.07,
                ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
              }}
            >
              <Card
                data-ocid={`dashboard.${view}.card`}
                className="cursor-pointer hover:shadow-card transition-all group border-border"
                onClick={() => onNavigate(view)}
              >
                <CardContent className="flex items-center justify-between p-4">
                  <div>
                    <p className="font-semibold text-foreground">{label}</p>
                    <p className="text-sm text-muted-foreground">
                      {description}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
