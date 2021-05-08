jsfw.WebUI.Input_Select = function (oDiv){
	var oDivFrame = document.createElement("div");
	oDivFrame.id = 'Input_Select_Frame';
	oDivFrame.name = 'Input_Select_Frame';
	oDivFrame.style.position = 'absolute';
	oDivFrame.className = 'Input_Select_Frame';
	oDivFrame.style.top = -1000;
	oDivFrame.style.display = 'none';

	var oDivSel = document.createElement("div");
	oDivSel.isFloat = true;
	oDivSel.className='Input_Select_Div';
	/*var strTem = '';
	strTem=oDiv.getAttribute('Format');
	if (strTem && (strTem!='')) oDivSel.setAttribute('Format',strTem);
	if (oDiv.value!='') oDivSel.setAttribute('Date',oDiv.value);
	oDivSel.setAttribute('onSelectDate','this.parentNode.setInputValue(this.Date)');*/

	oDivFrame.appendChild(oDivSel);
	document.body.appendChild(oDivFrame);
	//oDivSel.onclick = function (){clearTimeout(timTem);}

	var oTable = document.createElement('table');
	oTable.insertRow(0);
	oTable.rows[0].insertCell(0);
	oTable.rows[0].insertCell(0);
	oTable.rows[0].cells[1].innerHTML = '<img width="1"/>';
	oTable.rows[0].cells[1].className = 'Input_Select_Down';
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


	var curIdx=-1;

	var timTem;
	oDivFrame.onmouseout = function(){clearTimeout(timTem);timTem = setTimeout(function(){oDivFrame.style.display='none';},500);}
	oDivFrame.onmouseover = function(){clearTimeout(timTem);oDivFrame.style.display='';}

	oDiv.onblur = function(){clearTimeout(timTem);timTem = setTimeout(function(){oDivFrame.style.display='none';},300);}
	oDivFrame.setInputValue = function (sValue){
		oDiv.value = sValue;
		oDivFrame.style.display = 'none';
	}
	oDivFrame.selItem = function (idx){
		var oTab=oDivFrame.getElementsByTagName('table')[0];
		if (idx<0) idx=oTab.rows.length-1;
		if (idx>oTab.rows.length-1) idx=0;
		curIdx=idx;
		for (var i=0; i<oTab.rows.length; i++){
			oTab.rows[i].className=(i==idx)?'Input_Select_Tab_TR_Over':'';
		}
		oTab.rows[idx].className='Input_Select_Tab_TR_Over';
	}
	oTable.rows[0].cells[1].onclick = function (){
		oDiv.focus();
	}
	oDiv.onfocus = oDiv.onclick = function(){
		var objs = document.getElementsByName('Input_Select_Frame');
		for (var i=0; i<objs.length; i++) objs[i].style.display = 'none';
		//curIdx=-1;
		oDivFrame.style.display = '';
		if (/msie/i.test(navigator.userAgent)){
			oDivFrame.style.left = jsfw.getAbsoluteLeft(oTable);// - document.body.scrollLeft;
			oDivFrame.style.top = jsfw.getAbsoluteTop(oTable) + oTable.offsetHeight-1;// - document.body.scrollTop;
			if (typeof(getParentDivScrollTopForInput)=='function'){
				oDivFrame.style.top = jsfw.getAbsoluteTop(oTable) + oTable.offsetHeight-1 - getParentDivScrollTopForInput();
			}
		}else{
			oDivFrame.style.left = jsfw.getAbsoluteLeft(oTable);
			oDivFrame.style.top = jsfw.getAbsoluteTop(oTable)+oTable.offsetHeight-1;
		}
		if (window._jsfw_Window_zIndex) oDivFrame.style.zIndex = window._jsfw_Window_zIndex + 100;
		try{
			var oTab=oDivFrame.getElementsByTagName('table')[0];
			if (oTab.offsetWidth < (oTable.offsetWidth-2)) oTab.width = (oTable.offsetWidth-2)
		}catch(e){}
	}
	oDiv.onkeydown = function (){
		if ((event.keyCode<41) && (event.keyCode>37) && (oDivFrame.style.display=='')){
			try{
				var oTab=oDivFrame.getElementsByTagName('table')[0];
				if (event.keyCode==40){
					oDivFrame.selItem(curIdx+1);
					oDiv.value=oTab.rows[curIdx].cells[0].innerText;
				}
				if (event.keyCode==38){
					oDivFrame.selItem(curIdx-1);
					oDiv.value=oTab.rows[curIdx].cells[0].innerText;
				}
			}catch(e){}
		}
	}
	oDiv.setItems = function (sItems){
		var arrItem=sItems.split(',');
		var sHTML='';
		sHTML += '';
		sHTML += '<table border="0" cellpadding="3" cellspacing="0">';
		for (var i=0; i<arrItem.length; i++){
			sHTML += '	<tr onmouseover="this.parentNode.parentNode.parentNode.parentNode.selItem('+i+')" onclick="this.parentNode.parentNode.parentNode.parentNode.setInputValue(this.cells[0].innerText)">';
			sHTML += '		<td>' + arrItem[i] + '</td>';
			sHTML += '	</tr>';
		}
		sHTML += '</table>';
		oDivSel.innerHTML = sHTML;
	}
	var strTem = '';
	strTem=oDiv.getAttribute('Items');
	if (strTem && (strTem!='')) oDiv.setItems(strTem);


	//清除内存
	if (window.attachEvent) window.attachEvent('onunload', function (){
		oDiv.onblur = null;
		oDiv.onfocus = null;
		oDiv.onclick = null;
		oDiv.onkeydown = null;
		oDiv.setItems = null;
		oTable.rows[0].cells[1].onclick=null;
		oDivFrame.setInputValue = null;
		oDivFrame.onmouseout = null;
		oDivFrame.onmouseover = null;
		oDivFrame.selItem = null;
		oDivFrame.innerHTML='';
		//document.body.removeChild(oDivFrame);
	});
};

jsfw.WebUI.Input_Select.TagName = 'input';

//引用样式文件
(
	function (){
		var head = document.getElementsByTagName('head')[0];
		var link = document.createElement('link');
		link.rel = 'stylesheet';
		link.href = jsfw.Path + 'Themes/' + jsfw.Theme + '/Input_Select/css.css';
		link.type = 'text/css';
		link.media = 'all';
		head.appendChild(link);
	}
)();