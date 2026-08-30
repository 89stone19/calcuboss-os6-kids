import React from 'react';
import { AppMode, Teacher } from '../types';
import { Sparkles, BarChart3, MessageSquare, GraduationCap, ShieldCheck, Zap, Users, Puzzle } from 'lucide-react';

interface HeaderProps {
  currentMode: AppMode;
  onSetMode: (mode: AppMode) => void;
  activeTeacher: Teacher;
  onSelectTeacher: (teacher: Teacher) => void;
  teachers: Teacher[];
}

export const Header: React.FC<HeaderProps> = ({
  currentMode,
  onSetMode,
  activeTeacher,
  onSelectTeacher,
  teachers,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-white/5 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* App Title & Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold shadow-lg">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-semibold text-white text-lg tracking-tight">School Kids AI Teacher Squad</h1>
              <span className="bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Zap className="w-3 h-3 text-purple-400" /> OpenRouter Free / Cached
              </span>
            </div>
            <p className="text-xs text-white/50">Safe, friendly AI homework help for kids age 8–14</p>
          </div>
        </div>

        {/* Teacher Quick Switcher (when in kids mode) */}
        {currentMode === 'kids' && (
          <div className="flex items-center gap-1.5 bg-white/5 p-1.5 rounded-full border border-white/15">
            {teachers.map((t) => (
              <button
                key={t.id}
                onClick={() => onSelectTeacher(t)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all ${
                  activeTeacher.id === t.id
                    ? 'bg-white/15 text-white shadow-md border border-white/20'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className={`w-2 h-2 rounded-full ${t.id === 'nova' ? 'bg-pink-400' : t.id === 'treebo' ? 'bg-green-400' : 'bg-orange-400'}`}></div>
                <span>{t.name.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        )}

        {/* Mode Navigation Tabs */}
        <div className="flex items-center gap-2 flex-wrap justify-center">
          <button
            onClick={() => onSetMode('kids')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              currentMode === 'kids'
                ? 'bg-purple-600/80 text-white shadow-lg border border-purple-400/30'
                : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/10'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Kids Chat</span>
          </button>

          <button
            onClick={() => onSetMode('parents')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              currentMode === 'parents'
                ? 'bg-purple-600/80 text-white shadow-lg border border-purple-400/30'
                : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/10'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Profit & Caching</span>
          </button>

          <button
            onClick={() => onSetMode('community')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              currentMode === 'community'
                ? 'bg-purple-600/80 text-white shadow-lg border border-purple-400/30'
                : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/10'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Parent Community</span>
          </button>

          <button
            onClick={() => onSetMode('puzzle')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              currentMode === 'puzzle'
                ? 'bg-purple-600/80 text-white shadow-lg border border-purple-400/30'
                : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/10'
            }`}
          >
            <Puzzle className="w-4 h-4 text-emerald-400" />
            <span>Kids Puzzle Pack 🧩</span>
          </button>
        </div>

      </div>
    </header>
  );
};
