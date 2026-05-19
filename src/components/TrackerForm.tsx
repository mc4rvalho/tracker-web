import type { FormEvent } from "react";

interface FormProps {
  title: string;
  setTitle: (v: string) => void;
  category: string;
  setCategory: (v: string) => void;
  grade: number | "";
  setGrade: (v: number | "") => void;
  episodesWatched: number | "";
  setEpisodesWatched: (v: number | "") => void;
  totalEpisodesWatched: number | "";
  setTotalEpisodesWatched: (v: number | "") => void;
  hoursPlayed: number | "";
  setHoursPlayed: (v: number | "") => void;
  totalHoursPlayed: number | "";
  setTotalHoursPlayed: (v: number | "") => void;
  readPages: number | "";
  setReadPages: (v: number | "") => void;
  totalReadPages: number | "";
  setTotalReadPages: (v: number | "") => void;
  saveTracker: (e: FormEvent) => void;
  idInEdition: string | null;
}

export const TrackerForm = ({
  title,
  setTitle,
  category,
  setCategory,
  grade,
  setGrade,
  episodesWatched,
  setEpisodesWatched,
  totalEpisodesWatched,
  setTotalEpisodesWatched,
  hoursPlayed,
  setHoursPlayed,
  totalHoursPlayed,
  setTotalHoursPlayed,
  readPages,
  setReadPages,
  totalReadPages,
  setTotalReadPages,
  saveTracker,
  idInEdition,
}: FormProps) => {
  return (
    <form
      onSubmit={saveTracker}
      className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
    >
      <h3 className="mb-4 border-b pb-2 text-xl font-semibold text-gray-800">
        {idInEdition ? "✏️ Editar Tracker" : "✨ Adicionar Novo"}
      </h3>

      <div className="flex flex-col gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Título
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
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
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="Series">Série</option>
              <option value="Movie">Filme</option>
              <option value="Game">Jogo</option>
              <option value="Book">Livro</option>
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
              value={grade}
              onChange={(e) =>
                setGrade(e.target.value === "" ? "" : Number(e.target.value))
              }
              className="w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>
        </div>

        {category === "Series" && (
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Episódios Assistidos
              </label>
              <input
                className="w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                type="number"
                value={episodesWatched}
                onChange={(e) =>
                  setEpisodesWatched(
                    e.target.value === "" ? "" : Number(e.target.value),
                  )
                }
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Total de Episódios Assistidos
              </label>
              <input
                className="w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                type="number"
                value={totalEpisodesWatched}
                onChange={(e) =>
                  setTotalEpisodesWatched(
                    e.target.value === "" ? "" : Number(e.target.value),
                  )
                }
              />
            </div>
          </div>
        )}

        {category === "Game" && (
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Horas Jogadas
              </label>
              <input
                className="w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                type="number"
                value={hoursPlayed}
                onChange={(e) =>
                  setHoursPlayed(
                    e.target.value === "" ? "" : Number(e.target.value),
                  )
                }
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Total de Horas Jogadas
              </label>
              <input
                className="w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                type="number"
                value={totalHoursPlayed}
                onChange={(e) =>
                  setTotalHoursPlayed(
                    e.target.value === "" ? "" : Number(e.target.value),
                  )
                }
              />
            </div>
          </div>
        )}

        {category === "Book" && (
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Páginas Lidas
              </label>
              <input
                className="w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                type="number"
                value={readPages}
                onChange={(e) =>
                  setReadPages(
                    e.target.value === "" ? "" : Number(e.target.value),
                  )
                }
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Total de Páginas Lidas
              </label>
              <input
                className="w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                type="number"
                value={totalReadPages}
                onChange={(e) =>
                  setTotalReadPages(
                    e.target.value === "" ? "" : Number(e.target.value),
                  )
                }
              />
            </div>
          </div>
        )}

        <button
          type="submit"
          className={`mt-2 w-full rounded-lg px-4 py-2 font-bold text-white transition-colors ${idInEdition ? "bg-amber-500 hover:bg-amber-600" : "bg-blue-600 hover:bg-blue-700"}`}
        >
          {idInEdition ? "Atualizar Tracker" : "Salvar no Banco"}
        </button>
      </div>
    </form>
  );
};
