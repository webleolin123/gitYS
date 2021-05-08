/**
 * 流程模板的保存操作，保存操作只是修改了模板xml内容，则其他不需要修改属性去掉
 */
function funSave(){
    document.getElementById('sel').focus();
	jsfw.$('divLoading').style.display = '';
	frmMainSave["label"].value=oFlow.getAttr(oFlow.getRoot(),'label');
	frmMainSave["version"].value=oFlow.getAttr(oFlow.getRoot(),'version');
	frmMainSave["orgId"].value=oFlow.getAttr(oFlow.getRoot(),'company');
	frmMainSave["name"].value=oFlow.getAttr(oFlow.getRoot(),'name');
	frmMainSave["module"].value=oFlow.getAttr(oFlow.getRoot(),'modules');
	frmMainSave["business"].value=oFlow.getAttr(oFlow.getRoot(),'business');
	frmMainSave["labelold"].value=CST_label;
	frmMainSave["versionold"].value=CST_version;
	frmMainSave["nameold"].value=CST_name;
	frmMainSave["content"].value=oFlow.getFlowXML();
	
	//流程配置中的单位信息与操作单位信息需一致
	if(oFlow.getAttr(oFlow.getRoot(),'company')==CST_org_id){
		if(oFlow.getAttr(oFlow.getRoot(),'label')==CST_label&&oFlow.getAttr(oFlow.getRoot(),'version')==CST_version){
		       var options = {
		            url:baseUrl+"/engine/TemplateAction?method=saveTemplate&tableName=FLOW_MODEL_TEMPLATE",
		            dataType:"json",
		            success:function(data){
									if(data.success){
										top.showMsgJsfw(data.object.errorInfo,'消息',2000);
									}else{
										top.showMsgJsfw('操作失败','消息',2000);
									}
		              jsfw.$('divLoading').style.display ="none";
		            } 
		           };		
			   jQuery('#frmMainSave').ajaxSubmit(options);	 
			}
	}

	oFlow.modified=false;
}
/**
 * 流程模板导出
 * @param orgId
 */
function exportTemplate(orgId){
	var orgId = oFlow.getAttr(oFlow.getRoot(),'company');
    var id = encodeURIComponent(oFlow.getAttr(oFlow.getRoot(),'name')) + "@" +oFlow.getAttr(oFlow.getRoot(),'version') + "@" + oFlow.getAttr(oFlow.getRoot(),'label') + "@" + orgId;
    var url=baseUrl + "/engine/TemplateAction?method=exportTemplate"; 
    window.open(url+"&exportid="+id);
}
/**
 * 流程模板部署
 * @param isSend
 * @returns {Boolean}
 */
function deployTemplate(isSend){
	if (oFlow.modified){
    jsfw.WebUI.PopMsg.newMsg('请先保存!','消息');
		return;
	}
	frmMainSave.fsend.value=isSend;
	jsfw.$('divLoading').style.display = '';
	frmMainSave["label"].value=oFlow.getAttr(oFlow.getRoot(),'label');
	frmMainSave["version"].value=oFlow.getAttr(oFlow.getRoot(),'version');
	frmMainSave["orgId"].value=oFlow.getAttr(oFlow.getRoot(),'company');;
	frmMainSave["type"].value=oFlow.getAttr(oFlow.getRoot(),'tptype');
	frmMainSave["content"].value=oFlow.getFlowXML();	
	frmMainSave["name"].value=oFlow.getAttr(oFlow.getRoot(),'name'); 
	
	
	frmMainSave["versionold"].value='';	
	frmMainSave["labelold"].value=''; 
	frmMainSave["nameold"].value=''; 
  var options = {
		url:baseUrl+"/engine/TemplateAction?method=isDeplay&tableName=FLOW_PROCESS_TEMPLATE",
		dataType:"json",
		success:function(data){
			if(data.success && data.object){
				if(data.object.errorCode>0){
					if(confirm('已存在部署文档，是否覆盖？')){
						revoverDeploy(frmMainSave["name"].value,frmMainSave["version"].value,frmMainSave["label"].value,frmMainSave["orgId"].value,'true',frmMainSave.fsend.value);
					}else{
						jsfw.$('divLoading').style.display = 'none';
						return false;
					}
				}else{
					revoverDeploy(frmMainSave["name"].value,frmMainSave["version"].value,frmMainSave["label"].value,frmMainSave["orgId"].value,'false',frmMainSave.fsend.value);
				}
			}
			jsfw.$('divLoading').style.display ="none";
		} 
  };		
	jQuery('#frmMainSave').ajaxSubmit(options);		
  return false;
}

/**
 * 部署流程模板
 * @param name
 * @param version
 * @param label
 * @param orgId
 * @param Fcover
 * @param fsend
 */
function revoverDeploy(name,version,label,orgId,Fcover,fsend){
	jsfw.$('divLoading').style.display = '';
	var postdata={"version":version,"label":label,"orgId":orgId,"name":name,fcover:Fcover,fsend:fsend}
  var url=baseUrl+"/engine/TemplateAction?method=recoverDeploy&tableName=FLOW_PROCESS_TEMPLATE";		
  jQuery.post(url,postdata, function(resp) {
		var resultBuuffer = '&nbsp;';
		resultBuuffer = resultBuuffer +"<font color=#006699>"+resp.object.errorInfo+"</font>";	
 		jsfw.WebUI.PopMsg.newMsg(resultBuuffer,'消息');
    });
}	
/**
 * 删除流程模板
 */
function delTemplate(){
   var id=oFlow.getAttr(oFlow.getRoot(),'label') + "@" + oFlow.getAttr(oFlow.getRoot(),'version') + "@" + oFlow.getAttr(oFlow.getRoot(),'company');
   var url=baseUrl + "/engine/TemplateAction?method=delModelTempleList&tableName=FLOW_MODEL_TEMPLATE"; 
   data={ids:id};
	jQuery.post(url, data, function(resp) {
      if(resp.errorCode !=0){
    	jsfw.WebUI.PopMsg.newMsg(resp.errorInfo,'消息',2000);
      }else{
    	jsfw.WebUI.PopMsg.newMsg("删除操作成功!",'消息',2000); 
        window.close();    	
      }
    });
}	
/**
 * 流程模板另存为
 * @returns {Boolean}
 */
function saveAs(){
    document.getElementById('sel').focus();
	jsfw.$('divLoading').style.display = ''; 
	saveasForm["labelold"].value=oFlow.getAttr(oFlow.getRoot(),'label');
	saveasForm["versionold"].value=oFlow.getAttr(oFlow.getRoot(),'version');	
    saveasForm["orgId"].value=oFlow.getAttr(oFlow.getRoot(),'company');	
    var options = {
         url:baseUrl+"/engine/TemplateAction?method=saveAsTemplate&tableName=FLOW_MODEL_TEMPLATE",    
         dataType:"json",
         success:function(data){
         if(data.errorCode==0){
           top.showMsgJsfw('创建模板成功!','消息',2000);
           var url1=baseUrl+"/template/common/idxMain.jsp#"+saveasForm["version"].value+"&"+saveasForm["label"].value+"&"+saveasForm["orgId"].value+"&"+saveasForm["type"].value+"&"+saveasForm["loadingCache"].value;
           window.location.href=url1;
           window.parent.location.reload();
           jsfw.WebUI.Window.findWindow(saveAsTool).hide();
           jQuery('#saveasForm').resetForm();
         }else{
           top.showMsgJsfw('创建模板失败!'+data.errorInfo,'消息',2000);
         }
         jsfw.$('divLoading').style.display ="none";
       } 
    };		
	jQuery('#saveasForm').ajaxSubmit(options);	   
	return false;     
}	


function cancel(){
  jsfw.WebUI.Window.findWindow('saveAsTool').hide();
   jQuery('#saveasForm').resetForm();
}

