 layui.config({
        base: '../../../src/js/',
        version: new Date().getTime()
    }).extend({
        custom: 'common/custom'
    }).use(['table', 'common', 'util','jquery'], function () {
        var table = layui.table;
        var common = layui.common;
        var util = layui.util;
        var $ = layui.jquery;
     common.themeSet();
        var baseUrl = '../../../';

        var eventHandle={
            intfInfo:function(monitorDta){
                common.fetchGet('intfmgr/intfInfo/info/' + monitorDta, function (res) {
                    if (res.object) {
                        var data = res.object;
                        //基本信息填写
                        $('.headLine span').text(data.intfInfo.intfName!=null ? data.intfInfo.intfName : '-');
                        $('.clearFix').find('.version').text(data.intfInfo.intfVer!=null ? data.intfInfo.intfVer : '-');
                        $('.clearFix').find('.successCount').text(data.intfInfo.successCount!=null ? data.intfInfo.successCount : '-');
                        $('.clearFix').find('.failCount').text(data.intfInfo.failCount!=null ? data.intfInfo.failCount : '-');
                        $('.clearFix').find('.updateTime').text(data.intfInfo.ggUpdateDatetime!=null ? util.toDateString(data.intfInfo.ggUpdateDatetime) : '-');
                    }
            })
            },
            intfAllList:function(){ //运行历史
                 table.render(common.tableInitParams({
                    elem: '#table1',
                    url: baseUrl + 'intfmgr/log/list',
                    method: 'post',
                    height: 'full-180',
                    // toolbar: '#tableToolBar',
                    defaultToolbar: false,
                    cols: [
                        [
                            {"type": "numbers", "title": "序号"},
                            {field: 'beginTime', title: '开始时间', sort: true,templet:function (rowData) {
                                return util.toDateString(rowData['beginTime']);
                            }},
                            {field: 'endTime', title: '结束时间', sort: true,templet:function (rowData) {
                                return util.toDateString(rowData['endTime']);
                            }},
                            {field: 'callTime', title: '持续时间(秒)', sort: true},
                            {
                                field: 'result', title: '结果', sort: true, width: 80,
                                templet: function (rowData) {
                                    if (rowData['result'] === 'false') {
                                        return '<span class="layui-badge" style="background-color:red">失败</span>';
                                    }else {
                                         return '<span class="layui-badge layui-bg-green">成功</span>';
                                    }
                                }
                            }
                        ]
                    ]
                }));
            },
            intfBlackList:function(){//黑名单
                table.render(common.tableInitParams({
                    elem: '#table2',
                    url: baseUrl + 'intfmgr/log/list',
                    method: 'post',
                    height: 'full-180',
                    // toolbar: '#tableToolBar',
                    defaultToolbar: false,
                    where:{ipType:"black"},
                    cols: [
                        [
                            {"type": "numbers", "title": "序号"},
                            {field: 'beginTime', title: '开始时间', sort: true,templet:function (rowData) {//支持时间戳转化
                                return util.toDateString(rowData['beginTime']);
                            }},
                            {field: 'endTime', title: '结束时间', ort: true,templet:function (rowData) {//支持时间戳转化
                                return util.toDateString(rowData['endTime']);
                            }},
                            {field: 'callTime', title: '持续时间(秒)', sort: true},
                            {
                                field: 'result', title: '结果', sort: true, width: 80,
                                templet: function (rowData) {
                                    if (rowData['result'] === 'false') {
                                        return '<span class="layui-badge" style="background-color:red">失败</span>';
                                    }else {
                                         return '<span class="layui-badge layui-bg-green">成功</span>';
                                    }
                                }
                            }
                        ]
                    ]
                }));
            },
        }
        var monitorDta= $('#portData').text();
        setTimeout(function () {
            if(monitorDta){
                 eventHandle.intfInfo(monitorDta);
            }
            try{
                 eventHandle.intfAllList();
            }
            catch(e){

            }
            try{
                eventHandle.intfBlackList();
            }
            catch(e){

            }
        }, 200);
    });
