import { BattleMonster, type BattleMonsterConfig } from "./battle-monster";

enum ENEMY_POSITION {
  x = 768,
  y = 144,
}

export class EnemyBattleMonster extends BattleMonster {
  constructor(config: BattleMonsterConfig) {
    super({ ...config, scaleHealthBarBackgroundImageByY: 0.8 }, ENEMY_POSITION);
  }
}
