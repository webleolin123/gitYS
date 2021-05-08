jsfw.WebUI.Action = function (){
};

/*******************************************\
  Fly 类(2007-11-05)
	参数:
		oFrom :起点坐标 例:[100,120]
		oTo   :目标对象(HTML对象) 或坐标[left,top,width,height]
		sColor:颜色
\*******************************************/
jsfw.WebUI.Action.Fly = function (oFrom,oTo,sColor){
	var iLeft0=0;
	var iTop0=0;
	if (oFrom[1]){
		iLeft0 = oFrom[0];
		iTop0 = oFrom[1];
	}else{
		iLeft0 = jsfw.getAbsoluteLeft(oFrom) + oFrom.offsetWidth/2;
		iTop0 = jsfw.getAbsoluteTop(oFrom) + oFrom.offsetHeight/2;
	}
	var iLeft=0;
	var iTop=0;
	var iWidth=0;
	var iHeight=0;
	if (oTo[3]){
		iLeft = oTo[0];
		iTop = oTo[1];
		iWidth = oTo[2];
		iHeight = oTo[3];
	}else{
		iLeft = jsfw.getAbsoluteLeft(oTo);
		iTop = jsfw.getAbsoluteTop(oTo);
		iWidth = oTo.offsetWidth;
		iHeight = oTo.offsetHeight;
	}
	if (!(sColor)){sColor='#336699';}

	var oDiv = document.createElement('div');
	oDiv.style.border = '1px solid ' + sColor;
	oDiv.style.position = 'absolute';
	oDiv.style.left = iLeft0;
	oDiv.style.top = iTop0;
	oDiv.style.width = 0;
	oDiv.style.height = 0;
	oDiv.innerHTML = '<img width="1" height="1">';
	document.body.appendChild(oDiv);

	var iCur=0;
	var timTem = setInterval(function (){
		oDiv.style.left = iLeft0 + (iLeft-iLeft0)*iCur/8;
		oDiv.style.top = iTop0 + (iTop-iTop0)*iCur/8;
		oDiv.style.width = iWidth*iCur/8;
		oDiv.style.height = iHeight*iCur/8;
		iCur++;
		if (iCur>8) {
			clearTimeout(timTem);
			document.body.removeChild(oDiv);
		}
	},20)
};

/*******************************************\
  ResizeFrame 拖拉边框类(2007-11-19)
	参数:
		obj :要拖拉的对象
		funAfter:拖拉后触发的函数[参数:(iNewWidth,iNewHeight)]
		sSite:拖动位置允许值(Right,Bottom,RightBottom 默认为RightBottom)
		sColor:颜色
\*******************************************/
jsfw.WebUI.Action.ResizeFrame = function (obj,funAfter,sSite,sColor){
	if (!/msie/i.test(navigator.userAgent)) return;
	if (sSite) sSite = sSite.toLowerCase();
	if (!(sColor)){sColor='red';}

	var chaLeft=0;
	var chaTop=0;

	var oDiv = document.createElement('div');
	oDiv.style.border = '1px dotted ' + sColor;
	oDiv.style.position = 'absolute';
	oDiv.style.left = jsfw.getAbsoluteLeft(obj);;
	oDiv.style.top = jsfw.getAbsoluteTop(obj);
	oDiv.style.width = obj.offsetWidth;
	oDiv.style.height = obj.offsetHeight;
	oDiv.style.zIndex = window._jsfw_Window_zIndex + 100;
	oDiv.innerHTML = '<img width="1" height="1">';
	document.body.appendChild(oDiv);

	chaLeft = (event.clientX||0) - oDiv.offsetWidth + 2;
	chaTop = (event.clientY||0) - oDiv.offsetHeight + 2;
	oDiv.setCapture();
	document.onselectstart = function(){return false;};
	document.onmousemove = function (){
		try{
			if (sSite!='bottom')	oDiv.style.width = (event.clientX - chaLeft);
			if (sSite!='right')	oDiv.style.height = (event.clientY - chaTop);
		}catch(e){}
	};
	document.onmouseup   = function (){
		document.onmousemove = document.onmouseup = document.onselectstart = null;
		if (funAfter){
			try{
				funAfter(parseInt(oDiv.style.width), parseInt(oDiv.style.height));
			}catch(e){}
		}else{
			obj.style.width = oDiv.style.width;
			obj.style.height = oDiv.style.height;
		}
		document.body.removeChild(oDiv);
	};
};