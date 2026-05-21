/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, type FormEvent } from "react";
import { TrackerForm } from "../components/TrackerForm";
import { TrackerList } from "../components/TrackerList";
import type { ITracker } from "../types/tracker.interface";
import { api, dashboardService } from "../services/api";
import { DashboardCards } from "../components/DashboardCards";
import { RecentTimeline } from "../components/RecentTimeline";
import { AnalyticsDashboard } from "../components/AnalyticsDashboard";
import { useAuth } from "../contexts/AuthContext";

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
      console.error(`Erro ao carregar o dashboard: ${erro}`);
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
        console.error(`Erro ao buscar os trackers: ${erro}`);
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
          author: "Desconhecido",
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
    } catch (erro) {
      console.error(`Erro ao salvar tracker: ${erro}`);
      alert("Erro ao salvar! Verifique o console.");
    }
  };

  const deleteTracker = async (id: string) => {
    if (!window.confirm("Tem certeza que deseja excluir este tracker?")) return;

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
    } catch (erro) {
      console.error(`Erro ao deletar tracker: ${erro}`);
      alert("Erro ao excluir! Verifique o console.");
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
    <div className="min-h-screen bg-gray-50 px-4 py-10 dark:bg-gray-950">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-8 text-center text-3xl font-extrabold tracking-tight text-blue-600">
          My Tracker
        </h1>

        <div className="flex justify-between gap-4">
          <button
            className="mb-4 flex-1 rounded-md bg-white p-4 font-semibold text-black shadow-md transition hover:bg-gray-100 dark:bg-gray-900 dark:text-white dark:hover:bg-gray-800"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            Mudar para {theme === "light" ? "Escuro" : "Claro"}
          </button>

          <button
            className="mb-4 rounded-md bg-red-100 p-4 font-semibold text-red-600 shadow-md transition hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
            onClick={logout}
          >
            Sair
          </button>
        </div>

        <DashboardCards
          totals={totals}
          recents={recents}
          analytics={analytics}
        />

        <AnalyticsDashboard analytics={analytics} />

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

        <TrackerList
          trackers={trackers}
          prepareEdition={prepareEdition}
          deleteTracker={deleteTracker}
        />
      </div>
    </div>
  );
};
