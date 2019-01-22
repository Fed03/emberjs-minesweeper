import { set } from '@ember/object';
import { mandatoryParam } from '../utils/mandatory-param';

class Cell {
  constructor(x = mandatoryParam(), y = mandatoryParam(), hasMine = mandatoryParam(), neighboringMines = mandatoryParam()) {
    this.position = { x, y };
    this.hasMine = hasMine;
    this.neighboringMines = neighboringMines;

    this.isOpened = false;
    this.isFlagged = false;
  }

  openCell() {
    if (this.isFlagged) {
      throw new Error("The cell cannot be opened because it is already been flagged");
    }
    set(this, 'isOpened', true);
  }

  makeFlagged() {
    if (this.isOpened) {
      throw new Error("The cell cannot be flagged because it is already opened");
    }
    set(this, 'isFlagged', true);
  }
}

export { Cell };
