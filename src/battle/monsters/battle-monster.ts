import { Scene } from "phaser";
import { HealthBar } from "../ui/health-bar";
import { Attack } from "../../types";
import { BATTLE_ASSET_KEYS } from "../../config/asset-keys";

export type BattleMonsterConfig = {
  scene: Scene;
  monster: Monster;
  scaleHealthBarBackgroundImageByY?: number;
};

type Monster = {
  name: string;
  assetKey: string;
  assetFrame?: number;
  currentLevel: number;
  maxHp: number;
  currentHp: number;
  baseAttack: number;
  attackIds: number[];
};

type Coordinate = {
  x: number;
  y: number;
};

export class BattleMonster {
  protected scene: Scene;
  protected monsterDetails: Monster;
  protected healthBar!: HealthBar;
  protected phaserGameObject: Phaser.GameObjects.Image;
  protected currentHealth: number;
  protected maxHealth: number;
  protected monsterAttacks: Attack[];
  protected phaserHealthBarGameContainer!: Phaser.GameObjects.Container;

  constructor(config: BattleMonsterConfig, position: Coordinate) {
    this.scene = config.scene;
    this.monsterDetails = config.monster;
    this.currentHealth = this.monsterDetails.currentHp;
    this.maxHealth = this.monsterDetails.maxHp;
    this.monsterAttacks = [];

    this.phaserGameObject = this.scene.add.image(
      position.x,
      position.y,
      this.monsterDetails.assetKey,
      this.monsterDetails.assetFrame ?? 0
    );

    this.#createHealthBarComponent(config.scaleHealthBarBackgroundImageByY);
  }

  get isFainted() {
    return this.currentHealth <= 0;
  }

  get name() {
    return this.monsterDetails.name;
  }

  get attacks() {
    return [...this.monsterAttacks];
  }

  get baseAttack() {
    return this.monsterDetails.baseAttack;
  }

  get level() {
    return this.monsterDetails.currentLevel;
  }

  takeDamage(damage: number, callback?: () => void) {
    this.currentHealth -= damage;
    if (this.currentHealth < 0) {
      this.currentHealth = 0;
    }
    this.healthBar?.setMeterPercentageAnimated(
      this.currentHealth / this.maxHealth,
      { onComplete: callback }
    );
  }

  #createHealthBarComponent(scaleHealthBarBackgroundImageByY = 1) {
    this.healthBar = new HealthBar(this.scene, 34, 34);

    const monsterNameGameText = this.scene.add.text(30, 20, this.name, {
      color: "#7E3D3F",
      fontSize: "32px",
    });

    const healthBarBackgroundImage = this.scene.add
      .image(0, 0, BATTLE_ASSET_KEYS.HEALTH_BAR_BACKGROUND)
      .setOrigin(0)
      .setScale(1, scaleHealthBarBackgroundImageByY);

    const monsterHealthBarLevelText = this.scene.add.text(
      monsterNameGameText.width + 35,
      23,
      "L" + this.level,
      {
        color: "#ED474B",
        fontSize: "28px",
      }
    );

    const monsterHpText = this.scene.add.text(30, 55, "HP", {
      color: "#FF5605",
      fontSize: "24px",
      fontStyle: "italic",
    });

    this.phaserHealthBarGameContainer = this.scene.add.container(0, 0, [
      healthBarBackgroundImage,
      monsterNameGameText,
      this.healthBar.container,
      monsterHealthBarLevelText,
      monsterHpText,
    ]);
  }
}
