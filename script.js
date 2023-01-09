const gameBoard = (function () {
  const boardArr = [];
  for (let i = 0; i < 9; i++) {
    boardArr.push('');
  }

  return {};
})();

const Player = function (name, symbol) {

  const makeMove = function () {
    console.log(`${name} made a move with ${symbol}`);
  }
  return { makeMove };
}

const gameControl = (function () {
  return {};
})()

const player1 = Player('player1', 'X');
const player2 = Player('player2', 'O');

player1.makeMove();
player2.makeMove();
console.log(gameControl);




