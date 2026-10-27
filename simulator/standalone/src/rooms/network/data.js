// NETWORK / T568B LEARNING DATA
// Edit the wire colors, stripe colors, and correct T568B order here.
window.NetworkRoom = window.NetworkRoom || {};
window.NetworkRoom.Data = {
  wires: [
    { id: 'white-orange', label: 'สายขาวส้ม', hex: '#f8fafc', stripe: '#f97316' },
    { id: 'orange', label: 'สายส้ม', hex: '#f97316' },
    { id: 'white-green', label: 'สายขาวเขียว', hex: '#f8fafc', stripe: '#22c55e' },
    { id: 'blue', label: 'สายฟ้า', hex: '#2563eb' },
    { id: 'white-blue', label: 'สายขาวฟ้า', hex: '#f8fafc', stripe: '#2563eb' },
    { id: 'green', label: 'สายเขียว', hex: '#22c55e' },
    { id: 'white-brown', label: 'สายขาวน้ำตาล', hex: '#f8fafc', stripe: '#92400e' },
    { id: 'brown', label: 'สายน้ำตาล', hex: '#92400e' }
  ],
  correctOrder: ['white-orange', 'orange', 'white-green', 'blue', 'white-blue', 'green', 'white-brown', 'brown']
};
