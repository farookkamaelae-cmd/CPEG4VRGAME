window.SimulatorRooms = window.SimulatorRooms || {};
window.SimulatorRooms.network = function createNetworkRoom(context) {
  var data = window.NetworkRoom.Data;
  var rules = window.NetworkRoom.Game;
  var root;
  var order = [];
  var slots = [];
  var status;
  var onClick;
  var colors = data.wires;
  var answer = data.correctOrder;
  function el(tag, attrs) { var item = document.createElement(tag); Object.keys(attrs || {}).forEach(function (key) { item.setAttribute(key, attrs[key]); }); return item; }
  function text(value, pos, width, color) { return el('a-text', { value: value, position: pos, width: width || 4, align: 'center', color: color || '#fff' }); }
  function paintSlot(index) {
    var wire = colors.find(function (color) { return color.id === order[index]; });
    slots[index].setAttribute('color', wire ? wire.hex : '#334155');
    slots[index].setAttribute('material', wire && wire.stripe ? 'shader: standard; color: ' + wire.hex : 'shader: standard; color: ' + (wire ? wire.hex : '#334155'));
    slots[index].setAttribute('data-wire', wire ? wire.id : '');
    var stripe = slots[index].querySelector('[data-stripe]');
    if (stripe) stripe.setAttribute('visible', Boolean(wire && wire.stripe));
    if (stripe && wire && wire.stripe) stripe.setAttribute('color', wire.stripe);
  }
  function reset() { order = []; slots.forEach(function (_, index) { paintSlot(index); }); status.setAttribute('value', context.i18n.t('network.instruction')); }
  function choose(colorId) {
    if (order.length >= 8) return;
    order.push(colorId); paintSlot(order.length - 1);
  }
  function check() {
    var correct = rules.isCorrect(order, answer);
    status.setAttribute('value', context.i18n.t(correct ? 'network.correct' : 'network.incorrect'));
    var previous = context.session.get();
    context.session.update({ score: previous.score + (correct ? 1 : 0), errors: previous.errors + (correct ? 0 : 1) });
    context.emit('network:checked', { correct: correct, order: order.slice() });
  }
  return {
    mount: function (container) {
      root = el('a-entity', { position: '0 0 -2' });
      root.append(text(context.i18n.t('network.title'), '-2 3 0', 4, '#67e8f9'));
      root.append(text(context.i18n.t('network.description'), '-2 2.6 0', 4, '#e2e8f0'));
      root.append(text(context.i18n.t('network.instruction'), '-2 2.15 0', 4, '#bae6fd'));
      var plug = el('a-box', { position: '0 .95 0', width: '4.5', height: '.75', depth: '.3', color: '#d1d5db' }); root.append(plug);
      for (var i = 0; i < 8; i++) {
        var x = -1.72 + i * .49;
        var slot = el('a-cylinder', { position: x + ' .95 .19', radius: '.15', height: '.09', rotation: '90 0 0', color: '#334155' });
        var stripe = el('a-box', { 'data-stripe': '', visible: 'false', position: '0 0 .06', width: '.24', height: '.035', depth: '.025', color: '#fff' }); slot.append(stripe); slots.push(slot); root.append(slot);
        root.append(text(String(i + 1), (x - .06) + ' .48 .1', .2, '#fff'));
      }
      colors.forEach(function (wire, index) {
        var x = -1.75 + (index % 4) * 1.15; var y = -.15 - Math.floor(index / 4) * .62;
        var sample = el('a-cylinder', { class: 'selectable', position: x + ' ' + y + ' .1', radius: '.14', height: '.13', rotation: '90 0 0', color: wire.hex }); sample.dataset.color = wire.id;
        if (wire.stripe) sample.append(el('a-box', { position: '0 0 .08', width: '.22', height: '.03', depth: '.025', color: wire.stripe }));
        root.append(sample);
        root.append(text(wire.label, (x - .42) + ' ' + (y - .32) + ' .1', .9, '#e2e8f0'));
      });
      var checkButton = el('a-box', { class: 'selectable', position: '1.35 -1.45 .1', width: '1.45', height: '.42', depth: '.12', color: '#16a34a' }); checkButton.dataset.action = 'check'; root.append(checkButton); root.append(text(context.i18n.t('network.check'), '.88 -1.52 .18', 1, '#fff'));
      var resetButton = el('a-box', { class: 'selectable', position: '2.9 -1.45 .1', width: '1.2', height: '.42', depth: '.12', color: '#475569' }); resetButton.dataset.action = 'reset'; root.append(resetButton); root.append(text(context.i18n.t('network.reset'), '2.5 -1.52 .18', .9, '#fff'));
      status = text(context.i18n.t('network.instruction'), '-2 -2.05 0', 4, '#67e8f9'); root.append(status);
      container.append(root);
      onClick = function (event) {
        var sample = event.target.closest('[data-color]'); var action = event.target.closest('[data-action]');
        if (sample) choose(sample.dataset.color);
        if (action && action.dataset.action === 'check') check();
        if (action && action.dataset.action === 'reset') reset();
      };
      root.addEventListener('click', onClick);
    },
    unmount: function () { if (root && onClick) root.removeEventListener('click', onClick); if (root) root.remove(); root = null; slots = []; onClick = null; }
  };
};
