/**
 * 表格组件 属性说明
 * plugin : "zefuTable"
 * */

var prop={
    /**
     * 属性含义：组件类型
     * 属性值类型：string
     * */
    "plugin": "zefuTable",
    /**
     * 属性含义：模块名称
     * 属性值类型：string
     * */
    "name": "",
    /**
    * 属性含义：模块ID（必填）
    * 属性值类型：string
    */
    "module": "",
    /**
    * 属性含义：表格加载数据列表地址（必填）
    * 属性值类型：string
    */
    "url": "",
    /**
    * 属性含义：默认工具栏（必填）
    * 属性值类型：array
    */
    "defaultToolbar": ['exports', 'print'],
    /**
    * 属性含义：按钮
    * 属性值类型：array
    */
    "buttons": [
        {
            /**
            * 属性含义：按钮方法名
            * 属性值类型：string
            */
            "key":"",
            /**
            * 属性含义：按钮显示名称
            * 属性值类型：string
            */
            "name":""
        }
    ],
    /**
    * 属性含义：操作按钮
    * 属性值类型：array
    */
    "operates": [
        {
            /**
            * 属性含义：按钮方法名
            * 属性值类型：string
            */
            "key":"",
            /**
            * 属性含义：按钮显示名称
            * 属性值类型：string
            */
            "name":""
        }
    ],
    /**
    * 属性含义：是否分页
    * 属性值类型：boolean
    */
    "page": true,
    /**
    * 属性含义：是否支持行点击事件
    * 属性值类型：boolean
    */
    "rowClick": true
}