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

  const [posterPath, setPosterPath] = useState("");
  const [search, setSearch] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  const { logout } = useAuth();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const buscarTrackers = async () => {
      try {
        // 1. O Promise.all dispara as 4 requisições ao mesmo tempo
        const [moviesRes, seriesRes, gamesRes, booksRes] = await Promise.all([
          api.get("/movies"),
          api.get("/series"),
          api.get("/games"),
          api.get("/books"),
        ]);

        // 2. Junta todos os arrays que voltaram em um Super Array
        const allTrackers = [
          ...moviesRes.data,
          ...seriesRes.data,
          ...gamesRes.data,
          ...booksRes.data,
        ];

        // 3. Ordena por data de atualização para os mais recentes ficarem no topo da lista
        allTrackers.sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
        );

        setTrackers(allTrackers);
      } catch (erro) {
        console.error(`Erro ao buscar os trackers: ${erro}`);
      }
    };

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

    buscarTrackers();
    loadDashboard();
  }, []);

  const saveTracker = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const payload = {
        title,
        category,
        posterPath,
        grade: Number(grade),
        episodesWatched,
        hoursPlayed,
        readPages,
      };

      let route = "";
      if (category === "Series") {
        route = "/series";
      } else if (category === "Movie") {
        route = "/movies";
      } else if (category === "Game") {
        route = "/games";
      } else if (category === "Book") {
        route = "/books";
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
      setIdEmEdicao(null);
    } catch (erro) {
      console.error(`Erro ao salvar tracker: ${erro}`);
      alert("Erro ao salvar! Verifique o console.");
    }
  };

  const deletarTracker = async (id: string) => {
    if (!window.confirm("Tem certeza que deseja excluir este tracker?")) return;

    try {
      // 1. Procura na memória qual é a categoria do item que o usuário quer deletar
      const trackerAlvo = trackers.find((t) => t.id === id);
      if (!trackerAlvo) return;

      // 2. Define a rota com base na categoria encontrada
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

      // 3. Coloca o delete na rota certa
      await api.delete(`${route}/${id}`);

      setTrackers(trackers.filter((tracker) => tracker.id !== id));
    } catch (erro) {
      console.error(`Erro ao deletar tracker: ${erro}`);
      alert("Erro ao excluir! Verifique o console.");
    }
  };

  const prepararEdicao = (tracker: ITracker) => {
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
          isSearching={isSearching}
          setIsSearching={setIsSearching}
        />

        <TrackerList
          trackers={trackers}
          prepararEdicao={prepararEdicao}
          deletarTracker={deletarTracker}
        />
      </div>
    </div>
  );
};
