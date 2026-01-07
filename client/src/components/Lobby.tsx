import { useState, useEffect } from 'react';
import { socket } from '../socket';

interface LobbyProps {
    nickname: string;
}

export default function Lobby({ nickname }: LobbyProps) {
    const [rooms, setRooms] = useState<any[]>([]);

    // Create Form State
    const [newMapName, setNewMapName] = useState('track1.json');
    const [newLaps, setNewLaps] = useState(3);
    const [newMaxPlayers, setNewMaxPlayers] = useState(2);
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        socket.emit('list_rooms');

        function onRoomList(list: any[]) {
            setRooms(list);
        }

        socket.on('room_list', onRoomList);

        // Auto refresh
        const interval = setInterval(() => {
            socket.emit('list_rooms');
        }, 2000);

        return () => {
            socket.off('room_list', onRoomList);
            clearInterval(interval);
        };
    }, []);

    const handleCreateGame = (e: React.FormEvent) => {
        e.preventDefault();
        socket.emit('create_room', {
            nickname,
            map: newMapName,
            laps: newLaps,
            maxPlayers: newMaxPlayers
        });
    };

    const handleJoinGame = (gameId: string) => {
        socket.emit('join_room', { gameId, nickname });
    };

    return (
        <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 h-[80vh]">

            {/* Sidebar / Create Panel */}
            <div className="lg:col-span-4 flex flex-col gap-6">
                <div className="bg-gray-900/40 backdrop-blur-xl border border-white/10 p-6 rounded-3xl h-full flex flex-col shadow-2xl">
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500 mb-2">
                            Race Control
                        </h2>
                        <div className="text-sm text-gray-400">
                            Welcome back, <span className="text-white font-semibold">{nickname}</span>
                        </div>
                    </div>

                    {!isCreating ? (
                        <div className="flex-1 flex flex-col justify-center gap-4">
                            <button
                                onClick={() => setIsCreating(true)}
                                className="group relative overflow-hidden rounded-2xl bg-purple-600 p-8 text-left transition-all hover:bg-purple-500 hover:shadow-2xl hover:shadow-purple-500/20"
                            >
                                <div className="absolute right-0 top-0 opacity-10 transform translate-x-1/2 -translate-y-1/2">
                                    <svg className="w-64 h-64" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" /></svg>
                                </div>
                                <h3 className="text-2xl font-bold mb-2">Create New Race</h3>
                                <p className="text-purple-200">Host your own lobby and customize the rules.</p>
                                <div className="mt-4 inline-flex items-center text-sm font-bold uppercase tracking-wider">
                                    Initialize <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                                </div>
                            </button>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-800/50 p-4 rounded-2xl border border-gray-700">
                                    <div className="text-3xl font-bold text-white mb-1">0</div>
                                    <div className="text-xs text-gray-400 uppercase">Wins</div>
                                </div>
                                <div className="bg-gray-800/50 p-4 rounded-2xl border border-gray-700">
                                    <div className="text-3xl font-bold text-white mb-1">Rank 1</div>
                                    <div className="text-xs text-gray-400 uppercase">Division</div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleCreateGame} className="flex-1 flex flex-col gap-6 animate-fadeIn">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">Track Selection</label>
                                    <select
                                        className="w-full bg-gray-950 border border-gray-700 rounded-xl px-4 py-3 outline-none focus:border-purple-500 transition-colors"
                                        value={newMapName}
                                        onChange={e => setNewMapName(e.target.value)}
                                    >
                                        <option value="track1.json">Circuit 1 (Standard)</option>
                                        <option value="track2.json">Circuit 2 (Complex)</option>
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">Laps</label>
                                        <input
                                            type="number" min="1" max="10"
                                            className="w-full bg-gray-950 border border-gray-700 rounded-xl px-4 py-3 outline-none focus:border-purple-500 transition-colors"
                                            value={newLaps}
                                            onChange={e => setNewLaps(Number(e.target.value))}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">Max Players</label>
                                        <input
                                            type="number" min="2" max="5"
                                            className="w-full bg-gray-950 border border-gray-700 rounded-xl px-4 py-3 outline-none focus:border-purple-500 transition-colors"
                                            value={newMaxPlayers}
                                            onChange={e => setNewMaxPlayers(Number(e.target.value))}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-auto flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsCreating(false)}
                                    className="px-6 py-4 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-95"
                                >
                                    Launch Lobby
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>

            {/* Main Content / Room List */}
            <div className="lg:col-span-8 flex flex-col h-full overflow-hidden">
                <div className="flex justify-between items-end mb-6">
                    <h2 className="text-3xl font-black text-white">Live Feeds</h2>
                    <div className="flex items-center gap-2 text-sm text-green-400 bg-green-900/20 px-3 py-1 rounded-full border border-green-900/30">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        Network Online
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto pr-2 pb-4 space-y-4 custom-scrollbar">
                    {rooms.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-600 border-2 border-dashed border-gray-800 rounded-3xl p-12">
                            <div className="text-6xl mb-4 grayscale opacity-20">🏎️</div>
                            <h3 className="text-xl font-bold mb-2">No Active Signals</h3>
                            <p>The track is quiet. Be the one to start the engine.</p>
                        </div>
                    ) : (
                        rooms.map(room => (
                            <div key={room.id} className="group relative bg-gray-900/60 backdrop-blur-md border border-white/5 p-6 rounded-2xl hover:border-purple-500/50 transition-all hover:bg-gray-800/80">
                                <div className="flex justify-between items-center relative z-10">
                                    <div className="flex items-center gap-6">
                                        <div className="w-16 h-16 bg-gray-800 rounded-xl flex items-center justify-center text-2xl border border-gray-700 group-hover:border-purple-500/50 transition-colors">
                                            🏁
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <h4 className="text-xl font-bold text-white">{room.map}</h4>
                                                <span className="text-xs font-mono bg-gray-800 text-gray-400 px-2 py-0.5 rounded">#{room.id}</span>
                                            </div>
                                            <div className="flex items-center gap-4 text-sm text-gray-400">
                                                <div className="flex items-center gap-1">
                                                    <span className={`w-2 h-2 rounded-full ${room.status === 'waiting' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                                                    {room.status.toUpperCase()}
                                                </div>
                                                <div>•</div>
                                                <div>{room.players} Racers</div>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => handleJoinGame(room.id)}
                                        disabled={room.status !== 'waiting'}
                                        className="px-8 py-3 rounded-xl font-bold bg-white text-gray-900 hover:bg-purple-400 transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
                                    >
                                        JOIN
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

// Add this CSS to your globals or component for the custom scrollbar if needed
// .custom-scrollbar::-webkit-scrollbar { width: 6px; }
// .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
// .custom-scrollbar::-webkit-scrollbar-thumb { background: #374151; border-radius: 3px; }
// .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #4B5563; }
