// Hub interactions: station-anchored popup for both Desktop and VR.
window.SimulatorHub = window.SimulatorHub || {};
window.SimulatorHub.Interactions = {
  bind: function (root, context) {
    var lessons = {
      hardware: {
        title: 'มุมเรียนรู้ฮาร์ดแวร์ (Hardware Corner)',
        intro: 'ฮาร์ดแวร์คืออุปกรณ์ที่จับต้องได้ทั้งภายในและภายนอกคอมพิวเตอร์ โดยแต่ละชิ้นทำงานร่วมกันเพื่อประมวลผล เก็บข้อมูล และแสดงผล',
        items: [
          ['CPU', 'หน่วยประมวลผลหลักของคอมพิวเตอร์ ทำหน้าที่คำนวณ ประมวลผลคำสั่ง และควบคุมการทำงานของระบบ'],
          ['RAM', 'หน่วยความจำหลักชั่วคราว ใช้เก็บข้อมูลและโปรแกรมที่กำลังทำงาน เพื่อให้เข้าถึงได้รวดเร็ว'],
          ['GPU', 'หน่วยประมวลผลกราฟิก ใช้สำหรับภาพ วิดีโอ งานกราฟิก และช่วยเร่งการประมวลผลบางประเภท'],
          ['SSD', 'อุปกรณ์เก็บข้อมูลความเร็วสูง ใช้เก็บระบบปฏิบัติการ ไฟล์ และโปรแกรมต่าง ๆ'],
          ['Motherboard', 'แผงวงจรหลักที่เชื่อมต่อ CPU, RAM, SSD, GPU และอุปกรณ์อื่น ๆ ให้สื่อสารกันได้'],
          ['PSU', 'แหล่งจ่ายไฟของคอมพิวเตอร์ ทำหน้าที่แปลงและจ่ายไฟให้ชิ้นส่วนต่าง ๆ ภายในเครื่อง'],
          ['CPU Cooler', 'อุปกรณ์ระบายความร้อนของ CPU เพื่อป้องกันความร้อนสูงเกินไปขณะทำงาน']
        ],
        note: 'ลองคิดดู: RAM กับ SSD ต่างกันอย่างไร?',
        room: 'hardware'
      },
      network: {
        title: 'มุมเรียนรู้เครือข่าย LAN (LAN Network Corner)',
        intro: 'LAN คือเครือข่ายคอมพิวเตอร์ในพื้นที่จำกัด เช่น ห้องเรียน ห้องปฏิบัติการ หรือสำนักงาน การรู้จักอุปกรณ์และขั้นตอนการเข้าหัวสายจะช่วยให้เชื่อมต่อเครือข่ายได้อย่างถูกต้อง',
        items: [
          ['สาย LAN', 'ใช้เป็นสายสัญญาณสำหรับเชื่อมต่ออุปกรณ์เครือข่ายเข้าด้วยกัน'],
          ['หัว RJ45', 'ใช้ต่อปลายสายแลน เพื่อเชื่อมต่อเข้ากับพอร์ตเครือข่ายของอุปกรณ์'],
          ['คีมเข้าหัว', 'ใช้ย้ำหรือบีบหัว RJ45 ให้แน่นและพร้อมใช้งาน'],
          ['คีมปอกสาย', 'ใช้ปอกฉนวนด้านนอกของสาย LAN อย่างระมัดระวัง'],
          ['คีมตัดสาย', 'ใช้ตัดปลายสายให้เรียบและได้ขนาดที่เหมาะสม'],
          ['ปลอกหุ้มหัว RJ45', 'ช่วยป้องกันหัวสายและทำให้งานดูเรียบร้อยขึ้น'],
          ['เครื่องทดสอบสาย LAN', 'ใช้ตรวจสอบว่าสายต่อถูกต้องครบทุกเส้นหรือไม่'],
          ['มาตรฐาน T568B', 'ลำดับสีจากซ้ายไปขวา: ขาวส้ม, ส้ม, ขาวเขียว, น้ำเงิน, ขาวน้ำเงิน, เขียว, ขาวน้ำตาล, น้ำตาล']
        ],
        note: 'ขั้นตอนเบื้องต้น: ปอกสาย → เรียงสีตาม T568B → ใส่หัว RJ45 → เข้าหัวด้วยคีม → ทดสอบสาย',
        room: 'network'
      },
      programming: {
        title: 'มุมเรียนรู้การเขียนโปรแกรม (Programming Corner)',
        intro: 'Programming คือการเขียนคำสั่งให้คอมพิวเตอร์ทำงานตามที่เราต้องการ ภาษาแต่ละชนิดมีรูปแบบการเขียนและจุดเด่นที่แตกต่างกัน',
        items: [
          ['Python', 'อ่านง่าย เหมาะสำหรับผู้เริ่มต้น และนิยมใช้ในงานทั่วไป งานวิเคราะห์ข้อมูล และ AI'],
          ['C++', 'นิยมใช้เรียนพื้นฐานการเขียนโปรแกรม และงานที่ต้องการความเร็วหรือการควบคุมการทำงานอย่างละเอียด'],
          ['Java', 'เป็นภาษาเชิงวัตถุ ใช้พัฒนาโปรแกรมได้หลากหลาย ทั้งแอปพลิเคชันและระบบขนาดใหญ่']
        ],
        code: [
          ['Python', 'print("Hello World")'],
          ['C++', 'std::cout << "Hello World";'],
          ['Java', 'System.out.println("Hello World");']
        ],
        note: 'ทั้งสามภาษามีจุดเด่นต่างกัน แต่ล้วนใช้สื่อสารคำสั่งให้คอมพิวเตอร์ทำงานได้',
        room: 'programming'
      }
    };

    var camera = context.scene && context.scene.querySelector('[camera]');
    var panel = null;
    var panelTexture = null;
    var panelMesh = null;
    var panelBackMesh = null;
    var buttons = [];
    var activeZone = null;
    var page = 0;
    var itemsPerPage = 4;
    var context2d = null;
    var canvas = null;
    var glowCleanups = [];

    function rounded(ctx, x, y, w, h, radius, fill, stroke) {
      ctx.beginPath(); ctx.roundRect(x, y, w, h, radius);
      if (fill) { ctx.fillStyle = fill; ctx.fill(); }
      if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 2; ctx.stroke(); }
    }
    function wrap(ctx, str, x, y, width, lineHeight, maxLines) {
      var line = '';
      var lines = 0;
      Array.from(String(str)).forEach(function (ch) {
        if (ctx.measureText(line + ch).width > width && line) {
          if (lines < maxLines) ctx.fillText(line, x, y + lines * lineHeight);
          lines++;
          line = '';
        }
        line += ch;
      });
      if (line && lines < maxLines) ctx.fillText(line, x, y + lines * lineHeight);
      return Math.min(lines + (line ? 1 : 0), maxLines);
    }
    function paintPanel() {
      if (!context2d || !activeZone) return;
      var data = lessons[activeZone];
      var ctx = context2d, w = canvas.width, h = canvas.height;
      var accent = activeZone === 'hardware' ? '#52e3d0' : (activeZone === 'network' ? '#ffd36d' : '#d0a0ff');
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = '#06121d';
      ctx.fillRect(0, 0, w, h);
      rounded(ctx, 8, 8, w - 16, h - 16, 34, '#091b2b', '#48badb');
      rounded(ctx, 12, 12, w - 24, 15, 6, accent);
      ctx.fillStyle = '#8ce9ff'; ctx.font = 'bold 25px Tahoma, sans-serif';
      ctx.fillText('COMPUTER ENGINEERING  /  LEARNING HUB', 49, 66);
      ctx.fillStyle = '#f0f9ff'; ctx.font = 'bold 40px Tahoma, sans-serif';
      wrap(ctx, data.title, 49, 123, w - 100, 47, 2);
      rounded(ctx, 44, 170, w - 88, 116, 18, '#17324b');
      ctx.fillStyle = '#e3f2fc'; ctx.font = '26px Tahoma, sans-serif';
      wrap(ctx, data.intro, 66, 212, w - 135, 34, 3);
      ctx.fillStyle = accent; ctx.font = 'bold 26px Tahoma, sans-serif';
      ctx.fillText('หัวข้อสำคัญ', 50, 327);
      var pages = Math.max(1, Math.ceil(data.items.length / itemsPerPage));
      var section = data.items.slice(page * itemsPerPage, (page + 1) * itemsPerPage);
      section.forEach(function (item, i) {
        var col = i % 2, row = Math.floor(i / 2);
        var left = 44 + col * 461, top = 354 + row * 235;
        rounded(ctx, left, top, 447, 219, 18, '#203b55', '#365a77');
        rounded(ctx, left + 17, top + 19, 8, 181, 4, accent);
        ctx.fillStyle = accent; ctx.font = 'bold 30px Tahoma, sans-serif';
        ctx.fillText(item[0], left + 39, top + 49);
        ctx.fillStyle = '#f0f5fb'; ctx.font = '25px Tahoma, sans-serif';
        wrap(ctx, item[1], left + 39, top + 91, 382, 33, 4);
      });
      if (data.code && page === pages - 1) {
        ctx.fillStyle = '#b8deef'; ctx.font = '22px Tahoma, sans-serif';
        var codes = data.code.map(function (item) { return item[0] + ': ' + item[1]; }).join('    |    ');
        wrap(ctx, codes, 58, 829, w - 115, 29, 2);
      }
      rounded(ctx, 44, 852, w - 88, 67, 14, '#27445f');
      ctx.fillStyle = '#ffe39a'; ctx.font = '25px Tahoma, sans-serif';
      wrap(ctx, data.note, 64, 894, w - 123, 29, 1);
      ctx.fillStyle = '#9ccce1'; ctx.font = 'bold 25px Tahoma, sans-serif';
      ctx.fillText('หน้าที่ ' + (page + 1) + ' / ' + pages, 52, 971);
      ctx.fillStyle = '#90b5c7'; ctx.font = '23px Tahoma, sans-serif';
      ctx.fillText('เลือกถัดไปเพื่ออ่านหัวข้อเพิ่มเติม', 52, 1015);
      if (panelTexture) panelTexture.needsUpdate = true;
      buttons.forEach(function (b) {
        b.entity.object3D.visible = (b.action !== 'prev' || page > 0) && (b.action !== 'next' || page < pages - 1);
      });
    }
    function buttonTexture(label, color) {
      var c = document.createElement('canvas'); c.width = 512; c.height = 128;
      var g = c.getContext('2d');
      rounded(g, 5, 5, 502, 118, 22, color, '#bdefff');
      g.fillStyle = '#ffffff'; g.font = 'bold 39px Tahoma, sans-serif';
      g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(label, 256, 65);
      var t = new THREE.CanvasTexture(c);
      if (THREE.SRGBColorSpace) t.colorSpace = THREE.SRGBColorSpace;
      return t;
    }
    function applyGlow(node) {
      if (!node || !node.getObject3D) return;
      var mesh = node.getObject3D('mesh');
      if (!mesh) return;
      var originalScale = node.object3D.scale.clone();
      function eachMaterial(fn) {
        mesh.traverse(function (obj) {
          if (!obj.material) return;
          var mats = Array.isArray(obj.material) ? obj.material : [obj.material];
          mats.forEach(fn);
        });
      }
      function onEnter() {
        eachMaterial(function (mat) {
          if (mat.emissive) {
            if (mat.userData._origEmissive === undefined) {
              mat.userData._origEmissive = mat.emissive.clone ? mat.emissive.clone() : mat.emissive;
              mat.userData._origEmissiveIntensity = mat.emissiveIntensity || 0;
            }
            mat.emissive.set('#ffffff');
            mat.emissiveIntensity = Math.max(mat.userData._origEmissiveIntensity || 0, 0.38);
          }
        });
        node.object3D.scale.set(originalScale.x * 1.04, originalScale.y * 1.04, originalScale.z * 1.04);
      }
      function onLeave() {
        eachMaterial(function (mat) {
          if (mat.emissive && mat.userData._origEmissive !== undefined) {
            if (mat.userData._origEmissive.copy) mat.emissive.copy(mat.userData._origEmissive);
            mat.emissiveIntensity = mat.userData._origEmissiveIntensity || 0;
          }
        });
        node.object3D.scale.copy(originalScale);
      }
      node.addEventListener('mouseenter', onEnter);
      node.addEventListener('mouseleave', onLeave);
      glowCleanups.push(function () {
        node.removeEventListener('mouseenter', onEnter);
        node.removeEventListener('mouseleave', onLeave);
      });
    }
    function applyGlowToAll(scope) {
      (scope || root).querySelectorAll('.selectable').forEach(applyGlow);
    }
    function addButton(action, label, x, color) {
      var entity = document.createElement('a-entity');
      entity.setAttribute('position', x + ' -0.88 0.04');
      entity.setAttribute('class', 'selectable');
      entity.setAttribute('data-hub-action', action);
      var texture = buttonTexture(label, color);
      var mesh = new THREE.Mesh(
        new THREE.PlaneGeometry(.52, .16),
        new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide, depthTest: true, depthWrite: true, transparent: false, opacity: 1 })
      );
      mesh.renderOrder = 1004;
      entity.setObject3D('mesh', mesh);
      panel.appendChild(entity);
      buttons.push({ entity: entity, action: action, mesh: mesh, texture: texture });
      applyGlow(entity);
    }
    function showPanel(zone) {
      var data = lessons[zone];
      if (!data || !window.THREE) return;
      var station = root.querySelector('[data-hub-station="' + zone + '"]');
      if (!station) return;
      hidePanel();
      activeZone = zone;
      page = 0;
      panel = document.createElement('a-entity');
      // Popup belongs to the selected table, not the camera; stays in place when user turns.
      // Popup is physically anchored over the station work surface (desk height ~1 m).
      // Large readable display, fixed to the selected station, not the camera.
      // Its bottom edge stays above the desk at 1.0 m.
      panel.setAttribute('position', '0 2.28 0.72');
      panel.setAttribute('rotation', '-7 0 0');
      panel.setAttribute('scale', '0.001 0.001 0.001');
      panel.setAttribute('animation__appear',
        'property: scale; from: 0.001 0.001 0.001; to: 1.12 1.12 1.12; dur: 320; easing: easeOutBack');
      panel.setAttribute('data-hub-panel', '');
      canvas = document.createElement('canvas');
      canvas.width = 1000; canvas.height = 1080;
      context2d = canvas.getContext('2d');
      panelTexture = new THREE.CanvasTexture(canvas);
      if (THREE.SRGBColorSpace) panelTexture.colorSpace = THREE.SRGBColorSpace;
      var backEntity = document.createElement('a-entity');
      var backMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(1.98, 1.90),
        new THREE.MeshBasicMaterial({ color: '#06111b', side: THREE.DoubleSide, depthTest: true, depthWrite: true, transparent: false, opacity: 1 })
      );
      backMesh.renderOrder = 999;
      backEntity.setObject3D('mesh', backMesh);
      backEntity.setAttribute('position', '0 0 -0.01');
      panel.appendChild(backEntity);
      panelBackMesh = backMesh;
      panelMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(1.92, 1.84),
        new THREE.MeshBasicMaterial({ map: panelTexture, side: THREE.DoubleSide, depthTest: true, depthWrite: true, transparent: false, opacity: 1 })
      );
      panelMesh.renderOrder = 1000;
      panel.setObject3D('mesh', panelMesh);
      // Mount to this station only. No camera parenting or camera-tracking tick.
      station.appendChild(panel);
      addButton('close', 'ปิดข้อมูล', -.72, '#c55468');
      addButton('prev', 'ก่อนหน้า', -.24, '#2b82ae');
      addButton('next', 'ถัดไป', .24, '#2b82ae');
      addButton('panel-enter', 'เข้าห้องฝึก', .72, '#1b9b88');
      paintPanel();
    }
    function hidePanel() {
      if (panel) panel.remove();
      buttons.forEach(function (b) { b.mesh.geometry.dispose(); b.mesh.material.dispose(); b.texture.dispose(); });
      buttons = [];
      if (panelBackMesh) { panelBackMesh.geometry.dispose(); panelBackMesh.material.dispose(); }
      if (panelMesh) { panelMesh.geometry.dispose(); panelMesh.material.dispose(); }
      if (panelTexture) panelTexture.dispose();
      panel = null; panelMesh = null; panelBackMesh = null; panelTexture = null;
      context2d = null; canvas = null; activeZone = null; page = 0;
    }
    function onClick(event) {
      var target = event.target.closest('[data-hub-action]');
      if (!target) return;
      var action = target.getAttribute('data-hub-action');
      var zone = target.getAttribute('data-hub-zone');
      if ((action === 'overview' || action === 'enter') && !root.contains(target)) return;
      if (action === 'overview') showPanel(zone);
      else if (action === 'enter') context.navigation.openRoom(zone);
      else if (action === 'close') hidePanel();
      else if (action === 'prev' && page > 0) { page--; paintPanel(); }
      else if (action === 'next' && activeZone && page < Math.ceil(lessons[activeZone].items.length / itemsPerPage) - 1) { page++; paintPanel(); }
      else if (action === 'panel-enter' && activeZone) { var destination = lessons[activeZone].room; hidePanel(); context.navigation.openRoom(destination); }
    }
    function onKeyDown(event) { if (event.key === 'Escape' && panel) hidePanel(); }

    root.addEventListener('click', onClick);
    
    document.addEventListener('keydown', onKeyDown);
    applyGlowToAll(root);

    return function unbind() {
      root.removeEventListener('click', onClick);
      
      document.removeEventListener('keydown', onKeyDown);
      glowCleanups.forEach(function (fn) { fn(); });
      glowCleanups = [];
      hidePanel();
    };
  }
};
