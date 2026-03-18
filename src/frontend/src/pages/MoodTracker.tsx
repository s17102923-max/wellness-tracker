import { Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import type { View } from "../components/Layout";
import { Mood, useAddMoodEntry } from "../hooks/useQueries";

const MOODS: {
  mood: Mood;
  emoji: string;
  label: string;
  description: string;
  color: string;
  bg: string;
}[] = [
  {
    mood: Mood.happy,
    emoji: "😊",
    label: "Happy",
    description: "Feeling great and positive",
    color: "oklch(0.60 0.14 192)",
    bg: "bg-chart-1/10 border-chart-1/40 hover:bg-chart-1/20",
  },
  {
    mood: Mood.sad,
    emoji: "😢",
    label: "Sad",
    description: "Feeling down or blue",
    color: "oklch(0.52 0.13 262)",
    bg: "bg-chart-2/10 border-chart-2/40 hover:bg-chart-2/20",
  },
  {
    mood: Mood.neutral,
    emoji: "😐",
    label: "Neutral",
    description: "Just going through the day",
    color: "oklch(0.72 0.15 82)",
    bg: "bg-chart-3/10 border-chart-3/40 hover:bg-chart-3/20",
  },
  {
    mood: Mood.angry,
    emoji: "😡",
    label: "Angry",
    description: "Feeling frustrated or upset",
    color: "oklch(0.54 0.20 25)",
    bg: "bg-chart-4/10 border-chart-4/40 hover:bg-chart-4/20",
  },
  {
    mood: Mood.stressed,
    emoji: "😰",
    label: "Stressed",
    description: "Feeling overwhelmed",
    color: "oklch(0.56 0.15 310)",
    bg: "bg-chart-5/10 border-chart-5/40 hover:bg-chart-5/20",
  },
];

interface Props {
  onNavigate: (view: View) => void;
}

export default function MoodTracker({ onNavigate }: Props) {
  const { mutate, isPending } = useAddMoodEntry();

  const handleSelect = (mood: Mood, label: string) => {
    mutate(mood, {
      onSuccess: () => {
        toast.success(`${label} mood logged! 🌿`);
        onNavigate("dashboard");
      },
      onError: () => toast.error("Failed to save. Try again."),
    });
  };

  return (
    <div data-ocid="mood.page" className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">
          Mood Tracker
        </h1>
        <p className="text-muted-foreground mt-1">
          How are you feeling right now?
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {MOODS.map(({ mood, emoji, label, description, bg }, i) => (
          <motion.button
            key={mood}
            data-ocid={`mood.item.${i + 1}`}
            disabled={isPending}
            onClick={() => handleSelect(mood, label)}
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
