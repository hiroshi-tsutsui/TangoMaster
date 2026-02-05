import { useState, useEffect } from 'react';

type UserStats = {
  xp: number;
  streak: number;
  level: number;
  joinDate: string;
  wordsLearned: number;
};

type ProfileProps = {
  username: string;
  avatar: string;
  stats: UserStats;
  onSave: (name: string, avatar: string) => void;
  onClose: () => void;
};

const AVATARS = ['🎓', '🧠', '📚', '🚀', '🦁', '🦉', '🤖', '👽', '👾', '🌟', '🔥', '💎'];

export default function ProfileModal({ username, avatar, stats, onSave, onClose }: ProfileProps) {
  const [name, setName] = useState(username);
  const [selectedAvatar, setSelectedAvatar] = useState(avatar);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    onSave(name, selectedAvatar);
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all scale-100" onClick={e => e.stopPropagation()}>
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white text-center relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white">✕</button>
          
          <div className="relative inline-block group">
            <div className="w-24 h-24 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-6xl shadow-inner mb-3 mx-auto border-4 border-white/30">
              {selectedAvatar}
            </div>
            {isEditing && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full cursor-pointer">
                <span className="text-xs font-bold">Change</span>
              </div>
            )}
          </div>

          {isEditing ? (
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-white/20 border border-white/30 rounded px-2 py-1 text-center font-bold text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 w-full max-w-[200px]"
              placeholder="Enter Name"
              maxLength={15}
            />
          ) : (
            <h2 className="text-2xl font-black tracking-wide flex items-center justify-center gap-2">
              {name}
              <button onClick={() => setIsEditing(true)} className="opacity-50 hover:opacity-100">✏️</button>
            </h2>
          )}
          
          <p className="text-xs opacity-80 mt-1 uppercase tracking-widest">Level {stats.level} Scholar</p>
        </div>

        {isEditing && (
          <div className="p-4 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
            <p className="text-xs font-bold text-gray-500 mb-2 uppercase text-center">Select Avatar</p>
            <div className="grid grid-cols-6 gap-2">
              {AVATARS.map(a => (
                <button
                  key={a}
                  onClick={() => setSelectedAvatar(a)}
                  className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${selectedAvatar === a ? 'bg-blue-100 dark:bg-blue-900/30 ring-2 ring-blue-500' : ''}`}
                >
                  {a}
                </button>
              ))}
            </div>
            <button 
              onClick={handleSave}
              className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded-lg transition-colors"
            >
              Save Profile
            </button>
          </div>
        )}
        
        <div className="p-6 grid grid-cols-2 gap-4">
          <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold">Streak</p>
            <p className="text-2xl font-black text-orange-500">{stats.streak} 🔥</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold">Total XP</p>
            <p className="text-2xl font-black text-purple-500">{stats.xp}</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold">Words</p>
            <p className="text-2xl font-black text-blue-500">{stats.wordsLearned}</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold">Joined</p>
            <p className="text-sm font-bold text-gray-700 dark:text-gray-300 mt-2">{stats.joinDate}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
