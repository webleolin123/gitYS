/*******************************************\
  TreeView 类(2007-4-5)
	Author:Witson(Witson@163.com)
\*******************************************/
if (!jsfw.Class.Ajax) jsfw.Import("Ajax");
jsfw.Class.TreeView = function(aDiv,aData,sIcons){
	var thisTree = this;
	this.Theme=(typeof(sIcons)=='string')?sIcons:'Default';
	this.oPar = typeof(aDiv)=="string" ? document.getElementById(aDiv) : aDiv;
	//this.oPar.innerHTML='';
	var newNodeID=1;
	var strTem='';
	var intTem;
	var temObj=null;
	var temObjs;
	this.Ajax=null;

	this.inputType='';
	this.inputName='';
	
	this.allNodes = new Array();
	this.activeNode = null;
	this.root=null;

	function TreeNode(sText,sID,sAction,sChildSrc,sIcon,sOpenIcon,sValue,bShowInput){
		thisTree.allNodes[thisTree.allNodes.length]=this;
		this.text=sText;
		this.id=sID;
		this.parent=null;
		this.action =  (typeof(sAction)=='string')?sAction:'';
		this.childSrc = (typeof(sChildSrc)=='string')?sChildSrc:'';//下级节点URL
		this.icon = (typeof(sIcon)=='string')?sIcon:'';
		this.openIcon = (typeof(sOpenIcon)=='string')?sOpenIcon:'';
		this.value = (typeof(sValue)=='string')?sValue:'';
		this.checked=false;//选择框是否选中
		if (typeof(bShowInput)=='boolean'){
			this.showInput = bShowInput
		}else{
			if (bShowInput=='false'){
				this.showInput=false;
			}else{
				this.showInput = (thisTree.inputType!='');
			}
		}
		//私有变量
		this.level=0;
		this.bLoaded=(this.childSrc=='');//是否已载入下级;
		this.children = new Array(); //子节点
		this.isFolder = !this.bLoaded; //是否为目录
		this.isEnd = true; //是否本级最后一个节点
		this.bExpand = false; //是否已展开
		this.oPreIcon=null; //图标前的+号
		this.oIcon=null;	//树前的图标
		this.oLink=null; //链接文字
		this.oCheckBox=null; //选择框
		this.oNodeDiv=null; //节点DIV
		this.oChildDiv=null; //子节点DIV
	}
	//画节点
	TreeNode.prototype.Draw = function(){
		this.oNodeDiv=document.createElement("div");
		this.oChildDiv=document.createElement("div");
		this.oNodeDiv.className = 'jsfw_TreeNode';
		this.oChildDiv.className = 'jsfw_TreeNode_ChildDiv';
		strTem='';
		if (this.id!=''){
			objTem=this.parent;
			while (objTem.parent!=null){
				strTem = '<img src="' + jsfw.Path + 'Themes/' + jsfw.Theme + '/TreeView/'+thisTree.Theme+'/' + (objTem.isEnd?'Blank':'I') + '.gif"/>' + strTem;
				objTem=objTem.parent;
			}
		}
		if (this.id!='')
			strTem += '<img src="' + jsfw.Path + 'Themes/' + jsfw.Theme + '/TreeView/'+thisTree.Theme+'/L'+(this.isFolder?'plus':'')+'.gif"/>';
		if ((thisTree.inputType!='') && (this.showInput)){
			strTem += '<input type="' + thisTree.inputType + '" name="' + thisTree.inputName + '" value="' + this.value + '" class="CheckBox">';
		}
		strTem += '<img src="' + this.getIconSrc() + '"> <a href="javascript:' + this.action + ((this.action!='')?';':'') + 'void(0);">'+this.text+'</a>';
		this.oNodeDiv.innerHTML = strTem;
		this.oChildDiv.innerHTML = '';
		temObj=(this.id=='')?thisTree.oPar:this.parent.oChildDiv;
		temObj.appendChild(this.oNodeDiv);
		temObj.appendChild(this.oChildDiv);
		this.oIcon=this.oNodeDiv.getElementsByTagName('img')[this.level];
		if (this.oNodeDiv.getElementsByTagName('input').length>0){
			this.oCheckBox=this.oNodeDiv.getElementsByTagName('input')[0];
			if (thisTree.inputType.toLowerCase()=='checkbox'){
				if ((this.parent!=null)&&(this.parent.oCheckBox!=null)) {
					this.oCheckBox.checked=this.parent.oCheckBox.checked;
					this.checked=this.parent.checked;
				}
			}
		}
		if (this.level>0) this.oPreIcon=this.oNodeDiv.getElementsByTagName('img')[this.level-1];
		this.oLink = this.oNodeDiv.getElementsByTagName('a')[0];
		var temItem=this;
		this.oIcon.oncontextmenu = this.oLink.oncontextmenu = function (e){
			if (thisTree.onContextmenu){
				thisTree.onContextmenu(temItem,e)
				return false;
			}
		}
		this.oChildDiv.style.display='none';
		thisTree.AttachNodeEvent(this); //添加事件
	}

	TreeNode.prototype.setText = function (value){
		this.text = value;
		if (this.oLink) this.oLink.innerHTML = value;
	}
/*	TreeNode.prototype.setAction = function (){
	}*/
	//重画节点及前面的+或L线
	TreeNode.prototype.Refresh = function(){
		bRefreshChild = (typeof(bRefreshChild)=='boolean')?bRefreshChild:false;
		this.oIcon.src = this.getIconSrc(this.bExpand);
		if (this.oPreIcon!=null) this.oPreIcon.src = jsfw.Path + 'Themes/' + jsfw.Theme + '/TreeView/'+thisTree.Theme+'/'+ (this.isEnd?'L':'T') + (this.isFolder?(this.bExpand?'minus':'plus'):'')+'.gif';
	}
	//重画节点前面的线
	TreeNode.prototype.RefreshChildLine = function(iLevel,bRefreshSelf,isEnd){
		if (bRefreshSelf) {
			this.oNodeDiv.getElementsByTagName('img')[iLevel].src = jsfw.Path + 'Themes/' + jsfw.Theme + '/TreeView/'+thisTree.Theme+'/'+(isEnd?'blank':'I')+'.gif';
		}
		for (var i=0;i<this.children.length;i++) this.children[i].RefreshChildLine(iLevel,true,isEnd);
	}
	//获取图标
	TreeNode.prototype.getIconSrc=function(bOpen){
		strTem=jsfw.Path + 'Themes/' + jsfw.Theme + '/TreeView/'+thisTree.Theme+'/';
		bOpen=(typeof(bOpen)=='boolean')?bOpen:false;
		if (bOpen){
			if (this.openIcon!='') return this.openIcon;
			if ((!this.isFolder) && (this.icon!='')) return this.icon;
			return (this.isFolder)?(strTem+'/FolderOpen.gif'):strTem+'/Item.gif';
		}else{
			if (this.icon!='') return this.icon;
			return (this.isFolder)?(strTem+'/Folder.gif'):strTem+'/Item.gif';
		}
	}

	TreeNode.prototype.addNode = function (sText,sID,sAction,sChildSrc,sIcon,sOpenIcon,sValue,bShowInput) {
		if (sID==''){
			sID=newNodeID++;
			while(thisTree.findNode(sID)!=null) sID=newNodeID++;
		}else{
			if (thisTree.findNode(sID)!=null){
				alert('节点ID已经存在，不能重复创建！');
				return null;
			}
		}
		var newNode=new TreeNode(sText,sID,sAction,sChildSrc,sIcon,sOpenIcon,sValue,bShowInput);
		newNode.parent=this;
		newNode.level = this.level+1;
		this.children[this.children.length]=newNode;
		if (this.children.length==1) {//唯一子节点
			this.isFolder = true;
			newNode.Draw();
			this.Refresh();
		}else{
			this.children[this.children.length-2].isEnd=false;
			newNode.Draw();
			this.children[this.children.length-2].Refresh(true);
			this.children[this.children.length-2].RefreshChildLine(this.level,false,false);
		}
		return newNode;
	}
	TreeNode.prototype.loadXML = function (xDom,oNode) {//动态载入
		oNode.bLoaded=true;
		oNode.oChildDiv.innerHTML='';
		var oRoot=xDom.documentElement;
		oNode.addXMLNodes(oRoot.childNodes);
	}
	TreeNode.prototype.addXMLNodes = function (nodes) {//动态载入
		for (var i = 0; i < nodes.length; i++) {
			if (nodes[i].tagName=='node'){
				var sID=nodes[i].getAttribute('id');
				sID=(sID==null)?'':sID;
				var newNode=this.addNode(
					nodes[i].getAttribute('text'),
					sID,
					nodes[i].getAttribute('action'),
					nodes[i].getAttribute('childSrc'),
					nodes[i].getAttribute('icon'),
					nodes[i].getAttribute('openIcon'),
					nodes[i].getAttribute('value'),
					nodes[i].getAttribute('showInput'));
				if (nodes[i].childNodes.length>0)	newNode.addXMLNodes(nodes[i].childNodes);
			}
		}
	}

	TreeNode.prototype.check = function (bCheck) {//选择选择框
		if (this.oCheckBox==null) return;
		bCheck=(typeof(bCheck)=='boolean')?bCheck:(this.oCheckBox.checked);
		if (thisTree.inputType.toLowerCase()!='checkbox'){
			for (var i=0;i<thisTree.allNodes.length;i++) thisTree.allNodes[i].checked=false;
		}
		this.oCheckBox.checked = bCheck;
		this.checked=bCheck;
		if (thisTree.inputType.toLowerCase()!='checkbox') return;
		for (var i=0;i<this.children.length;i++){
			this.children[i].check(bCheck);
		}
	}

	TreeNode.prototype.expand = function (bExpand) {//展开收起
		this.bExpand=(typeof(bExpand)=='boolean')?bExpand:(!this.bExpand);
//		if (!this.isFolder) return;
		if (this.oPreIcon!=null) this.oPreIcon.src=this.oPreIcon.src.replace(this.bExpand?'plus.gif':'minus.gif',this.bExpand?'minus.gif':'plus.gif');
		this.oIcon.src=this.getIconSrc(this.bExpand);
		this.oChildDiv.style.display=this.bExpand?'':'none';
		//动态载入
		if (this.bLoaded) return;
		if (this.childSrc=='') return;
		strTem='';
		if (this.id!=''){
			objTem=this;
			while (objTem.parent!=null){
				strTem = '<img src="' + jsfw.Path + 'Themes/' + jsfw.Theme + '/TreeView/'+thisTree.Theme+'/' + (objTem.isEnd?'Blank':'I') + '.gif"/>' + strTem;
				objTem=objTem.parent;
			}
		}
		strTem += '<img src="' + jsfw.Path + 'Themes/' + jsfw.Theme + '/TreeView/'+thisTree.Theme+'/L.gif"/>';
		this.oChildDiv.innerHTML='<div class="jsfw_TreeNode_loading">'+strTem+'正在载入...</div>';
//		alert(this.oChildDiv.innerHTML);
		if (thisTree.Ajax==null) thisTree.Ajax = new jsfw.Class.Ajax();
		thisTree.Ajax.loadXml(this.childSrc, true, this.loadXML,this);
	}
	TreeNode.prototype.focus = function(){
		if (this.id!=''){
			objTem=this.parent;
			while (objTem.parent!=null){
				objTem.expand(true);
				objTem=objTem.parent;
			}
		}

		intTem=thisTree.oPar.clientWidth-this.oLink.offsetLeft;
		thisTree.activeNode.oLink.className = '';
		thisTree.activeNode = this;
		try{
			this.oLink.focus();
			this.oLink.className = 'selected';
		}catch(e){
			this.oLink.className = 'selected-inactive';
		}
		try{
			if ((this.oLink.offsetWidth>intTem)&&(intTem>0)) this.oLink.style.width=intTem;
		}catch(e){}
	}
	TreeNode.prototype.Blur = function(){
		if (this.oLink.className!='') this.oLink.className = 'selected-inactive';
		this.oLink.style.width='';
	}
	TreeNode.prototype.deleteSelf = function(){
		thisTree.deleteNode(this);
	}
	TreeNode.prototype.deleteChildren = function(){
		for (var i=(this.children.length-1);i>=0;i--){
			thisTree.deleteNode(this.children[i]);
		}
	}

	TreeNode.prototype.getFirst = function() {
		return this.children[0];
	}
	TreeNode.prototype.getLast = function() {
		if (this.children[this.children.length - 1].bExpand && this.children[this.children.length - 1].isFolder) { return this.children[this.children.length - 1].getLast(); }
		else { return this.children[this.children.length - 1]; }
	}
	TreeNode.prototype.getNextSibling = function() {
		if (this.parent==null) return;
		for (var i = 0; i < this.parent.children.length; i++) {
			if (this == this.parent.children[i]) break;
		}
		if (++i == this.parent.children.length){
			return this.parent.getNextSibling(); 
		}else{ 
			return this.parent.children[i];
		}
	}
	TreeNode.prototype.getPreviousSibling = function(b) {
		for (var i = 0; i < this.parent.children.length; i++) {
			if (this == this.parent.children[i]) break;
		}
		if (i == 0) {
			return this.parent; 
		}else{
			if ((this.parent.children[--i].bExpand && this.parent.children[i].isFolder) || (b && this.parent.children[i].isFolder)) {
				return this.parent.children[i].getLast();
			}else {
				return this.parent.children[i];
			}
		}
	}

	TreeNode.prototype.KeyDown = function(e){
		e = e || event;
		/* 37 Left   
		38 Up
		39 Right
		40 Down
		*/
		var key=e.keyCode;
		if (key == 39) {
			if (!this.bExpand) { 
				this.expand(); 
			}else if (this.children.length) {
				this.children[0].focus();
			}
			return false;
		}
		if (key == 37) {
			if ((this.isFolder)&&(this.bExpand)){
				this.expand();
			}else{
				if (this.parent) this.parent.focus();
			}
			return false;
		}
		if (key == 38){
			if (this.parent==null) return false;
			this.getPreviousSibling().focus(); return false;
		}
		if (key == 40) {//(key == 40) && (this.bExpand) && (this.children.length)
			if (this.bExpand && this.isFolder) { this.getFirst().focus(); }
			else {
				var sib = this.getNextSibling();
				if (sib) { sib.focus(); }
			}
			return false;
		}
		return true;
	}
	TreeNode.prototype.KeyUp = function(e){
		e = e || event;
		/* 37 Left   
		38 Up
		39 Right
		40 Down
		*/
		var key=e.keyCode;
		if (key == 32){
			this.check(!this.checked);
		}
		return;
	}
	////////////////////////////////// 以上是TreeNode属性及方法 //////////////////////////////////////////

	this.AttachNodeEvent = function(aNode){
		aNode.oNodeDiv.ondblclick = function(){aNode.expand();}
		aNode.oNodeDiv.onclick = function(){aNode.focus();}
		aNode.oNodeDiv.onkeydown = function(e){aNode.KeyDown(e);}
		aNode.oNodeDiv.onkeyup = function(e){aNode.KeyUp(e);}
		if (aNode.oCheckBox!=null) aNode.oCheckBox.onclick = function(){aNode.check();}

		if (aNode.oPreIcon!=null) aNode.oPreIcon.onclick = function(){aNode.expand();}
		aNode.oLink.onblur = function(){aNode.Blur();}
	}
	this.findNode = function(sID){//查找节点
		if (sID=='') return thisTree.root;
		for (var i=0;i<thisTree.allNodes.length;i++){
			if (thisTree.allNodes[i].id==sID) return thisTree.allNodes[i];
		}
		return null;
	}
	this.addNode = function(sText,sID,sParID,sAction,sChildSrc,sIcon,sOpenIcon,sValue,bShowInput){
		sText = (typeof(sText)=='string')?sText:'';
		sID = (typeof(sID)=='string')?sID:'';
		sParID = (typeof(sParID)=='string')?sParID:'';
		return thisTree.findNode(sParID).addNode(sText,sID,sAction,sChildSrc,sIcon,sOpenIcon,sValue,bShowInput);
	}
	this.deleteNode = function(aNode){
		if (aNode.parent==null) return;
		var isEnd=aNode.isEnd;
		var isFolder=aNode.isFolder;
		var oParent=aNode.parent;
		var temObjs=aNode.parent.children;
		for (var idx=0;idx<temObjs.length;idx++) if (temObjs[idx]==aNode) break;
		var oPrev=null;
		if (idx>0) oPrev=temObjs[idx-1];

		var newNode=aNode.getPreviousSibling();
		this.deleteNodeEx(aNode);
//		try{newNode.focus();}catch(e){}
		newNode.focus();
		//刷新树前的线
		if (isEnd){
			if (oPrev!=null) {
				oPrev.isEnd=true;
				oPrev.Refresh();
				oPrev.RefreshChildLine(oPrev.level-1,false,true);
			}else{
				oParent.isFolder=false;
				oParent.Refresh();
			}
		}
	}
	this.deleteNodeEx = function(aNode){
		for (var i=(aNode.children.length-1);i>=0;i--) this.deleteNodeEx(aNode.children[i]);
		//从AllNodes数组中删除
		temObjs=this.allNodes;
		var iCur=0;
		for (var iCur=0;iCur<temObjs.length;iCur++) if (temObjs[iCur]==aNode) break;
		for (var i=iCur;i<(temObjs.length-1);i++) temObjs[i]=temObjs[i+1];
		temObjs.length=temObjs.length-1;
		//从Parent的Children数组中删除
		temObjs=aNode.parent.children;
		iCur=0;
		for (var iCur=0;iCur<temObjs.length;iCur++) if (temObjs[iCur]==aNode) break;
		for (var i=iCur;i<(temObjs.length-1);i++) temObjs[i]=temObjs[i+1];
		temObjs.length=temObjs.length-1;
		//删除HTML对象
//		alert(aNode.oNodeDiv.innerHTML);
		aNode.parent.oChildDiv.removeChild(aNode.oNodeDiv);
		aNode.parent.oChildDiv.removeChild(aNode.oChildDiv);
		delete aNode;
	}


	this.createRoot = function(sText,sAction,sChildSrc,sIcon,sOpenIcon,sInputType,sInputName,sValue,bShowInput){
		if (this.root!=null) return;
		this.inputType =  (typeof(sInputType)=='string')?sInputType:'';
		this.inputName =  (typeof(sInputName)=='string')?sInputName:'';
		this.inputType = this.inputType.toLowerCase();
		if (this.inputName=='') this.inputType='';
		thisTree.oPar.className='jsfw_TreeView';
		thisTree.oPar.onselectstart = function(){return false;}
		sText = (typeof(sText)=='string')?sText:'Root';
		thisTree.root=new TreeNode(sText,'',sAction,sChildSrc,sIcon,sOpenIcon,sValue,bShowInput);
		thisTree.root.Draw();
		thisTree.activeNode=thisTree.root;
		thisTree.root.focus();
		thisTree.root.expand();
	}

	this.LoadData = function(){
		var oNode=oXML.documentElement;
		thisTree.createRoot(
			oNode.getAttribute('text'),
			oNode.getAttribute('action'),
			oNode.getAttribute('childSrc'),
			oNode.getAttribute('icon'),
			oNode.getAttribute('openIcon'),
			oNode.getAttribute('inputType'),
			oNode.getAttribute('inputName'),
			oNode.getAttribute('value'),
			oNode.getAttribute('showInput')
			);
		thisTree.root.loadXML(oXML,thisTree.root);
	}

	//读取数据
	var oXML;
	if (typeof(aData)=='undefined')aData='';
	if (typeof(aData)=="string"){
		if (aData!=''){
			if (thisTree.Ajax==null) thisTree.Ajax = new jsfw.Class.Ajax();
			thisTree.Ajax.loadXml(aData, true, function(o){oXML=o;thisTree.LoadData()});
		}
	}else{
		oXML=getDomFromXMP(aData);
		thisTree.LoadData();
	}
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
		link.href = jsfw.Path + "Themes/" + jsfw.Theme + "/TreeView/css.css";
		link.type = "text/css";
		link.media = "all";
		head.appendChild(link);
	}
)();