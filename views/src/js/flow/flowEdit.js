//模块与业务对象
var moduleAndBusiness = new Array();
//PC表单对象和状态
var webFormAndState = null;
//app表单对象和状态
var appFormAndState = null;


//--------初始化页面
function initDocument(){
	jt.getJSON('/sasprocessmgr/businessEngineModuleConfig/selectAllBusinessEngineModuleConfig',function(json){
		if(json.success && json.list.length > 0){
			for(var i=0;i<json.list.length;i++){
				var obj = json.list[i];
				var fChild = {};
				fChild.type = 'module';
				fChild.id = 'P_' + obj.businessTypeId;
				fChild.name = obj.businessTypeName;
				fChild.pid = '-';
				fChild.children = [];
				var sChild = {};
				sChild.type = 'business';
				sChild.id = obj.businessTypeId;
				sChild.name = obj.businessTypeName;
				sChild.pid = 'P_' + obj.businessTypeId;
				fChild.children.push(sChild);
				moduleAndBusiness.push(fChild);
			}
		}
		//初始化对话框
		self.winTool = showDialog('winTool','工具栏',jsfw.$('divWinTool'),200,120,document.body.offsetWidth-230,30);
		self.winProperty = showDialog('winProperty','属性',jsfw.$('divWinProperty'),520,300,document.body.offsetWidth-545,170);
		self.winFlowNotionInput =  showDialog('winFlowNotionInput', '流程意见',jsfw.$('divFlowNotionInput'),250,120);
		winFlowNotionInput.hide();
		self.winFlowNotionOrder =  showDialog('winFlowNotionOrder', '流程意见排序',jsfw.$('divFlowNotionOrder'),250,300);
		winFlowNotionOrder.hide();

		oFlow.onItemContextMenu = function (e){ divPopupMenu.popup(); return false;}	//初始右键菜单
		oFlow.afterSelItem = function (){ readProperty();}	//选中对象
		//设置业务模块
		getXMLDocModules();
		//设置其它属性

		readProperty();
		jsfw.$('divLoadingMain').style.display = 'none';
	});
}
//------读取级别
function loadPositionArr(){
	var arr=eval(jsfw.Ajax.loadHttp(CST_URL_PositionAssignment, false));
	return arr;
}

//--------流程意见处理[Begin]
function readFlowNotion(){
	var arr=oFlow.getAttr('/notion','notions').split(';').delEmpty();
	var arrH=oFlow.getAttr('/notion','highlight').split(';').delEmpty();
	var sHTML='<table width="100%" border="1" bordercolor="#6699cc" cellspacing="0" cellpadding="3" style="border-collapse:collapse">';
	for (var i=0; i<arr.length; i++){
		sHTML += '<tr>';
		sHTML += '<td>'+arr[i]+'</td>';
		sHTML += '<td width="150">';
		sHTML += '<a href="javascript:delFlowNotion('+(i+1)+');void(0);"><img src="../../../js/flow/images/icon/delete3.gif" align="absmiddle">删除</a>&nbsp;&nbsp;';
		sHTML += '<a href="javascript:editFlowNotion('+(i+1)+');void(0);"><img src="../../../js/flow/images/icon/edit.gif" align="absmiddle">修改</a>&nbsp;&nbsp;';
		sHTML += '<input onclick="highFlowNotion()" type="checkbox" name="chkFlowNotion" id="chkFlowNotion'+i+'" value="'+arr[i]+'" ';
		var bFind=false;
		for (var j=0; j<arrH.length; j++){
			if (arrH[j]==arr[i]){
				bFind=true;
				break;
			}
		}
		if (bFind) sHTML += ' checked ';
		sHTML += '><label for="chkFlowNotion'+i+'">突出</label>';
		sHTML += '</td>';
		sHTML += '</tr>';
	}
	sHTML += '</table>';
	jsfw.$('divFlowNotion').innerHTML = sHTML;
	jsfw.$('chkIsSort').checked = oFlow.getAttr('/notion','isSort')=='true';


}
function orderFlowNotion(){
	var arr=oFlow.getAttr('/notion','notions').split(';').delEmpty();
	var arrN=oFlow.getAttr('/notion','sequencenum').split(';').delEmpty();
	var sHTML='<select id="selFlowNotionOrder" size="12" style="width:100%">'
	for (var i=0; i<arrN.length; i++){
		sHTML += '<option value="'+arrN[i]+'">'+arr[arrN[i]-1]+'</option>';
	}
	sHTML += '</select>';
	jsfw.$('tdFlowNotionOrder').innerHTML=sHTML;
	winFlowNotionOrder.show();
	winFlowNotionOrder.oDiv.style.zIndex = window._jsfw_Window_zIndex;
}
function orderFlowNotion_After(){
	winFlowNotionOrder.hide();
	var obj=jsfw.$('selFlowNotionOrder');
	var str='';
	for (var i=0; i<obj.options.length; i++){
		if (str!='') str+=';';
		str += obj[i].value
	}
	setFlowNotionSecNum(str);
}
function selFlowNotion(){
	showDialog('winFlowNotion','请选择','flowDocNotion.jsp',630,400);
}
function selFlowNotion_After(sValue){
	var arr=oFlow.getAttr('/notion','notions').split(';').delEmpty();
	var arrNew=sValue.split(';').delEmpty();
	for (var i=arr.length-1; i>=0; i--){
		var bFind=false;
		for (var j=0; j<arrNew.length; j++){
			if (arr[i]==arrNew[j]){
				bFind=true;
				break;
			}
		}
		if (!bFind) delFlowNotion(i+1,true);//arr=arr.del(i);
	}
	var str=oFlow.getAttr('/notion','notions');
	var strN=oFlow.getAttr('/notion','sequencenum');
	arr=str.split(';').delEmpty();
	var iCur=arr.length;
	for (var i=0; i<arrNew.length; i++){
		var bFind=false;
		for (var j=0; j<arr.length; j++){
			if (arrNew[i]==arr[j]){
				bFind=true;
				break;
			}
		}
		if (!bFind) {
			iCur++;
			str += ((str.substr(str.length-1)==';')?'':';')+arrNew[i];
			strN += ((strN.substr(strN.length-1)==';')?'':';')+iCur;
		}
	}
	str=str.split(';').delEmpty().toString2();
	oFlow.setAttr('/notion','notions',str);
	setFlowNotionSecNum(strN);
	readFlowNotion();
}
function delFlowNotion(idx,bForce){
	if ((typeof(bForce)!='boolean') || !bForce){
		if (!confirm('确实要删除该项？')) return;
	}
	var arr=oFlow.getAttr('/notion','notions').split(';').delEmpty();
	arr=arr.del(idx-1);
	oFlow.setAttr('/notion','notions',arr.toString2());
	oFlow.modified = true;
	var arrN=oFlow.getAttr('/notion','sequencenum').split(';').delEmpty();
	var iCur=-1;
	for (var i=0; i<arrN.length; i++){
		if (parseInt(arrN[i])==idx){
			iCur=i;
			break;
		}
	}
	arrN=arrN.del(iCur);
	for (var i=0; i<arrN.length; i++){
		if (parseInt(arrN[i])>idx) arrN[i]--;
	}
	setFlowNotionSecNum(arrN.toString2());
	readFlowNotion();
}
function editFlowNotion(idx){
	if (idx==-1){
		jsfw.$('txtFlowNotionInput_id').value='-1';
		jsfw.$('txtFlowNotionInput').value='';
	}else{
		var arr=oFlow.getAttr('/notion','notions').split(';').delEmpty();
		jsfw.$('txtFlowNotionInput_id').value=idx.toString();
		jsfw.$('txtFlowNotionInput').value=arr[idx-1];
	}
	winFlowNotionInput.show();
	winFlowNotionInput.oDiv.style.zIndex = window._jsfw_Window_zIndex;
	jsfw.$('txtFlowNotionInput').focus();
}
function editFlowNotion_After(idx,sValue){
	var arr=oFlow.getAttr('/notion','notions').split(';').delEmpty();
	if (parseInt(idx)!=-1){
		arr[idx-1]=sValue;
		oFlow.setAttr('/notion','notions',arr.toString2());
		setFlowNotionSecNum(oFlow.getAttr('/notion','sequencenum'));
	}else{
		var str=oFlow.getAttr('/notion','notions');
		//str += ((str.substr(str.length-1)==';')?'':';')+sValue;
		str += ';'+sValue;
		str=str.split(';').delEmpty().toString2();
		oFlow.setAttr('/notion','notions',str);
		str=oFlow.getAttr('/notion','sequencenum');
		//str += ((str.substr(str.length-1)==';')?'':';')+(arr.length+1);
		str += ';'+(arr.length+1);
		setFlowNotionSecNum(str);
	}
	readFlowNotion();
}
function highFlowNotion(idx){
	var objs=document.getElementsByName('chkFlowNotion');
	var sRe='';
	for (var i=0; i<objs.length; i++){
		if (objs[i].checked){
			if (sRe!='') sRe+=';';
			sRe += objs[i].value;
		}
	}
	oFlow.setAttr('/notion','highlight',sRe);
	oFlow.modified = true;
}
function setFlowNotionSecNum(sSec){
	sSec=sSec.split(';').delEmpty().toString2();
	oFlow.setAttr('/notion','sequencenum',sSec);
	var arr=oFlow.getAttr('/notion','notions').split(';').delEmpty();
	var arrN=sSec.split(';').delEmpty();
	var re='';
	for (var i=0; i<arrN.length; i++){
		if (re!='') re+=';';
		re+=arr[parseInt(arrN[i])-1];;
	}
	oFlow.setAttr('/notion','sequence',re);
}
//--------流程意见处理[End]

function readProperty(){	//读取当前对象所有属性
	jsfw.$('divProNode').style.display = 'none';
	jsfw.$('divProNode_SE').style.display = 'none';
	jsfw.$('divProLine').style.display = 'none';
	jsfw.$('divProDoc').style.display = 'none';
	var strTem='Doc';
	if (oFlow.currentItem.substr(0,12)=='tabFlowNode_') strTem = 'Node';
	if (oFlow.currentItem.substr(0,12)=='tabFlowLine_') strTem = 'Line';
	var Item =oFlow.getCurrentObj();
	if ((strTem=='Node') && ((oFlow.getNodeType(Item)=='start-state') || (oFlow.getNodeType(Item)=='end-state'))) strTem='Node_SE';
	jsfw.$('divPro'+strTem).style.display = '';
	var objs = jsfw.$('divPro'+strTem).getElementsByTagName('input');

	for (var i=0; i<objs.length; i++){
		if (objs[i].type!='text') continue;
		if (objs[i].name=='') continue;
		if(objs[i].name == 'operationsAll') {
			objs[i].value = oFlow.getAttr(Item,"operationsAll");
		}else if(objs[i].name == 'operations'){
			var optArr = oFlow.getAttr(Item,"operations").split(";");
			var text = "";
			for(var j=0;j<optArr.length;j++){
				if (text!='') text+=';';
				text+=optArr[j].split("##")[0];
			}
			objs[i].value = text;
		}else{
			objs[i].value = oFlow.getAttr(Item,objs[i].name);
		}
		/*if (strTem=='Doc'){
			if (objs[i].name=='label') objs[i].readOnly=true;
			if (objs[i].name=='name') objs[i].readOnly=true;
			if (objs[i].name=='version') objs[i].readOnly=true;
		}*/
		if (objs[i].name=='calDefaultPath' && objs[i].value=='')
			objs[i].value='true';
			
		var attrType=objs[i].getAttribute('attrtype')||'string';
		if (attrType=='boolean') setInputBoolean(objs[i],objs[i].value=='true');
		if (attrType=='select') objs[i].nextSibling.value=objs[i].value;
	}
	jsfw.$('tabNodeProperty_join').style.display=(oFlow.getNodeType(Item)=='join-state'||oFlow.getNodeType(Item)=='compete-join-state')?'':'none';
	jsfw.$('tabNodeProperty_exe').style.display=(oFlow.getNodeType(Item)=='compete-exe-state'||oFlow.getNodeType(Item)=='compete-join-state')?'':'none';
	jsfw.$('tabNodeProperty_subprocess').style.display=(oFlow.getNodeType(Item)=='subprocess-state'||oFlow.getNodeType(Item)=='subprocess-state')?'':'none';
	if (strTem=='Node') {
		readProperty_Node();
		winProperty.setTitle('环节属性');
	}
	if (strTem=='Line') {
		readProperty_Line();
		winProperty.setTitle('迁移属性');
	}
	if (strTem=='Doc') 	{
		readFlowNotion();
		winProperty.setTitle('流程属性');
		try{jsfw.$('privilege'+oFlow.getAttr('/privilege','type')).checked=true;}catch(e){}
		//初始化流程数据后，调用模块onchange事件
		var modules = oFlow.getAttr('','modules')
		if(modules!=""){
			afterSelModules(modules);
		}
	}
	if(strTem=="Node_SE"){
		//设置选择表单和状态
		if(oFlow.getNodeType(Item)=='end-state'){
			var form =  oFlow.getAttr(Item,"form");
			var formstate = oFlow.getAttr(Item,"formstate");
			if(form){
				jsfw.$('sel_flow_form').value = form;
				afterSelFlowForm(form,'WEB');
			}
			if(formstate){
				jsfw.$('sel_flow_formstate').value = formstate;
			}
			var form =  oFlow.getAttr(Item,"appform");
			var formstate = oFlow.getAttr(Item,"appformstate");
			if(form){
				jsfw.$('sel_flow_form_app').value = form;
				afterSelFlowForm(form,'APP');
			}
			if(formstate){
				jsfw.$('sel_flow_formstate_app').value = formstate;
			}
			var objs = jt._(".flowEnd");
			for(var i=0;i<objs.length;i++){
				objs[i].style.display = "";
			}
		}else{
			var objs = jt._(".flowEnd");
		    for(var i=0;i<objs.length;i++){
				objs[i].style.display = "none";
			}
		}
	}
}
//读取线条的其他属性
function readProperty_Line(){
	var oNode=oFlow.getCurrentObj();
	var oNodes=null;
	var sHTML='<table width="100%" border="1" bordercolor="#6699cc" cellspacing="0" cellpadding="3" style="border-collapse:collapse">';
	sHTML += '<tr style="font-weight:bold"><td width="60">分类</td><td>属性</td><td>值</td><td width="90">操作</td></tr>';

	oNodes = oNode.selectNodes('action[@type="com.yr.gap.engine.core.action.GeneralNotifyAction"]/arg');
	for (var i=0; i<oNodes.length; i++){
		sHTML += '<tr>';
		if (i==0) sHTML += '<td rowspan="'+oNodes.length+'">普通知会</td>';
		sHTML += '<td>'+oNodes[i].getAttribute('name')+'</td><td>'+oNodes[i].text+'</td>';
		sHTML += '<td><a href="javascript:delLineAct(\''+oNodes[i].parentNode.getAttribute('type')+'\','+i+');void(0);"><img src="../../../js/flow/images/icon/delete3.gif" align="absmiddle">删除</a>&nbsp;&nbsp;';
		sHTML += '<a href="javascript:showLineActDlg(\''+oNodes[i].parentNode.getAttribute('type')+'\','+i+');void(0);"><img src="../../../js/flow/images/icon/edit.gif" align="absmiddle">修改</a></td>';
	}
	oNodes = oNode.selectNodes('condition[@type="com.yr.gap.engine.core.beanshell.BeanShellCondition"]/arg');
	for (var i=0; i<oNodes.length; i++){
		sHTML += '<tr>';
		if (i==0) sHTML += '<td rowspan="'+oNodes.length+'">迁移条件</td>';
		sHTML += '<td>'+oNodes[i].getAttribute('name')+'</td><td>'+oNodes[i].text+'</td>';
		sHTML += '<td><a href="javascript:delLineAct(\''+oNodes[i].parentNode.getAttribute('type')+'\','+i+');void(0);"><img src="../../../js/flow/images/icon/delete3.gif" align="absmiddle">删除</a>&nbsp;&nbsp;';
		sHTML += '<a href="javascript:showLineActDlg(\''+oNodes[i].parentNode.getAttribute('type')+'\','+i+');void(0);"><img src="../../../js/flow/images/icon/edit.gif" align="absmiddle">修改</a></td>';
	}
	oNodes = oNode.selectNodes('action[@type="com.yr.gap.engine.core.action.SetProcessVariblesAction"]/arg');
	for (var i=0; i<oNodes.length; i++){
		sHTML += '<tr>';
		if (i==0) sHTML += '<td rowspan="'+oNodes.length+'">变量设置</td>';
		sHTML += '<td>'+oNodes[i].getAttribute('name')+'</td><td>'+oNodes[i].text+'</td>';
		sHTML += '<td><a href="javascript:delLineAct(\''+oNodes[i].parentNode.getAttribute('type')+'\','+i+');void(0);"><img src="../../../js/flow/images/icon/delete3.gif" align="absmiddle">删除</a>&nbsp;&nbsp;';
		sHTML += '<a href="javascript:showLineActDlg(\''+oNodes[i].parentNode.getAttribute('type')+'\','+i+');void(0);"><img src="../../../js/flow/images/icon/edit.gif" align="absmiddle">修改</a></td>';
	}
	oNodes = oNode.selectNodes('action[@type="com.yr.gap.engine.core.action.AutoNotifyAction"]/arg');
	for (var i=0; i<oNodes.length; i++){
		sHTML += '<tr>';
		if (i==0) sHTML += '<td rowspan="'+oNodes.length+'">自动知会</td>';
		sHTML += '<td>'+oNodes[i].getAttribute('name')+'</td><td>'+oNodes[i].text+'</td>';
		sHTML += '<td><a href="javascript:delLineAct(\''+oNodes[i].parentNode.getAttribute('type')+'\','+i+');void(0);"><img src="../../../js/flow/images/icon/delete3.gif" align="absmiddle">删除</a>&nbsp;&nbsp;';
		sHTML += '<a href="javascript:showLineActDlg(\''+oNodes[i].parentNode.getAttribute('type')+'\','+i+');void(0);"><img src="../../../js/flow/images/icon/edit.gif" align="absmiddle">修改</a></td>';
	}
	sHTML += '</table>';
	jsfw.$('div_LineAttr_Other').innerHTML = sHTML;
	
	//xhq
	sHTML='<table width="100%" border="1" bordercolor="#6699cc" cellspacing="0" cellpadding="3" style="border-collapse:collapse">';
	sHTML += '<tr style="font-weight:bold"><td width="80">按钮名称</td><td>按钮属性</td><td width="170">按钮注释</td><td width="40">单路径</td><td width="90">操作</td></tr>';
	oNodes = oNode.selectNodes('buttonconfig');
	for (var i=0; i<oNodes.length; i++){
		sHTML += '<tr>';
		sHTML += '<td>'+oNodes[i].getAttribute('buttonName')+'</td><td>'+oNodes[i].getAttribute('buttonAction')+'</td><td>'+oNodes[i].getAttribute('buttonTitle')+'</td><td>'+oNodes[i].getAttribute('transitionAlone')+'</td>';
		sHTML += '<td><a href="javascript:delButtonConfig(\''+i+'\');void(0);"><img src="../../../js/flow/images/icon/delete3.gif" align="absmiddle">删除</a>&nbsp;&nbsp;';
		sHTML += '<a href="javascript:showButtonConfigDlg(\''+i+'\');void(0);"><img src="../../../js/flow/images/icon/edit.gif" align="absmiddle">修改</a></td>';
	}
	sHTML += '</table>';
	jsfw.$('div_LineAttr_Button').innerHTML = sHTML;
	/////
}
//xhq
function showButtonConfigDlg(idx){
	showDialog('winLineButtonConfig','按钮配置','LineButtonConfig.htm?parVal='+idx,300,200);
}
function delButtonConfig(idx){
	var oNode = oFlow.getCurrentObj().selectNodes('buttonconfig')[idx];
	oNode.parentNode.removeChild(oNode);
	readProperty_Line();
}
//////////
function showLineActDlg(sType,idx){
	showDialog('winFlowLineAct','参数配置','flowLineAct.htm?parVal='+sType+','+idx,300,200);
}
function delLineAct(sType,idx){
	var oNode = oFlow.getCurrentObj().selectNodes('*[@type="'+sType+'"]/arg')[idx];
	oNode.parentNode.removeChild(oNode);
	readProperty_Line();
}

//读取节点的其他属性
function readProperty_Node(){
	//环节意见
	funStateNotionLoad();
	//环节文档
	var arr = getStateDoc('operations').split(';').delEmpty();
	var allArr = getStateDoc('operationsAll').split(';').delEmpty();
	var sHTML='';
	sHTML += '<select id="sel_StateDoc_operations" size="6" style="width:250px;">';
	for (var i=0; i<allArr.length; i++) {
		var optValue = allArr[i].split("##")[1];
		var optText = allArr[i].split("##")[0]
		sHTML += '<option value="'+optValue+'">'+optText+'</option>';
	}
	sHTML += '</select>';
	jsfw.$('td_state_operations').innerHTML = sHTML;
	var arr = getStateDoc('appoperations').split(';').delEmpty();
	var sHTML='';
	sHTML += '<select id="sel_StateDoc_operations_app" size="6" style="width:250px;">';
	for (var i=0; i<arr.length; i++) sHTML += '<option value="'+arr[i]+'">'+arr[i]+'</option>';
	sHTML += '</select>';
	jsfw.$('td_state_operations_app').innerHTML = sHTML;

	try{ jsfw.$('state_docEdit'+getStateDoc('docEdit')).checked=true; }catch(e){}
	try{ jsfw.$('state_notes'+getStateDoc('notes')).checked=true; }catch(e){}
	try{ jsfw.$('state_checkedsms'+getStateDoc('checkedsms')).checked=true; }catch(e){}
	//表单

	//指派
	loadStateAssignment();
	//知会
	funNotifyLoad();
	//知会条件
	funNotifyConditionLoad();
	//流程控制
	funProcessControlLoad();
	//领导意见通知人员公式
	funNotionWfLeaderConditionLoad();
	//自动意见综合公式
	funNotionOpinionAllFormulaConditionLoad();
	//表单信息映射到流程环节默认人员规则配置
	funFormMapFlowWfStateDefaultRuleConditionLoad();
	//流程信息映射到表单信息规则配置
	funFlowMapFormWfStateBackFillRuleInit();
	funFlowMapFormWfStateBackFillRuleLoad();
	//意见信息映射到流程信息规则配置
	funOtionMapFlowRuleLoad();
	//意见信息映射到基本信息规则配置
	funOptionMapBaseWfOpinionBackFillRuleLoad();
	//表单和状态
	//PC表单和状态
	var stateForm = getStateDoc('form');
	jsfw.$('sel_state_form').value = stateForm;
	if(""!=stateForm){
		afterStateSelForm(stateForm,"WEB");
	}
	jsfw.$('sel_state_formstate').value = (getStateDoc('formstate'));
	//APP表单和状态
	var appstateForm = getStateDoc('appform');
	jsfw.$('sel_state_form_app').value = appstateForm;
	if(""!=appstateForm){
		afterStateSelForm(appstateForm,"APP");
	}
	jsfw.$('sel_state_formstate_app').value = (getStateDoc('appformstate'));

}

//读写环节意见属性
function setStateNotion(sAttr,sVal){
	var oNode=oFlow.getCurrentObj();
	if (oNode.nodeName=='process-template') return;
	if (oNode.nodeName=='transition') return;
	var stateNotion = oNode.getElementsByTagName('stateNotion')[0];
	if ((sAttr=='availabel') && (sVal!='0')){
		/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////Witson
		var arr=oFlow.getAttr('/notion','notions').split(';').delEmpty();
		if(arr.length==0){
			jsfw.WebUI.PopMsg.newMsg('请先<b><a href="javascript:jsfw.$(\'tabProDoc\').selectGroup(1);oFlow.selItem(\'\');void(0);">配置流程意见</a></b>!','提示',5000);
			jsfw.$('stateNotion_availabel0').checked=true;
			return;
		}else{
			if (getStateNotion('label')==''){
				setStateNotion('label',arr[0]);
				setStateNotion('sequence','1');
			}
			if (getStateNotion('highlight')=='') setStateNotion('highlight','0');
			if (getStateNotion('withOrg')=='') setStateNotion('withOrg','0');
			if (getStateNotion('withSignature')=='') setStateNotion('withSignature','0');
			if (getStateNotion('dialog')=='') setStateNotion('dialog','0');
			if (getStateNotion('otherOrg')=='') setStateNotion('otherOrg','2');					
			if (getStateNotion('opinionAuto')=='') setStateNotion('opinionAuto','0');
      if (getStateNotion('fillBack')=='') setStateNotion('fillBack','0');
		}
	} else if(sAttr=='availabel') {
		$("#stateNotion_dialog0").attr("checked",true);
		setStateNotion('dialog','0');
	}
	if (sAttr=='availabel') jsfw.$('fldStateNotion').style.display = (sVal!='0')?'':'none';
	oFlow.setAttr(stateNotion,sAttr,sVal);
}
function getStateNotion(sAttr){
	var oNode=oFlow.getCurrentObj();
	if (oNode.nodeName=='process-template') return '';
	if (oNode.nodeName=='transition') return '';
	return oFlow.getAttr(oNode.getElementsByTagName('stateNotion')[0], sAttr);
}
function funStateNotionLoad(){
	if (getStateNotion('availabel')=='') setStateNotion('availabel','0');
	jsfw.$('stateNotion_availabel'+ getStateNotion('availabel')).checked=true; 
	jsfw.$('fldStateNotion').style.display = (getStateNotion('availabel')!='0')?'':'none';

    //是否必填意见回填
    if(getStateNotion('fillBack') && getStateNotion('fillBack') != '0'){
        jsfw.$('stateNotion_fillBack'+ getStateNotion('fillBack')).checked=true;
    }else{
        jsfw.$('stateNotion_fillBack0').checked=true;
	}

    //意见类型回填
    if(getStateNotion('opinionType') && getStateNotion('opinionType') != ''){
        jsfw.$('stateNotion_opinionType').value = getStateNotion('opinionType');
    }else{
        jsfw.$('stateNotion_opinionType').value = "";
    }
	var arr=oFlow.getAttr('/notion','notions').split(';').delEmpty();
	var sHTML='<select name="stateNotion_label" id="stateNotion_label" onchange="setStateNotion(\'label\',this.value);setStateNotion(\'sequence\', this.selectedIndex+1);">';
	for (var i=0; i<arr.length; i++){
		sHTML += '<option value="'+arr[i]+'">'+arr[i]+'</option>';
	}
	sHTML += '</select>';
	jsfw.$('stateNotion_divLabel').innerHTML=sHTML;
	
	//----读取单位  意见必须填写
	var arrPos = loadPositionArr();
	var sHTML_pos='<select name="stateNotion_draftMustWritePos" id="stateNotion_draftMustWritePos" onchange="setStateNotion(\'draftMustWritePos\',this.value);">';
	sHTML_pos += '<option value=""></option>';
	for (var i=0; i<arrPos.length; i++){
		sHTML_pos += '<option value="'+arrPos[i][0]+'">'+arrPos[i][1]+'</option>';
	}
	sHTML_pos += '</select>';
	jsfw.$('stateNotion_divDraftMustWritePos').innerHTML=sHTML_pos;

	if (getStateNotion('label')!='') jsfw.$('stateNotion_label').value = getStateNotion('label');
	if (getStateNotion('draftMustWritePos')!='') jsfw.$('stateNotion_draftMustWritePos').value = getStateNotion('draftMustWritePos');
	
	jsfw.$('stateNotion_highlight').checked = getStateNotion('highlight')=='1';
	jsfw.$('stateNotion_withOrg').checked = getStateNotion('withOrg')=='1';
	jsfw.$('stateNotion_withSignature').checked = getStateNotion('withSignature')=='1';
	try{
		jsfw.$('stateNotion_otherOrg'+getStateNotion('otherOrg')).checked = true;
	}catch(e){}
	try{
		jsfw.$('stateNotion_dialog'+getStateNotion('dialog')).checked = true;
	}catch(e){}
	try{
		jsfw.$('stateNotion_opinionAuto'+getStateNotion('opinionAuto')).checked = true;
	}catch(e){}
	jsfw.$('stateNotion_signReplacedByOpinion').value = getStateNotion('signReplacedByOpinion');

	jsfw.$('stateNotion_opinionDefaultValue').value = getStateNotion('opinionDefaultValue');
	jsfw.$('stateNotion_opinionDeFaultMode' + getStateNotion('opinionDeFaultMode')).checked=true;
	jsfw.$('stateNotion_opinionDeFaultLevel' + getStateNotion('opinionDeFaultLevel')).checked=true;  
	jsfw.$('stateNotion_opinionDeFaultDeptID').value = getStateNotion('opinionDeFaultDeptID');
	jsfw.$('stateNotion_leaderOpinion' + (getStateNotion('LeaderOpinionFlag')?getStateNotion('LeaderOpinionFlag'):"0")).checked=true;
	jsfw.$('stateNotion_leaderOpinionLen').value = getStateNotion('leaderOpinionLen');
	jsfw.$('stateNotion_leaderOpinionCondition').value = getStateNotion('leaderOpinionCondition');		
}
//读写环节文档属性
function setStateDoc(sAttr,sVal){
	var oNode=oFlow.getCurrentObj();
	if (oNode.nodeName=='process-template') return;
	if (oNode.nodeName=='transition') return;
	var stateNotion = oNode.getElementsByTagName('stateDoc')[0];
	oFlow.setAttr(stateNotion,sAttr,sVal);
	if(sAttr=='docEdit')oFlow.setAttr(oNode,"editAllowed",sVal);
}
function getStateDoc(sAttr){
	var oNode=oFlow.getCurrentObj();
	if (oNode.nodeName=='process-template') return '';
	if (oNode.nodeName=='transition') return '';
	return oFlow.getAttr(oNode.getElementsByTagName('stateDoc')[0], sAttr);
}
//////指派
function loadStateAssignment(){
	var oNodes=oFlow.getCurrentObj().selectNodes('assignment');
	sHTML = '<select id="sel_State_assignment" size="9" style="width:280" ondblclick="editStateAssignment(this.value)">';
	for (var i=0; i<oNodes.length; i++){
		var sType=oFlow.getAttr(oNodes[i],'type');
		var sTypeName='';
		if (sType.indexOf("PositionAssignment")!=-1) sTypeName='职位指派';
		if (sType.indexOf("RoleAssignment")!=-1) sTypeName='角色指派';
		if (sType.indexOf("GroupAssignment")!=-1) sTypeName='群组指派';
		if (sType.indexOf("UserAssignment")!=-1) sTypeName='用户指派';
		if (sType.indexOf("StepAssignment")!=-1) sTypeName='步骤指派';
		if (sType.indexOf("SubPositionAssignment")!=-1) sTypeName='跨单位职位指派';
		if (sType.indexOf("SubRoleAssignment")!=-1) sTypeName='跨单位角色指派';
		if (sType.indexOf("RemoveAssignment")!=-1) sTypeName='排除指派';
		if (sType.indexOf("UnitAssignment")!=-1) sTypeName='所有单位指派';
        if (sType.indexOf("DeptAssignment")!=-1) sTypeName='单位全员指派';
		sHTML += '<option value="'+i+'">'+sTypeName+'</option>';
	}
	sHTML += '</select>';
	jsfw.$('td_state_assignment').innerHTML = sHTML;
}
function addStateAssignment(sType,width,height){
	var width = jt.getDefVal(width,250);
	var height = jt.getDefVal(height,200);
	var oNode = oFlow.getCurrentObj();
	var oNodes= oNode.selectNodes('assignment');
	var oSel=jsfw.$('sel_State_assignment');
	
	if (sType=='UserAssignment'){
		for (var i=0; i<oNodes.length; i++){
			var strTem=oFlow.getAttr(oNodes[i],'type');
			if (strTem.indexOf(sType)!=-1){
				oSel.options[i].selected=true;
				jsfw.WebUI.PopMsg.newMsg('只能有一个用户指派!','提示');
				return;
			}
		}
		//bug,同时生成两个用户指派
		//oFlow.appendXmlChildNode(oNode,'<assignment type="com.yr.gap.engine.core.process.assignment.UserAssignment"><arg name="user">$drafter</arg></assignment>');
		//loadStateAssignment();
		//var oSel=jsfw.$('sel_State_assignment');
		//oSel.options[oSel.options.length-1].selected=true;
		showDialog('winFlow'+sType, '配置','flowState'+sType+'.html?parVal=-1',width,height,null,null,true);
	}else if (sType=='UnitAssignment'){
		oFlow.appendXmlChildNode(oNode,'<assignment type="com.zefu.zfos.flowEngine.service.assignment.UnitAssignment"></assignment>');
		loadStateAssignment();
		var oSel=jsfw.$('sel_State_assignment');
		oSel.options[oSel.options.length-1].selected=true;
	}else if(sType=="DeptAssignment"){
        oFlow.appendXmlChildNode(oNode,'<assignment type="com.zefu.zfos.flowEngine.service.assignment.DeptAssignment"></assignment>');
        loadStateAssignment();
        var oSel=jsfw.$('sel_State_assignment');
        oSel.options[oSel.options.length-1].selected=true;
	}else{
		showDialog('winFlow'+sType, '配置','flowState'+sType+'.html?parVal=-1',width,height,null,null,true);
	}
}
function addStateAssignment_After(strXML,idx){
	var oNode = oFlow.getCurrentObj();
	var oNodes= oNode.selectNodes('assignment');
	if (idx==-1){
		oFlow.appendXmlChildNode(oNode,strXML);
		loadStateAssignment();
		var oSel=jsfw.$('sel_State_assignment');
		oSel.options[oSel.options.length-1].selected=true;
	}else{
		oFlow.replaceXmlChildNode(oNode,strXML,oNodes[idx]);
	}
}
function delStateAssignment(){
	if (jsfw.$('sel_State_assignment').value=='') return;
	var idx=parseInt(jsfw.$('sel_State_assignment').value);
	var oNode = oFlow.getCurrentObj();
	var oNodes= oNode.selectNodes('assignment');
	oNode.removeChild(oNodes[idx]);
	loadStateAssignment();
	var oSel=jsfw.$('sel_State_assignment');
	if (oSel.options.length==0) return;
	if (idx>oSel.options.length-1) {
		oSel.options[oSel.options.length-1].selected=true;
	}else{
		oSel.options[idx].selected=true;
	}
}
function editStateAssignment(idx){
	if (idx=='') return;
	var oNode = oFlow.getCurrentObj();
	var oNodes= oNode.selectNodes('assignment');
	var sType = null;
	sType =  oFlow.getAttr(oNodes[idx],'type').substr(oFlow.getAttr(oNodes[idx],'type').lastIndexOf(".")+1);
	
	if (sType=='GroupAssignment'){
		showDialog('winFlow'+sType, '配置','flowState'+sType+'.html?parVal='+idx,500,400);
	} else	if (sType!='UnitAssignment' && sType!='DeptAssignment' ) {
		showDialog('winFlow'+sType, '配置','flowState'+sType+'.html?parVal='+idx,500,400);
	}
}
///////知会
//读写环节知会属性
function setStateNotify(sAttr,sVal){
	var oNode=oFlow.getCurrentObj();
	if (oNode.nodeName=='process-template') return;
	if (oNode.nodeName=='transition') return;
	var stateNotify = oNode.getElementsByTagName('stateNotify')[0];
	oFlow.setAttr(stateNotify,sAttr,sVal);
}
function getStateNotify(sAttr){
	var oNode=oFlow.getCurrentObj();
	if (oNode.nodeName=='process-template') return '';
	if (oNode.nodeName=='transition') return '';
	return oFlow.getAttr(oNode.getElementsByTagName('stateNotify')[0], sAttr);
}
function funNotifyLoad(){

	jsfw.$('stateNotify_notifyOpinionControl' + (getStateNotify('notifyOpinionControl')?getStateNotify('notifyOpinionControl'):"0")).checked=true;
	jsfw.$('stateNotify_notifyOpinionLen').value = getStateNotify('notifyOpinionLen');
	jsfw.$('stateNotify_notifyOpinionCondition').value = getStateNotify('notifyOpinionCondition');
}
function funNotifyConditionLoad(){
	var oNode=oFlow.getCurrentObj();
	var stateNotify = oNode.getElementsByTagName('stateNotify')[0];
	var arr=oFlow.getAttr(stateNotify,'notifyCondition').split('@');
	var sHTML='<select size="15" id="sel_notifyCondition" style="width:180" onchange="funNotifyConditionShow()">';
	for (var i=0; i<arr.length; i++){
		sHTML += '<option value="'+arr[i]+'">'+arr[i]+'</option>';
	}
	sHTML += '</select>';
	jsfw.$('td_StateNotifyCondition').innerHTML = sHTML;
	funNotifyConditionShow();
}
function funNotifyConditionSet(){
	var oSel=jsfw.$('sel_notifyCondition');
	var oNode=oFlow.getCurrentObj();
	var stateNotify = oNode.getElementsByTagName('stateNotify')[0];
	var sR='';
	var idx=0;
	for (i = 0; i < oSel.options.length ; i++){
		if (sR!='') sR+='@';
		sR += oSel.options[i].value;
		if (oSel.options[i].selected) idx=i;
	}
	oFlow.setAttr(stateNotify,'notifyCondition',sR);
	funNotifyConditionLoad();
	var oSel=jsfw.$('sel_notifyCondition');
	if (oSel.options.length!=0){
		if (idx>oSel.options.length-1) idx=oSel.options.length-1;
		oSel.options[idx].selected=true;
	}
	funNotifyConditionShow();
}
function funNotifyConditionAdd(){
	var str='';
	for (var i=0; i<8; i++){
		if (i>0) str+='~';
		str += jsfw.$('notifyCondition_'+i).value;
	}
	var oSel=jsfw.$('sel_notifyCondition');
	var temOption =  new Option(str, str);
	oSel.options[oSel.options.length] = temOption;
	oSel.options[oSel.options.length-1].selected = true;
	funNotifyConditionSet();
}
function funNotifyConditionEdit(){
	var str='';
	for (var i=0; i<8; i++){
		if (i>0) str+='~';
		str += jsfw.$('notifyCondition_'+i).value;
	}
	var oSel=jsfw.$('sel_notifyCondition');
	for (i = 0; i <oSel.options.length ; i++)
	if (oSel.options[i].selected) {
		oSel.options[i].text = str;
		oSel.options[i].value = str;
	}
	funNotifyConditionSet();
}
function funNotifyConditionDel(){
	var oSel=jsfw.$('sel_notifyCondition');
	for (i = oSel.options.length-1; i >-1 ; i--)
		if (oSel.options[i].selected) oSel.options[i] = null;
	funNotifyConditionSet();
}
function funNotifyConditionShow(){
	var str=jsfw.$('sel_notifyCondition').value;
	if (str==''){
		for (var i=0; i<8; i++) jsfw.$('notifyCondition_'+i).value='';
	}else{
		var arr=str.split('~');
		for (var i=0; i<arr.length; i++) jsfw.$('notifyCondition_'+i).value=arr[i];
	}
}

///////流程控制
function funProcessControlLoad(){
	var arr= getStateDoc('processControl').split(';').delEmpty();
	var sHTML='';
	sHTML += '<select size="15" id="sel_processControl" style="width:150" onchange="funProcessControlShow()">';
	for (var i=0; i<arr.length; i++){
		sHTML += '<option value="'+arr[i]+'">'+arr[i]+'</option>';
	}
	sHTML += '</select>';
	jsfw.$('td_StateProcessControl').innerHTML = sHTML;
	funProcessControlShow();
}
function funProcessControlShow(){
	var oSel = jsfw.$('sel_processControl');
	var str = oSel.value;
	if (str=='') return;
	var arr = str.split('~');
	jsfw.$('processControl_0').value = arr[0];
	jsfw.$('processControl_1').value = arr[1];
	jsfw.$('processControl_2'+arr[2]).checked=true;
	var arrTem=arr[3].split(':');
	for (var i=0; i<4; i++) jsfw.$('processControl_3'+i).checked=false;
	try{
		for (var i=0; i<arrTem.length; i++) jsfw.$('processControl_3'+arrTem[i]).checked=true;
	}catch(e){}
	jsfw.$('processControl_4'+arr[4]).checked=true;
	jsfw.$('processControl_5').value = arr[5];
	jsfw.$('processControl_6').value = arr[6];
}
function getProcessControlItemStr(){
	var str='';
	str += jsfw.$('processControl_0').value + '~' + jsfw.$('processControl_1').value + '~';
	if (jsfw.$('processControl_20').checked) str += '0';
	if (jsfw.$('processControl_21').checked) str += '1';
	if (jsfw.$('processControl_22').checked) str += '2';
	str += '~';
	var strSub='';
	for (var i=0; i<4; i++){
		if (jsfw.$('processControl_3'+i).checked){
			if (strSub!='') strSub+=':';
			strSub += i.toString();
		}
	}
	str += strSub + '~';
	str += (jsfw.$('processControl_40').checked?'0':'1') + '~';
	str += jsfw.$('processControl_5').value + '~' + jsfw.$('processControl_6').value;
	return str;
}
function funProcessControlAdd(){
	var oSel = jsfw.$('sel_processControl');
	var str=getProcessControlItemStr();
	var temOption =  new Option(str, str);
	oSel.options[oSel.options.length] = temOption;
	oSel.options[oSel.options.length-1].selected = true;
	funProcessControlSet();
}
function funProcessControlEdit(){
	var oSel = jsfw.$('sel_processControl');
	var str=getProcessControlItemStr();
	for (i = 0; i <oSel.options.length ; i++)
	if (oSel.options[i].selected) {
		oSel.options[i].text = str;
		oSel.options[i].value = str;
		return;
	}
	funProcessControlSet();
}
function funProcessControlDel(){
	var oSel = jsfw.$('sel_processControl');
	for (i = oSel.options.length-1; i >-1 ; i--)
		if (oSel.options[i].selected) oSel.options[i] = null;
	if (oSel.options.length>0) oSel.options[0].selected=true;
	funProcessControlShow();
	funProcessControlSet();
}
function funProcessControlSet(){
	var oSel = jsfw.$('sel_processControl');
	var sR='';
	for (i = 0; i < oSel.options.length ; i++){
		if (sR!='') sR+=';';
		sR += oSel.options[i].value;
	}
	setStateDoc('processControl',sR);
}

//////////领导意见通知人员公式
function funNotionWfLeaderConditionLoad(){
	var oNode=oFlow.getCurrentObj();
	var stateNotion = oNode.getElementsByTagName('stateNotion')[0];
	var arr=oFlow.getAttr(stateNotion,'wfStateLeaderOpinion').split('@');
	var sHTML='<select size="15" id="sel_notion_wfStateLeaderOpinion" style="width:180;overflow:scroll" onchange="funNotionWfLeaderConditionShow()">';
	for (var i=0; i<arr.length; i++){
		if (!arr[i])
			continue;
		sHTML += '<option value="'+arr[i]+'">'+arr[i]+'</option>';
	}
	sHTML += '</select>';
	jsfw.$('td_StateNotion_wfLeader_Condition').innerHTML = sHTML;
	funNotionWfLeaderConditionShow();
}
function funNotionWfLeaderConditionAdd(){
	var str='';
	for (var i=0; i<5; i++){
		if (i>0) str+='~';
		str += jsfw.$('stateNotion_wfStateLeaderOpinion_'+i).value;
	}
	var oSel=jsfw.$('sel_notion_wfStateLeaderOpinion');
	var temOption =  new Option(str, str);
	oSel.options[oSel.options.length] = temOption;
	oSel.options[oSel.options.length-1].selected = true;
	funNotionWfLeaderConditionSet();
}
function funNotionWfLeaderConditionEdit(){
	var str='';
	for (var i=0; i<5; i++){
		if (i>0) str+='~';
		str += jsfw.$('stateNotion_wfStateLeaderOpinion_'+i).value;
	}
	var oSel=jsfw.$('sel_notion_wfStateLeaderOpinion');
	for (i = 0; i <oSel.options.length ; i++)
	if (oSel.options[i].selected) {
		oSel.options[i].text = str;
		oSel.options[i].value = str;
	}
	funNotionWfLeaderConditionSet();
}
function funNotionWfLeaderConditionDel(){
	var oSel=jsfw.$('sel_notion_wfStateLeaderOpinion');
	for (i = oSel.options.length-1; i >-1 ; i--)
		if (oSel.options[i].selected) oSel.options[i] = null;
	funNotionWfLeaderConditionSet();
}
function funNotionWfLeaderConditionShow(){
	var str=jsfw.$('sel_notion_wfStateLeaderOpinion').value;
	if (str==''){
		for (var i=0; i<5; i++) jsfw.$('stateNotion_wfStateLeaderOpinion_'+i).value='';
	}else{
		var arr=str.split('~');
		for (var i=0; i<arr.length; i++) jsfw.$('stateNotion_wfStateLeaderOpinion_'+i).value=arr[i];
	}
}
function funNotionWfLeaderConditionSet(){
	var oSel=jsfw.$('sel_notion_wfStateLeaderOpinion');
	var oNode=oFlow.getCurrentObj();
	var stateNotion = oNode.getElementsByTagName('stateNotion')[0];
	var sR='';
	var idx=0;
	for (i = 0; i < oSel.options.length ; i++){
		if (i>0) sR+='@';
		sR += oSel.options[i].value;
		if (oSel.options[i].selected) idx=i;
	}
	oFlow.setAttr(stateNotion,'wfStateLeaderOpinion',sR);
	funNotionWfLeaderConditionLoad();
	var oSel=jsfw.$('sel_notion_wfStateLeaderOpinion');
	if (oSel.options.length!=0){
		if (idx>oSel.options.length-1) idx=oSel.options.length-1;
		oSel.options[idx].selected=true;
	}
	funNotionWfLeaderConditionShow();
}
///////////////////////////

//////////自动意见综合公式
function funNotionOpinionAllFormulaConditionLoad(){
	var oNode=oFlow.getCurrentObj();
	var stateNotion = oNode.getElementsByTagName('stateNotion')[0];
	var arr=oFlow.getAttr(stateNotion,'opinionAllFormula').split('@');
	var sHTML='<select size="15" id="sel_notion_opinionAllFormula" style="width:180;overflow:scroll" onchange="funNotionOpinionAllFormulaConditionShow()">';
	for (var i=0; i<arr.length; i++){
		if (!arr[i])
			continue;
		sHTML += '<option value="'+arr[i]+'">'+arr[i]+'</option>';
	}
	sHTML += '</select>';
	jsfw.$('td_StateNotion_opinionAllFormula').innerHTML = sHTML;
	funNotionOpinionAllFormulaConditionShow();
}
function funNotionOpinionAllFormulaConditionAdd(){
	var str='';
	for (var i=0; i<6; i++){
		if (i>0) str+='~';
		str += jsfw.$('stateNotion_opinionAllFormula'+i).value;
	}
	var oSel=jsfw.$('sel_notion_opinionAllFormula');
	var temOption =  new Option(str, str);
	oSel.options[oSel.options.length] = temOption;
	oSel.options[oSel.options.length-1].selected = true;
	funNotionOpinionAllFormulaConditionSet();
}
function funNotionOpinionAllFormulaConditionEdit(){
	var str='';
	for (var i=0; i<6; i++){
		if (str!='') str+='~';
		str += jsfw.$('stateNotion_opinionAllFormula'+i).value;
	}
	var oSel=jsfw.$('sel_notion_opinionAllFormula');
	for (i = 0; i <oSel.options.length ; i++)
	if (oSel.options[i].selected) {
		oSel.options[i].text = str;
		oSel.options[i].value = str;
	}
	funNotionOpinionAllFormulaConditionSet();
}
function funNotionOpinionAllFormulaConditionDel(){
	var oSel=jsfw.$('sel_notion_opinionAllFormula');
	for (i = oSel.options.length-1; i >-1 ; i--)
		if (oSel.options[i].selected) oSel.options[i] = null;
	funNotionOpinionAllFormulaConditionSet();
}
function funNotionOpinionAllFormulaConditionShow(){
	var str=jsfw.$('sel_notion_opinionAllFormula').value;
	if (str==''){
		for (var i=0; i<6; i++) jsfw.$('stateNotion_opinionAllFormula'+i).value='';
	}else{
		var arr=str.split('~');
		for (var i=0; i<arr.length; i++) jsfw.$('stateNotion_opinionAllFormula'+i).value=arr[i];
	}
}
function funNotionOpinionAllFormulaConditionSet(){
	var oSel=jsfw.$('sel_notion_opinionAllFormula');
	var oNode=oFlow.getCurrentObj();
	var stateNotion = oNode.getElementsByTagName('stateNotion')[0];
	var sR='';
	var idx=0;
	for (i = 0; i < oSel.options.length ; i++){
		if (sR!='') sR+='@';
		sR += oSel.options[i].value;
		if (oSel.options[i].selected) idx=i;
	}
	oFlow.setAttr(stateNotion,'opinionAllFormula',sR);
	funNotionOpinionAllFormulaConditionLoad();
	var oSel=jsfw.$('sel_notion_opinionAllFormula');
	if (oSel.options.length!=0){
		if (idx>oSel.options.length-1) idx=oSel.options.length-1;
		oSel.options[idx].selected=true;
	}
	funNotionOpinionAllFormulaConditionShow();
}
/////////////////////

//////映射节点
function setStateFormMapFlow(sAttr,sVal){
	var oNode=oFlow.getCurrentObj();
	if (oNode.nodeName=='process-template') return;
	if (oNode.nodeName=='transition') return;
	var stateFormFlowMap = oNode.getElementsByTagName('stateFormFlowMap')[0];
	oFlow.setAttr(stateFormFlowMap,sAttr,sVal);
}
function getStateFormMapFlow(sAttr){
	var oNode=oFlow.getCurrentObj();
	if (oNode.nodeName=='process-template') return '';
	if (oNode.nodeName=='transition') return '';
	return oFlow.getAttr(oNode.getElementsByTagName('stateFormFlowMap')[0], sAttr);
}
/////表单信息映射到流程环节默认人员规则配置
function funFormMapFlowWfStateDefaultRuleDefaultConditionInit(){
	for (var i=0;i<2;i++) {
		jsfw.$('formMapFlow_wfStateDefaultRule_'+i).value='';
	}	
}
function funFormMapFlowWfStateDefaultRuleDefaultConditionLoad(s){
	var arr=new Array();
	if (s && s != '')
		arr=s.split('^');
	//第一个选择
	var firstOption=0;
	var sHTML='提取默认人员的规则：<br/><select size="5" id="formMapFlow_wfStateDefaultRule_2" style="width:180;overflow:scroll" onchange="funFormMapFlowWfStateDefaultRuleDefaultConditionShow()">';
	for (var i=0; i<arr.length; i++){
		if (!arr[i])
			continue;
		sHTML += '<option value="'+arr[i]+'"'+(firstOption==0?' selected':'')+'>'+arr[i]+'</option>';

		firstOption++;
	}
	sHTML += '</select>';
	jsfw.$('td_formMapFlow_wfStateDefaultRule_default').innerHTML = sHTML;
	funFormMapFlowWfStateDefaultRuleDefaultConditionShow();
	
}
function funFormMapFlowWfStateDefaultRuleDefaultConditionShow(){
	var str=jsfw.$('formMapFlow_wfStateDefaultRule_2').value;
	if (str==''){
		for (var i=0; i<6; i++) {jsfw.$('formMapFlow_wfStateDefaultRule_df_'+i).value='';}
	}else{
		var arr=str.split('$');
		for (var i=0; i<arr.length; i++) jsfw.$('formMapFlow_wfStateDefaultRule_df_'+i).value=arr[i];
	}
}
function funFormMapFlowWfStateDefaultRuleDefaultConditionSet(){
	var oSel=jsfw.$('formMapFlow_wfStateDefaultRule_2');
	
	var sR='';
	var idx=0;
	for (i = 0; i < oSel.options.length ; i++){
		if (i>0) sR+='^';
		sR += oSel.options[i].value;
		if (oSel.options[i].selected) idx=i;
	}
	
	var oSel=jsfw.$('formMapFlow_wfStateDefaultRule_2');
	if (oSel.options.length!=0){
		if (idx>oSel.options.length-1) idx=oSel.options.length-1;
		oSel.options[idx].selected=true;
	}
	funFormMapFlowWfStateDefaultRuleDefaultConditionShow();
}
function funFormMapFlowWfStateDefaultRuleDefaultConditionAdd(){
	var str='';
	for (var i=0; i<6; i++){
		if (i>0) str+='$';
		str += jsfw.$('formMapFlow_wfStateDefaultRule_df_'+i).value;
	}
	var oSel=jsfw.$('formMapFlow_wfStateDefaultRule_2');
	var temOption =  new Option(str, str);
	oSel.options[oSel.options.length] = temOption;
	oSel.options[oSel.options.length-1].selected = true;
	funFormMapFlowWfStateDefaultRuleDefaultConditionSet();
}
function funFormMapFlowWfStateDefaultRuleDefaultConditionEdit(){
	var str='';
	for (var i=0; i<6; i++){
		if (i>0) str+='$';
		str += jsfw.$('formMapFlow_wfStateDefaultRule_df_'+i).value;
	}
	var oSel=jsfw.$('formMapFlow_wfStateDefaultRule_2');
	for (i = 0; i <oSel.options.length ; i++)
	if (oSel.options[i].selected) {
		oSel.options[i].text = str;
		oSel.options[i].value = str;
	}
	funFormMapFlowWfStateDefaultRuleDefaultConditionSet();
}
function funFormMapFlowWfStateDefaultRuleDefaultConditionDel(){
	var oSel=jsfw.$('formMapFlow_wfStateDefaultRule_2');
	for (i = oSel.options.length-1; i >-1 ; i--)
		if (oSel.options[i].selected) oSel.options[i] = null;
	funFormMapFlowWfStateDefaultRuleDefaultConditionSet();
}

function funFormMapFlowWfStateDefaultRuleConditionLoad(){
	jsfw.$('formMapFlow_wfStateDefaultRuleDesc').value = getStateFormMapFlow('wfStateDefaultRuleDesc');
	funFormMapFlowWfStateDefaultRuleDefaultConditionInit();
	var arr=getStateFormMapFlow('wfStateDefaultRule').split('@');
	var sHTML='流程路径默认人员规则：<br/><select size="25" id="sel_formMapFlow_wfStateDefaultRule" style="width:180;" onclick="funFormMapFlowWfStateDefaultConditionShow()" onchange="funFormMapFlowWfStateDefaultConditionShow()">';
	for (var i=0; i<arr.length; i++){
		if (!arr[i])
			continue;
		sHTML += '<option value="'+arr[i]+'">'+arr[i]+'</option>';
	}
	sHTML += '</select>';
	jsfw.$('td_formMapFlow_wfStateDefaultRule').innerHTML = sHTML;
	funFormMapFlowWfStateDefaultRuleDefaultConditionLoad();
}
function funFormMapFlowWfStateDefaultConditionShow(){
	var str=jsfw.$('sel_formMapFlow_wfStateDefaultRule').value;
	if (str==''){
		for (var i=0; i<2; i++) jsfw.$('formMapFlow_wfStateDefaultRule_'+i).value='';
		funFormMapFlowWfStateDefaultRuleDefaultConditionLoad('');
	}else{
		var arr=str.split('~');
		for (var i=0; i<arr.length-1; i++) jsfw.$('formMapFlow_wfStateDefaultRule_'+i).value=arr[i];		
		funFormMapFlowWfStateDefaultRuleDefaultConditionLoad(arr[arr.length-1]);
	}
}
function funFormMapFlowWfStateDefaultRuleConditionAdd(){
	var str='';
	for (var i=0; i<3; i++){
		if (i>0) str+='~';
		
		if (i == 2){
			var ss = '';
			var fwd = jsfw.$('formMapFlow_wfStateDefaultRule_'+i);
			for (j=0; j< fwd.options.length; j++) {
				if (ss != '') ss+='^'				
				ss += fwd.options(j).value;
			}
			str += ss;
		} else
			str += jsfw.$('formMapFlow_wfStateDefaultRule_'+i).value;
	}
	var oSel=jsfw.$('sel_formMapFlow_wfStateDefaultRule');
	var temOption =  new Option(str, str);
	oSel.options[oSel.options.length] = temOption;
	oSel.options[oSel.options.length-1].selected = true;
	funFormMapFlowWfStateDefaultRuleConditionSet();
	funFormMapFlowWfStateDefaultRuleDefaultConditionSet();
}
function funFormMapFlowWfStateDefaultRuleConditionEdit(){
	var str='';
	for (var i=0; i<3; i++){
		if (i>0) str+='~';
		if (i == 2){
			var ss = '';
			var fwd = jsfw.$('formMapFlow_wfStateDefaultRule_'+i);
			for (j=0; j< fwd.options.length; j++) {
				if (ss != '') ss+='^'				
				ss += fwd.options(j).value;
			}
			str += ss;
		} else
			str += jsfw.$('formMapFlow_wfStateDefaultRule_'+i).value;
	}
	var oSel=jsfw.$('sel_formMapFlow_wfStateDefaultRule');
	for (i = 0; i <oSel.options.length ; i++)
	if (oSel.options[i].selected) {
		oSel.options[i].text = str;
		oSel.options[i].value = str;
	}
	funFormMapFlowWfStateDefaultRuleConditionSet();
	funFormMapFlowWfStateDefaultRuleDefaultConditionSet();
}
function funFormMapFlowWfStateDefaultRuleConditionDel(){
	var oSel=jsfw.$('sel_formMapFlow_wfStateDefaultRule');
	for (i = oSel.options.length-1; i >-1 ; i--)
		if (oSel.options[i].selected) oSel.options[i] = null;
	funFormMapFlowWfStateDefaultRuleConditionSet();
	funFormMapFlowWfStateDefaultRuleDefaultConditionSet();
}
function funFormMapFlowWfStateDefaultRuleConditionSet(){
	var oSel=jsfw.$('sel_formMapFlow_wfStateDefaultRule');
	
	var sR='';
	var idx=0;
	for (i = 0; i < oSel.options.length ; i++){
		if (sR!='') sR+='@';
		sR += oSel.options[i].value;
		if (oSel.options[i].selected) idx=i;
	}
	setStateFormMapFlow('wfStateDefaultRule',sR);
	funFormMapFlowWfStateDefaultRuleConditionLoad();
	var oSel=jsfw.$('sel_formMapFlow_wfStateDefaultRule');
	if (oSel.options.length!=0){
		if (idx>oSel.options.length-1) idx=oSel.options.length-1;
		oSel.options[idx].selected=true;
	}
	funFormMapFlowWfStateDefaultConditionShow();
}
////////////////////////////
//////流程信息映射到表单信息规则配置
function funFlowMapFormWfStateBackFillRuleInit(){
	for (var i=0; i<2; i++) jsfw.$('flowMapForm_wfStateBackFillRule_'+i).value='';
	var selFr = jsfw.$('flowMapForm_wfStateBackFillRule_2');
	for (var i=0; i<selFr.length;){
		selFr.remove(0);
	}
}
function funFlowMapFormWfStateBackFillRuleLoad(){
	jsfw.$('flowMapForm_wfStateBackFillRuleDesc').value = getStateFormMapFlow('wfStateBackFillRuleDesc');
	
	var arr=getStateFormMapFlow('wfStateBackFillRule').split('@');
	var sHTML='<select size="15" id="sel_flowMapForm_wfStateBackFillRule" style="width:180;" onchange="funFlowMapFormWfStateBackFillRuleShow();">';
	for (var i=0; i<arr.length; i++){
		if (!arr[i])
			continue;
		sHTML += '<option value="'+arr[i]+'">'+arr[i]+'</option>';
	}
	sHTML += '</select>';
	jsfw.$('td_flowMapForm_wfStateBackFillRule').innerHTML = sHTML;
	
}
function funShowDialogFlowMapFormWfStateBackFillRule() {
	showDialog('winFlowMapFormWfStateBackFillRule', '配置','flowMapFormWfStateBackFillRule.htm',460,230);
}

function funFlowMapFormWfStateBackFillRule_contentShow(){
	var ifr = getShowDialgIframe('winFlowMapFormWfStateBackFillRule');
	if (!ifr)
		return;
	ifr.flowMapForm_wfStateBackFillRule_ruleShow();
}

function funFlowMapFormWfStateBackFillRuleAdd(){
	var str='';
	for (var i=0; i<3; i++){
		if (i>0) str+='~';
		if (i == 2){
			var ss = '';
			var fr = jsfw.$('flowMapForm_wfStateBackFillRule_'+i);
			for (j=0; j< fr.options.length; j++) {
				if (ss != '') ss+='^'				
				ss += fr.options(j).value;
			}
			str += ss;
		} else
			str += jsfw.$('flowMapForm_wfStateBackFillRule_'+i).value;
	}
	var oSel=jsfw.$('sel_flowMapForm_wfStateBackFillRule');
	var temOption =  new Option(str, str);
	oSel.options[oSel.options.length] = temOption;
	oSel.options[oSel.options.length-1].selected = true;
	funFlowMapFormWfStateBackFillRuleSet();
}
function funFlowMapFormWfStateBackFillRuleEdit(){
	var str='';
	for (var i=0; i<3; i++){
		if (i>0) str+='~';
		if (i == 2){
			var ss = '';
			var selFr = jsfw.$('flowMapForm_wfStateBackFillRule_'+i);
			for (j=0; j< selFr.options.length; j++) {
				if (ss != '') ss+='^'				
				ss += selFr.options(j).value;
			}
			str += ss;
		} else
			str += jsfw.$('flowMapForm_wfStateBackFillRule_'+i).value;
	}
	var oSel=jsfw.$('sel_flowMapForm_wfStateBackFillRule');
	for (i = 0; i <oSel.options.length ; i++)
		if (oSel.options[i].selected) {
			oSel.options[i].text = str;
			oSel.options[i].value = str;
		}
	funFlowMapFormWfStateBackFillRuleSet();
}
function funFlowMapFormWfStateBackFillRuleDel(){
	var oSel=jsfw.$('sel_flowMapForm_wfStateBackFillRule');
	for (i = oSel.options.length-1; i >-1 ; i--)
		if (oSel.options[i].selected) oSel.options[i] = null;
	funFlowMapFormWfStateBackFillRuleSet();
}
function funFlowMapFormWfStateBackFillRuleSet(){
	var oSel=jsfw.$('sel_flowMapForm_wfStateBackFillRule');
	
	var sR='';
	var idx=0;
	for (i = 0; i < oSel.options.length ; i++){
		if (sR!='') sR+='@';
		sR += oSel.options[i].value;
		if (oSel.options[i].selected) idx=i;
	}
	setStateFormMapFlow('wfStateBackFillRule',sR);
	funFlowMapFormWfStateBackFillRuleLoad();
	var oSel=jsfw.$('sel_flowMapForm_wfStateBackFillRule');
	if (oSel.options.length!=0){
		if (idx>oSel.options.length-1) idx=oSel.options.length-1;
		oSel.options[idx].selected=true;
	}
	funFlowMapFormWfStateBackFillRuleShow();
}
function funFlowMapFormWfStateBackFillRuleShow(){
	var str=jsfw.$('sel_flowMapForm_wfStateBackFillRule').value;
	
	if (str==''){
		for (var i=0; i<2; i++) jsfw.$('flowMapForm_wfStateBackFillRule_'+i).value='';
		var selFr = jsfw.$('flowMapForm_wfStateBackFillRule_2');
		for (var i=0; i<selFr.length;){
			selFr.remove(0);
		}
	}else{
		var arr=str.split('~');
		for (var i=0; i<arr.length-1; i++) jsfw.$('flowMapForm_wfStateBackFillRule_'+i).value=arr[i];		
		var frstr =arr[arr.length-1];
		var frattr = frstr.split('^');
		var selFr = jsfw.$('flowMapForm_wfStateBackFillRule_2');
		for (var i=0; i<selFr.length;){
			selFr.remove(0);
		}
		for (var j=0; j<frattr.length; j++){
			var option = document.createElement("option");
			option.value = frattr[j];
			option.text = frattr[j];
			selFr.add(option);
		}
	}
}
///////////////////////////////
////意见信息映射到流程信息规则配置
function funOtionMapFlowRuleLoad(){
	jsfw.$('optionMapFlow_wfOpinionFlowRuleDesc').value = getStateFormMapFlow('wfOpinionFlowRuleDesc');
	var arr=getStateFormMapFlow('wfOpinionFlowRule').split('@');
	var sHTML='<select size="15" id="sel_optionMapFlow_wfOpinionFlowRule" style="width:180;" onchange="funOtionMapFlowRuleShow();">';
	for (var i=0; i<arr.length; i++){
		if (!arr[i])
			continue;
		sHTML += '<option value="'+arr[i]+'">'+arr[i]+'</option>';
	}
	sHTML += '</select>';
	jsfw.$('td_optionMapFlow_wfOpinionFlowRule').innerHTML = sHTML;
	funOtionMapFlowRuleShow();
}
function funShowDialogOtionMapFlowRuleContext() {
	showDialog('winOtionMapFlowRuleContext', '配置','otionMapFlowRuleContext.htm',360,150);
}
function funOtionMapFlowRuleContextShow(){
	var ifr = getShowDialgIframe('winOtionMapFlowRuleContext');
	if (!ifr)
		return;
	ifr.optionMapFlow_wfOpinionFlowRule_contextShow();
}
function funOtionMapFlowRuleAdd(){
	var str='';
	for (var i=0; i<3; i++){
		if (i>0) str+='~';
		if (i == 2){
			var ss = '';
			var fr = jsfw.$('optionMapFlow_wfOpinionFlowRule_'+i);
			for (j=0; j< fr.options.length; j++) {
				if (ss != '') ss+='$'				
				ss += fr.options(j).value;
			}
			str += ss;
		} else
			str += jsfw.$('optionMapFlow_wfOpinionFlowRule_'+i).value;
	}
	var oSel=jsfw.$('sel_optionMapFlow_wfOpinionFlowRule');
	var temOption =  new Option(str, str);
	oSel.options[oSel.options.length] = temOption;
	oSel.options[oSel.options.length-1].selected = true;
	funOtionMapFlowRuleSet();
}
function funOtionMapFlowRuledEdit(){
	var str='';
	for (var i=0; i<3; i++){
		if (i>0) str+='~';
		if (i == 2){
			var ss = '';
			var selFr = jsfw.$('optionMapFlow_wfOpinionFlowRule_'+i);
			for (j=0; j< selFr.options.length; j++) {
				if (ss != '') ss+='$'				
				ss += selFr.options(j).value;
			}
			str += ss;
		} else
			str += jsfw.$('optionMapFlow_wfOpinionFlowRule_'+i).value;
	}
	var oSel=jsfw.$('sel_optionMapFlow_wfOpinionFlowRule');
	for (i = 0; i <oSel.options.length ; i++)
		if (oSel.options[i].selected) {
			oSel.options[i].text = str;
			oSel.options[i].value = str;
		}
	funOtionMapFlowRuleSet();
}
function funOtionMapFlowRuleDel(){
	var oSel=jsfw.$('sel_optionMapFlow_wfOpinionFlowRule');
	for (i = oSel.options.length-1; i >-1 ; i--)
		if (oSel.options[i].selected) oSel.options[i] = null;
	funOtionMapFlowRuleSet();
}
function funOtionMapFlowRuleSet(){
	var oSel=jsfw.$('sel_optionMapFlow_wfOpinionFlowRule');
	
	var sR='';
	var idx=0;
	for (i = 0; i < oSel.options.length ; i++){
		if (sR!='') sR+='@';
		sR += oSel.options[i].value;
		if (oSel.options[i].selected) idx=i;
	}
	setStateFormMapFlow('wfOpinionFlowRule',sR);
	funOtionMapFlowRuleLoad();
	var oSel=jsfw.$('sel_optionMapFlow_wfOpinionFlowRule');
	if (oSel.options.length!=0){
		if (idx>oSel.options.length-1) idx=oSel.options.length-1;
		oSel.options[idx].selected=true;
	}
	funOtionMapFlowRuleShow();
}
function funOtionMapFlowRuleShow(){
	var str=jsfw.$('sel_optionMapFlow_wfOpinionFlowRule').value;
	
	if (str==''){
		for (var i=0; i<2; i++) jsfw.$('optionMapFlow_wfOpinionFlowRule_'+i).value='';
		var selFr = jsfw.$('optionMapFlow_wfOpinionFlowRule_2');
		for (var i=0; i<selFr.length;){
			selFr.remove(0);
		}
	}else{
		var arr=str.split('~');
		for (var i=0; i<arr.length-1; i++) jsfw.$('optionMapFlow_wfOpinionFlowRule_'+i).value=arr[i];		
		var frstr =arr[arr.length-1];
		var frattr = frstr.split('$');
		var selFr = jsfw.$('optionMapFlow_wfOpinionFlowRule_2');
		for (var i=0; i<selFr.length;){
			selFr.remove(0);
		}
		for (var j=0; j<frattr.length; j++){
			var option = document.createElement("option");
			option.value = frattr[j];
			option.text = frattr[j];
			selFr.add(option);
		}
	}
}
////////////////////////////////
//意见信息映射到基本信息规则配置
//得到信息规则配置的[意见信息交互规则]的iframe
function getOptionMapBaseWfobfrContextIfr(){
	return getShowDialgIframe('winOptionMapBaseWfobfrContext');
}
//得到[回填信息类容值]iframe
function getOptionMapBaseWfobfrContextInfoIfr(){
	return getShowDialgIframe('winOptionMapBaseWfobfrContextInfo');
}
function funOptionMapBaseWfOpinionBackFillRuleLoad(){
	jsfw.$('optionMapBase_wfOpinionBackFillRuleDesc').value = getStateFormMapFlow('wfOpinionBackFillRuleDesc');
	var arr=getStateFormMapFlow('wfOpinionBackFillRule').split('@');
	var sHTML='<select size="15" id="sel_optionMapBase_wfOpinionBackFillRule" style="width:180;" onchange="funOptionMapBaseWfOpinionBackFillRuleShow();">';
	for (var i=0; i<arr.length; i++){
		if (!arr[i])
			continue;
		sHTML += '<option value="'+arr[i]+'">'+arr[i]+'</option>';
	}
	sHTML += '</select>';
	jsfw.$('td_optionMapBase_wfOpinionBackFillRule').innerHTML = sHTML;
	funOptionMapBaseWfOpinionBackFillRuleShow();
}
function funShowDialogOptionMapBaseWfobfrContext(){
	showDialog('winOptionMapBaseWfobfrContext', '配置','optionMapBaseBackFillRuleContext.htm',330,360);
}
function funShowDialogOptionMapBaseWfobfrContextShow(){
	var contextIfr = getOptionMapBaseWfobfrContextIfr();
	if (! contextIfr)
		return;
	contextIfr.optionMapFlow_wfOpinionFlowRule_contextShow();
}
function funShowDialogOptionMapBaseWfobfrContextInfo(){
	var intTem = parseInt((document.body.clientWidth - 360)/2 + document.body.scrollLeft);
	var lf = intTem-230;
	if (parseInt(lf) < 0)
		lf = 0;
	var win=jsfw.WebUI.Window.newWindow('winOptionMapBaseWfobfrContextInfo', '配置','optionMapBaseBackFillRuleContextInfo.htm',220,160,lf);
	win.setMaxButton(false);    
	win.setSizeable(true);
}
function funOptionMapBaseWfOpinionBackFillRuleAdd(){
	var str='';
	for (var i=0; i<2; i++){
		if (i>0) str+='~';
		if (i == 1){
			var ss = '';
			var fr = jsfw.$('optionMapBase_wfOpinionBackFillRule_'+i);
			for (j=0; j< fr.options.length; j++) {
				if (ss != '') ss+='^'				
				ss += fr.options(j).value;
			}
			str += ss;
		} else
			str += jsfw.$('optionMapBase_wfOpinionBackFillRule_'+i).value;
	}
	var oSel=jsfw.$('sel_optionMapBase_wfOpinionBackFillRule');
	var temOption =  new Option(str, str);
	oSel.options[oSel.options.length] = temOption;
	oSel.options[oSel.options.length-1].selected = true;
	funOptionMapBaseWfOpinionBackFillRuleSet();
}
function funOptionMapBaseWfOpinionBackFillRuleEdit(){
	var str='';
	for (var i=0; i<2; i++){
		if (i>0) str+='~';
		if (i == 1){
			var ss = '';
			var selFr = jsfw.$('optionMapBase_wfOpinionBackFillRule_'+i);
			for (j=0; j< selFr.options.length; j++) {
				if (ss != '') ss+='^'				
				ss += selFr.options(j).value;
			}
			str += ss;
		} else
			str += jsfw.$('optionMapBase_wfOpinionBackFillRule_'+i).value;
	}
	var oSel=jsfw.$('sel_optionMapBase_wfOpinionBackFillRule');
	for (i = 0; i <oSel.options.length ; i++)
		if (oSel.options[i].selected) {
			oSel.options[i].text = str;
			oSel.options[i].value = str;
		}
	funOptionMapBaseWfOpinionBackFillRuleSet();
}
function funOptionMapBaseWfOpinionBackFillRuleDel(){
	var oSel=jsfw.$('sel_optionMapBase_wfOpinionBackFillRule');
	for (i = oSel.options.length-1; i >-1 ; i--)
		if (oSel.options[i].selected) oSel.options[i] = null;
	funOptionMapBaseWfOpinionBackFillRuleSet();
}
function funOptionMapBaseWfOpinionBackFillRuleShow(){
	var str=jsfw.$('sel_optionMapBase_wfOpinionBackFillRule').value;
	
	if (str==''){
		for (var i=0; i<1; i++) jsfw.$('optionMapBase_wfOpinionBackFillRule_'+i).value='';
		var selFr = jsfw.$('optionMapBase_wfOpinionBackFillRule_1');
		for (var i=0; i<selFr.length;){
			selFr.remove(0);
		}
	}else{
		var arr=str.split('~');
		for (var i=0; i<arr.length-1; i++) jsfw.$('optionMapBase_wfOpinionBackFillRule_'+i).value=arr[i];		
		var frstr =arr[arr.length-1];
		var frattr = frstr.split('^');
		var selFr = jsfw.$('optionMapBase_wfOpinionBackFillRule_1');
		for (var i=0; i<selFr.length;){
			selFr.remove(0);
		}
		for (var j=0; j<frattr.length; j++){
			var option = document.createElement("option");
			option.value = frattr[j];
			option.text = frattr[j];
			selFr.add(option);
		}
	}
}
function funOptionMapBaseWfOpinionBackFillRuleSet(){
	var oSel=jsfw.$('sel_optionMapBase_wfOpinionBackFillRule');
	
	var sR='';
	var idx=0;
	for (i = 0; i < oSel.options.length ; i++){
		if (sR!='') sR+='@';
		sR += oSel.options[i].value;
		if (oSel.options[i].selected) idx=i;
	}
	setStateFormMapFlow('wfOpinionBackFillRule',sR);
	funOptionMapBaseWfOpinionBackFillRuleLoad();
	var oSel=jsfw.$('sel_optionMapBase_wfOpinionBackFillRule');
	if (oSel.options.length!=0){
		if (idx>oSel.options.length-1) idx=oSel.options.length-1;
		oSel.options[idx].selected=true;
	}
	funOptionMapBaseWfOpinionBackFillRuleShow();
}
////////////////////////////////
function setInputBoolean(oInput,bool){
	bool = (typeof(bool)=='boolean')?bool:(oInput.value!='true');
	oInput.value=bool.toString();
	oInput.style.backgroundImage = "url('../../../js/flow/images/icon/bool_"+oInput.value+".gif')";
}

function setCurrentObjAttr(oInput){	//设置当前对象属性值
	if ((oInput.name=='csTarget') && (oInput.value=='true')){
		if (document.getElementsByName('statescanbecanceled')[0].value==''){
			document.getElementsByName('statescanbecanceled')[0].value=oFlow.getNextNodes(oFlow.getCurrentObj());
			oFlow.setAttr(oFlow.getCurrentObj(),'statescanbecanceled',oFlow.getNextNodes(oFlow.getCurrentObj()));
		}
	}
	oFlow.setAttr(oFlow.getCurrentObj(),oInput.name,oInput.value);
}

//--------对话框
function closeDialog(sWindowID){ 
	setTimeout(function(){
		jsfw.WebUI.Window.findWindow(sWindowID).close();
	},100); 
}
function showDialog(sWindowID, sTitle,sURL,iWidth,iHeight,iLeft,iTop,bModalWindow){
	var win=jsfw.WebUI.Window.newWindow(sWindowID, sTitle,sURL,iWidth,iHeight,iLeft,iTop,bModalWindow);
	win.setMaxButton(false);     win.setSizeable(true);
	return win;
}
function showXMLDialog(){
	parent.showDialog('winXMLSrc', '流程源码','flowXML.htm',700,500);
}

//--------输出属性HTML
//'流程应用模块','modules','select','',getXMLDocModules(),'应用属性','4'
function writeAttr(sCaption,sName,sType,sDesc,sSelData,sTitle,sRow,sID,sReadonly){
	var sHTML = '<tr>';
	if (typeof(sTitle)=='string') sHTML += '<td rowspan="'+sRow+'">'+sTitle+'</td>';
	sHTML += '<td ';
	if ((sDesc||'')!='') sHTML += ' onmouseover="jsfw.WebUI.Tip.newTip(\''+sDesc+'\',this,0);" onmouseout="jsfw.WebUI.Tip.delTip()" ';
	sHTML += '>'+sCaption+'</td><td>';
	if (sType=='string'){
		if(sReadonly && sReadonly=='1'){
			sHTML += '<input name="'+sName+'" AttrType="'+sType+'" readonly="readonly" class="pro_input" onchange="setCurrentObjAttr(this)"/>';
		}else{
			sHTML += '<input name="'+sName+'" AttrType="'+sType+'" class="pro_input" onchange="setCurrentObjAttr(this)"/>';
		}
	}
	if (sType=='boolean'){
		sHTML += '<input name="'+sName+'" AttrType="'+sType+'" class="pro_input" onchange="setCurrentObjAttr(this)"';
		sHTML += ' style="cursor:hand;background-repeat: no-repeat;padding-left:20;" readonly '; 		
		sHTML += ' onclick="setInputBoolean(this);setCurrentObjAttr(this)" onkeyup="if (event.keyCode==32){setInputBoolean(this);setCurrentObjAttr(this)}"/>';
	}
	if (sType=='select'){
		sHTML += '<span style="position:relative; overflow:hidden;width:100%"><input name="'+sName+'" AttrType="'+sType+'" style="display:none;"/>';
		sHTML += '<select id="'+sID+'" class="pro_select" onchange="this.previousSibling.value=this.value;setCurrentObjAttr(this.previousSibling);';
		if (sName=='modules') sHTML += 'afterSelModules(this.value);';
		sHTML += '">';
		for (var i=0; i<sSelData.length; i++){
				sHTML += '<option   value="'+sSelData[i][0]+'">'+sSelData[i][1]+'</option>';
		}
		sHTML += '</select></span>';
	}
	if (sType=='dialog'){
		var sURL='flowDocDlg';
		var iWidth=660;
		var iHeight=400;
		if (sSelData){
			if (sSelData.length>0) sURL=sSelData[0];
			if (sSelData.length>2) {iWidth=sSelData[1]; iHeight=sSelData[2];}
		}
		sHTML += '<table width="100%" border="0" cellpadding="0" cellspacing="0"><tr>';
		sHTML += '	<td><input name="'+sName+'" AttrType="'+sType+'" class="pro_input" onchange="setCurrentObjAttr(this)"/></td>';
		sHTML += '	<td width="30"><button class="pro_BtnSel" onclick="showDialog(\'flowDocDlg_'+sName+'\',\'请选择\',\''+sURL+'.jsp?parVal='+sName+','+encodeURIComponent(sCaption)+'\','+iWidth+','+iHeight+');">...</button></td>';
		sHTML += '</tr></table>';
	}
	sHTML += '</td>';
	sHTML += '</tr>';
	document.write(sHTML);
}
///获取打开对话框的iframe
function getShowDialgIframe(sid){
	var win = jsfw.WebUI.Window.findWindow(sid);
	if (! win)
		return null;
	return document.frames[win.IFrameName];
}
/////打印
function printFlow(){
	divToolbar.style.display = 'none';
	winTool.hide();
	winProperty.hide();
	window.print();
	divToolbar.style.display = '';
	winTool.show();
	winProperty.show();
}

///////列表项目移动
function selMoveUp(obj){
	var curIdx=obj.selectedIndex;
	if (curIdx < 1) return;
	var objSel = new Option(obj[curIdx].text, obj[curIdx].value);
	var objPre = new Option(obj[curIdx-1].text, obj[curIdx-1].value);
	obj.options[curIdx] = objPre;
	obj.options[curIdx-1] = objSel;
	obj.options[curIdx-1].selected = true;
}
function selMoveDown(obj){
	var curIdx=obj.selectedIndex;
	if (curIdx < 0) return;
	if (curIdx >= obj.options.length-1) return;
	var objSel = new Option(obj[curIdx].text, obj[curIdx].value);
	var objPre = new Option(obj[curIdx+1].text, obj[curIdx+1].value);
	obj.options[curIdx] = objPre;
	obj.options[curIdx+1] = objSel;
	obj.options[curIdx+1].selected = true;
}

///////XML
function getXMLDom(){
	if (/msie/i.test(navigator.userAgent))
		for (var i=0; i<4; i++)
			try{
				var r = new ActiveXObject(["MSXML2.DOMDocument", "Microsoft.XMLDOM", "MSXML.DOMDocument", "MSXML3.DOMDocument"][i]);
				return r;
			}catch (e){return null;}
	else return document.implementation.createDocument("", "doc", null);
}

function loadXml(url){
	var xmlDom = getXMLDom();
	xmlDom.async = false;
	try{
		xmlDom.load(url);
		return xmlDom;
	}catch(e){
		return (new DOMParser()).parseFromString(me.loadHttp(url),"text/xml");
	};
}

/**
 * 获取到模块和业务数据后，进行jsp界面元素实例化和填充
 */
function getXMLDocModules(){
	//模块下拉框赋值
   	var oOption = document.createElement("OPTION");
	jt._("#sel_Doc_modules").options.add(oOption);
    oOption.text="";
    oOption.value="";
		for(var i=0;i<moduleAndBusiness.length;i++){
			var oOption = document.createElement("OPTION");
			jt._("#sel_Doc_modules").options.add(oOption);
	        oOption.text=moduleAndBusiness[i].name;
	        oOption.value=moduleAndBusiness[i].id;
		}
}
/**
 * 业务模块选择触发事件
 * @param sVal
 */
function afterSelModules(sVal){
	for(var i=0;i<moduleAndBusiness.length;i++){
		if(moduleAndBusiness[i].id == sVal){
			//设置选中的业务模块
			jt._("#sel_Doc_modules").value = sVal;
			//业务模块选择后，填充业务下拉框
			var child = moduleAndBusiness[i].children;
			jsfw.$('sel_Doc_business').options.length=0;
			if(child.length==0) return;
			var oOption = document.createElement("OPTION");
			jsfw.$('sel_Doc_business').options.add(oOption);
	        oOption.text="";
	        oOption.value="";
			for (var i=0; i<child.length; i++){
				var oOption = document.createElement("OPTION");
				jsfw.$('sel_Doc_business').options.add(oOption);
		        oOption.text=child[i].name;
		        oOption.value=child[i].id;
			}
			var bid = oFlow.getAttr('','business');
			if(""!=bid){
				jsfw.$('sel_Doc_business').value = bid;
				//业务下拉框填充后，获取流程数据中已经存储过的业务进行选中操作
				afterSelBusiness(bid);
			}
			return;
		}
	}
	return ;
}

/**
 * 业务下拉框触发事件  选择表单
 * @param businessId
 */
function afterSelBusiness(businessId){
	//清空已有的表单选择下拉框
	jsfw.$('sel_Doc_form').options.length=0;//全局默认表单（web）
	jsfw.$('sel_state_form').options.length=0;//环节表单(web)
	jsfw.$('sel_flow_form').options.length=0;//办毕表单（web）

	jsfw.$('sel_Doc_form_app').options.length=0;//全局默认表单（app）
	jsfw.$('sel_state_form_app').options.length=0;//环节表单(app)
	jsfw.$('sel_flow_form_app').options.length=0;//办毕表单（app）


		// jt.getJSONP('{SYSURL.bam}/bam/outter.action?method=getFormStateTree&BUSINESS_ID='+businessId,function(json) {
		// 	//根据业务ID获取到该业务下的表单以及状态数据
		// 	if (json && json.data && json.data.length > 0) {
		// 		webFormAndState = new Array();
		// 		appFormAndState = new Array();
		// 		for (var i = 0, j = json.data.length; i < j; i++) {
		// 			var temp = json.data[i];
		// 			if (temp.type == "WEB") {
		// 				webFormAndState.push(temp);
		// 			} else if (temp.type == "MOBILE") {
		// 				appFormAndState.push(temp);
		// 			}
		// 		}
		// 		doSelectFormOpe();
		// 	} else {
		// 		showMsg("获取业务表单失败");
		// 		return;
		// 	}
		// });
}
function doSelectFormOpe(){
	//填充业务表单数据
	jt._("#sel_Doc_form").options.add(new Option('',''));
	jt._("#sel_state_form").options.add(new Option('',''));
	jt._("#sel_flow_form").options.add(new Option('',''));

	jt._("#sel_Doc_form_app").options.add(new Option('',''));
	jt._("#sel_state_form_app").options.add(new Option('',''));
	jt._("#sel_flow_form_app").options.add(new Option('',''));
	for(var i=0;i<webFormAndState.length;i++){
		jt._("#sel_Doc_form").options.add(new Option(webFormAndState[i].name,webFormAndState[i].id));
		jt._("#sel_state_form").options.add(new Option(webFormAndState[i].name,webFormAndState[i].id));
		jt._("#sel_flow_form").options.add(new Option(webFormAndState[i].name,webFormAndState[i].id));
	}
	for(var i= 0;i<appFormAndState.length;i++){
		jt._("#sel_Doc_form_app").options.add(new Option(appFormAndState[i].name,appFormAndState[i].id));
		jt._("#sel_state_form_app").options.add(new Option(appFormAndState[i].name,appFormAndState[i].id));
		jt._("#sel_flow_form_app").options.add(new Option(appFormAndState[i].name,appFormAndState[i].id));
	}
	//当流程数据存在时 定位值
	var formid = oFlow.getAttr('','form');
	if(""!=formid){
		jsfw.$('sel_Doc_form').value = formid ;
		afterSelForm(formid,"WEB");
	}
	var appformid = oFlow.getAttr('','appform');
	if(""!=appformid){
		jsfw.$('sel_Doc_form_app').value = appformid ;
		afterSelForm(appformid,"APP");
	}
}
function Str2FormState(str){
	var str=jt.getDefVal(str,'[]'); var arr=[]; try{ arr=jt.Str2Json(str) }catch(e){}
	if (arr.length==0) { arr.push({Code:'STATE_001', Name:'编辑'}); arr.push({Code:'STATE_002', Name:'只读'}); }
	return arr;
}

/**
 * 选择默认PC表单后
 * @param formId
 */
function afterSelForm(formId,type){
	if("WEB"==type){
		for(var i=0;i<webFormAndState.length;i++){
			if(webFormAndState[i].id == formId){
				var arr=Str2FormState(webFormAndState[i].state);
				jsfw.$('sel_Doc_formstate').options.length=0;
				jsfw.$('sel_Doc_formstate').options.add(new Option('',''));
				for (var i=0; i<arr.length; i++){
					jsfw.$('sel_Doc_formstate').options.add(new Option(arr[i].Name,arr[i].Code));
				}
				jsfw.$('sel_Doc_formstate').value = oFlow.getAttr('','formstate');
				return;
			}
		}
	}else if("APP"==type){
		for(var i=0;i<appFormAndState.length;i++){
			if(appFormAndState[i].id == formId){
				var arr=Str2FormState(appFormAndState[i].state);
				jsfw.$('sel_Doc_formstate_app').options.length=0;
				jsfw.$('sel_Doc_formstate_app').options.add(new Option('',''));
				for (var i=0; i<arr.length; i++){
					jsfw.$('sel_Doc_formstate_app').options.add(new Option(arr[i].Name,arr[i].Code));
				}
				jsfw.$('sel_Doc_formstate_app').value = oFlow.getAttr('','appformstate');
				return;
			}
		}
	}

	return ;
}

/**
 * 环节中的表单选择触发事件
 * @param formId
 */
function afterStateSelForm(formId,type){
	if(type=="WEB"){
		for(var i=0;i<webFormAndState.length;i++){
			if(webFormAndState[i].id == formId){
				var arr=Str2FormState(webFormAndState[i].state);
				jsfw.$('sel_state_formstate').options.length=0;
				jsfw.$('sel_state_formstate').options.add(new Option('',''));
				for (var i=0; i<arr.length; i++){
					jsfw.$('sel_state_formstate').options.add(new Option(arr[i].Name,arr[i].Code));
				}
				return;
			}
		}
	}else if(type=="APP"){
		for(var i=0;i<appFormAndState.length;i++){
			if(appFormAndState[i].id == formId){
				var arr=Str2FormState(appFormAndState[i].state);
				jsfw.$('sel_state_formstate_app').options.length=0;
				jsfw.$('sel_state_formstate_app').options.add(new Option('',''));
				for (var i=0; i<arr.length; i++){
					jsfw.$('sel_state_formstate_app').options.add(new Option(arr[i].Name,arr[i].Code));
				}
				return;
			}
		}
	}
	return ;
}

/**
 * 办毕表单配置
 * @param formId
 */
function afterSelFlowForm(formId,type){
	if(type=="WEB"){
		for(var i=0;i<webFormAndState.length;i++){
			if(webFormAndState[i].id == formId){
				var arr=Str2FormState(webFormAndState[i].state);
				jsfw.$('sel_flow_formstate').options.length=0;
				jsfw.$('sel_flow_formstate').options.add(new Option('',''));
				for (var i=0; i<arr.length; i++){
					jsfw.$('sel_flow_formstate').options.add(new Option(arr[i].Name,arr[i].Code));
				}
				return;
			}
		}
	}else if(type=="APP"){
		for(var i=0;i<appFormAndState.length;i++){
			if(appFormAndState[i].id == formId){
				var arr=Str2FormState(appFormAndState[i].state);
				jsfw.$('sel_flow_formstate_app').options.length=0;
				jsfw.$('sel_flow_formstate_app').options.add(new Option('',''));
				for (var i=0; i<arr.length; i++){
					jsfw.$('sel_flow_formstate_app').options.add(new Option(arr[i].Name,arr[i].Code));
				}
				return;
			}
		}
	}

	return ;
}
function toXML(str){
	var sRe
	sRe = str.replace(/\&/img,'&amp;');
	sRe = sRe.replace(/\'/img,'&apos;');
	sRe = sRe.replace(/\"/img,'&quot;');
	sRe = sRe.replace(/>/img,'&gt;');
	sRe = sRe.replace(/</img,'&lt;');
	return sRe;
}