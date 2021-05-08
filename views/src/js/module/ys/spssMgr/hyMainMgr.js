layui.config({
    base: '../../../../src/js/',
    version: new Date().getTime()
}).extend({
    treeGrid:'lib/treeGrid'
}).use(['eleTree', 'layer', 'table', 'form', 'laytpl', 'common', 'element', 'laydate'], function () {
    var table=layui.table;
    var form=layui.form;
    var tree=layui.eleTree;
    var common=layui.common;
    var element = layui.element;
    var laydate = layui.laydate;
    element.init();
    var baseUrl = '../../../../';
    //跨域通信
    common.themeSet();
    common.toggleArea($('.toggle-btn'),$('.toggle-area'));

    var currentMenuSmId=$("#currentMenuSmId",window.parent.document).val();

    //组织机构URL
    var sysEnterpriseTreeUrl = "sysmgr/sysEnterprise/selectAllDescendantNodeFromRootNode?treeType=enterpriseTree";

    //分页查询参数
    var pageQueryParam = {"suName": ""};
    var param = {seId: common.getUserInfo().seId, isIncludeChild: true,uploadStatus:'-1'};
    var colParam = {seId: common.getUserInfo().seId, isIncludeChild: true, isgetColumn: true,uploadStatus:'-1'};
    var tableParam = {seId: common.getUserInfo().seId, isIncludeChild: true,uploadStatus:'-1'};
    var selectTreeNode = {};
    var eleTreeId = null;
    var mainTable = null;
    var tableData = [];
    var cols = [[]];

    var eventHandle={
        init: function(){


            var isIncludeChild = common.getQueryVariable("isIncludeChild");
            if(isIncludeChild === "1"){
                param.isIncludeChild = true;
                colParam.isIncludeChild = true;
                tableParam.isIncludeChild = true;
            }else if(isIncludeChild === "0"){
                param.isIncludeChild = false;
                colParam.isIncludeChild = false;
                tableParam.isIncludeChild = false;
                $("[lay-filter=switch]").removeAttr("checked");
                form.render();
            }

            var meetingTypeId = common.getQueryVariable("meetingTypeId");
            if(meetingTypeId){
                param.meetingTypeId = meetingTypeId;
                tableParam.meetingTypeId = meetingTypeId;
            }
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
                var layerLoader = common.layerLoader();

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
                    param.endTime = dateEnd;
                }else{
                    delete param["endTime"];
                }

                tableParam.uploadStatus=$('[name=uploadStatusRadio]:checked').val();
                param.uploadStatus=$('[name=uploadStatusRadio]:checked').val();
                param.colParam=$('[name=uploadStatusRadio]:checked').val();

                var sURL = baseUrl + "meetingmgr/tiolMeeting/selectMetTypeCountList";
                common.fetchPost(sURL, tableParam, function(data){
                    tableData = data.list;
                    var resultData = eventHandle.handleTableData();
                    mainTable.reload({data: resultData});
                    //重新渲染图表
                    layer.close(layerLoader);
                    eventHandle.initEchart();
                },function(data){
                    layer.msg(data.resultMessage);
                    layer.close(layerLoader);
                },false);
                return false
            });
        },
        treeInit:function () {
            formatTree();
            common.fetchGet(sysEnterpriseTreeUrl, function(res) {
                //树信息的导入
                if (res.success && res.list) {
                  var leftTree = tree.render({
                        elem: '#leftTree',
                        data: common.arrayToTreeJson(res.list || [], "id", "pid", "children"),
                        defaultExpandAll: false,
                        checkOnClickNode: true,
                      highlightCurrent: true,
                      expandOnClickNode: true,
                        showCheckbox: false,
                        lazy: false,
                        request: {
                            name: "title",
                            key: "id",
                            children: "children",
                            checked: "checked",
                            disabled: "disabled",
                            isLeaf: "isLeaf",
                            extendAttr: "extendAttr"
                        },
                        searchNodeMethod: function (value, data) {
                            if (!value) return true;

                            return data.title.indexOf(value) !== -1;
                        }
                    });
                    $('#leftTree').find('.eleTree-node-content-label').eq(0).trigger('click');
                    $("#searchTree").on("change", function () {
                        leftTree.search($.trim($(this).val()));
                    });
                    tree.on("nodeClick(leftTree)", function(obj) {
                        obj.node.select();
                        var curTreeNode = obj.data.currentData;
                        pageQueryParam = {"suName": ""};
                        eventHandle.setQueryParam(curTreeNode);
                        // eventHandle.userTableReload(pageQueryParam);
                        tableParam.seId = curTreeNode.id;
                        param.seId = curTreeNode.id;

                        var sURL = baseUrl + "meetingmgr/tiolMeeting/selectMetTypeCountList";
                        common.fetchPost(sURL, tableParam, function(data){
                            tableData = data.list;
                            var resultData = eventHandle.handleTableData();
                            // mainTable.reload({data: resultData});
                            mainTable.reload({data: resultData,cols:eventHandle.getCol(data.object.columns)});
                            //重新刷新图表
                            eventHandle.initEchart();
                        },function(data){
                            layer.msg(data.resultMessage);
                        });
                    });
                } else {
                    //不存在数据时的显示
                }
            }, function() {},false);
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
            var sURL1 = baseUrl + "meetingmgr/tiolMeeting/selectTiolMeetingTypeListe";
            var sURL2 = baseUrl + "meetingmgr/tiolMeeting/selectMeetingMonthAndTypeListe";
            var chart1 = echarts.init(document.getElementById('chart1'), 'custom');
            var chart2 = echarts.init(document.getElementById('chart2'), 'custom');

            common.fetchPost(sURL1, param, function(data){
                var selectData = {};
                for(var i=0;i<data.object.series.length;i++){
                    var flag = i < 6;
                    selectData[data.object.series[i].name] = flag;
                }

                var option = {

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
                            radius: '45%',
                            center: ['50%', '40%'],
                            data: data.object.series,
                            label: {
                                formatter: '{b} {c}'
                            },
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 5,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ]
                };
                chart1.setOption(option);
            },function(data){
                layer.msg(data.resultMessage);
            },false,false);

            common.fetchPost(sURL2, param, function(data){
                var seriesData = [];
                var serieses = data.object.series;
                for(var i=0;i<serieses.length;i++){
                    var item = serieses[i];
                    item.barWidth = 35;
                    item.stack = "总量";
                    item.label = {
                        normal: {
                            show: true,
                            position: 'inside',
                            formatter: function (data) {
                                if (data.value === 0) {
                                    return '';
                                }

                            }
                        }
                    };
                    seriesData.push(item);
                }

                var option = {
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        top: '10px',
                        containLabel: true
                    },
                    legend: {
                        type: 'scroll',
                        orient: 'horizontal',
                        left: 0,
                        bottom: 0,
                        data: data.object.Axis
                    },
                    tooltip: {
                        // trigger: 'axis',
                        axisPointer: {
                            type: 'shadow'
                        }
                    },
                    xAxis:  {
                        type: 'category',
                        data: data.object.Axis,
                        axisLabel: {
                            interval: 0,
                            rotate: 45
                        }
                    },
                    yAxis: {
                        type: 'value'
                    },
                    dataZoom: [
                        {
                            show: true,
                            height: 10,
                            start: 0,
                            end: 20
                        },
                        {
                            type: 'inside',
                            height: 10,
                            start: 0,
                            end: 20
                        }
                    ],
                    series: seriesData
                };

                chart2.setOption(option);
            },function(data){
                layer.msg(data.resultMessage);
            },false,false);

            $(window).resize(function () {
                common.chartResize(['chart1', 'chart2'], [chart1, chart2]);
            });
        },
        //获取表格列
        initCol: function(){
            var resultCols = [[]];
            var sURL = baseUrl + "meetingmgr/tiolMeeting/selectMetTypeCountList";
            common.fetchPost(sURL, colParam, function(data){
                var cols = [[]];
                // cols[0].push({type: "numbers", title: "序号"});
                cols[0].push({
                    field: "seName", title: "企业名称",align:'left',fixed: 'left', minWidth: 250, templet: function (rowdata) {
                        var icon_plus = "<i style='margin-right: 5px;color: #407ac0' data-seLevel='"+rowdata.seLevel+"' data-pId='"+rowdata.pId+"' data-id='"+rowdata.id+"' class='slideIcon fa fa-plus-square-o'></i>";
                        var icon_minus = "<i style='margin-right: 5px;color: #407ac0' data-seLevel='"+rowdata.seLevel+"' data-pId='"+rowdata.pId+"' data-id='"+rowdata.id+"' class='slideIcon fa fa-minus-square-o'></i>";
                    var result = "";

                    if(rowdata.seLevel){
                        for(var i=1;i<rowdata.seLevel;i++){
                            result += "　";
                        }
                    }
                    var existFlag = eventHandle.existChild(rowdata.id);
                    if(rowdata.seLevel == 1){
                        result += icon_minus;
                    }else if(existFlag){
                        result += icon_minus;
                    }else if(!existFlag && rowdata.seLevel == 2 && !rowdata.isChild){
                        result += icon_plus;
                    }

                    result += rowdata.seName;
                    return result;
                }});

                var columns = data.object.columns;
                for(var i=0; i<columns.length; i++){
                    var column = columns[i];
                    var data = {};
                    data.field = column.code;
                    data.title = column.name;
                    data.minWidth = 20 * column.name.length;
                    // data.minWidth = 1 * column.name.length;
                    data.align = "center";
                    cols[0].push(data);
                }
                resultCols = cols;
            },function(data){
                layer.msg(data.resultMessage);
            },false);

            return resultCols;
        },

        //获取列头
        getCol:function(columns){
            var resultCols = [[]];

            var cols = [[]];
            // cols[0].push({type: "numbers", title: "序号"});
            cols[0].push({
                field: "seName", title: "企业名称",fixed: 'left', align:'left',minWidth: 250, templet: function (rowdata) {
                    var icon_plus = "<i style='margin-right: 5px;color: #407ac0' data-seLevel='"+rowdata.seLevel+"' data-pId='"+rowdata.pId+"' data-id='"+rowdata.id+"' class='slideIcon fa fa-plus-square-o'></i>";
                    var icon_minus = "<i style='margin-right: 5px;color: #407ac0' data-seLevel='"+rowdata.seLevel+"' data-pId='"+rowdata.pId+"' data-id='"+rowdata.id+"' class='slideIcon fa fa-minus-square-o'></i>";
                    var result = "";

                    if(rowdata.seLevel){
                        for(var i=1;i<rowdata.seLevel;i++){
                            result += "　";
                        }
                    }
                    var existFlag = eventHandle.existChild(rowdata.id);
                    if(rowdata.seLevel == 1){
                        result += icon_minus;
                    }else if(existFlag){
                        result += icon_minus;
                    }else if(!existFlag && rowdata.seLevel == 2 && !rowdata.isChild){
                        result += icon_plus;
                    }

                    result += rowdata.seName;
                    return result;
                }});

            // var columns = data.object.columns;
            if(columns.length>0){
                $.map(columns,function (column) {
                    var data = {};
                    data.field = column.code;
                    data.title = column.name;
                    data.minWidth = 17 * column.name.length;
                    // data.minWidth = 1 * column.name.length;
                    data.align = "center";
                    data.templet=function(rowDta){
                        return '<span class="tableListLayer a-link" data-seId="'+rowDta.seId+'"  data-meetingType="'+column.code+'">'+(rowDta[column.code])+'</span>'
                    };
                    cols[0].push(data);
                });
            }

            resultCols = cols;

            return resultCols;
        },

        /**
         * 是否存在下级企业
         */
        existChild: function(id){
            for(var i=0;i<tableData.length;i++){
                var item = tableData[i];
                if(item.pId == id){
                    return true;
                }
            }
            return false;
        },
        initTable: function(){
            var sURL = baseUrl + "meetingmgr/tiolMeeting/selectMetTypeCountList";
            var commonLayer=common.layerLoader();
            common.fetchPost(sURL, tableParam, function(data){
                tableData = data.list;
                tableData = eventHandle.handleTableData(tableData);
                cols=eventHandle.getCol(data.object.columns);
                mainTable = table.render(common.tableInitParams({
                    elem: '#table',
                    data: tableData,
                    page: false,
                    limit: 10000,
                    height: 'full-335',
                    cols: cols,
                    done: function(res, curr, count){
                        for(var i=2;i<cols[0].length;i++){
                            var item = cols[0][i];
                            var field = item.field;

                            $("td[data-field=" + field + "] div").each(function(index,item){
                                var number = parseInt(item.innerText);
                                if(number == 0){
                                    $(item).html("-");
                                }
                            });
                        }

                        $('.slideIcon').off().on('click',function () {

                            var data = {
                                id:$(this).attr('data-id'),
                                pId:$(this).attr('data-pId'),
                                seLevel:$(this).attr('data-seLevel')
                            };


                            var param = {seId: data.id, isIncludeChild: tableParam.isIncludeChild, pId: data.id,
                                startTime:tableParam.startTime,
                                endTime:tableParam.endTime,
                                uploadStatus:tableParam.uploadStatus
                            };
                            var sURL = baseUrl + "meetingmgr/tiolMeeting/selectMetTypeCountList";


                            if(parseInt(data.seLevel) < 2 || data.pId==='-1'){
                                return;
                            }


                            //如果已展开，则通过删除数据达到收缩的效果
                            var existFlag = false;
                            var resultArray = [];
                            for(var i=0;i<tableData.length;i++){
                                var item = tableData[i];
                                if(item.pId == data.id){
                                    existFlag = true;
                                }else{
                                    resultArray.push(item);
                                }
                            }
                            var currentTop=$('.layui-table-body').scrollTop()+'px';
                            if(existFlag){
                                tableData.length = 0;
                                tableData = resultArray;
                                var resultData = eventHandle.handleTableData();
                                mainTable.reload({data:resultData});
                                $('.layui-table-body').animate({scrollTop: currentTop},0);
                            }else{
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
                                        $('.layui-table-body').animate({scrollTop: currentTop},0);
                                    }
                                },function(data){
                                    layer.msg(data.resultMessage);
                                })
                            }

                        });


                        /*table.on('row(table)', function(obj){
                            // slideIcon


                        });*/
                    }
                }));
                layer.close(commonLayer);
            },function(data){
                layer.msg(data.resultMessage);
                layer.close(commonLayer);
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
            //初始化表格
            eventHandle.initTable();
            form.on('switch(switch)', function (data) {
                if (data.elem.checked) {
                    param.isIncludeChild = true;
                    colParam.isIncludeChild = true;
                    tableParam.isIncludeChild = true;
                }else{
                    param.isIncludeChild = false;
                    colParam.isIncludeChild = false;
                    tableParam.isIncludeChild = false;
                }

                var commonLayer=common.layerLoader();
                var sURL = baseUrl + "meetingmgr/tiolMeeting/selectMetTypeCountList";
                common.fetchPost(sURL, tableParam, function(data){
                    tableData = data.list;
                    var resultData = eventHandle.handleTableData();
                    mainTable.reload({data: resultData,cols:eventHandle.getCol(data.object.columns)});
                    //重新刷新图表
                    eventHandle.initEchart();
                    layer.close(commonLayer);
                },function(data){
                    layer.msg(data.resultMessage);
                    layer.close(commonLayer);
                });
            });

            //查看详情窗
            $(document).off('click','.tableListLayer');
            $(document).on('click','.tableListLayer',function () {

                var meetingType=$(this).attr('data-meetingType');
                // var meetingTypeCode=$(this).attr('data-meetingTypeCode');
                var dataSeId=$(this).attr('data-seId');

                common.tableLayerInitData({
                    title:'会议列表',
                    type:'huiyi',
                    where:{
                        startTime:$("#dateBegin").val(),
                        endTime:$("#dateEnd").val(),
                        meetingTypeId:meetingType,
                        // meetingTypeCode:meetingTypeCode,
                        seId:dataSeId,
                        uploadStatus:$('[name=uploadStatusRadio]:checked').val(),
                        pageSource:'meetingStatistics',
                        isIncludeChild: tableParam.isIncludeChild?'true':'false'
                    }
                });
            });
        }
    };

    eventHandle.pageLoad();

    /**
     * 格式化树形控件
     */
    function formatTree(){
        $("#leftTree").css({
            "height": $(window).height() - 120 + 'px',
            "overflow-y": "auto"
        });
    }

    common.columnToggle();
});
