const { Tetris } = require('./src/tetris');
const { Board } = require('./src/board');
const { Mover } = require('./src/mover');
const { Piece } = require('./src/piece');
const { HighScore } = require('./src/highScore');
const { TetrisPieces } = require('./src/tetrisPieces');

describe('HighScore', () => {
  test('Initializes empty if no array is given', () => {
    const highScore = new HighScore([]);
    expect(highScore.records.length).toEqual(0);
  });

  test('Initializes with data ', () => {
    const highScore = new HighScore([
      ['d', 1],
      ['a', 4]
    ]);
    expect(highScore.records.length).toEqual(2);
  });

  test('Sorts', () => {
    const highScore = new HighScore([
      ['d', 1],
      ['a', 4],
      ['b', 3],
      ['b', 9]
    ]);

    highScore.sort();

    expect(highScore.records[0].score).toEqual(9);
    expect(highScore.records[1].score).toEqual(4);
    expect(highScore.records[2].score).toEqual(3);
    expect(highScore.records[3].score).toEqual(1);
  });

  test('Add to empty', () => {
    const highScore = new HighScore([]);
    highScore.add(12);
    expect(highScore.records.length).toBe(1);
    expect(highScore.records[0].score).toBe(12);
  });

  test('Add to table of max size(5) - add sixth record', () => {
    const highScore = new HighScore([
      ['d', 1],
      ['a', 4],
      ['b', 3],
      ['b', 9],
      ['b', 9]
    ]);

    highScore.add(12);
    expect(highScore.records.length).toBe(5);
    expect(highScore.records[0].score).toBe(12);
    expect(highScore.records[4].score).toBe(3);
  });
});

describe('Board', () => {
  test('Board is created', () => {
    let board = new Board(4, 5);
    let emptyField = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ];
    expect(board.area).toEqual(emptyField);
    expect(board.width).toBe(4);
    expect(board.height).toBe(5);
  });

  test('is valid move', () => {
    let board = new Board(4, 5);
    let piece = new Piece(
      [
        [0, 0],
        [0, 1],
        [1, 0],
        [1, 1]
      ],
      'square',
      0
    );
    expect(board.isValidMove(piece)).toBeTruthy();
  });

  test('is invalid move - negative x', () => {
    let board = new Board(4, 5);
    let piece = new Piece(
      [
        [0, -1],
        [0, 0],
        [1, -1],
        [1, 0]
      ],
      'square',
      0
    );
    expect(board.isValidMove(piece)).toBeFalsy();
  });

  test('is invalid move - negative y', () => {
    let board = new Board(4, 5);
    let piece = new Piece(
      [
        [-1, 0],
        [0, 0],
        [1, 0],
        [1, 0]
      ],
      'square',
      0
    );
    expect(board.isValidMove(piece)).toBeFalsy();
  });

  test('is invalid move - x too big', () => {
    let board = new Board(4, 5);
    let piece = new Piece(
      [
        [0, 3],
        [0, 4],
        [1, 3],
        [1, 4]
      ],
      'square',
      0
    );
    expect(board.isValidMove(piece)).toBeFalsy();
  });

  test('is valid move - x on the edge', () => {
    let board = new Board(4, 5);
    let piece = new Piece(
      [
        [0, 2],
        [0, 3],
        [1, 2],
        [1, 3]
      ],
      'square',
      0
    );
    expect(board.isValidMove(piece)).toBeTruthy();
  });

  test('is invalid move - place is taken', () => {
    let board = new Board(4, 5);
    board.area[1][3] = 1;
    let piece = new Piece(
      [
        [0, 2],
        [0, 3],
        [1, 2],
        [1, 3]
      ],
      'square',
      0
    );
    expect(board.isValidMove(piece)).toBeFalsy();
  });

  test('render piece on the board', () => {
    let board = new Board(4, 5);
    let piece = new Piece(
      [
        [0, 2],
        [0, 3],
        [1, 2],
        [1, 3]
      ],
      'square',
      0
    );
    const area = [
      [0, 0, 1, 1],
      [0, 0, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ];
    expect(board.render(piece)).toEqual(area);
  });

  test('detectFullRows no rows', () => {
    let board = new Board(4, 5);
    board.area = [
      [0, 0, 0, 0],
      [0, 0, 0, 1],
      [0, 0, 0, 1],
      [0, 0, 1, 1],
      [0, 1, 1, 1]
    ];
    expect(board.detectFullRows()).toEqual([]);
  });

  test('detectFullRows row 4 only', () => {
    let board = new Board(4, 5);
    board.area = [
      [0, 0, 0, 0],
      [0, 0, 0, 1],
      [0, 0, 0, 1],
      [0, 0, 1, 1],
      [1, 1, 1, 1]
    ];
    expect(board.detectFullRows()).toEqual([4]);
  });

  test('detectFullRows #3 and #4 rows', () => {
    let board = new Board(4, 5);
    board.area = [
      [0, 0, 0, 0],
      [0, 0, 0, 1],
      [0, 0, 0, 1],
      [1, 1, 1, 1],
      [1, 1, 1, 1]
    ];
    expect(board.detectFullRows()).toEqual([3, 4]);
  });

  test('clearRow #3', () => {
    let board = new Board(4, 5);
    board.area = [
      [0, 0, 0, 0],
      [0, 0, 0, 1],
      [0, 0, 0, 1],
      [1, 1, 1, 1],
      [1, 1, 1, 1]
    ];
    const expectedArea = [
      [0, 0, 0, 0],
      [0, 0, 0, 1],
      [0, 0, 0, 1],
      [0, 0, 0, 0],
      [1, 1, 1, 1]
    ];
    board.clearRow(3);
    expect(board.area).toEqual(expectedArea);
  });

  test('clearFullRow 0', () => {
    let board = new Board(4, 5);
    board.area = [
      [0, 0, 0, 0],
      [0, 0, 0, 1],
      [0, 0, 0, 1],
      [0, 0, 1, 1],
      [1, 1, 0, 1]
    ];
    const expectedArea = [
      [0, 0, 0, 0],
      [0, 0, 0, 1],
      [0, 0, 0, 1],
      [0, 0, 1, 1],
      [1, 1, 0, 1]
    ];
    expect(board.clearFullLines()).toBe(0);
    expect(board.area).toEqual(expectedArea);
  });

  test('clearFullRow 1 row', () => {
    let board = new Board(4, 5);
    board.area = [
      [0, 0, 0, 0],
      [0, 0, 0, 1],
      [0, 0, 0, 1],
      [0, 0, 1, 1],
      [1, 1, 1, 1]
    ];
    const expectedArea = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 1],
      [0, 0, 0, 1],
      [0, 0, 1, 1]
    ];
    expect(board.clearFullLines()).toBe(1);
    expect(board.area).toEqual(expectedArea);
  });

  test('clearFullRow 2 rows', () => {
    let board = new Board(4, 5);
    board.area = [
      [0, 0, 0, 0],
      [0, 0, 0, 1],
      [0, 0, 1, 1],
      [1, 1, 1, 1],
      [1, 1, 1, 1]
    ];
    const expectedArea = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 1],
      [0, 0, 1, 1]
    ];
    expect(board.clearFullLines()).toBe(2);
    expect(board.area).toEqual(expectedArea);
  });

  test('clearFullRow 2 rows with hole in the middle', () => {
    let board = new Board(4, 5);
    board.area = [
      [0, 0, 0, 0],
      [0, 0, 0, 1],
      [1, 1, 1, 1],
      [1, 1, 0, 1],
      [1, 1, 1, 1]
    ];
    const expectedArea = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 1],
      [1, 1, 0, 1]
    ];
    expect(board.clearFullLines()).toBe(2);
    expect(board.area).toEqual(expectedArea);
  });

  test('getYOfFirstFilledLineInXRange - find the most top y of filled cells', () => {
    let board = new Board(4, 5);
    board.area = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [1, 0, 0, 0],
      [1, 1, 0, 0],
      [1, 1, 1, 0]
    ];
    expect(board.getYOfFirstFilledLineInXRange(0, 2)).toBe(2);
    expect(board.getYOfFirstFilledLineInXRange(1, 2)).toBe(3);
    expect(board.getYOfFirstFilledLineInXRange(3, 3)).toBe(4);
  });

  test('shiftToCenter - shift piece to center of the board', () => {
    let board = new Board(10, 20);
    let piece = new Piece(
      [
        [0, 0],
        [0, 1],
        [1, 0],
        [2, 0]
      ],
      'lRShape',
      0
    );
    board.shiftToCenter(piece);
    expect(piece.coords).toEqual([
      [0, 4],
      [0, 5],
      [1, 4],
      [2, 4]
    ]);
  });

  test('shiftToCenter - shift piece to center of the board - lLShape 2', () => {
    let board = new Board(10, 20);
    let piece = new Piece(
      [
        [0, 0],
        [1, 0],
        [2, 0],
        [2, 1]
      ],
      'lLShape',
      2
    );
    board.shiftToCenter(piece);
    expect(piece.coords).toEqual([
      [0, 4],
      [1, 4],
      [2, 4],
      [2, 5]
    ]);
  });
});

describe('Tetris', () => {
  test('Tetris is initiated', () => {
    let board = new Board(3, 4);
    let tetris = new Tetris(board);
    expect(tetris.piece).toBeDefined();
  });

  test('Vertical I-shape rotates near right border', () => {
    let tetris = new Tetris(5, 6);

    const piece = new Piece(
      [
        [1, 4],
        [2, 4],
        [3, 4],
        [4, 4]
      ],
      'iShape',
      1
    );
    tetris.piece = piece;
    tetris.placePiece();
    const expectedArea = [
      [0, 0, 0, 0, 0],
      [0, 1, 1, 1, 1],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0]
    ];
    tetris.rotate();
    expect(tetris.board.area).toEqual(expectedArea);
  });

  test('Drop shape - empty board', () => {
    let tetris = new Tetris(5, 6);

    const piece = new Piece(
      [
        [1, 4],
        [2, 4],
        [3, 4],
        [4, 4]
      ],
      'iShape',
      1
    );
    tetris.piece = piece;
    tetris.placePiece();
    const expectedArea = [
      [0, 0, 0, 0, 0],
      [0, 1, 1, 1, 1],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0]
    ];
    tetris.rotate();
    expect(tetris.board.area).toEqual(expectedArea);
  });

  test('Speed and level change with amount lines were destroyed', () => {
    let tetris = new Tetris(5, 6);

    tetris.timesLinesWereClearted = 0;
    tetris.setSpeed();
    expect(tetris.level).toBe(1);
    expect(tetris.speed).toBe(600);

    tetris.timesLinesWereClearted = 9;
    tetris.setSpeed();
    expect(tetris.level).toBe(1);
    expect(tetris.speed).toBe(600);

    tetris.timesLinesWereClearted = 11;
    tetris.setSpeed();
    expect(tetris.level).toBe(2);
    expect(tetris.speed).toBe(550);

    tetris.timesLinesWereClearted = 101;
    tetris.setSpeed();
    expect(tetris.level).toBe(11);
    expect(tetris.speed).toBe(150);
  });

  test('Calculate score and times that we are clearing lines - 0 lines are cleared', () => {
    const board = new Board(5, 6);
    board.area = [
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 1, 1, 1, 1]
    ];
    const tetris = new Tetris(5, 6);
    tetris.board = board;

    expect(tetris.score).toBe(0);
    expect(tetris.timesLinesWereClearted).toBe(0);

    tetris.calculateScore();

    expect(tetris.score).toBe(0);
    expect(tetris.timesLinesWereClearted).toBe(0);
  });

  test('Calculate score and times that we are clearing lines - 1 line is cleared', () => {
    const board = new Board(5, 6);
    board.area = [
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [1, 1, 1, 1, 1]
    ];
    const tetris = new Tetris(5, 6);
    tetris.board = board;

    expect(tetris.score).toBe(0);
    expect(tetris.timesLinesWereClearted).toBe(0);

    tetris.calculateScore();

    expect(tetris.score).toBe(10);
    expect(tetris.timesLinesWereClearted).toBe(1);
  });

  test('Calculate score and times that we are clearing lines - 2 line is cleared', () => {
    const board = new Board(5, 6);
    board.area = [
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1]
    ];
    const tetris = new Tetris(5, 6);
    tetris.board = board;

    tetris.calculateScore();

    expect(tetris.score).toBe(30);
    expect(tetris.timesLinesWereClearted).toBe(1);
  });

  test('Calculate score and times that we are clearing lines - 3 line is cleared and later 2 lines are cleared', () => {
    const board = new Board(5, 6);
    board.area = [
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1]
    ];
    const tetris = new Tetris(5, 6);
    tetris.board = board;

    tetris.calculateScore();

    board.area = [
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1]
    ];

    tetris.calculateScore();

    expect(tetris.score).toBe(80);
    expect(tetris.timesLinesWereClearted).toBe(2);
  });

  test('Calculate score respecting levels - 3 line is cleared and level is changing', () => {
    const board = new Board(5, 6);
    board.area = [
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1]
    ];
    const tetris = new Tetris(5, 6);
    tetris.board = board;

    tetris.calculateScore();
    expect(tetris.score).toBe(50);

    board.area = [
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1]
    ];
    tetris.level = 5;
    tetris.calculateScore();

    expect(tetris.score).toBe(125);

    board.area = [
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1]
    ];
    tetris.level = 10;
    tetris.calculateScore();

    expect(tetris.score).toBe(225);

    board.area = [
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1]
    ];
    tetris.level = 12;
    tetris.calculateScore();

    expect(tetris.score).toBe(335);
  });
});

describe('Mover', () => {
  test('Piece moves down', () => {
    const piece = new Piece(
      [
        [0, 0],
        [0, 1],
        [1, 0],
        [2, 0]
      ],
      'lLShape',
      0
    );
    const pieceNext = new Piece(
      [
        [1, 0],
        [1, 1],
        [2, 0],
        [3, 0]
      ],
      'lLShape',
      0
    );

    const mover = new Mover(piece);
    expect(mover.down()).toEqual(pieceNext);
  });

  test('Piece moves left', () => {
    const piece = new Piece(
      [
        [0, 2],
        [1, 2],
        [2, 1],
        [2, 2]
      ],
      'lRShape',
      2
    );
    const pieceNext = new Piece(
      [
        [0, 1],
        [1, 1],
        [2, 0],
        [2, 1]
      ],
      'lRShape',
      2
    );

    const mover = new Mover(piece);
    expect(mover.left()).toEqual(pieceNext);
  });

  test('Piece moves right', () => {
    const piece = new Piece(
      [
        [0, 2],
        [1, 2],
        [2, 1],
        [2, 2]
      ],
      'lRShape',
      2
    );
    const pieceNext = new Piece(
      [
        [0, 3],
        [1, 3],
        [2, 2],
        [2, 3]
      ],
      'lRShape',
      2
    );

    const mover = new Mover(piece);
    expect(mover.right()).toEqual(pieceNext);
  });

  test('Piece rotates clockwise', () => {
    const piece = new Piece(
      [
        [0, 1],
        [1, 1],
        [2, 0],
        [2, 1]
      ],
      'lRShape',
      2
    );
    const pieceNext = new Piece(
      [
        [1, 0],
        [2, 0],
        [2, 1],
        [2, 2]
      ],
      'lRShape',
      3
    );

    const mover = new Mover(piece);
    expect(mover._rotateClockwise()).toEqual(pieceNext);
  });

  test('Piece rotates clockwise back to 0 sequence when overflows', () => {
    const piece = new Piece(
      [
        [0, 2],
        [1, 2],
        [2, 1],
        [2, 2]
      ],
      'lRShape',
      3
    );
    const pieceNext = new Piece(
      [
        [0, 1],
        [0, 2],
        [1, 1],
        [2, 1]
      ],
      'lRShape',
      0
    );

    const mover = new Mover(piece);
    expect(mover._rotateClockwise()).toEqual(pieceNext);
  });

  test("Piece square shape doesn't rotate", () => {
    const piece = new Piece(
      [
        [0, 0],
        [0, 1],
        [1, 0],
        [1, 1]
      ],
      'square',
      0
    );
    const pieceNext = new Piece(
      [
        [0, 0],
        [0, 1],
        [1, 0],
        [1, 1]
      ],
      'square',
      0
    );

    const mover = new Mover(piece);
    expect(mover._rotateClockwise()).toEqual(pieceNext);
  });

  test("Piece rotates clockwise considering it's current coordinates", () => {
    const piece = new Piece(
      [
        [4, 5],
        [5, 5],
        [6, 5],
        [6, 4]
      ],
      'lRShape',
      2
    );
    const pieceNext = new Piece(
      [
        [5, 4],
        [6, 4],
        [6, 5],
        [6, 6]
      ],
      'lRShape',
      3
    );

    const mover = new Mover(piece);
    expect(mover._rotateClockwise()).toEqual(pieceNext);
  });

  test('Piece shifts from wall', () => {
    const piece = new Piece(
      [
        [1, 4],
        [2, 4],
        [3, 4],
        [4, 4]
      ],
      'iShape',
      1
    );
    const pieceExpected = new Piece(
      [
        [1, 1],
        [1, 2],
        [1, 3],
        [1, 4]
      ],
      'iShape',
      0
    );

    const mover = new Mover(piece);
    expect(mover.rotateClockwiseWithShift(4)).toEqual(pieceExpected);
  });
});
