/* eslint-disable @typescript-eslint/no-explicit-any */
interface RecentTimelineProps {
  recents: any[];
}

const iconsTracker: Record<string, string> = {
  SERIES: "📺",
  MOVIE: "🍿",
  GAME: "🎮",
  BOOK: "📖",
  // Fallback
  Default: "📌",
};

export const RecentTimeline = ({ recents }: RecentTimelineProps) => {
  // LOADING STATE
  if (!recents) {
    return (
      <div className="mt-8 rounded-xl bg-white p-6 shadow-sm dark:bg-gray-900">
        <div className="mb-4 h-6 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-800"></div>
        <ul className="space-y-4">
          {/* Array falso [1,2,3] só para renderizar 3 linhas piscando */}
          {[1, 2, 3].map((i) => (
            <li
              key={i}
              className="flex justify-between border-b border-gray-100 pb-2 dark:border-gray-800"
            >
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 animate-pulse rounded-md bg-gray-200 dark:bg-gray-800"></div>
                <div className="h-5 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-800"></div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  // EMPTY STATE
  if (recents.length === 0) {
    return (
      <p className="py-4 text-gray-500">Nenhum tracker recente encontrado.</p>
    );
  }

  return (
    <div className="mt-8 rounded-xl bg-white p-6 shadow-sm dark:bg-gray-500">
      <h3 className="mb-4 text-xl font-bold">Últimas Atualizações</h3>

      <ul className="space-y-4">
        {recents.map((tracker) => (
          <li key={tracker.id} className="flex justify-between border-b pb-2">
            <span className="flex items-center gap-2">
              <span className="text-xl">
                {iconsTracker[tracker.type] || iconsTracker.Default}
              </span>
              <span className="font-medium text-gray-800 dark:text-gray-200">
                {tracker.title}
              </span>
              <span className="text-sm text-gray-400 dark:text-gray-300">
                {tracker.category}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};
