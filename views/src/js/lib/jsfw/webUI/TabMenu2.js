jsfw.WebUI.TabMenu2 = function (oDiv){
	//var oTabs = new Array();
	var oList= new Array();
	for (var i=0; i<oDiv.childNodes.length; i++) if (oDiv.childNodes[i].nodeName=='FIELDSET') oList[oList.length]=oDiv.childNodes[i];

	var sSite=oDiv.getAttribute('site');
	if (!sSite) sSite = 'Top';
	sSite=sSite.toLowerCase();

	var temObj;
	var	oTab = document.createElement('div');
	oTab.className = 'TabMenu2_'+sSite+'_Tab';

	var oContent = document.createElement('div');
	oContent.className = 'TabMenu2_'+sSite+'_Content';

	///*标签头 一般不用*/
	temObj = document.createElement('div');
	temObj.className = 'TabMenu2_'+sSite+'_Tab_Begin';
	oTab.appendChild(temObj);


	//var iCur = 0;
	//var intCount = 0;
	//var objs = oDiv.childNodes;
	//for (var i=0; i<objs.length; i++){
	//	if (objs[i].nodeName=='FIELDSET') intCount++;
	//}

	//for (var k=0; k<oList.length; k++){
	for (var i=0; i<oList.length; i++){
			///*标签
		var strTem=(oList[i].getAttribute('default')=='true')?'_Sel':'';
		var	oTabItem = document.createElement('div');
		oTabItem.onclick = new Function('this.parentNode.parentNode.selectGroup('+i+')');
		oTabItem.className = 'TabMenu2_'+sSite+'_Tab_Item'+strTem;
		oTabItem.innerHTML = '<div class="TabMenu2_'+sSite+'_Tab_Item_L"><img width="1"/></div><div class="TabMenu2_'+sSite+'_Tab_Item_M"></div><div class="TabMenu2_'+sSite+'_Tab_Item_R"><img width="1"/></div>'
		oTabItem.getElementsByTagName('div')[1].appendChild(oList[i].getElementsByTagName('legend')[0]);

		oTab.appendChild(oTabItem);

		oList[i].style.display = 'none';//(oList[i].getAttribute('default')=='true')?'':'none';
		oList[i].className = 'TabMenu2_top_Content_Item';
		oList[i].loaded=false;
		oContent.appendChild(oList[i]);
		//break;
	}
	//}




	//var objs = oDiv.childNodes;

	///*标签尾 一般不用*/
	temObj = document.createElement('div');
	temObj.className = 'TabMenu2_'+sSite+'_Tab_End';
	oTab.appendChild(temObj);




	oDiv.appendChild(oTab);
	oDiv.appendChild(oContent);
	
	//alert(oTab.innerHTML)
	oDiv.selectGroup = function (idx){
		var objs=oTab.childNodes;
		var iCur=0;
		for (var i=0; i<objs.length; i++){
			if ((objs[i].className) && ((objs[i].className=='TabMenu2_'+sSite+'_Tab_Item_Sel')||(objs[i].className=='TabMenu2_'+sSite+'_Tab_Item'))){
				objs[i].className = 'TabMenu2_'+sSite+'_Tab_Item' + (iCur==idx?'_Sel':'');
				iCur++;
			}
		}
		//var objs=oTab.childNodes;
		//for (var i=0; i<oList.length; i++){
			//if ((oList[i].className=='TabMenu2_'+sSite+'_Tab_Item_Sel')||(oList[i].className=='TabMenu2_'+sSite+'_Tab_Item')){
			//oList[i].className = 'TabMenu2_'+sSite+'_Tab_Item' + (i==idx?'_Sel':'');
			//}
		//}
		//var objs=oContent.childNodes;
		//var iCur=0;
		for (var i=0; i<oList.length; i++){
			oList[i].style.display = (i==idx?'':'none');
			if (i==idx){//执行onShow函数
				if (oList[i].getAttribute('onshow')){
					try{
						eval(oList[i].getAttribute('onshow'));
					}catch (e){}
				}
				if (!oList[i].loaded){
					if (oList[i].getAttribute('url') && (oList[i].getAttribute('url')!='')){
						if (oList[i].getAttribute('frameName')){
							oList[i].innerHTML = '<iframe src="'+oList[i].getAttribute('url')+'" name="'+oList[i].getAttribute('frameName')+'" style="width:100%;height:100%;" frameborder="0"></iframe>'
						}else{
							oList[i].innerHTML = '<iframe src="'+oList[i].getAttribute('url')+'" style="width:100%;height:100%;" frameborder="0"></iframe>'
						}
					}
					if (oList[i].getAttribute('ajax') && (oList[i].getAttribute('ajax')!='')){
						jsfw.Ajax.loadHttpToObj(oList[i].getAttribute('ajax'),oList[i]);
						/*oList[i].innerHTML = '正在载入...';
						jsfw.Ajax.loadHttp(oList[i].getAttribute('ajax'), true, function(r,o){
								o.innerHTML=r.responseText;
								jsfw.FormatUI(o);
							},oList[i]);*/
					}
					oList[i].loaded = true;
				}
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
	//var objs = oContent.childNodes;
	//var iCur=0;
	for (var i=0; i<oList.length; i++){
		if (oList[i].getAttribute('default')=='true'){
			oDiv.selectGroup(i);
			bFind=true;
			break;
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
		try{
			oDiv.removeChild(oTab);
			oDiv.removeChild(oContent);
		}catch(e){}
		
	});
};

jsfw.WebUI.TabMenu2.TagName = 'div';
//查找需要格式化的组件
/*jsfw.WebUI.TabMenu2.FormatAll = function (obj){
	obj = (typeof(obj)=='object')?obj:document;
	var divs = obj.getElementsByTagName("div");
	for (i=(divs.length-1); i>=0; i--) {
		if (divs[i].className && divs[i].className.toLowerCase()=='TabMenu2') {
			jsfw.WebUI.TabMenu2(divs[i]);
		}
	}
};*/

//引用样式文件
(
	function (){
		var head = document.getElementsByTagName('head')[0];
		var link = document.createElement('link');
		link.rel = 'stylesheet';
		link.href = jsfw.Path + 'Themes/' + jsfw.Theme + '/TabMenu2/css.css';
		link.type = 'text/css';
		link.media = 'all';
		head.appendChild(link);
	}
)();