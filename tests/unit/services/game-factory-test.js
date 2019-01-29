import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { Cell } from 'minesweeper/models/cell';
import isEqual from "lodash.isequal";
import sinon from "sinon";

module('Unit | Service | game-factory', function (hooks) {
  setupTest(hooks);

  test('given a board size and a number of mines, it should build the proper model', function (assert) {
    const service = this.owner.lookup('service:game-factory');
    const rows = 4;
    const columns = 2;
    const mines = 3;

    let board = service.setUpNewGame(rows, columns, mines);

    assert.equal(board.rows, rows);
    assert.equal(board.columns, columns);
    assert.equal(board.numberOfMines, mines);
    assert.equal(board.elapsedTime, 0);

    assert.equal(board.cells.length, 8);
    board.cells.forEach(cell => {
      assert.ok(cell instanceof Cell)
    });
  });

  test('given a board size and a number of mines, it should assign the right coords to every cell', function (assert) {
    const service = this.owner.lookup('service:game-factory');
    const rows = 2;
    const columns = 2;
    const mines = 3;

    let expectedPositions = [[0, 0], [1, 0], [0, 1], [1, 1]];

    let board = service.setUpNewGame(rows, columns, mines);

    let positions = board.cells.map(cell => cell.position);

    assert.deepEqual(positions, expectedPositions);
  });

  test('given a board size and a number of mines, it should assign the right neighbors to every cell', function (assert) {
    const service = this.owner.lookup('service:game-factory');
    const rows = 3;
    const columns = 3;
    const mines = 3;

    let expectedNeighborsByPosition = new Map();
    expectedNeighborsByPosition.set([0, 0], [[1, 0], [0, 1], [1, 1]]);
    expectedNeighborsByPosition.set([0, 1], [[0, 0], [1, 0], [1, 1], [0, 2], [1, 2]]);
    expectedNeighborsByPosition.set([0, 2], [[0, 1], [1, 1], [1, 2]]);

    expectedNeighborsByPosition.set([1, 0], [[0, 0], [2, 0], [0, 1], [1, 1], [2, 1]]);
    expectedNeighborsByPosition.set([1, 1], [[0, 0], [1, 0], [2, 0], [0, 1], [2, 1], [0, 2], [1, 2], [2, 2]]);
    expectedNeighborsByPosition.set([1, 2], [[0, 1], [1, 1], [2, 1], [0, 2], [2, 2]]);

    expectedNeighborsByPosition.set([2, 0], [[1, 0], [1, 1], [2, 1]]);
    expectedNeighborsByPosition.set([2, 1], [[1, 0], [2, 0], [1, 1], [1, 2], [2, 2]]);
    expectedNeighborsByPosition.set([2, 2], [[1, 1], [2, 1], [1, 2]]);

    let cells = service.setUpNewGame(rows, columns, mines).cells;

    cells.forEach(cell => {
      let expectedNeighborsPositions = getValueByObjKey(expectedNeighborsByPosition, cell.position);
      let actualNeighborsPositions = cell.neighboringCells.map(x => x.position);

      assert.deepEqual(actualNeighborsPositions, expectedNeighborsPositions, cell.position);
    });
  });

  test('given a board size and a number of mines, it should place mines in cells whose index is chosen according to a randomGenerator', function (assert) {
    const service = this.owner.lookup('service:game-factory');

    //"random" generator always returning 0
    // we recursively place mine on the first cell without it
    const nextRandom = sinon.fake.returns(0);
    service.set("rngFactory", () => nextRandom);

    const rows = 3;
    const columns = 3;
    const mines = 3;

    let cells = service.setUpNewGame(rows, columns, mines).cells;

    let mineCells = cells.filter(cell => cell.hasMine);
    assert.equal(mineCells.length, mines);

    mineCells.forEach((cell, idx) => {
      assert.equal(cell, cells[idx]);
    });

    assert.ok(nextRandom.calledThrice);
  });
});

function getValueByObjKey(map, searchedKey) {
  for (const [key, value] of map.entries()) {
    if (isEqual(key, searchedKey)) {
      return value;
    }
  }
}
