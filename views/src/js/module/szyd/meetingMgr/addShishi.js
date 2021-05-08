/**

 @Name：添加组织实施
 @Author：gaoli

 */
layui.config({
    base: '../../../src/js/',
    version: new Date().getTime()
}).extend({}).use(
    ['eleTree', 'layer', 'table', 'carousel', 'form', 'laytpl', 'common', 'element', 'laydate', 'upload'],
    function () {
        var table = layui.table;
        var form = layui.form;
        var common = layui.common;
        var element = layui.element;
        var laydate = layui.laydate;
        var upload = layui.upload;
        var carousel = layui.carousel;

        var yaChart = {};

        var baseUrl = '../../../../';

        var attendUserMap = [];

        var editMeetingId = common.getQueryVariable('meetingId');
        var subjectId = null;
        var executionId = null;


        var eventHandle = {
            //刷新责任人数
            dutyList: function (data) {
                // $('[name=tiolDutyList]').value(JSON.stringify(data));
                // $('[name=tiolDutyList]').value(JSON.stringify(data));

                var html = '';
                if (data.length > 0) {
                    $.map(data, function (item) {

                        html += '<li data-id="' + item.id + '" data-dutyId="' + (item.id ? item.id : common.uuid(false, 32)) + '" data-name="' + item.name + '" data-dept="' + item.dept + '">\n' +
                            '          <div class="userHeader">\n' +
                            '              <img alt="" src="../../../images/defaultHead.png">\n' +
                            '          </div>\n' +
                            '          <div class="userDes">\n' +
                            '              <p class="userName">' + item.name + '</p>\n' +
                            '              <p class="userText">\n' +
                            '                  <span class="text">' + ((item.dept && item.dept != 'undefined') ? item.dept : '-') + '</span>\n' +
                            '              </p>\n' +
                            '          </div>\n' +
                            '<div class="deleteUserBox dutyDelete" style="display: block"><i class="fa fa-close"></i></div>' +
                            '</li>';
                    });
                    //debugger
                    $('.dutyUserList').append(html);
                }

                //责任人删除
                $('.dutyDelete').off().on('click', function () {
                    $(this).parent().remove();
                })

            },
            fileDataSet: function (parent, type, id) {
                common.fetchGet('dfsmgr/file/getFileByResIdAndFileType?id=' + id + '&type=' + type, function (res) {

                    var data = res.list || [];

                    var html = '';

                    if (data.length > 0) {

                        $.map(data, function (item) {
                            var fileName = item.fiName + '.' + item.fiSuffix;

                            html += '<li data-fiId="' + item.fiId + '" fileName="' + fileName + '">' +
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

            //新增编辑议案
            shishiFun: function (type, dataSubjectId) {

                //清空数据
                var parentBox = $('.addYABox');
                parentBox.find('input[type=text]').val('');
                parentBox.find('textarea').val('');


                //添加实施情况
                $('#addShiStatus').off().on('click', function () {
                    executionId = common.uuid(false, 32);
                    eventHandle.shishiBox();
                });

                //组织实施 点击编辑按钮
                $(document).off('click', '.shishiEdit');
                $(document).on('click', '.shishiEdit', function () {
                    executionId = $(this).attr('executionId');
                    eventHandle.shishiBox(executionId);
                });

                //删除组织实施  点击删除按钮
                $(document).off('click', '.shishiDelete');
                $(document).on('click', '.shishiDelete', function () {
                    eventHandle.closeShishiBox();

                    var executionIds = $(this).attr('executionId');
                    layer.confirm('确定删除?', {icon: 3, title: '提示', offset: '150px'}, function (index) {
                        var layerLoader = common.layerLoader();
                        common.fetchPost('sasmeetingmgr/tiolExecution/deleteTiolExecutionByIds', {
                            executionIds: executionIds
                        }, function (res) {
                            layer.close(layerLoader);
                            if (res.success) {
                                eventHandle.shishiTimeLine();
                                layer.msg('删除成功');
                            } else {
                                layer.alert(res.resultMessage);
                            }
                        }, function () {
                            layer.close(layerLoader);
                        });
                        layer.close(index);
                    });
                });

                //保存组织实施
                $('#saveShishi').off().on('click', function () {

                    var curentexecutionId = null;
                    if (executionId) {
                        curentexecutionId = executionId;
                    } else {
                        curentexecutionId = common.uuid(null, 32);
                    }
                    var params = {
                        subjectId: subjectId,
                        startTime: $('[name=startTime]').val(),
                        implementationStatus: $('[name=implementationStatus]:checked').val(),
                        effect: $('[name=effect]').val(),
                        description: $('[name=description]').val(),
                        executionId: curentexecutionId
                    };

                    common.fetchPost('sasmeetingmgr/tiolExecution/saveTiolExecutionInfo', params, function (res) {

                        eventHandle.closeShishiBox();
                        eventHandle.shishiTimeLine();

                    });


                });


                //新增议题保存

                if (type === 'edit') {
                    subjectId = dataSubjectId;
                    //议题信息写入

                    common.fetchPost('sasmeetingmgr/tiolSubject/selectTiolSubjectById', {
                        subjectId: subjectId
                    }, function (res) {
                        var data = res.object;
                        $('[name=subjectName]').val(data.subjectName);
                        $('[name=itemId]').val(data.itemId);
                        $('[name=relSubjectId]').val(data.relSubjectId);
                        $('[name=subjectResult]').val(data.subjectResult);

                        //意见情况
                        common.fetchGet('dfsmgr/file/getFileByResIdAndFileType?id=' + subjectId + '&type=OPINION', function (res) {
                            var data = res.list || [];
                            var html = '';
                            if (data.length > 0) {
                                $.map(data, function (item) {
                                    var fileName = item.fiName + '.' + item.fiSuffix;
                                    html += '<div class="primary a-link" data-fiId="' + item.fiId + '">' + fileName + '</div>'
                                });
                                $('.optionFileList').empty().html(html);
                            }
                        }, false);

                        //议题材料
                        common.fetchGet('dfsmgr/file/getFileByResIdAndFileType?id=' + subjectId + '&type=SUBJECT', function (res) {
                            var data = res.list || [];
                            var html = '';
                            if (data.length > 0) {
                                $.map(data, function (item) {
                                    var fileName = item.fiName + '.' + item.fiSuffix;
                                    html += '<div class="primary a-link" data-fiId="' + item.fiId + '">' + fileName + '</div>'
                                });
                                $('.subjectFileList').empty().html(html);
                            }
                        }, false);

                        //是否听取意见
                        $('.adoptFlag').text(data.adoptFlag === "0" ? "是" : "否");
                        //议题决议
                        $('.subjectResult').text(data.subjectResult || '-');

                        //专项名称
                        $('.specialName').text(data.specialName || '-');
                        //任务来源
                        $('.sourceName').text(data.sourceName || '-');

                        //列席人
                        common.fetchPost('sasmeetingmgr/tiolAttendance/selectTiolAttendanceList', {
                            subjectId: subjectId
                        }, function (res) {
                            var html = [];
                            var data = res.list || [];
                            if (data.length > 0) {
                                $.map(data, function (item) {
                                    html.push(item.attendanceName);
                                });
                                $('.selectTiolAttendanceList').empty().html(html.join(','));
                            }
                        }, function (err) {
                            layer.alert(err.resultMessage);
                        });


                        if (data.superviseFlag === 0 || data.superviseFlag === "0") {
                            $('#shishiMainArea').hide();
                        } else if (data.superviseFlag === '1' || data.superviseFlag === 1) {
                            $('#shishiMainArea').show();
                        }
                        form.render('radio');
                    });

                    //上传意见情况
                    eventHandle.fileDataSet($('#meetingOptionBox ul'), 'OPINION', subjectId);

                    //上传议题材料
                    eventHandle.fileDataSet($('#meetingIssueBox ul'), 'SUBJECT', subjectId);

                    //组织实施时间轴
                    eventHandle.shishiTimeLine(subjectId);


                } else if (type === 'add') {
                    subjectId = common.uuid(null, 32);
                }


            },
            //组织实施时间轴
            shishiTimeLine: function () {
                var html = '';
                var parent = $('.verticalTimeLine');
                parent.empty();
                common.fetchPost('sasmeetingmgr/tiolExecution/selectExectionAndDutyList', {
                    subjectId: subjectId
                }, function (res) {

                    var data = res.list || [];
                    if (data.length > 0) {
                        $('.emptyTimeLine').hide();
                        $.map(data, function (item) {

                            //责任人 数据写入

                            // suId:$(item).attr('data-id'),
                            //     name: $(item).attr('data-name'),
                            //     soId: '',//部门id
                            //     organ: $(item).attr('data-organ'),
                            //     dutyId:$(item).attr('data-dutyId'),
                            //     executionId: curentexecutionId

                            var tiolDutyListHtml = '';
                            if (item.tiolDutyList && item.tiolDutyList.length > 0) {
                                $.map(item.tiolDutyList, function (dat) {
                                    tiolDutyListHtml += '<div><div class="userHeader small-size" style="padding: 0">' +
                                        '                  <img src="../../../images/defaultUser.jpg">' +
                                        '              </div>' +
                                        '              <div style="display: inline-block">责任人：' + dat.name + '--\n' + (dat.dept ? dat.dept : '无') + '\n' +
                                        '              </div></div>\n';
                                });
                            } else {
                                tiolDutyListHtml = '<div style="height: 50px">无责任人</div>'
                            }
                            //时间进度写入
                            var timeFile = '';
                            common.fetchGet('dfsmgr/file/getFileByResIdAndFileType?id=' + item.executionId + '&type=timeFile', function (res) {

                                var data = res.list || [];

                                if (data.length > 0) {

                                    $.map(data, function (item) {
                                        var fileName = item.fiName + '.' + item.fiSuffix;

                                        timeFile += '<div class="singleFileArea" data-fiId="' + item.fiId + '" fileName="' + fileName + '">' +
                                            '      <div class="fileSingleBox">\n' +
                                            '          <p class="fileName" title="' + fileName + '">' + fileName + '</p>\n' +
                                            '          <p>\n' +
                                            '              <i class="fa fa-file-text-o"></i><b\n' +
                                            '                  class="fileSize">' + common.bytesToSize(item.fiSize) + '</b>\n' +
                                            '          </p>\n' +
                                            '      </div>\n' +
                                            '  </div>';
                                    });
                                }

                            }, false, false);

                            //正式文件写入
                            var zsFile = '';
                            common.fetchGet('dfsmgr/file/getFileByResIdAndFileType?id=' + item.executionId + '&type=formalFile', function (res) {

                                var data = res.list || [];

                                if (data.length > 0) {

                                    $.map(data, function (item) {
                                        var fileName = item.fiName + '.' + item.fiSuffix;

                                        zsFile += '<div class="singleFileArea" data-fiId="' + item.fiId + '" fileName="' + fileName + '">' +
                                            '      <div class="fileSingleBox">\n' +
                                            '          <p class="fileName" title="' + fileName + '">' + fileName + '</p>\n' +
                                            '          <p>\n' +
                                            '              <i class="fa fa-file-text-o"></i><b\n' +
                                            '                  class="fileSize">' + common.bytesToSize(item.fiSize) + '</b>\n' +
                                            '          </p>\n' +
                                            '      </div>\n' +
                                            '  </div>';
                                    });
                                }

                            }, false, false);




                            var statusHtml = '';
                            if (item.implementationStatus === "0") {
                                statusHtml = ' <div class="status status-done">启动</div></td>';
                            } else if (item.implementationStatus === "1") {
                                statusHtml = ' <div class="status status-done">执行</div></td>';
                            } else if (item.implementationStatus === "2") {
                                statusHtml = ' <div class="status status-done">完成</div></td>';
                            } else if (item.implementationStatus === "3") {
                                statusHtml = ' <div class="status status-ing">延期</div></td>';
                            } else if (item.implementationStatus === "4") {
                                statusHtml = ' <div class="status status-ing">停止</div></td>';
                            }

                            html += '<div class="timeItem" executionId="' + item.executionId + '">\n' +
                                '       <i class="lineIcon fa fa-send-o"></i>\n' +
                                '       <span class="time">' + common.dateFormat(item.startTime).substring(0, 10) + '</span>\n' +
                                '       <div class="operArea">\n' +
                                '           <i class="fa fa-edit shishiEdit" title="编辑" executionId="' + item.executionId + '"></i>\n' +
                                '           <i class="fa fa-trash shishiDelete" title="删除" executionId="' + item.executionId + '"></i>\n' +
                                '       </div>\n' +
                                '       <div class="content">\n' +
                                '           <table class="layui-table custom-table">\n' +
                                '               <tr>\n' +
                                '                   <td class="bg-f7" colspan="2" style="min-height: 50px">' + tiolDutyListHtml + statusHtml + '</td>\n' +
                                '                   <td rowspan="3" style="vertical-align: top;width: 140px">\n' +
                                '                       <div class="custom-title">时间进度</div>\n' +
                                '                       <div class="fileUploadList">\n' +
                                '                           <ul class="clearFix"style="border-bottom: none">' + timeFile + '</ul>\n' +
                                '                       </div>\n' +
                                '                       <div class="custom-title">正式文件</div>\n' +
                                '                       <div class="fileUploadList">\n' +
                                '                           <ul class="clearFix" style="border-bottom: none">' + zsFile + '</ul>\n' +
                                '                       </div>\n' +
                                '                   </td>\n' +
                                '               </tr>\n' +
                                '               <tr><td class="bg-f7" style="width: 100px">预期成效：</td><td>' + (item.effect ? item.effect : '-') + '</td></tr>' +
                                '               <tr><td class="bg-f7" style="width: 100px">实施情况：</td><td>' + (item.description ? item.description : '-') + '</td></tr>\n' +
                                '           </table></div>' +
                                '</div>';
                        });

                        //debugger
                        parent.empty().html(html);


                    } else {
                        $('.emptyTimeLine').show();
                    }
                });
            },

            //关闭组织实施编辑面板
            closeShishiBox: function () {
                executionId = null;
                $('.verticalTimeLine').removeClass('toggleRight');
                $('.addShishi').css({
                    width: '0',
                    display: 'none'
                })
            },

            //议题信息列表导入
            subjectList: function (currentSubject, firstClick) {
                common.fetchPost('sasmeetingmgr/tiolSubject/selectTiolSubjectAndDeliberationCountList', {
                    meetingId: editMeetingId
                }, function (res) {

                    var data = res.list || [];

                    var html = '';

                    var chartArr = [], chartMap = {};

                    if (data.length > 0) {
                        var arr = [];
                        $.map(data, function (dataItem) {
                            if (dataItem.superviseFlag === 1) {
                                arr.push(dataItem);
                            }
                        });

                        data = common.arraySplit(arr, 3) || [];


                        for (var i = 0; i < data.length; i++) {
                            var dataLine = data[i];
                            html += '<div class="item"> <ul class="cardSwiperUl">';

                            $.map(dataLine, function (item, index) {
                                var isPass = '';
                                if (item.passFlag === '1') {
                                    isPass = 'passIcon';
                                } else {
                                    isPass = 'unpassIcon';
                                }

                                chartArr.push('chart' + item.subjectId);

                                chartMap['chart' + item.subjectId] = item.deliberationList;

                                html += '<li data-subjectId="' + item.subjectId + '">' +
                                    '<div class="box-close-btn subjectDeleteBtn" data-subject="' + item.subjectId + '"><i class="fa fa-close"></i></div>' +
                                    '      <div class="title">' +
                                    '          <b>编码：</b><span>' + item.subjectCode + '</span><i class=" fa fa-snapchat ' + (item.ERR_STS === '1' ? 'red' : 'green') + '"></i>' +
                                    '      </div>\n' +
                                    '      <div class="content">\n' +
                                    '          <p class="des" title="' + item.subjectName + '">' + item.subjectName + '</p>' +
                                    '          <div class="chartArea">\n' +
                                    '              <div id="chart' + item.subjectId + '" style="width: 100%;height: 130px">\n' +
                                    '              </div>\n' +
                                    '          </div>\n' +
                                    '          <i class="status ' + isPass + '"></i>\n' +
                                    '      </div>\n' +
                                    '  </li>';
                            });

                            html += '</ul></div>';
                        }

                        $('.cardSwiperWrap').empty().html(html);


                        //议案删除
                        $('.subjectDeleteBtn').off().on('click', function (e) {
                            e.stopPropagation();
                            var id = $(this).attr('data-subject');
                            layer.confirm('确定删除该议题?', {icon: 3, title: '提示', offset: '150px'}, function (index) {
                                var layerLoader = common.layerLoader();

                                common.fetchPost('sasmeetingmgr/tiolSubject/deleteTiolSubjectByIds', {
                                    subjectIds: id
                                }, function (res) {
                                    layer.close(layerLoader);
                                    if (res.success) {
                                        eventHandle.subjectList();
                                        layer.msg('删除成功');
                                    } else {
                                        layer.alert(res.resultMessage);
                                    }
                                }, function () {
                                    layer.close(layerLoader);
                                });
                                layer.close(index);
                            });
                        });
                        var yaChartList = [];
                        if (chartArr.length > 0) {
                            for (var p = 0; p < chartArr.length; p++) {
                                yaChart[chartArr[p]] = echarts.init(document.getElementById(chartArr[p]), 'custom');

                                var curData = chartMap[chartArr[p]], curArr = [];
                                if (!curData) {
                                    curArr = [
                                        {
                                            "value": "0",
                                            "name": "同意"
                                        },
                                        {
                                            "value": "0",
                                            "name": "不同意"
                                        }
                                    ];
                                } else {
                                    for (var i = 0; i < curData.length; i++) {
                                        curArr.push({
                                            value: curData[i]['num'],
                                            name: curData[i]['name']
                                        })
                                    }
                                }

                                yaChart[chartArr[p]].setOption({
                                    tooltip: {
                                        trigger: 'item',
                                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                                    },
                                    series: [
                                        {
                                            name: '通过率',
                                            type: 'pie',
                                            radius: '55%',
                                            center: ['50%', '40%'],
                                            data: curArr,
                                            itemStyle: {
                                                emphasis: {
                                                    shadowBlur: 10,
                                                    shadowOffsetX: 0,
                                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                                }
                                            }
                                        }
                                    ]
                                });

                                yaChartList.push(yaChart[chartArr[p]])
                            }
                        }

                        $(window).resize(function () {
                            common.chartResize(chartArr, yaChartList);
                        });
                        $(window).trigger('resize');


                        //轮播区域
                        carousel.render({
                            elem: '#cardSwiper',
                            width: '100%',
                            arrow: 'hover',
                            height: '230px',
                            anim: 'default',
                            autoplay: false,
                            indicator: 'outside',
                            trigger: 'click'
                        });

                        if (currentSubject) {
                            //触发议题显示项
                            $('.cardSwiperWrap').find('[data-subjectId=' + currentSubject + ']').trigger('click');
                        }
                        if (firstClick) {
                            $('.cardSwiperUl').eq(0).find('li').eq(0).trigger('click');
                        }
                    }

                });
            },

            //实施情况操作面板展示
            shishiBox: function (id) {
                $('.verticalTimeLineShishi').addClass('toggleRight');
                $('.addShishi').css({
                    width: '360px',
                    display: 'block'
                });
                //清空数据
                form.val('shishiForm', {
                    startTime: '',
                    effect: '',
                    description: '',
                    implementationStatus: ''
                });

                //清空数据
                $('#timeFileUl ul li[data-fiid]').remove();
                $('#zsFileBox ul li[data-fiid]').remove();
                $('#timeFile').show();
                $('#zsFile').show();
                $('.dutyUserList').empty();

                //当前时间轴数据带入
                if (id) {
                    common.fetchPost('sasmeetingmgr/tiolExecution/selectTiolExecutionById', {executionId: id}, function (res) {
                        var data = res.object;
                        //数据写入

                        $('[name=startTime]').val(common.dateFormat(data.startTime).substring(0, 10));
                        $('[name=effect]').val(data.effect);
                        $('[name=description]').val(data.description);
                        form.val('shishiForm', {
                            implementationStatus: data.implementationStatus
                        });


                        //时间进度写入
                        var timeFile = '';
                        common.fetchGet('dfsmgr/file/getFileByResIdAndFileType?id=' + id + '&type=timeFile', function (res) {

                            var data = res.list || [];

                            if (data.length > 0) {

                                $('#timeFile').hide();
                                $.map(data, function (item) {
                                    var fileName = item.fiName + '.' + item.fiSuffix;

                                    timeFile += '<li data-fiId="' + item.fiId + '" fileName="' + fileName + '">' +
                                        '      <div class="fileSingleBox">\n' +
                                        '          <p class="fileName" title="' + fileName + '">' + fileName + '</p>\n' +
                                        '          <p>\n' +
                                        '              <i class="fa fa-file-text-o"></i><b\n' +
                                        '                  class="fileSize">' + common.bytesToSize(item.fiSize) + '</b>\n' +
                                        '          </p>\n' +
                                        '          <div class="box-close-btn fileDelete"><i class="fa fa-close"></i></div>\n' +
                                        '      </div>\n' +
                                        '  </li>';
                                });
                                $('#timeFileUl ul').append(timeFile);
                            } else {

                                $('#timeFile').show();
                            }

                        }, false, false);

                        //正式文件写入
                        var zsFile = '';
                        common.fetchGet('dfsmgr/file/getFileByResIdAndFileType?id=' + id + '&type=formalFile', function (res) {

                            var data = res.list || [];

                            if (data.length > 0) {
                                $('#zsFile').hide();
                                $.map(data, function (item) {
                                    var fileName = item.fiName + '.' + item.fiSuffix;

                                    zsFile += '<li  data-fiId="' + item.fiId + '" fileName="' + fileName + '">' +
                                        '      <div class="fileSingleBox">\n' +
                                        '          <p class="fileName" title="' + fileName + '">' + fileName + '</p>\n' +
                                        '          <p>\n' +
                                        '              <i class="fa fa-file-text-o"></i><b\n' +
                                        '                  class="fileSize">' + common.bytesToSize(item.fiSize) + '</b>\n' +
                                        '          </p>\n' +
                                        '          <div class="box-close-btn fileDelete"><i class="fa fa-close"></i></div>\n' +
                                        '      </div>\n' +
                                        '  </li>';
                                });
                                $('#zsFileBox ul').append(zsFile);
                            } else {
                                $('#zsFile').show();
                            }

                        }, false, false);

                        //责任人写入
                        var arr = [];
                        if (data.tiolDutyList && data.tiolDutyList.length > 0) {
                            $.map(data.tiolDutyList, function (item) {
                                arr.push({
                                    id: item.suId,
                                    name: item.name,
                                    job: item.position,
                                    dept: item.dept
                                });
                            });
                        }

                        eventHandle.dutyList(arr);



                    });
                }

            },

            domEvent: function () {

                //添加实施情况
                $('#addShiStatus').off().on('click', function () {
                    executionId = null;
                    eventHandle.shishiBox();
                });

                //保存组织实施
                $('#saveShishi').off().on('click', function () {

                    var curentexecutionId = null;
                    if (executionId) {
                        curentexecutionId = executionId;
                    } else {
                        curentexecutionId = common.uuid(null, 32);
                    }
                    var params = {
                        subjectId: subjectId,
                        startTime: $('[name=startTime]').val(),
                        implementationStatus: $('[name=implementationStatus]:checked').val(),
                        effect: $('[name=effect]').val(),
                        description: $('[name=description]').val(),
                        executionId: curentexecutionId
                    };

                    common.fetchPost('sasmeetingmgr/tiolExecution/saveTiolExecutionInfo', params, function (res) {
                        layer.msg('保存成功');
                        // eventHandle.closeShishiBox();
                        eventHandle.shishiTimeLine();

                    });


                });

                $('.closeAddYA').off().on('click', function () {
                    $('.addYABox').fadeOut();
                });
                $('.closeShishiBox').off().on('click', function () {
                    eventHandle.closeShishiBox();
                });


                //实施组织树责任人
                common.userSelect({
                    elem: $('#shishiPeople'),
                    success: function (data) {

                        //保存人员信息
                        var arr = [];
                        if (data.length > 0) {
                            $.map(data, function (item) {
                                arr.push({
                                    id: item.id,
                                    name: item.name,
                                    job: item.position,
                                    dept: item.organ
                                });
                            });
                        }
                        //刷新参会人员树
                        eventHandle.dutyList(arr);


                        return false;
                    }
                });

                $(document).on('click', '.cardSwiperUl li', function () {
                    $(this).siblings().removeClass('selected');
                    $('[data-subjectid]').removeClass('selected');
                    $(this).addClass('selected');
                    eventHandle.shishiFun('edit', $(this).attr('data-subjectid'));
                });


                //附件删除
                $(document).off('click', '.fileDelete');
                $(document).on('click', '.fileDelete', function () {
                    var current = $(this).parent().parent();
                    var fileName = current.attr('fileName');
                    var fileId = current.attr('data-fiId');
                    layer.confirm("确定删除【 " + fileName + "】文件?", {
                        icon: 3,
                        title: '提示',
                        offset: '150px'
                    }, function (index) {
                        layer.close(index);
                        common.fetchDelete("/dfsmgr/file/deleteById?id=" + fileId, function (res) {
                            if (res.success) {

                                if (current.parent().parent().is('#zsFileBox')) {
                                    $('#zsFile').show();
                                }
                                if (current.parent().parent().is('#timeFileUl')) {
                                    $('#timeFile').show();
                                }
                                layer.msg('删除成功');


                                current.remove();
                            } else {
                                layer.msg('删除失败');
                            }
                        });
                    });
                });

            },

            pageLoad: function () {
                element.init();
                common.themeSet();

                common.buttonLimit();
                common.columnSide();
//上传时间进度
                common.fileUploadList({
                    elem: '#timeFile',
                    appendArea: $('#timeFileUl ul'),
                    url: baseUrl + 'zuul/dfsmgr/file/fileUpload',
                    auto: true,
                    data: {
                        resId: function () {
                            return executionId;
                        },
                        fiFileType: 'timeFile'
                    }
                }, function () {
                    $('#timeFile').hide()
                });
                //上传正式文件
                common.fileUploadList({
                    elem: '#zsFile',
                    appendArea: $('#zsFileBox ul'),
                    url: baseUrl + 'zuul/dfsmgr/file/fileUpload',
                    auto: true,
                    data: {
                        resId: function () {
                            return executionId;
                        },
                        fiFileType: 'formalFile'
                    },

                }, function () {
                    $('#zsFile').hide()
                });

                common.dataAccessReloadModule({});
                form.render();

                //议题信息导入
                eventHandle.subjectList(false, 'firstClick');

            }
        };

        eventHandle.pageLoad();
        eventHandle.domEvent();


    });
