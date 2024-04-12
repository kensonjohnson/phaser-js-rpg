import { Scene, GameObjects } from "phaser";
import { HEALTH_BAR_ASSET_KEYS } from "../../config/asset-keys";

export class HealthBar {
  #scene: Scene;
  #healthBarContainer: GameObjects.Container;
  #fullWidth = 360;
  #scaleY = 0.7;

  constructor(scene: Scene, x: number, y: number) {
    this.#scene = scene;

    this.#healthBarContainer = this.#scene.add.container(x, y, []);
    this.#createHealthBarImages(x, y);
  }

  get container() {
    return this.#healthBarContainer;
  }

  #createHealthBarImages(x: number, y: number) {
    const leftCap = this.#scene.add
      .image(x, y, HEALTH_BAR_ASSET_KEYS.LEFT_CAP)
      .setOrigin(0, 0.5)
      .setScale(1, this.#scaleY);
    const middle = this.#scene.add
      .image(leftCap.x + leftCap.width, y, HEALTH_BAR_ASSET_KEYS.MIDDLE)
      .setOrigin(0, 0.5)
      .setScale(1, this.#scaleY);
    middle.displayWidth = this.#fullWidth;
    const rightCap = this.#scene.add
      .image(middle.x + middle.displayWidth, y, HEALTH_BAR_ASSET_KEYS.RIGHT_CAP)
      .setOrigin(0, 0.5)
      .setScale(1, this.#scaleY);

    this.#healthBarContainer.add([leftCap, middle, rightCap]);
  }
}
