/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Moon,
  Sun,
  LogOut,
  User,
  House,
  Clapperboard,
  Tv,
  Gamepad2,
  Book,
  Sparkle,
} from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { useModal } from "../contexts/ModalContext";

interface HeaderProps {
  theme: any;
  setTheme: any;
  logout: any;
}

export function Header({ theme, setTheme, logout }: HeaderProps) {
  const { setIsModalOpen } = useModal();

  return (
    <header className="dark:bg-bg-dark/80 sticky top-0 z-50 flex items-center justify-between border-b border-gray-200 bg-white/80 px-12 py-4 backdrop-blur-md dark:border-gray-800">
      <div className="flex items-center gap-8">
        <h1>My Tracker</h1>
      </div>

      <nav className="col-span-6 flex gap-6">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center gap-2 ${
              isActive
                ? "text-brand-600 dark:text-brand-500"
                : "text-gray-500 dark:text-gray-400"
            }`
          }
        >
          <House size={18} />
          Home
        </NavLink>

        <NavLink
          to="/movies"
          className={({ isActive }) =>
            `flex items-center gap-2 ${
              isActive
                ? "text-brand-600 dark:text-brand-500"
                : "text-gray-500 dark:text-gray-400"
            }`
          }
        >
          <Clapperboard size={18} />
          Movies
        </NavLink>

        <NavLink
          to="/series"
          className={({ isActive }) =>
            `flex items-center gap-2 ${
              isActive
                ? "text-brand-600 dark:text-brand-500"
                : "text-gray-500 dark:text-gray-400"
            }`
          }
        >
          <Tv size={18} />
          Series
        </NavLink>

        <NavLink
          to="/games"
          className={({ isActive }) =>
            `flex items-center gap-2 ${
              isActive
                ? "text-brand-600 dark:text-brand-500"
                : "text-gray-500 dark:text-gray-400"
            }`
          }
        >
          <Gamepad2 size={18} />
          Games
        </NavLink>

        <NavLink
          to="/books"
          className={({ isActive }) =>
            `flex items-center gap-2 ${
              isActive
                ? "text-brand-600 dark:text-brand-500"
                : "text-gray-500 dark:text-gray-400"
            }`
          }
        >
          <Book size={18} />
          Books
        </NavLink>
      </nav>

      <div className="flex items-center justify-center gap-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-brand-600 hover:bg-brand-500 flex items-center gap-2 rounded-xl px-4 py-2 font-medium text-white transition"
        >
          <Sparkle size={20} /> Add New
        </button>

        <button
          className="rounded-full bg-gray-100 p-2.5 text-gray-700 transition hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
        </button>

        <Link
          to="/profile"
          className="text-brand-600 dark:bg-brand-500/20 dark:text-brand-400 dark:hover:bg-brand-500/30 rounded-full bg-gray-100 p-2.5 transition hover:bg-gray-200"
        >
          <User size={20} />
        </Link>

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
