import {
  Routes,
  Route,
  useNavigate,
  useLocation,
  Navigate,
} from "react-router-dom";
import {
  Calendar,
  Activity,
  Utensils,
  BookOpen,
  MessageCircle,
  Trophy,
  Settings,
} from "lucide-react";
import Sidebar from "./layouts/sidebar.tsx";
import Dashboard from "./components/Dashboard.tsx";
import { useAuth } from "./context/AuthContext.tsx";
// Components

import LoginPage from "./components/Auth/LoginPage.tsx";
import Onboarding from "./components/Auth/OnBoarding.tsx";

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const { user, userProfile, isAdmin, loading, logout } = useAuth();

  if (!user) {
    return <LoginPage />;
  }
  if (!userProfile && !isAdmin) {
    return <Onboarding />;
  }
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-surface-bright/50 overflow-hidden">
      {/* Sidebar Navigation */}
      <Sidebar />
      
      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 p-6 md:p-10 overflow-y-auto h-screen">
        <Routes>
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </main>
    </div>
  );
}
