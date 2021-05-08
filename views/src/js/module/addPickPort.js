/**
 @Name：添加端口
 @Author：LinCHun
 @updateTime : 2019-07-24

 */
layui.config({
    base: '../../../src/js/',
    version: new Date().getTime()
}).extend({
    treeGrid:'lib/treeGrid',
}).use(['jquery', 'layer', 'table', 'form', 'laytpl', 'common', 'element', 'treeGrid'], function () {
    var table = layui.table;
    var form = layui.form;
    var common = layui.common;
    var element = layui.element;
    var treeGrid = layui.treeGrid;
    var $=layui.jquery;
    layer=layui.layer;

    common.themeSet();
    var editData;
    var editDataPublic;
    //Hash地址的定位
    var baseUrl = '../../../';
    // var newArray=common.jsonToArray(nodes,'childList');
//渲染treeGrid对象
    var newArray=[];
    newArray_reqJson={
        newArray:newArray,
        tableId:null
    };
    newArray_reqXml={
        newArray:newArray,
        tableId:null
    };
    newArray_resJson={
        newArray:newArray,
        tableId:null
    };
    newArray_resXml={
        newArray:newArray,
        tableId:null
    };
    newArray_getUrl={
        newArray:newArray,
        tableId:null
    };
    newArray_rest={
        newArray:newArray,
        tableId:null
    };
    var htmlHandle={
        selectDSType:function(selVal){
            var html="";
            if(selVal=="fixed"){
                html=' <input type="text" name="daapValue" id="daapValue_input" placeholder="请输入固定值"  autocomplete="off" class="layui-input">';
            }
            else if(selVal=="time"){
                html =
            '<select name="daapValueFromSystemTime" lay-filter="daapValue_select" id="daapValue_input">'+
                // '<option value="">请选择系统时间</option>'+
                '<option value="curDatetime">当前时间</option>'+
                '<option value="curDate">当前日期</option>'+
                '<option value="minTimeOfCurDay">当日最早时间</option>'+
                '<option value="maxTimeOfCurDay">当日最晚时间</option>'+
                '<option value="curMonth">当前月份</option>'+
                '<option value="minTimeOfCurMonth">当月最早时间</option>'+
                '<option value="maxTimeOfCurMonth">当月最晚时间</option>'+
                '<option value="firstDayOfCurMonth">当月第一天</option>'+
                '<option value="lastDayOfCurMonth">当月最后一天</option>'+
                '<option value="curTimestamp">当前时间戳</option>'+
                '<option value="curYear">当前年份</option>'+
            '</select>';
            }
            else if(selVal=="sql"){
                html='<textarea name="daapValueFromSql" id="daapValue_input" placeholder="请输入sql语句" class="layui-textarea"></textarea>'
            }
            else{
                html=' <input type="text" name="daapValue" id="daapValue_input" placeholder="请先选择数据来源"  autocomplete="off" class="layui-input" disabled>';
            }

            return html;
        },
        selectDSrender:function($daapValue,value){
            var html=this.selectDSType(value);
            $daapValue.empty().html(html);
            if(value=='sql'){
                if(!$daapValue.hasClass('margin-left0')){
                    $daapValue.addClass('margin-left0').prev().addClass('width100');
                }
                $daapValue.prev().text('SQL脚本');
                $daapValue.parent().parent().siblings('.hide').hide();
            }
            else{
                if($daapValue.hasClass('margin-left0')){
                    $daapValue.removeClass('margin-left0').prev().removeClass('width100');
                }
                if(value=='time'){
                    $daapValue.prev().text('时间类型');
                    $daapValue.parent().parent().siblings('.hide').show();
                }
                else{
                    $daapValue.prev().text('参数值');
                    $daapValue.parent().parent().siblings('.hide').hide();
                }
            }
            form.render('select');
        },
        selectPTrender:function($daapValue,value){
            if(value=='sql'){
                if(!$daapValue.hasClass('margin-left0')){
                    $daapValue.addClass('margin-left0').prev().addClass('width100');
                }
                $daapValue.prev().text('SQL脚本');
                $daapValue.parent().parent().siblings('.hide').hide();
            }
            else{
                if($daapValue.hasClass('margin-left0')){
                    $daapValue.removeClass('margin-left0').prev().removeClass('width100');
                }
                if(value=='time'){
                    $daapValue.prev().text('时间类型');
                    $daapValue.parent().parent().siblings('.hide').show();
                }
                else{
                    $daapValue.prev().text('参数值');
                    $daapValue.parent().parent().siblings('.hide').hide();
                }
            }
            form.render('select');
        },
    }
    var treeGridEventHandle={
        getData:function(tableId){
            var data=treeGrid.cache[tableId]['data'];
            return data.list;
        },
        render:function(newArrayObj){
            treeGrid.render({
                id:newArrayObj.tableId
                ,elem: '#'+newArrayObj.tableId
                ,data: newArrayObj.newArray
                ,cellMinWidth: 260
                ,idField:'daapId'//必須字段
                ,treeId:'daapId'//树形id字段名称
                ,treeUpId:'daapPid'//树形父id字段名称
                ,treeShowName:'daapName'//以树形式显示的字段
                // ,heightRemove:[".dHead",10]//不计算的高度,表格设定的是固定高度，此项不生效
                ,height: null
                ,isFilter:false
                ,iconOpen:false//是否显示图标【默认显示】
                // , where: {nodeStatus:mainNodeStatus}
                ,isOpenDefault:true//节点默认是展开还是折叠【默认展开】
                ,loading:true
                // ,toolbar: true
                ,  toolbar: '#tableToolBar'
                ,isPage:false
                ,cols: [
                    [
                        {field: 'daapName', title: '参数名称', edit: 'text'},
                        {
                            field: 'daapRequired', title: '是否必填',
                            templet: function(rowData) {
                                return (rowData["daapRequired"])==="1"?'是':'否';
                            }
                      },
                      {field: 'ggMemo', title: '说明',edit:'text'},
                      {field:'',width:200,title: '操作', align:'center', toolbar:'#tableOper',fixed: 'right'}
                    ]]
                ,parseData:function (res) {//数据加载后回调
                    return res;
                }
            });
        },
        add:function(pObj,newArrayObj){
            var pdata=pObj?pObj.data:null;
            var param={};
            //获取daaPid
            if(pdata){
                pObj.data.daapValueType="object";
                 treeGridEventHandle.edit(pObj,newArrayObj);
                 param.daapPid=pdata.daapId;
            }
            else{
                // param.daapPid=null;
                param.daapPid="-1";
            }
            param.daapId=common.uuid();
            param.daapName='请输入参数名称';
            // param.cfId=common.uuid();//使用随机生成的目录id
            param.cfId=null;//使用随机生成的目录id
            param.daapRequired="1";//默认非必填
            param.daapValueType="string";//默认参数类型
            // param.daapValueT="默认参数值";//默认参数值
            param.daapValueSource=null;//默认数据来源
            param.ggMemo="默认说明";//默认说明
            param.daapXmlNodePropertyJSON=null;//默认节点参数属性键值对

            treeGrid.addRow(newArrayObj.tableId,pdata?pdata[treeGrid.config.indexName]+1:0,param);
            newArrayObj.newArray=treeGridEventHandle.getData(newArrayObj.tableId);
            return false;//必须要加 否则数据无法保存
        },
        del:function(pObj,newArrayObj){
            data=pObj.data;
            var newData1=treeGridEventHandle.getData(newArrayObj.tableId);
            layer.confirm("你确定删除数据吗？如果存在下级节点则一并删除，此操作不能撤销！", {icon: 3, title:'提示'},
            function(index){//确定回调
                treeGrid.delRow(newArrayObj.tableId,data);
                var newData2=treeGridEventHandle.getData(newArrayObj.tableId);

                if(newData1.length!=newData2.length){

                    layer.close(index);
                    newArrayObj.newArray=treeGridEventHandle.getData(newArrayObj.tableId);
                    return false;//必须要加 否则数据无法保存
                }
                // pObj.del();
            },function (index) {//取消回调
               layer.close(index);
            }
        );
        },
        edit:function(pObj,newArrayObj){
            var data=pObj.data;
            var index_edit=layer.open({
                offset: '100px',
                title: '编辑',
                maxmin: false,
                type: 1,//页面层
                area: ['700px','600px'],//高度自适应
                shadeClose: false,
                content: $('.tplLayer').html(),//加载该区域的html
                // btn:['保存','取消'],
                success: function (obj) {
                    $(obj.selector).find('input[name=daapName]').val(data.daapName);
                    $(obj.selector).find('select[name=daapValueType]').val(data.daapValueType);
                    $(obj.selector).find('select[name=daapRequired]').val(data.daapRequired);
                    $(obj.selector).find('textarea[name=ggMemo]').val(data.ggMemo);
                    var $reqXmlParam=$(obj.selector).find('#reqXmlParam');
                    var $resBindIndexParam=$(obj.selector).find('#resBindIndexParam');
                    // 请求参数Xml中需要显示参数属性
                    if(newArrayObj.tableId==="reqXmlParamTable"){
                        if(data.daapXmlNodePropertyJSON!=null){
                            var html='';
                            var object=data.daapXmlNodePropertyJSON;
                            for(var key in object){
                                html+= '<div class="layui-row layui-col-space15 reqXmlParam">\n' +
                        '       <div class="layui-col-xs4">\n' +
                        '          <input class="layui-input paramKey" type="text" value='+key+'>\n' +
                        '        </div>\n' +
                        '       <div class="layui-col-xs4">\n' +
                        '           <input class="layui-input paramValue" type="text" value='+object[key]+'>\n' +
                        '       </div>\n' +
                        '       <div class="layui-col-xs4">\n' +
                        '            <i class="fa fa-plus-square formLineAdd add1"></i>\n' +
                                    '             <i class="icon iconfont icon-button-sc-2 formLineDelete delete1"></i>\n' +
                        '        </div>\n' +
                        '     </div>'
                            }
                             $reqXmlParam.find('.reqXmlParam').remove();
                             $reqXmlParam.append(html);
                        }
                       $reqXmlParam.show();
                    }
                    else{
                       $reqXmlParam.hide();
                    }
                    var $daapValueSource= $(obj.selector).find('#daapValueSource_req');
                    // 返回参数
                    if(newArrayObj.tableId==="resJsonParamTable"||newArrayObj.tableId==="resXmlParamTable"){
                       $resBindIndexParam.show();//需要显示关联指标,没有数据来源和参数值
                        $(obj.selector).find('[name=daapResDataNode]').val(data.daapResDataNode);
                        // $(obj.selector).find('[name=cfName]').attr({
                        //                     'data-cfid':data.cfId,
                        //                     'data-cfcode':data.cfCode
                        //                 }).val(data.cfName);
                        $(obj.selector).find('[name=cfId]').val(data.cfId);
                        $daapValueSource.hide();//隐藏数据源
                    }
                    else{//请求参数，getURl,rest参数
                        var $daapValueType= $(obj.selector).find('#daapValueType_edit');
                        var $daapValue= $(obj.selector).find('#daapValue_edit');
                    //初始化表格
                        htmlHandle.selectDSrender($daapValue,data.daapValueSource);
                        form.on('select(daapValueSource_edit)', function(data){
                            htmlHandle.selectDSrender($daapValue,data.value);
                        });
                        if(data.children.length>0){
                            $daapValueSource.hide();
                            var html=
                                    // '<option value="">请选择</option>\n'+
                                    ' <option value="object">object</option>\n'+
                                    ' <option value="array">array</option>'
                            $daapValueType.empty().html(html);
                            form.render('select');

                        }
                        else{
                            if(data.daapValueType=="object"||data.daapValueType=="array"||data.daapValueType==""){
                                $daapValueSource.hide();
                            }
                            else{
                                $daapValueSource.show();
                                $(obj.selector).find('select[name=daapValueSource]').val(data.daapValueSource);
                                if(data.daapValueSource=='sql'){
                                    $(obj.selector).find('#daapValue_input').val(data.daapValueFromSql);
                                }
                                else if(data.daapValueSource=='time'){
                                    $(obj.selector).find('#daapValue_input').val(data.daapValueFromSystemTime);
                                    $(obj.selector).find('#daapValueTimeFormat_edit').val(data.daapValueTimeFormat);
                                }
                                else{
                                    data.daapValueSource=null;
                                    $(obj.selector).find('#daapValue_input').val(data.daapValue);
                                }
                            }
                        }
                        form.on('select(daapValueType_edit)', function(data){
                            if(data.value=="object"||data.value=="array"||data.daapValueType==" "){
                                 data.daapValueSource=null;
                                $daapValueSource.hide();
                            }
                            else{
                                $daapValueSource.show();
                            }
                            form.render('select');
                        });

                       $resBindIndexParam.hide();//隐藏关联指标
                    }
                    //请求参数XML--参数属性名-属性值
                   $reqXmlParam.off('click', '.add1');
                   $reqXmlParam.on('click', '.add1', function () {
                       var html =
                        '    <div class="layui-row layui-col-space15 reqXmlParam">\n' +
                        '       <div class="layui-col-xs4">\n' +
                        '          <input class="layui-input paramKey" type="text">\n' +
                        '        </div>\n' +
                        '       <div class="layui-col-xs4">\n' +
                        '           <input class="layui-input paramValue" type="text">\n' +
                        '       </div>\n' +
                        '       <div class="layui-col-xs4">\n' +
                        '            <i class="fa fa-plus-square formLineAdd add1"></i>\n' +
                           '             <i class="icon iconfont icon-button-sc-2 formLineDelete delete1"></i>\n' +
                        '        </div>\n' +
                        '     </div>';
                        $(this).parent().parent().parent().append(html);
                        form.render('select');
                        return false;
                    });
                    // 选择关联指标
                    $(obj.selector).find('#bindIndex-choose').off().on('click', function () {
                        var ciId=$('#baseInfoForm input[name="ciName"]').attr('data-ciId');//接口绑定目录
                        if(!ciId){
                            layer.msg('未绑定有效目录，请重新绑定');
                            return false;
                        }
                        else{
                            var bindIndex = layer.open({
                                offset: '10px',
                                title: '接口方法',
                                maxmin: false,
                                type: 1,//页面层
                                area: ['580px','580px'],//高度自适应
                                content: $('.bindIndex').html(),//加载该区域的html
                                success: function (obj) {
                                    table.render(common.tableInitParams({
                                        elem: $(obj.selector).find('#bindIndex'),
                                        url: baseUrl + '/sysmgr/indicator/indicatorPagination',
                                        where:{
                                            ciId:ciId
                                        },
                                        method: 'post',
                                        toolbar: true,
                                        cols: [
                                            [
                                                {"field": "cfId",  "sort": true, "title": "关联指标id"},
                                                {"field": "cfName",  "sort": true, "title": "指标名称"},
                                                {"field": "cfCode",  "sort": true, "title": "指标编码"}
                                            ]
                                        ],
                                        height: 450
                                    }));

                                    //监听行双击事件
                                    table.on('rowDouble(bindIndex)', function (obj) {
                                        //写入值
                                        var data = obj.data;

                                        // $('[name=cfName]').attr({
                                        //     'data-cfid':data['cfId'],
                                        //     'data-cfcode':data['cfCode']
                                        // }).val(data['cfName']);
                                        $('[name=cfId]').val(data.cfId);

                                        layer.close(bindIndex);
                                    });
                                }
                            });
                        }
                    });
                    //删除
                   $reqXmlParam.off('click', '.delete1');
                   $reqXmlParam.on('click', '.delete1', function () {
                        $(this).parent().parent().remove();
                    });
                    $(obj.selector).find('.close-btn').on('click',function(){
                        layer.close(index_edit);
                        return false;
                    });
                    form.render('select');
                    // 保存请求信息
                    form.on('submit(formSavue_reqInfo)', function (obj) {
                        data.daapName=obj.field.daapName;
                        data.daapValueType=obj.field.daapValueType;
                        data.daapRequired=obj.field.daapRequired;
                        data.ggMemo=obj.field.ggMemo;
                        // 返回参数
                        if(newArrayObj.tableId==="resJsonParamTable"||newArrayObj.tableId==="resXmlParamTable"){
                            data.daapResDataNode=obj.field.daapResDataNode;//需要显示关联指标
                            // data.cfId= $('[name=cfName]').attr( 'data-cfid');
                            data.cfId= $('[name=cfId]').val();
                            if(data.daapResDataNode==""||data.cfId==""){
                                if(data.daapResDataNode==""&&data.cfId==""){
                                    data.daapResDataNode=null;
                                    data.cfId=null;
                                }
                                else{
                                    layer.msg('数据节点路径和关联指标项必须同时为空或同时不为空');
                                    return false;
                                }
                            }
                        }
                        else{//请求参数
                            data.daapValueSource=obj.field.daapValueSource;
                            if(data.daapValueType==="string"||data.daapValueType=="boolean"||data.daapValueType=="number"){
                                if(!data.daapValueSource){
                                    layer.msg('请设置参数数据来源');
                                    return false;
                                }
                                else{
                                    if(data.daapValueSource=='sql'){
                                    data.daapValueFromSql=obj.field.daapValueFromSql;
                                     if(!data.daapValueFromSql){
                                        layer.msg('请输入SQL脚本');
                                        return false;
                                     }
                                    }
                                    else if(data.daapValueSource=='time'){
                                        data.daapValueFromSystemTime=obj.field.daapValueFromSystemTime;
                                        data.daapValueTimeFormat=obj.field.daapValueTimeFormat;
                                        if(!data.daapValueTimeFormat){
                                        layer.msg('请选择自定义时间格式');
                                        return false;
                                        }
                                    }
                                    else{
                                        data.daapValue=obj.field.daapValue;
                                        if(!data.daapValue){
                                        layer.msg('请设置参数值');
                                        return false;
                                        }
                                    }
                                }
                            }
                            else{

                            }
                            if(newArrayObj.tableId==="reqXmlParamTable"){
                                //请求参数 xml--参数属性名称-参数属性值
                                daapXmlNodePropertyJSON={};
                                var len=$reqXmlParam.find('.reqXmlParam').length;
                                for (var i = 0; i < len; i++) {
                                    var key=$reqXmlParam.find('.reqXmlParam').eq(i).find('.paramKey').val();
                                    var value=$reqXmlParam.find('.reqXmlParam').eq(i).find('.paramValue').val();
                                    if(key!=""&&value!=""){//不为空保存
                                         daapXmlNodePropertyJSON[key]=value;
                                    }
                                    // if ($('.reqHeadForm').eq(i).val()) {
                                        // reqData.requestHeadList.push({
                                        //     "daahName": $('.reqHeadForm').eq(i).find('[name="daahName"]').val(),
                                        //     "daahRequired": $('.reqHeadForm').eq(i).find('[name="daahRequired"]').val(),
                                        //     "daahValue": $('.reqHeadForm').eq(i).find('[name="daahValue"]').val()
                                        // });
                                    // }

                                }
                                data.daapXmlNodePropertyJSON=daapXmlNodePropertyJSON;
                                // reqData.daapXmlNodePropertyJSON=daapXmlNodePropertyJSON;
                                console.log(daapXmlNodePropertyJSON);
                            }
                        }
                        layer.confirm('您确定要保存?', {icon: 3, title: '提示', offset: '150px'}, function (index) {
                            layer.close(index);
                            treeGrid.updateRow(newArrayObj.tableId,data);
                            layer.close(index_edit);
                            newArrayObj.newArray=treeGridEventHandle.getData(newArrayObj.tableId);
                            return false;//必须要加 否则数据无法保存
                        });
                        return false;
                    });
                },
            });

        },
        print:function(newArrayObj){
            console.log(treeGrid.cache[newArrayObj.tableId]);
            var loadIndex=layer.msg("对象已打印，按F12，在控制台查看！", {
                time:3000
                ,offset: 'auto'//顶部
                ,shade: 0
            });
        },
        openAll:function(newArrayObj){
            var treedata=treeGrid.getDataTreeList(newArrayObj.tableId);
            treeGrid.treeOpenAll(newArrayObj.tableId,!treedata[0][treeGrid.config.cols.isOpen]);
        },
        tool:function(newArrayObj){
            treeGrid.on('tool('+newArrayObj.tableId+')',function (obj) {
                switch(obj.event) {
                    case 'del':  treeGridEventHandle.del(obj,newArrayObj);break;
                    case 'add':  treeGridEventHandle.add(obj,newArrayObj);break;
                    case 'edit': treeGridEventHandle.edit(obj,newArrayObj);break;
                    default:break;
                }
            });
        },
        toolBar:function(newArrayObj){
            treeGrid.on('toolbar('+newArrayObj.tableId+')',function (obj) {
                switch(obj.event) {
                    case 'addLine1': treeGridEventHandle.add(null,newArrayObj);break;
                    case 'print': treeGridEventHandle.print(newArrayObj);break;
                    case 'openAll': treeGridEventHandle.openAll(newArrayObj);break;
                    default:break;
                }
            });
        },

    }
    var eventHandle = {
        domEvent: function () {
            //选择图标
            $("#icon-choose").on('click', function () {
                common.iconLayerSelect('input[name="smIcon"]')
            });
            //绑定目录
            $('#port-choose').off().on('click', function () {
                var methodTmp = layer.open({
                    offset: '10px',
                    title: '接口方法',
                    maxmin: false,
                    type: 1,//页面层
                    area: ['580px','580px'],//高度自适应
                    content: $('.methodTmp').html(),//加载该区域的html
                    success: function (obj) {
                        //公共方法配置
                        table.render(common.tableInitParams({
                            elem: $(obj.selector).find('#methodTmp'),
                            // url: baseUrl + 'sysmgr/catalogue/pageQueryUnbindHeadCatalogue',
                            url: baseUrl + 'sysmgr/catalogue/cataloguePagination',
                            method: 'post',
                            toolbar: true,
                            cols: [
                                [
                                //  {"field": "ciId",  "sort": true, "title": "目录id"},
                                    {"field": "ciName",  "sort": true, "title": "目录名称"},
                                    {"field": "ciCode",  "sort": true, "title": "目录编码"}
                                ]
                            ],
                            height: 450,
                            where:{
                                alreadyBindTable:'1'
                            },
                        }));

                        //监听行双击事件
                        table.on('rowDouble(methodTmp)', function (obj) {
                            //写入值
                            var data = obj.data;

                            $('[name=ciName]').attr({
                                'data-ciid':data['ciId'],
                                'data-cicode':data['ciCode']
                            }).val(data['ciName']);

                            layer.close(methodTmp);
                        });
                    }
                });
            });
             //请求参数
            element.on('tab(reqInfoTab)',function (obj) {
                if(obj.index===1){//请求参数
                    var formRowType=$('#reqBodyForm').find('input:checked').val();
                    if(formRowType==="xml"){
                        newArray_reqXml.tableId='reqXmlParamTable';
                        treeGridEventHandle.render(newArray_reqXml);
                        treeGridEventHandle.tool(newArray_reqXml);
                        treeGridEventHandle.toolBar(newArray_reqXml);
                    }
                    else{
                        newArray_reqJson.tableId='reqJsonParamTable';
                        treeGridEventHandle.render(newArray_reqJson);
                        treeGridEventHandle.tool(newArray_reqJson);
                        treeGridEventHandle.toolBar(newArray_reqJson);
                    }
                    form.on('radio(form-row)', function (data) {
                        if(data.value === 'json'){
                            newArray_reqJson.tableId='reqJsonParamTable';
                            treeGridEventHandle.render(newArray_reqJson);
                            treeGridEventHandle.tool(newArray_reqJson);
                            treeGridEventHandle.toolBar(newArray_reqJson);
                            $('.json-box').show();
                            $('.xml-box').hide();
                        } else{
                            newArray_reqXml.tableId='reqXmlParamTable';
                            treeGridEventHandle.render(newArray_reqXml);
                            treeGridEventHandle.tool(newArray_reqXml);
                            treeGridEventHandle.toolBar(newArray_reqXml);
                            $('.xml-box').show();
                            $('.json-box').hide();
                        }
                    });
                }
                else if(obj.index===2){//GET/URl参数
                    newArray_getUrl.tableId='getUrlParamTable';
                    treeGridEventHandle.render(newArray_getUrl);
                    treeGridEventHandle.tool(newArray_getUrl);
                    treeGridEventHandle.toolBar(newArray_getUrl);
                }
                else if(obj.index===3){//REST参数
                    newArray_rest.tableId='restParamTable';
                    treeGridEventHandle.render(newArray_rest);
                    treeGridEventHandle.tool(newArray_rest);
                    treeGridEventHandle.toolBar(newArray_rest);
                }
                else{//if else if 需关闭 否则treeGrid渲染会有问题

                }
            });
            var layid = location.hash.replace(/^#reqInfoTab=/, '');
            element.tabChange('reqInfoTab', layid);

            //响应参数
            element.on('tab(resInfoTab)',function (obj) {
                if(obj.index===1){//返回参数
                    var formRowType=$('#resBodyForm').find('input:checked').val();
                    if(formRowType==="xml"){
                        newArray_resXml.tableId='resXmlParamTable';
                        treeGridEventHandle.render(newArray_resXml);
                        treeGridEventHandle.tool(newArray_resXml);
                        treeGridEventHandle.toolBar(newArray_resXml);
                    }
                    else{
                        newArray_resJson.tableId='resJsonParamTable';
                        treeGridEventHandle.render(newArray_resJson);
                        treeGridEventHandle.tool(newArray_resJson);
                        treeGridEventHandle.toolBar(newArray_resJson);
                    }
                    form.on('radio(form-row)', function (data) {
                        if(data.value === 'json'){
                            newArray_resJson.tableId='resJsonParamTable';
                            treeGridEventHandle.render(newArray_resJson);
                            treeGridEventHandle.tool(newArray_resJson);
                            treeGridEventHandle.toolBar(newArray_resJson);
                            $('.json-box').show();
                            $('.xml-box').hide();
                        }
                        else{
                            newArray_resXml.tableId='resXmlParamTable';
                            treeGridEventHandle.render(newArray_resXml);
                            treeGridEventHandle.tool(newArray_resXml);
                            treeGridEventHandle.toolBar(newArray_resXml);
                            $('.xml-box').show();
                            $('.json-box').hide();
                        }
                    });
                }
                else{//if else if 需关闭 否则treeGrid渲染会有问题

                }
            });
            var layid = location.hash.replace(/^#resInfoTab=/, '');
            element.tabChange('resInfoTab', layid);
            //请求头部
            $('#reqHeadForm').off('click', '.add1');
            $('#reqHeadForm').on('click', '.add1', function () {
                var html = '<div class="layui-row layui-col-space15 reqHeadForm">\n' +
                    '                   <div class="layui-col-xs3">\n' +
                    '                        <select name="daahName" lay-verify="required">\n' +
                    '                        <option value="">请选择</option>\n' +
                    '                        <option value="Accept">Accept</option>\n' +
                    '                        <option value="Accept-Charset">Accept-Charset</option>\n' +
                    '                        <option value="Accept-Encoding">Accept-Encoding</option>\n' +
                    '                        <option value="Accept-Language">Accept-Language</option>\n' +
                    '                        <option value="Accept-Ranges">Accept-Ranges</option>\n' +
                    '                        <option value="Content-Type">Content-Type</option>\n' +
                    '                        </select>\n' +
                    '                  </div>\n' +
                    '                  <div class="layui-col-xs3">\n' +
                    '                      <input class="layui-input" name="daahValue" placeholder="application/json" type="text">\n' +
                    '                  </div>\n' +
                    '                   <div class="layui-col-xs3">\n' +
                    '                        <select name="daahRequired" lay-verify="required">\n' +
                    '                        <option value="">请选择</option>\n' +
                    '                        <option value="0">否</option>\n' +
                    '                        <option value="1">是</option>\n' +
                    '                        </select>\n' +
                    '                  </div>\n' +
                    '                  <div class="layui-col-xs3">\n' +
                    '                    <i class="fa fa-plus-square formLineAdd add1"></i>\n' +
                    '                    <i class="icon iconfont icon-button-sc-2 formLineDelete delete1"></i>\n' +
                    '                  </div>\n' +
                    '</div>';
                $(this).parent().parent().parent().append(html);
                form.render('select');
                return false;

            });

            $('#reqHeadForm').off('click', '.delete1');
            $('#reqHeadForm').on('click', '.delete1', function () {
                $(this).parent().parent().remove();
            });
            //响应头部
            $('#resHeadForm').off('click', '.add1');
            $('#resHeadForm').on('click', '.add1', function () {
                var html = '<div class="layui-row layui-col-space15 resHeadForm">\n' +
                    '                   <div class="layui-col-xs3">\n' +
                    '                        <select name="daahName" lay-verify="required">\n' +
                    '                        <option value="">请选择</option>\n' +
                    '                        <option value="Accept">Accept</option>\n' +
                    '                        <option value="Accept-Charset">Accept-Charset</option>\n' +
                    '                        <option value="Accept-Encoding">Accept-Encoding</option>\n' +
                    '                        <option value="Accept-Language">Accept-Language</option>\n' +
                    '                        <option value="Accept-Ranges">Accept-Ranges</option>\n' +
                    '                        <option value="Content-Type">Content-Type</option>\n' +
                    '                        </select>\n' +
                    '                  </div>\n' +
                    '                  <div class="layui-col-xs3">\n' +
                    '                      <input class="layui-input" name="daahValue" placeholder="application/json" type="text">\n' +
                    '                  </div>\n' +
                    '                   <div class="layui-col-xs3">\n' +
                    '                        <select name="daahRequired" lay-verify="required">\n' +
                    '                        <option value="">请选择</option>\n' +
                    '                        <option value="0">否</option>\n' +
                    '                        <option value="1">是</option>\n' +
                    '                        </select>\n' +
                    '                  </div>\n' +
                    '                  <div class="layui-col-xs3">\n' +
                    '                    <i class="fa fa-plus-square formLineAdd add1"></i>\n' +
                    '                    <i class="icon iconfont icon-button-sc-2 formLineDelete delete1"></i>\n' +
                    '                  </div>\n' +
                    '</div>';
                $(this).parent().parent().parent().append(html);
                form.render('select');
                return false;

            });

            $('#resHeadForm').off('click', '.delete1');
            $('#resHeadForm').on('click', '.delete1', function () {
                $(this).parent().parent().remove();
            });

            //保存
            $('#saveBtn').off().on('click', function () {
                var reqData={};
                // 基础信息
                reqData.daaName= $('#baseInfoForm input[name="daaName"]').val();//接口名称
                if(!reqData.daaName){
                    layer.msg('请输入接口名称');
                    return false;
                }
                reqData.daaUri= $('#baseInfoForm input[name="daaUri"]').val();//接口URl
                if(!reqData.daaUri){
                    layer.msg('请输入接口Url地址');
                    return false;
                }
                reqData.daaProtocol= $('#baseInfoForm select[name="daaProtocol"]').val();//接口http协议
                reqData.daaRequestType= $('#baseInfoForm select[name="daaRequestType"]').val();//接口请求方法
                reqData.ciId= $('#baseInfoForm input[name="ciName"]').attr('data-ciId');//接口绑定目录
                if(!reqData.ciId){
                    layer.msg('请选择接口绑定目录');
                    return false;
                }
                // console.log(baseInfoForm);
            //请求信息
                //请求头部
                reqData.requestHeadList=[];
                for (var i = 0; i < $('.reqHeadForm').length; i++) {
                    // if ($('.reqHeadForm').eq(i).val()) {
                        reqData.requestHeadList.push({
                            "daahName": $('.reqHeadForm').eq(i).find('[name="daahName"]').val(),
                            "daahRequired": $('.reqHeadForm').eq(i).find('[name="daahRequired"]').val(),
                            "daahValue": $('.reqHeadForm').eq(i).find('[name="daahValue"]').val()
                        });
                    // }

                }
                var requestHeadList=reqData.requestHeadList
                // var invalidFill=[];
                var num=0;
                var repeatNum=0;
                for(var i=0;i<requestHeadList.length;i++){
                    if(requestHeadList[i]['daahName']==""||requestHeadList[i]['daahValue']==""){//如果头部标签和内容不填
                        num++;
                    }
                  for(var j = i+1; j < requestHeadList.length; j++){
                      if(requestHeadList[i]['daahName']===requestHeadList[j]['daahName']){
                          repeatNum++
                     }
                  }
                }
                if(num>0){
                    layer.msg('请完善请求头部信息');
                    return false
                }
                if(repeatNum>0){
                    layer.msg('API请求头部参数列表中存在重复的参数名,请修改');
                    return false
                }
            // 响应信息
                  //响应头部
                reqData.responseHeadList=[];
                  for (var i = 0; i < $('.resHeadForm').length; i++) {
                      // if ($('.reqHeadForm').eq(i).val()) {
                          reqData.responseHeadList.push({
                              "daahName": $('.resHeadForm').eq(i).find('[name="daahName"]').val(),
                              "daahRequired": $('.resHeadForm').eq(i).find('[name="daahRequired"]').val(),
                              "daahValue": $('.resHeadForm').eq(i).find('[name="daahValue"]').val()
                          });
                      // }

                  }
                  var responseHeadList=reqData.responseHeadList
                // var invalidFill=[];
                var num=0;
                for(var i=0;i<responseHeadList.length;i++){
                    if(responseHeadList[i].daahName==""||responseHeadList[i].daahValue==""){//如果头部标签和内容不填
                        num++;
                    }
                }
                if(num>0){
                    layer.msg('请完善响应头部信息');
                    return false
                }

                //请求体参数类型
                reqData.daaRequestBodyDataType=$('#reqBodyForm').find('input:checked').val();
                //请求体数据
                if(reqData.daaRequestBodyDataType==="xml"){
                    reqData.daaRequestJsonRootType=null;//JSON根类型
                    if(newArray_reqXml.newArray.length==0){
                         reqData.requestBodyParamList=null;
                    }
                    else{
                        reqData.requestBodyParamList=treeGridEventHandle.getData('reqXmlParamTable');
                        var data=reqData.requestBodyParamList;
                        var InvalidSource=[];
                        var html='<br/><ul>'
                        for(var i=0;i<data.length;i++){
                            if(data[i].daapValueType!='object'||data.daapValueType!='array'){//非object/array参数类型下参数数据来源情况下判空
                                if(!data[i].daapValueSource){
                                    html+='<li>参数名:'+data[i]['daapName']+'--参数说明:'+data[i]['ggMemo']+'</li>'
                                    InvalidSource.push({"daapName":data[i]['daapName'],"ggMemo":data[i]['ggMemo']});
                                    // layer.msg('存在无效参数数据来源,请设置');
                                    // return false;
                                }
                            }
                        }
                        html+='</ul>'
                        if(InvalidSource.length>0){
                            layer.alert('请求参数中参数类型为XML存在未设置参数数据来源情况:'+html);
                            return false;
                        }
                    }
                }
                else{//json
                    // JSON根类型
                    reqData.daaRequestJsonRootType=$('#reqInfoTab').find('[name="daaRequestJsonRootType"]').val();
                    if(newArray_reqJson.newArray.length==0){
                         reqData.requestBodyParamList=null;
                    }
                    else{
                        reqData.requestBodyParamList=treeGridEventHandle.getData('reqJsonParamTable');
                        var data=reqData.requestBodyParamList;
                        var InvalidSource=[];
                        var html='<br/><ul>'
                        for(var i=0;i<data.length;i++){
                            if(data[i].daapValueType!='object'||data.daapValueType!='array'){//非object/array参数类型下参数数据来源情况下判空
                                if(!data[i].daapValueSource){
                                    html+='<li>参数名:'+data[i]['daapName']+'--参数说明:'+data[i]['ggMemo']+'</li>'
                                    InvalidSource.push({"daapName":data[i]['daapName'],"ggMemo":data[i]['ggMemo']});
                                }
                            }
                        }
                        html+='</ul>'
                        if(InvalidSource.length>0){
                            layer.alert('请求参数中参数类型为JSON存在未设置参数数据来源情况:'+html);
                            return false;
                        }
                    }
                }
                //请求参数--GET/URL参数
                if(newArray_getUrl.newArray.length==0){
                     reqData.requestUrlParamLisdt=null;
                }
                else{
                     reqData.requestUrlParamList=treeGridEventHandle.getData('getUrlParamTable');
                      var data=reqData.requestUrlParamList;
                        var InvalidSource=[];
                        var html='<br/><ul>'
                        for(var i=0;i<data.length;i++){
                            if(data[i].daapValueType!='object'||data.daapValueType!='array'){//非object/array参数类型下参数数据来源情况下判空
                                if(!data[i].daapValueSource){
                                    html+='<li>参数名:'+data[i]['daapName']+'--参数说明:'+data[i]['ggMemo']+'</li>'
                                    InvalidSource.push({"daapName":data[i]['daapName'],"ggMemo":data[i]['ggMemo']});
                                }
                            }
                        }
                        html+='</ul>'
                        if(InvalidSource.length>0){
                            layer.alert('GET/URL参数中存在未设置参数数据来源情况:'+html);
                            return false;
                        }
                }
                //请求参数--REST参数
                if(newArray_rest.newArray.length==0){
                    reqData.requestRestfulParamList=null;
                }
                else{
                     reqData.requestRestfulParamList=treeGridEventHandle.getData('restParamTable');
                        var data=reqData.requestRestfulParamList;
                        var InvalidSource=[];
                        var html='<br/><ul>'
                        for(var i=0;i<data.length;i++){
                            if(data[i].daapValueType!='object'||data.daapValueType!='array'){//非object/array参数类型下参数数据来源情况下判空
                                if(!data[i].daapValueSource){
                                    html+='<li>参数名:'+data[i]['daapName']+'--参数说明:'+data[i]['ggMemo']+'</li>'
                                    InvalidSource.push({"daapName":data[i]['daapName'],"ggMemo":data[i]['ggMemo']});
                                }
                            }
                        }
                        html+='</ul>'
                        if(InvalidSource.length>0){
                            layer.alert('REST参数中存在未设置参数数据来源情况:'+html);
                            return false;
                        }
                }

                // 返回参数
                    // 参数类型
                reqData.daaResponseBodyDataType=$('#resBodyForm').find('input:checked').val();
                     //响应数据
                     if(reqData.daaResponseBodyDataType==="xml"){
                        //  数据根节点路径
                        reqData.daaResRootDataNode=$('#xml-daaResRootDataNode').val();
                        // 数据类型
                        reqData.daaResRootDataType=$('#xml-daaResRootDataType').val();
                        if(newArray_resXml.newArray.length==0){
                             reqData.responseBodyParamList=null;
                        }
                        else{
                            reqData.responseBodyParamList=treeGridEventHandle.getData('resXmlParamTable');
                        }
                     }
                     else{
                     //json下
                        //  数据根节点路径
                         reqData.daaResRootDataNode=$('#resInfoTab .json-box').find('[name="daaResRootDataNode"]').val();
                         //错误状态节点路径(从根节点开始)
                         reqData.daaResFailNode=$('#resInfoTab .json-box').find('[name="daaResFailNode"]').val();
                         //错误状态值
                         reqData.daaResFailNodeValue=$('#resInfoTab .json-box').find('[name="daaResFailNodeValue"]').val();
                         if(newArray_resJson.newArray.length==0){
                            reqData.responseBodyParamList=null;
                         }
                         else{
                            reqData.responseBodyParamList=treeGridEventHandle.getData('resJsonParamTable');
                         }
                     }
                // 请求参数判空
                // if(!reqData.requestBodyParamList){
                //     layer.msg('API请求参数为空');
                //     return false;
                // }
                // 响应参数判空
                if(!reqData.responseBodyParamList){
                    layer.msg('API响应参数为空');
                    return false;
                }
                // 成功示例
                reqData.daaSuccessStatusCode=$('#successOrFailureDeomo').find('[name="daaSuccessStatusCode"]').val();
                reqData.daaSuccessContentType=$('#successOrFailureDeomo').find('[name="daaSuccessContentType"]').val();
                //  失败示例
                reqData.daaFailureStatusCode=$('#successOrFailureDeomo').find('[name="daaFailureStatusCode"]').val();
                reqData.daaFailureContentType=$('#successOrFailureDeomo').find('[name="daaFailureContentType"]').val();
                //是否要验证返回 写死传"0"
                reqData.daaValidateResponsePara="0";
                console.log(JSON.stringify(reqData));
                var layerLoader =common.layerLoader();
                common.fetchPost('apidaqmgr/daqApi/addDataAcquisitionApiInfo', reqData,function (res) {
                    layer.close(layerLoader);
                    layer.alert(res.resultMessage);
                    //表格重载
                    if(res.success){
                        // layer.close(index_edit);
                        // eventHandle.tableReload();
                    }else{
                        layer.msg('操作失败');
                    }

                }, function () {
                    layer.close(layerLoader);
                    // layer.close(index_edit);
                    layer.msg('操作失败');//失败后提示
                });

            });
            //关闭
            $('#closeBtn').off().on('click',function(){
                var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
                parent.layer.close(index); //再执行关闭
            })
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
                    common.fetchGet('apidaqmgr/daqApi/getDataAcquisitionApiInfo?daaId=' + editData, function (res) {
                        layer.close(layerLoader);
                        var data = res.object || null;
                        if (data) {
                            //基础信息
                            $('#baseInfoForm input[name="daaName"]').val(data.daaName);//接口名称
                            $('#baseInfoForm input[name="daaUri"]').val(data.daaUri);//接口URl
                            $('#baseInfoForm select[name="daaProtocol"]').val(data.daaProtocol);//接口http协议
                            $('#baseInfoForm select[name="daaRequestType"]').val(data.daaRequestType);//接口请求方法
                            $('#baseInfoForm input[name="ciName"]').attr('data-ciId',data.ciId);//接口绑定目录
                            editDataPublic = data;
                            //当前绑定目录
                            common.fetchGet('sysmgr/catalogue/catalogue/' + data.ciId,function (res) {
                                var data = res.object;

                                if (data) {
                                    $('#baseInfoForm input[name="ciName"]').val(data.ciName);//接口绑定目录
                                }

                            });
                            //请求头部信息
                            if(data.requestHeadList && data.requestHeadList.length>0){
                                var html='';
                                for(var i=0;i<data.requestHeadList.length;i++){
                                      html+= '<div class="layui-row layui-col-space15 reqHeadForm">\n' +
                    '                   <div class="layui-col-xs3">\n' +
                    '                        <select name="daahName" lay-verify="required">\n' +
                    '                        <option value="'+data.requestHeadList[i]['daahName']+'" selected>'+data.requestHeadList[i]['daahName']+'</option>\n' +
                    '                        <option value="Accept">Accept</option>\n' +
                    '                        <option value="Accept-Charset">Accept-Charset</option>\n' +
                    '                        <option value="Accept-Encoding">Accept-Encoding</option>\n' +
                    '                        <option value="Accept-Language">Accept-Language</option>\n' +
                    '                        <option value="Accept-Ranges">Accept-Ranges</option>\n' +
                    '                        <option value="Content-Type">Content-Type</option>\n' +
                    '                        </select>\n' +
                    '                  </div>\n' +
                    '                  <div class="layui-col-xs3">\n' +
                    '                      <input class="layui-input" name="daahValue" placeholder="application/json" type="text" value="'+data.requestHeadList[i]['daahValue']+'">\n' +
                    '                  </div>\n' +
                    '                   <div class="layui-col-xs3">\n' +
                    '                        <select name="daahRequired" lay-verify="required" >\n' +
                    '                        <option value="'+data.requestHeadList[i]['daahRequired']+'">'+(data.requestHeadList[i]['daahRequired']=="0"?'否':'是')+'</option>\n' +
                    '                        <option value="0">否</option>\n' +
                    '                        <option value="1">是</option>\n' +
                    '                        </select>\n' +
                    '                  </div>\n' +
                    '                  <div class="layui-col-xs3">\n' +
                    '                    <i class="fa fa-plus-square formLineAdd add1"></i>\n' +
                                          '                    <i class="icon iconfont icon-button-sc-2 formLineDelete delete1"></i>\n' +
                    '                  </div>\n' +
                    '</div>';
                        $('#reqHeadForm').find('.reqHeadForm').remove();
                         $('#reqHeadForm').append(html);

                        form.render('select');
                                }
                            }
                            //请求参数
                            if(data.daaRequestBodyDataType=="json"){
                                newArray_reqJson.newArray=data.requestBodyParamList;
                            }
                            else{  // xml
                                newArray_reqXml.newArray=data.requestBodyParamList;
                            }
                            //GET/URL参数
                            if(data.requestUrlParamList){
                                newArray_getUrl.newArray=data.requestUrlParamList;
                            }
                            else{
                                newArray_getUrl.newArray=[];
                            }
                            //REST参数
                            if(data.requestRestfulParamList){
                                newArray_rest.newArray=data.requestRestfulParamList;
                            }
                            else{
                                newArray_rest.newArray=[];
                            }
                            // 响应参数
                            if(data.daaResponseBodyDataType=="json"){
                                newArray_resJson.newArray=data.responseBodyParamList;
                            }
                            else{
                                newArray_resXml.newArray=data.responseBodyParamList;
                            }
                             return false;
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
