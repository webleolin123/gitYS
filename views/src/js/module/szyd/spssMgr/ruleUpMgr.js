layui.config({
    base: '../../../../src/js/',
    version: new Date().getTime()
}).extend({
    treeGrid:'lib/treeGrid'
}).use(['eleTree','layer','table','form','laytpl','common','util','element','upload','treeGrid'],function () {
    var table=layui.table;
    var form=layui.form;
    var tree=layui.eleTree;
    var treeGrid = layui.treeGrid;//很重要
    var common=layui.common;
    var util=layui.util;
    var element = layui.element;
    var upload = layui.upload;
    element.init();
    var baseUrl = '../../../../';
    //跨域通信
    common.themeSet();
    common.toggleArea($('.toggle-btn'),$('.toggle-area'));

    var currentMenuSmId=$("#currentMenuSmId",window.parent.document).val();

    //组织机构URL
    var sysEnterpriseTreeUrl = "sysmgr/sysEnterprise/selectSysEnterpriseOrganPostTreeAllList?treeType=enterpriseTree";

    Array.prototype.insert = function (index, item) {
        this.splice(index, 0, item);
    };

    //分页查询参数
    var pageQueryParam = {"suName": ""};
    var param = {seId: common.getUserInfo().seId, isIncludeChild: true};
    var selectTreeNode = {}
    var eleTreeId = null;
    var mainTable = null;
    var tableData = [];

    var eventHandle={
        init: function(){
            form.on('switch(switch)', function(data){
                if (data.elem.checked) {
                    param.isIncludeChild = true;
                }else{
                    param.isIncludeChild = false;
                }
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
                        param.seId = curTreeNode.id;
                        //重新初始化选项卡
                        eventHandle.initTab();

                        var sURL = baseUrl + "sasszrule/statistics/selecRegulationTypeList";
                        common.fetchPost(sURL, param, function(data){
                            tableData = data.list;
                            var resultData = eventHandle.handleTableData();
                            mainTable.reload({data: resultData});
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
        //初始化选项卡
        initTab: function(){
            var cols = [];
            var tabHtml = "";
            var sURL = baseUrl + "sasszrule/statistics/selectRegulationTypeCount";

            common.fetchPost(sURL, param, function(data){
                if (data.list && data.list.length > 0) {
                    //初始化表格列
                    cols.push(data.list);
                    $.map(data.list, function (item, index) {
                        var checked = '';
                        if (index === 0) {
                            checked = 'layui-this';
                        }
                        if (index < data.list.length) {
                            tabHtml += '<li class="' + checked + '" data-trtId=' + item.trtId +  ' data-trtName=' + item.trtName + ' data-trtCode=' + item.trtCode + '>' + item.trtName + '(' + item.num + ')' + '</li>';
                        }
                    });

                    $('#regulationTypeTab').empty().html(tabHtml);

                    $('#regulationTypeTab').on('click', function(obj){
                        param.regulationTypeId = $(obj.target).attr("data-trtId");
                        //var param = {seId: common.getUserInfo().seId, isIncludeChild: true, regulationTypeId: $(obj.target).attr("data-trtId")};
                        var sURL = baseUrl + "sasszrule/statistics/selecRegulationTypeList";
                        common.fetchPost(sURL, param, function(data){
                            tableData = data.list;
                            var resultData = eventHandle.handleTableData();
                            mainTable.reload({data: resultData});
                            delete param["regulationTypeId"];
                        },function(data){
                            layer.msg(data.resultMessage);
                        });
                    });
                }
            },function(res){
                layer.alert(res.resultMessage);
            },false);

            return cols;
        },
        //初始化表格列
        initCols: function(tabData){
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
            for(var i=0;i<tabData[0].length;i++){
                var tab = tabData[0][i];
                var data = {};
                data.field = tab.trtId;
                data.title = tab.trtName;
                cols[0].push(data);
            }
            return cols;
        },
        initTable: function(cols){
            var sURL = baseUrl + "sasszrule/statistics/selecRegulationTypeList";
            common.fetchPost(sURL, param, function(data){
                tableData = data.list;
                tableData = eventHandle.handleTableData(tableData);
                mainTable = table.render(common.tableInitParams({
                    elem: '#table',
                    data: tableData,
                    page: false,
                    limit: 10000,
                    height:'608',
                    cols: cols,
                    done: function(res, curr, count){
                        for(var i=3;i<cols[0].length;i++){
                            var item = cols[0][i];
                            var field = item.field;

                            $("td[data-field=" + field + "] div").each(function(index,item){
                                var number = parseInt(item.innerText);
                                if(number > 0){
                                    $(item).html("<i class='fa fa-check-circle green'></i>");
                                }else{
                                    $(item).html("");
                                }
                            });
                        }

                        table.on('row(table)', function(obj){
                            var data = obj.data;
                            var param = {seId: data.id, isIncludeChild: true, pId: data.id};
                            var sURL = baseUrl + "sasszrule/statistics/selecRegulationTypeList";

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
            //初始化树
            eventHandle.treeInit();
            //初始化选项卡
            var tabData = eventHandle.initTab();
            //获取表格列数据
            var cols = eventHandle.initCols(tabData);
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
