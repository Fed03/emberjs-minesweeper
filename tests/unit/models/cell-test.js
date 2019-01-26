import { module, test } from 'qunit';
import { cellFactory } from '../../factories';
import { Cell } from "minesweeper/models/cell";

module('Unit | Model | Cell', function () {
  test('given a brand new Cell, then it sets some defaults', function (assert) {
    const obj = new Cell(0, 0, false);

    assert.propEqual(obj.neighboringCells, []);
    assert.equal(obj.isOpened, false);
    assert.equal(obj.isFlagged, false);
  });

  test('given a brand new Cell, when openCell method is called, then it should set the corresponding prop', function (assert) {
    const obj = cellFactory();
    obj.openCell();

    assert.equal(obj.isOpened, true);
  });

  test('given an unflagged Cell, when toggleFlag method is called, then the isFlagged prop should be true', function (assert) {
    const obj = cellFactory();
    obj.toggleFlag();

    assert.equal(obj.isFlagged, true);
  });

  test('given a flagged Cell, when toggleFlag method is called, then the isFlagged prop should be false', function (assert) {
    const obj = cellFactory({ isFlagged: true });
    obj.toggleFlag();

    assert.equal(obj.isFlagged, false);
  });

  test('given an opened Cell, when toggleFlag method is called, then it should throw', function (assert) {
    const obj = cellFactory({ isOpened: true });

    let act = () => obj.toggleFlag();
    assert.throws(act);
  });

  test('given a flagged Cell, when openCell method is called, then it should unflag', function (assert) {
    const obj = cellFactory({ isFlagged: true });

    obj.openCell();
    assert.equal(obj.isFlagged, false);
  });

  test('given a cell, it can be tested for its position', function (assert) {
    const obj = cellFactory({ x: 3, y: 2 });

    assert.ok(obj.isInPosition(3, 2));
    assert.notOk(obj.isInPosition(3, 0));
  })

  test('constructing a cell without neighboringCells should set it to an empty array', function (assert) {
    const obj = cellFactory();

    assert.equal(obj.neighboringCells.length, 0);
  });

  test('given a cell with neighboringCells, it should count the number of neighboringMines', function (assert) {
    let neighboringCells = [
      cellFactory({ hasMine: true }),
      cellFactory({ hasMine: true }),
      cellFactory({ hasMine: false })
    ];
    const obj = cellFactory({ neighboringCells });

    assert.equal(obj.neighboringMines, 2);
  });

  test('given a cell without neighboringCells, then it should possible to set it', function (assert) {
    const neighboringCell = cellFactory({ hasMine: false });
    const obj = cellFactory();

    obj.setNeighboringCells([neighboringCell]);

    assert.equal(obj.neighboringCells.length, 1);
    assert.propEqual(obj.neighboringCells[0], neighboringCell);
  });

  test('given a cell with a filled neighboringCells, then reassigning it should throw', function (assert) {
    const neighboringCell = cellFactory({ hasMine: false });
    const obj = cellFactory({ neighboringCells: [neighboringCell] });

    let act = () => obj.setNeighboringCells([]);
    assert.throws(act);
  });
})
