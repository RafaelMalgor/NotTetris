import { GameParams } from "./GameParams";
import { Drawable } from "./Drawable";
import { Key } from "./Key";
import { Updatable } from "./Updatable";

interface Point {
  x: number;
  y: number;
}

export class Tetromino implements Drawable, Updatable {
  // shape = [
  //   [2, 0, 0],
  //   [2, 2, 2],
  //   [0, 0, 0]
  // ];

  color = "green";
  position: Point = { x: 3, y: 0 };
  nextPosition = this.position;
  previousPosition = this.position;
  moveTimer = 0;

  actions = {
    [Key.A_DOWN]: () => { this.prepareMove({ x: this.position.x, y: this.position.y + 1 }) },
    [Key.A_LEFT]: () => { this.prepareMove({ x: this.position.x - 1, y: this.position.y }) },
    [Key.A_RIGHT]: () => { this.prepareMove({ x: this.position.x + 1, y: this.position.y }) },
    [Key.SPACE]: () => { this.moveInterval /= 40 }
  }

  constructor(private params: GameParams,private shape, private moveInterval = 500) {
    this.bindKeyEvents();
  }

  update(deltaTime: number): void {
    if (this.moveTimer > this.moveInterval) {
      this.prepareMove({ x: this.position.x, y: this.position.y + 1 });
      this.moveTimer = 0;
    } else {
      this.moveTimer += deltaTime;
    }
    this.move();
  }

  draw(ctx: CanvasRenderingContext2D): void {
    this.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value > 0) {
          ctx.strokeStyle = "black";
          ctx.lineWidth = 2 / this.params.boxSize;
          ctx.strokeRect(this.position.x + x, this.position.y + y, 1, 1)
          ctx.fillStyle = this.color;
          ctx.fillRect(this.position.x + x, this.position.y + y, 1, 1);
        }
      });
    });
  }

  revertLastMove() {
    this.position = this.previousPosition;
  }

  prepareMove(p: Point) {
    this.nextPosition = p;
  }

  private move() {
    this.previousPosition = this.position;
    this.position = this.nextPosition;
  }

  private bindKeyEvents() {
    document.addEventListener('keydown', (ev: KeyboardEvent) => {
      console.log(ev.key);
      const action = ev.key as keyof typeof this.actions;
      if (this.actions[action]) {
        ev.preventDefault();
        this.actions[action]();
      }
    });
  }


}