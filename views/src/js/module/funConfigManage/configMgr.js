/**
 @Name：功能管理页面
 @Author：gaoli
 */
// import css from './../../../css/public.scss';

layui.config({
    base: '../../../src/js/',
    version: new Date().getTime()
}).extend({
    custom: 'common/custom',
}).use(['form', 'eleTree', 'custom', 'layer', 'table', 'laytpl'], function () {
    var form = layui.form,
        common = layui.common,
        custom = layui.custom,
        layer = layui.layer,
        table = layui.table;
    var tree = layui.eleTree;

    common.themeSet();

    common.toggleArea($('.toggle-btn'), $('.toggle-area'));

    var baseUrl = '../../../';
    var projectCpdeMap = {};

    // projectCode
    common.selectDataSet({
        elem: $('[name=projectCode]'),
        url: 'sysmgr/dicts/selectDictListByPcode?dictPCode=projectCode',
        responseList: 'list',
        method: 'get',//默认为get
        optionText: 'sdName',
        optionValue: 'sdCode',
        success: function (data) {
            if (data && data.list && data.list.length > 0) {
                $.map(data.list, function (item) {
                    projectCpdeMap[item.sdCode] = item;
                });
            }
            form.render('select');
        }
    });
    var eventHandle = {
        tableLoad: function () {
            table.render(common.tableInitParams({
                elem: '#configTable',
                url: baseUrl + 'compmgr/webComponent/pageTopWebComponent',
                method: 'post',
                loading: true,
                toolbar: '#tableToolBar',
                request: {
                    pageName: 'pageNumber',
                    limitName: 'pageSize'
                },
                height: 'full-170',
                cols: [
                    [
                        {type: 'checkbox'},
                        {field: 'wumiId', title: 'ID', sort: true, minWidth: 150},
                        {field: 'wumiChname', title: '页面名称', sort: true, minWidth: 150},
                        {
                            field: 'wumiProjectCode',
                            title: '项目分类',
                            sort: true,
                            width: 120,
                            templet: function (rowData) {
                                if (rowData['wumiProjectCode'] && projectCpdeMap[rowData['wumiProjectCode']] && projectCpdeMap[rowData['wumiProjectCode']]['sdName']) {
                                    return projectCpdeMap[rowData['wumiProjectCode']]['sdName']
                                } else {
                                    return ''
                                }
                            }
                        },
                        {
                            field: 'tails.wtmiTypename', title: '页面类型', width: 120,
                            templet: function (rowData) {
                                return rowData["tails"]["wtmiTypename"];
                            }
                        },
                        {field: 'smId', title: '菜单绑定', width: 160, templet: '#switchMenu', unresize: true},
                        {field: '', title: '操作', width: 300, toolbar: '#tableOper', fixed: 'right'}
                    ]
                ]
            }));

        },
        tableReload: function () {
            table.reload('configTable', {
                page: {
                    curr: 1
                }
                /* where:{
                     name:'',
                 }*/

            });
        }
    };


    //表格加载
    eventHandle.tableLoad();

    //table监听事件
    table.on('toolbar(configTable)', function (obj) {
        var checkStatus = table.checkStatus(obj.config.id);
        switch (obj.event) {
            case 'add':
                //点击添加按钮
                var addLayer = top.layer.open({
                    title: '新增页面',
                    type: 2,
                    content: baseUrl + 'src/page/custom/config.html',
                    maxmin: true,

                    success: function () {
                        //默认触发点击 清空所有配置

                    }
                });
                top.layer.full(addLayer);
                break;
            case 'refresh':
                //刷新表格
                eventHandle.tableLoad();
                break;
            case 'delete':
                //点击删除按钮
                if (checkStatus.data.length > 0) {
                    top.layer.confirm('确定删除选中行?', {icon: 3, title: '提示', offset: '150px'}, function (index) {
                        var smIdArr = [];

                        for (var i = 0; i < checkStatus.data.length; i++) {
                            smIdArr.push(checkStatus.data[i]['wumiId'])
                        }
                        var layerLoader = common.layerLoader();
                        common.fetchDelete('compmgr/webComponent/topWebComponent?compIds=' + smIdArr.join(','), function (res) {

                            if (res.success) {
                                layer.close(layerLoader);

                                eventHandle.tableReload();
                                layer.msg('删除成功');

                            } else {
                                layer.msg('删除失败');
                            }

                        }, function () {
                            layer.close(layerLoader);
                        });


                        top.layer.close(index);
                    });
                } else {
                    layer.msg('请选择删除列')
                }
                break;
        }
    });

    //绑定菜单管理
    form.on('switch(switchMenu)', function (objSwitch) {
        if (objSwitch.elem.checked) {
            //打开菜单绑定
            var menuLlayer = layer.open({
                title: '菜单绑定',
                type: 1,
                area: ['700px'],
                content: $('#menuSet').html(),
                id: 'bindMenuBox',
                btn: ['确定', '取消'],
                success: function (obj) {
                    var parent = $(obj.selector);

                    form.render();

                    //默认数据写入
                    form.val("menuLayer", {
                        smName: $(objSwitch.elem).attr('data-compName'),
                        url: 'custom/custom?' + $(objSwitch.elem).attr('data-compId')
                    });
                    //选择图标
                    $(obj.selector).find("#icon-choose").on('click', function () {
                        common.iconLayerSelect('input[name="smIcon"]')
                    });


                    common.fetchGet('sysmgr/menu/selectSysMenuTree', function (res) {

                        parent.find('.menuLoadArea').hide();
                        var eleTreeId = tree.render({
                            elem: '#treeLeft',
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
                        tree.on("nodeClick(treeLeft)", function (obj) {
                            parent.find('.menuText').text('菜单上级是： ' + obj.data.currentData.name).attr({
                                'id': null,
                                'smPid': obj.data.currentData.id,
                                'smPidAll': obj.data.currentData.smPidAll,
                            });
                        });
                    });
                },
                btnAlign: 'c',
                yes: function (index, layero) {

                    var params = {
                        ggSort: $(layero).find('[name=ggSort]').val(),
                        smCode: $(layero).find('[name=smCode]').val(),
                        smIcon: $(layero).find('[name=smIcon]').val(),
                        smId: '',
                        smLinkType: $(layero).find('[name=smLinkType]').val(),
                        smName: $(layero).find('[name=smName]').val(),
                        smPid: $(layero).find('.menuText').attr('smPid'),
                        smPidAll: $(layero).find('.menuText').attr('smPidAll') ? $(layero).find('.menuText').attr('smPidAll') : ('-1,' + $(layero).find('.menuText').attr('smPid')),
                        smType: $(layero).find('[name=smType]').val(),
                        smUrl: 'custom/custom?' + $(objSwitch.elem).attr('data-compId')
                    };

                    var layerLoader = common.layerLoader();
                    common.fetchPost('sysmgr/menu/saveSysMenu', params, function (data) {
                        if (data.success) {
                            //组件绑定到刚新增的菜单
                            /*  var menuParam={
                                  "compId":$(objSwitch.elem).attr('data-compId'),
                                  "forceBind":true,
                                  "menuId":data.object
                              };*/
                            common.fetchGet('compmgr/webComponent/bindTopWebComponentToMenu?compId=' + $(objSwitch.elem).attr('data-compId') + '&forceBind=true&' + 'menuId=' + data.object, function (res) {
                                layer.msg('绑定成功');
                                layer.close(layerLoader);
                                layer.close(menuLlayer)
                            }, function (error) {
                                layer.close(layerLoader);
                                layer.msg(error.resultMessage);//失败后提示
                                layer.close(menuLlayer)
                            });
                        } else {
                            layer.msg(data.resultMessage);//失败后提示
                        }

                    }, function (error) {
                        layer.close(layerLoader);
                        layer.msg(error.resultMessage);//失败后提示
                        layer.close(menuLlayer)
                    });
                    return false

                },
                btn2: function (index, layero) {
                    $(objSwitch.elem).attr('checked', false);
                    form.render();
                    layer.close(menuLlayer);
                    return false;

                },
                cancel: function (index, layero) {

                    $(objSwitch.elem).attr('checked', false);
                    form.render();
                    layer.close(menuLlayer);
                }
            });

        } else {
            //确定解除绑定菜单

            layer.confirm('确定解除绑定？', {icon: 3, title: '提示', offset: '150px'}, function (index, layero) {
                //删除该目录
                var smIds = $(objSwitch.elem).attr('data-smIds');
                common.fetchDelete('sysmgr/menu/deleteSysMenuByIds?smIds=' + smIds, function (res) {
                    if (res.success) {
                        layer.msg('解绑成功');
                    } else {
                        layer.msg('解绑失败');
                    }
                });
            }, function (index, layero) {
                //刷新当前行
            });

        }
        // layer.tips(this.value + ' ' + this.name + '：'+ obj.elem.checked, obj.othis);
    });

    table.on('tool(configTable)', function (obj) {
        var data = obj.data;
        switch (obj.event) {
            case 'edit'://编辑
                //原始数据导入
                var editLayer = top.layer.open({
                    title: '编辑',
                    type: 2,
                    content: baseUrl + 'src/page/custom/config.html',
                    maxmin: true,
                    success: function (layero, index) {
                        //获取单页面的所有配置内容 传入compId

                        $("#compId", layero.find("iframe")[0].contentWindow.document).text(data['wumiId']);

                    }
                });

                top.layer.full(editLayer);
                break;

            case 'copy': //复制
                if (data.wumiId) {
                    var confirmLayer = top.layer.confirm('确定复制页面:' + data['wumiChname'] + '(' + data.wumiId + ')', {
                        icon: 3,
                        title: '提示'
                    }, function () {

                        common.fetchGet('compmgr/webComponent/componentInfo?compId=' + data.wumiId, function (res) {
                            var data = res.list;

                            var copyData = JSON.stringify(data);

                            $.map(data, function (item, index) {
                                // copyData=copyData.replace(item.compId,common.uuid(),"g");
                                copyData = common.replaceAll(copyData, item.compId, common.uuid());
                            });

                            var trueData = JSON.parse(copyData);

                            $.map(trueData, function (item, index) {

                                if (item.parentCompId === "-1") {
                                    trueData[index]['compName'] = trueData[index]['compName'] + '_' + common.randomCode();
                                }

                                trueData[index]['parentCompPath'] = '';

                            });

                            common.fetchPost('compmgr/webComponent/componentInfo', trueData, function (res) {

                                //刷新表格
                                $('#refreshBtn').trigger('click');

                            });

                            layer.msg('复制成功');
                            top.layer.close(confirmLayer);


                        }, function () {
                            layer.msg('配置数据获取失败');
                        });
                    });

                } else {
                    layer.msg('未获取到模板ID');
                }
                break;

            case 'preview': //预览
                if (data.wumiId) {

                    var layerLoader = common.layerLoader();

                    common.fetchGet('compmgr/webComponent/componentInfo?compId=' + data.wumiId, function (res) {
                        var data = res.list;
                        //根据所有配置项，生成页面
                        $('#compData').val(JSON.stringify(data));
                        layer.close(layerLoader);
                        window.open(window.location.origin + '/src/page/custom/preview.html');

                    }, function () {
                        layer.close(layerLoader);
                        layer.msg('配置数据获取失败');
                    });
                } else {
                    layer.close(layerLoader);
                    layer.msg('未获取到模板ID');
                }
                break;
        }
    });
    //查询
    form.on('submit(formSearch)', function (obj) {
        //表格重载
        table.reload('configTable', {
            page: {
                curr: 0
            },
            where: {
                paras: {
                    wumiChname: obj.field.qsdName,
                    wumiId: obj.field.wumiId,
                    wumiProjectCode: obj.field.projectCode
                }
            }
        });
        return false;
    });

});
