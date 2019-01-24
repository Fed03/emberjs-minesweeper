import { mandatoryParam } from '../utils/mandatory-param';

class Board {
  constructor(rows = mandatoryParam(), columns = mandatoryParam(), numberOfMines = mandatoryParam(), cells = mandatoryParam()) {
    this.rows = rows;
    this.columns = columns;
    this.numberOfMines = numberOfMines;
    this.cells = cells;
  }
}

export { Board }
