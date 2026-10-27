// HARDWARE / PICKUP, PLACEMENT AND ASSEMBLY RULES
// Write drag/pickup interaction, compatibility checks and assembly progress here.
window.HardwareRoom = window.HardwareRoom || {};
window.HardwareRoom.Assembly = function createAssembly(context, view) {
  var selectedPart = null;
  var installed = {};

  function selectPart(part) {
    selectedPart = part;
    context.ui.showMessage(part.label);
    view.setSelected(part.id);
  }

  function placePart(slotId) {
    if (!selectedPart) {
      context.ui.showMessage('hardware.pickFirst');
      return;
    }
    if (selectedPart.slot !== slotId) {
      context.ui.showMessage('hardware.wrongSlot');
      context.emit('hardware:assembly-error', { partId: selectedPart.id, slotId: slotId });
      return;
    }
    installed[slotId] = selectedPart.id;
    view.setInstalled(slotId, selectedPart);
    context.emit('hardware:part-installed', { partId: selectedPart.id, slotId: slotId });
    selectedPart = null;
    view.setSelected(null);
    var complete = Object.keys(installed).length === window.HardwareRoom.Components.parts.length;
    if (complete) context.ui.showMessage('hardware.complete');
  }

  return {
    selectPart: selectPart,
    placePart: placePart,
    reset: function () { selectedPart = null; installed = {}; view.reset(); view.setSelected(null); context.ui.clearMessage(); },
    getState: function () { return { selectedPartId: selectedPart && selectedPart.id, installed: Object.assign({}, installed) }; }
  };
};
