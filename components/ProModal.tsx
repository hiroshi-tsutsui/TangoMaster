import { useState } from 'react';
import confetti from 'canvas-confetti';

export default function ProModal({ onClose, onSubscribe }: { onClose: () => void, onSubscribe: () => void }) {
  const [loading, setLoading] = useState(false);

  const handleSubscribe = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
        setLoading(false);
        onSubscribe();
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#FFD700', '#FFA500', '#ffffff']
        });
        onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-yellow-500/30" onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div className="relative h-32 bg-gradient-to-r from-yellow-600 to-orange-600 flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-30"></div>
            <h2 className="text-4xl font-black text-white italic tracking-tighter relative z-10 drop-shadow-lg">TangoMaster <span className="text-yellow-200">PRO</span></h2>
            <div className="absolute -bottom-6 w-full h-12 bg-gray-900 transform -skew-y-3 origin-bottom-right"></div>
        </div>
        
        <div className="p-8 pt-4 text-white">
            <p className="text-center text-gray-400 mb-8">Unlock the ultimate learning experience.</p>

            <ul className="space-y-4 mb-8">
                {[
                    { icon: "🚫", title: "No Ads", desc: "Focus 100% on learning." },
                    { icon: "✈️", title: "Offline Mode", desc: "Study anywhere, anytime." },
                    { icon: "🤖", title: "AI Tutor", desc: "Personalized sentence generation." },
                    { icon: "🎨", title: "Exclusive Themes", desc: "Unlock 'Gold' and 'Neon' themes." }
                ].map((item, i) => (
                    <li key={i} className="flex items-center gap-4 p-3 rounded-xl bg-gray-800 hover:bg-gray-700/50 transition-colors border border-gray-700">
                        <span className="text-2xl">{item.icon}</span>
                        <div>
                            <h4 className="font-bold text-gray-200">{item.title}</h4>
                            <p className="text-xs text-gray-500">{item.desc}</p>
                        </div>
                    </li>
                ))}
            </ul>

            <div className="flex gap-4 mb-6">
                <button className="flex-1 p-4 rounded-2xl border-2 border-yellow-500/50 bg-yellow-500/10 text-center hover:bg-yellow-500/20 transition-all cursor-pointer active:scale-95">
                    <div className="text-xs text-yellow-500 font-bold uppercase tracking-widest mb-1">Monthly</div>
                    <div className="text-2xl font-bold text-white">$4.99</div>
                </button>
                <button className="flex-1 p-4 rounded-2xl border-2 border-yellow-500 bg-yellow-500 text-center hover:bg-yellow-400 transition-all transform scale-105 shadow-lg shadow-yellow-500/20 cursor-pointer active:scale-95 relative">
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">BEST VALUE</div>
                    <div className="text-xs text-yellow-900 font-bold uppercase tracking-widest mb-1">Yearly</div>
                    <div className="text-2xl font-bold text-yellow-900">$49.99</div>
                </button>
            </div>

            <button 
                onClick={handleSubscribe}
                disabled={loading}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-black text-lg tracking-wide hover:from-yellow-400 hover:to-orange-400 transform transition-all active:scale-95 shadow-xl shadow-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? "Processing..." : "Upgrade Now"}
            </button>
            
            <button onClick={onClose} className="w-full mt-4 text-sm text-gray-500 hover:text-gray-300">
                Restore Purchases
            </button>
        </div>
      </div>
    </div>
  );
}
