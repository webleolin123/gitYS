/*******************************************\
  PopupMenu 类(2007-4-5)
	Author:Witson(Witson@163.com)
\*******************************************/
jsfw.Class.PopupMenu = function(aData,oPar){
	var thisMenu = this;
	this.allItems = [];	//所有节点
	this.root = null; //根
	this.newItemID=1; //新节点ID
	this.timHideMenu=null;
	this.timShowMenu=null;
	this.curSubMenu =null;
	var popupSubMenuX=-1;
	var popupSubMenuY=-1;

	function MenuItem(sText,sID,sAction,sIcon,bEnable,bVisible,bChecked,sExInfo,bShowText){//bShowText为内部变量，仅供Toolbar使用
		thisMenu.allItems[thisMenu.allItems.length]=this;
		this.text=sText;
		this.id=sID;
		this.parent=null;
		this.action =  (typeof(sAction)=='string')?sAction:'';
		this.icon = (typeof(sIcon)=='string')?sIcon:'';
		this.icon = this.icon.replace(/\$jsfwPath\//img,jsfw.Path);
		this.enable=(typeof(bEnable)=='boolean')?bEnable:true;
		this.visible=(typeof(bVisible)=='boolean')?bVisible:true;
		this.checked=(typeof(bChecked)=='boolean')?bChecked:false;
		this.exInfo =  (typeof(sExInfo)=='string')?sExInfo:'';
		this.showText=(typeof(bShowText)=='boolean')?bShowText:((this.id=='')?true:thisMenu.root.showText); //内部变量，仅供Toolbar使用
		this.showText=(this.icon=='')?true:this.showText;
		//私有变量
		this.children = new Array(); //子节点
		this.isFolder = false; //是否为目录
		//this.oIcon=null;	//树前的图标
		//this.oItemTab=null; //节点DIV
		//this.oChildDiv=null; //子节点DIV
		//this.oChildDivIn=null;
		//this.selItem=null;
	};
	MenuItem.prototype.addItem = function (sText,sID,sAction,sIcon,bEnable,bVisible,bChecked,sExInfo,bShowText) {//bShowText为内部变量，仅供Toolbar使用
		if (sID==''){
			sID=thisMenu.newItemID++;
			while(thisMenu.findItem(sID)!=null) sID=thisMenu.newItemID++;
		}else{
			if (thisMenu.findItem(sID)!=null){
				alert('节点ID已经存在，不能重复创建！');
				return null;
			}
		}
		var newItem=new MenuItem(sText,sID,sAction,sIcon,bEnable,bVisible,bChecked,sExInfo,bShowText);
		newItem.parent=this;
		this.children[this.children.length]=newItem;
		this.isFolder=true;
		//newItem.Draw();
		/*if (this.children.length==1) {//唯一子节点
			if (this.parent!=null){
				this.oItemTab.rows[0].cells[2].innerHTML = '<img src="' + jsfw.Path + 'classes/Themes/' + jsfw.Theme + '/_PopupMenu/Arrow_Right.gif">';
			}
		}*/
		return newItem;
	}
	if (!window._jsfw_PopupMenu_zIndex) window._jsfw_PopupMenu_zIndex = 11000;
	//画节点
	MenuItem.prototype.draw = function (){
		
		this.oChildDiv = document.createElement("div");
		this.oChildDiv.setAttribute('unselectable','on');
		this.oChildDiv.className = 'jsfw_PopupMenu';
		this.oChildDiv.innerHTML = '<div class="jsfw_PopupMenuIn"></div>';
		this.oChildDiv.style.display='none';
		this.oChildDiv.style.zIndex = window._jsfw_PopupMenu_zIndex++;

		this.oItemTab = document.createElement("table");
		this.oItemTab.className = (this.text=='')?'jsfw_MenuItem_Split':'jsfw_MenuItem';
		this.oItemTab.insertRow(0);
		this.oItemTab.rows[0].insertCell(0).className='jsfw_MenuItem_left';
		this.oItemTab.rows[0].insertCell(1).className='jsfw_MenuItem_center';
		this.oItemTab.rows[0].insertCell(2).className='jsfw_MenuItem_right';
		this.oItemTab.setAttribute('unselectable','on');
		this.oItemTab.rows[0].cells[0].setAttribute('unselectable','on');
		this.oItemTab.rows[0].cells[1].setAttribute('unselectable','on');
		this.oItemTab.rows[0].cells[2].setAttribute('unselectable','on');
		this.oItemTab.cellPadding=0;
		this.oItemTab.cellSpacing=0;
		this.oItemTab.style.width='100%';
		this.oItemTab.border=0;
		this.oItemTab.menuItem=this;	//关联对象
		this.oItemTab.menu=thisMenu;	//关联对象
		this.oChildDiv.menuItem=this;	//关联对象
		this.oChildDiv.menu=thisMenu;	//关联对象

		strTem='';

		this.oItemTab.rows[0].cells[0].innerHTML = (this.icon=='')?'':'<img src="' + this.icon + '" width="16" height="16">';
		this.oItemTab.rows[0].cells[1].innerHTML = (this.text=='')?'':this.text;
		this.oItemTab.rows[0].cells[2].innerHTML = (this.isFolder)?'<img src="' + jsfw.Path + 'Themes/' + jsfw.Theme + '/PopupMenu/Arrow_Right.gif">':'';

		for (var i=0; i<this.children.length; i++) this.children[i].draw();//递归画子节点

		if (this!=thisMenu.root){
			this.parent.oChildDiv.getElementsByTagName("div")[0].appendChild(this.oItemTab);
			this.oItemTab.onmouseover = function(){this.menuItem.mouseOver(true);}
			this.oItemTab.onmouseout = function(){this.menuItem.mouseOver(false);}
			this.oItemTab.onclick = function(){this.menuItem.click();}
		}//oPar.appendChild(this.oItemTab);
		this.oChildDiv.style.top = Math.random()*500
		//temObj=(this.id=='')?thisMenu.oParIn:this.parent.oChildDivIn;
		//temObj.appendChild(this.oItemTab);
		oPar.appendChild(this.oChildDiv);

		this.oChildDiv.onmouseover = function(){clearTimeout(thisMenu.timHideMenu);}		
		this.oChildDiv.onmouseout = function(){thisMenu.timHideMenu = setTimeout(function(){thisMenu.hide()},500);}

		//this.oChildDiv.appendChild(this.oChildDivIn);
		//this.oIcon=this.oItemTab.getElementsByTagName('img')[0];
		if (!this.enable) this.setEnable(this.enable);
		if (!this.visible) this.setVisible(this.visible);
		if (this.checked) this.setChecked(this.checked);
		//thisMenu.AttachItemEvent(this); //添加事件
	}
	//从XML中载入子节点
	MenuItem.prototype.addXMLItems = function (nodes){
		for (var i = 0; i < nodes.length; i++) {
			if (nodes[i].tagName=='item'){
				var sID=nodes[i].getAttribute('id');
				sID=(sID==null)?'':sID;
				var bShowText=nodes[i].getAttribute('showText');
				bShowText = (bShowText==null)?thisMenu.root.showText:(bShowText!='false');
				var newItem=this.addItem(
					nodes[i].getAttribute('text'),
					sID,
					nodes[i].getAttribute('action'),
					nodes[i].getAttribute('icon'),
					nodes[i].getAttribute('enable')!='false',
					nodes[i].getAttribute('visible')!='false',
					nodes[i].getAttribute('checked')=='true',
					nodes[i].getAttribute('exInfo'),
					bShowText);//showText为内部变量，仅供Toolbar使用
				if (nodes[i].childNodes.length>0)	newItem.addXMLItems(nodes[i].childNodes);
			}
		}
	}
	//设置可用
	MenuItem.prototype.setEnable = function(bEnable){
		this.enable = (typeof(bEnable)=='boolean')?bEnable:(!this.enable);
		this.oItemTab.style.color = this.enable?'':'gray';
		if (/msie/i.test(navigator.userAgent)){
			this.oItemTab.style.filter = this.enable?'':'Gray()';//'Gray() alpha(opacity=60)'
		}else{
			this.oItemTab.style.MozOpacity = this.enable?1:0.5;
			this.oItemTab.style.opacity = this.enable?1:0.5;
		}
		//this.oItemTab.disabled=!this.enable;
		//if (this.oIcon!=null) this.oIcon.style.filter = this.enable?'':'Gray()';
		if (this.afterSetEnable) this.afterSetEnable();
	}
	//设置显示隐藏
	MenuItem.prototype.setVisible = function(bVisible){
		this.visible = (typeof(bVisible)=='boolean')?bVisible:(!this.visible);
		this.oItemTab.style.display = this.visible?'':'none';
		if (this.afterSetVisible) this.afterSetVisible();
	}
	//设置勾选
	MenuItem.prototype.setChecked = function(bChecked){
		this.checked = (typeof(bChecked)=='boolean')?bChecked:(!this.checked);
		this.oItemTab.rows[0].cells[0].className = this.checked?'jsfw_MenuItem_Left_Checked':'jsfw_MenuItem_left';
		if (this.afterSetChecked) this.afterSetChecked();
	}
	//删除节点
	MenuItem.prototype.deleteSelf = function(){
		thisMenu.deleteItem(this);
	}
	//鼠标移入移出
	MenuItem.prototype.mouseOver = function(bOver,temItemTab,iPopupSubMenuX,iPopupSubMenuY){//最后两个参数给Toolbar用
		if (this.text=='') return;
		temItemTab=typeof(temItemTab)=='object'?temItemTab:this.oItemTab;
		for (var i=0; i<this.parent.children.length; i++) 
			if (this.parent.children[i].oItemTab.className=='jsfw_MenuItem_Over')
				this.parent.children[i].oItemTab.className='jsfw_MenuItem';
		if (this.enable) temItemTab.className = bOver?'jsfw_MenuItem_Over':'jsfw_MenuItem';
		oSender=typeof(oSender)=='object'?oSender:temItemTab;
		popupSubMenuX = typeof(iPopupSubMenuX)=='number'?iPopupSubMenuX:-1;
		popupSubMenuY = typeof(iPopupSubMenuY)=='number'?iPopupSubMenuY:-1;
		/*if (this.parent.oItemTab!=null) {
			for (var i=0;i<this.parent.parent.children.length;i++){
				if (this.parent.parent.children[i].text!='') {
					this.parent.parent.children[i].oItemTab.className='jsfw_MenuItem';
					if (this.parent.parent.children[i].popWindowItem) this.parent.parent.children[i].popWindowItem.className='jsfw_MenuItem';
				}
			}
			this.parent.oItemTab.className='jsfw_MenuItem_Over';
			if (this.parent.popWindowItem) this.parent.popWindowItem.className='jsfw_MenuItem_Over';
		}*/
		if (bOver){
			var objP=this.parent;
			while (objP!=null){
				objP.oItemTab.className='jsfw_MenuItem_Over';
				objP=objP.parent;
			}
			thisMenu.curSubMenu = this;
			thisMenu.timShowMenu = setTimeout(function(){thisMenu.curSubMenu.popupSubMenu();},300);
		}
		if (thisMenu.onMouseOverItem) thisMenu.onMouseOverItem(this,bOver);
		/*if (bSelect) {
			this.parent.selItem=this;
			for (var i=0;i<this.parent.children.length;i++){
				if (this.parent.children[i].text!='') {
					this.parent.children[i].oItemTab.className='jsfw_MenuItem';
					if (this.parent.children[i].popWindowItem) this.parent.children[i].popWindowItem.className='jsfw_MenuItem';
				}
			}
			this.oItemTab.className=bSelect?'jsfw_MenuItem_Over':'jsfw_MenuItem';
			if (this.popWindowItem) this.popWindowItem.className=bSelect?'jsfw_MenuItem_Over':'jsfw_MenuItem';
		}
		thisMenu.curSubMenu = this.parent;
		clearTimeout(thisMenu.timShow);
		if (bSelect) thisMenu.timShow=setTimeout(function(){thisMenu.curSubMenu.showSubMenu();},300);*/
	}
	//弹出
	MenuItem.prototype.popup = function(x,y,bCreatePopupWindow){
		var popObj=null;
		var offsetY=0;
		thisMenu.hide();
 		var intX,intY;
		if ((typeof(x)=='number') && (typeof(y)=='number')){
			intX=x; intY=y;
		}else{
			if (typeof(x)=='object'){
				popObj=x;
				intX=jsfw.getAbsoluteLeft(popObj);
				intY=jsfw.getAbsoluteTop(popObj)+popObj.offsetHeight;
				if (typeof(y)=='number') offsetY=y;
			}else{
				e = x || event;
				if (/msie/i.test(navigator.userAgent)){
					intX=e.clientX;
					intY=e.clientY;
				}else{
					intX=e.clientX + document.body.scrollLeft;
					intY=e.clientY + document.body.scrollTop;
				}
			}
		}
		if (thisMenu.onPopup) thisMenu.onPopup();
		if (this.onPopup) this.onPopup();
		if (bCreatePopupWindow && (/msie/i.test(navigator.userAgent))){	//弹出CreatePopupWindow[BEGIN] ,现在只能弹一级
			this.popupWindow=thisMenu.createPopupWindow(window,this,intX,intY);
			return;
		}//弹出CreatePopupWindow[END]
		//thisMenu.root.hideSubMenu();
		this.oChildDiv.style.display='';
		this.oChildDiv.style.left = intX;
		this.oChildDiv.style.top = intY+offsetY;
		if ((this.oChildDiv.offsetWidth+intX)>document.body.clientWidth){
			this.oChildDiv.style.left = intX-this.oChildDiv.offsetWidth;
			if (popObj) this.oChildDiv.style.left = intX-this.oChildDiv.offsetWidth + popObj.offsetWidth;
		}
		if ((this.oChildDiv.offsetHeight+intY+offsetY)>document.body.clientHeight){
			this.oChildDiv.style.top = intY-this.oChildDiv.offsetHeight+offsetY;	
			if (popObj) this.oChildDiv.style.top = intY-this.oChildDiv.offsetHeight - popObj.offsetHeight+offsetY;
		}
		for (var i=0; i<this.children.length; i++) 
			if (this.children[i].oItemTab.className=='jsfw_MenuItem_Over')
				this.children[i].oItemTab.className='jsfw_MenuItem';
		thisMenu.timHideMenu = setTimeout(function(){thisMenu.hide()},1000);
		return;
	}
	//显示子菜单
	MenuItem.prototype.popupSubMenu = function(){
		this.parent.hideSubMenu();
		if (!this.enable) return;
		if (!this.isFolder) return;
		popupSubMenuX = (popupSubMenuX!=-1)?popupSubMenuX:(this.parent.oChildDiv.offsetLeft + this.parent.oChildDiv.offsetWidth - 1);
		popupSubMenuY = (popupSubMenuY!=-1)?popupSubMenuY:(this.parent.oChildDiv.offsetTop + this.oItemTab.offsetTop + 1);
		this.oChildDiv.style.display='';
		this.oChildDiv.style.left = popupSubMenuX;
		this.oChildDiv.style.top = popupSubMenuY;
		if ((this.oChildDiv.offsetWidth+popupSubMenuX)>document.body.clientWidth){
			this.oChildDiv.style.left=popupSubMenuX-this.parent.oChildDiv.offsetWidth-this.oChildDiv.offsetWidth+2;
		}
		for (var i=0; i<this.children.length; i++) 
			if (this.children[i].oItemTab.className=='jsfw_MenuItem_Over')
				this.children[i].oItemTab.className='jsfw_MenuItem';
		/*if (/msie/i.test(navigator.userAgent)){
			for (var i=0;i<this.children.length;i++){
				if (this.children[i].popupWindow) this.children[i].popupWindow.hide();
			}
		}else{
			this.hideSubMenu();
		}
		this.selItem.oItemTab.className='jsfw_MenuItem_Over';
		if (!this.selItem.isFolder) return;
		if (this.onPopup) this.onPopup();
		if (/msie/i.test(navigator.userAgent)){
			this.selItem.popupWindow = thisMenu.createPopupWindow(this.popupWindow.document.parentWindow,this.selItem);
			return;
		}
		this.selItem.oChildDiv.style.display='';
		this.selItem.oChildDiv.style.left = this.oChildDiv.offsetLeft + this.oChildDiv.offsetWidth - 1;
		this.selItem.oChildDiv.style.top = this.oChildDiv.offsetTop + this.selItem.oItemTab.offsetTop + 1;*/
	}	
	//隐藏
	MenuItem.prototype.hide = function(){
		for (var i=0; i<this.children.length; i++) this.children[i].hide();
		try{
			this.oChildDiv.style.display='none';
		}catch(e){}
	}
	//隐藏子菜单
	MenuItem.prototype.hideSubMenu = function(){
		for (var i=0; i<this.children.length; i++) this.children[i].hide();
	}
	//点击
	MenuItem.prototype.click = function(){
		if (!this.enable) return;
		if (this.action!=''){
			thisMenu.hide();
			eval(this.action);
		}
		if (!this.isFolder) thisMenu.hide();
		if (thisMenu.afterItemClick) thisMenu.afterItemClick(this);//运行扩展点击
	}
	MenuItem.prototype.toHTML = function (){
		return this.text;
	};
	////////////////////////////////////////////////////////////////////////////
	//删除节点
	this.deleteItem = function (aItem){
		for (var i=(aItem.children.length-1);i>=0;i--) thisMenu.deleteItem(aItem.children[i]);
		aItem.oChildDiv.menuItem=null;	//关联对象
		aItem.oChildDiv.menu=null;	//关联对象
		aItem.oItemTab.menuItem=null;	//关联对象
		aItem.oItemTab.menu=null;	//关联对象

		aItem.oItemTab.onmouseover = null;
		aItem.oItemTab.onmouseout = null;
		aItem.oItemTab.onclick = null;
		aItem.oChildDiv.onmouseover = null;
		aItem.oChildDiv.onmouseout = null;		
		
		try{
			aItem.oChildDiv.parentNode.removeChild(aItem.oChildDiv);
			aItem.oItemTab.parentNode.removeChild(aItem.oItemTab);
		}catch(e){}

		//从allItems数组中删除
		var objs = thisMenu.allItems;
		for (var i=0; i<objs.length; i++){
			if (objs[i]==aItem){
				objs.splice(i,1);
				break;
			}
		}
		//从Parent的Children数组中删除
		if (aItem.parent!=null){
			objs=aItem.parent.children;
			for (var i=0; i<objs.length; i++){
				if (objs[i]==aItem){
					objs.splice(i,1);
					break;
				}
			}
		}
		
		delete aItem;
		//if (aItem.parent==null) return;	//根节点不允许删除
		//thisMenu.deleteNodeEx(aItem);
	}
	//查找节点
	this.findItem = function(sID){
		if (sID=='') return thisMenu.root;
		for (var i=0;i<thisMenu.allItems.length;i++){
			if (thisMenu.allItems[i].id==sID) return thisMenu.allItems[i];
		}
		return null;
	}
	//弹出
	this.popup = function (x,y,bCreatePopupWindow){
		thisMenu.hide();
		thisMenu.root.popup(x,y,bCreatePopupWindow);
	}
	//隐藏
	this.hide = function(){
		clearTimeout(thisMenu.timHideMenu);
		clearTimeout(thisMenu.timShowMenu);
		thisMenu.root.hide();
		if (thisMenu.afterHide) thisMenu.afterHide();
	}

	//弹出IE的PopupWindow
	this.createPopupWindow = function(oParWin,aItem,x,y){
		var pop=oParWin.createPopup();
		//加载样式
		var head = pop.document.getElementsByTagName("head")[0];
		var link = pop.document.createElement("link");
		link.rel = "stylesheet";
		link.href = jsfw.Path + 'Themes/' + jsfw.Theme + '/PopupMenu/css.css';
		link.type = "text/css";
		link.media = "all";
		head.appendChild(link);
		//设置弹出菜单的内容
		pop.document.body.innerHTML=aItem.oChildDiv.outerHTML;
		var oDiv=pop.document.body.all[0];
		oDiv.style.display='';
		oDiv.style.top = 0;
		oDiv.style.left = 0;
		oDiv.menuItem=aItem;	//关联对象
		oDiv.menu=thisMenu;	//关联对象
		var objs=oDiv.getElementsByTagName('table');
		for (var i=0;i<objs.length;i++) 
			if (objs[i].className=='jsfw_MenuItem_Over') objs[i].className='jsfw_MenuItem';
		pop.show(x,y,150,100,document.body);

		if (typeof(x)!='number'){
			x=oParWin.document.body.all[0].offsetWidth-1;
		}
		if (typeof(y)!='number'){
			var objs=oParWin.document.body.all[0].getElementsByTagName('table');
			for (var i=0;i<objs.length;i++){
				if (objs[i].className=='jsfw_MenuItem_Over'){
					y=objs[i].offsetTop;
					break;
				}
			}
		}
		pop.show(x,y,oDiv.offsetWidth,oDiv.offsetHeight,oParWin.document.body);

		var oTabs=oDiv.getElementsByTagName("table");
		for (var i=0;i<oTabs.length;i++){
			oTabs[i].obj=aItem.children[i];
			//aItem.children[i].popWindowItem=oTabs[i];
			oTabs[i].onmouseover = function(){
				this.obj.mouseOver(true,this);
			}
			oTabs[i].onmouseout = function(){
				this.obj.mouseOver(false,this);
			}
			oTabs[i].onclick = function(){
				this.obj.click();
			}
		}
		//清除弹出窗口占用的内存
		pop.document.parentWindow.attachEvent('onunload', function (){
			var oTabs=pop.document.body.all[0].getElementsByTagName("table");
			for (var i=0;i<oTabs.length;i++){
				//oTabs[i].obj=aItem.children[i];
				//aItem.children[i].popWindowItem=oTabs[i];
				oTabs[i].onmouseover = null;
				oTabs[i].onmouseout = null;
				oTabs[i].onclick = null;
				oTabs[i].obj = null;
			}
		});
		/*pop.document.body.onunload = function (){
			var oTabs=this.document.body.all[0].getElementsByTagName("table");
			for (var i=0;i<oTabs.length;i++){
				//oTabs[i].obj=aItem.children[i];
				//aItem.children[i].popWindowItem=oTabs[i];
				oTabs[i].onmouseover = null;
				oTabs[i].onmouseout = null;
				oTabs[i].onclick = null;
				oTabs[i].obj = null;
			}
		}*/
		//alert(pop.document.body.outerHTML);
		return pop;
	}

	//清除对象
	this.free = function (){
		thisMenu.root.deleteSelf();
		delete thisMenu;
	};
	//初始化
	(
		function (){
			var oXML=jsfw.getDomFromXMP(aData);
			var oRoot=oXML.documentElement;
			thisMenu.root=new MenuItem('','');
			thisMenu.root.showText = oRoot.getAttribute('showText')!='false';//showText为内部变量，仅供Toolbar使用
			thisMenu.root.addXMLItems(oRoot.childNodes);
			thisMenu.root.draw();
		}
	)();

};
(
	function (){
		var head = document.getElementsByTagName("head")[0];
		var link = document.createElement("link");
		link.rel = "stylesheet";
		link.href = jsfw.Path + 'Themes/' + jsfw.Theme + '/PopupMenu/css.css';
		link.type = "text/css";
		link.media = "all";
		head.appendChild(link);
	}
)();