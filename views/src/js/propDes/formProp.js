/**
 * 表单组件 属性说明
 * plugin : "form"
 * */

var prop={
    /**
     * 属性含义：组件类型
     * 属性值类型：string
     * */
    "plugin": "form",

    /**
     * 属性含义：模块名称
     * 属性值类型：string
     * */
    "name": "",

    /**
     * 属性含义：form区域
     * 属性值类型：array
     * */
    "field": [
        {
            /**
             * 属性含义：表单样式主题
             * 属性值类型：string
             * 属性可能值: 1（label具有方框风格），2(label没有方框风格)
             * 属性值含义: "1"，"2"
             * 默认值: "1"
             * */
            "theme":"1",
            /**
             * 属性含义：field 标题
             * 属性值类型：string
             * */
            "title": {
                "name": "field区域"
            },
            /**
             * 属性含义：表单区域
             * 属性值类型：array
             * */
            "form":[
                {
                    /**
                     * 属性含义：表单 属性name值
                     * 属性值类型：string
                     * */
                    "name":"a1",
                    /**
                     * 属性含义：表单 label值
                     * 属性值类型：string
                     * */
                    "label":"默认输入框",
                    /**
                     * 属性含义：是否必选
                     * 属性值类型：Boolean
                     * 默认值：false
                     * */
                    "required":true,

                    /**
                     * 属性含义：占位提示
                     * 属性值类型：string
                     * */
                    "placeholder":"请输入名称",
                    /**
                     * 属性含义：表单类型
                     * 属性值类型：string
                     * 属性可能值: "input" ,"select","textarea","checkbox","radio","switch","button"
                     * 属性值含义: "1"，"2"
                     * 默认值："1"
                     *  */
                    "type":"input",

                    /**
                     * 属性含义：占列
                     * 属性值类型：number
                     * 默认值：12
                     * */
                    "col":6,

                    /**
                     * 属性含义：表单布局
                     * 属性值类型：boolean
                     * 属性值含义：true (block) false(inline)
                     * 默认值：false
                     * */
                    "inline": true,

                    /**
                     * 属性含义：label 是否占全列
                     * 属性值类型：boolean
                     * 属性值含义：true (block) false(inline)
                     * 默认值: false
                     * */
                    "isLabelFull":false,
                    /**
                     * 属性含义：type 为select时，异步下拉数据接口连接
                     * 属性值类型：string
                     * */
                    "url":"",

                    /**
                     * 属性含义：请求类型
                     * 属性值类型：string
                     * 属性可能值: "get","post"
                     * 默认值: "get"
                     * */
                    "method":"get",

                    /**
                     * 属性含义：返回数据访问字段
                     * 属性值类型：string
                     * 默认值 : "list"
                     * */
                    "responseList":"list",


                    /**
                     * 属性含义：type 为select时，option 的text值
                     * 属性值类型：string
                     * */
                    "optionText":"",
                    /**
                     * 属性含义：type 为select时，option 的value值
                     * 属性值类型：string
                     * */
                    "optionValue":"",

                    /**
                     * 属性含义：type 为select时，导入的数据
                     * 属性值类型：array
                     * */
                    "data":[
                        {
                            /**
                             * 属性含义：导入数据
                             * 属性值类型：string
                             * */
                            "text":"",
                            /**
                             * 属性含义：type 为select时，option 的value值
                             * 属性值类型：string
                             * */
                            "value":"",

                            /**
                             * 属性含义：type 为radio/checkbox时，默认选中项
                             * 属性值类型：boolean
                             * 默认值： false
                             * */
                            "checked":false,

                            /**
                             * 属性含义：type 为radio/checkbox时，不可选项
                             * 属性值类型：boolean
                             * 默认值： false
                             * */
                            "disabled":false,

                        }
                    ],

                    /**
                     * 属性含义：type 为select时，是否支持搜索
                     * 属性值类型：boolean
                     * */
                    "isSearch":true,

                    /**
                     * 属性含义：type 为checkBox时，主题
                     * 属性值类型：number
                     * 数值值：1，2
                     * 默认值 ：2
                     * */
                    "theme":2,

                    /**
                     * 属性含义：type 为switch时，是否开启状态
                     * 属性值类型：boolean
                     * */
                    "checked": true,
                    "btnOper": {
                        "event": "upload",
                        "eventSet": {"type": "multiFile", "accept": "file", "fileId": "fileTest", "multiple": true}
                    }
                },

            ],
            /**
             * 属性含义：是否开启form组件事件入口
             * 属性值类型：Boolean
             * */
            "isOriginOper":true,

            /**
             * 属性含义：表单按钮区域
             * 属性值类型：array
             * */
            "operation": [
                {
                    /**
                     * 属性含义：按钮名称
                     * 属性值类型：string
                     * */
                    "label":"提交",

                    /**
                     * 属性含义：按钮name属性值
                     * 属性值类型：string
                     * */
                    "name":"submit",

                    /**
                     * 属性含义：按钮类型
                     * 属性值类型：string
                     * 数值值： "submit" (提交)  ，"reset" (重置)
                     * */
                    "type": "submit",

                    /**
                     * 属性含义：按钮事件
                     * 属性值类型：object
                     * */
                    "event":{
                        /**
                         * 属性含义：绑定Url
                         * 属性值类型：string
                         * */
                        "url":"api/json",

                        /**
                         * 属性含义：post 方法中的请求字段
                         * 属性值类型：object
                         * */
                        "request":{},

                        /**
                         * 属性含义：影响区域
                         * 属性值类型：array
                         * */
                        "toModule":[
                            {
                                /**
                                 * 属性含义: 模块名称
                                 * 属性值类型：string
                                 * */
                                "name": " " ,

                                /**
                                 * 属性含义: 事件类型
                                 * 属性值类型：string
                                 * */
                                "eventType": " "
                            }
                        ]

                    }
                }
            ]
        }
    ]
};
