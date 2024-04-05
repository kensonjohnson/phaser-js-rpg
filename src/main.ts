import "./style.css";

import { Game, Types } from "phaser";
import { Preloader } from "./scenes/Preloader";

const config: Types.Core.GameConfig = {
  parent: "game-container",
  scene: [Preloader],
};

export default new Game(config);
