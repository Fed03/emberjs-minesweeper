import Component from '@ember/component';
import { computed } from '@ember/object';
import { bind } from '@ember/runloop';

export default Component.extend({
  'data-test-board-component': true,
  timeResolution: "s",
  gameBlocked: true,

  interval: computed("timeResolution", {
    get() {
      switch (this.timeResolution) {
        case "s":
          return 1000;
        case "ms":
          return 100;
      }
    }
  }),

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
        this._stopGameTimer();
        this._openAllClosedCells();
      } else {
        this._openCell(clickedCell);
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
      this.intervalId = setInterval(bind(this.model, this.model.increaseElapsedTime), this.interval);
    }
  },

  _stopGameTimer() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  },

  willDestroyElement() {
    this._stopGameTimer();
  }
});
