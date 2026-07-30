import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { doc, getDoc, setDoc, serverTimestamp, collection, query, where, getDocs, deleteDoc } from "firebase/firestore";
import {
  Sparkles,
  Zap,
  Plus,
  RotateCcw,
  Notebook,
  Text,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function Dashboard() {
  const { userProfile, user } = useAuth();
  const [greeting, setGreeting] = useState("");
  const [advice, setAdvice] = useState("Memuat tips kesehatan harian...");

  // tanggal saat ini
  const [currentDate, setCurrentDate] = useState(new Date());

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
  // List data mood dan visualisasinya
  const moods = [
    {
      name: "Senang",
      label: "Senang! 🥰",
      img: "./Mood_img/Senang.jpg",
      color: "text-emerald-700 bg-emerald-50 border-emerald-200/50",
      ring: "ring-emerald-400",
    },
    {
      name: "Good Mood",
      label: "Bersemangat! ✨",
      img: "./Mood_img/Good Mood.jpg",
      color: "text-amber-700 bg-amber-50 border-amber-200/50",
      ring: "ring-amber-400",
    },
    {
      name: "Mager",
      label: "Mager... 😴",
      img: "./Mood_img/Mager.jpg",
      color: "text-blue-700 bg-blue-50 border-blue-200/50",
      ring: "ring-blue-400",
    },
    {
      name: "Sedih",
      label: "Sedih 😢",
      img: "./Mood_img/Sedih.jpg",
      color: "text-indigo-700 bg-indigo-50 border-indigo-200/50",
      ring: "ring-indigo-400",
    },
    {
      name: "Kesel",
      label: "Kesel! 😠",
      img: "./Mood_img/Kesel.jpg",
      color: "text-rose-700 bg-rose-50 border-rose-200/50",
      ring: "ring-rose-400",
    },
  ];

  const [activeMoodIndex, setActiveMoodIndex] = useState(0);
  const [savedMood, setSavedMood] = useState<string | null>(null);

  const nextMood = () => {
    setActiveMoodIndex((prev) => (prev + 1) % moods.length);
    setSavedMood(null); // Reset status simpan ketika pindah mood
  };

  const prevMood = () => {
    setActiveMoodIndex((prev) => (prev - 1 + moods.length) % moods.length);
    setSavedMood(null); // Reset status simpan ketika pindah mood
  };

  useEffect(() => {
    const fetchTodayMood = async () => {
      if (!user) return;
      const offset = currentDate.getTimezoneOffset();
      const localDate = new Date(currentDate.getTime() - offset * 60 * 1000);
      const dateStr = localDate.toISOString().split("T")[0];

      try {
        const moodDocRef = doc(db, "users", user.uid, "mood_logs", dateStr);
        const docSnap = await getDoc(moodDocRef);
        if (docSnap.exists()) {
          const todayData = docSnap.data();
          const index = moods.findIndex((m) => m.name === todayData.mood);
          if (index !== -1) {
            setActiveMoodIndex(index);
            setSavedMood(todayData.mood);
          }
        }
      } catch (e) {
        console.error("Gagal memuat mood hari ini:", e);
      }
    };
    fetchTodayMood();
  }, [user]);

  const saveMood = async () => {
    if (!user) return;
    
    // Format tanggal lokal YYYY-MM-DD
    const offset = currentDate.getTimezoneOffset();
    const localDate = new Date(currentDate.getTime() - offset * 60 * 1000);
    const dateStr = localDate.toISOString().split("T")[0];

    try {
      // 1. Simpan mood hari ini ke Firestore
      const moodDocRef = doc(db, "users", user.uid, "mood_logs", dateStr);
      await setDoc(moodDocRef, {
        mood: moods[activeMoodIndex].name,
        dateStr: dateStr,
        createdAt: serverTimestamp(),
      });
      
      setSavedMood(moods[activeMoodIndex].name);

      // 2. Pembersihan Sisi Client: Hapus data yang lebih tua dari 60 hari secara otomatis
      const sixtyDaysAgo = new Date();
      sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
      const sixtyDaysAgoStr = sixtyDaysAgo.toISOString().split("T")[0]; // Format YYYY-MM-DD

      const moodLogsRef = collection(db, "users", user.uid, "mood_logs");
      const q = query(moodLogsRef, where("dateStr", "<", sixtyDaysAgoStr));
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach(async (document) => {
        await deleteDoc(doc(db, "users", user.uid, "mood_logs", document.id));
      });
    } catch (error) {
      console.error("Gagal menyimpan mood atau membersihkan riwayat lama:", error);
    }
  };

  return (
    <div className="w-full flex flex-col lg:flex-row gap-8 animate-in fade-in duration-700">
      {/* KIRI: Selamat Datang, AI Advice & Calorie Logger Controls */}
      <div className="flex-1 flex flex-col gap-6">
        {/* Banner Selamat Datang & AI Advice (Modern Glassmorphism) */}
        <div className="w-full bg-gradient-to-br from-primary/10 via-primary-fixed/20 to-surface-container-high p-8 rounded-[2.5rem] border border-primary-fixed/20 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-fixed/10 rounded-full blur-2xl" />

          <div className="relative z-10">
            <h1 className="ml-2 text-2xl md:text-3xl font-black text-primary font-sans leading-tight">
              {greeting}, {userProfile?.name || user?.displayName || "Nutrier"}!
            </h1>
            <p className="ml-2 text-xs text-on-surface-variant font-semibold mt-1 uppercase tracking-wider">
              Mari kita penuhi kebutuhan energi Anda hari ini.
            </p>

            {/* AI Advice Bubble (Orange Accent) */}
            <div className="bg-white/90 backdrop-blur-md p-5 rounded-2xl border border-secondary-container/10 shadow-sm mt-6 flex gap-4 items-start">
              <div className="w-10 h-10 bg-secondary-container/20 rounded-xl flex items-center justify-center text-secondary shrink-0">
                <Text className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h4 className="text-xs font-black text-secondary uppercase tracking-widest mb-1 font-sans">
                  Nutrition Advice
                </h4>
                <p className="text-sm text-on-surface-variant font-medium leading-relaxed">
                  {advice}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KANAN: Panel Vertikal Mood Tracker */}
      <div className="w-full lg:w-80 bg-white p-8 rounded-[2.5rem] border border-outline-variant/30 shadow-sm flex flex-col items-center justify-between gap-6 relative overflow-hidden shrink-0 min-h-[480px]">
        {/* Header Title */}
        <div className="text-center w-full">
          <h3 className="font-bold text-lg text-primary font-sans tracking-tight mb-1">
            Bagaimana mood kamu hari ini?
          </h3>
          <p className="text-xs text-on-surface-variant font-medium mb-4">
            Catat suasana hatimu untuk rekap harian
          </p>

          {/* Tanggal Hari Ini Pill */}
          <div className="inline-flex items-center gap-1.5 bg-surface-container-low px-4 py-1.5 rounded-full border border-outline-variant/10 text-xs font-semibold text-on-surface-variant">
            <span className="font-satisfy text-lg text-primary-container font-bold">
              {currentDate.toLocaleDateString("id-ID", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </div>

        {/* Carousel Slide Area */}
        <div className="relative flex flex-col items-center justify-center w-full my-4">
          {/* Main Photo Ring Frame with Mood-based Glow Ring */}
          <div
            className={`w-40 h-40 rounded-full flex items-center justify-center transition-all duration-500 ring-4 ring-offset-4 ring-offset-white ${moods[activeMoodIndex].ring} shadow-xl shadow-slate-100/50 overflow-hidden`}
          >
            <img
              key={activeMoodIndex}
              className="w-full h-full object-cover animate-in fade-in zoom-in-95 duration-500"
              src={moods[activeMoodIndex].img}
              alt={moods[activeMoodIndex].name}
            />
          </div>

          {/* Navigation Chevron Left */}
          <button
            onClick={prevMood}
            className="absolute left-[-10px] top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-md border border-outline-variant/30 text-on-surface-variant hover:text-primary rounded-full shadow-md flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer z-10"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Navigation Chevron Right */}
          <button
            onClick={nextMood}
            className="absolute right-[-10px] top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-md border border-outline-variant/30 text-on-surface-variant hover:text-primary rounded-full shadow-md flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer z-10"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Mood Info and Indicators */}
        <div className="w-full flex flex-col items-center gap-4">
          {/* Active Mood Pill Label */}
          <div
            className={`px-5 py-1.5 rounded-full border text-xs font-black uppercase tracking-widest ${moods[activeMoodIndex].color} transition-all duration-300`}
          >
            {moods[activeMoodIndex].label}
          </div>

          {/* Pagination Indicators Dots */}
          <div className="flex items-center gap-1.5">
            {moods.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setActiveMoodIndex(i);
                  setSavedMood(null);
                }}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === activeMoodIndex
                    ? "w-6 bg-primary"
                    : "w-1.5 bg-outline-variant/40 hover:bg-outline-variant/60"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Bottom Interactive Save Action Button / Success Info */}
        <div className="w-full mt-4">
          {savedMood ? (
            <div className="text-center text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-100 px-4 py-3.5 rounded-2xl w-full animate-in fade-in slide-in-from-bottom-2 duration-300">
              Mood berhasil disimpan! Hari Anda akan menyenangkan. 🥰✨
            </div>
          ) : (
            <button
              onClick={saveMood}
              className="w-full py-3.5 rounded-2xl bg-primary hover:bg-primary-container text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/10 hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
            >
              Simpan Mood
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
