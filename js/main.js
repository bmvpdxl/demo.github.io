// 棋盘
const chess = document.querySelector("#chess");
// 棋盘遮罩
const mask = document.querySelector('#chess-mask');
// 棋盘格数，默认15
const chessGridNum = 15;
// 棋盘四周留白，默认15px
const chessPadding = '15px';
// 格子宽度
const gridWidth = '30px';
// 格子颜色
const borderStyle = '1px solid #BFBFBF';
// 是否该自己落子
let me = true;
// 记录所有赢法
let wins = [];
// 赢法种数
let count = 0;
// 本方赢法统计数组
let myWin = [];
// 计算机赢法统计数组
let computerWin = [];
let chessBoard = [];
// 游戏是否结束
let over = false;
// 当前轮数
let round = 0;
// 记录每次落子的[i,j,dom]
let action = [];


// 绘制棋盘
const draw = (function () {
  const _pieceWidth = parseInt(gridWidth) * 0.8 + 'px';  // 棋子宽度
  // 设置棋盘尺寸
  const setChessTableSize = function (width) {
    chess.style.width = width;
    chess.style.height = width;
    // 设置棋盘遮罩的尺寸
    mask.style.width = width;
    mask.style.height = width;
  };

  // 绘制DOM棋盘，默认：棋盘格30px*30px，尺寸450px*450px
  const drawTable = function (n = chessGridNum, chessPadding = '15px') {
    // 如果n不是15, 重新设置chess的宽高
    if (n !== 15) {
      const chessWidth = (n - 1) * parseInt(gridWidth) + 2 * parseInt(chessPadding) + 'px';
      setChessTableSize(chessWidth);
    }

    const table = document.createElement('table');
    table.style.borderCollapse = 'collapse';
    table.style.position = 'relative';
    table.style.width = '100%';
    table.style.height = '100%';
    // 绘制棋盘的上、左边框
    table.style.borderTop = borderStyle;
    table.style.borderLeft = borderStyle;
    chess.appendChild(table);

    // 绘制棋盘格
    for (let i = 0; i < n - 1; i++) {
      const tr = document.createElement('tr');
      for (let j = 0; j < n - 1; j++) {
        const td = document.createElement('td');
        td.style.borderRight = borderStyle;
        td.style.borderBottom = borderStyle;
        td.style.width = gridWidth;
        td.style.height = gridWidth;
        tr.appendChild(td);
      }
      table.appendChild(tr);
    }
  };

  // 绘制棋子
  const drawPiece = function (x = 0, y = 0, type = true, d) {
    const piece = document.createElement('div');
    piece.classList.add('piece');
    if (d !== _pieceWidth) {
      piece.style.width = d;
      piece.style.height = d;
    }

    piece.style.top = y * parseInt(gridWidth) + parseInt(chessPadding) - parseInt(_pieceWidth) / 2 + 'px';
    piece.style.left = x * parseInt(gridWidth) + parseInt(chessPadding) - parseInt(_pieceWidth) / 2 + 'px';

    // type：true时黑子，false时白子
    if (type) {
      piece.classList.add('piece-b');
    } else {
      piece.classList.add('piece-w');
    }
    chess.appendChild(piece);

    // 记录动作
    action.push([x, y, piece, type]);

    // 更新按钮状态
    canBack();
    canUndo();

    return piece;
  };

  // 重置棋盘
  const resetBoard = function () {
    let allPiece = document.querySelectorAll('.piece');
    if (!allPiece.length) { return; }
    const parent = allPiece[0].parentElement;
    for (let i = 0; i < allPiece.length; i++) {
      parent.removeChild(allPiece[i]);
    }
  }

  // 绘制棋盘api，绘制棋子api, 重置api
  const draw = drawTable;
  draw.piece = drawPiece;
  draw.reset = resetBoard;

  return draw;

})();


// 初始化相关数组
const algorithm = (function () {
  // 初始化棋盘位置落子情况数组
  function initChessBoard() {
    // 棋盘位置，0表示未落子，1表示黑子，2表示白子
    for (let i = 0; i < chessGridNum; i++) {
      chessBoard[i] = [];
      for (let j = 0; j < chessGridNum; j++) {
        chessBoard[i][j] = 0;
      }
    }
  };

  // 初始化赢法数组
  function initWins() {
    for (let i = 0; i < chessGridNum; i++) {
      wins[i] = [];
      for (let j = 0; j < chessGridNum; j++) {
        wins[i][j] = [];
      }
    }

    // 横向赢法
    for (let i = 0; i < chessGridNum - 4; i++) {
      for (let j = 0; j < chessGridNum; j++) {
        for (let k = 0; k < 5; k++) {
          wins[i + k][j][count] = true;
        }
        count++;
      }
    }

    // 竖向赢法
    for (let i = 0; i < chessGridNum; i++) {
      for (let j = 0; j < chessGridNum - 4; j++) {
        for (let k = 0; k < 5; k++) {
          wins[i][j + k][count] = true;
        }
        count++;
      }
    }

    // 正向斜线赢法
    for (let i = 0; i < chessGridNum - 4; i++) {
      for (let j = 0; j < chessGridNum - 4; j++) {
        for (let k = 0; k < 5; k++) {
          wins[i + k][j + k][count] = true;
        }
        count++;
      }
    }

    // 反向斜线赢法
    for (let i = 4; i < chessGridNum; i++) {
      for (let j = 0; j < chessGridNum - 4; j++) {
        for (let k = 0; k < 5; k++) {
          wins[i - k][j + k][count] = true;
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

// 计算机落子
const computerAI = function () {
  let myScore = [];
  let computerScore = [];
  let max = 0;
  // 默认落子在中间
  let n = Math.floor(chessGridNum / 2);
  let u = n, v = n;
  for (let i = 0; i < chessGridNum; i++) {
    myScore[i] = [];
    computerScore[i] = [];
    for (let j = 0; j < chessGridNum; j++) {
      myScore[i][j] = 0;
      computerScore[i][j] = 0;
    }
  }

  // 落子判断
  for (var i = 0; i < chessGridNum; i++) {
    for (let j = 0; j < chessGridNum; j++) {
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
        }, 0);
        over = true;
        canBack();
        canUndo();
      }
    }
  }
  if (!over) {
    me = !me;
  }
}

// 落子
const step = (function () {
  // 计算落子位置
  const calcPos = function (x, y) {
    const _padding = parseInt(chessPadding);
    const _width = parseInt(gridWidth);

    // 四舍五入，保证棋子落在最近的 格点处
    const i = Math.round((x - _padding) / _width);
    const j = Math.round((y - _padding) / _width);
    return [i, j];
  }

  return function () {

    // 绑定事件, 点击落子
    mask.addEventListener('click', function (e) {
      if (over) { return; }
      if (!me) { return; }
      const [i, j] = calcPos(e.offsetX, e.offsetY);

      // 判断是否可以落子
      if (chessBoard[i][j] == 0) {
        draw.piece(i, j, me);

        chessBoard[i][j] = 1;
        for (let k = 0; k < count; k++) {
          if (wins[i][j][k]) {
            // 本方在[i][j]位置的第[k]种赢法多了一个子
            myWin[k]++;
            // 对方在[i][j]位置的第[k]种赢法无法实现
            computerWin[k] = 6;
            if (myWin[k] === 5) {
              setTimeout(() => {
                alert('你赢了');
              },0);
              over = true;
              canBack();
              canUndo();
            }
          }
        }

        // 当前轮数加1
        round++;

        if (!over) {
          me = !me;
          computerAI();
        }
      }
    });
  }
})();

// 判断是否可以悔棋
const canBack = function () {
  const btnBack = document.querySelector('#back');
  if (round > 0 && !over) {
    btnBack.removeAttribute('disabled');
    return true;
  } else {
    btnBack.setAttribute('disabled', true);
    return false;
  }
}

// 是否可以撤销
const canUndo = function () {
  const btnUndo = document.querySelector('#undo');
  if (action.length === round * 2 || over) {
    btnUndo.setAttribute('disabled', true);
    return false;
  } else {
    btnUndo.removeAttribute('disabled');
    return true;
  }
}

// 悔棋
const back = function () {
  if (!canBack()) {
    return;
  }
  // 己方缓存
  const myi = action[round * 2 - 2][0];
  const myj = action[round * 2 - 2][1];
  const myDom = action[round * 2 - 2][2];

  // 计算机缓存
  const comi = action[round * 2 - 1][0];
  const comj = action[round * 2 - 1][0];
  const comDom = action[round * 2 - 1][2];

  chessBoard[myi][myj] = 0;
  chessBoard[comi][comj] = 0;

  for (let k = 0; k < count; k++) {
    // 己方赢法统计数组回退
    if (wins[myi][myj][k]) {
      myWin[k]--;
      if (!myWin[k]) {
        computerWin[k] = 0;
      }
    }

    // 计算机赢法统计数组回退
    if (wins[comi][comj][k]) {
      computerWin[k]--;
      if (!computerWin[k]) {
        myWin[k] = 0;
      }
    }
  }

  // 去掉棋子
  myDom.parentElement.removeChild(myDom);
  comDom.parentElement.removeChild(comDom);

  round--;
  canBack();
  canUndo();
}

// 撤销悔棋
const undo = function () {
  round++;
  const myi = action[round * 2 - 2][0];
  const myj = action[round * 2 - 2][1];
  const myDom = action[round * 2 - 2][2];

  const comi = action[round * 2 - 1][0];
  const comj = action[round * 2 - 1][1];
  const comDom = action[round * 2 - 1][2];

  const chess = document.querySelector('#chess');
  chessBoard[myi][myj] = 1;
  chessBoard[comi][comj] = 2;

  for (let k = 0; k < count; k++) {
    // 回滚己方数据
    if (wins[myi][myj][k]) {
      myWin[k]++;
      computerWin[k] = 6;
    }

    // 回滚计算机数据
    if (wins[comi][comj][k]) {
      computerWin[k]++;
      myWin[k] = 6;
    }
  }

  // 回滚棋子
  chess.appendChild(myDom);
  chess.appendChild(comDom);

  canBack();
  canUndo();
}

// 初始化
draw();
step();

// 逻辑初始化
algorithm();

// 检查按钮
canBack();
canUndo();

// 重置按钮
document.querySelector('#reset').addEventListener('click', function () {
  step();
  algorithm();
  draw.reset();
  me = true;
  over = false;
  round = 0;
  action = [];
});

// 悔棋按钮
document.querySelector('#back').addEventListener('click', function () {
  back();
});

// 撤销按钮
document.querySelector('#undo').addEventListener('click', function () {
  undo();
});

