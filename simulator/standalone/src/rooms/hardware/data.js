// DATA — ชิ้นส่วน ช่องติดตั้ง และค่าตั้งต้นของห้อง Hardware
window.HardwareRoom = window.HardwareRoom || {};
window.HardwareRoom.Data = {
  parts: [
    { id: 'cpu', label: 'hardware.cpu', color: '#2563eb', slot: 'cpu-slot' },
    { id: 'ram', label: 'hardware.ram', color: '#059669', slot: 'ram-slot' },
    { id: 'storage', label: 'hardware.storage', color: '#7c3aed', slot: 'storage-slot' }
  ],
  slots: [
    { id: 'cpu-slot', x: -.78, z: -.38, width: .68, depth: .62 },
    { id: 'ram-slot', x: .15, z: -.38, width: .35, depth: .95 },
    { id: 'storage-slot', x: .9, z: .3, width: .8, depth: .38 }
  ]
};
