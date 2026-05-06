import type { ITracker } from "../types/tracker.interface";

interface ListProps {
  trackers: ITracker[];
  prepararEdicao: (tracker: ITracker) => void;
  deletarTracker: (id: string) => void;
}

export const TrackerList = ({
  trackers,
  prepararEdicao,
  deletarTracker,
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
          className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
        >
          <div>
            <strong className="text-lg text-gray-800">{tracker.titulo}</strong>
            <span className="ml-2 rounded-md bg-gray-100 px-2 py-1 text-sm text-gray-500">
              {tracker.categoria}
            </span>
            <p className="mt-1 text-sm text-gray-600">
              Nota:{" "}
              <span className="font-bold text-blue-600">{tracker.nota}</span>/10
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => prepararEdicao(tracker)}
              className="rounded-lg bg-amber-100 px-3 py-1 font-medium text-amber-700 transition-colors hover:bg-amber-200"
            >
              Editar
            </button>
            <button
              onClick={() => deletarTracker(tracker.id)}
              className="rounded-lg bg-red-100 px-3 py-1 font-medium text-red-700 transition-colors hover:bg-red-200"
            >
              Excluir
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};
