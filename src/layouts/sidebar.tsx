import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import {
  Calendar,
  Utensils,
  BookOpen,
  MessageCircle,
  Trophy,
  Activity,
} from "lucide-react";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const { logout } = useAuth();

  return (
    <div className="fixed w-full h-screen md:w-64 border-b md:border-r border-outline-variant/20 p-6 flex flex-col gap-8 shrink-0 bg-surface-container-low min-h-screen">
      {/* Brand Logo */}
      <div
        className="flex items-center gap-3 cursor-pointer animate-in fade-in duration-300"
        onClick={() => navigate("/")}
      >
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary-fixed/20">
          N
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-primary font-sans">
          Nutracker
        </h1>
      </div>

      {/* Navigation Links */}
      <ul className="flex flex-col gap-1.5">
        {[
          { path: "/", icon: Activity, label: "Dashboard" },
          { path: "/tracker", icon: Calendar, label: "Cycle Tracker" },
          { path: "/nutrition", icon: Utensils, label: "Smart Menu" },
          { path: "/education", icon: BookOpen, label: "E-book" },
          { path: "/consult", icon: MessageCircle, label: "Consult" },
          { path: "/games", icon: Trophy, label: "Games" },
        ].map((item) => {
          const isActive = currentPath === item.path;
          return (
            <li key={item.path}>
              <button
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200 cursor-pointer text-sm font-bold ${
                  isActive
                    ? "bg-primary text-white shadow-md shadow-primary/20"
                    : "text-on-surface-variant hover:bg-primary-fixed/20 hover:text-primary"
                }`}
              >
                <item.icon
                  size={20}
                  className={`transition-transform ${
                    isActive ? "scale-105" : "opacity-80"
                  }`}
                />
                <span>{item.label}</span>
              </button>
            </li>
          );
        })}
      </ul>

      {/* Bottom Info & Logout */}
      <div className="mt-auto p-1">
        <button
          onClick={logout}
          className="w-full py-3.5 border  border-error rounded-2xl hover:bg-error text-error hover:text-surface font-black text-xs uppercase tracking-widest shadow-lg hover:shadow-xl transition-all cursor-pointer"
        >
          Log out
        </button>
      </div>
    </div>
  );
}
