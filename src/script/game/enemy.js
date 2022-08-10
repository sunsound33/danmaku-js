/**
 * 敵クラス
 */
class Enemy extends Character {
  constructor(ctx, x, y, w, h, imagePath) {
    // 継承元の初期化
    super(ctx, x, y, w, h, 1, imagePath);

    /**
     * 戦闘モード
     * phase1: full HP
     * phase2: 3/4 HP
     * phase3: 1/2 HP
     * phase4: 1/4 HP
     */
    this.mode = "";
    // フレーム数
    this.frame = 0;
    // 移動スピード（update 一回あたりの移動量）
    this.speed = 3;
    // ショットインスタンスの配列
    this.shotArray = null;
    // 攻撃対象
    this.attackTarget = null;
    // 敵HP
    this.currentLife = 0;
    // 現在のモード
    this.currentMode = null;
    
  }

  /**
   * ボスを配置する
   * @param {number} x - 配置する X 座標
   * @param {number} y - 配置する Y 座標
   * @param {number} [life=1] - 設定するライフ
   */
  set = (x, y, life = 1) => {
    // 登場開始位置にボスキャラクターを移動させる
    this.position.set(x, y);
    // ボスキャラクターのライフを 0 より大きい値（生存の状態）に設定する
    this.life = life;
    // ボスキャラクターのフレームをリセットする
    this.frame = 0;
  }
  /**
   * 登場演出に関する設定を行う
   * @param {number} startX - 登場開始時の X 座標
   * @param {number} startY - 登場開始時の Y 座標
   * @param {number} endX - 登場終了とする X 座標
   * @param {number} endY - 登場終了とする Y 座標
   */

  // life set
  setLife = (life = 500) => {
    this.life = life;
  }
  // life get
  getLife = () => {
    return this.life;
  }
  
  // ショットを設定する
  setShotArray = (shotArray) => {
    // 自身のプロパティに設定する
    this.shotArray = shotArray;
  }

  // 攻撃対象を設定する
  setAttackTarget = (target) => {
    this.attackTarget = target;
  }

  // モードを設定する
  setMode = (mode) => {
    this.mode = mode;
  }

  // 敵の状態を更新し描画を行う
  update = () => {
    // もしボスキャラクターのライフが 0 以下の場合はなにもしない
    if (this.life <= 0) {return;}

    // HPによって攻撃を変える。
    switch (this.mode) {
      case "phase1" :
        this.amefurasi();
        break;
      case "phase2" :
        this.nami();
        break;
      case "phase3" :
        this.hanabi();
        break;
      case "phase4" :
        this.niagara();
        break;
    }
    
    // 敵がダメージを受けてるときに点滅させて表示
    this.enemyDraw();
    // 自身のフレームをインクリメントする
    if(this.mode !== null){++this.frame;}
    // modeが切り替わったらフレーム０へ
    if (this.currentMode !== this.mode) {
      
      this.position.x = 240;
      this.frame = 0;
    }
    this.currentMode = this.mode;
    // 現在の敵のHP
    this.currentLife = this.life; 
    this.ctx.globalAlpha = 1.0;
  }

  // 敵の描写
  enemyDraw = () => {
    if (this.currentLife !== this.life ) {
      this.ctx.globalAlpha = 0.5;
      this.draw();
    } else {
      this.ctx.globalAlpha = 1.0;
      this.draw();
    }
  }
  // 弾幕  雨
  amefurasi = () => {
    this.position.x += Math.cos(this.frame / 100) * 1.5;
    if(this.attackTarget !== null && this.position !== null) {
      if (this.frame % 20 === 0) {
      
        // 攻撃対象となる自機キャラクターに向かうベクトル
        let tx = this.attackTarget.position.x - this.position.x;
        let ty = this.attackTarget.position.y - this.position.y;
        // ベクトルを単位化する
        let tv = Position.calcNormal(tx, ty);
       
        for (let i = 2; i < 6; i++) {
        this.lineFire(tv.x, ty.y, i, Math.random() * 480);
        this.lineFire(tv.x, ty.y, i, Math.random() * 480);
        }
      }
    } 
  }

  // 弾幕波
  nami = () => {
    this.position.x += Math.cos(this.frame / 100) * 2;
    if (this.frame % 30 === 0) {
      for (let i = 0; i < 360; i+= 15) {
        let r = i * Math.PI / 90 * Math.random();
        let s = Math.sin(r);
        let c = Math.cos(r);
        for (let i = 2; i < 3; i++) {
        this.fire(c, s, i);
        this.fire(s, c, i);
        }
      }
    }
  }
  // 弾幕花火
  hanabi = () => {
    this.position.x += Math.cos(this.frame / 100) * 1.5;
    if (this.frame % 30 === 0) {
      for (let i = 0; i < 360; i+= 15) {
        let r = i * Math.PI / 180;
        let s = Math.sin(r);
        let c = Math.cos(r);
        this.fire(c, s, 2.0);
        this.fire(s, c, 4);
        
      }
    }
  }

  // 弾幕ナイアガラ
  niagara = () => {
    this.position.x = 240;
    if (this.frame % 30 === 0) {
      for (let i = 0; i < 360; i+= 15) {
        let r = i * Math.PI / 180;
        let s = Math.sin(r);
        let c = Math.cos(r);
        
        this.lineFire(c, s, 2.0, Math.random() * 480);
        this.lineFire(s, c, 4.0, Math.random() * 480);
      }
    }
  }
  /**
   * 自身から指定された方向にショットを放つ
   * @param {number} [x = 0.0] - 進行方向ベクトルの X 要素
   * @param {number} [y = 1.0] - 進行方向ベクトルの Y 要素
   * @param {number} [speed = 5.0] - ショットのスピード
   */
  fire = (x = 0.0, y = 1.0, speed = 5.0,) => {
    // ショットの生存を確認し非生存のものがあれば生成する
    for (let i = 0; i < this.shotArray.length; ++i) {
      // 非生存かどうかを確認する
      if (this.shotArray[i].life <= 0) {
        // ボスキャラクターの座標にショットを生成する
        this.shotArray[i].set(this.position.x, this.position.y);
        // ショットのスピードを設定する
        this.shotArray[i].setSpeed(speed);
        // ショットの進行方向を設定する（真下）
        this.shotArray[i].setVector(x, y);
        // ひとつ生成したらループを抜ける
        break;
      }
    }
  }
  // line上にショットを放つ
  lineFire = (x = 0.0, y = 1.0, speed = 5.0, wx = 0) => {
    // ショットの生存を確認し非生存のものがあれば生成する
    for (let i = 0; i < this.shotArray.length; ++i) {
      // 非生存かどうかを確認する
      if (this.shotArray[i].life <= 0) {
        // ボスキャラクターの座標にショットを生成する
        this.shotArray[i].set(wx, this.position.y);
        // ショットのスピードを設定する
        this.shotArray[i].setSpeed(speed);
        // ショットの進行方向を設定する（真下）
        this.shotArray[i].setVector(x, y);
        // ひとつ生成したらループを抜ける
        break;
      }
    }
  }
}
