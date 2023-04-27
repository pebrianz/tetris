import Phaser from "phaser";

interface IButton {
  onClick: (fn: Function) => void;
}

interface IButtonConfig {
  x: number;
  y: number;
  r: number;
  fillColor: number;
}

class Button extends Phaser.GameObjects.Ellipse implements IButton {
  constructor(public scene: Phaser.Scene, public config: IButtonConfig) {
    super(scene, config.x, config.y, config.r, config.r, config.fillColor);
    this.scene.add.existing(this);
  }
  onClick(fn: Function) {
    this.setInteractive().on("pointerdown", fn);
  }
}

export default Button;
