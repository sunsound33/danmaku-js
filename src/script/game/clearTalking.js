/**
 * クリア後トーク画面
 */
 class ClearTalking {
  constructor(ctx, GAME_WIDTH, GAME_HEIGHT) {
    // canvasStateセット
    this.state = 1;
    // canvas設定
    this.w = GAME_WIDTH;
    this.h = GAME_HEIGHT;
    this.counter = null;
    this.ctx = ctx;
    // player立ち絵
    this.playerImgs = [];
    this.playerSrc = [];
    // 相手の立ち絵
    this.partnerImgs = [];
    this.partnerSrc = [];
    // ゲームクリアの会話
    this.clearStory = [];
    // 会話カウント
    this.talkCounter = 0;
    // 画像読み込みカウント
    this.imageCounter = 0;
    // 画像読み込み枚数
    this.loadVolum = 0;
    // フレームレート
    this.renderCounter = 0;
    // フラン立ち位置調整
    this.furanStand = 250;
    // endBGM
    this.endingBGM = null;
  }

  // 初期化
  init = () => {
    this.counter = 0;
    this.ctx.canvas.width = this.w;
    this.ctx.canvas.height = this.h;
    this.reserve();
  }
  // 画像の準備
  reserve = () => {
    //  立ち絵の準備
    this.playerSrc = [
      "image/toho/tatie/reimu_nomal.png", 
      "image/toho/tatie/reimu_nomal2.png",
      "image/toho/tatie/reimu_terekomari.png",
      "image/toho/tatie/reimu_sumasi.png",
      "image/toho/tatie/reimu_teresumasi.png",
      "image/toho/tatie/reimu_egao.png",
      ""
    ];
    this.partnerSrc = [
      "image/toho/tatie/furan_yarare.png",
      "image/toho/tatie/furan_naki.png",
      "image/toho/tatie/furan_teresumasi.png",
      "image/toho/tatie/furan_tere.png",
      "image/toho/tatie/furan_tereodoroki.png",
      "image/toho/tatie/furan_smile.png",
      ""
    ];
    //  立ち絵の準備
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
    this.loadVolum = (this.playerSrc.length + this.partnerSrc.length);
    if (this.imageCounter < this.loadVolum) {
      console.log("error");
      setTimeout(this.reserve, 100);
    } else {
      console.log("loaded");
    }
    
    /**
     * 
     * @clearStory[target, "serif", playerImg, partnerImag]
     * @param {number} target - 強調する対象 0:player 1:partner 
     * @param {String} serif - セリフ 51文字まで
     * @param {number} playerImg - プレイヤー差分選択 
     * @param {number} partnerImg - 相手の差分選択 
     */
    this.clearStory = [
      [1, "あーぁ。負けちゃった。", 6, 0],
      [0, "これに懲りたら、大人しくしてる事ね。", 3, 0],
      [1, "私はただ遊びたかっただけなのに…",2 ,1],
      [0, "べ、別にそんな顔しなくたって\n言えば、遊びにぐらい\n来てあげるわよ。",2 ,1],
      [1, "ほんと？", 2, 4],
      [0, "本当よ。", 4, 4],
      [0, "そのかわり、いい紅茶ぐらい\n用意しときなさいよね。", 2, 3],
      [1, "とびっきりのおいしい紅茶を\n用意するするわ。", 2, 4],
      [0, "それは楽しみね。\nじゃあ、フランまた来るわね。", 5, 2],
      [1, "ありがとう霊夢、またね！", 3, 5],
      [0, "", 6, 6] // fin
    ];

    //sound
    this.endingBGM = document.body.querySelector('#endingBGM');
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
      this.renderCounter = 0;
    }
    // endBGM再生
    this.endingBGM.play();
    this.endingBGM.volume = 0.05;
    this.endingBGM.loop = true; 
    // 透明度
    this.ctx.globalAlpha = 1.0;
    // furanの立ち絵を調整
    if (this.talkCounter < 2) {
      this.furanStand = 250;
    } else {
      this.furanStand = 200;
    }
    // playerしゃべる
    if (this.clearStory[this.talkCounter][0] === 0) {
      // 立ち絵
      this.ctx.save();
      this.ctx.globalAlpha = 1.0;
      this.ctx.drawImage(this.playerImgs[this.clearStory[this.talkCounter][2]], -50, 150, 300, 400);
      this.ctx.globalAlpha = 0.6;
      this.ctx.drawImage(this.partnerImgs[this.clearStory[this.talkCounter][3]], this.furanStand, 150, 300, 400);
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
      this.clearStory[this.talkCounter][1].split(/\n/).map((value, index) => {
        this.ctx.fillText(value, 70, 380 + (30*index));
      });
      
    // 相手しゃべる
    } else {
      // 立ち絵
      this.ctx.save();
      this.ctx.globalAlpha = 0.6;
      this.ctx.drawImage(this.playerImgs[this.clearStory[this.talkCounter][2]], -50, 150, 300, 400);
      this.ctx.globalAlpha = 1.0;
      this.ctx.drawImage(this.partnerImgs[this.clearStory[this.talkCounter][3]], this.furanStand, 150, 300, 400);
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
      this.ctx.fillStyle = "red";
      this.ctx.fill();
      // name
      this.ctx.globalAlpha = 1.0;
      this.ctx.font = '20px serif';
      this.ctx.fillStyle = 'black';
      this.ctx.fillText("フラン", 355, 342);
      // serif
      this.ctx.fillStyle = 'white';
      // \nで改行処理
      this.clearStory[this.talkCounter][1].split(/\n/).map((value, index) => {
        this.ctx.fillText(value, 70, 380 + (30*index));
      });
    }

    // 文字送り
    // 次へ
    if (isKeyDown.key_c) {
      if (this.renderCounter % 10 === 0) {
        this.talkCounter++;
        console.log(this.talkCounter);
      }
    // 前へ
    } else if (isKeyDown.key_v) {
      if (this.renderCounter % 10 === 0) {
        if(this.talkCounter !== 0) {
          this.talkCounter--;
        }
      }
    }
    // おしまい表示
    if (this.talkCounter === this.clearStory.length - 1) {
      this.endingBGM.pause(); // BGM停止
      this.ctx.globalAlpha = 1.0;
      this.ctx.beginPath();
      this.ctx.rect(0, 0, 480, 480);
      this.ctx.fillStyle = "black";
      this.ctx.fill();
      this.ctx.font = '60px Monotype Corsiva';
      this.ctx.fillStyle = 'white';
      this.ctx.fillText("Fin", 200, 260);
    }
    // ゲーム画面へ返す 
    if (this.talkCounter >= this.clearStory.length) {
      this.clear();
      this.talkFlag = false;
      this.talkCounter = 0;
      location.reload();
    }
  }
  
  // 描写をクリアにする
  clear = () => {
    this.ctx.clearRect(0, 0, this.w, this.h);
  }
}