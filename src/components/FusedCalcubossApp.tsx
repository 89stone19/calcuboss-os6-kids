import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import confetti from 'canvas-confetti';
import { PuzzleGame } from './PuzzleGame';
import { ParentCommunity } from './ParentCommunity';
import { ParentDashboard } from './ParentDashboard';
import { KidsCreatorVault } from './KidsCreatorVault';

const SUPABASE_URL = (import.meta as any).env?.VITE_SUPABASE_URL || "https://your-supabase-url.supabase.co";
const SUPABASE_ANON_KEY = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || "your-anon-key";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const VIP_ACCOUNTS = [
  'willisderol@gmail.com',
  'pastorshalot@gmail.com',
  'feliciap060@gmail.com'
];

const TEACHERS = [
  { id: 'calcuboss', name: 'Calcuboss', title: 'Math, Money & Business', color: 'bg-amber-500', badge: 'amber', avatar: '🤖', desc: 'Your friendly calculator CEO for math & business!' },
  { id: 'treebo', name: 'Treebo', title: 'Photosynthesis, Nature & Space', color: 'bg-emerald-500', badge: 'emerald', avatar: '🌱', desc: 'Exploring nature, botany & science facts!' },
  { id: 'msnova', name: 'Ms Nova', title: 'Reading, Grammar & Stories', color: 'bg-pink-500', badge: 'pink', avatar: '✨', desc: 'Your kind guide for stories, nouns & reading!' }
];

export type UserRole = 'child' | 'parent';
export type GradeLevel = 'Primary (Grade R-7)' | 'Secondary (Grade 8-12)';

export interface UserProfile {
  email: string;
  name: string;
  age: number;
  grade: string;
  level: GradeLevel;
  role: UserRole;
}

export const FusedCalcubossApp: React.FC = () => {
  // Persistent Profile & Auto Email Memory
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('calcuboss_user_profile');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    const savedEmail = localStorage.getItem('calcuboss_user_email') || 'willisderol@gmail.com';
    return {
      email: savedEmail,
      name: savedEmail.includes('willisderol') ? 'Derol Willis (Founder)' : 'Amahle Dlamini',
      age: 12,
      grade: 'Grade 7',
      level: 'Primary (Grade R-7)',
      role: 'child'
    };
  });

  const [showProfileSetup, setShowProfileSetup] = useState<boolean>(() => {
    return !localStorage.getItem('calcuboss_user_profile');
  });

  const [inputEmail, setInputEmail] = useState(profile.email);
  const [inputName, setInputName] = useState(profile.name);
  const [inputAge, setInputAge] = useState(profile.age);
  const [inputGrade, setInputGrade] = useState(profile.grade);
  const [inputRole, setInputRole] = useState<UserRole>(profile.role);

  const [activeTab, setActiveTab] = useState<'chat' | 'profit' | 'community' | 'puzzles' | 'vault'>('chat');
  const [selectedTeacher, setSelectedTeacher] = useState(TEACHERS[0]);
  const [messages, setMessages] = useState<{ role: 'bot' | 'user'; text: string; model?: string; isOfflineFallback?: boolean }[]>([]);
  const [inputMsg, setInputMsg] = useState('');
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [isSending, setIsSending] = useState(false);

  // API Health & Offline TinyLlama Fallback State
  const [apiStatus, setApiStatus] = useState<'online' | 'offline_fallback' | 'checking'>('online');
  const [apiErrorMessage, setApiErrorMessage] = useState<string | null>(null);
  const [tinyLlamaEndpoint, setTinyLlamaEndpoint] = useState<string>('http://localhost:8080/v1/chat/completions');
  const [useLocalTinyLlama, setUseLocalTinyLlama] = useState<boolean>(true);
  const [showLocalAiConfig, setShowLocalAiConfig] = useState<boolean>(false);
  const [testLog, setTestLog] = useState<string | null>(null);

  const [showVipModal, setShowVipModal] = useState(false);
  const [vipEmailInput, setVipEmailInput] = useState(profile.email);
  const [isVip, setIsVip] = useState(() => VIP_ACCOUNTS.includes(profile.email.toLowerCase()));
  const [vipMsg, setVipMsg] = useState<{ text: string; success: boolean } | null>(null);

  const [shareModalText, setShareModalText] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Auto Email Scan across 22 apps memory
  const handleAutoScanEmail = () => {
    const scanned = localStorage.getItem('calcuboss_user_email') || 'willisderol@gmail.com';
    setInputEmail(scanned);
    if (VIP_ACCOUNTS.includes(scanned.toLowerCase())) {
      setIsVip(true);
      showToast(`🔍 Auto-Scanned Email: ${scanned} (VIP Founder Restored!)`);
    } else {
      showToast(`🔍 Auto-Scanned Email: ${scanned}`);
    }
  };

  const handleSaveProfile = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const ageNum = Number(inputAge);
    const level: GradeLevel = ageNum <= 13 ? 'Primary (Grade R-7)' : 'Secondary (Grade 8-12)';
    const cleanEmail = inputEmail.trim().toLowerCase() || 'willisderol@gmail.com';

    const updated: UserProfile = {
      email: cleanEmail,
      name: inputName.trim() || 'Student',
      age: ageNum,
      grade: inputGrade,
      level,
      role: inputRole
    };

    setProfile(updated);
    localStorage.setItem('calcuboss_user_profile', JSON.stringify(updated));
    localStorage.setItem('calcuboss_user_email', cleanEmail);

    if (VIP_ACCOUNTS.includes(cleanEmail)) {
      setIsVip(true);
    }

    setShowProfileSetup(false);
    showToast(`✅ Profile Saved! Role: ${updated.role === 'parent' ? 'Parent/Educator 👨‍👩‍👧' : 'Student/Child 👦'} (${updated.grade})`);

    const welcomeMsg = `Welcome ${updated.name}! Profile set to ${updated.role === 'parent' ? 'Parent/Educator Mode' : 'Student Mode'} for ${updated.grade} (${updated.level}). I am ${selectedTeacher.name}, ready to teach!`;
    setMessages([
      { role: 'bot', text: welcomeMsg, model: updated.level === 'Primary (Grade R-7)' ? 'google/gemini-2.5-flash-lite' : 'meta-llama/llama-3.2-3b-instruct' }
    ]);
  };

  const toggleUserRole = () => {
    const newRole: UserRole = profile.role === 'child' ? 'parent' : 'child';
    const updated = { ...profile, role: newRole };
    setProfile(updated);
    setInputRole(newRole);
    localStorage.setItem('calcuboss_user_profile', JSON.stringify(updated));
    showToast(`🔄 Switched Mode: ${newRole === 'parent' ? 'Parent / Educator 👨‍👩‍👧' : 'Student / Child 👦'}`);
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast("📋 Copied to clipboard!");
  };

  const handleShareToCommunity = (text: string) => {
    const existingPostsStr = localStorage.getItem('calcuboss_community_posts');
    let existingPosts: any[] = [];
    if (existingPostsStr) {
      try { existingPosts = JSON.parse(existingPostsStr); } catch (e) {}
    }
    const newPost = {
      id: Date.now().toString(),
      app_name: 'calcuboss',
      parent_name: `${selectedTeacher.name} Shared Lesson 🌟`,
      message: text,
      created_at: new Date().toISOString()
    };
    localStorage.setItem('calcuboss_community_posts', JSON.stringify([newPost, ...existingPosts]));
    setShareModalText(null);
    setActiveTab('community');
    showToast("🚀 Shared to Parent Community!");
  };

  const handleShareWhatsApp = (text: string) => {
    const formatted = `*${selectedTeacher.name} Lesson - Calcuboss OS6* 🎓\n\n"${text}"\n\nJoin Apostolic Academy Kids: https://calcuboss.app`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(formatted)}`, '_blank');
    setShareModalText(null);
  };

  const handleShareFacebook = (text: string) => {
    const formatted = `${selectedTeacher.name} Lesson: "${text}" - Calcuboss Apostolic Academy OS6`;
    window.open(`https://www.facebook.com/sharer/sharer.php?quote=${encodeURIComponent(formatted)}`, '_blank');
    setShareModalText(null);
  };

  const handleShareTikTok = (text: string) => {
    const formatted = `${text}\n\n#CalcubossOS6 #ApostolicAcademy #KidsLearning #Pitori #SouthAfrica`;
    navigator.clipboard.writeText(formatted);
    showToast("🎵 Text & Hashtags copied! Opening TikTok...");
    setTimeout(() => {
      window.open('https://www.tiktok.com', '_blank');
      setShareModalText(null);
    }, 1200);
  };

  const handleNativeShare = (text: string) => {
    if (navigator.share) {
      navigator.share({
        title: `Calcuboss OS6 - ${selectedTeacher.name} Lesson`,
        text: text,
      }).catch(() => {});
      setShareModalText(null);
    } else {
      handleCopyText(text);
    }
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      if (!text) return;
      const cleanText = text.replace(/[*_#~`[\]()]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.pitch = 1.2;
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    const welcome = `Hello! I am ${selectedTeacher.name}. ${selectedTeacher.desc} What would you like to learn today?`;
    setMessages([
      { role: 'bot', text: welcome }
    ]);
    if (isVoiceEnabled) {
      speakText(welcome);
    }
  }, [selectedTeacher]);

  // Offline Teacher Response Generator (Local Engine Fallback)
  const generateOfflineTeacherResponse = (teacherId: string, teacherName: string, query: string): string => {
    const qLower = query.toLowerCase();
    if (teacherId === 'calcuboss') {
      if (qLower.includes('math') || qLower.includes('×') || qLower.includes('+') || qLower.includes('-') || /\d/.test(query)) {
        return `🦙 [Offline Query Mode] Calcuboss calculated: "${query}"! Practice math daily. Focus on step-by-step logic! 🧮`;
      }
      if (qLower.includes('saving') || qLower.includes('money') || qLower.includes('interest')) {
        return `🦙 [Offline Query Mode] Calcuboss CEO Tip: "${query}"! Savings generate interest over time. Smart budgeting rules! 💸`;
      }
      return `🦙 [Offline Query Mode] Calcuboss here! 🤖 Math & business logic regarding "${query}": Every puzzle has a calculated answer! 📈`;
    } else if (teacherId === 'treebo') {
      if (qLower.includes('photosynthesis') || qLower.includes('plant') || qLower.includes('tree')) {
        return `🦙 [Offline Query Mode] Treebo Science Zone! 🌿 Photosynthesis converts sunlight, water & CO₂ into oxygen and plant food! 🌱`;
      }
      return `🦙 [Offline Query Mode] Treebo rustles its leaves! 🌿 About "${query}": Science and nature show incredible patterns everywhere! 🌳`;
    } else {
      return `🦙 [Offline Query Mode] Ms Nova's Storytime! ✨ About "${query}": Reading expands your vocabulary and imagination every single day! 📚`;
    }
  };

  // Test local TinyLlama VPS endpoint connection
  const testTinyLlamaServer = async () => {
    setTestLog("Pinging local TinyLlama VPS server...");
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      const res = await fetch(tinyLlamaEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: "tinyllama",
          messages: [{ role: "user", content: "ping" }],
          max_tokens: 10
        }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (res.ok) {
        setTestLog("🟢 TinyLlama Server Online! Connection Successful.");
        showToast("🟢 TinyLlama Local Server Connected!");
      } else {
        setTestLog(`⚠️ Server ping returned HTTP ${res.status}. Local offline fallback engine ready.`);
      }
    } catch (e: any) {
      setTestLog(`ℹ️ Endpoint unreachable (${e.message || 'Offline'}). Local browser synthesis ready.`);
    }
  };

  const handleSend = async () => {
    if (!inputMsg.trim() || isSending) return;
    const userText = inputMsg;
    setInputMsg('');
    setIsSending(true);
    setMessages(prev => [...prev, { role: 'user', text: userText }]);

    // Multi-tier model routing based on Grade Level
    const targetModel = profile.level === 'Primary (Grade R-7)' 
      ? 'google/gemini-2.5-flash-lite' 
      : 'meta-llama/llama-3.2-3b-instruct';

    const systemInstruction = `You are ${selectedTeacher.name}, an AI educator for Calcuboss Apostolic Academy. The user is ${profile.name}, Age ${profile.age}, enrolled in ${profile.grade} (${profile.level}). Current Mode: ${profile.role === 'parent' ? 'Parent/Educator Oversight' : 'Student/Child Learning'}. ALL content MUST be 100% safe, educational, age-appropriate, and strictly tailored to the ${profile.grade} curriculum.`;

    const OPENROUTER_KEY = (import.meta as any).env?.VITE_OPENROUTER_API_KEY;

    let botReply = '';
    let usedEngine = targetModel;

    // 1. Try OpenRouter AI Cloud Route if key exists
    if (OPENROUTER_KEY) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2500);
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${OPENROUTER_KEY}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost:3000",
            "X-Title": "Calcuboss OS6 Academy"
          },
          body: JSON.stringify({
            model: targetModel,
            messages: [
              { role: "system", content: systemInstruction },
              { role: "user", content: userText }
            ]
          }),
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        if (response.ok) {
          const data = await response.json();
          botReply = data.choices?.[0]?.message?.content;
        }
      } catch (e) {
        console.warn("OpenRouter API call timed out or failed, trying local/cloud API...");
      }
    }

    // 2. Try Express Cloud /api/chat if OpenRouter was not used or failed
    if (!botReply) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: userText, teacher: selectedTeacher.id, profile }),
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        if (response.ok) {
          const data = await response.json();
          botReply = data.reply;
          usedEngine = 'cloud-express-api';
        }
      } catch (err: any) {
        console.warn("Express API failed, trying local TinyLlama fallback...");
      }
    }

    // 3. Try Local TinyLlama VPS endpoint if enabled
    if (!botReply && useLocalTinyLlama && tinyLlamaEndpoint) {
      try {
        const tController = new AbortController();
        const tTimeout = setTimeout(() => tController.abort(), 1800);
        const tRes = await fetch(tinyLlamaEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: "tinyllama",
            messages: [
              { role: "system", content: systemInstruction },
              { role: "user", content: userText }
            ],
            max_tokens: 120
          }),
          signal: tController.signal
        });
        clearTimeout(tTimeout);
        if (tRes.ok) {
          const tData = await tRes.json();
          const textResult = tData.choices?.[0]?.message?.content || tData.response;
          if (textResult) {
            botReply = `🦙 [TinyLlama 1.1B Local]: ${textResult}`;
            usedEngine = 'tinyllama-1.1b-local';
          }
        }
      } catch (tErr) {}
    }

    // 4. Final Rule-based Fallback
    if (!botReply) {
      botReply = generateOfflineTeacherResponse(selectedTeacher.id, selectedTeacher.name, userText);
      usedEngine = 'offline-rules-fallback';
      setApiStatus('offline_fallback');
      setApiErrorMessage("Cloud API unreachable. Engaged Offline TinyLlama Mode 🦙");
    } else {
      setApiStatus('online');
      setApiErrorMessage(null);
    }

    setMessages(prev => [...prev, { role: 'bot', text: botReply, model: usedEngine }]);
    if (isVoiceEnabled) speakText(botReply);
    setIsSending(false);
  };

  const validateVip = (emailToTest?: string) => {
    const target = (emailToTest || vipEmailInput).trim().toLowerCase();
    if (VIP_ACCOUNTS.includes(target)) {
      setIsVip(true);
      setVipMsg({ text: `👑 GOD-MODE ACTIVE! Welcome, Lifetime Bypass Unlocked for ${target}!`, success: true });
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      setTimeout(() => setShowVipModal(false), 1600);
    } else {
      setVipMsg({ text: "Standard Account. Use an authorized founder or executive email.", success: false });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between font-sans antialiased p-2 sm:p-4">
      
      {/* HEADER WITH AUTO EMAIL MEMORY & ROLE SWITCHER */}
      <header className="w-full max-w-2xl mx-auto flex flex-wrap items-center justify-between gap-2 py-2 border-b border-slate-900">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center font-black text-lg">⚡</div>
          <div>
            <h1 className="text-sm font-extrabold bg-gradient-to-r from-sky-400 to-pink-400 bg-clip-text text-transparent">
              Calcuboss OS6
            </h1>
            <p className="text-[10px] text-slate-400 flex items-center gap-1 font-medium">
              <span>{profile.grade}</span> • <span>{profile.level}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Child vs Parent Role Toggle */}
          <button
            onClick={toggleUserRole}
            className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold transition border flex items-center gap-1 ${
              profile.role === 'parent' 
                ? 'bg-purple-950 text-purple-300 border-purple-700 shadow' 
                : 'bg-indigo-950 text-indigo-300 border-indigo-700 shadow'
            }`}
            title="Switch Mode: Student / Child vs Parent / Educator"
          >
            <span>{profile.role === 'parent' ? '👨‍👩‍👧 Parent Mode' : '👦 Student Mode'}</span>
          </button>

          {/* Edit Profile & Auto Email Recovery Button */}
          <button
            onClick={() => setShowProfileSetup(true)}
            className="px-2.5 py-1 rounded-full text-[10px] bg-slate-800 text-slate-300 border border-slate-700 hover:text-white font-bold transition flex items-center gap-1"
            title="Profile, Grade & Auto Email Scanner Settings"
          >
            <span>⚙️ {profile.name}</span>
          </button>

          {/* Global Voice Toggle */}
          <button 
            onClick={() => {
              const nextState = !isVoiceEnabled;
              setIsVoiceEnabled(nextState);
              if (!nextState && 'speechSynthesis' in window) {
                window.speechSynthesis.cancel();
              } else if (nextState) {
                speakText(`Voice active! ${selectedTeacher.name} is ready to speak.`);
              }
            }}
            className={`px-2 py-1 rounded-full text-[10px] font-bold transition flex items-center gap-1 border ${
              isVoiceEnabled 
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700/80 shadow-sm shadow-emerald-900/40' 
                : 'bg-slate-800/80 text-slate-400 border-slate-700/80 hover:text-slate-200'
            }`}
            title="Toggle Global Voice TTS for Teacher Replies"
          >
            <span>{isVoiceEnabled ? '🔊 ON' : '🔇 OFF'}</span>
          </button>

          <button 
            onClick={() => setShowVipModal(true)}
            className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition shadow ${isVip ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white' : 'bg-amber-950 text-amber-300 border border-amber-700'}`}
          >
            {isVip ? '👑 VIP ACTIVE' : 'VIP PASS'}
          </button>
        </div>
      </header>

      {/* SQUAD SELECTOR & NAVIGATION TABS */}
      <div className="max-w-2xl mx-auto w-full my-2 bg-slate-900 border border-slate-800 rounded-2xl p-3 space-y-3">
        <div className="flex justify-between items-center text-xs">
          <span className="font-extrabold text-white">School Kids AI Teacher Squad</span>
          <span className="text-[9px] bg-emerald-950 text-emerald-400 px-2.5 py-0.5 rounded-full border border-emerald-700 font-bold">Caching Active ⚡</span>
        </div>
        <div className="flex gap-2">
          {TEACHERS.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedTeacher(t)}
              className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${selectedTeacher.id === t.id ? `${t.color} text-white shadow-md ring-2 ring-white/20` : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
            >
              <span className="text-sm">{t.avatar}</span>
              <span>{t.name}</span>
            </button>
          ))}
        </div>

        {/* Sub Navigation Tabs */}
        <div className="grid grid-cols-5 gap-1 pt-2 border-t border-slate-800 text-[11px]">
          <button 
            onClick={() => setActiveTab('chat')} 
            className={`py-1.5 rounded-xl font-bold transition text-center ${activeTab === 'chat' ? 'bg-indigo-600 text-white shadow' : 'bg-slate-800/60 text-slate-400 hover:text-white'}`}
          >
            💬 Chat
          </button>
          <button 
            onClick={() => setActiveTab('profit')} 
            className={`py-1.5 rounded-xl font-bold transition text-center ${activeTab === 'profit' ? 'bg-indigo-600 text-white shadow' : 'bg-slate-800/60 text-slate-400 hover:text-white'}`}
          >
            📊 Stats
          </button>
          <button 
            onClick={() => setActiveTab('community')} 
            className={`py-1.5 rounded-xl font-bold transition text-center ${activeTab === 'community' ? 'bg-indigo-600 text-white shadow' : 'bg-slate-800/60 text-slate-400 hover:text-white'}`}
          >
            👥 Feed
          </button>
          <button 
            onClick={() => setActiveTab('puzzles')} 
            className={`py-1.5 rounded-xl font-bold transition text-center ${activeTab === 'puzzles' ? 'bg-indigo-600 text-white shadow' : 'bg-slate-800/60 text-slate-400 hover:text-white'}`}
          >
            🧩 Game
          </button>
          <button 
            onClick={() => setActiveTab('vault')} 
            className={`py-1.5 rounded-xl font-bold transition text-center flex items-center justify-center gap-1 ${activeTab === 'vault' ? 'bg-gradient-to-r from-amber-500 to-indigo-600 text-white shadow ring-2 ring-amber-400/40' : 'bg-amber-950/40 text-amber-300 border border-amber-500/30 hover:text-white'}`}
          >
            👑 Vault
          </button>
        </div>
      </div>

      {/* TAB CONTENT */}
      <main className="w-full max-w-2xl mx-auto flex-1 flex flex-col my-1">
        {activeTab === 'chat' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[520px]">
            {/* Active Teacher Banner */}
            <div className="p-3 bg-slate-800/80 border-b border-slate-700/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-950 flex items-center justify-center text-2xl border border-sky-400/30">
                  {selectedTeacher.avatar}
                </div>
                <div>
                  <h2 className="text-xs font-extrabold text-white flex items-center gap-1.5">
                    <span>{selectedTeacher.name} — Homework Room</span>
                  </h2>
                  <p className="text-[10px] text-sky-300 font-medium">{selectedTeacher.title}</p>
                </div>
              </div>

              {/* API Status Badge & Config Toggle */}
              <button
                onClick={() => setShowLocalAiConfig(true)}
                className={`px-2.5 py-1 rounded-xl text-[10px] font-bold border flex items-center gap-1.5 transition ${
                  apiStatus === 'online'
                    ? 'bg-emerald-950/70 text-emerald-300 border-emerald-700/60 hover:bg-emerald-900/60'
                    : 'bg-amber-950/90 text-amber-300 border-amber-600/80 animate-pulse'
                }`}
                title="API Health & Local TinyLlama Settings"
              >
                <span className={`w-2 h-2 rounded-full ${apiStatus === 'online' ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
                <span>{apiStatus === 'online' ? '🟢 API Online' : '🦙 Offline Query (TinyLlama)'}</span>
              </button>
            </div>

            {/* Offline Query Fallback Banner */}
            {apiStatus === 'offline_fallback' && (
              <div className="bg-amber-950/90 border-b border-amber-800/80 p-2 px-3 flex items-center justify-between text-[11px] text-amber-200">
                <div className="flex items-center gap-2">
                  <span className="text-amber-400 font-bold">⚠️ API Response Failed:</span>
                  <span className="text-slate-200">Offline query mode active (Local TinyLlama Engine)</span>
                </div>
                <button
                  onClick={() => setShowLocalAiConfig(true)}
                  className="px-2 py-0.5 rounded-lg bg-amber-900 text-amber-100 text-[10px] font-bold hover:bg-amber-800 transition border border-amber-700"
                >
                  ⚙️ Config
                </button>
              </div>
            )}

            {/* Message Stream */}
            <div className="flex-1 p-3 overflow-y-auto space-y-3 text-xs">
              {messages.map((m, i) => (
                <div key={i} className={`flex items-end gap-1.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {m.role === 'bot' && (
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => speakText(m.text)} 
                        className="p-1.5 rounded-full bg-slate-800 text-sky-400 border border-slate-700 hover:bg-slate-700 transition"
                        title="Read Message Aloud"
                      >
                        🔊
                      </button>
                      <button 
                        onClick={() => handleCopyText(m.text)} 
                        className="p-1.5 rounded-full bg-slate-800 text-emerald-400 border border-slate-700 hover:bg-slate-700 transition"
                        title="Copy Text"
                      >
                        📋
                      </button>
                      <button 
                        onClick={() => setShareModalText(m.text)} 
                        className="p-1.5 rounded-full bg-slate-800 text-indigo-400 border border-slate-700 hover:bg-slate-700 transition"
                        title="Share to Community / WhatsApp / Socials"
                      >
                        📲
                      </button>
                    </div>
                  )}

                  <div className={`p-3 rounded-2xl max-w-[80%] leading-relaxed ${m.role === 'user' ? 'bg-indigo-600 text-white font-medium' : 'bg-slate-800 text-slate-100 border border-slate-700'}`}>
                    {m.text}
                  </div>

                  {m.role === 'user' && (
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => handleCopyText(m.text)} 
                        className="p-1.5 rounded-full bg-slate-800 text-emerald-400 border border-slate-700 hover:bg-slate-700 transition"
                        title="Copy Text"
                      >
                        📋
                      </button>
                      <button 
                        onClick={() => setShareModalText(m.text)} 
                        className="p-1.5 rounded-full bg-slate-800 text-indigo-400 border border-slate-700 hover:bg-slate-700 transition"
                        title="Share Question"
                      >
                        📲
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Quick Prompt Chips */}
            <div className="px-3 py-1.5 bg-slate-950 border-t border-slate-800/80 flex gap-1.5 overflow-x-auto text-[10px] scrollbar-none">
              <button onClick={() => setInputMsg("Explain Photosynthesis 🌱")} className="px-2.5 py-1 rounded-lg bg-slate-900 text-emerald-300 border border-slate-800 whitespace-nowrap hover:bg-slate-800 transition">🌱 Photosynthesis</button>
              <button onClick={() => setInputMsg("How do savings earn interest? 💸")} className="px-2.5 py-1 rounded-lg bg-slate-900 text-amber-300 border border-slate-800 whitespace-nowrap hover:bg-slate-800 transition">💸 Savings & Interest</button>
              <button onClick={() => setInputMsg("Tell me a bedtime story 📚")} className="px-2.5 py-1 rounded-lg bg-slate-900 text-pink-300 border border-slate-800 whitespace-nowrap hover:bg-slate-800 transition">📚 Story Time</button>
              <button onClick={() => setInputMsg("What is 25 × 12? 🧮")} className="px-2.5 py-1 rounded-lg bg-slate-900 text-sky-300 border border-slate-800 whitespace-nowrap hover:bg-slate-800 transition">🧮 Math Quiz</button>
            </div>

            {/* Fixed Input Bar */}
            <div className="p-3 bg-slate-950 border-t border-slate-800 flex gap-2">
              <input
                type="text"
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder={`Ask ${selectedTeacher.name} a question...`}
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-sky-400"
              />
              <button onClick={handleSend} className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow active:scale-95 hover:bg-indigo-500 transition">
                Send
              </button>
            </div>
          </div>
        )}

        {activeTab === 'profit' && <ParentDashboard />}
        {activeTab === 'community' && <ParentCommunity />}
        {activeTab === 'puzzles' && <PuzzleGame />}
        {activeTab === 'vault' && <KidsCreatorVault />}
      </main>

      {/* VIP & PRICING PLAN MODAL */}
      {showVipModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-5 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <div>
                <h3 className="font-extrabold text-sm text-white">👑 Calcuboss OS6 Global Plans & Pass</h3>
                <p className="text-[10px] text-slate-400">TinyLlama Free &rarr; OpenRouter Premium AI Tiers</p>
              </div>
              <button onClick={() => setShowVipModal(false)} className="text-slate-400 font-bold hover:text-white">✕</button>
            </div>

            {/* Global Pricing Tier Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[10px] text-emerald-400 font-bold uppercase">FREE TIER</span>
                <div className="font-black text-white text-sm">R0 / Free</div>
                <p className="text-[10px] text-slate-400">5 calls/day (TinyLlama 1.1B local)</p>
              </div>

              <div className="bg-slate-950 p-2.5 rounded-xl border border-indigo-800 space-y-1">
                <span className="text-[10px] text-indigo-400 font-bold uppercase">STARTER</span>
                <div className="font-black text-white text-sm">R50 / ~$3 USD</div>
                <p className="text-[10px] text-slate-400">100 calls/day (Gemini 2.5 Flash)</p>
              </div>

              <div className="bg-slate-950 p-2.5 rounded-xl border border-purple-800 space-y-1">
                <span className="text-[10px] text-purple-400 font-bold uppercase">GROWTH</span>
                <div className="font-black text-white text-sm">R100 / ~$6 USD</div>
                <p className="text-[10px] text-slate-400">300 calls/day (Gemini 2.5 + Llama 70B)</p>
              </div>

              <div className="bg-slate-950 p-2.5 rounded-xl border border-amber-600 space-y-1">
                <span className="text-[10px] text-amber-400 font-bold uppercase">PRO UNLIMITED</span>
                <div className="font-black text-white text-sm">R150 / ~$9 USD</div>
                <p className="text-[10px] text-amber-200 font-bold">Unlimited AI + Priority Vault</p>
              </div>
            </div>

            {/* Email Input for Founder Pass */}
            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-400 font-bold">Founder Email / Pass Validation:</label>
              <input
                type="email"
                placeholder="e.g. willisderol@gmail.com"
                value={vipEmailInput}
                onChange={(e) => setVipEmailInput(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex gap-1.5 flex-wrap">
              <button onClick={() => validateVip('willisderol@gmail.com')} className="text-[10px] bg-slate-800 px-2.5 py-1 rounded-lg text-slate-300 hover:bg-slate-700 border border-slate-700">⚡ Derol</button>
              <button onClick={() => validateVip('pastorshalot@gmail.com')} className="text-[10px] bg-slate-800 px-2.5 py-1 rounded-lg text-slate-300 hover:bg-slate-700 border border-slate-700">⚡ Shalot</button>
              <button onClick={() => validateVip('feliciap060@gmail.com')} className="text-[10px] bg-slate-800 px-2.5 py-1 rounded-lg text-slate-300 hover:bg-slate-700 border border-slate-700">⚡ Felicia</button>
            </div>

            {/* Payment Methods (Paystack ZAR + Global Crypto BTC/ETH/USDT) */}
            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-2 text-xs">
              <span className="text-[11px] font-bold text-slate-300 block">Accepted Global Payment Methods:</span>
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1 font-bold text-emerald-400">💳 Rand (Paystack / Cards / EFT)</span>
                <span className="flex items-center gap-1 font-bold text-amber-400">🪙 Crypto (BTC, ETH, USDT)</span>
              </div>
            </div>

            {vipMsg && <p className={`text-xs p-2 rounded-xl font-bold ${vipMsg.success ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}`}>{vipMsg.text}</p>}

            <button onClick={() => validateVip()} className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-xs shadow active:scale-95 hover:from-amber-400 hover:to-orange-400 transition">
              Activate VIP Founder Pass / Plan
            </button>
          </div>
        </div>
      )}

      {/* SHARE TARGET MODAL */}
      {shareModalText && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-5 space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2.5">
              <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                <span>📲 Share Lesson Text</span>
              </h3>
              <button onClick={() => setShareModalText(null)} className="text-slate-400 font-bold hover:text-white p-1">✕</button>
            </div>

            {/* Preview Box */}
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 text-xs text-slate-300 max-h-24 overflow-y-auto italic leading-relaxed">
              "{shareModalText}"
            </div>

            {/* Share Destination List */}
            <div className="space-y-2 text-xs font-bold">
              <button 
                onClick={() => handleCopyText(shareModalText)} 
                className="w-full p-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-sky-300 flex items-center justify-between transition border border-slate-700 active:scale-98"
              >
                <span className="flex items-center gap-2.5 text-slate-200">
                  <span className="text-base">📋</span> Copy Text to Clipboard
                </span>
                <span className="text-[10px] bg-slate-700 text-sky-300 px-2 py-0.5 rounded-md">Copy</span>
              </button>

              <button 
                onClick={() => handleShareToCommunity(shareModalText)} 
                className="w-full p-3 rounded-xl bg-indigo-950/90 hover:bg-indigo-900/90 text-indigo-200 flex items-center justify-between transition border border-indigo-700/80 active:scale-98"
              >
                <span className="flex items-center gap-2.5 text-indigo-100">
                  <span className="text-base">👥</span> Post to Parent Community
                </span>
                <span className="text-[10px] bg-indigo-600 text-white px-2 py-0.5 rounded-md shadow">Feed</span>
              </button>

              <button 
                onClick={() => handleShareWhatsApp(shareModalText)} 
                className="w-full p-3 rounded-xl bg-emerald-950/90 hover:bg-emerald-900/90 text-emerald-200 flex items-center justify-between transition border border-emerald-700/80 active:scale-98"
              >
                <span className="flex items-center gap-2.5 text-emerald-100">
                  <span className="text-base">💬</span> Share on WhatsApp
                </span>
                <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-md shadow">Chat</span>
              </button>

              <button 
                onClick={() => handleShareFacebook(shareModalText)} 
                className="w-full p-3 rounded-xl bg-blue-950/90 hover:bg-blue-900/90 text-blue-200 flex items-center justify-between transition border border-blue-700/80 active:scale-98"
              >
                <span className="flex items-center gap-2.5 text-blue-100">
                  <span className="text-base">📘</span> Share on Facebook
                </span>
                <span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded-md shadow">Post</span>
              </button>

              <button 
                onClick={() => handleShareTikTok(shareModalText)} 
                className="w-full p-3 rounded-xl bg-rose-950/90 hover:bg-rose-900/90 text-rose-200 flex items-center justify-between transition border border-rose-700/80 active:scale-98"
              >
                <span className="flex items-center gap-2.5 text-rose-100">
                  <span className="text-base">🎵</span> Copy Hashtags for TikTok
                </span>
                <span className="text-[10px] bg-rose-600 text-white px-2 py-0.5 rounded-md shadow">TikTok</span>
              </button>

              {typeof navigator !== 'undefined' && 'share' in navigator && (
                <button 
                  onClick={() => handleNativeShare(shareModalText)} 
                  className="w-full p-3 rounded-xl bg-amber-950/90 hover:bg-amber-900/90 text-amber-200 flex items-center justify-between transition border border-amber-700/80 active:scale-98"
                >
                  <span className="flex items-center gap-2.5 text-amber-100">
                    <span className="text-base">📱</span> System Share Picker
                  </span>
                  <span className="text-[10px] bg-amber-600 text-white px-2 py-0.5 rounded-md shadow">Apps</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* FLOATING TOAST FEEDBACK */}
      {toastMsg && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-indigo-600 text-white font-bold text-xs px-5 py-2.5 rounded-full shadow-2xl z-50 flex items-center gap-2 border border-indigo-400 animate-bounce">
          <span>{toastMsg}</span>
        </div>
      )}

      <footer className="py-4 text-center text-[11px] text-slate-500 border-t border-slate-900 mt-4">
        Calcuboss Apostolic Academy OS6 • Kids Chat & Puzzle Pack 🧩
      </footer>
      {/* ONBOARDING & PROFILE SETUP MODAL */}
      {showProfileSetup && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="text-center space-y-1 border-b border-slate-800 pb-3">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-cyan-400 via-indigo-500 to-purple-600 flex items-center justify-center text-2xl font-black shadow-lg">
                ⚡
              </div>
              <h2 className="text-base font-black bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">
                Calcuboss OS6 Apostolic Academy
              </h2>
              <p className="text-xs text-slate-400 font-medium">
                Grade R – Grade 12 Primary & Secondary Setup
              </p>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3.5 text-xs">
              {/* Role Switcher Selector */}
              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  Workspace Role / Mode:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setInputRole('child')}
                    className={`py-2 px-3 rounded-xl font-extrabold border transition flex items-center justify-center gap-1.5 ${
                      inputRole === 'child'
                        ? 'bg-indigo-600 text-white border-indigo-400 shadow'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    <span>👦 Student / Child</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setInputRole('parent')}
                    className={`py-2 px-3 rounded-xl font-extrabold border transition flex items-center justify-center gap-1.5 ${
                      inputRole === 'parent'
                        ? 'bg-purple-600 text-white border-purple-400 shadow'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    <span>👨‍👩‍👧 Parent / Educator</span>
                  </button>
                </div>
              </div>

              {/* Email & Auto-Scan */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-slate-300 font-bold">
                    Email Address (Saved across 22 Apps):
                  </label>
                  <button
                    type="button"
                    onClick={handleAutoScanEmail}
                    className="text-[10px] text-amber-300 bg-amber-950 px-2 py-0.5 rounded border border-amber-700/60 font-bold hover:bg-amber-900 transition"
                  >
                    🔍 Auto-Scan Email
                  </button>
                </div>
                <input
                  type="email"
                  required
                  value={inputEmail}
                  onChange={(e) => setInputEmail(e.target.value)}
                  placeholder="e.g. willisderol@gmail.com"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Student / User Full Name */}
              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  Full Name:
                </label>
                <input
                  type="text"
                  required
                  value={inputName}
                  onChange={(e) => setInputName(e.target.value)}
                  placeholder="e.g. Derol Willis / Amahle Dlamini"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Age & Grade Level Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Age:</label>
                  <input
                    type="number"
                    min={5}
                    max={19}
                    value={inputAge}
                    onChange={(e) => setInputAge(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Grade Level:</label>
                  <select
                    value={inputGrade}
                    onChange={(e) => setInputGrade(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Grade R">Grade R</option>
                    <option value="Grade 1-3">Grade 1 – 3 (Foundation)</option>
                    <option value="Grade 4-7">Grade 4 – 7 (Primary)</option>
                    <option value="Grade 8-9">Grade 8 – 9 (Junior Sec)</option>
                    <option value="Grade 10-12">Grade 10 – 12 (Senior Sec & Trades)</option>
                  </select>
                </div>
              </div>

              {/* Multi-tier AI safety note */}
              <div className="p-3 bg-indigo-950/60 border border-indigo-800/60 rounded-xl text-[11px] text-indigo-200 space-y-1">
                <div className="font-bold flex items-center gap-1 text-indigo-300">
                  <span>🛡️ Multi-Tier AI Routing:</span>
                </div>
                <ul className="list-disc list-inside text-[10px] space-y-0.5 text-slate-300">
                  <li><strong>Grade R–7:</strong> Gemini 2.5 Flash Lite (Fast, Primary Safety)</li>
                  <li><strong>Grade 8–12:</strong> Llama 3.2 3B Instruct (STEM, Boilermaking, Trade Math)</li>
                  <li><strong>Zero Network:</strong> Local TinyLlama 1.1B GGUF Fallback</li>
                </ul>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-xs shadow-lg transition"
                >
                  Enter Calcuboss Workspace 🚀
                </button>
                {localStorage.getItem('calcuboss_user_profile') && (
                  <button
                    type="button"
                    onClick={() => setShowProfileSetup(false)}
                    className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LOCAL AI & TINYLLAMA CONFIG MODAL */}
      {showLocalAiConfig && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-5 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">🦙</span>
                <div>
                  <h3 className="font-extrabold text-sm text-white">Offline AI & Local TinyLlama Settings</h3>
                  <p className="text-[10px] text-slate-400">Fallback routing for cloud API failures</p>
                </div>
              </div>
              <button onClick={() => setShowLocalAiConfig(false)} className="text-slate-400 font-bold hover:text-white p-1">✕</button>
            </div>

            {/* Current Health Status Card */}
            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-medium">Cloud API Status:</span>
                <span className={`font-extrabold px-2 py-0.5 rounded-full text-[10px] ${
                  apiStatus === 'online' ? 'bg-emerald-950 text-emerald-400 border border-emerald-700' : 'bg-amber-950 text-amber-300 border border-amber-700'
                }`}>
                  {apiStatus === 'online' ? '🟢 Online' : '⚠️ Offline Fallback Engaged'}
                </span>
              </div>
              {apiErrorMessage && (
                <p className="text-[11px] text-amber-300 bg-amber-950/50 p-2 rounded-xl border border-amber-800/60 font-mono">
                  {apiErrorMessage}
                </p>
              )}
            </div>

            {/* Local TinyLlama VPS Configuration */}
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <label className="font-bold text-slate-200">Route Fallbacks to Local VPS Endpoint:</label>
                <input
                  type="checkbox"
                  checked={useLocalTinyLlama}
                  onChange={(e) => setUseLocalTinyLlama(e.target.checked)}
                  className="w-4 h-4 rounded accent-indigo-500 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">TinyLlama GGUF Server Endpoint (Termux / VPS):</label>
                <input
                  type="text"
                  value={tinyLlamaEndpoint}
                  onChange={(e) => setTinyLlamaEndpoint(e.target.value)}
                  placeholder="http://localhost:8080/v1/chat/completions"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white font-mono focus:outline-none focus:border-indigo-400"
                />
              </div>

              {testLog && (
                <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-[11px] font-mono text-sky-300">
                  {testLog}
                </div>
              )}

              <div className="flex gap-2 pt-1">
                <button
                  onClick={testTinyLlamaServer}
                  className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition border border-slate-700"
                >
                  ⚡ Test Ping Endpoint
                </button>
                <button
                  onClick={() => {
                    setApiStatus('online');
                    setApiErrorMessage(null);
                    showToast("🔄 Reset API Health Status to Online");
                  }}
                  className="px-3 py-2 rounded-xl bg-indigo-950 text-indigo-300 font-bold text-xs hover:bg-indigo-900 border border-indigo-700 transition"
                >
                  🔄 Reset API Status
                </button>
              </div>
            </div>

            <div className="p-3 bg-indigo-950/40 border border-indigo-800/40 rounded-2xl text-[11px] text-indigo-200 flex items-start gap-2">
              <span className="text-base">💡</span>
              <span>
                When cloud API calls time out or return errors, Calcuboss OS6 automatically routes queries to your local TinyLlama GGUF instance or browser offline rules so kids never experience downtime!
              </span>
            </div>

            <button
              onClick={() => setShowLocalAiConfig(false)}
              className="w-full py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow active:scale-95 hover:bg-indigo-500 transition"
            >
              Done & Save Settings
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
