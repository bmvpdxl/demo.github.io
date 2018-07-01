

const algorithm = (function () {

  // 初始化棋盘位置落子情况数组
  function initChessBoard() {
    // 棋盘位置，0表示未落子，1表示黑子，2表示白子
    for (let i = 0; i < _chessGridNum; i++) {
      chessBoard[i] = [];
      for (let j = 0; j < _chessGridNum; j++) {
        chessBoard[i][j] = 0;
      }
    }
  };

  // 初始化赢法数组
  function initWins() {
    for (let i = 0; i < _chessGridNum; i++) {
      wins[i] = [];
      for (let j = 0; j < _chessGridNum; j++) {
        wins[i][j] = [];
      }
    }

    // 横向赢法
    for (let i = 0; i < _chessGridNum - 4; i++) {
      for (let j = 0; j < _chessGridNum; j++) {
        for (let k = 0; k < 5; k++) {
          wins[i + k][j][count] = true;
        }
        count++;
      }
    }

    // 竖向赢法
    for (let i = 0; i < _chessGridNum; i++) {
      for (let j = 0; j < _chessGridNum - 4; j++) {
        for (let k = 0; k < 5; k++) {
          wins[i][j + k][count] = true;
        }
        count++;
      }
    }

    // 正向斜线赢法
    for (let i = 0; i < _chessGridNum - 4; i++) {
      for (let j = 0; j < _chessGridNum - 4; j++) {
        for (let k = 0; k < 5; k++) {
          wins[i + k][j + k][count] = true;
        }
        count++;
      }
    }


    // 反向斜线赢法
    for (let i = 4; i < _chessGridNum; i++) {
      for (let j = 0; j < _chessGridNum-4; j++) {
        for (let k = 0; k < 5; k++) {
          wins[i-k][j+k][count] = true;
        }
        count++;
      }
    }
  };

  // 赢法统计数组
  function initWinsStastic() {
    myWin = Array(count).fill(0);
    computerWin = Array(count).fill(0);
  }

  return function () {
    initChessBoard();
    initWins();
    initWinsStastic();
  }
})();