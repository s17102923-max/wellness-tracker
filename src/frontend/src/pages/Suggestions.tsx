import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "motion/react";
import type { View } from "../components/Layout";
import { Mood, useGetMostRecentMood } from "../hooks/useQueries";

const TIPS: Record<Mood, { message: string; emoji: string; color: string }> = {
  [Mood.happy]: {
    emoji: "😊",
    message:
      "Keep up the good vibes! Share a smile today. Your positivity is contagious — spread it around!",
    color: "bg-chart-1/10 border-chart-1/30",
  },
  [Mood.sad]: {
    emoji: "😢",
    message:
      "It's okay to feel down. Listen to music or meditate. Give yourself permission to rest and heal.",
    color: "bg-chart-2/10 border-chart-2/30",
  },
  [Mood.neutral]: {
    emoji: "😐",
    message:
      "Maybe do some light stretching or a short walk. Small actions create big changes over time.",
    color: "bg-chart-3/10 border-chart-3/30",
  },
  [Mood.angry]: {
    emoji: "😡",
    message:
      "Take deep breaths, count to 10, or meditate. This feeling is temporary — you've got this.",
    color: "bg-chart-4/10 border-chart-4/30",
  },
  [Mood.stressed]: {
    emoji: "😰",
    message:
      "Break tasks into small steps. You got this! One thing at a time — progress over perfection.",
    color: "bg-chart-5/10 border-chart-5/30",
  },
};

const GENERAL_TIPS = [
  {
    id: "hydration",
    emoji: "💧",
    tip: "Stay hydrated — drink at least 8 glasses of water today.",
  },
  {
    id: "sunlight",
    emoji: "🌅",
    tip: "Step outside for 10 minutes of natural light.",
  },
  {
    id: "breathing",
    emoji: "🧘",
    tip: "Try a 5-minute breathing exercise to center yourself.",
  },
  {
    id: "screens",
    emoji: "📱",
    tip: "Take a 30-minute break from screens this afternoon.",
  },
];

interface Props {
  onNavigate: (view: View) => void;
}

export default function Suggestions({ onNavigate }: Props) {
  const { data: recentMood, isLoading } = useGetMostRecentMood();

  const tip = recentMood ? TIPS[recentMood.mood] : null;

  return (
    <div data-ocid="suggestions.page" className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">
          Daily Suggestions
        </h1>
        <p className="text-muted-foreground mt-1">
          Personalized wellness tips for you
        </p>
      </div>

      {isLoading ? (
        <div data-ocid="suggestions.loading_state">
          <Skeleton className="h-36 w-full rounded-xl" />
        </div>
      ) : tip ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <Card
            data-ocid="suggestions.card"
            className={`border-2 shadow-card ${tip.color}`}
          >
            <CardContent className="p-6">
              <p className="text-5xl mb-4">{tip.emoji}</p>
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-2">
                Based on your last mood: {recentMood?.mood}
              </p>
              <p className="text-foreground text-lg leading-relaxed font-medium">
                {tip.message}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <Card
          data-ocid="suggestions.empty_state"
          className="border-2 border-dashed"
        >
          <CardContent className="p-8 text-center">
            <p className="text-5xl mb-3">💡</p>
            <p className="font-semibold text-foreground">No mood data yet</p>
            <p className="text-muted-foreground mt-1 mb-4">
              Log a mood to get personalized suggestions!
            </p>
            <Button
              data-ocid="suggestions.primary_button"
              onClick={() => onNavigate("mood")}
              variant="outline"
            >
              Log your mood
            </Button>
          </CardContent>
        </Card>
      )}

      {/* General tips */}
      <section>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-3">
          General Wellness Tips
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {GENERAL_TIPS.map(({ id, emoji, tip: t }, i) => (
            <motion.div
              key={id}
              data-ocid={`suggestions.item.${i + 1}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.07 }}
            >
              <Card className="p-4">
                <p className="text-xl mb-1">{emoji}</p>
                <p className="text-sm text-foreground">{t}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
