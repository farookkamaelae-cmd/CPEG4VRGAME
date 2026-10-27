// INTERACTIONS — Click handling for wire samples, connector pins, Check and Reset.
window.NetworkRoom = window.NetworkRoom || {};
window.NetworkRoom.Interactions = {
  bind: function (root, handlers) {
    function onClick(event) {
      var sample = event.target.closest('[data-color]');
      var action = event.target.closest('[data-action]');
      if (sample) handlers.choose(sample.dataset.color);
      if (action && action.dataset.action === 'check') handlers.check();
      if (action && action.dataset.action === 'reset') handlers.reset();
    }
    root.addEventListener('click', onClick);
    return function () { root.removeEventListener('click', onClick); };
  }
};
