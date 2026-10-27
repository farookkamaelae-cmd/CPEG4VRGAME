// MODELS — โมเดล 3D และฟังก์ชันสร้าง Entity ของห้อง Hardware
window.HardwareRoom = window.HardwareRoom || {};
window.HardwareRoom.Models = {
  make: function (tag, attributes) {
    var element = document.createElement(tag);
    Object.keys(attributes || {}).forEach(function (key) { element.setAttribute(key, attributes[key]); });
    return element;
  }
};
