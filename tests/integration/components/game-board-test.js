import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { boardFactory, cellsListFactory } from "../../factories";

const componentSelector = "[data-test-board-component]";

module('Integration | Component | game-board', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    this.set("board", boardFactory());
    await render(hbs`{{game-board model=board}}`);

    assert.dom(componentSelector).exists();
  });

  test('given a 3x3 board model then it should render 9 cells', async function (assert) {
    this.set("board", boardFactory({ rows: 3, columns: 3 }));
    await render(hbs`{{game-board model=board}}`);

    assert.dom(`${componentSelector} [data-test-cell]`).exists({ count: 9 });
  });

  test('given a board, when right clicking on a close cell, it should be flagged', async function (assert) {
    let cells = cellsListFactory(3, 3);
    this.set("board", boardFactory({ rows: 3, columns: 3, cellsList: cells }));
    await render(hbs`{{game-board model=board}}`);

    await click('[data-test-cell="2,2"]', { button: 2 });

    assert.ok(getCell(cells, 2, 2).isFlagged);
  });

  /*
        0   1   2
      +---+---+---+
    0 |   |   |   |
      +---+---+---+
    1 |   |   |   |
      +---+---+---+
    2 |   |   |   |
      +---+---+---+
  */
  test('given a board structured as in the comment, when clicking on the (2,2) cell, it should be opened', async function (assert) {
    let cells = cellsListFactory(3, 3);
    this.set("board", boardFactory({ rows: 3, columns: 3, cellsList: cells }));
    await render(hbs`{{game-board model=board}}`);

    await click('[data-test-cell="2,2"]');

    assert.ok(getCell(cells, 2, 2).isOpened);
  });

  /*
        0   1   2
      +---+---+---+
    0 |   | M |   |
      +---+---+---+
    1 |   |   |   |
      +---+---+---+
    2 | M |   |   |
      +---+---+---+
  */
  test('given a board structured as in the comment, when clicking on the (2,2) cell, its neghborhood should be opened as well', async function (assert) {
    let cells = cellsListFactory(3, 3);
    getCell(cells, 0, 1).hasMine = true;
    getCell(cells, 2, 0).hasMine = true;

    this.set("board", boardFactory({ rows: 3, columns: 3, cellsList: cells }));
    await render(hbs`{{game-board model=board}}`);

    await click('[data-test-cell="2,2"]');

    const openedCells = cells.filter(cell => cell.isOpened);

    assert.equal(openedCells.length, 4);
    assert.ok(getCell(cells, 2, 2).isOpened);
    assert.ok(getCell(cells, 1, 1).isOpened);
    assert.ok(getCell(cells, 2, 1).isOpened);
    assert.ok(getCell(cells, 1, 2).isOpened);
  });

  /*

        0   1   2
      +---+---+---+
    0 |   |   |   |
      +---+---+---+
    1 |   |   | M |
      +---+---+---+
    2 |   |   |   |
      +---+---+---+
  */
  test('given a board structured as in the comment, when clicking on the (2,2) cell, its neghborhood should not be opened', async function (assert) {
    let cells = cellsListFactory(3, 3);
    getCell(cells, 1, 2).hasMine = true;

    this.set("board", boardFactory({ rows: 3, columns: 3, cellsList: cells }));
    await render(hbs`{{game-board model=board}}`);

    await click('[data-test-cell="2,2"]');

    const openedCells = cells.filter(cell => cell.isOpened);

    assert.equal(openedCells.length, 1);
    assert.ok(getCell(cells, 2, 2).isOpened);
  });

  /*

        0   1   2
      +---+---+---+
    0 | M |   | M |
      +---+---+---+
    1 |   |   |   |
      +---+---+---+
    2 |   |   |   |
      +---+---+---+
  */
  test('given a board structured as in the comment, when clicking on the (2,2) cell, its neghborhood should be opened recursively', async function (assert) {
    let cells = cellsListFactory(3, 3);
    getCell(cells, 0, 0).hasMine = true;
    getCell(cells, 0, 2).hasMine = true;

    this.set("board", boardFactory({ rows: 3, columns: 3, cellsList: cells }));
    await render(hbs`{{game-board model=board}}`);

    await click('[data-test-cell="2,2"]');

    const openedCells = cells.filter(cell => cell.isOpened);

    assert.equal(openedCells.length, 6);
    assert.ok(getCell(cells, 2, 2).isOpened);
    assert.ok(getCell(cells, 1, 1).isOpened);
    assert.ok(getCell(cells, 2, 1).isOpened);
    assert.ok(getCell(cells, 1, 2).isOpened);
    assert.ok(getCell(cells, 1, 0).isOpened);
    assert.ok(getCell(cells, 2, 0).isOpened);
  });

  test('given a board, then it should display the number of flagged cells', async function (assert) {
    let cells = cellsListFactory(3, 3);
    this.set("board", boardFactory({ rows: 3, columns: 3, cellsList: cells }));

    await render(hbs`{{game-board model=board}}`);
    assert.dom(`${componentSelector} [data-test-flagged-cells-counter]`).hasText("0");

    await click('[data-test-cell="2,2"]', { button: 2 });
    assert.dom(`${componentSelector} [data-test-flagged-cells-counter]`).hasText("1");

    await click('[data-test-cell="2,2"]', { button: 2 });
    assert.dom(`${componentSelector} [data-test-flagged-cells-counter]`).hasText("0");
  });
});

function getCell(cells, x, y) {
  return cells.find(cell => cell.isInPosition(x, y));
}

