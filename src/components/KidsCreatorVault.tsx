import React, { useState } from 'react';
import { isKidsVideo } from './ParentCommunity';
import { Sparkles, ShieldCheck, Lock, Video, CheckCircle2, AlertTriangle, FileText, Send, Award, Coins } from 'lucide-react';

export const KidsCreatorVault: React.FC = () => {
  // Video Recording / Submission State
  const [videoTitle, setVideoTitle] = useState('');
  const [skillCategory, setSkillCategory] = useState('Boilermaking Math & Angles');
  const [videoUrl, setVideoUrl] = useState('');
  const [videoDescription, setVideoDescription] = useState('');
  
  // Parent Consent State
  const [parentName, setParentName] = useState('');
  const [parentIdNumber, setParentIdNumber] = useState('');
  const [parentApproved, setParentApproved] = useState(false);
  
  // Submission Status & Notice
  const [submissionNotice, setSubmissionNotice] = useState<{ text: string; success: boolean } | null>(null);
  const [submittedVaultItems, setSubmittedVaultItems] = useState([
    {
      id: '1',
      title: 'Boilermaking Layout: Plate Measurement Math',
      category: 'Boilermaking Math & Angles',
      creator: 'Karabo (Grade 8)',
      views: '1,240',
      vaultEarned: 310,
      releaseYear: 2030,
      status: 'Approved & Locked in Vault 🔒'
    },
    {
      id: '2',
      title: 'Intro to Solar Panel Angle Geometry',
      category: 'Agricultural Science & Energy',
      creator: 'Sello (Grade 7)',
      views: '890',
      vaultEarned: 222,
      releaseYear: 2031,
      status: 'Approved & Locked in Vault 🔒'
    }
  ]);

  const totalVaultLocked = submittedVaultItems.reduce((acc, item) => acc + item.vaultEarned, 0);

  const handleSubmitVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoTitle || !videoUrl) {
      setSubmissionNotice({ text: 'Please fill in the video title and YouTube link ❌', success: false });
      return;
    }

    if (!parentApproved || !parentName || !parentIdNumber) {
      setSubmissionNotice({ text: 'Guardian consent & Parent ID verification required before vault submission ❌', success: false });
      return;
    }

    // AI Safety Scanner Verification
    const safetyCheck = isKidsVideo(videoTitle, videoDescription);
    if (!safetyCheck.allowed) {
      setSubmissionNotice({ text: `Safety Check Failed: ${safetyCheck.reason || 'Only Kids Educational Content Allowed'} ❌`, success: false });
      return;
    }

    const newItem = {
      id: Date.now().toString(),
      title: videoTitle,
      category: skillCategory,
      creator: `Young Creator (Parent: ${parentName})`,
      views: '0 (New)',
      vaultEarned: 50, // Initial seed bonus
      releaseYear: 2038,
      status: 'AI Screened & Parent Verified 🔒'
    };

    setSubmittedVaultItems([newItem, ...submittedVaultItems]);
    setSubmissionNotice({ 
      text: '🎉 Video Submitted! AI Screened & Locked into OS6 Educational Trust Vault (Releases at Age 18).', 
      success: true 
    });

    // Reset Form
    setVideoTitle('');
    setVideoUrl('');
    setVideoDescription('');
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-6 space-y-6 text-white shadow-2xl max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-950/80 via-slate-900 to-indigo-950/80 border border-amber-500/30 p-5 rounded-2xl space-y-3 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-3 opacity-10 font-mono font-black text-6xl select-none">
          75/25
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 text-2xl font-bold">
              👑
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <span>OS6 Kids Creator Trust™</span>
                <span className="text-[10px] bg-amber-500/30 text-amber-200 border border-amber-400/40 px-2 py-0.5 rounded-full uppercase font-mono">
                  75/25 Vault Engine
                </span>
              </h2>
              <p className="text-xs text-slate-300">
                Practical Skills Video Engine for Grade 1–12 Learners & Educational Trust Fund
              </p>
            </div>
          </div>

          <div className="bg-slate-950/90 border border-amber-500/40 px-3.5 py-2 rounded-xl text-right">
            <div className="text-[10px] text-slate-400 font-bold uppercase">Total Locked in Vault</div>
            <div className="text-base font-black text-amber-400 flex items-center justify-end gap-1">
              <Coins className="w-4 h-4 text-amber-400" />
              <span>R{totalVaultLocked.toLocaleString()} ZAR</span>
            </div>
          </div>
        </div>

        {/* Vision & Timestamp proof pill */}
        <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-300">
          <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>Timestamp Proof & Brand: Registered in `calcuboss-os6-kids` (Derol Willis)</span>
          </span>
          <a 
            href="#vault-vision" 
            className="text-amber-300 hover:underline font-bold flex items-center gap-1"
            onClick={(e) => {
              e.preventDefault();
              alert("OS6 Kids Creator Trust™ Vision: 75% of monetization locked into child's educational trust account releasing at age 18 for tertiary tuition or vocational startup tools!");
            }}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>View Trust Vision Document</span>
          </a>
        </div>
      </div>

      {/* 3-Step Submission & Guardian Workflow Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Left Column: Submission Form */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <Video className="w-4 h-4 text-indigo-400" />
              <span>1. Submit Practical Skill Video</span>
            </h3>
            <span className="text-[10px] bg-indigo-950 text-indigo-300 border border-indigo-700/60 px-2 py-0.5 rounded">
              Grade 1 to 12
            </span>
          </div>

          <form onSubmit={handleSubmitVideo} className="space-y-3 text-xs">
            <div>
              <label className="text-[11px] text-slate-400 font-bold block mb-1">
                Practical Skill Video Title:
              </label>
              <input 
                type="text" 
                placeholder="e.g. Boilermaking Math: Measuring Plate Angles"
                value={videoTitle}
                onChange={(e) => setVideoTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-[11px] text-slate-400 font-bold block mb-1">
                Practical Skill Category:
              </label>
              <select 
                value={skillCategory}
                onChange={(e) => setSkillCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="Boilermaking Math & Angles">Boilermaking Math & Layout Angles</option>
                <option value="Electrical Basics & Circuits">Electrical Basics & Ohm's Law</option>
                <option value="Agricultural Science & Geometry">Agricultural Science & Geometry</option>
                <option value="Coding & Software Logic">Coding & Software Logic</option>
                <option value="Reading & Storytelling">Reading & Storytelling (Ms Nova)</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] text-slate-400 font-bold block mb-1">
                YouTube Video URL (Unlisted or Public):
              </label>
              <input 
                type="text" 
                placeholder="https://youtu.be/..."
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-[11px] text-slate-400 font-bold block mb-1">
                Short Description / Lesson Notes:
              </label>
              <textarea 
                rows={2}
                placeholder="Explain the math or science formula demonstrated in this video..."
                value={videoDescription}
                onChange={(e) => setVideoDescription(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
              />
            </div>

            {/* Guardian Verification Section */}
            <div className="p-3 bg-slate-900 rounded-xl border border-indigo-900/60 space-y-2 mt-3">
              <div className="flex items-center gap-1.5 text-xs font-extrabold text-indigo-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>2. Guardian / Parent Sign-Off</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <input 
                  type="text"
                  placeholder="Parent Full Name"
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-[11px] focus:outline-none"
                />
                <input 
                  type="text"
                  placeholder="Parent SA ID / Passport"
                  value={parentIdNumber}
                  onChange={(e) => setParentIdNumber(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-[11px] focus:outline-none"
                />
              </div>

              <label className="flex items-start gap-2 text-[10px] text-slate-300 cursor-pointer pt-1">
                <input 
                  type="checkbox"
                  checked={parentApproved}
                  onChange={(e) => setParentApproved(e.target.checked)}
                  className="mt-0.5 rounded accent-indigo-500"
                />
                <span>
                  I confirm I am the legal guardian. I consent to publishing under `@DerolWillis` YouTube Kids umbrella with 75% locked in OS6 Educational Trust Vault.
                </span>
              </label>
            </div>

            {submissionNotice && (
              <div className={`p-2.5 rounded-xl font-bold text-xs ${submissionNotice.success ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-700' : 'bg-rose-950/80 text-rose-300 border border-rose-700'}`}>
                {submissionNotice.text}
              </div>
            )}

            <button 
              type="submit"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 font-extrabold text-xs shadow-lg transition flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Submit to OS6 Educational Vault</span>
            </button>
          </form>
        </div>

        {/* Right Column: Vault Dashboard & Approved Videos */}
        <div className="space-y-4">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
            <h3 className="text-sm font-extrabold text-white flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-400" />
                <span>3. Educational Trust Vault Status</span>
              </span>
              <span className="text-[10px] text-emerald-400 font-mono font-bold">RELEASE AT AGE 18</span>
            </h3>

            <div className="p-3 bg-gradient-to-br from-amber-950/40 to-slate-900 rounded-xl border border-amber-500/30 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Vault Revenue Share:</span>
                <span className="font-bold text-amber-300">75% Child / 25% Platform</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Regulatory Model:</span>
                <span className="font-bold text-emerald-400">Section 18A Educational Trust</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Under 13 Compliance:</span>
                <span className="font-bold text-sky-400">@DerolWillis Official Umbrella</span>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <div className="text-[11px] font-bold text-slate-300 flex items-center justify-between">
                <span>Kid Creator Submissions ({submittedVaultItems.length}):</span>
                <span className="text-[10px] text-amber-400 font-mono">Accumulating Growth 📈</span>
              </div>

              {submittedVaultItems.map((item) => (
                <div key={item.id} className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1.5 text-xs">
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="font-bold text-white text-xs">{item.title}</h4>
                    <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded font-mono font-bold whitespace-nowrap">
                      +R{item.vaultEarned} Vault
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>Creator: {item.creator}</span>
                    <span className="text-emerald-400 font-bold">{item.status}</span>
                  </div>

                  <div className="pt-1 flex items-center justify-between text-[10px] text-slate-500 border-t border-slate-800">
                    <span>Category: {item.category}</span>
                    <span>Unlocks Year: <strong className="text-amber-200">{item.releaseYear}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
