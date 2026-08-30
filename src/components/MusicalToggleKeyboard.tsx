import React, { useState, useRef } from 'react';
import { Volume2, VolumeX, Music, Sparkles, Cat, Dog, Bird } from 'lucide-react';

export type KeyboardMode = 'piano' | 'animal';

export interface NoteKeyConfig {
  note: string; // C, D, E, F, G, A, B
  solfege: string; // Do, Re, Mi, Fa, Sol, La, Si
  freq: number;
  pianoEmoji: string;
  animalName: string;
  animalEmoji: string;
  soundName: string;
  color: string;
  activeColor: string;
}

export const SCALE_NOTES: NoteKeyConfig[] = [
  {
    note: 'C',
    solfege: 'Do',
    freq: 261.63,
    pianoEmoji: '🎹',
    animalName: 'Duck',
    animalEmoji: '🦆',
    soundName: 'Quack!',
    color: 'from-red-500/20 to-orange-500/10 border-red-500/40 text-red-300',
    activeColor: 'bg-red-500 border-red-300 shadow-[0_0_20px_rgba(239,68,68,0.8)] text-white scale-105'
  },
  {
    note: 'D',
    solfege: 'Re',
    freq: 293.66,
    pianoEmoji: '🎼',
    animalName: 'Horse',
    animalEmoji: '🐴',
    soundName: 'Neigh!',
    color: 'from-amber-500/20 to-yellow-500/10 border-amber-500/40 text-amber-300',
    activeColor: 'bg-amber-500 border-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.8)] text-white scale-105'
  },
  {
    note: 'E',
    solfege: 'Mi',
    freq: 329.63,
    pianoEmoji: '🎵',
    animalName: 'Cat',
    animalEmoji: '🐱',
    soundName: 'Meow!',
    color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/40 text-emerald-300',
    activeColor: 'bg-emerald-500 border-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.8)] text-white scale-105'
  },
  {
    note: 'F',
    solfege: 'Fa',
    freq: 349.23,
    pianoEmoji: '🎶',
    animalName: 'Dog',
    animalEmoji: '🐶',
    soundName: 'Woof!',
    color: 'from-cyan-500/20 to-blue-500/10 border-cyan-500/40 text-cyan-300',
    activeColor: 'bg-cyan-500 border-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.8)] text-white scale-105'
  },
  {
    note: 'G',
    solfege: 'Sol',
    freq: 392.00,
    pianoEmoji: '🎺',
    animalName: 'Cow',
    animalEmoji: '🐄',
    soundName: 'Moo!',
    color: 'from-blue-500/20 to-indigo-500/10 border-blue-500/40 text-blue-300',
    activeColor: 'bg-blue-500 border-blue-300 shadow-[0_0_20px_rgba(59,130,246,0.8)] text-white scale-105'
  },
  {
    note: 'A',
    solfege: 'La',
    freq: 440.00,
    pianoEmoji: '🎸',
    animalName: 'Bird',
    animalEmoji: '🐦',
    soundName: 'Chirp!',
    color: 'from-purple-500/20 to-pink-500/10 border-purple-500/40 text-purple-300',
    activeColor: 'bg-purple-500 border-purple-300 shadow-[0_0_20px_rgba(168,85,247,0.8)] text-white scale-105'
  },
  {
    note: 'B',
    solfege: 'Si',
    freq: 493.88,
    pianoEmoji: '🎷',
    animalName: 'Lion',
    animalEmoji: '🦁',
    soundName: 'Roar!',
    color: 'from-pink-500/20 to-rose-500/10 border-pink-500/40 text-pink-300',
    activeColor: 'bg-pink-500 border-pink-300 shadow-[0_0_20px_rgba(236,72,153,0.8)] text-white scale-105'
  }
];

export const MusicalToggleKeyboard: React.FC<{
  title?: string;
  subtitle?: string;
  isVoiceEnabled?: boolean;
}> = ({
  title = "Ms Nova's Musical & Animal Keyboard 🎹🦁",
  subtitle = "Switch between classical piano tones and cheerful animal sounds!",
  isVoiceEnabled = true
}) => {
  const [mode, setMode] = useState<KeyboardMode>('piano');
  const [activeNote, setActiveNote] = useState<string | null>(null);
  const [voiceAnnounce, setVoiceAnnounce] = useState<boolean>(true);

  const audioCtxRef = useRef<AudioContext | null>(null);

  const getAudioContext = (): AudioContext => {
    if (!audioCtxRef.current) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      audioCtxRef.current = new AudioContextClass();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  // Web Audio Synthesizer for Piano and Animal Sounds
  const playPianoTone = (freq: number) => {
    try {
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // Combine fundamental + harmonic for a warm piano/bell sound
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0.35, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.8);
    } catch (e) {
      console.warn('Audio playback error', e);
    }
  };

  const playAnimalSound = (noteKey: NoteKeyConfig) => {
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;

      switch (noteKey.note) {
        case 'C': {
          // 🦆 Duck Quack
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(320, now);
          osc.frequency.exponentialRampToValueAtTime(180, now + 0.18);
          gain.gain.setValueAtTime(0.3, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.2);
          break;
        }
        case 'D': {
          // 🐴 Horse Neigh
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(400, now);
          osc.frequency.linearRampToValueAtTime(800, now + 0.15);
          osc.frequency.linearRampToValueAtTime(500, now + 0.35);
          gain.gain.setValueAtTime(0.25, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.4);
          break;
        }
        case 'E': {
          // 🐱 Cat Meow
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(550, now);
          osc.frequency.exponentialRampToValueAtTime(750, now + 0.15);
          osc.frequency.exponentialRampToValueAtTime(450, now + 0.35);
          gain.gain.setValueAtTime(0.25, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.4);
          break;
        }
        case 'F': {
          // 🐶 Dog Woof
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'square';
          osc.frequency.setValueAtTime(220, now);
          osc.frequency.exponentialRampToValueAtTime(110, now + 0.12);
          gain.gain.setValueAtTime(0.35, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.15);
          break;
        }
        case 'G': {
          // 🐄 Cow Moo
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(140, now);
          osc.frequency.linearRampToValueAtTime(110, now + 0.5);
          gain.gain.setValueAtTime(0.3, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.55);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.55);
          break;
        }
        case 'A': {
          // 🐦 Bird Chirp
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(1600, now);
          osc.frequency.linearRampToValueAtTime(2400, now + 0.08);
          osc.frequency.linearRampToValueAtTime(1800, now + 0.16);
          gain.gain.setValueAtTime(0.2, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.18);
          break;
        }
        case 'B': {
          // 🦁 Lion Roar
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(95, now);
          osc.frequency.linearRampToValueAtTime(150, now + 0.2);
          osc.frequency.exponentialRampToValueAtTime(70, now + 0.5);
          gain.gain.setValueAtTime(0.35, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.55);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.55);
          break;
        }
        default:
          playPianoTone(noteKey.freq);
      }
    } catch (e) {
      console.warn('Animal sound error', e);
    }
  };

  const speakText = (text: string) => {
    if (isVoiceEnabled && voiceAnnounce && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.pitch = 1.3;
      utterance.rate = 1.1;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleKeyPress = (config: NoteKeyConfig) => {
    setActiveNote(config.note);

    if (mode === 'piano') {
      playPianoTone(config.freq);
      speakText(`${config.solfege}! Note ${config.note}`);
    } else {
      playAnimalSound(config);
      speakText(`${config.animalName} says ${config.soundName}`);
    }

    setTimeout(() => {
      setActiveNote(null);
    }, 300);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-4 max-w-2xl mx-auto backdrop-blur-xl">
      {/* Header Bar with Mode Toggle Switch */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
            <span>{title}</span>
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5">{subtitle}</p>
        </div>

        {/* Toggle Switch */}
        <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 shadow-inner">
          <button
            onClick={() => {
              setMode('piano');
              speakText('Piano mode active!');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 active:scale-95 ${
              mode === 'piano'
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-900/50 ring-1 ring-indigo-300/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>🎹 Piano</span>
          </button>

          <button
            onClick={() => {
              setMode('animal');
              speakText('Animal sounds mode active!');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 active:scale-95 ${
              mode === 'animal'
                ? 'bg-gradient-to-r from-amber-500 to-emerald-600 text-white shadow-md shadow-amber-900/50 ring-1 ring-amber-300/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>🦁 Animals</span>
          </button>

          <button
            onClick={() => setVoiceAnnounce(!voiceAnnounce)}
            className={`p-1.5 rounded-xl text-xs border transition ${
              voiceAnnounce
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700/80'
                : 'bg-slate-800 text-slate-500 border-slate-700'
            }`}
            title="Toggle Voice Announcements"
          >
            {voiceAnnounce ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* 7 Note Major Scale Keyboard Buttons */}
      <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
        {SCALE_NOTES.map((config) => {
          const isActive = activeNote === config.note;
          const emoji = mode === 'piano' ? config.pianoEmoji : config.animalEmoji;

          return (
            <button
              key={config.note}
              onClick={() => handleKeyPress(config)}
              className={`flex flex-col items-center justify-between p-2 sm:p-3 rounded-2xl border transition-all duration-100 cursor-pointer select-none active:scale-95 aspect-[2/3] relative overflow-hidden bg-gradient-to-b ${
                isActive ? config.activeColor : config.color
              } hover:border-white/40 shadow-lg`}
            >
              {/* Top Solfege Name */}
              <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-wider opacity-80">
                {config.solfege}
              </span>

              {/* Main Center Emoji */}
              <span className={`text-2xl sm:text-3xl transition-transform duration-150 my-1 ${
                isActive ? 'scale-125 rotate-6' : 'hover:scale-110'
              }`}>
                {emoji}
              </span>

              {/* Bottom Note & Sound Label */}
              <div className="text-center w-full">
                <span className="block text-[11px] font-black">{config.note}</span>
                <span className="text-[9px] opacity-70 block truncate font-mono">
                  {mode === 'piano' ? `${Math.round(config.freq)}Hz` : config.soundName}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer Instructions / Tip */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
        <span className="flex items-center gap-1.5 text-emerald-300 font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          {mode === 'piano'
            ? 'C Major Scale: Do (261Hz) to Si (493Hz)'
            : 'Animal Sounds: Quack, Neigh, Meow, Woof, Moo, Chirp, Roar!'}
        </span>
        <span className="text-slate-500 hidden sm:inline">Ms Nova Academy • 100% Offline Audio</span>
      </div>
    </div>
  );
};
