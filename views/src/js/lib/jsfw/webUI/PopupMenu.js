jsfw.WebUI.PopupMenu = function (oDiv){
	if (!jsfw.Class.PopupMenu) jsfw.Import("classes.PopupMenu");
	//if (oDiv.getElementsByTagName('xmp').length>0) oDiv.getElementsByTagName('xmp')[0].style.display='none';

	var xmlURL=oDiv.getAttribute('url');
	var oPopupMenu=null;
	//创建PopupMenu对象
	if (xmlURL && (xmlURL!=''))
		oPopupMenu = new jsfw.Class.PopupMenu(xmlURL,oDiv)
	else
		oPopupMenu = new jsfw.Class.PopupMenu(oDiv.getElementsByTagName('xmp')[0],oDiv);
	
	oDiv.popup = oPopupMenu.popup;
	oDiv.allItems = oPopupMenu.allItems;
	oDiv.root = oPopupMenu.root;
	oDiv.findItem = oPopupMenu.findItem;

	//清除内存
	if (window.attachEvent) window.attachEvent('onunload', function (){
		//释放PopupMenu对象
		oDiv.allItems = null;
		oDiv.root = null;
		oDiv.popup = null;
		oDiv.findItem = null;
		oPopupMenu.free();
	});
};

jsfw.WebUI.PopupMenu.TagName = 'div';
