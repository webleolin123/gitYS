layui.config({
    base: '../../../../src/js/',
    version: new Date().getTime()
}).extend({
    treeGrid: 'treeGrid'
}).use(['eleTree', 'layer', 'table', 'laydate', 'form', 'laytpl', 'common', 'element'], function () {
    var table = layui.table;
    var form = layui.form;
    var tree = layui.eleTree;
    var common = layui.common;
    var element = layui.element;
    var util = layui.util;
    var laydate = layui.laydate;
    var fileIframe = null;
    element.init();
    var baseUrl = '../../../../';
    common.themeSet();
    laydate.render({
        elem: "#dateBegin"
    });
    laydate.render({
        elem: "#dateEnd"
    });


    // var getEntLevelRelation=common.getEntLevelRelation();//企业层级关系查询权限

    //企业层级
    // common.getEntLevel($('#entLevelBox'),function () {

    //     form.render();
    // });

    // //企业层级关系查询条件 getEntLevelRelation
    // common.getEntLevelRelationHtml(function () {
    //     form.render();
    // });

    common.toggleArea($('.toggle-btn'), $('.toggle-area'));
    layui.use('treeGrid', function () {
        var tableId = 'indexTable';
        var treeGrid = layui.treeGrid;

        function getColsData() {
            var cols1 = [];
            var title = [], lineTree = [];
            common.fetchPost("meetingmgr/statistics/selectIndexTableCols", { uploadStatus: $('[name=form-row]:checked').val() }, function (result) {

                title.push({
                    field: 'meetingcount', rowspan: 2, title: '累计', templet: function (rowData) {
                        return '<span class="a-link huiyi" data-seId="' + rowData.seId + '" data-name="累计" meetingTypeId="">' + rowData.meetingcount + '</span>'
                    }
                });
                // title.push({
                //     field: 'meetingTime', rowspan: 2, title: '会议时间', templet: function (rowData) {
                //         return (rowData.meetingTime ? rowData.meetingTime : '-');
                //     }
                // });
                if (result != null && result.list.length > 0) {

                    $.map(result.list, function (item) {
                        /*    item.minWidth=20 *item.title.length;
                            item.templet=function(rowData){
                                return '<span class="a-link huiyi" data-seId="'+rowData.seId+'" data-name="'+item.title+'" meetingTypeId="'+item.field+'">'+rowData[item.field]+'</span>'
                            };
                            title.push(item);*/
                        title.push({ align: 'center', title: item.title, colspan: 2, width: (((20 * (item.title).length) > 120) ? 20 * (item.title).length : 120) });
                        lineTree.push({
                            align: 'center', title: '期数', width: (((10 * (item.title).length) > 60) ? 10 * (item.title).length : 60), field: item.field, templet: function (rowData) {
                                return '<span class="a-link huiyi" data-seId="' + rowData.seId + '" data-name="' + item.title + '" meetingTypeId="' + item.field + '">' + (rowData[item.field] ? rowData[item.field] : '0') + '</span>'
                            }
                        });
                        lineTree.push({
                            align: 'center', title: '议题数', field: 'subject-' + item.field, width: (((10 * (item.title).length) > 60) ? 10 * (item.title).length : 60), templet: function (rowData) {
                                return '<span class="a-link huiyiYiti" data-seId="' + rowData.seId + '" data-name="' + item.title + '" meetingTypeId="' + item.field + '">' + (rowData['subject-' + item.field] ? rowData['subject-' + item.field] : '0') + '</span>'

                            }
                        });
                    });

                }

                // title.push({
                //     field: 'subjectcount', rowspan: 2, title: '累计', width: 80, templet: function (rowData) {
                //         return '<span class="a-link yiti" data-seId="' + rowData.seId + '" data-name="累计" data-catalogChar="">' + rowData.subjectcount + '</span>'
                //     }
                // });
                // title.push({
                //     field: 'jcytzdjc', rowspan: 2, title: '重大决策', width: 100, templet: function (rowData) {
                //         return '<span class="a-link yiti" data-seId="' + rowData.seId + '" data-name="重大决策" data-catalogChar="D">' + rowData.jcytzdjc + '</span>'
                //     }
                // });
                // title.push({
                //     field: 'jcytzyrsrm', rowspan: 2, title: '重要人事任免', width: 120, templet: function (rowData) {
                //         return '<span class="a-link yiti" data-seId="' + rowData.seId + '" data-name="重要人事任免" data-catalogChar="H">' + rowData.jcytzyrsrm + '</span>'
                //     }
                // });
                // title.push({
                //     field: 'jcytzdxmap', rowspan: 2, title: '重大项目安排', width: 120, templet: function (rowData) {
                //         return '<span class="a-link yiti" data-seId="' + rowData.seId + '" data-name="重大项目安排" data-catalogChar="P">' + rowData.jcytzdxmap + '</span>'
                //     }
                // });
                // title.push({
                //     field: 'jcytdezjyz', rowspan: 2, title: '大额度资金运作', width: 130, templet: function (rowData) {
                //         return '<span class="a-link yiti" data-seId="' + rowData.seId + '" data-name="大额度资金运作" data-catalogChar="F">' + rowData.jcytdezjyz + '</span>'
                //     }
                // });
                title.push({
                    field: 'ycqksjyts', rowspan: 2, title: '涉及议题数', width: 120, templet: function (rowData) {
                        return '<span class=" ">' + rowData.ycqksjyts + '</span>'
                    }
                });
                title.push({
                    field: 'exceptioncount', rowspan: 2, title: '异常数', width: 100, templet: function (rowData) {
                        return '<span class="a-link yichang" data-seId="' + rowData.seId + '">' + rowData.exceptioncount + '</span>'
                    }
                });
                cols1 = [[{
                    fixed: 'left', field: 'seName', title: '企业名称', rowspan: 3, minWidth: 250, templet: function (rowData) {
                        return '<span title="' + rowData.seName + '">' + rowData.seName + '</span>'
                    }
                }
                    , {
                        field: 'regulationcount', title: '决策制度', rowspan: 3, minWidth: 100, templet: function (rowData) {
                            return '<span class="a-link jczd" data-seId="' + rowData.seId + '">' + rowData.regulationcount + '</span>'
                        }
                }
                    , {
                        field: 'itemcount', title: '议案类别', rowspan: 3, minWidth: 100, templet: function (rowData) {
                            return '<span class="a-link sxqd" data-seId="' + rowData.seId + '">' + rowData.billtypecount + '</span>'
                        }
                }
                    , { align: 'center', title: '决策会议', colspan: ((result.list.length * 2) + 1) || 1 }
                    // , { align: 'center', title: '决策议题', colspan: 5 }
                    , {
                        field: 'executioncount', title: '议案执行', rowspan: 3, minWidth: 100, templet: function (rowData) {
                            return '<span class="a-link shishi" data-seId="' + rowData.seId + '">' + rowData.executioncount + '</span>'
                        }
                }
                    , { align: 'center', title: '异常情况', colspan: 2, minWidth: 100 }], title, lineTree];

            }, function (res) {
                layer.alert(res.resultMessage);
            }, false);

            return cols1;
        }

        var cols = getColsData();


        var paramsGridTable = {
            uploadStatus: $('[name=form-row]:checked').val()
        };
        // if(getEntLevelRelation){
        //     paramsGridTable.hdLevel=$('[name=hdLevel]:checked').val()
        // }

        treeGrid.render({
            id: tableId
            , elem: '#' + tableId
            , url: baseUrl + "meetingmgr/statistics/selectSynctIndexTable"
            // ,cellMinWidth: 100
            , idField: 'seId'//必須字段
            , where: paramsGridTable
            , cellMinWidth: 100
            , treeId: 'seId'//树形id字段名称
            , treeUpId: 'sePid'//树形父id字段名称
            , treeShowName: 'seName'//以树形式显示的字段
            // ,heightRemove:[".dHead",10]//不计算的高度,表格设定的是固定高度，此项不生效
            , isFilter: false
            , iconOpen: false//是否显示图标【默认显示】
            , isOpenDefault: true//节点默认是展开还是折叠【默认展开】
            , loading: true
            , excelUrl: baseUrl + "meetingmgr/statistics/exportIndexTable"
            , method: 'post'
            , isPage: false
            , cols: cols
            , parseData: function (res) {//数据加载后回调
                if (res.page) {
                    return {
                        "code": 0, //解析接口状态
                        "msg": res.resultMessage, //解析提示文本
                        "count": res.page.total, //解析数据长度
                        "data": res.page.list //解析数据列表
                    };
                } else {
                    return {
                        "code": 0,
                        "msg": '',
                        "count": res.list ? res.list.length : 0,
                        "data": res.list
                    };
                }
            }
        });

        $('body').append("<style>.treeTable{height: " + ($(window).height() - 120) + "px !important;} " +
            ".layui-table-body{height: " + ($(window).height() - 350) + "px !important;}" +
            "</style>");


        $('#indexSeleteCommit').off().on('click', function () {
            //时间校验
            if (new Date($('#dateBegin').val()).getTime() > new Date($('#dateEnd').val()).getTime()) {
                layer.msg('结束时间不能小于开始时间');
                return false;
            }

            var params = {
                seName: $('#indexSeleteQymc').val(),
                // nearlyDay: $('#indexSeleteTime').val(),
                uploadStatus: $('[name=form-row]:checked').val(),
                startTime: $('#dateBegin').val(),
                endTime: $('#dateEnd').val(),
                entLevel: $('[name=entLevel]:checked').val(),
                isChild: $('[name=switch]')[0].checked ? 'true' : 'false',
            };
            // if(getEntLevelRelation){
            //     params.hdLevel=$('[name=hdLevel]:checked').val()
            // }

            treeGrid.render({
                id: tableId
                , elem: '#' + tableId
                , url: baseUrl + "meetingmgr/statistics/selectSynctIndexTable"
                // ,cellMinWidth: 100
                , idField: 'seId'//必須字段
                , where: params
                , treeId: 'seId'//树形id字段名称
                , treeUpId: 'sePid'//树形父id字段名称
                , treeShowName: 'seName'//以树形式显示的字段
                // ,heightRemove:[".dHead",10]//不计算的高度,表格设定的是固定高度，此项不生效
                , isFilter: false
                , iconOpen: false//是否显示图标【默认显示】
                , isOpenDefault: true//节点默认是展开还是折叠【默认展开】
                , loading: true
                , cellMinWidth: 100
                , excelUrl: baseUrl + "meetingmgr/statistics/exportIndexTable"
                , method: 'post'
                , isPage: false
                , cols: cols
                , parseData: function (res) {//数据加载后回调
                    if (res.page) {
                        return {
                            "code": 0, //解析接口状态
                            "msg": res.resultMessage, //解析提示文本
                            "count": res.page.total, //解析数据长度
                            "data": res.page.list //解析数据列表
                        };
                    } else {
                        return {
                            "code": 0,
                            "msg": '',
                            "count": res.list ? res.list.length : 0,
                            "data": res.list
                        };
                    }
                }
            });
            return false
        });
        $('#exportBtn').off().on('click', function () {

            if (!fileIframe) {
                fileIframe = document.createElement("iframe");
                document.body.appendChild(fileIframe);
                fileIframe.style.display = "none";
            }
            fileIframe.src = baseUrl + "meetingmgr/statistics/exportIndexTable?endTime=" + $('#dateEnd').val() + '&hdLevel=' + $('[name=hdLevel]:checked').val() + '&entLevel=' + ($('[name=entLevel]:checked').val() ? $('[name=entLevel]:checked').val() : '') + '&startTime=' + $('#dateBegin').val() + '&seName=' + $('#indexSeleteQymc').val() + '&uploadStatus=' + $('[name=form-row]:checked').val() + '&isChild=' + ($('[name=switch]')[0].checked ? 'true' : 'false')

        });

        $('#indexSeleteReset').click(function () {
            $('#indexSeleteQymc').val('');
            $('#indexSeleteTime').val('');
        });


        //弹层处理
        $(document).off('click', '.jczd');
        $(document).on('click', '.jczd', function () {
            var currentSeId = $(this).attr('data-seId');
            common.tableLayerInitData({
                title: '决策制度',
                type: 'jczd',
                where: {
                    seName: $('#indexSeleteQymc').val(),
                    uploadStatus: $('[name=form-row]:checked').val(),
                    startTime: $('#dateBegin').val(),
                    endTime: $('#dateEnd').val(),
                    hdLevel: $('[name=hdLevel]:checked').val(),
                    entLevel: $('[name=entLevel]:checked').val(),
                    isIncludeChild: $('[name=switch]')[0].checked ? 'true' : 'false',
                    pageSource: 'statisticsTable',
                    seId: currentSeId
                }
            })
        });
        $(document).off('click', '.sxqd');
        $(document).on('click', '.sxqd', function () {
            var currentSeId = $(this).attr('data-seId');
            common.tableLayerInitData({
                title: '议案类别',
                type: 'sxqd',
                where: {
                    seName: $('#indexSeleteQymc').val(),
                    uploadStatus: $('[name=form-row]:checked').val(),
                    startTime: $('#dateBegin').val(),
                    endTime: $('#dateEnd').val(),
                    hdLevel: $('[name=hdLevel]:checked').val(),
                    entLevel: $('[name=entLevel]:checked').val(),
                    isIncludeChild: $('[name=switch]')[0].checked ? 'true' : 'false',
                    pageSource: 'statisticsTable',
                    seId: currentSeId
                }
            })
        });
        $(document).off('click', '.huiyi');
        $(document).on('click', '.huiyi', function () {
            var name = $(this).attr('data-name');
            var currentSeId = $(this).attr('data-seId');
            var meetingTypeId = $(this).attr('meetingTypeId');
            common.tableLayerInitData({
                title: '决策会议-' + name,
                type: 'huiyi',
                where: {
                    meetingTypeId: meetingTypeId,
                    seName: $('#indexSeleteQymc').val(),
                    uploadStatus: $('[name=form-row]:checked').val(),
                    startTime: $('#dateBegin').val(),
                    endTime: $('#dateEnd').val(),
                    hdLevel: $('[name=hdLevel]:checked').val(),
                    entLevel: $('[name=entLevel]:checked').val(),
                    isIncludeChild: $('[name=switch]')[0].checked ? 'true' : 'false',
                    pageSource: 'statisticsTable',
                    seId: currentSeId
                }
            })
        });
        $(document).off('click', '.huiyiYiti');
        $(document).on('click', '.huiyiYiti', function () {
            var name = $(this).attr('data-name');
            var currentSeId = $(this).attr('data-seId');
            var meetingTypeId = $(this).attr('meetingTypeId');
            common.tableLayerInitData({
                title: '决策议题-' + name,
                type: 'yiti',
                where: {
                    meetingTypeId: meetingTypeId,
                    seName: $('#indexSeleteQymc').val(),
                    uploadStatus: $('[name=form-row]:checked').val(),
                    startTime: $('#dateBegin').val(),
                    endTime: $('#dateEnd').val(),
                    hdLevel: $('[name=hdLevel]:checked').val(),
                    entLevel: $('[name=entLevel]:checked').val(),
                    isIncludeChild: $('[name=switch]')[0].checked ? 'true' : 'false',
                    pageSource: 'statisticsTable',
                    seId: currentSeId
                }
            })
        });


        $(document).off('click', '.yiti');
        $(document).on('click', '.yiti', function () {
            var name = $(this).attr('data-name');
            var currentSeId = $(this).attr('data-seId');
            var catalogChar = $(this).attr('data-catalogChar');
            common.tableLayerInitData({
                title: '决策议题-' + name,
                type: 'yiti',
                where: {
                    catalogChar: catalogChar,
                    seName: $('#indexSeleteQymc').val(),
                    uploadStatus: $('[name=form-row]:checked').val(),
                    startTime: $('#dateBegin').val(),
                    endTime: $('#dateEnd').val(),
                    hdLevel: $('[name=hdLevel]:checked').val(),
                    entLevel: $('[name=entLevel]:checked').val(),
                    isIncludeChild: $('[name=switch]')[0].checked ? 'true' : 'false',
                    pageSource: 'statisticsTable',
                    seId: currentSeId
                }
            })
        });
        $(document).off('click', '.shishi');
        $(document).on('click', '.shishi', function () {
            var currentSeId = $(this).attr('data-seId');
            common.tableLayerInitData({
                title: '组织实施',
                type: 'shishi',
                where: {
                    seName: $('#indexSeleteQymc').val(),
                    uploadStatus: $('[name=form-row]:checked').val(),
                    startTime: $('#dateBegin').val(),
                    endTime: $('#dateEnd').val(),
                    hdLevel: $('[name=hdLevel]:checked').val(),
                    entLevel: $('[name=entLevel]:checked').val(),
                    isIncludeChild: $('[name=switch]')[0].checked ? 'true' : 'false',
                    pageSource: 'statisticsTable',
                    seId: currentSeId
                }
            })
        });
        $(document).off('click', '.yichang');
        $(document).on('click', '.yichang', function () {
            var currentSeId = $(this).attr('data-seId');
            common.tableLayerInitData({
                title: '异常情况',
                type: 'yichang',
                where: {
                    seName: $('#indexSeleteQymc').val(),
                    uploadStatus: $('[name=form-row]:checked').val(),
                    startTime: $('#dateBegin').val(),
                    endTime: $('#dateEnd').val(),
                    hdLevel: $('[name=hdLevel]:checked').val(),
                    entLevel: $('[name=entLevel]:checked').val(),
                    isIncludeChild: $('[name=switch]')[0].checked ? 'true' : 'false',
                    pageSource: 'statisticsTable',
                    seId: currentSeId
                }
            })
        });




        common.rightSearchBar($('.rightSearchBar'), $('#rightSearchBarArea'));
    });

});
