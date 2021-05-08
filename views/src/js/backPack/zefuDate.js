/**
 * @Description: 多封装一层layDate
 * I don't know. I dare not ask！
 * @author camin
 * @date 2019/5/24 20:38
 */

layui.extend().define(['layer','laydate'], function (exports) {
    var laydate=layui.laydate;

    var zefuDate={

        config:null,
        //日期控件渲染
        render:function(){
            if(!this.initConfig()){return false};
            laydate.render(this.config);
        },
        //用于初始化日期控件初始属性
        init:function(config){
            this.copyConfig(config);
            if(!this.initConfig()){return false};
            this.html();
            this.render();
        },
        //生成html代码片段
        html:function(){
            if(!this.initConfig()){return false};
            var config = this.config;
            var id = "date_" + config.module;
            config.elem = "#"+id;
            var moduleDom = $('#module_' + config.module);
            moduleDom.html('');
            var dateInput = document.createElement("input");
            dateInput.type = "text";
            dateInput.className = "layui-input";
            dateInput.id = id;
            dateInput.name = config.name;
            moduleDom[0].appendChild(dateInput);
        },
        //config属性校验
        checkConfig:function(){
            var config = this.config;
            if(!config){

                return false;
            }
            if(!config.module){

                return false;
            }
            if(!config.name){

                return false;
            }
            return true;
        },
        //初始化配置信息
        initConfig:function(){
            if(!this.checkConfig()){return false}
            return true;
        },
        //复制属性，后续可能有其他的一些特殊判断
        copyConfig:function(options){
            if(!this.config) this.config = {};
            $.extend(this.config,options);
        }
    };
    exports('zefuDate', zefuDate);
});
