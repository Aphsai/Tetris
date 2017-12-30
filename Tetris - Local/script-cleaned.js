window.onload = function playTetris()  {
  //HTML STUFF
  var container = document.getElementById('container');
  var preview = document.getElementById("preview");
  var ct = container.getContext('2d');
  var ctPre = preview.getContext('2d');
  //PREVIEW PARAMETERS
  var PREVIEW_WIDTH = 4;
  var PREVIEW_HEIGHT = 4;
  //BOARD PARAMETERS
  var BOARD_WIDTH = 10;
  var BOARD_HEIGHT = 20;
  var BLOCKSIDE = 35;
  var board = [];
  var boardColor = "#21252b"
  var clearLines = [];
  //PIECES - O || S || I || T || Z || J || L
  var colours = ["#E5DB4E", "#CC51D1", "#CC3E2E", "#3B55DB", "#DBBD81", "#35C4C4", "#3CB221"];
  var currPiece;
  var heldPiece = -1;
  var currPieceArr;
  var currPiece_row = 0;
  var currPiece_column = 0;
  var pieceQueue = [];
  var pieces = [
    [ //O
      [[2, 2],
      [1, 1]],

      [[2, 2],
      [1, 1]],

      [[2, 2],
      [1, 1]],

      [[2, 2],
      [1, 1]]
    ],
    [ //S
      [[0, 2, 1],
      [1, 1, 0],
      [0, 0, 0]],

      [[0, 2, 0],
      [0, 1, 2],
      [0, 0, 1]],

      [[0, 0, 0],
      [0, 2, 1],
      [1, 1, 0]],

      [[2, 0, 0],
      [1, 2, 0],
      [0, 1, 0]]
    ],
    [ //I
      [[0, 0, 2, 0],
      [0, 0, 2, 0],
      [0, 0, 2, 0],
      [0, 0, 1, 0]],

      [[0, 0, 0, 0],
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0]],

      [[0, 2, 0, 0],
      [0, 2, 0, 0],
      [0, 2, 0, 0],
      [0, 1, 0, 0]],

      [[0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0]]
    ],
    [ //T
      [[0, 0, 0],
      [1, 2, 1],
      [0, 1, 0]],

      [[0, 2, 0],
      [1, 2, 0],
      [0, 1, 0]],

      [[0, 2, 0],
      [1, 1, 1],
      [0, 0, 0]],

      [[0, 2, 0],
      [0, 2, 1],
      [0, 1, 0]]
    ],
    [ //Z
      [[1, 2, 0],
      [0, 1, 1],
      [0, 0, 0]],

      [[0, 0, 2],
      [0, 2, 1],
      [0, 1, 0]],

      [[0, 0, 0],
      [1, 2, 0],
      [0, 1, 1]],

      [[0, 2, 0],
      [2, 1, 0],
      [1, 0, 0]]
    ],
    [//J
      [[0, 2, 0],
      [0, 2, 0],
      [1, 1, 0]],

      [[2, 0, 0],
      [1, 1, 1],
      [0, 0, 0]],

      [[0, 2, 1],
      [0, 2, 0],
      [0, 1, 0]],

      [[0, 0, 0],
      [1, 1, 2],
      [0, 0, 1]]
    ],
    [//L
      [[0, 2, 0],
      [0, 2, 0],
      [0, 1, 1]],

      [[0, 0, 0],
      [2, 1, 1],
      [1, 0, 0]],

      [[1, 2, 0],
      [0, 2, 0],
      [0, 1, 0]],

      [[0, 0, 2],
      [1, 1, 1],
      [0, 0, 0]]
    ]
  ];
  var ROUNDING = 7;
  var orientation = 0;
  var leftAdjustment =  [
    [0, 0, 0, 0],
    [0, 1, 0, 0],
    [2, 0, 1, 0],
    [0, 0, 0, 1],
    [0, 1, 0, 0],
    [0, 0, 1, 0],
    [1, 0, 0, 0]
  ];
  var rightAdjustment =  [
    [2, 2, 2, 2],
    [3, 3, 2, 2],
    [3, 4, 2, 4],
    [3, 2, 3, 3],
    [3, 3, 3, 2],
    [2, 3, 2, 3],
    [3, 3, 2, 3]
  ];
  var basePieces =  [
    [[1, 1],
    [1, 1]],

    [[0, 1, 1],
    [1, 1, 0]],

    [[1],
    [1],
    [1],
    [1]],

    [[1, 1, 1],
    [0, 1, 0]],

    [[1, 1, 0],
    [0, 1, 1]],

    [[0, 1],
    [0, 1],
    [1, 1]],

    [[1, 0],
    [1, 0],
    [1, 1]]
  ];
  var incr = 0;
  //CONTROLS
  var LEFT = 37;
  var RIGHT = 39
  var UP = 38
  var DOWN = 40
  var SPACE = 32
  var SHIFT = 16
  var move_left = false;
  var move_right = false;
  var move_down = false;
  var shift = false;
  //set Keylisteners
  window.addEventListener("keyup", keyUp, false);
  window.addEventListener("keydown", keyDown, false);
  //Reset Values
  function resetVal() {
    orientation = 0;
  }
  //Initalize Board
  function initBoard() {
    for (var x = 0; x < BOARD_HEIGHT; x++) {
      board.push([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    }
    board.push([-1, -1, -1, -1, -1, -1, -1, -1, -1, -1]);
  }
  //Draw Lines
  function initLines() {
    ct.strokeStyle = "#282c34";
    ct.lineWidth = 1;
    for (var x = 1; x < BOARD_WIDTH; x++) {
      ct.moveTo(x * BLOCKSIDE, 0);
      ct.lineTo(x * BLOCKSIDE, BLOCKSIDE * BOARD_HEIGHT);
      ct.stroke();
    }
    for (var x = 1; x < BOARD_HEIGHT; x++) {
      ct.moveTo(0, x * BLOCKSIDE);
      ct.lineTo(BLOCKSIDE * BOARD_WIDTH, x * BLOCKSIDE);
      ct.stroke();
    }
  }
  //set colours
  function setColor(color) {
    ct.fillStyle = color;
  }
  //Draw Round Rectangle
  function roundRect(ctx, x, y, width, height, radius, fill, strokeColour) {
    stroke = 10;
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
    if (strokeColour) ctx.strokeStyle = strokeColour;
    else ctx.strokeStyle = boardColor;
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
  //Draw Block
  function drawBlock() {
    for (var row = 0; row < currPieceArr.length; row++) {
      for (var col = 0; col < currPieceArr[row].length; col++) {
        if (currPieceArr[row][col] != 0) {
          setColor(colours[currPiece]);
          roundRect(ct, (currPiece_column + col) * BLOCKSIDE, (currPiece_row + row) * BLOCKSIDE, BLOCKSIDE, BLOCKSIDE, ROUNDING, 1);
        }
      }
    }
  }
  //Draw heldPiece
  function drawHeld() {
    ctPre.fillStyle = boardColor;
    ctPre.fillRect(0, 0, PREVIEW_WIDTH * BLOCKSIDE, PREVIEW_HEIGHT * BLOCKSIDE);
    var heldPieceArr = basePieces[heldPiece];
    var drCol = Math.floor((PREVIEW_WIDTH * BLOCKSIDE - heldPieceArr[0].length  * BLOCKSIDE)/2);
    var drRow = Math.floor((PREVIEW_HEIGHT * BLOCKSIDE - heldPieceArr.length * BLOCKSIDE)/2);
    for (var row = 0; row < heldPieceArr.length; row++) {
      for (var col = 0; col < heldPieceArr[row].length; col++) {
        if (heldPieceArr[row][col] > 0) {
          ctPre.fillStyle = colours[heldPiece];
          roundRect(ctPre, (drCol + col * BLOCKSIDE), (drRow + row * BLOCKSIDE), BLOCKSIDE, BLOCKSIDE, 7, colours[heldPiece]);
        }
      }
    }
  }
  //Drawubg ghost block
  function drawGhost() {
    var x = 0;
    outer: for (x = currPiece_row; x < BOARD_HEIGHT; x++) {
      for (var row = 0; row < currPieceArr.length; row++) {
        for (var col = 0; col < currPieceArr[row].length; col++) {
          if (currPieceArr[row][col] > 0 && board[x + row][currPiece_column + col] <  0) {
            x--;
            break outer;
          }
        }
      }
    }
    for (var row = 0; row < currPieceArr.length; row++) {
      for (var col = 0; col < currPieceArr[row].length; col++) {
        if (currPieceArr[row][col] > 0)
        roundRect(ct, (currPiece_column + col) * BLOCKSIDE, (x + row) * BLOCKSIDE, BLOCKSIDE, BLOCKSIDE, ROUNDING, 0, "#EEE");
      }
    }
  }
  //Generate Pieces
  function genPiece() {
    resetVal();
    pieceQueue.shift();
    //If empty reload and shuffle
    if (pieceQueue.length == 0) {
      for (var x = 0; x < 7; x++) {
        pieceQueue.push(x);
      }
      for (var x  = pieceQueue.length - 1; x > 0; x--) {
        var j = Math.floor(Math.random() * (x + 1));
        var temp = pieceQueue[x];
        pieceQueue[x] = pieceQueue[j];
        pieceQueue[j] = temp;
      }
    }
    //Center the new piece at the top of the board
    currPiece = pieceQueue[0];
    currPiece_column = Math.floor((BOARD_WIDTH - pieces[currPiece][orientation].length)/2);
    currPieceArr = pieces[currPiece][orientation];
    currPiece_row = 0;
  }
  //Clear the board
  function clear() {
    ct.fillStyle = boardColor;
    ct.fillRect(0, 0, BOARD_WIDTH * BLOCKSIDE, BOARD_HEIGHT * BLOCKSIDE);
    for (var row = 0; row < BOARD_HEIGHT; row++) {
      for (var col = 0; col < BOARD_WIDTH; col++) {
        if (board[row][col] < 0) {
          ct.fillStyle = colours[-board[row][col] - 1];
          roundRect(ct, col * BLOCKSIDE, row * BLOCKSIDE, BLOCKSIDE, BLOCKSIDE, ROUNDING, 1);
        }
      }
    }
  }
  //Rotation error checking
  function rotation() {
    var tempOri = (orientation + 1)%4;
    var tempLef = leftAdjustment[currPiece][tempOri];
    var tempRig = rightAdjustment[currPiece][tempOri];
    var tempCol = currPiece_column;;
    var tempShape = pieces[currPiece][tempOri];
    var movedRight = false;
    var movedLeft = false;
    for (var row = 0; row < tempShape.length; row++) {
      for (var col = 0; col < tempShape[row].length; col++) {
        if (tempShape[row][tempShape[row].length - col] > 0) {
          if (tempCol + tempLef < 0) {
            tempCol++;
            movedRight = true;
          }
        }
        if (tempShape[row][col] > 0) {
          if (tempCol + tempRig > BOARD_WIDTH) {
            tempCol--;
            movedLeft = true;
          }
        }
        if (board[row + currPiece_row + tempLef][col + tempCol] < 0) {
          if (movedLeft || movedRight) return;
          if (col < tempShape[row].length/2) {
            tempCol++;
          }
          else {
            tempCol--;
          }
        }
      }
    }
    currPiece_column = tempCol;
    orientation = tempOri;
    currPieceArr = tempShape;
  }
  //translational error checking
  function translation(row, col) {
    for (var y = 0; y < currPieceArr.length; y++) {
      for (var x = 0; x < currPieceArr[y].length; x++) {
        console.log(currPiece);
        if (board[row + y][col + x] < 0 && currPieceArr[y][x] > 0)
        return false;
      }
    }
    return true;
  }
  //Keylisteners
  function keyDown(e) {
    if (e.keyCode == LEFT) {
      if (currPiece_column + leftAdjustment[currPiece][orientation] > 0) {
        move_left = translation(currPiece_row, currPiece_column - 1);
      }
      else {
        move_left = false;
      }
    }
    if (e.keyCode == RIGHT) {
      if (currPiece_column + rightAdjustment[currPiece][orientation] < BOARD_WIDTH) {
        move_right = translation(currPiece_row, currPiece_column + 1);
      }
      else {
        move_right = false;
      }
    }
    if (e.keyCode == DOWN) {
      move_down = true;
    }
    if (e.keyCode == SPACE) {
      while(true) {
        if (applyGrav()) break;
      }
    }
    if (e.keyCode == SHIFT) {
      if (!shift) {
        shift = true;
        if (heldPiece < 0) {
          heldPiece = currPiece;
          genPiece();
        }
        else {
          heldPiece += currPiece;
          currPiece = heldPiece - currPiece;
          heldPiece = heldPiece - currPiece;
          orientation = 0;
          currPieceArr = pieces[currPiece][orientation];
        }
        currPiece_row = 0;
        currPiece_column = Math.floor((BOARD_WIDTH - pieces[currPiece][orientation].length)/2);
        drawHeld();
      }
    }
    if (move_left) {
      currPiece_column -= 1;
    }
    if (move_right) {
      currPiece_column += 1;
    }
    if (e.keyCode == UP) {
      rotation();
    }
  }
  function keyUp(e) {
    move_left = false;
    move_right = false;
    move_down = false;
  }
  //update
  function update() {
    clear();
    initLines();
    drawGhost();
    drawBlock();
  }
  //gravity
  function applyGrav() {
      var potRow = currPiece_row + 1;
      var apply = true;
      for (var row = 0; row < currPieceArr.length; row++) {
        for (var col = 0; col < currPieceArr[row].length; col++) {
          if (currPieceArr[row][col] > 0 && board[potRow + row][currPiece_column + col] <  0) {
            apply = false;
            break;
          }
        }
      }
      if (apply) {
        currPiece_row = potRow;
      }
      else {
          for (var row = 0; row < currPieceArr.length; row++) {
            for (var col = 0; col < currPieceArr[row].length; col++) {
              if (currPieceArr[row][col] > 0)
              board[currPiece_row + row][currPiece_column + col] = -(currPiece + 1);
            }
          }
          for (var row = 0; row < BOARD_HEIGHT; row++) {
            var clear = true;
            for (var col = 0; col < BOARD_WIDTH; col++) {
              if (board[row][col] == 0) {
                clear = false;
              }
            }
            if (clear) {
              update();
              incr = 0;
              clearLines.push(row);
              console.log(clearLines);
              // board.splice(row, 1);
              // board.unshift([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
          }
      }
      genPiece();
      shift = false;
      return true;
    }
  }
  //listener
  function listener() {
    if (move_down) {
      applyGrav();
    }
  }
  //clearLines animation
  function clearing() {
    incr += 0.1;
    for (var y = 0; y < clearLines.length; y++) {
      var row = clearLines[y];
      for (var x = 0; x < board[row].length; x++) {
        console.log("CLEARING");
        ct.fillStyle = boardColor;
        roundRect(ct, x * BLOCKSIDE + BLOCKSIDE/2 - BLOCKSIDE * incr/2, row * BLOCKSIDE + BLOCKSIDE/2 - BLOCKSIDE * incr/2, BLOCKSIDE * incr , BLOCKSIDE * incr, ROUNDING, 1);
      }3
    }
    console.log(incr);
    if (incr >= 1) {
      for (var x = 0; x < clearLines.length; x++) {
      board.splice(clearLines[x], 1);
      board.unshift([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
      }
      clearLines = [];
    }
  }
  //initialize
  function init() {
    initBoard();
    initLines();
    genPiece();
  }
  init();
  setInterval(function() {
    if (clearLines == null || clearLines.length == 0) update();
        else { clearing() };
  }, 1000/60);
  setInterval(function() {
    if (clearLines == null || clearLines.length == 0) listener();
  }, 1000/30);
  setInterval(function() {
    if (clearLines == null || clearLines.length == 0) applyGrav();
  }, 1000);
}
