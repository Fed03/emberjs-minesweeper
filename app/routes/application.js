import Route from '@ember/routing/route';
import { inject } from '@ember/service';

export default Route.extend({
  gameFactory: inject(),
  rows: 5,
  columns: 10,
  numberOfmines: 15,

  model() {
    return this.gameFactory.setUpNewGame(this.rows, this.columns, this.numberOfmines);
  },

  setupController(controller, model) {
    this._super(controller, model);
    controller.setProperties({
      rows: this.rows,
      columns: this.columns,
      numberOfmines: this.numberOfmines
    })
  }
});
