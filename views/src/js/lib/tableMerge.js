/**
 * Created by YujieYang.
 * @name:  子表格扩展
 * @author: 杨玉杰
 * @version 1.0
 */
layui.define(['table'], function (exports) {

    var $ = layui.jquery;

    // 封装方法
    var mod = {
        /**
         * 渲染入口
         * @param myTable
         */
        render: function (myTable) {
            var tableBox = $('#'+myTable.id).next().children('.layui-table-box'),
                $main = $(tableBox.children('.layui-table-body').children('table').children('tbody').children('tr').toArray().reverse()),
                $fixLeft = $(tableBox.children('.layui-table-fixed-l').children('.layui-table-body').children('table').children('tbody').children('tr').toArray().reverse()),
                $fixRight = $(tableBox.children('.layui-table-fixed-r').children('.layui-table-body').children('table').children('tbody').children('tr').toArray().reverse()),
                cols = myTable.cols[0], mergeRecord = {};

            for (var i = 0; i < cols.length; i++) {
                var item3 = cols[i], field=item3.field;
                if (item3.merge) {
                    var mergeField = [field];
                    if (item3.merge !== true) {
                        if (typeof item3.merge == 'string') {
                            mergeField = [item3.merge]
                        } else {
                            mergeField = item3.merge
                        }
                    }
                    mergeRecord[i] = {mergeField: mergeField, rowspan:1}
                }
            }

            $main.each(function (i) {

                for (var item in mergeRecord) {
                    if (i==$main.length-1 || isMaster(i, item)) {
                        $(this).children('[data-key$="-'+item+'"]').attr('rowspan', mergeRecord[item].rowspan);
                        $fixLeft.eq(i).children('[data-key$="-'+item+'"]').attr('rowspan', mergeRecord[item].rowspan);
                        $fixRight.eq(i).children('[data-key$="-'+item+'"]').attr('rowspan', mergeRecord[item].rowspan);
                        mergeRecord[item].rowspan = 1;
                    } else {
                        $(this).children('[data-key$="-'+item+'"]').remove();
                        $fixLeft.eq(i).children('[data-key$="-'+item+'"]').remove();
                        $fixRight.eq(i).children('[data-key$="-'+item+'"]').remove();
                        mergeRecord[item].rowspan +=1;
                    }
                }
            })

            function isMaster (index, item) {
                var mergeField = mergeRecord[item].mergeField;
                var dataLength = layui.table.cache[myTable.id].length;
                for (var i=0; i<mergeField.length; i++) {

                    if (layui.table.cache[myTable.id][dataLength-2-index][mergeField[i]]
                        !== layui.table.cache[myTable.id][dataLength-1-index][mergeField[i]]) {
                        return true;
                    }
                }
                return false;
            }



        },
        /**
     * name layui合并tbody中单元格的方法
     * @param tableId  表格的id属性
     * @param fieldName 要合并的列field值
     * @desc 此方式适用于没有列冻结的单元格合并
     */
    tableRowSpanNoFixedCol:function(tableId, fieldName) {
        if (!tableId && !fieldName) {
            console.log('tableId, fieldName为必填项');
            return false;
        }
        // 获取页面中全部的表格元素
        var allTableNode = document.getElementsByClassName("layui-table-view");

        // 获取lay-id属性为tableId的表格元素的
        var targetTableNode = null;
        if (allTableNode.length > 0) {
            for (var index = 0, length = allTableNode.length; index < length; index++) {
                // 通过lay-id属性过滤表格元素
                var tableLayId = allTableNode[index].getAttribute("lay-id");
                if (tableLayId === tableId) {
                    targetTableNode = allTableNode[index];
                    break;
                }
            }
        }
        if (!targetTableNode) {
            console.log('没有找到ID为：' + tableId + '的表格, 请升级您的layui版本');
            return false;
        }

        // 开始合并单元格操作
        var tBodyNode = targetTableNode.getElementsByClassName("layui-table-body")[0];

        var tdNodes = tBodyNode.getElementsByTagName("td");
        var childFilterArr = [];
        // 获取data-field属性为fieldName的td
        for (var i = 0; i < tdNodes.length; i++) {
            if (tdNodes[i].getAttribute("data-field") === fieldName) {
                childFilterArr.push(tdNodes[i]);
            }
        }

        // 获取td的个数和种类
        var childFilterTextObj = {};
        var childFilterArrLength = childFilterArr.length;
        for (var j = 0; j < childFilterArrLength; j++) {
            var childText = childFilterArr[j].textContent;
            if (childFilterTextObj[childText] === undefined) {
                childFilterTextObj[childText] = 1;
            } else {
                var num = childFilterTextObj[childText];
                childFilterTextObj[childText] = num * 1 + 1;
            }
        }
        // 给获取到的td设置合并单元格属性
        for (var key in childFilterTextObj) {
            var tdNum = childFilterTextObj[key];
            var canRowSpan = true;
            var needChangeBackGroundNodes = [];
            var addEventNode = null;
            for (var h = 0; h < childFilterArrLength; h++) {
                if (childFilterArr[h].textContent === key) {
                    needChangeBackGroundNodes.push(childFilterArr[h]);
                    if (canRowSpan) {
                        childFilterArr[h].setAttribute("rowspan", tdNum);
                        addEventNode = childFilterArr[h];
                        canRowSpan = false;
                    } else {
                        childFilterArr[h].style.display = "none";
                    }
                }
            }

            // 以下为单元格鼠标悬浮样式修改(使用闭包)
            (function (addEventNode, needChangeBackGroundNodes) {
                addEventNode.onmouseover = function () {
                    for (var index = 0, length = needChangeBackGroundNodes.length; index < length; index++) {
                        needChangeBackGroundNodes[index].parentNode.style.background = "#f2f2f2"; // 我这里的单元格鼠标滑过背景色为layui默认，你可以更改为你想要的颜色。
                    }
                };
                addEventNode.onmouseout = function () {
                    for (var index = 0, length = needChangeBackGroundNodes.length; index < length; index++) {
                        needChangeBackGroundNodes[index].parentNode.style.background = "";
                    }
                };
            })(addEventNode, needChangeBackGroundNodes);
        }
    },
      /**
     * name layui合并tbody中单元格的方法
     * @param tableId  表格的id属性
     * @param fieldName 要合并的列field值
     * @param leftOrRight 要合并的列fixed值,'left','right'
     * @desc 此方式适用于列冻结的单元格合并
     */
    tableRowSpanOfFixedCol:function(tableId, fieldName, leftOrRight) {
        if (!tableId && !fieldName) {
            console.log('tableId, fieldName为必填项');
            return false;
        }

        // 获取页面中全部的表格元素
        var allTableNode = document.getElementsByClassName("layui-table-view");

        // 获取lay-id属性为tableId的表格元素的
        var targetTableNode = null;
        if (allTableNode.length > 0) {
            for (var index = 0, length = allTableNode.length; index < length; index++) {
                // 通过lay-id属性过滤表格元素
                var tableLayId = allTableNode[index].getAttribute("lay-id");
                if (tableLayId === tableId) {
                    targetTableNode = allTableNode[index];
                }
            }
        }
        if (!targetTableNode) {
            console.log('没有找到ID为：' + tableId + '的表格,请升级您的layui版本');
            return false;
        }
        // 左侧列为冻结的情况
        var tBodyNode = targetTableNode.getElementsByClassName("layui-table-body")[0];
        var tBodyNodeFixed = null;
        if (leftOrRight === 'right') {
            tBodyNodeFixed = targetTableNode.getElementsByClassName("layui-table-fixed-r")[0];
        } else {
            tBodyNodeFixed = targetTableNode.getElementsByClassName("layui-table-fixed-l")[0];
        }

        var tdNodesFixed = tBodyNodeFixed.getElementsByTagName("td");
        var tdNodes = tBodyNode.getElementsByTagName("td");
        var childFilterArrFixed = [];
        var childFilterArr = [];
        // 获取data-field属性为fieldName的td
        for (var i = 0; i < tdNodesFixed.length; i++) {
            if (tdNodesFixed[i].getAttribute("data-field") === fieldName) {
                childFilterArrFixed.push(tdNodesFixed[i]);
            }
        }
        for (var l = 0; l < tdNodes.length; l++) {
            if (tdNodes[l].getAttribute("data-field") === fieldName) {
                childFilterArr.push(tdNodes[l]);
            }
        }
        // 获取td的个数和种类
        var childFilterArrLength = childFilterArrFixed.length;
        var childFilterTextObj = {};
        for (var j = 0; j < childFilterArrLength; j++) {
            var childText = childFilterArrFixed[j].textContent;
            if (childFilterTextObj[childText] === undefined) {
                childFilterTextObj[childText] = 1;
            } else {
                var num = childFilterTextObj[childText];
                childFilterTextObj[childText] = num * 1 + 1;
            }
        }
        // 给获取到的td设置合并单元格属性
        for (var key in childFilterTextObj) {
            var tdNum = childFilterTextObj[key];
            var canRowSpan = true;
            var needChangeBackGroundNodesFixed = [];
            var needChangeBackGroundNodes = [];
            var addEventNode = null;
            for (var h = 0; h < childFilterArrLength; h++) {
                if (childFilterArrFixed[h].innerText === key) {
                    needChangeBackGroundNodesFixed.push(childFilterArrFixed[h]);
                    if (canRowSpan) {
                        childFilterArrFixed[h].setAttribute("rowspan", tdNum);
                        addEventNode = childFilterArrFixed[h];
                        canRowSpan = false;
                    } else {
                        childFilterArrFixed[h].style.display = "none";
                    }
                }
            }
            for (var m = 0; m < childFilterArrLength; m++) {
                if (childFilterArr[m].innerText === key) {
                    needChangeBackGroundNodes.push(childFilterArr[m]);
                }
            }

            // 以下为单元格鼠标悬浮样式修改(使用闭包)
            (function (addEventNode, needChangeBackGroundNodes, needChangeBackGroundNodesFixed) {
                addEventNode.onmouseover = function () {
                    for (var index = 0, length = needChangeBackGroundNodes.length; index < length; index++) {
                        needChangeBackGroundNodesFixed[index].parentNode.style.background = "#f2f2f2"; // 我这里的单元格鼠标滑过背景色为layui默认，你可以更改为你想要的颜色。
                        needChangeBackGroundNodes[index].parentNode.style.background = "#f2f2f2"; // 我这里的单元格鼠标滑过背景色为layui默认，你可以更改为你想要的颜色。
                    }
                };
                addEventNode.onmouseout = function () {
                    for (var index = 0, length = needChangeBackGroundNodes.length; index < length; index++) {
                        needChangeBackGroundNodesFixed[index].parentNode.style.background = "";
                        needChangeBackGroundNodes[index].parentNode.style.background = "";
                    }
                };
            })(addEventNode, needChangeBackGroundNodes, needChangeBackGroundNodesFixed);
        }
    }
    };

    // 输出
    exports('tableMerge', mod);
});

