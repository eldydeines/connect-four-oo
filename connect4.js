/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */




class Game {

  //constructor receives height and width
  constructor(p1, p2, height, width) {
    this.p1 = p1;
    this.p2 = p2;
    this.currPlayer = this.p1; // active player: 1 or 2
    this.height = height;
    this.width = width;
    this.board = [];

    this.makeBoard();
    this.makeHtmlBoard();

  }//end constructor

  //Creates board structure i.e. array of rows with each row an array of cells
  makeBoard() {
    for (let y = 0; y < this.height; y++) {
      this.board.push(Array.from({ length: this.width }));
    }
  }//end makeBoard method

  //Makes the gameboard
  makeHtmlBoard() {
    const gameBoard = document.getElementById('board');
    // make column tops (clickable area for adding a piece to that column)
    const topRow = document.createElement('tr');
    topRow.setAttribute('id', 'column-top');
    //had to look at solution for this. I could not figure it out.
    this.handleGameClick = this.handleClick.bind(this);
    topRow.addEventListener('click', this.handleGameClick);

    for (let x = 0; x < this.width; x++) {
      const slot = document.createElement('td');
      slot.setAttribute('id', x);
      topRow.append(slot);
    }

    gameBoard.append(topRow);

    // make main part of board
    for (let y = 0; y < this.height; y++) {
      const row = document.createElement('tr');

      for (let x = 0; x < this.width; x++) {
        const cell = document.createElement('td');
        cell.setAttribute('id', `${y}-${x}`);
        row.append(cell);
      }

      gameBoard.append(row);
    }
  }//end makeHTMLBoard


  /** findSpotForCol: given column x, return top empty y (null if filled) */
  findSpotForCol(x) {
    for (let y = this.height - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  }//end findSpotForCol method

  /** placeInTable: update DOM to place piece into HTML table of board */
  placeInTable(y, x) {
    const piece = document.createElement('div');
    piece.classList.add('piece');

    if (this.currPlayer === this.p1) {
      piece.style.backgroundColor = `${this.p1.color}`;
      console.log(this.currPlayer, this.p1);
    }
    else {
      piece.style.backgroundColor = `${this.p2.color}`;
    }

    piece.style.top = -50 * (y + 2);

    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);
  }//end placeInTable Method

  /** endGame: announce game end */
  endGame(msg) {
    alert(msg);
  }

  gameOver() {
    const top = document.querySelector("#column-top");
    top.removeEventListener("click", this.handleGameClick);

    //this.gameBoard.firstChild.removeEventListener("click", this.handleGameClick);
  }

  /** handleClick: handle click of column top to play piece */
  handleClick(evt) {
    // get x from ID of clicked cell
    const x = +evt.target.id;

    // get next spot in column (if none, ignore click)
    const y = this.findSpotForCol(x);
    if (y === null) {
      return;
    }

    // place piece in board and add to HTML table
    this.board[y][x] = this.currPlayer;
    this.placeInTable(y, x);

    // check for win
    if (this.checkForWin()) {
      this.gameOver();
      return this.endGame(`Player ${this.currPlayer.color} won!`);
    }

    // check for tie
    if (this.board.every(row => row.every(cell => cell))) {
      this.gameOver();
      return this.endGame('Tie!');
    }

    // switch players
    this.currPlayer = this.currPlayer === this.p1 ? this.p2 : this.p1;

  }


  /** checkForWin: check board cell-by-cell for "does a win start here?" */
  checkForWin() {
    const win = (cells) =>
      cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < this.height &&
          x >= 0 &&
          x < this.width &&
          this.board[y][x] === this.currPlayer
      );


    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        // get "check list" of 4 cells (starting here) for each of the different
        // ways to win
        const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

        // find winner (only checking each win-possibility as needed)
        if (win(horiz) || win(vert) || win(diagDR) || win(diagDL)) {
          return true;
        }
      }
    }
  }

}//End of Game Class

class Player {
  constructor(color) {
    this.color = color;
  }
}


const startBtn = document.getElementById('start');

startBtn.addEventListener('click', function () {

  let player1Color = document.getElementById('player1');
  let player2Color = document.getElementById('player2');
  let p1 = new Player(player1Color.value);
  let p2 = new Player(player2Color.value);

  new Game(p1, p2, 5, 7);

});



