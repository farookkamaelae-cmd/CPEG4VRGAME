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
    cylinder(root, '0 -.08 0', 8.8, .18, '#2e4058');
    cylinder(root, '0 5.95 0', 8.8, .16, '#122237');
    cylinder(root, '0 3.0 0', 8.75, 6, '#1e3550', { 'open-ended': true, 'segments-radial': 28, 'theta-start': 0, 'theta-length': 360 });
    cylinder(root, '0 3.0 0', 8.7, 5.95, '#294867', { 'open-ended': true, 'segments-radial': 28, 'theta-start': 15, 'theta-length': 110, scale: '1 1 .998' });
    cylinder(root, '0 3.0 0', 8.7, 5.95, '#294867', { 'open-ended': true, 'segments-radial': 28, 'theta-start': 135, 'theta-length': 110, scale: '1 1 .998' });
    cylinder(root, '0 3.0 0', 8.7, 5.95, '#294867', { 'open-ended': true, 'segments-radial': 28, 'theta-start': 255, 'theta-length': 110, scale: '1 1 .998' });

    [0, 120, 240].forEach(function (deg) {
      var r = deg * Math.PI / 180;
      box(root, (Math.sin(r) * 3.5).toFixed(3) + ' 5.82 ' + (-Math.cos(r) * 3.5).toFixed(3), [1.8, .04, 1.3], '#d9f8ff', {
        rotation: '0 ' + deg + ' 0',
        material: 'color:#d9f8ff; emissive:#c0eeff; emissiveIntensity:.55'
      });
    });

    cylinder(root, '0 .02 0', 1.6, .06, '#19354c');
    cylinder(root, '0 .06 0', 1.72, .03, '#3be5f1', { material: 'color:#3be5f1; emissive:#2ab8c9; emissiveIntensity:.5' });
    label(root, 'LEARNING HUB', '-1.3 .18 .08', 2.6, '#c8f4ff');
    label(root, 'มองไปรอบตัว แล้วเลือกมุมที่ต้องการเรียนรู้', '0 .18 -.28', 4.0, '#e7f3fa');

    [0, 120, 240].forEach(function (deg) {
      var rr = deg * Math.PI / 180;
      box(root, (Math.sin(rr) * 3.35).toFixed(3) + ' -.003 ' + (-Math.cos(rr) * 3.35).toFixed(3), [.012, .012, 3.1], '#5b7c94', { rotation: '0 ' + deg + ' 0' });
    });

    [60, 180, 300].forEach(function (deg) {
      var r = deg * Math.PI / 180;
      var x = Math.sin(r) * 6.5;
      var z = -Math.cos(r) * 6.5;
      cylinder(root, x.toFixed(3) + ' .32 ' + z.toFixed(3), .36, .62, '#0f2435');
      for (var n = 0; n < 5; n++) {
        box(root, (x + (n - 2) * .08).toFixed(3) + ' .95 ' + z.toFixed(3), [.06, .72, .05], '#1ca585', { rotation: '0 0 ' + ((n - 2) * 10) });
      }
    });

    function station(zone, pos, rot, color, title, tagline) {
      var s = entity(root, pos, rot);
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

    var h = station('hardware', '-5.05 0 -2.35', '0 52 0', '#24d6bd', 'HARDWARE', '7 COMPUTER COMPONENTS');
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

    var nw = station('network', '0 0 -3.88', '0 0 0', '#f5c44e', 'LAN NETWORK', 'TOOLS / RJ45 / T568B');
    for (i = 0; i < 8; i++) {
      box(nw, (-1.48 + i * .42) + ' 1.72 -.78', [.19, .82, .11], ['#ffecd9', '#ff983a', '#defef1', '#3579ce', '#dceeff', '#33c371', '#fff2eb', '#87522c'][i]);
    }
    for (i = 0; i < 3; i++) el('a-torus', { position: (-1.15 + i * .12) + ' 1.15 -.15', rotation: '90 0 0', radius: .27, 'radius-tubular': .035, color: '#31bbf5' }, nw);
    box(nw, '.08 1.16 -.16', [.58, .21, .26], '#ebf4fb');
    box(nw, '1.22 1.17 -.18', [.52, .2, .36], '#172c43');
    box(nw, '1.39 1.30 -.15', [.26, .09, .36], '#4a5d71');
    for (i = 0; i < 5; i++) box(nw, (1.03 + i * .09) + ' 1.21 .01', [.035, .025, .02], '#77d8aa');
    label(nw, 'T568B COLOR ORDER', '0 2.44 -.88', 3.5, '#ffe7ab');

    var p = station('programming', '5.05 0 -2.35', '0 -52 0', '#b182f3', 'PROGRAMMING', 'PYTHON / C++ / JAVA');
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
    // Atmospheric, non-interactive learning-room props (lightweight geometry)
    // --------------------------------------------------------------------
    // Panoramic windows on the rear arc, with visible frames, sill and skyline.
    function windowModule(x, z, yaw) {
      var w = entity(root, x + ' 0 ' + z, '0 ' + yaw + ' 0');
      box(w, '0 3.15 0', [2.25, 1.75, .10], '#0b1d32');
      box(w, '0 3.15 .07', [2.07, 1.57, .018], '#4b92b4', { material: 'color:#4b92b4; emissive:#17435a; emissiveIntensity:.12' });
      // window reflection and distant skyline
      box(w, '-.64 3.32 .086', [.26, 1.12, .008], '#6cb4cf');
      box(w, '.40 2.63 .086', [.49, .40, .008], '#26465f');
      box(w, '-.17 2.69 .086', [.48, .27, .008], '#2a506b');
      box(w, '0 3.15 .12', [.09, 1.83, .14], '#d1e2ed');
      box(w, '0 4.06 .12', [2.4, .10, .16], '#d1e2ed');
      box(w, '0 2.25 .14', [2.4, .13, .25], '#b2cddd');
      box(w, '-1.13 3.15 .11', [.10, 1.8, .15], '#d1e2ed');
      box(w, '1.13 3.15 .11', [.10, 1.8, .15], '#d1e2ed');
    }
    // Windows are spaced between stations; they do not obscure the teaching boards.
    windowModule(-6.9, 2.5, 125);
    windowModule(6.9, 2.5, -125);
    windowModule(0, 7.8, 180);

    // Printable study handouts lying on each physical table.
    function studyPaper(station, x, z, stripeColor) {
      var sheet = entity(station, x + ' 1.105 ' + z);
      box(sheet, '0 0 0', [.67, .014, .47], '#f4f6f3');
      box(sheet, '-.19 .009 -.13', [.21, .002, .022], stripeColor);
      for (var n=0; n<4; n++) {
        box(sheet, '.045 .009 ' + (-.10 + .075*n).toFixed(3), [.46, .002, .016], '#a1b6c5');
      }
      box(sheet, '-.14 .009 .16', [.27, .002, .045], '#90adc0');
    }
    studyPaper(h, -1.02, .35, '#17a99b');
    studyPaper(nw, .15, .35, '#e2a535');
    studyPaper(p, 1.26, .35, '#9b6de0');

    // Subtle whiteboard/notice panels alongside each learning station.
    function noticePanel(station, x, color, heading, detail) {
      box(station, x + ' 2.32 -.84', [.76, .85, .045], '#e4eaf0');
      box(station, x + ' 2.64 -.81', [.66, .14, .012], color);
      label(station, heading, x + ' 2.615 -.79', .58, '#091a2e');
      label(station, detail, x + ' 2.31 -.79', .62, '#18324b');
      for (var n=0; n<3; n++) box(station, x + ' ' + (2.12+n*.08) + ' -.806', [.52, .015, .006], '#8b9dac');
    }
    noticePanel(h, -1.86, '#50dfc9', 'PARTS', 'PC 101');
    noticePanel(nw, -1.86, '#f4c44b', 'T568B', 'CABLE');
    noticePanel(p, -1.86, '#bd91ff', 'CODE', 'HELLO');

    // Wall accent lighting and information plinth to make the venue feel complete.
    cylinder(root, '0 .16 6.5', .86, .31, '#273d53');
    cylinder(root, '0 .34 6.5', .66, .055, '#61d4ed', {material:'color:#61d4ed; emissive:#3297ac; emissiveIntensity:.28'});
    label(root, 'COMPUTER ENGINEERING', '0 .39 6.5', 2.1, '#12293a');

    // Additional classroom props: cabinets, study references, stools and wall panels.
    function stool(parent, x, z) {
      var g = entity(parent, x + ' 0 ' + z);
      cylinder(g, '0 .51 0', .35, .11, '#58748c');
      cylinder(g, '0 .28 0', .055, .45, '#b1c7d6');
      cylinder(g, '0 .055 0', .27, .08, '#20394e');
    }
    stool(h, -1.35, 1.72); stool(h, 1.35, 1.72);
    stool(nw, -1.35, 1.72); stool(nw, 1.35, 1.72);
    stool(p, -1.35, 1.72); stool(p, 1.35, 1.72);

    function supplies(parent, color) {
      // Small shelf on side of the station and labeled storage bins.
      box(parent, '1.65 2.44 -.76', [.78, .07, .27], '#a7c1d2');
      for (var i=0; i<3; i++) {
        box(parent, (1.42 + i*.24).toFixed(2)+' 2.57 -.75', [.17, .22, .19], i===1 ? color : '#c4d3df');
      }
      // Tablet, pen, desk lamp and stacked notebooks.
      box(parent, '.84 1.12 .33', [.36, .035, .24], '#18334b');
      box(parent, '.84 1.14 .33', [.29, .006, .18], '#62bdd4');
      for (var j=0;j<3;j++) box(parent, '1.35 '+(1.11+j*.045).toFixed(3)+' .49', [.44, .042, .34], j===1?'#f2d789':'#d7e6ef');
      cylinder(parent, '-.08 1.15 .38', .12, .055, '#283d51');
      cylinder(parent, '-.08 1.37 .38', .025, .43, '#c1d2dd');
      box(parent, '-.08 1.61 .36', [.36, .12, .18], '#a3e3ee', {rotation:'20 0 0'});
      // Identification cards neatly in front of the props.
      box(parent, '-1.13 1.11 -.26', [.62, .018, .24], '#f1f5fa');
      box(parent, '-1.13 1.122 -.35', [.47, .004, .026], color);
    }
    supplies(h, '#24d6bd'); supplies(nw, '#f5c44e'); supplies(p, '#b182f3');

    function wallDisplay(x, z, yaw, title, accent) {
      var g = entity(root, x+' 0 '+z, '0 '+yaw+' 0');
      box(g, '0 2.95 0', [2.0, 1.20, .09], '#081e32');
      box(g, '0 3.46 .055', [1.90, .11, .025], accent);
      label(g, title, '0 3.12 .065', 1.72, '#edfaff');
      for (var k=0;k<5;k++) box(g, (-.65+k*.30)+' 2.75 .065', [.22,.07,.012], k%2 ? '#77abc5':accent);
    }
    wallDisplay(-7.4, -1.0, 65, 'HARDWARE LAB', '#24d6bd');
    wallDisplay(7.4, -1.0, -65, 'PROGRAMMING LAB', '#b182f3');
    wallDisplay(0, -8.25, 0, 'NETWORK LAB', '#f5c44e');
    // Freestanding information columns in unused gaps, away from buttons.
    [-6.7, 6.7].forEach(function(x) {
      cylinder(root, x+' .55 4.4', .28, 1.1, '#203a52');
      box(root, x+' 1.25 4.4', [.56, .42, .10], '#397b9b');
      box(root, x+' 1.54 4.4', [.65, .07, .12], '#a1e4ee');
    });
    return root;
  }
};
