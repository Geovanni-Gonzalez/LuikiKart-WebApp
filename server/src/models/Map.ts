import fs from 'fs';
import path from 'path';

export interface MapData {
    name: string;
    theme: string;
    grid: string[]; // Array of strings representing rows
    startPositions: { r: number; c: number }[];
}

export class GameMap {
    public data: MapData;
    public width: number;
    public height: number;

    constructor() {
        this.data = {
            name: 'Unknown',
            theme: 'default',
            grid: [],
            startPositions: []
        };
        this.width = 0;
        this.height = 0;
    }

    public loadFromFile(filename: string): void {
        const filePath = path.join(__dirname, '../../maps', filename);
        try {
            const fileContent = fs.readFileSync(filePath, 'utf-8');
            const jsonData = JSON.parse(fileContent);

            this.data = jsonData;
            this.height = this.data.grid.length;
            this.width = this.height > 0 ? this.data.grid[0].length : 0;

            // Validate start positions if not in JSON? 
            // We assume JSON has them or we parse 'S' from grid.
        } catch (error) {
            console.error(`Error loading map ${filename}:`, error);
        }
    }

    public isValidMove(r: number, c: number): boolean {
        if (r < 0 || r >= this.height || c < 0 || c >= this.width) return false;

        const cell = this.data.grid[r][c];
        // Assume 'X' or 'W' is wall. '.' or ' ' is road. 'S' is start.
        return cell !== 'X' && cell !== 'W';
    }

    public getTile(r: number, c: number): string {
        if (r < 0 || r >= this.height || c < 0 || c >= this.width) return '#';
        return this.data.grid[r][c];
    }
}
