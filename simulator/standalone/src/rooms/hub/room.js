// HUB / ROOM LIFECYCLE
// Keep navigation behavior in interactions.js and visual construction in models.js.
window.SimulatorRooms = window.SimulatorRooms || {};
window.SimulatorHub = window.SimulatorHub || {};
window.SimulatorRooms.hub = function createHubRoom(context) {
  var root = null;
  var unbindInteractions = null;
  return {
    mount: function (container) {
      root = window.SimulatorHub.Models.create(context);
      container.append(root);
      unbindInteractions = window.SimulatorHub.Interactions.bind(root, context);
    },
    unmount: function () {
      if (unbindInteractions) unbindInteractions();
      if (root) root.remove();
      unbindInteractions = null;
      root = null;
    }
  };
};
