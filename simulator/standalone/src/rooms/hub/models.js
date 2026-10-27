// Main Hub: a rectangular computer lab with an open path to three rooms.
window.SimulatorHub = window.SimulatorHub || {};
window.SimulatorHub.Models = {
  create: function (context) {
    function make(tag, attrs, parent) {
      var el = document.createElement(tag);
      Object.keys(attrs || {}).forEach(function (key) { el.setAttribute(key, attrs[key]); });
      if (parent) parent.appendChild(el);
      return el;
    }
    function box(parent, position, size, color, extra) {
      return make('a-box', Object.assign({
        position: position, width: size[0], height: size[1], depth: size[2],
        material: 'color: ' + color + '; roughness: 0.8'
      }, extra || {}), parent);
    }
    function glow(parent, position, size, color) {
      return box(parent, position, size, color, {
        material: 'color: ' + color + '; emissive: ' + color + '; emissiveIntensity: 0.45'
      });
    }
    function label(parent, value, position, width, height, color) {
      // The built-in A-Frame font has no Thai glyphs, so draw labels with system fonts.
      var canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 192;
      var ctx = canvas.getContext('2d');
      var size = 112;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      do {
        ctx.font = 'bold ' + size + 'px "Segoe UI", "Noto Sans Thai", sans-serif';
        if (ctx.measureText(value).width <= 930) break;
        size -= 3;
      } while (size > 30);
      ctx.fillStyle = color || '#ffffff';
      ctx.fillText(value, 512, 96);
      return make('a-plane', {
        position: position, width: width, height: height,
        material: { src: canvas.toDataURL('image/png'), transparent: true, shader: 'flat', side: 'double' }
      }, parent);
    }
    function portal(parent, definition, x) {
      var group = make('a-entity', { position: x + ' 0 -6.27' }, parent);
      var color = definition.color;
      box(group, '0 1.48 -0.04', [2.12, 3.05, 0.2], '#091420');
      box(group, '0 1.39 0.08', [1.73, 2.75, 0.07], '#20384d');
      box(group, '0 1.34 0.13', [1.51, 2.56, 0.035], '#102131', {
        class: 'selectable', 'data-room': definition.id
      });
      glow(group, '-0.82 1.4 0.16', [0.09, 2.65, 0.055], color);
      glow(group, '0.82 1.4 0.16', [0.09, 2.65, 0.055], color);
      glow(group, '0 2.75 0.16', [1.73, 0.09, 0.055], color);
      glow(group, '0 0.08 0.18', [1.82, 0.055, 0.12], color);
      box(group, '0 3.28 0.06', [2.45, 0.52, 0.18], '#263b50');
      label(group, context.i18n.t(definition.hubKey), '0 3.27 0.17', 2.13, 0.43, '#ecfaff');
      label(group, context.i18n.t('hub.enter'), '0 1.35 0.165', 0.62, 0.27, color);
      make('a-ring', {
        position: '0 1.83 0.165', 'radius-inner': 0.17, 'radius-outer': 0.20,
        material: 'color: ' + color + '; emissive: ' + color + '; emissiveIntensity: 0.4'
      }, group);
      return group;
    }

    var room = make('a-entity', { 'data-hub-root': '' });
    // Room shell and a framed back wall.
    box(room, '0 -0.15 -1', [16, 0.3, 15], '#263a50');
    box(room, '0 2.7 -6.55', [16, 5.4, 0.22], '#17283e');
    box(room, '-7.9 2.7 -1', [0.2, 5.4, 11.2], '#1b3049');
    box(room, '7.9 2.7 -1', [0.2, 5.4, 11.2], '#1b3049');
    box(room, '0 5.42 -1', [16, 0.2, 15], '#0d1b2d');
    box(room, '0 4.15 -6.39', [14.6, 1.12, 0.035], '#20364e');
    label(room, context.i18n.t('hub.title'), '0 4.37 -6.34', 7.2, 0.53, '#edf8ff');
    label(room, context.i18n.t('hub.instructions'), '0 3.91 -6.34', 5.6, 0.38, '#a9d5e7');
    glow(room, '0 3.56 -6.33', [13.9, 0.045, 0.045], '#38b9d6');

    // Floor lanes guide the eye toward the doors without blocking movement.
    for (var i = -3; i <= 3; i++) {
      box(room, (i * 2.0) + ' 0.008 -1', [0.018, 0.012, 10.2], '#39516b');
    }
    for (var j = -4; j <= 3; j++) {
      box(room, '0 0.009 ' + j, [14.5, 0.012, 0.018], '#39516b');
    }
    glow(room, '-1.2 0.02 -0.7', [0.025, 0.012, 9.7], '#2a8cab');
    glow(room, '1.2 0.02 -0.7', [0.025, 0.012, 9.7], '#2a8cab');
    glow(room, '0 0.02 3.55', [2.45, 0.018, 0.055], '#55c8e6');
    for (var n = 0; n < 3; n++) {
      var lx = (n - 1) * 4.1;
      glow(room, lx + ' 5.28 -2', [2.15, 0.045, 3.65], '#8cc9df');
      box(room, lx + ' 5.13 -2', [2.4, 0.06, 3.9], '#263e52');
    }

    context.navigation.listRooms().forEach(function (definition, index) {
      portal(room, definition, (index - 1) * 3.9);
      glow(room, ((index - 1) * 3.9) + ' 0.018 -5.67',
        [2.0, 0.015, 0.65], definition.color);
    });

    // The original desk, display, keyboard, tower and chair now form a side workstation.
    var desk = make('a-entity', { position: '5.45 0 0.8', rotation: '0 -24 0' }, room);
    box(desk, '0 0.88 0', [3.35, 0.14, 1.4], '#40536a');
    box(desk, '0 0.97 0', [3.4, 0.045, 1.43], '#7694a5');
    box(desk, '-1.4 0.44 0', [0.11, 0.85, 1.14], '#26384c');
    box(desk, '1.4 0.44 0', [0.11, 0.85, 1.14], '#26384c');
    box(desk, '0 1.71 -0.38', [1.74, 1.12, 0.1], '#091521');
    box(desk, '0 1.71 -0.305', [1.58, 0.96, 0.02], '#124e68', {
      material: 'color: #124e68; emissive: #176b88; emissiveIntensity: 0.32'
    });
    label(desk, 'CPE SYSTEM LAB', '0 1.72 -0.29', 1.4, 0.27, '#d2f8ff');
    box(desk, '0 1.12 -0.38', [0.11, 0.3, 0.11], '#152436');
    box(desk, '0 1.04 -0.38', [0.5, 0.04, 0.32], '#152436');
    box(desk, '0 1.02 0.37', [1.35, 0.045, 0.36], '#17283a');
    for (var row = 0; row < 3; row++) {
      for (var col = 0; col < 9; col++) {
        box(desk, (-0.55 + col * 0.14) + ' 1.05 ' + (0.27 + row * 0.1),
          [0.09, 0.015, 0.055], (col + row) % 7 ? '#5b7487' : '#4cd1e5');
      }
    }
    box(desk, '1.09 0.38 -0.38', [0.45, 0.72, 0.55], '#101d2d');
    glow(desk, '1.09 0.37 -0.088', [0.17, 0.19, 0.015], '#53bdd5');
    var chair = make('a-entity', { position: '5.35 0 2.6', rotation: '0 -24 0' }, room);
    box(chair, '0 0.48 0', [0.75, 0.12, 0.72], '#203448');
    box(chair, '0 0.95 0.32', [0.76, 0.86, 0.12], '#2c4258');
    box(chair, '0 0.22 0', [0.09, 0.45, 0.09], '#17283a');
    box(chair, '0 0.06 0', [0.85, 0.08, 0.12], '#17283a');

    // Bookshelf on the left keeps the original classroom character.
    box(room, '-6.35 1.45 -3.6', [2.25, 2.85, 0.5], '#30455a');
    for (var shelf = 0; shelf < 3; shelf++) {
      box(room, '-6.35 ' + (0.55 + shelf * 0.8) + ' -3.26',
        [2.03, 0.08, 0.58], '#7191a1');
    }
    var bookColors = ['#6db7d1', '#8b78c8', '#df9965', '#66b99d', '#d778a7'];
    for (var b = 0; b < 10; b++) {
      box(room, (-7.21 + b * 0.19) + ' ' + (0.96 + (b % 2) * 0.8) + ' -3.19',
        [0.13, 0.58, 0.31], bookColors[b % bookColors.length]);
    }
    make('a-entity', {
      light: 'type: point; color: #bcecff; intensity: 0.45; distance: 13',
      position: '0 4.7 -2'
    }, room);
    return room;
  }
};

