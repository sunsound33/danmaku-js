/**
 * battleトーク画面
 */
 class StartTalking {
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
    // ファーストコンタクトの会話
    this.startStory = [];
    // 会話カウント
    this.talkCounter = 0;
    // 画像読み込みカウント
    this.imageCounter = 0;
    // 画像読み込み枚数
    this.loadVolum = 0;
    // フレームレート
    this.renderCounter = 0;
    // 会話フラグ
    this.talkFlag = false;
    // BGM
    this.furanTalkBGM = null;
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
      "image/toho/tatie/reimu_oko.png",
      "image/toho/tatie/reimu_sumasi.png",
      "image/toho/tatie/reimu_egao.png",
      "image/toho/tatie/reimu_spellcard.png",
      ""
    ];
    this.partnerSrc = [
      "image/toho/tatie/furan_default.png",
      "image/toho/tatie/furan_manzara.png",
      "image/toho/tatie/furan_yorokobi.png",
      "image/toho/tatie/furan_uresi.png",
      "image/toho/tatie/furan_sumasi.png",
      "image/toho/tatie/furan_kyouki.png",
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
     * @startStory[target, "serif", playerImg, partnerImag]
     * @param {number} target - 強調する対象 0:player 1:partner 
     * @param {String} serif - セリフ 51文字まで
     * @param {number} playerImg - プレイヤー差分選択 
     * @param {number} partnerImg - 相手の差分選択 
     */
    this.startStory = [
      [0, "誰もいないわね", 0, 6],
      [1, "いらっしゃーい。", 0, 0],
      [0, "あら、一人なのね？\nレミリアや他の従者どうしたのよ。", 1, 4],
      [1, "お姉さまたちは出かけたわ。\nだから、暇で暇で仕方ないの。",1 ,4],
      [1, "暇だから魔理沙に遊び相手を探しても\nらったの。霊夢が来たようね。",2 ,3],
      [0, "(魔理沙の奴、フランの遊び相手を私\nに押し付けたわね。)", 2, 3],
      [0, "異変じゃないなら私は帰るわ。", 2, 4],
      [1, "あら？帰るの。\nそれなら、月でも破壊して\n遊ぶことにするわ。", 2, 5],
      [0, "それは聞き捨てならないわね。", 3, 4],
      [1, "遊んでくれるならやめてもいいわよ。", 3, 3],
      [0, "しかたないわね、遊んであげるわ。", 5, 3]
    ];
    // BGM
    this.furanTalkBGM = document.body.querySelector('#furanTalkBGM');
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
    this.furanTalkBGM.play();
    this.furanTalkBGM.volume = 0.01;
    this.furanTalkBGM.loop = true;
    // 透明度
    this.ctx.globalAlpha = 1.0;
    
    // playerしゃべる
    if (this.startStory[this.talkCounter][0] === 0) {
      // 立ち絵
      this.ctx.save();
      this.ctx.globalAlpha = 1.0;
      this.ctx.drawImage(this.playerImgs[this.startStory[this.talkCounter][2]], -50, 150, 300, 400);
      this.ctx.globalAlpha = 0.6;
      this.ctx.drawImage(this.partnerImgs[this.startStory[this.talkCounter][3]], 250, 150, 350, 350);
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
      this.startStory[this.talkCounter][1].split(/\n/).map((value, index) => {
        this.ctx.fillText(value, 70, 380 + (30*index));
      });
      
    // 相手しゃべる
    } else {
      // 立ち絵
      this.ctx.save();
      this.ctx.globalAlpha = 0.6;
      this.ctx.drawImage(this.playerImgs[this.startStory[this.talkCounter][2]], -50, 150, 300, 400);
      this.ctx.globalAlpha = 1.0;
      this.ctx.drawImage(this.partnerImgs[this.startStory[this.talkCounter][3]], 250, 150, 350, 350);
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
      this.startStory[this.talkCounter][1].split(/\n/).map((value, index) => {
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
    // ゲーム画面へ返す 
    if (this.talkCounter >= this.startStory.length) {
      this.furanTalkBGM.pause(); // 停止
      this.talkFlag = false;
      this.talkCounter = 0;
    }
  }
  
  // 描写をクリアにする
  clear = () => {
    this.ctx.clearRect(0, 0, this.w, this.h);
  }
  // talkingFlagを送る
  getTalkingFlag = () => {
    return this.talkFlag;
  }
  // taklingFlagセットする
  setTalkingFlag = () => {
    this.talkFlag = true;
  }
}