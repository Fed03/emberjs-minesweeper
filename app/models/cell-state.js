import { set } from '@ember/object';

class CellState {
  constructor() {
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

export { CellState };
