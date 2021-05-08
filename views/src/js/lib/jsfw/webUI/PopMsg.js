/*******************************************\
  弹出消息类(2007-03-21)
	Author:Witson
	Demo:
	new jsfw.Class.PopMsg('标题','内容<b>内容</b>内容');

	参数
		iTime(可选)
			显示时间，默认5000(5秒),为0则不自动关闭
\*******************************************/
jsfw.WebUI.PopMsg = function (){
};
//var arrPopMsgDiv = new Array();
var _PopMsg_Title = '';
var _PopMsg_Width = 100;
var _PopMsg_Div = null;
var _PopMsgContent_List = new Array();

jsfw.WebUI.PopMsg.addMsg = function (sContent,sTitle,iWidth){//,iHeight
	sContent = sContent.replace(/<br\/>/img,'<br/>');
	sContent = sContent.replace(/<br>/img,'<br/>');
	_PopMsgContent_List = _PopMsgContent_List.concat(sContent.split("<br/>"));
	//_PopMsgContent_List[_PopMsgContent_List.length] = sContent;
	var strTem='';
	for (var i=0; i<_PopMsgContent_List.length; i++){
		strTem += '<div class="OneLine" title="' + _PopMsgContent_List[i].replace(/<(.*?)>/img,'') + '">' + _PopMsgContent_List[i] + '</div>';
	}
	
	if ((_PopMsg_Div==null) || (!_PopMsg_Div.close)){
		_PopMsg_Title = ((typeof(sTitle)=='string')&&(sTitle!=''))?sTitle:_PopMsg_Title;
		if (_PopMsg_Title=='') _PopMsg_Title='消息';
		_PopMsg_Div = jsfw.WebUI.PopMsg.newMsg(strTem,_PopMsg_Title,0);
		_PopMsg_Div.style.zIndex = 11000;
	}else{
		//if (!jsfw.$('jsfw_sound_obj')){var oSound=document.createElement('bgsound');oSound.id='jsfw_sound_obj';document.body.appendChild(oSound);}
		//jsfw.$('jsfw_sound_obj').src = jsfw.Path + 'Themes/' + jsfw.Theme + '/PopMsg/Sound.mid';
		_PopMsg_Div.setContent(strTem);
	}
	_PopMsg_Div.setHeightForAddMsg();
};
jsfw.WebUI.PopMsg.delMsg = function (idx){
	if (typeof(idx)=='object'){
		if ((_PopMsg_Div==null) || (!_PopMsg_Div.close)) return;
		var objs=_PopMsg_Div.getElementsByTagName('div');
		var intTem=0;
		for (var i=0; i<objs.length; i++){
			if (objs[i].className=='OneLine'){
				if (objs[i]==idx){
					jsfw.WebUI.PopMsg.delMsg(intTem);
					return;
				}
				intTem++;
			}
		}
		return;
	}
	//
	if (idx>-1){
		_PopMsgContent_List.splice(idx,1);
	}else{
		for (var i=(_PopMsgContent_List.length-1); i>=0; i--)
			_PopMsgContent_List.splice(i,1);
	}
	if ((_PopMsg_Div!=null) && (_PopMsg_Div.close)){
		var strTem='';
		for (var i=0; i<_PopMsgContent_List.length; i++)
			strTem += '<div class="OneLine" title="' + _PopMsgContent_List[i].replace(/<(.*?)>/img,'') + '">' + _PopMsgContent_List[i] + '</div>';
		_PopMsg_Div.setContent(strTem);
		if (_PopMsgContent_List.length==0){
			_PopMsg_Div.close();
		}else{
			_PopMsg_Div.setHeightForAddMsg();
		}
	}
};

jsfw.WebUI.PopMsg.newMsg = function (sContent,sTitle,iTime,iWidth,iHeight){
	//if (!jsfw.$('jsfw_sound_obj')){var oSound=document.createElement('bgsound');oSound.id='jsfw_sound_obj';document.body.appendChild(oSound);}
	//jsfw.$('jsfw_sound_obj').src = jsfw.Path + 'Themes/' + jsfw.Theme + '/PopMsg/Sound.mid';
	iWidth = ((typeof(iWidth)=='number') && (iWidth>50))?iWidth:200;
	iHeight = ((typeof(iHeight)=='number') && (iHeight>30))?iHeight:102;
	iTime = (typeof(iTime)=='number')?iTime:5000;

	var chaLeft=0;
	var chaTop =0;

	var oDiv = document.createElement('div');
	oDiv.className = "jsfw_PopMsg";
	oDiv.style.position = "absolute";
	oDiv.style.height = iHeight;
	oDiv.style.width = iWidth;
	oDiv.style.zIndex = 10000;

	var strTem='';
	if (/msie/i.test(navigator.userAgent)) strTem += '<iframe frameborder=0 src="" style="position:absolute; visibility:inherit; top:0px; left:0px; width:' + (iWidth-3)+'; height:'+(iHeight+2)+'; z-index:-1; filter1=\'progid:DXImageTransform.Microsoft.Alpha(style=0,opacity=0)\';"></iframe>';
	strTem += '<table class="MsgTitle" width="100%" border="0" cellpadding="0" cellspacing="0"><tr><td class="Title">1</td><td width="20"  class="Close" onclick="this.parentNode.parentNode.parentNode.parentNode.close()"><img width="1"/></td></tr></table>';
	strTem += '<div class="MsgContent">';
	strTem += '</div>';
	oDiv.innerHTML= strTem;

	var oTitle = oDiv.getElementsByTagName("table")[0].rows[0].cells[0];
	var oClose = oDiv.getElementsByTagName("table")[0].rows[0].cells[1];
	var oContent = oDiv.getElementsByTagName("div")[0];
	oContent.style.height = iHeight-oTitle.offsetHeight-4;
	if (!/msie/i.test(navigator.userAgent)){
		oContent.style.height = parseInt(oContent.style.height) - Math.abs(parseInt(oContent.clientHeight) - parseInt(oContent.style.height));
	}
	oTitle.innerHTML=sTitle;
	oContent.innerHTML=sContent;

	oDiv.close = function(){
		function hidet(){
			if (parseInt(oDiv.style.height) <= 20){
				setTimeout(freeMem,10);
			}else{
				oDiv.style.height = parseInt(oDiv.style.height)-15;
				oDiv.style.top = parseInt(oDiv.style.top)+15;//document.body.scrollTop + document.body.clientHeight - oDiv.offsetHeight -5;
				setTimeout(hidet,10);
			}
		}
		hidet();
	}
	oDiv.show = function (){
		oDiv.style.top = -1000;
		oDiv.style.height = 20;
		oDiv.style.display = '';

		var objs = document.getElementsByName('div_jsfw_PopMsg');
		var iFrom = document.body.scrollTop + document.body.clientHeight - iHeight -5;
		var iTo = iFrom + iHeight;
		
		for (var i=0; i<objs.length; i++){
			var intTem = (iFrom + iTo)/2;
			var idx=-1;
			for (var j=0; j<objs.length; j++){
				if ((!objs[j].moved) && (intTem>objs[j].iFrom) && (intTem<objs[j].iTo)) idx=j;
			}
			if (idx==-1){
				break;
			}
			var iFrom = objs[idx].iFrom - iHeight - 2;
			var iTo = objs[idx].iFrom - 2;
			/*if ((intTem>objs[i].iFrom) && (intTem<objs[i].iTo)){
			}else{
				break;
			}*/
		}
		oDiv.iFrom = iFrom;
		oDiv.iTo = iTo;
		/*if (objs.length==0){
		}else{
		}*/
		oDiv.id = 'div_jsfw_PopMsg';
		oDiv.name = 'div_jsfw_PopMsg';

		oDiv.style.top = oDiv.iTo - oDiv.offsetHeight -5;
		oDiv.style.left = document.body.scrollLeft + document.body.offsetWidth - oDiv.offsetWidth - 25;
		try{oContent.style.height = oDiv.offsetHeight - oTitle.offsetHeight-4;}catch (e){}
		function showt(){
			oDiv.style.top = oDiv.iTo - oDiv.offsetHeight -15;
			oDiv.style.height = parseInt(oDiv.style.height)+10;
			if (parseInt(oDiv.style.height) >= iHeight){
				oDiv.style.top = oDiv.iFrom;
				oDiv.style.height = iHeight;
				try{oContent.style.height = oDiv.offsetHeight - oTitle.offsetHeight-4;}catch (e){}
			}else{
				setTimeout(showt,10);
			}
		}
		showt();
	}

	oDiv.funDrag = function(e){
		e = e || event;
		oDiv.style.left = (oDiv.style.left=e.clientX-chaLeft) + "px";
		oDiv.style.top = (oDiv.style.top=e.clientY-chaTop) + "px";
	}
	oDiv.funDrop = function(){
		if(oTitle.releaseCapture)
			oTitle.releaseCapture();
		else if(window.captureEvents)
			window.captureEvents(Event.MOUSEMOVE|Event.MOUSEUP);
		document.onmousemove = document.onmouseup = document.onselectstart = null;
		if (parseInt(oDiv.style.left)<0) oDiv.style.left=0;
		if (parseInt(oDiv.style.top)<0) oDiv.style.top=0;
		if (!oDiv.moved) oDiv.moved=true;
	}
	oTitle.onmousedown = function (e){
		e = e || event;
		if(oTitle.setCapture)
			oTitle.setCapture();
		else if(window.captureEvents)
			window.captureEvents(Event.MOUSEMOVE|Event.MOUSEUP);
		oDiv = oDiv;
		chaLeft = e.clientX - parseInt(oDiv.style.left);
		chaTop = e.clientY - parseInt(oDiv.style.top);
		document.onmousemove = oDiv.funDrag;
		document.onmouseup   = oDiv.funDrop;
		document.onselectstart = function(){return false;};
	};
	//设置消息内容
	oDiv.setContent = function (value){
		oContent.innerHTML = value;
	}
	oDiv.setHeightForAddMsg = function (){
		if (oDiv.offsetHeight < (iHeight-2)){
			oContent.style.overflow = 'visible';
			oContent.style.height = '';
			iHeight = oContent.offsetHeight + oTitle.offsetHeight + 4;
			if (iHeight>250) iHeight=250;
			oDiv.iFrom = oDiv.iTo - iHeight;
			oContent.style.overflow = 'auto';
		}else{
			var intTem=0;
			oContent.style.overflow = 'visible';
			intTem = iHeight;
			oContent.style.height = '';
			iHeight = oContent.offsetHeight + oTitle.offsetHeight + 4;
			if (iHeight>250) iHeight=250;
			intTem = iHeight-intTem;
			oDiv.style.top = parseInt(oDiv.style.top) - intTem;
			oDiv.style.height = iHeight;
			oContent.style.overflow = (oContent.offsetHeight<(iHeight-oTitle.offsetHeight))?'visible':'auto';
			oContent.style.height = iHeight-oTitle.offsetHeight-4;
			oDiv.iFrom = oDiv.iTo - iHeight;
		}
	}

	oDiv.style.display = 'none';
	document.body.appendChild(oDiv);

	oDiv.show();
	if (iTime>0) setTimeout(oDiv.close,iTime);

	if (window.attachEvent) window.attachEvent('onunload', function (){
		freeMem();
	});
	//清除内存
	function freeMem(){
		try{
			oDiv.funDrag = null;
			oDiv.funDrop = null;
			oDiv.iFrom = null;
			oDiv.iTo = null;
			oDiv.moved = null;
			oDiv.close = null;
			oDiv.show = null;
			oDiv.setContent = null;
			oDiv.setHeightForAddMsg = null;
			oTitle.onmousedown = null;
			oDiv.innerHTML = '';
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
		link.href = jsfw.Path + 'Themes/' + jsfw.Theme + '/PopMsg/css.css';
		link.type = 'text/css';
		link.media = 'all';
		head.appendChild(link);
	}
)();