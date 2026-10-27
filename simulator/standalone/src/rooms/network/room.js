/*
 * LAN NETWORK ROOM
 * File: room.js
 * Computer Networking Practice Room
 */
(function () {
  'use strict';

  window.SimulatorRooms = window.SimulatorRooms || {};

  window.SimulatorRooms.network = function createNetworkRoom(context) {
    context = context || {};

    var data = window.NetworkRoom && window.NetworkRoom.Data;
    var rules = window.NetworkRoom && window.NetworkRoom.Game;

    var root = null;
    var container = null;
    var scene = null;
    var overlay = null;
    var clickHandler = null;
    var mounted = false;
    var alignFrame = null;
    var alignAttempts = 0;
    var state = null;
    var message = '';
    var messageColor = '#93c5fd';
    var slots = [];
    var leds = [];
    var toolNodes = [];
    var heldTool = null;

    var VIEW = {
      eyeHeight: 1.65,
      leftX: -1.45,
      rightX: 1.45,
      sideZ: -0.55,
      frontZ: -1.48,
      tableHeight: 0.78
    };

    var FALLBACK_PREP = [
      {
        title: '1. วัดและตัดสาย',
        description: 'ใช้คีมตัดสาย LAN ให้ปลายเรียบ',
        tool: 'cutter'
      },
      {
        title: '2. ปอกเปลือกสาย',
        description: 'ใช้เครื่องมือปอกเปลือกนอกอย่างระมัดระวัง',
        tool: 'stripper'
      },
      {
        title: '3. คลายเกลียวและจัดสาย',
        description: 'แยกสายและจัดเรียงตามมาตรฐาน T568B',
        tool: 'lan'
      },
      {
        title: '4. ตัดปลายให้เสมอกัน',
        description: 'เตรียมปลายสายก่อนใส่หัว RJ45',
        tool: 'stripped'
      }
    ];

    var FALLBACK_TERMINATION = [
      {
        title: '1. ใส่ปลอกสาย',
        description: 'สวมปลอกสายก่อนเข้าหัว RJ45',
        tool: 'sleeve'
      },
      {
        title: '2. ใส่หัว RJ45',
        description: 'สอดสายทั้ง 8 เส้นเข้าในหัว RJ45',
        tool: 'rj45'
      },
      {
        title: '3. ใช้คีมเข้าหัว',
        description: 'จำลองการหนีบหัว RJ45 ให้แน่น',
        tool: 'crimper'
      }
    ];

    var DEFAULT_ORDER = [
      'white-orange',
      'orange',
      'white-green',
      'blue',
      'white-blue',
      'green',
      'white-brown',
      'brown'
    ];

    function add(parent, tag, attrs) {
      var node = document.createElement(tag);

      Object.keys(attrs || {}).forEach(function (key) {
        node.setAttribute(key, attrs[key]);
      });

      if (parent) {
        parent.appendChild(node);
      }

      return node;
    }

    function box(parent, pos, size, color, attrs) {
      return add(
        parent,
        'a-box',
        Object.assign(
          {
            position: pos,
            width: size[0],
            height: size[1],
            depth: size[2],
            material: {
              color: color,
              roughness: 0.65
            }
          },
          attrs || {}
        )
      );
    }

    function label(parent, value, pos, width, color) {
      return add(parent, 'a-text', {
        value: value,
        position: pos,
        width: width || 2,
        align: 'center',
        color: color || '#ffffff',
        side: 'double'
      });
    }

    function emit(name, detail) {
      if (typeof context.emit === 'function') {
        try {
          context.emit(name, detail || {});
        } catch (error) {
          console.warn('Network emit failed:', error);
        }
      }
    }

    function getPrepSteps() {
      return data && Array.isArray(data.preparationSteps)
        ? data.preparationSteps
        : FALLBACK_PREP;
    }

    function getTerminationSteps() {
      return data && Array.isArray(data.terminationSteps)
        ? data.terminationSteps
        : FALLBACK_TERMINATION;
    }

    function getCorrectOrder() {
      return data && Array.isArray(data.correctOrder)
        ? data.correctOrder
        : DEFAULT_ORDER;
    }

    function getWires() {
      return data && Array.isArray(data.wires)
        ? data.wires
        : [];
    }

    function isToolCorrect(selected, expected) {
      if (
        rules &&
        typeof rules.isToolCorrect === 'function'
      ) {
        return rules.isToolCorrect(selected, expected);
      }

      return selected === expected;
    }

    function isWireOrderCorrect(order) {
      if (rules && typeof rules.isCorrect === 'function') {
        return rules.isCorrect(order, getCorrectOrder());
      }

      var correctOrder = getCorrectOrder();

      return (
        order.length === correctOrder.length &&
        order.every(function (id, index) {
          return id === correctOrder[index];
        })
      );
    }

    function getWire(id) {
      return (
        getWires().find(function (wire) {
          return wire.id === id;
        }) || null
      );
    }

    function getWireLabel(id) {
      var wire = getWire(id);
      return wire ? wire.label : id;
    }

    function getInitialState() {
      if (rules && typeof rules.getInitialState === 'function') {
        var initial = rules.getInitialState();

        if (initial) {
          return initial;
        }
      }

      return {
        station: 1,
        passed: [false, false, false],
        score: 0,
        errors: 0,
        prepIndex: 0,
        selectedWires: [],
        wiresChecked: false,
        terminationIndex: 0,
        cableConnected: false,
        testerStarted: false,
        testerIndex: 0,
        testAnswered: false
      };
    }

    function award(correct) {
      if (correct) {
        state.score += 1;
      } else {
        state.errors += 1;
      }

      try {
        if (
          context.session &&
          typeof context.session.get === 'function' &&
          typeof context.session.update === 'function'
        ) {
          var current = context.session.get() || {};

          if (
            rules &&
            typeof rules.getScorePatch === 'function'
          ) {
            context.session.update(
              rules.getScorePatch(current, correct)
            );
          } else {
            context.session.update({
              score:
                (current.score || 0) +
                (correct ? 1 : 0),
              errors:
                (current.errors || 0) +
                (correct ? 0 : 1)
            });
          }
        }
      } catch (error) {
        console.warn('Network score update failed:', error);
      }

      emit('network:activity-result', {
        station: state.station,
        correct: correct,
        score: state.score,
        errors: state.errors
      });
    }

    function notify(text, color) {
      message = text;
      messageColor = color || '#93c5fd';
      renderPanel();
    }

    function getCamera() {
      if (scene && scene.camera) {
        return scene.camera;
      }

      var cameraEl = document.querySelector(
        'a-camera, a-entity[camera]'
      );

      return cameraEl && cameraEl.getObject3D
        ? cameraEl.getObject3D('camera')
        : null;
    }

    function alignToCamera() {
      if (
        !root ||
        !root.object3D ||
        !root.object3D.parent ||
        !window.AFRAME ||
        !window.AFRAME.THREE
      ) {
        return false;
      }

      var camera = getCamera();

      if (!camera) {
        return false;
      }

      var THREE = window.AFRAME.THREE;
      var parent = root.object3D.parent;

      if (scene && scene.object3D) {
        scene.object3D.updateMatrixWorld(true);
      }

      parent.updateMatrixWorld(true);
      camera.updateMatrixWorld(true);

      var worldPosition = new THREE.Vector3();
      camera.getWorldPosition(worldPosition);

      var localPosition = parent.worldToLocal(
        worldPosition.clone()
      );

      var forward = new THREE.Vector3();
      camera.getWorldDirection(forward);

      var parentQuaternion = new THREE.Quaternion();
      parent.getWorldQuaternion(parentQuaternion);
      parentQuaternion.invert();

      forward.applyQuaternion(parentQuaternion);
      forward.y = 0;

      if (forward.lengthSq() < 0.001) {
        forward.set(0, 0, -1);
      }

      forward.normalize();

      var yaw = Math.atan2(-forward.x, -forward.z);

      root.object3D.position.set(
        localPosition.x,
        localPosition.y - VIEW.eyeHeight,
        localPosition.z
      );

      root.object3D.rotation.set(0, yaw, 0);
      root.object3D.updateMatrixWorld(true);

      return true;
    }

    function tryAlignCamera() {
      alignAttempts = 0;

      function attempt() {
        alignFrame = null;

        if (!mounted || !root) {
          return;
        }

        if (alignToCamera()) {
          return;
        }

        alignAttempts += 1;

        if (alignAttempts < 120) {
          alignFrame = requestAnimationFrame(attempt);
        } else {
          notify(
            'สร้างห้องแล้ว แต่ยังจัดตำแหน่งตามกล้องไม่ได้',
            '#fbbf24'
          );
        }
      }

      alignFrame = requestAnimationFrame(attempt);
    }

    function light(type, pos, intensity, color, distance) {
      var options = {
        type: type,
        intensity: intensity,
        color: color
      };

      if (type === 'point') {
        options.distance = distance || 8;
        options.decay = 1;
      }

      return add(root, 'a-entity', {
        position: pos,
        light: options
      });
    }

    function makeTool(id, pos, size, color, station) {
      var node = box(root, pos, size, color, {
        class: 'selectable'
      });

      node.dataset.tool = id;
      node.dataset.station = String(station);
      node.dataset.home = pos;
      toolNodes.push(node);

      return node;
    }

    function buildRoom() {
      light('ambient', '0 3 0', 1.35, '#ffffff');
      light('point', '0 3.4 -0.5', 2, '#ffffff', 9);
      light('point', '-2.1 2.5 -1', 0.9, '#dbeafe', 6);
      light('point', '2.1 2.5 -1', 0.9, '#ede9fe', 6);

      box(root, '0 -0.12 -1', [10, 0.22, 9.4], '#9ca3af');
      box(root, '0 2.45 -5.5', [10, 4.9, 0.16], '#263445');
      box(root, '-4.92 2.45 -1', [0.16, 4.9, 9.3], '#34475b');
      box(root, '4.92 2.45 -1', [0.16, 4.9, 9.3], '#34475b');
      box(root, '0 4.92 -1', [9.9, 0.14, 9.2], '#172536');

      [-2.4, 0, 2.4].forEach(function (x) {
        box(
          root,
          x + ' 4.79 -1.5',
          [1.35, 0.05, 0.4],
          '#dbeafe',
          {
            material: {
              color: '#dbeafe',
              emissive: '#93c5fd',
              emissiveIntensity: 0.7
            }
          }
        );
      });

      box(root, '0 3.75 -5.34', [5, 0.72, 0.07], '#075985');
      label(root, 'LAN NETWORK ROOM', '0 3.8 -5.28', 4, '#ffffff');

      box(root, '0 2.52 -5.30', [5.7, 1.45, 0.07], '#e2e8f0');
      label(root, 'HOW TO PLAY', '0 2.95 -5.24', 3.8, '#0f172a');
      label(root, '1. PREPARE CABLE', '0 2.68 -5.24', 3.1, '#1d4ed8');
      label(root, '2. CRIMP RJ45', '0 2.43 -5.24', 3.1, '#047857');
      label(root, '3. TEST LAN CABLE', '0 2.18 -5.24', 3.1, '#6d28d9');

      box(root, '4.05 1.4 -4.1', [0.85, 2.8, 0.75], '#0f172a');

      for (var i = 0; i < 5; i += 1) {
        box(
          root,
          '4.05 ' + (0.48 + i * 0.42) + ' -3.7',
          [0.65, 0.2, 0.04],
          i % 2 ? '#2563eb' : '#164e63'
        );
      }
    }

    function buildTables() {
      var y = VIEW.tableHeight;

      box(root, VIEW.leftX + ' ' + y + ' ' + VIEW.sideZ, [0.95, 0.16, 2.15], '#e2e8f0');
      box(root, '0 ' + y + ' ' + VIEW.frontZ, [3.2, 0.16, 0.85], '#e2e8f0');
      box(root, VIEW.rightX + ' ' + y + ' ' + VIEW.sideZ, [0.95, 0.16, 2.15], '#e2e8f0');

      box(root, '-1.45 0.88 -0.55', [0.87, 0.025, 2.02], '#1687ff');
      box(root, '0 0.88 -1.48', [3.08, 0.025, 0.75], '#10b981');
      box(root, '1.45 0.88 -0.55', [0.87, 0.025, 2.02], '#9333ea');

      [
        [-1.8, -1.4],
        [-1.1, -1.4],
        [-1.8, 0.3],
        [-1.1, 0.3],
        [1.1, -1.4],
        [1.8, -1.4],
        [1.1, 0.3],
        [1.8, 0.3]
      ].forEach(function (p) {
        box(root, p[0] + ' 0.35 ' + p[1], [0.1, 0.7, 0.1], '#64748b');
      });

      label(root, 'STATION 1', '-1.45 1.32 0.42', 1.25, '#bfdbfe');
      label(root, 'STATION 2', '0 1.32 -1.95', 1.5, '#064e3b');
      label(root, 'STATION 3', '1.45 1.32 0.42', 1.25, '#e9d5ff');
    }

    function buildStation1() {
      var cable = add(root, 'a-torus', {
        position: '-1.45 1.02 -0.12',
        radius: '0.2',
        'radius-tubular': '0.035',
        rotation: '90 0 0',
        color: '#2563eb',
        class: 'selectable'
      });

      cable.dataset.tool = 'lan';
      cable.dataset.station = '1';
      cable.dataset.home = '-1.45 1.02 -0.12';
      toolNodes.push(cable);

      makeTool('cutter', '-1.45 1.02 -0.58', [0.43, 0.12, 0.16], '#111827', 1);
      makeTool('stripper', '-1.45 1.02 -1.04', [0.43, 0.12, 0.16], '#f59e0b', 1);
      makeTool('stripped', '-1.45 1.02 -1.4', [0.42, 0.07, 0.12], '#f1f5f9', 1);
    }

    function buildStation2() {
      for (var i = 0; i < 8; i += 1) {
        slots.push(
          box(
            root,
            (-1.05 + i * 0.3) + ' 0.98 -1.84',
            [0.24, 0.075, 0.14],
            '#475569'
          )
        );
      }

      getWires().forEach(function (wire, index) {
        var x = -1.08 + (index % 4) * 0.72;
        var z = -1.45 + Math.floor(index / 4) * 0.26;

        var swatch = box(
          root,
          x + ' 1.03 ' + z,
          [0.36, 0.12, 0.16],
          wire.hex,
          { class: 'selectable' }
        );

        swatch.dataset.wire = wire.id;

        if (wire.stripe) {
          box(
            swatch,
            '0 0.072 0',
            [0.28, 0.02, 0.04],
            wire.stripe
          );
        }

        label(root, wire.label, x + ' 1.16 ' + z, 0.6, '#ffffff');
      });

      makeTool('sleeve', '-0.9 1.03 -1.72', [0.27, 0.12, 0.18], '#60a5fa', 2);
      makeTool('rj45', '0 1.03 -1.72', [0.27, 0.16, 0.18], '#e2e8f0', 2);
      makeTool('crimper', '0.9 1.03 -1.72', [0.43, 0.12, 0.18], '#111827', 2);
    }

    function buildStation3() {
      var tester = makeTool(
        'tester',
        '1.45 1.1 -0.38',
        [0.5, 0.34, 0.3],
        '#111827',
        3
      );

      box(tester, '0 -0.03 0.16', [0.23, 0.08, 0.025], '#475569');

      for (var i = 0; i < 8; i += 1) {
        var x = 1.28 + (i % 4) * 0.115;
        var y = 1.2 - Math.floor(i / 4) * 0.12;

        leds.push(
          box(
            root,
            x + ' ' + y + ' -0.2',
            [0.058, 0.058, 0.025],
            '#475569'
          )
        );
      }

      makeTool(
        'connected-cable',
        '1.45 1.02 -1.13',
        [0.42, 0.12, 0.2],
        '#2563eb',
        3
      );
    }

    function updateLEDs(test) {
      var output =
        test && Array.isArray(test.ledOrder)
          ? test.ledOrder
          : [];

      leds.forEach(function (led, index) {
        var value = output[index];
        var color =
          value == null
            ? '#334155'
            : value === index + 1
              ? '#22c55e'
              : '#f59e0b';

        led.setAttribute('material', {
          color: color,
          emissive: color,
          emissiveIntensity: value == null ? 0 : 0.8
        });
      });
    }

    function getCurrentTest() {
      var cases =
        data && Array.isArray(data.testerCases)
          ? data.testerCases
          : [];

      return cases[state.testerIndex] || null;
    }

    function createOverlay() {
      var old = document.getElementById('cpeg-network-guide');

      if (old) {
        old.remove();
      }

      overlay = document.createElement('div');
      overlay.id = 'cpeg-network-guide';

      overlay.style.cssText =
        'position:fixed;right:12px;top:75px;z-index:9999;' +
        'width:min(370px,43vw);max-height:calc(100vh - 90px);' +
        'overflow-y:auto;padding:14px;box-sizing:border-box;' +
        'background:rgba(9,20,38,.96);color:white;' +
        'border:1px solid #38bdf8;border-radius:12px;' +
        'box-shadow:0 8px 28px #0008;' +
        'font:13px/1.6 Tahoma,Arial,sans-serif';

      overlay.addEventListener('click', function (event) {
        var buttonEl = event.target.closest('[data-network-action]');

        if (
          !buttonEl ||
          !overlay.contains(buttonEl) ||
          buttonEl.disabled
        ) {
          return;
        }

        perform(
          buttonEl.dataset.networkAction,
          buttonEl.dataset.value || ''
        );
      });

      document.body.appendChild(overlay);
      renderPanel();
    }

    function line(value, bold, color) {
      var div = document.createElement('div');
      div.textContent = value;
      div.style.margin = '7px 0';

      if (bold) {
        div.style.fontWeight = 'bold';
      }

      if (color) {
        div.style.color = color;
      }

      overlay.appendChild(div);
      return div;
    }

    function panelButton(title, action, value, color, disabled) {
      var elButton = document.createElement('button');

      elButton.type = 'button';
      elButton.textContent = title;
      elButton.dataset.networkAction = action;
      elButton.dataset.value = value || '';
      elButton.disabled = Boolean(disabled);

      elButton.style.cssText =
        'padding:8px 10px;margin:3px;' +
        'border:1px solid #475569;border-radius:7px;' +
        'color:white;background:' + (color || '#155e75') + ';' +
        'cursor:pointer;font:12px Tahoma,Arial,sans-serif' +
        (disabled ? ';opacity:.4;cursor:not-allowed' : '');

      overlay.appendChild(elButton);
      return elButton;
    }

    function renderStation1() {
      var steps = getPrepSteps();

      if (state.passed[0]) {
        line('ผ่านสถานี 1 แล้ว', true, '#86efac');
        panelButton('ไปสถานี 2', 'open', '2', '#047857', false);
        return;
      }

      var step = steps[state.prepIndex];

      if (!step) {
        return;
      }

      line('สิ่งที่ต้องทำ: ' + step.title, true);
      line(step.description || 'ทำตามขั้นตอนที่แสดง');

      panelButton(
        'ใช้ ' + step.title,
        'tool',
        step.tool || '',
        '#1d4ed8',
        false
      );
    }

    function renderStation2() {
      if (state.passed[1]) {
        line('ผ่านสถานี 2 แล้ว', true, '#86efac');
        panelButton('ไปสถานี 3', 'open', '3', '#6d28d9', false);
        return;
      }

      if (!state.wiresChecked) {
        line('เรียงสีสายทั้ง 8 เส้นตามมาตรฐาน T568B', true);
        line('เลือกแล้ว ' + state.selectedWires.length + '/8 เส้น');

        state.selectedWires.forEach(function (id, index) {
          line((index + 1) + '. ' + getWireLabel(id));
        });

        getWires().forEach(function (wire) {
          if (state.selectedWires.indexOf(wire.id) < 0) {
            panelButton(wire.label, 'wire', wire.id, '#065f46', false);
          }
        });

        panelButton(
          'ตรวจลำดับสี',
          'check-wires',
          '',
          '#047857',
          state.selectedWires.length !== 8
        );

        panelButton('เริ่มเรียงใหม่', 'clear-wires', '', '#475569', false);
        return;
      }

      var steps = getTerminationSteps();
      var step = steps[state.terminationIndex];

      if (!step) {
        line('เตรียมเข้าหัวครบแล้ว', true, '#86efac');
        panelButton('ผ่านสถานี 2', 'finish-station2', '', '#047857', false);
        return;
      }

      line('เรียงสีถูกต้องแล้ว', true, '#86efac');
      line('สิ่งที่ต้องทำ: ' + step.title, true);
      line(step.description || 'ทำตามขั้นตอนที่แสดง');

      panelButton(
        'ใช้ ' + step.title,
        'tool',
        step.tool || '',
        '#047857',
        false
      );
    }

    function renderStation3() {
      if (state.passed[2]) {
        line('ภารกิจสำเร็จ! ผ่านครบทั้ง 3 สถานี', true, '#86efac');
        return;
      }

      if (!state.cableConnected) {
        line('ขั้นแรก: เสียบสาย LAN เข้ากับเครื่องทดสอบ', true);
        panelButton('เสียบสาย LAN', 'tool', 'connected-cable', '#6d28d9', false);
        return;
      }

      if (!state.testerStarted) {
        line('กดเริ่มเครื่องทดสอบ แล้วสังเกตไฟ LED', true);
        panelButton('เริ่มทดสอบสาย', 'tool', 'tester', '#6d28d9', false);
        return;
      }

      var test = getCurrentTest();

      if (!test) {
        line('ไม่มีโจทย์ทดสอบเพิ่มเติม', true);
        panelButton('จบภารกิจ', 'finish-station3', '', '#2563eb', false);
        return;
      }

      line(test.title, true);
      line(test.description);

      line(
        'ไฟ LED: ' +
        (
          Array.isArray(test.ledOrder)
            ? test.ledOrder.map(function (value, index) {
                return (
                  (index + 1) +
                  ':' +
                  (
                    value == null
                      ? 'ดับ'
                      : value === index + 1
                        ? 'ติด'
                        : 'สลับ'
                  )
                );
              }).join('  ')
            : 'ให้พิจารณาจากคำอธิบายโจทย์'
        )
      );

      if (!state.testAnswered) {
        panelButton('สายปกติ', 'answer', 'normal', '#047857', false);
        panelButton('สายขาด', 'answer', 'open', '#b45309', false);
        panelButton('เรียงสายผิด', 'answer', 'miswire', '#6d28d9', false);
      } else {
        panelButton('โจทย์ถัดไป', 'next-test', '', '#2563eb', false);
      }
    }

    function renderPanel() {
      if (!overlay || !state) {
        return;
      }

      overlay.replaceChildren();

      line('LAN NETWORK ROOM — วิธีเล่น', true, '#7dd3fc');
      line('ซ้าย = สถานี 1 | หน้า = สถานี 2 | ขวา = สถานี 3');
      line('ทำภารกิจตามลำดับ 1 → 2 → 3');

      panelButton('1. เตรียมสาย LAN', 'open', '1', '#1d4ed8', false);
      panelButton('2. เรียงสีและเข้าหัว', 'open', '2', '#047857', !state.passed[0]);
      panelButton('3. ตรวจสอบสาย', 'open', '3', '#6d28d9', !state.passed[1]);

      var station =
        data && data.stations && data.stations[state.station - 1];

      line(
        station ? station.title : 'สถานี ' + state.station,
        true,
        station && station.color
      );

      if (station && station.description) {
        line(station.description);
      }

      if (state.station === 1) {
        renderStation1();
      } else if (state.station === 2) {
        renderStation2();
      } else {
        renderStation3();
      }

      line(message, false, messageColor);
      line('คะแนน: ' + state.score + ' | ข้อผิดพลาด: ' + state.errors);

      line(
        'ความคืบหน้า: ' +
        (state.passed[0] ? '✓' : '○') +
        ' 1 → ' +
        (state.passed[1] ? '✓' : '○') +
        ' 2 → ' +
        (state.passed[2] ? '✓' : '○') +
        ' 3'
      );

      panelButton('เริ่มเกมใหม่', 'restart', '', '#475569', false);
    }

    function completeStation(number) {
      if (state.passed[number - 1]) {
        return;
      }

      state.passed[number - 1] = true;
      award(true);

      emit('network:station-completed', {
        station: number
      });

      if (number < 3) {
        state.station = number + 1;

        emit('network:station-opened', {
          station: state.station
        });

        notify(
          'ผ่านสถานี ' + number + ' แล้ว! ต่อไปสถานี ' + state.station,
          '#86efac'
        );
      } else {
        notify('สำเร็จ! ผ่านครบทั้ง 3 สถานีแล้ว', '#86efac');
      }
    }

    function openStation(number) {
      if (number < 1 || number > 3) {
        return;
      }

      if (number === 2 && !state.passed[0]) {
        notify('ต้องผ่านสถานี 1 ก่อน', '#fca5a5');
        return;
      }

      if (number === 3 && !state.passed[1]) {
        notify('ต้องผ่านสถานี 2 ก่อน', '#fca5a5');
        return;
      }

      state.station = number;
      notify('กำลังทำสถานี ' + number, '#93c5fd');

      emit('network:station-opened', {
        station: number
      });
    }

    function useTool(id) {
      if (state.station === 1) {
        var prepSteps = getPrepSteps();
        var prep = prepSteps[state.prepIndex];

        var expectedPrepTool =
          prep && prep.tool
            ? prep.tool
            : ['cutter', 'stripper', 'lan', 'stripped'][state.prepIndex];

        if (!prep || !isToolCorrect(id, expectedPrepTool)) {
          notify(
            'อุปกรณ์ยังไม่ตรงขั้นตอน กรุณาดูคำแนะนำ',
            '#fca5a5'
          );
          return;
        }

        state.prepIndex += 1;

        if (state.prepIndex >= prepSteps.length) {
          completeStation(1);
        } else {
          notify(
            'ถูกต้อง! ต่อไป: ' + prepSteps[state.prepIndex].title,
            '#86efac'
          );
        }

        return;
      }

      if (state.station === 2) {
        if (!state.wiresChecked) {
          notify(
            'เรียงสี T568B ให้ถูกต้องก่อนใช้อุปกรณ์',
            '#fca5a5'
          );
          return;
        }

        var termSteps = getTerminationSteps();
        var term = termSteps[state.terminationIndex];

        if (!term || !isToolCorrect(id, term.tool)) {
          notify(
            'ต้องใช้ ' + (term ? term.title : 'อุปกรณ์ที่ถูกต้อง'),
            '#fca5a5'
          );
          return;
        }

        state.terminationIndex += 1;

        if (state.terminationIndex >= termSteps.length) {
          completeStation(2);
        } else {
          notify(
            'ถูกต้อง! ต่อไป: ' +
              termSteps[state.terminationIndex].title,
            '#86efac'
          );
        }

        return;
      }

      if (state.station === 3) {
        if (id === 'connected-cable') {
          state.cableConnected = true;
          notify('เสียบสายเข้าเครื่องทดสอบแล้ว', '#86efac');
          return;
        }

        if (id === 'tester') {
          if (!state.cableConnected) {
            notify('กรุณาเสียบสาย LAN ก่อน', '#fca5a5');
            return;
          }

          if (state.testAnswered) {
            notify('กดโจทย์ถัดไปก่อน', '#fbbf24');
            return;
          }

          state.testerStarted = true;

          var test = getCurrentTest();
          updateLEDs(test);

          if (test) {
            emit('network:tester-case', {
              caseId: test.id
            });
          }

          notify(
            'เครื่องทดสอบทำงานแล้ว ให้วิเคราะห์ผลไฟ LED',
            '#c4b5fd'
          );
        }
      }
    }

    function selectWire(id) {
      if (state.station !== 2 || state.wiresChecked) {
        return;
      }

      if (state.selectedWires.indexOf(id) >= 0) {
        notify('เลือกสีสายนี้ไปแล้ว', '#fbbf24');
        return;
      }

      if (state.selectedWires.length >= 8) {
        notify(
          'เลือกครบ 8 เส้นแล้ว กดตรวจลำดับสี',
          '#fbbf24'
        );
        return;
      }

      var wire = getWire(id);

      if (!wire) {
        return;
      }

      state.selectedWires.push(id);

      var slot = slots[state.selectedWires.length - 1];

      if (slot) {
        slot.setAttribute('material', {
          color: wire.hex
        });
      }

      notify(
        'เลือกสายแล้ว ' + state.selectedWires.length + '/8 เส้น',
        '#86efac'
      );
    }

    function checkWires() {
      if (state.station !== 2 || state.wiresChecked) {
        return;
      }

      if (state.selectedWires.length !== 8) {
        notify('ต้องเลือกสายให้ครบ 8 เส้นก่อน', '#fca5a5');
        return;
      }

      var correct = isWireOrderCorrect(state.selectedWires);

      emit('network:wires-checked', {
        correct: correct,
        order: state.selectedWires.slice()
      });

      if (!correct) {
        award(false);
        state.selectedWires = [];

        slots.forEach(function (slot) {
          slot.setAttribute('material', {
            color: '#475569'
          });
        });

        notify(
          'ลำดับสีไม่ถูกต้อง เริ่มเรียงใหม่แล้วลองอีกครั้ง',
          '#fca5a5'
        );

        return;
      }

      state.wiresChecked = true;

      notify(
        'เรียงสีถูกต้อง! ขั้นต่อไปใส่ปลอก RJ45',
        '#86efac'
      );
    }

    function answerTester(answer) {
      if (
        state.station !== 3 ||
        !state.testerStarted ||
        state.testAnswered ||
        state.passed[2]
      ) {
        return;
      }

      var test = getCurrentTest();

      if (!test) {
        notify('ไม่มีโจทย์ทดสอบให้ตอบ', '#fca5a5');
        return;
      }

      var correct =
        rules &&
        typeof rules.isTesterAnswerCorrect === 'function'
          ? rules.isTesterAnswerCorrect(answer, test.answer)
          : answer === test.answer;

      emit('network:tester-answered', {
        caseId: test.id,
        answer: answer,
        correct: correct
      });

      award(correct);

      if (!correct) {
        notify(
          'ยังไม่ถูกต้อง ลองอ่านผลทดสอบอีกครั้ง',
          '#fca5a5'
        );
        return;
      }

      state.testAnswered = true;

      notify(
        'ถูกต้อง! ' + (test.explanation || ''),
        '#86efac'
      );
    }

    function nextTest() {
      if (!state.testAnswered) {
        notify(
          'ต้องตอบโจทย์ปัจจุบันให้ถูกก่อน',
          '#fca5a5'
        );
        return;
      }

      state.testerIndex += 1;
      state.testerStarted = false;
      state.testAnswered = false;

      updateLEDs(null);

      var cases =
        data && Array.isArray(data.testerCases)
          ? data.testerCases
          : [];

      if (state.testerIndex >= cases.length) {
        completeStation(3);
      } else {
        notify(
          'กดเครื่องทดสอบเพื่อเริ่มโจทย์ถัดไป',
          '#93c5fd'
        );
      }
    }

    function clearWires() {
      if (state.station !== 2 || state.wiresChecked) {
        return;
      }

      state.selectedWires = [];

      slots.forEach(function (slot) {
        slot.setAttribute('material', {
          color: '#475569'
        });
      });

      notify('เริ่มเรียงสีใหม่จากขาที่ 1', '#93c5fd');
    }

    function resetGame() {
      state = getInitialState();

      slots.forEach(function (slot) {
        slot.setAttribute('material', {
          color: '#475569'
        });
      });

      toolNodes.forEach(function (node) {
        if (node.dataset.home) {
          node.setAttribute('position', node.dataset.home);
        }
      });

      heldTool = null;
      updateLEDs(null);

      notify(
        'เริ่มใหม่: หยิบอุปกรณ์ที่โต๊ะด้านซ้าย',
        '#93c5fd'
      );

      emit('network:station-opened', {
        station: 1
      });
    }

    function perform(action, value) {
      switch (action) {
        case 'open':
          openStation(Number(value));
          break;

        case 'tool':
          useTool(value);
          break;

        case 'wire':
          selectWire(value);
          break;

        case 'check-wires':
          checkWires();
          break;

        case 'clear-wires':
          clearWires();
          break;

        case 'answer':
          answerTester(value);
          break;

        case 'next-test':
          nextTest();
          break;

        case 'finish-station2':
          completeStation(2);
          break;

        case 'finish-station3':
          completeStation(3);
          break;

        case 'restart':
          resetGame();
          break;
      }
    }

    function onRoomClick(event) {
      var node = event.target;

      while (
        node &&
        node !== root &&
        !(node.dataset && (node.dataset.tool || node.dataset.wire))
      ) {
        node = node.parentElement;
      }

      if (!node || node === root || !node.dataset) {
        return;
      }

      if (node.dataset.wire) {
        selectWire(node.dataset.wire);
        return;
      }

      var id = node.dataset.tool;

      if (!id) {
        return;
      }

      if (Number(node.dataset.station) !== state.station) {
        notify(
          'ขณะนี้ต้องทำสถานี ' + state.station + ' ก่อน',
          '#fca5a5'
        );
        return;
      }

      if (
        heldTool &&
        heldTool !== node &&
        heldTool.dataset.home
      ) {
        heldTool.setAttribute('position', heldTool.dataset.home);
      }

      heldTool = node;

      var pos = String(node.dataset.home || '')
        .trim()
        .split(/\s+/)
        .map(Number);

      if (pos.length === 3 && pos.every(Number.isFinite)) {
        node.setAttribute(
          'position',
          pos[0] + ' ' + (pos[1] + 0.14) + ' ' + pos[2]
        );
      }

      useTool(id);
    }

    return {
      mount: function (targetContainer) {
        if (mounted) {
          return;
        }

        if (
          !data ||
          !rules ||
          !Array.isArray(data.wires) ||
          !Array.isArray(data.correctOrder) ||
          !Array.isArray(data.preparationSteps) ||
          !Array.isArray(data.testerCases)
        ) {
          console.error(
            'Network Room: data.js หรือ game.js ไม่พร้อม'
          );
          return;
        }

        if (
          !targetContainer ||
          typeof targetContainer.appendChild !== 'function'
        ) {
          console.error('Network Room: container ไม่ถูกต้อง');
          return;
        }

        mounted = true;
        container = targetContainer;
        scene =
          container.sceneEl ||
          container.closest('a-scene');

        state = getInitialState();

        root = add(null, 'a-entity', {
          'data-network-room': '',
          id: 'network-room-root'
        });

        slots = [];
        leds = [];
        toolNodes = [];

        buildRoom();
        buildTables();
        buildStation1();
        buildStation2();
        buildStation3();

        container.appendChild(root);

        clickHandler = onRoomClick;
        root.addEventListener('click', clickHandler);

        createOverlay();

        notify(
          'เริ่มสถานี 1 ทางซ้าย: เลือกอุปกรณ์ตามคำแนะนำ',
          '#93c5fd'
        );

        tryAlignCamera();

        emit('network:station-opened', {
          station: 1
        });

        console.info('LAN Network Room mounted');
      },

      unmount: function () {
        mounted = false;

        if (alignFrame !== null) {
          cancelAnimationFrame(alignFrame);
          alignFrame = null;
        }

        if (root && clickHandler) {
          root.removeEventListener('click', clickHandler);
        }

        if (root && root.parentNode) {
          root.parentNode.removeChild(root);
        }

        if (overlay && overlay.parentNode) {
          overlay.parentNode.removeChild(overlay);
        }

        root = null;
        overlay = null;
        container = null;
        scene = null;
        clickHandler = null;
        slots = [];
        leds = [];
        toolNodes = [];
        heldTool = null;
        state = null;
      }
    };
  };
})();