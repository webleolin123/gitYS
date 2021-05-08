/**

 @Name：echart 初始分装
 @Author：gaoli

 */


layui.define(function (exports) {

    var chartOption = {
        /**
         * 简单折线图
         * */
        lineChartOption: function () {
            return {
                grid: {
                    top: "25%",
                    bottom: "10%"
                },
                // color: ['#afa3f5', '#00d488', '#eea9c5', '#3bafff', '#c0f18a', "rgba(250,250,250,0.5)"],
                tooltip: {
                    trigger: "axis"
                },
                legend: {
                    data: ["legend1", "legend2", "legend3"],
                    top: "5%",
                    textStyle: {
                        color: "#666",
                        fontsize: '12px'
                    }
                },
                xAxis: {
                    type: 'category',
                    data: ['x1', 'x2', 'x3', 'x4', 'x5', 'x6', 'x7', 'x8']
                },
                yAxis: [
                    {
                        type: "value"
                    }
                ],
                series: [
                    {
                        name: "legend1",
                        type: "line",
                        data: [3, 6, 8, 3.5, 2, 6, 9, 5]
                    },
                    {
                        name: "legend2",
                        type: "line",
                        data: [2, 5, 3, 2, 5, 1, 3, 6]
                    },
                    {
                        name: "legend3",
                        type: "line",
                        data: [4, 3, 4, 3, 2, 2, 4, 4]
                    }
                ]
            }
        },
        /**
         * 简单柱状图
         * */
        barChartOption: function () {
            return {
                grid: {
                    top: "25%",
                    bottom: "10%"
                },
                // color: ['#afa3f5', '#00d488', '#eea9c5', '#3bafff', '#c0f18a', "rgba(250,250,250,0.5)"],
                tooltip: {
                    trigger: "axis"
                },
                legend: {
                    data: ["legend1", "legend2"],
                    top: "5%",
                    textStyle: {
                        color: "#666",
                        fontsize: '12px'
                    }
                },
                xAxis: {
                    type: 'category',
                    data: ['x1', 'x2', 'x3', 'x4', 'x5', 'x6', 'x7', 'x8']
                },
                yAxis: [
                    {
                        type: "value"
                    }
                ],
                series: [
                    {
                        name: "legend1",
                        type: "bar",
                        data: [3, 6, 8, 3.5, 2, 6, 9, 5]
                    },
                    {
                        name: "legend2",
                        type: "bar",
                        data: [2, 5, 3, 2, 5, 1, 3, 6]
                    }
                ]
            }
        },
        /**
         * 简单饼图
         * */
        pieChartOption: function () {
            var colorList = [
                '#2ec7c9', '#b6a2de', '#5ab1ef', '#ffb980', '#d87a80',
                '#8d98b3', '#e5cf0d', '#97b552', '#95706d', '#dc69aa',
                '#07a2a4', '#9a7fd1', '#588dd5', '#f5994e', '#c05050',
                '#59678c', '#c9ab00', '#7eb00a', '#6f5553', '#c14089'
            ];
            return {
                grid: {
                    top: 0,
                },
                legend: {
                    show: true,
                    bottom: 0,
                    icon: 'circle',
                    textStyle: {
                        fontsize: '12px',
                        color: '#666'
                    }
                },
                tooltip: {
                    trigger: 'item',
                    formatter: "{b} : {c} ({d}%)"
                },
                series: [
                    // 主要展示层的
                    {
                        radius: ['25%', '51%'],
                        center: ['50%', '45%'],
                        type: 'pie',
                        itemStyle: {
                            normal: {
                                color: function (params) {
                                    return colorList[params.dataIndex]
                                }
                            }
                        },
                        labelLine: {
                            normal: {
                                show: true,
                                length: 10,
                                length2: 20,
                                lineStyle: {
                                    color: '#d3d3d3'
                                },
                                align: 'right'
                            },
                            color: "#000",
                            emphasis: {
                                show: true
                            }
                        },
                        label: {
                            normal: {
                                formatter: "{b}: {c}",
                            }
                        },
                        data: [
                            {value: 5, name: 'legend1',},
                            {value: 5, name: 'legend2'},
                            {value: 5, name: 'legend3'},
                            {value: 5, name: 'legend4'}]
                    },
                    // 边框的设置
                    {
                        radius: ['47%', '51%'],
                        center: ['50%', '45%'],
                        type: 'pie',
                        label: {
                            normal: {
                                show: false
                            },
                            emphasis: {
                                show: false
                            }
                        },
                        labelLine: {
                            normal: {
                                show: false
                            },
                            emphasis: {
                                show: false
                            }
                        },
                        animation: false,
                        tooltip: {
                            show: false
                        },
                        itemStyle: {
                            normal: {
                                color: 'rgba(250,250,250,0.5)'
                            }
                        },
                        data: [{
                            value: 1,
                        }],
                    }
                ]
            }
        },
        /**
         * 简单散点图
         * */
        scatterChartOption: function () {
            return {
                // backgroundColor: new echarts.graphic.RadialGradient(0.3, 0.3, 0.8, [{
                //     offset: 0,
                //     color: '#f7f8fa'
                // }, {
                //     offset: 1,
                //     color: '#cdd0d5'
                // }]),
                title: {
                    // text: '1990 与 2015 年各国家人均寿命与 GDP'
                },
                legend: {
                    right: 10,
                    data: ['1990', '2015']
                },
                xAxis: {
                    splitLine: {
                        lineStyle: {
                            type: 'dashed'
                        }
                    }
                },
                yAxis: {
                    splitLine: {
                        lineStyle: {
                            type: 'dashed'
                        }
                    },
                    scale: true
                },
                series: [{
                    name: '1990',
                    data: [[28604, 77, 17096869, 'Australia', 1990], [31163, 77.4, 27662440, 'Canada', 1990], [1516, 68, 1154605773, 'China', 1990], [13670, 74.7, 10582082, 'Cuba', 1990], [28599, 75, 4986705, 'Finland', 1990], [29476, 77.1, 56943299, 'France', 1990], [31476, 75.4, 78958237, 'Germany', 1990], [28666, 78.1, 254830, 'Iceland', 1990], [1777, 57.7, 870601776, 'India', 1990], [29550, 79.1, 122249285, 'Japan', 1990], [2076, 67.9, 20194354, 'North Korea', 1990], [12087, 72, 42972254, 'South Korea', 1990], [24021, 75.4, 3397534, 'New Zealand', 1990], [43296, 76.8, 4240375, 'Norway', 1990], [10088, 70.8, 38195258, 'Poland', 1990], [19349, 69.6, 147568552, 'Russia', 1990], [10670, 67.3, 53994605, 'Turkey', 1990], [26424, 75.7, 57110117, 'United Kingdom', 1990], [37062, 75.4, 252847810, 'United States', 1990]],
                    type: 'scatter',
                    symbolSize: function (data) {
                        return Math.sqrt(data[2]) / 5e2;
                    },
                    label: {
                        emphasis: {
                            show: true,
                            formatter: function (param) {
                                return param.data[3];
                            },
                            position: 'top'
                        }
                    },
                    itemStyle: {
                        normal: {
                            shadowBlur: 10,
                            shadowColor: 'rgba(120, 36, 50, 0.5)',
                            shadowOffsetY: 5,
                            color: new echarts.graphic.RadialGradient(0.4, 0.3, 1, [{
                                offset: 0,
                                color: 'rgb(251, 118, 123)'
                            }, {
                                offset: 1,
                                color: 'rgb(204, 46, 72)'
                            }])
                        }
                    }
                }, {
                    name: '2015',
                    data: [[44056, 81.8, 23968973, 'Australia', 2015], [43294, 81.7, 35939927, 'Canada', 2015], [13334, 76.9, 1376048943, 'China', 2015], [21291, 78.5, 11389562, 'Cuba', 2015], [38923, 80.8, 5503457, 'Finland', 2015], [37599, 81.9, 64395345, 'France', 2015], [44053, 81.1, 80688545, 'Germany', 2015], [42182, 82.8, 329425, 'Iceland', 2015], [5903, 66.8, 1311050527, 'India', 2015], [36162, 83.5, 126573481, 'Japan', 2015], [1390, 71.4, 25155317, 'North Korea', 2015], [34644, 80.7, 50293439, 'South Korea', 2015], [34186, 80.6, 4528526, 'New Zealand', 2015], [64304, 81.6, 5210967, 'Norway', 2015], [24787, 77.3, 38611794, 'Poland', 2015], [23038, 73.13, 143456918, 'Russia', 2015], [19360, 76.5, 78665830, 'Turkey', 2015], [38225, 81.4, 64715810, 'United Kingdom', 2015], [53354, 79.1, 321773631, 'United States', 2015]],
                    type: 'scatter',
                    symbolSize: function (data) {
                        return Math.sqrt(data[2]) / 5e2;
                    },
                    label: {
                        emphasis: {
                            show: true,
                            formatter: function (param) {
                                return param.data[3];
                            },
                            position: 'top'
                        }
                    },
                    itemStyle: {
                        normal: {
                            shadowBlur: 10,
                            shadowColor: 'rgba(25, 100, 150, 0.5)',
                            shadowOffsetY: 5,
                            color: new echarts.graphic.RadialGradient(0.4, 0.3, 1, [{
                                offset: 0,
                                color: 'rgb(129, 227, 238)'
                            }, {
                                offset: 1,
                                color: 'rgb(25, 183, 207)'
                            }])
                        }
                    }
                }]
            }
        },
        /**
         * 简单雷达图
         * */
        radarChartOption: function () {
            return {
                title: {
                    // text: '雷达图'
                },
                tooltip: {},
                legend: {
                    top: 10,
                    itemWidth: 12,
                    itemHeight: 12,
                    data: ['legend1', 'legend2']
                },
                radar: {
                    radius: '60%',
                    splitNumber: 8,
                    indicator: [{
                        name: 'x1',
                        max: 6000
                    }, {
                        name: 'x2',
                        max: 16000
                    }, {
                        name: 'x3',
                        max: 30000
                    }, {
                        name: 'x4',
                        max: 35000
                    }, {
                        name: 'x5',
                        max: 50000
                    }, {
                        name: 'x6',
                        max: 25000
                    }]
                },
                series: [{
                    name: 'XXX对比',
                    type: 'radar',
                    symbolSize: 0,
                    data: [{
                        value: [5000, 7000, 12000, 11000, 15000, 14000],
                        name: 'legend1',
                    }, {
                        value: [2500, 12000, 8000, 8500, 12000, 12000],
                        name: 'legend2',
                    }]
                }]
            };
        }

    };

    exports('chartOption', chartOption);
});
