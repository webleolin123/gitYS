layui.config({
    base: '../../../../src/js/',
    version: new Date().getTime()
}).extend({
    treeGrid:'lib/treeGrid'
}).use(['eleTree', 'layer', 'table', 'form', 'laytpl', 'common', 'element','util'], function () {
    var table=layui.table;
    var form=layui.form;
    var tree=layui.eleTree;
    var common=layui.common;
    var element = layui.element;
    var util = layui.util;
    var curTreeNode;
    element.init();
    var baseUrl = '../../../../';
    //跨域通信
    common.themeSet();
    common.toggleArea($('.toggle-btn'),$('.toggle-area'));
    common.columnToggle();

    var currentMenuSmId=$("#currentMenuSmId",window.parent.document).val();

    //组织机构URL
    var sysEnterpriseTreeUrl = "sysmgr/sysEnterprise/selectSysEnterpriseOrganPostTreeAllList?treeType=enterpriseTree";

    Array.prototype.insert = function (index, item) {
        this.splice(index, 0, item);
    };

    //分页查询参数
    var pageQueryParam = {"suName": ""};
    var param = {seId: common.getUserInfo().seId, isIncludeChild: true,flowStatusCode:'-1'};
    var selectTreeNode = {};
    var eleTreeId = null;
    var mainTable = null;
    var tableData = [];

    var eventHandle={
        init: function(){

            var isIncludeChild = common.getQueryVariable("isIncludeChild");
            if(isIncludeChild === "1"){
                param.isIncludeChild = true;
            }else if(isIncludeChild === "0"){
                param.isIncludeChild = false;
                $("[lay-filter=switch]").removeAttr("checked");
                form.render();
            }
        },
        treeInit:function () {
            formatTree();
            common.fetchGet( "sysmgr/sysEnterprise/selectAllDescendantNodeFromRootNode?treeType=enterpriseTree", function(res) {
                //树信息的导入
                if (res.success && res.list) {
                  var leftTree = tree.render({
                        elem: '#leftTree',
                        data: common.arrayToTreeJson(res.list || [], "id", "pid", "children"),
                        defaultExpandAll: false,
                        checkOnClickNode: true,
                        highlightCurrent: true,    // 是否高亮当前选中节点，默认值是 false。
                        expandOnClickNode: true,    // 是否在点击节点的时候展开或者收缩节点， 默认值为 true，如果为 false，则只有点箭头图标的时候才会展开或者收缩节点。
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

                    tree.on("nodeClick(leftTree)", function(obj) {
                        obj.node.select();

                        curTreeNode = obj.data.currentData;
                        pageQueryParam = {"suName": ""};
                        eventHandle.setQueryParam(curTreeNode);
                        // eventHandle.userTableReload(pageQueryParam);
                        param.seId = curTreeNode.id;
                        delete param.pId;
                        //重新初始化选项卡
                        //eventHandle.initTab();

                        var commonLayer=common.layerLoader();
                        var sURL = baseUrl + "rulemgr/regulation/selecRegulationTypeList";
                        common.fetchPost(sURL, param, function(data){
                            tableData = data.list;
                            var resultData = eventHandle.handleTableData();
                            mainTable.reload({data: resultData,cols:eventHandle.getCols(data.object.columns)});
                            layer.close(commonLayer);
                        },function(data){
                            layer.msg(data.resultMessage);
                            layer.close(commonLayer);
                        });
                    });
                    $('#leftTree').find('.eleTree-node-content-label').eq(0).trigger('click');
                    $("#searchTree").on("change", function () {
                        leftTree.search($.trim($(this).val()));
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
        //初始化选项卡
        initTab: function(){
            var cols = [];
            var tabHtml = "";
            var sURL = baseUrl + "rulemgr/regulation/selectRegulationTypeCount";
            delete param.pId;
            var commonLayer=common.layerLoader();
            common.fetchPost(sURL, param, function(data){
                if (data.list && data.list.length > 0) {
                    //初始化表格列
                    cols.push(data.list);
                    // $.map(data.list, function (item, index) {
                    //     var checked = '';
                    //     if (index === 0) {
                    //         checked = 'layui-this';
                    //     }
                    //     if (index < data.list.length) {
                    //         tabHtml += '<li class="' + checked + '" data-trtId=' + item.trtId +  ' data-trtName=' + item.trtName + ' data-trtCode=' + item.trtCode + '>' + item.trtName + '(' + item.num + ')' + '</li>';
                    //     }
                    // });

                    // $('#regulationTypeTab').empty().html(tabHtml);

                    // $('#regulationTypeTab').off().on('click', function(obj){
                    //     delete param.pId;

                    //     param.seId = curTreeNode.id;
                    //     delete param.pId;
                    //     param.regulationTypeId = $(obj.target).attr("data-trtId");
                    //     //var param = {seId: common.getUserInfo().seId, isIncludeChild: true, regulationTypeId: $(obj.target).attr("data-trtId")};
                    //     var sURL = baseUrl + "sasszrule/statistics/selecRegulationTypeList";
                    //     common.fetchPost(sURL, param, function(data){
                    //         tableData = data.list;
                    //         var resultData = eventHandle.handleTableData();
                    //         mainTable.reload({data: resultData,cols:eventHandle.getCols(data.object.columns)});
                    //         //delete param["regulationTypeId"];
                    //     },function(data){
                    //         layer.msg(data.resultMessage);
                    //     });
                    // });
                }
            },function(res){
                layer.alert(res.resultMessage);
                layer.close(commonLayer)
            },false);

            return cols;
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
        getCols:function(colsData){
            var cols = [[]];
            // cols[0].push({type: "numbers", title: "序号"});
            cols[0].push({
                field: "seName", title: "企业名称", minWidth: 280,fixed:'left', align:'left', templet: function (rowdata) {
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
            for(var i=0;i<colsData.length;i++){
                var tab = colsData[i];
                var data = {};
                data.field = tab.code;
                data.title = tab.name;
                data.minWidth = 18 * tab.name.length;
                data.align = "center";
                if(data.title==='制度总数'){
                    data.templet=function (rowData) {
                        return '<span class="a-link jczd" data-seId="'+rowData.seId+'">'+rowData.total+'</span>'
                    }
                }
                cols[0].push(data);
            }
            return cols;
        },
        initTable: function(){
            var sURL = baseUrl + "rulemgr/regulation/selecRegulationTypeList";
            delete param.pId;
            common.fetchPost(sURL, param, function(data){
                tableData = data.list;
                tableData = eventHandle.handleTableData(tableData);
                var cols=eventHandle.getCols(data.object.columns);

                mainTable = table.render(common.tableInitParams({
                    elem: '#table',
                    data: tableData,
                    page: false,
                    limit: 10000,
                    height: 'full-138',
                    cols: cols,
                    done: function(res, curr, count){
                        /*for(var i=3;i<cols[0].length;i++){
                            var item = cols[0][i];
                            var field = item.field;

                            $("td[data-field=" + field + "] div").each(function(index,item){
                                var number = parseInt(item.innerText);
                                // if(number > 0){
                                //     $(item).html("<i class='fa fa-check-circle green'></i>");
                                // }else{
                                //     $(item).html("<i class='fa fa-minus-circle danger'></i>");
                                // }
                                $(item).html(number);
                            });
                        }*/
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
                            param.seId = data.id;
                            param.pId = data.id;
                            var sURL = baseUrl + "rulemgr/regulation/selecRegulationTypeList";

                            if(data.seLevel < 2 || data.pId==='-1'){
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
                                common.fetchPost(sURL, param, function (data) {
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

                      /*  table.on('row(table)', function(obj){

                            var data = obj.data;
                            // var param = {seId: data.id, isIncludeChild: true, pId: data.id};

                        });*/
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
            eventHandle.initTable();
            eventHandle.treeInit();
            //初始化选项卡
            // var tabData = eventHandle.initTab();
            //获取表格列数据
            // var cols = eventHandle.initCols(tabData);/
            //初始化表格

            //上报状态搜索切换
            form.on('radio(uploadStatusRadio)',function (obj) {
                delete param.pId;
                param.flowStatusCode=obj.value;

                param.seId = curTreeNode.id;
                //eventHandle.initTab();

                var sURL = baseUrl + "rulemgr/regulation/selecRegulationTypeList";
                var commonLayer=common.layerLoader();
                common.fetchPost(sURL, param, function(data){
                    tableData = data.list;
                    var resultData = eventHandle.handleTableData();
                    mainTable.reload({data: resultData,cols:eventHandle.getCols(data.object.columns)});
                    layer.close(commonLayer);
                },function(data){
                    layer.msg(data.resultMessage);
                    layer.close(commonLayer);
                });
            });
            form.on('switch(switch)', function (data) {
                if (data.elem.checked) {
                    param.isIncludeChild = true;
                }else{
                    param.isIncludeChild = false;
                }

                param.seId = curTreeNode.id;
                delete param.pId;


                eventHandle.initTab();
                var sURL = baseUrl + "rulemgr/regulation/selecRegulationTypeList";
                var commonLayer=common.layerLoader();
                common.fetchPost(sURL, param, function(data){
                    tableData = data.list;
                    var resultData = eventHandle.handleTableData();
                    mainTable.reload({data: resultData,cols:eventHandle.getCols(data.object.columns)});
                    layer.close(commonLayer);
                },function(data){
                    layer.msg(data.resultMessage);
                    layer.close(commonLayer);
                });

            });
            //详情列表事件
            $(document).off('click','.jczd');
            $(document).on('click','.jczd',function () {
                var dataSeId=$(this).attr('data-seId');

                common.tableLayerInitData({
                    title:'制度列表',
                    type:'jczd',
                    where:{
                        seId:dataSeId,
                        flowStatusCode:param.flowStatusCode,
                        pageSource:'ruleStatistics',
                        regulationTypeId:param.regulationTypeId,
                        isIncludeChild: param.isIncludeChild?'true':'false'
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
        var cacluHeight = $(document).height() - $("#mainMenuTab").height() - $(".layui-card-header").height() - 85;
        $("#leftTree").css({
            "height": cacluHeight + "px",
            "overflow-y": "auto"
        });
    }
});
