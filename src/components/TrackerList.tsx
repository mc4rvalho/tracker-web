import { ProgressBar } from "./ProgressBar";
import { useDashboard } from "../contexts/DashboardContext";
import type { ITracker } from "../types/tracker.interface";

interface ListProps {
  trackers: ITracker[];
  prepareEdition: (tracker: ITracker) => void;
  deleteTracker: (id: string) => void;
}

const categoryColors: Record<string, string> = {
  Series: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  Movie: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
  Game: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  Book: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  // Fallback se vier algo estranho
  Default: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
};

export const TrackerList = ({
  trackers,
  prepareEdition,
  deleteTracker,
}: ListProps) => {
  const { quickUpdateProgress } = useDashboard();

  if (trackers.length === 0) {
    return (
      <p className="py-4 text-center text-gray-500">
        No trackers found in the database.
      </p>
    );
  }

  return (
    <ul className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {trackers.map((tracker) => (
        <li
          key={tracker.id}
          className="bg-surface-light dark:bg-surface-dark flex flex-col gap-3 rounded-xl border p-4 shadow-sm"
        >
          <div className="flex w-full items-start justify-between">
            <div>
              <strong className="text-lg text-gray-900 dark:text-gray-100">
                {tracker.title}
              </strong>
              <span
                className={`ml-2 rounded-md px-2 py-1 text-sm font-medium ${categoryColors[tracker.category] || categoryColors.Default}`}
              >
                {tracker.category}
              </span>
              <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
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
                Edit
              </button>
              <button
                onClick={() => deleteTracker(tracker.id)}
                className="rounded-lg bg-red-100 px-3 py-1 font-medium text-red-700 transition-colors hover:bg-red-200"
              >
                Delete
              </button>
            </div>
          </div>

          {/* BLOCO CONDICIONAL DA SERIES */}
          {tracker.category === "Series" && tracker.totalEpisodesWatched && (
            <div className="mt-3 w-full">
              <div className="mb-1 flex items-center justify-between">
                <p className="text-xs text-gray-500">
                  Progress: {tracker.episodesWatched} de{" "}
                  {tracker.totalEpisodesWatched}
                </p>
                {(tracker.episodesWatched || 0) <
                  tracker.totalEpisodesWatched && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      quickUpdateProgress(tracker);
                    }}
                    className="rounded bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400"
                  >
                    +1 Ep
                  </button>
                )}
              </div>
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
              <div className="mb-1 flex items-center justify-between">
                <p className="text-xs text-gray-500">
                  Progress: {tracker.hoursPlayed} de {tracker.totalHoursPlayed}
                </p>
                {(tracker.hoursPlayed || 0) < tracker.totalHoursPlayed && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      quickUpdateProgress(tracker);
                    }}
                    className="rounded bg-purple-100 px-2 py-0.5 text-xs font-bold text-purple-700 hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-400"
                  >
                    +1 Hr
                  </button>
                )}
              </div>
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
              <div className="mb-1 flex items-center justify-between">
                <p className="text-xs text-gray-500">
                  Progress: {tracker.readPages} de {tracker.totalReadPages}
                </p>
                {(tracker.readPages || 0) < tracker.totalReadPages && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      quickUpdateProgress(tracker);
                    }}
                    className="rounded bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400"
                  >
                    +10 Pgs
                  </button>
                )}
              </div>
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
