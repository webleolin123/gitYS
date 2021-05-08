//设置弹出对话框的标题
try{parent.jsfw.WebUI.Window.findWindow(self).setTitle(self.document.title)}catch (e){};

//引用样式文件
(
	function (){
		//alert(parent.jsfw.Path);
		var head = document.getElementsByTagName('head')[0];
		var link = document.createElement('link');
		link.rel = 'stylesheet';
		link.href = '../../../Themes/' + parent.jsfw.Theme + '/WebEdit/css.css';
		link.type = 'text/css';
		link.media = 'all';
		head.appendChild(link);
	}
)();
var WE = parent.curWebEdit;
var WE_Doc = WE.WE_getDoc();
var WE_Sel = WE_Doc.selection || WE_Doc.getSelection();
var WE_SelType = WE_Sel.type;
var WE_Range;
try{
	WE_Range = WE_Sel.createRange();
}catch (e){
	WE_Range = WE_Doc.createRange();
}

//var WE_Sel = 



// 取通过URL传过来的参数 (格式如 ?Param1=Value1&Param2=Value2)
var URLParams = new Object() ;
var aParams = document.location.search.substr(1).split('&') ;
for (i=0 ; i < aParams.length ; i++) {
	var aParam = aParams[i].split('=') ;
	URLParams[aParam[0]] = aParam[1] ;
}
// 搜索下拉框值与指定值匹配，并选择匹配项
function SearchSelectValue(o_Select, s_Value){
	for (var i=0;i<o_Select.length;i++){
		if (o_Select.options[i].value == s_Value){
			o_Select.selectedIndex = i;
			return true;
		}
	}
	return false;
}

// 只允许输入数字
function IsDigit(){
	if (event.keyCode==13) return true;
  return ((event.keyCode >= 48) && (event.keyCode <= 57));
}

function closeDialog(){
	try{WE.GetValueFromIFrame();}catch(e){}
	WE.WE_focus();
	parent.jsfw.WebUI.Window.findWindow(self).close();
	/*if (self.exProperty){
		if (self.exProperty.Window){
			self.exProperty.Window.focus();
		}
	}
	self.closeWindow();*/
}

window.$ = function (str){
	return document.getElementById(str)
}
/*function getObj(str){
	var obj= document.getElementById(str);
	if (obj==null){
		alert(str+'没找到');
	}
	return obj
}*/

/*if (window.attachEvent) window.attachEvent('onload', function (){
	self.document.oncontextmenu=function (){
		return false;
	}
});*/
