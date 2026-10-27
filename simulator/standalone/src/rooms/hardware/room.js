(function () {
  'use strict';
  window.SimulatorRooms=window.SimulatorRooms||{};
  window.SimulatorRooms.hardware=function createHardwareRoom(context){
    var C=window.HardwareRoom.Components,root=null,ui=null,style=null,assembly=null,mounted=false;
    var timers=new Set(),listeners=[],models={},resources=[],progressEl,messageEl,detailEl,installButton,listButtons={},completion,closeButton;
    var popup,infoCanvas,infoTexture,infoMesh,successMesh,vrPanel,vrCanvas,vrTexture,inspectId=null,completed=false,dismissed=false;
    var cameraPoint,ray,pointer;
    var cameraElement=null,lookSnapshot=null,lastMouse=null,viewYaw=0,viewPitch=0;
    function nativeLook(){return cameraElement&&cameraElement.components&&cameraElement.components['look-controls'];}
    function applyDesktopAngles(){
      var look=nativeLook();
      if(look&&look.yawObject&&look.pitchObject){look.yawObject.rotation.y=viewYaw;look.pitchObject.rotation.x=viewPitch;}
      if(cameraElement)cameraElement.object3D.rotation.set(viewPitch,viewYaw,0,'YXZ');
    }
    function syncCameraInput(){
      lastMouse=null;if(!cameraElement||!lookSnapshot)return;
      cameraElement.setAttribute('look-controls','mouseEnabled',mode()?lookSnapshot.mouseEnabled:false);
      if(!mode())applyDesktopAngles();
    }
    function setupMouseLook(){
      cameraElement=document.getElementById('player-camera');if(!cameraElement)return;
      var data=cameraElement.getAttribute('look-controls')||{},look=nativeLook(),rotation=cameraElement.getAttribute('rotation')||{x:0,y:0,z:0};
      lookSnapshot={mouseEnabled:data.mouseEnabled!==false,yaw:look&&look.yawObject?look.yawObject.rotation.y:0,pitch:look&&look.pitchObject?look.pitchObject.rotation.x:0};
      viewYaw=rotation.y*Math.PI/180;viewPitch=rotation.x*Math.PI/180;syncCameraInput();
    }
    function mouseLook(event){
      if(!mounted||mode()||!cameraElement)return;
      if(lastMouse){viewYaw-=(event.clientX-lastMouse.x)*.0018;viewPitch=Math.max(-Math.PI*.38,Math.min(Math.PI*.3,viewPitch-(event.clientY-lastMouse.y)*.0018));applyDesktopAngles();}
      lastMouse={x:event.clientX,y:event.clientY};
    }
    function resetMouseAnchor(){lastMouse=null;}
    function restoreMouseLook(){
      if(cameraElement&&lookSnapshot){
        cameraElement.setAttribute('look-controls','mouseEnabled',lookSnapshot.mouseEnabled);
        var look=nativeLook();if(look&&look.yawObject&&look.pitchObject){look.yawObject.rotation.y=lookSnapshot.yaw;look.pitchObject.rotation.x=lookSnapshot.pitch;}
        cameraElement.object3D.rotation.set(lookSnapshot.pitch,lookSnapshot.yaw,0,'YXZ');
      }
      cameraElement=null;lookSnapshot=null;lastMouse=null;
    }
    function on(node,type,fn,options){node.addEventListener(type,fn,options);listeners.push(function(){node.removeEventListener(type,fn,options);});}
    function later(fn,delay){var handle=setTimeout(function(){timers.delete(handle);if(mounted)fn();},delay);timers.add(handle);return handle;}
    function clearTimers(){timers.forEach(clearTimeout);timers.clear();}
    function el(tag,attrs,parent){var e=C.make(tag,attrs);if(parent)parent.append(e);return e;}
    function text(tag,value,parent){var e=document.createElement(tag);e.textContent=value;if(parent)parent.append(e);return e;}
    function mode(){return context.scene.is('vr-mode');}
    function partFor(id){return C.parts.find(function(p){return p.id===id;});}
    function lines(ctx,value,x,y,max,width){var current='';Array.from(String(value)).forEach(function(char){if(ctx.measureText(current+char).width>width&&current){ctx.fillText(current,x,y);y+=max;current='';}current+=char;});if(current){ctx.fillText(current,x,y);y+=max;}return y;}
    function card(w,h){var T=window.AFRAME.THREE,canvas=document.createElement('canvas');canvas.width=1100;canvas.height=600;var texture=new T.CanvasTexture(canvas);var geometry=new T.PlaneGeometry(w,h),material=new T.MeshBasicMaterial({map:texture,depthTest:false,depthWrite:false,transparent:true});var mesh=new T.Mesh(geometry,material);mesh.renderOrder=1000;mesh.visible=false;root.object3D.add(mesh);resources.push(texture,geometry,material);return {canvas:canvas,texture:texture,mesh:mesh};}
    function paintCard(canvas,title,body){var ctx=canvas.getContext('2d');ctx.fillStyle='#fff9e9';ctx.fillRect(0,0,1100,600);ctx.strokeStyle='#e6b04a';ctx.lineWidth=12;ctx.strokeRect(6,6,1088,588);ctx.fillStyle='#172738';ctx.font='bold 52px sans-serif';var y=lines(ctx,title,36,80,65,1020);ctx.font='38px sans-serif';String(body).split('\n').forEach(function(line){y=lines(ctx,line,36,y+16,55,1020);});}
    function hideInfo(){inspectId=null;if(popup)popup.hidden=true;if(infoMesh)infoMesh.visible=false;}
    function placeInfo(){
      if(!mounted||!inspectId||!context.scene.camera)return;
      var T=window.AFRAME.THREE,point=new T.Vector3();models[inspectId].object3D.getWorldPosition(point);point.y+=.4;
      if(mode()){
        popup.hidden=true;infoMesh.visible=true;
        // Convert the world anchor into this room's scaled local coordinates.
        root.object3D.worldToLocal(point);infoMesh.position.copy(point);context.scene.camera.getWorldQuaternion(infoMesh.quaternion);
      }else{
        infoMesh.visible=false;context.scene.camera.updateMatrixWorld(true);point.project(context.scene.camera);
        if(point.z<-1||point.z>1){popup.hidden=true;return;}
        popup.hidden=false;var rect=context.scene.canvas.getBoundingClientRect(),half=(popup.offsetWidth||320)/2;
        popup.style.left=Math.max(half+8,Math.min(window.innerWidth-half-8,rect.left+(point.x+1)*rect.width/2))+'px';
        popup.style.top=Math.max((popup.offsetHeight||160)+84,rect.top+(1-point.y)*rect.height/2-12)+'px';
      }
    }
    function showInfo(part){
      if(!mounted||assembly.getState().busy)return;
      detailEl.textContent=part.name+' — '+part.description+' · ติดตั้ง: '+part.location;
      if(inspectId!==part.id){inspectId=part.id;popup.textContent=part.name+'\n'+part.description+'\nตำแหน่งติดตั้ง: '+part.location;paintCard(infoCanvas,part.name,part.description+'\nติดตั้ง: '+part.location);infoTexture.needsUpdate=true;}
      placeInfo();drawVR();
    }
    function drawVR(){
      if(!vrCanvas||!assembly)return;
      var state=assembly.getState(),ctx=vrCanvas.getContext('2d');ctx.fillStyle='#10243a';ctx.fillRect(0,0,1100,1100);ctx.fillStyle='#78d4ff';ctx.font='bold 52px sans-serif';ctx.fillText('PC ASSEMBLY LAB',45,90);ctx.fillStyle='white';ctx.font='42px sans-serif';ctx.fillText(progressEl.textContent,45,180);ctx.font='34px sans-serif';var y=lines(ctx,detailEl.textContent,45,290,52,1000);ctx.fillStyle='#9ee5c2';lines(ctx,messageEl.textContent,45,Math.max(490,y+35),52,1000);vrTexture.needsUpdate=true;
    }
    function syncMode(){if(!mounted)return;syncCameraInput();ui.hidden=mode();vrPanel.setAttribute('visible',mode());completion.hidden=!completed||dismissed||mode();successMesh.visible=completed&&!dismissed&&mode();hideInfo();}
    function message(value){messageEl.textContent=value;drawVR();}
    function cancelAnimations(){clearTimers();Object.keys(models).forEach(function(id){['animation__install','animation__rotation','animation__scale'].forEach(function(attr){models[id].removeAttribute(attr);});});}
    function resetModels(){
      hideInfo();completed=false;dismissed=false;completion.hidden=true;successMesh.visible=false;
      C.parts.forEach(function(part){var m=models[part.id],scale=part.id==='cpu'?2.2:1.45;
        // Do not re-append live A-Frame entities on reset.
        m.setAttribute('position',part.origin.join(' '));m.setAttribute('rotation','0 0 0');m.setAttribute('scale',scale+' '+scale+' '+scale);m.setAttribute('visible',true);
        m.object3D.position.set.apply(m.object3D.position,part.origin);m.object3D.rotation.set(0,0,0);m.object3D.scale.set(scale,scale,scale);m.object3D.visible=true;m.object3D.updateMatrixWorld(true);
      });detailEl.textContent='ชี้ที่อุปกรณ์เพื่อดูข้อมูล แล้วคลิกเลือก';
    }
    function refresh(state){progressEl.textContent='ติดตั้งแล้ว '+state.installed.length+' / 7 ชิ้น'+(state.nextPartId?' · ถัดไป: '+partFor(state.nextPartId).name:'');installButton.disabled=!state.selectedPartId||state.busy||state.installed.indexOf(state.selectedPartId)>=0;
      C.parts.forEach(function(part){var button=listButtons[part.id];button.disabled=state.busy;button.style.background=state.installed.indexOf(part.id)>=0?'#226d56':state.selectedPartId===part.id?'#286d9b':'#24435c';});drawVR();}
    function animate(part,callback){hideInfo();var m=models[part.id];m.setAttribute('animation__install',{property:'position',to:part.target.join(' '),dur:650,easing:'easeInOutQuad'});m.setAttribute('animation__rotation',{property:'rotation',to:['board','cpu','cooler','ram','ssd'].indexOf(part.id)>=0?'90 0 0':'0 0 0',dur:650});m.setAttribute('animation__scale',{property:'scale',to:'1 1 1',dur:650});later(callback,700);}
    function complete(){completed=true;dismissed=false;hideInfo();syncMode();}
    function buildUI(){
      style=document.createElement('style');style.textContent='#hardware-room-ui{position:fixed;top:88px;right:12px;z-index:4;width:280px;max-height:calc(100vh - 160px);overflow:auto;padding:16px;background:#102034ed;border:1px solid #527b99;border-radius:12px;color:#edf6ff;font:14px/1.6 system-ui}#hardware-room-ui button{margin:3px;padding:8px;font:inherit}#hardware-room-ui button:disabled{opacity:.45}#hardware-room-ui[hidden],.hardware-overlay[hidden]{display:none!important}.hardware-overlay{position:fixed;z-index:6;border:2px solid #e6b04a;border-radius:12px;background:#fff9e9;color:#172738;white-space:pre-line;padding:16px;font:16px/1.6 system-ui;box-shadow:0 10px 40px #0007}@media(max-width:650px){#hardware-room-ui{width:230px;max-height:40vh;top:auto;bottom:72px}}';document.head.append(style);
      ui=document.createElement('section');ui.id='hardware-room-ui';text('strong',context.i18n.t('hardware.title'),ui);text('p','คลิกเลือกอุปกรณ์ → ชี้เคสและคลิกเพื่อติดตั้ง',ui);progressEl=text('strong','',ui);detailEl=text('p','ชี้อุปกรณ์เพื่อดูชื่อ หน้าที่ และตำแหน่งติดตั้ง',ui);installButton=text('button','ติดตั้งอุปกรณ์ที่เลือก',ui);on(installButton,'click',function(){assembly.placePart('case');});
      var list=el('div',{},ui);C.order.forEach(function(id){var part=partFor(id),button=text('button',part.name,list);listButtons[id]=button;on(button,'click',function(){assembly.selectPart(part);});});
      messageEl=text('p','พร้อมเริ่มประกอบ',ui);messageEl.setAttribute('role','status');messageEl.setAttribute('aria-live','polite');var restart=text('button','เริ่มใหม่',ui);on(restart,'click',function(){assembly.reset();});document.body.append(ui);
      popup=document.createElement('div');popup.className='hardware-overlay';popup.style.cssText='width:min(330px,75vw);transform:translate(-50%,-100%);pointer-events:none';popup.hidden=true;popup.setAttribute('role','status');document.body.append(popup);
      completion=document.createElement('div');completion.className='hardware-overlay';completion.hidden=true;completion.style.cssText='top:25%;left:50%;transform:translateX(-50%);width:min(450px,85vw);text-align:center;background:#edfdf4;border-color:#4eb58a;font-size:20px';completion.setAttribute('role','status');text('strong','ประกอบคอมพิวเตอร์เสร็จสิ้น!',completion);text('p','ติดตั้งอุปกรณ์ครบ 7 / 7 ชิ้น',completion);closeButton=text('button','ปิด',completion);closeButton.style.cssText='background:#d9f5e6;color:#124e36;border:2px solid #4eb58a;font-weight:700';on(closeButton,'click',function(){dismissed=true;syncMode();});document.body.append(completion);
    }
    function vrButton(label,y,action){var button=el('a-plane',{class:'selectable',position:'0 '+y+' .012',width:.86,height:.14,color:'#22628b'},vrPanel);button.dataset.hardwareAction=action;el('a-text',{value:label,align:'center',width:1.7,position:'0 0 .01'},button);}
    function buildPanels(){
      var hover=card(.75,.409);infoCanvas=hover.canvas;infoTexture=hover.texture;infoMesh=hover.mesh;infoMesh.onBeforeRender=function(){if(mode())placeInfo();};
      var success=card(1.2,.655);successMesh=success.mesh;paintCard(success.canvas,'ประกอบคอมพิวเตอร์เสร็จสิ้น!','ติดตั้งอุปกรณ์ครบ 7 / 7 ชิ้น');success.texture.needsUpdate=true;
      successMesh.position.set(0,1.5,2.25);successMesh.onBeforeRender=function(){if(context.scene.camera)context.scene.camera.getWorldQuaternion(successMesh.quaternion);};
      vrPanel=el('a-entity',{position:'1.9 1.6 1',rotation:'0 -25 0',visible:false},root);
      vrCanvas=document.createElement('canvas');vrCanvas.width=1100;vrCanvas.height=1100;var T=window.AFRAME.THREE;vrTexture=new T.CanvasTexture(vrCanvas);var geo=new T.PlaneGeometry(1,1),mat=new T.MeshBasicMaterial({map:vrTexture});resources.push(vrTexture,geo,mat);vrPanel.object3D.add(new T.Mesh(geo,mat));vrButton('INSTALL',-.26,'install');vrButton('RESTART',-.43,'reset');
    }
    function resolve(node){return node&&node.closest?node.closest('[data-part-id],[data-hardware-case],[data-hardware-action]'):null;}
    function handleClick(event){var node=resolve(event.target);if(!node||!root.contains(node))return;event.stopPropagation();if(node.dataset.partId){assembly.selectPart(partFor(node.dataset.partId));}else if(node.dataset.hardwareCase!==undefined||node.dataset.hardwareAction==='install')assembly.placePart('case');else if(node.dataset.hardwareAction==='reset')assembly.reset();}
    function desktopHover(event){
      if(!mounted||mode()||!context.scene.camera)return;var canvas=context.scene.canvas,rect=canvas.getBoundingClientRect();pointer.set((event.clientX-rect.left)/rect.width*2-1,-(event.clientY-rect.top)/rect.height*2+1);ray.setFromCamera(pointer,context.scene.camera);
      var hits=ray.intersectObjects(Object.keys(models).map(function(id){return models[id].object3D;}),true),node=hits.length?hits[0].object:null;
      while(node&&!node.el?.dataset?.partId)node=node.parent;
      if(node&&node.el)showInfo(partFor(node.el.dataset.partId));else hideInfo();
    }
    return {
      mount:function(container){
        if(mounted)return;mounted=true;
        // Fit the room around Main's fixed camera (0, 1.6, 5), without editing it.
        root=el('a-entity',{id:'hardware-room-root',position:'0 0 0',scale:'1.5 1.5 1.5'},container);C.buildLab(document,root);
        C.parts.forEach(function(part,index){C.createTray(root,part,index);models[part.id]=C.createPart(root,part);on(models[part.id],'mouseenter',function(){showInfo(part);});on(models[part.id],'mouseleave',function(){if(inspectId===part.id)hideInfo();});});
        var caseTarget=el('a-box',{class:'selectable',position:'0 1.33 -.14',width:.74,height:.98,depth:.6,material:'transparent: true; opacity: 0; depthWrite: false'},root);caseTarget.dataset.hardwareCase='';
        buildUI();buildPanels();assembly=window.HardwareRoom.Assembly(context,{refresh:refresh,message:message,animate:animate,cancelAnimations:cancelAnimations,reset:resetModels,complete:complete});assembly.refresh();
        var T=window.AFRAME.THREE;ray=new T.Raycaster();pointer=new T.Vector2();
        setupMouseLook();
        on(root,'click',handleClick);on(context.scene,'enter-vr',syncMode);on(context.scene,'exit-vr',syncMode);
        if(context.scene.canvas){on(context.scene.canvas,'mousemove',mouseLook);on(context.scene.canvas,'mousemove',desktopHover);on(context.scene.canvas,'mouseleave',resetMouseAnchor);on(context.scene.canvas,'mouseleave',hideInfo);}else on(context.scene,'render-target-loaded',function(){if(mounted&&context.scene.canvas){on(context.scene.canvas,'mousemove',mouseLook);on(context.scene.canvas,'mousemove',desktopHover);on(context.scene.canvas,'mouseleave',resetMouseAnchor);on(context.scene.canvas,'mouseleave',hideInfo);}});
        on(ui,'mouseenter',resetMouseAnchor);on(ui,'mouseenter',hideInfo);syncMode();context.ui.showMessage('hardware.description');
      },
      unmount:function(){
        if(!mounted)return;mounted=false;restoreMouseLook();if(assembly)assembly.dispose();clearTimers();listeners.forEach(function(remove){remove();});listeners=[];
        [ui,popup,completion,style,root].forEach(function(node){if(node)node.remove();});resources.forEach(function(resource){resource.dispose();});resources=[];C.disposeVisuals();
        models={};listButtons={};inspectId=null;assembly=null;root=null;completed=false;dismissed=false;context.ui.clearMessage();
      }
    };
  };
})();
