
// 绘制棋盘
const draw = (function ($, $create) {

  const _pieceWidth = _parseInt(_gridWidth) * 0.8 + 'px';  // 棋子宽度
  const _pieceCache = [];

  // 设置棋盘尺寸
  const setChessTableSize = function (width) {
    _chess.style.width = width;
    _chess.style.height = width;

    // 设置棋盘遮罩的尺寸
    _mask.style.width = width;
    _mask.style.height = width;
  };

  // 绘制DOM棋盘，默认：棋盘格30px*30px，尺寸450px*450px
  const drawTable = function (n = _chessGridNum, chessPadding = '15px', gridWidth = _gridWidth) {

    // 如果n不是15, 重新设置chess的宽高
    if (n !== 15) {
      const chessWidth = (n - 1) * _parseInt(gridWidth) + 2 * _parseInt(chessPadding) + 'px';
      setChessTableSize(chessWidth);
    }

    const table = $create('table');
    table.style.borderCollapse = 'collapse';
    table.style.position = 'relative';
    table.style.width = '100%';
    table.style.height = '100%';
    // 绘制棋盘的上、左边框
    table.style.borderTop = borderStyle;
    table.style.borderLeft = borderStyle;
    _chess.appendChild(table);

    // 绘制棋盘格
    for (let i = 0; i < n - 1; i++) {
      const tr = $create('tr');
      for (let j = 0; j < n - 1; j++) {
        const td = $create('td');
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
    const piece = $create('div');
    piece.classList.add('piece');
    if (d !== _pieceWidth) {
      piece.style.width = d;
      piece.style.height = d;
    }

    piece.style.top = y * _parseInt(_gridWidth) + _parseInt(_chessPadding) - _parseInt(_pieceWidth) / 2 + 'px';
    piece.style.left = x * _parseInt(_gridWidth) + _parseInt(_chessPadding) - _parseInt(_pieceWidth) / 2 + 'px';

    // type：true时黑子，false时白子
    if (type) {
      piece.classList.add('piece-b');
    } else {
      piece.classList.add('piece-w');
    }
    _chess.appendChild(piece);

    // 记录动作
    action.push([x, y, piece, type]);

    // 更新按钮状态
    canBack();
    canUndo();

    return piece;
  };

  // 重置棋盘
  const resetBoard = function () {
    let allPiece = $all('.piece');
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

})($, $create);