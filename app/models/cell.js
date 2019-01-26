import { set } from '@ember/object';
import { mandatoryParam } from '../utils/mandatory-param';

class Cell {
  constructor(x = mandatoryParam(), y = mandatoryParam(), hasMine = false, isOpened = false, isFlagged = false, neighboringCells = []) {
    this.position = [x, y];
    this.hasMine = hasMine;
    this.neighboringCells = neighboringCells;

    this.isOpened = isOpened;
    this.isFlagged = isFlagged;
  }

  get neighboringMines() {
    return this.neighboringCells.filter(cell => cell.hasMine).length;
  }

  setNeighboringCells(cellsList) {
    if (this.neighboringCells.length > 0) {
      throw new Error("Cannot reassign neighboringCells");
    }

    this.neighboringCells = cellsList;
  }

  openCell() {
    if (this.isFlagged) {
      throw new Error("The cell cannot be opened because it is already been flagged");
    }
    set(this, 'isOpened', true);
  }

  toggleFlag() {
    if (this.isOpened) {
      throw new Error("The cell cannot be flagged because it is already opened");
    }
    set(this, 'isFlagged', !this.isFlagged);
  }

  isInPosition(x, y) {
    const [cellX, cellY] = this.position
    return cellX === x && cellY === y;
  }
}

export { Cell };
