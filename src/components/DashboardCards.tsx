/* eslint-disable @typescript-eslint/no-explicit-any */
import { BookOpen, Gamepad2, Tv } from "lucide-react";

interface DashboardProps {
  totals: any;
  recents: any;
  analytics: any;
}

export const DashboardCards = ({ totals }: DashboardProps) => {
  if (!totals) {
    return <p>Carregando os dados...</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <div className="dark:hover:shadow-brand-900/20 bg-surface-light dark:bg-surface-dark rounded-2xl border border-gray-200 p-6 shadow transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-gray-800">
        <h2 className="flex items-center gap-2 text-sm font-medium text-gray-500">
          <Tv size={18} /> Watched Episodes
        </h2>
        <p className="text-brand-600 dark:text-brand-500 text-4xl font-bold">
          {totals.totalWatchedEpisodes}
        </p>
      </div>

      <div className="bg-surface-light dark:bg-surface-dark dark:hover:shadow-brand-900/20 rounded-2xl border border-gray-200 p-6 shadow transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-gray-800">
        <h2 className="flex items-center gap-2 text-sm font-medium text-gray-500">
          <Gamepad2 size={18} /> Hours Played
        </h2>
        <p className="text-brand-600 dark:text-brand-500 text-4xl font-bold">
          {totals.totalHoursPlayed}
        </p>
      </div>

      <div className="dark:hover:shadow-brand-900/20 bg-surface-light dark:bg-surface-dark rounded-2xl border border-gray-200 p-6 shadow transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-gray-800">
        <h2 className="flex items-center gap-2 text-sm font-medium text-gray-500">
          <BookOpen size={18} /> Read Pages
        </h2>
        <p className="text-brand-600 dark:text-brand-500 text-4xl font-bold">
          {totals.totalReadPages}
        </p>
      </div>
    </div>
  );
};
