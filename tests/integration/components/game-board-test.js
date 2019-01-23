import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { boardFactory } from "../../factories";

const componentSelector = "[data-test-board-component]";

module('Integration | Component | game-board', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    await render(hbs`{{game-board}}`);

    assert.dom(componentSelector).exists();
  });

  test('given a 3x3 board model then it should render 9 cells', async function (assert) {
    this.set("board", boardFactory(3, 3));
    await render(hbs`{{game-board model=board}}`);

    assert.dom(`${componentSelector} [data-test-cell-component]`).exists({ count: 9 });
  });
});
