import Phaser from "phaser";
import Board from "../Board";
import Button from "../Button";

class GameScene extends Phaser.Scene {
  width!: number;
  height!: number;
  board!: Board;
  fps!: Phaser.GameObjects.Text;
  textScore!: Phaser.GameObjects.Text;
  constructor() {
    super("game-scene");
  }
  COLS = 12;
  ROWS = 20;
  BLOCKSIZE = 20;
  SCORE = 0;
  init() {
    this.width = this.game.config.width as number;
    this.height = this.game.config.height as number;
    this.board = new Board({
      cols: this.COLS,
      rows: this.ROWS,
      blocksize: this.BLOCKSIZE,
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
          this.board.piece.destroy();
          this.board.piece.move(p);
        }
      }
    );
    this.board.drawbg();
    this.board.draw();
    this.add
      .text(this.board.width + 24, 12, "SCORE", {
        font: "800 12px sans-serif",
        color: "#2e2e2e",
      })
      .setDepth(10)
      .setOrigin(0);
    this.textScore = this.add
      .text(this.board.width + 24, 28, "", {
        font: "800 12px sans-serif",
        color: "#2e2e2e",
      })
      .setDepth(10)
      .setOrigin(0);
    this.fps = this.add
      .text(12, 12, "", {
        font: "600 12px sans-serif",
        color: "#ffffff",
      })
      .setDepth(10)
      .setOrigin(0);
  }
  update() {
    let time = this.game.loop.time;
    if (time > 1000) {
      this.board.drop();
      this.game.loop.time = 0;
    }
    this.textScore.setText(`${this.SCORE}`);
    const fps = this.game.loop.actualFps.toFixed();
    this.fps.setText(`FPS: ${fps}`);
  }
}

export default GameScene;
