import { mandatoryParam } from '../utils/mandatory-param';
import { set } from '@ember/object';

class Board {
  constructor(rows = mandatoryParam(), columns = mandatoryParam(), numberOfMines = mandatoryParam(), cells = mandatoryParam(), previousElapsedTime = 0) {
    this.rows = rows;
    this.columns = columns;
    this.numberOfMines = numberOfMines;
    this.cells = cells;

    this.elapsedTime = previousElapsedTime;
    this.numberOfSafeCells = (rows * columns) - numberOfMines;
  }

  increaseElapsedTime() {
    set(this, "elapsedTime", this.elapsedTime + 1);
  }
}

export { Board }
