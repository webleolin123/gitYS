/**
 @Name：业务模板配置页面
 @Author：gaoli
 */

// import './../../css/public.scss';
// import './../../css/module/config.scss';

layui.config({
    base: '../../../src/js/',
    version: new Date().getTime()
}).extend({
    // upload:'common/zefuUpload'
    custom: 'common/custom',
    chartOption: 'common/chartPack'
});
layui.use(['form', 'custom', 'common', 'layer', 'element', 'eleTree', 'util', 'table', 'chartOption'], function () {
    var form=layui.form,
        common=layui.common,
        custom=layui.custom,
        element=layui.element,
        eleTree=layui.eleTree,
        table=layui.table,
        util=layui.util,
        chartOption = layui.chartOption,
        layer=layui.layer;
    // layui.selImg($, '#layoutWidth');
    common.themeSet();
    var dom={
        layoutWidth:$('#layoutWidth'),
        layoutHeight:$('#layoutHeight'),
        heightValue:$('[name=heightValue]'),
        pageName:$('#pageName'),
        projectCode: $('#projectCode'),
        pageType:$('#pageType'),
        layoutSet:$('#layoutSet'),
        rightBtn: $('.control-hide-right'),
        leftBtn: $('.control-hide-left'),
        leftControl:$('.leftControl'),
        rightControl:$('.rightControl'),
        centerControl:$('.centerControl'),
        editorModule:$('#editor_module'),
        menuTipArea:$('.menuTipArea')
    };

    var gridList=[],//栅格组件list
        compPluginList=[]; //基础组件list

    //默认所有的父级id
    var currentSetCompId=common.uuid();

    var tempIdMap={
        form:{
            "tempId":"e42b3f5153594eaa925c77a416cafc3d"
        },
        table:{
            "tempId":"a9991f59e6c2489abc4b0c007dc13717"
        },
        searchTable:{
            "tempId":"7167868bd6a8455e9b313c392b902149"
        },
        tree:{
            "tempId":"c4475112c0914acb9d5f0db184c78e80"
        },
        tab:{
            "tempId":"2b3fec7ffe9445fcadb35f5966da0f8a"
        },
        card:{
            "tempId":"2b3fec7ffe9445fcadb35f5966da0f8a"
        },
        accordion:{
            "tempId":"2b3fec7ffe9445fcadb35f5966da0f8a"
        },
        button: {},
        chart: {
            "tempId": "8fbde42252b74e2abc8ffccb2c153952"
        },
    };

    var jsonMap={
        form:{
            "plugin": "form",
            "name": "",
            "field": [
                {
                    "theme":"1",
                    "type":"1",
                    // "title": {
                    //     "name": "field区域"
                    // },
                    "form":[
                        {
                            "name":"a1",
                            "label":"默认输入框",
                            "required":true,
                            "placeholder":"请输入名称",
                            "type":"input",
                            "col":6
                        }
                        /* {
                             "name":"a4",
                             "label":"普通下拉",
                             "type":"select",
                             "data":[
                                 {
                                     "text":"系统",
                                     "value":"system"
                                 },
                                 {
                                     "text":"业务",
                                     "value":"business"
                                 }
                             ],
                             "col":4
                         },
                         {
                             "name":"a6",
                             "label":"单选框",
                             "type":"radio",
                             "data":[
                                 {
                                     "text":"男",
                                     "value":"男",
                                     "checked":true
                                 },
                                 {
                                     "text":"女",
                                     "value":"女"
                                 },
                                 {
                                     "text":"不可选",
                                     "value":"不可选个",
                                     "disabled":true
                                 }
                             ],
                             "col":12
                         },
                         {
                             "name":"a8",
                             "label":"简单复选框",
                             "type":"checkbox",
                             "theme":2,
                             "data":[
                                 {
                                     "text":"选择一",
                                     "value":"1",
                                     "checked":true
                                 },
                                 {
                                     "text":"选择二",
                                     "value":"女"
                                 },
                                 {
                                     "text":"不可选",
                                     "value":"不可选",
                                     "disabled":true
                                 }
                             ],
                             "col":6
                         },
                         {
                             "name":"switch",
                             "label":"开关",
                             "type":"switch",
                             "checked":true,
                             "col":4
                         },
                         {
                             "name":"sdd",
                             "label":"文本域",
                             "isLabelFull":true,
                             "type":"textarea",
                             "col":12
                         }*/
                    ],
                    "isOriginOper":true,
                    "operation": [
                        {
                            "label":"提交",
                            "name":"submit",
                            "type": "submit",
                            "permissionBtn": false
                        },
                        {
                            "label":"重置",
                            "name":"reset",
                            "type": "reset",
                            "permissionBtn":false
                        }
                    ]
                }
            ]
        },
        table:{
            "name": "",
            "plugin": "table",
            "getDataUrl":"sysmgr/menu/selectSysMenuPage",
            "toolbarBtn":[
                {
                    "name":"add_1",
                    "text":"按钮1",
                    "icon":true,
                    "type":"layer",
                    "iconType":"add",
                    "layerSet":{"type":2,"iframeId":"6HLJB2CIBKFLCEC361BL6616","bindBtn":"","offset":"auto","isFull":false,"title":"标题","successBack":"","cancelBack":"","oper":[{"btnText":"确定","isClose":true,"perform":""}]}
                },
                {
                    "name":"add_2",
                    "iconType":"add",
                    "text":"按钮2",
                    "icon":true,
                    "type":"add"
                },
                {
                    "name":"delete_1",
                    "text":"删除",
                    "type":"delete",
                    "deleteSet":{
                        "conformTip":"确定删除选定项?",
                        "tipWidth":"150",
                        "successTip":"删除成功",
                        "failTip":"删除失败",
                        "url":"sysmgr/menu/deleteSysMenuByIds",
                        "deleteParam":"smIds",
                        "tableRowIndex":"smId",
                        "successEvent":[
                            {
                                "module":"a",
                                "plugin":"tree"
                            },
                            {
                                "module":"b2",
                                "plugin":"table"
                            }
                        ]
                    }

                }
            ],
            "rowBtn":[
                {
                    "name":"edit",
                    "text":"按钮1",
                    "event":"edit",
                    "class":''
                },
                {
                    "name":"delete",
                    "text":"按钮2",
                    "event":"delete",
                    "class":''
                }
            ],
            page:true,
            defaultToolbar: ['filter', 'print', 'exports'],
            "cols": [[
                {"type":"checkbox"},
                {"type": "numbers", "title": "序号"},
                {"field": "line1", "title": "line1", "sort": true},
                {"field": "line2", "title": "line2", "width": 120, "sort": true},
                {"field": "line3", "title": "line3", "width": 120, "sort": true}
            ]]
        },
        searchTable:{
            "name": "",
            "plugin": "searchTable",
            "title" : "查询条件",
            "field": [
                {
                    "theme": "1",
                    "toggleLine": true,
                    "form":[
                        {
                            "type":"input",
                            "required":false,
                            "label":"名称",
                            "name":"smName",
                            "col": 4
                        }
                    ],
                    "isOriginOper":false,
                    "operation":[
                        {
                            "type":"submit",
                            "label":"查询",
                            "name":"searchSubmit",
                            "submitSet":{
                                "toModule":"b2"
                            },
                            "permissionBtn":false
                        },
                        {
                            "label":"重置",
                            "name":"reset",
                            "type": "reset",
                            "permissionBtn":false
                        }
                    ]
                }
            ]
        },
        tree:{
            "plugin": "tree",
            "name": "",
            "data": [],                   //直接赋值的数据
            "title":"标题",
            "showCheckbox": false,        // 节点是否可被选择
            "emptText": "暂无数据",        // 内容为空的时候展示的文本
            "renderAfterExpand": true,    // 是否在第一次展开某个树节点后才渲染其子节点
            "highlightCurrent": true,    // 是否高亮当前选中节点，默认值是 false。
            "defaultExpandAll": false,    // 是否默认展开所有节点
            "expandOnClickNode": true,    // 是否在点击节点的时候展开或者收缩节点， 默认值为 true，如果为 false，则只有点箭头图标的时候才会展开或者收缩节点。
            "checkOnClickNode": false,    // 是否在点击节点的时候选中节点，默认值为 false，即只有在点击复选框时才会选中节点。
            "defaultExpandedKeys": [],    // 默认展开的节点的 key 的数组
            "autoExpandParent": true,     // 展开子节点的时候是否自动展开父节点
            "defaultCheckedKeys": [],     // 默认勾选的节点的 key 的数组
            "indent": 16,                 // 相邻级节点间的水平缩进，单位为像素
            "draggable": false,           // 是否开启拖拽节点功能
            "contextmenuList": [],        // 启用右键菜单，支持的操作有："copy","add","edit","remove"
            "searchNodeMethod": null,     // 对树节点进行筛选时执行的方法，返回 true 表示这个节点可以显示，返回 false 则表示这个节点会被隐藏

            /*--------------------异步请求参数--------------------------*/
            "method": "get",              // 接口http请求类型，默认：get
            "url": "",                    // 异步数据接口
            "contentType": "",            // 发送到服务端的内容编码类型
            "response": {                 // 对于后台数据重新定义名字
                "statusName": "success",
                "statusCode": "0",
                "dataName": "list"
            },
            "request": {
                "name": "name",
                "key": "id",
                "children": "children",
                "checked": "checked",
                "disabled": "disabled",
                "isLeaf": "isLeaf",
                "extendAttr":"extendAttr"
            },
            "loadRequest":["id"],
            "defaultClick":false, //是否默认执行第一个点击项
            "slideLeft":false,//是否开启模块向左缩放功能
            "showIcon":true,//是否显示节点图标，该icon 值为 返回数据中 extendAttr 的值
            "lazy": false,  // 是否懒加载子节点，需与 load 方法结合使用
        },
        upload:{
            "plugin": "upload",
            "name": "",
            "text": "选择文件",
            "chooseToModule" :"",
            "accept": "file",
            "fileId": "fileTest",
            "multiple": true,
            "number": 0,
            "auto":true,
            "bindAction": "#button3",
            "url": "sysmgr/sysVersion/uploadPatchFile"
        },
        chart:{
            "plugin": "chart",
            "name": "",
            "height": "300px"
        },
        tab:{
            "plugin": "tab",
            "name": "",
            "theme":1,
            "header":[
                {
                    "text":'tab1',
                    "name":'tab1',
                    "icon":'class1',
                    "isShow":true
                },
                {
                    "text":'tab2',
                    "name":'tab2',
                    "icon":'class2',
                    "isShow":false
                },
                {
                    "text":'tab3',
                    "name":'tab3',
                    "icon":'class3',
                    "isShow":false
                }
            ]
        },
        card:{
            "plugin":"card",
            "name":"",
            "title":"标题",
            "theme":1
        },
        accordion:{
            "plugin":"accordion",
            "name":"",
            "title":"标题",
            "isSingle":false,
            "header":[
                {
                    "text":'accordion1',
                    "name":'accordion1',
                    "isShow":true
                },
                {
                    "text":'accordion2',
                    "name":'accordion2',
                    "isShow":false
                },
                {
                    "text":'accordion3',
                    "name":'accordion3',
                    "isShow":true
                }
            ]
        }
    };

    var baseUrl='../../../';

    var module,moduleArr;

    var treeLayer=null;

    var resetModule;

    var treeDom,layerDom;

    var eventHandler={
        dataBaseLayer:function () {

            var menuTypeTree,menuListTree;

            layerDom=layer.open({
                title:'绑定数据资源信息',
                type:1,
                content: $('#dataBaseLayer').html(),
                area:['640px',($(document).height()+'px')],
                offset: [0,$('body').width()-640],
                // closeBtn: 0,
                shadeClose: true,
                resize:true,
                anim:2,
                // className:'layui-anim-rl',
                success:function (obj) {
                    var parent=$(obj.selector);
                    //设置树组件的高度
                    $('#dataBaseTree').css('height',($(document).height()-140)+'px');
                    $('.dataBaseTreeLoad').show();

                    //目录分类列表
                    common.fetchGet('sysmgr/contentCatagory/contentCategoryTree',function (res) {
                        $('.dataBaseTreeLoad').hide();
                        //树信息的导入
                        if(res.success && res.list){

                            menuTypeTree = eleTree.render({
                                elem: '#menuTypeTree',
                                data: res.list,
                                showCheckbox: false,
                                lazy: true,
                                checkOnClickNode: true,
                                highlightCurrent: true,
                                emptyText:'暂无数据',
                                load: function(data, callback) {
                                    common.fetchGet('sysmgr/contentCatagory/contentCategoryTree?pid=' + data.id, function (res) {
                                        if (res.success && res.list) {
                                            callback(res.list)
                                        }
                                    }, function () {
                                        callback([])
                                    });
                                }
                            });

                        }else{
                            //不存在数据时的显示
                        }
                    },function () {});

                    menuListTree=eleTree.render({
                        elem: '#menuListTree',
                        data:[],
                        showCheckbox: false,
                        lazy: false,
                        checkOnClickNode: true,
                        highlightCurrent: true,
                        request: {
                            name: "ciName",
                            key: "ciId",
                            id:"ciId",
                        },
                        done:function(data){

                        },
                        emptyText:'暂无数据'
                    });

                    //高度设置
                    parent.find('.eleTree').css({
                        'height':($(document).height()-300)+'px'
                    });


                    eleTree.on("nodeClick(menuTypeTree)",function(obj) {
                        // menuListTree
                        var url=baseUrl+'sysmgr/catalogue/enableCatalogueOfCategory/'+obj.data.currentData.id+'?onlyTableGenerated=true';
                        common.fetchGet(url,function (res) {
                            menuListTree.reload({data:res.list});
                        });

                        //打印出选中文字
                        parent.find('.menu1').text(obj.data.currentData.name);
                        parent.find('.menu2').text('无');

                    });
                    eleTree.on("nodeClick(menuListTree)",function(obj) {

                        parent.find('.menu2').text(obj.data.currentData.ciName).attr('data-ciId',obj.data.currentData.ciId);

                    });

                    //输出目录指标项
                    $(obj.selector).find('#submitDatabase').off().on('click',function () {
                        if($(obj.selector).find('.menu1').text()==='无'){
                            layer.msg('请选择目录分类');
                            return false;
                        }
                        if($(obj.selector).find('.menu2').text()==='无'){
                            layer.msg('请选择对应的目录信息');
                            return false;
                        }
                        //导出指标项信息

                        var lodashList=layer.tab({
                            tab: [{
                                title: '指标项',
                                content: '<ul class="lodashList" id="lodashList"></ul>'
                            }, {
                                title: '公共方法集',
                                content: '<div style="padding: 10px;"><div class="tableTip" style="left: 30px">目录ID（catalogueId）:<b style="display: inline-block;padding: 0 10px;background: white;color: #666;margin-left: 10px;">'+parent.find('.menu2').attr('data-ciId')+'</b></div><table id="methodList" lay-filter="methodList"></table></div>'
                            }],
                            area:['850px','480px'],
                            offset: 'lb',
                            shadeClose: false,
                            shade:0,
                            closeBtn:0,
                            anim:-1,
                            id:'lodashLayer',
                            maxmin:true,
                            className:'layui-anim-rl',
                            success:function (obj){
                                //指标项配置
                                if(!parent.find('.menu2').attr('data-ciId')){
                                    return false;
                                }
                                common.fetchGet('sysmgr/indicator/enableCatalogueIndicator/'+parent.find('.menu2').attr('data-ciId'),function (res) {
                                    var html='';
                                    var data=res.list||[];
                                    var dataMap = {};
                                    $.map(data,function (item, index) {
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
                                    url: baseUrl+'sysmgr/javaMethodTmp/page',
                                    method:'post',
                                    toolbar: true,
                                    cols: [
                                        [
                                            {"field":"jmtChname",width:210,sort:true,"title":"名称"},
                                            {"field":"jmtType","width":80,"sort":true,"title":"类型"},
                                            {"field":"jmtUrl","width":350,"sort":true,"title":"地址",templet:function (obj) {
                                                    return obj['jmtUrl'] + '?catalogueId=' + (!!parent.find('.menu2').attr('data-ciId') ? parent.find('.menu2').attr('data-ciId') : $('[name=dataBase]').val())
                                                }},
                                            {"field":"jmtHttpMethod","width":100,"sort":true,"title":"方法"},
                                            {"field":"jmtReturntype","width":90,"sort":true,"title":"返回类型"},
                                            {"field":"jmtReturnparamname","width":80,"sort":true,"title":"返回参数名"}
                                        ]
                                    ],
                                    parseData: function(res){
                                        return {
                                            "code": 0,
                                            "msg": res.resultMessage,
                                            "count": res.page.total,
                                            "data": res.page.list
                                        };
                                    },
                                    height:400,
                                }));
                            }
                        });
                        // layer.min(lodashList);

                        //写入目录信息值
                        $('[name=dataBase]').val(parent.find('.menu2').attr('data-ciId'));
                        layer.close(layerDom);
                    });
                }
            });
            // layer.full(layerDom);
        },
        //获取配置的值
        globalConfigData:function(){
            var params=[];


            //导入页面基本信息，
            params.push({
                tempId:$('#pageType').val(),
                prop: {},
                parentCompPath:compPluginList[0].parentCompPath?compPluginList[0].parentCompPath:'',
                parentCompId: "-1",
                compName: $.trim($('#pageName').val()),
                projectCode: $.trim($('#projectCode').val()),
                compId:$('#compId').text()?$('#compId').text():currentSetCompId
            });

            $.map(compPluginList,function (itn,inde) {
                // if(!!inde){//不为0 的时候，0默认表示为页面的配置
                   /* if(typeof(itn)==="object" && itn instanceof Array){

                        $.map(itn,function (item, index) {

                            if (typeof(item)==="object" && !(item instanceof Array)){

                                params.components.push({
                                    prop:($.trim($('[name=textarea_'+Object.keys(item)[0]+']').val()))?JSON.parse($('[name=textarea_'+Object.keys(item)[0]+']').val()):{},
                                    components:[],
                                    tempId:$('[name=textarea_'+Object.keys(item)[0]+']').attr('tempId'),
                                    compId:$('[name=textarea_'+Object.keys(item)[0]+']').attr('compId'),
                                    parentCompId:params.compId
                                });


                                for(var k=0;k<item[Object.keys(item)[0]].length;k++){

                                    params.components.push({
                                        prop:($.trim($('[name=textarea_'+item[Object.keys(item)[0]][k]+']').val()))? JSON.parse($('[name=textarea_'+item[Object.keys(item)[0]][k]+']').val()):{},
                                        components:[],
                                        tempId:$('[name=textarea_'+item[Object.keys(item)[0]][k]+']').attr('tempId'),
                                        compId:$('[name=textarea_'+item[Object.keys(item)[0]][k]+']').attr('compId'),
                                        parentCompId:params.compId
                                    });

                                }

                            }else{

                                params.components.push({
                                    prop:  ($.trim($('[name=textarea_'+module[inde][index]+']').val()))?(JSON.parse($('[name=textarea_'+module[inde][index]+']').val())):{},
                                    components:[],
                                    tempId:$('[name=textarea_'+module[inde][index]+']').attr('tempId'),
                                    compId:$('[name=textarea_'+module[inde][index]+']').attr('compId'),
                                    parentCompId:params.compId
                                });

                            }


                        })

                    }*/

                    var textarea=$('[name=textarea_'+itn.module+']');


                    if(!!itn.layoutWidth){  //grid 组件
                        var currentGrid=$('[name=module_ID'+itn.module+']');
                        params.push({
                            // prop: itn,
                            tempId:itn.tempId,
                            prop: {
                                "moduleName":itn['moduleName'],
                                "layoutHeight": false,
                                "layoutWidth":itn['layoutWidth'],
                                "moduleStyle":itn['moduleStyle']
                            },
                            compId:itn.module,
                            parentCompId:itn.parentCompId,
                            compName: "ID"+itn.module,
                            parentCompPath:itn.parentCompPath?itn.parentCompPath:''
                        });


                    }else{ //其他组件

                        params.push({
                            prop: ($.trim(textarea.val()))?(JSON.parse(textarea.val())):itn,
                            tempId:textarea.attr('tempId'),
                            compId:textarea.attr('compId'),
                            parentCompId:itn.parentCompId,
                            compName: "ID"+textarea.attr('compId'),
                            parentCompPath:itn.parentCompPath?itn.parentCompPath:''
                        });

                    }

                // }
            });
            return params;
        },

        fntconfigData:function(){
            var params = {
                tempId:"c7a2ee316f724cff9c6070236fca0688",
                prop: {
                    "moduleName": module,
                    // "theme": {
                    //     "menuTheme":$('#menuTheme').val()?$('#menuTheme').val():'light',
                    //     "primaryColor":$('#primaryColor').val()?$('#primaryColor').val():'primary'
                    // },
                    "layoutHeight": false,
                    "layoutWidth":JSON.parse($('#layoutWidth').val()),
                    // "layoutWidth":JSON.parse($('.layui-select-title input').val()),
                    // "script": {
                    //     "url": $('[name=jsUrl]').val(),
                    //     "des": $('[name=jsDes]').val()
                    // },
                    // "style": {
                    //     "link":$('[name=link]').val(),
                    //     "des": $('[name=cssDes]').val()
                    // }
                },
                components: [],
                compName: $.trim($('[name=name]').val()),
                //具有compId 则表示修改这个compId的值，添加的时候compId为Null
                compId:$('#compId').text()?$('#compId').text():null
            };

            $.map(module,function (itn,inde) {
                if(typeof(itn)==="object" && itn instanceof Array){

                    $.map(itn,function (item, index) {

                        if (typeof(item)==="object" && !(item instanceof Array)){

                            params.components.push({
                                prop:($.trim($('[name=textarea_'+Object.keys(item)[0]+']').val()))?JSON.parse($('[name=textarea_'+Object.keys(item)[0]+']').val()):{},
                                components:[],
                                tempId:$('[name=textarea_'+Object.keys(item)[0]+']').attr('tempId')
                            });


                            for(var k=0;k<item[Object.keys(item)[0]].length;k++){

                                params.components.push({
                                    prop:($.trim($('[name=textarea_'+item[Object.keys(item)[0]][k]+']').val()))? JSON.parse($('[name=textarea_'+item[Object.keys(item)[0]][k]+']').val()):{},
                                    components:[],
                                    tempId:$('[name=textarea_'+item[Object.keys(item)[0]][k]+']').attr('tempId')
                                });
                            }

                        }else{

                            params.components.push({
                                prop:  ($.trim($('[name=textarea_'+module[inde][index]+']').val()))?(JSON.parse($('[name=textarea_'+module[inde][index]+']').val())):{},
                                components:[],
                                tempId:$('[name=textarea_'+module[inde][index]+']').attr('tempId')
                            });

                        }
                    })

                }
            });
            return params;
        },

        //layoutwidth 转化生成modulename
        moduleNameTransform:function(layoutWidth){
            var module=JSON.parse(layoutWidth);
            // 生成module项
            $.map(module,function (itn,inde) {
                if(typeof(itn)==="object" && itn instanceof Array){  //判断是否是一个数据
                    $.map(itn,function (item, index) {
                        if (typeof(item)==="object" && !(item instanceof Array)){ // {}

                            try{
                                //将属性值修改
                                module[inde][index]=JSON.parse(JSON.stringify(item).replace(Object.keys(item)[0],common.uuid('ID')));

                                // item.replace(Object.keys(item)[0],String.fromCharCode(64 + parseInt(Math.random()*24)));
                                for(var k=0;k<item[Object.keys(item)[0]].length;k++){
                                    module[inde][index][Object.keys(module[inde][index])[0]][k]=common.uuid('ID');
                                }
                            }
                            catch (e) {
                                layer.msg('生成失败，请重新尝试');
                                return false;
                            }
                        }else{ //number
                            module[inde][index]=common.uuid('ID')
                        }
                    })

                }
            });


            return module

        },

        //layoutwidth 转化生成  moduleStyle
        moduleStyleTransform:function(data){
           var moduleStyle=JSON.parse(data);

            // 生成module项

            var styleSet={
                paddingTop:'7.5px',
                paddingBottom:'7.5px',
                paddingLeft:'7.5px',
                paddingRight:'7.5px',
                borderLeft:'',
                borderRight:'',
                borderTop:'',
                borderBottom:'',
                backgroundColor: '',
                backgroundImage: '',
            };
            $.map(moduleStyle,function (itn,inde) {
                if(typeof(itn)==="object" && itn instanceof Array){  //判断是否是一个数据
                    $.map(itn,function (item, index) {
                        if (typeof(item)==="object" && !(item instanceof Array)){ // {}

                            try{
                                //将属性值修改
                                moduleStyle[inde][index]=JSON.parse(JSON.stringify(item).replace(Object.keys(item)[0],common.uuid('ID')));

                                // item.replace(Object.keys(item)[0],String.fromCharCode(64 + parseInt(Math.random()*24)));
                                for(var k=0;k<item[Object.keys(item)[0]].length;k++){
                                    moduleStyle[inde][index][Object.keys(module[inde][index])[0]][k]=styleSet;
                                }
                            }
                            catch (e) {
                                layer.msg('生成失败，请重新尝试');
                                return false;
                            }
                        }else{ //number
                            moduleStyle[inde][index]=styleSet
                        }
                    })

                }
            });


            return moduleStyle

        },

        //layoutwidth 转化生成  titleSet
        titleSetTransform: function (data) {
            var moduleTitle = JSON.parse(data);

            var title = {
                theme: "0",
                gridTitleName: "",
                auxiliaryTitle: "",
                gridTitleHelpTip: ""
            };
            $.map(moduleTitle, function (itn, inde) {
                if (typeof (itn) === "object" && itn instanceof Array) {  //判断是否是一个数据
                    $.map(itn, function (item, index) {
                        if (typeof (item) === "object" && !(item instanceof Array)) { // {}
                            try {
                                moduleTitle[inde][index] = JSON.parse(JSON.stringify(item).replace(Object.keys(item)[0], common.uuid('ID')));
                                for (var k = 0; k < item[Object.keys(item)[0]].length; k++) {
                                    moduleTitle[inde][index][Object.keys(module[inde][index])[0]][k] = title;
                                }
                            } catch (e) {
                                layer.msg('生成失败，请重新尝试');
                                return false;
                            }
                        } else {
                            moduleTitle[inde][index] = title
                        }
                    })

                }
            });
            return moduleTitle
        },

        //全局设定 模板生成
        layoutSetModule:function(data){

            switch(data.layoutWidth){
                case '1': data.layoutWidth='[[12]]';break;
                case '2': data.layoutWidth='[[12],[12]]';break;
                case '3': data.layoutWidth='[[6,6]]';break;
                case '4': data.layoutWidth='[[12],[12],[12]]';break;
                case '5': data.layoutWidth='[[{"col6":[12,12]},6]]';break;
                case '6': data.layoutWidth='[[6,{"col6":[12,12]}]]';break;
                case '7': data.layoutWidth='[[12],[6,6]]';break;
                default:break;
            }
            //判断是否是符合格式的宽度布局
            try {
                JSON.parse(data.layoutWidth)
            }
            catch (err) {
                layer.msg('宽度布局不符合规范，无法生成模板配置项，请重新输入宽度布局',{icon: 5,time:5000});
                // return false;
            }
            module=JSON.parse(data.layoutWidth);
            // var module=data.layoutWidth.replace(/[^0-9]/ig, String.fromCharCode(64 + parseInt(12)));
            // String.fromCharCode(64 + parseInt(Math.random()*24))+String.fromCharCode(64 + parseInt(Math.random()*24))

            //随机数生成码 ，暂定这样实现
            function randomCode(){
                //创建26个字母数组
                var arr = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
                var idvalue ='';
                var n = 3;//这个值可以改变的，对应的生成多少个字母，根据自己需求所改
                for(var i=0;i<n;i++){
                    idvalue+=arr[Math.floor(Math.random()*26)];
                }
                return idvalue;
            }

            // 生成module项
            $.map(module,function (itn,inde) {
                if(typeof(itn)==="object" && itn instanceof Array){  //判断是否是一个数据
                    $.map(itn,function (item, index) {
                        if (typeof(item)==="object" && !(item instanceof Array)){ // {}

                            try{
                                //将属性值修改
                                module[inde][index]=JSON.parse(JSON.stringify(item).replace(Object.keys(item)[0],randomCode()));

                                // item.replace(Object.keys(item)[0],String.fromCharCode(64 + parseInt(Math.random()*24)));
                                for(var k=0;k<item[Object.keys(item)[0]].length;k++){

                                    module[inde][index][Object.keys(module[inde][index])[0]][k]=randomCode();

                                }
                            }
                            catch (e) {
                                layer.msg('生成失败，请重新尝试');
                                return false;
                            }


                        }else{ //number
                            module[inde][index]=randomCode()
                        }
                    })

                }
            });

            //判断是否导入生成的module值

            if(resetModule){
                module=resetModule;
            }


            $('.quote-area .layui-quote-nm .des-text').text('根据布局转换生成的对应模块编号 ：'+JSON.stringify(module)+'。 其中每一个对象代表一个模块, 每一个中国号代表一行，一行是12列布局。');//显示出转换的模块段
            // $('.quote-area').show();

            $('.moduleArea').empty();

            //将module中的所有模块组成数组

            moduleArr=[];

            $.map(module,function (itn,inde) {
                if(typeof(itn)==="object" && itn instanceof Array){
                    $.map(itn,function (item, index) {
                        try{
                            if (typeof(item)==="object" && !(item instanceof Array)){

                                moduleArr.push(Object.keys(item)[0]);

                                for(var k=0;k<item[Object.keys(item)[0]].length;k++){
                                    moduleArr.push(item[Object.keys(item)[0]][k]);
                                }

                            }else{
                                moduleArr.push(module[inde][index]);
                            }
                        }
                        catch (e) {
                            layer.msg('生成失败，请重新尝试');
                            return false;
                        }
                    })
                }
            });

            $('.moduleArea').show();
            //生成模板
            custom.layout({
                ele: $('.moduleArea'),
                layoutWidth:JSON.parse(data.layoutWidth),
                layoutHeight:false,//根据内容填充
                moduleName:module,
                done:function (res) {
                }
            });
            $.map(moduleArr,function (item, index) {
                var template='<div class="content-box"><fieldset class="layui-elem-field" style="position: relative">\n' +
                    '            <legend>模块 <b>'+item+'</b></legend>\n' +
                    '            <i class="fa fa-expand full-icon" title="放大"></i> '+
                    '            <div class="layui-field-box">\n' +
                    '                <form action="" name="form_'+item+'" class="layui-form layui-form-pane">\n' +
                    '                    <div class="layui-form-item">\n' +
                    '                        <label class="layui-form-label">组件选择</label>\n' +
                    '                        <div class="layui-input-inline">\n' +
                    '                            <select lay-filter="'+item+'" name="plugin_'+item+'" title="组件选择" style="width: 100px">\n' +
                    '                                <option value="">请选择</option>\n' +
                    '                                <option value="table">表格</option>\n' +
                    '                                <option value="form">表单</option>\n' +
                    // '                                <option value="tree">树</option>\n' +
                    '                                <option value="searchTable">表格搜索</option>\n' +
                    // '                                <option value="upload">上传</option>\n' +
                    // '                                <option value="chart">图表</option>\n' +
                    '                            </select>\n' +

                    '                        </div>\n' +
                    '                    </div>\n' +
                    '                </form>\n' +

                    ' <div class="layui-tab" lay-filter="tab_'+item+'">\n' +
                    '  <ul class="layui-tab-title">\n' +
                    '    <li class="layui-this" lay-id="tab_0'+item+'">CODE</li>\n' +
                    '    <li lay-id="tab_1'+item+'">可视配置</li>\n' +
                    '    <li lay-id="tab_2'+item+'">预览</li>\n' +
                    '  </ul>\n' +
                    '  <div class="layui-tab-content">\n' +

                    '    <div class="layui-tab-item layui-show">' +
                    '    <div id="editor_'+item+'" class="json-editor"></div>'+
                    '                <form action="" name="form_code_'+item+'" class="layui-form layui-form-pane">\n' +
                    '                    <div class="layui-form-item layui-form-text">\n' +
                    // '                        <label class="layui-form-label">组件配置</label>\n' +
                    '                        <div class="layui-input-block">\n' +
                    '                            <textarea class="layui-textarea" name="textarea_'+item+'" id="textarea_'+item+'" title="组件选择" ></textarea>\n' +
                    '                        </div>\n' +
                    '                    </div>\n' +
                    '                </form>\n' +
                    '    </div>\n' +
                    '    <div class="layui-tab-item" id="visual_'+item+'"></div>\n' +
                    '    <div class="layui-tab-item" id="preview_'+item+'"></div>\n' +
                    '  </div>\n' +
                    '</div>'+
                    '            </div>\n' +
                    '        </fieldset></div>';

                $('#module_'+item).append(template);
                form.render('select');
                element.init();
                //下拉框事件注册
                var textareaDom=$('[name=textarea_'+item+']');
                form.on('select('+item+')',function (data) {
                    jsonMap[data.value].name=item;
                    textareaDom.val(JSON.stringify(jsonMap[data.value]));

                    //绑定tempId
                    textareaDom.attr('tempId',tempIdMap[data.value]['tempId']);


                    //默认触发点击tab code项
                    element.tabChange('tab_'+item, 'tab_0'+item);


                    /*switch (data.value) {
                        case 'form' :

                            textareaDom.val(jsonMap['form']);

                            break;

                        case 'tree' :
                            textareaDom.val('');

                            break;

                        case 'table' :
                            textareaDom.val('');
                            break;

                        case 'searchTable' :
                            textareaDom.val('');

                            break;

                        case 'upload' :
                            textareaDom.val('');
                            break;

                        case 'chart' :
                            textareaDom.val('');
                            break;
                    }*/

                    textareaDom.on('change',function () {
                        var val = textareaDom.val();

                        if (val) {
                            try { JSON.parse(val); }
                            catch (e) { layer.msg('Error in parsing json. ' + e)}
                        } else {
                            val = {};
                        }

                        $('#editor_'+item).jsonEditor(JSON.parse(val), {
                            change: function (data) {
                                textareaDom.val(JSON.stringify(data));
                            },
                            propertyclick: function (path) {},
                            /*onkeyup:function (data) {
                                textareaDom.val(JSON.stringify(data));
                            }*/
                        });
                    });
                    $('#editor_'+item).jsonEditor(jsonMap[data.value], {
                        change: function (data) {
                            textareaDom.val(JSON.stringify(data));},
                        propertyclick: function (path) {},

                        /*onkeyup:function (data) {
                            textareaDom.val(JSON.stringify(data));
                        }*/
                    });

                    //value input focus 事件
                    $('#editor_'+item).find('input').on('focus',function () {
                        if($(this).is('.value')){

                            if($(this).parent().is('.string')){

                            }

                        }
                    });



                    //tab切换到预览模块

                    element.on('tab(tab_'+item+')',function (obj) {
                        var configData=JSON.parse(textareaDom.val());
                        if(obj.index===2){

                            //读取配置项，生成模块

                            switch (configData.plugin) {
                                case 'tree':  //tree组件模块

                                    /* custom.tree({
                                         module:item.name,
                                         getDataUrl:item.getDataUrl,
                                         lazy:item.lazy,
                                         theme:item.theme
                                     });*/

                                    break;
                                case 'table':  //table组件模块

                                    custom.table({
                                        module:configData.name,
                                        area:'#preview_'+configData.name,
                                        getDataUrl:configData.getDataUrl,
                                        toolbarBtn:configData.toolbarBtn,
                                        rowBtn:configData.rowBtn,
                                        cols: configData.cols,
                                    });

                                    break;

                                case 'form': //一般form组件模块

                                    custom.form({
                                        module:configData.name,
                                        area:'#preview_'+configData.name,
                                        title:configData.title,
                                        field:configData.field
                                    });

                                    break;

                                case 'searchTable':  //表格搜索

                                    custom.tableSearch({
                                        module:configData.name,
                                        area:'#preview_'+configData.name,
                                        theme:configData.theme,
                                        title:configData.title,
                                        field:configData.field
                                    });



                                    break;
                                case 'chart':  //echart 图表区域

                                    custom.chart({
                                        module: configData.name,
                                        area: '#preview_' + configData.name,
                                        option: configData.option
                                    });


                                    break;
                            }


                        }
                        if(obj.index===1){
                            //可视配置
                            // modeForm

                            var visualParent=$('#visual_'+configData.name);
                            switch (configData.plugin) {
                                case 'tree':

                                    visualParent.empty();

                                    break;
                                case 'table':
                                    visualParent.empty();

                                    break;

                                case 'form':

                                    visualParent.empty().html($('.modeForm').html());
                                    form.render();
                                    form.on('switch(switchTitle)', function(data){
                                        if(!!data.elem.checked){
                                            $('#isTitleArea').show()
                                        }else{
                                            $('#isTitleArea').hide()
                                        }
                                    });

                                    //prop
                                    $(document).off('click','.formLineAdd');
                                    $(document).on('click','.formLineAdd',function () {

                                        var html='<div class="layui-col-md9">\n' +
                                            '         <div class="layui-form-item">\n' +
                                            '             <label class="layui-form-label">表单</label>\n' +
                                            '             <div class="layui-input-block">\n' +
                                            '                 <input type="text" name="formLine0" class="layui-input formLine">\n' +
                                            '                 <i class="fa fa-plus-square formLineAdd"  style="position: absolute;right: -28px;top: 13px; cursor: pointer;color: #999"></i>\n' +
                                            '                 <i class="icon iconfont icon-button-sc-2 formLineDelete"  style="position: absolute;right: -54px;top: 13px; cursor: pointer;color: #999"></i>\n' +
                                            '             </div>\n' +
                                            '         </div>\n' +
                                            '     </div>';
                                        $(this).parent().parent().parent().parent().append(html);
                                        return false;

                                    });
                                    $(document).off('click','.formLineDelete');
                                    $(document).on('click','.formLineDelete',function () {

                                        $(this).parent().parent().parent().remove();

                                    });

                                    var propLayer;
                                    $(document).off('focus','.formLine');
                                    $(document).on('focus','.formLine',function () {
                                        var formLine=$(this);

                                        layer.close(propLayer);


                                        propLayer=layer.open({
                                            title:'属性',
                                            type:1,
                                            content: $('#formProp').html(),
                                            area:['400px'],
                                            offset: [50,$('body').width()-420],
                                            shadeClose: false,
                                            shade:0,
                                            anim:-1,
                                            // id:'formPropLayer',
                                            maxmin:true,
                                            className:'layui-anim-rl',
                                            success:function (obj){
                                                //成功之后填入默认值
                                                form.render();
                                                // var parent=$('#formPropLayer');
                                                var parent=$(obj.selector);
                                                //下拉框默认是隐藏域
                                                var type='input';
                                                form.on('select(formTypeSelect)', function(data){

                                                    parent.find('.field_box').hide();
                                                    parent.find('.'+data.value).show();

                                                    form.on('switch(isUrl)',function (data) {

                                                        if(!!data.elem.checked){
                                                            $('.isUrl').show();
                                                            $('.notUrl').hide()
                                                        }else{
                                                            $('.notUrl').show();
                                                            $('.isUrl').hide();
                                                        }
                                                    });



                                                    if(data.value==='field_Input'){
                                                        type='input';
                                                    }else if(data.value==='field_Radio'){
                                                        type='radio';
                                                    }else if(data.value==='field_Checkbox'){
                                                        type='checkbox';
                                                    }else if(data.value==='field_Switch'){
                                                        type='switch';
                                                    }else if(data.value==='field_Select'){
                                                        type='select';
                                                    }else if(data.value==='field_Textarea'){
                                                        type='textarea';
                                                    }else if(data.value==='field_DateTime'){
                                                        type='datetime';
                                                    }else if(data.value==='field_Hidden'){
                                                        type='hidden';
                                                    }

                                                });

                                                //将input的配置值写入 属性写入弹框中， 如果无法解析，提示错误


                                                //点击确定
                                                form.on('submit(formProp)',function (obj) {

                                                    //导入数据到对应的formLine

                                                    var params={
                                                        "name":parent.find('[name=name]').val(),
                                                        "label":parent.find('[name=label]').val(),
                                                        "required":((parent.find('[name=required]').val()==="true")?true:false),
                                                        "placeholder":parent.find('[name=placeholder]').val(),
                                                        "type":type,
                                                        "isLabelFull":((parent.find('[name=isLabelFull]').val()==="true")?true:false),
                                                        "verify":parent.find('[name=verify]').val(),
                                                        "col":parent.find('[name=col]').val(),
                                                        "isOriginOper":parent.find('[name=isOriginOper]').val(),
                                                    };
                                                    if(type==='select'){
                                                        params.url=parent.find('[name=name]').val();
                                                    }

                                                    formLine.val(JSON.stringify(params));

                                                    return false;
                                                });


                                            }
                                        });

                                    });


                                    //btn
                                    $(document).off('click','.btnLineAdd');
                                    $(document).on('click','.btnLineAdd',function () {
                                        var html='<div class="layui-col-md9">\n' +
                                            '         <div class="layui-form-item">\n' +
                                            '             <label class="layui-form-label">按钮</label>\n' +
                                            '             <div class="layui-input-block">\n' +
                                            '                 <input type="text" name="formLine0" class="layui-input formLine">\n' +
                                            '                 <i class="fa fa-plus-square formLineAdd"  style="position: absolute;right: -28px;top: 13px; cursor: pointer;color: #999"></i>\n' +
                                            '                 <i class="icon iconfont icon-button-sc-2 btnLineDelete"  style="position: absolute;right: -54px;top: 13px; cursor: pointer;color: #999"></i>\n' +
                                            '             </div>\n' +
                                            '         </div>\n' +
                                            '     </div>';
                                        $(this).parent().parent().parent().parent().append(html);
                                        return false;

                                    });
                                    $(document).off('click','.btnLineDelete');
                                    $(document).on('click','.btnLineDelete',function () {
                                        $(this).parent().parent().parent().remove();
                                    });

                                    $(document).off('focus','.btnLine');
                                    $(document).on('focus','.btnLine',function () {
                                        var formLine=$(this);

                                        layer.close(propLayer);

                                        propLayer=layer.open({
                                            title:'属性',
                                            type:1,
                                            content: $('#formProp').html(),
                                            area:['400px'],
                                            offset: [50,$('body').width()-420],
                                            shadeClose: false,
                                            shade:0,
                                            anim:-1,
                                            maxmin:true,
                                            className:'layui-anim-rl',
                                            success:function (obj){
                                                //成功之后填入默认值
                                                form.render();
                                                // var parent=$('#formPropLayer');
                                                var parent=$(obj.selector);
                                                //下拉框默认是隐藏域
                                                var type='input';
                                                form.on('select(formTypeSelect)', function(data){

                                                    parent.find('.field_box').hide();
                                                    parent.find('.'+data.value).show();

                                                    form.on('switch(isUrl)',function (data) {

                                                        if(!!data.elem.checked){
                                                            $('.isUrl').show();
                                                            $('.notUrl').hide()
                                                        }else{
                                                            $('.notUrl').show();
                                                            $('.isUrl').hide();
                                                        }
                                                    });



                                                    if(data.value==='field_Input'){
                                                        type='input';
                                                    }else if(data.value==='field_Radio'){
                                                        type='radio';
                                                    }else if(data.value==='field_Checkbox'){
                                                        type='checkbox';
                                                    }else if(data.value==='field_Switch'){
                                                        type='switch';
                                                    }else if(data.value==='field_Select'){
                                                        type='select';
                                                    }else if(data.value==='field_Textarea'){
                                                        type='textarea';
                                                    }else if(data.value==='field_DateTime'){
                                                        type='datetime';
                                                    }else if(data.value==='field_Hidden'){
                                                        type='hidden';
                                                    }

                                                });


                                                //点击确定
                                                form.on('submit(formProp)',function (obj) {

                                                    var params={

                                                    };

                                                    formLine.val(JSON.stringify(params));

                                                    return false;
                                                });


                                            }
                                        });

                                    });

                                    break;

                                case 'searchTable':
                                    visualParent.empty();



                                    break;
                                case 'chart':
                                    visualParent.empty();


                                    break;
                            }

                        }
                    })

                });

            });

            if(moduleArr.length>0){
                //显示提交栏
                $('.btnMainBox').show();
            }else{
                $('.btnMainBox').hide();
            }
            //重新渲染图片及selected值
            // layui.selImg($, '#layoutWidth');
            $('#layoutWidth').next().find('.layui-select-title>input').val(data.layoutWidth);
        },


        pluginSet:function(pluginName,obj){
            switch (pluginName) {
                case 'tree':  //tree组件模块

                    custom.tree(obj);

                    break;
                case 'table':  //table组件模块
                    custom.table(obj);

                    break;

                case 'form': //一般form组件模块

                    custom.form(obj);

                    break;

                case 'searchTable':  //表格搜索

                    custom.tableSearch(obj);

                    break;
                case 'grid':  //栅格区域

                    custom.layout(obj);

                    break;
                case 'chart':  //echart 图表区域

                    custom.chart(obj);
                    break;
                case 'tab':  //栅格区域

                    custom.tab(obj);

                    break;

                case 'card':  //面板

                    custom.card(obj);

                    break;

                case 'accordion':  //手风琴

                    custom.accordion(obj);

                    break;
            }
        },

        //grid 栅格布局
        layoutModule:function(obj){
            custom.layout(obj);
        },

        //组件导入配置
        pluginShow:function(){

        },

        domEvent:function(){
            //生成模板配置项
            form.on('submit(layoutSet)',function (obj) {

                eventHandler.layoutSetModule(obj.field);
                return false;
            });

            form.on('select',function (obj) {

                if(obj.value==='custom'){
                    $('.custom-height-area').show();
                }else{
                    $('.custom-height-area').hide();
                }

            });
            common.toggleArea($('.toggle-btn1'),$('.toggle-area1'),'展开更多配置','收起');

            // $('[name=dataBase]').off().on('focus',function () {eventHandler.dataBaseLayer();});
            $('.icon-dataBase').off().on('click',function () {eventHandler.dataBaseLayer();});


           /* //清空页面上的所有配置项项
            $('#clearAll').off().on('click',function () {
                // form.render();
                $('input').val('');
                $('textarea').val('');
                $('.quote-area .layui-quote-nm').text('');
                $('.quote-area').hide();

                $('.moduleArea').empty();
            });*/
            $('.clearAll').off().on('click',function () {
                compPluginList=[];//清空组件列表
                // form.render();
                $('input').val('');
                $('textarea').val('');
                $('.quote-area .layui-quote-nm').text('');
                $('.quote-area').hide();

                $('.moduleArea').empty();

                currentSetCompId=common.uuid();

            });

            /*//提交配置
            $('#submitConfig').off().on('click',function () {

                var url='compmgr/webUseomponent/saveUseComponentInfo';


                var params=eventHandler.getConfigData();

                var layerLoader =common.layerLoader();//正在加载弹出层
                common.fetchPost(url,params,function (res) {
                    if(res.success){
                        layer.msg('提交成功！！！',{icon:6});
                        var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
                        parent.layer.close(index); //再执行关闭

                        //:todo 触发 父级的刷新按钮


                    }else{
                        layer.msg("提交失败,"+res['resultMessage'], {
                            icon: 5,
                            time:5000
                        });
                    }

                    $('#clearAll').click();
                    $('.btnMainBox').hide();
                    layer.close(layerLoader);
                },function () {
                    layer.close(layerLoader);
                    layer.msg('提交失败，请重试!!!',{icon:5});
                });

            });*/

            //提交配置
            $('.submitConfig').off().on('click',function () {

                var url='compmgr/webComponent/componentInfo';

                if (!$.trim($('#pageName').val())) {
                    layer.msg('请填写名称！');
                    return false
                }
                if (!$('#pageType').val()) {
                    layer.msg('请选择页面类型！');
                    return false
                }
                if (!$.trim($('#projectCode').val())) {
                    layer.msg('请选择项目归类！');
                    return false
                }
                //获取全局配置
                var params=eventHandler.globalConfigData();


                var layerLoader =common.layerLoader();//正在加载

                common.fetchPost(url,params,function (res) {

                    if(res.success){
                        layer.msg('提交成功！！！',{icon:6});
                        // var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
                        // parent.layer.close(index); //再执行关闭
                        //
                        // $(window.parent.document.getElementById('refreshBtn')).trigger('click');

                    }else{
                        layer.msg("提交失败,"+res['resultMessage'], {
                            icon: 5,
                            time:5000
                        });
                    }


                    // $('.clearAll').click();
                    // $('.btnMainBox').hide();
                    // $('.toolBar').hide();
                    layer.close(layerLoader);
                }, function (err) {
                    layer.close(layerLoader);
                    layer.msg('提交失败,' + err['resultMessage'], {icon: 5});
                });


            });


            //预览生成的页面
            $('.previewConfig').off().on('click',function () {
                //根据所有配置项，生成页面

                $('#configData').val(JSON.stringify(eventHandler.globalConfigData()));


                window.open(window.location.origin+'/src/page/custom/preview.html');
            });



            $('#databaseLodash').off().on('click',function () {

                //导入弹框信息
                var lodashLayer=layer.open({
                    title:'插入值',
                    type:1,
                    content: '<div><ul class="lodashList" id="lodashList"></ul></div>', //主题样式配置窗口
                    area:['350px','500px'],
                    offset: [50,$('body').width()-450],
                    shadeClose: false,
                    shade:0,
                    anim:-1,
                    id:'lodashLayer',
                    maxmin:true,
                    className:'layui-anim-rl',
                    success:function (obj){

                        var data=dataBase;

                        var html='';
                        $.map(data,function (item, index) {
                            html+='<li data-name="'+item.name+'" data-text="'+item.text+'"><span class="span1">'+item.text+'</span><span class="span2">'+item.name+'</span></li>';
                        });
                        $(obj.selector).find('#lodashList').empty().html(html);

                    }
                });

            });


            //模块缩放
            $(document).on('click','.fa-expand',function () {
                $(this).parent().parent().addClass('full-panel');
                $(this).removeClass('fa-expand').addClass('fa-compress');
            });
            $(document).on('click','.fa-compress',function () {
                $(this).parent().parent().removeClass('full-panel');
                $(this).removeClass('fa-compress').addClass('fa-expand');
            });

            //左右按钮
            dom.rightBtn.off().on('click',function () {
                if($(this).find('i').is('.layui-icon-next')){
                    dom.rightControl.hide();
                    dom.centerControl.css('padding-right','0px');
                    $(this).find('i').removeClass('layui-icon-next').addClass('layui-icon-prev');
                }else{
                    dom.rightControl.show();
                    dom.centerControl.css('padding-right','320px');
                    $(this).find('i').removeClass('layui-icon-prev').addClass('layui-icon-next');
                }
            });
            dom.leftBtn.off().on('click',function () {
                if($(this).find('i').is('.layui-icon-prev')){
                    dom.leftControl.hide();
                    dom.centerControl.css('padding-left','0px');
                    $(this).find('i').removeClass('layui-icon-prev').addClass('layui-icon-next');
                }else{
                    dom.leftControl.show();
                    dom.centerControl.css('padding-left','320px');
                    $(this).find('i').removeClass('layui-icon-next').addClass('layui-icon-prev');
                }
            });


            //组件拖拽

            $('.pluginBox').find('li').mousedown(function (e) {
                $(this).clone().addClass("cloneLab").appendTo($("#configPage").find('.content-wrap'));
                $("body").css('cursor','move');
                $(".cloneLab").css('left',e.clientX);
                $(".cloneLab").css('top',e.clientY);
            });
            $(document).mousemove(function(e){
                if($(".cloneLab").length>0) {
                    $(".cloneLab").css('left',e.clientX);
                    $(".cloneLab").css('top',e.clientY);
                }
            });
            $(document).mouseup(function(e){
                if($(".cloneLab").length>0) {
                    var target;
                    var plugin=$(".cloneLab");

                    //target 区域判断

                    var targetParent=$(e.target).parents();

                    if(($(e.target).attr('modulename') && $(e.target).attr('modulename').indexOf('module_')>-1)
                        || ($(e.target).attr('class') && $(e.target).attr('class').indexOf('centerControl')>-1)){
                        target=$(e.target);
                    }else{
                        for(var i=0;i<targetParent.length;i++){
                            if(($(targetParent[i]).attr('modulename') && $(targetParent[i]).attr('modulename').indexOf('module_')>-1 )
                                || ($(targetParent[i]).attr('class') && $(targetParent[i]).attr('class').indexOf('centerControl')>-1)){
                                target=$(targetParent[i]);
                                break;
                            }
                        }
                    }


                    /*if(target.parents().is('.centerControl') || target.contents()){
                        $('.centerControl').removeClass('overMove');
                    }*/
                    if(!target){
                        layer.msg('请拖入正确位置');
                        $(".cloneLab").remove();
                        $("body").css('cursor','auto');
                        return false;
                    }
                    if(plugin.attr('data-plugin')==='grid'){
                        //导入布局
                        var grid=plugin.attr('data-grid');
                        //生成grid
                        var moduleName=eventHandler.moduleNameTransform(grid);
                        var moduleStyle=eventHandler.moduleStyleTransform(grid);


                        var eleArea;

                        if(target.find('.preview')[0]){ //判断是否存在preview 区域
                            eleArea=target.find('.preview')
                        }else {
                            eleArea=target
                        }

                        compPluginList.push({
                            "tempId":"c7a2ee316f724cff9c6070236fca0688",
                            "module":eleArea.attr('data-preview')?eleArea.attr('data-preview').replace('ID',''):common.uuid(),//compId
                            "layoutWidth": JSON.parse(grid),
                            "moduleName": moduleName,
                            "moduleStyle": moduleStyle,
                            "parentCompId":($('#compId').text()?$('#compId').text():currentSetCompId)
                        });

                        eventHandler.layoutModule({
                            ele:eleArea,
                            layoutWidth: JSON.parse(grid),
                            moduleName:moduleName,
                            moduleStyle:moduleStyle,
                            done:function () {
                                //将module中的所有模块组成数组
                                var moduleArr=[];
                                $.map(moduleName,function (itn,inde) {
                                    if(typeof(itn)==="object" && itn instanceof Array){
                                        $.map(itn,function (item, index) {

                                            try{
                                                if (typeof(item)==="object" && !(item instanceof Array)){

                                                    moduleArr.push(Object.keys(item)[0]);

                                                    for(var k=0;k<item[Object.keys(item)[0]].length;k++){
                                                        moduleArr.push(item[Object.keys(item)[0]][k]);
                                                    }

                                                }else{
                                                    moduleArr.push(moduleName[inde][index]);
                                                }
                                            }
                                            catch (e) {
                                                layer.msg('生成失败，请重新尝试');
                                                return false;
                                            }
                                        })
                                    }
                                });

                                //生成配置页面的展示内容
                                $.map(moduleArr,function (item, index) {
                                    var template='<div class="clearFix" style="min-height: 100px">' +
                                        '<div class="custom-title">'+item+'</div>'+
                                        '<textarea class="layui-textarea" name="textarea_'+item+'" id="textarea_'+item+'" style="display: none" ></textarea>' +
                                        '<div class="preview" id="preview_'+item+'" data-preview="'+item+'"></div>'+
                                        '</div>';
                                    $('#module_'+item).find('.content-box').append(template);

                                });

                                if(moduleArr.length>0){
                                    //显示提交栏
                                    $('.toolBar').show();
                                }else{
                                    $('.toolBar').hide();
                                }
                            }
                        });
                    }else{

                        if(!target.attr('modulename')){
                            layer.msg('请先导入栅格布局');
                            $(".cloneLab").remove();
                            $("body").css('cursor','auto');
                            return false;
                        }
                        // if(target)
                        var defaultOpt = {};
                        if (plugin.attr('data-plugin') === 'chart') {
                            var chartType = plugin.attr('data-chart');

                            switch (chartType) {
                                case 'line':
                                    defaultOpt['option'] = chartOption.lineChartOption();
                                    break;
                                case 'bar':
                                    defaultOpt['option'] = chartOption.barChartOption();
                                    break;
                                case 'pie':
                                    defaultOpt['option'] = chartOption.pieChartOption();
                                    break;
                                case 'scatter':
                                    defaultOpt['option'] = chartOption.scatterChartOption();
                                    break;
                                case 'radar':
                                    defaultOpt['option'] = chartOption.radarChartOption();
                                    break;

                            }
                        }

                        var itemName=target.attr('modulename').substring(7);

                        var pluginName=plugin.attr('data-plugin');
                        var textareaDom=$('[name=textarea_'+itemName+']');
                        var data = $.extend({}, jsonMap[pluginName], {"name": itemName}, defaultOpt);
                        textareaDom.val(JSON.stringify(data));
                        textareaDom.attr('tempId',tempIdMap[pluginName]['tempId']);
                        textareaDom.attr('compId',itemName.replace('ID',''));

                        //将拖入的组件导入 全局变量中
                        compPluginList.push($.extend({},data,{
                            module:itemName,
                            "parentCompId":($('#compId').text()?$('#compId').text():currentSetCompId)
                        }));

                        eventHandler.pluginSet(plugin.attr('data-plugin'), $.extend({},data,{
                            module:itemName,
                            area:'#preview_'+itemName
                        }));

                    }

                    //清除
                    $(".cloneLab").remove();
                    $("body").css('cursor','auto');
                }

            });
            //选中选择区域，定制右边工具栏
            $(document).on('click','.content-box',function (event) {

                dom.editorModule.find('input').blur();

                event.stopPropagation();
                //高亮选中
                $('.content-box').removeClass('selected');
                $(this).addClass('selected');

                //获取选中项组件配置
                var textareaData=$('[name=textarea_'+$(this).parent().attr('modulename').substring(7)+']');

                //栅格数据导入

                var styleSet={
                    styleModuleName:$(this).parent().attr('modulename'),//设置当前的moduleName
                    paddingTop:$(this).parent().css('padding-top'),
                    paddingBottom:$(this).parent().css('padding-bottom'),
                    paddingLeft:$(this).parent().css('padding-left'),
                    paddingRight:$(this).parent().css('padding-right'),
                    borderLeft:$(this).parent().css('border-left'),
                    borderRight:$(this).parent().css('border-right'),
                    borderTop:$(this).parent().css('border-top'),
                    borderBottom:$(this).parent().css('border-bottom'),
                    backgroundColor: $(this).parent().find('.content-box').css('background-color'),
                    backgroundImage: $(this).parent().find('.content-box').css('background-image')
                };
                form.val('moduleStyleSet',styleSet);

                if(!!textareaData[0]){

                    $('.reminderTip').hide();

                    $('.jsonEditorArea').show();
                    $('.styleSetArea').show();

                    $('.currentEditModule').empty().text($(this).parent().attr('modulename').replace('module_',''));

                    var configData;

                    if(textareaData.val()){
                        configData=JSON.parse(textareaData.val());
                    }else{
                        return false;
                    }

                    var textareaDom=$('[name=textarea_module]');
                    //组件属性数据导入
                    textareaDom.val(textareaData.val());


                    //绑定tempId
                    textareaDom.attr('tempId',tempIdMap[configData.plugin]['tempId']);
                    textareaDom.attr('compId',tempIdMap[configData.plugin]['compId']);

                    textareaDom.on('change',function () {
                        var val = textareaDom.val();


                        if (val) {
                            try { JSON.parse(val); }
                            catch (e) { layer.msg('Error in parsing json. ' + e)}
                        } else {
                            val = {};
                        }

                        dom.editorModule.jsonEditor(JSON.parse(val), {
                            change: function (data) {
                                textareaDom.val(JSON.stringify(data));
                            },
                            propertyclick: function (path) {}
                        });

                        //更新对应模块的组件textarea 值
                        $('[name=textarea_'+JSON.parse(val).name+']').val(textareaDom.val());

                    });
                    dom.editorModule.jsonEditor(JSON.parse(textareaData.val()), { change: function (data) {
                            textareaDom.val(JSON.stringify(data));
                            //并写入对应模块的textarea区域
                            textareaData.val(JSON.stringify(data));
                        }, propertyclick: function (path) {
                        }});

                    //value input focus 事件
                    dom.editorModule.find('input').on('focus',function () {
                        if($(this).is('.value')){

                            if($(this).parent().is('.string')){

                            }

                        }
                    });

                }else{
                    $('.jsonEditorArea').hide();
                    $('.reminderTip').show();
                }

            });

            //栅格配置 呈现
            $('.styleSetArea').find('input').off().blur(function () {
               //失去焦点时候，刷新页面的配置项 并在预览区域生效

                var setDom=$('#'+$('[name=moduleStyleSet]').find('[name=styleModuleName]').val());

                var dataGetDom=$('[name=moduleStyleSet]');

                //设置样式
                var styleObj={
                    paddingTop:$.trim(dataGetDom.find('[name=paddingTop]').val()),
                    paddingBottom:$.trim(dataGetDom.find('[name=paddingBottom]').val()),
                    paddingLeft:$.trim(dataGetDom.find('[name=paddingLeft]').val()),
                    paddingRight:$.trim(dataGetDom.find('[name=paddingRight]').val()),
                    borderLeft:$.trim(dataGetDom.find('[name=borderLeft]').val()),
                    borderRight:$.trim(dataGetDom.find('[name=borderRight]').val()),
                    borderTop:$.trim(dataGetDom.find('[name=borderTop]').val()),
                    borderBottom:$.trim(dataGetDom.find('[name=borderBottom]').val()),
                    backgroundColor:$.trim(dataGetDom.find('[name=backgroundColor]').val()),
                    backgroundImage:$.trim(dataGetDom.find('[name=backgroundImage]').val())
                };
                setDom.css({
                    paddingTop:$.trim(dataGetDom.find('[name=paddingTop]').val()),
                    paddingBottom:$.trim(dataGetDom.find('[name=paddingBottom]').val()),
                    paddingLeft:$.trim(dataGetDom.find('[name=paddingLeft]').val()),
                    paddingRight:$.trim(dataGetDom.find('[name=paddingRight]').val()),
                    borderLeft:$.trim(dataGetDom.find('[name=borderLeft]').val()),
                    borderRight:$.trim(dataGetDom.find('[name=borderRight]').val()),
                    borderTop:$.trim(dataGetDom.find('[name=borderTop]').val()),
                    borderBottom:$.trim(dataGetDom.find('[name=borderBottom]').val())
                });
                setDom.find('.content-box').css({
                    backgroundColor:$.trim(dataGetDom.find('[name=backgroundColor]').val()),
                    backgroundImage:$.trim(dataGetDom.find('[name=backgroundImage]').val())
                });

                $.map(compPluginList,function (item,index) {

                    if(item['moduleStyle']){
                        $.map(item['moduleName'],function (current,i) {
                            if (current.length > 1) {
                                for (var p = 0; p < current.length; p++) {
                                    if (current[p] === $('[name=moduleStyleSet]').find('[name=styleModuleName]').val().replace('module_', '')) {
                                        compPluginList[index]['moduleStyle'][i][p] = styleObj;
                                    }
                                }
                            } else {
                                if (current[0] === $('[name=moduleStyleSet]').find('[name=styleModuleName]').val().replace('module_', '')) {

                                    compPluginList[index]['moduleStyle'][i][0] = styleObj;
                                    return false;
                                }
                            }

                        });
                    }
                });

            });

            // 栅格标题选择
            form.on('select(gridTitle)', function (data) {
                if (data.value === "0") {
                    $('.gridTitleSetArea').hide()
                } else {
                    $('.gridTitleSetArea').show()
                }
            });




            //刷新模块预览区域
            $('.refreshPreviewArea').off().on('click',function () {

                var pluginData=$('#textarea_module').val()?JSON.parse($('#textarea_module').val()):{};
                var pluginName=pluginData.plugin;

                eventHandler.pluginSet(pluginName, $.extend({},pluginData,{
                    module:pluginData.name,
                    area:'#preview_'+pluginData.name,
                    empty:true
                }));

                if(pluginData.name){
                    layer.msg('模块：'+pluginData.name+' 刷新成功');
                }

            });

            //获取模块页面的所有数据
            $('.getModulePage').off().on('click',function () {

                layer.open({
                    title: '弹框页面信息',
                    maxmin: false,
                    type: 1,
                    area: ['650px','380px'],
                    // maxHeight: '200px',
                    shadeClose: true,
                    content: '<div style="padding: 10px"><div class="tipArea"><i class="fa fa-info-circle"></i><span>提示：双击行，弹框页面ID信息</span></div><div id="templatePageId" lay-filter="templatePageId"></div></div>',
                    // btn:['确定','取消'],
                    success: function(obj) {
                        table.render(common.tableInitParams({
                            elem: $(obj.selector).find('#templatePageId'),
                            url: baseUrl+'compmgr/webComponent/topWebComponent',
                            method: 'post',
                            page:false,
                            parseData: function(res){ //res 即为原始返回的数据
                                return {

                                    "code": 0, //解析接口状态
                                    "msg": res['resultMessage'], //解析提示文本
                                    "count": 100, //解析数据长度
                                    "data": res.list //解析数据列表
                                };
                            },
                            where:{
                                "wtmiTypecode": "layerPage"
                            },
                            height: '250px',
                            cols: [
                                [
                                    { field: 'wumiId', title: 'ID',sort: true},
                                    { field: 'wumiChname', title: '页面名称',sort: true},
                                    // { field: 'wtmiVersion', title: '版本', sort:true},
                                    {
                                        field: 'ggCreateDatetime',
                                        title:'创建时间',sort:true,
                                        templet: function(rowData) {
                                            return util.toDateString(rowData['ggCreateDatetime']);
                                        }
                                    }
                                ]
                            ]
                        }));
                        //监听行双击事件
                        table.on('rowDouble(templatePageId)', function(obj){
                            // 创建元素用于复制
                            var aux = document.createElement("input");

                            // 设置元素内容
                            aux.setAttribute("value", obj.data.wumiId);

                            // 将元素插入页面进行调用
                            document.body.appendChild(aux);

                            // 复制内容
                            aux.select();

                            // 将内容复制到剪贴板
                            document.execCommand("copy");

                            // 删除创建元素
                            document.body.removeChild(aux);

                            layer.msg('模板页面ID: '+obj.data.wumiId +' 复制成功');
                        });
                    }
                })

            });

            //页面类型设置

            form.on('select(pageType)',function (data) {

            });
        },

        /**
         * 导入配置项 生成页面
         * */
        configDataInit:function(){

            var layerLoader=common.layerLoader();
            // var layerLoader='erer';

            //跨域通信中判断是否存在导入配置内容的值
            setTimeout(function () {
                var compId=$('#compId').text();
                if(!!compId){
                    //获取配置值
                    common.fetchGet('compmgr/webComponent/componentInfo?compId='+compId,function (res) {
                        layer.close(layerLoader);

                        var data=res.list;

                        if(!!data && data.length>0){

                            var initGridList=[],initPluginList=[];
                            //对组件进行分类
                            $.map(data,function (item, index) {
                                if(!item.prop){
                                    dom.pageName.val(item['compName']);
                                    dom.pageType.val(item['tempId']);
                                    dom.projectCode.val(item['projectCode']);
                                    form.render('select');

                                }else if(item.prop.layoutWidth){
                                    //遍历出栅格组件
                                    initGridList.push(item)
                                }else{
                                    //遍历出其他组件
                                    initPluginList.push(item);
                                }
                            });


                            //导入全部的栅格组件
                            $.map(initGridList,function (item, index) {

                                //导入栅格布局
                                var grid=item.prop.layoutWidth;
                                var grid2=item.prop.layoutWidth;

                                var moduleName=item.prop.moduleName;

                                var moduleStyle;

                                if(item.prop.moduleStyle.length>0){

                                    moduleStyle=item.prop.moduleStyle

                                }else{

                                    moduleStyle=eventHandler.moduleStyleTransform(JSON.stringify(grid));

                                }

                                var eleArea,target;
                                if(index===0){
                                    target=dom.centerControl;
                                }else{
                                    target=$('#module_ID'+item.compId);
                                }

                                if(target.find('.preview')[0]){ //判断是否存在preview 区域
                                    eleArea=target.find('.preview')
                                }else {
                                    eleArea=target
                                }

                                compPluginList.push({
                                    "tempId":item.tempId,
                                    "module":item.compId,
                                    "layoutWidth": item.prop.layoutWidth,
                                    "moduleName": moduleName,
                                    "moduleStyle": moduleStyle,
                                    "parentCompId":item.parentCompId,
                                    "parentCompPath":item.parentCompPath?item.parentCompPath:''
                                });


                                eventHandler.layoutModule({
                                    ele:eleArea,
                                    layoutWidth: item.prop.layoutWidth,
                                    moduleName:moduleName,
                                    moduleStyle:moduleStyle,
                                    done:function (data) {
                                        //将module中的所有模块组成数组

                                        var moduleArr=[];
                                        $.map(moduleName,function (itn,inde) {

                                            if(typeof(itn)==="object" && itn instanceof Array){
                                                $.map(itn,function (item1, index1) {
                                                    try{
                                                        if (typeof(item1)==="object" && !(item1 instanceof Array)){

                                                            moduleArr.push(Object.keys(item1)[0]);

                                                            for(var k=0;k<item1[Object.keys(item1)[0]].length;k++){
                                                                moduleArr.push(item1[Object.keys(item1)[0]][k]);
                                                            }
                                                        }else{
                                                            moduleArr.push(moduleName[inde][index1]);
                                                        }
                                                    }
                                                    catch (e) {
                                                        layer.msg('生成失败，请重新尝试');
                                                        return false;
                                                    }
                                                })
                                            }
                                        });

                                        //生成配置页面的展示内容
                                        $.map(moduleArr,function (item2) {
                                            var template='<div class="clearFix" style="min-height: 100px">' +
                                                '<div class="custom-title">'+item2+'</div>'+
                                                '<textarea class="layui-textarea" name="textarea_'+item2+'" id="textarea_'+item2+'" style="display: none" ></textarea>' +
                                                '<div class="preview clearFix" id="preview_'+item2+'" data-preview="'+item2+'"></div>'+
                                                '</div>';
                                            $('#module_'+item2).find('.content-box').append(template);

                                        });

                                        if(moduleArr.length>0){
                                            //显示提交栏
                                            $('.toolBar').show();
                                        }else{
                                            $('.toolBar').hide();
                                        }
                                    }
                                });
                            });

                            //导入其他组件
                            $.map(initPluginList,function (item, index) {

                                var itemName=item.compName;

                                var pluginName=item.prop.plugin;

                                var textareaDom=$('[name=textarea_'+itemName+']');
                                var data=$.extend({},item.prop,{"name":itemName});
                                textareaDom.val(JSON.stringify(data));
                                textareaDom.attr('tempId',tempIdMap[pluginName]['tempId']);
                                textareaDom.attr('compId',itemName.replace('ID',''));

                                //将拖入的组件导入 全局变量中
                                compPluginList.push($.extend({},data,{
                                    module:itemName,
                                    "parentCompId":item.parentCompId,
                                    "parentCompPath":item.parentCompPath?item.parentCompPath:''
                                }));

                                eventHandler.pluginSet(pluginName, $.extend({},data,{
                                    module:itemName,
                                    area:'#preview_'+itemName
                                }));

                            });
                        }
                        /*if(!!data){
                            dom.layoutWidth.val(JSON.stringify(data['prop']['layoutWidth']));
                            if (data['prop']['layoutHeight'] !== 'false' || data['prop']['layoutHeight'] !== 'auto') {

                                dom.layoutHeight.val(data['prop']['layoutHeight']);
                            } else {
                                dom.layoutHeight.val('custom');
                                dom.heightValue.val(data['prop']['layoutHeight']).show();
                            }
                            dom.pageName.val(data['compName']);

                            //重置resetModule
                            resetModule=data['prop']['moduleName'];
                            dom.layoutSet.trigger('click');//触发模板生成按钮

                            form.render('select','propForm');

                            //配置每个模块导入的插件属性
                            var propArr=[];
                            var func={
                                getProp:function(components){
                                    if(!! components && components.length>0){
                                        $.map(components,function (val) {
                                            if(!!val.prop){
                                                propArr.push(val.prop);
                                                func.getProp(val.components);
                                            }
                                        })
                                    }
                                }
                            };
                            //组成所有生成的prop
                            $.map(data.components,function (item) {
                                if(!! item.prop){
                                    propArr.push(item.prop);
                                    func.getProp(item.components);
                                }
                            });

                            $.map(propArr,function (item, index) {
                                var plugin=item.plugin;
                                $('select[name=plugin_'+item.name).siblings("div.layui-form-select").find('dl dd[lay-value=' + plugin + ']').click();
                            });

                        }*/
                    });
                }else{
                    layer.close(layerLoader);
                }
            },100);
        },


        dataSet:function(){
            $('.layui-colla-content').css({
                'height':($(document).height()-153)+'px',
                'overflow-y':'auto'
            });


            //获取单页面和配置页面
            var params={
                "wtmiTypecodes": "page,layerPage"
            };
            common.fetchPost('compmgr/webcomponenttemplate/webComponentTemplateList',params,function (res) {
                var options='';
                $.map(res.list,function (item, index) {
                    if(index===0){
                        options+='<option value="'+item.wtmiId+'" selected>'+item.wtmiTypename+'</option>';
                    }else{
                        options+='<option value="'+item.wtmiId+'">'+item.wtmiTypename+'</option>';
                    }
                });
                $('#pageType').html(options);
                form.render('select');
            }, null, false);

            common.selectDataSet({
                elem: $('#projectCode'),
                url: 'sysmgr/dicts/selectDictListByPcode?dictPCode=projectCode',
                responseList: 'list',
                method: 'get',//默认为get
                optionText: 'sdName',
                optionValue: 'sdCode',
                success: function (data) {
                    form.render('select');
                }
            });


        },
        /**
         * 页面初入口
         * */
        pageLoad:function () {

            this.dataSet();
            this.domEvent();

            this.configDataInit();

        }
    };


    eventHandler.pageLoad();

});
