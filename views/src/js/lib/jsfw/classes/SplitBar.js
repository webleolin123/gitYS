/********************************************************************************\
 * 类 名 称： SplitBar
 * 功能说明： 分隔条 
  (2007-03-27)
	Author:Witson
\********************************************************************************/
jsfw.Class.SplitBar = function(o_Bar,o_Begin,o_End,minLeft,minRight){
	var me = this;
	if (typeof(minLeft)!='number') minLeft=0;
	if (typeof(minRight)!='number') minRight=0;
	var oBar = (typeof o_Bar=="string")?document.getElementById(o_Bar):o_Bar;
	var oBegin = (typeof o_Begin=="string")?document.getElementById(o_Begin):o_Begin;
	var oEnd = (typeof o_End=="string")?document.getElementById(o_End):o_End;
	var oBarTem = null;//document.createElement("div");
	var intOld=0;
	var intNew=0;
	var timClick;
	var bMouseDown=false;
//	oBarTem.style.left=''
	
	var bX=!(oEnd.offsetLeft==oBegin.offsetLeft);
	if (oBar.style.cursor==''){
		if (/msie/i.test(navigator.userAgent)){
			oBar.style.cursor=bX?'col-resize':'row-resize';
		}else{
			oBar.style.cursor=bX?'w-resize':'s-resize';
		}
	}
	oBar.onmousedown = function(e){
		bMouseDown=true;
		e = e || event;
		clearTimeout(timClick);
		me.chaLeft = (e.offsetX||0) + 2;
		me.chaTop = (e.offsetY||0) + 2;
		var eX=e.clientX - me.chaLeft;
		var eY=e.clientY - me.chaTop;
		timClick=setTimeout(function(){me.startDrag(eX,eY)},300);
		document.onselectstart = function(){return false;};
	}
	oBar.onmousemove = function(e){
		if (!bMouseDown) return;
		bMouseDown=false;
		e = e || event;
		clearTimeout(timClick);
		me.chaLeft = (e.offsetX||0) + 2;
		me.chaTop = (e.offsetY||0) + 2;
		var eX=e.clientX - me.chaLeft;
		var eY=e.clientY - me.chaTop;
		me.startDrag(eX,eY);
	}
	oBar.onmouseup = function(e){
		bMouseDown=false;
		clearTimeout(timClick);
		document.onselectstart = null;
	}
	this.startDrag = function(eX,eY){
		bMouseDown=false;
		if (oBarTem==null){
			oBarTem = document.createElement("div");
			oBarTem.style.position = "absolute";
			oBarTem.style.zIndex = 10000;
			oBarTem.style.width=oBar.offsetWidth;
			oBarTem.style.height=oBar.offsetHeight;
			oBarTem.style.border = '1px dotted red';
			oBarTem.innerHTML='<img width="1" height="1"/>';
			oBarTem.style.display='none';
			document.body.appendChild(oBarTem);
		}
		clearTimeout(timClick);
		oBarTem.style.display='';
//		alert(eX);
		oBarTem.style.left=eX+document.body.scrollLeft;
		oBarTem.style.top=eY+document.body.scrollTop;
		intOld = bX?(eX):(eY);
//		oBarTem.setCapture();
		if(oBarTem.setCapture)
			oBarTem.setCapture();
		else if(window.captureEvents)
			window.captureEvents(Event.MOUSEMOVE|Event.MOUSEUP);

		document.onmousemove = me.Drag;
		document.onmouseup   = me.Drop;
	}
	this.Drag = function(e){
		clearTimeout(timClick);
		e = e || event;
		if (bX){
			oBarTem.style.left = (e.clientX-me.chaLeft+document.body.scrollLeft) + "px";
			intNew=(e.clientX-me.chaLeft);
		}else{
			oBarTem.style.top = (e.clientY-me.chaTop+document.body.scrollTop) + "px";
			intNew=(e.clientY-me.chaTop);
		}
	}
	this.Drop = function(){
//		oBarTem.releaseCapture();
		if(oBarTem.releaseCapture)
			oBarTem.releaseCapture();
		else if(window.captureEvents)
			window.captureEvents(Event.MOUSEMOVE|Event.MOUSEUP);

		oBarTem.style.display='none';
		document.onmousemove = document.onmouseup = document.onselectstart = null;
		var iDelta=intNew-intOld;
		if (bX){
			if (iDelta>oEnd.offsetWidth) iDelta=oEnd.offsetWidth;
			if ((minLeft>0)&&((oBegin.offsetWidth+iDelta)<minLeft)){
				iDelta=oBegin.offsetWidth;
				if (oBegin.style.display=='none'){
					oBegin.style.display='';iDelta=oBegin.offsetWidth;
					oEnd.style.width=oEnd.offsetWidth-iDelta;
				}else{
					oBegin.style.display='none';
					oEnd.style.width=oEnd.offsetWidth+iDelta;
				}
			}else{
				if ((minRight>0)&&((oEnd.offsetWidth-iDelta)<minRight)){
					iDelta=oEnd.offsetWidth;
					if (oEnd.style.display=='none'){
						oEnd.style.display='';iDelta=oEnd.offsetWidth;
						oBegin.style.width=oBegin.offsetWidth-iDelta;
					}else{
						oEnd.style.display='none';
						oBegin.style.width=oBegin.offsetWidth+iDelta;
					}
				}else{
					try{
						oBegin.style.width=oBegin.offsetWidth+iDelta;
						oEnd.style.width=oEnd.offsetWidth-iDelta;
						oBegin.style.display='';
						oEnd.style.display='';
					}catch(e){}
				}
			}
		}else{
			if (iDelta>oEnd.offsetHeight) iDelta=oEnd.offsetHeight;
			if ((minLeft>0)&&((oBegin.offsetHeight+iDelta)<minLeft)){
				iDelta=oBegin.offsetHeight;
				if (oBegin.style.display=='none'){
					oBegin.style.display='';iDelta=oBegin.offsetHeight;
					oEnd.style.height=oEnd.offsetHeight-iDelta;
				}else{
					oBegin.style.display='none';
					oEnd.style.height=oEnd.offsetHeight+iDelta;
				}
			}else{
				if ((minRight>0)&&((oEnd.offsetHeight-iDelta)<minRight)){
					iDelta=oEnd.offsetHeight;
					if (oEnd.style.display=='none'){
						oEnd.style.display='';iDelta=oEnd.offsetHeight;
						oBegin.style.height=oBegin.offsetHeight-iDelta;
					}else{
						oEnd.style.display='none';
						oBegin.style.height=oBegin.offsetHeight+iDelta;
					}
				}else{
					try{
						oBegin.style.height=oBegin.offsetHeight+iDelta;
						oEnd.style.height=oEnd.offsetHeight-iDelta;
					}catch(e){}
				}
			}
		}
		me.afterResize(iDelta);
	}
	this.hideBegin = function(bHide){
		bHide = (typeof(bHide)=='boolean')?bHide:oBegin.style.display!='none';
		if (bHide){
			var intTem=oBegin.offsetWidth;
			oBegin.style.display='none';
			oEnd.style.width=oEnd.offsetWidth+intTem;
		}else{
			oBegin.style.display='';
			var intTem=oBegin.offsetWidth;
			oEnd.style.width=oEnd.offsetWidth-intTem;
		}
	}
	this.hideEnd = function(bHide){
		bHide = (typeof(bHide)=='boolean')?bHide:oEnd.style.display!='none';
		if (bHide){
			var intTem=oEnd.offsetWidth;
			oEnd.style.display='none';
			oBegin.style.width=oBegin.offsetWidth+intTem;
		}else{
			oEnd.style.display='';
			var intTem=oEnd.offsetWidth;
			oBegin.style.width=oBegin.offsetWidth-intTem;
		}
	}
	this.afterResize=function(iDelta){

	}
}