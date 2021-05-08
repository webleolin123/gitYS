/**
 * 流程交互后台action URL
 * @type {string}
 */
var engineServletUrlPost =  "/EngineServlet.action"; //流程交互请求
var engineServletUrlHttp =  "/EngineRequest.action";//流程业务请求
var engineServletUrlOpe =  "/EngineOperate.action";//流程其他操作请求

var engineServletUrlCore = "/EngineServlet.action?t={JSTime}&m=coreProcess";//流程引擎交互请求URL

/**
 * 流程交互全局请求
 * @type {{}}
 */
var requestJson = {
	REQ_DRAFT: "draftrequest",// 流程起草与流程实例文档信息休息
	REQ_TRANSITION: "transitionrequest",//路径查询
	REQ_ASSIGNMENT: "assignmentrequest",//人员查询
	REQ_STATESUBMIT: "statesubmitrequest",//发送、办毕
	REQ_CANCELENDSUBMIT: "cancelendsubmitrequest",//取消办毕
	REQ_QUERY_CANCELSUBMIT: "querycancelsubmitrequest",//查询可以撤办的待办
	REQ_CANCELSUBMIT: "cancelstatesubmitrequest",//【撤办操作】第二步进行撤办操作
	REQ_QUERY_CLOSEWORKITEM: "querycloseworkitemrequest",//【结束处理】结束处理第一步请求查询哪些人员待办可以处理
	REQ_CLOSE_WORKITEM: "closeworkitemrequest",//【结束处理】根据选择的人员待办信息 结束待办处理
	REQ_QUERY_REEXECUTE_CANDIDATES: "queryreexecutecandidatesrequest",//【取消办结】第一步查询可以取消办结环节
	REQ_CANCELENDPROCESS: "cancelendprocessinstancerequest",//【取消办结】第二步与流程引擎交互
	REQ_SPECIAL_STATESUBMIT: "specialstatesubmitrequest",//【特送】
	REQ_SWITCHTEMPLATE: "switchtemplaterequest",//【流程切换】
	REQ_URGE: "urgerequest",//【手动催办】
	REQ_TODO: "todorequest",//【查询待办人员信息】
	REQ_REVOKE: "revokerequest",//【文件作废请求】
	REQ_RESUME: "resumerequest",//【取消作废】
	REQ_FORCEEND: "forceendrequest",//强制办结
	REQ_CHECKIN: "checkinrequest",//签收
	REQ_RESUBMIT: "resubmitrequest",//补发
	REQ_HANDNOTIFY: "handnotifyrequest"//手动知会
};
/**
 * 全局流程交互对象
 * @type
 */
var flowJson = {
	docid: "",//文档id
	ptlabel: "",//流程模板标签字段
	ptversion: "",//流程模板版本字段
	piid: "",//流程实例id
	ptname: "",//流程模板名称
	companyid: '',//单位id
	aiid: "",//流程环节实例id
	wiid: "",//流程待办id
	stateid: "",//流程环节id
	statename: "",//流程环节名称
	formersid: "",//前一个环节id
	pstatus: "",//流程实例状态值
	username:"",//用户名称
	userinfo: "",//发送生成的用户信息
	wstatus: "",//待办状态
	todouser: "",//待办用户
	todostate: "",//待办环节
	passuser: "",//经办用户
	passstate: "",//经办环节
	viewed: "",//文是否已经已阅
	oriuserinfo:"",//原始人员信息
	oriusername:"",//原始人员名称
	pdeadline:""//流程实例办毕时限
};
/**
 * 初始化返回流程对象
 * @type {null}
 */
var initResultJson = null;//包含流程环节信息与待办信息
var workitemJson = null;//待办信息返回结果 可能存在多个
var stateJson = null;//环节信息
var TransAndUser = [];//发送获取到的路径与人员信息
var engineConfigJson = null;//流程引擎配置的参数对象
//代理人员信息
var agentWinArray = new Array();

window.flowEngine = {};
(function () {
	flowEngine.todoBusinessType = "";//填写意见时 触发的会签、签发等特殊内容

	flowEngine.isEngine = false;
	/**
	 * 流程引擎初始化函数
	 * @param FID 文档id
	 * @param ptLabel 流程标签
	 * @param ptVer 流程模板
	 */
	flowEngine.init = function (FID, ptLabel, ptVer, companyId, piid, aiid, wiid, EType, EId) {
		if (isEmpty(FID) && isEmpty(ptLabel) && isEmpty(ptVer)) {
			top.showMsg("流程交互参数异常，流程退出");
			return;
		}
		if (!isEmpty(FID))flowJson.docid = FID;
		if (!isEmpty(ptLabel))flowJson.ptlabel = ptLabel;
		if (!isEmpty(ptVer))flowJson.ptversion = ptVer;
		if (!isEmpty(piid))flowJson.piid = piid;
		if (!isEmpty(aiid))flowJson.aiid = aiid;
		if (!isEmpty(wiid))flowJson.wiid = wiid;

		var postData = {};
		postData.docId = flowJson.docid;
		postData.ptLabel = flowJson.ptlabel;
		postData.ptVersion = flowJson.ptversion;
		postData.piid = flowJson.piid;
		postData.aiid = flowJson.aiid;
		postData.wiid = flowJson.wiid;
		postJSON(engineServletUrlHttp, postData, function (json, e) {
			if (json && json.errorCode == "0" && json.data && json.data[0]) {
				initResultJson = json.data[0];
				workitemJson = json.data[0].process;
				stateJson = json.data[0].stateinfo;
				flowEngine.isEngine = true;
				engineConfigJson = typeof (json.data_desc)=="object"?json.data_desc:jt.Str2Json(json.data_desc);
			}
			_initAfter(FID, ptLabel, ptVer, companyId, EType, EId);
		});
	}
	/**
	 * 提供外界获取初始化返回结果对象
	 * @returns {null}
	 */
	flowEngine.getFlowJson = function () {
			return initResultJson;
	}
	/**
	 * 提供外界获取流程交互参数信息
	 * @returns {{docid: string, ptlabel: string, ptversion: string, piid: string, ptname: string, companyid: *, aiid: string, wiid: string, stateid: string, statename: string, formersid: string, pstatus: string, userinfo: string, wstatus: string, todouser: string, todostate: string, passuser: string, passstate: string}}
	 */
	flowEngine.getJSonParam = function () {
			return flowJson;
	}
	flowEngine.getStateJson = function () {
			return stateJson;
	}
	flowEngine.getEngineConfigJson = function(){
			return engineConfigJson;
	}

	/**
	 * 弹出窗口中获取发送路径与人员信息
	 * sTransType类型: send:发送   reject:退回  sendOther:转办 all:所有
	 * @returns {*}
	 */
	flowEngine.getTransitionAndUser = function (sTransType) {
		sTransType=jt.def(sTransType,'send');
		if (sTransType=='all') return TransAndUser||[];
		var arr=[];
		jt.each(TransAndUser,function(idx,item){
			if (item.transType==sTransType) arr.push(item);
		});
		return arr;
	}
	flowEngine.getTransitionAndUserItem = function (sTransTo,sTransReject,sTransType) {
		if (typeof(sTransTo)=='number') return TransAndUser[sTransTo]||null;
		return TransAndUser_FindItem(sTransTo,sTransReject,sTransType);
	}
	flowEngine.getTransitionAndUserItemByIdx = function (idx) {
		var arr= TransAndUser;
		for (var i=0;i<arr.length;i++){
			if (arr[i].idx==idx) return arr[i];
		}
		return null;
	}
	/**
	 * 点击保存按钮触发
	 1、业务方对表单数据进行维护保存
	 2、调用流程引擎方法创建流程实例 此处为第二步
	 * @param docJson
	 */
	flowEngine.engineSaveFlow = function (docJson, callback) {
			//当流程实例ID为空说明还没有流程实例时创建流程实例
			//在文档保存后传递的文档参数json对象 在该对象上面添加参数
			if (isEmpty(flowJson.docid))flowJson.docid = parent.FID;
			if (!isEmpty(docJson.piid) && isEmpty(flowJson.piid)) flowJson.piid = docJson.piid; //shiah新增
			if (!isEmpty(docJson.wiid) && isEmpty(flowJson.wiid)) flowJson.wiid = docJson.wiid; //shiah新增
			if (!isEmpty(docJson.aiid) && isEmpty(flowJson.aiid)) flowJson.aiid = docJson.aiid; //shiah新增
			var paramJson = {};
			paramJson.requestType = requestJson.REQ_DRAFT;
			paramJson.flowinfo = jt.Obj2Str(flowJson);
			paramJson.docinfo = jt.Obj2Str(docJson);
			postJSON(engineServletUrlPost, paramJson, function (json, o) {
					if (json.errorCode == '0') {
							flowJson.piid = json.result.piid;
							flowJson.aiid = json.result.aiid;
							flowJson.wiid = json.result.wiid;
							flowJson.userinfo = json.result.userinfo;
							callback(flowJson.piid)
					} else {
							parent.showMsg(json.errorInfo, "失败", 5);
					}
			});
	}

	//发送前检测
	flowEngine.engineSubmitFlowFun_Check = function(){
		//文档保存并与流程关联后 发送方法生效
		if (isEmpty(flowJson.piid)) {
			parent.showMsg("请先保存文档信息！", "提示", 10);
			return false;
		}
		//发送前验证环节是否可用
		var validAction = stateJson.action;
		var ifValidPass = false;
		if (!isEmpty(validAction)) {
			if (typeof(parent.flow_Action_Before) == 'function') {
				var json = {};
				json.requestType = "stateAction";
				json.action = validAction;
				ifValidPass = parent.flow_Action_Before(json);
			}else{
				ifValidPass = true;
			}
		} else {
			if (typeof(parent.flow_Action_Before) == 'function') {
				ifValidPass = parent.flow_Action_Before(initResultJson);
			} else {
				ifValidPass = true;
			}
		}
		//验证不通过
		if (!ifValidPass) {
			top.showMsg("流程发送前业务端验证不通过，流程发送终止。", "发送失败", 1000);
			return false;
		}
		return true;
	}
	/**
	 * 点击发送按钮调用该方法
	 * @param isreject 是否退回
	 * @param isHaveOpinon 是否已经填写意见
	 * @param sCustomPage 自定义选择流程人员页面
	 */
	flowEngine.engineSubmitFlowFun = function (isreject, ishaveOpinion, sCustomPage) {
		if (!flowEngine.engineSubmitFlowFun_Check()) return;
		parent.showLoading('正在处理...');
		//debugger;
		//查询路径与人员信息
		flowEngine.engieShowTransitionAndUser_query(isreject, function (json) {
			//TransAndUser = json;
			var bReject = jt.def(isreject,false);
			var arr=flowEngine.getTransitionAndUser(bReject?'reject':'send');

			//只有一个发送路径选择且只有一个候选人
			var bSingleUser = ((arr.length==1) && (arr[0].isSingleUser));
			//判断附言是否必填
			var bNeedNote = stateJson.stateDoc.notes == '1';
			//判断意见是否为必填
			var opinionAvailable = stateJson.stateNotion.availabel;
			//stateJson.stateNotion.availabel == '1'

				//debugger;
				var ifShow = (!bSingleUser) || (bNeedNote);
				if (!ifShow) {
					//判断意见是否为必填
					//如果意见为必填，查看意见是否已经填写
					if (opinionAvailable=='1') ifShow = !ishaveOpinion;
				}
				parent.showLoading(false);
				if (ifShow == true) {
					//弹出窗口前检查
					var func=parent.engineSubmitFlowFun_BeforeDialog;
					if (typeof(func)=='function'){
						func(isreject,bSingleUser,opinionAvailable,bNeedNote,function (bShowDlg){
							if (bShowDlg) flowEngine.engineSubmitFlowFun_ShowDialog(isreject, sCustomPage);
						});
					}else{
						flowEngine.engineSubmitFlowFun_ShowDialog(isreject, sCustomPage);
					}
				} else {
					//发送人员不需要选择
					if (parent.SYSCFG.Flow_ConfirmSendDirect){
						parent.jtConfirm('是否发送给 ['+arr[0].singleUser.text+'] ？', function (bYes) {
							if (!bYes) return;
							_sendSubmitNoWind(arr[0],isreject);
						});
					}else{
						_sendSubmitNoWind(arr[0],isreject);
					}
				}
			});
		}
		flowEngine.engineSubmitFlowFun_ShowDialog = function(isreject, sCustomPage) {
			sCustomPage = jt.def(sCustomPage, 'transition_user_select.jsp');
			var height = 340;
			height = 320;	//浏览器标签页打开页面时，会出现流程窗口过高的问题，所以初始高度调小
			if (stateJson.stateNotion.availabel!=0 && stateJson.stateNotion.dialog != '0') height = height + 201; //发送框是否可填写意见
			if (stateJson.stateDoc.notes != '0') height = height + 40; //附言
			var engineConfigJson = parent.frameEngine.getEngineConfigJson();
			if (engineConfigJson && engineConfigJson.IsMsgSenderEnable && engineConfigJson.IsMsgSenderEnable == '1') {
				height = height + 30; //消息提醒
			}
			var transition = parent.frameEngine.getFlowJson().stateinfo.transition;
			if (jt.isArray(transition)) height = height + 30; //多环节选择
			showFlowDialog('路径人员发送', sCustomPage + '?isreject=' + isreject, 'WinEdit3', 540, height, false);
		}
		/**
		 * 提供外界方法
		 * 发送前获取路径以及当路径只有一个时包括该路径下人员
		 * @param isreject
		 * @param fun
		 */
		flowEngine.engieShowTransitionAndUser_query = function (isreject, callback) {
			var bReject = jt.def(isreject,false);
			var sTransType = bReject?'reject':'send';
			var arr=flowEngine.getTransitionAndUser(sTransType);
			//检查是否已经查询过路径，已有路径，不再查询
			if (arr.length>0){
				if (typeof (callback) == "function") callback(arr);
				return;
			}
			//引擎请求的xml串
			var postData = {};
			postData.requestType = requestJson.REQ_TRANSITION;
			postData.rejectrequest = bReject ? "true" : "false";
			postData.resubmitrequest = "false";
			postData.flowinfo = jt.Obj2Str(flowJson);
			postData.context = _getContextJson();
			//发送请求，获取流程引擎返回结果
			postJSON(engineServletUrlPost, postData, function (json, o) {
				if (json.errorCode == 0) {
					TransAndUser_PushItem(json.result, sTransType);
					if (typeof (callback) == "function") callback(json.result);
				} else {
					parent.showLoading(false);
					parent.showMsg(json.errorInfo, "失败", 5);
				}
			});
		}
		/**
		 * 发送窗口点击发送调用
		 * @param postData
		 */
		flowEngine.engineSubmitFlowFunAfter = function (postData, callback) {
				_engineSubmitFlowFunAfter(postData, callback);
		}

	/**
	 * 撤办操作-1
	 * @type {null}
	 */
	flowEngine.xmlCancelSubmitObj = null;
	flowEngine.engineCancelSubmit = function () {
		var querycancelsubmitrequestJson = {
			"requesttype": "querycancelsubmitrequest",
			"piinfo": {
				"piid": flowJson.piid,
				"userinfo": flowJson.userinfo,
				"username": flowJson.username,
				"companyid": flowJson.companyid
			}
		}
		var postData = {};
		postData.requesttype = "querycancelsubmitrequest";
		postData.requestmsg = jt.Obj2Str(querycancelsubmitrequestJson);
		postJSON(engineServletUrlCore, postData, function (json, o) {
			if (json.errorCode == 0) {
				flowEngine.xmlCancelSubmitObj = json.resultMsg;
				showFlowDialog('撤办选择', 'show_flow_cancelsubmit.jsp', 'flowcancelsubmit', 500, 400);
			}else{
				parent.jtAlert("撤办查询可撤办信息失败："+json.errorInfo);
			}
		});
	}
	/**
	 * 撤办-2
	 * @param arr 选择的操作的待办
	 * @param txarr 提醒方式
	 * @param cbtype 撤办的方式
	 */
	flowEngine.engineCancelSubmitRequest = function (arr, txarr) {
		var jsonObj = {
			"requesttype": "cancelstatesubmitrequest",
			"piinfo": {
				"piid": flowJson.piid,
				"username": flowJson.username,
				"userinfo": flowJson.userinfo,
				"companyid": flowJson.companyid,
				"msgchannel": txarr
			},
			"formerActivitys": []
		};
		/**
		 *判断全局默认的消息通道是否有值，有值的话添加
		 * */
		if(SYSCFG.Flow_DefaultMsgChannel && SYSCFG.Flow_DefaultMsgChannel!=""){
			jsonObj.piinfo.msgchannel = jsonObj.piinfo.msgchannel +","+SYSCFG.Flow_DefaultMsgChannel;
		}
		//首先对数据进行判断，验证是否存在多个环节信息，采用对象数组形式处理
		var formeractivityArray = {};
		for (var i = 0, j = arr.length; i < j; i++) {
			var temp = arr[i];
			var tempS = arr[i].split("@");
			if (formeractivityArray[tempS[0] + "@" + tempS[1] + "@" + tempS[2] + "@" + tempS[3] + "@" + tempS[4]]) {
				formeractivityArray[tempS[0] + "@" + tempS[1] + "@" + tempS[2] + "@" + tempS[3] + "@" + tempS[4]].push(temp);
			} else {
				formeractivityArray[tempS[0] + "@" + tempS[1] + "@" + tempS[2] + "@" + tempS[3] + "@" + tempS[4]] = new Array();
				formeractivityArray[tempS[0] + "@" + tempS[1] + "@" + tempS[2] + "@" + tempS[3] + "@" + tempS[4]].push(temp);
			}
		}
		for (var a in formeractivityArray) {
			var fact = {};
			fact.aiid =  a.split("@")[0];
			fact.statename =  a.split("@")[1];
			fact.sid = a.split("@")[2];
			fact.userid = a.split("@")[3];
			fact.userogrid = a.split("@")[4];
			fact.activities = new Array();

			var formeractivity = formeractivityArray[a];
			var activityArray = {};
			for (var o = 0, n = formeractivity.length; o < n; o++) {
				var tempf = formeractivity[o];
				var tempfs = formeractivity[o].split("@");
				if (activityArray[tempfs[5] + "@" + tempfs[6] + "@" + tempfs[7]]) {
					activityArray[tempfs[5] + "@" + tempfs[6] + "@" + tempfs[7]].push(tempf);
				} else {
					activityArray[tempfs[5] + "@" + tempfs[6] + "@" + tempfs[7]] = new Array();
					activityArray[tempfs[5] + "@" + tempfs[6] + "@" + tempfs[7]].push(tempf);
				}
			}

			for (var m in activityArray) {
				var act = {};
				act.aiid = m.split("@")[0];
				act.statename = m.split("@")[1];
				act.sid = m.split("@")[2];
				act.workitems = new Array();
				var activity = activityArray[m];
				for (var j = 0, k = activity.length; j < k; j++) {
					var wis = activity[j].split("@");
					var workitem = {};
					workitem.wiid = wis[8];
					var us = {};
					us.value = wis[9];
					us.text = wis[10];
					workitem.user = us;
					act.workitems.push(workitem);
				}
				fact.activities.push(act);
			}
			jsonObj.formerActivitys.push(fact);
		}

		var postData = {};
		postData.requesttype = "cancelstatesubmitrequest";
		postData.requestmsg = jt.Obj2Str(jsonObj);
		postJSON(engineServletUrlCore, postData, function (json, o) {
			//根据交互结果弹出结束待办选择窗口
			//json.winType = true;
			json.winType = "win";
			_flowEngineOperateAfterInnerFun(json);
		});
	}

	/**
	 * 提供外界方法
	 * 根据选择路径查询发送人员
	 * @param _to
	 * @param _name
	 * @param callback
	 * @param _toNode 对于并发环节该值必须
	 */
	flowEngine.engineCandicationQuery = function (_to, _name, _isreject, callback,_toNode) {
		var item=TransAndUser_FindItem(_to,_isreject);
		//检查是否已经查询过用户，已有用户，不再查询
		if (item && ((item.data||[]).length>0)){
			if (typeof (callback) == "function") callback(item);
			return;
		}

		_toNode = jt.getDefVal(_toNode,"");
		var postData = {};
		postData.requestType = requestJson.REQ_ASSIGNMENT;
		postData.flowinfo = jt.Obj2Str(flowJson);
		postData.tinfo = "{'to':'" + _to + "','name':'" + _name + "','reject':'" + (jt.def(_isreject,false)? "true" : "false") + "','toNode':'"+_toNode+"'}";
		postData.context = _getContextJson();
		//发送请求，获取流程引擎返回结果
		postJSON(engineServletUrlPost, postData, function (json, o) {
			if (json.errorCode!=0){ top.jt.log(json.errorInfo||'加载路径人员失败','加载路径人员',5000); return; }
			item.data=json.data;
			TransAndUser_CheckUser(item);
			if (typeof (callback) == "function") callback(item);
		});
	}

	/**
	 * 提供外界方法
	 * 不通过发送窗口发送流程
	 */
	flowEngine.engineSendNoWind = function (_to, _name, _isreject, _userValue, _userText) {
		var xmlJson = {};
		xmlJson.tinfo_to = _to;
		xmlJson.tinfo_name = _name;
		xmlJson.rejectrequest = jt.def(_isreject,false)? "true" : "false";
		xmlJson.msgchannel = "SMS";

		var UserA = {};
		UserA[_to] = {};
		UserA[_to].state = {'id': _to};
		UserA[_to].user = new Array();
		if (typeof(_userValue) == "object") {
			for (var i = 0; i < _userValue.length; i++) {
				UserA[_to].user.push({'value': _userValue[i], 'text': _userText[i]});
			}
		} else {
			UserA[_to].user.push({'value': _userValue, 'text': _userText});
		}

		xmlJson.state = UserA;

		var postData = {};
		postData.xmlJson = xmlJson;
		postData.txfs = "SMS";//选择的消息发送方式
		postData.flowinfo = jt.Obj2Str(flowJson);
		if (typeof(_userValue) == "object") {
			postData.selUserId = _userValue.join(",");
		} else {
			postData.selUserId = _userValue;
		}

		_engineSubmitFlowFunAfter(postData);
	}
	flowEngine.agentWinArray = function () {
		return agentWinArray;
	}
	/**
	 * 管理员操作-特送
	 * 方法调用入口
	 */
	flowEngine.flowSpecialSubmit = function () {
		if (isEmpty(flowJson.piid)) {
			parent.showMsg("请先保存文档信息！", "提示", 5);
			return;
		}
		showFlowDialog('特送处理', 'flow_specialSubmit.jsp', 'WinEditSpecial', 640, 600);
	}
	/**
	 * 管理员操作-特送
	 * @param selectUser 选择人员
	 * @param tinfo_to 环节
	 * @param tx 提醒方式
	 * @param wDeadLine 期限
	 * 后台交互入口
	 */
	flowEngine.flowSpecialSubmitSend = function (selectUser, tinfo_to, tx, wDeadLine) {
		var specialReqeustJson = {
			"requesttype": "specialstatesubmitrequest",
			"piinfo": {
				"piid": flowJson.piid,
				"username": curUser.userName,
				"userinfo": curUser.userId + "/" + curUser.orgId,
				"companyid": curUser.companyId,
				"msgchannel": tx
			},
			"nextstates": [
				{
					"sid": tinfo_to,
					"wdeadline": wDeadLine*24,
					"grade": "",
					"userList": []
				}
			]
		}
		/**
		 *判断全局默认的消息通道是否有值，有值的话添加
		 * */
		if(SYSCFG.Flow_DefaultMsgChannel && SYSCFG.Flow_DefaultMsgChannel!=""){
			specialReqeustJson.piinfo.msgchannel = specialReqeustJson.piinfo.msgchannel +","+SYSCFG.Flow_DefaultMsgChannel;
		}

		for (var j = 0, k = selectUser.length; j < k; j++) {
			var user = selectUser[j];
			var us = {};
			us.value = user.split('@')[0];
			us.text = user.split('@')[1];
			specialReqeustJson.nextstates[0].userList.push(us);
		}
		var postData = {};
		postData.requesttype = "specialstatesubmitrequest";
		postData.requestmsg = jt.Obj2Str(specialReqeustJson);
		postJSON(engineServletUrlCore, postData, function (json, o) {
			if (typeof(_flowEngineOperateAfterInnerFun) == 'function') {
				if (json.errorCode == "0") {
					top.showMsg("操作成功", "提示", 5);
				}
				json.winType = "win";
				_flowEngineOperateAfterInnerFun(json)
			};
		});
	}

	/**
	 * 展现 流程跟踪图
	 */
	flowEngine.showFlowGraphicXml = function () {
			if (flowJson.piid && flowJson.aiid) {
					showFlowDialog('流程跟踪图', 'show_flow_graphic.jsp', 'flowGraphicXml', null, null, true);
			}

	}
	/**
	 * 填写意见
	 * @param sCustomPage 自定义页面
	 */
	flowEngine.writeOpinon = function (sCustomPage) {
		if (isEmpty(flowJson.piid)) {
			parent.showMsg("请先保存文档信息！", "提示", 5);
			return;
		}
		if (isMobileHTML){
			sCustomPage = jt.def(sCustomPage,'transition_user_select.jsp');
			showFlowDialog('意见填写', 'transition_user_select.jsp', 'WinEdit3');
		}else{
			sCustomPage = jt.def(sCustomPage,'opinion_writeOpinion.jsp');
			showFlowDialog('意见填写', sCustomPage, 'WinEdit2', 650, 455);
		}
	}

	/**
	 * 填写拟办意见
	 */
	flowEngine.writeDraftOpinion = function () {
		if (isEmpty(flowJson.piid)) {
			parent.showMsg("请先保存文档信息！", "提示", 5);
			return;
		}
		showFlowDialog('意见填写', 'opinion_writeDraftOpinion.jsp', 'WinEdit2', 740, 550);
	}
	/**
	 * 退回操作
	 */
	flowEngine.flowReturnBack = function () {
		flowEngine.engineSubmitFlowFun("yes");
	}
	/**
	 * 按钮功能-催办
	 */
	flowEngine.flowUrgency = function () {
		//第一步查询可以催办的环节和人员信息  调用结束处理请求
		flowEngine.engineCloseWorkitem('urgency');
	}
	/**
	 * 结束处理 - 查询请求
	 */
	flowEngine.queryCloseWorkitemResponseJson = null;
	flowEngine.engineCloseWorkitem = function (type) {
		var queryCloseWorkitemRequestJson = {
			"requesttype": "querycloseworkitemrequest",
			"piinfo": {
				"piid": flowJson.piid,
				"userinfo":curUser.userId+"/"+curUser.orgId,
				"username":curUser.userName,
				"companyid":curUser.companyId
			}
		}

		var postData = {};
		postData.requesttype = "querycloseworkitemrequest";
		postData.requestmsg  = jt.Obj2Str(queryCloseWorkitemRequestJson);

		postJSON(engineServletUrlCore, postData, function (json, o) {
			//根据交互结果弹出结束待办选择窗口
			if (json.errorCode == 0) {
				flowEngine.queryCloseWorkitemResponseJson = jt.Str2Json(json.resultMsg);
				if (!isEmpty(type) && type == 'urgency') {
					//类型为催办 则查询催办人员信息 跳转到催办集中办理界面
					showFlowDialog('催办人员选择', 'show_flow_urgency.jsp', 'flowurgencty', 600, 400);
				} else {
					showFlowDialog('结束待办选择', 'show_flow_workitem.jsp', 'flowworkitem', 600, 400);
				}
			} else {
				parent.showMsg(json.errorInfo);
				return;
			}
		});
	}
	/**
	 * 催办实际发送方法
	 * @param selUserArray 选择的催办人员信息
	 * @param selTxStr 选择的催办提醒方式
	 * @param selMsg 催办提示内容
	 */
	flowEngine.engineSendUrgencyRequest = function (selUserArray, selTxStr, selMsg) {
		var urgeJson = {
			"requesttype": "urgerequest",
			"piinfo": {
				"piid": flowJson.piid,
				"username":flowJson.username?flowJson.username:curUser.userName,
				"userinfo":flowJson.userinfo?flowJson.userinfo:(curUser.userId+"/"+curUser.orgId),
				"companyid":flowJson.companyid?flowJson.companyid:curUser.companyId,
				"msgchannel":selTxStr

			},
			"message":selMsg,
			"userList": []
		}
		/**
		 *判断全局默认的消息通道是否有值，有值的话添加
		 * */
		if(SYSCFG.Flow_DefaultMsgChannel && SYSCFG.Flow_DefaultMsgChannel!=""){
			urgeJson.piinfo.msgchannel = urgeJson.piinfo.msgchannel +","+SYSCFG.Flow_DefaultMsgChannel;
		}
		//先遍历选择的催办人员，根据环节进行分组
		var stateArray = {};
		for (var i = 0, j = selUserArray.length; i < j; i++) {
			var temp = selUserArray[i];
			var tempS = selUserArray[i].split("@");
			if (stateArray[tempS[0] + "@" + tempS[1] + "@" + tempS[2]]) {
				stateArray[tempS[0] + "@" + tempS[1] + "@" + tempS[2]].push(temp);
			} else {
				stateArray[tempS[0] + "@" + tempS[1] + "@" + tempS[2]] = new Array();
				stateArray[tempS[0] + "@" + tempS[1] + "@" + tempS[2]].push(temp);
			}
		}
		//根据分组数据，拼接发送的人员列表
		for (var attr in stateArray) {
			var attrArray = attr.split("@");
			var stateJson = {};
			stateJson.sid = attrArray[1];
			stateJson.statename = attrArray[2];
			stateJson.aiid = attrArray[0];
			stateJson.userList = new Array();
			var userArray = stateArray[attr];
			for (var i = 0, j = userArray.length; i < j; i++) {
				var user = userArray[i].split("@");
				var userJson = {};
				userJson.value = user[4];
				userJson.text = user[5].replace(/[\s]{1,}/, " ").split(" ")[0];
				stateJson.userList.push(userJson);
			}
			urgeJson.userList.push(stateJson);
		}

		var postData = {};
		postData.requesttype = "urgerequest";
		postData.requestmsg = jt.Obj2Str(urgeJson);
		postJSON(engineServletUrlCore, postData, function (json, o) {
			if (json.errorCode == 0) {
				parent.showMsg("催办成功！", "信息！", 5);
			} else {
				parent.showMsg(json.errorInfo, "错误！", 5);
			}
			parent.closeDialog('flowurgencty');
		});
	}
	/**
	 * 与流程引擎交互发送接触流程待办处理的请求
	 * @param arr
	 */
	flowEngine.engineCloseWorkitemRequest = function (arr, txarr) {
		var closeWorkitemRequestJson = {
			"requesttype": "closeworkitemrequest",
			"piinfo": {
				"piid": flowJson.piid,
				"userinfo":curUser.userId+"/"+curUser.orgId,
				"username":curUser.userName,
				"companyid":curUser.companyId,
				"msgchannel":txarr
			},
			"activitys": [
			]
		};
		/**
		 *判断全局默认的消息通道是否有值，有值的话添加
		 * */
		if(SYSCFG.Flow_DefaultMsgChannel && SYSCFG.Flow_DefaultMsgChannel!=""){
			closeWorkitemRequestJson.piinfo.msgchannel = closeWorkitemRequestJson.piinfo.msgchannel +","+SYSCFG.Flow_DefaultMsgChannel;
		}
		//首先对数据进行判断，验证是否存在多个环节信息，采用对象数组形式处理
		var activityArray = {};
		for (var i = 0, j = arr.length; i < j; i++) {
			var temp = arr[i];
			var tempS = arr[i].split("@");
			if (activityArray[tempS[0] + "@" + tempS[1] + "@" + tempS[2]]) {
				activityArray[tempS[0] + "@" + tempS[1] + "@" + tempS[2]].push(temp);
			} else {
				activityArray[tempS[0] + "@" + tempS[1] + "@" + tempS[2]] = new Array();
				activityArray[tempS[0] + "@" + tempS[1] + "@" + tempS[2]].push(temp);
			}
		}
		for (var m in activityArray) {
			var act = {};
			act.aiid =  m.split("@")[0];
			act.statename =  m.split("@")[1];
			act.sid = m.split("@")[2];
			act.workitems = new Array();
			var activity = activityArray[m];
			for (var j = 0, k = activity.length; j < k; j++) {
				var wis = activity[j].split("@");
				var workitem = {};
				workitem.wiid =  wis[3];
				act.workitems.push(workitem);
			}
			closeWorkitemRequestJson.activitys.push(act);
		}

		var postData = {};
		//取消办毕
		postData.requesttype = "closeworkitemrequest";
		postData.requestmsg = jt.Obj2Str(closeWorkitemRequestJson);
		postJSON(engineServletUrlCore, postData, function (json, o) {
			//根据交互结果弹出结束待办选择窗口
			if (typeof(_flowEngineOperateAfterInnerFun) == 'function') {
				_flowEngineOperateAfterInnerFun(json)
			}
		});
	}

	/**
	 * 流程引擎流程办毕操作
	 */
	flowEngine.engineEndSubmit = function () {
		function funDo(){
			parent.showLoading('正在处理');
			flowEngine.engineEndSubmitdo();
		}
		if (SYSCFG.Flow_ConfirmEndSubmit){ //是否弹出办毕确认框
			parent.jtConfirm(SYSCFG.Flow_ConfirmEndSubmit_Caption, function (bYes) {
				if (bYes) funDo();
			});
		}else{
			funDo();
		}
	}

    /**
     * 流程引擎流程办毕操作(已阅功能调用)
     */
    flowEngine.alreadyReadSubmit = function () {
        function funDo(){
        	//保存默认意见：已阅。
            var postData = {};
            postData.opinion = "已阅。";//意见内容
            postData.haveOpinion = flowEngine.haveOpinion;//是否有历史意见
            postData.flowinfo = jt.Obj2Str(flowJson);//流程实例对象
            postData.opinionId = flowEngine.opinionId;//历史意见ID
            postData.opinionType = "overwrite";//新意见的维护方式
            postData.moduleId = parent.moduleId;
            postData.bizId = parent.bizId;
            postData.docId = flowJson.docid;
            postData.opinionTime = '';//意见时间
            if (!postData.docId) postData.docId = parent.FID;
            top.showLoading('正在保存...');
            var sURL = contextPath + "/engineQuery/writeOpinion.action";

            postJSON(sURL, postData, function (json, o) {
                top.showLoading(false);
                if (json.errorCode == 0) {
                    parent.showLoading('正在处理');
                    flowEngine.engineEndSubmitdo();
                    // if (typeof(callback) == 'function') callback();
                } else {
                    top.showMsg(json.errorInfo, "意见保存失败", 1000);
                }
            });
        }
        if (SYSCFG.Flow_ConfirmEndSubmit){ //是否弹出已阅确认框
            parent.jtConfirm(SYSCFG.Flow_ConfirmEndSubmit_Caption_alreadyRead, function (bYes) {
                if (bYes) funDo();
            });
        }else{
            funDo();
        }
    }

	/**
	 * 流程引擎流程办毕
	 */
	flowEngine.engineEndSubmitdo = function () {
		var statesubmitrequestJson = {
			"requesttype": "statesubmitrequest",
			"piinfo": {
				"ptlabel":flowJson.ptlabel,
				"ptversion":flowJson.ptversion ,
				"stateid":flowJson.stateid,
				"aiid":flowJson.aiid,
				"userinfo":flowJson.userinfo,
				"piid":flowJson.piid ,
				"wiid":flowJson.wiid,
				"formersid":flowJson.formersid,
				"username":flowJson.username ,
				"companyid":flowJson.companyid
			},
			"tinfo":{
				"to":"step0",
				"name":"流程结束"
			},
			"nextstates": [
				{
					"sid":"step0"
				}
			]
		}
		var postData = {};
		postData.requesttype = "statesubmitrequest";//请求类型
		postData.requestmsg  = jt.Obj2Str(statesubmitrequestJson);//流程流转核心对象
		top.showLoading('正在发送...');
		postJSON(engineServletUrlCore, postData, function (json, o) {
			top.showLoading(false);
			if (json.errorCode != 0) {
				parent.showMsg(json.errorInfo);
				return false;
			}
			if (typeof(_flowEngineOperateAfterInnerFun) == 'function') {
				json.winType = "win";
				_flowEngineOperateAfterInnerFun(json)
			};
		});
	}

	/**
	 * 取消办毕操作
	 */
	flowEngine.engineCancelEndSubmit = function () {
		parent.jt.Msg.confirm("是否执行取消完毕操作？", function (bYes) {
			if (bYes == true) {
				flowEngine.engineCancelEndSubmitdo();
			}
		})
	}
	/**
	 * 取消办毕操作
	 */
	flowEngine.engineCancelEndSubmitdo = function () {
		var cancelendsubmitJson = {
			"requesttype": "cancelendsubmitrequest",
			"piinfo": {
				"piid": flowJson.piid,
				"username":flowJson.username,
				"userinfo":flowJson.userinfo,
				"companyid":flowJson.companyid
			}
		}
		var postData = {};
		postData.requesttype = "cancelendsubmitrequest";
		postData.requestmsg = jt.Obj2Str(cancelendsubmitJson);
		//发送请求，获取流程引擎返回结果
		postJSON(engineServletUrlCore, postData, function (json, o) {
			if (typeof(_flowEngineOperateAfterInnerFun) == 'function') {
				json.winType = "win";
				_flowEngineOperateAfterInnerFun(json)
			};
		});
	}

	/**
	 * 查询可以取消办结的环节和人员信息
	 */
	flowEngine.cancelStateAndUser = null;
	flowEngine.engineCancelcloseWorkitem = function () {
		var queryreexecutecandidatesrequestJson = {
			"piinfo":{
				"userinfo":curUser.userId+"/"+curUser.orgId,
				"username":curUser.userName,
				"companyid":curUser.companyId,
				"piid":flowJson.piid
			}
		}
		var postData = {};
		postData.requesttype = "queryreexecutecandidatesrequest";
		postData.requestmsg = jt.Obj2Str(queryreexecutecandidatesrequestJson);
		postJSON(engineServletUrlCore, postData, function (json, o) {
			if (json.errorCode == 0) {
				var rs = json.resultMsg;
				var rsObj = jt.Str2Json(rs);
				//获取到返回的环节与人员信息后，下面我们要弹出界面进行操作
				flowEngine.cancelStateAndUser = rsObj;
				showFlowDialog('取消办结操作', 'show_flow_cancelworkitem.jsp', 'flowworkitemcancel', 540, 400);
			}
		});
	}

	/**
	 * 取消办结
	 * @param nextstate
	 * @param txfs
	 * @param callback
	 */
	flowEngine.cancelWorkItem = function (nextstate, txfs) {
		var cancelendprocessJson = {
			"requesttype": "cancelendprocessinstancerequest",
			"piinfo": {
				"piid": flowJson.piid,
				"username":curUser.userName,
				"userinfo":curUser.userId+"/"+curUser.orgId,
				"companyid":curUser.companyId,
				"msgchannel":txfs
			},
			"nextstates": nextstate
		}
		/**
		 *判断全局默认的消息通道是否有值，有值的话添加
		 * */
		if(SYSCFG.Flow_DefaultMsgChannel && SYSCFG.Flow_DefaultMsgChannel!=""){
			cancelendprocessJson.piinfo.msgchannel = cancelendprocessJson.piinfo.msgchannel +","+SYSCFG.Flow_DefaultMsgChannel;
		}
		var postData = {};
		postData.requesttype = "cancelendprocessinstancerequest";
		postData.requestmsg = jt.Obj2Str(cancelendprocessJson);
		postJSON(engineServletUrlCore, postData, function (json, o) {
			if (typeof(_flowEngineOperateAfterInnerFun) == 'function') {
				json.winType = "win";
				_flowEngineOperateAfterInnerFun(json)
			}
		});
	}

	/**
	 * 意见管理
	 * @param sCustomPage 自定义页面
	 */
	flowEngine.flowOpinionManager = function (sCustomPage) {
		if (isEmpty(flowJson.piid)) {
			parent.showMsg("请先保存文档信息！", "提示", 5);
			return;
		}
		sCustomPage = jt.def(sCustomPage,'opinion_managerOpinion.jsp');
		showFlowDialog('意见管理', sCustomPage, 'WinEditMangerOpinion', 768, 600);
	}

	/**
	 * 流程切换
	 * @param templatejson
	 * @param fun
	 */
	flowEngine.flowSwitch = function (templatejson, fun, draftUserJson) {
		var postData = {};
		postData.flowinfo = jt.Obj2Str(flowJson);
		postData.templateinfo = jt.Obj2Str(templatejson);
		postData.draftuserinfo = jt.Obj2Str(draftUserJson);
		postData.requestType = requestJson.REQ_SWITCHTEMPLATE;

		postJSON(engineServletUrlPost, postData, function (json, o) {
			//根据交互结果弹出结束待办选择窗口
			if (json.errorCode == 0) {
				if (typeof (fun) == "function") {
					fun(json.piid, json);
				}
			}
			//切换流程放到业务自己回调，20170803
			//if (typeof(_flowEngineOperateAfterInnerFun) == 'function') {
			//	_flowEngineOperateAfterInnerFun(json)
			//}
		});
	}
	/**
	 * 流程引擎提供的手动知会功能
	 * --调用该方法弹出知会窗口
	 * @param sCustomPage 自定义页面
	 */
	flowEngine.handNotify = function(sCustomPage){
		if (isEmpty(flowJson.docid)) {
			parent.showMsg("请先保存文档信息！", "提示", 5);
			return;
		}
		sCustomPage = jt.def(sCustomPage,'notify_handNotify.jsp');
		showFlowDialog('手动知会', sCustomPage, 'WinEditHandNotify', 700, 450);
	}

	/**
	 * 生成知会记录
	 * @param msg 知会消息
	 * @param userId 知会人员ID 多个逗号分隔
	 * @param userName 知会人员名称
	 * @param callback 回调函数
	 * @param txfs 提醒方式 SMS 等
	 */
	flowEngine.handNotifyAfter = function (msg, userId, userName, callback,txfs) {
		var docJson = parent.getDocInfoJson();
		var handlerNotifyJson = {
			"requesttype": "handnotifyrequest",
			"piinfo":{
				"piid":flowJson.piid,
				"userinfo":curUser.userId+"/"+curUser.orgId,
				"username":curUser.userName,
				"companyid":curUser.companyId,
				"msgchannel":txfs
			},
			"document": {
				"docid": docJson.docid,
				"moduleid": docJson.moduleid,
				"modulename": docJson.modulename,
				"businessid": docJson.businessid,
				"businessname": docJson.businessname,
				"doctitle": docJson.doctitle
			},
			"msg": msg,
			"userid": userId,
			"username": userName
		};
		/**
		 *判断全局默认的消息通道是否有值，有值的话添加
		 * */
		if(SYSCFG.Flow_DefaultMsgChannel && SYSCFG.Flow_DefaultMsgChannel!=""){
			handlerNotifyJson.piinfo.msgchannel = handlerNotifyJson.piinfo.msgchannel +","+SYSCFG.Flow_DefaultMsgChannel;
		}
		flowEngine.handNotifyAfter_Post( handlerNotifyJson, callback );
	}
	flowEngine.handNotifyAfter_Post = function ( handlerNotifyJson, callback) {
		var post = {};
		post.requesttype = "handnotifyrequest";
		post.requestmsg = jt.Obj2Str(handlerNotifyJson);

		postJSON(engineServletUrlCore, post, function (json) {
			if (typeof(callback) == "function") {
				callback(json);
			}else{
				if (json && json.errorCode == "0") {
					parent.showMsg("知会成功");
				}else{
					parent.showMsg(json.errorInfo);
				}
			}
		})
	}
	/**
	 * 流程引擎转办功能按钮触发
	 * 调用该方法，弹出转办人员选择窗口
	 */
	flowEngine.sendToOtherHandler = function () {
		var isreject = false;
		/**
		 * 文档保存并与流程关联后 发送方法生效
		 */
		if (isEmpty(flowJson.piid)) {
			parent.showMsg("请先保存文档信息！", "提示", 10);
			return;
		}
		//查询转办人员
		flowEngine.opeSendToOtherHandler(true, function (json) {
			//TransAndUser = json;
			var height = 610;
			if (stateJson.stateNotion.availabel == '0') {
				height = height - 200;
			}
			if (stateJson.stateDoc.notes == '0') {
				height = height - 20;
			}
			showFlowDialog('路径人员发送', 'transition_user_select.jsp?isreject=' + isreject, 'WinEdit3', 540, height, false);
		});
	}


	/**
	 * 流程引擎转办界面选择转办人员后，调用该方法，与后台交互，实现转办操作
	 * @param useFlowHandler 是否使用流程查询用户
	 * @param callback 回调函数
	 */
	flowEngine.opeSendToOtherHandler = function (useFlowHandler, callback) {
		//转办人查询请求
		var contextStr = _getContextJson();
		var contextJson = jt.Str2Json(contextStr);
		contextJson.useFlowHandler = useFlowHandler;
		var post = {
			"type": "transferassignmentrequest",
			"piinfo": {
				piid: flowJson.piid,
				aiid: flowJson.aiid,
				wiid: flowJson.wiid,
				userinfo: flowJson.userinfo
			},
			"context": contextJson
		};
		var sURL = contextPath + "/flowEngineServlet.action?m=coreProcess";
		postJSON(sURL, {requestMsg: jt.Obj2Str(post)}, function (json, e) {
			if (json && json.errorCode == "0") {
				TransAndUser_PushItem(json.result,'sendOther');
				if (typeof (callback) == "function") {
					callback(json.result);
				}
			} else {
				jtAlert("转办操作失败：" + json.errorInfo);
			}
		})
	}

	/**
	 * 转发为单位组织内的用户
	 */
	flowEngine.sendToWholeInstHandler = function () {
		var isreject = false;
		/**
		 * 文档保存并与流程关联后 发送方法生效
		 */
		if (isEmpty(flowJson.piid)) {
			parent.showMsg("请先保存文档信息！", "提示", 10);
			return;
		}
		//查询转办人员
		flowEngine.opeSendToOtherHandler(false, function (json) {
			//TransAndUser = json;
			var height = 610;
			if (stateJson.stateNotion.availabel == '0') {
				height = height - 200;
			}
			if (stateJson.stateDoc.notes == '0') {
				height = height - 20;
			}
			var selectType = 2;
			try {
				selectType = parent.document.getElementById("flowUserSelectType");
				if (selectType == null) {
					selectType = 2;
				}
			} catch (e) {
				selectType = 2;
			}
			showFlowDialog('路径人员发送', 'transition_user_select.jsp?isreject=' + isreject + "&useWholeInstFlag=1&flowUserSelectType=" + selectType, 'WinEdit3', 540, height, false);
		});
	}
	/**
	 * 流程引擎控制的按钮展现
	 * @param FID 文档ID
	 * @param userId  用户ID
	 * @param roleListStr  用户角色列表字符串
	 * @param groupListStr 用户群组列表字符串
	 */
	flowEngine.flowEngineInitButton = function (FID, userId, roleListStr, groupListStr, callback) {
		var result = {};
		result.errorCode = -1;
		if (isEmpty(FID)) {
			callback(result);
			return;
		}
		;//文档ID为空 直接返回为否
		if (isEmpty(userId)) {
			callback(result);
			return;
		}
		;//用户ID为空 直接返回
		if (isEmpty(roleListStr) && isEmpty(groupListStr)) {
			callback(result);
			return;
		}
		;//角色和群组信息都为空 直接返回
		var post = {};
		post.requestType = "flowEngineInitButtonRequest";
		post.FID = FID;
		post.userId = userId;
		post.roleListStr = roleListStr;
		post.groupListStr = groupListStr;
		postJSON(engineServletUrlOpe, post, function (json) {
			callback(json);
			return;
		});
	}

	/**
	 * 签收操作
	 */
	flowEngine.flowSignTodo = function (callback) {
		var post = {};
		post.FID = flowJson.docid;
		post.bizId = parent.bizId;
		post.moduleId = parent.moduleId;
		post.userId = curUser.userId;
		post.orgId = curUser.orgId;
		post.roleListStr = curUser.roleListStr;
		post.groupListStr = curUser.groupListStr;
		post.requestType = "flowEngineSignTodoRequest";
		postJSON(engineServletUrlOpe, post, function (json) {
			callback(json);
		})
	}

	/**
	 * 强制办结、强制办结全部
	 * @param flag
	 */
	flowEngine.engineForceEnd = function (flag) {
		var prompt = "执行此操作，将强制办结此文件所有影响您发送的未办理的用户！是否继续？";
		if (flag == "0") {
			prompt = "执行此操作，将强制办结此文件除自己之外所有其他未办理的用户！是否继续？";
		}
		parent.jt.Msg.confirm(prompt, function (bYes) {
			if (bYes == true) {
				var postData = {};
				if (flag) {
					postData.createdbyhandler = true;
				} else {
					postData.createdbyhandler = false;
				}

				flowJson.msgchannel = "SMS";
				postData.flowinfo = jt.Obj2Str(flowJson);
				postData.docinfo = jt.Obj2Str(parent.getDocInfoJson());
				postData.requestType = requestJson.REQ_FORCEEND;
				postJSON(engineServletUrlPost, postData, function (json, o) {
					if (typeof(_flowEngineOperateAfterInnerFun) == 'function') {
						json.winType = true;
						_flowEngineOperateAfterInnerFun(json)
					}
				});
			}
		})
	}
	flowEngine.engineSubmitForAgentWin = function (agentJson) {
		_engineSubmitFlowSendFun(agentJson);
	}

	flowEngine.isFilterOpinion = function () {
		var isFilter = true;
		var stateNotion = stateJson.stateNotion;
		if (stateNotion.availabel != '0') {
			return "0";
		} else {
			return "1";
		}
	}

	//查询我的意见
	var selfOpinonQuery =  "/engine/FlowAction.action?method=getOpinion";
	var selfOpinionAdd =  "/engine/FlowAction.action?method=addOpinion";
	//从我的意见中删除
	var selfOpinionDel =  "/engine/FlowAction.action?method=deleteOpinion";
	//加载流程引擎中的公共意见
	//var publicOpinionUrl = contextPath + "/bam/bizSystemConfig/getConfigValue.action?rangeId=root&appId=engine&key=cfg_engine_publicopinion";
	//加载流程引擎中的组合意见
	//var composeOpinionUrl = contextPath + "/bam/bizSystemConfig/getConfigValue.action?rangeId=root&appId=engine&key=cfg_engine_componseopinon";
	//加载环节已经存在的意见
	var havedOpinionUrl =  "/engineQuery/getHaveOpinion.action";
	/**
	 * 意见区域对象
	 */
	flowEngine.opinionAreaObj = null;
	/**
	 * 是否存在意见
	 * @type {string}
	 */
	flowEngine.haveOpinion = "";
	/**
	 * 存在意见id
	 * @type {string}
	 */
	flowEngine.opinionId = "";
	/**
	 * 流程引擎意见对象
	 * @type {{}}
	 */
	flowEngine.flowOpinion = {
		selfOptionList:null,
		//公共意见
		getPublicOpinion: function () {
			return jt.Str2JsonEx(engineConfigJson.cfg_engine_publicopinion);
		},
		//组合意见
		getComposeOpinion: function (callback) {
			return jt.Str2JsonEx(engineConfigJson.cfg_engine_componseopinon);
		},
		//加载用户意见
		loadSelfOpinion: function (callback,bReload) {
			bReload = jt.def(bReload,false);
			if (flowEngine.flowOpinion.selfOptionList==null) bReload=true;
			if (bReload){
				postJSON(selfOpinonQuery, {"userId": curUser.userId}, function (json, o) {
					if (json && json.errorCode == "0") {
						flowEngine.flowOpinion.selfOptionList = json.data;
						if (typeof(callback) == "function") callback(flowEngine.flowOpinion.selfOptionList);
					}
				});
			}else{
				if (typeof(callback) == "function") callback(flowEngine.flowOpinion.selfOptionList);
			}
		},
		/**
		 * 将意见加入到我的意见中
		 */
		addToSelfOpinion: function (callback) {
			var sValue = htmlEncode_Reg(flowEngine.opinionAreaObj.value);
			if (checkOpinion(flowEngine.opinionAreaObj)) {
				postJSON(selfOpinionAdd, {
					'userId': curUser.userId,
					'value': sValue
				}, function (json, e) {
					if (json && json.errorCode == "0") {
						if (typeof(callback) == "function") callback(json);
					}
				});
			}
		},
		/**
		 * 将意见从我的意见中删除
		 * @param userId
		 * @param id
		 * @param callback
		 */
		delFromSelfOpinion: function (id, callback) {
			postJSON(selfOpinionDel, {'userId': curUser.userId, 'id': id}, function (json, e) {
				if (json && json.errorCode == "0") {
					if (typeof(callback) == "function") callback(json);
				}
			});
		},
		/**
		 * 添加选择的意见
		 * @param value
		 */
		addOpinion: function (value) {
				addTextAtCursorPos(value);
		},
		/**
		 * 清空意见区域内容
		 */
		removeCurOpinion: function () {
				flowEngine.opinionAreaObj.value = "";
				flowEngine.opinionAreaObj.focus();
		},
		/**
		 * 加载已经存在意见
		 * @param callback
		 */
		getHavedOpinion: function (callback) {
			var isQueryHavedOpinion = false;
			if (flowEngine.isFilterOpinion() == "1") {
				if (flowJson.statename.indexOf("退回") != -1 || flowJson.statename.indexOf("收回重启") != -1) {
					isQueryHavedOpinion = true;
				}
			} else {
				isQueryHavedOpinion = true;
			}
			if (isQueryHavedOpinion) {
				postJSON(havedOpinionUrl, {"piid": flowJson.piid, "stateid": flowJson.stateid}, function (json, o) {
					if (json && json.errorCode == "0") {
						flowEngine.haveOpinion = "have";
						flowEngine.opinionId = json.data_id;
						if (typeof (callback) == "function") {
							callback(json.data_desc);
						}
					} else {
						if (typeof (callback) == "function") {
							callback();
						}
					}
				});
			} else {
				callback("");
			}

		},
		saveOpinion: function (opinionType, callback,opinionTime) {
			if (!checkOpinion(flowEngine.opinionAreaObj)) return; //检查意见
			var postData = {};
			postData.opinion = flowEngine.opinionAreaObj.value.trim();//意见内容
			postData.haveOpinion = flowEngine.haveOpinion;//是否有历史意见
			postData.flowinfo = jt.Obj2Str(flowJson);//流程实例对象
			postData.opinionId = flowEngine.opinionId;//历史意见ID
			postData.opinionType = opinionType;//新意见的维护方式
			postData.moduleId = parent.moduleId;
			postData.bizId = parent.bizId;
			postData.docId = flowJson.docid;
			postData.opinionTime = opinionTime;//意见时间
			if (!postData.docId) postData.docId = parent.FID;
			top.showLoading('正在保存...');
			var sURL = contextPath + "/engineQuery/writeOpinion.action";

			postJSON(sURL, postData, function (json, o) {
				top.showLoading(false);
				if (json.errorCode == 0) {
					if (typeof(callback) == 'function') callback();
				} else {
					top.showMsg(json.errorInfo, "保存失败", 1000);
				}
			});
		},
		checkOpinion: function () {
				return checkOpinion(flowEngine.opinionAreaObj);
		}
	}
	//检查环节默认候选人
	flowEngine.checkTransDefUser = function (root, oneRoot, callback) {
		//console.log(root)
		//从表单获取默认选择用户 (多用户逗号隔开) //Add by Witson 2017-07-10
		function getDefaultField(defFld, defFldType, jsonTrans) {
			//从 parent 的Input中取值
			//var obj=parent.document.getElementById(defFld);
			if (/^(全部)|(所有人)|(全选)$/.test(defFld)) return defFld;
			var sVal = jt.def(parent.getFieldAttr(defFld));
			if (sVal != '') return sVal;
			//通过 JS 计算
			if (defFld.substr(0, 1) == '=') return eval(defFld.substr(1));
			//通过父及页面的函数处理
			if (typeof(parent.getTransDefUser) == 'function') return parent.getTransDefUser(defFld, defFldType, jsonTrans);
			return defFld;
		}

		function findAllUser(json) { //筛选所有用户
			jt.each(json.children||[], function (idx, item) {
				if (item.nodeType == 'org_user') return allUser.push(item);
				if ((item.children || []).length > 0) findAllUser(item);
			})
		}

		function funSelectUser(sUser) {
			//root.assignmentType!='1';//1:限选一人 2:多人 3:每部门一人
			//oneRoot 非并发迁移
			sUser = jt.def(sUser);
			var arrRet = [];
			if (/^(全部)|(所有人)|(全选)$/.test(sUser)) {
				arrRet = allUser;
			} else {
				//只有一人
				//if ( (sUser=='') && (allUser.length==1) && (root.assignmentType==1) && oneRoot ){
				if ((sUser == '') && (allUser.length == 1) && oneRoot) {
					sUser = allUser[0].id;
					arrRet.push(allUser[0]);
				} else if (sUser != '') {
					var arrUser = sUser.split(',');
					jt.each(arrUser, function (idx0, str) {
						str = jt.trim(str);
						for (var i = 0; i < allUser.length; i++) {
							if (jt.inArray(str, allUser[i].value.split('/')) > -1) {
								arrRet.push(allUser[i]);
							}
						}
					});
				}
			}
			if (typeof(callback) == 'function') callback(arrRet, sUser);
		}

		var allUser = [];
		findAllUser(root);
		var stateid = root.id;
		var statename = root.name;
		//默认字段
		var defaultField = root.defaultfield;
		//默认类型
		var defaultFieldType = root.defaultfieldtype;
		var defUser = '';

		var arrDefField = defaultField.split(";");
		var arrDefFieldType = defaultFieldType.split(";");
		jt.each(arrDefField, function (idx) {
			try {
				defaultField = arrDefField[idx];
				defaultFieldType = arrDefFieldType[idx];
				//设置关联人员设置
				if (defaultFieldType == "50") {
					if (AssociateUserset == "")
						AssociateUserset = stateid + ":" + defaultFieldType;
					else
						AssociateUserset = AssociateUserset + ";" + stateid + ":" + defaultFieldType;
				}
				//按默认域值提取默认候选人
				if (defaultField != "" && defaultField != "null") {
					try {
						defUser = getDefaultField(defaultField, defaultFieldType, root, funSelectUser);
					} catch (e) { }
				}
			} catch (e) { }
		});


		//defaultfieldtype=22 起草人处室的主管部门领导 21 起草人部门的主管公司领导 32 提交人处室的主管部门领导 31 提交人部门的主管公司领导
		var selectOrgId = '';
		if (defaultFieldType == '21') {
			selectOrgId = parent.jFormData.C_CreateDeptId;
		} else if (defaultFieldType == '22') {
			var arr = parent.jFormData.C_CreateOrgIdWhole.split("/");
			if (arr.length > 1) selectOrgId = arr[2];
		} else if (defaultFieldType == '31') {
			selectOrgId = parent.curUser.deptId;
		} else if (defaultFieldType == '32') {
			var arr = parent.curUser.wholeOrgId.split("/");
			if (arr.length > 1) selectOrgId = arr[2];
		}
		if (selectOrgId != '') {
			//查询对应的领导
			//todo 查询该部门或者处室的主管领导
			//todo 处理完成后回调函数
			//defUser='xxxx,yyy';
			funSelectUser(defUser);
			//initTreeNode(root);
		} else {
			funSelectUser(defUser);
			//initTreeNode(root);
		}
	}
})();

function _initAfter(docId, ptlabel, ptver, companyId, EType, EId) {
	if (flowEngine.isEngine == true) {
		//如果返回待办多余一条
		var process = workitemJson;
		if (process.length > 1) {
			//top.showMsg("待办多余一条，后续处理");
			_setJSonParam(process[0]);	//mayi
			//todo 以后若是出现多个待办情况需要考虑
		} else if (process.length == 1) {
			_setJSonParam(process[0]);
		}

		flowJson.stateid = jt.getDefVal(flowJson.stateid, stateJson.sid);
		flowJson.statename = jt.getDefVal(flowJson.statename, stateJson.name);
		flowJson.ptname = jt.getDefVal(flowJson.ptname, initResultJson.ptname);
	}
	flowJson.docid = jt.getDefVal(flowJson.docid, docId);
	flowJson.ptlabel = jt.getDefVal(flowJson.ptlabel, ptlabel);
	flowJson.ptversion = jt.getDefVal(flowJson.ptversion, ptver);
	flowJson.companyid = jt.getDefVal(flowJson.companyid, companyId);

	if (typeof(parent.funAfterEngineFrameLoad) == 'function') {
		parent.funAfterEngineFrameLoad()
	};
	/**
	 子页面调用父页面中的规约方法
	 */
	//当显示附言的方法存在时，查询附言并返回
	if (typeof(parent.showEngineAppertain) == 'function') {
		_engineInitAppertainNew(parent.showEngineAppertain);
	}

	/**
	 * 当打开记录时 修改状态操作
	 */
	flowJson.viewed = 0;
	if (flowJson.viewed == 1 || flowJson.viewed == "1") {
		return;
	} else {
		if (flowJson.docid && flowJson.piid) {
			postJSON(engineServletUrlOpe, {
				requestType: "indexPageOpenRequest",
				docId: flowJson.docid,
				piid: flowJson.piid
			}, function (json, e) {
				if (json && json.errorCode == "0") {
				} else {
					top.showMsg("与流程交互更新状态失败");
					return;
				}
			});
		}
	}
}
function _setJSonParam(todoWorkitemObject) {
    flowJson.piid = todoWorkitemObject.PROCESS_INSTANCEID;//流程实例ID
    flowJson.aiid = todoWorkitemObject.ACTIVITY_INSTANCEID;//流程环节实例ID
    flowJson.wiid = todoWorkitemObject.ID;//流程待办实例ID
    flowJson.stateid = todoWorkitemObject.STATE_ID;//流程环节ID
    flowJson.formersid = todoWorkitemObject.FORMERSID;//待办的前一个环节ID
    flowJson.pstatus = todoWorkitemObject.PSTATUS;//流程实例的状态 2001 结束 2002 在办
    flowJson.userinfo = todoWorkitemObject.USERINFO;//由流程引擎计算的待办人员的userinfo信息
    flowJson.ptlabel = todoWorkitemObject.PTLABEL;
    flowJson.ptversion = todoWorkitemObject.PTVERSION;
    flowJson.companyid = todoWorkitemObject.PTCOMPANYID;
    flowJson.wstatus = todoWorkitemObject.STATUS;
    flowJson.ptname = todoWorkitemObject.PT_NAME;
    flowJson.statename = todoWorkitemObject.STATE_NAME;
    flowJson.todostate = todoWorkitemObject.TODOSTATE;
    flowJson.todouser = todoWorkitemObject.TODOUSER;
    flowJson.passuser = todoWorkitemObject.PASSUSER;
    flowJson.passstate = todoWorkitemObject.PASSSTATE;
    flowJson.viewed = todoWorkitemObject.VIEWED;
    flowJson.oriuserinfo = todoWorkitemObject.ORIUSERINFO;
    flowJson.oriusername = todoWorkitemObject.ORIG_HANDLER_NAME;
	flowJson.username = todoWorkitemObject.HANDLER_NAME?todoWorkitemObject.HANDLER_NAME:curUser.userName;
}
/**
 * 查询附言信息
 * @returns {String}
 */
function _engineInitAppertainNew(callback) {
	if (!(flowJson.piid && flowJson.aiid)) return '';
	var engineServletUrl = contextPath + "/engineQuery/queryAppertain.action"; //流程引擎访问的地址
	postJSON(engineServletUrl, flowJson, function (json, o) {
		if (json.errorCode != '0') return;
		var innerHtml = "";
		for (var i = 0, j = json.data.length; i < j; i++) {
			innerHtml += json.data[0].USERNAME + "：" + json.data[0].CONTENT;
		}
		if (innerHtml != '') {
			innerHtml = '附言：<span style="color:#111111">' + innerHtml + '</span>'
			callback(innerHtml);
		}
	});
	return '';
}
/**
 根据配置的应用接口参数，获取表单元素值
 */
function _getContextJson() {
	//应用接口中指定的参数名称列表 ;分隔
	var fields = stateJson.fields;
	if ((fields == null) || (fields == '')) return '{}';
	var arrFld = fields.split(";");
	var result = {};
	for (var i = 0, j = arrFld.length; i < j; i++) {
		var value = jt.getDefVal(parent.getFieldAttr(arrFld[i]), "");
		if (value != "") {
			if (arrFld[i].substring(0, 4) == "FLD_") {
				result[arrFld[i].substring(4)] = value;
			}
			result[arrFld[i]] = value;
		}
	}
	if (typeof(parent.engineGetContextJson) == 'function') result = parent.engineGetContextJson(result, fields, stateJson);
	return jt.Obj2Str(result);
}

/**
 * 当路径和人员唯一时 不需要用户选择直接发送
 * @param isreject
 */
function _sendSubmitNoWind(oTrans,isreject) {
    var xmlJson = {};
    xmlJson.tinfo_to = oTrans.transinfo.to;
    xmlJson.tinfo_name = oTrans.transinfo.name;
    xmlJson.rejectrequest = (isreject == "yes" ? "true" : "false");
    xmlJson.msgchannel = "SMS";
    var UserA = {};
    UserA[xmlJson.tinfo_to] = {};
    UserA[xmlJson.tinfo_to].state = {'id': oTrans.transinfo.to};
    UserA[xmlJson.tinfo_to].user = new Array();
    var TempUser = oTrans.singleUser;
    UserA[xmlJson.tinfo_to].user.push({'value': TempUser.value, 'text': TempUser.text});
    xmlJson.state = UserA;
    var selUserId = TempUser.value;
    var postData = {};
    postData.xmlJson = xmlJson;
    postData.txfs = "SMS";//选择的消息发送方式
    postData.flowinfo = jt.Obj2Str(flowJson);
    postData.selUserId = selUserId;
    _engineSubmitFlowFunAfter(postData);
}

/**
 * 发送调用该方法 查询发送人员的代理信息
 * @type {Array}
 */
var sendJson = null;
var agentJson = null;
function _engineSubmitFlowFunAfter(json, callback) {
    var sendFlag = true;
    if (typeof(parent.flow_Action_Before) == 'function') {
        sendFlag = parent.flow_Action_Before(json)
    }
    if (sendFlag != true) {
        top.showMsg("流程发送前业务端验证不通过，流程发送终止。", "发送失败", 1000);
        return;
    }
    //判断是否存在代理情况
    //添加代理功能
    var agentUrl = contextPath + "/engineOp.action?method=getAgentDataByUserIds";
    sendJson = json;
    var jPost = {ids: json.selUserId, module: parent.jFormData.C_ModuleId};

    function procResult(rs) {

        if (rs.errorCode != 0) {
            top.showMsg(rs.errorInfo, "获取代理信息异常", 1000);
        } else {
            agentJson = rs;
            //个人代理 选择发送代理人还是只是代理人
            var peopleAgent = rs.people;
            if (peopleAgent && peopleAgent.length > 0) {
                for (var i = 0, j = peopleAgent.length; i < j; i++) {
                    var agentMap = peopleAgent[i];
                    if (agentMap.agent.agentSendType == 2) {
                        agentWinArray.push(agentMap);
                    }
                }
            }
            if (agentWinArray.length > 0) {
                showFlowDialog('路径人员发送', 'show_flow_agentList.jsp', 'WinEditagent', 740, 400);
            } else {
                _engineSubmitFlowSendFun(null);
            }
        }
    }

    if (callback) { //当有callback时, 采用异步请求
        postJSON(agentUrl, jPost, function (json0, o) {
            procResult(json0);
            callback();
        });
    } else {
        procResult(postJSON(agentUrl, jPost, null, false));
    }

}

/**
 * 流程发送方法
 * sendJson 全局发送对象 JSP界面或者后台直接拼装传递，完成到发送信息 包含了候选人信息 意见知会等内容
 * gentJson 根据候选人查询的代理配置情况
 * @param json 选择到代理人信息
 * @private
 */
function _engineSubmitFlowSendFun(selAgentJson){
	var jPara = sendJson.xmlJson;
	var statesubmitrequestJson = {
		"requesttype": "statesubmitrequest",
		"piinfo": {
			"ptlabel":flowJson.ptlabel,
			"ptversion":flowJson.ptversion ,
			"stateid":flowJson.stateid,
			"aiid":flowJson.aiid,
			"userinfo":flowJson.userinfo,
			"piid":flowJson.piid ,
			"wiid":flowJson.wiid,
			"formersid":flowJson.formersid,
			"username":flowJson.username?flowJson.username:curUser.userName ,
			"msgchannel":jPara.msgchannel,
			"pdeadline":"",
			"maindept":"",
			"companyid":flowJson.companyid
		},
		"tinfo":{
			"to":jPara.tinfo_to,
			"name":jPara.tinfo_name,
			"statetype":"",
			"reject":jPara.rejectrequest
		},
		"nextstates": [

		],
		"msginfo":{
            "opinion":sendJson.opinion,
            "opinionAction":sendJson.opinionAction,
            "opinionid":sendJson.opinionId,
            "appertain":sendJson.appertain,
            "opinionAvailable":sendJson.opinionAvailable,	//新增意见是否必填 0 不填，1必填，2不限制-by-lfx
            "opinionImg":sendJson.opinionImg,	//流程意见图片base64
            "opinionType":sendJson.opinionType  //意见类型,1拟稿意见 2领导意见
		}
	}

	/**
	 *判断全局默认的消息通道是否有值，有值的话添加
	 * */
	if(SYSCFG.Flow_DefaultMsgChannel && SYSCFG.Flow_DefaultMsgChannel!=""){
		statesubmitrequestJson.piinfo.msgchannel = statesubmitrequestJson.piinfo.msgchannel +","+SYSCFG.Flow_DefaultMsgChannel;
	}

	/**
	 * 获取到待办的缓急程度
	 * 通过父界面的实现获取
	 */
	var gradeObj = null;
	if (typeof (parent.funFlowEngineGetGrade) == "function") {
		gradeObj = parent.funFlowEngineGetGrade();
	}

	if(null != gradeObj && gradeObj !=""){
		//流程实例的待办时限和缓急程度
		statesubmitrequestJson.piinfo.pdeadline = gradeObj.pDeadLine;
		statesubmitrequestJson.piinfo.pgradename = gradeObj.pGradeName;
	}


	//领导代理
	var majorAgent = agentJson.major;//[{'key':'','agent':''}]
	//个人代理
	var peopleAgent = agentJson.people;//[{'key':'','agent':''}]
	//个人代理情况
	var selPeopleAgent = selAgentJson;//{'key':'','key2':''}

	//兼容新的数据格式(EngineUserSelect返回的格式[数组])
	var arrState = [];
	if (jt.isArray(jPara.state)) {
		arrState = jPara.state;
	} else {
		for (var s in jPara.state) arrState.push(jPara.state[s]);
	}

	for (var i = 0; i < arrState.length; i++) {
		var obj = arrState[i];
		var oState = {};
		 oState.sid = obj.state.id ;
		if (null != gradeObj && gradeObj != "") {
			oState.grade = gradeObj.grade;
			oState.gradename = gradeObj.gradeName;
			oState.wdeadline = gradeObj.wDeadLine;
		} else {
			oState.grade = 0;
			oState.gradename = "";
			oState.wdeadline = "";
		}
		oState.userList = new Array();
		for (var i1 = 0, j1 = obj.user.length; i1 < j1; i1++) {
			var oU = {};
			oU.value = obj.user[i1].value;
			oU.text = obj.user[i1].text.split("/")[0];
			//添加领导代理
			for (var m = 0, n = majorAgent.length; m < n; m++) {
				var map = majorAgent[m];
				if (map.key == obj.user[i1].value) {
					oU.delegationinfo =  map.agent.agentUserId;
					oU.delegationtext = map.agent.agentUserName;
					oU.delegationtype = 3002;
				}
			}
			//添加个人代理
			for (var o = 0, p = peopleAgent.length; o < p; o++) {
				var map = peopleAgent[o];
				if (map.key == obj.user[i1].value) {
					//不是弹窗选择的
					if (selPeopleAgent == null || selPeopleAgent == undefined || selPeopleAgent == 'undefined' || !selPeopleAgent || selPeopleAgent[map.key] == null) {
						oU.delegationinfo =  map.agent.agentUserId;
						oU.delegationtext = map.agent.agentUserName;
						oU.delegationtype = 3001;
					} else {
						var selType = selPeopleAgent[map.key];
						if (selType == 'agent') {
							oU.delegationinfo =  map.agent.agentUserId;
							oU.delegationtext = map.agent.agentUserName;
							oU.delegationtype = 3001;
						}
					}
				}
			}
			oState.userList.push(oU);
		}
		statesubmitrequestJson.nextstates.push(oState);
	}

	var postData = {};
	postData.requesttype = "statesubmitrequest";//请求类型
	postData.requestmsg  = jt.Obj2Str(statesubmitrequestJson);//流程流转核心对象
	top.showLoading('正在发送...');
	postJSON(engineServletUrlCore, postData, function (json, o) {
		top.showLoading(false);
		if (json.errorCode == '0') {
			//debugger;
			if (flowEngine.todoBusinessType) {
				if (json.todo) {
					json.todo += ";" + flowEngine.todoBusinessType;
				} else {
					json.todo = flowEngine.todoBusinessType;
				}
			}
			json.winType = true;
			json.sendJson = sendJson;
			if (typeof(_flowEngineOperateAfterInnerFun) == 'function') {
				_flowEngineOperateAfterInnerFun(json)
			}
			;
		} else {
			top.showMsg(json.errorInfo, "流程发送失败", 1000);
		}
	});


}

/**********************************************************流程跟踪图展现字方法区域***************************************/
function showFlowEx(oXML) {
    arrNode.length = 0;
    arrLine.length = 0;
    oNodes = oXML.documentElement.childNodes;//获取所有节点
    for (var i = 0; i < oNodes.length; i++) {	//将节点加载到数组
        arrNode[i] = new FlowNode(oNodes[i]);
    }
    for (var i = 0; i < arrNode.length; i++) {	//将线加载到级组
        for (var j = 0; j < arrNode[i].lines.length; j++) {
            //hyl 2017-10-16 修改将退回排除操作注释 实现双箭头
            //if (arrNode[i].sid, arrNode[i].lines[j].getAttribute('reject') != 'true') {
                addFlowLine(arrNode[i].sid, arrNode[i].lines[j].getAttribute('to'));
            //}
        }
    }
    var strRect = '';
    for (var i = 0; i < arrNode.length; i++) {	//画节点
        strRect += arrNode[i].getVML();
    }
    var strLine = '';
    for (var i = 0; i < arrLine.length; i++) {		//画线
        strLine += arrLine[i].getVML();
    }
    ret = '<v:group ID="group1" style="position:relative;WIDTH:1000px;HEIGHT:1000px;" coordsize="1000,1000">';
    ret += strRect + strLine + '</v:group>';
    document.all.divxml.innerHTML = ret;
}

function showFlowMx(oXML,graph,nodeParent){
    arrNode.length = 0;
    arrLine.length = 0;
    var NodeFStr = ' <table style="width: 100%"><col width="30%" /><col width="70%" />' +
        '<tr><td style="text-align:right">' +
		'<img src="../../js/flow/images/icon/flowunit.gif" style="width: 20px;"></td>' +
        '<td style="text-align:left">流程节点</td></tr></table><hr size="1" style="margin-top: 0px">' +
        '<div style="text-align:center"><b style="color: #000">';
    var NodeSStr = '</b></div><label style="display:none">';
	var NodeTStr = '</label>';
    var NodeStyle = 'verticalAlign=top;align=center;overflow=fill;fontSize=12;fontFamily=Helvetica;html=1;' +
        'shadow=1;rounded=1;fillColor=#FFFFFF;gradientColor=';
    var passColor = '#50FF4A;'
    var noPassColor = '#66B2FF;'
    var curColor = '#FF6B6B;'
    var LineStyle = 'strokeColor=#FF3333;strokeWidth=2;';
    var bothLineStyle = 'startArrow=classic;startFill=1;'
    var nodeLine = new Array();
    oNodes = oXML.documentElement.childNodes;//获取所有节点
    for (var i = 0; i < oNodes.length; i++) {	//将节点加载到数组
        arrNode[i] = new FlowNode(oNodes[i]);
        var nodeShowStyle = NodeStyle;
        if(arrNode[i].status == 'passed'){
            nodeShowStyle += passColor;
        }else if(arrNode[i].status == 'running'){
            nodeShowStyle += curColor;
        }else{
            nodeShowStyle += noPassColor;
        }
        var MxNode = graph.insertVertex(nodeParent, null, NodeFStr +arrNode[i].name + NodeSStr + arrNode[i].title + NodeTStr,
            arrNode[i].x, arrNode[i].y, 100, 60, nodeShowStyle);
        nodeLine[i] = MxNode;
    }
    for (var i = 0; i < arrNode.length; i++) {	//将线加载到级组
        for (var j = 0; j < arrNode[i].lines.length; j++) {
            addFlowLine(arrNode[i].sid, arrNode[i].lines[j].getAttribute('to'));
        }
    }

    for (var i = 0; i < arrLine.length; i++) {		//画线

        var lineShowStyle = LineStyle;
        if(arrLine[i].both){
            lineShowStyle += bothLineStyle;
        }
        graph.insertEdge(nodeParent, null, '', nodeLine[arrLine[i].from], nodeLine[arrLine[i].to],lineShowStyle);

    }

}

var cstNodeWidth = 80;	//节点宽度
var cstNodeHeight = 50;	//节点高度
var cstNodeSpaceX = 1;	//节点间隔 X
var cstNodeSpaceY = 1;	//节点间隔 Y
var arrNode = new Array();
var arrLine = new Array();
function FlowNode(oNode) {
    this.obj = oNode;
    this.sid = oNode.getAttribute('sid');
    this.name = oNode.getAttribute('name');
    this.type = oNode.getAttribute('type');
    //this.running = oNode.getAttribute('running')=='true';
    this.status = oNode.getAttribute('status');
    if (!this.status) this.status = '';
    this.x = parseInt(oNode.getAttribute('xlocation'));
    this.y = parseInt(oNode.getAttribute('ylocation'));
    this.left = this.x * cstNodeSpaceX;	//节点位置
    this.top = this.y * cstNodeSpaceY;
    this.lines = oNode.getElementsByTagName('transition');
    var showuname = '';
    var showduname = '';
    //if (this.running){
    this.title = '';
    var users = oNode.getElementsByTagName('user');
    for (var i = 0; i < users.length; i++) {
        if (i > 0) this.title += '\n';
        this.title += '[' + users[i].getAttribute('dept') + ']';
        //this.title += users[i].getAttribute('name');
        showuname = users[i].getAttribute('name');
        this.title += (showuname.indexOf("-") != -1 ? showuname.substring(0, showuname.indexOf("-")) : showuname);
        if (users[i].getElementsByTagName('delegation').length > 0) {
            showduname = users[i].getElementsByTagName('delegation')[0].getAttribute('name');
            showduname = (showduname.indexOf("-") != -1 ? showduname.substring(0, showduname.indexOf("-")) : showduname);
            //this.title += '  (' + users[i].getElementsByTagName('delegation')[0].getAttribute('name') + ' 代)';
            this.title += '  (' + showduname + ' 代)';
        }
        if (users[i].getAttribute('status') == 'running') this.title += ' [在办]'
        if (users[i].getAttribute('status') == 'passed') this.title += ' [已办]'
    }
    //}
}
FlowNode.prototype.getVML = function () {  // 返回节点框vml代码
    var ret = '';
    ret += '<v:roundrect strokecolor="black"';
    if (this.title != '') ret += ' title="' + this.title + '" ';
    ret += 'style="position:relative;left:' + this.left + ';top:' + this.top + ';width:' + cstNodeWidth + ';height:' + cstNodeHeight + ';z-index:9;text-align:left;" ';
    if (this.status == 'passed')    ret += 'fillcolor="#66FF00"';
    if (this.status == 'running')    ret += 'fillcolor="#FE7049"';
    if (this.status == '')    ret += 'fillcolor="#5F87FF"';
    ret += '>';
    ret += '<v:shadow on="t" type="single" color="#CCC" offset="2pt,2pt"></v:shadow>';
    ret += '<img src="../css/flowunit.gif" style="position:relative;LEFT:5;TOP:4"><SPAN style="FONT-SIZE:12px;Z-INDEX:10;COLOR:#555;position:relative;position:relative;LEFT:6;">&nbsp;流程节点</SPAN><br>';
    ret += '<SPAN style="FONT-SIZE:12px;Z-INDEX:10;line-height:14px;COLOR:black;position:relative;LEFT:5;TOP:5;width:' + (cstNodeWidth - 6) + ';text-align:center;">' + this.name + '</SPAN>';
    ret += '<v:fill type="gradient" color2="white"/>';
    ret += '</v:roundrect>';
    ret += '<v:line style="Z-INDEX:10;LEFT:' + this.left + 'px;position:relative;TOP:' + this.top + 'px" from="0,19" to="' + cstNodeWidth + ',19" strokecolor="#888" strokeweight="1pt"></v:line>';
    return ret;
}
function FlowLine(ifrom, ito) {
    this.from = ifrom;
    this.to = ito;
    this.both = false;	//是否双箭头
    var delta = 5;
    var x1 = arrNode[this.from].left + parseInt(cstNodeWidth / 2);
    var x2 = arrNode[this.to].left + parseInt(cstNodeWidth / 2);
    var y1 = arrNode[this.from].top + parseInt(cstNodeHeight / 2);
    var y2 = arrNode[this.to].top + parseInt(cstNodeHeight / 2);
    if ((x2 - x1) > 10) {
        x2 = x2 - (cstNodeWidth / 2 + delta);
        x1 = x1 + (cstNodeWidth / 2 + delta);
    }
    if ((x1 - x2) > 10) {
        x2 = x2 + (cstNodeWidth / 2 + delta);
        x1 = x1 - (cstNodeWidth / 2 + delta);
    }
    if ((y2 - y1) > 10) {
        y2 = y2 - (cstNodeHeight / 2 + delta);
        y1 = y1 + (cstNodeHeight / 2 + delta);
    }
    if ((y1 - y2) > 10) {
        y2 = y2 + (cstNodeHeight / 2 + delta);
        y1 = y1 - (cstNodeHeight / 2 + delta);
    }
    this.x1 = x1;
    this.x2 = x2;
    this.y1 = y1;
    this.y2 = y2;
    this.fork = false;	//是否分岔
    this.x0 = -1;
    this.y0 = -1;
}
FlowLine.prototype.getVML = function () {  // 返回连线vml代码
    var ret;
    ret = '<v:line style="position:relative;z-index:20;" from="' + this.x1 + ',' + this.y1 + '" to="' + this.x2 + ',' + this.y2 + '" >';
    ret += '<v:stroke ' + (this.both ? 'StartArrow="Classic"' : '') + ' EndArrow="Classic" color="red"/>';
    ret += '</v:line>\n';
    return ret;
}
function findNode(sid) {
    for (var i = 0; i < arrNode.length; i++) {
        if (arrNode[i].sid == sid) return i;
    }
}
function findLine(ifrom, ito) {
    for (var i = 0; i < arrLine.length; i++) {
        if (((arrLine[i].from == ifrom) && (arrLine[i].to == ito)) || ((arrLine[i].from == ito) && (arrLine[i].to == ifrom)))
            return i;
    }
    return -1;
}
function addFlowLine(fromID, toID) {
    var arrTo = toID.split(',');
    //if (toID.indexOf(',')>0){}
    for (var i = 0; i < arrTo.length; i++) {
        var iFrom = findNode(fromID);
        var iTo = findNode(arrTo[i]);
        var intTem = findLine(iFrom, iTo);
        if (intTem == -1) {
            arrLine[arrLine.length] = new FlowLine(iFrom, iTo);
        } else {
            arrLine[intTem].both = true;
        }
    }
}

/*********************************************************以下为流程引擎脚本中的工具部分**********************************/
//获取XML对象的内容
function getXMLStr(xDom) {
    if (jt.bIE) return xDom.xml;
    return (new XMLSerializer()).serializeToString(xDom);
}
function getXMLNodeValue(oXML, sPath, sDef) {
    return (oXML.selectNodes(sPath).length == 0) ? sDef : oXML.selectNodes(sPath)[0].text;
}
function getXMLNodeAttr(oXML, sPath, sAttr, sDef) {
    try {
        return oXML.selectNodes(sPath)[0].attributes.getNamedItem(sAttr).text;
    } catch (e) {
        if (sDef) return sDef;
        return '';
    }
}
//设置XML节点属性
function setXMLNodeAttr(oXML, sPath, sAttr, sVal) {
    var oNode = oXML.selectSingleNode(sPath);
    if (typeof(sVal) == 'undefined') sVal = '';
    jt.setAttr(oNode, sAttr, sVal);
}
//添加XML子节点
function addXMLChildNode(oXML, sPath, sNodeName) {
    var oNode = oXML.createElement(sNodeName);
    if (typeof(sPath) == 'string') {
        var oPar = oXML.selectSingleNode(sPath);
    } else {
        var oPar = sPath;
    }
    return oPar.appendChild(oNode);
}
//转化特殊字符
function Tranfertext(text) {
    if (typeof(text) != "string") text = text.toString();
    return text.replace(/,/g, "，").replace(/;/g, "；").replace(/#$%/g, "").replace(/\r\n/g, "<br>");
}
String.prototype.Trim = function () {
    return this.replace(/(^\s*)|(\s*$)/g, "");
}
//验证是否为确定值
function isValid(value) {
    if (value == null || value == undefined || value == 'undefined' || value == "null") {
        return false;
    }
    return value;
}

function isEmpty(value) {
    if (value == null || value == undefined || value == 'undefined' || value == '') {
        return true;
    }
    return false;
}
/**
 * 检查意见内容是否正确
 * @param oInputObj
 * @returns {boolean}
 */
function checkOpinion(oInputObj) {
    var obj = oInputObj;
    var txt = "";
    if (typeof(oInputObj) == 'object') {
        txt = oInputObj.value;
    } else {
        top.showMsg("非意见对象");
        return;
    }
    txt = txt.trim();
    if (txt == '') {
        top.showMsg('请填入意见信息');
        try {
            obj.focus()
        } catch (e) {
        }
        ;
        return false;
    }
    re = /[ ,.,\,,\;,\\,\/,、,@,\!,#,	,\·,\n,\r,\……,\￥,\@,\#,\！,\~,\（,\）,\',\{,\},\$,\%,\^,\&,\*,(,),~,`,<,>,:,\",?,|,\[,\],\+,\-,0,1,2,3,4,5,6,7,8,9,\=,\《,\》,_,\——,\，,\。,\；,\‘,\【,\】,\？]/g;
    if (txt.replace(re, '') == '') {
        top.showMsg('请勿用特殊字符做为意见，请填写正确意见');
        try {
            obj.focus()
        } catch (e) {
        }
        ;
        return false;
    }
    return true;
}

//在意见框内光标处插入文本
var start, end;
function addTextAtCursorPos(txt) {
    var fldDst = flowEngine.opinionAreaObj;
    var textLength = fldDst.value.length;
    if (start == undefined) start = textLength;
    if (end == undefined) end = textLength;
    var pre = fldDst.value.substr(0, start);
    var post = fldDst.value.substr(end);
    fldDst.value = pre + txt + post;

    start = start + txt.length;
    end = end + txt.length;

    //移动光标到特定位置
    if (fldDst.createTextRange) {
        var r = fldDst.createTextRange();
        r.moveStart("character", start); //前端向右移
        r.collapse(true); //光标偏向选择范围结尾处
        r.select();
    } else {
        fldDst.setSelectionRange(start, start);
        fldDst.focus();
    }
}
/**
 * 鼠标或者键盘输入后确认光标位置
 * @param textBox
 */
function saveCursorPos(textBoxObj) {
    if (typeof(textBoxObj.selectionStart) == "number") {
        //如果浏览器是Firefox(1.5)
        start = textBoxObj.selectionStart;
        end = textBoxObj.selectionEnd;
    } else if (document.selection) {
        //下面是IE(6.0)的方法，需要计算上'\n'
        var range = document.selection.createRange();
        if (range.parentElement().id == textBoxObj.id) {
            //创建文本框范围对象
            var range_all = document.body.createTextRange();
            range_all.moveToElementText(textBoxObj);
            //两个range，一个是已经选择的text(range)，一个是整个textarea(range_all)
            //range_all.compareEndPoints()比较两个端点，如果range_all比range更往左(further to the left)，则
            //返回小于0的值，则range_all往右移一点，直到两个range的start相同。
            for (start = 0; range_all.compareEndPoints("StartToStart", range) < 0; start++)
                range_all.moveStart('character', 1);
            // get number of line breaks from textarea start to selection start and add them to start
            // 计算一下\n
            for (var i = 0; i <= start; i++) {
                if (textBoxObj.value.charAt(i) == '\n')
                    start++;
            }
            //创建文本框范围对象
            var range_all = document.body.createTextRange();
            range_all.moveToElementText(textBoxObj);
            //返回小于0的值，则range_all往右移一点，直到两个range的end相同。
            for (end = 0; range_all.compareEndPoints('StartToEnd', range) < 0; end++)
                range_all.moveStart('character', 1);
            // 计算一下\n
            for (var i = 0; i <= end; i++) {
                if (textBoxObj.value.charAt(i) == '\n')
                    end++;
            }
        }
    }
}

function TransAndUser_FindItem(sTransTo,sTransReject,sTransType){
	sTransType=jt.def(sTransType,'');
	var bReject = jt.def(sTransReject,false);
	for (var i=0;i<TransAndUser.length;i++){
		var item=TransAndUser[i];
		if ((item.transinfo.to==sTransTo) && (item.isReject==bReject)){
			if (sTransType=='') return item;
			if (sTransType==item.transType) return item;
		}
	}
	return null;
}
//保存发送路径
//sTransType类型: send:发送   reject:退回  sendOther:转办
function TransAndUser_PushItem(json,sTransType){
	jt.each(json,function(idx,item){
		var oTran = TransAndUser_FindItem( item.transinfo.to, item.transinfo.reject, sTransType );
		if (oTran!=null) return;
		item.isReject = jt.def(item.transinfo.reject,false);
		item.transType= sTransType;
		item.idx=TransAndUser.length;
		item.toNode = jt.def(item.transinfo.toNode,"");
		TransAndUser.push(item);
		TransAndUser_CheckUser(item);
	});
}
//检测路径人员是否单用户
function TransAndUser_CheckUser(item){
	if ((item.data||[]).length==0) return;
	var singleUser=null;
	var userCount=0;
	function checkSingle(arr){
		if (userCount > 1) return userCount;
		for (var i=0; i<arr.length; i++){
			if (arr[i].nodeType == "org_user"){
				singleUser=arr[i];
				userCount++;
			}else{
				if ((arr[i].children||[]).length>0) checkSingle(arr[i].children);
			}
			if (userCount > 1) return userCount;
		}
	}
	checkSingle(item.data);
	if (userCount==1){
		item.isSingleUser = true;
		item.singleUser = singleUser;
	}else{
		item.isSingleUser = false;
		item.singleUser = null;
	}
}

//var temUserCount = 0;
//var temUser_checkSingleUser = null;
//function checkSingleUser(tempObj, bRecursive) {
//    if (!bRecursive) {
//        temUserCount = 0;
//        temUser_checkSingleUser = null;
//    }
//    if (temUserCount > 1) return temUserCount;
//    if (tempObj.nodeType == "org_user") {
//        temUser_checkSingleUser = tempObj;
//        temUserCount++;
//    } else {
//        var arr = tempObj.children;
//        if ((!arr) || (arr.length == 0)) return temUserCount == 1;
//        for (var i = 0; i < arr.length; i++) checkSingleUser(arr[i], true);
//    }
//    return temUserCount == 1;
//}
//function getFirstUser(tempObj) {
//    checkSingleUser(tempObj);
//    return temUser_checkSingleUser;
//}

//弹出对话框
function showFlowDialog(sTitle, sURL, sID, iWidth, iHeight, bMax) {
	if (typeof(parent.flow_ShowDialog) == 'function') { //移动办公, 实现此函数,  重新设计对话框
		parent.flow_ShowDialog(sTitle, sURL, sID, iWidth, iHeight, bMax);
	} else {
		sURL = '{SYSURL.engine}/jsp/engine/extension/' + sURL;
		parent.showDialog(sTitle, sURL, sID, iWidth, iHeight, bMax);
	}
}
/**
 * 调用该方法控制意见框的显示和默认勾选情况
 * 配置的IsMsgSenderEnable是否发送消息为1
 * 配置的RegisteredMessageChannel 消息通道中包含界面展现的对象
 * 读取环节配置是否默认勾选
 * @param engineConfigJson
 * @param stateInfoJson
 */
function showMsgNotifyTypeAndCheckStatus(){
	var stateInfoJson = parent.frameEngine.getStateJson();
	var engineConfigJson  = parent.frameEngine.getEngineConfigJson();
	//流程引擎参数配置存在
	//配置的IsMsgSenderEnable是否发送消息为1
	//配置的RegisteredMessageChannel 消息通道中包含界面展现的对象
	//读取环节配置是否默认勾选
	if(engineConfigJson && engineConfigJson.IsMsgSenderEnable && engineConfigJson.IsMsgSenderEnable =='1'){
		if(engineConfigJson.RegisteredMessageChannel && engineConfigJson.RegisteredMessageChannel!=""){
			var documentIdArray = engineConfigJson.RegisteredMessageChannel.split(",");
			for(var i= 0,j=documentIdArray.length;i<j;i++){
				try{
					jt._("#tr_"+documentIdArray[i]+"").style.display = "";
				}catch(e){}
			}
			if(stateInfoJson && stateInfoJson.checkedMsg && stateInfoJson.checkedMsg !=''){
				var idArray  = stateInfoJson.checkedMsg.split(";");
				for(var i= 0,j=idArray.length;i<j;i++){
					try{
						jt._("#"+idArray[i]+"").checked = true;
					}catch(e){}
				}
			}
		}
	}

	//提供调用外部接口 根据返回内容 显示和是否默认勾选
	if(typeof (parent.flow_Action_Msg_Init) == "function"){
		try{
			parent.flow_Action_Msg_Init(function(arr){
				if(jt.isArray(arr)){
					for(var i= 0,j=arr.length;i<j;i++){
						var type = jt.getDefVal(arr[i].type,'');
						var check = jt.getDefVal(arr[i].check,false);
						if(type!=""){
							jt._("#tr_"+type+"").style.display = "";
							jt._("#"+type+"").checked = check;
						}
					}
				}
			})
		}catch(e){}
	}
}

/**
 * 流程引擎发送等操作后续处理，流程引擎进行一些特殊处理
 * 该处理结束后，再调用业务端端后续方法
 */
function _flowEngineOperateAfterInnerFun(json) {
	if(json && json.errorCode!="0"){
		top.showMsg("流程引擎处理失败："+json.errorInfo);
		return;
	}
	//调用业务端后续函数
	if (typeof (parent.flow_Action_After) == "function") {
		try {parent.flow_Action_After(json);} catch (e) {}
	}
}
