import { useEffect, useState } from 'react';
import { socket } from '../socket';
import Grid from './Grid';

interface GameRoomProps {
    gameId: string;
    onLeave: () => void;
}

export default function GameRoom({ gameId, onLeave }: GameRoomProps) {
    const [gameState, setGameState] = useState<any>(null);

    useEffect(() => {
        socket.emit('get_game_state', { gameId });

        function onGameUpdate(state: any) {
            setGameState(state);
        }

        socket.on('game_update', onGameUpdate);

        return () => {
            socket.off('game_update', onGameUpdate);
        };
    }, [gameId]);

    // Keyboard inputs
    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"].indexOf(e.code) > -1) {
                e.preventDefault();
            }

            if (e.key === 'u' || e.key === 'U') {
                socket.emit('player_ready', { gameId });
            }

            let direction = '';
            if (e.key === 'ArrowUp') direction = 'UP';
            if (e.key === 'ArrowDown') direction = 'DOWN';
            if (e.key === 'ArrowLeft') direction = 'LEFT';
            if (e.key === 'ArrowRight') direction = 'RIGHT';

            if (direction) {
                socket.emit('player_input', { gameId, direction });
            }

            if (e.code === 'Space') {
                socket.emit('use_item', { gameId });
            }
        }

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [gameId]);

    if (!gameState) return (
        <div className="flex flex-col items-center justify-center h-full gap-4">
            <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
            <div className="text-xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 animate-pulse">
                ESTABLISHING LINK...
            </div>
        </div>
    );

    const myPlayer = gameState.players.find((p: any) => p.id === socket.id);
    const sortedPlayers = [...gameState.players].sort((a: any, b: any) => {
        if (a.finished && !b.finished) return -1;
        if (!a.finished && b.finished) return 1;
        if (a.finished && b.finished) return a.finishTime - b.finishTime;
        return b.lapsCompleted - a.lapsCompleted;
    });

    const isWaiting = gameState.status === 'waiting';

    return (
        <div className="relative w-full h-[85vh] flex items-center justify-center overflow-hidden">

            {/* Background Atmosphere */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-transparent to-black pointer-events-none" />

            {/* MAIN GAME CONTAINER */}
            <div className="relative z-10 flex gap-12 items-center">

                {/* LEFT PANEL: Player List & Chat (Simulated) */}
                <div className="w-72 flex flex-col gap-4">
                    <div className="bg-gray-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-xl">
                        <div className="flex justify-between items-center mb-4 pb-2 border-b border-white/5">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Leaderboard</h3>
                            <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full">
                                {gameState.players.length} Drivers
                            </span>
                        </div>
                        <div className="space-y-2">
                            {sortedPlayers.map((p: any, idx) => (
                                <div key={p.id} className={`flex items-center justify-between p-3 rounded-xl border transition-all ${p.id === socket.id ? 'bg-purple-500/10 border-purple-500/30' : 'bg-black/20 border-transparent'}`}>
                                    <div className="flex items-center gap-3">
                                        <div className="font-mono text-gray-500 text-xs w-4">#{idx + 1}</div>
                                        <div>
                                            <div className="font-bold text-white text-sm leading-none mb-1">{p.nickname}</div>
                                            <div className="text-[10px] text-gray-400">
                                                {p.finished ?
                                                    <span className="text-green-400">FINISHED</span> :
                                                    `Lap ${Math.min(p.lapsCompleted + 1, gameState.requiredLaps)}/${gameState.requiredLaps}`
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                                        {/* Show opponent items? Maybe strategy later */}
                                        {p.activeEffect && (
                                            <span className="text-[8px] bg-yellow-500 text-black px-1 rounded font-bold animate-pulse">
                                                {p.activeEffect}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* CENTER: The Grid */}
                <div className="relative">
                    <div className="absolute -inset-4 bg-gradient-to-r from-purple-500 to-pink-600 rounded-3xl blur-2xl opacity-20 animate-pulse" />
                    <div className="relative z-10 border-8 border-gray-800 rounded-2xl shadow-2xl">
                        <Grid mapData={gameState.map} players={gameState.players} />
                    </div>

                    {/* OVERLAYS */}
                    {isWaiting && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm z-20 rounded-xl">
                            <div className="text-4xl mb-4 animate-bounce">🚦</div>
                            <h2 className="text-2xl font-black text-white italic tracking-tighter mb-2">WAITING FOR DRIVERS</h2>
                            <p className="text-gray-400 text-sm font-mono bg-black/50 px-4 py-2 rounded-lg">
                                Press <span className="text-white font-bold border border-gray-600 px-1 rounded">U</span> to warm up tires
                            </p>
                        </div>
                    )}

                    {gameState.status === 'starting' && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-30 rounded-xl">
                            <div className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-t from-red-600 to-yellow-500 animate-ping">
                                GET READY
                            </div>
                        </div>
                    )}
                </div>

                {/* RIGHT PANEL: Stats / Status */}
                <div className="w-64 flex flex-col gap-4">
                    <div className="bg-gray-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl text-center">
                        <div className="text-xs text-gray-400 uppercase tracking-widest mb-2">Current Lap</div>
                        <div className="text-5xl font-black text-white mb-2 font-mono">
                            {myPlayer ? Math.min(myPlayer.lapsCompleted + 1, gameState.requiredLaps) : 1}
                            <span className="text-lg text-gray-600">/{gameState.requiredLaps}</span>
                        </div>
                    </div>

                    {/* Inventory Slot */}
                    <div className="bg-gray-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl text-center relative overflow-hidden group">
                        <div className="text-xs text-gray-400 uppercase tracking-widest mb-2">Item Slot</div>
                        <div className={`text-4xl font-bold transition-all duration-300 ${myPlayer?.inventory ? 'scale-110 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]' : 'opacity-20 scale-90'}`}>
                            {myPlayer?.inventory === 'BOOST' && '🚀'}
                            {myPlayer?.inventory === 'GHOST' && '👻'}
                            {!myPlayer?.inventory && 'EMPTY'}
                        </div>
                        {myPlayer?.inventory && (
                            <div className="absolute inset-0 border-2 border-white/20 rounded-2xl animate-pulse" />
                        )}
                        <div className="mt-2 text-[10px] text-gray-500 font-mono">
                            PRESS [SPACE]
                        </div>
                    </div>


                    <button
                        onClick={onLeave}
                        className="mt-auto w-full py-4 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 font-bold border border-red-500/30 transition-all uppercase text-sm tracking-widest"
                    >
                        Abort Race
                    </button>
                </div>

            </div>

            {/* FINISH SCREEN (Global Overlay) */}
            {gameState.status === 'finished' && (
                <div className="fixed inset-0 z-50 bg-gray-950/90 backdrop-blur-2xl flex items-center justify-center">
                    <div className="max-w-2xl w-full p-8">
                        <div className="text-center mb-12">
                            <h1 className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-yellow-500 mb-4 animate-pulse">
                                RACE FINISHED
                            </h1>
                            <p className="text-gray-400 tracking-widest uppercase">Performance Report</p>
                        </div>

                        <div className="space-y-4 mb-8">
                            {sortedPlayers.map((p: any, idx: number) => (
                                <div key={p.id} className="group flex items-center gap-6 bg-white/5 border border-white/10 p-4 rounded-2xl hover:bg-white/10 transition-colors">
                                    <div className={`text-4xl font-black w-16 text-center ${idx === 0 ? 'text-yellow-400' : idx === 1 ? 'text-gray-300' : idx === 2 ? 'text-orange-400' : 'text-gray-700'}`}>
                                        #{idx + 1}
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-2xl font-bold text-white">{p.nickname}</div>
                                        <div className="text-sm text-gray-400 font-mono">
                                            {p.finished ?
                                                `Time: ${(p.finishTime / 1000).toFixed(3)}s` :
                                                'Did not finish'
                                            }
                                        </div>
                                    </div>
                                    {idx === 0 && <div className="text-4xl animate-bounce">🏆</div>}
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={onLeave}
                            className="w-full bg-white text-black font-black text-xl py-6 rounded-2xl hover:scale-[1.02] transition-transform shadow-[0_0_40px_rgba(255,255,255,0.3)]"
                        >
                            RETURN TO BASE
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
