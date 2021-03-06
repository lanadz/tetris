const { Tetris, GameOverError } = require('./src/tetris.js');
const { Board } = require('./src/board.js');
const { HighScore } = require('./src/highScore.js');

document.addEventListener('DOMContentLoaded', () => {
  const scoreDisplay = document.getElementById('score');
  const levelDisplay = document.getElementById('level');
  const startBtn = document.getElementById('start-button');
  const resumeBtn = document.getElementById('resume-button');
  const toggleSoundBtn = document.getElementById('sound-button');
  const lableSoundBtn = document.getElementById('sound-on');
  const label = document.getElementById('label');
  const labelDrop = document.querySelector('.centerLabel');
  const highScoreTable = document.getElementById('high-score');

  const bgMusic = {
    1: document.getElementById('bg_music_1'),
    2: document.getElementById('bg_music_2'),
    3: document.getElementById('bg_music_3'),
    4: document.getElementById('bg_music_4'),
    5: document.getElementById('bg_music_5')
  };

  document.addEventListener('keydown', listenKeyMove);
  document.addEventListener('keydown', listenKeyPause);
  startBtn.addEventListener('click', startNewGame);
  resumeBtn.addEventListener('click', pauseGame);
  toggleSoundBtn.addEventListener('click', toggleSound);

  let squares = Array.from(document.querySelectorAll('.grid.game div'));
  let nextPieceSquares = Array.from(
    document.querySelectorAll('#next-piece div')
  );
  let tetris;

  if (!localStorage.getItem('records')) {
    localStorage.setItem('records', JSON.stringify([]));
  }

  const highScore = new HighScore(JSON.parse(localStorage.getItem('records')));

  let interval;
  let intervalMs;
  let togglePause = false;
  let toggleSoundFlag = false;
  const sound = new Audio();

  startNewGame();

  function listenKeyPause(event) {
    switch (event.keyCode) {
      case 27:
        pauseGame();
        break;
    }
  }

  function startNewGame() {
    tetris = new Tetris(10, 20);
    tetris.positionInCentre();
    render();
    clearInterval(interval);
    togglePause = false;
    labelDrop.classList.add('hidden');
    document.addEventListener('keydown', listenKeyMove);
    document.addEventListener('keydown', listenKeyPause);
    intervalMs = tetris.speed;
    interval = setInterval(nextMoveDown.bind(this), intervalMs);
    stripCSS();
    renderNextPiece();
  }

  function stripCSS() {
    squares.forEach((square) => (square.classList = ''));
  }

  function gameOver() {
    clearInterval(interval);
    highScore.add(tetris.score);
    labelDrop.classList.remove('hidden');
    label.innerText = 'Game Over';
    resumeBtn.classList.add('hidden');
    startBtn.classList.remove('hidden');
    document.removeEventListener('keydown', listenKeyMove);
    document.removeEventListener('keydown', listenKeyPause);
    saveHighScoreToLocalStorage();
    displayHighScore();
  }

  function saveHighScoreToLocalStorage() {
    let storage = [];
    highScore.records.forEach((record) => {
      storage.push([record.description, record.score]);
    });
    localStorage.setItem('records', JSON.stringify(storage));
  }

  function displayHighScore() {
    let html = '';
    highScore.records.forEach((record) => {
      html += `<li><div class='desc'>${record.description}</div><div class='record'>${record.score}</li>`;
    });
    highScoreTable.innerHTML = html;
  }

  function pauseGame() {
    togglePause = !togglePause;
    if (togglePause) {
      labelDrop.classList.remove('hidden');
      label.innerText = 'Paused';
      startBtn.classList.add('hidden');
      resumeBtn.classList.remove('hidden');
      document.removeEventListener('keydown', listenKeyMove);
      displayHighScore();
      clearInterval(interval);
    } else {
      document.addEventListener('keydown', listenKeyMove);
      labelDrop.classList.add('hidden');
      resumeBtn.classList.remove('hidden');
      interval = setInterval(nextMoveDown.bind(this), tetris.speed);
    }
  }

  function toggleSound() {
    toggleSoundFlag = !toggleSoundFlag;
    lableSoundBtn.innerText = toggleSoundFlag ? 'ON' : 'OFF';
    if (toggleSoundFlag) {
      const musicElement = randomMusic();
      sound.src = musicElement.src;
      sound.loop = true;
      sound.play();
    } else {
      sound.pause();
    }
  }

  function randomMusic() {
    const num = Math.floor(Math.random() * 5) + 1; // 5 music tracks
    return bgMusic[num];
  }

  function listenKeyMove(event) {
    switch (event.keyCode) {
      case 37:
        tetris.moveLeft();
        break;
      case 38:
        tetris.rotate();
        break;
      case 39:
        tetris.moveRight();
        break;
      case 40:
        try {
          tetris.moveDown();
        } catch (e) {
          if (e instanceof GameOverError) {
            gameOver();
          }
        }
        break;
      case 32:
        drop();
    }
    render();
  }

  function render() {
    let state = tetris.board.area;

    squares.forEach((square, index) => {
      let matrixElement = state[Math.floor(index / 10)][index % 10];
      if (matrixElement === 1) {
        const cssClassName = tetris.piece.color;
        square.classList.add('filled');
        // Testing if color was already assigned
        if (square.classList.length == 1) {
          square.classList.add(cssClassName);
        }
      } else {
        square.className = ''; // Clear all colors
      }
    });
  }

  function renderNextPiece() {
    nextPieceSquares.forEach((el) => (el.className = ''));
    tetris.nextPiece.coords.forEach(([y, x]) => {
      nextPieceSquares[
        y * 4 + x
      ].className = `filled ${tetris.nextPiece.color}`;
    });
  }
  function drop() {
    try {
      tetris.drop();
      render();
      tetris.settleAndPrepareNext();
      renderNextPiece();
    } catch (e) {
      if (e instanceof GameOverError) {
        gameOver();
      }
    }
  }

  function nextMoveDown() {
    try {
      tetris.moveDown();
      render();
      renderNextPiece();
      scoreDisplay.innerText = tetris.score;
      levelDisplay.innerText = tetris.level;
      if (intervalMs != tetris.speed) {
        clearInterval(interval);
        intervalMs = tetris.speed;
        interval = setInterval(nextMoveDown.bind(this), intervalMs);
      }
    } catch (e) {
      if (e instanceof GameOverError) {
        gameOver();
      }
    }
  }
});
