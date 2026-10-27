// NETWORK ROOM DATA — keep room data separate from scene logic.
window.NetworkRoom = window.NetworkRoom || {};
window.NetworkRoom.Data = {
  room: { title: 'LAN NETWORK ROOM', subtitle: 'ห้องฝึกปฏิบัติการเครือข่ายคอมพิวเตอร์' },
  stations: [
    { id: 1, title: 'สถานี 1: ต่อสายแลน', color: '#1687ff', description: 'เตรียม ตัด และปอกสาย LAN' },
    { id: 2, title: 'สถานี 2: ใส่ปลอกและเข้าหัว', color: '#10b981', description: 'เรียงสีสาย T568B และจำลองการเข้าหัว RJ45' },
    { id: 3, title: 'สถานี 3: ตรวจสอบ', color: '#8b5cf6', description: 'ทดสอบสาย LAN และวิเคราะห์ผล' }
  ],
  wires: [
    { id: 'white-orange', label: 'ขาว-ส้ม', hex: '#f8fafc', stripe: '#f97316' },
    { id: 'orange', label: 'ส้ม', hex: '#f97316' },
    { id: 'white-green', label: 'ขาว-เขียว', hex: '#f8fafc', stripe: '#22c55e' },
    { id: 'blue', label: 'น้ำเงิน', hex: '#2563eb' },
    { id: 'white-blue', label: 'ขาว-น้ำเงิน', hex: '#f8fafc', stripe: '#2563eb' },
    { id: 'green', label: 'เขียว', hex: '#22c55e' },
    { id: 'white-brown', label: 'ขาว-น้ำตาล', hex: '#f8fafc', stripe: '#92400e' },
    { id: 'brown', label: 'น้ำตาล', hex: '#92400e' }
  ],
  correctOrder: ['white-orange', 'orange', 'white-green', 'blue', 'white-blue', 'green', 'white-brown', 'brown'],
  preparationSteps: [
    { title: '1. วัดและตัดสาย', description: 'กำหนดความยาวสาย LAN แล้วใช้คีมตัดสายให้ปลายเรียบ' },
    { title: '2. ปอกเปลือกสาย', description: 'ใช้เครื่องมือปอกเปลือกนอกอย่างระมัดระวัง อย่าบาดฉนวนสายด้านใน' },
    { title: '3. คลายเกลียวและจัดสาย', description: 'แยกสายทั้ง 4 คู่ แล้วจัดเรียงตามมาตรฐาน T568B' },
    { title: '4. ตัดปลายให้เสมอกัน', description: 'จัดปลายสายทั้ง 8 เส้นให้เสมอกันก่อนใส่หัว RJ45' }
  ],
  testerCases: [
    { id: 'normal', title: 'สายเชื่อมต่อปกติ', description: 'ไฟหมายเลข 1–8 ติดเรียงครบทั้งสองฝั่ง', answer: 'normal', explanation: 'สายทั้ง 8 เส้นเชื่อมต่อครบและเรียงลำดับถูกต้อง' },
    { id: 'open', title: 'สายขาด', description: 'ไฟหมายเลข 4 ไม่ติด แต่อีกเส้นติดตามปกติ', answer: 'open', explanation: 'ตรวจสอบสายเส้นที่ 4 และเข้าหัว RJ45 ใหม่หากจำเป็น' },
    { id: 'miswire', title: 'ลำดับสายผิด', description: 'ไฟติดครบแต่หมายเลขบางเส้นไม่ตรงกันระหว่างสองฝั่ง', answer: 'miswire', explanation: 'ตรวจลำดับสีทั้งสองหัวให้ตรงตามมาตรฐาน T568B' }
  ]
};
