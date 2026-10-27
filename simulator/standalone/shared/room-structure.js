// SHARED ROOM STRUCTURE
// Interior size: 8 m x 8 m; wall height: 8 m. The floor is at y=0.
// All room shells use the same dimensions so teams can build against a stable scale.
window.SimulatorRoomStructure = {
  dimensions: Object.freeze({ width: 8, depth: 8, height: 8 }),
  create: function (roomId) {
    function box(parent, position, width, height, depth, color) {
      var element = document.createElement('a-box');
      element.setAttribute('position', position);
      element.setAttribute('width', width);
      element.setAttribute('height', height);
      element.setAttribute('depth', depth);
      element.setAttribute('color', color);
      element.setAttribute('material', 'roughness: 0.92; metalness: 0.02');
      parent.append(element);
      return element;
    }

    var shell = document.createElement('a-entity');
    shell.dataset.roomStructure = roomId;
    // Floor surface at y=0; interior spans x/z from -4 m to +4 m.
    box(shell, '0 -0.12 0', 8, 0.24, 8, '#263445');
    // Four walls enclose the 8 m x 8 m interior with an 8 m clear height.
    box(shell, '0 4 -4.06', 8.12, 8, 0.12, '#172033');
    box(shell, '0 4 4.06', 8.12, 8, 0.12, '#172033');
    box(shell, '-4.06 4 0', 0.12, 8, 8, '#1b2940');
    box(shell, '4.06 4 0', 0.12, 8, 8, '#1b2940');
    // Ceiling underside at y=8 m.
    box(shell, '0 8.06 0', 8, 0.12, 8, '#101827');
    // Shared cyan accent line on the rear wall.
    box(shell, '0 0.18 -3.98', 7.4, 0.035, 0.025, '#22d3ee');
    return shell;
  }
};
