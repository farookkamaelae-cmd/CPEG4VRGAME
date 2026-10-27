// SHARED ROOM STRUCTURE — interior floor is 8 m × 8 m; floor-to-ceiling height is 8 m.
// Keep the common shell here so every learning room has the same square dimensions.
window.SharedRoomStructure = {
  create: function (roomId, context) {
    var root = document.createElement('a-entity');
    root.dataset.roomStructure = roomId;
    function add(tag, attributes) {
      var item = document.createElement(tag);
      Object.keys(attributes || {}).forEach(function (key) { item.setAttribute(key, attributes[key]); });
      root.append(item);
      return item;
    }

    // 8 m × 8 m floor; room coordinates span x/z = -4..4.
    add('a-box', { position: '0 -.06 0', width: '8', height: '.12', depth: '8', color: '#263445', material: 'roughness: .78' });

    // Four walls: 8 m high, with their inner faces at the 8 m × 8 m room boundary.
    add('a-box', { position: '0 4 -4.06', width: '8.12', height: '8', depth: '.12', color: '#172033', material: 'roughness: .86' });
    add('a-box', { position: '0 4 4.06', width: '8.12', height: '8', depth: '.12', color: '#172033', material: 'roughness: .86' });
    add('a-box', { position: '-4.06 4 0', width: '.12', height: '8', depth: '8', color: '#1b2940', material: 'roughness: .86' });
    add('a-box', { position: '4.06 4 0', width: '.12', height: '8', depth: '8', color: '#1b2940', material: 'roughness: .86' });

    // Ceiling is at y=8 m. Slim cyan wall trims make the common room envelope visible.
    add('a-box', { position: '0 8.06 0', width: '8.12', height: '.12', depth: '8.12', color: '#111827' });
    add('a-box', { position: '0 .12 -3.98', width: '7.6', height: '.045', depth: '.035', color: '#22d3ee', material: 'shader: flat; emissive: #0891b2; emissiveIntensity: .75' });
    add('a-box', { position: '0 .12 3.98', width: '7.6', height: '.045', depth: '.035', color: '#22d3ee', material: 'shader: flat; emissive: #0891b2; emissiveIntensity: .75' });
    add('a-box', { position: '-3.98 .12 0', width: '.035', height: '.045', depth: '7.6', color: '#22d3ee', material: 'shader: flat; emissive: #0891b2; emissiveIntensity: .75' });
    add('a-box', { position: '3.98 .12 0', width: '.035', height: '.045', depth: '7.6', color: '#22d3ee', material: 'shader: flat; emissive: #0891b2; emissiveIntensity: .75' });

    var title = add('a-text', {
      value: context.i18n.t('nav.' + roomId),
      position: '-3.45 7.25 -3.98',
      width: '3.5',
      align: 'left',
      color: '#a5f3fc',
      'wrap-count': '24'
    });
    function onLanguageChanged() { title.setAttribute('value', context.i18n.t('nav.' + roomId)); }
    context.scene.addEventListener('sim:language-changed', onLanguageChanged);
    root._cleanupStructure = function () { context.scene.removeEventListener('sim:language-changed', onLanguageChanged); };
    return root;
  }
};
