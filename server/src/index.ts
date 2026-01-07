import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { Lobby } from './models/Lobby';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const lobby = new Lobby(io);

// API Routes
app.get('/api/maps', (req, res) => {
    const mapsDir = path.join(__dirname, '../maps');
    fs.readdir(mapsDir, (err, files) => {
        if (err) {
            return res.status(500).json({ error: 'Unable to list maps' });
        }
        const mapFiles = files.filter(f => f.endsWith('.json') || f.endsWith('.txt'));
        res.json(mapFiles);
    });
});

app.get('/api/rooms', (req, res) => {
    res.json(lobby.listGames());
});

// Socket.io Events
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('create_room', (data) => {
        // data: { nickname, map, laps, maxPlayers }
        const { nickname, map, laps, maxPlayers } = data;
        const game = lobby.createGame(socket.id, nickname, map || 'track1.json', laps || 3, maxPlayers || 2);
        socket.join(game.id);
        socket.emit('room_created', { gameId: game.id });
        socket.emit('game_update', game.getState());
        io.emit('rooms_update', lobby.listGames()); // Broadcast room list update
    });

    socket.on('join_room', (data) => {
        // data: { gameId, nickname }
        const { gameId, nickname } = data;
        const game = lobby.joinGame(gameId, socket.id, nickname);
        if (game) {
            socket.join(gameId);
            socket.emit('joined_room', { gameId });
            io.to(gameId).emit('game_update', game.getState());
            io.emit('rooms_update', lobby.listGames());
        } else {
            socket.emit('error', { message: 'Room not found or game already started' });
        }
    });

    socket.on('player_ready', (data) => {
        const { gameId } = data;
        const game = lobby.getGame(gameId);
        if (game) {
            game.setPlayerReady(socket.id);
            // game_update will be broadcasted by Game class if state changes
            io.to(gameId).emit('game_update', game.getState());
        }
    });

    socket.on('player_input', (data) => {
        const { gameId, direction } = data;
        const game = lobby.getGame(gameId);
        if (game) {
            game.movePlayer(socket.id, direction);
        }
    });

    socket.on('get_game_state', (data) => {
        const { gameId } = data;
        const game = lobby.getGame(gameId);
        if (game) {
            socket.emit('game_update', game.getState());
        }
    });

    socket.on('leave_room', () => {
        lobby.removePlayer(socket.id);
        io.emit('rooms_update', lobby.listGames());
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        lobby.removePlayer(socket.id);
        io.emit('rooms_update', lobby.listGames());
    });
});

const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
