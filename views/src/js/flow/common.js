var ie=/msie/i.test(navigator.userAgent);
var ie6=/msie [0-6]/i.test(navigator.userAgent);

////////公用方法[Begin]
if(typeof(window._)!='function') window._=function(sID){return document.getElementById(sID)||document.getElementsByName(sID)[0];}
function _getAttr(obj,sAttr,sDef){ if (typeof(sDef)!='string') {sDef='';}; return obj.getAttribute(sAttr)||sDef; }
function _getChildren(oPar,sCondition){
	var objs=oPar.childNodes;
	var arr=[];
	if ((sCondition=='*')||(sCondition=='')) return objs;
	if (sCondition.indexOf('.')==-1){
		for (var i=0; i<objs.length; i++){
			if (objs[i].nodeName.toLowerCase()==sCondition.toLowerCase()) arr.push(objs[i]);
		}
	}else{
		for (var i=0; i<objs.length; i++){
			if (objs[i].nodeName.toLowerCase()==sCondition.split('.')[0].toLowerCase()){
				if (objs[i].className.toLowerCase()==sCondition.split('.')[1].toLowerCase()) arr.push(objs[i]);
			}
		}
	}
	return arr;
}
function _getNextSibling(obj,sNodeType){
	var oNext=obj.nextSibling;
	
	for (var i=0; i<100; i++){
			if (oNext.nodeName==sNodeType){
				return oNext;
			}else{
				oNext=oNext.nextSibling;
			}
		}	
}
//[Func] 添加样式(一次只能添加一个样式)
function addClass(obj,sClass){
		var str=obj.className; var reg=new RegExp('\\b'+sClass+'\\b','i'); if (reg.test(str)) return;
		obj.className=str + ' '+sClass;
}
//[Func] 删除样式
function removeClass(obj,sClass){
		var str=obj.className; var reg=new RegExp('\\b'+sClass+'\\b','i'); if (!reg.test(str)) return;
		obj.className=str.replace(reg,'').replace(/( )+/ig,' ').replace(/(^\s+)|(\s+$)/g,'');
}
////////公用方法[End]


//js脚本
function fixPNG(oImg,strBasePath){
	if (!ie6) return;
	if(null!=strBasePath && strBasePath!="") strBasePath=strBasePath+"/";
	try{
		var LW=oImg.width;
		var LH=oImg.height;
		var imgName = oImg.src.toUpperCase();
		if (imgName.substring(imgName.length-3, imgName.length) == "PNG"){ 
			oImg.style.filter+="progid:DXImageTransform.Microsoft.AlphaImageLoader(src='"+oImg.src+"', sizingmethod=scale);";
			oImg.src = strBasePath+'images/t.gif';
			oImg.width=LW;
			oImg.height=LH;
		}
	}catch(e){}
}

function initPage(){
	/*if (_('divFixTop') && _('divFixCnt')){
		_('divFixCnt').style.height = document.body.offsetHeight - parseInt(_('divFixTop').offsetHeight);
		addEvent(window,'onresize',function (){
			_('divFixCnt').style.height = document.body.offsetHeight - parseInt(_('divFixTop').offsetHeight);
		});
	}*/
}

/*function addEvent(obj,sEvent,fun){
	if (obj.attachEvent){ obj.attachEvent(sEvent, fun); }else{ obj[sEvent] = fun; }
}
var inited=false;
addEvent(window,'onload',function (){
	if (inited) return;
	inited=true;
	try{ initPage(); }catch(e){}
});*/

//////////////顶部标签[Begin]
function initTopNav(){
	jQuery('#idx_top_nav > div').each(function(text, obj) {
		var modobj = eval("menuMode.mod" + obj.id);
		if (modobj.length > 1 && obj.id != "m1") {
			jQuery("#" + obj.id).append("<div class=\"top_nav_item_down\"><img src=\""+nginxDomainPath+"/images/t.gif\"></div>");

			var sHTMLSub='<div class="subItemParInner">';
			for (var j=0; j<modobj.length; j++){
				sHTMLSub+='<div class="subItem" onclick="top_nav_subitem_clk(this,'+obj.id+')" onmouseover="top_nav_subitem_over(this)" onmouseout="top_nav_subitem_out(this,'+obj.id+')">';
				sHTMLSub+=modobj[j].name;
				sHTMLSub+='</div >';
			}
			sHTMLSub+='</div >';
			var oDivSub = document.createElement("div");
			oDivSub.id='subItemPar_'+obj.id;
			oDivSub.name='subItemPar_'+obj.id;
			oDivSub.className='subItemPar';
			oDivSub.innerHTML=sHTMLSub;
			oDivSub.style.zInde=1000;
			oDivSub.style.display='none';
			document.body.appendChild(oDivSub);
		}
	});
}

/*function top_nav_item_clk(obj,idx){
	var objs=_getChildren(_('idx_top_nav'),'div');
	for (var i=0; i<objs.length; i++) objs[i].className='top_nav_item';
	objs[idx].className='top_nav_item top_nav_item_sel';
	top.frameLeft.location=arrTopItems[idx].urlLeft;
	top.frameMain.location=arrTopItems[idx].urlMain;
}*/
var timHideNavItem;
function top_nav_item_over(obj){
	clearTimeout(timHideNavItem);
	var objs=_getChildren(document.body,'div.subItemPar');
	for (var i=0; i<objs.length; i++) objs[i].style.display='none';
	var modobj = eval("menuMode.mod" + obj.id);
	if (modobj.length==0) return;
	jQuery("#subItemPar_" + obj.id).attr("style","top :" + (obj.offsetTop + obj.offsetHeight + obj.parentNode.offsetTop) +
			";left:" + (obj.offsetLeft + obj.parentNode.offsetLeft) + ";display:''");
}
function top_nav_item_out(obj){
	clearTimeout(timHideNavItem);
	timHideNavItem=setTimeout(function (){
		var objs=_getChildren(document.body,'div.subItemPar');
		jQuery("#subItemPar_" + obj.id).attr("style","display:none");
	},500);
}
function top_nav_subitem_clk(obj,idx){
	idx.click();
	jQuery("#subItemPar_" + idx.id).attr("style", "display:none");
	var div = document.getElementById('div_Left_Main');
	div.selectGroupByTitle(obj.innerText);
}
function top_nav_subitem_over(obj){
	obj.className='subItem subItem_over';
	clearTimeout(timHideNavItem);
}
function top_nav_subitem_out(obj,idx){
	obj.className='subItem';
	clearTimeout(timHideNavItem);
	timHideNavItem=setTimeout(function (){
		jQuery("#subItemPar_" + idx.id).attr("style","display:none");
	},500);
}
//////////////顶部标签[End]

//////////////字体选择下拉框[Begin]
function font_area_over(obj){
   var top = obj.offsetTop + obj.parentNode.parentNode.offsetTop + obj.offsetHeight;
   var left = obj.offsetLeft + obj.parentNode.parentNode.offsetLeft;
   var width = obj.offsetWidth;
   jQuery("#fontSelDiv").css("top",top);
   jQuery("#fontSelDiv").css("left",left);
   jQuery("#fontSelDiv").css("width",width);
   jQuery("#fontSelDiv").show();
   jQuery("#fontDiv").attr("class","Text-Change");

}
function font_area_out(obj){
	var x = event.clientX;
	var y = event.clientY;
	var top = obj.offsetTop + obj.parentNode.parentNode.offsetTop + obj.offsetHeight;
	var left = obj.offsetLeft + obj.parentNode.parentNode.offsetLeft;
	var bottom = top + obj.offsetHeight;
	var right = left + obj.offsetWidth;
	  
	if(obj.id=='fontSelDiv'){
		top -=20;
	}
	if(x<left || y<top || x>right || y>bottom){
		jQuery("#fontSelDiv").hide();
	}
	jQuery("#fontDiv").attr("class","Text-Base");
}
//////////////字体选择下拉框[End]

//////////////简单树型[Begin]
function initTreeLite(oDiv){
	var objs=oDiv.getElementsByTagName('div');
	for (var i=0; i<objs.length; i++){
		if (/item/i.test(objs[i].className)){
			objs[i].onmouseover = new Function('this.className=this.className.replace(/item/i,"item item_over")');
			objs[i].onmouseout = new Function('this.className=this.className.replace(/item item_over/i,"item")');
			objs[i].onclick = TreeLiteItemClk;
		}
	}
	var objs=_getChildren(oDiv,'div.item');
	try{
		for (var i=0; i<objs.length; i++){
			if (_getNextSibling(objs[i],'DIV').style.display=='none'){
				objs[i].className='item_normal';
			}else{
				objs[i].className='item_expand';
			}
		}
	}catch(e){}
}

function TreeLiteItemClk(){
	var sAction=_getAttr(this,'action','');
	if (sAction!='') eval(sAction);
	try
	{
		var oSub=_getNextSibling(this,'DIV');
		if (!/sub/i.test(oSub.className)) return;
		var bShow=oSub.style.display=='none';
		oSub.style.display = bShow?'':'none';
		if (bShow){
			this.className=this.className.replace(/normal/i,"expand")
		}else{
			this.className=this.className.replace(/expand/i,"normal")
		}
	}
	catch (e){}
}
//////////////简单树型[End]

function showHideLogoLink(oBtn){
	var obj=_('divLogoLink');
	var bShow=obj.style.display=='none'
	oBtn.className = 'imgUpDown0 imgUpDown0_'+(bShow?'Up':'Down');
	obj.style.display = bShow ?'':'none';
	oBtn.parentNode.style.height = bShow?105:33;
	oBtn.parentNode.className = bShow?'idx_top':'idx_top idx_top_Small';
}

function showHideObj(obj){
	obj.style.display = obj.style.display=='none'?'':'none';
}
function showHideNext(obj,sNodeType){
	var oNext = (typeof(sNodeType)=='string')?_getNextSibling(obj,sNodeType.toUpperCase()):obj.nextSibling;
	var bShow=oNext.style.display=='none';
	oNext.style.display = bShow?'':'none';
	var objs=obj.getElementsByTagName('img');
	for (var i=0; i<objs.length; i++){
		if (/imgUpDown/i.test(objs[i].className)) { objs[i].className=bShow?'imgUpDown imgUpDown_Up':'imgUpDown imgUpDown_Down'; }
	}
}

////////简单表格
function format_nGrid(oTab){
	var iHead= (oTab.tHead)?oTab.tHead.rows.length:1;
	for (var i=0; i<iHead; i++){ oTab.rows[i].className = 'GridHead'; }
	for (var i=iHead; i<oTab.rows.length; i++){
		oTab.rows[i].className = ((i-iHead)%2==0)?'tr_odd':'tr_even';
		oTab.rows[i].onmouseover=function (){ addClass(this,'trOver'); }
		oTab.rows[i].onmouseout=function (){ removeClass(this,'trOver'); }
	}
	for (var i=0; i<oTab.rows.length; i++){
		for (var j=0; j<oTab.rows[i].cells.length; j++) {
			if (j==0){
				oTab.rows[i].cells[j].className = 'GridCell GridCell_L';
			}else if (j==oTab.rows[i].cells.length-1){
				oTab.rows[i].cells[j].className = 'GridCell GridCell_R';
			}else{
				oTab.rows[i].cells[j].className = 'GridCell';
			}
		}
	}
}

function showLoading(bShow,sTop,sLeft){
	if (!jsfw.WebUI.Action) jsfw.Import("WebUI.Action");
	jsfw.WebUI.Action.ShowLoading(bShow,sTop,sLeft);
}
function showMsgJsfw(sContent,sTitle,iTime,iWidth,iHeight){
	if (!jsfw.WebUI.PopMsg) jsfw.Import("WebUI.PopMsg");
	sTitle = sTitle || '信息';
	iTime = (typeof(iTime)=='number')?iTime:2000;
	jsfw.WebUI.PopMsg.newMsg(sContent,sTitle,iTime,iWidth,iHeight);
}
function addMsg(sContent,sTitle){
	if (!jsfw.WebUI.PopMsg) jsfw.Import("WebUI.PopMsg");
	sTitle = sTitle || '信息';
	jsfw.WebUI.PopMsg.addMsg(sContent,sTitle);
}

function selectAll(obj,sName){
	var objs=document.getElementsByName(sName);
	for (var i=0; i<objs.length; i++){
		objs[i].checked=obj.checked;
	}
}


function getCheckBoxVal(sName){
	var sR='';
	var objs=document.getElementsByName(sName);
	for (var i=0; i<objs.length; i++){
		if (!objs[i].checked) continue;
		if (sR!='') sR+=',';
		sR+=objs[i].value;
	}
	return sR;
}

	
function openWindow(sURL,jParam){
	var width=screen.availWidth-10;
	var height=screen.availHeight-55;

	var left=0;
	var top=0;

	var newWindow=window.open(sURL,'','resizable=1,scrollbars=0,status=yes,toolbar=no,channelmode=0,directories=0,menubar=0,location=0,left=' + left + ' top=' + top + ' width=' + width + ' height=' + height,false);
	newWindow.focus();
	return newWindow;
}
function openWindowNew(sURL,jParam){
	var width=screen.availWidth-10;
	var height=screen.availHeight-55;
	
	var left=0;
	var top=0;
	
	var newWindow=window.open(sURL,'','resizable=1,scrollbars=1,status=no,toolbar=no,channelmode=1,directories=0,menubar=0,location=0,left=' + left + ' top=' + top + ' width=' + width + ' height=' + height,false);
	newWindow.focus();
	return newWindow;
}

/*var oArr = {};
oArr['id'] = '123123';
oArr['panelTitle'] = 'ssssssssss';
oArr['panelName'] = 123;*/
function showDialogPost(sTitle,sURL,oArr,sWindowID,width,height,bMax,bModalWindow,bShowMaxButton,bNoTitle){
	var Win1 = showDialog(sTitle,'about:blank',sWindowID,width,height,bMax,bModalWindow,bShowMaxButton,bNoTitle);
	var aForm = document.createElement('form');
	var sHTML='';
	for (var item in oArr){
		sHTML += '<input type="text" name="'+item+'" value="'+oArr[item]+'"/>';
	}
	aForm.target=Win1.IFrameName;
	aForm.action=sURL;
	aForm.method='post';
	aForm.innerHTML=sHTML;
	aForm.style.display='none';
	document.body.appendChild(aForm);
	setTimeout(function (){aForm.submit();},10);
	return Win1;
}
function showDialog(sTitle,sURL,sWindowID,width,height,bMax,bModalWindow,bShowMaxButton,bNoTitle){
	if (!jsfw.WebUI.Window) jsfw.Import("WebUI.Window");
	if (!width) width=(document.body.scrollWidth*.75); //width=(screen.width*.75);
	if (!height) height=(document.body.scrollHeight*.7); //height=(screen.height*.7);
	sWindowID=sWindowID||'';
	if (typeof(bModalWindow) == 'undefined') { 
		bModalWindow = false;
	}
	if (typeof(bNoTitle)!='boolean') bNoTitle=false;
	var Win1 = jsfw.WebUI.Window.newWindow(sWindowID,sTitle,sURL,width,height,-1,-1,bModalWindow,bNoTitle);//
	//bMax = (typeof(bMax)=='boolean')?bMax:false;
	if (bMax) Win1.max();
	if (typeof(bShowMaxButton)!='boolean') bShowMaxButton=false;
	Win1.setMaxButton(bShowMaxButton);
	return Win1;
}
function closeDialog(sWindowID){ setTimeout(function(){ try{findDialog(sWindowID).close();}catch(e){}  },100); }
function findDialog(oValue){ try{return jsfw.WebUI.Window.findWindow(oValue);}catch(e){} }


/////将JSON转为字符串
function Obj2str(o) {
	if (o == undefined) {
		return "";
	}
	var r = [];
	if (typeof o == "string") return "\"" + o.replace(/([\"\\])/g, "\\$1").replace(/(\n)/g, "\\n").replace(/(\r)/g, "\\r").replace(/(\t)/g, "\\t") + "\"";
	if (typeof o == "object") {
		if (!o.sort) {
			for (var i in o)
				r.push("\"" + i + "\":" + Obj2str(o[i]));
			if (!!document.all && !/^\n?function\s*toString\(\)\s*\{\n?\s*\[native code\]\n?\s*\}\n?\s*$/.test(o.toString)) {
				r.push("toString:" + o.toString.toString());
			}
			r = "{" + r.join() + "}";
		} else {
			for (var i = 0; i < o.length; i++)
				r.push(Obj2str(o[i]));
			r = "[" + r.join() + "]";
		}
		return r;
	}
	return o.toString().replace(/\"\:/g, '":""');
}


function maxSizeFrame(bMax){
	var oTab= document.getElementsByTagName('table')[0];
	if (typeof(bMax)!='boolean') bMax=oTab.rows[oTab.rows.length-1].style.display!='none';
	oTab.rows[oTab.rows.length-1].style.display = bMax?'none':'';
	oTab.rows[0].style.display = bMax?'none':'';
	oTab.rows[1].style.display = bMax?'':'none';
	oTab.className = bMax?'logo_bg0_small':'logo_bg0';
	jsfw.setCookie('maxSizeFrame',bMax?'1':'0');
}


///初始化编辑界面:将JSON数据填入Form中
function funFillForm(aForm,json){
	for(var i=0;i<aForm.elements.length;i++){
		var jsVal=json.result[aForm.elements[i].name];
		if (jsVal==null) jsVal='';
		if (typeof(jsVal)=='undefined') continue;
		if (/(text)|(hidden)|(textarea)/i.test(aForm.elements[i].type)){
			aForm.elements[i].value=jsVal||'';
		}
		if (/(radio)/i.test(aForm.elements[i].type)){
			if (aForm.elements[i].value == jsVal.toString()) aForm.elements[i].checked=true;
		}
		if (/(select-one)/i.test(aForm.elements[i].type)){
			//alert(aForm.elements[i].type)
			var opts=aForm.elements[i].options;
			for (var j=0; j<opts.length; j++){
				if (opts[j].value==jsVal.toString()) {
					aForm.elements[i].selectedIndex=j;
					break;
				}
			}
		}
	}
}



///删除项
function delItem_base(sURL,fun,chkName){
	chkName=chkName||'chkID';
	var sIDs=getCheckBoxVal(chkName);
	if (sIDs=='') {showMsgJsfw('请选择要删除的项。');return;}
	if (!confirm('你确定要删除吗？')) return;
	sURL = sURL.replace(/{ids}/ig,sIDs);
	sURL += ((/\?/.test(sURL))?'&':'?') + '_method=delete';
	jsfw.Ajax.postArrDataJSON(sURL, {}, true,fun);
}


///初始化表格搜索
function formatGridSearch(oDiv){
	var sHTML='';
	sHTML+='<form method="get" action="" onsubmit="javascript:funGridSearch(this.parentNode,this.txtSearchItem.value); return false;">';
	sHTML+='<input type="text" name="txtSearchItem" class="txtSearchItem"><input type="image" src="images/t.gif" class="txtSearchButton" align="absmiddle">';
	sHTML+='</form>';
	oDiv.innerHTML=sHTML;
	//<div id="gridSearch" grid="gridMain" column="roleCode,roleName"></div>
}

function funGridSearch(oDiv,sKey){
	showLoading();
	var oGrid=_(jsfw.getAttr(oDiv,'grid'));
	var sCol=jsfw.getAttr(oDiv,'column');
	var sURL=jsfw.getAttr(oGrid,'URLData');
	sURL=sURL.replace(/\&uq\.(column|value)\=[^\&]*/ig,'');
	sURL=sURL.replace(/\?uq\.(column|value)\=[^\&]*/ig,'?');
	sURL += (/\?/.test(sURL)?'&':'?') + 'uq.column='+sCol+'&uq.value='+encodeURIComponent(sKey);
	//sURL += (/\?/.test(sURL)?'&':'?') +'&qmsFile.fileName='+encodeURIComponent(sKey);
	jsfw.setAttr(oGrid,'URLData',sURL);
	oGrid.loadData();
}

function afterGridLoadData(){
	try{
		showLoading(false);
	}catch(e){}
}

//Ajax请求出错
function jsfwAjaxErr(sURL,status){
	top.showMsgJsfw('<div style="width:100%;word-break:break-all;">'+status+'<br>'+sURL+'</div>','Ajax请求出错',6000,250,120);
}
//返回json错误信息
function jsfwAjaxErr_Json(sURL,json){
	top.showMsgJsfw('<div style="width:100%;word-break:break-all;">messageCode:<br>'+json.messageCode+'<br>message:<br>'+json.messageCode+'<br>URL:<br>'+sURL+'</div>','json Error',6000,250,120);
}

//
function showDialogWin(sURL,sWindowID){
	window.open(sURL);
}

function afterInitInput_Dict(obj){
	if (jsfw.getAttr(obj,'URLData')!='') return;
	jsfw.setAttr(obj,'URLData','systemMng/sysDict/pageModel/'+jsfw.getAttr(obj,'dictName')+'.do');
	obj.loadData();
}


function afterInitInput_TabList(obj,tab){
	if (jsfw.getAttr(obj,'URLData')!='') return;
	jsfw.setAttr(obj,'URLData',tab);
	obj.loadData();
}

function formatTableMainWithFloatRight(oTab){
	if (jsfw.getAttr(oTab,'formated')) return;
	jsfw.setAttr(oTab,'formated',true);
	if (oTab.rows[0].cells.length==2){
		if (!jsfw.WebUI.SplitBar) jsfw.Import("WebUI.SplitBar");
		var oTD=oTab.rows[0].insertCell(1);
		oTD.style.width=5;
		oTD.innerHTML=jsfw.jsfwTransGIF;
		oTD.className='float_right_split';
		jsfw.WebUI.SplitBar(oTD);
		oTD.funAttackDrop=function (iDelta){
			var oTDEnd=oTab.rows[0].cells[oTab.rows[0].cells.length-1];
			var iWidth=oTDEnd.offsetWidth-iDelta;
			if (iWidth<50) iWidth=50;
			oTDEnd.width=iWidth; oTDEnd.style.width=iWidth;
			jsfw.setCookie('float_right_width',oTDEnd.offsetWidth);
		};
	}
	var bShowRight=false;
	var objs=oTab.getElementsByTagName('div');
	for (var i=0; i<objs.length; i++){
		if (objs[i].className=='FRTitle'){
			if (objs[i].style.display!='none') bShowRight=true;
			objs[i].onclick=new Function('showHideFloatRightItem(this)');
		}
	}
	var objs=oTab.getElementsByTagName('td');
	for (var i=0; i<objs.length; i++){
		if (objs[i].className=='FRTitle'){
			if (objs[i].style.display!='none') bShowRight=true;
			objs[i].onclick=new Function('showHideFloatRightItem(this)');
		}
	}
	var oTDEnd=oTab.rows[0].cells[oTab.rows[0].cells.length-1];
	if (bShowRight){
		var strTem=jsfw.getCookie('float_right_width'); if (strTem=='') strTem='300';
		var iWidth=parseInt(strTem);
		if (iWidth<50) iWidth=50;
		oTDEnd.width=iWidth; oTDEnd.style.width=iWidth;
	}else{
		oTDEnd.style.display='none';
		oTab.rows[0].cells[oTab.rows[0].cells.length-2].display='none';
	}
}
function showHideFloatRightItem(obj){
	if (obj.nodeName=='TD'){
		var oSub=obj.parentNode.nextSibling;
		if (oSub.nodeName.substr(0,1)=='#') oSub=oSub.nextSibling;
	}else{
		var oSub=obj.nextSibling;
		if (oSub.nodeName.substr(0,1)=='#') oSub=oSub.nextSibling;
	}
	oSub.style.display = (oSub.style.display=='')?'none':'';
}


////树形选择
/*
{
'title':'',	//对话框标题
'width':300,	//宽度
'height':200, //高度
'saveCaption':'保存', //保存按钮
'dataType':'url_json',//'url_xml,data_xml,data_json,data_xml_send_user' //数据类型
'data':'',	//数据
'bMultiSelect':true, //是否可多选
'txtValue':'',  //选择后赋值Input
'txtCaption':'', //选择后赋值Input
'funAfterSel':'',  //选择后执行脚本
'bOnlyLeaf':true	//仅选择叶子节点
}
*/
var SelectDialog_TreeParam;
function SelectDialog_Tree(jsonParam){
	var sURL='common/select_tree.htm';
	if (typeof(jsonParam.bMultiSelect)!='boolean') jsonParam.bMultiSelect=true;
	SelectDialog_TreeParam = jsonParam;
	showDialog(jsonParam.title,sURL,'', jsonParam.width, jsonParam.height);
	//alert(jsonParam.funAfterSel)
	//funAfterSelectTree=funAfterSel;
	//function selectFld_(bMut,objID,objCap,sRootID,sSelectType,bShowFullPath,sHideID,funAfterSel,sPermit){
	//function showDialog(sTitle,sURL,sWindowID,width,height,bMax,bModalWindow,bShowMaxButton,bNoTitle){
}

////列表选择
/*
{
'title':'',	//对话框标题
'width':300,	//宽度
'height':200, //高度
'saveCaption':'保存', //保存按钮
'dataType':'url_json',//'url_xml,data_xml,data_json,data_xml_send_user' //数据类型
'data':'',	//数据
'bMultiSelect':true, //是否可多选
'txtValue':'',  //选择后赋值Input
'txtCaption':'', //选择后赋值Input
'funAfterSel':'',  //选择后执行脚本
'bOnlyLeaf':true	//仅选择叶子节点
}
*/
var SelectDialog_ListParam;
function SelectDialog_List(jsonParam){
	var sURL='common/select_list.jsp';
	SelectDialog_ListParam = jsonParam;
	showDialog(jsonParam.title,sURL,'', jsonParam.width, jsonParam.height);
	//alert(jsonParam.funAfterSel)
	//funAfterSelectTree=funAfterSel;
	//function selectFld_(bMut,objID,objCap,sRootID,sSelectType,bShowFullPath,sHideID,funAfterSel,sPermit){
	//function showDialog(sTitle,sURL,sWindowID,width,height,bMax,bModalWindow,bShowMaxButton,bNoTitle){
}

/*function getXMLDom(){
	if (/msie/i.test(navigator.userAgent)){
		for (var i=0; i<4; i++)
			try{
				var r = new ActiveXObject(["MSXML2.DOMDocument", "Microsoft.XMLDOM", "MSXML.DOMDocument", "MSXML3.DOMDocument"][i]);
				return r;
			}catch (e){return null;}
	else return document.implementation.createDocument("", "doc", null);
}*/


///////////////////解决非IE下处理XML函数的问题[begin]
if (!ie) {
	var ex;
	XMLDocument.prototype.__proto__.__defineGetter__(" xml ",
	function() {
		try {
			return new XMLSerializer().serializeToString(this);
		} catch(ex) {
			var d = document.createElement(" div ");
			d.appendChild(this.cloneNode(true));
			return d.innerHTML;
		}
	});
	Element.prototype.__proto__.__defineGetter__(" xml ",
	function() {
		try {
			return new XMLSerializer().serializeToString(this);
		} catch(ex) {
			var d = document.createElement(" div ");
			d.appendChild(this.cloneNode(true));
			return d.innerHTML;
		}
	});
	XMLDocument.prototype.__proto__.__defineGetter__(" text ",
	function() {
		return this.firstChild.textContent
	});
	Element.prototype.__proto__.__defineGetter__(" text ",
	function() {
		return this.textContent
	});

	XMLDocument.prototype.selectSingleNode = Element.prototype.selectSingleNode = function(xpath) {
		var x = this.selectNodes(xpath);
		if (!x || x.length < 1) return null;
		return x[0];
	}
	XMLDocument.prototype.selectNodes = Element.prototype.selectNodes = function(xpath) {
		var xpe = new XPathEvaluator();
		var nsResolver = xpe.createNSResolver(this.ownerDocument == null ? this.documentElement: this.ownerDocument.documentElement);
		var result = xpe.evaluate(xpath, this, nsResolver, 0, null);
		var found = [];
		var res;
		while (res = result.iterateNext()) found.push(res);
		return found;
	}
}
///////////////////解决非IE下处理XML函数的问题[end]

//string转XML对象
function newXMLFromStr(str){
	if (/msie/i.test(navigator.userAgent)){
		for (var i=0; i<4; i++){
			try{
				var r = new ActiveXObject(["MSXML2.DOMDocument", "Microsoft.XMLDOM", "MSXML.DOMDocument", "MSXML3.DOMDocument"][i]);
				r.loadXML(str);
				return r;
			}catch (e){return null;}
		}
	}else{
		return (new DOMParser()).parseFromString(str,"text/xml");
	}
}
//获取XML对象的内容
function getXMLStr(xDom){
	if (/msie/i.test(navigator.userAgent)) return xDom.xml;
	return (new XMLSerializer()).serializeToString(xDom);
}

function getXMLNodeValue(oXML,sPath,sDef){
	return (oXML.selectNodes(sPath).length==0)?sDef:oXML.selectNodes(sPath)[0].text;
}
function getXMLNodeAttr(oXML,sPath,sAttr,sDef){
	try{
		return oXML.selectNodes(sPath)[0].attributes.getNamedItem(sAttr).text;
	}catch(e){
		if (sDef) return sDef;
		return '';
	}
}
//设置XML节点属性
function setXMLNodeAttr(oXML,sPath,sAttr,sVal){
	var oNode=oXML.selectSingleNode(sPath);
	if (typeof(sVal)=='undefined') sVal='';
	jsfw.setAttr(oNode,sAttr,sVal);
}
//添加XML子节点
function addXMLChildNode(oXML,sPath,sNodeName){
	var oNode=oXML.createElement(sNodeName);
	if (typeof(sPath)=='string'){
		var oPar=oXML.selectSingleNode(sPath);
	}else{
		var oPar=sPath;
	}
	return oPar.appendChild(oNode);
}



function showHideNextNode(obj){//显示隐藏临近节点
	try{
		obj.nextSibling.style.display = obj.nextSibling.style.display=='none'?'':'none';
	}catch(e){}
}


//IFRAME自适应高度[IFrame内页调用]
function resizeIFrame(iH){
	var frms=parent.document.getElementsByTagName('iframe');//parent.document.frames;
	var iH0 = document.body.scrollHeight;	
	var iH1 = document.documentElement.scrollHeight;	
	var iHeight = Math.max(iH0, iH1);
	if (iHeight<40) return;//iHeight=50;
	//if (iHeight<40) iHeight=50;
	if (typeof(iH)=='number') iHeight= iH;
	for (var i=0; i<frms.length; i++){
		if ( (frms[i].contentWindow == self) || (frms[i] == self)){
			frms[i].height=iHeight;
			frms[i].style.height=iHeight;
			break;
		}
	}
}

//将Form转为json
function FormToJSon(aForm){
	var json={};
	for(var i=0;i<aForm.elements.length;i++){
		if (!(((aForm.elements[i].type=='checkbox')||(aForm.elements[i].type=='radio')) && (!aForm.elements[i].checked))){
			json[aForm.elements[i].name]=aForm.elements[i].value;
			
		}
	}
	var objs=aForm.getElementsByTagName('label');
	
	for (var i=0; i<objs.length; i++){
		if (typeof(objs[i].name)!='string') continue;
		if(objs[i].isView==1){
		  json[objs[i].name]=objs[i].innerHTML;
		}
	}
	return json;
}
//将json值赋值到Form
function FormFromJSon(aForm,json,isView){
	for(var i=0;i<aForm.elements.length;i++){
		try{
			if (json[aForm.elements[i].name]==undefined) continue;
			aForm.elements[i].value=json[aForm.elements[i].name];
		}catch(e){}
		//if (!(((aForm.elements[i].type=='checkbox')||(aForm.elements[i].type=='radio')) && (!aForm.elements[i].checked))){
			//json[aForm.elements[i].name]=aForm.elements[i].value
		//}
	}
	var objs=aForm.getElementsByTagName('label');
	//alert("isview  "+isView);
	for (var i=0; i<objs.length; i++){
		if (typeof(objs[i].name)!='string' ) continue;
		try{
			if(isView==2){//编辑状态
			    if(objs[i].isView==1){
				   objs[i].innerHTML=json[objs[i].name];
			    }
			}else{//非编辑状态
				if(json[objs[i].name]==undefined){
					objs[i].innerHTML="";
				}else{
					objs[i].innerHTML=json[objs[i].name];
					objs[i].id=objs[i].name;
					if(objs[i].name=='examine'){
						objs[i].innerHTML=json[objs[i].name]==0? "会签":"不会签";
					}
				}
			}
		}catch(e){}
	}
	return json;
}


//统一搜索
function funTopSearch(){
	var sKey=encodeURIComponent(_('txtTopSearch').value);
	var sURL=jsfw.getAttr(_('txtTopSearch'),'url')+sKey;
	window.open(sURL);
}


//跨域请求流程引擎时接管jsfw.getJsonDataList （获取待办、待阅）(jsfw.getJsonDataList请求跨越信息时，调用此函数)
var arrFunCrossDomain=[];
function getJsonDataList_crossDomain(sURL,fun,obj,jParam){
	var json={}; json.fun=fun; json.sURL=sURL;
	var idx=arrFunCrossDomain.push(json);
	var oIFrame = document.createElement("iframe");
	//if (typeof(CST_SERVER_URL_ENGINE)!='string') var CST_SERVER_URL_ENGINE='http://engine.sasac.gov.cn:8090/BPEngine';
	//oIFrame.src=CST_SERVER_URL_ENGINE+'/extension/getJsonDataList_crossDomain.htm?idx=' + (idx-1);
	oIFrame.src = getSystemURL().engine+'extension/getJsonDataList_crossDomain.htm?idx=' + (idx-1);
	oIFrame.style.display='none';
	document.body.appendChild(oIFrame);
}


//////获取用户信息 [质量体系][begin]
function getCurUser(){
	if (typeof(top.CurUserInfo)!='object'){ 
		var r=jsfw.Ajax.loadJSON("qms/file/userInfo.do", false).result
		top.CurUserInfo=r[0];
		top.CurUserInfo.depts=r[1];
		top.CurUserInfo.roles=r[2];
		top.CurUserInfo.curDept=top.CurUserInfo.depts[0];
	}
	return top.CurUserInfo;
}
//////获取用户信息 [质量体系][end]


/////获取各业务系统URL
function getSystemURL(){
	if (self!=top) return top.getSystemURL();
	try{
		if ((opener) && (opener.getSystemURL)) return opener.getSystemURL();
	}catch(e){}
	if (typeof(top.SystemURLJson)!='object'){
		top.SystemURLJson={
			'engine':'http://engine.sasac.gov.cn:8090/BPEngine/',
			'op':'http://op.sasac.gov.cn/',
			'usermgr':'http://usermgr.sasac.gov.cn:8092/SgccUserMgr/',
			'irs':'http://irs.sasac.gov.cn:8888/km/',
			'qms':'http://qms.sasac.gov.cn:8080/sasac/'
		}
	}
	return top.SystemURLJson;
}
/**处理时间函数【begin】*/
Date.prototype.format = function(format)
{
    var o =
    {
        "M+" : this.getMonth()+1, //month
        "d+" : this.getDate(),    //day
        "h+" : this.getHours(),   //hour
        "m+" : this.getMinutes(), //minute
        "s+" : this.getSeconds(), //second
        "q+" : Math.floor((this.getMonth()+3)/3),  //quarter
        "S" : this.getMilliseconds() //millisecond
    }
    if(/(y+)/.test(format))
    format=format.replace(RegExp.$1,(this.getFullYear()+"").substr(4 - RegExp.$1.length));
    for(var k in o)
    if(new RegExp("("+ k +")").test(format))
    format = format.replace(RegExp.$1,RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
    return format;
}

Date.prototype.formatToSolr=function(sFmt){
	//yyyy mm dd hh MI ss ww
	var strTem='';
	var sResult=sFmt;

	sResult = sResult.replace(/yyyy/ig,this.getFullYear().toString());
	sResult = sResult.replace(/yy/ig,this.getFullYear().toString().substr(2));

	strTem = (this.getMonth()+1).toString();
	sResult = sResult.replace(/mm/g,strTem);
	if (strTem.length<2) strTem='0'+strTem;
	
	sResult = sResult.replace(/MM/g,strTem);

	strTem = this.getDate().toString();
	sResult = sResult.replace(/dd/g,strTem);
	if (strTem.length<2) strTem='0'+strTem;
	sResult = sResult.replace(/DD/g,strTem);

	strTem = this.getHours().toString();
	sResult = sResult.replace(/hh/g,strTem);
	if (strTem.length<2) strTem='0'+strTem;
	sResult = sResult.replace(/HH/g,strTem);

	strTem = this.getMinutes().toString();
	sResult = sResult.replace(/mi/g,strTem);
	if (strTem.length<2) strTem='0'+strTem;
	sResult = sResult.replace(/MI/g,strTem);

	strTem = this.getSeconds().toString();
	sResult = sResult.replace(/ss/g,strTem);
	if (strTem.length<2) strTem='0'+strTem;
	sResult = sResult.replace(/SS/g,strTem);

	strTem = ["日", "一", "二","三","四", "五","六"][this.getDay()];
	sResult = sResult.replace(/ww/g,strTem);
	strTem = ["星期日", "星期一", "星期二","星期","星期四", "星期五","星期六"][this.getDay()];
	sResult = sResult.replace(/WW/g,strTem);

	return sResult;
}

function GetFormatDateTimeToSolr(flag,beginflag)
{
	var d,dt;
	var m,y,days;
	var strDate;
	var formatDate;
	var strtime;
	if(beginflag)
	{
		if(beginflag=="start"){
			strtime=" 00:00:00";
		}
		if(beginflag=="end")
		{
			strtime=" 23:59:59";
		}
		if(beginflag=="current")
		{
			var hour   = (new Date().getHours() <10)? ("0"+ new Date().getHours()) :new Date().getHours(); 
			var minute = (new Date().getMinutes() <10)? ("0"+ new Date().getMinutes()) :new Date().getMinutes();  
			var second = (new Date().getSeconds() <10)? ("0"+ new Date().getSeconds()) :new Date().getSeconds();
			strtime=" "+hour+":"+minute+":"+second;
		}
	}
	if(flag)
	{
		if(flag=="today")
		{
			d=new Date();
			y=d.getFullYear();
			m=(d.getMonth()+1);
			if(m<10){m="0"+m;}
			days=(d.getDate());
			if(days<10){days="0"+days;}
			strDate=y+"-"+m+"-"+days+strtime;
			formatDate=d.formatToSolr(strDate);
		}
		else if(flag=="tomorrow")
		{
			d=new Date();
			y=d.getFullYear();
			m=(d.getMonth()+1);
			if(m<10){m="0"+m;}
			days=(d.getDate()+1);
			if(days<10){days="0"+days;}
			strDate=y+"-"+m+"-"+days+strtime;
			formatDate=d.formatToSolr(strDate);
		}
		else if(flag=="thisweek")
		{
			d=new Date();
			var iday=d.getDay(); //获得周几
			if(iday==0){iday=7;}
			d.setDate(d.getDate()+(1-iday)) //获取周一
			if(beginflag=="start"){
				days=(d.getDate());
			}else if(beginflag=="end"){
				d.setDate(d.getDate()+6);  //获取周日
				days=(d.getDate());
			}
			y=d.getFullYear();
			m=(d.getMonth()+1);
			if(m<10){m="0"+m;}
			if(days<10){days="0"+days;}
			strDate=y+"-"+m+"-"+days+strtime;
			formatDate=d.formatToSolr(strDate);
		}
		else if(flag=="nextweek")
		{
			var dt=new Date();
			var iday=dt.getDay(); //获得周几
			if(iday==0){iday=7;}
			dt.setDate(dt.getDate()+(8-iday)) //获取下周周一
			if(beginflag=="start"){
				days=(dt.getDate());
			}else if(beginflag=="end"){
				dt.setDate(dt.getDate()+6);  //获取下周的周日
				days=(dt.getDate());
			}
			y=dt.getFullYear();
			m=(dt.getMonth()+1);
			if(m<10){m="0"+m;}
			if(days<10){days="0"+days;}
			strDate=y+"-"+m+"-"+days+strtime;
			formatDate=dt.formatToSolr(strDate);
		}	
	}
	return formatDate;
}

//获取星期
function dataToweek(date){
	
	var arys=date.split('-');    
	var weekday=new Date(arys[0],parseInt(arys[1]-1),arys[2]).getDay(); 
	var weekArray = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六");
	return weekArray[weekday];
}

/**处理时间函数【end】*/

/**对cookie进行处理【begin】*/

//获取cookie值
function getCookie(name) 
{
   var bikky = document.cookie;
   name += "=";
   var i = 0; 
   while (i < bikky.length) 
   {
     var offset = i + name.length;
     if (bikky.substring(i, offset) == name) 
     { 
       var endstr = bikky.indexOf(";", offset); 
       if (endstr == -1) endstr = bikky.length;
         return unescape(bikky.substring(offset, endstr)); 
     }
       i = bikky.indexOf(" ", i) + 1; 
       if (i == 0) break; 
   }
   return null; 
 }
 
//设置cookie
function setCookie(name,value)
{
	var today = new Date();
	var expires = new Date();
	expires.setTime(today.getTime() + 1000*60*60*24*365);
	document.cookie = name + "=" + escape(value) + "; path=/; domain=.sgcc.com.cn; expires=" + expires.toGMTString();
}

//删除cookie
function delCookie(name)
{
	var today = new Date();
	var expires = new Date();
	expires.setTime(today.getTime() - 1);
	document.cookie = name + "=0; path=/; domain=.sgcc.com.cn; expires=" + expires.toGMTString();
}

/**对cookie进行处理【end】*/

/*
//打开公共资源
function funOpenAttach(serverDomain, nginxCode ,serverName,docDatabase,docId){
	var url = "http://" + serverDomain + "/" + nginxCode + "/coa/src/core/common.nsf/DominoService?openagent&action=GetAttachUrl";
	url += "&servername="+serverName+"&dbpath="+docDatabase+"&docId="+docId;
	jQuery.ajax({
		type : "get",
		url : url,
		async : false,
		dataType : "jsonp",
		jsonpCallback : "callback",
		cache : false,
		error : function(xhr, status, errorThrown) {
			//alert("获取附件地址异常，请联系管理员！");
			openDominoDoc(serverDomain, nginxCode, serverName, docDatabase, docId);
		},
		success : function(json) {
			if(json && json.AttachUrl){
				if(jQuery('#Word').length==0){
					var licenUrl = "http://" + serverDomain + "/"+ nginxCode +"/coa/cfg/licensenew.nsf/GetLicenseInfo";
					jQuery('body').append("<input id='LicenseURL' name='LicenseURL' type='hidden' value='"+licenUrl+"'/>");
					jQuery('body').append("<div style='display:none'><OBJECT ID='Word'"+json.ControlWordCode+"></OBJECT></div>");
				}
				var Word = jQuery('#Word')[0];
				var atturl = "http://" + serverDomain + json.AttachUrl;
				var file = Word.DownloadFile(atturl);
				Word.LaunchFile(file);
			}else{
				openDominoDoc(serverDomain, nginxCode, serverName, docDatabase, docId);
			}
		}
	});
}
//首页信息刊物直接打开版式文件
function openPublicationAtt(ServerDomain,NginxCode,UNID,Dbpath){
    var url = "http://"+ServerDomain+"/"+NginxCode+"/coa/src/info.nsf/FormRedirectToOpenAttachment?OpenForm&DocId="+UNID+"&DocDatabase="+Dbpath;
    jsfw.$('body').append("<div id=PublicationInfo style=display:none><iframe width=10 height=10 src='"+url+"' ></iframe></div>");
}
//获取Domino的地址并打开
function openDominoDoc(serverDomain, nginxCode, serverName, docDatabase, docId) {
	var url = "http://" + serverDomain + "/" + nginxCode + "/coa/src/core/common.nsf/OpenDominoDoc?OpenAgent&ServerName=" + serverName + "&DocDatabase=" + docDatabase + "&DocId=" + docId;
	jQuery.ajax({
		type : "get",
		url : url,
		async : false,
		dataType : "jsonp",
		jsonpCallback : "callback",
		cache : false,
		error : function(xhr, status, errorThrown) {
			alert("打开文档异常，请与管理员联系！");
		},
		success : function(json) {
			var dominoUrl = json.DominoUrl;
			if(dominoUrl==""){alert("打开文档异常，请与管理员联系！");return false;}
			var width = screen.availWidth - 10;
			var height = screen.availHeight - 55;
			var left = 0;
			var top = 0;
			var newWindow = window.open(dominoUrl, '', 'resizable=1,scrollbars=0,status=yes,toolbar=no,channelmode=0,directories=0,menubar=0,location=0,left=' + left + ' top=' + top + ' width=' + width + ' height=' + height, false);
			newWindow.focus();
		}
	});
}
 */


/** SSO加密解密【BEGIN】****/

function AsciiToUnicode(content) {  
	var result = '';      
	for (var i=0; i<content.length; i++){
	    result+='&#' + content.charCodeAt(i)+ ';';  
	}  
	return result;
 } 
  
 function UnicodeToAscii(content) {   
	var code = content.match(/&#(\d+);/g);  
	result= '';  
	for (var i=0; i<code.length; i++){
		result += String.fromCharCode(code[i].replace(/[&#;]/g, ''));  
	}
	return  result; 
 }
	   	   
function encrycode(text){
	var codeResult = '';
	var code = AsciiToUnicode(text);
	var array = code.split(";");
	array.reverse();
	
	for(var i = 1; i < array.length ; i++ ){
		var ecode = (array[i].replace(/[&#;]/g, ''))*2+6
		codeResult+=ecode+'-';
	}
	return codeResult.substring(0,codeResult.length-1);
}

function decrycode(text){
	var darray = new Array;
	var codeResult = '';
	if(text!=null&&text!=''){
		var array = text.split("-");
		for(var i = 0; i < array.length ; i++ ){
			var code =((parseInt(array[array.length-1-i]))-6)/2 ;
			codeResult+="&#"+code+";";
		}
		return UnicodeToAscii(codeResult);
	}
	return '';
	
}

/** SSO加密解密【END】****/

/*********单点到电子文件************/
function toErmsUrl(){
	var forms = document.createElement("form");
	var user_code = getCookie("login_user_code");
	var user_pwd  =decrycode(getCookie(user_code));
	
	document.body.appendChild(forms);
	var input1 = document.createElement("input");
	input1.type = "hidden";
	input1.value = user_code;
	input1.name = "code";
	forms.appendChild(input1);
	
	var input2 = document.createElement("input");
	input2.type = "hidden";
	input2.value = user_pwd;
	input2.name = "password";
	forms.appendChild(input2);
	
	forms.action = "http://erms.sgcc.com.cn:8001/erms/servlet/LoginController?method=login&logintype=xtbg";
	forms.method = "post" ;
	forms.submit();
}

function toMonitorUrl(){
	//setCookie("loginSys_CK","yj");
	var murl = window.location.href ;
	murl = murl.substring(0,murl.indexOf("?")) +"?comid=monitorPage";
	window.location.href = jsfw.xssFilter(murl);
}

function toOaUrl(){
	//delCookie("loginSys_CK");
	var murl = window.location.href ;
	murl = murl.substring(0,murl.indexOf("?")) +"?comid=oaScheme";
	window.location.href = jsfw.xssFilter(murl);
}