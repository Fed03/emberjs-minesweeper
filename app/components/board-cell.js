import Component from '@ember/component';
import { readOnly } from '@ember/object/computed';
import { gt, and, not } from 'ember-awesome-macros';

const RIGHT_BTN = 2;

export default Component.extend({
  'data-test-cell-component': true,
  classNameBindings: ['isOpened:board-cell-opened:board-cell-closed'],
  isOpened: readOnly('cellState.isOpened'),
  isFlagged: readOnly('cellState.isFlagged'),

  hasNeighboringMines: gt('neighboringMines', 0),
  shouldShowNeighboringMines: and('hasNeighboringMines', not('hasMine')),

  click(evt) {
    if (!this.isOpened) {
      if (evt.button === RIGHT_BTN) {
        this.handleRightClick();
      } else {
        this.handleLeftClick();
      }
    }
  },

  handleLeftClick() {
    if (!this.isFlagged) {
      this.cellState.openCell();
      this.onOpenCell();
    }
  },

  handleRightClick() {
    this.cellState.makeFlagged();
  }
});
