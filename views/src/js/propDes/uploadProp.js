/**
 * 上传组件 属性说明
 * plugin : "upload"
 * */
var prop={
    /**
     * 属性含义：组件类型（必填）
     * 属性值类型：string
     * */
    "plugin": "upload",
    /**
     * 属性含义：模块名称（必填）
     * 属性值类型：string
     * */
    "name": "",

    /**
    * 属性含义：模块ID（必填）
    * 属性值类型：string
    */
    "module":"",
    /**
     * 属性含义：上传文件地址（必填）
     * 属性值类型：string
     */
    "url":"",
    /**
     * 属性含义：选择后文件列表显示的moduleId
     * 类型：String
     */
    "chooseToModule ":"",
    /**
     * 属性含义：文件选择后事件
     * 类型：string
     */
    "choose":"",

    /**
     * 属性含义：文件上传成功事件
     * 类型：String
     */
    "done":"",

    /**
     * 属性含义：文件上传失败事件
     * 类型：String
     */
    "error":"",
    /**
     * 属性含义：是否允许多文件上传。
     * 类型：boolean
     * 默认：false ，设置true即可开启。不支持ie8/9
     */
    "multiple":"",
    /**
     * 属性含义：指定允许上传时校验的文件类型
     * 类型:String
     * 默认值: images
     * 可选值: 可选值有：images（图片）、file（所有文件）、video（视频）、audio（音频）
     */
    "accept":"",

    /**
     * 属性含义：允许上传的文件后缀,一般结合 accept 参数类设定
     * 类型:String
     * 默认值：jpg|png|gif|bmp|jpeg
     * 如果 accept 未设定，那么限制的就是图片的文件格式
     */
    "exts":"",
    /**
     * 属性含义：是否选完文件后自动上传。如果设定 false，那么需要设置 bindAction 参数来指向一个其它按钮提交上传
     * 类型：Boolean
     * 默认值：false
     */
    "auto":"",
    /**
     * 属性含义：指向一个按钮触发上传，一般配合 auto: false 来使用。值为选择器或DOM对象，如：bindAction: '#btn'
     * 类型:String
     */
    "bindAction":"",
    /**
     * 属性含义：设定文件域的字段名	
     * 类型：string	
     * 默认值：file
     */
    "field":""
}