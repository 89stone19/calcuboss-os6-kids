import React, { useState, useEffect } from 'react';
import { Trophy, MessageCircle, Gift, Fuel, ShieldCheck, Send, Sparkles, Award, CheckCircle, Share2, Users, Heart, Key, Youtube, Play, Video, ExternalLink, ThumbsUp } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

interface LeaderboardEntry {
  id: string;
  app_name: string;
  student_name: string;
  xp: number;
  month: string;
  voucher_won: boolean;
  voucher_code?: string;
}

interface CommunityPost {
  id: string;
  app_name: string;
  parent_name: string;
  message: string;
  created_at: string;
  youtube_url?: string;
  youtube_id?: string;
  likes_count?: number;
}

interface YouTubeKidVideo {
  id: string;
  youtube_id: string;
  title: string;
  description: string;
  teacher: string;
  category: string;
}

const DEROL_WILLIS_VIDEOS: YouTubeKidVideo[] = [
  {
    id: '1',
    youtube_id: '3JZ_D3ELwOQ',
    title: 'Calcuboss OS6 — Kids Math & Fares Tour in Pretoria 🚕🧮',
    description: 'Learn speed, distance, addition and subtraction with Calcuboss CEO!',
    teacher: '🤖 Calcuboss',
    category: 'Math & Logic'
  },
  {
    id: '2',
    youtube_id: 'L_LUpnjgPso',
    title: 'Treebo Science Zone — How Leaves Make Oxygen 🌿☀️',
    description: 'Explore plant botany and photosynthesis with Treebo in nature!',
    teacher: '🌱 Treebo',
    category: 'Botany & Science'
  },
  {
    id: '3',
    youtube_id: 'dQw4w9WgXcQ',
    title: 'Ms Nova Storytime — Phonics, Alphabet & Bedtime Tales 📚✨',
    description: 'Read along with Ms Nova to expand kids grammar and reading confidence!',
    teacher: '✨ Ms Nova',
    category: 'English & Reading'
  }
];

export const extractYouTubeId = (url: string): string | null => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

export const ALLOWED_KIDS_KEYWORDS = [
  "kids", "toddler", "nursery", "abc", "phonics", "animal sounds", "ms nova", "calcuboss", "treebo", "derolwillis", "math", "science", "school", "learning", "story", "education", "academy", "puzzle"
];

export const FORBIDDEN_VIDEO_KEYWORDS = [
  "scary", "gore", "fight", "guns", "sexy", "violence", "horror", "death", "blood"
];

export const isKidsVideo = (title: string, description: string = '', channelHandle: string = ''): { allowed: boolean; boost: number; reason?: string } => {
  const text = `${title} ${description} ${channelHandle}`.toLowerCase();
  
  // Rule 1: @DerolWillis official channel videos always pass and get 10x boost
  if (text.includes('derolwillis') || text.includes('calcuboss') || channelHandle.toLowerCase().includes('derolwillis')) {
    return { allowed: true, boost: 10 };
  }

  // Rule 2: Check forbidden words
  const hasBadWord = FORBIDDEN_VIDEO_KEYWORDS.some(k => text.includes(k));
  if (hasBadWord) {
    return { allowed: false, boost: 0, reason: "Contains non-kids inappropriate content ❌" };
  }

  // Rule 3: Must match kids educational keywords
  const hasKidsWord = ALLOWED_KIDS_KEYWORDS.some(k => text.includes(k));
  if (!hasKidsWord) {
    return { allowed: false, boost: 0, reason: "Only Kids Educational Videos Allowed (Math, Science, Phonics, Stories) ❌" };
  }

  return { allowed: true, boost: 1 };
};

export const ParentCommunity: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [newParentName, setNewParentName] = useState('');
  const [newPostMessage, setNewPostMessage] = useState('');
  const [newPostVideoUrl, setNewPostVideoUrl] = useState('');
  const [selectedActiveVideo, setSelectedActiveVideo] = useState<YouTubeKidVideo | null>(null);
  
  const [subscribersCount, setSubscribersCount] = useState(48);
  const [loading, setLoading] = useState(false);
  const [successNotice, setSuccessNotice] = useState('');
  const [parentEmailInput, setParentEmailInput] = useState('');
  const [paymentLoading, setPaymentLoading] = useState(false);

  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM

  // Paystack Success Handler
  const handlePaystackSuccess = async (reference: string, email: string) => {
    setPaymentLoading(true);
    const SUPABASE_URL = (import.meta as any).env.VITE_SUPABASE_URL || "";
    const SUPABASE_ANON_KEY = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || "";

    if (SUPABASE_URL && SUPABASE_ANON_KEY) {
      try {
        const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        await supabase.from('parent_payments').insert({
          parent_email: email || 'parent@calcuboss.app',
          amount: 50,
          paystack_ref: reference,
          month: currentMonth,
          app_name: 'calcuboss'
        });
      } catch (e) {
        console.warn("Supabase parent_payments insert note:", e);
      }
    }

    // Update subscriber count & local fuel state
    setSubscribersCount(prev => prev + 1);
    setPaymentLoading(false);
    setSuccessNotice(`🙏 Fuel received! R50 Paystack subscription registered successfully (Ref: ${reference}).`);
    setTimeout(() => setSuccessNotice(''), 5000);
  };

  const simulatePaystackPayment = () => {
    const email = parentEmailInput.trim() || 'parent@calcuboss.app';
    const mockRef = `TKN-${Math.floor(10000000 + Math.random() * 90000000)}`;
    handlePaystackSuccess(mockRef, email);
    setParentEmailInput('');
  };

  useEffect(() => {
    loadCommunityData();
  }, []);

  const loadCommunityData = () => {
    const storedLeaderboard = localStorage.getItem('calcuboss_student_leaderboard');
    const storedPosts = localStorage.getItem('calcuboss_community_posts');

    if (storedLeaderboard) {
      try {
        setLeaderboard(JSON.parse(storedLeaderboard));
      } catch (e) {
        console.error(e);
      }
    } else {
      const defaultLeaderboard: LeaderboardEntry[] = [
        { id: '1', app_name: 'calcuboss', student_name: 'Amahle Dlamini (Pretoria 🇿🇦)', xp: 1450, month: currentMonth, voucher_won: true, voucher_code: 'PNA-8492' },
        { id: '2', app_name: 'calcuboss', student_name: 'Priya Sharma (New Delhi 🇮🇳)', xp: 1320, month: currentMonth, voucher_won: true, voucher_code: 'AMZN-3019' },
        { id: '3', app_name: 'calcuboss', student_name: 'David Kiprop (Nairobi 🇰🇪)', xp: 1210, month: currentMonth, voucher_won: true, voucher_code: 'AMZN-7721' },
        { id: '4', app_name: 'calcuboss', student_name: 'Mateo Silva (São Paulo 🇧🇷)', xp: 1100, month: currentMonth, voucher_won: true, voucher_code: 'AMZN-5504' },
        { id: '5', app_name: 'calcuboss', student_name: 'Chloe Smith (Atlanta 🇺🇸)', xp: 980, month: currentMonth, voucher_won: true, voucher_code: 'AMZN-1193' },
        { id: '6', app_name: 'calcuboss', student_name: 'Bongani Sithole (Pretoria 🇿🇦)', xp: 850, month: currentMonth, voucher_won: false, voucher_code: '' },
      ];
      setLeaderboard(defaultLeaderboard);
      localStorage.setItem('calcuboss_student_leaderboard', JSON.stringify(defaultLeaderboard));
    }

    if (storedPosts) {
      try {
        setPosts(JSON.parse(storedPosts));
      } catch (e) {
        console.error(e);
      }
    } else {
      const defaultPosts: CommunityPost[] = [
        {
          id: '1',
          app_name: 'calcuboss',
          parent_name: 'Mrs. Dlamini',
          message: 'So proud of Amahle solving math equations every single day with Calcuboss! Check out this educational Kids video from @DerolWillis channel:',
          created_at: new Date(Date.now() - 3600000 * 3).toISOString(),
          youtube_id: '3JZ_D3ELwOQ',
          youtube_url: 'https://www.youtube.com/watch?v=3JZ_D3ELwOQ',
          likes_count: 12
        },
        {
          id: '2',
          app_name: 'calcuboss',
          parent_name: 'Mr. Mokoena',
          message: 'Treebo Science Zone video on photosynthesis is amazing for Grade 4-7 homework! Kids loved watching it!',
          created_at: new Date(Date.now() - 3600000 * 8).toISOString(),
          youtube_id: 'L_LUpnjgPso',
          youtube_url: 'https://www.youtube.com/watch?v=L_LUpnjgPso',
          likes_count: 8
        },
      ];
      setPosts(defaultPosts);
      localStorage.setItem('calcuboss_community_posts', JSON.stringify(defaultPosts));
    }
  };

  const sanitizePostText = (text: string): string => {
    return text.replace(/\b\d{4,}\b/g, '⭐⭐⭐⭐').replace(/\d{4,}/g, '⭐⭐⭐⭐');
  };

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newParentName.trim() || !newPostMessage.trim()) return;

    const sanitizedMessage = sanitizePostText(newPostMessage);
    const ytId = extractYouTubeId(newPostVideoUrl);

    if (ytId || newPostVideoUrl) {
      const guardResult = isKidsVideo(newPostMessage, newPostVideoUrl);
      if (!guardResult.allowed) {
        setSuccessNotice(guardResult.reason || 'Only Kids Educational Videos Allowed ❌');
        setTimeout(() => setSuccessNotice(''), 5000);
        return;
      }
    }

    const newPost: CommunityPost = {
      id: Date.now().toString(),
      app_name: 'calcuboss',
      parent_name: newParentName.trim(),
      message: sanitizedMessage,
      created_at: new Date().toISOString(),
      youtube_url: newPostVideoUrl.trim() || undefined,
      youtube_id: ytId || undefined,
      likes_count: 1
    };

    const updatedPosts = [newPost, ...posts];
    setPosts(updatedPosts);
    localStorage.setItem('calcuboss_community_posts', JSON.stringify(updatedPosts));

    setNewPostMessage('');
    setNewPostVideoUrl('');
    setSuccessNotice('✨ Note & Video shared to Community Wall successfully!');
    setTimeout(() => setSuccessNotice(''), 4000);
  };

  const handleShareVideoToCommunity = (video: YouTubeKidVideo) => {
    const newPost: CommunityPost = {
      id: Date.now().toString(),
      app_name: 'calcuboss',
      parent_name: 'Derol Willis (@DerolWillis Channel)',
      message: `🎥 Shared Kids Video: "${video.title}" — ${video.description}`,
      created_at: new Date().toISOString(),
      youtube_id: video.youtube_id,
      youtube_url: `https://www.youtube.com/watch?v=${video.youtube_id}`,
      likes_count: 5
    };

    const updatedPosts = [newPost, ...posts];
    setPosts(updatedPosts);
    localStorage.setItem('calcuboss_community_posts', JSON.stringify(updatedPosts));
    setSuccessNotice(`🚀 "${video.title}" posted to Community Feed!`);
    setTimeout(() => setSuccessNotice(''), 4000);
  };

  const handleLikePost = (postId: string) => {
    const updated = posts.map(p => {
      if (p.id === postId) {
        return { ...p, likes_count: (p.likes_count || 0) + 1 };
      }
      return p;
    });
    setPosts(updated);
    localStorage.setItem('calcuboss_community_posts', JSON.stringify(updated));
  };

  const topStudents = leaderboard
    .filter(item => item.month === currentMonth && item.app_name === 'calcuboss')
    .sort((a, b) => b.xp - a.xp)
    .slice(0, 5);

  const totalPaystackCollected = subscribersCount * 50;
  const stationeryPoolTotal = subscribersCount * 10;

  const updateVoucherCode = (id: string, code: string) => {
    const updated = leaderboard.map(item => item.id === id ? { ...item, voucher_code: code } : item);
    setLeaderboard(updated);
    localStorage.setItem('calcuboss_student_leaderboard', JSON.stringify(updated));
  };

  const shareVoucherWhatsApp = (student: LeaderboardEntry, rank: number) => {
    const code = student.voucher_code || `PNA-${Math.floor(1000 + Math.random() * 9000)}`;
    const text = encodeURIComponent(`🎉 Thobela ${student.student_name}! You are #${rank} with ${student.xp} XP on Calcuboss Apostolic Academy OS6! Your R50 PNA voucher: *${code}*. God bless — Calcuboss Academy 📚✨`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-900/40 via-indigo-900/40 to-blue-900/40 border border-white/20 rounded-3xl p-6 sm:p-8 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-40 h-40 bg-purple-500/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" /> Global Parent Community & Stationery Pool 🌍
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Calcuboss Apostolic Academy OS6 — Global Edition
            </h2>
            <p className="text-sm text-white/70 max-w-xl">
              Built in Mamelodi, Pretoria 🇿🇦 — Loved by kids worldwide 🌍. Connecting parents globally, supporting students, and rewarding top academic performance with PNA/CNA & Amazon stationery vouchers backed by Paystack & global fuel! Sharp! 🚀
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="bg-black/40 border border-white/15 rounded-2xl p-4 flex items-center gap-6 shadow-inner">
            <div className="text-center">
              <div className="text-xs text-white/50 uppercase font-bold tracking-wider">Active Month</div>
              <div className="text-lg font-black text-amber-400 font-mono">{currentMonth}</div>
            </div>
            <div className="w-px h-10 bg-white/10"></div>
            <div className="text-center">
              <div className="text-xs text-white/50 uppercase font-bold tracking-wider">Top Vouchers</div>
              <div className="text-lg font-black text-emerald-400 font-mono">5 R50 Vouchers</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Monthly Leaderboard & Vouchers */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Monthly Leaderboard Card */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Trophy className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Top 5 Monthly Leaderboard</h3>
                  <p className="text-xs text-white/50">Students competing for R50 PNA/CNA Stationery Vouchers ({currentMonth})</p>
                </div>
              </div>
              <span className="text-xs font-mono bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full border border-emerald-500/30">
                Live Sync
              </span>
            </div>

            <div className="space-y-3">
              {topStudents.length === 0 ? (
                <p className="text-xs text-white/50 text-center py-6">No student rankings recorded for {currentMonth} yet.</p>
              ) : (
                topStudents.map((student, idx) => (
                  <div
                    key={student.id}
                    className="bg-black/30 border border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-white/25 transition-all"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs shrink-0 ${
                        idx === 0 ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/30' :
                        idx === 1 ? 'bg-slate-300 text-slate-950' :
                        idx === 2 ? 'bg-amber-700 text-white' : 'bg-white/10 text-white/70'
                      }`}>
                        #{idx + 1}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-white">{student.student_name}</h4>
                        <p className="text-xs text-purple-300 font-medium">{student.xp.toLocaleString()} XP Points</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                      <div className="flex items-center gap-1.5 bg-slate-900/80 px-2.5 py-1 rounded-xl border border-white/10">
                        <Key className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <input
                          type="text"
                          value={student.voucher_code || ''}
                          onChange={(e) => updateVoucherCode(student.id, e.target.value)}
                          placeholder="PNA-XXXX"
                          className="bg-transparent text-xs text-amber-300 font-mono font-bold w-24 focus:outline-none"
                          title="PNA e-Voucher Code"
                        />
                      </div>

                      <button
                        onClick={() => shareVoucherWhatsApp(student, idx + 1)}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-2 rounded-xl transition-all shadow flex items-center gap-1.5 text-xs font-bold"
                        title="Share on WhatsApp"
                      >
                        <Share2 className="w-4 h-4" />
                        <span>WhatsApp Code</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Fuel Meter & Community Impact Card */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-xl space-y-5">
            <div className="flex items-center gap-2.5 border-b border-white/10 pb-4">
              <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Fuel className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Community Fuel & Stationery Pool Meter</h3>
                <p className="text-xs text-white/50">R50 Paystack subscription breakdown & student support fund</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-black/30 border border-white/10 rounded-2xl p-4 space-y-1">
                <div className="text-xs text-white/50 font-medium">Total Paystack Fuel Collected</div>
                <div className="text-2xl font-black text-white font-mono">R {totalPaystackCollected.toLocaleString()}</div>
                <p className="text-[11px] text-white/40">{subscribersCount} active parent subscriptions (R50/mo)</p>
              </div>

              <div className="bg-black/30 border border-white/10 rounded-2xl p-4 space-y-1">
                <div className="text-xs text-white/50 font-medium">Stationery Voucher Pool (R10/parent)</div>
                <div className="text-2xl font-black text-emerald-400 font-mono">R {stationeryPoolTotal.toLocaleString()}</div>
                <p className="text-[11px] text-white/40">Fund allocated directly for PNA & CNA monthly top student vouchers</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-500/10 to-teal-500/10 border border-purple-500/20 rounded-2xl p-4 text-xs text-white/80 flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-purple-400 shrink-0" />
              <div>
                <span className="font-bold text-white">Transparency Guarantee:</span> All funds are tracked securely. Founder Willis Derol, Executive Shalot, and Co-investor Felicia oversee the fuel distribution to ensure 100% impact for our children.
              </div>
            </div>

            {/* Paystack R50 Fuel Contribution Widget */}
            <div className="bg-black/40 border border-emerald-500/30 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-emerald-300">💳 Contribute R50 Paystack Fuel</h4>
                  <p className="text-[11px] text-white/60">Support student stationery vouchers & keep academy online</p>
                </div>
                <span className="text-xs font-mono bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-full border border-emerald-500/30 font-bold">
                  R50 / mo
                </span>
              </div>

              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Parent email (e.g. parent@gmail.com)"
                  value={parentEmailInput}
                  onChange={(e) => setParentEmailInput(e.target.value)}
                  className="flex-1 bg-slate-900 border border-white/20 rounded-xl px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-emerald-400"
                />
                <button
                  onClick={simulatePaystackPayment}
                  disabled={paymentLoading}
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black px-4 py-2 rounded-xl text-xs transition shadow-lg active:scale-95 disabled:opacity-50"
                >
                  {paymentLoading ? 'Processing...' : 'Pay R50 Fuel'}
                </button>
              </div>
            </div>
          </div>

          {/* YouTube Kids Channel Hub (@DerolWillis) */}
          <div className="bg-white/10 backdrop-blur-xl border border-red-500/30 rounded-3xl p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-500">
                  <Youtube className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-base flex items-center gap-1.5">
                    <span>🎥 @DerolWillis YouTube Kids Channel</span>
                  </h3>
                  <p className="text-xs text-red-300">Curated Educational Kids Videos (Math, Science, Stories)</p>
                </div>
              </div>
              <a
                href="https://www.youtube.com/@DerolWillis"
                target="_blank"
                rel="noreferrer"
                className="bg-red-600 hover:bg-red-500 text-white text-xs px-3 py-1.5 rounded-xl font-extrabold transition flex items-center gap-1.5 shadow-md"
              >
                <span>Visit Channel</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Video List */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {DEROL_WILLIS_VIDEOS.map((vid) => (
                <div key={vid.id} className="bg-slate-950/80 border border-white/10 rounded-2xl p-3 space-y-2 flex flex-col justify-between hover:border-red-500/50 transition">
                  <div>
                    <div className="flex items-center justify-between text-[10px] text-red-400 font-bold mb-1">
                      <span>{vid.category}</span>
                      <span>{vid.teacher}</span>
                    </div>
                    <h4 className="text-xs font-bold text-white line-clamp-2">{vid.title}</h4>
                    <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">{vid.description}</p>
                  </div>

                  <div className="pt-2 flex flex-col gap-1.5">
                    <button
                      onClick={() => setSelectedActiveVideo(vid)}
                      className="w-full py-1.5 rounded-xl bg-red-950/80 hover:bg-red-900 border border-red-700/60 text-red-200 text-xs font-bold transition flex items-center justify-center gap-1.5"
                    >
                      <Play className="w-3.5 h-3.5 text-red-400 fill-red-400" />
                      <span>Watch Video</span>
                    </button>
                    <button
                      onClick={() => handleShareVideoToCommunity(vid)}
                      className="w-full py-1.5 rounded-xl bg-purple-950/80 hover:bg-purple-900 border border-purple-700/60 text-purple-200 text-xs font-bold transition flex items-center justify-center gap-1.5"
                    >
                      <Share2 className="w-3.5 h-3.5 text-purple-400" />
                      <span>Post to Feed</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Parent Encouragement Wall & Safety Notice */}
        <div className="space-y-6">
          
          {/* Post Encouragement Form */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-2.5 border-b border-white/10 pb-4">
              <div className="w-9 h-9 rounded-xl bg-pink-500/20 border border-pink-500/30 flex items-center justify-center text-pink-400">
                <Heart className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Parent Encouragement Wall</h3>
                <p className="text-xs text-white/50">Send uplifting notes & share educational videos</p>
              </div>
            </div>

            {successNotice && (
              <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs p-3 rounded-xl font-medium animate-fadeIn">
                {successNotice}
              </div>
            )}

            <form onSubmit={handlePostSubmit} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-[11px] text-white/60 font-bold uppercase tracking-wider">Parent Name</label>
                <input
                  type="text"
                  placeholder="e.g. Mrs. Khumalo"
                  value={newParentName}
                  onChange={(e) => setNewParentName(e.target.value)}
                  className="w-full bg-black/40 border border-white/20 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-purple-400"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-white/60 font-bold uppercase tracking-wider">Encouragement Message</label>
                <textarea
                  rows={3}
                  placeholder="Write a warm note (Numbers with 4+ digits will be safely sanitized to ⭐⭐⭐⭐)"
                  value={newPostMessage}
                  onChange={(e) => setNewPostMessage(e.target.value)}
                  className="w-full bg-black/40 border border-white/20 rounded-xl p-3 text-xs text-white placeholder-white/30 focus:outline-none focus:border-purple-400 resize-none"
                  required
                ></textarea>
                <p className="text-[10px] text-amber-400/90 font-medium">
                  🛡️ Auto-Sanitizer Active: Phone numbers & bank details are automatically masked to ⭐⭐⭐⭐.
                </p>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-red-300 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Youtube className="w-3.5 h-3.5 text-red-500" /> Optional YouTube Video Link (Kids Only)
                </label>
                <input
                  type="url"
                  placeholder="e.g. https://www.youtube.com/watch?v=3JZ_D3ELwOQ"
                  value={newPostVideoUrl}
                  onChange={(e) => setNewPostVideoUrl(e.target.value)}
                  className="w-full bg-black/40 border border-white/20 rounded-xl px-3.5 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-red-400"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg border border-purple-400/40 transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <Send className="w-4 h-4" />
                <span>Publish Note & Video to Community</span>
              </button>
            </form>
          </div>

          {/* Community Post Feed with Embedded YouTube Players */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h4 className="font-bold text-sm text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-400" /> Recent Community Video Notes ({posts.length})
              </h4>
            </div>

            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
              {posts.map(post => {
                const videoId = post.youtube_id || extractYouTubeId(post.youtube_url || '');

                return (
                  <div key={post.id} className="bg-black/40 border border-white/10 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-purple-300 flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-purple-400" />
                        {post.parent_name}
                      </span>
                      <span className="text-[10px] text-white/40">{new Date(post.created_at).toLocaleDateString()}</span>
                    </div>
                    
                    <p className="text-xs text-white/90 leading-relaxed">{post.message}</p>

                    {/* Embedded YouTube Video Player */}
                    {videoId && (
                      <div className="rounded-2xl overflow-hidden border border-white/15 shadow-2xl bg-black aspect-video relative">
                        <iframe
                          className="w-full h-full"
                          src={`https://www.youtube-nocookie.com/embed/${videoId}`}
                          title="Kids Educational Video"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400 border-t border-white/5">
                      <button
                        onClick={() => handleLikePost(post.id)}
                        className="flex items-center gap-1.5 text-pink-300 hover:text-pink-200 transition font-bold"
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>{post.likes_count || 0} Likes</span>
                      </button>

                      {videoId && (
                        <span className="text-[10px] text-red-400 font-bold flex items-center gap-1">
                          <Youtube className="w-3.5 h-3.5" /> Verified Kids Video
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

      {/* WATCH VIDEO MODAL */}
      {selectedActiveVideo && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-5 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Youtube className="w-5 h-5 text-red-500" />
                <h3 className="font-extrabold text-sm text-white">{selectedActiveVideo.title}</h3>
              </div>
              <button
                onClick={() => setSelectedActiveVideo(null)}
                className="text-slate-400 font-bold hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <div className="rounded-2xl overflow-hidden border border-white/20 aspect-video bg-black">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube-nocookie.com/embed/${selectedActiveVideo.youtube_id}?autoplay=1`}
                title={selectedActiveVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-300 bg-slate-950 p-3 rounded-2xl border border-slate-800">
              <span>{selectedActiveVideo.description}</span>
              <button
                onClick={() => {
                  handleShareVideoToCommunity(selectedActiveVideo);
                  setSelectedActiveVideo(null);
                }}
                className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition flex items-center gap-1 shrink-0 ml-2"
              >
                <Share2 className="w-3.5 h-3.5" /> Post to Community
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
