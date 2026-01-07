import { Game } from './Game';
import { Player } from './Player';
import { Server } from 'socket.io';

export class Lobby {
    private games: Map<string, Game>;
    private io: Server;

    constructor(io: Server) {
        this.games = new Map();
        this.io = io;

        // Periodic cleanup of stale games (older than 3 mins and not started)
        setInterval(() => this.cleanupGames(), 60000);
    }

    public createGame(hostId: string, nickname: string, mapName: string, laps: number, maxPlayers: number): Game {
        const gameId = Math.random().toString(36).substring(2, 7).toUpperCase();

        const game = new Game(gameId, mapName, laps, maxPlayers, (id, state) => {
            this.io.to(id).emit('game_update', state);
        });

        const host = new Player(hostId, nickname);
        game.addPlayer(host);

        this.games.set(gameId, game);
        return game;
    }

    public joinGame(gameId: string, playerId: string, nickname: string): Game | null {
        const game = this.games.get(gameId);
        if (!game) return null;

        const player = new Player(playerId, nickname);
        if (game.addPlayer(player)) {
            return game;
        }
        return null;
    }

    public getGame(gameId: string): Game | undefined {
        return this.games.get(gameId);
    }

    public removePlayer(playerId: string) {
        // Find game player is in
        for (const game of this.games.values()) {
            if (game.players.has(playerId)) {
                game.removePlayer(playerId);
                this.io.to(game.id).emit('game_update', game.getState());
                if (game.players.size === 0) {
                    this.games.delete(game.id);
                }
                break;
            }
        }
    }

    public listGames() {
        return Array.from(this.games.values())
            .filter(g => g.status === 'waiting')
            .map(g => ({
                id: g.id,
                map: g.mapName,
                players: g.players.size,
                status: g.status
            }));
    }

    private cleanupGames() {
        const now = Date.now();
        for (const [id, game] of this.games) {
            if (game.status === 'waiting' && (now - game.createdTime > 180000)) { // 3 mins
                this.games.delete(id);
                // notify players?
            }
        }
    }
}
