interface AnalyticsProps {
  analytics: {
    averageGrade: number;
    topGenres: {
      tag: string;
      count: number;
    }[];
  };
}

export const AnalyticsDashboard = ({ analytics }: AnalyticsProps) => {
  if (!analytics) {
    return (
      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Esqueleto do Cartão 1 (Média) */}
        <div className="flex h-32 animate-pulse flex-col items-center justify-center rounded-xl bg-gray-200 shadow-sm dark:bg-gray-800"></div>

        {/* Esqueleto do Cartão 2 (Gêneros) */}
        <div className="flex h-32 animate-pulse flex-col items-center justify-center rounded-xl bg-gray-200 shadow-sm"></div>
      </div>
    );
  }

  return (
    <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
      {/* CARD 1: Média Geral */}
      <div className="bg-surface-light dark:bg-surface-dark flex flex-col items-center justify-center rounded-xl border border-gray-200 p-6 shadow-sm dark:border-gray-800">
        <h3 className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">
          Read Pages
        </h3>
        <span className="text-5xl font-extrabold text-amber-500 drop-shadow-sm">
          ⭐ {analytics.averageGrade.toFixed(1)}
        </span>
      </div>

      {/* CARD 2: Gêneros Favoritos */}
      <div className="bg-surface-light dark:bg-surface-dark flex flex-col justify-center rounded-xl border border-gray-200 p-6 shadow-sm dark:border-gray-800">
        <h3 className="mb-4 text-sm font-medium text-gray-500 dark:text-gray-400">
          Favorites Genres
        </h3>
        <div className="flex flex-wrap gap-2">
          {analytics.topGenres.map((genre, index) => (
            <span
              key={index}
              className="bg-brand-500/10 text-brand-600 dark:text-brand-400 rounded-full px-3 py-1 text-sm font-semibold"
            >
              {genre.tag} ({genre.count})
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
