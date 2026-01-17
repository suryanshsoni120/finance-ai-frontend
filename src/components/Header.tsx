import { Moon, Sun, LogOut, LayoutDashboard, History, PieChart, PiggyBank } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";

interface Props {
  onLogout: () => void;
  theme: "light" | "dark";
  toggleTheme: () => void;
}

export default function Header({ onLogout, theme, toggleTheme }: Props) {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-card dark:bg-darkcard shadow-sm border-b border-gray-100 dark:border-gray-800">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="text-lg font-bold tracking-wide flex items-center gap-2">
          <img src={logo} alt="Finance AI logo" className="w-8 h-8 object-contain"/>
          <span className="hidden sm:inline">Finance AI</span>
        </Link>

        <nav className="flex items-center gap-1 bg-gray-100 dark:bg-slate-800 p-1 rounded-xl">
          <Link
            to="/"
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${isActive("/")
              ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              }`}
          >
            <LayoutDashboard size={16} />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>
          <Link
            to="/transactions"
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${isActive("/transactions")
              ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              }`}
          >
            <History size={16} />
            <span className="hidden sm:inline">Transactions</span>
          </Link>
          <Link
            to="/budgets"
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${isActive("/budgets")
              ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              }`}
          >
            <PieChart size={16} />
            <span className="hidden sm:inline">Budgets</span>
          </Link>
          <Link
            to="/savings"
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${isActive("/savings")
              ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              }`}
          >
            <PiggyBank size={16} />
            <span className="hidden sm:inline">Savings</span>
          </Link>
        </nav>

        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <button
            onClick={onLogout}
            className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer"
            title="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}