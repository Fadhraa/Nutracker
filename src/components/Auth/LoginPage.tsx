// src/components/LoginPage.tsx
import { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth } from "../../lib/firebase";

// 💡 1. Penjelasan TS: Union string literals untuk state status halaman
type AuthMode = "login" | "register" | "admin";

export default function LoginPage() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [name, setName] = useState<string>("");

  // 💡 2. Penjelasan TS: Menentukan tipe data Event pada form handler
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    try {
      if (mode === "login") {
        await signInWithEmailAndPassword(auth, email, password);
      } else if (mode === "register") {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password,
        );
        // Perbarui nama di Firebase Auth profile
        if (userCredential.user) {
          await updateProfile(userCredential.user, { displayName: name });
        }
      } else if (mode === "admin") {
        if (email === "trackeradmin@gmail.com" && password === "nutracker123") {
          await signInWithEmailAndPassword(auth, email, password);
        } else {
          alert("Kredensial admin salah.");
        }
      }
    } catch (err: unknown) {
      // 💡 3. Penjelasan TS: Menangani error bertipe 'unknown'
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert("Terjadi kesalahan tidak dikenal.");
      }
    }
  };

  return (
    <div className="w-screen h-screen flex p-8 flex-col md:flex-row overflow-hidden bg-surface-bright/80">
      <div className="flex w-full bg-white rounded-lg shadow-lg">
        {/* Kiri: Gambar penuh setengah layar */}
        <div className="hidden md:block md:w-1/2 h-full relative rounded-l-lg">
          <img
            src="./nutracker_logo.png"
            className="w-full h-full object-cover object-center rounded-l-lg"
            alt="Nutracker Banner"
          />
          {/* Soft green gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/20 to-transparent" />
        </div>

        {/* Kanan: Halaman Login & Form */}
        <div className="w-full md:w-1/2 h-full flex flex-col justify-center items-center p-6 md:p-12">
          <div className="w-full max-w-md bg-white p-8 rounded-[2rem] border border-emerald-200 shadow-xl shadow-emerald-100/20">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold font-serif text-emerald-900 italic">
                {mode === "login"
                  ? "Selamat Datang"
                  : mode === "register"
                    ? "Daftar Akun"
                    : "Masuk Admin"}
              </h2>
              <p className="text-xs text-slate-400 mt-1.5 font-medium">
                Partner setia untuk dukung gaya hidup sehatmu
              </p>
            </div>

            {/* Tab Switcher */}
            <div className="flex gap-2 mb-6 bg-emerald-50/60 p-1.5 rounded-2xl">
              <button
                type="button"
                onClick={() => setMode("login")}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                  mode === "login"
                    ? "bg-white text-emerald-700 shadow-sm"
                    : "text-slate-500 hover:text-emerald-600"
                }`}
              >
                Masuk
              </button>
              <button
                type="button"
                onClick={() => setMode("register")}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                  mode === "register"
                    ? "bg-white text-emerald-700 shadow-sm"
                    : "text-slate-500 hover:text-emerald-600"
                }`}
              >
                Daftar
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "register" && (
                <div>
                  <label className="block text-[10px] font-black text-slate-400 mb-1.5 uppercase tracking-widest">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    placeholder="Masukkan nama lengkap Anda"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full p-4 bg-emerald-50/30 border border-emerald-100/50 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 transition-all"
                  />
                </div>
              )}

              <div>
                <label className="block text-[10px] font-black text-slate-400 mb-1.5 uppercase tracking-widest">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="contoh@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full p-4 bg-emerald-50/30 border border-emerald-100/50 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 mb-1.5 uppercase tracking-widest">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full p-4 bg-emerald-50/30 border border-emerald-100/50 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 transition-all"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 mt-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-100 hover:shadow-xl transition-all cursor-pointer"
              >
                {mode === "register"
                  ? "Daftar Akun Baru"
                  : mode === "admin"
                    ? "Masuk Sebagai Admin"
                    : "Masuk ke Dashboard"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
