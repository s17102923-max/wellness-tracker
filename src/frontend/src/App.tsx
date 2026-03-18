import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import Layout, { type View } from "./components/Layout";
import LoginPage from "./components/LoginPage";
import ProfileSetup from "./components/ProfileSetup";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { useGetCallerUserProfile } from "./hooks/useQueries";
import ActivityTracker from "./pages/ActivityTracker";
import Analytics from "./pages/Analytics";
import Dashboard from "./pages/Dashboard";
import MoodTracker from "./pages/MoodTracker";
import Report from "./pages/Report";
import Suggestions from "./pages/Suggestions";

const queryClient = new QueryClient();

function AppContent() {
  const { identity, isInitializing } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const {
    data: userProfile,
    isLoading: profileLoading,
    isFetched,
  } = useGetCallerUserProfile();

  const [currentView, setCurrentView] = useState<View>("dashboard");

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="space-y-3 w-48">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const showProfileSetup =
    isAuthenticated && !profileLoading && isFetched && userProfile === null;

  if (profileLoading && !isFetched) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="space-y-3 w-48">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    );
  }

  if (showProfileSetup) {
    return <ProfileSetup />;
  }

  const userName = userProfile?.name ?? "Friend";

  const renderView = () => {
    switch (currentView) {
      case "dashboard":
        return <Dashboard onNavigate={setCurrentView} userName={userName} />;
      case "mood":
        return <MoodTracker onNavigate={setCurrentView} />;
      case "activity":
        return <ActivityTracker onNavigate={setCurrentView} />;
      case "analytics":
        return <Analytics />;
      case "suggestions":
        return <Suggestions onNavigate={setCurrentView} />;
      case "report":
        return <Report />;
      default:
        return <Dashboard onNavigate={setCurrentView} userName={userName} />;
    }
  };

  return (
    <Layout
      currentView={currentView}
      onNavigate={setCurrentView}
      userName={userName}
    >
      {renderView()}
    </Layout>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
      <Toaster richColors position="top-right" />
    </QueryClientProvider>
  );
}
