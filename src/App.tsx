/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { useEffect, useState, type FormEvent } from "react";
import { TrackerForm } from "./components/TrackerForm";
import { TrackerList } from "./components/TrackerList";
import type { ITracker } from "./types/tracker.interface";
import { dashboardService } from "./services/api";
import { DashboardCards } from "./components/DashboardCards";
import { RecentTimeline } from "./components/RecentTimeline";

export const App = () => {
  // OS ESTADOS (A Memória do React)
  const [trackers, setTrackers] = useState<ITracker[]>([]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Series");
  const [grade, setGrade] = useState<number | "">("");
  const [idInEdition, setIdEmEdicao] = useState<string | null>(null);

  // Light/Dark Mode - useState
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  // Dashboard Service - api
  const [totals, setTotals] = useState<any>(null);
  const [recents, setRecents] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any>(null);

  // Componente de Progresso - useState
  const [episodesWatched, setEpisodesWatched] = useState<number | "">("");
  const [totalEpisodesWatched, setTotalEpisodesWatched] = useState<number | "">(
    "",
  );
  const [hoursPlayed, setHoursPlayed] = useState<number | "">("");
  const [totalHoursPlayed, setTotalHoursPlayed] = useState<number | "">("");
  const [readPages, setReadPages] = useState<number | "">("");
  const [totalReadPages, setTotalReadPages] = useState<number | "">("");

  // Light/Dark Mode - useEffect
  useEffect(() => {
    // Injeta o atributo no HTML
    document.documentElement.setAttribute("data-theme", theme);

    // Salva na memória do navegador
    localStorage.setItem("theme", theme);
  }, [theme]);

  // O GATILHO (Busca inicial no banco)
  useEffect(() => {
    const buscarTrackers = async () => {
      try {
        const resposta = await axios.get(
          "https://tracker-api-7krq.onrender.com/tracker",
        );
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

        console.log("Totais:", dadosTotals);
        console.log("Recents:", dadosRecents);
        console.log("Analytics:", dadosAnalytics);
      } catch (erro) {
        console.error(`Erro ao carregar o dashboard: ${erro}`);
      }
    };

    buscarTrackers();
    loadDashboard();
  }, []);

  // 3. AS FUNÇÕES DE NEGÓCIO (O CRUD)

  // O Carteiro Inteligente (Cria ou Atualiza)
  const saveTracker = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const payload = {
        title: title,
        category: category,
        grade: Number(grade),
        episodesWatched: episodesWatched,
        hoursPlayed: hoursPlayed,
        readPages: readPages,
      };

      if (idInEdition) {
        // Modo Edição (PATCH)
        const resposta = await axios.patch(
          `https://tracker-api-7krq.onrender.com/tracker/${idInEdition}`,
          payload,
        );

        // Atualiza apenas o item modificado na lista
        setTrackers(
          trackers.map((tracker) =>
            tracker.id === idInEdition ? resposta.data : tracker,
          ),
        );
      } else {
        // Modo Criação (POST)
        const resposta = await axios.post(
          "https://tracker-api-7krq.onrender.com/tracker",
          payload,
        );

        // Adiciona o novo item no final da lista
        setTrackers([...trackers, resposta.data]);
      }

      // Limpa os campos após salvar
      setTitle("");
      setCategory("Série");
      setGrade("");
      setIdEmEdicao(null);
    } catch (erro) {
      console.error(`Erro ao salvar tracker: ${erro}`);
      alert("Erro ao salvar! Verifique o console.");
    }
  };

  // O Destruidor (DELETE)
  const deletarTracker = async (id: string) => {
    if (!window.confirm("Tem certeza que deseja excluir este tracker?")) return;

    try {
      await axios.delete(`https://tracker-api-7krq.onrender.com/tracker/${id}`);
      setTrackers(trackers.filter((tracker) => tracker.id !== id));
    } catch (erro) {
      console.error(`Erro ao deletar tracker: ${erro}`);
      alert("Erro ao excluir! Verifique o console.");
    }
  };

  // O Preparador (joga os dados do item para dentro do formulário)
  const prepararEdicao = (tracker: ITracker) => {
    setIdEmEdicao(tracker.id);
    setTitle(tracker.title);
    setCategory(tracker.category);
    setGrade(tracker.grade);
  };

  // 4. A INTERFACE (O HTML com Tailwind e Componentes)
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

        <DashboardCards
          totals={totals}
          recents={recents}
          analytics={analytics}
        />

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
