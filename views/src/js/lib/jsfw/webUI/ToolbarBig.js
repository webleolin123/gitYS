jsfw.WebUI.ToolbarBig = function (oDiv){
	if (!jsfw.Class.PopupMenu) jsfw.Import("classes.PopupMenu");
	//if (oDiv.getElementsByTagName('xmp').length>0) oDiv.getElementsByTagName('xmp')[0].style.display='none';

	var xmlURL=oDiv.getAttribute('url');
	var oPopupMenu=null;
	//创建PopupMenu对象
	if (xmlURL && (xmlURL!=''))
		oPopupMenu = new jsfw.Class.PopupMenu(xmlURL,oDiv)
	else
		oPopupMenu = new jsfw.Class.PopupMenu(oDiv.getElementsByTagName('xmp')[0],oDiv);

	oDiv.setAttribute('unselectable','on');
	oDiv.className='jsfw_ToolbarBig';
	oDiv.oPopupMenu = oPopupMenu;
	oDiv.allItems = oPopupMenu.allItems;
	oDiv.root = oPopupMenu.root;
	//生成按钮[BEGIN]---------
	for (var i=0; i<oPopupMenu.root.children.length; i++){
		var oItem = oPopupMenu.root.children[i];
		var oTab = document.createElement("table");
		oTab.className = (oItem.text=='')?'jsfw_ToolbarBigBtn_Split':'jsfw_ToolbarBigBtn';
		oTab.insertRow(0);
		oTab.rows[0].insertCell(0).className='jsfw_ToolbarBigBtn_left';
		oTab.rows[0].insertCell(1).className='jsfw_ToolbarBigBtn_center';
		oTab.rows[0].insertCell(2).className='jsfw_ToolbarBigBtn_right' + ((oItem.action=='')?'0':'');

		oTab.cellPadding=0; oTab.cellSpacing=0; oTab.border=0;

		oTab.title = oItem.text;
		oTab.rows[0].cells[0].innerHTML = (oItem.icon=='')?'':'<img src="' + oItem.icon + '" width="16" height="16">';
		oTab.rows[0].cells[1].innerHTML = oItem.text;
		oTab.rows[0].cells[2].innerHTML = '<img width="1">';
		oTab.setAttribute('unselectable','on');
		oTab.rows[0].cells[0].setAttribute('unselectable','on');
		oTab.rows[0].cells[1].setAttribute('unselectable','on');
		oTab.rows[0].cells[2].setAttribute('unselectable','on');

		//设置按钮可见
		if (!oItem.visible) oTab.style.display = 'none';
		oItem.afterSetVisible = function (){
			var objs=oDiv.getElementsByTagName('table');
			for (var i=0; i<objs.length; i++){
				if (objs[i].obj==this){
					objs[i].style.display = this.visible?'':'none';
					oDiv.hideOverFlow();
					return;
				}
			}
		}
		//设置按钮有效
		if (!oItem.enable) oTab.className = 'jsfw_ToolbarBigBtn_disabled';
		oItem.afterSetEnable = function (){
			var objs=oDiv.getElementsByTagName('table');
			for (var i=0; i<objs.length; i++){
				if (objs[i].obj==this){
					objs[i].className = this.enable?'jsfw_ToolbarBigBtn':'jsfw_ToolbarBigBtn_disabled';
					return;
				}
			}
		}

		if (!oItem.isFolder) oTab.rows[0].cells[2].style.display = 'none';
		//if (oItem.text=='') oTab.rows[0].cells[1].style.display = 'none';
		if ((oItem.text=='')||(!oItem.showText)) oTab.rows[0].cells[1].style.display = 'none';

		oTab.obj=oItem;
		if (oItem.text!=''){
			oTab.onmouseover = function (){
				this.obj.mouseOver(true,'',jsfw.getAbsoluteLeft(this,true), jsfw.getAbsoluteTop(this,true)+this.offsetHeight-1);
				//if (this.className=='jsfw_ToolbarBigBtn') this.className='jsfw_ToolbarBigBtn_Over';
			}
			oTab.onmouseout = function (){
				this.obj.mouseOver(false,'',jsfw.getAbsoluteLeft(this,true), jsfw.getAbsoluteTop(this,true)+this.offsetHeight-1);
				if (this.className=='jsfw_ToolbarBigBtn_Over') this.className='jsfw_ToolbarBigBtn';
				clearTimeout(oDiv.oPopupMenu.timShowMenu);
			}
			if (oItem.isFolder && (oItem.action=='')){
				oTab.rows[0].cells[0].onclick = oTab.rows[0].cells[1].onclick = function (){
					this.parentNode.parentNode.parentNode.rows[0].cells[2].click();
				}
			}else{
				oTab.rows[0].cells[0].onclick = oTab.rows[0].cells[1].onclick = function (){
					var objTem=this.parentNode.parentNode.parentNode;
					if (!objTem.obj.enable) return;
					objTem.obj.click();
					try{
						objTem.className='jsfw_ToolbarBigBtn_Over';
					}catch(e){}					
				}
			}
			oTab.rows[0].cells[2].onclick = function (){
				var objTem=this.parentNode.parentNode.parentNode;
				if (!objTem.obj.enable) return;
				objTem.obj.popup(jsfw.getAbsoluteLeft(objTem,true), jsfw.getAbsoluteTop(objTem,true)+objTem.offsetHeight-1);
				objTem.className='jsfw_ToolbarBigBtn_Over';
			}
		}
		oDiv.appendChild(oTab);
	}
	//生成按钮[END]---------
	var oDivMore = document.createElement("div");
	oDivMore.setAttribute('unselectable','on');
	oDivMore.className='jsfw_ToolbarBig_More';
	oDivMore.onmouseover = function (){
		this.className='jsfw_ToolbarBig_MoreSel';
	}
	oDivMore.onmouseout = function (){
		this.className='jsfw_ToolbarBig_More';
	}
	oDivMore.onclick = function (){
		this.parentNode.oPopupMenu.popup(jsfw.getAbsoluteLeft(this,true), jsfw.getAbsoluteTop(this,true)+this.offsetHeight-1,true)
	}
	oDiv.appendChild(oDivMore);
	oDiv.oDivMore=oDivMore;

	oPopupMenu.onMouseOverItem = function (aItem,bOver){
		var objTem=aItem;
		while (objTem.parent.parent!=null) objTem=objTem.parent;
		var objs=oDiv.getElementsByTagName('table');
		for (var i=0; i<objs.length; i++){
			if (objs[i].className=='jsfw_ToolbarBigBtn_Over') objs[i].className='jsfw_ToolbarBigBtn';
			if ((objs[i].obj==objTem) && aItem.enable) objs[i].className='jsfw_ToolbarBigBtn_Over';
		}
	}
	oPopupMenu.afterHide = function (){
		try{
			var objs=oDiv.getElementsByTagName('table');
			for (var i=0; i<objs.length; i++){
				if (objs[i].className=='jsfw_ToolbarBigBtn_Over') objs[i].className='jsfw_ToolbarBigBtn'
			}
		}catch(e){}
	}
	//隐藏超出的按钮
	oDiv.hideOverFlow = function (){
		var objs = oDiv.childNodes;
		oDiv.style.overflow = 'hidden';
		var iWidth=0;
		var bHide=false;
		for (var i=0; i<objs.length; i++){
			if (objs[i].tagName=='TABLE'){
				if (!objs[i].obj.visible) continue;
				objs[i].style.display = '';
				if ((iWidth+objs[i].offsetWidth)>(oDiv.offsetWidth-18)) bHide=true;
				objs[i].style.display = bHide?'none':'';
				objs[i].obj.oItemTab.style.display = bHide?'':'none';
				iWidth += objs[i].offsetWidth;
			}
		}
		oDiv.oDivMore.style.display = bHide?'':'none';
		oDiv.style.overflow = 'visible';
	}
	//oDiv.hideOverFlow();
	//if (!/msie/i.test(navigator.userAgent)) 
	setTimeout(function(){oDiv.hideOverFlow();},0);

	//清除内存
	if (window.attachEvent) window.attachEvent('onunload', function (){
		//释放PopupMenu对象
		oDiv.allItems = null;
		oDiv.root = null;
		oDiv.hideOverFlow = null;

		oDiv.oDivMore.onmouseover = null;
		oDiv.oDivMore.onmouseout = null;
		oDiv.oDivMore.onclick = null;
		oDiv.oDivMore = null;

		oDiv.oPopupMenu =null;
		oPopupMenu.free();
		var objs=oDiv.getElementsByTagName('table');
		for (var i=0; i<objs.length; i++){
			objs[i].obj=null;
			objs[i].onmouseover = null;
			objs[i].onmouseout = null;
			objs[i].rows[0].cells[0].onclick = null;
			objs[i].rows[0].cells[1].onclick = null;
			objs[i].rows[0].cells[2].onclick = null;
		}
	});
};

jsfw.WebUI.ToolbarBig.TagName = 'div';

//引用样式文件
(
	function (){
		var head = document.getElementsByTagName('head')[0];
		var link = document.createElement('link');
		link.rel = 'stylesheet';
		link.href = jsfw.Path + 'Themes/' + jsfw.Theme + '/ToolbarBig/css.css';
		link.type = 'text/css';
		link.media = 'all';
		head.appendChild(link);
	}
)();