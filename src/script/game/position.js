/**
 * 座標を管理するためのクラス
 */
class Position {
  /**
   * ベクトルの長さを返す静的メソッド
   * @static
   * @param {number} x - X 要素
   * @param {number} y - Y 要素
   */
  static calcLength(x, y) {
    return Math.sqrt(x * x + y * y);
  }
  /**
   * ベクトルを単位化した結果を返す静的メソッド
   * @static
   * @param {number} x - X 要素
   * @param {number} y - Y 要素
   */
  static calcNormal(x, y) {
    let len = Position.calcLength(x, y);
    return new Position(x / len, y / len);
  }

  /**
   * @constructor
   * @param {number} x - X 座標
   * @param {number} y - Y 座標
   */
  constructor(x, y) {
    /**
     * X 座標
     * @type {number}
     */
    this.x = x;
    /**
     * Y 座標
     * @type {number}
     */
    this.y = y;
  }

  /**
   * 値を設定する
   * @param {number} [x] - 設定する X 座標
   * @param {number} [y] - 設定する Y 座標
   */
  set(x, y) {
    if (x != null) {
      this.x = x;
    }
    if (y != null) {
      this.y = y;
    }
  }

  /**
   * 対象の Position クラスのインスタンスとの距離を返す
   * @param {Position} target - 距離を測る対象
   */
  distance(target) {
    let x = this.x - target.x;
    let y = this.y - target.y;
    return Math.sqrt(x * x + y * y);
  }
}
