export interface ITracker {
  id: string;
  title: string;
  category: string;
  grade: number;
  posterPath?: string;
  episodesWatched?: number;
  totalEpisodesWatched?: number;
  hoursPlayed?: number;
  totalHoursPlayed?: number;
  readPages?: number;
  totalReadPages?: number;
}
