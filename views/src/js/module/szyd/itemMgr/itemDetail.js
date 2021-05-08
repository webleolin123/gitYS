/**

 @Name：清单明细
 @Author：gaoli

 */
layui.config({
    base: '../../../js/',
    version: new Date().getTime()
}).extend({}).use(
    ['eleTree', 'layer', 'table', 'carousel', 'form', 'laytpl', 'common', 'element', 'laydate', 'upload'],
    function () {
        var table = layui.table;
        var form = layui.form;
        var common = layui.common;
        var element = layui.element;
        var laydate = layui.laydate;
        var upload = layui.upload;
        var carousel = layui.carousel;

        var itemListSelectedList = [];
        var itemListMap = {};

        var baseUrl = '../../../';

        var eventHandle = {

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
                element.init();
                common.themeSet();

                common.buttonLimit();
                common.columnSide();

                common.dataAccessReloadModule({});


                //事项信息
                common.fetchGet('catalog/tiolItem/selectTiolItemById?itemId=' + common.getQueryVariable('itemId'), function (res) {
                    if (res.success) {
                        var data = res.object;
                        $('.itemName').text(data.itemName);
                        $('.itemCode').text(data.itemCode);
                        $('.itemMeetingOrder').text(data.itemMeetingOrder);
                        $('.ggCreateUser').text(data.ggCreateUser);
                        $('.ggUpdateUser').text(data.ggUpdateUser);
                        $('.ggCreateDatetime').text(data.ggCreateDatetime);
                        $('.ggCreateEname').text(data.ggCreateEname);
                        $('.ggUpdateEname').text(data.ggUpdateEname);
                        $('.legalFlag').text(data.legalFlag === '1' ? '是' : '否');
                        $('.itemStatus').text(eventHandle.statusIndex(data.ggDelStatus, data.ggEnStatus, data.invalidDate));

                        $('.qiyeName').text(common.getUserInfo().seName);


                        //流程引擎处理
                        common.flowEngineStep({
                            elem: $('#flowStepBox'),
                            businessId: common.getQueryVariable('itemId'),
                            ggCreateEid: data.ggCreateEid,
                            showIframe: $('#iframeShowFlow'),
                            flowState: data.flowState,
                            showIframeHeight: $(window).height() - 100 + 'px',
                            businessUrl: 'sascatalog/catalogEngine/updateBusinessInfo'
                        });
                        //流程日志导入
                        // common.flowLogDataSet($('#flowLogDataSet'), common.getQueryVariable('itemId'));

                        //清单信息
                        common.fetchGet('sascatalog/tiolItemList/selectTiolItemById?id=' + data.tails.itemListId, function (res1) {
                            var data1 = res1.object;
                            if (!$.isEmptyObject(data)) {

                                $('.listVersion').text(data1.listVersion);
                                $('.remark').text(data1.remark);
                                $('.listName').text(data1.listName);
                                $('.ggCreateDatetime').text(common.dateFormat(data1.ggCreateDatetime));
                                $('.ggUpdateDatetime').text(common.dateFormat(data1.ggUpdateDatetime));

                            } else {
                                layer.msg('数据返回错误');
                            }

                        });


                    }


                });

            }
        };

        eventHandle.pageLoad();
        eventHandle.domEvent();


    });
