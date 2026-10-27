// GAME — กติกาความเข้ากันได้และตรวจว่าประกอบอุปกรณ์ครบหรือยัง
window.HardwareRoom = window.HardwareRoom || {};
window.HardwareRoom.Game = {
  canInstall: function (part, slotId, installed) { return part.slot === slotId && !installed[slotId]; },
  isComplete: function (installed, parts) { return Object.keys(installed).length === parts.length; }
};
