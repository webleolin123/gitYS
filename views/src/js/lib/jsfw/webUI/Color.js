jsfw.WebUI.Color = function (oDiv){
	if (!jsfw.arrColor){
		jsfw.arrColor=['#FFFFFF','#FFCCCC','#FFCC99','#FFFF99','#FFFFCC','#99FF99','#99FFFF','#CCFFFF','#CCCCFF','#FFCCFF',
								'#CCCCCC','#FF6666','#FF9966','#FFFF66','#FFFF33','#66FF99','#33FFFF','#66FFFF','#9999FF','#FF99FF',
								'#C0C0C0','#FF0000','#FF9900','#FFCC66','#FFFF00','#33FF33','#66CCCC','#33CCFF','#6666CC','#CC66CC',
								'#999999','#CC0000','#FF6600','#FFCC33','#FFCC00','#33CC00','#00CCCC','#3366FF','#6633FF','#CC33CC',
								'#666666','#990000','#CC6600','#CC9933','#999900','#009900','#339999','#3333FF','#6600CC','#993399',
								'#333333','#660000','#993300','#996633','#666600','#006600','#336666','#000099','#333399','#663366',
								'#000000','#330000','#663300','#663333','#333300','#003300','#003333','#000066','#330099','#330033'];
	}

	var strTem='';
	for (var i=0;i<jsfw.arrColor.length;i++){
		strTem += '<div unselectable="on" color="' + jsfw.arrColor[i] + '" class="Color_Item" onclick="var menu=this.parentNode.selColor(\'' + jsfw.arrColor[i] + '\');" onmouseover="if (this.className==\'Color_Item\') this.className=\'Color_Item_Over\'" onmouseout="if (this.className==\'Color_Item_Over\') this.className=\'Color_Item\'"><div class="Color_Item_Sub" style="background-color:' + jsfw.arrColor[i] + ';" unselectable="on"><img width="1" height="1"></div></div>';
	}
	oDiv.innerHTML = strTem;
	oDiv.setAttribute('unselectable','on');

	oDiv.selColor = function (sColor){
		oDiv.setAttribute('Color',sColor);
		oDiv.Color = sColor;
		oDiv.focusDefColor();
		var sScript=oDiv.getAttribute('onSelectColor');
		if (sScript && (sScript!='')){
			eval(sScript);
		}
	}
	oDiv.focusDefColor = function (){
		var sUnSelDef=oDiv.getAttribute('unSelDef');
		if (sUnSelDef && (sUnSelDef=='true')) return;
		var sDef = oDiv.getAttribute('color');
		if (sDef && (sDef!='')){
			var objs=oDiv.childNodes;
			for (var i=0; i<objs.length; i++){
				if (objs[i].tagName=='DIV'){
					objs[i].className = 'Color_Item';
					if (objs[i].getAttribute('color')==sDef) objs[i].className = 'Color_Item_Sel';
				}
			}
		}
	}
	oDiv.focusDefColor();

	//清除内存
	if (window.attachEvent) window.attachEvent('onunload', function (){
		oDiv.selColor = null;
		oDiv.Color = null;
		oDiv.focusDefColor = null;
	});
};

jsfw.WebUI.Color.TagName = 'div';

//引用样式文件
(
	function (){
		var head = document.getElementsByTagName('head')[0];
		var link = document.createElement('link');
		link.rel = 'stylesheet';
		link.href = jsfw.Path + 'Themes/' + jsfw.Theme + '/Color/css.css';
		link.type = 'text/css';
		link.media = 'all';
		head.appendChild(link);
	}
)();