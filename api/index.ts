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
const gemini = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});
app.get("/api/advice", async (req, res) => {
  try {
    const apiKey = process.env.AGNES_API_KEY || "";
    const response = await fetch("https://apihub.agnes-ai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "agnes-2.0-flash",
        messages: [
          {
            role: "system",
            content: "Kamu adalah asisten AI yang ahli dalam nutrisi dan kesehatan wanita. Berikan 1 tips kesehatan/nutrisi harian singkat dan inspiratif untuk wanita. Format JSON harus memiliki key 'advice' seperti: { \"advice\": \"isi tips harian singkat di sini\" }"
          },
          {
            role: "user",
            content: "Berikan tips kesehatan harian."
          }
        ],
        temperature: 0.7,
        max_tokens: 1024
      })
    });

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "{}";
    
    // Bersihkan codeblock markdown jika dikembalikan oleh AI
    const cleanContent = content.replace(/```json/g, "").replace(/```/g, "").trim();
    
    res.json(JSON.parse(cleanContent));
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Gagal mendapatkan advice dari Agnes AI." });
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
