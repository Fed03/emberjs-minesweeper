import Component from '@ember/component';

export default Component.extend({
  'data-test-board-component': true,
  actions: {
    openedCell(clickedCell) {
      this._openCell(clickedCell);
    },
    flaggedCell(cell) {
      cell.makeFlagged();
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
