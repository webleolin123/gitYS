jsfw.WebUI.Grid = function (oTab){
	oTab.cellPadding = 3;
	oTab.cellSpacing = 0;
	oTab.border = 0;
	oTab.style.tableLayout = 'fixed';
	var iBegin=0;
	var iEnd=oTab.rows.length;
	if (oTab.tHead) iBegin = oTab.tHead.rows.length;
	if (oTab.tFoot) iEnd = iEnd - oTab.tFoot.rows.length;
	for (var i=iBegin; i<iEnd; i++){
		if ((oTab.rows[i].cells[0]) && (oTab.rows[i].cells[0].nodeName!="TH")){
			oTab.rows[i].onmouseover=function (){ this.className='trOver'; }
			oTab.rows[i].onmouseout=function (){ this.className=''; }
		}
	}

	return;

	//清除内存
	if (window.attachEvent) window.attachEvent('onunload', function (){
		for (var i=0; i<oTab.rows.length; i++){
			oTab.rows[i].onmouseover=null;
			oTab.rows[i].onmouseout=null;
		}
	});
};

jsfw.WebUI.Grid.TagName = 'table';

//引用样式文件
(
	function (){
		var head = document.getElementsByTagName('head')[0];
		var link = document.createElement('link');
		link.rel = 'stylesheet';
		link.href = jsfw.Path + 'Themes/' + jsfw.Theme + '/Grid/css.css';
		link.type = 'text/css';
		link.media = 'all';
		head.appendChild(link);
	}
)();