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
  actions: {
    openedCell(clickedCell) {
      if (this.gameBlocked) {
        this.gameBlocked = false;
        this._startGameTimer();
      }
      this._openCell(clickedCell);
    },
    flaggedCell(cell) {
      cell.toggleFlag();
    }
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
    this.intervalId = setInterval(bind(this.model, this.model.increaseElapsedTime), this.interval);
  },

  willDestroyElement() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
});
