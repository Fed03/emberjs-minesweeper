import { module, test } from 'qunit';
import { boardFactory } from '../../factories';
// import isEqual from "lodash.isequal";

module('Unit | Model | Board', function () {
  test('Given a board, when setting the number of flagged cells, it should do that', function (assert) {
    const board = boardFactory();

    assert.equal(board.numberOfFlaggedCells, 0);

    board.setFlaggedCellsCounter(10);
    assert.equal(board.numberOfFlaggedCells, 10);
  });

  test('Given a board, when setting the number of flagged cells to a negative number, it should throw', function (assert) {
    const board = boardFactory();

    const act = () => board.setFlaggedCellsCounter(-1);
    assert.throws(act);
  });

  test('Given a board, when increasing the number of flagged cells, it should do that', function (assert) {
    const board = boardFactory();
    board.setFlaggedCellsCounter(10);

    board.increaseFlaggedCellsCounter();
    assert.equal(board.numberOfFlaggedCells, 11);
  });

  test('Given a board, when decreasing the number of flagged cells, it should do that', function (assert) {
    const board = boardFactory();
    board.setFlaggedCellsCounter(10);

    board.decreaseFlaggedCellsCounter();
    assert.equal(board.numberOfFlaggedCells, 9);
  });

  test('Given a board, when decreasing the number of flagged cells below zero, it should throw', function (assert) {
    const board = boardFactory();
    board.setFlaggedCellsCounter(0);

    const act = () => board.decreaseFlaggedCellsCounter();
    assert.throws(act);
  });

  /* test('Given a 3x3 board, it can return the neighboring cells of the center one', function (assert) {
    const rows = 3, columns = 3;
    const board = boardFactory(rows, columns);

    const expectedPositions = [
      [0, 0], [0, 1], [0, 2],
      [1, 0], [1, 2],
      [2, 0], [2, 1], [2, 2]
    ];

    let results = [...board.getNeighborCellsOf([1, 1])];

    assert.equal(results.length, 8);

    results.forEach(cell => {
      assert.ok(expectedPositions.some(pos => isEqual(pos, cell.position)));
    })
  });

  test('Given a 3x3 board, it can return the neighboring cells of a corner one', function (assert) {
    const rows = 3, columns = 3;
    const board = boardFactory(rows, columns);

    const expectedPositions = [
      [0, 1],
      [1, 1], [1, 2]
    ];

    let results = [...board.getNeighborCellsOf([0, 2])];

    assert.equal(results.length, 3);

    results.forEach(cell => {
      assert.ok(expectedPositions.some(pos => isEqual(pos, cell.position)));
    })
  });

  test('Given a 3x3 board, it can return the neighboring cells of a border one', function (assert) {
    const rows = 3, columns = 3;
    const board = boardFactory(rows, columns);

    const expectedPositions = [
      [0, 0], [0, 1],
      [1, 1],
      [2, 0], [2, 1]
    ];

    let results = [...board.getNeighborCellsOf([1, 0])];

    assert.equal(results.length, 5);

    results.forEach(cell => {
      assert.ok(expectedPositions.some(pos => isEqual(pos, cell.position)));
    })
  }); */
})
