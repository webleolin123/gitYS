/*
* Copyright(C) 2018 Ruijie Network. All rights reserved.
*
* @author gl
* @description ...日历区域滑块选择
* @solution ionc
* @isStatic no
* 参照jquery.range.js 自动滑块组件 做修改
**/
;
(function ($, window, document, undefined) {
    'use strict';
    var jRange = function () {
        return this.init.apply(this, arguments);
    };
    jRange.prototype = {
        defaults: {
            onstatechange: function () {
            },
            showScale: true,
            step: 1,
            format: '%s',
            theme: 'theme-green',
            width: '100%',
            showHour: false,
            disable: false,
            showLabels: true,
            isRange: true,
            scoreType: 100,//默认时间轴展示颜色按照100分制度
            scoreData: []//时间轴颜色值绘画
            // clickDragBack:true
        },
        template: '<div class="slider-container">\
			<div class="back-bar">\
                <div class="selected-bar"></div>\
                <div class="pointer low"></div><div class="pointer-label startTimeLabel" id="startTime">123456</div>\
                <div class="pointer high"></div><div class="pointer-label endTimeLabel" id="endTime">456789</div>\
                <div class="clickable-dummy"></div>\
            </div>\
            <div class="scale"></div>\
            <div class="linerScore"></div>\
            <div class="color-bar"></div>\
		</div>',
        init: function (node, options) {
            this.options = $.extend({}, this.defaults, options);
            this.inputNode = $(node);
            this.options.value = this.inputNode.val() || (this.options.isRange ? this.options.from + ',' + this.options.from : this.options.from);
            this.domNode = $(this.template);
            this.domNode.addClass(this.options.theme);

            this.initHtml();
            this.domNode.on('change', this.onChange);
            this.pointers = $('.pointer', this.domNode);
            this.lowPointer = this.pointers.first();
            this.highPointer = this.pointers.last();
            this.labels = $('.pointer-label', this.domNode);
            this.lowLabel = this.labels.first();
            this.highLabel = this.labels.last();
            this.scale = $('.scale', this.domNode);
            this.bar = $('.selected-bar', this.domNode);
            this.clickableBar = this.domNode.find('.clickable-dummy');
            this.interval = this.options.to - this.options.from;
            this.render();
            // this.setFun();
            if (this.options.clickDragBack) {
                this.options.clickDragBack(this);
            }
            if (this.options.callback) {
                this.options.callback(this);
            }
        },
        colorSet: function (data, scoreType) {
            var num = parseInt(data) || 0;
            var color;
            if (!scoreType || scoreType === 100) {
                if (num <= 59) {
                    color = window.isSimplicitySkin ? '#D82F24' : '#EB4E45';
                } else if (num <= 80) {
                    color = window.isSimplicitySkin ? '#DF7E0E' : '#FAB102'
                } else {
                    color = window.isSimplicitySkin ? '#06C45D' : '#18edd0';
                    // color='red'
                }
            } else if (scoreType === 10) {
                if (num <= 3) {
                    color = window.isSimplicitySkin ? '#D82F24' : '#EB4E45';
                } else if (num <= 7) {
                    color = window.isSimplicitySkin ? '#DF7E0E' : '#FAB102';
                } else {
                    color = window.isSimplicitySkin ? '#06C45D' : '#18edd0';
                }
            }

            return color;
        },
        initHtml: function () {
            this.inputNode.after(this.domNode);
            //导入健康数据  最近24小时 时间间隔是10分钟 ，最近7天 时间间隔是1小时，最近15分钟 时间间隔是10分钟
            var str = '';
            var data = this.options.scoreData;
            var widthLine, colorLine;
            var step = 100 / data.length;//时间粒度
            for (var i = 0; i < data.length; i++) {
                //获取当前的时间
                widthLine = step + '%';
                colorLine = this.colorSet(data[i]['score'], this.options.scoreType);
                str += '<span style="width: ' + widthLine + ';background: ' + colorLine + '"></span>'
            }
            this.domNode.find('.linerScore').html(str);
        },
        render: function () {
            if (this.inputNode.width() === 0 && !this.options.width) {

                return;
            } else {
                this.domNode.width(this.options.width || this.inputNode.width());
                this.inputNode.hide();
            }
            if (this.isSingle()) {
                this.lowPointer.hide();
                this.lowLabel.hide();
                $('.selected-bar').hide();
            }
            if (!this.options.showLabels) {
                this.labels.hide();
            }
            this.attachEvents();
            if (this.options.showScale) {
                this.renderScale();
            }
            this.setValue(this.options.value);
        },
        //时间戳转化
        dataTimeFormat: function (dat) {
            /* if(!data){
             return '';
             }
             var date = new Date(parseInt(data));
             return date.format("yyyy-MM-dd hh:mm")*/

            var date = new Date(dat);
            var fmt = 'yyyy-MM-dd hh:mm';
            if (/(y+)/.test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
            }
            var o = {
                'M+': date.getMonth() + 1,
                'd+': date.getDate(),
                'h+': date.getHours(),
                'm+': date.getMinutes(),
                's+': date.getSeconds()
            };

            // 遍历这个对象
            for (var k in o) {
                if (new RegExp(`(${k})`).test(fmt)) {
                    var str = o[k] + '';
                    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : (('00' + str).substr(str.length)));
                }
            }
            return fmt;
        },
        isSingle: function () {
            if (typeof (this.options.value) === 'number') {
                return true;
            }
            return (this.options.value.indexOf(',') !== -1 || this.options.isRange) ? false : true;
        },
        attachEvents: function () {
            this.clickableBar.click($.proxy(this.barClicked, this));
            this.pointers.on('mousedown touchstart', $.proxy(this.onDragStart, this));
            this.pointers.on('dragstart', function (event) {
                event.preventDefault();
            });
        },
        onDragStart: function (e) {
            if (this.options.disable || (e.type === 'mousedown' && e.which !== 1)) {
                return;
            }
            e.stopPropagation();
            e.preventDefault();
            var pointer = $(e.target);
            this.pointers.removeClass('last-active');
            pointer.addClass('focused last-active');
            this[(pointer.hasClass('low') ? 'low' : 'high') + 'Label'].addClass('focused');
            $(document).on('mousemove.slider touchmove.slider', $.proxy(this.onDrag, this, pointer));
            $(document).on('mouseup.slider touchend.slider touchcancel.slider', $.proxy(this.onDragEnd, this));
        },
        onDrag: function (pointer, e) {
            e.stopPropagation();
            e.preventDefault();
            if (e.originalEvent.touches && e.originalEvent.touches.length) {
                e = e.originalEvent.touches[0];
            } else if (e.originalEvent.changedTouches && e.originalEvent.changedTouches.length) {
                e = e.originalEvent.changedTouches[0];
            }
            var position = e.clientX - this.domNode.offset().left;
            this.domNode.trigger('change', [this, pointer, position]);
        },
        onDragEnd: function (e) {
            this.pointers.removeClass('focused');
            this.labels.removeClass('focused');
            $(document).off('.slider');
            if (this.options.clickDragBack) {
                this.options.clickDragBack(this);
            }
        },
        barClicked: function (e) {
            if (this.options.disable) return;
            var x = e.pageX - this.clickableBar.offset().left;
            if (this.isSingle()) this.setPosition(this.pointers.last(), x, true, true);
            else {
                var pointer = Math.abs(parseInt(this.pointers.first().css('left'), 10) - x + this.pointers.first().width() / 2) < Math.abs(parseInt(this.pointers.last().css('left'), 10) - x + this.pointers.first().width() / 2) ? this.pointers.first() : this.pointers.last();
                this.setPosition(pointer, x, true, true);
            }
            if (this.options.clickDragBack) {
                this.options.clickDragBack(this);
            }
        },
        onChange: function (e, self, pointer, position) {
            var min, max;
            if (self.isSingle()) {
                min = 0;
                max = self.domNode.width();
            } else {
                min = pointer.hasClass('high') ? self.lowPointer.position().left + self.lowPointer.width() / 2 : 0;
                max = pointer.hasClass('low') ? self.highPointer.position().left + self.highPointer.width() / 2 : self.domNode.width();
            }
            var value = Math.min(Math.max(position, min), max);
            self.setPosition(pointer, value, true);
        },
        setPosition: function (pointer, position, isPx, animate) {
            var leftPos, lowPos = this.lowPointer.position().left,
                highPos = this.highPointer.position().left,
                circleWidth = this.highPointer.width() / 2;
            if (!isPx) {
                position = this.prcToPx(position);
            }
            if (pointer[0] === this.highPointer[0]) {
                highPos = Math.round(position - circleWidth);
            } else {
                lowPos = Math.round(position - circleWidth);
            }
            pointer[animate ? 'animate' : 'css']({
                'left': Math.round(position - circleWidth)
            });
            if (this.isSingle()) {
                leftPos = 0;
            } else {
                leftPos = lowPos + circleWidth;
            }
            this.bar[animate ? 'animate' : 'css']({
                'width': Math.round(highPos + circleWidth - leftPos),
                'left': leftPos
            });
            this.showPointerValue(pointer, position, animate);
            this.isReadonly();
        },
        setValue: function (value) {
            var values = value.toString().split(',');
            this.options.value = value;
            var prc = this.valuesToPrc(values.length === 2 ? values : [0, values[0]]);
            if (this.isSingle()) {
                this.setPosition(this.highPointer, prc[1]);
            } else {
                this.setPosition(this.lowPointer, prc[0]);
                this.setPosition(this.highPointer, prc[1]);
            }
        },
        renderScale: function () {
            var s = this.options.scale || [this.options.from, this.options.to];
            var prc = Math.round((100 / (s.length - 1)) * 10) / 10;
            var str = '';
            for (var i = 0; i < s.length; i++) {
                if (!this.options.showHour) {
                    str += '<span style="left: ' + i * prc + '%">' + (s[i] != '|' ? '<ins>' + this.dataTimeFormat(s[i]) + '</ins>' : '') + '</span>';
                } else {
                    str += '<span style="left: ' + i * prc + '%">' + (s[i] != '|' ? '<ins>' + this.dataTimeFormat(s[i]).substring(11) + '</ins>' : '') + '</span>';
                }
            }
            this.scale.html(str);
            $('ins', this.scale).each(function () {
                $(this).css({
                    marginLeft: -$(this).outerWidth() / 2
                });
            });
        },
        getBarWidth: function () {
            var values = this.options.value.split(',');
            if (values.length > 1) {
                return parseInt(values[1], 10) - parseInt(values[0], 10);
            } else {
                return parseInt(values[0], 10);
            }
        },
        showPointerValue: function (pointer, position, animate) {
            var label = $('.pointer-label', this.domNode)[pointer.hasClass('low') ? 'first' : 'last']();
            var text;
            var value = this.positionToValue(position);
            if ($.isFunction(this.options.format)) {
                var type = this.isSingle() ? undefined : (pointer.hasClass('low') ? 'low' : 'high');
                text = this.options.format(value, type);
            } else {
                text = this.options.format.replace('%s', value);
            }
            // var width = label.html(text).width(),
            var width = label.width(),
                left = position - width / 2;
            if ($(label[0]).attr('id') == 'endTime') {
                var str = '';
                str += '<p>' + this.dataTimeFormat(parseInt(text)).substring(11, 16) + '</p>';
                str += '<p>' + this.dataTimeFormat(parseInt(text)).substring(0, 10) + '</p>';
                label.html(str);
                label.attr('data-timeline', parseInt(text));
            } else {
                label.html(this.dataTimeFormat(parseInt(text)));
                label.attr('data-timeline', parseInt(text));
            }
            // left = Math.min(Math.max(left, 0), this.options.width - width);
            label[animate ? 'animate' : 'css']({
                left: left
            });
            this.setInputValue(pointer, value);
        },
        valuesToPrc: function (values) {
            var lowPrc = ((values[0] - this.options.from) * 100 / this.interval),
                highPrc = ((values[1] - this.options.from) * 100 / this.interval);
            return [lowPrc, highPrc];
        },
        prcToPx: function (prc) {
            return (this.domNode.width() * prc) / 100;
        },
        positionToValue: function (pos) {
            var value = (pos / this.domNode.width()) * this.interval;
            value = value + this.options.from;
            return Math.round(value / this.options.step) * this.options.step;
        },
        setInputValue: function (pointer, v) {
            if (this.isSingle()) {
                this.options.value = this.dataTimeFormat(v.toString());
            } else {
                var values = this.options.value.split(',');
                if (pointer.hasClass('low')) {
                    this.options.value = this.dataTimeFormat(v) + ',' + this.dataTimeFormat(values[1]);
                } else {
                    this.options.value = this.dataTimeFormat(values[0]) + ',' + this.dataTimeFormat(v);
                }
            }
            if (this.inputNode.val() !== this.options.value) {
                this.inputNode.val(this.options.value);
                this.options.onstatechange.call(this, this.options.value);
            }
        },
        getValue: function () {
            return this.options.value;
        },
        isReadonly: function () {
            this.domNode.toggleClass('slider-readonly', this.options.disable);
        },
        disable: function () {
            this.options.disable = true;
            this.isReadonly();
        },
        enable: function () {
            this.options.disable = false;
            this.isReadonly();
        },
        toggleDisable: function () {
            this.options.disable = !this.options.disable;
            this.isReadonly();
        }
    };
    var pluginName = 'jRange';
    $.fn[pluginName] = function (option) {
        var args = arguments,
            result;
        this.each(function () {
            var $this = $(this),
                data = $.data(this, 'plugin_' + pluginName),
                options = typeof option === 'object' && option;
            if (!data) {
                $this.data('plugin_' + pluginName, (data = new jRange(this, options)));
                $(window).resize(function () {
                    /*debugger
                     data.setValue(data.getValue());*/
                    // data.domNode.on('change', data.onChange);
                });
            }
            if (typeof option === 'string') {
                result = data[option].apply(data, Array.prototype.slice.call(args, 1));
            }
        });
        // return result || this;
        return result || this.data('plugin_' + pluginName);//将返回值变成jquery对象
    };
})(jQuery, window, document);
