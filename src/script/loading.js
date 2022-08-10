/**
 * ローディング画面
 */
class Loading {
  constructor() {
    // canvas state
    this.state = 2;
    // canvas
    this.w = 480;
    this.h = 480;
    this.util = null;
    this.canvas = null;
    this.ctx = null;
    // フレームレート
    this.counter = 0;
    // ロード動画
    this.loading = null;
    // ローディング回数
    this.initCounter = 0;
  }
  // 初期化
  init = () => {
    this.state = 2;
    // ユーティリティクラスから canvas を取得
    this.util = new Utility(document.body.querySelector('#game'));
    this.canvas = this.util.canvas;
    this.canvas.width = this.w;
    this.canvas.height = this.h;
    this.ctx = this.util.context;
    // カウント
    this.initCounter++;
    
  }
  // 更新
  update = () => {
      this.draw();
  }
  // 描写
  draw = () => {
    ++this.counter;
    // 透明度
    this.ctx.globalAlpha = 1.0;
    // 動画周りを黒く塗りつぶす
    this.util.drawRect(0, 0, this.w, this.h, '#000000');
    // ローディング画面動画の再生
    this.loading = document.body.querySelector('#video');
    this.loading.width = 320;
    this.loading.height = 180;
    this.loading.play();
    this.ctx.drawImage(this.loading, 200, 300, 280, 140);
    // 導入会話後
    if(this.initCounter === 2) {
      this.ctx.globalAlpha = 1.0;
      this.ctx.font = '20px serif';
      this.ctx.fillStyle = 'white';
      this.ctx.fillText("霊夢は「異変」を調査するべく紅魔館へ向かった。", 20, 240);
    }
    // 5秒後次の画面へ 
    if(this.counter === 300) {
      switch (this.initCounter) {
        // titleから導入会話へ
        case 1 :
          this.counter = 0;
          this.state = 3;
          break;
        // 導入会話からstageへ
        case 2 :
          this.counter = 0;
          this.state = 1;
          this.initCounter = 0;
          break;
        // 読み込みエラー(タイトルへ戻る）
        default :
          this.counter = 0;
          this.state = 0;
          break;
      }
    }
    
    
  }
  // 次の画面
  next = () => {
    return this.state;
  }
  // 描写をクリアにする
  clear = () => {
    this.ctx.clearRect(0, 0, this.w, this.h);
  }
}