jsfw.WebUI.QQMenu = function (oDiv){
	var temObj;
	var oTitle,oContent;

	var iCur = 0;
	var intCount = 0;
	var objs = oDiv.childNodes;
	for (var i=0; i<objs.length; i++){
		if (objs[i].nodeName=='FIELDSET') intCount++;
	}

	for (var k=0; k<intCount; k++){
		for (var i=0; i<objs.length; i++){
			if (objs[i].nodeName=='FIELDSET'){
				oTitle = document.createElement('div');
				oTitle.onclick = new Function('this.parentNode.selectGroup('+k+')');
				oTitle.className = 'QQMenu_Title';
				oTitle.appendChild(objs[i].getElementsByTagName('legend')[0]);
				oDiv.appendChild(oTitle);

				objs[i].className = 'QQMenu_Content_Item';
				oContent = document.createElement('div');
				oContent.className = 'QQMenu_Content';
				oContent.appendChild(objs[i]);
				oContent.loaded = false;
				oDiv.appendChild(oContent);
				break;
			}
		}
	}

	//oDiv.appendChild(oTab);
	//oDiv.appendChild(oContent);

	oDiv.selectGroup = function (idx){
		var objs=oDiv.childNodes;
		var iCur=0;
		for (var i=0; i<objs.length; i++){
			if ((objs[i].className) && ((objs[i].className=='QQMenu_Title')||(objs[i].className=='QQMenu_Title_Sel'))){
				objs[i].className = 'QQMenu_Title' + (iCur==idx?'_Sel':'');
				iCur++;
			}
		}
		iCur=0;
		for (var i=0; i<objs.length; i++){
			if ((objs[i].className) && (objs[i].className=='QQMenu_Content')){
				objs[i].style.display = (iCur==idx?'':'none');
				if (iCur==idx){//执行onShow函数
					var temObj=objs[i].getElementsByTagName('fieldset')[0];
					if (temObj.getAttribute('onshow')){
						eval(temObj.getAttribute('onshow'));
					}
					if (!objs[i].loaded){
						if (temObj.getAttribute('url') && (temObj.getAttribute('url')!='')){
							temObj.innerHTML = '<iframe src="'+temObj.getAttribute('url')+'" style="width:100%;height:100%;" frameborder="0"></iframe>'
						}
						if (temObj.getAttribute('ajax') && (temObj.getAttribute('ajax')!='')){
							jsfw.Ajax.loadHttpToObj(temObj.getAttribute('ajax'),temObj);
							/*temObj.innerHTML = '正在载入...';
							jsfw.Ajax.loadHttp(temObj.getAttribute('ajax'), true, function(r,o){
									o.innerHTML=r.responseText;
									jsfw.FormatUI(o);
								},temObj);*/
						}
						objs[i].loaded = true;
					}
				}
				iCur++;
			}
		}
	}
	oDiv.setHeight = function (iHeight){
		/*if (typeof(iHeight)=='string'){
			iHeight = iHeight.replace(/(em)|(ex)|(px)|(pt)|(pc)|(in)|(cm)|(mm)| /img,'');
			if (parseInt(iHeight).toString()==iHeight){
				iHeight = parseInt(iHeight);
			}else{
				if (iHeight.indexOf('%')!=-1){
					oDiv.style.height = iHeight;
					setTimeout(function (){
					oContent.style.height = oDiv.offsetHeight - oTab.offsetHeight;
					},1);
				}
			}
		}*/
		var objs=oDiv.childNodes;
		var intCount=0;
		for (var i=0; i<objs.length; i++){
			if ((objs[i].className) && (objs[i].className=='QQMenu_Content')) intCount++;
		}
		var iTitleHeight=0;
		for (var i=0; i<objs.length; i++){
			if ((objs[i].className) && ((objs[i].className=='QQMenu_Title')||(objs[i].className=='QQMenu_Title_Sel'))){
				iTitleHeight=objs[i].offsetHeight;
				break;
			}
		}

		if (typeof(iHeight)=='number'){
			if (iHeight<1){
				for (var i=0; i<objs.length; i++){
					if ((objs[i].className) && (objs[i].className=='QQMenu_Content')) objs[i].style.height = '';
				}
			}else{
				for (var i=0; i<objs.length; i++){
					if ((objs[i].className) && (objs[i].className=='QQMenu_Content')) objs[i].style.height = iHeight-(iTitleHeight*intCount);
				}
				//oContent.style.height = iHeight - oTab.offsetHeight;
				//oDiv.style.height = iHeight;
			}
		}
	}

	//初始化[BEGIN]
	var bFind=false;
	var objs = oContent.childNodes;
	var iCur=0;
	for (var i=0; i<objs.length; i++){
		if ((objs[i].className) && (objs[i].className=='QQMenu_Content')){
			if (objs[i].getElementsByTagName('fieldset')[0].getAttribute('default')=='true'){
				oDiv.selectGroup(iCur);
				bFind=true;
				break;
			}
			iCur++;
		}
	}
	if (!bFind) oDiv.selectGroup(0);
	oDiv.setHeight(parseInt(oDiv.getAttribute('height')));
	//初始化[END]


	//清除内存
	if (window.attachEvent) window.attachEvent('onunload', function (){
		oDiv.selectGroup = null;
		oDiv.setHeight = null;
		var objs=oDiv.childNodes;
		for (var i=(objs.length-1); i>=0; i--){
			try{
				objs[i].onclick=null;
				objs[i].loaded=null;
				oDiv.removeChild(objs[i])
			}catch(e){}
		}
	});
};

jsfw.WebUI.QQMenu.TagName = 'div';
//查找需要格式化的组件
/*jsfw.WebUI.QQMenu.FormatAll = function (obj){
	obj = (typeof(obj)=='object')?obj:document;
	var divs = obj.getElementsByTagName("div");
	for (i=(divs.length-1); i>=0; i--) {
		if (divs[i].className && divs[i].className.toLowerCase()=='qqmenu') {
			jsfw.WebUI.QQMenu(divs[i]);
		}
	}
};*/

//引用样式文件
(
	function (){
		var head = document.getElementsByTagName('head')[0];
		var link = document.createElement('link');
		link.rel = 'stylesheet';
		link.href = jsfw.Path + 'Themes/' + jsfw.Theme + '/QQMenu/css.css';
		link.type = 'text/css';
		link.media = 'all';
		head.appendChild(link);
	}
)();