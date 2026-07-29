# NuTracker - Product Documentation & Tech Stack

NuTracker adalah aplikasi web kesehatan (*women's health*) interaktif yang berfungsi sebagai pelacak siklus menstruasi (*cycle tracker*) sekaligus asisten nutrisi pribadi berbasis kecerdasan buatan (AI). Aplikasi ini dirancang untuk membantu wanita memahami kebutuhan gizi tubuh mereka yang berubah di setiap fase siklus menstruasi secara klinis dan personal.

---

## 🌟 Fitur Utama

1. **Dashboard Interaktif**: Menyajikan ringkasan siklus harian, asupan gizi harian (AKG), status sistem, grafik tren suasana hati (*Mood Trend*), serta pintasan pelaporan gejala (*Quick Log*).
2. **Cycle Tracker**: Halaman pencatatan mandiri untuk memantau durasi menstruasi dan panjang siklus guna mengetahui fase saat ini secara akurat (Menstrual, Follicular, Ovulatory, Luteal).
3. **Smart Menu (AI Recommended)**: Fitur rekomendasi makanan harian pintar dan analisis kebutuhan nutrisi berbasis AI yang disesuaikan dengan keluhan fisik (seperti kram, kembung, lemas) serta fase menstruasi pengguna.
4. **Consultation Hub (AI Nutritionist)**: Chatbot interaktif ramah dan profesional bertenaga AI yang siap menjawab berbagai pertanyaan medis seputar gizi, hormon, dan gaya hidup sehat wanita.
5. **E-Book & Education Library**: Media edukasi bagi pengguna untuk membaca berbagai pustaka digital seputar kesehatan reproduksi.
6. **Admin Panel**: Akses kontrol eksklusif bagi administrator untuk mengelola pustaka digital (tambah/hapus e-book).

---

## 💻 Tech Stack (Teknologi yang Digunakan)

Proyek ini dibangun menggunakan arsitektur **Modern Full-Stack (Client-Server)** dengan teknologi utama berikut:

### 1. Frontend (Client-side)
*   **React 19**: Library UI berbasis komponen yang efisien untuk membangun antarmuka web yang dinamis.
*   **TypeScript**: Menambahkan keamanan tipe data (*static typing*) pada JavaScript untuk meminimalkan error runtime dan mempermudah pemeliharaan kode.
*   **Vite 6**: Alat build (*bundler*) modern yang super cepat untuk mendukung kenyamanan proses pengembangan (HMR) dan build produksi yang optimal.
*   **Tailwind CSS v4**: Kerangka kerja CSS utility-first terbaru untuk desain UI yang responsif, modern, dan sangat kustomisasi melalui pengaturan `@theme`.
*   **React Router DOM v7**: Pengelola navigasi halaman tunggal (SPA) yang aman dan dinamis.
*   **Recharts**: Library grafik berbasis SVG yang responsif untuk memvisualisasikan data tren suasana hati (*Mood Trend*).
*   **Motion (Framer Motion v12)**: Digunakan untuk memberikan animasi mikro dan transisi halaman yang mulus.
*   **Lucide React**: Kumpulan ikon SVG modern berkualitas tinggi yang ringan dan konsisten.

### 2. Backend (Server-side)
*   **Express.js**: Framework server Node.js minimalis untuk membuat API endpoints penunjang frontend.
*   **TypeScript (Node)**: Digunakan bersama `server.ts` untuk memastikan integrasi tipe data yang selaras dari frontend ke backend.
*   **TSX**: Library eksekutor untuk langsung menjalankan TypeScript server (`server.ts`) di lingkungan development tanpa langkah kompilasi manual.
*   **Esbuild**: Bundler performa tinggi yang digunakan untuk memaketkan kode server TypeScript menjadi file CJS tunggal saat aplikasi di-build untuk produksi.

### 3. Integrasi Kecerdasan Buatan (AI)
*   **Google GenAI SDK (`@google/genai` v1.29.0)**: SDK resmi Google untuk menghubungkan server langsung ke Google Gemini API secara aman.
*   **Gemini 3 Flash Preview (`gemini-3-flash-preview`)**: Model bahasa besar (LLM) yang digunakan karena kecepatannya yang tinggi dan efisiensi biayanya untuk menganalisis data nutrisi klinis serta melayani obrolan konsultasi interaktif.

### 4. Alat Bantu & Utilitas Lainnya
*   **date-fns**: Library manipulasi tanggal untuk menghitung secara presisi fase siklus berdasarkan hari pertama haid terakhir.
*   **clsx** & **tailwind-merge**: Digunakan untuk penggabungan kelas-kelas Tailwind secara dinamis tanpa konflik.
*   **dotenv**: Pengelola file `.env` untuk memisahkan kredensial penting seperti kunci API Gemini secara aman dari kode utama.

---

## ⚙️ Cara Kerja Arsitektur Aplikasi

1. **Routing & Serving**: Saat proses development, Express bertindak sebagai server utama di port `3000`, dan melewatkan aset frontend ke modul middleware Vite. Pada fase produksi, Express menyajikan file statis hasil build dari folder `/dist`.
2. **AI Processing**: Ketika pengguna meminta analisis gejala atau berkonsultasi, frontend mengirimkan request JSON ke server Express. Server kemudian menggunakan **Gemini API** dengan instruksi sistem klinis yang ketat untuk mengolah masukan, lalu mengirimkan jawabannya kembali ke frontend dalam format yang terstruktur.
3. **Database Simulasi (In-Memory)**: Daftar buku edukasi disimpan langsung di dalam memori server utama untuk menyimulasikan operasi CRUD (Create, Read, Delete) tanpa perlu menginstal database eksternal terpisah.
