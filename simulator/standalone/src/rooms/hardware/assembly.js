(function () {
  'use strict';
  window.HardwareRoom = window.HardwareRoom || {};
  window.HardwareRoom.Assembly = function (context, view) {
    var C=window.HardwareRoom.Components,selected=null,installed=[],busy=false,reported=false,epoch=0,disposed=false;
    function state(){return {selectedPartId:selected&&selected.id,installed:installed.slice(),busy:busy,nextPartId:C.order[installed.length]||null,complete:installed.length===7};}
    function refresh(){view.refresh(state());}
    function selectPart(part){if(disposed||busy)return;selected=part;view.message(installed.indexOf(part.id)>=0?'อุปกรณ์นี้ติดตั้งแล้ว':'เลือก '+part.name+' แล้ว ชี้เคสและคลิกเพื่อติดตั้ง');refresh();}
    function placePart(slotId){
      if(disposed||busy)return;
      if(slotId!=='case'){return;}
      if(!selected){view.message('เลือกอุปกรณ์ก่อน แล้วชี้เคสและคลิกเพื่อติดตั้ง');return;}
      if(installed.indexOf(selected.id)>=0){view.message('อุปกรณ์นี้ติดตั้งแล้ว');return;}
      var expected=C.order[installed.length],part=selected;
      if(part.id!==expected){view.message('ผิดลำดับ: ต้องติดตั้ง '+C.parts.find(function(p){return p.id===expected;}).name+' ก่อน');context.emit('hardware:assembly-error',{partId:part.id,expectedPartId:expected,slotId:'case'});return;}
      busy=true;refresh();view.message('กำลังติดตั้ง '+part.name);var token=epoch;
      view.animate(part,function(){
        if(disposed||token!==epoch)return;
        installed.push(part.id);selected=null;busy=false;refresh();
        context.emit('hardware:part-installed',{partId:part.id,slotId:'case',count:installed.length});
        view.message('ติดตั้ง '+part.name+' ในเคสแล้ว');
        if(installed.length===7&&!reported){reported=true;view.message('ประกอบคอมพิวเตอร์เสร็จสิ้น! 7 / 7 ชิ้น');view.complete();context.emit('hardware:complete',{roomId:'hardware',installed:installed.slice(),count:7});}
      });
    }
    return {selectPart:selectPart,placePart:placePart,getState:state,
      reset:function(){if(disposed)return;epoch++;view.cancelAnimations();selected=null;installed=[];busy=false;reported=false;view.reset();refresh();view.message('เริ่มรอบใหม่แล้ว');},
      dispose:function(){disposed=true;epoch++;view.cancelAnimations();selected=null;installed=[];},
      refresh:refresh
    };
  };
})();
