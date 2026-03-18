import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "motion/react";
import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Mood, useGetMoodFrequency } from "../hooks/useQueries";

const MOOD_CONFIG: Record<
  Mood,
  { emoji: string; label: string; color: string }
> = {
  [Mood.happy]: { emoji: "😊", label: "Happy", color: "oklch(0.60 0.14 192)" },
  [Mood.sad]: { emoji: "😢", label: "Sad", color: "oklch(0.52 0.13 262)" },
  [Mood.neutral]: {
    emoji: "😐",
    label: "Neutral",
    color: "oklch(0.72 0.15 82)",
  },
  [Mood.angry]: { emoji: "😡", label: "Angry", color: "oklch(0.54 0.20 25)" },
  [Mood.stressed]: {
    emoji: "😰",
    label: "Stressed",
    color: "oklch(0.56 0.15 310)",
  },
};

const SKELETON_KEYS = ["s1", "s2", "s3", "s4", "s5"];

export default function Analytics() {
  const { data, isLoading } = useGetMoodFrequency();

  const chartData = useMemo(() => {
    if (!data) return [];
    return data.map(([mood, count]) => ({
      mood,
      count: Number(count),
      label: MOOD_CONFIG[mood]?.label ?? mood,
      emoji: MOOD_CONFIG[mood]?.emoji ?? "❓",
      color: MOOD_CONFIG[mood]?.color ?? "oklch(0.5 0.1 150)",
    }));
  }, [data]);

  const totalEntries = useMemo(
    () => chartData.reduce((s, d) => s + d.count, 0),
    [chartData],
  );

  return (
    <div data-ocid="analytics.page" className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">
          Mood Analytics
        </h1>
        <p className="text-muted-foreground mt-1">
          Your emotional patterns at a glance
        </p>
      </div>

      {isLoading ? (
        <div data-ocid="analytics.loading_state" className="space-y-3">
          <Skeleton className="h-64 w-full rounded-xl" />
          <div className="grid grid-cols-5 gap-2">
            {SKELETON_KEYS.map((k) => (
              <Skeleton key={k} className="h-16" />
            ))}
          </div>
        </div>
      ) : chartData.length === 0 ? (
        <div data-ocid="analytics.empty_state" className="text-center py-20">
          <p className="text-5xl mb-4">📊</p>
          <p className="font-semibold text-foreground text-lg">
            No mood data yet
          </p>
          <p className="text-muted-foreground mt-1">
            Start logging moods to see your analytics.
          </p>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-4"
        >
          <Card className="shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="font-display text-xl">
                Mood Frequency
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {totalEntries} total entries
              </p>
            </CardHeader>
            <CardContent>
              <div data-ocid="analytics.chart_point" className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{ top: 8, right: 8, bottom: 8, left: -16 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="oklch(0.87 0.04 152)"
                    />
                    <XAxis
                      dataKey="emoji"
                      tick={{ fontSize: 20 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      allowDecimals={false}
                      tick={{ fontSize: 12, fill: "oklch(0.50 0.06 155)" }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (!active || !payload?.length) return null;
                        const d = payload[0].payload;
                        return (
                          <div className="bg-card border border-border rounded-lg px-3 py-2 shadow-card">
                            <p className="font-semibold text-foreground">
                              {d.emoji} {d.label}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {d.count} entries
                            </p>
                          </div>
                        );
                      }}
                    />
                    <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                      {chartData.map((entry) => (
                        <Cell key={entry.mood} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Stat cards */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {chartData.map((entry, i) => (
              <motion.div
                key={entry.mood}
                data-ocid={`analytics.item.${i + 1}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.06 }}
              >
                <Card className="text-center p-3">
                  <p className="text-2xl">{entry.emoji}</p>
                  <p className="font-bold text-xl text-foreground">
                    {entry.count}
                  </p>
                  <p className="text-xs text-muted-foreground">{entry.label}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
