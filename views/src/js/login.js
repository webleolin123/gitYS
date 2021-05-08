layui.config({
    base: './src/js/',
    version: new Date().getTime()
}).define(['layer', 'common'], function (exports) {
    var layer = layui.layer;
    var common = layui.common;
    var imgUrl = "../../src/images/login/";
    var IcoUrl = "../../src/images/";
    var defaultParams = {
        "ico": "favicon",
        // "logo": "91110000100024915R",
        "titleName": "国资国委信息管理系统",
        "primaryColor": "primary",
        "isVerify": false,
        "tipName": "上网不涉密，涉密不上网",
        "theme": "4",
        "copyRight": "Copyright   © 2018-2019"
    };
    var login = {
        useImg: function (isDefault, img, imgUrl) {
            //img,imgUrl加前缀了
            var useImg = "";
            if (isDefault) {
                if (img) {
                    useImg = img;
                }
            } else {
                if (imgUrl) {
                    useImg = imgUrl;
                }
            }

            return useImg;
        },
        view: function (data) {
            data = data || {};
            var params = $.extend({}, defaultParams, data);

            //标题名称 logo ico 设置
            document.title = params.titleName;
            $('.favicon').attr('href', './src/images/ico/' + params.ico + '.ico');

            if (!!params.logo && params.logo!=='""') {
                $('.login-title img').attr('src', 'src/images/logo/' + params.logo + '.png');
            } else {
                $('.login-title img').hide()
            }

            $('.login-title span').html(params.titleName);

            //版权纤细
            if (params.copyRight && params.copyRight !== '""') {
                $('#footerText p').html(params.copyRight);
            }


            //主题色设置
            if (params.primaryColor === 'primary') {
                params.primaryColor = 'rgb(0, 82, 142)'
            } else if (params.primaryColor === 'red') {
                params.primaryColor = 'rgb(175, 0, 1)';

            } else if (params.primaryColor === 'green') {
                params.primaryColor = '#20d37f'
            } else if (params.primaryColor === 'gray') {
                params.primaryColor = 'gray';
            }

            // params.theme="6";

            //获取url 单独配置信息
            var urlTheme = common.getQueryVariable('theme');
            if (urlTheme) {
                params.theme = urlTheme;
            }
            if (params.theme == "1") {

                if (!!params.theme1Color && params.theme1Color !== '""') {
                    $('.login-box-wrap').css('backgroundColor', 'transparent');

                } else {
                    $('.login-box-wrap').css('backgroundColor', params.primaryColor);

                    $('.login-box-title').css('color', params.primaryColor);
                }

                if (!!params.theme1Bg && params.theme1Bg !== '""') {
                    $('body').css('backgroundColor', 'transparent');
                    $('.bg').hide();
                    // theme1LeftBg
                    $('.login-box-left').hide();
                    $('body').css({
                        background: 'transparent url(../../src/images/login/loginBg/' + params.theme1Bg + ') no-repeat scroll center top',
                        'background-size': 'cover'
                    });
                    $('.footer').css({
                        'width': '60%',
                        "margin-top": '200px'
                    });
                    $('.login-title span').css({
                        'font-size': '50px'
                    });
                    $('.login-title').css({
                        'padding-top': 0,
                        position: 'absolute',
                        width: '50%',
                        top: '30%',
                        left: '10%',
                        'line-height': '60px'
                    });
                } else {
                    $('body').css('backgroundColor', params.primaryColor);
                }

                if (!!params.theme1LeftBg && params.theme1LeftBg !== '""') {
                    $('.login-box-left').css({
                        'background-image': 'url(../../src/images/login/loginBg/' + params.theme1LeftBg + ')'
                    });
                    $('.login-box-left').show();
                    $('.bg').hide();
                }


                //是否开启自定义 背景图片，副标题，背景色

                $('.theme1').fadeIn();
                $('.theme1').siblings().remove();
            } else if (params.theme == "2") {
                $('.theme2').fadeIn();
                $('.theme2').siblings().remove();
            } else if (params.theme == "3") {
                $('.theme3').fadeIn();
                $('.theme3').siblings().remove();
            } else if (params.theme == "4") {
                $('.theme4').fadeIn();
                $('.theme4').siblings().remove();
            } else if (params.theme == "5") {
                $('.theme5').fadeIn();
                $('.theme5').siblings().remove();
            } else if (params.theme == "6") {
                $('.theme6').fadeIn();
                $('.theme6').siblings().remove();
            }else if (params.theme == "7") {
                $('.theme7').fadeIn();
                $('.theme7').siblings().remove();
            }
            if (!!params.theme1CopyrightLogo && params.theme1CopyrightLogo !== '""') {
                if (params.theme1CopyrightLogo && params.theme1CopyrightLogo !== 'null') {
                    $('.footer img').attr('src', 'src/images/logo/' + params.theme1CopyrightLogo + '.png');
                }

                $('.footer img').show();
            }

            //是否验证
            if (!params.isVerify) {
                $('.yzm').hide();
                $('.verifyArea').hide();
                $(".txtidcode").val('不验证');
                if (params.theme == "5") {
                    $(".login-group-wrap").css("textAlign", "center").append('<p style="color: red;font-size: 25px;width: 320px;background: white;margin-left: -45px;height: 40px;">' + params.tipName + '<p/>');
                } else {
                    $(".login-group-wrap").css("textAlign", "center").append('<p style="color:red;font-size:25px;">' + params.tipName + '<p/>');
                }

                //是否有警告信息
                if (params.isAlert === 'no') {
                    $('.alertArea').hide();
                }

            } else {
                $('.login-group-wrap').show();
            }


            login.getReg();
        },
        render: function () {

            //获取url 单独配置信息
            var urlCompId = common.getQueryVariable('compId');
            var layerLoader = common.layerLoader();
            if (urlCompId) {
                try {
                    //todo: 修改url

                    common.fetchGet('compmgr/webComponent/getTopComponentByTypeAndCompId?type=loginPage&compId=' + urlCompId,
                        function (res) { //请求属性接口后 返回响应属性值 重新拼接所需对象
                            layer.close(layerLoader);
                            var data = res.list[0].prop;
                            login.view(data);
                            $('body').fadeIn();
                            $('body').css('opacity', '1');
                        },
                        function (err) {
                            layer.close(layerLoader);
                            if (err.resultMessage) {
                                layer.alert(err.resultMessage);
                            } else {
                                layer.msg('登入组件请求出错');
                            }
                            login.view();
                            $('body').fadeIn();
                            $('body').css('opacity', '1');
                        }
                    );
                } catch (e) {
                    layer.close(layerLoader);
                    layer.msg('登录配置引入出错,请联系系统管理员');
                }
            } else {
                try {
                    common.fetchPost('compmgr/webComponent/loginPageComponent?type=loginPage', null,
                        function (res) { //请求属性接口后 返回响应属性值 重新拼接所需对象
                            layer.close(layerLoader);
                            var data = res.list[0].prop;
                            login.view(data);
                            $('body').fadeIn();
                            $('body').css('opacity', '1');
                        },
                        function (err) {
                            layer.close(layerLoader);
                            if (err.resultMessage) {
                                layer.alert(err.resultMessage);
                            } else {
                                layer.msg('登入组件请求错误');
                            }
                            login.view();
                            $('body').fadeIn();
                            $('body').css('opacity', '1');
                        }
                    );
                } catch (e) {
                    layer.close(layerLoader);
                    layer.msg('登录配置引入出错,请联系系统管理员');
                }
            }
            //单点登入
            if (common.getQueryVariable('ZF-TOKEN')) {

                var data = {
                    'ZF-TOKEN': common.getQueryVariable('ZF-TOKEN')
                };
                common.fetchPost('login/', data,
                    function (res) {
                        var isSuccess = res.success;
                        // layer.alert(res.resultMessage);
                        if (res.resultMessage) {
                            layer.alert(res.resultMessage);
                        } else {
                            layer.msg('登录成功!');
                        }
                        if (isSuccess) {
                            common.setCookie('ZF-TOKEN', common.getQueryVariable('ZF-TOKEN'));
                            common.setCookie('userInfo', JSON.stringify({
                                roleIds: res.object.roleIds,
                                seId: res.object.seId,
                                soId: res.object.soId,
                                seName: res.object.seName,
                                seType: res.object.seType,
                                suId: res.object.suId,
                                suLoginCode: res.object.suLoginCode,
                                suName: res.object.suName,
                                suType: res.object.suType,
                                suIsUpdatepwd: res.object.suIsUpdatepwd,
                                currEnterpriseVo: {
                                    seComcode: res.object.currEnterpriseVo.seComcode,
                                    seEnName: res.object.currEnterpriseVo.seEnName,
                                    seType: res.object.currEnterpriseVo.seType,
                                    seUnitcode: res.object.currEnterpriseVo.seUnitcode,
                                    seAreaId: res.object.currEnterpriseVo.seAreaId,
                                    seShortName: res.object.currEnterpriseVo.seShortName,
                                    seId: res.object.currEnterpriseVo.seId,
                                    sePid: res.object.currEnterpriseVo.sePid,
                                    seLevel: res.object.currEnterpriseVo.seLevel
                                }
                            }));
                            location.href = "./index.html";
                        }
                    },
                    function (err) {

                    }
                );
            }

        },
        //页面初始后执行的事件
        load: function () {
            var getCookieVal = common.getCookie('ZF-TOKEN');
            if (getCookieVal) { //访问登录页 如果有JSESSIONID 清空对应cookie 及localStorage

                common.setCookie('ZF-TOKEN', "", -1);
                // window.localStorage.clear();
                common.setCookie('userInfo', "", -1);
            }
        },
        // 页面元素绑定事件监听
        domEvent: function () {
            //解开禁用
            $('.dlButtonId').attr("disabled", false);
            $('.txtidcode').attr("disabled", false);
            //刷新验证码
            $('.reg').off().click(function () {
                login.getReg();
            });
            //登录
            $('.dlButtonId').off().click(function () {
                login.reqLogin();
            });
            //form 表单input元素 键盘事件监听
            $('form.loginForm input').on('keypress', function (e) {
                if (e.keyCode == '13') { //回车键 13
                    login.reqLogin();
                }
            });
        },
        getReg: function () {
            common.fetchGet('sysmgr/servlet/regCode', function (data) {
                    var obj = data.object;
                    var regCodeImage = obj.regCodeImage;
                    document.getElementById('reg').setAttribute('src', 'data:image/png;base64,' + regCodeImage);
                },
                function (err) {
                    if (err.resultCode == "-1") {
                        layer.msg('验证码请求出错啦,请联系系统管理员!');
                    } else {
                        if (err.resultMessage) {
                            layer.alert(err.resultMessage);
                        } else {
                            layer.msg('验证码请求错误');
                        }
                        // layer.alert(err.resultMessage);
                    }
                    $('.dlButtonId').attr("disabled", "disabled");
                    $('.txtidcode').attr("disabled", "disabled");
                    //form 表单input元素 键盘事件监听
                    $('form.loginForm input').on('keypress', function (e) {
                        if (e.keyCode == '13') { //回车键 13
                            location.href = "./login.html";
                        }
                    });

                    return false
                });
        },
        encrypt: function (data) {
            var key = CryptoJS.enc.Latin1.parse('zefu20190321java');
            var iv = CryptoJS.enc.Latin1.parse('zefu20190321java');
            return CryptoJS.AES.encrypt(data, key, {
                iv: iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.ZeroPadding
            }).toString();
        },

        reqLogin: function () {
            var index = layer.load(2, {
                shade: [0.8, '#393D49']
            });
            var loginName = $(".suLoginname").val();
            var loginPwd = $(".suPwd").val();
            //可能有验证码  captchadata captchakey 等数据，这里省略，只关注重点部分
            $(".hideSuLoginname").val(login.encrypt(loginName));
            $(".hideSuPwd").val(login.encrypt(loginPwd));

            //单点登入
            var data;
            if (common.getQueryVariable('ZF-TOKEN')) {
                common.setCookie('ZF-TOKEN', common.getQueryVariable('ZF-TOKEN'));
                data = {
                    'ZF-TOKEN': common.getQueryVariable('ZF-TOKEN')
                };
            } else {
                data = {
                    loginCode: $(".hideSuLoginname").val(),
                    loginPwd: $(".hideSuPwd").val(),
                    txtIdCode: $(".txtidcode").val()
                };
            }

            common.fetchPost('login/', data,
                function (res) {
                    layer.close(index);
                    var isSuccess = res.success;
                    // layer.alert(res.resultMessage);
                    if (res.resultMessage) {
                        layer.msg(res.resultMessage);
                    } else {
                        layer.msg('登录成功!');
                    }
                    if (isSuccess) {
                        common.setCookie('userInfo', JSON.stringify({
                            roleIds: res.object.roleIds,
                            seId: res.object.seId,
                            soId: res.object.soId,
                            seName: res.object.seName,
                            seType: res.object.seType,
                            suId: res.object.suId,
                            suLoginCode: res.object.suLoginCode,
                            suName: res.object.suName,
                            suType: res.object.suType,
                            suIsUpdatepwd: res.object.suIsUpdatepwd,
                            currEnterpriseVo: {
                                seComcode: res.object.currEnterpriseVo.seComcode,
                                seEnName: res.object.currEnterpriseVo.seEnName,
                                seType: res.object.currEnterpriseVo.seType,
                                seUnitcode: res.object.currEnterpriseVo.seUnitcode,
                                seAreaId: res.object.currEnterpriseVo.seAreaId,
                                seShortName: res.object.currEnterpriseVo.seShortName,
                                seId: res.object.currEnterpriseVo.seId,
                                sePid: res.object.currEnterpriseVo.sePid,
                                seLevel: res.object.currEnterpriseVo.seLevel
                            }
                        }));
                        location.href = "./index.html";
                    }
                },
                function (err) {

                }
            );
        },
        output: function () {
            // 加载登录页配置
            login.render();
            //页面初始执行事件
            login.load();
            //dom 事件
            login.domEvent();
        }
    };

    exports('login', login);
});
