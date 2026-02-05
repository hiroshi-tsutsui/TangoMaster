import { THEMES, ThemeKey } from '../utils/themes';

export default function ThemeSelector({ currentTheme, level, onSelect, onClose }: { currentTheme: ThemeKey, level: number, onSelect: (t: ThemeKey) => void, onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 text-white text-center">
          <h2 className="text-xl font-bold">Select Theme</h2>
        </div>
        
        <div className="p-4 grid grid-cols-1 gap-2">
            {(Object.values(THEMES) as any[]).map((theme) => {
                const locked = level < theme.minLevel;
                return (
                    <button
                        key={theme.id}
                        disabled={locked}
                        onClick={() => {
                            if (!locked) {
                                onSelect(theme.id);
                                onClose();
                            }
                        }}
                        className={`p-3 rounded-xl border-2 flex justify-between items-center transition-all ${
                            currentTheme === theme.id 
                            ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' 
                            : 'border-gray-200 dark:border-gray-700'
                        } ${locked ? 'opacity-50 cursor-not-allowed grayscale' : 'hover:scale-[1.02] active:scale-95'}`}
                    >
                        <span className="font-bold text-gray-800 dark:text-gray-200">{theme.name}</span>
                        {locked && <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">Lvl {theme.minLevel}</span>}
                        {currentTheme === theme.id && <span className="text-purple-600 font-bold">✓</span>}
                    </button>
                );
            })}
        </div>
      </div>
    </div>
  );
}
