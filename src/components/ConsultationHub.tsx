/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, Phone, Video, Calendar, MoreHorizontal, Send, Loader2, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';

type Message = { role: 'user' | 'model'; parts: { text: string }[] };

export default function ConsultationHub() {
  const doctor = { name: 'AI Nutritionist', status: 'Online', img: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=200&h=200&fit=crop' };

  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', parts: [{ text: 'Halo! Saya AI Nutritionist, konsultan gizi khusus wanita. Ada pertanyaan seputar gizi, keluhan PMS, atau performa tubuh di fase siklus tertentu yang ingin didiskusikan hari ini? 😊' }] }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!inputText.trim() || isTyping) return;

    const userMessage: Message = { role: 'user', parts: [{ text: inputText.trim() }] };
    const newMessages = [...messages, userMessage];
    
    setMessages(newMessages);
    setInputText('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/nutrition/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages })
      });
      
      const data = await response.json();
      
      if (response.ok && data.text) {
        setMessages(prev => [...prev, { role: 'model', parts: [{ text: data.text }] }]);
      } else {
        throw new Error(data.error || 'Server error');
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', parts: [{ text: 'Maaf, saya sedang mengalami kendala jaringan. Coba lagi nanti ya 🙏' }] }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="h-[calc(100vh-200px)] flex gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-4xl mx-auto">
      {/* Chat Area */}
      <div className="flex-1 bg-white rounded-[2rem] shadow-sm border border-rose-100 flex flex-col overflow-hidden">
        <div className="p-6 border-b border-rose-50 flex justify-between items-center bg-rose-50/30 backdrop-blur">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img src={doctor.img} className="w-12 h-12 rounded-full object-cover" alt="Active" />
              <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white bg-green-500" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 flex items-center gap-2">
                {doctor.name}
                <Sparkles className="text-rose-500" size={16} />
              </h4>
            </div>
          </div>
          <div className="flex gap-3 hidden sm:flex">
             <div className="px-4 py-2 bg-rose-50 rounded-xl text-rose-600 text-xs font-bold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> 24/7 AI Ready
             </div>
          </div>
        </div>

        <div className="flex-1 p-6 sm:p-8 overflow-y-auto space-y-6 flex flex-col bg-slate-50/50">
          <div className="self-center px-4 py-1.5 bg-rose-100 rounded-full text-[10px] font-black text-rose-600 uppercase tracking-widest mb-4">Konsultasi Pribadi & Rahasia</div>
          
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`max-w-[85%] sm:max-w-[75%] p-5 rounded-3xl ${
                  msg.role === 'user' 
                    ? 'bg-rose-500 text-white self-end rounded-br-none shadow-lg shadow-rose-200' 
                    : 'bg-white border border-rose-100 text-slate-800 self-start rounded-bl-none shadow-sm'
                }`}
              >
                <div className={`text-sm leading-relaxed ${msg.role === 'user' ? 'font-medium' : ''}`}>
                  {msg.role === 'model' ? (
                     <div className="markdown-body prose prose-sm prose-rose">
                       <ReactMarkdown>{msg.parts[0].text}</ReactMarkdown>
                     </div>
                  ) : (
                     msg.parts[0].text
                  )}
                </div>
              </motion.div>
            ))}
            
            {isTyping && (
               <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-white border border-rose-100 p-5 rounded-3xl rounded-bl-none self-start flex gap-2 items-center text-rose-400 shadow-sm"
               >
                 <Loader2 size={16} className="animate-spin" /> <span className="text-xs font-medium italic">AI Nutritionist mengetik...</span>
               </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 sm:p-6 border-t border-rose-50 bg-white">
          <div className="relative">
            <input 
              type="text" 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ceritakan keluhan atau tanyakan seputar gizi..."
              className="w-full pl-6 pr-16 py-4 bg-slate-50 border border-slate-100 focus:border-rose-200 rounded-[1.5rem] focus:outline-none focus:ring-4 focus:ring-rose-50 text-sm font-medium transition-all"
              disabled={isTyping}
            />
            <button 
              onClick={handleSend}
              disabled={!inputText.trim() || isTyping}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center hover:bg-rose-500 disabled:opacity-50 disabled:hover:bg-slate-900 transition-all shadow-lg active:scale-95"
            >
              <Send size={18} className="translate-x-[-1px] translate-y-[1px]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
