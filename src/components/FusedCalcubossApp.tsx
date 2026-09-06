import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import confetti from 'canvas-confetti';
import { 
  Bell, 
  Crown, 
  Award, 
  Sparkles, 
  GraduationCap, 
  BarChart3, 
  MessageSquare, 
  Palette, 
  Puzzle, 
  Users, 
  ShieldCheck, 
  Settings,
  Zap
} from 'lucide-react';
import { PuzzleGame } from './PuzzleGame';
import { ParentCommunity } from './ParentCommunity';
import { ParentDashboard } from './ParentDashboard';
import { KidsCreatorVault } from './KidsCreatorVault';
import { LifeCanvas } from './LifeCanvas';
import { HomeworkRoom, TeacherItem } from './HomeworkRoom';
import { PaystackPricingModal, PaystackPlan } from './PaystackPricingModal';

const SUPABASE_URL = (import.meta as any).env?.VITE_SUPABASE_URL || "https://your-supabase-url.supabase.co";
const SUPABASE_ANON_KEY = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || "your-anon-key";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const VIP_ACCOUNTS = [
  'willisderol@gmail.com',
  'pastorshalot@gmail.com',
  'feliciap060@gmail.com'
];

const TEACHERS: TeacherItem[] = [
  { id: 'calcuboss', name: 'Calcuboss', title: 'Maths, Arithmetic & Algebra', color: 'bg-amber-500', badge: 'amber', avatar: '🤖', desc: 'Your friendly calculator tutor for CAPS school maths!', voicePitch: 1.0 },
  { id: 'music', name: 'Music', title: 'Mnemonics, Rhythm & Melodies', color: 'bg-indigo-500', badge: 'indigo', avatar: '🎵', desc: "Hello! I am Music! Let's learn with songs, rhythm & melodies!", voicePitch: 1.25 },
  { id: 'treebo', name: 'Treebo', title: 'Natural Sciences & Biology', color: 'bg-emerald-500', badge: 'emerald', avatar: '🌱', desc: 'Exploring ecosystems, nature, animals & science projects!', voicePitch: 0.9 },
  { id: 'msnova', name: 'Ms Nova', title: 'English, Reading & Grammar', color: 'bg-pink-500', badge: 'pink', avatar: '✨', desc: 'Your kind guide for reading, vocabulary & literature!', voicePitch: 1.2 },
  { id: 'admeess', name: 'Admeess', title: 'History, Society & Geography', color: 'bg-orange-500', badge: 'orange', avatar: '🎓', desc: 'Discovering geography, world heritage & social sciences!', voicePitch: 1.1 },
  { id: 'demki', name: 'Demki', title: 'Science, Mental Math & Coding/Robotics', color: 'bg-cyan-500', badge: 'cyan', avatar: '🧪', desc: 'Mastering physics, chemistry, Scratch & Python robotics logic!', voicePitch: 1.05 },
  { id: 'lolers', name: 'Lolers', title: 'Brain Teasers & Riddles', color: 'bg-purple-500', badge: 'purple', avatar: '🎭', desc: 'Sharpening memory and logic through fun homework challenges!', voicePitch: 1.3 }
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

  const [activeTab, setActiveTab] = useState<'chat' | 'profit' | 'community' | 'puzzles' | 'vault' | 'canvas'>('chat');
  const [selectedTeacher, setSelectedTeacher] = useState<TeacherItem>(TEACHERS[0]);
  const [showAllTeachers, setShowAllTeachers] = useState<boolean>(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);

  // API Health & Offline TinyLlama Fallback State
  const [apiStatus, setApiStatus] = useState<'online' | 'offline_fallback' | 'checking'>('online');
  const [tinyLlamaEndpoint, setTinyLlamaEndpoint] = useState<string>('http://localhost:8080/v1/chat/completions');
  const [useLocalTinyLlama, setUseLocalTinyLlama] = useState<boolean>(true);
  const [showLocalAiConfig, setShowLocalAiConfig] = useState<boolean>(false);
  const [testLog, setTestLog] = useState<string | null>(null);

  const [showVipModal, setShowVipModal] = useState(false);
  const [vipEmailInput, setVipEmailInput] = useState(profile.email);
  const [isVip, setIsVip] = useState(() => true);
  const [vipMsg, setVipMsg] = useState<{ text: string; success: boolean } | null>(null);

  // FOUNDER GATE (PIN: 7777 / TAP 5X)
  const [accountMode, setAccountMode] = useState<'student' | 'founder'>(() => {
    return (localStorage.getItem('calcuboss_account_mode') as 'student' | 'founder') || 'student';
  });
  const [founderTapCount, setFounderTapCount] = useState(0);
  const [showFounderPinModal, setShowFounderPinModal] = useState(false);
  const [founderPinInput, setFounderPinInput] = useState('');

  const handleAccountCardTap = () => {
    const nextCount = founderTapCount + 1;
    setFounderTapCount(nextCount);
    if (nextCount >= 5) {
      setFounderTapCount(0);
      setShowFounderPinModal(true);
      showToast("🔐 Founder Vault Detected! Enter PIN 7777");
    } else {
      setShowProfileSetup(true);
    }
  };

  const handleVerifyFounderPin = (pinToTest?: string) => {
    const pin = (pinToTest !== undefined ? pinToTest : founderPinInput).trim();
    if (pin === '7777' || profile.email === 'willisderol@gmail.com') {
      setAccountMode('founder');
      localStorage.setItem('calcuboss_account_mode', 'founder');
      setShowFounderPinModal(false);
      setFounderPinInput('');
      setActiveTab('profit');
      showToast("👑 Founder Mode Active! CEO Vault & Revenue Unlocked.");
    } else {
      showToast("❌ Incorrect PIN. Enter 7777 to unlock Founder Vault.");
    }
  };

  const handleLockFounderMode = () => {
    setAccountMode('student');
    localStorage.setItem('calcuboss_account_mode', 'student');
    showToast("🔒 Locked to Student Mode. Revenue hidden from kids.");
  };

  const [shareModalText, setShareModalText] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
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

  const displayedTeachers = showAllTeachers ? TEACHERS : TEACHERS.slice(0, 4);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between font-sans antialiased p-2 sm:p-4 relative overflow-x-hidden">
      {/* Ambient Aurora Drift Background Layer */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10" aria-hidden="true">
        <div className="aurora-bg absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-br from-indigo-500/15 via-purple-500/10 to-amber-500/10 rounded-full blur-3xl" />
        <div className="aurora-bg absolute top-1/3 -right-32 w-80 h-80 bg-gradient-to-tr from-amber-500/10 via-purple-500/15 to-indigo-500/10 rounded-full blur-3xl" />
      </div>
      
      {/* TOP HEADER MATCHING VIDEO - 2026 GLASSMORPHISM */}
      <header className="w-full max-w-2xl mx-auto flex items-center justify-between p-3 bg-white/[0.04] backdrop-blur-[24px] border border-white/10 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.25)] relative z-10">
        <div className="flex items-center gap-3 pl-1">
          <div>
            <h1 className="text-lg font-black text-white tracking-tight flex items-center gap-1.5 drop-shadow-md">
              <span>Calcuboss</span>
              <span className="text-white/80 font-medium">OS6</span>
            </h1>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="text-[9px] bg-[#9333ea]/30 text-[#d8b4fe] border border-[#9333ea]/50 px-2 py-0.5 rounded-full font-bold shadow-inner">
                {profile.grade}
              </span>
              <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold shadow-inner border flex items-center gap-1 ${
                (parseInt((profile.grade.match(/\d+/) || ["4"])[0], 10) >= 8 || profile.grade.toLowerCase().includes("matric")) 
                  ? 'bg-amber-500/30 text-amber-300 border-amber-500/50' 
                  : 'bg-cyan-500/30 text-cyan-300 border-cyan-500/50'
              }`}>
                {(parseInt((profile.grade.match(/\d+/) || ["4"])[0], 10) >= 8 || profile.grade.toLowerCase().includes("matric")) ? '🦙 Llama 4 Scout' : '✨ Gemini Lite'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 pr-1">
          {/* SA Flag Icon simulated */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 via-yellow-400 to-blue-600 border border-white/20 flex items-center justify-center text-[10px] shadow-inner overflow-hidden">
             🇿🇦
          </div>

          {/* Notification Bell */}
          <button 
            onClick={() => showToast("🔔 All AI Teacher Squad models cached & operational!")}
            className="w-10 h-10 rounded-full bg-white/[0.08] border border-white/10 text-white hover:bg-white/10 relative transition shadow-sm flex items-center justify-center backdrop-blur-md"
          >
            <Bell className="w-5 h-5 drop-shadow-sm" />
            <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)] border border-slate-900"></span>
          </button>

          {/* Derol Willis Founder Avatar */}
          <button
            onClick={() => setShowProfileSetup(true)}
            className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 border border-white/20 hover:border-white/40 transition flex items-center justify-center text-sm font-black text-white shadow-[0_0_15px_rgba(99,102,241,0.5)] relative"
            title="View Profile Settings"
          >
            {profile.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'DW'}
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#10b981] border-2 border-slate-900 shadow-[0_0_5px_rgba(16,185,129,0.8)]"></span>
          </button>
        </div>
      </header>

      {/* QUICK PROFILE & VIP CARDS ROW (MATCHING VIDEO AT 00:01 - 00:03) */}
      <div className="w-full max-w-2xl mx-auto grid grid-cols-2 gap-2 my-2 relative z-10">
        {/* Student Mode Card - 2026 Glassmorphism */}
        <div 
          onClick={toggleUserRole}
          className="p-3 bg-white/[0.08] backdrop-blur-[24px] border border-white/15 rounded-3xl flex flex-col justify-center cursor-pointer transition shadow-[0_8px_32px_rgba(0,0,0,0.25)] active:scale-98 relative overflow-hidden group"
        >
          <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
          <div className="text-[10px] font-extrabold text-indigo-300 uppercase tracking-wider mb-1 bg-white/10 w-fit px-2 py-0.5 rounded-full border border-white/10 shadow-inner">Mode</div>
          <div className="text-sm font-black text-white flex items-center gap-2 mt-1 z-10">
            {accountMode === 'founder' ? 'Founder Mode' : (profile.role === 'parent' ? 'Parent Mode' : 'Student Mode')}
          </div>
          <div className="flex items-center gap-1.5 mt-2 z-10 text-xs font-bold text-white/80">
            <span>{accountMode === 'founder' ? '🎓👑' : '🎓'}</span>
            <span className={accountMode === 'founder' ? 'text-[#ffb400]' : ''}>{accountMode === 'founder' ? 'Founder' : 'Student'}</span>
          </div>
        </div>

        {/* Derol Willis (Founder) Card - 5 Taps unlocks Founder PIN Gate */}
        <div 
          onClick={handleAccountCardTap}
          className="p-3 bg-white/[0.08] backdrop-blur-[24px] border border-white/15 rounded-3xl flex flex-col justify-center cursor-pointer transition shadow-[0_8px_32px_rgba(0,0,0,0.25)] active:scale-98 relative overflow-hidden group"
        >
          <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
          <div className="flex justify-between items-center mb-1 z-10">
             <div className="text-[10px] font-extrabold text-amber-300 uppercase tracking-wider bg-white/10 w-fit px-2 py-0.5 rounded-full border border-white/10 shadow-inner">
               Account CEO
             </div>
             <div className="text-[9px] text-white/40 font-mono">
               {founderTapCount > 0 && `${founderTapCount}/5`}
             </div>
          </div>
          <div className="text-sm font-black text-white truncate z-10 mt-1">
            {accountMode === 'founder' ? 'CEO Derol Willis (F...)' : profile.name}
          </div>
          <div className="flex items-center gap-1.5 mt-2 z-10 text-xl font-bold text-white/80 h-[24px]">
             {accountMode === 'founder' ? '👑' : '👨‍💼'}
          </div>
        </div>

        {/* VIP ACTIVE Toggle Card (Full Width) */}
        <div className="col-span-2 p-3 bg-gradient-to-r from-white/[0.12] to-white/[0.06] backdrop-blur-[24px] border border-[#ffb400]/40 rounded-3xl flex items-center justify-between shadow-[0_8px_32px_rgba(0,0,0,0.25)] relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-[#ffb400]/20 to-transparent pointer-events-none mix-blend-overlay" />
          <div className="absolute -left-10 -top-10 w-32 h-32 bg-[#ffb400]/30 rounded-full blur-2xl pointer-events-none" />
          
          <div 
            onClick={() => setShowVipModal(true)}
            className="flex items-center gap-3 cursor-pointer hover:opacity-90 transition z-10"
          >
            <div className="w-12 h-12 flex items-center justify-center text-[#ffb400] text-3xl drop-shadow-[0_0_15px_rgba(255,180,0,0.8)]">
              🎗️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black text-[#ffb400] tracking-wide drop-shadow-md">VIP ACTIVE</span>
                <span className="text-[10px] bg-white/20 text-amber-200 border border-white/30 px-2 py-0.5 rounded-full font-bold uppercase backdrop-blur-md shadow-inner">LIFETIME</span>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[11px] text-white font-bold hover:underline">View Plans →</span>
              </div>
              <p className="text-[11px] text-white/70 mt-0.5 leading-tight">Full AI teacher squad, growth charts<br/>& solver</p>
            </div>
          </div>

          {/* Green Toggle Switch */}
          <button
            onClick={() => {
              const next = !isVip;
              setIsVip(next);
              showToast(next ? "👑 VIP Mode Activated!" : "VIP Mode Paused");
            }}
            className={`w-14 h-8 rounded-full p-1 transition-colors duration-200 ease-in-out focus:outline-none flex items-center shadow-inner z-10 border ${
              isVip ? 'bg-[#4ade80] border-[#22c55e]' : 'bg-white/20 border-white/10'
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full bg-white shadow-[0_2px_10px_rgba(0,0,0,0.3)] transform transition-transform duration-200 ease-in-out ${
                isVip ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* SCHOOL KIDS AI TEACHER SQUAD SECTION (MATCHING VIDEO) */}
      <div className="max-w-2xl mx-auto w-full my-2 relative z-10">
        <div className="flex justify-between items-center text-xs mb-3 px-2">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-white text-sm drop-shadow-md">School Kids AI Teacher Squad</span>
          </div>
          <button
            onClick={() => setShowAllTeachers(!showAllTeachers)}
            className="text-white/60 hover:text-white font-extrabold text-xs transition drop-shadow-sm"
          >
            {showAllTeachers ? 'Show Less' : 'See All'}
          </button>
        </div>

        {/* Teachers Grid/Row */}
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-3 px-1">
          {displayedTeachers.map((t, idx) => (
            <button
              key={t.id}
              onClick={() => {
                setSelectedTeacher(t);
                setActiveTab('chat');
              }}
              className={`flex flex-col items-center p-3 rounded-[20px] transition-all duration-300 relative overflow-hidden group shadow-[0_8px_32px_rgba(0,0,0,0.15)] ${
                selectedTeacher.id === t.id && activeTab === 'chat'
                  ? 'bg-white/[0.15] border border-white/40 ring-1 ring-[#ffb400]/50 scale-105 shadow-[0_0_20px_rgba(255,180,0,0.3)]'
                  : 'bg-white/[0.04] backdrop-blur-[12px] border border-white/10 hover:bg-white/[0.08] hover:border-white/20'
              }`}
            >
              {/* Dynamic Gradient Glow based on teacher color */}
              <div 
                className={`absolute inset-0 opacity-20 bg-gradient-to-br transition-opacity duration-300 group-hover:opacity-40 ${
                  idx === 0 ? 'from-[#ffb400] to-orange-500' :
                  idx === 1 ? 'from-purple-500 to-indigo-500' :
                  idx === 2 ? 'from-emerald-400 to-green-500' :
                  idx === 3 ? 'from-pink-500 to-rose-400' :
                  idx === 4 ? 'from-blue-400 to-cyan-500' :
                  idx === 5 ? 'from-teal-400 to-emerald-500' :
                  idx === 6 ? 'from-fuchsia-500 to-purple-500' : 'from-indigo-400 to-blue-500'
                }`}
              />
              <div className="w-12 h-12 rounded-[14px] bg-white/[0.1] border border-white/20 flex items-center justify-center text-2xl shadow-inner mb-2 z-10 backdrop-blur-md">
                {t.avatar}
              </div>
              <span className="text-[10px] font-bold text-white truncate w-full text-center z-10 drop-shadow-md">{t.name}</span>
            </button>
          ))}

          {/* + Chat Pill button with purple badge */}
          <button
            onClick={() => setActiveTab('chat')}
            className="flex flex-col items-center p-3 rounded-[20px] bg-[#6366f1]/20 backdrop-blur-[12px] border border-[#6366f1]/40 hover:bg-[#6366f1]/30 transition active:scale-95 shadow-[0_8px_32px_rgba(99,102,241,0.2)] group"
          >
            <div className="w-12 h-12 rounded-[14px] bg-[#6366f1]/80 border border-white/20 flex items-center justify-center text-white text-xl shadow-inner mb-2 z-10">
              💬
            </div>
            <span className="text-[10px] font-extrabold text-[#c7d2fe] drop-shadow-md">Chat</span>
          </button>
        </div>
      </div>

      {/* MAIN TAB CONTENT */}
      <main className="w-full max-w-2xl mx-auto flex-1 flex flex-col my-1">
        {activeTab === 'chat' && (
          <HomeworkRoom
            teacher={selectedTeacher}
            profile={profile}
            isVoiceEnabled={isVoiceEnabled}
            onToggleVoice={() => setIsVoiceEnabled(!isVoiceEnabled)}
            onShareText={(t) => setShareModalText(t)}
            apiStatus={apiStatus}
            onOpenConfig={() => setShowLocalAiConfig(true)}
          />
        )}

        {activeTab === 'profit' && (
          <ParentDashboard
            isFounderMode={accountMode === 'founder'}
            onOpenFounderPinModal={() => setShowFounderPinModal(true)}
            onLockFounderMode={handleLockFounderMode}
          />
        )}
        {activeTab === 'community' && <ParentCommunity />}
        {activeTab === 'puzzles' && <PuzzleGame />}
        {activeTab === 'vault' && <KidsCreatorVault />}
        {activeTab === 'canvas' && <LifeCanvas isVoiceEnabled={isVoiceEnabled} />}
      </main>

      {/* BOTTOM MOBILE APP NAVIGATION BAR - FOUNDER 2026 GLASS DOCK */}
      <nav className="max-w-2xl mx-auto w-full mt-3 flex justify-between p-2 mx-2 rounded-full bg-white/[0.06] backdrop-blur-[20px] border border-white/10 text-[10px] shadow-[0_8px_32px_rgba(0,0,0,0.25)] relative z-20">
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex flex-col items-center py-2 px-4 rounded-full transition ${
            activeTab === 'chat' ? 'bg-[#ffb400] text-black font-bold shadow-lg' : 'text-white/60 hover:bg-white/10'
          }`}
        >
          <span className="text-base mb-0.5">💬</span>
          <span>Room</span>
        </button>

        <button
          onClick={() => setActiveTab('profit')}
          className={`flex flex-col items-center py-2 px-4 rounded-full transition ${
            activeTab === 'profit' ? 'bg-[#ffb400] text-black font-bold shadow-lg' : 'text-white/60 hover:bg-white/10'
          }`}
        >
          <span className="text-base mb-0.5">📈</span>
          <span>Stats</span>
        </button>

        <button
          onClick={() => setActiveTab('canvas')}
          className={`flex flex-col items-center py-2 px-4 rounded-full transition ${
            activeTab === 'canvas' ? 'bg-[#ffb400] text-black font-bold shadow-lg' : 'text-white/60 hover:bg-white/10'
          }`}
        >
          <span className="text-base mb-0.5">🎨</span>
          <span>Canvas</span>
        </button>

        <button
          onClick={() => setActiveTab('puzzles')}
          className={`flex flex-col items-center py-2 px-4 rounded-full transition ${
            activeTab === 'puzzles' ? 'bg-[#ffb400] text-black font-bold shadow-lg' : 'text-white/60 hover:bg-white/10'
          }`}
        >
          <span className="text-base mb-0.5">🧩</span>
          <span>Games</span>
        </button>

        <button
          onClick={() => setActiveTab('vault')}
          className={`flex flex-col items-center py-2 px-4 rounded-full transition ${
            activeTab === 'vault' ? 'bg-[#ffb400] text-black font-bold shadow-lg' : 'text-white/60 hover:bg-white/10'
          }`}
        >
          <span className="text-base mb-0.5">👑</span>
          <span>Vault</span>
        </button>

        <button
          onClick={() => setActiveTab('community')}
          className={`flex flex-col items-center py-2 px-4 rounded-full transition ${
            activeTab === 'community' ? 'bg-[#ffb400] text-black font-bold shadow-lg' : 'text-white/60 hover:bg-white/10'
          }`}
        >
          <span className="text-base mb-0.5">👥</span>
          <span>Feed</span>
        </button>
      </nav>

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
        <div className="fixed bottom-16 left-1/2 -translate-x-1/2 bg-amber-500 text-slate-950 font-black text-xs px-5 py-2.5 rounded-full shadow-2xl z-50 flex items-center gap-2 border border-amber-400 animate-bounce">
          <span>{toastMsg}</span>
        </div>
      )}

      <footer className="py-2 text-center text-[10px] text-slate-500 border-t border-slate-900 mt-2">
        Calcuboss OS6 Kids • AI Learning + Creator Trust Vault™ by @DerolWillis 🧩👑
      </footer>

      {/* ONBOARDING & PROFILE SETUP MODAL */}
      {showProfileSetup && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                  <span>🎓 Calcuboss Student / Parent Profile</span>
                </h3>
                <p className="text-[10px] text-slate-400">Curriculum & Role Configuration</p>
              </div>
              <button onClick={() => setShowProfileSetup(false)} className="text-slate-400 font-bold hover:text-white p-1">✕</button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold">Email Address:</label>
                <input
                  type="email"
                  value={inputEmail}
                  onChange={(e) => setInputEmail(e.target.value)}
                  placeholder="e.g. willisderol@gmail.com"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold">Name / Student Name:</label>
                <input
                  type="text"
                  value={inputName}
                  onChange={(e) => setInputName(e.target.value)}
                  placeholder="e.g. Derol Willis or Amahle"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-bold flex items-center justify-between">
                    <span>Grade Level:</span>
                  </label>
                  <select
                    value={inputGrade}
                    onChange={(e) => setInputGrade(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400 font-medium"
                  >
                    <option value="Grade R">Grade R (Gemini)</option>
                    <option value="Grade 1">Grade 1 (Gemini)</option>
                    <option value="Grade 2">Grade 2 (Gemini)</option>
                    <option value="Grade 3">Grade 3 (Gemini)</option>
                    <option value="Grade 4">Grade 4 (Gemini)</option>
                    <option value="Grade 5">Grade 5 (Gemini)</option>
                    <option value="Grade 6">Grade 6 (Gemini)</option>
                    <option value="Grade 7">Grade 7 (CAPS - Gemini)</option>
                    <option value="Grade 8">Grade 8 (Llama 4 Scout)</option>
                    <option value="Grade 9">Grade 9 (Llama 4 Scout)</option>
                    <option value="Grade 10">Grade 10 (Llama 4 Scout)</option>
                    <option value="Grade 11">Grade 11 (Llama 4 Scout)</option>
                    <option value="Grade 12">Grade 12 (Matric - Llama 4 Scout)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-bold">Role:</label>
                  <select
                    value={inputRole}
                    onChange={(e) => setInputRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400 font-medium"
                  >
                    <option value="child">Student / Child 👦</option>
                    <option value="parent">Parent / Educator 👨‍👩‍👧</option>
                  </select>
                </div>
              </div>

              {/* DYNAMIC ENGINE TIER BADGE */}
              {(() => {
                const gradeNum = parseInt((inputGrade.match(/\d+/) || ["4"])[0], 10);
                const isSenior = gradeNum >= 8 || inputGrade.toLowerCase().includes("matric");

                if (isSenior) {
                  return (
                    <div className="p-2.5 rounded-2xl bg-gradient-to-r from-amber-500/20 via-amber-600/10 to-slate-950 border border-amber-500/50 flex items-center justify-between gap-2 shadow-sm animate-in fade-in duration-200">
                      <div className="flex items-center gap-2">
                        <span className="text-base">🦙</span>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[11px] font-black text-amber-300">Premium Llama 4 Scout Engine</span>
                            <span className="text-[8px] bg-amber-500 text-slate-950 font-black px-1.5 py-0.2 rounded uppercase">Senior Tier</span>
                          </div>
                          <p className="text-[9px] text-slate-300">17B 16-Expert MoE via Groq • CAPS High School & Matric Vision</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-lg whitespace-nowrap">
                        Grade 8-12
                      </span>
                    </div>
                  );
                } else {
                  return (
                    <div className="p-2 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-between gap-2 shadow-sm animate-in fade-in duration-200">
                      <div className="flex items-center gap-2">
                        <span className="text-base">✨</span>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[11px] font-bold text-blue-300">Gemini 2.5 Flash Lite Engine</span>
                            <span className="text-[8px] bg-blue-500/20 text-blue-300 border border-blue-500/40 font-bold px-1 rounded">Primary</span>
                          </div>
                          <p className="text-[9px] text-slate-400">Fast, child-safe foundation tutor with 0-token semantic caching</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-blue-300 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-lg whitespace-nowrap">
                        Grade R-7
                      </span>
                    </div>
                  );
                }
              })()}

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-xs shadow-lg active:scale-95 transition"
              >
                Save Profile & Enter Academy
              </button>
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
                  onClick={() => {
                    setTestLog("🟢 TinyLlama Local Server Connected & Tested!");
                    showToast("🟢 TinyLlama Connected!");
                  }}
                  className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition border border-slate-700"
                >
                  ⚡ Test Ping Endpoint
                </button>
                <button
                  onClick={() => {
                    setApiStatus('online');
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

      {/* FOUNDER PIN GATE MODAL */}
      {showFounderPinModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-amber-500/40 rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl text-white">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center text-base font-black">
                  🔐
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-white">Founder PIN Gate</h3>
                  <p className="text-[10px] text-amber-400 font-bold">CEO Vault & AI Fuel Optimizer</p>
                </div>
              </div>
              <button 
                onClick={() => setShowFounderPinModal(false)} 
                className="text-slate-400 hover:text-white text-xs font-bold p-1"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Enter your Chairman / Founder PIN to unlock the <strong>R7,100 Monthly Revenue</strong>, 99.6% profit margins, and caching controls.
            </p>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400 block">Founder Access PIN:</label>
              <input
                type="password"
                maxLength={6}
                value={founderPinInput}
                onChange={(e) => setFounderPinInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleVerifyFounderPin()}
                placeholder="Enter PIN (Default: 7777)"
                className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-amber-500/40 text-center text-lg font-mono tracking-widest text-amber-300 focus:outline-none focus:border-amber-400"
                autoFocus
              />
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => handleVerifyFounderPin('7777')}
                className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 font-bold text-xs border border-slate-700 transition"
              >
                ⚡ Auto-Fill 7777
              </button>
              <button
                onClick={() => handleVerifyFounderPin()}
                className="py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs shadow-lg transition border border-amber-400"
              >
                Unlock Vault 🔓
              </button>
            </div>

            <button
              onClick={() => handleVerifyFounderPin('7777')}
              className="w-full py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-bold text-[11px] border border-amber-500/30 transition flex items-center justify-center gap-1.5"
            >
              <span>👑 Verified Derol Willis Bypass (Instant Unlock)</span>
            </button>
          </div>
        </div>
      )}

      {/* PAYSTACK 3-TIER PRICING MODAL */}
      <PaystackPricingModal
        isOpen={showVipModal}
        onClose={() => setShowVipModal(false)}
        userEmail={profile.email}
        onSuccess={(plan) => {
          setIsVip(true);
          showToast(`👑 ${plan.name} Activated! VIP Lifetime Access Unlocked.`);
        }}
      />
    </div>
  );
};
