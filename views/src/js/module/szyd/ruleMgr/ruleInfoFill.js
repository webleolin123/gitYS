/**

 @Name：制度信息填报
 @Author：lc

 */
//获取url传参
(function ($) {
    $.getUrlParam = function (name) {//获取父页面参数
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }
    $.reloadParentPage=function(){//获取父页面dom
        if ($(top.window.document).find('#refresh')[0]) {
            $(top.window.document).find('#refresh').trigger('click');
        } else {
            // $($(top.window.document).find('#mainTabContent .layui-show').find('.iframe')[0].contentWindow.document).find(toModule.toModuleDom).click();
            $($(top.window.document).find('#menuContent').find('.iframe')[0].contentWindow.document).find('#refresh').click();
        }
    }
})(jQuery);
layui.config({
    base: '../../../src/js/',
    version: new Date().getTime()
}).extend({}).use(
    ['eleTree', 'layer', 'table','form', 'laytpl', 'common', 'element', 'laydate', 'upload'],
    function () {
    var table = layui.table;
    var form = layui.form;
    var common = layui.common;
    var element = layui.element;
    var laydate = layui.laydate;

    var baseUrl = '../../../../';

    var editRegulationId = common.getQueryVariable('regulationId');
    var regulationId=null;
    var listRegulationVote=[];
    sessionStorage.clear();

    var eventHandle = {
        domEvent: function () {
            //流程按钮
            $('#zd_add_flowConfig').off().on('click', function (e) {
                e.preventDefault();
                // var $zd_add_flowInfo= $('#zd_add_flowInfo');
                // $zd_add_flowInfo.removeClass('hide');
                $('.leftContendBox').css({
                    width: '80%',
                    height: $(window).height() - 10 + 'px'
                    // 'box-shadow':'1px 10px 1px 1000px rgba(29, 29, 29, 0.5)',
                    // opacity:1
                });
                $('.mainMack').fadeIn();

                $('html,body').animate({scrollTop: 0}, 'slow');
                $('body,html').addClass('stopScrop');


            });
            //流程选择确定
            $('#saveFlowBtn').off().on('click', function () {
                //获取子iframe中的信息

                // $("#label").val(label);
                // $("#version").val(version);
                // $("#orgId").val(orgId);
                // $("#name").val(obj.data.currentData.name);

                var parent = $("#flowIframe").contents();

                $('[name=flowLabel]').attr({
                    // 'data-beiId': beiId,
                    'data-flowLabel': parent.find('#label').val(),
                    'data-flowName': parent.find('#name').val(),
                    // 'data-flowState': 0,
                    // 'data-flowStatusList': res.object.stateinfo.name
                });
                $('[name=flowLabel]').val(parent.find('#name').val());


                $('.leftContendBox').css({
                    width: '0px',
                    // 'box-shadow':'none',
                    // opacity:0
                });
                $('body,html').removeClass('stopScrop');
                $('.mainMack').fadeOut();

            });

            $('#cancleFlowBtn').off().on('click', function () {
                $('.leftContendBox').css({
                    width: '0px',
                    // 'box-shadow':'none',
                    // opacity:0
                });
                $('body,html').removeClass('stopScrop');
                $('.mainMack').fadeOut();
            });

            //附件删除
            $(document).off('click', '.fileDelete');
            $(document).on('click', '.fileDelete', function () {
                var current = $(this).parent().parent();
                var fileName = current.attr('fileName');
                var fileId = current.attr('data-fiId');
                layer.confirm("确定删除【 " + fileName + "】文件?", {icon: 3, title: '提示', offset: '150px'}, function (index) {
                    layer.close(index);
                    common.fetchDelete("/dfsmgr/file/deleteById?id=" + fileId, function (res) {
                        if (res.success) {
                            layer.msg('删除成功');
                            current.remove();
                        } else {
                            layer.msg('删除失败');
                        }
                    });
                });
            });

            //table监听事件--新增/批量删除
            table.on('toolbar(zd_add_bjfsTable)',function (obj) {
                var checkStatus = table.checkStatus(obj.config.id);
                var data = obj.config;
                switch(obj.event){
                    case 'zd_add_bjfsTable_add':
                        var index_add = layer.open({
                            offset: '10px',
                            title:'新增事项表决',
                            maxmin: false,
                            type: 1,//页面层
                            area: ['580px'],//高度自适应
                            zIndex:998,
                            content: $('.zd_add_bjfsTableLayer').html(),//加载该区域的html
                            success:function(obj) {
                                var $objSelector=$(obj.selector);
                                eventHandle.getAllVoteMode(); // 获取所有表决方式
                                eventHandle.selectTiolItemInfoEnStatusList();// 获取所有事项名称
                                eventHandle.getTioRegulationRate();//获取人数占比
                                form.on('submit(formAdd)', function (obj) {
                                    var params = obj.field;
                                    listRegulationVote=JSON.parse(sessionStorage.getItem('listRegulationVote'));
                                    listRegulationVote.push({
                                        "itemCode": params.itemCode,
                                        "itemName": $objSelector.find('[name="itemCode"] option:selected').text(),
                                        "modeId":  $objSelector.find('[name=modeId]:checked').val(),
                                        "modeName": $objSelector.find('[name="modeId"]:checked').attr('title'),
                                        "peopleRate": params.peopleRate,
                                        "regulationId": regulationId,
                                        "voteId": common.uuid(null,32)
                                    });
                                    eventHandle.MatterVoteList(listRegulationVote);
                                    layer.close(index_add);
                                    return false;
                                });
                                 //关闭
                                $(obj.selector).find('.closeForm').off().on('click', function () {
                                    layer.close(index_add);
                                    return false;
                                });
                            }
                        });
                        break;
                    case 'zd_add_bjfsTable_del':
                        //点击删除按钮
                        if(checkStatus.data.length>0){
                            layer.confirm('确定删除选中列?', {icon: 3, title:'提示',offset: '150px'}, function(index){
                                var ids=[];
                                for(var i=0;i<checkStatus.data.length;i++){
                                    ids.push(checkStatus.data[i]['voteId'])
                                }
                                var layerLoader =common.layerLoader();
                                common.fetchDelete('sasszrule/regulationVote/delete?ids='+ids.join(','),function () {
                                    layer.close(layerLoader);
                                    layer.msg('删除成功');
                                    eventHandle.MatterVoteList(listRegulationVote);
                                },function () {
                                    layer.close(layerLoader);
                                });

                                layer.close(index);
                            });
                        }else{
                            layer.msg('请选择删除列')
                        }
                        break;
                    default:break;
                }
            });
            //table监听事件--编辑/单行删除
            table.on('tool(zd_add_bjfsTable)', function(obj){
                var data = obj.data;
                switch(obj.event){
                    case 'zd_add_bjfsTable_edit'://编辑
                    var index_edit = layer.open({
                        offset: '10px',
                        title:'编辑事项表决',
                        maxmin: false,
                        type: 1,//页面层
                        area: ['580px'],//高度自适应
                        zIndex:998,
                        content: $('.zd_add_bjfsTableLayer').html(),//加载该区域的html
                        success:function(obj) {
                            eventHandle.getAllVoteMode(data.modeId);// 获取所有表决方式
                            eventHandle.selectTiolItemInfoEnStatusList();// 获取所有事项名称
                            eventHandle.getTioRegulationRate();//获取人数占比
                            $(obj.selector).find('[name="itemCode"]').val(data.itemCode);
                            $(obj.selector).find('[name="peopleRate"]').val(data.peopleRate);
                            form.render();
                            var $objSelector=$(obj.selector);
                            form.on('submit(formAdd)', function (obj) {
                                var params = obj.field;
                                var tmp={
                                    "itemCode": params.itemCode,
                                    "itemName": $objSelector.find('[name="itemCode"] option:selected').text(),
                                    "modeId":  $objSelector.find('[name=modeId]:checked').val(),
                                    "modeName": $objSelector.find('[name="modeId"]:checked').attr('title'),
                                    "peopleRate": params.peopleRate,
                                    "regulationId": data.regulationId,
                                    "voteId": data.voteId
                                };
                                listRegulationVote=JSON.parse(sessionStorage.getItem('listRegulationVote'));
                                for(var i=0;i<listRegulationVote.length;i++){
                                    if(listRegulationVote[i]['voteId']==data.voteId){
                                        listRegulationVote[i]=tmp;
                                    }
                                }
                                eventHandle.MatterVoteList(listRegulationVote);
                                layer.close(index_edit);
                                return false;
                            });
                               //关闭
                            $(obj.selector).find('.closeForm').off().on('click', function () {
                                layer.close(index_edit);
                                return false;
                            });
                        }
                    });
                        break;
                    case 'zd_add_bjfsTable_singleDel':
                        //点击删除按钮
                        layer.confirm('确定删除选中列?', {icon: 3, title:'提示',offset: '150px'}, function(index){
                            listRegulationVote=JSON.parse(sessionStorage.getItem('listRegulationVote'));
                            for(var i=0;i<listRegulationVote.length;i++){
                                if(listRegulationVote[i]['voteId']==data.voteId){
                                    listRegulationVote.splice(i,1);
                                }
                            }
                            eventHandle.MatterVoteList(listRegulationVote);
                            layer.msg('删除成功');
                            layer.close(index);
                        });
                        break;
                    default:break;
                }
            });

            //暂存
            $('#zcsaveBaseInfo').off().on('click', function () {
                 //基本信息保存
                 var url,params;
                 if (editRegulationId) {
                    url = 'sasszrule/regulation/updateInfoAndVote';
                } else {
                    url = 'sasszrule/regulation/saveInfoAndVote';
                }
             //获取参数对象
                 params = {
                    // 制度名称
                    regulationName: $('[name=regulationName]').val(),
                    // 制度类型
                    regulationTypeId: $('[name=regulationType]:checked').val(),
                    // 制度类型名称
                    regulationTypeName: $('[name=regulationType]:checked').attr('title'),
                    //审批日期
                    approvalDate: $('[name=approvalDate]').val(),
                    //生效日期
                    effectiveDate: $('[name=effectiveDate]').val(),
                    //失效日期
                    expireDate: $('[name=expireDate]').val(),
                    //经过合法审查
                    auditFlag: $('[name=auditFlag]:checked').val(),
                    // //流程选择
                    // flowLabel: $('[name=flowLabel]').val(),
                     regulationId: regulationId,
                     iSaveFlag: 1,
                     flowLabel: $('[name=flowLabel]').attr('data-flowLabel'),
                     flowName: $('[name=flowLabel]').attr('data-flowName'),
                };
                if(params.regulationTypeName=="议事规则"){
                    var $meetingType=$('[name=meetingType]:checked');
                    params.meetingTypeId=$meetingType.val();
                    params.meetingTypeName=$meetingType.attr('title');
                }
             // 校验参数对象
                 if (!params.regulationName) {
                     layer.msg('请输入制度名称');
                     return false;
                 }
                //  if (!params.approvalDate) {
                //      layer.msg('请选择审批日期');
                //      return false;
                //  }
                 if (!params.effectiveDate) {
                     layer.msg('请选择生效日期');
                     return false;
                 }
                 if (!params.expireDate) {
                     layer.msg('请选择失效日期');
                     return false;
                 }
                //  if (!params.flowLabel) {
                //      layer.msg('请配置流程选择');
                //      return false;
                //  }
                //  params.listRegulationVote=listRegulationVote;


                //判断是够存在流程信息
                // if (!$('[name=flowLabel]').val()) {
                //     //请配置流程信息
                //     layer.msg('请配置流程信息');
                //     return false;
                // }

                if(listRegulationVote.length>0){
                    params.listRegulationVote=listRegulationVote;
                }
                common.fetchPost(url, params, function (res) {
                    if (res.success) {
                        parent.layer.closeAll();
                        $.reloadParentPage();
                        parent.layer.msg('保存成功');
                    } else {
                        layer.alert(res.resultMessage || '保存失败')
                    }
                }, function (err) {
                    layer.alert(err.resultMessage || '保存失败');
                });
                    return false;

            });
            //新增/编辑 保存
            $('#saveBaseInfo').off().on('click', function () {
                 //基本信息保存
                 var url,params;
                 if (editRegulationId) {
                    url = 'sasszrule/regulation/updateInfoAndVote';
                } else {
                    url = 'sasszrule/regulation/saveInfoAndVote';
                }
             //获取参数对象
                 params = {
                    // 制度名称
                    regulationName: $('[name=regulationName]').val(),
                    // 制度类型
                    regulationTypeId: $('[name=regulationType]:checked').val(),
                    // 制度类型名称
                    regulationTypeName: $('[name=regulationType]:checked').attr('title'),
                    //审批日期
                    approvalDate: $('[name=approvalDate]').val(),
                    //生效日期
                    effectiveDate: $('[name=effectiveDate]').val(),
                    //失效日期
                    expireDate: $('[name=expireDate]').val(),
                    //经过合法审查
                    auditFlag: $('[name=auditFlag]:checked').val(),
                    // //流程选择
                    // flowLabel: $('[name=flowLabel]').val(),
                     regulationId: regulationId,
                     iSaveFlag: 0,
                     flowLabel: $('[name=flowLabel]').attr('data-flowLabel'),
                     flowName: $('[name=flowLabel]').attr('data-flowName'),
                };
                if(params.regulationTypeName=="议事规则"){
                    var $meetingType=$('[name=meetingType]:checked');
                    params.meetingTypeId=$meetingType.val();
                    params.meetingTypeName=$meetingType.attr('title');
                }
             // 校验参数对象
                 if (!params.regulationName) {
                     layer.msg('请输入制度名称');
                     return false;
                 }
                //  if (!params.approvalDate) {
                //      layer.msg('请选择审批日期');
                //      return false;
                //  }
                 if (!params.effectiveDate) {
                     layer.msg('请选择生效日期');
                     return false;
                 }
                 if (!params.expireDate) {
                     layer.msg('请选择失效日期');
                     return false;
                 }
                //  if (!params.flowLabel) {
                //      layer.msg('请配置流程选择');
                //      return false;
                //  }
                //  params.listRegulationVote=listRegulationVote;


                //判断是够存在流程信息
                if (!$('[name=flowLabel]').val()) {
                    //请配置流程信息
                    layer.msg('请配置流程信息');
                    return false;
                }

                if(listRegulationVote.length>0){
                    params.listRegulationVote=listRegulationVote;
                }
                common.fetchPost(url, params, function (res) {
                    if (res.success) {
                        parent.layer.closeAll();
                        $.reloadParentPage();
                        parent.layer.msg('保存成功');
                    } else {
                        layer.alert(res.resultMessage || '保存失败')
                    }
                }, function (err) {
                    layer.alert(err.resultMessage || '保存失败');
                });
                    return false;

            });

            //关闭
            $('.closeForm').off().on('click', function () {
                parent.layer.closeAll();
                return false;
            });

        },
        getTiolMeetingTypeSelect:function(field){ //获取会议类型
            field=field||null;
            common.fetchPost('sasmeetingmgr/tiolMeetingType/getTiolMeetingTypeSelect',{},function (res) {
                if(res.list&&res.list.length>0){
                    var tempHtml='';
                    if(!field){
                        $.map(res.list, function (item,index) {
                            if(index==0){
                                tempHtml+='<input class="layui-col-xs3 layui-col-md2 layui-col-lg1" checked name="meetingType" title="'+item.meetingTypeName+'" type="radio" value="'+item.meetingType+'">';
                            }
                            else{
                                tempHtml+='<input class="layui-col-xs3 layui-col-md2 layui-col-lg1" name="meetingType" title="'+item.meetingTypeName+'" type="radio" value="'+item.meetingType+'">';
                            }
                        });
                    }
                    else{
                        $.map(res.list, function (item) {
                            if(item.meetingType==field){
                                tempHtml+='<input class="layui-col-xs3 layui-col-md2 layui-col-lg1" checked name="meetingType" title="'+item.meetingTypeName+'" type="radio" value="'+item.meetingType+'">';
                            }
                            else{
                                tempHtml+='<input class="layui-col-xs3 layui-col-md2 layui-col-lg1" name="meetingType" title="'+item.meetingTypeName+'" type="radio" value="'+item.meetingType+'">';
                            }
                        });
                    }
                    $('.selectMeetingType').html(tempHtml);
                    form.render();
                }
            });
        },
        getTioRegulationType:function(field){ //获取制度类型
            field=field||null;
            common.fetchGet('sasszrule/regulationType/getAll',function (res) {
                if(res.list&&res.list.length>0){
                    var tempHtml='';
                    if(!field){
                        $.map(res.list, function (item,index) {
                            if(index==0){
                                tempHtml+='<input class="layui-col-xs3 layui-col-md2 layui-col-lg1" checked name="regulationType" lay-filter="regulationType" title="'+item.trtName+'" type="radio" value="'+item.trtId+'">';
                            }
                            else{
                                tempHtml+='<input class="layui-col-xs3 layui-col-md2 layui-col-lg1" name="regulationType" lay-filter="regulationType" title="'+item.trtName+'" type="radio" value="'+item.trtId+'">';
                            }
                        });
                    }
                    else{
                        $.map(res.list, function (item) {
                            if(item.trtId==field){
                                tempHtml+='<input class="layui-col-xs3 layui-col-md2 layui-col-lg1" checked name="regulationType" lay-filter="regulationType" title="'+item.trtName+'" type="radio" value="'+item.trtId+'">';
                            }
                            else{
                                tempHtml+='<input class="layui-col-xs3 layui-col-md2 layui-col-lg1" name="regulationType" lay-filter="regulationType" title="'+item.trtName+'" type="radio" value="'+item.trtId+'">';
                            }
                        });
                    }
                    $('.selectRegulationType').html(tempHtml);
                    form.render();
                      //是否显示事项表决情况：制度类型为议事规则时显示
                    form.on('radio(regulationType)', function (data) {
                        var elem=data.elem;
                        if(elem.title.indexOf('议事规则')!=-1){
                            // $('#zd_add_bjfsTable_main').show();//显示事项表决方式
                            $('#zd_add_meetingType').show();//显示会议类型
                            // $('#zd_add_rate').show();//显示人数占比
                        }
                        else{
                            // $('#zd_add_bjfsTable_main').hide();
                            $('#zd_add_meetingType').hide();
                            // $('#zd_add_rate').hide();
                        }
                    });
                }
            });
        },
        getTioRegulationRate:function(){ //获取人数占比
            common.fetchGet('sysmgr/dicts/selectDictListByPcode?dictPCode=REGULATION_RATE',function (res) {
                if(res.list&&res.list.length>0){
                    var tempHtml='';
                    $.map(res.list, function (item,index) {
                        if(index==0){
                            tempHtml+='<input class="layui-col-xs3 layui-col-md2 layui-col-lg1" checked name="rate" title="'+item.sdName+'" type="radio" value="'+item.sdCode+'">';
                        }
                        else{
                            tempHtml+='<input class="layui-col-xs3 layui-col-md2 layui-col-lg1" name="rate" title="'+item.sdName+'" type="radio" value="'+item.sdCode+'">';
                        }
                    });
                    $('.selectRegulationRate').html(tempHtml);
                    form.render();
                }
            });
        },
        getAllVoteMode:function(field){//获取表决方式
            field=field||null;
            common.fetchGet('sasszrule/voteMode/getAll',function (res) {
                if(res.list&&res.list.length>0){
                    var tempHtml='';
                    if(!field){
                        $.map(res.list, function (item,index) {
                            if(index==0){
                                tempHtml+='<input  checked name="modeId" title="'+item.modeName+'" type="radio" value="'+item.modeId+'"></br>';
                            }
                            else{
                                tempHtml+='<input  name="modeId" title="'+item.modeName+'" type="radio" value="'+item.modeId+'"></br>';
                            }
                        });
                    }
                    else{
                        $.map(res.list, function (item) {
                            if(item.modeId==field){
                                tempHtml+='<input  checked name="modeId" title="'+item.modeName+'" type="radio" value="'+item.modeId+'"></br>';
                            }
                            else{
                                tempHtml+='<input  name="modeId" title="'+item.modeName+'" type="radio" value="'+item.modeId+'"></br>';
                            }
                        });
                    }
                    $('.selectRegulationVoteMode').html(tempHtml);
                    form.render();
                }
            });
        },
        selectTiolItemInfoEnStatusList:function(){ //获取事项名称
            common.selectDataSet({
                elem: $('[name=itemCode]'),
                url: 'sascatalog/tiolItem/selectTiolItemInfoEnStatusList',
                responseList: 'list',
                where:{},
                isSearch:true,
                method: 'post',//默认为get
                optionText: 'itemName',
                optionValue: 'itemCode',
                success: function (data) {
                    form.render('select');
                }
            });
        },
        initRender: function () {
    // 日期导入
            //审批日期
            laydate.render({
            elem: '#add_approvalDate',
            type: 'date',
            format: 'yyyy-MM-dd',
            trigger: 'click'
            });
            // 生效日期
            laydate.render({
                elem: '[name="effectiveDate"]',
                type: 'date',
                format: 'yyyy-MM-dd',
                trigger: 'click'
            });
            // 失效日期
            laydate.render({
                elem: '[name="expireDate"]',
                type: 'date',
                value:'2099-12-31',
                format: 'yyyy-MM-dd',
                trigger: 'click'
            });
// 附件信息
            //正式文件
            common.fileUploadList({
                elem: '#ruleOfficalDoc',
                appendArea: $('#ruleOfficalDocBox ul'),
                url: baseUrl + 'zuul/dfsmgr/file/fileUpload',
                auto: true,
                data: {
                    resId: function () {
                        return regulationId;
                    },
                    "fiFileType": 'FORMAL'
                }
            });
            //佐证材料
            common.fileUploadList({
                elem: '#ruleSupportPapers',
                appendArea: $('#ruleSupportPapersBox ul'),
                url: baseUrl + 'zuul/dfsmgr/file/fileUpload',
                auto: true,
                data: {
                    resId: function () {
                        return regulationId;
                    },
                    "fiFileType": 'EVIDENCE'
                }
            });
    //事项表决方式
            // 如果制度类型默认为议事规则 显示事项表决列表
        },
        fileDataSet: function (parent, type, id) {
            common.fetchGet('dfsmgr/file/getFileByResIdAndFileType?id=' + id + '&type=' + type, function (res) {
                var data = res.list || [];

                var html = '';

                if (data.length > 0) {

                    $.map(data, function (item) {
                        var fileName = item.fiName + '.' + item.fiSuffix;

                        html+= '<li data-fiId="' + item.fiId + '" fileName="' + fileName + '">' +
                            '      <div class="fileSingleBox">\n' +
                            '          <p class="fileName" title="' + fileName + '">' + fileName + '</p>\n' +
                            '          <p>\n' +
                            '              <i class="fa fa-file-text-o"></i><b\n' +
                            '                  class="fileSize">' + common.bytesToSize(item.fiSize) + '</b>\n' +
                            '          </p>\n' +
                            '          <div class="box-close-btn fileDelete">\n' +
                            '              <i class="fa fa-close"></i>\n' +
                            '          </div>\n' +
                            '      </div>\n' +
                            '  </li>';
                    });
                    parent.find('li').eq(0).siblings().remove();

                    parent.append(html);
                }

            });
        },
        //事项表决列表请求获取的listRegulationVote
        MatterVoteList: function (listRegulationVote) {
            listRegulationVote=listRegulationVote||[];
            sessionStorage.setItem('listRegulationVote',JSON.stringify(listRegulationVote));
            var len=listRegulationVote.length;
                table.render(common.tableInitParams({
                    elem: '#zd_add_bjfsTable',
                    data:listRegulationVote,
                    toolbar:'#zd_add_bjfsTableToolbar',
                    height: null,
                    page:false,
                    cols: [
                        [
                            {type: 'numbers', title: '序号'},
                            {field: 'itemName', title: '事项名称',sort:true},
                            {field: 'modeName', title: '表决方式', sort: true},
                            {field: 'peopleRate', title: '人数占比', sort: true},
                            {field: '', title: '操作', toolbar: '#zd_add_bjfsTableOper',width:100, fixed: 'right'}
                        ]
                    ]
            }));
        },
        //事项表决列表导入
        MatterVoteInit: function (regulationId) {
            common.fetchPost('sasszrule/regulationVote/list',{regulationId:regulationId},function (res) {
                if(res.page&&res.page.list){
                    var list=res.page.list;
                    if(list&&list.length>0){
                        var tmp=[];
                        $.map(list, function (item) {
                            tmp.push({
                                "itemCode": item.itemCode,
                                "itemName": item.itemName,
                                "modeId": item.modeId,
                                "modeName": item.modeName,
                                "peopleRate": item.peopleRate,
                                "regulationId": item.regulationId,
                                "voteId": item.voteId
                            });
                        });
                        list=tmp;
                    }
                    else{
                        list=[];
                    }
                    eventHandle.MatterVoteList(list);
                }
            });
        },
        //流程日志
        flowDataSet: function (area) {

            //判断是否存在流程
            common.fetchGet('sasprocessmgr/businessEngineInfo/getBusinessEngineInfoByBusinessId?businessId=' + editRegulationId, function (res) {

                if (res.success) {
                    var piid = res.object.flowPiid;
                    //存在流程信息
                    //显示的是流程查看页面

                    $('#editFlow').empty().hide();
                    $('#showFlow').empty().html(' <iframe frameborder="0" id="flowShowIframe" src="../../flow/flowGraphic.html?piid="' + piid + ' style="width: 100%;height: 540px"></iframe>');
                    $('#showFlow').show();

                } else {
                    //获取流程信息失败  进入流程配置页面
                    $('#showFlow').empty().hide();
                    $('#editFlow').empty().html('<iframe frameborder="0" id="flowIframe" src="../../process/newTemplateByBizDisplay.html?businessTypeId=rule" style="width: 100%;height:' + $(window).height() - 60 + 'px"></iframe>');
                    $('#editFlow').show();
                }

            }, function () {
                $('#showFlow').empty().hide();
                $('#editFlow').empty().html('<iframe frameborder="0" id="flowIframe" src="../../process/newTemplateByBizDisplay.html?businessTypeId=rule" style="width: 100%;height:540px"></iframe>');
                $('#editFlow').show();
            });

        },
        pageLoad: function () {
            element.init();
            common.themeSet();

            common.buttonLimit();
            common.columnSide();

            common.dataAccessReloadModule({});

            //加载项
            eventHandle.initRender();

            //判断是新增还是编辑
            if (editRegulationId) {//编辑
                 regulationId = editRegulationId;
                //制度信息导入
                common.fetchGet('sasszrule/regulation/info?regulationId=' + regulationId, function (res) {
                    var data = res.object;
                    // 制度名称
                    $('[name=regulationName]').val(data.regulationName);
                    //审批日期
                    $('[name=approvalDate]').val(data.approvalDate);
                    //生效日期
                    $('[name=effectiveDate]').val(data.effectiveDate);
                    //失效日期
                    $('[name=expireDate]').val(data.expireDate);

                    //流程选择
                    $('[name=flowLabel]').val(data.flowLabel);

                    $('[name=flowLabel]').attr({
                        'data-beiId': data.beiId,
                        'data-flowLabel': data.flowLabel,
                        'data-flowState': data.flowState,
                        'data-flowStatusList': data.flowStatusList
                    });
                    if(data.regulationTypeName=="议事规则"){
                        $('#zd_add_meetingType').show();//显示会议类型
                        eventHandle.getTiolMeetingTypeSelect(data.meetingTypeId);//获取会议类型
                    }
                    else{
                        eventHandle.getTiolMeetingTypeSelect();//获取会议类型
                        $('#zd_add_meetingType').hide();//隐藏会议类型
                    }
                    form.val('ruleInfoFillForm',{
                        auditFlag:data.auditFlag, //经过合法审查
                        // regulationType:data.regulationTypeId,// 制度类型
                        // meetingType:data.meetingTypeId// 会议类型
                    })
                    eventHandle.getTioRegulationType(data.regulationTypeId);//获取制度类型
                    form.render();


                    //流程配置
                    eventHandle.flowDataSet($('.flowDataBox'));

                });

                //附件信息导入
                eventHandle.fileDataSet($('#ruleOfficalDocBox ul'), 'FORMAL', regulationId);//正式文件
                eventHandle.fileDataSet($('#ruleSupportPapersBox ul'), 'EVIDENCE', regulationId);//佐证材料

                //事项表决方式信息导入
                eventHandle.MatterVoteInit(regulationId);
                // eventHandle.MatterVoteList(listRegulationVote);
            } else {//新增
                regulationId = common.uuid(null, 32);//新增随机生成
                eventHandle.getTioRegulationType();//获取制度类型
                eventHandle.getTiolMeetingTypeSelect();//获取会议类型
                eventHandle.MatterVoteList(listRegulationVote); //事项表决方式信息导入

                //流程信息配置
                $('#showFlow').empty().hide();
                $('#editFlow').empty().html('<iframe frameborder="0" id="flowIframe" src="../../process/newTemplateByBizDisplay.html?businessTypeId=rule" style="width: 100%;height: 540px"></iframe>');
                $('#editFlow').show();
            }

        }
    };

    eventHandle.domEvent();
    eventHandle.pageLoad();


});
