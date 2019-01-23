import { Cell } from "minesweeper/models/cell";
import { Board } from "minesweeper/models/board";
import range from "lodash.range";

function boardFactory(rows = 0, columns = 0, numberOfMines = 0, cellsList = cellsListFactory(rows, columns)) {
  return new Board(rows, columns, numberOfMines, cellsList);
}

function cellFactory({ x = 0, y = 0, hasMine = false, neighboringCells = undefined, neighboringMines = 0 } = {}) {
  if (!neighboringCells && neighboringMines > 0) {
    neighboringCells = range(neighboringMines).map(() => cellFactory({ hasMine: true }));
  }
  return new Cell(x, y, hasMine, neighboringCells)
}

function cellsListFactory(rows, columns) {
  let cells = [];
  for (const x of range(rows)) {
    for (const y of range(columns)) {
      cells.push(cellFactory({ x, y }));
    }
  }

  assignNeighborhoodToEveryCell(cells, rows, columns);

  return cells;
}

function assignNeighborhoodToEveryCell(cells, rows, columns) {
  cells.forEach(cell => {
    cell.setNeighboringCells([...getNeighborCellsOf(cell.position, cells, rows, columns)])
  });
}

function* getNeighborCellsOf([x, y], cellList, rows, cols) {
  for (const cellX of range(..._neighborhoodBounds(x, rows))) {
    for (const cellY of range(..._neighborhoodBounds(y, cols))) {
      let cell = cellList.find(cell => cell.isInPosition(cellX, cellY));
      if (!cell.isInPosition(x, y)) {
        yield cell;
      }
    }
  }
}

function _neighborhoodBounds(coord, maxBound) {
  return [Math.max(0, coord - 1), Math.min(maxBound - 1, coord + 1) + 1];
}


export { boardFactory, cellFactory, cellsListFactory };
