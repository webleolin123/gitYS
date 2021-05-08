/**
 @Name：数据权限
 @Author：gaoli
 @updateTime : 2019-09-17

 */
layui.config({
    base: '../../../src/js/',
    // version: new Date().getTime()
    version: 'v1'
}).extend({}).use(['eleTree', 'layer', 'table', 'form', 'laytpl', 'common', 'util', 'transfer'], function () {
    var table = layui.table;
    var form = layui.form;
    var tree = layui.eleTree;
    var common = layui.common;
    var util = layui.util;
    var transfer = layui.transfer;
    var baseUrl = '../../../../';
    common.themeSet();


    table.render(common.tableInitParams({
        elem: '#table1',
        url: baseUrl + 'sysmgr/dataAuth/queryDataAuthPage',
        method: 'post',
        toolbar: '#tableToolBar',
        cols: [
            [
                {type: 'checkbox'},
                {type: 'numbers', title: '排序'},
                {field: 'menuName', title: '菜单名称', sort: true, minWidth: 130},
                {field: 'ggCreateUser', title: '创建人', sort: true, minWidth: 130},
                {field: 'ggCreateDatetime', title: '创建时间', width: 188, sort: true},
                {field: 'authDesc', title: '数据权限描述', sort: true, width: 150},
                {field: '', title: '操作', width: 430, toolbar: '#tableOper', fixed: 'right'}
            ]
        ],
        done: function () {
            common.buttonLimit();
        }
    }));

    //table监听事件
    table.on('toolbar(table1)', function (obj) {

        var checkStatus = table.checkStatus(obj.config.id);
        // var data = obj.data;
        var data = obj.config;
        switch (obj.event) {
            case 'add':
                var roleLayer = layer.open({
                    offset: '10%',
                    title: '新增数据权限角色',
                    maxmin: false,
                    type: 1,//页面层
                    area: ['80%'],//高度自适应
                    btn: ['保存', '关闭'],
                    btnAlign: "c",
                    content: $('.menuLayer').html(),//加载该区域的html
                    success: function (obj) {
                        var parent = $(obj.selector);
                        //菜单树加载
                        common.fetchGet('sysmgr/menu/selectSysMenuTree', function (res) {
                            parent.find('.menuLoadArea').hide();
                            var menuTree = tree.render({
                                elem: parent.find('#menuTree'),
                                data: res.list,
                                showCheckbox: false,
                                lazy: true,
                                load: function (data, callback) {
                                    common.fetchGet('sysmgr/menu/selectSysMenuTree' + '?id=' + data.id, function (res) {
                                        if (res.success && res.list) {
                                            callback(res.list);
                                        }
                                    }, function () {
                                        callback([])
                                    });
                                }
                            });
                            tree.on("nodeClick(menuTree)", function (obj) {
                                parent.find('.menuText').html('选中菜单为： <b>' + obj.data.currentData.name + '</b>').attr({
                                    'id': null,
                                    'smPid': obj.data.currentData.id,
                                    'smPidAll': obj.data.currentData.smPidAll,
                                });
                            });
                        });
                    },
                    yes: function (index, layero) {
                        var parent = $(layero.selector);
                        var params = {
                            "authDesc": parent.find('[name=dataDesc]').val(),
                            "menuName": parent.find('.menuText b').text(),
                            "menuId": parent.find('.menuText').attr('smPid'),
                        };
                        var loader = common.layerLoader();
                        common.fetchPost('sysmgr/dataAuth/saveDataAuth', params, function (res) {
                            layer.close(loader);
                            layer.close(roleLayer);
                            if (res && res.success) {
                                table.reload('table1');
                                layer.msg('保存成功');

                            }
                        }, function (error) {
                            layer.close(loader);
                            layer.msg(error.resultMessage);
                        })
                    }
                });
                break;
            case 'delete':
                //点击删除按钮
                if (checkStatus.data.length > 0) {
                    layer.confirm('确定删除选中列?', {icon: 3, title: '提示', offset: '150px'}, function (index) {
                        var smIdArr = [];
                        for (var i = 0; i < checkStatus.data.length; i++) {
                            smIdArr.push(checkStatus.data[i]['authId'])
                        }
                        var layerLoader = common.layerLoader();
                        common.fetchGet('sysmgr/dataAuth/deleteDataAuth?ids=' + smIdArr.join(','), function (res) {
                            layer.close(layerLoader);
                            //成功之后刷新tree 以及表格
                            if (res.success) {
                                table.reload('table1');
                                layer.msg('删除成功');
                            } else {
                                layer.alert(res.resultMessage);
                            }
                        }, function () {
                            layer.close(layerLoader);
                        });

                        layer.close(index);
                    });
                } else {
                    layer.msg('请选择删除列')
                }
                break;
        }
    });

    table.on('tool(table1)', function (obj) {
        var data = obj.data;
        var authId = data.authId;
        switch (obj.event) {
            case 'edit'://编辑
                var roleLayer = layer.open({
                    offset: '10%',
                    title: '新增数据权限角色',
                    maxmin: false,
                    type: 1,//页面层
                    area: ['80%'],//高度自适应
                    btn: ['保存', '关闭'],
                    btnAlign: "c",
                    content: $('.menuLayer').html(),//加载该区域的html
                    success: function (obj) {
                        var parent = $(obj.selector);
                        //菜单树加载
                        common.fetchGet('sysmgr/menu/selectSysMenuTree', function (res) {
                            parent.find('.menuLoadArea').hide();
                            var menuTree = tree.render({
                                elem: parent.find('#menuTree'),
                                data: res.list,
                                showCheckbox: false,
                                lazy: true,
                                load: function (data, callback) {
                                    common.fetchGet('sysmgr/menu/selectSysMenuTree' + '?id=' + data.id, function (res) {
                                        if (res.success && res.list) {
                                            callback(res.list);
                                        }
                                    }, function () {
                                        callback([])
                                    });
                                }
                            });
                            tree.on("nodeClick(menuTree)", function (obj) {
                                parent.find('.menuText').html('选中菜单为： <b>' + obj.data.currentData.name + '</b>').attr({
                                    'smPid': obj.data.currentData.id
                                });
                            });
                        });
                        //数据写入
                        parent.find('[name=dataDesc]').val(data.authDesc);
                        parent.find('.menuText').html('选中菜单为： <b>' + data.menuName + '</b>').attr({
                            'smPid': data.menuId
                        });
                    },
                    yes: function (index, layero) {
                        var parent = $(layero.selector);
                        var params = {
                            "authId": data.authId,
                            "authDesc": parent.find('[name=dataDesc]').val(),
                            "menuName": parent.find('.menuText b').text(),
                            "menuId": parent.find('.menuText').attr('smPid'),
                        };
                        var loader = common.layerLoader();
                        common.fetchPost('sysmgr/dataAuth/updateDataAuth', params, function (res) {
                            layer.close(loader);
                            layer.close(roleLayer);
                            if (res && res.success) {
                                table.reload('table1');
                                layer.msg('保存成功');

                            }
                        }, function (error) {
                            layer.close(loader);
                            layer.msg(error.resultMessage);
                        })
                    }
                });
                break;
            case 'singleDel':
                var selectId = obj.data.authId;
                layer.confirm('确定删除?', {icon: 3, title: '提示', offset: '150px'}, function (index) {
                    var layerLoader = common.layerLoader();
                    common.fetchGet('sysmgr/dataAuth/deleteDataAuth?ids=' + selectId, function (res) {
                        layer.close(layerLoader);
                        if (res.success) {
                            layer.msg('删除成功', {
                                time: 4000, //20s后自动关闭
                            });
                        } else {
                            layer.alert(res.resultMessage);
                        }
                        table.reload('table1');
                    }, function () {
                        layer.close(layerLoader);
                    });
                    layer.close(index);
                });
                break;
            //目录选择
            case 'menuSelect':
                var menuTypeTree, menuListTree, menuBind;
                var menuBindDataInit;
                var menuSelectLayer = layer.open({
                    offset: '10%',
                    title: '目录选择',
                    maxmin: false,
                    type: 1,//页面层
                    area: ['85%', '80%'],//高度自适应
                    btn: ['保存', '关闭'],
                    btnAlign: "c",
                    content: $(".menuSelectLayer").show(),
                    success: function (layer1) {
                        var parent = $(layer1.selector);

                        $('.dataBaseTreeLoad').show();

                        menuTypeTree = tree.render({
                            elem: '#menuTypeTree',
                            showCheckbox: false,
                            lazy: true,
                            url: baseUrl + 'sysmgr/contentCatagory/contentCategoryTree',
                            checkOnClickNode: true,
                            highlightCurrent: true,
                            response: {
                                dataName: "list"
                            },
                            emptyText: '暂无数据',
                            load: function (data, callback) {
                                common.fetchGet('sysmgr/contentCatagory/contentCategoryTree?pid=' + data.id, function (res) {
                                    if (res.success && res.list) {
                                        callback(res.list);
                                        // if(res.list && res.list.length>0){
                                        //     $('#menuTypeTree div.eleTree-node[data-id='+data.id+'] .eleTree-node-group .eleTree-node-content').each(function () {
                                        //         $(this).click();
                                        //     });
                                        // }
                                    }
                                }, function () {
                                    callback([])
                                });
                            },
                            done: function (data) {
                                // $('#menuTypeTree .eleTree-node-content').each(function () {
                                //     $(this).click();
                                // });
                                menuTypeTree.expandAll();

                            }
                        });

                        menuListTree = tree.render({
                            elem: '#menuListTree',
                            showCheckbox: true,
                            lazy: false,
                            checkOnClickNode: true,
                            highlightCurrent: true,
                            request: {
                                name: "ciName",
                                key: "ciId",
                                id: "ciId"
                            },
                            done: function (data) {

                            },
                            emptyText: '暂无数据'
                        });

                        menuBind = tree.render({

                            elem: '#menuBind',
                            // showCheckbox: true,
                            url: baseUrl + 'sysmgr/dataAuthCatalog/listByMenu/' + data.menuId,
                            lazy: false,
                            checkOnClickNode: true,
                            highlightCurrent: true,
                            response: {
                                dataName: "list"
                            },
                            request: {
                                name: "contentName",
                                key: "contentId",
                                id: "contentId",
                            },
                            contextmenuList: ["remove"],
                            done: function (data) {
                                menuBindDataInit = data.list || [];
                            },
                            emptyText: '暂无数据'
                        });
                        tree.on("nodeRemove(menuBind)", function (d) {
                            common.fetchGet('sysmgr/dataAuthCatalog/deleteDataAuthCatalogByCatalogId?ids=' + d.data.catalogId, function (res) {
                                 menuBind.reload();
                             }, function (error) {
                                 layer.msg(error.resultMessage);
                            });

                            var currentData = d.data;

                            if(currentData){
                                if(currentData.ciId){
                                    currentData.contentId=currentData.ciId;
                                }else{
                                    currentData.ciId=currentData.contentId;
                                }
                                var key=[];

                                for (var i = 0; i < menuBindDataInit.length; i++) {
                                    if (menuBindDataInit[i]['contentId'] === currentData.contentId || menuBindDataInit[i]['ciId'] === currentData.ciId) {
                                        //删除对应数据

                                        key.push(currentData.contentId?currentData.contentId:currentData.ciId);

                                        menuBindDataInit[i] = null;
                                    }
                                }
                                //数组去重
                                menuBindDataInit = common.trimData(menuBindDataInit, 'array');

                                menuBind.remove(key);

                                // menuBind.reload({data: menuBindDataInit});

                                // menuBind.reload({data: []});

                                //判断menuListTree 是否含有该值 如果有的话 把勾选项去除
                                menuListTree.unCheckArrNodes([currentData.contentId]) //取消所有选中的节点
                            }


                        });


                        tree.on("nodeClick(menuTypeTree)", function (obj) {
                            // menuListTree
                            var url = baseUrl + 'sysmgr/catalogue/enableCatalogueOfCategory/' + obj.data.currentData.id + '?onlyTableGenerated=true';
                            common.fetchGet(url, function (res) {
                                var list = res.list || [];
                                // if (list.length > 0) {
                                //     $.map(list, function (item,index) {
                                //         list[index]['contentName']=item.ciName;
                                //         list[index]['contentId']=item.ciId;
                                //     });
                                // }
                                menuListTree.reload({data: list});

                                //如果具有已绑定目录 则勾选上节点
                                if (list.length > 0 && menuBindDataInit.length > 0) {
                                    var key = [];
                                    $.map(menuBindDataInit, function (item) {
                                        key.push(item.ciId?item.ciId:item.contentId);

                                    });

                                    menuListTree.setChecked(key);
                                }
                            });

                            // //打印出选中文字
                            // parent.find('.menu1').text(obj.data.currentData.name);
                            // parent.find('.menu2').text('无');

                        });

                        tree.on("nodeChecked(menuListTree)", function (d) {
                            var currentData = d.data.currentData;
                            currentData.contentId=currentData.ciId;
                            if (d.isChecked) {
                                //勾选的状态，需要将勾选中传入 已绑定目录树
                                // parent.find('.menu2').append('<b contentId="' + d.data.currentData['ciId'] + '" style="margin: 0 5px">' + d.data.currentData['ciName'] + '</b>');

                                currentData['contentName'] = currentData.ciName;
                                currentData['contentId'] = currentData.ciId;

                                menuBindDataInit.push(currentData);


                                menuBind.reload({data: menuBindDataInit},true);


                                // menuBind.append(null, [currentData]);
                            } else {
                                //取消勾选需要将已有数据去除
                                // parent.find('.menu2').find('[contentId=' + d.data.currentData['ciId'] + ']').remove();
                                // menuBindDataInit.(currentData);
                                var key=[];
                                for (var i = 0; i < menuBindDataInit.length; i++) {

                                    if (menuBindDataInit[i]['contentId'] === currentData.contentId || menuBindDataInit[i]['ciId'] === currentData.ciId) {
                                        //删除对应数据
                                        key.push(menuBindDataInit[i]['contentId']||menuBindDataInit[i]['ciId']);
                                        menuBindDataInit[i]=null;
                                    }
                                }
                                //数组去重
                                menuBindDataInit = common.trimData(menuBindDataInit, 'array');


                                // menuBind.remove(key);

                                menuBind.reload({data: menuBindDataInit},true);
                            }
                        });

                    },
                    yes: function (index, layero) {
                        var loader = common.layerLoader();
                        var parent = $(layero.selector);
                        var params = [];
                        /*if (parent.find('.menu2 b').length > 0) {
                            for (var i = 0; i < parent.find('.menu2 b').length; i++) {
                                params.push({
                                    "authId": authId,
                                    "contentId": $(parent.find('.menu2 b')[i]).attr('contentId'),
                                    "contentName": $(parent.find('.menu2 b')[i]).text(),
                                });
                            }
                        }*/

                        // var nodes = menuBind.getData();
                        for (var i = 0; i < menuBindDataInit.length; i++) {


                            //获取选中项
                            common.fetchPost('sysmgr/dataAuthCatalog/saveDataAuthCatalog', {
                                "authId": authId,
                                "contentId": menuBindDataInit[i].contentId,
                                "contentName": menuBindDataInit[i].contentName
                            }, function (res) {
                                layer.close(loader);
                                layer.msg('保存成功');

                                layer.close(menuSelectLayer);

                            }, function (error) {
                                layer.close(loader);
                                layer.msg(error.resultMessage);
                            }, false);
                        }


                    },
                    end: function () {
                        $(".menuSelectLayer").hide()
                    }
                });

                break;
            //目录关系联动
            case 'weidu':
                var weiduLayer = layer.open({
                    title: '目录关系联动',
                    maxmin: false,
                    type: 1,//页面层
                    area: ['90%', '600px'],//高度自适应
                    content: $('.showDealLayer').html(),
                    success: function (layero) {
                        var parent = $(layero.selector);
                        table.render({
                            elem: parent.find('#showDealTable'),
                            url: baseUrl + 'sysmgr/dataAuthCondition/queryDataAuthConditionPage',
                            method: 'post',
                            toolbar: '#tableToolBar1',
                            height: '510',
                            contentType: 'application/json',
                            response: {
                                statusName: 'code' //规定数据状态的字段名称，默认：code
                                , statusCode: 0 //规定成功的状态码，默认：0
                                , msgName: 'msg' //规定状态信息的字段名称，默认：msg
                                , countName: 'count' //规定数据总数的字段名称，默认：count
                                , dataName: 'data' //规定数据列表的字段名称，默认：data
                            },
                            parseData: function (res) { //res 即为原始返回的数据
                                return {
                                    "code": "0",
                                    "msg": res.resultMessage,
                                    "count": res.page.list ? res.page.list.length : 0,
                                    "data": res.page.list
                                };
                            },
                            where: {
                                authId: authId
                            },
                            cols: [
                                [
                                    {type: 'checkbox'},
                                    {type: 'numbers', title: '排序'},
                                    {field: 'contentName', title: '目录', sort: true},
                                    {field: 'fieldName', title: '字段', sort: true},
                                    {field: 'relation', title: '条件', sort: true},
                                    {
                                        field: 'valueSource', title: '值来源', sort: true, templet: function (rowData) {
                                            return (rowData.valueSource === '1') ? '手动输入' : '目标目录'
                                        }
                                    },
                                    {field: 'valueType', title: '值类型', sort: true},
                                    {field: 'targetContent', title: '目标目录', sort: true, templet: function (rowData) {
                                        return rowData.tails.ciName===null?"":rowData.tails.ciName;
                                    }},
                                    {field: 'fieldValue', title: '值/字段', sort: true},
                                    {field: '', title: '操作', width: 140, toolbar: '#tableOper1', fixed: 'right'}
                                ]
                            ],
                            page: true
                        });

                        table.on('toolbar(showDealTable)', function (obj) {
                            var checkStatus1 = table.checkStatus(obj.config.id);
                            var data1 = obj.config;
                            switch (obj.event) {
                                case 'add':
                                    //点击添加按钮
                                    var conditionLayer = layer.open({
                                        offset: '10%',
                                        title: '新增目录联动关系',
                                        maxmin: false,
                                        type: 1,//页面层
                                        area: ['80%', '500px'],//高度自适应
                                        btn: ['保存', '关闭'],
                                        btnAlign: "c",
                                        content: $('.conditionAdd').html(),//加载该区域的html
                                        success: function (obj) {
                                            var parent = $(obj.selector);
                                            form.render();

                                            form.on('select(condition5)', function (data) {

                                                if (data.value === "1") {
                                                    parent.find('#condition4').removeAttr('style');
                                                    parent.find('.condition6Box').show();
                                                } else {
                                                    parent.find('.condition6Box').hide();
                                                    parent.find('#condition4-icon').css({
                                                        'width': '100%',
                                                        'text-align': 'right',
                                                        'padding-right': '12px',
                                                        'border-left': 'none'
                                                    });
                                                }
                                            });

                                            //目录名称选择
                                            common.selectDataSet({
                                                elem: parent.find('[name=condition1]'),
                                                url: 'sysmgr/dataAuthCatalog/queryDataAuthCatalogList',
                                                responseList: 'list',
                                                method: 'post',//默认为get
                                                where: {
                                                    "authId": data.authId
                                                },
                                                optionText: 'contentName',
                                                optionValue: 'contentId',
                                                success: function (data) {
                                                    form.render('select');
                                                }
                                            });
                                            //字段选择
                                            parent.find('#lodash-icon').off().on('click', function () {
                                                var condition1 = parent.find('[name=condition1]').val();
                                                //导出指标项信息
                                                if (!condition1) {
                                                    layer.msg('请先选择目录');
                                                    return false;
                                                }
                                                var lodashList = layer.open({
                                                    offset: '10%',
                                                    title: ' 字段选择',
                                                    maxmin: false,
                                                    type: 1,//页面层
                                                    area: ['80%', '500px'],//高度自适应
                                                    btnAlign: "c",
                                                    content: '<div class="globalTip" style="margin-top: 15px;margin-left: 10px">\n' +
                                                        '                    <i class="fa fa-info-circle"></i>\n' +
                                                        '                    <span >双击选中字段</span>\n' +
                                                        '                </div>' +
                                                        '<ul class="lodashList" id="lodashList"></ul>',
                                                    success: function (obj) {
                                                        common.fetchGet('sysmgr/indicator/enableCatalogueIndicator/' + condition1, function (res) {
                                                            var html = '';
                                                            var data = res.list || [];
                                                            var dataMap = {};
                                                            $.map(data, function (item, index) {
                                                                //数据对象级保存
                                                                dataMap[item.cfCode] = item;
                                                                var cfRequire = '';
                                                                if (item.cfRequire) {
                                                                    cfRequire = '<b class="red">*</b>'
                                                                }
                                                                html += '<li data-name="' + item.cfName + '" data-code="' + item.cfCode + '"><span class="span1">' + cfRequire + ' ' + item.cfName + '</span><span class="span2">' + item.cfCode + '</span></li>';
                                                            });
                                                            $(obj.selector).find('#lodashList').empty().html(html);

                                                            $(obj.selector).find('#lodashList li').each(function () {
                                                                var item = $(this);
                                                                item.off().on('dblclick', function () {
                                                                    var data = dataMap[item.attr('data-code')];
                                                                    parent.find('[name=condition2]').val(data['cfCode']);
                                                                    layer.close(lodashList);
                                                                });
                                                            });
                                                        });
                                                    }
                                                });
                                            });
                                            //值选择
                                            parent.find('#condition4-icon').off().on('click', function () {
                                                var condition1 = parent.find('[name=condition1]').val();
                                                if (!condition1) {
                                                    layer.msg('请先选择目录');
                                                    return false;
                                                }
                                                if (!parent.find('[name=condition2]').val()) {
                                                    layer.msg('请先填入字段');
                                                    return false;
                                                }
                                                var valueList = layer.open({
                                                    offset: '10%',
                                                    title: '值选择',
                                                    maxmin: false,
                                                    type: 1,//页面层
                                                    area: ['80%', '500px'],//高度自适应
                                                    btnAlign: "c",
                                                    btn: ['确定', '取消'],
                                                    content: $('.valueLayer').html(),
                                                    success: function (obj1) {
                                                        var valueTableParent = $(obj1.selector);

                                                        if (parent.find('[name=condition5]').val() === "1") {
                                                            //手动输入
                                                            valueTableParent.find('#targetMenuArea').hide();
                                                            valueTableParent.find('.lodashListArea').hide();

                                                            valueTableParent.find('.condition6Box').show();

                                                            function valueTableReload(menuId) {

                                                                var columns = [];
                                                                common.fetchGet('sysmgr/indicator/enableCatalogueIndicator/' + menuId, function (res) {
                                                                    columns.push({"type": "radio", fixed: 'left'});
                                                                    for (var i = 0; i < res.list.length; i++) {
                                                                        columns.push({
                                                                            "field": res.list[i].cfCode,
                                                                            "title": res.list[i].cfCode,
                                                                            "minWidth": 120
                                                                        });
                                                                    }
                                                                    table.reload('valueTable', {
                                                                        url: baseUrl + 'sysmgr/catalogueTable/selectTableRowByCondition?catalogueId=' + menuId,
                                                                        page: {
                                                                            curr: 1
                                                                        },
                                                                        cols: [columns]
                                                                    });

                                                                }, function () {

                                                                }, false);
                                                            }

                                                            table.render(common.tableInitParams({
                                                                elem: valueTableParent.find('#valueTable'),
                                                                height: '320',
                                                                // url: baseUrl + 'sysmgr/catalogueTable/selectTableRowByCondition?catalogueId='+valueTableParent.find('[name=targetMenu]').val(),
                                                                method: 'post',
                                                                // where: {
                                                                //     catalogueId: valueTableParent.find('[name=targetMenu]').val()
                                                                // },
                                                                cols: []
                                                            }));

                                                            valueTableReload(condition1);

                                                        } else {
                                                            //目录选择
                                                            valueTableParent.find('#valueTable').hide();
                                                            valueTableParent.find('.condition6Box').hide();
                                                            function loashFun(menu, valueTableParent, valueList, parent) {
                                                                common.fetchGet('sysmgr/indicator/enableCatalogueIndicator/' + menu, function (res) {
                                                                    var html = '';
                                                                    var data = res.list || [];
                                                                    var dataMap = {};
                                                                    $.map(data, function (item, index) {
                                                                        //数据对象级保存
                                                                        dataMap[item.cfCode] = item;
                                                                        var cfRequire = '';
                                                                        if (item.cfRequire) {
                                                                            cfRequire = '<b class="red">*</b>'
                                                                        }
                                                                        html += '<li data-name="' + item.cfName + '" data-code="' + item.cfCode + '"><span class="span1">' + cfRequire + ' ' + item.cfName + '</span><span class="span2">' + item.cfCode + '</span></li>';
                                                                    });
                                                                    valueTableParent.find('#lodashList').empty().html(html);

                                                                    valueTableParent.find('#lodashList li').each(function () {
                                                                        var item = $(this);
                                                                        item.off().on('dblclick', function () {
                                                                            var data = dataMap[item.attr('data-code')];
                                                                            parent.find('[name=condition4]').val(data['cfCode']);
                                                                            parent.find('[name=condition4]').attr('targetMenu', menu);
                                                                            layer.close(valueList);
                                                                        });
                                                                    });
                                                                });
                                                            }

                                                            //目标目录
                                                            common.selectDataSet({
                                                                elem: valueTableParent.find('[name=targetMenu]'),
                                                                url: 'sysmgr/dataAuthCatalog/queryDataAuthCatalogList',
                                                                responseList: 'list',
                                                                method: 'post',//默认为get
                                                                where: {
                                                                    "authId": authId
                                                                },
                                                                optionText: 'contentName',
                                                                optionValue: 'contentId',
                                                                success: function (data) {

                                                                    valueTableParent.find('option[value=' + condition1 + ']').remove();

                                                                    form.render('select');
                                                                    if (data.list && data.list.length > 0) {
                                                                        var targetMenu = data.list[0]['contentId'];
                                                                        if (targetMenu === condition1) {
                                                                            form.val('targetMenu', {
                                                                                targetMenu: data.list[1]['contentId']
                                                                            })
                                                                        } else {
                                                                            form.val('targetMenu', {
                                                                                targetMenu: data.list[0]['contentId']
                                                                            })
                                                                        }
                                                                    }
                                                                    loashFun(valueTableParent.find('[name=targetMenu]').val(), valueTableParent, valueList, parent);
                                                                }
                                                            });

                                                            form.on('select(targetMenu)', function (data) {

                                                                loashFun(data.value, valueTableParent, valueList, parent);
                                                            });
                                                        }
                                                    },
                                                    yes: function (index, layero) {
                                                        //值带入
                                                        var checkStatus = table.checkStatus('valueTable'); //idTest 即为基础参数 id 对应的值

                                                        if (parent.find('[name=condition5]').val() === '1') {
                                                            //手动输入的情况 返回值
                                                            if (checkStatus.data && checkStatus.data[0] && checkStatus.data[0][parent.find('[name=condition2]').val()]) {
                                                                parent.find('[name=condition4]').val(checkStatus.data[0][parent.find('[name=condition2]').val()]);
                                                            }
                                                        } else {
                                                            //目标目录的情况 返回对应字段，还有目录表信息

                                                            if (checkStatus.data && checkStatus.data[0] && checkStatus.data[0][parent.find('[name=condition2]').val()]) {
                                                                parent.find('[name=condition4]').val(checkStatus.data[0][parent.find('[name=condition2]').val()]);
                                                            }
                                                        }
                                                        layer.close(valueList);
                                                    }
                                                });
                                            });

                                        },
                                        yes: function (index, layero) {
                                            var parent = $(layero.selector);

                                            var params = {
                                                "authId": authId,
                                                "contentId": parent.find('[name=condition1]').val(),
                                                "contentName": parent.find('[name=condition1] option:checked').text(),
                                                "fieldName": parent.find('[name=condition2]').val(),
                                                "relation": parent.find('[name=condition3]').val(),
                                                "fieldValue": parent.find('[name=condition4]').val(),
                                                "valueSource": parent.find('[name=condition5]').val(),
                                                "valueType": parent.find('[name=condition6]').val(),
                                                "targetContent": parent.find('[name=condition4]').attr('targetmenu')
                                            };

                                            var loader1 = common.layerLoader();
                                            common.fetchPost('sysmgr/dataAuthCondition/saveDataAuthCondition', params, function (res) {
                                                layer.close(loader1);
                                                layer.close(conditionLayer);
                                                if (res && res.success) {
                                                    table.reload('showDealTable');
                                                    layer.msg('保存成功');
                                                }
                                            }, function (error) {
                                                layer.close(loader1);
                                                layer.msg(error.resultMessage);
                                            });
                                        }
                                    });
                                    break;
                                case 'delete':
                                    //点击删除按钮
                                    if (checkStatus1.data.length > 0) {
                                        layer.confirm('确定删除选中列?', {
                                            icon: 3,
                                            title: '提示',
                                            offset: '150px'
                                        }, function (index) {
                                            var smIdArr = [];
                                            for (var i = 0; i < checkStatus1.data.length; i++) {
                                                smIdArr.push(checkStatus1.data[i]['conditionId'])
                                            }
                                            var layerLoader = common.layerLoader();
                                            common.fetchGet('sysmgr/dataAuthCondition/deleteDataAuthCondition?ids=' + smIdArr.join(','), function (res) {
                                                layer.close(layerLoader);
                                                //成功之后刷新tree 以及表格
                                                if (res.success) {
                                                    table.reload('showDealTable');
                                                    layer.msg('删除成功');
                                                } else {
                                                    layer.alert(res.resultMessage);
                                                }
                                            }, function () {
                                                layer.close(layerLoader);
                                            });

                                            layer.close(index);
                                        });
                                    } else {
                                        layer.msg('请选择删除列')
                                    }
                                    break;
                            }
                        });
                        table.on('tool(showDealTable)', function (obj) {
                            var data1 = obj.data;
                            var conditionId = data1.conditionId;
                            switch (obj.event) {
                                case 'edit'://编辑
                                    var conditionLayer = layer.open({
                                        offset: '10%',
                                        title: '编辑',
                                        maxmin: false,
                                        type: 1,//页面层
                                        area: ['80%', '500px'],
                                        btn: ['保存', '关闭'],
                                        btnAlign: "c",
                                        content: $('.conditionAdd').html(),
                                        success: function (obj) {
                                            var parent = $(obj.selector);
                                            form.render();

                                            form.on('select(condition5)', function (data) {

                                                if (data.value === "1") {
                                                    parent.find('#condition4').removeAttr('style');
                                                    parent.find('.condition6Box').show();
                                                } else {
                                                    parent.find('.condition6Box').hide();
                                                    parent.find('#condition4-icon').css({
                                                        'width': '100%',
                                                        'text-align': 'right',
                                                        'padding-right': '12px',
                                                        'border-left': 'none'
                                                    });
                                                }
                                            });

                                            //目录名称选择
                                            common.selectDataSet({
                                                elem: parent.find('[name=condition1]'),
                                                url: 'sysmgr/dataAuthCatalog/queryDataAuthCatalogList',
                                                responseList: 'list',
                                                method: 'post',//默认为get
                                                where: {
                                                    "authId": data.authId
                                                },
                                                optionText: 'contentName',
                                                optionValue: 'contentId',
                                                success: function (data) {
                                                    form.render('select');
                                                }
                                            });
                                            //字段选择
                                            parent.find('#lodash-icon').off().on('click', function () {
                                                var condition1 = parent.find('[name=condition1]').val();
                                                //导出指标项信息
                                                if (!condition1) {
                                                    layer.msg('请先选择目录');
                                                    return false;
                                                }
                                                var lodashList = layer.open({
                                                    offset: '10%',
                                                    title: ' 字段选择',
                                                    maxmin: false,
                                                    type: 1,//页面层
                                                    area: ['80%', '500px'],//高度自适应
                                                    btnAlign: "c",
                                                    content: '<div class="globalTip" style="margin-top: 15px;margin-left: 10px">\n' +
                                                        '                    <i class="fa fa-info-circle"></i>\n' +
                                                        '                    <span >双击选中字段</span>\n' +
                                                        '                </div>' +
                                                        '<ul class="lodashList" id="lodashList"></ul>',
                                                    success: function (obj) {
                                                        common.fetchGet('sysmgr/indicator/enableCatalogueIndicator/' + condition1, function (res) {
                                                            var html = '';
                                                            var data = res.list || [];
                                                            var dataMap = {};
                                                            $.map(data, function (item, index) {
                                                                //数据对象级保存
                                                                dataMap[item.cfCode] = item;
                                                                var cfRequire = '';
                                                                if (item.cfRequire) {
                                                                    cfRequire = '<b class="red">*</b>'
                                                                }
                                                                html += '<li data-name="' + item.cfName + '" data-code="' + item.cfCode + '"><span class="span1">' + cfRequire + ' ' + item.cfName + '</span><span class="span2">' + item.cfCode + '</span></li>';
                                                            });
                                                            $(obj.selector).find('#lodashList').empty().html(html);

                                                            $(obj.selector).find('#lodashList li').each(function () {
                                                                var item = $(this);
                                                                item.off().on('dblclick', function () {
                                                                    var data = dataMap[item.attr('data-code')];
                                                                    parent.find('[name=condition2]').val(data['cfCode']);
                                                                    layer.close(lodashList);
                                                                });
                                                            });
                                                        });
                                                    }
                                                });
                                            });
                                            //值选择
                                            parent.find('#condition4-icon').off().on('click', function () {
                                                var condition1 = parent.find('[name=condition1]').val();
                                                if (!condition1) {
                                                    layer.msg('请先选择目录');
                                                    return false;
                                                }
                                                if (!parent.find('[name=condition2]').val()) {
                                                    layer.msg('请先填入字段');
                                                    return false;
                                                }
                                                var valueList = layer.open({
                                                    offset: '10%',
                                                    title: '值选择',
                                                    maxmin: false,
                                                    type: 1,//页面层
                                                    area: ['80%', '500px'],//高度自适应
                                                    btnAlign: "c",
                                                    btn: ['确定', '取消'],
                                                    content: $('.valueLayer').html(),
                                                    success: function (obj1) {
                                                        var valueTableParent = $(obj1.selector);

                                                        if (parent.find('[name=condition5]').val() === "1") {
                                                            //手动输入
                                                            valueTableParent.find('#targetMenuArea').hide();
                                                            valueTableParent.find('.lodashListArea').hide();

                                                            function valueTableReload(menuId) {

                                                                var columns = [];
                                                                common.fetchGet('sysmgr/indicator/enableCatalogueIndicator/' + menuId, function (res) {
                                                                    columns.push({"type": "radio", fixed: 'left'});
                                                                    for (var i = 0; i < res.list.length; i++) {
                                                                        columns.push({
                                                                            "field": res.list[i].cfCode,
                                                                            "title": res.list[i].cfCode,
                                                                            "minWidth": 120
                                                                        });
                                                                    }
                                                                    table.reload('valueTable', {
                                                                        url: baseUrl + 'sysmgr/catalogueTable/selectTableRowByCondition?catalogueId=' + menuId,
                                                                        page: {
                                                                            curr: 1
                                                                        },
                                                                        cols: [columns]
                                                                    });

                                                                }, function () {

                                                                }, false);
                                                            }

                                                            table.render(common.tableInitParams({
                                                                elem: valueTableParent.find('#valueTable'),
                                                                height: '320',
                                                                // url: baseUrl + 'sysmgr/catalogueTable/selectTableRowByCondition?catalogueId='+valueTableParent.find('[name=targetMenu]').val(),
                                                                method: 'post',
                                                                // where: {
                                                                //     catalogueId: valueTableParent.find('[name=targetMenu]').val()
                                                                // },
                                                                cols: []
                                                            }));

                                                            valueTableReload(condition1);

                                                        } else {
                                                            //目录选择
                                                            valueTableParent.find('#valueTable').hide();

                                                            function loashFun1(menu) {
                                                                common.fetchGet('sysmgr/indicator/enableCatalogueIndicator/' + menu, function (res) {
                                                                    var html = '';
                                                                    var data = res.list || [];
                                                                    var dataMap = {};
                                                                    $.map(data, function (item, index) {
                                                                        //数据对象级保存
                                                                        dataMap[item.cfCode] = item;
                                                                        var cfRequire = '';
                                                                        if (item.cfRequire) {
                                                                            cfRequire = '<b class="red">*</b>'
                                                                        }
                                                                        html += '<li data-name="' + item.cfName + '" data-code="' + item.cfCode + '"><span class="span1">' + cfRequire + ' ' + item.cfName + '</span><span class="span2">' + item.cfCode + '</span></li>';
                                                                    });
                                                                    valueTableParent.find('#lodashList').empty().html(html);

                                                                    valueTableParent.find('#lodashList li').each(function () {
                                                                        var item = $(this);
                                                                        item.off().on('dblclick', function () {
                                                                            var data = dataMap[item.attr('data-code')];
                                                                            parent.find('[name=condition4]').val(data['cfCode']);
                                                                            parent.find('[name=condition4]').attr('targetMenu', menu);
                                                                            layer.close(valueList);
                                                                        });
                                                                    });
                                                                });
                                                            }

                                                            //目标目录
                                                            common.selectDataSet({
                                                                elem: valueTableParent.find('[name=targetMenu]'),
                                                                url: 'sysmgr/dataAuthCatalog/queryDataAuthCatalogList',
                                                                responseList: 'list',
                                                                method: 'post',//默认为get
                                                                where: {
                                                                    "authId": authId
                                                                },
                                                                optionText: 'contentName',
                                                                optionValue: 'contentId',
                                                                success: function (data) {

                                                                    valueTableParent.find('option[value=' + condition1 + ']').remove();

                                                                    form.render('select');
                                                                    if (data.list && data.list.length > 0) {
                                                                        var targetMenu = data.list[0]['contentId'];
                                                                        if (targetMenu === condition1) {
                                                                            form.val('targetMenu', {
                                                                                targetMenu: data.list[1]['contentId']
                                                                            })
                                                                        } else {
                                                                            form.val('targetMenu', {
                                                                                targetMenu: data.list[0]['contentId']
                                                                            })
                                                                        }
                                                                    }
                                                                    loashFun1(valueTableParent.find('[name=targetMenu]').val());
                                                                }
                                                            });

                                                            form.on('select(targetMenu)', function (data) {

                                                                loashFun1(data.value);
                                                            });
                                                        }
                                                    },
                                                    yes: function (index, layero) {
                                                        //值带入
                                                        var checkStatus = table.checkStatus('valueTable'); //idTest 即为基础参数 id 对应的值

                                                        if (parent.find('[name=condition5]').val() === '1') {
                                                            //手动输入的情况 返回值
                                                            if (checkStatus.data && checkStatus.data[0] && checkStatus.data[0][parent.find('[name=condition2]').val()]) {
                                                                parent.find('[name=condition4]').val(checkStatus.data[0][parent.find('[name=condition2]').val()]);
                                                            }
                                                        } else {
                                                            //目标目录的情况 返回对应字段，还有目录表信息

                                                            if (checkStatus.data && checkStatus.data[0] && checkStatus.data[0][parent.find('[name=condition2]').val()]) {
                                                                parent.find('[name=condition4]').val(checkStatus.data[0][parent.find('[name=condition2]').val()]);
                                                            }
                                                        }
                                                        layer.close(valueList);
                                                    }
                                                });
                                            });

                                            //数据导入
                                            var loader = common.layerLoader();

                                            common.fetchGet('sysmgr/dataAuthCondition/getDataAuthConditionById?id=' + conditionId, function (res) {
                                                layer.close(loader);
                                                var resData = res.object;
                                                parent.find('[name=condition1]').val(resData.contentId);
                                                parent.find('[name=condition2]').val(resData.fieldName);
                                                parent.find('[name=condition3]').val(resData.relation);
                                                parent.find('[name=condition4]').val(resData.fieldValue);
                                                parent.find('[name=condition5]').val(resData.valueSource);
                                                parent.find('[name=condition6]').val(resData.valueType);
                                                parent.find('[name=condition4]').attr('targetmenu', resData.targetContent);
                                                form.render('select');
                                            });
                                        },
                                        yes: function (index, layero) {
                                            var parent = $(layero.selector);

                                            var params = {
                                                "conditionId": data1.conditionId,
                                                "authId": authId,
                                                "contentId": parent.find('[name=condition1]').val(),
                                                "contentName": parent.find('[name=condition1] option:checked').text(),
                                                "fieldName": parent.find('[name=condition2]').val(),
                                                "relation": parent.find('[name=condition3]').val(),
                                                "fieldValue": parent.find('[name=condition4]').val(),
                                                "valueSource": parent.find('[name=condition5]').val(),
                                                "valueType": parent.find('[name=condition6]').val(),
                                                "targetContent": parent.find('[name=condition4]').attr('targetmenu')
                                            };

                                            var loader1 = common.layerLoader();
                                            common.fetchPost('sysmgr/dataAuthCondition/updateDataAuthCondition', params, function (res) {
                                                layer.close(loader1);
                                                layer.close(conditionLayer);
                                                if (res && res.success) {
                                                    table.reload('showDealTable');
                                                    layer.msg('保存成功');
                                                }
                                            }, function (error) {
                                                layer.close(loader1);
                                                layer.msg(error.resultMessage);
                                            });

                                        }
                                    });
                                    break;
                                case 'singleDel':
                                    var selectId = obj.data.conditionId;
                                    layer.confirm('确定删除?', {
                                        icon: 3,
                                        title: '提示',
                                        offset: '150px'
                                    }, function (index) {
                                        var layerLoader = common.layerLoader();
                                        common.fetchGet('sysmgr/dataAuthCondition/deleteDataAuthCondition?ids=' + selectId, function (res) {
                                            layer.close(layerLoader);
                                            if (res.success) {
                                                layer.msg('删除成功', {
                                                    time: 4000, //20s后自动关闭
                                                });
                                            } else {
                                                layer.alert(res.resultMessage);
                                            }
                                            table.reload('showDealTable');
                                        }, function () {
                                            layer.close(layerLoader);
                                        });
                                        layer.close(index);
                                    });
                                    break;
                            }
                        });
                    },
                    yes: function (index, layero) {
                        var parent = $(layero.selector);
                        var params = {
                            roleName: parent.find('[name=form1]').val(),
                            highLevel: parent.find('[name=form2]:checked').val(),
                            roleDesc: parent.find('[name=form3]').val(),
                            roleId: roleId
                        };
                        var loader = common.layerLoader();
                        common.fetchPost('sysmgr/dataAuthRole/updateDataAuthRole', params, function (res) {
                            layer.close(loader);
                            layer.close(roleLayer);
                            if (res && res.success) {
                                table.reload('table1');
                                layer.msg('保存成功');

                            }
                        }, function (error) {
                            layer.close(loader);
                            layer.msg(error.resultMessage);
                        })
                    }
                });
                break;
            //展示效果配置
            case 'showSet':
                var showSetLayer = layer.open({
                    offset: '10%',
                    title: '展示效果配置',
                    maxmin: false,
                    type: 1,//页面层
                    area: ['80%', '500px'],//高度自适应
                    content: $('.showSetLayerMain').html(),
                    success: function (layero) {
                        var parent = $(layero.selector);
                        form.render();

                        //表格数据导入
                        common.fetchPost('sysmgr/dataAuthCatalog/queryDataAuthCatalogList', {"authId": authId}, function (res) {
                            if (res && res.list) {
                                var dataList = res.list || [];
                                table.render(common.tableInitParams({
                                    elem: parent.find('#showSetTable'),
                                    data: dataList,
                                    height: '420',
                                    cols: [
                                        [
                                            {"type": "numbers", "title": "序号"},
                                            {field: 'contentName', title: '目录', sort: true, minWidth: 180},
                                            {
                                                field: 'showType', title: '返回值', sort: true, minWidth: 100,
                                                templet: function (rowData) {
                                                    return (rowData["showType"] == "tree") ? '树' : '列表';
                                                }
                                            },
                                            {
                                                field: 'rootNode', title: '根节点类型', sort: true, minWidth: 130,
                                                templet: function (rowData) {
                                                    return rowData["rootNode"] ? '具体值' : '虚拟值'
                                                }
                                            },
                                            {field: 'rootNode', title: '根节点', sort: true, minWidth: 100},
                                            {field: 'showField', title: '名称对应字段', sort: true, minWidth: 145,},
                                            {field: 'showValue', title: '值对应字段', sort: true, minWidth: 145},
                                            {field: 'pidField', title: 'PID', sort: true, minWidth: 100},
                                            {
                                                field: '',
                                                title: '操作',
                                                width: 100,
                                                toolbar: '#showSetTableOper',
                                                fixed: 'right'
                                            }
                                        ]
                                    ],
                                    page: true,
                                    done: function () {

                                    }
                                }));

                                table.on('tool(showSetTable)', function (obj2) {
                                    var data = obj2.data;
                                    var authId = data.authId;
                                    var contentId = data.contentId;
                                    switch (obj2.event) {
                                        case 'edit'://编辑
                                            var showSetLayer1 = layer.open({
                                                offset: '10%',
                                                title: '配置',
                                                maxmin: false,
                                                type: 1,//页面层
                                                area: ['80%'],//高度自适应
                                                btn: ['保存', '关闭'],
                                                btnAlign: "c",
                                                content: $('.showSetLayer').html(),//加载该区域的html
                                                success: function (obj11) {
                                                    var parent = $(obj11.selector);
                                                    form.render();

                                                    //跟节点
                                                    form.on('radio(showSet3)', function (data) {
                                                        if (data.value === '2') {
                                                            parent.find('#showSet3Input').show();
                                                        } else {
                                                            parent.find('#showSet3Input').hide();
                                                        }
                                                    });

                                                    //根节点ID值
                                                    parent.find('#showSet3-choose').off().on('click', function () {
                                                        var condition1 = parent.find('[name=showSet1]').attr('data-showset1');
                                                        //导出指标项信息
                                                        if (!condition1) {
                                                            layer.msg('请先选择目录');
                                                            return false;
                                                        }
                                                        var lodashList = layer.open({
                                                            offset: '10%',
                                                            title: ' 字段选择',
                                                            maxmin: false,
                                                            type: 1,//页面层
                                                            area: ['80%', '500px'],//高度自适应
                                                            btnAlign: "c",
                                                            content: '<div class="globalTip" style="margin-top: 15px;margin-left: 10px">\n' +
                                                                '                    <i class="fa fa-info-circle"></i>\n' +
                                                                '                    <span >双击选中字段</span>\n' +
                                                                '                </div>' +
                                                                '<ul class="lodashList" id="lodashList"></ul>',
                                                            success: function (obj) {
                                                                common.fetchGet('sysmgr/indicator/enableCatalogueIndicator/' + condition1, function (res) {
                                                                    var html = '';
                                                                    var data = res.list || [];
                                                                    var dataMap = {};
                                                                    $.map(data, function (item, index) {
                                                                        //数据对象级保存
                                                                        dataMap[item.cfCode] = item;
                                                                        var cfRequire = '';
                                                                        if (item.cfRequire) {
                                                                            cfRequire = '<b class="red">*</b>'
                                                                        }
                                                                        html += '<li data-name="' + item.cfName + '" data-code="' + item.cfCode + '"><span class="span1">' + cfRequire + ' ' + item.cfName + '</span><span class="span2">' + item.cfCode + '</span></li>';
                                                                    });
                                                                    $(obj.selector).find('#lodashList').empty().html(html);

                                                                    $(obj.selector).find('#lodashList li').each(function () {
                                                                        var item = $(this);
                                                                        item.off().on('dblclick', function () {
                                                                            var data = dataMap[item.attr('data-code')];
                                                                            parent.find('[name=showSet3Input]').val(data['cfCode']);
                                                                            layer.close(lodashList);
                                                                        });
                                                                    });
                                                                });
                                                            }
                                                        });
                                                    });

                                                    //名称对应字段
                                                    parent.find('#showSet4-choose').off().on('click', function () {
                                                        var condition1 = parent.find('[name=showSet1]').attr('data-showset1');
                                                        //导出指标项信息
                                                        if (!condition1) {
                                                            layer.msg('请先选择目录');
                                                            return false;
                                                        }
                                                        var lodashList = layer.open({
                                                            offset: '10%',
                                                            title: ' 字段选择',
                                                            maxmin: false,
                                                            type: 1,//页面层
                                                            area: ['80%', '500px'],//高度自适应
                                                            btnAlign: "c",
                                                            content: '<div class="globalTip" style="margin-top: 15px;margin-left: 10px">\n' +
                                                                '                    <i class="fa fa-info-circle"></i>\n' +
                                                                '                    <span >双击选中字段</span>\n' +
                                                                '                </div>' +
                                                                '<ul class="lodashList" id="lodashList"></ul>',
                                                            success: function (obj) {
                                                                common.fetchGet('sysmgr/indicator/enableCatalogueIndicator/' + condition1, function (res) {
                                                                    var html = '';
                                                                    var data = res.list || [];
                                                                    var dataMap = {};
                                                                    $.map(data, function (item, index) {
                                                                        //数据对象级保存
                                                                        dataMap[item.cfCode] = item;
                                                                        var cfRequire = '';
                                                                        if (item.cfRequire) {
                                                                            cfRequire = '<b class="red">*</b>'
                                                                        }
                                                                        html += '<li data-name="' + item.cfName + '" data-code="' + item.cfCode + '"><span class="span1">' + cfRequire + ' ' + item.cfName + '</span><span class="span2">' + item.cfCode + '</span></li>';
                                                                    });
                                                                    $(obj.selector).find('#lodashList').empty().html(html);

                                                                    $(obj.selector).find('#lodashList li').each(function () {
                                                                        var item = $(this);
                                                                        item.off().on('dblclick', function () {
                                                                            var data = dataMap[item.attr('data-code')];
                                                                            parent.find('[name=showSet4]').val(data['cfCode']);
                                                                            layer.close(lodashList);
                                                                        });
                                                                    });
                                                                });
                                                            }
                                                        });
                                                    });

                                                    //值对应字段
                                                    parent.find('#showSet5-choose').off().on('click', function () {
                                                        var condition1 = parent.find('[name=showSet1]').attr('data-showset1');
                                                        //导出指标项信息
                                                        if (!condition1) {
                                                            layer.msg('请先选择目录');
                                                            return false;
                                                        }
                                                        var lodashList = layer.open({
                                                            offset: '10%',
                                                            title: ' 字段选择',
                                                            maxmin: false,
                                                            type: 1,//页面层
                                                            area: ['80%', '500px'],//高度自适应
                                                            btnAlign: "c",
                                                            content: '<div class="globalTip" style="margin-top: 15px;margin-left: 10px">\n' +
                                                                '                    <i class="fa fa-info-circle"></i>\n' +
                                                                '                    <span >双击选中字段</span>\n' +
                                                                '                </div>' +
                                                                '<ul class="lodashList" id="lodashList"></ul>',
                                                            success: function (obj) {
                                                                common.fetchGet('sysmgr/indicator/enableCatalogueIndicator/' + condition1, function (res) {
                                                                    var html = '';
                                                                    var data = res.list || [];
                                                                    var dataMap = {};
                                                                    $.map(data, function (item, index) {
                                                                        //数据对象级保存
                                                                        dataMap[item.cfCode] = item;
                                                                        var cfRequire = '';
                                                                        if (item.cfRequire) {
                                                                            cfRequire = '<b class="red">*</b>'
                                                                        }
                                                                        html += '<li data-name="' + item.cfName + '" data-code="' + item.cfCode + '"><span class="span1">' + cfRequire + ' ' + item.cfName + '</span><span class="span2">' + item.cfCode + '</span></li>';
                                                                    });
                                                                    $(obj.selector).find('#lodashList').empty().html(html);

                                                                    $(obj.selector).find('#lodashList li').each(function () {
                                                                        var item = $(this);
                                                                        item.off().on('dblclick', function () {
                                                                            var data = dataMap[item.attr('data-code')];
                                                                            parent.find('[name=showSet5]').val(data['cfCode']);
                                                                            layer.close(lodashList);
                                                                        });
                                                                    });
                                                                });
                                                            }
                                                        });
                                                    });

                                                    //PID对应字段
                                                    parent.find('#showSet6-choose').off().on('click', function () {
                                                        var condition1 = parent.find('[name=showSet1]').attr('data-showset1');
                                                        //导出指标项信息
                                                        if (!condition1) {
                                                            layer.msg('请先选择目录');
                                                            return false;
                                                        }
                                                        var lodashList = layer.open({
                                                            offset: '10%',
                                                            title: ' 字段选择',
                                                            maxmin: false,
                                                            type: 1,//页面层
                                                            area: ['80%', '500px'],//高度自适应
                                                            btnAlign: "c",
                                                            content: '<div class="globalTip" style="margin-top: 15px;margin-left: 10px">\n' +
                                                                '                    <i class="fa fa-info-circle"></i>\n' +
                                                                '                    <span >双击选中字段</span>\n' +
                                                                '                </div>' +
                                                                '<ul class="lodashList" id="lodashList"></ul>',
                                                            success: function (obj) {
                                                                common.fetchGet('sysmgr/indicator/enableCatalogueIndicator/' + condition1, function (res) {
                                                                    var html = '';
                                                                    var data = res.list || [];
                                                                    var dataMap = {};
                                                                    $.map(data, function (item, index) {
                                                                        //数据对象级保存
                                                                        dataMap[item.cfCode] = item;
                                                                        var cfRequire = '';
                                                                        if (item.cfRequire) {
                                                                            cfRequire = '<b class="red">*</b>'
                                                                        }
                                                                        html += '<li data-name="' + item.cfName + '" data-code="' + item.cfCode + '"><span class="span1">' + cfRequire + ' ' + item.cfName + '</span><span class="span2">' + item.cfCode + '</span></li>';
                                                                    });
                                                                    $(obj.selector).find('#lodashList').empty().html(html);

                                                                    $(obj.selector).find('#lodashList li').each(function () {
                                                                        var item = $(this);
                                                                        item.off().on('dblclick', function () {
                                                                            var data = dataMap[item.attr('data-code')];
                                                                            parent.find('[name=showSet6]').val(data['cfCode']);
                                                                            layer.close(lodashList);
                                                                        });
                                                                    });
                                                                });
                                                            }
                                                        });
                                                    });

                                                    //目标目录对应字段
                                                    parent.find('#showSet7-choose').off().on('click', function () {
                                                        var valueList = layer.open({
                                                            offset: '10%',
                                                            title: '值选择',
                                                            maxmin: false,
                                                            type: 1,//页面层
                                                            area: ['80%', '500px'],//高度自适应
                                                            btnAlign: "c",
                                                            btn: ['确定', '取消'],
                                                            content: $('.valueLayer').html(),
                                                            success: function (obj1) {
                                                                var valueTableParent = $(obj1.selector);
                                                                var condition1 = parent.find('[name=showSet1]').attr('data-showset1');

                                                                //目录选择
                                                                valueTableParent.find('#valueTable').hide();

                                                                function loashFun1(menu) {
                                                                    common.fetchGet('sysmgr/indicator/enableCatalogueIndicator/' + menu, function (res) {
                                                                        var html = '';
                                                                        var data = res.list || [];
                                                                        var dataMap = {};
                                                                        $.map(data, function (item, index) {
                                                                            //数据对象级保存
                                                                            dataMap[item.cfCode] = item;
                                                                            var cfRequire = '';
                                                                            if (item.cfRequire) {
                                                                                cfRequire = '<b class="red">*</b>'
                                                                            }
                                                                            html += '<li data-name="' + item.cfName + '" data-code="' + item.cfCode + '"><span class="span1">' + cfRequire + ' ' + item.cfName + '</span><span class="span2">' + item.cfCode + '</span></li>';
                                                                        });
                                                                        valueTableParent.find('#lodashList').empty().html(html);

                                                                        valueTableParent.find('#lodashList li').each(function () {
                                                                            var item = $(this);
                                                                            item.off().on('dblclick', function () {
                                                                                var data = dataMap[item.attr('data-code')];
                                                                                parent.find('[name=condition4]').val(data['cfCode']);
                                                                                parent.find('[name=condition4]').attr('targetMenu', menu);
                                                                                layer.close(valueList);
                                                                            });
                                                                        });
                                                                    });
                                                                }

                                                                //目标目录
                                                                common.selectDataSet({
                                                                    elem: valueTableParent.find('[name=targetMenu]'),
                                                                    url: 'sysmgr/dataAuthCatalog/queryDataAuthCatalogList',
                                                                    responseList: 'list',
                                                                    method: 'post',//默认为get
                                                                    where: {
                                                                        "authId": authId
                                                                    },
                                                                    optionText: 'contentName',
                                                                    optionValue: 'contentId',
                                                                    success: function (data) {

                                                                        valueTableParent.find('option[value=' + condition1 + ']').remove();

                                                                        form.render('select');
                                                                        if (data.list && data.list.length > 0) {
                                                                            var targetMenu = data.list[0]['contentId'];
                                                                            if (targetMenu === condition1) {
                                                                                form.val('targetMenu', {
                                                                                    targetMenu: data.list[1]['contentId']
                                                                                })
                                                                            } else {
                                                                                form.val('targetMenu', {
                                                                                    targetMenu: data.list[0]['contentId']
                                                                                })
                                                                            }
                                                                        }
                                                                        loashFun1(valueTableParent.find('[name=targetMenu]').val());
                                                                    }
                                                                });

                                                                form.on('select(targetMenu)', function (data) {

                                                                    loashFun1(data.value);
                                                                });
                                                            },
                                                            yes: function (index, layero) {
                                                                //值带入
                                                                var checkStatus = table.checkStatus('valueTable'); //idTest 即为基础参数 id 对应的值

                                                                if (parent.find('[name=condition5]').val() === '1') {
                                                                    //手动输入的情况 返回值
                                                                    if (checkStatus.data && checkStatus.data[0] && checkStatus.data[0][parent.find('[name=condition2]').val()]) {
                                                                        parent.find('[name=condition4]').val(checkStatus.data[0][parent.find('[name=condition2]').val()]);
                                                                    }
                                                                } else {
                                                                    //目标目录的情况 返回对应字段，还有目录表信息

                                                                    if (checkStatus.data && checkStatus.data[0] && checkStatus.data[0][parent.find('[name=condition2]').val()]) {
                                                                        parent.find('[name=condition4]').val(checkStatus.data[0][parent.find('[name=condition2]').val()]);
                                                                    }
                                                                }
                                                                layer.close(valueList);
                                                            }
                                                        });
                                                    });


                                                    //默认值导入
                                                    var loader = common.layerLoader();
                                                    var params = {
                                                        "authId": authId,
                                                        "contentId": contentId
                                                    };
                                                    common.fetchPost('sysmgr/dataAuthCatalog/queryDataAuthCatalogList', params, function (res) {
                                                        if (res && res.list && res.list.length > 0) {

                                                            for (var i = 0; i < res.list.length; i++) {
                                                                var item = res.list[i];
                                                                if (item.pidField) {


                                                                    if (item.rootNode) {
                                                                        parent.find('#showSet3Input').show()
                                                                    } else {
                                                                        parent.find('#showSet3Input').hide()
                                                                    }

                                                                    break;
                                                                }
                                                            }
                                                        }
                                                        layer.close(loader);
                                                    });

                                                    //值导入
                                                    parent.find('[name=showSet1]').attr('data-showSet1', data.contentId);
                                                    form.val('showSetForm', {
                                                        showSet1: data.contentName,
                                                        showSet2: data.showType,
                                                        showSet3: data.rootNode ? "2" : "1",
                                                        showSet4: data.showField,
                                                        showSet5: data.showValue,
                                                        showSet6: data.pidField,
                                                        showSet7: data.targetField,
                                                        showSet3Input: data.rootNode
                                                    });
                                                    if (data.rootNode) {
                                                        parent.find('#showSet3Input').show()
                                                    } else {
                                                        parent.find('#showSet3Input').hide()
                                                    }
                                                    form.render('select');

                                                },
                                                yes: function (index, layero1) {
                                                    var parent = $(layero1.selector);

                                                    var rootNode;


                                                    if (parent.find('[name=showSet3]:checked').val() === '1') {
                                                        rootNode = null;
                                                    } else {
                                                        rootNode = parent.find('.showSet3Input').val()
                                                    }
                                                    var params = {
                                                        "authId": data.authId,
                                                        "catalogId": data.catalogId,
                                                        "contentId": parent.find('[name=showSet1]').attr('data-showSet1'),
                                                        "contentName": parent.find('[name=showSet1]').val(),
                                                        "pidField": parent.find('[name=showSet6]').val(),
                                                        "rootNode": rootNode,
                                                        "showField": parent.find('[name=showSet4]').val(),
                                                        "showType": parent.find('[name=showSet2]').val(),
                                                        "showValue": parent.find('[name=showSet5]').val(),
                                                        "targetField": parent.find('[name=showSet7]').val(),
                                                        "targetCatalog": parent.find('[name=showSet7]').attr('data-showSet7')
                                                    };

                                                    var loader = common.layerLoader();
                                                    common.fetchPost('sysmgr/dataAuthCatalog/updateDataAuthCatalog', params, function (res) {

                                                        layer.close(showSetLayer1);
                                                        if (res && res.success) {

                                                            common.fetchPost('sysmgr/dataAuthCatalog/queryDataAuthCatalogList', {"authId": authId}, function (res) {
                                                                layer.close(loader);
                                                                table.reload('showSetTable', {
                                                                    data: res.list || []
                                                                });
                                                            }, function (err) {
                                                                layer.close(loader);
                                                                layer.alert(err.resultMessage);
                                                            });

                                                            layer.msg('保存成功');
                                                        }
                                                    }, function (error) {
                                                        layer.close(loader);
                                                        layer.msg(error.resultMessage);
                                                    });


                                                }
                                            });
                                            break;
                                    }
                                });

                            }

                        });



                    },
                    yes: function (index, layero) {
                        var parent = $(layero.selector);

                        var rootNode;


                        if (parent.find('[name=showSet3]:checked').val() === '1') {
                            rootNode = null;
                        } else {
                            rootNode = parent.find('.showSet3Input').val()
                        }
                        var params = {
                            "authId": data.authId,
                            "contentId": parent.find('[name=showSet1]').val(),
                            "contentName": parent.find('[name=showSet1] option:checked').text(),
                            "pidField": parent.find('[name=showSet6]').val(),
                            "rootNode": rootNode,
                            "showField": parent.find('[name=showSet4]').val(),
                            "showType": parent.find('[name=showSet2]').val(),
                            "showValue": parent.find('[name=showSet5]').val(),
                            "targetField": parent.find('[name=showSet7]').val(),
                            "targetCatalog": parent.find('[name=showSet7]').attr('data-showSet7')
                        };
                        var loader = common.layerLoader();
                        common.fetchPost('sysmgr/dataAuthCatalog/saveDataAuthCatalog', params, function (res) {
                            layer.close(loader);
                            layer.close(showSetLayer);
                            if (res && res.success) {
                                table.reload('table1');
                                layer.msg('保存成功');
                            }
                        }, function (error) {
                            layer.close(loader);
                            layer.msg(error.resultMessage);
                        })
                    }
                });
                break;
        }
    });
    //查询
    form.on('submit(formSearch)', function (obj) {
        //表格重载
        table.reload('table1', {
            page: {
                curr: 1
            },
            where: {
                menuName: obj.field.menuName
            },
        });
        return false;
    });
    common.buttonLimit();

    common.columnSide();
});
