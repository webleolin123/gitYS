layui.config({
    base: './src/js/',
    version: new Date().getTime()
}).define(['layer', 'eleTree', 'element', 'table', 'common', 'colorpicker', 'form', 'jquery'], function (exports) {
    var colorpicker = layui.colorpicker;
    var layer = layui.layer;
    var table = layui.table;
    var form = layui.form;
    var tree = layui.eleTree;
    var element = layui.element;
    var common = layui.common;
    var $ = layui.jquery;
    var baseUrl = '../../../';
    var mainUrl;

    var imgUrl = "../../src/images/login/";
    var IcoUrl = "../../src/images/";

    var dataAccessMenuMap = {};
    var menuDataMap = {};

    var isFlowAccess = common.getSystemFlowAccess();

    var dom = {
        indexLayout: $('#indexLayout')
    };

    var params = {}; //导航配置全局变量声明
    var userInfo;
    //暂定标识符
    var tabMenuMethod;

    var index = {
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
        navClick: function (ele) {
            $('.newIframeFixed').remove();
            var navA = $(ele);
            var url = '';
            url = navA.attr('data-url');
            // var text = navA.attr('data-text');
            var text = navA.context.innerHTML;
            if (!url) {
                return;
            }
            var id;
            if (!navA.attr('data-compId')) { //替换所有/
                // id=url.replace('/','-');
                id = url.replace(/\//g, '-');
            } else {
                // id=url.replace('/','-')+navA.attr("data-compId");
                id = url.replace(/\//g, '-') + navA.attr("data-compId");
            }

            if (tabMenuMethod) {//选项卡

                try {
                    //排除主页的输入
                    if (id === 'main') {
                        element.tabChange('tab', 'main');
                        return;
                    }
                    var isActive = $('.main-layout-tab .layui-tab-title').find('li[lay-id=' + id + ']');

                    if (isActive.length > 0) {
                        element.tabChange('tab', id);
                    } else {
                        url = 'src/page/' + url + '.html';
                        element.tabAdd('tab', {
                            title: text,
                            content: '<iframe src="' + url + '" name="iframe' + id + '" data-smId="' + navA.attr('data-smId') + '" class="iframe" frameborder="0" border="0" data-compId="' + navA.attr('data-compId') + '" id="' + id + '" data-id="' + id + '" scrolling="auto" width="100%"  height="100%"></iframe>',
                            id: id,
                            success: function () {
                                $('#currentMenuCompId').val(navA.attr('data-compId'));
                                $('#currentMenuSmId').val(navA.attr('data-smId'));
                                var iframes = $('iframe.iframe');
                                for (var i = 0; i < iframes.length; i++) {
                                    iframes[i].contentWindow.postMessage(params.primaryColor, '*'); //向子iframe传输主体颜色的信息
                                }
                            }
                        });
                        element.tabChange('tab', id);
                    }
                    dom.indexLayout.removeClass('hide-side');
                } catch (e) {
                    layer.msg('菜单链接出错，请重新绑定菜单');
                }
            } else { //面包屑
                try {
                    //获取tab的点击项 拼接面包屑
                    var menuBread = $('.layui-breadcrumb-custom');
                    var menuListStr;
                    //加载面板
                    var menuContent = $('#menuContent');
                    $('.menuContentMark').show();

                    if (url !== 'main' && url.indexOf('main/') < 0) {

                        if (mainUrl) {
                            menuListStr = '<a class="fNodeMenu" href="javascript:;" title="首页" id="mainPage" data-compId="" data-url="' + mainUrl + '"  data-text="首页"> <i class="layui-icon layui-icon-home" style="display:inline-block;width:18px;margin:0px 5px 0px 0px;"></i>首页</a>';

                        } else {
                            menuListStr = '<a class="fNodeMenu" href="javascript:;" title="首页" id="mainPage" data-compId="" data-url="error/defaultMain"  data-text="首页"> <i class="layui-icon layui-icon-home" style="display:inline-block;width:18px;margin:0px 5px 0px 0px;"></i>首页</a>';

                        }

                    } else {

                        menuBread.empty().html('<a class="fNodeMenu" href="javascript:;" title="首页" id="mainPage" data-compId="" data-url="' + url + '"  data-text="首页"> <i class="layui-icon layui-icon-home" style="display:inline-block;width:18px;margin:0px 5px 0px 0px;"></i>首页</a>');
                        $('#currentMenuCompId').val(navA.attr('data-compId'));
                        $('#currentMenuSmId').val(navA.attr('data-smId'));

                        index.errorFunc('./src/page/' + url + '.html', function () {


                            menuContent.empty().html('  <iframe class="iframe" frameborder="0" border="0" height="100%" id="main" name="iframe" scrolling="auto" src="./src/page/' + url + '.html" width="100%"></iframe>');
                        });


                        return false;
                    }

                    //当前节点
                    if (navA.parent().parent().prev().parent().parent().prev().parent().parent().prev()[0]) {
                        menuListStr += '<span lay-separator=""> / </span>';
                        if (!!navA.parent().parent().prev().parent().parent().prev().parent().parent().prev().attr('data-url')) {
                            menuListStr += navA.parent().parent().prev().parent().parent().prev().parent().parent().prev()[0].outerHTML; //第四级
                        } else {
                            menuListStr += '<div class="menuDisabled">' + navA.parent().parent().prev().parent().parent().prev().parent().parent().prev()[0].outerHTML + '</div>'; //第四级
                        }

                    }

                    if (navA.parent().parent().prev().parent().parent().prev()[0]) {
                        menuListStr += '<span lay-separator=""> / </span>';
                        if (!!navA.parent().parent().prev().parent().parent().prev().attr('data-url')) {
                            menuListStr += navA.parent().parent().prev().parent().parent().prev()[0].outerHTML; //第三级
                        } else {
                            menuListStr += '<div class="menuDisabled">' + navA.parent().parent().prev().parent().parent().prev()[0].outerHTML + '</div>'; //第三级
                        }

                    }

                    if (navA.parent().parent().prev()[0]) {
                        menuListStr += '<span lay-separator=""> / </span>';
                        if (!!navA.parent().parent().prev().attr('data-url')) {
                            menuListStr += navA.parent().parent().prev()[0].outerHTML; //第二级
                        } else {
                            menuListStr += '<div class="menuDisabled">' + navA.parent().parent().prev()[0].outerHTML + '</div>'; //第二级
                        }
                    }

                    if (navA[0]) {
                        menuListStr += '<span lay-separator=""> / </span>';
                        menuListStr += navA[0].outerHTML; //当前级别
                    }
                    menuListStr += '<div class="primary breadRocket" style="display: inline-block;padding-left: 10px;cursor: pointer;position: relative"><i class=" fa fa-rocket"></i><span style="display: none;left: 30px;top: 5px;" class="globalTip">新页打开</span></div>';

                    menuBread.empty().html(menuListStr);

                    $('.breadRocket').off().on('click', function () {
                        var currentDom = $(this).prev();
                        var nw;

                        //加入 smId  菜单id信息
                        var menuId = '&menuId=' + currentDom.attr('data-smid');
                        if (currentDom.attr('data-url').indexOf('custom') > -1) {
                            nw = window.open(window.location.origin + '/src/page/custom/custom.html?' + currentDom.attr('data-compid') + '&menuId=' + currentDom.attr('data-smid'));
                        } else {
                            nw = window.open(window.location.origin + '/src/page/' + currentDom.attr('data-url') + '.html' + '?menuId=' + currentDom.attr('data-smid'));
                        }
                        setTimeout(function () {
                            nw.document.title = currentDom.attr('data-text');
                        }, 600);
                    }).on('mouseover', function () {
                        $(this).find('span.globalTip').show();


                    }).on('mouseout', function () {
                        $(this).find('span.globalTip').hide();
                    });


                    $('#currentMenuCompId').val(navA.attr('data-compId'));
                    $('#currentMenuSmId').val(navA.attr('data-smId'));

                    var iframeDom = $('.iframe')[0].contentWindow.document.readyState;
                    menuContent.empty().html('<iframe src="./src/page/' + url + '.html" name="iframe' + id + '" data-smId="' + navA.attr('data-smId') + '" class="iframe" frameborder="0" border="0" data-compId="' + navA.attr('data-compId') + '" id="' + id + '" data-id="' + id + '" scrolling="auto" width="100%"  height="100%"></iframe>');

                    index.errorFunc($('.iframe').attr('src'), function () {
                    });



                    $(document).off('click', '.layui-breadcrumb-custom a');
                    $(document).on('click', '.layui-breadcrumb-custom a', function () {

                        if (!$(this).is('.newIframeFixedDom')) {
                            $('.newIframeFixed').remove();
                        }


                        if ($(this).parent().is('.menuDisabled')) {
                            return false;
                        }

                        /*    $('.menuContentMark').show();

                            if (!!$(this).attr('data-url') && $(this).attr('data-url').indexOf('main') > -1) {
                                var html1 = $('#breadcrumb-custom').find('a')[0].outerHTML;
                                $('#breadcrumb-custom').empty().html(html1);
                            }
                            menuContent.empty().html('<iframe src="./src/page/' + $(this).attr('data-url') + '.html" name="iframe' + id + '" data-smId="' + navA.attr('data-smId') + '" class="iframe" frameborder="0" border="0" data-compId="' + navA.attr('data-compId') + '" id="' + id + '" data-id="' + id + '" scrolling="auto" width="100%"  height="100%"></iframe>');

                            index.errorFunc('./src/page/' + $(this).attr('data-url') + '.html', function () {

                            });
                            setTimeout(function () {
                                $('.menuContentMark').fadeOut();
                            }, 600);*/

                        // index.dataAccess();

                        //触发按钮上的菜单点击

                        if ($(this).attr('id') === 'mainPage') {
                            $('#breadcrumb-custom').html($('#breadcrumb-custom').find('a').eq(0).prop('outerHTML'));
                            menuContent.empty().html('<iframe src="./src/page/' + $(this).attr('data-url') + '.html" name="iframe' + id + '" data-smId="' + navA.attr('data-smId') + '" class="iframe" frameborder="0" border="0" data-compId="' + navA.attr('data-compId') + '" id="' + id + '" data-id="' + id + '" scrolling="auto" width="100%"  height="100%"></iframe>');

                            //todo 点击首页的时候 如果没有 数据权限,需要清除数据权限信息
                        }
                        $('.leftMenuList').find('[data-smid=' + $(this).attr('data-smid') + ']').trigger('click');
                        $('.customTabList li').eq(0).trigger('click');

                    });


                } catch (e) {
                    layer.msg('菜单链接出错，请重新绑定菜单');
                }
            }

        },
        errorFunc: function (url, successback) {

            $.ajax({
                url: url,
                type: 'GET',
                success: function (data) {

                    if (successback) {
                        successback();
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {

                    $('#menuContent').empty().html('<iframe src="./src/page/error/404.html"  class="iframe" frameborder="0" border="0"  scrolling="auto" width="100%"  height="100%"></iframe>');
                }
            });

        },
        navView: function (data) {
            //导航默认配置全局变量声明
            var defaultParams = {
                "sysTitleSet": {
                    "logo": '91110000100024915R',
                    "name": "",
                    "ico": "favicon",
                    "logOutArea": "in",
                    "themeSetShow": "yes"
                },
                "sysTipsSet": {
                    "theme": 1,
                    "name": "信息管理系统"
                },
                "menuTheme": "dark",
                "primaryColor": "primary",
                "multiMenu": true,
                "defaultClose": true
            };

            params = $.extend({}, defaultParams, data);

            //nav module set
            if (params.navModule === 'ccordion') {
                $('.navModuleCcordion').show();
                $('.navModuleTab').remove();

                //设置导航的高度问题，
                $('.layui-side-scroll').css('height', ($(window).height() - 130) + 'px');
                $('.unitSelection').css('height', ($(window).height() - 150) + 'px');
            } else if (params.navModule === 'tab') {
                $('.navModuleTab').show();
                $('.navModuleCcordion').remove();
                //设置导航的高度问题，
                $('.layui-side-scroll').css('height', ($(window).height() - 95) + 'px');

                $('.unitSelection .ele4').css('height', ($(window).height() - 120) + 'px');
                var menuTabBox = $('.menuTabBox');
                menuTabBox.find('.customTabList li').off().on('click', function () {

                    var _this = $(this);
                    _this.siblings().removeClass('selected');
                    _this.addClass('selected');
                    var customTabContent = $('[data-customTabContent=' + _this.attr('data-customTabList') + ']');
                    customTabContent.siblings().removeClass('selected');
                    customTabContent.addClass('selected');
                });
            }

            //菜单伸缩设置
            index.menuSlide(!params.defaultClose);
            $('#logoHeader img').attr({
                // "src": params.sysTitleSet.logo ? 'src/images/logo/' + params.sysTitleSet.logo + '.png' : 'src/images/logo/szyd.png'
                "src": params.sysTitleSet.logo ? 'src/images/logo/' + params.sysTitleSet.logo + '.png' : 'src/images/logo/empty.png'
            });

            $('#logoHeader span').text(params.sysTitleSet.name);
            document.title = params.sysTitleSet.name;
            $('.favicon').attr('href', 'src/images/ico/' + params.sysTitleSet.ico + '.ico');

            if (!params.sysTitleSet.logOutArea) {
                params.sysTitleSet.logOutArea = "out";
            }

            $('[login-area=' + params.sysTitleSet.logOutArea + ']').show();

            if (!params.sysTitleSet.themeSetShow || params.sysTitleSet.themeSetShow === 'yes') {
                $('#themeConfig').show()
            } else {
                $('#themeConfig').hide()
            }

            if (params.sysTitleSet.subTitleOpen === "1") {

                var subTitleName;
                if (params.sysTitleSet.subTitleType === "1") {
                    subTitleName = userInfo.currEnterpriseVo.seShortName;
                } else {
                    subTitleName = userInfo.seName;
                }

                if (params.sysTitleSet.subTitleArea === "1") {
                    if (subTitleName) {
                        $('#logoHeader b').html(subTitleName + '  ');
                    }
                    else {
                        $('#logoHeader b').html('  ');
                    }
                } else {
                    if (subTitleName) {
                        $("#suName").append('【' + subTitleName + '】');
                    }
                    else {
                        $("#suName").append('【 】');
                    }
                }
            }

            //子导航栏配置
            if (params.tabMenuMethod) {
                tabMenuMethod = true;
                $('.tabBreadcrumb').show();
                $('.menuBreadcrumb').hide();
            } else {
                tabMenuMethod = false;
                $('.menuBreadcrumb').show();
                $('.tabBreadcrumb').hide();
            }
            //导航点击监听
            element.on('nav(leftNav)', function (ele) {
                index.navClick(ele);
                //数据权限的导入
                index.dataAccess(ele);

            });
            $(document).on('click', '.menuDisabled', function () {
                return false;
            });
            $(document).on('click', '.sNodeMenu', function () {

                $(this).parent().siblings().removeClass('layui-nav-itemed');

            });
            $(document).on('click', '.fNodeMenu', function () {
                if ($(this).parent().is('.menuDisabled')) {
                    return false;
                }
                $(this).parent().siblings().removeClass('layui-nav-itemed');
            });


            //是否开启弱色风格
            if (params.themeInvert) {
                $('#pageTop').addClass('themeInvert');
                $('.index-leftSide').addClass('themeInvert');
                $('.index-rightSide').addClass('themeInvert');
            } else {
                $('#pageTop').removeClass('themeInvert');
                $('.index-leftSide').removeClass('themeInvert');
            }


            //菜单风格设置
            window.document.documentElement.setAttribute("menuTheme", params.menuTheme);
            $('html').attr('menuTheme', params.menuTheme);
            $('html').attr('class', 'menuTheme-' + params.menuTheme);
            //初始化主题样色  所谓的主题颜色：指通用色调
            window.document.documentElement.setAttribute("primaryColor", params.primaryColor);
            $('html').attr('primaryColor', params.primaryColor);

            // params.globalTheme = 'gloDark';
            //globalTheme set
            if (!!params.globalTheme) {
                if (params.globalTheme === 'gloBlue') {
                    //sasas 亮色主题
                    // $('html').attr('menuTheme', 'light');
                    // $('html').attr('class', 'menuTheme-light');

                    $('html').attr('menuTheme', 'blueDark');
                    $('html').attr('class', 'menuTheme-blueDark');

                } else if (params.globalTheme === 'gloDark') {
                    //sasas暗色主题
                    $('html').attr('globalTheme', params.globalTheme);
                    $('html').attr('menuTheme', 'dark');
                    $('html').attr('class', 'menuTheme-dark');
                }
            }


            //系统提示信息设置
            if (params.sysTipsSet) {
                if (params.sysTipsSet.open === 'true') {
                    $('.pageAlertTip').show();
                } else {
                    $('.pageAlertTip').hide();
                }

                $('.pageAlertTip').text(params.sysTipsSet.name ? params.sysTipsSet.name : '');


                //初始密码 提示修订功能
                if (params.sysTipsSet.initialPasswordOpen === 'true') {
                    //获取当前密码，与初始密码进行匹配，判断是否符合，如何相等，则提示用户进行密码修改

                    // var currentPassword='Abcd1234#';
                    //
                    // var initialPassword=params.sysTipsSet.initialPassword;

                    if (userInfo.suIsUpdatepwd === "0") {
                        var passWordIndex = layer.msg('<div style="font-size: 15px">密码安全度低，建议重置密码!</div>', {
                            time: 20000,
                            btn: ['重置密码', '取消'],
                            offset: '160',
                            btnAlign: 'c',
                            yes: function () {
                                layer.close(passWordIndex);
                                //弹出密码重置框
                                $('#changeP').trigger('click');
                            }
                        });

                    }
                }
            }

            //主题色设置
            common.themeSet();


        },
        navSet: function () {
            var layerLoader = common.layerLoader();


            //cookie 优先级最高
            if (!!common.getCookie('themeSet') && common.getCookie('themeSet') !== 'false') {
                common.fetchGet('compmgr/webComponent/componentInfo?compId=' + common.getCookie('themeSet'), function (res) {
                    layer.close(layerLoader);
                    index.navView((res.list && res.list[0] && res.list[0].prop) ? res.list[0].prop : {});
                }, function () {
                    layer.close(layerLoader);
                    if (err.resultMessage) {
                        layer.alert(err.resultMessage);
                    } else {
                        layer.msg('页面出错');
                    }
                    index.navView();
                });
            } else {
                //限制用户 suIdList
                var suIdList = ['6e88fc38df32468d9dd76f448f750248'];
                //暂时这样写， 之后用户的信息 要做到可配置
                if (suIdList.length > 0 && common.indexOf(suIdList,userInfo.suId) > -1) {
                    common.fetchGet('compmgr/webComponent/componentInfo?compId=ICLAGA6FNBB2674HI91JCN80', function (res) {
                        layer.close(layerLoader);
                        index.navView((res.list && res.list[0] && res.list[0].prop) ? res.list[0].prop : {});
                    }, function () {
                        layer.close(layerLoader);
                        if (err.resultMessage) {
                            layer.alert(err.resultMessage);
                        } else {
                            layer.msg('页面出错');
                        }
                        index.navView();
                    });

                } else {
                    //根据启动项 配置系统主题
                    common.fetchPost('compmgr/webComponent/getTopComponentByType?type=navComp', null, function (res) {
                        layer.close(layerLoader);
                        index.navView((res.list && res.list[0] && res.list[0].prop) ? res.list[0].prop : {});
                    }, function (err) {
                        layer.close(layerLoader);
                        if (err.resultMessage) {
                            layer.alert(err.resultMessage);

                            location.replace(common.getLocationOrigin() + '/login.html');


                        } else {
                            layer.msg('页面出错');
                        }
                        index.navView();
                    });
                }

            }

            //目录导入
            index.menuSet();

        },
        //数据权限
        dataAccess: function (ele) {
            var navA = $(ele);
            var menuId = navA.attr('data-smid');

            var customTabList = $('.customTabList ul');
            var customTabContent = $('.customTabContent');

            customTabList.find('li').eq(0).siblings().remove();
            customTabContent.find('.item').eq(0).siblings().remove();
            if (menuId && dataAccessMenuMap[menuId]) {

                var accessData = dataAccessMenuMap[menuId];
                var menuData = menuDataMap[menuId];

                var treeHeight = $(window).height() - 150;

                var menuTreeMap = {};//树集合
                var iconList = ['icon-SZYD-zhiduleixing', 'icon-SZYD-zhiduguanli', 'icon-SZYD-zhiduxinxi', 'icon-SZYD-jinruchaxunshenqing', 'icon-DEZJ-mobanxinxi'];

                if (!!accessData && !!accessData.menuId) {

                    // /dataAuthRoleUser/queryDataAuthRoleUserList  userId
                    // 获取数据权限角色用户列表

                    //todo:

                    // 根据菜单ID获 用户id 取有权限的目录列表
                    common.fetchGet('sysmgr/dataAuthCatalog/listByMenuAndUser?menuId=' + accessData.menuId + '&userId=' + userInfo.suId, function (res) {
                        // common.fetchGet('sysmgr/dataAuthCatalog/listByMenu/' + accessData.menuId, function (res){
                        if (res && res.list && res.list.length > 0) {
                            var resMap = {};
                            $.map(res.list, function (item, index) {
                                if (item) {
                                    var html1, html2;
                                    resMap[item.contentId] = item;

                                    html1 = '<li data-customTabList="' + item.contentId + '" data-tip="' + item.contentName + '">' +
                                        '<i class="icon iconfont ' + iconList[index] + '"></i>' +
                                        '<span class="menuTabTip">' + item.contentName + '</span>' +
                                        '</li>';

                                    html2 = '<div class="item " data-customTabContent="' + item.contentId + '">' +
                                        '<div class="unitSelection">' +
                                        '<div class="menu-title">' + item.contentName + '</div>' +
                                        '<ul style="height: ' + treeHeight + 'px" class="eleTree ele4 " lay-filter="' + item.contentId + '" id="' + item.contentId + '"></ul>' +
                                        '</div>' +
                                        '</div>';

                                    customTabList.append(html1);
                                    customTabContent.append(html2);

                                    var iframeInterval = setInterval(function () {
                                        if ($(window.frames[0].document.getElementsByTagName('body'))[0]) {
                                            var parentBody = $(window.frames[0].document.getElementsByTagName('body'));
                                            if (!parentBody.find('.dataAccessArea')[0]) {
                                                parentBody.prepend('<div class="dataAccessArea alert-warning-box"><i class="fa fa-close" id="accessBoxClose"></i><span class="title">数据来源</div>');
                                                parentBody.find('#accessBoxClose').off().on('click', function () {
                                                    $(this).parent().hide();
                                                });
                                            }
                                            parentBody.find('.dataAccessArea').append('<span class="text" data-contentId="' + item.contentId + '">' + item.contentName + ':<b>全部</b></span>');

                                            clearInterval(iframeInterval);
                                        }
                                    }, 1000);

                                    var searchParam = {
                                        "conditionVal": {}
                                    };

                                    //获取公共数据权限条件列表
                                    common.fetchPost('sysmgr/dataAuthCondition/queryDataAuthConditionList', {
                                        "authId": item.authId,
                                        "contentId": item.contentId
                                    }, function (conditionRes) {

                                        //公共条件搜索
                                        if (conditionRes && conditionRes.list && conditionRes.list.length > 0) {
                                            for (var i = 0; i < conditionRes.list.length; i++) {
                                                if (conditionRes.list[i]['ggDelStatus'] === "0") {//获取启用的数据
                                                    var conditionResItem = conditionRes.list[i];
                                                    //搜索条件数据组合
                                                    if (conditionResItem.valueSource === "1") {
                                                        searchParam.conditionVal[conditionResItem.fieldName] = {
                                                            value: conditionResItem.fieldValue,
                                                            queryType: conditionResItem.relation
                                                        };
                                                    } else {
                                                        //表示 目标目录绑定
                                                        //todo:
                                                    }
                                                }
                                            }
                                        }
                                    }, null, false);

                                    //获取角色权限条件列表 需要判断是都是最高权限，如果是最高权限，该角色条件过滤不生效
                                    //todo
                                    common.fetchPost('sysmgr/dataAuthRoleCondition/queryDataAuthRoleConditionList', {
                                        "authId": item.authId,
                                        "contentId": item.contentId,
                                        "roleId": item.roleId
                                    }, function (roleConditionRes) {

                                        //公共条件搜索
                                        if (roleConditionRes && roleConditionRes.list && roleConditionRes.list.length > 0) {
                                            for (var i = 0; i < roleConditionRes.list.length; i++) {
                                                if (roleConditionRes && roleConditionRes.list && roleConditionRes.list.length > 0) {
                                                    for (var i = 0; i < roleConditionRes.list.length; i++) {
                                                        if (conditionRes.list[i]['ggDelStatus'] === "0") {//获取启用的数据
                                                            var roleConditionResItem = roleConditionRes.list[i];
                                                            //搜索条件数据组合
                                                            if (roleConditionResItem.valueSource === "1") {
                                                                searchParam.conditionVal[roleConditionResItem.fieldName] = {
                                                                    value: roleConditionResItem.fieldValue,
                                                                    queryType: roleConditionResItem.relation
                                                                };
                                                            } else {
                                                                //表示 目标目录绑定
                                                                //todo:
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }, null, false);

                                    //根据数据权限条件，获取数据
                                    common.fetchPost('sysmgr/catalogueTable/selectTableRowByCondition?catalogueId=' + item.contentId, searchParam, function (busiData) {

                                        //根据展示效果 数据处理

                                        var treeData = [];

                                        var showRes;
                                        // var loader = common.layerLoader();
                                        //获取展示配置接口
                                        common.fetchPost('sysmgr/dataAuthCatalog/queryDataAuthCatalogList', {
                                            "authId": item.authId,
                                            "contentId": item.contentId
                                        }, function (res3) {
                                            // todo: 后台可能有变动 按照数据返回 是list 的第一条数据  这里有疑义
                                            showRes = res3.list[0];

                                            if (busiData && busiData.list && busiData.list.length > 0) {


                                                var showValue = showRes['showValue'];
                                                var showField = showRes['showField'];
                                                var pidField = showRes['pidField'];
                                                var targetKey = showRes['targetField'];

                                                var children;

                                                if (showRes.showType === "list") {
                                                    children = busiData.list;
                                                } else if (showRes.showType === "tree") {
                                                    children = common.arrayToTreeJson(busiData.list, showField, pidField, "children");

                                                }

                                                //顶层加入节点--全部
                                                treeData = [{}];
                                                treeData[0][showField] = '全部';
                                                treeData[0][showValue] = '';
                                                treeData[0]['children'] = children;
                                                // treeData[0]['ds'] = children;

                                                //获取展示效果配置

                                                menuTreeMap[item.contentId] = tree.render({
                                                    elem: '#' + item.contentId,
                                                    data: treeData,
                                                    lazy: false,
                                                    defaultExpandAll: true,
                                                    expandOnClickNode: false,
                                                    highlightCurrent: true,
                                                    showCheckbox: false,
                                                    checkOnClickNode: true,
                                                    request: {
                                                        name: showField,
                                                        key: showValue,
                                                        id: showValue,
                                                        children: "children"
                                                    }
                                                });
                                                tree.on('nodeClick(' + item.contentId + ')', function (treeNode) {

                                                    //页面中导入 节点点击数据
                                                    if ($(window.frames[0].document.getElementsByTagName('body'))[0] && treeNode.data.currentData) {
                                                        var currentData = treeNode.data.currentData;

                                                        var parentBody = $(window.frames[0].document.getElementsByTagName('body'));

                                                        parentBody.find('.dataAccessArea').show();
                                                        if (parentBody.find('.dataAccessArea [data-contentId=' + item.contentId + ']')[0]) {

                                                            parentBody.find('.dataAccessArea [data-contentId=' + item.contentId + ']').find('b').attr({
                                                                'showField': showField,
                                                                'showValue': showValue,
                                                                'searchValue': currentData[showValue],
                                                                'searchText': currentData[showField],
                                                                'targetKey': targetKey
                                                            });
                                                            parentBody.find('.dataAccessArea [data-contentId=' + item.contentId + ']').find('b').text(currentData[showField]);

                                                            //数据权限刷新表格等事件
                                                            //获取子页面需要刷新的模块
                                                            var moduleList;
                                                            if (parentBody.find('.reloadModuleList').text()) {
                                                                moduleList = JSON.parse(parentBody.find('.reloadModuleList').text());
                                                            }


                                                            if (!!moduleList) {
                                                                //表格刷新
                                                                if (moduleList.table && moduleList.table.length > 0) {
                                                                    $.map(moduleList.table, function (tableItem) {
                                                                        parentBody.find('.tableReload_' + tableItem).trigger('click');
                                                                    });
                                                                }
                                                                //树刷新

                                                                //图表刷新
                                                            }


                                                        }
                                                    }
                                                });

                                                //默认点击第一条 todo:


                                            }

                                            // layer.close(loader);
                                        }, function (err) {
                                            layer.alert(err.resultMessage);
                                            // layer.close(loader);
                                        }, false);

                                    }, function (err) {
                                        layer.alert(err.resultMessage);
                                    }, false);
                                }
                            });
                        }

                    }, function (err) {
                        return err.resultMessage
                    })
                }
            }
        },
        //单位树
        unitTreeSet: function () {

            tree.render({
                elem: $('.unitTree'),
                url: baseUrl + 'sysmgr/sysEnterprise/selectSysEnterpriseOrganPostTreeAllList?treeType=enterpriseTree',
                showIcon: true,
                done: function () {
                    $('.unitTree .eleTree-node-content').each(function () {
                        $(this).click();
                    });
                },
                lazy: true,
                load: function (data, callback) {
                    common.fetchGet(baseUrl + 'sysmgr/sysEnterprise/selectSysEnterpriseOrganPostTreeAllList?treeType=enterpriseTree' + '&id=' + data.id + "&extendAttr=" + data.extendAttr, function (res) {
                        if (res.success && res.list) {
                            callback(res.list);
                        }
                    }, function () {
                        callback([])
                    });

                },
                response: {
                    dataName: "list"
                }
            });
            tree.on("nodeClick(unitTree)", function (obj) {
                $('.menuTipBox').find('b').text(obj.data.currentData.name).attr('data-unitTreeId', obj.data.currentData.id);
            });
        },
        //页面初始后执行的事件
        load: function () {

            //无效登录 拦截
            if (!isFlowAccess) {
                $('#todoIcon').hide();
            }

            if (!common.getCookie('userInfo')) {
                layer.alert('登录失效，请重新登录', function (index) {
                    layer.close(index);
                    location.replace(common.getLocationOrigin() + '/login.html');
                    // location.replace(location.origin + '/login.html');
                });
                setTimeout(function () {
                    location.replace(common.getLocationOrigin() + '/login.html');
                    // location.replace(location.origin + '/login.html');
                }, 3000);
                return;
            }
            // userInfo = JSON.parse(window.localStorage.userInfo);
            userInfo = JSON.parse(common.getCookie('userInfo'));
            //显示用户名
            // $("#suName").html(userInfo.suName + '【' + userInfo.currEnterpriseVo.seName + '】');
            var html = '';
            html += userInfo.suName;
            // if(userInfo.currEnterpriseVo&&userInfo.currEnterpriseVo.seShortName){
            //     html+=userInfo.suName + '【' + userInfo.currEnterpriseVo.seShortName + '】';
            // }
            // else{
            //     html+=userInfo.suName + '【无】';
            // }

            $("#suName").html(html);
            //导航配置导入
            index.navSet();

            //水印导入
            common.fetchGet('sysmgr/dicts/findWaterMarkMsgText', function (res) {

                if (res.object.close === '1') { //表示开启
                    common.waterMark({
                        'watermark_txt': res.object['watermark']
                    });
                    // PointerEventsPolyfill.initialize({});
                } else {
                    //表示关闭
                    common.waterMark({
                        'watermark_txt': ''
                    });
                    // PointerEventsPolyfill.initialize({});
                }

            });

        },
        menuRender: function (leftMenuList, successBack) { //支持三级菜单配置渲染   最后一层菜单配完整菜单url 其他层级地址写对应的1或2

            //如果有数据权限菜单，则出现总icon列， 如果没有数据权限菜单，则只展示功能菜单

            // dataAccessMenuMap={a:1}

            if ($.isEmptyObject(dataAccessMenuMap)) {
                //不存在数据权限菜单，去除相关div配置
                $('.gnMenu').remove();
                $('.customTabContent').css({
                    left: 0,
                    width: '100%'
                });
                $('.customTabList').remove();
                $('.index-leftSide').addClass('menuCloseStatus');
            }


            var listMap = common.arrayToTreeJson(leftMenuList, "smId", "smPid", "children");
            // console.log(JSON.stringify(listMap));
            //渲染左侧边栏菜单
            // var html = '<li class="layui-nav-item layui-this navItem" lay-id="main"><a class="fNodeMenu" href="javascript:;" title="首页" data-compId="" data-url="main"  data-text="首页"> <i class="layui-icon layui-icon-home" style="display:inline-block;width:18px;margin:0px 5px 0px 0px;"></i>首页</a></li>';
            var html = '';
            function funBack(data) {
                var url = '';
                var compId = '';
                if (data['smCode'].indexOf('Main_') > -1) {

                    mainUrl = data['smUrl'];
                }

                if (data.smUrl.indexOf('?') > 0) {
                    url = data.smUrl.substring(0, (data.smUrl.indexOf('?')));
                    compId = data.smUrl.substring(data.smUrl.indexOf('?') + 1);
                } else {
                    compId = null;
                    url = data.smUrl
                }

                var htmlTem = '';
                var cc = data.children;
                if (cc) {
                    htmlTem += '<dd><a id="' + data.smId + '" class="sNodeMenu" href="javascript:;"  title="' + data.smName + '" data-smId="' + data.smId + '" data-text="' + data.smName + '"><i class="' + data.smIcon + '"style="display:inline-block;width:15px;margin:0px 5px 0px 0px;" ></i> ' + data.smName + '</a>';
                    htmlTem += '<dl class="layui-nav-child">';
                    for (var k = 0; k < cc.length; k++) {
                        var url = '';
                        var compId = '';


                        if (cc[k]['smCode'].indexOf('Main_') > -1) {

                            mainUrl = cc[k]['smUrl'];
                        }

                        if (cc[k].smUrl.indexOf('?') > 0) {
                            url = cc[k].smUrl.substring(0, (cc[k].smUrl.indexOf('?')));
                            compId = cc[k].smUrl.substring(cc[k].smUrl.indexOf('?') + 1);
                        } else {
                            compId = null;
                            url = cc[k].smUrl
                        }

                        htmlTem = htmlTem + funBack(cc[k]);

                        // htmlTem += '<dd><a class="sNodeMenu" href="javascript:;"  title="' + cc[k].smName + '" data-smId="' + cc[k].smId + '" data-compId="' + compId + '" data-url="' + url + '"  data-text="' + cc[k].smName + '"><i class="' + cc[k].smIcon + '"style="display:inline-block;width:15px;margin:0px 5px 0px 0px;" ></i> ' + cc[k].smName + '</a></dd>'
                    }
                    htmlTem += '</dl></dd>';
                } else {
                    htmlTem += '<dd><a id="' + data.smId + '" class="sNodeMenu" href="javascript:;"  title="' + data.smName + '" data-smId="' + data.smId + '" data-compId="' + compId + '" data-url="' + url + '"  data-text="' + data.smName + '"><i class="' + data.smIcon + '"style="display:inline-block;width:15px;margin:0px 5px 0px 0px;" ></i> ' + data.smName + '</a></dd>'
                }
                return htmlTem;
            }

            for (var i = 0; i < listMap.length; i++) { //一级节点 比如 系统管理

                //一级菜单

                if (listMap[i]['smCode'].indexOf('Main_') > -1) {
                    mainUrl = listMap[i]['smUrl'];
                    html += '<li class="layui-nav-item layui-this navItem" lay-id="main"> <a  class="fNodeMenu " data-url="' + listMap[i]['smUrl'] + '" href="javascript:;" title=' + listMap[i]['smName'] + '  data-text=' + listMap[i]['smName'] + '> <i class="firstIcon ' + listMap[i]['smIcon'] + '"></i>' + listMap[i]['smName'] + '</a></li>';
                } else {

                    var children = listMap[i].children;
                    if (children) {
                        html += ' <li class="layui-nav-item navItem firstMenu"><a class="fNodeMenu" href="javascript:;" title="' + listMap[i].smName + '"><i class="firstIcon ' + listMap[i].smIcon + '"></i> <cite>' + listMap[i].smName + '</cite><span class="layui-nav-more"></span></a>';
                        html += '<dl class="layui-nav-child">';
                        for (var j = 0; j < children.length; j++) {
                            html = html + funBack(children[j]);
                        }
                        html += '</dl></li>';
                    } else {
                        var url1, compId;
                        //不存在子菜单的情况下
                        if (listMap[i]['smUrl'].indexOf('?') > 0) {
                            url1 = listMap[i].smUrl.substring(0, (listMap[i].smUrl.indexOf('?')));
                            compId = listMap[i].smUrl.substring(listMap[i].smUrl.indexOf('?') + 1);
                        } else {
                            compId = null;
                            url1 = listMap[i].smUrl
                        }
                        html += '<li class="layui-nav-item navItem firstMenu"> <a  class="fNodeMenu" data-smId="' + listMap[i].smId + '" data-url="' + url1 + '" data-compId="' + compId + '"  href="javascript:;" title=' + listMap[i]['smName'] + '  data-text=' + listMap[i]['smName'] + '> <i class="firstIcon ' + listMap[i]['smIcon'] + '" ></i>' + listMap[i]['smName'] + '</a></li>';
                    }
                }

            }
            $('.leftMenuList').html(html);


            //首页载入
            var currentUrl;
            if (!!mainUrl) {
                if (mainUrl.indexOf('?') > 0) {
                    currentUrl = mainUrl.substring(0, (mainUrl.indexOf('?')));
                    compId = mainUrl.substring(mainUrl.indexOf('?') + 1);
                    $('.menuContent').html('<iframe border="0" class="iframe" frameborder="no" height="100%" id="main" name="iframe" scrolling="auto" src="./src/page/' + currentUrl + '.html?' + compId + '" width="100%"></iframe>');
                } else {
                    compId = null;
                    currentUrl = mainUrl;
                    $('.menuContent').html('<iframe border="0" class="iframe" frameborder="no" height="100%" id="main" name="iframe" scrolling="auto" src="./src/page/' + currentUrl + '.html" width="100%"></iframe>');
                }

                $('#breadcrumb-custom').html('  <a class="fNodeMenu" data-compId="' + compId + '" data-text="首页" data-url="' + currentUrl + '" href="javascript:;" id="mainPage" title="首页"> <i class="layui-icon layui-icon-home" style="display:inline-block;width:18px;margin:0 5px 0 0;"></i>首页</a>');

            } else {
                //载入默认首页
                $('.menuContent').html('<iframe border="0" class="iframe" frameborder="no" height="100%" id="main" name="iframe" scrolling="auto" src="./src/page/error/defaultMain.html" width="100%"></iframe>');
                $('#breadcrumb-custom').html('  <a class="fNodeMenu"  data-text="首页" data-url="error/defaultMain" href="javascript:;" id="mainPage" title="首页"> <i class="layui-icon layui-icon-home" style="display:inline-block;width:18px;margin:0 5px 0 0;"></i>首页</a>');
            }

            if (successBack) {
                successBack();
            }
        },
        menuSlide: function (isClose) {

            //收起时
            if (isClose) {

                $('#toggleSide i').attr('class', 'icon iconfont icon-DEZJ-zhankaicaidan');

                $('#toggleSide').css({
                    width: '40px'
                });
                $('.layui-bg-black').addClass('toggleShen');
                $('.layui-body').addClass('left0');

                /**
                 * 菜单折叠状态下 鼠标悬停时，展示对应菜单栏
                 * */

                $(document).off('mouseover', '.customTabList li');
                $(document).on('mouseover', '.customTabList li', function (e) {
                    var _this = $(this);
                    _this.siblings().removeClass('selected');
                    _this.addClass('selected');
                    var customTabContent = $('[data-customTabContent=' + _this.attr('data-customTabList') + ']');
                    customTabContent.siblings().removeClass('selected');
                    customTabContent.addClass('selected');

                    $('.index-leftSide').removeClass('toggleShen');

                });

                $('.customTabContent').on('mouseover', function (e) {

                    $('.index-leftSide').removeClass('toggleShen');
                    // $('.toggleSide').hide();

                });
                $('.customTabContent').on('mouseout', function (e) {
                    $('.index-leftSide').addClass('toggleShen');
                    // $('.toggleSide').show();
                })


            } else {
                $(document).off('click', '.customTabList li');
                $(document).on('click', '.customTabList li', function (e) {
                    var _this = $(this);
                    _this.siblings().removeClass('selected');
                    _this.addClass('selected');
                    var customTabContent = $('[data-customTabContent=' + _this.attr('data-customTabList') + ']');
                    customTabContent.siblings().removeClass('selected');
                    customTabContent.addClass('selected');
                });
                $(document).off('mouseover', '.customTabList li');
                $(document).on('mouseover', '.customTabList li', function () {

                    $(this).find('span.menuTabTip').css('display', 'inline-block');
                }).on('mouseout', function () {
                    $(this).find('span.menuTabTip').css('display', 'none');
                });

                $('.customTabContent').off();
                $('#toggleSide').css('width', '210px');
                $('#toggleSide i').attr('class', 'icon iconfont icon-DEZJ-shouqicaidan');
                $('.layui-bg-black').removeClass('toggleShen');
                $('.layui-body').removeClass('left0');
            }
        },
        menuSet: function () { //菜单获取整体设置

            //数据权限设置
            $.when(

                common.fetchGet('sysmgr/menu/selectAuthMenuList') //有权限菜单列表
            ).done(function (res2) {
                if (res2 && res2.list && res2.list.length > 0) {
                    $.map(res2.list, function (item) {
                        menuDataMap[item.smId] = item;
                    });
                }

                if (res2.success) {

                    index.menuRender(res2.list, function () {

                        element.init('nav', 'leftNav');
                    });

                } else {
                    layer.msg('菜单请求失败!');
                    return false;
                }

                //获取当前用户数据权限列表
                common.fetchGet('sysmgr/dataAuth/queryCurrentUserDataAuthList', function (res1) {
                    //将数据权限对象进行合并
                    if (res1.success && res1 && res1.list && res1.list.length > 0) {
                        $.map(res1.list, function (item) {

                            if (menuDataMap[item.menuId]) {
                                // if (!dataAccessMenuMap[item.menuId]) {
                                //     dataAccessMenuMap[item.menuId] = [];
                                // }
                                // dataAccessMenuMap[item.menuId].push(item);

                                //可能有bug
                                dataAccessMenuMap[item.menuId] = item;
                            }
                        });
                    }
                }, false);


            }).fail(function (err2) {

            });
        },

        // downFile: function(content, filename) {
        //     // 创建隐藏的可下载链接
        //     var eleLink = document.createElement('a');
        //     eleLink.download = filename;
        //     eleLink.style.display = 'none';
        //     // 字符内容转变成blob地址
        //     var blob = new Blob([content]);
        //     eleLink.href = URL.createObjectURL(blob);
        //     // 触发点击
        //     document.body.appendChild(eleLink);
        //     eleLink.click();
        //     // 然后移除
        //     document.body.removeChild(eleLink);
        // },

        // 页面元素绑定事件监听
        domEvent: function () {

            // $("#helpIcon").click(function () {
            //     debugger
            //     var content = 'src/page/docxFiles/helpManual.docx';
            //     var filename = '中国有色集团“三重一大”信息管理系统2.0填报功能用户操作手册.docx';
            //     var csvData = new Blob([content], { type: 'text/csv' });
            //     if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            //         window.navigator.msSaveOrOpenBlob(csvData, filename);
            //     }else{
            //         index.downFile(content,filename);
            //     }
            // })

            // 正则验证
            form.verify({
                checkPassword: function (value, item) { //登录密码
                    if (!new RegExp(/^(?![A-Za-z0-9]+$)(?![a-z0-9\\W]+$)(?![A-Za-z\\W]+$)(?![A-Z0-9\\W]+$)[a-zA-Z0-9\\W]{8,}$/).test(value)) {
                        return '输入密码格式有误，请重填';
                    }
                }
            });
            //切换企业
            $("#changeE").click(function () {
                var index_changeE = layer.open({
                    offset: '100px',
                    title: '切换企业',
                    maxmin: false,
                    type: 1,
                    //页面层
                    area: ['1000px', '600px'],
                    //高度自适应
                    shadeClose: false,
                    content: ' <div style="padding: 15px 20px"> <table id="table1" lay-filter="table1"></table> </div>',
                    success: function (obj) {
                        table.render(common.tableInitParams({
                            elem: $(obj.selector).find('#table1'),
                            url: baseUrl + 'sysmgr/login/changeEnAjax',
                            contentType: 'text/plain',
                            height: '630px',
                            method: 'get',
                            request: null,
                            parseData: function (res) { //res 即为原始返回的数据
                                return {
                                    "code": 0,
                                    //解析接口状态
                                    "msg": res.resultMessage,
                                    //解析提示文本
                                    "data": res.list //解析数据列表
                                };
                            },
                            cols: [
                                [{
                                    field: 'seName',
                                    title: '单位名称1',
                                    width: 200
                                }, {
                                    field: 'seShortName',
                                    title: '单位简称',
                                    width: 200
                                }, {
                                    field: 'seComcode',
                                    title: '社会信用代码',
                                    width: 200
                                }, {
                                    field: 'seUnitcode',
                                    title: '组织结构代码',
                                    width: 200
                                }, {
                                    field: 'soName',
                                    title: '部门名称',
                                    templet:function(rowData){
                                        return (rowData.seId == userInfo.seId && rowData.soId == userInfo.soId)?(rowData.soName+'（当前登录）'):rowData.soName;
                                    },
                                    width: 200
                                }]
                            ],
                            done: function (res) {
                                //    //监听行单击事件
                                table.on('row(table1)', function (obj) {
                                    var enpMsg = '[' + obj.data.seName + '-' + obj.data.soName + ']';
                                    layer.confirm('是否切换至' + enpMsg, {
                                        icon: 3,
                                        title: '提示',
                                        offset: '150px'
                                    }, function (index) {
                                        layer.close(index);
                                        common.fetchGet('sysmgr/login/chang' + '?seId=' + obj.data.seId + '&soId=' + obj.data.soId, function (res) {
                                            layer.msg('欢迎进入：' + obj.data.seName + '-' + obj.data.soName, {
                                                icon: 16,
                                                shade: 0.01
                                            }, function () {
                                                layer.close(index_changeE);
                                                // window.localStorage.userInfo = JSON.stringify(res.object); //保存用户名
                                                common.setCookie('userInfo', JSON.stringify({
                                                    roleIds: res.object.roleIds,
                                                    seId: res.object.seId,
                                                    seName: res.object.seName,
                                                    seType: res.object.seType,
                                                    suId: res.object.suId,
                                                    suLoginCode: res.object.suLoginCode,
                                                    suName: res.object.suName,
                                                    soName: res.object.soName,
                                                    soId: res.object.soId,
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
                                                        soName: res.object.currEnterpriseVo.soName,
                                                        soId: res.object.currEnterpriseVo.soId,
                                                    }
                                                }));
                                                location.href = "./index.html";
                                            }, function (err) {

                                            });
                                        }, function (index) {

                                        });
                                    });
                                });
                            }
                        }));
                    }
                });
            });
            //修改密码
            $("#changeP").click(function () {
                var index_changeP = layer.open({
                    offset: '160',
                    title: '修改密码',
                    maxmin: false,
                    type: 1,
                    //页面层
                    area: ['600px'],
                    //高度自适应
                    shadeClose: false,
                    content: $('.passwordLayer').html(),
                    //加载该区域的html
                    // btn:['提交','重置','退出登录'],
                    success: function (obj) {
                        //点击提交
                        $(obj.selector).find('#changeP-btn').off().on('click', function () {
                            var oldPwd = $(obj.selector).find('#oldPwd').val()
                            var newPwd = $(obj.selector).find('#newPwd').val()
                            var againPwd = $(obj.selector).find('#againPwd').val()
                            var reg = new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[.+\-*\/$#]).{8,}$/);// [、]、-、\、^、，、碰到这个五个需要对他们进行转义
                            if (!reg.test(newPwd)) {
                                layer.msg('新密码输入格式有误，请重填');
                                return false;
                            }
                            if (!reg.test(againPwd)) {
                                layer.msg('确认密码输入格式有误，请重填');
                                return false;
                            }
                            if (againPwd != newPwd) {
                                layer.msg('确认密码和新密码不一致');
                            } else {
                                var index_confirm = layer.confirm('确定修改密码?', {
                                    icon: 3,
                                    title: '提示',
                                    offset: '150px'
                                }, function () {
                                    layer.close(index_confirm);
                                    var data = {
                                        oldPwd: index.encrypt(oldPwd),
                                        newPwd: index.encrypt(newPwd)
                                    };
                                    var loader = common.layerLoader();
                                    common.fetchPost('sysmgr/login/changePwdAjax', data, function (res) {
                                        layer.close(loader);
                                        var isSuccess = res.success;
                                        // layer.alert(res.resultMessage);
                                        if (res.resultMessage) {
                                            layer.alert(res.resultMessage);
                                        } else {
                                            layer.msg('切换成功!');
                                        }
                                        if (isSuccess) {
                                            layer.alert('密码修改成功!请返回重新登录', function (index) {
                                                layer.close(index_changeP);
                                                location.replace(common.getLocationOrigin() + '/login.html');
                                                // location.replace(location.origin + '/login.html');
                                            });
                                            return;
                                        }
                                    }, function (err) {

                                    });
                                });
                            }
                            return false
                        });
                        //点击退出登录
                        $(obj.selector).find('#logOut-btn').off().on('click', function () {
                            index.loginOut();
                            return false
                        })
                    }
                });
            });
            //退出登录
            $(".loginOut").click(function () {
                index.loginOut();
            });
            //更新日志
            $("#updateLog").on('click',function () {
                
                common.fetchGet('sysmgr/sysNotice/selectSysUpdateLogList', function (res) {
                    var content;
                    if (res.success && res.list.length > 0) {
                        content = '<ul class="clearFix">';

                        for (var i = 0; i < res.list.length; i++) {
                            content += '<li><i class="icon iconfont icon-DEZJ-tongzhigonggao"></i>';
                            content += '<span name="memo">' + res.list[i].snTitle + '</span>';
                            content += '</li>';
                        }
    
                        content += '</ul>';
                    }
                    $('#sysUpdateLog').html(content); 
                }, function () { },false,false);
                var index_updateLog = layer.open({
                    offset: '10px',
                    title: '更新日志',
                    maxmin: false,
                    type: 1,
                    //页面层
                    area: ['580px'],
                    //高度自适应
                    shadeClose: false,
                    content: $('.updateLogLayer').html(),
                    success: function (obj) {
                        form.render();
                    }
                });
                return false;
            });

            //我的代办
            $('#todoIcon').off().on('click', function () {
                $('[data-smid=c3f69d88c10f4a859809b7fbbc454c5d]').trigger('click');
            });

            //皮肤切换
            $('#themeConfig').on('click', function () {
                /*  layer.open({
                      title: false,
                      type: 1,
                      //页面
                      content: $('#themeConfigArea').html(),
                      //主题样式配置窗口
                      // area:['494px',($('.layui-side').height()+'px')],
                      area: ['494px', '800px'],
                      offset: [60, $('body').width() - 520],
                      closeBtn: 0,
                      shadeClose: true,
                      anim: -1,
                      className: 'layui-anim-rl',
                      //自己写从右边弹出的动画 有bug？？？  怎么效果出不来
                      success: function (obj) {
                          var parent = $(obj.selector);
                          // var topHeight=parent.find('input[name="topHeightPx"]').val();

                          colorpicker.render({ //主题色 更多选择
                              elem: '#bg-more',
                              color: '#2ec770',
                              //设置默认色
                              done: function (color) {

                                  $(this.elem).parent().attr('data-primary', this.color);
                                  layer.tips('选择了：' + color, this.elem);
                              }
                          });
                          colorpicker.render({ //背景色 拾色器初始化
                              elem: '.pickColor0',
                              color: '#114dab',
                              //设置默认色
                              done: function (color) {
                                  layer.tips('选择了：' + color, this.elem);
                              }
                          });
                          form.render();
                          element.on('tab(primarySettingArea)', function (data) {
                              colorpicker.render({
                                  elem: '.pickColor' + data.index,
                                  color: '#114dab',
                                  //设置默认色
                                  done: function (color) {
                                      layer.tips('选择了：' + color, this.elem);
                                  }
                              });
                              form.render();
                              //监听指定开关
                              form.on('switch(switchTest)', function (data) {
                                  layer.msg('开关checked：' + (this.checked ? 'true' : 'false'), {
                                      offset: '6px'
                                  });
                                  // layer.tips('温馨提示：请注意开关状态的文字可以随意定义，而不仅仅是ON|OFF', data.othis)
                              });
                          });
                          //获取当前页面的主题配置参数并设置config 面板

                          parent.find('.mainThemeArea ul li').removeClass('selected');
                          // var currentTheme = window.document.documentElement.getAttribute('menuTheme');
                          var currentTheme = $('html').attr('menuTheme') || $('html').attr('class').substring(10);
                          parent.find('.mainThemeArea ul li[data-menuTheme=' + currentTheme + ']').addClass('selected');

                          var currentPrimaryColoe = window.document.documentElement.getAttribute('primaryColor');
                          parent.find('.primaryColorArea ul li[data-primary=' + currentPrimaryColoe + ']').addClass('selected');

                          /!**
                           * dom 事件处理
                           * *!/

                          //整体风格替换
                          parent.find('.mainThemeArea ul li').off().on('click', function () {
                              $(this).siblings().removeClass('selected');
                              $(this).addClass('selected');
                              //切换整体风格

                              var theme = $(this).attr('data-menuTheme');


                              switch (theme) {
                                  case 'dark':
                                      layer.tips('暗色菜单风格', '#darkTheme');
                                      break;
                                  case 'light':
                                      layer.tips('亮色菜单风格', '#lightTheme');
                                      break;

                              }
                              // window.document.documentElement.setAttribute("menuTheme", theme);
                              $('html').attr('menuTheme', theme);
                              $('html').attr('class', 'menuTheme-' + params.menuTheme);

                          });

                          //主题样式颜色切换
                          parent.find('.primaryColorArea ul li').off().on('click', function () {
                              $(this).siblings().removeClass('selected');
                              $(this).addClass('selected');
                              //切换整体风格

                              // var topHeight=$('.layui-header').css('height');
                              // $('.layui-header').css('height',topHeight);
                              var primaryColor = $(this).attr('data-primary');
                              // window.document.documentElement.setAttribute("topHeight",topHeight);
                              window.document.documentElement.setAttribute("primaryColor", primaryColor);
                              $('html').attr('primaryColor', primaryColor);
                              //操作页面所有包含的iframe
                              var iframes = $('iframe.iframe');
                              for (var i = 0; i < iframes.length; i++) {
                                  iframes[i].contentWindow.postMessage(primaryColor, '*'); //向子iframe传输主体颜色的信息
                              }
                          });
                      }
                  });*/
                layer.open({
                    title: '主题设置',
                    type: 1,
                    //页面
                    content: $('#themeSetTable').html(),
                    area: ['60%', '460px'],
                    success: function (obj) {
                        var parent = $(obj.selector);
                        table.render(common.tableInitParams({
                            elem: parent.find('#themeTable'),
                            url: baseUrl + 'compmgr/webComponent/pageTopWebComponent',
                            method: 'post',
                            height: '380',
                            cols: [
                                [
                                    { "type": "numbers", "title": "序号" },
                                    { field: 'wumiChname', title: '主题名称', sort: true },
                                    {
                                        field: 'ggEnStatus', title: '是否启用', width: 100, sort: true,
                                        templet: function (rowData) {
                                            return (rowData["ggEnStatus"] == "0") ? '否' : '是';
                                        }
                                    },
                                    { field: '', title: '操作', width: 75, toolbar: '#tableOper1', fixed: 'right' },
                                ]
                            ],
                            where: { paras: { wtmiTypecode: "navComp" } },
                            done: function () {

                            }
                        }));
                        table.on('tool(themeTable)', function (obj) {
                            var data = obj.data;
                            switch (obj.event) {
                                case 'singleEnable':
                                    // if (data.ggEnStatus == 1) {
                                    //     layer.msg('已启用，请勿重复点击');
                                    //     return false;
                                    // }
                                    var selectId = data.wumiId;
                                    common.setCookie('themeSet', selectId);
                                    window.location.reload();


                                    /* layer.confirm('确定启用?', {icon: 3, title: '提示', offset: '150px'}, function (index) {
                                         var layerLoader = common.layerLoader();
                                         common.fetchGet('compmgr/webComponent/enableTopWebComponent?compId=' + selectId + '&enable=true&type=navComp', function (res) {
                                             layer.close(layerLoader);
                                             if (res.success) {
                                                 layer.msg('启用成功');
                                                 window.location.reload();
                                             } else {
                                                 layer.msg('启用失败');
                                             }
                                         }, function () {
                                             layer.close(layerLoader);
                                         });
                                         layer.close(index);
                                     });*/
                                    break;
                            }
                        });
                    }
                });
            });

            //页面刷新按钮
            $('#refreshBtn i').off().on('click', function () {
                //获取当前选中的tab 重新加载iframe

                var iframeId = $('#mainMenuTab').find('.layui-this').attr('lay-id');

                var iframe = window.parent.document.getElementById(iframeId);

                iframe.contentWindow.location.reload(true);

            });

            //配置页面入口
            $('#systemConfig').off().on('click', function () {

                window.open(window.location.origin + '/src/page/custom/config.html');
            });


            //导航缩放按钮 监听左侧菜单的展开和收缩操作
            $('#toggleSide').off('click').on('click', function () {
                index.menuSlide(!$('.layui-bg-black').hasClass('toggleShen'));
            });

            //鼠标悬停提示特效
            $(".tab-tool").mouseover(function () {
                $(".kit-tab-tool-body ul").show();
            }).mouseleave(function () {
                $(".kit-tab-tool-body ul").hide();
            });

            // 页面操作--选项卡操作
            $("#tabOper .kit-item").click(function () {
                var thisLayid = $(".layui-tab-title").children('li[class=layui-this]').attr('lay-id');
                var target = $(this).attr('data-target');
                switch (target) {
                    case 'refresh':
                        var iframeId = $('#mainMenuTab').find('.layui-this').attr('lay-id');

                        var iframe = window.parent.document.getElementById(iframeId);

                        iframe.contentWindow.location.reload(true);
                        break;
                    case 'closeCurrent':
                        if (thisLayid != 'main') {
                            element.tabDelete('tab', thisLayid);
                        }
                        break;
                    case 'closeOther':
                        $(".layui-tab-title").children('li:not(.layui-this)').each(function () {
                            var layid = $(this).attr("lay-id");
                            if (layid != null && layid != 'main') {
                                element.tabDelete('tab', layid);
                            }
                        });
                        break;
                    case 'closeAll':
                        $(".layui-tab-title").children('li').each(function () {
                            var layid = $(this).attr("lay-id");
                            if (layid != null && layid != 'main') {
                                element.tabDelete('tab', layid);
                            }
                        });
                        element.tabChange('tab', 'main');
                        break;
                    default:
                        break;
                }
            });

        },
        loginOut: function () {
            var index_confirm = layer.confirm('确认退出登录?', {
                icon: 3,
                title: '提示',
                offset: '150px'
            }, function () {
                layer.close(index_confirm);
                common.fetchGet('logout/', function (res) {
                    if (res.success) {
                        common.setCookie('ZF-TOKEN', "", -1);
                        // window.localStorage.clear();
                        common.setCookie('userInfo', "", -1);
                        location.replace(common.getLocationOrigin() + '/login.html');
                    }
                }, function (err) {

                });
            })
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
        output: function () {
            //dom 事件
            index.domEvent();
            //页面初始执行事件
            index.load();


        }
    };

    exports('index', index);
});
