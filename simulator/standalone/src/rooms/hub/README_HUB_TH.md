# Main Hub ภาษาไทย — เฉพาะโมดูล Hub

## เปลี่ยนแปลง
- `models.js` สร้างฉาก 3D มีมุม Hardware, LAN Network และ Programming รวมถึงอุปกรณ์จำลองแบบ low-poly
- `interactions.js` มีบทเรียน HTML ภาษาไทย (บนเดสก์ท็อป) และบอร์ด CanvasTexture ภาษาไทยสำหรับ VR พร้อมปุ่ม CLOSE
- `room.js`, `src/main.js`, `index.html`, `data/i18n.js` และทุกไฟล์ห้องอื่นคงเดิมทั้งหมด

## เปิดทดลอง
ดับเบิลคลิก `simulator/standalone/index.html` บน Chrome/Edge (ต้องมีอินเทอร์เน็ตเพื่อโหลด A-Frame จาก CDN) แล้วคลิก OVERVIEW บนสถานี เพื่ออ่านเนื้อหาไทย คลิก ENTER ROOM เพื่อเข้าห้องเดิม คีย์ Escape ปิดหน้าต่างได้

## VR
VR ใช้ browser/secure context (HTTPS หรือ localhost) และอุปกรณ์ที่รองรับ WebXR ทดสอบบนอุปกรณ์จริงเพิ่มเติม แผงบทเรียนใน VR เป็น CanvasTexture ซึ่งอาจต้องปรับตำแหน่งหรือขนาดหลังทดสอบจริง ส่วนแผง HTML มีไว้สำหรับเดสก์ท็อป

## ข้อจำกัด
- โมเดลอุปกรณ์เป็น low-poly จาก A-Frame primitives ไม่ใช่โมเดลสินค้าเหมือนจริง
- การแสดงภาษาไทยบน CanvasTexture ขึ้นกับฟอนต์ภาษาไทยที่ติดตั้งในระบบ; HTML บนเดสก์ท็อปรองรับไทยตามปกติ
- ไม่มีการเปลี่ยน API v1, ไม่มีการเพิ่มลำดับสคริปต์ และไม่มีการสร้าง scene ซ้อน
- ยังไม่ได้ตรวจเล่นจริงบน HTC Vive/Valve Index
