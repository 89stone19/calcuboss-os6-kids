import React, { useState, useEffect } from 'react';
import { Puzzle, Sparkles, RefreshCw, Trophy, CheckCircle2, Star, Volume2, ArrowRight, XCircle, Music } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import confetti from 'canvas-confetti';
import { MusicalToggleKeyboard } from './MusicalToggleKeyboard';

interface TeacherAssignment {
  id: string;
  name: string;
  avatar: string;
  title: string;
  quote: string;
  badgeColor: string;
  borderColor: string;
}

interface PuzzleItem {
  id: string;
  name: string;
  category: string;
  imageUrl: string;
  description: string;
  bgColor: string;
  teacher: TeacherAssignment;
}

const defaultPuzzles: PuzzleItem[] = [
  {
    id: 'taxi',
    name: 'Mamelodi Minibus Taxi 🚕',
    category: 'Transport & SA',
    imageUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&auto=format&fit=crop&q=80',
    description: 'The iconic yellow taxi with SA flag and GP 123 plate!',
    bgColor: 'from-amber-500/20 to-yellow-500/10',
    teacher: {
      id: 'calcuboss',
      name: 'Calcuboss',
      avatar: '🤖',
      title: 'Math & Business CEO',
      quote: "Calculated by Calcuboss! Taxis manage distance, fares & speed — true practical math in action!",
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      borderColor: 'border-amber-500/40'
    }
  },
  {
    id: 'tree',
    name: 'Friendly Science Tree 🌳',
    category: 'Botany & Nature',
    imageUrl: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=600&auto=format&fit=crop&q=80',
    description: 'A cheerful leafy tree teaching photosynthesis and growth.',
    bgColor: 'from-emerald-500/20 to-teal-500/10',
    teacher: {
      id: 'treebo',
      name: 'Treebo',
      avatar: '🌱',
      title: 'Science & Nature Guide',
      quote: "Treebo's Science Zone! Trees absorb sunlight & carbon dioxide to make fresh oxygen for all of us!",
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      borderColor: 'border-emerald-500/40'
    }
  },
  {
    id: 'bag',
    name: 'Super Star School Bag 🎒',
    category: 'School & Supplies',
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80',
    description: 'Red and blue backpack ready for daily academy lessons!',
    bgColor: 'from-blue-500/20 to-indigo-500/10',
    teacher: {
      id: 'msnova',
      name: 'Ms Nova',
      avatar: '✨',
      title: 'Reading & Grammar Guide',
      quote: "Ms Nova's Storytime! Pack your books, notebooks, and imagination for today's English adventure!",
      badgeColor: 'bg-pink-500/20 text-pink-300 border-pink-500/40',
      borderColor: 'border-pink-500/40'
    }
  },
  {
    id: 'ball',
    name: 'Happy Soccer Ball ⚽',
    category: 'Sports & Play',
    imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&auto=format&fit=crop&q=80',
    description: 'A smiling soccer ball with big cartoon eyes for playtime.',
    bgColor: 'from-purple-500/20 to-pink-500/10',
    teacher: {
      id: 'squad',
      name: 'Teacher Squad',
      avatar: '🏆',
      title: 'Physical Education & Teamplay',
      quote: "Academy Sports Club! Teamwork, geometric angles, and physical exercise keep your brain sharp!",
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
      borderColor: 'border-purple-500/40'
    }
  }
];

// Web Audio API Synthesizer for Touch, Correct Chime, and Wrong Cross Buzzer
let audioCtx: AudioContext | null = null;

const getAudioContext = () => {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
};

const playTouchSound = () => {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.05);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  } catch (e) {}
};

const playCorrectSound = () => {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5 major chord
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.06);
      gain.gain.setValueAtTime(0.2, ctx.currentTime + idx * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.06 + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + idx * 0.06);
      osc.stop(ctx.currentTime + idx * 0.06 + 0.25);
    });
  } catch (e) {}
};

const playWrongSound = () => {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(110, ctx.currentTime + 0.2);
    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.2);
  } catch (e) {}
};

const playWinSound = () => {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);
      gain.gain.setValueAtTime(0.3, ctx.currentTime + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + idx * 0.08);
      osc.stop(ctx.currentTime + idx * 0.08 + 0.4);
    });
  } catch (e) {}
};

export const PuzzleGame: React.FC = () => {
  const [selectedPuzzle, setSelectedPuzzle] = useState<PuzzleItem>(defaultPuzzles[0]);
  const [gridSize] = useState<number>(3); // 3x3 grid = 9 pieces
  const totalPieces = gridSize * gridSize;

  // Board state: array of piece indices (0 to 8) currently placed in board slots (-1 if empty)
  const [boardSlots, setBoardSlots] = useState<number[]>(Array(totalPieces).fill(-1));
  
  // Tray state: array of piece indices available to be placed
  const [trayPieces, setTrayPieces] = useState<number[]>([]);
  
  // Selected piece from tray for tap-to-place
  const [activeTrayPiece, setActiveTrayPiece] = useState<number | null>(null);

  // Hovered piece (from tray or board) to reveal designated pattern area
  const [hoveredPiece, setHoveredPiece] = useState<number | null>(null);

  // Transient slot feedback: 'right' | 'wrong' | null for each slot index
  const [slotStatus, setSlotStatus] = useState<('right' | 'wrong' | null)[]>(Array(totalPieces).fill(null));

  const [moves, setMoves] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [xpEarned, setXpEarned] = useState<number>(0);

  // Initialize or reset puzzle
  const startNewGame = (puzzle: PuzzleItem = selectedPuzzle) => {
    setSelectedPuzzle(puzzle);
    setBoardSlots(Array(totalPieces).fill(-1));
    setSlotStatus(Array(totalPieces).fill(null));
    const indices = Array.from({ length: totalPieces }, (_, i) => i);
    const shuffled = [...indices].sort(() => Math.random() - 0.5);
    setTrayPieces(shuffled);
    setActiveTrayPiece(null);
    setHoveredPiece(null);
    setMoves(0);
    setIsCompleted(false);
    setTimer(0);
    setIsActive(true);
    setXpEarned(0);
  };

  useEffect(() => {
    startNewGame(selectedPuzzle);
  }, [selectedPuzzle]);

  // Timer effect
  useEffect(() => {
    let interval: any = null;
    if (isActive && !isCompleted) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, isCompleted]);

  // Check completion
  useEffect(() => {
    if (boardSlots.every((val, idx) => val === idx)) {
      if (isActive && !isCompleted) {
        setIsCompleted(true);
        setIsActive(false);
        const earned = 150 + Math.max(0, 300 - timer * 2);
        setXpEarned(earned);
        
        playWinSound();
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });

        // Save to leaderboard storage
        try {
          const stored = localStorage.getItem('calcuboss_student_leaderboard');
          if (stored) {
            const list = JSON.parse(stored);
            if (list.length > 0) {
              list[0].xp += earned;
              localStorage.setItem('calcuboss_student_leaderboard', JSON.stringify(list));
            }
          }
        } catch (e) {
          console.warn("Leaderboard update note:", e);
        }
      }
    }
  }, [boardSlots]);

  // Handle clicking a tray piece
  const handleSelectTrayPiece = (pieceIndex: number) => {
    playTouchSound();
    setActiveTrayPiece(pieceIndex);
  };

  // Trigger brief visual feedback for slot placement
  const triggerSlotFeedback = (slotIndex: number, type: 'right' | 'wrong') => {
    setSlotStatus(prev => {
      const updated = [...prev];
      updated[slotIndex] = type;
      return updated;
    });
    setTimeout(() => {
      setSlotStatus(prev => {
        const updated = [...prev];
        updated[slotIndex] = null;
        return updated;
      });
    }, 1200);
  };

  // Handle clicking a board slot
  const handleSlotClick = (slotIndex: number) => {
    if (isCompleted) return;
    playTouchSound();

    const currentPieceInSlot = boardSlots[slotIndex];

    if (activeTrayPiece !== null) {
      const isRightSlot = activeTrayPiece === slotIndex;
      
      if (isRightSlot) {
        playCorrectSound();
        triggerSlotFeedback(slotIndex, 'right');
      } else {
        playWrongSound();
        triggerSlotFeedback(slotIndex, 'wrong');
      }

      const newBoard = [...boardSlots];
      const newTray = trayPieces.filter(p => p !== activeTrayPiece);
      
      if (currentPieceInSlot !== -1) {
        newTray.push(currentPieceInSlot);
      }

      newBoard[slotIndex] = activeTrayPiece;
      setBoardSlots(newBoard);
      setTrayPieces(newTray);
      setActiveTrayPiece(null);
      setMoves(m => m + 1);
    } else if (currentPieceInSlot !== -1) {
      // Return piece from board back to tray
      const newBoard = [...boardSlots];
      newBoard[slotIndex] = -1;
      setBoardSlots(newBoard);
      setTrayPieces([...trayPieces, currentPieceInSlot]);
      setMoves(m => m + 1);
    }
  };

  const speakTeacherQuote = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(selectedPuzzle.teacher.quote);
      utterance.pitch = 1.2;
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const activeOrHoveredPiece = hoveredPiece !== null ? hoveredPiece : activeTrayPiece;

  return (
    <div className="max-w-6xl mx-auto px-4 py-4 space-y-6">
      {/* Header Banner */}
      <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-r ${selectedPuzzle.bgColor} border border-white/15 p-5 md:p-6 backdrop-blur-xl shadow-2xl`}>
        <div className="absolute right-4 top-4 opacity-10 pointer-events-none">
          <Puzzle className="w-48 h-48 text-white" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Kids 3x3 Slicer & Sound Puzzle Pack 🧩
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center justify-center md:justify-start gap-2">
              <span>{selectedPuzzle.name}</span>
            </h2>
            <p className="text-xs text-white/70 max-w-xl leading-relaxed">
              {selectedPuzzle.description} Touch pattern pieces to align them! Right placements chime with joy, while wrong spots show a red cross ❌.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-black/40 border border-white/10 rounded-2xl p-3">
            <div className="text-center px-3 border-r border-white/10">
              <div className="text-[10px] text-white/50 font-medium">Time</div>
              <div className="text-base font-mono font-bold text-emerald-400">{formatTime(timer)}</div>
            </div>
            <div className="text-center px-3 border-r border-white/10">
              <div className="text-[10px] text-white/50 font-medium">Moves</div>
              <div className="text-base font-mono font-bold text-purple-400">{moves}</div>
            </div>
            <button
              onClick={() => startNewGame(selectedPuzzle)}
              className="bg-white/10 hover:bg-white/20 text-white p-2.5 rounded-xl transition flex items-center justify-center active:scale-95"
              title="Restart Puzzle"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Puzzle Selector Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {defaultPuzzles.map((p) => (
          <button
            key={p.id}
            onClick={() => startNewGame(p)}
            className={`flex items-center gap-2.5 p-2.5 rounded-2xl border text-left transition active:scale-98 ${
              selectedPuzzle.id === p.id
                ? 'bg-purple-600/30 border-purple-400 shadow-lg text-white ring-2 ring-purple-400/40'
                : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
            }`}
          >
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-black/30 flex-shrink-0 border border-white/20">
              <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
            </div>
            <div className="overflow-hidden">
              <div className="text-xs font-bold truncate">{p.name}</div>
              <div className="text-[10px] text-white/50 truncate flex items-center gap-1">
                <span>{p.teacher.avatar}</span>
                <span>{p.teacher.name}</span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Main Game Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left/Top: 3x3 Puzzle Board */}
        <div className="lg:col-span-7 bg-white/5 border border-white/10 rounded-3xl p-5 backdrop-blur-xl flex flex-col items-center space-y-4">
          <div className="flex items-center justify-between w-full">
            <span className="text-xs font-bold text-white/60 tracking-wider uppercase flex items-center gap-1.5">
              <span>🧩 Puzzle Board (3 x 3)</span>
            </span>
            <span className="text-xs bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full border border-emerald-500/30 font-bold">
              {boardSlots.filter(s => s !== -1).length} / 9 placed
            </span>
          </div>

          {/* 3x3 Grid */}
          {activeOrHoveredPiece !== null && (
            <div className="w-full max-w-md bg-amber-500/20 border border-amber-500/40 rounded-xl px-3 py-2 text-xs text-amber-200 flex items-center justify-between font-bold animate-in fade-in">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
                <span>Designated Target Area: Slot #{activeOrHoveredPiece + 1} is glowing for Piece #{activeOrHoveredPiece + 1}!</span>
              </span>
            </div>
          )}

          <div className="grid grid-cols-3 gap-2 w-full max-w-md aspect-square bg-black/40 p-3 rounded-2xl border border-white/10 relative">
            {boardSlots.map((pieceIndex, slotIndex) => {
              const isPlaced = pieceIndex !== -1;
              const isCorrectSlot = pieceIndex === slotIndex;
              const feedback = slotStatus[slotIndex];
              const isTargetDesignatedSlot = activeOrHoveredPiece === slotIndex;

              return (
                <div
                  key={slotIndex}
                  onClick={() => handleSlotClick(slotIndex)}
                  onMouseEnter={() => {
                    if (pieceIndex !== -1) setHoveredPiece(pieceIndex);
                  }}
                  onMouseLeave={() => setHoveredPiece(null)}
                  className={`aspect-square rounded-xl overflow-hidden border-2 transition cursor-pointer relative flex items-center justify-center bg-slate-900/80 active:scale-98 ${
                    isTargetDesignatedSlot
                      ? 'border-amber-400 ring-4 ring-amber-400/80 shadow-[0_0_25px_rgba(245,158,11,0.8)] z-10 scale-[1.03] animate-pulse bg-amber-950/30'
                      : !isPlaced
                      ? 'border-dashed border-white/20 hover:border-purple-400 hover:bg-white/5'
                      : feedback === 'wrong'
                      ? 'border-rose-500 ring-4 ring-rose-500/40 bg-rose-950/40 animate-pulse'
                      : feedback === 'right'
                      ? 'border-emerald-400 ring-4 ring-emerald-400/40 shadow-[0_0_15px_rgba(16,185,129,0.5)]'
                      : isCorrectSlot
                      ? 'border-emerald-500/80'
                      : 'border-purple-500/60'
                  }`}
                >
                  {!isPlaced ? (
                    isTargetDesignatedSlot ? (
                      <div 
                        className="w-full h-full relative opacity-60 transition-opacity"
                        style={{
                          backgroundImage: `url(${selectedPuzzle.imageUrl})`,
                          backgroundSize: '300% 300%',
                          backgroundPosition: `${(slotIndex % 3) * 50}% ${Math.floor(slotIndex / 3) * 50}%`
                        }}
                      >
                        <div className="absolute inset-0 bg-amber-950/40 backdrop-blur-[1px] flex flex-col items-center justify-center p-1 text-center">
                          <Sparkles className="w-5 h-5 text-amber-300 animate-bounce" />
                          <span className="text-[9px] font-black uppercase text-amber-100 bg-black/85 px-1.5 py-0.5 rounded border border-amber-400/60 shadow mt-0.5">
                            Designated Spot 🎯
                          </span>
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs font-mono text-white/20">{slotIndex + 1}</span>
                    )
                  ) : (
                    <div 
                      className="w-full h-full relative"
                      style={{
                        backgroundImage: `url(${selectedPuzzle.imageUrl})`,
                        backgroundSize: '300% 300%',
                        backgroundPosition: `${(pieceIndex % 3) * 50}% ${Math.floor(pieceIndex / 3) * 50}%`
                      }}
                    >
                      <div className="absolute top-1 left-1 bg-black/70 text-white text-[9px] font-mono px-1.5 py-0.5 rounded backdrop-blur-sm">
                        {pieceIndex + 1}
                      </div>

                      {/* DESIGNATED SPOT REVELATION OVERLAY */}
                      {isTargetDesignatedSlot && feedback === null && (
                        <div className="absolute inset-0 bg-amber-950/60 border-2 border-amber-400/80 rounded-xl flex flex-col items-center justify-center pointer-events-none p-1 text-center animate-in fade-in">
                          <Sparkles className="w-5 h-5 text-amber-300 animate-bounce" />
                          <span className="text-[9px] font-black uppercase text-amber-200 bg-black/90 px-1.5 py-0.5 rounded border border-amber-400/60 shadow">
                            Designated Spot 🎯
                          </span>
                        </div>
                      )}

                      {/* WRONG SPOT RED CROSS OVERLAY */}
                      {feedback === 'wrong' && (
                        <div className="absolute inset-0 bg-rose-950/80 backdrop-blur-xs flex flex-col items-center justify-center text-rose-300 animate-in fade-in duration-100">
                          <XCircle className="w-8 h-8 text-rose-500 animate-bounce" />
                          <span className="text-[10px] font-black uppercase tracking-wider mt-1 text-rose-200">Wrong Spot!</span>
                        </div>
                      )}

                      {/* RIGHT SPOT GREEN CHECK OVERLAY */}
                      {feedback === 'right' && (
                        <div className="absolute inset-0 bg-emerald-950/80 backdrop-blur-xs flex flex-col items-center justify-center text-emerald-300 animate-in fade-in duration-100">
                          <CheckCircle2 className="w-8 h-8 text-emerald-400 animate-bounce" />
                          <span className="text-[10px] font-black uppercase tracking-wider mt-1 text-emerald-200">Perfect!</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Reference Preview Toggle */}
          <div className="flex items-center gap-4 pt-1">
            <div className="text-xs text-white/60">Target Preview:</div>
            <div className="w-14 h-14 rounded-xl overflow-hidden border border-white/20 shadow-lg">
              <img src={selectedPuzzle.imageUrl} alt="Reference" className="w-full h-full object-cover" />
            </div>
          </div>

          {/* AUTO-SHOW TEACHER PERSONA ASSIGNED UNDER PUZZLE */}
          <div className={`w-full bg-slate-900/90 border ${selectedPuzzle.teacher.borderColor} rounded-2xl p-3.5 space-y-2 text-left`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-slate-950 flex items-center justify-center text-lg border border-white/10">
                  {selectedPuzzle.teacher.avatar}
                </div>
                <div>
                  <div className="text-xs font-extrabold text-white flex items-center gap-1.5">
                    <span>{selectedPuzzle.teacher.name}</span>
                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold border ${selectedPuzzle.teacher.badgeColor}`}>
                      Puzzle Sponsor
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400">{selectedPuzzle.teacher.title}</div>
                </div>
              </div>
              <button 
                onClick={speakTeacherQuote} 
                className="px-2.5 py-1 rounded-xl bg-slate-800 text-sky-300 text-[10px] font-bold border border-slate-700 hover:bg-slate-700 flex items-center gap-1 active:scale-95"
                title="Speak Teacher Tip"
              >
                <span>🔊 Hear Tip</span>
              </button>
            </div>
            <p className="text-xs text-slate-300 italic bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80 leading-relaxed">
              "{selectedPuzzle.teacher.quote}"
            </p>
          </div>
        </div>

        {/* Right/Bottom: Piece Tray & Completed Celebration */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-5 backdrop-blur-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white/60 tracking-wider uppercase">📦 Piece Tray</span>
              <span className="text-xs text-purple-300 font-medium">Tap piece to select</span>
            </div>

            {/* Tray Pieces */}
            <div className="grid grid-cols-3 gap-2.5 min-h-[200px] bg-black/40 p-3.5 rounded-2xl border border-white/10 items-center justify-center">
              {trayPieces.length === 0 ? (
                <div className="col-span-3 text-center py-8 text-white/40 text-xs font-bold">
                  🎉 All pieces placed on board! Check your slots.
                </div>
              ) : (
                trayPieces.map((pieceIndex) => {
                  const isSelected = activeTrayPiece === pieceIndex;
                  const isHovered = hoveredPiece === pieceIndex;
                  return (
                    <div
                      key={pieceIndex}
                      onClick={() => handleSelectTrayPiece(pieceIndex)}
                      onMouseEnter={() => setHoveredPiece(pieceIndex)}
                      onMouseLeave={() => setHoveredPiece(null)}
                      onTouchStart={() => setHoveredPiece(pieceIndex)}
                      className={`aspect-square rounded-xl overflow-hidden border-2 cursor-pointer transition transform hover:scale-105 shadow-md relative active:scale-95 ${
                        isSelected 
                          ? 'border-yellow-400 ring-4 ring-yellow-400/60 scale-105 z-10' 
                          : isHovered
                          ? 'border-amber-400 ring-4 ring-amber-400/40 scale-105'
                          : 'border-white/20 hover:border-purple-400'
                      }`}
                      style={{
                        backgroundImage: `url(${selectedPuzzle.imageUrl})`,
                        backgroundSize: '300% 300%',
                        backgroundPosition: `${(pieceIndex % 3) * 50}% ${Math.floor(pieceIndex / 3) * 50}%`
                      }}
                    >
                      <div className="absolute top-1 left-1 bg-black/70 text-white text-[9px] font-mono px-1 py-0.5 rounded">
                        #{pieceIndex + 1}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {activeTrayPiece !== null && (
              <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-xl text-xs text-yellow-300 flex items-center justify-between">
                <span>Selected Piece #{activeTrayPiece + 1}. Tap any board slot to test pattern!</span>
                <button 
                  onClick={() => setActiveTrayPiece(null)} 
                  className="text-white/60 hover:text-white font-bold ml-2 text-xs"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* Success Card (Shown when completed) */}
          {isCompleted && (
            <div className="bg-gradient-to-r from-emerald-600/30 to-teal-600/30 border border-emerald-500/50 rounded-3xl p-6 backdrop-blur-xl text-center space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="w-14 h-14 bg-emerald-500 text-slate-950 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                <Trophy className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-black text-white">Puzzle Solved! 🎉</h3>
                <p className="text-xs text-emerald-200">
                  Fantastic job! You solved <span className="font-bold text-white">{selectedPuzzle.name}</span> in {formatTime(timer)} with {moves} moves!
                </p>
              </div>
              <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 px-4 py-2 rounded-xl text-xs font-bold border border-emerald-500/30">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" /> +{xpEarned} XP Added to Leaderboard!
              </div>

              {/* Unlocked Musical Keyboard Reward Banner */}
              <div className="p-3 bg-slate-950/80 border border-amber-500/40 rounded-2xl text-amber-300 text-xs font-bold flex items-center justify-center gap-2">
                <Music className="w-4 h-4 text-amber-400 animate-bounce" />
                <span>Unlocked Reward: 7-Note Musical & Animal Keyboard below!</span>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => startNewGame(selectedPuzzle)}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-black py-3 rounded-xl text-xs hover:from-emerald-400 hover:to-teal-500 transition shadow-lg active:scale-95"
                >
                  Play Another Puzzle 🚀
                </button>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Musical & Animal Toggle Keyboard Playground */}
      <div className="pt-4 border-t border-slate-800/80">
        <MusicalToggleKeyboard 
          title="Ms Nova's Academy Music & Sound Zone 🎹🦁" 
          subtitle="Tap C D E F G A B to play piano notes or quack, meow, bark & roar!"
        />
      </div>
    </div>
  );
};

