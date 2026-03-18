import Int "mo:core/Int";
import List "mo:core/List";
import Time "mo:core/Time";
import Order "mo:core/Order";
import Array "mo:core/Array";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  module Mood {
    public type Mood = { #happy; #sad; #neutral; #angry; #stressed };
    public func compare(a : Mood, b : Mood) : Order.Order {
      switch (a, b) {
        case (#happy, #happy) { #equal };
        case (#happy, _) { #less };
        case (#sad, #happy) { #greater };
        case (#sad, #sad) { #equal };
        case (#sad, _) { #less };
        case (#neutral, #happy) { #greater };
        case (#neutral, #sad) { #greater };
        case (#neutral, #neutral) { #equal };
        case (#neutral, _) { #less };
        case (#angry, #stressed) { #less };
        case (#angry, #angry) { #equal };
        case (#angry, _) { #greater };
        case (#stressed, #stressed) { #equal };
        case (#stressed, _) { #greater };
      };
    };
  };
  type Mood = Mood.Mood;
  type Activity = { #exercise; #meditation; #reading; #music; #sleep };

  type MoodEntry = {
    mood : Mood;
    timestamp : Time.Time;
  };

  module MoodEntry {
    public func compare(entry1 : MoodEntry, entry2 : MoodEntry) : Order.Order {
      Int.compare(entry1.timestamp : Time.Time, entry2.timestamp : Time.Time);
    };
  };

  type ActivityEntry = {
    activity : Activity;
    timestamp : Time.Time;
  };

  module ActivityEntry {
    public func compare(entry1 : ActivityEntry, entry2 : ActivityEntry) : Order.Order {
      Int.compare(entry1.timestamp : Time.Time, entry2.timestamp : Time.Time);
    };
  };

  public type UserProfile = {
    name : Text;
  };

  let moodEntries = Map.empty<Principal, List.List<MoodEntry>>();
  let activityEntries = Map.empty<Principal, List.List<ActivityEntry>>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func addMoodEntry(mood : Mood) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add mood entries");
    };
    let entry : MoodEntry = {
      mood;
      timestamp = Time.now();
    };

    let currentEntries = switch (moodEntries.get(caller)) {
      case (null) { List.empty<MoodEntry>() };
      case (?entries) { entries };
    };

    currentEntries.add(entry);
    moodEntries.add(caller, currentEntries);
  };

  public shared ({ caller }) func addActivityEntry(activity : Activity) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add activity entries");
    };
    let entry : ActivityEntry = {
      activity;
      timestamp = Time.now();
    };

    let currentEntries = switch (activityEntries.get(caller)) {
      case (null) { List.empty<ActivityEntry>() };
      case (?entries) { entries };
    };

    currentEntries.add(entry);
    activityEntries.add(caller, currentEntries);
  };

  public query ({ caller }) func getMoodHistory() : async [MoodEntry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view mood history");
    };
    switch (moodEntries.get(caller)) {
      case (null) { [] };
      case (?entries) { entries.sort().toArray() };
    };
  };

  public query ({ caller }) func getActivityHistory() : async [ActivityEntry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view activity history");
    };
    switch (activityEntries.get(caller)) {
      case (null) { [] };
      case (?entries) { entries.sort().toArray() };
    };
  };

  public query ({ caller }) func getMoodFrequency() : async [(Mood, Nat)] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view mood frequency");
    };

    let moodCounts = Map.empty<Mood, Nat>();

    switch (moodEntries.get(caller)) {
      case (null) {};
      case (?entries) {
        entries.forEach(
          func(entry) {
            switch (moodCounts.get(entry.mood)) {
              case (null) {
                moodCounts.add(entry.mood, 1);
              };
              case (?count) {
                moodCounts.add(entry.mood, count + 1);
              };
            };
          }
        );
      };
    };

    moodCounts.toArray();
  };

  public query ({ caller }) func getMostRecentMood() : async ?MoodEntry {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view most recent mood");
    };

    switch (moodEntries.get(caller)) {
      case (null) { null };
      case (?entries) {
        if (entries.isEmpty()) { return null };

        let sortedEntries = entries.toArray().sort();
        let arraySize = sortedEntries.size();
        if (arraySize == 0) {
          null;
        } else {
          ?sortedEntries[arraySize - 1];
        };
      };
    };
  };

  public query ({ caller }) func getMoodStreak() : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view mood streak");
    };

    switch (moodEntries.get(caller)) {
      case (null) { 0 };
      case (?entries) {
        if (entries.isEmpty()) { return 0 };

        let sortedEntries = entries.toArray().sort();
        let arraySize = sortedEntries.size();
        if (arraySize == 0) { return 0 };

        let nanosPerDay : Int = 86_400_000_000_000;
        var streak : Nat = 1;
        var currentDay : Int = sortedEntries[arraySize - 1].timestamp / nanosPerDay;
        
        var i : Nat = arraySize - 1;
        while (i > 0) {
          i -= 1;
          let entryDay : Int = sortedEntries[i].timestamp / nanosPerDay;
          
          if (currentDay - entryDay == 1) {
            streak += 1;
            currentDay := entryDay;
          } else if (currentDay - entryDay > 1) {
            return streak;
          };
        };

        streak;
      };
    };
  };

  type WellnessReport = {
    recentMoods : [MoodEntry];
    recentActivities : [ActivityEntry];
  };

  public query ({ caller }) func getWellnessReport() : async WellnessReport {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view wellness report");
    };

    let recentMoods = switch (moodEntries.get(caller)) {
      case (null) { [] };
      case (?entries) {
        let sorted = entries.toArray().sort();
        let len = sorted.size();
        if (len <= 5) {
          sorted;
        } else {
          Array.tabulate(5, func(i : Nat) : MoodEntry { sorted[len - 5 + i] });
        };
      };
    };

    let recentActivities = switch (activityEntries.get(caller)) {
      case (null) { [] };
      case (?entries) {
        let sorted = entries.toArray().sort();
        let len = sorted.size();
        if (len <= 5) {
          sorted;
        } else {
          Array.tabulate(5, func(i : Nat) : ActivityEntry { sorted[len - 5 + i] });
        };
      };
    };

    {
      recentMoods;
      recentActivities;
    };
  };
};
