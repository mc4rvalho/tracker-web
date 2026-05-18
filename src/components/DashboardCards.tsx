/* eslint-disable @typescript-eslint/no-explicit-any */
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
      <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
        <h2>Episódios Assistidos</h2>
        <p className="text-4xl font-bold text-blue-600">
          {totals.totalWatchedEpisodes}
        </p>
      </div>

      <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
        <h2>Horas jogadas</h2>
        <p className="text-4xl font-bold text-blue-600">
          {totals.totalHoursPlayed}
        </p>
      </div>

      <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
        <h2>Páginas lidas</h2>
        <p className="text-4xl font-bold text-blue-600">
          {totals.totalReadPages}
        </p>
      </div>
    </div>
  );
};
