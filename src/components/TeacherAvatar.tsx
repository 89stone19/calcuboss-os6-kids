import React, { useEffect, useState } from 'react';
import { Teacher } from '../types';
import { Sparkles, Volume2, VolumeX, Smile, Zap } from 'lucide-react';

interface TeacherAvatarProps {
  teacher: Teacher;
  isSpeaking: boolean;
  isThinking: boolean;
  onToggleSpeech?: () => void;
  speechEnabled?: boolean;
}

export const TeacherAvatar: React.FC<TeacherAvatarProps> = ({
  teacher,
  isSpeaking,
  isThinking,
  onToggleSpeech,
  speechEnabled = true,
}) => {
  const [blink, setBlink] = useState(false);

  // Random blinking effect
  useEffect(() => {
    const interval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 200);
    }, 4000 + Math.random() * 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative flex flex-col items-center select-none">
      {/* Floating Status Badge */}
      <div className="absolute -top-3 z-20 flex items-center gap-1 bg-white/10 backdrop-blur-xl px-3 py-1 rounded-full shadow-lg border border-white/20 text-xs font-semibold text-purple-200">
        <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-spin" />
        <span>{teacher.specialty}</span>
      </div>

      {/* Avatar Container with Glow & Movement */}
      <div className={`relative w-48 h-48 md:w-56 md:h-56 rounded-3xl ${teacher.bgGradient} p-1 shadow-2xl transition-all duration-500 ${isThinking ? 'animate-pulse scale-105 ring-4 ring-purple-400/50' : ''}`}>
        <div className="w-full h-full bg-[#1A1B2E] rounded-[22px] overflow-hidden relative flex flex-col items-center justify-center p-3 border border-white/10">
          
          {/* Background Ambient Floating Elements */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/5 to-purple-900/20 z-0 pointer-events-none" />

          {/* SVG / Illustrated Avatar based on teacher ID */}
          <div className={`relative z-10 w-full h-full flex flex-col items-center justify-center transition-transform duration-300 ${isSpeaking ? 'scale-105' : ''}`}>
            
            {teacher.avatarType === 'nova' && (
              /* Ms. Nova Illustration */
              <div className="relative w-36 h-36 flex flex-col items-center">
                {/* Hair & Head */}
                <div className="w-28 h-28 bg-amber-800 rounded-full relative shadow-inner overflow-hidden flex flex-col items-center pt-2">
                  <div className="absolute top-0 w-24 h-12 bg-amber-900 rounded-b-full"></div>
                  {/* Glasses */}
                  <div className="absolute top-10 flex gap-2 z-10">
                    <div className={`w-8 h-8 rounded-full border-2 border-amber-600 bg-white/20 flex items-center justify-center ${blink ? 'scale-y-10 bg-amber-600' : ''}`}>
                      <div className="w-2 h-2 text-slate-900 rounded-full"></div>
                    </div>
                    <div className={`w-8 h-8 rounded-full border-2 border-amber-600 bg-white/20 flex items-center justify-center ${blink ? 'scale-y-10 bg-amber-600' : ''}`}>
                      <div className="w-2 h-2 text-slate-900 rounded-full"></div>
                    </div>
                  </div>
                  {/* Face */}
                  <div className="w-20 h-20 bg-amber-100 rounded-full relative mt-4 flex flex-col items-center justify-end pb-3 shadow-sm">
                    {/* Cheeks */}
                    <div className="absolute top-11 w-full flex justify-between px-2">
                      <div className="w-3 h-1.5 bg-rose-300 rounded-full opacity-60"></div>
                      <div className="w-3 h-1.5 bg-rose-300 rounded-full opacity-60"></div>
                    </div>
                    {/* Talking/Smiling Mouth */}
                    <div className={`transition-all duration-150 bg-rose-600 rounded-full ${isSpeaking ? 'w-6 h-4 animate-bounce' : 'w-5 h-2 rounded-b-full'}`}></div>
                  </div>
                </div>
                {/* Lanyard & Collar */}
                <div className="absolute bottom-0 w-24 h-10 bg-sky-500 rounded-t-xl flex items-center justify-center shadow-md">
                  <div className="w-8 h-5 bg-amber-300 rounded-sm text-[8px] font-bold text-slate-800 flex items-center justify-center shadow">
                    TEACH
                  </div>
                </div>
              </div>
            )}

            {teacher.avatarType === 'treebo' && (
              /* Treebo the Science Tree */
              <div className="relative w-36 h-36 flex flex-col items-center">
                {/* Leafy Crown */}
                <div className="absolute -top-3 w-32 h-14 bg-emerald-500 rounded-full shadow-md flex justify-around pt-1">
                  <div className="w-6 h-6 bg-emerald-400 rounded-full"></div>
                  <div className="w-8 h-8 bg-emerald-600 rounded-full -mt-2"></div>
                  <div className="w-6 h-6 bg-emerald-400 rounded-full"></div>
                </div>
                {/* Wooden Head with Glasses */}
                <div className="w-26 h-26 bg-amber-900 rounded-2xl relative mt-5 flex flex-col items-center justify-center shadow-inner border-4 border-amber-950">
                  {/* Glasses */}
                  <div className="absolute top-6 flex gap-1 z-10">
                    <div className={`w-7 h-7 rounded-full border-2 border-amber-400 bg-amber-950/40 flex items-center justify-center ${blink ? 'scale-y-10' : ''}`}>
                      <div className="w-2 h-2 bg-emerald-300 rounded-full"></div>
                    </div>
                    <div className={`w-7 h-7 rounded-full border-2 border-amber-400 bg-amber-950/40 flex items-center justify-center ${blink ? 'scale-y-10' : ''}`}>
                      <div className="w-2 h-2 bg-emerald-300 rounded-full"></div>
                    </div>
                  </div>
                  {/* Friendly Smile */}
                  <div className="absolute bottom-5">
                    <div className={`transition-all duration-150 bg-emerald-300 rounded-b-full ${isSpeaking ? 'w-6 h-4 animate-bounce' : 'w-6 h-2'}`}></div>
                  </div>
                </div>
              </div>
            )}

            {teacher.avatarType === 'calcuboss' && (
              /* Calcuboss Calculator */
              <div className="relative w-36 h-36 flex flex-col items-center">
                {/* Calculator Body */}
                <div className="w-28 h-32 bg-blue-600 rounded-2xl shadow-xl border-2 border-blue-400 relative flex flex-col items-center pt-2">
                  {/* Screen */}
                  <div className="w-22 h-7 bg-emerald-200 rounded-md border border-blue-800 flex items-center justify-end px-2 font-mono text-xs font-bold text-emerald-900">
                    12+7=19
                  </div>
                  {/* Eyes on top of screen / face */}
                  <div className="absolute top-9 flex gap-4 z-10">
                    <div className={`w-5 h-5 rounded-full bg-slate-900 flex items-center justify-center ${blink ? 'scale-y-10' : ''}`}>
                      <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                    </div>
                    <div className={`w-5 h-5 rounded-full bg-slate-900 flex items-center justify-center ${blink ? 'scale-y-10' : ''}`}>
                      <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                    </div>
                  </div>
                  {/* Buttons Grid */}
                  <div className="grid grid-cols-3 gap-1 mt-4 px-2">
                    <div className="w-5 h-3 bg-slate-300 rounded-[2px]"></div>
                    <div className="w-5 h-3 bg-slate-300 rounded-[2px]"></div>
                    <div className="w-5 h-3 bg-blue-400 rounded-[2px]"></div>
                    <div className="w-5 h-3 bg-slate-300 rounded-[2px]"></div>
                    <div className="w-5 h-3 bg-slate-300 rounded-[2px]"></div>
                    <div className="w-5 h-3 bg-blue-400 rounded-[2px]"></div>
                  </div>
                  {/* Talking mouth */}
                  <div className={`absolute bottom-2 transition-all duration-150 bg-amber-200 rounded-full ${isSpeaking ? 'w-5 h-3 animate-bounce' : 'w-4 h-1.5'}`}></div>
                </div>
              </div>
            )}

          </div>

          {/* Thinking / Speaking Indicator Banner */}
          {isThinking && (
            <div className="absolute bottom-2 z-20 bg-purple-600 text-white text-[10px] font-bold px-3 py-0.5 rounded-full shadow animate-pulse flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Thinking...
            </div>
          )}
          {isSpeaking && (
            <div className="absolute bottom-2 z-20 bg-emerald-600 text-white text-[10px] font-bold px-3 py-0.5 rounded-full shadow animate-pulse flex items-center gap-1">
              <Volume2 className="w-3 h-3 animate-ping" /> Speaking...
            </div>
          )}
        </div>
      </div>

      {/* Teacher Name & Subtitle */}
      <div className="mt-4 text-center">
        <h3 className="font-bold text-white text-lg flex items-center justify-center gap-1.5">
          {teacher.name}
        </h3>
        <p className="text-xs text-white/60 font-medium">{teacher.tagline}</p>
      </div>

      {/* Speech Audio Toggle */}
      {onToggleSpeech && (
        <button
          onClick={onToggleSpeech}
          className={`mt-3 flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-full transition-all shadow-sm border ${
            speechEnabled
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/30'
              : 'bg-white/5 text-white/50 border-white/10 hover:bg-white/10'
          }`}
          title={speechEnabled ? 'Voice output enabled' : 'Voice output muted'}
        >
          {speechEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          <span>{speechEnabled ? 'Voice ON' : 'Muted'}</span>
        </button>
      )}
    </div>
  );
};
