// HUB / 3D MODELS
// Edit Hub furniture, computer setup, decorations, and room portals here.
// The floor, walls, ceiling, and common room scale come from shared/room-structure.js.
window.SimulatorHub = window.SimulatorHub || {};
window.SimulatorHub.Models = {
  create: function (context) {
    var roomDefinitions = context.navigation.listRooms();
    function node(tag, attrs) {
      var item = document.createElement(tag);
      Object.keys(attrs || {}).forEach(function (key) { item.setAttribute(key, attrs[key]); });
      return item;
    }
    function box(parent, pos, size, color, className) {
      var attrs = { position: pos, width: size[0], height: size[1], depth: size[2], color: color };
      if (className) attrs.class = className;
      var item = node('a-box', attrs);
      parent.append(item);
      return item;
    }
    function text(parent, value, pos, width, color) {
      var item = node('a-text', { value: value, position: pos, width: width, align: 'center', color: color || '#fff' });
      parent.append(item);
      return item;
    }

    var room = node('a-entity', { 'data-hub-root': '' });
    text(room, context.i18n.t('hub.title'), '-2.5 6.5 -3.9', 5, '#e0f2fe');
    text(room, context.i18n.t('hub.instructions'), '-2.5 6.08 -3.9', 5, '#7dd3fc');

    // Three room portals fit along the rear wall inside the shared 8 m x 8 m shell.
    roomDefinitions.forEach(function (definition, index) {
      var x = (index - 1) * 2.35;
      var portal = node('a-entity', { position: x + ' 0 -3.78' });
      var frame = box(portal, '0 3.8 0', [1.4, 2.45, .13], '#0b1222');
      frame.dataset.room = definition.id;
      var face = box(portal, '0 3.8 .075', [1.46, 2.5, .035], definition.color, 'selectable');
      face.dataset.room = definition.id;
      text(portal, context.i18n.t(definition.hubKey), '-.62 4.05 .11', 1.24, '#fff');
      text(portal, 'เข้า', '-.2 3.05 .11', .4, '#fff');
      room.append(portal);
    });

    // Desk and computer workstation.
    box(room, '0 1.22 -.8', [3.8, .16, 1.5], '#17212f');
    [-1.48, 1.48].forEach(function (x) {
      box(room, x + ' .61 -.8', [.12, 1.12, .12], '#111827');
      var brace = box(room, x + ' .58 -.8', [.1, 1.35, .1], '#0f172a');
      brace.setAttribute('rotation', '0 0 ' + (x < 0 ? 45 : -45));
    });
    box(room, '0 1.92 -1.35', [1.72, 1.02, .12], '#080d17');
    box(room, '0 1.92 -1.27', [1.54, .82, .025], '#0b4960');
    text(room, 'CPE / SYSTEM LAB', '-.67 1.91 -1.23', 1.34, '#a5f3fc');
    box(room, '0 1.33 -.34', [1.25, .045, .42], '#0b1220');
    for (var row = 0; row < 3; row++) for (var col = 0; col < 9; col++) {
      box(room, (-.52 + col * .13) + ' 1.36 ' + (-.47 + row * .11), [.085, .016, .065], (row + col) % 4 ? '#334155' : '#22d3ee');
    }
    box(room, '1.62 .58 -.86', [.58, 1.1, .62], '#101827');
    box(room, '1.62 .58 -.52', [.4, .9, .025], '#164e63');

    // Chair and a compact wall shelf.
    box(room, '-2 .55 .45', [.78, .16, .72], '#111827');
    box(room, '-2 1.15 .75', [.82, 1.05, .16], '#1e293b');
    box(room, '-3.02 2.75 -3.35', [1.45, .09, .48], '#334155');
    for (var item = 0; item < 4; item++) {
      box(room, (-3.52 + item * .3) + ' 3.08 -3.34', [.18, .48 + (item % 2) * .1, .23], ['#8b5cf6', '#0ea5e9', '#f97316', '#10b981'][item]);
    }

    return room;
  }
};

