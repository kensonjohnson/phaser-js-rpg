import "./style.css";

import { Game, Types } from "phaser";
import { Preloader } from "./scenes/Preloader";
import { BattleScene } from "./scenes/BattleScene";

const config: Types.Core.GameConfig = {
  pixelArt: false,
  type: Phaser.CANVAS,
  scene: [Preloader, BattleScene],
  scale: {
    parent: "game-container",
    width: 1024,
    height: 576,
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
};

export default new Game(config);
