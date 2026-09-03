import React, { useState, useEffect, useRef } from 'react';
import { ChatInputBar } from './ChatInputBar';
import { Teacher, ChatMessage } from '../types';
import { TeacherAvatar } from './TeacherAvatar';
import { TextReaderBar } from './TextReaderBar';
import { Sparkles, Volume2, HelpCircle, BookOpen, Atom, Calculator, Zap, CheckCircle, Copy, Check, MessageCircle, File, X } from 'lucide-react';

interface KidsChatProps {
  activeTeacher: Teacher;
  teachers: Teacher[];
  onSelectTeacher: (teacher: Teacher) => void;
}

export const KidsChat: React.FC<KidsChatProps> = ({
  activeTeacher,
  teachers,
  onSelectTeacher,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'teacher',
      text: `Hello! I am ${activeTeacher.name}. ${activeTeacher.greeting} What would you like to learn today? You can tap a quick question below or type your homework question!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      teacherId: activeTeacher.id,
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const [preloadedQuestions, setPreloadedQuestions] = useState<string[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeReaderText, setActiveReaderText] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleShareWhatsApp = (text: string) => {
    const encoded = encodeURIComponent(`📚 *Homework Help from ${activeTeacher.name}*:\n\n${text}`);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  // Subject determined by active teacher
  const subjectId = activeTeacher.id === 'nova' ? 'english' : activeTeacher.id === 'treebo' ? 'science' : 'math';

  // Fetch preloaded questions for this subject
  useEffect(() => {
    fetch(`/api/preload/${subjectId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.questions) {
          setPreloadedQuestions(data.questions);
        }
      })
      .catch((err) => console.error('Failed to load preloaded questions:', err));
  }, [subjectId]);

  // Scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  // Speech synthesis helper
  const speakText = (text: string) => {
    if (!speechEnabled || typeof window === 'undefined' || !window.speechSynthesis) return;
    
    // Stop any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95; // slightly slower for kids
    utterance.pitch = 1.1; // friendly tone

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const handleSendMessage = async (textToSend: string, fileData: ChatMessage['fileData'] | null) => {
    if (!textToSend.trim() && !fileData) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      fileData: fileData || undefined,
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsThinking(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: textToSend,
          subject: subjectId,
          teacherId: activeTeacher.id,
          grade: 'Grade 4',
          fileData: userMsg.fileData, // Pass file data
        }),
      });

      const data = await res.json();
      setIsThinking(false);

      const teacherMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'teacher',
        text: data.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        cached: data.cached,
        hits: data.hits,
        teacherId: activeTeacher.id,
        subject: subjectId,
      };

      setMessages((prev) => [...prev, teacherMsg]);
      speakText(data.answer);

    } catch (err) {
      console.error('Chat API error:', err);
      setIsThinking(false);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'teacher',
        text: `Oops! My connection blinked for a second. Let's try asking that again!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        teacherId: activeTeacher.id,
      };
      setMessages((prev) => [...prev, errorMsg]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fadeIn">
      
      {/* Left Column: Teacher Avatar & Squad Switcher */}
      <div className="lg:col-span-4 flex flex-col gap-6">
        
        {/* Active Teacher Card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20 flex flex-col items-center">
          <TeacherAvatar
            teacher={activeTeacher}
            isSpeaking={isSpeaking}
            isThinking={isThinking}
            onToggleSpeech={() => setSpeechEnabled(!speechEnabled)}
            speechEnabled={speechEnabled}
          />
        </div>

        {/* Teacher Squad Selection */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-5 shadow-xl border border-white/20">
          <h4 className="font-bold text-white text-sm mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" /> Choose Your Teacher Squad
          </h4>
          <div className="space-y-2.5">
            {teachers.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  onSelectTeacher(t);
                  setMessages([
                    {
                      id: Date.now().toString(),
                      sender: 'teacher',
                      text: `Hello! I am ${t.name}. ${t.greeting} What would you like to explore today?`,
                      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                      teacherId: t.id,
                    },
                  ]);
                }}
                className={`w-full flex items-center gap-3 p-3.5 rounded-2xl transition-all border text-left ${
                  activeTeacher.id === t.id
                    ? 'bg-white/20 border-purple-400/50 shadow-lg'
                    : 'bg-white/10 hover:bg-white/15 border-white/20 text-white/90'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl ${t.bgGradient} flex items-center justify-center text-white font-bold text-sm shadow`}>
                  {t.name[0]}
                </div>
                <div>
                  <div className="font-bold text-white text-sm">{t.name}</div>
                  <div className="text-xs text-white/60">{t.specialty}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Right Column: Chat Window & Quick Ask Pills */}
      <div className="lg:col-span-8 flex flex-col bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden h-[78vh]">
        
        {/* Chat Header */}
        <div className="bg-white/10 border-b border-white/20 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${activeTeacher.id === 'nova' ? 'bg-pink-400' : activeTeacher.id === 'treebo' ? 'bg-green-400' : 'bg-orange-400'} animate-pulse`}></div>
            <div>
              <h3 className="font-bold text-white text-sm">{activeTeacher.name} - Homework Room</h3>
              <p className="text-xs text-white/50">{activeTeacher.specialty}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
              <Zap className="w-3 h-3 text-emerald-400" /> Caching Active (0 Credits)
            </span>
          </div>
        </div>

        {/* Quick Ask Suggestion Pills */}
        <div className="bg-black/20 border-b border-white/10 px-4 py-3 overflow-x-auto flex gap-2 scrollbar-none">
          <span className="text-[11px] font-bold text-white/50 flex items-center gap-1 shrink-0 self-center">
            <HelpCircle className="w-3.5 h-3.5 text-purple-400" /> Quick Ask:
          </span>
          {preloadedQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className="bg-white/5 hover:bg-white/15 text-white/80 hover:text-white text-xs font-medium px-3.5 py-1.5 rounded-full border border-white/10 shadow-sm transition-all whitespace-nowrap shrink-0"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div key={msg.id} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} animate-fadeIn`}>
                <div className={`flex items-end gap-2 max-w-[85%] md:max-w-[75%] ${isUser ? 'flex-row-reverse' : ''}`}>
                  {!isUser && (
                    <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-xs shadow shrink-0 border border-purple-400/30">
                      {activeTeacher.name[0]}
                    </div>
                  )}
                  <div
                    className={`p-4 rounded-2xl text-sm leading-relaxed shadow-lg backdrop-blur-md ${
                      isUser
                        ? 'bg-purple-600/60 border border-purple-400/30 text-white rounded-tr-none'
                        : 'bg-white/10 border border-white/15 text-white/90 rounded-tl-none'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                    {msg.fileData && (
                      <div className="mt-3 p-3 bg-black/20 rounded-xl flex items-center gap-3 border border-white/10">
                        {msg.fileData.type.startsWith('image/') ? (
                          <img src={msg.fileData.dataUrl} alt="preview" className="w-12 h-12 rounded-lg object-cover" />
                        ) : (
                          <File className="w-8 h-8 text-purple-300" />
                        )}
                        <div>
                          <p className="text-xs font-bold text-white truncate max-w-[150px]">{msg.fileData.name}</p>
                          <p className="text-[10px] text-white/50">{(msg.fileData.size / 1024).toFixed(1)} KB</p>
                        </div>
                      </div>
                    )}
                    
                    {/* Caching badge if message was served from cache */}
                    {!isUser && msg.cached !== undefined && (
                      <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-white/50">
                        <span className="flex items-center gap-1 font-semibold text-emerald-400">
                          <Zap className="w-3 h-3" /> {msg.cached ? '⚡ Instant Cache Hit (Saved AI Token Cost)' : '✨ AI Generated & Cached for Future Students'}
                        </span>
                        {msg.hits && <span className="bg-white/10 px-2 py-0.5 rounded-full text-white/70 font-bold">{msg.hits} hits</span>}
                      </div>
                    )}

                    {/* Copy & WhatsApp Share Action Buttons */}
                    {!isUser && (
                      <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center gap-2.5 text-xs">
                        <button
                          onClick={() => handleCopyText(msg.text, msg.id)}
                          className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white/80 px-3 py-1.5 rounded-xl transition-all border border-white/10 font-medium"
                          title="Copy text to clipboard"
                        >
                          {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-purple-300" />}
                          <span>{copiedId === msg.id ? 'Copied!' : 'Copy Text'}</span>
                        </button>

                        <button
                          onClick={() => handleShareWhatsApp(msg.text)}
                          className="flex items-center gap-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 px-3 py-1.5 rounded-xl transition-all border border-emerald-500/30 font-medium"
                          title="Share to WhatsApp"
                        >
                          <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                          <span>WhatsApp Share</span>
                        </button>

                        <button
                          onClick={() => setActiveReaderText(msg.text)}
                          className="flex items-center gap-1.5 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 px-3 py-1.5 rounded-xl transition-all border border-purple-500/30 font-medium"
                          title="Open Text Reader Studio"
                        >
                          <Volume2 className="w-3.5 h-3.5 text-purple-400" />
                          <span>Text Reader 🔊</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <span className="text-[10px] text-white/30 mt-1 px-2">{msg.timestamp}</span>
              </div>
            );
          })}

          {isThinking && (
            <div className="flex items-center gap-2 text-white/50 text-xs italic animate-pulse">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
              <span>{activeTeacher.name} is thinking and checking question cache...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Text Reader Bar Overlay Modal */}
        {activeReaderText && (
          <div className="p-4 bg-black/60 backdrop-blur-md border-t border-white/20">
            <TextReaderBar
              text={activeReaderText}
              teacherName={activeTeacher.name}
              onClose={() => setActiveReaderText(null)}
            />
          </div>
        )}

        {/* Input Bar */}
        <ChatInputBar onSendMessage={handleSendMessage} activeTeacherName={activeTeacher.name} />

      </div>

    </div>
  );
};
