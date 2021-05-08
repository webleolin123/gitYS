jsfw.WebUI.OutLookMenu = function (oDiv){
	if (!jsfw.WebUI.Action) jsfw.Import("WebUI.Action");

	var sBig=oDiv.getAttribute('Small');
	if (sBig) sBig=sBig.toLowerCase();
	if (sBig && ((sBig=='1') || (sBig=='true'))){ sBig=''; }else{ sBig='_B'; }

	var itemCount=0; //总个数
	var oList=oDiv.childNodes;
	for (var i=0; i<oList.length; i++) if (oList[i].nodeName=='FIELDSET') itemCount++;

	var oTable=document.createElement('table');
	oTable.insertRow(-1).insertCell(0).innerHTML='1';
	oTable.insertRow(-1).insertCell(0);
	oTable.insertRow(-1).insertCell(0);
	for (var i=0; i<itemCount; i++) oTable.insertRow(-1).insertCell(0);
	oTable.insertRow(-1).insertCell(0);

	//ListItem-----
	var intDefault=0;
	var intTem=3;
	var strTem='';
	var oBottom=oTable.rows[oTable.rows.length-1].cells[0];
	for (var i=0; i<oList.length; i++)
		if (oList[i].nodeName=='FIELDSET')	oTable.rows[1].cells[0].appendChild(oList[i]);
	oList=oTable.rows[1].cells[0].childNodes;
	for (var i=0; i<oList.length; i++) {
		if (oList[i].nodeName=='FIELDSET') {
			var temObj=oList[i].getElementsByTagName('legend')[0];
			//oList[i].style.display='none';
			oTable.rows[intTem].cells[0].className='OutLookMenu_List_Item' + sBig;
			oTable.rows[intTem].cells[0].innerHTML=temObj.innerHTML;
			if (oList[i].getAttribute('default')=='true') intDefault=intTem-3;
			oList[i].className='OutLookMenu_Content_Item';
			strTem+='<table class="OutLookMenu_Bottom_Item'+sBig+'" title="'+temObj.innerText+'" onclick="this.parentNode.parentNode.parentNode.parentNode.parentNode.selectGroup('+(intTem-3)+');jsfw.WebUI.Action.Fly(this,this.parentNode.parentNode.parentNode.rows[1].cells[0]);" border="0" cellpadding="0" cellspacing="0"><tr><td align="center">';
			if (temObj.getElementsByTagName('img').length==0){
				strTem+= '<img src="' + jsfw.Path + 'Themes/' + jsfw.Theme + '/OutLookMenu/DefIcon.gif">';
			}else{
				strTem+= '<img src="' + temObj.getElementsByTagName('img')[0].src + '">';
			}
			strTem+= '</td></tr></table>';
			intTem++;
		}
	}
	for (var i=0; i<oList.length; i++) {
		if (oList[i].nodeName=='FIELDSET')	{
			oList[i].removeChild(oList[i].getElementsByTagName('legend')[0]);
			oList[i].style.display='none';
		}
	}
	oBottom.innerHTML= strTem;
	//Title-----
	oTable.rows[0].cells[0].className='OutLookMenu_Title';
	//Content-----
	oTable.rows[1].cells[0].className='OutLookMenu_Content';
	//Split-----
	oTable.rows[2].cells[0].className='OutLookMenu_Split';
	oTable.rows[2].cells[0].innerHTML = '<img src="' + jsfw.Path + 'Themes/' + jsfw.Theme + '/OutLookMenu/Resize_Dot.gif" />';
	//Bottom-----
	oTable.rows[oTable.rows.length-1].cells[0].className='OutLookMenu_Bottom' + sBig;


	oTable.cellPadding = 0;
	oTable.cellSpacing = 0;
	oTable.border = 0;
	oTable.style.height = '100%';
	oTable.style.width = '100%';
	oTable.style.tableLayout = 'fixed';

	//alert(strTem);
	for (var i=3; i<oTable.rows.length-1; i++){
		oTable.rows[i].cells[0].onmouseover = function (){
			if (this.className!='OutLookMenu_List_Item_Sel'+sBig) this.className = 'OutLookMenu_List_Item_Over'+sBig;
		}
		oTable.rows[i].cells[0].onmouseout = function (){
			if (this.className!='OutLookMenu_List_Item_Sel'+sBig) this.className = 'OutLookMenu_List_Item'+sBig;
		}
		oTable.rows[i].cells[0].onclick = function (){
			if (this.className!='OutLookMenu_List_Item_Sel'+sBig) this.className = 'OutLookMenu_List_Item'+sBig;
		}
		oTable.rows[i].cells[0].onclick = new Function('this.parentNode.parentNode.parentNode.parentNode.selectGroup('+(i-3)+'); jsfw.WebUI.Action.Fly(this,this.parentNode.parentNode.parentNode.rows[1].cells[0]);');
	}

	oDiv.selectGroup = function (idx){
		var objs=oBottom.childNodes;
		intTem=0;
		for (var i=0; i<objs.length; i++){
			if (objs[i].nodeName=='TABLE')	{
				objs[i].className = 'OutLookMenu_Bottom_Item' + (intTem==idx?'_Sel':'')+sBig;
				intTem++;
			}	
		}
		for (var i=0; i<oList.length; i++) oList[i].style.display='none';
		intTem=0;
		for (var i=0; i<oList.length; i++) {
			if (oList[i].nodeName=='FIELDSET') {
				oTable.rows[intTem+3].cells[0].className = 'OutLookMenu_List_Item' + (intTem==idx?'_Sel':'')+sBig;
				if (intTem==idx){
					oTable.rows[0].cells[0].innerHTML = oTable.rows[intTem+3].cells[0].innerHTML;
					oList[i].style.display='';
					if (oList[i].getAttribute('onshow')) eval(oList[i].getAttribute('onshow'));
					if (!oList[i].loaded){
						if (oList[i].getAttribute('url') && (oList[i].getAttribute('url')!='')){
							var iframe_id='divIFrame_OutlookMenu_'+parseInt(Math.random()*10000000).toString();
							oList[i].innerHTML = '<iframe name="' + iframe_id + '" src="'+oList[i].getAttribute('url')+'" style="width:100%;height:100%;" frameborder="0"></iframe>';
							oList[i].style.overflow='hidden';
							oList[i].iframe_id = iframe_id;
						}
						if (oList[i].getAttribute('ajax') && (oList[i].getAttribute('ajax')!='')){
							jsfw.Ajax.loadHttpToObj(oList[i].getAttribute('ajax'),oList[i]);
						}
						oList[i].loaded = true;
					}
				}
				intTem++;
			}
		}
	}

	oDiv.selectGroupByTitle = function (sTitle){
		if (typeof(sTitle)!='string') return;
		var intTem=0;
		for (var i=0; i<oList.length; i++){ 
			if (oList[i].nodeName=='FIELDSET') {
				if (sTitle.replace(/(^\s+)|(\s+$)/g,'')==oList[i].innerText.replace(/(^\s+)|(\s+$)/g,'')){
					oDiv.selectGroup(intTem);
					return;
				}
				intTem++;
			}
		}
	}

	oDiv.getIFrame = function(sParam){
		var iframe_id='';
		var intTem=0;
		if (typeof(sParam)=='number'){
			for (var i=0; i<oList.length; i++){ 
				if (oList[i].nodeName=='FIELDSET') {
					if (intTem==sParam){
						iframe_id = oList[i].iframe_id;
						break;
					}
					intTem++;
				}
			}
		}else{
			for (var i=0; i<oList.length; i++){ 
				if (oList[i].nodeName=='FIELDSET') {
					if (sTitle.replace(/(^\s+)|(\s+$)/g,'')==oList[i].innerText.replace(/(^\s+)|(\s+$)/g,'')){
						iframe_id = oList[i].iframe_id;
						break;
					}
					intTem++;
				}
			}
		}
		return document.frames[iframe_id];
	}

	//--设置显示几个按钮--
	oDiv.intShowCount = -1;//--当前显示按钮数--
	oDiv.showCount = function (iCount){
		if (iCount>itemCount) iCount=itemCount;
		if (iCount<-1) iCount=-1;
		oDiv.intShowCount = iCount;
		for (var i=0; i<itemCount; i++){
			oTable.rows[i+3].style.display = (i<iCount)?'':'none';
			oBottom.getElementsByTagName('table')[i].style.display = (i<iCount)?'none':'';
		}
		oTable.rows[oTable.rows.length-1].style.display = (oDiv.intShowCount==itemCount)?'none':'';
	}
	//--拖动改变显示个数--
	var bMouseDown=false;
	var chaTop;
	var iShowCount_Save;//--保存当前显示的个数--
	var itemHeight;
	var oSplit=oTable.rows[2].cells[0];
	oSplit.onmousedown = function (e){
		e = e || event;
		chaTop = (e.clientY||0);
		iShowCount_Save = (oDiv.intShowCount==-1)?intCount:oDiv.intShowCount;//--保存当前显示的个数--
		itemHeight=oTable.rows[3].cells[0].offsetHeight;
		if (itemHeight==0) itemHeight=oTable.rows[oTable.rows.length-1].cells[0].offsetHeight;

		bMouseDown=true;
		oSplit.setCapture();
		document.onselectstart = function(){return false;};
		document.onmousemove = function (e){
			e = e || event;
			var intTem = iShowCount_Save - parseInt((e.clientY-chaTop)/itemHeight);
			if (intTem<0) intTem=0;
			//top.document.title=iShowCount_Save.toString() + '__' + (itemHeight).toString();
			oDiv.showCount(intTem);
		};
		document.onmouseup   = function (){
			oSplit.releaseCapture();
			document.onmousemove = document.onmouseup = document.onselectstart = null;
			if (oDiv.getAttribute('onChangeShowItem')){
				eval(oDiv.getAttribute('onChangeShowItem'));
			}
		};
	}

	oDiv.appendChild(oTable);

	try{
		oDiv.selectGroup(intDefault);
	}catch (e){}
	
	if (oDiv.getAttribute('showItem')){
		oDiv.showCount(parseInt(oDiv.getAttribute('showItem')));
	}else{
		oDiv.showCount(100);
	}

	//--清除内存--
	if (window.attachEvent) window.attachEvent('onunload', function (){
		for (var i=3; i<oTable.rows.length-1; i++){
			oTable.rows[i].cells[0].onclick=null;
			oTable.rows[i].cells[0].onmouseover = null;
			oTable.rows[i].cells[0].onmouseout = null;
		}
		oDiv.selectGroup = null;
		oDiv.selectGroupByTitle = null;
		oDiv.getIFrame = null;
		oSplit.onmousedown = null;
		oDiv.removeChild(oTable);
	});	

};

jsfw.WebUI.OutLookMenu.TagName = 'div';

//--引用样式文件--
(
	function (){
		var head = document.getElementsByTagName('head')[0];
		var link = document.createElement('link');
		link.rel = 'stylesheet';
		link.href = jsfw.Path + 'Themes/' + jsfw.Theme + '/OutLookMenu/css.css';
		link.type = 'text/css';
		link.media = 'all';
		head.appendChild(link);
	}
)();