/*******************************************\
  弹出窗口管理类(2007-03-21)
	Author:Witson
\*******************************************/
if (!jsfw.Class.Window) jsfw.Import("classes.Window");

jsfw.WebUI.Window = function (){};

var _Window_List = new Array();
var _Window_ID_List = new Array();

jsfw.WebUI.Window.newWindow = function (sWindowID, sTitle,sURL,iWidth,iHeight,iLeft,iTop,bModalWindow){//,iHeight
	var aWin=null;
	if (sWindowID != ''){
		aWin = jsfw.WebUI.Window.findWindow(sWindowID);
		if (aWin) {aWin.show(); return aWin;}
	}
	var aWin=new jsfw.Class.Window(sTitle,sURL,iWidth,iHeight,iLeft,iTop,bModalWindow);
	_Window_List[_Window_List.length] = aWin;
	_Window_ID_List[_Window_ID_List.length] = sWindowID;
	return aWin;
};

jsfw.WebUI.Window.delWindow = function (oValue){
	var aWin=jsfw.WebUI.Window.findWindow(oValue);
	if (!aWin) return;
	for (var i=0; i<_Window_List.length; i++){
		if (_Window_List[i]==aWin){
			_Window_List.splice(i,1);
			_Window_ID_List.splice(i,1);
			try{ aWin.close(); }catch (e){}
			return;
		}
	}
};

jsfw.WebUI.Window.findWindow = function (oValue){
	if (typeof(oValue)=='string'){
		for (var i=0; i<_Window_ID_List.length; i++){
			if (_Window_ID_List[i]==oValue) return _Window_List[i];
		}
	}
	if (typeof(oValue)=='object'){
		if (oValue.oDiv){
			return oValue;
		}
		for (var i=0; i<_Window_List.length; i++){
			var oIFrame = _Window_List[i].oDiv.getElementsByTagName("table")[0].getElementsByTagName("iframe")[0];
			if ((oIFrame) && (oIFrame.contentWindow == oValue)) {
				return _Window_List[i];
			}
		}
	}
	return null;
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
	}
)();