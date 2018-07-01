
const computerAI = (function () {

  function AI() {
    let myScore = [];
    let computerScore = [];
    let max = 0;
    // 默认落子在中间
    let n = Math.floor(_chessGridNum / 2);
    let u = n, v = n;
    for (let i = 0; i < _chessGridNum; i++) {
      myScore[i] = [];
      computerScore[i] = [];
      for (let j = 0; j < _chessGridNum; j++) {
        myScore[i][j] = 0;
        computerScore[i][j] = 0;
      }
    }

    // 落子判断
    for (var i = 0; i < _chessGridNum; i++) {
      for (let j = 0; j < _chessGridNum; j++) {
        // 该点未落子
        if (chessBoard[i][j] == 0) {
          for (let k = 0; k < count; k++) {
            // 该点存在于第k种赢法中
            if (wins[i][j][k]) {

              // 阻止对方获胜
              // 第k种赢法中对方已有一颗子, 对方加分
              if (myWin[k] == 1) {
                myScore[i][j] += 200;
              } else if (myWin[k] == 2) {
                myScore[i][j] += 400;
              } else if (myWin[k] == 3) {
                myScore[i][j] += 2000;
              } else if (myWin[k] == 4) {
                myScore[i][j] += 10000;
              }

              // 计算机得分
              // 第k种赢法中自己已有一颗子, 自己加分
              if (computerWin[k] == 1) {
                computerScore[i][j] += 220;
              } else if (computerWin[k] == 2) {
                computerScore[i][j] += 420;
              } else if (computerWin[k] == 3) {
                computerScore[i][j] += 2100;
              } else if (computerWin[k] == 4) {
                computerScore[i][j] += 20000;
              }
            }
          }

          // 记录最大得分点以及坐标
          if (myScore[i][j] > max) {
            max = myScore[i][j];
            u = i;
            v = j;
          } else if (myScore[i][j] == max) {
            if (computerScore[i][j] > computerScore[u][v]) {
              u = i;
              v = j;
            }
          }

          if (computerScore[i][j] > max) {
            max = computerScore[i][j];
            u = i;
            v = j;
          } else if (computerScore[i][j] == max) {
            if (myScore[i][j] > myScore[u][v]) {
              u = i;
              v = j;
            }
          }
        }
      }
    }

    // 落子
    draw.piece(u, v, false);
    chessBoard[u][v] = 2;

    // 更新计算机赢法统计数组
    for (let k = 0; k < count; k++) {
      if (wins[u][v][k]) {
        // 计算机在[u][v]位置的第[k]种赢法多了一个子
        computerWin[k]++;
        // 对方在[u][v]位置的第[k]种赢法无法实现
        myWin[k] = 6;
        if (computerWin[k] === 5) {
          setTimeout(() => {
            alert('你输了');
          });
          over = true;
        }
      }
    }
    if (!over) {
      me = !me;
    }
  }



  return function () {
    AI();
  }
})();