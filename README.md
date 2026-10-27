# Computer Engineering Simulator

พัฒนาโปรเจกต์ทีมที่โฟลเดอร์ [`simulator/standalone/`](simulator/standalone/). นี่คือรุ่นที่เปิด `index.html` ด้วยการดับเบิลคลิกบนคอมพิวเตอร์ได้ และใช้ HTML, JavaScript แบบ classic scripts และ A-Frame

▶️ [กดเพื่อเล่นบนเว็บ](https://farookkamaelae-cmd.github.io/CPEG4VRGAME/) — เปิดผ่าน GitHub Pages ไม่ต้องดาวน์โหลดไฟล์โปรเจกต์

เปิดใช้ครั้งแรก: ไปที่ Settings → Pages → Build and deployment → Source แล้วเลือก GitHub Actions จากนั้น workflow จะ deploy เว็บให้อัตโนมัติเมื่อ push เข้า `main`.

ก่อนเริ่มทำงาน อ่าน [สัญญา API และการแบ่งงาน](simulator/standalone/TEAM_ARCHITECTURE.md) ซึ่งเป็นข้อตกลงกลางฉบับเดียวสำหรับทีม ครอบคลุม API v1, การเพิ่มไฟล์แต่ละห้อง, ลำดับโหลดสคริปต์, ภาษาไทย และเมาส์/VR controller

ห้องที่ขึ้นทะเบียนไว้มี Hardware, Programming และ Network โมเดลและของตกแต่ง Main Hub อยู่ใน `simulator/standalone/src/rooms/hub/models.js`; มุมกล้องแต่ละห้องปรับใน `simulator/standalone/shared/camera-locations.js`; โครงสร้างห้อง 8×8×8 เมตรอยู่ใน `simulator/standalone/shared/room-structure.js`; การเชื่อม portal อยู่ใน `simulator/standalone/src/rooms/hub/interactions.js`; ส่วนทะเบียนห้องและ API กลางอยู่ใน `simulator/standalone/src/main.js`






