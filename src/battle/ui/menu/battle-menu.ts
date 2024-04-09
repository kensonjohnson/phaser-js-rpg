import type { Scene } from "phaser";
import { MONSTER_ASSET_KEYS } from "../../../config/asset-keys";
import { DIRECTION } from "../../../common/direction";

enum BATTLE_MENU_OPTIONS {
  FIGHT = "FIGHT",
  SWITCH = "SWITCH",
  ITEM = "ITEM",
  FLEE = "FLEE",
}

const battleUITextStyle = {
  color: "black",
  fontSize: "30px",
};

export class BattleMenu {
  #scene: Scene;
  #mainBattleMenuPhaserContainerGameObject?: Phaser.GameObjects.Container;
  #moveSelectionSubBattleMenuPhaserContainerGameObject?: Phaser.GameObjects.Container;
  #battleTextGameObjectLine1?: Phaser.GameObjects.Text;
  #battleTextGameObjectLine2?: Phaser.GameObjects.Text;

  constructor(scene: Scene) {
    this.#scene = scene;
    this.#createMainInfoPane();
    this.#createMainBattleMenu();
    this.#createMonsterAttackSubMenu();
  }

  showMainBattleMenu() {
    this.#battleTextGameObjectLine1?.setText("What should");
    this.#mainBattleMenuPhaserContainerGameObject?.setAlpha(1);
    this.#battleTextGameObjectLine1?.setAlpha(1);
    this.#battleTextGameObjectLine2?.setAlpha(1);
  }

  hideMainBattleMenu() {
    this.#mainBattleMenuPhaserContainerGameObject?.setAlpha(0);
    this.#battleTextGameObjectLine1?.setAlpha(0);
    this.#battleTextGameObjectLine2?.setAlpha(0);
  }

  showMonsterAttackSubMenu() {
    this.#moveSelectionSubBattleMenuPhaserContainerGameObject?.setAlpha(1);
  }

  hideMonsterAttackSubMenu() {
    this.#moveSelectionSubBattleMenuPhaserContainerGameObject?.setAlpha(0);
  }

  handlePlayerInput(input: DIRECTION | "OK" | "CANCEL") {
    console.log(input);
    if (input === "CANCEL") {
      this.hideMonsterAttackSubMenu();
      this.showMainBattleMenu();
      return;
    }
    if (input === "OK") {
      this.hideMainBattleMenu();
      this.showMonsterAttackSubMenu();
    }
  }

  #createMainBattleMenu() {
    this.#battleTextGameObjectLine1 = this.#scene.add.text(
      20,
      468,
      "What should",
      battleUITextStyle
    );
    // TODO: Fix this line to use the monster name
    this.#battleTextGameObjectLine2 = this.#scene.add.text(
      20,
      512,
      `${MONSTER_ASSET_KEYS.IGUANIGNITE} do next?`,
      battleUITextStyle
    );
    this.#mainBattleMenuPhaserContainerGameObject = this.#scene.add.container(
      520,
      448,
      [
        this.#createInfoSubPane(),
        this.#scene.add.text(
          55,
          22,
          BATTLE_MENU_OPTIONS.FIGHT,
          battleUITextStyle
        ),
        this.#scene.add.text(
          240,
          22,
          BATTLE_MENU_OPTIONS.SWITCH,
          battleUITextStyle
        ),
        this.#scene.add.text(
          55,
          70,
          BATTLE_MENU_OPTIONS.ITEM,
          battleUITextStyle
        ),
        this.#scene.add.text(
          240,
          70,
          BATTLE_MENU_OPTIONS.FLEE,
          battleUITextStyle
        ),
      ]
    );
    this.hideMainBattleMenu();
  }

  #createMonsterAttackSubMenu() {
    this.#moveSelectionSubBattleMenuPhaserContainerGameObject =
      this.#scene.add.container(0, 448, [
        this.#scene.add.text(55, 22, "SLASH", battleUITextStyle),
        this.#scene.add.text(240, 22, "GROWL", battleUITextStyle),
        this.#scene.add.text(55, 70, "-", battleUITextStyle),
        this.#scene.add.text(240, 70, "-", battleUITextStyle),
      ]);

    this.hideMonsterAttackSubMenu();
  }

  #createMainInfoPane() {
    const padding = 4;
    const rectHeight = 124;
    this.#scene.add
      .rectangle(
        padding,
        this.#scene.scale.height - rectHeight - padding,
        this.#scene.scale.width - padding * 2,
        rectHeight,
        0xede4f3,
        1
      )
      .setOrigin(0)
      .setStrokeStyle(8, 0xe4434a, 1);
  }

  #createInfoSubPane() {
    const rectWidth = 500;
    const rectHeight = 124;
    return this.#scene.add
      .rectangle(0, 0, rectWidth, rectHeight, 0xede4f3, 1)
      .setOrigin(0)
      .setStrokeStyle(8, 0x905ac2, 1);
  }
}
