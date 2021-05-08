jsfw.WebUI.Input_Color = function (oDiv){
	if (!jsfw.WebUI.Color) jsfw.Import("WebUI.Color");
	var oDivFrame = document.createElement("div");
	oDivFrame.id = 'Input_Color_Frame';
	oDivFrame.name = 'Input_Color_Frame';
	oDivFrame.style.position = 'absolute';
	oDivFrame.className = 'Input_Color_Frame';
	oDivFrame.style.top = -1000;
	oDivFrame.style.display = 'none';

	var oDivColor = document.createElement("div");
	oDivColor.className='Color';
	oDivColor.setAttribute('Color',oDiv.value);
	oDivColor.setAttribute('onSelectColor','this.parentNode.setInputValue(this.Color)');

	oDivFrame.appendChild(oDivColor);
	document.body.appendChild(oDivFrame);
	if (!oDivColor.Formated) jsfw.WebUI.Color(oDivColor);
	oDivColor.onclick = function (){clearTimeout(timTem);}

	var timTem;
	oDivFrame.onmouseout = function(){clearTimeout(timTem);timTem = setTimeout(function(){oDivFrame.style.display='none';},500);}
	oDivFrame.onmouseover = function(){clearTimeout(timTem);oDivFrame.style.display='';}

	oDiv.onblur = function(){clearTimeout(timTem);timTem = setTimeout(function(){oDivFrame.style.display='none';},300);}
	oDivFrame.setInputValue = function (sValue){
		var foreColor=oDiv.getAttribute('forecolor');
		if (foreColor && (foreColor!='false')){
			oDiv.style.color = sValue;
			if (foreColor=='both') oDiv.style.backgroundColor = sValue;
		}else{
			oDiv.style.backgroundColor = sValue;
		}
		oDiv.value = sValue;
		oDivFrame.style.display='none';
	}
	oDiv.onfocus = oDiv.onclick = function(){
		var objs = document.getElementsByName('Input_Color_Frame');
		for (var i=0; i<objs.length; i++) objs[i].style.display = 'none';
		if (oDivColor.getAttribute('color')!=oDiv.value){
			oDivColor.setAttribute('Color',oDiv.value);
			oDivColor.focusDefColor();
		}
		oDivFrame.style.display = '';
		if (/msie/i.test(navigator.userAgent)){
			oDivFrame.style.left = jsfw.getAbsoluteLeft(oDiv);// - document.body.scrollLeft;
			oDivFrame.style.top = jsfw.getAbsoluteTop(oDiv) + oDiv.offsetHeight-1;// - document.body.scrollTop;
		}else{
			oDivFrame.style.left = jsfw.getAbsoluteLeft(oDiv);
			oDivFrame.style.top = jsfw.getAbsoluteTop(oDiv)+oDiv.offsetHeight-1;
		}
		//if ((parseInt(oDivFrame.style.left)+oDivFrame.offsetWidth) > document.body.offsetWidth) 
		//	oDivFrame.style.left = (document.body.offsetWidth-oDivFrame.offsetWidth-10);
		if (window._jsfw_Window_zIndex) oDivFrame.style.zIndex = window._jsfw_Window_zIndex + 100;
	}

	//初始化颜色[BEGIN]
	try{
		var foreColor=oDiv.getAttribute('forecolor');
		if (foreColor && (foreColor!='false')){
			oDiv.style.color = oDiv.value;
			if (foreColor=='both') oDiv.style.backgroundColor = sValue;
		}else{
			oDiv.style.backgroundColor = oDiv.value;
		}
	}catch (e){}
	//初始化颜色[END]

	//清除内存
	if (window.attachEvent) window.attachEvent('onunload', function (){
		oDiv.onblur = null;
		oDiv.onfocus = null;
		oDiv.onclick = null;
		oDivFrame.setInputValue = null;
		oDivFrame.onmouseout = null;
		oDivFrame.onmouseover = null;
		oDivFrame.innerHTML='';
	});
};

jsfw.WebUI.Input_Color.TagName = 'input';

//引用样式文件
(
	function (){
		var head = document.getElementsByTagName('head')[0];
		var link = document.createElement('link');
		link.rel = 'stylesheet';
		link.href = jsfw.Path + 'Themes/' + jsfw.Theme + '/Input_Color/css.css';
		link.type = 'text/css';
		link.media = 'all';
		head.appendChild(link);
	}
)();