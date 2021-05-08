/**

 @Name：会议信息填报
 @Author：gaoli

 */
layui.config({
    base: '../../../js/',
    version: new Date().getTime()
}).extend({
    tableSpan: 'lib/tableSpan',
    formSelects: 'lib/formSelects-v4'
}).use(
    ['eleTree', 'layer', 'table', 'carousel', 'form', 'laytpl', 'common', 'element', 'laydate', 'upload', 'tableSpan', 'formSelects'],
    function () {
        var table = layui.table;
        var form = layui.form;
        var common = layui.common;
        var element = layui.element;
        var laydate = layui.laydate;
        var upload = layui.upload;
        var formSelects = layui.formSelects;

        var tableSpan = layui.tableSpan;

        var carousel = layui.carousel;

        //当前参会人员数据
        var attendeeList = [];

        //当前投票人数据
        var deliberationArr = [];
        //当前列席人数据
        var attendanceArr = [];
        var attendeeArr = [];

        var yaChart = {};

        var baseUrl = '../../../../';

        var attendUserMap = [];


        var editMeetingId = common.getQueryVariable('meetingId');
        var subjectId = null;
        var executionId = null;

        var eventHandle = {

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

            //列席人员
            selectTiolAttendanceList: function () {
                attendanceArr = [];
                common.fetchPost('sasmeetingmgr/tiolAttendance/selectTiolAttendanceList', {
                    subjectId: subjectId
                }, function (res) {
                    var html = '';
                    var data = res.list || [];
                    $('.attendanceListUl').empty();
                    if (data.length > 0) {
                        $('.emptyBox2').hide();
                        $.map(data, function (item) {
                            attendanceArr.push(item.userId);
                            html += '<li data-attendanceId="' + item.attendanceId + '" style="position: relative">' +
                                '      <div class="attendBar1" data-reason="' + (item.reason ? item.reason : '') + '" data-attendanceId="' + item.attendanceId + '" data-participantsType="' + item.participantsType + '"><div class="userHeader">' +
                                '          <img alt="" src="../../../images/defaultHead.png">' +
                                '      </div>' +
                                '      <div class="userDes">' +
                                '          <p class="userName">' + item.attendanceName + '</p>' +
                                '          <p class="userText">' +
                                '              <span class="text">' + (item.position ? item.position : '-') + '</span>' +
                                '          </p>' +
                                '      </div></div>' +
                                '<div class="deleteUserBox deleteAttend1" style="" data-attendanceId="' + item.attendanceId + '"><i class="fa fa-close"></i></div>' +
                                '</li>';
                        });

                        $('.attendanceListUl').empty().html(html);

                        //删除
                        $('.deleteAttend1').off().on('click', function () {
                            var attendanceId = $(this).attr('data-attendanceId');
                            layer.confirm('确定删除?', {icon: 3, title: '提示', offset: '150px'}, function (index) {
                                var layerLoader = common.layerLoader();
                                common.fetchPost('sasmeetingmgr/tiolAttendance/deleteTiolAttendanceByIds', {
                                    attendanceIds: attendanceId,
                                    // meetingId:editMeetingId
                                }, function (res) {
                                    layer.close(layerLoader);
                                    if (res.success) {
                                        //刷新参会人员树
                                        eventHandle.selectTiolAttendanceList();
                                        layer.alert('删除成功');
                                    } else {
                                        layer.alert(res.resultMessage);
                                    }
                                }, function () {
                                    layer.close(layerLoader);
                                });
                                layer.close(index);
                            });
                        });

                    } else {
                        $('.emptyBox2').show();
                    }

                }, function (err) {
                    layer.alert(err.resultMessage);
                });
            },

            //投票人
            deliberationInfo: function () {
                deliberationArr = [];
                common.fetchPost('sasmeetingmgr/tiolDeliberation/selectTiolDeliberationList', {
                    subjectId: subjectId
                }, function (res) {
                    var html = '';
                    var data = res.list || [];
                    $('.voteListUl').empty();


                    if (data.length > 0) {
                        $('.emptyBox3').hide();
                        $.map(data, function (item) {
                            deliberationArr.push(item.userId);

                            html += '<li data-deliberationId="' + item.deliberationId + '" style="position: relative">' +
                                '      <div class="attendBar2" data-reason="' + (item.reason ? item.reason : '') + '" data-deliberationId="' + item.deliberationId + '" data-deliberationResult="' + item.deliberationResult + '"><div class="userHeader">' +
                                '          <img alt="" src="../../../images/defaultHead.png">' +
                                '      </div>' +
                                '      <div class="userDes">' +
                                '          <p class="userName">' + item.deliberationPersonnel + '</p>' +
                                '          <p class="userText">' +
                                '              <span class="text">' + (item.positionName ? item.positionName : '-') + '</span>' +
                                '          </p>' +
                                '      </div></div>' +
                                '<div class="deleteUserBox deleteAttend2" style="" data-deliberationId="' + item.deliberationId + '"><i class="fa fa-close"></i></div>' +
                                '</li>';
                        });

                        $('.voteListUl').empty().html(html);

                        //删除
                        $('.deleteAttend2').off().on('click', function () {
                            var deliberationid = $(this).attr('data-deliberationid');
                            layer.confirm('确定删除?', {icon: 3, title: '提示', offset: '150px'}, function (index) {
                                var layerLoader = common.layerLoader();
                                common.fetchPost('sasmeetingmgr/tiolDeliberation/deleteTiolDeliberationByIds', {
                                    deliberationIds: deliberationid,
                                    // meetingId:editMeetingId
                                }, function (res) {
                                    layer.close(layerLoader);
                                    if (res.success) {

                                        eventHandle.deliberationInfo();
                                        layer.alert('删除成功');
                                    } else {
                                        layer.alert(res.resultMessage);
                                    }
                                }, function () {
                                    layer.close(layerLoader);
                                });
                                layer.close(index);
                            });
                        });
                        //编辑
                        $('.attendBar2').off().on('click', function () {
                            var deliberationId = $(this).attr('data-deliberationId');
                            var deliberationResult = $(this).attr('data-deliberationResult');
                            var reason = $(this).attr('data-reason');
                            var attendBar = layer.open({
                                title: '投票结果',
                                type: 1,
                                area: ['500px'],//高度自适应
                                shadeClose: false,
                                content: '<div class="gloBg" style="padding: 10px"><form class="layui-form form-theme-table" lay-filter="participantsType">' +
                                    '<div class="layui-form-item">\n' +
                                    '<input type="hidden" name="deliberationId">' +
                                    '                    <label class="layui-form-label">投票意见:</label>\n' +
                                    '                    <div class="layui-input-block">\n' +
                                    '                        <input type="radio" name="deliberationResult" value="1" title="同意" checked="">\n' +
                                    '                            <input type="radio" name="deliberationResult" value="0" title="不同意">\n' +
                                    '                    </div>\n' +
                                    '                </div>' +
                                    '<div class="layui-form-text">\n' +
                                    '                    <label class="layui-form-label">意见详情:</label>\n' +
                                    '                    <div class="layui-input-block"><textarea name="reason" class="layui-textarea"></textarea></div>\n' +
                                    '                </div>' +
                                    '</form></div>',
                                btn: ['确定', '取消'],
                                btnAlign: 'c',
                                success: function (lay) {
                                    var parent = $(lay.selector);
                                    //数据导入
                                    parent.find('[name=deliberationId]').val(deliberationId);
                                    form.val('deliberationResult', {
                                        deliberationResult: deliberationResult
                                    });
                                    parent.find('[name=reason]').val(reason ? reason : '');
                                    form.render('radio');
                                },
                                yes: function (index, layero) {
                                    var parent = $(layero);

                                    var params = {
                                        reason: parent.find('[name=reason]').val(),
                                        deliberationId: parent.find('[name=deliberationId]').val(),
                                        deliberationResult: parent.find('[name=deliberationResult]:checked').val(),
                                    };

                                    common.fetchPost('sasmeetingmgr/tiolDeliberation/saveTiolDeliberationInfo', params, function (res) {
                                        if (res.success) {
                                            layer.close(attendBar);
                                            // eventHandle.attendMan();
                                            eventHandle.deliberationInfo();
                                        } else {
                                            layer.alert(res.resultMessage);
                                        }
                                    });


                                    layer.close(attendBar)
                                },
                            });
                        });

                    } else {
                        $('.emptyBox3').show();
                    }

                }, function (err) {
                    layer.alert(err.resultMessage);
                });
            },

            //参会人员
            attendMan: function () {
                if (editMeetingId) {
                    common.fetchPost('sasmeetingmgr/tiolAttendee/selectTiolAttendeeArraylist', {
                        meetingId: editMeetingId
                    }, function (res) {
                        var html = '';
                        var data = res.list || [];
                        $('.userSelectListUl').empty();
                        if (data.length > 0) {
                            $('.emptyBox1').hide();
                            attendeeList = data;
                            $.map(data, function (item) {
                                attendUserMap[item.attendeeId] = item;
                                attendeeArr.push(item.userId);
                                var isAttend;

                                if (item.participantsType === 'ATTENDEE') {
                                    isAttend = '<span class="status "><i class="fa fa-check-circle green"></i></span>'
                                } else {
                                    isAttend = '<span class="status status-danger">缺席</span>'
                                }

                                html += '<li data-attendeeId="' + item.attendeeId + '" style="position: relative">' +
                                    '      <div class="attendBar" data-attendeeName="' + item.attendeeName + '" data-reason="' + (item.reason ? item.reason : '') + '" data-attendeeId="' + item.attendeeId + '" data-participantsType="' + item.participantsType + '"><div class="userHeader">' +
                                    '          <img alt="" src="../../../images/defaultHead.png">' +
                                    '      </div>' +
                                    '      <div class="userDes">' +
                                    '          <p class="userName">' + (item.attendeeName ? item.attendeeName : '-') + '</p>' +
                                    '          <p class="userText">' +
                                    '              <span class="text">' + (item.attendeeJob ? item.attendeeJob : '-') + '</span>' + isAttend +
                                    '          </p>' +
                                    '      </div></div>' +
                                    '<div class="deleteUserBox deleteAttend" style="" data-attendeeId="' + item.attendeeId + '"><i class="fa fa-close"></i></div>' +
                                    '</li>';
                            });


                            $('.userSelectListUl').empty().html(html);

                            //删除参会人员
                            $('.deleteAttend').off().on('click', function () {
                                var attendeeId = $(this).attr('data-attendeeId');
                                layer.confirm('确定删除?', {icon: 3, title: '提示', offset: '150px'}, function (index) {
                                    var layerLoader = common.layerLoader();
                                    common.fetchPost('sasmeetingmgr/tiolAttendee/deleteTiolAttendeeByIds', {
                                        attendeeIds: attendeeId,
                                        // meetingId:editMeetingId
                                    }, function (res) {
                                        layer.close(layerLoader);
                                        if (res.success) {
                                            //刷新参会人员树
                                            eventHandle.attendMan();
                                            layer.alert('删除成功');
                                        } else {
                                            layer.alert(res.resultMessage);
                                        }
                                    }, function () {
                                        layer.close(layerLoader);
                                    });
                                    layer.close(index);
                                });
                            });

                            //编辑参会人员信息
                            $('.attendBar').off().on('click', function () {
                                var dataAttendeeId = $(this).attr('data-attendeeId');
                                var participantsType = $(this).attr('data-participantsType');
                                var attendeeName = $(this).attr('data-attendeeName');
                                var reason = $(this).attr('data-reason');
                                var attendBar = layer.open({
                                    title: '出席情况',
                                    type: 1,
                                    area: ['500px'],//高度自适应
                                    shadeClose: false,
                                    content: '<div class="gloBg" style="padding: 10px"><form class="layui-form form-theme-table" lay-filter="participantsType">' +
                                        '<div class="layui-form-item">\n' +
                                        '<input type="hidden" name="attendeeName">' +
                                        '<input type="hidden" name="attendeeId">' +
                                        '                    <label class="layui-form-label">是否出席:</label>\n' +
                                        '                    <div class="layui-input-block">\n' +
                                        '                        <input type="radio" name="participantsType" value="ATTENDEE" title="是" checked="">\n' +
                                        '                            <input type="radio" name="participantsType" value="ABSENT" title="否">\n' +
                                        '                    </div>\n' +
                                        '                </div>' +
                                        '<div class="layui-form-text">\n' +
                                        '                    <label class="layui-form-label">缺席原因:</label>\n' +
                                        '                    <div class="layui-input-block"><textarea name="reason" class="layui-textarea"></textarea></div>\n' +
                                        '                </div>' +
                                        '</form></div>',
                                    btn: ['确定', '取消'],
                                    btnAlign: 'c',
                                    success: function (lay) {
                                        var parent = $(lay.selector);
                                        //数据导入
                                        parent.find('[name=attendeeId]').val(dataAttendeeId);
                                        form.val('participantsType', {
                                            participantsType: participantsType,
                                            attendeeName: attendeeName
                                        });
                                        //debugger
                                        parent.find('[name=reason]').val(reason ? reason : '');
                                        form.render('radio');
                                    },
                                    yes: function (index, layero) {
                                        var parent = $(layero);

                                        var params = {};
                                        if (parent.find('[name=participantsType]:checked').val() === 'ATTENDEE') {
                                            params = {
                                                meetingId: editMeetingId,
                                                attendeeName: parent.find('[name=attendeeName]').val(),
                                                attendeeId: parent.find('[name=attendeeId]').val(),
                                                participantsType: parent.find('[name=participantsType]:checked').val()
                                            };
                                        } else {
                                            params = {
                                                meetingId: editMeetingId,
                                                attendeeName: parent.find('[name=attendeeName]').val(),
                                                reason: parent.find('[name=reason]').val(),
                                                attendeeId: parent.find('[name=attendeeId]').val(),
                                                participantsType: parent.find('[name=participantsType]:checked').val(),
                                            };
                                        }


                                        common.fetchPost('sasmeetingmgr/tiolAttendee/saveTiolAttendeeInfo', params, function (res) {
                                            if (res.success) {
                                                layer.close(attendBar);
                                                eventHandle.attendMan();
                                            } else {
                                                layer.alert(res.resultMessage);
                                            }
                                        });


                                        layer.close(attendBar)
                                    },
                                });
                            });

                        } else {
                            $('.emptyBox1').show();
                        }

                    }, function (err) {
                        layer.alert(err.resultMessage);
                    });

                } else {

                }

            },
            //刷新责任人数
            dutyList: function (data) {
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
                    $('.dutyUserList').append(html);
                }

                //责任人删除
                $('.dutyDelete').off().on('click', function () {
                    $(this).parent().remove();
                })

            },

            //组织实施时间轴
            shishiTimeLine: function () {
                var html = '';
                var parent = $('.verticalTimeLineShishi');
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

                        parent.empty().html(html);


                    } else {
                        $('.emptyTimeLine').show();
                    }
                });
            },

            //关闭组织实施编辑面板
            closeShishiBox: function () {
                executionId = null;
                $('.verticalTimeLineShishi').removeClass('toggleRight');
                $('.addShishi').css({
                    width: '0',
                    display: 'none'
                })
            },

            //新增编辑议案
            yaOperFun: function (type, dataSubjectId) {

                //清空数据
                var parentBox = $('.addYABox');
                parentBox.find('input[type=text]').val('');
                parentBox.find('textarea').val('');
                //事项编码
                formSelects.value('itemId', []);
                //关联议题编码
                formSelects.value('relSubjectId', []);
                $('#meetingOptionBox ul li[data-fiid]').remove();
                $('#meetingIssueBox ul li[data-fiid]').remove();

                if (type === "add") {
                    $('.TAtitle').text('新增议题');
                    $('#deleteSubject').hide();

                } else if (type === "edit") {
                    $('.TAtitle').text('编辑议题');
                    $('#deleteSubject').show();
                }

                $('.addYABox').fadeIn();
                $('#yaSaveBtn').fadeIn();
                $('html,body').animate({scrollTop: $('.addYABox').offset().top - 10}, 'slow');

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
                                layer.alert('删除成功');
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

                    var tiolDutyList = [];
                    if ($('.dutyUserList li').length > 0) {
                        $.map($('.dutyUserList li'), function (item) {
                            tiolDutyList.push({
                                suId: $(item).attr('data-id'),
                                name: $(item).attr('data-name'),
                                soId: '',//部门id
                                dept: $(item).attr('data-dept'),
                                dutyId: $(item).attr('data-dutyId'),
                                executionId: curentexecutionId
                            });
                        })
                    }
                    var params = {
                        subjectId: subjectId,
                        startTime: $('[name=startTime]').val(),
                        implementationStatus: $('[name=implementationStatus]:checked').val(),
                        effect: $('[name=effect]').val(),
                        description: $('[name=description]').val(),
                        executionId: curentexecutionId,
                        tiolDutyList: tiolDutyList,
                    };

                    common.fetchPost('sasmeetingmgr/tiolExecution/saveTiolExecutionInfo', params, function (res) {

                        eventHandle.closeShishiBox();
                        eventHandle.shishiTimeLine();
                        layer.alert('保存成功');
                    });


                });

                $('.closeAddYA').off().on('click', function () {
                    $('.addYABox').fadeOut();
                });
                $('.closeShishiBox').off().on('click', function () {
                    eventHandle.closeShishiBox();
                });
                /*   是否通过
                   form.on('radio(syResult)', function (data) {
                       if (data.value === "yes") {
                           $('#isOverseeBox').show();
                           if ($('[name=isOversee]:checked').val() === '1') {
                               $('#shishiMainArea').show();
                           }
                       } else {
                           $('#isOverseeBox').hide();
                           $('#shishiMainArea').hide();
                       }
                   });*/

                //是否督办
                form.on('radio(isOversee)', function (data) {
                    if (data.value === "1") {
                        $('#shishiMainArea').show();
                    } else {
                        $('#shishiMainArea').hide();
                    }
                });


                if (type === 'edit') {
                    subjectId = dataSubjectId;
                    //议题信息写入

                    common.fetchPost('sasmeetingmgr/tiolSubject/selectTiolSubjectById', {
                        subjectId: subjectId
                    }, function (res) {
                        var data = res.object;
                        $('[name=subjectName]').val(data.subjectName);
                        // $('[name=itemId]').val(data.itemId);
                        // $('[name=relSubjectId]').val(data.relSubjectId);
                        $('[name=subjectResult]').val(data.subjectResult);

                        form.val('subjectForm', {
                            sourceId: data.sourceId,
                            specialId: data.specialId,
                            passFlag: data.passFlag,
                            approvalFlag: data.approvalFlag,
                            isOversee: data.superviseFlag,
                            adoptFlag: data.adoptFlag,
                            subjectCode: data.subjectCode,
                        });

                        //事项编码
                        formSelects.value('itemId', data.itemId ? data.itemId.split(',') : []);
                        //关联议题编码
                        formSelects.value('relSubjectId', data.relSubjectId ? data.relSubjectId.split(',') : []);

                        if (data.superviseFlag === 0 || data.superviseFlag === "0") {
                            $('#shishiMainArea').hide();
                        } else if (data.superviseFlag === '1' || data.superviseFlag === 1) {
                            $('#shishiMainArea').show();
                        }
                        form.render('radio');
                    });

                    //投票结果
                    eventHandle.deliberationInfo();


                    //列席人
                    eventHandle.selectTiolAttendanceList(subjectId);

                    //上传意见情况
                    eventHandle.fileDataSet($('#meetingOptionBox ul'), 'OPINION', subjectId);

                    //上传议题材料
                    eventHandle.fileDataSet($('#meetingIssueBox ul'), 'SUBJECT', subjectId);

                    //组织实施时间轴
                    eventHandle.shishiTimeLine(subjectId);


                } else if (type === 'add') {
                    subjectId = common.uuid(null, 32);

                    //将参会人员数据带入

                    var arr1 = [], arr2 = [];

                    if (attendeeList.length > 0) {
                        $.map(attendeeList, function (item) {
                            arr1.push({
                                subjectId: subjectId,
                                deliberationPersonnel: item.attendeeName,
                                job: item.attendeeJob
                            });
                            arr2.push({
                                subjectId: subjectId,
                                attendanceName: item.attendeeName,
                                position: item.attendeeJob
                            });
                        });
                    }

                    common.fetchPost('sasmeetingmgr/tiolDeliberation/saveTiolDeliberationInfos', arr1, function (res) {
                        //投票结果树
                        eventHandle.deliberationInfo();
                    });

                    common.fetchPost('sasmeetingmgr/tiolAttendance/saveTiolAttendanceInfos', arr2, function (res) {
                        //列席人
                        eventHandle.selectTiolAttendanceList();
                    });
                }

            },

            //会议基础信息保存
            meetingBaseInfoSave: function (tipShow, successBack, isaveflag) {
                var meetingId, url, type;

                if (editMeetingId) {
                    type = 'edit';
                    meetingId = editMeetingId;
                    url = 'sasmeetingmgr/tiolMeeting/saveTiolMeetingInfo';
                } else {
                    // meetingId = common.uuid(null, 32);
                    url = 'sasmeetingmgr/tiolMeeting/addTiolMeetingInfo';
                    type = 'add';
                }

                // flowState


                var params = {
                    meetingAddr: $('[name=meetingAddr]').val(),
                    moderatorName: $('[name=moderatorName]').val(),
                    iSaveFlag: isaveflag,
                    meetingTime: $('[name=meetingTime]').val(),
                    meetingName: $('[name=meetingName]').val(),
                    meetingYear: $('[name=meetingYear]').val(),
                    serialNumber: $('[name=serialNumber]').val(),
                    releaseTime: $('[name=releaseTime]').val(),
                    // flowLabel: $('[name=flowLabel]').val(),
                    // beiId: $('[name=flowLabel]').attr('data-beiId'),
                    flowLabel: $('[name=flowLabel]').attr('data-flowLabel'),
                    flowName: $('[name=flowLabel]').attr('data-flowName'),
                    // flowState: $('[name=flowLabel]').attr('data-flowState'),
                    // flowStatusList: $('[name=flowLabel]').attr('data-flowStatusList'),
                    remark: $('[name=remark]').val(),
                    meetingMode: $('[name=meetingMode]:checked').val(),//会议召开形式编码
                    meetingModeName: $('[name=meetingMode]:checked').attr('title'),//会议召开形式编码
                    meetingTypeId: $('[name=meetingType]:checked').val(),//会议类型id
                    meetingTypeCode: $('[name=meetingType]:checked').attr('data-meetingTypeCode'),//会议类型名称
                    meetingTypeName: $('[name=meetingType]:checked').attr('data-meetingtypename'),
                    // meetingTypeId: $('#meetingTypeTab li.layui-this').attr('data-meetingtype'),
                    // meetingTypeCode: $('#meetingTypeTab li.layui-this').attr('data-meetingTypeCode'),
                    // meetingTypeName: $('#meetingTypeTab li.layui-this').attr('data-meetingtypename'),

                    // meetingModeName: $('[name=meetingModeName] option:checked').text(),
                    // meetingCode:$('[name=meetingTypeCode]')+$('[name=meetingYear]').val()+$('[name=serialNumber]').val(), //会议编码    类型编码+会议年度+会议流水号
                    meetingCode: $('.meetingCode').text(), //会议编码    类型编码+会议年度+会议流水号
                    meetingId: meetingId
                };

                // if (!params.moderatorName) {
                //     layer.alert('请选择主持人');
                //     return false;
                // }
                // // if (!params.meetingTime) {
                // //     layer.alert('请选择会议时间');
                // //     return false;
                // // }
                // if (!params.meetingName) {
                //     layer.alert('请输入会议名称');
                //     return false;
                // }

                common.fetchPost(url, params, function (res) {
                    if (res.success) {
                        $('.ydListTab').show();
                        $('.flowStatus').show();
                        if (tipShow === true) {
                            layer.alert('会议信息保存成功');
                        }
                        if (!!tipShow && tipShow !== true) {
                            layer.alert(tipShow);
                        }

                        if (isaveflag === 0) {
                            //退出并刷新

                            layer.alert('全部提交成功');
                            parent.$('#c5ab54afcef64a38aa011cf4cecab659', parent.document).trigger('click');
                        }

                        if (type === 'add') {
                            //退出并刷新
                            var index = parent.layer.getFrameIndex(window.name);
                            parent.layer.close(index);

                        } else if (type === 'edit') {

                        }

                        editMeetingId = meetingId;

                        if (successBack) {
                            successBack();
                        }

                    } else {
                        layer.alert(res.resultMessage || '会议信息保存失败')
                    }
                }, function (err) {
                    layer.alert(err.resultMessage || '会议信息保存失败');
                }, false);

                return false;
            },

            initRender: function () {
                // meetingType
                // common.selectDataSet({
                //     elem: $('[name=meetingType]'),
                //     url: 'sasmeetingmgr/tiolMeetingType/getTiolMeetingTypeSelect',
                //     responseList: 'list',
                //     method: 'post',//默认为get
                //     optionText: 'meetingTypeName',
                //     optionValue: 'meetingType',
                //     success: function (data) {
                //         form.render('select');
                //     }
                // });

                var meetingTypeBoxHtml = '';

                common.fetchPost('sasmeetingmgr/tiolMeetingType/getTiolMeetingTypeSelect', {}, function (data) {

                    if (data.list && data.list.length > 0) {

                        $.map(data.list, function (item, index) {
                            var checked = '';
                            // if (index === 0) {
                            //     // checked = 'layui-this';
                            //     checked = ' checked';
                            // }
                            // if (index < 6) {
                            meetingTypeBoxHtml += '<input lay-filter="meetingType" ' + checked + ' name="meetingType" type="radio" title="' + item.meetingTypeName + '" value="' + item.meetingType + '" data-meetingTypeName="' + item.meetingTypeName + '" data-meetingType="' + item.meetingType + '" data-meetingTypeCode="' + item.meetingTypeCode + '">';
                            // meetingTypeBoxHtml += '<li class="' + checked + '" data-meetingTypeName="' + item.meetingTypeName + '" data-meetingType="' + item.meetingType + '" data-meetingTypeCode="' + item.meetingTypeCode + '">' + item.meetingTypeName + '</li>';
                            // }
                        });

                        $('.meetingTypeBox').empty().html(meetingTypeBoxHtml);
                        // $('#meetingTypeTab').empty().html(meetingTypeBoxHtml);
                    }

                }, function () {

                }, false);


                //meetingMode 会议召开形式
                // common.selectDataSet({
                //     elem: $('[name=meetingMode]'),
                //     url: 'sysmgr/dicts/selectDictListByPcode?dictPCode=CFG_MEETING_FORM',
                //     responseList: 'list',
                //     method: 'get',//默认为get
                //     optionText: 'sdName',
                //     optionValue: 'sdCode',
                //     success: function (data) {
                //         form.render('select');
                //     }
                // });

                //会议类型
                var meetingModeHtml = '';

                common.fetchGet('sysmgr/dicts/selectDictListByPcode?dictPCode=CFG_MEETING_FORM', function (data) {

                    if (data.list && data.list.length > 0) {

                        $.map(data.list, function (item, index) {
                            var checked = '';
                            if (index === 0) {
                                checked = 'checked';
                            }
                            meetingModeHtml += '<input ' + checked + ' name="meetingMode" type="radio" title="' + item.sdName + '" value="' + item.sdCode + '">';

                        });

                        $('.meetingModeBox').empty().html(meetingModeHtml);
                    }

                }, function () {

                }, false);


                //任务来源
                common.fetchPost('sasmeetingmgr/tiolSource/selectSourceList', null, function (res) {
                    var html = '';
                    var data = res.list || [];
                    html+='<input checked name="sourceId" title="无" value="">';
                    if (data.length > 0) {
                        $.map(data, function (item, index) {
                            var checked = '';

                            html += '<input name="sourceId" title="' + item.name + '" type="radio" value="' + item.code + '">';
                        });
                        $('#sourceIdBox').empty().html(html);

                        form.render('radio');
                    } else {
                        $('#sourceIdBox').empty();
                    }
                }, function (err) {
                    layer.alert(err.resultMesage)
                }, false);

                //专项名称
                common.fetchPost('sasmeetingmgr/tiolSpecial/selectSpecialList', null, function (res) {
                    var html = '';
                    var data = res.list || [];
                    html+='<input checked name="specialId" title="无" value="">';
                    if (data.length > 0) {
                        $.map(data, function (item, index) {
                            var checked = '';
                            // if (index === 0) {
                            //     checked = 'checked';
                            // }
                            html += '<input name="specialId" title="' + item.name + '" type="radio" value="' + item.code + '">';
                        });
                        $('#specialIdBox').empty().html(html);
                        form.render('radio');
                    } else {
                        $('#specialIdBox').empty();
                    }
                }, function (err) {
                    layer.alert(err.resultMesage);
                }, false);

                //参会人员
                eventHandle.attendMan();

                //日期导入
                laydate.render({
                    elem: '[name=releaseTime]',
                    type: 'date',
                    trigger: 'click'
                });
                laydate.render({
                    elem: '[name=meetingTime]',
                    type: 'date',
                    trigger: 'click'
                });
                laydate.render({
                    elem: '[name=startTime]',
                    type: 'date',
                    range: false,
                    trigger: 'click'
                });

                //会议通知
                common.fileUploadList({
                    elem: '#meetingNotice',
                    appendArea: $('#meetingNoticeBox ul'),
                    url: baseUrl + 'zuul/dfsmgr/file/fileUpload',
                    auto: true,
                    data: {
                        resId: function () {
                            return editMeetingId;
                        },
                        "fiFileType": 'NOTICE'
                    }
                });
                //会议纪要
                common.fileUploadList({
                    elem: '#meetingJiYao',
                    appendArea: $('#meetingJiYaoBox ul'),
                    url: baseUrl + 'zuul/dfsmgr/file/fileUpload',
                    auto: true,
                    data: {
                        resId: function () {
                            return editMeetingId;
                        },
                        "fiFileType": 'SUMMARY'
                    }
                });


                //上传意见情况
                common.fileUploadList({
                    elem: '#meetingOptionFile',
                    appendArea: $('#meetingOptionBox ul'),
                    url: baseUrl + 'zuul/dfsmgr/file/fileUpload',
                    auto: true,
                    data: {
                        resId: function () {
                            return subjectId;
                        },
                        "fiFileType": 'OPINION'
                    }
                });
                //上传议题材料
                common.fileUploadList({
                    elem: '#meetingIssueFile',
                    appendArea: $('#meetingIssueBox ul'),
                    url: baseUrl + 'zuul/dfsmgr/file/fileUpload',
                    auto: true,
                    data: {
                        resId: function () {
                            return subjectId;
                        },
                        fiFileType: 'SUBJECT'
                    }
                });

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

                //事项编码选择
                $('#autoCompleteItemId').off().on('keyup', function () {
                    //
                });

                //流水号生成
                form.on('radio(meetingType)', function () {

                    common.fetchPost('sasmeetingmgr/tiolMeeting/findMeetingSerialNumberByMap', {
                        meetingTypeCode: $('[name=meetingType]:checked').attr('data-meetingTypeCode'),
                        meetingYear: $('[name=meetingYear]').val(),
                    }, function (data) {

                        $('[name=serialNumber]').val(data.object);

                        $('.meetingCode').html($('[name=meetingType]:checked').attr('data-meetingTypeCode') + $('[name=meetingYear]').val() + data.object);

                    }, false, false);
                });

                // $('#meetingTypeTab li').off().on('click', function () {
                //
                //     common.fetchPost('sasmeetingmgr/tiolMeeting/findMeetingSerialNumberByMap', {
                //         meetingTypeCode: $('.layui-this').attr('data-meetingtypecode'),
                //         meetingYear: $('[name=meetingYear]').val(),
                //     }, function (data) {
                //
                //         $('[name=serialNumber]').val(data.object);
                //
                //         $('.meetingCode').html($('.layui-this').attr('data-meetingtypecode') + $('[name=meetingYear]').val() + data.object);
                //
                //     }, false, false);
                // });
            },

            fileDataSet: function (parent, type, id) {
                parent.find('li[data-fiid]').remove();
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
                                '          <div class="box-close-btn fileDelete"><i class="fa fa-close"></i></div>\n' +
                                '      </div>\n' +
                                '  </li>';
                        });
                        // parent.find('li').eq(0).siblings().remove();

                        parent.find('li[data-fiid]').remove();
                        parent.append(html);
                    }

                });
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

                        $('.emptyDataAreaSubject').hide();
                        data = common.arraySplit(data, 3);

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

                        //议案点击
                        $('.cardSwiperUl li').off().on('click', function () {
                            $(this).siblings().removeClass('selected');
                            $('[data-subjectid]').removeClass('selected');
                            $(this).addClass('selected');
                            eventHandle.yaOperFun('edit', $(this).attr('data-subjectid'));
                        });


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
                                        layer.alert('删除成功');
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
                    } else {
                        $('.emptyDataAreaSubject').show();
                    }

                });
            },

            //起草流程
            /*   drawFlow: function () {
                   var parent = $("#flowIframe").contents();

                   var userInfo = common.getUserInfo();

                   //启动流程
                   common.fetchPost('flowEngine/engineBase/draftRequest', {
                       businessId: editMeetingId,
                       ptCompanyId: userInfo.seId,
                       ptLabel: parent.find('#label').val(),
                       ptVersion: parent.find('#version').val(),
                       reject: false,
                       stateId: 'step10'
                   }, function (res) {
                       if (res.success && res.object) {


                           //保存流程信息
                           common.fetchPost('sasprocessmgr/businessEngineInfo/addBusinessEngineInfo', {
                               businessId: editMeetingId,
                               businessSubject: $('[name=meetingName]').val(),
                               flowLabel: parent.find('#label').val(),
                               businessTypeId: 'meeting',
                               businessTypeName: '决策会议',
                               drafterId: userInfo.suId,
                               drafterName: userInfo.suName,
                               flowPiid: res.object.piid,
                               flowState: 0,
                               approveState: 0,
                               formFlowState: '',
                               handleDatetime: '',
                               handleOpinion: '',
                               todoUserList: userInfo.suId,
                               flowUpdatetime: new Date(),
                               flowStateId: res.object.stateinfo.sid,
                               flowStateName: res.object.stateinfo.name
                           }, function (dataBack) {
                               if (dataBack.success) {

                                 //  debugger

                                   //业务

                               }
                           });
                       }
                   });
               },*/

            domEvent: function () {
                $('.ydListTab').on('click', function () {
                    $('.gloStep li').siblings().removeClass('selected');
                    $('.gloStep li').eq(1).addClass('selected');
                });
                $('.flowStatus').on('click', function () {
                    $('.gloStep li').siblings().removeClass('selected');
                    $('.gloStep li').eq(2).addClass('selected');
                });
                $('.baseInfoTab').on('click', function () {
                    $('.gloStep li').siblings().removeClass('selected');
                    $('.gloStep li').eq(0).addClass('selected');
                });
                //下一步
                $('#nextStep').off().on('click', function () {

                    //保存会议信息
                    eventHandle.meetingBaseInfoSave(false, function () {

                        $('.ydListTab').trigger('click');

                    }, 1);

                });
                //流程按钮
                $('#configFlowBtn').off().on('click', function () {
                    $('.flowStatus').trigger('click');

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

                                layer.alert('删除成功');
                                current.remove();
                            } else {
                                layer.alert('删除失败');
                            }
                        });
                    });
                });

                //新增议题
                $('.addYA').off().on('click', function () {

                    $('[data-subjectid]').removeClass('selected');
                    eventHandle.meetingBaseInfoSave(false, function () {

                        eventHandle.yaOperFun('add');
                    }, 1);
                });


                //参会人员
                common.userSelect({
                    elem: $('#userSelectTree'),
                    dataInit: function () {
                        return attendanceArr
                    },
                    success: function (data) {

                        // eventHandle.meetingBaseInfoSave(false, false, 1);

                        //保存人员信息
                        var arr = [];

                        if (data.length > 0) {
                            $.map(data, function (item) {
                                arr.push({
                                    meetingId: editMeetingId,
                                    attendeeName: item.name,
                                    attendeeJob: item.position,
                                    attendeeOrgan: item.organ,
                                    userId: item.id
                                });
                            });
                        }

                        common.fetchPost('sasmeetingmgr/tiolAttendee/saveTiolAttendeeInfos', arr, function (res) {
                            //刷新参会人员树
                            eventHandle.attendMan();
                        });
                    }

                });
                //列席人
                common.userSelect({
                    elem: $('#yaUserSelect'),
                    dataInit: function () {
                        return attendanceArr
                    },
                    success: function (data) {
                        //保存人员信息
                        var arr = [];

                        if (data.length > 0) {
                            $.map(data, function (item) {
                                arr.push({
                                    subjectId: subjectId,
                                    attendanceName: item.name,
                                    position: item.position,
                                    userId: item.id
                                });
                            });
                        }
                        common.fetchPost('sasmeetingmgr/tiolAttendance/saveTiolAttendanceInfos', arr, function (res) {

                            eventHandle.selectTiolAttendanceList();
                        });
                    }
                });
                //投票人
                common.userSelect({
                    elem: $('#voteBtn'),
                    dataInit: function () {
                        return deliberationArr
                    },
                    success: function (data) {
                        //保存人员信息
                        var arr = [];
                        if (data.length > 0) {
                            $.map(data, function (item) {
                                arr.push({
                                    subjectId: subjectId,
                                    deliberationPersonnel: item.name,
                                    job: item.position,
                                    userId: item.id
                                });
                            });
                        }
                        common.fetchPost('sasmeetingmgr/tiolDeliberation/saveTiolDeliberationInfos', arr, function (res) {
                            //刷新参会人员树
                            eventHandle.deliberationInfo();
                        });
                    }
                });

                //会议主持人
                common.userSelect({
                    elem: $('#baseInfoUserHeader'),
                    single: true,
                    success: function (data) {
                        //数据回填
                        $('[name=moderatorName]').val(data[0]['name']);
                    }
                });
                common.userSelect({
                    elem: $('[name=moderatorName]'),
                    single: true,
                    success: function (data) {
                        //数据回填
                        $('[name=moderatorName]').val(data[0]['name']);
                    }
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

                //基本信息保存
                $('#saveBaseInfo').off().on('click', function () {
                    eventHandle.meetingBaseInfoSave(true, false, 1);
                });

                //基本信息重置
                $('.resetForm').off().on('click', function () {
                    var parent = $('.baseInfo');
                    parent.find('input[type=text]').val('');
                    parent.find('textarea').val('');
                    return false;
                });

                //删除议题
                $('#deleteSubject').off().on('click', function () {
                    layer.confirm('确定删除该议题?', {icon: 3, title: '提示', offset: '150px'}, function (index) {
                        var layerLoader = common.layerLoader();
                        common.fetchPost('sasmeetingmgr/tiolSubject/deleteTiolSubjectByIds', {
                            subjectIds: subjectId
                        }, function (res) {
                            layer.close(layerLoader);
                            if (res.success) {
                                eventHandle.subjectList();
                                layer.alert('删除成功');
                            } else {
                                layer.alert(res.resultMessage);
                            }
                        }, function () {
                            layer.close(layerLoader);
                        });
                        layer.close(index);
                    });

                });

                //事项编码
                $('#itemId-btn').off().on('click', function () {
                    var itemListSelect = layer.open({
                        area: ['370px', '80%'],
                        title: '事项选择',
                        type: 1,
                        content: '<div style="padding: 10px">' +
                            '<table class="layui-table" id="mergeTable" lay-filter="mergeTable">\n' +
                            '    <thead>\n' +
                            '    <tr class="bg-f7">\n' +
                            '        <th >事项目录</th>\n' +
                            '        <th >事项名称</th>\n' +
                            '    </tr>\n' +
                            '    </thead>\n' +
                            '    <tbody>\n' +
                            '    </tbody>\n' +
                            '</table>' +
                            '</div>',
                        success: function (layero, index) {
                            var body = layer.getChildFrame('body', index);

                            // 表格数据渲染
                            var html = '';
                            common.fetchPost('sascatalog/tiolItem/selectTiolItemInfoEnStatusList', {}, function (res) {
                                var resData = res.list;
                                for (var i = 0; i < resData.length; i++) {
                                    html += '<tr>';
                                    html += '<td>' + resData[i]['catalogName'] + '</td>';
                                    html += '<td data-itemId="' + resData[i]['itemId'] + '"><input style="margin-right: 10px" data-itemId="' + resData[i]['itemId'] + '" type="checkbox" value="' + resData[i]['itemId'] + '" name="radioItemId">' + resData[i]['itemName'] + '</td>';
                                    html += '</tr>';
                                }

                                $('#mergeTable tbody').html(html);
                                for (var i = 0; i < resData.length; i++) {
                                    tableSpan.table_rowspan('#mergeTable', i + 1);
                                }

                            }, function (e) {
                            });

                            //
                            // body.find('ul.icon_lists li').off().on('dblclick', function () {
                            //     // $(ele).val($(this).find('span').attr("class"));
                            //
                            //
                            //
                            //     layer.close(layerIcon)
                            // });
                        },
                        btn: ['确定', '取消'],
                        btnAlign: 'c',
                        yes: function () {
                            var arr = [];
                            if ($('[name=radioItemId]:checked').length > 0) {
                                $.map($('[name=radioItemId]:checked'), function (item) {
                                    arr.push($(item).val());
                                });
                            }
                            $('.addYABox [name=itemId]').val(arr.join(','));
                            layer.close(itemListSelect);
                        }
                    });
                });

                //关联事项
                $('#relSubjectId-btn').off().on('click', function () {
                    var itemListSelect = layer.open({
                        area: ['60%', '80%'],
                        title: '议题选择',
                        type: 1,
                        content: '<div style="padding: 10px">' +
                            '<table class="layui-table" id="mergeTable" lay-filter="mergeTable">\n' +
                            '    <thead>\n' +
                            '    <tr class="bg-f7">\n' +
                            '        <th >会议列表</th>\n' +
                            '        <th >议题列表</th>\n' +
                            '    </tr>\n' +
                            '    </thead>\n' +
                            '    <tbody>\n' +
                            '    </tbody>\n' +
                            '</table>' +
                            '</div>',
                        success: function (layero, index) {
                            var body = layer.getChildFrame('body', index);

                            // 表格数据渲染
                            var html = '';
                            // common.fetchPost('sascatalog/tiolItem/selectTiolItemInfoEnStatusList', {}, function (res) {
                            //     var resData = res.list;
                            //     for (var i = 0; i < resData.length; i++) {
                            //         html += '<tr>';
                            //         html += '<td>' + resData[i]['catalogName'] + '</td>';
                            //         html += '<td data-itemId="' + resData[i]['itemId'] + '"><input style="margin-right: 10px" data-itemId="' + resData[i]['itemId'] + '" type="checkbox" value="' + resData[i]['itemId'] + '" name="radioItemId">' + resData[i]['itemName'] + '</td>';
                            //         html += '</tr>';
                            //     }
                            //     $('#mergeTable tbody').html(html);
                            //     for (var i = 0; i < resData.length; i++) {
                            //         tableSpan.table_rowspan('#mergeTable', i + 1);
                            //     }
                            //
                            // }, function (e) {
                            // });

                            //
                            // body.find('ul.icon_lists li').off().on('dblclick', function () {
                            //     // $(ele).val($(this).find('span').attr("class"));
                            //
                            //
                            //
                            //     layer.close(layerIcon)
                            // });
                        },
                        btn: ['确定', '取消'],
                        btnAlign: 'c',
                        yes: function () {
                            var arr = [];
                            if ($('[name=radioItemId]:checked').length > 0) {
                                $.map($('[name=radioItemId]:checked'), function (item) {
                                    arr.push($(item).val());
                                })
                            }
                            $('.addYABox [name=itemId]').val(arr.join(','));
                            layer.close(itemListSelect);
                        }
                    });
                });


                //暂存按钮
                $('#saveAll').off().on('click', function () {
                    eventHandle.meetingBaseInfoSave(true, false, 1);
                });

                //全部提交按钮
                $('#saveAllForm').off().on('click', function () {
                    //判断是够存在流程信息
                    if (!$('[name=flowLabel]').val()) {
                        //请配置流程信息
                        layer.alert('请配置流程信息');
                        eventHandle.meetingBaseInfoSave(false, false, 1);
                    } else {

                        layer.confirm('确定全部提交？', {icon: 3, title: '提示', offset: '150px'}, function (index) {

                            eventHandle.meetingBaseInfoSave(true, false, 0);
                            layer.close(index);
                        });


                    }

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

                    // eventHandle.meetingBaseInfoSave(false);
                    //
                    //
                    // var parent = $("#flowIframe").contents();
                    //
                    // var userInfo = common.getUserInfo();
                    //
                    // if (!parent.find('#label').val()) {
                    //
                    //     layer.alert('请先选择流程');
                    //     return false;
                    // }
                    //
                    // common.fetchPost('flowEngine/engineBase/draftRequest', {
                    //     businessId: editMeetingId,
                    //     ptCompanyId: userInfo.seId,
                    //     ptLabel: parent.find('#label').val(),
                    //     ptVersion: parent.find('#version').val(),
                    //     reject: false,
                    //     stateId: 'step10'
                    // }, function (res) {
                    //     if (res.success && res.object) {
                    //
                    //         common.fetchPost('sasprocessmgr/businessEngineInfo/addBusinessEngineInfo', {
                    //             businessId: editMeetingId,
                    //             businessSubject: $('[name=meetingName]').val(),
                    //             flowLabel: parent.find('#label').val(),
                    //             businessTypeId: 'meeting',
                    //             businessTypeName: '决策会议',
                    //             drafterId: userInfo.suId,
                    //             drafterName: userInfo.suName,
                    //             flowPiid: res.object.piid,
                    //             flowState: 0,
                    //             approveState: 0,
                    //             formFlowState: '',
                    //             handleDatetime: '',
                    //             handleOpinion: '',
                    //             todoUserList: userInfo.suId,
                    //             flowUpdatetime: new Date(),
                    //             flowStateId: res.object.stateinfo.sid,
                    //             flowStateName: res.object.stateinfo.name
                    //         }, function (dataBack) {
                    //
                    //             if (dataBack.success) {
                    //
                    //                 var beiId = dataBack.object;
                    //
                    //                 //写入标签
                    //                 $('[name=flowLabel]').attr({
                    //                     'data-beiId': beiId,
                    //                     'data-flowLabel': parent.find('#label').val(),
                    //                     'data-flowState': 0,
                    //                     'data-flowStatusList': res.object.stateinfo.name
                    //                 });
                    //                 $('[name=flowLabel]').val(parent.find('#label').val());
                    //
                    //                 //保存会议
                    //                 eventHandle.meetingBaseInfoSave('流程绑定成功');
                    //
                    //             }
                    //         })
                    //     } else {
                    //
                    //     }
                    // }, function (err) {
                    //
                    // });

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

                //新增议题保存
                $('#yaSaveBtn').off().on('click', function () {

                    //先保存会议信息

                    eventHandle.meetingBaseInfoSave(false, false, 1);


                    if (!$('[name=subjectName]').val()) {
                        layer.alert('请填写议题名称');
                        return false;
                    }

                    var relSubjectIdList = formSelects.value('relSubjectId'), relSubjectIdListArr = [];
                    for (var i = 0; i < relSubjectIdList.length; i++) {
                        relSubjectIdListArr.push(relSubjectIdList[i]['value']);
                    }
                    var itemIdList = formSelects.value('itemId'), itemIdListArr = [];
                    for (var i = 0; i < itemIdList.length; i++) {
                        itemIdListArr.push(itemIdList[i]['value']);
                    }
                    common.fetchPost('sasmeetingmgr/tiolSubject/saveTiolSubjectInfo', {
                        subjectId: subjectId,
                        subjectName: $('[name=subjectName]').val(),
                        meetingId: editMeetingId,
                        itemId: itemIdListArr.join(','),
                        relSubjectId: relSubjectIdListArr.join(','),
                        sourceId: $('[name=sourceId]:checked').val(),
                        specialId: $('[name=specialId]:checked').val(),
                        passFlag: $('[name=passFlag]:checked').val(),
                        adoptFlag: $('[name=adoptFlag]:checked').val(),
                        approvalFlag: $('[name=approvalFlag]:checked').val(),
                        superviseFlag: $('[name=isOversee]:checked').val(),
                        subjectResult: $('[name=subjectResult]').val(),
                        subjectCode: $('[name=subjectCode]').val()
                    }, function (res) {

                        if (res.success) {
                            layer.alert('议题保存成功');
                            //刷新议题列表 并点击展示该列表
                            eventHandle.subjectList(subjectId);
                        } else {
                            layer.alert(res.resultMessage || '议题保存失败');
                        }

                    });

                });

                //关联议题编码
                common.fetchPost('sasmeetingmgr/tiolSubject/selectTiolSubjectAndDeliberationCountList', {}, function (res) {
                    var data = res.list || [];
                    $('#relSubjectId').empty();
                    if (data.length > 0) {

                        var html = '';

                        $.map(data, function (item) {
                            html += '<option value="' + item.subjectId + '" >' + item.subjectName + '</option>'
                        });

                        $('#relSubjectId').empty().html(html);
                        formSelects.render('relSubjectId');
                        // formSelects.value('relSubjectId',[{name:'',value:''}]);
                    }

                });

                //事项编码
                common.fetchPost('sascatalog/tiolItem/selectTiolItemInfoEnStatusList', {}, function (res) {
                    // var resData = res.list;
                    // for (var i = 0; i < resData.length; i++) {
                    //     html += '<tr>';
                    //     html += '<td>' + resData[i]['catalogName'] + '</td>';
                    //     html += '<td data-itemId="' + resData[i]['itemId'] + '"><input style="margin-right: 10px" data-itemId="' + resData[i]['itemId'] + '" type="checkbox" value="' + resData[i]['itemId'] + '" name="radioItemId">' + resData[i]['itemName'] + '</td>';
                    //     html += '</tr>';
                    // }
                    //
                    // $('#mergeTable tbody').html(html);
                    // for (var i = 0; i < resData.length; i++) {
                    //     tableSpan.table_rowspan('#mergeTable', i + 1);
                    // }


                    var data = res.list || [];
                    $('#itemId').empty();
                    if (data.length > 0) {

                        var html = '';

                        $.map(data, function (item) {
                            html += '<option value="' + item.itemId + '" >' + item.itemName + '</option>'
                        });

                        $('#itemId').empty().html(html);
                        formSelects.render('itemId');
                        // formSelects.value('relSubjectId',[{name:'',value:''}]);
                    }


                }, function (e) {
                });

                // $('.relSubjectId').off().on('click',function () {
                //
                // });


            },
            //流程日志
            flowDataSet: function (area) {

                //判断是否存在流程
                common.fetchGet('sasprocessmgr/businessEngineInfo/getBusinessEngineInfoByBusinessId?businessId=' + editMeetingId, function (res) {

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
                        $('#editFlow').empty().html('<iframe frameborder="0" id="flowIframe" src="../../process/newTemplateByBizDisplay.html?businessTypeId=meeting" style="width: 100%;height:' + $(window).height() - 60 + 'px"></iframe>');
                        $('#editFlow').show();
                    }

                }, function () {
                    $('#showFlow').empty().hide();
                    $('#editFlow').empty().html('<iframe frameborder="0" id="flowIframe" src="../../process/newTemplateByBizDisplay.html?businessTypeId=meeting" style="width: 100%;height:540px"></iframe>');
                    $('#editFlow').show();
                });

            },
            //流程信息配置
            newTemplateByBizDisplay: function () {

                //导入页面
                // var html=common.getPageHtml('/src/page/process/newTemplateByBizDisplay.html');
                //
                // $('.newTemplateByBizDisplay').empty().html(html);


            },
            pageLoad: function () {
                element.init();
                common.themeSet();

                common.buttonLimit();
                common.columnSide();

                common.dataAccessReloadModule({});

                //加载项
                eventHandle.initRender();

                //流程信息配置
                eventHandle.newTemplateByBizDisplay();


                //判断是新增还是编辑
                if (editMeetingId) {//编辑

                    //会议信息导入
                    common.fetchPost('sasmeetingmgr/tiolMeeting/selectTiolMeetingById?meetingId=' + editMeetingId, null, function (res) {

                        var data = res.object;

                        $('[name=moderatorName]').val(data.moderatorName);
                        $('[name=meetingTime]').val(data.meetingTime);
                        $('[name=meetingName]').val(data.meetingName);
                        // $('[name=meetingType]').val(data.meetingTypeId);
                        $('[data-meetingtype=' + data.meetingTypeId + ']').trigger('click');

                        $('[name=meetingCode]').val(data.meetingCode);
                        $('[name=meetingAddr]').val(data.meetingAddr);
                        $('[name=meetingYear]').val(data.meetingYear);
                        $('[name=serialNumber]').val(data.serialNumber);
                        $('.meetingCode').text(data.meetingCode);

                        $('[name=meetingMode]').val(data.meetingMode);
                        $('[name=releaseTime]').val(data.releaseTime);
                        $('[name=flowLabel]').val(data.flowLabel);

                        $('[name=flowLabel]').attr({
                            'data-beiId': data.beiId,
                            'data-flowLabel': data.flowLabel,
                            'data-flowState': data.flowState,
                            'data-flowStatusList': data.flowStatusList
                        });


                        $('[name=remark]').val(data.remark);

                        // form.render('select');
                        form.render('radio');

                    });

                    //附件信息导入
                    eventHandle.fileDataSet($('#meetingNoticeBox ul'), 'NOTICE', editMeetingId);//会议通知
                    eventHandle.fileDataSet($('#meetingJiYaoBox ul'), 'SUMMARY', editMeetingId);//会议纪要

                    //议题信息导入
                    eventHandle.subjectList(false, true);

                    //流程配置
                    eventHandle.flowDataSet($('.flowDataBox'));

                    //如果flowState=10 则表示不让编辑 0 表示可编辑


                } else {//新增
                    // $('.layui-tab-card').hide();
                    // $('.peopleBox').hide();
                    // $('.mainBox').css({
                    //     paddingRight: 0
                    // })
                    editMeetingId = common.uuid(null, 32);
                    //无meetingId 先只展示议题列表
                    $('.ydListTab').hide();
                    $('.flowStatus').hide();

                    //写入版本号
                    $('[name=meetingYear]').val(common.versionNumber());

                    // $('[name=serialNumber]').val(common.randomCode(4));

                    //写入会议编码
                    $('.meetingCode').text();

                    //流程信息配置
                    $('#showFlow').empty().hide();
                    $('#editFlow').empty().html('<iframe frameborder="0" id="flowIframe" src="../../process/newTemplateByBizDisplay.html?businessTypeId=meeting" style="width: 100%;height: 540px"></iframe>');
                    $('#editFlow').show();

                }

            },

        };

    eventHandle.pageLoad();
    eventHandle.domEvent();


});
