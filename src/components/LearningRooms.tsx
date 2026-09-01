import React, { useState } from 'react';
import { Play, Share2, X } from 'lucide-react';

const VIDEO_MAP: { [key: string]: string } = {
  calcuboss: '3JZ_D3ELwOQ', // Placeholder
  treebo: 'dQw4w9WgXcQ',    // Placeholder
  msnova: 'jNQXAC9IVRw',    // Placeholder
};

export const LearningRooms: React.FC = () => {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Rooms Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Math */}
        <div className="bg-slate-900 border border-amber-500/30 rounded-3xl p-5 space-y-3">
          <div className="text-4xl">🚕🧮</div>
          <h3 className="text-lg font-black text-white">Calcuboss OS6</h3>
          <p className="text-xs text-slate-400">Kids Math & Fares Tour in Pretoria. Learn speed, distance, addition and subtraction with Calcuboss CEO!</p>
          <div className="flex gap-2 pt-2">
            <button onClick={() => setActiveVideo(VIDEO_MAP.calcuboss)} className="flex-1 py-2 bg-amber-600 hover:bg-amber-500 text-slate-950 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5"><Play className="w-3 h-3" /> Watch Video</button>
            <button className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5"><Share2 className="w-3 h-3" /> Post to Feed</button>
          </div>
        </div>

        {/* Science */}
        <div className="bg-slate-900 border border-emerald-500/30 rounded-3xl p-5 space-y-3">
          <div className="text-4xl">🌱</div>
          <h3 className="text-lg font-black text-white">Treebo Science Zone</h3>
          <p className="text-xs text-slate-400">How Leaves Make Oxygen. Explore plant botany and photosynthesis with Treebo in nature!</p>
          <div className="flex gap-2 pt-2">
            <button onClick={() => setActiveVideo(VIDEO_MAP.treebo)} className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5"><Play className="w-3 h-3" /> Watch Video</button>
            <button className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5"><Share2 className="w-3 h-3" /> Post to Feed</button>
          </div>
        </div>

        {/* English */}
        <div className="bg-slate-900 border border-pink-500/30 rounded-3xl p-5 space-y-3">
          <div className="text-4xl">✨</div>
          <h3 className="text-lg font-black text-white">Ms Nova Storytime</h3>
          <p className="text-xs text-slate-400">Phonics, Alphabet & Bedtime Tales. Read along with Ms Nova to expand kids grammar and reading confidence!</p>
          <div className="flex gap-2 pt-2">
            <button onClick={() => setActiveVideo(VIDEO_MAP.msnova)} className="flex-1 py-2 bg-pink-600 hover:bg-pink-500 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5"><Play className="w-3 h-3" /> Watch Video</button>
            <button className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5"><Share2 className="w-3 h-3" /> Post to Feed</button>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {activeVideo && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-950 p-4 rounded-3xl w-full max-w-3xl relative">
            <button onClick={() => setActiveVideo(null)} className="absolute -top-10 right-0 text-white hover:text-slate-300">
              <X className="w-8 h-8" />
            </button>
            <div className="aspect-video">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${activeVideo}`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
