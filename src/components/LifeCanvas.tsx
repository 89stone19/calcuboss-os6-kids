import React, { useState, useRef } from 'react';
import { 
  Sparkles, 
  Palette, 
  Car, 
  Volume2, 
  Smile, 
  Scissors, 
  RefreshCw, 
  ShoppingBag,
  Coins,
  Shield,
  Star,
  Zap,
  Flame,
  Award
} from 'lucide-react';

// Custom synthesized audio sounds
type SoundType = 'chime' | 'wrench' | 'laser' | 'coin' | 'levelUp' | 'splat';

export const LifeCanvas: React.FC<{ isVoiceEnabled?: boolean }> = ({ isVoiceEnabled = true }) => {
  const [currentCanvas, setCurrentCanvas] = useState<'avatar' | 'garage' | 'flight' | 'sweet'>('avatar');
  const [coins, setCoins] = useState<number>(180);
  const [level, setLevel] = useState<number>(3);
  const [xp, setXp] = useState<number>(40);
  const [isShopOpen, setIsShopOpen] = useState<boolean>(false);

  // Custom modification states for High-Fidelity Flipbook
  const [princessStyle, setPrincessStyle] = useState<'plain' | 'crown' | 'shorthair'>('plain');
  const [lamboStyle, setLamboStyle] = useState<'clean' | 'stripes'>('clean');
  const [bakeryStyle, setBakeryStyle] = useState<'plain' | 'topped'>('plain');

  // Decorative overlays & lighting accessories
  const [necklaceStyle, setNecklaceStyle] = useState<'none' | 'beads' | 'gold' | 'pearls'>('none');
  const [carColorGlow, setCarColorGlow] = useState<'normal' | 'neon-green' | 'neon-blue' | 'neon-red'>('normal');
  const [engineBoost, setEngineBoost] = useState<'off' | 'plasma' | 'nitro' | 'electric'>('off');
  const [rocketStarTrail, setRocketStarTrail] = useState<'default' | 'rainbow' | 'cyber' | 'cosmic'>('default');
  const [flightCoPilot, setFlightCoPilot] = useState<'none' | 'alien' | 'kitty' | 'robot'>('none');
  const [bakeryCandle, setBakeryCandle] = useState<boolean>(false);

  // Galleries
  const princessGallery = {
    plain: '/src/assets/images/princess_plain_1788121455741.jpg',
    crown: '/src/assets/images/princess_avatar_1788120388641.jpg',
    shorthair: '/src/assets/images/princess_shorthair_1788121470129.jpg'
  };

  const lamboGallery = {
    clean: '/src/assets/images/lambo_supercar_1788120400724.jpg',
    stripes: '/src/assets/images/lambo_stripes_1788121483048.jpg'
  };

  const bakeryGallery = {
    plain: '/src/assets/images/cupcake_bakery_1788121079160.jpg',
    topped: '/src/assets/images/cupcake_topped_1788121496035.jpg'
  };

  // Audio Context Ref
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

  // High Fidelity Web Audio Synthesizer
  const playSoundEffect = (type: SoundType) => {
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;

      switch (type) {
        case 'coin': {
          // Double metallic chime ding!
          const osc1 = ctx.createOscillator();
          const osc2 = ctx.createOscillator();
          const gainNode = ctx.createGain();

          osc1.type = 'sine';
          osc1.frequency.setValueAtTime(987.77, now); // B5
          osc1.frequency.setValueAtTime(1318.51, now + 0.08); // E6

          osc2.type = 'sine';
          osc2.frequency.setValueAtTime(1975.53, now + 0.08); // B6

          gainNode.gain.setValueAtTime(0.15, now);
          gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

          osc1.connect(gainNode);
          osc2.connect(gainNode);
          gainNode.connect(ctx.destination);

          osc1.start(now);
          osc2.start(now + 0.08);
          osc1.stop(now + 0.35);
          osc2.stop(now + 0.35);
          break;
        }
        case 'wrench': {
          // Pneumatic air impact wrench zip-zip sound!
          const duration = 0.05;
          for (let i = 0; i < 3; i++) {
            const start = now + i * 0.06;
            const osc = ctx.createOscillator();
            const gainNode = ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(800 - i * 80, start);
            osc.frequency.exponentialRampToValueAtTime(180, start + duration);

            gainNode.gain.setValueAtTime(0.12, start);
            gainNode.gain.exponentialRampToValueAtTime(0.001, start + duration);

            osc.connect(gainNode);
            gainNode.connect(ctx.destination);
            osc.start(start);
            osc.stop(start + duration);
          }
          break;
        }
        case 'laser': {
          // Sci-fi sweep down laser zap
          const osc = ctx.createOscillator();
          const gainNode = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(1400, now);
          osc.frequency.exponentialRampToValueAtTime(80, now + 0.22);

          gainNode.gain.setValueAtTime(0.18, now);
          gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

          osc.connect(gainNode);
          gainNode.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.22);
          break;
        }
        case 'chime': {
          // Magical sparkling sound
          const freqs = [523.25, 659.25, 783.99, 1046.50]; // C Major chord
          freqs.forEach((f, idx) => {
            const osc = ctx.createOscillator();
            const gainNode = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(f, now + idx * 0.06);

            gainNode.gain.setValueAtTime(0.1, now + idx * 0.06);
            gainNode.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.25);

            osc.connect(gainNode);
            gainNode.connect(ctx.destination);
            osc.start(now + idx * 0.06);
            osc.stop(now + idx * 0.06 + 0.25);
          });
          break;
        }
        case 'levelUp': {
          // Uplifting ascending synth wave
          const baseFreq = 261.63; // C4
          for (let i = 0; i < 6; i++) {
            const start = now + i * 0.07;
            const osc = ctx.createOscillator();
            const gainNode = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(baseFreq * Math.pow(1.122, i * 2), start);

            gainNode.gain.setValueAtTime(0.15, start);
            gainNode.gain.exponentialRampToValueAtTime(0.001, start + 0.3);

            osc.connect(gainNode);
            gainNode.connect(ctx.destination);
            osc.start(start);
            osc.stop(start + 0.3);
          }
          break;
        }
        case 'splat': {
          // A wet, squishy bouncy sound for edible decorations
          const osc = ctx.createOscillator();
          const gainNode = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(150, now);
          osc.frequency.exponentialRampToValueAtTime(320, now + 0.15);

          gainNode.gain.setValueAtTime(0.2, now);
          gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

          osc.connect(gainNode);
          gainNode.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.15);
          break;
        }
      }
    } catch (e) {
      console.warn('Audio synthesis failed:', e);
    }
  };

  // Helper to handle gamification awards when kids modify their canvases
  const handleModifyAction = (soundType: SoundType) => {
    playSoundEffect(soundType);
    
    // Grant coins & XP
    const coinReward = 10;
    const xpReward = 15;
    
    setCoins(prev => prev + coinReward);
    
    // Handle level progression
    setXp(prev => {
      const nextXp = prev + xpReward;
      if (nextXp >= 100) {
        setLevel(lvl => lvl + 1);
        playSoundEffect('levelUp');
        return nextXp - 100;
      }
      return nextXp;
    });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-6 space-y-5 text-white shadow-2xl max-w-4xl mx-auto flex flex-col relative overflow-hidden">
      
      {/* Decorative cybernetic background glows */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* --- PREMIUM GAME UI FRAME --- */}
      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 via-indigo-600 to-amber-400 flex items-center justify-center shadow-lg border border-white/10 animate-pulse">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <span>OS6 Life Canvas™</span>
              <span className="text-[9px] bg-indigo-950 text-indigo-300 border border-indigo-700/60 px-2.5 py-0.5 rounded-full uppercase font-mono font-bold">
                2026 Kids Suite
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Interactive design studio with 3D Pixar-style visuals & synthesizers
            </p>
          </div>
        </div>

        {/* Level and Coins Badges */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          {/* Level System Meter */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-1.5 px-3 flex flex-col justify-center min-w-[110px]">
            <div className="flex justify-between text-[10px] font-black text-slate-300 mb-0.5">
              <span>🏆 LEVEL {level}</span>
              <span className="text-indigo-400">{xp}% XP</span>
            </div>
            {/* Progress Bar */}
            <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-indigo-500 to-pink-500 h-full transition-all duration-500"
                style={{ width: `${xp}%` }}
              ></div>
            </div>
          </div>

          {/* Golden Coins Badge */}
          <div className="bg-slate-900 border border-amber-500/30 text-amber-300 font-extrabold text-sm px-3.5 py-2.5 rounded-xl flex items-center gap-1.5 shadow-md">
            <Coins className="w-4 h-4 text-amber-400 animate-spin" />
            <span>{coins}</span>
            <span className="text-[10px] text-amber-500/70 font-normal">Coins</span>
          </div>

          {/* Interactive Shop Toggle Button */}
          <button
            onClick={() => { setIsShopOpen(true); playSoundEffect('chime'); }}
            className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl transition shadow active:scale-95 flex items-center gap-1.5"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>SHOP</span>
          </button>
        </div>
      </div>

      {/* --- CANVAS SELECTOR TABS --- */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 relative z-10">
        <button
          onClick={() => { setCurrentCanvas('avatar'); playSoundEffect('chime'); }}
          className={`py-3.5 px-2.5 rounded-2xl font-black text-xs sm:text-sm transition flex flex-col sm:flex-row items-center justify-center gap-2 border ${
            currentCanvas === 'avatar'
              ? 'bg-gradient-to-r from-pink-600/80 to-purple-600/80 border-pink-500 text-white shadow-xl'
              : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900/60'
          }`}
        >
          <Smile className="w-4 h-4 text-pink-400" />
          <span>👧 Princess Walk</span>
        </button>

        <button
          onClick={() => { setCurrentCanvas('garage'); playSoundEffect('wrench'); }}
          className={`py-3.5 px-2.5 rounded-2xl font-black text-xs sm:text-sm transition flex flex-col sm:flex-row items-center justify-center gap-2 border ${
            currentCanvas === 'garage'
              ? 'bg-gradient-to-r from-emerald-600/80 to-teal-600/80 border-emerald-500 text-white shadow-xl'
              : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900/60'
          }`}
        >
          <Car className="w-4 h-4 text-emerald-400" />
          <span>🟢 Lambo Garage</span>
        </button>

        <button
          onClick={() => { setCurrentCanvas('flight'); playSoundEffect('laser'); }}
          className={`py-3.5 px-2.5 rounded-2xl font-black text-xs sm:text-sm transition flex flex-col sm:flex-row items-center justify-center gap-2 border ${
            currentCanvas === 'flight'
              ? 'bg-gradient-to-r from-sky-600/80 to-indigo-600/80 border-sky-500 text-white shadow-xl'
              : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900/60'
          }`}
        >
          <Zap className="w-4 h-4 text-sky-400" />
          <span>⚡ Star Flight</span>
        </button>

        <button
          onClick={() => { setCurrentCanvas('sweet'); playSoundEffect('splat'); }}
          className={`py-3.5 px-2.5 rounded-2xl font-black text-xs sm:text-sm transition flex flex-col sm:flex-row items-center justify-center gap-2 border ${
            currentCanvas === 'sweet'
              ? 'bg-gradient-to-r from-amber-600/80 to-pink-600/80 border-amber-500 text-white shadow-xl'
              : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900/60'
          }`}
        >
          <Palette className="w-4 h-4 text-amber-400" />
          <span>🧁 Choc Bakery</span>
        </button>
      </div>

      {/* --- THE MAIN LIFE CANVAS BOARD --- */}
      <div className="bg-slate-950 rounded-3xl overflow-hidden relative border-4 border-slate-800 h-[360px] flex items-center justify-center shadow-inner relative z-10">
        
        {/* Render Page A: Princess Walk */}
        {currentCanvas === 'avatar' && (
          <div className="w-full h-full relative flex items-center justify-center animate-in fade-in duration-300">
            {/* Pixar Princess Pre-rendered Flipbook Render */}
            <img 
              src={princessGallery[princessStyle]} 
              alt="3D Pixar African Princess"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover select-none absolute inset-0 opacity-90 transition-all duration-300"
            />
            {/* Elegant overlay to tint and blend background */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>

            {/* Interactive Necklace Accessories Layer */}
            {necklaceStyle !== 'none' && (
              <div className="absolute bottom-[28%] text-center z-20 animate-pulse">
                {necklaceStyle === 'beads' && (
                  <span className="text-4xl filter drop-shadow-md">📿</span>
                )}
                {necklaceStyle === 'gold' && (
                  <span className="text-4xl filter drop-shadow-md">🪙</span>
                )}
                {necklaceStyle === 'pearls' && (
                  <span className="text-4xl filter drop-shadow-md">💎</span>
                )}
              </div>
            )}

            {/* Canvas Badge */}
            <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-xs font-black text-pink-300">
              💅 Princess Avatar Creator
            </div>
          </div>
        )}

        {/* Render Page B: Lambo Garage */}
        {currentCanvas === 'garage' && (
          <div className="w-full h-full relative flex items-center justify-center animate-in fade-in duration-300">
            {/* Pixar Supercar Pre-rendered Flipbook Render */}
            <img 
              src={lamboGallery[lamboStyle]} 
              alt="3D Pixar Lamborghini Sports Car"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover select-none absolute inset-0 opacity-90 transition-all duration-300"
            />
            {/* Elegant overlay to tint and blend background */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>

            {/* Customizable glowing color tints */}
            {carColorGlow !== 'normal' && (
              <div className="absolute inset-0 pointer-events-none mix-blend-color animate-pulse">
                {carColorGlow === 'neon-green' && <div className="w-full h-full bg-emerald-500/25"></div>}
                {carColorGlow === 'neon-blue' && <div className="w-full h-full bg-blue-500/25"></div>}
                {carColorGlow === 'neon-red' && <div className="w-full h-full bg-red-500/25"></div>}
              </div>
            )}

            {/* Engine fire/boost overlays */}
            {engineBoost !== 'off' && (
              <div className="absolute bottom-[35%] right-[22%] z-20 flex gap-1">
                {engineBoost === 'plasma' && <span className="text-4xl animate-pulse filter drop-shadow-[0_0_15px_#38bdf8]">⚡</span>}
                {engineBoost === 'nitro' && <span className="text-4xl animate-bounce filter drop-shadow-[0_0_15px_#f43f5e]">🔥</span>}
                {engineBoost === 'electric' && <span className="text-4xl animate-ping filter drop-shadow-[0_0_15px_#10b981]">✨</span>}
              </div>
            )}

            {/* Canvas Badge */}
            <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-xs font-black text-emerald-300">
              🟢 Lambo Tuning Bay
            </div>
          </div>
        )}

        {/* Render Page C: Star Flight */}
        {currentCanvas === 'flight' && (
          <div className="w-full h-full relative flex items-center justify-center animate-in fade-in duration-300">
            {/* Pixar Star Flight Base Render */}
            <img 
              src="/src/assets/images/star_flight_1788120412017.jpg" 
              alt="3D Pixar Cartoon Rocket Flight"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover select-none absolute inset-0 opacity-80"
            />
            {/* Elegant overlay to tint and blend background */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>

            {/* Customizable dynamic Space Trails */}
            {rocketStarTrail !== 'default' && (
              <div className="absolute top-[15%] left-[20%] z-20 flex gap-2">
                {rocketStarTrail === 'rainbow' && (
                  <div className="flex gap-1">
                    <span className="text-2xl animate-bounce text-red-400">🌈</span>
                    <span className="text-2xl animate-bounce delay-75 text-orange-400">⭐</span>
                    <span className="text-2xl animate-bounce delay-150 text-yellow-400">✨</span>
                  </div>
                )}
                {rocketStarTrail === 'cyber' && (
                  <div className="flex gap-1 animate-pulse">
                    <span className="text-2xl text-cyan-400">⚡</span>
                    <span className="text-2xl text-blue-500">🌌</span>
                  </div>
                )}
                {rocketStarTrail === 'cosmic' && (
                  <div className="flex gap-1 animate-ping">
                    <span className="text-2xl text-purple-400">🪐</span>
                    <span className="text-2xl text-pink-500">⭐</span>
                  </div>
                )}
              </div>
            )}

            {/* Co-Pilot Overlays */}
            {flightCoPilot !== 'none' && (
              <div className="absolute top-[40%] right-[32%] z-20 bg-slate-900/90 border border-indigo-500/40 p-1.5 rounded-full filter drop-shadow-md animate-bounce">
                {flightCoPilot === 'alien' && <span className="text-2xl">👽</span>}
                {flightCoPilot === 'kitty' && <span className="text-2xl">🐱</span>}
                {flightCoPilot === 'robot' && <span className="text-2xl">🤖</span>}
              </div>
            )}

            {/* Canvas Badge */}
            <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-xs font-black text-sky-300">
              🚀 Space Star Flight
            </div>
          </div>
        )}

        {/* Render Page D: Choc-Chip Bakery */}
        {currentCanvas === 'sweet' && (
          <div className="w-full h-full relative flex items-center justify-center animate-in fade-in duration-300">
            {/* Pixar Bakery Pre-rendered Flipbook Render */}
            <img 
              src={bakeryGallery[bakeryStyle]} 
              alt="3D Pixar Cupcake Bakery"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover select-none absolute inset-0 opacity-90 transition-all duration-300"
            />
            {/* Elegant overlay to tint and blend background */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>

            {/* Candle Overlays */}
            {bakeryCandle && (
              <div className="absolute top-[18%] text-center z-30 animate-pulse">
                <span className="text-4xl filter drop-shadow-[0_0_15px_#f59e0b]">🕯️</span>
              </div>
            )}

            {/* Canvas Badge */}
            <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-xs font-black text-amber-300">
              🧁 Choc-Chip Bakery Creator
            </div>
          </div>
        )}
      </div>

      {/* --- INTERACTIVE PIECE TRAY --- */}
      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3 relative z-10">
        <p className="text-xs font-black text-indigo-400 uppercase tracking-wide flex items-center gap-1.5">
          <span>📦 Tap to Modify Your Canvas</span>
          <span className="text-[9px] bg-slate-900 text-slate-400 px-1.5 py-0.5 rounded border border-slate-800">
            Rewards +10 Coins!
          </span>
        </p>

        {/* Dynamic Piece Trays based on Active Tab Canvas */}
        {currentCanvas === 'avatar' && (
          <div className="space-y-3 animate-in fade-in duration-200">
            {/* Row 1: Hair Accessories */}
            <div className="space-y-1.5">
              <span className="text-[11px] text-slate-400 font-bold block">Hair Styling Ornaments:</span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => { setPrincessStyle('plain'); handleModifyAction('chime'); }}
                  className={`p-2 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-1.5 ${
                    princessStyle === 'plain' ? 'bg-pink-950/80 border-pink-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span>✂️</span>
                  <span>Plain / Natural</span>
                </button>
                <button
                  onClick={() => { setPrincessStyle('crown'); handleModifyAction('chime'); }}
                  className={`p-2 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-1.5 ${
                    princessStyle === 'crown' ? 'bg-pink-950/80 border-pink-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span>👑</span>
                  <span>Royal Crown</span>
                </button>
                <button
                  onClick={() => { setPrincessStyle('shorthair'); handleModifyAction('chime'); }}
                  className={`p-2 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-1.5 ${
                    princessStyle === 'shorthair' ? 'bg-pink-950/80 border-pink-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span>💇</span>
                  <span>Short Hair Style</span>
                </button>
              </div>
            </div>

            {/* Row 2: Neckpieces */}
            <div className="space-y-1.5">
              <span className="text-[11px] text-slate-400 font-bold block">Necklace Style Tray:</span>
              <div className="grid grid-cols-4 gap-2">
                <button
                  onClick={() => { setNecklaceStyle('none'); handleModifyAction('chime'); }}
                  className={`p-2 rounded-xl text-xs font-bold border transition ${
                    necklaceStyle === 'none' ? 'bg-pink-950/80 border-pink-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  Plain Neck
                </button>
                <button
                  onClick={() => { setNecklaceStyle('beads'); handleModifyAction('chime'); }}
                  className={`p-2 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-1 ${
                    necklaceStyle === 'beads' ? 'bg-pink-950/80 border-pink-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span>📿</span>
                  <span className="hidden sm:inline">SA Beads</span>
                </button>
                <button
                  onClick={() => { setNecklaceStyle('gold'); handleModifyAction('chime'); }}
                  className={`p-2 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-1 ${
                    necklaceStyle === 'gold' ? 'bg-pink-950/80 border-pink-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span>🪙</span>
                  <span className="hidden sm:inline">Gold Chain</span>
                </button>
                <button
                  onClick={() => { setNecklaceStyle('pearls'); handleModifyAction('chime'); }}
                  className={`p-2 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-1 ${
                    necklaceStyle === 'pearls' ? 'bg-pink-950/80 border-pink-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span>💎</span>
                  <span className="hidden sm:inline">Pearls</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {currentCanvas === 'garage' && (
          <div className="space-y-3 animate-in fade-in duration-200">
            {/* Row 1: Lambo Body Decals */}
            <div className="space-y-1.5">
              <span className="text-[11px] text-slate-400 font-bold block">Supercar Racing Livery:</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => { setLamboStyle('clean'); handleModifyAction('wrench'); }}
                  className={`p-2.5 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-1.5 ${
                    lamboStyle === 'clean' ? 'bg-emerald-950/80 border-emerald-500 text-white animate-pulse' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span>🟢</span>
                  <span>Clean Factory Green</span>
                </button>
                <button
                  onClick={() => { setLamboStyle('stripes'); handleModifyAction('wrench'); }}
                  className={`p-2.5 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-1.5 ${
                    lamboStyle === 'stripes' ? 'bg-emerald-950/80 border-emerald-500 text-white animate-pulse' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span>🏁</span>
                  <span>Carbon Racing Stripes</span>
                </button>
              </div>
            </div>

            {/* Row 2: Neon glows */}
            <div className="space-y-1.5">
              <span className="text-[11px] text-slate-400 font-bold block">Neon Underglow Colors:</span>
              <div className="grid grid-cols-4 gap-2">
                <button
                  onClick={() => { setCarColorGlow('normal'); handleModifyAction('wrench'); }}
                  className={`p-2 rounded-xl text-xs font-bold border transition ${
                    carColorGlow === 'normal' ? 'bg-emerald-950/80 border-emerald-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  No Glow
                </button>
                <button
                  onClick={() => { setCarColorGlow('neon-green'); handleModifyAction('wrench'); }}
                  className={`p-2 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-1 ${
                    carColorGlow === 'neon-green' ? 'bg-emerald-950/80 border-emerald-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                  <span className="hidden sm:inline">Neon Green</span>
                </button>
                <button
                  onClick={() => { setCarColorGlow('neon-blue'); handleModifyAction('wrench'); }}
                  className={`p-2 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-1 ${
                    carColorGlow === 'neon-blue' ? 'bg-emerald-950/80 border-emerald-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                  <span className="hidden sm:inline">Neon Blue</span>
                </button>
                <button
                  onClick={() => { setCarColorGlow('neon-red'); handleModifyAction('wrench'); }}
                  className={`p-2 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-1 ${
                    carColorGlow === 'neon-red' ? 'bg-emerald-950/80 border-emerald-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                  <span className="hidden sm:inline">Neon Red</span>
                </button>
              </div>
            </div>

            {/* Row 2: Performance Boosters */}
            <div className="space-y-1.5">
              <span className="text-[11px] text-slate-400 font-bold block">Booster Combustion Exhaust:</span>
              <div className="grid grid-cols-4 gap-2">
                <button
                  onClick={() => { setEngineBoost('off'); handleModifyAction('wrench'); }}
                  className={`p-2 rounded-xl text-xs font-bold border transition ${
                    engineBoost === 'off' ? 'bg-emerald-950/80 border-emerald-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  Standard
                </button>
                <button
                  onClick={() => { setEngineBoost('plasma'); handleModifyAction('wrench'); }}
                  className={`p-2 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-1 ${
                    engineBoost === 'plasma' ? 'bg-emerald-950/80 border-emerald-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span>⚡</span>
                  <span className="hidden sm:inline">Plasma Spark</span>
                </button>
                <button
                  onClick={() => { setEngineBoost('nitro'); handleModifyAction('wrench'); }}
                  className={`p-2 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-1 ${
                    engineBoost === 'nitro' ? 'bg-emerald-950/80 border-emerald-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span>🔥</span>
                  <span className="hidden sm:inline">Nitro Flame</span>
                </button>
                <button
                  onClick={() => { setEngineBoost('electric'); handleModifyAction('wrench'); }}
                  className={`p-2 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-1 ${
                    engineBoost === 'electric' ? 'bg-emerald-950/80 border-emerald-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span>✨</span>
                  <span className="hidden sm:inline">Eco Electro</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {currentCanvas === 'flight' && (
          <div className="space-y-3 animate-in fade-in duration-200">
            {/* Row 1: Rocket Trail customization */}
            <div className="space-y-1.5">
              <span className="text-[11px] text-slate-400 font-bold block">Rocket Star Trail effect:</span>
              <div className="grid grid-cols-4 gap-2">
                <button
                  onClick={() => { setRocketStarTrail('default'); handleModifyAction('laser'); }}
                  className={`p-2 rounded-xl text-xs font-bold border transition ${
                    rocketStarTrail === 'default' ? 'bg-sky-950/80 border-sky-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  Default Trail
                </button>
                <button
                  onClick={() => { setRocketStarTrail('rainbow'); handleModifyAction('laser'); }}
                  className={`p-2 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-1 ${
                    rocketStarTrail === 'rainbow' ? 'bg-sky-950/80 border-sky-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span>🌈</span>
                  <span className="hidden sm:inline">Rainbow</span>
                </button>
                <button
                  onClick={() => { setRocketStarTrail('cyber'); handleModifyAction('laser'); }}
                  className={`p-2 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-1 ${
                    rocketStarTrail === 'cyber' ? 'bg-sky-950/80 border-sky-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span>⚡</span>
                  <span className="hidden sm:inline">Cyber Electro</span>
                </button>
                <button
                  onClick={() => { setRocketStarTrail('cosmic'); handleModifyAction('laser'); }}
                  className={`p-2 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-1 ${
                    rocketStarTrail === 'cosmic' ? 'bg-sky-950/80 border-sky-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span>🪐</span>
                  <span className="hidden sm:inline">Cosmic Nebula</span>
                </button>
              </div>
            </div>

            {/* Row 2: Co-Pilot select */}
            <div className="space-y-1.5">
              <span className="text-[11px] text-slate-400 font-bold block">Rocket Co-Pilot Cabin Companion:</span>
              <div className="grid grid-cols-4 gap-2">
                <button
                  onClick={() => { setFlightCoPilot('none'); handleModifyAction('laser'); }}
                  className={`p-2 rounded-xl text-xs font-bold border transition ${
                    flightCoPilot === 'none' ? 'bg-sky-950/80 border-sky-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  Solo Flight
                </button>
                <button
                  onClick={() => { setFlightCoPilot('alien'); handleModifyAction('laser'); }}
                  className={`p-2 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-1 ${
                    flightCoPilot === 'alien' ? 'bg-sky-950/80 border-sky-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span>👽</span>
                  <span className="hidden sm:inline">Cute Alien</span>
                </button>
                <button
                  onClick={() => { setFlightCoPilot('kitty'); handleModifyAction('laser'); }}
                  className={`p-2 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-1 ${
                    flightCoPilot === 'kitty' ? 'bg-sky-950/80 border-sky-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span>🐱</span>
                  <span className="hidden sm:inline">Star Kitty</span>
                </button>
                <button
                  onClick={() => { setFlightCoPilot('robot'); handleModifyAction('laser'); }}
                  className={`p-2 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-1 ${
                    flightCoPilot === 'robot' ? 'bg-sky-950/80 border-sky-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span>🤖</span>
                  <span className="hidden sm:inline">Bot Buddy</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {currentCanvas === 'sweet' && (
          <div className="space-y-3 animate-in fade-in duration-200">
            {/* Row 1: Bakery Toppings */}
            <div className="space-y-1.5">
              <span className="text-[11px] text-slate-400 font-bold block">Tasty Cake & Cupcake Toppings:</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => { setBakeryStyle('plain'); handleModifyAction('splat'); }}
                  className={`p-2.5 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-1.5 ${
                    bakeryStyle === 'plain' ? 'bg-amber-950/80 border-amber-500 text-white animate-pulse' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span>🧁</span>
                  <span>Plain Vanilla Frosting</span>
                </button>
                <button
                  onClick={() => { setBakeryStyle('topped'); handleModifyAction('splat'); }}
                  className={`p-2.5 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-1.5 ${
                    bakeryStyle === 'topped' ? 'bg-amber-950/80 border-amber-500 text-white animate-pulse' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span>🍓</span>
                  <span>Choc-Strawberry Topping</span>
                </button>
              </div>
            </div>

            {/* Row 2: Celebration Candle */}
            <div className="space-y-1.5">
              <span className="text-[11px] text-slate-400 font-bold block">Celebration Accessories:</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => { setBakeryCandle(false); handleModifyAction('splat'); }}
                  className={`p-2.5 rounded-xl text-xs font-bold border transition ${
                    !bakeryCandle ? 'bg-amber-950/80 border-amber-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  No Candle
                </button>
                <button
                  onClick={() => { setBakeryCandle(true); handleModifyAction('splat'); }}
                  className={`p-2.5 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-1.5 ${
                    bakeryCandle ? 'bg-amber-950/80 border-amber-500 text-white animate-pulse' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span>🕯️</span>
                  <span>Light Birthday Candle</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* --- PRETTY SHOP DIALOG OVERLAY MODAL --- */}
      {isShopOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border-2 border-amber-500/30 rounded-3xl p-5 sm:p-6 max-w-md w-full space-y-4 shadow-2xl relative text-white animate-in zoom-in-95 duration-200">
            
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-amber-400" />
                <h3 className="font-black text-base text-white">OS6 Kids Canvas Shop 🛍️</h3>
              </div>
              <button 
                onClick={() => { setIsShopOpen(false); playSoundEffect('chime'); }}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center font-bold text-xs"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5 py-1">
              <div className="flex justify-between items-center bg-slate-950 p-2 px-3 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400">Available Balance:</span>
                <span className="text-sm font-black text-amber-300 flex items-center gap-1">
                  <Coins className="w-4 h-4 text-amber-400" />
                  <span>{coins} Coins</span>
                </span>
              </div>

              {/* Shop items */}
              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 flex justify-between items-center">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">👑</span>
                    <div>
                      <div className="text-xs font-bold text-white">Sparkle Royal Crown</div>
                      <div className="text-[10px] text-slate-500">Premium Princess Hair Accessory</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      if (coins >= 50) {
                        setCoins(p => p - 50);
                        playSoundEffect('coin');
                        alert('Crown purchased successfully! Equipped in styling.');
                      } else {
                        alert('Not enough coins! Modify your canvases to earn more! 🪙');
                      }
                    }}
                    className="p-1.5 px-3 bg-amber-500 text-slate-950 hover:bg-amber-400 text-[10px] font-black rounded-lg uppercase"
                  >
                    50 🪙
                  </button>
                </div>

                <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 flex justify-between items-center">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">🔥</span>
                    <div>
                      <div className="text-xs font-bold text-white">Nitro Combustion Boost</div>
                      <div className="text-[10px] text-slate-500">Exhaust engine fire effect for supercar</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      if (coins >= 80) {
                        setCoins(p => p - 80);
                        playSoundEffect('coin');
                        alert('Nitro Boost purchased! Ready in garage.');
                      } else {
                        alert('Not enough coins! Modify your canvases to earn more! 🪙');
                      }
                    }}
                    className="p-1.5 px-3 bg-amber-500 text-slate-950 hover:bg-amber-400 text-[10px] font-black rounded-lg uppercase"
                  >
                    80 🪙
                  </button>
                </div>

                <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 flex justify-between items-center">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">🐱</span>
                    <div>
                      <div className="text-xs font-bold text-white">Galaxy Star Kitty</div>
                      <div className="text-[10px] text-slate-500">Co-pilot companion for star flight</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      if (coins >= 100) {
                        setCoins(p => p - 100);
                        playSoundEffect('coin');
                        alert('Star Kitty purchased! Ready for takeoff.');
                      } else {
                        alert('Not enough coins! Modify your canvases to earn more! 🪙');
                      }
                    }}
                    className="p-1.5 px-3 bg-amber-500 text-slate-950 hover:bg-amber-400 text-[10px] font-black rounded-lg uppercase"
                  >
                    100 🪙
                  </button>
                </div>

                <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 flex justify-between items-center">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">🕯️</span>
                    <div>
                      <div className="text-xs font-bold text-white">Sparkling Birthday Candle</div>
                      <div className="text-[10px] text-slate-500">Add a glowing celebration candle to treats</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      if (coins >= 40) {
                        setCoins(p => p - 40);
                        playSoundEffect('coin');
                        alert('Birthday Candle purchased successfully! Equipped in bakery styling.');
                      } else {
                        alert('Not enough coins! Modify your canvases to earn more! 🪙');
                      }
                    }}
                    className="p-1.5 px-3 bg-amber-500 text-slate-950 hover:bg-amber-400 text-[10px] font-black rounded-lg uppercase"
                  >
                    40 🪙
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => { setIsShopOpen(false); playSoundEffect('chime'); }}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 font-bold text-xs rounded-xl transition"
              >
                Close Shop
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
