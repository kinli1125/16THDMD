var cvpHandlers = {
    canvasClickHandler: null,
    videoTimeUpdateHandler: null,
    videoCanPlayHandler: null,
    windowResizeHandler: null
}
  , CanvasVideoPlayer = function(e) {
    var i;
    this.options = {
        framesPerSecond: 25,
        hideVideo: !0,
        autoplay: !1,
        makeLoop: !1,
        pauseOnClick: !0,
        audio: !1,
        timelineSelector: !1,
        resetOnLastFrame: !0
    };
    for (i in e)
        this.options[i] = e[i];
    if (this.video = document.querySelector(this.options.videoSelector),
    this.canvas = document.querySelector(this.options.canvasSelector),
    this.timeline = document.querySelector(this.options.timelineSelector),
    this.timelinePassed = document.querySelector(this.options.timelineSelector + "> div"),
    !this.options.videoSelector || !this.video)
        return void console.error('No "videoSelector" property, or the element is not found');
    if (!this.options.canvasSelector || !this.canvas)
        return void console.error('No "canvasSelector" property, or the element is not found');
    if (this.options.timelineSelector && !this.timeline)
        return void console.error('Element for the "timelineSelector" selector not found');
    if (this.options.timelineSelector && !this.timelinePassed)
        return void console.error('Element for the "timelinePassed" not found');
    if (this.options.audio) {
        if ("string" == typeof this.options.audio) {
            if (this.audio = document.querySelectorAll(this.options.audio)[0],
            !this.audio)
                return void console.error('Element for the "audio" not found')
        } else
            this.audio = document.createElement("audio"),
            this.audio.innerHTML = this.video.innerHTML,
            this.video.parentNode.insertBefore(this.audio, this.video),
            this.audio.load();
        var t = /iPad|iPhone|iPod/.test(navigator.platform);
        t && (this.options.autoplay = !1)
    }
    this.ctx = this.canvas.getContext("2d"),
    this.playing = !1,
    this.resizeTimeoutReference = !1,
    this.RESIZE_TIMEOUT = 1e3,
    this.init(),
    this.bind()
};
CanvasVideoPlayer.prototype.init = function() {
    this.video.load(),
    this.setCanvasSize(),
    this.options.hideVideo && (this.video.style.display = "none")
}
,
CanvasVideoPlayer.prototype.getOffset = function(e) {
    var i, t, o;
    if (e)
        return t = e.getBoundingClientRect(),
        t.width || t.height || e.getClientRects().length ? (o = e.ownerDocument,
        i = o.documentElement,
        {
            top: t.top + window.pageYOffset - i.clientTop,
            left: t.left + window.pageXOffset - i.clientLeft
        }) : void 0
}
,
CanvasVideoPlayer.prototype.jumpTo = function(e) {
    this.video.currentTime = this.video.duration * e,
    this.options.audio && (this.audio.currentTime = this.audio.duration * e)
}
,
CanvasVideoPlayer.prototype.bind = function() {
    var e = this;
    this.options.pauseOnClick === !0 && this.canvas.addEventListener("click", cvpHandlers.canvasClickHandler = function() {
        e.playPause()
    }
    ),
    this.video.addEventListener("timeupdate", cvpHandlers.videoTimeUpdateHandler = function() {
        e.drawFrame(),
        e.options.timelineSelector && e.updateTimeline()
    }
    ),
    this.video.addEventListener("canplay", cvpHandlers.videoCanPlayHandler = function() {
        e.drawFrame()
    }
    ),
    this.video.readyState >= 2 && e.drawFrame(),
    e.options.autoplay && e.play(),
    e.options.timelineSelector && this.timeline.addEventListener("click", function(i) {
        var t = i.clientX - e.getOffset(e.canvas).left
          , o = t / e.timeline.offsetWidth;
        e.jumpTo(o)
    }),
    window.addEventListener("resize", cvpHandlers.windowResizeHandler = function() {
        clearTimeout(e.resizeTimeoutReference),
        e.resizeTimeoutReference = setTimeout(function() {
            e.setCanvasSize(),
            e.drawFrame()
        }, e.RESIZE_TIMEOUT)
    }
    ),
    this.unbind = function() {
        this.canvas.removeEventListener("click", cvpHandlers.canvasClickHandler),
        this.video.removeEventListener("timeupdate", cvpHandlers.videoTimeUpdateHandler),
        this.video.removeEventListener("canplay", cvpHandlers.videoCanPlayHandler),
        window.removeEventListener("resize", cvpHandlers.windowResizeHandler),
        this.options.audio && this.audio.parentNode.removeChild(this.audio)
    }
}
,
CanvasVideoPlayer.prototype.updateTimeline = function() {
    var e = (100 * this.video.currentTime / this.video.duration).toFixed(2);
    this.timelinePassed.style.width = e + "%"
}
,
CanvasVideoPlayer.prototype.setCanvasSize = function() {
    this.width = this.canvas.clientWidth,
    this.height = this.canvas.clientHeight,
    this.canvas.setAttribute("width", this.width),
    this.canvas.setAttribute("height", this.height)
}
,
CanvasVideoPlayer.prototype.play = function() {
    this.lastTime = Date.now(),
    this.playing = !0,
    this.loop(),
    this.options.audio && (this.audio.currentTime = this.video.currentTime,
    this.audio.play())
}
,
CanvasVideoPlayer.prototype.pause = function() {
    this.playing = !1,
    this.options.audio && this.audio.pause()
}
,
CanvasVideoPlayer.prototype.playPause = function() {
    this.playing ? this.pause() : this.play()
}
,
CanvasVideoPlayer.prototype.loop = function() {
    var e = this
      , i = Date.now()
      , t = (i - this.lastTime) / 1e3;
    t >= 1 / this.options.framesPerSecond && (this.video.currentTime = this.video.currentTime + t,
    this.lastTime = i,
    this.audio && Math.abs(this.audio.currentTime - this.video.currentTime) > .3 && (this.audio.currentTime = this.video.currentTime)),
    this.video.currentTime >= this.video.duration && (this.options.makeLoop === !1 && (this.playing = !1),
    this.options.resetOnLastFrame === !0 && (this.video.currentTime = 0)),
    this.playing ? this.animationFrame = requestAnimationFrame(function() {
        e.loop()
    }) : cancelAnimationFrame(this.animationFrame)
}
,
CanvasVideoPlayer.prototype.drawFrame = function() {
    this.ctx.drawImage(this.video, 0, 0, this.width, this.height)
}
;
/*!
 * Isotope PACKAGED v3.0.4
 *
 * Licensed GPLv3 for open source use
 * or Isotope Commercial License for commercial use
 *
 * http://isotope.metafizzy.co
 * Copyright 2017 Metafizzy
 */
!function(t, e) {
    "function" == typeof define && define.amd ? define("jquery-bridget/jquery-bridget", ["jquery"], function(i) {
        return e(t, i)
    }) : "object" == typeof module && module.exports ? module.exports = e(t, require("jquery")) : t.jQueryBridget = e(t, t.jQuery)
}(window, function(t, e) {
    "use strict";
    function i(i, s, a) {
        function u(t, e, o) {
            var n, s = "$()." + i + '("' + e + '")';
            return t.each(function(t, u) {
                var h = a.data(u, i);
                if (!h)
                    return void r(i + " not initialized. Cannot call methods, i.e. " + s);
                var d = h[e];
                if (!d || "_" == e.charAt(0))
                    return void r(s + " is not a valid method");
                var l = d.apply(h, o);
                n = void 0 === n ? l : n
            }),
            void 0 !== n ? n : t
        }
        function h(t, e) {
            t.each(function(t, o) {
                var n = a.data(o, i);
                n ? (n.option(e),
                n._init()) : (n = new s(o,e),
                a.data(o, i, n))
            })
        }
        a = a || e || t.jQuery,
        a && (s.prototype.option || (s.prototype.option = function(t) {
            a.isPlainObject(t) && (this.options = a.extend(!0, this.options, t))
        }
        ),
        a.fn[i] = function(t) {
            if ("string" == typeof t) {
                var e = n.call(arguments, 1);
                return u(this, t, e)
            }
            return h(this, t),
            this
        }
        ,
        o(a))
    }
    function o(t) {
        !t || t && t.bridget || (t.bridget = i)
    }
    var n = Array.prototype.slice
      , s = t.console
      , r = "undefined" == typeof s ? function() {}
    : function(t) {
        s.error(t)
    }
    ;
    return o(e || t.jQuery),
    i
}),
function(t, e) {
    "function" == typeof define && define.amd ? define("ev-emitter/ev-emitter", e) : "object" == typeof module && module.exports ? module.exports = e() : t.EvEmitter = e()
}("undefined" != typeof window ? window : this, function() {
    function t() {}
    var e = t.prototype;
    return e.on = function(t, e) {
        if (t && e) {
            var i = this._events = this._events || {}
              , o = i[t] = i[t] || [];
            return o.indexOf(e) == -1 && o.push(e),
            this
        }
    }
    ,
    e.once = function(t, e) {
        if (t && e) {
            this.on(t, e);
            var i = this._onceEvents = this._onceEvents || {}
              , o = i[t] = i[t] || {};
            return o[e] = !0,
            this
        }
    }
    ,
    e.off = function(t, e) {
        var i = this._events && this._events[t];
        if (i && i.length) {
            var o = i.indexOf(e);
            return o != -1 && i.splice(o, 1),
            this
        }
    }
    ,
    e.emitEvent = function(t, e) {
        var i = this._events && this._events[t];
        if (i && i.length) {
            var o = 0
              , n = i[o];
            e = e || [];
            for (var s = this._onceEvents && this._onceEvents[t]; n; ) {
                var r = s && s[n];
                r && (this.off(t, n),
                delete s[n]),
                n.apply(this, e),
                o += r ? 0 : 1,
                n = i[o]
            }
            return this
        }
    }
    ,
    t
}),
function(t, e) {
    "use strict";
    "function" == typeof define && define.amd ? define("get-size/get-size", [], function() {
        return e()
    }) : "object" == typeof module && module.exports ? module.exports = e() : t.getSize = e()
}(window, function() {
    "use strict";
    function t(t) {
        var e = parseFloat(t)
          , i = t.indexOf("%") == -1 && !isNaN(e);
        return i && e
    }
    function e() {}
    function i() {
        for (var t = {
            width: 0,
            height: 0,
            innerWidth: 0,
            innerHeight: 0,
            outerWidth: 0,
            outerHeight: 0
        }, e = 0; e < h; e++) {
            var i = u[e];
            t[i] = 0
        }
        return t
    }
    function o(t) {
        var e = getComputedStyle(t);
        return e || a("Style returned " + e + ". Are you running this code in a hidden iframe on Firefox? See http://bit.ly/getsizebug1"),
        e
    }
    function n() {
        if (!d) {
            d = !0;
            var e = document.createElement("div");
            e.style.width = "200px",
            e.style.padding = "1px 2px 3px 4px",
            e.style.borderStyle = "solid",
            e.style.borderWidth = "1px 2px 3px 4px",
            e.style.boxSizing = "border-box";
            var i = document.body || document.documentElement;
            i.appendChild(e);
            var n = o(e);
            s.isBoxSizeOuter = r = 200 == t(n.width),
            i.removeChild(e)
        }
    }
    function s(e) {
        if (n(),
        "string" == typeof e && (e = document.querySelector(e)),
        e && "object" == typeof e && e.nodeType) {
            var s = o(e);
            if ("none" == s.display)
                return i();
            var a = {};
            a.width = e.offsetWidth,
            a.height = e.offsetHeight;
            for (var d = a.isBorderBox = "border-box" == s.boxSizing, l = 0; l < h; l++) {
                var f = u[l]
                  , c = s[f]
                  , m = parseFloat(c);
                a[f] = isNaN(m) ? 0 : m
            }
            var p = a.paddingLeft + a.paddingRight
              , y = a.paddingTop + a.paddingBottom
              , g = a.marginLeft + a.marginRight
              , v = a.marginTop + a.marginBottom
              , _ = a.borderLeftWidth + a.borderRightWidth
              , I = a.borderTopWidth + a.borderBottomWidth
              , z = d && r
              , x = t(s.width);
            x !== !1 && (a.width = x + (z ? 0 : p + _));
            var S = t(s.height);
            return S !== !1 && (a.height = S + (z ? 0 : y + I)),
            a.innerWidth = a.width - (p + _),
            a.innerHeight = a.height - (y + I),
            a.outerWidth = a.width + g,
            a.outerHeight = a.height + v,
            a
        }
    }
    var r, a = "undefined" == typeof console ? e : function(t) {
        console.error(t)
    }
    , u = ["paddingLeft", "paddingRight", "paddingTop", "paddingBottom", "marginLeft", "marginRight", "marginTop", "marginBottom", "borderLeftWidth", "borderRightWidth", "borderTopWidth", "borderBottomWidth"], h = u.length, d = !1;
    return s
}),
function(t, e) {
    "use strict";
    "function" == typeof define && define.amd ? define("desandro-matches-selector/matches-selector", e) : "object" == typeof module && module.exports ? module.exports = e() : t.matchesSelector = e()
}(window, function() {
    "use strict";
    var t = function() {
        var t = window.Element.prototype;
        if (t.matches)
            return "matches";
        if (t.matchesSelector)
            return "matchesSelector";
        for (var e = ["webkit", "moz", "ms", "o"], i = 0; i < e.length; i++) {
            var o = e[i]
              , n = o + "MatchesSelector";
            if (t[n])
                return n
        }
    }();
    return function(e, i) {
        return e[t](i)
    }
}),
function(t, e) {
    "function" == typeof define && define.amd ? define("fizzy-ui-utils/utils", ["desandro-matches-selector/matches-selector"], function(i) {
        return e(t, i)
    }) : "object" == typeof module && module.exports ? module.exports = e(t, require("desandro-matches-selector")) : t.fizzyUIUtils = e(t, t.matchesSelector)
}(window, function(t, e) {
    var i = {};
    i.extend = function(t, e) {
        for (var i in e)
            t[i] = e[i];
        return t
    }
    ,
    i.modulo = function(t, e) {
        return (t % e + e) % e
    }
    ,
    i.makeArray = function(t) {
        var e = [];
        if (Array.isArray(t))
            e = t;
        else if (t && "object" == typeof t && "number" == typeof t.length)
            for (var i = 0; i < t.length; i++)
                e.push(t[i]);
        else
            e.push(t);
        return e
    }
    ,
    i.removeFrom = function(t, e) {
        var i = t.indexOf(e);
        i != -1 && t.splice(i, 1)
    }
    ,
    i.getParent = function(t, i) {
        for (; t.parentNode && t != document.body; )
            if (t = t.parentNode,
            e(t, i))
                return t
    }
    ,
    i.getQueryElement = function(t) {
        return "string" == typeof t ? document.querySelector(t) : t
    }
    ,
    i.handleEvent = function(t) {
        var e = "on" + t.type;
        this[e] && this[e](t)
    }
    ,
    i.filterFindElements = function(t, o) {
        t = i.makeArray(t);
        var n = [];
        return t.forEach(function(t) {
            if (t instanceof HTMLElement) {
                if (!o)
                    return void n.push(t);
                e(t, o) && n.push(t);
                for (var i = t.querySelectorAll(o), s = 0; s < i.length; s++)
                    n.push(i[s])
            }
        }),
        n
    }
    ,
    i.debounceMethod = function(t, e, i) {
        var o = t.prototype[e]
          , n = e + "Timeout";
        t.prototype[e] = function() {
            var t = this[n];
            t && clearTimeout(t);
            var e = arguments
              , s = this;
            this[n] = setTimeout(function() {
                o.apply(s, e),
                delete s[n]
            }, i || 100)
        }
    }
    ,
    i.docReady = function(t) {
        var e = document.readyState;
        "complete" == e || "interactive" == e ? setTimeout(t) : document.addEventListener("DOMContentLoaded", t)
    }
    ,
    i.toDashed = function(t) {
        return t.replace(/(.)([A-Z])/g, function(t, e, i) {
            return e + "-" + i
        }).toLowerCase()
    }
    ;
    var o = t.console;
    return i.htmlInit = function(e, n) {
        i.docReady(function() {
            var s = i.toDashed(n)
              , r = "data-" + s
              , a = document.querySelectorAll("[" + r + "]")
              , u = document.querySelectorAll(".js-" + s)
              , h = i.makeArray(a).concat(i.makeArray(u))
              , d = r + "-options"
              , l = t.jQuery;
            h.forEach(function(t) {
                var i, s = t.getAttribute(r) || t.getAttribute(d);
                try {
                    i = s && JSON.parse(s)
                } catch (a) {
                    return void (o && o.error("Error parsing " + r + " on " + t.className + ": " + a))
                }
                var u = new e(t,i);
                l && l.data(t, n, u)
            })
        })
    }
    ,
    i
}),
function(t, e) {
    "function" == typeof define && define.amd ? define("outlayer/item", ["ev-emitter/ev-emitter", "get-size/get-size"], e) : "object" == typeof module && module.exports ? module.exports = e(require("ev-emitter"), require("get-size")) : (t.Outlayer = {},
    t.Outlayer.Item = e(t.EvEmitter, t.getSize))
}(window, function(t, e) {
    "use strict";
    function i(t) {
        for (var e in t)
            return !1;
        return e = null,
        !0
    }
    function o(t, e) {
        t && (this.element = t,
        this.layout = e,
        this.position = {
            x: 0,
            y: 0
        },
        this._create())
    }
    function n(t) {
        return t.replace(/([A-Z])/g, function(t) {
            return "-" + t.toLowerCase()
        })
    }
    var s = document.documentElement.style
      , r = "string" == typeof s.transition ? "transition" : "WebkitTransition"
      , a = "string" == typeof s.transform ? "transform" : "WebkitTransform"
      , u = {
        WebkitTransition: "webkitTransitionEnd",
        transition: "transitionend"
    }[r]
      , h = {
        transform: a,
        transition: r,
        transitionDuration: r + "Duration",
        transitionProperty: r + "Property",
        transitionDelay: r + "Delay"
    }
      , d = o.prototype = Object.create(t.prototype);
    d.constructor = o,
    d._create = function() {
        this._transn = {
            ingProperties: {},
            clean: {},
            onEnd: {}
        },
        this.css({
            position: "absolute"
        })
    }
    ,
    d.handleEvent = function(t) {
        var e = "on" + t.type;
        this[e] && this[e](t)
    }
    ,
    d.getSize = function() {
        this.size = e(this.element)
    }
    ,
    d.css = function(t) {
        var e = this.element.style;
        for (var i in t) {
            var o = h[i] || i;
            e[o] = t[i]
        }
    }
    ,
    d.getPosition = function() {
        var t = getComputedStyle(this.element)
          , e = this.layout._getOption("originLeft")
          , i = this.layout._getOption("originTop")
          , o = t[e ? "left" : "right"]
          , n = t[i ? "top" : "bottom"]
          , s = this.layout.size
          , r = o.indexOf("%") != -1 ? parseFloat(o) / 100 * s.width : parseInt(o, 10)
          , a = n.indexOf("%") != -1 ? parseFloat(n) / 100 * s.height : parseInt(n, 10);
        r = isNaN(r) ? 0 : r,
        a = isNaN(a) ? 0 : a,
        r -= e ? s.paddingLeft : s.paddingRight,
        a -= i ? s.paddingTop : s.paddingBottom,
        this.position.x = r,
        this.position.y = a
    }
    ,
    d.layoutPosition = function() {
        var t = this.layout.size
          , e = {}
          , i = this.layout._getOption("originLeft")
          , o = this.layout._getOption("originTop")
          , n = i ? "paddingLeft" : "paddingRight"
          , s = i ? "left" : "right"
          , r = i ? "right" : "left"
          , a = this.position.x + t[n];
        e[s] = this.getXValue(a),
        e[r] = "";
        var u = o ? "paddingTop" : "paddingBottom"
          , h = o ? "top" : "bottom"
          , d = o ? "bottom" : "top"
          , l = this.position.y + t[u];
        e[h] = this.getYValue(l),
        e[d] = "",
        this.css(e),
        this.emitEvent("layout", [this])
    }
    ,
    d.getXValue = function(t) {
        var e = this.layout._getOption("horizontal");
        return this.layout.options.percentPosition && !e ? t / this.layout.size.width * 100 + "%" : t + "px"
    }
    ,
    d.getYValue = function(t) {
        var e = this.layout._getOption("horizontal");
        return this.layout.options.percentPosition && e ? t / this.layout.size.height * 100 + "%" : t + "px"
    }
    ,
    d._transitionTo = function(t, e) {
        this.getPosition();
        var i = this.position.x
          , o = this.position.y
          , n = parseInt(t, 10)
          , s = parseInt(e, 10)
          , r = n === this.position.x && s === this.position.y;
        if (this.setPosition(t, e),
        r && !this.isTransitioning)
            return void this.layoutPosition();
        var a = t - i
          , u = e - o
          , h = {};
        h.transform = this.getTranslate(a, u),
        this.transition({
            to: h,
            onTransitionEnd: {
                transform: this.layoutPosition
            },
            isCleaning: !0
        })
    }
    ,
    d.getTranslate = function(t, e) {
        var i = this.layout._getOption("originLeft")
          , o = this.layout._getOption("originTop");
        return t = i ? t : -t,
        e = o ? e : -e,
        "translate3d(" + t + "px, " + e + "px, 0)"
    }
    ,
    d.goTo = function(t, e) {
        this.setPosition(t, e),
        this.layoutPosition()
    }
    ,
    d.moveTo = d._transitionTo,
    d.setPosition = function(t, e) {
        this.position.x = parseInt(t, 10),
        this.position.y = parseInt(e, 10)
    }
    ,
    d._nonTransition = function(t) {
        this.css(t.to),
        t.isCleaning && this._removeStyles(t.to);
        for (var e in t.onTransitionEnd)
            t.onTransitionEnd[e].call(this)
    }
    ,
    d.transition = function(t) {
        if (!parseFloat(this.layout.options.transitionDuration))
            return void this._nonTransition(t);
        var e = this._transn;
        for (var i in t.onTransitionEnd)
            e.onEnd[i] = t.onTransitionEnd[i];
        for (i in t.to)
            e.ingProperties[i] = !0,
            t.isCleaning && (e.clean[i] = !0);
        if (t.from) {
            this.css(t.from);
            var o = this.element.offsetHeight;
            o = null
        }
        this.enableTransition(t.to),
        this.css(t.to),
        this.isTransitioning = !0
    }
    ;
    var l = "opacity," + n(a);
    d.enableTransition = function() {
        if (!this.isTransitioning) {
            var t = this.layout.options.transitionDuration;
            t = "number" == typeof t ? t + "ms" : t,
            this.css({
                transitionProperty: l,
                transitionDuration: t,
                transitionDelay: this.staggerDelay || 0
            }),
            this.element.addEventListener(u, this, !1)
        }
    }
    ,
    d.onwebkitTransitionEnd = function(t) {
        this.ontransitionend(t)
    }
    ,
    d.onotransitionend = function(t) {
        this.ontransitionend(t)
    }
    ;
    var f = {
        "-webkit-transform": "transform"
    };
    d.ontransitionend = function(t) {
        if (t.target === this.element) {
            var e = this._transn
              , o = f[t.propertyName] || t.propertyName;
            if (delete e.ingProperties[o],
            i(e.ingProperties) && this.disableTransition(),
            o in e.clean && (this.element.style[t.propertyName] = "",
            delete e.clean[o]),
            o in e.onEnd) {
                var n = e.onEnd[o];
                n.call(this),
                delete e.onEnd[o]
            }
            this.emitEvent("transitionEnd", [this])
        }
    }
    ,
    d.disableTransition = function() {
        this.removeTransitionStyles(),
        this.element.removeEventListener(u, this, !1),
        this.isTransitioning = !1
    }
    ,
    d._removeStyles = function(t) {
        var e = {};
        for (var i in t)
            e[i] = "";
        this.css(e)
    }
    ;
    var c = {
        transitionProperty: "",
        transitionDuration: "",
        transitionDelay: ""
    };
    return d.removeTransitionStyles = function() {
        this.css(c)
    }
    ,
    d.stagger = function(t) {
        t = isNaN(t) ? 0 : t,
        this.staggerDelay = t + "ms"
    }
    ,
    d.removeElem = function() {
        this.element.parentNode.removeChild(this.element),
        this.css({
            display: ""
        }),
        this.emitEvent("remove", [this])
    }
    ,
    d.remove = function() {
        return r && parseFloat(this.layout.options.transitionDuration) ? (this.once("transitionEnd", function() {
            this.removeElem()
        }),
        void this.hide()) : void this.removeElem()
    }
    ,
    d.reveal = function() {
        delete this.isHidden,
        this.css({
            display: ""
        });
        var t = this.layout.options
          , e = {}
          , i = this.getHideRevealTransitionEndProperty("visibleStyle");
        e[i] = this.onRevealTransitionEnd,
        this.transition({
            from: t.hiddenStyle,
            to: t.visibleStyle,
            isCleaning: !0,
            onTransitionEnd: e
        })
    }
    ,
    d.onRevealTransitionEnd = function() {
        this.isHidden || this.emitEvent("reveal")
    }
    ,
    d.getHideRevealTransitionEndProperty = function(t) {
        var e = this.layout.options[t];
        if (e.opacity)
            return "opacity";
        for (var i in e)
            return i
    }
    ,
    d.hide = function() {
        this.isHidden = !0,
        this.css({
            display: ""
        });
        var t = this.layout.options
          , e = {}
          , i = this.getHideRevealTransitionEndProperty("hiddenStyle");
        e[i] = this.onHideTransitionEnd,
        this.transition({
            from: t.visibleStyle,
            to: t.hiddenStyle,
            isCleaning: !0,
            onTransitionEnd: e
        })
    }
    ,
    d.onHideTransitionEnd = function() {
        this.isHidden && (this.css({
            display: "none"
        }),
        this.emitEvent("hide"))
    }
    ,
    d.destroy = function() {
        this.css({
            position: "",
            left: "",
            right: "",
            top: "",
            bottom: "",
            transition: "",
            transform: ""
        })
    }
    ,
    o
}),
function(t, e) {
    "use strict";
    "function" == typeof define && define.amd ? define("outlayer/outlayer", ["ev-emitter/ev-emitter", "get-size/get-size", "fizzy-ui-utils/utils", "./item"], function(i, o, n, s) {
        return e(t, i, o, n, s)
    }) : "object" == typeof module && module.exports ? module.exports = e(t, require("ev-emitter"), require("get-size"), require("fizzy-ui-utils"), require("./item")) : t.Outlayer = e(t, t.EvEmitter, t.getSize, t.fizzyUIUtils, t.Outlayer.Item)
}(window, function(t, e, i, o, n) {
    "use strict";
    function s(t, e) {
        var i = o.getQueryElement(t);
        if (!i)
            return void (u && u.error("Bad element for " + this.constructor.namespace + ": " + (i || t)));
        this.element = i,
        h && (this.$element = h(this.element)),
        this.options = o.extend({}, this.constructor.defaults),
        this.option(e);
        var n = ++l;
        this.element.outlayerGUID = n,
        f[n] = this,
        this._create();
        var s = this._getOption("initLayout");
        s && this.layout()
    }
    function r(t) {
        function e() {
            t.apply(this, arguments)
        }
        return e.prototype = Object.create(t.prototype),
        e.prototype.constructor = e,
        e
    }
    function a(t) {
        if ("number" == typeof t)
            return t;
        var e = t.match(/(^\d*\.?\d*)(\w*)/)
          , i = e && e[1]
          , o = e && e[2];
        if (!i.length)
            return 0;
        i = parseFloat(i);
        var n = m[o] || 1;
        return i * n
    }
    var u = t.console
      , h = t.jQuery
      , d = function() {}
      , l = 0
      , f = {};
    s.namespace = "outlayer",
    s.Item = n,
    s.defaults = {
        containerStyle: {
            position: "relative"
        },
        initLayout: !0,
        originLeft: !0,
        originTop: !0,
        resize: !0,
        resizeContainer: !0,
        transitionDuration: "0.4s",
        hiddenStyle: {
            opacity: 0,
            transform: "scale(0.001)"
        },
        visibleStyle: {
            opacity: 1,
            transform: "scale(1)"
        }
    };
    var c = s.prototype;
    o.extend(c, e.prototype),
    c.option = function(t) {
        o.extend(this.options, t)
    }
    ,
    c._getOption = function(t) {
        var e = this.constructor.compatOptions[t];
        return e && void 0 !== this.options[e] ? this.options[e] : this.options[t]
    }
    ,
    s.compatOptions = {
        initLayout: "isInitLayout",
        horizontal: "isHorizontal",
        layoutInstant: "isLayoutInstant",
        originLeft: "isOriginLeft",
        originTop: "isOriginTop",
        resize: "isResizeBound",
        resizeContainer: "isResizingContainer"
    },
    c._create = function() {
        this.reloadItems(),
        this.stamps = [],
        this.stamp(this.options.stamp),
        o.extend(this.element.style, this.options.containerStyle);
        var t = this._getOption("resize");
        t && this.bindResize()
    }
    ,
    c.reloadItems = function() {
        this.items = this._itemize(this.element.children)
    }
    ,
    c._itemize = function(t) {
        for (var e = this._filterFindItemElements(t), i = this.constructor.Item, o = [], n = 0; n < e.length; n++) {
            var s = e[n]
              , r = new i(s,this);
            o.push(r)
        }
        return o
    }
    ,
    c._filterFindItemElements = function(t) {
        return o.filterFindElements(t, this.options.itemSelector)
    }
    ,
    c.getItemElements = function() {
        return this.items.map(function(t) {
            return t.element
        })
    }
    ,
    c.layout = function() {
        this._resetLayout(),
        this._manageStamps();
        var t = this._getOption("layoutInstant")
          , e = void 0 !== t ? t : !this._isLayoutInited;
        this.layoutItems(this.items, e),
        this._isLayoutInited = !0
    }
    ,
    c._init = c.layout,
    c._resetLayout = function() {
        this.getSize()
    }
    ,
    c.getSize = function() {
        this.size = i(this.element)
    }
    ,
    c._getMeasurement = function(t, e) {
        var o, n = this.options[t];
        n ? ("string" == typeof n ? o = this.element.querySelector(n) : n instanceof HTMLElement && (o = n),
        this[t] = o ? i(o)[e] : n) : this[t] = 0
    }
    ,
    c.layoutItems = function(t, e) {
        t = this._getItemsForLayout(t),
        this._layoutItems(t, e),
        this._postLayout()
    }
    ,
    c._getItemsForLayout = function(t) {
        return t.filter(function(t) {
            return !t.isIgnored
        })
    }
    ,
    c._layoutItems = function(t, e) {
        if (this._emitCompleteOnItems("layout", t),
        t && t.length) {
            var i = [];
            t.forEach(function(t) {
                var o = this._getItemLayoutPosition(t);
                o.item = t,
                o.isInstant = e || t.isLayoutInstant,
                i.push(o)
            }, this),
            this._processLayoutQueue(i)
        }
    }
    ,
    c._getItemLayoutPosition = function() {
        return {
            x: 0,
            y: 0
        }
    }
    ,
    c._processLayoutQueue = function(t) {
        this.updateStagger(),
        t.forEach(function(t, e) {
            this._positionItem(t.item, t.x, t.y, t.isInstant, e)
        }, this)
    }
    ,
    c.updateStagger = function() {
        var t = this.options.stagger;
        return null === t || void 0 === t ? void (this.stagger = 0) : (this.stagger = a(t),
        this.stagger)
    }
    ,
    c._positionItem = function(t, e, i, o, n) {
        o ? t.goTo(e, i) : (t.stagger(n * this.stagger),
        t.moveTo(e, i))
    }
    ,
    c._postLayout = function() {
        this.resizeContainer()
    }
    ,
    c.resizeContainer = function() {
        var t = this._getOption("resizeContainer");
        if (t) {
            var e = this._getContainerSize();
            e && (this._setContainerMeasure(e.width, !0),
            this._setContainerMeasure(e.height, !1))
        }
    }
    ,
    c._getContainerSize = d,
    c._setContainerMeasure = function(t, e) {
        if (void 0 !== t) {
            var i = this.size;
            i.isBorderBox && (t += e ? i.paddingLeft + i.paddingRight + i.borderLeftWidth + i.borderRightWidth : i.paddingBottom + i.paddingTop + i.borderTopWidth + i.borderBottomWidth),
            t = Math.max(t, 0),
            this.element.style[e ? "width" : "height"] = t + "px"
        }
    }
    ,
    c._emitCompleteOnItems = function(t, e) {
        function i() {
            n.dispatchEvent(t + "Complete", null, [e])
        }
        function o() {
            r++,
            r == s && i()
        }
        var n = this
          , s = e.length;
        if (!e || !s)
            return void i();
        var r = 0;
        e.forEach(function(e) {
            e.once(t, o)
        })
    }
    ,
    c.dispatchEvent = function(t, e, i) {
        var o = e ? [e].concat(i) : i;
        if (this.emitEvent(t, o),
        h)
            if (this.$element = this.$element || h(this.element),
            e) {
                var n = h.Event(e);
                n.type = t,
                this.$element.trigger(n, i)
            } else
                this.$element.trigger(t, i)
    }
    ,
    c.ignore = function(t) {
        var e = this.getItem(t);
        e && (e.isIgnored = !0)
    }
    ,
    c.unignore = function(t) {
        var e = this.getItem(t);
        e && delete e.isIgnored
    }
    ,
    c.stamp = function(t) {
        t = this._find(t),
        t && (this.stamps = this.stamps.concat(t),
        t.forEach(this.ignore, this))
    }
    ,
    c.unstamp = function(t) {
        t = this._find(t),
        t && t.forEach(function(t) {
            o.removeFrom(this.stamps, t),
            this.unignore(t)
        }, this)
    }
    ,
    c._find = function(t) {
        if (t)
            return "string" == typeof t && (t = this.element.querySelectorAll(t)),
            t = o.makeArray(t)
    }
    ,
    c._manageStamps = function() {
        this.stamps && this.stamps.length && (this._getBoundingRect(),
        this.stamps.forEach(this._manageStamp, this))
    }
    ,
    c._getBoundingRect = function() {
        var t = this.element.getBoundingClientRect()
          , e = this.size;
        this._boundingRect = {
            left: t.left + e.paddingLeft + e.borderLeftWidth,
            top: t.top + e.paddingTop + e.borderTopWidth,
            right: t.right - (e.paddingRight + e.borderRightWidth),
            bottom: t.bottom - (e.paddingBottom + e.borderBottomWidth)
        }
    }
    ,
    c._manageStamp = d,
    c._getElementOffset = function(t) {
        var e = t.getBoundingClientRect()
          , o = this._boundingRect
          , n = i(t)
          , s = {
            left: e.left - o.left - n.marginLeft,
            top: e.top - o.top - n.marginTop,
            right: o.right - e.right - n.marginRight,
            bottom: o.bottom - e.bottom - n.marginBottom
        };
        return s
    }
    ,
    c.handleEvent = o.handleEvent,
    c.bindResize = function() {
        t.addEventListener("resize", this),
        this.isResizeBound = !0
    }
    ,
    c.unbindResize = function() {
        t.removeEventListener("resize", this),
        this.isResizeBound = !1
    }
    ,
    c.onresize = function() {
        this.resize()
    }
    ,
    o.debounceMethod(s, "onresize", 100),
    c.resize = function() {
        this.isResizeBound && this.needsResizeLayout() && this.layout()
    }
    ,
    c.needsResizeLayout = function() {
        var t = i(this.element)
          , e = this.size && t;
        return e && t.innerWidth !== this.size.innerWidth
    }
    ,
    c.addItems = function(t) {
        var e = this._itemize(t);
        return e.length && (this.items = this.items.concat(e)),
        e
    }
    ,
    c.appended = function(t) {
        var e = this.addItems(t);
        e.length && (this.layoutItems(e, !0),
        this.reveal(e))
    }
    ,
    c.prepended = function(t) {
        var e = this._itemize(t);
        if (e.length) {
            var i = this.items.slice(0);
            this.items = e.concat(i),
            this._resetLayout(),
            this._manageStamps(),
            this.layoutItems(e, !0),
            this.reveal(e),
            this.layoutItems(i)
        }
    }
    ,
    c.reveal = function(t) {
        if (this._emitCompleteOnItems("reveal", t),
        t && t.length) {
            var e = this.updateStagger();
            t.forEach(function(t, i) {
                t.stagger(i * e),
                t.reveal()
            })
        }
    }
    ,
    c.hide = function(t) {
        if (this._emitCompleteOnItems("hide", t),
        t && t.length) {
            var e = this.updateStagger();
            t.forEach(function(t, i) {
                t.stagger(i * e),
                t.hide()
            })
        }
    }
    ,
    c.revealItemElements = function(t) {
        var e = this.getItems(t);
        this.reveal(e)
    }
    ,
    c.hideItemElements = function(t) {
        var e = this.getItems(t);
        this.hide(e)
    }
    ,
    c.getItem = function(t) {
        for (var e = 0; e < this.items.length; e++) {
            var i = this.items[e];
            if (i.element == t)
                return i
        }
    }
    ,
    c.getItems = function(t) {
        t = o.makeArray(t);
        var e = [];
        return t.forEach(function(t) {
            var i = this.getItem(t);
            i && e.push(i)
        }, this),
        e
    }
    ,
    c.remove = function(t) {
        var e = this.getItems(t);
        this._emitCompleteOnItems("remove", e),
        e && e.length && e.forEach(function(t) {
            t.remove(),
            o.removeFrom(this.items, t)
        }, this)
    }
    ,
    c.destroy = function() {
        var t = this.element.style;
        t.height = "",
        t.position = "",
        t.width = "",
        this.items.forEach(function(t) {
            t.destroy()
        }),
        this.unbindResize();
        var e = this.element.outlayerGUID;
        delete f[e],
        delete this.element.outlayerGUID,
        h && h.removeData(this.element, this.constructor.namespace)
    }
    ,
    s.data = function(t) {
        t = o.getQueryElement(t);
        var e = t && t.outlayerGUID;
        return e && f[e]
    }
    ,
    s.create = function(t, e) {
        var i = r(s);
        return i.defaults = o.extend({}, s.defaults),
        o.extend(i.defaults, e),
        i.compatOptions = o.extend({}, s.compatOptions),
        i.namespace = t,
        i.data = s.data,
        i.Item = r(n),
        o.htmlInit(i, t),
        h && h.bridget && h.bridget(t, i),
        i
    }
    ;
    var m = {
        ms: 1,
        s: 1e3
    };
    return s.Item = n,
    s
}),
function(t, e) {
    "function" == typeof define && define.amd ? define("isotope/js/item", ["outlayer/outlayer"], e) : "object" == typeof module && module.exports ? module.exports = e(require("outlayer")) : (t.Isotope = t.Isotope || {},
    t.Isotope.Item = e(t.Outlayer))
}(window, function(t) {
    "use strict";
    function e() {
        t.Item.apply(this, arguments)
    }
    var i = e.prototype = Object.create(t.Item.prototype)
      , o = i._create;
    i._create = function() {
        this.id = this.layout.itemGUID++,
        o.call(this),
        this.sortData = {}
    }
    ,
    i.updateSortData = function() {
        if (!this.isIgnored) {
            this.sortData.id = this.id,
            this.sortData["original-order"] = this.id,
            this.sortData.random = Math.random();
            var t = this.layout.options.getSortData
              , e = this.layout._sorters;
            for (var i in t) {
                var o = e[i];
                this.sortData[i] = o(this.element, this)
            }
        }
    }
    ;
    var n = i.destroy;
    return i.destroy = function() {
        n.apply(this, arguments),
        this.css({
            display: ""
        })
    }
    ,
    e
}),
function(t, e) {
    "function" == typeof define && define.amd ? define("isotope/js/layout-mode", ["get-size/get-size", "outlayer/outlayer"], e) : "object" == typeof module && module.exports ? module.exports = e(require("get-size"), require("outlayer")) : (t.Isotope = t.Isotope || {},
    t.Isotope.LayoutMode = e(t.getSize, t.Outlayer))
}(window, function(t, e) {
    "use strict";
    function i(t) {
        this.isotope = t,
        t && (this.options = t.options[this.namespace],
        this.element = t.element,
        this.items = t.filteredItems,
        this.size = t.size)
    }
    var o = i.prototype
      , n = ["_resetLayout", "_getItemLayoutPosition", "_manageStamp", "_getContainerSize", "_getElementOffset", "needsResizeLayout", "_getOption"];
    return n.forEach(function(t) {
        o[t] = function() {
            return e.prototype[t].apply(this.isotope, arguments)
        }
    }),
    o.needsVerticalResizeLayout = function() {
        var e = t(this.isotope.element)
          , i = this.isotope.size && e;
        return i && e.innerHeight != this.isotope.size.innerHeight
    }
    ,
    o._getMeasurement = function() {
        this.isotope._getMeasurement.apply(this, arguments)
    }
    ,
    o.getColumnWidth = function() {
        this.getSegmentSize("column", "Width")
    }
    ,
    o.getRowHeight = function() {
        this.getSegmentSize("row", "Height")
    }
    ,
    o.getSegmentSize = function(t, e) {
        var i = t + e
          , o = "outer" + e;
        if (this._getMeasurement(i, o),
        !this[i]) {
            var n = this.getFirstItemSize();
            this[i] = n && n[o] || this.isotope.size["inner" + e]
        }
    }
    ,
    o.getFirstItemSize = function() {
        var e = this.isotope.filteredItems[0];
        return e && e.element && t(e.element)
    }
    ,
    o.layout = function() {
        this.isotope.layout.apply(this.isotope, arguments)
    }
    ,
    o.getSize = function() {
        this.isotope.getSize(),
        this.size = this.isotope.size
    }
    ,
    i.modes = {},
    i.create = function(t, e) {
        function n() {
            i.apply(this, arguments)
        }
        return n.prototype = Object.create(o),
        n.prototype.constructor = n,
        e && (n.options = e),
        n.prototype.namespace = t,
        i.modes[t] = n,
        n
    }
    ,
    i
}),
function(t, e) {
    "function" == typeof define && define.amd ? define("masonry/masonry", ["outlayer/outlayer", "get-size/get-size"], e) : "object" == typeof module && module.exports ? module.exports = e(require("outlayer"), require("get-size")) : t.Masonry = e(t.Outlayer, t.getSize)
}(window, function(t, e) {
    var i = t.create("masonry");
    i.compatOptions.fitWidth = "isFitWidth";
    var o = i.prototype;
    return o._resetLayout = function() {
        this.getSize(),
        this._getMeasurement("columnWidth", "outerWidth"),
        this._getMeasurement("gutter", "outerWidth"),
        this.measureColumns(),
        this.colYs = [];
        for (var t = 0; t < this.cols; t++)
            this.colYs.push(0);
        this.maxY = 0,
        this.horizontalColIndex = 0
    }
    ,
    o.measureColumns = function() {
        if (this.getContainerWidth(),
        !this.columnWidth) {
            var t = this.items[0]
              , i = t && t.element;
            this.columnWidth = i && e(i).outerWidth || this.containerWidth
        }
        var o = this.columnWidth += this.gutter
          , n = this.containerWidth + this.gutter
          , s = n / o
          , r = o - n % o
          , a = r && r < 1 ? "round" : "floor";
        s = Math[a](s),
        this.cols = Math.max(s, 1)
    }
    ,
    o.getContainerWidth = function() {
        var t = this._getOption("fitWidth")
          , i = t ? this.element.parentNode : this.element
          , o = e(i);
        this.containerWidth = o && o.innerWidth
    }
    ,
    o._getItemLayoutPosition = function(t) {
        t.getSize();
        var e = t.size.outerWidth % this.columnWidth
          , i = e && e < 1 ? "round" : "ceil"
          , o = Math[i](t.size.outerWidth / this.columnWidth);
        o = Math.min(o, this.cols);
        for (var n = this.options.horizontalOrder ? "_getHorizontalColPosition" : "_getTopColPosition", s = this[n](o, t), r = {
            x: this.columnWidth * s.col,
            y: s.y
        }, a = s.y + t.size.outerHeight, u = o + s.col, h = s.col; h < u; h++)
            this.colYs[h] = a;
        return r
    }
    ,
    o._getTopColPosition = function(t) {
        var e = this._getTopColGroup(t)
          , i = Math.min.apply(Math, e);
        return {
            col: e.indexOf(i),
            y: i
        }
    }
    ,
    o._getTopColGroup = function(t) {
        if (t < 2)
            return this.colYs;
        for (var e = [], i = this.cols + 1 - t, o = 0; o < i; o++)
            e[o] = this._getColGroupY(o, t);
        return e
    }
    ,
    o._getColGroupY = function(t, e) {
        if (e < 2)
            return this.colYs[t];
        var i = this.colYs.slice(t, t + e);
        return Math.max.apply(Math, i)
    }
    ,
    o._getHorizontalColPosition = function(t, e) {
        var i = this.horizontalColIndex % this.cols
          , o = t > 1 && i + t > this.cols;
        i = o ? 0 : i;
        var n = e.size.outerWidth && e.size.outerHeight;
        return this.horizontalColIndex = n ? i + t : this.horizontalColIndex,
        {
            col: i,
            y: this._getColGroupY(i, t)
        }
    }
    ,
    o._manageStamp = function(t) {
        var i = e(t)
          , o = this._getElementOffset(t)
          , n = this._getOption("originLeft")
          , s = n ? o.left : o.right
          , r = s + i.outerWidth
          , a = Math.floor(s / this.columnWidth);
        a = Math.max(0, a);
        var u = Math.floor(r / this.columnWidth);
        u -= r % this.columnWidth ? 0 : 1,
        u = Math.min(this.cols - 1, u);
        for (var h = this._getOption("originTop"), d = (h ? o.top : o.bottom) + i.outerHeight, l = a; l <= u; l++)
            this.colYs[l] = Math.max(d, this.colYs[l])
    }
    ,
    o._getContainerSize = function() {
        this.maxY = Math.max.apply(Math, this.colYs);
        var t = {
            height: this.maxY
        };
        return this._getOption("fitWidth") && (t.width = this._getContainerFitWidth()),
        t
    }
    ,
    o._getContainerFitWidth = function() {
        for (var t = 0, e = this.cols; --e && 0 === this.colYs[e]; )
            t++;
        return (this.cols - t) * this.columnWidth - this.gutter
    }
    ,
    o.needsResizeLayout = function() {
        var t = this.containerWidth;
        return this.getContainerWidth(),
        t != this.containerWidth
    }
    ,
    i
}),
function(t, e) {
    "function" == typeof define && define.amd ? define("isotope/js/layout-modes/masonry", ["../layout-mode", "masonry/masonry"], e) : "object" == typeof module && module.exports ? module.exports = e(require("../layout-mode"), require("masonry-layout")) : e(t.Isotope.LayoutMode, t.Masonry)
}(window, function(t, e) {
    "use strict";
    var i = t.create("masonry")
      , o = i.prototype
      , n = {
        _getElementOffset: !0,
        layout: !0,
        _getMeasurement: !0
    };
    for (var s in e.prototype)
        n[s] || (o[s] = e.prototype[s]);
    var r = o.measureColumns;
    o.measureColumns = function() {
        this.items = this.isotope.filteredItems,
        r.call(this)
    }
    ;
    var a = o._getOption;
    return o._getOption = function(t) {
        return "fitWidth" == t ? void 0 !== this.options.isFitWidth ? this.options.isFitWidth : this.options.fitWidth : a.apply(this.isotope, arguments)
    }
    ,
    i
}),
function(t, e) {
    "function" == typeof define && define.amd ? define("isotope/js/layout-modes/fit-rows", ["../layout-mode"], e) : "object" == typeof exports ? module.exports = e(require("../layout-mode")) : e(t.Isotope.LayoutMode)
}(window, function(t) {
    "use strict";
    var e = t.create("fitRows")
      , i = e.prototype;
    return i._resetLayout = function() {
        this.x = 0,
        this.y = 0,
        this.maxY = 0,
        this._getMeasurement("gutter", "outerWidth")
    }
    ,
    i._getItemLayoutPosition = function(t) {
        t.getSize();
        var e = t.size.outerWidth + this.gutter
          , i = this.isotope.size.innerWidth + this.gutter;
        0 !== this.x && e + this.x > i && (this.x = 0,
        this.y = this.maxY);
        var o = {
            x: this.x,
            y: this.y
        };
        return this.maxY = Math.max(this.maxY, this.y + t.size.outerHeight),
        this.x += e,
        o
    }
    ,
    i._getContainerSize = function() {
        return {
            height: this.maxY
        }
    }
    ,
    e
}),
function(t, e) {
    "function" == typeof define && define.amd ? define("isotope/js/layout-modes/vertical", ["../layout-mode"], e) : "object" == typeof module && module.exports ? module.exports = e(require("../layout-mode")) : e(t.Isotope.LayoutMode)
}(window, function(t) {
    "use strict";
    var e = t.create("vertical", {
        horizontalAlignment: 0
    })
      , i = e.prototype;
    return i._resetLayout = function() {
        this.y = 0
    }
    ,
    i._getItemLayoutPosition = function(t) {
        t.getSize();
        var e = (this.isotope.size.innerWidth - t.size.outerWidth) * this.options.horizontalAlignment
          , i = this.y;
        return this.y += t.size.outerHeight,
        {
            x: e,
            y: i
        }
    }
    ,
    i._getContainerSize = function() {
        return {
            height: this.y
        }
    }
    ,
    e
}),
function(t, e) {
    "function" == typeof define && define.amd ? define(["outlayer/outlayer", "get-size/get-size", "desandro-matches-selector/matches-selector", "fizzy-ui-utils/utils", "isotope/js/item", "isotope/js/layout-mode", "isotope/js/layout-modes/masonry", "isotope/js/layout-modes/fit-rows", "isotope/js/layout-modes/vertical"], function(i, o, n, s, r, a) {
        return e(t, i, o, n, s, r, a)
    }) : "object" == typeof module && module.exports ? module.exports = e(t, require("outlayer"), require("get-size"), require("desandro-matches-selector"), require("fizzy-ui-utils"), require("isotope/js/item"), require("isotope/js/layout-mode"), require("isotope/js/layout-modes/masonry"), require("isotope/js/layout-modes/fit-rows"), require("isotope/js/layout-modes/vertical")) : t.Isotope = e(t, t.Outlayer, t.getSize, t.matchesSelector, t.fizzyUIUtils, t.Isotope.Item, t.Isotope.LayoutMode)
}(window, function(t, e, i, o, n, s, r) {
    function a(t, e) {
        return function(i, o) {
            for (var n = 0; n < t.length; n++) {
                var s = t[n]
                  , r = i.sortData[s]
                  , a = o.sortData[s];
                if (r > a || r < a) {
                    var u = void 0 !== e[s] ? e[s] : e
                      , h = u ? 1 : -1;
                    return (r > a ? 1 : -1) * h
                }
            }
            return 0
        }
    }
    var u = t.jQuery
      , h = String.prototype.trim ? function(t) {
        return t.trim()
    }
    : function(t) {
        return t.replace(/^\s+|\s+$/g, "")
    }
      , d = e.create("isotope", {
        layoutMode: "masonry",
        isJQueryFiltering: !0,
        sortAscending: !0
    });
    d.Item = s,
    d.LayoutMode = r;
    var l = d.prototype;
    l._create = function() {
        this.itemGUID = 0,
        this._sorters = {},
        this._getSorters(),
        e.prototype._create.call(this),
        this.modes = {},
        this.filteredItems = this.items,
        this.sortHistory = ["original-order"];
        for (var t in r.modes)
            this._initLayoutMode(t)
    }
    ,
    l.reloadItems = function() {
        this.itemGUID = 0,
        e.prototype.reloadItems.call(this)
    }
    ,
    l._itemize = function() {
        for (var t = e.prototype._itemize.apply(this, arguments), i = 0; i < t.length; i++) {
            var o = t[i];
            o.id = this.itemGUID++
        }
        return this._updateItemsSortData(t),
        t
    }
    ,
    l._initLayoutMode = function(t) {
        var e = r.modes[t]
          , i = this.options[t] || {};
        this.options[t] = e.options ? n.extend(e.options, i) : i,
        this.modes[t] = new e(this)
    }
    ,
    l.layout = function() {
        return !this._isLayoutInited && this._getOption("initLayout") ? void this.arrange() : void this._layout()
    }
    ,
    l._layout = function() {
        var t = this._getIsInstant();
        this._resetLayout(),
        this._manageStamps(),
        this.layoutItems(this.filteredItems, t),
        this._isLayoutInited = !0
    }
    ,
    l.arrange = function(t) {
        this.option(t),
        this._getIsInstant();
        var e = this._filter(this.items);
        this.filteredItems = e.matches,
        this._bindArrangeComplete(),
        this._isInstant ? this._noTransition(this._hideReveal, [e]) : this._hideReveal(e),
        this._sort(),
        this._layout()
    }
    ,
    l._init = l.arrange,
    l._hideReveal = function(t) {
        this.reveal(t.needReveal),
        this.hide(t.needHide)
    }
    ,
    l._getIsInstant = function() {
        var t = this._getOption("layoutInstant")
          , e = void 0 !== t ? t : !this._isLayoutInited;
        return this._isInstant = e,
        e
    }
    ,
    l._bindArrangeComplete = function() {
        function t() {
            e && i && o && n.dispatchEvent("arrangeComplete", null, [n.filteredItems])
        }
        var e, i, o, n = this;
        this.once("layoutComplete", function() {
            e = !0,
            t()
        }),
        this.once("hideComplete", function() {
            i = !0,
            t()
        }),
        this.once("revealComplete", function() {
            o = !0,
            t()
        })
    }
    ,
    l._filter = function(t) {
        var e = this.options.filter;
        e = e || "*";
        for (var i = [], o = [], n = [], s = this._getFilterTest(e), r = 0; r < t.length; r++) {
            var a = t[r];
            if (!a.isIgnored) {
                var u = s(a);
                u && i.push(a),
                u && a.isHidden ? o.push(a) : u || a.isHidden || n.push(a)
            }
        }
        return {
            matches: i,
            needReveal: o,
            needHide: n
        }
    }
    ,
    l._getFilterTest = function(t) {
        return u && this.options.isJQueryFiltering ? function(e) {
            return u(e.element).is(t)
        }
        : "function" == typeof t ? function(e) {
            return t(e.element)
        }
        : function(e) {
            return o(e.element, t)
        }
    }
    ,
    l.updateSortData = function(t) {
        var e;
        t ? (t = n.makeArray(t),
        e = this.getItems(t)) : e = this.items,
        this._getSorters(),
        this._updateItemsSortData(e)
    }
    ,
    l._getSorters = function() {
        var t = this.options.getSortData;
        for (var e in t) {
            var i = t[e];
            this._sorters[e] = f(i)
        }
    }
    ,
    l._updateItemsSortData = function(t) {
        for (var e = t && t.length, i = 0; e && i < e; i++) {
            var o = t[i];
            o.updateSortData()
        }
    }
    ;
    var f = function() {
        function t(t) {
            if ("string" != typeof t)
                return t;
            var i = h(t).split(" ")
              , o = i[0]
              , n = o.match(/^\[(.+)\]$/)
              , s = n && n[1]
              , r = e(s, o)
              , a = d.sortDataParsers[i[1]];
            return t = a ? function(t) {
                return t && a(r(t))
            }
            : function(t) {
                return t && r(t)
            }
        }
        function e(t, e) {
            return t ? function(e) {
                return e.getAttribute(t)
            }
            : function(t) {
                var i = t.querySelector(e);
                return i && i.textContent
            }
        }
        return t
    }();
    d.sortDataParsers = {
        parseInt: function(t) {
            return parseInt(t, 10)
        },
        parseFloat: function(t) {
            return parseFloat(t)
        }
    },
    l._sort = function() {
        if (this.options.sortBy) {
            var t = n.makeArray(this.options.sortBy);
            this._getIsSameSortBy(t) || (this.sortHistory = t.concat(this.sortHistory));
            var e = a(this.sortHistory, this.options.sortAscending);
            this.filteredItems.sort(e)
        }
    }
    ,
    l._getIsSameSortBy = function(t) {
        for (var e = 0; e < t.length; e++)
            if (t[e] != this.sortHistory[e])
                return !1;
        return !0
    }
    ,
    l._mode = function() {
        var t = this.options.layoutMode
          , e = this.modes[t];
        if (!e)
            throw new Error("No layout mode: " + t);
        return e.options = this.options[t],
        e
    }
    ,
    l._resetLayout = function() {
        e.prototype._resetLayout.call(this),
        this._mode()._resetLayout()
    }
    ,
    l._getItemLayoutPosition = function(t) {
        return this._mode()._getItemLayoutPosition(t)
    }
    ,
    l._manageStamp = function(t) {
        this._mode()._manageStamp(t)
    }
    ,
    l._getContainerSize = function() {
        return this._mode()._getContainerSize()
    }
    ,
    l.needsResizeLayout = function() {
        return this._mode().needsResizeLayout()
    }
    ,
    l.appended = function(t) {
        var e = this.addItems(t);
        if (e.length) {
            var i = this._filterRevealAdded(e);
            this.filteredItems = this.filteredItems.concat(i)
        }
    }
    ,
    l.prepended = function(t) {
        var e = this._itemize(t);
        if (e.length) {
            this._resetLayout(),
            this._manageStamps();
            var i = this._filterRevealAdded(e);
            this.layoutItems(this.filteredItems),
            this.filteredItems = i.concat(this.filteredItems),
            this.items = e.concat(this.items)
        }
    }
    ,
    l._filterRevealAdded = function(t) {
        var e = this._filter(t);
        return this.hide(e.needHide),
        this.reveal(e.matches),
        this.layoutItems(e.matches, !0),
        e.matches
    }
    ,
    l.insert = function(t) {
        var e = this.addItems(t);
        if (e.length) {
            var i, o, n = e.length;
            for (i = 0; i < n; i++)
                o = e[i],
                this.element.appendChild(o.element);
            var s = this._filter(e).matches;
            for (i = 0; i < n; i++)
                e[i].isLayoutInstant = !0;
            for (this.arrange(),
            i = 0; i < n; i++)
                delete e[i].isLayoutInstant;
            this.reveal(s)
        }
    }
    ;
    var c = l.remove;
    return l.remove = function(t) {
        t = n.makeArray(t);
        var e = this.getItems(t);
        c.call(this, t);
        for (var i = e && e.length, o = 0; i && o < i; o++) {
            var s = e[o];
            n.removeFrom(this.filteredItems, s)
        }
    }
    ,
    l.shuffle = function() {
        for (var t = 0; t < this.items.length; t++) {
            var e = this.items[t];
            e.sortData.random = Math.random()
        }
        this.options.sortBy = "random",
        this._sort(),
        this._layout()
    }
    ,
    l._noTransition = function(t, e) {
        var i = this.options.transitionDuration;
        this.options.transitionDuration = 0;
        var o = t.apply(this, e);
        return this.options.transitionDuration = i,
        o
    }
    ,
    l.getFilteredItemElements = function() {
        return this.filteredItems.map(function(t) {
            return t.element
        })
    }
    ,
    d
});
/**
 * skip-link-focus-fix.js
 *
 * Helps with accessibility for keyboard only users.
 *
 * Learn more: https://git.io/vWdr2
 */
!function() {
    var e = navigator.userAgent.toLowerCase().indexOf("webkit") > -1
      , t = navigator.userAgent.toLowerCase().indexOf("opera") > -1
      , n = navigator.userAgent.toLowerCase().indexOf("msie") > -1;
    (e || t || n) && document.getElementById && window.addEventListener && window.addEventListener("hashchange", function() {
        var e, t = location.hash.substring(1);
        /^[A-z0-9_-]+$/.test(t) && (e = document.getElementById(t),
        e && (/^(?:a|select|input|button|textarea)$/i.test(e.tagName) || (e.tabIndex = -1),
        e.focus()))
    }, !1)
}();
!function(e) {
    e('a[href*="#"]:not([href="#"])').click(function() {
        if (location.pathname.replace(/^\//, "") == this.pathname.replace(/^\//, "") && location.hostname == this.hostname) {
            var t = e(this.hash);
            if (t = t.length ? t : e("[name=" + this.hash.slice(1) + "]"),
            t.length)
                return e("html, body").animate({
                    scrollTop: t.offset().top - e(".site-header").outerHeight()
                }, 500),
                !1
        }
    })
}(jQuery);
!function(e, t) {
    "object" == typeof exports && "object" == typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define([], t) : "object" == typeof exports ? exports.AOS = t() : e.AOS = t()
}(this, function() {
    return function(e) {
        function t(o) {
            if (n[o])
                return n[o].exports;
            var i = n[o] = {
                exports: {},
                id: o,
                loaded: !1
            };
            return e[o].call(i.exports, i, i.exports, t),
            i.loaded = !0,
            i.exports
        }
        var n = {};
        return t.m = e,
        t.c = n,
        t.p = "dist/",
        t(0)
    }([function(e, t, n) {
        "use strict";
        function o(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }
        var i = Object.assign || function(e) {
            for (var t = 1; t < arguments.length; t++) {
                var n = arguments[t];
                for (var o in n)
                    Object.prototype.hasOwnProperty.call(n, o) && (e[o] = n[o])
            }
            return e
        }
          , r = n(1)
          , a = (o(r),
        n(6))
          , u = o(a)
          , c = n(7)
          , f = o(c)
          , s = n(8)
          , d = o(s)
          , l = n(9)
          , p = o(l)
          , m = n(10)
          , b = o(m)
          , v = n(11)
          , y = o(v)
          , g = n(14)
          , h = o(g)
          , w = []
          , k = !1
          , x = document.all && !window.atob
          , j = {
            offset: 120,
            delay: 0,
            easing: "ease",
            duration: 400,
            disable: !1,
            once: !1,
            startEvent: "DOMContentLoaded"
        }
          , O = function() {
            var e = arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
            if (e && (k = !0),
            k)
                return w = (0,
                y["default"])(w, j),
                (0,
                b["default"])(w, j.once),
                w
        }
          , S = function() {
            w = (0,
            h["default"])(),
            O()
        }
          , _ = function() {
            w.forEach(function(e, t) {
                e.node.removeAttribute("data-aos"),
                e.node.removeAttribute("data-aos-easing"),
                e.node.removeAttribute("data-aos-duration"),
                e.node.removeAttribute("data-aos-delay")
            })
        }
          , E = function(e) {
            return e === !0 || "mobile" === e && p["default"].mobile() || "phone" === e && p["default"].phone() || "tablet" === e && p["default"].tablet() || "function" == typeof e && e() === !0
        }
          , z = function(e) {
            return j = i(j, e),
            w = (0,
            h["default"])(),
            E(j.disable) || x ? _() : (document.querySelector("body").setAttribute("data-aos-easing", j.easing),
            document.querySelector("body").setAttribute("data-aos-duration", j.duration),
            document.querySelector("body").setAttribute("data-aos-delay", j.delay),
            "DOMContentLoaded" === j.startEvent && ["complete", "interactive"].indexOf(document.readyState) > -1 ? O(!0) : "load" === j.startEvent ? window.addEventListener(j.startEvent, function() {
                O(!0)
            }) : document.addEventListener(j.startEvent, function() {
                O(!0)
            }),
            window.addEventListener("resize", (0,
            f["default"])(O, 50, !0)),
            window.addEventListener("orientationchange", (0,
            f["default"])(O, 50, !0)),
            window.addEventListener("scroll", (0,
            u["default"])(function() {
                (0,
                b["default"])(w, j.once)
            }, 99)),
            document.addEventListener("DOMNodeRemoved", function(e) {
                var t = e.target;
                t && 1 === t.nodeType && t.hasAttribute && t.hasAttribute("data-aos") && (0,
                f["default"])(S, 50, !0)
            }),
            (0,
            d["default"])("[data-aos]", S),
            w)
        };
        e.exports = {
            init: z,
            refresh: O,
            refreshHard: S
        }
    }
    , function(e, t) {}
    , , , , , function(e, t) {
        (function(t) {
            "use strict";
            function n(e, t, n) {
                function o(t) {
                    var n = b
                      , o = v;
                    return b = v = void 0,
                    k = t,
                    g = e.apply(o, n)
                }
                function r(e) {
                    return k = e,
                    h = setTimeout(s, t),
                    S ? o(e) : g
                }
                function a(e) {
                    var n = e - w
                      , o = e - k
                      , i = t - n;
                    return _ ? j(i, y - o) : i
                }
                function c(e) {
                    var n = e - w
                      , o = e - k;
                    return void 0 === w || n >= t || n < 0 || _ && o >= y
                }
                function s() {
                    var e = O();
                    return c(e) ? d(e) : void (h = setTimeout(s, a(e)))
                }
                function d(e) {
                    return h = void 0,
                    E && b ? o(e) : (b = v = void 0,
                    g)
                }
                function l() {
                    void 0 !== h && clearTimeout(h),
                    k = 0,
                    b = w = v = h = void 0
                }
                function p() {
                    return void 0 === h ? g : d(O())
                }
                function m() {
                    var e = O()
                      , n = c(e);
                    if (b = arguments,
                    v = this,
                    w = e,
                    n) {
                        if (void 0 === h)
                            return r(w);
                        if (_)
                            return h = setTimeout(s, t),
                            o(w)
                    }
                    return void 0 === h && (h = setTimeout(s, t)),
                    g
                }
                var b, v, y, g, h, w, k = 0, S = !1, _ = !1, E = !0;
                if ("function" != typeof e)
                    throw new TypeError(f);
                return t = u(t) || 0,
                i(n) && (S = !!n.leading,
                _ = "maxWait"in n,
                y = _ ? x(u(n.maxWait) || 0, t) : y,
                E = "trailing"in n ? !!n.trailing : E),
                m.cancel = l,
                m.flush = p,
                m
            }
            function o(e, t, o) {
                var r = !0
                  , a = !0;
                if ("function" != typeof e)
                    throw new TypeError(f);
                return i(o) && (r = "leading"in o ? !!o.leading : r,
                a = "trailing"in o ? !!o.trailing : a),
                n(e, t, {
                    leading: r,
                    maxWait: t,
                    trailing: a
                })
            }
            function i(e) {
                var t = "undefined" == typeof e ? "undefined" : c(e);
                return !!e && ("object" == t || "function" == t)
            }
            function r(e) {
                return !!e && "object" == ("undefined" == typeof e ? "undefined" : c(e))
            }
            function a(e) {
                return "symbol" == ("undefined" == typeof e ? "undefined" : c(e)) || r(e) && k.call(e) == d
            }
            function u(e) {
                if ("number" == typeof e)
                    return e;
                if (a(e))
                    return s;
                if (i(e)) {
                    var t = "function" == typeof e.valueOf ? e.valueOf() : e;
                    e = i(t) ? t + "" : t
                }
                if ("string" != typeof e)
                    return 0 === e ? e : +e;
                e = e.replace(l, "");
                var n = m.test(e);
                return n || b.test(e) ? v(e.slice(2), n ? 2 : 8) : p.test(e) ? s : +e
            }
            var c = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
                return typeof e
            }
            : function(e) {
                return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
            }
              , f = "Expected a function"
              , s = NaN
              , d = "[object Symbol]"
              , l = /^\s+|\s+$/g
              , p = /^[-+]0x[0-9a-f]+$/i
              , m = /^0b[01]+$/i
              , b = /^0o[0-7]+$/i
              , v = parseInt
              , y = "object" == ("undefined" == typeof t ? "undefined" : c(t)) && t && t.Object === Object && t
              , g = "object" == ("undefined" == typeof self ? "undefined" : c(self)) && self && self.Object === Object && self
              , h = y || g || Function("return this")()
              , w = Object.prototype
              , k = w.toString
              , x = Math.max
              , j = Math.min
              , O = function() {
                return h.Date.now()
            };
            e.exports = o
        }
        ).call(t, function() {
            return this
        }())
    }
    , function(e, t) {
        (function(t) {
            "use strict";
            function n(e, t, n) {
                function i(t) {
                    var n = b
                      , o = v;
                    return b = v = void 0,
                    O = t,
                    g = e.apply(o, n)
                }
                function r(e) {
                    return O = e,
                    h = setTimeout(s, t),
                    S ? i(e) : g
                }
                function u(e) {
                    var n = e - w
                      , o = e - O
                      , i = t - n;
                    return _ ? x(i, y - o) : i
                }
                function f(e) {
                    var n = e - w
                      , o = e - O;
                    return void 0 === w || n >= t || n < 0 || _ && o >= y
                }
                function s() {
                    var e = j();
                    return f(e) ? d(e) : void (h = setTimeout(s, u(e)))
                }
                function d(e) {
                    return h = void 0,
                    E && b ? i(e) : (b = v = void 0,
                    g)
                }
                function l() {
                    void 0 !== h && clearTimeout(h),
                    O = 0,
                    b = w = v = h = void 0
                }
                function p() {
                    return void 0 === h ? g : d(j())
                }
                function m() {
                    var e = j()
                      , n = f(e);
                    if (b = arguments,
                    v = this,
                    w = e,
                    n) {
                        if (void 0 === h)
                            return r(w);
                        if (_)
                            return h = setTimeout(s, t),
                            i(w)
                    }
                    return void 0 === h && (h = setTimeout(s, t)),
                    g
                }
                var b, v, y, g, h, w, O = 0, S = !1, _ = !1, E = !0;
                if ("function" != typeof e)
                    throw new TypeError(c);
                return t = a(t) || 0,
                o(n) && (S = !!n.leading,
                _ = "maxWait"in n,
                y = _ ? k(a(n.maxWait) || 0, t) : y,
                E = "trailing"in n ? !!n.trailing : E),
                m.cancel = l,
                m.flush = p,
                m
            }
            function o(e) {
                var t = "undefined" == typeof e ? "undefined" : u(e);
                return !!e && ("object" == t || "function" == t)
            }
            function i(e) {
                return !!e && "object" == ("undefined" == typeof e ? "undefined" : u(e))
            }
            function r(e) {
                return "symbol" == ("undefined" == typeof e ? "undefined" : u(e)) || i(e) && w.call(e) == s
            }
            function a(e) {
                if ("number" == typeof e)
                    return e;
                if (r(e))
                    return f;
                if (o(e)) {
                    var t = "function" == typeof e.valueOf ? e.valueOf() : e;
                    e = o(t) ? t + "" : t
                }
                if ("string" != typeof e)
                    return 0 === e ? e : +e;
                e = e.replace(d, "");
                var n = p.test(e);
                return n || m.test(e) ? b(e.slice(2), n ? 2 : 8) : l.test(e) ? f : +e
            }
            var u = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
                return typeof e
            }
            : function(e) {
                return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
            }
              , c = "Expected a function"
              , f = NaN
              , s = "[object Symbol]"
              , d = /^\s+|\s+$/g
              , l = /^[-+]0x[0-9a-f]+$/i
              , p = /^0b[01]+$/i
              , m = /^0o[0-7]+$/i
              , b = parseInt
              , v = "object" == ("undefined" == typeof t ? "undefined" : u(t)) && t && t.Object === Object && t
              , y = "object" == ("undefined" == typeof self ? "undefined" : u(self)) && self && self.Object === Object && self
              , g = v || y || Function("return this")()
              , h = Object.prototype
              , w = h.toString
              , k = Math.max
              , x = Math.min
              , j = function() {
                return g.Date.now()
            };
            e.exports = n
        }
        ).call(t, function() {
            return this
        }())
    }
    , function(e, t) {
        "use strict";
        function n(e, t) {
            a.push({
                selector: e,
                fn: t
            }),
            !u && r && (u = new r(o),
            u.observe(i.documentElement, {
                childList: !0,
                subtree: !0,
                removedNodes: !0
            })),
            o()
        }
        function o() {
            for (var e, t, n = 0, o = a.length; n < o; n++) {
                e = a[n],
                t = i.querySelectorAll(e.selector);
                for (var r, u = 0, c = t.length; u < c; u++)
                    r = t[u],
                    r.ready || (r.ready = !0,
                    e.fn.call(r, r))
            }
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var i = window.document
          , r = window.MutationObserver || window.WebKitMutationObserver
          , a = []
          , u = void 0;
        t["default"] = n
    }
    , function(e, t) {
        "use strict";
        function n(e, t) {
            if (!(e instanceof t))
                throw new TypeError("Cannot call a class as a function")
        }
        function o() {
            return navigator.userAgent || navigator.vendor || window.opera || ""
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var i = function() {
            function e(e, t) {
                for (var n = 0; n < t.length; n++) {
                    var o = t[n];
                    o.enumerable = o.enumerable || !1,
                    o.configurable = !0,
                    "value"in o && (o.writable = !0),
                    Object.defineProperty(e, o.key, o)
                }
            }
            return function(t, n, o) {
                return n && e(t.prototype, n),
                o && e(t, o),
                t
            }
        }()
          , r = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i
          , a = /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i
          , u = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i
          , c = /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i
          , f = function() {
            function e() {
                n(this, e)
            }
            return i(e, [{
                key: "phone",
                value: function() {
                    var e = o();
                    return !(!r.test(e) && !a.test(e.substr(0, 4)))
                }
            }, {
                key: "mobile",
                value: function() {
                    var e = o();
                    return !(!u.test(e) && !c.test(e.substr(0, 4)))
                }
            }, {
                key: "tablet",
                value: function() {
                    return this.mobile() && !this.phone()
                }
            }]),
            e
        }();
        t["default"] = new f
    }
    , function(e, t) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var n = function(e, t, n) {
            var o = e.node.getAttribute("data-aos-once");
            t > e.position ? e.node.classList.add("aos-animate") : "undefined" != typeof o && ("false" === o || !n && "true" !== o) && e.node.classList.remove("aos-animate")
        }
          , o = function(e, t) {
            var o = window.pageYOffset
              , i = window.innerHeight;
            e.forEach(function(e, r) {
                n(e, i + o, t)
            })
        };
        t["default"] = o
    }
    , function(e, t, n) {
        "use strict";
        function o(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var i = n(12)
          , r = o(i)
          , a = function(e, t) {
            return e.forEach(function(e, n) {
                e.node.classList.add("aos-init"),
                e.position = (0,
                r["default"])(e.node, t.offset)
            }),
            e
        };
        t["default"] = a
    }
    , function(e, t, n) {
        "use strict";
        function o(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var i = n(13)
          , r = o(i)
          , a = function(e, t) {
            var n = 0
              , o = 0
              , i = window.innerHeight
              , a = {
                offset: e.getAttribute("data-aos-offset"),
                anchor: e.getAttribute("data-aos-anchor"),
                anchorPlacement: e.getAttribute("data-aos-anchor-placement")
            };
            switch (a.offset && !isNaN(a.offset) && (o = parseInt(a.offset)),
            a.anchor && document.querySelectorAll(a.anchor) && (e = document.querySelectorAll(a.anchor)[0]),
            n = (0,
            r["default"])(e).top,
            a.anchorPlacement) {
            case "top-bottom":
                break;
            case "center-bottom":
                n += e.offsetHeight / 2;
                break;
            case "bottom-bottom":
                n += e.offsetHeight;
                break;
            case "top-center":
                n += i / 2;
                break;
            case "bottom-center":
                n += i / 2 + e.offsetHeight;
                break;
            case "center-center":
                n += i / 2 + e.offsetHeight / 2;
                break;
            case "top-top":
                n += i;
                break;
            case "bottom-top":
                n += e.offsetHeight + i;
                break;
            case "center-top":
                n += e.offsetHeight / 2 + i
            }
            return a.anchorPlacement || a.offset || isNaN(t) || (o = t),
            n + o
        };
        t["default"] = a
    }
    , function(e, t) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var n = function(e) {
            for (var t = 0, n = 0; e && !isNaN(e.offsetLeft) && !isNaN(e.offsetTop); )
                t += e.offsetLeft - ("BODY" != e.tagName ? e.scrollLeft : 0),
                n += e.offsetTop - ("BODY" != e.tagName ? e.scrollTop : 0),
                e = e.offsetParent;
            return {
                top: n,
                left: t
            }
        };
        t["default"] = n
    }
    , function(e, t) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var n = function(e) {
            e = e || document.querySelectorAll("[data-aos]");
            var t = [];
            return [].forEach.call(e, function(e, n) {
                t.push({
                    node: e
                })
            }),
            t
        };
        t["default"] = n
    }
    ])
});
// ==================================================
// fancyBox v3.1.20
//
// Licensed GPLv3 for open source use
// or fancyBox Commercial License for commercial use
//
// http://fancyapps.com/fancybox/
// Copyright 2017 fancyApps
//
// ==================================================
!function(t, e, n, o) {
    "use strict";
    function i(t) {
        var e = t.currentTarget
          , o = t.data ? t.data.options : {}
          , i = t.data ? t.data.items : []
          , a = n(e).attr("data-fancybox") || ""
          , s = 0;
        t.preventDefault(),
        t.stopPropagation(),
        a ? (i = i.length ? i.filter('[data-fancybox="' + a + '"]') : n('[data-fancybox="' + a + '"]'),
        s = i.index(e),
        s < 0 && (s = 0)) : i = [e],
        n.fancybox.open(i, o, s)
    }
    if (n) {
        if (n.fn.fancybox)
            return void n.error("fancyBox already initialized");
        var a = {
            loop: !1,
            margin: [44, 0],
            gutter: 50,
            keyboard: !0,
            arrows: !0,
            infobar: !1,
            toolbar: !0,
            buttons: ["slideShow", "fullScreen", "thumbs", "close"],
            idleTime: 4,
            smallBtn: "auto",
            protect: !1,
            modal: !1,
            image: {
                preload: "auto"
            },
            ajax: {
                settings: {
                    data: {
                        fancybox: !0
                    }
                }
            },
            iframe: {
                tpl: '<iframe id="fancybox-frame{rnd}" name="fancybox-frame{rnd}" class="fancybox-iframe" frameborder="0" vspace="0" hspace="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen allowtransparency="true" src=""></iframe>',
                preload: !0,
                css: {},
                attr: {
                    scrolling: "auto"
                }
            },
            animationEffect: "zoom",
            animationDuration: 366,
            zoomOpacity: "auto",
            transitionEffect: "fade",
            transitionDuration: 366,
            slideClass: "",
            baseClass: "",
            baseTpl: '<div class="fancybox-container" role="dialog" tabindex="-1"><div class="fancybox-bg"></div><div class="fancybox-inner"><div class="fancybox-infobar"><button data-fancybox-prev title="{{PREV}}" class="fancybox-button fancybox-button--left"></button><div class="fancybox-infobar__body"><span data-fancybox-index></span>&nbsp;/&nbsp;<span data-fancybox-count></span></div><button data-fancybox-next title="{{NEXT}}" class="fancybox-button fancybox-button--right"></button></div><div class="fancybox-toolbar">{{BUTTONS}}</div><div class="fancybox-navigation"><button data-fancybox-prev title="{{PREV}}" class="fancybox-arrow fancybox-arrow--left" /><button data-fancybox-next title="{{NEXT}}" class="fancybox-arrow fancybox-arrow--right" /></div><div class="fancybox-stage"></div><div class="fancybox-caption-wrap"><div class="fancybox-caption"></div></div></div></div>',
            spinnerTpl: '<div class="fancybox-loading"></div>',
            errorTpl: '<div class="fancybox-error"><p>{{ERROR}}<p></div>',
            btnTpl: {
                slideShow: '<button data-fancybox-play class="fancybox-button fancybox-button--play" title="{{PLAY_START}}"></button>',
                fullScreen: '<button data-fancybox-fullscreen class="fancybox-button fancybox-button--fullscreen" title="{{FULL_SCREEN}}"></button>',
                thumbs: '<button data-fancybox-thumbs class="fancybox-button fancybox-button--thumbs" title="{{THUMBS}}"></button>',
                close: '<button data-fancybox-close class="fancybox-button fancybox-button--close" title="{{CLOSE}}"></button>',
                smallBtn: '<button data-fancybox-close class="fancybox-close-small" title="{{CLOSE}}"></button>'
            },
            parentEl: "body",
            autoFocus: !0,
            backFocus: !0,
            trapFocus: !0,
            fullScreen: {
                autoStart: !1
            },
            touch: {
                vertical: !0,
                momentum: !0
            },
            hash: null,
            media: {},
            slideShow: {
                autoStart: !1,
                speed: 4e3
            },
            thumbs: {
                autoStart: !1,
                hideOnClose: !0
            },
            onInit: n.noop,
            beforeLoad: n.noop,
            afterLoad: n.noop,
            beforeShow: n.noop,
            afterShow: n.noop,
            beforeClose: n.noop,
            afterClose: n.noop,
            onActivate: n.noop,
            onDeactivate: n.noop,
            clickContent: function(t, e) {
                return "image" === t.type && "zoom"
            },
            clickSlide: "close",
            clickOutside: "close",
            dblclickContent: !1,
            dblclickSlide: !1,
            dblclickOutside: !1,
            mobile: {
                clickContent: function(t, e) {
                    return "image" === t.type && "toggleControls"
                },
                clickSlide: function(t, e) {
                    return "image" === t.type ? "toggleControls" : "close"
                },
                dblclickContent: function(t, e) {
                    return "image" === t.type && "zoom"
                },
                dblclickSlide: function(t, e) {
                    return "image" === t.type && "zoom"
                }
            },
            lang: "en",
            i18n: {
                en: {
                    CLOSE: "Close",
                    NEXT: "Next",
                    PREV: "Previous",
                    ERROR: "The requested content cannot be loaded. <br/> Please try again later.",
                    PLAY_START: "Start slideshow",
                    PLAY_STOP: "Pause slideshow",
                    FULL_SCREEN: "Full screen",
                    THUMBS: "Thumbnails"
                },
                de: {
                    CLOSE: "Schliessen",
                    NEXT: "Weiter",
                    PREV: "Zurück",
                    ERROR: "Die angeforderten Daten konnten nicht geladen werden. <br/> Bitte versuchen Sie es später nochmal.",
                    PLAY_START: "Diaschau starten",
                    PLAY_STOP: "Diaschau beenden",
                    FULL_SCREEN: "Vollbild",
                    THUMBS: "Vorschaubilder"
                }
            }
        }
          , s = n(t)
          , r = n(e)
          , c = 0
          , l = function(t) {
            return t && t.hasOwnProperty && t instanceof n
        }
          , u = function() {
            return t.requestAnimationFrame || t.webkitRequestAnimationFrame || t.mozRequestAnimationFrame || t.oRequestAnimationFrame || function(e) {
                return t.setTimeout(e, 1e3 / 60)
            }
        }()
          , d = function() {
            var t, n = e.createElement("fakeelement"), i = {
                transition: "transitionend",
                OTransition: "oTransitionEnd",
                MozTransition: "transitionend",
                WebkitTransition: "webkitTransitionEnd"
            };
            for (t in i)
                if (n.style[t] !== o)
                    return i[t]
        }()
          , f = function(t) {
            return t && t.length && t[0].offsetHeight
        }
          , h = function(t, o, i) {
            var s = this;
            s.opts = n.extend(!0, {
                index: i
            }, a, o || {}),
            o && n.isArray(o.buttons) && (s.opts.buttons = o.buttons),
            s.id = s.opts.id || ++c,
            s.group = [],
            s.currIndex = parseInt(s.opts.index, 10) || 0,
            s.prevIndex = null,
            s.prevPos = null,
            s.currPos = 0,
            s.firstRun = null,
            s.createGroup(t),
            s.group.length && (s.$lastFocus = n(e.activeElement).blur(),
            s.slides = {},
            s.init(t))
        };
        n.extend(h.prototype, {
            init: function() {
                var t, e, o, i = this, a = i.group[i.currIndex].opts;
                i.scrollTop = r.scrollTop(),
                i.scrollLeft = r.scrollLeft(),
                n.fancybox.getInstance() || n.fancybox.isMobile || "hidden" === n("body").css("overflow") || (t = n("body").width(),
                n("html").addClass("fancybox-enabled"),
                t = n("body").width() - t,
                t > 1 && n("head").append('<style id="fancybox-style-noscroll" type="text/css">.compensate-for-scrollbar, .fancybox-enabled body { margin-right: ' + t + "px; }</style>")),
                o = "",
                n.each(a.buttons, function(t, e) {
                    o += a.btnTpl[e] || ""
                }),
                e = n(i.translate(i, a.baseTpl.replace("{{BUTTONS}}", o))).addClass("fancybox-is-hidden").attr("id", "fancybox-container-" + i.id).addClass(a.baseClass).data("FancyBox", i).prependTo(a.parentEl),
                i.$refs = {
                    container: e
                },
                ["bg", "inner", "infobar", "toolbar", "stage", "caption"].forEach(function(t) {
                    i.$refs[t] = e.find(".fancybox-" + t)
                }),
                (!a.arrows || i.group.length < 2) && e.find(".fancybox-navigation").remove(),
                a.infobar || i.$refs.infobar.remove(),
                a.toolbar || i.$refs.toolbar.remove(),
                i.trigger("onInit"),
                i.activate(),
                i.jumpTo(i.currIndex)
            },
            translate: function(t, e) {
                var n = t.opts.i18n[t.opts.lang];
                return e.replace(/\{\{(\w+)\}\}/g, function(t, e) {
                    var i = n[e];
                    return i === o ? t : i
                })
            },
            createGroup: function(t) {
                var e = this
                  , i = n.makeArray(t);
                n.each(i, function(t, i) {
                    var a, s, r, c, l = {}, u = {}, d = [];
                    n.isPlainObject(i) ? (l = i,
                    u = i.opts || i) : "object" === n.type(i) && n(i).length ? (a = n(i),
                    d = a.data(),
                    u = "options"in d ? d.options : {},
                    u = "object" === n.type(u) ? u : {},
                    l.src = "src"in d ? d.src : u.src || a.attr("href"),
                    ["width", "height", "thumb", "type", "filter"].forEach(function(t) {
                        t in d && (u[t] = d[t])
                    }),
                    "srcset"in d && (u.image = {
                        srcset: d.srcset
                    }),
                    u.$orig = a,
                    l.type || l.src || (l.type = "inline",
                    l.src = i)) : l = {
                        type: "html",
                        src: i + ""
                    },
                    l.opts = n.extend(!0, {}, e.opts, u),
                    n.fancybox.isMobile && (l.opts = n.extend(!0, {}, l.opts, l.opts.mobile)),
                    s = l.type || l.opts.type,
                    r = l.src || "",
                    !s && r && (r.match(/(^data:image\/[a-z0-9+\/=]*,)|(\.(jp(e|g|eg)|gif|png|bmp|webp|svg|ico)((\?|#).*)?$)/i) ? s = "image" : r.match(/\.(pdf)((\?|#).*)?$/i) ? s = "pdf" : "#" === r.charAt(0) && (s = "inline")),
                    l.type = s,
                    l.index = e.group.length,
                    l.opts.$orig && !l.opts.$orig.length && delete l.opts.$orig,
                    !l.opts.$thumb && l.opts.$orig && (l.opts.$thumb = l.opts.$orig.find("img:first")),
                    l.opts.$thumb && !l.opts.$thumb.length && delete l.opts.$thumb,
                    "function" === n.type(l.opts.caption) ? l.opts.caption = l.opts.caption.apply(i, [e, l]) : "caption"in d && (l.opts.caption = d.caption),
                    l.opts.caption = l.opts.caption === o ? "" : l.opts.caption + "",
                    "ajax" === s && (c = r.split(/\s+/, 2),
                    c.length > 1 && (l.src = c.shift(),
                    l.opts.filter = c.shift())),
                    "auto" == l.opts.smallBtn && (n.inArray(s, ["html", "inline", "ajax"]) > -1 ? (l.opts.toolbar = !1,
                    l.opts.smallBtn = !0) : l.opts.smallBtn = !1),
                    "pdf" === s && (l.type = "iframe",
                    l.opts.iframe.preload = !1),
                    l.opts.modal && (l.opts = n.extend(!0, l.opts, {
                        infobar: 0,
                        toolbar: 0,
                        smallBtn: 0,
                        keyboard: 0,
                        slideShow: 0,
                        fullScreen: 0,
                        thumbs: 0,
                        touch: 0,
                        clickContent: !1,
                        clickSlide: !1,
                        clickOutside: !1,
                        dblclickContent: !1,
                        dblclickSlide: !1,
                        dblclickOutside: !1
                    })),
                    e.group.push(l)
                })
            },
            addEvents: function() {
                var o = this;
                o.removeEvents(),
                o.$refs.container.on("click.fb-close", "[data-fancybox-close]", function(t) {
                    t.stopPropagation(),
                    t.preventDefault(),
                    o.close(t)
                }).on("click.fb-prev touchend.fb-prev", "[data-fancybox-prev]", function(t) {
                    t.stopPropagation(),
                    t.preventDefault(),
                    o.previous()
                }).on("click.fb-next touchend.fb-next", "[data-fancybox-next]", function(t) {
                    t.stopPropagation(),
                    t.preventDefault(),
                    o.next()
                }),
                s.on("orientationchange.fb resize.fb", function(t) {
                    t && t.originalEvent && "resize" === t.originalEvent.type ? u(function() {
                        o.update()
                    }) : (o.$refs.stage.hide(),
                    setTimeout(function() {
                        o.$refs.stage.show(),
                        o.update()
                    }, 500))
                }),
                r.on("focusin.fb", function(t) {
                    var i = n.fancybox ? n.fancybox.getInstance() : null;
                    i.isClosing || !i.current || !i.current.opts.trapFocus || n(t.target).hasClass("fancybox-container") || n(t.target).is(e) || i && "fixed" !== n(t.target).css("position") && !i.$refs.container.has(t.target).length && (t.stopPropagation(),
                    i.focus(),
                    s.scrollTop(o.scrollTop).scrollLeft(o.scrollLeft))
                }),
                r.on("keydown.fb", function(t) {
                    var e = o.current
                      , i = t.keyCode || t.which;
                    if (e && e.opts.keyboard && !n(t.target).is("input") && !n(t.target).is("textarea"))
                        return 8 === i || 27 === i ? (t.preventDefault(),
                        void o.close(t)) : 37 === i || 38 === i ? (t.preventDefault(),
                        void o.previous()) : 39 === i || 40 === i ? (t.preventDefault(),
                        void o.next()) : void o.trigger("afterKeydown", t, i)
                }),
                o.group[o.currIndex].opts.idleTime && (o.idleSecondsCounter = 0,
                r.on("mousemove.fb-idle mouseenter.fb-idle mouseleave.fb-idle mousedown.fb-idle touchstart.fb-idle touchmove.fb-idle scroll.fb-idle keydown.fb-idle", function() {
                    o.idleSecondsCounter = 0,
                    o.isIdle && o.showControls(),
                    o.isIdle = !1
                }),
                o.idleInterval = t.setInterval(function() {
                    o.idleSecondsCounter++,
                    o.idleSecondsCounter >= o.group[o.currIndex].opts.idleTime && (o.isIdle = !0,
                    o.idleSecondsCounter = 0,
                    o.hideControls())
                }, 1e3))
            },
            removeEvents: function() {
                var e = this;
                s.off("orientationchange.fb resize.fb"),
                r.off("focusin.fb keydown.fb .fb-idle"),
                this.$refs.container.off(".fb-close .fb-prev .fb-next"),
                e.idleInterval && (t.clearInterval(e.idleInterval),
                e.idleInterval = null)
            },
            previous: function(t) {
                return this.jumpTo(this.currPos - 1, t)
            },
            next: function(t) {
                return this.jumpTo(this.currPos + 1, t)
            },
            jumpTo: function(t, e, i) {
                var a, s, r, c, l, u, d, h = this, p = h.group.length;
                if (!(h.isSliding || h.isClosing || h.isAnimating && h.firstRun)) {
                    if (t = parseInt(t, 10),
                    s = h.current ? h.current.opts.loop : h.opts.loop,
                    !s && (t < 0 || t >= p))
                        return !1;
                    if (a = h.firstRun = null === h.firstRun,
                    !(p < 2 && !a && h.isSliding)) {
                        if (c = h.current,
                        h.prevIndex = h.currIndex,
                        h.prevPos = h.currPos,
                        r = h.createSlide(t),
                        p > 1 && ((s || r.index > 0) && h.createSlide(t - 1),
                        (s || r.index < p - 1) && h.createSlide(t + 1)),
                        h.current = r,
                        h.currIndex = r.index,
                        h.currPos = r.pos,
                        h.trigger("beforeShow", a),
                        h.updateControls(),
                        u = n.fancybox.getTranslate(r.$slide),
                        r.isMoved = (0 !== u.left || 0 !== u.top) && !r.$slide.hasClass("fancybox-animated"),
                        r.forcedDuration = o,
                        n.isNumeric(e) ? r.forcedDuration = e : e = r.opts[a ? "animationDuration" : "transitionDuration"],
                        e = parseInt(e, 10),
                        a)
                            return r.opts.animationEffect && e && h.$refs.container.css("transition-duration", e + "ms"),
                            h.$refs.container.removeClass("fancybox-is-hidden"),
                            f(h.$refs.container),
                            h.$refs.container.addClass("fancybox-is-open"),
                            r.$slide.addClass("fancybox-slide--current"),
                            h.loadSlide(r),
                            void h.preload();
                        n.each(h.slides, function(t, e) {
                            n.fancybox.stop(e.$slide)
                        }),
                        r.$slide.removeClass("fancybox-slide--next fancybox-slide--previous").addClass("fancybox-slide--current"),
                        r.isMoved ? (l = Math.round(r.$slide.width()),
                        n.each(h.slides, function(t, o) {
                            var i = o.pos - r.pos;
                            n.fancybox.animate(o.$slide, {
                                top: 0,
                                left: i * l + i * o.opts.gutter
                            }, e, function() {
                                o.$slide.removeAttr("style").removeClass("fancybox-slide--next fancybox-slide--previous"),
                                o.pos === h.currPos && (r.isMoved = !1,
                                h.complete())
                            })
                        })) : h.$refs.stage.children().removeAttr("style"),
                        r.isLoaded ? h.revealContent(r) : h.loadSlide(r),
                        h.preload(),
                        c.pos !== r.pos && (d = "fancybox-slide--" + (c.pos > r.pos ? "next" : "previous"),
                        c.$slide.removeClass("fancybox-slide--complete fancybox-slide--current fancybox-slide--next fancybox-slide--previous"),
                        c.isComplete = !1,
                        e && (r.isMoved || r.opts.transitionEffect) && (r.isMoved ? c.$slide.addClass(d) : (d = "fancybox-animated " + d + " fancybox-fx-" + r.opts.transitionEffect,
                        n.fancybox.animate(c.$slide, d, e, function() {
                            c.$slide.removeClass(d).removeAttr("style")
                        }))))
                    }
                }
            },
            createSlide: function(t) {
                var e, o, i = this;
                return o = t % i.group.length,
                o = o < 0 ? i.group.length + o : o,
                !i.slides[t] && i.group[o] && (e = n('<div class="fancybox-slide"></div>').appendTo(i.$refs.stage),
                i.slides[t] = n.extend(!0, {}, i.group[o], {
                    pos: t,
                    $slide: e,
                    isLoaded: !1
                }),
                i.updateSlide(i.slides[t])),
                i.slides[t]
            },
            scaleToActual: function(t, e, i) {
                var a, s, r, c, l, u = this, d = u.current, f = d.$content, h = parseInt(d.$slide.width(), 10), p = parseInt(d.$slide.height(), 10), g = d.width, b = d.height;
                "image" != d.type || d.hasError || !f || u.isAnimating || (n.fancybox.stop(f),
                u.isAnimating = !0,
                t = t === o ? .5 * h : t,
                e = e === o ? .5 * p : e,
                a = n.fancybox.getTranslate(f),
                c = g / a.width,
                l = b / a.height,
                s = .5 * h - .5 * g,
                r = .5 * p - .5 * b,
                g > h && (s = a.left * c - (t * c - t),
                s > 0 && (s = 0),
                s < h - g && (s = h - g)),
                b > p && (r = a.top * l - (e * l - e),
                r > 0 && (r = 0),
                r < p - b && (r = p - b)),
                u.updateCursor(g, b),
                n.fancybox.animate(f, {
                    top: r,
                    left: s,
                    scaleX: c,
                    scaleY: l
                }, i || 330, function() {
                    u.isAnimating = !1
                }),
                u.SlideShow && u.SlideShow.isActive && u.SlideShow.stop())
            },
            scaleToFit: function(t) {
                var e, o = this, i = o.current, a = i.$content;
                "image" != i.type || i.hasError || !a || o.isAnimating || (n.fancybox.stop(a),
                o.isAnimating = !0,
                e = o.getFitPos(i),
                o.updateCursor(e.width, e.height),
                n.fancybox.animate(a, {
                    top: e.top,
                    left: e.left,
                    scaleX: e.width / a.width(),
                    scaleY: e.height / a.height()
                }, t || 330, function() {
                    o.isAnimating = !1
                }))
            },
            getFitPos: function(t) {
                var e, o, i, a, r, c = this, l = t.$content, u = t.width, d = t.height, f = t.opts.margin;
                return !(!l || !l.length || !u && !d) && ("number" === n.type(f) && (f = [f, f]),
                2 == f.length && (f = [f[0], f[1], f[0], f[1]]),
                s.width() < 800 && (f = [0, 0, 0, 0]),
                e = parseInt(c.$refs.stage.width(), 10) - (f[1] + f[3]),
                o = parseInt(c.$refs.stage.height(), 10) - (f[0] + f[2]),
                i = Math.min(1, e / u, o / d),
                a = Math.floor(i * u),
                r = Math.floor(i * d),
                {
                    top: Math.floor(.5 * (o - r)) + f[0],
                    left: Math.floor(.5 * (e - a)) + f[3],
                    width: a,
                    height: r
                })
            },
            update: function() {
                var t = this;
                n.each(t.slides, function(e, n) {
                    t.updateSlide(n)
                })
            },
            updateSlide: function(t) {
                var e = this
                  , o = t.$content;
                o && (t.width || t.height) && (n.fancybox.stop(o),
                n.fancybox.setTranslate(o, e.getFitPos(t)),
                t.pos === e.currPos && e.updateCursor()),
                t.$slide.trigger("refresh"),
                e.trigger("onUpdate", t)
            },
            updateCursor: function(t, e) {
                var n, i = this, a = i.$refs.container.removeClass("fancybox-is-zoomable fancybox-can-zoomIn fancybox-can-drag fancybox-can-zoomOut");
                i.current && !i.isClosing && (i.isZoomable() ? (a.addClass("fancybox-is-zoomable"),
                n = t !== o && e !== o ? t < i.current.width && e < i.current.height : i.isScaledDown(),
                n ? a.addClass("fancybox-can-zoomIn") : i.current.opts.touch ? a.addClass("fancybox-can-drag") : a.addClass("fancybox-can-zoomOut")) : i.current.opts.touch && a.addClass("fancybox-can-drag"))
            },
            isZoomable: function() {
                var t, e = this, o = e.current;
                if (o && !e.isClosing)
                    return !!("image" === o.type && o.isLoaded && !o.hasError && ("zoom" === o.opts.clickContent || n.isFunction(o.opts.clickContent) && "zoom" === o.opts.clickContent(o)) && (t = e.getFitPos(o),
                    o.width > t.width || o.height > t.height))
            },
            isScaledDown: function() {
                var t = this
                  , e = t.current
                  , o = e.$content
                  , i = !1;
                return o && (i = n.fancybox.getTranslate(o),
                i = i.width < e.width || i.height < e.height),
                i
            },
            canPan: function() {
                var t = this
                  , e = t.current
                  , n = e.$content
                  , o = !1;
                return n && (o = t.getFitPos(e),
                o = Math.abs(n.width() - o.width) > 1 || Math.abs(n.height() - o.height) > 1),
                o
            },
            loadSlide: function(t) {
                var e, o, i, a = this;
                if (!t.isLoading && !t.isLoaded) {
                    switch (t.isLoading = !0,
                    a.trigger("beforeLoad", t),
                    e = t.type,
                    o = t.$slide,
                    o.off("refresh").trigger("onReset").addClass("fancybox-slide--" + (e || "unknown")).addClass(t.opts.slideClass),
                    e) {
                    case "image":
                        a.setImage(t);
                        break;
                    case "iframe":
                        a.setIframe(t);
                        break;
                    case "html":
                        a.setContent(t, t.src || t.content);
                        break;
                    case "inline":
                        n(t.src).length ? a.setContent(t, n(t.src)) : a.setError(t);
                        break;
                    case "ajax":
                        a.showLoading(t),
                        i = n.ajax(n.extend({}, t.opts.ajax.settings, {
                            url: t.src,
                            success: function(e, n) {
                                "success" === n && a.setContent(t, e)
                            },
                            error: function(e, n) {
                                e && "abort" !== n && a.setError(t)
                            }
                        })),
                        o.one("onReset", function() {
                            i.abort()
                        });
                        break;
                    default:
                        a.setError(t)
                    }
                    return !0
                }
            },
            setImage: function(e) {
                var o, i, a, s, r = this, c = e.opts.image.srcset;
                if (c) {
                    a = t.devicePixelRatio || 1,
                    s = t.innerWidth * a,
                    i = c.split(",").map(function(t) {
                        var e = {};
                        return t.trim().split(/\s+/).forEach(function(t, n) {
                            var o = parseInt(t.substring(0, t.length - 1), 10);
                            return 0 === n ? e.url = t : void (o && (e.value = o,
                            e.postfix = t[t.length - 1]))
                        }),
                        e
                    }),
                    i.sort(function(t, e) {
                        return t.value - e.value
                    });
                    for (var l = 0; l < i.length; l++) {
                        var u = i[l];
                        if ("w" === u.postfix && u.value >= s || "x" === u.postfix && u.value >= a) {
                            o = u;
                            break
                        }
                    }
                    !o && i.length && (o = i[i.length - 1]),
                    o && (e.src = o.url,
                    e.width && e.height && "w" == o.postfix && (e.height = e.width / e.height * o.value,
                    e.width = o.value))
                }
                e.$content = n('<div class="fancybox-image-wrap"></div>').addClass("fancybox-is-hidden").appendTo(e.$slide),
                e.opts.preload !== !1 && e.opts.width && e.opts.height && (e.opts.thumb || e.opts.$thumb) ? (e.width = e.opts.width,
                e.height = e.opts.height,
                e.$ghost = n("<img />").one("error", function() {
                    n(this).remove(),
                    e.$ghost = null,
                    r.setBigImage(e)
                }).one("load", function() {
                    r.afterLoad(e),
                    r.setBigImage(e)
                }).addClass("fancybox-image").appendTo(e.$content).attr("src", e.opts.thumb || e.opts.$thumb.attr("src"))) : r.setBigImage(e)
            },
            setBigImage: function(t) {
                var e = this
                  , o = n("<img />");
                t.$image = o.one("error", function() {
                    e.setError(t)
                }).one("load", function() {
                    clearTimeout(t.timouts),
                    t.timouts = null,
                    e.isClosing || (t.width = this.naturalWidth,
                    t.height = this.naturalHeight,
                    t.opts.image.srcset && o.attr("sizes", "100vw").attr("srcset", t.opts.image.srcset),
                    e.hideLoading(t),
                    t.$ghost ? t.timouts = setTimeout(function() {
                        t.timouts = null,
                        t.$ghost.hide()
                    }, Math.min(300, Math.max(1e3, t.height / 1600))) : e.afterLoad(t))
                }).addClass("fancybox-image").attr("src", t.src).appendTo(t.$content),
                o[0].complete ? o.trigger("load") : o[0].error ? o.trigger("error") : t.timouts = setTimeout(function() {
                    o[0].complete || t.hasError || e.showLoading(t)
                }, 100)
            },
            setIframe: function(t) {
                var e, i = this, a = t.opts.iframe, s = t.$slide;
                t.$content = n('<div class="fancybox-content' + (a.preload ? " fancybox-is-hidden" : "") + '"></div>').css(a.css).appendTo(s),
                e = n(a.tpl.replace(/\{rnd\}/g, (new Date).getTime())).attr(a.attr).appendTo(t.$content),
                a.preload ? (i.showLoading(t),
                e.on("load.fb error.fb", function(e) {
                    this.isReady = 1,
                    t.$slide.trigger("refresh"),
                    i.afterLoad(t)
                }),
                s.on("refresh.fb", function() {
                    var t, n, i, s, r, c = l.$content;
                    if (1 === e[0].isReady) {
                        try {
                            t = e.contents(),
                            n = t.find("body")
                        } catch (l) {}
                        n && n.length && (a.css.width === o || a.css.height === o) && (i = e[0].contentWindow.document.documentElement.scrollWidth,
                        s = Math.ceil(n.outerWidth(!0) + (c.width() - i)),
                        r = Math.ceil(n.outerHeight(!0)),
                        c.css({
                            width: a.css.width === o ? s + (c.outerWidth() - c.innerWidth()) : a.css.width,
                            height: a.css.height === o ? r + (c.outerHeight() - c.innerHeight()) : a.css.height
                        })),
                        c.removeClass("fancybox-is-hidden")
                    }
                })) : this.afterLoad(t),
                e.attr("src", t.src),
                t.opts.smallBtn === !0 && t.$content.prepend(i.translate(t, t.opts.btnTpl.smallBtn)),
                s.one("onReset", function() {
                    try {
                        n(this).find("iframe").hide().attr("src", "//about:blank")
                    } catch (t) {}
                    n(this).empty(),
                    t.isLoaded = !1
                })
            },
            setContent: function(t, e) {
                var o = this;
                o.isClosing || (o.hideLoading(t),
                t.$slide.empty(),
                l(e) && e.parent().length ? (e.parent(".fancybox-slide--inline").trigger("onReset"),
                t.$placeholder = n("<div></div>").hide().insertAfter(e),
                e.css("display", "inline-block")) : t.hasError || ("string" === n.type(e) && (e = n("<div>").append(n.trim(e)).contents(),
                3 === e[0].nodeType && (e = n("<div>").html(e))),
                t.opts.filter && (e = n("<div>").html(e).find(t.opts.filter))),
                t.$slide.one("onReset", function() {
                    t.$placeholder && (t.$placeholder.after(e.hide()).remove(),
                    t.$placeholder = null),
                    t.$smallBtn && (t.$smallBtn.remove(),
                    t.$smallBtn = null),
                    t.hasError || (n(this).empty(),
                    t.isLoaded = !1)
                }),
                t.$content = n(e).appendTo(t.$slide),
                t.opts.smallBtn && !t.$smallBtn && (t.$smallBtn = n(o.translate(t, t.opts.btnTpl.smallBtn)).appendTo(t.$content)),
                this.afterLoad(t))
            },
            setError: function(t) {
                t.hasError = !0,
                t.$slide.removeClass("fancybox-slide--" + t.type),
                this.setContent(t, this.translate(t, t.opts.errorTpl))
            },
            showLoading: function(t) {
                var e = this;
                t = t || e.current,
                t && !t.$spinner && (t.$spinner = n(e.opts.spinnerTpl).appendTo(t.$slide))
            },
            hideLoading: function(t) {
                var e = this;
                t = t || e.current,
                t && t.$spinner && (t.$spinner.remove(),
                delete t.$spinner)
            },
            afterLoad: function(t) {
                var e = this;
                e.isClosing || (t.isLoading = !1,
                t.isLoaded = !0,
                e.trigger("afterLoad", t),
                e.hideLoading(t),
                t.opts.protect && t.$content && !t.hasError && (t.$content.on("contextmenu.fb", function(t) {
                    return 2 == t.button && t.preventDefault(),
                    !0
                }),
                "image" === t.type && n('<div class="fancybox-spaceball"></div>').appendTo(t.$content)),
                e.revealContent(t))
            },
            revealContent: function(t) {
                var e, i, a, s, r, c = this, l = t.$slide, u = !1;
                return e = t.opts[c.firstRun ? "animationEffect" : "transitionEffect"],
                a = t.opts[c.firstRun ? "animationDuration" : "transitionDuration"],
                a = parseInt(t.forcedDuration === o ? a : t.forcedDuration, 10),
                !t.isMoved && t.pos === c.currPos && a || (e = !1),
                "zoom" !== e || t.pos === c.currPos && a && "image" === t.type && !t.hasError && (u = c.getThumbPos(t)) || (e = "fade"),
                "zoom" === e ? (r = c.getFitPos(t),
                r.scaleX = Math.round(r.width / u.width * 100) / 100,
                r.scaleY = Math.round(r.height / u.height * 100) / 100,
                delete r.width,
                delete r.height,
                s = t.opts.zoomOpacity,
                "auto" == s && (s = Math.abs(t.width / t.height - u.width / u.height) > .1),
                s && (u.opacity = .1,
                r.opacity = 1),
                n.fancybox.setTranslate(t.$content.removeClass("fancybox-is-hidden"), u),
                f(t.$content),
                void n.fancybox.animate(t.$content, r, a, function() {
                    c.complete()
                })) : (c.updateSlide(t),
                e ? (n.fancybox.stop(l),
                i = "fancybox-animated fancybox-slide--" + (t.pos > c.prevPos ? "next" : "previous") + " fancybox-fx-" + e,
                l.removeAttr("style").removeClass("fancybox-slide--current fancybox-slide--next fancybox-slide--previous").addClass(i),
                t.$content.removeClass("fancybox-is-hidden"),
                f(l),
                void n.fancybox.animate(l, "fancybox-slide--current", a, function(e) {
                    l.removeClass(i).removeAttr("style"),
                    t.pos === c.currPos && c.complete()
                }, !0)) : (f(l),
                t.$content.removeClass("fancybox-is-hidden"),
                void (t.pos === c.currPos && c.complete())))
            },
            getThumbPos: function(o) {
                var i, a = this, s = !1, r = function(e) {
                    for (var o, i = e[0], a = i.getBoundingClientRect(), s = []; null !== i.parentElement; )
                        "hidden" !== n(i.parentElement).css("overflow") && "auto" !== n(i.parentElement).css("overflow") || s.push(i.parentElement.getBoundingClientRect()),
                        i = i.parentElement;
                    return o = s.every(function(t) {
                        var e = Math.min(a.right, t.right) - Math.max(a.left, t.left)
                          , n = Math.min(a.bottom, t.bottom) - Math.max(a.top, t.top);
                        return e > 0 && n > 0
                    }),
                    o && a.bottom > 0 && a.right > 0 && a.left < n(t).width() && a.top < n(t).height()
                }, c = o.opts.$thumb, l = c ? c.offset() : 0;
                return l && c[0].ownerDocument === e && r(c) && (i = a.$refs.stage.offset(),
                s = {
                    top: l.top - i.top + parseFloat(c.css("border-top-width") || 0),
                    left: l.left - i.left + parseFloat(c.css("border-left-width") || 0),
                    width: c.width(),
                    height: c.height(),
                    scaleX: 1,
                    scaleY: 1
                }),
                s
            },
            complete: function() {
                var t = this
                  , o = t.current
                  , i = {};
                o.isMoved || !o.isLoaded || o.isComplete || (o.isComplete = !0,
                o.$slide.siblings().trigger("onReset"),
                f(o.$slide),
                o.$slide.addClass("fancybox-slide--complete"),
                n.each(t.slides, function(e, o) {
                    o.pos >= t.currPos - 1 && o.pos <= t.currPos + 1 ? i[o.pos] = o : o && (n.fancybox.stop(o.$slide),
                    o.$slide.unbind().remove())
                }),
                t.slides = i,
                t.updateCursor(),
                t.trigger("afterShow"),
                (n(e.activeElement).is("[disabled]") || o.opts.autoFocus && "image" != o.type && "iframe" !== o.type) && t.focus())
            },
            preload: function() {
                var t, e, n = this;
                n.group.length < 2 || (t = n.slides[n.currPos + 1],
                e = n.slides[n.currPos - 1],
                t && "image" === t.type && n.loadSlide(t),
                e && "image" === e.type && n.loadSlide(e))
            },
            focus: function() {
                var t, e = this.current;
                this.isClosing || (t = e && e.isComplete ? e.$slide.find("button,:input,[tabindex],a").filter(":not([disabled]):visible:first") : null,
                t = t && t.length ? t : this.$refs.container,
                t.focus())
            },
            activate: function() {
                var t = this;
                n(".fancybox-container").each(function() {
                    var e = n(this).data("FancyBox");
                    e && e.uid !== t.uid && !e.isClosing && e.trigger("onDeactivate")
                }),
                t.current && (t.$refs.container.index() > 0 && t.$refs.container.prependTo(e.body),
                t.updateControls()),
                t.trigger("onActivate"),
                t.addEvents()
            },
            close: function(t, e) {
                var o, i, a, s, r, c, l = this, f = l.current, h = function() {
                    l.cleanUp(t)
                };
                return !(l.isClosing || (l.isClosing = !0,
                l.trigger("beforeClose", t) === !1 ? (l.isClosing = !1,
                u(function() {
                    l.update()
                }),
                1) : (l.removeEvents(),
                f.timouts && clearTimeout(f.timouts),
                a = f.$content,
                o = f.opts.animationEffect,
                i = n.isNumeric(e) ? e : o ? f.opts.animationDuration : 0,
                f.$slide.off(d).removeClass("fancybox-slide--complete fancybox-slide--next fancybox-slide--previous fancybox-animated"),
                f.$slide.siblings().trigger("onReset").remove(),
                i && l.$refs.container.removeClass("fancybox-is-open").addClass("fancybox-is-closing"),
                l.hideLoading(f),
                l.hideControls(),
                l.updateCursor(),
                "zoom" !== o || t !== !0 && a && i && "image" === f.type && !f.hasError && (c = l.getThumbPos(f)) || (o = "fade"),
                "zoom" === o ? (n.fancybox.stop(a),
                r = n.fancybox.getTranslate(a),
                r.width = r.width * r.scaleX,
                r.height = r.height * r.scaleY,
                s = f.opts.zoomOpacity,
                "auto" == s && (s = Math.abs(f.width / f.height - c.width / c.height) > .1),
                s && (c.opacity = 0),
                r.scaleX = r.width / c.width,
                r.scaleY = r.height / c.height,
                r.width = c.width,
                r.height = c.height,
                n.fancybox.setTranslate(f.$content, r),
                n.fancybox.animate(f.$content, c, i, h),
                0) : (o && i ? t === !0 ? setTimeout(h, i) : n.fancybox.animate(f.$slide.removeClass("fancybox-slide--current"), "fancybox-animated fancybox-slide--previous fancybox-fx-" + o, i, h) : h(),
                0))))
            },
            cleanUp: function(t) {
                var e, o = this;
                o.current.$slide.trigger("onReset"),
                o.$refs.container.empty().remove(),
                o.trigger("afterClose", t),
                o.$lastFocus && !o.current.focusBack && o.$lastFocus.focus(),
                o.current = null,
                e = n.fancybox.getInstance(),
                e ? e.activate() : (s.scrollTop(o.scrollTop).scrollLeft(o.scrollLeft),
                n("html").removeClass("fancybox-enabled"),
                n("#fancybox-style-noscroll").remove())
            },
            trigger: function(t, e) {
                var o, i = Array.prototype.slice.call(arguments, 1), a = this, s = e && e.opts ? e : a.current;
                return s ? i.unshift(s) : s = a,
                i.unshift(a),
                n.isFunction(s.opts[t]) && (o = s.opts[t].apply(s, i)),
                o === !1 ? o : void ("afterClose" === t ? r.trigger(t + ".fb", i) : a.$refs.container.trigger(t + ".fb", i))
            },
            updateControls: function(t) {
                var e = this
                  , o = e.current
                  , i = o.index
                  , a = o.opts
                  , s = a.caption
                  , r = e.$refs.caption;
                o.$slide.trigger("refresh"),
                e.$caption = s && s.length ? r.html(s) : null,
                e.isHiddenControls || e.showControls(),
                n("[data-fancybox-count]").html(e.group.length),
                n("[data-fancybox-index]").html(i + 1),
                n("[data-fancybox-prev]").prop("disabled", !a.loop && i <= 0),
                n("[data-fancybox-next]").prop("disabled", !a.loop && i >= e.group.length - 1)
            },
            hideControls: function() {
                this.isHiddenControls = !0,
                this.$refs.container.removeClass("fancybox-show-infobar fancybox-show-toolbar fancybox-show-caption fancybox-show-nav")
            },
            showControls: function() {
                var t = this
                  , e = t.current ? t.current.opts : t.opts
                  , n = t.$refs.container;
                t.isHiddenControls = !1,
                t.idleSecondsCounter = 0,
                n.toggleClass("fancybox-show-toolbar", !(!e.toolbar || !e.buttons)).toggleClass("fancybox-show-infobar", !!(e.infobar && t.group.length > 1)).toggleClass("fancybox-show-nav", !!(e.arrows && t.group.length > 1)).toggleClass("fancybox-is-modal", !!e.modal),
                t.$caption ? n.addClass("fancybox-show-caption ") : n.removeClass("fancybox-show-caption")
            },
            toggleControls: function() {
                this.isHiddenControls ? this.showControls() : this.hideControls()
            }
        }),
        n.fancybox = {
            version: "3.1.20",
            defaults: a,
            getInstance: function(t) {
                var e = n('.fancybox-container:not(".fancybox-is-closing"):first').data("FancyBox")
                  , o = Array.prototype.slice.call(arguments, 1);
                return e instanceof h && ("string" === n.type(t) ? e[t].apply(e, o) : "function" === n.type(t) && t.apply(e, o),
                e)
            },
            open: function(t, e, n) {
                return new h(t,e,n)
            },
            close: function(t) {
                var e = this.getInstance();
                e && (e.close(),
                t === !0 && this.close())
            },
            destroy: function() {
                this.close(!0),
                r.off("click.fb-start")
            },
            isMobile: e.createTouch !== o && /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent),
            use3d: function() {
                var n = e.createElement("div");
                return t.getComputedStyle && t.getComputedStyle(n).getPropertyValue("transform") && !(e.documentMode && e.documentMode < 11)
            }(),
            getTranslate: function(t) {
                var e;
                if (!t || !t.length)
                    return !1;
                if (e = t.eq(0).css("transform"),
                e && e.indexOf("matrix") !== -1 ? (e = e.split("(")[1],
                e = e.split(")")[0],
                e = e.split(",")) : e = [],
                e.length)
                    e = e.length > 10 ? [e[13], e[12], e[0], e[5]] : [e[5], e[4], e[0], e[3]],
                    e = e.map(parseFloat);
                else {
                    e = [0, 0, 1, 1];
                    var n = /\.*translate\((.*)px,(.*)px\)/i
                      , o = n.exec(t.eq(0).attr("style"));
                    o && (e[0] = parseFloat(o[2]),
                    e[1] = parseFloat(o[1]))
                }
                return {
                    top: e[0],
                    left: e[1],
                    scaleX: e[2],
                    scaleY: e[3],
                    opacity: parseFloat(t.css("opacity")),
                    width: t.width(),
                    height: t.height()
                }
            },
            setTranslate: function(t, e) {
                var n = ""
                  , i = {};
                if (t && e)
                    return e.left === o && e.top === o || (n = (e.left === o ? t.position().left : e.left) + "px, " + (e.top === o ? t.position().top : e.top) + "px",
                    n = this.use3d ? "translate3d(" + n + ", 0px)" : "translate(" + n + ")"),
                    e.scaleX !== o && e.scaleY !== o && (n = (n.length ? n + " " : "") + "scale(" + e.scaleX + ", " + e.scaleY + ")"),
                    n.length && (i.transform = n),
                    e.opacity !== o && (i.opacity = e.opacity),
                    e.width !== o && (i.width = e.width),
                    e.height !== o && (i.height = e.height),
                    t.css(i)
            },
            animate: function(t, e, i, a, s) {
                var r = d || "transitionend";
                n.isFunction(i) && (a = i,
                i = null),
                n.isPlainObject(e) || t.removeAttr("style"),
                t.on(r, function(i) {
                    (!i || !i.originalEvent || t.is(i.originalEvent.target) && "z-index" != i.originalEvent.propertyName) && (t.off(r),
                    n.isPlainObject(e) ? e.scaleX !== o && e.scaleY !== o && (t.css("transition-duration", "0ms"),
                    e.width = t.width() * e.scaleX,
                    e.height = t.height() * e.scaleY,
                    e.scaleX = 1,
                    e.scaleY = 1,
                    n.fancybox.setTranslate(t, e)) : s !== !0 && t.removeClass(e),
                    n.isFunction(a) && a(i))
                }),
                n.isNumeric(i) && t.css("transition-duration", i + "ms"),
                n.isPlainObject(e) ? n.fancybox.setTranslate(t, e) : t.addClass(e),
                t.data("timer", setTimeout(function() {
                    t.trigger("transitionend")
                }, i + 16))
            },
            stop: function(t) {
                clearTimeout(t.data("timer")),
                t.off(d)
            }
        },
        n.fn.fancybox = function(t) {
            var e;
            return t = t || {},
            e = t.selector || !1,
            e ? n("body").off("click.fb-start", e).on("click.fb-start", e, {
                items: n(e),
                options: t
            }, i) : this.off("click.fb-start").on("click.fb-start", {
                items: this,
                options: t
            }, i),
            this
        }
        ,
        r.on("click.fb-start", "[data-fancybox]", i)
    }
}(window, document, window.jQuery),
function(t) {
    "use strict";
    var e = function(e, n, o) {
        if (e)
            return o = o || "",
            "object" === t.type(o) && (o = t.param(o, !0)),
            t.each(n, function(t, n) {
                e = e.replace("$" + t, n || "")
            }),
            o.length && (e += (e.indexOf("?") > 0 ? "&" : "?") + o),
            e
    }
      , n = {
        youtube: {
            matcher: /(youtube\.com|youtu\.be|youtube\-nocookie\.com)\/(watch\?(.*&)?v=|v\/|u\/|embed\/?)?(videoseries\?list=(.*)|[\w-]{11}|\?listType=(.*)&list=(.*))(.*)/i,
            params: {
                autoplay: 1,
                autohide: 1,
                fs: 1,
                rel: 0,
                hd: 1,
                wmode: "transparent",
                enablejsapi: 1,
                html5: 1
            },
            paramPlace: 8,
            type: "iframe",
            url: "//www.youtube.com/embed/$4",
            thumb: "//img.youtube.com/vi/$4/hqdefault.jpg"
        },
        vimeo: {
            matcher: /^.+vimeo.com\/(.*\/)?([\d]+)(.*)?/,
            params: {
                autoplay: 1,
                hd: 1,
                show_title: 1,
                show_byline: 1,
                show_portrait: 0,
                fullscreen: 1,
                api: 1
            },
            paramPlace: 3,
            type: "iframe",
            url: "//player.vimeo.com/video/$2"
        },
        metacafe: {
            matcher: /metacafe.com\/watch\/(\d+)\/(.*)?/,
            type: "iframe",
            url: "//www.metacafe.com/embed/$1/?ap=1"
        },
        dailymotion: {
            matcher: /dailymotion.com\/video\/(.*)\/?(.*)/,
            params: {
                additionalInfos: 0,
                autoStart: 1
            },
            type: "iframe",
            url: "//www.dailymotion.com/embed/video/$1"
        },
        vine: {
            matcher: /vine.co\/v\/([a-zA-Z0-9\?\=\-]+)/,
            type: "iframe",
            url: "//vine.co/v/$1/embed/simple"
        },
        instagram: {
            matcher: /(instagr\.am|instagram\.com)\/p\/([a-zA-Z0-9_\-]+)\/?/i,
            type: "image",
            url: "//$1/p/$2/media/?size=l"
        },
        google_maps: {
            matcher: /(maps\.)?google\.([a-z]{2,3}(\.[a-z]{2})?)\/(((maps\/(place\/(.*)\/)?\@(.*),(\d+.?\d+?)z))|(\?ll=))(.*)?/i,
            type: "iframe",
            url: function(t) {
                return "//maps.google." + t[2] + "/?ll=" + (t[9] ? t[9] + "&z=" + Math.floor(t[10]) + (t[12] ? t[12].replace(/^\//, "&") : "") : t[12]) + "&output=" + (t[12] && t[12].indexOf("layer=c") > 0 ? "svembed" : "embed")
            }
        }
    };
    t(document).on("onInit.fb", function(o, i) {
        t.each(i.group, function(o, i) {
            var a, s, r, c, l, u, d, f = i.src || "", h = !1;
            i.type || (a = t.extend(!0, {}, n, i.opts.media),
            t.each(a, function(n, o) {
                if (r = f.match(o.matcher),
                u = {},
                d = n,
                r) {
                    if (h = o.type,
                    o.paramPlace && r[o.paramPlace]) {
                        l = r[o.paramPlace],
                        "?" == l[0] && (l = l.substring(1)),
                        l = l.split("&");
                        for (var a = 0; a < l.length; ++a) {
                            var p = l[a].split("=", 2);
                            2 == p.length && (u[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " ")))
                        }
                    }
                    return c = t.extend(!0, {}, o.params, i.opts[n], u),
                    f = "function" === t.type(o.url) ? o.url.call(this, r, c, i) : e(o.url, r, c),
                    s = "function" === t.type(o.thumb) ? o.thumb.call(this, r, c, i) : e(o.thumb, r),
                    "vimeo" === d && (f = f.replace("&%23", "#")),
                    !1
                }
            }),
            h ? (i.src = f,
            i.type = h,
            i.opts.thumb || i.opts.$thumb && i.opts.$thumb.length || (i.opts.thumb = s),
            "iframe" === h && (t.extend(!0, i.opts, {
                iframe: {
                    preload: !1,
                    attr: {
                        scrolling: "no"
                    }
                }
            }),
            i.contentProvider = d,
            i.opts.slideClass += " fancybox-slide--" + ("google_maps" == d ? "map" : "video"))) : i.type = "image")
        })
    })
}(window.jQuery),
function(t, e, n) {
    "use strict";
    var o = function() {
        return t.requestAnimationFrame || t.webkitRequestAnimationFrame || t.mozRequestAnimationFrame || t.oRequestAnimationFrame || function(e) {
            return t.setTimeout(e, 1e3 / 60)
        }
    }()
      , i = function() {
        return t.cancelAnimationFrame || t.webkitCancelAnimationFrame || t.mozCancelAnimationFrame || t.oCancelAnimationFrame || function(e) {
            t.clearTimeout(e)
        }
    }()
      , a = function(e) {
        var n = [];
        e = e.originalEvent || e || t.e,
        e = e.touches && e.touches.length ? e.touches : e.changedTouches && e.changedTouches.length ? e.changedTouches : [e];
        for (var o in e)
            e[o].pageX ? n.push({
                x: e[o].pageX,
                y: e[o].pageY
            }) : e[o].clientX && n.push({
                x: e[o].clientX,
                y: e[o].clientY
            });
        return n
    }
      , s = function(t, e, n) {
        return e && t ? "x" === n ? t.x - e.x : "y" === n ? t.y - e.y : Math.sqrt(Math.pow(t.x - e.x, 2) + Math.pow(t.y - e.y, 2)) : 0
    }
      , r = function(t) {
        if (t.is("a,button,input,select,textarea") || n.isFunction(t.get(0).onclick))
            return !0;
        for (var e = 0, o = t[0].attributes, i = o.length; e < i; e++)
            if ("data-fancybox-" === o[e].nodeName.substr(0, 14))
                return !0;
        return !1
    }
      , c = function(e) {
        var n = t.getComputedStyle(e)["overflow-y"]
          , o = t.getComputedStyle(e)["overflow-x"]
          , i = ("scroll" === n || "auto" === n) && e.scrollHeight > e.clientHeight
          , a = ("scroll" === o || "auto" === o) && e.scrollWidth > e.clientWidth;
        return i || a
    }
      , l = function(t) {
        for (var e = !1; !(e = c(t.get(0))) && (t = t.parent(),
        t.length && !t.hasClass("fancybox-stage") && !t.is("body")); )
            ;
        return e
    }
      , u = function(t) {
        var e = this;
        e.instance = t,
        e.$bg = t.$refs.bg,
        e.$stage = t.$refs.stage,
        e.$container = t.$refs.container,
        e.destroy(),
        e.$container.on("touchstart.fb.touch mousedown.fb.touch", n.proxy(e, "ontouchstart"))
    };
    u.prototype.destroy = function() {
        this.$container.off(".fb.touch")
    }
    ,
    u.prototype.ontouchstart = function(o) {
        var i = this
          , c = n(o.target)
          , u = i.instance
          , d = u.current
          , f = d.$content
          , h = "touchstart" == o.type;
        if (h && i.$container.off("mousedown.fb.touch"),
        !d || i.instance.isAnimating || i.instance.isClosing)
            return o.stopPropagation(),
            void o.preventDefault();
        if ((!o.originalEvent || 2 != o.originalEvent.button) && c.length && !r(c) && !r(c.parent()) && !(o.originalEvent.clientX > c[0].clientWidth + c.offset().left) && (i.startPoints = a(o),
        i.startPoints && !(i.startPoints.length > 1 && u.isSliding))) {
            if (i.$target = c,
            i.$content = f,
            i.canTap = !0,
            n(e).off(".fb.touch"),
            n(e).on(h ? "touchend.fb.touch touchcancel.fb.touch" : "mouseup.fb.touch mouseleave.fb.touch", n.proxy(i, "ontouchend")),
            n(e).on(h ? "touchmove.fb.touch" : "mousemove.fb.touch", n.proxy(i, "ontouchmove")),
            o.stopPropagation(),
            !u.current.opts.touch && !u.canPan() || !c.is(i.$stage) && !i.$stage.find(c).length)
                return void (c.is("img") && o.preventDefault());
            n.fancybox.isMobile && (l(i.$target) || l(i.$target.parent())) || o.preventDefault(),
            i.canvasWidth = Math.round(d.$slide[0].clientWidth),
            i.canvasHeight = Math.round(d.$slide[0].clientHeight),
            i.startTime = (new Date).getTime(),
            i.distanceX = i.distanceY = i.distance = 0,
            i.isPanning = !1,
            i.isSwiping = !1,
            i.isZooming = !1,
            i.sliderStartPos = i.sliderLastPos || {
                top: 0,
                left: 0
            },
            i.contentStartPos = n.fancybox.getTranslate(i.$content),
            i.contentLastPos = null,
            1 !== i.startPoints.length || i.isZooming || (i.canTap = !u.isSliding,
            "image" === d.type && (i.contentStartPos.width > i.canvasWidth + 1 || i.contentStartPos.height > i.canvasHeight + 1) ? (n.fancybox.stop(i.$content),
            i.$content.css("transition-duration", "0ms"),
            i.isPanning = !0) : i.isSwiping = !0,
            i.$container.addClass("fancybox-controls--isGrabbing")),
            2 !== i.startPoints.length || u.isAnimating || d.hasError || "image" !== d.type || !d.isLoaded && !d.$ghost || (i.isZooming = !0,
            i.isSwiping = !1,
            i.isPanning = !1,
            n.fancybox.stop(i.$content),
            i.$content.css("transition-duration", "0ms"),
            i.centerPointStartX = .5 * (i.startPoints[0].x + i.startPoints[1].x) - n(t).scrollLeft(),
            i.centerPointStartY = .5 * (i.startPoints[0].y + i.startPoints[1].y) - n(t).scrollTop(),
            i.percentageOfImageAtPinchPointX = (i.centerPointStartX - i.contentStartPos.left) / i.contentStartPos.width,
            i.percentageOfImageAtPinchPointY = (i.centerPointStartY - i.contentStartPos.top) / i.contentStartPos.height,
            i.startDistanceBetweenFingers = s(i.startPoints[0], i.startPoints[1]))
        }
    }
    ,
    u.prototype.ontouchmove = function(t) {
        var e = this;
        if (e.newPoints = a(t),
        n.fancybox.isMobile && (l(e.$target) || l(e.$target.parent())))
            return t.stopPropagation(),
            void (e.canTap = !1);
        if ((e.instance.current.opts.touch || e.instance.canPan()) && e.newPoints && e.newPoints.length && (e.distanceX = s(e.newPoints[0], e.startPoints[0], "x"),
        e.distanceY = s(e.newPoints[0], e.startPoints[0], "y"),
        e.distance = s(e.newPoints[0], e.startPoints[0]),
        e.distance > 0)) {
            if (!e.$target.is(e.$stage) && !e.$stage.find(e.$target).length)
                return;
            t.stopPropagation(),
            t.preventDefault(),
            e.isSwiping ? e.onSwipe() : e.isPanning ? e.onPan() : e.isZooming && e.onZoom()
        }
    }
    ,
    u.prototype.onSwipe = function() {
        var e, a = this, s = a.isSwiping, r = a.sliderStartPos.left || 0;
        s === !0 ? Math.abs(a.distance) > 10 && (a.canTap = !1,
        a.instance.group.length < 2 && a.instance.opts.touch.vertical ? a.isSwiping = "y" : a.instance.isSliding || a.instance.opts.touch.vertical === !1 || "auto" === a.instance.opts.touch.vertical && n(t).width() > 800 ? a.isSwiping = "x" : (e = Math.abs(180 * Math.atan2(a.distanceY, a.distanceX) / Math.PI),
        a.isSwiping = e > 45 && e < 135 ? "y" : "x"),
        a.instance.isSliding = a.isSwiping,
        a.startPoints = a.newPoints,
        n.each(a.instance.slides, function(t, e) {
            n.fancybox.stop(e.$slide),
            e.$slide.css("transition-duration", "0ms"),
            e.inTransition = !1,
            e.pos === a.instance.current.pos && (a.sliderStartPos.left = n.fancybox.getTranslate(e.$slide).left)
        }),
        a.instance.SlideShow && a.instance.SlideShow.isActive && a.instance.SlideShow.stop()) : ("x" == s && (a.distanceX > 0 && (a.instance.group.length < 2 || 0 === a.instance.current.index && !a.instance.current.opts.loop) ? r += Math.pow(a.distanceX, .8) : a.distanceX < 0 && (a.instance.group.length < 2 || a.instance.current.index === a.instance.group.length - 1 && !a.instance.current.opts.loop) ? r -= Math.pow(-a.distanceX, .8) : r += a.distanceX),
        a.sliderLastPos = {
            top: "x" == s ? 0 : a.sliderStartPos.top + a.distanceY,
            left: r
        },
        a.requestId && (i(a.requestId),
        a.requestId = null),
        a.requestId = o(function() {
            a.sliderLastPos && (n.each(a.instance.slides, function(t, e) {
                var o = e.pos - a.instance.currPos;
                n.fancybox.setTranslate(e.$slide, {
                    top: a.sliderLastPos.top,
                    left: a.sliderLastPos.left + o * a.canvasWidth + o * e.opts.gutter
                })
            }),
            a.$container.addClass("fancybox-is-sliding"))
        }))
    }
    ,
    u.prototype.onPan = function() {
        var t, e, a, s = this;
        s.canTap = !1,
        t = s.contentStartPos.width > s.canvasWidth ? s.contentStartPos.left + s.distanceX : s.contentStartPos.left,
        e = s.contentStartPos.top + s.distanceY,
        a = s.limitMovement(t, e, s.contentStartPos.width, s.contentStartPos.height),
        a.scaleX = s.contentStartPos.scaleX,
        a.scaleY = s.contentStartPos.scaleY,
        s.contentLastPos = a,
        s.requestId && (i(s.requestId),
        s.requestId = null),
        s.requestId = o(function() {
            n.fancybox.setTranslate(s.$content, s.contentLastPos)
        })
    }
    ,
    u.prototype.limitMovement = function(t, e, n, o) {
        var i, a, s, r, c = this, l = c.canvasWidth, u = c.canvasHeight, d = c.contentStartPos.left, f = c.contentStartPos.top, h = c.distanceX, p = c.distanceY;
        return i = Math.max(0, .5 * l - .5 * n),
        a = Math.max(0, .5 * u - .5 * o),
        s = Math.min(l - n, .5 * l - .5 * n),
        r = Math.min(u - o, .5 * u - .5 * o),
        n > l && (h > 0 && t > i && (t = i - 1 + Math.pow(-i + d + h, .8) || 0),
        h < 0 && t < s && (t = s + 1 - Math.pow(s - d - h, .8) || 0)),
        o > u && (p > 0 && e > a && (e = a - 1 + Math.pow(-a + f + p, .8) || 0),
        p < 0 && e < r && (e = r + 1 - Math.pow(r - f - p, .8) || 0)),
        {
            top: e,
            left: t
        }
    }
    ,
    u.prototype.limitPosition = function(t, e, n, o) {
        var i = this
          , a = i.canvasWidth
          , s = i.canvasHeight;
        return n > a ? (t = t > 0 ? 0 : t,
        t = t < a - n ? a - n : t) : t = Math.max(0, a / 2 - n / 2),
        o > s ? (e = e > 0 ? 0 : e,
        e = e < s - o ? s - o : e) : e = Math.max(0, s / 2 - o / 2),
        {
            top: e,
            left: t
        }
    }
    ,
    u.prototype.onZoom = function() {
        var e = this
          , a = e.contentStartPos.width
          , r = e.contentStartPos.height
          , c = e.contentStartPos.left
          , l = e.contentStartPos.top
          , u = s(e.newPoints[0], e.newPoints[1])
          , d = u / e.startDistanceBetweenFingers
          , f = Math.floor(a * d)
          , h = Math.floor(r * d)
          , p = (a - f) * e.percentageOfImageAtPinchPointX
          , g = (r - h) * e.percentageOfImageAtPinchPointY
          , b = (e.newPoints[0].x + e.newPoints[1].x) / 2 - n(t).scrollLeft()
          , m = (e.newPoints[0].y + e.newPoints[1].y) / 2 - n(t).scrollTop()
          , y = b - e.centerPointStartX
          , v = m - e.centerPointStartY
          , x = c + (p + y)
          , w = l + (g + v)
          , $ = {
            top: w,
            left: x,
            scaleX: e.contentStartPos.scaleX * d,
            scaleY: e.contentStartPos.scaleY * d
        };
        e.canTap = !1,
        e.newWidth = f,
        e.newHeight = h,
        e.contentLastPos = $,
        e.requestId && (i(e.requestId),
        e.requestId = null),
        e.requestId = o(function() {
            n.fancybox.setTranslate(e.$content, e.contentLastPos)
        })
    }
    ,
    u.prototype.ontouchend = function(t) {
        var o = this
          , s = Math.max((new Date).getTime() - o.startTime, 1)
          , r = o.isSwiping
          , c = o.isPanning
          , l = o.isZooming;
        return o.endPoints = a(t),
        o.$container.removeClass("fancybox-controls--isGrabbing"),
        n(e).off(".fb.touch"),
        o.requestId && (i(o.requestId),
        o.requestId = null),
        o.isSwiping = !1,
        o.isPanning = !1,
        o.isZooming = !1,
        o.canTap ? o.onTap(t) : (o.speed = 366,
        o.velocityX = o.distanceX / s * .5,
        o.velocityY = o.distanceY / s * .5,
        o.speedX = Math.max(.5 * o.speed, Math.min(1.5 * o.speed, 1 / Math.abs(o.velocityX) * o.speed)),
        void (c ? o.endPanning() : l ? o.endZooming() : o.endSwiping(r)))
    }
    ,
    u.prototype.endSwiping = function(t) {
        var e = this
          , o = !1;
        e.instance.isSliding = !1,
        e.sliderLastPos = null,
        "y" == t && Math.abs(e.distanceY) > 50 ? (n.fancybox.animate(e.instance.current.$slide, {
            top: e.sliderStartPos.top + e.distanceY + 150 * e.velocityY,
            opacity: 0
        }, 150),
        o = e.instance.close(!0, 300)) : "x" == t && e.distanceX > 50 && e.instance.group.length > 1 ? o = e.instance.previous(e.speedX) : "x" == t && e.distanceX < -50 && e.instance.group.length > 1 && (o = e.instance.next(e.speedX)),
        o !== !1 || "x" != t && "y" != t || e.instance.jumpTo(e.instance.current.index, 150),
        e.$container.removeClass("fancybox-is-sliding")
    }
    ,
    u.prototype.endPanning = function() {
        var t, e, o, i = this;
        i.contentLastPos && (i.instance.current.opts.touch.momentum === !1 ? (t = i.contentLastPos.left,
        e = i.contentLastPos.top) : (t = i.contentLastPos.left + i.velocityX * i.speed,
        e = i.contentLastPos.top + i.velocityY * i.speed),
        o = i.limitPosition(t, e, i.contentStartPos.width, i.contentStartPos.height),
        o.width = i.contentStartPos.width,
        o.height = i.contentStartPos.height,
        n.fancybox.animate(i.$content, o, 330))
    }
    ,
    u.prototype.endZooming = function() {
        var t, e, o, i, a = this, s = a.instance.current, r = a.newWidth, c = a.newHeight;
        a.contentLastPos && (t = a.contentLastPos.left,
        e = a.contentLastPos.top,
        i = {
            top: e,
            left: t,
            width: r,
            height: c,
            scaleX: 1,
            scaleY: 1
        },
        n.fancybox.setTranslate(a.$content, i),
        r < a.canvasWidth && c < a.canvasHeight ? a.instance.scaleToFit(150) : r > s.width || c > s.height ? a.instance.scaleToActual(a.centerPointStartX, a.centerPointStartY, 150) : (o = a.limitPosition(t, e, r, c),
        n.fancybox.setTranslate(a.content, n.fancybox.getTranslate(a.$content)),
        n.fancybox.animate(a.$content, o, 150)))
    }
    ,
    u.prototype.onTap = function(t) {
        var e, o = this, i = n(t.target), s = o.instance, r = s.current, c = t && a(t) || o.startPoints, l = c[0] ? c[0].x - o.$stage.offset().left : 0, u = c[0] ? c[0].y - o.$stage.offset().top : 0, d = function(e) {
            var i = r.opts[e];
            if (n.isFunction(i) && (i = i.apply(s, [r, t])),
            i)
                switch (i) {
                case "close":
                    s.close(o.startEvent);
                    break;
                case "toggleControls":
                    s.toggleControls(!0);
                    break;
                case "next":
                    s.next();
                    break;
                case "nextOrClose":
                    s.group.length > 1 ? s.next() : s.close(o.startEvent);
                    break;
                case "zoom":
                    "image" == r.type && (r.isLoaded || r.$ghost) && (s.canPan() ? s.scaleToFit() : s.isScaledDown() ? s.scaleToActual(l, u) : s.group.length < 2 && s.close(o.startEvent))
                }
        };
        if (!(t.originalEvent && 2 == t.originalEvent.button || s.isSliding || l > i[0].clientWidth + i.offset().left)) {
            if (i.is(".fancybox-bg,.fancybox-inner,.fancybox-outer,.fancybox-container"))
                e = "Outside";
            else if (i.is(".fancybox-slide"))
                e = "Slide";
            else {
                if (!s.current.$content || !s.current.$content.has(t.target).length)
                    return;
                e = "Content"
            }
            if (o.tapped) {
                if (clearTimeout(o.tapped),
                o.tapped = null,
                Math.abs(l - o.tapX) > 50 || Math.abs(u - o.tapY) > 50 || s.isSliding)
                    return this;
                d("dblclick" + e)
            } else
                o.tapX = l,
                o.tapY = u,
                r.opts["dblclick" + e] && r.opts["dblclick" + e] !== r.opts["click" + e] ? o.tapped = setTimeout(function() {
                    o.tapped = null,
                    d("click" + e)
                }, 300) : d("click" + e);
            return this
        }
    }
    ,
    n(e).on("onActivate.fb", function(t, e) {
        e && !e.Guestures && (e.Guestures = new u(e))
    }),
    n(e).on("beforeClose.fb", function(t, e) {
        e && e.Guestures && e.Guestures.destroy()
    })
}(window, document, window.jQuery),
function(t, e) {
    "use strict";
    var n = function(t) {
        this.instance = t,
        this.init()
    };
    e.extend(n.prototype, {
        timer: null,
        isActive: !1,
        $button: null,
        speed: 3e3,
        init: function() {
            var t = this;
            t.$button = t.instance.$refs.toolbar.find("[data-fancybox-play]").on("click", function() {
                t.toggle()
            }),
            (t.instance.group.length < 2 || !t.instance.group[t.instance.currIndex].opts.slideShow) && t.$button.hide()
        },
        set: function() {
            var t = this;
            t.instance && t.instance.current && (t.instance.current.opts.loop || t.instance.currIndex < t.instance.group.length - 1) ? t.timer = setTimeout(function() {
                t.instance.next()
            }, t.instance.current.opts.slideShow.speed || t.speed) : (t.stop(),
            t.instance.idleSecondsCounter = 0,
            t.instance.showControls())
        },
        clear: function() {
            var t = this;
            clearTimeout(t.timer),
            t.timer = null
        },
        start: function() {
            var t = this
              , e = t.instance.current;
            t.instance && e && (e.opts.loop || e.index < t.instance.group.length - 1) && (t.isActive = !0,
            t.$button.attr("title", e.opts.i18n[e.opts.lang].PLAY_STOP).addClass("fancybox-button--pause"),
            e.isComplete && t.set())
        },
        stop: function() {
            var t = this
              , e = t.instance.current;
            t.clear(),
            t.$button.attr("title", e.opts.i18n[e.opts.lang].PLAY_START).removeClass("fancybox-button--pause"),
            t.isActive = !1
        },
        toggle: function() {
            var t = this;
            t.isActive ? t.stop() : t.start()
        }
    }),
    e(t).on({
        "onInit.fb": function(t, e) {
            e && !e.SlideShow && (e.SlideShow = new n(e))
        },
        "beforeShow.fb": function(t, e, n, o) {
            var i = e && e.SlideShow;
            o ? i && n.opts.slideShow.autoStart && i.start() : i && i.isActive && i.clear()
        },
        "afterShow.fb": function(t, e, n) {
            var o = e && e.SlideShow;
            o && o.isActive && o.set()
        },
        "afterKeydown.fb": function(n, o, i, a, s) {
            var r = o && o.SlideShow;
            !r || !i.opts.slideShow || 80 !== s && 32 !== s || e(t.activeElement).is("button,a,input") || (a.preventDefault(),
            r.toggle())
        },
        "beforeClose.fb onDeactivate.fb": function(t, e) {
            var n = e && e.SlideShow;
            n && n.stop()
        }
    }),
    e(t).on("visibilitychange", function() {
        var n = e.fancybox.getInstance()
          , o = n && n.SlideShow;
        o && o.isActive && (t.hidden ? o.clear() : o.set())
    })
}(document, window.jQuery),
function(t, e) {
    "use strict";
    var n = function() {
        var e, n, o, i = [["requestFullscreen", "exitFullscreen", "fullscreenElement", "fullscreenEnabled", "fullscreenchange", "fullscreenerror"], ["webkitRequestFullscreen", "webkitExitFullscreen", "webkitFullscreenElement", "webkitFullscreenEnabled", "webkitfullscreenchange", "webkitfullscreenerror"], ["webkitRequestFullScreen", "webkitCancelFullScreen", "webkitCurrentFullScreenElement", "webkitCancelFullScreen", "webkitfullscreenchange", "webkitfullscreenerror"], ["mozRequestFullScreen", "mozCancelFullScreen", "mozFullScreenElement", "mozFullScreenEnabled", "mozfullscreenchange", "mozfullscreenerror"], ["msRequestFullscreen", "msExitFullscreen", "msFullscreenElement", "msFullscreenEnabled", "MSFullscreenChange", "MSFullscreenError"]], a = {};
        for (n = 0; n < i.length; n++)
            if (e = i[n],
            e && e[1]in t) {
                for (o = 0; o < e.length; o++)
                    a[i[0][o]] = e[o];
                return a
            }
        return !1
    }();
    if (!n)
        return void (e.fancybox.defaults.btnTpl.fullScreen = !1);
    var o = {
        request: function(e) {
            e = e || t.documentElement,
            e[n.requestFullscreen](e.ALLOW_KEYBOARD_INPUT)
        },
        exit: function() {
            t[n.exitFullscreen]()
        },
        toggle: function(e) {
            e = e || t.documentElement,
            this.isFullscreen() ? this.exit() : this.request(e)
        },
        isFullscreen: function() {
            return Boolean(t[n.fullscreenElement])
        },
        enabled: function() {
            return Boolean(t[n.fullscreenEnabled])
        }
    };
    e(t).on({
        "onInit.fb": function(t, e) {
            var n, i = e.$refs.toolbar.find("[data-fancybox-fullscreen]");
            e && !e.FullScreen && e.group[e.currIndex].opts.fullScreen ? (n = e.$refs.container,
            n.on("click.fb-fullscreen", "[data-fancybox-fullscreen]", function(t) {
                t.stopPropagation(),
                t.preventDefault(),
                o.toggle(n[0])
            }),
            e.opts.fullScreen && e.opts.fullScreen.autoStart === !0 && o.request(n[0]),
            e.FullScreen = o) : i.hide()
        },
        "afterKeydown.fb": function(t, e, n, o, i) {
            e && e.FullScreen && 70 === i && (o.preventDefault(),
            e.FullScreen.toggle(e.$refs.container[0]))
        },
        "beforeClose.fb": function(t) {
            t && t.FullScreen && o.exit()
        }
    }),
    e(t).on(n.fullscreenchange, function() {
        var t = e.fancybox.getInstance();
        t.current && "image" === t.current.type && t.isAnimating && (t.current.$content.css("transition", "none"),
        t.isAnimating = !1,
        t.update(!0, !0, 0))
    })
}(document, window.jQuery),
function(t, e) {
    "use strict";
    var n = function(t) {
        this.instance = t,
        this.init()
    };
    e.extend(n.prototype, {
        $button: null,
        $grid: null,
        $list: null,
        isVisible: !1,
        init: function() {
            var t = this
              , e = t.instance.group[0]
              , n = t.instance.group[1];
            t.$button = t.instance.$refs.toolbar.find("[data-fancybox-thumbs]"),
            t.instance.group.length > 1 && t.instance.group[t.instance.currIndex].opts.thumbs && ("image" == e.type || e.opts.thumb || e.opts.$thumb) && ("image" == n.type || n.opts.thumb || n.opts.$thumb) ? (t.$button.on("click", function() {
                t.toggle()
            }),
            t.isActive = !0) : (t.$button.hide(),
            t.isActive = !1)
        },
        create: function() {
            var t, n, o = this.instance;
            this.$grid = e('<div class="fancybox-thumbs"></div>').appendTo(o.$refs.container),
            t = "<ul>",
            e.each(o.group, function(e, o) {
                n = o.opts.thumb || (o.opts.$thumb ? o.opts.$thumb.attr("src") : null),
                n || "image" !== o.type || (n = o.src),
                n && n.length && (t += '<li data-index="' + e + '"  tabindex="0" class="fancybox-thumbs-loading"><img data-src="' + n + '" /></li>')
            }),
            t += "</ul>",
            this.$list = e(t).appendTo(this.$grid).on("click", "li", function() {
                o.jumpTo(e(this).data("index"))
            }),
            this.$list.find("img").hide().one("load", function() {
                var t, n, o, i, a = e(this).parent().removeClass("fancybox-thumbs-loading"), s = a.outerWidth(), r = a.outerHeight();
                t = this.naturalWidth || this.width,
                n = this.naturalHeight || this.height,
                o = t / s,
                i = n / r,
                o >= 1 && i >= 1 && (o > i ? (t /= i,
                n = r) : (t = s,
                n /= o)),
                e(this).css({
                    width: Math.floor(t),
                    height: Math.floor(n),
                    "margin-top": Math.min(0, Math.floor(.3 * r - .3 * n)),
                    "margin-left": Math.min(0, Math.floor(.5 * s - .5 * t))
                }).show()
            }).each(function() {
                this.src = e(this).data("src")
            })
        },
        focus: function() {
            this.instance.current && this.$list.children().removeClass("fancybox-thumbs-active").filter('[data-index="' + this.instance.current.index + '"]').addClass("fancybox-thumbs-active").focus()
        },
        close: function() {
            this.$grid.hide()
        },
        update: function() {
            this.instance.$refs.container.toggleClass("fancybox-show-thumbs", this.isVisible),
            this.isVisible ? (this.$grid || this.create(),
            this.instance.trigger("onThumbsShow"),
            this.focus()) : this.$grid && this.instance.trigger("onThumbsHide"),
            this.instance.update()
        },
        hide: function() {
            this.isVisible = !1,
            this.update()
        },
        show: function() {
            this.isVisible = !0,
            this.update()
        },
        toggle: function() {
            this.isVisible = !this.isVisible,
            this.update()
        }
    }),
    e(t).on({
        "onInit.fb": function(t, e) {
            e && !e.Thumbs && (e.Thumbs = new n(e))
        },
        "beforeShow.fb": function(t, e, n, o) {
            var i = e && e.Thumbs;
            if (i && i.isActive) {
                if (n.modal)
                    return i.$button.hide(),
                    void i.hide();
                o && e.opts.thumbs.autoStart === !0 && i.show(),
                i.isVisible && i.focus()
            }
        },
        "afterKeydown.fb": function(t, e, n, o, i) {
            var a = e && e.Thumbs;
            a && a.isActive && 71 === i && (o.preventDefault(),
            a.toggle())
        },
        "beforeClose.fb": function(t, e) {
            var n = e && e.Thumbs;
            n && n.isVisible && e.opts.thumbs.hideOnClose !== !1 && n.close()
        }
    })
}(document, window.jQuery),
function(t, e, n) {
    "use strict";
    function o() {
        var t = e.location.hash.substr(1)
          , n = t.split("-")
          , o = n.length > 1 && /^\+?\d+$/.test(n[n.length - 1]) ? parseInt(n.pop(-1), 10) || 1 : 1
          , i = n.join("-");
        return o < 1 && (o = 1),
        {
            hash: t,
            index: o,
            gallery: i
        }
    }
    function i(t) {
        var e;
        "" !== t.gallery && (e = n("[data-fancybox='" + n.escapeSelector(t.gallery) + "']").eq(t.index - 1),
        e.length ? e.trigger("click") : n("#" + n.escapeSelector(t.gallery)).trigger("click"))
    }
    function a(t) {
        var e;
        return !!t && (e = t.current ? t.current.opts : t.opts,
        e.$orig ? e.$orig.data("fancybox") : e.hash || "")
    }
    n.escapeSelector || (n.escapeSelector = function(t) {
        var e = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\x80-\uFFFF\w-]/g
          , n = function(t, e) {
            return e ? "\0" === t ? "�" : t.slice(0, -1) + "\\" + t.charCodeAt(t.length - 1).toString(16) + " " : "\\" + t
        };
        return (t + "").replace(e, n)
    }
    );
    var s = null
      , r = null;
    n(function() {
        setTimeout(function() {
            n.fancybox.defaults.hash !== !1 && (n(t).on({
                "onInit.fb": function(t, e) {
                    var n, i;
                    e.group[e.currIndex].opts.hash !== !1 && (n = o(),
                    i = a(e),
                    i && n.gallery && i == n.gallery && (e.currIndex = n.index - 1))
                },
                "beforeShow.fb": function(n, o, i, c) {
                    var l;
                    i.opts.hash !== !1 && (l = a(o),
                    l && "" !== l && (e.location.hash.indexOf(l) < 0 && (o.opts.origHash = e.location.hash),
                    s = l + (o.group.length > 1 ? "-" + (i.index + 1) : ""),
                    "replaceState"in e.history ? (r && clearTimeout(r),
                    r = setTimeout(function() {
                        e.history[c ? "pushState" : "replaceState"]({}, t.title, e.location.pathname + e.location.search + "#" + s),
                        r = null
                    }, 300)) : e.location.hash = s))
                },
                "beforeClose.fb": function(o, i, c) {
                    var l, u;
                    r && clearTimeout(r),
                    c.opts.hash !== !1 && (l = a(i),
                    u = i && i.opts.origHash ? i.opts.origHash : "",
                    l && "" !== l && ("replaceState"in history ? e.history.replaceState({}, t.title, e.location.pathname + e.location.search + u) : (e.location.hash = u,
                    n(e).scrollTop(i.scrollTop).scrollLeft(i.scrollLeft))),
                    s = null)
                }
            }),
            n(e).on("hashchange.fb", function() {
                var t = o();
                n.fancybox.getInstance() ? !s || s === t.gallery + "-" + t.index || 1 === t.index && s == t.gallery || (s = null,
                n.fancybox.close()) : "" !== t.gallery && i(t)
            }),
            n(e).one("unload.fb popstate.fb", function() {
                n.fancybox.getInstance("close", !0, 0)
            }),
            i(o()))
        }, 50)
    })
}(document, window, window.jQuery);
/**
 * jQuery CSS Customizable Scrollbar
 *
 * Copyright 2015, Yuriy Khabarov
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * If you found bug, please contact me via email <13real008@gmail.com>
 *
 * @author Yuriy Khabarov aka Gromo
 * @version 0.2.10
 * @url https://github.com/gromo/jquery.scrollbar/
 *
 */
!function(l, e) {
    "function" == typeof define && define.amd ? define(["jquery"], e) : e(l.jQuery)
}(this, function(l) {
    "use strict";
    function e(e) {
        if (t.webkit && !e)
            return {
                height: 0,
                width: 0
            };
        if (!t.data.outer) {
            var o = {
                border: "none",
                "box-sizing": "content-box",
                height: "200px",
                margin: "0",
                padding: "0",
                width: "200px"
            };
            t.data.inner = l("<div>").css(l.extend({}, o)),
            t.data.outer = l("<div>").css(l.extend({
                left: "-1000px",
                overflow: "scroll",
                position: "absolute",
                top: "-1000px"
            }, o)).append(t.data.inner).appendTo("body")
        }
        return t.data.outer.scrollLeft(1e3).scrollTop(1e3),
        {
            height: Math.ceil(t.data.outer.offset().top - t.data.inner.offset().top || 0),
            width: Math.ceil(t.data.outer.offset().left - t.data.inner.offset().left || 0)
        }
    }
    function o() {
        var l = e(!0);
        return !(l.height || l.width)
    }
    function s(l) {
        var e = l.originalEvent;
        return (!e.axis || e.axis !== e.HORIZONTAL_AXIS) && !e.wheelDeltaX
    }
    var r = !1
      , t = {
        data: {
            index: 0,
            name: "scrollbar"
        },
        macosx: /mac/i.test(navigator.platform),
        mobile: /android|webos|iphone|ipad|ipod|blackberry/i.test(navigator.userAgent),
        overlay: null,
        scroll: null,
        scrolls: [],
        webkit: /webkit/i.test(navigator.userAgent) && !/edge\/\d+/i.test(navigator.userAgent)
    };
    t.scrolls.add = function(l) {
        this.remove(l).push(l)
    }
    ,
    t.scrolls.remove = function(e) {
        for (; l.inArray(e, this) >= 0; )
            this.splice(l.inArray(e, this), 1);
        return this
    }
    ;
    var i = {
        autoScrollSize: !0,
        autoUpdate: !0,
        debug: !1,
        disableBodyScroll: !1,
        duration: 200,
        ignoreMobile: !1,
        ignoreOverlay: !1,
        scrollStep: 30,
        showArrows: !1,
        stepScrolling: !0,
        scrollx: null,
        scrolly: null,
        onDestroy: null,
        onInit: null,
        onScroll: null,
        onUpdate: null
    }
      , n = function(s) {
        t.scroll || (t.overlay = o(),
        t.scroll = e(),
        a(),
        l(window).resize(function() {
            var l = !1;
            if (t.scroll && (t.scroll.height || t.scroll.width)) {
                var o = e();
                o.height === t.scroll.height && o.width === t.scroll.width || (t.scroll = o,
                l = !0)
            }
            a(l)
        })),
        this.container = s,
        this.namespace = ".scrollbar_" + t.data.index++,
        this.options = l.extend({}, i, window.jQueryScrollbarOptions || {}),
        this.scrollTo = null,
        this.scrollx = {},
        this.scrolly = {},
        s.data(t.data.name, this),
        t.scrolls.add(this)
    };
    n.prototype = {
        destroy: function() {
            if (this.wrapper) {
                this.container.removeData(t.data.name),
                t.scrolls.remove(this);
                var e = this.container.scrollLeft()
                  , o = this.container.scrollTop();
                this.container.insertBefore(this.wrapper).css({
                    height: "",
                    margin: "",
                    "max-height": ""
                }).removeClass("scroll-content scroll-scrollx_visible scroll-scrolly_visible").off(this.namespace).scrollLeft(e).scrollTop(o),
                this.scrollx.scroll.removeClass("scroll-scrollx_visible").find("div").andSelf().off(this.namespace),
                this.scrolly.scroll.removeClass("scroll-scrolly_visible").find("div").andSelf().off(this.namespace),
                this.wrapper.remove(),
                l(document).add("body").off(this.namespace),
                l.isFunction(this.options.onDestroy) && this.options.onDestroy.apply(this, [this.container])
            }
        },
        init: function(e) {
            var o = this
              , r = this.container
              , i = this.containerWrapper || r
              , n = this.namespace
              , c = l.extend(this.options, e || {})
              , a = {
                x: this.scrollx,
                y: this.scrolly
            }
              , d = this.wrapper
              , h = {
                scrollLeft: r.scrollLeft(),
                scrollTop: r.scrollTop()
            };
            if (t.mobile && c.ignoreMobile || t.overlay && c.ignoreOverlay || t.macosx && !t.webkit)
                return !1;
            if (d)
                i.css({
                    height: "auto",
                    "margin-bottom": t.scroll.height * -1 + "px",
                    "margin-right": t.scroll.width * -1 + "px",
                    "max-height": ""
                });
            else {
                if (this.wrapper = d = l("<div>").addClass("scroll-wrapper").addClass(r.attr("class")).css("position", "absolute" == r.css("position") ? "absolute" : "relative").insertBefore(r).append(r),
                r.is("textarea") && (this.containerWrapper = i = l("<div>").insertBefore(r).append(r),
                d.addClass("scroll-textarea")),
                i.addClass("scroll-content").css({
                    height: "auto",
                    "margin-bottom": t.scroll.height * -1 + "px",
                    "margin-right": t.scroll.width * -1 + "px",
                    "max-height": ""
                }),
                r.on("scroll" + n, function(e) {
                    l.isFunction(c.onScroll) && c.onScroll.call(o, {
                        maxScroll: a.y.maxScrollOffset,
                        scroll: r.scrollTop(),
                        size: a.y.size,
                        visible: a.y.visible
                    }, {
                        maxScroll: a.x.maxScrollOffset,
                        scroll: r.scrollLeft(),
                        size: a.x.size,
                        visible: a.x.visible
                    }),
                    a.x.isVisible && a.x.scroll.bar.css("left", r.scrollLeft() * a.x.kx + "px"),
                    a.y.isVisible && a.y.scroll.bar.css("top", r.scrollTop() * a.y.kx + "px")
                }),
                d.on("scroll" + n, function() {
                    d.scrollTop(0).scrollLeft(0)
                }),
                c.disableBodyScroll) {
                    var p = function(l) {
                        s(l) ? a.y.isVisible && a.y.mousewheel(l) : a.x.isVisible && a.x.mousewheel(l)
                    };
                    d.on("MozMousePixelScroll" + n, p),
                    d.on("mousewheel" + n, p),
                    t.mobile && d.on("touchstart" + n, function(e) {
                        var o = e.originalEvent.touches && e.originalEvent.touches[0] || e
                          , s = {
                            pageX: o.pageX,
                            pageY: o.pageY
                        }
                          , t = {
                            left: r.scrollLeft(),
                            top: r.scrollTop()
                        };
                        l(document).on("touchmove" + n, function(l) {
                            var e = l.originalEvent.targetTouches && l.originalEvent.targetTouches[0] || l;
                            r.scrollLeft(t.left + s.pageX - e.pageX),
                            r.scrollTop(t.top + s.pageY - e.pageY),
                            l.preventDefault()
                        }),
                        l(document).on("touchend" + n, function() {
                            l(document).off(n)
                        })
                    })
                }
                l.isFunction(c.onInit) && c.onInit.apply(this, [r])
            }
            l.each(a, function(e, t) {
                var i = null
                  , d = 1
                  , h = "x" === e ? "scrollLeft" : "scrollTop"
                  , p = c.scrollStep
                  , u = function() {
                    var l = r[h]();
                    r[h](l + p),
                    1 == d && l + p >= f && (l = r[h]()),
                    d == -1 && l + p <= f && (l = r[h]()),
                    r[h]() == l && i && i()
                }
                  , f = 0;
                t.scroll || (t.scroll = o._getScroll(c["scroll" + e]).addClass("scroll-" + e),
                c.showArrows && t.scroll.addClass("scroll-element_arrows_visible"),
                t.mousewheel = function(l) {
                    if (!t.isVisible || "x" === e && s(l))
                        return !0;
                    if ("y" === e && !s(l))
                        return a.x.mousewheel(l),
                        !0;
                    var i = l.originalEvent.wheelDelta * -1 || l.originalEvent.detail
                      , n = t.size - t.visible - t.offset;
                    return (i > 0 && f < n || i < 0 && f > 0) && (f += i,
                    f < 0 && (f = 0),
                    f > n && (f = n),
                    o.scrollTo = o.scrollTo || {},
                    o.scrollTo[h] = f,
                    setTimeout(function() {
                        o.scrollTo && (r.stop().animate(o.scrollTo, 240, "linear", function() {
                            f = r[h]()
                        }),
                        o.scrollTo = null)
                    }, 1)),
                    l.preventDefault(),
                    !1
                }
                ,
                t.scroll.on("MozMousePixelScroll" + n, t.mousewheel).on("mousewheel" + n, t.mousewheel).on("mouseenter" + n, function() {
                    f = r[h]()
                }),
                t.scroll.find(".scroll-arrow, .scroll-element_track").on("mousedown" + n, function(s) {
                    if (1 != s.which)
                        return !0;
                    d = 1;
                    var n = {
                        eventOffset: s["x" === e ? "pageX" : "pageY"],
                        maxScrollValue: t.size - t.visible - t.offset,
                        scrollbarOffset: t.scroll.bar.offset()["x" === e ? "left" : "top"],
                        scrollbarSize: t.scroll.bar["x" === e ? "outerWidth" : "outerHeight"]()
                    }
                      , a = 0
                      , v = 0;
                    return l(this).hasClass("scroll-arrow") ? (d = l(this).hasClass("scroll-arrow_more") ? 1 : -1,
                    p = c.scrollStep * d,
                    f = d > 0 ? n.maxScrollValue : 0) : (d = n.eventOffset > n.scrollbarOffset + n.scrollbarSize ? 1 : n.eventOffset < n.scrollbarOffset ? -1 : 0,
                    p = Math.round(.75 * t.visible) * d,
                    f = n.eventOffset - n.scrollbarOffset - (c.stepScrolling ? 1 == d ? n.scrollbarSize : 0 : Math.round(n.scrollbarSize / 2)),
                    f = r[h]() + f / t.kx),
                    o.scrollTo = o.scrollTo || {},
                    o.scrollTo[h] = c.stepScrolling ? r[h]() + p : f,
                    c.stepScrolling && (i = function() {
                        f = r[h](),
                        clearInterval(v),
                        clearTimeout(a),
                        a = 0,
                        v = 0
                    }
                    ,
                    a = setTimeout(function() {
                        v = setInterval(u, 40)
                    }, c.duration + 100)),
                    setTimeout(function() {
                        o.scrollTo && (r.animate(o.scrollTo, c.duration),
                        o.scrollTo = null)
                    }, 1),
                    o._handleMouseDown(i, s)
                }),
                t.scroll.bar.on("mousedown" + n, function(s) {
                    if (1 != s.which)
                        return !0;
                    var i = s["x" === e ? "pageX" : "pageY"]
                      , c = r[h]();
                    return t.scroll.addClass("scroll-draggable"),
                    l(document).on("mousemove" + n, function(l) {
                        var o = parseInt((l["x" === e ? "pageX" : "pageY"] - i) / t.kx, 10);
                        r[h](c + o)
                    }),
                    o._handleMouseDown(function() {
                        t.scroll.removeClass("scroll-draggable"),
                        f = r[h]()
                    }, s)
                }))
            }),
            l.each(a, function(l, e) {
                var o = "scroll-scroll" + l + "_visible"
                  , s = "x" == l ? a.y : a.x;
                e.scroll.removeClass(o),
                s.scroll.removeClass(o),
                i.removeClass(o)
            }),
            l.each(a, function(e, o) {
                l.extend(o, "x" == e ? {
                    offset: parseInt(r.css("left"), 10) || 0,
                    size: r.prop("scrollWidth"),
                    visible: d.width()
                } : {
                    offset: parseInt(r.css("top"), 10) || 0,
                    size: r.prop("scrollHeight"),
                    visible: d.height()
                })
            }),
            this._updateScroll("x", this.scrollx),
            this._updateScroll("y", this.scrolly),
            l.isFunction(c.onUpdate) && c.onUpdate.apply(this, [r]),
            l.each(a, function(l, e) {
                var o = "x" === l ? "left" : "top"
                  , s = "x" === l ? "outerWidth" : "outerHeight"
                  , t = "x" === l ? "width" : "height"
                  , i = parseInt(r.css(o), 10) || 0
                  , n = e.size
                  , a = e.visible + i
                  , d = e.scroll.size[s]() + (parseInt(e.scroll.size.css(o), 10) || 0);
                c.autoScrollSize && (e.scrollbarSize = parseInt(d * a / n, 10),
                e.scroll.bar.css(t, e.scrollbarSize + "px")),
                e.scrollbarSize = e.scroll.bar[s](),
                e.kx = (d - e.scrollbarSize) / (n - a) || 1,
                e.maxScrollOffset = n - a
            }),
            r.scrollLeft(h.scrollLeft).scrollTop(h.scrollTop).trigger("scroll")
        },
        _getScroll: function(e) {
            var o = {
                advanced: ['<div class="scroll-element">', '<div class="scroll-element_corner"></div>', '<div class="scroll-arrow scroll-arrow_less"></div>', '<div class="scroll-arrow scroll-arrow_more"></div>', '<div class="scroll-element_outer">', '<div class="scroll-element_size"></div>', '<div class="scroll-element_inner-wrapper">', '<div class="scroll-element_inner scroll-element_track">', '<div class="scroll-element_inner-bottom"></div>', "</div>", "</div>", '<div class="scroll-bar">', '<div class="scroll-bar_body">', '<div class="scroll-bar_body-inner"></div>', "</div>", '<div class="scroll-bar_bottom"></div>', '<div class="scroll-bar_center"></div>', "</div>", "</div>", "</div>"].join(""),
                simple: ['<div class="scroll-element">', '<div class="scroll-element_outer">', '<div class="scroll-element_size"></div>', '<div class="scroll-element_track"></div>', '<div class="scroll-bar"></div>', "</div>", "</div>"].join("")
            };
            return o[e] && (e = o[e]),
            e || (e = o.simple),
            e = "string" == typeof e ? l(e).appendTo(this.wrapper) : l(e),
            l.extend(e, {
                bar: e.find(".scroll-bar"),
                size: e.find(".scroll-element_size"),
                track: e.find(".scroll-element_track")
            }),
            e
        },
        _handleMouseDown: function(e, o) {
            var s = this.namespace;
            return l(document).on("blur" + s, function() {
                l(document).add("body").off(s),
                e && e()
            }),
            l(document).on("dragstart" + s, function(l) {
                return l.preventDefault(),
                !1
            }),
            l(document).on("mouseup" + s, function() {
                l(document).add("body").off(s),
                e && e()
            }),
            l("body").on("selectstart" + s, function(l) {
                return l.preventDefault(),
                !1
            }),
            o && o.preventDefault(),
            !1
        },
        _updateScroll: function(e, o) {
            var s = this.container
              , r = this.containerWrapper || s
              , i = "scroll-scroll" + e + "_visible"
              , n = "x" === e ? this.scrolly : this.scrollx
              , c = parseInt(this.container.css("x" === e ? "left" : "top"), 10) || 0
              , a = this.wrapper
              , d = o.size
              , h = o.visible + c;
            o.isVisible = d - h > 1,
            o.isVisible ? (o.scroll.addClass(i),
            n.scroll.addClass(i),
            r.addClass(i)) : (o.scroll.removeClass(i),
            n.scroll.removeClass(i),
            r.removeClass(i)),
            "y" === e && (s.is("textarea") || d < h ? r.css({
                height: h + t.scroll.height + "px",
                "max-height": "none"
            }) : r.css({
                "max-height": h + t.scroll.height + "px"
            })),
            o.size == s.prop("scrollWidth") && n.size == s.prop("scrollHeight") && o.visible == a.width() && n.visible == a.height() && o.offset == (parseInt(s.css("left"), 10) || 0) && n.offset == (parseInt(s.css("top"), 10) || 0) || (l.extend(this.scrollx, {
                offset: parseInt(s.css("left"), 10) || 0,
                size: s.prop("scrollWidth"),
                visible: a.width()
            }),
            l.extend(this.scrolly, {
                offset: parseInt(s.css("top"), 10) || 0,
                size: this.container.prop("scrollHeight"),
                visible: a.height()
            }),
            this._updateScroll("x" === e ? "y" : "x", n))
        }
    };
    var c = n;
    l.fn.scrollbar = function(e, o) {
        return "string" != typeof e && (o = e,
        e = "init"),
        "undefined" == typeof o && (o = []),
        l.isArray(o) || (o = [o]),
        this.not("body, .scroll-wrapper").each(function() {
            var s = l(this)
              , r = s.data(t.data.name);
            (r || "init" === e) && (r || (r = new c(s)),
            r[e] && r[e].apply(r, o))
        }),
        this
    }
    ,
    l.fn.scrollbar.options = i;
    var a = function() {
        var l = 0
          , e = 0;
        return function(o) {
            var s, i, n, c, d, h, p;
            for (s = 0; s < t.scrolls.length; s++)
                c = t.scrolls[s],
                i = c.container,
                n = c.options,
                d = c.wrapper,
                h = c.scrollx,
                p = c.scrolly,
                (o || n.autoUpdate && d && d.is(":visible") && (i.prop("scrollWidth") != h.size || i.prop("scrollHeight") != p.size || d.width() != h.visible || d.height() != p.visible)) && (c.init(),
                n.debug && (window.console && console.log({
                    scrollHeight: i.prop("scrollHeight") + ":" + c.scrolly.size,
                    scrollWidth: i.prop("scrollWidth") + ":" + c.scrollx.size,
                    visibleHeight: d.height() + ":" + c.scrolly.visible,
                    visibleWidth: d.width() + ":" + c.scrollx.visible
                }, !0),
                e++));
            r && e > 10 ? (window.console && console.log("Scroll updates exceed 10"),
            a = function() {}
            ) : (clearTimeout(l),
            l = setTimeout(a, 300))
        }
    }();
    window.angular && !function(l) {
        l.module("jQueryScrollbar", []).provider("jQueryScrollbar", function() {
            var e = i;
            return {
                setOptions: function(o) {
                    l.extend(e, o)
                },
                $get: function() {
                    return {
                        options: l.copy(e)
                    }
                }
            }
        }).directive("jqueryScrollbar", ["jQueryScrollbar", "$parse", function(l, e) {
            return {
                restrict: "AC",
                link: function(o, s, r) {
                    var t = e(r.jqueryScrollbar)
                      , i = t(o);
                    s.scrollbar(i || l.options).on("$destroy", function() {
                        s.scrollbar("destroy")
                    })
                }
            }
        }
        ])
    }(window.angular)
});
/*
     _ _      _       _
 ___| (_) ___| | __  (_)___
/ __| | |/ __| |/ /  | / __|
\__ \ | | (__|   < _ | \__ \
|___/_|_|\___|_|\_(_)/ |___/
                   |__/

 Version: 1.6.0
  Author: Ken Wheeler
 Website: http://kenwheeler.github.io
    Docs: http://kenwheeler.github.io/slick
    Repo: http://github.com/kenwheeler/slick
  Issues: http://github.com/kenwheeler/slick/issues

 */
!function(i) {
    "use strict";
    "function" == typeof define && define.amd ? define(["jquery"], i) : "undefined" != typeof exports ? module.exports = i(require("jquery")) : i(jQuery)
}(function(i) {
    "use strict";
    var e = window.Slick || {};
    e = function() {
        function e(e, o) {
            var s, n = this;
            n.defaults = {
                accessibility: !0,
                adaptiveHeight: !1,
                appendArrows: i(e),
                appendDots: i(e),
                arrows: !0,
                asNavFor: null,
                prevArrow: '<button type="button" data-role="none" class="slick-prev" aria-label="Previous" tabindex="0" role="button">Previous</button>',
                nextArrow: '<button type="button" data-role="none" class="slick-next" aria-label="Next" tabindex="0" role="button">Next</button>',
                autoplay: !1,
                autoplaySpeed: 3e3,
                centerMode: !1,
                centerPadding: "50px",
                cssEase: "ease",
                customPaging: function(e, t) {
                    return i('<button type="button" data-role="none" role="button" tabindex="0" />').text(t + 1)
                },
                dots: !1,
                dotsClass: "slick-dots",
                draggable: !0,
                easing: "linear",
                edgeFriction: .35,
                fade: !1,
                focusOnSelect: !1,
                infinite: !0,
                initialSlide: 0,
                lazyLoad: "ondemand",
                mobileFirst: !1,
                pauseOnHover: !0,
                pauseOnFocus: !0,
                pauseOnDotsHover: !1,
                respondTo: "window",
                responsive: null,
                rows: 1,
                rtl: !1,
                slide: "",
                slidesPerRow: 1,
                slidesToShow: 1,
                slidesToScroll: 1,
                speed: 500,
                swipe: !0,
                swipeToSlide: !1,
                touchMove: !0,
                touchThreshold: 5,
                useCSS: !0,
                useTransform: !0,
                variableWidth: !1,
                vertical: !1,
                verticalSwiping: !1,
                waitForAnimate: !0,
                zIndex: 1e3
            },
            n.initials = {
                animating: !1,
                dragging: !1,
                autoPlayTimer: null,
                currentDirection: 0,
                currentLeft: null,
                currentSlide: 0,
                direction: 1,
                $dots: null,
                listWidth: null,
                listHeight: null,
                loadIndex: 0,
                $nextArrow: null,
                $prevArrow: null,
                slideCount: null,
                slideWidth: null,
                $slideTrack: null,
                $slides: null,
                sliding: !1,
                slideOffset: 0,
                swipeLeft: null,
                $list: null,
                touchObject: {},
                transformsEnabled: !1,
                unslicked: !1
            },
            i.extend(n, n.initials),
            n.activeBreakpoint = null,
            n.animType = null,
            n.animProp = null,
            n.breakpoints = [],
            n.breakpointSettings = [],
            n.cssTransitions = !1,
            n.focussed = !1,
            n.interrupted = !1,
            n.hidden = "hidden",
            n.paused = !0,
            n.positionProp = null,
            n.respondTo = null,
            n.rowCount = 1,
            n.shouldClick = !0,
            n.$slider = i(e),
            n.$slidesCache = null,
            n.transformType = null,
            n.transitionType = null,
            n.visibilityChange = "visibilitychange",
            n.windowWidth = 0,
            n.windowTimer = null,
            s = i(e).data("slick") || {},
            n.options = i.extend({}, n.defaults, o, s),
            n.currentSlide = n.options.initialSlide,
            n.originalSettings = n.options,
            "undefined" != typeof document.mozHidden ? (n.hidden = "mozHidden",
            n.visibilityChange = "mozvisibilitychange") : "undefined" != typeof document.webkitHidden && (n.hidden = "webkitHidden",
            n.visibilityChange = "webkitvisibilitychange"),
            n.autoPlay = i.proxy(n.autoPlay, n),
            n.autoPlayClear = i.proxy(n.autoPlayClear, n),
            n.autoPlayIterator = i.proxy(n.autoPlayIterator, n),
            n.changeSlide = i.proxy(n.changeSlide, n),
            n.clickHandler = i.proxy(n.clickHandler, n),
            n.selectHandler = i.proxy(n.selectHandler, n),
            n.setPosition = i.proxy(n.setPosition, n),
            n.swipeHandler = i.proxy(n.swipeHandler, n),
            n.dragHandler = i.proxy(n.dragHandler, n),
            n.keyHandler = i.proxy(n.keyHandler, n),
            n.instanceUid = t++,
            n.htmlExpr = /^(?:\s*(<[\w\W]+>)[^>]*)$/,
            n.registerBreakpoints(),
            n.init(!0)
        }
        var t = 0;
        return e
    }(),
    e.prototype.activateADA = function() {
        var i = this;
        i.$slideTrack.find(".slick-active").attr({
            "aria-hidden": "false"
        }).find("a, input, button, select").attr({
            tabindex: "0"
        })
    }
    ,
    e.prototype.addSlide = e.prototype.slickAdd = function(e, t, o) {
        var s = this;
        if ("boolean" == typeof t)
            o = t,
            t = null;
        else if (0 > t || t >= s.slideCount)
            return !1;
        s.unload(),
        "number" == typeof t ? 0 === t && 0 === s.$slides.length ? i(e).appendTo(s.$slideTrack) : o ? i(e).insertBefore(s.$slides.eq(t)) : i(e).insertAfter(s.$slides.eq(t)) : o === !0 ? i(e).prependTo(s.$slideTrack) : i(e).appendTo(s.$slideTrack),
        s.$slides = s.$slideTrack.children(this.options.slide),
        s.$slideTrack.children(this.options.slide).detach(),
        s.$slideTrack.append(s.$slides),
        s.$slides.each(function(e, t) {
            i(t).attr("data-slick-index", e)
        }),
        s.$slidesCache = s.$slides,
        s.reinit()
    }
    ,
    e.prototype.animateHeight = function() {
        var i = this;
        if (1 === i.options.slidesToShow && i.options.adaptiveHeight === !0 && i.options.vertical === !1) {
            var e = i.$slides.eq(i.currentSlide).outerHeight(!0);
            i.$list.animate({
                height: e
            }, i.options.speed)
        }
    }
    ,
    e.prototype.animateSlide = function(e, t) {
        var o = {}
          , s = this;
        s.animateHeight(),
        s.options.rtl === !0 && s.options.vertical === !1 && (e = -e),
        s.transformsEnabled === !1 ? s.options.vertical === !1 ? s.$slideTrack.animate({
            left: e
        }, s.options.speed, s.options.easing, t) : s.$slideTrack.animate({
            top: e
        }, s.options.speed, s.options.easing, t) : s.cssTransitions === !1 ? (s.options.rtl === !0 && (s.currentLeft = -s.currentLeft),
        i({
            animStart: s.currentLeft
        }).animate({
            animStart: e
        }, {
            duration: s.options.speed,
            easing: s.options.easing,
            step: function(i) {
                i = Math.ceil(i),
                s.options.vertical === !1 ? (o[s.animType] = "translate(" + i + "px, 0px)",
                s.$slideTrack.css(o)) : (o[s.animType] = "translate(0px," + i + "px)",
                s.$slideTrack.css(o))
            },
            complete: function() {
                t && t.call()
            }
        })) : (s.applyTransition(),
        e = Math.ceil(e),
        s.options.vertical === !1 ? o[s.animType] = "translate3d(" + e + "px, 0px, 0px)" : o[s.animType] = "translate3d(0px," + e + "px, 0px)",
        s.$slideTrack.css(o),
        t && setTimeout(function() {
            s.disableTransition(),
            t.call()
        }, s.options.speed))
    }
    ,
    e.prototype.getNavTarget = function() {
        var e = this
          , t = e.options.asNavFor;
        return t && null !== t && (t = i(t).not(e.$slider)),
        t
    }
    ,
    e.prototype.asNavFor = function(e) {
        var t = this
          , o = t.getNavTarget();
        null !== o && "object" == typeof o && o.each(function() {
            var t = i(this).slick("getSlick");
            t.unslicked || t.slideHandler(e, !0)
        })
    }
    ,
    e.prototype.applyTransition = function(i) {
        var e = this
          , t = {};
        e.options.fade === !1 ? t[e.transitionType] = e.transformType + " " + e.options.speed + "ms " + e.options.cssEase : t[e.transitionType] = "opacity " + e.options.speed + "ms " + e.options.cssEase,
        e.options.fade === !1 ? e.$slideTrack.css(t) : e.$slides.eq(i).css(t)
    }
    ,
    e.prototype.autoPlay = function() {
        var i = this;
        i.autoPlayClear(),
        i.slideCount > i.options.slidesToShow && (i.autoPlayTimer = setInterval(i.autoPlayIterator, i.options.autoplaySpeed))
    }
    ,
    e.prototype.autoPlayClear = function() {
        var i = this;
        i.autoPlayTimer && clearInterval(i.autoPlayTimer)
    }
    ,
    e.prototype.autoPlayIterator = function() {
        var i = this
          , e = i.currentSlide + i.options.slidesToScroll;
        i.paused || i.interrupted || i.focussed || (i.options.infinite === !1 && (1 === i.direction && i.currentSlide + 1 === i.slideCount - 1 ? i.direction = 0 : 0 === i.direction && (e = i.currentSlide - i.options.slidesToScroll,
        i.currentSlide - 1 === 0 && (i.direction = 1))),
        i.slideHandler(e))
    }
    ,
    e.prototype.buildArrows = function() {
        var e = this;
        e.options.arrows === !0 && (e.$prevArrow = i(e.options.prevArrow).addClass("slick-arrow"),
        e.$nextArrow = i(e.options.nextArrow).addClass("slick-arrow"),
        e.slideCount > e.options.slidesToShow ? (e.$prevArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex"),
        e.$nextArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex"),
        e.htmlExpr.test(e.options.prevArrow) && e.$prevArrow.prependTo(e.options.appendArrows),
        e.htmlExpr.test(e.options.nextArrow) && e.$nextArrow.appendTo(e.options.appendArrows),
        e.options.infinite !== !0 && e.$prevArrow.addClass("slick-disabled").attr("aria-disabled", "true")) : e.$prevArrow.add(e.$nextArrow).addClass("slick-hidden").attr({
            "aria-disabled": "true",
            tabindex: "-1"
        }))
    }
    ,
    e.prototype.buildDots = function() {
        var e, t, o = this;
        if (o.options.dots === !0 && o.slideCount > o.options.slidesToShow) {
            for (o.$slider.addClass("slick-dotted"),
            t = i("<ul />").addClass(o.options.dotsClass),
            e = 0; e <= o.getDotCount(); e += 1)
                t.append(i("<li />").append(o.options.customPaging.call(this, o, e)));
            o.$dots = t.appendTo(o.options.appendDots),
            o.$dots.find("li").first().addClass("slick-active").attr("aria-hidden", "false")
        }
    }
    ,
    e.prototype.buildOut = function() {
        var e = this;
        e.$slides = e.$slider.children(e.options.slide + ":not(.slick-cloned)").addClass("slick-slide"),
        e.slideCount = e.$slides.length,
        e.$slides.each(function(e, t) {
            i(t).attr("data-slick-index", e).data("originalStyling", i(t).attr("style") || "")
        }),
        e.$slider.addClass("slick-slider"),
        e.$slideTrack = 0 === e.slideCount ? i('<div class="slick-track"/>').appendTo(e.$slider) : e.$slides.wrapAll('<div class="slick-track"/>').parent(),
        e.$list = e.$slideTrack.wrap('<div aria-live="polite" class="slick-list"/>').parent(),
        e.$slideTrack.css("opacity", 0),
        (e.options.centerMode === !0 || e.options.swipeToSlide === !0) && (e.options.slidesToScroll = 1),
        i("img[data-lazy]", e.$slider).not("[src]").addClass("slick-loading"),
        e.setupInfinite(),
        e.buildArrows(),
        e.buildDots(),
        e.updateDots(),
        e.setSlideClasses("number" == typeof e.currentSlide ? e.currentSlide : 0),
        e.options.draggable === !0 && e.$list.addClass("draggable")
    }
    ,
    e.prototype.buildRows = function() {
        var i, e, t, o, s, n, r, l = this;
        if (o = document.createDocumentFragment(),
        n = l.$slider.children(),
        l.options.rows > 1) {
            for (r = l.options.slidesPerRow * l.options.rows,
            s = Math.ceil(n.length / r),
            i = 0; s > i; i++) {
                var d = document.createElement("div");
                for (e = 0; e < l.options.rows; e++) {
                    var a = document.createElement("div");
                    for (t = 0; t < l.options.slidesPerRow; t++) {
                        var c = i * r + (e * l.options.slidesPerRow + t);
                        n.get(c) && a.appendChild(n.get(c))
                    }
                    d.appendChild(a)
                }
                o.appendChild(d)
            }
            l.$slider.empty().append(o),
            l.$slider.children().children().children().css({
                width: 100 / l.options.slidesPerRow + "%",
                display: "inline-block"
            })
        }
    }
    ,
    e.prototype.checkResponsive = function(e, t) {
        var o, s, n, r = this, l = !1, d = r.$slider.width(), a = window.innerWidth || i(window).width();
        if ("window" === r.respondTo ? n = a : "slider" === r.respondTo ? n = d : "min" === r.respondTo && (n = Math.min(a, d)),
        r.options.responsive && r.options.responsive.length && null !== r.options.responsive) {
            s = null;
            for (o in r.breakpoints)
                r.breakpoints.hasOwnProperty(o) && (r.originalSettings.mobileFirst === !1 ? n < r.breakpoints[o] && (s = r.breakpoints[o]) : n > r.breakpoints[o] && (s = r.breakpoints[o]));
            null !== s ? null !== r.activeBreakpoint ? (s !== r.activeBreakpoint || t) && (r.activeBreakpoint = s,
            "unslick" === r.breakpointSettings[s] ? r.unslick(s) : (r.options = i.extend({}, r.originalSettings, r.breakpointSettings[s]),
            e === !0 && (r.currentSlide = r.options.initialSlide),
            r.refresh(e)),
            l = s) : (r.activeBreakpoint = s,
            "unslick" === r.breakpointSettings[s] ? r.unslick(s) : (r.options = i.extend({}, r.originalSettings, r.breakpointSettings[s]),
            e === !0 && (r.currentSlide = r.options.initialSlide),
            r.refresh(e)),
            l = s) : null !== r.activeBreakpoint && (r.activeBreakpoint = null,
            r.options = r.originalSettings,
            e === !0 && (r.currentSlide = r.options.initialSlide),
            r.refresh(e),
            l = s),
            e || l === !1 || r.$slider.trigger("breakpoint", [r, l])
        }
    }
    ,
    e.prototype.changeSlide = function(e, t) {
        var o, s, n, r = this, l = i(e.currentTarget);
        switch (l.is("a") && e.preventDefault(),
        l.is("li") || (l = l.closest("li")),
        n = r.slideCount % r.options.slidesToScroll !== 0,
        o = n ? 0 : (r.slideCount - r.currentSlide) % r.options.slidesToScroll,
        e.data.message) {
        case "previous":
            s = 0 === o ? r.options.slidesToScroll : r.options.slidesToShow - o,
            r.slideCount > r.options.slidesToShow && r.slideHandler(r.currentSlide - s, !1, t);
            break;
        case "next":
            s = 0 === o ? r.options.slidesToScroll : o,
            r.slideCount > r.options.slidesToShow && r.slideHandler(r.currentSlide + s, !1, t);
            break;
        case "index":
            var d = 0 === e.data.index ? 0 : e.data.index || l.index() * r.options.slidesToScroll;
            r.slideHandler(r.checkNavigable(d), !1, t),
            l.children().trigger("focus");
            break;
        default:
            return
        }
    }
    ,
    e.prototype.checkNavigable = function(i) {
        var e, t, o = this;
        if (e = o.getNavigableIndexes(),
        t = 0,
        i > e[e.length - 1])
            i = e[e.length - 1];
        else
            for (var s in e) {
                if (i < e[s]) {
                    i = t;
                    break
                }
                t = e[s]
            }
        return i
    }
    ,
    e.prototype.cleanUpEvents = function() {
        var e = this;
        e.options.dots && null !== e.$dots && i("li", e.$dots).off("click.slick", e.changeSlide).off("mouseenter.slick", i.proxy(e.interrupt, e, !0)).off("mouseleave.slick", i.proxy(e.interrupt, e, !1)),
        e.$slider.off("focus.slick blur.slick"),
        e.options.arrows === !0 && e.slideCount > e.options.slidesToShow && (e.$prevArrow && e.$prevArrow.off("click.slick", e.changeSlide),
        e.$nextArrow && e.$nextArrow.off("click.slick", e.changeSlide)),
        e.$list.off("touchstart.slick mousedown.slick", e.swipeHandler),
        e.$list.off("touchmove.slick mousemove.slick", e.swipeHandler),
        e.$list.off("touchend.slick mouseup.slick", e.swipeHandler),
        e.$list.off("touchcancel.slick mouseleave.slick", e.swipeHandler),
        e.$list.off("click.slick", e.clickHandler),
        i(document).off(e.visibilityChange, e.visibility),
        e.cleanUpSlideEvents(),
        e.options.accessibility === !0 && e.$list.off("keydown.slick", e.keyHandler),
        e.options.focusOnSelect === !0 && i(e.$slideTrack).children().off("click.slick", e.selectHandler),
        i(window).off("orientationchange.slick.slick-" + e.instanceUid, e.orientationChange),
        i(window).off("resize.slick.slick-" + e.instanceUid, e.resize),
        i("[draggable!=true]", e.$slideTrack).off("dragstart", e.preventDefault),
        i(window).off("load.slick.slick-" + e.instanceUid, e.setPosition),
        i(document).off("ready.slick.slick-" + e.instanceUid, e.setPosition)
    }
    ,
    e.prototype.cleanUpSlideEvents = function() {
        var e = this;
        e.$list.off("mouseenter.slick", i.proxy(e.interrupt, e, !0)),
        e.$list.off("mouseleave.slick", i.proxy(e.interrupt, e, !1))
    }
    ,
    e.prototype.cleanUpRows = function() {
        var i, e = this;
        e.options.rows > 1 && (i = e.$slides.children().children(),
        i.removeAttr("style"),
        e.$slider.empty().append(i))
    }
    ,
    e.prototype.clickHandler = function(i) {
        var e = this;
        e.shouldClick === !1 && (i.stopImmediatePropagation(),
        i.stopPropagation(),
        i.preventDefault())
    }
    ,
    e.prototype.destroy = function(e) {
        var t = this;
        t.autoPlayClear(),
        t.touchObject = {},
        t.cleanUpEvents(),
        i(".slick-cloned", t.$slider).detach(),
        t.$dots && t.$dots.remove(),
        t.$prevArrow && t.$prevArrow.length && (t.$prevArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display", ""),
        t.htmlExpr.test(t.options.prevArrow) && t.$prevArrow.remove()),
        t.$nextArrow && t.$nextArrow.length && (t.$nextArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display", ""),
        t.htmlExpr.test(t.options.nextArrow) && t.$nextArrow.remove()),
        t.$slides && (t.$slides.removeClass("slick-slide slick-active slick-center slick-visible slick-current").removeAttr("aria-hidden").removeAttr("data-slick-index").each(function() {
            i(this).attr("style", i(this).data("originalStyling"))
        }),
        t.$slideTrack.children(this.options.slide).detach(),
        t.$slideTrack.detach(),
        t.$list.detach(),
        t.$slider.append(t.$slides)),
        t.cleanUpRows(),
        t.$slider.removeClass("slick-slider"),
        t.$slider.removeClass("slick-initialized"),
        t.$slider.removeClass("slick-dotted"),
        t.unslicked = !0,
        e || t.$slider.trigger("destroy", [t])
    }
    ,
    e.prototype.disableTransition = function(i) {
        var e = this
          , t = {};
        t[e.transitionType] = "",
        e.options.fade === !1 ? e.$slideTrack.css(t) : e.$slides.eq(i).css(t)
    }
    ,
    e.prototype.fadeSlide = function(i, e) {
        var t = this;
        t.cssTransitions === !1 ? (t.$slides.eq(i).css({
            zIndex: t.options.zIndex
        }),
        t.$slides.eq(i).animate({
            opacity: 1
        }, t.options.speed, t.options.easing, e)) : (t.applyTransition(i),
        t.$slides.eq(i).css({
            opacity: 1,
            zIndex: t.options.zIndex
        }),
        e && setTimeout(function() {
            t.disableTransition(i),
            e.call()
        }, t.options.speed))
    }
    ,
    e.prototype.fadeSlideOut = function(i) {
        var e = this;
        e.cssTransitions === !1 ? e.$slides.eq(i).animate({
            opacity: 0,
            zIndex: e.options.zIndex - 2
        }, e.options.speed, e.options.easing) : (e.applyTransition(i),
        e.$slides.eq(i).css({
            opacity: 0,
            zIndex: e.options.zIndex - 2
        }))
    }
    ,
    e.prototype.filterSlides = e.prototype.slickFilter = function(i) {
        var e = this;
        null !== i && (e.$slidesCache = e.$slides,
        e.unload(),
        e.$slideTrack.children(this.options.slide).detach(),
        e.$slidesCache.filter(i).appendTo(e.$slideTrack),
        e.reinit())
    }
    ,
    e.prototype.focusHandler = function() {
        var e = this;
        e.$slider.off("focus.slick blur.slick").on("focus.slick blur.slick", "*:not(.slick-arrow)", function(t) {
            t.stopImmediatePropagation();
            var o = i(this);
            setTimeout(function() {
                e.options.pauseOnFocus && (e.focussed = o.is(":focus"),
                e.autoPlay())
            }, 0)
        })
    }
    ,
    e.prototype.getCurrent = e.prototype.slickCurrentSlide = function() {
        var i = this;
        return i.currentSlide
    }
    ,
    e.prototype.getDotCount = function() {
        var i = this
          , e = 0
          , t = 0
          , o = 0;
        if (i.options.infinite === !0)
            for (; e < i.slideCount; )
                ++o,
                e = t + i.options.slidesToScroll,
                t += i.options.slidesToScroll <= i.options.slidesToShow ? i.options.slidesToScroll : i.options.slidesToShow;
        else if (i.options.centerMode === !0)
            o = i.slideCount;
        else if (i.options.asNavFor)
            for (; e < i.slideCount; )
                ++o,
                e = t + i.options.slidesToScroll,
                t += i.options.slidesToScroll <= i.options.slidesToShow ? i.options.slidesToScroll : i.options.slidesToShow;
        else
            o = 1 + Math.ceil((i.slideCount - i.options.slidesToShow) / i.options.slidesToScroll);
        return o - 1
    }
    ,
    e.prototype.getLeft = function(i) {
        var e, t, o, s = this, n = 0;
        return s.slideOffset = 0,
        t = s.$slides.first().outerHeight(!0),
        s.options.infinite === !0 ? (s.slideCount > s.options.slidesToShow && (s.slideOffset = s.slideWidth * s.options.slidesToShow * -1,
        n = t * s.options.slidesToShow * -1),
        s.slideCount % s.options.slidesToScroll !== 0 && i + s.options.slidesToScroll > s.slideCount && s.slideCount > s.options.slidesToShow && (i > s.slideCount ? (s.slideOffset = (s.options.slidesToShow - (i - s.slideCount)) * s.slideWidth * -1,
        n = (s.options.slidesToShow - (i - s.slideCount)) * t * -1) : (s.slideOffset = s.slideCount % s.options.slidesToScroll * s.slideWidth * -1,
        n = s.slideCount % s.options.slidesToScroll * t * -1))) : i + s.options.slidesToShow > s.slideCount && (s.slideOffset = (i + s.options.slidesToShow - s.slideCount) * s.slideWidth,
        n = (i + s.options.slidesToShow - s.slideCount) * t),
        s.slideCount <= s.options.slidesToShow && (s.slideOffset = 0,
        n = 0),
        s.options.centerMode === !0 && s.options.infinite === !0 ? s.slideOffset += s.slideWidth * Math.floor(s.options.slidesToShow / 2) - s.slideWidth : s.options.centerMode === !0 && (s.slideOffset = 0,
        s.slideOffset += s.slideWidth * Math.floor(s.options.slidesToShow / 2)),
        e = s.options.vertical === !1 ? i * s.slideWidth * -1 + s.slideOffset : i * t * -1 + n,
        s.options.variableWidth === !0 && (o = s.slideCount <= s.options.slidesToShow || s.options.infinite === !1 ? s.$slideTrack.children(".slick-slide").eq(i) : s.$slideTrack.children(".slick-slide").eq(i + s.options.slidesToShow),
        e = s.options.rtl === !0 ? o[0] ? -1 * (s.$slideTrack.width() - o[0].offsetLeft - o.width()) : 0 : o[0] ? -1 * o[0].offsetLeft : 0,
        s.options.centerMode === !0 && (o = s.slideCount <= s.options.slidesToShow || s.options.infinite === !1 ? s.$slideTrack.children(".slick-slide").eq(i) : s.$slideTrack.children(".slick-slide").eq(i + s.options.slidesToShow + 1),
        e = s.options.rtl === !0 ? o[0] ? -1 * (s.$slideTrack.width() - o[0].offsetLeft - o.width()) : 0 : o[0] ? -1 * o[0].offsetLeft : 0,
        e += (s.$list.width() - o.outerWidth()) / 2)),
        e
    }
    ,
    e.prototype.getOption = e.prototype.slickGetOption = function(i) {
        var e = this;
        return e.options[i]
    }
    ,
    e.prototype.getNavigableIndexes = function() {
        var i, e = this, t = 0, o = 0, s = [];
        for (e.options.infinite === !1 ? i = e.slideCount : (t = -1 * e.options.slidesToScroll,
        o = -1 * e.options.slidesToScroll,
        i = 2 * e.slideCount); i > t; )
            s.push(t),
            t = o + e.options.slidesToScroll,
            o += e.options.slidesToScroll <= e.options.slidesToShow ? e.options.slidesToScroll : e.options.slidesToShow;
        return s
    }
    ,
    e.prototype.getSlick = function() {
        return this
    }
    ,
    e.prototype.getSlideCount = function() {
        var e, t, o, s = this;
        return o = s.options.centerMode === !0 ? s.slideWidth * Math.floor(s.options.slidesToShow / 2) : 0,
        s.options.swipeToSlide === !0 ? (s.$slideTrack.find(".slick-slide").each(function(e, n) {
            return n.offsetLeft - o + i(n).outerWidth() / 2 > -1 * s.swipeLeft ? (t = n,
            !1) : void 0
        }),
        e = Math.abs(i(t).attr("data-slick-index") - s.currentSlide) || 1) : s.options.slidesToScroll
    }
    ,
    e.prototype.goTo = e.prototype.slickGoTo = function(i, e) {
        var t = this;
        t.changeSlide({
            data: {
                message: "index",
                index: parseInt(i)
            }
        }, e)
    }
    ,
    e.prototype.init = function(e) {
        var t = this;
        i(t.$slider).hasClass("slick-initialized") || (i(t.$slider).addClass("slick-initialized"),
        t.buildRows(),
        t.buildOut(),
        t.setProps(),
        t.startLoad(),
        t.loadSlider(),
        t.initializeEvents(),
        t.updateArrows(),
        t.updateDots(),
        t.checkResponsive(!0),
        t.focusHandler()),
        e && t.$slider.trigger("init", [t]),
        t.options.accessibility === !0 && t.initADA(),
        t.options.autoplay && (t.paused = !1,
        t.autoPlay())
    }
    ,
    e.prototype.initADA = function() {
        var e = this;
        e.$slides.add(e.$slideTrack.find(".slick-cloned")).attr({
            "aria-hidden": "true",
            tabindex: "-1"
        }).find("a, input, button, select").attr({
            tabindex: "-1"
        }),
        e.$slideTrack.attr("role", "listbox"),
        e.$slides.not(e.$slideTrack.find(".slick-cloned")).each(function(t) {
            i(this).attr({
                role: "option",
                "aria-describedby": "slick-slide" + e.instanceUid + t
            })
        }),
        null !== e.$dots && e.$dots.attr("role", "tablist").find("li").each(function(t) {
            i(this).attr({
                role: "presentation",
                "aria-selected": "false",
                "aria-controls": "navigation" + e.instanceUid + t,
                id: "slick-slide" + e.instanceUid + t
            })
        }).first().attr("aria-selected", "true").end().find("button").attr("role", "button").end().closest("div").attr("role", "toolbar"),
        e.activateADA()
    }
    ,
    e.prototype.initArrowEvents = function() {
        var i = this;
        i.options.arrows === !0 && i.slideCount > i.options.slidesToShow && (i.$prevArrow.off("click.slick").on("click.slick", {
            message: "previous"
        }, i.changeSlide),
        i.$nextArrow.off("click.slick").on("click.slick", {
            message: "next"
        }, i.changeSlide))
    }
    ,
    e.prototype.initDotEvents = function() {
        var e = this;
        e.options.dots === !0 && e.slideCount > e.options.slidesToShow && i("li", e.$dots).on("click.slick", {
            message: "index"
        }, e.changeSlide),
        e.options.dots === !0 && e.options.pauseOnDotsHover === !0 && i("li", e.$dots).on("mouseenter.slick", i.proxy(e.interrupt, e, !0)).on("mouseleave.slick", i.proxy(e.interrupt, e, !1))
    }
    ,
    e.prototype.initSlideEvents = function() {
        var e = this;
        e.options.pauseOnHover && (e.$list.on("mouseenter.slick", i.proxy(e.interrupt, e, !0)),
        e.$list.on("mouseleave.slick", i.proxy(e.interrupt, e, !1)))
    }
    ,
    e.prototype.initializeEvents = function() {
        var e = this;
        e.initArrowEvents(),
        e.initDotEvents(),
        e.initSlideEvents(),
        e.$list.on("touchstart.slick mousedown.slick", {
            action: "start"
        }, e.swipeHandler),
        e.$list.on("touchmove.slick mousemove.slick", {
            action: "move"
        }, e.swipeHandler),
        e.$list.on("touchend.slick mouseup.slick", {
            action: "end"
        }, e.swipeHandler),
        e.$list.on("touchcancel.slick mouseleave.slick", {
            action: "end"
        }, e.swipeHandler),
        e.$list.on("click.slick", e.clickHandler),
        i(document).on(e.visibilityChange, i.proxy(e.visibility, e)),
        e.options.accessibility === !0 && e.$list.on("keydown.slick", e.keyHandler),
        e.options.focusOnSelect === !0 && i(e.$slideTrack).children().on("click.slick", e.selectHandler),
        i(window).on("orientationchange.slick.slick-" + e.instanceUid, i.proxy(e.orientationChange, e)),
        i(window).on("resize.slick.slick-" + e.instanceUid, i.proxy(e.resize, e)),
        i("[draggable!=true]", e.$slideTrack).on("dragstart", e.preventDefault),
        i(window).on("load.slick.slick-" + e.instanceUid, e.setPosition),
        i(document).on("ready.slick.slick-" + e.instanceUid, e.setPosition)
    }
    ,
    e.prototype.initUI = function() {
        var i = this;
        i.options.arrows === !0 && i.slideCount > i.options.slidesToShow && (i.$prevArrow.show(),
        i.$nextArrow.show()),
        i.options.dots === !0 && i.slideCount > i.options.slidesToShow && i.$dots.show()
    }
    ,
    e.prototype.keyHandler = function(i) {
        var e = this;
        i.target.tagName.match("TEXTAREA|INPUT|SELECT") || (37 === i.keyCode && e.options.accessibility === !0 ? e.changeSlide({
            data: {
                message: e.options.rtl === !0 ? "next" : "previous"
            }
        }) : 39 === i.keyCode && e.options.accessibility === !0 && e.changeSlide({
            data: {
                message: e.options.rtl === !0 ? "previous" : "next"
            }
        }))
    }
    ,
    e.prototype.lazyLoad = function() {
        function e(e) {
            i("img[data-lazy]", e).each(function() {
                var e = i(this)
                  , t = i(this).attr("data-lazy")
                  , o = document.createElement("img");
                o.onload = function() {
                    e.animate({
                        opacity: 0
                    }, 100, function() {
                        e.attr("src", t).animate({
                            opacity: 1
                        }, 200, function() {
                            e.removeAttr("data-lazy").removeClass("slick-loading")
                        }),
                        r.$slider.trigger("lazyLoaded", [r, e, t])
                    })
                }
                ,
                o.onerror = function() {
                    e.removeAttr("data-lazy").removeClass("slick-loading").addClass("slick-lazyload-error"),
                    r.$slider.trigger("lazyLoadError", [r, e, t])
                }
                ,
                o.src = t
            })
        }
        var t, o, s, n, r = this;
        r.options.centerMode === !0 ? r.options.infinite === !0 ? (s = r.currentSlide + (r.options.slidesToShow / 2 + 1),
        n = s + r.options.slidesToShow + 2) : (s = Math.max(0, r.currentSlide - (r.options.slidesToShow / 2 + 1)),
        n = 2 + (r.options.slidesToShow / 2 + 1) + r.currentSlide) : (s = r.options.infinite ? r.options.slidesToShow + r.currentSlide : r.currentSlide,
        n = Math.ceil(s + r.options.slidesToShow),
        r.options.fade === !0 && (s > 0 && s--,
        n <= r.slideCount && n++)),
        t = r.$slider.find(".slick-slide").slice(s, n),
        e(t),
        r.slideCount <= r.options.slidesToShow ? (o = r.$slider.find(".slick-slide"),
        e(o)) : r.currentSlide >= r.slideCount - r.options.slidesToShow ? (o = r.$slider.find(".slick-cloned").slice(0, r.options.slidesToShow),
        e(o)) : 0 === r.currentSlide && (o = r.$slider.find(".slick-cloned").slice(-1 * r.options.slidesToShow),
        e(o))
    }
    ,
    e.prototype.loadSlider = function() {
        var i = this;
        i.setPosition(),
        i.$slideTrack.css({
            opacity: 1
        }),
        i.$slider.removeClass("slick-loading"),
        i.initUI(),
        "progressive" === i.options.lazyLoad && i.progressiveLazyLoad()
    }
    ,
    e.prototype.next = e.prototype.slickNext = function() {
        var i = this;
        i.changeSlide({
            data: {
                message: "next"
            }
        })
    }
    ,
    e.prototype.orientationChange = function() {
        var i = this;
        i.checkResponsive(),
        i.setPosition()
    }
    ,
    e.prototype.pause = e.prototype.slickPause = function() {
        var i = this;
        i.autoPlayClear(),
        i.paused = !0
    }
    ,
    e.prototype.play = e.prototype.slickPlay = function() {
        var i = this;
        i.autoPlay(),
        i.options.autoplay = !0,
        i.paused = !1,
        i.focussed = !1,
        i.interrupted = !1
    }
    ,
    e.prototype.postSlide = function(i) {
        var e = this;
        e.unslicked || (e.$slider.trigger("afterChange", [e, i]),
        e.animating = !1,
        e.setPosition(),
        e.swipeLeft = null,
        e.options.autoplay && e.autoPlay(),
        e.options.accessibility === !0 && e.initADA())
    }
    ,
    e.prototype.prev = e.prototype.slickPrev = function() {
        var i = this;
        i.changeSlide({
            data: {
                message: "previous"
            }
        })
    }
    ,
    e.prototype.preventDefault = function(i) {
        i.preventDefault()
    }
    ,
    e.prototype.progressiveLazyLoad = function(e) {
        e = e || 1;
        var t, o, s, n = this, r = i("img[data-lazy]", n.$slider);
        r.length ? (t = r.first(),
        o = t.attr("data-lazy"),
        s = document.createElement("img"),
        s.onload = function() {
            t.attr("src", o).removeAttr("data-lazy").removeClass("slick-loading"),
            n.options.adaptiveHeight === !0 && n.setPosition(),
            n.$slider.trigger("lazyLoaded", [n, t, o]),
            n.progressiveLazyLoad()
        }
        ,
        s.onerror = function() {
            3 > e ? setTimeout(function() {
                n.progressiveLazyLoad(e + 1)
            }, 500) : (t.removeAttr("data-lazy").removeClass("slick-loading").addClass("slick-lazyload-error"),
            n.$slider.trigger("lazyLoadError", [n, t, o]),
            n.progressiveLazyLoad())
        }
        ,
        s.src = o) : n.$slider.trigger("allImagesLoaded", [n])
    }
    ,
    e.prototype.refresh = function(e) {
        var t, o, s = this;
        o = s.slideCount - s.options.slidesToShow,
        !s.options.infinite && s.currentSlide > o && (s.currentSlide = o),
        s.slideCount <= s.options.slidesToShow && (s.currentSlide = 0),
        t = s.currentSlide,
        s.destroy(!0),
        i.extend(s, s.initials, {
            currentSlide: t
        }),
        s.init(),
        e || s.changeSlide({
            data: {
                message: "index",
                index: t
            }
        }, !1)
    }
    ,
    e.prototype.registerBreakpoints = function() {
        var e, t, o, s = this, n = s.options.responsive || null;
        if ("array" === i.type(n) && n.length) {
            s.respondTo = s.options.respondTo || "window";
            for (e in n)
                if (o = s.breakpoints.length - 1,
                t = n[e].breakpoint,
                n.hasOwnProperty(e)) {
                    for (; o >= 0; )
                        s.breakpoints[o] && s.breakpoints[o] === t && s.breakpoints.splice(o, 1),
                        o--;
                    s.breakpoints.push(t),
                    s.breakpointSettings[t] = n[e].settings
                }
            s.breakpoints.sort(function(i, e) {
                return s.options.mobileFirst ? i - e : e - i
            })
        }
    }
    ,
    e.prototype.reinit = function() {
        var e = this;
        e.$slides = e.$slideTrack.children(e.options.slide).addClass("slick-slide"),
        e.slideCount = e.$slides.length,
        e.currentSlide >= e.slideCount && 0 !== e.currentSlide && (e.currentSlide = e.currentSlide - e.options.slidesToScroll),
        e.slideCount <= e.options.slidesToShow && (e.currentSlide = 0),
        e.registerBreakpoints(),
        e.setProps(),
        e.setupInfinite(),
        e.buildArrows(),
        e.updateArrows(),
        e.initArrowEvents(),
        e.buildDots(),
        e.updateDots(),
        e.initDotEvents(),
        e.cleanUpSlideEvents(),
        e.initSlideEvents(),
        e.checkResponsive(!1, !0),
        e.options.focusOnSelect === !0 && i(e.$slideTrack).children().on("click.slick", e.selectHandler),
        e.setSlideClasses("number" == typeof e.currentSlide ? e.currentSlide : 0),
        e.setPosition(),
        e.focusHandler(),
        e.paused = !e.options.autoplay,
        e.autoPlay(),
        e.$slider.trigger("reInit", [e])
    }
    ,
    e.prototype.resize = function() {
        var e = this;
        i(window).width() !== e.windowWidth && (clearTimeout(e.windowDelay),
        e.windowDelay = window.setTimeout(function() {
            e.windowWidth = i(window).width(),
            e.checkResponsive(),
            e.unslicked || e.setPosition()
        }, 50))
    }
    ,
    e.prototype.removeSlide = e.prototype.slickRemove = function(i, e, t) {
        var o = this;
        return "boolean" == typeof i ? (e = i,
        i = e === !0 ? 0 : o.slideCount - 1) : i = e === !0 ? --i : i,
        !(o.slideCount < 1 || 0 > i || i > o.slideCount - 1) && (o.unload(),
        t === !0 ? o.$slideTrack.children().remove() : o.$slideTrack.children(this.options.slide).eq(i).remove(),
        o.$slides = o.$slideTrack.children(this.options.slide),
        o.$slideTrack.children(this.options.slide).detach(),
        o.$slideTrack.append(o.$slides),
        o.$slidesCache = o.$slides,
        void o.reinit())
    }
    ,
    e.prototype.setCSS = function(i) {
        var e, t, o = this, s = {};
        o.options.rtl === !0 && (i = -i),
        e = "left" == o.positionProp ? Math.ceil(i) + "px" : "0px",
        t = "top" == o.positionProp ? Math.ceil(i) + "px" : "0px",
        s[o.positionProp] = i,
        o.transformsEnabled === !1 ? o.$slideTrack.css(s) : (s = {},
        o.cssTransitions === !1 ? (s[o.animType] = "translate(" + e + ", " + t + ")",
        o.$slideTrack.css(s)) : (s[o.animType] = "translate3d(" + e + ", " + t + ", 0px)",
        o.$slideTrack.css(s)))
    }
    ,
    e.prototype.setDimensions = function() {
        var i = this;
        i.options.vertical === !1 ? i.options.centerMode === !0 && i.$list.css({
            padding: "0px " + i.options.centerPadding
        }) : (i.$list.height(i.$slides.first().outerHeight(!0) * i.options.slidesToShow),
        i.options.centerMode === !0 && i.$list.css({
            padding: i.options.centerPadding + " 0px"
        })),
        i.listWidth = i.$list.width(),
        i.listHeight = i.$list.height(),
        i.options.vertical === !1 && i.options.variableWidth === !1 ? (i.slideWidth = Math.ceil(i.listWidth / i.options.slidesToShow),
        i.$slideTrack.width(Math.ceil(i.slideWidth * i.$slideTrack.children(".slick-slide").length))) : i.options.variableWidth === !0 ? i.$slideTrack.width(5e3 * i.slideCount) : (i.slideWidth = Math.ceil(i.listWidth),
        i.$slideTrack.height(Math.ceil(i.$slides.first().outerHeight(!0) * i.$slideTrack.children(".slick-slide").length)));
        var e = i.$slides.first().outerWidth(!0) - i.$slides.first().width();
        i.options.variableWidth === !1 && i.$slideTrack.children(".slick-slide").width(i.slideWidth - e)
    }
    ,
    e.prototype.setFade = function() {
        var e, t = this;
        t.$slides.each(function(o, s) {
            e = t.slideWidth * o * -1,
            t.options.rtl === !0 ? i(s).css({
                position: "relative",
                right: e,
                top: 0,
                zIndex: t.options.zIndex - 2,
                opacity: 0
            }) : i(s).css({
                position: "relative",
                left: e,
                top: 0,
                zIndex: t.options.zIndex - 2,
                opacity: 0
            })
        }),
        t.$slides.eq(t.currentSlide).css({
            zIndex: t.options.zIndex - 1,
            opacity: 1
        })
    }
    ,
    e.prototype.setHeight = function() {
        var i = this;
        if (1 === i.options.slidesToShow && i.options.adaptiveHeight === !0 && i.options.vertical === !1) {
            var e = i.$slides.eq(i.currentSlide).outerHeight(!0);
            i.$list.css("height", e)
        }
    }
    ,
    e.prototype.setOption = e.prototype.slickSetOption = function() {
        var e, t, o, s, n, r = this, l = !1;
        if ("object" === i.type(arguments[0]) ? (o = arguments[0],
        l = arguments[1],
        n = "multiple") : "string" === i.type(arguments[0]) && (o = arguments[0],
        s = arguments[1],
        l = arguments[2],
        "responsive" === arguments[0] && "array" === i.type(arguments[1]) ? n = "responsive" : "undefined" != typeof arguments[1] && (n = "single")),
        "single" === n)
            r.options[o] = s;
        else if ("multiple" === n)
            i.each(o, function(i, e) {
                r.options[i] = e
            });
        else if ("responsive" === n)
            for (t in s)
                if ("array" !== i.type(r.options.responsive))
                    r.options.responsive = [s[t]];
                else {
                    for (e = r.options.responsive.length - 1; e >= 0; )
                        r.options.responsive[e].breakpoint === s[t].breakpoint && r.options.responsive.splice(e, 1),
                        e--;
                    r.options.responsive.push(s[t])
                }
        l && (r.unload(),
        r.reinit())
    }
    ,
    e.prototype.setPosition = function() {
        var i = this;
        i.setDimensions(),
        i.setHeight(),
        i.options.fade === !1 ? i.setCSS(i.getLeft(i.currentSlide)) : i.setFade(),
        i.$slider.trigger("setPosition", [i])
    }
    ,
    e.prototype.setProps = function() {
        var i = this
          , e = document.body.style;
        i.positionProp = i.options.vertical === !0 ? "top" : "left",
        "top" === i.positionProp ? i.$slider.addClass("slick-vertical") : i.$slider.removeClass("slick-vertical"),
        (void 0 !== e.WebkitTransition || void 0 !== e.MozTransition || void 0 !== e.msTransition) && i.options.useCSS === !0 && (i.cssTransitions = !0),
        i.options.fade && ("number" == typeof i.options.zIndex ? i.options.zIndex < 3 && (i.options.zIndex = 3) : i.options.zIndex = i.defaults.zIndex),
        void 0 !== e.OTransform && (i.animType = "OTransform",
        i.transformType = "-o-transform",
        i.transitionType = "OTransition",
        void 0 === e.perspectiveProperty && void 0 === e.webkitPerspective && (i.animType = !1)),
        void 0 !== e.MozTransform && (i.animType = "MozTransform",
        i.transformType = "-moz-transform",
        i.transitionType = "MozTransition",
        void 0 === e.perspectiveProperty && void 0 === e.MozPerspective && (i.animType = !1)),
        void 0 !== e.webkitTransform && (i.animType = "webkitTransform",
        i.transformType = "-webkit-transform",
        i.transitionType = "webkitTransition",
        void 0 === e.perspectiveProperty && void 0 === e.webkitPerspective && (i.animType = !1)),
        void 0 !== e.msTransform && (i.animType = "msTransform",
        i.transformType = "-ms-transform",
        i.transitionType = "msTransition",
        void 0 === e.msTransform && (i.animType = !1)),
        void 0 !== e.transform && i.animType !== !1 && (i.animType = "transform",
        i.transformType = "transform",
        i.transitionType = "transition"),
        i.transformsEnabled = i.options.useTransform && null !== i.animType && i.animType !== !1
    }
    ,
    e.prototype.setSlideClasses = function(i) {
        var e, t, o, s, n = this;
        t = n.$slider.find(".slick-slide").removeClass("slick-active slick-center slick-current").attr("aria-hidden", "true"),
        n.$slides.eq(i).addClass("slick-current"),
        n.options.centerMode === !0 ? (e = Math.floor(n.options.slidesToShow / 2),
        n.options.infinite === !0 && (i >= e && i <= n.slideCount - 1 - e ? n.$slides.slice(i - e, i + e + 1).addClass("slick-active").attr("aria-hidden", "false") : (o = n.options.slidesToShow + i,
        t.slice(o - e + 1, o + e + 2).addClass("slick-active").attr("aria-hidden", "false")),
        0 === i ? t.eq(t.length - 1 - n.options.slidesToShow).addClass("slick-center") : i === n.slideCount - 1 && t.eq(n.options.slidesToShow).addClass("slick-center")),
        n.$slides.eq(i).addClass("slick-center")) : i >= 0 && i <= n.slideCount - n.options.slidesToShow ? n.$slides.slice(i, i + n.options.slidesToShow).addClass("slick-active").attr("aria-hidden", "false") : t.length <= n.options.slidesToShow ? t.addClass("slick-active").attr("aria-hidden", "false") : (s = n.slideCount % n.options.slidesToShow,
        o = n.options.infinite === !0 ? n.options.slidesToShow + i : i,
        n.options.slidesToShow == n.options.slidesToScroll && n.slideCount - i < n.options.slidesToShow ? t.slice(o - (n.options.slidesToShow - s), o + s).addClass("slick-active").attr("aria-hidden", "false") : t.slice(o, o + n.options.slidesToShow).addClass("slick-active").attr("aria-hidden", "false")),
        "ondemand" === n.options.lazyLoad && n.lazyLoad()
    }
    ,
    e.prototype.setupInfinite = function() {
        var e, t, o, s = this;
        if (s.options.fade === !0 && (s.options.centerMode = !1),
        s.options.infinite === !0 && s.options.fade === !1 && (t = null,
        s.slideCount > s.options.slidesToShow)) {
            for (o = s.options.centerMode === !0 ? s.options.slidesToShow + 1 : s.options.slidesToShow,
            e = s.slideCount; e > s.slideCount - o; e -= 1)
                t = e - 1,
                i(s.$slides[t]).clone(!0).attr("id", "").attr("data-slick-index", t - s.slideCount).prependTo(s.$slideTrack).addClass("slick-cloned");
            for (e = 0; o > e; e += 1)
                t = e,
                i(s.$slides[t]).clone(!0).attr("id", "").attr("data-slick-index", t + s.slideCount).appendTo(s.$slideTrack).addClass("slick-cloned");
            s.$slideTrack.find(".slick-cloned").find("[id]").each(function() {
                i(this).attr("id", "")
            })
        }
    }
    ,
    e.prototype.interrupt = function(i) {
        var e = this;
        i || e.autoPlay(),
        e.interrupted = i
    }
    ,
    e.prototype.selectHandler = function(e) {
        var t = this
          , o = i(e.target).is(".slick-slide") ? i(e.target) : i(e.target).parents(".slick-slide")
          , s = parseInt(o.attr("data-slick-index"));
        return s || (s = 0),
        t.slideCount <= t.options.slidesToShow ? (t.setSlideClasses(s),
        void t.asNavFor(s)) : void t.slideHandler(s)
    }
    ,
    e.prototype.slideHandler = function(i, e, t) {
        var o, s, n, r, l, d = null, a = this;
        return e = e || !1,
        a.animating === !0 && a.options.waitForAnimate === !0 || a.options.fade === !0 && a.currentSlide === i || a.slideCount <= a.options.slidesToShow ? void 0 : (e === !1 && a.asNavFor(i),
        o = i,
        d = a.getLeft(o),
        r = a.getLeft(a.currentSlide),
        a.currentLeft = null === a.swipeLeft ? r : a.swipeLeft,
        a.options.infinite === !1 && a.options.centerMode === !1 && (0 > i || i > a.getDotCount() * a.options.slidesToScroll) ? void (a.options.fade === !1 && (o = a.currentSlide,
        t !== !0 ? a.animateSlide(r, function() {
            a.postSlide(o)
        }) : a.postSlide(o))) : a.options.infinite === !1 && a.options.centerMode === !0 && (0 > i || i > a.slideCount - a.options.slidesToScroll) ? void (a.options.fade === !1 && (o = a.currentSlide,
        t !== !0 ? a.animateSlide(r, function() {
            a.postSlide(o)
        }) : a.postSlide(o))) : (a.options.autoplay && clearInterval(a.autoPlayTimer),
        s = 0 > o ? a.slideCount % a.options.slidesToScroll !== 0 ? a.slideCount - a.slideCount % a.options.slidesToScroll : a.slideCount + o : o >= a.slideCount ? a.slideCount % a.options.slidesToScroll !== 0 ? 0 : o - a.slideCount : o,
        a.animating = !0,
        a.$slider.trigger("beforeChange", [a, a.currentSlide, s]),
        n = a.currentSlide,
        a.currentSlide = s,
        a.setSlideClasses(a.currentSlide),
        a.options.asNavFor && (l = a.getNavTarget(),
        l = l.slick("getSlick"),
        l.slideCount <= l.options.slidesToShow && l.setSlideClasses(a.currentSlide)),
        a.updateDots(),
        a.updateArrows(),
        a.options.fade === !0 ? (t !== !0 ? (a.fadeSlideOut(n),
        a.fadeSlide(s, function() {
            a.postSlide(s)
        })) : a.postSlide(s),
        void a.animateHeight()) : void (t !== !0 ? a.animateSlide(d, function() {
            a.postSlide(s)
        }) : a.postSlide(s))))
    }
    ,
    e.prototype.startLoad = function() {
        var i = this;
        i.options.arrows === !0 && i.slideCount > i.options.slidesToShow && (i.$prevArrow.hide(),
        i.$nextArrow.hide()),
        i.options.dots === !0 && i.slideCount > i.options.slidesToShow && i.$dots.hide(),
        i.$slider.addClass("slick-loading")
    }
    ,
    e.prototype.swipeDirection = function() {
        var i, e, t, o, s = this;
        return i = s.touchObject.startX - s.touchObject.curX,
        e = s.touchObject.startY - s.touchObject.curY,
        t = Math.atan2(e, i),
        o = Math.round(180 * t / Math.PI),
        0 > o && (o = 360 - Math.abs(o)),
        45 >= o && o >= 0 ? s.options.rtl === !1 ? "left" : "right" : 360 >= o && o >= 315 ? s.options.rtl === !1 ? "left" : "right" : o >= 135 && 225 >= o ? s.options.rtl === !1 ? "right" : "left" : s.options.verticalSwiping === !0 ? o >= 35 && 135 >= o ? "down" : "up" : "vertical"
    }
    ,
    e.prototype.swipeEnd = function(i) {
        var e, t, o = this;
        if (o.dragging = !1,
        o.interrupted = !1,
        o.shouldClick = !(o.touchObject.swipeLength > 10),
        void 0 === o.touchObject.curX)
            return !1;
        if (o.touchObject.edgeHit === !0 && o.$slider.trigger("edge", [o, o.swipeDirection()]),
        o.touchObject.swipeLength >= o.touchObject.minSwipe) {
            switch (t = o.swipeDirection()) {
            case "left":
            case "down":
                e = o.options.swipeToSlide ? o.checkNavigable(o.currentSlide + o.getSlideCount()) : o.currentSlide + o.getSlideCount(),
                o.currentDirection = 0;
                break;
            case "right":
            case "up":
                e = o.options.swipeToSlide ? o.checkNavigable(o.currentSlide - o.getSlideCount()) : o.currentSlide - o.getSlideCount(),
                o.currentDirection = 1
            }
            "vertical" != t && (o.slideHandler(e),
            o.touchObject = {},
            o.$slider.trigger("swipe", [o, t]))
        } else
            o.touchObject.startX !== o.touchObject.curX && (o.slideHandler(o.currentSlide),
            o.touchObject = {})
    }
    ,
    e.prototype.swipeHandler = function(i) {
        var e = this;
        if (!(e.options.swipe === !1 || "ontouchend"in document && e.options.swipe === !1 || e.options.draggable === !1 && -1 !== i.type.indexOf("mouse")))
            switch (e.touchObject.fingerCount = i.originalEvent && void 0 !== i.originalEvent.touches ? i.originalEvent.touches.length : 1,
            e.touchObject.minSwipe = e.listWidth / e.options.touchThreshold,
            e.options.verticalSwiping === !0 && (e.touchObject.minSwipe = e.listHeight / e.options.touchThreshold),
            i.data.action) {
            case "start":
                e.swipeStart(i);
                break;
            case "move":
                e.swipeMove(i);
                break;
            case "end":
                e.swipeEnd(i)
            }
    }
    ,
    e.prototype.swipeMove = function(i) {
        var e, t, o, s, n, r = this;
        return n = void 0 !== i.originalEvent ? i.originalEvent.touches : null,
        !(!r.dragging || n && 1 !== n.length) && (e = r.getLeft(r.currentSlide),
        r.touchObject.curX = void 0 !== n ? n[0].pageX : i.clientX,
        r.touchObject.curY = void 0 !== n ? n[0].pageY : i.clientY,
        r.touchObject.swipeLength = Math.round(Math.sqrt(Math.pow(r.touchObject.curX - r.touchObject.startX, 2))),
        r.options.verticalSwiping === !0 && (r.touchObject.swipeLength = Math.round(Math.sqrt(Math.pow(r.touchObject.curY - r.touchObject.startY, 2)))),
        t = r.swipeDirection(),
        "vertical" !== t ? (void 0 !== i.originalEvent && r.touchObject.swipeLength > 4 && i.preventDefault(),
        s = (r.options.rtl === !1 ? 1 : -1) * (r.touchObject.curX > r.touchObject.startX ? 1 : -1),
        r.options.verticalSwiping === !0 && (s = r.touchObject.curY > r.touchObject.startY ? 1 : -1),
        o = r.touchObject.swipeLength,
        r.touchObject.edgeHit = !1,
        r.options.infinite === !1 && (0 === r.currentSlide && "right" === t || r.currentSlide >= r.getDotCount() && "left" === t) && (o = r.touchObject.swipeLength * r.options.edgeFriction,
        r.touchObject.edgeHit = !0),
        r.options.vertical === !1 ? r.swipeLeft = e + o * s : r.swipeLeft = e + o * (r.$list.height() / r.listWidth) * s,
        r.options.verticalSwiping === !0 && (r.swipeLeft = e + o * s),
        r.options.fade !== !0 && r.options.touchMove !== !1 && (r.animating === !0 ? (r.swipeLeft = null,
        !1) : void r.setCSS(r.swipeLeft))) : void 0)
    }
    ,
    e.prototype.swipeStart = function(i) {
        var e, t = this;
        return t.interrupted = !0,
        1 !== t.touchObject.fingerCount || t.slideCount <= t.options.slidesToShow ? (t.touchObject = {},
        !1) : (void 0 !== i.originalEvent && void 0 !== i.originalEvent.touches && (e = i.originalEvent.touches[0]),
        t.touchObject.startX = t.touchObject.curX = void 0 !== e ? e.pageX : i.clientX,
        t.touchObject.startY = t.touchObject.curY = void 0 !== e ? e.pageY : i.clientY,
        void (t.dragging = !0))
    }
    ,
    e.prototype.unfilterSlides = e.prototype.slickUnfilter = function() {
        var i = this;
        null !== i.$slidesCache && (i.unload(),
        i.$slideTrack.children(this.options.slide).detach(),
        i.$slidesCache.appendTo(i.$slideTrack),
        i.reinit())
    }
    ,
    e.prototype.unload = function() {
        var e = this;
        i(".slick-cloned", e.$slider).remove(),
        e.$dots && e.$dots.remove(),
        e.$prevArrow && e.htmlExpr.test(e.options.prevArrow) && e.$prevArrow.remove(),
        e.$nextArrow && e.htmlExpr.test(e.options.nextArrow) && e.$nextArrow.remove(),
        e.$slides.removeClass("slick-slide slick-active slick-visible slick-current").attr("aria-hidden", "true").css("width", "")
    }
    ,
    e.prototype.unslick = function(i) {
        var e = this;
        e.$slider.trigger("unslick", [e, i]),
        e.destroy()
    }
    ,
    e.prototype.updateArrows = function() {
        var i, e = this;
        i = Math.floor(e.options.slidesToShow / 2),
        e.options.arrows === !0 && e.slideCount > e.options.slidesToShow && !e.options.infinite && (e.$prevArrow.removeClass("slick-disabled").attr("aria-disabled", "false"),
        e.$nextArrow.removeClass("slick-disabled").attr("aria-disabled", "false"),
        0 === e.currentSlide ? (e.$prevArrow.addClass("slick-disabled").attr("aria-disabled", "true"),
        e.$nextArrow.removeClass("slick-disabled").attr("aria-disabled", "false")) : e.currentSlide >= e.slideCount - e.options.slidesToShow && e.options.centerMode === !1 ? (e.$nextArrow.addClass("slick-disabled").attr("aria-disabled", "true"),
        e.$prevArrow.removeClass("slick-disabled").attr("aria-disabled", "false")) : e.currentSlide >= e.slideCount - 1 && e.options.centerMode === !0 && (e.$nextArrow.addClass("slick-disabled").attr("aria-disabled", "true"),
        e.$prevArrow.removeClass("slick-disabled").attr("aria-disabled", "false")))
    }
    ,
    e.prototype.updateDots = function() {
        var i = this;
        null !== i.$dots && (i.$dots.find("li").removeClass("slick-active").attr("aria-hidden", "true"),
        i.$dots.find("li").eq(Math.floor(i.currentSlide / i.options.slidesToScroll)).addClass("slick-active").attr("aria-hidden", "false"))
    }
    ,
    e.prototype.visibility = function() {
        var i = this;
        i.options.autoplay && (document[i.hidden] ? i.interrupted = !0 : i.interrupted = !1)
    }
    ,
    i.fn.slick = function() {
        var i, t, o = this, s = arguments[0], n = Array.prototype.slice.call(arguments, 1), r = o.length;
        for (i = 0; r > i; i++)
            if ("object" == typeof s || "undefined" == typeof s ? o[i].slick = new e(o[i],s) : t = o[i].slick[s].apply(o[i].slick, n),
            "undefined" != typeof t)
                return t;
        return o
    }
});
function googleMapInit() {
    var e, t, o, l, r, i, s;
    e = 14,
    t = new google.maps.LatLng(22.340143,114.166342),
    s = {
        lat: 22.340143,
        lng: 114.166342
    },
    o = [{
        featureType: "all",
        elementType: "labels",
        stylers: [{
            visibility: "off"
        }, {
            saturation: "0"
        }, {
            lightness: "0"
        }]
    }, {
        featureType: "administrative",
        elementType: "all",
        stylers: [{
            color: "#f9d8b2"
        }]
    }, {
        featureType: "landscape",
        elementType: "all",
        stylers: [{
            color: "#eeeeee"
        }]
    }, {
        featureType: "poi",
        elementType: "all",
        stylers: [{
            color: "#f9d8b2"
        }]
    }, {
        featureType: "poi.attraction",
        elementType: "all",
        stylers: [{
            color: "#efebe2"
        }]
    }, {
        featureType: "poi.business",
        elementType: "all",
        stylers: [{
            color: "#efebe2"
        }]
    }, {
        featureType: "poi.government",
        elementType: "all",
        stylers: [{
            color: "#dfdcd5"
        }]
    }, {
        featureType: "poi.medical",
        elementType: "all",
        stylers: [{
            color: "#dfdcd5"
        }]
    }, {
        featureType: "poi.park",
        elementType: "all",
        stylers: [{
            color: "#f9d8b2"
        }]
    }, {
        featureType: "poi.place_of_worship",
        elementType: "all",
        stylers: [{
            color: "#efebe2"
        }]
    }, {
        featureType: "poi.school",
        elementType: "all",
        stylers: [{
            color: "#efebe2"
        }]
    }, {
        featureType: "poi.sports_complex",
        elementType: "all",
        stylers: [{
            color: "#efebe2"
        }]
    }, {
        featureType: "road.highway",
        elementType: "geometry.fill",
        stylers: [{
            color: "#ffffff"
        }]
    }, {
        featureType: "road.highway",
        elementType: "geometry.stroke",
        stylers: [{
            visibility: "off"
        }]
    }, {
        featureType: "road.arterial",
        elementType: "geometry.fill",
        stylers: [{
            color: "#ffffff"
        }]
    }, {
        featureType: "road.arterial",
        elementType: "geometry.stroke",
        stylers: [{
            visibility: "off"
        }]
    }, {
        featureType: "road.local",
        elementType: "geometry.fill",
        stylers: [{
            color: "#fbfbfb"
        }]
    }, {
        featureType: "road.local",
        elementType: "geometry.stroke",
        stylers: [{
            visibility: "off"
        }]
    }, {
        featureType: "transit",
        elementType: "all",
        stylers: [{
            visibility: "off"
        }]
    }, {
        featureType: "water",
        elementType: "all",
        stylers: [{
            color: "#91faf4"
        }]
    }],
    l = {
        zoom: e,
        center: t,
        styles: o,
        draggable: !1,
        scrollwheel: !1
    },
    r = new google.maps.Map(document.getElementById("map"),l),
    i = new google.maps.Marker({
        position: s,
        map: r,
        icon: "assets/images/build/marker.png"
    })
}


!function(e) {
    e(document).ready(function() {
        function t() {
            var t = e(".s-header_wrapper");
            window.innerWidth < 768 ? t.addClass("is_mobile") : e(window).scrollTop() > 600 ? t.addClass("is_mobile") : (t.removeClass("is_mobile").removeClass("toggled"),
            e("body").removeClass("locked"))
        }
        function o() {
            window.innerWidth < 768 && e(".filter").attachDragger()
        }
        function l() {
            e(".work-detail").each(function() {
                var t = e(this);
                if (window.innerWidth < 768)
                    var o = t.find(".left")
                      , l = t.find(".right #text");
                else
                    var o = t.find(".left")
                      , l = t.find(".right");
                o.insertBefore(l)
            })
        }
        e.fn.attachDragger = function() {
            var t, o, l, r = !1;
            e(e(this).selector).on("mousedown mouseup mousemove", function(i) {
                "mousedown" == i.type && (r = !0,
                t = [i.clientX, i.clientY]),
                "mouseup" == i.type && (r = !1),
                "mousemove" == i.type && 1 == r && (o = [i.clientX, i.clientY],
                l = [o[0] - t[0], o[1] - t[1]],
                e(this).scrollLeft(e(this).scrollLeft() - l[0]),
                e(this).scrollTop(e(this).scrollTop() - l[1]),
                t = [i.clientX, i.clientY])
            }),
            e(window).on("mouseup", function() {
                r = !1
            })
        }
        ;
        new CanvasVideoPlayer({
            videoSelector: ".video",
            canvasSelector: ".canvas",
            timelineSelector: !1,
            autoplay: !0,
            makeLoop: !0,
            pauseOnClick: !1,
            audio: !1
        });
        setTimeout(function() {
            AOS.init({
                duration: 800
            })
        }, 2e3),
        e(".nav-item, .nav-item a").on("click", function() {
            e(".s-header_wrapper").removeClass("toggled"),
            e("body").removeClass("locked")
        }),
        t(),
        e(".menu-toggle").on("click", function(t) {
            t.preventDefault(),
            e(".is_mobile").toggleClass("toggled"),
            e("body").toggleClass("locked")
        }),
        e(".foreword-slick").slick({
            dots: !1,
            speed: 600,
            slidesToShow: 1,
            slideToScroll: 1,
            adaptiveHeight: !0,
            infinite: !1,
            prevArrow: '<div class="foreward-prev"><div class="dir">Prev</div><div class="text">     </div></div>',
            nextArrow: '<div class="foreward-next"><div class="dir">Next</div><div class="text">     </div></div>'
        }),
        e(".foreword-slick .arrow").each(function() {
            var t = e(this);
            t.on("click", function(o) {
                o.preventDefault(),
                t.prev(".text").toggleClass("open").promise().done(function() {
                    setTimeout(function() {
                        if (window.innerWidth > 768)
                            var o = t.parents(".right").outerHeight();
                        else
                            var o = t.parents(".item").outerHeight();
                        e(".foreword-slick .slick-list").height(o)
                    }, 444)
                }),
                t.toggleClass("open")
            })
        }),
        e(".filter").scrollbar(),
        o();
        for (var r = e(".work-item"), i = 0; i < r.length; i++) {
            var s = Math.floor(Math.random() * r.length - 1) + 1
              , a = Math.floor(Math.random() * r.length - 1) + 1;
            r.eq(s).before(r.eq(a))
        }
        var n = e(".work").isotope({
            itemSelector: ".work-item",
            percentPosition: !0,
            layoutMode: "fitRows",
            fitRows: {
                columnWidth: ".item-sizer",
                gutter: ".gutter-sizer"
            }
        });
        e(".filter").on("click", ".filter-nav", function() {
            var t = e(this)
              , o = t.attr("data-filter");
            e(".filter-nav").removeClass("current"),
            t.addClass("current"),
            n.isotope({
                filter: o
            }),
            "*" != o ? e(".work-item").each(function() {
                var t = e(this);
                t.attr("data-fancybox", "group-" + t.attr("data-filter"))
            }) : e(".work-item").attr("data-fancybox", "group-all"),
            AOS.refresh()
        });
        var f = new Date
          , c = f.getDate();
        c < 15 && (c = 15);
        var d = "15"
          , p = c - d;
        e(".screening-nav").slick({
            dots: !1,
            arrows: !1,
            infinite: !1,
            initialSlide: p,
            speed: 600,
            slidesToShow: 4,
            slidesToScroll: 1,
            mobileFirst: !0,
            focusOnSelect: !0,
            adaptiveHeight: !0,
            asNavFor: ".screening-content-slick",
            responsive: [{
                breakpoint: 650,
                settings: {
                    slidesToShow: 5,
                    slidesToScroll: 1
                }
            }, {
                breakpoint: 768,
                settings: {
                    slidesToShow: 5,
                    slidesToScroll: 1,
                    arrows: !0
                }
            }, {
                breakpoint: 960,
                settings: {
                    slidesToShow: 7,
                    slidesToScroll: 1,
                    arrows: !0
                }
            }]
        }),
        e(".screening-content-slick").slick({
            dots: !1,
            speed: 600,
            slidesToShow: 1,
            slideToScroll: 1,
            infinite: !1,
            arrows: !1,
            swipe: !1,
            draggable: !1,
            fade: !0,
            adaptiveHeight: !0
        }),
        e(".screening.content.slick").on("afterChange", function(e) {
            AOS.refresh()
        }),
        l(),
        AOS.refresh(),
        e(window).resize(function() {
            t(),
            l(),
            o()
        }),
        e(window).scroll(function() {
            t()
        })
    })
}(jQuery);
//# sourceMappingURL=sourcemaps/main.js.map
