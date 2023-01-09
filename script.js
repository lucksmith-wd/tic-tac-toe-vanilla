const gameBoard = (function () {
  let winningChain;
  const boardArr = [];
  const boardBoxes = [...document.querySelectorAll('.board__box')];

  function setBox(index, player) {
    if (boardArr[index] !== '') {
      return false;
    }
    boardArr[index] = player.getSymbol();
    boardBoxes[index].classList.add(player.getClass());
    boardBoxes[index].textContent = boardArr[index];
    return true;
  }

  function isFinished(index) {
    const chains = {
      row1: [0, 1, 2],
      row2: [3, 4, 5],
      row3: [6, 7, 8],
      column1: [0, 3, 6],
      column2: [1, 4, 7],
      column3: [2, 5, 8],
      diagonal1: [0, 4, 8],
      diagonal2: [2, 4, 6],
    }

    function isChainHomog(chain) {
      return boardArr[chain[0]] === boardArr[chain[1]] &&
        boardArr[chain[1]] === boardArr[chain[2]];
    }

    for (let key in chains) {
      let chain = chains[key];
      if (chain.includes(index)) {
        if (isChainHomog(chain)) {
          winningChain = chain;
          return true;
        }
      }
    }
    return false;
  }

  function displayResult() {
    for (let i of winningChain) {
      boardBoxes[i].classList.add('winning-box');

    }
  }
  for (let i = 0; i < 9; i++) {
    boardArr.push('');
    boardBoxes[i].setAttribute('data-index', i);
  }

  function resetBoard() {
    for (let i = 0; i < boardArr.length; i++) {
      boardArr[i] = '';
      boardBoxes[i].textContent = '';
      boardBoxes[i].classList.remove('winning-box');
      boardBoxes[i].classList.remove('player-1');
      boardBoxes[i].classList.remove('player-2');
    }

  }
  return { boardBoxes, setBox, isFinished, displayResult, resetBoard };
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
        gameBoard.displayResult();
        const result = document.querySelector('.result');
        document.querySelector('.result p').textContent = `Congratulations, ${activePlayer.identify()}! `;
        let winningColor = activePlayer.getColor();
        const btn = document.querySelector('.btn-ok');
        btn.style.color = winningColor;
        result.style.backgroundColor = winningColor;
        result.classList.add('visible');
        function resetGame() {
          return doReset(result);
        }
        btn.addEventListener('click', resetGame);
      }
    }
    box.addEventListener('click', play);
  }
  return {};
})();







