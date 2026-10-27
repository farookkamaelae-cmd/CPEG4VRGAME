// HUB / 3D MODELS
// Edit the Main Hub's room shell, furniture, computer setup, shelves, and room portals here.
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
    box(room, '0 -.12 -1', [16, .2, 16], '#263445');
    box(room, '0 3.1 -6.5', [16, 6.2, .18], '#172033');
    box(room, '-7.85 2.2 -1', [.18, 4.6, 11], '#1b2940');
    box(room, '7.85 2.2 -1', [.18, 4.6, 11], '#1b2940');
    box(room, '0 .18 -6.37', [14, .04, .04], '#22d3ee');
    text(room, context.i18n.t('hub.title'), '-3 4.2 -6.2', 6, '#e0f2fe');
    text(room, context.i18n.t('hub.instructions'), '-3 3.75 -6.2', 6, '#7dd3fc');

    // Desk, monitor, keyboard, computer tower, chair, and shelf.
    box(room, '0 1.5 -1.8', [5.5, .18, 2.3], '#17212f');
    [-2.1, 2.1].forEach(function (x) {
      var leg = box(room, x + ' .78 -1.8', [.12, 1.45, .12], '#111827');
      leg.setAttribute('rotation', '0 0 ' + (x < 0 ? -10 : 10));
      var cross = box(room, x + ' .76 -1.8', [.11, 1.8, .11], '#0f172a');
      cross.setAttribute('rotation', '0 0 ' + (x < 0 ? 52 : -52));
    });
    box(room, '0 2.55 -2.35', [2.15, 1.25, .12], '#080d17');
    box(room, '0 2.55 -2.27', [1.95, 1.04, .025], '#0b4960');
    text(room, 'CPE / SYSTEM LAB', '-.8 2.55 -2.23', 1.6, '#a5f3fc');
    box(room, '0 1.64 -.85', [1.48, .055, .48], '#0b1220');
    for (var r = 0; r < 3; r++) for (var c = 0; c < 10; c++) {
      box(room, (-.62 + c * .137) + ' 1.677 ' + (-.99 + r * .13), [.095, .018, .07], (r + c) % 4 ? '#334155' : '#22d3ee');
    }
    box(room, '1.95 .62 -1.85', [.72, 1.18, .72], '#101827');
    box(room, '1.95 .62 -1.45', [.5, 1, .025], '#164e63');
    box(room, '0 .9 1.05', [.85, .18, .78], '#111827');
    box(room, '0 1.52 1.4', [.9, 1.05, .2], '#1e293b');
    box(room, '-5.25 3.05 -5.85', [2.45, .09, .58], '#334155');
    for (var i = 0; i < 5; i++) {
      box(room, (-6.1 + i * .28) + ' 3.38 -5.82', [.18, .5 + (i % 2) * .12, .25], ['#8b5cf6', '#0ea5e9', '#f97316', '#10b981', '#ec4899'][i]);
    }

    roomDefinitions.forEach(function (definition, index) {
      var roomId = definition.id;
      var x = (index - 1) * 3.2;
      var portal = node('a-entity', { position: x + ' 0 -5' });
      var frame = box(portal, '0 1.2 0', [1.55, 2.4, .12], '#0b1222');
      frame.dataset.room = roomId;
      var face = box(portal, '0 1.2 .08', [1.62, 2.48, .035], definition.color, 'selectable');
      face.dataset.room = roomId;
      text(portal, context.i18n.t(definition.hubKey), '-.67 1.3 .12', 1.35, '#fff');
      text(portal, 'เข้า', '-.25 .8 .12', .5, definition.color);
      room.append(portal);
    });
    return room;
  }
};

