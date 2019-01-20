import Component from '@ember/component';
import { readOnly } from '@ember/object/computed';
import { gt, and, not } from 'ember-awesome-macros';

export default Component.extend({
  'data-test-cell-component': true,
  classNameBindings: ['isOpened:board-cell-opened:board-cell-closed'],
  isOpened: readOnly('cellState.isOpened'),

  hasNeighboringMines: gt('neighboringMines', 0),
  shouldShowNeighboringMines: and('hasNeighboringMines', not('hasMine')),

  click() {
    if (!this.get('isOpened')) {
      this.get("cellState").openCell();
      this.onOpenCell();
    }
  }
});
