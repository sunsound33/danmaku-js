/**
 * playerクラス
 */
class Player extends Character {
  /**
   * @constructor
   * @param {CanvasRenderingContext2D} ctx - 描画などに利用する 2D コンテキスト
   * @param {number} x - X 座標
   * @param {number} y - Y 座標
   * @param {number} w - 幅
   * @param {number} h - 高さ
   * @param {Image} image - キャラクター用の画像のパス
   */
  constructor(ctx, x, y, w, h, imagePath) {
    // 継承元の初期化
    super(ctx, x, y, w, h, 1, imagePath);

    // 自身の移動スピード（update 一回あたりの移動量）
    this.speed = 2;
    //player が登場中かどうかを表すフラグ
    this.isComing = false;
    // 登場演出を開始した際のタイムスタンプ
    this.comingStart = null;
    // 登場演出を開始する座標
    this.comingStartPosition = null;
    // 登場演出を完了とする座標
    this.comingEndPosition = null;
    // 自身が持つショットインスタンスの配列
    this.shotArray = null;
    // shotを撃った後のチェックカウンター
    this.shotCheckCounter = 0;
    // shotを撃つフレームレート
    this.shotInterval = 7;
    // プレイヤーがセットされたか確認する
    this.settingFlag = false;
  }
  /**
   * 登場演出に関する設定を行う
   * @param {number} startX - 登場開始時の X 座標
   * @param {number} startY - 登場開始時の Y 座標
   * @param {number} endX - 登場終了とする X 座標
   * @param {number} endY - 登場終了とする Y 座標
   */
  setComing = (startX, startY, endX, endY)  => {
    // 自機キャラクターのライフを 1 に設定する（復活する際を考慮）
    this.life = 1;
    // 登場中のフラグを立てる
    this.isComing = true;
    // 登場開始時のタイムスタンプを取得する
    this.comingStart = Date.now();
    // 登場開始位置に自機を移動させる
    this.position.set(startX, startY);
    // 登場開始位置を設定する
    this.comingStartPosition = new Position(startX, startY);
    // 登場終了とする座標を設定する
    this.comingEndPosition = new Position(endX, endY);
    // ショット読み込み
    this.shotSE = document.body.querySelector('#shotSE');
  }
  // ライフの取得
  getLife = () => {
    return this.life;
  }
  // ライフをセット復活
  setLife = (life) => {
    this.life = life;
  }
  // ショットを設定する
  setShotArray = (shotArray, singleShotArray) =>{
    // 自身のプロパティに設定する
    this.shotArray = shotArray;
    this.singleShotArray = singleShotArray;
  }
  // setする
  setsettingFlag = () => {
    this.settingFlag = false;
  }
  // player配置されたか確認する
  getsettingFlag = () => {
    return this.settingFlag;
  }
  // playerの状態を更新し描画を行う
  update = () => {
    // 現時点のタイムスタンプを取得する
    let justTime = Date.now();
    // ライフが尽きていたら何も操作できないようにする
    if(this.life <= 0){return;}
    // 登場シーンかどうかに応じて処理を振り分ける
    if (this.isComing === true) {
      // 登場シーンが始まってからの経過時間
      let comingTime = (justTime - this.comingStart) / 1000;
      // 登場中は時間が経つほど上に向かって進む
      let y = this.comingStartPosition.y - comingTime * 50;
      // 一定の位置まで移動したら登場シーンを終了する
      if (y <= this.comingEndPosition.y) {
        this.isComing = false; // 登場シーンフラグを下ろす
        y = this.comingEndPosition.y; // 行き過ぎの可能性もあるので位置を再設定
      }
      // 求めた Y 座標を自機に設定する
      this.position.set(this.position.x, y);
      
    } else {
      // 移動後の位置が画面外へ出ていないか確認して修正する
      let canvasWidth = this.ctx.canvas.width;
      let canvasHeight = this.ctx.canvas.height;
      let tx = Math.min(Math.max(this.position.x, 0), canvasWidth);
      let ty = Math.min(Math.max(this.position.y, 0), canvasHeight);
      this.position.set(tx, ty);
      // player配置完了
      this.settingFlag = true;
      if (this.settingFlag === true) {
        // キーの押下状態を調べて挙動を変える
        if (window.isKeyDown.key_ArrowLeft === true) {
          this.position.x -= this.speed; // アローキーの左
        }
        if (window.isKeyDown.key_ArrowRight === true) {
          this.position.x += this.speed; // アローキーの右
        }
        if (window.isKeyDown.key_ArrowUp === true) {
          this.position.y -= this.speed; // アローキーの上
        }
        if (window.isKeyDown.key_ArrowDown === true) {
          this.position.y += this.speed; // アローキーの下
        }
        // キーの押下状態を調べてショットを生成する
        if (window.isKeyDown.key_z === true) {
          // ショットを撃てる状態なのかを確認する
          // ショットチェック用カウンタが 0 以上ならショットを生成できる
          if (this.shotCheckCounter >= 0) {
            this.playerShot();
          }
        }
        ++this.shotCheckCounter;
      }
    }
    // 自機キャラクターを描画する
    this.playerDraw();
  }
  // player描画
  playerDraw = () => {
    if (window.isKeyDown.key_ArrowLeft === true) {
      this.drawSprite(152, 102, 46, 46); // 左
    } else if (window.isKeyDown.key_ArrowRight === true) {
      this.drawSprite(152, 52, 46, 46); // 右
    } else {
      this.drawSprite(152, 2, 46, 46); // 正面
    } // 念の為グローバルなアルファの状態を元に戻す
    this.ctx.globalAlpha = 1.0;
  }
  // playerShot描画
  playerShot = () => {
    // ショットの生存を確認し非生存のものがあれば生成する
    for (let i = 0; i < this.shotArray.length; ++i) {
      // 非生存かどうかを確認する
      if (this.shotArray[i].life <= 0) {
        // 自機キャラクターの座標にショットを生成する
        this.shotArray[i].set(this.position.x-10, this.position.y);
        this.shotArray[i + 1].set(this.position.x+10, this.position.y);
        // ショットを生成したのでインターバルを設定する
        this.shotCheckCounter = -this.shotInterval;
        // ひとつ生成したらループを抜ける
        break;
      }
    }
    // シングルショットの生存を確認し非生存のものがあれば生成する
    // このとき、2 個をワンセットで生成し左右に進行方向を振り分ける
    for (let i = 0; i < this.singleShotArray.length; i += 2) {
      // 非生存かどうかを確認する
      if (
        this.singleShotArray[i].life <= 0 &&
        this.singleShotArray[i + 1].life <= 0
      ) {
        // 真上の方向（270 度）から左右に 10 度傾いたラジアン
        let radCW = (280 * Math.PI) / 180; // 時計回りに 10 度分
        let radCCW = (260 * Math.PI) / 180; // 反時計回りに 10 度分
        // 自機キャラクターの座標にショットを生成する
        this.singleShotArray[i].set(this.position.x, this.position.y);
        this.singleShotArray[i].setVectorFromAngle(radCW); // やや右に向かう
        this.singleShotArray[i + 1].set(this.position.x, this.position.y);
        this.singleShotArray[i + 1].setVectorFromAngle(radCCW); // やや左に向かう
        // ショットを生成したのでインターバルを設定する
        this.shotCheckCounter = -this.shotInterval;
        // 一組生成したらループを抜ける
        break;
      }
    }
  }
}
