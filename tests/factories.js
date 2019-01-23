import { Cell } from "minesweeper/models/cell";
import { Board } from "minesweeper/models/board";
import range from "lodash.range";

function boardFactory(rows = 0, columns = 0, numberOfMines = 0, cellsList = cellsListFactory(rows, columns)) {
  return new Board(rows, columns, numberOfMines, cellsList);
}

function cellFactory({ x = 0, y = 0, hasMine = false, neighboringMines = 0 } = {}) {
  return new Cell(x, y, hasMine, neighboringMines)
}

function cellsListFactory(rows, columns) {
  let cells = [];
  for (const x of range(rows)) {
    for (const y of range(columns)) {
      cells.push(cellFactory({ x, y }));
    }
  }

  return cells;
}

export { boardFactory, cellFactory };
