/**

 @Name：树组件封装
 @des:  树的html，初始化
 @Author：lfx
 @updateTime : 2019-05-24
 */
layui.define(['jquery'], function (exports) {
    var $ = layui.jquery;
    //导入样式文件
    layui.link('../../css/ztree/zTreeStyle/zTreeStyle.css');


    var zTree = {
        moduleId:"",
        treeId:"",
        allDataUrl : "../../../tree/queryTreeDataAll",
        lazyDataUrl : "../../../tree/queryTreeDataLazy",
        setting : {
            async : {
                enable: false,
                url: "",
                otherParam: {},
                dataFilter: function(treeId, parentNode, responseData){
                    responseData = responseData.list;
                    return responseData;
                }
            },
            data : {},
            callback:{},
            check:{}
        },
        zNodes : [],

        /**
         * 初始化树统一入口
         * @param params
         * @returns {*}
         */
        init:function(params){
            $.extend(this.setting.async, params.async);//异步加载Id
            $.extend(this.setting.data, params.data);//数据格式化
            $.extend(this.setting.callback, params.callback);//回调方法触发
            $.extend(this.setting.check, params.check);//选择属性
            this.treeId = "tree_"+params.module;
            this.moduleId = "module_"+params.module;
            this.loadHtml();//加载html
            return this.loadTree();//初始化数据
        },

        /**
         * 加载html
         */
        loadHtml:function(){
            var html = '<ul id="'+ this.treeId +'" class="ztree" lay-filter="' + this.treeId + '"></ul>' + '<br>';
            html += '<script src="../lib/ztree/jquery.ztree.core.js"></script>';
            html += '<script src="../lib/ztree/jquery.ztree.excheck.min.js"></script>';
            $('#' + this.moduleId).empty().append(html);
        },

        /**
         * 加载数据
         * @returns {*}
         */
        loadTree:function(){
            return $.fn.zTree.init($("#"+this.treeId), this.setting, this.zNodes);
        },


        //------------------------------------树方法-start----------------------------------//
        /**
         * 根据树ID获取树对象
         * @param treeId
         * @returns {*}
         */
        getTreeObj : function(treeId){
            return $.fn.zTree.getZTreeObj(treeId);
        }

        //------------------------------------树方法-end----------------------------------//
    }

    exports('zTree', zTree);
});
