import { useState, useEffect } from 'react';

type Player = {
  name: string;
  xp: number;
  isMe: boolean;
};

type League = 'GOLD' | 'SILVER' | 'BRONZE';

function getLeague(rank: number): League {
  if (rank <= 3) return 'GOLD';
  if (rank <= 10) return 'SILVER';
  return 'BRONZE';
}

function getLeagueColor(league: League) {
  switch (league) {
    case 'GOLD': return 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30';
    case 'SILVER': return 'text-slate-400 bg-slate-100 dark:bg-slate-800';
    case 'BRONZE': return 'text-orange-700 bg-orange-100 dark:bg-orange-900/30';
  }
}

export default function Leaderboard({ currentXp, onClose }: { currentXp: number, onClose: () => void }) {
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    // Generate fake leaderboard centered around user
    const basePlayers = [
      { name: "Global Champion", xp: 5000 + Math.floor(Math.random() * 1000), isMe: false },
      { name: "SpeedDemon", xp: Math.max(currentXp + 1500, 4000), isMe: false },
      { name: "VocabKing", xp: Math.max(currentXp + 800, 3500), isMe: false },
      { name: "StudyGirl_99", xp: Math.max(currentXp + 200, 2500), isMe: false },
      { name: "You", xp: currentXp, isMe: true },
      { name: "NoobMaster", xp: Math.max(0, currentXp - 300), isMe: false },
      { name: "Guest User", xp: Math.max(0, currentXp - 800), isMe: false },
      { name: "Rookie_1", xp: 150, isMe: false },
      { name: "Rookie_2", xp: 100, isMe: false },
      { name: "Rookie_3", xp: 50, isMe: false },
    ];
    
    setPlayers(basePlayers.sort((a, b) => b.xp - a.xp));
  }, [currentXp]);

  const myRank = players.findIndex(p => p.isMe) + 1;
  const myLeague = getLeague(myRank);

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all scale-100" onClick={e => e.stopPropagation()}>
        <div className={`p-4 text-white text-center bg-gradient-to-r ${myLeague === 'GOLD' ? 'from-yellow-400 to-orange-500' : myLeague === 'SILVER' ? 'from-slate-400 to-slate-600' : 'from-orange-700 to-orange-900'}`}>
          <h2 className="text-2xl font-black uppercase tracking-wider">Leaderboard</h2>
          <p className="text-xs opacity-90 font-mono">{myLeague} LEAGUE • RANK #{myRank}</p>
        </div>
        
        <div className="p-4 max-h-[60vh] overflow-y-auto">
          {players.map((p, i) => {
            const rank = i + 1;
            const league = getLeague(rank);
            return (
              <div 
                key={i} 
                className={`flex items-center justify-between p-3 mb-2 rounded-xl border-b-2 ${p.isMe ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-400 transform scale-105 shadow-md' : 'bg-transparent border-gray-100 dark:border-gray-700'}`}
              >
                <div className="flex items-center gap-3">
                  <span className={`font-mono font-bold text-xs w-6 text-center text-gray-400`}>
                    #{rank}
                  </span>
                  <div className="flex flex-col">
                    <span className={`font-bold text-sm ${p.isMe ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                      {p.name}
                      {p.isMe && <span className="ml-2 text-[10px] bg-blue-500 text-white px-1 rounded">YOU</span>}
                    </span>
                    <span className={`text-[10px] font-bold px-1.5 rounded w-fit ${getLeagueColor(league)}`}>
                      {league}
                    </span>
                  </div>
                </div>
                <span className="font-mono font-bold text-gray-500 dark:text-gray-400 text-sm">
                  {p.xp.toLocaleString()} XP
                </span>
              </div>
            );
          })}
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
