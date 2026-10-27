// MODELS — RJ45 connector, pin sockets, wire samples and text helper for Network.
window.NetworkRoom = window.NetworkRoom || {};
window.NetworkRoom.Models = {
  make: function (tag, attributes) {
    var item = document.createElement(tag);
    Object.keys(attributes || {}).forEach(function (key) { item.setAttribute(key, attributes[key]); });
    return item;
  },
  text: function (value, position, width, color) {
    return this.make('a-text', { value: value, position: position, width: width || 4, align: 'center', color: color || '#fff' });
  }
};
