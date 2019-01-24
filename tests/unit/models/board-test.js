import { module, test } from 'qunit';
import { Board } from "minesweeper/models/board";
// import { boardFactory, cellFactory } from '../../factories';
// import isEqual from "lodash.isequal";

module('Unit | Model | Board', function () {
  test('given a board it should be possible to increase the elapsed time', function (assert) {
    const initialElapsedTime = 10;
    const board = new Board(0, 0, 0, [], initialElapsedTime);

    board.increaseElapsedTime();

    assert.equal(board.elapsedTime, 11);
  });
})
