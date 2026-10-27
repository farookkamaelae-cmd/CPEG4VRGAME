(function () {
  var translations = window.SimulatorTranslations;
  var scene = document.querySelector('a-scene');
  var world = document.getElementById('world');
  var status = document.getElementById('status');
  var roomNav = document.getElementById('room-nav');
  var camera = document.getElementById('player-camera');
  var toolbar = document.getElementById('toolbar');
  var vrToggle = document.getElementById('vr-toggle');
  var vrRoomNav = null;
  var vrRoomNavCanvas = null;
  var vrRoomNavTexture = null;
  var vrRoomNavGeometry = null;
  var vrRoomNavMaterial = null;
  var currentLanguage = 'th';
  var activeRoom = null;
  var activeRoomId = null;
  var session = { score: 0, errors: 0, elapsedSeconds: 0 };
  var definitions = {
    hardware: { key: 'nav.hardware', hubKey: 'hub.hardware', color: '#14b8a6', factory: window.SimulatorRooms.hardware },
    programming: { key: 'nav.programming', hubKey: 'hub.programming', color: '#8b5cf6', factory: window.SimulatorRooms.programming },
    network: { key: 'nav.network', hubKey: 'hub.network', color: '#f59e0b', factory: window.SimulatorRooms.network }
  };

  function t(key) { return (translations[currentLanguage] && translations[currentLanguage][key]) || key; }
  function updateLanguage() {
    document.documentElement.lang = currentLanguage;
    document.querySelectorAll('[data-i18n]').forEach(function (item) { item.textContent = t(item.dataset.i18n); });
    roomNav.querySelectorAll('[data-room]').forEach(function (item) { item.textContent = t(definitions[item.dataset.room].key); });
    scene.dispatchEvent(new CustomEvent('sim:language-changed', { detail: { language: currentLanguage } }));
  }
  function createVRRoomNav() {
    if (!camera || !window.AFRAME || !window.AFRAME.THREE) return;
    vrRoomNav = document.createElement('a-entity');
    vrRoomNav.id = 'vr-room-navigation';
    vrRoomNav.setAttribute('position', '0 0.78 -1.08');
    vrRoomNav.setAttribute('visible', 'false');
    camera.appendChild(vrRoomNav);

    vrRoomNavCanvas = document.createElement('canvas');
    vrRoomNavCanvas.width = 1440;
    vrRoomNavCanvas.height = 220;
    var THREE = window.AFRAME.THREE;
    vrRoomNavTexture = new THREE.CanvasTexture(vrRoomNavCanvas);
    vrRoomNavGeometry = new THREE.PlaneGeometry(3.6, 0.55);
    vrRoomNavMaterial = new THREE.MeshBasicMaterial({
      map: vrRoomNavTexture,
      transparent: true,
      depthTest: false,
      depthWrite: false
    });
    var panelMesh = new THREE.Mesh(vrRoomNavGeometry, vrRoomNavMaterial);
    panelMesh.renderOrder = 2000;
    vrRoomNav.object3D.add(panelMesh);

    vrRoomNav.addEventListener('click', function (event) {
      var button = event.target && event.target.closest
        ? event.target.closest('[data-vr-room-action]')
        : null;
      if (!button || !vrRoomNav.contains(button)) return;
      event.preventDefault();
      event.stopPropagation();
      if (button.dataset.vrRoomAction === 'home') home();
      else if (button.dataset.vrRoomAction === 'room') openRoom(button.dataset.roomId);
      else if (button.dataset.vrRoomAction === 'exit') scene.exitVR();
    });

    scene.addEventListener('enter-vr', syncVRRoomNav);
    scene.addEventListener('exit-vr', syncVRRoomNav);
    renderVRRoomNav();
    syncVRRoomNav();
  }

  function renderVRRoomNav() {
    if (!vrRoomNav || !vrRoomNavCanvas || !vrRoomNavTexture) return;
    var ctx = vrRoomNavCanvas.getContext('2d');
    var width = vrRoomNavCanvas.width;
    var height = vrRoomNavCanvas.height;
    var panelWidth = 3.6;
    var panelHeight = 0.55;
    var items = [];

    if (activeRoomId) items.push({ label: 'กลับห้องหลัก', action: 'home', color: '#0e7490' });
    Object.keys(definitions).forEach(function (id) {
      items.push({ label: t(definitions[id].key), action: 'room', roomId: id, color: definitions[id].color });
    });
    items.push({ label: 'ออกจาก VR', action: 'exit', color: '#475569' });

    vrRoomNav.querySelectorAll('[data-vr-room-action]').forEach(function (node) { node.remove(); });
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = 'rgba(7,17,31,0.96)';
    ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 5;
    ctx.strokeRect(3, 3, width - 6, height - 6);

    var cellWidth = width / items.length;
    items.forEach(function (item, index) {
      var left = index * cellWidth;
      ctx.fillStyle = item.color;
      ctx.fillRect(left + 8, 12, cellWidth - 16, height - 24);
      ctx.fillStyle = '#ffffff';
      ctx.font = '600 31px Tahoma, Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(item.label, left + cellWidth / 2, height / 2, cellWidth - 28);
      if (index > 0) {
        ctx.fillStyle = 'rgba(125,211,252,0.55)';
        ctx.fillRect(left, 24, 2, height - 48);
      }

      var hit = document.createElement('a-plane');
      hit.classList.add('selectable');
      hit.dataset.vrRoomAction = item.action;
      if (item.roomId) hit.dataset.roomId = item.roomId;
      hit.setAttribute('position',
        (((left + cellWidth / 2) / width - 0.5) * panelWidth) + ' 0 0.012');
      hit.setAttribute('width', ((cellWidth - 16) / width * panelWidth).toFixed(4));
      hit.setAttribute('height', '0.45');
      hit.setAttribute('material', 'shader: flat; color: #ffffff; transparent: true; opacity: 0.001; side: double');
      vrRoomNav.appendChild(hit);
    });
    vrRoomNavTexture.needsUpdate = true;
  }

  function syncVRRoomNav() {
    var inVR = Boolean(scene && scene.is && scene.is('vr-mode'));
    if (vrRoomNav) vrRoomNav.setAttribute('visible', inVR ? 'true' : 'false');
    if (toolbar) toolbar.hidden = inVR;
    if (vrToggle) vrToggle.hidden = inVR;
  }

  function contextFor(roomId) {
    return Object.freeze({
      roomId: roomId,
      scene: scene,
      ui: Object.freeze({
        showMessage: function (key) { status.textContent = t(key); },
        showError: function (message) { status.textContent = String(message); },
        clearMessage: function () { status.textContent = ''; }
      }),
      i18n: Object.freeze({ getLanguage: function () { return currentLanguage; }, t: t }),
      navigation: Object.freeze({
        currentRoom: function () { return activeRoomId; },
        openRoom: openRoom,
        goHome: home,
        listRooms: function () {
          return Object.freeze(Object.keys(definitions).map(function (id) {
            var definition = definitions[id];
            return Object.freeze({ id: id, labelKey: definition.key, hubKey: definition.hubKey, color: definition.color });
          }));
        }
      }),
      session: Object.freeze({
        get: function () { return Object.freeze(Object.assign({}, session)); },
        update: function (patch) {
          ['score', 'errors', 'elapsedSeconds'].forEach(function (key) {
            if (patch && Number.isFinite(patch[key])) session[key] = patch[key];
          });
        }
      }),
      emit: function (name, detail) { scene.dispatchEvent(new CustomEvent('sim:' + name, { detail: detail || {} })); }
    });
  }
  function addInWorldHomeButton() {
    var button = document.createElement('a-box');
    button.setAttribute('class', 'selectable');
    button.setAttribute('position', '3.2 2.7 -2.5');
    button.setAttribute('width', '1.25');
    button.setAttribute('height', '.48');
    button.setAttribute('depth', '.1');
    button.setAttribute('color', '#0e7490');
    button.dataset.shellHome = '';
    var label = document.createElement('a-text');
    label.setAttribute('value', 'กลับห้องหลัก');
    label.setAttribute('position', '2.72 2.66 -2.43');
    label.setAttribute('width', '1');
    label.setAttribute('align', 'center');
    label.setAttribute('color', '#fff');
    label.dataset.shellHome = '';
    world.append(button, label);
  }
  world.addEventListener('click', function (event) {
    var target = event.target.closest('[data-shell-home]');
    if (target) home();
  });
  function home() {
    if (activeRoom) activeRoom.unmount();
    activeRoom = null;
    activeRoomId = null;
    world.replaceChildren();
    status.textContent = '';
    window.SimulatorCameraLocations.apply('hub', camera);
    world.append(window.SimulatorRoomStructure.create('hub'));
    activeRoom = window.SimulatorRooms.hub(contextFor('hub'));
    activeRoom.mount(world);
    document.getElementById('home').hidden = true;
    renderVRRoomNav();
  }
  function openRoom(roomId) {
    var definition = definitions[roomId];
    if (!definition) return;
    if (activeRoom) activeRoom.unmount();
    activeRoom = null;
    activeRoomId = roomId;
    world.replaceChildren();
    window.SimulatorCameraLocations.apply(roomId, camera);
    world.append(window.SimulatorRoomStructure.create(roomId));
    activeRoom = definition.factory(contextFor(roomId));
    activeRoom.mount(world);
    addInWorldHomeButton();
    document.getElementById('home').hidden = false;
    renderVRRoomNav();
  }
  Object.keys(definitions).forEach(function (id) {
    var button = document.createElement('button');
    button.dataset.room = id;
    button.textContent = t(definitions[id].key);
    button.addEventListener('click', function () { openRoom(id); });
    roomNav.append(button);
  });
  createVRRoomNav();

  function syncVRToggle() {
    if (!vrToggle) return;
    vrToggle.textContent = scene.is('vr-mode') ? 'ออกจาก VR' : 'เข้า VR';
    vrToggle.setAttribute('aria-label', vrToggle.textContent);
    vrToggle.title = vrToggle.textContent;
  }

  function showVRError(error) {
    var message = 'เข้าโหมด VR ไม่สำเร็จ';
    if (error && (error.name === 'NotSupportedError' || error.name === 'NotFoundError')) {
      message = 'ไม่พบ headset หรือ browser นี้ไม่รองรับ immersive VR';
    } else if (error && error.name === 'NotAllowedError') {
      message = 'การเข้า VR ถูกปฏิเสธ กรุณาอนุญาตสิทธิ์และกดปุ่มจากหน้าเว็บโดยตรง';
    } else if (!window.isSecureContext) {
      message = 'WebXR ต้องเปิดผ่าน HTTPS หรือ localhost';
    } else if (error && error.message) {
      message = 'เบราว์เซอร์ปฏิเสธการเข้า VR: ' + error.message;
    }
    status.textContent = message;
    console.warn('WebXR entry failed:', error || message);
  }

  vrToggle.addEventListener('click', function () {
    if (scene.is('vr-mode')) {
      scene.exitVR();
      return;
    }
    if (!scene.hasLoaded) {
      status.textContent = 'รอให้ห้องโหลดเสร็จก่อน แล้วกดเข้า VR อีกครั้ง';
      return;
    }
    if (!window.isSecureContext) {
      showVRError();
      return;
    }
    if (!navigator.xr || typeof scene.enterVR !== 'function') {
      showVRError({ name: 'NotSupportedError' });
      return;
    }
    var headsetDetected = Boolean(scene.isMobile);
    try {
      headsetDetected = headsetDetected || Boolean(
        scene.checkHeadsetConnected && scene.checkHeadsetConnected()
      );
    } catch (error) {
      console.warn('Headset detection failed; trying WebXR request:', error);
    }
    if (!headsetDetected) {
      status.textContent = 'เบราว์เซอร์นี้ยังไม่พบ headset ที่เชื่อมต่อ หรือ runtime VR บนคอมยังไม่เริ่ม';
      return;
    }
    status.textContent = 'กำลังเชื่อมต่อ headset...';
    try {
      var entering = scene.enterVR();
      if (entering && typeof entering.catch === 'function') entering.catch(showVRError);
    } catch (error) {
      showVRError(error);
    }
  });

  scene.addEventListener('enter-vr', function () {
    status.textContent = '';
    syncVRToggle();
  });
  scene.addEventListener('exit-vr', syncVRToggle);

  document.getElementById('home').addEventListener('click', home);
  updateLanguage();
  home();
})();
