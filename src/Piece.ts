import Phaser from "phaser";

export interface IPiece {
  pieces: Phaser.GameObjects.Rectangle[];
  shape: any[][];
  x: number;
  y: number;
  move: (p: IPiece) => void;
  draw: () => void;
}

class Piece implements IPiece {
  pieces: Phaser.GameObjects.Rectangle[];
  constructor(public scene: Phaser.Scene, public blocksize: number) {
    this.pieces = [];
  }
  shape: any[][] = [
    [2, 0, 0],
    [2, 2, 2],
    [0, 0, 0],
  ];
  x = 5;
  y = 0;
  move(p: IPiece) {
    this.shape.forEach((row) => {
      row.forEach((v) => {
        if (v !== 0) {
          v.destroy();
        }
      });
    });
    this.x = p.x;
    this.y = p.y;
    this.shape = p.shape;
    this.draw();
  }
  draw() {
    this.shape.forEach((row, y) => {
      row.forEach((v, x) => {
        if (v !== 0) {
          this.shape[y][x] = this.scene.add
            .rectangle(
              (this.x + x) * this.blocksize,
              (this.y + y) * this.blocksize,
              this.blocksize,
              this.blocksize,
              0xffffff
            )
            .setStrokeStyle(1)
            .setOrigin(0);
        }
      });
    });
  }
}

export default Piece;
