// HUB / ROOM LIFECYCLE
window.SimulatorRooms = window.SimulatorRooms || {};
window.SimulatorHub = window.SimulatorHub || {};
window.SimulatorRooms.hub = function createHubRoom(context) {
  var root = null;
  var unbindInteractions = null;
  var camera = null;
  var oldCameraPosition = null;
  var oldCameraRotation = null;
  return {
    mount: function (container) {
      camera = context.scene && context.scene.querySelector('[camera]');
      if (camera) {
        oldCameraPosition = camera.getAttribute('position');
        oldCameraRotation = camera.getAttribute('rotation');
        camera.setAttribute('position', '0 1.72 0.80');
        camera.setAttribute('rotation', '8 0 0');
      }
      root = window.SimulatorHub.Models.create(context);
      container.append(root);
      unbindInteractions = window.SimulatorHub.Interactions.bind(root, context);
    },
    unmount: function () {
      if (unbindInteractions) unbindInteractions();
      if (root) root.remove();
      if (camera && oldCameraPosition) camera.setAttribute('position', oldCameraPosition);
      if (camera && oldCameraRotation) camera.setAttribute('rotation', oldCameraRotation);
      unbindInteractions = null;
      root = null;
      camera = null;
      oldCameraPosition = null;
      oldCameraRotation = null;
    }
  };
};
