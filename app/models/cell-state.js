class CellState {
  constructor() {
    this.isOpened = false;
    this.isFlagged = false;
  }

  openCell() {
    if (this.isFlagged) {
      throw new Error("The cell cannot be opened because it is already been flagged");
    }
    this.isOpened = true;
  }

  makeFlagged() {
    if (this.isOpened) {
      throw new Error("The cell cannot be flagged because it is already opened");
    }
    this.isFlagged = true;
  }
}

export { CellState };
