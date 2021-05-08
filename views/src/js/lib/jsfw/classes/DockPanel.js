/*******************************************\
  面板类(2007-03-27) 
	Author:Witson
\*******************************************/
if (!jsfw.Class.Ajax) jsfw.Import("Ajax");
jsfw.Class.DockPanel = function (aDiv,aData){
	var me = this;
	var oPar = typeof(aDiv)=="string" ? document.getElementById(aDiv) : aDiv;
	this.Ajax=null;
//	var bPreLoad=true;
	if (oPar.className=='') oPar.className='jsfw_DockPanels';
	oPar.innerHTML='';
	var oFrame=null;
	var timClick;
	var bMouseDown=false;

	function GroupItem(sTitle, sIcon, bExpand, iHeight, iWidth, sContent_url, oContent_object, sContent_ajax, sContent_html, sContent_url_frmName){
		this.title=sTitle;
		this.icon=(typeof(sIcon)=='string')?sIcon:'';
		this.state = bExpand?'normal':'min';//状态包括 min normal float max
		this.width = (typeof(iWidth)=='number')?iWidth:oPar.offsetWidth;
		this.Oldheight = (typeof(iHeight)=='number')?iHeight:0;
		this.height = (typeof(iHeight)=='number')?iHeight:parseInt(me.height/2);
		this.width = (iWidth>0)?iWidth:oPar.offsetWidth;
		this.height = (iHeight>0)?iHeight:parseInt(me.height/2);

		this.content_url=(typeof(sContent_url)=='string')?sContent_url:'';
		this.content_url_frmName=(typeof(sContent_url_frmName)=='string')?sContent_url_frmName:'';

		this.content_object=(typeof(oContent_object)=='object')?oContent_object:null;
		this.content_ajax=(typeof(sContent_ajax)=='string')?sContent_ajax:'';
		this.content_html=(typeof(sContent_html)=='string')?sContent_html:'';

		this.loaded=false;

		this.oTab=null;
		this.oTitle=null;
		this.oContent=null;
		this.oSysBtn=null;	//系统按钮组
		this.oBtnUpDown=null;	//展开收起
		this.oBtnFloat=null;	//浮动
		this.oBtnMax=null;	//最大化/还原
		this.oBtnClose=null;	//关闭
		this.loadContent = function(){
			this.loaded=true;
			if (this.content_url!=''){
				if (this.content_url_frmName==''){
					this.oContent.innerHTML = '<iframe src="' + this.content_url + '" style="width:100%;height:100%;" frameborder="0"></iframe>';
				}else{
					this.oContent.innerHTML = '<iframe name="'+this.content_url_frmName+'" src="' + this.content_url + '" style="width:100%;height:100%;" frameborder="0"></iframe>';
				}
				return;
			}
			if (this.content_ajax!=''){
				this.oContent.innerHTML = '正在载入...';
				if (me.Ajax==null) me.Ajax = new jsfw.Class.Ajax();
				me.Ajax.loadHttp(this.content_ajax, true, function(r,o){o.innerHTML=r.responseText;},this.oContent);
				return;
			}
			if (this.content_html!=''){
				this.oContent.innerHTML = this.content_html;
				return;
			}
		}
	}
	GroupItem.prototype.upDown = function(bUp){
		if ((this.state=='float')||(this.state=='max')) return;
		if (typeof(bUp)!='boolean') bUp=(this.state=='normal');
		this.oTab.rows[1].style.display = bUp?'none':'';
		this.oBtnUpDown.src = jsfw.Path + 'Themes/' + jsfw.Theme + '/DockPanel/' + (bUp?'Down':'Up') + '.gif';
		this.state = (bUp?'min':'normal');
		me.resizeGroup();
	}

	GroupItem.prototype.dock = function(bDock){
		if (typeof(bDock)!='boolean') bDock=((this.state==('float'))||(this.state==('max')));
		this.oTab.className = bDock?'jsfw_DockPanel':'jsfw_DockPanel_Float';
		this.oTab.style.position = bDock?'static':'absolute';
		if (bDock){
			this.oTab.style.width='100%';
		}else{
			this.upDown(false);
			this.oTab.style.top=this.top;
			this.oTab.style.left=this.left;
			if (this.oTab.offsetTop<document.body.scrollTop) this.oTab.style.top=document.body.scrollTop + parseInt(this.top);
			if (this.oTab.offsetLeft<document.body.scrollLeft) this.oTab.style.left=document.body.scrollLeft + parseInt(this.left);
			this.oTab.style.width=this.width;
			this.oContent.style.height=this.height-this.oTitle.offsetHeight;
			if (parseInt(this.oTab.style.left)<0) {this.oTab.style.left=0;this.oTab.left=0;}
			if (parseInt(this.oTab.style.top)<0) {this.oTab.style.top=0;this.oTab.top=0;}
			if (document.body.scroll=='no'){
				if (parseInt(this.oTab.style.left)>(document.body.clientWidth-50)) {
					this.oTab.style.left=(document.body.clientWidth-50);
					this.oTab.left=(document.body.clientWidth-50);
				}
				if (parseInt(this.oTab.style.top)>(document.body.clientHeight-40)) {
					this.oTab.style.top=(document.body.clientHeight-40);
					this.oTab.top=(document.body.clientHeight-40);
				}
			}
			this.oBtnMax.src = jsfw.Path + 'Themes/' + jsfw.Theme + '/DockPanel/Max.gif';
		}
		this.oBtnUpDown.style.display = bDock?'':'none';
		this.oBtnFloat.style.display = bDock?'':'none';
		this.oBtnMax.style.display = bDock?'none':'';
		this.oBtnClose.style.display = bDock?'none':'';
		this.state = (bDock?'normal':'float');
		me.resizeGroup();
		for (var i=(me.group.length-1);i>=0;i--){
			if (me.group[i].state=='min'){
				me.group[i].upDown();
				me.group[i].upDown();
				break;
			}
		}
	}
	GroupItem.prototype.max = function(bMax){
		if ((this.state=='normal')||(this.state=='min')) return;
		if (typeof(bMax)!='boolean') bMax=(this.state!=('max'));
		this.oTab.style.left = bMax?document.body.scrollLeft:this.left;
		this.oTab.style.top = bMax?document.body.scrollTop:this.top;
		this.oTab.style.width = bMax?document.body.clientWidth:this.width;
		if (bMax){
			this.oContent.style.height=document.body.clientHeight-this.oTitle.offsetHeight-1;
		}else{
			this.oContent.style.height=this.height-this.oTitle.offsetHeight;
		}
		this.oBtnMax.src = jsfw.Path + 'Themes/' + jsfw.Theme + '/DockPanel/' + (bMax?'Normal':'Max') + '.gif';
		this.state = (bMax?'max':'float');
	}
	GroupItem.prototype.startDrag = function(eX,eY){
		var temObj=this;
		bMouseDown=false;
		clearTimeout(timClick);
		oFrame.style.display='';
		oFrame.style.left=eX+document.body.scrollLeft;
		oFrame.style.top=eY+document.body.scrollTop;
		oFrame.style.width=this.oTab.offsetWidth;
		oFrame.style.height=this.oTab.offsetHeight;
//		oFrame.setCapture();
		if(oFrame.setCapture)
			oFrame.setCapture();
		else if(window.captureEvents)
			window.captureEvents(Event.MOUSEMOVE|Event.MOUSEUP);
		document.onmousemove = function(){temObj.Drag();}
		document.onmouseup   = function(){temObj.Drop();}
	}
	GroupItem.prototype.Drag = function(e){
		bMouseDown=false;
		clearTimeout(timClick);
		e = e || event;
		oFrame.style.left = (e.clientX-this.chaLeft+document.body.scrollLeft) + "px";
		oFrame.style.top = (e.clientY-this.chaTop+document.body.scrollTop) + "px";
	}
	GroupItem.prototype.Drop = function(){
//		oFrame.releaseCapture();
		if(oFrame.releaseCapture)
			oFrame.releaseCapture();
		else if(window.captureEvents)
			window.captureEvents(Event.MOUSEMOVE|Event.MOUSEUP);
		oFrame.style.display='none';
		document.onmousemove = document.onmouseup = document.onselectstart = null;
		this.left=oFrame.style.left;
		this.top =oFrame.style.top;
		this.dock(false);
	}

	this.group = new Array();

	this.height = oPar.offsetHeight-1;
	if (this.height==0) this.height=400;
	//alert(this.height);
	this.setHeight=function(value){
		this.height=value-1;
		oPar.style.height=this.height;
		me.resizeGroup();
	}

	this.delGroup=function(){
		oPar.innerHTML='';
		me.group.length=0;
	}

	this.addGroup=function(sTitle, sIcon, bExpand, iHeight, iWidth, sContent_url, oContent_object, sContent_ajax, sContent_html, sContent_url_frmName){
		var curGroup;
		var curIdx=0;
		if (typeof(sTitle)=='number'){
			curGroup = me.group[sTitle];
			curIdx = sTitle;
		}else{
			me.group[me.group.length]=new GroupItem(sTitle, sIcon, bExpand, iHeight, iWidth, sContent_url, oContent_object, sContent_ajax, sContent_html, sContent_url_frmName);
			curGroup = me.group[me.group.length-1];
			curIdx = me.group.length-1;
		}
		curGroup.oTab = document.createElement('table');
		curGroup.oTab.className='jsfw_DockPanel';
		curGroup.oTab.cellPadding=0; curGroup.oTab.cellSpacing=0; curGroup.oTab.width='100%';
		curGroup.oTab.border=0;

		//var temTD = curGroup.oTab.insertRow(0).insertCell(0);
		curGroup.oContent = document.createElement('div')
		curGroup.oContent.style.overflow='auto';
		curGroup.oContent.style.width='100%'; //curGroup.oContent.style.height='100%';
		//curGroup.oTab.insertRow(1).insertCell(0).appendChild(curGroup.oContent);
		for (var i=0; i<3; i++){
			var temTR = curGroup.oTab.insertRow(i);;
			for (var j=0; j<3; j++)	{
				var temTD=temTR.insertCell(j);
				temTD.innerHTML = '';
				temTD.className = 'jsfw_DockPanel_TD_'+i.toString()+'_'+j.toString();
			}
		}
		curGroup.oTab.rows[0].cells[1].innerHTML='';
		curGroup.oTab.rows[1].cells[1].innerHTML='';
		curGroup.oTab.rows[1].cells[1].appendChild(curGroup.oContent);
		var temTD = curGroup.oTab.rows[0].cells[1];

		oPar.appendChild(curGroup.oTab);
		var temTab = document.createElement('table');
		temTab.cellPadding=0; temTab.cellSpacing=0; temTab.width='100%';
		temTab.border=0;
		temTD.appendChild(temTab);
		temTR = temTab.insertRow(0);
		curGroup.oTitle = temTR.insertCell(0);
		curGroup.oSysBtn = temTR.insertCell(1);
		curGroup.oTitle.className = 'jsfw_DockPanel_Title';
		curGroup.oSysBtn.className = 'jsfw_DockPanel_SysBtn';

		curGroup.oBtnUpDown = document.createElement('img');	//展开收起
		curGroup.oBtnUpDown.src = jsfw.Path + 'Themes/' + jsfw.Theme + '/DockPanel/Up.gif';
		curGroup.oSysBtn.appendChild(curGroup.oBtnUpDown);

		curGroup.oBtnFloat = document.createElement('img');	//浮动
		curGroup.oBtnFloat.src = jsfw.Path + 'Themes/' + jsfw.Theme + '/DockPanel/Float.gif';
		//curGroup.oSysBtn.appendChild(curGroup.oBtnFloat);			///////////////NoDrag

		curGroup.oBtnMax = document.createElement('img');	//最大化/还原
		curGroup.oBtnMax.src = jsfw.Path + 'Themes/' + jsfw.Theme + '/DockPanel/Max.gif';
		curGroup.oBtnMax.style.display='none';
		curGroup.oSysBtn.appendChild(curGroup.oBtnMax);

		curGroup.oBtnClose = document.createElement('img');	//关闭
		curGroup.oBtnClose.src = jsfw.Path + 'Themes/' + jsfw.Theme + '/DockPanel/Close.gif';
		curGroup.oBtnClose.style.display='none';
		curGroup.oSysBtn.appendChild(curGroup.oBtnClose);
		
		if (curGroup.icon!=''){
			curGroup.oTitle.innerHTML = '<img src="'+curGroup.icon+'" align="absbottom"> ' + curGroup.title;
		}else{
			curGroup.oTitle.innerHTML = curGroup.title;
		}

		if (curGroup.content_object!=null){
			curGroup.oContent.appendChild(curGroup.content_object);
			curGroup.content_object.style.display='';
		}
//		if (bPreLoad) 
		curGroup.loadContent();
		me.attachGroupEvent(curGroup);
/*		oDivTitle.onclick = function(){
//			me.selectGroup(curIdx);
		}*/
		me.resizeGroup();
//		if (me.group.length==1) me.selectGroup(0);
	}
	this.resizeGroup=function(){
		if (me.group.length==0) return;
//			this.state = bExpand?'normal':'min';//状态包括 min normal float max
		var iHeight= me.height;
		for (var i=0;i<me.group.length;i++){
			if (me.group[i].oTab==null) return;
			if (me.group[i].state == 'min'){
				me.group[i].oTab.style.width='100%';
				iHeight = iHeight - me.group[i].oTab.offsetHeight;
			}
			if (me.group[i].state == 'normal'){
				me.group[i].oTab.style.width='100%';
			}
		}
		var iCount=0;
		for (var i=0;i<me.group.length;i++)
			if (me.group[i].state == 'normal') iCount++;
//[08-5-6]Begin
		//for (var i=0;i<me.group.length;i++)
		//	if (me.group[i].state == 'normal') me.group[i].oContent.style.height = parseInt(iHeight/iCount)-me.group[i].oTitle.offsetHeight-4;
		if (me.group.length==0) return;
		var temHeight=iHeight-(me.group[0].oTitle.offsetHeight*me.group.length);
		if (temHeight<0) temHeight=1;

		for (var i=0;i<me.group.length;i++){
			if (me.group[i].state == 'normal') {
				if (me.group[i].Oldheight==0){
					me.group[i].oContent.style.height =	temHeight/iCount;
				}else{
					me.group[i].oContent.style.height =	me.group[i].Oldheight-me.group[0].oTitle.offsetHeight;
				}
				//alert(me.group[i].height);
				//me.group[i].oContent.style.height = parseInt(iHeight/iCount)-me.group[i].oTitle.offsetHeight-4;
			}
		}
		var intTem=0;
		for (var i=0;i<me.group.length;i++) intTem += me.group[i].oTab.offsetHeight;
		intTem=iHeight-intTem;
		intTem=parseInt(intTem/iCount);
		for (var i=0;i<me.group.length;i++){
			if (me.group[i].state == 'normal') {
				try{
					me.group[i].oContent.style.height =	parseInt(me.group[i].oContent.style.height)+intTem;	
				}catch(e){}
			}
		}
//[08-5-6]End
		//调整高度
		var intTem=0;
		for (var i=0;i<me.group.length;i++){
			if ((me.group[i].state == 'normal')|(me.group[i].state == 'min')){
				intTem += me.group[i].oTab.offsetHeight;
			}
		}
		if (intTem!=me.height){
			intTem = me.height-intTem;
			for (var i=0;i<me.group.length;i++){
				if (me.group[i].state == 'normal'){
					try{
						me.group[i].oContent.style.height = parseInt(me.group[i].oContent.style.height)+intTem;
					}catch(e){}
					break;
				}
			}
		}
	}

	this.attachGroupEvent=function(aGroup){
/*		this.oTab=null;
		this.oTitle=null;
		this.oContent=null;
		this.oSysBtn=null;	//系统按钮组
		this.oBtnUpDown=null;	//展开收起
		this.oBtnFloat=null;	//浮动
		this.oBtnMax=null;	//最大化/还原
		this.oBtnClose=null;	//关闭*/
		aGroup.left = parseInt((document.body.clientWidth-aGroup.width)/2);
		aGroup.top = parseInt((document.body.clientHeight-aGroup.height)/2);
		if (aGroup.state == 'min'){
			aGroup.upDown(true);
		}
		aGroup.oTitle.onselectstart = function(){return false;};
		aGroup.oTitle.onclick = function(){aGroup.upDown();}
		aGroup.oBtnUpDown.onclick = function(){aGroup.upDown();}
		aGroup.oBtnFloat.onclick = function(){aGroup.dock(false);}
		aGroup.oBtnClose.onclick = function(){aGroup.dock(true);}
		aGroup.oBtnMax.onclick = function(){aGroup.max();}

		aGroup.oTitle.ondblclick = function() {
			if ((aGroup.state=='normal')||(aGroup.state=='min')) return;
			aGroup.max();
		}

		aGroup.oTitle.onmousedown = function(e) {
			return;	///////////////NoDrag
			bMouseDown=true;
			if (aGroup.state=='max')return;
			aGroup.oTab.style.zIndex = ++window._jsfw_Window_zIndex;
			e = e || event;
			clearTimeout(timClick);
			aGroup.chaLeft = (e.offsetX||0)+2;
			aGroup.chaTop = (e.offsetY||0)+2;
			var eX=e.clientX-aGroup.chaLeft;
			var eY=e.clientY-aGroup.chaTop;
			timClick=setTimeout(function(){aGroup.startDrag(eX,eY)},300);
			document.onselectstart = function(){return false;};
		}
		aGroup.oTitle.onmousemove = function(e){
			if (!bMouseDown) return;
			bMouseDown=false;
			if (aGroup.state=='max')return;
			e = e || event;
			clearTimeout(timClick);
			me.chaLeft = (e.offsetX||0)+2;
			me.chaTop = (e.offsetY||0)+2;
			var eX=e.clientX-me.chaLeft;
			var eY=e.clientY-me.chaTop;
			aGroup.startDrag(eX,eY);
		}
		aGroup.oTitle.onmouseup = function(e){
			bMouseDown=false;
			clearTimeout(timClick);
			document.onselectstart = null;
		}
	}


	this.Draw = function(){

		for (var i=0;i<me.group.length;i++){
			me.addGroup(i);
		}
//		this.selectGroup(0);
	}
	
	this.LoadData = function(){
		var nodes=oXML.documentElement.childNodes;
		var iCur=0;
		for (var i = 0; i < nodes.length; i++) {
//	function GroupItem(sTitle, sIcon, bExpand, iHeight, iWidth, sContent_url, oContent_object, sContent_ajax, sContent_html){
			if (nodes[i].tagName=='group'){
				me.group[iCur] = new GroupItem(
					nodes[i].getAttribute('title'),
					nodes[i].getAttribute('icon'),
					nodes[i].getAttribute('expand')!='false',
					nodes[i].getAttribute('height'),
					nodes[i].getAttribute('width'),
					nodes[i].getAttribute('content_url'),
					document.getElementById(nodes[i].getAttribute('content_object')),
					nodes[i].getAttribute('content_ajax'),
					nodes[i].getAttribute('content_html')
				);
				iCur++;
			}
		}

		me.Draw();
	}

	//读取数据
	var oXML;
	if (typeof(aData)=='undefined')aData='';
	if (typeof(aData)=="string"){
		if (aData!=''){
			if (me.Ajax==null) me.Ajax = new jsfw.Class.Ajax();
			me.Ajax.loadXml(aData, true, function(o){oXML=o;me.LoadData()});
		}
	}else{
		oXML=getDomFromXMP(aData);
		me.LoadData();
	}

		oFrame=document.createElement("div");
		oFrame.style.position = "absolute";
		oFrame.style.zIndex = 100000;
		oFrame.style.width=100;//oBar.offsetWidth;
		oFrame.style.height=100;//oBar.offsetHeight;
		oFrame.style.border = '1px dotted red';
		oFrame.innerHTML='<img width="1" height="1"/>';
		oFrame.style.display='none';
		document.body.appendChild(oFrame);

};
(
	function (){
		var head = document.getElementsByTagName("head")[0];
		var link = document.createElement("link");
		link.rel = "stylesheet";
		link.href = jsfw.Path + "Themes/" + jsfw.Theme + "/DockPanel/css.css";
		link.type = "text/css";
		link.media = "all";
		head.appendChild(link);
		if (!window._jsfw_Window_zIndex) window._jsfw_Window_zIndex = 1000;
		if (!window._jsfw_Window_currentWindow) window._jsfw_Window_currentWindow = "w";
	}
)();