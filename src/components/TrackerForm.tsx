import type { FormEvent } from "react";

interface FormProps {
  titulo: string;
  setTitulo: (v: string) => void;
  categoria: string;
  setCategoria: (v: string) => void;
  nota: number | "";
  setNota: (v: number | "") => void;
  salvarTracker: (e: FormEvent) => void;
  idEmEdicao: string | null;
}

export const TrackerForm = ({
  titulo,
  setTitulo,
  categoria,
  setCategoria,
  nota,
  setNota,
  salvarTracker,
  idEmEdicao,
}: FormProps) => {
  return (
    <form
      onSubmit={salvarTracker}
      className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
    >
      <h3 className="mb-4 border-b pb-2 text-xl font-semibold text-gray-800">
        {idEmEdicao ? "✏️ Editar Tracker" : "✨ Adicionar Novo"}
      </h3>

      <div className="flex flex-col gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Título
          </label>
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Supernatural"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Categoria
            </label>
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="Série">Série</option>
              <option value="Filme">Filme</option>
              <option value="Jogo">Jogo</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Nota (0 a 10)
            </label>
            <input
              type="number"
              min="0"
              max="10"
              value={nota}
              onChange={(e) =>
                setNota(e.target.value === "" ? "" : Number(e.target.value))
              }
              className="w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className={`mt-2 w-full rounded-lg px-4 py-2 font-bold text-white transition-colors ${idEmEdicao ? "bg-amber-500 hover:bg-amber-600" : "bg-blue-600 hover:bg-blue-700"}`}
        >
          {idEmEdicao ? "Atualizar Tracker" : "Salvar no Banco"}
        </button>
      </div>
    </form>
  );
};
