interface ProgressProps {
  current: number;
  total: number;
  color?: string;
}

export const ProgressBar = ({
  current,
  total,
  color = "bg-blue-500",
}: ProgressProps) => {
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className="h-4 w-full rounded-full bg-gray-200 dark:bg-gray-700">
      <div
        className={`h-4 rounded-full ${color}`}
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
};
