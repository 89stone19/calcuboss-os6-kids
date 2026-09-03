import React, { useState, useRef } from 'react';
import { Paperclip, File, X, Send } from 'lucide-react';
import { ChatMessage } from '../types';

interface ChatInputBarProps {
  onSendMessage: (text: string, fileData: ChatMessage['fileData'] | null) => void;
  activeTeacherName: string;
}

export const ChatInputBar: React.FC<ChatInputBarProps> = ({ onSendMessage, activeTeacherName }) => {
  const [inputValue, setInputValue] = useState('');
  const [selectedFile, setSelectedFile] = useState<ChatMessage['fileData'] | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert("File too big. Max 10MB. Please split or compress.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const fileData: ChatMessage['fileData'] = {
        name: file.name,
        size: file.size,
        type: file.type,
      };

      if (file.type.startsWith('image/')) {
        fileData.dataUrl = content;
      } else {
        fileData.content = content;
      }
      setSelectedFile(fileData);
    };

    if (file.type.startsWith('image/')) {
      reader.readAsDataURL(file);
    } else {
      reader.readAsText(file);
    }
  };

  const handleSend = () => {
    if (!inputValue.trim() && !selectedFile) return;
    onSendMessage(inputValue, selectedFile);
    setInputValue('');
    setSelectedFile(null);
  };

  return (
    <div className="p-4 bg-black/20 border-t border-white/10 flex flex-col gap-2">
      {selectedFile && (
        <div className="flex items-center gap-2 bg-white/10 p-2 rounded-xl border border-white/10 text-white/80 text-xs">
          <File className="w-4 h-4" />
          <span className="truncate flex-1">{selectedFile.name}</span>
          <button onClick={() => setSelectedFile(null)} className="p-1 hover:bg-white/20 rounded-full">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
      <div className="flex items-center gap-3">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFile}
          accept=".py,.js,.html,.txt,.sb3,.json,.png,.jpg,.pdf"
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="text-white/60 hover:text-white p-2 transition-all"
        >
          <Paperclip className="w-5 h-5" />
        </button>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder={`Ask ${activeTeacherName} a question...`}
          className="flex-1 bg-white/5 border border-white/20 rounded-2xl px-5 py-3 text-sm text-white placeholder-white/40 focus:outline-none focus:border-purple-400/60 transition-all"
        />
        <button
          onClick={handleSend}
          className="bg-purple-600 hover:bg-purple-500 text-white p-3 rounded-2xl shadow-lg transition-all flex items-center justify-center shrink-0 border border-purple-400/30"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
