/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
import toast from "react-hot-toast";
import { useModal } from "../contexts/ModalContext";
import { TrackerForm } from "./TrackerForm";
import { useEffect, useState, type FormEvent } from "react";
import { api } from "../services/api";
import { CircleX } from "lucide-react";
import { useDashboard } from "../contexts/DashboardContext";
import { useLocation } from "react-router-dom";

export function AddTrackerModal() {
  const { isModalOpen, setIsModalOpen } = useModal();
  const {
    loadDashboard,
    trackers,
    setTrackers,
    editingTracker,
    setEditingTracker,
  } = useDashboard();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Series");
  const [grade, setGrade] = useState<number | "">("");
  const [idInEdition, setIdEmEdicao] = useState<string | null>(null);

  const [episodesWatched, setEpisodesWatched] = useState<number | "">("");
  const [hoursPlayed, setHoursPlayed] = useState<number | "">("");
  const [readPages, setReadPages] = useState<number | "">("");

  const [tags, setTags] = useState<string[]>([]);
  const [externalId, setExternalId] = useState<number | string>("");

  const [posterPath, setPosterPath] = useState("");
  const [search, setSearch] = useState<any[]>([]);

  const location = useLocation();

  useEffect(() => {
    if (editingTracker) {
      setIdEmEdicao(editingTracker.id);
      setTitle(editingTracker.title);
      setCategory(editingTracker.category);
      setGrade(editingTracker.grade);

      const trackerAny = editingTracker as any;
      setExternalId(
        trackerAny.tmdbId ||
          trackerAny.rawgId ||
          trackerAny.openLibraryId ||
          "",
      );
    } else {
      setIdEmEdicao(null);
      setTitle("");

      if (location.pathname === "/movies") setCategory("Movie");
      else if (location.pathname === "/games") setCategory("Game");
      else if (location.pathname === "/books") setCategory("Book");
      else setCategory("Series");

      setGrade("");
      setExternalId("");
    }
  }, [editingTracker, location.pathname]);

  const saveTracker = async (e: FormEvent) => {
    e.preventDefault();

    try {
      let payload: any = {
        title,
        category,
        grade: Number(grade),
        tags: tags.length > 0 ? tags : [category],
      };

      let route = "";

      if (category === "Series") {
        route = "/series";
        payload = {
          ...payload,
          posterPath,
          tmdbId: Number(externalId),
          watchedEpisodes: Number(episodesWatched),
          seasons: 1,
          seasonsWatched: 0,
        };
      } else if (category === "Movie") {
        route = "/movies";
        payload = {
          ...payload,
          posterPath,
          tmdbId: Number(externalId),
        };
      } else if (category === "Game") {
        route = "/games";
        payload = {
          ...payload,
          coverPath: posterPath,
          hoursPlayed: Number(hoursPlayed),
          rawgId: Number(externalId),
          platform: "PC",
        };
      } else if (category === "Book") {
        route = "/books";
        payload = {
          ...payload,
          coverPath: posterPath,
          author: "Unknown",
          readPages: Number(readPages),
          openLibraryId: String(externalId),
        };
      }

      if (idInEdition) {
        const resposta = await api.patch(`${route}/${idInEdition}`, payload);

        setTrackers(
          trackers.map((tracker) =>
            tracker.id === idInEdition ? resposta.data : tracker,
          ),
        );
      } else {
        const resposta = await api.post(route, payload);
        setTrackers([resposta.data, ...trackers]);
      }

      setTitle("");
      setCategory("Series");
      setGrade("");
      setPosterPath("");
      setExternalId("");
      setTags([]);
      setIdEmEdicao(null);
      setEpisodesWatched("");
      setHoursPlayed("");
      setReadPages("");

      loadDashboard();

      setIsModalOpen(false);
      setEditingTracker(null);

      toast.success(
        idInEdition ? "Tracker updated!" : "Tracker created successfully!",
      );
    } catch (erro) {
      console.error(`Error saving tracker: ${erro}`);
      toast.error("Error saving. Please check the data.");
    }
  };

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="dark:bg-bg-dark max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-10">
        <TrackerForm
          title={title}
          setTitle={setTitle}
          category={category}
          setCategory={setCategory}
          grade={grade}
          setGrade={setGrade}
          saveTracker={saveTracker}
          idInEdition={idInEdition}
          episodesWatched={episodesWatched}
          setEpisodesWatched={setEpisodesWatched}
          hoursPlayed={hoursPlayed}
          setHoursPlayed={setHoursPlayed}
          readPages={readPages}
          setReadPages={setReadPages}
          posterPath={posterPath}
          setPosterPath={setPosterPath}
          search={search}
          setSearch={setSearch}
          setExternalId={setExternalId}
          currentPath={location.pathname}
        />
        <button
          onClick={() => {
            setIsModalOpen(false);
            setEditingTracker(null);
          }}
          className="mt-4 flex items-center gap-2 rounded bg-red-500 px-4 py-2 text-white"
        >
          Fechar <CircleX size={20} />
        </button>
      </div>
    </div>
  );
}
