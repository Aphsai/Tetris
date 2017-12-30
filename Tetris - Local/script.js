window.onload = function playTetris()  {
  var container = document.getElementById('container');
  var ct = container.getContext('2d');
  setInterval(update, 1000/30);
  setInterval(applyGrav, 1000/2);
  var currPiece = [];
  var currPiece_x = 4;
  var currPiece_y = 0;
  var currPiece_width = 0;
  var rotation = 0;
  var checkArray = [];
  var pieceList = [];
  var initialWidths = [4,2,3,3,3,2,3]
  var colours = ["#E5DB4E", "#CC51D1", "#CC3E2E", "#3B55DB", "#DBBD81", "#35C4C4", "#3CB221"];
  var BLOCKSIDE = 35;
  var BOARD_WIDTH = 10;
  var BOARD_HEIGHT = 20;
  var board = [];
  var genShapes = [];
  function initBoard() {
    for (var x = 0; x < 20; x++) {
      board.push([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    }
    board.push([-1, -1, -1, -1, -1, -1, -1, -1, -1, -1]);
  }
  var down = false;
  var left = false;
  var right = false;
  var positionChecked = true;
  initBoard();
  function keyDown(e) {
  var move = true;
    if (e.keyCode == 37) {
      console.log(lengthAdjustment);
      if (currPiece_x + lengthAdjustment > 0) {
        console.log(lengthAdjustment);
        for (var x = 0; x < currPiece.length; x++) {
          for (var y = lengthAdjustment; y < currPiece[x].length; y++) {
            if (currPiece[x][y] != '0') {
              if (board[currPiece_y+x][currPiece_x+y - 1] != '0')
                move = false;
              continue;
            }
          }
        }
      }
      else {
        move = false;
      }
      if (move) {
        currPiece_x -= 1;
      }
    }

    if (e.keyCode == 39) {
      if (currPiece_x < BOARD_WIDTH - currPiece_width) {
        for (var x = 0; x < currPiece.length; x++) {
          for (var y = 0; y < currPiece[x].length; y++) {
            if (currPiece[x][y] != '0') {
              if (board[currPiece_y+x][currPiece_x+y + 1] != '0')
                move = false;
              continue;
            }
          }
        }
      }
      else {
        move = false;
      }
      if (move) {
        currPiece_x += 1;
      }
    }
    // SPACEBAR
    if (e.keyCode == 32) {}
    // UP ARROW KEY
    if (e.keyCode == 38) {
      rotation += 1;
      rotation %= 4;
      positionChecked = false;
    }
    // DOWN ARRAY KEY
    if (e.keyCode == 40) {
      down = true;
    }
  }
  function keyUp(e) {
    if (e.keyCode == 40) {
      down = false;
    }
  }
  window.addEventListener("keyup", keyUp, false);
  window.addEventListener("keydown", keyDown, false);
  function initLines() {
    ct.strokeStyle = "#282c34";
    ct.lineWidth = 1;
    for (var x = 1; x < 10; x++) {
      ct.moveTo(x * 35, 0);
      ct.lineTo(x * 35, 700);
      ct.stroke();
    }
    for (var x = 1; x < 20; x++) {
      ct.moveTo(0, x * 35);
      ct.lineTo(350, x * 35);
      ct.stroke();
    }
  }
  //I O T S Z J L
  function intersection() {
      if (!positionChecked) {
      var potentialPosition = currPiece_x;
      var direction = false;
      positionChecked = true;
      outer: for (var y = 0; y < currPiece.length; y++) {
        for (var x = 0; x < currPiece[y].length; x++) {
          if (!direction) {
            direction = true;
            x + 1 < currPiece.length/2;
          }
          if (board[currPiece_y + y][potentialPosition + x] < 0 ||  potentialPosition + lengthAdjustment < 0 || potentialPosition + currPiece_width > BOARD_WIDTH) {
            if ((direction && board[currPiece_y + y][potentialPosition + x] < 0) || potentialPosition + lengthAdjustment < 0) {
            potentialPosition += 1;
            }
            else {
            potentialPosition -= 1;
            }
            x -= 1;
          }
        }
      }
      if (Math.abs(potentialPosition - currPiece_x) < 2) {
        currPiece_x = potentialPosition;
      }
      else {
        rotation -= 1;
      }
    }
  }
  function genO() {
    ct.fillStyle="#E5DB4E";
    roundRect(ct, currPiece_x * BLOCKSIDE, currPiece_y * BLOCKSIDE, BLOCKSIDE * 2, BLOCKSIDE * 2, 7, "#555", 1);
    currPiece = [[2, 2],
                 [1, 1]];
    lengthAdjustment = 0;
    currPiece_width = 2;
  }
  function genS() {
    ct.fillStyle= "#CC51D1";
    if (rotation == 0) {
      currPiece = [[0, 2, 1],
                   [1, 1, 0],
                   [0, 0, 0]];
      currPiece_width = 3;
      lengthAdjustment = 0;
          intersection();
      roundRect(ct, (currPiece_x + 1) * BLOCKSIDE, currPiece_y * BLOCKSIDE, BLOCKSIDE * 2, BLOCKSIDE, 7, "#555", 1);
      roundRect(ct, currPiece_x * BLOCKSIDE, (currPiece_y + 1) * BLOCKSIDE, BLOCKSIDE * 2, BLOCKSIDE, 7, "#555", 1);
    }
    else if (rotation == 1) {
      currPiece = [[0, 2, 0],
                   [0, 1, 2],
                   [0, 0, 1]];
      lengthAdjustment = 1;
          intersection();
      roundRect(ct, (currPiece_x + 1) * BLOCKSIDE, currPiece_y * BLOCKSIDE, BLOCKSIDE, BLOCKSIDE * 2, 7, "#555", 1);
      roundRect(ct, (currPiece_x + 2) * BLOCKSIDE, (currPiece_y + 1) * BLOCKSIDE, BLOCKSIDE, BLOCKSIDE * 2, 7, "#555", 1);
    }
    else if (rotation == 2) {
      currPiece = [[0, 0, 0],
                   [0, 2, 1],
                   [1, 1, 0]];
      currPiece_width = 2;
      lengthAdjustment = 0;
          intersection();
      roundRect(ct, (currPiece_x + 1) * BLOCKSIDE, (currPiece_y + 1) * BLOCKSIDE, BLOCKSIDE * 2, BLOCKSIDE, 7, "#555", 1);
      roundRect(ct, currPiece_x * BLOCKSIDE, (currPiece_y + 2) * BLOCKSIDE, BLOCKSIDE * 2, BLOCKSIDE, 7, "#555", 1);
    }
    else {
      currPiece = [[2, 0, 0],
                   [1, 2, 0],
                   [0, 1, 0]];
                       intersection();
      roundRect(ct, (currPiece_x) * BLOCKSIDE, currPiece_y * BLOCKSIDE, BLOCKSIDE, BLOCKSIDE * 2, 7, "#555", 1);
      roundRect(ct, (currPiece_x + 1) * BLOCKSIDE, (currPiece_y + 1) * BLOCKSIDE, BLOCKSIDE, BLOCKSIDE * 2, 7, "#555", 1);
    }


  }
  function genI() {
    ct.fillStyle="#CC3E2E";
    if (rotation == 0) {
      currPiece = [[0, 0, 2, 0],
                   [0, 0, 2, 0],
                   [0, 0, 2, 0],
                   [0, 0, 1, 0]];
      currPiece_width = 3;
      lengthAdjustment = 2;
      intersection();
      roundRect(ct, (currPiece_x + 2) * BLOCKSIDE, (currPiece_y) * BLOCKSIDE, BLOCKSIDE, BLOCKSIDE * 4, 7, "#555", 1);
    }
    else if (rotation == 1) {
      currPiece = [[0, 0, 0, 0],
                   [0, 0, 0, 0],
                   [1, 1, 1, 1],
                   [0, 0, 0, 0]];
      currPiece_width = 4;
      lengthAdjustment = 0;
      intersection();
      roundRect(ct, (currPiece_x) * BLOCKSIDE, (currPiece_y + 2) * BLOCKSIDE, BLOCKSIDE * 4, BLOCKSIDE, 7, "#555", 1);
    }
    else if (rotation == 2) {
      currPiece = [[0, 2, 0, 0],
                   [0, 2, 0, 0],
                   [0, 2, 0, 0],
                   [0, 1, 0, 0]];
      currPiece_width = 2;
      lengthAdjustment = 1;
      intersection();
      roundRect(ct, (currPiece_x + 1) * BLOCKSIDE, (currPiece_y) * BLOCKSIDE, BLOCKSIDE, BLOCKSIDE * 4, 7, "#555", 1);
    }
    else {
      currPiece = [[0, 0, 0, 0],
                   [1, 1, 1, 1],
                   [0, 0, 0, 0],
                   [0, 0, 0, 0]];
      currPiece_width = 4;
      lengthAdjustment = 0;
      intersection();
      roundRect(ct, (currPiece_x) * BLOCKSIDE, (currPiece_y + 1) * BLOCKSIDE, BLOCKSIDE * 4, BLOCKSIDE, 7, "#555", 1);
    }
  }
  function genT() {
    ct.fillStyle="#3B55DB";
    if (rotation == 0) {
      currPiece = [[0, 0, 0],
                   [1, 2, 1],
                   [0, 1, 0]];
                       currPiece_width = 3;
                       lengthAdjustment = 0;
                       intersection();
    roundRect(ct, (currPiece_x) * BLOCKSIDE, (currPiece_y + 1) * BLOCKSIDE, BLOCKSIDE * 3, BLOCKSIDE, 7, "#555", 1);
    roundRect(ct, (currPiece_x + 1) * BLOCKSIDE, (currPiece_y + 2) * BLOCKSIDE, BLOCKSIDE, BLOCKSIDE, 7, "#555", 1);
    }
    else if (rotation == 1) {
      currPiece = [[0, 2, 0],
                   [1, 2, 0],
                   [0, 1, 0]];
                         currPiece_width  = 2;
                       intersection();
      roundRect(ct, (currPiece_x + 1) * BLOCKSIDE, (currPiece_y) * BLOCKSIDE, BLOCKSIDE, BLOCKSIDE * 3, 7, "#555", 1);
      roundRect(ct, (currPiece_x) * BLOCKSIDE, (currPiece_y + 1) * BLOCKSIDE, BLOCKSIDE, BLOCKSIDE, 7, "#555", 1);
    }
    else if (rotation == 2) {
      currPiece = [[0, 2, 0],
                   [1, 1, 1],
                   [0, 0, 0]];
                   currPiece_width  = 3;
                       intersection();
      roundRect(ct, (currPiece_x + 1) * BLOCKSIDE, (currPiece_y) * BLOCKSIDE, BLOCKSIDE, BLOCKSIDE, 7, "#555", 1);
      roundRect(ct, (currPiece_x) * BLOCKSIDE, (currPiece_y + 1) * BLOCKSIDE, BLOCKSIDE * 3, BLOCKSIDE, 7, "#555", 1);
    }
    else {
      currPiece = [[0, 2, 0],
                   [0, 2, 1],
                   [0, 1, 0]];
                   currPiece_width  = 3;
                   lengthAdjustment = 1;
                       intersection();
      roundRect(ct, (currPiece_x + 1) * BLOCKSIDE, currPiece_y * BLOCKSIDE, BLOCKSIDE, BLOCKSIDE * 3, 7, "#555", 1);
      roundRect(ct, (currPiece_x + 2) * BLOCKSIDE, (currPiece_y + 1) * BLOCKSIDE, BLOCKSIDE, BLOCKSIDE, 7, "#555", 1);
    }
  }
  function genZ() {
    ct.fillStyle="#DBBD81";
    if (rotation == 0) {
      currPiece = [[1, 2, 0],
                   [0, 1, 1],
                   [0, 0, 0]];
                   currPiece_width  = 3;
                   lengthAdjustment = 0;
                       intersection();
      roundRect(ct, (currPiece_x) * BLOCKSIDE, currPiece_y * BLOCKSIDE, BLOCKSIDE * 2, BLOCKSIDE, 7, "#555", 1);
      roundRect(ct, (currPiece_x + 1) * BLOCKSIDE, (currPiece_y + 1) * BLOCKSIDE, BLOCKSIDE * 2, BLOCKSIDE, 7, "#555", 1);
    }
    else if (rotation == 1) {
      currPiece = [[0, 0, 2],
                   [0, 2, 1],
                   [0, 1, 0]];
                   lengthAdjustment = 1;
                       intersection();
      roundRect(ct, (currPiece_x + 1) * BLOCKSIDE, (currPiece_y + 1) * BLOCKSIDE, BLOCKSIDE, BLOCKSIDE * 2, 7, "#555", 1);
      roundRect(ct, (currPiece_x + 2) * BLOCKSIDE, (currPiece_y) * BLOCKSIDE, BLOCKSIDE, BLOCKSIDE * 2, 7, "#555", 1);
    }
    else if (rotation == 2) {
      currPiece = [[0, 0, 0],
                   [1, 2, 0],
                   [0, 1, 1]];
                   lengthAdjustment = 0;
                       intersection();
      roundRect(ct, (currPiece_x) * BLOCKSIDE, (currPiece_y + 1) * BLOCKSIDE, BLOCKSIDE * 2, BLOCKSIDE, 7, "#555", 1);
      roundRect(ct, (currPiece_x + 1) * BLOCKSIDE, (currPiece_y + 2) * BLOCKSIDE, BLOCKSIDE * 2, BLOCKSIDE, 7, "#555", 1);
    }
    else {
      currPiece = [[0, 2, 0],
                   [2, 1, 0],
                   [1, 0, 0]];
                currPiece_width = 2;
                       intersection();
      roundRect(ct, (currPiece_x) * BLOCKSIDE, (currPiece_y + 1) * BLOCKSIDE, BLOCKSIDE, BLOCKSIDE * 2, 7, "#555", 1);
      roundRect(ct, (currPiece_x + 1) * BLOCKSIDE, (currPiece_y) * BLOCKSIDE, BLOCKSIDE, BLOCKSIDE * 2, 7, "#555", 1);
    }
  }
  function genJ() {
    ct.fillStyle="#35C4C4";
    if (rotation == 0) {
      currPiece = [[0, 2, 0],
                   [0, 2, 0],
                   [1, 1, 0]];
                currPiece_width = 2;
                   lengthAdjustment = 0;
                       intersection();
    roundRect(ct, (currPiece_x + 1) * BLOCKSIDE, currPiece_y * BLOCKSIDE, BLOCKSIDE, BLOCKSIDE * 3, 7, "#555", 1);
    roundRect(ct, currPiece_x * BLOCKSIDE, (currPiece_y + 2) * BLOCKSIDE, BLOCKSIDE, BLOCKSIDE, 7, "#555", 1);
    }
    else if (rotation == 1) {
      currPiece = [[2, 0, 0],
                   [1, 1, 1],
                   [0, 0, 0]];
                  currPiece_width  = 3;
                       intersection();
    roundRect(ct, (currPiece_x) * BLOCKSIDE, currPiece_y * BLOCKSIDE, BLOCKSIDE, BLOCKSIDE, 7, "#555", 1);
    roundRect(ct, currPiece_x * BLOCKSIDE, (currPiece_y + 1) * BLOCKSIDE, BLOCKSIDE * 3, BLOCKSIDE, 7, "#555", 1);
     }
     else if (rotation == 2) {
       currPiece = [[0, 2, 1],
                    [0, 2, 0],
                    [0, 1, 0]];
                    lengthAdjustment = 0;
                        intersection();
     roundRect(ct, (currPiece_x + 1) * BLOCKSIDE, currPiece_y * BLOCKSIDE, BLOCKSIDE, BLOCKSIDE * 3, 7, "#555", 1);
     roundRect(ct, (currPiece_x + 2) * BLOCKSIDE, (currPiece_y) * BLOCKSIDE, BLOCKSIDE, BLOCKSIDE, 7, "#555", 1);
     }
     else {
       currPiece = [[0, 0, 0],
                    [1, 1, 2],
                    [0, 0, 1]];
                    currPiece_width  = 3;
                        intersection();
     roundRect(ct, (currPiece_x) * BLOCKSIDE, (currPiece_y + 1) * BLOCKSIDE, BLOCKSIDE * 3, BLOCKSIDE, 7, "#555", 1);
     roundRect(ct, (currPiece_x + 2) * BLOCKSIDE, (currPiece_y + 2) * BLOCKSIDE, BLOCKSIDE, BLOCKSIDE, 7, "#555", 1);
     }

  }
  function genL() {
    ct.fillStyle="#3CB221";
    if (rotation == 0) {
      currPiece = [[0, 2, 0],
                   [0, 2, 0],
                   [0, 1, 1]];
                  currPiece_width  = 3;
                  lengthAdjustment = 1;
                       intersection();
    roundRect(ct, (currPiece_x + 1) * BLOCKSIDE, currPiece_y * BLOCKSIDE, BLOCKSIDE, BLOCKSIDE * 3, 7, "#555", 1);
    roundRect(ct, (currPiece_x + 2) * BLOCKSIDE, (currPiece_y + 2) * BLOCKSIDE, BLOCKSIDE, BLOCKSIDE, 7, "#555", 1);
    }
    else if (rotation == 1) {
      currPiece = [[0, 0, 0],
                   [2, 1, 1],
                   [1, 0, 0]];
                   lengthAdjustment = 0;
                   intersection();
    roundRect(ct, currPiece_x * BLOCKSIDE, (currPiece_y + 1) * BLOCKSIDE, BLOCKSIDE * 3, BLOCKSIDE, 7, "#555", 1);
    roundRect(ct, (currPiece_x) * BLOCKSIDE, (currPiece_y + 2) * BLOCKSIDE, BLOCKSIDE, BLOCKSIDE, 7, "#555", 1);
    }
    else if (rotation == 2) {
      currPiece = [[1, 2, 0],
                   [0, 2, 0],
                   [0, 1, 0]];
                  currPiece_width = 2;
                  intersection();
    roundRect(ct, currPiece_x * BLOCKSIDE, currPiece_y * BLOCKSIDE, BLOCKSIDE, BLOCKSIDE, 7, "#555", 1);
    roundRect(ct, (currPiece_x + 1) * BLOCKSIDE, (currPiece_y) * BLOCKSIDE, BLOCKSIDE, BLOCKSIDE * 3, 7, "#555", 1);
    }
    else {
      currPiece = [[0, 0, 2],
                   [1, 1, 1],
                   [0, 0, 0]];
                   currPiece_width  = 3;
                   intersection();
    roundRect(ct, (currPiece_x + 2) * BLOCKSIDE, currPiece_y * BLOCKSIDE, BLOCKSIDE, BLOCKSIDE, 7, "#555", 1);
    roundRect(ct, (currPiece_x) * BLOCKSIDE, (currPiece_y + 1) * BLOCKSIDE, BLOCKSIDE * 3, BLOCKSIDE, 7, "#555", 1);
    }
  }
  genShapes = [genO, genS, genI, genT, genZ, genJ, genL];
  function roundRect(ctx, x, y, width, height, radius, fill) {
    stroke = "#555";
    if (typeof stroke == 'undefined') {
      stroke = true;
    }
    if (typeof radius === 'undefined') {
      radius = 5;
    }
    if (typeof radius === 'number') {
      radius = {tl: radius, tr: radius, br: radius, bl: radius};
    } else {
      var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
      for (var side in defaultRadius) {
        radius[side] = radius[side] || defaultRadius[side];
      }
    }
    ctx.beginPath();
    ctx.moveTo(x + radius.tl, y);
    ctx.lineTo(x + width - radius.tr, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
    ctx.lineTo(x + width, y + height - radius.br);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
    ctx.lineTo(x + radius.bl, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
    ctx.lineTo(x, y + radius.tl);
    ctx.quadraticCurveTo(x, y, x + radius.tl, y);
    ctx.closePath();
    if (fill) {
      ctx.fill();
    }
    if (stroke) {
      ctx.stroke();
    }
  }
  //=---------------------------------CREATING NEW PIECE
  //O, S, I, T, Z, J, L
  function newPiece() {
    rotation = 0;
    currPiece_width = 0;
    lengthAdjustment = 0;
    pieceList.shift();
    currPiece_x = 3;
    currPiece_y = 0;
    if (pieceList.length == 0) {
      newPieceList();
    }
  }
  function newPieceList() {
    for (var x = 0; x < 7; x++) {
      pieceList.push(x);
    }
    shuffle(pieceList);
  }
  function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
}
  function clear() {
    ct.fillStyle="#21252b";
    ct.fillRect(0,0,BOARD_WIDTH * BLOCKSIDE, BOARD_HEIGHT * BLOCKSIDE);
    for (var x = 0; x < BOARD_HEIGHT; x++) {
      for (var y = 0; y < BOARD_WIDTH; y++) {
        if (board[x][y] < 0) {
          ct.fillStyle = colours[-board[x][y] - 1];
          roundRect(ct, y * BLOCKSIDE, x * BLOCKSIDE, BLOCKSIDE, BLOCKSIDE, 7, "#555", 1);
        }
      }
    }
  }
  newPiece();
  function update() {
    clear();
    initLines();
    if (down == true) {
      applyGrav();
    }
    genShapes[pieceList[0]]();
  }
  function applyGrav() {

    if(currPiece[0].length > 0)
    for (var x = 0; x < currPiece.length; x++) {
      for (var y = 0; y < currPiece[x].length; y++) {
        if (currPiece[x][y] == 1) {
          var x_point = currPiece_x + y;
          var y_point = currPiece_y + x;
          // console.log(x_point + " "  + y_point);
          if (board[y_point + 1][x_point] < 0) {
            for (var x = 0; x < currPiece.length; x++) {
              for (var y = 0; y < currPiece[x].length; y++) {
                if (currPiece[x][y] != 0)
                board[x + currPiece_y][y + currPiece_x] = -(pieceList[0] + 1);
              }
            }
            newPiece();
            // console.log(board);

          }
        }
      }
    }
    currPiece_y += 1;
  }
}
