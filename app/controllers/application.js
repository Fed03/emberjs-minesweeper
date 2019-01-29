import Controller from '@ember/controller';
import { inject } from '@ember/service';
import { computed } from '@ember/object';

export default Controller.extend({
  gameFactory: inject(),

  maxMines: computed("rows", "columns", function () {
    return (this.rows * this.columns) - 1;
  }),

  actions: {
    resetGame(evt) {
      if (evt) {
        evt.preventDefault();
      }
      this.set("model", this.gameFactory.setUpNewGame(this.rows, this.columns, this.numberOfmines));
    }
  }
});
