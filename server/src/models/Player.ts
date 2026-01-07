export class Player {
    public id: string;
    public nickname: string;
    public row: number;
    public col: number;
    public color: string;
    public isReady: boolean;
    public lapsCompleted: number;
    public lastLapUpdate: number;
    public finished: boolean;
    public finishTime: number;
    public lastMoveTime: number;
    public inventory: string | null;
    public activeEffect: string | null;

    constructor(id: string, nickname: string) {
        this.id = id;
        this.nickname = nickname;
        this.row = 0;
        this.col = 0;
        this.color = this.getRandomColor();
        this.isReady = false;
        this.lapsCompleted = 0;
        this.lastLapUpdate = 0;
        this.finished = false;
        this.finishTime = 0;
        this.finishTime = 0;
        this.lastMoveTime = 0;
        this.inventory = null;
        this.activeEffect = null;
    }

    private getRandomColor(): string {
        const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#00FFFF', '#FF00FF'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    public setPosition(r: number, c: number) {
        this.row = r;
        this.col = c;
    }
}
