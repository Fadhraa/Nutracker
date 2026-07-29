/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { BookOpen, Search, Play, Download, ExternalLink, Hash, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';

export default function EducationLibrary() {
  const [books, setBooks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await fetch('/api/books');
        if (res.ok) {
          const data = await res.json();
          setBooks(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBooks();
  }, []);

  const filteredBooks = books.filter(b => b.title.toLowerCase().includes(searchQuery.toLowerCase()) || b.category.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-8 pb-10"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-4xl font-serif font-bold italic text-slate-900 leading-tight">Knowledge Hub</h2>
          <p className="text-slate-500 font-medium italic mt-1 uppercase text-[10px] tracking-[0.2em]">Verified Indonesian & Global Resources</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-grow md:flex-grow-0">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Cari materi..." 
              className="pl-12 pr-4 py-3 bg-white border border-rose-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-200 w-full md:w-72 shadow-sm"
            />
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-64 text-rose-400">
           <Loader2 className="animate-spin mb-4" size={32} />
           <p className="text-sm font-bold uppercase tracking-widest text-rose-300">Memuat Jurnal...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map((book, i) => (
            <motion.div 
              key={book.id || i} 
              whileHover={{ y: -8 }}
              className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-rose-100 group flex flex-col h-full hover:shadow-2xl hover:shadow-rose-100/30 transition-all duration-500"
            >
              <div className="h-44 bg-gradient-to-br from-rose-50 to-rose-100 rounded-[2rem] mb-6 relative overflow-hidden flex items-center justify-center border border-rose-50">
                {book.image ? (
                  <img src={book.image} alt={book.title} className="w-full h-full object-cover opacity-80 mix-blend-multiply" />
                ) : (
                  <BookOpen className="text-rose-200" size={64} />
                )}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur rounded-full text-[9px] font-black uppercase tracking-widest text-rose-600 shadow-sm border border-rose-50">
                    {book.readTime || 'E-Book'}
                  </span>
                </div>
              </div>
              
              <div className="flex-grow space-y-3">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest flex items-center gap-1">
                    <Hash size={10} /> {book.category}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 italic">{book.author}</span>
                </div>
                <h3 className="font-bold text-slate-900 text-xl leading-tight group-hover:text-rose-600 transition-colors">{book.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-3 italic">{book.description}</p>
              </div>

              <div className="mt-8 pt-6 border-t border-rose-50 flex gap-3">
                <button className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-rose-600 transition-all shadow-lg shadow-slate-100 group-hover:scale-[1.02]">
                  <Download size={14} /> Baca PDF
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
