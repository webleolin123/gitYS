jsfw.WebUI.SplitBar = function (oTD){
	var oTab=null;
	var objTem=oTD;
	for (var i=0; i<5; i++){
		objTem=objTem.parentNode;
		if (objTem.nodeName=='TABLE'){
			oTab=objTem;
			break;
		}
	}
	if (oTab==null) return;
	var bX=!(oTab.rows.length==3);
	var oBegin = bX?oTab.rows[0].cells[0]:oTab.rows[0].cells[0];
	//var oBar = oTD;//bX?oTab.rows[0].cells[1]:oTab.rows[1].cells[0];
	var oEnd =  bX?oTab.rows[0].cells[2]:oTab.rows[2].cells[0];
	var barSize=bX?oTD.offsetWidth:oTD.offsetHeight;
	if (barSize==0) barSize=5;
	var oBarTem = null;//document.createElement("div");
	var intOld=0;
	var intNew=0;
	var timClick;
	var chaLeft=0;
	var chaTop =0;
	var minLeft = parseInt(oTD.getAttribute('minleft'));
	var minRight = parseInt(oTD.getAttribute('minright'));;

	var bMouseDown=false;
	if (oTD.style.cursor==''){
		if (/msie/i.test(navigator.userAgent)){
			oTD.style.cursor=bX?'col-resize':'row-resize';
		}else{
			oTD.style.cursor=bX?'w-resize':'s-resize';
		}
	}
	oTD.onmousedown = function(e){
		bMouseDown=true;
		e = e || event;
		clearTimeout(timClick);
		chaLeft = (e.offsetX||0) + 2;
		chaTop = (e.offsetY||0) + 2;
		var eX=e.clientX - chaLeft;
		var eY=e.clientY - chaTop;
		timClick=setTimeout(function(){funStartDrag(eX,eY)},300);
		document.onselectstart = function(){return false;};
	}
	oTD.onmousemove = function(e){
		if (!bMouseDown) return;
		bMouseDown=false;
		e = e || event;
		clearTimeout(timClick);
		chaLeft = (e.offsetX||0) + 2;
		chaTop = (e.offsetY||0) + 2;
		var eX=e.clientX - chaLeft;
		var eY=e.clientY - chaTop;
		funStartDrag(eX,eY);
	}
	oTD.onmouseup = function(e){
		bMouseDown=false;
		clearTimeout(timClick);
		document.onselectstart = null;
	}


	var funStartDrag = function(eX,eY){
		bMouseDown=false;
		if (oBarTem==null){
			oBarTem = document.createElement("div");
			oBarTem.style.position = "absolute";
			oBarTem.style.zIndex = 10000;
			oBarTem.style.width=oTD.offsetWidth;
			oBarTem.style.height=oTD.offsetHeight;
			oBarTem.className='SplitBar_Frame';
			oBarTem.innerHTML='<img width="1" height="1"/>';
			oBarTem.style.display='none';
			document.body.appendChild(oBarTem);
		}
		clearTimeout(timClick);
		oBarTem.style.display='';
		oBarTem.style.left=eX+document.body.scrollLeft;
		oBarTem.style.top=eY+document.body.scrollTop;
		intOld = bX?(eX):(eY);
		if(oBarTem.setCapture)
			oBarTem.setCapture();
		else if(window.captureEvents)
			window.captureEvents(Event.MOUSEMOVE|Event.MOUSEUP);
		document.onmousemove = funDrag;
		document.onmouseup   = funDrop;
	}
	var funDrag = function(e){
		clearTimeout(timClick);
		e = e || event;
		if (bX){
			oBarTem.style.left = (e.clientX-chaLeft+document.body.scrollLeft) + "px";
			intNew=(e.clientX-chaLeft);
		}else{
			oBarTem.style.top = (e.clientY-chaTop+document.body.scrollTop) + "px";
			intNew=(e.clientY-chaTop);
		}
	}
	var funDrop = function(){
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
					oBegin.style.display='';
					oTD.style.width=barSize;
				}else{
					oBegin.style.display='none';
					oTD.style.width=barSize;
				}
			}else{
				if ((minRight>0)&&((oEnd.offsetWidth-iDelta)<minRight)){
					iDelta=oEnd.offsetWidth;
					if (oEnd.style.display=='none'){
						oEnd.style.display='';
						oTD.style.width=barSize;
					}else{
						oEnd.style.display='none';
						oTD.style.width=barSize;
					}
				}else{
					try{
						oBegin.style.width=oBegin.offsetWidth+iDelta;
						oBegin.style.display='';
						oEnd.style.display='';
						oTD.style.width=barSize;
					}catch(e){}
				}
			}
		}else{
			if (iDelta>oEnd.offsetHeight) iDelta=oEnd.offsetHeight;
			if ((minLeft>0)&&((oBegin.offsetHeight+iDelta)<minLeft)){
				iDelta=oBegin.offsetHeight;
				if (oBegin.style.display=='none'){
					oBegin.style.display='';
					oTD.style.height=barSize;
				}else{
					oBegin.style.display='none';
					oTD.style.height=barSize;
				}
			}else{
				if ((minRight>0)&&((oEnd.offsetHeight-iDelta)<minRight)){
					iDelta=oEnd.offsetHeight;
					if (oEnd.style.display=='none'){
						oEnd.style.display='';
						oTD.style.height=barSize;
					}else{
						oEnd.style.display='none';
						oTD.style.height=barSize;
					}
				}else{
					try{
						oBegin.style.height=oBegin.offsetHeight+iDelta;
						oEnd.style.height=oEnd.offsetHeight-iDelta;
						oTD.style.height=barSize;
					}catch(e){}
				}
			}
		}
		oTD.funAfterResize(iDelta);
	}
	
	oTD.hideBegin = function(bHide){
		bHide = (typeof(bHide)=='boolean')?bHide:oBegin.style.display!='none';
		if (bHide){
			var intTem=oBegin.offsetWidth;
			oBegin.style.display='none';
			oTD.style.width=barSize;
			oTD.funAfterResize(intTem);
		}else{
			var intTemOld=oEnd.offsetWidth;
			oBegin.style.display='';
			oEnd.style.display='';
			oTD.style.width=barSize;
			oTD.funAfterResize(oBegin.offsetWidth);
		}
	}
	oTD.hideEnd = function(bHide){
		bHide = (typeof(bHide)=='boolean')?bHide:oEnd.style.display!='none';
		if (bHide){
			var intTem=oEnd.offsetWidth;
			oEnd.style.display='none';
			oTD.style.width=barSize;
			oTD.funAfterResize(intTem);
		}else{
			oEnd.style.display='';
			oTD.style.width=barSize;
			oTD.funAfterResize(oEnd.offsetWidth);
		}
	}
	oTD.funAfterResize=function(iDelta){
		var str = oTD.getAttribute('afterresize');
		str=str.replace(/begin\.width/img,oBegin.offsetWidth);
		try{eval(str);}catch (e){};
	}


	//清除内存
	if (window.attachEvent) window.attachEvent('onunload', function (){
		oTD.onmousedown = null;
		oTD.onmousemove = null;
		oTD.onmouseup = null;
		oTD.hideBegin = null;
		oTD.hideEnd = null;
		funStartDrag = null;
		oTD.funAfterResize = null;
		funDrag = null;
		funDrop = null;
		if (oBarTem!=null) document.body.removeChild(oBarTem);
		/*oDiv.selectGroup = null;
		oDiv.setHeight = null;
		var objs=oTab.childNodes;
		for (var i=0; i<objs.length; i++){
			objs[i].onclick=null;
		}
		var objs=oContent.childNodes;
		for (var i=0; i<objs.length; i++){
			objs[i].loaded=null;
		}
		oDiv.removeChild(oTab);
		oDiv.removeChild(oContent);*/
	});
};

jsfw.WebUI.SplitBar.TagName = 'td';
//查找需要格式化的组件
/*jsfw.WebUI.SplitBar.FormatAll = function (obj){
	obj = (typeof(obj)=='object')?obj:document;
	var tds = obj.getElementsByTagName("td");
	for (i=(tds.length-1); i>=0; i--) {
		if (tds[i].className && tds[i].className.toLowerCase()=='splitbar') {
			jsfw.WebUI.SplitBar(tds[i]);
		}
	}
};*/

//引用样式文件
(
	function (){
		var head = document.getElementsByTagName('head')[0];
		var link = document.createElement('link');
		link.rel = 'stylesheet';
		link.href = jsfw.Path + 'Themes/' + jsfw.Theme + '/SplitBar/css.css';
		link.type = 'text/css';
		link.media = 'all';
		head.appendChild(link);
	}
)();