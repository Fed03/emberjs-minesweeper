import { mandatoryParam } from 'minesweeper/utils/mandatory-param';
import { module, test } from 'qunit';

module('Unit | Utility | mandatoryParam', function () {

  test('it throws an error when called', function (assert) {
    assert.throws(() => mandatoryParam(), "The parameter is mandatory");
  });
});
