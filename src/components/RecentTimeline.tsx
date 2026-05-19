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
  if (!recents) {
    return <p>Carregando recentes...</p>;
  }

  if (recents.length === 0) {
    return <p>Nenhum tracker recente.</p>;
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
