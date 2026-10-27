// HARDWARE / COMPONENT MODELS
// Write A-Frame models for the motherboard, CPU, RAM, storage and component pickup points here.
window.HardwareRoom = window.HardwareRoom || {};
window.HardwareRoom.Components = {
  parts: [
    { id: 'cpu', label: 'hardware.cpu', color: '#2563eb', slot: 'cpu-slot' },
    { id: 'ram', label: 'hardware.ram', color: '#059669', slot: 'ram-slot' },
    { id: 'storage', label: 'hardware.storage', color: '#7c3aed', slot: 'storage-slot' }
  ],
  make: function (tag, attributes) {
    var element = document.createElement(tag);
    Object.keys(attributes || {}).forEach(function (key) { element.setAttribute(key, attributes[key]); });
    return element;
  }
};
