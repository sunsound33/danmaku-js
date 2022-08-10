/**
 * shot クラス
 */
class Shot extends Character {
  
  constructor(ctx, x, y, w, h, imagePath) {
    // 継承元の初期化
    super(ctx, x, y, w, h, 0, imagePath);
    // ショットの移動スピード（update 一回あたりの移動量）
    this.speed = 7;
    // ショットの攻撃力
    this.power = 1;
    // 自身と衝突判定を取る対象を格納する
    this.targetArray = [];
  }
  /**
   * ショットを配置する
   * @param {number} x - 配置する X 座標
   * @param {number} y - 配置する Y 座標
   * @param {number} [speed] - 設定するスピード
   * @param {number} [power] - 設定する攻撃力
   */
  set = (x, y, speed, power) => {
    // 登場開始位置にショットを移動させる
    this.position.set(x, y);
    // ショットのライフを 0 より大きい値（生存の状態）に設定する
    this.life = 1;
    // スピードを設定する
    this.setSpeed(speed);
    // 攻撃力を設定する
    this.setPower(power);
  };

  // ショットのスピードを設定する
  setSpeed = (speed) => {
    // もしスピード引数が有効なら設定する
    if (speed != null && speed > 0) {
      this.speed = speed;
    }
  };

  // ショットの攻撃力を設定する
  setPower = (power) => {
    // もしスピード引数が有効なら設定する
    if (power != null && power > 0) {
      this.power = power;
    }
  };

  // ショットが衝突判定を行う対象を設定する
  setTargets = (targets) => {
    // 引数の状態を確認して有効な場合は設定する
    if (
      targets != null &&
      Array.isArray(targets) === true &&
      targets.length > 0
    ) {
      this.targetArray = targets;
    }
  };

  // ショットの状態を更新し描画を行う
  update = () => {
    // もしショットのライフが 0 以下の場合はなにもしない
    if (this.life <= 0) {
      return;
    }
    // もしショットが画面外へ移動していたらライフを 0（非生存の状態）に設定する
    if (this.position.x + this.width < 0 ||
      this.position.x - this.width > this.ctx.canvas.width ||
      this.position.y + this.height < 0 ||
      this.position.y - this.height > this.ctx.canvas.height
    ) {
      this.life = 0;
    }
    // ショットを進行方向に沿って移動させる
    this.position.x += this.vector.x * this.speed;
    this.position.y += this.vector.y * this.speed;

    // ショットと対象との衝突判定を行う
    this.targetArray.map((v) => {
      // 自身か対象のライフが 0 以下の対象は無視する
      if (this.life <= 0 || v.life <= 0) {
        return;
      }
      // 自身の位置と対象との距離を測る
      let dist = this.position.distance(v.position);
      // 自身と対象の幅の 1/4 の距離まで近づいている場合衝突とみなす
      if (dist <= (this.width + v.width) / 10) {
        // 自機キャラクターが対象の場合、isComing フラグによって無敵になる
        if (v instanceof Player === true) {
          if (v.isComing === true) {
            return;
          }
        }
        // 対象のライフを攻撃力分減算する
        v.life -= this.power;
      }
    });

    // 描画
    this.draw();
  };
}
