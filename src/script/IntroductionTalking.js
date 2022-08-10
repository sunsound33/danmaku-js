/**
 * 導入トーク画面
 */
class introductionTalking {
  constructor(GAME_WIDTH, GAME_HEIGHT) {
    // canvas state
    this.state = 3
    // canvas
    this.w = GAME_WIDTH;
    this.h = GAME_HEIGHT;
    this.util = null;
    this.canvas = null;
    this.ctx = null;
    // image
    this.bgImg = [];
    this.bgSrc = [];
    this.playerImgs = [];
    this.playerSrc = [];
    this.partnerImgs = [];
    this.partnerSrc = [];
    // 読み込み
    this.imageCounter = 0;
    this.loadVolum = 0;
    // フレームレート
    this.renderCounter = 0;
    // story
    this.story = [];
    // 話カウント
    this.talkCounter = 0;
    // sound
    this.talkBGM = null
  }

  // 初期化
  init = () => {
    this.state = 3;
    // ユーティリティクラスから canvas を取得
    this.util = new Utility(document.body.querySelector('#game'));
    this.canvas = this.util.canvas;
    this.ctx = this.util.context;
    this.ctx.canvas.width = this.w;
    this.ctx.canvas.height = this.h;
    this.reserve();

  }
  // 画像の準備
  reserve = () => {

    this.bgSrc = [
      "image/toho/background/jinja.jpg"
    ];
    this.bgImg = new Image();
    this.bgImg.src = this.bgSrc;
    this.bgImg.onload = () => {++this.imageCounter}
    //  立ち絵の準備
    this.playerSrc = [
      "image/toho/tatie/reimu_nomal.png",
      "image/toho/tatie/reimu_nomal2.png",
      "image/toho/tatie/reimu_oko.png",
      "image/toho/tatie/reimu_sumasi.png",
      "image/toho/tatie/reimu_egao.png",
      ""
    ];
    this.partnerSrc = [
      "image/toho/tatie/marisa_doya.png",
      "image/toho/tatie/marisa_egao.png",
      "image/toho/tatie/marisa_oya.png",
      "image/toho/tatie/marisa_bikkuri.png",
      "image/toho/tatie/marisa_spell2.png",
      ""
    ];
    this.bgImg = new Image();
    this.bgImg.src = this.bgSrc;
    this.bgImg.onload = () => {}
    for (let i = 0; i < this.playerSrc.length; i++) {
      this.playerImgs[i] = new Image();
      this.playerImgs[i].src = this.playerSrc[i];
      this.playerImgs[i].onload = () => {++this.imageCounter};
      this.partnerImgs[i] = new Image();
      this.partnerImgs[i].src = this.partnerSrc[i];
      this.partnerImgs[i].onload = () => {++this.imageCounter};
    }

    /**
     * 画像の読み込みチェック
     * @param {number} loadVolum - イメージ読み込み枚数
     * 読み込み完了するまで再帰する
     */ 
    this.loadVolum = (this.playerSrc.length + this.bgSrc.length + this.partnerSrc.length);
    if (this.imageCounter < this.loadVolum) {
      console.log("error");
      setTimeout(this.reserve, 100);
    } else {
      console.log("loaded"); //成功
    }
    
    /**
     * 
     * @story[target, "serif", playerImg, partnerImag]
     * @param {number} target - 強調する対象 0:player 1:partner 
     * @param {String} serif - セリフ 51文字まで
     * @param {number} playerImg - プレイヤー差分選択 
     * @param {number} partnerImg - 相手の差分選択 
     */
    this.story = [
      [0, "今日もいい天気ねー。", 0, 5],
      [1, "霊夢ー大変だ!!", 0, 3],
      [0, "あら、魔理沙じゃない？\n何よ？騒がしいわね。", 1, 0],
      [1, "それがさ紅魔館で「異変」が\n起きてるみたいなんだぜ。",1 ,1],
      [0, "何よその顔は。\nまさか私に見て来いって\n言うんじゃないでしょうね？",2 ,1],
      [1, "そのまさかだぜ。\n私は忙しいんだ。\n霊夢、後はまかせたぜ!", 2, 4],
      [0, "ちょっちょっと待ちなさいよ!!\n魔理沙ー!!", 2, 5],
      [0, "はぁーしょうがないわね…", 3, 5]
    ];
    this.talkBGM = document.body.querySelector('#talkBGM');
    
  }

  // 更新
  update = () => {
      this.draw();
  }
  // 描写
  draw = () => {
    // フレームレートカウント
    ++this.renderCounter;
    if (this.renderCounter === 60) {
      this.renderCounter = 0
    }
    // BGM再生
    this.talkBGM.play();
    this.talkBGM.volume = 0.05;
    this.talkBGM.loop = true;
    // 透明度
    this.ctx.globalAlpha = 1.0;
    // 背景
    this.ctx.drawImage(this.bgImg, 0, 0, this.w, this.h);

    // playerしゃべる
    if (this.story[this.talkCounter][0] === 0) {
      // 立ち絵
      this.ctx.save();
      this.ctx.globalAlpha = 1.0;
      this.ctx.drawImage(this.playerImgs[this.story[this.talkCounter][2]], -50, 150, 300, 400);
      this.ctx.globalAlpha = 0.6;
      this.ctx.drawImage(this.partnerImgs[this.story[this.talkCounter][3]], 250, 150, 300, 400);
      this.ctx.restore();
      // serifWindow
      this.ctx.globalAlpha = 0.6;
      this.ctx.beginPath();
      this.ctx.rect(60, 350, 360, 120);
      this.ctx.fillStyle = "black";
      this.ctx.fill();
      // nameWindow
      this.ctx.beginPath();
      this.ctx.rect(60, 320, 70, 30);
      this.ctx.fillStyle = "red";
      this.ctx.fill();
      // name
      this.ctx.globalAlpha = 1.0;
      this.ctx.font = '20px serif';
      this.ctx.fillStyle = 'white';
      this.ctx.fillText("霊夢", 75, 342);
      // serif
      this.ctx.fillStyle = 'white';
      // \nで改行処理
      this.story[this.talkCounter][1].split(/\n/).map((value, index) => {
        this.ctx.fillText(value, 70, 380 + (30*index));
      });


    // 相手しゃべる
    } else {
      // 立ち絵
      this.ctx.save();
      this.ctx.globalAlpha = 0.6;
      this.ctx.drawImage(this.playerImgs[this.story[this.talkCounter][2]], -50, 150, 300, 400);
      this.ctx.globalAlpha = 1.0;
      this.ctx.drawImage(this.partnerImgs[this.story[this.talkCounter][3]], 250, 150, 300, 400);
      this.ctx.restore()
      // serifWindow
      this.ctx.globalAlpha = 0.6;
      this.ctx.beginPath();
      this.ctx.rect(60, 350, 360, 120);
      this.ctx.fillStyle = "black";
      this.ctx.fill();
       // nameWindow
       this.ctx.beginPath();
       this.ctx.rect(350, 320, 70, 30);
       this.ctx.fillStyle = "yellow";
       this.ctx.fill();
      // name
      this.ctx.globalAlpha = 1.0;
      this.ctx.font = '20px serif';
      this.ctx.fillStyle = 'black';
      this.ctx.fillText("魔理沙", 355, 342);
      // serif
      this.ctx.fillStyle = 'white';
      // \nで改行処理
      this.story[this.talkCounter][1].split(/\n/).map((value, index) => {
        this.ctx.fillText(value, 70, 380 + (30*index));
      });
    }

    // 文字送り
    // 次へ
    if (isKeyDown.key_c) {
      if (this.renderCounter % 10 === 0) {
        this.talkCounter++;
      }
    // 前へ
    } else if (isKeyDown.key_v) {
      if (this.renderCounter % 10 === 0) {
        if(this.talkCounter !== 0) {
          this.talkCounter--;
        }
      }
    }

    // 次の画面へ
    if (this.talkCounter >= this.story.length) {
      this.talkBGM.pause(); // 停止
      this.state = 2; // loading
      this.talkCounter = 0;
      this.clear();
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