// INTERACTIONS — การคลิกหยิบชิ้นส่วนและคลิกวางลงช่องบนเมนบอร์ด
window.HardwareRoom = window.HardwareRoom || {};
window.HardwareRoom.Interactions = function createHardwareInteractions(context, view) {
  var selectedPart = null;
  var installed = {};
  var data = window.HardwareRoom.Data;
  var rules = window.HardwareRoom.Game;
  return {
    selectPart: function (part) { selectedPart = part; context.ui.showMessage(part.label); view.setSelected(part.id); },
    placePart: function (slotId) {
      if (!selectedPart) { context.ui.showMessage('hardware.pickFirst'); return; }
      if (!rules.canInstall(selectedPart, slotId, installed)) {
        context.ui.showMessage(selectedPart.slot === slotId ? 'hardware.slotFilled' : 'hardware.wrongSlot');
        context.emit('hardware:assembly-error', { partId: selectedPart.id, slotId: slotId });
        return;
      }
      installed[slotId] = selectedPart.id;
      view.setInstalled(slotId, selectedPart);
      context.emit('hardware:part-installed', { partId: selectedPart.id, slotId: slotId });
      selectedPart = null; view.setSelected(null);
      if (rules.isComplete(installed, data.parts)) context.ui.showMessage('hardware.complete');
    },
    reset: function () { selectedPart = null; installed = {}; view.reset(); view.setSelected(null); context.ui.clearMessage(); }
  };
};
