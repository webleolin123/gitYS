/**

 @Name：接口监控
 @Author：gaoli

 */

layui.config({
    base: '../../../src/js/',
    version: new Date().getTime()
}).extend({
    custom: 'common/custom',
    timeLineSet: 'module/timeLineInit'
}).use(['layer', 'eleTree', 'element', 'table', 'common', 'form', 'jquery', 'timeLineSet'], function () {
    var common = layui.common;
    var tree = layui.eleTree;
    var timeLineSet = layui.timeLineSet;

    //导入样式文件
    layui.link('../../css/module/jquery.range.css');

    var chart1 = echarts.init(document.getElementById('chart1'));
    var value = 0.48;
    var data = [value, value, value, value, value,];
    var option1 = {
        title: {
            text: '80%',
            x: 'center',
            y: 'center',
            textStyle: {
                fontWeight: 'normal',
                color: '#0580f2',
                fontSize: '20'
            }
        },
        color: ['rgba(176, 212, 251, 1)'],

        series: [{
            name: 'Line 1',
            type: 'pie',
            clockWise: true,
            radius: ['50%', '66%'],
            itemStyle: {
                normal: {
                    label: {
                        show: false
                    },
                    labelLine: {
                        show: false
                    }
                }
            },
            hoverAnimation: false,
            data: [{
                value: 80,
                name: '01',
                itemStyle: {
                    normal: {
                        color: { // 完成的圆环的颜色
                            colorStops: [{
                                offset: 0,
                                color: '#00cefc' // 0% 处的颜色
                            }, {
                                offset: 1,
                                color: '#367bec' // 100% 处的颜色
                            }]
                        },
                        label: {
                            show: false
                        },
                        labelLine: {
                            show: false
                        }
                    }
                }
            }, {
                name: '02',
                value: 20
            }]
        }]
    };
    chart1.setOption(option1);

    var chart2 = echarts.init(document.getElementById('chart2'));
    var option2 = {
        grid: {
            top: "25%",
            bottom: "10%"
        },
        tooltip: {
            trigger: "axis",
            axisPointer: {
                type: "shadow",
                label: {
                    show: true
                }
            }
        },
        legend: {
            data: ["响应时间", "正确率"],
            top: "15%",
            textStyle: {
                color: "#666"
            }
        },
        xAxis: {
            data: [
                "1",
                "2",
                "3",
                "4",
                "5",
                "6",
                "7",
                "8",
                "9",
                "10",
                "11",
                "12"
            ],

            axisTick: {
                show: false //隐藏X轴刻度
            },
            axisLabel: {
                show: true,
                textStyle: {
                    color: "#666" //X轴文字颜色
                }
            }
        },
        yAxis: [{
            type: "value",
            name: "响应时间",
            nameTextStyle: {
                color: "#666"
            },
            splitLine: {
                show: false
            },
            axisTick: {
                show: false
            },

            axisLabel: {
                show: true,
                textStyle: {
                    color: "#666"
                }
            }
        },
            {
                type: "value",
                name: "正确率",
                nameTextStyle: {
                    color: "#666"
                },
                position: "right",
                splitLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },

                axisLabel: {
                    show: true,
                    formatter: "{value} %", //右侧Y轴文字显示
                    textStyle: {
                        color: "#666"
                    }
                }
            },
            {
                type: "value",
                gridIndex: 0,
                min: 50,
                max: 100,
                splitNumber: 8,
                splitLine: {
                    show: false
                },

                axisTick: {
                    show: false
                },
                axisLabel: {
                    show: false
                },
                splitArea: {
                    show: true,
                    areaStyle: {
                        color: ["rgba(250,250,250,0.0)", "rgba(250,250,250,0.05)"]
                    }
                }
            }
        ],
        series: [{
            name: "响应时间",
            type: "line",
            yAxisIndex: 1, //使用的 y 轴的 index，在单个图表实例中存在多个 y轴的时候有用
            smooth: true, //平滑曲线显示
            showAllSymbol: true, //显示所有图形。
            symbol: "circle", //标记的图形为实心圆
            symbolSize: 10, //标记的大小
            itemStyle: {
                //折线拐点标志的样式
                color: "#058cff"
            },
            lineStyle: {
                color: "#058cff"
            },
            areaStyle: {
                color: "rgba(5,140,255, 0.2)"
            },
            data: [22, 44, 55, 34, 45, 86, 17, 56, 23, 80, 90, 100]
        },
            {
                name: "正确率",
                type: "bar",
                barWidth: 15,
                itemStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: "#6f3d9e"
                        },
                            {
                                offset: 1,
                                color: "#3637a3"
                            }
                        ])
                    }
                },
                data: [1, 2, 3, 4, 8, 6, 9, 8, 9, 10, 11, 12]

            }
        ]
    };
    chart2.setOption(option2);


});
