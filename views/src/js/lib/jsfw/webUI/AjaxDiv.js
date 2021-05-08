jsfw.WebUI.AjaxDiv = function (oDiv){
	oDiv.loadURL = function (sURL){
		setTimeout(function(){
			jsfw.Ajax.loadHttpToObj(sURL,oDiv);
		},0);
		//jsfw.Ajax.loadHttpToObj(sURL,oDiv);
	}

	////初始化[BEGIN]
	var sURL=oDiv.getAttribute('URL');
	if ((sURL) && (sURL!='')) oDiv.loadURL(sURL);
	////初始化[END]

	//清除内存
	if (window.attachEvent) window.attachEvent('onunload', function (){
		oDiv.loadURL = null;
	});
};

jsfw.WebUI.AjaxDiv.TagName = 'div';
