import type { ITracker } from "../types/tracker.interface";
import { ProgressBar } from "./ProgressBar";

interface ListProps {
  trackers: ITracker[];
  prepareEdition: (tracker: ITracker) => void;
  deleteTracker: (id: string) => void;
}

export const TrackerList = ({
  trackers,
  prepareEdition,
  deleteTracker,
}: ListProps) => {
  if (trackers.length === 0) {
    return (
      <p className="py-4 text-center text-gray-500">
        Nenhum tracker encontrado no banco de dados.
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {trackers.map((tracker) => (
        <li
          key={tracker.id}
          className="flex flex-col gap-3 rounded-xl border bg-white p-4 shadow-sm"
        >
          <div className="flex w-full items-start justify-between">
            <div>
              <strong className="text-lg text-gray-800">{tracker.title}</strong>
              <span className="ml-2 rounded-md bg-gray-100 px-2 py-1 text-sm text-gray-500">
                {tracker.category}
              </span>
              <p className="mt-1 text-sm text-gray-600">
                Nota:{" "}
                <span className="font-bold text-blue-600">{tracker.grade}</span>
                /10
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => prepareEdition(tracker)}
                className="rounded-lg bg-amber-100 px-3 py-1 font-medium text-amber-700 transition-colors hover:bg-amber-200"
              >
                Editar
              </button>
              <button
                onClick={() => deleteTracker(tracker.id)}
                className="rounded-lg bg-red-100 px-3 py-1 font-medium text-red-700 transition-colors hover:bg-red-200"
              >
                Excluir
              </button>
            </div>
          </div>

          {/* BLOCO CONDICIONAL DA SÉRIE */}
          {tracker.category === "Series" && tracker.totalEpisodesWatched && (
            <div className="mt-3 w-full">
              <p className="mb-1 text-xs text-gray-500">
                Progresso: {tracker.episodesWatched} de{" "}
                {tracker.totalEpisodesWatched}
              </p>
              <ProgressBar
                current={tracker.episodesWatched || 0}
                total={tracker.totalEpisodesWatched}
                color="bg-blue-500"
              />
            </div>
          )}

          {/* BLOCO CONDICIONAL DO GAME */}
          {tracker.category === "Game" && tracker.totalHoursPlayed && (
            <div className="mt-3 w-full">
              <p className="mb-1 text-xs text-gray-500">
                Progresso: {tracker.hoursPlayed} de {tracker.totalHoursPlayed}
              </p>
              <ProgressBar
                current={tracker.hoursPlayed || 0}
                total={tracker.totalHoursPlayed}
                color="bg-red-500"
              />
            </div>
          )}

          {/* BLOCO CONDICIONAL DO BOOK */}
          {tracker.category === "Book" && tracker.totalReadPages && (
            <div className="mt-3 w-full">
              <p className="mb-1 text-xs text-gray-500">
                Progresso: {tracker.readPages} de {tracker.totalReadPages}
              </p>
              <ProgressBar
                current={tracker.readPages || 0}
                total={tracker.totalReadPages}
                color="bg-green-500"
              />
            </div>
          )}
        </li>
      ))}
    </ul>
  );
};
