/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Trophy, ArrowRight, CheckCircle2, RotateCcw, Sparkles, BrainCircuit, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils.ts';

const ALL_QUESTIONS = [
  {
    q: 'Berapa rata-rata kebutuhan Zat Besi wanita saat haid dibandingkan hari biasa?',
    a: ['Sama saja', 'Lebih rendah', 'Lebih tinggi 2x lipat', 'Tidak perlu zat besi'],
    correct: 2,
    fact: 'Tubuh kehilangan zat besi melalui darah haid, sehingga kebutuhan melonjak hingga 18-26mg/hari.'
  },
  {
    q: 'Fase apa yang terjadi tepat sebelum masa haid dimulai?',
    a: ['Folikular', 'Ovulasi', 'Luteal', 'Menebal'],
    correct: 2,
    fact: 'Fase Luteal berlangsung setelah ovulasi hingga hari pertama haid.'
  },
  {
    q: 'Nutrisi apa yang paling membantu meredakan kram perut (PMS)?',
    a: ['Magnesium', 'Gula', 'Lemak Jenuh', 'Kafein'],
    correct: 0,
    fact: 'Magnesium melemaskan otot rahim dan mengurangi intensitas kontraksi penyebab nyeri.'
  },
  {
    q: 'Apa hormon dominan yang meningkat di fase Folikular?',
    a: ['Progesteron', 'Estrogen', 'Kortisol', 'Testosteron'],
    correct: 1,
    fact: 'Estrogen meningkat untuk menebalkan dinding rahim menyambut sel telur.'
  },
  {
    q: 'Makanan apa yang sebaiknya dihindari saat Luteal untuk cegah kembung?',
    a: ['Alpukat', 'Garam berlebih', 'Kacang-kacangan', 'Air putih'],
    correct: 1,
    fact: 'Duh, sodium (garam) berlebih mengikat air di tubuh dan memperparah kembung!'
  },
  {
    q: 'Vitamin apa yang membantu penyerapan Zat Besi?',
    a: ['Vitamin A', 'Vitamin C', 'Vitamin D', 'Vitamin E'],
    correct: 1,
    fact: 'Vitamin C membantu tubuh menyerap zat besi non-heme dari sayuran lebih efisien.'
  },
  {
    q: 'Kapan puncak masa subur (Ovulasi) biasanya terjadi?',
    a: ['Hari 1', 'Hari 7', 'Hari 14', 'Hari 28'],
    correct: 2,
    fact: 'Pada siklus 28 hari, ovulasi biasanya terjadi sekitar hari ke-14.'
  },
  {
    q: 'Olahraga jenis apa yang disarankan saat fase Menstruasi?',
    a: ['HIIT', 'Angkat Beban Berat', 'Yoga Ringan / Jalan Santai', 'Crossfit'],
    correct: 2,
    fact: 'Olahraga intensitas rendah membantu sirkulasi tanpa membebani tubuh yang sedang luruh.'
  },
  {
    q: 'Berapa persentase wanita yang mengalami Irregular Period (Haid tidak teratur)?',
    a: ['1% - 5%', '14% - 25%', '50% - 60%', '90% - 100%'],
    correct: 1,
    fact: 'Sekitar 14-25% wanita mengalami siklus haid yang tidak teratur, sering kali karena stres atau hormon.'
  },
  {
    q: 'Zat gizi apa yang penting untuk produksi hormon bahagia (Serotonin) saat PMS?',
    a: ['Kalsium', 'Zink', 'Vitamin B6', 'Kolesterol'],
    correct: 2,
    fact: 'Vitamin B6 membantu mensintesis serotonin yang membuat mood lebih stabil saat PMS.'
  },
  {
    q: 'Minuman apa yang bisa memperburuk kram perut saat haid?',
    a: ['Teh Chamomile', 'Air Putih Panas', 'Kopi (Kafein)', 'Jus Jeruk'],
    correct: 2,
    fact: 'Kafein dapat menyempitkan pembuluh darah, yang dapat memperparah kram pada rahim.'
  },
  {
    q: 'Berapa lama rata-rata fase Folikular berlangsung?',
    a: ['3-5 Hari', '13-14 Hari', '21 Hari', '28 Hari'],
    correct: 1,
    fact: 'Fase Folikular biasanya berlangsung 13-14 hari, dari hari pertama haid hingga ovulasi.'
  }
];

export default function MiniGames() {
  const [isStarted, setIsStarted] = useState(false);
  const [sessionQuestions, setSessionQuestions] = useState<typeof ALL_QUESTIONS>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [showFact, setShowFact] = useState(false);

  const startGame = () => {
    const shuffled = [...ALL_QUESTIONS].sort(() => 0.5 - Math.random());
    setSessionQuestions(shuffled.slice(0, 5));
    setCurrentStep(0);
    setScore(0);
    setShowResult(false);
    setSelectedIdx(null);
    setShowFact(false);
    setIsStarted(true);
  };

  const handleAnswer = (idx: number) => {
    if (selectedIdx !== null) return;
    
    setSelectedIdx(idx);
    if (idx === sessionQuestions[currentStep].correct) {
      setScore(s => s + 1);
    }
    
    setTimeout(() => {
      setShowFact(true);
    }, 600);
  };

  const nextQuestion = () => {
    setShowFact(false);
    setSelectedIdx(null);
    if (currentStep < sessionQuestions.length - 1) {
      setCurrentStep(s => s + 1);
    } else {
      setShowResult(true);
    }
  };

  const reset = () => {
    setIsStarted(false);
  };

  return (
    <div className="max-w-3xl mx-auto pb-20">
      <AnimatePresence mode="wait">
        {!isStarted ? (
          <motion.div 
            key="start"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-[3rem] p-16 text-center shadow-sm border border-rose-100 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-rose-500 via-rose-300 to-rose-500" />
            <div className="w-32 h-32 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-8 relative">
              <div className="absolute inset-0 bg-rose-100 rounded-full animate-ping opacity-20" />
              <BrainCircuit className="text-rose-500" size={48} />
            </div>
            
            <span className="px-4 py-2 bg-rose-50 text-rose-500 font-black text-[10px] uppercase tracking-widest rounded-full mb-6 inline-block border border-rose-100">
              Daily Challenge
            </span>
            
            <h2 className="text-4xl font-serif font-bold text-slate-900 italic mb-4">Cerdas Gizi & Hormon</h2>
            <p className="text-slate-500 font-medium italic mb-10 max-w-md mx-auto">
              Uji pengetahuanmu tentang siklus menstruasi dan nutrisi. Setiap sesi berisi 5 pertanyaan unik yang diacak secara sistematis. Berani mencoba?
            </p>
            
            <button 
              onClick={startGame}
              className="px-10 py-5 bg-rose-500 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-rose-600 transition-all mx-auto shadow-xl shadow-rose-200 hover:-translate-y-1 hover:shadow-2xl"
            >
              <Play fill="currentColor" size={16} /> Mulai Bermain
            </button>
          </motion.div>
        ) : !showResult ? (
          <motion.div 
            key="quiz"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-[3rem] p-10 shadow-sm border border-rose-100 overflow-hidden relative"
          >
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-rose-50 rounded-full" />
            
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-rose-500 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-100">
                    <BrainCircuit className="text-white" size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">Cerdas Gizi</h2>
                    <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest">Level: Beginner</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Progress
                  </span>
                  <div className="text-sm font-bold text-slate-900">{currentStep + 1} / {sessionQuestions.length}</div>
                </div>
              </div>

              <div className="w-full bg-slate-50 h-3 rounded-full mb-10 overflow-hidden">
                <motion.div 
                  className="bg-rose-500 h-full shadow-[0_0_10px_rgba(244,63,94,0.3)]" 
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentStep + 1) / sessionQuestions.length) * 100}%` }}
                />
              </div>

              <h3 className="text-3xl font-serif font-bold text-slate-900 mb-8 italic leading-snug">
                {sessionQuestions[currentStep].q}
              </h3>

              <div className="grid grid-cols-1 gap-4">
                {sessionQuestions[currentStep].a.map((ans, i) => {
                  const isCorrect = i === sessionQuestions[currentStep].correct;
                  const isWrong = selectedIdx === i && !isCorrect;
                  const showCorrect = selectedIdx !== null && isCorrect;

                  return (
                    <button
                      key={i}
                      disabled={selectedIdx !== null}
                      onClick={() => handleAnswer(i)}
                      className={cn(
                        "w-full p-6 text-left border-2 rounded-[2rem] font-bold transition-all flex justify-between items-center group",
                        selectedIdx === null 
                          ? "border-slate-50 text-slate-700 hover:border-rose-400 hover:bg-rose-50 hover:text-rose-600"
                          : showCorrect 
                            ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                            : isWrong
                              ? "border-rose-300 bg-rose-50 text-rose-400"
                              : "border-slate-50 text-slate-300"
                      )}
                    >
                      <span>{ans}</span>
                      {showCorrect && <Sparkles size={18} className="text-emerald-500" />}
                    </button>
                  );
                })}
              </div>

              <AnimatePresence>
                {showFact && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8 p-6 bg-slate-900 text-white rounded-3xl"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles size={14} className="text-rose-400" />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-400">Tahukah Kamu?</span>
                    </div>
                    <p className="text-sm italic leading-relaxed text-slate-300">{sessionQuestions[currentStep].fact}</p>
                    <button 
                      onClick={nextQuestion}
                      className="mt-4 w-full py-3 bg-white text-black rounded-xl font-black text-xs uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all shadow-lg"
                    >
                      Next Question
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[3rem] p-16 text-center shadow-sm border border-rose-100 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-rose-500 via-emerald-400 to-rose-500" />
            <div className="w-24 h-24 bg-rose-500 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-rose-200 rotate-12">
              <Trophy className="text-white" size={48} />
            </div>
            <h2 className="text-4xl font-serif font-bold text-slate-900 italic mb-2">Sesi Selesai! ✨</h2>
            <p className="text-slate-500 font-medium italic mb-10">Pengetahuan kamu bertambah hari ini.</p>
            
            <div className="grid grid-cols-2 gap-4 mb-10">
              <div className="bg-rose-50 p-6 rounded-3xl border border-rose-100">
                <div className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-1">Skor Kamu</div>
                <div className="text-3xl font-black text-rose-800">{score} / {sessionQuestions.length}</div>
              </div>
              <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100">
                <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">XP Points</div>
                <div className="text-3xl font-black text-emerald-800">+{score * 10}</div>
              </div>
            </div>

            <button 
              onClick={reset}
              className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-rose-600 transition-colors shadow-2xl shadow-rose-100"
            >
              <RotateCcw size={16} /> Main Lagi
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
