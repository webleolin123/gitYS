var custom,common,zefuTable,zefuTree,zefuDate,zefuUpload;
layui.config({
    base: '../../../src/js/',
    version: new Date().getTime()
}).extend({
    zefuTable: 'common/zefuTable',
    zefuDate: 'common/zefuDate',
    zefuUpload: 'common/zefuUpload',
    zefuTree: 'common/zefuTree',
    zefuLayer: 'common/zefuLayer',
    custom:'common/custom'
}).define(['custom','zefuTable','zefuDate','zefuUpload','zefuTree','zefuLayer'], function (exports) {
    common=layui.common;
    custom=layui.custom;
    zefuTable=layui.zefuTable,
    zefuTree = layui.zefuTree;
    zefuDate= layui.zefuDate;
    zefuUpload = layui.zefuUpload;
    zefuLayer = layui.zefuLayer;

    var dynamicLoading = {
        loadCss: function(path){
       if(!path || path.length === 0){
        throw new Error('argument "path" is required !');
       }
       var head = document.getElementsByTagName('head')[0];
          var link = document.createElement('link');
          link.href = path;
          link.rel = 'stylesheet';
          link.type = 'text/css';
          head.appendChild(link);
        },
        loadJs: function(path){
       if(!path || path.length === 0){
        throw new Error('argument "path" is required !');
       }
    //    var head = document.getElementsByTagName('head')[0];
          var script = document.createElement('script');
          script.src = path;
          script.type = 'text/javascript';
          document.body.appendChild(script);
        }
    };
    var allDemo = {
        load:function(){

            common.fetchGet('../../src/js/configdemo.json',function (res) {
                if( typeof res !="object"){
                    res= $.parseJSON(res);
                }

                var propArr=[];
                var func={
                    getProp:function(components){
                        if(!! components && components.length>0){
                            $.map(components,function (val) {
                                if(!!val.prop){
                                    propArr.push(val.prop);
                                    func.getProp(val.components);
                                }
                            })
                        }
                    }
                };
                //组成所有生成的prop
                $.map(res.components,function (item) {
                    if(!! item.prop){
                        propArr.push(item.prop);
                        //递归
                        func.getProp(item.components);
                    }
                });


                //页面 theme layout 配置

                var pageSet=res.prop;

                //自动生成布局 必须先引入，不然所有的模块都没有dom

                custom.layout({
                    ele: $('.mainBox'),
                    layoutWidth:pageSet.layoutWidth,
                    layoutHeight:pageSet.layoutHeight,
                    moduleName:pageSet.moduleName
                });
                //主题信息导入
                custom.theme({});

                //各模块信息导入
                $.map(propArr,function (item, index) {

                    switch (item.plugin) {
                        case 'zefuLayer':

                            // zefuLayer.init();
                            zefuLayer.init({
                                getUrl:item.layer.getUrl,
                                customStyle:item.layer.customStyle,
                                area:item.layer.area,
                                offset:item.layer.offset,
                                title:item.layer.title,
                                maxmin: item.layer.maxmin,
                                type: item.layer.type,
                                btn: item.layer.btn,
                                btn1:item.layer.btn1,
                                shadeClose:item.layer.shadeClose,
                                content:item.layer.content,
                                success:item.layer.success
                            });
                            break;
                        case 'tree':  //tree组件模块
                            zefuTree.init({
                                module:item.name,
                                treeUrl:item.treeUrl,
                                lazy:item.lazy,
                                nextParam:item.nextParam
                            });
                            break;
                        case 'table':  //table组件模块


                            zefuTable.init({
                                'module': item.name,
                                'url': item.url,
                                'cols': item.cols,
                                'defaultToolbar': ["exports", "print"],
                                'buttons':item.buttons,
                                'operates':item.operates,
                                'page':true,
                                'rowClick':true
                            });
                            break;

                        case 'form': //一般form组件模块

                            custom.form({
                                module:item.name,
                                title:item.title,
                                field:item.field
                            });

                            break;

                        case 'searchTable':  //表格搜索

                            custom.tableSearch({
                                module:item.name,
                                theme:item.theme,
                                title:item.title,
                                field:item.field
                            });


                            break;
                        case 'chart':  //echart 图表区域

                            break;
                        case 'date':  //日期控件
                            zefuDate.init({
                                module:item.name,
                                name:item.id,
                                format:item.format,
                                value:item.value
                            });

                            break;
                        case 'upload':  //文件上传控件
                            zefuUpload.init({
                                module:item.name,
                                name:item.id,
                                text:item.text,
                                chooseToModule:item.chooseToModule,
                                accept:item.accept,
                                fileId:item.fileId,
                                multiple:item.multiple,
                                number:item.number,
                                auto:item.auto,
                                bindAction:item.bindAction,
                                url:item.url
                            });
                            break;
                    }
                });


            });
        },
        loadJs:function(url,callback){
            var script=document.createElement('script');
            script.type="text/javascript";
            if(typeof(callback)!="undefined"){
            if(script.readyState){
            script.onreadystatechange=function(){
             if(script.readyState == "loaded" || script.readyState == "complete"){
             script.onreadystatechange=null;
             callback();
             }
            }
            }else{
            script.onload=function(){
             callback();
            }
            }
            }
            script.src=url;
            document.body.appendChild(script);
        },
        loadCss:function(options){
            var url = options.url,
                callback = typeof options.callback == "function" ? options.callback : function(){},
                id = options.id,
                node = document.createElement("link"),
                supportOnload = "onload" in node,
                isOldWebKit = +navigator.userAgent.replace(/.*(?:AppleWebKit|AndroidWebKit)\/?(\d+).*/i, "$1") < 536, // webkit旧内核做特殊处理
                protectNum = 300000; // 阈值10分钟，一秒钟执行pollCss 500次
            node.rel = "stylesheet";
            node.type = "text/css";
            node.href = url;
            if( typeof id !== "undefined" ){
                node.id = id;
            }
            document.getElementsByTagName("head")[0].appendChild(node);
            // for Old WebKit and Old Firefox
            if (isOldWebKit || !supportOnload) {
                // Begin after node insertion
                setTimeout(function() {
                    pollCss(node, callback, 0);
                }, 1);
                return;
            }
            if(supportOnload){
                node.onload = onload;
                node.onerror = function() {
                    // 加载失败(404)
                    onload();
                }
            }else{
                node.onreadystatechange = function() {
                    if (/loaded|complete/.test(node.readyState)) {
                        onload();
                    }
                }
            }
        },
        output:function () {
            allDemo.load();
              // dynamicLoading.loadJs('../../js/test.js');
            // allDemo.loadJs("https://cdn.staticfile.org/html5shiv/r29/html5.min.js",function(){
            //     alert('js加载完成');
            // });
            // allDemo.loadJs("../../js/test.js",function(){
            //     alert('js加载完成');
            // });
        }
    };

exports('allDemo', allDemo);
});
