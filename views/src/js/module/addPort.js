/**
 @Name：添加端口
 @Author：gaoli
 @updateTime : 2019-07-22

 */

layui.config({
    base: '../../../src/js/',
    version: new Date().getTime()
}).extend({}).use(['layer', 'table', 'form', 'eleTree', 'laytpl', 'common', 'element', 'util'], function () {
    var table = layui.table;
    var form = layui.form;
    var common = layui.common;
    var element = layui.element;
    var util = layui.util;
    var eleTree = layui.eleTree;
    element.init();
    var baseUrl = '../../../';
    common.themeSet();
    var editData;
    var editDataPublic;


    var eventHandle = {

        domEvent: function () {

            //选择图标
            $("#icon-choose").on('click', function () {
                common.iconLayerSelect('input[name="smIcon"]')
            });

            $('#port-choose').off().on('click', function () {

                var methodTmp = layer.open({
                    title: '接口方法',
                    maxmin: false,
                    type: 1,//页面层
                    area: ['1000px', '520px'],//高度自适应
                    content: $('.methodTmp').html(),//加载该区域的html
                    success: function (obj) {
                        var parent = $(obj.selector);
                        //设置树组件的高度
                        // $('#dataBaseTree').css('height',($(document).height()-300)+'px');
                        $('.dataBaseTreeLoad').show();
                        var catalogueId;
                        //目录分类列表
                        common.fetchGet('sysmgr/contentCatagory/contentCategoryTree', function (res) {
                            $('.dataBaseTreeLoad').hide();
                            //树信息的导入
                            if (res.success && res.list) {

                                eleTree.render({
                                    elem: parent.find('#menuTypeTree'),
                                    data: res.list,
                                    showCheckbox: false,
                                    lazy: true,
                                    checkOnClickNode: true,
                                    highlightCurrent: true,
                                    emptyText: '暂无数据',
                                    load: function (data, callback) {
                                        common.fetchGet('sysmgr/contentCatagory/contentCategoryTree?pid=' + data.id, function (res) {
                                            if (res.success && res.list) {
                                                callback(res.list)
                                            }
                                        }, function () {
                                            callback([])
                                        });
                                    }
                                });

                            } else {
                                //不存在数据时的显示
                            }
                        }, function () {
                        });

                        var menuListTree = eleTree.render({
                            elem: parent.find('#menuListTree'),
                            data: [],
                            showCheckbox: false,
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

                        //高度设置
                        parent.find('.eleTree').css({
                            'height': ($(window).height() - 300) + 'px'
                        });


                        eleTree.on("nodeClick(menuTypeTree)", function (obj) {
                            // menuListTree
                            var url = baseUrl + 'sysmgr/catalogue/enableCatalogueOfCategory/' + obj.data.currentData.id + '?onlyTableGenerated=true';
                            common.fetchGet(url, function (res) {
                                menuListTree.reload({data: res.list});
                            });

                            //打印出选中文字
                            parent.find('.menu1').text(obj.data.currentData.name);
                            parent.find('.menu2').text('无');

                        });
                        eleTree.on("nodeClick(menuListTree)", function (obj) {

                            parent.find('.menu2').text(obj.data.currentData.ciName).attr('data-ciId', obj.data.currentData.ciId);
                            catalogueId = obj.data.currentData.ciId;
                        });

                        //输出目录指标项
                        $(obj.selector).find('#submitDatabase').off().on('click', function () {
                            if ($(obj.selector).find('.menu1').text() === '无') {
                                layer.msg('请选择目录分类');
                                return false;
                            }
                            if ($(obj.selector).find('.menu2').text() === '无') {
                                layer.msg('请选择对应的目录信息');
                                return false;
                            }
                            //导出指标项信息

                            var lodashList = layer.tab({
                                tab: [{
                                    title: '指标项',
                                    content: '<ul class="lodashList" id="lodashList"></ul>'
                                }, {
                                    title: '公共方法集',
                                    content: '<div style="padding: 10px;"><div class="tableTip" style="left: 30px">目录ID（catalogueId）:<b style="display: inline-block;padding: 0 10px;background: white;color: #666;margin-left: 10px;">' + parent.find('.menu2').attr('data-ciId') + '</b></div><table id="methodList" lay-filter="methodList"></table></div>'
                                }],
                                area: ['850px', '480px'],
                                offset: 'lb',
                                shadeClose: false,
                                shade: 0,
                                closeBtn: 0,
                                anim: -1,
                                id: 'lodashLayer',
                                maxmin: true,
                                className: 'layui-anim-rl',
                                success: function (obj) {
                                    //指标项配置
                                    if (!parent.find('.menu2').attr('data-ciId')) {
                                        return false;
                                    }
                                    common.fetchGet('sysmgr/indicator/enableCatalogueIndicator/' + parent.find('.menu2').attr('data-ciId'), function (res) {
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

                                            item.off().on('click', function () {

                                                var data = dataMap[item.attr('data-code')];

                                                var tipStr = '<div>字段名：' + data['cfName'] + '</div>';
                                                tipStr += '<div>字段Code：' + data['cfCode'] + '</div>';
                                                tipStr += '<div>数据类型：' + data['cfFieldType'] + '</div>';
                                                tipStr += '<div>是否必填：' + (data['cfRequire'] ? '是' : '否') + '</div>';
                                                layer.tips(tipStr, item, {tips: 4});

                                            });

                                        });

                                    });

                                    //公共方法配置
                                    table.render(common.tableInitParams({
                                        elem: $(obj.selector).find('#methodList'),
                                        url: baseUrl + 'sysmgr/javaMethodTmp/page',
                                        method: 'post',
                                        toolbar: true,
                                        cols: [
                                            [
                                                {"field": "jmtChname", width: 210, sort: true, "title": "名称"},
                                                {"field": "jmtType", "width": 80, "sort": true, "title": "类型"},
                                                {
                                                    "field": "jmtUrl",
                                                    "width": 350,
                                                    "sort": true,
                                                    "title": "地址",
                                                    templet: function (obj) {
                                                        return obj['jmtUrl'] + '?catalogueId=' + (!!parent.find('.menu2').attr('data-ciId') ? parent.find('.menu2').attr('data-ciId') : $('[name=dataBase]').val())
                                                    }
                                                },
                                                {"field": "jmtHttpMethod", "width": 100, "sort": true, "title": "方法"},
                                                {"field": "jmtReturntype", "width": 90, "sort": true, "title": "返回类型"},
                                                {
                                                    "field": "jmtReturnparamname",
                                                    "width": 80,
                                                    "sort": true,
                                                    "title": "返回参数名"
                                                }
                                            ]
                                        ],
                                        parseData: function (res) {
                                            return {
                                                "code": 0,
                                                "msg": res.resultMessage,
                                                "count": res.page.total,
                                                "data": res.page.list
                                            };
                                        },
                                        height: 400,
                                    }));
                                }
                            });
                            // layer.min(lodashList);

                            //写入目录信息值
                            $('[name=dataBase]').val(parent.find('.menu2').attr('data-ciId'));
                            layer.close(layerDom);
                        });


                        //公共方法配置
                        table.render(common.tableInitParams({
                            elem: $(obj.selector).find('#methodTmp'),
                            url: baseUrl + 'sysmgr/javaMethodTmp/page',
                            method: 'post',
                            toolbar: true,
                            cols: [
                                [
                                    {type: 'radio'},
                                    {"field": "jmtChname", width: 210, sort: true, "title": "名称"},
                                    {"field": "jmtType", "width": 80, "sort": true, "title": "类型"},
                                    {"field": "jmtUrl", "sort": true, "title": "地址"},
                                    // {"field": "jmtHttpMethod", "width": 100, "sort": true, "title": "方法"},
                                    // {"field": "jmtReturntype", "sort": true, "title": "返回类型"},
                                    // {"field": "jmtReturnparamname", "sort": true, "title": "返回参数名"}
                                ]
                            ],
                            height: 450,
                        }));


                        var tableData;

                        table.on('radio(methodTmp)', function (obj) {

                            tableData = obj.data;
                        });

                        //点击确定按钮
                        parent.find('#savePublicMethod').off().on('click', function () {


                            if (!tableData) {
                                layer.msg('请选择公用方法');
                                return false;
                            }

                            if ($(obj.selector).find('.menu2').text() === '无') {
                                layer.msg('请选择对应的目录信息');
                                return false;
                            }

                            var data = tableData;

                            $('[name=methodName]').val(data['jmtChname']);
                            $('[name=infoJmtId]').val(data['jmtId']);
                            $('[name=portUrl]').val(data['jmtUrl']);
                            $('[name=portMethod]').val(data['jmtHttpMethod']);
                            $('[name=portType]').val(data['jmtReturntype']);
                            $('[name=jmtReturnparamname]').val(data['jmtReturnparamname']);

                            $('[name=retireUrl]').val('http://{ip}:{port}/intfmgr/invoke/' + catalogueId);

                            $('#bodyForm').empty().html('<div class="layui-row layui-col-space15">\n' +
                                '                                            <div class="layui-col-xs5">\n' +
                                '                                                参数名\n' +
                                '                                            </div>\n' +
                                '                                            <div class="layui-col-xs5">\n' +
                                '                                                参数值\n' +
                                '                                            </div>\n' +
                                '                                        </div>\n' +
                                '                                        <div class="layui-row layui-col-space15">\n' +
                                '                                            <div class="layui-col-xs5">\n' +
                                '                                                <input class="layui-input body1" placeholder="参数名" type="text">\n' +
                                '                                            </div>\n' +
                                '                                            <div class="layui-col-xs5">\n' +
                                '                                                <input class="layui-input body2" placeholder="参数值" type="text">\n' +
                                '                                            </div>\n' +
                                '                                            <div class="layui-col-xs-2">\n' +
                                '                                                <i class="fa fa-plus-square formLineAdd add2"></i>\n' +
                                '                                            </div>\n' +
                                '                                        </div>');
                            $('[name=bodyRow]').val('');


                            //query 值填入  body 值填入
                            common.fetchGet('sysmgr/javaMethodTmp/getJavaMethodAllInfoById?id=' + data['jmtId'], function (res) {
                                var data = res.sqlimp || [];
                                if (data.length > 0) {
                                    var bodyObj = {};
                                    $.map(data, function (item) {
                                        if (item.jmtsiParamType.toLocaleLowerCase() === 'body') {
                                            bodyObj[item.jmtsiChname] = '{' + item.jmtsiChname + '}';
                                        } else if (item.jmtsiParamType.toLocaleLowerCase() === 'query') {
                                            var parent = $('#bodyForm');

                                            if (!parent.find('.body1').eq(0).val() && !parent.find('.body2').eq(0).val()) {

                                                parent.find('.body1').eq(0).val(item.jmtsiChname);
                                                parent.find('.body2').eq(0).val('');

                                            } else {
                                                var html = '<div class="layui-row layui-col-space15">\n' +
                                                    '                  <div class="layui-col-xs5">\n' +
                                                    '                      <input type="text" class="layui-input body1" placeholder="参数名" value="' + item.jmtsiChname + '" >\n' +
                                                    '                  </div>\n' +
                                                    '                  <div class="layui-col-xs5">\n' +
                                                    '                      <input type="text" class="layui-input body2" placeholder="参数值" >\n' +
                                                    '                  </div>\n' +
                                                    '                  <div class="layui-col-xs-2">\n' +
                                                    '                    <i class="fa fa-plus-square formLineAdd add2"></i>\n' +
                                                    '                    <i class="icon iconfont icon-button-sc-2 formLineDelete delete2"></i>\n' +
                                                    '                  </div>\n' +
                                                    '</div>';

                                                parent.append(html);
                                            }
                                        }
                                    });

                                    $('[nanme=bodyRow]').val(common.jsonFormat(bodyObj));
                                }
                            });


                            layer.close(methodTmp);
                        });
                    }
                });
                layer.full(methodTmp);

            });

            //body
            $(document).off('click', '.add2');
            $(document).on('click', '.add2', function () {
                var html = '<div class="layui-row layui-col-space15">\n' +
                    '                  <div class="layui-col-xs5">\n' +
                    '                      <input type="text"  class="layui-input body1" placeholder="参数名">\n' +
                    '                  </div>\n' +
                    '                  <div class="layui-col-xs5">\n' +
                    '                      <input type="text" class="layui-input body2" placeholder="参数值">\n' +
                    '                  </div>\n' +
                    '                  <div class="layui-col-xs-2">\n' +
                    '                    <i class="fa fa-plus-square formLineAdd add2"></i>\n' +
                    '                    <i class="icon iconfont icon-button-sc-2 formLineDelete delete1"></i>\n' +
                    '                  </div>\n' +
                    '</div>';
                $(this).parent().parent().parent().append(html);
                return false;

            });
            $(document).off('click', '.delete2');
            $(document).on('click', '.delete2', function () {
                $(this).parent().parent().remove();
            });

            //header
            $(document).off('click', '.add1');
            $(document).on('click', '.add1', function () {
                var html = '<div class="layui-row layui-col-space15"><div class="layui-col-xs3">\n' +
                    '                                        <input type="text" class="layui-input header1">\n' +
                    '                                    </div>\n' +
                    '                                    <div class="layui-col-xs3">\n' +
                    '                                        <input type="text" class="layui-input header2">\n' +
                    '                                    </div>\n' +
                    '                                    <div class="layui-col-xs3">\n' +
                    '                                        <input type="text" class="layui-input header3">\n' +
                    '                                    </div>\n' +
                    '                                    <div class="layui-col-xs-3">\n' +
                    '                 <i class="fa fa-plus-square formLineAdd add1"  ></i>\n' +
                    '                 <i class="icon iconfont icon-button-sc-2 formLineDelete delete1"></i>\n' +
                    '                                    </div></div>';
                $(this).parent().parent().parent().append(html);
                return false;

            });
            $(document).off('click', '.delete1');
            $(document).on('click', '.delete1', function () {
                $(this).parent().parent().remove();
            });

            //状态码

            $(document).off('click', '.add3');
            $(document).on('click', '.add3', function () {
                var html = '<div class="layui-row layui-col-space15">\n' +
                    '                                    <div class="layui-col-xs5">\n' +
                    '                                        <input class="layui-input status1" placeholder="状态码" type="text">\n' +
                    '                                    </div>\n' +
                    '                                    <div class="layui-col-xs5">\n' +
                    '                                        <input class="layui-input status22" placeholder="描述" type="text">\n' +
                    '                                    </div>\n' +
                    '                                    <div class="layui-col-xs-2">\n' +
                    '                                        <i class="fa fa-plus-square formLineAdd add4"></i>\n' +
                    '                 <i class="icon iconfont icon-button-sc-2 formLineDelete delete1"></i>\n' +
                    '                                    </div>\n' +
                    '                                </div>';
                $(this).parent().parent().parent().append(html);
                return false;

            });

            //错误码
            $(document).off('click', '.add4');
            $(document).on('click', '.add4', function () {
                var html = '<div class="layui-row layui-col-space15">\n' +
                    '                                    <div class="layui-col-xs5">\n' +
                    '                                        <input class="layui-input error1" placeholder="错误码" type="text">\n' +
                    '                                    </div>\n' +
                    '                                    <div class="layui-col-xs5">\n' +
                    '                                        <input class="layui-input error2" placeholder="描述" type="text">\n' +
                    '                                    </div>\n' +
                    '                                    <div class="layui-col-xs-2">\n' +
                    '                                        <i class="fa fa-plus-square formLineAdd add4"></i>\n' +
                    '                 <i class="icon iconfont icon-button-sc-2 formLineDelete delete1"></i>\n' +
                    '                                    </div>\n' +
                    '                                </div>';
                $(this).parent().parent().parent().append(html);
                return false;

            });

            form.on('radio(form-row)', function (data) {
                if (data.value === 'form') {
                    $('.row-box').hide();
                    $('.form-data-box').show();
                } else {
                    $('.form-data-box').hide();
                    $('.row-box').show();
                }
            });

            //保存提交
            $('#saveBtn').off().on('click', function () {

                if (!$('[name=methodName]').val()) {
                    layer.msg('请选择公共方法');
                    return false;
                }

                var params = {
                    "intfInfo": {
                        "paramId": $('[name=paramId]').val(),
                        "intfInfoId": $('[name=intfInfoId]').val(),
                        "infoJmtId": $('[name=infoJmtId]').val(),
                        "intfDesc": $('[name=portMemo]').val(),
                        "intfMethod": $('[name=intfMethod]').val(),
                        "intfName": $('[name=portName]').val(),
                        "intfVer": $('[name=portVer]').val(),
                        "picUrl": $('[name=smIcon]').val(),
                        "retireUrl": $('[name=retireUrl]').val(),
                        "returnType": $('[name=returnType]').val(),
                        "successSample": $('[name=successSample]').val(),
                        "failSample": $('[name=failSample]').val()
                    },
                    "intfParams": [
                        {
                            "paramId": $('[name=bodyRow]').attr('paramId'),
                            "intfInfoId": $('[name=bodyRow]').attr('intfInfoId'),
                            "paramType": "body",
                            "requestParam": $('[name=bodyRow]').val()
                        },
                        {
                            "paramId": $('[name=customSql]').attr('paramId'),
                            "intfInfoId": $('[name=customSql]').attr('intfInfoId'),
                            "paramType": "sql",
                            "customSql": $('[name=customSql]').val()
                        }
                    ],
                    "intfResultCodes": []
                };

                for (var i = 0; i < $('.header1').length; i++) {

                    if ($('.header1').eq(i).val()) {
                        params.intfParams.push({
                            "paramId": $('.header1').eq(i).attr("paramId"),
                            "intfInfoId": $('.header1').eq(i).attr("intfInfoId"),
                            "paramType": "header",
                            "paramKey": $('.header1').eq(i).val(),
                            "matchType": "=",
                            "paramValue": $('.header2').eq(i).val(),
                            "paramValueType": "text",
                            "ggMemo": $('.header3').eq(i).val()
                        });
                    }

                }
                for (var i = 0; i < $('.body1').length; i++) {
                    if ($('.body1').eq(i).val()) {
                        params.intfParams.push({
                            "paramId": $('.body1').eq(i).attr("paramId"),
                            "intfInfoId": $('.body1').eq(i).attr("intfInfoId"),
                            "paramType": "query",
                            "paramKey": $('.body1').eq(i).val(),
                            "paramValue": $('.body2').eq(i).val(),
                            "paramValueType": "text"
                        });
                    }
                }
                for (var i = 0; i < $('.status1').length; i++) {
                    if ($('.status1').eq(i).val()) {
                        params.intfResultCodes.push({
                            "resultCodeId": $('.status1').eq(i).attr("resultCodeId"),
                            "intfInfoId": $('.status1').eq(i).attr("intfInfoId"),
                            "codeDesc": $('.status22').eq(i).val(),
                            "codeType": "code",
                            "resultCode": $('.status1').eq(i).val()
                        });
                    }

                }
                for (var i = 0; i < $('.error1').length; i++) {
                    if ($('.error1').eq(i).val()) {
                        params.intfResultCodes.push({
                            "resultCodeId": $('.error1').eq(i).attr("resultCodeId"),
                            "intfInfoId": $('.error1').eq(i).attr("intfInfoId"),
                            "codeDesc": $('.error2').eq(i).val(),
                            "codeType": "error",
                            "resultCode": $('.error1').eq(i).val()
                        });
                    }
                }
                //新增或修改
                var url;
                if (params.intfInfo.intfInfoId) {
                    url = 'intfmgr/intfInfo/update';
                } else {
                    url = 'intfmgr/intfInfo/save';
                }
                common.fetchPost(url, params, function (res) {
                    if (!!res.success) {
                        layer.msg('保存成功');

                        setTimeout(function () {
                            var index = top.layer.getFrameIndex(window.name); // 获取窗口索引
                            top.layer.close(index);
                            $($(top.window.document).find('.iframe')[0].contentWindow.document).find('#refreshBtn').click();
                        }, 500);

                    } else {
                        layer.alert(res.resultMessage)
                    }
                }, function (error) {
                    layer.msg(error.resultMessage);
                })
            });

            return false;
        },

        //接口值信息导入
        editDataInit: function () {
            var layerLoader = common.layerLoader();
            // var layerLoader='erer';

            //跨域通信中判断是否存在导入配置内容的值
            setTimeout(function () {
                editData = $('#editData').text();
                if (!!editData) {
                    //获取配置值
                    common.fetchGet('intfmgr/intfInfo/info/' + editData, function (res) {
                        layer.close(layerLoader);
                        var data = res.object || null;
                        if (data) {
                            editDataPublic = data;
                            //公共方法数据导入
                            $('[name=infoJmtId]').val(data.intfInfo.infoJmtId);
                            common.fetchGet('sysmgr/javaMethodTmp/getJavaMethodAllInfoById?id=' + data.intfInfo.infoJmtId, function (res) {
                                var data = res.object;

                                if (data) {
                                    $('[name=methodName]').val(data['JmtChname']);
                                    $('[name=portUrl]').val(data['JmtUrl']);
                                    $('[name=portMethod]').val(data['JmtHttpMethod']);
                                    $('[name=portType]').val(data['JmtReturntype']);
                                    $('[name=jmtReturnparamname]').val(data['JmtReturnparamname']);
                                }

                            });


                            //基础信心导入
                            $('[name=intfInfoId]').val(data.intfInfo.intfInfoId);
                            $('[name=paramId]').val(data.intfInfo.paramId);
                            $('[name=portMemo]').val(data.intfInfo.intfDesc);
                            $('[name=intfMethod]').val(data.intfInfo.intfMethod);
                            $('[name=portName]').val(data.intfInfo.intfName);
                            $('[name=portVer]').val(data.intfInfo.intfVer);
                            $('[name=smIcon]').val(data.intfInfo.picUrl);
                            $('[name=retireUrl]').val(data.intfInfo.retireUrl);
                            $('[name=returnType]').val(data.intfInfo.returnType);

                            //成功失败实例导入
                            $('[name=failSample]').val(data.intfInfo.failSample);
                            $('[name=successSample]').val(data.intfInfo.successSample);


                            if (data.intfParams && data.intfParams.length > 0) {
                                $.map(data.intfParams, function (item, index) {
                                    //header 参数导入
                                    if (item.paramType === 'header') {
                                        var parent = $('#headerForm');
                                        if (!parent.find('.header1').eq(0).val() && !parent.find('.header2').eq(0).val()) {

                                            parent.find('.header1').eq(0).val(item.paramKey).attr('intfInfoId', item.intfInfoId)
                                                .attr('paramId', item.paramId).attr('matchType', item.matchType)
                                                .attr('paramValueType', item.paramValueType);

                                            parent.find('.header2').eq(0).val(item.paramValue);
                                            parent.find('.header3').eq(0).val(item.ggMemo);

                                        } else {
                                            var html = '<div class="layui-row layui-col-space15">\n' +
                                                '                  <div class="layui-col-xs3">\n' +
                                                '                      <input type="text" class="layui-input header1" placeholder="Content-Type" value="' + item.paramKey + '" intfInfoId="' + item.intfInfoId + '" paramId="' + item.paramId + '" matchType="' + item.matchType + '" paramValueType="' + item.paramValueType + '">\n' +
                                                '                  </div>\n' +
                                                '                  <div class="layui-col-xs3">\n' +
                                                '                      <input type="text" class="layui-input header2" placeholder="application/json" value="' + item.paramValue + '">\n' +
                                                '                  </div>\n' +
                                                '                  <div class="layui-col-xs3">\n' +
                                                '                      <input type="text" class="layui-input header3" placeholder="描述" value="' + item.ggMemo + '">\n' +
                                                '                  </div>\n' +
                                                '                  <div class="layui-col-xs-3">\n' +
                                                '                    <i class="fa fa-plus-square formLineAdd add1"></i>\n' +
                                                '                    <i class="icon iconfont icon-button-sc-2 formLineDelete delete1"></i>\n' +
                                                '                  </div>\n' +
                                                '</div>';

                                            parent.append(html);
                                        }
                                    }
                                    //body 参数导入
                                    else if (item.paramType === 'body') {
                                        $('[name=bodyRow]').val(item.requestParam).attr('intfInfoId', item.intfInfoId).attr('paramId', item.paramId);
                                    }

                                    //query 参数导入
                                    else if (item.paramType === 'query') {
                                        var parent = $('#bodyForm');

                                        if (!parent.find('.body1').eq(0).val() && !parent.find('.body2').eq(0).val()) {

                                            parent.find('.body1').eq(0).val(item.paramKey);
                                            parent.find('.body2').eq(0).val(item.paramValue);

                                        } else {
                                            var html = '<div class="layui-row layui-col-space15">\n' +
                                                '                  <div class="layui-col-xs5">\n' +
                                                '                      <input type="text" class="layui-input body1" intfInfoId="' + item.intfInfoId + '" paramId="' + item.paramId + ' placeholder="参数名" value="' + item.paramKey + '" >\n' +
                                                '                  </div>\n' +
                                                '                  <div class="layui-col-xs5">\n' +
                                                '                      <input type="text" class="layui-input body2" placeholder="参数值" value="' + item.paramValue + '">\n' +
                                                '                  </div>\n' +
                                                '                  <div class="layui-col-xs-2">\n' +
                                                '                    <i class="fa fa-plus-square formLineAdd add2"></i>\n' +
                                                '                    <i class="icon iconfont icon-button-sc-2 formLineDelete delete2"></i>\n' +
                                                '                  </div>\n' +
                                                '</div>';

                                            parent.append(html);
                                        }
                                    }
                                    //sql 参数导入
                                    else if (item.paramType === 'sql') {
                                        $('[name=customSql]').val(item.customSql).attr('intfInfoId', item.intfInfoId).attr('paramId', item.paramId);
                                    }
                                });
                            }


                            //状态码 错误码
                            if (data.intfResultCodes && data.intfResultCodes.length > 0) {
                                $.map(data.intfResultCodes, function (item, index) {
                                    if (item.codeType === 'code') { //状态码

                                        var parent = $('#statusCode');

                                        if (!parent.find('.status1').eq(0).val() && !parent.find('.status22').eq(0).val()) {

                                            parent.find('.status1').eq(0).val(item.resultCode).attr('intfInfoId', item.intfInfoId).attr('resultCodeId', item.resultCodeId);
                                            parent.find('.status22').eq(0).val(item.codeDesc);

                                        } else {
                                            var html = '<div class="layui-row layui-col-space15">\n' +
                                                '                  <div class="layui-col-xs5">\n' +
                                                '                      <input type="text" class="layui-input status1" placeholder="状态码" value="' + item.resultCode + '" intfInfoId="' + item.intfInfoId + '" resultCodeId="' + item.resultCodeId + '" >\n' +
                                                '                  </div>\n' +
                                                '                  <div class="layui-col-xs5">\n' +
                                                '                      <input type="text" class="layui-input status22" placeholder="描述" value="' + item.codeDesc + '">\n' +
                                                '                  </div>\n' +
                                                '                  <div class="layui-col-xs-2">\n' +
                                                '                    <i class="fa fa-plus-square formLineAdd add3"></i>\n' +
                                                '                    <i class="icon iconfont icon-button-sc-2 formLineDelete delete1"></i>\n' +
                                                '                  </div>\n' +
                                                '</div>';

                                            parent.append(html);
                                        }

                                    } else if (item.codeType === 'error') { //错误码
                                        var parent = $('#errorCode');
                                        if (!parent.find('.error1').eq(0).val() && !parent.find('.error2').eq(0).val()) {

                                            parent.find('.error1').eq(0).val(item.resultCode).attr('intfInfoId', item.intfInfoId).attr('resultCodeId', item.resultCodeId);
                                            parent.find('.error2').eq(0).val(item.codeDesc);

                                        } else {
                                            var html = '<div class="layui-row layui-col-space15">\n' +
                                                '                  <div class="layui-col-xs5">\n' +
                                                '                      <input type="text" class="layui-input error1" placeholder="错误码" value="' + item.resultCode + '" intfInfoId="' + item.intfInfoId + '" resultCodeId="' + item.resultCodeId + '" >\n' +
                                                '                  </div>\n' +
                                                '                  <div class="layui-col-xs5">\n' +
                                                '                      <input type="text" class="layui-input error2" placeholder="描述" value="' + item.codeDesc + '">\n' +
                                                '                  </div>\n' +
                                                '                  <div class="layui-col-xs-2">\n' +
                                                '                    <i class="fa fa-plus-square formLineAdd add4"></i>\n' +
                                                '                    <i class="icon iconfont icon-button-sc-2 formLineDelete delete1"></i>\n' +
                                                '                  </div>\n' +
                                                '</div>';

                                            parent.append(html);
                                        }
                                    }
                                })
                            }
                        }

                    });
                } else {
                    editDataPublic = null;
                    layer.close(layerLoader);
                }
            }, 100);
        },

        pageLoad: function () {
            eventHandle.editDataInit();
            eventHandle.domEvent();
        }
    };

    //加载入口
    eventHandle.pageLoad();


});
