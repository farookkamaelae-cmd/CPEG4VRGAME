// INTERACTIONS — Click handling for command blocks, Run and Reset controls.
window.ProgrammingRoom = window.ProgrammingRoom || {};
window.ProgrammingRoom.Interactions = {
  bind: function (root, handlers) {
    function onClick(event) {
      var command = event.target.closest('[data-command]');
      var action = event.target.closest('[data-action]');
      if (command) handlers.addCommand(command.dataset.command);
      if (action && action.dataset.action === 'run') handlers.run();
      if (action && action.dataset.action === 'reset') handlers.reset();
    }
    root.addEventListener('click', onClick);
    return function () { root.removeEventListener('click', onClick); };
  }
};
