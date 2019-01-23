import { module, test } from 'qunit';
import { cellFactory } from '../../factories';

module('Unit | Model | Cell', function () {
  test('given a brand new Cell, then it sets some defaults', function (assert) {
    const obj = new cellFactory();
    assert.equal(obj.isOpened, false);
    assert.equal(obj.isFlagged, false);
  });

  test('given a brand new Cell, when openCell method is called, then it should set the corresponding prop', function (assert) {
    const obj = new cellFactory();
    obj.openCell();

    assert.equal(obj.isOpened, true);
  });

  test('given a brand new Cell, when makeFlagged method is called, then it should set the corresponding prop', function (assert) {
    const obj = new cellFactory();
    obj.makeFlagged();

    assert.equal(obj.isFlagged, true);
  });

  test('given an opened Cell, when makeFlagged method is called, then it should throw', function (assert) {
    const obj = new cellFactory();
    obj.openCell();

    let act = () => obj.makeFlagged();
    assert.throws(act);
  });

  test('given a flagged Cell, when openCell method is called, then it should throw', function (assert) {
    const obj = new cellFactory();
    obj.makeFlagged();

    let act = () => obj.openCell();
    assert.throws(act);
  });

  test('given a cell, it can be tested for its position', function (assert) {
    const obj = new cellFactory({ x: 3, y: 2 });

    assert.ok(obj.isInPosition(3, 2));
    assert.notOk(obj.isInPosition(3, 0));
  })
})
