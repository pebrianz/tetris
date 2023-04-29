import Phaser from "phaser";

export interface IPiece {
  pieces: Phaser.GameObjects.Rectangle[];
  shape: any[][];
  x: number;
  y: number;
  move: (p: IPiece) => void;
  draw: () => void;
}

const shapes = [
  [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
  ],
  [
    [1, 1, 1],
    [1, 0, 0],
  ],
  [
    [1, 1, 1],
    [0, 1, 0],
  ],
  [
    [1, 1, 1],
    [0, 0, 1],
  ],
  [
    [1, 1, 0],
    [0, 1, 1],
  ],
  [
    [0, 1, 1],
    [1, 1, 0],
  ],
  [
    [1, 1],
    [1, 1],
  ],
];

class Piece implements IPiece {
  pieces: Phaser.GameObjects.Rectangle[];
  constructor(public scene: Phaser.Scene, public blocksize: number) {
    this.pieces = [];
  }
  typeId = this.randomizeTetrominoType(shapes.length - 1);
  shape: any[][] = shapes[this.typeId];
  x = 5;
  y = 0;
  randomizeTetrominoType(noOfTypes: number) {
    return Math.floor(Math.random() * noOfTypes);
  }
  destroy() {
    this.shape.forEach((row) => {
      row.forEach((v) => {
        if (v instanceof Phaser.GameObjects.Rectangle) {
          v.destroy();
        }
      });
    });
  }
  move(p: IPiece) {
    this.x = p.x;
    this.y = p.y;
    this.shape = p.shape;
    this.draw();
  }
  draw() {
    this.destroy();
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
            .setOrigin(0)
            .setDepth(2);
        }
      });
    });
  }
}

export default Piece;
