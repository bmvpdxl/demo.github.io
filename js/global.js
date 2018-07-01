
// 全局变量/方法

// 全局方法
const $ = selector => document.querySelector(selector);  // 选取元素
const $all = selector => document.querySelectorAll(selector);
const $create = tag => document.createElement(tag);  // 创建元素
const _parseInt = n => parseInt(n, 10);  // 默认十进制
const doCache = ()=>{
  cache.myWinCache = JSON.stringify(myWin);
  cache.computerWinCache = JSON.stringify(computerWin);

}

// 样式相关
const _chess = $("#chess");       // 棋盘
const _mask = $('#chess-mask');   // 棋盘遮罩
const _chessGridNum = 15;         // 棋盘格数，默认15
const _chessPadding = '15px';     // 棋盘四周留白，默认15px
const _gridWidth = '30px';                // 格子宽度
const borderStyle = '1px solid #BFBFBF';  // 格子颜色

// 下棋相关
let me = true;        // 是否该自己落子
let wins = [];        // 记录所有赢法
let count = 0;        // 赢法种数
let myWin = [];       // 本方赢法统计数组
let computerWin = [];  // 对方赢法统计数组
let chessBoard = [];
let over = false;     // 游戏是否结束
let round = 0;     // 当前轮数
let backActionNum = 0;  // 记录悔了几步棋
let action = [];      // 记录每次落子的[i,j,dom]
let actionDom = [];   // 记录每个棋子的dom
let chessColor = 'black';  // 记录棋子颜色
