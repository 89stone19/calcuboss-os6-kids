import React, { useState, useRef } from 'react';
import { 
  Paperclip, 
  X, 
  Send, 
  Volume2, 
  VolumeX, 
  FileText, 
  PhoneCall, 
  PhoneOff, 
  Check 
} from 'lucide-react';
import { ChatMessage } from '../types';

export interface ChatInputBarProps {
  onSendMessage: (text: string, fileData: ChatMessage['fileData'] | null) => void;
  activeTeacherName?: string;
  isVoiceEnabled?: boolean;
  onToggleVoice?: () => void;
  onCopyNotes?: () => void;
  isCallActive?: boolean;
  onToggleCall?: () => void;
  disabled?: boolean;
}

export const ChatInputBar: React.FC<ChatInputBarProps> = ({
  onSendMessage,
  activeTeacherName = 'Demki',
  isVoiceEnabled = true,
  onToggleVoice,
  onCopyNotes,
  isCallActive = false,
  onToggleCall,
  disabled = false
}) => {
  const [inputValue, setInputValue] = useState('');
  const [selectedFile, setSelectedFile] = useState<ChatMessage['fileData'] | null>(null);
  const [localVoiceActive, setLocalVoiceActive] = useState(isVoiceEnabled);
  const [copiedFeedback, setCopiedFeedback] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate 10MB limit (10 * 1024 * 1024 bytes)
    if (file.size > 10 * 1024 * 1024) {
      alert("File too big. Max 10MB. Please split or compress.");
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      const fileData: ChatMessage['fileData'] = {
        name: file.name,
        size: file.size,
        type: file.type || 'application/octet-stream',
      };

      if (file.type.startsWith('image/')) {
        fileData.dataUrl = result; // Base64 data for Vision / OCR
      } else {
        fileData.dataUrl = result;
        // Also read text content for code/text files if possible
        const textReader = new FileReader();
        textReader.onload = (txtEvt) => {
          fileData.content = txtEvt.target?.result as string;
          setSelectedFile({ ...fileData });
        };
        textReader.readAsText(file);
      }
      setSelectedFile(fileData);
    };

    reader.readAsDataURL(file);
  };

  const handleSend = () => {
    if ((!inputValue.trim() && !selectedFile) || disabled) return;
    onSendMessage(inputValue, selectedFile);
    setInputValue('');
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSpeakerClick = () => {
    if (onToggleVoice) {
      onToggleVoice();
    } else {
      setLocalVoiceActive(prev => !prev);
      if ('speechSynthesis' in window) {
        if (localVoiceActive) {
          window.speechSynthesis.cancel();
        } else {
          const u = new SpeechSynthesisUtterance("Speaker activated. Calcuboss voice is ready!");
          window.speechSynthesis.speak(u);
        }
      }
    }
  };

  const handleNotesClick = () => {
    if (onCopyNotes) {
      onCopyNotes();
      setCopiedFeedback(true);
      setTimeout(() => setCopiedFeedback(false), 1800);
    } else {
      navigator.clipboard.writeText(`Calcuboss OS6 Lesson Notes with ${activeTeacherName}`);
      setCopiedFeedback(true);
      setTimeout(() => setCopiedFeedback(false), 1800);
    }
  };

  const handlePhoneClick = () => {
    if (onToggleCall) {
      onToggleCall();
    } else {
      alert(`Starting audio tutor session with ${activeTeacherName}...`);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes >= 1024 * 1024) {
      return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
    }
    return `${Math.max(1, Math.round(bytes / 1024))}KB`;
  };

  const effectiveVoiceOn = onToggleVoice ? isVoiceEnabled : localVoiceActive;

  return (
    <div className="p-3 bg-white/[0.04] backdrop-blur-md border-t border-white/10 flex flex-col gap-2 w-full z-20">
      {/* File Preview Chip above input: "mycode.py 1.2MB [X]" */}
      {selectedFile && (
        <div className="flex items-center gap-2 bg-amber-500/20 backdrop-blur-md border border-amber-500/40 text-amber-100 px-3 py-1.5 rounded-xl text-xs font-mono shadow-sm animate-in fade-in duration-150">
          <Paperclip className="w-3.5 h-3.5 text-amber-300 shrink-0" />
          <span className="font-bold truncate max-w-[200px]">{selectedFile.name}</span>
          <span className="text-[10px] text-amber-200/80 font-sans">{formatFileSize(selectedFile.size)}</span>
          <button
            type="button"
            onClick={() => {
              setSelectedFile(null);
              if (fileInputRef.current) fileInputRef.current.value = '';
            }}
            className="ml-auto p-1 hover:bg-amber-500/30 text-amber-300 hover:text-white rounded-lg transition"
            title="Remove file"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Bar: Speaker, Document, Phone, Input + Send */}
      <div className="flex items-center gap-2">
        {/* Button 1: Speaker (TTS) */}
        <button
          type="button"
          onClick={handleSpeakerClick}
          className={`p-2.5 rounded-full border transition shrink-0 shadow-lg ${
            effectiveVoiceOn
              ? 'bg-[#ffb400] text-black border-transparent'
              : 'bg-white/[0.08] backdrop-blur-md text-white/60 border-white/15 hover:bg-white/10 hover:text-white'
          }`}
          title="Toggle Teacher Voice Synthesis (Speaker)"
        >
          {effectiveVoiceOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* Button 2: Document (Copy/Share Lesson Text) */}
        <button
          type="button"
          onClick={handleNotesClick}
          className="p-2.5 rounded-full bg-white/[0.08] backdrop-blur-md hover:bg-white/10 text-white/60 hover:text-white border border-white/15 transition shrink-0 shadow-lg"
          title="Copy / Share Latest Lesson Notes"
        >
          {copiedFeedback ? <Check className="w-4 h-4 text-emerald-400" /> : <FileText className="w-4 h-4" />}
        </button>

        {/* Button 3: Phone (Live Call Logic) */}
        <button
          type="button"
          onClick={handlePhoneClick}
          className={`p-2.5 rounded-full border transition shrink-0 shadow-lg ${
            isCallActive
              ? 'bg-rose-500 text-white border-transparent animate-pulse'
              : 'bg-white/[0.08] backdrop-blur-md text-emerald-300 border-white/15 hover:bg-emerald-500/20'
          }`}
          title="Start Live Voice Tutor Call"
        >
          {isCallActive ? <PhoneOff className="w-4 h-4" /> : <PhoneCall className="w-4 h-4" />}
        </button>

        {/* Input Container - Glassmorphic Pill */}
        <div className="flex-1 relative flex items-center p-1 rounded-full bg-white/[0.08] backdrop-blur-xl border border-white/15 shadow-inner">
          {/* NEW 4th button: Paperclip 📎 icon, yellow background, INSIDE the "Ask Demki.." input on left edge */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2 rounded-full bg-[#ffb400] hover:brightness-110 active:scale-95 text-black font-bold shadow-md transition-all flex items-center justify-center shrink-0"
            title="Attach Code or Homework File (.py, .js, .png, etc.)"
          >
            <Paperclip className="w-4 h-4 stroke-[2.5]" />
          </button>

          {/* Hidden File Picker */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFile}
            accept=".py,.js,.html,.txt,.sb3,.json,.png,.jpg,.pdf"
            className="hidden"
          />

          {/* Input text field */}
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={`Ask ${activeTeacherName}...`}
            className="flex-1 px-3 bg-transparent text-xs text-white placeholder:text-white/40 focus:outline-none transition"
          />

          {/* Send Arrow Button inside right edge */}
          <button
            type="button"
            onClick={handleSend}
            disabled={(!inputValue.trim() && !selectedFile) || disabled}
            className="p-2 rounded-full bg-[#ffb400] hover:brightness-110 disabled:opacity-40 disabled:hover:brightness-100 text-black transition shadow-md shrink-0"
            title="Send Message"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
