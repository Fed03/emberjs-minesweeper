import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { cellFactory } from '../../factories';
import sinon from 'sinon';
import { run } from '@ember/runloop';


const componentSelector = "[data-test-cell-component]";

module('Integration | Component | board-cell', function (hooks) {
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
    this.set("cell", cellFactory())
    await render(hbs`{{board-cell model=cell}}`);

    assert.dom(`${componentSelector}`).hasText("");
  });

  test('given an opened cell, then it shows the number of neighboring mines', async function (assert) {
    const state = cellFactory({ neighboringMines: 3 });
    state.openCell();

    this.set("cell", state);
    await render(hbs`{{board-cell model=cell}}`);

    assert.dom(`${componentSelector} [data-test-neighboring-mines]`).hasText("3");
  });

  test('given an opened cell with zero neighboringMines, then it shows nothing', async function (assert) {
    const state = cellFactory({ neighboringMines: 0 });
    state.openCell();

    this.set("cell", state);
    await render(hbs`{{board-cell model=cell}}`);

    assert.dom(`${componentSelector} [data-test-neighboring-mines]`).doesNotExist();
  });

  test('given an opened cell that has mine, then it should show an icon', async function (assert) {
    const state = cellFactory({ hasMine: true });
    state.openCell();

    this.set("cell", state);
    await render(hbs`{{board-cell model=cell}}`);

    assert.dom(`${componentSelector} [data-test-mine-icon]`).exists();
  });

  test('given a closed cell that has mine, then it should not show an icon', async function (assert) {
    this.set("cell", cellFactory({ hasMine: true }))
    await render(hbs`{{board-cell model=cell}}`);

    assert.dom(`${componentSelector} [data-test-mine-icon]`).doesNotExist();
  });

  test('given an opened cell that has mine and neighboring mines, then it should show only the icon', async function (assert) {
    const state = cellFactory({ hasMine: true, neighboringMines: 3 });
    state.openCell();

    this.set("cell", state);
    await render(hbs`{{board-cell model=cell}}`);

    assert.dom(`${componentSelector} [data-test-neighboring-mines]`).doesNotExist();
    assert.dom(`${componentSelector} [data-test-mine-icon]`).exists();
  });

  test('given a closed cell, when clicked, then it should fire an action', async function (assert) {
    this.set("cell", cellFactory());

    const externalAction = sinon.fake();
    this.set("externalAction", externalAction);
    await render(hbs`{{board-cell model=cell onOpenCell=(action externalAction)}}`);

    await click(componentSelector);

    assert.ok(externalAction.calledOnce);
  });

  test('given a closed cell, when firing the open action, the it should pass the model as its argument', async function (assert) {
    const model = cellFactory();
    this.set("cell", model);

    const externalAction = sinon.spy();
    this.set("externalAction", externalAction);
    await render(hbs`{{board-cell model=cell onOpenCell=(action externalAction)}}`);

    await click(componentSelector);

    assert.ok(externalAction.calledWithExactly(model));
  });

  test('given an already open cell, when clicked, then it should not fire an action', async function (assert) {
    const state = cellFactory();
    state.openCell();
    this.set("cell", state);

    const externalAction = sinon.fake()
    this.set("externalAction", externalAction);

    await render(hbs`{{board-cell model=cell onOpenCell=(action externalAction)}}`);

    await click(componentSelector);

    assert.ok(externalAction.notCalled);
  });

  test('given a closed cell, when opened, then it should change class', async function (assert) {
    let cell = cellFactory();
    this.set("cell", cell);
    this.set("externalAction", sinon.fake());

    await render(hbs`{{board-cell model=cell onOpenCell=(action externalAction)}}`);

    assert.dom(componentSelector).hasClass("board-cell-closed");
    assert.dom(componentSelector).doesNotHaveClass("board-cell-opened");

    run(() => cell.openCell())

    assert.dom(componentSelector).doesNotHaveClass("board-cell-closed");
    assert.dom(componentSelector).hasClass("board-cell-opened");
  });

  test('given a closed cell, when right clicked, then it should fire an action', async function (assert) {
    const openCellAction = sinon.fake();
    const flagCellAction = sinon.fake();

    this.setProperties({
      cell: cellFactory(),
      openCellAction,
      flagCellAction
    });

    await render(hbs`{{board-cell model=cell onOpenCell=(action openCellAction) onFlagCell=(action flagCellAction)}}`);

    const rightButton = 2;
    await click(componentSelector, { button: rightButton });

    assert.ok(flagCellAction.calledOnce)
    assert.ok(openCellAction.notCalled)
  });

  test('given an open cell, when right clicked, then it should not fire an action', async function (assert) {
    const cell = cellFactory()
    cell.openCell();
    const flagCellAction = sinon.fake();

    this.setProperties({
      cell,
      flagCellAction
    });

    await render(hbs`{{board-cell model=cell onFlagCell=(action flagCellAction)}}`);

    const rightButton = 2;
    await click(componentSelector, { button: rightButton });

    assert.ok(flagCellAction.notCalled)
  });

  test('given a closed cell, when firing the open action, the it should pass the model as its argument', async function (assert) {
    const cell = cellFactory();
    const flagCellAction = sinon.fake();

    this.setProperties({
      cell,
      flagCellAction
    });

    await render(hbs`{{board-cell model=cell onFlagCell=(action flagCellAction)}}`);

    const rightButton = 2;
    await click(componentSelector, { button: rightButton });

    assert.ok(flagCellAction.calledWithExactly(cell));
  });

  test('given a flagged cell, when clicked, then it should not fire an action', async function (assert) {
    const state = cellFactory()
    state.makeFlagged();
    this.set("cell", state);

    const externalAction = sinon.fake()
    this.set("externalAction", externalAction);

    await render(hbs`{{board-cell model=cell onOpenCell=(action externalAction)}}`);

    await click(componentSelector);

    assert.ok(externalAction.notCalled)
  });

  test('given a flagged cell, then it should show an icon', async function (assert) {
    const state = cellFactory();

    this.set("cell", state);
    await render(hbs`{{board-cell model=cell}}`);

    assert.dom(`${componentSelector} [data-test-flag-icon]`).doesNotExist();

    run(() => state.makeFlagged());
    assert.dom(`${componentSelector} [data-test-flag-icon]`).exists();
  });
});
