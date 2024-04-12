import type { Scene } from "phaser";
import { MONSTER_ASSET_KEYS, UI_ASSET_KEYS } from "../../../config/asset-keys";
import { DIRECTION } from "../../../common/direction";
import { exhaustiveGuard } from "../../../utils/guard";
import { BATTLE_UI_TEXT_STYLE } from "./battle-menu-config";
import {
  BATTLE_MENU_OPTIONS,
  ATTACK_MOVE_OPTIONS,
  ACTIVE_BATTLE_MENU,
} from "./battle-menu-options";

enum BATTLE_MENU_CURSOR_POSITION {
  x = 42,
  y = 34,
}

enum ATTACK_MOVE_CURSOR_POSITION {
  x = 42,
  y = 34,
}

export class BattleMenu {
  #scene: Scene;
  #mainBattleMenuPhaserContainerGameObject?: Phaser.GameObjects.Container;
  #moveSelectionSubBattleMenuPhaserContainerGameObject?: Phaser.GameObjects.Container;
  #battleTextGameObjectLine1?: Phaser.GameObjects.Text;
  #battleTextGameObjectLine2?: Phaser.GameObjects.Text;
  #mainBattleMenuCursorPhaserImageGameObject?: Phaser.GameObjects.Image;
  #selectedBattleMenuOption: BATTLE_MENU_OPTIONS = BATTLE_MENU_OPTIONS.FIGHT;
  #attackBattleMenuCursorPhaserImageGameObject?: Phaser.GameObjects.Image;
  #selectedAttackMenuOption: ATTACK_MOVE_OPTIONS = ATTACK_MOVE_OPTIONS.MOVE_1;
  #activeBattleMenu: ACTIVE_BATTLE_MENU = ACTIVE_BATTLE_MENU.BATTLE_MAIN;
  #queueInfoPanelMessages: string[] = [];
  #queueInfoPanelCallback?: () => void;
  #waitingForPlayerInput = false;
  #selectedAttackIndex?: number;

  constructor(scene: Scene) {
    this.#scene = scene;
    this.#createMainInfoPane();
    this.#createMainBattleMenu();
    this.#createMonsterAttackSubMenu();
  }

  get selectedAttack() {
    if (this.#activeBattleMenu === ACTIVE_BATTLE_MENU.BATTLE_MOVE_SELECT) {
      return this.#selectedAttackIndex;
    }
    return;
  }

  showMainBattleMenu() {
    this.#activeBattleMenu = ACTIVE_BATTLE_MENU.BATTLE_MAIN;
    this.#battleTextGameObjectLine1?.setText("What should");
    this.#mainBattleMenuPhaserContainerGameObject?.setAlpha(1);
    this.#battleTextGameObjectLine1?.setAlpha(1);
    this.#battleTextGameObjectLine2?.setAlpha(1);
    this.#selectedAttackIndex = undefined;
  }

  hideMainBattleMenu() {
    this.#mainBattleMenuPhaserContainerGameObject?.setAlpha(0);
    this.#battleTextGameObjectLine1?.setAlpha(0);
    this.#battleTextGameObjectLine2?.setAlpha(0);
  }

  showMonsterAttackSubMenu() {
    this.#activeBattleMenu = ACTIVE_BATTLE_MENU.BATTLE_MOVE_SELECT;
    this.#moveSelectionSubBattleMenuPhaserContainerGameObject?.setAlpha(1);
  }

  hideMonsterAttackSubMenu() {
    this.#moveSelectionSubBattleMenuPhaserContainerGameObject?.setAlpha(0);
  }

  handlePlayerInput(input: DIRECTION | "OK" | "CANCEL") {
    if (this.#waitingForPlayerInput && (input === "OK" || input === "CANCEL")) {
      this.#updateInfoPaneWithMessage();
      return;
    }

    if (input === "CANCEL") {
      this.#switchToMainBattleMenu();
      return;
    }

    if (input === "OK") {
      if (this.#activeBattleMenu === ACTIVE_BATTLE_MENU.BATTLE_MAIN) {
        this.#handlePlayerChooseMainBattleOption();
        return;
      }
      if (this.#activeBattleMenu === ACTIVE_BATTLE_MENU.BATTLE_MOVE_SELECT) {
        console.log("Choose attack.", this.#selectedAttackMenuOption);
        this.#handlePlayerChooseAttack();
        return;
      }
      return;
    }

    this.#updateSelectedBattleMenuOptionFromInput(input);
    this.#moveMainBattleMenuCursor();
    this.#updateSelectedMoveMenuOptionFromInput(input);
    this.#moveMoveSelectBattleMenuCursor();
  }

  updateInfoPaneMessagesAndWaitForInput(
    messages: string[],
    callback?: () => void
  ) {
    this.#queueInfoPanelMessages = messages;
    this.#queueInfoPanelCallback = callback;

    this.#updateInfoPaneWithMessage();
  }

  #updateInfoPaneWithMessage() {
    this.#waitingForPlayerInput = false;
    this.#battleTextGameObjectLine1?.setText("").setAlpha(1);

    // Check if all messages have been displayed from the queue
    if (this.#queueInfoPanelMessages.length === 0) {
      if (this.#queueInfoPanelCallback) {
        this.#queueInfoPanelCallback();
        this.#queueInfoPanelCallback = undefined;
      }
      return;
    }

    // Get first message from queue and animate message
    const messageToDisplay = this.#queueInfoPanelMessages.shift()!;
    this.#battleTextGameObjectLine1?.setText(messageToDisplay);
    this.#waitingForPlayerInput = true;
  }

  #createMainBattleMenu() {
    this.#battleTextGameObjectLine1 = this.#scene.add.text(
      20,
      468,
      "What should",
      BATTLE_UI_TEXT_STYLE
    );
    // TODO: Fix this line to use the monster name
    this.#battleTextGameObjectLine2 = this.#scene.add.text(
      20,
      512,
      `${MONSTER_ASSET_KEYS.IGUANIGNITE} do next?`,
      BATTLE_UI_TEXT_STYLE
    );

    this.#mainBattleMenuCursorPhaserImageGameObject = this.#scene.add
      .image(
        BATTLE_MENU_CURSOR_POSITION.x,
        BATTLE_MENU_CURSOR_POSITION.y,
        UI_ASSET_KEYS.CURSOR,
        0
      )
      .setOrigin(0.5)
      .setScale(2.5);

    this.#mainBattleMenuPhaserContainerGameObject = this.#scene.add.container(
      520,
      448,
      [
        this.#createInfoSubPane(),
        this.#scene.add.text(
          55,
          22,
          BATTLE_MENU_OPTIONS.FIGHT,
          BATTLE_UI_TEXT_STYLE
        ),
        this.#scene.add.text(
          240,
          22,
          BATTLE_MENU_OPTIONS.SWITCH,
          BATTLE_UI_TEXT_STYLE
        ),
        this.#scene.add.text(
          55,
          70,
          BATTLE_MENU_OPTIONS.ITEM,
          BATTLE_UI_TEXT_STYLE
        ),
        this.#scene.add.text(
          240,
          70,
          BATTLE_MENU_OPTIONS.FLEE,
          BATTLE_UI_TEXT_STYLE
        ),
        this.#mainBattleMenuCursorPhaserImageGameObject,
      ]
    );
    this.hideMainBattleMenu();
  }

  #createMonsterAttackSubMenu() {
    this.#attackBattleMenuCursorPhaserImageGameObject = this.#scene.add
      .image(42, 34, UI_ASSET_KEYS.CURSOR, 0)
      .setOrigin(0.5)
      .setScale(2.5);
    this.#moveSelectionSubBattleMenuPhaserContainerGameObject =
      this.#scene.add.container(0, 448, [
        this.#scene.add.text(55, 22, "SLASH", BATTLE_UI_TEXT_STYLE),
        this.#scene.add.text(240, 22, "GROWL", BATTLE_UI_TEXT_STYLE),
        this.#scene.add.text(55, 70, "-", BATTLE_UI_TEXT_STYLE),
        this.#scene.add.text(240, 70, "-", BATTLE_UI_TEXT_STYLE),
        this.#attackBattleMenuCursorPhaserImageGameObject,
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

  #updateSelectedBattleMenuOptionFromInput(direction: DIRECTION) {
    if (this.#activeBattleMenu !== ACTIVE_BATTLE_MENU.BATTLE_MAIN) {
      return;
    }
    if (this.#selectedBattleMenuOption === BATTLE_MENU_OPTIONS.FIGHT) {
      switch (direction) {
        case DIRECTION.RIGHT:
          this.#selectedBattleMenuOption = BATTLE_MENU_OPTIONS.SWITCH;
          return;
        case DIRECTION.DOWN:
          this.#selectedBattleMenuOption = BATTLE_MENU_OPTIONS.ITEM;
          return;
        case DIRECTION.LEFT:
        case DIRECTION.UP:
        case DIRECTION.NONE:
          return;
        default:
          exhaustiveGuard(direction);
      }
    }

    if (this.#selectedBattleMenuOption === BATTLE_MENU_OPTIONS.SWITCH) {
      switch (direction) {
        case DIRECTION.LEFT:
          this.#selectedBattleMenuOption = BATTLE_MENU_OPTIONS.FIGHT;
          return;
        case DIRECTION.DOWN:
          this.#selectedBattleMenuOption = BATTLE_MENU_OPTIONS.FLEE;
          return;
        case DIRECTION.RIGHT:
        case DIRECTION.UP:
        case DIRECTION.NONE:
          return;
        default:
          exhaustiveGuard(direction);
      }
    }

    if (this.#selectedBattleMenuOption === BATTLE_MENU_OPTIONS.ITEM) {
      switch (direction) {
        case DIRECTION.RIGHT:
          this.#selectedBattleMenuOption = BATTLE_MENU_OPTIONS.FLEE;
          return;
        case DIRECTION.UP:
          this.#selectedBattleMenuOption = BATTLE_MENU_OPTIONS.FIGHT;
          return;
        case DIRECTION.LEFT:
        case DIRECTION.DOWN:
        case DIRECTION.NONE:
          return;
        default:
          exhaustiveGuard(direction);
      }
    }

    if (this.#selectedBattleMenuOption === BATTLE_MENU_OPTIONS.FLEE) {
      switch (direction) {
        case DIRECTION.LEFT:
          this.#selectedBattleMenuOption = BATTLE_MENU_OPTIONS.ITEM;
          return;
        case DIRECTION.UP:
          this.#selectedBattleMenuOption = BATTLE_MENU_OPTIONS.SWITCH;
          return;
        case DIRECTION.RIGHT:
        case DIRECTION.DOWN:
        case DIRECTION.NONE:
          return;
        default:
          exhaustiveGuard(direction);
      }
    }

    exhaustiveGuard(this.#selectedBattleMenuOption);
  }

  #moveMainBattleMenuCursor() {
    if (this.#activeBattleMenu !== ACTIVE_BATTLE_MENU.BATTLE_MAIN) {
      return;
    }
    switch (this.#selectedBattleMenuOption) {
      case BATTLE_MENU_OPTIONS.FIGHT:
        this.#mainBattleMenuCursorPhaserImageGameObject?.setPosition(
          BATTLE_MENU_CURSOR_POSITION.x,
          BATTLE_MENU_CURSOR_POSITION.y
        );
        return;
      case BATTLE_MENU_OPTIONS.SWITCH:
        this.#mainBattleMenuCursorPhaserImageGameObject?.setPosition(
          BATTLE_MENU_CURSOR_POSITION.x + 185,
          BATTLE_MENU_CURSOR_POSITION.y
        );
        return;
      case BATTLE_MENU_OPTIONS.ITEM:
        this.#mainBattleMenuCursorPhaserImageGameObject?.setPosition(
          BATTLE_MENU_CURSOR_POSITION.x,
          BATTLE_MENU_CURSOR_POSITION.y + 48
        );
        return;
      case BATTLE_MENU_OPTIONS.FLEE:
        this.#mainBattleMenuCursorPhaserImageGameObject?.setPosition(
          BATTLE_MENU_CURSOR_POSITION.x + 185,
          BATTLE_MENU_CURSOR_POSITION.y + 48
        );
        return;
      default:
        exhaustiveGuard(this.#selectedBattleMenuOption);
    }
  }

  #updateSelectedMoveMenuOptionFromInput(direction: DIRECTION) {
    if (this.#activeBattleMenu !== ACTIVE_BATTLE_MENU.BATTLE_MOVE_SELECT) {
      return;
    }
    if (this.#selectedAttackMenuOption === ATTACK_MOVE_OPTIONS.MOVE_1) {
      switch (direction) {
        case DIRECTION.DOWN:
          this.#selectedAttackMenuOption = ATTACK_MOVE_OPTIONS.MOVE_3;
          return;
        case DIRECTION.RIGHT:
          this.#selectedAttackMenuOption = ATTACK_MOVE_OPTIONS.MOVE_2;
          return;
        case DIRECTION.LEFT:
        case DIRECTION.UP:
        case DIRECTION.NONE:
          return;
        default:
          exhaustiveGuard(direction);
      }
    }

    if (this.#selectedAttackMenuOption === ATTACK_MOVE_OPTIONS.MOVE_2) {
      switch (direction) {
        case DIRECTION.DOWN:
          this.#selectedAttackMenuOption = ATTACK_MOVE_OPTIONS.MOVE_4;
          return;
        case DIRECTION.LEFT:
          this.#selectedAttackMenuOption = ATTACK_MOVE_OPTIONS.MOVE_1;
          return;
        case DIRECTION.RIGHT:
        case DIRECTION.UP:
        case DIRECTION.NONE:
          return;
        default:
          exhaustiveGuard(direction);
      }
    }

    if (this.#selectedAttackMenuOption === ATTACK_MOVE_OPTIONS.MOVE_3) {
      switch (direction) {
        case DIRECTION.UP:
          this.#selectedAttackMenuOption = ATTACK_MOVE_OPTIONS.MOVE_1;
          return;
        case DIRECTION.RIGHT:
          this.#selectedAttackMenuOption = ATTACK_MOVE_OPTIONS.MOVE_4;
          return;
        case DIRECTION.LEFT:
        case DIRECTION.DOWN:
        case DIRECTION.NONE:
          return;
        default:
          exhaustiveGuard(direction);
      }
    }

    if (this.#selectedAttackMenuOption === ATTACK_MOVE_OPTIONS.MOVE_4) {
      switch (direction) {
        case DIRECTION.UP:
          this.#selectedAttackMenuOption = ATTACK_MOVE_OPTIONS.MOVE_2;
          return;
        case DIRECTION.LEFT:
          this.#selectedAttackMenuOption = ATTACK_MOVE_OPTIONS.MOVE_3;
          return;
        case DIRECTION.RIGHT:
        case DIRECTION.DOWN:
        case DIRECTION.NONE:
          return;
        default:
          exhaustiveGuard(direction);
      }
    }

    exhaustiveGuard(this.#selectedAttackMenuOption);
  }

  #moveMoveSelectBattleMenuCursor() {
    if (this.#activeBattleMenu !== ACTIVE_BATTLE_MENU.BATTLE_MOVE_SELECT) {
      return;
    }
    switch (this.#selectedAttackMenuOption) {
      case ATTACK_MOVE_OPTIONS.MOVE_1:
        this.#attackBattleMenuCursorPhaserImageGameObject?.setPosition(
          ATTACK_MOVE_CURSOR_POSITION.x,
          ATTACK_MOVE_CURSOR_POSITION.y
        );
        return;
      case ATTACK_MOVE_OPTIONS.MOVE_2:
        this.#attackBattleMenuCursorPhaserImageGameObject?.setPosition(
          ATTACK_MOVE_CURSOR_POSITION.x + 185,
          ATTACK_MOVE_CURSOR_POSITION.y
        );
        return;
      case ATTACK_MOVE_OPTIONS.MOVE_3:
        this.#attackBattleMenuCursorPhaserImageGameObject?.setPosition(
          ATTACK_MOVE_CURSOR_POSITION.x,
          ATTACK_MOVE_CURSOR_POSITION.y + 48
        );
        return;
      case ATTACK_MOVE_OPTIONS.MOVE_4:
        this.#attackBattleMenuCursorPhaserImageGameObject?.setPosition(
          ATTACK_MOVE_CURSOR_POSITION.x + 185,
          ATTACK_MOVE_CURSOR_POSITION.y + 48
        );
        return;
      default:
        exhaustiveGuard(this.#selectedAttackMenuOption);
    }
  }

  #switchToMainBattleMenu() {
    this.hideMonsterAttackSubMenu();
    this.showMainBattleMenu();
  }

  #handlePlayerChooseMainBattleOption() {
    this.hideMainBattleMenu();
    if (this.#selectedBattleMenuOption === BATTLE_MENU_OPTIONS.FIGHT) {
      this.#activeBattleMenu = ACTIVE_BATTLE_MENU.BATTLE_MOVE_SELECT;

      this.showMonsterAttackSubMenu();
      return;
    }
    if (this.#selectedBattleMenuOption === BATTLE_MENU_OPTIONS.ITEM) {
      this.#activeBattleMenu = ACTIVE_BATTLE_MENU.BATTLE_ITEM;
      this.updateInfoPaneMessagesAndWaitForInput(
        ["Your bag is empty..."],
        () => {
          this.#switchToMainBattleMenu();
        }
      );
      return;
    }
    if (this.#selectedBattleMenuOption === BATTLE_MENU_OPTIONS.SWITCH) {
      this.#activeBattleMenu = ACTIVE_BATTLE_MENU.BATTLE_SWITCH;
      this.updateInfoPaneMessagesAndWaitForInput(
        ["You can't switch out..."],
        () => {
          this.#switchToMainBattleMenu();
        }
      );
      return;
    }
    if (this.#selectedBattleMenuOption === BATTLE_MENU_OPTIONS.FLEE) {
      this.#activeBattleMenu = ACTIVE_BATTLE_MENU.BATTLE_FLEE;
      this.updateInfoPaneMessagesAndWaitForInput(
        ["You fail to run away..."],
        () => {
          this.#switchToMainBattleMenu();
        }
      );
      return;
    }
    exhaustiveGuard(this.#selectedBattleMenuOption);
  }

  #handlePlayerChooseAttack() {
    this.#selectedAttackIndex = this.#selectedAttackMenuOption;
  }
}
