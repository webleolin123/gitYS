jsfw.WebUI.Input_Number = function (oDiv){
	if (oDiv.value=='') oDiv.value='0';
	var funOnChange = oDiv.onchange;
	oDiv.onchange = function (){
		var strTem='';
		var sResult = oDiv.value;
		sResult = sResult.replace(/[^((\d)|(\-)|(\.))]/img,'');	//过滤字符
		strTem = sResult.substr(0,1);
		sResult = sResult.substr(1);
		sResult = strTem + sResult.replace(/-/img,'');//去除多余的减号
		strTem = sResult.substr(0,sResult.indexOf('.')+1);
		sResult = sResult.substr(strTem.length);
		sResult = strTem + sResult.replace(/\./img,'');//去除多余的点
		if (sResult.substr(sResult.length-1)=='.') sResult=sResult.substr(0,sResult.length-1);
		if (sResult=='') sResult='0';
		if (oDiv.getAttribute('format') && (oDiv.getAttribute('format').toLowerCase()=='real')){
		}else{
			sResult = parseInt(sResult).toString();
		}
		oDiv.value = sResult;
		if (funOnChange) funOnChange();
	}

	/*if (oDiv.getAttribute('showupdown') && (oDiv.getAttribute('showupdown')!='false')){
		oDiv.style.borderRight = 'none';
		var oUpDown = document.createElement("div");
		oUpDown.className = 'Input_Number_UpDown';

		var oUp = document.createElement("div");
		oUp.className = 'Input_Number_Up';
		oUp.innerHTML = '<img width="1px"/>'
		oUpDown.appendChild(oUp);

		var oDown = document.createElement("div");
		oDown.className = 'Input_Number_Down';
		oDown.innerHTML = '<img width="1px"/>'
		oUpDown.appendChild(oDown);


		oDiv.parentNode.insertBefore(oUpDown,oDiv);
		oDiv.parentNode.insertBefore(oDiv,oUpDown);
	}*/

	//清除内存
	if (window.attachEvent) window.attachEvent('onunload', function (){
		oDiv.onchange = null;
	});
};

jsfw.WebUI.Input_Number.TagName = 'input';

//引用样式文件
(
	function (){
		var head = document.getElementsByTagName('head')[0];
		var link = document.createElement('link');
		link.rel = 'stylesheet';
		link.href = jsfw.Path + 'Themes/' + jsfw.Theme + '/Input_Number/css.css';
		link.type = 'text/css';
		link.media = 'all';
		head.appendChild(link);
	}
)();