jsfw.WebUI.WebEdit = function (oText){
	if (oText.disabled) return;
	if (!jsfw.WebUI.Toolbar) jsfw.Import("WebUI.Toolbar");
	if (!jsfw.WebUI.Color) jsfw.Import("WebUI.Color");
	if (!jsfw.WebUI.Window) jsfw.Import("WebUI.Window");
	//if (!jsfw.Class._MenuItemList) jsfw.Import("classes._MenuItemList");
	var oTab = document.createElement("table");
	oTab.className = 'jsfw_WebEdit';
	oTab.insertRow(0).insertCell(0);
	oTab.insertRow(0).insertCell(0).style.height=22;
	oTab.cellPadding=0; oTab.cellSpacing=0; oTab.border=0;
	oTab.style.width = (oText.offsetWidth>160)?oText.offsetWidth:500;
	oTab.style.height = (oText.offsetHeight>80)?oText.offsetHeight:300;
	oText.oTab = oTab;
	//工具栏
	var oDivTB = document.createElement("div");
	oDivTB.className = 'Toolbar';
	if (!oText.getAttribute('Toolbar') || (oText.getAttribute('Toolbar')=='')){
		oDivTB.setAttribute('URL',jsfw.Path + 'webUI/WebEdit/Default.xml');
	}else{
		oDivTB.setAttribute('URL',jsfw.Path + 'webUI/WebEdit/'+oText.getAttribute('Toolbar')+'.xml');
	}
	oTab.rows[0].cells[0].appendChild(oDivTB);
	oText.oDivTB = oDivTB;

	//编辑框
	var IFrameName = 'IFrame_' + (parseInt(Math.random()*10000000).toString());
	oText.IFrameName = IFrameName;
	oTab.rows[1].cells[0].innerHTML = '<iframe id="' + IFrameName + '" name="' + IFrameName + '" marginwidth=3 marginheight=3 scrolling="auto" style="height:100%;width:100%;" frameborder="0"></iframe>';
	/*var oIFrame = document.createElement("iframe");
	//oIFrame.frameBorder=0;
	oIFrame.style.width='100%';
	oIFrame.style.height='100%';
	oTab.rows[1].cells[0].appendChild(oIFrame);
	oText.oIFrame = oIFrame;*/

	oText.style.display = 'none';	


	oText.parentNode.insertBefore(oTab,oText);
	if (!oText.oDivTB.Formated) jsfw.WebUI.Toolbar(oText.oDivTB);
	//添加按钮点击事件
	oText.oDivTB.oPopupMenu.afterItemClick = function (aItem){
		var exInfo = typeof(aItem)=='object'?aItem.exInfo:aItem;
		if (exInfo!=''){
			oText.WE_focus();
			if (exInfo.toLowerCase().substr(0,4)=='fmt_'){//处理Format
				oText.WE_format(exInfo.substr(4));
			}
			if (exInfo.toLowerCase().substr(0,5)=='emot_'){//插入表情
				oText.WE_insertHTML('<img src="' + jsfw.Path + 'webUI/WebEdit/Emot/' + exInfo.substr(5) +'"   border="0" >');
				oText.WE_focus();
			}
			if (exInfo.toLowerCase().substr(0,4)=='fud_'){//对话框
				var arr = exInfo.substr(4).split(',');
				oText.WE_dialog(arr[0], jsfw.Path + 'webUI/WebEdit/Dialog/' + arr[0] + '.htm', parseInt(arr[1]), parseInt(arr[2]));
			}
			//设置Textarea值
			oText.GetValueFromIFrame();
		}
	}

	// 格式化编辑器中的内容
	oText.WE_format = function(str) {
		var arr=str.split(',');
		var what=arr[0];
		var opt=arr[1]?arr[1]:null;
		var doc=oText.WE_getDoc();
		oText.WE_focus();
		if (opt=="RemoveFormat"){
			what=opt;
			opt=null;
		}
		if (opt==null) {doc.execCommand(what,false,null);}
		else doc.execCommand(what,"",opt);
		oText.WE_focus();
		/*if (/msie/i.test(navigator.userAgent)){
			clearTimeout(timSetValue);
			timSetValue = setTimeout(function(){setTextAreaValue()},500);
		}else{setTextAreaValue();}*/
	}

	// 在当前文档位置插入.
	oText.WE_insertHTML = function(html) {
		if (/msie/i.test(navigator.userAgent)){
			if (oText.WE_getDoc().selection.type.toLowerCase() != "none") oText.WE_getDoc().selection.clear();
			oText.WE_getDoc().selection.createRange().pasteHTML(html);
		}else{
			oText.WE_getDoc().execCommand('insertHTML',false, html);
		}
	}
	//弹出对话框
	oText.WE_dialog = function(sTitle,sURL,iWidth,iHeight) {
		var aWin = jsfw.WebUI.Window.findWindow('jsfw_WebEdit__' + sTitle);
		if (aWin) aWin.close();
		window.curWebEdit = oText;
		jsfw.WebUI.Window.newWindow('jsfw_WebEdit__' + sTitle,sTitle,sURL,iWidth,iHeight,-1,-1,true);
	}

	//从IFrame中获取值
	oText.GetValueFromIFrame = function (){
		oText.value = oText.WE_getDoc().body.innerHTML;
	}

	oText.setValue = function (str){
		oText.value = str;
		oText.WE_getDoc().body.innerHTML = str;
	}
	oText.setFocus = function (){
		oText.WE_focus();
	}

	//编辑器获取焦点
	oText.WE_focus = function (){
		if (/msie/i.test(navigator.userAgent)){
			jsfw.$(this.IFrameName).contentWindow.focus();
		}
	}
	//获取document对象
	oText.WE_getDoc = function (){
		return jsfw.$(oText.IFrameName).contentWindow.document;
	}

	oText.oDivColor_foreColor=null;
	oText.oDivColor_backColor=null;
	oText.oDivEmot_0=null;
	oText.oDivEmot_1=null;
	//初始化工具栏[BEGIN]---------
	oText.initToolbar = function (){
		////字体前景色
		var temItem=oText.oDivTB.oPopupMenu.findItem('foreColor');
		if (temItem!=null){
			var oDivColor = document.createElement("div");
			oDivColor.className='Color';
			oDivColor.style.border='none';
			oDivColor.setAttribute('unSelDef','true');
			oDivColor.setAttribute('onSelectColor','this.afterSelectColor(this.Color)');
			if (!oDivColor.Formated) jsfw.WebUI.Color(oDivColor);
			oDivColor.onmouseover = function (){this.parentNode.getElementsByTagName('table')[0].onmouseover();}
			oDivColor.afterSelectColor = function (sColor){
				oText.oDivTB.oPopupMenu.afterItemClick('fmt_ForeColor,'+sColor);
				oText.oDivTB.oPopupMenu.hide();
			}
			temItem.oItemTab.style.display = 'none';
			temItem.oItemTab.parentNode.appendChild(oDivColor);
			oText.oDivColor_foreColor = oDivColor;
		}
		////字体前景色
		var temItem=oText.oDivTB.oPopupMenu.findItem('backColor');
		if (temItem!=null){
			var oDivColor = document.createElement("div");
			oDivColor.className='Color';
			oDivColor.style.border='none';
			oDivColor.setAttribute('unSelDef','true');
			oDivColor.setAttribute('onSelectColor','this.afterSelectColor(this.Color)');
			if (!oDivColor.Formated) jsfw.WebUI.Color(oDivColor);
			oDivColor.onmouseover = function (){this.parentNode.getElementsByTagName('table')[0].onmouseover();}
			oDivColor.afterSelectColor = function (sColor){
				oText.oDivTB.oPopupMenu.afterItemClick('fmt_BackColor,'+sColor);
				oText.oDivTB.oPopupMenu.hide();
			}
			temItem.oItemTab.style.display = 'none';
			temItem.oItemTab.parentNode.appendChild(oDivColor);
			oText.oDivColor_backColor = oDivColor;
		}
		////表情
		for (var iEmot=0;iEmot<2;iEmot++){
			var temItem=oText.oDivTB.oPopupMenu.findItem('emot_'+iEmot.toString());
			if (temItem!=null){
				var sFolder=temItem.exInfo.substr(0,temItem.exInfo.indexOf(','));
				var strTem=temItem.exInfo.substr(temItem.exInfo.indexOf(',')+1,temItem.exInfo.length);
				var iMax=parseInt(strTem.substr(0,strTem.indexOf(',')));
				var iWidth=parseInt(strTem.substr(strTem.indexOf(',')+1,strTem.length));

				var oDivEmot = document.createElement("div");
				strTem='';
				for (var i=0;i<=iMax;i++){
					strTem += '<div unselectable="on" style="border:1px solid white; float:left;" onclick="this.parentNode.afterSelect(\'' + sFolder + '/' + (i<10?'0':'')+i + '.gif\');" ';
					strTem += 'onmouseover="this.style.border=\'1px dotted blue\'" onmouseout="this.style.border=\'1px solid white\'">';
					strTem += '<img src="' + jsfw.Path + 'webUI/WebEdit/Emot/' + sFolder + '/' + (i<10?'0':'')+i + '.gif" width="' + iWidth + '" height="' + iWidth + '">';
					strTem += '</div>';
				}
				oDivEmot.innerHTML = strTem;
				oDivEmot.setAttribute('unselectable','on');
				oDivEmot.onmouseover = function (){this.parentNode.getElementsByTagName('table')[0].onmouseover();}
				oDivEmot.afterSelect = function (sURL){
					oText.oDivTB.oPopupMenu.afterItemClick('emot_'+sURL);
					oText.oDivTB.oPopupMenu.hide();
				}
				temItem.oItemTab.style.display = 'none';
				temItem.oItemTab.parentNode.appendChild(oDivEmot);
				if (iEmot==0)
					oText.oDivEmot_0 = oDivEmot
				else
					oText.oDivEmot_1 = oDivEmot;
				temItem.oItemTab.parentNode.style.backgroundImage='url()';
				if (/msie/i.test(navigator.userAgent)){
					temItem.oItemTab.parentNode.parentNode.style.width = (iWidth+2)*10 + 4;
				}else{
					temItem.oItemTab.parentNode.parentNode.style.width=(iWidth+2)*10;
				}
			}
		}
	}

	oText.setWidth = function (iWidth){
		oText.oTab.style.width = (iWidth>160)?iWidth:500;
		oText.oDivTB.hideOverFlow();
	}
	oText.setHeight = function (iHeight){
		oText.oTab.style.height = (iHeight>80)?iHeight:300;
	}

	//初始化工具栏[END]---------
	oText.WE_getDoc().write('<HTML><HEAD><style type="text/css">body,td,th,a,p,div,input,textarea,select,button {font-size:9pt;} image{border:0px} p{margin:0px;padding-bottom:6px;}</style></HEAD><BODY>' + oText.value + '</BODY></HTML>');
	oText.WE_getDoc().designMode='On';
	
	/*oText.WE_getDoc().onkeydown = function (e){
		e = e || jsfw.$(oText.IFrameName).contentWindow.event;
		if (e.keyCode==13) {
			oText.GetValueFromIFrame();
		}else{
			setTimeout(function (){oText.GetValueFromIFrame();},100);
		}
	}*/
	setTimeout(function (){
		oText.WE_getDoc().body.onpaste = function (){
			setTimeout(function (){oText.GetValueFromIFrame();},100);
		}
	},100);
	oText.WE_getDoc().onactivate = function (){
		if (oText.getAttribute('onfocus')) eval(oText.onfocus());
	}
	oText.WE_getDoc().onkeyup = function (e){
		e = e || jsfw.$(oText.IFrameName).contentWindow.event;
		//if (/opera/i.test(navigator.userAgent)){
			if (e.keyCode==13) {
				oText.GetValueFromIFrame();
			}else{
				setTimeout(function (){oText.GetValueFromIFrame();},100);
			}
		//}
		if (e.keyCode==13) {
			if (e.ctrlKey){
				if (oText.getAttribute('onctrlenter')) eval(oText.getAttribute('onctrlenter'));
			}else{
				if (oText.getAttribute('onenter')) eval(oText.getAttribute('onenter'));
			}
		}
	}
	if ((!/msie/i.test(navigator.userAgent)) && (!/opera/i.test(navigator.userAgent))){
		setInterval(function (){oText.GetValueFromIFrame();},1000);
	}else{
		setInterval(function (){oText.GetValueFromIFrame();},4000);
	}
	//
	/*setTimeout(function (){
		oText.GetValueFromIFrame();
	},3000);*/

	//setTimeout(function (){oText.init();},10);
	//setTimeout(function (){oText.initToolbar();},10);
	oText.initToolbar();
	
	
	//清除内存
	if (window.attachEvent) window.attachEvent('onunload', function (){
		try{
			window.curWebEdit = null;
			//oText.WE_getDoc().onkeydown = null;
			oText.WE_getDoc().onkeyup = null;
			oText.WE_getDoc().body.onpaste = null;
			oText.WE_getDoc().onactivate = null;

			if (oText.oDivColor_foreColor) {
				oText.oDivColor_foreColor.onmouseover = null;
				oText.oDivColor_foreColor.afterSelectColor = null;
				oText.oDivColor_foreColor=null;
			}
			if (oText.oDivColor_backColor) {
				oText.oDivColor_backColor.onmouseover = null;
				oText.oDivColor_backColor.afterSelectColor = null;
				oText.oDivColor_backColor=null;
			}
			if (oText.oDivEmot_0){
				oText.oDivEmot_0.onmouseover = null;
				oText.oDivEmot_0.afterSelect = null;
				oText.oDivEmot_0=null;
			}
			if (oText.oDivEmot_1){
				oText.oDivEmot_1.onmouseover = null;
				oText.oDivEmot_1.afterSelect = null;
				oText.oDivEmot_1=null;
			}
			//oText.setValue = null;
			//oText.appendString = null;
			oText.setWidth = null;
			oText.setHeight = null;
			oText.WE_focus = null;
			oText.WE_format = null;
			oText.WE_insertHTML = null;
			oText.WE_getDoc = null;
			oText.initToolbar = null;
			oText.IFrameName = null;
			oText.oDivTB = null;
			oText.oTab = null;
			oText.GetValueFromIFrame = null;
			oText.setValue = null;
			oText.setFocus = null;
			//oText.
		}catch(e){}
	});
};

jsfw.WebUI.WebEdit.TagName = 'textarea';

//引用样式文件
(
	function (){
		var head = document.getElementsByTagName('head')[0];
		var link = document.createElement('link');
		link.rel = 'stylesheet';
		link.href = jsfw.Path + 'Themes/' + jsfw.Theme + '/WebEdit/css.css';
		link.type = 'text/css';
		link.media = 'all';
		head.appendChild(link);
	}
)();
