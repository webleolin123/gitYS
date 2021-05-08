/**
 @author gl
 @description ...时间轴组件 初始化
 @isStatic no
 */

layui.define(function (exports) {
    var timeLine;//时间轴对象化
    var endTime, startTime;
    var scale = [];//时间轴上的标注
    var colunms;
    var labelNum = 5;//时间轴上显示的标注数
    var step;//时间粒度
    var startTimeBack, endTimeBack;
    var dom = {
        timeSelect: $('#timeLineSelect'),
        rangeSlider: $('.range-slider')
    };
    var timeLineSet = {
        init: function (successCallback, initRangeSlider, initTimeSelect, dataArr, scoreType) {//dataArr 数组表示24小时、最近7天、最近15分钟的健康数据
            if (!dataArr) {
                dataArr = [[], [], []];
            }
            if (!!initRangeSlider) {
                dom.rangeSlider = initRangeSlider;//重置初始化input
            }
            if (!!initTimeSelect) {
                dom.timeSelect = initTimeSelect;
            }
            labelNum = 10;
            //初始化 加载24小时时间轴
            endTime = new Date().getTime();//当前的时间
            startTime = endTime - 86400000;//前一天的时间
            colunms = (endTime - startTime) / labelNum;
            for (var i = 0; i < (labelNum + 1); i++) {
                scale.push(startTime + colunms * i);
            }
            dom.rangeSlider.attr('value', scale[0] + ',' + scale[labelNum]);
            step = 1000 * 60;//1分钟
            if (dom.rangeSlider.next().is('.slider-container')) {
                dom.rangeSlider.next().remove();
            }
            timeLine = dom.rangeSlider.jRange({
                from: scale[0],
                to: scale[labelNum],
                step: step,
                scale: scale,
                format: '%s',
                width: '100%',
                showHour: true,
                scoreType: scoreType,
                scoreData: dataArr[0],//时间轴颜色值绘画
                showLabels: true,
                isRange: true,
                callback: function () {
                    /*//取消重置按钮
                     $('#g1').click(function () {
                     timeLine.setValue(scale[0]+','+scale[5]);
                     });*/
                },
                clickDragBack: function () {
                    if (successCallback) {
                        successCallback()
                    }
                }
            });
            timeLine.setValue(scale[0] + ',' + scale[labelNum]);
            dom.timeSelect.on('change', function () {
                var type = $(this).val();
                scale = [];
                labelNum = 10;
                if (type == 0) {
                    //最近24小时时间轴
                    endTime = new Date().getTime();//当前的时间
                    startTime = endTime - 86400000;//前一天的时间
                    colunms = (endTime - startTime) / labelNum;
                    for (var i = 0; i < (labelNum + 1); i++) {
                        scale.push(startTime + colunms * i);
                    }
                    dom.rangeSlider.attr('value', scale[0] + ',' + scale[labelNum]);
                    step = 1000 * 60;//1分钟
                    if (dom.rangeSlider.next().is('.slider-container')) {
                        dom.rangeSlider.next().remove();
                    }
                    timeLine.init(dom.rangeSlider, {
                        from: scale[0],
                        to: scale[labelNum],
                        step: step,
                        scale: scale,
                        showHour: true,
                        scoreType: scoreType,
                        scoreData: dataArr[0],//时间轴颜色值绘画
                        callback: function () {
                        },
                        clickDragBack: function () {
                            if (successCallback) {
                                successCallback()
                            }
                        }
                    });
                    timeLine.setValue(scale[0] + ',' + scale[labelNum]);
                } else if (type == 1) {
                    labelNum = 5;
                    //最近7天时间轴
                    endTime = new Date().getTime();//当前的时间
                    startTime = endTime - 86400000 * 7;//前一周的时间

                    colunms = (endTime - startTime) / labelNum;
                    for (var j = 0; j < (labelNum + 1); j++) {
                        scale.push(startTime + colunms * j);
                    }
                    dom.rangeSlider.attr('value', scale[0] + ',' + scale[labelNum]);
                    step = 1000 * 60;//1分钟
                    if (dom.rangeSlider.next().is('.slider-container')) {
                        dom.rangeSlider.next().remove();
                    }
                    timeLine.init(dom.rangeSlider, {
                        from: scale[0],
                        to: scale[labelNum],
                        step: step,
                        scale: scale,
                        scoreType: scoreType,
                        scoreData: dataArr[1],//时间轴颜色值绘画
                        callback: function () {
                        },
                        clickDragBack: function () {
                            if (successCallback) {
                                successCallback()
                            }
                        }
                    });
                    timeLine.setValue(scale[0] + ',' + scale[labelNum]);
                } else if (type == 2) {
                    labelNum = 10;
                    //最近15分钟
                    endTime = new Date().getTime();//当前的时间
                    startTime = endTime - 1000 * 60 * 15;//前15分钟

                    colunms = (endTime - startTime) / labelNum;
                    for (var k = 0; k < (labelNum + 1); k++) {
                        scale.push(startTime + colunms * k);
                    }
                    dom.rangeSlider.attr('value', scale[0] + ',' + scale[labelNum]);
                    step = 1000 * 5;//5s
                    if (dom.rangeSlider.next().is('.slider-container')) {
                        dom.rangeSlider.next().remove();
                    }
                    timeLine.init(dom.rangeSlider, {
                        from: scale[0],
                        to: scale[labelNum],
                        showHour: true,
                        step: step,
                        scoreType: scoreType,
                        scoreData: dataArr[2],//时间轴颜色值绘画
                        scale: scale,
                        callback: function () {
                        },//普通回调事件
                        clickDragBack: function () {
                            if (successCallback) {
                                successCallback()
                            }
                        }
                    });
                    timeLine.setValue(scale[0] + ',' + scale[labelNum]);
                }
            });
        }
    };
    exports('timeLineSet', timeLineSet);

});
