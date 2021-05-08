/**
 @Name：自定义数据导入
 @des:  layout 布局   plugin ：[tree table] 组件导入
 @Author：gaoli
 @updateTime : 2019-05-26

 */

layui.config({
    base: '../../../src/js/',
    version: new Date().getTime()
}).extend({});
layui.define(['layer', 'element', 'eleTree', 'common', 'table', 'form', 'laydate', 'upload'], function (exports) {
    var layer = layui.layer,
        element = layui.element,
        common=layui.common,
        table=layui.table,
        form=layui.form,
        tree=layui.eleTree,
        laydate = layui.laydate,
        util = layui.util,
        upload = layui.upload;

    var global={
        baseUrl:'../../../'
    };

    var moduleParams = {};//所有的模块的配置总和

    var currentMenuSmIdText = common.getCurrentMenuId();

    var treeMap={};
    var treeCurrentNodeMap={};
    var chartMap = {};

    var dom={
        rowDataLine:$('#rowDataLine'),
        nodeDataLine:$('#nodeDataLine'),
        customDataLine:$('#customDataLine') //用于保存用户自定义数据
    };

    //工具集
    var toolHandle = {
        titleSet: function (obj, template) {

            /*   { //标题设置
                   theme:"0",//主题 0 表示无 1表示默认
                   name:"",//标题名
                   subName:"",//辅助标题
                   helpTip:"" //提示
               }*/

            if (template) {
                if (obj && obj != {} && obj.theme !== '0' && obj.name) {

                    var subName = '', helpTip = '';
                    if (obj.subName) {
                        subName = '<div style="display: inline-block;padding-left: 10px">' + obj.subName + '</div>';
                    }
                    if (obj.helpTip) {
                        helpTip = '<b class="help-tip" style="display: inline-block;padding-left: 1px;cursor: pointer"><i class=" fa fa-question-circle-o" data-helpTip="' + obj.helpTip + '"></i></b>'
                    }

                    template += '<div class="layui-card-header layui-card-header-custom"><span><i></i>' + obj.name + subName + helpTip + '</span></div>';
                }

                return template;
            }

        },
        helpTip: function () {
            $('.help-tip').off().on('click', function () {
                var data = $(this).find('i').attr('data-helpTip');
                layer.tips(data, $(this), {tips: 4});
            });
        },
        //table templet 预设置
        tableModuleTemplet: function (type, data) {
            var html;

            //注册规则 描述尽量可读
            var typeRule = {
                "checkIcon": [
                    {
                        type: "check-square",
                        value: ">0"
                    },
                    {
                        type: "minus-square",
                        value: 0
                    },
                    {
                        type: "empty",
                        value: null
                    }
                ]
            };

            var rules = typeRule[type];

            switch (type) {
                case "checkIcon":
                    if (data === 0) {
                        html = "<div style='text-align: center'><i style='font-size: 16px' class='danger fa fa-" + rules[1]['type'] + "'></i></div>"
                    } else if (data > 0) {
                        html = "<div style='text-align: center'><i style='font-size: 16px' class='green fa fa-" + rules[0]['type'] + "'></i></div>"
                    } else {
                        html = "";
                    }
                    break;
            }

            return html;
        },
        createFileRow: function (text, id, type, res) {
            var tr = document.createElement('tr');
            if (id) {
                tr.id = id;
            }
            var fileName_td = document.createElement('td');
            fileName_td.innerHTML = text;

            // '<td>' + (file.size / 1014).toFixed(1) + 'kb</td>'
            // var fileSize_td = document.createElement('td');
            //
            // fileSize_td.innerHTML = (res.size / 1014).toFixed(1)+ 'kb';
            var status_td = document.createElement('td');
            var status_btn = document.createElement('span');
            if (type == 'uploaded') {
                status_btn.className = 'green';
                status_btn.innerHTML = '上传成功';
            } else {
                status_btn.className = 'layui-btn layui-btn-xs layui-btn-normal btn-status';
                status_btn.innerHTML = '待上传';
            }
            status_td.appendChild(status_btn);
            var opt_td = document.createElement('td');
            var del_btn = document.createElement('button');
            del_btn.className = 'layui-btn layui-btn-xs layui-btn-danger btn-delete';
            del_btn.innerHTML = '删除';
            opt_td.appendChild(del_btn);
            if (type == 'uploaded') {
                var down_btn = document.createElement('button');
                down_btn.className = 'layui-btn layui-btn-xs btn-download';
                down_btn.innerHTML = '下载';
                // down_btn.onclick = function(){
                //     tr.find('.btn-download').off().on('click',function () {
                //         var src = "/dfsmgr/file/filesDownload?fid=" + id;
                //         window.open(src);
                //         return false
                //     });
                // };
                opt_td.appendChild(down_btn);
            }
            tr.appendChild(fileName_td);
            // tr.appendChild(fileSize_td);
            tr.appendChild(status_td);
            tr.appendChild(opt_td);
            return tr;
        },
        //chart data 设置
        chartDataSet: function (res, params) {
            if (res && res[params.extendOption.respond]) {

                if (params.extendOption.respond === 'list') {
                    if (params.option.series.data) {
                        params.option.series.data = res[params.extendOption.respond];
                    } else if (params.option.series[0].data) {
                        params.option.series[0].data = res[params.extendOption.respond];
                    }
                    if (params.option.title && params.option.title.show) {

                        var totle = 0;
                        $.map(res[params.extendOption.respond], function (item) {
                            totle += item.value;
                        });
                        params.option.title.subtext = totle;
                    }


                } else {

                    //object 整合
                    if (params.option.xAxis && params.option.xAxis.data) {
                        params.option.xAxis.data = res[params.extendOption.respond].Axis;
                    }
                    if (params.option.legend && params.option.legend.data) {
                        params.option.legend.data = res[params.extendOption.respond].legend;
                    }
                    for (var i = 0; i < res[params.extendOption.respond].series.length; i++) {
                        if (params.option.series[i] && params.option.series[i].data) {
                            params.option.series[i].data = res[params.extendOption.respond].series[i].data;
                        }

                    }
                }
            }
            chartMap[params.module].setOption(params.option);
        },
    };

    var custom = {
        /**
         * 自定义布局
         * @param layoutWidth :横向布局
         * @param layoutHeight :纵向布局  auto表示自定布局，按照一屏展示 数据表示自定高度  false 表示不设置高度，根据内容来填充
         * */
        layout:function (obj) {

            var defaultParams={
                ele:'',//模板填充区域
                layoutWidth:[],
                layoutHeight:false,//默认配置为自动布局 一屏展示
                moduleName:[],//gridposcode
                done:function () {

                },
                moduleStyle:[ //模块样式设置
                    /*{
                        paddingTop:'7.5px',
                        paddingBottom:'7.5px',
                        paddingLeft:'7.5px',
                        paddingRight:'7.5px',
                        borderLeft:'',
                        borderRight:'',
                        borderTop:'',
                        borderBottom:'',
                        backgroundColor:'#fff',
                        backgroundImage:''
                    }*/
                ],
                /*titleSet:[
                    /!*{ //标题设置
                        theme:"0",//主题 0 表示无 1表示默认
                        gridTitleName:"",//标题名
                        auxiliaryTitle:"",//辅助标题
                        gridTitleHelpTip:"" //提示

                    }*!/
                ],*/
                curPosCode:'',//当前嵌入位置
                rowSpace:15//默认是15
            };

            var param=$.extend({},defaultParams,obj);
            var originHeight=param.layoutHeight;
            var template='';

            template += '<div class=" layui-col-space' + param.rowSpace + '">';

            //获取当前内容区域的高度，并计算出一共有多少row ，最后重新定义 layoutHeight


            if(param.layoutHeight==='auto' || !param.layoutHeight){

                var mainHeight=0;
                if(param.layoutHeight==='auto'){
                    mainHeight=$(document).height()-60;
                }

                var layout=JSON.parse(JSON.stringify(param.layoutWidth));//[[3,{9:[12,12]}]]

                //计算有多少个row

                var rowLength=layout.length;


                var height=Math.floor(mainHeight/rowLength);

                for(var i=0;i<layout.length;i++){

                    var item=layout[i];

                    if(typeof(item)==="object" && item instanceof Array){ //[]

                        for(var j=0;j<item.length;j++){

                            var _this=item[j];
                            if (typeof(_this)==="object" && !(_this instanceof Array)){ // {}

                                //将属性值修改
                                JSON.parse(JSON.stringify(_this).replace(Object.keys(_this)[0],height));


                                var objL=0;

                                for(var k=0;k<_this[Object.keys(_this)[0]].length;k++){
                                    //如果是12 就平分，其他的统一设定为height值

                                    if(_this[Object.keys(_this)[0]][k]===12){

                                        objL++;
                                    }


                                }
                                //判断 {} 中12 的个数 ，默认row数为0 导入默认height值， 存在12列，则进行相除
                                var lHeight=objL? Math.floor(height/objL):height;


                                for(var k=0;k<_this[Object.keys(_this)[0]].length;k++){

                                    layout[i][j][Object.keys(_this)[0]][k]=lHeight;

                                }

                            }else{ //number
                                layout[i][j]=height;
                            }
                        }

                    }
                }
                param.layoutHeight=layout;
            }

            for(var i=0;i<param.layoutWidth.length;i++){

                var singleRow=param.layoutWidth[i];
                var singleHeight=param.layoutHeight[i];
                var singleModule=param.moduleName[i];
                var singleStyle=param.moduleStyle[i];


                if(typeof(singleRow)==="object" && singleRow instanceof Array){


                    for(var l=0;l<singleRow.length;l++){

                        var singleItem=singleRow[l];
                        var singleItemHeight=singleHeight[l];
                        var singleItemModule=singleModule[l];
                        var singleItemStyle=singleStyle?singleStyle[l]:null;

                        if (typeof(singleItem)==="object" && !(singleItem instanceof Array)){
                            //先画出对应md值
                            var currentLine=Object.keys(singleItem)[0]; //{} 中的属性名
                            var currentItemHeight=Object.keys(singleItemHeight)[0]+'px';//得到child中的height

                            var moduleName=Object.keys(singleItemModule)[0];


                            var style='';

                            if(singleStyle){

                                style='padding-top:'+singleItemStyle['paddingTop']+'; ';
                                style+='padding-bottom:'+singleItemStyle['paddingBottom']+'; ';
                                style+='padding-left:'+singleItemStyle['paddingLeft']+';';
                                style+='padding-right:'+singleItemStyle['paddingRight']+';';

                                style='border-top:'+singleItemStyle['borderTop']+'; ';
                                style+='border-bottom:'+singleItemStyle['borderBottom']+'; ';
                                style+='border-left:'+singleItemStyle['borderLeft']+';';
                                style+='border-right:'+singleItemStyle['borderRight']+';';

                                style+='background-color:'+singleItemStyle['backgroundColor']+';';
                                style+='background-image:'+singleItemStyle['backgroundImage']+';';

                            }else{
                                style = 'padding-top:5px' + '; ';
                                style += 'padding-bottom:5px' + '; ';
                                style += 'padding-left:5px' + '; ';
                                style += 'padding-right:5px' + '; ';
                                style += 'background-color: ' + ';';
                            }

                            template +='<div style="'+style+'"   moduleName="module_'+moduleName+'" id="module_'+moduleName+'"  style="height: '+currentItemHeight+';" class=" layui-col-xs'+currentLine.replace('col','')+' layui-col-sm'+currentLine+' layui-col-md'+currentLine+'">';

                            //遍历[[]] row中的【】值 no
                            for(var j=0;j<singleItem[currentLine].length;j++){

                                var single=singleItem[currentLine][j];
                                var module=singleItemModule[Object.keys(singleItemModule)[0]][j];
                                var height=singleItemHeight[Object.keys(singleItemHeight)[0]][j]-15+'px';//获取{}里【】的高度值

                                if(singleItem[currentLine][j]===12){
                                    if(j===0){
                                        template+= '<div moduleName="module_'+module+'" id="module_'+module+'" style="height: '+height+';" class="margin-b10 layui-col-xs'+single+' layui-col-sm'+single+' layui-col-md'+single+'"><div class="content-box"></div></div>';
                                    }else{
                                        //判断上一级是不是12
                                        if(singleItem[currentLine][j-1]===12 && (j-1)===0){
                                            template+= '<div moduleName="module_'+module+'" id="module_'+module+'" style="height: '+height+';" class="margin-b10 layui-col-xs'+single+' layui-col-sm'+single+' layui-col-md'+single+'"><div class="content-box"></div></div>';
                                        }else{
                                            template+= '<div moduleName="module_'+module+'" id="module_'+module+'" style="height: '+height+';" class="margin-t10 layui-col-xs'+single+' layui-col-sm'+single+' layui-col-md'+single+'"><div class="content-box"></div></div>';

                                        }
                                    }
                                }else{
                                    template+= '<div moduleName="module_'+module+'" id="module_'+module+'" style="height: '+height+';" class="layui-col-xs'+single+' layui-col-sm'+single+' layui-col-md'+single+'"><div class="content-box"></div></div>';

                                }
                            }

                            template +='</div>';
                        }

                        else{
                            var styleSet='';

                            if(singleItemStyle){


                                styleSet='padding-top:'+singleStyle[l]['paddingTop']+'; ';
                                styleSet+='padding-bottom:'+singleStyle[l]['paddingBottom']+'; ';
                                styleSet+='padding-left:'+singleStyle[l]['paddingLeft']+'; ';
                                styleSet+='padding-right:'+singleStyle[l]['paddingRight']+'; ';
                                styleSet+='border-top:'+singleStyle[l]['borderTop']+'; ';
                                styleSet+='border-bottom:'+singleStyle[l]['borderBottom']+'; ';
                                styleSet+='border-left:'+singleStyle[l]['borderLeft']+';';
                                styleSet+='border-right:'+singleStyle[l]['borderRight']+';';
                                // styleSet+='background-color:'+param.moduleStyle[l][0]['backgroundColor']+';';
                                // styleSet+='background-image:'+param.moduleStyle[l][0]['backgroundImage']+';';

                                template+= '<div style="'+styleSet+'"  moduleName="module_'+singleItemModule+'" id="module_'+singleItemModule+'" style="height:'+singleHeight[l]+'px;" class="layui-col-xs'+singleItem+' layui-col-sm'+singleItem+' layui-col-md'+singleItem+'">' +
                                    '<div class="content-box" style="background-color: '+singleStyle[l]['backgroundColor']+';background-image:'+singleStyle[l]['backgroundImage']+'"></div>' +
                                    // '<div class="content-box" style="background-image:'+singleStyle[l]['backgroundImage']+'"></div>' +
                                    '</div>';
                            }else{
                                styleSet = 'padding-top:5px' + '; ';
                                styleSet += 'padding-bottom:5px' + '; ';
                                styleSet += 'padding-left:5px' + '; ';
                                styleSet += 'padding-right:5px' + '; ';
                                styleSet += 'background-color:' + ';';
                                styleSet += 'background-image:  ;';

                                template+= '<div style="'+styleSet+'"  moduleName="module_'+singleItemModule+'" id="module_'+singleItemModule+'" style="height:'+singleHeight[l]+'px;" class="layui-col-xs'+singleItem+' layui-col-sm'+singleItem+' layui-col-md'+singleItem+'">' +
                                    '<div class="content-box"></div>' +
                                    '</div>';
                            }

                        }
                    }

                    // template +='</div>';

                }

                /*if(typeof(singleRow)==="object" && singleRow instanceof Array){

                    template +='<div class="layui-row layui-col-space15">';

                    for(var l=0;l<singleRow.length;l++){

                        var singleItem=singleRow[l];
                        var singleItemHeight=dataSet.layoutHeight[i][l]+'px';//得到child中的height

                        template+= '<div style="height:'+singleItemHeight+' " class=" layui-col-xs'+singleItem+' layui-col-sm'+singleItem+' layui-col-md'+singleItem+'"><div class="content-box"></div></div>';

                    }

                    template +='</div>';

                } else if (typeof(singleRow)==="object" && !(singleRow instanceof Array)){
                    //先画出对应md值
                    var currentLine=Object.keys(singleRow)[0];

                    template +='<div class=" layui-col-xs'+currentLine+' layui-col-sm'+currentLine+' layui-col-md'+currentLine+'">';

                    //遍历[[]] row中的【】值
                    for(var l=0;l<singleRow[currentLine].length;l++){

                        var singleItem=singleRow[currentLine][l];
                        var height=dataSet.layoutHeight[i][Object.keys(dataSet.layoutHeight[i])[0]][l]-15+'px';//获取{}里【】的高度值

                        if(l==0){
                            template+= '<div style="height: '+height+';" class=" layui-col-xs'+singleItem+' layui-col-sm'+singleItem+' layui-col-md'+singleItem+'"><div class="content-box"></div></div>';
                        }else{
                            if(singleItem===12){
                                //单为12列的时候 且不是第一个排版， 则设置margin-t15值
                                template+= '<div style="height: '+height+';" class="margin-t15 layui-col-xs'+singleItem+' layui-col-sm'+singleItem+' layui-col-md'+singleItem+'"><div class="content-box"></div></div>';
                            }else{
                                template+= '<div style="height: '+height+';" class=" layui-col-xs'+singleItem+' layui-col-sm'+singleItem+' layui-col-md'+singleItem+'"><div class="content-box"></div></div>';

                            }
                        }

                    }

                    template +='</div>';
                }else{

                    template+= '<div style="height:'+singleHeight+' " class=" layui-col-xs'+singleRow+' layui-col-sm'+singleRow+' layui-col-md'+singleRow+'"><div class="content-box"></div></div>';

                }*/

            }


            param.ele.append(template);

            if(!originHeight){
                //加强 height 为false 的情况下 清空height 样式


            }
            if(param.done){
                //测试用
                param.done(template);
            }

        },
        iconType:function(iconType){
            var iconHtml;
            switch (iconType) {

                case 'add':
                    iconHtml='<i class="layui-icon">&#xe608;</i>';
                    break;
                case 'delete':
                    iconHtml='<i class="layui-icon">&#xe640;</i>';
                    break;
                case 'refresh':
                    iconHtml='<i class="layui-icon">&#xe666;</i>';
                    break;
                case 'enable':
                    iconHtml='<i class="layui-icon">&#x1005;</i>';
                    break;
                case 'disable':
                    iconHtml='<i class="layui-icon">&#x1007;</i>';
                    break;
                case 'import'://导入
                    iconHtml='<i class="layui-icon">&#xe65b;</i>';
                    break;
                case 'upload'://下载
                    iconHtml='<i class="layui-icon">&#xe601;</i>';
                    break;
                case 'cancel'://作废
                    iconHtml='<i class="layui-icon">&#xe756;</i>';
                    break;
                case 'commit'://提交
                    iconHtml='<i class="layui-icon">&#xe705;</i>';
                    break;
                case 'search'://搜索
                    iconHtml='<i style="margin-right: 3px" class="fa fa-search"></i>';
                    break;
                case 'reset'://重置
                    iconHtml='<i style="margin-right: 3px" class="fa fa-eraser"></i>';
                    break;
            }
            return iconHtml
        },

        /**
         * 表格组件
         * */
        table:function(obj){
            var tableParam = $.extend({}, {
                module:'',
                getDataUrl:'',
                area:null,
                empty:false,
                tableTip:false,
                toolBarTip: false,
                toolbarBtn:[ //toolbar 按钮区域
                    /*   {
                           name:'add_1',//按钮标识符 可看做是id 和 layui-filter
                           text:'新增一级节点', //按钮文字
                           icon:true, //按钮是否包含icon
                           event:'add', //事件类型 add 表示新增，默认是出现弹框的形式， add的情况下 需要设置form 值，和button 值 。form表示表单区域  button 表示弹框中form 的粗发事件按钮区域
                           iconType:'add',//icon:true 的情况下，设置icon 的类型
                           form:[
                               {
                                   type:'input',
                                   required:'true',
                                   label:'名称',
                                   name:'smName',
                                   col:12 //12列布局中占多少

                               }
                           ],
                           permissionBtn:'',//permission-btn 用
                           url:''
                       },
                       {
                           name:'add_2',
                           iconType:'add',
                           text:'新增二级节点',
                           icon:true,
                           event:'add',
                       },
                       {
                           name:'delete_1',//按钮标识符 可看做是id 和 layui-filter
                           text:'删除',
                           event:'delete',
                           conformTip:'确定删除选定项?',//设置删除时提示的信息  不做配置默认信息是默认删除选中项
                           tipWidth:'150',//设定提示弹框宽度  不做配置默认宽度为150px
                           successTip:'删除成功', //删除成功的提示信息 不做配置默认为 '删除成功'
                           failTip:'删除失败', // 失败的提示信息 不做配置默认为 '删除失败'
                           url:'sysmgr/menu/deleteSysMenuByIds', //这里的通用使用 delete
                           deleteParam:'smIds',//设置删除的索引值  url 上的参数变量值
                           tableRowIndex:'smId',//可能和 deleteParam 值一致 获取删除对象的的索引值
                           successEvent:[  //删除成功后需要绑定联动刷新的区域 以及区域对应的组件   这块后期需要继续拓展
                               {
                                   module:'a',
                                   plugin:'tree'
                               },
                               {
                                   module:'b2',
                                   plugin:'table'
                               }
                           ]
                       }*/
                ],
                rowBtn:[ //table row中的button

                ],
                page:true,
                defaultToolbar: ['filter'],
                cols: [
                    /*[
                    {type:'checkbox'},
                    {field: 'ggSort', title: '排序',width:80, sort: true},
                    {field: 'smName', title: '按钮名称',sort:true},
                    {field: 'smIcon', title: '按钮编号', width:120,sort:true},
                    {field: 'smType', title: '类型', width:120,sort:true},
                    // {field: '', title: '操作', width: 150, toolbar:' <a class="layui-btn layui-btn-xs" lay-event="edit">编辑</a>',fixed: 'right'}
                ]*/
                ],
                // {"theme":"1","name":"表格"}
                titleSet: { //标题设置
                    theme: "0",//主题 0 表示无 1表示默认
                    name: "",//标题名
                    subName: "",//辅助标题
                    helpTip: "" //提示
                },
                annotation: null,//表格说明栏
                done:function (data) {},
                // height:null,
                rowBtnWidth:false,
                where:null,
                data:null
            }, obj);

            //根据模块查找所有配置注册
            moduleParams[tableParam.module] = tableParam;


            var tableParent= $('#module_'+tableParam.module);
            var tableTemplate = '<div class="layui-card">';

            tableTemplate += toolHandle.titleSet(tableParam.titleSet, tableTemplate);

            if (tableParam.annotation && tableParam.annotation != "''" && tableParam.annotation != "\"\"") {
                tableTemplate += tableParam.annotation;
            }

            tableTemplate += '<div class="layui-card-body">';
            // tableTip 区域
            if(tableParam.tableTip){
                tableTemplate+='<div class="tableTip">'+tableParam.tableTip+'</div>';
            }

            //table 区域
            tableTemplate+='<table style="z-index: 0" id="table_'+tableParam.module+'" lay-filter="table_'+tableParam.module+'"></table>';

            //toolbar 区域
            tableTemplate+='<script type="text/html" id="table_toolbar_'+tableParam.module+'"><div class="layui-btn-container">';

            $.map(tableParam.toolbarBtn,function (item,index) {
                if(item){
                    var permissionBtn='';
                    if(!! item.permissionBtn){
                        permissionBtn='permission-btn="'+item.permissionBtn+'"';
                    }else{
                        permissionBtn='';
                    }

                    var iconHtml='' ,colorClass='layui-btn';

                    if(item['iconType']){
                        iconHtml=custom.iconType(item['iconType']);
                    }

                    if(item['btnClass']){
                        switch (item['btnClass']) {

                            case 'primary':
                                colorClass='layui-btn-primary';
                                break;

                            case 'warn':
                                colorClass='layui-btn-warm';
                                break;

                            case 'danger':
                                colorClass='layui-btn-danger';
                                break;

                            default :
                                colorClass='layui-btn';

                        }
                    }

                    tableTemplate+='<button class="layui-btn layui-btn-sm '+colorClass+' " id="'+item.name+'" lay-event="'+item.name+'"  '+permissionBtn+'>'+iconHtml+item.text+'</button>';
                }

            });

            if (tableParam.toolBarTip) {
                if (typeof tableParam.toolBarTip === 'string') {
                    tableTemplate += '<div style="font-size: 14px">' + tableParam.toolBarTip + '</div>';

                } else if (typeof tableParam.toolBarTip === 'object') {
                    var tipParam = $.extend({
                        url: '',
                        method: 'get',
                        where: null,
                        html: '',
                        response: "object"
                    }, tableParam.toolBarTip);
                    common.fetch(tipParam.url, tipParam.method, tipParam.where, function (res) {
                        var text = tipParam.html;
                        var regex = /\#(.+?)\#/g;
                        var result;
                        while ((result = regex.exec(text)) != null) {
                            tipParam.html = tipParam.html.replace(result[0], res[tipParam.response][result[1]] != null ? '<span toolBarTip="' + result[1] + '">' + res[tipParam.response][result[1]] + '</span>' : '-');
                        }
                        tableTemplate += tipParam.html;

                    }, function () {

                    }, false);
                }
            }
            tableTemplate += '</script>';


            //排空处理
            tableParam.cols[0]=common.trimData(tableParam.cols[0],'array');

            //列名字典类型处理
            $.map(tableParam.cols,function(cols,colsIndex){
                if(!!cols){
                    $.map(cols,function(col,colIndex){
                        if(col){

                            //因为后台会将number型的数转成string，协调后，后台不好处理， 前端这里来处理
                            if(!! col.width && !! typeof (col.width)==='string' && col.width.indexOf('%')===-1){
                                col.width=parseInt(col.width);
                            }

                            //获取对象属性值配置 判断是否含有 .
                            if (col.field && col.field.indexOf('.') > -1) {
                                var fields = col.field.split('.');

                                col.templet = function (rowData) {
                                    var callBackData = rowData;
                                    $.map(fields, function (field) {
                                        callBackData = callBackData[field]
                                    });
                                    return callBackData;
                                }
                            }

                            //数据返回list 配置方式
                            if (col.field && col.listTmp) {

                                col.templet = function (rowData) {

                                    if (rowData[col.field]) {
                                        var html = '<ul class="">';
                                        for (var i = 0; i < rowData[col.field].length; i++) {
                                            var statusClass = '';
                                            if (rowData[col.field][i][col.listTmp['status']] === 1) {
                                                statusClass = 'status1'
                                            } else if (rowData[col.field][i][col.listTmp['status']] === 2) {
                                                statusClass = 'status2'
                                            }
                                            html += '<li class="shqkTab ' + statusClass + ' ">' + rowData[col.field][i][col.listTmp['text']] + '</li>'
                                        }
                                        html += '</ul>';
                                        return html;
                                    }
                                }
                            }

                            //手工配置字典方式
                            if(col.dataTemplet && col.dataTemplet.length > 0){
                                col.templet = function(rowData){
                                    return $.map(col.dataTemplet,function(dataTemplet,dataTempletIndex){
                                        if (dataTemplet.upValue) {
                                            if (rowData[col.field] > dataTemplet.val) {
                                                return custom.dataTemplet_spanStyle(dataTemplet);
                                            }
                                        } else {
                                            if (rowData[col.field] == dataTemplet.val) {
                                                // debugger
                                                return custom.dataTemplet_spanStyle(dataTemplet);
                                            }
                                        }
                                    });
                                }
                            }
                            //请求地址获取配置字典方式
                            else if(col.dicDataTemplet){
                                var dicDataTemplet = col.dicDataTemplet;
                                if(dicDataTemplet.url && dicDataTemplet.optionValue && dicDataTemplet.optionText){
                                    var method = "get"; //请求方式
                                    var whereCase;      //附加参数
                                    var node = 'list'; //解析节点
                                    var optionValue = dicDataTemplet.optionValue; //对应选中值字段
                                    var optionText = dicDataTemplet.optionText;   //对应显示值字段
                                    var dicList;    //获取到的字典对象集合
                                    if(dicDataTemplet.method){
                                        method = dicDataTemplet.method;
                                    }
                                    if(dicDataTemplet.whereCase){
                                        whereCase = dicDataTemplet.whereCase;
                                    }
                                    if(dicDataTemplet.node){
                                        node = dicDataTemplet.node;
                                    }
                                    common.fetch(dicDataTemplet.url,method,whereCase,function (res) {
                                        if(res && res[node]){
                                            dicList = res;
                                        }
                                    },function(ero){},"false");
                                    if(dicList){
                                        col.templet = function(rowData){
                                            for (var i=0;i<dicList[node].length;i++){
                                                if(rowData[col.field] == dicList[node][i][optionValue]){
                                                    return '<span>' + dicList[node][i][optionText] + '</span>';
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            //根据值展示相关展示项
                            else if (col.moduleTemplet) {
                                col.templet = function (rowData) {
                                    return toolHandle.tableModuleTemplet(col.moduleTemplet, rowData[col.field]);
                                }
                            }
                            //时间戳类型处理
                            if(col.isTimestamp && col.isTimestamp == true){
                                col.templet = function(rowData){
                                    if(col.timestampFormat){
                                        return util.toDateString(rowData[col.field],col.timestampFormat);
                                    }else{
                                        return util.toDateString(rowData[col.field]);
                                    }
                                }
                            }
                            //货币资金模式
                            if (col.outputdollars && col.outputdollars == true) {
                                col.templet = function (rowData) {
                                    return common.outputdollars(rowData[col.field]);
                                }
                            }
                            if (col.outputmoney && col.outputmoney == true) {
                                col.templet = function (rowData) {
                                    return common.outputmoney(rowData[col.field]);
                                }
                            }

                        }
                    });
                }
            });
            //row btn 区域
            if(tableParam.rowBtn && tableParam.rowBtn.length>0){

                //排空处理
                tableParam.rowBtn=common.trimData(tableParam.rowBtn,'array');
                if(tableParam.rowBtn.length>0){
                    tableTemplate+='<script type="text/html" id="table_rowBtn_'+tableParam.module+'">';
                    $.map(tableParam.rowBtn,function (item,index) {

                        if(item){
                            var permissionBtn='';
                            if(!! item.permissionBtn){
                                permissionBtn='permission-btn="'+item.permissionBtn+'"';
                            }else{
                                permissionBtn='';
                            }

                            var iconHtml='' ,colorClass='layui-btn';
                            if(item['iconType']){
                                switch (item['iconType']) {
                                    case 'add':
                                        iconHtml='<i class="layui-icon">&#xe608;</i>';
                                        break;
                                    case 'delete':
                                        iconHtml='<i class="layui-icon">&#xe640;</i>';
                                        break;
                                    case 'refresh':
                                        iconHtml='<i class="layui-icon">&#xe666;</i>';
                                        break;
                                    case 'enable':
                                        iconHtml='<i class="layui-icon">&#x1005;</i>';
                                        break;
                                    case 'disable':
                                        iconHtml='<i class="layui-icon">&#x1007;</i>';
                                        break;
                                    case 'link':
                                        iconHtml='<i class="layui-icon layui-icon-link"></i>';
                                        break;
                                    case 'edit':
                                        iconHtml='<i class="layui-icon layui-icon-edit"></i>';
                                        break;
                                }
                            }

                            if(item['btnClass']){
                                switch (item['btnClass']) {
                                    case 'primary':
                                        colorClass='layui-btn-primary';
                                        break;
                                    case 'warn':
                                        colorClass='layui-btn-warm';
                                        break;
                                    case 'danger':
                                        colorClass='layui-btn-danger';
                                        break;
                                    case 'delete':
                                        colorClass='layui-btn-danger';
                                        break;
                                    case 'edit':
                                        colorClass='layui-btn-xs';
                                    default :
                                        colorClass='layui-btn';
                                }
                            }
                            if (item['hideSet'] && item['hideSet']['field'] && item['hideSet']['value'] != undefined) {

                                tableTemplate += '<button class="layui-btn layui-btn-xs ' + colorClass + ' " id="' + item.name + '" lay-event="' + item.name + '"  ' + permissionBtn + ' style="display: {{d["' + item.hideSet.field + '"]==="' + item.hideSet.value + '" ? "none":"inline-block"}} ">' + iconHtml + item.text + '</button>';


                                // tableTemplate+=' <button class="layui-btn layui-btn-xs " lay-event="depublish" style="display: {{d.smCode==="498" ? "none":"inline-block"}} ">'+item.text+'</button>'
                            } else {
                                tableTemplate += '<button class="layui-btn layui-btn-xs ' + colorClass + ' " id="' + item.name + '" lay-event="' + item.name + '"  ' + permissionBtn + '>' + iconHtml + item.text + '</button>';
                            }


                            // tableTemplate+='<button '+permissionBtn+' class="layui-btn layui-btn-sm" name="'+item.name+'" lay-event="'+item.name+'">'+item.text+'</button>';
                        }

                    });
                    tableTemplate+='</script>';
                    tableParam.cols[0].push({
                        field: 'oper',
                        title: '操作',
                        toolbar: '#table_rowBtn_' + tableParam.module,
                        fixed: 'right',
                        rowspan: tableParam.cols.length
                    });
                    if(tableParam['rowBtnWidth']){
                        tableParam.cols[0][tableParam.cols[0].length-1].width=parseInt(tableParam['rowBtnWidth']);
                    }
                }

            }


            tableTemplate+='</div></script>';

            tableTemplate += '</div></div>';

            if(tableParam.area){
                if(tableParam.empty){
                    tableParent.find('.content-box').find(tableParam.area).empty().append(tableTemplate);
                }else{
                    tableParent.find('.content-box').find(tableParam.area).empty().append(tableTemplate);
                }
            }else{
                if(tableParam.empty){
                    tableParent.find('.content-box').empty().append(tableTemplate);
                }else{
                    tableParent.find('.content-box').empty().append(tableTemplate);
                }
            }
            toolHandle.helpTip();

            //table load

            var tableWhere={};

            if (tableParam.where) {
                if(tableParam.where.paras){
                    for (var whereItemParas in tableParam.where.paras){
                        if(tableParam.where.paras[whereItemParas].indexOf('name_')>-1){
                            var nameValue=tableParam.where.paras[whereItemParas].substring(5);
                            //获取对应的name value值
                            var val;

                            if($('[name='+nameValue+']').val()){
                                val=$('[name='+nameValue+']').val();
                            }else if($("#rowDataLine", parent.document).val()){
                                var lineData=JSON.parse($("#rowDataLine", parent.document).val());
                                val=lineData[nameValue];
                            }else if($($(top.window.document).find('#menuContent').find('.iframe')[0].contentWindow.document).find("#rowDataLine").val()){
                                var lindeDate = $($(top.window.document).find('#menuContent').find('.iframe')[0].contentWindow.document).find("#rowDataLine").val();
                                val=lineData[nameValue];
                            }

                            tableParam.where.paras[whereItemParas]=val;
                        }
                    }
                }else{
                    for (var whereItem2 in tableParam.where){
                        if (typeof tableParam.where[whereItem2] !== "number" && tableParam.where[whereItem2].indexOf('name_') > -1) {
                            var nameValue2=tableParam.where[whereItem2].substring(5);
                            //获取对应的name value值
                            var val2;
                            if($('[name='+nameValue2+']').val()){
                                val2=$('[name='+nameValue2+']').val();
                            }else if($("#rowDataLine", parent.document).val()){
                                var lineData=JSON.parse($("#rowDataLine", parent.document).val());
                                val2=lineData[nameValue2];
                            }else if($($(top.window.document).find('#menuContent').find('.iframe')[0].contentWindow.document).find("#rowDataLine",parent.document).val()){
                                var lindeDate = JSON.parse($($(top.window.document).find('#menuContent').find('.iframe')[0].contentWindow.document).find("#rowDataLine",parent.document).val());
                                val2=lindeDate[nameValue2];
                            }
                            tableParam.where[whereItem2]=val2;
                        }
                    }
                }

                tableWhere=tableParam.where;
            }

            table.render(common.tableInitParams($.extend({}, tableParam, {
                elem: '#table_'+tableParam.module,
                url: tableParam.getDataUrl==null||tableParam.getDataUrl=='\'\''?null:global.baseUrl+tableParam.getDataUrl,
                method:'post',
                toolbar:'#table_toolbar_'+tableParam.module,
                cols: tableParam.cols,
                page:tableParam.page,
                defaultToolbar: tableParam.defaultToolbar,
                height:tableParam.height,
                done:function () {
                    common.buttonLimit();
                },
                where:tableWhere,
                data:tableParam.data
            })));

            //toolbar 工具栏按钮区域事件绑定
            if(tableParam.toolbarBtn && tableParam.toolbarBtn.length>0){
                var toolBtn={},rowBtn={};
                //将toolBtn 方法对象话
                $.map(tableParam.toolbarBtn,function (item,index) {

                    if(item){
                        toolBtn[item['name']]=item;
                    }

                });
                //将rowBtn 方法对象话
                $.map(tableParam.rowBtn,function (item,index) {

                    if(item){
                        rowBtn[item['name']]=item;
                    }
                });

                table.on('toolbar(table_'+tableParam.module+')',function (obj) {

                    var checkStatus = table.checkStatus(obj.config.id);
                    var item= toolBtn[obj.event];  //这个btn 的所有事件集

                    if(!! toolBtn[obj.event]){
                        if(item['type']==='delete'){//默认绑定删除事件

                            if(checkStatus.data.length>0 && item.deleteSet){
                                layer.confirm((item.deleteSet.conformTip?item.deleteSet.conformTip:'确定删除选中列?'), {icon: 3, title:'提示',offset: (item.deleteSet.tipWidth?(item.deleteSet.tipWidth+'px'):'150px')}, function(index){
                                    var Arr=[];

                                    for(var i=0;i<checkStatus.data.length;i++){
                                        //Arr.push(checkStatus.data[i].tableRowIndex?checkStatus.data[i].tableRowIndex:checkStatus.data[i].deleteParam);
                                        Arr.push(checkStatus.data[i][item.deleteSet.tableRowIndex]?checkStatus.data[i][item.deleteSet.tableRowIndex]:checkStatus.data[i][item.deleteSet.deleteParam]);
                                    }

                                    var layerLoader =common.layerLoader();

                                    var delAction;
                                    if(item.deleteSet.deleteParam == null || item.deleteSet.deleteParam == ''){
                                        //url/{ids} 模式
                                        delAction = item.deleteSet.url+Arr.join(',');
                                    }else{
                                        //url?param={ids} 模式
                                        delAction = item.deleteSet.url+'?'+item.deleteSet.deleteParam+'='+Arr.join(',');
                                    }

                                    common.fetchDelete(delAction, function (res) {
                                        if (!!res.success) {
                                            layer.close(layerLoader);

                                            //成功之后的回调事件
                                            if (item.deleteSet.successEvent && item.deleteSet.successEvent.length > 0) {

                                                $.map(item.deleteSet.successEvent, function (val, index) {
                                                    if (val) {
                                                        if (val.plugin === 'tree') {
                                                            //重载tree
                                                            treeMap[val.module].reload();
                                                        } else if (val.plugin === 'table') {
                                                            //重载table
                                                            table.reload('table_' + val.module, {
                                                                page: {
                                                                    curr: 1
                                                                },
                                                                done: function () {
                                                                    common.buttonLimit();
                                                                }
                                                            });
                                                        }
                                                    }

                                                })

                                            }

                                            layer.msg(item.deleteSet.successTip ? item.deleteSet.successTip : '删除成功');
                                        } else {
                                            layer.alert(res.resultMessage || res.message);
                                            layer.close(layerLoader);
                                        }


                                    }, function (err) {
                                        if (!err.success) {
                                            layer.alert(err.resultMessage || err.message);
                                        }
                                        layer.close(layerLoader);
                                    });

                                    layer.close(index);
                                });
                            }else{
                                layer.msg('请选择删除列');
                            }

                        } else if (item['type'] === 'layer') {  //layer 表示弹框的形式
                            if(!! item.layerSet){
                                custom.layer(item.layerSet,tableParam);
                            }else{
                                layer.msg('请配置layerSet属性')
                            }

                        }else if(item['type']==='refresh'){  //刷新事件
                            table.reload('table_'+tableParam.module,{
                                page:{
                                    curr:1
                                }
                            });
                            if(item['refreshSet']){
                                $.map(item['refreshSet'],function(setItem){
                                    if(setItem.id && setItem.type){
                                        switch(setItem.type){
                                            case 'tree':
                                                treeMap[setItem.id].reload();
                                                break;
                                        }
                                    }
                                })
                            }
                        }else if(item['type']==='action'){//绑定自定义事件
                            if(checkStatus.data.length>0 && item.actionSet){
                                layer.confirm((item.actionSet.conformTip?item.actionSet.conformTip:'确定操作选中列?'), {icon: 3, title:'提示',offset: (item.actionSet.tipWidth?(item.actionSet.tipWidth+'px'):'150px')}, function(index){
                                    var Arr=[];
                                    for(var i=0;i<checkStatus.data.length;i++){
                                        Arr.push(checkStatus.data[i][item.actionSet.tableRowIndex]?checkStatus.data[i][item.actionSet.tableRowIndex]:checkStatus.data[i][item.actionSet.actionParam]);
                                    }
                                    var layerLoader =common.layerLoader();
                                    var action;
                                    var method = 'put';
                                    var params; //参数

                                    if(typeof item.actionSet.actionParam == "object"){
                                        var paramNameStr = "";
                                        var cflag = "";
                                        $.map(item.actionSet.actionParam, function (paramItem, index) {
                                            if (typeof paramItem == 'string') {
                                                if(paramItem == '#customData'){
                                                    var customData = JSON.parse($($(top.window.document).find('#menuContent').find('.iframe')[0].contentWindow.document).find("#customDataLine").val());
                                                    paramNameStr += cflag + "\"" + index + "\":\"" + customData[index] + "\"";
                                                }else if(paramItem == '#tableRowIndex'){
                                                    paramNameStr += cflag + "\"" + index + "\":\"" + Arr.join(',') + "\"";
                                                }
                                            } else if (typeof paramItem == 'object') {

                                            }
                                            cflag = ",";
                                        });
                                        params = JSON.parse("{" + paramNameStr +  "}");
                                        action = item.actionSet.url
                                    }else if(item.actionSet.actionParam == null || item.actionSet.actionParam == ''){
                                        //url/{ids} 模式
                                        action = item.actionSet.url+Arr.join(',');
                                    }else if(item.actionSet.paramType == 'map'){
                                        //url {ids:id} 模式
                                        var paramNameStr = "{\"" + item.actionSet.actionParam + "\":\"" + Arr.join(',') + "\"}";
                                        params = JSON.parse(paramNameStr);
                                        action = item.actionSet.url;
                                    }else{
                                        //url?param={ids} 模式
                                        action = item.actionSet.url+'?'+item.actionSet.actionParam+'='+Arr.join(',');
                                    }

                                    common.fetch(action,method,params,function (res) {
                                        //成功之后的回调事件
                                        layer.close(layerLoader);
                                        var isClose = false;
                                        if(item.actionSet.successEvent && item.actionSet.successEvent.length>0){
                                            $.map(item.actionSet.successEvent,function (val, index) {
                                                if(val){
                                                    if(val.plugin==='tree'){
                                                        //重载tree
                                                        treeMap[val.module].reload();
                                                    }else if(val.plugin==='table'){
                                                        //重载table
                                                        table.reload('table_'+val.module,{
                                                            page:{
                                                                curr:1
                                                            }
                                                        });
                                                    }
                                                    if(val.isClose && val.isClose == true){
                                                        isClose = true;
                                                    }
                                                }
                                            })
                                        }
                                        top.layer.msg(item.actionSet.successTip ? item.actionSet.successTip : '操作成功');

                                        if(isClose == true){
                                            parent.layer.closeAll();
                                        }

                                    },function(err){
                                        //失败之后的回调事件
                                        if(err.resultMessage){
                                            layer.alert(err.resultMessage);
                                        }else{
                                            layer.msg(item.actionSet.failTip ? item.actionSet.failTip : '操作失败');
                                        }
                                        layer.close(layerLoader);
                                    });
                                    layer.close(index);
                                });
                            }else{
                                layer.msg('请选择操作列');
                            }
                        }
                    }
                });
            }

            //tool 行按钮区域事件绑定
            table.on('tool(table_'+tableParam.module+')',function (obj) {
                var rowData=obj.data;
                if (!!rowBtn && rowBtn[obj.event]) {
                    var item = rowBtn[obj.event];
                    if(item['type']==='delete'){//默认绑定删除事件

                        layer.confirm((item.deleteSet.conformTip ? item.deleteSet.conformTip : '确定删除选中列?'), {
                            icon: 3,
                            title: '提示',
                            offset: (item.tipWidth ? (item.tipWidth + 'px') : '150px')
                        }, function (index) {

                            var layerLoader =common.layerLoader();

                            var delAction;
                            if(item.deleteSet.deleteParam == null || item.deleteSet.deleteParam == ''){
                                //url/{id} 模式
                                delAction = item.deleteSet.url+obj.data[item.deleteSet.tableRowIndex];
                            }else{
                                //url?param={id} 模式
                                delAction = item.deleteSet.url+'?'+item.deleteSet.deleteParam+'='+(obj.data[item.deleteSet.tableRowIndex]?obj.data[item.deleteSet.tableRowIndex]:obj.data[item.deleteSet.deleteParam]);
                            }

                            var method = item.deleteSet.method ? item.deleteSet.method : 'delete';
                            var whereParam = item.deleteSet.where ? item.deleteSet.where : null;


                            /*if(item.deleteSet.where){
                                debugger
                            }*/


                            // common.fetchDelete(delAction, function (res) {
                            common.fetch(delAction, method, whereParam, function (res) {
                                //common.fetchDelete(item.deleteSet.url+'?'+item.deleteSet.deleteParam+'='+(obj.data[item.deleteSet.tableRowIndex]?obj.data[item.deleteSet.tableRowIndex]:obj.data[item.deleteSet.deleteParam]),function () {


                                if (!!res.success) {


                                    layer.close(layerLoader);

                                    //成功之后的回调事件
                                    if (item.successEvent && item.successEvent.length > 0) {

                                        $.map(item.successEvent, function (val, index) {
                                            if (val) {
                                                if (val.plugin === 'tree') {
                                                    //重载tree
                                                    treeMap[val.module].reload();
                                                } else if (val.plugin === 'table') {
                                                    //重载table
                                                    table.reload('table_' + val.module, {
                                                        page: {
                                                            curr: 1
                                                        }
                                                    });
                                                }
                                            }
                                        })
                                    }
                                    if (item.deleteSet.successEvent && item.deleteSet.successEvent.length > 0) {

                                        $.map(item.deleteSet.successEvent, function (val, index) {
                                            if (val) {
                                                if (val.plugin === 'tree') {
                                                    //重载tree
                                                    treeMap[val.module].reload();
                                                } else if (val.plugin === 'table') {
                                                    //重载table

                                                    table.reload('table_' + val.module, {
                                                        page: {
                                                            curr: 1
                                                        }
                                                    });
                                                }
                                            }
                                        })
                                    }

                                    layer.msg(item.deleteSet.successTip ? item.deleteSet.successTip : '删除成功');
                                } else {
                                    layer.alert(err.resultMessage);
                                    layer.close(layerLoader);
                                }


                            }, function (err) {
                                layer.alert(err.resultMessage);
                                layer.close(layerLoader);
                            });

                            layer.close(index);
                        });

                    } else if (item['type'] === 'layer') {  //layer 表示弹框的形式

                        if(!! item.layerSet){
                            if(item.layerSet.rowData){
                                //公共区域设置rowDataLine值
                                dom.rowDataLine.val(JSON.stringify(rowData));
                            }
                            if(item.layerSet.customData){
                                //自定义数据域操作
                                if($($(top.window.document).find('#menuContent').find('.iframe')[0].contentWindow.document).find("#customDataLine")){
                                    $($(top.window.document).find('#menuContent').find('.iframe')[0].contentWindow.document).find("#customDataLine").val(JSON.stringify(rowData));
                                }else{
                                    dom.customDataLine.val(JSON.stringify(rowData));
                                }
                            }

                            custom.layer(item.layerSet,tableParam);
                        }else{
                            layer.msg('请配置layerSet属性');
                        }
                    }
                    else if(item['type']==='action'){//行按钮：自定义事件 （无弹窗）
                        var method = 'post';
                        var paramStr = '';
                        var params;
                        var url;
                        var layerLoader = common.layerLoader();

                        if(item['actionSet']['url']){
                            url = item['actionSet']['url'];
                        }
                        if(item['actionSet']['method']){
                            method = item['actionSet']['method'];
                        }
                        if(item['actionSet']['actionParam']){
                            paramStr = "{";
                            $.map(item['actionSet']['actionParam'],function(paramItem,index){
                                if(index == 0){
                                    paramStr += ("\"" + paramItem.name + "\":" + "\"" + rowData[paramItem.name] + "\"");
                                }else{
                                    paramStr += (",\"" + paramItem.name + "\":" + "\"" + rowData[paramItem.name] + "\"");
                                }
                            })
                            paramStr += "}";
                            params = JSON.parse(paramStr);
                        }
                        if(params && url){
                            common.fetch(url, method, params, function (res) {
                                if(res.success){
                                    layer.msg(item['actionSet']['successTip']);
                                }else{

                                    layer.msg(item['actionSet']['failTip'] + ":" + res.resultMessage);
                                }
                                layer.close(layerLoader);
                            }, function (err) {
                                if(err.resultMessage){
                                    layer.alert(err.resultMessage)
                                }else{
                                    layer.msg(item['actionSet']['failTip']);//失败后提示
                                }

                                layer.close(layerLoader);
                            },true);
                        }
                        return;
                    }


                }
            });

            if(tableParam.done){
                tableParam.done(tableParam,tableTemplate);
            }

        },

        /**
         * tree组件
         *
         * */
        tree:function(obj){
            var defaultParams={
                module:'', //模块导入区域
                title: '树',//
                area:null,
                elem: '',                   //容器的选择器或 DOM
                data: [],                   //直接赋值的数据
                showCheckbox: false,        // 节点是否可被选择
                emptText: "暂无数据",        // 内容为空的时候展示的文本
                renderAfterExpand: true,    // 是否在第一次展开某个树节点后才渲染其子节点
                highlightCurrent: true,    // 是否高亮当前选中节点，默认值是 false。
                defaultExpandAll: false,    // 是否默认展开所有节点
                expandOnClickNode: true,    // 是否在点击节点的时候展开或者收缩节点， 默认值为 true，如果为 false，则只有点箭头图标的时候才会展开或者收缩节点。
                checkOnClickNode: false,    // 是否在点击节点的时候选中节点，默认值为 false，即只有在点击复选框时才会选中节点。
                defaultExpandedKeys: [],    // 默认展开的节点的 key 的数组
                autoExpandParent: true,     // 展开子节点的时候是否自动展开父节点
                defaultCheckedKeys: [],     // 默认勾选的节点的 key 的数组
                indent: 16,                 // 相邻级节点间的水平缩进，单位为像素
                draggable: false,           // 是否开启拖拽节点功能
                contextmenuList: [],        // 启用右键菜单，支持的操作有："copy","add","edit","remove"
                // searchNodeMethod: null,     // 对树节点进行筛选时执行的方法，返回 true 表示这个节点可以显示，返回 false 则表示这个节点会被隐藏

                /*--------------------异步请求参数--------------------------*/
                method: "get",              // 接口http请求类型，默认：get
                url: "",                    // 异步数据接口
                contentType: "",            // 发送到服务端的内容编码类型
                done: null,                 // 数据请求完成的回调函数，只有异步请求才会有
                response: {                 // 对于后台数据重新定义名字
                    statusName: "success",
                    statusCode: "0",
                    dataName: "list"
                },
                loadRequest:['id'],
                height: 'auto', //full-200  full 表示当前屏幕的高度
                request: {                  // 对后台返回的数据格式重新定义
                    name: "name",
                    key: "id",
                    children: "children",
                    checked: "checked",
                    disabled: "disabled",
                    isLeaf: "isLeaf",
                    extendAttr:"extendAttr"
                },
                where: {},//传入参数值 如果是json   contentType配置需要配置为 application/json
                lazy: false,  // 是否懒加载子节点，需与 load 方法结合使用
                nodeClick:{
                    toModule:{
                        toModulePlugin:'',//影响区域的哪一个组件
                        toModuleName:'',//影响区域
                        toModulePluginEvent:'refresh',//组件的事件
                        toModuleWhere:'',//传入字段
                    },
                    saveNodeData:true,//点击的节点信息保全到全局变量中
                },
                defaultClick:false, //是否默认执行第一个点击项
                slideLeft:false,//是否开启模块向左缩放功能
                showIcon:true//是否显示节点图标，该icon 值为 返回数据中 extendAttr 的值
            };

            var treeParam=$.extend({},defaultParams,obj);

            var treeParent= $('#module_'+treeParam.module);

            //设定模板
            var template='<div class="layui-card">';

            if(treeParam.slideLeft){
                template+=' <div class="layui-card-header layui-card-header-custom"><span><i></i>'+treeParam.title+'</span><div class="columnSide"><i class="fa fa-toggle-left"></i></div></div>';
            }else{
                template+=' <div class="layui-card-header layui-card-header-custom"><span><i></i>'+treeParam.title+'</span></div>';
            }


            template+=' <div class="layui-card-body">';
            template += '<btn style="display: none" id="' + treeParam.module + '"></btn>';

            template+=' <div class="eleTree" id="tree_'+treeParam.module+'" lay-filter="tree_'+treeParam.module+'"></div>';

            template+=' </div>\n' +
                ' </div>';

            //将tree html导入

            if(treeParam.area){
                treeParent.find('.content-box').find(treeParam.area).empty().append(template);
            }else{
                treeParent.find('.content-box').empty().append(template);
            }

            //导入样式文件
            layui.link('../../css/common/eleTree.css');
            var treeDom=$('#tree_'+treeParam.module);

            //将当前的tree初始化绑定到 treeMap中
            treeMap[treeParam.module]= tree.render($.extend({},treeParam,{

                elem:treeDom,
                url:treeParam.url?global.baseUrl+treeParam.url:'',
                done:function(data){
                    //是否存在默认点击事件
                    if(treeParam.defaultClick){
                        //默认执行第一个节点的点击事件
                        $('#tree_'+treeParam.module).find('.eleTree-node-content-label').eq(0).trigger('click');
                    }
                },
                load: function(data,callback) {
                    if(treeParam.lazy){
                        var url=global.baseUrl+treeParam.url;
                        if(treeParam.url.indexOf('?')>-1){

                            $.map(treeParam.loadRequest,function (item, index) {
                                url+='&'+item+'='+data[item]
                            });

                        }else{
                            $.map(treeParam.loadRequest,function (item, index) {
                                if(index===0){
                                    url+='?'+item+'='+data[item]
                                }else{
                                    url+='&'+item+'='+data[item]
                                }
                            });
                        }
                        common.fetchGet(url,function (res) {
                            if(res.success && res.list){
                                callback(res.list)
                            }
                        },function () {
                            callback([])
                        });
                    }
                }
            }));

            //节点点击事件绑定
            if(!!treeParam.nodeClick && treeParam.nodeClick!=={}){
                //影响区域组件 事件绑定
                tree.on("nodeClick("+'tree_'+treeParam.module+")",function(obj) {

                    var currentId = obj.data.currentData.id;
                    /* saRoot = obj.data.currentData.saRoot;
                     saLevel = obj.data.currentData.saLevel+1;*/
                    // eventHandle.tableReload();

                    //数据保存搭配全局变量中
                    if(treeParam.nodeClick.saveNodeData){
                        treeCurrentNodeMap[treeParam.module]=obj.data.currentData;
                    }
                    if(treeParam.nodeClick.toModule){
                        if (treeParam.nodeClick.toModule instanceof Array) {
                            $.map(treeParam.nodeClick.toModule, function (item) {
                                if (item.toModulePlugin === 'table') {
                                    //影响区域事件注册
                                    switch (item.toModulePluginEvent) {
                                        //刷新事件
                                        case 'refresh':

                                            var whereName;

                                            if (typeof item.toModuleWhere == "string") {
                                                whereName = item.toModuleWhere;
                                                var reloadParam = {
                                                    where: {
                                                        whereName: obj.data.currentData[treeParam.request.key] || obj.data.currentData.id
                                                    },
                                                    page: {
                                                        curr: 1
                                                    },
                                                    done: function () {
                                                        common.buttonLimit();
                                                    },
                                                };
                                                // 属性名替换 写法不好 要优化
                                                reloadParam = JSON.parse(JSON.stringify(reloadParam).replace(/whereName/g, whereName));

                                                table.reload('table_' + item.toModuleName, reloadParam);

                                            } else if (typeof item.toModuleWhere == "object") {

                                                $.map(titem.toModuleWhere, function (item, index) {

                                                    if (typeof item == 'string') {

                                                    } else if (typeof item == 'object') {

                                                    }
                                                });
                                            }
                                            break;
                                    }
                                }
                                if (item.toModulePlugin === 'chart') {
                                    switch (item.toModulePluginEvent) {
                                        //刷新事件
                                        case 'refresh':

                                            var option = chartMap[item.toModuleName].getOption();
                                            chartMap[item.toModuleName].clear();

                                            var currentParam = moduleParams[item.toModuleName];

                                            if (currentParam.extendOption) {

                                                var whereName;
                                                if (typeof item.toModuleWhere == "string") {
                                                    whereName = item.toModuleWhere;
                                                    var reloadParam = {
                                                        whereName: obj.data.currentData[treeParam.request.key] || obj.data.currentData.id
                                                    };
                                                    // 属性名替换 写法不好 要优化
                                                    reloadParam = JSON.parse(JSON.stringify(reloadParam).replace(/whereName/g, whereName));


                                                } else if (typeof item.toModuleWhere == "object") {

                                                    $.map(titem.toModuleWhere, function (item, index) {

                                                        if (typeof item == 'string') {

                                                        } else if (typeof item == 'object') {

                                                        }
                                                    });
                                                }
                                                common.fetch(currentParam.extendOption.url, currentParam.extendOption.method, $.extend({}, currentParam.extendOption.where, reloadParam), function (res) {
                                                    toolHandle.chartDataSet(res, currentParam);
                                                }, function (error) {
                                                    if (error.errorText) {
                                                        top.layer.msg(error.errorText);
                                                    } else if (error.resultMessage) {
                                                        top.layer.msg(error.resultMessage);
                                                    }
                                                });
                                            } else {
                                                chartMap[item.toModuleName].setOption(option);
                                            }



                                            break;
                                    }
                                }
                            });
                        } else {
                            if (treeParam.nodeClick.toModule.toModulePlugin === 'table') {
                                //影响区域事件注册
                                switch (treeParam.nodeClick.toModule.toModulePluginEvent) {
                                    //刷新事件
                                    case 'refresh':

                                        var whereName;

                                        if (typeof treeParam.nodeClick.toModule.toModuleWhere == "string") {
                                            whereName = treeParam.nodeClick.toModule.toModuleWhere;
                                            var reloadParam = {
                                                where: {
                                                    whereName: obj.data.currentData[treeParam.request.key] || obj.data.currentData.id
                                                },
                                                page: {
                                                    curr: 1
                                                }
                                            };
                                            // 属性名替换 写法不好 要优化
                                            reloadParam = JSON.parse(JSON.stringify(reloadParam).replace(/whereName/g, whereName));

                                            table.reload('table_' + treeParam.nodeClick.toModule.toModuleName, reloadParam);

                                        } else if (typeof treeParam.nodeClick.toModule.toModuleWhere == "object") {

                                            $.map(treeParam.nodeClick.toModule.toModuleWhere, function (item, index) {

                                                if (typeof item == 'string') {

                                                } else if (typeof item == 'object') {

                                                }
                                            });
                                        }
                                        break;
                                }
                            }
                            //点击树给表单复制
                            if (treeParam.nodeClick.toModule.toModulePlugin === 'form') {
                                if($('input[name=' + treeParam.nodeClick.toModule.toModuleWhere + ']')){
                                    $('input[name=' + treeParam.nodeClick.toModule.toModuleWhere + ']').val(obj.data.currentData.id);
                                }
                            }
                        }
                    }
                });
            }

            //高度值设置
            if(treeParam.height!=='auto'){
                if(treeParam.height.indexOf('full')>-1){
                    treeDom.css({
                        // "height": document.body.clientHeight-treeParam.height.substring(5) + "px",
                        "height": $(window).height() - treeParam.height.substring(5) + "px",
                        "overflow-y":'auto'
                    });
                }else{
                    treeDom.css({
                        "height": treeParam.height+'px',
                        "overflow-y":'auto'
                    });
                }
            }
            if(treeParam.slideLeft){
                common.columnSide();
            }

            //树刷新
            $('#' + treeParam.module).off().on('click', function () {
                treeMap[treeParam.module].reload();
            })

        },


        /**
         * 表格搜索组件
         *
         * */
        tableSearch:function(obj){
            var searchParams = $.extend({}, {
                theme:'',
                module:'',
                area:null,
                title:null,
                empty:false,
                field:[]
                // isOriginOper:false //当存在form 和operation的情况下，调用form 模块的方法 ，默认带入了form中的按钮事件，如果想自定义按钮事件，则需要将isOriginOper设置为false ，则就是不执行
            }, obj);


            var searchParent= $('#module_'+searchParams.module);

            var searchTemplate='';
            if(searchParams.field[0] && searchParams.field[0].toggleLine){
                searchTemplate = '<div class=" layui-card" style="margin-bottom: -10px">' +
                    '                <div class="layui-card-header layui-card-header-custom"><span><i></i>'+(searchParams.title?searchParams.title:'查询条件')+'</span></div>\n' +
                    '                <div class="layui-card-body" id="module_search_form_'+searchParams.module+'">' +
                    '</div>';
            }else{
                searchTemplate = '<div class="layui-collapse" lay-accordion>\n' +
                    '                <div class="layui-colla-item">\n' +
                    '                    <h2 class="layui-colla-title white-bg">'+(searchParams.title?searchParams.title:'查询条件')+'</h2>\n' +
                    '                    <div class="layui-colla-content" id="module_search_form_'+searchParams.module+'">\n'+
                    '                    </div>\n' +
                    '                </div>\n' +
                    '            </div>';
            }

            //导入html

            if(searchParams.area){
                if(searchParams.empty){
                    searchParent.find('.content-box').find(searchParams.area).empty().append(searchTemplate);
                }else{
                    searchParent.find('.content-box').find(searchParams.area).empty().append(searchTemplate);
                }

            }else{
                if(searchParams.empty){
                    searchParent.find('.content-box').empty().append(searchTemplate);
                }else{
                    searchParent.find('.content-box').empty().append(searchTemplate);
                }

            }

            element.init();

            custom.form({
                module :searchParams.module,
                area:'#module_search_form_'+searchParams.module,
                field:searchParams.field,
                doSomething:function (obj,template) {

                }
            });

            $.map(searchParams.field,function (field) {
                if(field){
                    $.map(field.operation,function (item, index) {
                        if(item){
                            if(item.submitSet && item.type==='submit'){//判断是否存在按钮事件
                                //获取得到所欲操作的模块区域的table

                                //绑定点击事件
                                form.on('submit(' + item.name + ')', function (obj) {
                                    for (var i in obj.field) {
                                        obj.field[i] = $.trim(obj.field[i]);
                                    }
                                    var request = $.extend({}, obj.field, item.submitSet.request);
                                    for (var requestItem in request) {
                                        // if (request[requestItem] == null || request[requestItem] == undefined || request[requestItem] == '') {
                                        //     delete request[requestItem]
                                        // }
                                    }

                                    //传入参数多样式配置 当前场景 需要在传入参数外套个对象 { "rowVal":{},"pkVal":['NAME'] }，等其他更多的参数配置

                                    if (item.submitSet.requestExtension) { //参数扩展配置项

                                        //判断是否存在属性值为 requestData //则该对象为form表单上该pannel对应的field值

                                        var requestExtension = {};
                                        for (var extensionItem in item.submitSet.requestExtension) {
                                            if (item.submitSet.requestExtension[extensionItem] === 'requestData') {
                                                requestExtension[extensionItem] = request;
                                            }
                                        }
                                        request = requestExtension;
                                    }

                                    //根据module获取所有配置参数
                                    var currentParam = moduleParams[item.submitSet.toModule];
                                    if (currentParam.toolBarTip) {
                                        //重新请求接口，动态改变值，将where值带入
                                        common.fetch(currentParam.toolBarTip.url, currentParam.toolBarTip.method, request, function (res) {
                                            var text = currentParam.toolBarTip.html;
                                            var regex = /\#(.+?)\#/g;
                                            var result;
                                            var parent = $('#module_' + item.submitSet.toModule);
                                            var tipParam = $.extend({
                                                url: '',
                                                method: 'get',
                                                where: null,
                                                html: '',
                                                response: "object"
                                            }, currentParam.toolBarTip);
                                            while ((result = regex.exec(text)) != null) {
                                                parent.find('[toolBarTip=' + [result[1]] + ']').text(res[tipParam.response][result[1]] != null ? res[tipParam.response][result[1]] : '-');
                                            }
                                        }, function (error) {
                                            if (error.errorText) {
                                                top.layer.msg(error.errorText);
                                            } else if (error.resultMessage) {
                                                top.layer.msg(error.resultMessage);
                                            }
                                        }, false);
                                    }

                                    table.reload('table_'+item.submitSet.toModule,{
                                        page:{
                                            curr:1
                                        },
                                        where: request
                                    });

                                    //

                                    return false;
                                });

                            }
                            if(item.type==='reset'){
                                //排除隐藏域区域的重置项
                                return false;
                            }
                        }

                    })
                }

            });

        },

        /**
         * 插件导入
         * @param  {string}  plugin  [插件名称]  比如 上传组件、日历组件、下拉组件等
         * @param  {Object}   obj   [参数]
         * */
        pluginInit:function (plugin,obj) {

            if(!obj){ obj={} }


            switch (plugin) {
                //时间组件
                case 'time':


                    break;

            }

        },

        /**
         *form 分装
         * */
        form:function (obj) {
            var defaultParams={
                module:'',//导入的模块区域
                area:null,//表示该模块下的某一个区域，如果没有这个值，则导入module   支持写入 #xxx .xxx
                // type:'1',//1 表示全部展示方式，2表示显示一行
                field:[],
                empty:false,
                doSomething:function () { //执行块  外部人员做的一些单独配置

                }

            };

            var param=$.extend({},defaultParams,obj);


            var parent= $('#module_'+param.module);
            if(param.area){
                if(param.empty){
                    parent.find('.content-box').find(param.area).empty();
                }
            }else{
                if(param.empty){
                    parent.find('.content-box').empty();
                }
            }

            var template='';
            var asyncArr=[];//异步请求数据的集合
            var dateArr = [];//日历数据集合
            var foldTreeArr = [];//折叠树数据集合
            var btnArr = [];//表单btn数据集合

            //根据form生成html
            function templateFunc(param,index,option) {
                //排空处理
                param.form=common.trimData(param.form,'array');
                var template='';
                //主题设置
                if(param.theme==='1' || !param.theme){

                    template += '<form action="" class="layui-form form-theme-table" id="form_' + option.module + '_' + index + '" lay-filter="form_' + option.module + '_' + index + '">';

                }else if(param.theme==='2'){

                    template+= '<form action="" class="layui-form " id="form_'+option.module+'_'+index+'" lay-filter="form_'+option.module+'_'+index+'">';

                } else if (param.theme === '3') {

                    template += '<form action="" class="layui-form form-theme3" id="form_' + option.module + '_' + index + '" lay-filter="form_' + option.module + '_' + index + '">';

                }


                //具体form 区域

                template+= '<div class="layui-row layui-col-space10">';

                $.map(param.form,function (item,indexL) {
                    if(item){
                        if (indexL === 2) {
                            if(param.toggleLine){//默认只展示第一个
                                template+='<div class="toggle-area toggle-area-'+option.module+' layui-col-space10">'
                            }
                        }

                        var require = '', redStar = '', verify = '', disabled = '', placeholder = '', maxlength = '',
                            minlength = '', value;
                        if (item.placeholder) {
                            placeholder = item.placeholder
                        } else {
                            placeholder = "请输入" + item.label
                        }

                        if(item.required){
                            require='required  lay-verify="required"';
                            redStar='<b class="red">*</b>';
                        }
                        if (item.maxlength) {
                            maxlength = ' maxlength="' + item.maxlength + '"';
                        }
                        if (item.minlength) {
                            minlength = ' minlength="' + item.minlength + '"';
                        }
                        if(item.disabled){
                            disabled = 'disabled';
                        }
                        if(item.verify){
                            // verify=' lay-verify="'+item.verify+'" ';
                            require = '  lay-verify="' + item.verify + '"';
                        }
                        if (item.value) {
                            value = ' value="' + item.value + '"';
                        }
                        if(item.type!=='hidden'){
                            template+='<div class="layui-col-md'+item.col+' layui-col-xs'+item.col+'">\n';
                        }else{
                            template+='<div style="display: none" class="layui-col-md'+item.col+' layui-col-xs'+item.col+'">\n';
                        }

                        //判断是都需要设置label 整行显示
                        if (item.isLabelFull && item.type !== 'hidden') {
                            if(item.type==='textarea'){
                                template += '<div class="layui-form-item layui-form-text">\n';
                            }else{
                                template += '<div class="layui-form-item ">\n';
                            }
                        }else if(item.type==='hidden'){
                            template+='<div style="display: none" class="layui-form-item layui-form-text">\n';
                        }else{
                            template+='<div class="layui-form-item">\n';
                        }

                        if(item.type==='textarea'){
                            template += '<label class="layui-form-label" style="" title="' + item.label + '">' + redStar + '' + item.label + '</label>\n';
                        }else{
                            template+='<label class="layui-form-label" title="'+item.label+'">'+redStar+''+item.label+'</label>\n';
                        }

                        if(item.inline){
                            template+=' <div class="layui-input-inline">\n';
                        } else {
                            if(item.type==='textarea'){
                                template += ' <div class="layui-input-block">\n';
                            }else{
                                template+=' <div class="layui-input-block">\n';
                            }
                        }

                        if(item.type==='input'){
                            var inputType='';
                            if(!!item.inputType){
                                if(item.inputType==='number'){
                                    inputType=' type="number" '
                                }else if(item.inputType==='password'){
                                    inputType=' type="password" '
                                }else if(item.inputType==='hidden'){
                                    inputType=' type="hidden" '
                                }
                            }else{
                                inputType=' type="text" '
                            }
                            template += '<input  ' + disabled + '  ' + inputType + ' name="' + item.name + '" ' + require + verify + maxlength + minlength + value + ' placeholder="' + placeholder + '"  class="layui-input">';
                        } else if (item.type === 'hidden') {
                            template += '<input type="hidden" name="' + item.name + '"' + value + '>';
                        } else if (item.type === 'button') {
                            //表单按钮
                            btnArr.push(item);
                            template += '<button type="button" class="layui-btn" name="' + item.name + '">' + item.text + '</button>';
                            template += '<div class="btnOper' + item.name + '" style="display: none"></div>';
                        }
                        else if(item.type==='select'){

                            if(item.isSearch){
                                template+='<select '+disabled+'   '+require+' lay-search="" name="'+item.name+'"  id="'+item.name+'">' ;

                                template+='<option value="">直接选择或搜索选择</option>';
                            }else{
                                template+='<select '+disabled+'   '+require+' name="'+item.name+'"  id="'+item.name+'">' ;

                                template+='<option value="">请选择</option>';
                            }

                            if(item.data && item.data.length>0){//直接数据导入

                                for (var i=0;i<item.data.length;i++){

                                    template+='<option value="'+item.data[i]['value']+'">'+item.data[i]['text']+'</option>';

                                }

                            }else if(item.dicData){//通过后台请求获取字典内容
                                if(item.dicData.url && item.dicData.optionValue && item.dicData.optionText){
                                    var method = "get"; //请求方式
                                    var whereCase;      //附加参数
                                    var node='list'; //解析节点
                                    var optionValue = item.dicData.optionValue; //对应选中值字段
                                    var optionText = item.dicData.optionText;   //对应显示值字段
                                    var options = '';
                                    if(item.dicData.method){
                                        method = item.dicData.method;
                                    }
                                    if(item.dicData.whereCase){
                                        whereCase = item.dicData.whereCase;
                                    }
                                    if(item.dicData.node){
                                        node = item.dicData.node;
                                    }
                                    common.fetch(item.dicData.url, method, whereCase, function (res) {
                                        if(res && res[node]){
                                            for (var i=0;i<res[node].length;i++){
                                                options+='<option value="'+res[node][i][optionValue]+'">'+res[node][i][optionText]+'</option>';
                                            }
                                            template+=options;
                                        }else if(res){
                                            $.map(res,function (val) {
                                                if (val) {
                                                    options += '<option value="' + val[optionValue] + '">' + val[optionText] + '</option>';
                                                }
                                            });
                                            template+=options;
                                        }
                                    },function(ero){},"false");  //“false”需要使用同步方式调用，否则获取到的字典内容无法加载到html指定位置。
                                }
                            }
                            // else if(item){ //异步加载
                            //     item.formNumber=index;
                            //     asyncArr.push(item);
                            // }


                            template+='</select>';


                        }
                        else if(item.type==='textarea'){

                            template += '<textarea ' + disabled + '   ' + require + maxlength + ' class="layui-textarea" name="' + item.name + '"  id="' + item.name + '" placeholder="' + placeholder + '"></textarea>';

                        } else if (item.type === 'date') {
                            dateArr.push(item);
                            template += ' <input ' + disabled + ' name="' + item.name + '" ' + require + verify + ' placeholder="' + placeholder + '"  class="layui-input">';

                        } else if(item.type==='radio'){

                            $.map(item.data,function (val) {

                                var checked='',disabled='';
                                if(val.checked){
                                    checked=' checked=""';
                                }
                                if(val.disabled){
                                    disabled=' disabled=""';
                                }

                                template+='<input '+disabled+'   '+require+' type="radio" name="'+val.name+'" value="'+val.value+'" title="'+val.text+'" '+checked + disabled+'>';

                            });


                        } else if(item.type==='checkbox'){

                            $.map(item.data,function (val) {

                                var checked='',disabled='',theme='';
                                if(val.checked){
                                    checked=' checked=""';
                                }
                                if(val.disabled){
                                    disabled=' disabled=""';
                                }

                                if(item.theme && item.theme===2){
                                    theme='lay-skin="primary" ';
                                }else{
                                    item.theme=1;
                                    theme='';
                                }

                                template+='<input '+require+' type="checkbox" name="'+val.name+'" value="'+val.value+'" title="'+val.text+'" '+checked + disabled+ theme+'>';

                            });
                            // {"field":[{"form":[{"col":12,"name":"smName","label":"名称","type":"input","required":false},{"col":12,"name":"smName","label":"名称","type":"input","required":false},{"col":12,"name":"smName","label":"名称","type":"input","required":false},{"col":12,"name":"smName","label":"名称","type":"input","required":false},{"col":12,"name":"smName","label":"名称","type":"input","required":false}],"isOriginOper":false,"toggleLine":true,"theme":"1","operation":[{"name":"searchSubmit","label":"查询","type":"submit","submitSet":{"toModule":"IDJN1DAG42EKKAFGD1F9CBHNMC"}},{"name":"reset","label":"重置","type":"reset"}]}],"plugin":"searchTable","name":"IDJN1DAG42EKKAFGD1F9CBHNMC","title":"查询条件"}

                        } else if(item.type==='switch'){
                            var checked='';
                            if(item.checked){
                                checked=' checked="" ';
                            }
                            template+='  <input '+disabled+'   '+checked+' type="checkbox" name="'+item.name+'" lay-skin="switch" lay-text="ON|OFF">'
                        } else if (item.type === 'foldTree') {
                            foldTreeArr.push(item);
                            template += ' <input ' + disabled + ' type="text" name="' + item.name + '" ' + require + verify + ' placeholder="请输入' + item.label + '"  class="layui-input">';
                            template += ' <div class="eleTree ele5" id="' + item.name + '" lay-filter="' + item.name + '"></div>';
                        }

                        template+= '</div></div></div>' ;

                        if(indexL===param.form.length-1){
                            if(param.toggleLine){//默认只展示第一个

                                // template+= '</div></div>';
                                if (param.form.length === 2 || param.form.length === 1) {
                                    template+= '';
                                }else{
                                    template+= '</div>';
                                }
                            }
                        }
                    }

                });
                //button 区域
                if (option.plugin && option.plugin === 'form') {
                    template += '<div class="" style="text-align: center;margin-bottom: 5px"><div class="layui-input-inline">\n';
                } else {

                    if (param.form.length % 3 === 0) { //三的倍数
                        template += '<div class="" style="text-align: center;margin-bottom: 5px"><div class="layui-input-inline">\n';
                    } else {
                        //非三的倍数 定位在第三列居中
                        template += '<div class="" style="min-width: 230px; text-align: center; position: absolute;width: 33%;right: 0;bottom: 12px;"><div class="layui-input-inline" style="padding-left: 20px">\n';
                    }
                }


                if (param.operation && param.operation.length > 0) {
                    $.map(param.operation, function (item, index) {
                        if (item) {
                            var permissionBtn = '';
                            if (!!item.permissionBtn) {
                                permissionBtn = 'permission-btn="' + item.permissionBtn + '"';
                            } else {
                                permissionBtn = '';
                            }

                            var disabled = '';
                            if (item.disabled) {
                                disabled = 'disabled';
                            }
                            var iconHtml;
                            if(item.iconType){
                                iconHtml=custom.iconType(item.iconType)
                            }else{
                                iconHtml='';
                            }

                            if (item.type === 'submit') {

                                template += '<button   name="' + item.name + '" class="layui-btn ' + disabled + ' " lay-submit lay-filter="' + item.name + '" ' + permissionBtn + '>' +iconHtml+ item.label + '</button>';
                            } else if (item.type === 'reset') {
                                template += '<button name="' + item.name + '" lay-filter="' + item.name + '" type="reset" class="layui-btn layui-btn-primary ' + disabled + ' " ' + permissionBtn + '>' +iconHtml+ item.label + '</button>\n';
                            } else {
                                if(item.btnClass){
                                    switch (item.btnClass){
                                        case 'warm':
                                            template += '<button name="' + item.name + '" lay-filter="' + item.name + '"  class="layui-btn layui-btn-warm ' + disabled + ' " ' + permissionBtn + '>' +iconHtml+ item.label + '</button>\n';
                                            break;
                                    }
                                }else{
                                    template += '<button name="' + item.name + '" lay-filter="' + item.name + '"  class="layui-btn layui-btn-primary ' + disabled + ' " ' + permissionBtn + '>' +iconHtml+ item.label + '</button>\n';
                                }
                            }
                        }
                    });
                }

                if (param.toggleLine && param.form.length > 2) {//默认只展示第一个
                    template+='<a class="toggle-btn toggle-btn-'+option.module+'"><span>展开</span><i class="fa fa-angle-up"></i></a>';
                }


                template+='</div></div></div></form>';

                return template;
            }

            function operation(param,module) {

                //operation 事件  是否使用默认定义的按钮事件方法组
                if(param.isOriginOper){
                    if (param.operation && param.operation.length > 0) {
                        $.map(param.operation, function (item, index) {
                            if (item == null) { //判断对象为空则退出
                                return false;
                            }
                            if (item.type === 'submit') {//判断是否存在按钮事件
                                //自定义提交的所有方法体
                                form.on('submit(' + item.name + ')', function (obj) {
                                    var layerLoader = common.layerLoader();
                                    var data = obj.field;
                                    //item.submitSet.request 除了表单上配置的值，还需要额外添加的参数 比如id 等
                                    var request = $.extend({}, data, item.submitSet.request);


                                    //传入参数多样式配置 当前场景 需要在传入参数外套个对象 { "rowVal":{},"pkVal":['NAME'] }，等其他更多的参数配置
                                    // 现在默认一些写法  待大家一起补充和修订

                                    if (item.submitSet.requestExtension) { //参数扩展配置项

                                        //判断是都存在属性值为 requestData //则该对象为form表单上该pannel对应的field值

                                        var requestExtension = {};
                                        for (var extensionItem in item.submitSet.requestExtension) {
                                            if (item.submitSet.requestExtension[extensionItem] === 'requestData') {
                                                requestExtension[extensionItem] = request;
                                            }
                                        }
                                        request = requestExtension;
                                    }
                                    common.fetch(global.baseUrl + item.submitSet.url, item.submitSet.method, request, function (res) {
                                        if(res.success == false){
                                            top.layer.alert(res.resultMessage);
                                            layer.close(layerLoader);
                                            return;
                                        }
                                        if(res.resultMessage){
                                            top.layer.alert(res.resultMessage);
                                        }

                                        //是否需要绑定影响区域
                                        if (item.submitSet.toModule && item.submitSet.toModule.length > 0) {
                                            $.map(item.submitSet.toModule, function (toModule, i) {

                                                if (toModule.toModulePlugin === 'table') {

                                                    //影响区域事件注册
                                                    switch (toModule.toModulePluginEvent) {
                                                        //刷新事件
                                                        case 'refresh':
                                                            var reloadParam = {};
                                                            reloadParam = {
                                                                done: function () {
                                                                    common.buttonLimit();
                                                                },
                                                                page: {
                                                                    curr: 1
                                                                }
                                                            };
                                                            if (item.isTop) {//在top 页面的操作
                                                                if (toModule.toModuleDom) { //如果全在刷新按钮 则触发按钮事件
                                                                    if ($(top.window.document).find(toModule.toModuleDom)[0]) {
                                                                        $(top.window.document).find(toModule.toModuleDom).trigger('click');
                                                                    } else {
                                                                        // $($(top.window.document).find('#mainTabContent .layui-show').find('.iframe')[0].contentWindow.document).find(toModule.toModuleDom).click();
                                                                        $($(top.window.document).find('#menuContent').find('.iframe')[0].contentWindow.document).find(toModule.toModuleDom).click();
                                                                    }
                                                                } else { //暴力更新
                                                                    top.window.location.reload();
                                                                }

                                                            } else {
                                                                //当前页面
                                                                table.reload('table_' + toModule.toModuleName, reloadParam);
                                                            }
                                                            break;
                                                    }
                                                } else if (toModule.toModulePlugin === 'tree') {
                                                    //影响区域事件注册
                                                    switch (toModule.toModulePluginEvent) {
                                                        //刷新事件
                                                        case 'refresh':
                                                            if (item.isTop) {//在top 页面的操作

                                                                if ($(top.window.document).find('#' + toModule.toModuleName)[0]) {
                                                                    $(top.window.document).find('#' + toModule.toModuleName).trigger('click');
                                                                } else if ($($(top.window.document).find('#menuContent').find('.iframe')[0].contentWindow.document).find('#' + toModule.toModuleName)[0]) {
                                                                    // $($(top.window.document).find('#mainTabContent .layui-show').find('.iframe')[0].contentWindow.document).find(toModule.toModuleDom).click();
                                                                    $($(top.window.document).find('#menuContent').find('.iframe')[0].contentWindow.document).find('#' + toModule.toModuleName).click();
                                                                } else {
                                                                    window.location.reload();
                                                                }

                                                            } else {
                                                                //当前页面
                                                                treeMap[toModule.toModuleName].reload();
                                                            }
                                                            break;
                                                    }
                                                }
                                            });

                                        } else {

                                        }

                                        if (!!item.isTop) {
                                            top.layer.close(window.top.layer.getFrameIndex(window.name));
                                        }

                                        if (item.submitSet.successTip) {
                                            top.layer.msg(item.submitSet.successTip)
                                        } else {
                                            top.layer.msg("保存成功");
                                        }
                                        layer.close(layerLoader);

                                    }, function (error) {
                                        layer.close(layerLoader);
                                        //layerLoader.close();
                                        if (error.errorText) {
                                            top.layer.msg(error.errorText);
                                        } else if (error.resultMessage) {
                                            top.layer.msg(error.resultMessage);
                                        }
                                        /**  异常时不刷新窗口
                                         if(!!item.isTop){
                                        top.layer.close( window.top.layer.getFrameIndex(window.name));
                                    }
                                         */
                                    });

                                    return false;

                                });

                            } else if (item.type === 'layer') {
                                if (!!item.layerSet) {
                                    custom.layer(item.layerSet, param);
                                } else {
                                    layer.msg('请配置layerSet属性');
                                }
                            } else if (item.type === 'cancel') {

                                $('[name=' + item.name + ']').off().on('click', function (obj) {

                                    if (top.layer) {
                                        top.layer.close(window.top.layer.getFrameIndex(window.name));
                                    }

                                    return false;
                                });

                            } else if (item.type === 'reset') {
                                return false;
                            } else if (item.type ==='action') {
                                $('[name=' + item.name + ']').off().on('click', function (obj) {

                                    var form = $('#form_'+module+'_0');
                                    var method = 'post';
                                    var paramStr = '';
                                    var params;
                                    var url;
                                    var layerLoader = common.layerLoader();

                                    if (item['actionSet']['url']) {
                                        url = item['actionSet']['url'];
                                    }
                                    if (item['actionSet']['method']) {
                                        method = item['actionSet']['method'];
                                    }
                                    if(item['actionSet']['actionParam']){
                                        paramStr = "{";
                                        $.map(item['actionSet']['actionParam'],function(paramItem,index){
                                            if(index == 0){
                                                paramStr += ("\"" + paramItem.name + "\":" + "\"" + form.find('[name='+paramItem.name+']').val() + "\"");
                                            }else{
                                                paramStr += (",\"" + paramItem.name + "\":" + "\"" +form.find('[name='+paramItem.name+']').val() + "\"");
                                            }
                                        })
                                        paramStr += "}";
                                        params = JSON.parse(paramStr);
                                    }
                                    if (params && url) {
                                        common.fetch(url, method, params, function (res) {
                                            if (res.success) {
                                                layer.msg(item['actionSet']['successTip']);
                                            } else {
                                                layer.msg(item['actionSet']['failTip'] + ":" + res.resultMessage);
                                            }
                                            layer.close(layerLoader);
                                            return false;
                                        }, function (res) {
                                            layer.msg(item['actionSet']['failTip'] + ":" + res.resultMessage);
                                            layer.close(layerLoader);
                                            return false;
                                        }, true);
                                    }
                                    return false;
                                });
                            } else if (item.type === 'click') {
                                $('[name=' + item.name + ']').off().on('click', function (obj) {
                                    return false;
                                });
                                return false;
                            }
                        });
                    }

                }

            }

            if(param.field && param.field.length>0){
                $.map(param.field,function (filed,i) {

                    if(filed){
                        if(filed.title){ //存在title 表示存在fieldset区域
                            var fieldset = toolHandle.titleSet(filed.titleSet, ' ') + '<fieldset class="layui-elem-field">' +
                                '<legend>'+filed.title.name+'</legend>'+
                                '<div class="layui-field-box field-box-'+i+'"></div>'+
                                '</fieldset>';

                            if(param.area){ //是否向特定区域导入html

                                parent.find('.content-box').find(param.area).empty().append(fieldset);

                            }else{

                                parent.find('.content-box').empty().append(fieldset);

                            }

                            parent.find('.field-box-'+i).append(templateFunc(filed,i,param));

                        }else{
                            if(param.area){ //是否向特定区域导入html

                                parent.find('.content-box').find(param.area).append((toolHandle.titleSet(filed.titleSet, ' ') + templateFunc(filed, i, param)));

                            }else{

                                parent.find('.content-box').append((toolHandle.titleSet(filed.titleSet, ' ') + templateFunc(filed, i, param)));

                            }
                        }

                        common.toggleArea($('.toggle-btn-'+param.module),$('.toggle-area-'+param.module));
                        toolHandle.helpTip();

                        //日历初始化导入
                        if (dateArr.length > 0) {
                            $.map(dateArr, function (dateVal, dateIndex) {
                                $('input[name=' + dateVal.name + ']').removeAttr("lay-key");
                                laydate.render($.extend({}, dateVal['dateSet'], {
                                    elem: 'input[name=' + dateVal.name + ']',
                                    trigger: 'click'
                                }));
                            });
                        }

                        //折叠数据导入
                        if (foldTreeArr.length > 0) {
                            $.map(foldTreeArr, function (fold) {
                                $("[name=" + fold.name + "]").on("click", function (e) {
                                    e.stopPropagation();
                                    tree.render({
                                        elem: '#' + fold.name,
                                        data: fold.data,
                                        defaultExpandAll: true,
                                        expandOnClickNode: false,
                                        highlightCurrent: true
                                    });
                                    $('#' + fold.name).toggle();
                                });
                                tree.on("nodeClick(" + fold.name + ")", function (d) {
                                    $("[name=" + fold.name + "]").val(d.data.parentData.data.id != d.data.currentData.id ? (d.data.parentData.data.name + '-' + d.data.currentData.name) : d.data.currentData.name);
                                    $('#' + fold.name).hide();
                                });
                                $(document).on("click", function () {
                                    $('#' + fold.name).hide();
                                });
                            });
                        }

                        //按钮数据注册导入
                        if (btnArr.length > 0) {
                            $.map(btnArr, function (btnItem) {
                                if (btnItem.btnOper.event === 'upload') {

                                    custom.upload($.extend(btnItem.btnOper.eventSet, {
                                        module: param.module,
                                        name: btnItem.name
                                    }));
                                } else {
                                    //...待补充
                                }

                            });
                        }

                        operation(filed,param.module);//执行方法体
                    }

                });
            }

            form.render();

            //将异步请求的数据导入对应select
            /*if(asyncArr.length>0){
                //存在异步加载的select框，
                $.map(asyncArr,function (item, index) {
                    if(item){
                        common.selectDataSet({
                            elem: $('#'+item.name),
                            url:item.url,
                            method: item.method,
                            responseList:item.responseList,
                            optionText:item.optionText,
                            optionValue:item.optionValue,
                            isSearch:item.isSearch,
                            success:function () {
                                form.render('select','Form_'+param.module+'_'+item.formNumber);

                            }
                        });
                    }

                })
            }*/



            //外界自定义的方法体
            if(param.doSomething){
                param.doSomething(param,template);
            }

        },

        /**
         *tab 选项卡
         * */
        tab:function(obj){
            var defaultParams={
                module:'',//导入的模块区域
                area:null,//表示该模块下的某一个区域，如果没有这个值，则导入module   支持写入 #xxx .xxx
                empty:false,
                header:[],
                done:function () {

                }
            };

            var param=$.extend({},defaultParams,obj);

            var theme;
            if(param.theme==1){
                theme='';
            }else if(param.theme==2){
                theme='layui-tab-brief';
            }else if(param.theme==3){
                theme='layui-tab-card'
            }else{
                theme='';
            }

            var parent= $('#module_'+param.module);
            var template = '<div class="layui-tab ' + theme + '" lay-filter="tab_' + param.module + '">';

            if(param.header && param.header.length>0){
                template += '<ul class="layui-tab-title">';

                $.map(param.header, function (item) {

                    var show;
                    if(item.isShow){
                        show = ' layui-this';
                    }
                    template += '<li class="' + show + '" name="' + item.name + '" >' + item.text + '</li>';
                });


                template+='</ul>';
            }

            if(param.header && param.header.length>0){
                template += '<div class="layui-tab-content">';

                $.map(param.header, function (item) {
                    var show;
                    if(item.isShow){
                        show = ' layui-this'
                    }
                    template += '<div class="layui-tab-item ' + show + '" name="content_' + item.name + '" ></div>';
                });


                template+='</div>';
            }



            template+='</div>';

            if(param.area){
                if(param.empty){
                    parent.find('.content-box').find(param.area).empty().append(template);
                }else{
                    parent.find('.content-box').find(param.area).append(template);
                }
            }else{
                if(param.empty){
                    parent.find('.content-box').empty().append(template);
                }else{
                    parent.find('.content-box').append(template);
                }
            }
            if(param.done){
                param.done();
            }

            element.init();

        },

        //弹出层
        layer:function(obj,parentParam){
            var defaultParams={
                type:'2',//默认为iframe弹出形式 1：表示传入html 或者string
                iframeId:'',
                bindBtn:'',
                offset:'auto',
                isFull:false,
                title:'',
                maxmin:true,
                btnAlign:'c',//默认值为center
                closeBtn:'', //关闭按钮
                shade :0.5,//遮罩
                shadeClose:false,//弹出层外部区域关闭
                time:0,//自动关闭时间
                layerId:'',//用于弹框的唯一标识
                anim:0,//弹出动画
                resize:true,
                scrollbar:true,
                // zIndex:'100',//层叠顺序
                successBack:'',
                cancelBack:'',//点击右上角的关闭按钮回退
                area:[],
                btn: [],
                rowData:true,//是否获取当前行的数据
                layerBg: 'none', //弹框背景色
                globalDataSet:{ //数据来源于接口值，而不是来源于表格中rowData 设置值
                    // url: '',
                    // method:'',
                    // where: {},
                    // dataObj: {}
                },
                dataFromCurrentForm: [//将当前页面中form 的表单值 写入 layer 中的表单中
                    /* {
                         paramName:'',//表示写入layer中表单的name 值
                         fieldName:'' //表示取值的form 中对应的表单名
                     }*/
                ],
                oper:[  //:todo 还未做配置
                    {
                        btnText:'确定',
                        isClose:true,
                        perform:''
                    }
                ]
            };
            var param=$.extend({},defaultParams,obj);

            var baseUrl='../../..';
            var usedUrl = param.url;
            var content;
            var errorFlag = 0;
            //判断弹窗是否使用URL
            if (usedUrl && usedUrl != null) {
                //使用URL跳转时自定义传参
                if(param.urlParam && param.urlParam.length > 0){
                    var urlParamStr = "?";
                    var i = 0;
                    var data={};

                    if(!!dom.rowDataLine.val()){
                        data=JSON.parse(dom.rowDataLine.val());
                    }

                    var flag = '';
                    //遍历传参名称 urlName=tableField or urlName=treeNode
                    $.map(param.urlParam, function (urlItem) {
                        if(i > 0){
                            flag = '&';
                        }
                        if(!!urlItem.urlName && !!urlItem.tableField){
                            urlParamStr += (flag + urlItem.urlName + '=' + data[urlItem.tableField]);
                        } else if (!!urlItem.urlName && !!urlItem.treeField && !!urlItem.treeModuleName) {
                            if(!!treeCurrentNodeMap){
                                if (treeCurrentNodeMap[urlItem.treeModuleName] == undefined) {
                                    if(urlItem.emptyMsg){
                                        layer.msg(urlItem.emptyMsg);
                                        errorFlag = 1;
                                        return false;
                                    }
                                }else{
                                    if(urlItem.isTails == true){
                                        urlParamStr += (flag + urlItem.urlName + '=' + treeCurrentNodeMap[urlItem.treeModuleName]['tails'][urlItem.treeField]);
                                    }else{
                                        urlParamStr += (flag + urlItem.urlName + '=' + treeCurrentNodeMap[urlItem.treeModuleName][urlItem.treeField]);
                                    }
                                }
                            }
                        }
                        i++;
                    });
                    if(errorFlag == 1){
                        return false;
                    }

                    content = baseUrl + usedUrl + urlParamStr;
                }else{
                    content = baseUrl + usedUrl;
                }
            }else{
                content = global.baseUrl+'src/page/custom/custom.html?'+param.iframeId;
            }
            if (param.btn && param.btn.length === 0) {
                param.btn = null;
            }
            var layerDom=top.layer.open({
                title:param.title,
                type: param.type,
                //content: global.baseUrl+'src/page/custom/custom.html?'+param.iframeId,
                content: content,
                maxmin: param.maxmin,
                offset:param.offset,
                btnAlign:param.btnAlign,
                shade:param.shade,
                shadeClose:param.shadeClose,
                time:param.time,
                id:param.layerId,
                anim:param.anim,
                resize:param.resize,
                scrollbar:param.scrollbar,
                zIndex:param.zIndex,
                btn: param.btn,
                area:param.area,
                success: function (layero, index) {

                    //使用URL访问页面模式直接跳过。
                    if(usedUrl && usedUrl != null){
                        return;
                    }
                    //显示全局loading
                    //var loaderLayer=common.layerLoader();
                    var parent;


                    if(window.frames["layui-layer-iframe"+index]){
                        parent=$(window.frames["layui-layer-iframe"+index].document);
                    }else if(top.window.frames["layui-layer-iframe"+index]){
                        parent=$(top.window.frames["layui-layer-iframe"+index].document);
                    }

                    parent.find('.iframe-h').addClass('gloBg');

                    parent.find('.iframe-h').append('<style>.pageRocket{display: none}</style>');
                    parent.find('.pageRocket').hide();
                    setTimeout(function () {
                        parent.find('.pageRocket').hide();
                    }, 300);

                    var dataSet=function (data) {
                        var trueSuccessBack=function () {
                            for(var item in data){
                                if(!!item){
                                    parent.find('[name='+item+']').val(data[item]);
                                }
                            }
                            //form render
                            layero.find('iframe')[0].contentWindow.layui.form.render('select');
                            layero.find('iframe')[0].contentWindow.layui.form.render('checkbox');
                            layero.find('iframe')[0].contentWindow.layui.form.render('radio');
                        };

                        //这里的success只是iframe导入完成，并不能直接进入iframe内的元素异步加载完成，所以这里采用的定时器的办法，当找到对应元素时 清空当前定时器

                        if(parent.find('#isDone').val()==='yes'){
                            trueSuccessBack();
                        }else {
                            //定时请求
                            var time=setInterval(function () {
                                if(parent.find('#isDone').val()==='yes'){
                                    trueSuccessBack();
                                    clearInterval(time);
                                }

                            },500);
                        }
                    };

                    //数据设置
                    if(param['rowDataSet']){
                        var data=JSON.parse(dom.rowDataLine.val());
                        //这里的限制只对属性name值对应的设置
                        dataSet(data);
                    }

                    function trueSuccessBack2() {
                        if(param['globalDataSet'] && param['globalDataSet']!={}){

                            if (param['globalDataSet']['method']) {
                                if (param['globalDataSet']['method'] === 'get') {
                                    var url;
                                    if (typeof (param['globalDataSet']['where']) == "string") {
                                        url = param['globalDataSet']['url'] + '?' + param['globalDataSet']['where'];
                                    } else {
                                        for (var it in param['globalDataSet']['where']) {
                                            if (param['globalDataSet']['where'][it].indexOf('name_') > -1) {
                                                var valLine;

                                                var itValue = param['globalDataSet']['where'][it].substring(5);

                                                if ($('[name=' + itValue + ']').val() != null && $('[name=' + itValue + ']').val() != undefined && $('[name=' + itValue + ']').val() != '') {
                                                    valLine = $('[name=' + itValue + ']').val();
                                                } else if ($("#rowDataLine", parent.document).val()) {
                                                    valLine = JSON.parse($("#rowDataLine", parent.document).val())[itValue];
                                                }

                                                url = param['globalDataSet']['url'] + '?' + it + '=' + valLine;
                                            } else {
                                                url = param['globalDataSet']['url'] + '?' + it + '=' + param['globalDataSet']['where'][it];
                                            }
                                        }
                                    }

                                    common.fetchGet(url, function (data) {
                                        if (data[param['globalDataSet']['dataObj']]) {
                                            dataSet(data[param['globalDataSet']['dataObj']]);
                                        } else {
                                            dataSet(data);
                                        }
                                    });

                                } else if (param['globalDataSet']['method'] === 'post') {
                                    common.fetchPost(param['globalDataSet']['url'], request, function (data) {
                                        if (data[param['globalDataSet']['dataObj']]) {
                                            dataSet(data[param['globalDataSet']['dataObj']]);
                                        } else {
                                            dataSet(data);
                                        }
                                    });

                                }
                            }
                        }
                        //需求是：将当前页面中form 的表单值 写入 layer 中的表单中

                        if (param['dataFromCurrentForm'] && param['dataFromCurrentForm'] instanceof Array && param['dataFromCurrentForm'].length > 0) {
                            // var itemMap={};
                            var itemDataMap = {};
                            for (var i = 0; i < param['dataFromCurrentForm'].length; i++) {
                                var currentFormItem = {};
                                //在当前的layer中取出form表单值
                                itemDataMap[param['dataFromCurrentForm'][i]['paramName']] = $('[name=' + param['dataFromCurrentForm'][i]['fieldName'] + ']').val();
                            }
                            dataSet(itemDataMap);
                        }
                    }

                    if(parent.find('#isDone').val()==='yes'){
                        trueSuccessBack2();
                    }else {
                        //定时请求
                        var time2=setInterval(function () {
                            if(parent.find('#isDone').val()==='yes'){
                                trueSuccessBack2();
                                clearInterval(time2);
                            }

                        },500);
                    }

                    //初始值配置
                    if(param['treeDataSet']){
                        //锁定初始化值
                        // var nodeData=JSON.parse(dom.nodeDataLine.val());
                        //这里的限制只对属性name值对应的设置

                        var parentLayer;

                        if(window.frames["layui-layer-iframe"+index]){
                            parentLayer=$(window.frames["layui-layer-iframe"+index].document);
                        }else if(top.window.frames["layui-layer-iframe"+index]){
                            parentLayer=$(top.window.frames["layui-layer-iframe"+index].document);
                        }

                        var callBack = function () {
                            //获取全局变量值
                            if(param['treeDataSet']['attributeName']){


                                //设置对应值
                                $.map(param['treeDataSet']['attributeName'],function (current) {

                                    if (!current) {
                                        return false;
                                    }

                                    if(typeof (current)==='string'){
                                        //方式1：树节点名称与表单ID一致时。{name1,name2,name3}
                                        if( parentLayer.find('[name='+current+']')[0]){
                                            if (JSON.stringify(treeCurrentNodeMap) != "{}" && treeCurrentNodeMap[param['treeDataSet']['getModuleName']] && treeCurrentNodeMap[param['treeDataSet']['getModuleName']][current]) {
                                                parentLayer.find('[name=' + current + ']').val(treeCurrentNodeMap[param['treeDataSet']['getModuleName']][current]);
                                            }else{
                                                parentLayer.find('[name='+current+']').val(0);
                                            }
                                        }
                                    } else if (typeof (current) === "object") {
                                        //方式2：定义树节点名称赋值到表单ID域。 [{name:name1,fieldName:formName1},{name:name2,fieldName:formName2}]

                                        if (!!current && current.name && current.fieldName) {
                                            if(parentLayer.find('[name='+current.fieldName+']')){
                                                if (treeCurrentNodeMap && JSON.stringify(treeCurrentNodeMap) != "{}") {
                                                    parentLayer.find('[name=' + current.fieldName + ']').val(treeCurrentNodeMap[param['treeDataSet']['getModuleName']][current.name]);

                                                }
                                            }
                                            //方式3：树节点名称与表单ID一致时。[{name:name1,mathAdd:1},{name,name2}]
                                        }else{
                                            if(parentLayer.find('input[name='+current.name+']')[0]){
                                                if (JSON.stringify(treeCurrentNodeMap) != "{}" && treeCurrentNodeMap[param['treeDataSet']['getModuleName']] && treeCurrentNodeMap[param['treeDataSet']['getModuleName']][current['name']]) {
                                                    parentLayer.find('[name='+current['name']+']').val(current['mathAdd']
                                                        ?current['mathAdd']+treeCurrentNodeMap[param['treeDataSet']['getModuleName']][current['name']]
                                                        :treeCurrentNodeMap[param['treeDataSet']['getModuleName']][current['name']]);
                                                }else{
                                                    parentLayer.find('[name='+current['name']+']').val(0);
                                                }
                                            }
                                        }
                                    }

                                    /*
                                    if(current && current.treeNodeId && current.formFieldId){
                                        //方式1：定义树节点名称赋值到表单ID域
                                        if(parentLayer.find('[name='+current.formFieldId+']')){
                                            parentLayer.find('[name='+current.formFieldId+']').val(treeCurrentNodeMap[param['treeDataSet']['getModuleName']][current.treeNodeId]);
                                        }
                                    }else if(current){
                                        //方式2：树节点名称与表单ID一致时。
                                        if( parentLayer.find('[name='+current+']')){
                                            if(treeCurrentNodeMap!=={} && treeCurrentNodeMap[param['treeDataSet']['getModuleName']] && treeCurrentNodeMap[param['treeDataSet']['getModuleName']][current]){
                                                parentLayer.find('[name='+current+']').val(param['treeDataSet']['mathAdd']?param['treeDataSet']['mathAdd']+treeCurrentNodeMap[param['treeDataSet']['getModuleName']][current]:treeCurrentNodeMap[param['treeDataSet']['getModuleName']][current]);
                                            }else{
                                                parentLayer.find('[name='+current+']').val(0);
                                            }
                                        }else{
                                            parentLayer.find('[name='+current+']').val(0);
                                        }
                                    }
                                    */
                                });
                            }

                        };
                        if(parentLayer.find('#isDone').val()==='yes'){

                            callBack();
                        }else {
                            //定时请求
                            var time22 = setInterval(function () {

                                if(parentLayer.find('#isDone').val()==='yes'){
                                    callBack();
                                    clearInterval(time22);
                                }

                            }, 1000);
                        }

                    }

                    //按钮事件注册


                    //代码段执行的话
                    /*    if(param.successBack){
                            eval(param.successBack);
                        }*/
                }
            });
            if(param.isFull){
                top.layer.full(layerDom);
            }

        },

        //面板
        card:function(obj){
            var defaultParams={
                module:'',
                area:null,
                empty:false,
                done:function () {

                }
            };

            var param=$.extend({},defaultParams,obj);

            var theme;
            if(param.theme==1){
                theme='';
            }else if(param.theme==2){
                theme='custom-title';
            }else{
                theme='';
            }

            var parent= $('#module_'+param.module);
            var template='<div class="layui-card">';

            template+=' <div class="layui-card-header  layui-card-header-custom'+theme+' "><span><i></i>'+param.title+'</span></div>';
            template+='<div class="layui-card-body"></div>';
            template+='</div>';

            if(param.area){
                if(param.empty){
                    parent.find('.content-box').find(param.area).empty().append(template);
                }else{
                    parent.find('.content-box').find(param.area).append(template);
                }
            }else{
                if(param.empty){
                    parent.find('.content-box').empty().append(template);
                }else{
                    parent.find('.content-box').append(template);
                }
            }
        },

        //手风琴
        accordion:function(obj){
            var defaultParams={
                module:'',//导入的模块区域
                area:null,//表示该模块下的某一个区域，如果没有这个值，则导入module   支持写入 #xxx .xxx
                empty:false,
                header:[],
                isSingle:false,//表示可随意折叠展开，true 是，
                done:function () {

                }
            };

            var param=$.extend({},defaultParams,obj);

            var theme;
            if(param.theme==1){
                theme='';
            }else if(param.theme==2){
                theme='layui-tab-brief';
            }else if(param.theme==3){
                theme='layui-tab-card'
            }else{
                theme='';
            }

            var parent= $('#module_'+param.module);
            var template='<div class="layui-collapse '+theme+'" id="accordion_'+param.module+'" '+(param.isSingle?'lay-accordion':'')+'>';

            if(param.header && param.header.length>0){

                $.map(param.header,function (item, index) {
                    var show;

                    if(item.isShow){
                        show='layui-show'
                    }
                    template+='<div class="layui-colla-item">' +
                        '<h2 class="layui-colla-title">'+item.text+'</h2>' +
                        '<div class="layui-colla-content '+show+'"></div>' +
                        '</div>';
                });

                template+='</ul>';
            }


            template+='</div>';

            if(param.area){
                if(param.empty){
                    parent.find('.content-box').find(param.area).empty().append(template);
                }else{
                    parent.find('.content-box').find(param.area).append(template);
                }
            }else{
                if(param.empty){
                    parent.find('.content-box').empty().append(template);
                }else{
                    parent.find('.content-box').append(template);
                }
            }
            if(param.done){
                param.done();
            }

            element.init();
        },

        //上传组件
        upload: function (setObj) {
            var defaultParams = {
                type: "multiFile",//single more
                name: '',
                url: "dfsmgr/file/fileUpload",
                // resId:'name_resId'
                // accept: 'file',
                // multiple: true,
                auto: true,
                toModule: []
            };
            var param = $.extend({}, defaultParams, setObj);


            var btnOperArea = $('.btnOper' + param.name);

            //多文件列表示例
            if (param.type === 'multiFile') {

                var html = '<div class="layui-upload-list">' +
                    '<table class="layui-table">' +
                    '<thead>' +
                    '<tr><th>文件名</th><th>状态</th><th>操作</th></tr>' +
                    '</thead>' +
                    '<tbody id="tableList' + param.name + '"></tbody>' +
                    '</table>' +
                    '</div>';


                //如果 bindAction不存在 则显示默认开始上传按钮
                if (!param.bindAction) {
                    html += '<button type="button" class="layui-btn" id="listAction' + param.name + '">开始上传</button>';
                }

                btnOperArea.empty().html(html);


                if (param.data) {
                    for (var whereItemParas in param.data) {
                        if (param.data[whereItemParas].indexOf('name_') > -1) {
                            var nameValue = param.data[whereItemParas].substring(5);
                            //获取对应的name value值
                            var val;

                            if ($('[name=' + nameValue + ']').val()) {
                                val = $('[name=' + nameValue + ']').val();
                            } else if ($("#rowDataLine", parent.document).val()) {
                                var lineData = JSON.parse($("#rowDataLine", parent.document).val());
                                val = lineData[nameValue]
                            }

                            param.data[whereItemParas] = val;
                        } else {


                        }
                    }
                    common.fetchGet("/dfsmgr/file/getFileByResId?id=" + param.data[whereItemParas], function (res) {
                        btnOperArea.show();
                        if (res.success && res.list) {
                            var moduleDom = $('#tableList' + param.name);
                            moduleDom.html('');
                            var tbody = moduleDom[0];
                            for (var i = 0; i < res.list.length; i++) {
                                var row = toolHandle.createFileRow(res.list[i].fiName + '.' + res.list[i].fiSuffix, res.list[i].fiId, 'uploaded', res.list[i]);
                                tbody.appendChild(row);
                            }
                            $(tbody).find('.layui-btn-danger').on('click', function (e) {
                                var fiId = $(e.target).parent().parent().attr("id");
                                common.fetchDelete("/dfsmgr/file/deleteById?id=" + fiId, function (res) {
                                    if (res.success && res.object) {
                                        $("#" + fiId).remove();
                                        layer.msg("删除成功!");
                                    }
                                    return false
                                }, function (error) {
                                    if (error.errorText) {
                                        top.layer.msg(error.errorText);
                                    } else if (error.resultMessage) {
                                        top.layer.msg(error.resultMessage);
                                    }
                                    return false
                                });
                                return false

                            });
                            $(tbody).find('.btn-download').off().on('click', function (e) {
                                var fiId = $(e.target).parent().parent().attr("id");
                                var src = "/dfsmgr/file/filesDownload?fid=" + fiId;
                                window.open(src);
                                return false
                            });
                        }
                    }, function () {
                        callback([])
                    });
                }


                var demoListView = $('#tableList' + param.name);

                var url;

                if (param.resId) {
                    if (param.resId.indexOf('name_') > -1) {
                        var resIdName = param.resId.substring(5);
                        url = global.baseUrl + param.url + '?resId=' + $('[name=' + resIdName + ']').val()
                    }

                } else {
                    url = global.baseUrl + param.url
                }

                var uploadListIns = upload.render({
                    elem: '[name=' + param.name + ']',
                    url: url,
                    method: param.method ? param.method : 'post',
                    accept: 'file',
                    multiple: true,
                    auto: param.auto,
                    data: param.data ? param.data : {},
                    bindAction: param.bindAction ? param.bindAction : '#listAction' + param.name,
                    choose: function (obj) {
                        btnOperArea.show();
                        var files = this.files = obj.pushFile(); //将每次选择的文件追加到文件队列
                        //读取本地文件
                        obj.preview(function (index, file, result) {
                            var tr = $(['<tr id="upload-' + index + '">'
                                , '<td>' + file.name + '</td>'
                                // , '<td>' + (file.size / 1014).toFixed(1) + 'kb</td>'
                                , '<td>等待上传</td>'
                                , '<td>'
                                , '<button class="layui-btn layui-btn-xs demo-reload layui-hide">重传</button>'
                                , '<button class="layui-btn layui-btn-xs layui-btn-danger demo-delete">删除</button>'
                                , '</td>'
                                , '</tr>'].join(''));

                            //单个重传
                            tr.find('.demo-reload').on('click', function () {
                                obj.upload(index, file);
                            });

                            //删除
                            tr.find('.demo-delete').on('click', function () {
                                delete files[index]; //删除对应的文件
                                tr.remove();
                                uploadListIns.config.elem.next()[0].value = ''; //清空 input file 值，以免删除后出现同名文件不可选
                            });

                            demoListView.append(tr);
                        });
                    }
                    , done: function (res, index, upload) {
                        if (res.resultCode === "0") { //上传成功
                            var tr = demoListView.find('tr#upload-' + index), tds = tr.children();
                            var delBtn = tr.find('.demo-delete');
                            var fiId = res.list[0].fiId;
                            tr.attr('class', fiId);
                            tds.eq(1).html('<span class="green">上传成功</span>');
                            delBtn.attr('fiId', fiId);
                            delBtn.off("click");
                            delBtn.on("click", function () {
                                common.fetchDelete("/dfsmgr/file/deleteById?id=" + fiId, function (res) {
                                    if (res.success && res.object) {
                                        $("#" + fiId).remove();
                                        layer.msg("删除成功!");
                                    }
                                });
                                return false;
                            });

                            tds.eq(2).append('<button class="layui-btn layui-btn-xs btn-download">下载</button>');
                            tr.find('.btn-download').off().on('click', function () {
                                var src = "/dfsmgr/file/filesDownload?fid=" + fiId;
                                window.open(src);

                                return false
                            });

                            return delete this.files[index]; //删除文件队列已经上传成功的文件
                        }
                        this.error(index, upload);
                    }
                    , error: function (index, upload) {
                        var tr = demoListView.find('tr#upload-' + index)
                            , tds = tr.children();
                        tds.eq(1).html('<span style="color: #FF5722;">上传失败</span>');
                        tds.eq(2).find('.demo-reload').removeClass('layui-hide'); //显示重传
                    }
                });
            }
            //单文件上传
            if (param.type === 'singleFile') {

            }
        },


        //echart
        chart: function (obj) {
            var defaultParams = {
                module: '', //模块导入区域
                titleSet: { //标题设置
                    theme: "0",//主题 0 表示无 1表示默认
                    name: "",//标题名
                    subName: "",//辅助标题
                    helpTip: "" //提示
                },
                area: null,
                option: {},
                // extendOption:{
                //   url:"",
                //   method:"post",
                //   where:null
                //   respond:'list'
                // },
                height: "300px"
            };

            var params = $.extend({}, defaultParams, obj);

            moduleParams[params.module] = params;
            var parent = $('#module_' + params.module);

            var template = '<div class="layui-card">';

            //模块标题区域
            template += toolHandle.titleSet(params.titleSet, template);


            template += '<div class="layui-card-body">';

            template += '<div class="chartArea"><div style="width: 100%;height: ' + params.height + ';" id="chart_' + params.module + '"></div></div>';

            template += '</div>';
            template += '</div>';

            if (params.area && params.area != "''") {
                parent.find('.content-box').find(params.area).empty().append(template);
            } else {
                parent.find('.content-box').empty().append(template);
            }

            //echart 配置导入
            $('#chart_' + params.module).css('width', $('#chart_' + params.module).parent().parent().actual('width') + 'px');

            chartMap[params.module] = echarts.init(document.getElementById('chart_' + params.module), 'custom');
            if (params.extendOption) {
                common.fetch(params.extendOption.url, params.extendOption.method, params.extendOption.where, function (res) {

                    toolHandle.chartDataSet(res, params);

                }, function (error) {
                    if (error.errorText) {
                        top.layer.msg(error.errorText);
                    } else if (error.resultMessage) {
                        top.layer.msg(error.resultMessage);
                    }
                });
            } else {
                chartMap[params.module].setOption(params.option);
            }
        },

        //组件注册
        pluginReg:function (prop) {
            switch (prop.plugin) {

                case 'tree':  //tree组件模块

                    custom.tree($.extend({},prop,{module:prop.name}));

                    break;

                case 'table':  //table组件模块

                    custom.table($.extend({},prop,{module:prop.name}));

                    break;

                case 'form': //一般form组件模块

                    custom.form($.extend({},prop,{module:prop.name}));

                    break;

                case 'searchTable':  //表格搜索

                    custom.tableSearch($.extend({},prop,{module:prop.name}));

                    break;

                case 'upload':  //上传

                    // custom.upload($.extend({},prop,{module:prop.name}));

                    break;


                case 'chart':  //echart 图表区域
                    custom.chart($.extend({}, prop, {module: prop.name}));

                    break;

                case 'tab':  //选项卡

                    custom.tab($.extend({},prop,{module:prop.name}));

                    break;

                case 'card':  //面板

                    custom.card($.extend({},prop,{module:prop.name}));

                    break;

                case 'accordion':  //手风琴

                    custom.accordion($.extend({},prop,{module:prop.name}));

                    break;

            }
        },

        //数据字典获取
        dictInit:function(elem,url,selVal,selText, selectedVal){
            var option = {
                elem: elem,
                url: url,
                method: 'get',
                responseList: 'list',
                optionText: selText,
                optionValue: selVal,
                success: function(obj) {
                    $(elem).val(selectedVal);
                    form.render("select");
                }
            };
            common.selectDataSet(option);
        },
        //表格数据字典配置样式时封装处理
        dataTemplet_spanStyle:function(dataTemplet){

            var startSpan = '<span>';
            var endSpan = '</span>';
            var spanStyle = '';
            var spanClass = '';
            if(dataTemplet.spanStyle){
                spanStyle = 'style=\"' + dataTemplet.spanStyle + "\"";
            }
            if(dataTemplet.spanClass){
                spanClass = 'class=\"' + dataTemplet.spanClass + "\"";
            }
            startSpan = '<span ' + spanStyle + ' ' + spanClass + '>';
            if (dataTemplet.title) {
                return startSpan + dataTemplet.title + endSpan;
            } else if (dataTemplet.spanHtml) {
                return startSpan + dataTemplet.spanHtml + endSpan;
            } else {
                return startSpan + endSpan;
            }

        },

        //publicEvent 公共导入方法

        publicEvent: function () {

        }

    };

    exports('custom', custom);
});
