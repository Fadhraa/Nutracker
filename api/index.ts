import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json())



app.post("/api/admin/login", (req, res) => {
  const { email, password } = req.body;
  if (email === "trackeradmin@gmail.com" && password === "nutracker123") {
    res.json({ token: "admin_token_sec_123" });
  } else {
    res.status(401).json({ error: "Email atau password salah." });
  }
});

// Gemini Client Initialization
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});
app.get("/api/advice", async (req, res) => {
  try{
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Berikan 1 tips kesehatan/nutrisi harian singkat dan inspiratif untuk wanita. Format JSON harus memiliki key 'advice' seperti: { \"advice\": \"isi tips harian singkat di sini\" }",
      config: {
        responseMimeType: "application/json"
      }
    });
    res.json(JSON.parse(response.text || "{}"));
  }catch (e){
    console.error(e);
    res.status(500).json({ error: "Gagal mendapatkan advice." });
  }
});
// API Routes
app.post("/api/nutrition/analyze", async (req, res) => {
  try {
    const { symptoms, phase } = req.body;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analisis gejala gizi untuk wanita. Fase: ${phase}. Gejala: ${symptoms.join(", ")}. 
      Berikan 3 rekomendasi makanan spesifik yang membantu meredakan gejala tersebut berdasarkan literatur nutrisi klinis. 
      Format JSON: { "recommendations": [{ "food": "", "reason": "" }] }`,
      config: {
        responseMimeType: "application/json"
      }
    });

    res.json(JSON.parse(response.text || "{}"));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Gagal menganalisis data." });
  }
});

app.post("/api/nutrition/chat", async (req, res) => {
  try {
    const { messages } = req.body;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: messages,
      config: {
        systemInstruction: "Kamu adalah seorang ahli gizi (Nutritionist) profesional bernama AI Nutritionist. Fokusmu memberikan pemahaman siklus menstruasi, kesehatan wanita, dan rekomendasi gizi akurat berbasis sains. Jawab dengan ramah, suportif, dan bahasa Indonesia yang mudah dipahami.",
      }
    });

    res.json({ text: response.text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Gagal memproses pesan." });
  }
});

// Vite middleware for development / Static file serving for production
async function setupFrontend() {
  if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else if (!process.env.VERCEL) {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }
}

setupFrontend().then(() => {
  if (!process.env.VERCEL) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Nuracker Server running on http://localhost:${PORT}`);
    });
  }
});

export default app;
