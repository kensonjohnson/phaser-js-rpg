import { Scene } from "phaser";
import { MONSTER_ASSET_KEYS } from "../config/asset-keys";
import { SCENE_KEYS } from "../config/scene-keys";
import { BattleMenu } from "../battle/ui/menu/battle-menu";
import { DIRECTION } from "../common/direction";
import { Background } from "../battle/background";
import { EnemyBattleMonster } from "../battle/monsters/enemy-battle-monster";
import { PlayerBattleMonster } from "../battle/monsters/player-battle-monster";

export class BattleScene extends Scene {
  #battleMenu!: BattleMenu;
  #cursorKeys?: Phaser.Types.Input.Keyboard.CursorKeys;
  #activeEnemyMonster!: EnemyBattleMonster;
  #activePlayerMonster!: PlayerBattleMonster;

  constructor() {
    super({ key: SCENE_KEYS.BATTLE });
  }

  create() {
    // Add the background image
    const background = new Background(this);
    background.showForest();

    // Create player health bar
    this.#activeEnemyMonster = new EnemyBattleMonster({
      scene: this,
      monster: {
        name: MONSTER_ASSET_KEYS.CARNODUSK,
        assetKey: MONSTER_ASSET_KEYS.CARNODUSK,
        currentLevel: 5,
        maxHp: 25,
        currentHp: 25,
        attackIds: [],
        baseAttack: 5,
      },
    });

    this.#activePlayerMonster = new PlayerBattleMonster({
      scene: this,
      monster: {
        name: MONSTER_ASSET_KEYS.IGUANIGNITE,
        assetKey: MONSTER_ASSET_KEYS.IGUANIGNITE,
        currentLevel: 5,
        maxHp: 25,
        currentHp: 25,
        attackIds: [],
        baseAttack: 5,
      },
    });

    // Render out the main info and sub info panes
    this.#battleMenu = new BattleMenu(this);
    this.#battleMenu.showMainBattleMenu();

    this.#cursorKeys = this.input.keyboard?.createCursorKeys();

    this.#activeEnemyMonster.takeDamage(10, () => {
      this.#activePlayerMonster?.takeDamage(5);
    });
  }

  update(_time: number, _delta: number): void {
    const wasSpaceKeyPressed = Phaser.Input.Keyboard.JustDown(
      this.#cursorKeys?.space!
    );
    if (wasSpaceKeyPressed) {
      this.#battleMenu?.handlePlayerInput("OK");

      // Check if the player has selected an attack and update the UI
      if (this.#battleMenu?.selectedAttack === undefined) return;
      this.#battleMenu.hideMonsterAttackSubMenu();
      this.#battleMenu.updateInfoPaneMessagesAndWaitForInput(
        ["Your monster attacks!"],
        () => this.#battleMenu?.showMainBattleMenu()
      );
      return;
    }

    if (Phaser.Input.Keyboard.JustDown(this.#cursorKeys?.shift!)) {
      this.#battleMenu?.handlePlayerInput("CANCEL");
      return;
    }

    let selectedDirection = DIRECTION.NONE;
    if (this.#cursorKeys?.left.isDown) {
      selectedDirection = DIRECTION.LEFT;
    } else if (this.#cursorKeys?.right.isDown) {
      selectedDirection = DIRECTION.RIGHT;
    } else if (this.#cursorKeys?.up.isDown) {
      selectedDirection = DIRECTION.UP;
    } else if (this.#cursorKeys?.down.isDown) {
      selectedDirection = DIRECTION.DOWN;
    }

    if (selectedDirection !== DIRECTION.NONE) {
      this.#battleMenu?.handlePlayerInput(selectedDirection);
    }
  }
}
