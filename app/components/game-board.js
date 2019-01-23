import Component from '@ember/component';

export default Component.extend({
  'data-test-board-component': true,
  actions: {
    openedCell(clickedCell) {
      this._openNeighboringCell(clickedCell);
    }
  },

  _openNeighboringCell(openedCell) {
    if (openedCell.neighboringMines === 0) {
      openedCell.neighboringCells.filter(cell => !cell.isOpened).forEach(cell => {
        cell.openCell();
        this._openNeighboringCell(cell);
      });
    }
  }
});
