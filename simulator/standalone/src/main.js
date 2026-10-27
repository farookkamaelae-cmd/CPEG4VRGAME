(function () {
  var translations = window.SimulatorTranslations;
  var scene = document.querySelector('a-scene');
  var world = document.getElementById('world');
  var status = document.getElementById('status');
  var roomNav = document.getElementById('room-nav');
  var camera = document.getElementById('player-camera');
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
  }
  Object.keys(definitions).forEach(function (id) {
    var button = document.createElement('button');
    button.dataset.room = id;
    button.textContent = t(definitions[id].key);
    button.addEventListener('click', function () { openRoom(id); });
    roomNav.append(button);
  });
  document.getElementById('home').addEventListener('click', home);
  updateLanguage();
  home();
})();
