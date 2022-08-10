/**
 * canvas画面管理
 */
(() => {
  // キー押下状態
  window.isKeyDown = {};
  // ゲームのスコア
  window.gameScore = 0;
  // canvas 幅　高さ
  const GAME_WIDTH = 480;
  const GAME_HEIGHT = 480;

  /**
   * canvas画面のステート管理
   * 
   * state 番号で管理
   * 0:タイトル画面
   * 1:ゲーム画面
   * 2:ローディング画面
   * 3:会話画面(導入)
   * 
   */
  let state = 0;
  let states = [];
  //  ページが読み込まれたら
  window.addEventListener('load', () => {
    // キーの設定
    eventSetting();
    // インスタンス生成＆配列に格納
    states[0] = new Title(GAME_WIDTH, GAME_HEIGHT);
    states[1] = new GameManager();
    states[2] = new Loading();
    states[3] = new introductionTalking(GAME_WIDTH, GAME_HEIGHT);
    // タイトル画面を初期化
    states[state].init();
    // 描画を開始
    render();
      
  },false);

  /**
   *  canvasの描写
   */
  render = () => {
    // 状態を描画
    states[state].update();
    // 状態が切り替わったら次の画面へ移り初期化を実行
    if (state !== states[state].next()) {
      state = states[state].next();
      states[state].init();
      console.log(state);
    }
    // 再帰(1秒間に60回回る)
    requestAnimationFrame(render);
  }

  // 押下キーセッティング
  eventSetting = () => {
    // キーの押下時に呼び出されるイベントリスナーを設定する
    window.addEventListener('keydown', (event) => {
        // キーの押下状態を管理するオブジェクトに押下されたことを設定する
        isKeyDown[`key_${event.key}`] = true;
    }, false);
    // キーが離された時に呼び出されるイベントリスナーを設定する
    window.addEventListener('keyup', (event) => {
        // キーが離されたことを設定する
        isKeyDown[`key_${event.key}`] = false;
    }, false);
  }
  
  // 次の画面へ
  next = () => {
    return this.state;
  }

})();
