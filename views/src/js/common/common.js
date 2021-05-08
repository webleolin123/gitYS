/**

 @Name：公共自定义方法
 @Author：gaoli

 */

layui.define(['layer', 'table', 'upload', 'element', 'eleTree', 'form'], function (exports) {

    var layer = layui.layer,
        table = layui.table,
        upload = layui.upload,
        element = layui.element,
        form = layui.form,
        tree = layui.eleTree,
        hint = layui.hint(),
        Common = function () {
            this.config = {};
        };
    var baseUrl;
    if (!window.location.origin) {
        baseUrl = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port : '') + '/';
    } else {
        baseUrl = window.location.origin + '/';
    }

    //跨域通信
    Common.prototype.messageListener = function (successBack) {
        //单窗口 跨域通信
        if (!!window.addEventListener) {
            window.addEventListener('message', function (event) {
                if (event && event.data) {
                    //设置页面上的主题颜色
                    window.document.documentElement.setAttribute("primaryColor", event.data);
                    if (window.top) {
                        window.top.document.documentElement.setAttribute("primaryColor", event.data);
                    }
                }

            }, false);
        } else {
            window.attachEvent('message', function (event) {
                if (event && event.data) {
                    //设置页面上的主题颜色
                    window.document.documentElement.setAttribute("primaryColor", event.data);
                    if (window.top) {
                        window.top.document.documentElement.setAttribute("primaryColor", event.data);
                    }
                }

            }, false);
        }
    };

    //按钮权限限制
    Common.prototype.buttonLimit = function (smid, successBack) {


        if (!smid) {
            smid = common.getCurrentMenuId();
        }
        var pageBtnList = [];
        var authBtnList = [];

        //获取页面上的所有按钮
        $.map($('body').find('[permission-btn]'), function (item, index) {
            if(common.indexOf(pageBtnList,$(item).attr('permission-btn'))<0){
            // if (pageBtnList.indexOf($(item).attr('permission-btn')) < 0) {
                pageBtnList.push($(item).attr('permission-btn'));
            }
        });

        if (!!$('body').find('.buttonLimitArea')[0]) {
            if ($('body').find('.buttonLimitArea').text()) {
                authBtnList = JSON.parse($('body').find('.buttonLimitArea').text());
            }
            var result = [];
            for (var i = 0; i < pageBtnList.length; i++) {
                var obj = pageBtnList[i];
                var isExist = false;
                for (var j = 0; j < authBtnList.length; j++) {
                    if (obj === authBtnList[j]) {
                        isExist = true;
                        break;
                    }
                }
                if (!isExist) {
                    result.push(obj);
                }
            }


            if (result && result.length > 0) {
                $.map(result, function (item, index) {
                    if ($.trim(item)) {
                        $('[permission-btn=' + $.trim(item) + ']').remove();
                    }
                });
            }
        } else {

            this.fetchGet('sysmgr/menu/selectAuthButton?smId=' + smid, function (res) {
                var result = [];
                var data = res.list || [];

                //获取出所有具有权限的按钮 smbCode 值
                $.map(data, function (item, index) {
                    authBtnList.push(item.smbCode);

                    //table defaultToolbar 权限设置
                    if (item.smbCode === 'filter') {
                        $('[lay-event=LAYTABLE_COLS]').remove();
                    } else if (item.smbCode === 'print') {
                        $('[lay-event=LAYTABLE_PRINT]').remove();
                    } else if (item.smbCode === 'exports') {
                        $('[lay-event=LAYTABLE_EXPORT]').remove();
                    }
                });
                $('body').append('<div class="buttonLimitArea" style="display: none">' + JSON.stringify(authBtnList) + '</div>');

                //数据匹配出禁用的按钮

                for (var i = 0; i < pageBtnList.length; i++) {
                    var obj = pageBtnList[i];
                    var isExist = false;
                    for (var j = 0; j < authBtnList.length; j++) {
                        if (obj === authBtnList[j]) {
                            isExist = true;
                            break;
                        }
                    }
                    if (!isExist) {
                        result.push(obj);
                    }
                }


                if (result.length > 0) {

                    $.map(result, function (item, index) {
                        if ($.trim(item)) {
                            $('[permission-btn=' + $.trim(item) + ']').remove();
                        }
                    });
                }
                if (successBack) {
                    successBack(res)
                }
            }, function () {
                $.map(pageBtnList, function (item, index) {
                    $('[permission-btn=' + item + ']').remove();
                });
                return [];
            }, false);
        }


    };

    /**
     * [封装的ajax请求]
     * @param  {String}     url        [请求url]
     * @param  {Function}   succCallback     [成功回调函数]
     * @param  {Function}   failCallback [失败回调函数]
     * @param  {Object}     param        [参数]
     * @param  {string}     requestType  [请求类型：post，get，delete，put]
     * @param  {bool}       syncFlag     [同步还是异步]
     * @param  {bool}       showError    [是否展示默认的处理错误]
     * @return
     */
    Common.prototype.requestByAjax = function (url, succCallback, failCallback, requestType, param, syncFlag, showError, contentType, timeSet) {
        var deferred = $.Deferred();
        //不输入异步参数时异步
        if (syncFlag == undefined) {
            syncFlag = true;
        }
        if (syncFlag == 'false') {
            syncFlag = false;
        }
        if (showError == undefined) {
            showError = true;
        }
        if (showError == false) {
        }

        var _url;
        var str = location.href; //获取本页url地址
        var arr = str.split("/");


        _url = location.protocol + "//" + arr[2] + '/' + url;
        if (_url.indexOf('?') > -1) {
            _url = _url + '&' + new Date().getTime()
        } else {
            _url = _url + '?' + new Date().getTime()
        }

        var data = "";
        if (!!param) {
            data = JSON.stringify(param);
        }

        if (!!requestType && requestType.toLowerCase() == "get") {
            data = "";
        }
        $.ajax({
            type: requestType || "POST",
            url: _url,
            dataType: "json",
            data: data,
            timeout: (timeSet ? timeSet : 6 * 600000),
            cache: false,
            contentType: contentType ? contentType : "application/json; charset=utf-8",
            xhrFields: {
                withCredentials: true
            },
            //crossDomain: true,  IE8下跨域请求属性出错
            async: !!syncFlag,
            success: function (data) {
                deferred.resolve(data);
                //判断当前状态 403 表示无登入信息，提醒用户重新登入，并跳回登入页
                if (data && data.resultMessage && data.resultCode === '403') {
                    layer.msg('请重新登入', {icon: 5, time: 3000}, function () {
                        //跳回登入页面
                        // window.top
                        if (window.top) {
                            window.top.location.replace(common.getLocationOrigin('top') + '/login.html');
                        } else {
                            location.replace(common.getLocationOrigin() + '/login.html');
                        }
                    });
                }

                if (!!succCallback) {
                    succCallback(data);
                }
            },

            error: function (error) {
                //因为统一都是用json处理，如果返回的是字符串，则会直接进入error
                try {
                    deferred.reject(JSON.parse(error.responseText));
                    if (!!failCallback) failCallback(JSON.parse(error.responseText));
                } catch (e) {
                    deferred.reject(error.responseText);
                    if (!!failCallback) failCallback(error.responseText);
                }
            }
        });
        return deferred.promise();
    };

    Common.prototype.publicRequest = function (url, params, type, deferred, succCallback, failCallback, syncFlag, contentType) {
        this.requestByAjax(url, function (data) {
            if (!!succCallback) succCallback(data);
            deferred.resolve(data);
        }, function (data) {
            if (!!failCallback) failCallback(data);
            deferred.reject(data);
        }, (type || "POST"), params, syncFlag, contentType);
    };
    Common.prototype.fetchPost = function (url, params, succCallback, failCallback, syncFlag) {
        var deferred = $.Deferred();
        this.publicRequest(url, params, "Post", deferred, succCallback, failCallback, syncFlag);
        return deferred.promise();
    };
    Common.prototype.fetchGet = function (url, succCallback, failCallback, syncFlag) {
        var deferred = $.Deferred();
        this.publicRequest(url, null, "Get", deferred, succCallback, failCallback, syncFlag);
        return deferred.promise();
    };
    Common.prototype.fetchDelete = function (url, succCallback, failCallback, syncFlag) {
        var deferred = $.Deferred();
        this.publicRequest(url, null, "Delete", deferred, succCallback, failCallback, syncFlag);
        return deferred.promise();
    };
    Common.prototype.fetchPut = function (url, params, succCallback, failCallback, syncFlag) {
        var deferred = $.Deferred();
        this.publicRequest(url, params, "Put", deferred, succCallback, failCallback, syncFlag);
        return deferred.promise();
    };
    Common.prototype.fetch = function (url, type, params, succCallback, failCallback, syncFlag, contentType) {
        var deferred = $.Deferred();
        this.publicRequest(url, params, type, deferred, succCallback, failCallback, syncFlag, contentType);
        return deferred.promise();
    };

    //toggle 展开收起 相关区域
    Common.prototype.toggleArea = function (btn, area, text1, text2) {
        if (!btn || !area) {
            return
        }

        btn.off().on('click', function () {
            if (area.css('display') === 'inline' || area.css('display') === 'inherit' || area.css('display') === 'initial' || area.css('display') === 'block' || area.css('display') === 'inline-block') {
                btn.find('i').removeClass('fa-angle-down').addClass('fa-angle-up');
                btn.find('span').text(text1 ? text1 : '展开');
                area.css('display', 'none');
            } else {
                btn.find('i').removeClass('fa-angle-up').addClass('fa-angle-down');
                btn.find('span').text(text2 ? text2 : '收起');
                area.css('display', 'block');
            }
            // area.toggle();
        });
    };

    /**
     * [分装表格初始化配置]
     * @param  {Object}     param        [配置项]
     * @return
     */
    Common.prototype.tableInitParams = function (obj) {
        var defaultParams = {
            elem: '#table1',
            height: 'full-170',
            url: '',
            method: 'post',
            // where:{id:id,token:'sass'},//额外参数设置
            contentType: 'application/json',
            loading: true,
            parseData: function (res) { //res 即为原始返回的数据
                if (res.page) {
                    return {
                        "code": 0, //解析接口状态
                        "msg": res.resultMessage, //解析提示文本
                        "count": res.page.total, //解析数据长度
                        "data": res.page.list //解析数据列表
                    };
                } else {
                    return {
                        "code": 0,
                        "msg": '',
                        "count": res.list ? res.list.length : 0,
                        "data": res.list
                    };
                }
            },
            /*response:{
                statusName: 'code' //规定数据状态的字段名称，默认：code
                ,statusCode: 0 //规定成功的状态码，默认：0
                ,msgName: 'msg' //规定状态信息的字段名称，默认：msg
                ,countName: 'count' //规定数据总数的字段名称，默认：count
                ,dataName: 'data' //规定数据列表的字段名称，默认：data
            },*/
            request: {
                pageName: 'pageNum',//页码的参数名称，默认：page
                limitName: 'pageSize' //每页数据量的参数名，默认：limit
            },
            toolbar: '',
            // defaultToolbar: ['filter', 'print', 'exports'],
            defaultToolbar: ['filter'],
            cols: [],
            page: true,
            done: function (res) {

            }
        };
        return $.extend({}, defaultParams, obj);
    };

    Common.prototype.toDateString = function (time, format) {
        var that = this
            , date = new Date(time || new Date())
            , ymd = [
            that.digit(date.getFullYear(), 4)
            , that.digit(date.getMonth() + 1)
            , that.digit(date.getDate())
        ]
            , hms = [
            that.digit(date.getHours())
            , that.digit(date.getMinutes())
            , that.digit(date.getSeconds())
        ];

        format = format || 'yyyy-MM-dd HH:mm:ss';

        return format.replace(/yyyy/g, ymd[0])
            .replace(/MM/g, ymd[1])
            .replace(/dd/g, ymd[2])
            .replace(/HH/g, hms[0])
            .replace(/mm/g, hms[1])
            .replace(/ss/g, hms[2]);
    };

    /**
     * 获取对应名称的cookie
     * @param name cookie的名称
     * @returns {null} 不存在时，返回null
     */
    Common.prototype.getCookie = function (name) {
        var arr;
        var reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
        if (arr = document.cookie.match(reg))
            return unescape(arr[2]);
        else
            return null
    };
    Common.prototype.getUserInfo = function () {
        return JSON.parse(common.getCookie('userInfo'));
    };

    Common.prototype.setCookie = function (name, value, seconds) {

        if (seconds == undefined) {
            seconds = 60 * 60 * 8 * 1000;
        }
        var expires = "";
        if (seconds != 0) { //设置cookie生存时间
            var date = new Date();
            date.setTime(date.getTime() + (seconds));
            expires = "; expires=" + date.toGMTString();
        }
        document.cookie = name + "=" + escape(value) + expires + "; path=/"; //转码并赋值
    };
    Common.prototype.clearCookie = function (name) {
        common.setCookie(name, "", -1);
    };

    //select 下拉框数据导入
    Common.prototype.selectDataSet = function (obj) {
        var defaultParams = {
            elem: '',
            url: '',
            method: 'get',
            responseList: 'list',
            optionText: '',
            optionValue: '',
            loadData: false,
            isSearch: false,
            loadSuccess: function () {
            },
            where: null,
            form: '',
            success: function () {

            },
            fail: function () {

            },
            changeInit: false,
            changeParams: {
                elem: '',
                url: '',
                method: 'get',
                responseList: 'list',
                optionText: '',
                optionValue: '',
                changeInit: false,
                changeParams: {
                    elem: '',
                    url: '',
                    method: 'get',
                    responseList: 'list',
                    optionText: '',
                    optionValue: ''
                }
            }
        };

        var param = $.extend({}, defaultParams, obj);

        if (param.loadData) {
            var data = param.loadData;
            //导入表格数据
            if (!param.isSearch) {
                var options = '<option value="">请选择</option>';
            } else {
                var options = '<option value="">直接选择或搜索选择</option>';
            }

            if (data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    options += '<option value="' + data[i][param.optionValue] + '">' + data[i][param.optionText] + '</option>';
                }
            }
            param.elem.html(options);

            param.loadSuccess(data);
        } else {
            common.fetch(param.url, param.method, param.where, function (res) {
                //导入表格数据
                if (!param.isSearch) {
                    var options = '<option value="">请选择</option>';
                } else {
                    var options = '<option value="">直接选择或搜索选择</option>';
                }
                if (res && res[param.responseList]) {
                    for (var i = 0; i < res[param.responseList].length; i++) {
                        options += '<option value="' + res[param.responseList][i][param.optionValue] + '">' + res[param.responseList][i][param.optionText] + '</option>';
                    }
                }
                param.elem.html(options);

                param.success(res);

                param.elem.off().on('change', function () {
                    if (!!param.changeInit) {
                        var param1 = param.changeParams;

                        common.fetch(param1.url, param1.method, param1.where, function (res) {
                            //导入表格数据
                            var options = '<option value="">请选择</option>';
                            if (res && res[param.responseList]) {
                                for (var i = 0; i < res[param1.responseList].length; i++) {
                                    options += '<option value="' + res[param1.responseList][i][param1.optionValue] + '">' + res[param1.responseList][i][param1.optionText] + '</option>';
                                }
                            }
                            param1.elem.html(options);

                            param1.success(res);

                        }, param.fail);

                    }
                });

            }, param.fail, false);
        }


    };

    //数字前置补零
    Common.prototype.digit = function (num, length) {
        var str = '';
        num = String(num);
        length = length || 2;
        for (var i = num.length; i < length; i++) {
            str += '0';
        }
        return num < Math.pow(10, length) ? str + (num | 0) : num;
    };
    //时间戳转化
    Common.prototype.dateFormat = function (time, format) {
        var that = this
            , date = new Date(time || new Date())
            , ymd = [
            common.digit(date.getFullYear(), 4)
            , common.digit(date.getMonth() + 1)
            , common.digit(date.getDate())
        ]
            , hms = [
            common.digit(date.getHours())
            , common.digit(date.getMinutes())
            , common.digit(date.getSeconds())
        ];

        format = format || 'yyyy-MM-dd HH:mm:ss';

        return format.replace(/yyyy/g, ymd[0])
            .replace(/MM/g, ymd[1])
            .replace(/dd/g, ymd[2])
            .replace(/HH/g, hms[0])
            .replace(/mm/g, hms[1])
            .replace(/ss/g, hms[2]);
    };
    //时间格式转换 2019-11-03 转 2019年-11月-03日
    Common.prototype.dateCNFormat = function (date) {
        date=date.split('-');
        return date[0]+'年'+date[1]+'月'+date[2]+'日';
    };
    //时间戳转换年月日格式 比如 1574328093 转 2019年11月21日
    Common.prototype.timestampToTime = function (timestamp,type) {
        var str;
        if(typeof timestamp!=='string'){
            str=timestamp+'';
        }
        var date = new Date(str.length==13?timestamp:(timestamp * 1000));//时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var Y = date.getFullYear();
        var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1);
        var D = (date.getDate() < 10 ? '0'+date.getDate() : date.getDate());
        var h = (date.getHours() < 10 ? '0'+date.getHours() : date.getHours());
        var m = (date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes());
        var s = (date.getSeconds() < 10 ? '0'+date.getSeconds() : date.getSeconds());
        if(type=='CN'){
            return Y+'年'+M+'月'+D+'日';
        }
        else if(type=='datetime'){
            return Y+'-'+M+'-'+D+' '+h+':'+m+':'+s;
        }
        else{
            return Y+'-'+M+'-'+D;
        }
    };
    //字符串金融格式化 (调用方法)
    Common.prototype.outputmoney = function (number) {
        if (isNaN(number) || number == "") return "";
        number = Math.round(number * 100) / 100;
        if (number < 0)
            return '-' + this.outputdollars(Math.floor(Math.abs(number) - 0) + '') + this.outputcents(Math.abs(number) - 0);
        else
            return this.outputdollars(Math.floor(number - 0) + '') + this.outputcents(number - 0);

    };
    //格式化金额(转化方法)
    Common.prototype.outputdollars = function (number) {
        if (number.length <= 3)
            return (number == '' ? '0' : number);
        else {
            var mod = number.length % 3;
            var output = (mod == 0 ? '' : (number.substring(0, mod)));
            for (i = 0; i < Math.floor(number.length / 3); i++) {
                if ((mod == 0) && (i == 0))
                    output += number.substring(mod + 3 * i, mod + 3 * i + 3);
                else
                    output += ',' + number.substring(mod + 3 * i, mod + 3 * i + 3);
            }
            return (output);
        }
    };
    Common.prototype.outputcents = function (amount) {
        amount = Math.round(((amount) - Math.floor(amount)) * 100);
        return (amount < 10 ? '.0' + amount : '.' + amount);
    };
    //数字转化金额格式 (四舍五入)
    Common.prototype.unitConvert = function (num, type) {//num为string类型
        // type=type||4; //0:元 1：万元 2：亿元 3：万亿
        var moneyUnits = ["元", "万元", "亿元", "万亿"];
        var dividend = 10000;
        var curentNum = num;
        var m = {num: 0, unit: ""};
        if (this.strNumSize(curentNum) < 5) {
            m.num = new Number(curentNum).toFixed(2);
            m.unit = moneyUnits[0];
            return m;
        }
        //转换数字
        var curentUnit = moneyUnits[0];
        //转换单位
        if (!type) {
            for (var i = 0; i < 4; i++) {
                curentUnit = moneyUnits[i];
                if (this.strNumSize(curentNum) < 5) {
                    break;
                }
                curentNum = curentNum / dividend;
            }
        } else {
            for (var i = 0; i < type; i++) {
                curentUnit = moneyUnits[type];
                if (this.strNumSize(curentNum) < 5) {
                    break;
                }
                curentNum = curentNum / dividend;
            }
        }

        m.num = curentNum.toFixed(2);
        m.unit = curentUnit;
        return m;
    };
    //数字转化金额格式 (非四舍五入)
    Common.prototype.unitInConvert = function (num, type) {
        type = type || 3;//0:元 1：万元 2：亿元 3：万亿
        var moneyUnits = ["元", "万元", "亿元", "万亿"];
        var dividend = 10000;
        var curentNum = num;
        //转换数字
        var curentUnit = moneyUnits[0];
        //转换单位

        for (var i = 0; i <= type; i++) {
            curentUnit = moneyUnits[i];
            if (this.strNumSize(curentNum) < 5) {
                break;
            }
            curentNum = curentNum / dividend;
        }
        var m = {num: 0, unit: ""};
        m.num = curentNum.toString().match(/^\d+(?:\.\d{0,2})?/);//不进行四舍五入
        m.unit = curentUnit;
        return m;
    };
    //附带函数
    Common.prototype.strNumSize = function (tempNum) {
        var stringNum = tempNum.toString();
        var index = stringNum.indexOf(".");
        var newNum = stringNum;
        if (index != -1) {
            newNum = stringNum.substring(0, index);
        }
        return newNum.length;
    };
    /**
     * [树组件初始化配置 ]  eleTree
     * @param  {Object}     param        [配置项]
     * @url  https://fly.layui.com/extend/eleTree/
     * @return
     */
    Common.prototype.treeInitParams = function (obj) {
        var defaultParams = {

            /*---------------------基础配置------------------------*/

            elem: '',                   //容器的选择器或 DOM
            data: [],                   //直接赋值的数据
            showCheckbox: false,        // 节点是否可被选择
            emptText: "暂无数据",        // 内容为空的时候展示的文本
            renderAfterExpand: true,    // 是否在第一次展开某个树节点后才渲染其子节点
            highlightCurrent: true,    // 是否高亮当前选中节点，默认值是 false。
            defaultExpandAll: false,    // 是否默认展开所有节点
            expandOnClickNode: true,    // 是否在点击节点的时候展开或者收缩节点， 默认值为 true，如果为 false，则只有点箭头图标的时候才会展开或者收缩节点。
            checkOnClickNode: false,    // 是否在点击节点的时候选中节点，默认值为 false，即只有在点击复选框时才会选中节点。
            defaultExpandedKeys: [],    // 默认展开的节点的 key 的数组
            autoExpandParent: true,     // 展开子节点的时候是否自动展开父节点
            defaultCheckedKeys: [],     // 默认勾选的节点的 key 的数组
            indent: 16,                 // 相邻级节点间的水平缩进，单位为像素
            draggable: false,           // 是否开启拖拽节点功能
            contextmenuList: [],        // 启用右键菜单，支持的操作有："copy","add","edit","remove"
            searchNodeMethod: null,     // 对树节点进行筛选时执行的方法，返回 true 表示这个节点可以显示，返回 false 则表示这个节点会被隐藏

            /*--------------------异步请求参数--------------------------*/
            method: "get",              // 接口http请求类型，默认：get
            url: "",                    // 异步数据接口
            contentType: "",            // 发送到服务端的内容编码类型
            done: null,                 // 数据请求完成的回调函数，只有异步请求才会有
            response: {                 // 对于后台数据重新定义名字
                statusName: "success",
                statusCode: "0",
                dataName: "list"
            },
            request: {                  // 对后台返回的数据格式重新定义
                name: "name",
                key: "id",
                children: "children",
                checked: "checked",
                disabled: "disabled",
                isLeaf: "isLeaf",
                extendAttr: "extendAttr"
            },
            lazy: false,  // 是否懒加载子节点，需与 load 方法结合使用
            load: function (data, callback) {

            }
        };

        return $.extend({}, defaultParams, obj)
    };

    /**
     * [分装上传组件初始化配置 ]
     * @param  {Object}     param        [配置项]
     * @return
     */

    Common.prototype.uploaderInitParam = function (obj) {
        var defaultParams = {
            elem: '',//绑定元素
            url: '', //上传接口
            before: function (obj) { //obj参数包含的信息，跟 choose回调完全一致，可参见上文。
                // layer.load(); //上传loading
            },
            done: function (res, index, upload) {
                //上传完毕回调
            },
            error: function () {
                //请求异常回调
            },
            accept: 'file', //允许上传的文件类型
            exts: '', //允许上传的文件后缀
            data: {}     //请求上传接口的额外参数
        };

        return $.extend({}, defaultParams, obj);
    };

    //加载弹出层
    Common.prototype.layerLoader = function () {
        return layer.load(2, {shade: [0.8, '#393D49']});
    };

    //模块loader
    Common.prototype.moduleLoader = function (area) {
        //area 载入位置
    };

    //数组转树形结构数据 （原理即为通过设置id为key值，再通过pid去找这个key是否一样，一样则为这数据的子级数据）
    Common.prototype.arrayToTreeJson = function (treeArray, id, pid, children) {
        var r = [];
        var tmpMap = {};
        for (var i = 0, l = treeArray.length; i < l; i++) {
            // 以每条数据的id作为obj的key值，数据作为value值存入到一个临时对象里面
            tmpMap[treeArray[i][id]] = treeArray[i];
        }
        // console.log('tmpMap',tmpMap)
        for (i = 0, l = treeArray.length; i < l; i++) {
            var key = tmpMap[treeArray[i][pid]];
            //   console.log('key',key)
            //循环每一条数据的pid，假如这个临时对象有这个key值，就代表这个key对应的数据有children，需要Push进去
            //如果这一项数据属于哪个数据的子级
            if (key) {
                // 如果这个数据没有children
                if (!key[children]) {
                    key[children] = [];
                    key[children].push(treeArray[i]);

                    // 如果这个数据有children
                } else {
                    key[children].push(treeArray[i]);
                }
            } else {
                //如果没有这个Key值，就代表找不到属于哪个数据，那就代表没有父级,直接放在最外层
                r.push(treeArray[i]);
            }
        }
        // console.log(JSON.stringify(r));
        return r
    };
    //树结构转线性表结构
    Common.prototype.jsonToArray = function (treeData, children) {
        var r = [];
        if (!children){
            children = "children";
        }
        if (treeData instanceof Array) {
            for (var i = 0, l = treeData.length; i < l; i++) {
                r.push(treeData[i]); // 取每项数据放入一个新数组
                if (treeData[i][children] instanceof Array && treeData[i][children].length > 0)
                // 若存在children则递归调用，把数据拼接到新数组中，并且删除该children
                    r = r.concat(this.jsonToArray(treeData[i][children]));
                delete treeData[i][children]
            }
        }
        return r;
    };
    // 切割部门
    Common.prototype.deptSplit = function (data) { 
        var rowDataArray = data.split('-')
        if(rowDataArray.length>0){
            return rowDataArray[rowDataArray.length-1]
        }else{
            return "-"
        }
     }
    //(字符串去除所有空格)（格式化json转字符串json）
    Common.prototype.jsonString = function (str) {
        return str.replace(/\s+/g, "");
    };
    //(字符串json格式化)
    Common.prototype.jsonFormat = function (text_value) {//传入要格式化的字符串json
        if (text_value == "" || !text_value) {
            return false;
        } else {
            var res = "";
            if (text_value && typeof (text_value) === 'object') {
                for (var i = 0, j = 0, k = 0, ii, ele; i < text_value.length; i++) {//k:缩进，j:""个数
                    ele = text_value.charAt(i);
                    if (j % 2 == 0 && ele == "}") {
                        k--;
                        for (ii = 0; ii < k; ii++) ele = "    " + ele;
                        ele = "\n" + ele;
                    } else if (j % 2 == 0 && ele == "{") {
                        ele += "\n";
                        k++;
                        for (ii = 0; ii < k; ii++) ele += "    ";
                    } else if (j % 2 == 0 && ele == ",") {
                        ele += "\n";
                        for (ii = 0; ii < k; ii++) ele += "    ";
                    } else if (ele == "\"") j++;
                    res += ele;
                }
                return res
            }
        }

    };

    //生成uuid 码
    Common.prototype.uuid = function (head, number) {

        var len = 24, radix = 24;

        if (!!number) {
            len = number;
            radix = number;
        }

        var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
        var uuid = [],
            i;
        radix = radix || chars.length;

        if (len) {
            // Compact form
            for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
        } else {
            // rfc4122, version 4 form
            var r;

            // rfc4122 requires these characters
            uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
            uuid[14] = '4';

            // Fill in random data.  At i==19 set the high bits of clock sequence as
            // per rfc4122, sec. 4.1.5
            for (i = 0; i < 36; i++) {
                if (!uuid[i]) {
                    r = 0 | Math.random() * 16;
                    uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
                }
            }
        }
        if (head) {
            return head + uuid.join('')
        } else {
            return uuid.join('');
        }
    };

    //随机数生成三位数的英文码
    Common.prototype.randomCode = function (number) {
        //创建26个字母数组
        var arr = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
        var idvalue = '';
        var n = number || 3;//这个值可以改变的，对应的生成多少个字母，根据自己需求所改
        for (var i = 0; i < n; i++) {
            idvalue += arr[Math.floor(Math.random() * 26)];
        }
        return idvalue;
    };

    //水印设置
    Common.prototype.waterMark = function (settings) {
        //ie8 去除水印
        var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
        var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE<11浏览器
        if (isIE) {
            var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
            reIE.test(userAgent);
            var fIEVersion = parseFloat(RegExp["$1"]);
            if (fIEVersion == 8) {
                return false;
            }

        }

        //默认设置
        var defaultSettings = {
            watermark_txt: "",
            watermark_x: 20,//水印起始位置x轴坐标
            watermark_y: 20,//水印起始位置Y轴坐标
            watermark_rows: 20,//水印行数
            watermark_cols: 20,//水印列数
            watermark_x_space: 100,//水印x轴间隔
            watermark_y_space: 50,//水印y轴间隔
            // watermark_color:'#aaa',//水印字体颜色
            watermark_color: '#d6d6d6',//水印字体颜色
            watermark_alpha: 0.4,//水印透明度
            watermark_fontsize: '14px',//水印字体大小
            watermark_font: '微软雅黑',//水印字体
            watermark_width: 210,//水印宽度
            watermark_height: 80,//水印长度
            watermark_angle: 15//水印倾斜度数
        };
        //采用配置项替换默认值，作用类似jquery.extend
        if (arguments.length === 1 && typeof arguments[0] === "object") {
            var src = arguments[0] || {};
            for (key in src) {
                if (src[key] && defaultSettings[key] && src[key] === defaultSettings[key])
                    continue;
                else if (src[key])
                    defaultSettings[key] = src[key];
            }
        }

        var oTemp = document.createDocumentFragment();

        //获取页面最大宽度
        var page_width = Math.max(document.body.scrollWidth, document.body.clientWidth);
        var cutWidth = page_width * 0.0150;
        page_width = page_width - cutWidth;
        //获取页面最大高度
        var page_height = Math.max(document.body.scrollHeight, document.body.clientHeight) + 2000;
        // var page_height = document.body.scrollHeight+document.body.scrollTop;

        //创建水印外壳div
        var otdiv = document.getElementById("otdivid");

        if (!otdiv) {
            otdiv = document.createElement('div');
            otdiv.id = "otdivid";
            otdiv.style.pointerEvents = "none";
            document.body.appendChild(otdiv);
        }

        //如果将水印列数设置为0，或水印列数设置过大，超过页面最大宽度，则重新计算水印列数和水印x轴间隔
        if (defaultSettings.watermark_cols == 0 || (parseInt(defaultSettings.watermark_x + defaultSettings.watermark_width * defaultSettings.watermark_cols + defaultSettings.watermark_x_space * (defaultSettings.watermark_cols - 1)) > page_width)) {
            defaultSettings.watermark_cols = parseInt((page_width - defaultSettings.watermark_x + defaultSettings.watermark_x_space) / (defaultSettings.watermark_width + defaultSettings.watermark_x_space));
            defaultSettings.watermark_x_space = parseInt((page_width - defaultSettings.watermark_x - defaultSettings.watermark_width * defaultSettings.watermark_cols) / (defaultSettings.watermark_cols - 1));
        }
        //如果将水印行数设置为0，或水印行数设置过大，超过页面最大长度，则重新计算水印行数和水印y轴间隔
        if (defaultSettings.watermark_rows == 0 || (parseInt(defaultSettings.watermark_y + defaultSettings.watermark_height * defaultSettings.watermark_rows + defaultSettings.watermark_y_space * (defaultSettings.watermark_rows - 1)) > page_height)) {
            defaultSettings.watermark_rows = parseInt((defaultSettings.watermark_y_space + page_height - defaultSettings.watermark_y) / (defaultSettings.watermark_height + defaultSettings.watermark_y_space));
            defaultSettings.watermark_y_space = parseInt(((page_height - defaultSettings.watermark_y) - defaultSettings.watermark_height * defaultSettings.watermark_rows) / (defaultSettings.watermark_rows - 1));
        }
        var x;
        var y;
        for (var i = 0; i < defaultSettings.watermark_rows; i++) {
            y = defaultSettings.watermark_y + (defaultSettings.watermark_y_space + defaultSettings.watermark_height) * i;
            for (var j = 0; j < defaultSettings.watermark_cols; j++) {
                x = defaultSettings.watermark_x + (defaultSettings.watermark_width + defaultSettings.watermark_x_space) * j;

                var mask_div = document.createElement('div');
                mask_div.id = 'mask_div' + i + j;
                mask_div.className = 'mask_div';
                mask_div.appendChild(document.createTextNode(defaultSettings.watermark_txt));
                //设置水印div倾斜显示
                mask_div.style.webkitTransform = "rotate(-" + defaultSettings.watermark_angle + "deg)";
                mask_div.style.MozTransform = "rotate(-" + defaultSettings.watermark_angle + "deg)";
                mask_div.style.msTransform = "rotate(-" + defaultSettings.watermark_angle + "deg)";
                mask_div.style.OTransform = "rotate(-" + defaultSettings.watermark_angle + "deg)";
                mask_div.style.transform = "rotate(-" + defaultSettings.watermark_angle + "deg)";
                mask_div.style.visibility = "";
                mask_div.style.position = "absolute";
                mask_div.style.left = x + 'px';
                mask_div.style.top = y + 'px';
                mask_div.style.overflow = "hidden";
                mask_div.style.zIndex = "1";
                mask_div.style.pointerEvents = 'none';//pointer-events:none  让水印不遮挡页面的点击事件
                //mask_div.style.border="solid #eee 1px";
                mask_div.style.opacity = defaultSettings.watermark_alpha;
                mask_div.style.fontSize = defaultSettings.watermark_fontsize;
                mask_div.style.fontFamily = defaultSettings.watermark_font;
                mask_div.style.color = defaultSettings.watermark_color;
                mask_div.style.textAlign = "center";
                mask_div.style.width = defaultSettings.watermark_width + 'px';
                mask_div.style.height = defaultSettings.watermark_height + 'px';
                mask_div.style.display = "block";
                oTemp.appendChild(mask_div);

                //设置水印相关属性end
                //附加到文档碎片中
                otdiv.appendChild(mask_div);
                otdiv.style.cursor = "default";

            }
        }
        // document.body.appendChild(oTemp);

    };

    //排空处理
    Common.prototype.trimData = function (data, type) {
        if (type === "array") {
            var newArr = [];
            $.map(data, function (item, index) {
                if (item != null && item != undefined) {
                    newArr.push(item);
                }
            });
            return newArr
        } else if (type === 'string') {
            return $.trim(data);
        }
    };

    //全部替换
    Common.prototype.replaceAll = function (data, f, e) {
        var reg = new RegExp(f, "g"); //创建正则RegExp对象
        return data.replace(reg, e);
    };

    //公用版本号设置
    Common.prototype.versionNumber = function () {

        var date = new Date();

        // return JSON.stringify(date.getFullYear()) + JSON.stringify((date.getMonth() + 1)) + JSON.stringify(date.getDate());
        return JSON.stringify(date.getFullYear());
    };

    //column 操作缩放
    Common.prototype.columnSide = function () {
        $('.columnSide').each(function () {
            var item = $(this);

            item.off().on('click', function () {
                //获取操作的父级节点
                var operDom = item.closest('[class^=layui-col-]');

                //获取操作节点的下一节点
                var nextDom = operDom.next();

                //获取操作节点的列值
                var currentCol = operDom.attr('class').split(' ')[0].substring(12);

                //获取操作节点的下一节点 列值
                var nextDomCol = nextDom.attr('class').split(' ')[0].substring(12);

                //获取影响节点的padding-left 值
                var nextDomPaddingLeft = nextDom.css('padding-left');

                if (item.is('.openSide')) {
                    /**
                     * 关闭操作
                     * */
                    operDom.removeClass('slideColumn');

                    nextDom.css('padding-left', (parseInt(nextDomPaddingLeft.replace('px', '')) - 50) + 'px');

                    operDom.find('.fa-toggle-right').removeClass('fa-toggle-right').addClass('fa-toggle-left');

                    //节点列值替换
                    nextDom.attr('class', 'layui-col-xs' + (parseInt(nextDomCol) - parseInt(currentCol)));

                    common.resize();

                    item.removeClass('openSide');
                } else {
                    /**
                     * 开启操作
                     * */

                    //节点列值替换
                    nextDom.attr('class', 'layui-col-xs' + (parseInt(nextDomCol) + parseInt(currentCol)));

                    //当前节点修改
                    operDom.addClass('slideColumn');
                    operDom.find('.fa-toggle-left').removeClass('fa-toggle-left').addClass('fa-toggle-right');

                    nextDom.css('padding-left', (parseInt(nextDomPaddingLeft.replace('px', '')) + 50) + 'px');
                    common.resize();
                    item.addClass('openSide');

                }

            });

        })
    };
    Common.prototype.columnToggle = function () { 
        $('.columnToggle').each(function () {
            var item = $(this);
            $('.columnToggle').attr("title","<span id='togg'>隐藏/显示</span>企业层级");

            item.off().on('click', function () {
                //获取操作的父级节点
                var operDom = item.closest('[class^=layui-col-]');

                //获取操作节点的下一节点
                var prevDom = operDom.prev();

                //获取操作节点的列值
                var currentCol = operDom.attr('class').split(' ')[0].substring(12);

                //获取操作节点的下一节点 列值
                var prevDomCol = prevDom.attr('class').split(' ')[0].substring(12);
                if (item.is('.openSide')) {
                     /**
                     * 开启操作
                     * */

                    prevDom.show();
                    //当前节点修改
                    operDom.find('.fa-toggle-right').removeClass('fa-toggle-right').addClass('fa-toggle-left');
                    operDom.attr('class', 'layui-col-xs' + (parseInt(currentCol) - parseInt(prevDomCol)));
                    common.resize();
                    item.removeClass('openSide');
                    
                } else {
                    // 关闭
                    prevDom.hide();
                    operDom.find('.fa-toggle-left').removeClass('fa-toggle-left').addClass('fa-toggle-right');
                    operDom.attr('class', 'layui-col-xs' + (parseInt(prevDomCol) + parseInt(currentCol)));
                    common.resize();
                    item.addClass('openSide');
                }
                // if($("#togg").text() == "隐藏"){
                //     $("#togg").text("开启");
                // }else{
                //     $("#togg").text("隐藏");
                // }
            });

        })
     };
    //信息列表滚动
    Common.prototype.listScroll = function (ele) {
        var listPanel = ele;
        var z = 0;//向上滚动top值
        function up(isScroll) {//向上滚动
            if (isScroll) {
                listPanel.animate({//中奖结果
                    'top': (z - 30) + 'px'
                }, 2000, 'linear', function () {
                    listPanel.css({'top': '0px'})
                        .find("li:first").appendTo(listPanel);
                    up(true);
                });
            }
        }

        up(true);
        listPanel.on('mouseover', function () {
            listPanel.stop();
            up(false);
        }).on('mouseout', function () {
            up(true);
        });

    };

    //全局resize配置
    Common.prototype.resize = function () {
        //table resize
        $.map($('table'), function (item) {
            table.resize($(item).attr('id'));
        });

    };
    //echart resize
    Common.prototype.chartResize = function (IDList, chartList) {
        if (IDList.length > 0) {
            for (var i = 0; i < IDList.length; i++) {
                $('#' + IDList[i]).css('width', $('#' + IDList[i]).parent().actual('width') + 'px');
                if (chartList[i]) {
                    chartList[i].resize();
                }
            }
        }
    };

    //主题设置
    Common.prototype.themeSet = function () {
        var primaryColor;

        function mainSetFun(res) {
            if (res && res.list && res.list[0]) {
                primaryColor = res.list[0].prop.primaryColor;

                common.setCookie('componentInfoName', res.list[0].prop.sysTitleSet.name);


            } else {
                primaryColor = 'primary'
            }


            // res.list[0].prop.globalTheme = 'gloDark';
            if (!!res.list[0].prop.globalTheme) {
                globalThemeSet(res.list[0].prop.globalTheme);
            } else {
                themeSetFun(primaryColor);
            }
            $('body').fadeIn();
            $('body').css('opacity', '1');
            //ico 配置

            // $.ajax({
            //     url: './../../images/ico/' + res.list[0].prop.ico,
            //     type: 'GET',
            //     success: function (data) {
            //         $('.favicon').attr('href', './../../images/ico/' + res.list[0].prop.ico);
            //     }
            // });

        }

        if (!!common.getCookie('themeSet') && common.getCookie('themeSet') !== 'false') {
            common.fetchGet('compmgr/webComponent/componentInfo?compId=' + common.getCookie('themeSet'), function (res) {
                mainSetFun(res);
            }, function () {
                primaryColor = 'primary';
                themeSetFun(primaryColor);
                $('body').fadeIn();
                $('body').css('opacity', '1');
            }, false);
        } else {
            common.fetchPost('compmgr/webComponent/getTopComponentByType?type=navComp', null, function (res) {
                mainSetFun(res);

            }, function () {
                primaryColor = 'primary';
                themeSetFun(primaryColor);
                $('body').fadeIn();
                $('body').css('opacity', '1');
            }, false);

        }

        //主题色设置
        function themeSetFun(primaryColor) {
            if (primaryColor === 'primary') {
                primaryColor = '#407ac1';
                $('.pageAlertTip').css('color', '#F44336');
            } else if (primaryColor === 'red') {
                primaryColor = '#d30001';
                $('.pageAlertTip').css('color', '#FFEB3B');
                $('body').append("<style>" +
                    ".menuTheme-light .layui-layout-admin .layui-nav-tree .layui-nav-child dd.layui-this, .menuTheme-light .layui-layout-admin .layui-nav-tree .layui-nav-child dd.layui-this a, .menuTheme-light .layui-layout-admin .layui-nav-tree .layui-this, .menuTheme-light .layui-layout-admin .layui-nav-tree .layui-this > a, .menuTheme-light .layui-layout-admin .layui-nav-tree .layui-this > a:hover{background-color:rgb(242, 242, 242)}" +
                    ".layui-btn.layui-btn-danger{background-color: #ffb100 !important}" +
                    ".layui-laydate-content td.laydate-selected{background-color: rgba(211, 0, 1, 0.08)}" +
                    ".menuTabBox .customTabList ul li span{background: #ec4e4e;}" +
                    ".layui-form-radio > i:hover, .layui-form-radioed > i{color: "+primaryColor+";}"+
                    "::-webkit-scrollbar-thumb {\n" +
                    "    background-color: rgba(211, 0, 0, 0.12);\n" +
                    "}" +
                    ".navSpan{border-right: 1px solid #b77171;}"+
                    "span.globalTip{background: #ec4e4e}" +
                    // "#titleTooltip{background: #ec4e4e}" +
                    // "#titleTooltip:before{border: 6px dashed #ec4e4e}" +
                    "</style>");
            } else if (primaryColor === 'green') {
                primaryColor = '#20d37f'
            } else if (primaryColor === 'gray') {
                primaryColor = 'gray';
            } else {
                primaryColor = primaryColor;
                $('.pageAlertTip').css('color', '#d30001');
            }

            $('body').append("<style>" +
                //主题按钮区域
                ".layui-btn{background-color: " + primaryColor + "}" +

                ".layui-layer .layui-layer-title{background: " + primaryColor + "}" +
                //色板区域
                ".menuTheme-light .layui-layout-admin .layui-nav-tree .layui-nav-child dd.layui-this, .menuTheme-light .layui-layout-admin .layui-nav-tree .layui-nav-child dd.layui-this a, .menuTheme-light .layui-layout-admin .layui-nav-tree .layui-this, .menuTheme-light .layui-layout-admin .layui-nav-tree .layui-this > a, .menuTheme-light .layui-layout-admin .layui-nav-tree .layui-this > a:hover{color:" + primaryColor + "}" +
                ".menuTheme-light .menuTabBox .customTabList ul li.selected, .menuTheme-light .menuTabBox .customTabList ul li:hover{color: " + primaryColor + "}" +
                ".menuTheme-light .layui-layout-admin .layui-nav-tree .layui-nav-item a:hover{color:" + primaryColor + " !important;}" +
                ".menuTheme-light .layui-layout-admin .layui-nav-tree .layui-nav-child dd.layui-this, .menuTheme-light .layui-layout-admin .layui-nav-tree .layui-nav-child dd.layui-this a, .menuTheme-light .layui-layout-admin .layui-nav-tree .layui-this, .menuTheme-light .layui-layout-admin .layui-nav-tree .layui-this > a, .menuTheme-light .layui-layout-admin .layui-nav-tree .layui-this > a:hover{color:" + primaryColor + " !important;}" +

                ".menuTheme-dark .layui-layout-admin .layui-nav-tree .layui-nav-child dd.layui-this, .menuTheme-dark .layui-layout-admin .layui-nav-tree .layui-nav-child dd.layui-this a, .menuTheme-dark .layui-layout-admin .layui-nav-tree .layui-this, .menuTheme-dark .layui-layout-admin .layui-nav-tree .layui-this > a, .menuTheme-dark .layui-layout-admin .layui-nav-tree .layui-this > a:hover{background-color:" + primaryColor + "}" +
                ".menuTheme-dark .menuTabBox .customTabList ul li.selected, .menuTheme-dark .menuTabBox .customTabList ul li:hover{color: " + primaryColor + ";}" +
                ".menuTheme-dark .menuTabBox .customTabList ul li.selected i, .menuTheme-dark .menuTabBox .customTabList ul li:hover i{color: " + primaryColor + " !important;}" +


                ".layui-tab-brief > .layui-tab-more li.layui-this:after {border-bottom:3px solid red}" +
                ".layui-tab-brief > .layui-tab-title .layui-this:after {border-bottom:3px solid red}" +

                ".layui-colla-title .layui-colla-icon{background-color: " + primaryColor + "}" +
                ".menu-title{color: " + primaryColor + "}" +
                ".menuTipBox b{color: " + primaryColor + "}" +
                ".layui-progress-bar{color: " + primaryColor + ";background-color: " + primaryColor + "}" +
                ".layui-layout-admin .layui-header{background-color: " + primaryColor + "}" +
                ".layui-tab-brief > .layui-tab-more li.layui-this:after, .layui-tab-brief > .layui-tab-title .layui-this:after{border-bottom: 3px solid " + primaryColor + "}" +

                "[primaryColor=\"primary\"] .layui-nav .layui-this:after, [primaryColor=\"primary\"] .layui-nav-bar, [primaryColor=\"primary\"] .layui-nav-tree .layui-nav-itemed:after{background-color:" + primaryColor + "}" +
                ".menuTabBox .customTabList ul li.selected, .menuTabBox .customTabList ul li:hover{color:" + primaryColor + "}" +

                ".layui-breadcrumb a:hover{color:" + primaryColor + " !important;}" +

                ".layui-tab-brief > .layui-tab-title .layui-this{color:" + primaryColor + "}" +
                ".layui-laypage .layui-laypage-curr .layui-laypage-em{background-color:" + primaryColor + "}" +
                ".layui-laypage input:focus, .layui-laypage select:focus{border-color:" + primaryColor + " !important;}" +

                ".layui-card-header.layui-card-header-custom span > i{border-left:4px " + primaryColor + " solid}" +
                ".layui-nav .layui-nav-child dd.layui-this a, .layui-nav-child dd.layui-this{background-color: " + primaryColor + "}" +
                ".layui-form-onswitch{border-color: " + primaryColor + ";background-color: " + primaryColor + ";}" +
                ".layui-layer-btn .layui-layer-btn0 {border-color: " + primaryColor + " !important;background-color: " + primaryColor + " !important;color: #fff;}" +
                ".layui-nav-tree .layui-nav-bar{background-color: " + primaryColor + "}" +
                ".layui-form-checked[lay-skin=primary] i, .layui-form-checked[lay-skin=primary]:hover i {\n" +
                "    color: #fff;\n" +
                "    border-color: " + primaryColor + ";\n" +
                "    background-color: " + primaryColor + ";\n" +
                "}" +
                ".custom-title{border-left: 4px solid " + primaryColor + ";}" +
                ".themeConfigArea .mainThemeArea ul li:hover {\n" +
                "    border: 3px solid " + primaryColor + ";\n" +
                "}" +
                ".themeConfigArea .mainThemeArea ul li.selected i{color: " + primaryColor + "}" +
                ".layui-nav .layui-this:after, .layui-nav-bar, .layui-nav-tree .layui-nav-itemed:after{background-color: " + primaryColor + ";}" +
                // ".layui-form-radio > i:hover, .layui-form-radioed > i{color: " + primaryColor + "}" +
                ".layui-form-select dl dd.layui-this{background-color: " + primaryColor + "}" +
                ".layui-form-checked span, .layui-form-checked:hover span{background-color: " + primaryColor + "}" +
                ".layui-form-checked i, .layui-form-checked:hover i{color: " + primaryColor + "}" +
                ".layui-laydate .layui-this{background-color: " + primaryColor + " !important;}" +
                ".laydate-selected:hover {\n" +
                "    background-color: " + primaryColor + " !important;\n" +
                "}" +
                ".primary{color: " + primaryColor + "}" +

                ".pageRocket:hover{color: " + primaryColor + "}" +
                ".step-item-head.step-item-head-active{background: " + primaryColor + "}" +
                ".step-item-head{color: " + primaryColor + ";border: 1px solid " + primaryColor + ";}" +
                ".step-item-tail .step-item-tail-done{background: " + primaryColor + "}" +

                "</style>");
        }

        //全局主题配置设置
        function globalThemeSet(globalTheme) {
            if (globalTheme === 'gloBlue') {
                themeSetFun('#407ac0');
                var primaryColor = '#407ac1';

                //todo:需求为按钮改为绿色，表示有很大的疑义。。。。。。。。。
                var btnColor = '#407ac1';
                $('body').append("<style>" +
                    //主题按钮区域
                    ".layui-btn{background-color: " + btnColor + " }" +
                    ".layui-layer-btn .layui-layer-btn0 {border-color: " + btnColor + " !important;background-color: " + btnColor + " !important;color: #fff;}" +
                    ".menuTheme-blueDark .layui-layout-admin .layui-header{background-color: " + primaryColor + "}" +
                    ".layui-btn.layui-btn-primary {border: 1px solid #407ac1 !important;background-color: #fff !important;color: #407ac1;}" +
                    ".layui-btn.layui-btn-primary:hover {color: #407ac1;opacity: 1}" +
                    "</style>");
                $('.pageAlertTip').css('color', '#FFC107');
            } else if (globalTheme === 'gloDark') {
                $('html').attr('globalTheme', 'gloDark');
                //暗黑主题
                var darkBg = '#021136';
                var dartZwcolor = '#C2C2C2';
                var darkTitleColor = '#FFFFFF';

                themeSetFun('#0186c8');
                $('.pageAlertTip').css('color', '#FFC107');
                $('body').append("<style>" +
                    ".content-wrap{background: " + darkBg + "}" +
                    ".menuTheme-dark .layui-layout-admin .layui-side.layui-bg-black {background-color: #122142  !important}" +
                    ".menuTheme-dark .layui-layout-admin .layui-side .layui-nav{background-color:#122142 }" +
                    ".menuTheme-dark .menuTabBox .customTabList {background: #021133;}" +
                    ".layui-layout-admin .layui-header{background-color: #021133;}" +
                    ".menuTheme-dark .layui-layout-admin .layui-nav-tree .layui-nav-child dd.layui-this, .menuTheme-dark .layui-layout-admin .layui-nav-tree .layui-nav-child dd.layui-this a, .menuTheme-dark .layui-layout-admin .layui-nav-tree .layui-this, .menuTheme-dark .layui-layout-admin .layui-nav-tree .layui-this > a, .menuTheme-dark .layui-layout-admin .layui-nav-tree .layui-this > a:hover{background-color: #313d58 !important;color:#0186c8 !important;}" +
                    "</style>");
            }
        }

        //title修订导入
        common.titleTooltip();
        $('.menuContentMark').fadeOut();
        $(".menuContentMark", parent.document).fadeOut();

    };
    //原生title修订
    Common.prototype.titleTooltip = function (obj) {

        //title设置
        var x = -15;
        var y = 32;
        $(document).on('mouseover', '[title]', function (e) {
            this.myTitle = this.title;
            if (!this.title) {
                return false;
            }
            this.title = "";
            var tooltip = '';
            if (obj) {
                tooltip = "<div id='titleTooltip'>" + this.myTitle + "</div>"; //创建DIV元素
            } else {
                tooltip = "<div id='titleTooltip'>" + this.myTitle + "</div>"; //创建DIV元素
            }


            $("body").append(tooltip); //追加到文档中
            $("#titleTooltip").css({"top": (e.pageY + y) + "px", "left": (e.pageX + x) + "px"}).show();     //设置X Y坐标， 并且显示
        }).on('mouseout', '[title]', function (e) {
            this.title = this.myTitle;
            $("#titleTooltip").remove(); //移除
        }).on('mousemove', '[title]', function (e) {
            $("#titleTooltip").css({"top": (e.pageY + y) + "px", "left": (e.pageX + x) + "px"});
        })
    };

    //获取请求参数
    Common.prototype.getQueryVariable = function (variable) {

        var reg = new RegExp("(^|&)" + variable + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return decodeURIComponent(r[2]); return null;

        // var query = window.location.search.substring(1);
        // var vars = query.split("&");
        // for (var i = 0; i < vars.length; i++) {
        //     var pair = vars[i].split("=");
        //     if (pair[0] == variable) {
        //         return pair[1];
        //     }
        // }
        // return (false);
    };

    //getMenuSmid 获取menuId
    Common.prototype.getCurrentMenuId = function () {
        if ($("#currentMenuSmId", window.top.document).val()) {
            return $("#currentMenuSmId", window.top.document).val()
        } else if (common.getQueryVariable('menuId')) {
            return common.getQueryVariable('menuId')
        }

    };

    //判断是否输入为数字金额
    //全部替换
    Common.prototype.isMoney = function (data) {//默认保留10位小数点
        // var reg=new RegExp('/^d*(?:.d{0,2})?$/'); //创建正则RegExp对象
        var reg = new RegExp('^[0-9]+([.]{1}[0-9]+){0,1}$'); //创建正则RegExp对象
        return reg.test(data);
    };

    //icon选择器
    Common.prototype.iconLayerSelect = function (ele) {
        var layerIcon = layer.open({
            title: '选择图标<span style="color: #d30001">【双击选中图标】</span>',
            type: 2,
            content: '../../../src/font/customFont.html',
            success: function (layero, index) {
                var body = layer.getChildFrame('body', index);
                body.find('ul.icon_lists li').off().on('dblclick', function () {
                    $(ele).val($(this).find('span').attr("class"));
                    layer.close(layerIcon)
                });
            }
        });
        layer.full(layerIcon);
    };

    //headPic选择器
    Common.prototype.headPicLayerSelect = function (ele) {
        var layerHeadPic = layer.open({
            title: '选择头像<span style="color: #d30001">【双击选中头像】</span>',
            type: 2,
            content: '../../../src/font/headPic.html',
            success: function (layero, index) {
                var body = layer.getChildFrame('body', index);
                body.find('ul.icon_lists li').off().on('dblclick', function () {
                    $(ele).val($(this).find('img').attr("src"));
                    layer.close(layerHeadPic)
                });
            }
        });
        layer.full(layerHeadPic);
    };
    //获取数据权限过滤信息
    Common.prototype.dataAccessParam = function (obj) {
        var parent = $('.dataAccessArea');
        var dataObj = {'extraParam': []};
        if (!!parent.find('span.text') && parent.find('span.text').length > 0) {
            $.map(parent.find('span.text'), function (item) {
                var currentItem = $(item).find('b');
                if (!!currentItem.attr('showvalue')) {
                    // dataObj.extraParam[currentItem.attr('showvalue')] = currentItem.attr('searchvalue');
                    dataObj.extraParam.push({
                        key: currentItem.attr('showvalue'),
                        value: currentItem.attr('searchvalue'),
                        targetKey: currentItem.attr('targetKey')
                    });
                }
            });
        }
        if (dataObj.extraParam === []) {
            dataObj = {};
        }
        return $.extend({}, obj, dataObj);
    };

    // 页面刷新对象整合
    Common.prototype.dataAccessReloadModule = function (obj) {
        $('body').append('<div class="reloadModuleList" style="display: none">' + JSON.stringify(obj) + '</div>');
        if (!!obj) {
            //表格刷新
            if (obj.table && obj.table.length > 0) {
                $.map(obj.table, function (tableItem) {
                    $('body').append('<div class="tableReload_' + tableItem + '" style="display: none"></div>');
                    $('.tableReload_' + tableItem).off().on('click', function () {
                        table.reload(tableItem, {
                            where: common.dataAccessParam()
                        });
                    });
                });
            }
            //树刷新
            //todo:

            //图表刷新
            //todo:
        }

    };

    //pdf文件预览
    Common.prototype.filePreview = function (obj) {
        // if($('body').find('.filePreviewBox')[0]){
        //     $('body').find('.filePreviewBox').remove()
        // }
        // $('body').append('<div class="filePreviewBox"></div>');
        // $('body').find('.filePreviewBox').css({
        //     width:'100%',
        //     height:$(window).height()+'px'
        // });

        //判断数据格式
        if (obj && obj.src) {
            var arr = obj.src.split('.');
            var fileType = arr[arr.length - 1];
            if (fileType === 'pdf') {//pdf预览
                //如果是pdf:
                window.open('./../../js/lib/pdfjs/web/viewer.html?file=' + obj.src, 'PDF');
            } else if (fileType === 'txt') {
                var previewLayer = layer.open({
                    title: ['预览'],
                    maxmin: false,
                    type: 1,
                    area: ['100%', '100%'],
                    shadeClose: false,
                    content: '<div  style="padding: 10px"><div class="filePreviewBox"><iframe src="' + obj.src + '" frameborder="0" width="100%" height="100%"></iframe></div></div>',
                    btn: ['关闭'],
                    btnAlign: 'c',
                    yes: function () {
                        layer.close(previewLayer);
                    }
                });
                layer.full(previewLayer);
            } else if (fileType === 'jpg' || fileType === 'png' || fileType === 'jpeg') {//图片预览的功能
                var imgLayer = layer.open({
                    title: ['预览'],
                    maxmin: false,
                    type: 1,
                    area: ['100%', '100%'],
                    shadeClose: false,
                    content: '<div  style="padding: 10px"><div class="filePreviewBox"><iframe src="' + obj.src + '" frameborder="0" width="100%" height="100%"></iframe></div></div>',
                    btn: ['关闭'],
                    btnAlign: 'c',
                    yes: function () {
                        layer.close(imgLayer);
                    }
                });
                layer.full(previewLayer);
            }
        }

        return false;

    };
    // 判断浏览器是否为ie浏览器及其版本
    Common.prototype.IEVersion = function () {
        var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
        var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE<11浏览器
        var isEdge = userAgent.indexOf("Edge") > -1 && !isIE; //判断是否IE的Edge浏览器
        var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1;
        if(isIE) {
            var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
            reIE.test(userAgent);
            var fIEVersion = parseFloat(RegExp["$1"]);
            if(fIEVersion == 7) {
                return 7;
            } else if(fIEVersion == 8) {
                return 8;
            } else if(fIEVersion == 9) {
                return 9;
            } else if(fIEVersion == 10) {
                return 10;
            } else {
                return 6;//IE版本<=7
            }
        } else if(isEdge) {
            return 'edge';//edge
        } else if(isIE11) {
            return 11; //IE11
        }else{
            return -1;//不是ie浏览器
        }

    };
    //pdf文件预览 pdf.js  //pdf类型文件预览 否则 下载
    Common.prototype.pdfPreview = function (fiId,type) {
        var src='';
        if (type === 'pdf') {
            src = "/dfsmgr/file/filesDownload?fid=" + fiId;
            top.layer.open({
                title:false,
                type: 2,
                area: ['80%', '80%'],
                content: (this.IEVersion()==-1)?('./src/js/lib/pdf/web/viewer.html?url_file=' + encodeURIComponent(common.getLocationOrigin() + '/' + src)):('./src/js/lib/pdf/forIE/show.html?fiId='+fiId)
                // content: ('./src/js/lib/pdf/forIE/show.html?fiId='+fiId)
            });
        }
        else{

            if (!fileIframe) {
                var fileIframe = document.createElement("iframe");
                document.body.appendChild(fileIframe);
                fileIframe.style.display = "none";
            }
            fileIframe.src = baseUrl + "dfsmgr/file/filesDownload?fid=" + fiId

            // src = "/dfsmgr/file/filesDownload?fid=" + fiId;
            // window.open(src);
        }
        return false;
    };
    //pdf文件预览 pdf.js  //pdf类型文件预览 否则 下载
    Common.prototype.localPdfPreview = function (param,type) {
        if (type === 'pdf') {
            top.layer.open({
                title:false,
                type: 2,
                area: ['80%', '80%'],
                content: ('./src/js/lib/pdf/web/localViewer.html?param=' + encodeURIComponent(param))
                // content: ('./src/js/lib/pdf/forIE/show.html?fiId='+fiId)
            });
        }
        return false;
    };

    //数据排序
    Common.prototype.arraySort = function (data, property) {
        function compare(property) {
            return function (a, b) {
                var value1 = a[property];
                var value2 = b[property];
                return value1 - value2;
            }
        }

        return data.sort(compare(property))
    };

    //数组查找位置
    Common.prototype.arrayIndexOf = function (data, property, value) {
        if (data && data.length > 0) {
            var index = -1;
            for (var i = 0; i < data.length; i++) {
                if (data[i][property] === value) {
                    index = i;
                    break;
                }
            }
            return index;
        }
    };
    //Sort
    Common.prototype.Sort = function (arr, index) { //参数arr代表数组，index代表数组元素下标
        　　arr[index] += arr[index + 1];  //a+=b;
        　　arr[index + 1] = arr[index] - arr[index + 1]; // b = a - b;
        　　arr[index] -= arr[index + 1]; //a -= b;
    };
    //sort兼容问题封装
    Common.prototype.sort = function (arr, asc) {//参数arr代表数组，sac为设置升降序 //true为升序，false为降序
    　　for(var i = 1; i < arr.length; i++){
    　　　　for(var k = 0; k < arr.length - 1; k++){
    　　　　　　if(asc){ //如果asc为true则通过，否则则不通过
    　　　　　　　　if(arr[k] > arr[k + 1]){
    　　　　　　　　　　common.Sort(arr, k); //在这里调用两值互换函数
    　　　　　　　　}
    　　　　　　}else{
    　　　　　　　　if(arr[k] < arr[k + 1]){
    　　　　　　　　　　common.Sort(arr, k); //在这里调用两值互换函数
    　　　　　　　　}
    　　　　　　}
    　　　　}
    　　}
    　　return arr;
    };

    //获取url中html 内容
    Common.prototype.getPageHtml = function (url) {
        var html = '';
        $.ajax({
            url: url,
            type: "GET",
            dataType: "html",
            async: false,
            success: function (result) {
                html = result
            }
        });
        return html;
    };

    //数组分类
    Common.prototype.arraySplit = function (arr, number) {

        if (arr.length > 0) {
            var proportion = number; //按照比例切割
            var num = 0;
            var _data = [];
            for (var i = 0; i < arr.length; i++) {
                if (i % proportion == 0 && i != 0) {
                    _data.push(arr.slice(num, i));
                    num = i;
                }
                if ((i + 1) == arr.length) {
                    _data.push(arr.slice(num, (i + 1)));
                }
            }
            return _data;
        }

    };

    //人员选择
    Common.prototype.userSelect = function (data, variable) {
        var params = $.extend({
            // elem:$('#userSelectBtn')
            layerTitle: "人员选择",
            dataInit: function () {
                return []
            },//选中人员
            single: false
        }, data);

        //获取人员选择html导入页面
        var layerHtml = common.getPageHtml('/src/page/publicTemplet/userSelect.html');


        if (params.elem) {
            params.elem.off().on('click', function () {
                //获取已选人员列表

                var dataInitList = common.trimData(params.dataInit(), 'array');
                var userSelectLayer = layer.open({
                    title: params.layerTitle,
                    maxmin: false,
                    type: 1,
                    area: ['700px', '530px'],
                    shadeClose: false,
                    content: layerHtml,
                    btn: ['确定', '取消'],
                    btnAlign: 'c',
                    success: function (obj) {
                        element.init();
                        var parent = $(obj.selector);

                        function userHtmlSet(elem, data) {
                            var html = '';
                            if (data.length > 0) {
                                $.map(data, function (item) {
                                    if (item) {
                                        var userName, userPosition, orgName, userId, sourceTable;
                                        userName = (item.userName ? item.userName : (item.rspPersonName ? item.rspPersonName : '-'));
                                        userPosition = (item.rspPersonPosition ? item.rspPersonPosition : (item.userPosition ? item.userPosition : '-'));
                                        userId = (item.rspPersonId ? item.rspPersonId : item.userId);
                                        orgName = (item.rspOrgName ? item.rspOrgName : (item.orgName ? item.orgName : '-'));
                                        sourceTable = (item.rspSourceTable ? item.rspSourceTable : item.sourceTable);

                                        html += '<li sourceTable="' + sourceTable + '" position="' + userPosition + '" userid="' + userId + '" username="' + userName + '" organ="' + orgName + '">\n' +
                                            '    <div class="item">\n' +
                                            '      <span class="checkArea">\n' +
                                            '      <i class="fa fa-circle-o"></i>\n' +
                                            '      <i class="fa fa-check-circle green"></i>\n' +
                                            '      </span>\n' +
                                            '      <div class="userHeader">\n' +
                                            '          <img alt="" src="../../../images/defaultHead.png">\n' +
                                            '      </div>\n' +
                                            '      <div class="userDes">\n' +
                                            '          <p class="userName">' + userName + '</p>\n' +
                                            '          <p class="userText">\n' +
                                            '              <span class="text">' + (orgName ? orgName : '-') + '</span>\n' +
                                            '          </p>\n' +
                                            '      </div>\n' +
                                            '    </div>\n' +
                                            ' </li>';
                                    }
                                });
                            }

                            elem.empty().html(html)

                        }


                        //最近人员信息数据导入
                        common.fetchPost('sascommon/selectPerson/selectRecentSelectPersonList', null, function (res) {
                            var data = res.list || [];
                            if (data.length > 0) {
                                userHtmlSet(parent.find('#userList ul'), data);
                                //已选人员数据回填
                                if (dataInitList.length > 0) {
                                    for (var i = 0; i < dataInitList.length; i++) {

                                        parent.find('#userList ul').find('[userid=' + dataInitList[i] + ']').click();
                                    }
                                }
                            }
                        });


                        //组织机构树导入
                        common.fetchPost('sascommon/selectPerson/selectOrgTree', {}, function (res) {
                            if (res.success && res.list) {
                                tree.render({
                                    elem: '#organTree',
                                    data: res.list,
                                    showCheckbox: false,
                                    lazy: true,
                                    done: function (data) {

                                    },
                                    load: function (data, callback) {
                                        common.fetchPost('sascommon/selectPerson/selectOrgTree?nodeId=' + data.id + '&nodeType=' + data.extendAttr, {}, function (res) {

                                            if (res.success && res.list) {
                                                callback(res.list);
                                            }
                                            // if (res.success && res.list) {
                                            //
                                            //     // userHtmlSet(parent.find('#organUserList ul'), data);
                                            //
                                            // }
                                        }, function () {
                                            callback([])
                                        });
                                    }
                                });

                                tree.on("nodeClick(organTree)", function (obj) {

                                    var data = obj.data.currentData;

                                    var url = '', params;
                                    if (data.extendAttr === 'enterprise') {
                                        url = 'sascommon/selectPerson/selectCompanyUserList';
                                        params = {
                                            cid: data.id
                                        }
                                    } else {
                                        url = 'sascommon/selectPerson/selectOrgUserList';
                                        params = {
                                            oid: data.id
                                        }
                                    }

                                    common.fetchPost(url, params, function (res) {
                                        if (res.success && res.list) {
                                            var list = res.list;
                                            if (list.length > 0) {
                                                userHtmlSet(parent.find('#organUserList ul'), list);
                                                //已选人员数据回填
                                                if (dataInitList.length > 0) {
                                                    for (var i = 0; i < dataInitList.length; i++) {
                                                        parent.find('#organUserList ul').find('[userid=' + dataInitList[i] + ']').click();
                                                    }
                                                }
                                            }
                                        }
                                    }, function () {

                                    });



                                });
                                $('#organTree').find('.eleTree-node-content-label').eq(0).trigger('click');
                            } else {
                                //不存在数据时的显示

                            }

                        }, function () {
                        });

                        //常用组群
                        common.fetchPost('sascommon/selectPerson/selectGroupPersonTree', {}, function (res) {
                            if (res.success && res.list) {

                                var dataMap = {};
                                if (res.list.length > 0) {
                                    $.map(res.list, function (item) {
                                        dataMap[item.groupId] = item.memberList
                                    })
                                }

                                tree.render({
                                    elem: '#commonGroupTree',
                                    data: res.list,
                                    showCheckbox: false,
                                    lazy: false,
                                    request: {
                                        name: "groupName",
                                        key: "groupId",
                                        children: "children",
                                        extendAttr: "nodeType"
                                    },
                                    done: function () {

                                    }
                                });
                                tree.on("nodeClick(commonGroupTree)", function (obj) {

                                    userHtmlSet(parent.find('#commonGroupList ul'), dataMap[obj.data.currentData.groupId]);
                                    //已选人员数据回填
                                    if (dataInitList.length > 0) {
                                        for (var i = 0; i < dataInitList.length; i++) {
                                            parent.find('#commonGroupList ul').find('[userid=' + dataInitList[i] + ']').click();
                                        }
                                    }

                                });
                                $('#commonGroupTree').find('.eleTree-node-content-label').eq(0).trigger('click');
                            } else {
                                //不存在数据时的显示

                            }

                        }, function () {
                        });


                        //高级搜索列表
                        common.fetchPost('sascommon/selectPerson/selectLoginUserCompanyUserList', {
                            cid: common.getUserInfo().seId
                        }, function (res) {
                            var data = res.list || [];
                            if (data.length > 0) {
                                userHtmlSet(parent.find('#searchUserList ul'), data);
                            }
                        });

                        //高级搜索
                        $('#searchAllBtn').off().on('click', function () {
                            common.fetchPost('sascommon/selectPerson/selectLoginUserCompanyUserList?uName=' + $.trim($('[name=searchAllInput]').val()), {}, function (res) {
                                var data = res.list || [];
                                if (data.length > 0) {
                                    userHtmlSet(parent.find('#searchUserList ul'), data);
                                }
                            });
                        });

                        //组织架构查询
                        $('#groupSearch').off().on('click', function () {
                            userHtmlSet(parent.find('#organUserList ul'), []);
                        });

                        //查询最近人员

                        $('#lastUserBtn').off().on('click', function () {
                            common.fetchPost('sascommon/selectPerson/selectRecentSelectPersonList?rspPersonName=' + $.trim($('[name=lastUserInput]').val()), {}, function (res) {
                                var data = res.list || [];
                                if (data.length > 0) {
                                    userHtmlSet(parent.find('#userList ul'), data);
                                }
                            });
                        });

                        //人员选中
                        $(document).off('click', '.userList ul li');
                        $(document).on('click', '.userList ul li', function () {
                            var current = $(this);

                            if (!params.single) {
                                if (current.find('.item').is('.selected')) {
                                    current.find('.item').removeClass('selected');
                                    //已选列表中清除
                                    parent.find('.selectedUserList ul [userId=' + current.attr('userId') + ']').remove();
                                } else {
                                    current.find('.item').addClass('selected');

                                    if (!parent.find('.selectedUserList ul').find('[userId=' + current.attr('userId') + ']')[0]) {
                                        var html = '<li sourceTable="' + current.attr('sourceTable') + '" userId="' + current.attr('userId') + '" position="' + current.attr('position') + '" username="' + current.attr('username') + '" organ="' + current.attr('organ') + '">\n' +
                                            '    <div class="userHeader">\n' +
                                            '        <img alt="" src="../../../images/defaultHead.png">\n' +
                                            '    </div>\n' +
                                            '    <div class="userName">' + current.attr('userName') + '</div>\n' +
                                            '    <div class="userDeleteBtn"> <i class="fa fa-close"></i></div>\n' +
                                            '</li>';
                                        parent.find('.selectedUserList ul').append(html);
                                    }

                                }
                            } else {
                                parent.find('.item').removeClass('selected');
                                current.find('.item').addClass('selected');


                                var html = '<li sourceTable="' + current.attr('sourceTable') + '" userId="' + current.attr('userId') + '" position="' + current.attr('position') + '" username="' + current.attr('username') + '" organ="' + current.attr('organ') + '">\n' +
                                    '    <div class="userHeader">\n' +
                                    '        <img alt="" src="../../../images/defaultHead.png">\n' +
                                    '    </div>\n' +
                                    '    <div class="userName">' + current.attr('userName') + '</div>\n' +
                                    '    <div class="userDeleteBtn"> <i class="fa fa-close"></i></div>\n' +
                                    '</li>';
                                parent.find('.selectedUserList ul').empty().html(html);
                            }



                        });
                        //已选人员删除按钮
                        $(document).off('click', '.userDeleteBtn');
                        $(document).on('click', '.userDeleteBtn', function () {
                            var current = $(this).parent();
                            current.remove();
                            //删除人员列表中的选中项
                            parent.find('#userList [userId=' + current.attr('userId') + ']').find('.item').removeClass('selected');
                            parent.find('#organUserList [userId=' + current.attr('userId') + ']').find('.item').removeClass('selected');
                            parent.find('#commonGroupList [userId=' + current.attr('userId') + ']').find('.item').removeClass('selected');

                        });

                        //清空
                        $('#cleanRePer').off().on('click', function () {

                            common.fetchDelete('sascommon/selectPerson/clearRecentSelectedPersonList', function (res) {
                                if (res.success) {
                                    layer.msg('清空成功');
                                    userHtmlSet(parent.find('#userList ul'), []);
                                }
                            })

                        });

                        // //高级搜索
                        // $('#searchAllBtn').off().on('click', function () {
                        //     var value = $('[name=searchAllInput]').val();
                        //     //todo:高级搜索
                        //     common.fetchPost('sascommon/selectPerson/selectLoginUserCompanyUserList', {
                        //         uName:value
                        //     }, function (res) {
                        //         //刷新高级搜索
                        //
                        //
                        //     });
                        // });

                    },
                    yes: function (index, obj) {
                        var parent = $(obj.selector);
                        if (params.success) {

                            //已选人员数据返回

                            var data = [], selectList = [];
                            if ($('.selectedUserList li').length > 0) {
                                $.map($('.selectedUserList li'), function (item) {
                                    data.push({
                                        organ: $(item).attr('organ'),
                                        name: $(item).attr('username'),
                                        id: $(item).attr('userid'),
                                        position: $(item).attr('position')
                                    });
                                    selectList.push({
                                        rspOrgName: $(item).attr('organ'),
                                        rspPersonName: $(item).attr('username'),
                                        rspPersonId: $(item).attr('userid'),
                                        rspPersonPosition: $(item).attr('position'),
                                        rspSourceTable: $(item).attr('sourceTable')
                                    });

                                });
                            }

                            //将数据导入最近选择人 接口
                            common.fetchPost('sascommon/selectPerson/addRecentSelectedPersonList', selectList, function (qwq) {

                            });

                            // return data;
                            if (params.success) {
                                params.success(data, params.elem);
                                layer.close(userSelectLayer);
                            }

                        }

                    },
                    btn2: function () {
                        layer.close(userSelectLayer);
                    }
                });
            })
        }
    };

    //bytesToSize
    Common.prototype.bytesToSize = function (bytes) {
        if (bytes === 0) return '0 B';
        var k = 1000, // or 1024
            sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
            i = Math.floor(Math.log(bytes) / Math.log(k));

        return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
    };

    //附件列表
    Common.prototype.fileUploadList = function (data, successBack) {

        var params = $.extend({
            elem: '#meetingNotice',
            url: baseUrl + 'zuul/dfsmgr/file/fileUpload',
            auto: true,
            data: {
                "resId": 12
            },
            accept: 'file',
            exts: 'pdf|ofd',
            deleteClass: '',
        }, data);

        if (!params.data.resId) {
            layer.msg(params.tip)
        }

        upload.render({
            elem: params.elem,
            url: params.url,
            auto: params.auto,
            exts: params.exts,
            data: params.data,
            accept: params.accept,/**/

            // bindAction: params.bindAction,
            //
            // choose: function (obj) {
            //     obj.preview(function (index, file, result) {
            //         parent.find("#fileNameArea").show();
            //         var arr = file.name.split('.');
            //
            //         if (file.name.split('.').length > 2) {
            //             var fileName = '';
            //             $.map(arr, function (item, index) {
            //                 if (index !== (arr.length - 1)) {
            //                     fileName += item;
            //                 }
            //             });
            //             parent.find("input[name=fileName]").val(fileName);
            //         } else {
            //             parent.find("input[name=fileName]").val(file.name.split('.')[0]);
            //         }
            //
            //         parent.find("input[name=fileType]").val('.' + arr[arr.length - 1]);
            //     });
            // },

            done: function (res, index, upload) {
                var fileName = res.list[0].fiName + '.' + res.list[0].fiSuffix;
                var html = '<li data-fiType="' + res.list[0].fiSuffix + '" data-fiId="' + res.list[0].fiId + '" fileName="' + fileName + '">' +
                    '        <div class="fileSingleBox" >' +
                    '            <p class="fileName" title="' + fileName + '">' + fileName + '</p>' +
                    '            <p style="position: absolute;bottom: 2px"> <i class="fa  fa-file-text-o"></i><b class="fileSize">' + common.bytesToSize(res.list[0].fiSize) + '</b></p>' +
                    '            <div class="box-close-btn fileDelete ' + params.deleteClass + '" title="删除"><i class="fa fa-close"></i></div>' +
                    '        </div>' +
                    '     </li>';
                params.appendArea.append(html);

                if (successBack) {
                    successBack();
                }

                return false;
            }
        });

        $(document).off('click', '[data-fiId]');
        $(document).on('click', '[data-fiId]', function (e) {
            if ($(e.target).is('.fa-close') || $(e.target).is('.fileDelete')) {
                return false;
            }
            var _this = $(this);
            if (_this.attr('data-fiId') && _this.attr('data-fiType') && _this.attr('data-fiType') === 'pdf') {
                common.pdfPreview($(this).attr('data-fiId'), $(this).attr('data-fiType'));//pdf预览
            } else {
                if (!fileIframe) {
                    var fileIframe = document.createElement("iframe");
                    document.body.appendChild(fileIframe);
                    fileIframe.style.display = "none";
                }
                fileIframe.src = baseUrl + "dfsmgr/file/filesDownload?fid=" + $(this).attr('data-fiId')
            }

        })

    };

    Common.prototype.getLocationOrigin = function (top) {
        if (!top) {
            if (!window.location.origin) {
                return window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
            } else {
                return window.location.origin
            }
        } else {
            if (!window.top.location.origin) {
                return window.top.location.protocol + "//" + window.top.location.hostname + (window.top.location.port ? ':' + window.top.location.port : '');
            } else {
                return window.top.location.origin
            }
        }

    };


    //打开新页 附加到面包屑
    Common.prototype.openNewWrap = function (obj) {
        var params = $.extend({
            title: '-',
            url: ''
        }, obj);

        var loadingHtml = '<div class="menuContentMark" style="z-index: 0"><img alt="正在载入..." src="./src/images/loading-grid.gif"><span>正在载入...</span></div>';
        // var loadingHtml=' ';


        var iframeHtml = '<div style="width: 100%;height: 100%;background: white;z-index: 1"><iframe style="z-index: 1" src="' + common.getLocationOrigin() + params.url + '" frameborder="0" width="100%" height="100%"></iframe></div>';


        //标题加入 title

        $('#breadcrumb-custom', parent.document).append('<a class="newIframeFixedDom" title="' + params.title + '" style="padding-left: 10px"> / ' + params.title + '</a>');

        $(".menuContent", parent.document).append('<div class="newIframeFixed">' + loadingHtml + iframeHtml + '</div>');

        $('.newIframeFixedDom', parent.document).off().on('click', function () {
            $(".newIframeFixed", parent.document).empty().html(loadingHtml + iframeHtml);

        });

    };

    //数据搜索折叠框
    Common.prototype.dataSearchBar = function (elem) {
        elem.find('.searchLine').off().on('click', function () {

            elem.find('.searchArea').slideToggle();

        });
    };
    Common.prototype.rightSearchBar = function (elem1, elem2) {

        elem1.off().on('click', function () {
            if (elem2[0].style.display === "block" || elem2[0].style.display === "") {
                elem2.fadeOut();
            } else {
                elem2.fadeIn();
            }
        });
    };

    //文件下载
    Common.prototype.fileDownload = function (fiId) {

        if (!fileIframe) {
            var fileIframe = document.createElement("iframe");
            document.body.appendChild(fileIframe);
            fileIframe.style.display = "none";
        }
        fileIframe.src = baseUrl + "dfsmgr/file/filesDownload?fid=" + fiId
        return false;
    };

    //流程日志导入
    // Common.prototype.flowLogDataSet = function (area, businessId) {
    //     //获取流程piid
    //     common.fetchGet('sasprocessmgr/businessEngineInfo/getBusinessEngineInfoByBusinessId?businessId=' + businessId, function (res) {
    //         if (res.success) {
    //             var piid = res.object.flowPiid;

    //             area.find('.emptyDatFlow').show();
    //             area.find('.verticalTimeLine').empty();
    //             //获取流程日志 322

    //             common.fetchGet('flowEngine/engineQuery/getFlowInfoByPiid?piid=' + piid, function (res) {
    //                 if (res.success) {
    //                     var data = res.list || [];
    //                     var html = '';
    //                     if (data.length > 0) {
    //                         area.find('.gloEmptyBox').hide();
    //                         $.map(data, function (item) {
    //                             var status = '';

    //                             if (item.flowstatus === "2") {
    //                                 if (item.opinion && item.opinion.isback && (item.opinion.isback === null || item.opinion.isback === "1")) {
    //                                     status = ' <div class="status unpassIcon"></div>'
    //                                 } else {
    //                                     status = ' <div class="status passIcon"></div>'
    //                                 }
    //                             } else {
    //                                 status = "";
    //                             }

    //                             html += '<div class="timeItem">\n' +
    //                                 '      <i class="lineIcon fa fa-send-o"></i>\n' +
    //                                 '      <span class="time">' + (item.statename ? item.statename : '-') + ' <b style="font-weight: normal;margin-left: 10px;display: inline-block">' + (item.endtime ? item.endtime : '-') + '</b></span>\n' +
    //                                 '      <div class="content">\n' +
    //                                 '          <table class="layui-table custom-table" style="width: 50%">\n' +
    //                                 '              <tr>\n' +
    //                                 '                  <td class="bg-f7">\n' +
    //                                 '                      <div class="userHeader small-size"\n' +
    //                                 '                           style="padding: 0">\n' +
    //                                 '                          <img alt="" src="../../../images/defaultUser.jpg">\n' +
    //                                 '                      </div>\n' +
    //                                 '                      <div style="display: inline-block">\n' +
    //                                 '                          ' + (item.username ? item.username : item.username) + ' \n' +
    //                                 '                      </div>' + status + '</td>\n' +
    //                                 '              </tr>\n' +
    //                                 '              <tr>\n' +
    //                                 '                  <td>\n' +
    //                                 '                      ' + (item.opinion ? (item.opinion.content ? item.opinion.content : '无') : '无') + '\n' +
    //                                 '                  </td>\n' +
    //                                 '              </tr>\n' +
    //                                 '          </table>\n' +
    //                                 '      </div>\n' +
    //                                 '  </div>';
    //                         });
    //                         area.find('.verticalTimeLine').empty().html(html);
    //                     } else {
    //                         area.find('.gloEmptyBox').show();
    //                     }
    //                 }
    //             })

    //         } else {
    //             //获取流程信息失败

    //         }

    //     })
    // };

    //操作流程步骤
    Common.prototype.flowEngineStep = function (obj) {


        var params = $.extend({}, obj);

        params.elem.empty().html('<div class="flowStepBtn"><ul class="clearFix">' +
            '<li class="destroyBtn" style="display: none"><span>撤回</span></li>' +
            '<li class="cancelPending" style="display: none"><span>取消办结</span></li>' +
            '</ul><div class="toggleHide" style="padding: 3px 15px;font-size: 12px;text-align: center ;background: rgba(216, 223, 230, 0.35)">收起<i style="margin-left: 5px" class=" fa fa-angle-double-up"></i></div></div>');

        params.elem.find('.toggleHide').off().on('click', function () {
            params.elem.toggleClass('open');
            if (params.elem.is('.open')) {
                params.elem.find('.toggleHide').html('展开<i style="margin-left: 5px" class=" fa fa-angle-double-down"></i>').css({
                    background: '#407ac1 !important'
                });
                params.elem.find('.toggleHide').siblings().hide();
            } else {
                params.elem.find('.toggleHide').siblings().show();
                params.elem.find('.toggleHide').html('收起<i style="margin-left: 5px" class=" fa fa-angle-double-up"></i>')
            }
        });

        //获取当前业务流程信息
        var piid, flowLabel, drafterId, todoUserList, todoUserMap = {}, doneUserList, wiid;

        var currentUserId = common.getUserInfo().suId;

        var isFlow = false;

        common.fetchGet('sasprocessmgr/businessEngineInfo/getBusinessEngineInfoByBusinessId?businessId=' + params.businessId, function (res) {

            var data = res.object;

            if (res.success) {
                piid = res.object.flowPiid;
                flowLabel = data.flowLabel;
                drafterId = data.drafterId;
                doneUserList = data.doneUserList;
                todoUserList = data.todoUserList ? data.todoUserList.split('/')[0] : '';
                isFlow = true
            }

        }, false, false);

        //代办人员信息
        // if (todoUserList && todoUserList.length > 0) {
        //     $.map(todoUserList, function (item) {
        //         todoUserMap[item.value] = item;
        //     })
        // }

        //调用当前流程接口
        function currentFlowStep() {
            //调用流程接口
            var currentData;
            //根据当前用户获取业务当前环节信息
            common.fetchPost('flowEngine/engineBase/currentStateInfoRequest', {
                businessId: params.businessId,
                ptCompanyId:params.ggCreateEid
            }, function (res) {
                currentData = res;

                if (res.object.errorCode === "0") {
                    var btnHtml = '';

                    var aiid = currentData.object.data.aiid;
                    var wiid = currentData.object.data.wiid;
                    var btnList = [];
                    //判断是否有操作栏
                    if (res.object.data.stateinfo && res.object.data.stateinfo.stateDoc && res.object.data.stateinfo.stateDoc.operationsAll) {
                        var a = res.object.data.stateinfo.stateDoc.operationsAll.split(';');
                        if (a.length > 0) {
                            $.map(a, function (item, index) {
                                var b = a[index].split('##');
                                if (b.length > 0) {
                                    btnList.push(b)
                                }
                            })
                        }
                        if (btnList.length > 0) {
                            $.map(btnList, function (item1, index1) {
                                btnHtml += '<li data-wiid="' + wiid + '" data-btnType="' + item1[1] + '" data-aiid="' + aiid + '" data-index="' + index1 + '" data-stateId="' + res.object.data.stateinfo.sid + '" data-stateName="' + res.object.data.stateinfo.name + '" class=" operBtn">' + item1[0] + '</li>';
                            });
                            params.elem.find('.flowStepBtn ul').append(btnHtml);
                            params.elem.show();
                        }

                    }

                } else {
                    params.elem.hide();
                    layer.msg(res.object.errorInfo)
                }

            }, function (err) {
                layer.alert(err.resultMessage, {
                    time: 3000
                });
            }, false);
        }

        if (isFlow) { //已经起草过流程
            //流程详情信息展示
            if (params.showIframe) {
                if (piid) {
                    params.showIframe.empty().html('<iframe frameborder="0" src="../../flow/flowGraphic.html?piid=' + piid + '"  style="width: 100%;height: ' + params.showIframeHeight + '"></iframe>');
                }
            }

            if (params.flowState === 0) {
                //如果当前用户和当前代办用户一样 且 当前登入用户和起草用户一样
                if (todoUserList === currentUserId && currentUserId === drafterId) {
                    //调用当前流程接口

                    currentFlowStep();
                    // 不显示测回按钮
                    params.elem.find('.destroyBtn').hide();
                    params.elem.show()

                }
            } else if (params.flowState === 1) {
                params.elem.find('.cancelPending').hide();

                if (todoUserList === currentUserId) {
                    currentFlowStep();
                    params.elem.show()
                }
                if (currentUserId === drafterId && todoUserList === drafterId) {
                    params.elem.find('.destroyBtn').hide();
                } else if (currentUserId === drafterId && todoUserList !== drafterId) {
                    params.elem.find('.destroyBtn').show();
                    params.elem.show()
                }


            } else if (params.flowState === 2) {
                //     if(｛当前登录用户｝== {办结用户})｛
                //     //显示取消办结按钮
                //     ｝
                if (currentUserId === doneUserList) {
                    params.elem.find('.cancelPending').show();
                    params.elem.show()
                }
            }

            //流程审批操作按钮
            $('.operBtn').off().on('click', function () {
                var stateId = $(this).attr('data-stateId');
                var stateName = $(this).attr('data-stateName');
                var btnIndex = $(this).attr('data-index');
                var aiid = $(this).attr('data-aiid');
                var wiid = $(this).attr('data-wiid');
                var btnType = $(this).attr('data-btnType');

                var layerHtml;

                var dataBack;

                //查询流程下一步信息 公共方法
                function transitionRequest(rejectFlag) {
                    common.fetchPost('flowEngine/engineBase/transitionRequest', {
                        businessId: params.businessId,
                        ptCompanyId: params.ggCreateEid,
                        piid: piid,
                        ptLabel: flowLabel,
                        aiid: aiid,
                        ptVersion: '1.0.0',
                        reject: rejectFlag,
                        stateId: stateId
                    }, function (res) {
                        dataBack = res;


                    }, false, false);
                }



                var area, layerTitle, rejectFlag;

                if (btnType === 'send') {//发送

                    layerHtml = common.getPageHtml('/src/page/publicTemplet/flowPanel.html');
                    area = ['700px', '630px'];
                    layerTitle = '流程环节处理';
                    rejectFlag = false;

                    //查询流程下一步信息
                    transitionRequest(rejectFlag);

                } else if (btnType === 'reject') {//回退
                    // area = ['450px'];
                    // layerHtml = '<div style="padding: 10px"><form class="layui-form form-theme-table">' +
                    //     '<div class="layui-form-item">' +
                    //     '<label class="layui-form-label">意见：</label>' +
                    //     '<div class="layui-input-block">' +
                    //     '<textarea class="layui-textarea" name="backTextarea" placeholder="请输入意见"></textarea>' +
                    //     '</div></div></form></div>';
                    area = ['700px', '630px'];
                    layerHtml = common.getPageHtml('/src/page/publicTemplet/flowPanel.html');
                    layerTitle = '回退';
                    rejectFlag = true;
                    //查询流程下一步信息
                    transitionRequest(rejectFlag);

                } else if (btnType === 'finish') {//办结
                    area = ['450px'];
                    layerHtml = '<div style="padding: 10px"><form class="layui-form form-theme-table">' +
                        '<div class="layui-form-item">' +
                        '<label class="layui-form-label">意见：</label>' +
                        '<div class="layui-input-block">' +
                        '<textarea class="layui-textarea" placeholder="请输入意见"></textarea>' +
                        '</div></div></form></div>';
                    layerTitle = '办结';

                    rejectFlag = false;
                    //查询流程下一步信息
                    transitionRequest(rejectFlag);

                } else if (btnType === 'report') { //上报

                    function reportFunc() {
                        //查询流程下一步信息
                        rejectFlag = false;
                        transitionRequest(rejectFlag);

                        if (!dataBack.object.result[0].transinfo.to) {
                            //只调用业务端的接口
                            layerTitle = '上报';

                            layerHtml = "<div style='padding: 10px'>确认上报？</div>";
                            layer.close(index);
                        } else if (dataBack.object.result[0].transinfo.to === "step0") {
                            //调用办结的接口
                            area = ['450px'];
                            layerHtml = '<div style="padding: 10px"><form class="layui-form form-theme-table">' +
                                '<div class="layui-form-item">' +
                                '<label class="layui-form-label">意见：</label>' +
                                '<div class="layui-input-block">' +
                                '<textarea class="layui-textarea" name="opinionTextarea" placeholder="请输入意见"></textarea>' +
                                '</div></div></form></div>';
                            layerTitle = '上报';

                        } else if (dataBack.object.result[0].transinfo.to !== "step0") {
                            //调用send的方法
                            layerHtml = common.getPageHtml('/src/page/publicTemplet/flowPanel.html');
                            area = ['700px', '630px'];
                            layerTitle = '流程环节处理';
                        }
                    }

                    if (params.busType === 'item') {
                        common.fetchPost(params.reportUrl, {'listId': params.reportParamData}, function (res1) {
                            if (res1.success) {
                                reportFunc();
                            } else {
                                layer.msg(res1.resultMessage, {
                                    time: 3000
                                });
                                return false;
                            }

                        }, function (err1) {
                            layer.msg(err1.resultMessage, {
                                time: 3000
                            });
                            return false;
                        }, false);
                    } else {
                        common.fetchGet(params.reportUrl, function (res1) {
                            reportFunc();
                        }, function (err1) {

                        }, false);
                    }
                }



                //查询下一步信息
                if (dataBack && dataBack.object.errorCode === '-1') {
                    layer.msg(dataBack.object.errorInfo);
                    return false;
                }

                if (!!dataBack) {
                    var currentLayer = layer.open({
                        offset: ['20px'],
                        area: area,
                        title: layerTitle,
                        type: 1,
                        shadeClose: false,
                        btnAlign: 'c',
                        btn: ['确定', '取消'],
                        content: layerHtml,
                        success: function (obj) {
                            var parent = $(obj.selector);
                            form.render('radio');
                            //常用意见导入
                            parent.find('.opinionList li').off().on('click', function (e) {
                                e.preventDefault();
                                $(this).siblings().removeClass('selected');
                                $(this).addClass('selected');
                                var text = $(this).find('span').text();
                                parent.find('[name=opinionTextarea]').val(text);
                            });
                            parent.find('.opinionList .box-close-btn').off().on('click', function () {
                                $(this).parent().remove();
                            });
                            //获取人员信息
                            var userHtml = '';
                            if (dataBack) {
                                if (dataBack.object.result.length === 1) {

                                    var userList;
                                    if (dataBack.object.result[0].data) {
                                        userList = dataBack.object.result[0].data[0].children;
                                    }


                                    if (userList && userList.length > 0) {

                                        $.map(userList, function (assignment) {
                                            var id = assignment.id;

                                            if (assignment.children && assignment.children.length > 0) {
                                                for (var i = 0; i < assignment.children.length; i++) {
                                                    userHtml += '<li style="width: 100%" userid="' + (assignment.children[i].id + '/' + id) + '" username="' + assignment.children[i].text + '">\n' +
                                                        ' <div class="item">\n' +
                                                        '<span class="checkArea">\n' +
                                                        '<i class="fa fa-circle-o"></i>\n' +
                                                        '<i class="fa fa-check-circle green"></i>\n' +
                                                        '</span>\n' +
                                                        '        <div class="userHeader">\n' +
                                                        '            <img alt="" src="../../../images/defaultHead.png">\n' +
                                                        '        </div>\n' +
                                                        '        <div class="userDes">\n' +
                                                        '            <p class="userName">' + (assignment.children[i].text ? assignment.children[i].text : '-') + '</p>\n' +
                                                        '            <p class="userText">\n' +
                                                        '                <span class="text">' + (assignment.children[i].orgName ? assignment.children[i].orgName : '-') + '</span>\n' +
                                                        '            </p>\n' +
                                                        '        </div>\n' +
                                                        '    </div>\n' +
                                                        ' </li>';
                                                }
                                            } else {
                                                userHtml += '<li style="width: 100%" userid="' + (assignment.id) + '" username="' + assignment.text + '">\n' +
                                                    ' <div class="item">\n' +
                                                    '<span class="checkArea">\n' +
                                                    '<i class="fa fa-circle-o"></i>\n' +
                                                    '<i class="fa fa-check-circle green"></i>\n' +
                                                    '</span>\n' +
                                                    '        <div class="userHeader">\n' +
                                                    '            <img alt="" src="../../../images/defaultHead.png">\n' +
                                                    '        </div>\n' +
                                                    '        <div class="userDes">\n' +
                                                    '            <p class="userName">' + (assignment.text ? assignment.text : '-') + '</p>\n' +
                                                    '            <p class="userText">\n' +
                                                    '                <span class="text">' + (assignment.orgName ? assignment.orgName : '-') + '</span>\n' +
                                                    '            </p>\n' +
                                                    '        </div>\n' +
                                                    '    </div>\n' +
                                                    ' </li>';
                                            }
                                        });
                                        parent.find('.userList ul').empty().html(userHtml);

                                        parent.find('.userList ul li').off().on('click', function () {
                                            var current = $(this);

                                            parent.find('.userList ul .item').removeClass('selected');
                                            current.find('.item').addClass('selected');
                                        });
                                    }
                                }

                                //环节信息导入

                                var result = dataBack.object.result;

                                var tacheHtml = '';

                                if (result.length > 0) {
                                    $.map(result, function (item) {

                                        var checkes = '';

                                        if (item.transinfo.defaultPath) {
                                            checkes = ' checked=""';
                                        }
                                        tacheHtml += '<li><input ' + checkes + ' name="tache" title="' + item.transinfo.name + '" type="radio" value="' + item.transinfo.stateType + '"  tacheTo="' + item.transinfo.to + '"></li>';

                                    });

                                    parent.find('.stepForm ul').empty().html(tacheHtml);
                                    form.render('radio');

                                    if (dataBack.object.result.length > 1) {

                                        // var userList;
                                        // userList=dataBack.object.result[0].data[0].children;
                                        //
                                        // if (userList && userList.length > 0) {
                                        //
                                        //     $.map(userList, function (assignment) {
                                        //
                                        //         userHtml += '<li style="width: 100%" userid="'+assignment.id+'" username="' + assignment.text + '">\n' +
                                        //             ' <div class="item">\n' +
                                        //             '<span class="checkArea">\n' +
                                        //             '<i class="fa fa-circle-o"></i>\n' +
                                        //             '<i class="fa fa-check-circle green"></i>\n' +
                                        //             '</span>\n' +
                                        //             '        <div class="userHeader">\n' +
                                        //             '            <img alt="" src="../../../images/defaultHead.png">\n' +
                                        //             '        </div>\n' +
                                        //             '        <div class="userDes">\n' +
                                        //             '            <p class="userName">' + assignment.text + '</p>\n' +
                                        //             '            <p class="userText">\n' +
                                        //             '                <span class="text">'+assignment.orgName+'</span>\n' +
                                        //             '            </p>\n' +
                                        //             '        </div>\n' +
                                        //             '    </div>\n' +
                                        //             ' </li>';
                                        //
                                        //     });
                                        //     parent.find('.userList ul').empty().html(userHtml);
                                        //
                                        //     parent.find('.userList ul li').off().on('click', function () {
                                        //         var current = $(this);
                                        //         if (current.find('.item').is('.selected')) {
                                        //             current.find('.item').removeClass('selected');
                                        //         } else {
                                        //             current.find('.item').addClass('selected');
                                        //         }
                                        //     });
                                        // }

                                    } else {


                                    }
                                }
                            }
                        },
                        yes: function (obj, layero) {
                            //选择环节必填
                            var parent = $(layero);
                            if (btnType === 'send') {
                                common.fetchPost('flowEngine/engineBase/engineStateSubmit', {
                                    "aiid": aiid,
                                    "businessId": params.businessId,
                                    "piid": piid,
                                    "wiid": wiid,
                                    "ptCompanyId": params.ggCreateEid,
                                    "ptLabel": flowLabel,
                                    "ptVersion": "1.0.0",
                                    "reject": false,
                                    "stateId": stateId,
                                    "opinion": "",
                                    "nextStates": [
                                        {
                                            "sid": parent.find('[name=tache]').attr('tacheTo'),
                                            "grade": "",//不设置
                                            "userList": [
                                                {
                                                    "text": parent.find('li .selected').parent().attr('username'),
                                                    "value": parent.find('li .selected').parent().attr('userid')
                                                }
                                            ]
                                        }
                                    ],
                                    "tinfo": {
                                        "to": parent.find('[name=tache]:checked').attr('tacheTo'),
                                        "name": parent.find('[name=tache]:checked').attr('title'),
                                        "statetype": "",//不设置
                                        "reject": false
                                    },
                                    "msginfo": {
                                        "opinion": parent.find('[name=opinionTextarea]').val(),
                                        "opinionAction": "append",
                                        "opinionid": params.businessId,
                                        "appertain": "",//不设置
                                        "opinionAvailable": "2",//不设置
                                        "opinionDialog": "1",//不设置
                                        "opinionImg": null,//不设置
                                        "opinionType": null//不设置
                                    }
                                }, function (res) {
                                    if (res.success) {
                                        //调用业务端接口

                                        common.fetchPost(params.businessUrl, {
                                            "businessId": params.businessId,
                                            flowPiid: JSON.stringify(piid),
                                            formFlowState: stateId,
                                            formFlowStateName: stateName,
                                            todoUserList: parent.find('li .selected').parent().attr('userid').split('/')[0],
                                            todoUserName: parent.find('li .selected').parent().attr('username'),
                                            flowStateId: parent.find('[name=tache]:checked').attr('tacheTo'),
                                            flowStateName: parent.find('[name=tache]:checked').attr('title'),
                                            handleOpinion: parent.find('[name=opinionTextarea]').val(),
                                            ctrlFlag: 2
                                        }, function (res1) {
                                            if (res.success) {
                                                //刷新当前页
                                                window.location.reload()
                                            } else {
                                                layer.msg(res1.resultMessage, {
                                                    time: 3000
                                                });
                                            }

                                        }, function (err1) {
                                            layer.msg(err1.resultMessage, {
                                                time: 3000
                                            });
                                        });
                                    } else {
                                        layer.alert(res.resultMessage, {
                                            time: 3000
                                        });
                                    }
                                    layer.close(currentLayer);
                                }, function (err) {
                                    layer.alert(err.resultMessage, {
                                        time: 3000
                                    });
                                    layer.close(currentLayer);
                                });
                            } else if (btnType === 'reject') {
                                common.fetchPost('flowEngine/engineBase/engineStateSubmit', {
                                    "aiid": aiid,
                                    "businessId": params.businessId,
                                    "piid": JSON.stringify(piid),
                                    "wiid": wiid,
                                    "ptCompanyId": params.ggCreateEid,
                                    "ptLabel": flowLabel,
                                    "ptVersion": "1.0.0",
                                    "reject": true,
                                    "stateId": stateId,
                                    "opinion": "",
                                    "nextStates": [{
                                        "sid": parent.find('[name=tache]').attr('tacheTo'),
                                        "grade": "",//不设置
                                        "userList": [
                                            {
                                                "text": parent.find('li .selected').parent().attr('username'),
                                                "value": parent.find('li .selected').parent().attr('userid')
                                            }
                                        ]
                                    }],
                                    "tinfo": {
                                        "to": parent.find('[name=tache]:checked').attr('tacheTo'),
                                        "name": parent.find('[name=tache]:checked').attr('title'),
                                        "statetype": "",//不设置
                                        "reject": true
                                    },
                                    "msginfo": {
                                        "opinion": parent.find('[name=opinionTextarea]').val(),
                                        "opinionAction": "append",
                                        "opinionid": params.businessId,
                                        "appertain": "",//不设置
                                        "opinionAvailable": "2",//不设置
                                        "opinionDialog": "1",//不设置
                                        "opinionImg": null,//不设置
                                        "opinionType": null//不设置
                                    }
                                }, function (res) {
                                    if (res.success) {

                                        //调用业务端接口
                                        common.fetchPost(params.businessUrl, {
                                            "businessId": params.businessId,
                                            flowPiid: JSON.stringify(piid),
                                            formFlowState: stateId,
                                            formFlowStateName: stateName,
                                            todoUserList: parent.find('li .selected').parent().attr('userid').split('/')[0],
                                            todoUserName: parent.find('li .selected').parent().attr('username'),
                                            flowStateId: parent.find('[name=tache]:checked').attr('tacheTo'),
                                            flowStateName: parent.find('[name=tache]:checked').attr('title'),
                                            handleOpinion: parent.find('[name=backTextarea]').val(),
                                            ctrlFlag: (parseInt(btnIndex) + 1)
                                        }, function (res1) {
                                            if (res.success) {
                                                //刷新当前页
                                                window.location.reload()
                                            } else {
                                                layer.msg(res1.resultMessage, {
                                                    time: 3000
                                                });
                                            }
                                        }, function (err1) {
                                            layer.msg(err1.resultMessage, {
                                                time: 3000
                                            });
                                        });
                                    } else {
                                        layer.alert(res.resultMessage, {
                                            time: 3000
                                        });
                                    }
                                    layer.close(currentLayer);
                                }, function (err) {
                                    layer.alert(err.resultMessage, {
                                        time: 3000
                                    });
                                    layer.close(currentLayer);
                                });
                            } else if (btnType === 'finish') { //办结
                                common.fetchPost('flowEngine/engineBase/engineStateSubmit', {
                                    "aiid": aiid,
                                    "businessId": params.businessId,
                                    "piid": piid,
                                    "wiid": wiid,
                                    "ptCompanyId": params.ggCreateEid,
                                    "ptLabel": flowLabel,
                                    "ptVersion": "1.0.0",
                                    "reject": false,
                                    "stateId": "step0",
                                    "opinion": "",
                                    "nextStates": [{
                                        "sid": "step0",
                                        "grade": "",
                                        "userList": [],
                                    }],
                                    "tinfo": {
                                        "to": "step0",
                                        "name": "流程结束",
                                        "statetype": "",//不设置
                                        "reject": false
                                    },
                                    "msginfo": {
                                        "opinion": parent.find('[name=opinionTextarea]').val(),
                                        "opinionAction": "append",
                                        "opinionid": params.businessId,
                                        "appertain": "",//不设置
                                        "opinionAvailable": "2",//不设置
                                        "opinionDialog": "1",//不设置
                                        "opinionImg": null,//不设置
                                        "opinionType": null//不设置
                                    }
                                }, function (res) {
                                    if (res.success) {

                                        //调用业务端接口
                                        common.fetchPost(params.businessUrl, {
                                            "businessId": params.businessId,
                                            flowPiid: JSON.stringify(piid),
                                            formFlowState: stateId,
                                            formFlowStateName: stateName,
                                            todoUserList: "",
                                            todoUserName: "",
                                            flowStateId: "step0",
                                            flowStateName: "流程办结",
                                            handleOpinion: parent.find('[name=opinionTextarea]').val(),
                                            ctrlFlag: 2
                                        }, function (res1) {
                                            if (res.success) {
                                                //刷新当前页
                                                window.location.reload()
                                            } else {
                                                layer.msg(res1.resultMessage, {
                                                    time: 3000
                                                });
                                            }

                                        }, function (err1) {
                                            layer.msg(err1.resultMessage, {
                                                time: 3000
                                            });
                                        });
                                    } else {
                                        layer.alert(res.resultMessage, {
                                            time: 3000
                                        });
                                    }
                                    layer.close(currentLayer);
                                }, function (err) {
                                    layer.alert(err.resultMessage, {
                                        time: 3000
                                    });
                                    layer.close(currentLayer);
                                });

                            } else if (btnType === 'report') {

                                if (!dataBack.object.result[0].transinfo.to) {

                                    //只调用业务端的接口
                                    common.fetchGet(params.businessUrl, function (res1) {

                                        if (res1.success) {
                                            layer.msg('上报成功', {
                                                time: 3000
                                            });
                                            //刷新当前页
                                            window.location.reload();
                                        } else {
                                            layer.msg(res1.resultMessage, {
                                                time: 3000
                                            });
                                        }
                                        layer.close(currentLayer);
                                    }, function (err1) {
                                        layer.msg(err1.resultMessage, {
                                            time: 3000
                                        });
                                        layer.close(currentLayer);
                                    });


                                } else if (dataBack.object.result[0].transinfo.to === "step0") {
                                    //调用办结的接口

                                    common.fetchPost('flowEngine/engineBase/engineStateSubmit', {
                                        "aiid": aiid,
                                        "businessId": params.businessId,
                                        "piid": piid,
                                        "wiid": wiid,
                                        "ptCompanyId": params.ggCreateEid,
                                        "ptLabel": flowLabel,
                                        "ptVersion": "1.0.0",
                                        "reject": false,
                                        "stateId": "step0",
                                        "opinion": "",
                                        "nextStates": [{
                                            "sid": "step0",
                                            "grade": "",
                                            "userList": [],
                                        }],
                                        "tinfo": {
                                            "to": "step0",
                                            "name": "流程结束",
                                            "statetype": "",//不设置
                                            "reject": false
                                        },
                                        "msginfo": {
                                            "opinion": parent.find('[name=opinionTextarea]').val(),
                                            "opinionAction": "append",
                                            "opinionid": params.businessId,
                                            "appertain": "",//不设置
                                            "opinionAvailable": "2",//不设置
                                            "opinionDialog": "1",//不设置
                                            "opinionImg": null,//不设置
                                            "opinionType": null//不设置
                                        }
                                    }, function (res) {
                                        if (res.success) {

                                            //调用业务端接口
                                            common.fetchPost(params.businessUrl, {
                                                "businessId": params.businessId,
                                                flowPiid: JSON.stringify(piid),
                                                formFlowState: stateId,
                                                formFlowStateName: stateName,
                                                todoUserList: "",
                                                todoUserName: "",
                                                flowStateId: "step0",
                                                flowStateName: "流程办结",
                                                handleOpinion: parent.find('[name=opinionTextarea]').val(),
                                                ctrlFlag: 2
                                            }, function (res1) {
                                                if (res.success) {
                                                    //刷新当前页
                                                    window.location.reload()
                                                } else {
                                                    layer.msg(res1.resultMessage, {
                                                        time: 3000
                                                    });
                                                }

                                            }, function (err1) {
                                                layer.msg(err1.resultMessage, {
                                                    time: 3000
                                                });
                                            });
                                        } else {
                                            layer.alert(res.resultMessage, {
                                                time: 3000
                                            });
                                        }
                                        layer.close(currentLayer);
                                    }, function (err) {
                                        layer.alert(err.resultMessage, {
                                            time: 3000
                                        });
                                        layer.close(currentLayer);
                                    });
                                } else if (dataBack.object.result[0].transinfo.to !== "step0") {
                                    //调用send的方法
                                    common.fetchPost('flowEngine/engineBase/engineStateSubmit', {
                                        "aiid": aiid,
                                        "businessId": params.businessId,
                                        "piid": piid,
                                        "wiid": wiid,
                                        "ptCompanyId": params.ggCreateEid,
                                        "ptLabel": flowLabel,
                                        "ptVersion": "1.0.0",
                                        "reject": false,
                                        "stateId": stateId,
                                        "opinion": "",
                                        "nextStates": [
                                            {
                                                "sid": parent.find('[name=tache]').attr('tacheTo'),
                                                "grade": "",//不设置
                                                "userList": [
                                                    {
                                                        "text": parent.find('li .selected').parent().attr('username'),
                                                        "value": parent.find('li .selected').parent().attr('userid')
                                                    }
                                                ]
                                            }
                                        ],
                                        "tinfo": {
                                            "to": parent.find('[name=tache]:checked').attr('tacheTo'),
                                            "name": parent.find('[name=tache]:checked').attr('title'),
                                            "statetype": "",//不设置
                                            "reject": false
                                        },
                                        "msginfo": {
                                            "opinion": parent.find('[name=opinionTextarea]').val(),
                                            "opinionAction": "append",
                                            "opinionid": params.businessId,
                                            "appertain": "",//不设置
                                            "opinionAvailable": "2",//不设置
                                            "opinionDialog": "1",//不设置
                                            "opinionImg": null,//不设置
                                            "opinionType": null//不设置
                                        }
                                    }, function (res) {
                                        if (res.success) {
                                            //调用业务端接口
                                            common.fetchPost(params.businessUrl, {
                                                "businessId": params.businessId,
                                                flowPiid: JSON.stringify(piid),
                                                formFlowState: stateId,
                                                formFlowStateName: stateName,
                                                todoUserList: parent.find('li .selected').parent().attr('userid').split('/')[0],
                                                todoUserName: parent.find('li .selected').parent().attr('username'),
                                                flowStateId: parent.find('[name=tache]:checked').attr('tacheTo'),
                                                flowStateName: parent.find('[name=tache]:checked').attr('title'),
                                                handleOpinion: parent.find('[name=opinionTextarea]').val(),
                                                ctrlFlag: 2
                                            }, function (res1) {
                                                if (res.success) {
                                                    //刷新当前页
                                                    window.location.reload()
                                                } else {
                                                    layer.msg(res1.resultMessage, {
                                                        time: 3000
                                                    });
                                                }

                                            }, function (err1) {
                                                layer.msg(err1.resultMessage, {
                                                    time: 3000
                                                });
                                            });
                                        } else {
                                            layer.alert(res.resultMessage, {
                                                time: 3000
                                            });
                                        }
                                        layer.close(currentLayer);
                                    }, function (err) {
                                        layer.alert(err.resultMessage, {
                                            time: 3000
                                        });
                                        layer.close(currentLayer);
                                    });
                                }
                            }
                        }
                    });
                }



            });


            //取消办结
            $('.cancelPending').off().on('click', function () {
                layer.confirm('取消办结？', {icon: 3, title: '提示', offset: '150px'}, function (index) {
                    common.fetchPost('flowEngine/engineBase/engineCancelEndSubmit', {
                        "piid": piid,
                        "businessId": params.businessId,
                        catalogueId: params.busType
                    }, function (res) {
                        if (res.success) {
                            common.fetchPost(params.businessUrl, {
                                "businessId": params.businessId,
                                flowPiid: JSON.stringify(piid),
                                formFlowState: "step0",
                                formFlowStateName:'流程办结',
                                todoUserList: res.object.workItem.handlerUserInfo.split('/')[0],
                                todoUserName: res.object.workItem.handlerName,
                                handleOpinion: '',
                                flowStateId: res.object.workItem.stateId,
                                flowStateName: res.object.workItem.stateName,
                                ctrlFlag: 4
                            }, function (res1) {
                                if (res.success) {
                                    //刷新当前页
                                    window.location.reload()
                                } else {
                                    layer.msg(res1.resultMessage, {
                                        time: 3000
                                    });
                                }

                            }, function (err1) {
                                layer.msg(err1.resultMessage, {
                                    time: 3000
                                });
                            });

                            layer.close(index);
                        }
                    });
                });
            });

            //测回按钮
            $('.destroyBtn').off().on('click', function () {
                layer.confirm('确定撤回？', {icon: 3, title: '提示', offset: '150px'}, function (index) {
                    common.fetchGet('flowEngine/engineBase/engineCancelByDrafter?piid=' + piid, function (res) {
                        if (res.success) {
                            common.fetchPost(params.businessUrl, {
                                "businessId": params.businessId,
                                flowPiid: JSON.stringify(piid),
                                formFlowState: "",
                                formFlowStateName:"",
                                todoUserList: res.list[0].workitem.handlerUserInfo.split('/')[0],
                                todoUserName: res.list[0].workitem.handlerName,
                                handleOpinion: '',
                                flowStateId: res.list[0].workitem.stateId,
                                flowStateName: res.list[0].workitem.stateName,
                                ctrlFlag: 3
                            }, function (res1) {
                                if (res.success) {
                                    //刷新当前页
                                    window.location.reload()
                                } else {
                                    layer.msg(res1.resultMessage, {
                                        time: 3000
                                    });
                                }
                            }, function (err1) {
                                layer.msg(err1.resultMessage, {
                                    time: 3000
                                });
                            });

                            layer.close(index);
                        }
                    });
                });
            });
        } else {
            //没有该流程
            params.elem.hide();
            return false;
        }
    };
    //获取清单流程权限
    Common.prototype.getItemListEngine=function(){
        var flag=false;
        common.fetchGet('sascatalog/tiolItemList/getItemListEngine',function (res) {
            if (res.object) {
                flag = ((res.object == '1') ? true : false);
            }
        },null,false);
        return flag;
    };
    //获取系统流程权限
    Common.prototype.getSystemFlowAccess = function () {
        //todo: 获取流程权限 暂时本地存储
        var enableFlowEngine;
        common.fetchGet('config.json', function (res) {
            enableFlowEngine = res.enableFlowEngine
        }, false, false);
        return enableFlowEngine;
    };
    Common.prototype.publicConfig = function () {
        var cofigV;
        common.fetchGet('config.json', function (res) {
            cofigV = res
        }, false, false);
        return cofigV;
    };
    // indexOf兼容性问题封装方法解决
    Common.prototype.indexOf = function (arr, value) {
        for(var i=0;i<arr.length;i++){
            if(arr[i]===value){
                return i;
            }
        }
        return -1;
    };
    // Common.prototype.indexOf = function (arr, value) { //value string或array类型 如果是其他类型再写判断或转
    //     if(typeof arr === 'string'){
    //         var newArr=arr.split(value);
    //         if(newArr.length>1){
    //             return newArr[0].length
    //         }
    //         else{
    //             return -1
    //         }

    //     }
    //     else{//array
    //         for(var i=0;i<arr.length;i++){
    //             if(arr[i]===value){
    //                 return i;
    //             }
    //         }
    //         return -1;
    //     }
    // };
    // indexOf兼容性问题封装方法解决
    Common.prototype.ArrayIndexOf = function (arr,value) {
        for(var i=0;i<arr.length;i++){
            if(arr[i]===value){
                return i;
            }
        }
        return -1;
    };
    // lastIndexOf兼容性问题封装方法解决
    Common.prototype.ArrayLastIndexOf = function (arr,value) {
        var len=arr.length;
        for(var i=len;i>=0;i--){
            if(this[i]===value){
                return len-i;
            }
        }
        return -1;
    };

    //echart resize
    //....

    var common = new Common();

    exports('common', common);
});
