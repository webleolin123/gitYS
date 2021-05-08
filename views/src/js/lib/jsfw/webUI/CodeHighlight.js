/**//**//**//**//**//**//**//*  
**    ==================================================================================================  
**    类名：CLASS_HIGHLIGHT  
**    功能：语法高亮  
**    示例：  
    ---------------------------------------------------------------------------------------------------  
  
            var xx        = new CLASS_HIGHLIGHT(code,syntax);            
            document.getElementById("display").innerHTML = xx.highlight(); 
  
    ---------------------------------------------------------------------------------------------------  
**    作者：ttyp  
**    邮件：ttyp@21cn.com  
**    日期：2005-7-31
**    其它说明：本类不是 Witson 原创，这里改成这种形式只是方便 jsfw 使用，感谢原作者 ttyp
**    ==================================================================================================  
**/  
jsfw.WebUI.CodeHighlight = function (oXMP){//code,syntax
	var	oDiv = document.createElement('div');
	oXMP.parentNode.insertBefore(oDiv,oXMP);
	var opera=/opera/i.test(navigator.userAgent);
	var code=opera?oXMP.innerText:oXMP.innerHTML
	var syntax=oXMP.getAttribute('syntax');
	
	if (!jsfw.Class.CodeHighlight) jsfw.Import("classes.CodeHighlight");
	var strTem = (new jsfw.Class.CodeHighlight(code,syntax).highlight());
	//var xx = new jsfw.Class.CodeHighlight(opera?objs[i].innerText:objs[i].innerHTML,syntax);
	strTem = strTem.replace(/&lt;<span style='color:#808000;'>&nbsp;xmp/img,'&lt;<span style=\'color:#808000;\'>xmp');
	strTem = strTem.replace(/&lt;<span style='color:#808000;'>\/&nbsp;xmp/img,'&lt;<span style=\'color:#808000;\'>/xmp');
	oDiv.innerHTML = strTem;
	oXMP.style.display = 'none';

	//清除内存
	if (window.attachEvent) window.attachEvent('onunload', function (){
		oXMP.parentNode.removeChild(oDiv);
	});
}

jsfw.WebUI.CodeHighlight.TagName = 'xmp';
//查找需要格式化的组件
/*jsfw.WebUI.CodeHighlight.FormatAll = function (obj){
	obj = (typeof(obj)=='object')?obj:document;
	var divs = obj.getElementsByTagName("xmp");
	for (i=(divs.length-1); i>=0; i--) {
		if (divs[i].className && divs[i].className.toLowerCase()=='codehighlight') {
			jsfw.WebUI.CodeHighlight(divs[i]);
		}
	}
};*/

//引用样式文件
(
	function (){
		var head = document.getElementsByTagName('head')[0];
		var link = document.createElement('link');
		link.rel = 'stylesheet';
		link.href = jsfw.Path + 'Themes/' + jsfw.Theme + '/CodeHighlight/css.css';
		link.type = 'text/css';
		link.media = 'all';
		head.appendChild(link);
	}
)();