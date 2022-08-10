/**
 * スタート画面
 */
class Title {
  constructor(w, h) {
    
    // canvas state
    this.state = null;
    // canvas
    this.ctx = null;
    this.w = w;
    this.h = h;
    // image
    this.imgs = [];
    this.images = [];
    // 画面動き
    this.titleName = -100;
    this.titleObject = -200;
    this.titleSelect = 600;
    // sound
    this.titleBGM = null;
    this.determineSE = null;
    // フレームレート
    this.renderCounter = -120;
  }

  // 初期化
  init = () => {
    this.state = 0;
    // ユーティリティクラスから canvas を取得
    this.util = new Utility(document.body.querySelector('#game'));
    this.canvas = this.util.canvas;
    this.canvas.width = this.w;
    this.canvas.height = this.h;
    this.ctx = this.util.context;
    this.reserve();
    
  }

  // 画像の準備
  reserve = () => {
    this.imgs = [
      "image/toho/background/tireiden.jpg",
      "image/toho/tatie/reimu_start.png"
    ];
    for (let i = 0; i < this.imgs.length; i++) {
      this.images[i] = new Image();
      this.images[i].src = this.imgs[i];
      this.images[i].onload = () => {}
    }
    this.titleBGM = document.body.querySelector('#titleBGM');
    this.determineSE = document.body.querySelector('#determineSE');

  }

  // 更新
  update = () => {
    this.titleBGM.play();
    this.titleBGM.volume = 0.05;
    this.titleBGM.loop = true;
    // タイトル画面動き
    if (this.titleObject < 0) {
      this.titleObject += 3;
    } else if (this.titleName < 120) {
      this.titleName += 3;
    } else if (this.titleSelect > 170) {
      this.titleSelect -= 3;
    } else{ 
      // enter押したとき
      if (isKeyDown.key_Enter) {
        this.titleBGM.pause(); //BGM停止
        this.determineSE.play(); // SE再生
        this.determineSE.volume = 0.2;
        this.state = 2; //loadingへ
        this.clear();
      }
    } 
    this.draw();
  }

  // 描写
  draw = () => {
    // オブジェクトの配置
    this.ctx.drawImage(this.images[0], 0, 0, 480, 480);
    this.ctx.drawImage(this.images[1], this.titleObject, 150, 300, 350);
    this.ctx.save();
    this.ctx.font = '48px serif';
    this.ctx.fillStyle = 'white';
    this.ctx.fillText('東方御披露目会',70, this.titleName);
    this.ctx.strokeStyle = 'white';
    this.ctx.strokeText('東方御披露目会',70, this.titleName);
    this.ctx.restore();
    // press enter点滅処理
    this.renderCounter++;
    if (this.renderCounter === 120) {
      this.renderCounter = -120;
    }
    if (this.titleSelect <= 170) {
      this.ctx.globalAlpha = Math.abs(this.renderCounter) * 0.02;
    }
    this.ctx.font = '25px serif';
    this.ctx.strokeStyle = 'black';
    this.ctx.strokeText('PRESS ENTER', this.titleSelect, 280);
    this.ctx.fillStyle = 'yellow';
    this.ctx.fillText('PRESS ENTER', this.titleSelect, 280);
    // 透明度
    this.ctx.globalAlpha = 1.0;
  } 

  // 次の画面へ
  next = () => {
    return this.state;
  }

  // canvas画面削除
  clear = () => {
    this.ctx.clearRect(0, 0, this.w, this.h);
  }
}
