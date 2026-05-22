/* eslint-disable @typescript-eslint/no-explicit-any */
import { Pencil, Sparkles } from "lucide-react";
import { useEffect, useRef, type FormEvent } from "react";
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
  setExternalId: (v: number | string) => void;
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
  setExternalId,
}: FormProps) => {
  const skipSearchRef = useRef(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSearch = async () => {
    if (!title) return;

    let route = "";
    if (category === "Series") route = `/series/search?title=${title}`;
    else if (category === "Movie") route = `/movies/search?title=${title}`;
    else if (category === "Game") route = `/games/search?title=${title}`;
    else if (category === "Book") route = `/books/search?title=${title}`;

    try {
      const response = await api.get(route);
      setSearch(response.data);
    } catch (err) {
      console.error("Erro na busca externa!", err);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setSearch([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setSearch]);

  useEffect(() => {
    if (!title) {
      setSearch([]);
      return;
    }

    if (skipSearchRef.current) {
      skipSearchRef.current = false;
      return;
    }

    const timeoutId = setTimeout(() => {
      handleSearch();
    }, 600);

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, category]);

  return (
    <form
      onSubmit={saveTracker}
      className="bg-surface-light dark:bg-surface-dark mb-8 rounded-xl border border-gray-200 p-6 shadow-sm"
    >
      <h3 className="mb-4 flex items-center gap-2 border-b border-gray-200 pb-2 text-xl font-semibold text-gray-900 dark:border-gray-800 dark:text-gray-100">
        {idInEdition ? (
          <>
            <Pencil className="text-amber-500" size={20} />
            Edit Tracker
          </>
        ) : (
          <>
            <Sparkles className="text-brand-500" size={20} />
            Add New
          </>
        )}
      </h3>

      <div className="flex flex-col gap-4">
        <div ref={dropdownRef} className="relative">
          {posterPath && (
            <div className="mb-2 flex justify-center sm:justify-start">
              <img
                src={`https://image.tmdb.org/t/p/w92${posterPath}`}
                alt="Capa selecionada"
                className="h-24 w-16 rounded-md object-cover shadow-sm"
              />
            </div>
          )}
          <label className="mb-1 block text-sm font-medium text-gray-900 dark:text-gray-100">
            Title
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-transparent p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Type to search automatically..."
              required
            />
          </div>

          {search.length > 0 && (
            <div className="ring-opacity-5 bg-surface-light dark:bg-surface-dark absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md py-1 text-base shadow-lg ring-1 ring-black focus:outline-none sm:text-sm">
              {search.map((item, index) => (
                <div
                  key={index}
                  className="relative cursor-pointer py-2 pr-9 pl-3 text-gray-900 select-none hover:bg-blue-600 hover:text-white dark:text-gray-100"
                  onClick={() => {
                    skipSearchRef.current = true;

                    setTitle(item.title || item.name);
                    setPosterPath(item.poster_path);
                    setExternalId(item.id);

                    if (category === "Series" && item.number_of_episodes) {
                      setTotalEpisodesWatched(item.number_of_episodes);
                    }

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
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-900 dark:text-gray-100">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="Series">Series</option>
              <option value="Movie">Movie</option>
              <option value="Game">Game</option>
              <option value="Book">Book</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-900 dark:text-gray-100">
              Rating (0 to 10)
            </label>
            <input
              type="number"
              min="0"
              max="10"
              value={grade}
              onChange={(e) =>
                setGrade(e.target.value === "" ? "" : Number(e.target.value))
              }
              className="w-full rounded-lg border border-gray-300 bg-transparent p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>
        </div>

        {category === "Series" && (
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-900 dark:text-gray-100">
                Watched Episodes
              </label>
              <input
                className="w-full rounded-lg border border-gray-300 bg-transparent p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
              <label className="mb-1 block text-sm font-medium text-gray-900 dark:text-gray-100">
                Total Episodes
              </label>
              <input
                className="w-full rounded-lg border border-gray-300 bg-transparent p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
              <label className="mb-1 block text-sm font-medium text-gray-900 dark:text-gray-100">
                Hours Played
              </label>
              <input
                className="w-full rounded-lg border border-gray-300 bg-transparent p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
              <label className="mb-1 block text-sm font-medium text-gray-900 dark:text-gray-100">
                Total Hours
              </label>
              <input
                className="w-full rounded-lg border border-gray-300 bg-transparent p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
              <label className="mb-1 block text-sm font-medium text-gray-900 dark:text-gray-100">
                Read Pages
              </label>
              <input
                className="w-full rounded-lg border border-gray-300 bg-transparent p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
              <label className="mb-1 block text-sm font-medium text-gray-900 dark:text-gray-100">
                TotalRead
              </label>
              <input
                className="w-full rounded-lg border border-gray-300 bg-transparent p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
          className={`mt-4 w-full rounded-xl px-4 py-3 font-semibold text-white transition-all hover:-translate-y-1 hover:shadow-lg ${
            idInEdition
              ? "bg-amber-500 hover:bg-amber-400 dark:hover:shadow-amber-500/30"
              : "bg-brand-600 hover:bg-brand-500 dark:hover:shadow-brand-600/30"
          }`}
        >
          {idInEdition ? "Update Tracker" : "Save Tracker"}
        </button>
      </div>
    </form>
  );
};
