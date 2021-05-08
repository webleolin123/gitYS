layui.define(['common','form'],function (exports) {
    var common = layui.common,
        layForm = layui.form;

    var zefuSelect ={
        zfSelectInit:function (obj) {
            var defaultParams={
                module: '',
                elem:'',//节点id
                type:'',//类型 1:普通单选框 2:分组单选框 3:搜索单选框
                inputType:',',//显示类型 layui-input-block:单行显示时使用  layui-input-inline:一行多个显示时使用
                labelTitle:'',//标题
                loadData:false,
                optionText:'',
                optionValue:'',

                url:'',
                method: 'get',
                responseList:'list',
                where:null,
                form:'',
                changeInit:false
            };
            var param=$.extend({},defaultParams,obj);

            var parent= $(param.elem);
            var html;
            if (param.type ==1) {
                html= '<label class="layui-form-label">'+param.labelTitle+'</label>\n'+
                      '<div class="'+param.inputType+'">\n'+
                      '  <select name="" lay-filter="">\n'+
                      '    <option value="">请选择</option>'
            }else if (param.type ==2) {
                html= '<label class="layui-form-label">'+param.labelTitle+'</label>\n'+
                      '<div class="'+param.inputType+'">\n'+
                      '  <select name="">\n'+
                      '    <option value="">请选择</option>'
            }else {
                html= '<label class="layui-form-label">'+param.labelTitle+'</label>\n'+
                      '<div class="'+param.inputType+'">\n'+
                      '  <select name="" lay-verify="required" lay-search="">\n'+
                      '    <option value="">直接选择或搜索选择</option>'
            }

            if(param.loadData){
                var data=param.loadData;
                //导入表格数据
                if(data.length>0) {
                    if (param.type!=2) {
                        for (var i = 0; i < data.length; i++) {
                            html += '<option value="' + data[i][param.optionValue] + '">' + data[i][param.optionText] + '</option>';
                        }
                    }else {
                        for (var i = 0; i < data.length; i++) {
                            if (data[i].length>0){
                                html += '<optgroup label='+data[i][0].title+'>\n'
                                for (var j=0;j<data[i].length;j++)
                                {
                                    html += '<option value="' + data[i][j][param.optionValue] + '">' + data[i][j][param.optionText] + '</option>';
                                }
                                html += ' </optgroup>'
                            }
                        }
                    }
                    html+='   </select>\n' +
                          '</div>\n';
                    //导入html
                    parent.empty().html(html);
                    layForm.render();
                }
            }else{
                common.fetch(param.url,param.method,param.where,function (res) {
                    //导入表格数据
                    if(res && res[param.responseList]){
                        if (param.type!=2) {
                            for (var i=0;i<res[param.responseList].length;i++){
                                html+='<option value="'+res[param.responseList][i][param.optionValue]+'">'+res[param.responseList][i][param.optionText]+'</option>';
                            }
                            html+='    </select>\n' +
                                '</div>\n';
                            //导入html
                            parent.empty().html(html);
                            layForm.render();
                        }else {
                            for (var i = 0; i < res[param.responseList].length; i++) {
                                if (res[param.responseList][i].length>0){
                                    html += '<optgroup label='+res[param.responseList][i][0].title+'>\n'
                                    for (var j=0;j<data[i].length;j++)
                                    {
                                        html += '<option value="' + res[param.responseList][i][j][param.optionValue] + '">' + res[param.responseList][i][j][param.optionText] + '</option>';
                                    }
                                    html += ' </optgroup>'
                                }
                            }
                            html+='    </select>\n' +
                                '</div>\n';
                            //导入html
                            parent.empty().html(html);
                            layForm.render();
                        }
                    }
                },param.fail);
            }
        }
    }
    exports('zefuSelect',zefuSelect);
});
