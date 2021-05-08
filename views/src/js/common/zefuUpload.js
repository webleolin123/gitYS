/**
 * @Description: 多封装一层upload
 * I don't know. I dare not ask！
 * @author camin
 * @date 2019/5/25 14:54
 */

layui.extend().define(['layer','upload','common'], function (exports) {
    var upload=layui.upload;
    var common = layui.common;
    var uploadBtnName = "uploadSubmitBtn";
    var downloadFileFrame = "downloadFileFrame";
    var zefuUpload={
        tempConfig: {
            "module": "test1",
            "name": "test1",
            "text": "选择文件",
            "accept": "file",
            "fileId": "fileTest",
            "multiple": true,
            "number": 0,
            "auto": true,
            "busType": "doc",
            "resId": "resId",
            "bindAction": "#button3"
        },
        config:null,
        frame:null,
        fileObj:[],
        //上传控件渲染
        render:function(){
            if (!this.initConfig()) {
                return false
            }
            this.initFileList();
            upload.render(this.config);
        },
        renderInner:function(){
            if (!this.initConfig()) {
                return false
            }
            upload.render(this.config);
        },
        //用于初始化上传控件初始属性
        init:function(config){
            this.copyConfig(config);
            if (!this.initConfig()) {
                return false
            }
            this.html();
            this.render();
        },
        //生成html代码片段
        html:function(){
            if (!this.initConfig()) {
                return false
            }
            var config = this.config;
            var id = 'upload_' + config.module;
            // config.elem = '#'+id;
            config.elem = '[name=' + config.name + ']';
            var moduleDom = $('#module_' + config.module);
            moduleDom.html('');
            var uploadBtn = document.createElement('button');
            uploadBtn.className = 'layui-btn';
            uploadBtn.id = id;
            uploadBtn.name = config.name;
            uploadBtn.innerHTML = config.text;
            var uploadList = document.createElement("div");
            config.uploadShowList = '#uploadList' + id;
            uploadList.className = 'layui-upload-list';
            uploadList.id = 'uploadList' + id;
            var table = zefuUpload.createTableThead();
            uploadList.appendChild(table);
            tbody = document.createElement('tbody');
            table.appendChild(tbody);
            moduleDom[0].appendChild(uploadBtn);
            moduleDom[0].appendChild(uploadList);
            if(config.bindAction){
                var submitBtn = document.createElement('button');
                submitBtn.className = 'layui-btn';
                submitBtn.style.display  = 'none';
                submitBtn.id = uploadBtnName;
                moduleDom[0].appendChild(submitBtn);
            }
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
            if(!config.resId){

                return false;
            }
            if(!config.busType){

                return false;
            }

            if(navigator.userAgent.indexOf("MSIE")>0) {
                if(!config.auto && config.multiple){
                    layer.msg('IE浏览器只支持多文件自动上传模式', {icon: 5});
                    return false;
                }
            }
            return true;
        },
        bindActionToUpload:function(){
            var resIdObj = $("#" + zefuUpload.config.resId);
            if(resIdObj && resIdObj.val()){
                $('#'+ uploadBtnName).click();
            }else{
                layer.msg("未找到资源ID",{icon:5})
            }
        },
        //复制属性，后续可能有其他的一些特殊判断
        copyConfig:function(options){
            // 保存临时配置
            if(!this.tempConfig) this.tempConfig = {};
            $.extend(this.tempConfig,options);
            // 保存配置
            if(!this.config) this.config = {};
            $.extend(this.config,options);
        },
        //初始化配置信息
        initConfig:function(){
            if(!this.checkConfig()){return false}
            this.config.url = "/dfsmgr/file/fileUpload";
            this.config.choose = this.chooseFileFinish;
            this.config.done = this.uploadSuccess;
            this.config.error = this.uploadError;
            this.config.before = this.uploadBefore;
            this.config.allDone = this.uploadAllDone;
            if(this.config.uploadBindAction){
                uploadFunc = this.bindActionToUpload;
                $(this.config.uploadBindAction).off("click");
                $(this.config.uploadBindAction).on("click",uploadFunc);
            }
            if(this.config.auto){
                this.config.bindAction = null;
            }else{
                if(!this.config.uploadBindAction){
                    this.config.uploadBindAction = this.config.bindAction;
                }
                this.config.bindAction = "#" + uploadBtnName;
            }
            return true;
        },
        //选择文件
        chooseFileFinish:function(obj){
            var selecteFile = obj.pushFile();
            zefuUpload.flushFileObj();
            for(key in selecteFile){
                zefuUpload.fileObj.push(selecteFile[key]);
            }
            if(!zefuUpload.chooseFileFinishBefore()){
                layer.msg('请先删除已选择的文件！', {icon: 5});
                return false;
            }
            if(typeof(zefuUpload.tempConfig.choose) === 'function'){
                zefuUpload.tempConfig.choose.apply(zefuUpload,[obj]);
            }
            if(!zefuUpload.chooseFileFinishAfter(obj)){
                return false;
            }
        },

        chooseFileFinishBefore:function(){
            if(!this.config.multiple){
                var moduleDom = $(this.config.uploadShowList);
                if(moduleDom.find('tbody').find('tr').length >0)return false;
            }
            return true;
        },
        chooseFileFinishAfter:function(obj){
            var fileInput = $(this.config.elem).parent().find('input[name=file]');
            moduleDom = $(this.config.uploadShowList);
            var tbody;
            if(!(moduleDom.find("tbody").length>0)){
                var divList = moduleDom[0];
                var table = zefuUpload.createTableThead()
                divList.appendChild(table);
                tbody = document.createElement('tbody');
                table.appendChild(tbody);
            }else{
                tbody = moduleDom.find("tbody")[0];
            }
            if(navigator.userAgent.indexOf("MSIE")>0) {
                var selectFiles = fileInput.val();
                if(typeof(selectFiles) === 'string'){
                    var row = this.createFileRow(selectFiles.replace(/^.+?\\([^\\]+?)?$/gi,'$1'));
                    tbody.appendChild(row);
                   $(row).find('.layui-btn-danger').on('click',function(){
                       $(row).remove();
                       $(zefuUpload.config.elem).next().find("input[name=file]")[0].value = '';
                   });
                }
            }else{
                var files = this.files = obj.pushFile(); //将每次选择的文件追加到文件队列
                //读取本地文件
                obj.preview(function(index, file, result){
                    var row =  zefuUpload.createFileRow(file.name,index);
                    tbody.appendChild(row);
                    //删除
                    $(row).find('.layui-btn-danger').on('click',function(){
                        delete files[index]; //删除对应的文件
                        $(row).remove();
                        $(zefuUpload.config.elem).next()[0].value = '';
                    });
                });
            }

            return true;
        },
        uploadAllDone: function(obj){ //当文件全部被提交后，才触发
            if(typeof(zefuUpload.tempConfig.allDone) == 'function'){
                zefuUpload.config.tempConfig.allDone.apply(zefuUpload,[obj]);
            }
        },
        uploadSuccess:function(res, index, upload){
            var tr = $("#" + index);
            var delBtn = tr.find('.btn-delete');
            var fiId = res.list[0].fiId;
            tr.attr('id',fiId);
            var statusTd = tr.find('.btn-status');
            statusTd.removeClass();
            statusTd.addClass('layui-btn layui-btn-xs layui-btn-finish btn-status');
            statusTd.html('已上传');
            delBtn.off("click");
            delBtn.on("click", function () {
                zefuUpload.deleteServerFile(fiId);
            });
            var down_btn = document.createElement('button');
            down_btn.className = 'layui-btn layui-btn-xs btn-download';
            down_btn.innerHTML = '下载';
            down_btn.onclick = function(){
                zefuUpload.downloadFile(fiId);
            };
            delBtn.parent().append(down_btn);
            if(typeof(zefuUpload.tempConfig.done) == 'function'){
                zefuUpload.config.tempConfig.done.apply(zefuUpload,[obj]);
            }
        },
        uploadError:function(index, upload){
            // var tr = $("#" + index);
            // var statusTd = tr.find('.btn-status');
            // statusTd.removeClass();
            // statusTd.addClass('layui-btn layui-btn-xs layui-btn-danger btn-status');
            // statusTd.html('上传失败');

            if(typeof(zefuUpload.tempConfig.error) == 'function'){
                zefuUpload.config.tempConfig.error.apply(zefuUpload,[obj]);
            }
            // zefuUpload.init();
        },
        uploadBefore:function(){
            var resId = !$("#"+zefuUpload.config.resId).val()?'':$("#"+zefuUpload.config.resId).val()
            this.data = {
                "resId": resId,
                // "fbt":zefuUpload.config.busType
            }
            if(typeof(zefuUpload.tempConfig.before) == 'function'){
                zefuUpload.config.tempConfig.before.apply(zefuUpload,[obj]);
            }
        },
        //获取选择文件数据
        getFileObj:function(){
            return this.fileObj
        },
        flushFileObj:function(){
            this.fileObj = [];
        },
        createFileList:function(text){
            var div = document.createElement('div');
            div.className = 'layui-col-xs12 layui-col-md12';

            var liDiv = document.createElement('div');
            liDiv.className = 'grid-demo';
            liDiv.style.cssFloat = 'left';
            liDiv.innerText = text;

            var icon = document.createElement('i');
            icon.className = 'layui-icon layui-icon-close-fill';
            icon.style.cssFloat = 'right';
            icon.style.color = 'red';

            div.appendChild(liDiv);
            div.appendChild(icon);
            return div;
        },
        createFileRow:function(text,id,type){
            var tr = document.createElement('tr');
            if(id){
                tr.id = id;
            }
            var fileName_td = document.createElement('td');
            fileName_td.innerHTML = text
            var status_td = document.createElement('td');
            var status_btn = document.createElement('button')
            if(type=='uploaded'){
                status_btn.className = 'layui-btn layui-btn-xs layui-btn-finish btn-status';
                status_btn.innerHTML = '已上传';
            }else{
                status_btn.className = 'layui-btn layui-btn-xs layui-btn-normal btn-status';
                status_btn.innerHTML = '待上传';
            }
            status_td.appendChild(status_btn);
            var opt_td = document.createElement('td');
            var del_btn = document.createElement('button')
            del_btn.className = 'layui-btn layui-btn-xs layui-btn-danger btn-delete';
            del_btn.innerHTML = '删除';
            opt_td.appendChild(del_btn)
            if(type=='uploaded'){
                var down_btn = document.createElement('button');
                down_btn.className = 'layui-btn layui-btn-xs btn-download';
                down_btn.innerHTML = '下载';
                down_btn.onclick = function(){
                    zefuUpload.downloadFile(id);
                }
                opt_td.appendChild(down_btn);
            }
            tr.appendChild(fileName_td);
            tr.appendChild(status_td);
            tr.appendChild(opt_td);
            return tr;
        },
        createTableThead:function(){
            var table = document.createElement('table');
            table.className = 'layui-table';
            var thead = document.createElement('thead');
            $(thead).html("<tr><th>文件名</th><th>文件状态</th><th>操作</th></tr>")
            table.appendChild(thead);
            return table;
        },
        downloadFile:function(fiId){
            if(fiId){
                if (typeof(zefuUpload.iframe) == null || typeof(zefuUpload.iframe) == "undefined") {
                    var iframe = document.createElement("iframe");
                    zefuUpload.iframe = iframe;
                    document.body.appendChild(zefuUpload.iframe);
                }
                zefuUpload.iframe.style.display = "none";
                var src = "/dfsmgr/file/filesDownload?fid=" + fiId;
                zefuUpload.iframe.src = src
            }else{
                layui.msg("文件ID为空");
            }

        },
        deleteServerFile:function(fiId){
            if(fiId){
                common.fetchDelete("/dfsmgr/file/deleteById?id=" + fiId, function (res) {
                    if(res.success && res.object){
                        $("#"+fiId).remove();
                        layer.msg("删除成功!");
                    }
                })
            }
        },
        initFileList:function(){
            if(this.config.resId && $("#" + this.config.resId) && $("#" + this.config.resId).val()){
                common.fetchGet("/dfsmgr/file/getFileByResId?id=" + $("#" + this.config.resId).val(), function (res) {
                    if (res.success && res.list) {
                        moduleDom = $(zefuUpload.config.uploadShowList);
                        moduleDom.find("tbody").html('');
                        var tbody = moduleDom.find("tbody")[0];
                        for(var i=0; i < res.list.length;i++){
                            var row = zefuUpload.createFileRow(res.list[i].fiName,res.list[i].fiId,'uploaded');
                            tbody.appendChild(row);
                        }
                        $(tbody).find('.layui-btn-danger').on('click',function(e){
                            var fiId = $(e.target).parent().parent().attr("id");
                            zefuUpload.deleteServerFile(fiId);
                        });
                    }
                }, function() {
                    callback([])
                });
            }
        }
    };
    exports('zefuUpload', zefuUpload);
});
