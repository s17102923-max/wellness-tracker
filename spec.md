# Wellness Tracker

## Current State
No existing frontend/backend code. Rebuilding from scratch based on conversation history.

## Requested Changes (Diff)

### Add
- User authentication (login/register) using Internet Identity
- Dashboard with streak counter
- Mood tracking (log moods from predefined list)
- Activity tracking (log activities from predefined list)
- Analytics screen with mood frequency chart
- Personalized suggestions based on latest mood
- Report/history screen showing last 5 moods and activities
- Input validation and error messages

### Modify
- N/A

### Remove
- N/A

## Implementation Plan
1. Select authorization component
2. Generate Motoko backend with users, moods, activities data models
3. Build frontend with all screens: login, dashboard, mood, activity, analytics, suggestions, report
4. Add streak counter on dashboard
5. Add input validation throughout
