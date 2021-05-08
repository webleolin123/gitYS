/**

 @Name：上报监控
 @Author：gaoli

 */
layui.config({
    base: '../../../js/',
    version: new Date().getTime()
}).extend({}).use(
    ['eleTree', 'layer', 'table', 'carousel', 'form', 'laytpl', 'laypage', 'common', 'element', 'laydate', 'upload'],
    function () {
        var table = layui.table;
        var form = layui.form;
        var common = layui.common;
        var element = layui.element;
        var laydate = layui.laydate;
        var upload = layui.upload;
        var carousel = layui.carousel;
        var tree = layui.eleTree;
        var laypage = layui.laypage;

        var seId = null;
        var isChild;

        var baseUrl = '../../../../';
        var reportTableSet;

        var eventHandle = {

            domEvent: function () {
                //确认上报

                $('#reportBtn').off().on('click', function () {
                    common.fetchPost('sasmeetingmgr/statistics/reportStatistics', {
                        // isChild: isChild,
                        // seId: seId
                    }, function (res) {
                        if (res.success) {
                            layer.msg('上报成功');
                        }
                    });
                });
                $('#searchTree').off().on('keypress', function (event) {
                    if (event.keyCode == "13") {
                        // leftTree.reload()
                    }
                });

                $('#cardBtn').off().on('click', function () {
                    $(this).siblings().removeClass('selected');
                    $(this).addClass('selected');
                    $('.carTab').fadeIn();
                    $('.listTab').fadeOut();
                })
                $('#listBtn').off().on('click', function () {
                    $(this).siblings().removeClass('selected');
                    $(this).addClass('selected');
                    $('.listTab').fadeIn();
                    $('.carTab').fadeOut();
                })
            },


            //列表形式
            reportTableLine: function (objSet) {
                //表格加载
                if (!reportTableSet) {
                    table.render(common.tableInitParams({
                        elem: '#reportTable',
                        url: baseUrl + 'sasmeetingmgr/statistics/selectIndexTable',
                        method: 'post',
                        height: '620',
                        toolbar: '',
                        cols: [
                            [
                                {type: 'numbers', title: '排序'},
                                {field: 'companyname', title: '企业', sort: true, minWidth: 120},
                                {field: 'reportstatus', title: '上报状态', sort: true, minWidth: 120},
                                {field: 'regulationcount', title: '决策制度', sort: true, width: 110},
                                {field: 'itemcount', title: '事项清单', sort: true, width: 110},
                                {field: 'meetingcount', title: '决策会议', sort: true, width: 110},
                                {field: 'subjectcount', title: '审议议题', sort: true, width: 110},
                                {field: 'executioncount', title: '组织实施', sort: true, width: 110},
                                {field: 'exceptioncount', title: '异常情况', sort: true, width: 110},
                                {field: 'ycqksjyts', title: '整改率', sort: true, width: 110}
                            ]
                        ],
                        where: {
                            reportStatus: (objSet && objSet.reportStatus) ? objSet.reportStatus : 'all',
                            searchTime: (objSet && objSet.searchTime) ? objSet.searchTime : '',
                            seId: seId,
                            isChild: (objSet) ? objSet.isChild : 'true'
                        },
                        done: function () {

                        }
                    }))
                } else {
                    table.reload('regularReportList', {
                        page: {
                            curr: 1
                        }
                    });
                }
            },
            //卡片形式
            reportCardLine: function (objSet) {

                function pageDataSet(data) {
                    var html = '';

                    $('.panel-3 ul').empty();
                    if (data.length > 0) {
                        $('.emptyDataArea').hide();
                        $.map(data, function (item) {
                            var statusHtml = '';
                            if (item.reportStatus === 1) {
                                statusHtml = '<div class="status status-success">已上报</div>';
                            } else if (item.reportStatus === 0) {
                                statusHtml = '<div class="status status-danger">未上报</div>';
                            } else {
                                statusHtml = '<div class="status status-danger">未上报</div>';
                            }
                            html += '<li>\n' +
                                '       <div>\n' +
                                '           <div>' + statusHtml + '<div class="title">' + item.companyname + '</div>\n' +
                                // '               <div class="time">上报时间：-</div>\n' +
                                '               <div class="desList">\n' +
                                '                   <ul class="clearFix">\n' +
                                '                       <li>\n' +
                                '                           <span class="primary number regulationNum">' + item.regulationcount + '</span>\n' +
                                '                           <span class="text">决策制度</span>\n' +
                                '                       </li>\n' +
                                '                       <li>\n' +
                                '                           <span class="primary number itemNum">' + item.itemcount + '</span>\n' +
                                '                           <span class="text">事项清单</span>\n' +
                                '                       </li>\n' +
                                '                       <li>\n' +
                                '                           <span class="primary number meetingNum">' + item.meetingcount + '</span>\n' +
                                '                           <span class="text">决策会议</span>\n' +
                                '                       </li>\n' +
                                '                       <li style="border-right: none ">\n' +
                                '                           <span class="primary number subjectNum">' + item.subjectcount + '</span>\n' +
                                '                           <span class="text">审议议题</span>\n' +
                                '                       </li>\n' +
                                '                       <li>\n' +
                                '                           <span class="primary number executionNum">' + item.executioncount + '</span>\n' +
                                '                           <span class="text">组织实施</span>\n' +
                                '                       </li>\n' +
                                '                       <li>\n' +
                                '                           <span class="primary number exceptionNum">' + item.exceptioncount + '</span>\n' +
                                '                           <span class="text">异常情况</span>\n' +
                                '                       </li>\n' +
                                '                       <li>\n' +
                                '                           <span class="warning number rate">' + item.rate + '</span>\n' +
                                '                           <span class="text">整改率</span>\n' +
                                '                       </li>\n' +
                                '                   </ul>\n' +
                                '               </div>\n' +
                                '           </div>\n' +
                                '       </div>\n' +
                                '   </li>'
                        });

                        $('.panel-3 ul').empty().html(html);
                    } else {
                        $('.emptyDataArea').show();
                    }
                }

                var dataLength;
                common.fetchPost('sasmeetingmgr/statistics/selectIndexTable', {
                    reportStatus: (objSet && objSet.reportStatus) ? objSet.reportStatus : 'all',
                    searchTime: (objSet && objSet.searchTime) ? objSet.searchTime : null,
                    isChild: (objSet) ? objSet.isChild : 'true',
                    pageNum: 1,
                    seId: seId,
                    pageSize: 10
                }, function (res) {
                    dataLength = res.page.total;

                }, function () {

                }, false);


                laypage.render({
                    elem: 'panel3Page',
                    count: dataLength,
                    limits: true,
                    jump: function (obj, first) {
                        common.fetchPost('sasmeetingmgr/statistics/selectIndexTable', {
                            reportStatus: (objSet && objSet.reportStatus) ? objSet.reportStatus : 'all',
                            searchTime: (objSet && objSet.searchTime) ? objSet.searchTime : null,
                            pageNum: obj.curr,
                            pageSize: obj.limit,
                            seId: seId,
                            isChild: (objSet) ? objSet.isChild : 'true'
                        }, function (res) {

                            pageDataSet(res.page.list);
                        }, function () {

                        }, false);
                    }
                });


            },

            //统计总数
            totalSet: function () {

                $('.panel-2 number').text('-');
                common.fetchPost('sasmeetingmgr/statistics/selectIndexTableAllCount', {
                    seId: seId
                }, function (res) {
                    if (res.success) {
                        var data = res['list'][0];
                        //数据清空

                        if (data) {
                            //数据写入
                            $('.exceptionsum').text((data.exceptionsum != null) ? data.exceptionsum : '-');
                            $('.executionsum').text((data.executionsum != null) ? data.executionsum : '-');
                            $('.itemsum').text((data.itemsum != null) ? data.itemsum : '-');
                            $('.meetingsum').text((data.meetingsum != null) ? data.meetingsum : '-');
                            $('.regulationsum').text((data.regulationsum != null) ? data.regulationsum : '-');
                            $('.subjectsum').text((data.subjectsum != null) ? data.subjectsum : '-');
                            $('#rate').text((data.rate != null) ? (data.rate) : '-');
                            $('.numCount').text(data.noreport);
                            $('.willreport').text(data.willreport);
                            $('.isreport').text(data.isreport);
                            $('.noreport').text(data.noreport);
                            $('.ishaveDecItemCount').text(data.ishaveDecItemCount);
                            $('.ishaveDecPowerCount').text(data.ishaveDecPowerCount);

                        }
                    } else {
                        layer.alert(res.resultMessage);
                    }

                });

            },

            pageLoad: function () {
                element.init();
                common.themeSet();

                common.buttonLimit();
                common.columnSide();

                common.dataAccessReloadModule({});

                laydate.render({
                    elem: '[name=date1]',
                    type: 'date',
                    range: true,
                    trigger: 'click'
                });

                form.render('switch');
                var leftTree = tree.render({
                    showLine: true,
                    elem: '#leftTree',
                    // expandOnClickNode: false,
                    url: baseUrl + 'sysmgr/sysEnterprise/selectSysEnterpriseOrganPostTreeAllList?treeType=enterpriseTree',
                    done: function () {
                        // $('#leftTree .eleTree-node-content').each(function () {
                        //     $(this).click();
                        // });

                        //默认第一条点击
                        $('#leftTree').find('.eleTree-node-content-label').eq(0).trigger('click');
                        // $('#leftTree').find('.eleTree-node-content-icon').eq(0).trigger('click');

                    },
                    lazy: true,
                    load: function (data, callback) {
                        common.fetchGet(baseUrl + 'sysmgr/sysEnterprise/selectSysEnterpriseOrganPostTreeAllList?treeType=enterpriseTree' + '&id=' + data.id + "&extendAttr=" + data.extendAttr, function (res) {
                            if (res.success && res.list) {
                                callback(res.list);
                            }
                        }, function () {
                            callback([])
                        });

                    },
                    response: {// 对于后台数据重新定义名字
                        dataName: "list"
                    },
                });
                tree.on("nodeClick(leftTree)", function (obj) {


                    if (obj.data.index[0] === 0 && obj.data.index[1] === undefined) {
                        $('#reportBtn').show()
                    } else {
                        $('#reportBtn').hide()
                    }

                    seId = obj.data.currentData.id;
                    $('.mainTitle').text(obj.data.currentData.name);

                    //统计总数
                    eventHandle.totalSet();

                    //分页数据导入
                    eventHandle.reportTableLine();

                    eventHandle.reportCardLine();


                });
                $('#leftTree').css({'height': $(window).height() - 160 + 'px'});

                //搜索
                form.on('submit(formSearch)', function (obj) {


                    var params = {
                        reportStatus: $('[name=form-row]:checked').val(),
                        searchTime: $('[name=date1]').val(),
                        isChild: isChild
                    };

                    //分页数据导入
                    eventHandle.reportTableLine(params);

                    eventHandle.reportCardLine(params);


                    return false;
                });

                //是否包含下级切换
                form.on('switch(switch)', function (data) {
                    if (data.elem.checked) {
                        isChild = 'true';
                        eventHandle.reportTableLine({
                            reportStatus: $('[name=form-row]:checked').val(),
                            searchTime: $('[name=date1]').val(),
                            isChild: 'true'
                        });
                        eventHandle.reportCardLine({
                            reportStatus: $('[name=form-row]:checked').val(),
                            searchTime: $('[name=date1]').val(),
                            isChild: 'true'
                        });


                    } else {
                        isChild = 'false';
                        eventHandle.reportCardLine({
                            reportStatus: $('[name=form-row]:checked').val(),
                            searchTime: $('[name=date1]').val(),
                            isChild: 'false'
                        });
                        eventHandle.reportCardLine({
                            reportStatus: $('[name=form-row]:checked').val(),
                            searchTime: $('[name=date1]').val(),
                            isChild: 'false'
                        });
                    }
                });
            }
        };

        eventHandle.pageLoad();
        eventHandle.domEvent();


    });
