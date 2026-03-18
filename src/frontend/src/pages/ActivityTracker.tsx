import { Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import type { View } from "../components/Layout";
import { Activity, useAddActivityEntry } from "../hooks/useQueries";

const ACTIVITIES: {
  activity: Activity;
  emoji: string;
  label: string;
  description: string;
  bg: string;
}[] = [
  {
    activity: Activity.exercise,
    emoji: "🏃",
    label: "Exercise",
    description: "Physical workout or movement",
    bg: "bg-chart-1/10 border-chart-1/40 hover:bg-chart-1/20",
  },
  {
    activity: Activity.meditation,
    emoji: "🧘",
    label: "Meditation",
    description: "Mindfulness or breathwork",
    bg: "bg-chart-2/10 border-chart-2/40 hover:bg-chart-2/20",
  },
  {
    activity: Activity.reading,
    emoji: "📚",
    label: "Reading",
    description: "Books, articles, or learning",
    bg: "bg-chart-3/10 border-chart-3/40 hover:bg-chart-3/20",
  },
  {
    activity: Activity.music,
    emoji: "🎵",
    label: "Music",
    description: "Listening or playing music",
    bg: "bg-chart-4/10 border-chart-4/40 hover:bg-chart-4/20",
  },
  {
    activity: Activity.sleep,
    emoji: "😴",
    label: "Sleep",
    description: "Rest and recovery",
    bg: "bg-chart-5/10 border-chart-5/40 hover:bg-chart-5/20",
  },
];

interface Props {
  onNavigate: (view: View) => void;
}

export default function ActivityTracker({ onNavigate }: Props) {
  const { mutate, isPending } = useAddActivityEntry();

  const handleSelect = (activity: Activity, label: string) => {
    mutate(activity, {
      onSuccess: () => {
        toast.success(`${label} logged! Keep it up 💪`);
        onNavigate("dashboard");
      },
      onError: () => toast.error("Failed to save. Try again."),
    });
  };

  return (
    <div data-ocid="activity.page" className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">
          Activity Tracker
        </h1>
        <p className="text-muted-foreground mt-1">What did you do today?</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {ACTIVITIES.map(({ activity, emoji, label, description, bg }, i) => (
          <motion.button
            key={activity}
            data-ocid={`activity.item.${i + 1}`}
            disabled={isPending}
            onClick={() => handleSelect(activity, label)}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className={`flex items-center gap-4 p-5 rounded-xl border-2 text-left transition-all disabled:opacity-50 disabled:cursor-not-allowed ${bg}`}
          >
            {isPending ? (
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            ) : (
              <span className="text-4xl">{emoji}</span>
            )}
            <div>
              <p className="font-semibold text-foreground text-base">{label}</p>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
