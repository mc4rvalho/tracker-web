/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { ITracker } from "../types/tracker.interface";
import { api, dashboardService } from "../services/api";
import toast from "react-hot-toast";

interface DashboardContextData {
  trackers: ITracker[];
  setTrackers: (trackers: ITracker[]) => void;
  totals: any;
  recents: any;
  analytics: any;
  loadDashboard: () => Promise<void>;
  deleteTracker: (id: string) => Promise<void>;
}

const DashboardContext = createContext<DashboardContextData>(
  {} as DashboardContextData,
);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [trackers, setTrackers] = useState<ITracker[]>([]);
  const [totals, setTotals] = useState<any>(null);
  const [recents, setRecents] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any>(null);

  const loadDashboard = async () => {
    try {
      const [dadosTotals, dadosRecents, dadosAnalytics] = await Promise.all([
        dashboardService.getTotals(),
        dashboardService.getRecents(),
        dashboardService.getAnalytics(),
      ]);

      setTotals(dadosTotals);
      setRecents(dadosRecents);
      setAnalytics(dadosAnalytics);
    } catch (erro) {
      console.error(`Error loading dashboard: ${erro}`);
    }
  };

  useEffect(() => {
    const fetchInitialTrackers = async () => {
      try {
        const [moviesRes, seriesRes, gamesRes, booksRes] = await Promise.all([
          api.get("/movies"),
          api.get("/series"),
          api.get("/games"),
          api.get("/books"),
        ]);

        const allTrackers = [
          ...moviesRes.data,
          ...seriesRes.data,
          ...gamesRes.data,
          ...booksRes.data,
        ];

        allTrackers.sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
        );

        setTrackers(allTrackers);
      } catch (erro) {
        console.error(`Error retrieving trackers: ${erro}`);
      }
    };

    fetchInitialTrackers();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadDashboard();
  }, []);

  const deleteTracker = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this tracker?"))
      return;

    try {
      const trackerAlvo = trackers.find((t) => t.id === id);
      if (!trackerAlvo) return;

      let route = "";
      if (trackerAlvo.category === "Series") {
        route = "/series";
      } else if (trackerAlvo.category === "Movie") {
        route = "/movies";
      } else if (trackerAlvo.category === "Game") {
        route = "/games";
      } else if (trackerAlvo.category === "Book") {
        route = "/books";
      }

      await api.delete(`${route}/${id}`);

      setTrackers(trackers.filter((tracker) => tracker.id !== id));

      loadDashboard();

      toast.success("Tracker deleted!");
    } catch (erro) {
      console.error(`Error deleting tracker: ${erro}`);
      toast.error("Error deleting.");
    }
  };

  return (
    <DashboardContext.Provider
      value={{
        trackers,
        setTrackers,
        totals,
        recents,
        analytics,
        loadDashboard,
        deleteTracker,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useDashboard() {
  return useContext(DashboardContext);
}
