layui.config({
    base: '../../../../src/js/',
    version: new Date().getTime()
}).extend({
    treeGrid:'lib/treeGrid'
}).use(['eleTree','layer','table','form','laytpl','common','util','element','upload','treeGrid','laydate'],function () {
    var table=layui.table;
    var form=layui.form;
    var tree=layui.eleTree;
    var treeGrid = layui.treeGrid;//很重要
    var common=layui.common;
    var util=layui.util;
    var element = layui.element;
    var upload = layui.upload;
    var laydate = layui.laydate;
    element.init();
    var baseUrl = '../../../../';
    //跨域通信
    common.themeSet();
    common.toggleArea($('.toggle-btn'),$('.toggle-area'));

    var currentMenuSmId=$("#currentMenuSmId",window.parent.document).val();

    //组织机构URL
    var sysEnterpriseTreeUrl = "sysmgr/sysEnterprise/selectSysEnterpriseOrganPostTreeAllList?treeType=enterpriseTree";

    //分页查询参数
    var pageQueryParam = {"suName": ""};
    var param = {seId: common.getUserInfo().seId, isIncludeChild: true};
    var colParam = {seId: common.getUserInfo().seId, isIncludeChild: true, isgetColumn: true}
    var tableParam = {seId: common.getUserInfo().seId, isIncludeChild: true};
    var selectTreeNode = {}
    var eleTreeId = null;
    var mainTable = null;
    var tableData = [];
    var cols = [[]];

    var eventHandle={
        init: function(){
            form.on('switch(switch)', function(data){
                if (data.elem.checked) {
                    param.isIncludeChild = true;
                    colParam.isIncludeChild = true;
                    tableParam.isIncludeChild = true;
                }else{
                    param.isIncludeChild = false;
                    colParam.isIncludeChild = false;
                    tableParam.isIncludeChild = false;
                }
            });
        },
        initSearch: function(){
            laydate.render({
                elem: "#dateBegin"
            });
            laydate.render({
                elem: "#dateEnd"
            });
            //绑定查询时间
            $("#btnSearch").on("click", function(obj){
              //  debugger;
                var dateBegin = $("#dateBegin").val();
                var dateEnd = $("#dateEnd").val();
                if(dateBegin){
                    tableParam.startTime = dateBegin;
                    param.startTime = dateBegin;
                }else{
                    delete param["startTime"];
                }
                if(dateEnd){
                    tableParam.endTime = dateEnd;
                    param.endTime = endTime;
                }else{
                    delete param["endTime"];
                }
                var sURL = baseUrl + "sasszrule/statistics/selectMetTypeCountList";
                common.fetchPost(sURL, tableParam, function(data){
                    tableData = data.list;
                    var resultData = eventHandle.handleTableData();
                    mainTable.reload({data: resultData});
                    //重新渲染图表
                    eventHandle.initEchart();
                },function(data){
                    layer.msg(data.resultMessage);
                });
            });
        },
        treeInit:function () {
            formatTree();
            common.fetchGet(sysEnterpriseTreeUrl, function(res) {
                //树信息的导入
                if (res.success && res.list) {
                    eleTreeId = tree.render({
                        elem: '#leftTree',
                        data: res.list,
                        checkOnClickNode: true,
                        highlightCurrent: true,    // 是否高亮当前选中节点，默认值是 false。
                        expandOnClickNode: false,    // 是否在点击节点的时候展开或者收缩节点， 默认值为 true，如果为 false，则只有点箭头图标的时候才会展开或者收缩节点。
                        showCheckbox: false,
                        lazy: true,
                        load: function(data, callback) {
                            eventHandle.setQueryParam(data);
                            eventHandle.treeReload(data,callback);
                        }
                    });
                    tree.on("nodeClick(leftTree)", function(obj) {
                        obj.node.select();
                        var curTreeNode = obj.data.currentData;
                        pageQueryParam = {"suName": ""};
                        eventHandle.setQueryParam(curTreeNode);
                        // eventHandle.userTableReload(pageQueryParam);
                        tableParam.seId = curTreeNode.id;
                        param.seId = curTreeNode.id;

                        var sURL = baseUrl + "sasszrule/statistics/selectMetTypeCountList";
                        common.fetchPost(sURL, tableParam, function(data){
                            tableData = data.list;
                            var resultData = eventHandle.handleTableData();
                            mainTable.reload({data: resultData});
                            //重新刷新图表
                            eventHandle.initEchart();
                        },function(data){
                            layer.msg(data.resultMessage);
                        });
                    });
                } else {
                    //不存在数据时的显示
                }
            }, function() {});
        },
        treeReload:function (data,callback) {
            common.fetchGet(sysEnterpriseTreeUrl + '&id=' + data.id + '&extendAttr=' + data.extendAttr, function(res) {
                if (res.success && res.list) {
                    callback(res.list)
                }
            }, function() {
                callback([])
            });
        },
        setQueryParam:function(curTreeNode){
            pageQueryParam["seId"] = curTreeNode.seId;
            pageQueryParam["soId"] = curTreeNode.soId;
            pageQueryParam["spId"] = curTreeNode.spId;
            selectTreeNode["seId"] = curTreeNode.seId;
            selectTreeNode["soId"] = curTreeNode.soId;
            selectTreeNode["spId"] = curTreeNode.spId;
            if(curTreeNode.extendAttr == "enterprise") {
                selectTreeNode["seName"] = curTreeNode.name;
            }
            if(curTreeNode.extendAttr == "organ"){
                selectTreeNode["soName"] = curTreeNode.name;
            }
            if(curTreeNode.extendAttr == "post"){
                selectTreeNode["spName"] = curTreeNode.name;
            }
        },
        initEchart: function(){
            var sURL1 = baseUrl + "sasszrule/statistics/selectTiolMeetingTypeListe";
            var sURL2 = baseUrl + "sasszrule//statistics/selectMeetingMonthAndTypeListe";
            var chart1 = echarts.init(document.getElementById('chart1'), 'custom');
            var chart2 = echarts.init(document.getElementById('chart2'), 'custom');

            common.fetchPost(sURL1, param, function(data){
                var selectData = {};
                for(var i=0;i<data.object.series.length;i++){
                    var flag = i < 6;
                    selectData[data.object.series[i].name] = flag;
                }

                var option = {
                    title : {
                        text: '会议分类占比'
                        // subtext: '',
                        // x:'center'
                    },
                    tooltip : {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        type: 'scroll',
                        orient: 'horizontal',
                        left: 0,
                        bottom: 0,
                        data: data.object.legend,
                        selected: selectData
                    },
                    series : [
                        {
                            name: '',
                            type: 'pie',
                            radius : '55%',
                            center: ['45%', '45%'],
                            data: data.object.series,
                            label: {
                                formatter: '{b} {c}'
                            },
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ]
                }
                chart1.setOption(option);
            },function(data){
                layer.msg(data.resultMessage);
            });

            common.fetchPost(sURL2, param, function(data){
                var seriesData = [];
                var serieses = data.object.series;
                for(var i=0;i<serieses.length;i++){
                    var item = serieses[i];
                    item.stack = "总量";
                    item.label = {
                        normal: {
                            show: true,
                            position: 'inside'
                        }
                    }
                    seriesData.push(item);
                }

                var option = {
                    title: {
                        text: '会议分类汇总'
                    },
                    tooltip: {
                        formatter: '{a} {c}'
                    },
                    xAxis:  {
                        type: 'category',
                        data: data.object.Axis
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: seriesData
                };

                chart2.setOption(option);
            },function(data){
                layer.msg(data.resultMessage);
            });

            $(window).resize(function () {
                common.chartResize(['chart1', 'chart2'], [chart1, chart2]);
            });
        },
        //获取表格列
        initCol: function(){
            var resultCols = [[]];
            var sURL = baseUrl + "sasszrule/statistics/selectMetTypeCountList";
            common.fetchPost(sURL, colParam, function(data){
                var cols = [[]];
                cols[0].push({type:"numbers", title:"序号", width:"5%"});
                cols[0].push({field:"seName", title:"企业名称", width:"30%", templet: function(rowdata){
                    if(rowdata.seLevel && rowdata.seLevel==3){
                        return "　　　　"　+　rowdata.seName;
                    }else if(rowdata.pId != -1){
                        return "　　"　+　rowdata.seName;
                    }else{
                        return rowdata.seName;
                    }
                }});

                var columns = data.object.columns;
                for(var i=0; i<columns.length; i++){
                    var column = columns[i];
                    var data = {};
                    data.field = column.code;
                    data.title = column.name;
                    cols[0].push(data);
                }
                resultCols = cols;
            },function(data){
                layer.msg(data.resultMessage);
            },false);

            return resultCols;
        },
        initTable: function(cols){
            var sURL = baseUrl + "sasszrule/statistics/selectMetTypeCountList";
            common.fetchPost(sURL, tableParam, function(data){
                tableData = data.list;
                tableData = eventHandle.handleTableData(tableData);
                mainTable = table.render(common.tableInitParams({
                    elem: '#table',
                    data: tableData,
                    page: false,
                    limit: 10000,
                    height:'320',
                    cols: cols,
                    done: function(res, curr, count){
                        for(var i=3;i<cols[0].length;i++){
                            var item = cols[0][i];
                            var field = item.field;
    
                            $("td[data-field=" + field + "] div").each(function(index,item){
                                var number = parseInt(item.innerText);
                                if(number == 0){
                                    $(item).html("-");
                                }
                            });
                        }

                        table.on('row(table)', function(obj){
                            var data = obj.data;
                            var param = {seId: data.id, isIncludeChild: true, pId: data.id};
                            var sURL = baseUrl + "sasszrule/statistics/selectMetTypeCountList";

                            if(data.seLevel < 2){
                                return;
                            }

                            common.fetchPost(sURL, param, function(data){
                                var exist = false;
                                if(data.list.length > 0){
                                    for(var i=0;i<data.list.length;i++){
                                        exist = false;
                                        var item = data.list[i];
                                        $(tableData).each(function(index,tableItem){
                                            if(tableItem.id == item.id){
                                                exist = true;
                                            }
                                        });
                                        if(!exist){
                                            tableData.push(item);
                                        }
                                    }
                                    //处理数据
                                    var resultData = eventHandle.handleTableData();
                                    mainTable.reload({data: resultData});
                                }
                            },function(data){
                                layer.msg(data.resultMessage);
                            })
                        });
                    }
                }));
            },function(data){
                layer.msg(data.resultMessage);
            });
        },
        //处理表格数据
        handleTableData: function(){
            var treeJson = common.arrayToTreeJson(tableData, "id", "pId", "children");
            var resultData = common.jsonToArray(treeJson, "children");
            return resultData;
        },
        pageLoad: function(){
            //初始化事件
            eventHandle.init();
            //初始化搜索框
            eventHandle.initSearch();
            //初始化树
            eventHandle.treeInit();
            //初始化图标
            eventHandle.initEchart();
            //获取表格列
            cols = eventHandle.initCol();
            //初始化表格
            eventHandle.initTable(cols);
        },
    }

    eventHandle.pageLoad();

    /**
     * 格式化树形控件
     */
    function formatTree(){
        var cacluHeight = $(document).height() - $("#mainMenuTab").height() - $(".layui-card-header").height() - 77;
        $("#leftTree").css({
            "height": cacluHeight + "px",
            "overflow-y": "auto"
        });
    }
});