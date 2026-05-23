import { useEffect, useState } from "react";
import { AnalyticsDashboard } from "../components/AnalyticsDashboard";
import { DashboardCards } from "../components/DashboardCards";
import { Header } from "../components/Header";
import { RecentTimeline } from "../components/RecentTimeline";
import { TrackerList } from "../components/TrackerList";
import { useAuth } from "../contexts/AuthContext";
import { useDashboard } from "../contexts/DashboardContext";

export const Dashboard = () => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  const { trackers, totals, recents, analytics, deleteTracker } =
    useDashboard();

  const { logout } = useAuth();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const prepareEdition = () => {
    console.log("Edition moved to Sprint 9");
  };

  return (
    <div className="dark:bg-bg-dark min-h-screen bg-slate-100">
      <Header theme={theme} setTheme={setTheme} logout={logout} />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <DashboardCards
            totals={totals}
            recents={recents}
            analytics={analytics}
          />
          <AnalyticsDashboard analytics={analytics} />
        </div>

        <div className="mt-8 grid grid-cols-1 items-start gap-8 lg:grid-cols-2">
          <RecentTimeline recents={recents} />
        </div>

        <div className="mt-8">
          <TrackerList
            trackers={trackers}
            prepareEdition={prepareEdition}
            deleteTracker={deleteTracker}
          />
        </div>
      </div>
    </div>
  );
};
