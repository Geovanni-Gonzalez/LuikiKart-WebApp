import { useEffect, useState } from 'react';
import { socket } from './socket';
import Login from './components/Login';
import Lobby from './components/Lobby';
import GameRoom from './components/GameRoom';
import { useLanguage } from './contexts/LanguageContext';

export type Screen = 'login' | 'lobby' | 'game';

function App() {
  const [screen, setScreen] = useState<Screen>('login');
  const [nickname, setNickname] = useState('');
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [currentGameId, setCurrentGameId] = useState<string | null>(null);
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onRoomCreated({ gameId }: { gameId: string }) {
      setCurrentGameId(gameId);
      setScreen('game');
    }

    function onJoinedRoom({ gameId }: { gameId: string }) {
      setCurrentGameId(gameId);
      setScreen('game');
    }

    function onError({ message }: { message: string }) {
      alert(message);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('room_created', onRoomCreated);
    socket.on('joined_room', onJoinedRoom);
    socket.on('error', onError);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('room_created', onRoomCreated);
      socket.off('joined_room', onJoinedRoom);
      socket.off('error', onError);
    };
  }, []);

  const handleLogin = (nick: string) => {
    setNickname(nick);
    socket.connect();
    setScreen('lobby');
  };

  const handleLeaveGame = () => {
    socket.emit('leave_room');
    setScreen('lobby');
    setCurrentGameId(null);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans selection:bg-purple-500 selection:text-white">
      <div className="container mx-auto px-4 py-8 h-screen flex flex-col">
        {/* Header */}
        <header className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
          <h1 className="text-4xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            LUIKI KART
          </h1>
          <div className="flex items-center gap-6">
            {/* Language Selector */}
            <div className="flex bg-gray-800/50 rounded-lg p-1 border border-white/10">
              <button
                onClick={() => setLanguage('es')}
                className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${language === 'es' ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/40' : 'text-gray-400 hover:text-white'}`}
              >
                ESP
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${language === 'en' ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/40' : 'text-gray-400 hover:text-white'}`}
              >
                ENG
              </button>
            </div>

            {nickname && <span className="text-gray-400">{t('driver')}: <b className="text-white">{nickname}</b></span>}
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-red-500'}`} />
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 flex justify-center items-center">
          {screen === 'login' && <Login onJoin={handleLogin} />}
          {screen === 'lobby' && <Lobby nickname={nickname} />}
          {screen === 'game' && currentGameId && <GameRoom gameId={currentGameId} onLeave={handleLeaveGame} />}
        </main>
      </div>
    </div>
  );
}

export default App;
