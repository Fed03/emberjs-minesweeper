import { module, skip, test } from 'qunit';
import { boardFactory } from '../../factories';

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

  skip('Given a 3x3 board, it can return the neighboring cells of the center one', function (assert) {
    const rows = 3, columns = 3;
    const bState = boardFactory(rows, columns);
    let results = bState.getNeighborCellsOf({ x: 2, y: 2 });

    assert.equal(results.length, 8);
    [...Array(rows).keys()].forEach(x => {
      [...Array(columns).keys()].forEach(y => {
        assert.ok(results.find(cell => cell.isInPosition(x, y)));
      });
    });
  });
})
