import { mandatoryParam } from '../utils/mandatory-param';

class Board {
  constructor(rows = mandatoryParam(), columns = mandatoryParam(), numberOfMines = mandatoryParam(), cells = mandatoryParam()) {
    this.rows = rows;
    this.columns = columns;
    this.numberOfMines = numberOfMines;
    this.cells = cells;

    this.numberOfFlaggedCells = 0;
  }

  setFlaggedCellsCounter(howMany) {
    if (howMany < 0) {
      throw new Error("The numberOfFlaggedCells cannot be less than zero")
    }

    this.numberOfFlaggedCells = howMany;
  }

  increaseFlaggedCellsCounter() {
    this.numberOfFlaggedCells++;
  }

  decreaseFlaggedCellsCounter() {
    if (this.numberOfFlaggedCells === 0) {
      throw new Error("The numberOfFlaggedCells cannot be less than zero")
    }

    this.numberOfFlaggedCells--;
  }

  /* _getCellInPosition(x, y) {
    return this.cells.find(cell => cell.isInPosition(x, y));
  } */
}

export { Board }
