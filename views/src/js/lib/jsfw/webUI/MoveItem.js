jsfw.WebUI.MoveItem = function (oDiv){
	var strTem=oDiv.getAttribute('moveStep');
	var moveStep=1;
	if (strTem && (strTem!='')) moveStep = parseInt(strTem);
	strTem=oDiv.getAttribute('DragObject');
	var dragObject=oDiv;
	if (strTem && (strTem!='')) dragObject = jsfw.$(strTem);
	oDiv.style.position = 'absolute';

	//var dragStatus = false;
	var chaLeft = 0;
	var chaTop = 0;
	var offsetW = parseInt(oDiv.offsetWidth/2);
	var offsetH = parseInt(oDiv.offsetHeight/2);
	//捕捉拖动
	dragObject.onmousedown = function (e){
		e = e || event;
		if (e.button!==1) return;
		if(dragObject.setCapture){
			dragObject.setCapture();
		}else if(window.captureEvents){
			window.captureEvents(Event.MOUSEMOVE|Event.MOUSEUP);
		}
		//dragStatus = true;
		offsetW = parseInt(oDiv.offsetWidth/2);
		offsetH = parseInt(oDiv.offsetHeight/2);
		chaLeft = e.clientX - (parseInt(oDiv.style.left)||0);
		chaTop = e.clientY - (parseInt(oDiv.style.top)||0);
		document.onmousemove = oDiv.Drag;
		document.onmouseup   = oDiv.Drop;
		document.onselectstart = function(){return false;};
	};
	///拖动[BEGIN]-------------------
	oDiv.Drag = function(e){
		e = e || event;
		oDiv.style.left = parseInt((e.clientX-chaLeft+offsetW)/moveStep)*moveStep-offsetW + "px";
		oDiv.style.top = parseInt((e.clientY-chaTop+offsetH)/moveStep)*moveStep-offsetH + "px";
		oDiv.Draging();
	}
	oDiv.Drop = function(){
		if(dragObject.releaseCapture){
			dragObject.releaseCapture();
		}else if(window.captureEvents){
			window.captureEvents(Event.MOUSEMOVE|Event.MOUSEUP);
		}
		document.onmousemove = document.onmouseup = document.onselectstart = null;
		if (parseInt(oDiv.style.left)<0) oDiv.style.left=0;
		if (parseInt(oDiv.style.top)<0) oDiv.style.top=0;
		oDiv.Draging();
	}
	oDiv.Draging = function(){}
	///拖动[END]-------------------
	//清除内存
	if (window.attachEvent) window.attachEvent('onunload', function (){
		dragObject.onmousedown = null;
		dragObject = null;
		oDiv.Drag = null;
		oDiv.Drop = null;
		oDiv.Draging = null;
	});
};

jsfw.WebUI.MoveItem.TagName = 'div';