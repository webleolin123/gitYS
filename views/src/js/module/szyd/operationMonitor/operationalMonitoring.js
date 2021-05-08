/**

 @Name：运行监控
 @Author：rxh

 */
layui.config({
    base: '../../../js/',
    version: new Date().getTime()
}).extend({}).use(
    ['eleTree', 'layer', 'table', 'carousel', 'form', 'laytpl', 'laypage', 'common', 'element', 'laydate', 'upload'],
    function () {
        var table = layui.table;
        var form = layui.form;
        var common = layui.common;
        var element = layui.element;
        var laydate = layui.laydate;
        var upload = layui.upload;
        var carousel = layui.carousel;
        var tree = layui.eleTree;
        var laypage = layui.laypage;

        var seId = null;
        var nearlyTime = null;
        var meetingTimeS = null;
        var meetingTimeE = null;

        var baseUrl = '../../../../';
        var reportTableSet;

        var eventHandle = {

            domEvent: function () {


            },
            search: function(){
                if(nearlyTime){
                    var startDate = new Date();
                    startDate.setTime(startDate.getTime() - 1000*60*60*24*(nearlyTime === 'nearlyTime'? 1: nearlyTime));
                    eventHandle.updateHTitle(startDate, new Date());
                }
                else{
                    eventHandle.updateHTitle(eventHandle.stringToDate(meetingTimeS), eventHandle.stringToDate(meetingTimeE));
                }

                var params = {
                    nearlyTime: nearlyTime,
                    meetingTimeS: meetingTimeS,
                    meetingTimeE: meetingTimeE
                };

                //分页数据导入
                eventHandle.reportTableLine(params);

                eventHandle.totalSet(params);
            },

            //列表形式
            reportTableLine: function (objSet) {
                //表格加载
                if (!reportTableSet) {
                    table.render(common.tableInitParams({
                        elem: '#table',
                        url: baseUrl + 'sasmeetingmgr/statistics/selectDecisionOperationOverviewNew',
                        method: 'post',
                        height: '620',
                        toolbar: '',
                        cols: [
                            [
                                {type: 'numbers', title: '排序'},
                                {field: 'seName', title: '企业名称', sort: true},
                                {field: 'jchylj', title: '会议数量', sort: true},
                                {field: 'jcytlj', title: '议题数量', sort: true},
                                {field: 'jcytljtg', title: '通过数量', sort: true},
                                {field: 'jcytljhy', title: '缓议数量', sort: true},
                                {field: 'jcytljfj', title: '否决数量', sort: true}
                            ]
                        ],
                        where: {
                            seId: seId,
                            nearlyTime: nearlyTime,
                            meetingTimeS: meetingTimeS,
                            meetingTimeE: meetingTimeE
                        },
                        done: function () {

                        }
                    }))
                } else {
                    table.reload('regularReportList', {
                        page: {
                            curr: 1
                        }
                    });
                }
            },

            //统计总数
            totalSet: function (params) {
                $('.panel-2 number').text('-');
                common.fetchPost('sasmeetingmgr/statistics/selectDecisionOperationOverviewCount', {
                    seId: seId,
                    nearlyTime: nearlyTime,
                    meetingTimeS: meetingTimeS,
                    meetingTimeE: meetingTimeE
                }, function (res) {
                    var data = res.object;
                    if (data) {
                        //数据写入
                        $('.sjqysum').text((data.seId != null) ? data.seId : '-');
                        $('.sjhysum').text((data.jchylj != null) ? data.jchylj : '-');
                        $('.sjytsum').text((data.jcytlj != null) ? data.jcytlj : '-');
                        $('.jyqktg').text((data.jcytljtg != null) ? data.jcytljtg : '-');
                        $('.jyqkhy').text((data.jcytljhy != null) ? data.jcytljhy : '-');
                        $('.jyqkfj').text((data.jcytljfj != null) ? data.jcytljfj : '-');
                    }

                });

            },
            stringToDate : function(dateStr,separator){
                if(!separator){
                    separator="-";
                }
                var dateArr = dateStr.split(separator);
                var year = parseInt(dateArr[0]);
                var month;
                //处理月份为04这样的情况
                if(dateArr[1].indexOf("0") == 0){
                    month = parseInt(dateArr[1].substring(1));
                }else{
                    month = parseInt(dateArr[1]);
                }
                var day = parseInt(dateArr[2]);
                var date = new Date(year,month -1,day);
                return date;
            },
            updateHTitle: function(startDay, endDay){
                var endStr = (endDay.getMonth()+1) + "月";
                endStr += endDay.getDate() + "日";

                var startStr = "" + startDay.getFullYear() + "年";
                startStr += (startDay.getMonth()+1) + "月";
                startStr += startDay.getDate() + "日";
                $('.hTitle').html('<i></i>'+startStr+' - '+endStr+'“三重一大”决策运行概况');
            },
            pageLoad: function () {
                element.init();
                common.themeSet();

                common.buttonLimit();
                common.columnSide();

                common.dataAccessReloadModule({});

                $('.qDate[name=\'7\']').removeClass("layui-btn-primary");
                nearlyTime="7";//默认为近一周
                var startDate = new Date();
                startDate.setTime(startDate.getTime() + 1000*60*60*24*(-7));
                eventHandle.updateHTitle(startDate, new Date());

                laydate.render({
                    elem: '[name=date1]',
                    type: 'date',
                    range: true,
                    trigger: 'click',
                    done: function(value, date, endDate){
                        $('.qDate').addClass("layui-btn-primary");
                        nearlyTime = null;
                        meetingTimeS = date.year+"-"+date.month+"-"+date.date;
                        meetingTimeE = endDate.year+"-"+endDate.month+"-"+endDate.date;
                    }
                });

                tree.render({
                    showLine: true,
                    elem: '#leftTree',
                    expandOnClickNode: false,
                    url: baseUrl + 'sysmgr/sysEnterprise/selectSysEnterpriseOrganPostTreeAllList?treeType=enterpriseTree',
                    done: function () {
                        // $('#leftTree .eleTree-node-content').each(function () {
                        //     $(this).click();
                        // });

                        //默认第一条点击
                        $('#leftTree').find('.eleTree-node-content-label').eq(0).trigger('click');
                        $('#leftTree').find('.eleTree-node-content-icon').eq(0).trigger('click');

                    },
                    lazy: true,
                    load: function (data, callback) {
                        common.fetchGet(baseUrl + 'sysmgr/sysEnterprise/selectSysEnterpriseOrganPostTreeAllList?treeType=enterpriseTree' + '&id=' + data.id + "&extendAttr=" + data.extendAttr, function (res) {
                            if (res.success && res.list) {
                                callback(res.list);
                            }
                        }, function () {
                            callback([])
                        });

                    },
                    response: {// 对于后台数据重新定义名字
                        dataName: "list"
                    },
                });
                tree.on("nodeClick(leftTree)", function (obj) {
                    seId = obj.data.currentData.id;
                    $('.mainTitle').text(obj.data.currentData.name);

                    //统计总数
                    eventHandle.totalSet();

                    //分页数据导入
                    eventHandle.reportTableLine();

                });
                $('#leftTree').css({'height': $(document).height() - 103 + 'px'});

                //点击“上一工作日”等按钮
                $('.qDate').off('click').on('click', function () {
                    $('.qDate').addClass("layui-btn-primary");
                    $(this).removeClass("layui-btn-primary");
                    $('input[name=date1]').val('');
                    nearlyTime = $(this).attr("name");
                    meetingTimeS = null;
                    meetingTimeE = null;
                    eventHandle.search();

                });

                //搜索
                $('.query').off('click').on('click', function () {
                    eventHandle.search();
                    return false;
                });



            }
        };

        eventHandle.pageLoad();
        eventHandle.domEvent();


    });
