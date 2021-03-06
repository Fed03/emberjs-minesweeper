import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { boardFactory, cellsListFactory } from "../../factories";
import { run } from '@ember/runloop';
import Service from '@ember/service';
import sinon from 'sinon';

const componentSelector = "[data-test-board-component]";

const AlertServiceStub = Service.extend({
  init() {
    this.open = sinon.fake.resolves({ value: true });
    this._super(...arguments);
  }
});

const PollServiceStub = Service.extend({
  init() {
    this._super(...arguments);
    this.callBacks = [];
    this.addPoll = sinon.fake(({ callback }) => {
      this.callBacks.push(callback);
      return this.callBacks.length - 1;
    });
  },

  elapseTime() {
    run(() => {
      this.callBacks.forEach(fn => fn());
    });
  },

  stopPoll(idx) {
    run(() => {
      this.callBacks.splice(idx, 1);
    });
  }
})

module('Integration | Component | game-board', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.owner.register("service:swal", AlertServiceStub);
    this.alertStub = this.owner.lookup('service:swal');

    this.owner.register("service:poll", PollServiceStub);
    this.pollStub = this.owner.lookup('service:poll');
  });

  test('it renders', async function (assert) {
    this.set("board", boardFactory());
    await render(hbs`{{game-board model=board}}`);

    assert.dom(componentSelector).exists();
  });

  test('given a 3x3 board model then it should render 9 cells', async function (assert) {
    this.set("board", boardFactory({ rows: 3, columns: 3, numberOfMines: 0 }));
    await render(hbs`{{game-board model=board}}`);

    assert.dom(`${componentSelector} [data-test-cell]`).exists({ count: 9 });
  });

  test('given a board, when right clicking on a close cell, it should be flagged', async function (assert) {
    let cells = cellsListFactory(3, 3);
    this.set("board", boardFactory({ rows: 3, columns: 3, numberOfMines: 0, cellsList: cells }));
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
    this.set("resetAction", sinon.fake());
    let cells = cellsListFactory(3, 3);
    this.set("board", boardFactory({ rows: 3, columns: 3, numberOfMines: 0, cellsList: cells }));
    await render(hbs`{{game-board model=board onResetGame=(action resetAction)}}`);

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
    getCell(cells, 1, 0).hasMine = true;
    getCell(cells, 0, 2).hasMine = true;

    this.set("board", boardFactory({ rows: 3, columns: 3, numberOfMines: 2, cellsList: cells }));
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
    getCell(cells, 2, 1).hasMine = true;

    this.set("board", boardFactory({ rows: 3, columns: 3, numberOfMines: 1, cellsList: cells }));
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
    getCell(cells, 2, 0).hasMine = true;

    this.set("board", boardFactory({ rows: 3, columns: 3, numberOfMines: 2, cellsList: cells }));
    await render(hbs`{{game-board model=board}}`);

    await click('[data-test-cell="2,2"]');

    const openedCells = cells.filter(cell => cell.isOpened);

    assert.equal(openedCells.length, 6);
    assert.ok(getCell(cells, 2, 2).isOpened);
    assert.ok(getCell(cells, 1, 1).isOpened);
    assert.ok(getCell(cells, 2, 1).isOpened);
    assert.ok(getCell(cells, 1, 2).isOpened);
    assert.ok(getCell(cells, 0, 1).isOpened);
    assert.ok(getCell(cells, 0, 2).isOpened);
  });

  test('given a board, then it should display the number of remaining bombs', async function (assert) {
    let cells = cellsListFactory(3, 3);
    this.set("board", boardFactory({ rows: 3, columns: 3, cellsList: cells, numberOfMines: 2 }));

    await render(hbs`{{game-board model=board}}`);
    assert.dom(`${componentSelector} [data-test-remaining-mines-counter]`).hasText("2");

    await click('[data-test-cell="2,2"]', { button: 2 });
    assert.dom(`${componentSelector} [data-test-remaining-mines-counter]`).hasText("1");

    await click('[data-test-cell="2,2"]', { button: 2 });
    assert.dom(`${componentSelector} [data-test-remaining-mines-counter]`).hasText("2");

    await click('[data-test-cell="2,2"]', { button: 2 });
    await click('[data-test-cell="2,1"]', { button: 2 });
    await click('[data-test-cell="2,0"]', { button: 2 });
    assert.dom(`${componentSelector} [data-test-remaining-mines-counter]`).hasText("-1");
  });

  test('given a board, then it should display the elapsed time since the game start', async function (assert) {
    let cells = cellsListFactory(3, 3);
    this.set("board", boardFactory({ rows: 3, columns: 3, cellsList: cells, elapsedTime: 30 }));

    await render(hbs`{{game-board model=board}}`);
    assert.dom(`${componentSelector} [data-test-elapsed-time]`).hasText("30");
  });

  test('given a board, when clicking on a cell for the first time, it should start to increase the elapsedTime', async function (assert) {
    this.set("resetAction", sinon.fake());
    let board = boardFactory({ rows: 3, columns: 3, numberOfMines: 1, cellsList: cellsListFactory(3, 3), elapsedTime: 30 })
    this.set("board", board);

    const intervalCallback = sinon.spy(board, "increaseElapsedTime");

    await render(hbs`{{game-board model=board onResetGame=(action resetAction)}}`);
    await click('[data-test-cell="2,2"]');

    this.pollStub.elapseTime();

    assert.dom(`${componentSelector} [data-test-elapsed-time]`).hasText("31");

    assert.ok(this.pollStub.addPoll.calledOnce);
    assert.equal(this.pollStub.addPoll.getCall(0).args[0].interval, 1000);
    assert.ok(intervalCallback.calledOnce);
  });

  test('given a board, when flagging a cell for the first time, it should start to increase the elapsedTime', async function (assert) {
    let cells = cellsListFactory(3, 3);
    this.set("board", boardFactory({ rows: 3, columns: 3, cellsList: cells, elapsedTime: 30 }));

    await render(hbs`{{game-board model=board}}`);
    await click('[data-test-cell="2,2"]', { button: 2 });

    this.pollStub.elapseTime();

    assert.dom(`${componentSelector} [data-test-elapsed-time]`).hasText("31");
  });

  test('given a board, opening a second cell should not register a new increase of the elapsedTime', async function (assert) {
    this.set("resetAction", sinon.fake());

    let cells = cellsListFactory(3, 3);
    getCell(cells, 1, 1).hasMine = true;
    this.set("board", boardFactory({ rows: 3, columns: 3, numberOfMines: 1, cellsList: cells, elapsedTime: 30 }));

    await render(hbs`{{game-board model=board onResetGame=(action resetAction)}}`);
    await click('[data-test-cell="2,2"]');
    await click('[data-test-cell="0,0"]');

    this.pollStub.elapseTime();

    assert.dom(`${componentSelector} [data-test-elapsed-time]`).hasText("31");
    assert.ok(this.pollStub.addPoll.calledOnce);
  });

  test('given a board, when clicking a mine, it should open all cells', async function (assert) {
    this.set("resetAction", sinon.fake());
    let cells = cellsListFactory(3, 3);
    getCell(cells, 1, 2).hasMine = true;

    this.set("board", boardFactory({ rows: 3, columns: 3, cellsList: cells, elapsedTime: 30 }));

    await render(hbs`{{game-board model=board onResetGame=(action resetAction)}}`);
    await click('[data-test-cell="1,2"]');

    const openedCells = cells.filter(cell => cell.isOpened);
    assert.equal(openedCells.length, 9);
  });

  test('given a board, when clicking a mine, it should stop the elapsed time', async function (assert) {
    this.set("resetAction", sinon.fake());
    let cells = cellsListFactory(3, 3);
    getCell(cells, 1, 2).hasMine = true;

    this.set("board", boardFactory({ rows: 3, columns: 3, cellsList: cells, elapsedTime: 30 }));

    await render(hbs`{{game-board model=board onResetGame=(action resetAction)}}`);
    await click('[data-test-cell="1,2"]');

    this.pollStub.elapseTime();

    assert.dom(`${componentSelector} [data-test-elapsed-time]`).hasText("30");
  });

  test('given a board, when clicking a mine, it should show an alert', async function (assert) {
    this.set("resetAction", sinon.fake());
    let cells = cellsListFactory(3, 3);
    getCell(cells, 1, 2).hasMine = true;

    this.set("board", boardFactory({ rows: 3, columns: 3, cellsList: cells }));

    await render(hbs`{{game-board model=board onResetGame=(action resetAction)}}`);
    await click('[data-test-cell="1,2"]');

    assert.ok(this.alertStub.open.calledOnceWithExactly({
      titleText: "Game Over!",
      type: "error",
      confirmButtonText: "Retry",
      allowOutsideClick: false,
      allowEscapeKey: false
    }));
  });

  test('given the game over alert, when its promise resolves, then it should fire a reset game action', async function (assert) {
    let cells = cellsListFactory(3, 3);
    getCell(cells, 1, 2).hasMine = true;
    this.set("board", boardFactory({ rows: 3, columns: 3, cellsList: cells }));

    const resetAction = sinon.fake();
    this.set("resetAction", resetAction);

    await render(hbs`{{game-board model=board onResetGame=(action resetAction)}}`);
    await click('[data-test-cell="1,2"]');

    assert.ok(resetAction.calledOnce);
  });

  /*
        0   1   2
      +---+---+---+
    0 | M |   | M |
      +---+---+---+
    1 | O | O | O |
      +---+---+---+
    2 | O | O | O |
      +---+---+---+
  */
  test('given a board structured as in the comment, when the last closed cell without a mine is clicked, then it should show an alert', async function (assert) {
    this.set("resetAction", sinon.fake());
    let cells = cellsListFactory(3, 3);
    getCell(cells, 0, 0).hasMine = true;
    getCell(cells, 2, 0).hasMine = true;

    getCell(cells, 0, 1).isOpened = true;
    getCell(cells, 1, 1).isOpened = true;
    getCell(cells, 2, 1).isOpened = true;
    getCell(cells, 0, 2).isOpened = true;
    getCell(cells, 1, 2).isOpened = true;
    getCell(cells, 2, 2).isOpened = true;

    this.set("board", boardFactory({ rows: 3, columns: 3, numberOfMines: 2, cellsList: cells, elapsedTime: 40 }));
    await render(hbs`{{game-board model=board onResetGame=(action resetAction)}}`);

    await click('[data-test-cell="1,0"]');

    assert.ok(this.alertStub.open.calledOnceWithExactly({
      titleText: "WIN!",
      type: "success",
      text: "You won in 40 seconds",
      confirmButtonText: "New Game",
      allowOutsideClick: false,
      allowEscapeKey: false
    }));
  });

  /*
        0   1   2
      +---+---+---+
    0 | M |   | M |
      +---+---+---+
    1 | O | O | O |
      +---+---+---+
    2 | O | O | O |
      +---+---+---+
  */
  test('given the win alert, when its promise resolves, then it should fire a reset game action', async function (assert) {
    let cells = cellsListFactory(3, 3);
    getCell(cells, 0, 0).hasMine = true;
    getCell(cells, 2, 0).hasMine = true;

    getCell(cells, 0, 1).isOpened = true;
    getCell(cells, 1, 1).isOpened = true;
    getCell(cells, 2, 1).isOpened = true;
    getCell(cells, 0, 2).isOpened = true;
    getCell(cells, 1, 2).isOpened = true;
    getCell(cells, 2, 2).isOpened = true;

    this.set("board", boardFactory({ rows: 3, columns: 3, numberOfMines: 2, cellsList: cells, }));

    const resetAction = sinon.fake();
    this.set("resetAction", resetAction);

    await render(hbs`{{game-board model=board onResetGame=(action resetAction)}}`);

    await click('[data-test-cell="1,0"]');

    assert.ok(resetAction.calledOnce);
  });

  /*
      0   1   2
    +---+---+---+
  0 | M |   | M |
    +---+---+---+
  1 | O | O | O |
    +---+---+---+
  2 | O | O | O |
    +---+---+---+
*/
  test('Winning the game should stop the elapsed time', async function (assert) {
    this.set("resetAction", sinon.fake());
    let cells = cellsListFactory(3, 3);
    getCell(cells, 0, 0).hasMine = true;
    getCell(cells, 2, 0).hasMine = true;

    getCell(cells, 0, 1).isOpened = true;
    getCell(cells, 1, 1).isOpened = true;
    getCell(cells, 2, 1).isOpened = true;
    getCell(cells, 0, 2).isOpened = true;
    getCell(cells, 1, 2).isOpened = true;
    getCell(cells, 2, 2).isOpened = true;

    this.set("board", boardFactory({ rows: 3, columns: 3, numberOfMines: 2, cellsList: cells, elapsedTime: 20 }));
    await render(hbs`{{game-board model=board onResetGame=(action resetAction)}}`);

    await click('[data-test-cell="1,0"]');
    this.pollStub.elapseTime();

    assert.dom(`${componentSelector} [data-test-elapsed-time]`).hasText("20");
  });
});

function getCell(cells, x, y) {
  return cells.find(cell => cell.isInPosition(x, y));
}

