import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Activity,
  type ActivityEntry,
  Mood,
  type MoodEntry,
  type UserProfile,
  type WellnessReport,
} from "../backend";
import { useActor } from "./useActor";

export { Activity, Mood };
export type { MoodEntry, ActivityEntry, WellnessReport, UserProfile };

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ["currentUserProfile"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error("Actor not available");
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUserProfile"] });
    },
  });
}

export function useGetMoodHistory() {
  const { actor, isFetching } = useActor();
  return useQuery<MoodEntry[]>({
    queryKey: ["moodHistory"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMoodHistory();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetActivityHistory() {
  const { actor, isFetching } = useActor();
  return useQuery<ActivityEntry[]>({
    queryKey: ["activityHistory"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getActivityHistory();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetMoodFrequency() {
  const { actor, isFetching } = useActor();
  return useQuery<Array<[Mood, bigint]>>({
    queryKey: ["moodFrequency"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMoodFrequency();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetMostRecentMood() {
  const { actor, isFetching } = useActor();
  return useQuery<MoodEntry | null>({
    queryKey: ["mostRecentMood"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMostRecentMood();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetMoodStreak() {
  const { actor, isFetching } = useActor();
  return useQuery<bigint>({
    queryKey: ["moodStreak"],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.getMoodStreak();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetWellnessReport() {
  const { actor, isFetching } = useActor();
  return useQuery<WellnessReport>({
    queryKey: ["wellnessReport"],
    queryFn: async () => {
      if (!actor) return { recentActivities: [], recentMoods: [] };
      return actor.getWellnessReport();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddMoodEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (mood: Mood) => {
      if (!actor) throw new Error("Actor not available");
      return actor.addMoodEntry(mood);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["moodHistory"] });
      queryClient.invalidateQueries({ queryKey: ["moodFrequency"] });
      queryClient.invalidateQueries({ queryKey: ["mostRecentMood"] });
      queryClient.invalidateQueries({ queryKey: ["wellnessReport"] });
      queryClient.invalidateQueries({ queryKey: ["moodStreak"] });
    },
  });
}

export function useAddActivityEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (activity: Activity) => {
      if (!actor) throw new Error("Actor not available");
      return actor.addActivityEntry(activity);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activityHistory"] });
      queryClient.invalidateQueries({ queryKey: ["wellnessReport"] });
    },
  });
}
