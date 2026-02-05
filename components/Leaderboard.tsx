import { useState, useEffect } from 'react';

type Player = {
  name: string;
  xp: number;
  isMe: boolean;
};

export default function Leaderboard({ currentXp, onClose }: { currentXp: number, onClose: () => void }) {
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    // Generate fake leaderboard centered around user
    const basePlayers = [
      { name: "Global Champion", xp: 5000 + Math.floor(Math.random() * 1000), isMe: false },
      { name: "SpeedDemon", xp: currentXp + 1500, isMe: false },
      { name: "VocabKing", xp: currentXp + 800, isMe: false },
      { name: "StudyGirl_99", xp: currentXp + 200, isMe: false },
      { name: "You", xp: currentXp, isMe: true },
      { name: "NoobMaster", xp: Math.max(0, currentXp - 300), isMe: false },
      { name: "Guest User", xp: Math.max(0, currentXp - 800), isMe: false },
    ];
    
    setPlayers(basePlayers.sort((a, b) => b.xp - a.xp));
  }, [currentXp]);

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all scale-100" onClick={e => e.stopPropagation()}>
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-4 text-white text-center">
          <h2 className="text-2xl font-black uppercase tracking-wider">Leaderboard</h2>
          <p className="text-xs opacity-90">Weekly Global Ranking</p>
        </div>
        
        <div className="p-4 max-h-[60vh] overflow-y-auto">
          {players.map((p, i) => (
            <div 
              key={i} 
              className={`flex items-center justify-between p-3 mb-2 rounded-xl border-b-2 ${p.isMe ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-400 transform scale-105 shadow-md' : 'bg-transparent border-gray-100 dark:border-gray-700'}`}
            >
              <div className="flex items-center gap-3">
                <span className={`font-mono font-bold text-lg w-6 text-center ${i < 3 ? 'text-yellow-500' : 'text-gray-400'}`}>
                  {i + 1}
                </span>
                <span className={`font-bold ${p.isMe ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                  {p.name}
                  {p.isMe && <span className="ml-2 text-[10px] bg-blue-500 text-white px-1 rounded">YOU</span>}
                </span>
              </div>
              <span className="font-mono font-bold text-gray-500 dark:text-gray-400 text-sm">
                {p.xp.toLocaleString()} XP
              </span>
            </div>
          ))}
        </div>
        
        <div className="p-4 border-t border-gray-100 dark:border-gray-700 text-center">
          <button onClick={onClose} className="text-sm font-bold text-gray-500 hover:text-gray-800 dark:hover:text-white">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
