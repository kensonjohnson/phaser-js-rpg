import { Scene } from "phaser";
import { BATTLE_ASSET_KEYS, MONSTER_ASSET_KEYS } from "../config/asset-keys";
import { SCENE_KEYS } from "../config/scene-keys";
import { BattleMenu } from "../battle/ui/menu/battle-menu";
import { DIRECTION } from "../common/direction";
import { Background } from "../battle/background";
import { HealthBar } from "../battle/ui/health-bar";

export class BattleScene extends Scene {
  #battleMenu?: BattleMenu;
  #cursorKeys?: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor() {
    super({ key: SCENE_KEYS.BATTLE });
  }

  create() {
    // Add the background image
    const background = new Background(this);
    background.showForest();

    // Render out the player and enemy monsters
    this.add.image(768, 144, MONSTER_ASSET_KEYS.CARNODUSK, 0);
    this.add.image(256, 316, MONSTER_ASSET_KEYS.IGUANIGNITE, 0).setFlipX(true);

    // Create player health bar
    const playerHealthBar = new HealthBar(this, 34, 34);
    const playerMonserName = this.add.text(
      30,
      20,
      MONSTER_ASSET_KEYS.IGUANIGNITE,
      { color: "#7E3D3F", fontSize: "32px" }
    );
    this.add.container(556, 318, [
      this.add
        .image(0, 0, BATTLE_ASSET_KEYS.HEALTH_BAR_BACKGROUND)
        .setOrigin(0),
      playerMonserName,
      playerHealthBar.container,

      this.add.text(playerMonserName.width + 35, 23, "L5", {
        color: "#ED474B",
        fontSize: "28px",
      }),
      this.add.text(30, 55, "HP", {
        color: "#FF5605",
        fontSize: "24px",
        fontStyle: "italic",
      }),
      this.add
        .text(443, 80, "25/25", {
          color: "#7E3D3F",
          fontSize: "16px",
        })
        .setOrigin(1, 0),
    ]);

    // Create enemy health bar
    const enemyHealthBar = new HealthBar(this, 34, 34);
    const enemyMonserName = this.add.text(
      30,
      20,
      MONSTER_ASSET_KEYS.CARNODUSK,
      { color: "#7E3D3F", fontSize: "32px" }
    );
    this.add.container(0, 0, [
      this.add
        .image(0, 0, BATTLE_ASSET_KEYS.HEALTH_BAR_BACKGROUND)
        .setOrigin(0)
        .setScale(1, 0.8),
      enemyMonserName,
      enemyHealthBar.container,
      this.add.text(enemyMonserName.width + 35, 23, "L5", {
        color: "#ED474B",
        fontSize: "28px",
      }),
      this.add.text(30, 55, "HP", {
        color: "#FF5605",
        fontSize: "24px",
        fontStyle: "italic",
      }),
    ]);

    // Render out the main info and sub info panes
    this.#battleMenu = new BattleMenu(this);
    this.#battleMenu.showMainBattleMenu();

    this.#cursorKeys = this.input.keyboard?.createCursorKeys();
    playerHealthBar.setMeterPercentageAnimated(0.5, {
      duration: 2000,
      onComplete: () => {
        console.log("Amimation complete!");
      },
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
