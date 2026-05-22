/* eslint-disable @typescript-eslint/no-explicit-any */
import { Moon, Sun, LogOut, User } from "lucide-react";

interface HeaderProps {
  theme: any;
  setTheme: any;
  logout: any;
}

export function Header({ theme, setTheme, logout }: HeaderProps) {
  return (
    <header className="dark:bg-bg-dark/80 sticky top-0 z-50 flex items-center justify-between border-b border-gray-200 bg-white/80 px-12 py-4 backdrop-blur-md dark:border-gray-800">
      <div></div>
      <h1>My Tracker</h1>

      <div className="flex items-center justify-center gap-4">
        <button
          className="rounded-full bg-gray-100 p-2.5 text-gray-700 transition hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
        </button>

        <button className="text-brand-600 dark:bg-brand-500/20 dark:text-brand-400 dark:hover:bg-brand-500/30 rounded-full bg-gray-100 p-2.5 transition hover:bg-gray-200">
          <User size={20} />
        </button>

        <button
          className="rounded-full bg-red-50 p-2.5 text-red-600 transition hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20"
          onClick={logout}
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
}
