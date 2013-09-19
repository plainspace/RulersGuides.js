javascript:(function(){var Event=function(){'use strict';this.attach=function(evtName,element,listener,capture){var evt='',useCapture=(capture===undefined)?true:capture,handler=null;if(window.addEventListener===undefined){evt='on'+evtName;handler=function(evt,listener){element.attachEvent(evt,listener);return listener;};}else{evt=evtName;handler=function(evt,listener,useCapture){element.addEventListener(evt,listener,useCapture);return listener;};}return handler.apply(element,[evt,function(ev){var e=ev||event,src=e.srcElement||e.target;listener(e,src);},useCapture]);};this.detach=function(evtName,element,listener,capture){var evt='',useCapture=(capture===undefined)?true:capture;if(window.removeEventListener===undefined){evt='on'+evtName;element.detachEvent(evt,listener);}else{evt=evtName;element.removeEventListener(evt,listener,useCapture);}};this.stop=function(evt){evt.cancelBubble=true;if(evt.stopPropagation){evt.stopPropagation();}};this.prevent=function(evt){if(evt.preventDefault){evt.preventDefault();}else{evt.returnValue=false;}};};var Dragdrop=function(evt){'use strict';var elem=null,started=0,self=this,moveHandler=null,doc=document.documentElement,body=document.body,gWidth=(document.body.scrollWidth>document.documentElement.clientWidth)?document.body.scrollWidth:document.documentElement.clientWidth,gHeight=Math.max(body.scrollHeight,body.offsetHeight,doc.clientHeight,doc.scrollHeight,doc.offsetHeight),move=function(e){var xDiff=e.clientX-elem.posX,yDiff=e.clientY-elem.posY,x=xDiff-(xDiff%elem.snap)+'px',y=yDiff-(yDiff%elem.snap)+'px';if(started===1){switch(elem.mode){case 0:elem.style.top=y;elem.style.left=x;break;case 1:elem.style.left=x;break;case 2:elem.style.top=y;break;}if(elem.mode!==2){if(xDiff<=elem.minX){elem.style.left=elem.minX+'px';}if(elem.offsetLeft+elem.offsetWidth>=elem.maxX){elem.style.left=(elem.maxX-elem.offsetWidth)+'px';}}if(elem.mode!==1){if(yDiff<=elem.minY){elem.style.top=elem.minY+'px';}if(elem.offsetTop+elem.offsetHeight>=elem.maxY){elem.style.top=(elem.maxY-elem.offsetHeight)+'px';}}elem.onMove(elem);}},start=function(e,src){if(src.className.indexOf('draggable')!==-1){evt.prevent(e);moveHandler=evt.attach('mousemove',document,move,true);started=1;elem=src;elem.posX=e.clientX-elem.offsetLeft;elem.posY=e.clientY-elem.offsetTop;if(elem.mode===undefined){self.set(elem);}elem.onStart(elem);if(elem.setCapture){elem.setCapture();}}},stop=function(){if(started===1){started=0;elem.onStop(elem);evt.detach('mousemove',document,moveHandler);if(elem.releaseCapture){elem.releaseCapture();}}};evt.attach('mousedown',document,start,false);evt.attach('mouseup',document,stop,false);this.start=start;this.set=function(element,elemOptions){var options=elemOptions||{};elem=(typeof element==='string')?document.getElementById(element):element;elem.mode=options.mode||0;elem.minX=options.minX||0;elem.maxX=options.maxX||gWidth;elem.minY=options.minY||0;elem.maxY=options.maxY||gHeight;elem.snap=options.snap||1;elem.onStart=options.onstart||function(){};elem.onMove=options.onmove||function(){};elem.onStop=options.onstop||function(){};elem.style.left=elem.offsetLeft+'px';elem.style.top=elem.offsetTop+'px';elem.unselectable='on';};};var RulersGuides=function(evt,dragdrop){'use strict';var doc=document.documentElement,body=document.body,gWidth=0,gHeight=0,Ruler=function(type,size){var i=0,ruler=document.createElement('div'),span=document.createElement('span'),label=null,labelTxt=null,spanFrag=document.createDocumentFragment(),cnt=Math.floor(size/2);ruler.className='ruler '+type;if(type==='h'){ruler.style.width=size+'px';}else{ruler.style.height=size+'px';}for(i;i<cnt;i=i+1){span=span.cloneNode(false);if(i% 25===0){span.className='milestone';if(i>0){label=span.cloneNode(false);label.className='label';if(i<50){label.className+=' l10';}else if(i>=50&&i<500){label.className+=' l100';}else if(i>=500){label.className+=' l1000';}labelTxt=document.createTextNode(i*2);label.appendChild(labelTxt);span.appendChild(label);}span.className='milestone';}else if(i%5===0){span.className='major';}else{span.className='';span.removeAttribute('class');}spanFrag.appendChild(span);}ruler.appendChild(spanFrag);return ruler;},hRuler=null,vRuler=null,mode=2,guides={},guidesCnt=0,gUid='',rulerStatus=1,guideStatus=1,hBound=0,vBound=0,removeInboundGuide=function(guide,gUid){if(rulerStatus===1&&guideStatus===1&&((guide.className==='guide h draggable'&&guide.offsetTop<hBound)||(guide.className==='guide v draggable'&&guide.offsetLeft<vBound))){document.body.removeChild(guide);delete guides[gUid];guidesCnt=guidesCnt-1;}},removeInboundGuides=function(){var i;for(i in guides){if(guides.hasOwnProperty(i)){removeInboundGuide(guides[i],i);}}},toggleGuides=function(){var i;guideStatus=1-guideStatus;for(i in guides){if(guides.hasOwnProperty(i)){guides[i].style.display=(guideStatus===1)?'block':'none';}}},toggleRulers=function(){rulerStatus=1-rulerStatus;if(rulerStatus===1){vRuler.style.display='block';hRuler.style.display='block';removeInboundGuides();}else{vRuler.style.display='none';hRuler.style.display='none';}},cssText='html,body{margin:0;padding:0}.guide{position:absolute;top:0;left:0;z-index:9999;font-size:0}.guide.v{width:1px;border-right:solid 1px #00f;cursor:col-resize}.guide.h{height:1px;border-bottom:solid 1px #00f;cursor:row-resize}.info{width:50px;height:25px;line-height:25px;text-align:center;position:relative;font-size:13px;background-color:#eee;border:solid 1px #ccc}.guide.v .info{left:2px}.guide.h .info{top:2px}.ruler{-moz-user-select:-moz-none;-khtml-user-select:none;-webkit-user-select:none;-ms-user-select:none;user-select:none;background-color:#ccc;position:absolute;top:0;left:0;z-index:9998}.ruler .label{font:12px Arial;color:#000}.ruler,.ruler span{font-size:0}.ruler.h{left:-1px;padding-top:14px;border-bottom:solid 1px #000}.ruler.v{top:-1px;padding-left:16px;width:25px;border-right:solid 1px #000}.ruler.h span{border-left:solid 1px #999;height:9px;width:1px;vertical-align:bottom;display:inline-block;*display:inline;zoom:1}.ruler.v span{display:block;margin-left:auto;margin-right:0;border-top:solid 1px #999;width:9px;height:1px}.ruler.v span.major{border-top:solid 1px #000;width:13px}.ruler.v span.milestone{position:relative;border-top:solid 1px #000;width:17px}.ruler.v span.label{border:0;font-size:9px;position:absolute;text-align:center;width:9px}.ruler.h span.major{border-left:solid 1px #000;height:13px}.ruler.h span.milestone{position:relative;border-left:solid 1px #000;height:17px}.ruler.h span.label{border:0;font-size:9px;position:absolute;text-align:center;top:-14px;width:9px}.ruler.h .l10{left:-5px}.ruler.h .l100{left:-7px}.ruler.h .l1000{left:-10px}.ruler.v .l10,.ruler.v .l100,.ruler.v .l1000{top:-7px}.ruler.v .l10{left:-12px}.ruler.v .l100{left:-17px}.ruler.v .l1000{left:-23px}',prepare=function(){var style=document.createElement('style');style.innerHTML=cssText;document.body.appendChild(style);gWidth=document.documentElement.clientWidth;gHeight=Math.max(body.scrollHeight,body.offsetHeight,doc.clientHeight,doc.scrollHeight,doc.offsetHeight);hRuler=body.appendChild(new Ruler('h',gWidth));vRuler=body.appendChild(new Ruler('v',gHeight));};prepare();this.status=1;this.disable=function(){var i;for(i in guides){if(guides.hasOwnProperty(i)){document.body.removeChild(guides[i]);delete guides[i];guidesCnt=guidesCnt-1;}}vRuler.style.display='none';hRuler.style.display='none';rulerStatus=0;this.status=0;};this.enable=function(){vRuler.style.display='block';hRuler.style.display='block';rulerStatus=1;this.status=1;};evt.attach('mousedown',document,function(e){if(vBound===0){vBound=vRuler.offsetWidth;hBound=hRuler.offsetHeight;}if(((e.clientX>vBound&&e.clientY<hBound)||(e.clientY>hBound&&e.clientX<vBound))&&rulerStatus===1){var guide=document.createElement('div'),guideInfo=guide.cloneNode(false),guideInfoText=document.createTextNode('');gUid='guide-'+guidesCnt;guideInfo.className='info';guideInfo.appendChild(guideInfoText);guide.appendChild(guideInfo);if(e.clientX>vBound&&e.clientY<hBound){guide.className='guide h draggable';guide.style.top=e.clientY+'px';guide.style.width=gWidth+'px';guideInfo.style.left=(e.clientX+10)+'px';mode=2;}else if(e.clientY>hBound&&e.clientX<vBound){guide.className='guide v draggable';guide.style.left=e.clientX+'px';guide.style.height=gHeight+'px';guideInfo.style.top=(e.clientY-35)+'px';mode=1;}guide.id=gUid;guide.info=guideInfo;guide.text=guideInfoText;guides[gUid]=guide;document.body.appendChild(guide);dragdrop.set(guide,{mode:mode,onstart:function(elem){var text=(elem.mode===1)?parseInt(elem.style.left,10)+2:parseInt(elem.style.top,10)+2;elem.text.nodeValue=text;if(elem.over!==undefined){evt.detach('mouseover',elem,elem.over);evt.detach('mouseout',elem,elem.out);}},onmove:function(elem){var text=(elem.mode===1)?parseInt(elem.style.left,10)+2:parseInt(elem.style.top,10)+2;elem.text.nodeValue=text;},onstop:function(elem){elem.over=evt.attach('mouseover',elem,function(e,src){if(src.className==='guide v draggable'){elem.info.style.top=(e.clientY-35)+'px';}else if(src.className==='guide h draggable'){elem.info.style.left=(e.clientX+10)+'px';}elem.info.style.display='block';});elem.out=evt.attach('mouseout',elem,function(){elem.info.style.display='none';});}});dragdrop.start(e,guide);guidesCnt=guidesCnt+1;}});evt.attach('mouseup',document,function(e,src){removeInboundGuide(src,src.id);});evt.attach('keyup',document,function(e){if(e.ctrlKey===true&&e.altKey===true){switch(e.keyCode){case 82:toggleRulers();break;case 71:toggleGuides();break;case 65:if(rulerStatus===1||guideStatus===1){rulerStatus=guideStatus=1;}else{rulerStatus=guideStatus=0;}toggleRulers();toggleGuides();break;}}});};var evt=new Event(),dragdrop=new Dragdrop(evt);if(window.rg===undefined){window.rg=new RulersGuides(evt,dragdrop);window.rg.status=0;}if(window.rg.status===1){window.rg.disable();}else{window.rg.enable();}})()