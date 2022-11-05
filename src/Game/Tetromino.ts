import { GameParams } from "./GameParams";
import { Drawable } from "./Drawable";
import { Key } from "./Key";
import { Updatable } from "./Updatable";
import { transpose, reverse_column } from './Math';
import { GameElement } from "./GameElement";

interface Point {
  x: number;
  y: number;
}

export class Tetromino implements Drawable, Updatable, GameElement {

  speed = 1;
  color = "green";
  position: Point = { x: 3, y: 0 };
  nextPosition = this.position;
  previousPosition = this.position;
  moveTimer = 0;
  keyListener =
    (ev: KeyboardEvent) => {
      console.log(ev.key);
      const action = ev.key as keyof typeof this.actions;
      if (this.actions[action]) {
        ev.preventDefault();
        this.actions[action]();
      }
    }

  actions = {
    [Key.A_DOWN]: () => { this.prepareMove({ x: this.position.x, y: this.position.y + 1 }) },
    [Key.A_LEFT]: () => { this.prepareMove({ x: this.position.x - 1, y: this.position.y }) },
    [Key.A_RIGHT]: () => { this.prepareMove({ x: this.position.x + 1, y: this.position.y }) },
    [Key.SPACE]: () => { this.moveInterval /= 100000; },
    [Key.R]: () => { this.rotate() },
  }

  constructor(private params: GameParams, public shape: number[][], private moveInterval = 20) {
    this.bindKeyEvents();
  }

  destroy() {
    document.removeEventListener('keydown', this.keyListener);
  }

  update(deltaTime: number): void {
    if (this.moveTimer > this.moveInterval) {
      this.prepareMove({ x: this.position.x, y: this.position.y + this.speed });
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

          var grd = ctx.createLinearGradient(0, 0, 200, 0);
          grd.addColorStop(0, this.color);
          grd.addColorStop(1, "white");
          ctx.fillStyle = grd;
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
    document.addEventListener('keydown', this.keyListener);
  }

  private rotate() {
    transpose(this.shape);
    reverse_column(this.shape);
  }
}