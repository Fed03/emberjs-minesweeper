import { Cell } from "minesweeper/models/cell";
import { Board } from "minesweeper/models/board";
import range from "lodash.range";

function boardFactory(rows = 0, columns = 0, numberOfMines = 0, cellsMatrix = cellsMatrixFactory(rows, columns)) {
  return new Board(rows, columns, numberOfMines, cellsMatrix);
}

function cellFactory(x = 0, y = 0) {
  return new Cell(x, y, false, 0)
}

function cellsMatrixFactory(rows, columns) {
  return range(rows).map(x => {
    return range(columns).map(y => {
      return cellFactory(x, y);
    })
  })
}

export { boardFactory, cellFactory };
