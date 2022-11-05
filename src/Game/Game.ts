import { Board } from "./Board";
import { GameParams } from "./GameParams";
import { Drawable } from "./Drawable";
import { Tetromino } from "./Tetromino";
import { Updatable } from "./Updatable";
import ValidShapes from "./TetrominoShapes";

export class Game implements Drawable, Updatable {
  board: Board;
  currentTetromino: Tetromino;

  validShapes = ValidShapes;
  completedRowsCount = 0;

  constructor(
    ctx: CanvasRenderingContext2D,
    private params: GameParams) {
    this.board = new Board(
      params,
      () => { this.completedRowsCount++ },
      () => { console.log("GAME OVER!!") });
    this.currentTetromino = this.getRandomTetromino();
    ctx.canvas.width = params.columns * params.boxSize;
    ctx.canvas.height = params.rows * params.boxSize;
  }

  start(ctx: CanvasRenderingContext2D) {
    let lastTime = 0;
    const tick = (timeStamp: number) => {
      const deltaTime = timeStamp - lastTime;
      lastTime = timeStamp;
      this.update(deltaTime);
      this.draw(ctx);
      requestAnimationFrame(tick)
    };
    tick(0);
  }

  update(deltaTime: number): void {
    this.board.update(deltaTime);
    this.currentTetromino.update(deltaTime);
    this.checkCollisions();
  }

  public draw(ctx: CanvasRenderingContext2D) {
    this.clear(ctx);
    this.board.draw(ctx);
    this.currentTetromino.draw(ctx);
  }

  private checkCollisions() {
    if (!this.checkInsideWalls(this.currentTetromino)) {
      this.currentTetromino.revertLastMove();
    }
    if (this.checkBoardCollision(this.currentTetromino, this.board)) {
      const collitionPosition = this.currentTetromino.position;
      this.currentTetromino.revertLastMove();
      if (collitionPosition.y > this.currentTetromino.position.y) {
        this.board.freezeTetromino(this.currentTetromino);
        this.currentTetromino.destroy();
        this.currentTetromino = this.getRandomTetromino();
      }
    }
  }
  private clear(ctx: CanvasRenderingContext2D) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(this.params.boxSize, this.params.boxSize);
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  }

  private checkInsideWalls(tetromino: Tetromino): boolean {
    let inside = true;
    tetromino.shape.forEach((row) => {
      row.forEach((value, xIndex) => {
        let absX = tetromino.position.x + xIndex;
        inside = inside && (value <= 0 || absX >= 0 && absX < this.params.columns);
      });
    });
    return inside;
  }

  private checkBoardCollision(tetromino: Tetromino, board: Board): boolean {
    let touchedBottom = false;
    tetromino.shape.forEach((row, yIndex) => {
      row.forEach((value, xIndex) => {
        let absX = tetromino.position.x + xIndex;
        let absY = tetromino.position.y + yIndex;
        touchedBottom = touchedBottom || (value > 0 && absY >= this.params.rows);
        touchedBottom = touchedBottom || (value > 0 && board.boardMap[absY][absX] > 0);
      });
    });
    return touchedBottom;
  }

  private getRandomTetromino(): Tetromino {
    return new Tetromino(this.params, this.validShapes[Math.floor(Math.random() * this.validShapes.length)], 500 - (100 * this.completedRowsCount));
  }
}