import { Header } from "../components/Header";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export const Profile = () => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const { logout } = useAuth();

  return (
    <div className="dark:bg-bg-dark min-h-screen bg-slate-100">
      <Header theme={theme} setTheme={setTheme} logout={logout} />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Profile
        </h2>
        <p className="mt-4 text-gray-600 dark:text-gray-400">
          Página de Profile em construção...
        </p>
      </div>
    </div>
  );
};
