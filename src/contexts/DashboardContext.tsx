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
  editingTracker: ITracker | null;
  setEditingTracker: React.Dispatch<React.SetStateAction<ITracker | null>>;
  quickUpdateProgress: (tracker: ITracker) => Promise<void>;
}

const DashboardContext = createContext<DashboardContextData>(
  {} as DashboardContextData,
);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [trackers, setTrackers] = useState<ITracker[]>([]);
  const [totals, setTotals] = useState<any>(null);
  const [recents, setRecents] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any>(null);

  const [editingTracker, setEditingTracker] = useState<ITracker | null>(null);

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
      const targetTracker = trackers.find((t) => t.id === id);
      if (!targetTracker) return;

      let route = "";
      if (targetTracker.category === "Series") {
        route = "/series";
      } else if (targetTracker.category === "Movie") {
        route = "/movies";
      } else if (targetTracker.category === "Game") {
        route = "/games";
      } else if (targetTracker.category === "Book") {
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

  const quickUpdateProgress = async (tracker: ITracker) => {
    let route = "";
    let payload = {};
    let newValue = 0;

    try {
      if (tracker.category === "Series") {
        route = `/series/${tracker.id}`;
        newValue = (tracker.episodesWatched || 0) + 1;
        payload = { watchedEpisodes: newValue };
      } else if (tracker.category === "Game") {
        route = `/games/${tracker.id}`; // Corrigido para plural
        newValue = (tracker.hoursPlayed || 0) + 1;
        payload = { hoursPlayed: newValue };
      } else if (tracker.category === "Book") {
        route = `/books/${tracker.id}`; // Corrigido para plural
        newValue = (tracker.readPages || 0) + 10;
        payload = { readPages: newValue };
      }

      // Dispara a requisição real no Back-end
      await api.patch(route, payload);

      // Atualiza a tela instantaneamente (Optimistic UI)
      setTrackers(
        trackers.map((t) => {
          if (t.id === tracker.id) {
            if (tracker.category === "Series")
              return { ...t, episodesWatched: newValue };
            if (tracker.category === "Game")
              return { ...t, hoursPlayed: newValue };
            if (tracker.category === "Book")
              return { ...t, readPages: newValue };
          }
          return t;
        }),
      );

      toast.success(`Progress Updated!`);
      // loadDashboard() no fundo para atualizar os gráficos sem piscar a tela toda
      loadDashboard();
    } catch (error) {
      console.error(`Error updating progress:`, error);
      toast.error("Failed to update progress.");
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
        editingTracker,
        setEditingTracker,
        quickUpdateProgress,
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
