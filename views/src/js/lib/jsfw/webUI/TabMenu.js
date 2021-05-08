jsfw.WebUI.TabMenu = function (oDiv){
	var sSite=oDiv.getAttribute('site');
	if (!sSite) sSite = 'Top';
	sSite=sSite.toLowerCase();

	var temObj;
	var	oTab = document.createElement('div');
	oTab.className = 'TabMenu_'+sSite+'_Tab';

	var oContent = document.createElement('div');
	oContent.className = 'TabMenu_'+sSite+'_Content';

	///*标签头 一般不用*/
	temObj = document.createElement('div');
	temObj.className = 'TabMenu_'+sSite+'_Tab_Begin';
	oTab.appendChild(temObj);


	var iCur = 0;
	var intCount = 0;
	var objs = oDiv.childNodes;
	for (var i=0; i<objs.length; i++){
		if (objs[i].nodeName=='FIELDSET') intCount++;
	}

	for (var k=0; k<intCount; k++){
		for (var i=0; i<objs.length; i++){
			if (objs[i].nodeName=='FIELDSET'){
				///*标签
				var strTem=(objs[i].getAttribute('default')=='true')?'_Sel':'';
				var	oTabItem = document.createElement('div');
				oTabItem.onclick = new Function('this.parentNode.parentNode.selectGroup('+k+')');
				oTabItem.className = 'TabMenu_'+sSite+'_Tab_Item'+strTem;
				oTabItem.innerHTML = '<div class="TabMenu_'+sSite+'_Tab_Item_L"><img width="1"/></div><div class="TabMenu_'+sSite+'_Tab_Item_M"></div><div class="TabMenu_'+sSite+'_Tab_Item_R"><img width="1"/></div>'
				oTabItem.getElementsByTagName('div')[1].appendChild(objs[i].getElementsByTagName('legend')[0]);
				oTab.appendChild(oTabItem);

				objs[i].style.display = 'none';//(objs[i].getAttribute('default')=='true')?'':'none';
				objs[i].className = 'TabMenu_top_Content_Item';
				objs[i].loaded=false;
				oContent.appendChild(objs[i]);
				break;
			}
		}
	}

	var objs = oDiv.childNodes;

	///*标签尾 一般不用*/
	temObj = document.createElement('div');
	temObj.className = 'TabMenu_'+sSite+'_Tab_End';
	oTab.appendChild(temObj);




	oDiv.appendChild(oTab);
	oDiv.appendChild(oContent);

	oDiv.selectGroup = function (idx){
		var objs=oTab.childNodes;
		var iCur=0;
		for (var i=0; i<objs.length; i++){
			if ((objs[i].className) && ((objs[i].className=='TabMenu_'+sSite+'_Tab_Item_Sel')||(objs[i].className=='TabMenu_'+sSite+'_Tab_Item'))){
				objs[i].className = 'TabMenu_'+sSite+'_Tab_Item' + (iCur==idx?'_Sel':'');
				iCur++;
			}
		}
		var objs=oContent.childNodes;
		var iCur=0;
		for (var i=0; i<objs.length; i++){
			if ((objs[i].className) && (objs[i].className=='TabMenu_top_Content_Item')){
				objs[i].style.display = (iCur==idx?'':'none');
				if (iCur==idx){//执行onShow函数
					if (objs[i].getAttribute('onshow')){
						try{
							eval(objs[i].getAttribute('onshow'));
						}catch (e){}
					}
					if (!objs[i].loaded){
						if (objs[i].getAttribute('url') && (objs[i].getAttribute('url')!='')){
							if (objs[i].getAttribute('frameName')){
								objs[i].innerHTML = '<iframe src="'+objs[i].getAttribute('url')+'" name="'+objs[i].getAttribute('frameName')+'" style="width:100%;height:100%;" frameborder="0"></iframe>'
							}else{
								objs[i].innerHTML = '<iframe src="'+objs[i].getAttribute('url')+'" style="width:100%;height:100%;" frameborder="0"></iframe>'
							}
						}
						if (objs[i].getAttribute('ajax') && (objs[i].getAttribute('ajax')!='')){
							jsfw.Ajax.loadHttpToObj(objs[i].getAttribute('ajax'),objs[i]);
							/*objs[i].innerHTML = '正在载入...';
							jsfw.Ajax.loadHttp(objs[i].getAttribute('ajax'), true, function(r,o){
									o.innerHTML=r.responseText;
									jsfw.FormatUI(o);
								},objs[i]);*/
						}
						objs[i].loaded = true;
					}
				}
				iCur++;
			}
		}
	}
	oDiv.setHeight = function (iHeight){
		//try{
			if (typeof(iHeight)=='string'){
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
			}
			if (typeof(iHeight)=='number'){
				if (iHeight<1){
					oContent.style.height = '';
				}else{
					try{
						oContent.style.height = iHeight - oTab.offsetHeight;
						oDiv.style.height = iHeight;
					}catch(e){}
				}
			}
		//}catch(e){}
	}

	//初始化[BEGIN]
	var bFind=false;
	var objs = oContent.childNodes;
	var iCur=0;
	for (var i=0; i<objs.length; i++){
		if (objs[i].nodeName=='FIELDSET'){
			if (objs[i].getAttribute('default')=='true'){
				oDiv.selectGroup(iCur);
				bFind=true;
				break;
			}
			iCur++;
		}
	}
	if (!bFind) oDiv.selectGroup(0);
	oDiv.setHeight(oDiv.getAttribute('height'))
	//初始化[END]


	//清除内存
	if (window.attachEvent) window.attachEvent('onunload', function (){
		oDiv.selectGroup = null;
		oDiv.setHeight = null;
		var objs=oTab.childNodes;
		for (var i=0; i<objs.length; i++){
			objs[i].onclick=null;
		}
		var objs=oContent.childNodes;
		for (var i=0; i<objs.length; i++){
			objs[i].loaded=null;
		}
		oDiv.removeChild(oTab);
		oDiv.removeChild(oContent);
	});
};

jsfw.WebUI.TabMenu.TagName = 'div';
//查找需要格式化的组件
/*jsfw.WebUI.TabMenu.FormatAll = function (obj){
	obj = (typeof(obj)=='object')?obj:document;
	var divs = obj.getElementsByTagName("div");
	for (i=(divs.length-1); i>=0; i--) {
		if (divs[i].className && divs[i].className.toLowerCase()=='tabmenu') {
			jsfw.WebUI.TabMenu(divs[i]);
		}
	}
};*/

//引用样式文件
(
	function (){
		var head = document.getElementsByTagName('head')[0];
		var link = document.createElement('link');
		link.rel = 'stylesheet';
		link.href = jsfw.Path + 'Themes/' + jsfw.Theme + '/TabMenu/css.css';
		link.type = 'text/css';
		link.media = 'all';
		head.appendChild(link);
	}
)();