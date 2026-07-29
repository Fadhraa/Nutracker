// src/components/Onboarding.tsx
import { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useAuth } from "../../context/AuthContext";
import { UserProfile } from "../../types";
import { Leaf, Shield } from "lucide-react";

export default function Onboarding() {
  const { user, refreshProfile } = useAuth();
  const [age, setAge] = useState<number>();
  const [weight, setWeight] = useState<number>();
  const [height, setHeight] = useState<number>();
  const [step, setStep] = useState<number>(1);

  const handleSave = async (): Promise<void> => {
    if (!user) return;

    const profileData: UserProfile = {
      id: user.uid,
      name: user.displayName || "User Baru",
      age: age || 25,
      weight: weight || 50,
      height: height || 160,
    };

    await setDoc(doc(db, "users", user.uid), profileData);
    await refreshProfile();
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-surface-bright/80 p-6">
      <div className="w-full max-w-md flex flex-col">
        {/* Status Progress Bar */}
        <div className="w-full mb-8 px-2 flex flex-col items-center">
          <h1 className="text-xl font-bold font-sans text-primary mb-4 tracking-tight">
            Nutracker
          </h1>
          <div className="w-full flex justify-between text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-2">
            <span>Step {step} of 2</span>
            <span>{step === 1 ? "50% Complete" : "100% Complete"}</span>
          </div>
          <div className="w-full h-2 bg-primary-fixed/30 rounded-full overflow-hidden">
            <div
              className={`h-full bg-primary rounded-full transition-all duration-500 ease-in-out ${
                step === 1 ? "w-1/2" : "w-full"
              }`}
            />
          </div>
        </div>

        {/* Current Step Component */}
        {step === 1 ? (
          /* Step 1: Welcome Card */
          <div className="w-full bg-white p-8 rounded-[2.5rem] shadow-xl border border-outline-variant/30 text-center flex flex-col items-center animate-in fade-in zoom-in duration-300">
            {/* Icon daun */}
            <div className="w-16 h-16 bg-primary-fixed rounded-full flex items-center justify-center text-primary mb-6 shadow-sm shadow-primary-fixed/20">
              <Leaf className="w-8 h-8" />
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold font-sans text-primary mb-4">
              <span className="text-primary font-dancing text-2xl">
                Selamat Datang ,
              </span>
              Nutrier!
            </h2>

            {/* Description */}
            <p className="text-xs text-on-surface-variant leading-relaxed mb-8 px-2 font-medium">
              Untuk merancang perjalanan kesehatan khusus Anda, kami perlu
              memahami standar unik tubuh Anda. Ini membantu kami menghitung
              keseimbangan makro yang tepat untuk siklus dan gaya hidup Anda.
            </p>

            {/* Secure Notice */}
            <div className="w-full bg-surface-container-low p-4 rounded-2xl flex items-center gap-3 border border-outline-variant/10 mb-8">
              <Shield className="w-5 h-5 text-primary shrink-0" />
              <span className="text-[10px] text-on-surface-variant font-bold text-left leading-normal">
                Data Anda disimpan secara aman dan hanya digunakan untuk
                perhitungan nutrisi.
              </span>
            </div>

            {/* Button */}
            <button
              type="button"
              onClick={() => setStep(2)}
              className="w-full py-4 bg-primary hover:bg-primary-container text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-primary-container/20 hover:shadow-xl transition-all cursor-pointer"
            >
              Mulai Sekarang
            </button>
          </div>
        ) : (
          /* Step 2: Form input data tubuh */
          <div className="w-full bg-white p-8 rounded-[2.5rem] shadow-xl border border-outline-variant/30 flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="text-center mb-6">
              <h3 className="font-bold text-2xl text-primary font-serif italic mb-2">
                Lengkapi Data Fisik
              </h3>
              <p className="text-xs text-on-surface-variant font-medium">
                Silakan isi ukuran tubuh Anda untuk memulai kalkulasi nutrisi.
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSave();
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-[10px] font-black text-on-surface-variant mb-1.5 uppercase tracking-widest">
                  Usia (Tahun)
                </label>
                <input
                  type="number"
                  value={age || ""}
                  onChange={(e) => setAge(Number(e.target.value))}
                  required
                  placeholder="Contoh: 25"
                  className="w-full p-4 bg-surface-container-low border border-outline-variant/50 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-fixed focus:border-primary transition-all"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-on-surface-variant mb-1.5 uppercase tracking-widest">
                  Tinggi Badan (cm)
                </label>
                <input
                  type="number"
                  value={height || ""}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  required
                  placeholder="Contoh: 160"
                  className="w-full p-4 bg-surface-container-low border border-outline-variant/50 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-fixed focus:border-primary transition-all"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-on-surface-variant mb-1.5 uppercase tracking-widest">
                  Berat Badan (kg)
                </label>
                <input
                  type="number"
                  value={weight || ""}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  required
                  placeholder="Contoh: 50"
                  className="w-full p-4 bg-surface-container-low border border-outline-variant/50 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-fixed focus:border-primary transition-all"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 mt-2 bg-primary hover:bg-primary-container text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-primary-container/20 hover:shadow-xl transition-all cursor-pointer"
              >
                Simpan & Masuk Dashboard
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
