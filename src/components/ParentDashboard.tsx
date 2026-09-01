import React, { useEffect, useState } from 'react';
import { CacheStats } from '../types';
import { PaystackPricingModal, PaystackPlan } from './PaystackPricingModal';
import { 
  Zap, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Database, 
  Award, 
  ShieldCheck, 
  RefreshCw, 
  CheckCircle2,
  Gift,
  Trophy,
  Sparkles,
  Plus,
  Trash2,
  Clock,
  Star
} from 'lucide-react';

interface RewardEarned {
  id: string;
  title: string;
  description: string;
  date: string;
  xpEarned: number;
  icon: 'trophy' | 'zap' | 'gift' | 'shield';
  status: 'claimed' | 'pending';
  voucherCode?: string;
}

interface CustomReward {
  id: string;
  title: string;
  xpRequired: number;
  description: string;
  claimed: boolean;
}

interface ParentDashboardProps {
  isFounderMode?: boolean;
  onOpenFounderPinModal?: () => void;
  onLockFounderMode?: () => void;
}

export const ParentDashboard: React.FC<ParentDashboardProps> = ({
  isFounderMode = false,
  onOpenFounderPinModal,
  onLockFounderMode
}) => {
  const [stats, setStats] = useState<CacheStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Child Learning Progress & Rewards States
  const [childProfile, setChildProfile] = useState<{ name: string; grade: string; email: string }>({
    name: 'Amahle Dlamini',
    grade: 'Grade 7',
    email: 'student@schoolkids.ai'
  });
  const [childLeaderboardInfo, setChildLeaderboardInfo] = useState<{ student_name: string; xp: number; voucher_won: boolean; voucher_code?: string }>({
    student_name: 'Amahle Dlamini (Pretoria 🇿🇦)',
    xp: 1450,
    voucher_won: true,
    voucher_code: 'PNA-8492'
  });
  const [rewards, setRewards] = useState<RewardEarned[]>([]);
  const [customRewards, setCustomRewards] = useState<CustomReward[]>([]);
  
  // Custom Reward Form Input States
  const [newRewardTitle, setNewRewardTitle] = useState('');
  const [newRewardXp, setNewRewardXp] = useState(1500);
  const [newRewardDesc, setNewRewardDesc] = useState('');

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/stats');
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadChildProgress = () => {
    // 1. Profile
    const profileStr = localStorage.getItem('calcuboss_user_profile');
    let prof = { name: 'Amahle Dlamini', grade: 'Grade 7', email: 'student@schoolkids.ai' };
    if (profileStr) {
      try {
        const parsed = JSON.parse(profileStr);
        if (parsed.name) {
          prof = {
            name: parsed.name,
            grade: parsed.grade || 'Grade 7',
            email: parsed.email || 'student@schoolkids.ai'
          };
        }
      } catch (e) {}
    }
    setChildProfile(prof);

    // 2. Leaderboard & XP
    const leaderboardStr = localStorage.getItem('calcuboss_student_leaderboard');
    let localLeaderboard = null;
    if (leaderboardStr) {
      try {
        const parsedList = JSON.parse(leaderboardStr);
        localLeaderboard = parsedList.find((entry: any) => 
          entry.student_name.toLowerCase().includes(prof.name.toLowerCase()) || 
          entry.student_name.toLowerCase().includes('amahle')
        ) || parsedList[0];
      } catch (e) {}
    }
    
    if (!localLeaderboard) {
      localLeaderboard = { 
        student_name: `${prof.name} (Pretoria 🇿🇦)`, 
        xp: 1450, 
        voucher_won: true, 
        voucher_code: 'PNA-8492' 
      };
    }
    setChildLeaderboardInfo(localLeaderboard);

    // 3. Set standard reward milestones based on child performance
    const defaultRewards: RewardEarned[] = [
      {
        id: 'r1',
        title: 'Math Puzzle Master 🧮',
        description: 'Successfully solved and placed all grid tiles on the 3x3 Sound Puzzle.',
        date: 'Today',
        xpEarned: 350,
        icon: 'trophy',
        status: 'claimed'
      },
      {
        id: 'r2',
        title: 'Taxi Math Hero 🚕',
        description: 'Completed 5 perfect fare calculations in a row with Calcuboss AI.',
        date: 'Yesterday',
        xpEarned: 200,
        icon: 'zap',
        status: 'claimed'
      },
      {
        id: 'r3',
        title: 'R50 Stationery Voucher 🎁',
        description: 'Pretoria Apostolic Academy special achievement reward.',
        date: '2 days ago',
        xpEarned: 500,
        icon: 'gift',
        status: localLeaderboard.voucher_won ? 'pending' : 'claimed',
        voucherCode: localLeaderboard.voucher_code || 'PNA-8492'
      },
      {
        id: 'r4',
        title: 'Nova Guard Certified 🛡️',
        description: 'Completed safe YouTube Kids screening with Ms Nova Safety Teacher.',
        date: '3 days ago',
        xpEarned: 150,
        icon: 'shield',
        status: 'claimed'
      }
    ];
    setRewards(defaultRewards);

    // 4. Custom rewards setup
    const customStr = localStorage.getItem('calcuboss_parent_custom_rewards');
    if (customStr) {
      try {
        setCustomRewards(JSON.parse(customStr));
      } catch (e) {}
    } else {
      const defaultCustom: CustomReward[] = [
        { id: 'c1', title: '30 Minutes Tablet Play Time 🎮', xpRequired: 1500, description: 'Weekend gaming privilege reward.', claimed: false },
        { id: 'c2', title: 'R20 Pocket Money / Airtime 💵', xpRequired: 2000, description: 'Savings reward for continuous high score math.', claimed: false }
      ];
      setCustomRewards(defaultCustom);
      localStorage.setItem('calcuboss_parent_custom_rewards', JSON.stringify(defaultCustom));
    }
  };

  useEffect(() => {
    fetchStats();
    loadChildProgress();
  }, []);

  const handleSimulateSubscription = async () => {
    setSubscribing(true);
    try {
      const res = await fetch('/api/subscribe', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg('🎉 New parent subscription added successfully!');
        fetchStats();
        setTimeout(() => setSuccessMsg(''), 4000);
      }
    } catch (err) {
      console.error('Subscription error:', err);
    } finally {
      setSubscribing(false);
    }
  };

  const [showPricingModal, setShowPricingModal] = useState(false);

  const handleOpenPaystackModal = () => {
    setShowPricingModal(true);
  };

  const handlePlanPurchased = (plan: PaystackPlan) => {
    setSuccessMsg(`🎉 Successfully subscribed to ${plan.name} (R${plan.priceZar})!`);
    fetchStats();
    setTimeout(() => setSuccessMsg(''), 5000);
  };

  const handleAddCustomReward = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRewardTitle.trim()) return;
    
    const newRew: CustomReward = {
      id: 'custom_' + Date.now(),
      title: newRewardTitle.trim(),
      xpRequired: newRewardXp,
      description: newRewardDesc.trim(),
      claimed: false
    };

    const updated = [...customRewards, newRew];
    setCustomRewards(updated);
    localStorage.setItem('calcuboss_parent_custom_rewards', JSON.stringify(updated));
    setNewRewardTitle('');
    setNewRewardDesc('');
    setSuccessMsg('🏆 Custom child reward milestone added successfully!');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleToggleCustomClaim = (id: string) => {
    const updated = customRewards.map(r => r.id === id ? { ...r, claimed: !r.claimed } : r);
    setCustomRewards(updated);
    localStorage.setItem('calcuboss_parent_custom_rewards', JSON.stringify(updated));
  };

  const handleDeleteCustomReward = (id: string) => {
    const updated = customRewards.filter(r => r.id !== id);
    setCustomRewards(updated);
    localStorage.setItem('calcuboss_parent_custom_rewards', JSON.stringify(updated));
  };

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-semibold text-slate-400">Loading Stats & Learning Engine...</p>
        </div>
      </div>
    );
  }

  // ==========================================
  // STUDENT MODE VIEW (NO REVENUE / NO PROFIT)
  // ==========================================
  if (!isFounderMode) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-4 space-y-5 animate-fadeIn">
        {/* Student Header & XP Banner */}
        <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 border border-indigo-800/60 rounded-3xl p-5 md:p-6 shadow-xl relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-3 py-0.5 rounded-full text-[10px] font-black">
                <Sparkles className="w-3 h-3 text-amber-400" /> STUDENT MASTERY & XP HUB
              </div>
              <h2 className="text-xl md:text-2xl font-black text-white">
                {childProfile.name} • <span className="text-indigo-400">{childProfile.grade}</span>
              </h2>
              <p className="text-xs text-slate-300">
                Track your homework solving streaks, earned XP badges and fun unlocked privileges!
              </p>
            </div>

            {/* Total XP Badge */}
            <div className="bg-slate-950/80 border border-amber-500/40 rounded-2xl p-3 px-5 flex items-center gap-3 shrink-0 shadow-lg">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center border border-amber-500/40 text-xl">
                ⭐
              </div>
              <div>
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-amber-300/80">TOTAL SCORE</div>
                <div className="text-2xl font-black text-amber-300 font-mono">1772 XP</div>
              </div>
            </div>
          </div>

          {/* Quick Learning Stats Row */}
          <div className="grid grid-cols-3 gap-2.5 mt-4 pt-4 border-t border-indigo-900/60 text-center">
            <div className="p-2.5 bg-slate-950/50 rounded-xl border border-slate-800">
              <div className="text-[10px] font-bold text-slate-400">🔥 Day Streak</div>
              <div className="text-sm font-black text-amber-400">5 Days Active</div>
            </div>
            <div className="p-2.5 bg-slate-950/50 rounded-xl border border-slate-800">
              <div className="text-[10px] font-bold text-slate-400">🎯 Math Accuracy</div>
              <div className="text-sm font-black text-emerald-400">96.4% Correct</div>
            </div>
            <div className="p-2.5 bg-slate-950/50 rounded-xl border border-slate-800">
              <div className="text-[10px] font-bold text-slate-400">🏆 Pretoria Rank</div>
              <div className="text-sm font-black text-purple-400">Top 5% Gold</div>
            </div>
          </div>
        </div>

        {/* Learning Milestones & Earned Badges */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 text-white space-y-4 shadow-md">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Recent Learning Badges Earned</span>
            </h3>
            <span className="text-[10px] text-slate-400">4 Milestones Completed</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {rewards.map((reward) => (
              <div 
                key={reward.id} 
                className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition flex items-start gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center justify-center shrink-0 text-lg">
                  {reward.icon === 'trophy' && '🧮'}
                  {reward.icon === 'zap' && '🚕'}
                  {reward.icon === 'gift' && '🎁'}
                  {reward.icon === 'shield' && '🛡️'}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between items-start gap-1">
                    <h4 className="font-extrabold text-xs text-white leading-tight">{reward.title}</h4>
                    <span className="text-[10px] font-black bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-md shrink-0">
                      +{reward.xpEarned} XP
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-relaxed">{reward.description}</p>
                  {reward.voucherCode && (
                    <div className="mt-1.5 flex items-center gap-1.5">
                      <span className="text-[9px] font-bold text-amber-400">Achievement Code:</span>
                      <code className="bg-slate-900 px-2 py-0.5 rounded text-[10px] font-mono text-emerald-300 border border-slate-700">
                        {reward.voucherCode}
                      </code>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Student Goal Milestones */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 text-white space-y-3 shadow-md">
          <h3 className="font-extrabold text-sm text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Gift className="w-4 h-4 text-pink-400" />
            <span>Unlocked Goals & Real-Life Privileges</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {customRewards.map((item) => {
              const isLocked = childLeaderboardInfo.xp < item.xpRequired;
              return (
                <div 
                  key={item.id} 
                  className={`p-3.5 rounded-2xl border transition-all ${
                    item.claimed 
                      ? 'bg-emerald-950/30 border-emerald-700/50 opacity-80' 
                      : 'bg-slate-950/70 border-slate-800'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <h4 className="font-extrabold text-xs text-white">{item.title}</h4>
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                      isLocked ? 'bg-amber-950 text-amber-400 border border-amber-800' : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    }`}>
                      {isLocked ? `Need ${item.xpRequired} XP` : '✓ Unlocked!'}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Founder Portal Entry Bar (Subtle & Protected) */}
        <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-2xl flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span className="text-[11px] font-bold text-slate-300">Founder & Parent Executive Portal</span>
          </div>
          <button
            onClick={onOpenFounderPinModal}
            className="text-[10px] font-extrabold bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/40 px-3 py-1.5 rounded-xl transition flex items-center gap-1"
          >
            <span>🔐 Enter PIN</span>
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // FOUNDER MODE VIEW (REVENUE, CACHING & FUEL)
  // ==========================================
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-6 animate-fadeIn">
      
      {/* Founder Top Banner with Lock Button */}
      <div className="bg-gradient-to-r from-amber-950/90 via-slate-900 to-slate-900 border-2 border-amber-500/40 text-white rounded-3xl p-5 md:p-7 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 px-3 py-0.5 rounded-full text-xs font-black">
                👑 FOUNDER MODE UNLOCKED
              </span>
              <span className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                <Zap className="w-3 h-3 text-emerald-400" /> Question Caching & OpenRouter Strategy
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-black tracking-tight text-white">
              Parent Monetization & AI Fuel Optimizer
            </h2>
            <p className="text-slate-300 text-xs mt-1 leading-relaxed">
              By caching identical homework questions across students, 80%+ of queries cost R0.00 in AI fuel. Parents pay R50–R150/month for unlimited safe homework help while you keep a 99.6% profit margin!
            </p>
          </div>

          <button
            onClick={onLockFounderMode}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 text-xs font-bold transition flex items-center gap-1.5 shrink-0"
          >
            <span>🔒 Lock to Student Mode</span>
          </button>
        </div>

        <div className="mt-5 flex flex-wrap gap-3 relative z-10">
          <button
            onClick={handleOpenPaystackModal}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-slate-950 font-black px-4 py-2 rounded-xl text-xs shadow-lg transition flex items-center gap-2 border border-emerald-400 active:scale-95"
          >
            <DollarSign className="w-4 h-4 text-slate-950" />
            <span>💳 Paystack Plans (R50 • R150 • R200)</span>
          </button>
          <button
            onClick={handleSimulateSubscription}
            disabled={subscribing}
            className="bg-slate-800 hover:bg-slate-750 text-white font-bold px-3.5 py-2 rounded-xl text-xs transition flex items-center gap-2 border border-slate-700"
          >
            <Users className="w-3.5 h-3.5 text-indigo-300" />
            <span>Simulate New Subscriber</span>
          </button>
          <button
            onClick={fetchStats}
            className="bg-slate-800 hover:bg-slate-750 text-white font-bold px-3.5 py-2 rounded-xl text-xs transition flex items-center gap-2 border border-slate-700"
          >
            <RefreshCw className="w-3.5 h-3.5 text-sky-300" />
            <span>Refresh Stats</span>
          </button>
        </div>

        {successMsg && (
          <div className="mt-3 bg-emerald-500 text-slate-950 text-xs font-black px-3.5 py-1.5 rounded-xl flex items-center gap-2 w-fit animate-bounce shadow-md">
            <CheckCircle2 className="w-4 h-4" /> {successMsg}
          </div>
        )}
      </div>

      {/* 3-Tier Paystack Pricing Modal */}
      <PaystackPricingModal
        isOpen={showPricingModal}
        onClose={() => setShowPricingModal(false)}
        userEmail={childProfile.email || 'willisderol@gmail.com'}
        onSuccess={handlePlanPurchased}
      />

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Monthly Revenue */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Monthly Revenue</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-white font-mono">R {stats.totalRevenue.toLocaleString()}</span>
            <span className="text-[10px] font-bold text-emerald-400 font-mono">({stats.subscriberCount} parents)</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">At R50/month base subscription</p>
        </div>

        {/* Metric 2: Net Profit */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Estimated Net Profit</span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-purple-300 font-mono">R {stats.netProfit}</span>
            <span className="text-[10px] font-bold text-emerald-300">99.6% Margin</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">After deducting AI token fuel costs</p>
        </div>

        {/* Metric 3: Cache Hit Rate */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Cache Hit Rate</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-white font-mono">{stats.cacheHitRate}%</span>
            <span className="text-[10px] font-bold text-amber-400 font-mono">{stats.savedQueries} saved</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Identical questions served instantly</p>
        </div>

        {/* Metric 4: AI Fuel Cost */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">AI Fuel Cost</span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
              <Database className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-white font-mono">R {stats.aiFuelCost}</span>
            <span className="text-[10px] font-bold text-rose-400 font-mono">vs R{stats.costWithoutCache}</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Powered by OpenRouter / Gemini Flash Lite</p>
        </div>

      </div>

      {/* Caching Architecture Explanation Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 md:p-6 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2 p-3 bg-slate-950/60 rounded-2xl border border-slate-800/80">
          <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center justify-center font-black text-xs">1</div>
          <h3 className="font-extrabold text-white text-xs">Question Normalization</h3>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            When any student asks &quot;What is photosynthesis?&quot; or &quot;what is 12 + 7?&quot;, the server normalizes the query (lowercase, trimmed).
          </p>
        </div>
        <div className="space-y-2 p-3 bg-slate-950/60 rounded-2xl border border-slate-800/80">
          <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center justify-center font-black text-xs">2</div>
          <h3 className="font-extrabold text-white text-xs">Instant Cache Check</h3>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            The system checks Supabase / memory cache. If cached, the answer is returned instantly with zero OpenRouter credit usage!
          </p>
        </div>
        <div className="space-y-2 p-3 bg-slate-950/60 rounded-2xl border border-slate-800/80">
          <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center justify-center font-black text-xs">3</div>
          <h3 className="font-extrabold text-white text-xs">Maximized Profit</h3>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            1,000 kids asking the same 100 questions results in paying for AI only once. You keep 99.6% of subscription revenue.
          </p>
        </div>
      </div>

      {/* FOUNDER AI MODEL REGISTRY & LLAMA 4 SCOUT ROUTER */}
      <div className="bg-slate-900/90 border border-amber-500/40 rounded-3xl p-5 md:p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">🤖</span>
            <div>
              <h3 className="font-black text-white text-sm flex items-center gap-2">
                <span>AI Model Registry & School Homework Router</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  R-12 CAPS School Only
                </span>
              </h3>
              <p className="text-xs text-slate-400">Multi-Model routing dynamically tuned for South African Grade R to 12 School Homework</p>
            </div>
          </div>
          <span className="text-[11px] font-mono bg-amber-500/10 text-amber-300 px-3 py-1 rounded-xl border border-amber-500/30 font-bold self-start">
            5 School Models Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Model 1: Llama 4 Scout (Grade 8-12 Senior School & Matric) */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-950/40 via-slate-950 to-slate-900 border border-amber-500/50 space-y-2 relative overflow-hidden">
            <div className="absolute top-2 right-2">
              <span className="text-[9px] font-black bg-amber-500 text-slate-950 px-2 py-0.5 rounded-full uppercase tracking-wider shadow">
                ★ GRADE 8-12 (MATRIC) ONLY
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">🦙</span>
              <div>
                <h4 className="font-black text-white text-xs">Llama 4 Scout 17B 16E Instruct</h4>
                <p className="text-[10px] text-amber-300 font-mono">Groq • 17B Active / 109B MoE • Vision (Textbook Photos)</p>
              </div>
            </div>
            <div className="text-[11px] text-slate-300 space-y-1">
              <p className="flex justify-between text-[10px]">
                <span className="text-slate-400">Target School Grades:</span>
                <span className="font-bold text-amber-300">Grade 8, 9, 10, 11, 12 (Matric)</span>
              </p>
              <p className="flex justify-between text-[10px]">
                <span className="text-slate-400">School Subjects:</span>
                <span className="font-medium text-slate-200">Maths, Physical Science, Coding & Robotics, English, Life Sciences</span>
              </p>
              <p className="flex justify-between text-[10px]">
                <span className="text-slate-400">Pricing / M Tokens:</span>
                <span className="font-mono text-emerald-400">$0.11 Input / $0.34 Output (Most Affordable Llama 4)</span>
              </p>
              <p className="flex justify-between text-[10px]">
                <span className="text-slate-400">Fallback Model:</span>
                <span className="font-mono text-slate-300">llama-3.2-3b-instruct</span>
              </p>
            </div>
          </div>

          {/* Model 2: Gemini 2.5 Flash Lite */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-blue-500/40 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">✨</span>
                <div>
                  <h4 className="font-black text-white text-xs">Gemini 2.5 Flash Lite</h4>
                  <p className="text-[10px] text-blue-300 font-mono">Google DeepMind • 8B Dense</p>
                </div>
              </div>
              <span className="text-[9px] font-bold bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full border border-blue-500/30">
                Grade R-7 Primary
              </span>
            </div>
            <div className="text-[11px] text-slate-300 space-y-1">
              <p className="flex justify-between text-[10px]">
                <span className="text-slate-400">Target Grades:</span>
                <span className="font-bold text-blue-300">Grade R, 1, 2, 3, 4, 5, 6, 7</span>
              </p>
              <p className="flex justify-between text-[10px]">
                <span className="text-slate-400">Quota / Strategy:</span>
                <span className="font-medium text-slate-200">100 free calls/day + Hash Cache</span>
              </p>
              <p className="flex justify-between text-[10px]">
                <span className="text-slate-400">Pricing / M Tokens:</span>
                <span className="font-mono text-emerald-400">$0.075 In / $0.30 Out</span>
              </p>
            </div>
          </div>

          {/* Model 3: Llama 3.2 3B Instruct */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">🛡️</span>
                <div>
                  <h4 className="font-black text-white text-xs">Llama 3.2 3B Instruct</h4>
                  <p className="text-[10px] text-slate-400 font-mono">Meta • Compact 3B Dense</p>
                </div>
              </div>
              <span className="text-[9px] font-bold bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full">
                Cheap Fallback
              </span>
            </div>
            <div className="text-[11px] text-slate-300 space-y-1">
              <p className="flex justify-between text-[10px]">
                <span className="text-slate-400">Role:</span>
                <span className="font-medium text-slate-300">High-speed failover buffer</span>
              </p>
              <p className="flex justify-between text-[10px]">
                <span className="text-slate-400">Pricing:</span>
                <span className="font-mono text-emerald-400">$0.05 In / $0.33 Out</span>
              </p>
            </div>
          </div>

          {/* Model 4 & 5: TinyLlama 1.1B + Qwen2 0.5B (Offline VPS Clone) */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-emerald-500/40 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">📲</span>
                <div>
                  <h4 className="font-black text-white text-xs">TinyLlama 1.1B + Qwen2 0.5B</h4>
                  <p className="text-[10px] text-emerald-300 font-mono">Local GGUF • Phone / VPS Clone</p>
                </div>
              </div>
              <span className="text-[9px] font-bold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                R0.00 Data Cost
              </span>
            </div>
            <div className="text-[11px] text-slate-300 space-y-1">
              <p className="flex justify-between text-[10px]">
                <span className="text-slate-400">Offline Status:</span>
                <span className="font-bold text-emerald-400">Available on phone storage</span>
              </p>
              <p className="flex justify-between text-[10px]">
                <span className="text-slate-400">Ready for VPS:</span>
                <span className="font-mono text-slate-200">adb pull / scp pipeline verified</span>
              </p>
            </div>
          </div>
        </div>

        {/* PHONE TO VPS CLONE HELPER (STEP 2 READY) */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-indigo-500/40 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-base">🚀</span>
              <h4 className="font-bold text-xs text-white">Phone to VPS Clone Terminal Helper (Save 600MB Data)</h4>
            </div>
            <span className="text-[10px] font-mono text-indigo-400">Ready on Request</span>
          </div>
          <p className="text-[11px] text-slate-400">
            When ready, tell the assistant <code className="bg-slate-900 text-indigo-300 px-1.5 py-0.5 rounded">&quot;GIVE VPS CLONE PROMPT&quot;</code> to generate your automated scp / adb sync script.
          </p>
        </div>
      </div>

    </div>
  );
};


