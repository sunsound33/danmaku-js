/**
 * ゲーム画面
 */
class GameManager {
  constructor() {
  
    // game 幅　高さ
    this.GAME_WIDTH = 480;
    this.GAME_HEIGHT = 480;
    // Canvas2D
    this.util = null;
    // Canvas Element
    this.canvas = null;
    // Canvas2D API
    this.ctx = null;
    // タイムスタンプ
    this.startTime = null;
    // 自機
    this.player = null;
    // 敵キャラクター
    this.furan = null;
    // 敵キャラクターのインスタンスを格納する配列
    this.enemyArray = [];
    // ショットインスタンス
    this.shotArray = [];
    // シングルショットインスタンス
    this.singleShotArray = [];
    // 敵キャラのショット
    this.enemyShotArray = [];
    // ショット最大個数
    this.SHOT_MAX_COUNT = 10;
    // 敵ショット最大個数
    this.ENEMY_SHOT_MAX_COUNT = 1000;
    // 背景
    this.bg = null;
    // sound
    // 戦闘BGM
    this.battleBGM = null;
    // 決定音
    this.determineSE = null;
    // ピチューン
    this.deadSE = null;
    // 選択音
    this.selectSE = null; 
    // canvasState
    this.state = 1;
    // フレームレートカウント
    this.renderCounter = 0;
    // ゲームクリア　インスタンス
    this.clearTalking = null;
    // ゲームスタート　インスタンス
    this.startTalking = null;
    
    // 敵のライフを表示させるフラグ
    this.enemyLifeDisplay = false;
    // enemyHP
    this.enemyHP;
    /**
     * stageState
     * ゲーム画面でのステート管理
     * 0:gameStart
     * 1:gameRun
     * 2:gameStartTalk
     * 3:gameClear
     * 4:gameOver
     */
    this.stageState = 0;

    // gameOverSelect
    this.gameOverSelect = 0;
  }
  
  
  // 初期化
  init = () => {
    // フラグ初期化
    this.state = 1;
    // ユーティリティクラスを初期化
    this.util = new Utility(document.body.querySelector('#game'));
    // ユーティリティクラスから canvas を取得
    this.canvas = this.util.canvas;
    // ユーティリティクラスから 2d コンテキストを取得
    this.ctx = this.util.context;
    // canvas の大きさを設定
    this.canvas.width = this.GAME_WIDTH;
    this.canvas.height = this.GAME_HEIGHT;
    // player生成
    this.player = new Player(this.ctx, 0, 0, 50, 50, "./image/dot_reimu.png");
    // player セッティングフラグセット
    this.player.setsettingFlag() // set false
    // 登場シーンからスタートするための設定を行う
    this.player.setComing(
      this.GAME_WIDTH / 2, // 登場演出時の開始 X 座標
      this.GAME_HEIGHT + 100, // 登場演出時の開始 Y 座標
      this.GAME_WIDTH / 2, // 登場演出を終了とする X 座標
      this.GAME_HEIGHT - 50 // 登場演出を終了とする Y 座標
    );

    // ショットを自機キャラクターに設定する
    for(let i = 0; i < this.SHOT_MAX_COUNT; ++i){
      this.shotArray[i * 2] = new Shot(this.ctx, -100, -10, 20, 20, './image/dot_reimu_shot.png');
      this.shotArray[i * 2 + 1] = new Shot(this.ctx, 100, -10, 20, 20, './image/dot_reimu_shot.png');
      this.singleShotArray[i * 2] = new Shot(this.ctx, 0, -10, 20, 20, './image/dot_reimu_shot2.png');
      this.singleShotArray[i * 2 + 1] = new Shot(this.ctx, 0, -10, 20, 20, './image/dot_reimu_shot2.png');
    }
    // ショットを自機キャラクターに設定する
    this.player.setShotArray(this.shotArray, this.singleShotArray);
    // 敵キャラクター生成
    this.furan = new Enemy(this.ctx, -100, -100, 70, 70, 'image/enemy/dot_flandre1.png');
     // 敵キャラクターはすべて同じショットを共有する
    this.furan.setShotArray(this.enemyShotArray);
    // 敵キャラ衝突判定
    this.concatEnemyArray = this.enemyArray.concat([this.furan]);
    for (let i = 0; i < this.SHOT_MAX_COUNT; ++i) {
      this.shotArray[i * 2].setTargets(this.concatEnemyArray);
      this.shotArray[i * 2 + 1].setTargets(this.concatEnemyArray);
      this.singleShotArray[i * 2].setTargets(this.concatEnemyArray);
      this.singleShotArray[i * 2 + 1].setTargets(this.concatEnemyArray);
    }

    // 敵のショット
    for(let i = 0; i < this.ENEMY_SHOT_MAX_COUNT; ++i){
      this.enemyShotArray[i] = new Shot(this.ctx, 0, -10, 15, 15, 'image/enemy/furanShot.png');
      this.enemyShotArray[i].setTargets([this.player]); // 引数は配列なので注意
    }
    // ゲーム内部での会話
    this.startTalking = new StartTalking(this.ctx, this.GAME_WIDTH, this.GAME_HEIGHT);
    this.startTalking.init();
    // ゲームクリアでの会話
    this.clearTalking = new ClearTalking(this.ctx, this.GAME_WIDTH, this.GAME_HEIGHT);
    this.clearTalking.init();
    // sound
    this.battleBGM = document.body.querySelector('#battleBGM');
    this.determineSE = document.body.querySelector('#determineSE');
    this.deadSE = document.body.querySelector('#deadSE');
    this.selectSE = document.body.querySelector('#selectSE');
    
    
    // ゲーム内部実行
    this.update();
  }

  // 次の画面へ
  next = () => {
    return this.state;
  }


  // 状態の更新する
  update = () => {
    // フレームレートカウント
    this.renderCounter++;
    if (this.renderCounter === 60) {
      this.renderCounter = 0;
    }
    
    /**
     * stageState
     * ゲーム画面でのステート管理
     * 0:gameStart
     * 1:gameRun
     * 2:gameStartTalk
     * 3:gameClear
     * 4:gameOver
     */
    switch (this.stageState) {
      case 0:
        this.gameStart();
        break;
      case 1:
        this.gameRun();
        break;
      case 2:
        this.gameStartTalk();
        break;
      case 3:
        this.gameClear();
        break;
      case 4:
        this.gameOver();
        break;
    }
    // gameOver
    if (this.player.getLife() === 0) {
      if (this.stageState !== 4) {
        this.deadSE.play(); // ピチューン
        this.deadSE.volume = 0.02;
      }
      this.stageState = 4; // gameOver
    }
    // gameClear
    if (this.furan.getLife() === 0) {
      // HP非表示
      this.enemyLifeDisplay = false;
      // BGM止める
      this.battleBGM.pause();
      this.stageState = 3; // gameClear
    }
    // 敵のHP表示
    this.enemyHPdisply();
  }

  // 敵のHp表示
  enemyHPdisply = () => {
    if (this.enemyLifeDisplay === true) {
      // BGM
      this.battleBGM.play();
      this.battleBGM.volume = 0.04;
      // 透明度
      this.ctx.globalAlpha = 0.8;
      // hpバー
      this.ctx.beginPath();
      this.ctx.rect(15, 20, this.furan.getLife() / 2, 5);
      // 1/4以下 phase4
      if (this.furan.getLife() < this.enemyHP / 4) {
        this.furan.setMode('phase4');
        this.ctx.fillStyle = "red";
      // 1/2以下 phase3
      } else if (this.furan.getLife() < this.enemyHP / 2) {
        this.furan.setMode('phase3');
        this.ctx.fillStyle = "orange";
      // 3/4以下 phase2
      } else if (this.furan.getLife() < this.enemyHP / 4 * 3) {
        this.furan.setMode('phase2');
        this.ctx.fillStyle = "yellow";
      // 満タン phase1
      } else { 
        this.ctx.fillStyle = "lime";
      }
      this.ctx.fill();
      this.ctx.lineWidth = 2;
      this.ctx.strokeStyle = 'black';
      this.ctx.strokeRect(15, 20, this.furan.getLife() / 2, 5);
    }
    // 透明度 初期化
    this.ctx.globalAlpha = 1.0;
  }


  
  // 動いてる時描画
  runUpdate = () => {
    // 背景
    this.ctx.globalAlpha = 0.5;
    this.bg = new Image();
    this.bg.src = "image/toho/background/kannai.jpg";
    this.bg.onload = () => {
      this.ctx.drawImage(this.bg, 0, 0, this.GAME_WIDTH, this.GAME_HEIGHT);
    }
    // 透明度
    this.ctx.globalAlpha = 1.0;
    // 自機キャラクターの状態を更新する
    this.player.update();
    
    
    // ショットの状態を更新する
    this.shotArray.map((v) => {
      this.ctx.globalAlpha = 0.4;
      v.update();
    });
    // シングルショットの状態を更新する
    this.singleShotArray.map((v) => {
        v.update();
    });
    this.ctx.globalAlpha = 1.0;

    // 敵キャラクターの状態更新
    this.furan.update();
    // 敵ショットの状態更新
    this.enemyShotArray.map((v) => {
      v.update();
    });

  }

  // talking or gameover （静止画を得る）
  stopUpdate = () => {
    // 背景
    this.ctx.globalAlpha = 0.5;
    this.bg = new Image();
    this.bg.src = "image/toho/background/kannai.jpg";
    this.bg.onload = () => {
      this.ctx.drawImage(this.bg, 0, 0, this.GAME_WIDTH, this.GAME_HEIGHT);
    }
    this.ctx.globalAlpha = 1.0;
    // playerの描画
    this.player.playerDraw();
    // 敵の描画
    this.furan.enemyDraw();
    this.shotArray.map((v) => {
      v.draw();
    });

    // シングルショットの描画
    this.singleShotArray.map((v) => {
      v.draw();
    });
    this.ctx.globalAlpha = 1.0;
    // 敵キャラクターの描画
    this.furan.enemyDraw();
    // 敵ショットの描画
    this.enemyShotArray.map((v) => {
      v.draw();
    });
    
  }

  
  // ゲーム始動
  gameStart = () => {
    this.runUpdate();
    // playerが配置されたら敵を配置する
    if (this.player.getsettingFlag() === true) {
      // 会話を発生させる
      this.startTalking.setTalkingFlag(); // true set
      this.stageState = 2; // startTalk
    }
  } 

  // ゲーム駆動　
  gameRun = () => {
    this.runUpdate();
  }

  // ゲーム内の会話
  gameStartTalk = () => {
    this.stopUpdate();
    // playerが独り言言ったら登場させる
    if (window.isKeyDown.key_c === true) {
      // 敵キャラクターセット (x, y, life)
      this.furan.set(this.GAME_WIDTH / 2, 100, 900);
      // 攻撃対象
      this.furan.setAttackTarget(this.player);
      // 敵ライフ
      this.enemyHP = this.furan.getLife();

    }
    // stageTalkの描画
    this.startTalking.update();
    // 会話が終わったらゲーム駆動へ
    if( this.startTalking.getTalkingFlag() === false) {
      this.enemyLifeDisplay = true;
      this.stageState = 1; //gameRun
      this.furan.setMode('phase1'); // 敵モードセット
    }
  }
  // ゲームクリア
  gameClear = () => {
    // BGM止める
    this.battleBGM.pause();
    this.stopUpdate();
    // stageTalkの描画
    this.clearTalking.update();
  }
  // ゲームオーバー(復活待機&タイトル画面)
  gameOver = () => {
    // 背景
    this.ctx.globalAlpha = 0.3;
    this.ctx.beginPath();
    this.ctx.rect(0, 140, 480, 200);
    this.ctx.fillStyle = "black";
    this.ctx.fill();
    // selectText
    this.ctx.globalAlpha = 1.0;
    this.ctx.font = '30px serif';
    this.ctx.fillStyle = 'white';
    // selectContinue
    if (this.gameOverSelect === 0) {
      this.ctx.globalAlpha = 1.0;
      this.ctx.fillText("continue", this.GAME_WIDTH / 2 - 50, this.GAME_HEIGHT / 2 - 30);
      this.ctx.globalAlpha = 0.3;
      this.ctx.fillText("title", this.GAME_WIDTH / 2 - 20, this.GAME_HEIGHT / 2 + 30);
      
    // selectTitle
    } else {
      this.ctx.globalAlpha = 0.3;
      this.ctx.fillText("continue", this.GAME_WIDTH / 2 - 50, this.GAME_HEIGHT / 2 - 30);
      this.ctx.globalAlpha = 1.0;
      this.ctx.fillText("title", this.GAME_WIDTH / 2 - 20, this.GAME_HEIGHT / 2 + 30);
    }

    // select
    if (this.renderCounter % 10 === 0) {
      if (window.isKeyDown.key_ArrowUp === true || window.isKeyDown.key_ArrowDown === true) {
        this.selectSE.play(); // 選択音
        this.selectSE.volume = 0.15;
        // player復活選択
        if (this.gameOverSelect === 0) {
          this.gameOverSelect = 1;
        // タイトル画面を選択
        } else {
          this.gameOverSelect = 0;
        }
      }
    }

    // 選択の実行
    if (window.isKeyDown.key_Enter === true) {
      this.determineSE.play();
      this.determineSE.volume = 0.15;
      this.stageState = 1; //gameRun
      // player復活
      if (this.gameOverSelect === 0) {
        // playerLife　開発用にお披露目会用に10000セット
        this.player.setLife(10000);
      // ページの再読み込み(タイトル画面へ)
      } else {
        location.reload();
      }
    }
  }
  // canvasをクリアにする
  clear = () => {
    this.ctx.clearRect(0, 0, this.w, this.h);
  }

}
