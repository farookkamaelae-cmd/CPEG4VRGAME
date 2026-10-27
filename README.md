# Computer Engineering Simulator

พัฒนาโปรเจกต์ทีมที่โฟลเดอร์ [`simulator/standalone/`](simulator/standalone/). นี่คือรุ่นที่เปิด `index.html` ด้วยการดับเบิลคลิกบนคอมพิวเตอร์ได้ และใช้ HTML, JavaScript แบบ classic scripts และ A-Frame

## 🎮 เข้าเล่นเกม

[**กดที่นี่เพื่อเข้าเล่น Computer Engineering Simulator**](https://farookkamaelae-cmd.github.io/CPEG4VRGAME/)

ก่อนเริ่มทำงาน อ่าน [สัญญา API และการแบ่งงาน](simulator/standalone/TEAM_ARCHITECTURE.md) ซึ่งเป็นข้อตกลงกลางฉบับเดียวสำหรับทีม ครอบคลุม API v1, การเพิ่มไฟล์แต่ละห้อง, ลำดับโหลดสคริปต์, ภาษาไทย และเมาส์/VR controller

ห้องที่ขึ้นทะเบียนไว้มี Hardware, Programming และ Network โมเดลและของตกแต่ง Main Hub อยู่ใน `src/rooms/hub/models.js`; การเชื่อม portal อยู่ใน `src/rooms/hub/interactions.js`; ส่วนทะเบียนห้องและ API กลางอยู่ใน `src/main.js`

