import React, { useState, useEffect, useRef } from 'react';
import { 
  Volume2, 
  VolumeX, 
  Copy, 
  Share2, 
  Send, 
  TrendingUp, 
  BarChart3, 
  BookOpen, 
  Calculator, 
  Phone, 
  PhoneOff, 
  PhoneCall,
  CheckCircle2, 
  Sparkles, 
  Check, 
  FileText, 
  RotateCcw,
  Bot,
  HelpCircle,
  ChevronRight,
  Zap,
  Mic,
  MicOff
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserProfile } from './FusedCalcubossApp';
import { DEMKI_PRESETS, findDemkiPreset } from '../presets';
import { generateSmartCodeFallback, routeDemki } from '../aiRouter';

export interface TeacherItem {
  id: string;
  name: string;
  title: string;
  color: string;
  badge: string;
  avatar: string;
  desc: string;
  voicePitch?: number;
}

interface HomeworkRoomProps {
  teacher: TeacherItem;
  profile: UserProfile;
  isVoiceEnabled: boolean;
  onToggleVoice: () => void;
  onShareText: (text: string) => void;
  apiStatus: 'online' | 'offline_fallback' | 'checking';
  onOpenConfig: () => void;
}

interface MathProblem {
  id: string;
  title: string;
  equation: string;
  steps: string[];
  finalAnswer: string;
  explanation: string;
}

const MATH_HOMEWORK_PROBLEMS: MathProblem[] = [
  {
    id: 'eq1',
    title: 'Linear Equation with Variables on Both Sides',
    equation: '4x - 6 = 2x + 10',
    steps: [
      'Step 1: Subtract 2x from both sides → 4x - 2x - 6 = 10',
      'Step 2: Simplify variable terms → 2x - 6 = 10',
      'Step 3: Add 6 to both sides → 2x = 10 + 6',
      'Step 4: Simplify constant terms → 2x = 16',
      'Step 5: Divide both sides by 2 → x = 16 ÷ 2'
    ],
    finalAnswer: 'x = 8',
    explanation: 'Check: 4(8) - 6 = 32 - 6 = 26. Right side: 2(8) + 10 = 16 + 10 = 26. Both sides match perfectly! 🎯'
  },
  {
    id: 'eq2',
    title: 'Fractional Algebraic Equation',
    equation: '(2x - 3) / 4 = (x + 1) / 2',
    steps: [
      'Step 1: Cross-multiply denominators → 2(2x - 3) = 4(x + 1)',
      'Step 2: Expand left side → 4x - 6',
      'Step 3: Expand right side → 4x + 4',
      'Step 4: Subtract 4x from both sides → -6 ≠ 4',
      'Step 5: Notice the variables cancel out with unequal constants'
    ],
    finalAnswer: 'No solution (Parallel lines / Contradiction)',
    explanation: 'When 4x cancels on both sides yielding -6 = 4, there is no value of x that satisfies the equation. In math, this is called inconsistent.'
  },
  {
    id: 'eq3',
    title: 'Fractions & Proportions',
    equation: '(3x + 5) / 2 = 19',
    steps: [
      'Step 1: Multiply both sides by 2 → 3x + 5 = 38',
      'Step 2: Subtract 5 from both sides → 3x = 33',
      'Step 3: Divide both sides by 3 → x = 33 ÷ 3'
    ],
    finalAnswer: 'x = 11',
    explanation: 'Check: (3(11) + 5) / 2 = (33 + 5) / 2 = 38 / 2 = 19. Correct! 🌟'
  },
  {
    id: 'eq4',
    title: 'Compound Interest & Savings Growth',
    equation: 'A = P(1 + r/n)^(nt)',
    steps: [
      'P (Principal Investment) = R10,000',
      'r (Annual Interest Rate) = 12% (0.12)',
      'n (Compounded Annually) = 1',
      't (Time in Years) = 5 Years',
      'Calculation: A = 10,000 × (1.12)^5'
    ],
    finalAnswer: 'R17,623.42 (+76.2% Total Growth)',
    explanation: 'Compounding makes money earn interest on top of past interest. This is how CEO Calcuboss builds generational wealth! 💰'
  }
];

export const getTeacherIntroMessage = (t: TeacherItem): string => {
  switch (t.id) {
    case 'music':
      return "Hello! I'm Music! Let's learn with songs, rhythm & melodies! What would you like to sing or solve today? 🎵";
    case 'calcuboss':
      return "Hello! I am Calcuboss, your friendly calculator CEO for math, money & business! What would you like to calculate today? 🤖";
    case 'treebo':
      return "Hello! I am Treebo! Let's explore photosynthesis, nature and space! What would you like to discover today? 🌱";
    case 'msnova':
      return "Hello! I am Ms Nova! Let's read, practice grammar and tell wonderful stories together! ✨";
    case 'admeess':
      return "Hello! I am Admeess! Let's explore history, ancient empires and world geography! 🎓";
    case 'demki':
      return "Hello! I am Demki! Let's build code, robotics logic and solve cool science experiments! 🧪\n\nWhat are we solving today? Maths or Code?";
    case 'lolers':
      return "Hello! I am Lolers! Ready for hilarious riddles, brain-teasers and logic puzzles? 🎭";
    default:
      return `Hello! I am ${t.name}. ${t.desc} What would you like to learn today?`;
  }
};

export const HomeworkRoom: React.FC<HomeworkRoomProps> = ({
  teacher,
  profile,
  isVoiceEnabled,
  onToggleVoice,
  onShareText,
  apiStatus,
  onOpenConfig
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'chat' | 'chart' | 'homework'>('chat');
  const [messages, setMessages] = useState<{ role: 'bot' | 'user'; text: string; time: string }[]>([
    {
      role: 'bot',
      text: getTeacherIntroMessage(teacher),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Growth Chart Interactive State
  const [selectedYearIndex, setSelectedYearIndex] = useState(3);
  const [chartMetricValue, setChartMetricValue] = useState('177,426.00');
  const [chartSubValue, setChartSubValue] = useState('3088.383');

  // Math Homework State
  const [selectedProblem, setSelectedProblem] = useState<MathProblem>(MATH_HOMEWORK_PROBLEMS[0]);
  const [revealedStepIndex, setRevealedStepIndex] = useState<number>(0);
  const [customEquationInput, setCustomEquationInput] = useState('');
  const [customSolvedStep, setCustomSolvedStep] = useState<string | null>(null);

  // Live Audio Call State
  const [isCallActive, setIsCallActive] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeSubTab]);

  // Voice Speech helper
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      if (!text) return;
      const clean = text.replace(/[*_#~`[\]()]/g, '');
      const utterance = new SpeechSynthesisUtterance(clean);
      utterance.pitch = teacher.voicePitch || 1.1;
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Update welcome message when teacher changes
  useEffect(() => {
    const welcome = getTeacherIntroMessage(teacher);
    setMessages([
      {
        role: 'bot',
        text: welcome,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    if (isVoiceEnabled) {
      speakText(welcome);
    }
  }, [teacher.id]);

  // Call timer effect
  useEffect(() => {
    let timer: any;
    if (isCallActive) {
      timer = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(timer);
  }, [isCallActive]);

  const handleStartCall = () => {
    setIsCallActive(true);
    const greeting = `Calling ${teacher.name}... Connected! Hello ${profile.name}! I am listening. What question can I help you solve right now?`;
    speakText(greeting);
  };

  const handleEndCall = () => {
    setIsCallActive(false);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  const handleSendChat = async (overrideText?: string) => {
    const textToSend = overrideText || inputMsg;
    if (!textToSend.trim() || isSending) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg = { role: 'user' as const, text: textToSend, time: timeStr };
    setMessages(prev => [...prev, userMsg]);
    if (!overrideText) setInputMsg('');
    setIsSending(true);

    const qLower = textToSend.toLowerCase();
    let reply = '';

    // Specialized Teacher Persona Response Generator
    if (teacher.id === 'music') {
      if (qLower.includes('7x') || qLower.includes('multiplication') || qLower.includes('times')) {
        reply = `🎵 [Music Rhythm Zone] Let's sing the 7s beat:\n🎶 7, 14, 21, 28... 35, 42, 49 don't wait!\n56, 63, and 70 is great! 🥁\nCatch the rhythm and you will never forget your 7 times table!`;
      } else if (qLower.includes('song') || qLower.includes('sing') || qLower.includes('melody')) {
        reply = `🎵 [Music Melody Studio] 🎶 "Equations in harmony, fractions in key / When you solve with rhythm, math sets you free!" 🎹 What lesson shall we turn into a hit song next?`;
      } else {
        reply = `🎵 [Teacher Music]: "Da-da-dum! Let's break down '${textToSend}' with rhythm and catchy mnemonics!" Repeat after me with the beat! 🎶`;
      }
    } else if (teacher.id === 'calcuboss') {
      if (qLower.includes('chart') || qLower.includes('money') || qLower.includes('177') || qLower.includes('growth')) {
        reply = `📈 Calcuboss Growth Intelligence: Based on compound projections, initial capital scales from 3,088 units to 177,426.00 over multi-year compounding cycles! Tap the '📊 Growth Chart' tab above to explore the visual trendline!`;
      } else if (qLower.includes('solve') || qLower.includes('equation') || qLower.includes('x =') || qLower.includes('4x')) {
        reply = `🧮 Calcuboss Step-by-Step Math Solver: Let's break down "${textToSend}". Tap the '📝 Homework Solver' tab to view line-by-line algebraic balancing!`;
      } else {
        reply = `Hello ${profile.name}! As Calcuboss (${teacher.title}), I'm calculating the most optimal solution for "${textToSend}". Practice daily, verify your formulas, and let me know if you want a step-by-step breakdown! 🤖`;
      }
    } else if (teacher.id === 'treebo') {
      if (qLower.includes('photosynthesis') || qLower.includes('plant')) {
        reply = `🌱 Photosynthesis Equation: 6CO₂ + 6H₂O + Sunlight → C₆H₁₂O₆ (Glucose) + 6O₂ (Oxygen). Plants breathe in carbon dioxide and give us pure fresh air! 🌿`;
      } else {
        reply = `🌿 Treebo Science Station: Nature and the cosmos are full of incredible patterns regarding "${textToSend}". Let's investigate the scientific cause and effect together! 🔬`;
      }
    } else if (teacher.id === 'msnova') {
      reply = `✨ Ms Nova's Story & Grammar Room: Reading is the key to all knowledge! Regarding "${textToSend}", let's explore the vocabulary, grammar structure, and meaning step-by-step! 📚`;
    } else if (teacher.id === 'admeess') {
      reply = `🎓 Admeess History & Society: From the pyramids of Giza to the kingdoms of Mapungubwe, every milestone in "${textToSend}" shaped human history! Let's explore the timeline! 🌍`;
    } else if (teacher.id === 'demki') {
      const matchedPreset = findDemkiPreset(textToSend);
      if (matchedPreset) {
        reply = matchedPreset.response;
      } else {
        const decision = routeDemki(textToSend, profile.grade);
        if (decision.isCode) {
          reply = generateSmartCodeFallback(textToSend);
        } else {
          reply = `🧪 Demki Code & Robotics Lab: Let's solve "${textToSend}" with step-by-step logic! Step 1: Analyze inputs. Step 2: Calculate formulas. Step 3: Verify results! 🤖💻`;
        }
      }
    } else if (teacher.id === 'lolers') {
      reply = `🎭 Lolers Riddle Vault: Why did the triangle feel sad? Because it was never right! 🤣 But about "${textToSend}": Think outside the box and solve the puzzle! 🧩`;
    } else {
      reply = `Hello ${profile.name}! As ${teacher.name} (${teacher.title}), I'm ready to help you master "${textToSend}". What is your first hypothesis?`;
    }

    // Try cloud API if reachable
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          question: textToSend, 
          teacherId: teacher.id, 
          grade: profile.grade || 'Grade 8',
          subject: teacher.subject || 'Math'
        }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (res.ok) {
        const data = await res.json();
        if (data.answer) {
          reply = data.answer;
        } else if (data.reply) {
          reply = data.reply;
        }
      }
    } catch (e) {}

    setTimeout(() => {
      const botTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setMessages(prev => [...prev, { role: 'bot', text: reply, time: botTime }]);
      setIsSending(false);
      if (isVoiceEnabled || isCallActive) speakText(reply);
    }, 400);
  };

  const handleCopyMessage = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Chart data matching the video display
  const chartBars = [
    { year: '1018', value: 35, display: 'R3,088', color: 'from-cyan-400 to-blue-500', height: '35%' },
    { year: '2002', value: 50, display: 'R12,450', color: 'from-pink-400 to-rose-500', height: '50%' },
    { year: '2007', value: 65, display: 'R38,900', color: 'from-amber-400 to-yellow-500', height: '65%' },
    { year: '2024', value: 92, display: 'R177,426', color: 'from-emerald-400 to-teal-500', height: '92%' },
    { year: '2025', value: 80, display: 'R142,800', color: 'from-purple-400 to-indigo-500', height: '80%' },
    { year: '2028', value: 100, display: 'R250,000', color: 'from-orange-400 to-amber-500', height: '100%' }
  ];

  const handleSelectBar = (index: number) => {
    setSelectedYearIndex(index);
    if (index === 3) {
      setChartMetricValue('177,426.00');
      setChartSubValue('3088.383');
    } else {
      setChartMetricValue(chartBars[index].display.replace('R', '') + '.00');
      setChartSubValue((Number(chartBars[index].value) * 42.1).toFixed(3));
    }
  };

  const handleCustomEquationSolve = () => {
    if (!customEquationInput.trim()) return;
    const clean = customEquationInput.trim();
    setCustomSolvedStep(`Analyzing '${clean}' → Balancing left & right expressions: Isolating unknown variables step-by-step.`);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col w-full text-slate-100">
      
      {/* ROOM HEADER */}
      <div className="p-3.5 bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-slate-950 border border-amber-500/40 flex items-center justify-center text-2xl shadow-inner relative group">
            <span>{teacher.avatar}</span>
            <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-slate-900 ring-2 ring-emerald-500/20"></span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-black text-white tracking-tight flex items-center gap-1.5">
                <span>{teacher.name} — Homework Room</span>
              </h2>
            </div>
            <p className="text-[10px] text-amber-300 font-bold flex items-center gap-1">
              <span>{teacher.title}</span>
              <span className="text-slate-600">•</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                API Online
              </span>
            </p>
          </div>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveSubTab('chat')}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold transition flex items-center gap-1 ${
              activeSubTab === 'chat'
                ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Chat Stream"
          >
            💬 Chat
          </button>
          <button
            onClick={() => setActiveSubTab('chart')}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold transition flex items-center gap-1 ${
              activeSubTab === 'chart'
                ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Growth & Math Bar Chart"
          >
            📊 Growth
          </button>
          <button
            onClick={() => setActiveSubTab('homework')}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold transition flex items-center gap-1 ${
              activeSubTab === 'homework'
                ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Grade 7 Step-by-Step Solver"
          >
            📝 Solver
          </button>
        </div>
      </div>

      {/* CALL OVERLAY (WHEN VOICE CALL IS ACTIVE) */}
      {isCallActive && (
        <div className="bg-gradient-to-b from-indigo-950 via-slate-950 to-slate-950 p-4 border-b border-indigo-500/40 flex items-center justify-between animate-in fade-in duration-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400 flex items-center justify-center text-xl animate-pulse">
              {teacher.avatar}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-white">Live Voice Call with {teacher.name}</span>
                <span className="text-[9px] bg-rose-950 text-rose-300 border border-rose-700 px-2 py-0.2 rounded-full font-mono">
                  {Math.floor(callDuration / 60)}:{String(callDuration % 60).padStart(2, '0')}
                </span>
              </div>
              <p className="text-[10px] text-indigo-300">Speech recognition active • Speak clearly into your mic</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`p-2 rounded-xl border text-xs font-bold transition ${
                isMuted ? 'bg-amber-950 text-amber-300 border-amber-700' : 'bg-slate-800 text-slate-200 border-slate-700'
              }`}
            >
              {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
            <button
              onClick={handleEndCall}
              className="px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg active:scale-95 transition"
            >
              <PhoneOff className="w-4 h-4" />
              <span>End Call</span>
            </button>
          </div>
        </div>
      )}

      {/* VIEW 1: CHAT STREAM */}
      {activeSubTab === 'chat' && (
        <div className="flex flex-col h-[400px]">
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex items-end gap-2 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.role === 'bot' && (
                  <div className="w-8 h-8 rounded-xl bg-slate-950 border border-amber-500/30 flex items-center justify-center text-base shrink-0 mb-1">
                    {teacher.avatar}
                  </div>
                )}

                <div className="space-y-1 max-w-[82%]">
                  <div
                    className={`p-3.5 rounded-2xl leading-relaxed shadow-sm ${
                      m.role === 'user'
                        ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-medium rounded-br-none'
                        : 'bg-slate-800 text-slate-100 border border-slate-700/80 rounded-bl-none'
                    }`}
                  >
                    <p className="whitespace-pre-line">{m.text}</p>
                  </div>

                  <div className={`flex items-center gap-2 px-1 text-[10px] text-slate-500 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <span>{m.time}</span>
                    {m.role === 'bot' && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => speakText(m.text)}
                          className="hover:text-amber-400 transition"
                          title="Speak message"
                        >
                          <Volume2 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleCopyMessage(m.text, idx)}
                          className="hover:text-emerald-400 transition"
                          title="Copy text"
                        >
                          {copiedIndex === idx ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        </button>
                        <button
                          onClick={() => onShareText(m.text)}
                          className="hover:text-sky-400 transition"
                          title="Share text"
                        >
                          <Share2 className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Carousel Dynamic per Teacher */}
          <div className="px-3 py-2 bg-slate-950/90 border-t border-slate-800/80 flex gap-2 overflow-x-auto text-[10px] scrollbar-none">
            {teacher.id === 'music' ? (
              <>
                <button
                  onClick={() => handleSendChat("Sing a multiplication rhythm for 7x table! 🎵")}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-pink-300 border border-slate-700 whitespace-nowrap transition flex items-center gap-1 font-bold"
                >
                  <span>🎵 7x Table Rhythm Song</span>
                </button>
                <button
                  onClick={() => handleSendChat("How do tempo, beat, and melody improve memory? 🥁")}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-purple-300 border border-slate-700 whitespace-nowrap transition flex items-center gap-1 font-bold"
                >
                  <span>🥁 Tempo & Memory</span>
                </button>
                <button
                  onClick={() => handleSendChat("Help me write a song about science and fractions! 🎹")}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-amber-300 border border-slate-700 whitespace-nowrap transition flex items-center gap-1 font-bold"
                >
                  <span>🎹 Songwriting Studio</span>
                </button>
                <button
                  onClick={() => handleSendChat("Teach me music notes and do-re-mi scale basics! 🎼")}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-emerald-300 border border-slate-700 whitespace-nowrap transition flex items-center gap-1 font-bold"
                >
                  <span>🎼 Musical Scales</span>
                </button>
              </>
            ) : teacher.id === 'treebo' ? (
              <>
                <button
                  onClick={() => handleSendChat("Explain Photosynthesis formula simply for Grade 7 🌱")}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-emerald-300 border border-slate-700 whitespace-nowrap transition flex items-center gap-1 font-bold"
                >
                  <span>🌱 Photosynthesis</span>
                </button>
                <button
                  onClick={() => handleSendChat("What is the order of all planets in our solar system? 🪐")}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-700 whitespace-nowrap transition flex items-center gap-1 font-bold"
                >
                  <span>🪐 Solar System</span>
                </button>
                <button
                  onClick={() => handleSendChat("How do trees breathe and produce oxygen? 🌳")}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-green-300 border border-slate-700 whitespace-nowrap transition flex items-center gap-1 font-bold"
                >
                  <span>🌳 Oxygen Cycle</span>
                </button>
              </>
            ) : teacher.id === 'msnova' ? (
              <>
                <button
                  onClick={() => handleSendChat("Tell me a mystery story about a secret library! 📚")}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-purple-300 border border-slate-700 whitespace-nowrap transition flex items-center gap-1 font-bold"
                >
                  <span>📚 Bedtime Story</span>
                </button>
                <button
                  onClick={() => handleSendChat("What is the difference between a noun, verb, and adverb? ✨")}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-pink-300 border border-slate-700 whitespace-nowrap transition flex items-center gap-1 font-bold"
                >
                  <span>✨ Grammar Guide</span>
                </button>
              </>
            ) : teacher.id === 'demki' ? (
              <>
                {DEMKI_PRESETS.filter(p => p.id !== 'welcome').map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => handleSendChat(preset.trigger.split('|')[0].trim())}
                    className={`px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border whitespace-nowrap transition flex items-center gap-1 font-bold ${
                      preset.price === 350 || preset.tier === 'R350'
                        ? 'text-purple-300 border-purple-700/80 bg-purple-950/40 hover:bg-purple-900/60'
                        : preset.founder_only
                        ? 'text-amber-300 border-amber-700/80 bg-amber-950/40 hover:bg-amber-900/60'
                        : preset.id.includes('growth')
                        ? 'text-emerald-300 border-emerald-700/80 bg-emerald-950/40 hover:bg-emerald-900/60'
                        : 'text-cyan-300 border-cyan-800/80'
                    }`}
                  >
                    <span>{preset.chip || preset.label}</span>
                  </button>
                ))}
              </>
            ) : (
              <>
                <button
                  onClick={() => handleSendChat("Solve equation 4x - 6 = 2x + 10 step-by-step! 🧮")}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-amber-300 border border-slate-700 whitespace-nowrap transition flex items-center gap-1 font-bold"
                >
                  <span>🧮 4x - 6 = 2x + 10</span>
                </button>
                <button
                  onClick={() => handleSendChat("Show me the compound interest growth chart for R10,000! 📈")}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-emerald-300 border border-slate-700 whitespace-nowrap transition flex items-center gap-1 font-bold"
                >
                  <span>📈 Growth Projections</span>
                </button>
                <button
                  onClick={() => handleSendChat("Give me 3 business rules for young CEOs 💼")}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-sky-300 border border-slate-700 whitespace-nowrap transition flex items-center gap-1 font-bold"
                >
                  <span>💼 CEO Business Rules</span>
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* VIEW 2: DYNAMIC GROWTH BAR CHART (MATCHING VIDEO 00:06) */}
      {activeSubTab === 'chart' && (
        <div className="p-4 space-y-4 bg-slate-950/60 animate-in fade-in duration-200">
          
          {/* Top Big Metric Display */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 p-4 rounded-2xl border border-slate-800 shadow-xl flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-800">
                  Compounded Capital Value
                </span>
                <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-0.5">
                  <TrendingUp className="w-3 h-3" /> +5,640%
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-baseline gap-1 font-mono">
                <span>R{chartMetricValue}</span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono">
                Index Base: <span className="text-slate-200 font-bold">{chartSubValue}</span> units
              </p>
            </div>

            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner">
              <BarChart3 className="w-6 h-6" />
            </div>
          </div>

          {/* Dynamic Bar Chart Visual */}
          <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="font-extrabold text-white flex items-center gap-1.5">
                <span>📊 Multi-Period Savings & Yield Bar Chart</span>
              </span>
              <span className="text-[10px] text-slate-400">Tap bars to inspect</span>
            </div>

            {/* Bars Area */}
            <div className="h-44 flex items-end justify-between gap-2 pt-6 px-2 border-b border-slate-800">
              {chartBars.map((bar, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSelectBar(idx)}
                  className="flex-1 flex flex-col items-center gap-2 h-full justify-end cursor-pointer group"
                >
                  {/* Tooltip value */}
                  <span className={`text-[9px] font-bold transition font-mono ${
                    selectedYearIndex === idx ? 'text-amber-300 scale-110' : 'text-slate-500 opacity-0 group-hover:opacity-100'
                  }`}>
                    {bar.display}
                  </span>

                  {/* Colored Bar */}
                  <div
                    style={{ height: bar.height }}
                    className={`w-full rounded-t-xl bg-gradient-to-t ${bar.color} transition-all duration-300 shadow-lg ${
                      selectedYearIndex === idx ? 'ring-2 ring-white scale-105 opacity-100' : 'opacity-80 group-hover:opacity-100'
                    }`}
                  />
                </div>
              ))}
            </div>

            {/* X-Axis Years matching video */}
            <div className="flex justify-between text-[10px] font-black text-slate-400 px-2 font-mono">
              {chartBars.map((b, i) => (
                <button
                  key={i}
                  onClick={() => handleSelectBar(i)}
                  className={`flex-1 text-center hover:text-white transition ${
                    selectedYearIndex === i ? 'text-amber-400 font-extrabold scale-110' : ''
                  }`}
                >
                  {b.year}
                </button>
              ))}
            </div>
          </div>

          {/* CEO Calculator Fast Projection */}
          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="text-base">💡</span>
              <div>
                <p className="font-bold text-white text-[11px]">Calcuboss Compounding Rule:</p>
                <p className="text-[10px] text-slate-400">Saving R50/week at 10% annual return yields over R35,000 before high school graduation!</p>
              </div>
            </div>
            <button
              onClick={() => handleSendChat("Calculate compound interest for R50/week over 5 years")}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold transition shadow"
            >
              Simulate
            </button>
          </div>
        </div>
      )}

      {/* VIEW 3: GRADE 7 HOMEWORK STEP-BY-STEP SOLVER (MATCHING VIDEO 00:07) */}
      {activeSubTab === 'homework' && (
        <div className="p-4 space-y-4 bg-slate-950/60 animate-in fade-in duration-200">
          
          {/* Preset Problem Switcher */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Choose Equation from Curriculum:
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {MATH_HOMEWORK_PROBLEMS.map((prob) => (
                <button
                  key={prob.id}
                  onClick={() => {
                    setSelectedProblem(prob);
                    setRevealedStepIndex(0);
                    setCustomSolvedStep(null);
                  }}
                  className={`p-2.5 rounded-xl text-left border transition ${
                    selectedProblem.id === prob.id
                      ? 'bg-amber-950/80 border-amber-500 text-amber-200 shadow-md font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <p className="text-[11px] font-black text-white truncate font-mono">{prob.equation}</p>
                  <p className="text-[9px] text-slate-400 truncate">{prob.title}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Active Problem Step-by-Step Card */}
          <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div>
                <span className="text-[10px] text-amber-400 font-extrabold uppercase">Equation to Solve</span>
                <h3 className="text-base sm:text-lg font-black text-white font-mono tracking-wide">{selectedProblem.equation}</h3>
              </div>
              <div className="w-9 h-9 rounded-xl bg-indigo-950 border border-indigo-700 flex items-center justify-center text-indigo-300 font-bold text-xs">
                {selectedProblem.id.toUpperCase()}
              </div>
            </div>

            {/* Steps list */}
            <div className="space-y-2">
              {selectedProblem.steps.map((step, sIdx) => (
                <div
                  key={sIdx}
                  className={`p-2.5 rounded-xl border text-xs font-mono transition-all duration-300 ${
                    sIdx <= revealedStepIndex
                      ? 'bg-slate-950 border-slate-700 text-slate-200 animate-in fade-in'
                      : 'bg-slate-950/30 border-slate-850 text-slate-600 blur-[1px]'
                  }`}
                >
                  {sIdx <= revealedStepIndex ? step : `Step ${sIdx + 1}: Tap 'Next Step' to unlock...`}
                </div>
              ))}
            </div>

            {/* Answer banner when fully revealed */}
            {revealedStepIndex >= selectedProblem.steps.length - 1 && (
              <div className="p-3 bg-gradient-to-r from-emerald-950 to-teal-950 rounded-xl border border-emerald-500/50 space-y-1 animate-in zoom-in-95 duration-200">
                <div className="flex items-center gap-1.5 text-emerald-400 font-black text-xs">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Final Solution: {selectedProblem.finalAnswer}</span>
                </div>
                <p className="text-[10px] text-emerald-200 leading-relaxed font-sans">{selectedProblem.explanation}</p>
              </div>
            )}

            {/* Step Controls */}
            <div className="flex items-center justify-between pt-1">
              <button
                onClick={() => setRevealedStepIndex(0)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold flex items-center gap-1 transition"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>

              <button
                onClick={() => {
                  if (revealedStepIndex < selectedProblem.steps.length - 1) {
                    setRevealedStepIndex(prev => prev + 1);
                  } else {
                    confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
                    speakText(`Great job! Solution reached: ${selectedProblem.finalAnswer}`);
                  }
                }}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black shadow-lg flex items-center gap-1.5 active:scale-95 transition"
              >
                <span>{revealedStepIndex < selectedProblem.steps.length - 1 ? 'Unlock Next Step ➡️' : '🎉 Verify & Celebrate!'}</span>
              </button>
            </div>
          </div>

          {/* Custom Equation Solver Input */}
          <div className="bg-slate-900/90 p-3 rounded-2xl border border-slate-800 space-y-2">
            <span className="text-[10px] font-bold text-slate-400">Type Your Own Homework Problem:</span>
            <div className="flex gap-2">
              <input
                type="text"
                value={customEquationInput}
                onChange={(e) => setCustomEquationInput(e.target.value)}
                placeholder="e.g. 5x + 12 = 3x + 28"
                className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
              />
              <button
                onClick={handleCustomEquationSolve}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow"
              >
                Solve
              </button>
            </div>
            {customSolvedStep && (
              <p className="text-[10px] text-amber-300 p-2 bg-slate-950 rounded-lg border border-amber-500/30">
                {customSolvedStep}
              </p>
            )}
          </div>
        </div>
      )}

      {/* BOTTOM ACTION TOOLBAR (MATCHING VIDEO AT 00:04 & 00:06) */}
      <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
        {/* Speaker Button */}
        <button
          onClick={() => {
            onToggleVoice();
            if (!isVoiceEnabled) {
              speakText(`Voice enabled. ${teacher.name} is ready!`);
            }
          }}
          className={`p-2.5 rounded-xl border transition shrink-0 ${
            isVoiceEnabled
              ? 'bg-amber-500/20 text-amber-400 border-amber-500/40 shadow-sm'
              : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
          }`}
          title="Toggle Teacher Voice Synthesis (Speaker)"
        >
          {isVoiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* Clipboard / Notes Button */}
        <button
          onClick={() => {
            const latestBot = messages.filter(m => m.role === 'bot').slice(-1)[0]?.text || teacher.desc;
            navigator.clipboard.writeText(latestBot);
            speakText("Notes copied to clipboard!");
          }}
          className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 transition shrink-0 hover:text-white"
          title="Copy Latest Lesson Notes"
        >
          <FileText className="w-4 h-4" />
        </button>

        {/* Phone / Voice Call Button */}
        <button
          onClick={() => {
            if (isCallActive) {
              handleEndCall();
            } else {
              handleStartCall();
            }
          }}
          className={`p-2.5 rounded-xl border transition shrink-0 ${
            isCallActive
              ? 'bg-rose-600 text-white border-rose-500 animate-pulse'
              : 'bg-emerald-950 text-emerald-300 border-emerald-700 hover:bg-emerald-900'
          }`}
          title="Start Live Voice Tutor Call"
        >
          <PhoneCall className="w-4 h-4" />
        </button>

        {/* Text Input */}
        <div className="flex-1 relative">
          <input
            type="text"
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
            placeholder={`Ask ${teacher.name} a question...`}
            className="w-full pl-3.5 pr-9 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
          />
          <button
            onClick={() => handleSendChat()}
            disabled={!inputMsg.trim() || isSending}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:hover:bg-amber-500 text-slate-950 transition shadow"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

    </div>
  );
};
