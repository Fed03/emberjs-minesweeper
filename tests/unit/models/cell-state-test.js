import { module, test } from 'qunit';
import { CellState } from 'minesweeper/models/cell-state';

module('Unit | Model | CellState', function () {
  test('given a brand new CellState, then it sets some defaults', function (assert) {
    const obj = new CellState();
    assert.equal(obj.isOpened, false);
    assert.equal(obj.isFlagged, false);
  });

  test('given a brand new CellState, when openCell method is called, then it should set the corresponding prop', function (assert) {
    const obj = new CellState();
    obj.openCell();

    assert.equal(obj.isOpened, true);
  });

  test('given a brand new CellState, when makeFlagged method is called, then it should set the corresponding prop', function (assert) {
    const obj = new CellState();
    obj.makeFlagged();

    assert.equal(obj.isFlagged, true);
  });

  test('given an opened CellState, when makeFlagged method is called, then it should throw', function (assert) {
    const obj = new CellState();
    obj.openCell();

    let act = () => obj.makeFlagged();
    assert.throws(act);
  });

  test('given an flagged CellState, when openCell method is called, then it should throw', function (assert) {
    const obj = new CellState();
    obj.makeFlagged();

    let act = () => obj.openCell();
    assert.throws(act);
  });
})
