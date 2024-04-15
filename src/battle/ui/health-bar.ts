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
  #leftShadowCap: GameObjects.Image;
  #middleShadow: GameObjects.Image;
  #rightShadowCap: GameObjects.Image;

  constructor(scene: Scene, x: number, y: number) {
    this.#scene = scene;

    this.#leftShadowCap = this.#createLeftShadowCap(x, y);
    this.#middleShadow = this.#createMiddleShadow(
      this.#leftShadowCap.x + this.#leftShadowCap.width,
      y
    );
    this.#middleShadow.displayWidth = this.#fullWidth;
    this.#rightShadowCap = this.#createRightShadowCap(
      this.#middleShadow.x + this.#middleShadow.displayWidth,
      y
    );
    this.#leftCap = this.#createLeftCap(x, y);
    this.#middle = this.#createMiddle(this.#leftCap.x + this.#leftCap.width, y);
    this.#rightCap = this.#createRightCap(
      this.#middle.x + this.#middle.displayWidth,
      y
    );

    this.#healthBarContainer = this.#scene.add.container(x, y, [
      this.#leftShadowCap,
      this.#middleShadow,
      this.#rightShadowCap,
      this.#leftCap,
      this.#middle,
      this.#rightCap,
    ]);

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

  #createLeftShadowCap(x: number, y: number) {
    return this.#scene.add
      .image(x, y, HEALTH_BAR_ASSET_KEYS.LEFT_CAP_SHADOW)
      .setOrigin(0, 0.5)
      .setScale(1, this.#scaleY);
  }

  #createMiddleShadow(x: number, y: number) {
    return this.#scene.add
      .image(x, y, HEALTH_BAR_ASSET_KEYS.MIDDLE_SHADOW)
      .setOrigin(0, 0.5)
      .setScale(1, this.#scaleY);
  }

  #createRightShadowCap(x: number, y: number) {
    return this.#scene.add
      .image(x, y, HEALTH_BAR_ASSET_KEYS.RIGHT_CAP_SHADOW)
      .setOrigin(0, 0.5)
      .setScale(1, this.#scaleY);
  }

  #setMeterPercentage(percentage = 1) {
    const width = this.#fullWidth * percentage;

    this.#middle.displayWidth = width;
    this.#rightCap.x = this.#middle.x + this.#middle.displayWidth;
  }

  setMeterPercentageAnimated(
    percentage: number,
    options?: { duration?: number; onComplete?: () => void }
  ) {
    const width = this.#fullWidth * percentage;

    this.#scene.tweens.add({
      targets: this.#middle,
      displayWidth: width,
      duration: options?.duration ?? 1000,
      ease: Phaser.Math.Easing.Sine.Out,
      onUpdate: () => {
        this.#rightCap.x = this.#middle.x + this.#middle.displayWidth;
        const isVisible = this.#middle.displayWidth > 0;
        this.#leftCap.visible = isVisible;
        this.#middle.visible = isVisible;
        this.#rightCap.visible = isVisible;
      },
      onComplete: options?.onComplete,
    });
  }
}
