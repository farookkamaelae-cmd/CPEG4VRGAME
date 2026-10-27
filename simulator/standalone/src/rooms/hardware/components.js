(function () {
  'use strict';
  window.HardwareRoom = window.HardwareRoom || {};
  var resources=[];
  var ORDER=['board','cpu','cooler','ram','ssd','psu','gpu'];
  var ASSEMBLY_LABELS=['BOARD','CPU','PASTE/COOLER','RAM','SSD M.2','PSU','GPU'];
  var parts=[
    {id:'board',name:'Mainboard',description:'แผงวงจรหลัก เชื่อมต่ออุปกรณ์ทั้งหมด',location:'แผ่นยึดเมนบอร์ดภายในเคส',color:'#168c70',size:[.46,.025,.4],target:[0,1.4,-.365],origin:[-1,1.12,-.52]},
    {id:'cpu',name:'CPU',description:'ประมวลผลคำสั่งและควบคุมการทำงาน',location:'ซ็อกเก็ต CPU บนเมนบอร์ด',color:'#bbc6cf',size:[.1,.025,.1],target:[-.08,1.48,-.331],origin:[-1.77,1.12,-.52]},
    {id:'cooler',name:'CPU Cooler',description:'ซิลิโคนถ่ายเทความร้อนจาก CPU ไปยังคูลเลอร์',location:'เหนือ CPU บนเมนบอร์ด',color:'#556777',size:[.15,.12,.15],target:[-.08,1.48,-.235],origin:[-1.77,.94,.06]},
    {id:'ram',name:'RAM',description:'หน่วยความจำชั่วคราว DDR4',location:'สล็อต DIMM บนเมนบอร์ด',color:'#44b77b',size:[.025,.1,.29],target:[.16,1.43,-.31],origin:[-1,1.02,.06]},
    {id:'ssd',name:'SSD M.2',description:'จัดเก็บระบบปฏิบัติการและข้อมูลแบบ NVMe',location:'ช่อง M.2 บนเมนบอร์ด',color:'#258dde',size:[.18,.016,.05],target:[-.08,1.27,-.329],origin:[-1.77,.87,.68]},
    {id:'psu',name:'PSU',description:'จ่ายพลังงานไฟฟ้าให้ระบบ',location:'ช่องแหล่งจ่ายไฟด้านล่างเคส',color:'#a9acb5',size:[.3,.16,.2],target:[0,.99,-.15],origin:[-1.77,.97,1.27]},
    {id:'gpu',name:'GPU',description:'ประมวลผลกราฟิกและส่งภาพไปยังจอ',location:'สล็อต PCIe x16 บนเมนบอร์ด',color:'#7b8fa5',size:[.35,.13,.055],target:[0,1.19,-.19],origin:[-1,.94,.68]}
  ];
  function make(tag,attrs){var e=document.createElement(tag);Object.keys(attrs||{}).forEach(function(k){e.setAttribute(k,attrs[k]);});return e;}
  function box(parent,pos,size,color){var e=make('a-box',{position:pos.join(' '),width:size[0],height:size[1],depth:size[2],color:color});parent.append(e);return e;}
  function createPart(root,part){
    var doc=document;
    var p=[part.id,part.name,part.description,[],part.target,part.size,part.color];
    var m=box(root,part.origin,part.size,part.color);
    m.dataset.partId=part.id;m.classList.add('selectable');m.setAttribute('scale',part.id==='cpu'?'2.2 2.2 2.2':'1.45 1.45 1.45');
    m.setAttribute('material',{color:part.color,roughness:.32,metalness:.25});
      // Surface details distinguish the simple procedural component models.
      if(p[0]==='board'){
        box(m,[-.08,.026,-.08],[.12,.025,.12],'#9baab4');
        for(let j=0;j<2;j++)box(m,[.15+j*.045,.025,-.02],[.022,.025,.29],'#182431');
        for(let j=0;j<2;j++)box(m,[-.055,.024,.08+j*.06],[.26,.02,.02],'#c3c6cb');
        for(let j=0;j<8;j++)box(m,[-.21+j*.055,.02,-.18],[.018,.035,.025],'#b4c3c9');
        box(m,[-.18,.035,-.02],[.04,.05,.16],'#97a7b5');
      }
      if(p[0]==='cpu'){box(m,[0,.016,0],[.085,.008,.085],'#d7dde3');for(let j=0;j<6;j++)box(m,[-.04+j*.016,-.018,0],[.006,.008,.085],'#c8ab51');}
      if(p[0]==='ram'){for(let j=0;j<6;j++)box(m,[.018,0,-.11+j*.04],[.009,.045,.025],'#162130');box(m,[0,-.048,0],[.026,.008,.27],'#c0a055');}
      if(p[0]==='gpu')for(let j=0;j<2;j++){const fan=doc.createElement('a-cylinder');fan.setAttribute('radius',.06);fan.setAttribute('height',.012);fan.setAttribute('rotation','90 0 0');fan.setAttribute('position',`${-.09+j*.18} 0 .034`);fan.setAttribute('color','#131d29');m.append(fan);}
      if(p[0]==='cooler'){box(m,[0,-.062,0],[.08,.003,.08],'#aaaeb2');for(let j=0;j<8;j++)box(m,[0,-.045+j*.013,0],[.155,.004,.155],'#b5c0c8');}
      if(p[0]==='psu')for(let j=0;j<7;j++)box(m,[-.115+j*.035,.084,0],[.009,.004,.15],'#8b9aa8');

      // Distinct visible construction details, without permanent name labels.
      if(part.id==='ssd'){
        m.setAttribute('material',{color:'#122e39',roughness:.38,metalness:.2});
        box(m,[0,.012,0],[.105,.009,.038],'#e4edf1');
        box(m,[-.07,.012,0],[.025,.01,.034],'#101720');
        for(let j=0;j<6;j++)box(m,[.081,.011,-.02+j*.008],[.015,.006,.004],'#dab65b');
      }
      if(part.id==='board'){
        for(let j=0;j<6;j++)box(m,[-.12+j*.025,.016,.025],[.008,.003,.10],'#d0b76b');
        box(m,[.03,.028,-.12],[.07,.025,.065],'#172432');
      }
      if(part.id==='cooler'){
        const fan=make('a-cylinder',{position:'0 .065 0',radius:.067,height:.014,color:'#172432'});m.append(fan);
        for(let j=0;j<7;j++){const a=j*Math.PI*2/7;const blade=box(m,[Math.cos(a)*.032,.075,Math.sin(a)*.032],[.05,.006,.018],'#5aa6bd');blade.setAttribute('rotation','0 '+(-j*360/7)+' 0');}
        box(m,[0,.08,0],[.025,.008,.025],'#d7e6ec');
      }
      if(part.id==='ram')for(let j=0;j<6;j++)box(m,[-.018,0,-.11+j*.04],[.009,.045,.025],'#162130');
      if(part.id==='psu'){
        box(m,[0,0,.103],[.22,.10,.008],'#26313d');
        box(m,[-.065,0,.11],[.055,.045,.012],'#101821');
        box(m,[.075,0,.11],[.025,.035,.012],'#c6cfdb');
      }


    return m;
  }
// Procedural room decorations, scoped to the Room 2 entity.
function buildLab(doc, root) {
 const THREE=doc.defaultView.AFRAME.THREE;
 function box(p,s,c,metal=0){const e=doc.createElement('a-box');e.setAttribute('position',p.join(' '));e.setAttribute('width',s[0]);e.setAttribute('height',s[1]);e.setAttribute('depth',s[2]);e.setAttribute('material',{color:c,roughness:.42,metalness:metal});root.append(e);return e;}
 function glow(p,s){const e=box(p,s,'#69caff');e.setAttribute('material','shader: flat; color: #69caff');return e;}
 function cyl(p,r,h,c,rot='0 0 0'){const e=doc.createElement('a-cylinder');e.setAttribute('position',p.join(' '));e.setAttribute('radius',r);e.setAttribute('height',h);e.setAttribute('color',c);e.setAttribute('rotation',rot);root.append(e);return e;}
 function panel(p,w,h,draw){const canvas=doc.createElement('canvas');canvas.width=1200;canvas.height=Math.round(1200*h/w);const ctx=canvas.getContext('2d');const g=ctx.createLinearGradient(0,0,canvas.width,canvas.height);g.addColorStop(0,'#07172b');g.addColorStop(1,'#143d64');ctx.fillStyle=g;ctx.fillRect(0,0,canvas.width,canvas.height);ctx.strokeStyle='#3d7296';ctx.lineWidth=7;ctx.strokeRect(5,5,canvas.width-10,canvas.height-10);draw(ctx,canvas);box([p[0],p[1],p[2]-.025],[w+.04,h+.04,.04],'#101820',.6);const texture=new THREE.CanvasTexture(canvas),geometry=new THREE.PlaneGeometry(w,h),material=new THREE.MeshBasicMaterial({map:texture});resources.push(texture,geometry,material);const mesh=new THREE.Mesh(geometry,material);mesh.position.set(...p);root.object3D.add(mesh);return mesh;}
 const txt=(ctx,t,x,y,size=40,color='#e7f4ff')=>{ctx.fillStyle=color;ctx.font=`${size}px sans-serif`;ctx.fillText(t,x,y);};
 // Full shell inside the 8 x 8 metre Room 2 boundaries.
 box([0,1.5,-3.86],[7.76,3,.08],'#303946');
 box([-3.86,1.5,0],[.08,3,7.76],'#263444');box([3.86,1.5,0],[.08,3,7.76],'#263444');
 // Rear wall: reserve a 1.2 x 2.2 m doorway centred at x=0.
 box([-2.24,1.5,3.86],[3.28,3,.08],'#263444');box([2.24,1.5,3.86],[3.28,3,.08],'#263444');
 box([0,2.6,3.86],[1.2,.8,.08],'#263444');
 for(const x of [-.64,.64])box([x,1.12,3.8],[.08,2.24,.14],'#8a9bac');
 box([0,2.26,3.8],[1.36,.08,.14],'#8a9bac');
 const doorSign=doc.createElement('a-text');doorSign.setAttribute('value','MAIN / CONNECTION');doorSign.setAttribute('align','center');doorSign.setAttribute('position','0 2.5 3.79');doorSign.setAttribute('rotation','0 180 0');doorSign.setAttribute('width','2');root.append(doorSign);
 box([0,2.99,0],[7.76,.08,7.76],'#484e5b');box([0,.012,0],[7.76,.024,7.76],'#737d89',.25);
 // Feature wall behind the bench, joined to the full shell.
 box([0,1.49,-2.1],[7.7,2.96,.08],'#303946');
 for(let x=-3.6;x<3.8;x+=.8)box([x,1.5,-2.04],[.012,2.9,.012],'#111e2b');
 glow([0,1.02,-2.03],[6.7,.022,.018]);glow([0,.15,-.58],[2.65,.022,.025]);
 // One continuous L-shaped workbench: long front plus left return.
 box([-.275,.765,-.15],[3.75,.09,1.3],'#cdd0d4',.2);
 box([-1.35,.765,1.05],[1.6,.09,1.1],'#cdd0d4',.2);
 box([-.275,.817,-.15],[3.65,.012,1.17],'#233650');
 box([-1.35,.817,1.05],[1.5,.012,1.0],'#233650');
 [-1.94,1.37].forEach(x=>{box([x,.37,-.15],[.35,.73,1.1],'#172e45',.25);for(let y=.18;y<.7;y+=.15){box([x,y,.41],[.31,.125,.015],'#263e53');box([x,y+.035,.43],[.23,.012,.022],'#9eacba',.7);}});
 box([-1.35,.37,1.4],[1.5,.73,.3],'#172e45');
 // Upright case: open side faces the seated player (+Z).
 box([0,.855,-.14],[.72,.07,.58],'#172331',.6);
 box([0,1.8,-.14],[.72,.035,.58],'#263647',.6);
 box([0,1.33,-.42],[.72,.95,.025],'#334657',.5);
 for(const x of [-.35,.35])for(const z of [-.4,.13])box([x,1.33,z],[.025,.95,.025],'#a1aeb9',.65);
 // Narrow front fascia on the right; no opaque panel across the open side.
 box([.33,1.33,-.14],[.04,.9,.52],'#172331');
 for(let i=0;i<2;i++)cyl([.357,1.15+i*.34,-.13],.115,.012,'#13202b','0 0 90');
 for(const x of [-.24,.24])box([x,.816,-.14],[.1,.025,.4],'#0e1721');
 glow([-.331,1.33,.14],[.009,.83,.009]);
 // Motherboard standoffs and labelled socket guides in the empty chassis.
 for(const x of [-.2,.2])for(const y of [1.2,1.62])cyl([x,y,-.389],.012,.02,'#c9ac62','90 0 0');
 // Monitor, keyboard and mouse behind the assembly tray.
 box([.88,1.23,-.43],[.61,.39,.035],'#090e17');box([.88,.96,-.43],[.035,.18,.035],'#121b26');box([.88,.858,-.42],[.29,.023,.18],'#182532');
 panel([.88,1.23,-.408],.56,.34,(c)=>{const g=c.createLinearGradient(0,0,1200,600);g.addColorStop(0,'#072242');g.addColorStop(1,'#116aac');c.fillStyle=g;c.fillRect(0,0,1200,730);txt(c,'Build Your PC',70,230,84);txt(c,'From Parts to Performance',70,350,34);});
 box([.88,.853,-.07],[.51,.025,.17],'#111b27');for(let x=.66;x<1.1;x+=.038)for(let z=-.12;z<0;z+=.035)box([x,.869,z],[.028,.008,.023],'#405164');cyl([1.23,.86,-.08],.04,.025,'#1b2635');
 // Knowledge posters with drawn motherboard diagram and assembly sequence.
 // Match the other knowledge displays and keep the diagram ahead of wall trim.
 const layoutPanel=panel([-2.08,2.30,-1.25],.90,1.10,(c,canvas)=>{
  c.fillStyle='#091827';c.fillRect(8,8,canvas.width-16,canvas.height-16);
  txt(c,'MAINBOARD',65,110,85);txt(c,'LAYOUT',65,210,85);
  c.strokeStyle='#7ee3ff';c.lineWidth=9;c.strokeRect(170,300,850,930);
  c.strokeRect(300,420,300,300);txt(c,'CPU',345,595,85);
  for(let j=0;j<4;j++)c.strokeRect(730+j*55,410,30,600);
  txt(c,'RAM',715,1110,65);
  for(let j=0;j<2;j++)c.strokeRect(270,835+j*155,360,45);
  txt(c,'PCIe / M.2',240,1160,60);
  txt(c,'Socket / DDR / PCIe / M.2',60,1390,49,'#aeeaff');
 });
 layoutPanel.material.map.colorSpace=THREE.SRGBColorSpace;

 // Stand the step display clear of wall battens, with large high-contrast labels.
 const stepsPanel=panel([0,2.55,-1.30],3.25,.80,(c,canvas)=>{
   c.fillStyle='#091827';c.fillRect(8,8,canvas.width-16,canvas.height-16);
   c.textAlign='center';c.fillStyle='#ffffff';c.font='bold 48px sans-serif';
   c.fillText('ลำดับการประกอบคอมพิวเตอร์',600,62,1120);
   const cell=160,start=40;
   ASSEMBLY_LABELS.forEach((label,i)=>{
     const x=start+i*cell,center=x+cell/2;
     c.fillStyle='#17384e';c.fillRect(x+4,88,cell-8,193);
     c.fillStyle='#7ee3ff';c.beginPath();c.arc(center,126,26,0,Math.PI*2);c.fill();
     c.fillStyle='#081827';c.font='bold 38px sans-serif';c.fillText(String(i+1),center,140);
     const main=label==='PASTE/COOLER'?'COOLER':label==='SSD M.2'?'SSD':label;
     c.fillStyle='#ffffff';c.font='bold 42px sans-serif';c.fillText(main,center,211,cell-16);
     c.fillStyle='#aeeaff';c.font='bold 27px sans-serif';
     if(label==='PASTE/COOLER')c.fillText('ซิลิโคน',center,258,cell-16);
     if(label==='SSD M.2')c.fillText('M.2',center,258,cell-16);
   });
 });
 stepsPanel.material.map.colorSpace=THREE.SRGBColorSpace;

 // Keep the right knowledge board ahead of wall trim and above the tool rack.
 const knowledgePanel=panel([2.08,2.30,-1.25],.90,1.10,(c,canvas)=>{
   c.fillStyle='#091827';c.fillRect(8,8,canvas.width-16,canvas.height-16);
   txt(c,'LEARN / BUILD',60,125,88);
   ['รู้จักอุปกรณ์คอมพิวเตอร์','เข้าใจหน้าที่และการเชื่อมต่อ','ฝึกเลือกและติดตั้งอุปกรณ์','ตรวจสอบก่อนส่งงาน'].forEach((t,i)=>txt(c,t,60,355+i*190,62));
   txt(c,'Small parts. Big dreams.',60,1140,52,'#aeeaff');
 });
 knowledgePanel.material.map.colorSpace=THREE.SRGBColorSpace;
 // Ceiling light frame and track fixtures.
 for(const x of [-2.9,2.9]){box([x,2.91,0],[.035,.035,2.7],'#101820');for(let z=-1.05;z<1.4;z+=1.1){cyl([x,2.78,z],.065,.18,'#0e1721');cyl([x,2.68,z],.052,.008,'#eff8ff');}}
 for(const z of [-1.1,1.1])glow([0,2.94,z],[4.4,.018,.04]);for(const x of [-2.2,2.2])glow([x,2.94,0],[.04,.018,2.2]);
 // Side tool cabinet and pegboard (decorative, no second workbench).
 box([2.65,.48,-.6],[.82,.95,.64],'#1e2c3b',.35);for(let y=.17;y<.95;y+=.15){box([2.65,y,-.265],[.74,.13,.03],'#32404f');box([2.65,y+.04,-.24],[.58,.018,.025],'#a6afbb',.7);}
 box([2.7,1.32,-1.12],[.88,.66,.035],'#152638');for(let x=2.34;x<3.1;x+=.12){cyl([x,1.35,-1.07],.015,.28,'#a3acb4');cyl([x,1.51,-1.07],.024,.12,'#168ed2');}
 // Plant and pot on the left side of the bench.
 cyl([-2.65,.14,-.7],.15,.28,'#b4bec9');for(let i=0;i<8;i++){const a=i*Math.PI/4;const e=box([-2.65+Math.cos(a)*.1,.48+ i*.025,-.7+Math.sin(a)*.1],[.045,.5,.07],'#427659');e.setAttribute('rotation',`${Math.cos(a)*25} 0 ${Math.sin(a)*25}`);}
 addLabDetails(doc,root);
}
// Visual detail only. No input, assembly state, camera or Main changes.
function addLabDetails(doc,root){
 const T=doc.defaultView.AFRAME.THREE;
 const entity=(tag,attrs)=>{const e=doc.createElement(tag);for(const [k,v] of Object.entries(attrs))e.setAttribute(k,v);root.append(e);return e;};
 const box=(p,s,c,metal=.2)=>entity('a-box',{position:p.join(' '),width:s[0],height:s[1],depth:s[2],material:`color: ${c}; roughness: .45; metalness: ${metal}`});
 const cylinder=(p,r,h,c,rot='0 0 0')=>entity('a-cylinder',{position:p.join(' '),radius:r,height:h,rotation:rot,material:`color: ${c}; roughness: .5; metalness: .55`});
 // Fine tile joints and skirting ground the room in a physical scale.
 for(let x=-3.6;x<3.8;x+=.65)box([x,.026,0],[.003,.001,7.65],'#66717d',.1);
 for(let z=-3.6;z<3.8;z+=.65)box([0,.026,z],[7.65,.001,.003],'#66717d',.1);
 box([0,.065,-1.585],[7.65,.1,.025],'#111d29');
 for(let x=-3.5;x<3.6;x+=.8){box([x,2.92,-1.58],[.78,.12,.04],'#3f4853');for(const y of [.5,1.8,2.7])cylinder([x,y,-1.57],.006,.008,'#a8b2be','90 0 0');}
 // White diffusers as in the reference, alongside the blue accent strips.
 for(const z of [-1.08,1.08])box([0,2.925,z],[4.45,.018,.045],'#f2f1e8');
 for(const x of [-2.2,2.2])box([x,2.925,0],[.045,.018,2.18],'#f2f1e8');
 // Actual spotlights, limited to three to keep the scene usable in VR.
 for(const x of [-2,0,2])entity('a-light',{type:'spot',position:`${x} 2.72 .2`,rotation:'-48 0 0',color:'#fff2dd',intensity:.65,angle:52,penumbra:.7,distance:6,decay:2});
 entity('a-light',{type:'point',position:'0 1.45 .8',color:'#b5dcff',intensity:.45,distance:4,decay:2});
 // Brushed aluminium edging and broad dark cabinet faces beneath the L bench.
 box([-.275,.755,.507],[3.75,.025,.022],'#b1b9c2',.8);
 box([-2.16,.755,.4],[.025,.025,2.35],'#b1b9c2',.8);
 box([-.18,.37,-.65],[2.8,.65,.035],'#10273b');
 box([-1.35,.19,1.55],[1.5,.025,.015],'#66bfff');
 // Case ventilation, rear expansion brackets, fasteners and fan blades.
 for(let i=0;i<16;i++)box([-.28+i*.036,1.822,-.14],[.011,.004,.42],'#101a25');
 for(let y=1.07;y<1.65;y+=.055)box([-.28,y,-.398],[.09,.025,.012],'#131f2b');
 for(const x of [-.334,.334])for(const y of [.9,1.75])cylinder([x,y,.147],.009,.01,'#d0d6dc','90 0 0');
 for(let i=0;i<2;i++){
  const y=1.15+i*.34;cylinder([.367,y,-.13],.035,.017,'#536171','0 0 90');
  for(let b=0;b<7;b++){const a=b*Math.PI*2/7;const blade=box([.368,y+Math.cos(a)*.065,-.13+Math.sin(a)*.065],[.012,.025,.075],'#546273');blade.setAttribute('rotation',`${b*360/7} 0 0`);}
 }
 // Rubber casters and metal drawer rails on the existing tool cabinet.
 for(const x of [2.34,2.96])for(const z of [-.82,-.37])cylinder([x,.055,z],.055,.035,'#111923','0 0 90');
 for(let y=.17;y<.95;y+=.15)box([2.65,y-.025,-.242],[.7,.008,.012],'#0c1823');
 // Pegboard holes and tool hooks.
 for(let x=2.31;x<3.1;x+=.065)for(let y=1.04;y<1.64;y+=.065)cylinder([x,y,-1.095],.005,.005,'#6d8190','90 0 0');
 // Stationery and a small plant beside the monitor.
 cylinder([1.44,.9,-.43],.05,.15,'#273a49');for(let i=0;i<5;i++)cylinder([1.42+i*.01,1.02,-.43],.004,.2,'#273139');
 cylinder([1.45,.88,-.65],.06,.11,'#646f78');
 for(let i=0;i<7;i++){const a=i*2.4;const leaf=entity('a-sphere',{position:`${1.45+Math.cos(a)*.045} ${1.02+i*.014} ${-.65+Math.sin(a)*.045}`,radius:.06,scale:'.23 1.6 .3',color:'#538b52'});leaf.setAttribute('rotation',`${i*9} 0 ${i*13}`);}
 // Reference-style office chair, low enough to leave the work surface visible.
 box([.5,.48,1.28],[.48,.08,.46],'#141e28');box([.5,.78,1.49],[.48,.5,.065],'#25313d');
 cylinder([.5,.25,1.28],.035,.44,'#68717b');
 for(let i=0;i<5;i++){const a=i*Math.PI*2/5;const leg=box([.5+Math.cos(a)*.13,.08,1.28+Math.sin(a)*.13],[.32,.03,.035],'#1c2835');leg.setAttribute('rotation',`0 ${-i*72} 0`);cylinder([.5+Math.cos(a)*.28,.055,1.28+Math.sin(a)*.28],.04,.025,'#111b26','0 0 90');}
 for(const x of [.2,.8]){box([x,.64,1.25],[.065,.04,.3],'#1b2734');box([x,.55,1.29],[.025,.18,.025],'#53606d');}
 // Side-wall laboratory branding, using native text to remain crisp.
 const brand=entity('a-text',{value:'COMPUTER\nHARDWARE LAB\n\nLEARN / BUILD / EXPLORE',position:'-3.79 2.1 -.4',rotation:'0 90 0',width:2.8,color:'#78d4ff',align:'center'});
}

  window.HardwareRoom.Components={
    parts:parts,order:ORDER,make:make,box:box,createPart:createPart,
    buildLab:buildLab,
    createTray:function(root,part,index){
      var accent=['#45cfa5','#efc56b','#73c8ec','#8ddd80','#ba9bea','#e8a77e','#82a7ed'][index];
      var x=part.origin[0],z=part.origin[2],scale=part.id==='cpu'?2.2:1.45;
      var lift=Math.max(0,part.origin[1]-part.size[1]*scale/2-.86);
      var tray=make('a-entity',{position:'0 '+lift+' 0'});root.append(tray);
      if(lift>.01)box(root,[x,.825+lift/2,z],[.46,lift,.29],'#15293b');
      box(tray,[x,.833,z],[.64,.022,.43],'#0c1c2b');
      box(tray,[x,.847,z],[.59,.008,.38],index%2?'#284256':'#203446');
      for(var side of [-1,1])box(tray,[x+side*.312,.855,z],[.012,.02,.43],accent);
      for(var edge of [-1,1])box(tray,[x,.855,z+edge*.209],[.64,.02,.012],accent);
    },
    disposeVisuals:function(){resources.forEach(function(r){r.dispose();});resources=[];}
  };
})();
