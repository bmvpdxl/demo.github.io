
// 落子
const step = (function () {
  // 计算落子位置
  const calcPos = function (x, y) {
    const _padding = _parseInt(_chessPadding);
    const _width = _parseInt(_gridWidth);

    // 四舍五入，保证棋子落在最近的 格点处
    const i = Math.round((x - _padding) / _width);
    const j = Math.round((y - _padding) / _width);
    return [i, j];
  }

  return function () {

    // 点击落子
    _mask.addEventListener('click', function (e) {
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
              setTimeout(()=>{
                alert('你赢了');
              });
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