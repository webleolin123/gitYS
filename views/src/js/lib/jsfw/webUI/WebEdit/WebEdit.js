// 浏览器版本检测
if (/msie/i.test(navigator.userAgent)){
	var BrowserInfo = new Object() ;
	BrowserInfo.MajorVer = navigator.appVersion.match(/MSIE (.)/)[1] ;
	BrowserInfo.MinorVer = navigator.appVersion.match(/MSIE .\.(.)/)[1] ;
	BrowserInfo.IsIE55OrMore = BrowserInfo.MajorVer >= 6 || ( BrowserInfo.MajorVer >= 5 && BrowserInfo.MinorVer >= 5 ) ;
}

// 在当前文档位置插入.
function insertHTML(html) {
//	if (isModeView()) return false;
	if (/msie/i.test(navigator.userAgent)){
		if (document.selection.type.toLowerCase() != "none") document.selection.clear();
		document.selection.createRange().pasteHTML(html);
	}else{
		document.execCommand('insertHTML',false, html);
	}
//	if (sCurrMode!="EDIT") html=HTMLEncode(html);
//	document.selection.createRange().pasteHTML(html) ; 
}

function setHTML(sHTML){
	document.body.innerHTML=sHTML;
}

// 替换特殊字符
function HTMLEncode(text){
	text = text.replace(/&/g, "&amp;") ;
	text = text.replace(/"/g, "&quot;") ;
	text = text.replace(/</g, "&lt;") ;
	text = text.replace(/>/g, "&gt;") ;
	text = text.replace(/'/g, "&#146;") ;
	text = text.replace(/\ /g,"&nbsp;");
	text = text.replace(/\n/g,"<br>");
	text = text.replace(/\t/g,"&nbsp;&nbsp;&nbsp;&nbsp;");
	return text;
}

//获取当前选择对象
function getSelObj(){
	var temObj = new Object() ;
	temObj.Window = self;
	temObj.Selection = document.selection;
	try{
		temObj.Range = document.selection.createRange();
	}catch (e){
		temObj.Range = document.createRange();
	}
	temObj.Type = document.selection.type;
	return temObj;
}
/*****************************动作**********************************/

// 格式化编辑器中的内容
function format(what,opt) {
//	if (!validateMode()) return;
	self.focus();
	if (opt=="RemoveFormat"){
		what=opt;
		opt=null;
	}
	if (opt==null) {
		document.execCommand(what,false,null);
	}else{
		document.execCommand(what,"",opt);
	}
	self.focus();
	if (/msie/i.test(navigator.userAgent)){
		clearTimeout(timSetValue);
		timSetValue = setTimeout(function(){setTextAreaValue()},500);
	}else{setTextAreaValue();}
}

//剪切
function fun_cut(){
	try{format('cut');}catch (e){alert('剪切功能在目前浏览器下不支持，请用键盘Ctrl+X来代替操作。');}
}
//复制
function fun_copy(){
	try{format('copy');}catch (e){alert('复制功能在目前浏览器下不支持，请用键盘Ctrl+C来代替操作。');}
}
//粘贴
function fun_paste(){
	try{format('paste');}catch (e){alert('粘贴功能在目前浏览器下不支持，请用键盘Ctrl+V来代替操作。');}
}

// 粘贴纯文本
function fun_pasteText(){
//	if (!validateMode()) return;
	self.focus();
	try{
		var sText = HTMLEncode( clipboardData.getData("Text") ) ;
		insertHTML(sText);
	}catch (e){alert('粘贴纯文本功能在目前浏览器下不支持。');}
	self.focus();
}

// 从Word中粘贴，去除格式
function fun_pasteWord(){
//	if (!validateMode()) return;
	self.focus();
	if (BrowserInfo){
		if (BrowserInfo.IsIE55OrMore)
			cleanAndPaste( GetClipboardHTML() ) ;
		else if ( confirm( "此功能要求IE5.5版本以上，你当前的浏览器不支持，是否按常规粘贴进行？" ) )
			format("paste") ;
	}else{alert('从Word中粘贴功能在目前浏览器下不支持。');}
	self.focus();
}

/*var winLink=null;
function fun_createLink(){
	if (winLink!=null){winLink.close();}
	winLink = new jsfw.Class.Window('插入/修改链接','Dialog/createLink.htm');//得到 Window 的实例 Win1
}*/



// 取剪粘板中的HTML格式数据
function GetClipboardHTML() {
	var oDiv = document.createElement("div");//document.getElementById("eWebEditor_Temp_HTML")
	oDiv.innerHTML = "" ;
	document.body.appendChild(oDiv);
	
	var oTextRange = document.body.createTextRange() ;
	oTextRange.moveToElementText(oDiv) ;
	oTextRange.execCommand("Paste") ;
	
	var sData = oDiv.innerHTML ;
	oDiv.innerHTML = "" ;
	
	return sData ;
}

// 清除WORD冗余格式并粘贴
function cleanAndPaste( html ) {
	// Remove all SPAN tags
	html = html.replace(/<\/?SPAN[^>]*>/gi, "" );
	// Remove Class attributes
	html = html.replace(/<(\w[^>]*) class=([^ |>]*)([^>]*)/gi, "<$1$3") ;
	// Remove Style attributes
	html = html.replace(/<(\w[^>]*) style="([^"]*)"([^>]*)/gi, "<$1$3") ;
	// Remove Lang attributes
	html = html.replace(/<(\w[^>]*) lang=([^ |>]*)([^>]*)/gi, "<$1$3") ;
	// Remove XML elements and declarations
	html = html.replace(/<\\?\?xml[^>]*>/gi, "") ;
	// Remove Tags with XML namespace declarations: <o:p></o:p>
	html = html.replace(/<\/?\w+:[^>]*>/gi, "") ;
	// Replace the &nbsp;
	html = html.replace(/&nbsp;/, " " );
	// Transform <P> to <DIV>
	var re = new RegExp("(<P)([^>]*>.*?)(<\/P>)","gi") ;	// Different because of a IE 5.0 error
	html = html.replace( re, "<div$2</div>" ) ;
	
	insertHTML( html ) ;
}

var oldSel=null;
var timSetValue;
function init(){
	self.document.body.onblur=function(){
		setTextAreaValue();
	}
	self.document.body.onkeydown=function(){
		if (event.keyCode==13){
			setTextAreaValue();
			return;
		}
		clearTimeout(timSetValue);
		timSetValue = setTimeout(function(){setTextAreaValue()},1000);
	}
//	document.oncontextmenu = showContextMenu;
}

function setTextAreaValue(){
	self.oText.value=document.body.innerHTML;
}

function showContextMenu(e){
//	return false; 
}