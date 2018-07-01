

// 初始化

// 绘制棋盘
draw();

// 绑定事件，可以落子
step();

// 逻辑初始化
algorithm();

// 检查按钮
canBack();
canUndo();

$('#reset').addEventListener('click', function(){
  step();
  algorithm();
  draw.reset();
  me = true;
  over = false;
});

$('#back').addEventListener('click', function(){
  back();
});

$('#undo').addEventListener('click', function(){
  undo();
});

