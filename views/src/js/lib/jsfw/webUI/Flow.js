try{ document.namespaces.add('v', 'xmlns:v'); }catch(e){}
jsfw.WebUI.Flow = function (oDiv){
	var maxHeight=0;
	var CST_NODE_DOC_Privilege='<privilege type="0" relation="or" draftLevel="" draftOrg="" draftRole="" subOrg="0" stateType="1" assignmentOption="2" assignmentDisplay="1" assignmentType="2" submitCondition="2" execType="4001" competeType="5001"/>';
	var CST_NODE_DOC_Notion='<notion notions="" highlight="" sequence="" isSort="true" sequencenum="" stateType="1" assignmentOption="2" assignmentDisplay="1" assignmentType="2" submitCondition="2" execType="4001" competeType="5001"/>';
	var CST_NODE_end_state='<end-state name="流程结束" sid="" xlocation="0" ylocation="0"></end-state>';
	var CST_NODE_start_state='<start-state name="流程开始" sid="" xlocation="0" ylocation="0"></start-state>';
	var CST_NODE_state='<state name="" sid="" sequence="0" fields="" xlocation="0" ylocation="0" stateType="1" assignmentOption="2" assignmentDisplay="1" assignmentType="2" submitCondition="2" execType="4001" competeType="5001" editAllowed="1" calDefaultPath="true"><stateNotion availabel="0" opinionDeFaultMode="1" opinionDeFaultLevel="1"/><stateDoc docEdit="1" notes="1"/><stateNotify/><stateFormFlowMap/></state>';
	var CST_NODE_serial_exe_state='<serial-exe-state name="" sid="" sequence="0" fields="" xlocation="0" ylocation="0" stateType="1" assignmentOption="2" assignmentDisplay="1" assignmentType="2" submitCondition="2" execType="4001" competeType="5001" editAllowed="1" calDefaultPath="true"><stateNotion availabel="0" opinionDeFaultMode="1" opinionDeFaultLevel="1"/><stateDoc docEdit="1" notes="1"/><stateNotify/><stateFormFlowMap/></serial-exe-state>';
	var CST_NODE_join_state='<join-state name="" sid="" defaultfield="" sequence="20" statescanbecanceled="" statesmustbefinished="" xlocation="" ylocation="" stateType="1" assignmentOption="2" assignmentDisplay="1" assignmentType="2" submitCondition="2" execType="4001" competeType="5001" editAllowed="1"  calDefaultPath="true"><stateNotion availabel="0" opinionDeFaultMode="1" opinionDeFaultLevel="1"/><stateDoc docEdit="1" notes="1"/><stateNotify/><stateFormFlowMap/></join-state>';
	var CST_NODE_compete_join_state='<compete-join-state name="" sid="" defaultfield="" sequence="20" statescanbecanceled="" statesmustbefinished="" xlocation="" ylocation="" stateType="1" assignmentOption="2" assignmentDisplay="1" assignmentType="2" submitCondition="2" execType="4001" competeType="5001" editAllowed="1"  calDefaultPath="true"><stateNotion availabel="0" opinionDeFaultMode="1" opinionDeFaultLevel="1"/><stateDoc docEdit="1" notes="1"/><stateNotify/><stateFormFlowMap/></compete-join-state>';
	var CST_NODE_junction='<junction name="" sid="" defaultfield="" sequence="20" statescanbecanceled="" statesmustbefinished="" xlocation="" ylocation="" stateType="1" assignmentOption="2" assignmentDisplay="1" assignmentType="2" submitCondition="2" execType="4001" competeType="5001" editAllowed="1" calDefaultPath="true"><stateNotion availabel="0" opinionDeFaultMode="1" opinionDeFaultLevel="1"/>\n<stateDoc docEdit="1" notes="1"/>\n<stateNotify/>\n<stateFormFlowMap/>\n</junction>';
	var CST_NODE_compete_exe_state='<compete-exe-state name="" sid="" defaultfield="" sequence="20" statescanbecanceled="" statesmustbefinished="" xlocation="" ylocation="" stateType="1" assignmentOption="2" assignmentDisplay="1" assignmentType="2" submitCondition="2" execType="4001" competeType="5001" editAllowed="1" calDefaultPath="true"><stateNotion availabel="0" opinionDeFaultMode="1" opinionDeFaultLevel="1"/><stateDoc docEdit="1" notes="1"/><stateNotify/><stateFormFlowMap/></compete-exe-state>';
	var CST_NODE_subprocess_state='<subprocess-state name="" sid="" sequence="0" fields="" xlocation="0" ylocation="0" stateType="7" subprocess_type="0" subprocess_return_type="" subprocess_sid="" subprocess_version=""   assignmentOption="2" assignmentDisplay="1" assignmentType="2" submitCondition="2" execType="4001" competeType="5001" editAllowed="1"><stateNotion availabel="0" opinionDeFaultMode="1" opinionDeFaultLevel="1"/><stateDoc docEdit="1" notes="1"/><stateNotify/><stateFormFlowMap/></subprocess-state>';
	var CST_NODE_transition='<transition name="" to=""/>';

	if (!jsfw.WebUI.MoveItem) jsfw.Import("WebUI.MoveItem");
	if (!jsfw.WebUI.PopMsg) jsfw.Import("WebUI.PopMsg");
	if (!jsfw.WebUI.Tip) jsfw.Import("WebUI.Tip");
	//if (!jsfw.WebUI.Tip) jsfw.Import("WebUI.Tip");
	var strTem=oDiv.getAttribute('mode');
	var bEdit=false;
	if (strTem && (strTem.toLowerCase()=='edit')) bEdit=true;
	//oDiv.arrLine = new Array();
   
	var oInput = document.createElement('input');
	oInput.style.position='absolute';
	oInput.style.top = -1000;
	oDiv.appendChild(oInput);
	if (bEdit) {
		oInput.onkeyup=function (){
			if (event.keyCode==46) oDiv.delItem('');
		}
	}


	var offsetX = jsfw.getAbsoluteLeft(oDiv);	//总体偏移
	var offsetY = jsfw.getAbsoluteTop(oDiv);	//总体偏移
	oDiv.modified=false;	//流程是否已修改

	var oXML = getXMLDom();
	if(/msie/i.test(navigator.userAgent)){
        oXML.async = false;
        oXML.loadXML('<process-template xmlns:xmi="http://www.omg.org/XMI" xmlns:processTemplate="http:///com/ibm/model/processTemplate/processTemplate.ecore" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmi:version="2.0" name="" label="" version="" sequence="" category="" form="" modules="" operations="" domains="" tptype="0"></process-template>');
    }else{
        oXML = new DOMParser().parseFromString('<process-template xmlns:xmi="http://www.omg.org/XMI" xmlns:processTemplate="http:///com/ibm/model/processTemplate/processTemplate.ecore" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmi:version="2.0" name="" label="" version="" sequence="" category="" form="" modules="" operations="" domains="" tptype="0"></process-template>',"text/xml");
    }

	oDiv.loadFromURL    = function(sURL){
        if(/msie/i.test(navigator.userAgent)){
            oXML.load(sURL);
            afterLoad();
        }else{
            var xmlhttp = new window.XMLHttpRequest();
            xmlhttp.open("GET",sURL,false);
            xmlhttp.send(null);
            oXML = new DOMParser().parseFromString(xmlhttp.response,"text/xml");
            afterLoad_chrome()
        }
	}	//加载URL
	oDiv.loadFromString = function(sXML){
        if(/msie/i.test(navigator.userAgent)){
            oXML.loadXML(sXML);
            afterLoad();
        }else{
            oXML = new DOMParser().parseFromString(sXML,"text/xml");
            afterLoad_chrome()
        }
	}	//加载XML字串
	function junctionFind(sTos){
		var oNodes=oXML.documentElement.selectNodes('junction');
		var arr=sTos.split(',');
		for (var i=0; i<oNodes.length; i++){
			var bFind=true;
			for (var j=0; j<arr.length; j++){
				if (oNodes[i].selectNodes('transition[@to="'+arr[j]+'"]').length==0){
					bFind=false;
					break;
				}
			}
			if (bFind) return oNodes[i];
		}
		return null;
	}
	function junctionTos(oNode){
		var oNodes=oNode.selectNodes('transition');
		var str='';
		for (var i=0; i<oNodes.length; i++){
			if (str!='') str+=',';
			str+=getAttr(oNodes[i],'to');
		}
		return str;
	}
	function revTransitions(sXML){
		var oXML = getXMLDom();
        if(/msie/i.test(navigator.userAgent)){
            oXML.async = false;
            oXML.loadXML(sXML);
        }else{
            if(typeof(sXML) == "string"){
                oXML = new DOMParser().parseFromString(sXML,"text/xml");
            }else{
                oXML = new DOMParser().parseFromString((new XMLSerializer()).serializeToString(sXML),"text/xml");
            }
        }
		var oNodes = oXML.documentElement.childNodes;
		for (var i=0; i<oNodes.length; i++){
			if (oDiv.isFlowNode(oNodes[i])) {
				if ((getNodeType(oNodes[i])!='start-state') && (getNodeType(oNodes[i])!='end-state')){
					var oLines=oNodes[i].getElementsByTagName('transition');
					for (var j=0; j<oLines.length; j++){
						if ((getAttr(oLines[j],'rejectBack')=='true') && (getAttr(oLines[j],'returnBack')=='true')){
                            if(/msie/i.test(navigator.userAgent)){
                                oLines[j].parentNode.appendChild(genDefNode(oLines[j].xml.replace(/returnBack=\"true\"/img,'')));
                            }else{
                                var lineXml = (new XMLSerializer()).serializeToString(oLines[j])
                                oLines[j].parentNode.appendChild(genDefNode(lineXml.replace(/returnBack=\"true\"/img,'')));
                            }
						    oLines[j].removeAttribute('rejectBack');
						}else{
							if (getAttr(oLines[j],'rejectBack')=='false') oLines[j].removeAttribute('rejectBack');
							if (getAttr(oLines[j],'returnBack')=='false') oLines[j].removeAttribute('returnBack');
						}
					}
				}
			}
		}
        if(/msie/i.test(navigator.userAgent)){
		    return oXML.documentElement.xml;
        }else{
            return (new XMLSerializer()).serializeToString(oXML.documentElement);
        }
	}
	function fmtTransitions(oLines){
		if (oLines.length<2) return;
		for (var i=0; i<oLines.length; i++){
			var bFind=false;
			var sTo=getAttr(oLines[i],'to')
			for (var j=(i+1); j<oLines.length; j++){
				if (sTo==getAttr(oLines[j],'to')){
					bFind=true;
					if (getAttr(oLines[j],'rejectBack')=='true') setAttr(oLines[i],'rejectBack','true');
					if (getAttr(oLines[j],'returnBack')=='true') setAttr(oLines[i],'returnBack','true');
					setAttr(oLines[j],'del','1');
					break;
				}
			}
		}
		for (var i=(oLines.length-1); i>=0; i--)
			if (getAttr(oLines[i],'del')=='1') oLines[i].parentNode.removeChild(oLines[i]);
	}
	function afterLoad(){
        oDiv.currentItem='';
        var objs=oDiv.childNodes;
        for (var i=objs.length-1; i>=0; i--){
            if ((objs[i]!=oInput) && (objs[i]!=divTempNode) && (objs[i]!=divTempLine)) {
                objs[i].onclick=null;
                objs[i].oncontextmenu=null;
                oDiv.removeChild(objs[i]);
            }
        }
        var oNodes = oDiv.getRoot().childNodes;
        for (var i=0; i<oNodes.length; i++){	//添加节点 ---------
            if (oDiv.isFlowNode(oNodes[i])) {
                if ((getNodeType(oNodes[i])!='start-state') && (getNodeType(oNodes[i])!='end-state')){
                    if (oNodes[i].selectNodes('stateNotion').length==0) oNodes[i].appendChild(genDefNode('<stateNotion/>'));
                    if (oNodes[i].selectNodes('stateDoc').length==0) oNodes[i].appendChild(genDefNode('<stateDoc/>'));
                    if (oNodes[i].selectNodes('stateNotify').length==0) oNodes[i].appendChild(genDefNode('<stateNotify/>'));
                    if (oNodes[i].selectNodes('stateFormFlowMap').length==0) oNodes[i].appendChild(genDefNode('<stateFormFlowMap/>'));
                    //<stateNotion availabel="0"/><stateDoc docEdit="1" notes="0"/>
                    if (getAttr(oNodes[i].selectNodes('stateDoc')[0],'docEdit')=='') setAttr(oNodes[i].selectNodes('stateDoc')[0],'docEdit','1');
                    if (getAttr(oNodes[i].selectNodes('stateDoc')[0],'notes')=='') setAttr(oNodes[i].selectNodes('stateDoc')[0],'notes','0');
                    if (getAttr(oNodes[i].selectNodes('stateNotion')[0],'availabel')=='') setAttr(oNodes[i].selectNodes('stateNotion')[0],'availabel','0');
                    if (getAttr(oNodes[i].selectNodes('stateNotion')[0],'opinionDeFaultMode')=='') setAttr(oNodes[i].selectNodes('stateNotion')[0],'opinionDeFaultMode','3');
                    if (getAttr(oNodes[i].selectNodes('stateNotion')[0],'opinionDeFaultLevel')=='') setAttr(oNodes[i].selectNodes('stateNotion')[0],'opinionDeFaultLevel','1');
                    fmtTransitions(oNodes[i].getElementsByTagName('transition'));
                }
                oDiv.drawNode(oNodes[i]);
            }
        }
        oNodes = oDiv.getRoot().getElementsByTagName('transition');
        for (var i=0; i<oNodes.length; i++){ //添加线 ---------
            if ((getAttr(oNodes[i],'to').indexOf(',')>-1) && (getAttr(oNodes[i],'toNode')=='')){
                var temNode=junctionFind(getAttr(oNodes[i],'to'));
                if (temNode!=null) setAttr(oNodes[i],'toNode',getAttr(temNode,'sid'));
            }
            oDiv.drawLine(oNodes[i]);
        }
        if (oDiv.getXmlNode('/notion')==null) oDiv.getRoot().appendChild(genDefNode(CST_NODE_DOC_Notion));
        if (oDiv.getXmlNode('/privilege')==null)  oDiv.getRoot().appendChild(genDefNode(CST_NODE_DOC_Privilege));
        if (!bEdit){
            if (!(parseInt(oDiv.style.height)>0)){
                oDiv.style.height = maxHeight + 50;
            }
        }
    }

    function afterLoad_chrome(){
        graph.addListener(mxEvent.CLICK, function(sender, evt)
        {
            var cell = evt.getProperty('cell')
            if(cell){oDiv.selItem(cell.nodeId)}
            else{oDiv.selItem("")}

        });
        oDiv.currentItem='';
        var objs=oDiv.childNodes;
        for (var i=objs.length-1; i>=0; i--){
            if ((objs[i]!=oInput) && (objs[i]!=divTempNode) && (objs[i]!=divTempLine)) {
                objs[i].onclick=null;
                objs[i].oncontextmenu=null;
                oDiv.removeChild(objs[i]);
            }
        }
        var oNodes = oDiv.getRoot().childNodes;
        for (var i=0; i<oNodes.length; i++){	//添加节点 ---------
            if (oDiv.isFlowNode(oNodes[i])) {
                if ((getNodeType(oNodes[i])!='start-state') && (getNodeType(oNodes[i])!='end-state')){
                    if (oNodes[i].selectNodes('stateNotion').length==0) oNodes[i].appendChild(genDefNode('<stateNotion/>'));
                    if (oNodes[i].selectNodes('stateDoc').length==0) oNodes[i].appendChild(genDefNode('<stateDoc/>'));
                    if (oNodes[i].selectNodes('stateNotify').length==0) oNodes[i].appendChild(genDefNode('<stateNotify/>'));
                    if (oNodes[i].selectNodes('stateFormFlowMap').length==0) oNodes[i].appendChild(genDefNode('<stateFormFlowMap/>'));
                    //<stateNotion availabel="0"/><stateDoc docEdit="1" notes="0"/>
                    if (getAttr(oNodes[i].selectNodes('stateDoc')[0],'docEdit')=='') setAttr(oNodes[i].selectNodes('stateDoc')[0],'docEdit','1');
                    if (getAttr(oNodes[i].selectNodes('stateDoc')[0],'notes')=='') setAttr(oNodes[i].selectNodes('stateDoc')[0],'notes','0');
                    if (getAttr(oNodes[i].selectNodes('stateNotion')[0],'availabel')=='') setAttr(oNodes[i].selectNodes('stateNotion')[0],'availabel','0');
                    if (getAttr(oNodes[i].selectNodes('stateNotion')[0],'opinionDeFaultMode')=='') setAttr(oNodes[i].selectNodes('stateNotion')[0],'opinionDeFaultMode','3');
                    if (getAttr(oNodes[i].selectNodes('stateNotion')[0],'opinionDeFaultLevel')=='') setAttr(oNodes[i].selectNodes('stateNotion')[0],'opinionDeFaultLevel','1');
                    fmtTransitions(oNodes[i].getElementsByTagName('transition'));
                }
                oDiv.drawNode_chrome(oNodes[i]);
            }
        }
        oNodes = oDiv.getRoot().getElementsByTagName('transition');
        for (var i=0; i<oNodes.length; i++){ //添加线 ---------
            if ((getAttr(oNodes[i],'to').indexOf(',')>-1) && (getAttr(oNodes[i],'toNode')=='')){
                var temNode=junctionFind(getAttr(oNodes[i],'to'));
                if (temNode!=null) setAttr(oNodes[i],'toNode',getAttr(temNode,'sid'));
            }
            oDiv.drawLine_chrome(oNodes[i]);
        }
        if (oDiv.getXmlNode('/notion')==null) oDiv.getRoot().appendChild(genDefNode(CST_NODE_DOC_Notion));
        if (oDiv.getXmlNode('/privilege')==null)  oDiv.getRoot().appendChild(genDefNode(CST_NODE_DOC_Privilege));
        if (!bEdit){
            if (!(parseInt(oDiv.style.height)>0)){
                oDiv.style.height = maxHeight + 50;
            }
        }
    }

	oDiv.getRoot = function (){return oXML.documentElement;}
	function getAttr(oNode,sName){ return oNode.getAttribute(sName)||'';}
	function setAttr(oNode,sName,sVal){ oNode.setAttribute(sName,sVal);}
	oDiv.getAttr = function (oNode,sName){
		if (typeof(oNode)=='string'){
			var aNode=oDiv.getXmlNode(oNode);
		}else{
			var aNode=oNode;
		}
		if (aNode==null) return'';
		return aNode.getAttribute(sName)||'';
	}
	oDiv.setAttr = function (oNode,sName,sVal){
		if (typeof(oNode)=='string'){
			var aNode=oDiv.getXmlNode(oNode);
		}else{
			var aNode=oNode;
		}
		if (oDiv.isFlowNode(aNode)) {
			if ((sName=='sid')){
				oDiv.setNodeSID(aNode,sVal);
				return;
			}
			if (sName=='name'){
				aNode.setAttribute(sName,sVal);
				oDiv.modified=true;
				var sid = getAttr(aNode,'sid');
				////修改相关迁移的名称
				if (confirm('是否修改相关迁移的名称?')){
					var temNodes=oXML.documentElement.selectNodes('*//transition[@to="'+sid+'"]');
					for (var i=0; i<temNodes.length; i++) setAttr(temNodes[i],'name',sVal);
					temNodes=oXML.documentElement.selectNodes('*//transition[@toNode="'+sid+'"]');
					for (var i=0; i<temNodes.length; i++) setAttr(temNodes[i],'name',sVal);
				}
				if(/msie/i.test(navigator.userAgent)) {
					oDiv.drawNode(aNode);
				}else{
					oDiv.drawNode_chrome_modify(aNode);
				}
				return;
			}
		}
		aNode.setAttribute(sName,sVal);
		if (aNode.nodeName=='transition'){
			if (sName=='zLine') oDiv.drawLine(aNode);
		}
		oDiv.modified=true;
	}
	oDiv.findNode = function (sid){ return oXML.documentElement.selectSingleNode('*[@sid="'+sid+'"]');}
	oDiv.getXmlNode = function (sPath){ return oXML.selectSingleNode('/process-template'+sPath);}
	oDiv.getXmlNodes = function (sPath){ return oXML.selectNodes('/process-template'+sPath);}
	oDiv.appendXmlChildNode = function (oParent,strXML){ var oNode=genDefNode(strXML); oParent.appendChild(oNode); };
	oDiv.replaceXmlChildNode = function (oParent,strXML,oldNode){ var oNode=genDefNode(strXML); oParent.replaceChild(oNode,oldNode); };
	oDiv.isFlowNode = 	function (oNode){	//判断是否是流程节点
		var str=oNode.nodeName;
		if ((str=='start-state')||(str=='end-state')||(str=='state')||(str=='join-state')||(str=='junction')||(str=='compete-exe-state')||(str=='compete-join-state')||(str=='subprocess-state')||(str=='serial-exe-state')) return true;
		return false;
	}


	//----------------------画节点[Begin]-------------------
	oDiv.drawNode = function (oNode){
		var a_sid = getAttr(oNode,'sid');
		var a_nodeType = getNodeType(oNode);//oNode.nodeName;
		var a_xlocation = getAttr(oNode,'xlocation');
		var a_ylocation = getAttr(oNode,'ylocation');
		var tabName = 'tabFlowNode_' + a_sid;
		if (jsfw.$(tabName)) {
			jsfw.$(tabName).onclick = null;
			jsfw.$(tabName).oncontextmenu = null;
			//jsfw.$(tabName).onmouseover = null;
			//jsfw.$(tabName).onmouseout = null;
			oDiv.removeChild(jsfw.$(tabName));
		}
		var sHTML='';
		if ((a_nodeType=='start-state') || (a_nodeType=='end-state')){
			var oTable=document.createElement('<v:oval style="Z-INDEX: 1; left:' + a_xlocation +';top:' + a_ylocation +'; WIDTH: 48px; HEIGHT: 48px; CURSOR: default; POSITION: absolute;" coordsize = "21600,21600" stroked = "f"/>');
			sHTML+='<v:imagedata src = "' + jsfw.Path + 'Themes/' + jsfw.Theme + '/Flow/' + a_nodeType + '-big.gif"/>';
			oTable.innerHTML = sHTML;
		}else{
			var sColor_bg='#5F87FF';
			var strokeWeight = '1';
			var sColor_border = (oDiv.currentItem == 'tabFlowNode_'+a_sid)?'red':'#336699';
			if ((a_nodeType=='join-state')) sColor_bg='#A8D961';
			if ((a_nodeType=='junction')) sColor_bg='#BBBBBB';//'#FB9A14';
			if ((a_nodeType=='compete-exe-state')) sColor_bg='#FFCD67';
			if ((a_nodeType=='compete-join-state')) sColor_bg='#cc00ff';
			if ((a_nodeType=='subprocess-state')) sColor_bg='#FB9A14';
			if ((a_nodeType=='serial-exe-state')) sColor_bg='#1F978F';
			if (!bEdit){
				sColor_bg='#5F87FF';
				if (getAttr(oNode,'status')=='running') {
					sColor_bg='#FE7B5B';
				}
				if (getAttr(oNode,'status')=='passed') {
					sColor_bg='#A8D961'
				}
			}
			var strTab='<v:roundrect strokeweight="'+strokeWeight+'" strokecolor="'+sColor_border+'" style="z-index:1;padding-left:3px;padding-right:5px;cursor:default;position:absolute;left:' + a_xlocation +';top:' + a_ylocation +';width:100;height:50;text-align:left;"  fillcolor="'+ sColor_bg +'"';
			if (!bEdit){
				var users=oNode.getElementsByTagName('user');
				var strTem='';
				for (var i=0; i<users.length; i++){
					if (i>0) strTem += '<br>';
					strTem += '[' + users[i].getAttribute('dept') + ']';
					strTem += users[i].getAttribute('name');
					if (users[i].getElementsByTagName('delegation').length>0){
						strTem += '  (' + users[i].getElementsByTagName('delegation')[0].getAttribute('name') + ' 代)';
					}
					if (users[i].getAttribute('status')=='running') strTem += ' [在办]'
					if (users[i].getAttribute('status')=='passed') strTem += ' [已办]'
				}
				if (strTem!='') strTab += ' onmouseover="jsfw.WebUI.Tip.newTip(\''+strTem+'\',this,0);" onmouseout="jsfw.WebUI.Tip.delTip()"/>';
			}
			strTab += '/>';
			var oTable=document.createElement(strTab);
			sHTML+='<table width="100%" style="height:100%" border="0" cellpadding="0" cellspacing="0">';
			sHTML+='<tr><td style="padding-left:5px;padding-top:3px;border-bottom:1px solid #336699;" height="24">';
			sHTML+='<img src="' + jsfw.Path + 'Themes/' + jsfw.Theme + '/Flow/flow-node-'+a_nodeType+'.gif" align="absmiddle"/> ';
			sHTML+=getNodeTypeName(a_nodeType)+'</td></tr>';
			sHTML+='<tr><td style="padding-left:5px">'+getAttr(oNode,'name')+'</td></tr>';
			sHTML+='</table>';
			oTable.innerHTML = sHTML;
			oTable.appendChild(document.createElement('<v:shadow on="t" type="single" color="#CCC" offset="2pt,2pt"/>'));
			oTable.appendChild(document.createElement('<v:fill type="gradient" color2="white"/>'));
		}
		oTable.id="tabFlowNode_"+a_sid;
		oTable.setAttribute('moveStep','10');
		
		oDiv.appendChild(oTable);
		//if (oTable.offsetWidth>100) oTable.style.width = oTable.offsetWidth;
		/*oTable.onmouseover = function (e){
			jsfw.WebUI.Tip.newTip(getAttr(oNode,'name'),this,0);
		}
		oTable.onmouseout = function (e){
			jsfw.WebUI.Tip.delTip();
		}*/
		oTable.oncontextmenu = function (e){
			if (bEdit) oDiv.selItem(this.id);
			return oDiv.onItemContextMenu(e);
		}
		oTable.style.left = a_xlocation - parseInt(oTable.offsetWidth/2) + offsetX;
		oTable.style.top  = a_ylocation - parseInt(oTable.offsetHeight/2) + offsetY;

		if (bEdit){
			oTable.onclick = function (){
			    oDiv.selItem(this.id)
			};
			if (!oTable.Formated) {
				jsfw.WebUI.MoveItem(oTable);
				oTable.Draging = function (){
                        oDiv.modified=true;
					a_sid=oTable.id.substr(12);
					setAttr(oNode,'xlocation', parseInt(oTable.style.left)+ parseInt(oTable.offsetWidth/2) - offsetX);
					setAttr(oNode,'ylocation', parseInt(oTable.style.top) + parseInt(oTable.offsetHeight/2) - offsetY);
					var temNodes=oNode.getElementsByTagName('transition');
					for (var i=0; i<temNodes.length; i++) oDiv.drawLine(temNodes[i]);
					temNodes=oXML.documentElement.selectNodes('*//transition[@to="'+a_sid+'"]');
					for (var i=0; i<temNodes.length; i++) oDiv.drawLine(temNodes[i]);
					temNodes=oXML.documentElement.selectNodes('*//transition[@toNode="'+a_sid+'"]');
					for (var i=0; i<temNodes.length; i++) oDiv.drawLine(temNodes[i]);
				}
			}
		}else{
			var intTem = parseInt(a_ylocation);
			maxHeight = (intTem>maxHeight)?intTem:maxHeight;
		}
		
	}

    oDiv.drawNode_chrome = function (oNode){
        var a_sid = getAttr(oNode,'sid');
        var MxNode = null;
        var a_nodeType = getNodeType(oNode);//oNode.nodeName;
        var a_xlocation = getAttr(oNode,'xlocation');
        var a_ylocation = getAttr(oNode,'ylocation');
        if(a_xlocation<0) a_xlocation = 0;
        if(a_ylocation<0) a_ylocation = 0;
        var tabName = 'tabFlowNode_' + a_sid;
        if (jsfw.$(tabName)) {
            jsfw.$(tabName).onclick = null;
            jsfw.$(tabName).oncontextmenu = null;
            oDiv.removeChild(jsfw.$(tabName));
        }
        var sHTML='';

        var startEndNodeFStr = '<table style="text-align:center;position: relative;">' +
            '<tbody><tr style="color: #000"><td style="vertical-align: middle;line-height: 55px;' +
            'text-align: center; width: 60px;font-weight: bold; font-size: 18;">';
        var startEndNodeSStr  = '</td> </tr></tbody></table></div>';

        var NodeFStr = ' <table style="width: 100%"><col width="30%" /><col width="70%" />' +
            '<tr><td style="text-align:right">' +
            '<img src="../../../js/flow/images/icon/flowunit.gif" style="width: 20px;"></td>' +
            '<td style="text-align:left">';
        var NodeSStr = '</td></tr></table><hr size="1" style="margin-top: 0px">' +
            '<div style="text-align:center"><b style="color: #000">';
        var NodeTStr = '</b></div><label style="display:none"></label>';
        var NodeStyle = 'verticalAlign=top;align=center;overflow=fill;fontSize=12;fontFamily=Helvetica;html=1;' +
            'shadow=1;rounded=1;fillColor=#FFFFFF;gradientColor=';
        var passColor = '#50FF4A;'
        var noPassColor = '#66B2FF;'
        var curColor = '#FF6B6B;'

        if ((a_nodeType=='start-state') || (a_nodeType=='end-state')){

            var showTitle = "开始";
            var startEndNodeColor = passColor;
            if(a_nodeType=='end-state'){
                showTitle = "结束";
                startEndNodeColor = curColor;
            }
            var oTable=document.createElement("div");
            oTable.innerHTML = sHTML;
            MxNode = graph.insertVertex(nodeParent, null, startEndNodeFStr + showTitle + startEndNodeSStr,
                parseInt(a_xlocation), parseInt(a_ylocation), 60, 60, NodeStyle + startEndNodeColor);
        }
        else{
            var sColor_bg='#5F87FF';
            var strokeWeight = '1';
            var sColor_border = (oDiv.currentItem == 'tabFlowNode_'+a_sid)?'red':'#336699';
            if ((a_nodeType=='join-state')) sColor_bg='#A8D961';
            if ((a_nodeType=='junction')) sColor_bg='#BBBBBB';//'#FB9A14';
            if ((a_nodeType=='compete-exe-state')) sColor_bg='#FFCD67';
            if ((a_nodeType=='compete-join-state')) sColor_bg='#cc00ff';
            if ((a_nodeType=='subprocess-state')) sColor_bg='#FB9A14';
            if ((a_nodeType=='serial-exe-state')) sColor_bg='#1F978F';
            if (!bEdit){
                sColor_bg='#5F87FF';
                if (getAttr(oNode,'status')=='running') {
                    sColor_bg='#FE7B5B';
                }
                if (getAttr(oNode,'status')=='passed') {
                    sColor_bg='#A8D961'
                }
            }
            var nodeShowStyle = NodeStyle + sColor_bg;
            var oTable=document.createElement("div");
            oTable.innerHTML = sHTML;

            MxNode = graph.insertVertex(nodeParent, null, NodeFStr +getNodeTypeName(a_nodeType) + NodeSStr + getAttr(oNode,'name') + NodeTStr,
                parseInt(a_xlocation), parseInt(a_ylocation), 100, 60, nodeShowStyle);
        }
        if(MxNode){
        	MxNode.stepId = a_sid;
        	MxNode.nodeId = tabName;
            nodeArray[a_sid] = MxNode;
		}
        oTable.id="tabFlowNode_"+a_sid;
        oDiv.appendChild(oTable);

    }
	//----------------------画节点[End]-------------------

	oDiv.drawNode_chrome_modify = function (oNode){
        var a_sid = getAttr(oNode,'sid');
        var MxNode = null;
        var a_nodeType = getNodeType(oNode);//oNode.nodeName;
        var a_xlocation = getAttr(oNode,'xlocation');
        var a_ylocation = getAttr(oNode,'ylocation');
        if(a_xlocation<0) a_xlocation = 0;
        if(a_ylocation<0) a_ylocation = 0;
        var tabName = 'tabFlowNode_' + a_sid;
        if (jsfw.$(tabName)) {
            jsfw.$(tabName).onclick = null;
            jsfw.$(tabName).oncontextmenu = null;
            oDiv.removeChild(jsfw.$(tabName));
        }
        var sHTML='';

        var startEndNodeFStr = '<table style="text-align:center;position: relative;">' +
            '<tbody><tr style="color: #000"><td style="vertical-align: middle;line-height: 55px;' +
            'text-align: center; width: 60px;font-weight: bold; font-size: 18;">';
        var startEndNodeSStr  = '</td> </tr></tbody></table></div>';

        var NodeFStr = ' <table style="width: 100%"><col width="30%" /><col width="70%" />' +
            '<tr><td style="text-align:right">' +
            '<img src="../../../js/flow/images/icon/flowunit.gif" style="width: 20px;"></td>' +
            '<td style="text-align:left">';
        var NodeSStr = '</td></tr></table><hr size="1" style="margin-top: 0px">' +
            '<div style="text-align:center"><b style="color: #000">';
        var NodeTStr = '</b></div><label style="display:none"></label>';
        var NodeStyle = 'verticalAlign=top;align=center;overflow=fill;fontSize=12;fontFamily=Helvetica;html=1;' +
            'shadow=1;rounded=1;fillColor=#FFFFFF;gradientColor=';
        var passColor = '#50FF4A;'
        var noPassColor = '#66B2FF;'
        var curColor = '#FF6B6B;'

        if ((a_nodeType=='start-state') || (a_nodeType=='end-state')){

            var showTitle = "开始";
            var startEndNodeColor = passColor;
            if(a_nodeType=='end-state'){
                showTitle = "结束";
                startEndNodeColor = curColor;
            }
            var oTable=document.createElement("div");
			oTable.innerHTML = sHTML;

			MxNode = graph.getSelectionCell();
			MxNode.setValue(startEndNodeFStr + showTitle + startEndNodeSStr)
	
        }
        else{
            var sColor_bg='#5F87FF';
            var strokeWeight = '1';
            var sColor_border = (oDiv.currentItem == 'tabFlowNode_'+a_sid)?'red':'#336699';
            if ((a_nodeType=='join-state')) sColor_bg='#A8D961';
            if ((a_nodeType=='junction')) sColor_bg='#BBBBBB';//'#FB9A14';
            if ((a_nodeType=='compete-exe-state')) sColor_bg='#FFCD67';
            if ((a_nodeType=='compete-join-state')) sColor_bg='#cc00ff';
            if ((a_nodeType=='subprocess-state')) sColor_bg='#FB9A14';
            if ((a_nodeType=='serial-exe-state')) sColor_bg='#1F978F';
            if (!bEdit){
                sColor_bg='#5F87FF';
                if (getAttr(oNode,'status')=='running') {
                    sColor_bg='#FE7B5B';
                }
                if (getAttr(oNode,'status')=='passed') {
                    sColor_bg='#A8D961'
                }
            }
            var nodeShowStyle = NodeStyle + sColor_bg;
            var oTable=document.createElement("div");
			oTable.innerHTML = sHTML;
			MxNode = graph.getSelectionCell();
			MxNode.setValue(NodeFStr +getNodeTypeName(a_nodeType) + NodeSStr + getAttr(oNode,'name') + NodeTStr)

        }
        if(MxNode){
        	MxNode.stepId = a_sid;
        	MxNode.nodeId = tabName;
            nodeArray[a_sid] = MxNode;
		}
		graph.refresh(MxNode)
        oTable.id="tabFlowNode_"+a_sid;
        oDiv.appendChild(oTable);

    }

	//----------------------画线[Begin]-------------------
	oDiv.drawLine = function (oNode){
		var parNode=getLineParent(oNode);
		var a_from = getAttr(parNode,'sid');
		var a_to = getAttr(oNode,'to');
		if (getAttr(oNode,'toNode')!='') a_to = getAttr(oNode,'toNode');
		var linName = 'tabFlowLine_' + a_from + '__' + a_to;

		if (jsfw.$(linName)) {
			jsfw.$(linName).onclick=null;
			jsfw.$(linName).oncontextmenu=null;
			//jsfw.$(linName).onmouseover=null;
			//jsfw.$(linName).onmouseout=null;
			oDiv.removeChild(jsfw.$(linName));
		}
		if (a_to=='') return;
		var sColor_border = (oDiv.currentItem == linName)?'red':'#336699';
		var oNode1=parNode;
		var oNode2=oDiv.findNode(a_to);
		var oTab1=jsfw.$('tabFlowNode_' + a_from);
		var oTab2=jsfw.$('tabFlowNode_' + a_to);
		var h1=parseInt(oTab1.offsetHeight/2 + 5); var h2=parseInt(oTab2.offsetHeight/2 + 5);
		var w1=parseInt(oTab1.offsetWidth/2 + 5); var w2=parseInt(oTab2.offsetWidth/2 + 5);
		var xlo1=parseInt(getAttr(oNode1,'xlocation')||0); var ylo1=parseInt(getAttr(oNode1,'ylocation')||0);
		var xlo2=parseInt(getAttr(oNode2,'xlocation')||0); var ylo2=parseInt(getAttr(oNode2,'ylocation')||0);
		var this_x1=0; var this_y1=0; var this_x2=0; var this_y2=0;
		var lineType='Line';
		if (getAttr(oNode,'zLine')=='true') lineType='zLine';
		if (a_from==a_to) lineType='selfLine';
		if (lineType=='zLine'){	////////折线
			var sPath='';
			if (xlo2<(xlo1+2*w1+10) && xlo2>(xlo1-2*w2-10)){////竖折线
				if (ylo2>ylo1){
					this_x1 = xlo1+offsetX;
					this_y1 = ylo1+offsetY + h1;
					this_x2 = xlo2+offsetX;
					this_y2 = ylo2+offsetY - h2;
				}else{
					this_x1 = xlo1+offsetX;
					this_y1 = ylo1+offsetY - h1;
					this_x2 = xlo2+offsetX;
					this_y2 = ylo2+offsetY + h2;
				}
				sPath += this_x1 + ',' + this_y1 + ' l'; 
				sPath += this_x1 + ',' + parseInt((this_y1+this_y2)/2) + ','; 
				sPath += this_x2 + ',' + parseInt((this_y1+this_y2)/2) + ','; 
				sPath += this_x2 + ',' + this_y2; 
			}else{////横折线
				if (xlo2>xlo1){
					this_x1 = xlo1+offsetX + w1;
					this_y1 = ylo1+offsetY;
					this_x2 = xlo2+offsetX - w2;
					this_y2 = ylo2+offsetY;
				}else{
					this_x1 = xlo1+offsetX - w1;
					this_y1 = ylo1+offsetY;
					this_x2 = xlo2+offsetX + w2;
					this_y2 = ylo2+offsetY;
				}
				sPath += this_x1 + ',' + this_y1 + ' l'; 
				sPath += parseInt((this_x1+this_x2)/2) + ',' + this_y1 + ','; 
				sPath += parseInt((this_x1+this_x2)/2) + ',' + this_y2 + ','; 
				sPath += this_x2 + ',' + this_y2; 
			}
			var oLine=document.createElement('<v:shape style="position:absolute;left:0;top:0;width:100;height:100" end="true" start="true" coordsize = "100,100" filled = "f"  strokecolor="'+sColor_border+'" path="m'+sPath+' e"></v:shape>');
		}
		if (lineType=='Line'){	////////直线
			var iWidth0=Math.sqrt((xlo2-xlo1)*(xlo2-xlo1)+(ylo2-ylo1)*(ylo2-ylo1));
			var sinY = (ylo2-ylo1)/iWidth0;
			var cosY = (xlo2-xlo1)/iWidth0;
			if (Math.abs(sinY)<.5){
				var neg=(xlo2>xlo1)?1:-1;
				var alp=(ylo2-ylo1)/(xlo2-xlo1);
				this_x1 = parseInt(xlo1 + neg*w1) + offsetX; this_y1 = parseInt(ylo1 + neg*w1*alp) + offsetY;
				this_x2 = parseInt(xlo2 - neg*w2) + offsetX; this_y2 = parseInt(ylo2 - neg*w2*alp) + offsetY;
			}else{
				var neg=(ylo2>ylo1)?1:-1;
				var alp=(xlo2-xlo1)/(ylo2-ylo1);
				this_x1 = parseInt(xlo1 + neg*h1*alp) + offsetX; this_y1 = parseInt(ylo1 + neg*h1) + offsetY;
				this_x2 = parseInt(xlo2 - neg*h2*alp) + offsetX; this_y2 = parseInt(ylo2 - neg*h2) + offsetY;
			}

			if (oDiv.findNode(a_to).selectNodes('transition[@to="'+a_from+'"]').length>0){ //if (jsfw.$('tabFlowLine_'+a_to+'_'+a_from)) {
				this_y1 += -parseInt(cosY*5); this_x1 += parseInt(sinY*5);
				this_y2 += -parseInt(cosY*5); this_x2 += parseInt(sinY*5);
			}

			var oLine=document.createElement('<v:line style="position:absolute;left:0;top:0" from="'+this_x1+','+this_y1+'" to="'+this_x2+','+this_y2+'" strokeweight="1" strokecolor="'+sColor_border+'"/>');
		}
		if (lineType=='selfLine'){	////////自连线
			var sPath='';
			this_x1 = xlo1+offsetX + w1 -3;
			this_y1 = ylo1+offsetY - 15;
			this_y2 = ylo1+offsetY - h1;
			sPath += this_x1 + ',' + this_y1 + ' l'; 
			sPath += this_x1+20 + ',' + this_y1 + ','; 
			sPath += this_x1+20 + ',' + (this_y1-40) + ','; 
			sPath += (this_x1-20) + ',' + (this_y1-40) + ','; 
			sPath += (this_x1-20) + ',' + this_y2; 

			var oLine=document.createElement('<v:shape style="position:absolute;left:0;top:0;width:100;height:100" end="true" start="true" coordsize = "100,100" filled = "f"  strokecolor="'+sColor_border+'" path="m'+sPath+' e"></v:shape>');
		}
		oLine.id=linName;
		oLine.appendChild(document.createElement('<v:stroke EndArrow="Classic"/>'));

		/*oLine.onmouseover = function (e){
			jsfw.WebUI.Tip.newTip(getAttr(oNode,'name'),this,0);
		}
		oLine.onmouseout = function (e){
			jsfw.WebUI.Tip.delTip();
		}*/

		oLine.oncontextmenu = function (e){
			if (bEdit) oDiv.selItem(linName);
			return oDiv.onItemContextMenu(e);
		}

		oDiv.appendChild(oLine);
		if (bEdit){
			oLine.onclick = function (){oDiv.selItem(linName)};
		}
		return;
	}

    oDiv.drawLine_chrome = function (oNode){
        var parNode=getLineParent(oNode);
        var a_from = getAttr(parNode,'sid');
        var a_to = getAttr(oNode,'to');
        if (getAttr(oNode,'toNode')!='') a_to = getAttr(oNode,'toNode');
        var linName = 'tabFlowLine_' + a_from + '__' + a_to;

        if (jsfw.$(linName)) {
            jsfw.$(linName).onclick=null;
            jsfw.$(linName).oncontextmenu=null;
            //jsfw.$(linName).onmouseover=null;
            //jsfw.$(linName).onmouseout=null;
            oDiv.removeChild(jsfw.$(linName));
        }
        if (a_to=='') return;
        var lineType='Line';
        if (getAttr(oNode,'zLine')=='true') lineType='zLine';
        if (a_from==a_to) lineType='selfLine';
        var LineStyle = 'strokeColor=#FF3333;strokeWidth=2;';


        var oLine = document.createElement("div")
        if (lineType=='zLine' || lineType=='selfLine'){	////////折线 || 自连线
            LineStyle  += "edgeStyle=orthogonalEdgeStyle;"
        }
        var pathNode = graph.insertEdge(nodeParent, null, '', nodeArray[a_from], nodeArray[a_to],LineStyle);
        if(pathNode){
            pathNode.nodeId = linName;
        }
        oLine.id=linName;
        oDiv.appendChild(oLine);
        return;
    }

	//----------------------画线[End]-------------------

	oDiv.addLine = function (oFrom,oTo){
		if (typeof(oFrom)=='string') oFrom=oDiv.findNode(oFrom);
		if (typeof(oTo)=='string') oTo=oDiv.findNode(oTo);
		var idFrom=getAttr(oFrom,'sid');
		var idTo = getAttr(oTo, 'sid');
		var idLine=idFrom + '__' + idTo;
		//李缝兴注释-允许流程环节自循环-20181011
		// if(idFrom == idTo){
		// 	jsfw.WebUI.PopMsg.newMsg('轨迹不允许循环!','提示');
		// 	return '';
		// }
		if (oDiv.findLine(idLine)!=null){
			jsfw.WebUI.PopMsg.newMsg('此轨迹已经存在!','提示');
			return idLine;
		}
		if (getNodeType(oFrom)=='end-state'){
			jsfw.WebUI.PopMsg.newMsg('轨迹不允许从结束环节开始!','提示');
			return '';
		}
		if (getNodeType(oTo)=='start-state'){
			jsfw.WebUI.PopMsg.newMsg('轨迹不允许指向开始环节!','提示');
			return '';
		}
		if (getNodeType(oFrom)=='start-state'){
			if (oFrom.getElementsByTagName('transition').length>0){
				jsfw.WebUI.PopMsg.newMsg('开始环节只允许指向拥有一个迁移!','提示');
				return '';
			}
			var oNodes = oDiv.getRoot().childNodes;
			for (var i=0; i<oNodes.length; i++){
				if (oDiv.isFlowNode(oNodes[i])){
					setAttr(oNodes[i],'stateType', (getAttr(oNodes[i],'sid')==idTo?'0':'1') )
				}
			}
		}

		var newLine=genDefNode(CST_NODE_transition);
		newLine.setAttribute('to',oTo.getAttribute('sid'));
		if (getNodeType(oTo)=='junction'){
			newLine.setAttribute('to',junctionTos(oTo));			
			newLine.setAttribute('toNode',oTo.getAttribute('sid'));
		}
		//if (newLine.getAttribute('name')=='') newLine.setAttribute('name',oDiv.getNewLineName());
		if (newLine.getAttribute('name')=='') newLine.setAttribute('name',oTo.getAttribute('name'));
		oFrom.appendChild(newLine);
        if(/msie/i.test(navigator.userAgent)) {
            oDiv.drawLine(newLine);
        }else{
        	oDiv.drawLine_chrome(newLine);
		}
		if (getNodeType(oFrom)=='junction'){
			// by wengmd modified 10 12 14 junction node 关联节点添加
			//var oNode = oDiv.getXmlNode('/*/transition[@toNode="'+getAttr(oFrom,'sid')+'"]');		
			//if (oNode!=null) {setAttr(oNode,'to',junctionTos(oFrom));}			
			var temNodes = oDiv.getXmlNodes('/*/transition[@toNode="'+getAttr(oFrom,'sid')+'"]');	
			if (temNodes!=null)
				for (var i=0; i<temNodes.length; i++){
					setAttr(temNodes[i],'to',junctionTos(oFrom));
				}			
		}
		return idLine;
	}

	oDiv.findLine = function (sid){
		var arr=sid.split('__');
		var oLine= oDiv.getXmlNode('/*[@sid="'+arr[0]+'"]/transition[@to="'+arr[1]+'"]');
		if (oLine==null) oLine= oDiv.getXmlNode('/*[@sid="'+arr[0]+'"]/transition[@toNode="'+arr[1]+'"]');		
		return oLine;
	}
	oDiv.findNodeFromPoint = function (iX,iY){
		var oNodes = oDiv.getRoot().childNodes;
		for (var i=0; i<oNodes.length; i++){
			if (oDiv.isFlowNode(oNodes[i])){
				var oTab=jsfw.$('tabFlowNode_' + getAttr(oNodes[i],'sid'));
				if (oTab==null) continue;
				if (iX < parseInt(oTab.style.left)) continue;
				if (iX > parseInt(oTab.style.left) + parseInt(oTab.offsetWidth)) continue;
				if (iY < parseInt(oTab.style.top)) continue;
				if (iY > parseInt(oTab.style.top) + parseInt(oTab.offsetHeight)) continue;
				return oNodes[i];
			}
		}
		return null;
	}
	oDiv.getNewNodeID = function (){
		for (var i=1; i<1000; i++){
			var strTem='step'+i.toString()+'0';
			if (oDiv.findNode(strTem)==null){
				return strTem;
			}
		}
	}
	oDiv.getNewLineName = function (){
		var oNodes = oDiv.getRoot().getElementsByTagName('transition');
		for (var i=0; i<1000; i++){
			var strTem='迁移'+i.toString();
			var bFound=false;
			for (var j=0; j<oNodes.length; j++){
				if (getAttr(oNodes[j],'name')==strTem){
					bFound=true;
					break;
				}
			}
			if (!bFound) return strTem;
		}
	}
	//设置节点新ID
	oDiv.setNodeSID = function (oNode,newSID){
		var oNodes = oDiv.getRoot().childNodes;
		for (var i=0; i<oNodes.length; i++){
			if (oDiv.isFlowNode(oNodes[i]) && (getAttr(oNodes[i],'sid')==newSID) && (oNodes[i]!=oNode)){
				jsfw.WebUI.PopMsg.newMsg('此环节标识已被使用!','提示');
				return;
			}
		}

		var oID=getAttr(oNode,'sid')
		oNodes = oDiv.getRoot().getElementsByTagName('transition');
		for (var i=0; i<oNodes.length; i++){
			if (getAttr(oNodes[i],'to')==oID) setAttr(oNodes[i],'to',newSID);
			if (getAttr(oNodes[i],'toNode')==oID) setAttr(oNodes[i],'toNode',newSID);
		}
		oNode.setAttribute('sid',newSID);
		oDiv.modified=true;
		jsfw.$('tabFlowNode_'+oID).id = 'tabFlowNode_' + newSID;

		var temNodes=oNode.getElementsByTagName('transition');
		for (var i=0; i<temNodes.length; i++) {
			var linName = 'tabFlowLine_' + oID + '__' + getAttr(temNodes[i],'to');
			var linName2 = 'tabFlowLine_' + newSID + '__' + getAttr(temNodes[i],'to');
			if (jsfw.$(linName)==null){
				var linName = 'tabFlowLine_' + oID + '__' + getAttr(temNodes[i],'toNode');
				var linName2 = 'tabFlowLine_' + newSID + '__' + getAttr(temNodes[i],'toNode');
			}
			jsfw.$(linName).id = linName2;
		}
		temNodes=oXML.documentElement.selectNodes('*/transition[@to="'+newSID+'"]');
		for (var i=0; i<temNodes.length; i++) {
			var linName = 'tabFlowLine_' + getAttr(getLineParent(temNodes[i]),'sid') + '__' + oID;
			var linName2 = 'tabFlowLine_' + getAttr(getLineParent(temNodes[i]),'sid') + '__' + newSID;
			jsfw.$(linName).id = linName2;
		}
		temNodes=oXML.documentElement.selectNodes('*/transition[@toNode="'+newSID+'"]');
		for (var i=0; i<temNodes.length; i++) {
			var linName = 'tabFlowLine_' + getAttr(getLineParent(temNodes[i]),'sid') + '__' + oID;
			var linName2 = 'tabFlowLine_' + getAttr(getLineParent(temNodes[i]),'sid') + '__' + newSID;
			jsfw.$(linName).id = linName2;
		}
		if (oDiv.currentItem == 'tabFlowNode_'+oID) oDiv.currentItem = 'tabFlowNode_'+newSID;
	}

	oDiv.onItemContextMenu = function (e){
		return true;
	}

	oDiv.delLine = function (aLine){
		var a_from = getAttr(getLineParent(aLine),'sid');
		var a_to = getAttr(aLine,'to');
		if (getAttr(aLine,'toNode')!='') a_to = getAttr(aLine,'toNode');
		var linName = 'tabFlowLine_' + a_from + '__' + a_to;
		oDiv.modified = true;
		if (oDiv.currentItem == linName) oDiv.selItem('');
		if (jsfw.$(linName)) {
			jsfw.$(linName).onclick=null;
			jsfw.$(linName).oncontextmenu=null;
			oDiv.removeChild(jsfw.$(linName));
		}
		var oPar=getLineParent(aLine);
		oPar.removeChild(aLine);
		if (getNodeType(oPar)=='junction'){
			// by wengmd modified 10 12 14 junction node 关联节点添加
			//var oNode = oDiv.getXmlNode('/*/transition[@toNode="'+getAttr(oPar,'sid')+'"]');
			//if (oNode!=null) setAttr(oNode,'to',junctionTos(oPar));
			var temNodes = oDiv.getXmlNodes('/*/transition[@toNode="'+getAttr(oPar,'sid')+'"]');	
			if (temNodes!=null)
				for (var i=0; i<temNodes.length; i++){
					setAttr(temNodes[i],'to',junctionTos(oPar));
				}
		}
	}
	oDiv.delNode = function (aNode){
		var a_sid = getAttr(aNode,'sid');
		var tabName = 'tabFlowNode_' + a_sid;
		oDiv.modified = true;
		if (oDiv.currentItem == tabName) oDiv.selItem('');
		var temNodes=aNode.getElementsByTagName('transition');
		for (var i=0; i<temNodes.length; i++) oDiv.delLine(temNodes[i]);
		temNodes=oXML.documentElement.selectNodes('*/transition[@to="'+a_sid+'"]');
		for (var i=0; i<temNodes.length; i++) oDiv.delLine(temNodes[i]);
		temNodes=oXML.documentElement.selectNodes('*/transition[@toNode="'+a_sid+'"]');
		for (var i=0; i<temNodes.length; i++) {oDiv.delLine(temNodes[i])};

		if (jsfw.$(tabName)) {
			jsfw.$(tabName).onclick = null;
			jsfw.$(tabName).oncontextmenu = null;
			oDiv.removeChild(jsfw.$(tabName));
		}
		aNode.parentNode.removeChild(aNode);
	}
	oDiv.delItem = function (sHTMLID){
        if(!(/msie/i.test(navigator.userAgent))){
            if (graph.isEnabled()) {
                graph.removeCells();
            }
        }
		if (sHTMLID=='') sHTMLID=oDiv.currentItem;
		if (sHTMLID=='') return;
		var sID=sHTMLID.substr(12);
		if (sHTMLID.substr(0,12)=='tabFlowNode_'){
			return oDiv.delNode(oDiv.findNode(sID));
		}else{
			return oDiv.delLine(oDiv.findLine(sID));
		}
	}

	//选择节点或线
	oDiv.currentItem = '';
	oDiv.getCurrentObj = function (){
		if (oDiv.currentItem=='') return oDiv.getRoot();
		if (oDiv.currentItem.substr(0,12)=='tabFlowNode_') return oDiv.findNode(oDiv.currentItem.substr(12));
		if (oDiv.currentItem.substr(0,12)=='tabFlowLine_') return oDiv.findLine(oDiv.currentItem.substr(12));
	}
	oDiv.selItem = function (sHTMLID){
		oInput.focus();
		if (oDiv.currentItem == sHTMLID) return;
		if (oDiv.currentItem!=''){
			jsfw.$(oDiv.currentItem).strokecolor = '#336699';
		}
		var obj=jsfw.$(sHTMLID);
		if (obj==null){
			oDiv.currentItem='';
		}else{
			obj.strokecolor = 'red';
			oDiv.currentItem = sHTMLID;
			//alert('Previous:' + oDiv.getPreviousNodes(oDiv.getCurrentObj())+'\nNext:'+oDiv.getNextNodes(oDiv.getCurrentObj()))
		}
		oDiv.afterSelItem();
	}
	oDiv.afterSelItem = function (){
	}

	//-------------------------动作
	var divTempNode=null;		//画节点的虚框
	oDiv.act_AddNode = function (nodeType){
		if (nodeType=='start-state'){
			if (oDiv.getXmlNode('/start-state')!=null){
				jsfw.WebUI.PopMsg.newMsg('流程只允许有一个开始节点!','提示');
				return;
			}
		}
		if (nodeType=='end-state'){
			if (oDiv.getXmlNode('/end-state')!=null){
				jsfw.WebUI.PopMsg.newMsg('流程只允许有一个结束节点!','提示');
				return;
			}
		}
		if (divTempNode==null){
			divTempNode = document.createElement('div');
			divTempNode.id='jsfw_Flow_TempNode';
			divTempNode.style.position='absolute';
			divTempNode.style.border='2px dotted red';
			divTempNode.style.width = 102;
			divTempNode.style.height = 50;
			divTempNode.style.left = 0;
			divTempNode.style.top = 0;
			divTempNode.style.zIndex =1;
			oDiv.appendChild(divTempNode);
			divTempNode.oncontextmenu = function (){
				divTempNode.releaseCapture();
				document.onmousemove = document.onclick = null;
				divTempNode.style.display='none';
				return false;
			}
		}
		divTempNode.style.display='';
        if(/msie/i.test(navigator.userAgent)){
            divTempNode.setCapture();
        }
		document.onmousemove = function (e){
			e = e || event;
			divTempNode.style.left = parseInt((e.clientX)/10)*10-50 + "px";
			divTempNode.style.top = parseInt((e.clientY)/10)*10-25 + "px";
		};
		document.onclick = function (e){
            if(/msie/i.test(navigator.userAgent)) {
                divTempNode.releaseCapture();
            }
			document.onmousemove = document.onclick = null;
			divTempNode.style.display='none';

			oDiv.modified=true;
			var newNode=genDefNode(eval('CST_NODE_'+nodeType.replace(/-/g,'_')));
			var newSID=oDiv.getNewNodeID();
			if (nodeType=='start-state') newSID='step1';
			if (nodeType=='end-state') newSID='step0';

			newNode.setAttribute('sid',newSID);
			if (newNode.getAttribute('name')=='') newNode.setAttribute('name','新环节'+newSID);
			newNode.setAttribute('xlocation',parseInt(divTempNode.style.left)+50-offsetX);
			newNode.setAttribute('ylocation',parseInt(divTempNode.style.top)+25-offsetY);
			newNode.setAttribute('sequence',(parseInt(newSID.replace(/\D/img,''))||0));
			newNode.setAttribute('sNo',(parseInt(newSID.replace(/\D/img,''))||0));
			oDiv.getRoot().appendChild(newNode);
            if(/msie/i.test(navigator.userAgent)) {
                oDiv.drawNode(newNode);
            }else{
                oDiv.drawNode_chrome(newNode);
            }
			if (nodeType=='start-state'){
				var temNode=oDiv.getXmlNode('/*[@stateType="0"]');
				if (temNode!=null) oDiv.addLine(newNode,temNode);
			}
			oDiv.selItem('tabFlowNode_' + newSID);
		}
	}
	var divTempLine=null;		//虚线
	var temLineBeginNode='';	//起启节点
	//var bDoAddingLine=false;
	oDiv.act_AddLine = function (){
		if (divTempLine==null){
			divTempLine = document.createElement('<v:line style="position:absolute;left:0;top:0" from="-10,0" to="20,-10" strokeweight="1" strokecolor="red"/>');
			divTempLine.id='jsfw_Flow_TempLine';
			divTempLine.style.zIndex =0;
			divTempLine.appendChild(document.createElement('<v:stroke EndArrow="Classic" dashstyle="Dot"/>'));
			oDiv.appendChild(divTempLine);
			divTempLine.oncontextmenu = function (){
				divTempLine.releaseCapture();
				document.onmousemove = document.onclick = null;
				divTempLine.style.display='none';
				return false;
			}
		}
		temLineBeginNode = '';
		divTempLine.style.left = 0;
		divTempLine.style.top = 0;
		divTempLine.from='-10,0';
		divTempLine.to='20,-10';
		divTempLine.style.display='';
		divTempLine.setCapture();
		document.onmousemove = function (e){
			e = e || event;
			if (temLineBeginNode==''){
				divTempLine.style.left = e.clientX;//parseInt((e.clientX)/10)*10-50 + "px";
				divTempLine.style.top = e.clientY;//parseInt((e.clientY)/10)*10-25 + "px";
			}else{
				divTempLine.to = e.clientX + ',' + e.clientY;//parseInt((e.clientY)/10)*10-25 + "px";	
				divTempLine.style.display='';
			}
		};
		document.onclick = function (e){
			var iX=event.clientX;//parseInt(divTempLine.style.left);
			var iY=event.clientY;//parseInt(divTempLine.style.top);
			var temNode=oDiv.findNodeFromPoint(iX,iY);
			if (temNode==null){
				divTempLine.releaseCapture();
				document.onmousemove = document.onclick = null;
				divTempLine.style.display='none';
				return;
			}
			if (temLineBeginNode==''){
				var oTab=jsfw.$('tabFlowNode_' + getAttr(temNode,'sid'));
				iX= parseInt(oTab.style.left) + parseInt(oTab.offsetWidth/2);
				iY= parseInt(oTab.style.top) + parseInt(oTab.offsetHeight/2);
				divTempLine.style.display='none';
				divTempLine.from = iX + ',' + iY;//e.clientY;//parseInt((e.clientY)/10)*10-25 + "px";
				divTempLine.to = divTempLine.from;
				divTempLine.style.left = 0;
				divTempLine.style.top = 0;
				temLineBeginNode=getAttr(temNode,'sid');
			}else{
				divTempLine.releaseCapture();
				document.onmousemove = document.onclick = null;
				divTempLine.style.display='none';
				oDiv.modified=true;
				var strTem = oDiv.addLine(temLineBeginNode,temNode);
				if (strTem!='') oDiv.selItem('tabFlowLine_' + strTem);
			}
		}
	}


	oDiv.getFlowXML = function (){
        if(/msie/i.test(navigator.userAgent)){
            return '<?xml version="1.0" encoding="gb2312"?>\n' + revTransitions(oDiv.getRoot().xml);
        }else{
            return '<?xml version="1.0" encoding="gb2312"?>\n' + revTransitions(oDiv.getRoot());
        }
		//return oXML.xml;
	}
	oDiv.getNodeType = function (oNode){
		if (getAttr(oNode,'sid')=='step0') return 'end-state';
		if (getAttr(oNode,'sid')=='step1') return 'start-state';
		if (getAttr(oNode,'type')=='') return oNode.nodeName;
		if (getAttr(oNode,'type')=='普通环节') return 'state';
		if (getAttr(oNode,'type')=='串行环节') return 'serial-exe-state';
		if (getAttr(oNode,'type')=='竞争环节') return 'compete-exe-state';
		if (getAttr(oNode,'type')=='结束环节') return 'end-state';
		if (getAttr(oNode,'type')=='汇合环节') return 'join-state';
		if (getAttr(oNode,'type')=='并发迁移') return 'junction';
		if (getAttr(oNode,'type')=='开始环节') return 'start-state';
		if (getAttr(oNode,'type')=='竞争汇合') return 'compete-join-state';
		if (getAttr(oNode,'type')=='子流程') return 'subprocess-state';
		return oNode.nodeName;
	}
	oDiv.getNextNodes = function (param){	//获取下一节点
		var oNode = (typeof(param)=='String')?oDiv.findNode(param):param;
		var nodes=oNode.selectNodes('transition');
		var sR='';
		for (var i=0; i<nodes.length; i++){
			try{
				var strTem = getNodeType(oDiv.findNode(getAttr(nodes[i],'to')));
				if ((strTem=='start-state')||(strTem=='end-state')) continue;
			}catch(e){}
			if (sR!='') sR += ',';
			sR += getAttr(nodes[i],'to')
		}
		return sR;
	}
	oDiv.getPreviousNodes = function (param){ //获取下一节点
		var sid = (typeof(param)=='String')?param:getAttr(param,'sid');
		var sR='';
		var temNodes=oXML.documentElement.selectNodes('*//transition[@to="'+sid+'"]');
		for (var i=0; i<temNodes.length; i++) {
			//if ((getNodeType(temNodes[i])=='start-state')||(getNodeType(temNodes[i])=='end-state')) continue;
			if (sR!='') sR += ',';
			sR += getAttr(getLineParent(temNodes[i]),'sid');
		}
		temNodes=oXML.documentElement.selectNodes('*//transition[@toNode="'+sid+'"]');
		for (var i=0; i<temNodes.length; i++) {
			//if ((getNodeType(temNodes[i])=='start-state')||(getNodeType(temNodes[i])=='end-state')) continue;
			if (sR!='') sR += ',';
			sR += getAttr(getLineParent(temNodes[i]),'sid');
		}
		return sR;
	}

	//公共函数
	function getLineParent(oNode){
		return (oNode.parentNode.nodeName=='transition-list')?oNode.parentNode.parentNode:oNode.parentNode;
	}
	function getNodeType(oNode){
		return oDiv.getNodeType(oNode);
	}
	function getNodeTypeName(sType){
		if (sType=='start-state') return "开始环节";
		if (sType=='end-state')  return "结束环节";
		if (sType=='state')  return "普通环节";
		if (sType=='serial-exe-state') return "串行环节";
		if (sType=='join-state')  return "汇合环节";
		if (sType=='junction') return "并发迁移";
		if (sType=='compete-exe-state') return "竞争环节";
		if (sType=='compete-join-state') return "竞争汇合";
		if (sType=='subprocess-state') return "子流程";
	}
	function getXMLDom(){
		if (/msie/i.test(navigator.userAgent))
			for (var i=0; i<4; i++)
				try{
					var r = new ActiveXObject(["MSXML2.DOMDocument", "Microsoft.XMLDOM", "MSXML.DOMDocument", "MSXML3.DOMDocument"][i]);
					return r;
				}catch (e){return null;}
		else return document.implementation.createDocument("", "doc", null);
	}
	function genDefNode(strXML){
		var oXML=getXMLDom();
        if (/msie/i.test(navigator.userAgent)){
            oXML.async = false;
            oXML.loadXML(strXML);
        }else{
            if(typeof(strXML) == "string"){
                oXML = new DOMParser().parseFromString(strXML,"text/xml");
            }else{
                oXML = new DOMParser().parseFromString((new XMLSerializer()).serializeToString(strXML),"text/xml");
            }
        }
		return oXML.documentElement;
	}
	function copyNodeAttr(srcNode,tagNode){
		for (var i=0; i<srcNode.attributes.length; i++)
			tagNode.setAttribute(srcNode.attributes[i].nodeName,srcNode.attributes[i].text);
	}
	//清除内存
	if (window.attachEvent) window.attachEvent('onunload', function (){
		if (divTempNode!=null) oDiv.removeChild(divTempNode);
		if (divTempLine!=null) oDiv.removeChild(divTempLine);
		oDiv.removeChild(oInput);
		oDiv.addLine = null;
		oDiv.selItem = null;
		oDiv.afterSelItem = null;
		oDiv.findNodeFromPoint = null;
		oDiv.getNewNodeID = null;
		oDiv.act_AddNode = null;
		oDiv.act_AddLine = null;
		oDiv.onItemContextMenu = null;
		oDiv.currentItem = null;
		oDiv.getCurrentObj = null;
		oDiv.findLine = null;
		oDiv.delLine = null;
		oDiv.delNode = null;
		oDiv.delItem = null;

		oDiv.loadFromURL = null;
		oDiv.loadFromString = null;
		oDiv.getRoot = null;
		oDiv.getNodeType = null;
		oDiv.drawNode = null;
		oDiv.drawLine = null;
		oDiv.getAttr = null;
		oDiv.setAttr = null;
		oDiv.getFlowXML = null;
		oDiv.findNode = null;
		oDiv.getXmlNode = null;
		oDiv.appendXmlChildNode = null;
		oDiv.replaceXmlChildNode = null;
		oDiv.getNewLineName = null;
		oDiv.setNodeSID = null;
		oDiv.isFlowNode = null;
		oDiv.getNextNodes = null;
		oDiv.getPreviousNodes = null;
	});
};

jsfw.WebUI.Flow.TagName = 'div';

//引用样式文件
(
	function (){
		var head = document.getElementsByTagName('head')[0];
		var link = document.createElement('link');
		link.rel = 'stylesheet';
		link.href = jsfw.Path + 'Themes/' + jsfw.Theme + '/Flow/css.css';
		link.type = 'text/css';
		link.media = 'all';
		head.appendChild(link);
	}
)();