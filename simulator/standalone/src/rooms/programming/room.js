window.SimulatorRooms = window.SimulatorRooms || {};
window.SimulatorRooms.programming = function createProgrammingRoom(context) {
  var data = window.ProgrammingRoom.Data;
  var rules = window.ProgrammingRoom.Game;
  var root;
  var selected = [];
  var running = false;
  var goal = data.goal;
  var robot = { x: data.start.x, z: data.start.z, direction: data.start.direction };
  var message;
  var board;
  var onClick;

  function el(tag, attrs) {
    var item = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (key) { item.setAttribute(key, attrs[key]); });
    return item;
  }
  function text(value, pos, width, color) {
    return el('a-text', { value: value, position: pos, width: width || 4, align: 'center', color: color || '#fff' });
  }
  function drawRobot() {
    var old = root.querySelector('[data-robot]');
    if (old) old.remove();
    var avatar = el('a-entity', { 'data-robot': '', position: robot.x + ' .3 ' + robot.z, rotation: '0 ' + robot.direction + ' 0' });
    avatar.append(el('a-box', { position: '0 0 0', width: '.42', height: '.42', depth: '.42', color: '#f97316' }));
    avatar.append(el('a-cone', { position: '0 .31 -.2', radiusBottom: '.13', radiusTop: '0', height: '.25', color: '#fde047' }));
    root.append(avatar);
  }
  function updateSequence() {
    board.setAttribute('value', selected.length ? selected.map(function (cmd, index) { return (index + 1) + '. ' + context.i18n.t('programming.' + cmd); }).join('\n') : '—');
  }
  function reset() {
    selected = []; robot = { x: data.start.x, z: data.start.z, direction: data.start.direction }; running = false;
    updateSequence(); drawRobot(); message.setAttribute('value', context.i18n.t('programming.description'));
  }
  function addCommand(command) {
    if (running || selected.length >= data.maxCommands) return;
    selected.push(command); updateSequence();
  }
  function run() {
    if (running) return;
    running = true;
    robot = { x: data.start.x, z: data.start.z, direction: data.start.direction }; drawRobot();
    var index = 0;
    var timer = setInterval(function () {
      if (index >= selected.length) {
        clearInterval(timer); running = false;
        var result = rules.run(selected, data);
        robot = result.state; drawRobot();
        var success = result.success;
        message.setAttribute('value', context.i18n.t(success ? 'programming.win' : 'programming.fail'));
        context.session.update({ score: context.session.get().score + (success ? 1 : 0), errors: context.session.get().errors + (success ? 0 : 1) });
        return;
      }
      var cmd = selected[index++];
      var preview = rules.run(selected.slice(0, index), data);
      robot = preview.state;
      drawRobot();
    }, 550);
    root._timer = timer;
  }

  return {
    mount: function (container) {
      root = el('a-entity', { position: '0 0 -1.5' });
      root.append(text(context.i18n.t('programming.title'), '-2 3 0', 4, '#c4b5fd'));
      root.append(text(context.i18n.t('programming.description'), '-2 2.6 0', 4, '#e2e8f0'));
      var grid = el('a-entity', { position: '0 0 0' });
      for (var x = data.min; x <= data.max; x++) for (var z = data.min; z <= data.max; z++) {
        var cell = el('a-box', { position: x + ' .02 ' + z, width: '.94', height: '.04', depth: '.94', color: (x + z) % 2 ? '#334155' : '#475569' });
        grid.append(cell);
      }
      var target = el('a-sphere', { position: goal.x + ' .28 ' + goal.z, radius: '.28', color: '#22c55e', animation: 'property: scale; dir: alternate; to: 1.18 1.18 1.18; loop: true; dur: 700' });
      grid.append(target); root.append(grid);
      drawRobot();
      message = text(context.i18n.t('programming.description'), '-2 .42 0', 4, '#67e8f9'); root.append(message);
      board = text('—', '2 2.55 0', 2.4, '#fff'); board.setAttribute('align', 'left'); root.append(board);
      data.commands.map(function (command) { return [command, context.i18n.t('programming.' + command), command === 'forward' ? '#0ea5e9' : '#8b5cf6']; }).forEach(function (row, i) {
        var button = el('a-box', { class: 'selectable', position: '2 ' + (1.8 - i * .55) + ' .1', width: '1.6', height: '.42', depth: '.12', color: row[2] });
        button.dataset.command = row[0]; root.append(button);
        root.append(text(row[1], '1.35 ' + (1.76 - i * .55) + ' .18', 1.3, '#fff'));
      });
      var runButton = el('a-box', { class: 'selectable', position: '1.35 .24 .1', width: '1.15', height: '.42', depth: '.12', color: '#16a34a' }); runButton.dataset.action = 'run'; root.append(runButton); root.append(text(context.i18n.t('programming.run'), '.96 .17 .18', .8, '#fff'));
      var resetButton = el('a-box', { class: 'selectable', position: '2.65 .24 .1', width: '1.1', height: '.42', depth: '.12', color: '#475569' }); resetButton.dataset.action = 'reset'; root.append(resetButton); root.append(text(context.i18n.t('programming.reset'), '2.29 .17 .18', .75, '#fff'));
      container.append(root);
      onClick = function (event) {
        var command = event.target.closest('[data-command]'); var action = event.target.closest('[data-action]');
        if (command) addCommand(command.dataset.command);
        if (action && action.dataset.action === 'run') run();
        if (action && action.dataset.action === 'reset') reset();
      };
      root.addEventListener('click', onClick);
    },
    unmount: function () {
      if (root && root._timer) clearInterval(root._timer);
      if (root && onClick) root.removeEventListener('click', onClick);
      if (root) root.remove();
      root = null; onClick = null;
    }
  };
};
