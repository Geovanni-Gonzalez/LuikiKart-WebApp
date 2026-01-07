import { Player } from './Player';
import { GameMap } from './Map';

export class Game {
    public id: string;
    public map: GameMap;
    public players: Map<string, Player>;
    public status: 'waiting' | 'starting' | 'active' | 'finished';
    public requiredLaps: number;
    public maxPlayers: number;
    public mapName: string;
    public createdTime: number;
    public startTime: number;

    private loopInterval: NodeJS.Timeout | null = null;
    private onStateUpdate: (gameId: string, state: any) => void;

    // "La partida estará creada por 3 minutos... si no es iniciada, se cierra"
    // We need a timeout for that.

    constructor(id: string, mapName: string, laps: number, maxPlayers: number, onStateUpdate: (id: string, state: any) => void) {
        this.id = id;
        this.mapName = mapName;
        this.requiredLaps = laps;
        this.maxPlayers = maxPlayers;
        this.players = new Map();
        this.status = 'waiting';
        this.map = new GameMap();
        this.map.loadFromFile(mapName); // e.g. "track1.json"
        this.createdTime = Date.now();
        this.startTime = 0;
        this.onStateUpdate = onStateUpdate;
    }

    public addPlayer(player: Player): boolean {
        if (this.status !== 'waiting') return false;
        // Assign start position
        const startPosIndex = this.players.size % this.map.data.startPositions.length;
        const pos = this.map.data.startPositions[startPosIndex];
        player.setPosition(pos.r, pos.c);

        this.players.set(player.id, player);
        return true;
    }

    public removePlayer(playerId: string) {
        this.players.delete(playerId);
        if (this.players.size === 0) {
            this.stopGame();
        }
    }

    public setPlayerReady(playerId: string) {
        const player = this.players.get(playerId);
        if (player) {
            player.isReady = true;
            this.checkStartCondition();
        }
    }

    // Check if we can transition to 'starting'
    private checkStartCondition() {
        if (this.players.size < 2) return; // Min 2 players
        // Strict requirement: "Una vez que se completen los usuarios... se habilitará"
        if (this.players.size < this.maxPlayers) return;

        const allReady = Array.from(this.players.values()).every(p => p.isReady);
        if (allReady) {
            // We might need an explicit "Start" button from host, but prompt says:
            // "Una vez completen los usuarios... se habilitará un botón para entrar...
            // Para iniciar se debe presionar la tecla u"
            // So users press 'U' to ready? Or 'Enter' button? 
            // Let's assume 'U' key sets ready. when all ready -> countdown -> start.
            this.startCountdown();
        }
    }

    public startCountdown() {
        this.status = 'starting';
        this.broadcastState();
        setTimeout(() => {
            this.startGame();
        }, 3000); // 3 seconds
    }

    public startGame() {
        this.status = 'active';
        this.startTime = Date.now();
        this.broadcastState();

        // Start Loop if needed for server-side checks (timers, collisions?)
        // Requirement: "La posición de los rivales se actualiza cada 0.5 segundos, o bien, cada vez que varíe."
        // We can just emit on change. But maybe a heartbeat is good.
    }

    public movePlayer(playerId: string, direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') {
        if (this.status !== 'active') return;
        const player = this.players.get(playerId);
        if (!player || player.finished) return;

        // Rate limit: 10 moves per second (100ms)
        const now = Date.now();
        if (now - player.lastMoveTime < 100) return;

        let newR = player.row;
        let newC = player.col;

        if (direction === 'UP') newR--;
        if (direction === 'DOWN') newR++;
        if (direction === 'LEFT') newC--;
        if (direction === 'RIGHT') newC++;

        if (this.map.isValidMove(newR, newC)) {
            const currentTile = this.map.getTile(player.row, player.col);
            const newTile = this.map.getTile(newR, newC);

            // Lap Logic: If moving onto 'S' (Start/Finish) from '.' (Road)
            // Simplified: We assume clockwise. 
            // Better: If on 'S' and valid lap time passed (>5s), count lap.
            if (newTile === 'S' && currentTile !== 'S') {
                // Check if enough time passed to prevent instant lap bounce
                // Assuming a lap takes at least 10 seconds
                if (now - player.lastLapUpdate > 10000) {
                    player.lapsCompleted++;
                    player.lastLapUpdate = now;

                    if (player.lapsCompleted > this.requiredLaps) {
                        player.finished = true;
                        player.finishTime = now - this.startTime;
                        this.checkWinCondition();
                    }
                }
            }

            player.setPosition(newR, newC);
            player.lastMoveTime = now;
            this.broadcastState();
        }
    }

    private checkWinCondition() {
        const allFinished = Array.from(this.players.values()).every(p => p.finished);
        if (allFinished) {
            this.stopGame();
        }
    }

    public stopGame() {
        if (this.loopInterval) clearInterval(this.loopInterval);
        this.status = 'finished';
        this.broadcastState();
    }

    public broadcastState() {
        // Construct a serializable state object
        const playersArr = Array.from(this.players.values());
        const state = {
            id: this.id,
            status: this.status,
            players: playersArr,
            map: this.map.data, // heavy? maybe send map only once or name
            startTime: this.startTime,
            requiredLaps: this.requiredLaps
        };
        this.onStateUpdate(this.id, state);
    }

    public getState() {
        const playersArr = Array.from(this.players.values());
        return {
            id: this.id,
            status: this.status,
            players: playersArr,
            mapName: this.mapName, // Client loads map by name
            startTime: this.startTime,
            requiredLaps: this.requiredLaps
        };
    }
}
