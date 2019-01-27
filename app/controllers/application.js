import Controller from '@ember/controller';
import { inject } from '@ember/service';

export default Controller.extend({
  gameFactory: inject(),

  actions: {
    resetGame() {
      this.set("model", this.gameFactory.setUpNewGame(this.rows, this.columns, this.numberOfmines));
    }
  }
});
