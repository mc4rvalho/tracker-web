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

  const { logout } = useAuth();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const buscarTrackers = async () => {
      try {
        const resposta = await api.get("/tracker");
        setTrackers(resposta.data);
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
        grade: Number(grade),
        episodesWatched,
        hoursPlayed,
        readPages,
      };

      if (idInEdition) {
        const resposta = await api.patch(`/tracker/${idInEdition}`, payload);

        setTrackers(
          trackers.map((tracker) =>
            tracker.id === idInEdition ? resposta.data : tracker,
          ),
        );
      } else {
        const resposta = await api.post("/tracker", payload);

        setTrackers([...trackers, resposta.data]);
      }

      setTitle("");
      setCategory("Series");
      setGrade("");
      setIdEmEdicao(null);
    } catch (erro) {
      console.error(`Erro ao salvar tracker: ${erro}`);
      alert("Erro ao salvar! Verifique o console.");
    }
  };

  const deletarTracker = async (id: string) => {
    if (!window.confirm("Tem certeza que deseja excluir este tracker?")) return;

    try {
      await api.delete(`/tracker/${id}`);
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
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 dark:bg-gray-950">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-8 text-center text-3xl font-extrabold tracking-tight text-blue-600">
          My Tracker
        </h1>

        <button
          className="mb-4 rounded-md bg-white p-10 text-black shadow-md dark:bg-gray-900 dark:text-white"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          Mudar para {theme === "light" ? "Escuro" : "Claro"}
        </button>

        <button
          className="mb-4 rounded-md bg-white p-10 text-black shadow-md dark:bg-gray-900 dark:text-white"
          onClick={logout}
        >
          Sair
        </button>

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

// O seu desafio é unir essas três peças. Dê uma olhada em como você fez o api.post no seu Dashboard.tsx para se inspirar na sintaxe, monte a tela, e teste o fluxo criando um usuário "teste@teste.com".

// Me avise quando terminar ou se o terminal do Vite gritar algum erro no meio do caminho. Mãos à obra! 💻🛠️
