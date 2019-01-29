import Component from '@ember/component';
import { readOnly } from '@ember/object/computed';
import { computed } from '@ember/object';
import { gt, and, not } from 'ember-awesome-macros';

const RIGHT_BTN = 2;
const minesClassMap = {
  1: "one-neigh-mine-cell",
  2: "two-neigh-mine-cell",
  3: "three-neigh-mine-cell",
  4: "four-neigh-mine-cell",
  5: "five-neigh-mine-cell",
  6: "six-neigh-mine-cell",
  7: "seven-neigh-mine-cell",
  8: "eight-neigh-mine-cell",
}

export default Component.extend({
  'data-test-cell-component': true,
  classNames: ["board-cell"],
  classNameBindings: ['isOpened:board-cell-opened:board-cell-closed', 'neighboringMinesBasedColor'],
  isOpened: readOnly('model.isOpened'),
  isFlagged: readOnly('model.isFlagged'),

  neighboringMinesBasedColor: computed("isOpened", "shouldShowNeighboringMines", {
    get() {
      if (this.isOpened && this.shouldShowNeighboringMines) {
        return minesClassMap[this.model.neighboringMines];
      }
    }
  }),

  hasNeighboringMines: gt('model.neighboringMines', 0),
  shouldShowNeighboringMines: and('hasNeighboringMines', not('model.hasMine')),

  mouseDown(evt) {
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
      this.onOpenCell(this.model);
    }
  },

  handleRightClick() {
    this.onFlagCell(this.model);
  },

  contextMenu(evt) {
    evt.preventDefault();
  }
});
