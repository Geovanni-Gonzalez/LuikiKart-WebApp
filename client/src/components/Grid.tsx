import { useLanguage } from '../contexts/LanguageContext';

interface GridProps {
    mapData: any;
    players: any[];
}

export default function Grid({ mapData, players }: GridProps) {
    const { t } = useLanguage();
    if (!mapData || !mapData.grid) return (
        <div className="flex items-center justify-center p-12 bg-gray-900/50 rounded-xl border border-dashed border-gray-700">
            <div className="animate-spin text-4xl mr-4">⚙️</div>
            <div className="text-white font-mono">{t('loading_circuit')}</div>
        </div>
    );

    const cellSize = 20;

    const getCellClass = (char: string) => {
        switch (char) {
            case 'W': return 'bg-gray-900 border-gray-800/50 shadow-inner'; // Wall
            case '.': return 'bg-gray-800/30'; // Road
            case 'S': return 'bg-yellow-500/20 border border-yellow-500/30 animate-pulse'; // Start
            case '?': return 'bg-blue-500/20 border border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.5)] animate-pulse'; // Item Box
            default: return 'bg-black';
        }
    };

    return (
        <div
            className="relative bg-black/60 backdrop-blur-sm rounded-xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-gray-700/50"
            style={{
                width: mapData.grid[0].length * cellSize,
                height: mapData.grid.length * cellSize
            }}
        >
            {/* Draw Grid */}
            {mapData.grid.map((row: string, r: number) => (
                <div key={r} className="flex h-[20px]">
                    {row.split('').map((cell, c) => (
                        <div
                            key={`${r}-${c}`}
                            className={`w-[20px] h-[20px] ${getCellClass(cell)}`}
                        />
                    ))}
                </div>
            ))}

            {/* Draw Players */}
            {players.map(p => (
                <div
                    key={p.id}
                    className="absolute w-[16px] h-[16px] transition-all duration-300 ease-out z-10"
                    style={{
                        top: p.row * cellSize + 2,
                        left: p.col * cellSize + 2
                    }}
                >
                    {/* Glow Effect */}
                    <div
                        className="absolute inset-0 rounded-full blur-[4px] opacity-60"
                        style={{ backgroundColor: p.color }}
                    />

                    {/* Car Body */}
                    <div
                        className="relative w-full h-full rounded-sm border-[1.5px] border-white/80 shadow-sm transform hover:scale-110 transition-transform"
                        style={{ backgroundColor: p.color }}
                    >
                        {/* Direction/Headlights indicator could go here */}
                    </div>

                    {/* Nickname Tag */}
                    <div
                        className="absolute -top-6 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-black/80 rounded text-[9px] text-white whitespace-nowrap font-bold border border-gray-700/50 pointer-events-none"
                    >
                        {p.nickname}
                    </div>
                </div>
            ))}
        </div>
    );
}
