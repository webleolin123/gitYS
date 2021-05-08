jsfw.WebUI.Tip = function (){
};

jsfw.WebUI.Tip.delTip = function (){
	var obj = document.getElementById('jsfw_Tip_div');
	if (obj) obj.style.display='none';
}

jsfw.WebUI.Tip.newTip = function (sContent,obj,iTime,iWidth,iHeight){
	iWidth = ((typeof(iWidth)=='number') && (iWidth>50))?iWidth:180;
	iHeight = ((typeof(iHeight)=='number') && (iHeight>30))?iHeight:50;
	iTime = (typeof(iTime)=='number')?iTime:3000;
	//var imgPath
	//imgPath=jsfw.Path + 'Themes/' + jsfw.Theme + '/Tip/';

	var temObj=document.getElementById('jsfw_Tip_div');
	if (temObj){
		temObj.getElementsByTagName('table')[0].rows[1].cells[1].innerHTML = sContent;
		temObj.style.height = iHeight;
		temObj.style.width = iWidth;
		temObj.style.top = jsfw.getAbsoluteTop(obj) + obj.offsetHeight + 0;
		if (typeof(getParentDivScrollTopForInput)=='function'){
			temObj.style.top = jsfw.getAbsoluteTop(obj) + obj.offsetHeight - getParentDivScrollTopForInput();
		}
		temObj.style.left = jsfw.getAbsoluteLeft(obj) + obj.offsetWidth - 25;
		if(window._jsfw_Window_zIndex){
			temObj.style.zIndex =  window._jsfw_Window_zIndex+ 100;
		}else{
			temObj.style.zIndex = 200;
		}
//		temObj.style.zIndex = window._jsfw_Window_zIndex + 100;
		temObj.getElementsByTagName('table')[0].rows[0].cells[1].align = "left";
		temObj.getElementsByTagName('table')[0].rows[0].cells[1].innerHTML = '<div class="jsfw_Tip_Arr_1">';
		if ((parseInt(temObj.style.left)+iWidth)>document.body.clientWidth){
			temObj.style.left = jsfw.getAbsoluteLeft(obj) + obj.offsetWidth - iWidth - 10;
			temObj.getElementsByTagName('table')[0].rows[0].cells[1].align = "right";
			temObj.getElementsByTagName('table')[0].rows[0].cells[1].innerHTML = '<div class="jsfw_Tip_Arr_2">';
		}
		temObj.style.display='';
		if (iTime>0) {
			clearTimeout(temObj.timHide);
			temObj.timHide = setTimeout(function(){temObj.style.display='none';},iTime);
		}
		return;
	}

	var oDiv = document.createElement('div');
	oDiv.className = "jsfw_Tip";
	oDiv.id = "jsfw_Tip_div";
	oDiv.name = "jsfw_Tip_div";
	oDiv.style.position = "absolute";
	oDiv.style.height = iHeight;
	oDiv.style.width = iWidth;
	oDiv.timHide = null;
	if(window._jsfw_Window_zIndex){
		oDiv.style.zIndex =  window._jsfw_Window_zIndex+ 100;
	}else{
		oDiv.style.zIndex = 200;
	}
//	oDiv.style.zIndex = window._jsfw_Window_zIndex + 100;

	var strTem='';
	if (/msie/i.test(navigator.userAgent)) strTem += '<iframe frameborder=0 src="" scrolling="no" style="position:absolute; visibility:inherit; top:0px; left:0px; width:' + (iWidth+4)+'; height:'+(iHeight+8)+'; z-index:-1; filter=\'progid:DXImageTransform.Microsoft.Alpha(style=0,opacity=0)\';"></iframe>';
	strTem += '<table class="TipTable" width="'+iWidth+'" style="height:'+iHeight+'" border="0" cellpadding="0" cellspacing="0">';
	strTem += '<tr>';
	strTem += '	<td class="jsfw_Tip_0_0"><img width="1"/></td>';
	strTem += '	<td class="jsfw_Tip_0_1" style="padding-left:11px; padding-right:11px;"><div class="jsfw_Tip_Arr_1"></td>';
	strTem += '	<td class="jsfw_Tip_0_2"><img width="1"/></td>';
	strTem += '</tr>';
	strTem += '<tr>';
	strTem += '	<td class="jsfw_Tip_1_0"><img width="1"/></td>';
	strTem += '	<td class="jsfw_Tip_1_1">' + sContent + '</td>';
	strTem += '	<td class="jsfw_Tip_1_2"><img width="1"/></td>';
	strTem += '</tr>';
	strTem += '<tr>';
	strTem += '	<td class="jsfw_Tip_2_0"><img width="1"/></td>';
	strTem += '	<td class="jsfw_Tip_2_1"><img width="1"/></td>';
	strTem += '	<td class="jsfw_Tip_2_2"><img width="1"/></td>';
	strTem += '</tr>';
	strTem += '</table>';
	strTem += '<div class="MsgContent">';
	strTem += '</div>';
	oDiv.innerHTML= strTem;

	oDiv.style.top = jsfw.getAbsoluteTop(obj) + obj.offsetHeight + 0;
	if (typeof(getParentDivScrollTopForInput)=='function'){
		oDiv.style.top = jsfw.getAbsoluteTop(obj) + obj.offsetHeight - getParentDivScrollTopForInput();
	}
	oDiv.style.left = jsfw.getAbsoluteLeft(obj) + obj.offsetWidth - 25;
	if ((parseInt(oDiv.style.left)+iWidth)>document.body.clientWidth){
		oDiv.style.left = jsfw.getAbsoluteLeft(obj) + obj.offsetWidth - iWidth - 10;
		oDiv.getElementsByTagName('table')[0].rows[0].cells[1].align = "right";
		oDiv.getElementsByTagName('table')[0].rows[0].cells[1].innerHTML = '<div class="jsfw_Tip_Arr_2">';//'<img src="'+imgPath+'Arr_2.gif"/>';
	}

	
	//添加阴影
	oDiv.style.filter = 'Shadow(color=#BBBBBB,direction=135,strength=4)';
	oDiv.getElementsByTagName("table")[0].style.filter = 'alpha(opacity=100)';

	document.body.appendChild(oDiv);

	//oDiv.show();
	if (iTime>0) {
		clearTimeout(oDiv.timHide);
		oDiv.timHide = setTimeout(function(){oDiv.style.display='none';},iTime);
	}
	oDiv.onclick=function (){ oDiv.style.display='none'; };

	if (window.attachEvent) window.attachEvent('onunload', function (){
		freeMem();
	});
	//清除内存
	function freeMem(){
		try{
			oDiv.innerHTML = '';
			oDiv.onclick=null;
			clearTimeout(oDiv.timHide);
			oDiv.timHide = null;
			document.body.removeChild(oDiv);
			delete oDiv;
		}catch(e){}
	}
	return oDiv;
};
(
	function ()
	{
		var head = document.getElementsByTagName('head')[0];
		var link = document.createElement('link');
		link.rel = 'stylesheet';
		link.href = jsfw.Path + 'Themes/' + jsfw.Theme + '/Tip/css.css';
		link.type = 'text/css';
		link.media = 'all';
		head.appendChild(link);
	}
)();