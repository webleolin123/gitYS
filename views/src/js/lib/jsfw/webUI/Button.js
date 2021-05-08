jsfw.WebUI.Button = function (oDiv){
	var oTable = document.createElement('table');
	oTable.insertRow(0);
	oTable.rows[0].insertCell(0);
	oTable.rows[0].insertCell(0);
	oTable.rows[0].insertCell(0);
	oTable.rows[0].cells[0].innerHTML = '<img width="1"/>';
	oTable.rows[0].cells[2].innerHTML = '<img width="1"/>';
	oTable.rows[0].cells[0].className = 'jsfw_Button_L';
	oTable.rows[0].cells[2].className = 'jsfw_Button_R';
	oTable.cellPadding = 0;
	oTable.cellSpacing = 0;
	oTable.border = 0;
	oTable.className = 'jsfw_Button';
	oDiv.parentNode.insertBefore(oTable,oDiv);
	oTable.rows[0].cells[1].appendChild(oDiv);
	oTable.onmouseover = function (){this.className = 'jsfw_Button_Over';}
	oTable.onmouseout = function (){this.className = 'jsfw_Button';}

	//清除内存
	if (window.attachEvent) window.attachEvent('onunload', function (){
		oTable.onmouseover = null;
		oTable.onmouseout = null;
	});
};

jsfw.WebUI.Button.TagName = 'input;button';

//引用样式文件
(
	function (){
		var head = document.getElementsByTagName('head')[0];
		var link = document.createElement('link');
		link.rel = 'stylesheet';
		link.href = jsfw.Path + 'Themes/' + jsfw.Theme + '/Button/css.css';
		link.type = 'text/css';
		link.media = 'all';
		head.appendChild(link);
	}
)();