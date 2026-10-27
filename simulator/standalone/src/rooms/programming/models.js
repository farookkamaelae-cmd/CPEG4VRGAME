// MODELS — 3D board cells, robot and text helper for the Programming room.
window.ProgrammingRoom = window.ProgrammingRoom || {};
window.ProgrammingRoom.Models = {
  make: function (tag, attributes) {
    var item = document.createElement(tag);
    Object.keys(attributes || {}).forEach(function (key) { item.setAttribute(key, attributes[key]); });
    return item;
  },
  text: function (value, position, width, color) {
    return this.make('a-text', { value: value, position: position, width: width || 4, align: 'center', color: color || '#fff' });
  }
};
