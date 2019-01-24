import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  'data-test-board-component': true,

  numberOfFlaggedCells: computed("model.cells.@each.isFlagged", {
    get() {
      return this.model.cells.filter(cell => cell.isFlagged).length;
    }
  }),

  actions: {
    openedCell(clickedCell) {
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
  }
});
