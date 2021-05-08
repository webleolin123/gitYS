/**

 @Name：树组件封装
 @des:  树的html，初始化
 @Author：lfx
 @updateTime : 2019-05-24
 */
layui.define(['eleTree','common'], function (exports) {
    var tree = layui.eleTree;
    var common = layui.common;


    var zefuTree = {
        title:'树展示',
        lazy : true,                //是否懒加载
        emptText: "暂无数据",       //内容为空的时候展示的文本
        highlightCurrent: false,    // 是否高亮当前选中节点，默认值是 false。
        defaultExpandAll: false,    // 是否默认展开所有节点，默认值是 false。
        expandOnClickNode: true,    // 是否在点击节点的时候展开或者收缩节点， 默认值为 true，如果为 false，则只有点箭头图标的时候才会展开或者收缩节点。
        checkOnClickNode: false,    // 是否在点击节点的时候选中节点，默认值为 false，即只有在点击复选框时才会选中节点。
        showCheckbox: false,        //是否显示复选框

        //树初始化
        init: function (param) {
            if(!zefuTree.validateParam(param)) return;
            zefuTree.html(param);//加载树html
            zefuTree.loadData(param);//加载数据
            zefuTree.loadEvent(param);//加载数据
        },

        //校验参数
        validateParam:function(param){
            if(param.module == null || param.module == ''){
                layer.msg('module必须传入');
                return false;
            }
            if(!param.title) param.title = this.title;
            if(!param.lazy) param.lazy = this.lazy;
            if(!param.emptText) param.emptText = this.emptText;
            if(typeof(param.highlightCurrent) == "undefined") param.highlightCurrent = this.highlightCurrent;
            if(typeof(param.defaultExpandAll) == "undefined") param.defaultExpandAll = this.defaultExpandAll;
            if(typeof(param.expandOnClickNode) == "undefined") param.expandOnClickNode = this.expandOnClickNode;
            if(typeof(param.checkOnClickNode) == "undefined") param.checkOnClickNode = this.checkOnClickNode;
            if(typeof(param.showCheckbox) == "undefined") param.showCheckbox = this.showCheckbox;
            if(typeof(param.expandOnClickNode) == "undefined") param.expandOnClickNode = this.expandOnClickNode;
            return true;
        },

        //加载树HTML
        html: function (param) {
            var html = '<div class="layui-card">\n';
            html += '       <div class="layui-card-header">' + param.title + '</div>\n';
            html += '       <div class="layui-card-body">\n';
            html += '           <div class="eleTree" id="tree_' + param.module + '" lay-filter="tree_' + param.module + '"></div>\n';
            html += '       </div>\n';
            html += '   </div>';
            $('#module_' + param.module).empty().append(html);
        },
        //加载数据
        loadData: function (param) {
            var nextUrl = param.treeUrl;
            tree.render(common.treeInitParams({
                elem: '#tree_' + param.module,
                url: param.treeUrl,
                method:param.method,
                lazy: param.lazy,
                emptText: param.emptText,
                showCheckbox: param.showCheckbox,
                renderAfterExpand: param.renderAfterExpand,    // 是否在第一次展开某个树节点后才渲染其子节点
                highlightCurrent: param.highlightCurrent,    // 是否高亮当前选中节点，默认值是 false。
                defaultExpandAll: param.defaultExpandAll,    // 是否默认展开所有节点，默认值是 false。
                expandOnClickNode: param.expandOnClickNode,    // 是否在点击节点的时候展开或者收缩节点， 默认值为 true，如果为 false，则只有点箭头图标的时候才会展开或者收缩节点。
                checkOnClickNode: param.checkOnClickNode,    // 是否在点击节点的时候选中节点，默认值为 false，即只有在点击复选框时才会选中节点。
                accordion: param.accordion,                 // 是否每次只打开一个同级树节点展开（手风琴效果）accordion: false,           // 是否每次只打开一个同级树节点展开（手风琴效果）
                where:param.where,
                contentType: 'application/x-www-form-urlencoded',
                load: function (data, callback) {
                    if (param.nextParam && param.nextParam != null) {
                        for (var i = 0; i < param.nextParam.length; i++) {
                            if (param.nextParam[i].type == "var") {
                                if (nextUrl.indexOf("?") > -1) {
                                    nextUrl += "&" + param.nextParam[i].key + "=" + eval(param.nextParam[i].value);
                                } else {
                                    nextUrl += "?" + param.nextParam[i].key + "=" + eval(param.nextParam[i].value);
                                }
                            } else {
                                if (nextUrl.indexOf("?") > -1) {
                                    nextUrl += "&" + param.nextParam[i].key + "=" + param.nextParam[i].value;
                                } else {
                                    nextUrl += "?" + param.nextParam[i].key + "=" + param.nextParam[i].value;
                                }
                            }
                        }
                    }
                    common.fetchGet(nextUrl, function (res) {
                        if (res.success && res.list) {
                            callback(res.list)
                        }
                    }, function () {
                        callback([])
                    });
                }

            }));
        },
        //加载事件
        loadEvent:function(param){
            if(typeof(param.treeEvents) != "object"){
                tree.on("nodeClick(tree_" + param.module + ")", function (d) {});
                tree.on("nodeChecked(tree_" + param.module + ")", function (d) {});
                tree.on("nodeContextmenu(tree_" + param.module+ ")", function (d) {});
                tree.on("nodeDrag(tree_" + param.module + ")", function (d) {});
                tree.on("nodeAppend(tree_" + param.module+ ")", function (d) {});
                tree.on("nodeInsertBefore(tree_" + param.module+ ")", function (d) {});
                tree.on("nodeRemove(tree_" + param.module+ ")", function (d) {});
                tree.on("nodeInsertAfter(tree_" + param.module+ ")", function (d) {});
                tree.on("nodeEdit(tree_" + param.module+ ")", function (d) {});
                return;
            }
            // 节点点击事件
            if(param.treeEvents.onclick && param.treeEvents.onclick != null){
                clickFun = eval(param.treeEvents.onclick);
                if(typeof(clickFun) == "function"){
                    tree.on("nodeClick(tree_" + param.module + ")", function (d) {
                        clickFun.call(this,d);
                    });
                }
            }
            // input被选中事件
            if(param.treeEvents.onChecked && param.treeEvents.onChecked != null){
                checkedFun = eval(param.treeEvents.onChecked);
                if(typeof(checkedFun) == "function"){
                    tree.on("nodeChecked(tree_" + param.module + ")", function (d) {
                        checkedFun.call(this,d);
                    });
                }
            }
            // 鼠标右键事件
            if(param.treeEvents.rightClick && param.treeEvents.rightClick != null){
                rightClickFun = eval(param.treeEvents.rightClick);
                if(typeof(rightClickFun) == "function"){
                    tree.on("nodeContextmenu(tree_" + param.module+ ")", function (d) {
                        rightClickFun.call(this,d);
                    });
                }
            }
            // 节点被拖拽事件
            if(param.treeEvents.nodeDrag && param.treeEvents.nodeDrag != null){
                nodeDragFun = eval(param.treeEvents.nodeDrag);
                if(typeof(nodeDragFun) == "function"){
                    tree.on("nodeDrag(tree_" + param.module+ ")", function (d) {
                        nodeDragFun.call(this,d);
                    });
                }
            }
            // 添加子节点事件
            if(param.treeEvents.nodeAppend && param.treeEvents.nodeAppend != null){
                nodeAppendFun = eval(param.treeEvents.nodeAppend);
                if(typeof(nodeAppendFun) == "function"){
                    tree.on("nodeAppend(tree_" + param.module+ ")", function (d) {
                        nodeAppendFun.call(this,d);
                    });
                }
            }
            // 添加节点之前事件
            if(param.treeEvents.nodeInsertBefore && param.treeEvents.nodeInsertBefore != null){
                nodeInsertBeforeFun = eval(param.treeEvents.nodeInsertBefore);
                if(typeof(nodeInsertBeforeFun) == "function"){
                    tree.on("nodeInsertBefore(tree_" + param.module+ ")", function (d) {
                        nodeInsertBeforeFun.call(this,d);
                    });
                }
            }

            // 添加节点之后事件
            if(param.treeEvents.nodeInsertAfter && param.treeEvents.nodeInsertAfter != null){
                nodeInsertAfterFun = eval(param.treeEvents.nodeInsertAfter);
                if(typeof(nodeInsertAfterFun) == "function"){
                    tree.on("nodeInsertAfter(tree_" + param.module+ ")", function (d) {
                        nodeInsertAfterFun.call(this,d);
                    });
                }
            }
            // 节点被编辑事件
            if(param.treeEvents.nodeEdit && param.treeEvents.nodeEdit != null){
                nodeEditFun = eval(param.treeEvents.nodeEdit);
                if(typeof(nodeEditFun) == "function"){
                    tree.on("nodeEdit(tree_" + param.module+ ")", function (d) {
                        nodeEditFun.call(this,d);
                    });
                }
            }
            // 节点被删除事件
            if(param.treeEvents.nodeRemove && param.treeEvents.nodeRemove != null){
                nodeRemoveFun = eval(param.treeEvents.nodeRemove);
                if(typeof(nodeRemoveFun) == "function"){
                    tree.on("nodeRemove(tree_" + param.module+ ")", function (d) {
                        nodeRemoveFun.call(this,d);
                    });
                }
            }
        }
    }
    exports('zefuTree', zefuTree);

});
