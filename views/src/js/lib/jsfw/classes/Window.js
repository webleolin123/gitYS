/*******************************************\
  Window 类(2007-4-5)
	Author:Witson(Witson@163.com)
\*******************************************/
jsfw.Class.Window = function (sTitle,sURL,iWidth,iHeight,iLeft,iTop,bModalWindow){
	var me = this;

	this.title = ((typeof(sTitle)=='string') && (sTitle!='')) ? sTitle:'&nbsp;';
	this.width = ((typeof(iWidth)=='number') && (iWidth>5)) ? iWidth:480;
	this.height = ((typeof(iHeight)=='number') && (iHeight>5)) ? iHeight:360;
	this.bModal = (typeof(bModalWindow)=='boolean')?bModalWindow:false;

	var intTem = parseInt((document.body.clientWidth - this.width)/2 + document.body.scrollLeft);
	this.left = ((typeof(iLeft)=='number') && (iLeft>0)) ? iLeft:intTem;
	intTem=parseInt((document.body.clientHeight - this.height)/2 + document.body.scrollTop);
	this.top = ((typeof(iTop)=='number') && (iTop>0)) ? iTop:intTem;

	this.setWidth = function(value){me.width=value; me.setUI();}
	this.setHeight = function(value){me.height=value; me.setUI();}
	this.setLeft = function(value){me.left=value; me.setUI();}
	this.setTop = function(value){me.top=value; me.setUI();}
	this.setTitle = function(value){me.title=value; me.setUI();}
	//系统属性
	this.isMaxStatus = false;
	this.dragStatus = false;
	this.maxButton = !bModalWindow;
	this.sizeable = !bModalWindow;
	this.closeButton = (typeof(sURL)=='string');
	this.refreshButton = (typeof(sURL)=='string');
	this.hideButton = !(typeof(sURL)=='string');
	this.setMaxButton = function(value){me.maxButton=value; me.sizeable=value; me.setUI();}
	this.setSizeable = function(value){me.sizeable=value; me.setUI();}
	this.setCloseButton=function(value){me.closeButton=value; me.setUI();}
	this.setRefreshButton=function(value){me.refreshButton=value; me.setUI();}
	this.setHideButton=function(value){me.hideButton=value; me.setUI();}
	this.IFrameName = 'jsfw_Window_' + (parseInt(Math.random()*10000000).toString());

	//调整位置及大小，设置标题
	this.setUI = function (){
		var tabMain=me.oDiv.getElementsByTagName('table')[0];
		if (!me.isMaxStatus){
			me.oDiv.style.width = me.width+4;
			me.oDiv.getElementsByTagName("table")[0].style.width = me.width;
			me.oDiv.style.height = me.height+4;
			me.oDiv.getElementsByTagName("table")[0].style.height = me.height;
			me.oDiv.style.left = me.left;
			me.oDiv.style.top = me.top;
			tabMain.rows[1].cells[2].style.cursor= (me.sizeable?'e-resize':'default');
			tabMain.rows[2].cells[1].style.cursor= (me.sizeable?'s-resize':'default');
			tabMain.rows[2].cells[2].style.cursor=(me.sizeable?'se-resize':'default');
		}else{
			tabMain.rows[1].cells[2].style.cursor='default';
			tabMain.rows[2].cells[1].style.cursor='default';
			tabMain.rows[2].cells[2].style.cursor='default';
		}
		//me.oDiv.getElementsByTagName("table")[0].getElementsByTagName("table")[0].rows[0].cells[0].innerHTML = me.title;
		me.oDiv.getElementsByTagName("table")[1].rows[0].cells[0].getElementsByTagName("span")[0].innerHTML = me.title;
		me.oDiv.getElementsByTagName("table")[2].rows[0].cells[0].style.display = me.refreshButton?'':'none';
		me.oDiv.getElementsByTagName("table")[2].rows[0].cells[1].style.display = me.maxButton?'':'none';
		me.oDiv.getElementsByTagName("table")[2].rows[0].cells[2].style.display = me.closeButton?'':'none';
		me.oDiv.getElementsByTagName("table")[2].rows[0].cells[3].style.display = me.hideButton?'':'none';
	}
	//设置内容
	this.setContent = function (oValue){
		if (typeof(oValue)=='string'){//
			me.oDiv.getElementsByTagName("table")[0].rows[1].cells[1].innerHTML='<iframe name="' + me.IFrameName + '" onload="try{this.parentNode.parentNode.parentNode.parentNode.parentNode.setTitle(document.frames[\'' + me.IFrameName +'\'].document.title); document.frames[\'' + me.IFrameName +'\'].focus(); document.frames[\'' + me.IFrameName +'\'].close=function(){jsfw.WebUI.Window.findWindow(document.frames[\'' + me.IFrameName +'\']).close()}; document.frames[\'' + me.IFrameName +'\'].returnFunc=function(param){try {jsfw.WebUI.Window.findWindow(document.frames[\'' + me.IFrameName +'\']).returnFunc(param)}catch(e){}}; }catch(e){}"  src="' + oValue + '" style="width:100%;height:100%" marginwidth="0" scrolling="auto" frameborder="0"></iframe><div style="display:none">this is a Window Dialog,Write by Witson.</div>';
		}else{
			me.oDiv.getElementsByTagName("table")[0].rows[1].cells[1].appendChild(oValue);
			oValue.style.display = ''; oValue.style.width = '100%'; oValue.style.height = '100%';
		}
	}

	///拖动[BEGIN]-------------------
	this.Drag = function(e){
		if (me.isMaxStatus) return ;
		e = e || event;
		me.oDiv.style.left = (me.left=e.clientX-me.chaLeft) + "px";
		me.oDiv.style.top = (me.top=e.clientY-me.chaTop) + "px";
	}
	this.Drop = function(){
		if(me.oTitle.releaseCapture) 
			me.oTitle.releaseCapture();
		else if(window.captureEvents)
			window.captureEvents(Event.MOUSEMOVE|Event.MOUSEUP);

		document.onmousemove = document.onmouseup = document.onselectstart = null;
		var scL = document.body.scrollLeft;
		var scT = document.body.scrollTop;
		var cW = document.body.clientWidth;
		var cH = document.body.clientHeight;
		if (parseInt(me.oDiv.style.left)<0) {me.oDiv.style.left=0; me.left=0;}
		if (parseInt(me.oDiv.style.top)<0) {me.oDiv.style.top=0; me.top=0;}
		if (document.body.scroll=='no'){
			if (me.bModal){
				if (parseInt(me.oDiv.style.left)<scL) {me.oDiv.style.left=scL; me.left=scL;}
				if (parseInt(me.oDiv.style.top)<scT) {me.oDiv.style.top=scT; me.top=scT;}
				if (parseInt(me.oDiv.style.left)>(cW+scL-50)) {me.oDiv.style.left=(cW+scL-50); me.left=(cW+scL-50);}
				if (parseInt(me.oDiv.style.top)>(cH+scT-40)) {me.oDiv.style.top=(cH+scT-40); me.top=(cH+scT-40);}
			}else{
				if (parseInt(me.oDiv.style.left)>(cW-50)) {me.oDiv.style.left=(cW-50); me.left=(cW-50);}
				if (parseInt(me.oDiv.style.top)>(cH-40)) {me.oDiv.style.top=(cH-40); me.top=(cH-40);}
			}
		}
	}
	///拖动[END]-------------------
	
	this.oDiv = document.createElement("div");
	this.oDiv.className='jsfw_Window';
	this.oDiv.style.position='absolute';
	//this.oDiv.style.border = "1px solid red";
	//this.oDiv.style.filter = 'Shadow(color=#660099,direction=135)';
	//this.oDiv.style.filter = 'Shadow(color=#AAAAAA,direction=135,strength=4)';
	//this.oDiv.style.filter = 'alpha(opacity=100)';


	var strTem='this.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode';
	var s='';
	if (/msie/i.test(navigator.userAgent)) s += '<iframe frameborder=0 src="" style="position:absolute; visibility:inherit; top:0px; left:0px; width:99%; height:95%; z-index:-1;  filter1=\'progid:DXImageTransform.Microsoft.Alpha(style=0,opacity=0)\';"></iframe>';
	s += '<table width="'+this.width+'" height="'+this.height+'" cellspacing="0" cellpadding="0" border="0" class="jsfw_Window_table">';
	s += '	<tr>';
	s += '		<td class="jsfw_Window_0_0"></td>';
	s += '		<td class="jsfw_Window_0_1">';
	s += '<table width="100%" border="0" cellpadding="0" cellspacing="0" style="table-layout :fixed;"><tr>';
	s += '<td unselectable="on" class="jsfw_Window_Title" ondblclick="this.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.max()"><span unselectable="on" class="jsfw_Window_Title">' + this.title + '</span></td>';
	s += '<td unselectable="on" class="jsfw_Window_SysBtn" width="57" valign="top" align="right"><table border="0" cellpadding="0" cellspacing="0"><tr>';
	s += '<td class="jsfw_Window_Refresh" onclick="' + strTem + '.refresh();" title="刷新"></td>';
	s += '<td class="jsfw_Window_Max" onclick="' + strTem + '.max();" title="最大化/还原"></td>';
	s += '<td class="jsfw_Window_Close" onclick="' + strTem + '.close();" title="关闭"></td>';
	s += '<td class="jsfw_Window_Hide" onclick="' + strTem + '.hide();" title="隐藏"></td>';
	s += '</tr></table></td>';
	s += '</tr></table>'
	s += '</td>';
	s += '		<td class="jsfw_Window_0_2"></td>';
	s += '	</tr>';
	s += '	<tr>';
	s += '		<td class="jsfw_Window_1_0"></td>';
	s += '		<td class="jsfw_Window_1_1"></td>';//' + this.Content + '
	s += '		<td class="jsfw_Window_1_2"></td>';
	s += '	</tr>';
	s += '	<tr>';
	s += '		<td class="jsfw_Window_2_0"></td>';
	s += '		<td class="jsfw_Window_2_1"></td>';
	s += '		<td class="jsfw_Window_2_2"></td>';
	s += '	</tr>';
	s += '</table>';
	this.oDiv.innerHTML = s;
	this.setContent(sURL);
	
	this.oTitle = this.oDiv.getElementsByTagName('table')[1].rows[0].cells[0];
	//捕捉拖动
	this.oTitle.onmousedown = function (e){
		e = e || event;
		if(me.oTitle.setCapture)
			me.oTitle.setCapture();
		else if(window.captureEvents)
			window.captureEvents(Event.MOUSEMOVE|Event.MOUSEUP);
		me.dragStatus = true;
		me.chaLeft = e.clientX - me.left;
		me.chaTop = e.clientY - me.top;
		document.onmousemove = me.Drag;
		document.onmouseup   = me.Drop;
		document.onselectstart = function(){return false;};
	};
	
	this.oDiv.setTitle = function(value){
			me.title=value; me.setUI();
	}

	//模式窗口返回值
	this.returnFunc = null;

	//关闭窗口
	this.oDiv.close = this.close = function (){
		if (!me) return;
		/*if (document.frames[me.IFrameName].document.body.onunload){
			alert(document.frames[me.IFrameName].document.body.onunload);
		}*/
		/*if (!isContentObject){
			try{
				var bRet=me.oContent.contentWindow.beforeunload();
				if ((typeof(bRet)=='boolean')&&(!bRet)) return;
			}catch(e){}
		}
		if (this.divGray!=null) document.body.removeChild(me.divGray);
		document.body.scroll=me.bodyScroll;
		this.oContent.style.display='none';
		if (isContentObject){
			document.body.appendChild(this.oContent);
		}else{
		}*/
		try{
			if (me.divGray!=null) me.divGray.style.display='none';
		}catch(e){}
		try{
			if(/msie/i.test(navigator.userAgent)){
				if (document.frames[me.IFrameName]) {
					try{
						document.frames[me.IFrameName].document.write("");
						document.frames[me.IFrameName].document.clear();
					}catch(e){
						document.frames[me.IFrameName].location='about:blank';
					}
					//document.frames[me.IFrameName].location='about:blank';
				}
			}else{
				var iframe = document.getElementsByName(me.IFrameName)[0];
				if (iframe) {
					try{
						iframe.contentDocument.write("");
						iframe.contentDocument.clear();
					}catch(e){
						iframe.src='about:blank';
					}
					//document.frames[me.IFrameName].location='about:blank';
				}
			}
		}catch(e){}
		//if (me.bModal) 
			document.body.scroll=me.bodyScroll;
		me.oDiv.style.display = 'none';
		setTimeout(function (){
			try{
				if(/msie/i.test(navigator.userAgent)){
					if (document.frames[me.IFrameName]){
						//alert(document.frames[me.IFrameName].document.body);
						//if (document.frames[me.IFrameName].location=='about:blank'){
						if ((!document.frames[me.IFrameName].document.body)||(document.frames[me.IFrameName].location=='about:blank')){
							freeMem();
						}else{
							me.oDiv.style.display = '';
						}
					}else{
						freeMem();
					}
				}else{
					var iframe = document.getElementsByName(me.IFrameName)[0];
					if (iframe){
						//alert(document.frames[me.IFrameName].document.body);
						//if (document.frames[me.IFrameName].location=='about:blank'){
						if ((!iframe.contentDocument.body)||(iframe.src=='about:blank')){
							freeMem();
						}else{
							me.oDiv.style.display = '';
						}
					}else{
						freeMem();
					}
				}
			}catch(e){}
		},500);
	}
	//显示
	this.oDiv.show = this.show = function(){
		if (me.divGray!=null) me.divGray.style.display='';
		me.oDiv.style.display='';
	}
	//隐藏
	this.oDiv.hide = this.hide = function(){
		if (me.bModal) document.body.scroll=me.bodyScroll;
		if (me.divGray!=null) me.divGray.style.display='none';
		me.oDiv.style.display='none';
	}
	//显示/隐藏
	this.oDiv.showHide = this.showHide = function(){
		if (me.oDiv.style.display=='none'){
			this.show();
		}else{
			this.hide();
		}
	}
	//刷新
	this.oDiv.refresh = this.refresh = function(){
		document.frames[me.IFrameName].history.go();
	}
	//最大化
	this.oDiv.max = this.max = function(){
		if (!me.maxButton) return ;
		var tabMain=me.oDiv.getElementsByTagName('table')[0];
		me.isMaxStatus = ! me.isMaxStatus;
		if (me.afterMax) me.afterMax(me.isMaxStatus);
		if (me.isMaxStatus){
			document.body.scroll='no';
			me.oDiv.className='jsfw_Window_noShadow';
			me.oDiv.style.left = 0 + document.body.scrollLeft + "px";
			me.oDiv.style.top = 0 + document.body.scrollTop + "px";
			me.oDiv.style.width = document.body.clientWidth + "px";
			me.oDiv.style.height = document.body.clientHeight + "px";
			me.oDiv.getElementsByTagName("table")[0].style.width = '100%';
			me.oDiv.getElementsByTagName("table")[0].style.height = '100%';
			
			if (me.afterResize) me.afterResize(document.body.clientWidth,document.body.clientHeight);
			if (me.sizeable) {
				tabMain.rows[1].cells[2].style.cursor='default';
				tabMain.rows[2].cells[1].style.cursor='default';
				tabMain.rows[2].cells[2].style.cursor='default';
			}
		}else{
			//if ((!/msie/i.test(navigator.userAgent)) && (!/opera/i.test(navigator.userAgent))) me.oContent.style.height = '100%';
			me.oDiv.className='jsfw_Window';
			if (me.left<0) me.left=0;
			if (me.top<0) me.top=0;
			me.oDiv.style.left = me.left + "px";
			me.oDiv.style.top = me.top + "px";
			me.oDiv.style.width = me.width+4 + "px";
			me.oDiv.style.height = me.height+4 + "px";
			me.oDiv.getElementsByTagName("table")[0].style.width = me.width;
			me.oDiv.getElementsByTagName("table")[0].style.height = me.height;

			if (me.afterResize) me.afterResize(me.width,me.height);
			if (me.sizeable) {
				tabMain.rows[1].cells[2].style.cursor= 'e-resize';
				tabMain.rows[2].cells[1].style.cursor= 's-resize';
				tabMain.rows[2].cells[2].style.cursor='se-resize';
			}
			document.body.scroll=me.bodyScroll;
		}
		/*oContentTD.style.display = "block";
		if ((!/msie/i.test(navigator.userAgent)) && (!/opera/i.test(navigator.userAgent)) && (me.maxButton)){
			var temObj=oDiv.getElementsByTagName("table")[0];
			me.oContent.style.height = temObj.offsetHeight- temObj.rows[0].cells[0].offsetHeight- temObj.rows[0].cells[2].offsetHeight;
		}*/
	}
	//置前
	// this.oDiv.onmousedown = function () {
	// 	me.oDiv.style.zIndex = ++window._jsfw_Window_zIndex;
	// 	/*if (window._jsfw_Window_currentWindow!="w"){
	// 		var contable = window._jsfw_Window_currentWindow.getElementsByTagName("table")[0];
	// 	}			
	// 	var contable = oDiv.getElementsByTagName("table")[0];
	// 	window._jsfw_Window_currentWindow = oDiv;*/
	// }

	document.body.appendChild(this.oDiv);
	me.bodyScroll = document.body.scroll;
	this.oDiv.style.zIndex = ++window._jsfw_Window_zIndex;
	this.setUI();
	if (this.bModal){
		document.body.scroll='no';
		//document.body.style.overflow='hidden';
		me.setMaxButton(false);
		this.divGray=document.createElement("div");
		//this.divGray.style.border='1px solid red';
		this.divGray.style.position='absolute';
		this.divGray.style.left=document.body.scrollLeft;
		this.divGray.style.top=document.body.scrollTop;
		this.divGray.style.height= document.body.clientHeight;
		this.divGray.style.width= document.body.clientWidth;
		this.divGray.style.backgroundColor='#DDDDDD';
		this.divGray.style.filter = 'alpha(opacity=30)';
		this.divGray.style.MozOpacity=0.4;
		this.divGray.style.opacity=0.4;
		this.divGray.style.zIndex = window._jsfw_Window_zIndex-1;
		document.body.appendChild(this.divGray);
	}
	try{
		//me.oDiv.getElementsByTagName("table")[0].rows[1].cells[1].all[0].focus();
		document.frames[me.IFrameName].focus();
	}catch(e){}

	//改变窗口大小
	if (!jsfw.WebUI.Action) jsfw.Import("WebUI.Action");
	me.oDiv.getElementsByTagName('table')[0].rows[1].cells[2].onmousedown=function (){
		if ((!me.isMaxStatus) && (me.sizeable)) jsfw.WebUI.Action.ResizeFrame(me.oDiv,function (iW,iH){me.setHeight(iH-4);me.setWidth(iW-4);if (me.afterResize) me.afterResize(iW,iH);},'Right');
	}
	me.oDiv.getElementsByTagName('table')[0].rows[2].cells[1].onmousedown=function (){
		if ((!me.isMaxStatus) && (me.sizeable)) jsfw.WebUI.Action.ResizeFrame(me.oDiv,function (iW,iH){me.setHeight(iH-4);me.setWidth(iW-4);if (me.afterResize) me.afterResize(iW,iH);},'Bottom');
	}
	me.oDiv.getElementsByTagName('table')[0].rows[2].cells[2].onmousedown=function (){
		if ((!me.isMaxStatus) && (me.sizeable)) jsfw.WebUI.Action.ResizeFrame(me.oDiv,function (iW,iH){me.setHeight(iH-4);me.setWidth(iW-4);if (me.afterResize) me.afterResize(iW,iH);});
	}


	if (window.attachEvent) window.attachEvent('onresize', function (){
		try{
			if (me.isMaxStatus){
				me.oDiv.style.left = 0 + document.body.scrollLeft + "px";
				me.oDiv.style.top = 0 + document.body.scrollTop + "px";
				me.oDiv.style.width = document.body.clientWidth + "px";
				me.oDiv.style.height = document.body.clientHeight + "px";
				me.oDiv.getElementsByTagName("table")[0].style.width = '100%';
				me.oDiv.getElementsByTagName("table")[0].style.height = '100%';
			}
		}catch(e){}
	});

	//清除内存
	if (window.attachEvent) window.attachEvent('onunload', function (){
		freeMem();
	});
	function freeMem(){
		try{
			if(/msie/i.test(navigator.userAgent)){
				if (document.frames[me.IFrameName]) {
					document.frames[me.IFrameName].document.write("");
					document.frames[me.IFrameName].document.clear();
					//document.frames[me.IFrameName].location='about:blank';
				}
				document.body.removeChild(document.frames[me.IFrameName]);
			}else{
				var iframe = document.getElementsByName(me.IFrameName)[0];
				if (iframe) {
					iframe.contentDocument.write("");
					iframe.contentDocument.clear();
					//document.frames[me.IFrameName].location='about:blank';
				}
				document.body.removeChild(iframe);
			}
		}catch(e){}
		try{
			document.body.removeChild(me.oDiv);
		}catch(e){}
		try{
			jsfw.WebUI.Window.delWindow(me);
		}catch (e){}
		try{
			me.oDiv.getElementsByTagName('table')[0].rows[1].cells[2].onmousedown=null;
			me.oDiv.getElementsByTagName('table')[0].rows[2].cells[1].onmousedown=null;
			me.oDiv.getElementsByTagName('table')[0].rows[2].cells[2].onmousedown=null;
			me.oTitle.onmousedown = null;
			me.oTitle = null;
			me.oDiv.onmousedown = null;
			me.oDiv.setTitle = null;
			me.oDiv.close = null;
			me.oDiv.show = null;
			me.oDiv.hide = null;
			me.oDiv.max = null;
			me.oDiv.refresh = null;
			me.oDiv.innerHTML="";
			me.oDiv=null;
			me.returnFunc = null;
		}catch(e){}
		try{
			delete me;
			me=null;
			CollectGarbage();
		}catch(e){}
		//setTimeout("CollectGarbage();", 1); 
	}
};
(
	function ()
	{
		var head = document.getElementsByTagName('head')[0];
		var link = document.createElement('link');
		link.rel = 'stylesheet';
		link.href = jsfw.Path + 'Themes/' + jsfw.Theme + '/Window/css.css';
		link.type = 'text/css';
		link.media = 'all';
		head.appendChild(link);
		if (!window._jsfw_Window_zIndex) window._jsfw_Window_zIndex = 1000;
	}
)();