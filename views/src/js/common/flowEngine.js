/**
 @Name：流程引擎封装
 @des:  流程引擎接口调用前端封装
 @Author：lfx
 @updateTime : 2019-06-21
 */
layui.define(['common'], function (exports) {
    var common = layui.common;

    var draftRequestUrl = "../../../flowEngine/engineBase/draftRequest";//起草流程url
    var transitionRequestUrl = "../../../flowEngine/engineBase/transitionRequest";//查询下个环节
    var assignmentRequestUrl = "../../../flowEngine/engineBase/assignmentRequest";//查询下个环节人员
    var engineCoreProcessUrl = "../../../flowEngine/engineBase/engineStateSubmit";//流程发送
    var querycancelsubmitUrl = "../../../flowEngine/engineSpecial/querycancelsubmitrequest";//查询可撤办的待办信息
    var cancelStateSubmitUrl = "../../../flowEngine/engineBase/engineCancelStateSubmit";//撤办提交
    var cancelEndSubmitUrl = "../../../flowEngine/engineBase/engineCancelEndSubmit"; //取消办毕
    var specialstatesubmitUrl = "../../../flowEngine/engineSpecial/specialstatesubmitRequest";//流程特松
    var engineCancelByDrafterUrl = "../../../flowEngine/engineBase/engineCancelByDrafter";//流程特松

    var engineTrashUrl = "../../../flowEngine/engineSpecial/trashRequest";//流程特松

    var engineDeleteUrl = "../../../flowEngine/engineSpecial/deleteRequest";//流程特松


    var flowEngine = {
        ptLabel:"",//流程模板编码
        ptVersion:"",//流程模板版本
        ptCompanyId:"",//流程模板单位
        businessId:"",//业务ID
        catalogueId:"",//目录ID
        reject:"",//是否退回
        userId:"",//用户ID
        userName:"",//用户名称
        deptId:"",//部门ID
        deptName:"",//部门名称
        companyId:"",//单位ID
        stateId:"",//环节ID
        piid:"",
        aiid:"",
        wiid:"",
        updateFlowSuccess:null,

        /**
         * 流程初始化
         * @param flowParam
         */
        init:function(flowParam){
            $.extend(this, flowParam);
        },
        /**
         * 发起流程（起草）
         */
        draftRequest:function(succCallback,failCallback){
            this.stateId = "step10";
            common.fetchPost(draftRequestUrl, this, function(data){
                succCallback(data);
            }, function(data){
                flowEngine.failCallback(data);
            });
        },
        /**
         * 流程撤回（起草人撤回）
         */
        cancelByDrafter: function(succCallback,failCallback){
            // this.stateId = "step10";
            common.fetchGet(engineCancelByDrafterUrl+ "?piid=" + this.piid, function(data){
                succCallback(data);
            }, function(data){
                flowEngine.failCallback(data);
            });
        },

        engineTrash: function(succCallback,failCallback){
            // this.stateId = "step10";
            common.fetchPost(engineTrashUrl,this, function(data){
                succCallback(data);
            }, function(data){
                flowEngine.failCallback(data);
            });
        },

        engineDelete: function(succCallback,failCallback){
            // this.stateId = "step10";
            common.fetchPost(engineDeleteUrl,this, function(data){
                succCallback(data);
            }, function(data){
                flowEngine.failCallback(data);
            });
        },
        /**
         * 流程发送环节查询
         * @param succCallback
         * @param failCallback
         */
        transitionRequest:function(succCallback,failCallback){
            common.fetchPost(transitionRequestUrl, this, succCallback, failCallback);
        },
        /**
         * 指派人员查询
         * @param succCallback
         * @param failCallback
         */
        assignmentRequest:function(succCallback,failCallback){
            common.fetchPost(assignmentRequestUrl, this, null, null);
        },
        /**
         * 流程发送
         * @param succCallback
         * @param failCallback
         */
        engineCoreProcess:function(sendParams,succCallback,failCallback){
            common.fetchPost(engineCoreProcessUrl, sendParams,function(data){
                if(data.success){
                    flowEngine.succCallback(data,succCallback,failCallback);
                }else{
                    layer.msg(data.resultMessage);
                }
            }, function(){
                flowEngine.failCallback(data);
            });
        },

        /**
         * 查询可撤办的待办信息
         * @param {*} succCallback
         * @param {*} failCallback
         */
        querycancelsubmit:function(succCallback,failCallback){
            common.fetchPost(querycancelsubmitUrl, this, succCallback, failCallback);
        },

        /**
         * 流程撤办提交
         * @param {*} succCallback
         * @param {*} failCallback
         */
        cancelStateSubmit:function(sendParams,succCallback,failCallback){
            common.fetchPost(cancelStateSubmitUrl, sendParams, function(data){
                flowEngine.succCallback(data,succCallback,failCallback);
            }, failCallback);
        },
        /**
         * 流程取消办毕
         * @param {*} sendParams 
         * @param {*} succCallback 
         * @param {*} failCallback 
         */
        cancelEndSubmit:function(sendParams,succCallback,failCallback){
            common.fetchPost(cancelEndSubmitUrl,sendParams,function(data){
                flowEngine.succCallback(data,succCallback,failCallback);
            },failCallback);
        },
        /**
         * 流程特松
         * @param {*} sendParams 
         * @param {*} succCallback 
         * @param {*} failCallback 
         */
        specialstatesubmit:function(sendParams,succCallback,failCallback){
            common.fetchPost(specialstatesubmitUrl,sendParams,function(data){
                flowEngine.succCallback(data,succCallback,failCallback);
            },failCallback);
        },
        /**
         * 流程接口成功后回调方法
         * @param json
         */
        succCallback : function (data,succCallback,failCallback){

            if(data.success && data.object.errorCode == 0){
                flowEngine.updateFlowBusinessInfo(data,succCallback,failCallback);
            }else{
                parent.layer.close(parent.loadingIndex);
                layer.msg(data.resultMessage);
            }
        },
        /**
         * 流程接口失败后回调方法
         * @param json
         */
        failCallback : function (data){
            alert(data.success);
        },

        /**
         * 设置流程保存成功后更新业务与流程数据后的成功回调函数
         * @param {*} func
         */
        setUpdateFlowSuccess : function(func){
            if(typeof(func) == 'function'){
                this.updateFlowSuccess = func;
            }
        },
        /**
         * 流程保存成功后更新业务与流程数据
         */
        updateFlowBusinessInfo : function(data,succCallback,failCallback){
            var piid = data.object.piid
            if(!piid){
                piid = this.piid
            }
            var updateUrl = "../../../sysmgr/flowBus/updateFlowBusinessInfo?piid="+piid+"&businessId="+this.businessId+'&catalogueId=' + this.catalogueId;
            common.fetchGet(updateUrl,succCallback,failCallback);
            layer.closeAll();
        }
    }

    exports('flowEngine', flowEngine);
});
