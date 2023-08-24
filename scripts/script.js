(function () {
    var on = addEventListener, $ = function (q) { return document.querySelector(q) }, $$ = function (q) { return document.querySelectorAll(q) }, $body = document.body, $inner = $('.inner'), client = (function () {
        var o = {
            browser: 'other', browserVersion: 0, os: 'other', osVersion: 0, mobile: false, canUse: null, flags: { lsdUnits: false, },
        }, ua = navigator.userAgent, a, i;
        a = [['firefox', /Firefox\/([0-9\.]+)/], ['edge', /Edge\/([0-9\.]+)/], ['safari', /Version\/([0-9\.]+).+Safari/], ['chrome', /Chrome\/([0-9\.]+)/], ['chrome', /CriOS\/([0-9\.]+)/], ['ie', /Trident\/.+rv:([0-9]+)/]];
        for (i = 0; i < a.length; i++) {
            if (ua.match(a[i][1])) {
                o.browser = a[i][0];
                o.browserVersion = parseFloat(RegExp.$1);
                break;
            }
        } a = [['ios', /([0-9_]+) like Mac OS X/, function (v) {
            return v.replace('_', '.').replace('_', '');
        }], ['ios', /CPU like Mac OS X/, function (v) { return 0 }], ['ios', /iPad; CPU /, function (v) { return 0 }], ['android', /Android ([0-9\.]+)/, null], ['mac', /Macintosh.+Mac OS X ([0-9_]+)/, function (v) {
            return v.replace('_', '.').replace('_', '');
        }], ['windows', /Windows NT ([0-9\.]+)/, null], ['undefined', /Undefined/, null],];
        for (i = 0; i < a.length; i++) {
            if (ua.match(a[i][1])) {
                o.os = a[i][0];
                o.osVersion = parseFloat(a[i][2] ? (a[i][2])(RegExp.$1) : RegExp.$1);
                break;
            }
        } if (o.os == 'mac' && ('ontouchstart' in window) && ((screen.width == 1024 && screen.height == 1366) || (screen.width == 834 && screen.height == 1112) || (screen.width == 810 && screen.height == 1080) || (screen.width == 768 && screen.height == 1024))) o.os = 'ios';
        o.mobile = (o.os == 'android' || o.os == 'ios');
        var _canUse = document.createElement('div');
        o.canUse = function (property, value) {
            var style;
            style = _canUse.style;
            if (!(property in style)) return false;
            if (typeof value !== 'undefined') {
                style[property] = value;
                if (style[property] == '') return false;
            } return true;
        };
        o.flags.lsdUnits = o.canUse('width', '100dvw');
        return o;
    }()), trigger = function (t) {
        dispatchEvent(new Event(t));
    }, cssRules = function (selectorText) {
        var ss = document.styleSheets, a = [], f = function (s) {
            var r = s.cssRules, i;
            for (i = 0; i < r.length; i++) {
                if (r[i] instanceof CSSMediaRule && matchMedia(r[i].conditionText).matches) (f)(r[i]);
                else if (r[i] instanceof CSSStyleRule && r[i].selectorText == selectorText) a.push(r[i]);
            }
        }, x, i;
        for (i = 0; i < ss.length; i++) f(ss[i]);
        return a;
    }, thisHash = function () {
        var h = location.hash ? location.hash.substring(1) : null, a;
        if (!h) return null;
        if (h.match(/\?/)) {
            a = h.split('?');
            h = a[0];
            history.replaceState(undefined, undefined, '#' + h);
            window.location.search = a[1];
        } if (h.length > 0 && !h.match(/^[a-zA-Z]/)) h = 'x' + h;
        if (typeof h == 'string') h = h.toLowerCase();
        return h;
    }, scrollToElement = function (e, style, duration) {
        var y, cy, dy, start, easing, offset, f;
        if (!e) y = 0;
        else {
            offset = (e.dataset.scrollOffset ? parseInt(e.dataset.scrollOffset) : 0) * parseFloat(getComputedStyle(document.documentElement).fontSize);
            switch (e.dataset.scrollBehavior ? e.dataset.scrollBehavior : 'default') {
                case 'default': default: y = e.offsetTop + offset;
                    break;
                case 'center': if (e.offsetHeight < window.innerHeight) y = e.offsetTop - ((window.innerHeight - e.offsetHeight) / 2) + offset;
                else y = e.offsetTop - offset;
                    break;
                case 'previous': if (e.previousElementSibling) y = e.previousElementSibling.offsetTop + e.previousElementSibling.offsetHeight + offset;
                else y = e.offsetTop + offset;
                    break;
            }
        } if (!style) style = 'smooth';
        if (!duration) duration = 750;
        if (style == 'instant') {
            window.scrollTo(0, y);
            return;
        } start = Date.now();
        cy = window.scrollY;
        dy = y - cy;
        switch (style) {
            case 'linear': easing = function (t) { return t };
                break;
            case 'smooth': easing = function (t) { return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1 };
                break;
        }            f = function () {
            var t = Date.now() - start;
            if (t >= duration) window.scroll(0, y);
            else {
                window.scroll(0, cy + (dy * easing(t / duration)));
                requestAnimationFrame(f);
            }
        };
        f();
    }, scrollToTop = function () {
        scrollToElement(null);
    }, loadElements = function (parent) {
        var a, e, x, i;
        a = parent.querySelectorAll('iframe[data-src]:not([data-src=""])');
        for (i = 0; i < a.length; i++) {
            a[i].contentWindow.location.replace(a[i].dataset.src);
            a[i].dataset.initialSrc = a[i].dataset.src;
            a[i].dataset.src = '';
        } a = parent.querySelectorAll('video[autoplay]');
        for (i = 0; i < a.length; i++) {
            if (a[i].paused) a[i].play();
        } e = parent.querySelector('[data-autofocus="1"]');
        x = e ? e.tagName : null;
        switch (x) {
            case 'FORM': e = e.querySelector('.field input, .field select, .field textarea');
                if (e) e.focus();
                break;
            default: break;
        }
    }, unloadElements = function (parent) {
        var a, e, x, i;
        a = parent.querySelectorAll('iframe[data-src=""]');
        for (i = 0; i < a.length; i++) {
            if (a[i].dataset.srcUnload === '0') continue;
            if ('initialSrc' in a[i].dataset) a[i].dataset.src = a[i].dataset.initialSrc;
            else a[i].dataset.src = a[i].src;
            a[i].contentWindow.location.replace('about:blank');
        } a = parent.querySelectorAll('video');
        for (i = 0; i < a.length; i++) {
            if (!a[i].paused) a[i].pause();
        } e = $(':focus');
        if (e) e.blur();
    };
    window._scrollToTop = scrollToTop;
    var thisURL = function () {
        return window.location.href.replace(window.location.search, '').replace(/#$/, '');
    };
    var getVar = function (name) {
        var a = window.location.search.substring(1).split('&'), b, k;
        for (k in a) {
            b = a[k].split('=');
            if (b[0] == name) return b[1];
        } return null;
    };
    var errors = {
        handle: function (handler) {
            window.onerror = function (message, url, line, column, error) {
                (handler)(error.message);
                return true;
            };
        }, unhandle: function () {
            window.onerror = null;
        }
    };
    on('load', function () {
        setTimeout(function () {
            $body.className = $body.className.replace(/\bis-loading\b/, 'is-playing');
            setTimeout(function () {
                $body.className = $body.className.replace(/\bis-playing\b/, 'is-ready');
            }, 2750);
        }, 100);
    });
    loadElements(document.body);
    var style, sheet, rule;
    style = document.createElement('style');
    style.appendChild(document.createTextNode(''));
    document.head.appendChild(style);
    sheet = style.sheet;
    if (client.mobile) {
        (function () {
            if (client.flags.lsdUnits) {
                document.documentElement.style.setProperty('--viewport-height', '100dvh');
                document.documentElement.style.setProperty('--background-height', '100lvh');
            } else {
                var f = function () {
                    document.documentElement.style.setProperty('--viewport-height', window.innerHeight + 'px');
                    document.documentElement.style.setProperty('--background-height', (window.innerHeight + 250) + 'px');
                };
                on('load', f);
                on('resize', f);
                on('orientationchange', function () {
                    setTimeout(function () {
                        (f)();
                    }, 100);
                });
            }
        })();
    } if (client.os == 'android') {
        (function () {
            sheet.insertRule('body::after { }', 0);
            rule = sheet.cssRules[0];
            var f = function () {
                rule.style.cssText = 'height: ' + (Math.max(screen.width, screen.height)) + 'px';
            };
            on('load', f);
            on('orientationchange', f);
            on('touchmove', f);
        })();
        $body.classList.add('is-touch');
    } else if (client.os == 'ios') {
        if (client.osVersion <= 11) (function () {
            sheet.insertRule('body::after { }', 0);
            rule = sheet.cssRules[0];
            rule.style.cssText = '-webkit-transform: scale(1.0)';
        })();
        if (client.osVersion <= 11) (function () {
            sheet.insertRule('body.ios-focus-fix::before { }', 0);
            rule = sheet.cssRules[0];
            rule.style.cssText = 'height: calc(100% + 60px)';
            on('focus', function (event) {
                $body.classList.add('ios-focus-fix');
            }, true);
            on('blur', function (event) {
                $body.classList.remove('ios-focus-fix');
            }, true);
        })();
        $body.classList.add('is-touch');
    } function slideshowBackground(id, settings) {
        var _this = this;
        if (!('images' in settings) || !('target' in settings)) return;
        this.id = id;
        this.wait = ('wait' in settings ? settings.wait : 0);
        this.defer = ('defer' in settings ? settings.defer : false);
        this.transition = ('transition' in settings ? settings.transition : { style: 'crossfade', speed: 1000, delay: 3000 });
        this.images = settings.images;
        this.preload = true;
        this.$target = $(settings.target);
        this.$wrapper = null;
        this.pos = 0;
        this.lastPos = 0;
        this.$slides = [];
        this.img = document.createElement('img');
        this.preloadTimeout = null;
        switch (this.transition.style) {
            case 'crossfade': this.transition.delay = Math.max(this.transition.delay, this.transition.speed * 2);
                break;
            case 'fade': this.transition.delay = Math.max(this.transition.delay, this.transition.speed * 3);
                break;
            case 'instant': default: break;
        }        if (this.defer) {
            scrollEvents.add({
                element: this.$target, enter: function () {
                    _this.preinit();
                }
            });
        } else {
            this.preinit();
        }
    };
    slideshowBackground.prototype.speedClassName = function (speed) {
        switch (speed) {
            case 1: return 'slow';
            default: case 2: return 'normal';
            case 3: return 'fast';
        }
    };
    slideshowBackground.prototype.preinit = function () {
        var _this = this;
        if (this.preload) {
            this.preloadTimeout = setTimeout(function () {
                _this.$target.classList.add('is-loading');
            }, this.transition.speed);
            setTimeout(function () {
                _this.init();
            }, 0);
        } else {
            this.init();
        }
    };
    slideshowBackground.prototype.init = function () {
        var _this = this, loaded = 0, $slide, intervalId, i;
        this.$target.classList.add('slideshow-background');
        this.$target.classList.add(this.transition.style);
        for (i = 0;
            i < this.images.length;
            i++) {
            if (this.preload) {
                this.$img = document.createElement('img');
                this.$img.src = this.images[i].src;
                this.$img.addEventListener('load', function (event) {
                    loaded++;
                });
            } $slide = document.createElement('div');
            $slide.style.backgroundImage = 'url(\'' + this.images[i].src + '\')';
            $slide.style.backgroundPosition = this.images[i].position;
            $slide.setAttribute('role', 'img');
            $slide.setAttribute('aria-label', this.images[i].caption);
            this.$target.appendChild($slide);
            if (this.images[i].motion != 'none') {
                $slide.classList.add(this.images[i].motion);
                $slide.classList.add(this.speedClassName(this.images[i].speed));
            } this.$slides.push($slide);
        } if (this.preload) intervalId = setInterval(function () {
            if (loaded >= _this.images.length) {
                clearInterval(intervalId);
                clearTimeout(_this.preloadTimeout);
                _this.$target.classList.remove('is-loading');
                _this.start();
            }
        }, 250);
        else {
            this.start();
        }
    };
    slideshowBackground.prototype.start = function () {
        var _this = this;
        this.$slides[_this.pos].classList.add('visible');
        this.$slides[_this.pos].classList.add('top');
        this.$slides[_this.pos].classList.add('initial');
        this.$slides[_this.pos].classList.add('is-playing');
        if (this.$slides.length == 1) return;
        setTimeout(function () {
            setInterval(function () {
                _this.lastPos = _this.pos;
                _this.pos = _this.pos + 1;
                if (_this.pos >= _this.$slides.length) _this.pos = 0;
                switch (_this.transition.style) {
                    case 'instant': _this.$slides[_this.lastPos].classList.remove('top');
                        _this.$slides[_this.pos].classList.add('top');
                        _this.$slides[_this.pos].classList.add('visible');
                        _this.$slides[_this.pos].classList.add('is-playing');
                        _this.$slides[_this.lastPos].classList.remove('visible');
                        _this.$slides[_this.lastPos].classList.remove('initial');
                        _this.$slides[_this.lastPos].classList.remove('is-playing');
                        break;
                    case 'crossfade': _this.$slides[_this.lastPos].classList.remove('top');
                        _this.$slides[_this.pos].classList.add('top');
                        _this.$slides[_this.pos].classList.add('visible');
                        _this.$slides[_this.pos].classList.add('is-playing');
                        setTimeout(function () {
                            _this.$slides[_this.lastPos].classList.remove('visible');
                            _this.$slides[_this.lastPos].classList.remove('initial');
                            _this.$slides[_this.lastPos].classList.remove('is-playing');
                        }, _this.transition.speed);
                        break;
                    case 'fade': _this.$slides[_this.lastPos].classList.remove('visible');
                        setTimeout(function () {
                            _this.$slides[_this.lastPos].classList.remove('is-playing');
                            _this.$slides[_this.lastPos].classList.remove('top');
                            _this.$slides[_this.pos].classList.add('top');
                            _this.$slides[_this.pos].classList.add('is-playing');
                            _this.$slides[_this.pos].classList.add('visible');
                        }, _this.transition.speed);
                        break;
                    default: break;
                }
            }, _this.transition.delay);
        }, this.wait);
    };
    (function () {
        var $bg = document.createElement('div');
        $bg.id = 'bg';
        $body.insertBefore($bg, $body.firstChild);
        new slideshowBackground('bg', {
            target: '#bg', wait: 2750, transition: { style: 'crossfade', speed: 2000, delay: 7000, }, images: [{ src: 'assets/images/bg-23b8d2c5.jpg?v=7e2e91b5', position: 'center', motion: 'down', speed: 2, caption: 'Untitled', }, { src: 'assets/images/bg-5ca14072.jpg?v=7e2e91b5', position: 'center', motion: 'right', speed: 2, caption: 'Untitled', }, { src: 'assets/images/bg-17d5f5e6.jpg?v=7e2e91b5', position: 'center', motion: 'left', speed: 2, caption: 'Untitled', },]
        });
    })();

})();
