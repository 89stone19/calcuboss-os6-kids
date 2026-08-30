import React, { useState, useEffect } from 'react';
import { Volume2, Play, Pause, RotateCcw, RotateCw, Save, FolderOpen, Upload, Highlighter, Trash2, Settings, Sparkles, X } from 'lucide-react';

interface TextReaderBarProps {
  text: string;
  teacherName: string;
  onClose?: () => void;
}

export const TextReaderBar: React.FC<TextReaderBarProps> = ({ text, teacherName, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<number>(1.0);
  const [voiceLang, setVoiceLang] = useState<string>('en-GB');
  const [fontSize, setFontSize] = useState<number>(16);
  const [quality, setQuality] = useState<string>('High');
  const [progress, setProgress] = useState<number>(0);
  const [savedFiles, setSavedFiles] = useState<{ id: string; title: string; text: string }[]>([]);
  const [showFilesModal, setShowFilesModal] = useState(false);

  const charCount = text.length;
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  useEffect(() => {
    // Load saved files from localStorage
    const stored = localStorage.getItem('school_kids_saved_files');
    if (stored) {
      try {
        setSavedFiles(JSON.parse(stored));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handlePlay = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    if (isPlaying) {
      window.speechSynthesis.pause();
      setIsPlaying(false);
      return;
    }

    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setIsPlaying(true);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = speed;
    utterance.lang = voiceLang;

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => {
      setIsPlaying(false);
      setProgress(100);
    };
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
  };

  const handleStop = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setProgress(0);
    }
  };

  const handleSave = () => {
    const newFile = {
      id: Date.now().toString(),
      title: `${teacherName} Note - ${new Date().toLocaleDateString()}`,
      text: text,
    };
    const updated = [newFile, ...savedFiles];
    setSavedFiles(updated);
    localStorage.setItem('school_kids_saved_files', JSON.stringify(updated));
    alert('✨ Saved successfully to Your Files!');
  };

  const handleClear = () => {
    handleStop();
    if (onClose) onClose();
  };

  return (
    <div className="bg-[#1A1B2E]/95 backdrop-blur-2xl border border-white/20 rounded-3xl p-5 shadow-2xl text-white space-y-4 animate-fadeIn">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300 shadow">
            <Volume2 className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-white">Text Reader & Voice Studio</h4>
            <p className="text-[11px] text-white/50">{teacherName} AI Reader • HD Neural Voice</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-white/40 hover:text-white p-1 rounded-lg transition-all">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Selectors Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-white/5 p-3 rounded-2xl border border-white/10 text-xs">
        {/* Language / Region */}
        <div className="space-y-1">
          <label className="text-[10px] text-white/50 font-bold uppercase tracking-wider">Voice Region</label>
          <select
            value={voiceLang}
            onChange={(e) => setVoiceLang(e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-purple-400"
          >
            <option value="en-GB" className="bg-[#1A1B2E]">English (UK) 1</option>
            <option value="en-US" className="bg-[#1A1B2E]">English (US)</option>
            <option value="en-ZA" className="bg-[#1A1B2E]">English (South Africa)</option>
          </select>
        </div>

        {/* Font Size */}
        <div className="space-y-1">
          <label className="text-[10px] text-white/50 font-bold uppercase tracking-wider">Font Size</label>
          <select
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
            className="w-full bg-white/10 border border-white/20 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-purple-400"
          >
            <option value={14} className="bg-[#1A1B2E]">14px</option>
            <option value={16} className="bg-[#1A1B2E]">16px (Default)</option>
            <option value={18} className="bg-[#1A1B2E]">18px</option>
            <option value={20} className="bg-[#1A1B2E]">20px</option>
          </select>
        </div>

        {/* Quality */}
        <div className="space-y-1">
          <label className="text-[10px] text-white/50 font-bold uppercase tracking-wider">Quality</label>
          <select
            value={quality}
            onChange={(e) => setQuality(e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-purple-400"
          >
            <option value="High" className="bg-[#1A1B2E]">High (Neural)</option>
            <option value="Normal" className="bg-[#1A1B2E]">Normal</option>
          </select>
        </div>

        {/* Speed */}
        <div className="space-y-1">
          <label className="text-[10px] text-white/50 font-bold uppercase tracking-wider">Speed</label>
          <select
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="w-full bg-white/10 border border-white/20 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-purple-400"
          >
            <option value={0.75} className="bg-[#1A1B2E]">0.75x</option>
            <option value={1.0} className="bg-[#1A1B2E]">1.00x (Normal)</option>
            <option value={1.25} className="bg-[#1A1B2E]">1.25x</option>
            <option value={1.5} className="bg-[#1A1B2E]">1.50x</option>
          </select>
        </div>
      </div>

      {/* Text Preview Box */}
      <div
        style={{ fontSize: `${fontSize}px` }}
        className="bg-black/30 border border-white/10 rounded-2xl p-4 max-h-36 overflow-y-auto leading-relaxed text-white/95"
      >
        {text}
      </div>

      {/* Character / Word Stats & Quick Actions Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-white/10">
        <span className="text-xs text-white/60 font-medium">
          {charCount.toLocaleString()} Characters • {wordCount} Words
        </span>

        <div className="flex items-center gap-1.5 text-xs font-semibold">
          <button
            onClick={handleSave}
            className="flex items-center gap-1 bg-white/10 hover:bg-white/20 text-white/90 px-3 py-1.5 rounded-xl border border-white/15 transition-all"
            title="Save text"
          >
            <Save className="w-3.5 h-3.5 text-purple-400" />
            <span>Save</span>
          </button>

          <button
            onClick={() => setShowFilesModal(true)}
            className="flex items-center gap-1 bg-white/10 hover:bg-white/20 text-white/90 px-3 py-1.5 rounded-xl border border-white/15 transition-all"
            title="View saved files"
          >
            <FolderOpen className="w-3.5 h-3.5 text-amber-400" />
            <span>Your Files ({savedFiles.length})</span>
          </button>

          <button
            onClick={() => {
              navigator.clipboard.writeText(text);
              alert('Copied to clipboard!');
            }}
            className="flex items-center gap-1 bg-white/10 hover:bg-white/20 text-white/90 px-3 py-1.5 rounded-xl border border-white/15 transition-all"
            title="Load or copy"
          >
            <Upload className="w-3.5 h-3.5 text-emerald-400" />
            <span>Load File</span>
          </button>

          <button
            onClick={handleClear}
            className="flex items-center gap-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 px-3 py-1.5 rounded-xl border border-rose-500/30 transition-all"
            title="Clear and close"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-400" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Audio Player Scrubber & Transport Controls */}
      <div className="bg-black/40 border border-white/15 rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between text-xs text-white/60 font-mono">
          <span>{isPlaying ? 'Playing...' : 'Ready'}</span>
          <span>{speed}x HD Voice</span>
        </div>

        {/* Scrubber Bar */}
        <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden relative cursor-pointer">
          <div
            className="bg-gradient-to-r from-purple-500 to-teal-400 h-full transition-all duration-300"
            style={{ width: isPlaying ? '65%' : '0%' }}
          ></div>
        </div>

        {/* Transport Buttons */}
        <div className="flex items-center justify-center gap-4 pt-1">
          <button
            onClick={handleStop}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white/80 transition-all shadow"
            title="Restart / Stop"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={handlePlay}
            className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white flex items-center justify-center shadow-xl border border-purple-400/40 transition-all transform hover:scale-105"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
          </button>

          <button
            onClick={() => {
              // skip forward simulation
              alert('Speed set to ' + speed + 'x');
            }}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white/80 transition-all shadow"
            title="Forward"
          >
            <RotateCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Saved Files Modal */}
      {showFilesModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#1A1B2E] border border-white/20 rounded-3xl p-6 max-w-lg w-full shadow-2xl text-white space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-lg font-bold flex items-center gap-2 text-amber-400">
                <FolderOpen className="w-5 h-5" /> Your Saved Audio Files ({savedFiles.length})
              </h3>
              <button onClick={() => setShowFilesModal(false)} className="text-white/40 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 max-h-72 overflow-y-auto">
              {savedFiles.length === 0 ? (
                <p className="text-xs text-white/50 text-center py-6">No saved notes yet. Click 'Save' on any teacher answer!</p>
              ) : (
                savedFiles.map((file) => (
                  <div key={file.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2 hover:border-white/20 transition-all">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-purple-300">{file.title}</span>
                      <span className="text-[10px] text-white/40">{file.text.length} chars</span>
                    </div>
                    <p className="text-xs text-white/70 line-clamp-2">{file.text}</p>
                  </div>
                ))
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowFilesModal(false)}
                className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all border border-white/20"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
