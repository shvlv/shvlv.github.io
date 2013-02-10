/**
 * jQuery Dichotomy Plugin
 * Copyright 2013, Vladimir Shelmuk
 * Licensed under the MIT license
 *
 *  Plugin constructor and data-API pattern based on Twitter Bootstrap
 *
 */

!function($) {

/* Dichotomy Constructor
 * ========================= */

var Dichotomy = function (element, options) {
    this.$element = $(element);
    this.options = options;

    this.init();
};

Dichotomy.prototype = {
    init: function () {
        var self = this;

        this.count = 0;
        this.level = 0;

        this.$element.data('level', 0);
        this.$element.on('mousewheel MozMousePixelScroll', $.proxy(this.onWheel, this));

        if (this.options.images === undefined) {
            self.options.images = [];
        this.$element.next().children('img').each(function() {
            self.options.images.push( $(this).attr('src') );
        });
        }

        return this;
    },

    onWheel: function (e) {
        var e = e.originalEvent,
            delta = e.wheelDelta || -e.detail;
        if (delta > 0) {
            this.divide();
        } else {
            this.unite();
        }
        e.preventDefault();

    },

    divide: function () {
        if (this.count == this.options.images.length) return this;

        var elem = this.getNext(),
            oldImg = elem.css('background-image'),
            level = elem.data('level') + 1,
            className = elem.hasClass('horizontal') ? 'vertical' : 'horizontal',
            $div = $('<div></div>').addClass(className),
            $div1, $div2,
            d = this.options.duration;

        $div1 = $div.clone().data('level', level)
            .css('background-image', oldImg);
        $div2 = $div.clone().data('level', level)
            .css('background-image', 'url(' + this.options.images[this.count] + ')');
        elem.append($div1, $div2);

        divideAnimate(this.options.animate);
        this.count += 1;
        this.$element.trigger('divide');

        return this;

        function divideAnimate(type) {
            if (type == 'fade') {
                $div1.hide().fadeIn(d);
                $div2.hide().fadeIn(d);
            } else if (type == 'slideSide') {
                if (className == 'horizontal') {
                    $div1.css('width', '100%').animate({'width':'50%'}, d);
                    $div2.css('width', '0').animate({'width':'50%'}, d);
                } else {
                    $div1.css('height', '100%').animate({'height':'50%'}, d);
                    $div2.css('height', '0').animate({'height':'50%'}, d);
                }
            } else if (type == 'slideUp') {
                $div1.hide().slideDown(d);
                $div2.hide().slideDown(d);
            }
        }
    },

    getNext: function () {
        var l = this.level,
            direction = this.options.direction,
            nextElem;

        if (l == 0) {
            this.level++;
            return this.$element;
        }

         nextElem = this.$element.find('div:empty').filter(function () {
             return $(this).data('level') == l;
        });

        if (nextElem.length == 0) {
            this.level += 1;
            return this.getNext();
        } else {
            return (direction == 'clockwise') && nextElem.first() || (direction == 'counter') && nextElem.last();
        }
    },

    unite: function () {
        if (this.level == 0) return this;

        var elem = this.getPrev(),
            $div1 = $(elem.children('div')[0]),
            $div2 = $(elem.children('div')[1]),
            d = this.options.duration,
            self = this;

        uniteAnimate(this.options.animate);
        this.$element.trigger('unite');

        return this;

        function uniteAnimate(type) {
            if (type == 'fade') {
                $div1.fadeOut();
                $div2.fadeOut(emptyElem);
            } else if (type == 'slideSide') {
                if ($div1.hasClass('horizontal')) {
                    $div1.animate({'width':'100%'}, d);
                    $div2.animate({'width':'0'}, d, emptyElem);
                } else {
                    $div1.animate({'height':'100%'}, d );
                    $div2.animate({'height':'0'}, d, emptyElem);
                }
            } else if (type == 'slideUp') {
                $div1.slideUp(d);
                $div2.slideUp(d, emptyElem);
            }

            function emptyElem() {
                elem.empty();
                self.count -= 1;
            }
        }
    },

    getPrev: function () {
        var l = this.level,
            direction = this.options.direction,
            nextElem;

        if (l == 0 && this.$element.has('div').length > 0)  return this.$element;

        nextElem = this.$element.find('div').filter(function () {
            return $(this).data('level') == l;
        }).not(':empty');

        if (nextElem.length === 0) {
            this.level -= 1;
            return this.getPrev();
        } else {
            return  (direction == 'clockwise') && nextElem.last() || (direction == 'counter') && nextElem.first();
        }
    }
};

/* Dichotomy plugin
 * ========================== */

var old = $.fn.dichotomy;

$.fn.dichotomy = function (option) {
    return this.each(function () {
       var $this = $(this),
           data = $this.data('dichotomy'),
           options = $.extend({}, $.fn.dichotomy.defaults,  typeof option == 'object' && option);
       if (!data) $this.data('dichotomy', new Dichotomy(this, options));
       if (typeof option == 'string' && data[option]) data[option]();
    });
};

$.fn.dichotomy.defaults = {
    direction: 'clockwise',
    duration: 400,
    animate: 'fade'};

$.fn.dichotomy.Constructor = Dichotomy;


/* Dichotomy noConflict
 * ==================== */

$.fn.dichotomy.noConflict = function () {
    $.fn.dichotomy = old;
    return this;
};

 /* Dichotomy Data-API
     * ================= */

$(document).on('mousewheel.dichotomy MozMousePixelScroll.dichotomy', '[data-level]', function (e) {
    var $this = $(this),
        options = $.extend({}, $this.data());
        $this.dichotomy(options);
        $this.data('dichotomy').onWheel(e);
});

}(window.jQuery);


