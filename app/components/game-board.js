import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject } from '@ember/service';

export default Component.extend({
  poll: inject(),
  swal: inject(),

  'data-test-board-component': true,
  gameBlocked: true,

  numberOfFlaggedCells: computed("model.cells.@each.isFlagged", {
    get() {
      return this.model.cells.filter(cell => cell.isFlagged).length;
    }
  }),

  remainingMines: computed("numberOfFlaggedCells", "model.numberOfMines", {
    get() {
      return this.model.numberOfMines - this.numberOfFlaggedCells;
    }
  }),

  _numberOfOpenedCells: computed("model.cells.@each.isOpened", {
    get() {
      return this.model.cells.filter(cell => cell.isOpened).length
    }
  }),

  cellsByRow: computed("model.cells.[]", {
    get() {
      return this.model.cells.reduce((acc, cell) => {
        let [, y] = cell.position;
        acc[y] = acc[y] ? [...acc[y], cell] : [cell];
        return acc;
      }, []);
    }
  }),

  actions: {
    openedCell(clickedCell) {
      this._startGameTimer();
      if (clickedCell.hasMine) {
        this._gameOver();
      } else {
        this._openCell(clickedCell);
        if (this._isWinningConfiguration()) {
          this._gameWon();
        }
      }
    },
    flaggedCell(cell) {
      this._startGameTimer();
      cell.toggleFlag();
    }
  },

  _openAllClosedCells() {
    this.model.cells.filter(cell => !cell.isOpened).forEach(cell => cell.openCell());
  },

  _openCell(openedCell) {
    openedCell.openCell();
    if (openedCell.neighboringMines === 0) {
      openedCell.neighboringCells.filter(cell => !cell.isOpened).forEach(cell => {
        this._openCell(cell);
      });
    }
  },

  _startGameTimer() {
    if (this.gameBlocked) {
      this.gameBlocked = false;
      this.intervalId = this.poll.addPoll({
        callback: () => this.model.increaseElapsedTime(),
        interval: 1000
      });
    }
  },

  _stopGameTimer() {
    if (this.intervalId != undefined) {
      this.poll.stopPoll(this.intervalId);
    }
  },

  _gameWon() {
    this._stopGameTimer();
    this.swal.open({
      titleText: "WIN!",
      type: "success",
      text: `You won in ${this.model.elapsedTime} seconds`,
      confirmButtonText: "New Game",
      allowOutsideClick: false,
      allowEscapeKey: false
    }).then(result => {
      if (result.value) {
        this.onResetGame();
      }
    });
  },

  _gameOver() {
    this._stopGameTimer();
    this._openAllClosedCells();
    this.swal.open({
      titleText: "Game Over!",
      type: "error",
      confirmButtonText: "Retry",
      allowOutsideClick: false,
      allowEscapeKey: false
    }).then(result => {
      if (result.value) {
        this.onResetGame();
      }
    });
  },

  _isWinningConfiguration() {
    return this.model.numberOfSafeCells == this._numberOfOpenedCells;
  },

  willDestroyElement() {
    this._stopGameTimer();
  }
});
