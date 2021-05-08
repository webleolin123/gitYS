/**

 @Name：清单明细
 @Author：gaoli

 */
layui.config({
    base: '../../../js/',
    version: new Date().getTime()
}).extend({}).use(
    ['eleTree', 'layer', 'laytpl', 'common', 'element'],
    function () {
        var common = layui.common;
        var element = layui.element;

        var isFlowAccess = common.getSystemFlowAccess();

        var eventHandle = {
            selectTiolMeetingFlowStateById: function (itemId) {//获取会议流程状态
                common.fetchGet('sasprocessmgr/businessEngineInfo/getBusinessEngineInfoByBusinessId?businessId=' + itemId, function (res) {
                    var obj = res.object || null;
                    if (obj) {
                        var sxDetailInfo=$('#sxDetailInfo');
                           //内容-业务流程状态信息
                        //流程名称
                        var flowName = obj.flowName!=null? obj.flowName : '-';
                        sxDetailInfo.find('[name="flowName"]').attr('title', flowName).html(flowName);
                        //办结状态
                        var flowState = obj.flowState!=null? (obj.flowState==2?'办结':'未办结') : '-';
                        sxDetailInfo.find('[name="flowState"]').attr('title', flowState).html(flowState);
                        if(obj.flowState!=null){
                            sxDetailInfo.find('[name="flowState"]').addClass('red4');
                        }
                        else{
                            sxDetailInfo.find('[name="flowState"]').removeClass('red4');
                        }
                        //当前环节
                        var flowStateName = obj.flowStateName!=null? obj.flowStateName : '-';
                        sxDetailInfo.find('[name="flowStateName"]').attr('title', flowStateName).html(flowStateName);
                        if(obj.flowStateName ){
                            sxDetailInfo.find('[name="flowStateName"]').addClass('green1');
                        }
                        else{
                            sxDetailInfo.find('[name="flowStateName"]').removeClass('green1');
                        }
                        //当前环节处理人
                        var todoUserName = obj.todoUserName!=null? obj.todoUserName : '-';
                        sxDetailInfo.find('[name="todoUserName"]').attr('title', todoUserName).html(todoUserName);
                        //上一环节
                        var formFlowStateName = obj.formFlowStateName!=null? obj.formFlowStateName : '-';
                        sxDetailInfo.find('[name="formFlowStateName"]').attr('title', formFlowStateName).html(formFlowStateName);
                        //上一环节意见
                        var handleOpinion = obj.handleOpinion!=null? obj.handleOpinion : '-';
                        sxDetailInfo.find('[name="handleOpinion"]').attr('title', handleOpinion).html(handleOpinion);
                        //起草人
                        var drafterName = obj.drafterName!=null? obj.drafterName : '-';
                        sxDetailInfo.find('[name="drafterName"]').attr('title', drafterName).html(drafterName);
                        //起草时间
                        var draftDatetime = obj.draftDatetime!=null? common.timestampToTime(obj.draftDatetime,'CN') : '-';
                        sxDetailInfo.find('[name="draftDatetime"]').attr('title', draftDatetime).html(draftDatetime);
                    }
                }, function () {
                    $('#flowBusinessDetail').hide();
                });
            },
            domEvent: function () {

                // //流程审批操作按钮
                // $('.operBtn').off().on('click', function () {
                //     layer.open({
                //         area: ['450px'],
                //         title: '审批',
                //         maxmin: false,
                //         type: 1,//页面层
                //         shadeClose: false,
                //         btnAlign: 'c',
                //         btn: ['确定', '取消'],
                //         content: '<div style="padding: 10px"><form class="layui-form"><div class="layui-form-item">\n' +
                //             '                    <label class="layui-form-label">审批意见：</label>\n' +
                //             '                    <div class="layui-input-block">\n' +
                //             '            <textarea class="layui-textarea" placeholder="请输入审批意见"></textarea>            ' +
                //             '                    </div>\n' +
                //             '                </div></form></div>',
                //         success: function (obj) {
                //         },
                //
                //     });
                // });
                // //办结
                // $('.idDone').off().on('click', function () {
                //     layer.confirm('是否办结', {icon: 3, title: '提示', offset: '150px'}, function (index) {
                //         layer.close(index);
                //
                //     });
                // });

            },
            //状态位
            statusIndex: function (ggDelStatus, ggEnStatus, invalidDate) {
                // 1:删除 2：有效 3：未生效 4：已失效
                var index = null;

                if (ggEnStatus === "0") {
                    index = 3
                }
                if (ggEnStatus === "1") {
                    index = 2
                }

                if (ggDelStatus === "1") {//已删除
                    index = 1;
                }

                if (invalidDate < new Date().getTime()) {
                    index = 4
                }
                return index;
            },

            pageLoad: function () {
                $('#tabContainer').css('minHeight', ($(document).height() - 500) + 'px');//定容器最小高度

                if (!isFlowAccess) {
                    $('.ydListTab').hide();
                    $('.systemFlowSetArea').hide();
                }

                element.init();
                common.themeSet();
                common.buttonLimit();
                common.columnSide();
                common.dataAccessReloadModule({});
                //事项信息
                common.fetchGet('catalog/tiolItem/selectTiolItemInfoById?id=' + common.getQueryVariable('itemId'), function (res) {
                    if (res.success) {
                        var data = res.object;
                        $('[name=itemName]').text(data.itemName ? data.itemName : '-');
                        $('[name=itemCode]').text(data.itemCode ? data.itemCode : '-');
                        $('[name=catalogChar]').text(data.catalogChar ? data.catalogChar : '-');

                        $('[name=itemMeetingOrder]').text(data.itemMeetingOrder ? data.itemMeetingOrder : '-');
                        $('[name=ggCreateUser]').text(data.ggCreateUser ? data.ggCreateUser : '-');
                        $('[name=ggUpdateUser]').text(data.ggUpdateUser ? data.ggUpdateUser : '-');
                        $('[name=ggCreateDatetime]').text(common.dateFormat(data.ggCreateDatetime,'yyyy年MM月dd日 HH时mm分ss秒'));
                        $('[name=ggUpdateDatetime]').text(common.dateFormat(data.ggUpdateDatetime,'yyyy年MM月dd日 HH时mm分ss秒'));
                        $('[name=ggCreateEname]').text(data.ggCreateEname ? data.ggCreateEname : '-');
                        $('[name=ggUpdateEname]').text(data.ggUpdateEname ? data.ggUpdateEname : '-');
                        $('[name=legalFlag]').text(data.legalFlag === '1' ? '是' : '否');
                        $('[name=itemStatus]').text(eventHandle.statusIndex(data.ggDelStatus, data.ggEnStatus, data.invalidDate));

                        $('[name=uploadStatusCn]').text(data.uploadStatusCn ? data.uploadStatusCn : '-');
                        $('[name=operTypeCn]').text(data.operTypeCn ? data.operTypeCn : '-');
                        $('[name=qiyeName]').text(common.getUserInfo().seName);

                        if (isFlowAccess) {
                            //流程引擎处理
                            common.flowEngineStep({
                                busType: 'item',
                                elem: $('#flowStepBox'),
                                businessId: common.getQueryVariable('itemId'),
                                ggCreateEid: data.ggCreateEid,
                                showIframe: $('#iframeShowFlow'),
                                flowState: data.flowState,
                                showIframeHeight: $(window).height() - 100 + 'px',
                                businessUrl: 'catalog/catalogEngine/updateBusinessInfo',
                                reportUrl: 'catalog/tiolItemList/reportItemList',
                                reportParam: 'listIds',
                                reportParamData: data.itemListId
                            });
                            //流程日志导入
                            // common.flowLogDataSet($('#flowLogDataSet'), common.getQueryVariable('itemId'));
                        }

                        //清单信息
                        common.fetchGet('catalog/tiolItemList/selectTiolItemById?id=' + data.itemListId, function (res1) {
                            var data1 = res1.object;
                            if (!$.isEmptyObject(data)) {
                                $('.listVersion').text(data1.listVersion);
                                if(data1.remark && data1.remark != null){
                                    $('.remark').text(data1.remark);
                                }
                                $('.listName').text(data1.listName ? data1.listName : '-');
                                $('.seName').text(data1.seName ? data1.seName : '-');
                                $('.flowName').text(data1.flowName ? data1.flowName : '-');
                                $('.operTypeCn').text(data1.operTypeCn ? data1.operTypeCn : '-');
                                if(data1.operTypeCn){
                                    $('.operTypeCn').addClass('red4');
                                }
                                else{
                                    $('.operTypeCn').removeClass('red4');
                                }
                                $('.uploadStatusCn').text(data1.uploadStatusCn ? data1.uploadStatusCn : '-');
                                if(data1.uploadStatusCn){
                                    $('.uploadStatusCn').addClass('red4');
                                }
                                else{
                                    $('.uploadStatusCn').removeClass('red4');
                                }
                                $('.effectiveDate').text(common.dateFormat(data1.effectiveDate,'yyyy年MM月dd日'));
                                $('.invalidDate').text(common.dateFormat(data1.invalidDate,'yyyy年MM月dd日'));
                                $('.ggCreateDatetime').text(common.dateFormat(data1.ggCreateDatetime,'yyyy年MM月dd日 HH时mm分ss秒'));
                                $('.ggUpdateDatetime').text(common.dateFormat(data1.ggUpdateDatetime,'yyyy年MM月dd日 HH时mm分ss秒'));
                            } else {
                                layer.msg('数据返回错误');
                            }
                        });
                    }
                });

                if (isFlowAccess) {
                    eventHandle.selectTiolMeetingFlowStateById(common.getQueryVariable('itemId'));
                }
            }
        };

        eventHandle.pageLoad();
        eventHandle.domEvent();


    });
