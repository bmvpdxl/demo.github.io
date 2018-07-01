

// 判断是否可以悔棋
const canBack = function () {
  const btnBack = $('#back');
  if (round > 0) {
    btnBack.removeAttribute('disabled');
    return true;
  } else {
    btnBack.setAttribute('disabled', true);
    return false;
  }
}

// 是否可以撤销
const canUndo = function () {



  const btnUndo = $('#undo');
  if (action.length === round * 2) {
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

  backActionNum++;
  round--;
  canBack();
  canUndo();
}

// 撤销悔棋
const undo = function () {
  round++;

  console.log(action, round)
  const myi = action[round*2-2][0];
  const myj = action[round*2-2][1];
  const myDom = action[round*2-2][2];

  const comi = action[round*2-1][0];
  const comj = action[round*2-1][1];
  const comDom = action[round*2-1][2];

  const chess = $('#chess');

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