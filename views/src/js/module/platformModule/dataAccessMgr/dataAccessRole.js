layui.config({
    base: '../../../src/js/',
    version: new Date().getTime()
}).extend({}).use(['eleTree', 'layer', 'table', 'form', 'laytpl', 'common'], function () {
    var table = layui.table;
    var form = layui.form;
    var tree = layui.eleTree;
    var common = layui.common;
    var baseUrl = '../../../../';
    common.themeSet();


    var menuMap = {};

    //目录名称选择
    common.selectDataSet({
        elem: $('[name=menuId]'),
        url: 'sysmgr/dataAuth/queryDataAuthList',
        responseList: 'list',
        method: 'post',//默认为get
        where: {},
        optionText: 'menuName',
        optionValue: 'authId',
        success: function (data) {
            if (data && data.list && data.list.length > 0) {
                $.map(data.list, function (item) {
                    menuMap[item.authId] = item;
                });
            }

            form.render('select');
        }
    });


    table.render(common.tableInitParams({
        elem: '#table1',
        url: baseUrl + 'sysmgr/dataAuthRole/queryDataAuthRolePage',
        method: 'post',
        toolbar: '#tableToolBar',
        cols: [
            [
                {type: 'checkbox'},
                {type: 'numbers', title: '排序'},
                {field: 'roleName', title: '数据角色名称', sort: true},
                {
                    field: 'authId', title: '菜单名称', sort: true,
                    templet: function (rowData) {
                        if (menuMap[rowData['authId']]) {
                            return menuMap[rowData['authId']]['menuName']
                        }
                    }
                },
                {field: 'roleDesc', title: '数据角色描述', sort: true},
                {
                    field: 'highLevel', title: '最高等级', width: 120, sort: true, templet: function (rowData) {
                        return (rowData.tails.highLevel === 1) ? ('<span class="layui-badge layui-bg-green">是</span>') : ('<span class="layui-badge layui-bg-danger">否</span>')
                    }
                },
                {field: '', title: '操作', width: 370, toolbar: '#tableOper', fixed: 'right'}
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
                //点击添加按钮
                var roleLayer = layer.open({
                    offset: '10%',
                    title: '新增数据权限角色',
                    maxmin: false,
                    type: 1,//页面层
                    area: ['580px'],//高度自适应
                    btn: ['保存', '关闭'],
                    btnAlign: "c",
                    content: $('.menuLayer').html(),//加载该区域的html
                    success: function (obj) {
                        var parent = $(obj.selector);
                        form.render();
                        //目录名称选择
                        common.selectDataSet({
                            elem: parent.find('[name=form0]'),
                            url: 'sysmgr/dataAuth/queryDataAuthList',
                            responseList: 'list',
                            method: 'post',//默认为get
                            where: {},
                            optionText: 'menuName',
                            optionValue: 'authId',
                            success: function (data) {
                                form.render('select');
                            }
                        });
                    },
                    yes: function (index, layero) {
                        var parent = $(layero.selector);
                        var params = {
                            authId: parent.find('[name=form0]').val(),
                            roleName: parent.find('[name=form1]').val(),
                            highLevel: parent.find('[name=form2]:checked').val() === "1" ? 1 : 0,
                            roleDesc: parent.find('[name=form3]').val()
                        };
                        var loader = common.layerLoader();
                        common.fetchPost('sysmgr/dataAuthRole/saveDataAuthRole', params, function (res) {
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
                            smIdArr.push(checkStatus.data[i]['roleId'])
                        }
                        var layerLoader = common.layerLoader();
                        common.fetchGet('sysmgr/dataAuthRole/deleteDataAuthRole?ids=' + smIdArr.join(','), function (res) {
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
        var roleId = data.roleId;
        var authId = data.authId;
        switch (obj.event) {
            case 'edit'://编辑
                var roleLayer = layer.open({
                    offset: '10%',
                    title: '编辑数据权限角色',
                    maxmin: false,
                    type: 1,//页面层
                    area: ['580px'],//高度自适应
                    btn: ['保存', '关闭'],
                    btnAlign: "c",
                    content: $('.menuLayer').html(),//加载该区域的html
                    success: function (layer) {
                        var parent = $(layer.selector);
                        form.render();
                        //目录名称选择
                        common.selectDataSet({
                            elem: parent.find('[name=form0]'),
                            url: 'sysmgr/dataAuth/queryDataAuthList',
                            responseList: 'list',
                            method: 'post',//默认为get
                            where: {},
                            optionText: 'menuName',
                            optionValue: 'authId',
                            success: function (data) {
                                form.render('select');
                            }
                        });


                        form.val('addForm', {
                            form0: data.authId,
                            form1: data.roleName,
                            form2: (data.highLevel === 1) ? "1" : "0",
                            form3: data.roleDesc
                        });

                    },
                    yes: function (index, layero) {
                        var parent = $(layero.selector);
                        var params = {
                            roleName: parent.find('[name=form1]').val(),
                            highLevel: (parent.find('[name=form2]:checked').val() === "1") ? 1 : 0,
                            roleDesc: parent.find('[name=form3]').val(),
                            roleId: roleId,
                            authId: parent.find('[name=form0]').val()
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
            case 'singleDel':
                var selectId = obj.data.roleId;
                layer.confirm('确定删除?', {icon: 3, title: '提示', offset: '150px'}, function (index) {
                    var layerLoader = common.layerLoader();
                    common.fetchGet('sysmgr/dataAuthRole/deleteDataAuthRole?ids=' + selectId, function (res) {
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
            //目录联动关系
            case 'showDeal':
                var showDealLayer = layer.open({
                    title: '目录关系联动',
                    maxmin: false,
                    type: 1,//页面层
                    area: ['90%', '600px'],//高度自适应
                    content: $('.showDealLayer').html(),
                    success: function (layero) {
                        var parent = $(layero.selector);
                        table.render({
                            elem: parent.find('#showDealTable'),
                            url: baseUrl + 'sysmgr/dataAuthRoleCondition/queryDataAuthRoleConditionPage',
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
                                authId: authId,
                                role: roleId,
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
                                    {field: 'targetContent', title: '目标目录', sort: true},
                                    {field: 'fieldValue', title: '值', sort: true},
                                    {field: '', title: '操作', width: 140, toolbar: '#tableOper1', fixed: 'right'}
                                ]
                            ]
                        });

                        table.on('toolbar(showDealTable)', function (obj) {
                            var checkStatus = table.checkStatus(obj.config.id);
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
                                                                    if (data.length > 0) {
                                                                        $.map(data, function (item, index) {
                                                                            //数据对象级保存
                                                                            dataMap[item.cfCode] = item;
                                                                            var cfRequire = '';
                                                                            if (item.cfRequire) {
                                                                                cfRequire = '<b class="red">*</b>'
                                                                            }
                                                                            html += '<li data-name="' + item.cfName + '" data-code="' + item.cfCode + '"><span class="span1">' + cfRequire + ' ' + item.cfName + '</span><span class="span2">' + item.cfCode + '</span></li>';
                                                                        });
                                                                    } else {
                                                                        html = '<div>暂无数据</div>';
                                                                    }

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
                                                "fieldValue": parent.find('[name=condition4]').val(),
                                                "relation": parent.find('[name=condition3]').val(),
                                                "roleId": roleId,
                                                "targetContent": parent.find('[name=condition4]').attr('targetmenu'),
                                                "valueType": parent.find('[name=condition6]').val(),
                                                "valueSource": parent.find('[name=condition5]').val(),

                                            };
                                            var loader1 = common.layerLoader();
                                            common.fetchPost('sysmgr/dataAuthRoleCondition/saveDataAuthRoleCondition', params, function (res) {
                                                layer.close(loader1);
                                                layer.close(conditionLayer);
                                                if (res && res.success) {
                                                    table.reload('showDealTable');
                                                    layer.msg('保存成功');
                                                }
                                            }, function (error) {
                                                layer.close(loader1);
                                                layer.msg(error.resultMessage);
                                            })
                                        }
                                    });
                                    break;
                                case 'delete':
                                    //点击删除按钮
                                    if (checkStatus.data.length > 0) {
                                        layer.confirm('确定删除选中列?', {
                                            icon: 3,
                                            title: '提示',
                                            offset: '150px'
                                        }, function (index) {
                                            var smIdArr = [];
                                            for (var i = 0; i < checkStatus.data.length; i++) {
                                                smIdArr.push(checkStatus.data[i]['conditionId'])
                                            }
                                            var layerLoader = common.layerLoader();
                                            common.fetchGet('sysmgr/dataAuthRoleCondition/deleteDataAuthRoleCondition?ids=' + smIdArr.join(','), function (res) {
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
                            var data = obj.data;
                            var conditionId = data.conditionId;
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

                                            //目录名称选择
                                            common.selectDataSet({
                                                elem: parent.find('[name=condition1]'),
                                                url: 'sysmgr/dataAuthCatalog/queryDataAuthCatalogList',
                                                responseList: 'list',
                                                method: 'post',//默认为get
                                                where: {
                                                    "authId": authId
                                                },
                                                optionText: 'contentName',
                                                optionValue: 'contentId',
                                                success: function (data) {
                                                    form.render('select');
                                                }
                                            });

                                            //数据导入
                                            var loader = common.layerLoader();

                                            common.fetchGet('sysmgr/dataAuthRoleCondition/getDataAuthRoleConditionById?id=' + conditionId, function (res) {
                                                layer.close(loader);
                                                var resData = res.object;
                                                parent.find('[name=condition1]').val(resData.contentId);
                                                parent.find('[name=condition2]').val(resData.fieldName);
                                                parent.find('[name=condition3]').val(resData.relation);
                                                parent.find('[name=condition4]').val(resData.fieldValue);
                                                form.render('select');
                                            });

                                        },
                                        yes: function (index, layero) {
                                            var parent = $(layero.selector);
                                            var params = {
                                                "conditionId": data.conditionId,
                                                "authId": authId,
                                                "contentId": parent.find('[name=condition1]').val(),
                                                "contentName": parent.find('[name=condition1] option:checked').text(),
                                                "fieldName": parent.find('[name=condition2]').val(),
                                                "fieldValue": parent.find('[name=condition4]').val(),
                                                "relation": parent.find('[name=condition3]').val()
                                            };
                                            var loader1 = common.layerLoader();
                                            common.fetchPost('sysmgr/dataAuthRoleCondition/updateDataAuthRoleCondition', params, function (res) {
                                                layer.close(loader1);
                                                layer.close(conditionLayer);
                                                if (res && res.success) {
                                                    table.reload('showDealTable');
                                                    layer.msg('保存成功');
                                                }
                                            }, function (error) {
                                                layer.close(loader1);
                                                layer.msg(error.resultMessage);
                                            })
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
                                        common.fetchGet('sysmgr/dataAuthRoleCondition/deleteDataAuthRoleCondition?ids=' + selectId, function (res) {
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
                            layer.close(showDealLayer);
                            if (res && res.success) {
                                table.reload('table1');
                                layer.msg('保存成功');
                            }
                        }, function (error) {
                            layer.close(loader);
                            layer.msg(error.resultMessage);
                        });
                    }
                });
                break;
            //用户权限
            case 'dataAccessConfig':
                var menuSelectTree;
                var treeDataMap = {};
                var allocatePersonnelInitData = [];
                var allocatePersonnelTree;
                var dataAccessConfigLayer = layer.open({
                    offset: '10%',
                    title: '用户权限',
                    maxmin: false,
                    type: 1,//页面层
                    area: ['580px'],//高度自适应
                    btn: ['保存', '关闭'],
                    btnAlign: "c",
                    content: $('.dataAccessConfig').html(),
                    success: function (layer) {
                        var parent = $(layer.selector);
                        var userData = [];

                        common.fetchGet('sysmgr/dataAuthRoleUser/queryDataAuthRoleTree', function (res) {
                            // common.fetchGet('sysmgr/sysUser/querySysUserList', function (res) {
                            if (res && res.list) {
                                if (res.list.length > 0) {
                                    // $.map(res.list, function (item) {
                                    //     // if (item.suType === 'ordinary') {
                                    //     //     userData.push(item)
                                    //     // }
                                    //     if(!item.pid){
                                    //         item.pid=-1
                                    //     }
                                    // });

                                    userData = common.arrayToTreeJson(res.list, "id", "pid", "children");

                                    allocatePersonnelTree = tree.render(common.treeInitParams({
                                        elem: parent.find('#allocatePersonnelTree'),
                                        data: userData,
                                        showCheckbox: true,
                                        lazy: false,
                                        highlightCurrent: true,
                                        defaultExpandAll: true,
                                        request: {
                                            name: "name",
                                            key: "id",
                                            children: "children",
                                            checked: "checked",
                                            disabled: "chkDisabled",
                                            isLeaf: "isLeaf",
                                            extendAttr: "extendAttr"
                                        },
                                    }));
                                    //默认值写入

                                    common.fetchPost('sysmgr/dataAuthRoleUser/queryDataAuthRoleUserList', {
                                        "roleId": roleId,
                                        "authId": authId
                                    }, function (resBack) {
                                        if (resBack && resBack.list && resBack.list.length > 0) {
                                            var arr = [];
                                            for (var i = 0; i < resBack.list.length; i++) {
                                                arr.push(resBack.list[i]['userId'])
                                            }
                                            allocatePersonnelInitData = arr;
                                            allocatePersonnelTree.setChecked(arr);
                                        }
                                    }, null, false);
                                }
                            }
                        }, function () {

                        }, false);

                        menuSelectTree = tree.render(common.treeInitParams({
                            elem: parent.find('#menuSelectTree'),
                            url: baseUrl + 'sysmgr/dataAuthCatalog/queryDataAuthCatalogList',
                            method: 'post',
                            showCheckbox: true,
                            lazy: false,
                            contentType: 'application/json',
                            where: {
                                "authId": data.authId,
                                // "roleId":data.roleId
                            },
                            request: {
                                name: "contentName",
                                key: "catalogId",
                                children: "children",
                                checked: "checked",
                                disabled: "disabled",
                                isLeaf: "catalogId",
                                extendAttr: "extendAttr"
                            },
                            highlightCurrent: true,
                            done: function (res) {
                                $.map(res.list, function (item, index) {

                                    treeDataMap[item.catalogId] = item;
                                    treeDataMap[item.contentName] = item;
                                });

                                //已有值绑定
                                common.fetchPost('sysmgr/dataAuthRoleCatalog/queryDataAuthRoleCatalogList', {
                                    "authId": authId,
                                    "roleId": roleId
                                }, function (res) {
                                    if (res && res.list && res.list.length > 0) {
                                        var arr = [];
                                        for (var i = 0; i < res.list.length; i++) {
                                            arr.push(res.list[i]['catalogId'])
                                        }
                                        menuSelectTree.setChecked(arr);
                                    }
                                });

                            }
                        }));
                    },
                    yes: function (index, layero) {
                        var params = [];

                        //保存人员信息
                        var menuNodes1 = allocatePersonnelTree.getChecked(false, false);
                        //遍历出只有用户的节点，排除企业和部门


                        if (menuNodes1 && menuNodes1.length > 0) {
                            $.map(menuNodes1, function (nodes) {
                                if (nodes.extendAttr === 'user') {
                                    params.push({
                                        "userId": nodes.id,
                                        "roleId": roleId,
                                        "authId": authId
                                    });
                                }
                            });
                        }

                        var loader = common.layerLoader();

                        var params2 = [];
                        //获取勾选的目录并保存
                        var menuNodes = menuSelectTree.getChecked(false, false);


                        if (menuNodes.length > 0) {
                            $.map(menuNodes, function (nodes) {
                                params2.push({
                                    "catalogId": treeDataMap[nodes.contentName].catalogId,
                                    "catalogName": treeDataMap[nodes.contentName].contentName,
                                    "authId": authId,
                                    "roleId": roleId
                                });
                            });
                        }

                        //目录选择
                        common.fetchPost('sysmgr/dataAuthRoleCatalog/saveDataAuthRoleCatalog', params2, function (res) {

                            if (res && res.success) {

                                //分配人员
                                //先删除分配人员

                                // allocatePersonnelInitData
                                if (allocatePersonnelInitData && allocatePersonnelInitData.length > 0) {
                                    common.fetchGet('sysmgr/dataAuthRoleUser/deleteDataAuthRoleUser?ids=' + allocatePersonnelInitData.join(','), null, null, false);
                                }


                                //保存分配人员信息
                                common.fetchPost('sysmgr/dataAuthRoleUser/saveDataAuthRoleUser', params, function (res) {

                                    if (res && res.success) {
                                        layer.msg('保存成功');
                                    } else {
                                        layer.alert(res.resultMessage);
                                    }

                                    layer.close(loader);

                                }, function (error) {
                                    layer.msg(error.resultMessage);
                                    layer.close(loader);
                                }, false);


                            } else {

                                layer.alert(res.resultMessage);

                            }

                            layer.close(dataAccessConfigLayer);
                            layer.close(loader);

                        }, function (error) {
                            layer.msg(error.resultMessage);
                            layer.close(loader);
                            layer.close(dataAccessConfigLayer);
                        }, false);

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
                roleName: obj.field.roleName,
                authId: obj.field.menuId
            }
        });
        return false;
    });

    common.buttonLimit();
    common.columnSide();
});
