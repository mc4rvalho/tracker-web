import axios from "axios";
import { useEffect, useState, type FormEvent } from "react";
import { TrackerForm } from "./components/TrackerForm";
import { TrackerList } from "./components/TrackerList";
import type { ITracker } from "./types/tracker.interface";

export const App = () => {
  // 1. OS ESTADOS (A Memória do React)
  const [trackers, setTrackers] = useState<ITracker[]>([]);
  const [titulo, setTitulo] = useState("");
  const [categoria, setCategoria] = useState("Série");
  const [nota, setNota] = useState<number | "">("");
  const [idEmEdicao, setIdEmEdicao] = useState<string | null>(null);

  // 2. O GATILHO (Busca inicial no banco)
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

    buscarTrackers();
  }, []);

  // 3. AS FUNÇÕES DE NEGÓCIO (O CRUD)

  // O Carteiro Inteligente (Cria ou Atualiza)
  const salvarTracker = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const payload = {
        titulo: titulo,
        categoria: categoria,
        nota: Number(nota),
      };

      if (idEmEdicao) {
        // Modo Edição (PATCH)
        const resposta = await axios.patch(
          `https://tracker-api-7krq.onrender.com/tracker/${idEmEdicao}`,
          payload,
        );

        // Atualiza apenas o item modificado na lista
        setTrackers(
          trackers.map((tracker) =>
            tracker.id === idEmEdicao ? resposta.data : tracker,
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
      setTitulo("");
      setCategoria("Série");
      setNota("");
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
    setTitulo(tracker.titulo);
    setCategoria(tracker.categoria);
    setNota(tracker.nota);
  };

  // 4. A INTERFACE (O HTML com Tailwind e Componentes)
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-8 text-center text-3xl font-extrabold tracking-tight text-blue-600">
          My Tracker
        </h1>

        <TrackerForm
          titulo={titulo}
          setTitulo={setTitulo}
          categoria={categoria}
          setCategoria={setCategoria}
          nota={nota}
          setNota={setNota}
          salvarTracker={salvarTracker}
          idEmEdicao={idEmEdicao}
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
