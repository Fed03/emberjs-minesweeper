import { mandatoryParam } from '../utils/mandatory-param';
import range from "lodash.range";

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

  *getNeighborCellsOf([x, y]) {
    for (const cellX of range(...this._neighborhoodRowBounds(x))) {
      for (const cellY of range(...this._neighborhoodColBounds(y))) {
        let cell = this._getCellInPosition(cellX, cellY);
        if (!cell.isInPosition(x, y)) {
          yield cell;
        }
      }
    }
  }

  _neighborhoodRowBounds(x) {
    return [Math.max(0, x - 1), Math.min(this.rows - 1, x + 1) + 1];
  }

  _neighborhoodColBounds(y) {
    return [Math.max(0, y - 1), Math.min(this.columns - 1, y + 1) + 1];
  }

  _getCellInPosition(x, y) {
    return this.cells.find(cell => cell.isInPosition(x, y));
  }
}

export { Board }
