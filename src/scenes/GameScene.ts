import Phaser from "phaser";
import Board from "../Board";
import Button from "../Button";

class GameScene extends Phaser.Scene {
  width!: number;
  height!: number;
  fps!: Phaser.GameObjects.Text;
  board!: Board;
  constructor() {
    super("game-scene");
  }
  cols = 12;
  rows = 20;
  blocksize = 20;
  init() {
    this.width = this.game.config.width as number;
    this.height = this.game.config.height as number;
    this.board = new Board({
      cols: this.cols,
      rows: this.rows,
      blocksize: this.blocksize,
      scene: this,
    });
    this.board.reset();
  }
  create() {
    new Button(this, {
      x: 40,
      y: this.board.height + 80,
      r: 40,
      fillColor: 0x2e2e2e,
    }).onClick(() => this.input.emit("move", "left"));

    new Button(this, {
      x: 130,
      y: this.board.height + 80,
      r: 40,
      fillColor: 0x2e2e2e,
    }).onClick(() => this.input.emit("move", "right"));

    new Button(this, {
      x: 85,
      y: this.board.height + 120,
      r: 40,
      fillColor: 0x2e2e2e,
    }).onClick(() => this.input.emit("move", "down"));

    new Button(this, {
      x: 85,
      y: this.board.height + 40,
      r: 40,
      fillColor: 0x2e2e2e,
    }).onClick(() => this.input.emit("move", "up"));

    new Button(this, {
      x: this.board.width + 50,
      y: this.board.height + 80,
      r: 60,
      fillColor: 0x2e2e2e,
    }).onClick(() => this.input.emit("move", "rotate"));

    this.input.on(
      "move",
      (event: "left" | "right" | "down" | "up" | "rotate") => {
        let p = this.board.moves[event](this.board.piece);
        if (this.board.valid(p)) {
          this.board.piece.move(p);
        }
      }
    );
    this.board.draw();
    this.fps = this.add
      .text(40, 75, "", {
        font: "600 1rem sans-serif",
        color: "#ff0000",
      })
      .setDepth(10);
  }
  update() {
    let time = this.game.loop.time;
    if (time > 1000) {
      this.board.drop();
      this.game.loop.time = 0;
    }

    const fps = this.game.loop.actualFps.toFixed();
    this.fps.setText(`FPS: ${fps}`);
  }
}

export default GameScene;
