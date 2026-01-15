import { useEffect, useState, useRef } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import Transactions from "./pages/Transactions";
import Budgets from "./pages/Budgets";
import Savings from "./pages/Savings";
import NotFound from "./pages/NotFound";
import AI_API from "./services/aiApi";
import ImportStatement from "./pages/ImportStatement";

export default function App() {
  const [isAuth, setIsAuth] = useState(!!localStorage.getItem("token"));
  const [theme, setTheme] = useState<"light" | "dark">(
    (localStorage.getItem("theme") as "light" | "dark") || "light"
  );

  // 🔥 ensures AI warm-up runs only once per session
  const aiWarmedUp = useRef(false);

  // 🔥 AI SERVICE WARM-UP
  useEffect(() => {
    if (!isAuth) return;
    if (aiWarmedUp.current) return;

    aiWarmedUp.current = true;

    AI_API.get("/health").catch(() => { });
  }, [isAuth]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    const root = document.documentElement;
    root.classList.add("no-transition");
    setTheme(t => (t === "dark" ? "light" : "dark"));
    requestAnimationFrame(() =>
      requestAnimationFrame(() => root.classList.remove("no-transition"))
    );
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsAuth(false);
    aiWarmedUp.current = false; // reset for next login
  };

  if (!isAuth) {
    return <Auth onAuthSuccess={() => setIsAuth(true)} />;
  }

  return (
    <>
      <Header onLogout={logout} theme={theme} toggleTheme={toggleTheme} />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/import" element={<ImportStatement />} />
        <Route path="/budgets" element={<Budgets />} />
        <Route path="/savings" element={<Savings />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}