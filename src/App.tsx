import { useEffect, useState, type FormEvent } from "react";
import "./App.css";
import type { ITracker } from "./types/tracker.interface";
import axios from "axios";

export const App = () => {
  // 1. O Estado: Observe como a Interface entra aqui!
  // O TypeScript agora sabe que 'trackers' não é um array qualquer, é um array de Trackers <ITracker[]>
  const [trackers, setTrackers] = useState<ITracker[]>([]);

  // 1.1 Novos Estados: Um para cada campo do formulário
  const [titulo, setTitulo] = useState("");
  const [categoria, setCategoria] = useState("Série");
  const [nota, setNota] = useState<number | "">("");

  // 2. O Gatilho
  useEffect(() => {
    // 3. O Carteiro (A função que faz o GET)
    const buscarTrackers = async () => {
      try {
        // Lembra que configuramos o app.enableCors() no NestJS ontem? É isso que permite essa chamada funcionar!
        const resposta = await axios.get("http://localhost:4000/tracker");

        // Coloca os dados que vieram do Back-end dentro do nosso estado
        setTrackers(resposta.data);
      } catch (erro) {
        console.log(`Erro ao buscar os trackers: ${erro}`);
      }
    };

    buscarTrackers();
  }, []);

  // 2.2 O Carteiro de Entra (A função que faz o POST)
  const criarTracker = async (e: FormEvent) => {
    e.preventDefault(); // Impede a página de piscar/recarregar quando clica em Salvar

    try {
      // Montamos o "pacote" (DTO) para o Back-end
      const novoTracker = {
        titulo: titulo,
        categoria: categoria,
        nota: Number(nota), // Convertendo para número para o Class Validator/Prisma não reclamar!
      };

      // Mandamos para a mesma rota, mas agora usando POST
      const resposta = await axios.post(
        "http://localhost:4000/tracker",
        novoTracker,
      );

      // Mágica do React: Pegamos a lista antiga de trackers, e adicionamos o novo que voltou do banco
      setTrackers([...trackers, resposta.data]);

      // Limpa os campos do formulário para o próximo cadastro
      setTitulo("");
      setCategoria("Série");
      setNota("");
    } catch (erro) {
      console.error(`Erro ao criar tracker ${erro}`);
      alert("Erro ao criar! Verifique o console.");
    }
  };

  // 3.3 O Carteiro da Destruição (Faz o DELETE)
  const deletarTracker = async (id: string) => {
    // Um confirm básico só para o usuário não clicar sem querer
    if (!window.confirm("Tem certeza que deseja excluir este tracker?")) return;

    try {
      // Bate na rota passando o ID na URL
      await axios.delete(`http://localhost:4000/tracker/${id}`);

      // Mágica do React com .filter(): "Me devolva todos os trackers, EXCETO o que tem este ID"
      setTrackers(trackers.filter((tracker) => tracker.id !== id));
    } catch (erro) {
      console.error(`Erro ao deletar tracker: ${erro}`);
      alert("Erro ao excluir! Verifique o console.");
    }
  };

  // 4. O Desenho na Tela
  return (
    <div>
      <h1>My Tracker</h1>

      {/* 3.3 O nosso Formulário HTML */}
      <form
        onSubmit={criarTracker}
        style={{
          marginBottom: "30px",
          padding: "15px",
          border: "1px solid #ddd",
          borderRadius: "8px",
        }}
      >
        <h3>Adicionar Novo</h3>

        <div style={{ marginBottom: "10px" }}>
          <label>Titulo: </label>
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Categoria: </label>
          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
          >
            <option value="Série">Série</option>
            <option value="Filme">Filme</option>
            <option value="Jogo">Jogo</option>
          </select>
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Nota (0 a 10): </label>
          <input
            type="number"
            min="0"
            max="10"
            value={nota}
            onChange={(e) =>
              setNota(e.target.value === "" ? "" : Number(e.target.value))
            }
          />
        </div>

        <button type="submit">Salvar no Banco</button>
      </form>

      <hr />

      {/* O Mágico .map() em ação */}
      <ul>
        {trackers.map((tracker) => (
          // O React exige essa propriedade 'key' para não se perder na lista. Como temos o UUID, ele é perfeito para isso!
          <li
            key={tracker.id}
            style={{
              marginBottom: "10px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <span>
              <strong>{tracker.titulo}</strong> - {tracker.categoria} (Nota:{" "}
              {tracker.nota})
            </span>

            {/* O Botão de Excluir chamando a função e passando o ID daquele item específico */}
            <button
              onClick={() => deletarTracker(tracker.id)}
              style={{
                backgroundColor: "#ff4d4f",
                color: "white",
                border: "none",
                padding: "4px 8px",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Excluir
            </button>
          </li>
        ))}
      </ul>

      {/* Dica visual extra: se o array estiver vazio, mostramos um aviso */}
      {trackers.length === 0 && (
        <p>Nenhum tracker encontrado no banco de dados.</p>
      )}
    </div>
  );
};
