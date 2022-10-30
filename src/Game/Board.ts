import { GameParams } from "./GameParams";
import { Drawable } from "./Drawable";
import { Updatable } from "./Updatable";
import { Tetromino } from "./Tetromino";

export class Board implements Drawable, Updatable {
  boardMap: number[][];

  color = "#082788";

  constructor(private params: GameParams) {
    this.boardMap = Array.from(
      { length: params.rows }, () => Array(params.columns).fill(0)
    );
  }
  update(deltaTime: number): void {

  }

  draw(ctx: CanvasRenderingContext2D): void {
    this.boardMap.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value > 0) {
          ctx.strokeStyle = "black";
          ctx.lineWidth = 2 / this.params.boxSize;
          ctx.strokeRect(x, y, 1, 1)
          ctx.fillStyle = this.color;
          ctx.fillRect(x, y, 1, 1);
        }
      });
    });
  }

  freezeTetromino(tetromino: Tetromino) {
    tetromino.shape.forEach((row, yIndex) => {
      row.forEach((value, xIndex) => {
        let absY = tetromino.position.y + yIndex;
        let absX = tetromino.position.x + xIndex;
        if (value > 0)
          this.boardMap[absY][absX] = 1;
      });
    });
  }
}