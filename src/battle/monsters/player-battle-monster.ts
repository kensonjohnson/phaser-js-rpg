import { BattleMonster, type BattleMonsterConfig } from "./battle-monster";

enum PLAYER_POSITION {
  x = 256,
  y = 316,
}

export class PlayerBattleMonster extends BattleMonster {
  #healthBarTextGameObject!: Phaser.GameObjects.Text;

  constructor(config: BattleMonsterConfig) {
    super(config, PLAYER_POSITION);
    this.phaserGameObject.setFlipX(true);
    this.phaserHealthBarGameContainer?.setPosition(556, 318);

    this.#addHealthBarComponent();
  }

  #setHealthBarText() {
    this.#healthBarTextGameObject.setText(
      `${this.currentHealth}/${this.maxHealth}`
    );
  }

  #addHealthBarComponent() {
    this.#healthBarTextGameObject = this.scene.add
      .text(443, 80, "", {
        color: "#7E3D3F",
        fontSize: "16px",
      })
      .setOrigin(1, 0);
    this.#setHealthBarText();

    this.phaserHealthBarGameContainer.add(this.#healthBarTextGameObject);
  }

  takeDamage(damage: number, callback?: (() => void) | undefined): void {
    super.takeDamage(damage, callback);
    this.#setHealthBarText();
  }
}
