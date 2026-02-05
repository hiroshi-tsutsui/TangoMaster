import { useState } from 'react';

export default function ChallengeModal({ streak, level, onClose }: { streak: number, level: number, onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  const challengeLink = `https://tangomaster.app/challenge?streak=${streak}&level=${level}`; // Dummy link
  const shareText = `🔥 I'm Level ${level} on a ${streak}-day streak on TangoMaster! Can you beat me?`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`${shareText} ${challengeLink}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareTwitter = () => {
     const url = "https://twitter.com/intent/tweet?text=" + encodeURIComponent(shareText + "\n" + challengeLink);
     window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all scale-100" onClick={e => e.stopPropagation()}>
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white text-center">
          <h2 className="text-2xl font-black uppercase tracking-wider mb-2">Challenge Friends</h2>
          <p className="text-sm opacity-90">Dare them to beat your streak!</p>
        </div>
        
        <div className="p-6 space-y-6">
            <div className="text-center">
                <div className="inline-block p-4 rounded-full bg-blue-50 dark:bg-blue-900/20 mb-3">
                    <span className="text-4xl">⚔️</span>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                    You have a <span className="font-bold text-orange-500">{streak} day streak</span> and are <span className="font-bold text-purple-500">Level {level}</span>.
                </p>
            </div>

            <div className="flex flex-col gap-3">
                <button 
                    onClick={copyToClipboard}
                    className="w-full py-3 px-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl font-bold text-gray-700 dark:text-gray-200 flex items-center justify-center gap-2 transition-colors"
                >
                    {copied ? (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                        </>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" /><path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" /></svg>
                    )}
                    {copied ? "Copied!" : "Copy Challenge Link"}
                </button>

                <button 
                    onClick={shareTwitter}
                    className="w-full py-3 px-4 bg-[#1DA1F2] hover:bg-[#1a91da] text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-blue-400/30"
                >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                    Share on X
                </button>
            </div>
        </div>
        
        <div className="p-4 border-t border-gray-100 dark:border-gray-700 text-center">
          <button onClick={onClose} className="text-sm font-bold text-gray-500 hover:text-gray-800 dark:hover:text-white">
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
}
