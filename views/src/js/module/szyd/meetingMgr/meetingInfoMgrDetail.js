/**

 @Name：会议明细
 @Author：LinC

 */
layui.config({
    base: '../../../src/js/',
    version: new Date().getTime()
}).extend({}).use(
    ['eleTree', 'layer', 'laytpl', 'common', 'element','form'],
    function () {
    var common = layui.common;
    var element = layui.element;
    var form = layui.form;
    var editMeetingId = common.getQueryVariable('meetingId');
        var ggCreateEid;
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
            layer.alert('触发操作流程2');
            return false;
        },
        op3:function(){
            layer.alert('触发操作流程3');
            return false;
        },
        op4:function(){
            layer.alert('触发操作流程4');
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
                //     parent.layer.alert('删除成功' , {
                //         time: 3000, //3s后自动关闭
                //     });
                //     layer.closeAll();
                // }else{
                //     parent.layer.alert('删除失败' , {
                //         time: 3000, //3s后自动关闭
                //     });
                // }
                // }
                // , function (err) {
                //     if(err.resultMessage){
                //         layer.alert(err.resultMessage);
                //     }
                //     else{
                //         layer.alert('删除失败');
                //     }
                //     layer.close(loadingIndex);
                // });
                layer.close(index);
            });
        },
    }
    // 上传附件
    var uploadListIns={
    filePreview:function(fiOriginalName){
        common.filePreview({
            src:window.location.origin+'/'+fiOriginalName
        }) ;
    },
    getUploadList:function(resId,type,moudleName,$dom){
        // var loadingIndex = layer.load();
        try {
            common.fetchGet('../../../../dfsmgr/file/getFileByResIdAndFileType?id='+resId+'&type='+type,function (res) {
                    // layer.close(loadingIndex);
                    if (res.success && res.list && res.list.length>0) {
                        var html='';
                        $.map(res.list, function (item, index) {
                            html+=' <span class="layui-col-xs12 dowLoadFile a-link" name= title="'+item.fiOriginalName+'" data-fiId="'+item.fiId+'" data-fiOriginalName="'+item.fiOriginalName+'">'+item.fiOriginalName+'</span>';
                        });
                        $dom.html(html);
                        $dom.find('.dowLoadFile').off('click').on('click',function(e){
                            var fiId=$(e.target).attr('data-fiId');
                            // var fiOriginalName=$(e.target).attr('data-fiOriginalName');
                            if(fiId){
                                // uploadListIns.filePreview(fiOriginalName);//预览
                                uploadListIns.downLoadFile(fiId);//下载
                            }

                        });
                    } else {
                        // $dom.html('<div style="color:#d30001">'+moudleName+'文件获取失败</div>');
                        $dom.html('<div style="color:#d30001">暂无数据</div>');
                        // parent.layer.alert(moudleName+'获取失败', {
                        //     time: 3000, //3s后自动关闭
                        // });
                    }
                },
                function (err) {
                    if(err.resultMessage){
                        layer.alert(err.resultMessage);
                        // $dom.html('<div style="color:#d30001">'+moudleName+'文件获取失败</div>');
                        $dom.html('<div style="color:#d30001">'+moudleName+'文件获取失败</div>');
                    }
                    else{
                        // layer.alert(moudleName+'文件获取失败');
                        $dom.html('<div style="color:#d30001">'+moudleName+'获取失败:'+err.resultMessage+'</div>');
                    }
                    // layer.close(loadingIndex);
                });
        } catch (e) {
            // layer.close(loadingIndex);
            layer.alert(moudleName+'文件获取失败,请联系系统管理员');
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
        selectTiolMeetingById:function(editMeetingId){//获取会议详情
            common.fetchPost('sasmeetingmgr/tiolMeeting/selectTiolMeetingById?meetingId=' + editMeetingId,{},function (res) {
                var obj = res.object || null;
                if(obj){
                    var hyDetailInfo=$('#hyDetailInfo');

                    ggCreateEid = obj.ggCreateEid;

                    //流程引擎处理
                    common.flowEngineStep({
                        elem: $('#flowStepBox'),
                        businessId: editMeetingId,
                        ggCreateEid: ggCreateEid,
                        showIframe: $('#iframeShowFlow'),
                        flowState: obj.flowState,
                        showIframeHeight: $(window).height() - 100 + 'px',
                        businessUrl: 'sasmeetingmgr/meetingEngine/updateBusinessInfo'
                    });
                    //流程日志导入
                    // common.flowLogDataSet($('#flowLogDataSet'), editMeetingId);


                //标题
                    // 企业名称
                    var seName=obj.seName?obj.seName:'--'
                    hyDetailInfo.find('[name="seName"]').html(seName);
                //内容--会议信息
                    //会议名称
                    var meetingName=obj.meetingName?obj.meetingName:'--'
                    hyDetailInfo.find('[name="meetingName"]').attr('title',meetingName).html(meetingName);
                    //会议时间
                    var meetingTime=obj.meetingTime?obj.meetingTime:'--';
                    hyDetailInfo.find('[name="meetingTime"]').attr('title',meetingTime).html(meetingTime);
                    //会议主持人
                    var moderatorName=obj.moderatorName?obj.moderatorName:'--';
                    hyDetailInfo.find('[name="moderatorName"]').attr('title',moderatorName).html(moderatorName);
                    //会议参会人员
                    var attendeeNames=obj.attendeeNames?obj.attendeeNames:'--';
                    hyDetailInfo.find('[name="attendeeNames"]').attr('title',attendeeNames).html(attendeeNames);
                    //会议通知
                    uploadListIns.getUploadList(editMeetingId,'NOTICE','会议通知',hyDetailInfo.find('[name="hyNotice"]'));
                    //会议纪要
                    uploadListIns.getUploadList(editMeetingId,'SUMMARY','会议纪要',hyDetailInfo.find('[name="hySummary"]'));
                //内容--流程日志
                }
            });
        },
        selectYtList:function(editMeetingId,$meetingIssue0,$meetingIssueContainer){//获取议题列表
            common.fetchPost('sasmeetingmgr/tiolSubject/selectTiolSubjectAndDeliberationCountList',{meetingId:editMeetingId},function (res) {
                var obj = res.list || null;
                if(obj&&obj.length>0){
                    //添加要渲染的列表片段
                    $.map(obj, function (item, index) {
                       if(index>0){
                        var html=' <div class="layui-collapse editView ytContainer" style="margin-top:10px;" lay-filter="ytContainer'+index+'" id="meetingIssue'+index+'">' + $meetingIssue0.html() + '</div>';
                        $meetingIssueContainer.append(html);
                       }
                    //重新初始化折叠面板
                        element.init();
                        //折叠面板
                        element.on('collapse(ytContainer'+index+')', function(data){
                            var $collapse=data.title;
                            if(data.show){
                                $collapse.find('.ytImg').attr('src','../../../../../src/images/ytOpen.png');
                            }
                            else{
                                $collapse.find('.ytImg').attr('src','../../../../../src/images/ytClose.png');
                            }
                        });
                        var  $parentMeetingIssue = $('#meetingIssue' +index);
                        //标题--议题名称
                        var subjectName=item.subjectName?item.subjectName:'--';
                        $parentMeetingIssue.find('[name="subjectName"]').empty().html(subjectName).attr('title',subjectName);
                        //标题--是否异常 0 正常 1 异常
                        var errStsPng=item.errSts=="1"?'../../../../../src/images/warn-redight.png':'../../../../../src/images/warn-light.png';
                        $parentMeetingIssue.find('[name="errSts"]').attr('src',errStsPng);
                        //标题--是否通过 0 不通过 1 通过
                        var passFlagHtml='';
                        if(item.passFlag=="1"){
                            passFlagHtml='通过<i class="fa fa-check-square green"></i>';
                        }
                        else{
                            passFlagHtml='不通过<i class="fa fa-window-close green4"></i>';
                        }
                        $parentMeetingIssue.find('[name="passFlag"]').empty().html(passFlagHtml);
                        //内容--议题信息
                        //是否听取意见
                        var adoptFlag=item.adoptFlag=="1"?'是':'否';
                        $parentMeetingIssue.find('[name="adoptFlag"]').empty().html(adoptFlag).attr('title',adoptFlag);
                        //列席人
                        var attendeeStr=item.attendeeStr?item.attendeeStr:'--';
                        $parentMeetingIssue.find('[name="attendeeStr"]').empty().html(attendeeStr).attr('title',attendeeStr);
                        //审议结果
                        var deliberationStr=item.deliberationStr?item.deliberationStr:'--';
                        $parentMeetingIssue.find('[name="deliberationStr"]').empty().html(deliberationStr).attr('title',deliberationStr);
                        //议题决议
                        var subjectResult=item.subjectResult?item.subjectResult:'--'
                        $parentMeetingIssue.find('[name="subjectResult"]').empty().html(subjectResult).attr('title',subjectResult);
                        //专项名称
                        var specialName=item.specialName?item.specialName:'--';
                        $parentMeetingIssue.find('[name="specialName"]').empty().html(specialName).attr('title',specialName);
                        //任务来源
                        var sourceName=item.sourceName?item.sourceName:'--';
                        $parentMeetingIssue.find('[name="sourceName"]').empty().html(sourceName).attr('title',sourceName);
                        //听取意见情况
                        uploadListIns.getUploadList(editMeetingId,'OPINION','听取意见情况',$parentMeetingIssue.find('[name="ytListens"]'));
                        //议题材料
                        uploadListIns.getUploadList(editMeetingId,'SUBJECT','议题材料',$parentMeetingIssue.find('[name="ytPapers"]'));
                        //内容--决策信息
                            // 对应事项清单和决策顺序 （可能有多个）
                            var itemMeetingOrder=item.itemList;
                            var tmp='';
                            if(itemMeetingOrder&&itemMeetingOrder.length>0){
                                $.map(itemMeetingOrder, function (item) {
                                    tmp+='<div>'+((!item.itemMeetingOrder||item.itemMeetingOrder=='null')?'--':item.itemMeetingOrder)+'</div>';
                                });
                            }
                            else{
                                tmp='<div style="color:#d30001">暂无数据</div>';
                            }
                            $parentMeetingIssue.find('[name="itemMeetingOrder"]').empty().html(tmp);
                            var realItemMeetingOrder=item.decisionSubjectList;
                            var subjectId=item.subjectId;
                            var tmp=''
                            if(realItemMeetingOrder&&realItemMeetingOrder.length>0){
                                $.map(realItemMeetingOrder, function (item, index) {
                                    tmp+=
                                    '<li>'+
                                    '    <span class="event-content '+(item.subjectId==subjectId?'bgOrangeBtn':'bgBlueBtn')+'" title="'+item.meetingTypeName+'">'+item.meetingTypeName+'</span>'+
                                    '    <b class="'+(item.subjectId==subjectId?'bgOrangePoint':'')+'"></b><span style="position:relative;bottom:30px;">'+(!item.meetingTime?'':common.dateCNFormat(item.meetingTime))+'</span>'+
                                    '</li>';
                                });
                            }
                            else{
                                tmp='--';
                            }
                            $parentMeetingIssue.find('[name="realItemMeetingOrder"]').empty().html(tmp);
                            // 决策异常
                            // $parentMeetingIssue.find('[name="abnormalities"]').empty().html(item.abnormalities).attr('title',item.abnormalities);//字符串
                            var subjectExceptionList=item.subjectExceptionList;
                            var abnormalitiesHtml='';
                            if(subjectExceptionList&&subjectExceptionList.length>0){
                                $.map(subjectExceptionList, function (item) {
                                    abnormalitiesHtml+='<div>'+item.exceptionDescript+'</div>';
                                });
                            }
                            else{
                                abnormalitiesHtml+='--';
                            }
                            $parentMeetingIssue.find('[name="abnormalities"]').empty().html(abnormalitiesHtml);
                            //组织实施时间轴
                            eventHandle.shishiTimeLine(item.subjectId);
                        });
                        $meetingIssueContainer.show();
                    }
                    else{
                        var html=
                        '<div class="gloEmptyBox emptyDataAreaSubject">'+
                        '    <img alt="" src="../../../images/emptyImg.png">'+
                        '    <span>暂无会议议题</span>'+
                        '</div>';
                        $meetingIssueContainer.empty().append(html).show();
                    }
            });
        },
         //组织实施时间轴
         shishiTimeLine: function (subjectId) {
            var html = '';
            var parent = $('.verticalTimeLine');
            parent.empty();
            common.fetchPost('sasmeetingmgr/tiolExecution/selectExectionAndDutyList', {
                subjectId: subjectId
            }, function (res) {

                var data = res.list || [];
                if (data.length > 0) {
                    $('.emptyTimeLine').hide();
                    $.map(data, function (item) {

                        //责任人 数据写入

                        // suId:$(item).attr('data-id'),
                        //     name: $(item).attr('data-name'),
                        //     soId: '',//部门id
                        //     organ: $(item).attr('data-organ'),
                        //     dutyId:$(item).attr('data-dutyId'),
                        //     executionId: curentexecutionId

                        var tiolDutyListHtml = '';
                        if (item.tiolDutyList && item.tiolDutyList.length > 0) {
                            $.map(item.tiolDutyList, function (dat) {
                                tiolDutyListHtml += '<div><div class="userHeader small-size" style="padding: 0">' +
                                    '                  <img src="../../../images/defaultUser.jpg">' +
                                    '              </div>' +
                                    '              <div style="display: inline-block">责任人：' + dat.name + '--\n' + (dat.dept ? dat.dept : '无') + '\n' +
                                    '              </div></div>\n';
                            });
                        } else {
                            tiolDutyListHtml = '<div style="height: 50px">无责任人</div>'
                        }
                        //时间进度写入
                        var timeFile = '';
                        common.fetchGet('dfsmgr/file/getFileByResIdAndFileType?id=' + item.executionId + '&type=timeFile', function (res) {

                            var data = res.list || [];

                            if (data.length > 0) {

                                $.map(data, function (item) {
                                    var fileName = item.fiName + '.' + item.fiSuffix;

                                    timeFile += '<div class="singleFileArea" data-fiId="' + item.fiId + '" fileName="' + fileName + '">' +
                                        '      <div class="fileSingleBox">\n' +
                                        '          <p class="fileName" title="' + fileName + '">' + fileName + '</p>\n' +
                                        '          <p>\n' +
                                        '              <i class="fa fa-file-text-o"></i><b\n' +
                                        '                  class="fileSize">' + common.bytesToSize(item.fiSize) + '</b>\n' +
                                        '          </p>\n' +
                                        '      </div>\n' +
                                        '  </div>';
                                });
                            }

                        }, false, false);

                        //正式文件写入
                        var zsFile = '';
                        common.fetchGet('dfsmgr/file/getFileByResIdAndFileType?id=' + item.executionId + '&type=formalFile', function (res) {

                            var data = res.list || [];

                            if (data.length > 0) {

                                $.map(data, function (item) {
                                    var fileName = item.fiName + '.' + item.fiSuffix;

                                    zsFile += '<div class="singleFileArea" data-fiId="' + item.fiId + '" fileName="' + fileName + '">' +
                                        '      <div class="fileSingleBox">\n' +
                                        '          <p class="fileName" title="' + fileName + '">' + fileName + '</p>\n' +
                                        '          <p>\n' +
                                        '              <i class="fa fa-file-text-o"></i><b\n' +
                                        '                  class="fileSize">' + common.bytesToSize(item.fiSize) + '</b>\n' +
                                        '          </p>\n' +
                                        '      </div>\n' +
                                        '  </div>';
                                });
                            }

                        }, false, false);




                        var statusHtml = '';
                        if (item.implementationStatus === "0") {
                            statusHtml = ' <div class="status status-done">启动</div></td>';
                        } else if (item.implementationStatus === "1") {
                            statusHtml = ' <div class="status status-done">执行</div></td>';
                        } else if (item.implementationStatus === "2") {
                            statusHtml = ' <div class="status status-done">完成</div></td>';
                        } else if (item.implementationStatus === "3") {
                            statusHtml = ' <div class="status status-ing">延期</div></td>';
                        } else if (item.implementationStatus === "4") {
                            statusHtml = ' <div class="status status-ing">停止</div></td>';
                        }

                        html += '<div class="timeItem" executionId="' + item.executionId + '">\n' +
                            '       <i class="lineIcon fa fa-send-o"></i>\n' +
                            '       <span class="time">' + common.dateFormat(item.startTime).substring(0, 10) + '</span>\n' +
                            '       <div class="content">\n' +
                            '           <table class="layui-table custom-table">\n' +
                            '               <tr>\n' +
                            '                   <td class="bg-f7" colspan="2" style="min-height: 50px">' + tiolDutyListHtml + statusHtml + '</td>\n' +
                            '                   <td rowspan="3" style="vertical-align: top;width: 140px">\n' +
                            '                       <div class="custom-title">时间进度</div>\n' +
                            '                       <div class="fileUploadList">\n' +
                            '                           <ul class="clearFix"style="border-bottom: none">' + timeFile + '</ul>\n' +
                            '                       </div>\n' +
                            '                       <div class="custom-title">正式文件</div>\n' +
                            '                       <div class="fileUploadList">\n' +
                            '                           <ul class="clearFix" style="border-bottom: none">' + zsFile + '</ul>\n' +
                            '                       </div>\n' +
                            '                   </td>\n' +
                            '               </tr>\n' +
                            '               <tr><td class="bg-f7" style="width: 100px">预期成效：</td><td>' + (item.effect ? item.effect : '--') + '</td></tr>' +
                            '               <tr><td class="bg-f7" style="width: 100px">实施情况：</td><td>' + (item.description ? item.description : '--') + '</td></tr>\n' +
                            '           </table></div>' +
                            '</div>';
                    });

                    parent.empty().html(html);


                } else {
                    $('.emptyTimeLine').show();
                }
            });
        },
        //接口值信息导入
        editDataInit: function () {
            //跨域通信中判断是否存在导入配置内容的值
            setTimeout(function () {
                if (!!editMeetingId) {//存在会议id
                    eventHandle.selectTiolMeetingById(editMeetingId);
                    eventHandle.selectYtList(editMeetingId,$('#meetingIssue0'),$('#meetingIssueContainer'));
                }
                else {//会议id不存在
                    layer.alert('会议id不存在');
                    return false;
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
