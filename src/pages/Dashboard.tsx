import { useEffect, useState } from "react";
import { AnalyticsDashboard } from "../components/AnalyticsDashboard";
import { DashboardCards } from "../components/DashboardCards";
import { Header } from "../components/Header";
import { RecentTimeline } from "../components/RecentTimeline";
import { TrackerList } from "../components/TrackerList";
import { useAuth } from "../contexts/AuthContext";
import { useDashboard } from "../contexts/DashboardContext";
import { useModal } from "../contexts/ModalContext";
import type { ITracker } from "../types/tracker.interface";

export const Dashboard = () => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  const { setIsModalOpen } = useModal();

  const {
    trackers,
    totals,
    recents,
    analytics,
    deleteTracker,
    setEditingTracker,
  } = useDashboard();

  const { logout } = useAuth();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const prepareEdition = (tracker: ITracker) => {
    setEditingTracker(tracker);
    setIsModalOpen(true);
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
