import { Scene } from "phaser";
import {
  BATTLE_ASSET_KEYS,
  BATTLE_BACKGROUND_ASSET_KEYS,
  HEALTH_BAR_ASSET_KEYS,
  MONSTER_ASSET_KEYS,
  UI_ASSET_KEYS,
} from "../config/asset-keys";
import { SCENE_KEYS } from "../config/scene-keys";

export class Preloader extends Scene {
  constructor() {
    super({ key: SCENE_KEYS.PRELOADER });
  }

  preload() {
    const monsterTamerAssetPath =
      import.meta.env.BASE_URL + "assets/images/monster-tamer/";
    const kenneysAssetPath =
      import.meta.env.BASE_URL + "assets/images/kenneys-assets/";

    // Battle Backgrounds
    this.load.image(
      BATTLE_BACKGROUND_ASSET_KEYS.FOREST,
      monsterTamerAssetPath + "battle-backgrounds/forest-background.png"
    );

    // Battle Assets
    this.load.image(
      BATTLE_ASSET_KEYS.HEALTH_BAR_BACKGROUND,
      kenneysAssetPath + "ui-space-expansion/custom-ui.png"
    );

    // Health Bar Assets
    this.load.image(
      HEALTH_BAR_ASSET_KEYS.LEFT_CAP,
      kenneysAssetPath + "ui-space-expansion/barHorizontal_green_left.png"
    );
    this.load.image(
      HEALTH_BAR_ASSET_KEYS.MIDDLE,
      kenneysAssetPath + "ui-space-expansion/barHorizontal_green_mid.png"
    );
    this.load.image(
      HEALTH_BAR_ASSET_KEYS.RIGHT_CAP,
      kenneysAssetPath + "ui-space-expansion/barHorizontal_green_right.png"
    );

    // Monster Assets
    this.load.image(
      MONSTER_ASSET_KEYS.IGUANIGNITE,
      monsterTamerAssetPath + "monsters/iguanignite.png"
    );
    this.load.image(
      MONSTER_ASSET_KEYS.CARNODUSK,
      monsterTamerAssetPath + "monsters/carnodusk.png"
    );

    // UI Assets
    this.load.image(
      UI_ASSET_KEYS.CURSOR,
      monsterTamerAssetPath + "ui/cursor.png"
    );
  }

  create() {
    this.scene.start(SCENE_KEYS.BATTLE);
  }
}
