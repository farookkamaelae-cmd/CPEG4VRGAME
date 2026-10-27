// HUB / 3D MODELS
window.SimulatorHub = window.SimulatorHub || {};
window.SimulatorHub.Models = {
  create: function () {
    function el(tag, attrs, parent) {
      var node = document.createElement(tag);
      Object.keys(attrs || {}).forEach(function (key) { node.setAttribute(key, attrs[key]); });
      if (parent) parent.appendChild(node);
      return node;
    }
    function entity(parent, pos, rot) {
      var attrs = { position: pos };
      if (rot) attrs.rotation = rot;
      return el('a-entity', attrs, parent);
    }
    function box(parent, pos, size, color, extra) {
      var attrs = { position: pos, width: size[0], height: size[1], depth: size[2], color: color };
      Object.keys(extra || {}).forEach(function (key) { attrs[key] = extra[key]; });
      return el('a-box', attrs, parent);
    }
    function cylinder(parent, pos, radius, height, color, extra) {
      var attrs = { position: pos, radius: radius, height: height, color: color };
      Object.keys(extra || {}).forEach(function (key) { attrs[key] = extra[key]; });
      return el('a-cylinder', attrs, parent);
    }
    function label(parent, value, pos, width, color, align) {
      return el('a-text', {
        value: value,
        position: pos,
        width: width,
        align: align || 'center',
        color: color || '#ffffff',
        baseline: 'center'
      }, parent);
    }
    function actionButton(parent, posX, posY, posZ, width, color, title, subtitle, action, zone) {
      var g = entity(parent, posX + ' ' + posY + ' ' + posZ);
      box(g, '0 0 0', [width + 0.34, .70, .23], '#081623', {
        material: 'color:#081623; emissive:#06111b; emissiveIntensity:.18',
        class: 'selectable',
        'data-hub-action': action,
        'data-hub-zone': zone
      });
      box(g, '0 0.03 0.05', [width - 0.10, .50, .14], color, {
        material: 'color:' + color + '; emissive:' + color + '; emissiveIntensity:.32',
        class: 'selectable',
        'data-hub-action': action,
        'data-hub-zone': zone
      });
      cylinder(g, (-width / 2 + 0.08) + ' 0.03 0.05', .25, .14, color, {
        rotation: '90 0 0',
        material: 'color:' + color + '; emissive:' + color + '; emissiveIntensity:.32',
        class: 'selectable',
        'data-hub-action': action,
        'data-hub-zone': zone
      });
      cylinder(g, (width / 2 - 0.08) + ' 0.03 0.05', .25, .14, color, {
        rotation: '90 0 0',
        material: 'color:' + color + '; emissive:' + color + '; emissiveIntensity:.32',
        class: 'selectable',
        'data-hub-action': action,
        'data-hub-zone': zone
      });
      box(g, '0 0.19 0.13', [width - 0.20, .05, .02], '#ffffff', {
        material: 'color:#ffffff; emissive:#ffffff; emissiveIntensity:.18',
        opacity: '.16',
        class: 'selectable',
        'data-hub-action': action,
        'data-hub-zone': zone
      });
      // Single bold black label on bright capsule, placed in front of the geometry.
      // English is intentional: the standard A-Frame bitmap font does not support Thai.
      label(g, action === 'overview' ? 'READ INFO' : 'ENTER LAB', '0 -0.07 0.20', width * 1.90, '#050f18');
      return g;
    }

    var root = el('a-entity', { 'data-hub-root': '' });
    // Shared-team room envelope: exact 8 x 8 footprint, height 8.
    // Safe interior usable bounds: x/z +/-3.9; ceiling at y=8.
    box(root, '0 -.09 0', [8, .18, 8], '#31465d');
    box(root, '0 8.03 0', [8, .10, 8], '#102239');
    box(root, '0 4 -4', [8, 8, .13], '#1b334b');
    box(root, '-4 4 0', [.13, 8, 8], '#28445f');
    box(root, '4 4 0', [.13, 8, 8], '#28445f');
    box(root, '0 4 4', [8, 8, .13], '#243f58');
    // Central arrival marker; subdued to avoid overwhelming the scene.
    cylinder(root, '0 .015 .15', .63, .028, '#27687d', {material:'color:#27687d; emissive:#146177; emissiveIntensity:.15'});
    // Ceiling lighting scaled to the room.
    [-2, 0, 2].forEach(function(x) {
      box(root, x + ' 7.86 -.7', [1.13, .045, 1.25], '#c7f0ff', {material:'color:#c7f0ff; emissive:#b6edfa; emissiveIntensity:.32'});
    });
    // Windows on open wall sections, away from the boards.
    function windowPanel(x, z, yaw) {
      var g = entity(root, x + ' 0 ' + z, '0 ' + yaw + ' 0');
      box(g, '0 4.7 0', [1.32, 1.45, .08], '#0c263b');
      box(g, '0 4.7 .048', [1.15, 1.26, .012], '#528aa9');
      box(g, '0 4.7 .07', [.07, 1.36, .055], '#c5dae5');
      box(g, '0 4.7 .07', [1.23, .07, .055], '#c5dae5');
      box(g, '0 3.94 .08', [1.4, .1, .17], '#aac2d3');
    }
    windowPanel(-3.88, 2.65, 90);
    windowPanel(3.88, 2.65, -90);
    // Rear learning posters and shelving.
    var poster = entity(root, '0 0 3.86', '0 180 0');
    box(poster, '0 4.45 0', [2.1, 1.03, .07], '#e8f0f6');
    box(poster, '0 4.88 .04', [1.95, .13, .02], '#329bb7');
    label(poster, 'COMPUTER ENGINEERING', '0 4.62 .05', 1.77, '#1a364b');
    label(poster, 'HARDWARE  /  LAN  /  CODE', '0 4.36 .05', 1.7, '#2d536e');
    // Cabinets and plants confined to corners.
    [-3.34, 3.34].forEach(function(x) {
      box(root, x + ' .65 3.35', [.66, 1.27, .56], '#1b354a');
      box(root, x + ' .66 3.06', [.48, .9, .02], '#365f75');
      cylinder(root, x + ' 1.48 3.36', .21, .24, '#a7b9c3');
      for(var n=0;n<4;n++) box(root, (x+(n-1.5)*.09)+' 1.81 3.36', [.06,.47,.06], '#31ab85', {rotation:'0 0 '+((n-1.5)*12)});
    });

    function station(zone, pos, rot, color, title, tagline) {
      var s = entity(root, pos, rot);
      s.setAttribute('scale', '0.68 0.77 0.68');
      cylinder(s, '0 .13 0', 2.62, .24, '#1b3149', { segmentsRadial: 6, rotation: '0 30 0' });
      box(s, '0 2.0 -1.02', [4.7, 3.1, .18], '#13243a');
      box(s, '0 3.57 -.90', [4.78, .09, .16], color, { material: 'color:' + color + '; emissive:' + color + '; emissiveIntensity:.35' });
      box(s, '0 1.0 .26', [4.05, .16, 1.28], '#6c8597');
      [-1.68, 1.68].forEach(function (leg) { box(s, leg + ' .54 .26', [.12, .94, .12], '#2b3c51'); });
      label(s, title, '0 3.18 -.89', 4.5, '#f5fbff');
      label(s, tagline, '0 2.86 -.89', 4.2, '#bdd7e5');
      label(s, 'SELECT AN ACTION BELOW', '0 1.02 1.36', 2.4, '#e6f7ff');
      actionButton(s, -1.03, 0.54, 1.27, 1.57, '#0f8fc5', 'อ่านข้อมูล', 'READ INFO', 'overview', zone);
      actionButton(s, 1.03, 0.54, 1.27, 1.57, color, 'เข้าห้องฝึก', 'ENTER LAB', 'enter', zone);
      box(s, '0 .05 1.55', [4.62, .03, .04], color, { material: 'color:' + color + '; emissive:' + color + '; emissiveIntensity:.3' });
      return s;
    }

    var h = station('hardware', '-2.35 0 0.15', '0 76 0', '#24d6bd', 'HARDWARE', '7 COMPUTER COMPONENTS');
    box(h, '-.95 1.62 -.78', [1.95, .92, .09], '#1b7269');
    for (var i = 0; i < 5; i++) box(h, (-1.66 + i * .35) + ' 1.56 -.735', [.03, .67, .025], '#7de5cd');
    box(h, '-1.24 1.64 -.71', [.58, .58, .07], '#b5c7d4');
    box(h, '-.30 1.59 -.70', [.32, .76, .08], '#101a29');
    for (i = 0; i < 3; i++) box(h, (-.51 + i * .15) + ' 1.64 -.645', [.045, .54, .025], '#54c9af');
    box(h, '1.08 1.72 -.78', [1.02, .38, .25], '#182e43');
    [.76, 1.08, 1.40].forEach(function (fx) { el('a-torus', { position: fx + ' 1.72 -.625', radius: .12, 'radius-tubular': .026, rotation: '90 0 0', color: '#88e7fb' }, h); });
    box(h, '1.26 1.22 -.75', [.92, .19, .33], '#8a9bab');
    box(h, '-1.52 1.16 -.48', [.52, .18, .34], '#1d2b3b');
    label(h, 'CPU  RAM  GPU  SSD', '0 2.44 -.88', 3.35, '#c9f6ed');

    var nw = station('network', '0 0 -2.47', '0 0 0', '#f5c44e', 'LAN NETWORK', 'TOOLS / RJ45 / T568B');
    for (i = 0; i < 8; i++) {
      box(nw, (-1.48 + i * .42) + ' 1.72 -.78', [.19, .82, .11], ['#ffecd9', '#ff983a', '#defef1', '#3579ce', '#dceeff', '#33c371', '#fff2eb', '#87522c'][i]);
    }
    for (i = 0; i < 3; i++) el('a-torus', { position: (-1.15 + i * .12) + ' 1.15 -.15', rotation: '90 0 0', radius: .27, 'radius-tubular': .035, color: '#31bbf5' }, nw);
    box(nw, '.08 1.16 -.16', [.58, .21, .26], '#ebf4fb');
    box(nw, '1.22 1.17 -.18', [.52, .2, .36], '#172c43');
    box(nw, '1.39 1.30 -.15', [.26, .09, .36], '#4a5d71');
    for (i = 0; i < 5; i++) box(nw, (1.03 + i * .09) + ' 1.21 .01', [.035, .025, .02], '#77d8aa');
    label(nw, 'T568B COLOR ORDER', '0 2.44 -.88', 3.5, '#ffe7ab');

    var p = station('programming', '2.35 0 0.15', '0 -76 0', '#b182f3', 'PROGRAMMING', 'PYTHON / C++ / JAVA');
    [-1.1, 0, 1.1].forEach(function (mx, idx) {
      box(p, mx + ' 1.95 -.74', [.98, .72, .10], '#09121f');
      box(p, mx + ' 1.95 -.68', [.87, .60, .012], ['#164d68', '#2b3a70', '#1a5658'][idx]);
      box(p, mx + ' 1.36 -.70', [.065, .37, .07], '#4c5a6c');
      box(p, mx + ' 1.17 -.56', [.69, .05, .30], '#6b7d8e');
      label(p, ['Python', 'C++', 'Java'][idx], mx + ' 2.08 -.657', .78, '#eef8ff');
      label(p, ['print()', 'cout <<', 'println()'][idx], mx + ' 1.87 -.657', .78, '#c9f1ff');
    });
    box(p, '0 1.14 .18', [1.18, .055, .36], '#243344');
    for (i = 0; i < 8; i++) box(p, (-.46 + i * .13) + ' 1.18 .16', [.09, .018, .09], i % 3 === 0 ? '#8db3d1' : '#4d6988');
    label(p, 'WRITE  RUN  LEARN', '0 2.54 -.88', 3.55, '#ecd6ff');


    // --------------------------------------------------------------------
    // Compact educational props ON the desks, not outside the bounds.
    function paper(parent,x,z,color) {
      var g=entity(parent,x+' 1.103 '+z);
      box(g,'0 0 0',[.65,.014,.43],'#f4f6fa');
      box(g,'0 .009 -.12',[.50,.004,.045],color);
      for(var k=0;k<4;k++)box(g,'0 .01 '+(-.05+k*.07),[.49,.003,.01],'#9cacc0');
    }
    paper(h,-.95,.28,'#24d6bd'); paper(nw,.65,.25,'#f5c44e'); paper(p,1.15,.22,'#b182f3');
    function stationery(parent,accent) {
      box(parent,'1.44 1.13 .43',[.43,.07,.29],'#d9e5ee');
      box(parent,'1.44 1.17 .43',[.42,.025,.27],accent);
      box(parent,'-1.45 1.16 .42',[.22,.20,.18],'#183647');
      box(parent,'-1.45 1.29 .42',[.04,.24,.035],'#eef6fb');
    }
    stationery(h,'#24d6bd'); stationery(nw,'#f5c44e'); stationery(p,'#b182f3');
    return root;
  }
};
