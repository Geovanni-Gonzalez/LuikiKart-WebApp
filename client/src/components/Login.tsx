import { useState, useEffect } from 'react';

interface LoginProps {
    onJoin: (nickname: string) => void;
}

export default function Login({ onJoin }: LoginProps) {
    const [nick, setNick] = useState('');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (nick.trim().length > 0) {
            onJoin(nick.trim());
        }
    };

    return (
        <div className="relative w-full h-[80vh] flex items-center justify-center">
            {/* Ambient Background Elements */}
            <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-full bg-gradient-to-b from-purple-500/10 to-transparent blur-3xl transition-opacity duration-1000 ${mounted ? 'opacity-100' : 'opacity-0'}`} />

            <div className={`relative z-10 w-full max-w-md transition-all duration-700 transform ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                {/* Logo / Title */}
                <div className="text-center mb-12">
                    <h1 className="text-6xl font-black mb-2 tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-purple-400 animate-gradient-x bg-[length:200%_auto]">
                        LUIKI KART
                    </h1>
                    <p className="text-gray-400 text-lg tracking-widest uppercase font-light">
                        Hyper-Speed Racing
                    </p>
                </div>

                {/* Login Card */}
                <div className="bg-gray-900/50 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-[0_0_50px_rgba(168,85,247,0.15)] overflow-hidden relative group">
                    {/* Hover Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
                        <div className="space-y-2">
                            <label htmlFor="nickname" className="text-sm font-semibold text-gray-400 uppercase tracking-wide ml-1">
                                Identify Yourself
                            </label>
                            <input
                                id="nickname"
                                type="text"
                                className="w-full bg-gray-950/50 border border-gray-700 rounded-xl px-5 py-4 text-white text-lg placeholder-gray-600 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all outline-none"
                                placeholder="Enter your racer tag..."
                                value={nick}
                                onChange={(e) => setNick(e.target.value)}
                                autoFocus
                                autoComplete="off"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={!nick.trim()}
                            className="group relative w-full overflow-hidden rounded-xl bg-white p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
                        >
                            <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                            <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-xl bg-slate-950 px-3 py-4 text-sm font-bold text-white backdrop-blur-3xl transition-all group-hover:bg-slate-900 group-disabled:opacity-50">
                                INITIALIZE ENGINE <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                            </span>
                        </button>
                    </form>
                </div>

                {/* Version Tag */}
                <div className="text-center mt-8 text-xs text-gray-600 font-mono">
                    v2.0.1 • SYSTEM READY
                </div>
            </div>
        </div>
    );
}
