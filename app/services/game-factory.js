import Service from '@ember/service';
import { Board } from '../models/board';
import { Cell } from '../models/cell';
import range from 'lodash.range';
import seedrandom from "seedrandom";

export default Service.extend({
  rngFactory: seedrandom,

  setUpNewGame(rows, columns, numberOfMines) {
    return new Board(rows, columns, numberOfMines, this._buildCells(rows, columns, numberOfMines));
  },

  _buildCells(rows, columns, numberOfMines) {
    let cells = [];
    range(rows).forEach(x => {
      range(columns).forEach(y => {
        cells.push(this._buildSingleCell(x, y));
      });
    });

    this._assignNeighborhoodToEveryCell(cells, rows, columns);
    this._populateMines(cells, numberOfMines);

    return cells;
  },

  _buildSingleCell(x, y) {
    return new Cell(x, y);
  },

  _assignNeighborhoodToEveryCell(cells, rows, columns) {
    cells.forEach(cell => {
      cell.setNeighboringCells([...this._getNeighborCellsOf(cell.position, cells, rows, columns)])
    });
  },

  * _getNeighborCellsOf([x, y], cellList, rows, cols) {
    for (const cellX of range(...this._neighborhoodBounds(x, rows))) {
      for (const cellY of range(...this._neighborhoodBounds(y, cols))) {
        let cell = cellList.find(cell => cell.isInPosition(cellX, cellY));
        if (!cell.isInPosition(x, y)) {
          yield cell;
        }
      }
    }
  },

  _neighborhoodBounds(coord, maxBound) {
    return [Math.max(0, coord - 1), Math.min(maxBound - 1, coord + 1) + 1];
  },

  _populateMines(cells, numberOfMines) {
    let cellsList = Array.from(cells);
    let rng = this.rngFactory();
    range(numberOfMines).forEach(() => {
      let idx = Math.floor(rng() * (cellsList.length - 1));
      cellsList[idx].hasMine = true;
      cellsList.splice(idx, 1);
    });
  }
});
