/*
 *
 * @author
 * @description ...jquery自定义组件方法
 * 依赖 jquery
 *
 **/

(function ($) {
    //可见区域加载
    $.fn.scrollLoading = function (options) {
        var defaults = {
            attr: "data-url",
            container: $(window),
            callback: $.noop,
            preloadHeight: 0
        };
        var params = $.extend({}, defaults, options || {});
        params.cache = [];
        $(this).each(function () {
            var node = this.nodeName.toLowerCase(), url = $(this).attr(params["attr"]);
            //重组
            var data = {
                obj: $(this),
                tag: node,
                url: url
            };
            params.cache.push(data);
        });
        var callback = function (call) {
            if ($.isFunction(params.callback)) {
                params.callback.call(call.get(0));
            }
        };
        //动态显示数据
        var loading = function () {
            var preloadHeight = params.preloadHeight;
            var contHeight = params.container.height();
            var contop = '';
            if ($(window).get(0) === window) {
                contop = $(window).scrollTop();
            } else {
                contop = params.container.offset().top;
            }
            var flag = true;
            $.each(params.cache, function (i, data) {
                var o = data.obj, tag = data.tag, url = data.url, post, posb;
                if (o) {
                    post = o.offset().top - contop, post + o.height();
                    if (o.is(':visible') && (post >= 0 && post - preloadHeight < contHeight) || (posb > 0 && posb <= contHeight)) {
                        if (url) {
                            //在浏览器窗口内
                            if (tag === "img") {
                                //图片，改变src
                                callback(o.attr("src", url));
                            } else {
                                o.load(url, {}, function () {
                                    callback(o);
                                });
                            }
                        } else {
                            // 无地址，直接触发回调
                            callback(o);
                        }
                        data.obj = null;
                    } else {
                        flag = false;
                    }
                }
            });
            if (flag) {
                params.container.unbind("scroll", loading);
            }
        };
        //事件触发
        //加载完毕即执行
        loading();
        //滚动执行
        params.container.bind("scroll", loading);
    };
    $.fn.heightLight = function (options) {
        var dataop = {
            ocolor: 'red',
            oshuru: 'df',
        };
        var chuancan = $.extend(dataop, options);
        $(this).each(function () {
            var _this = $(this)
            _this.find($(".glnow")).each(function () {
                $(this).css({color: ""});
            });
        });
        if (chuancan.oshuru == '') {
            return false;
        } else {
            var regExp = new RegExp("(" + chuancan.oshuru.replace(/[(){}.+*?^$|\\\[\]]/g, "\\$&") + ")", "ig");
            $(this).each(function () {
                var _this1 = $(this)
                var html = _this1.html();
                var newHtml = html.replace(regExp, '<span class="glnow" style="color:' + chuancan.ocolor + ';display: inline-block">' + chuancan.oshuru + '</span>');
                _this1.html(newHtml);
            });
        }
    }
    $.fn.extend({
        //获取隐藏区域位置属性值
        actual: function (method, options) {
            if (!this[method]) {
                throw '$.actual => The jQuery method "' + method + '" you called does not exist';
            }
            var defaults = {
                absolute: false,
                clone: false,
                includeMargin: false,
                display: 'block'
            };
            var configs = $.extend(defaults, options);
            var $target = this.eq(0);
            var fix, restore;
            if (configs.clone === true) {
                fix = function () {
                    var style = 'position: absolute !important; top: -1000 !important; ';
                    $target = $target.clone().attr('style', style).appendTo('body');
                };
                restore = function () {
                    $target.remove();
                };
            } else {
                var tmp = [];
                var style = '';
                var $hidden;
                fix = function () {
                    $hidden = $target.parents().addBack().filter(':hidden');
                    style += 'visibility: hidden !important; display: ' + configs.display + ' !important; ';
                    if (configs.absolute === true) style += 'position: absolute !important; ';
                    $hidden.each(function () {
                        var $this = $(this);
                        var thisStyle = $this.attr('style');
                        tmp.push(thisStyle);
                        $this.attr('style', thisStyle ? thisStyle + ';' + style : style);
                    });
                };
                restore = function () {
                    $hidden.each(function (i) {
                        var $this = $(this);
                        var _tmp = tmp[i];

                        if (_tmp === undefined) {
                            $this.removeAttr('style');
                        } else {
                            $this.attr('style', _tmp);
                        }
                    });
                };
            }
            fix();
            var actual = /(outer)/.test(method) ?
                $target[method](configs.includeMargin) :
                $target[method]();
            restore();
            return actual;
        }
    });

})(jQuery);

