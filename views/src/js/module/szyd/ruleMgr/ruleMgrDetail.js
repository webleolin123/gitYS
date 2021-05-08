/**

 @Name：制度明细
 @Author：LinC

 */
layui.config({
    base: '../../../src/js/',
    version: new Date().getTime()
}).extend({}).use(
    ['eleTree', 'layer', 'laytpl', 'common', 'element','form','table'],
    function () {
    var common = layui.common;
    var element = layui.element;
    var form = layui.form;
    var table = layui.table;

    var baseUrl = '../../../../';
    var editRegulationId = common.getQueryVariable('regulationId');
    var operBtnActive={
        op1:function(){
            var op1_index=layer.open({
                title: '操作流程1',
                type: 1,
                // btn: ['确定','关闭'],
                // btnAlign: 'c',
                //页面
                content: $('.op1Layer').html(),
                area: ['580px','300px'],
                success: function (obj) {
                    // 确定
                    form.on('submit(formOp1)',function (obj) {
                        layer.close(op1_index);
                        return false;
                    });
                    // 确定
                    form.on('submit(formOp1Close)',function (obj) {
                        layer.close(op1_index);
                        return false;
                    });
                }
            });
        },
        op2:function(){
            layer.msg('触发操作流程2');
            return false;
        },
        op3:function(){
            layer.msg('触发操作流程3');
            return false;
        },
        op4:function(){
            layer.msg('触发操作流程4');
            return false;
        },
        bj:function(){
            layer.confirm('是否办结?', {icon: 3, title: '提示', offset: '150px', btn:['是','否']}, function (index) {
                // var loadingIndex = layer.load();
                // common.fetchDelete('iiorsmgr/realtimeReportStage/toDeleteReportStage?reportStageId='+reportStageId,function (res) {
                // layer.close(loadingIndex);
                // if(res.success){
                //     reportStages.tableRender(data.realtimeReportfiveId);
                //     clueHandle.tableRender();//获取线索列表信息
                //     if (data.reportStatus == 0) {//新增或编辑未上报状态删除
                //         reportStages.statusRender(data.realtimeReportfiveId,1);//刷新报送阶段状态
                //     }
                //     else{//上报状态删除
                //         reportStages.statusRender(data.realtimeReportfiveId);//刷新报送阶段状态
                //     }
                //     parent.layer.msg('删除成功' , {
                //         time: 3000, //3s后自动关闭
                //     });
                //     layer.closeAll();
                // }else{
                //     parent.layer.msg('删除失败' , {
                //         time: 3000, //3s后自动关闭
                //     });
                // }
                // }
                // , function (err) {
                //     if(err.resultMessage){
                //         layer.alert(err.resultMessage);
                //     }
                //     else{
                //         layer.msg('删除失败');
                //     }
                //     layer.close(loadingIndex);
                // });
                layer.close(index);
            });
        },
    }
    // 上传附件
    var uploadListIns={
        getUploadList:function(resId,type,moudleName,$dom){
            var loadingIndex = layer.load();
            try {
                common.fetchGet('../../../../dfsmgr/file/getFileByResIdAndFileType?id='+resId+'&type='+type,function (res) {
                        layer.close(loadingIndex);
                        if (res.success && res.list && res.list.length>0) {
                            var html='';
                            $.map(res.list, function (item, index) {
                                html+=' <span class="layui-col-xs12 dowLoadFile a-link" name= title="'+item.fiOriginalName+'" data-fiId="'+item.fiId+'">'+item.fiOriginalName+'</span>';
                            });
                            $dom.html(html);
                            $dom.find('.dowLoadFile').off('click').on('click',function(e){
                                var fiId=$(e.target).attr('data-fiId');
                                if(fiId){
                                    uploadListIns.downLoadFile(fiId);
                                }
                            });
                        } else {
                            $dom.html('<div style="color:#d30001">暂无数据</div>');
                            // parent.layer.msg(moudleName+'获取失败', {
                            //     time: 3000, //3s后自动关闭
                            // });
                        }
                    },
                    function (err) {
                        if(err.resultMessage){
                            // layer.alert(err.resultMessage);
                            $dom.html('<div style="color:#d30001">'+moudleName+'获取失败:'+err.resultMessage+'</div>');
                        }
                        else{
                            // layer.msg(moudleName+'文件获取失败');
                            $dom.html('<div style="color:#d30001">'+moudleName+'获取失败</div>');
                        }
                        layer.close(loadingIndex);
                    });
            } catch (e) {
                layer.close(loadingIndex);
                layer.msg(moudleName+'文件获取失败,请联系系统管理员');
            }
        },
        downLoadFile:function(fiId){
            var src = "/dfsmgr/file/filesDownload?fid=" + fiId;
            window.open(src);
        }
    }
    var eventHandle = {

        domEvent: function () {
            // 操作流程
            $('.operBtn').off('click').on('click', function () {
                var othis = $(this), type = othis.data('type');
                var hasClass=othis.hasClass('bgBlueBtn');
                if(!hasClass){
                    othis.addClass('bgBlueBtn');
                    othis.siblings().removeClass('bgBlueBtn');
                }
                else{
                }
                operBtnActive[type] ? operBtnActive[type].call(this, othis) : '';
            });
        },
        matterVoteList:function(regulationId){ //事项表决方式列表
             table.render(common.tableInitParams({
                elem: '#zdmx_sxbjTable',
                url: baseUrl+'sasszrule/regulationVote/list',
                method:'post',
                height:null,
                cols: [
                    [
                        {type: 'numbers', title: '序号'},
                        {field: 'itemName',align: 'center', minWidth:120,title: '事项名称',sort:true},
                        {field: 'modeName', align: 'center',minWidth:120,title: '表决方式', sort: true},
                        {field: 'peopleRate',align: 'center',width:120, title: '人数占比', sort: true}
                    ]
                ],
                page:false,
                where:{regulationId:regulationId}
            }));
        },
        //接口值信息导入
        editDataInit: function () {
            var layerLoader = common.layerLoader();
            //跨域通信中判断是否存在导入配置内容的值
            setTimeout(function () {
                if (!!editRegulationId) {//明细
                    //获取配置值
                    common.fetchGet('sasszrule/regulation/info?regulationId=' + editRegulationId,function (res) {
                        layer.close(layerLoader);
                        var obj = res.object || null;
                        if(obj){
                            var zdDetailInfo=$('#zdDetailInfo');


                            //流程引擎处理
                            common.flowEngineStep({
                                elem: $('#flowStepBox'),
                                businessId: editRegulationId,
                                ggCreateEid: obj.ggCreateEid,
                                showIframe: $('#iframeShowFlow'),
                                flowState: obj.flowState,
                                showIframeHeight: $(window).height() - 100 + 'px',
                                businessUrl: 'sasszrule/ruleEngine/updateBusinessInfo'
                            });
                            //流程日志导入
                            // common.flowLogDataSet($('#flowLogDataSet'), editRegulationId);

                        //标题
                            // // 企业名称
                            // zdDetailInfo.find('[name="seName"]').html(obj.seName);
                        //内容--制度信息
                            //制度名称
                            zdDetailInfo.find('[name="regulationName"]').attr('title',obj.regulationName).html(obj.regulationName);
                            //审批日期
                            zdDetailInfo.find('[name="approvalDate"]').attr('title',obj.approvalDate).html(obj.approvalDate);
                            //制度类型
                            var regulationTypeName=obj.regulationTypeName;
                            zdDetailInfo.find('[name="regulationTypeName"]').attr('title',regulationTypeName).html(regulationTypeName);
                            //失效日期
                            zdDetailInfo.find('[name="expireDate"]').attr('title',obj.expireDate).html(obj.expireDate);
                            //生效日期
                            zdDetailInfo.find('[name="effectiveDate"]').attr('title',obj.effectiveDate).html(obj.effectiveDate);
                            //经过合法审查
                            var auditFlag=obj.auditFlag=="1"?'是':'否';
                            zdDetailInfo.find('[name="auditFlag"]').attr('title',auditFlag).html(auditFlag);
                            if(regulationTypeName=="议事规则"){
                                //会议类型
                                zdDetailInfo.find('[name="meetingTypeName"]').attr('title',obj.meetingTypeName).html(obj.meetingTypeName);
                                zdDetailInfo.find('[name="meetingTypeName"]').parent().show();
                            }
                            else{
                                zdDetailInfo.find('[name="meetingTypeName"]').parent().hide();
                            }
                            //表决方式
                            // zdDetailInfo.find('[name="attendeeNames"]').attr('title',obj.attendeeNames).html(obj.attendeeNames);
                            // //事项名称
                            // zdDetailInfo.find('[name="attendeeNames"]').attr('title',obj.attendeeNames).html(obj.attendeeNames);
                            // //人数占比
                            // zdDetailInfo.find('[name="attendeeNames"]').attr('title',obj.attendeeNames).html(obj.attendeeNames);
                            //正式文件
                            uploadListIns.getUploadList(editRegulationId,'FORMAL','正式文件',zdDetailInfo.find('[name="FORMAL"]'));
                            //佐证材料
                            uploadListIns.getUploadList(editRegulationId,'EVIDENCE','佐证文件',zdDetailInfo.find('[name="EVIDENCE"]'));
                        //内容--事项表决列表
                            eventHandle.matterVoteList(editRegulationId);
                            //是否听取意见
                            // zdDetailInfo.find('[name="meetingName"]').html(obj.meetingName);
                        // //内容--决策信息
                        //     //对应事项清单和决策顺序
                        //     zdDetailInfo.find('[name="meetingName"]').html(obj.meetingName);
                        //     //实际决策顺序
                        //     zdDetailInfo.find('[name="meetingName"]').html(obj.meetingName);
                        //     //决策异常
                        //     zdDetailInfo.find('[name="meetingName"]').html(obj.meetingName);
                        // //内容--整改情况
                        //     //原决策异常
                        //     zdDetailInfo.find('[name="meetingName"]').html(obj.meetingName);
                        // //内容--组织实施
                        //     //落实责任部门
                        //     zdDetailInfo.find('[name="meetingName"]').html(obj.meetingName);
                        //     //实施状态
                        //     zdDetailInfo.find('[name="meetingName"]').html(obj.meetingName);
                        //     //责任人
                        //     zdDetailInfo.find('[name="meetingName"]').html(obj.meetingName);
                        //     //时间进度
                        //     zdDetailInfo.find('[name="meetingName"]').html(obj.meetingName);
                        //     //预期成效
                        //     zdDetailInfo.find('[name="meetingName"]').html(obj.meetingName);
                        //     //正式文件
                        //     zdDetailInfo.find('[name="meetingName"]').html(obj.meetingName);
                        //内容--流程日志
                        }
                    });
                }
                else {
                    layer.close(layerLoader);
                }
            }, 100);
        },
        pageLoad: function () {
            element.init();
            common.themeSet();

            common.buttonLimit();
            common.columnSide();

            common.dataAccessReloadModule({});

            eventHandle.editDataInit();
            eventHandle.domEvent();
        }
    };

    eventHandle.pageLoad();


});
