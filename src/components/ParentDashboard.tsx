import React, { useEffect, useState } from 'react';
import { CacheStats } from '../types';
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

export const ParentDashboard: React.FC = () => {
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

  const [paystackKeyInput, setPaystackKeyInput] = useState((import.meta as any).env?.VITE_PAYSTACK_PUBLIC_KEY || '');
  const [showKeyModal, setShowKeyModal] = useState(false);

  const handlePaystackCheckout = () => {
    const activeKey = paystackKeyInput.trim() || 'pk_test_samplekey';
    if (activeKey === 'pk_test_samplekey' || !activeKey.startsWith('pk_test_')) {
      setShowKeyModal(true);
      return;
    }

    setSubscribing(true);
    const scriptUrl = 'https://js.paystack.co/v1/inline.js';
    const existingScript = document.querySelector(`script[src="${scriptUrl}"]`);

    const openPaystackModal = () => {
      // @ts-ignore
      if (typeof window.PaystackPop !== 'undefined') {
        try {
          // @ts-ignore
          const handler = window.PaystackPop.setup({
            key: activeKey,
            email: 'parent@schoolkids.ai',
            amount: 5000, // R50.00 in cents (ZAR)
            currency: 'ZAR',
            ref: 'PS_' + Math.floor((Math.random() * 1000000000) + 1),
            callback: function(response: any) {
              handleSimulateSubscription();
              setSuccessMsg(`🎉 Paystack Payment Successful! Ref: ${response.reference}`);
            },
            onClose: function() {
              setSubscribing(false);
            }
          });
          handler.openIframe();
        } catch (e) {
          console.error('Paystack popup error:', e);
          setSubscribing(false);
          setShowKeyModal(true);
        }
      } else {
        setSubscribing(false);
        setShowKeyModal(true);
      }
    };

    if (!existingScript) {
      const script = document.createElement('script');
      script.src = scriptUrl;
      script.async = true;
      script.onload = openPaystackModal;
      script.onerror = () => {
        setSubscribing(false);
        setShowKeyModal(true);
      };
      document.body.appendChild(script);
    } else {
      openPaystackModal();
    }
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
          <p className="text-sm font-semibold text-slate-600">Loading Profit & Caching Engine...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8 animate-fadeIn">
      
      {/* Top Banner */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-2xl p-6 md:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-bold mb-4">
            <Zap className="w-3.5 h-3.5 text-emerald-400" /> Question Caching & OpenRouter Free Tier Strategy
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">Parent Monetization & AI Fuel Optimizer</h2>
          <p className="text-white/80 text-sm mt-2">
            By caching identical homework questions across students, 80%+ of queries cost R0.00 in AI fuel. Parents pay R50/month for unlimited safe homework help while you keep a 99.6% profit margin!
          </p>
        </div>
        <div className="mt-6 flex flex-wrap gap-4">
          <button
            onClick={handlePaystackCheckout}
            disabled={subscribing}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold px-5 py-2.5 rounded-xl text-sm shadow-lg transition-all flex items-center gap-2 border border-emerald-400/30"
          >
            <DollarSign className="w-4 h-4" />
            <span>💳 Paystack Checkout (R50/mo)</span>
          </button>
          <button
            onClick={handleSimulateSubscription}
            disabled={subscribing}
            className="bg-white/10 hover:bg-white/20 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-all flex items-center gap-2 border border-white/20"
          >
            <Users className="w-4 h-4" />
            <span>Simulate New Subscriber</span>
          </button>
          <button
            onClick={fetchStats}
            className="bg-white/10 hover:bg-white/20 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-all flex items-center gap-2 border border-white/20"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh Stats</span>
          </button>
        </div>
        {successMsg && (
          <div className="mt-4 bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-2 w-fit animate-bounce">
            <CheckCircle2 className="w-4 h-4" /> {successMsg}
          </div>
        )}
      </div>

      {/* Paystack Key Config Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#1A1B2E] border border-white/20 rounded-2xl p-6 max-w-md w-full shadow-2xl text-white space-y-4">
            <h3 className="text-lg font-bold flex items-center gap-2 text-emerald-400">
              <DollarSign className="w-5 h-5" /> Paystack Test Key Setup
            </h3>
            <p className="text-xs text-white/70 leading-relaxed">
              To test real Paystack popups, enter your Paystack Public Test Key (<code className="bg-white/10 px-1.5 py-0.5 rounded text-emerald-300">pk_test_...</code>) below. Or click <strong className="text-white">Simulate Payment</strong> for instant sandbox success.
            </p>
            <div>
              <label className="block text-xs font-semibold text-white/60 mb-1">Paystack Public Test Key</label>
              <input
                type="text"
                value={paystackKeyInput}
                onChange={(e) => setPaystackKeyInput(e.target.value)}
                placeholder="pk_test_xxxxxxxxxxxxxxxxxxxxxxxx"
                className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-2.5 text-xs text-white placeholder-white/40 focus:outline-none focus:border-emerald-400 transition-all font-mono"
              />
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  setShowKeyModal(false);
                  handleSimulateSubscription();
                }}
                className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all border border-white/20"
              >
                Simulate Success
              </button>
              <button
                onClick={() => {
                  setShowKeyModal(false);
                  if (paystackKeyInput.startsWith('pk_test_')) {
                    handlePaystackCheckout();
                  } else {
                    setSuccessMsg('⚠️ Please enter a valid pk_test_ key or use simulation.');
                  }
                }}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-lg border border-emerald-400/30"
              >
                Save & Open Paystack
              </button>
              <button
                onClick={() => setShowKeyModal(false)}
                className="text-white/40 hover:text-white text-xs px-2 py-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Metric 1: Monthly Revenue */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-sm border border-white/20 hover:border-white/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-white/50">Monthly Revenue</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">R {stats.totalRevenue.toLocaleString()}</span>
            <span className="text-xs font-bold text-emerald-400">({stats.subscriberCount} parents)</span>
          </div>
          <p className="text-xs text-white/60 mt-1">At R50/month subscription</p>
        </div>

        {/* Metric 2: Net Profit */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-sm border border-white/20 hover:border-white/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-white/50">Estimated Net Profit</span>
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-black text-purple-300">R {stats.netProfit}</span>
            <span className="text-xs font-bold text-white/70">99.6% Margin</span>
          </div>
          <p className="text-xs text-white/60 mt-1">After deducting AI token costs</p>
        </div>

        {/* Metric 3: Cache Hit Rate */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-sm border border-white/20 hover:border-white/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-white/50">Cache Hit Rate</span>
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Zap className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{stats.cacheHitRate}%</span>
            <span className="text-xs font-bold text-amber-400">{stats.savedQueries} saved</span>
          </div>
          <p className="text-xs text-white/60 mt-1">Identical questions served instantly</p>
        </div>

        {/* Metric 4: AI Fuel Cost */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-sm border border-white/20 hover:border-white/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-white/50">AI Fuel Cost</span>
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
              <Database className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">R {stats.aiFuelCost}</span>
            <span className="text-xs font-bold text-rose-400">vs R{stats.costWithoutCache}</span>
          </div>
          <p className="text-xs text-white/60 mt-1">Powered by OpenRouter / Gemini Flash Lite</p>
        </div>

      </div>

      {/* NEW: Recent Rewards Earned & Child Learning Progress Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Child Profile & Activity Milestone Rewards (2 cols) */}
        <div className="lg:col-span-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 text-white space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <h3 className="text-lg font-black tracking-tight flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-400" /> Recent Rewards Earned
              </h3>
              <p className="text-xs text-white/70">
                Learning milestones completed by <strong className="text-amber-300">{childProfile.name}</strong> ({childProfile.grade})
              </p>
            </div>
            
            <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center border border-amber-500/30">
                <Star className="w-4.5 h-4.5 text-amber-400 fill-amber-400" />
              </div>
              <div>
                <div className="text-xs text-white/50 font-bold uppercase tracking-wider leading-none">Total Score</div>
                <div className="text-lg font-black text-amber-300 leading-none mt-1">{childLeaderboardInfo.xp} XP</div>
              </div>
            </div>
          </div>

          {/* List of Milestones Completed */}
          <div className="space-y-4">
            {rewards.map((reward) => (
              <div 
                key={reward.id} 
                className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center justify-center shrink-0 mt-0.5">
                  {reward.icon === 'trophy' && <Trophy className="w-5 h-5 text-yellow-400" />}
                  {reward.icon === 'zap' && <Zap className="w-5 h-5 text-sky-400" />}
                  {reward.icon === 'gift' && <Gift className="w-5 h-5 text-rose-400" />}
                  {reward.icon === 'shield' && <ShieldCheck className="w-5 h-5 text-emerald-400" />}
                </div>
                
                <div className="flex-1 space-y-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h4 className="font-bold text-sm text-white">{reward.title}</h4>
                    <span className="text-xs font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                      +{reward.xpEarned} XP
                    </span>
                  </div>
                  <p className="text-xs text-white/70">{reward.description}</p>
                  
                  {reward.voucherCode && (
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-white/50">Voucher Code:</span>
                      <code className="bg-white/10 text-emerald-300 px-2 py-0.5 rounded font-mono text-xs border border-white/10">
                        {reward.voucherCode}
                      </code>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-[10px] text-white/40 pt-1">
                    <Clock className="w-3 h-3" />
                    <span>{reward.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Parent Custom Rewards Creator & Tracker (1 col) */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 text-white space-y-6">
          <div>
            <h3 className="text-lg font-black tracking-tight flex items-center gap-2">
              <Gift className="w-5 h-5 text-pink-400" /> Parent Reward Center
            </h3>
            <p className="text-xs text-white/70">
              Create and manage real-life milestones for your child
            </p>
          </div>

          {/* Custom Milestones List */}
          <div className="space-y-3">
            {customRewards.map((item) => {
              const isLocked = childLeaderboardInfo.xp < item.xpRequired;
              return (
                <div 
                  key={item.id} 
                  className={`p-3.5 rounded-xl border transition-all ${
                    item.claimed 
                      ? 'bg-emerald-500/10 border-emerald-500/30 opacity-70' 
                      : 'bg-white/5 border-white/10'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className={`font-bold text-xs ${item.claimed ? 'line-through text-white/40' : 'text-white'}`}>
                        {item.title}
                      </h4>
                      <p className="text-[10px] text-white/60 mt-0.5">{item.description}</p>
                    </div>
                    <button 
                      onClick={() => handleDeleteCustomReward(item.id)}
                      className="text-white/30 hover:text-rose-400 p-1 rounded transition-all"
                      title="Delete Reward"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-2 border-t border-white/5 pt-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isLocked 
                        ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20' 
                        : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                    }`}>
                      {isLocked ? `Locked (Need ${item.xpRequired} XP)` : 'Unlocked!'}
                    </span>

                    {!isLocked && (
                      <button
                        onClick={() => handleToggleCustomClaim(item.id)}
                        className={`text-[10px] font-extrabold px-2.5 py-1 rounded-lg transition-all ${
                          item.claimed 
                            ? 'bg-white/10 hover:bg-white/20 text-white' 
                            : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                        }`}
                      >
                        {item.claimed ? 'Mark Unclaimed' : 'Claim Reward'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Reward Addition Form */}
          <form onSubmit={handleAddCustomReward} className="border-t border-white/10 pt-4 space-y-3">
            <h4 className="font-extrabold text-xs text-white/90">Add New Reward Milestone</h4>
            
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-white/50 block">Reward Title</label>
              <input 
                type="text" 
                value={newRewardTitle}
                onChange={(e) => setNewRewardTitle(e.target.value)}
                placeholder="e.g., Sunday Braai Ice-Cream 🍦" 
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-purple-400"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-white/50 block">XP Milestone</label>
                <input 
                  type="number" 
                  value={newRewardXp}
                  onChange={(e) => setNewRewardXp(Number(e.target.value))}
                  placeholder="1500" 
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-purple-400"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-white/50 block">Optional Note</label>
                <input 
                  type="text" 
                  value={newRewardDesc}
                  onChange={(e) => setNewRewardDesc(e.target.value)}
                  placeholder="For perfect math score" 
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-purple-400"
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 rounded-lg text-xs transition-all flex items-center justify-center gap-1 border border-purple-400/20"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Reward Milestone</span>
            </button>
          </form>

        </div>

      </div>

      {/* Caching Architecture Explanation Card */}
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 md:p-8 border border-white/20 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center justify-center font-bold">1</div>
          <h3 className="font-bold text-white text-lg">Question Normalization</h3>
          <p className="text-white/70 text-sm">
            When any student asks &quot;What is photosynthesis?&quot; or &quot;what is 12 + 7?&quot;, the server normalizes the query (lowercase, trimmed).
          </p>
        </div>
        <div className="space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center justify-center font-bold">2</div>
          <h3 className="font-bold text-white text-lg">Instant Cache Check</h3>
          <p className="text-white/70 text-sm">
            The system checks Supabase / memory cache. If cached, the answer is returned instantly with zero OpenRouter credit usage!
          </p>
        </div>
        <div className="space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center justify-center font-bold">3</div>
          <h3 className="font-bold text-white text-lg">Maximized Profit</h3>
          <p className="text-white/70 text-sm">
            1,000 kids asking the same 100 questions results in paying for AI only once. You keep 99.6% of subscription revenue.
          </p>
        </div>
      </div>

    </div>
  );
};

