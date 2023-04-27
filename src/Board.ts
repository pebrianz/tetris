import Phaser from "phaser";
import Piece, { IPiece } from "./Piece";

export interface IBoardConfig {
  cols: number;
  rows: number;
  blocksize: number;
  scene: Phaser.Scene;
}

export interface IBoard {
  grid: any[][];
  piece: IPiece;
  draw: () => void;
  rotate: (p: IPiece) => IPiece;
  reset: () => void;
  width: number;
  height: number;
  valid: (p: IPiece) => boolean;
}

class Board implements IBoard, IBoardConfig {
  scene: Phaser.Scene;
  cols: number;
  rows: number;
  blocksize: number;
  width: number;
  height: number;
  piece: Piece;
  constructor(public config: IBoardConfig) {
    this.scene = config.scene;
    this.cols = config.cols;
    this.rows = config.rows;
    this.blocksize = config.blocksize;
    this.width = config.cols * config.blocksize;
    this.height = config.rows * config.blocksize;
    this.piece = new Piece(this.scene, config.blocksize);
  }
  grid = this.getEmptyGrid();
  moves = {
    left: (p: IPiece) => ({ ...p, x: p.x - 1 }),
    right: (p: IPiece) => ({ ...p, x: p.x + 1 }),
    down: (p: IPiece) => ({ ...p, y: p.y + 1 }),
    up: (p: IPiece) => {
      let piece = this.moves.down(p);
      while (this.valid(piece)) {
        this.piece.move(piece);
        piece = this.moves.down(piece);
      }
      this.freeze();
      this.draw();
      this.clearLines();
      this.piece.x = 5;
      this.piece.y = 0;
      this.draw();
      this.scene.game.loop.time = 0;
      return piece;
    },
    rotate: (p: IPiece) => this.rotate(p),
  };
  clearLines() {
    this.grid.forEach((row, y) => {
      if (row.every((value) => value !== 0)) {
        row.forEach((v: Phaser.GameObjects.Rectangle) => v.destroy());
        this.grid.splice(y, 1);
        this.grid.unshift(Array(this.cols).fill(0));
      }
    });
  }
  freeze() {
    this.piece.shape.forEach((row, y) => {
      row.forEach((v, x) => {
        if (v !== 0) {
          this.grid[y + this.piece.y][x + this.piece.x] = v;
        }
      });
    });
  }
  drop() {
    let p = this.moves.down(this.piece);
    if (this.valid(p)) {
      this.piece.move(p);
    } else {
      this.freeze();
      this.clearLines();
      this.piece.x = 5;
      this.piece.y = 0;
      this.draw();
    }
  }
  draw() {
    this.drawBoard();
    this.piece.draw();
  }
  drawBoard() {
    this.scene.add
      .rectangle(0, 0, this.width, this.height, 0x2e2e2e)
      .setOrigin(0)
      .setStrokeStyle(1);

    this.grid.forEach((row, y) => {
      row.forEach((v, x) => {
        if (v !== 0) {
          this.grid[y][x] = this.scene.add
            .rectangle(
              x * this.blocksize,
              y * this.blocksize,
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
  rotate(p: IPiece) {
    const shape = JSON.parse(JSON.stringify(p.shape));
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < y; x++) {
        [shape[x][y], shape[y][x]] = [shape[y][x], shape[x][y]];
      }
    }
    shape.forEach((row: number[]) => row.reverse());
    return { ...p, shape };
  }
  reset() {
    this.grid = this.getEmptyGrid();
  }
  getEmptyGrid() {
    return Array.from({ length: this.rows }, () => Array(this.cols).fill(0));
  }
  isEmpty(v: number): boolean {
    return v === 0;
  }
  isInsideWall(x: number): boolean {
    return x >= 0 && x < this.width;
  }
  isAboveFloor(y: number): boolean {
    return y < this.height;
  }
  isNotOccupied(x: number, y: number): boolean {
    return this.grid[y] && this.grid[y][x] === 0;
  }
  valid(p: IPiece): boolean {
    return p.shape.every((row, dy) => {
      return row.every((v, dx) => {
        let x = (p.x + dx) * this.config.blocksize;
        let y = (p.y + dy) * this.config.blocksize;
        return (
          this.isEmpty(v) ||
          (this.isInsideWall(x) &&
            this.isAboveFloor(y) &&
            this.isNotOccupied(p.x + dx, p.y + dy))
        );
      });
    });
  }
}

export default Board;
