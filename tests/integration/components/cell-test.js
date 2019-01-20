import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import sinon from 'sinon';

const componentSelector = "[data-test-cell-component]";

module('Integration | Component | cell', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    await render(hbs`{{board-cell}}`);

    assert.dom(`${componentSelector}`).exists();
  });

  test('given a parameterless invocation, it should show nothing', async function (assert) {
    await render(hbs`{{board-cell}}`);

    assert.dom(`${componentSelector}`).hasText("");
  });

  test('given a closed cell, then it does not contain anything', async function (assert) {
    await render(hbs`{{board-cell isOpened=false}}`);

    assert.dom(`${componentSelector}`).hasText("");
  });

  test('given an opened cell, then it shows the number of neighboring mines', async function (assert) {
    await render(hbs`{{board-cell isOpened=true neighboringMines=3}}`);

    assert.dom(`${componentSelector} [data-test-neighboring-mines]`).hasText("3");
  });

  test('given an opened cell with zero neighboringMines, then it shows nothing', async function (assert) {
    await render(hbs`{{board-cell isOpened=true neighboringMines=0}}`);

    assert.dom(`${componentSelector} [data-test-neighboring-mines]`).doesNotExist();
  });

  test('given an opened cell that has mine, then it should show an icon', async function (assert) {
    await render(hbs`{{board-cell isOpened=true hasMine=true}}`);

    assert.dom(`${componentSelector} [data-test-mine-icon]`).exists();
  });

  test('given a closed cell that has mine, then it should not show an icon', async function (assert) {
    await render(hbs`{{board-cell isOpened=closed hasMine=true}}`);

    assert.dom(`${componentSelector} [data-test-mine-icon]`).doesNotExist();
  });

  test('given an opened cell that has mine and neighboring mines, then it should show only the icon', async function (assert) {
    await render(hbs`{{board-cell isOpened=true hasMine=true neighboringMines=3}}`);

    assert.dom(`${componentSelector} [data-test-neighboring-mines]`).doesNotExist();
    assert.dom(`${componentSelector} [data-test-mine-icon]`).exists();
  });

  test('given a closed cell, when clicked, then it should show its content', async function (assert) {
    this.set("externalAction", sinon.fake());
    await render(hbs`{{board-cell isOpened=false neighboringMines=3 onOpenCell=(action externalAction)}}`);
    await click(componentSelector);

    assert.dom(`${componentSelector} [data-test-neighboring-mines]`).hasText("3");
  });

  test('given a closed cell, when clicked, then it should fire an action', async function (assert) {
    assert.expect(1);

    const externalAction = sinon.fake()
    this.set("externalAction", externalAction);
    await render(hbs`{{board-cell isOpened=false onOpenCell=(action externalAction)}}`);

    await click(componentSelector);

    assert.ok(externalAction.calledOnce);
  });

  test('given an already open cell, when clicked, then it should not fire an action', async function (assert) {
    assert.expect(1);

    const externalAction = sinon.fake()
    this.set("externalAction", externalAction);
    await render(hbs`{{board-cell isOpened=true onOpenCell=(action externalAction)}}`);

    await click(componentSelector);

    assert.ok(externalAction.notCalled);
  });

  test('given a closed cell, when opened, then it should change class', async function (assert) {
    this.set("externalAction", sinon.fake());
    await render(hbs`{{board-cell isOpened=false onOpenCell=(action externalAction)}}`);

    assert.dom(componentSelector).hasClass("board-cell-closed");
    assert.dom(componentSelector).doesNotHaveClass("board-cell-opened");

    await click(componentSelector);

    assert.dom(componentSelector).doesNotHaveClass("board-cell-closed");
    assert.dom(componentSelector).hasClass("board-cell-opened");
  });
});
