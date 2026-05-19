export interface ITracker {
  id: string;
  title: string;
  category: string;
  grade: number;
  episodesWatched?: number;
  totalEpisodesWatched?: number;
  hoursPlayed?: number;
  totalHoursPlayed?: number;
  readPages?: number;
  totalReadPages?: number;
}
