/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, type FormEvent } from "react";
import { AnalyticsDashboard } from "../components/AnalyticsDashboard";
import { DashboardCards } from "../components/DashboardCards";
import { Header } from "../components/Header";
import { RecentTimeline } from "../components/RecentTimeline";
import { TrackerForm } from "../components/TrackerForm";
import { TrackerList } from "../components/TrackerList";
import { useAuth } from "../contexts/AuthContext";
import { api, dashboardService } from "../services/api";
import type { ITracker } from "../types/tracker.interface";
import toast from "react-hot-toast";

export const Dashboard = () => {
  const [trackers, setTrackers] = useState<ITracker[]>([]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Series");
  const [grade, setGrade] = useState<number | "">("");
  const [idInEdition, setIdEmEdicao] = useState<string | null>(null);

  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  const [totals, setTotals] = useState<any>(null);
  const [recents, setRecents] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any>(null);

  const [episodesWatched, setEpisodesWatched] = useState<number | "">("");
  const [totalEpisodesWatched, setTotalEpisodesWatched] = useState<number | "">(
    "",
  );
  const [hoursPlayed, setHoursPlayed] = useState<number | "">("");
  const [totalHoursPlayed, setTotalHoursPlayed] = useState<number | "">("");
  const [readPages, setReadPages] = useState<number | "">("");
  const [totalReadPages, setTotalReadPages] = useState<number | "">("");

  const [tags, setTags] = useState<string[]>([]);
  const [externalId, setExternalId] = useState<number | string>("");

  const [posterPath, setPosterPath] = useState("");
  const [search, setSearch] = useState<any[]>([]);

  const { logout } = useAuth();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

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

  const saveTracker = async (e: FormEvent) => {
    e.preventDefault();

    try {
      let payload: any = {
        title,
        category,
        grade: Number(grade),
        tags: tags.length > 0 ? tags : [category],
      };

      let route = "";

      if (category === "Series") {
        route = "/series";
        payload = {
          ...payload,
          posterPath,
          tmdbId: Number(externalId),
          watchedEpisodes: Number(episodesWatched),
          totalEpisodes: Number(totalEpisodesWatched),
          seasons: 1,
          seasonsWatched: 0,
        };
      } else if (category === "Movie") {
        route = "/movies";
        payload = {
          ...payload,
          posterPath,
          tmdbId: Number(externalId),
        };
      } else if (category === "Game") {
        route = "/games";
        payload = {
          ...payload,
          coverPath: posterPath,
          hoursPlayed: Number(hoursPlayed),
          rawgId: Number(externalId),
          platform: "PC",
        };
      } else if (category === "Book") {
        route = "/books";
        payload = {
          ...payload,
          coverPath: posterPath,
          author: "Unknown",
          readPages: Number(readPages),
          totalPages: Number(totalReadPages),
          openLibraryId: String(externalId),
        };
      }

      if (idInEdition) {
        const resposta = await api.patch(`${route}/${idInEdition}`, payload);

        setTrackers(
          trackers.map((tracker) =>
            tracker.id === idInEdition ? resposta.data : tracker,
          ),
        );
      } else {
        const resposta = await api.post(route, payload);
        setTrackers([resposta.data, ...trackers]);
      }

      setTitle("");
      setCategory("Series");
      setGrade("");
      setPosterPath("");
      setExternalId("");
      setTags([]);
      setIdEmEdicao(null);
      setEpisodesWatched("");
      setTotalEpisodesWatched("");
      setHoursPlayed("");
      setTotalHoursPlayed("");
      setReadPages("");
      setTotalReadPages("");

      loadDashboard();

      toast.success(
        idInEdition ? "Tracker updated!" : "Tracker created successfully!",
      );
    } catch (erro) {
      console.error(`Error saving tracker: ${erro}`);
      toast.error("Error saving. Please check the data.");
    }
  };

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

  const prepareEdition = (tracker: ITracker) => {
    setIdEmEdicao(tracker.id);
    setTitle(tracker.title);
    setCategory(tracker.category);
    setGrade(tracker.grade);
    setPosterPath(tracker.posterPath || "");
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

          <TrackerForm
            title={title}
            setTitle={setTitle}
            category={category}
            setCategory={setCategory}
            grade={grade}
            setGrade={setGrade}
            saveTracker={saveTracker}
            idInEdition={idInEdition}
            episodesWatched={episodesWatched}
            setEpisodesWatched={setEpisodesWatched}
            totalEpisodesWatched={totalEpisodesWatched}
            setTotalEpisodesWatched={setTotalEpisodesWatched}
            hoursPlayed={hoursPlayed}
            setHoursPlayed={setHoursPlayed}
            totalHoursPlayed={totalHoursPlayed}
            setTotalHoursPlayed={setTotalHoursPlayed}
            readPages={readPages}
            setReadPages={setReadPages}
            totalReadPages={totalReadPages}
            setTotalReadPages={setTotalReadPages}
            posterPath={posterPath}
            setPosterPath={setPosterPath}
            search={search}
            setSearch={setSearch}
            setExternalId={setExternalId}
          />
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
