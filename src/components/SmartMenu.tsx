/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from 'react';
import { Utensils, Search, Brain, Loader2, Salad, Coffee, Pizza, Droplets, X, ChevronRight, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CyclePhase, UserProfile, Meal } from '../types.ts';
import { cn } from '../lib/utils.ts';

interface Props {
  user: UserProfile;
  phase: CyclePhase;
}

const MOCK_MEALS: Meal[] = [
  {
    id: '1',
    type: 'Morning',
    name: 'Overnight Oats with Berries',
    calories: 350,
    protein: 12,
    carbs: 55,
    fats: 8,
    phaseSuitability: ['Follicular', 'Ovulation'],
    ingredients: ['1/2 cup Rolled Oats', '1 cup Almond Milk', '1/2 cup Mixed Berries', '1 tbsp Chia Seeds', '1 tsp Honey'],
    steps: [
      'Mix oats, milk, and chia seeds in a jar.',
      'Leave in refrigerator overnight.',
      'Top with fresh berries and honey before serving.'
    ]
  },
  {
    id: '2',
    type: 'Noon',
    name: 'Quinoa Salad with Chickpeas',
    calories: 450,
    protein: 15,
    carbs: 65,
    fats: 14,
    phaseSuitability: ['Follicular', 'Menstrual'],
    ingredients: ['1 cup Quinoa', '1/2 cup Chickpeas', 'Cucumber', 'Cherry Tomatoes', 'Lemon Dressing'],
    steps: [
      'Cook quinoa as per package instructions.',
      'Chop vegetables and mix with chickpeas.',
      'Toss everything with lemon dressing.'
    ]
  },
  {
    id: '3',
    type: 'Night',
    name: 'Grilled Salmon with Asparagus',
    calories: 520,
    protein: 35,
    carbs: 10,
    fats: 38,
    phaseSuitability: ['Luteal', 'Ovulation'],
    ingredients: ['150g Salmon Fillet', '1 bunch Asparagus', 'Olive Oil', 'Lemon', 'Garlic'],
    steps: [
      'Season salmon and asparagus with garlic and oil.',
      'Grill for 12-15 minutes until salmon is flaky.',
      'Squeeze fresh lemon over it.'
    ]
  },
  {
    id: '4',
    type: 'Morning',
    name: 'Avocado Toast with Egg',
    calories: 380,
    protein: 14,
    carbs: 28,
    fats: 24,
    phaseSuitability: ['Follicular', 'Luteal'],
    ingredients: ['2 slices Whole Grain Bread', '1/2 Avocado', '1 Poached Egg', 'Chili Flakes'],
    steps: [
      'Toast the bread until golden.',
      'Mash avocado and spread on toast.',
      'Top with a poached egg and chili flakes.'
    ]
  }
];

export default function SmartMenu({ user, phase }: Props) {
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [symptomText, setSymptomText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);

  const toggleSymptom = (s: string) => {
    setSymptoms(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  };

  const filteredMeals = useMemo(() => {
    return MOCK_MEALS.filter(m => 
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.ingredients.some(i => i.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [searchQuery]);

  const analyzeSymptoms = async () => {
    setIsAnalyzing(true);
    try {
      const allSymptoms = [...symptoms];
      if (symptomText) allSymptoms.push(symptomText);
      
      const res = await fetch('/api/nutrition/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symptoms: allSymptoms, phase })
      });
      const data = await res.json();
      setRecommendations(data.recommendations || []);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="flex flex-col gap-8 pb-10"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Input & Analysis */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-rose-100">
            <h3 className="font-serif text-2xl font-bold italic text-slate-800 mb-2">Feeling anything?</h3>
            <p className="text-sm text-slate-400 mb-6 font-medium italic">Select or type your current symptoms for AI-powered nutrition advice.</p>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {['Kram', 'Kembung', 'Jerawat', 'Lemas', 'Mood Swing', 'Pusing'].map(s => (
                <button
                  key={s}
                  onClick={() => toggleSymptom(s)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all",
                    symptoms.includes(s) 
                      ? "bg-rose-500 border-rose-500 text-white shadow-lg shadow-rose-100" 
                      : "bg-rose-50 border-rose-100 text-rose-600 hover:border-rose-300"
                  )}
                >
                  {s}
                </button>
              ))}
            </div>

            <textarea 
              value={symptomText}
              onChange={(e) => setSymptomText(e.target.value)}
              placeholder="Tuliskan gejala spesifik lainnya di sini..."
              className="w-full p-4 mb-6 bg-slate-50 border border-slate-100 rounded-[1.5rem] text-sm font-medium italic focus:outline-none focus:ring-2 focus:ring-rose-200 resize-none h-32"
            />

            <button 
              onClick={analyzeSymptoms}
              disabled={isAnalyzing || (symptoms.length === 0 && !symptomText)}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 disabled:opacity-50 hover:bg-rose-600 transition-colors shadow-xl shadow-slate-100"
            >
              {isAnalyzing ? <Loader2 className="animate-spin" size={16} /> : <Brain size={16} />}
              {isAnalyzing ? 'Analyzing AI...' : 'Analyze My Needs'}
            </button>
          </div>

          <div className="bg-emerald-500 p-8 rounded-[2rem] text-white shadow-xl shadow-emerald-100">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-serif text-xl font-bold italic">Hydration Track</h3>
              <Droplets className="text-white/40" />
            </div>
            <div className="text-4xl font-black mb-1 italic">1.2<span className="text-lg opacity-60">L</span></div>
            <div className="text-[10px] font-black uppercase tracking-widest opacity-60">Goal: 2.5L</div>
            <div className="mt-6 h-2 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-white w-1/2 rounded-full" />
            </div>
          </div>
        </div>

        {/* Right: Recommendations & Menu */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-rose-100 min-h-[400px]">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center text-rose-600">
                  <BookOpen size={20} />
                </div>
                <h3 className="font-serif text-2xl font-bold italic text-slate-800">Digital Menu Book</h3>
              </div>
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search meals or ingredients..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-rose-200"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[600px] overflow-y-auto pr-4 scrollbar-hide">
              <AnimatePresence mode="popLayout">
                {filteredMeals.map((meal, i) => (
                  <motion.div 
                    key={meal.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 hover:border-rose-200 transition-all group cursor-pointer"
                    onClick={() => setSelectedMeal(meal)}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center text-rose-500">
                        {meal.type === 'Morning' && <Coffee size={24} />}
                        {meal.type === 'Noon' && <Salad size={24} />}
                        {meal.type === 'Night' && <Pizza size={24} />}
                      </div>
                      <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest">{meal.type}</span>
                    </div>
                    <h4 className="font-bold text-slate-900 group-hover:text-rose-600 transition-colors uppercase italic">{meal.name}</h4>
                    <div className="mt-4 flex gap-4 text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                      <span>{meal.calories} Kcal</span>
                      <span className="text-emerald-500">{meal.protein}g P</span>
                      <span className="text-orange-500">{meal.carbs}g C</span>
                    </div>
                    <div className="mt-4 flex items-center text-rose-600 font-bold text-xs">
                      View Recipe <ChevronRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          <AnimatePresence>
            {recommendations.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-900 p-8 rounded-[2rem] text-white shadow-xl shadow-rose-100"
              >
                <div className="flex items-center gap-3 mb-6">
                  <Brain className="text-rose-500" size={24} />
                  <h3 className="font-serif text-xl font-bold italic">AI Health Analysis</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recommendations.map((rec, i) => (
                    <div key={i} className="p-4 bg-white/10 rounded-2xl border border-white/5">
                      <h5 className="font-bold text-rose-400 mb-1">{rec.food}</h5>
                      <p className="text-xs text-slate-300 italic">{rec.reason}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Meal Detail Modal */}
      <AnimatePresence>
        {selectedMeal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setSelectedMeal(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-2xl rounded-[3rem] p-10 overflow-y-auto max-h-[85vh] shadow-[0_30px_60px_-12px_rgba(0,0,0,0.25)]"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-8">
                <div>
                  <span className="text-[10px] font-black text-rose-500 uppercase tracking-[0.2em] mb-2 inline-block">Recipe Guide</span>
                  <h2 className="text-4xl font-serif font-bold text-slate-900 italic leading-tight">{selectedMeal.name}</h2>
                </div>
                <button 
                  onClick={() => setSelectedMeal(null)}
                  className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:text-rose-600 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div>
                  <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                     <div className="w-1.5 h-6 bg-rose-500 rounded-full" /> Ingredients
                  </h4>
                  <ul className="space-y-2">
                    {selectedMeal.ingredients.map((ing, i) => (
                      <li key={i} className="text-sm text-slate-600 flex items-center gap-2 italic">
                        <div className="w-1 h-1 bg-rose-200 rounded-full" /> {ing}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                     <div className="w-1.5 h-6 bg-rose-500 rounded-full" /> Steps
                  </h4>
                  <ol className="space-y-4">
                    {selectedMeal.steps.map((step, i) => (
                      <li key={i} className="text-sm text-slate-600 flex gap-3 italic">
                        <span className="font-black text-rose-500 text-xs mt-0.5">{i+1}.</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>

              <div className="mt-10 p-6 bg-rose-50 rounded-[2rem] border border-rose-100 flex justify-between items-center">
                 <div className="text-center">
                   <p className="text-[9px] font-black text-rose-400 uppercase tracking-widest">Kcal</p>
                   <p className="text-lg font-bold text-rose-900">{selectedMeal.calories}</p>
                 </div>
                 <div className="w-px h-8 bg-rose-200" />
                 <div className="text-center">
                   <p className="text-[9px] font-black text-rose-400 uppercase tracking-widest">Protein</p>
                   <p className="text-lg font-bold text-rose-900">{selectedMeal.protein}g</p>
                 </div>
                 <div className="w-px h-8 bg-rose-200" />
                 <div className="text-center">
                   <p className="text-[9px] font-black text-rose-400 uppercase tracking-widest">Carbs</p>
                   <p className="text-lg font-bold text-rose-900">{selectedMeal.carbs}g</p>
                 </div>
                 <div className="w-px h-8 bg-rose-200" />
                 <div className="text-center">
                   <p className="text-[9px] font-black text-rose-400 uppercase tracking-widest">Fats</p>
                   <p className="text-lg font-bold text-rose-900">{selectedMeal.fats}g</p>
                 </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
