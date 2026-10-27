// HUB / ROOM SELECTION INTERACTIONS
// Connect the Hub's selectable portals to the shared room navigation API here.
window.SimulatorHub = window.SimulatorHub || {};
window.SimulatorHub.Interactions = {
  bind: function (root, context) {
    function onClick(event) {
      var portal = event.target.closest('[data-room]');
      if (portal && root.contains(portal)) context.navigation.openRoom(portal.dataset.room);
    }
    root.addEventListener('click', onClick);
    return function unbind() { root.removeEventListener('click', onClick); };
  }
};
