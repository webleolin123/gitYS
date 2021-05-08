jsfw.WebUI.Input_DateTime = function (oDiv){
	if (!jsfw.WebUI.DateTime) jsfw.Import("WebUI.DateTime");

	var oTable = document.createElement('table');
	oTable.insertRow(0);
	oTable.rows[0].insertCell(0);
	oTable.rows[0].insertCell(0);
	oTable.rows[0].cells[1].innerHTML = '<img width="1"/>';
	oTable.rows[0].cells[1].className = 'Input_DateTime_Down';
	oTable.cellPadding = 0;
	oTable.cellSpacing = 0;
	oTable.height=10;
	oTable.border = 0;
	oTable.style.display = 'inline';
	//oTable.className = 'jsfw_Button';
	oDiv.parentNode.insertBefore(oTable,oDiv);
	oTable.rows[0].cells[0].appendChild(oDiv);
	var strTem = '';
	strTem=oDiv.getAttribute('classCss');
	if (strTem && (strTem!='')) {
		oDiv.style.border='none';
		oTable.className=strTem;
	}

	var oDivFrame = document.createElement("div");
	oDivFrame.id = 'Input_DateTime_Frame';
	oDivFrame.name = 'Input_DateTime_Frame';
	oDivFrame.style.position = 'absolute';
	oDivFrame.className = 'Input_DateTime_Frame';
	oDivFrame.style.top = -1000;
	oDivFrame.style.display = 'none';

	var oDivDate = document.createElement("div");
	oDivDate.isFloat = true;
	oDivDate.className='DateTime';
	var strTem = '';
	strTem=oDiv.getAttribute('Format');
	if (strTem && (strTem!='')) oDivDate.setAttribute('Format',strTem);
	if (oDiv.value!='') oDivDate.setAttribute('Date',oDiv.value);
	oDivDate.setAttribute('onSelectDate','this.parentNode.setInputValue(this.Date)');

	var strTem = '';
	strTem=oDiv.getAttribute('classCss');
	if (strTem && (strTem!='')) oDiv.className=strTem;

	oDivFrame.appendChild(oDivDate);
	document.body.appendChild(oDivFrame);
	if (!oDivDate.Formated) jsfw.WebUI.DateTime(oDivDate);
	oDivDate.onclick = function (){clearTimeout(timTem);}

	var timTem;
	oDivFrame.onmouseout = function(){clearTimeout(timTem);timTem = setTimeout(function(){oDivFrame.style.display='none';},500);}
	oDivFrame.onmouseover = function(){clearTimeout(timTem);oDivFrame.style.display='';}

	oDiv.onblur = function(){clearTimeout(timTem);timTem = setTimeout(function(){oDivFrame.style.display='none';},300);}
	oDivFrame.setInputValue = function (sValue){
		oDiv.value = sValue;
		oDivFrame.style.display = 'none';
	}
	oTable.rows[0].cells[1].onclick = function (){
		oDiv.focus();
	}
	oDiv.onfocus = oDiv.onclick = function(){
		var objs = document.getElementsByName('Input_DateTime_Frame');
		for (var i=0; i<objs.length; i++) objs[i].style.display = 'none';
		oDivFrame.style.display = '';
		if (/msie/i.test(navigator.userAgent)){
			oDivFrame.style.left = jsfw.getAbsoluteLeft(oDiv);// - document.body.scrollLeft;
			oDivFrame.style.top = jsfw.getAbsoluteTop(oDiv) + oDiv.offsetHeight-1;// - document.body.scrollTop;
			if (typeof(getParentDivScrollTopForInput)=='function'){
				oDivFrame.style.top = jsfw.getAbsoluteTop(oDiv) + oDiv.offsetHeight-1 - getParentDivScrollTopForInput();
			}
		}else{
			oDivFrame.style.left = jsfw.getAbsoluteLeft(oDiv);
			oDivFrame.style.top = jsfw.getAbsoluteTop(oDiv)+oDiv.offsetHeight-1;
		}
		if (window._jsfw_Window_zIndex) oDivFrame.style.zIndex = window._jsfw_Window_zIndex + 100;
	}


	//清除内存
	if (window.attachEvent) window.attachEvent('onunload', function (){
		oDiv.onblur = null;
		oDiv.onfocus = null;
		oDiv.onclick = null;
		oDivFrame.setInputValue = null;
		oDivFrame.onmouseout = null;
		oDivFrame.onmouseover = null;
		oDivFrame.innerHTML='';
		//document.body.removeChild(oDivFrame);
	});
};

jsfw.WebUI.Input_DateTime.TagName = 'input';

//引用样式文件
(
	function (){
		var head = document.getElementsByTagName('head')[0];
		var link = document.createElement('link');
		link.rel = 'stylesheet';
		link.href = jsfw.Path + 'Themes/' + jsfw.Theme + '/Input_DateTime/css.css';
		link.type = 'text/css';
		link.media = 'all';
		head.appendChild(link);
	}
)();