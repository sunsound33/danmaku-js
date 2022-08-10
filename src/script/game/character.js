/**
 * キャラクタークラス
 */
class Character {
  constructor(ctx, x, y, w, h, life, imagePath) {
    // canvas
    this.ctx = ctx;
    this.width = w;
    this.height = h;
    // 現在地
    this.position = new Position(x, y);
    // ベクター
    this.vector = new Position(0.0, -1.0);
    // ライフ
    this.life = life;
    // 画像
    this.ready = false;
    this.image = new Image();
    this.image.addEventListener(
      "load",
      () => {
        // 画像のロードが完了したら準備完了フラグを立てる
        this.ready = true;
      });
    this.image.src = imagePath;
  }

  // 描画する
  draw = () => {
    // キャラクターの幅を考慮してオフセットする量
    let offsetX = this.width / 2;
    let offsetY = this.height / 2;
    // キャラクターの幅やオフセットする量を加味して描画する
    this.ctx.drawImage(
      this.image,
      this.position.x - offsetX,
      this.position.y - offsetY,
      this.width,
      this.height
    );
  }

  /**
   * 進行方向を設定する
   * @param {number} x - X 方向の移動量
   * @param {number} y - Y 方向の移動量
   */
  setVector = (x, y) => {
  // 自身の vector プロパティに設定する
  this.vector.set(x, y);
  }

  /**
   * 進行方向を角度を元に設定する
   * @param {number} angle - 回転量（ラジアン）
   */
  setVectorFromAngle = (angle) => {
      // 自身の回転量を設定する
      this.angle = angle;
      // ラジアンからサインとコサインを求める
      let sin = Math.sin(angle);
      let cos = Math.cos(angle);
      // 自身の vector プロパティに設定する
      this.vector.set(cos, sin);
  }
  // 分割描写
  drawSprite = (x, y, w, h) => {
    // キャラクターの幅を考慮してオフセットする量
    let offsetX = this.width / 2;
    let offsetY = this.height / 2;
    // キャラクターの幅やオフセットする量を加味して描画する
    this.ctx.drawImage(
      this.image,
      x,
      y,
      w,
      h,
      this.position.x - offsetX,
      this.position.y - offsetY,
      this.width,
      this.height
    );
  }
}

