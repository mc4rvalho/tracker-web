/* eslint-disable @typescript-eslint/no-explicit-any */
import type { FormEvent } from "react";
import { api } from "../services/api";

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
  posterPath: string;
  setPosterPath: (v: string) => void;
  search: any[];
  setSearch: (v: any[]) => void;
  isSearching: boolean;
  setIsSearching: (v: boolean) => void;
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
  posterPath,
  setPosterPath,
  search,
  setSearch,
  isSearching,
  setIsSearching,
}: FormProps) => {
  const handleSearch = async () => {
    if (!title) {
      return;
    }

    setIsSearching(true);

    let route = "";
    if (category === "Series") {
      route = `/series/search?title=${title}`;
    } else if (category === "Movie") {
      route = `/movies/search?title=${title}`;
    } else if (category === "Game") {
      route = `/games/search?title=${title}`;
    } else if (category === "Book") {
      route = `/books/search?title=${title}`;
    }

    try {
      const response = await api.get(route);

      setSearch(response.data);
    } catch (err) {
      console.error("Erro na busca externa!", err);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <form
      onSubmit={saveTracker}
      className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
    >
      <h3 className="mb-4 border-b pb-2 text-xl font-semibold text-gray-800">
        {idInEdition ? "✏️ Editar Tracker" : "✨ Adicionar Novo"}
      </h3>

      <div className="relative flex flex-col gap-4">
        <div>
          {posterPath && (
            <div className="mb-2 flex justify-center sm:justify-start">
              <img
                src={`https://image.tmdb.org/t/p/w92${posterPath}`}
                alt="Capa selecionada"
                className="h-24 w-16 rounded-md object-cover shadow-sm"
              />
            </div>
          )}
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Título
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Supernatural"
              required
            />
          </div>

          <button
            type="button"
            onClick={handleSearch}
            disabled={isSearching || !title}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white"
          >
            {isSearching ? "Buscando..." : "Buscar"}
          </button>
        </div>

        {/* Renderização Condicional do Dropdown de Busca */}
        {search.length > 0 && (
          <div className="ring-opacity-5 absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black focus:outline-none sm:text-sm">
            {search.map((item, index) => (
              <div
                key={index}
                className="relative cursor-pointer py-2 pr-9 pl-3 text-gray-900 select-none hover:bg-blue-600 hover:text-white"
                onClick={() => {
                  setTitle(item.title || item.name);
                  setPosterPath(item.poster_path);
                  setSearch([]);
                }}
              >
                <div className="flex items-center">
                  {item.poster_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w92${item.poster_path}`}
                      alt={item.title || item.name}
                      className="mr-3 h-12 w-8 shrink-0 object-cover"
                    />
                  ) : (
                    <div className="mr-3 h-12 w-8 bg-gray-200"></div>
                  )}

                  <div className="flex flex-col">
                    <span className="block truncate font-normal">
                      {item.title || item.name}
                    </span>
                    <span className="block truncate text-xs opacity-70">
                      {item.release_date || item.first_air_date
                        ? new Date(
                            item.release_date || item.first_air_date,
                          ).getFullYear()
                        : "Ano desconhecido"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

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
