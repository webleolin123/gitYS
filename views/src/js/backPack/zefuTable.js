/**
 @Name：zefu表格组件
 @Author：zkq
 @date：2019-05-25
 */

layui.define([ 'layer', 'table','common'],function (exports) {
    var table = layui.table;
    var layer = layui.layer;
    var common = layui.common;

    var zefuTable = {
        module: '',    //默认表格ID
        title: '标题',  //默认标题
        selectUrl: '/queryList',    //列表查询接口
        detailUrl: '/detailInfo',   //详情接口
        insertUrl: '/add',          //添加接口
        updateUrl: '/modify',       //修改接口

        defaultToolbar: ['filter', 'print', 'exports'],

        // 按钮组
        buttons: [],

        //操作按钮列表
        operates: [
            // {key:'edit', name:'修改'},
            // {key:'del', name:'删除', class:'layui-btn-danger'},
            // {key:'info', name:'详情'}
        ],

        //表格列定义，外部参数
        cols: [[
            { type: 'checkbox', fixed: 'left' },
            { field: 'name', title: '标题名称', width: '40%', fixed: 'left', sort: true, template: function(obj){
                    return '<span>' + obj.name + '</span>';
                }
            },
            { field: 'email', title: '邮箱地址', width: '40%', fixed: 'left', sort: true },
            { title: '操作', fixed: 'right', toolbar: '' }
        ]],

        //是否分页
        page: true,

        //是否支持行点击
        rowClick: true,

        //是否已初始化
        initFlag: false,

        //组件初始化操作，可以传入配置参数
        init: function(param){
            $.extend(this, param);
            zefuTable.putHtml();
            //如果有按钮组，则渲染按钮组html
            if(zefuTable.buttons.length > 0){
                zefuTable.addBtnHtml();
            }
            //如果有操作按钮组，则渲染操作按钮组html
            if(zefuTable.operates.length > 0){
                zefuTable.addOperBtnHtml();
            }

            zefuTable.render();

            $(".zefuTable_init").bind('click', function(obj){
                var param = eval("(" + $("#initData").val().trim() + ")");
                $('#toolbar_' + zefuTable.module).remove();
                $('#bar_' + zefuTable.module).remove();

                zefuTable.init(param);
            })
        },
        // 生成html代码
        putHtml: function(){
            var strHtml = '';
            strHtml += '<table class="layui-hide" id="table_' + zefuTable.module + '" lay-filter="table_' + zefuTable.module + '"></table>';
            $('#module_' + this.module).append(strHtml);
        },
        // 添加按钮
        addBtnHtml: function(){
            var strHtml = '';
            strHtml += '<script type="text/html" id="toolbar_' + this.module + '">';
            strHtml += '  <div class="layui-btn-container">';

            for(var i=0; i<zefuTable.buttons.length; i++){
                var button = zefuTable.buttons[i];
                strHtml += '    <button class="layui-btn layui-btn-sm" lay-event="' + button.key + '">' + button.name + '</button>';
            }

            // strHtml += '    <button class="layui-btn layui-btn-sm" lay-event="getCheckLength">获取选中数目</button>';
            // strHtml += '    <button class="layui-btn layui-btn-sm" lay-event="isAll">验证是否全选</button>';
            strHtml += '  </div>';
            strHtml += '</script>';
            $('#module_' + this.module).append(strHtml);
        },
        // 添加操作按钮
        addOperBtnHtml: function(){
            var strHtml = '';
            strHtml += '<script type="text/html" id="bar_' + this.module + '">';

            for(var i=0; i<zefuTable.operates.length; i++){
                var operate = zefuTable.operates[i];
                strHtml += '  <a class="layui-btn ' + (operate.class ? operate.class : '') + ' layui-btn-xs" lay-event="' + operate.key + '">' + operate.name + '</a>';
            }
            // strHtml += '  <a class="layui-btn layui-btn-xs" lay-event="edit">编辑</a>';
            // strHtml += '  <a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="del">删除</a>';
            strHtml += '</script>';
            $('#module_' + this.module).append(strHtml);

            for(var i=0; i < zefuTable.cols[0].length; i++){
                var col = zefuTable.cols[0][i];
                if(col.title && col.title === '操作'){
                    col.toolbar = '#bar_' + zefuTable.module;
                }
            }
        },
        // 渲染组件
        render: function(){
            if(!this.module){
                layer.msg('未找到module配置');
                return
            }
            if(!this.url){
                layer.msg('未找到url配置');
                return
            }

            var params = {};
            params.elem = '#table_' + zefuTable.module;
            params.title = zefuTable.title;
            params.page = zefuTable.page;
            if(!zefuTable.url) {
                layer.alert('模块' + zefuTable.module + '表格URL参数配置有误，请检查');
            }
            params.url = zefuTable.url;

            if(zefuTable.buttons.length > 0) params.toolbar = '#toolbar_' + zefuTable.module;

            if(zefuTable.defaultToolbar) params.defaultToolbar = zefuTable.defaultToolbar;

            if(zefuTable.cols) params.cols = zefuTable.cols;

            if(zefuTable.width) params.width = zefuTable.width;

            if(zefuTable.height) params.height = zefuTable.height;

            if(!zefuTable.initFlag){
                table.render(common.tableInitParams(params));
                zefuTable.initFlag = true;
            }else{
                table.reload('table_' + zefuTable.module, params);
            }

            //工具栏事件绑定
            zefuTable.bindToolBar();

            //操作按钮事件绑定
            zefuTable.bindTool();

            //是否开启行点击事件
            zefuTable.bindRowClick();
        },
        //绑定按钮事件
        bindToolBar: function(){
            if(zefuTable.buttons.length > 0){
                table.on('toolbar(table_' + zefuTable.module + ')', function(obj){
                    var checkStatus = table.checkStatus(obj.config.id);
                    switch(obj.event){
                        case 'getCheckData':
                            layer.msg('选中数据为：' + JSON.stringify(checkStatus));
                            break;
                        case 'getCheckLength':
                            layer.msg('选中数据条目数' + checkStatus.data.length);
                            break;
                        case 'isAll':
                            layer.msg(checkStatus.isAll ? '全选': '未全选');
                            break;
                        default:
                            if(obj.event){
                                eval('(' + obj.event + '(' + JSON.stringify(checkStatus) + '))');
                            }
                        }
                    }
                );
            }
        },
        //绑定操作按钮事件
        bindTool: function(){
            if(zefuTable.operates.length > 0){
                table.on('tool(table_' + zefuTable.module + ')', function(obj){
                    var data = obj.data;
                    if(obj.event === 'del'){
                        layer.confirm('确认删除吗？', function(index){
                            layer.msg('待实现');
                            //   obj.del();
                            //   layer.close(index);
                        });
                        layui.stope(obj.event);
                    } else if(obj.event === 'edit'){
                        layer.msg('待实现');
                        layui.stope(obj.event);
                    }
                });
            }
        },
        //是否开启行点击事件
        bindRowClick: function(){
            if(zefuTable.rowClick){
                table.on('row(table_' + zefuTable.module + ')', function(obj){
                    var data = obj.data;
                    layer.msg('选择的数据：' + JSON.stringify(data));
                });
            }else{
                table.on('row(table_' + zefuTable.module + ')', function(obj){});
            }
        }
    };

    exports('zefuTable',zefuTable);
});
