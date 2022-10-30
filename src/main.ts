import { Game } from './Game/Game';
import './style.css'

const canvasRef = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvasRef.getContext("2d")!;
const game = new Game(canvasRef.getContext("2d")!,
  { boxSize: 20, rows: 40, columns: 15 });
game.start(ctx);