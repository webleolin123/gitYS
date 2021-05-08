layui.config({
    base: '../../../../src/js/',
    version: new Date().getTime()
}).use(['eleTree','layer','table','form','laytpl','common','util','element','upload','laydate'],function () {
    var table=layui.table;
    var form=layui.form;
    var tree=layui.eleTree;
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
            //绑定查询时间
            $("#btnSearch").on("click", function(obj){
                var keySearch = $("#keySearch").val();
                if(keySearch){
                    tableParam.seName = keySearch;
                }else{
                    delete tableParam.seName;
                }
                var sURL = baseUrl + "sasszrule/statistics/selectSubjecItemList";
                common.fetchPost(sURL, tableParam, function(data){
                    tableData = data.list;
                    var resultData = eventHandle.handleTableData();
                    mainTable.reload({data: resultData});
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

                        var sURL = baseUrl + "sasszrule/statistics/selectSubjecItemList";
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
            var sURL1 = baseUrl + "sasszrule/statistics/selectSubjectItemLawList";
            var sURL2 = baseUrl + "sasszrule/statistics/selectSubjectClassByMape";
            var sURL3 = baseUrl + "sasszrule/statistics/selectSubjecVoteListe";
            var chart1 = echarts.init(document.getElementById('chart1'), 'custom');
            var chart2 = echarts.init(document.getElementById('chart2'), 'custom');
            var chart3 = echarts.init(document.getElementById('chart3'), 'custom');

            common.fetchPost(sURL1, param, function(data){
                //计算总数
                var subCount = 0;
                var subList = data.list;
                for(var i=0;i<subList.length;i++){
                    subCount += subList[i].value;
                }
                $("#subCount").html(subCount);

                var option = {
                    title: {
                        text: '涉及法律审核的议题情况'
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{b} {c}"
                    },
                    series: [
                        {
                            name:'',
                            type:'pie',
                            radius: ['40%', '55%'],
                            label: {
                                normal: {
                                    formatter: '{b} {c}',
                                }
                            },
                            data: data.list
                        }
                    ]
                };
                chart1.setOption(option);
            },function(data){
                layer.msg(data.resultMessage);
            });

            common.fetchPost(sURL2, param, function(data){
                var option = {
                    title : {
                        text: '议题分类占比',
                        // subtext: '纯属虚构',
                        // x:'center'
                    },
                    tooltip : {
                        trigger: 'item',
                        formatter: "{b} : {c} ({d}%)"
                    },
                    series : [
                        {
                            name: '',
                            type: 'pie',
                            radius : '55%',
                            center: ['50%', '60%'],
                            data: data.list,
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
                };

                chart2.setOption(option);
            },function(data){
                layer.msg(data.resultMessage);
            });

            common.fetchPost(sURL3, param, function(data){
                var option = {
                    title: {
                        text: '议题表决情况'
                    },
                    tooltip : {
                        trigger: 'axis',
                        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        }
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis:  {
                        data: data.object.Axis
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [
                        {
                            name: '',
                            type: 'bar',
                            stack: '总量',
                            label: {
                                normal: {
                                    show: true,
                                    position: 'top'
                                },
                            },
                            data: data.object.series[0].data
                        }
                    ]
                };
                chart3.setOption(option);
            },function(data){
                layer.msg(data.resultMessage);
            });

            $(window).resize(function () {
                common.chartResize(['chart1', 'chart2', 'chart3'], [chart1, chart2, chart3]);
            });
        },
        //获取表格列
        initCol: function(){
            var resultCols = [[]];
            resultCols[0].push({type:"numbers", title:"序号", width:"5%"});
            resultCols[0].push({field:"seName", title:"企业名称", width:"30%", templet: function(rowdata){
                    if(rowdata.seLevel && rowdata.seLevel==3){
                        return "　　　　"　+　rowdata.seName;
                    }else if(rowdata.pId != -1){
                        return "　　"　+　rowdata.seName;
                    }else{
                        return rowdata.seName;
                    }
                }});
            resultCols[0].push({field:"metCount", title:"会议总数"});
            resultCols[0].push({field:"subCount", title:"议题总数"});
            resultCols[0].push({field:"decisions", title:"重大决策"});
            resultCols[0].push({field:"appointRemoval", title:"重大人事任免"});
            resultCols[0].push({field:"projectArrange", title:"重大项目安排"});
            resultCols[0].push({field:"largeMoney", title:"大额度资金运作"});

            return resultCols;
        },
        initTable: function(cols){
            var sURL = baseUrl + "sasszrule/statistics/selectSubjecItemList";
            common.fetchPost(sURL, tableParam, function(data){
                tableData = data.list;
                tableData = eventHandle.handleTableData(tableData);
                mainTable = table.render(common.tableInitParams({
                    elem: '#table',
                    data: tableData,
                    page: false,
                    limit: 10000,
                    height:'286',
                    cols: cols,
                    done: function(res, curr, count){
                        for(var i=4;i<cols[0].length;i++){
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
                            var sURL = baseUrl + "sasszrule/statistics/selectSubjecItemList";

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