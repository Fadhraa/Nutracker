import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { Sparkles, Zap, Plus, RotateCcw } from "lucide-react";

export default function Dashboard() {
  const { userProfile, user } = useAuth();
  const [greeting, setGreeting] = useState("");
  const [advice, setAdvice] = useState("Memuat tips kesehatan harian...");

  // State interaktif untuk simulasi asupan kalori
  const [currentCalories, setCurrentCalories] = useState(0);

  // Target kalori diambil dari profile user (Firestore) atau fallback default 2000
  const targetCalories = 2000;
  const fillPercentage = Math.min(currentCalories / targetCalories, 1);

  // Fungsi mengambil advice AI dari backend
  async function getAdvice() {
    try {
      const response = await fetch("/api/advice");
      const data = await response.json();
      setAdvice(data.advice || "Tetap jaga asupan nutrisi seimbang hari ini!");
    } catch (e) {
      console.error(e);
      setAdvice("Gagal memuat tips harian. Tetap prioritaskan makanan sehat!");
    }
  }

  useEffect(() => {
    const time = new Date();
    const hour = time.getHours();
    if (hour < 12) {
      setGreeting("Selamat pagi");
    } else if (hour < 18) {
      setGreeting("Selamat siang");
    } else {
      setGreeting("Selamat malam");
    }
    getAdvice();
  }, []);

  // Fungsi menambah asupan kalori harian
  const addCalories = (amount: number) => {
    setCurrentCalories((prev) => Math.min(prev + amount, targetCalories));
  };

  const resetCalories = () => {
    setCurrentCalories(0);
  };

  return (
    <div className="w-full flex flex-col lg:flex-row gap-8 animate-in fade-in duration-700">
      {/* KIRI: Selamat Datang, AI Advice & Calorie Logger Controls */}
      <div className="flex-1 flex flex-col gap-6">
        {/* Banner Selamat Datang & AI Advice (Modern Glassmorphism) */}
        <div className="w-full bg-gradient-to-br from-primary/10 via-primary-fixed/20 to-surface-container-high p-8 rounded-[2.5rem] border border-primary-fixed/20 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-fixed/10 rounded-full blur-2xl" />

          <div className="relative z-10">
            <h1 className="text-2xl md:text-3xl font-black text-primary font-sans leading-tight">
              {greeting}, {userProfile?.name || user?.displayName || "Nutrier"}!
              ✨
            </h1>
            <p className="text-xs text-on-surface-variant font-semibold mt-1 uppercase tracking-wider">
              Mari kita penuhi kebutuhan energi Anda hari ini.
            </p>

            {/* AI Advice Bubble (Orange Accent) */}
            <div className="bg-white/90 backdrop-blur-md p-5 rounded-2xl border border-secondary-container/10 shadow-sm mt-6 flex gap-4 items-start">
              <div className="w-10 h-10 bg-secondary-container/20 rounded-xl flex items-center justify-center text-secondary shrink-0">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h4 className="text-xs font-black text-secondary uppercase tracking-widest mb-1 font-sans">
                  AI Nutrition Advice
                </h4>
                <p className="text-sm text-on-surface-variant font-medium leading-relaxed">
                  {advice}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Panel Kontrol & Ringkasan Kalori (Orange/Green Accent) */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-outline-variant/30 shadow-sm flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-xl text-primary font-sans">
                Daily Calories
              </h3>
              <p className="text-xs text-on-surface-variant font-medium">
                Log your food consumption
              </p>
            </div>
            <span className="text-[10px] font-black bg-secondary-container/20 text-secondary border border-secondary-container/30 px-3 py-1.5 rounded-full uppercase tracking-widest">
              Goal: {targetCalories} kcal
            </span>
          </div>

          {/* Progress Ring / Bar Visual */}
          <div className="w-full bg-surface-container-lowest border border-outline-variant/15 p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <div className="text-3xl font-black text-primary font-sans">
                {currentCalories}{" "}
                <span className="text-sm text-on-surface-variant font-medium">
                  kcal
                </span>
              </div>
              <p className="text-xs font-bold text-on-surface-variant mt-1">
                Tercapai dari target harian Anda
              </p>
            </div>

            {/* Progress Bar Horizontal (Carrot/Orange theme) */}
            <div className="flex-1 w-full flex flex-col gap-2">
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-secondary">
                <span>Konsumsi</span>
                <span>{Math.round(fillPercentage * 100)}%</span>
              </div>
              <div className="w-full h-3.5 bg-secondary-container/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-secondary-container rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${fillPercentage * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Tombol Logger Cepat (Multi-colored) */}
          <div className="flex flex-col gap-3">
            <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-1">
              Quick Log Meals / Energy
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* +150: Orange */}
              <button
                onClick={() => addCalories(150)}
                className="py-3 bg-white hover:bg-secondary-container/10 border border-secondary-container/30 hover:border-secondary-container rounded-2xl text-[10px] font-black uppercase tracking-widest text-secondary flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                150 kcal
              </button>
              {/* +300: Green */}
              <button
                onClick={() => addCalories(300)}
                className="py-3 bg-white hover:bg-primary-fixed/20 border border-primary-fixed/30 hover:border-primary rounded-2xl text-[10px] font-black uppercase tracking-widest text-primary flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                300 kcal
              </button>
              {/* +500: Purple */}
              <button
                onClick={() => addCalories(500)}
                className="py-3 bg-white hover:bg-tertiary-container/10 border border-tertiary-container/30 hover:border-tertiary-container rounded-2xl text-[10px] font-black uppercase tracking-widest text-tertiary flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                500 kcal
              </button>
              {/* Reset: Pink/Red */}
              <button
                onClick={resetCalories}
                className="py-3 bg-red-50 hover:bg-red-100 border border-red-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-red-600 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* KANAN: Panel Vertikal SVG Tubuh Manusia (Energy Meter with Green Accent) */}
      <div className="w-full lg:w-80 bg-white p-8 rounded-[2.5rem] border border-outline-variant/30 shadow-sm flex flex-col items-center justify-center gap-6 relative overflow-hidden shrink-0">
        {/* Label Atas */}
        <div className="text-center w-full">
          <div className="flex justify-center items-center gap-1.5 mb-1.5">
            <Zap className="w-4 h-4 text-primary animate-bounce" />
            <h3 className="font-bold text-lg text-primary font-sans uppercase tracking-wider text-sm">
              Energy Battery
            </h3>
          </div>
          <p className="text-xs text-on-surface-variant font-medium">
            Persentase energi tubuh hari ini
          </p>
        </div>

        {/* Visual SVG Tubuh Manusia Dinamis */}
        <div className="relative w-full max-w-[160px] py-4 flex items-center justify-center">
          <svg viewBox="0 0 100 200" className="w-full h-80 drop-shadow-sm">
            <defs>
              {/* Definisikan clip-path bentuk tubuh manusia */}
              <clipPath id="body-clip">
                <path
                  d="M 50 15 
                         A 12 12 0 1 0 50 39 
                         A 12 12 0 1 0 50 15 
                         M 50 41 
                         C 42 41, 34 45, 30 52 
                         C 27 58, 26 68, 27 80 
                         C 28 92, 29 104, 27 110 
                         C 25 115, 23 118, 20 120 
                         C 18 122, 17 124, 18 126 
                         C 19 128, 22 128, 25 124 
                         C 28 120, 31 114, 32 105 
                         L 33 130 
                         C 34 145, 33 160, 31 185 
                         C 30 190, 32 195, 35 195 
                         C 38 195, 39 190, 40 180 
                         L 47 135 
                         L 50 135 
                         L 53 135 
                         L 60 180 
                         C 61 190, 62 195, 65 195 
                         C 68 195, 70 190, 69 185 
                         C 67 160, 66 145, 67 130 
                         L 68 105 
                         C 69 114, 72 120, 75 124 
                         C 78 128, 81 128, 82 126 
                         C 83 124, 82 122, 80 120 
                         C 77 118, 75 115, 73 110 
                         C 71 104, 72 92, 73 80 
                         C 74 68, 73 58, 70 52 
                         C 66 45, 58 41, 50 41 Z"
                />
              </clipPath>

              {/* Gradasi warna pengisi (Hijau Emerald ke Hijau Muda) */}
              <linearGradient id="body-gradient" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="#0f5238" />
                <stop offset="100%" stopColor="#b1f0ce" />
              </linearGradient>
            </defs>

            {/* 1. Siluet tubuh belakang (Grey Outline/Faded) */}
            <path
              d="M 50 15 
                     A 12 12 0 1 0 50 39 
                     A 12 12 0 1 0 50 15 
                     M 50 41 
                     C 42 41, 34 45, 30 52 
                     C 27 58, 26 68, 27 80 
                     C 28 92, 29 104, 27 110 
                     C 25 115, 23 118, 20 120 
                     C 18 122, 17 124, 18 126 
                     C 19 128, 22 128, 25 124 
                     C 28 120, 31 114, 32 105 
                     L 33 130 
                     C 34 145, 33 160, 31 185 
                     C 30 190, 32 195, 35 195 
                     C 38 195, 39 190, 40 180 
                     L 47 135 
                     L 50 135 
                     L 53 135 
                     L 60 180 
                     C 61 190, 62 195, 65 195 
                     C 68 195, 70 190, 69 185 
                     C 67 160, 66 145, 67 130 
                     L 68 105 
                     C 69 114, 72 120, 75 124 
                     C 78 128, 81 128, 82 126 
                     C 83 124, 82 122, 80 120 
                     C 77 118, 75 115, 73 110 
                     C 71 104, 72 92, 73 80 
                     C 74 68, 73 58, 70 52 
                     C 66 45, 58 41, 50 41 Z"
              fill="#f1f5f9"
              stroke="#e2e8f0"
              strokeWidth="2"
            />

            {/* 2. Warna pengisi yang bergerak naik (Clipped by Human Body Shape) */}
            <rect
              x="0"
              y={200 - fillPercentage * 200}
              width="100"
              height={fillPercentage * 200}
              fill="url(#body-gradient)"
              clipPath="url(#body-clip)"
              className="transition-all duration-1000 ease-out"
            />
          </svg>

          {/* Label Persentase Terapung (Green Border) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/95 border border-primary-fixed/20 shadow-md px-3 py-1.5 rounded-full flex items-center gap-1">
            <span className="text-[10px] font-black text-primary">
              {Math.round(fillPercentage * 100)}%
            </span>
          </div>
        </div>

        {/* Keterangan Keterisian (Dynamic Green Alert Box) */}
        <div
          className={`text-center px-5 py-3 rounded-2xl w-full border transition-all ${
            fillPercentage === 0
              ? "bg-slate-100 text-slate-500 border-slate-200/50"
              : fillPercentage < 0.5
                ? "bg-primary/10 text-primary border-primary-fixed/5"
                : fillPercentage < 1
                  ? "bg-primary/30 text-primary border-primary-fixed/10"
                  : "bg-primary/80 text-white border-primary/20 shadow-md shadow-primary/10"
          }`}
        >
          <p className="text-xs font-extrabold uppercase tracking-wider">
            {fillPercentage === 0
              ? "Tubuh Memerlukan Kalori"
              : fillPercentage < 0.5
                ? "Energi Masih Rendah"
                : fillPercentage < 1
                  ? "Energi Mulai Optimal"
                  : "Baterai Energi Penuh!"}
          </p>
        </div>
      </div>
    </div>
  );
}
