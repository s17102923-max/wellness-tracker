import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface WellnessReport {
    recentActivities: Array<ActivityEntry>;
    recentMoods: Array<MoodEntry>;
}
export type Time = bigint;
export interface ActivityEntry {
    timestamp: Time;
    activity: Activity;
}
export interface UserProfile {
    name: string;
}
export interface MoodEntry {
    mood: Mood;
    timestamp: Time;
}
export enum Activity {
    reading = "reading",
    meditation = "meditation",
    music = "music",
    exercise = "exercise",
    sleep = "sleep"
}
export enum Mood {
    sad = "sad",
    happy = "happy",
    angry = "angry",
    stressed = "stressed",
    neutral = "neutral"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addActivityEntry(activity: Activity): Promise<void>;
    addMoodEntry(mood: Mood): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getActivityHistory(): Promise<Array<ActivityEntry>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getMoodFrequency(): Promise<Array<[Mood, bigint]>>;
    getMoodHistory(): Promise<Array<MoodEntry>>;
    getMoodStreak(): Promise<bigint>;
    getMostRecentMood(): Promise<MoodEntry | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getWellnessReport(): Promise<WellnessReport>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
}
