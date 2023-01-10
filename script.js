const gameBoard = (function () {
  let winningChain;
  const boardArr = [];
  const boardBoxes = [...document.querySelectorAll('.board__box')];

  function setBox(index, player) {
    if (boardArr[index] !== '' || winningChain) {
      return false;
    }
    boardArr[index] = player.getSymbol();
    boardBoxes[index].classList.add(player.getClass());
    boardBoxes[index].textContent = boardArr[index];
    return true;
  }

  function checkChain(startIndex, interval) {
    let a = startIndex;
    let b = startIndex + interval;
    let c = b + interval;

    if (boardArr[a] === boardArr[b] && boardArr[b] === boardArr[c]) {
      winningChain = [a, b, c];
      return true;
    }
    return false;
  }

  function isFinished(index) {
    if (checkChain(Math.floor(index / 3) * 3, 1) || checkChain(index % 3, 3)) { // checks row and column of last move
      return true;
    }
    if (index === 4) { // checks both diagonals if last move was in center box
      if (checkChain(0, 4) || checkChain(2, 2)) {
        return true;
      }
    }
    if (index === 0 || index === 8) { // checks top-left to bottom-right diagonal is last move is in box 0 or 8
      if (checkChain(0, 4)) {
        return true;
      }
    }
    if (index === 2 || index === 6) {
      if (checkChain(2, 2)) {
        return true;
      }
    }
    for (let box of boardArr) {
      if (box === '') {
        return false;
      }
    }
    return true;
  }

  function displayResult() {
    for (let i of winningChain) {
      boardBoxes[i].classList.add('winning-box');
    }
  }

  function getWinner(player1, player2) {
    if (!winningChain) {
      return null;
    }
    return player1.getSymbol() === boardArr[winningChain[0]] ? player1 : player2;
  }

  for (let i = 0; i < 9; i++) {
    boardArr.push('');
    boardBoxes[i].setAttribute('data-index', i);
  }

  function resetBoard() {
    winningChain = undefined;
    for (let i = 0; i < boardArr.length; i++) {
      boardArr[i] = '';
      boardBoxes[i].textContent = '';
      boardBoxes[i].classList.remove('winning-box');
      boardBoxes[i].classList.remove('player-1');
      boardBoxes[i].classList.remove('player-2');
    }

  }
  return { boardBoxes, setBox, isFinished, displayResult, resetBoard, getWinner };
})();


const Player = function (card, symbol) {
  const getSymbol = function () {
    return symbol;
  }
  const getClass = function () {
    return card.classList[1];
  }
  const toggleActive = function () {
    card.classList.toggle('active');
    card.classList.toggle('inactive');
  }
  const setActive = function () {
    card.classList.remove('inactive');
    card.classList.add('active');
  }
  const setInactive = function () {
    card.classList.remove('active');
    card.classList.add('inactive');
  }
  const identify = function () {
    const identifier = card.classList[1];
    let name = identifier.charAt(0).toUpperCase() + identifier.slice(1);
    name = name.replace('-', ' ');
    return name;
  }
  function getColor() {
    return window.getComputedStyle(card).color;
  }
  return { getClass, getSymbol, toggleActive, identify, getColor, setActive, setInactive };
}


const gameControl = (function () {
  const boxes = gameBoard.boardBoxes;
  const player1 = Player(document.querySelector('.player-1'), 'X');
  const player2 = Player(document.querySelector('.player-2'), 'O');
  let activePlayer = player1;

  function doReset(result) {
    gameBoard.resetBoard();
    player1.setActive();
    player2.setInactive();
    activePlayer = player1;
    result.classList.remove('visible');
  }

  function displayResult(winner) {
    const result = document.querySelector('.result');
    console.dir(result);
    let winningColor = '#888';
    if (winner !== null) {
      winningColor = winner.getColor();
      gameBoard.displayResult();
      result.firstElementChild.textContent = `Congratulations ${winner.identify()}!!!`
    } else {
      result.firstElementChild.textContent = `It's a tie.`
    }
    result.style.backgroundColor = winningColor;
    const btn = document.querySelector('.btn-ok');
    console.log('button: ' + btn);
    result.classList.add('visible');
    btn.style.color = winningColor;
    btn.addEventListener('click', function () {
      doReset(result);
    });
  }

  for (const box of boxes) {
    function play() {
      console.dir(box.dataset.index);
      if (!gameBoard.setBox(box.dataset.index, activePlayer)) {
        return;
      }
      if (!gameBoard.isFinished(+box.dataset.index)) {
        player1.toggleActive();
        player2.toggleActive();
        activePlayer = activePlayer === player1 ? player2 : player1;
      } else {
        let winner = gameBoard.getWinner(player1, player2);
        console.dir(winner);
        displayResult(winner);
      }
    }
    box.addEventListener('click', play);
  }
  return { play };
})();