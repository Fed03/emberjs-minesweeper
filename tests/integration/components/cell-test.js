import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { CellState } from 'minesweeper/models/cell-state';
import sinon from 'sinon';
import { run } from '@ember/runloop';


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
    this.set("state", new CellState())
    await render(hbs`{{board-cell cellState=state}}`);

    assert.dom(`${componentSelector}`).hasText("");
  });

  test('given an opened cell, then it shows the number of neighboring mines', async function (assert) {
    const state = new CellState();
    state.openCell();

    this.set("state", state);
    await render(hbs`{{board-cell cellState=state neighboringMines=3}}`);

    assert.dom(`${componentSelector} [data-test-neighboring-mines]`).hasText("3");
  });

  test('given an opened cell with zero neighboringMines, then it shows nothing', async function (assert) {
    const state = new CellState();
    state.openCell();

    this.set("state", state);
    await render(hbs`{{board-cell cellState=state neighboringMines=0}}`);

    assert.dom(`${componentSelector} [data-test-neighboring-mines]`).doesNotExist();
  });

  test('given an opened cell that has mine, then it should show an icon', async function (assert) {
    const state = new CellState();
    state.openCell();

    this.set("state", state);
    await render(hbs`{{board-cell cellState=state hasMine=true}}`);

    assert.dom(`${componentSelector} [data-test-mine-icon]`).exists();
  });

  test('given a closed cell that has mine, then it should not show an icon', async function (assert) {
    this.set("state", new CellState())
    await render(hbs`{{board-cell cellState=state hasMine=true}}`);

    assert.dom(`${componentSelector} [data-test-mine-icon]`).doesNotExist();
  });

  test('given an opened cell that has mine and neighboring mines, then it should show only the icon', async function (assert) {
    const state = new CellState();
    state.openCell();

    this.set("state", state);
    await render(hbs`{{board-cell cellState=state hasMine=true neighboringMines=3}}`);

    assert.dom(`${componentSelector} [data-test-neighboring-mines]`).doesNotExist();
    assert.dom(`${componentSelector} [data-test-mine-icon]`).exists();
  });

  test('given a closed cell, when clicked, then it should show its content', async function (assert) {
    this.set("state", new CellState())
    this.set("externalAction", sinon.fake());

    await render(hbs`{{board-cell cellState=state neighboringMines=3 onOpenCell=(action externalAction)}}`);
    await click(componentSelector);

    assert.dom(`${componentSelector} [data-test-neighboring-mines]`).hasText("3");
  });

  test('given a closed cell, when clicked, then it should openCell', async function (assert) {
    const state = new CellState()
    const openCell = sinon.spy(state, 'openCell');
    this.set("state", state);

    this.set("externalAction", sinon.fake());
    await render(hbs`{{board-cell cellState=state onOpenCell=(action externalAction)}}`);

    await click(componentSelector);

    assert.ok(openCell.calledOnce);
  });

  test('given a closed cell, when clicked, then it should fire an action', async function (assert) {
    this.set("state", new CellState());

    const externalAction = sinon.fake();
    this.set("externalAction", externalAction);
    await render(hbs`{{board-cell cellState=state onOpenCell=(action externalAction)}}`);

    await click(componentSelector);

    assert.ok(externalAction.calledOnce);
  });

  test('given an already open cell, when clicked, then it should not fire an action', async function (assert) {
    const state = new CellState();
    state.openCell();
    this.set("state", state);

    const externalAction = sinon.fake()
    this.set("externalAction", externalAction);

    await render(hbs`{{board-cell cellState=state onOpenCell=(action externalAction)}}`);

    await click(componentSelector);

    assert.ok(externalAction.notCalled);
  });

  test('given a closed cell, when opened, then it should change class', async function (assert) {
    this.set("state", new CellState());
    this.set("externalAction", sinon.fake());

    await render(hbs`{{board-cell cellState=state onOpenCell=(action externalAction)}}`);

    assert.dom(componentSelector).hasClass("board-cell-closed");
    assert.dom(componentSelector).doesNotHaveClass("board-cell-opened");

    await click(componentSelector);

    assert.dom(componentSelector).doesNotHaveClass("board-cell-closed");
    assert.dom(componentSelector).hasClass("board-cell-opened");
  });

  test('given a closed cell, when right clicked, then it should makeFlagged', async function (assert) {
    const state = new CellState()
    const openCell = sinon.spy(state, 'openCell');
    const makeFlagged = sinon.spy(state, 'makeFlagged');

    this.set("state", state);
    this.set("externalAction", sinon.fake());

    await render(hbs`{{board-cell cellState=state onOpenCell=(action externalAction)}}`);

    const rightButton = 2;
    await click(componentSelector, { button: rightButton });

    assert.ok(makeFlagged.calledOnce)
    assert.ok(openCell.notCalled)
  });

  test('given an open cell, when right clicked, then it should do not call makeFlagged', async function (assert) {
    const state = new CellState()
    state.openCell();
    const makeFlagged = sinon.spy(state, 'makeFlagged');

    this.set("state", state);
    this.set("externalAction", sinon.fake());

    await render(hbs`{{board-cell cellState=state onOpenCell=(action externalAction)}}`);

    const rightButton = 2;
    await click(componentSelector, { button: rightButton });

    assert.ok(makeFlagged.notCalled)
  });

  test('given a flagged cell, when clicked, then it should do not call openCell', async function (assert) {
    const state = new CellState()
    state.makeFlagged();
    const openCell = sinon.spy(state, 'openCell');

    this.set("state", state);
    this.set("externalAction", sinon.fake());

    await render(hbs`{{board-cell cellState=state onOpenCell=(action externalAction)}}`);

    await click(componentSelector);

    assert.ok(openCell.notCalled)
  });

  test('given a flagged cell, then it should show an icon', async function (assert) {
    const state = new CellState();

    this.set("state", state);
    await render(hbs`{{board-cell cellState=state}}`);

    assert.dom(`${componentSelector} [data-test-flag-icon]`).doesNotExist();

    run(() => state.makeFlagged());
    assert.dom(`${componentSelector} [data-test-flag-icon]`).exists();
  });
});
