import { Scene, GameObjects } from "phaser";
import { HEALTH_BAR_ASSET_KEYS } from "../../config/asset-keys";

export class HealthBar {
  #scene: Scene;
  #healthBarContainer: GameObjects.Container;
  #fullWidth = 360;
  #scaleY = 0.7;
  #leftCap: GameObjects.Image;
  #middle: GameObjects.Image;
  #rightCap: GameObjects.Image;

  constructor(scene: Scene, x: number, y: number) {
    this.#scene = scene;

    this.#healthBarContainer = this.#scene.add.container(x, y, []);
    this.#leftCap = this.#createLeftCap(x, y);
    this.#middle = this.#createMiddle(this.#leftCap.x + this.#leftCap.width, y);
    this.#rightCap = this.#createRightCap(
      this.#middle.x + this.#middle.displayWidth,
      y
    );
    this.#healthBarContainer.add([this.#leftCap, this.#middle, this.#rightCap]);

    this.#setMeterPercentage(1);
  }

  get container() {
    return this.#healthBarContainer;
  }

  #createLeftCap(x: number, y: number) {
    return this.#scene.add
      .image(x, y, HEALTH_BAR_ASSET_KEYS.LEFT_CAP)
      .setOrigin(0, 0.5)
      .setScale(1, this.#scaleY);
  }

  #createMiddle(x: number, y: number) {
    return this.#scene.add
      .image(x, y, HEALTH_BAR_ASSET_KEYS.MIDDLE)
      .setOrigin(0, 0.5)
      .setScale(1, this.#scaleY);
  }

  #createRightCap(x: number, y: number) {
    return this.#scene.add
      .image(x, y, HEALTH_BAR_ASSET_KEYS.RIGHT_CAP)
      .setOrigin(0, 0.5)
      .setScale(1, this.#scaleY);
  }

  #setMeterPercentage(percentage = 1) {
    const width = this.#fullWidth * percentage;

    this.#middle.displayWidth = width;
    this.#rightCap.x = this.#middle.x + this.#middle.displayWidth;
  }
}
