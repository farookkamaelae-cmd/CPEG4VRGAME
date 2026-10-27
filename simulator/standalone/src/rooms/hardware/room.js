// Room contract: register a factory in the shared global room registry.
window.SimulatorRooms = window.SimulatorRooms || {};
window.SimulatorRooms.hardware = function createHardwareRoom(context) {
  var panel; var container; var assembly; var mounted = false; var handleClick;
  var components = window.HardwareRoom.Components;
  var helper = window.HardwareRoom.Assembly;
  function el(tag, attrs) { return components.make(tag, attrs); }
  function refreshText() { if (mounted) panel.querySelectorAll('[data-key]').forEach(function (node) { node.setAttribute('value', context.i18n.t(node.dataset.key)); }); }
  return {
    mount: function (container) {
      var sceneRoot = el('a-entity', { position: '0 1.3 -3' });
      panel = el('a-entity', {});
      var title = el('a-text', { position: '-1.5 1.4 0', width: '3', align: 'center', color: '#67e8f9' });
      title.dataset.key = 'hardware.title';
      var description = el('a-text', { position: '-1.5 1.05 0', width: '3', align: 'center', color: '#e2e8f0' });
      description.dataset.key = 'hardware.description';
      panel.append(title, description);
      sceneRoot.append(panel);

      // Mainboard and install targets.
      var board = el('a-box', { position: '0 -.4 -.3', width: '3.4', height: '.12', depth: '2.05', color: '#14532d' });
      sceneRoot.append(board);
      var slots = {};
      var slotSpecs = [
        { id: 'cpu-slot', x: -.78, z: -.38, width: .68, depth: .62, color: '#0f172a' },
        { id: 'ram-slot', x: .15, z: -.38, width: .35, depth: .95, color: '#1e293b' },
        { id: 'storage-slot', x: .9, z: .3, width: .8, depth: .38, color: '#1e293b' }
      ];
      slotSpecs.forEach(function (slot) {
        var target = el('a-box', { class: 'selectable', position: slot.x + ' -.29 ' + slot.z, width: slot.width, height: .08, depth: slot.depth, color: slot.color });
        target.dataset.slotId = slot.id; target.dataset.baseColor = slot.color; slots[slot.id] = target; sceneRoot.append(target);
        var caption = el('a-text', { position: (slot.x - .42) + ' -.08 ' + slot.z, width: .85, align: 'center', color: '#f8fafc', value: slot.id.replace('-slot', '').toUpperCase() }); sceneRoot.append(caption);
      });

      // Component shelf: click one component to pick it, then click its matching motherboard slot.
      components.parts.forEach(function (part, index) {
        var x = -1.2 + index * 1.2;
        var item = el('a-box', { class: 'selectable', position: x + ' .25 1.05', width: .62, height: .28, depth: .48, color: part.color });
        item.dataset.partId = part.id; sceneRoot.append(item);
        var label = el('a-text', { position: (x - .42) + ' .52 1.28', width: .85, align: 'center', color: '#fff' }); label.dataset.key = part.label; sceneRoot.append(label);
      });

      var notice = el('a-text', { position: '-1.6 -1.15 .1', width: 3.2, align: 'center', color: '#a5f3fc', value: 'หยิบชิ้นส่วน แล้วคลิกช่องบนเมนบอร์ด' }); sceneRoot.append(notice);
      container.append(sceneRoot);
      mounted = true;
      var view = {
        setSelected: function (id) { sceneRoot.querySelectorAll('[data-part-id]').forEach(function (item) { item.setAttribute('scale', item.dataset.partId === id ? '1.18 1.18 1.18' : '1 1 1'); }); },
        setInstalled: function (slotId, part) { var target = slots[slotId]; target.setAttribute('color', part.color); target.dataset.installedPart = part.id; },
        reset: function () { Object.keys(slots).forEach(function (id) { slots[id].setAttribute('color', slots[id].dataset.baseColor); delete slots[id].dataset.installedPart; }); }
      };
      assembly = helper(context, view);
      handleClick = function (event) {
        var partNode = event.target.closest('[data-part-id]'); var slotNode = event.target.closest('[data-slot-id]');
        if (partNode) { var part = components.parts.find(function (entry) { return entry.id === partNode.dataset.partId; }); if (part) assembly.selectPart(part); }
        if (slotNode) assembly.placePart(slotNode.dataset.slotId);
      };
      context.scene.addEventListener('click', handleClick);
      refreshText();
    },
    unmount: function () {
      if (!mounted) return;
      context.scene.removeEventListener('click', handleClick);
      if (container) container.replaceChildren();
      context.ui.clearMessage();
      mounted = false; assembly = null; panel = null;
    }
  };
};
