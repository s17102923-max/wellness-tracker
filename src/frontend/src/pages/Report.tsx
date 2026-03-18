import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "motion/react";
import { Activity, Mood, useGetWellnessReport } from "../hooks/useQueries";
import { formatTimestamp } from "../lib/formatTime";

const MOOD_EMOJI: Record<Mood, string> = {
  [Mood.happy]: "😊",
  [Mood.sad]: "😢",
  [Mood.neutral]: "😐",
  [Mood.angry]: "😡",
  [Mood.stressed]: "😰",
};

const ACTIVITY_EMOJI: Record<Activity, string> = {
  [Activity.exercise]: "🏃",
  [Activity.meditation]: "🧘",
  [Activity.reading]: "📚",
  [Activity.music]: "🎵",
  [Activity.sleep]: "😴",
};

const MOOD_COLOR: Record<Mood, string> = {
  [Mood.happy]: "bg-chart-1/15 text-[oklch(0.40_0.12_192)] border-chart-1/30",
  [Mood.sad]: "bg-chart-2/15 text-[oklch(0.38_0.11_262)] border-chart-2/30",
  [Mood.neutral]: "bg-chart-3/15 text-[oklch(0.50_0.12_82)] border-chart-3/30",
  [Mood.angry]: "bg-chart-4/15 text-[oklch(0.40_0.16_25)] border-chart-4/30",
  [Mood.stressed]:
    "bg-chart-5/15 text-[oklch(0.40_0.12_310)] border-chart-5/30",
};

export default function Report() {
  const { data, isLoading } = useGetWellnessReport();

  return (
    <div data-ocid="report.page" className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">
          Wellness Report
        </h1>
        <p className="text-muted-foreground mt-1">Your recent history</p>
      </div>

      {isLoading ? (
        <div data-ocid="report.loading_state" className="space-y-3">
          <Skeleton className="h-48 w-full rounded-xl" />
          <Skeleton className="h-48 w-full rounded-xl" />
        </div>
      ) : (
        <div className="space-y-5">
          {/* Recent Moods */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="font-display text-xl flex items-center gap-2">
                  <span>😊</span> Recent Moods
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!data?.recentMoods?.length ? (
                  <p
                    data-ocid="report.mood.empty_state"
                    className="text-muted-foreground text-sm py-4 text-center"
                  >
                    No mood entries yet. Start logging!
                  </p>
                ) : (
                  <ul className="space-y-2">
                    {data.recentMoods.map((entry, i) => (
                      <li
                        key={`mood-${entry.timestamp.toString()}-${i}`}
                        data-ocid={`report.mood.item.${i + 1}`}
                        className="flex items-center justify-between py-2.5 border-b border-border last:border-0"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">
                            {MOOD_EMOJI[entry.mood]}
                          </span>
                          <Badge
                            variant="outline"
                            className={`capitalize text-xs font-semibold ${MOOD_COLOR[entry.mood]}`}
                          >
                            {entry.mood}
                          </Badge>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {formatTimestamp(entry.timestamp)}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Activities */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="font-display text-xl flex items-center gap-2">
                  <span>🏃</span> Recent Activities
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!data?.recentActivities?.length ? (
                  <p
                    data-ocid="report.activity.empty_state"
                    className="text-muted-foreground text-sm py-4 text-center"
                  >
                    No activity entries yet. Start logging!
                  </p>
                ) : (
                  <ul className="space-y-2">
                    {data.recentActivities.map((entry, i) => (
                      <li
                        key={`activity-${entry.timestamp.toString()}-${i}`}
                        data-ocid={`report.activity.item.${i + 1}`}
                        className="flex items-center justify-between py-2.5 border-b border-border last:border-0"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">
                            {ACTIVITY_EMOJI[entry.activity]}
                          </span>
                          <span className="text-sm font-medium capitalize text-foreground">
                            {entry.activity}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {formatTimestamp(entry.timestamp)}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}
    </div>
  );
}
