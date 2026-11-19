// node_modules/preact/dist/preact.module.js
var e, t, n, r, i, a, o, s, c, l, u, d, f, p, m, h = {}, g = [], _ = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i, v = Array.isArray;
function y(e, t) {
	for (var n in t) e[n] = t[n];
	return e;
}
function b(e) {
	e && e.parentNode && e.parentNode.removeChild(e);
}
function x(t, n, r) {
	var i, a, o, s = {};
	for (o in n) o == "key" ? i = n[o] : o == "ref" ? a = n[o] : s[o] = n[o];
	if (arguments.length > 2 && (s.children = arguments.length > 3 ? e.call(arguments, 2) : r), typeof t == "function" && t.defaultProps != null) for (o in t.defaultProps) s[o] === void 0 && (s[o] = t.defaultProps[o]);
	return S(t, s, i, a, null);
}
function S(e, r, i, a, o) {
	var s = {
		type: e,
		props: r,
		key: i,
		ref: a,
		__k: null,
		__: null,
		__b: 0,
		__e: null,
		__c: null,
		constructor: void 0,
		__v: o ?? ++n,
		__i: -1,
		__u: 0
	};
	return o == null && t.vnode != null && t.vnode(s), s;
}
function C(e) {
	return e.children;
}
function ee(e, t) {
	this.props = e, this.context = t;
}
function te(e, t) {
	if (t == null) return e.__ ? te(e.__, e.__i + 1) : null;
	for (var n; t < e.__k.length; t++) if ((n = e.__k[t]) != null && n.__e != null) return n.__e;
	return typeof e.type == "function" ? te(e) : null;
}
function ne(e) {
	if (e.__P && e.__d) {
		var n = e.__v, r = n.__e, i = [], a = [], o = y({}, n);
		o.__v = n.__v + 1, t.vnode && t.vnode(o), le(e.__P, o, n, e.__n, e.__P.namespaceURI, 32 & n.__u ? [r] : null, i, r ?? te(n), !!(32 & n.__u), a), o.__v = n.__v, o.__.__k[o.__i] = o, de(i, o, a), n.__e = n.__ = null, o.__e != r && w(o);
	}
}
function w(e) {
	if ((e = e.__) != null && e.__c != null) return e.__e = e.__c.base = null, e.__k.some(function(t) {
		if (t != null && t.__e != null) return e.__e = e.__c.base = t.__e;
	}), w(e);
}
function T(e) {
	(!e.__d && (e.__d = !0) && r.push(e) && !E.__r++ || i != t.debounceRendering) && ((i = t.debounceRendering) || a)(E);
}
function E() {
	try {
		for (var e, t = 1; r.length;) r.length > t && r.sort(o), e = r.shift(), t = r.length, ne(e);
	} finally {
		r.length = E.__r = 0;
	}
}
function re(e, t, n, r, i, a, o, s, c, l, u) {
	var d, f, p, m, _, v, y = r && r.__k || g, b = t.length;
	for (c = ie(n, t, y, c, b), d = 0; d < b; d++) (p = n.__k[d]) != null && (f = p.__i != -1 && y[p.__i] || h, p.__i = d, v = le(e, p, f, i, a, o, s, c, l, u), m = p.__e, p.ref && f.ref != p.ref && (f.ref && O(f.ref, null, p), u.push(p.ref, p.__c || m, p)), _ == null && m != null && (_ = m), 4 & p.__u ? (c = ae(p, c, e), f.__e && (f.__e = null)) : typeof p.type == "function" && v !== void 0 ? c = v : m && (c = m.nextSibling), p.__u &= -7);
	return n.__e = _, c;
}
function ie(e, t, n, r, i) {
	var a, o, s, c, l, u = n.length, d = u, f = 0;
	for (e.__k = Array(i), a = 0; a < i; a++) (o = t[a]) != null && typeof o != "boolean" && typeof o != "function" ? (typeof o == "string" || typeof o == "number" || typeof o == "bigint" || o.constructor == String ? o = e.__k[a] = S(null, o, null, null, null) : v(o) ? o = e.__k[a] = S(C, { children: o }, null, null, null) : o.constructor === void 0 && o.__b > 0 ? o = e.__k[a] = S(o.type, o.props, o.key, o.ref ? o.ref : null, o.__v) : e.__k[a] = o, c = a + f, o.__ = e, o.__b = e.__b + 1, s = null, (l = o.__i = oe(o, n, c, d)) != -1 && (d--, (s = n[l]) && (s.__u |= 2)), s == null || s.__v == null ? (l == -1 && (i > u ? f-- : i < u && f++), typeof o.type != "function" && (o.__u |= 4)) : l != c && (l == c - 1 ? f-- : l == c + 1 ? f++ : (l > c ? f-- : f++, o.__u |= 4))) : e.__k[a] = null;
	if (d) for (a = 0; a < u; a++) (s = n[a]) != null && !(2 & s.__u) && (s.__e == r && (r = te(s)), me(s, s));
	return r;
}
function ae(e, t, n) {
	var r, i;
	if (typeof e.type == "function") {
		for (r = e.__k, i = 0; r && i < r.length; i++) r[i] && (r[i].__ = e, t = ae(r[i], t, n));
		return t;
	}
	e.__e != t && (t && e.type && !t.parentNode && (t = te(e)), t = n.insertBefore(e.__e, t || null));
	do
		t &&= t.nextSibling;
	while (t != null && t.nodeType == 8);
	return t;
}
function oe(e, t, n, r) {
	var i, a, o, s = e.key, c = e.type, l = t[n], u = l != null && !(2 & l.__u);
	if (l === null && s == null || u && s == l.key && c == l.type) return n;
	if (r > +!!u) {
		for (i = n - 1, a = n + 1; i >= 0 || a < t.length;) if ((l = t[o = i >= 0 ? i-- : a++]) != null && !(2 & l.__u) && s == l.key && c == l.type) return o;
	}
	return -1;
}
function se(e, t, n) {
	t[0] == "-" ? e.setProperty(t, n ?? "") : e[t] = n == null ? "" : typeof n != "number" || _.test(t) ? n : n + "px";
}
function D(e, t, n, r, i) {
	var a, o;
	n: if (t == "style") {
		if (typeof n == "string") e.style.cssText = n;
		else {
			if (typeof r == "string" && (e.style.cssText = r = ""), r) for (t in r) n && t in n || se(e.style, t, "");
			if (n) for (t in n) r && n[t] == r[t] || se(e.style, t, n[t]);
		}
	} else if (t[0] == "o" && t[1] == "n") a = t != (t = t.replace(u, "$1")), o = t.toLowerCase(), t = o in e || t == "onFocusOut" || t == "onFocusIn" ? o.slice(2) : t.slice(2), e.l ||= {}, e.l[t + a] = n, n ? r ? n[l] = r[l] : (n[l] = d, e.addEventListener(t, a ? p : f, a)) : e.removeEventListener(t, a ? p : f, a);
	else {
		if (i == "http://www.w3.org/2000/svg") t = t.replace(/xlink(H|:h)/, "h").replace(/sName$/, "s");
		else if (t != "width" && t != "height" && t != "href" && t != "list" && t != "form" && t != "tabIndex" && t != "download" && t != "rowSpan" && t != "colSpan" && t != "role" && t != "popover" && t in e) try {
			e[t] = n ?? "";
			break n;
		} catch {}
		typeof n == "function" || (n == null || !1 === n && t[4] != "-" ? e.removeAttribute(t) : e.setAttribute(t, t == "popover" && n == 1 ? "" : n));
	}
}
function ce(e) {
	return function(n) {
		if (this.l) {
			var r = this.l[n.type + e];
			if (n[c] == null) n[c] = d++;
			else if (n[c] < r[l]) return;
			return r(t.event ? t.event(n) : n);
		}
	};
}
function le(e, n, r, i, a, o, s, c, l, u) {
	var d, f, p, m, h, _, x, S, ne, w, T, E, ie, ae, oe, se, D = n.type;
	if (n.constructor !== void 0) return null;
	128 & r.__u && (l = !!(32 & r.__u), o = [c = n.__e = r.__e]), (d = t.__b) && d(n);
	n: if (typeof D == "function") {
		f = s.length;
		try {
			if (ne = n.props, w = D.prototype && D.prototype.render, T = (d = D.contextType) && i[d.__c], E = d ? T ? T.props.value : d.__ : i, r.__c ? S = (p = n.__c = r.__c).__ = p.__E : (w ? n.__c = p = new D(ne, E) : (n.__c = p = new ee(ne, E), p.constructor = D, p.render = he), T && T.sub(p), p.state || (p.state = {}), p.__n = i, m = p.__d = !0, p.__h = [], p._sb = []), w && p.__s == null && (p.__s = p.state), w && D.getDerivedStateFromProps != null && (p.__s == p.state && (p.__s = y({}, p.__s)), y(p.__s, D.getDerivedStateFromProps(ne, p.__s))), h = p.props, _ = p.state, p.__v = n, m) w && D.getDerivedStateFromProps == null && p.componentWillMount != null && p.componentWillMount(), w && p.componentDidMount != null && p.__h.push(p.componentDidMount);
			else {
				if (w && D.getDerivedStateFromProps == null && ne !== h && p.componentWillReceiveProps != null && p.componentWillReceiveProps(ne, E), n.__v == r.__v || !p.__e && p.shouldComponentUpdate != null && !1 === p.shouldComponentUpdate(ne, p.__s, E)) {
					n.__v != r.__v && (p.props = ne, p.state = p.__s, p.__d = !1), n.__e = r.__e, n.__k = r.__k, n.__k.some(function(e) {
						e && (e.__ = n);
					}), g.push.apply(p.__h, p._sb), p._sb = [], p.__h.length && s.push(p), c = te(r);
					break n;
				}
				p.componentWillUpdate != null && p.componentWillUpdate(ne, p.__s, E), w && p.componentDidUpdate != null && p.__h.push(function() {
					p.componentDidUpdate(h, _, x);
				});
			}
			if (p.context = E, p.props = ne, p.__P = e, p.__e = !1, ie = t.__r, ae = 0, w) p.state = p.__s, p.__d = !1, ie && ie(n), d = p.render(p.props, p.state, p.context), g.push.apply(p.__h, p._sb), p._sb = [];
			else do
				p.__d = !1, ie && ie(n), d = p.render(p.props, p.state, p.context), p.state = p.__s;
			while (p.__d && ++ae < 25);
			p.state = p.__s, p.getChildContext != null && (i = y(y({}, i), p.getChildContext())), w && !m && p.getSnapshotBeforeUpdate != null && (x = p.getSnapshotBeforeUpdate(h, _)), oe = d != null && d.type === C && d.key == null ? fe(d.props.children) : d, c = re(e, v(oe) ? oe : [oe], n, r, i, a, o, s, c, l, u), p.base = n.__e, n.__u &= -161, p.__h.length && s.push(p), S && (p.__E = p.__ = null);
		} catch (e) {
			if (s.length = f, n.__v = null, l || o != null) {
				if (e.then) {
					for (n.__u |= l ? 160 : 128; c && c.nodeType == 8 && c.nextSibling;) c = c.nextSibling;
					o != null && (o[o.indexOf(c)] = null), n.__e = c;
				} else if (o != null) for (se = o.length; se--;) b(o[se]);
			} else n.__e = r.__e;
			n.__k ??= r.__k || [], e.then || ue(n), t.__e(e, n, r);
		}
	} else o == null && n.__v == r.__v ? (n.__k = r.__k, n.__e = r.__e) : c = n.__e = pe(r.__e, n, r, i, a, o, s, l, u);
	return (d = t.diffed) && d(n), 128 & n.__u ? void 0 : c;
}
function ue(e) {
	e && (e.__c && (e.__c.__e = !0), e.__k && e.__k.some(ue));
}
function de(e, n, r) {
	for (var i = 0; i < r.length; i++) O(r[i], r[++i], r[++i]);
	t.__c && t.__c(n, e), e.some(function(n) {
		try {
			e = n.__h, n.__h = [], e.some(function(e) {
				e.call(n);
			});
		} catch (e) {
			t.__e(e, n.__v);
		}
	});
}
function fe(e) {
	return typeof e != "object" || !e || e.__b > 0 ? e : v(e) ? e.map(fe) : e.constructor === void 0 ? y({}, e) : null;
}
function pe(n, r, i, a, o, s, c, l, u) {
	var d, f, p, m, g, _, y, x = i.props || h, S = r.props, C = r.type;
	if (C == "svg" ? o = "http://www.w3.org/2000/svg" : C == "math" ? o = "http://www.w3.org/1998/Math/MathML" : o ||= "http://www.w3.org/1999/xhtml", s != null) {
		for (d = 0; d < s.length; d++) if ((g = s[d]) && "setAttribute" in g == !!C && (C ? g.localName == C : g.nodeType == 3)) {
			n = g, s[d] = null;
			break;
		}
	}
	if (n == null) {
		if (C == null) return document.createTextNode(S);
		n = document.createElementNS(o, C, S.is && S), l &&= (t.__m && t.__m(r, s), !1), s = null;
	}
	if (C == null) x === S || l && n.data == S || (n.data = S);
	else {
		if (s = C == "textarea" && S.defaultValue != null ? null : s && e.call(n.childNodes), !l && s != null) for (x = {}, d = 0; d < n.attributes.length; d++) x[(g = n.attributes[d]).name] = g.value;
		for (d in x) g = x[d], d == "dangerouslySetInnerHTML" ? p = g : d == "children" || d in S || d == "value" && "defaultValue" in S || d == "checked" && "defaultChecked" in S || D(n, d, null, g, o);
		for (d in S) g = S[d], d == "children" ? m = g : d == "dangerouslySetInnerHTML" ? f = g : d == "value" ? _ = g : d == "checked" ? y = g : l && typeof g != "function" || x[d] === g || D(n, d, g, x[d], o);
		if (f) l || p && (f.__html == p.__html || f.__html == n.innerHTML) || (n.innerHTML = f.__html), r.__k = [];
		else if (p && (n.innerHTML = ""), re(r.type == "template" ? n.content : n, v(m) ? m : [m], r, i, a, C == "foreignObject" ? "http://www.w3.org/1999/xhtml" : o, s, c, s ? s[0] : i.__k && te(i, 0), l, u), s != null) for (d = s.length; d--;) b(s[d]);
		l && C != "textarea" || (d = "value", C == "progress" && _ == null ? n.removeAttribute("value") : _ != null && (_ !== n[d] || C == "progress" && !_ || C == "option" && _ != x[d]) && D(n, d, _, x[d], o), d = "checked", y != null && y != n[d] && D(n, d, y, x[d], o));
	}
	return n;
}
function O(e, n, r) {
	try {
		if (typeof e == "function") {
			var i = typeof e.__u == "function";
			i && e.__u(), i && n == null || (e.__u = e(n));
		} else e.current = n;
	} catch (e) {
		t.__e(e, r);
	}
}
function me(e, n, r) {
	var i, a;
	if (t.unmount && t.unmount(e), (i = e.ref) && (i.current && i.current != e.__e || O(i, null, n)), (i = e.__c) != null) {
		if (i.componentWillUnmount) try {
			i.componentWillUnmount();
		} catch (e) {
			t.__e(e, n);
		}
		i.base = i.__P = i.__n = null;
	}
	if (i = e.__k) for (a = 0; a < i.length; a++) i[a] && me(i[a], n, r || typeof e.type != "function");
	r || b(e.__e), e.__c = e.__ = e.__e = void 0;
}
function he(e, t, n) {
	return this.constructor(e, n);
}
function ge(n, r, i) {
	var a, o, s, c;
	r == document && (r = document.documentElement), t.__ && t.__(n, r), o = (a = typeof i == "function") ? null : i && i.__k || r.__k, s = [], c = [], le(r, n = (!a && i || r).__k = x(C, null, [n]), o || h, h, r.namespaceURI, !a && i ? [i] : o ? null : r.firstChild ? e.call(r.childNodes) : null, s, !a && i ? i : o ? o.__e : r.firstChild, a, c), de(s, n, c), n.props.children = null;
}
function _e(e) {
	function t(e) {
		var n, r;
		return this.getChildContext || (n = /* @__PURE__ */ new Set(), (r = {})[t.__c] = this, this.getChildContext = function() {
			return r;
		}, this.componentWillUnmount = function() {
			n = null;
		}, this.shouldComponentUpdate = function(e) {
			this.props.value != e.value && n.forEach(function(e) {
				e.__e = !0, T(e);
			});
		}, this.sub = function(e) {
			n.add(e);
			var t = e.componentWillUnmount;
			e.componentWillUnmount = function() {
				n && n.delete(e), t && t.call(e);
			};
		}), e.children;
	}
	return t.__c = "__cC" + m++, t.__ = e, t.Provider = t.__l = (t.Consumer = function(e, t) {
		return e.children(t);
	}).contextType = t, t;
}
e = g.slice, t = { __e: function(e, t, n, r) {
	for (var i, a, o; t = t.__;) if ((i = t.__c) && !i.__) try {
		if ((a = i.constructor) && a.getDerivedStateFromError != null && (i.setState(a.getDerivedStateFromError(e)), o = i.__d), i.componentDidCatch != null && (i.componentDidCatch(e, r || {}), o = i.__d), o) return i.__E = i;
	} catch (t) {
		e = t;
	}
	throw e;
} }, n = 0, ee.prototype.setState = function(e, t) {
	var n = this.__s != null && this.__s != this.state ? this.__s : this.__s = y({}, this.state);
	typeof e == "function" && (e = e(y({}, n), this.props)), e && y(n, e), e != null && this.__v && (t && this._sb.push(t), T(this));
}, ee.prototype.forceUpdate = function(e) {
	this.__v && (this.__e = !0, e && this.__h.push(e), T(this));
}, ee.prototype.render = C, r = [], a = typeof Promise == "function" ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout, o = function(e, t) {
	return e.__v.__b - t.__v.__b;
}, E.__r = 0, s = Math.random().toString(8), c = "__d" + s, l = "__a" + s, u = /(PointerCapture)$|Capture$/i, d = 0, f = ce(!1), p = ce(!0), m = 0;
// node_modules/preact/hooks/dist/hooks.module.js
var ve, k, ye, be, xe = 0, A = [], j = t, M = j.__b, Se = j.__r, Ce = j.diffed, we = j.__c, Te = j.unmount, Ee = j.__;
function De(e, t) {
	j.__h && j.__h(k, e, xe || t), xe = 0;
	var n = k.__H || (k.__H = {
		__: [],
		__h: []
	});
	return e >= n.__.length && n.__.push({}), n.__[e];
}
function N(e) {
	return xe = 1, Oe(Re, e);
}
function Oe(e, t, n) {
	var r = De(ve++, 2);
	if (r.t = e, !r.__c && (r.__ = [n ? n(t) : Re(void 0, t), function(e) {
		var t = r.__N ? r.__N[0] : r.__[0], n = r.t(t, e);
		t !== n && (r.__N = [n, r.__[1]], r.__c.setState({}));
	}], r.__c = k, !k.__f)) {
		var i = function(e, t, n) {
			if (!r.__c.__H) return !0;
			var i = !1, o = r.__c.props !== e;
			if (r.__c.__H.__.some(function(e) {
				if (e.__N) {
					i = !0;
					var t = e.__[0];
					e.__ = e.__N, e.__N = void 0, t !== e.__[0] && (o = !0);
				}
			}), a) {
				var s = a.call(this, e, t, n);
				return i ? s || o : s;
			}
			return !i || o;
		};
		k.__f = !0;
		var a = k.shouldComponentUpdate, o = k.componentWillUpdate;
		k.componentWillUpdate = function(e, t, n) {
			if (this.__e) {
				var r = a;
				a = void 0, i(e, t, n), a = r;
			}
			o && o.call(this, e, t, n);
		}, k.shouldComponentUpdate = i;
	}
	return r.__N || r.__;
}
function P(e, t) {
	var n = De(ve++, 3);
	!j.__s && Le(n.__H, t) && (n.__ = e, n.u = t, k.__H.__h.push(n));
}
function ke(e, t) {
	var n = De(ve++, 4);
	!j.__s && Le(n.__H, t) && (n.__ = e, n.u = t, k.__h.push(n));
}
function F(e) {
	return xe = 5, Ae(function() {
		return { current: e };
	}, []);
}
function Ae(e, t) {
	var n = De(ve++, 7);
	return Le(n.__H, t) && (n.__ = e(), n.__H = t, n.__h = e), n.__;
}
function je(e) {
	var t = k.context[e.__c], n = De(ve++, 9);
	return n.c = e, t ? (n.__ ?? (n.__ = !0, t.sub(k)), t.props.value) : e.__;
}
function Me() {
	for (var e; e = A.shift();) {
		var t = e.__H;
		if (e.__P && t) try {
			t.__h.some(Fe), t.__h.some(Ie), t.__h = [];
		} catch (n) {
			t.__h = [], j.__e(n, e.__v);
		}
	}
}
j.__b = function(e) {
	k = null, M && M(e);
}, j.__ = function(e, t) {
	e && t.__k && t.__k.__m && (e.__m = t.__k.__m), Ee && Ee(e, t);
}, j.__r = function(e) {
	Se && Se(e), ve = 0;
	var t = (k = e.__c).__H;
	t && (ye === k ? (t.__h = [], k.__h = [], t.__.some(function(e) {
		e.__N && (e.__ = e.__N), e.u = e.__N = void 0;
	})) : (t.__h.some(Fe), t.__h.some(Ie), t.__h = [], ve = 0)), ye = k;
}, j.diffed = function(e) {
	Ce && Ce(e);
	var t = e.__c;
	t && t.__H && (t.__H.__h.length && (A.push(t) !== 1 && be === j.requestAnimationFrame || ((be = j.requestAnimationFrame) || Pe)(Me)), t.__H.__.some(function(e) {
		e.u &&= (e.__H = e.u, void 0);
	})), ye = k = null;
}, j.__c = function(e, t) {
	t.some(function(e) {
		try {
			e.__h.some(Fe), e.__h = e.__h.filter(function(e) {
				return !e.__ || Ie(e);
			});
		} catch (n) {
			t.some(function(e) {
				e.__h &&= [];
			}), t = [], j.__e(n, e.__v);
		}
	}), we && we(e, t);
}, j.unmount = function(e) {
	Te && Te(e);
	var t, n = e.__c;
	n && n.__H && (n.__H.__.some(function(e) {
		try {
			Fe(e);
		} catch (e) {
			t = e;
		}
	}), n.__H = void 0, t && j.__e(t, n.__v));
};
var Ne = typeof requestAnimationFrame == "function";
function Pe(e) {
	var t, n = function() {
		clearTimeout(r), Ne && cancelAnimationFrame(t), setTimeout(e);
	}, r = setTimeout(n, 35);
	Ne && (t = requestAnimationFrame(n));
}
function Fe(e) {
	var t = k, n = e.__c;
	typeof n == "function" && (e.__c = void 0, n()), k = t;
}
function Ie(e) {
	var t = k;
	e.__c = e.__(), k = t;
}
function Le(e, t) {
	return !e || e.length !== t.length || t.some(function(t, n) {
		return t !== e[n];
	});
}
function Re(e, t) {
	return typeof t == "function" ? t(e) : t;
}
// ui/i18n.ts
var ze = {
	"common.back": "‹ Back",
	"common.cancel": "Cancel",
	"common.save": "Save",
	"common.moreActions": "More actions",
	"common.showAll": "Show all ({n})",
	"common.details": "Details",
	"common.output": "Output",
	"common.loading": "Loading…",
	"common.justNow": "just now",
	"status.running": "Running",
	"status.waiting_manual": "Needs you",
	"status.success": "Done",
	"status.failure": "Failed",
	"status.stopped": "Stopped",
	"status.never": "Never run",
	"stepType.navigate": "Navigate",
	"stepType.delay": "Delay",
	"stepType.executeXpathCommand": "Element action",
	"stepType.javascript": "JavaScript",
	"stepType.extractData": "Extract data",
	"stepType.if": "If",
	"stepType.switch": "Switch",
	"stepType.manual": "Manual step",
	"stepType.download": "Download file",
	"ask.button": "Ask {ai}",
	"ask.fix": "Fix with {ai}",
	"ask.sent": "Sent to {ai}. Its proposal will appear in the chat.",
	"ask.again": "Ask again",
	"ask.phEdit": "What should change in this step?",
	"ask.phFailed": "Optional: what did you expect?",
	"ask.wfTitle": "Change this workflow",
	"ask.phWorkflow": "What should it do differently?",
	"ask.draftTitle": "Change this draft",
	"ask.phDraft": "What should change before saving?",
	"ask.runTitle": "About this run",
	"ask.phRun": "What is wrong or missing?",
	"sug.stableSelector": "Use a more stable selector",
	"sug.waitFirst": "Wait for the element first",
	"sug.waitLonger": "Wait longer",
	"sug.alsoLink": "Also extract the link",
	"sug.skipEmpty": "Skip empty items",
	"sug.otherUrl": "Use a different URL",
	"sug.waitElement": "Wait for an element instead",
	"sug.explainJs": "Explain what this does",
	"sug.explainIf": "Explain this condition",
	"sug.explainSwitch": "Explain these branches",
	"sug.automate": "Try to automate this step",
	"sug.fileName": "Change the file name",
	"sug.otherFile": "Save a different file",
	"sug.rowsMissing": "Some items are missing",
	"sug.addField": "Add a field",
	"sug.wrongThing": "This did the wrong thing",
	"msg.editStep": "Change step \"{stepId}\" of workflow {id}: {text}",
	"msg.editWorkflow": "Change workflow {id}: {text}",
	"msg.editDraft": "Change the draft workflow: {text}",
	"msg.aboutRun": "About run {runId}: {text}",
	"msg.stepOk": "About step \"{stepId}\" in run {runId}: {text}",
	"msg.stepFailed": "Fix step \"{stepId}\" in run {runId}. {text}",
	"msg.fixRun": "Fix the failed run {runId}.",
	"msg.importFix": "Fix the workflow file \"{file}\" that failed to import.",
	"msg.describe": "Create a browser workflow: {text}",
	"msg.setupDone": "Setup is done.",
	"lib.title": "Workflows",
	"lib.saved": "{n} saved",
	"lib.matching": "Matching “{q}”",
	"lib.empty": "No workflows yet. Import a file or describe one in chat.",
	"lib.filter": "Filter",
	"lib.noMatch": "No match.",
	"lib.import": "Import workflow",
	"lib.tooBig": "File is larger than 2 MB.",
	"lib.neverRun": "never run",
	"lib.example": "Example",
	"lib.steps": "{n} {n|step|steps}",
	"wf.stepsTab": "Steps ({n})",
	"wf.runsTab": "Runs",
	"wf.run": "Run",
	"wf.export": "Export file",
	"wf.history": "Version history",
	"wf.hostFromInputs": "URL from inputs",
	"wf.saved": "Saved · v{v}",
	"wf.restored": "Restored v{from} as v{v}",
	"wf.discarded": "Change discarded · still v{v}",
	"imp.title": "Import “{name}”",
	"imp.cantTitle": "Can’t import this file",
	"imp.site": "Site",
	"imp.steps": "Steps",
	"imp.allValid": "{n} · all valid",
	"imp.asksFor": "Asks for",
	"imp.exists": "“{id}” already exists (v{v}). Saving adds it as v{next}.",
	"imp.save": "Save workflow",
	"imp.cancelled": "Import cancelled.",
	"imp.more": "+{n} more",
	"imp.err.invalid_json": "Not valid JSON",
	"imp.err.not_object": "Expected a workflow object",
	"imp.err.missing_field": "Required field is missing",
	"imp.err.empty_steps": "Needs at least one step",
	"imp.err.missing_id": "Step has no id",
	"imp.err.bad_type": "Unknown step type “{arg}”",
	"imp.err.missing_ref": "Points to a missing step “{arg}”",
	"imp.err.duplicate_id": "Step id “{arg}” is used twice",
	"imp.err.invalid": "Invalid value: {arg}",
	"draft.sub": "New workflow · {host} · {n} {n|step|steps}",
	"draft.inputs": "Inputs:",
	"draft.name": "Name",
	"draft.save": "Save",
	"draft.testRun": "Test run",
	"draft.testAgain": "Test again",
	"draft.startTest": "Start test",
	"draft.testing": "Test · not saved",
	"draft.saveHint": "Not saved yet. Save it whenever the run looks right.",
	"setupRun.title": "Run {name}",
	"setupRun.sub": "v{v} · {n} {n|step|steps}",
	"setupRun.optional": "(optional)",
	"setupRun.more": "More options ({n})",
	"setupRun.required": "Required",
	"setupRun.start": "Start run",
	"run.progress": "{done} / {total} steps",
	"run.testing": "testing change",
	"run.testStop": "test stop",
	"run.manual": "{instruction} in the Browser Workflow tab in Chrome, then press Resume.",
	"run.resume": "Resume",
	"run.stop": "Stop",
	"run.stopRun": "Stop run",
	"run.done": "Done · {n} {n|step|steps}",
	"run.items": "{n} {n|item|items} extracted",
	"run.changeWorks": "Change works up to step {n}",
	"run.runFull": "Run full workflow",
	"run.runAgain": "Run again",
	"run.viewData": "View data",
	"run.stoppedAt": "Stopped at step {n}",
	"run.earlier": "{n} earlier {n|step|steps}",
	"run.steps": "Steps ({n})",
	"fail.title": "Failed at step {n} of {total}",
	"fail.url": "URL",
	"fail.error": "Error",
	"fail.console": "Console",
	"fail.noErrors": "No errors",
	"fail.sent": "Sent to {ai}. The proposed fix will appear in the chat.",
	"fail.inspecting": "{ai} is looking at this failure. The proposed fix will appear below.",
	"fail.expand": "Expand screenshot",
	"fail.collapse": "Collapse screenshot",
	"fail.shotAlt": "Page when step {n} failed",
	"err.notFound": "Element not found: {target} (waited {s}s)",
	"err.timeout": "Timed out after {s}s",
	"err.runLimit": "The run passed its {m}-minute limit and was stopped.",
	"chg.fixTitle": "Proposed fix",
	"chg.changeTitle": "Proposed change",
	"chg.update": "changed",
	"chg.add": "new",
	"chg.remove": "removed",
	"chg.discard": "Discard",
	"chg.apply": "Apply & test",
	"chg.discardedFix": "Fix discarded. {name} stays on v{v}.",
	"chg.discardedChange": "Change discarded. {name} stays on v{v}.",
	"chg.before": "Before",
	"chg.after": "After",
	"data.items": "{n} {n|item|items}",
	"data.extraCols": "+{n} columns in the download",
	"data.csv": "Download CSV",
	"data.json": "JSON",
	"hist.title": "Version history",
	"hist.current": "Current",
	"hist.restore": "Restore v{v}",
	"hist.onlyOne": "Only one version so far. Changes add new versions.",
	"hist.who.you": "You",
	"hist.who.claude": "AI",
	"hist.who.import": "Import",
	"hist.ev.initial": "First version",
	"hist.ev.create": "Created by AI",
	"hist.ev.import": "Imported from {file}",
	"hist.ev.importNoFile": "Imported",
	"hist.ev.update": "Changed “{name}”",
	"hist.ev.add": "Added “{name}”",
	"hist.ev.remove": "Removed “{name}”",
	"hist.ev.more": " and {n} more",
	"hist.ev.restore": "Restored v{from}",
	"br.seePlans": "See plans",
	"acct.title": "Account",
	"acct.free": "Free",
	"acct.pro": "Pro",
	"acct.until": "Pro until {date}",
	"acct.runs.day": "Runs today",
	"acct.runs.month": "Runs this month",
	"acct.runs.year": "Runs this year",
	"acct.steps.day": "Steps run today",
	"acct.steps.month": "Steps run this month",
	"acct.steps.year": "Steps run this year",
	"acct.anonymous": "No account yet",
	"acct.createTitle": "Create a free account",
	"acct.createHint": "Pick a username and password, so you can log in again later and upgrade. Everything you’ve made stays in Chrome.",
	"acct.create": "Create account",
	"acct.trying": "You are trying it without an account",
	"acct.tryingHint": "Create a free account to keep your workflows and run more each day.",
	"acct.createOrLogin": "Create account or log in",
	"acct.details": "Account details",
	"acct.planFree": "Free plan",
	"acct.planLife": "Pro, for life",
	"acct.createOpened": "The page opened in your browser. Come back here when you’re done.",
	"acct.createAgain": "Open the page again",
	"need.runs": "You’ve used today’s runs. Create a free account to keep going; your workflows and runs stay with it.",
	"need.steps": "You’ve used today’s steps. Create a free account to keep going; your workflows and runs stay with it.",
	"need.workflows": "You’ve saved all the workflows you can before signing up. Create a free account to save more; nothing is lost.",
	"need.continue": "Continue",
	"need.message": "I created my account. Please try that again.",
	"acct.workflows": "Workflows",
	"acct.storedIn": "Data stored in",
	"acct.storage.computer": "In Chrome, on this computer",
	"acct.storage.computerNote": "Workflows, runs and results stay in Chrome, in Browser Workflow. Only your plan and how many runs you made are kept with your account.",
	"acct.keepRuns": "The last {n} runs of each workflow are kept",
	"acct.localUsed": "{mb} MB in {n} runs now",
	"acct.localWarn": "Saved runs are taking a lot of space on your computer. Nothing is deleted automatically: delete workflows you no longer need to free space.",
	"acct.upgrade": "Upgrade",
	"acct.limitUpgrade": "Upgrade to Pro to keep going.",
	"acct.tryAgain": "Try again",
	"acct.manage": "Manage plan",
	"acct.copy": "Copy",
	"acct.copied": "Copied",
	"acct.retention": "Runs are kept {n} days",
	"lang.label": "Language",
	"lang.auto": "Auto",
	"lang.en": "English",
	"lang.vi": "Tiếng Việt",
	"runs.title": "Runs",
	"runs.none": "No runs yet.",
	"runs.done": "Done · {n} {n|step|steps}",
	"runs.failedAt": "Failed at step {n} · {name}",
	"runs.stoppedAt": "Stopped at step {n}",
	"runs.waiting": "Waiting for you",
	"runs.runningAt": "Running step {n}",
	"runs.testPassed": "Test passed up to step {n}",
	"runs.test": "test",
	"sr.notReached": "Not reached",
	"sr.skipped": "Skipped",
	"sr.waiting": "Waiting",
	"sr.running": "Running",
	"sr.didntRun": "This step didn’t run.",
	"sr.stepId": "Step id",
	"sr.alt": "Page after step {n}",
	"sr.requests": "Network requests ({n})",
	"error.expired": "This proposal has expired. Ask {ai} to prepare it again.",
	"error.not_found": "Not found. It may have been deleted.",
	"error.limit_runs_day": "You’ve used all {arg} runs of your plan for today. The count starts again at 00:00 UTC.",
	"error.limit_runs_year": "You’ve used all {arg} runs of your plan for this year.",
	"error.limit_steps_day": "Your runs have gone through all {arg} steps of your plan for today. The count starts again at 00:00 UTC.",
	"error.limit_steps_year": "Your runs have gone through all {arg} steps of your plan for this year.",
	"error.limit_workflows": "Your plan allows {arg} saved workflows. Delete one, or upgrade.",
	"error.limit_steps": "Your plan runs workflows of {arg} steps at most. Make this one shorter, or upgrade.",
	"setup.title": "Set up Browser Workflow",
	"setup.stepOf": "Step {n} of {total}",
	"setup.continue": "Continue",
	"setup.firstTitle": "Add your first workflow",
	"setup.importFile": "Import a file",
	"setup.importHint": "A workflow .json shared with you or exported from Browser Workflow",
	"setup.example": "Try an example",
	"setup.exampleHint": "Pick one of the sample workflows and run it",
	"setup.describe": "Describe one",
	"setup.describeHint": "Tell {ai} what to automate",
	"setup.describePh": "e.g. List today’s trending GitHub repos",
	"setup.finish": "Finish",
	"setup.ready": "You’re set up.",
	"setup.extTitle": "Add Browser Workflow to Chrome",
	"setup.extNote": "Workflows run in your own Chrome, in a tab group of their own, so you can keep using Chrome meanwhile.",
	"setup.extOpen": "Open Chrome. If Browser Workflow isn’t in Chrome yet, add it from the Chrome Web Store, then check again.",
	"setup.extGet": "Add to Chrome",
	"setup.extCheck": "Check again",
	"setup.extOk": "Browser Workflow is ready in Chrome.",
	"error.not_running": "Open Chrome to continue: Browser Workflow runs there.",
	"dl.saving": "Saving {name}…",
	"dl.saved": "Saved {name}",
	"dl.show": "Show in folder",
	"dl.gone": "This file is no longer in your Downloads folder.",
	"panel.waiting": "Waiting for your approval",
	"panel.waitingSub": "{n|proposal|proposals} from {ai}",
	"panel.review": "Review",
	"panel.home": "Home",
	"panel.run": "Run",
	"panel.sent": "Sent to {ai}. Switch to {ai} to see it.",
	"panel.noAi": "Open {ai} and ask it to fix this workflow. Copy this and paste it in the chat:",
	"panel.copy": "Copy",
	"panel.copied": "Copied",
	"panel.empty": "No workflows yet. Ask {ai} to make one: describe what to do on a website.",
	"acct.login": "Log in",
	"acct.loginHint": "Already have an account? Log in to it.",
	"acct.logout": "Log out",
	"acct.offline": "Your account could not be reached just now: the plan you last had is shown.",
	"acct.createDone": "I created it",
	"panel.account": "Account",
	"chat.prompt": "Use Browser Workflow with me from its side panel in Chrome. Call wait_for_user to listen for my messages there. Do what each message asks, put your short answer to me in reply on your next wait_for_user call, and keep listening until I say stop.",
	"chat.noneTitle": "Claude isn’t connected",
	"chat.noneSub": "Open Claude to build workflows, fix them and talk to it from here.",
	"chat.idleTitle": "Claude stopped listening",
	"chat.use": "Use with Claude",
	"chat.useCode": "Use Claude Code instead",
	"chat.copyPrompt": "Copy the prompt",
	"chat.copied": "Copied",
	"chat.openChat": "Open the chat",
	"chat.waitingTitle": "Waiting for Claude…",
	"chat.step1": "Claude opened with a message ready.",
	"chat.step2a": "Press ",
	"chat.step2b": "Send",
	"chat.step2c": " in Claude.",
	"chat.step3": "This panel connects by itself.",
	"chat.warnNote": "Claude may warn you before sending a prompt from a link: that’s normal. If Claude asks to allow Browser Workflow, choose Always allow.",
	"chat.nothingOpened": "Nothing opened? Copy the prompt and paste it into Claude.",
	"chat.openAgain": "Open Claude again",
	"chat.liveListening": "Claude is listening",
	"chat.liveWorking": "Claude is working",
	"chat.liveConnected": "Claude is connected",
	"chat.chat": "Chat",
	"chat.title": "Claude",
	"chat.pillListening": "Listening",
	"chat.pillWorking": "Working",
	"chat.pillConnected": "Connected",
	"chat.pillOff": "Not listening",
	"chat.you": "You",
	"chat.claude": "Claude",
	"chat.empty": "Write to Claude here: ask it to make a workflow, run one or fix one. Type @ to name a workflow, a run or a tab.",
	"chat.working": "Claude is working… ({s} s)",
	"chat.queued": "Waits until Claude is done with the first one",
	"chat.ph": "Write to Claude…  (@ to mention)",
	"chat.phOff": "Claude isn’t listening",
	"chat.send": "Send",
	"chat.mention": "Mention",
	"chat.stoppedTitle": "Claude stopped listening",
	"chat.stoppedSub": "If you stopped it in Claude, ask it there to listen again, or start a new chat.",
	"chat.notDelivered": "Claude didn’t get this: no Claude is connected. Use with Claude first.",
	"chat.pickWorkflows": "Workflows",
	"chat.pickRuns": "Runs",
	"chat.pickTabs": "Open tabs",
	"chat.pickNone": "Nothing matches",
	"chat.cardWaiting": "Waiting for your approval",
	"chat.cardSaved": "You saved “{name}”",
	"chat.cardApplied": "You applied the change to “{name}”",
	"chat.cardDiscarded": "You discarded the proposal for “{name}”",
	"chat.cardExpired": "The proposal for “{name}” expired",
	"chat.cardRunOk": "“{name}” finished",
	"chat.cardRunOkItems": "“{name}” finished · {n} {n|item|items}",
	"chat.cardRunFailed": "“{name}” failed",
	"chat.cardRunStopped": "“{name}” was stopped",
	"chat.cardRunOther": "“{name}”: {status}",
	"chat.openView": "Open",
	"shown.line": "Shown in the side panel",
	"shown.showHere": "Show here",
	"md.preview": "Preview",
	"md.code": "Code",
	"md.openTab": "Open in a tab",
	"md.copy": "Copy",
	"md.copied": "Copied"
}, Be = {
	en: ze,
	vi: {
		"common.back": "‹ Quay lại",
		"common.cancel": "Huỷ",
		"common.save": "Lưu",
		"common.moreActions": "Thao tác khác",
		"common.showAll": "Xem tất cả ({n})",
		"common.details": "Chi tiết",
		"common.output": "Kết quả",
		"common.loading": "Đang tải…",
		"common.justNow": "vừa xong",
		"status.running": "Đang chạy",
		"status.waiting_manual": "Cần bạn",
		"status.success": "Xong",
		"status.failure": "Lỗi",
		"status.stopped": "Đã dừng",
		"status.never": "Chưa chạy",
		"stepType.navigate": "Mở trang",
		"stepType.delay": "Chờ",
		"stepType.executeXpathCommand": "Thao tác phần tử",
		"stepType.javascript": "JavaScript",
		"stepType.extractData": "Trích xuất dữ liệu",
		"stepType.if": "Điều kiện",
		"stepType.switch": "Rẽ nhánh",
		"stepType.manual": "Bước thủ công",
		"stepType.download": "Tải tệp",
		"ask.button": "Hỏi {ai}",
		"ask.fix": "Nhờ {ai} sửa",
		"ask.sent": "Đã gửi cho {ai}. Đề xuất sẽ hiện trong cuộc trò chuyện.",
		"ask.again": "Hỏi lại",
		"ask.phEdit": "Bước này cần thay đổi gì?",
		"ask.phFailed": "Không bắt buộc: bạn mong đợi điều gì?",
		"ask.wfTitle": "Thay đổi workflow này",
		"ask.phWorkflow": "Cần làm khác đi thế nào?",
		"ask.draftTitle": "Thay đổi bản nháp này",
		"ask.phDraft": "Cần thay đổi gì trước khi lưu?",
		"ask.runTitle": "Về lần chạy này",
		"ask.phRun": "Sai hoặc thiếu gì?",
		"sug.stableSelector": "Dùng selector ổn định hơn",
		"sug.waitFirst": "Chờ phần tử xuất hiện trước",
		"sug.waitLonger": "Chờ lâu hơn",
		"sug.alsoLink": "Lấy thêm đường dẫn",
		"sug.skipEmpty": "Bỏ qua mục trống",
		"sug.otherUrl": "Dùng URL khác",
		"sug.waitElement": "Chờ phần tử thay vì chờ cố định",
		"sug.explainJs": "Giải thích đoạn này làm gì",
		"sug.explainIf": "Giải thích điều kiện này",
		"sug.explainSwitch": "Giải thích các nhánh",
		"sug.automate": "Thử tự động hoá bước này",
		"sug.fileName": "Đổi tên tệp",
		"sug.otherFile": "Lưu một tệp khác",
		"sug.rowsMissing": "Bị thiếu một số mục",
		"sug.addField": "Thêm một trường",
		"sug.wrongThing": "Bước này làm sai",
		"msg.editStep": "Sửa bước \"{stepId}\" của workflow {id}: {text}",
		"msg.editWorkflow": "Sửa workflow {id}: {text}",
		"msg.editDraft": "Sửa bản nháp workflow: {text}",
		"msg.aboutRun": "Về lần chạy {runId}: {text}",
		"msg.stepOk": "Về bước \"{stepId}\" trong lần chạy {runId}: {text}",
		"msg.stepFailed": "Sửa bước \"{stepId}\" trong lần chạy {runId}. {text}",
		"msg.fixRun": "Sửa lần chạy bị lỗi {runId}.",
		"msg.importFix": "Sửa tệp workflow \"{file}\" bị lỗi khi nhập.",
		"msg.describe": "Tạo một workflow trình duyệt: {text}",
		"msg.setupDone": "Tôi đã thiết lập xong.",
		"lib.title": "Workflow",
		"lib.saved": "Đã lưu {n}",
		"lib.matching": "Khớp với “{q}”",
		"lib.empty": "Chưa có workflow nào. Hãy nhập tệp hoặc mô tả trong cuộc trò chuyện.",
		"lib.filter": "Lọc",
		"lib.noMatch": "Không có kết quả.",
		"lib.import": "Nhập workflow",
		"lib.tooBig": "Tệp lớn hơn 2 MB.",
		"lib.neverRun": "chưa chạy",
		"lib.example": "Mẫu",
		"lib.steps": "{n} bước",
		"wf.stepsTab": "Các bước ({n})",
		"wf.runsTab": "Lần chạy",
		"wf.run": "Chạy",
		"wf.export": "Xuất tệp",
		"wf.history": "Lịch sử phiên bản",
		"wf.hostFromInputs": "URL lấy từ dữ liệu vào",
		"wf.saved": "Đã lưu · v{v}",
		"wf.restored": "Đã khôi phục v{from} thành v{v}",
		"wf.discarded": "Đã bỏ thay đổi · vẫn là v{v}",
		"imp.title": "Nhập “{name}”",
		"imp.cantTitle": "Không nhập được tệp này",
		"imp.site": "Trang web",
		"imp.steps": "Số bước",
		"imp.allValid": "{n} · đều hợp lệ",
		"imp.asksFor": "Cần nhập",
		"imp.exists": "“{id}” đã tồn tại (v{v}). Lưu sẽ thêm thành v{next}.",
		"imp.save": "Lưu workflow",
		"imp.cancelled": "Đã huỷ nhập.",
		"imp.more": "+{n} lỗi khác",
		"imp.err.invalid_json": "Không phải JSON hợp lệ",
		"imp.err.not_object": "Cần một đối tượng workflow",
		"imp.err.missing_field": "Thiếu trường bắt buộc",
		"imp.err.empty_steps": "Cần ít nhất một bước",
		"imp.err.missing_id": "Bước không có id",
		"imp.err.bad_type": "Loại bước không hợp lệ “{arg}”",
		"imp.err.missing_ref": "Trỏ tới bước không tồn tại “{arg}”",
		"imp.err.duplicate_id": "Id bước “{arg}” bị trùng",
		"imp.err.invalid": "Giá trị không hợp lệ: {arg}",
		"draft.sub": "Workflow mới · {host} · {n} bước",
		"draft.inputs": "Dữ liệu vào:",
		"draft.name": "Tên",
		"draft.save": "Lưu",
		"draft.testRun": "Chạy thử",
		"draft.testAgain": "Chạy thử lại",
		"draft.startTest": "Bắt đầu chạy thử",
		"draft.testing": "Chạy thử · chưa lưu",
		"draft.saveHint": "Chưa lưu. Lưu bất cứ lúc nào bạn thấy lần chạy ổn.",
		"setupRun.title": "Chạy {name}",
		"setupRun.sub": "v{v} · {n} bước",
		"setupRun.optional": "(không bắt buộc)",
		"setupRun.more": "Tuỳ chọn khác ({n})",
		"setupRun.required": "Bắt buộc",
		"setupRun.start": "Bắt đầu chạy",
		"run.progress": "{done} / {total} bước",
		"run.testing": "đang thử thay đổi",
		"run.testStop": "dừng thử",
		"run.manual": "{instruction} trong thẻ Browser Workflow trên Chrome, rồi bấm Tiếp tục.",
		"run.resume": "Tiếp tục",
		"run.stop": "Dừng",
		"run.stopRun": "Dừng chạy",
		"run.done": "Xong · {n} bước",
		"run.items": "đã trích xuất {n} mục",
		"run.changeWorks": "Thay đổi chạy tốt tới bước {n}",
		"run.runFull": "Chạy toàn bộ workflow",
		"run.runAgain": "Chạy lại",
		"run.viewData": "Xem dữ liệu",
		"run.stoppedAt": "Đã dừng ở bước {n}",
		"run.earlier": "{n} bước trước",
		"run.steps": "Các bước ({n})",
		"fail.title": "Lỗi ở bước {n}/{total}",
		"fail.url": "URL",
		"fail.error": "Lỗi",
		"fail.console": "Console",
		"fail.noErrors": "Không có lỗi",
		"fail.sent": "Đã gửi cho {ai}. Cách sửa đề xuất sẽ hiện trong cuộc trò chuyện.",
		"fail.inspecting": "{ai} đang xem lỗi này. Cách sửa đề xuất sẽ hiện bên dưới.",
		"fail.expand": "Phóng to ảnh chụp",
		"fail.collapse": "Thu nhỏ ảnh chụp",
		"fail.shotAlt": "Trang lúc bước {n} bị lỗi",
		"err.notFound": "Không tìm thấy phần tử: {target} (đã chờ {s} giây)",
		"err.timeout": "Hết thời gian chờ sau {s} giây",
		"err.runLimit": "Lần chạy đã vượt giới hạn {m} phút và bị dừng.",
		"chg.fixTitle": "Đề xuất sửa lỗi",
		"chg.changeTitle": "Đề xuất thay đổi",
		"chg.update": "đã sửa",
		"chg.add": "mới",
		"chg.remove": "đã xoá",
		"chg.discard": "Bỏ qua",
		"chg.apply": "Áp dụng & chạy thử",
		"chg.discardedFix": "Đã bỏ cách sửa. {name} vẫn là v{v}.",
		"chg.discardedChange": "Đã bỏ thay đổi. {name} vẫn là v{v}.",
		"chg.before": "Trước",
		"chg.after": "Sau",
		"data.items": "{n} mục",
		"data.extraCols": "+{n} cột khác trong tệp tải về",
		"data.csv": "Tải CSV",
		"data.json": "JSON",
		"hist.title": "Lịch sử phiên bản",
		"hist.current": "Hiện tại",
		"hist.restore": "Khôi phục v{v}",
		"hist.onlyOne": "Mới có một phiên bản. Mỗi thay đổi sẽ tạo phiên bản mới.",
		"hist.who.you": "Bạn",
		"hist.who.claude": "AI",
		"hist.who.import": "Nhập tệp",
		"hist.ev.initial": "Phiên bản đầu tiên",
		"hist.ev.create": "AI tạo",
		"hist.ev.import": "Nhập từ {file}",
		"hist.ev.importNoFile": "Đã nhập",
		"hist.ev.update": "Sửa “{name}”",
		"hist.ev.add": "Thêm “{name}”",
		"hist.ev.remove": "Xoá “{name}”",
		"hist.ev.more": " và {n} thay đổi khác",
		"hist.ev.restore": "Khôi phục v{from}",
		"br.seePlans": "Xem các gói",
		"acct.title": "Tài khoản",
		"acct.free": "Miễn phí",
		"acct.pro": "Pro",
		"acct.until": "Pro đến {date}",
		"acct.runs.day": "Lần chạy hôm nay",
		"acct.runs.month": "Lần chạy tháng này",
		"acct.runs.year": "Lần chạy năm nay",
		"acct.steps.day": "Số bước đã chạy hôm nay",
		"acct.steps.month": "Số bước đã chạy tháng này",
		"acct.steps.year": "Số bước đã chạy năm nay",
		"acct.anonymous": "Chưa có tài khoản",
		"acct.createTitle": "Tạo tài khoản miễn phí",
		"acct.createHint": "Chọn tên đăng nhập và mật khẩu để sau này đăng nhập lại và nâng cấp. Mọi thứ bạn đã tạo vẫn ở trong Chrome.",
		"acct.create": "Tạo tài khoản",
		"acct.trying": "Bạn đang dùng thử, chưa có tài khoản",
		"acct.tryingHint": "Tạo tài khoản miễn phí để giữ các workflow và chạy được nhiều hơn mỗi ngày.",
		"acct.createOrLogin": "Tạo tài khoản hoặc đăng nhập",
		"acct.details": "Chi tiết tài khoản",
		"acct.planFree": "Gói Miễn phí",
		"acct.planLife": "Pro, trọn đời",
		"acct.createOpened": "Trang đã mở trong trình duyệt. Quay lại đây khi bạn làm xong.",
		"acct.createAgain": "Mở lại trang",
		"need.runs": "Bạn đã dùng hết lần chạy của hôm nay. Hãy tạo tài khoản miễn phí để tiếp tục; workflow và các lần chạy vẫn được giữ.",
		"need.steps": "Bạn đã dùng hết số bước của hôm nay. Hãy tạo tài khoản miễn phí để tiếp tục; workflow và các lần chạy vẫn được giữ.",
		"need.workflows": "Bạn đã lưu hết số workflow được phép trước khi đăng ký. Hãy tạo tài khoản miễn phí để lưu thêm; không mất gì cả.",
		"need.continue": "Tiếp tục",
		"need.message": "Tôi đã tạo tài khoản. Hãy thử lại giúp tôi.",
		"acct.workflows": "Workflow",
		"acct.storedIn": "Dữ liệu lưu tại",
		"acct.storage.computer": "Trong Chrome, trên máy tính này",
		"acct.storage.computerNote": "Workflow, lần chạy và kết quả được giữ trong Chrome, trong Browser Workflow. Tài khoản chỉ lưu gói của bạn và số lần bạn đã chạy.",
		"acct.keepRuns": "Giữ {n} lần chạy gần nhất của mỗi workflow",
		"acct.localUsed": "Hiện có {mb} MB trong {n} lần chạy",
		"acct.localWarn": "Các lần chạy đã lưu đang chiếm nhiều dung lượng trên máy của bạn. Không có gì bị xoá tự động: hãy xoá những workflow không còn dùng để giải phóng dung lượng.",
		"acct.upgrade": "Nâng cấp",
		"acct.limitUpgrade": "Nâng cấp lên Pro để tiếp tục.",
		"acct.tryAgain": "Thử lại",
		"acct.manage": "Quản lý gói",
		"acct.copy": "Sao chép",
		"acct.copied": "Đã sao chép",
		"acct.retention": "Lần chạy được giữ {n} ngày",
		"lang.label": "Ngôn ngữ",
		"lang.auto": "Tự động",
		"lang.en": "English",
		"lang.vi": "Tiếng Việt",
		"runs.title": "Lần chạy",
		"runs.none": "Chưa có lần chạy nào.",
		"runs.done": "Xong · {n} bước",
		"runs.failedAt": "Lỗi ở bước {n} · {name}",
		"runs.stoppedAt": "Dừng ở bước {n}",
		"runs.waiting": "Đang chờ bạn",
		"runs.runningAt": "Đang chạy bước {n}",
		"runs.testPassed": "Chạy thử tốt tới bước {n}",
		"runs.test": "chạy thử",
		"sr.notReached": "Chưa tới",
		"sr.skipped": "Bỏ qua",
		"sr.waiting": "Đang chờ",
		"sr.running": "Đang chạy",
		"sr.didntRun": "Bước này chưa chạy.",
		"sr.stepId": "Id bước",
		"sr.alt": "Trang sau bước {n}",
		"sr.requests": "Yêu cầu mạng ({n})",
		"error.expired": "Đề xuất này đã hết hạn. Hãy nhờ {ai} chuẩn bị lại.",
		"error.not_found": "Không tìm thấy. Có thể đã bị xoá.",
		"error.limit_runs_day": "Bạn đã dùng hết {arg} lần chạy của gói trong hôm nay. Số lần chạy được tính lại lúc 00:00 UTC.",
		"error.limit_runs_year": "Bạn đã dùng hết {arg} lần chạy của gói trong năm nay.",
		"error.limit_steps_day": "Các lần chạy của bạn đã đi hết {arg} bước của gói trong hôm nay. Số bước được tính lại lúc 00:00 UTC.",
		"error.limit_steps_year": "Các lần chạy của bạn đã đi hết {arg} bước của gói trong năm nay.",
		"error.limit_workflows": "Gói của bạn cho phép {arg} workflow đã lưu. Hãy xoá bớt, hoặc nâng cấp.",
		"error.limit_steps": "Gói của bạn chạy workflow tối đa {arg} bước. Hãy rút gọn workflow này, hoặc nâng cấp.",
		"setup.title": "Thiết lập Browser Workflow",
		"setup.stepOf": "Bước {n}/{total}",
		"setup.continue": "Tiếp tục",
		"setup.firstTitle": "Thêm workflow đầu tiên",
		"setup.importFile": "Nhập từ tệp",
		"setup.importHint": "Tệp workflow .json được chia sẻ hoặc xuất từ Browser Workflow",
		"setup.example": "Dùng thử ví dụ",
		"setup.exampleHint": "Chọn một workflow mẫu rồi chạy thử",
		"setup.describe": "Mô tả workflow",
		"setup.describeHint": "Nói với {ai} việc cần tự động hoá",
		"setup.describePh": "VD: Lấy các repo GitHub đang thịnh hành hôm nay",
		"setup.finish": "Hoàn tất",
		"setup.ready": "Đã thiết lập xong.",
		"setup.extTitle": "Thêm Browser Workflow vào Chrome",
		"setup.extNote": "Workflow chạy trong Chrome của bạn, trong một nhóm thẻ riêng, nên bạn vẫn dùng Chrome bình thường trong lúc chạy.",
		"setup.extOpen": "Hãy mở Chrome. Nếu Chrome chưa có Browser Workflow, hãy thêm từ Chrome Web Store rồi kiểm tra lại.",
		"setup.extGet": "Thêm vào Chrome",
		"setup.extCheck": "Kiểm tra lại",
		"setup.extOk": "Browser Workflow đã sẵn sàng trong Chrome.",
		"error.not_running": "Hãy mở Chrome để tiếp tục: Browser Workflow chạy trong Chrome.",
		"dl.saving": "Đang lưu {name}…",
		"dl.saved": "Đã lưu {name}",
		"dl.show": "Mở thư mục",
		"dl.gone": "Tệp này không còn trong thư mục Tải về.",
		"panel.waiting": "Đang chờ bạn duyệt",
		"panel.waitingSub": "{n} đề xuất từ {ai}",
		"panel.review": "Xem",
		"panel.home": "Trang chính",
		"panel.run": "Chạy",
		"panel.sent": "Đã gửi cho {ai}. Hãy chuyển sang {ai} để xem.",
		"panel.noAi": "Hãy mở {ai} và nhờ sửa workflow này. Sao chép đoạn này rồi dán vào cuộc trò chuyện:",
		"panel.copy": "Sao chép",
		"panel.copied": "Đã sao chép",
		"panel.empty": "Chưa có workflow nào. Hãy nhờ {ai} tạo: mô tả việc cần làm trên một trang web.",
		"acct.login": "Đăng nhập",
		"acct.loginHint": "Đã có tài khoản? Đăng nhập vào tài khoản đó.",
		"acct.logout": "Đăng xuất",
		"acct.offline": "Hiện chưa kết nối được tới tài khoản của bạn: đang hiển thị gói gần nhất bạn có.",
		"acct.createDone": "Tôi đã tạo xong",
		"panel.account": "Tài khoản",
		"chat.prompt": "Hãy dùng Browser Workflow cùng tôi từ bảng bên của nó trong Chrome. Gọi wait_for_user để nghe tin nhắn của tôi ở đó. Làm theo từng tin nhắn, đưa câu trả lời ngắn cho tôi vào reply ở lần gọi wait_for_user tiếp theo, và tiếp tục nghe cho đến khi tôi bảo dừng.",
		"chat.noneTitle": "Claude chưa được kết nối",
		"chat.noneSub": "Mở Claude để tạo, sửa workflow và trò chuyện với Claude ngay tại đây.",
		"chat.idleTitle": "Claude đã ngừng nghe",
		"chat.use": "Dùng với Claude",
		"chat.useCode": "Dùng Claude Code thay thế",
		"chat.copyPrompt": "Sao chép lời nhắn",
		"chat.copied": "Đã sao chép",
		"chat.openChat": "Mở cuộc trò chuyện",
		"chat.waitingTitle": "Đang chờ Claude…",
		"chat.step1": "Claude đã mở với một tin nhắn soạn sẵn.",
		"chat.step2a": "Bấm ",
		"chat.step2b": "Gửi",
		"chat.step2c": " trong Claude.",
		"chat.step3": "Bảng này sẽ tự kết nối.",
		"chat.warnNote": "Claude có thể cảnh báo trước khi gửi lời nhắn mở từ một liên kết: điều đó bình thường. Nếu Claude hỏi có cho phép Browser Workflow không, hãy chọn Luôn cho phép.",
		"chat.nothingOpened": "Không thấy gì mở ra? Sao chép lời nhắn rồi dán vào Claude.",
		"chat.openAgain": "Mở lại Claude",
		"chat.liveListening": "Claude đang nghe",
		"chat.liveWorking": "Claude đang làm",
		"chat.liveConnected": "Claude đã kết nối",
		"chat.chat": "Trò chuyện",
		"chat.title": "Claude",
		"chat.pillListening": "Đang nghe",
		"chat.pillWorking": "Đang làm",
		"chat.pillConnected": "Đã kết nối",
		"chat.pillOff": "Không nghe",
		"chat.you": "Bạn",
		"chat.claude": "Claude",
		"chat.empty": "Nhắn cho Claude ở đây: nhờ tạo, chạy hoặc sửa một workflow. Gõ @ để nhắc đến một workflow, một lần chạy hoặc một tab.",
		"chat.working": "Claude đang làm… ({s} giây)",
		"chat.queued": "Sẽ đến Claude khi nó làm xong tin nhắn trước",
		"chat.ph": "Nhắn cho Claude…  (@ để nhắc đến)",
		"chat.phOff": "Claude không nghe",
		"chat.send": "Gửi",
		"chat.mention": "Nhắc đến",
		"chat.stoppedTitle": "Claude đã ngừng nghe",
		"chat.stoppedSub": "Nếu bạn đã dừng Claude, hãy nhờ Claude nghe lại ở đó, hoặc mở cuộc trò chuyện mới.",
		"chat.notDelivered": "Claude chưa nhận được tin này: chưa có Claude nào kết nối. Hãy bấm Dùng với Claude trước.",
		"chat.pickWorkflows": "Workflow",
		"chat.pickRuns": "Lần chạy",
		"chat.pickTabs": "Tab đang mở",
		"chat.pickNone": "Không có kết quả",
		"chat.cardWaiting": "Đang chờ bạn duyệt",
		"chat.cardSaved": "Bạn đã lưu “{name}”",
		"chat.cardApplied": "Bạn đã áp dụng thay đổi cho “{name}”",
		"chat.cardDiscarded": "Bạn đã bỏ đề xuất cho “{name}”",
		"chat.cardExpired": "Đề xuất cho “{name}” đã hết hạn",
		"chat.cardRunOk": "“{name}” đã chạy xong",
		"chat.cardRunOkItems": "“{name}” đã chạy xong · {n} mục",
		"chat.cardRunFailed": "“{name}” bị lỗi",
		"chat.cardRunStopped": "“{name}” đã bị dừng",
		"chat.cardRunOther": "“{name}”: {status}",
		"chat.openView": "Mở",
		"shown.line": "Đã hiện trong bảng bên",
		"shown.showHere": "Hiện ở đây",
		"md.preview": "Xem trước",
		"md.code": "Mã",
		"md.openTab": "Mở trong tab mới",
		"md.copy": "Sao chép",
		"md.copied": "Đã sao chép"
	}
};
function Ve(e, t = "en") {
	let n = (e ?? "").toLowerCase();
	return n.includes("claude") ? {
		kind: "claude",
		ai: "Claude"
	} : /chatgpt|codex|openai/.test(n) ? {
		kind: "other",
		ai: "ChatGPT"
	} : n.includes("antigravity") ? {
		kind: "other",
		ai: "Antigravity"
	} : n.includes("gemini") ? {
		kind: "other",
		ai: "Gemini"
	} : {
		kind: "unknown",
		ai: t === "vi" ? "AI của bạn" : "your AI app"
	};
}
function He(e, t = Ve(void 0, e).ai) {
	let n = Be[e];
	return (e, r = {}) => (n[e] ?? ze[e]).replace(/\{(\w+)(?:\|([^|}]*)\|([^}]*))?\}/g, (e, n, i, a) => {
		let o = n === "ai" && r.ai === void 0 ? t : r[n];
		return i === void 0 ? o === void 0 ? "" : String(o) : Number(o) === 1 ? i : a ?? "";
	});
}
function Ue(e, t) {
	return e === "en" || e === "vi" ? e : (t || (typeof navigator < "u" ? navigator.language : "") || "en").toLowerCase().startsWith("vi") ? "vi" : "en";
}
function We(e, t) {
	let n = Ve(t, e), r = He(e, n.ai), i = new Intl.RelativeTimeFormat(e, {
		numeric: "auto",
		style: "short"
	}), a = new Intl.NumberFormat(e, { maximumFractionDigits: 1 });
	return {
		lang: e,
		host: n,
		t: r,
		ago(e) {
			let t = Math.round((Date.parse(e) - Date.now()) / 1e3), n = Math.abs(t);
			return n < 60 ? r("common.justNow") : n < 3600 ? i.format(Math.round(t / 60), "minute") : n < 86400 ? i.format(Math.round(t / 3600), "hour") : i.format(Math.round(t / 86400), "day");
		},
		dur(e) {
			return e === void 0 ? "" : e < 1e3 ? `${e} ms` : `${a.format(e / 1e3)} s`;
		}
	};
}
var Ge = _e(We("en")), I = () => je(Ge), Ke = 0;
Array.isArray;
function L(e, n, r, i, a, o) {
	n ||= {};
	var s, c, l = n;
	if ("ref" in l) for (c in l = {}, n) c == "ref" ? s = n[c] : l[c] = n[c];
	var u = {
		type: e,
		props: l,
		key: r,
		ref: s,
		__k: null,
		__: null,
		__b: 0,
		__e: null,
		__c: null,
		constructor: void 0,
		__v: --Ke,
		__i: -1,
		__u: 0,
		__source: a,
		__self: o
	};
	if (typeof e == "function" && (s = e.defaultProps)) for (c in s) l[c] === void 0 && (l[c] = s[c]);
	return t.vnode && t.vnode(u), u;
}
// ui/components.tsx
var qe = _e(null), R = () => je(qe), z = (e, t = 16) => /* @__PURE__ */ L("svg", {
	width: t,
	height: t,
	viewBox: "0 0 16 16",
	fill: "none",
	stroke: "currentColor",
	"stroke-width": "1.6",
	"stroke-linecap": "round",
	"stroke-linejoin": "round",
	"aria-hidden": "true",
	children: e
}), B = {
	check: () => z(/* @__PURE__ */ L("path", { d: "M3.5 8.5l3 3 6-7" })),
	x: () => z(/* @__PURE__ */ L("path", { d: "M4.5 4.5l7 7M11.5 4.5l-7 7" })),
	chevron: () => z(/* @__PURE__ */ L("path", { d: "M6 4l4 4-4 4" }), 14),
	more: () => z(/* @__PURE__ */ L("g", {
		fill: "currentColor",
		stroke: "none",
		children: [
			/* @__PURE__ */ L("circle", {
				cx: "3.5",
				cy: "8",
				r: "1.3"
			}),
			/* @__PURE__ */ L("circle", {
				cx: "8",
				cy: "8",
				r: "1.3"
			}),
			/* @__PURE__ */ L("circle", {
				cx: "12.5",
				cy: "8",
				r: "1.3"
			})
		]
	})),
	spinner: () => /* @__PURE__ */ L("svg", {
		class: "spin",
		width: "16",
		height: "16",
		viewBox: "0 0 16 16",
		fill: "none",
		stroke: "currentColor",
		"stroke-width": "1.8",
		"stroke-linecap": "round",
		"aria-hidden": "true",
		children: /* @__PURE__ */ L("path", { d: "M8 2a6 6 0 1 1-6 6" })
	}),
	pause: () => z(/* @__PURE__ */ L("path", { d: "M6 4v8M10 4v8" })),
	circle: () => z(/* @__PURE__ */ L("circle", {
		cx: "8",
		cy: "8",
		r: "4.5"
	})),
	skip: () => z(/* @__PURE__ */ L("path", { d: "M4 8h8" })),
	alert: () => z(/* @__PURE__ */ L(C, { children: [/* @__PURE__ */ L("path", { d: "M8 2.5l6 11H2z" }), /* @__PURE__ */ L("path", { d: "M8 7v2.5M8 11.6v.1" })] })),
	upload: () => z(/* @__PURE__ */ L("path", { d: "M8 11V3M4.5 6.5L8 3l3.5 3.5M3 13h10" })),
	play: () => z(/* @__PURE__ */ L("path", { d: "M5 3.5v9l7-4.5z" })),
	sparkle: () => z(/* @__PURE__ */ L("path", { d: "M8 2.5l1.3 3.2 3.2 1.3-3.2 1.3L8 11.5 6.7 8.3 3.5 7l3.2-1.3zM12.5 11l.6 1.4 1.4.6-1.4.6-.6 1.4-.6-1.4-1.4-.6 1.4-.6z" })),
	back: () => z(/* @__PURE__ */ L("path", { d: "M10 4L6 8l4 4" }), 14),
	navigate: () => z(/* @__PURE__ */ L(C, { children: [/* @__PURE__ */ L("circle", {
		cx: "8",
		cy: "8",
		r: "5.5"
	}), /* @__PURE__ */ L("path", { d: "M2.5 8h11M8 2.5c1.8 1.8 1.8 9.2 0 11M8 2.5c-1.8 1.8-1.8 9.2 0 11" })] })),
	executeXpathCommand: () => z(/* @__PURE__ */ L("path", { d: "M4 3l8 4.2-3.6 1.1L7 12z" })),
	javascript: () => z(/* @__PURE__ */ L("path", { d: "M6 4c-1.5 0-1.5 1-1.5 2S4 8 3 8c1 0 1.5 0 1.5 2s0 2 1.5 2M10 4c1.5 0 1.5 1 1.5 2s.5 2 1.5 2c-1 0-1.5 0-1.5 2s0 2-1.5 2" })),
	extractData: () => z(/* @__PURE__ */ L(C, { children: [/* @__PURE__ */ L("rect", {
		x: "2.5",
		y: "3",
		width: "11",
		height: "10",
		rx: "1.5"
	}), /* @__PURE__ */ L("path", { d: "M2.5 6.5h11M6.5 6.5V13" })] })),
	if: () => z(/* @__PURE__ */ L(C, { children: [
		/* @__PURE__ */ L("circle", {
			cx: "4",
			cy: "4",
			r: "1.5"
		}),
		/* @__PURE__ */ L("circle", {
			cx: "12",
			cy: "4",
			r: "1.5"
		}),
		/* @__PURE__ */ L("circle", {
			cx: "8",
			cy: "12.5",
			r: "1.5"
		}),
		/* @__PURE__ */ L("path", { d: "M8 11V8.5L4 5.5M8 8.5l4-3" })
	] })),
	switch: () => z(/* @__PURE__ */ L(C, { children: [/* @__PURE__ */ L("circle", {
		cx: "3.5",
		cy: "8",
		r: "1.5"
	}), /* @__PURE__ */ L("path", { d: "M5 8h2.5M7.5 8l5-4M7.5 8h5M7.5 8l5 4" })] })),
	delay: () => z(/* @__PURE__ */ L(C, { children: [/* @__PURE__ */ L("circle", {
		cx: "8",
		cy: "8",
		r: "5.5"
	}), /* @__PURE__ */ L("path", { d: "M8 5v3.2l2 1.3" })] })),
	download: () => z(/* @__PURE__ */ L("path", { d: "M8 3v7.5M4.5 7L8 10.5 11.5 7M3 13h10" })),
	manual: () => z(/* @__PURE__ */ L("path", { d: "M5.5 8V4.2a1 1 0 0 1 2 0V7.5M7.5 7V3.2a1 1 0 0 1 2 0V7.5M9.5 7.5V4.5a1 1 0 0 1 2 0V9c0 2.5-1.5 4.5-4 4.5-1.8 0-2.7-.8-3.7-2.3L2.6 8.7a1 1 0 0 1 1.6-1.1l1.3 1.4" }))
};
function Je({ type: e }) {
	let { t } = I();
	return /* @__PURE__ */ L("span", {
		class: "st pending",
		title: t(`stepType.${e}`),
		children: B[e]()
	});
}
function Ye({ status: e }) {
	let { t } = I();
	return /* @__PURE__ */ L("span", {
		class: `pill ${{
			running: "run",
			waiting_manual: "warn",
			success: "ok",
			failure: "bad",
			stopped: "muted"
		}[e]}`,
		children: t(`status.${e}`)
	});
}
function Xe({ status: e }) {
	let { t } = I();
	return /* @__PURE__ */ L("span", {
		class: `dot ${e === "success" ? "ok" : e === "failure" ? "bad" : e === "running" ? "run" : e === "waiting_manual" ? "warn" : ""}`,
		title: t(e ? `status.${e}` : "status.never")
	});
}
function V({ title: e, sub: t, right: n }) {
	let r = R(), { t: i } = I();
	return /* @__PURE__ */ L(C, { children: [r.canBack && /* @__PURE__ */ L("button", {
		class: "back",
		onClick: r.back,
		children: i("common.back")
	}), /* @__PURE__ */ L("div", {
		class: "hd",
		children: [/* @__PURE__ */ L("div", {
			class: "hd-main",
			children: [/* @__PURE__ */ L("h1", {
				class: "title",
				children: e
			}), t && /* @__PURE__ */ L("div", {
				class: "sub",
				children: t
			})]
		}), n]
	})] });
}
function Ze({ label: e, children: t, initial: n = !1 }) {
	let [r, i] = N(n);
	return /* @__PURE__ */ L(C, { children: [/* @__PURE__ */ L("button", {
		class: "disclosure",
		"aria-expanded": r,
		onClick: () => i(!r),
		children: [B.chevron(), e]
	}), r && t] });
}
function Qe({ items: e }) {
	let [t, n] = N(!1), { t: r } = I();
	return /* @__PURE__ */ L("div", {
		class: "menu",
		children: [/* @__PURE__ */ L("button", {
			class: "icon-btn",
			"aria-label": r("common.moreActions"),
			"aria-expanded": t,
			onClick: () => n(!t),
			children: B.more()
		}), t && /* @__PURE__ */ L("div", {
			class: "menu-pop",
			role: "menu",
			onMouseLeave: () => n(!1),
			children: e.map((e) => /* @__PURE__ */ L("button", {
				role: "menuitem",
				onClick: () => {
					n(!1), e.onClick();
				},
				children: e.label
			}))
		})]
	});
}
function $e({ runId: e, stepId: t, alt: n }) {
	let r = R(), { t: i } = I(), [a, o] = N(), [s, c] = N(!1);
	return P(() => {
		let n = !0;
		return o(void 0), r.bridge.call("ui_get_screenshot", {
			runId: e,
			stepId: t
		}).then((e) => {
			n && !e.isError && e.payload.dataUrl && o(e.payload.dataUrl);
		}).catch(() => {}), () => {
			n = !1;
		};
	}, [e, t]), a ? /* @__PURE__ */ L("button", {
		class: `shot${s ? " open" : ""}`,
		onClick: () => c(!s),
		"aria-label": i(s ? "fail.collapse" : "fail.expand"),
		children: /* @__PURE__ */ L("img", {
			src: a,
			alt: n
		})
	}) : null;
}
function H({ kind: e, children: t }) {
	let n = e === "ok" ? B.check() : e === "info" ? B.circle() : B.alert();
	return /* @__PURE__ */ L("div", {
		class: `note ${e}`,
		role: e === "bad" ? "alert" : "status",
		children: [n, /* @__PURE__ */ L("div", { children: t })]
	});
}
function U({ onClick: e, children: t, primary: n, ghost: r, disabled: i, "aria-label": a }) {
	let o = R(), [s, c] = N(!1);
	return /* @__PURE__ */ L("button", {
		class: `btn${n ? " primary" : ""}${r ? " ghost" : ""}`,
		"aria-label": a,
		disabled: s || i,
		onClick: async () => {
			c(!0);
			try {
				await o.lock(e);
			} finally {
				c(!1);
			}
		},
		children: [s && B.spinner(), t]
	});
}
async function et(e, t, n) {
	return n && await e.updateContext(n).catch(() => {}), await e.sendMessage(t) ?? void 0;
}
function tt({ result: e, again: t }) {
	let { t: n } = I(), [r, i] = N(!1), a = t && /* @__PURE__ */ L(C, { children: [" ", /* @__PURE__ */ L("button", {
		class: "link",
		onClick: t,
		children: n("ask.again")
	})] });
	return e ? e.delivered ? /* @__PURE__ */ L(H, {
		kind: "info",
		children: [n("panel.sent"), a]
	}) : /* @__PURE__ */ L("div", {
		class: "note info",
		style: "flex-direction:column;align-items:stretch;gap:8px",
		children: [/* @__PURE__ */ L("div", { children: n("panel.noAi") }), /* @__PURE__ */ L("div", {
			style: "display:flex;gap:6px",
			children: [/* @__PURE__ */ L("input", {
				class: "input",
				readOnly: !0,
				value: e.text,
				onFocus: (e) => e.target.select(),
				"aria-label": n("panel.copy")
			}), /* @__PURE__ */ L("button", {
				class: "btn",
				onClick: async () => {
					try {
						await navigator.clipboard.writeText(e.text), i(!0);
					} catch {}
				},
				children: n(r ? "panel.copied" : "panel.copy")
			})]
		})]
	}) : /* @__PURE__ */ L(H, {
		kind: "info",
		children: [n("ask.sent"), a]
	});
}
function nt({ message: e, context: t, placeholder: n, suggestions: r = [], label: i, allowEmpty: a = !1, heading: o }) {
	let s = R(), { t: c } = I(), [l, u] = N(""), [d, f] = N();
	if (d) return /* @__PURE__ */ L(tt, {
		result: d.result,
		again: () => {
			u(""), f(void 0);
		}
	});
	let p = async () => {
		f({ result: await et(s.bridge, e(l.trim()), t) });
	};
	return /* @__PURE__ */ L("div", {
		class: `ask${o ? " ask-view" : ""}`,
		children: [
			o && /* @__PURE__ */ L("div", {
				class: "ask-title",
				children: o
			}),
			r.length > 0 && !l && /* @__PURE__ */ L("div", {
				class: "chips",
				children: r.map((e) => /* @__PURE__ */ L("button", {
					class: "chip",
					onClick: () => u(e),
					children: e
				}))
			}),
			/* @__PURE__ */ L("div", {
				class: "ask-row",
				children: [/* @__PURE__ */ L("input", {
					class: "input",
					value: l,
					placeholder: n,
					"aria-label": n,
					onInput: (e) => u(e.target.value),
					onKeyDown: (e) => {
						e.key === "Enter" && (l.trim() || a) && p();
					}
				}), /* @__PURE__ */ L(U, {
					primary: !o,
					disabled: !l.trim() && !a,
					onClick: p,
					children: [B.sparkle(), i ?? c("ask.button")]
				})]
			})
		]
	});
}
// ui/views/library.tsx
var W = 5;
function rt() {
	let e = R(), { t } = I(), n = F(null), [r, i] = N();
	async function a(r) {
		let a = r.target.files?.[0];
		if (!a) return;
		if (i(void 0), a.size > 2e6) return i(t("lib.tooBig"));
		let o = await a.text();
		await e.open("import_workflow", {
			json: o,
			fileName: a.name
		}, "push"), n.current && (n.current.value = "");
	}
	return {
		pick: () => n.current?.click(),
		input: /* @__PURE__ */ L("input", {
			ref: n,
			type: "file",
			accept: ".json,application/json",
			class: "sr",
			onChange: a,
			tabIndex: -1
		}),
		error: r
	};
}
function it({ workflows: e, query: t }) {
	let n = R(), { t: r, ago: i } = I(), [a, o] = N(!1), [s, c] = N(""), l = rt(), u = n.bridge.surface === "panel", d = s.toLowerCase(), f = e.filter((e) => !d || `${e.name} ${e.host}`.toLowerCase().includes(d)), p = a ? f : f.slice(0, W);
	return /* @__PURE__ */ L("div", {
		class: "w",
		children: [
			/* @__PURE__ */ L(V, {
				title: r("lib.title"),
				sub: t ? r("lib.matching", { q: t }) : r("lib.saved", { n: e.length })
			}),
			e.length === 0 ? /* @__PURE__ */ L("div", {
				class: "empty",
				children: /* @__PURE__ */ L("div", { children: r(u ? "panel.empty" : "lib.empty") })
			}) : /* @__PURE__ */ L(C, { children: [e.length > W && /* @__PURE__ */ L("input", {
				class: "input",
				type: "search",
				placeholder: r("lib.filter"),
				value: s,
				onInput: (e) => c(e.target.value),
				"aria-label": r("lib.filter")
			}), /* @__PURE__ */ L("div", {
				class: "list",
				children: [
					p.map((e) => {
						let t = /* @__PURE__ */ L("button", {
							class: "row",
							style: u ? "flex:1;min-width:0" : void 0,
							onClick: () => n.open("show_workflow", { id: e.id }, "push"),
							children: [
								/* @__PURE__ */ L(Xe, { status: e.lastRun?.status }),
								/* @__PURE__ */ L("div", {
									class: "row-main",
									children: [/* @__PURE__ */ L("div", {
										class: "row-title",
										children: [e.name, e.example && /* @__PURE__ */ L("span", {
											class: "pill muted",
											style: "margin-left:6px",
											children: r("lib.example")
										})]
									}), /* @__PURE__ */ L("div", {
										class: "row-sub",
										children: [
											e.host || r("wf.hostFromInputs"),
											" · ",
											r("lib.steps", { n: e.stepCount })
										]
									})]
								}),
								/* @__PURE__ */ L("span", {
									class: "row-meta",
									children: e.lastRun ? `${e.lastRun.status ? `${r(`status.${e.lastRun.status}`)} · ` : ""}${i(e.lastRun.at)}` : r("lib.neverRun")
								})
							]
						});
						return u ? /* @__PURE__ */ L("div", {
							class: "row-wrap",
							style: "display:flex;align-items:center;gap:6px;padding-right:8px",
							children: [t, /* @__PURE__ */ L(U, {
								onClick: () => n.open("run_workflow", {
									id: e.id,
									form: !0
								}, "push"),
								"aria-label": `${r("panel.run")} ${e.name}`,
								children: [B.play(), r("panel.run")]
							})]
						}) : t;
					}),
					!p.length && /* @__PURE__ */ L("div", {
						class: "row",
						children: /* @__PURE__ */ L("span", {
							class: "muted",
							children: r("lib.noMatch")
						})
					}),
					!a && f.length > W && /* @__PURE__ */ L("button", {
						class: "more",
						onClick: () => o(!0),
						children: r("common.showAll", { n: f.length })
					})
				]
			})] }),
			l.error && /* @__PURE__ */ L("div", {
				class: "field",
				children: /* @__PURE__ */ L("span", {
					class: "err",
					children: l.error
				})
			}),
			l.input,
			/* @__PURE__ */ L("div", {
				class: "actions",
				children: /* @__PURE__ */ L("button", {
					class: "btn primary",
					onClick: l.pick,
					children: [B.upload(), r("lib.import")]
				})
			})
		]
	});
}
// ui/views/importDraft.tsx
function at({ preview: e, pendingId: t }) {
	let n = R(), { t: r } = I(), [i, a] = N(!1);
	if (i) return /* @__PURE__ */ L("div", {
		class: "w",
		children: /* @__PURE__ */ L(H, {
			kind: "info",
			children: r("imp.cancelled")
		})
	});
	let o = (e) => r(`imp.err.${e.code}`, { arg: e.arg });
	if (!e.ok) {
		let t = e.errors.slice(0, 3);
		return /* @__PURE__ */ L("div", {
			class: "w",
			children: [
				/* @__PURE__ */ L(V, {
					title: r("imp.cantTitle"),
					sub: e.fileName
				}),
				/* @__PURE__ */ L("div", {
					class: "list",
					children: [t.map((e) => /* @__PURE__ */ L("div", {
						class: "row",
						children: [/* @__PURE__ */ L("span", {
							class: "st bad",
							children: B.x()
						}), /* @__PURE__ */ L("div", {
							class: "row-main",
							children: [/* @__PURE__ */ L("div", {
								class: "row-title mono",
								children: e.path
							}), /* @__PURE__ */ L("div", {
								class: "row-sub",
								style: "white-space:normal",
								children: o(e)
							})]
						})]
					})), e.errors.length > 3 && /* @__PURE__ */ L("div", {
						class: "row",
						children: /* @__PURE__ */ L("span", {
							class: "muted",
							children: r("imp.more", { n: e.errors.length - 3 })
						})
					})]
				}),
				/* @__PURE__ */ L("div", {
					class: "actions",
					children: [/* @__PURE__ */ L("button", {
						class: "btn ghost",
						onClick: () => a(!0),
						children: r("common.cancel")
					}), /* @__PURE__ */ L(U, {
						primary: !0,
						onClick: () => et(n.bridge, r("msg.importFix", { file: e.fileName }), `The user's workflow file "${e.fileName}" failed validation:\n${e.errors.map((e) => `- ${e.path}: ${e.message}`).join("\n")}\nHelp fix the JSON (format: get_step_schema), then call import_workflow with the corrected content.`),
						children: [B.sparkle(), r("ask.fix")]
					})]
				})
			]
		});
	}
	let s = e.workflow;
	return /* @__PURE__ */ L("div", {
		class: "w",
		children: [
			/* @__PURE__ */ L(V, {
				title: r("imp.title", { name: s.name }),
				sub: e.fileName
			}),
			/* @__PURE__ */ L("div", {
				class: "list",
				children: [
					/* @__PURE__ */ L("div", {
						class: "row",
						children: /* @__PURE__ */ L("div", {
							class: "row-main",
							children: [/* @__PURE__ */ L("div", {
								class: "row-sub",
								children: r("imp.site")
							}), /* @__PURE__ */ L("div", {
								class: "row-title",
								children: s.host || r("wf.hostFromInputs")
							})]
						})
					}),
					/* @__PURE__ */ L("div", {
						class: "row",
						children: [/* @__PURE__ */ L("div", {
							class: "row-main",
							children: [/* @__PURE__ */ L("div", {
								class: "row-sub",
								children: r("imp.steps")
							}), /* @__PURE__ */ L("div", {
								class: "row-title",
								children: r("imp.allValid", { n: s.stepCount })
							})]
						}), /* @__PURE__ */ L("span", {
							class: "st ok",
							children: B.check()
						})]
					}),
					!!e.inputs?.length && /* @__PURE__ */ L("div", {
						class: "row",
						children: /* @__PURE__ */ L("div", {
							class: "row-main",
							children: [/* @__PURE__ */ L("div", {
								class: "row-sub",
								children: r("imp.asksFor")
							}), /* @__PURE__ */ L("div", {
								class: "row-title",
								children: e.inputs.join(", ")
							})]
						})
					})
				]
			}),
			e.existingVersion !== void 0 && /* @__PURE__ */ L(H, {
				kind: "warn",
				children: r("imp.exists", {
					id: s.id,
					v: e.existingVersion,
					next: e.existingVersion + 1
				})
			}),
			/* @__PURE__ */ L("div", {
				class: "actions",
				children: [/* @__PURE__ */ L("button", {
					class: "btn ghost",
					onClick: () => a(!0),
					children: r("common.cancel")
				}), /* @__PURE__ */ L(U, {
					primary: !0,
					onClick: () => n.open("ui_confirm_import", { pendingId: t }, "replace"),
					children: r("imp.save")
				})]
			})
		]
	});
}
function ot({ workflow: e, pendingId: t }) {
	let n = R(), { t: r } = I(), [i, a] = N(e.name);
	return /* @__PURE__ */ L("div", {
		class: "w",
		children: [
			/* @__PURE__ */ L(V, {
				title: e.name,
				sub: r("draft.sub", {
					host: e.host || r("wf.hostFromInputs"),
					n: e.steps.length
				})
			}),
			/* @__PURE__ */ L(wt, {
				steps: e.steps,
				limit: 5
			}),
			e.variables.length > 0 && /* @__PURE__ */ L("div", {
				class: "chips",
				children: [/* @__PURE__ */ L("span", {
					class: "muted",
					children: r("draft.inputs")
				}), e.variables.map((e) => /* @__PURE__ */ L("span", {
					class: "tag",
					children: [e.title, e.required ? " *" : ""]
				}))]
			}),
			/* @__PURE__ */ L(nt, {
				heading: r("ask.draftTitle"),
				placeholder: r("ask.phDraft"),
				message: (e) => r("msg.editDraft", { text: e }),
				context: `The user wants to change the draft workflow "${e.name}" (${e.steps.length} steps) that you proposed with propose_workflow. It is not saved yet, so propose_change cannot be used on it. Answer with propose_workflow again, with the whole workflow changed as asked.`
			}, t),
			/* @__PURE__ */ L("div", {
				class: "field",
				children: [/* @__PURE__ */ L("label", {
					for: `name-${t}`,
					children: r("draft.name")
				}), /* @__PURE__ */ L("input", {
					id: `name-${t}`,
					class: "input",
					value: i,
					maxLength: 200,
					onInput: (e) => a(e.target.value)
				})]
			}),
			/* @__PURE__ */ L("div", {
				class: "actions",
				children: [/* @__PURE__ */ L(U, {
					disabled: !i.trim(),
					onClick: () => n.open("ui_save_draft", {
						pendingId: t,
						name: i.trim()
					}, "replace"),
					children: r("draft.save")
				}), /* @__PURE__ */ L(U, {
					primary: !0,
					onClick: () => n.open("ui_test_draft", { pendingId: t }, "push"),
					children: [B.play(), r("draft.testRun")]
				})]
			})
		]
	});
}
function st({ draft: e, primary: t }) {
	let n = R(), { t: r } = I(), [i, a] = N(e.name);
	return /* @__PURE__ */ L("div", {
		class: "draft-save",
		children: [
			/* @__PURE__ */ L("div", {
				class: "muted",
				style: "font-size:12.5px",
				children: r("draft.saveHint")
			}),
			/* @__PURE__ */ L("div", {
				class: "field",
				children: [/* @__PURE__ */ L("label", {
					for: `save-${e.pendingId}`,
					children: r("draft.name")
				}), /* @__PURE__ */ L("input", {
					id: `save-${e.pendingId}`,
					class: "input",
					value: i,
					maxLength: 200,
					onInput: (e) => a(e.target.value)
				})]
			}),
			/* @__PURE__ */ L("div", {
				class: "actions",
				children: /* @__PURE__ */ L(U, {
					primary: t,
					disabled: !i.trim(),
					onClick: () => n.open("ui_save_draft", {
						pendingId: e.pendingId,
						name: i.trim()
					}, "replace"),
					children: r("draft.save")
				})
			})
		]
	});
}
// ui/views/run.tsx
function ct(e, t) {
	let n = e.errorType ?? e.type, r = e.timeoutMs ? Math.round(e.timeoutMs / 1e3) : void 0;
	return n === "cant_get_web_element_xpath" && e.target ? t("err.notFound", {
		target: e.target,
		s: r
	}) : n === "timeout" && e.target === "run_limit" && e.timeoutMs ? t("err.runLimit", { m: Math.round(e.timeoutMs / 6e3) / 10 }) : n === "timeout" && r ? t("err.timeout", { s: r }) : e.reason ?? e.raw ?? "";
}
function lt({ workflow: e, draft: t }) {
	let n = R(), { t: r } = I(), [i, a] = N(Object.fromEntries(e.variables.map((e) => [e.name, e.default ?? (e.type !== "boolean" && "")]))), [o, s] = N(!1), c = e.variables.filter((e) => e.required), l = e.variables.filter((e) => !e.required), u = c.filter((e) => i[e.name] === "" || i[e.name] === void 0);
	async function d() {
		if (s(!0), u.length) return;
		let r = Object.fromEntries(Object.entries(i).map(([t, n]) => [t, e.variables.find((e) => e.name === t)?.type === "number" && n !== "" ? Number(n) : n]));
		await n.open(t ? "ui_test_draft" : "run_workflow", t ? {
			pendingId: t.pendingId,
			variables: r
		} : {
			id: e.id,
			variables: r
		}, "replace");
	}
	let f = (e) => e.type === "boolean" ? /* @__PURE__ */ L("label", {
		class: "check",
		children: [/* @__PURE__ */ L("input", {
			type: "checkbox",
			checked: !!i[e.name],
			onChange: (t) => a({
				...i,
				[e.name]: t.target.checked
			})
		}), e.title]
	}) : /* @__PURE__ */ L("div", {
		class: "field",
		children: [
			/* @__PURE__ */ L("label", {
				for: `v-${e.name}`,
				children: [e.title, e.required ? "" : ` ${r("setupRun.optional")}`]
			}),
			/* @__PURE__ */ L("input", {
				id: `v-${e.name}`,
				class: `input${o && e.required && u.includes(e) ? " invalid" : ""}`,
				type: e.type === "number" ? "number" : "text",
				value: String(i[e.name] ?? ""),
				placeholder: e.description,
				onInput: (t) => a({
					...i,
					[e.name]: t.target.value
				})
			}),
			o && e.required && u.includes(e) && /* @__PURE__ */ L("span", {
				class: "err",
				children: r("setupRun.required")
			})
		]
	});
	return /* @__PURE__ */ L("div", {
		class: "w",
		children: [
			/* @__PURE__ */ L(V, {
				title: r("setupRun.title", { name: e.name }),
				sub: t ? `${r("draft.testing")} · ${r("lib.steps", { n: e.steps.length })}` : r("setupRun.sub", {
					v: e.version,
					n: e.steps.length
				})
			}),
			/* @__PURE__ */ L("div", {
				class: "stack",
				children: [c.map(f), l.length > 0 && /* @__PURE__ */ L(Ze, {
					label: r("setupRun.more", { n: l.length }),
					initial: c.length === 0,
					children: /* @__PURE__ */ L("div", {
						class: "stack",
						children: l.map(f)
					})
				})]
			}),
			/* @__PURE__ */ L("div", {
				class: "actions",
				children: /* @__PURE__ */ L(U, {
					primary: !0,
					onClick: d,
					children: [B.play(), r(t ? "draft.startTest" : "setupRun.start")]
				})
			}),
			t && /* @__PURE__ */ L(st, { draft: {
				pendingId: t.pendingId,
				name: e.name
			} })
		]
	});
}
function ut({ s: e, index: t, isStopAfter: n, runId: r }) {
	let i = R(), { t: a, dur: o } = I(), s = e.state === "ok" ? /* @__PURE__ */ L("span", {
		class: "st ok",
		children: B.check()
	}) : e.state === "failed" ? /* @__PURE__ */ L("span", {
		class: "st bad",
		children: B.x()
	}) : e.state === "running" ? /* @__PURE__ */ L("span", {
		class: "st run",
		children: B.spinner()
	}) : e.state === "waiting" ? /* @__PURE__ */ L("span", {
		class: "st warn",
		children: B.pause()
	}) : e.state === "skipped" ? /* @__PURE__ */ L("span", {
		class: "st pending",
		children: B.skip()
	}) : /* @__PURE__ */ L("span", {
		class: "st pending",
		children: B.circle()
	}), c = e.state === "pending" || e.state === "skipped" ? " is-pending" : e.state === "running" || e.state === "waiting" ? " is-active" : e.state === "failed" ? " is-failed" : "", l = e.state === "ok" || e.state === "failed", u = /* @__PURE__ */ L(C, { children: [
		/* @__PURE__ */ L("span", {
			class: "num",
			children: t + 1
		}),
		s,
		/* @__PURE__ */ L("div", {
			class: "row-main",
			children: /* @__PURE__ */ L("div", {
				class: "row-title",
				children: e.stepName
			})
		}),
		n && /* @__PURE__ */ L("span", {
			class: "tag",
			children: a("run.testStop")
		}),
		/* @__PURE__ */ L("span", {
			class: "row-meta",
			children: l ? o(e.durationMs) : ""
		}),
		l && /* @__PURE__ */ L("span", {
			class: "st pending",
			children: B.chevron()
		})
	] }), d = l ? /* @__PURE__ */ L("button", {
		class: `row${c}`,
		onClick: () => i.open("show_step", {
			runId: r,
			stepId: e.stepId
		}, "push"),
		children: u
	}) : /* @__PURE__ */ L("div", {
		class: `row${c}`,
		children: u
	});
	return e.download ? /* @__PURE__ */ L("div", {
		class: "row-wrap",
		children: [d, /* @__PURE__ */ L("div", {
			class: "row-expand",
			style: "padding-left:44px",
			children: /* @__PURE__ */ L(ft, {
				file: e.download,
				runId: r,
				stepId: e.stepId
			})
		})]
	}) : d;
}
function dt(e) {
	if (e < 1024) return `${e} B`;
	let t = [
		"KB",
		"MB",
		"GB"
	], n = e / 1024, r = 0;
	for (; n >= 1024 && r < t.length - 1;) n /= 1024, r++;
	return `${n >= 10 ? Math.round(n) : Math.round(n * 10) / 10} ${t[r]}`;
}
function ft({ file: e, runId: t, stepId: n }) {
	let r = R(), { t: i } = I(), [a, o] = N(!1), s = [e.folder, e.fileName].filter(Boolean).join("/");
	if (!e.done) {
		let t = e.received ?? e.bytes, n = e.total ? Math.min(100, Math.round(t / e.total * 100)) : void 0;
		return /* @__PURE__ */ L("div", {
			class: "stack",
			style: "gap:4px;width:100%",
			children: [/* @__PURE__ */ L("div", {
				class: "row-sub",
				children: [
					i("dl.saving", { name: s }),
					" ",
					e.total ? `${dt(t)} / ${dt(e.total)}` : dt(t)
				]
			}), /* @__PURE__ */ L("div", {
				class: "bar",
				children: n === void 0 ? /* @__PURE__ */ L("i", { style: { width: "30%" } }) : /* @__PURE__ */ L("i", { style: { width: `${n}%` } })
			})]
		});
	}
	return /* @__PURE__ */ L("div", {
		style: "display:flex;gap:8px;align-items:center;width:100%",
		children: [/* @__PURE__ */ L("div", {
			class: "row-main",
			children: [/* @__PURE__ */ L("div", {
				class: "row-title",
				title: s,
				children: i("dl.saved", { name: s })
			}), /* @__PURE__ */ L("div", {
				class: "row-sub",
				children: a ? i("dl.gone") : dt(e.bytes)
			})]
		}), /* @__PURE__ */ L(U, {
			onClick: async () => {
				let e = await r.bridge.call("ui_show_file", {
					runId: t,
					stepId: n
				});
				o(!e.payload?.shown);
			},
			children: i("dl.show")
		})]
	});
}
function pt({ run: e }) {
	let t = e.steps.filter((e) => e.download);
	return t.length ? /* @__PURE__ */ L("div", {
		class: "list",
		children: t.map((t) => /* @__PURE__ */ L("div", {
			class: "row",
			children: /* @__PURE__ */ L(ft, {
				file: t.download,
				runId: e.runId,
				stepId: t.stepId
			})
		}))
	}) : null;
}
function mt(e, t) {
	if (t || e.length <= 7) return e.map((e, t) => ({
		s: e,
		i: t
	}));
	let n = e.findIndex((e) => e.state === "running" || e.state === "waiting" || e.state === "failed"), r = n >= 0 ? n : Math.max(0, e.findIndex((e) => e.state === "pending") - 1), i = Math.max(0, Math.min(r - 3, e.length - 7));
	return e.slice(i, i + 7).map((e, t) => ({
		s: e,
		i: i + t
	}));
}
function ht({ run: e }) {
	let { t } = I();
	return /* @__PURE__ */ L(Ze, {
		label: t("run.steps", { n: e.steps.length }),
		children: /* @__PURE__ */ L("div", {
			class: "list",
			children: e.steps.map((t, n) => /* @__PURE__ */ L(ut, {
				s: t,
				index: n,
				runId: e.runId,
				isStopAfter: t.stepId === e.stopAfterStepId
			}))
		})
	});
}
function gt({ run: e }) {
	let t = R(), { t: n, dur: r } = I(), [i, a] = N(e), [o, s] = N(!1), c = F(), l = F(e.status === "running" || e.status === "waiting_manual");
	P(() => a(e), [e]);
	let u = i.status === "running" || i.status === "waiting_manual", d = i.live?.url, f = F(i.status);
	if (f.current = i.status, P(() => {
		if (!u) return;
		let e = !1, n = !1, r = !1, o = async () => {
			if (n) r = !0;
			else {
				n = !0;
				try {
					do {
						r = !1;
						let n = await t.bridge.call("show_run", { runId: i.runId });
						!e && "run" in n.payload && a(n.payload.run);
					} while (r && !e);
				} catch {} finally {
					n = !1;
				}
			}
		}, s, c = (e) => {
			s ??= setInterval(o, e);
		}, l, p;
		if (d && typeof EventSource < "u") {
			let e = Date.now();
			try {
				l = new EventSource(d);
				let t = !0, n = (n) => {
					e = Date.now();
					let r = null;
					try {
						r = JSON.parse(n.data)?.data ?? null;
					} catch {}
					let i = t || !r?.status || !r.steps;
					if (t = !1, r?.status && r.steps) {
						let e = r.steps;
						if (a((t) => ({
							...t,
							steps: t.steps.map((t) => {
								let n = e[t.stepId];
								return n ? {
									...t,
									state: n[0] === "stopped" ? "skipped" : n[0],
									durationMs: n[1] ?? t.durationMs
								} : t;
							})
						})), r.status !== "running" || f.current !== "running") {
							o();
							return;
						}
					}
					i && o();
				};
				l.addEventListener("put", n), l.addEventListener("patch", n), l.addEventListener("keep-alive", () => {
					e = Date.now();
				}), l.onerror = () => {
					l?.readyState === EventSource.CLOSED && c(3e3);
				}, p = setInterval(() => {
					Date.now() - e > 7e4 && (e = Date.now(), o());
				}, 1e4);
			} catch {
				c(3e3);
			}
		} else c(1e3);
		return () => {
			e = !0, l?.close(), s && clearInterval(s), p && clearInterval(p);
		};
	}, [
		u,
		i.runId,
		d
	]), P(() => {
		if (u || !l.current || c.current === i.status) return;
		c.current = i.status;
		let e = i.failure;
		t.bridge.updateContext(e ? `Run ${i.runId} of ${i.workflowName} failed at step ${e.stepIndex + 1} "${e.stepName}": ${e.reason}` : `Run ${i.runId} of ${i.workflowName} finished: ${i.status}${i.result ? `, ${i.result.rows} rows` : ""}`).catch(() => {});
	}, [i.status]), i.status === "failure") return /* @__PURE__ */ L(_t, { run: i });
	let p = i.steps.filter((e) => e.state === "ok").length, m = i.stopAfterStepId ? i.steps.findIndex((e) => e.stepId === i.stopAfterStepId) + 1 : i.steps.length, h = i.steps.reduce((e, t) => e + (t.durationMs ?? 0), 0), g = () => i.draft ? t.open("ui_test_draft", {
		pendingId: i.draft.pendingId,
		variables: i.variables
	}, "replace") : t.open("run_workflow", {
		id: i.workflowId,
		variables: i.variables
	}, "replace"), _ = i.draft && /* @__PURE__ */ L(st, {
		draft: i.draft,
		primary: i.status === "success"
	}, i.runId), v = t.canBack && /* @__PURE__ */ L("button", {
		class: "back",
		onClick: t.back,
		children: n("common.back")
	});
	if (i.status === "success") {
		let e = i.stopAfterStepId;
		return /* @__PURE__ */ L("div", {
			class: "w",
			children: [
				v,
				/* @__PURE__ */ L("div", {
					class: "result",
					children: [/* @__PURE__ */ L("span", {
						class: "big ok",
						children: B.check()
					}), /* @__PURE__ */ L("div", {
						class: "hd-main",
						children: [/* @__PURE__ */ L("div", {
							class: "title",
							children: e ? n("run.changeWorks", { n: m }) : n("run.done", { n: i.steps.length })
						}), /* @__PURE__ */ L("div", {
							class: "sub",
							children: [
								i.workflowName,
								" ",
								i.version === 0 ? `· ${n("draft.testing")}` : `v${i.version}`,
								" · ",
								r(h),
								!e && i.result ? ` · ${n("run.items", { n: i.result.rows })}` : ""
							]
						})]
					})]
				}),
				/* @__PURE__ */ L(pt, { run: i }),
				/* @__PURE__ */ L(ht, { run: i }),
				/* @__PURE__ */ L(nt, {
					heading: n("ask.runTitle"),
					placeholder: n("ask.phRun"),
					message: (e) => n("msg.aboutRun", {
						runId: i.runId,
						text: e
					}),
					context: `The user is asking about run ${i.runId} of workflow "${i.workflowName}" (id ${i.workflowId}, v${i.version}), which finished OK${e ? " (a test that stopped after one step on purpose)" : ""}. Read it with get_run and get_run_data, and a step with get_step. If the workflow should change, answer with propose_change.`
				}, i.runId),
				/* @__PURE__ */ L("div", {
					class: "actions",
					children: e ? /* @__PURE__ */ L(U, {
						primary: !0,
						onClick: g,
						children: [B.play(), n("run.runFull")]
					}) : /* @__PURE__ */ L(C, { children: [/* @__PURE__ */ L(U, {
						ghost: !0,
						onClick: g,
						children: n(i.draft ? "draft.testAgain" : "run.runAgain")
					}), /* @__PURE__ */ L(U, {
						primary: !i.draft,
						onClick: () => t.open("show_run_data", { runId: i.runId }, "push"),
						children: n("run.viewData")
					})] })
				}),
				_
			]
		});
	}
	if (i.status === "stopped") {
		let e = i.steps.findIndex((e) => e.state === "skipped" || e.state === "pending");
		return /* @__PURE__ */ L("div", {
			class: "w",
			children: [
				v,
				/* @__PURE__ */ L("div", {
					class: "result",
					children: [/* @__PURE__ */ L("span", {
						class: "big",
						style: "background:var(--bg-2);color:var(--fg-2)",
						children: B.skip()
					}), /* @__PURE__ */ L("div", {
						class: "hd-main",
						children: [/* @__PURE__ */ L("div", {
							class: "title",
							children: n("run.stoppedAt", { n: e + 1 })
						}), /* @__PURE__ */ L("div", {
							class: "sub",
							children: [
								i.workflowName,
								" ",
								i.version === 0 ? `· ${n("draft.testing")}` : `v${i.version}`
							]
						})]
					})]
				}),
				/* @__PURE__ */ L(ht, { run: i }),
				/* @__PURE__ */ L("div", {
					class: "actions",
					children: /* @__PURE__ */ L(U, {
						primary: !i.draft,
						onClick: g,
						children: n(i.draft ? "draft.testAgain" : "run.runAgain")
					})
				}),
				_
			]
		});
	}
	let y = mt(i.steps, o), b = async (e) => {
		let n = await t.bridge.call(e, { runId: i.runId });
		"run" in n.payload && a(n.payload.run);
	};
	return /* @__PURE__ */ L("div", {
		class: "w",
		children: [
			/* @__PURE__ */ L(V, {
				title: i.workflowName,
				sub: /* @__PURE__ */ L(C, { children: [i.version === 0 ? n("draft.testing") : `v${i.version}`, i.stopAfterStepId ? ` · ${n("run.testing")}` : ""] }),
				right: /* @__PURE__ */ L(Ye, { status: i.status })
			}),
			/* @__PURE__ */ L("div", {
				class: "stack",
				style: "gap:6px",
				children: [/* @__PURE__ */ L("div", {
					class: "bar",
					children: /* @__PURE__ */ L("i", { style: { width: `${Math.round(p / m * 100)}%` } })
				}), /* @__PURE__ */ L("div", {
					class: "muted",
					children: n("run.progress", {
						done: p,
						total: m
					})
				})]
			}),
			i.manual && /* @__PURE__ */ L(H, {
				kind: "warn",
				children: n("run.manual", { instruction: i.manual.instruction })
			}),
			/* @__PURE__ */ L("div", {
				class: "list",
				children: [
					y[0]?.i > 0 && /* @__PURE__ */ L("div", {
						class: "row is-pending",
						children: [/* @__PURE__ */ L("span", { class: "num" }), /* @__PURE__ */ L("span", {
							class: "muted",
							children: n("run.earlier", { n: y[0].i })
						})]
					}),
					y.map(({ s: e, i: t }) => /* @__PURE__ */ L(ut, {
						s: e,
						index: t,
						runId: i.runId,
						isStopAfter: e.stepId === i.stopAfterStepId
					})),
					!o && y.length < i.steps.length && /* @__PURE__ */ L("button", {
						class: "more",
						onClick: () => s(!0),
						children: n("common.showAll", { n: i.steps.length })
					})
				]
			}),
			/* @__PURE__ */ L("div", {
				class: "actions",
				children: i.manual ? /* @__PURE__ */ L(C, { children: [/* @__PURE__ */ L(U, {
					ghost: !0,
					onClick: () => b("ui_stop_run"),
					children: n("run.stop")
				}), /* @__PURE__ */ L(U, {
					primary: !0,
					onClick: () => b("ui_resume_manual"),
					children: n("run.resume")
				})] }) : /* @__PURE__ */ L(U, {
					onClick: () => b("ui_stop_run"),
					children: n("run.stopRun")
				})
			}),
			_
		]
	});
}
function _t({ run: e, inspecting: t }) {
	let n = R(), { t: r } = I(), i = e.failure, a = ct(i, r), o = e.version === 0 ? `Test run ${e.runId} of the proposed workflow "${e.workflowName}" (id ${e.workflowId}, not saved yet) failed at step ${i.stepIndex + 1} [${i.stepId}] "${i.stepName}". Call get_failure("${e.runId}") for the error, screenshot and HTML, then answer with propose_workflow: the whole workflow, fixed (propose_change cannot be used, it is not saved).` : `Run ${e.runId} of workflow "${e.workflowName}" (id ${e.workflowId}, v${e.version}) failed at step ${i.stepIndex + 1} [${i.stepId}] "${i.stepName}". Call get_failure("${e.runId}") for the error, screenshot and HTML, then propose_change with runId "${e.runId}".`, s = () => e.draft ? n.open("ui_test_draft", {
		pendingId: e.draft.pendingId,
		variables: e.variables
	}, "replace") : n.open("run_workflow", {
		id: e.workflowId,
		variables: e.variables
	}, "replace"), c = i.errorType === "browser_unavailable";
	return /* @__PURE__ */ L("div", {
		class: "w",
		children: [
			/* @__PURE__ */ L(V, {
				title: r("fail.title", {
					n: i.stepIndex + 1,
					total: e.steps.length
				}),
				sub: `${e.workflowName} · ${e.version === 0 ? r("draft.testing") : `v${e.version}`}`,
				right: /* @__PURE__ */ L(Ye, { status: "failure" })
			}),
			/* @__PURE__ */ L("div", {
				class: "stack",
				style: "gap:4px",
				children: [/* @__PURE__ */ L("div", {
					class: "row-title",
					children: i.stepName
				}), /* @__PURE__ */ L("div", {
					style: "color:var(--bad);font-size:13px",
					children: a
				})]
			}),
			i.hasScreenshot && /* @__PURE__ */ L($e, {
				runId: e.runId,
				stepId: i.stepId,
				alt: r("fail.shotAlt", { n: i.stepIndex + 1 })
			}),
			/* @__PURE__ */ L(ht, { run: e }),
			/* @__PURE__ */ L(Ze, {
				label: r("common.details"),
				children: [
					/* @__PURE__ */ L("dl", {
						class: "kv",
						children: [
							/* @__PURE__ */ L("dt", { children: r("fail.url") }),
							/* @__PURE__ */ L("dd", {
								class: "mono",
								children: i.url
							}),
							/* @__PURE__ */ L("dt", { children: r("fail.error") }),
							/* @__PURE__ */ L("dd", {
								class: "mono",
								children: i.errorType
							}),
							/* @__PURE__ */ L("dt", { children: r("fail.console") }),
							/* @__PURE__ */ L("dd", { children: i.consoleErrors.length ? i.consoleErrors.join("; ") : r("fail.noErrors") })
						]
					}),
					/* @__PURE__ */ L("pre", {
						class: "code",
						children: i.stack
					}),
					/* @__PURE__ */ L("pre", {
						class: "code",
						children: JSON.stringify(i.variables, null, 2)
					})
				]
			}),
			t ? /* @__PURE__ */ L(H, {
				kind: "info",
				children: r("fail.inspecting")
			}) : c ? /* @__PURE__ */ L("div", {
				class: "actions",
				children: /* @__PURE__ */ L(U, {
					primary: !0,
					onClick: s,
					children: r(e.draft ? "draft.testAgain" : "run.runAgain")
				})
			}) : /* @__PURE__ */ L(C, { children: [/* @__PURE__ */ L(nt, {
				label: r("ask.fix"),
				allowEmpty: !0,
				placeholder: r("ask.phFailed"),
				message: (t) => t ? `${r("msg.fixRun", { runId: e.runId })} ${t}` : r("msg.fixRun", { runId: e.runId }),
				context: o
			}, e.runId), /* @__PURE__ */ L("div", {
				class: "actions",
				children: /* @__PURE__ */ L(U, {
					ghost: !0,
					onClick: s,
					children: r(e.draft ? "draft.testAgain" : "run.runAgain")
				})
			})] }),
			e.draft && /* @__PURE__ */ L(st, { draft: e.draft }, e.runId)
		]
	});
}
// ui/views/runs.tsx
var vt = 5;
function yt({ runs: e }) {
	let t = R(), { t: n, ago: r, dur: i } = I(), [a, o] = N(!1);
	if (!e.length) return /* @__PURE__ */ L("div", {
		class: "empty",
		children: n("runs.none")
	});
	let s = a ? e : e.slice(0, vt), c = (e) => e.status === "success" ? e.testUntilStep ? n("runs.testPassed", { n: e.testUntilStep }) : n("runs.done", { n: e.stepCount }) : e.status === "failure" ? n("runs.failedAt", {
		n: e.atStep,
		name: e.atStepName
	}) : e.status === "stopped" ? n("runs.stoppedAt", { n: e.atStep }) : e.status === "waiting_manual" ? n("runs.waiting") : n("runs.runningAt", { n: e.atStep });
	return /* @__PURE__ */ L("div", {
		class: "list",
		children: [s.map((e) => /* @__PURE__ */ L("button", {
			class: "row",
			onClick: () => t.open("show_run", { runId: e.runId }, "push"),
			children: [
				/* @__PURE__ */ L(Xe, { status: e.status }),
				/* @__PURE__ */ L("div", {
					class: "row-main",
					children: [/* @__PURE__ */ L("div", {
						class: "row-title",
						children: c(e)
					}), /* @__PURE__ */ L("div", {
						class: "row-sub",
						children: [
							r(e.at),
							" · v",
							e.version,
							e.rows === void 0 ? "" : ` · ${n("data.items", { n: e.rows })}`,
							e.testUntilStep ? ` · ${n("runs.test")}` : ""
						]
					})]
				}),
				/* @__PURE__ */ L("span", {
					class: "row-meta",
					children: i(e.durationMs)
				})
			]
		})), !a && e.length > vt && /* @__PURE__ */ L("button", {
			class: "more",
			onClick: () => o(!0),
			children: n("common.showAll", { n: e.length })
		})]
	});
}
function bt({ workflowName: e, runs: t }) {
	let { t: n } = I();
	return /* @__PURE__ */ L("div", {
		class: "w",
		children: [/* @__PURE__ */ L(V, {
			title: n("runs.title"),
			sub: e
		}), /* @__PURE__ */ L(yt, { runs: t })]
	});
}
function xt({ step: e }) {
	let { t, dur: n } = I(), r = e.state === "failed", i = e.error ? ct(e.error, t) : void 0, a = e.state === "ok" ? /* @__PURE__ */ L(Ye, { status: "success" }) : r ? /* @__PURE__ */ L(Ye, { status: "failure" }) : /* @__PURE__ */ L("span", {
		class: "pill muted",
		children: t(e.state === "skipped" ? "sr.skipped" : e.state === "waiting" ? "sr.waiting" : e.state === "running" ? "sr.running" : "sr.notReached")
	}), o = t(`stepType.${e.stepType}`);
	return /* @__PURE__ */ L("div", {
		class: "w",
		children: [
			/* @__PURE__ */ L(V, {
				title: `${e.stepIndex + 1}. ${e.stepName}`,
				sub: `${e.workflowName} · v${e.version} · ${e.runId}${e.durationMs === void 0 ? "" : ` · ${n(e.durationMs)}`}`,
				right: a
			}),
			/* @__PURE__ */ L("div", {
				class: "mono muted",
				style: "overflow-wrap:anywhere",
				children: [
					o,
					" · ",
					e.detail
				]
			}),
			i && /* @__PURE__ */ L("div", {
				style: "color:var(--bad);font-size:13px",
				children: i
			}),
			e.download && /* @__PURE__ */ L("div", {
				class: "list",
				children: /* @__PURE__ */ L("div", {
					class: "row",
					children: /* @__PURE__ */ L(ft, {
						file: e.download,
						runId: e.runId,
						stepId: e.stepId
					})
				})
			}),
			e.hasScreenshot && /* @__PURE__ */ L($e, {
				runId: e.runId,
				stepId: e.stepId,
				alt: t("sr.alt", { n: e.stepIndex + 1 })
			}),
			e.output && /* @__PURE__ */ L(Ze, {
				label: t("common.output"),
				initial: e.stepType === "extractData",
				children: /* @__PURE__ */ L("pre", {
					class: "code",
					children: e.output
				})
			}),
			e.apiCalls && /* @__PURE__ */ L(Ze, {
				label: t("sr.requests", { n: e.apiCallCount ?? e.apiCalls.length }),
				children: /* @__PURE__ */ L("pre", {
					class: "code",
					children: e.apiCalls.map((e) => `${e.method} ${e.url}`).join("\n")
				})
			}),
			/* @__PURE__ */ L(Ze, {
				label: t("common.details"),
				children: [/* @__PURE__ */ L("dl", {
					class: "kv",
					children: [
						e.url && /* @__PURE__ */ L(C, { children: [/* @__PURE__ */ L("dt", { children: t("fail.url") }), /* @__PURE__ */ L("dd", {
							class: "mono",
							children: e.url
						})] }),
						/* @__PURE__ */ L("dt", { children: t("sr.stepId") }),
						/* @__PURE__ */ L("dd", {
							class: "mono",
							children: e.stepId
						})
					]
				}), /* @__PURE__ */ L("pre", {
					class: "code",
					children: JSON.stringify(e.variablesBefore, null, 2)
				})]
			}),
			e.state === "ok" || r ? /* @__PURE__ */ L(nt, {
				label: t(r ? "ask.fix" : "ask.button"),
				allowEmpty: r,
				placeholder: t(r ? "ask.phFailed" : "ask.phEdit"),
				suggestions: r ? [] : e.stepType === "extractData" ? [t("sug.rowsMissing"), t("sug.addField")] : [t("sug.wrongThing")],
				message: (n) => t(r ? "msg.stepFailed" : "msg.stepOk", {
					runId: e.runId,
					stepId: e.stepId,
					text: n
				}),
				context: `The user is asking about step ${e.stepIndex + 1} [${e.stepId}] "${e.stepName}" in run ${e.runId} of workflow "${e.workflowName}" (id ${e.workflowId}, v${e.version}); the step ${r ? "failed" : "finished OK"}. Read it with get_step(runId, stepId)${r ? " and get_failure(runId)" : ""}, then propose_change${r ? " with runId" : ""}.`
			}) : /* @__PURE__ */ L("div", {
				class: "muted",
				children: [
					B.circle(),
					" ",
					t("sr.didntRun")
				]
			})
		]
	});
}
// ui/views/workflow.tsx
var St = 6, Ct = {
	executeXpathCommand: ["sug.stableSelector", "sug.waitFirst"],
	extractData: ["sug.alsoLink", "sug.skipEmpty"],
	navigate: ["sug.otherUrl"],
	delay: ["sug.waitElement"],
	javascript: ["sug.explainJs"],
	if: ["sug.explainIf"],
	switch: ["sug.explainSwitch"],
	manual: ["sug.automate"],
	download: ["sug.fileName", "sug.otherFile"]
};
function wt({ steps: e, limit: t = St, workflow: n }) {
	let { t: r } = I(), [i, a] = N(), [o, s] = N(!1);
	return /* @__PURE__ */ L("div", {
		class: "list",
		children: [(o ? e : e.slice(0, t)).map((e, t) => {
			let o = r(`stepType.${e.stepType}`), s = e.detail.startsWith("waitFor") ? ["sug.stableSelector", "sug.waitLonger"] : Ct[e.stepType];
			return /* @__PURE__ */ L("div", {
				class: "row-wrap",
				children: [/* @__PURE__ */ L("button", {
					class: "row",
					"aria-expanded": i === e.id,
					onClick: () => a(i === e.id ? void 0 : e.id),
					children: [
						/* @__PURE__ */ L("span", {
							class: "num",
							children: t + 1
						}),
						/* @__PURE__ */ L(Je, { type: e.stepType }),
						/* @__PURE__ */ L("div", {
							class: "row-main",
							children: [/* @__PURE__ */ L("div", {
								class: "row-title",
								children: e.stepName
							}), /* @__PURE__ */ L("div", {
								class: "row-sub mono",
								children: e.detail
							})]
						})
					]
				}), i === e.id && /* @__PURE__ */ L("div", {
					class: "row-expand",
					children: [
						/* @__PURE__ */ L("div", { children: [
							/* @__PURE__ */ L("span", {
								class: "tag",
								children: o
							}),
							" ",
							/* @__PURE__ */ L("span", {
								class: "mono",
								children: e.id
							})
						] }),
						e.description && /* @__PURE__ */ L("div", { children: e.description }),
						e.code && /* @__PURE__ */ L("pre", {
							class: "code",
							children: e.code
						}),
						n && /* @__PURE__ */ L(nt, {
							placeholder: r("ask.phEdit"),
							suggestions: s.map((e) => r(e)),
							message: (t) => r("msg.editStep", {
								id: n.id,
								stepId: e.id,
								text: t
							}),
							context: `The user wants to change step ${t + 1} [${e.id}] "${e.stepName}" (${e.stepType}) of workflow "${n.name}" (id ${n.id}, v${n.version}). Read it with get_workflow, then answer with propose_change.`
						}, e.id)
					]
				})]
			});
		}), !o && e.length > t && /* @__PURE__ */ L("button", {
			class: "more",
			onClick: () => s(!0),
			children: r("common.showAll", { n: e.length })
		})]
	});
}
function Tt(e, t) {
	return e.kind === "saved" ? t("wf.saved", { v: e.version }) : e.kind === "restored" ? t("wf.restored", {
		v: e.version,
		from: e.from
	}) : t("wf.discarded", { v: e.version });
}
async function Et(e, t, n) {
	let r = await e.bridge.call("get_workflow", { id: t }), i = r.text.indexOf("Full definition:\n");
	if (r.isError || i < 0) return;
	let a = r.text.slice(i + 17, r.text.lastIndexOf("}") + 1);
	await e.bridge.download(`${n.toLowerCase().replace(/\W+/g, "-") || t}.json`, "application/json", a);
}
function Dt({ workflow: e, notice: t }) {
	let n = R(), { t: r } = I(), [i, a] = N("steps"), [o, s] = N();
	return P(() => {
		i !== "runs" || o || n.bridge.call("list_runs", { workflowId: e.id }).then((e) => {
			e.payload.view === "runs" && s(e.payload.runs);
		});
	}, [i]), /* @__PURE__ */ L("div", {
		class: "w",
		children: [
			/* @__PURE__ */ L(V, {
				title: e.name,
				sub: `${e.host || r("wf.hostFromInputs")} · v${e.version}`,
				right: /* @__PURE__ */ L(Qe, { items: [{
					label: r("wf.history"),
					onClick: () => n.open("show_history", { id: e.id }, "push")
				}, {
					label: r("wf.export"),
					onClick: () => Et(n, e.id, e.name)
				}] })
			}),
			t && /* @__PURE__ */ L(H, {
				kind: t.kind === "discarded" ? "info" : "ok",
				children: Tt(t, r)
			}),
			/* @__PURE__ */ L("div", {
				class: "seg",
				role: "group",
				children: [/* @__PURE__ */ L("button", {
					"aria-pressed": i === "steps",
					onClick: () => a("steps"),
					children: r("wf.stepsTab", { n: e.steps.length })
				}), /* @__PURE__ */ L("button", {
					"aria-pressed": i === "runs",
					onClick: () => a("runs"),
					children: r("wf.runsTab")
				})]
			}),
			i === "steps" ? /* @__PURE__ */ L(wt, {
				steps: e.steps,
				workflow: e
			}) : o ? /* @__PURE__ */ L(yt, { runs: o }) : /* @__PURE__ */ L("div", {
				class: "stack",
				"aria-busy": "true",
				children: [/* @__PURE__ */ L("div", { class: "skel" }), /* @__PURE__ */ L("div", { class: "skel" })]
			}),
			/* @__PURE__ */ L(nt, {
				heading: r("ask.wfTitle"),
				placeholder: r("ask.phWorkflow"),
				message: (t) => r("msg.editWorkflow", {
					id: e.id,
					text: t
				}),
				context: `The user wants to change workflow "${e.name}" (id ${e.id}, v${e.version}) as a whole, not one step. Read it with get_workflow, explore the site with the page_* inspector tools when the change needs new selectors or code, then answer with propose_change.`
			}, e.id),
			/* @__PURE__ */ L("div", {
				class: "actions",
				children: /* @__PURE__ */ L(U, {
					primary: !0,
					onClick: () => n.open("run_workflow", {
						id: e.id,
						form: !0
					}, "push"),
					children: [B.play(), r("wf.run")]
				})
			})
		]
	});
}
// ui/views/misc.tsx
function Ot(e) {
	let t = R(), { t: n } = I(), [r, i] = N(!1);
	return r ? /* @__PURE__ */ L("div", {
		class: "w",
		children: /* @__PURE__ */ L(H, {
			kind: "info",
			children: n(e.isFix ? "chg.discardedFix" : "chg.discardedChange", {
				name: e.workflowName,
				v: e.fromVersion
			})
		})
	}) : /* @__PURE__ */ L("div", {
		class: "w",
		children: [
			/* @__PURE__ */ L(V, {
				title: n(e.isFix ? "chg.fixTitle" : "chg.changeTitle"),
				sub: `${e.workflowName} · v${e.fromVersion} → v${e.fromVersion + 1}`
			}),
			/* @__PURE__ */ L("div", {
				style: "font-size:13px",
				children: e.reason
			}),
			/* @__PURE__ */ L("div", {
				class: "list",
				children: e.changes.map((e) => /* @__PURE__ */ L("div", {
					class: "row-wrap",
					style: "padding:8px 10px;display:flex;flex-direction:column;gap:6px",
					children: [/* @__PURE__ */ L("div", {
						class: "row-title",
						children: [
							e.stepName,
							" ",
							/* @__PURE__ */ L("span", {
								class: "tag",
								children: n(`chg.${e.kind}`)
							})
						]
					}), /* @__PURE__ */ L("div", {
						class: "diff",
						children: [e.before && /* @__PURE__ */ L("div", {
							class: "del",
							"aria-label": n("chg.before"),
							children: e.before
						}), e.after && /* @__PURE__ */ L("div", {
							class: "add",
							"aria-label": n("chg.after"),
							children: e.after
						})]
					})]
				}))
			}),
			/* @__PURE__ */ L("div", {
				class: "actions",
				children: [/* @__PURE__ */ L(U, {
					ghost: !0,
					onClick: async () => {
						await t.bridge.call("ui_discard_change", { pendingId: e.pendingId }), i(!0);
					},
					children: n("chg.discard")
				}), /* @__PURE__ */ L(U, {
					primary: !0,
					onClick: () => t.open("ui_apply_change", { pendingId: e.pendingId }, "replace"),
					children: [B.play(), n("chg.apply")]
				})]
			})
		]
	});
}
function kt(e, t) {
	let n = (e) => {
		let t = e == null ? "" : typeof e == "object" ? JSON.stringify(e) : String(e);
		return /[",\n]/.test(t) ? `"${t.replace(/"/g, "\"\"")}"` : t;
	};
	return [e.join(","), ...t.map((t) => e.map((e) => n(t[e])).join(","))].join("\n");
}
function At(e) {
	let t = R(), { t: n } = I(), [r, i] = N(!1), a = e.columns.slice(0, 3), o = r ? e.rows : e.rows.slice(0, 5), s = e.workflowName.toLowerCase().replace(/\W+/g, "-");
	return /* @__PURE__ */ L("div", {
		class: "w",
		children: [
			/* @__PURE__ */ L(V, {
				title: n("data.items", { n: e.total }),
				sub: `${e.workflowName} · ${e.runId}`
			}),
			/* @__PURE__ */ L("div", {
				class: "tbl-wrap",
				children: /* @__PURE__ */ L("table", { children: [/* @__PURE__ */ L("thead", { children: /* @__PURE__ */ L("tr", { children: a.map((e) => /* @__PURE__ */ L("th", { children: e })) }) }), /* @__PURE__ */ L("tbody", { children: o.map((e) => /* @__PURE__ */ L("tr", { children: a.map((t) => /* @__PURE__ */ L("td", {
					title: String(e[t] ?? ""),
					children: String(e[t] ?? "")
				})) })) })] })
			}),
			e.rows.length > 5 && !r || e.columns.length > 3 ? /* @__PURE__ */ L("div", {
				class: "actions",
				style: "justify-content:flex-start",
				children: [e.rows.length > 5 && !r && /* @__PURE__ */ L("button", {
					class: "link",
					onClick: () => i(!0),
					children: n("common.showAll", { n: e.total })
				}), e.columns.length > 3 && /* @__PURE__ */ L("span", {
					class: "muted",
					children: n("data.extraCols", { n: e.columns.length - 3 })
				})]
			}) : null,
			/* @__PURE__ */ L("div", {
				class: "actions",
				children: [/* @__PURE__ */ L(U, {
					ghost: !0,
					onClick: () => t.bridge.download(`${s}.json`, "application/json", JSON.stringify(e.rows, null, 2)),
					children: n("data.json")
				}), /* @__PURE__ */ L(U, {
					primary: !0,
					onClick: () => t.bridge.download(`${s}.csv`, "text/csv", kt(e.columns, e.rows)),
					children: n("data.csv")
				})]
			})
		]
	});
}
function jt(e, t) {
	switch (e.kind) {
		case "initial": return t("hist.ev.initial");
		case "create": return t("hist.ev.create");
		case "import": return e.file ? t("hist.ev.import", { file: e.file }) : t("hist.ev.importNoFile");
		case "restore": return t("hist.ev.restore", { from: e.from });
		case "change": {
			let [n, ...r] = e.steps;
			return n ? t(`hist.ev.${n.kind}`, { name: n.name }) + (r.length ? t("hist.ev.more", { n: r.length }) : "") : t("hist.ev.update", { name: "" });
		}
	}
}
function Mt(e) {
	let t = R(), { t: n, ago: r } = I(), [i, a] = N(), [o, s] = N(!1), c = o ? e.versions : e.versions.slice(0, 5);
	return /* @__PURE__ */ L("div", {
		class: "w",
		children: [
			/* @__PURE__ */ L(V, {
				title: n("hist.title"),
				sub: e.workflowName
			}),
			/* @__PURE__ */ L("div", {
				class: "list",
				children: [c.map((o) => /* @__PURE__ */ L("div", {
					class: "row-wrap",
					children: [/* @__PURE__ */ L("button", {
						class: "row",
						disabled: o.current,
						"aria-expanded": i === o.version,
						onClick: () => a(i === o.version ? void 0 : o.version),
						children: [
							/* @__PURE__ */ L("span", {
								class: "tag",
								style: "flex:none",
								children: ["v", o.version]
							}),
							/* @__PURE__ */ L("div", {
								class: "row-main",
								children: [/* @__PURE__ */ L("div", {
									class: "row-title",
									children: jt(o.event, n)
								}), /* @__PURE__ */ L("div", {
									class: "row-sub",
									children: [
										n(`hist.who.${o.author}`),
										" · ",
										r(o.at)
									]
								})]
							}),
							o.current ? /* @__PURE__ */ L("span", {
								class: "pill ok",
								children: n("hist.current")
							}) : /* @__PURE__ */ L("span", {
								class: "st pending",
								children: B.chevron()
							})
						]
					}), i === o.version && /* @__PURE__ */ L("div", {
						class: "row-expand",
						style: "padding-left:10px;align-items:flex-end",
						children: /* @__PURE__ */ L(U, {
							primary: !0,
							onClick: () => t.open("ui_restore_version", {
								id: e.workflowId,
								version: o.version
							}, "replace"),
							children: n("hist.restore", { v: o.version })
						})
					})]
				})), !o && e.versions.length > 5 && /* @__PURE__ */ L("button", {
					class: "more",
					onClick: () => s(!0),
					children: n("common.showAll", { n: e.versions.length })
				})]
			}),
			e.versions.length === 1 && /* @__PURE__ */ L("div", {
				class: "muted",
				children: n("hist.onlyOne")
			})
		]
	});
}
function Nt({ compact: e = !1 }) {
	let t = R(), { t: n, lang: r } = I(), i = e ? ["en", "vi"] : [
		"auto",
		"en",
		"vi"
	], a = (n) => e ? r === n : t.langPref === n;
	return /* @__PURE__ */ L("div", {
		class: `seg${e ? " seg-sm" : ""}`,
		role: "group",
		"aria-label": n("lang.label"),
		children: i.map((r) => /* @__PURE__ */ L("button", {
			"aria-pressed": a(r),
			onClick: () => t.setLang(r),
			title: r === "auto" ? void 0 : n(`lang.${r}`),
			children: e ? r.toUpperCase() : n(`lang.${r}`)
		}))
	});
}
function Pt(e) {
	return e.account.page === void 0 ? /* @__PURE__ */ L(Rt, { ...e }) : /* @__PURE__ */ L(Lt, { ...e });
}
function Ft({ label: e, used: t, limit: n }) {
	return /* @__PURE__ */ L("div", {
		class: "meter",
		children: [/* @__PURE__ */ L("div", {
			class: "meter-top",
			children: [/* @__PURE__ */ L("span", { children: e }), /* @__PURE__ */ L("span", { children: n ? `${t} / ${n}` : t })]
		}), n > 0 && /* @__PURE__ */ L("div", {
			class: `bar${t / n > .9 ? " bad" : ""}`,
			children: /* @__PURE__ */ L("i", { style: { width: `${Math.min(100, t / n * 100)}%` } })
		})]
	});
}
function It({ a: e, limit: t, upgrade: n }) {
	let { t: r } = I(), i = e.usage, a = t.code.startsWith("limit_runs_") ? /* @__PURE__ */ L(Ft, {
		label: r(`acct.runs.${i.period}`),
		used: i.runs,
		limit: i.runsLimit
	}) : t.code.startsWith("limit_steps_") && i.steps !== void 0 ? /* @__PURE__ */ L(Ft, {
		label: r(`acct.steps.${i.period}`),
		used: i.steps,
		limit: i.stepsLimit ?? 0
	}) : t.code === "limit_workflows" ? /* @__PURE__ */ L(Ft, {
		label: r("acct.workflows"),
		used: i.workflows,
		limit: i.workflowsLimit
	}) : null;
	return /* @__PURE__ */ L(C, { children: [/* @__PURE__ */ L(H, {
		kind: "warn",
		children: [r(`error.${t.code}`, { arg: t.arg ?? "" }), n ? ` ${r("acct.limitUpgrade")}` : ""]
	}), a && /* @__PURE__ */ L("div", {
		class: "stack",
		children: a
	})] });
}
function Lt({ account: e, limit: t, retry: n }) {
	let r = R(), { t: i } = I(), a = e.plan === "paid", [o, s] = N(!1), c = async () => {
		let e = await r.bridge.call("ui_account_page");
		e.payload.url && await r.bridge.openLink(e.payload.url);
	};
	if (e.anonymous) return /* @__PURE__ */ L("div", {
		class: "w",
		children: [
			/* @__PURE__ */ L(V, {
				title: i("acct.title"),
				sub: i("acct.trying"),
				right: /* @__PURE__ */ L(Nt, { compact: !0 })
			}),
			t && /* @__PURE__ */ L(It, {
				a: e,
				limit: t,
				upgrade: !1
			}),
			/* @__PURE__ */ L("div", {
				class: "muted",
				children: i("acct.tryingHint")
			}),
			/* @__PURE__ */ L("div", {
				class: "actions",
				children: /* @__PURE__ */ L(U, {
					primary: !0,
					onClick: async () => {
						let e = await r.bridge.call("ui_account_link");
						e.payload.url && await r.bridge.openLink(e.payload.url);
					},
					children: i("acct.createOrLogin")
				})
			})
		]
	});
	let l = !a && e.links?.upgrade;
	return /* @__PURE__ */ L("div", {
		class: "w",
		children: [
			/* @__PURE__ */ L(V, {
				title: e.name || i("acct.title"),
				sub: a ? e.paidUntil ? i("acct.until", { date: e.paidUntil.slice(0, 10) }) : i("acct.planLife") : i("acct.planFree"),
				right: e.page ? /* @__PURE__ */ L("span", {
					class: `pill ${a ? "ok" : "muted"}`,
					children: i(a ? "acct.pro" : "acct.free")
				}) : /* @__PURE__ */ L(Nt, { compact: !0 })
			}),
			t && /* @__PURE__ */ L(It, {
				a: e,
				limit: t,
				upgrade: !!l
			}),
			t && n && o && /* @__PURE__ */ L("div", {
				class: "actions",
				children: /* @__PURE__ */ L(U, {
					onClick: () => r.open(n.tool, n.args, "replace"),
					children: i("acct.tryAgain")
				})
			}),
			(l || e.page) && /* @__PURE__ */ L("div", {
				class: "actions",
				children: [l && e.page && /* @__PURE__ */ L("button", {
					class: "link",
					style: "margin-right:auto",
					onClick: c,
					children: i("acct.details")
				}), l ? /* @__PURE__ */ L(U, {
					primary: !0,
					onClick: async () => {
						await r.bridge.openLink(e.links.upgrade), s(!0);
					},
					children: i("acct.upgrade")
				}) : /* @__PURE__ */ L(U, {
					onClick: c,
					children: i("acct.details")
				})]
			})
		]
	});
}
function Rt({ account: e, limit: t, retry: n }) {
	let r = R(), { t: i } = I(), [a, o] = N(!1), s = (e.plan === "free" || e.paidUntil) && e.links?.upgrade, c = (e, t, n) => /* @__PURE__ */ L(Ft, {
		label: e,
		used: t,
		limit: n
	}), l = i("acct.storage.computer"), u = e.storage.kind === "computer" ? e.storage : void 0;
	return /* @__PURE__ */ L("div", {
		class: "w",
		children: [
			/* @__PURE__ */ L(V, {
				title: i("acct.title"),
				sub: e.anonymous ? i("acct.anonymous") : [e.name, e.paidUntil ? i("acct.until", { date: e.paidUntil.slice(0, 10) }) : ""].filter(Boolean).join(" · ") || void 0,
				right: /* @__PURE__ */ L("span", {
					class: `pill ${e.plan === "paid" ? "ok" : "muted"}`,
					children: e.plan === "paid" ? i("acct.pro") : i("acct.free")
				})
			}),
			e.offline && /* @__PURE__ */ L(H, {
				kind: "warn",
				children: i("acct.offline")
			}),
			t && /* @__PURE__ */ L(It, {
				a: e,
				limit: t,
				upgrade: !!s
			}),
			t && n && a && /* @__PURE__ */ L("div", {
				class: "actions",
				children: /* @__PURE__ */ L(U, {
					onClick: () => r.open(n.tool, n.args, "replace"),
					children: i("acct.tryAgain")
				})
			}),
			/* @__PURE__ */ L("div", {
				class: "stack",
				children: [
					c(i(`acct.runs.${e.usage.period}`), e.usage.runs, e.usage.runsLimit),
					e.usage.steps !== void 0 && c(i(`acct.steps.${e.usage.period}`), e.usage.steps, e.usage.stepsLimit ?? 0),
					c(i("acct.workflows"), e.usage.workflows, e.usage.workflowsLimit)
				]
			}),
			/* @__PURE__ */ L("div", {
				class: "list",
				children: [
					e.anonymous && /* @__PURE__ */ L(zt, { refresh: !0 }),
					e.anonymous && e.name && /* @__PURE__ */ L("div", {
						class: "row",
						style: "flex-direction:column;align-items:stretch;gap:8px",
						children: [/* @__PURE__ */ L("div", {
							class: "row-main",
							children: /* @__PURE__ */ L("div", {
								class: "row-sub",
								style: "white-space:normal",
								children: i("acct.loginHint")
							})
						}), /* @__PURE__ */ L("div", { children: /* @__PURE__ */ L(U, {
							onClick: () => r.open("ui_sign_in", {}, "replace"),
							children: i("acct.login")
						}) })]
					}),
					/* @__PURE__ */ L("div", {
						class: "row",
						children: /* @__PURE__ */ L("div", {
							class: "row-main",
							children: [
								/* @__PURE__ */ L("div", {
									class: "row-sub",
									children: i("acct.storedIn")
								}),
								/* @__PURE__ */ L("div", {
									class: "row-title",
									children: l
								}),
								e.retentionDays ? /* @__PURE__ */ L("div", {
									class: "row-sub",
									children: i("acct.retention", { n: e.retentionDays })
								}) : null,
								u ? /* @__PURE__ */ L("div", {
									class: "row-sub",
									style: "white-space:normal",
									children: i("acct.storage.computerNote")
								}) : null,
								u ? /* @__PURE__ */ L("div", {
									class: "row-sub",
									style: "white-space:normal",
									children: [i("acct.keepRuns", { n: u.keepRuns }), u.bytes === void 0 ? "" : ` · ${i("acct.localUsed", {
										mb: Math.round(u.bytes / 1024 / 1024),
										n: u.runs ?? 0
									})}`]
								}) : null
							]
						})
					}),
					u?.warn && /* @__PURE__ */ L(H, {
						kind: "warn",
						children: i("acct.localWarn")
					})
				]
			}),
			/* @__PURE__ */ L("div", {
				class: "field",
				children: [/* @__PURE__ */ L("label", { children: i("lang.label") }), /* @__PURE__ */ L(Nt, {})]
			}),
			/* @__PURE__ */ L("div", {
				class: "actions",
				children: [!e.anonymous && e.name && /* @__PURE__ */ L("button", {
					class: "link",
					style: "margin-right:auto",
					onClick: () => r.open("ui_sign_out", {}, "replace"),
					children: i("acct.logout")
				}), s ? /* @__PURE__ */ L(U, {
					primary: !0,
					onClick: async () => {
						await r.bridge.openLink(e.links.upgrade), o(!0);
					},
					children: i("acct.upgrade")
				}) : e.plan === "paid" && e.links?.manage ? /* @__PURE__ */ L(U, {
					onClick: () => r.bridge.openLink(e.links.manage),
					children: i("acct.manage")
				}) : null]
			})
		]
	});
}
function zt({ onOpened: e, refresh: t }) {
	let n = R(), { t: r } = I(), [i, a] = N(!1);
	return /* @__PURE__ */ L("div", {
		class: "row",
		style: "flex-direction:column;align-items:stretch;gap:8px",
		children: [/* @__PURE__ */ L("div", {
			class: "row-main",
			children: [/* @__PURE__ */ L("div", {
				class: "row-title",
				children: r("acct.createTitle")
			}), /* @__PURE__ */ L("div", {
				class: "row-sub",
				style: "white-space:normal",
				children: r(i ? "acct.createOpened" : "acct.createHint")
			})]
		}), /* @__PURE__ */ L("div", { children: [/* @__PURE__ */ L(U, {
			primary: !i,
			onClick: async () => {
				let t = await n.bridge.call("ui_account_link");
				t.payload.url && (await n.bridge.openLink(t.payload.url), a(!0), e?.());
			},
			children: r(i ? "acct.createAgain" : "acct.create")
		}), i && t && /* @__PURE__ */ L(C, { children: [" ", /* @__PURE__ */ L(U, {
			primary: !0,
			onClick: () => n.open("show_account", {}, "replace"),
			children: r("acct.createDone")
		})] })] })]
	});
}
// ui/views/setup.tsx
var Bt = "https://chromewebstore.google.com/search/Browser%20Workflow";
function Vt({ link: e, onReady: t }) {
	let n = R(), { t: r } = I();
	return /* @__PURE__ */ L(C, { children: [
		/* @__PURE__ */ L("div", {
			class: "stack",
			style: "gap:4px",
			children: [/* @__PURE__ */ L("div", {
				class: "row-title",
				children: r("setup.extTitle")
			}), /* @__PURE__ */ L("div", {
				class: "muted",
				children: r("setup.extNote")
			})]
		}),
		/* @__PURE__ */ L(H, {
			kind: "warn",
			children: r("setup.extOpen")
		}),
		/* @__PURE__ */ L("div", {
			class: "actions",
			children: [/* @__PURE__ */ L(U, {
				ghost: !0,
				onClick: () => n.bridge.openLink(e || Bt),
				children: r("setup.extGet")
			}), /* @__PURE__ */ L(U, {
				primary: !0,
				onClick: async () => {
					await n.open("setup", {}, "replace"), t?.();
				},
				children: r("setup.extCheck")
			})]
		})
	] });
}
function Ht(e) {
	let t = R(), { t: n } = I(), r = ["extension", "first"], i = e.step === "extension" ? "extension" : "first", a = r.indexOf(i), [o, s] = N(!1), [c, l] = N(!1), u = rt();
	async function d() {
		await t.bridge.call("ui_finish_setup"), l(!0), await et(t.bridge, n("msg.setupDone"), "The user finished setup in the widget. Go on with what they asked for. If they asked for nothing yet, call list_workflows and ask in one line which example to run first, or what they want to automate.").catch(() => {});
	}
	return c ? /* @__PURE__ */ L("div", {
		class: "w",
		children: /* @__PURE__ */ L(H, {
			kind: "ok",
			children: n("setup.ready")
		})
	}) : /* @__PURE__ */ L("div", {
		class: "w",
		children: [
			/* @__PURE__ */ L("div", {
				class: "hd",
				children: [/* @__PURE__ */ L("div", {
					class: "hd-main",
					children: [/* @__PURE__ */ L("h1", {
						class: "title",
						children: n("setup.title")
					}), /* @__PURE__ */ L("div", {
						class: "sub",
						children: n("setup.stepOf", {
							n: a + 1,
							total: r.length
						})
					})]
				}), /* @__PURE__ */ L(Nt, { compact: !0 })]
			}),
			/* @__PURE__ */ L("div", {
				class: "steps-dots",
				"aria-hidden": "true",
				children: r.map((e, t) => /* @__PURE__ */ L("i", { class: t <= a ? "on" : "" }, e))
			}),
			i === "extension" && /* @__PURE__ */ L(Vt, { link: e.link }),
			i === "first" && /* @__PURE__ */ L(C, { children: [
				/* @__PURE__ */ L(H, {
					kind: "ok",
					children: n("setup.extOk")
				}),
				/* @__PURE__ */ L("div", {
					class: "row-title",
					children: n("setup.firstTitle")
				}),
				/* @__PURE__ */ L("div", {
					class: "list",
					children: [
						/* @__PURE__ */ L("button", {
							class: "row",
							onClick: u.pick,
							children: [/* @__PURE__ */ L("span", {
								class: "st pending",
								children: B.upload()
							}), /* @__PURE__ */ L("div", {
								class: "row-main",
								children: [/* @__PURE__ */ L("div", {
									class: "row-title",
									children: n("setup.importFile")
								}), /* @__PURE__ */ L("div", {
									class: "row-sub",
									children: n("setup.importHint")
								})]
							})]
						}),
						/* @__PURE__ */ L("button", {
							class: "row",
							onClick: async () => {
								await t.bridge.call("ui_finish_setup"), await t.open("list_workflows", {}, "push");
							},
							children: [/* @__PURE__ */ L("span", {
								class: "st pending",
								children: B.play()
							}), /* @__PURE__ */ L("div", {
								class: "row-main",
								children: [/* @__PURE__ */ L("div", {
									class: "row-title",
									children: n("setup.example")
								}), /* @__PURE__ */ L("div", {
									class: "row-sub",
									children: n("setup.exampleHint")
								})]
							})]
						}),
						/* @__PURE__ */ L("button", {
							class: "row",
							"aria-expanded": o,
							onClick: () => s(!o),
							children: [/* @__PURE__ */ L("span", {
								class: "st pending",
								children: B.sparkle()
							}), /* @__PURE__ */ L("div", {
								class: "row-main",
								children: [/* @__PURE__ */ L("div", {
									class: "row-title",
									children: n("setup.describe")
								}), /* @__PURE__ */ L("div", {
									class: "row-sub",
									children: n("setup.describeHint")
								})]
							})]
						}),
						o && /* @__PURE__ */ L("div", {
							class: "row-expand",
							style: "padding-left:10px",
							children: /* @__PURE__ */ L(nt, {
								placeholder: n("setup.describePh"),
								message: (e) => n("msg.describe", { text: e }),
								context: "The user wants a new browser workflow. Read get_step_schema, explore the site with the page_* tools, then show a draft with propose_workflow."
							})
						})
					]
				}),
				u.error && /* @__PURE__ */ L("span", {
					class: "err",
					children: u.error
				}),
				u.input,
				/* @__PURE__ */ L("div", {
					class: "actions",
					children: /* @__PURE__ */ L(U, {
						primary: !0,
						onClick: d,
						children: n("setup.finish")
					})
				})
			] })
		]
	});
}
// node_modules/marked/lib/marked.esm.js
function Ut() {
	return {
		async: !1,
		breaks: !1,
		extensions: null,
		gfm: !0,
		hooks: null,
		pedantic: !1,
		renderer: null,
		silent: !1,
		tokenizer: null,
		walkTokens: null
	};
}
var Wt = Ut();
function Gt(e) {
	Wt = e;
}
var Kt = { exec: () => null };
function qt(e) {
	let t = [];
	return (n) => {
		let r = Math.max(0, Math.min(3, n - 1)), i = t[r];
		return i || (i = e(r), t[r] = i), i;
	};
}
function G(e, t = "") {
	let n = typeof e == "string" ? e : e.source, r = {
		replace: (e, t) => {
			let i = typeof t == "string" ? t : t.source;
			return i = i.replace(K.caret, "$1"), n = n.replace(e, i), r;
		},
		getRegex: () => new RegExp(n, t)
	};
	return r;
}
var Jt = ((e = "") => {
	try {
		return !!RegExp("(?<=1)(?<!1)" + e);
	} catch {
		return !1;
	}
})(), K = {
	codeRemoveIndent: /^(?: {0,3}\t| {1,4})/gm,
	outputLinkReplace: /\\([\[\]])/g,
	indentCodeCompensation: /^(\s+)(?:```)/,
	beginningSpace: /^\s+/,
	endingHash: /#$/,
	startingSpaceChar: /^ /,
	endingSpaceChar: / $/,
	endingSpaceTabChar: /[ \t]$/,
	nonSpaceChar: /[^ ]/,
	newLineCharGlobal: /\n/g,
	tabCharGlobal: /\t/g,
	leadingSpaceTab: /^[ \t]+/,
	multipleSpaceGlobal: /\s+/g,
	blankLine: /^[ \t]*$/,
	doubleBlankLine: /\n[ \t]*\n[ \t]*$/,
	blockquoteStart: /^ {0,3}>/,
	blockquoteSetextReplace: /\n {0,3}((?:=+|-+)[ \t]*)(?=\n|$)/g,
	blockquoteSetextReplace2: /^ {0,3}>[ \t]?/gm,
	blockquoteMarkerWhitespace: /^( {0,3}>)([ \t]+)/gm,
	listReplaceNesting: /^ {1,4}(?=( {4})*[^ ])/g,
	listIsTask: /^\[[ xX]\][ \t]+\S/,
	listReplaceTask: /^\[[ xX]\][ \t]+/,
	listTaskCheckbox: /\[[ xX]\]/,
	anyLine: /\n.*\n/,
	hrefBrackets: /^<(.*)>$/,
	tableDelimiter: /[:|]/,
	tableAlignChars: /^\||\| *$/g,
	tableRowBlankLine: /\n[ \t]*$/,
	tableAlignRight: /^ *-+: *$/,
	tableAlignCenter: /^ *:-+: *$/,
	tableAlignLeft: /^ *:-+ *$/,
	startATag: /^<a /i,
	endATag: /^<\/a>/i,
	startPreScriptTag: /^<(pre|code|kbd|script)(\s|>)/i,
	endPreScriptTag: /^<\/(pre|code|kbd|script)(\s|>)/i,
	startAngleBracket: /^</,
	endAngleBracket: />$/,
	pedanticHrefTitle: /^([^'"]*[^\s])\s+(['"])(.*)\2/,
	unicodeAlphaNumeric: /[\p{L}\p{N}]/u,
	numericCharacterReference: /&#(?:(\d{1,7})|[Xx]([A-Fa-f0-9]{1,6}));/,
	numericCharacterReferenceOrAmpersand: /&#(?:(\d{1,7})|[Xx]([A-Fa-f0-9]{1,6}));|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,
	escapeTest: /[&<>"']/,
	escapeReplace: /[&<>"']/g,
	escapeTestNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,
	escapeReplaceNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,
	caret: /(^|[^\[])\^/g,
	percentDecode: /%25/g,
	findPipe: /\|/g,
	splitPipe: / \|/,
	slashPipe: /\\\|/g,
	carriageReturn: /\r\n|\r/g,
	spaceLine: /^ +$/gm,
	notSpaceStart: /^\S*/,
	endingNewline: /\n$/,
	listItemRegex: (e) => RegExp(`^( {0,3}${e})((?:[	 ][^\\n]*)?(?:\\n|$))`),
	nextBulletRegex: qt((e) => RegExp(`^ {0,${e}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`)),
	hrRegex: qt((e) => RegExp(`^ {0,${e}}((?:-[ 	]*){3,}|(?:_[ 	]*){3,}|(?:\\*[ 	]*){3,})(?:\\n+|$)`)),
	fencesBeginRegex: qt((e) => RegExp(`^ {0,${e}}(?:\`\`\`|~~~)`)),
	headingBeginRegex: qt((e) => RegExp(`^ {0,${e}}#{1,6}(?:\\s|$)`)),
	pedanticHeadingBeginRegex: qt((e) => RegExp(`^ {0,${e}}#`)),
	htmlBeginRegex: qt((e) => RegExp(`^ {0,${e}}(?:</?(?:${un})(?: +|$|/?>)|<(?:(?:script|pre|style|textarea)(?:[\\s>]|$)|!--)|<\\?|<![A-Za-z]|<!\\[CDATA\\[)`, "i")),
	blockquoteBeginRegex: qt((e) => RegExp(`^ {0,${e}}>`))
}, Yt = /^(?:[ \t]*(?:\n|$))+/, Xt = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/, Zt = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}(?:(?=`)\1`*|(?=~)\1~*) *(?=\n|$)|$)/, Qt = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/, $t = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/, en = / {0,3}(?:[*+-]|\d{1,9}[.)])/, tn = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |fences|blockquote|heading|hr|html|table))+?)\n {0,3}(=+|-+)[ \t]*(?:\n+|$)/, nn = G(tn).replace(/bull/g, en).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}(?:\s|$)/).replace(/hr/g, / {0,3}(?:(?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/\|table/g, "").getRegex(), rn = G(tn).replace(/bull/g, en).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}(?:\s|$)/).replace(/hr/g, / {0,3}(?:(?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(), an = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table|[ \t]+\n)[^\n]+)*)/, on = /^[^\n]+/, sn = /(?!\s*\])(?:\\[\s\S]|[^\[\]\\\n]|\n(?![ \t]*\n))+/, cn = G(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", sn).replace("title", /(?:"(?:\\[\s\S]|[^"\\])*"|'(?:\\[\s\S]|[^'\\\n]|\n(?!\n))*'|\((?:\\[\s\S]|[^()\\])*\))/).getRegex(), ln = G(/^(bull)([ \t][^\n]*?)?(?:\n|$)/).replace(/bull/g, en).getRegex(), un = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul", dn = /<!--(?:-?>|[\s\S]*?(?:-->|$))/, fn = G("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n*|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>[^\\n]*\\n*|$)|<![A-Z][\\s\\S]*?(?:>[^\\n]*\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>[^\\n]*\\n*|$)|</?(tag)(?:[ \\t]+|\\n|/?>|$)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!(?:script|pre|style|textarea)(?![a-z0-9-]))([a-z][a-z0-9-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</[a-z][a-z0-9-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))", "i").replace("comment", dn).replace("tag", un).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(), pn = (e) => G(an).replace("hr", Qt).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)").replace("list", e).replace("html", " {0,3}(?:</?(?:tag)(?: +|\\n|/?>)|<(?:(?:script|pre|style|textarea)(?:[\\s>]|$)|!--)|<\\?|<![A-Za-z]|<!\\[CDATA\\[)").replace("tag", un).getRegex(), mn = pn(/ {0,3}(?:[*+-]|1[.)])[ \t]+[^ \t\n]/), hn = pn(/ {0,3}(?:[*+-]|\d{1,9}[.)])(?:[ \t]|\n|$)/), gn = {
	blockquote: G(/^( {0,3}> ?(?:(?![ \t]*(?:\n|$))(paragraph)|[^\n]*)(?:\n|$))+/).replace("paragraph", hn).getRegex(),
	code: Xt,
	def: cn,
	fences: Zt,
	heading: $t,
	hr: Qt,
	html: fn,
	lheading: nn,
	list: ln,
	newline: Yt,
	paragraph: mn,
	table: Kt,
	text: on
}, _n = G("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr", Qt).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", " {0,3}(?:</?(?:tag)(?: +|\\n|/?>)|<(?:(?:script|pre|style|textarea)(?:[\\s>]|$)|!--)|<\\?|<![A-Za-z]|<!\\[CDATA\\[)").replace("tag", un).getRegex(), vn = {
	...gn,
	lheading: rn,
	table: _n,
	paragraph: G(an).replace("hr", Qt).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", _n).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]+[^ \\t\\n]").replace("html", " {0,3}(?:</?(?:tag)(?: +|\\n|/?>)|<(?:(?:script|pre|style|textarea)(?:[\\s>]|$)|!--)|<\\?|<![A-Za-z]|<!\\[CDATA\\[)").replace("tag", un).getRegex()
}, yn = {
	...gn,
	html: G("^ *(?:comment(?: *\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1>(?: *\\n{2,}|\\s*$)|<tag(?:\"[^\"]*\"|'[^']*'|\\s[^'\"/>\\s]*)*?/?>(?: *\\n{2,}|\\s*$))").replace("comment", dn).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),
	def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,
	heading: /^(#{1,6})(.*)(?:\n+|$)/,
	fences: Kt,
	lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,
	paragraph: G(an).replace("hr", Qt).replace("heading", " *#{1,6} *[^\n]").replace("lheading", nn).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex()
}, bn = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/, xn = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/, Sn = /^( {2,}|\\)\n(?!\s*$)[ \t]*/, Cn = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/, wn = /[\p{P}\p{S}]/u, Tn = /[\s\p{P}\p{S}]/u, En = /[^\s\p{P}\p{S}]/u, Dn = G(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, Tn).getRegex(), On = /[\p{Pi}\p{Ps}"']/u, kn = /(?!~)[\p{P}\p{S}]/u, An = /(?!~)[\s\p{P}\p{S}]/u, jn = /(?:[^\s\p{P}\p{S}]|~)/u, Mn = G(/link|precode-code|html/, "g").replace("link", /\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-", Jt ? "(?<!`)()" : "(^^|[^`])").replace("code", /(?<b>`+)[^`]+\k<b>(?!`)/).replace("html", /<(?! )[^<>]*?>/).getRegex(), Nn = /^(?:\*+(?:((?!\*)punct)|([^\s*]))?)|^_+(?:((?!_)punct)|([^\s_]))?/, Pn = G(Nn, "u").replace(/punct/g, wn).getRegex(), Fn = G(Nn, "u").replace(/punct/g, kn).getRegex(), In = G(/^(?:\*+(?:((?!\*)(?!openQuote)punct)|([^\s*]))?)|^_+(?:((?!_)(?!openQuote)punct)|([^\s_]))?/, "u").replace(/openQuote/g, On).replace(/punct/g, wn).getRegex(), Ln = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)", Rn = G(Ln, "gu").replace(/notPunctSpace/g, En).replace(/punctSpace/g, Tn).replace(/punct/g, wn).getRegex(), zn = G(Ln, "gu").replace(/notPunctSpace/g, jn).replace(/punctSpace/g, An).replace(/punct/g, kn).getRegex(), Bn = G("^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)[\\s](\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|(?:(?!\\*)punct|notPunctSpace)(\\*+)(?!\\*)(?=notPunctSpace)", "gu").replace(/notPunctSpace/g, En).replace(/punctSpace/g, Tn).replace(/punct/g, wn).getRegex(), Vn = G("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)", "gu").replace(/notPunctSpace/g, En).replace(/punctSpace/g, Tn).replace(/punct/g, wn).getRegex(), Hn = G("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)[\\s](_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)|(?:(?!_)punct|notPunctSpace)(_+)(?!_)(?=notPunctSpace)", "gu").replace(/notPunctSpace/g, En).replace(/punctSpace/g, Tn).replace(/punct/g, wn).getRegex(), Un = G(/^~~?(?:((?!~)punct)|[^\s~])/, "u").replace(/punct/g, wn).getRegex(), Wn = G("^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)", "gu").replace(/notPunctSpace/g, En).replace(/punctSpace/g, Tn).replace(/punct/g, wn).getRegex(), Gn = G(/\\(punct)/, "gu").replace(/punct/g, wn).getRegex(), Kn = G(/(`+)(?:[^`]|[^`][\s\S]*?[^`])\1(?!`)|`+|\\(punct)/, "gu").replace(/punct/g, wn).getRegex(), qn = G(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(), Jn = G(dn).replace("(?:-->|$)", "-->").getRegex(), Yn = G("^comment|^</[a-zA-Z][a-zA-Z0-9-]*\\s*>|^<[a-zA-Z][a-zA-Z0-9-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment", Jn).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(), Xn = /\[(?:\\[\s\S]|[^\[\]\\])*\]/, Zn = G(/(?:\[(?:brackets|\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+(?!`)[^`]*?`+(?!`)|``+(?=\])|[^\[\]\\`])*?/).replace("brackets", Xn).getRegex(), Qn = G(/^!?\[(label)\]\([ \t\n]*(href)(?:(?:[ \t]+(?:\n[ \t]*)?|\n[ \t]*)(title))?[ \t\n]*\)/).replace("label", Zn).replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]+|(?=\))/).replace("title", /"(?:\\[\s\S]|[^"\\])*"|'(?:\\[\s\S]|[^'\\])*'|\((?:\\[\s\S]|[^)\\])*\)/).getRegex(), $n = G(/^!?\[(label)\]\[(ref)\]/).replace("label", Zn).replace("ref", sn).getRegex(), er = G(/^!?\[(ref)\](?:\[\])?/).replace("ref", sn).getRegex(), tr = /(?!\s*\])(?:\\[\s\S]|[^\[\]\\]){1,999}/, nr = G(/(?:[^\[\]\\`]*(?:\[(?:brackets|\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+(?!`)[^`]*?`+(?!`)|``+(?=\]))){0,999}?[^\[\]\\`]*?/).replace("brackets", Xn).getRegex(), rr = G("reflink|nolink(?!\\()", "g").replace("reflink", G(/^!?\[(label)\]\[(ref)\]/).replace("label", nr).replace("ref", tr).getRegex()).replace("nolink", G(/^!?\[(ref)\](?:\[\])?/).replace("ref", tr).getRegex()).getRegex(), ir = /[hH][tT][tT][pP][sS]?|[fF][tT][pP]/, ar = G(/(?:mailto:email|xmpp:email(?:\/[A-Za-z0-9@.]+)?)/).replace(/email/g, /[A-Za-z0-9._+-]+@[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![\w-])/).getRegex(), or = {
	_backpedal: Kt,
	anyPunctuation: Gn,
	anyPunctuationOutsideCode: Kn,
	autolink: qn,
	blockSkip: Mn,
	br: Sn,
	code: xn,
	del: Kt,
	delLDelim: Kt,
	delRDelim: Kt,
	emStrongLDelim: Pn,
	emStrongRDelimAst: Rn,
	emStrongRDelimUnd: Vn,
	escape: bn,
	link: Qn,
	nolink: er,
	punctuation: Dn,
	reflink: $n,
	reflinkSearch: rr,
	tag: Yn,
	text: Cn,
	url: Kt
}, sr = {
	...or,
	emStrongLDelim: In,
	emStrongRDelimAst: Bn,
	emStrongRDelimUnd: Hn,
	link: G(/^!?\[(label)\]\((.*?)\)/).replace("label", Zn).getRegex(),
	reflink: G(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", Zn).getRegex()
}, cr = {
	...or,
	emStrongRDelimAst: zn,
	emStrongLDelim: Fn,
	delLDelim: Un,
	delRDelim: Wn,
	url: G(/^emailProtocol|^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("emailProtocol", ar).replace("protocol", ir).replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![\w-])/).getRegex(),
	_backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,
	del: /^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/,
	text: G(/^(?:[^a-zA-Z0-9](?=emailProtocol)|(`+|~+|[^`~])(?:(?=[`~])|(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|wwwStart|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9](?=emailProtocol)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@))))/).replace("protocol", ir).replace(/emailProtocol/g, /(?:mailto|xmpp):/).replace("wwwStart", Jt ? "(?<![^\\s*_~(])www\\." : "www\\.").getRegex()
}, lr = {
	...cr,
	br: G(Sn).replace("{2,}", "*").getRegex(),
	text: G(cr.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex()
}, ur = {
	normal: gn,
	gfm: vn,
	pedantic: yn
}, dr = {
	normal: or,
	gfm: cr,
	breaks: lr,
	pedantic: sr
}, fr = {
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	"\"": "&quot;",
	"'": "&#39;"
}, pr = (e) => fr[e];
function mr(e, t) {
	if (t) {
		if (K.escapeTest.test(e)) return e.replace(K.escapeReplace, pr);
	} else if (K.escapeTestNoEncode.test(e)) return e.replace(K.escapeReplaceNoEncode, pr);
	return e;
}
function hr(e) {
	return K.numericCharacterReference.test(e) ? e.replace(K.numericCharacterReferenceOrAmpersand, (e, t, n) => {
		if (t === void 0 && n === void 0) return "&amp;";
		let r = t === void 0 ? Number.parseInt(n, 16) : Number.parseInt(t, 10);
		return r === 0 || r > 1114111 || r >= 55296 && r <= 57343 ? "�" : r === 38 ? "&amp;" : String.fromCodePoint(r);
	}) : e;
}
function gr(e) {
	try {
		e = encodeURI(e).replace(K.percentDecode, "%");
	} catch {
		return null;
	}
	return e;
}
function _r(e, t) {
	let n = e.replace(K.findPipe, (e, t, n) => {
		let r = !1, i = t;
		for (; --i >= 0 && n[i] === "\\";) r = !r;
		return r ? "|" : " |";
	}).split(K.splitPipe), r = 0;
	if (n[0].trim() || n.shift(), n.length > 0 && !n.at(-1)?.trim() && n.pop(), t) {
		if (n.length > t) n.splice(t);
		else for (; n.length < t;) n.push("");
	}
	for (; r < n.length; r++) n[r] = n[r].trim().replace(K.slashPipe, "|");
	return n;
}
function vr(e, t, n) {
	let r = e.length;
	if (r === 0) return "";
	let i = 0;
	for (; i < r;) {
		let a = e.charAt(r - i - 1);
		if (a === t && !n) i++;
		else if (a !== t && n) i++;
		else break;
	}
	return e.slice(0, r - i);
}
function yr(e) {
	let t = e.split("\n"), n = t.length - 1;
	for (; n >= 0 && K.blankLine.test(t[n]);) n--;
	return t.length - n <= 2 ? e : t.slice(0, n + 1).join("\n");
}
function br(e) {
	return e.trim().replace(K.multipleSpaceGlobal, " ").toLowerCase().toUpperCase().toLowerCase();
}
function xr(e, t) {
	if (e.indexOf(t[0]) === -1 && e.indexOf(t[1]) === -1) return -1;
	let n = 0;
	for (let r = 0; r < e.length; r++) if (e[r] === "\\") r++;
	else if (e[r] === t[0]) n++;
	else if (e[r] === t[1] && (n--, n < 0)) return r;
	return n > 0 ? -2 : -1;
}
var Sr = /* @__PURE__ */ new WeakMap();
function Cr(e) {
	let t = {
		"*": -1,
		_: -1
	}, n = -1, r = e.length;
	for (let i = 0; i < r; i++) {
		let a = e[i];
		if (a !== "*" && a !== "_" && a !== "~") continue;
		let o = i === 0 ? "\n" : e[i - 1], s = i + 1;
		for (; s < r && e[s] === a;) s++;
		o !== " " && o !== "	" && o !== "\n" && o !== "\r" && o !== "\f" && (a === "~" ? n = i : t[a] = i), i = s - 1;
	}
	return {
		maskedSrc: e,
		lastPossibleEmStrongCloserIndex: t,
		lastPossibleDelCloserIndex: n
	};
}
function wr(e, t) {
	let n = Cr(t), r = Sr.get(e);
	r ? r.push(n) : Sr.set(e, [n]);
}
function Tr(e) {
	let t = Sr.get(e);
	t && (t.pop(), t.length === 0 && Sr.delete(e));
}
function Er(e, t, n) {
	let r = Sr.get(e)?.at(-1);
	return r && r.maskedSrc === t ? r.lastPossibleEmStrongCloserIndex[n] : Cr(t).lastPossibleEmStrongCloserIndex[n];
}
function Dr(e, t) {
	let n = Sr.get(e)?.at(-1);
	return n && n.maskedSrc === t ? n.lastPossibleDelCloserIndex : Cr(t).lastPossibleDelCloserIndex;
}
function Or(e, t = 0) {
	let n = t, r = "";
	for (let t of e) if (t === "	") {
		let e = 4 - n % 4;
		r += " ".repeat(e), n += e;
	} else r += t, n++;
	return r;
}
function kr(e, t, n, r, i) {
	let a = t.href, o = t.title || null, s = e[1].replace(i.other.outputLinkReplace, "$1"), c = e[0].charAt(0) === "!", l = r.state.inLink, u = r.state.linkEmitted, d = r.state.inRawBlock;
	r.state.inLink = !0, r.state.linkEmitted = !1;
	let f = r.inlineTokens(s), p = r.state.linkEmitted;
	if (r.state.linkEmitted = u, r.state.inLink = l, !c) {
		if (p) {
			r.state.inRawBlock = d;
			return;
		}
		r.state.linkEmitted = !0;
	}
	return {
		type: c ? "image" : "link",
		raw: n,
		href: a,
		title: o,
		text: s,
		tokens: f
	};
}
function Ar(e, t, n) {
	let r = e.match(n.other.indentCodeCompensation);
	if (r === null) return t;
	let i = r[1];
	return t.split("\n").map((e) => {
		let t = e.match(n.other.beginningSpace);
		if (t === null) return e;
		let [r] = t;
		return e.slice(Math.min(r.length, i.length));
	}).join("\n");
}
function jr(e, t, n, r) {
	if (!t.includes("<")) return !1;
	for (let i = 0; i < t.length; i++) {
		if (t[i] === "\\") {
			i++;
			continue;
		}
		if (t[i] === "`") {
			let e = r.inline.code.exec(t.slice(i));
			if (e) {
				i += e[0].length - 1;
				continue;
			}
		}
		if (t[i] !== "<") continue;
		let a = e.slice(n + i), o = r.inline.tag.exec(a) || r.inline.autolink.exec(a);
		if (o) {
			if (o[0].length > t.length - i) return !0;
			i += o[0].length - 1;
		}
	}
	return !1;
}
var Mr = class {
	options;
	rules;
	lexer;
	constructor(e) {
		this.options = e || Wt;
	}
	space(e) {
		let t = this.rules.block.newline.exec(e);
		if (t && t[0].length > 0) return {
			type: "space",
			raw: t[0]
		};
	}
	code(e) {
		let t = this.rules.block.code.exec(e);
		if (t) {
			let e = this.options.pedantic ? t[0] : yr(t[0]);
			return {
				type: "code",
				raw: e,
				codeBlockStyle: "indented",
				text: e.replace(this.rules.other.codeRemoveIndent, "")
			};
		}
	}
	fences(e) {
		let t = this.rules.block.fences.exec(e);
		if (t) {
			let e = t[0], n = Ar(e, t[3] || "", this.rules);
			return {
				type: "code",
				raw: e,
				lang: t[2] ? t[2].trim().replace(this.rules.inline.anyPunctuation, "$1") : t[2],
				text: n
			};
		}
	}
	heading(e) {
		let t = this.rules.block.heading.exec(e);
		if (t) {
			let e = t[2].trim();
			if (this.rules.other.endingHash.test(e)) {
				let t = vr(e, "#");
				(this.options.pedantic || !t || this.rules.other.endingSpaceTabChar.test(t)) && (e = t.trim());
			}
			return {
				type: "heading",
				raw: vr(t[0], "\n"),
				depth: t[1].length,
				text: e,
				tokens: this.lexer.inline(e)
			};
		}
	}
	hr(e) {
		let t = this.rules.block.hr.exec(e);
		if (t) return {
			type: "hr",
			raw: vr(t[0], "\n")
		};
	}
	blockquote(e) {
		let t = this.rules.block.blockquote.exec(e);
		if (t) {
			let e = vr(t[0], "\n").split("\n"), n = "", r = "", i = [];
			for (; e.length > 0;) {
				let t = !1, a = [], o = 0;
				for (; o < e.length; o++) if (this.rules.other.blockquoteStart.test(e[o])) a.push(e[o]), t = !0;
				else if (!t) a.push(e[o]);
				else break;
				e = e.slice(o);
				let s = a.join("\n"), c = s.replace(this.rules.other.blockquoteMarkerWhitespace, (e, t, n) => t + Or(n, t.length)).replace(this.rules.other.blockquoteSetextReplace, "\n    $1").replace(this.rules.other.blockquoteSetextReplace2, "");
				n = n ? `${n}
${s}` : s, r = r ? `${r}
${c}` : c;
				let l = this.lexer.state.top;
				if (this.lexer.state.top = !0, this.lexer.blockTokens(c, i, !0), this.lexer.state.top = l, e.length === 0) break;
				let u = i.at(-1);
				if (u?.type === "code" || u?.type === "heading" || u?.type === "hr" || u?.type === "html" || u?.type === "table") break;
				if (u?.type === "blockquote") {
					let t = u, a = e.join("\n"), o = t.raw + "\n" + a.replace(this.rules.other.blockquoteSetextReplace2, ""), s = this.blockquote(o);
					i[i.length - 1] = s;
					let c = o.substring(s.raw.length).replace(/^\n/, ""), l = c ? c.split("\n").length : 0, d = l ? e.slice(0, -l) : e;
					if (d.length > 0 && (n = `${n}
${d.join("\n")}`), r = r.substring(0, r.length - t.text.length) + s.text, e = e.slice(d.length), e.length > 0 && this.rules.other.blockquoteStart.test(e[0])) continue;
					break;
				}
				if (u?.type === "list") {
					let t = u, a = t.raw + "\n" + e.join("\n"), o = this.list(a);
					i[i.length - 1] = o;
					let s = o.raw.length > t.raw.length ? a.slice(t.raw.length + 1, o.raw.length).split("\n").length : 0;
					if (s > 0) {
						let t = e.slice(0, s).join("\n");
						n = `${n}
${t}`, r = `${r}
${t}`;
					}
					e = e.slice(s);
				}
			}
			return {
				type: "blockquote",
				raw: n,
				tokens: i,
				text: r
			};
		}
	}
	list(e) {
		let t = this.rules.block.list.exec(e);
		if (t) {
			let n = e, r = () => n.length - e.length, i = t[1].trim(), a = i.length > 1, o = {
				type: "list",
				raw: "",
				ordered: a,
				start: a ? +i.slice(0, -1) : "",
				loose: !1,
				items: []
			};
			i = a ? `\\d{1,9}\\${i.slice(-1)}` : `\\${i}`, this.options.pedantic && (i = a ? i : "[*+-]");
			let s = this.rules.other.listItemRegex(i), c = !1;
			for (; e;) {
				let i = !1, a = "";
				if (!(t = s.exec(e)) || this.rules.block.hr.test(e)) break;
				let l = r();
				e = e.substring(t[0].length);
				let u = t[2].split("\n", 1)[0], d = t[1].length, f = this.options.pedantic ? Or(u, d) : u.replace(this.rules.other.leadingSpaceTab, (e) => Or(e, d)), p = e.split("\n", 1)[0], m = !f.trim(), h = 0;
				if (this.options.pedantic ? (h = 2, a = f.trimStart()) : m ? h = d + 1 : (h = f.search(this.rules.other.nonSpaceChar), h = h > 4 ? 1 : h, a = f.slice(h), h += d), m && this.rules.other.blankLine.test(p) && (e = e.substring(p.length + 1), i = !0), !i) {
					let t = this.rules.other.nextBulletRegex(h), n = this.rules.other.hrRegex(h), r = this.rules.other.fencesBeginRegex(h), i = this.options.pedantic ? this.rules.other.pedanticHeadingBeginRegex(h) : this.rules.other.headingBeginRegex(h), o = this.rules.other.htmlBeginRegex(h), s = this.rules.other.blockquoteBeginRegex(h);
					for (; e;) {
						let c = e.split("\n", 1)[0], l;
						if (p = c, this.options.pedantic ? (p = p.replace(this.rules.other.listReplaceNesting, "  "), l = p) : l = p.replace(this.rules.other.leadingSpaceTab, (e) => Or(e)), r.test(p) || i.test(p) || o.test(p) || s.test(p) || t.test(p) || n.test(p)) break;
						if (l.search(this.rules.other.nonSpaceChar) >= h || !p.trim()) a += "\n" + l.slice(h);
						else {
							if (m || f.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4 || r.test(f) || i.test(f) || o.test(f) || n.test(f)) break;
							let e = !this.options.pedantic && /^ {0,3}(?:=+|-+) *$/.test(p) && this.rules.block.lheading.test(`${f}
${p}`) ? `    ${l.replace(/^ {0,3}/, "")}` : p;
							a += "\n" + e;
						}
						m = !p.trim(), e = e.substring(c.length + 1), f = l.slice(h);
					}
				}
				let g = n.slice(l, r());
				o.loose || (c ? o.loose = !0 : this.rules.other.doubleBlankLine.test(g) && (c = !0)), o.items.push({
					type: "list_item",
					raw: g,
					task: !!this.options.gfm && this.rules.other.listIsTask.test(a),
					loose: !1,
					text: a,
					tokens: []
				});
			}
			let l = o.items.at(-1);
			if (l) l.raw = l.raw.trimEnd(), l.text = l.text.trimEnd();
			else return;
			o.raw = n.slice(0, r()).trimEnd();
			for (let e of o.items) if (this.lexer.state.top = !1, e.tokens = this.lexer.blockTokens(e.text, []), !o.loose) {
				let t = e.tokens.filter((e) => e.type === "space");
				o.loose = t.length > 0 && t.some((e) => this.rules.other.anyLine.test(e.raw));
			}
			for (let e of o.items) {
				let t = e.tokens[0];
				if (e.task && (t?.type === "text" || t?.type === "paragraph")) {
					e.text = e.text.replace(this.rules.other.listReplaceTask, ""), t.raw = t.raw.replace(this.rules.other.listReplaceTask, ""), t.text = t.text.replace(this.rules.other.listReplaceTask, "");
					for (let e = this.lexer.inlineQueue.length - 1; e >= 0; e--) if (this.rules.other.listIsTask.test(this.lexer.inlineQueue[e].src)) {
						this.lexer.inlineQueue[e].src = this.lexer.inlineQueue[e].src.replace(this.rules.other.listReplaceTask, "");
						break;
					}
					let n = this.rules.other.listTaskCheckbox.exec(e.raw);
					if (n) {
						let t = {
							type: "checkbox",
							raw: n[0] + " ",
							checked: n[0] !== "[ ]"
						};
						e.checked = t.checked, o.loose ? e.tokens[0] && ["paragraph", "text"].includes(e.tokens[0].type) && "tokens" in e.tokens[0] && e.tokens[0].tokens ? (e.tokens[0].raw = t.raw + e.tokens[0].raw, e.tokens[0].text = t.raw + e.tokens[0].text, e.tokens[0].tokens.unshift(t)) : e.tokens.unshift({
							type: "paragraph",
							raw: t.raw,
							text: t.raw,
							tokens: [t]
						}) : e.tokens.unshift(t);
					}
				} else e.task &&= !1;
			}
			if (o.loose) for (let e of o.items) {
				e.loose = !0;
				for (let t of e.tokens) t.type === "text" && (t.type = "paragraph");
			}
			return o;
		}
	}
	html(e) {
		let t = this.rules.block.html.exec(e);
		if (t) {
			let e = yr(t[0]);
			return {
				type: "html",
				block: !0,
				raw: e,
				pre: t[1] === "pre" || t[1] === "script" || t[1] === "style",
				text: e
			};
		}
	}
	def(e) {
		let t = this.rules.block.def.exec(e);
		if (t) {
			if (!this.rules.other.startAngleBracket.test(t[2]) && xr(t[2], "()") !== -1) return;
			let e = br(t[1]), n = t[2] ? t[2].replace(this.rules.other.hrefBrackets, "$1").replace(this.rules.inline.anyPunctuation, "$1") : "", r = t[3] ? t[3].substring(1, t[3].length - 1).replace(this.rules.inline.anyPunctuation, "$1") : t[3];
			return {
				type: "def",
				tag: e,
				raw: vr(t[0], "\n"),
				href: n,
				title: r
			};
		}
	}
	table(e) {
		let t = this.rules.block.table.exec(e);
		if (!t || !this.rules.other.tableDelimiter.test(t[2])) return;
		let n = _r(t[1]), r = t[2].replace(this.rules.other.tableAlignChars, "").split("|"), i = t[3]?.trim() ? t[3].replace(this.rules.other.tableRowBlankLine, "").split("\n") : [], a = {
			type: "table",
			raw: vr(t[0], "\n"),
			header: [],
			align: [],
			rows: []
		};
		if (n.length === r.length) {
			for (let e of r) this.rules.other.tableAlignRight.test(e) ? a.align.push("right") : this.rules.other.tableAlignCenter.test(e) ? a.align.push("center") : this.rules.other.tableAlignLeft.test(e) ? a.align.push("left") : a.align.push(null);
			for (let e = 0; e < n.length; e++) a.header.push({
				text: n[e],
				tokens: this.lexer.inline(n[e]),
				header: !0,
				align: a.align[e]
			});
			for (let e of i) a.rows.push(_r(e, a.header.length).map((e, t) => ({
				text: e,
				tokens: this.lexer.inline(e),
				header: !1,
				align: a.align[t]
			})));
			return a;
		}
	}
	lheading(e) {
		let t = this.rules.block.lheading.exec(e);
		if (t) {
			let e = t[1].trim();
			return {
				type: "heading",
				raw: vr(t[0], "\n"),
				depth: t[2].charAt(0) === "=" ? 1 : 2,
				text: e,
				tokens: this.lexer.inline(e)
			};
		}
	}
	paragraph(e) {
		let t = this.rules.block.paragraph.exec(e);
		if (t) {
			let e = t[1].charAt(t[1].length - 1) === "\n" ? t[1].slice(0, -1) : t[1];
			return {
				type: "paragraph",
				raw: t[0],
				text: e,
				tokens: this.lexer.inline(e)
			};
		}
	}
	text(e) {
		let t = this.rules.block.text.exec(e);
		if (t) return {
			type: "text",
			raw: t[0],
			text: t[0],
			tokens: this.lexer.inline(t[0])
		};
	}
	escape(e) {
		let t = this.rules.inline.escape.exec(e);
		if (t) return {
			type: "escape",
			raw: t[0],
			text: t[1]
		};
	}
	tag(e) {
		let t = this.rules.inline.tag.exec(e);
		if (t) return !this.lexer.state.inLink && this.rules.other.startATag.test(t[0]) ? this.lexer.state.inLink = !0 : this.lexer.state.inLink && this.rules.other.endATag.test(t[0]) && (this.lexer.state.inLink = !1), !this.lexer.state.inRawBlock && this.rules.other.startPreScriptTag.test(t[0]) ? this.lexer.state.inRawBlock = !0 : this.lexer.state.inRawBlock && this.rules.other.endPreScriptTag.test(t[0]) && (this.lexer.state.inRawBlock = !1), {
			type: "html",
			raw: t[0],
			inLink: this.lexer.state.inLink,
			inRawBlock: this.lexer.state.inRawBlock,
			block: !1,
			text: t[0]
		};
	}
	link(e) {
		if (this.lexer.state.linkParenPossible === !1) return;
		let t = this.rules.inline.link.exec(e);
		if (t) {
			let n = t[0].charAt(0) === "!" ? 2 : 1;
			if (!this.options.pedantic && jr(e, t[1], n, this.rules)) return;
			let r = t[2].trim();
			if (!this.options.pedantic && this.rules.other.startAngleBracket.test(r)) {
				if (!this.rules.other.endAngleBracket.test(r)) return;
				let e = vr(r.slice(0, -1), "\\");
				if ((r.length - e.length) % 2 == 0) return;
			} else {
				let e = xr(t[2], "()");
				if (e === -2) return;
				if (e > -1) {
					let n = (t[0].indexOf("!") === 0 ? 5 : 4) + t[1].length + e;
					t[2] = t[2].substring(0, e), t[0] = t[0].substring(0, n).trim(), t[3] = "";
				}
			}
			let i = vr(t[0].slice(0, -1), "\\");
			if ((t[0].length - i.length) % 2 == 0) return;
			let a = t[2], o = "";
			if (this.options.pedantic) {
				let e = this.rules.other.pedanticHrefTitle.exec(a);
				e && (a = e[1], o = e[3]);
			} else o = t[3] ? t[3].slice(1, -1) : "";
			return a = a.trim(), this.rules.other.startAngleBracket.test(a) && (a = this.options.pedantic && !this.rules.other.endAngleBracket.test(r) ? a.slice(1) : a.slice(1, -1)), kr(t, {
				href: a && a.replace(this.rules.inline.anyPunctuation, "$1"),
				title: o && o.replace(this.rules.inline.anyPunctuation, "$1")
			}, t[0], this.lexer, this.rules);
		}
	}
	reflink(e, t) {
		let n;
		if ((n = this.rules.inline.reflink.exec(e)) || (n = this.rules.inline.nolink.exec(e))) {
			let r = n[0].charAt(0) === "!" ? 2 : 1;
			if (!this.options.pedantic && jr(e, n[1], r, this.rules)) return;
			let i = t[br(n[2] || n[1])];
			if (!i) {
				let e = n[0].charAt(0);
				return {
					type: "text",
					raw: e,
					text: e
				};
			}
			return kr(n, i, n[0], this.lexer, this.rules);
		}
	}
	emStrong(e, t, n = "") {
		let r = this.rules.inline.emStrongLDelim.exec(e);
		if (!r || !r[1] && !r[2] && !r[3] && !r[4]) return;
		let i = r[0][0], a = n === i, o = t.length - e.length, s = o;
		for (; !this.options.pedantic && s > 0 && t[s - 1] === i;) s--;
		let c = [...t.slice(Math.max(0, s - 2), s)].at(-1) ?? "", l = c === "*" || c === "_" || !!this.rules.inline.punctuation.exec(c);
		s < o && (n = c);
		let u = s < o ? l : !!this.rules.inline.punctuation.exec(n);
		if (r[4] && n.match(this.rules.other.unicodeAlphaNumeric)) return;
		let d = r[1] || r[3] || "";
		if (!d || !n || u) {
			let n = [...r[0]].length - 1, u, f, p = n, m = 0, h = o - s + n, g = !this.options.pedantic && !!c.trim() && (!!d || i === "*" && !l);
			if (i !== "*" && i !== "_") return;
			let _ = i === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd, v = Er(this, t, i), y = t.length - e.length + n;
			if (v < y) return;
			t = t.slice(-1 * e.length + n);
			let b = v - y;
			for (_.lastIndex = 0; (r = _.exec(t)) !== null && !(r.index > b);) {
				if (u = r[1] || r[2] || r[3] || r[4] || r[5] || r[6], !u) continue;
				if (f = [...u].length, r[3] || r[4]) {
					p += f;
					continue;
				}
				if (r[5] || r[6] || g) {
					if (a && (r[5] || r[6])) break;
					if (h % 3 && !((h + f) % 3)) {
						m += f;
						continue;
					}
				}
				if (p -= f, p > 0) continue;
				f = Math.min(f, f + p + m);
				let t = [...r[0]][0].length, i = e.slice(0, n + r.index + t + f);
				if (Math.min(n, f) % 2) {
					let e = i.slice(1, -1);
					return {
						type: "em",
						raw: i,
						text: e,
						tokens: this.lexer.inlineTokens(e)
					};
				}
				let o = i.slice(2, -2);
				return {
					type: "strong",
					raw: i,
					text: o,
					tokens: this.lexer.inlineTokens(o)
				};
			}
		}
	}
	codespan(e) {
		let t = this.rules.inline.code.exec(e);
		if (t) {
			let e = t[2].replace(this.rules.other.newLineCharGlobal, " "), n = this.rules.other.nonSpaceChar.test(e), r = this.rules.other.startingSpaceChar.test(e) && this.rules.other.endingSpaceChar.test(e);
			return n && r && (e = e.substring(1, e.length - 1)), {
				type: "codespan",
				raw: t[0],
				text: e
			};
		}
	}
	br(e) {
		let t = this.rules.inline.br.exec(e);
		if (t) return {
			type: "br",
			raw: t[0]
		};
	}
	del(e, t, n = "") {
		let r = this.rules.inline.delLDelim.exec(e);
		if (r && (!r[1] || !n || this.rules.inline.punctuation.exec(n))) {
			let n = [...r[0]].length - 1, i, a, o = n, s = this.rules.inline.delRDelim, c = Dr(this, t), l = t.length - e.length + n;
			if (c < l) return;
			t = t.slice(-1 * e.length + n);
			let u = c - l;
			for (s.lastIndex = 0; (r = s.exec(t)) !== null && !(r.index > u);) {
				if (i = r[1] || r[2] || r[3] || r[4] || r[5] || r[6], !i || (a = [...i].length, a !== n)) continue;
				if (r[3] || r[4]) {
					o += a;
					continue;
				}
				if (o -= a, o > 0) continue;
				a = Math.min(a, a + o);
				let t = [...r[0]][0].length, s = e.slice(0, n + r.index + t + a), c = s.slice(n, -n);
				return {
					type: "del",
					raw: s,
					text: c,
					tokens: this.lexer.inlineTokens(c)
				};
			}
		}
	}
	autolink(e) {
		let t = this.rules.inline.autolink.exec(e);
		if (t) {
			let e, n;
			return t[2] === "@" ? (e = t[1], n = "mailto:" + e) : (e = t[1], n = e), {
				type: "link",
				raw: t[0],
				text: e,
				href: n,
				autolink: !0,
				tokens: [{
					type: "text",
					raw: e,
					text: e
				}]
			};
		}
	}
	url(e) {
		let t;
		if (t = this.rules.inline.url.exec(e)) {
			let e, n;
			if (t[2] === "@") e = t[0], n = "mailto:" + e;
			else {
				let r;
				do
					r = t[0], t[0] = this.rules.inline._backpedal.exec(t[0])?.[0] ?? "";
				while (r !== t[0]);
				e = t[0], n = t[1] === "www." ? "http://" + t[0] : t[0];
			}
			return {
				type: "link",
				raw: t[0],
				text: e,
				href: n,
				autolink: !0,
				tokens: [{
					type: "text",
					raw: e,
					text: e
				}]
			};
		}
	}
	inlineText(e) {
		let t = this.rules.inline.text.exec(e);
		if (t) {
			let e = this.lexer.state.inRawBlock;
			return {
				type: "text",
				raw: t[0],
				text: e ? t[0] : hr(t[0]),
				escaped: e
			};
		}
	}
}, Nr = class e {
	tokens;
	options;
	state;
	inlineQueue;
	tokenizer;
	constructor(e) {
		this.tokens = [], this.tokens.links = Object.create(null), this.options = e || Wt, this.options.tokenizer = this.options.tokenizer || new Mr(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = {
			inLink: !1,
			inRawBlock: !1,
			linkEmitted: !1,
			linkParenPossible: !0,
			top: !0
		};
		let t = {
			other: K,
			block: ur.normal,
			inline: dr.normal
		};
		this.options.pedantic ? (t.block = ur.pedantic, t.inline = dr.pedantic) : this.options.gfm && (t.block = ur.gfm, t.inline = this.options.breaks ? dr.breaks : dr.gfm), this.tokenizer.rules = t;
	}
	static get rules() {
		return {
			block: ur,
			inline: dr
		};
	}
	static lex(t, n) {
		return new e(n).lex(t);
	}
	static lexInline(t, n) {
		return new e(n).inlineTokens(t);
	}
	lex(e) {
		e = e.replace(K.carriageReturn, "\n"), this.blockTokens(e, this.tokens);
		for (let e = 0; e < this.inlineQueue.length; e++) {
			let t = this.inlineQueue[e];
			this.state.inRawBlock = !1, this.inlineTokens(t.src, t.tokens);
		}
		return this.inlineQueue = [], this.tokens;
	}
	blockTokens(e, t = [], n = !1) {
		this.tokenizer.lexer = this, this.options.pedantic && (e = e.replace(K.tabCharGlobal, "    ").replace(K.spaceLine, ""));
		let r = 1 / 0;
		for (; e;) {
			if (e.length < r) r = e.length;
			else {
				this.infiniteLoopError(e.charCodeAt(0));
				break;
			}
			let i;
			if (this.options.extensions?.block?.some((n) => (i = n.call({ lexer: this }, e, t)) ? (e = e.substring(i.raw.length), t.push(i), !0) : !1)) continue;
			if (i = this.tokenizer.space(e)) {
				e = e.substring(i.raw.length);
				let n = t.at(-1);
				i.raw.length === 1 && n !== void 0 ? n.raw += "\n" : t.push(i);
				continue;
			}
			if (i = this.tokenizer.code(e)) {
				e = e.substring(i.raw.length);
				let n = t.at(-1);
				n?.type === "paragraph" || n?.type === "text" ? (n.raw += (n.raw.endsWith("\n") ? "" : "\n") + i.raw, n.text += "\n" + i.text, this.inlineQueue.at(-1).src = n.text) : t.push(i);
				continue;
			}
			if ((i = this.tokenizer.fences(e)) || (i = this.tokenizer.heading(e)) || (i = this.tokenizer.hr(e)) || (i = this.tokenizer.blockquote(e)) || (i = this.tokenizer.list(e)) || (i = this.tokenizer.html(e))) {
				e = e.substring(i.raw.length), t.push(i);
				continue;
			}
			if (i = this.tokenizer.def(e)) {
				e = e.substring(i.raw.length);
				let n = t.at(-1);
				n?.type === "paragraph" || n?.type === "text" ? (n.raw += (n.raw.endsWith("\n") ? "" : "\n") + i.raw, n.text += "\n" + i.raw, this.inlineQueue.at(-1).src = n.text) : (this.tokens.links[i.tag] || (this.tokens.links[i.tag] = {
					href: i.href,
					title: i.title
				}), t.push(i));
				continue;
			}
			if ((i = this.tokenizer.table(e)) || (i = this.tokenizer.lheading(e))) {
				e = e.substring(i.raw.length), t.push(i);
				continue;
			}
			let a = e;
			if (this.options.extensions?.startBlock) {
				let t = 1 / 0, n = e.slice(1), r;
				this.options.extensions.startBlock.forEach((e) => {
					r = e.call({ lexer: this }, n), typeof r == "number" && r >= 0 && (t = Math.min(t, r));
				}), t < 1 / 0 && t >= 0 && (a = e.substring(0, t + 1));
			}
			if (this.state.top && (i = this.tokenizer.paragraph(a))) {
				let r = t.at(-1);
				n && r?.type === "paragraph" ? (r.raw += (r.raw.endsWith("\n") ? "" : "\n") + i.raw, r.text += "\n" + i.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = r.text) : t.push(i), n = a.length !== e.length, e = e.substring(i.raw.length);
			} else if (i = this.tokenizer.text(e)) {
				e = e.substring(i.raw.length);
				let n = t.at(-1);
				n?.type === "text" ? (n.raw += (n.raw.endsWith("\n") ? "" : "\n") + i.raw, n.text += "\n" + i.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = n.text) : t.push(i);
			} else if (e) {
				this.infiniteLoopError(e.charCodeAt(0));
				break;
			}
		}
		return this.state.top = !0, t;
	}
	inline(e, t = []) {
		return this.inlineQueue.push({
			src: e,
			tokens: t
		}), t;
	}
	linkInText(e) {
		if (!e.includes("[")) return !1;
		let t = this.tokenizer.rules.inline.link;
		for (let n of e.matchAll(this.tokenizer.rules.inline.blockSkip)) if (t.test(n[0]) && e.charAt(n.index - 1) !== "!") return !0;
		for (let t of e.matchAll(this.tokenizer.rules.inline.reflinkSearch)) {
			let e = t[0], n = e.lastIndexOf("[");
			if (e.charAt(0) !== "!" && Object.hasOwn(this.tokens.links, br(e.slice(n + 1, -1))) && !(n > 1 && this.linkInText(e.slice(1, n - 1)))) return !0;
		}
		return !1;
	}
	inlineTokens(e, t = []) {
		this.tokenizer.lexer = this;
		let n = this.state.linkParenPossible;
		this.state.linkParenPossible = n && e.includes(")");
		try {
			return this.#e(e, t);
		} finally {
			this.state.linkParenPossible = n;
		}
	}
	#e(e, t) {
		let n = e.includes("*") || e.includes("_") || e.includes("~") || this.options.hooks?.emStrongMask || this.tokenizer.emStrong !== Mr.prototype.emStrong || this.tokenizer.del !== Mr.prototype.del ? this.#n(e) : e;
		wr(this.tokenizer, n);
		try {
			return this.#t(e, n, t);
		} finally {
			Tr(this.tokenizer);
		}
	}
	#t(e, t, n) {
		let r = !1, i = "", a = 1 / 0;
		for (; e;) {
			if (e.length < a) a = e.length;
			else {
				this.infiniteLoopError(e.charCodeAt(0));
				break;
			}
			r || (i = ""), r = !1;
			let o;
			if (this.options.extensions?.inline?.some((t) => (o = t.call({ lexer: this }, e, n)) ? (e = e.substring(o.raw.length), n.push(o), !0) : !1)) continue;
			if ((o = this.tokenizer.escape(e)) || (o = this.tokenizer.tag(e)) || (o = this.tokenizer.link(e))) {
				e = e.substring(o.raw.length), n.push(o);
				continue;
			}
			if (o = this.tokenizer.reflink(e, this.tokens.links)) {
				e = e.substring(o.raw.length);
				let t = n.at(-1);
				o.type === "text" && t?.type === "text" ? (t.raw += o.raw, t.text += o.text) : n.push(o);
				continue;
			}
			if ((o = this.tokenizer.emStrong(e, t, i)) || (o = this.tokenizer.codespan(e)) || (o = this.tokenizer.br(e)) || (o = this.tokenizer.del(e, t, i)) || (o = this.tokenizer.autolink(e)) || !this.state.inLink && (o = this.tokenizer.url(e))) {
				e = e.substring(o.raw.length), n.push(o);
				continue;
			}
			let s = e;
			if (this.options.extensions?.startInline) {
				let t = 1 / 0, n = e.slice(1), r;
				this.options.extensions.startInline.forEach((e) => {
					r = e.call({ lexer: this }, n), typeof r == "number" && r >= 0 && (t = Math.min(t, r));
				}), t < 1 / 0 && t >= 0 && (s = e.substring(0, t + 1));
			}
			if (o = this.tokenizer.inlineText(s)) {
				e = e.substring(o.raw.length), o.raw.slice(-1) !== "_" && (i = o.raw.slice(-1)), r = !0;
				let t = n.at(-1);
				t?.type === "text" ? (t.raw += o.raw, t.text += o.text) : n.push(o);
			} else if (e) {
				this.infiniteLoopError(e.charCodeAt(0));
				break;
			}
		}
		return n;
	}
	#n(e) {
		let t = e;
		if (this.tokens.links && e.includes("[")) {
			let e = this.tokenizer.rules.inline.reflinkSearch, n = (t) => {
				let r = t.lastIndexOf("[");
				if (!Object.hasOwn(this.tokens.links, br(t.slice(r + 1, -1)))) return t;
				if (r > 1 && t.charAt(0) !== "!") {
					let i = t.slice(1, r - 1);
					if (this.linkInText(i)) return "[" + i.replace(e, n) + "][" + "a".repeat(t.length - r - 2) + "]";
				}
				return "[" + "a".repeat(t.length - 2) + "]";
			};
			t = t.replace(e, n);
		}
		return t = t.replace(this.tokenizer.rules.inline.anyPunctuationOutsideCode, (e, t, n) => n ? "+".repeat(e.length) : t ? t + e.slice(t.length, -t.length).replace(/`/g, "+") + t : e), t = t.replace(this.tokenizer.rules.inline.blockSkip, (e, t, n) => {
			let r = n ? n.length : 0;
			return e.slice(0, r) + "[" + "a".repeat(e.length - r - 2) + "]";
		}), t = this.options.hooks?.emStrongMask?.call({ lexer: this }, t) ?? t, t;
	}
	infiniteLoopError(e) {
		let t = "Infinite loop on byte: " + e;
		if (this.options.silent) console.error(t);
		else throw Error(t);
	}
}, Pr = class {
	options;
	parser;
	constructor(e) {
		this.options = e || Wt;
	}
	space(e) {
		return "";
	}
	code({ text: e, lang: t, escaped: n }) {
		let r = (t || "").match(K.notSpaceStart)?.[0], i = e ? e.replace(K.endingNewline, "") + "\n" : "";
		return r ? "<pre><code class=\"language-" + mr(r) + "\">" + (n ? i : mr(i, !0)) + "</code></pre>\n" : "<pre><code>" + (n ? i : mr(i, !0)) + "</code></pre>\n";
	}
	blockquote({ tokens: e }) {
		return `<blockquote>
${this.parser.parse(e)}</blockquote>
`;
	}
	html({ text: e }) {
		return e;
	}
	def(e) {
		return "";
	}
	heading({ tokens: e, depth: t }) {
		return `<h${t}>${this.parser.parseInline(e)}</h${t}>
`;
	}
	hr(e) {
		return "<hr>\n";
	}
	list(e) {
		let t = e.ordered, n = e.start, r = "";
		for (let t = 0; t < e.items.length; t++) {
			let n = e.items[t];
			r += this.listitem(n);
		}
		let i = t ? "ol" : "ul", a = t && n !== 1 ? " start=\"" + n + "\"" : "";
		return "<" + i + a + ">\n" + r + "</" + i + ">\n";
	}
	listitem(e) {
		return `<li>${this.parser.parse(e.tokens)}</li>
`;
	}
	checkbox({ checked: e }) {
		return "<input " + (e ? "checked=\"\" " : "") + "disabled=\"\" type=\"checkbox\"> ";
	}
	paragraph({ tokens: e }) {
		return `<p>${this.parser.parseInline(e)}</p>
`;
	}
	table(e) {
		let t = "", n = "";
		for (let t = 0; t < e.header.length; t++) n += this.tablecell(e.header[t]);
		t += this.tablerow({ text: n });
		let r = "";
		for (let t = 0; t < e.rows.length; t++) {
			let i = e.rows[t];
			n = "";
			for (let e = 0; e < i.length; e++) n += this.tablecell(i[e]);
			r += this.tablerow({ text: n });
		}
		return r &&= `<tbody>${r}</tbody>`, "<table>\n<thead>\n" + t + "</thead>\n" + r + "</table>\n";
	}
	tablerow({ text: e }) {
		return `<tr>
${e}</tr>
`;
	}
	tablecell(e) {
		let t = this.parser.parseInline(e.tokens), n = e.header ? "th" : "td";
		return (e.align ? `<${n} align="${e.align}">` : `<${n}>`) + t + `</${n}>
`;
	}
	strong({ tokens: e }) {
		return `<strong>${this.parser.parseInline(e)}</strong>`;
	}
	em({ tokens: e }) {
		return `<em>${this.parser.parseInline(e)}</em>`;
	}
	codespan({ text: e }) {
		return `<code>${mr(e, !0)}</code>`;
	}
	br(e) {
		return "<br>";
	}
	del({ tokens: e }) {
		return `<del>${this.parser.parseInline(e)}</del>`;
	}
	link({ href: e, title: t, text: n, tokens: r, autolink: i }) {
		let a = i ? mr(n, !0) : this.parser.parseInline(r), o = gr(e);
		if (o === null) return a;
		e = mr(o, i);
		let s = "<a href=\"" + e + "\"";
		return t && (s += " title=\"" + mr(t) + "\""), s += ">" + a + "</a>", s;
	}
	image({ href: e, title: t, text: n, tokens: r }) {
		r && (n = this.parser.parseInline(r, this.parser.textRenderer));
		let i = gr(e);
		if (i === null) return mr(n);
		e = i;
		let a = `<img src="${mr(e)}" alt="${mr(n)}"`;
		return t && (a += ` title="${mr(t)}"`), a += ">", a;
	}
	text(e) {
		return "tokens" in e && e.tokens ? this.parser.parseInline(e.tokens) : "escaped" in e && e.escaped ? e.text : mr(e.text);
	}
}, Fr = class {
	parser;
	strong({ text: e, tokens: t }) {
		return t ? this.parser.parseInline(t, this) : e;
	}
	em({ text: e, tokens: t }) {
		return t ? this.parser.parseInline(t, this) : e;
	}
	codespan({ text: e }) {
		return e;
	}
	del({ text: e, tokens: t }) {
		return t ? this.parser.parseInline(t, this) : e;
	}
	html({ text: e }) {
		return e;
	}
	text({ text: e }) {
		return e;
	}
	link({ text: e, tokens: t }) {
		return t ? this.parser.parseInline(t, this) : e;
	}
	image({ text: e, tokens: t }) {
		return t ? this.parser.parseInline(t, this) : e;
	}
	br() {
		return "";
	}
	checkbox({ raw: e }) {
		return e;
	}
}, Ir = class e {
	options;
	renderer;
	textRenderer;
	constructor(e) {
		this.options = e || Wt, this.options.renderer = this.options.renderer || new Pr(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new Fr(), this.textRenderer.parser = this;
	}
	static parse(t, n) {
		return new e(n).parse(t);
	}
	static parseInline(t, n) {
		return new e(n).parseInline(t);
	}
	parse(e) {
		this.renderer.parser = this;
		let t = "";
		for (let n = 0; n < e.length; n++) {
			let r = e[n];
			if (this.options.extensions?.renderers?.[r.type]) {
				let e = r, n = this.options.extensions.renderers[e.type].call({ parser: this }, e);
				if (n !== !1 || ![
					"space",
					"hr",
					"heading",
					"code",
					"table",
					"blockquote",
					"list",
					"checkbox",
					"html",
					"def",
					"paragraph",
					"text"
				].includes(e.type)) {
					t += n || "";
					continue;
				}
			}
			let i = r;
			switch (i.type) {
				case "space":
					t += this.renderer.space(i);
					break;
				case "hr":
					t += this.renderer.hr(i);
					break;
				case "heading":
					t += this.renderer.heading(i);
					break;
				case "code":
					t += this.renderer.code(i);
					break;
				case "table":
					t += this.renderer.table(i);
					break;
				case "blockquote":
					t += this.renderer.blockquote(i);
					break;
				case "list":
					t += this.renderer.list(i);
					break;
				case "checkbox":
					t += this.renderer.checkbox(i);
					break;
				case "html":
					t += this.renderer.html(i);
					break;
				case "def":
					t += this.renderer.def(i);
					break;
				case "paragraph":
					t += this.renderer.paragraph(i);
					break;
				case "text":
					t += this.renderer.text(i);
					break;
				default: {
					let e = "Token with \"" + i.type + "\" type was not found.";
					if (this.options.silent) return console.error(e), "";
					throw Error(e);
				}
			}
		}
		return t;
	}
	parseInline(e, t = this.renderer) {
		this.renderer.parser = this;
		let n = "";
		for (let r = 0; r < e.length; r++) {
			let i = e[r];
			if (this.options.extensions?.renderers?.[i.type]) {
				let e = this.options.extensions.renderers[i.type].call({ parser: this }, i);
				if (e !== !1 || ![
					"escape",
					"html",
					"link",
					"image",
					"checkbox",
					"strong",
					"em",
					"codespan",
					"br",
					"del",
					"text"
				].includes(i.type)) {
					n += e || "";
					continue;
				}
			}
			let a = i;
			switch (a.type) {
				case "escape":
					n += t.text(a);
					break;
				case "html":
					n += t.html(a);
					break;
				case "link":
					n += t.link(a);
					break;
				case "image":
					n += t.image(a);
					break;
				case "checkbox":
					n += t.checkbox(a);
					break;
				case "strong":
					n += t.strong(a);
					break;
				case "em":
					n += t.em(a);
					break;
				case "codespan":
					n += t.codespan(a);
					break;
				case "br":
					n += t.br(a);
					break;
				case "del":
					n += t.del(a);
					break;
				case "text":
					n += t.text(a);
					break;
				default: {
					let e = "Token with \"" + a.type + "\" type was not found.";
					if (this.options.silent) return console.error(e), "";
					throw Error(e);
				}
			}
		}
		return n;
	}
}, Lr = class {
	options;
	block;
	constructor(e) {
		this.options = e || Wt;
	}
	static passThroughHooks = /* @__PURE__ */ new Set([
		"preprocess",
		"postprocess",
		"processAllTokens",
		"emStrongMask"
	]);
	static passThroughHooksRespectAsync = /* @__PURE__ */ new Set([
		"preprocess",
		"postprocess",
		"processAllTokens"
	]);
	preprocess(e) {
		return e;
	}
	postprocess(e) {
		return e;
	}
	processAllTokens(e) {
		return e;
	}
	emStrongMask(e) {
		return e;
	}
	provideLexer(e = this.block) {
		return e ? Nr.lex : Nr.lexInline;
	}
	provideParser(e = this.block) {
		return e ? Ir.parse : Ir.parseInline;
	}
};
function Rr(e, t) {
	if (Array.isArray(t)) for (let n = 0; n < t.length; n++) e.push(t[n]);
	else e.push(t);
}
var zr = class {
	defaults = Ut();
	options = this.setOptions;
	parse = this.parseMarkdown(!0);
	parseInline = this.parseMarkdown(!1);
	Parser = Ir;
	Renderer = Pr;
	TextRenderer = Fr;
	Lexer = Nr;
	Tokenizer = Mr;
	Hooks = Lr;
	constructor(...e) {
		this.use(...e);
	}
	walkTokens(e, t) {
		let n = [];
		for (let r of e) switch (Rr(n, t.call(this, r)), r.type) {
			case "table": {
				let e = r;
				for (let r of e.header) Rr(n, this.walkTokens(r.tokens, t));
				for (let r of e.rows) for (let e of r) Rr(n, this.walkTokens(e.tokens, t));
				break;
			}
			case "list": {
				let e = r;
				Rr(n, this.walkTokens(e.items, t));
				break;
			}
			default: {
				let e = r;
				this.defaults.extensions?.childTokens?.[e.type] ? this.defaults.extensions.childTokens[e.type].forEach((r) => {
					let i = e[r].flat(1 / 0);
					Rr(n, this.walkTokens(i, t));
				}) : e.tokens && Rr(n, this.walkTokens(e.tokens, t));
			}
		}
		return n;
	}
	use(...e) {
		let t = this.defaults.extensions || {
			renderers: Object.create(null),
			childTokens: Object.create(null)
		};
		return e.forEach((e) => {
			let n = { ...e };
			if (n.async = this.defaults.async || n.async || !1, e.extensions && (e.extensions.forEach((e) => {
				if (!e.name) throw Error("extension name required");
				if ("renderer" in e) {
					let n = t.renderers[e.name];
					n ? t.renderers[e.name] = function(...t) {
						let r = e.renderer.apply(this, t);
						return r === !1 && (r = n.apply(this, t)), r;
					} : t.renderers[e.name] = e.renderer;
				}
				if ("tokenizer" in e) {
					if (!e.level || e.level !== "block" && e.level !== "inline") throw Error("extension level must be 'block' or 'inline'");
					let n = t[e.level];
					n ? n.unshift(e.tokenizer) : t[e.level] = [e.tokenizer], e.start && (e.level === "block" ? t.startBlock ? t.startBlock.push(e.start) : t.startBlock = [e.start] : e.level === "inline" && (t.startInline ? t.startInline.push(e.start) : t.startInline = [e.start]));
				}
				"childTokens" in e && e.childTokens && (t.childTokens[e.name] = e.childTokens);
			}), n.extensions = t), e.renderer) {
				let t = this.defaults.renderer || new Pr(this.defaults);
				for (let n in e.renderer) {
					if (!(n in t)) throw Error(`renderer '${n}' does not exist`);
					if (["options", "parser"].includes(n)) continue;
					let r = n, i = e.renderer[r], a = t[r];
					t[r] = (...e) => {
						let n = i.apply(t, e);
						return n === !1 && (n = a.apply(t, e)), n === !1 ? "" : n ?? "";
					};
				}
				n.renderer = t;
			}
			if (e.tokenizer) {
				let t = this.defaults.tokenizer || new Mr(this.defaults);
				for (let n in e.tokenizer) {
					if (!(n in t)) throw Error(`tokenizer '${n}' does not exist`);
					if ([
						"options",
						"rules",
						"lexer"
					].includes(n)) continue;
					let r = n, i = e.tokenizer[r], a = t[r];
					t[r] = (...e) => {
						let n = i.apply(t, e);
						return n === !1 && (n = a.apply(t, e)), n;
					};
				}
				n.tokenizer = t;
			}
			if (e.hooks) {
				let t = this.defaults.hooks || new Lr();
				for (let n in e.hooks) {
					if (!(n in t)) throw Error(`hook '${n}' does not exist`);
					if (["options", "block"].includes(n)) continue;
					let r = n, i = e.hooks[r], a = t[r];
					t[r] = Lr.passThroughHooks.has(n) ? (e) => {
						if (t.options.async && Lr.passThroughHooksRespectAsync.has(n)) return (async () => {
							let n = await i.call(t, e);
							return a.call(t, n);
						})();
						let r = i.call(t, e);
						return a.call(t, r);
					} : (...e) => {
						if (t.options.async) return (async () => {
							let n = await i.apply(t, e);
							return n === !1 && (n = await a.apply(t, e)), n;
						})();
						let n = i.apply(t, e);
						return n === !1 && (n = a.apply(t, e)), n;
					};
				}
				n.hooks = t;
			}
			if (e.walkTokens) {
				let t = this.defaults.walkTokens, r = e.walkTokens;
				n.walkTokens = function(e) {
					let n = [];
					return Rr(n, r.call(this, e)), t && Rr(n, t.call(this, e)), n;
				};
			}
			this.defaults = {
				...this.defaults,
				...n
			};
		}), this;
	}
	setOptions(e) {
		return this.defaults = {
			...this.defaults,
			...e
		}, this;
	}
	lexer(e, t) {
		return Nr.lex(e, t ?? this.defaults);
	}
	parser(e, t) {
		return Ir.parse(e, t ?? this.defaults);
	}
	parseMarkdown(e) {
		return (t, n) => {
			let r = { ...n }, i = {
				...this.defaults,
				...r
			}, a = this.onError(!!i.silent, !!i.async);
			if (this.defaults.async === !0 && r.async === !1) return a(/* @__PURE__ */ Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));
			if (typeof t > "u" || t === null) return a(/* @__PURE__ */ Error("marked(): input parameter is undefined or null"));
			if (typeof t != "string") return a(/* @__PURE__ */ Error("marked(): input parameter is of type " + Object.prototype.toString.call(t) + ", string expected"));
			if (i.hooks && (i.hooks.options = i, i.hooks.block = e), i.async) return (async () => {
				let n = i.hooks ? await i.hooks.preprocess(t) : t, r = await (i.hooks ? await i.hooks.provideLexer(e) : e ? Nr.lex : Nr.lexInline)(n, i), a = i.hooks ? await i.hooks.processAllTokens(r) : r;
				i.walkTokens && await Promise.all(this.walkTokens(a, i.walkTokens));
				let o = await (i.hooks ? await i.hooks.provideParser(e) : e ? Ir.parse : Ir.parseInline)(a, i);
				return i.hooks ? await i.hooks.postprocess(o) : o;
			})().catch(a);
			try {
				i.hooks && (t = i.hooks.preprocess(t));
				let n = (i.hooks ? i.hooks.provideLexer(e) : e ? Nr.lex : Nr.lexInline)(t, i);
				i.hooks && (n = i.hooks.processAllTokens(n)), i.walkTokens && this.walkTokens(n, i.walkTokens);
				let r = (i.hooks ? i.hooks.provideParser(e) : e ? Ir.parse : Ir.parseInline)(n, i);
				return i.hooks && (r = i.hooks.postprocess(r)), r;
			} catch (e) {
				return a(e);
			}
		};
	}
	onError(e, t) {
		return (n) => {
			if (n.message += "\nPlease report this to https://github.com/markedjs/marked.", e) {
				let e = "<p>An error occurred:</p><pre>" + mr(n.message + "", !0) + "</pre>";
				return t ? Promise.resolve(e) : e;
			}
			if (t) return Promise.reject(n);
			throw n;
		};
	}
}, Br = new zr();
function q(e, t) {
	return Br.parse(e, t);
}
q.options = q.setOptions = function(e) {
	return Br.setOptions(e), q.defaults = Br.defaults, Gt(q.defaults), q;
}, q.getDefaults = Ut, q.defaults = Wt;
function Vr(...e) {
	return Br.use(...e), q.defaults = Br.defaults, Gt(q.defaults), q;
}
q.use = Vr, q.walkTokens = function(e, t) {
	return Br.walkTokens(e, t);
}, q.parseInline = Br.parseInline, q.Parser = Ir, q.parser = Ir.parse, q.Renderer = Pr, q.TextRenderer = Fr, q.Lexer = Nr, q.lexer = Nr.lex, q.Tokenizer = Mr, q.Hooks = Lr, q.parse = q, q.options, q.setOptions, q.walkTokens, q.parseInline, Ir.parse, Nr.lex;
// node_modules/dompurify/dist/purify.es.mjs
function Hr(e, t) {
	this.v = e, this.k = t;
}
function Ur(e, t) {
	(t == null || t > e.length) && (t = e.length);
	for (var n = 0, r = Array(t); n < t; n++) r[n] = e[n];
	return r;
}
function Wr(e) {
	if (Array.isArray(e)) return e;
}
function Gr(e, t) {
	var n = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
	if (n != null) {
		var r, i, a, o, s = [], c = !0, l = !1;
		try {
			if (a = (n = n.call(e)).next, t === 0) {
				if (Object(n) !== n) return;
				c = !1;
			} else for (; !(c = (r = a.call(n)).done) && (s.push(r.value), s.length !== t); c = !0);
		} catch (e) {
			l = !0, i = e;
		} finally {
			try {
				if (!c && n.return != null && (o = n.return(), Object(o) !== o)) return;
			} finally {
				if (l) throw i;
			}
		}
		return s;
	}
}
function Kr() {
	throw TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function qr(e, t) {
	return Wr(e) || Gr(e, t) || Jr(e, t) || Kr();
}
function Jr(e, t) {
	if (e) {
		if (typeof e == "string") return Ur(e, t);
		var n = {}.toString.call(e).slice(8, -1);
		return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? Ur(e, t) : void 0;
	}
}
function Yr(e) {
	var t, n;
	function r(t, n) {
		try {
			var a = e[t](n), o = a.value, s = o instanceof Hr;
			Promise.resolve(s ? o.v : o).then(function(n) {
				if (s) {
					var c = t === "return" && o.k ? t : "next";
					if (!o.k || n.done) return r(c, n);
					n = e[c](n).value;
				}
				i(!!a.done, n);
			}, function(e) {
				r("throw", e);
			});
		} catch (e) {
			i(2, e);
		}
	}
	function i(e, i) {
		e === 2 ? t.reject(i) : t.resolve({
			value: i,
			done: e
		}), (t = t.next) ? r(t.key, t.arg) : n = null;
	}
	this._invoke = function(e, i) {
		return new Promise(function(a, o) {
			var s = {
				key: e,
				arg: i,
				resolve: a,
				reject: o,
				next: null
			};
			n ? n = n.next = s : (t = n = s, r(e, i));
		});
	}, typeof e.return != "function" && (this.return = void 0);
}
Yr.prototype[typeof Symbol == "function" && Symbol.asyncIterator || "@@asyncIterator"] = function() {
	return this;
}, Yr.prototype.next = function(e) {
	return this._invoke("next", e);
}, Yr.prototype.throw = function(e) {
	return this._invoke("throw", e);
}, Yr.prototype.return = function(e) {
	return this._invoke("return", e);
};
var Xr = Object.entries, Zr = Object.setPrototypeOf, Qr = Object.isFrozen, $r = Object.getPrototypeOf, ei = Object.getOwnPropertyDescriptor, J = Object.freeze, Y = Object.seal, ti = Object.create, ni = typeof Reflect < "u" && Reflect, ri = ni.apply, ii = ni.construct;
J ||= function(e) {
	return e;
}, Y ||= function(e) {
	return e;
}, ri ||= function(e, t) {
	var n = [...arguments].slice(2);
	return e.apply(t, n);
}, ii ||= function(e) {
	return new e(...[...arguments].slice(1));
};
var ai = Z(Array.prototype.forEach);
Array.prototype.indexOf;
var oi = Z(Array.prototype.lastIndexOf), si = Z(Array.prototype.pop), ci = Z(Array.prototype.push), li = Z(Array.prototype.slice), ui = Z(Array.prototype.splice), di = Array.isArray, fi = Oi(Set), pi = Z(Set.prototype.add), mi = Z(Set.prototype.has), hi = Z(String.prototype.toLowerCase), gi = Z(String.prototype.toString), _i = Z(String.prototype.match), vi = Z(String.prototype.replace), yi = Z(String.prototype.indexOf), bi = Z(String.prototype.trim), xi = Z(Number.prototype.toString), Si = Z(Boolean.prototype.toString), Ci = typeof BigInt > "u" ? null : Z(BigInt.prototype.toString), wi = typeof Symbol > "u" ? null : Z(Symbol.prototype.toString), Ti = Z(Object.prototype.hasOwnProperty), Ei = Z(Object.prototype.toString), X = Z(RegExp.prototype.test), Di = Oi(TypeError);
function Z(e) {
	return function(t) {
		t instanceof RegExp && (t.lastIndex = 0);
		var n = [...arguments].slice(1);
		return ri(e, t, n);
	};
}
function Oi(e) {
	return function() {
		return ii(e, [...arguments]);
	};
}
function Q(e, t) {
	let n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : hi;
	if (Zr && Zr(e, null), !di(t)) return e;
	let r = t.length;
	for (; r--;) {
		let i = t[r];
		if (typeof i == "string") {
			let e = n(i);
			e !== i && (Qr(t) || (t[r] = e), i = e);
		}
		e[i] = !0;
	}
	return e;
}
function ki(e) {
	for (let t = 0; t < e.length; t++) Ti(e, t) || (e[t] = null);
	return e;
}
function Ai(e) {
	let t = ti(null);
	for (let r of Xr(e)) {
		var n = qr(r, 2);
		let i = n[0], a = n[1];
		Ti(e, i) && (t[i] = di(a) ? ki(a) : a && typeof a == "object" && a.constructor === Object ? Ai(a) : a);
	}
	return t;
}
function ji(e) {
	switch (typeof e) {
		case "string": return e;
		case "number": return xi(e);
		case "boolean": return Si(e);
		case "bigint": return Ci ? Ci(e) : "0";
		case "symbol": return wi ? wi(e) : "Symbol()";
		case "undefined": return Ei(e);
		case "function":
		case "object": {
			if (e === null) return Ei(e);
			let t = e, n = Mi(t, "toString");
			if (typeof n == "function") {
				let e = n(t);
				return typeof e == "string" ? e : Ei(e);
			}
			return Ei(e);
		}
		default: return Ei(e);
	}
}
function Mi(e, t) {
	for (; e !== null;) {
		let n = ei(e, t);
		if (n) {
			if (n.get) return Z(n.get);
			if (typeof n.value == "function") return Z(n.value);
		}
		e = $r(e);
	}
	function n() {
		return null;
	}
	return n;
}
function Ni(e, t) {
	for (; e !== null;) {
		let n = ei(e, t);
		if (n) return n.get ? Z(n.get) : null;
		e = $r(e);
	}
	return null;
}
function Pi(e) {
	try {
		return X(e, ""), !0;
	} catch {
		return !1;
	}
}
var Fi = J(/* @__PURE__ */ "a.abbr.acronym.address.area.article.aside.audio.b.bdi.bdo.big.blink.blockquote.body.br.button.canvas.caption.center.cite.code.col.colgroup.content.data.datalist.dd.decorator.del.details.dfn.dialog.dir.div.dl.dt.element.em.fieldset.figcaption.figure.font.footer.form.h1.h2.h3.h4.h5.h6.head.header.hgroup.hr.html.i.img.input.ins.kbd.label.legend.li.main.map.mark.marquee.menu.menuitem.meter.nav.nobr.ol.optgroup.option.output.p.picture.pre.progress.q.rp.rt.ruby.s.samp.search.section.select.shadow.slot.small.source.spacer.span.strike.strong.style.sub.summary.sup.table.tbody.td.template.textarea.tfoot.th.thead.time.tr.track.tt.u.ul.var.video.wbr".split(".")), Ii = J(/* @__PURE__ */ "svg.a.altglyph.altglyphdef.altglyphitem.animatecolor.animatemotion.animatetransform.circle.clippath.defs.desc.ellipse.enterkeyhint.exportparts.filter.font.g.glyph.glyphref.hkern.image.inputmode.line.lineargradient.marker.mask.metadata.mpath.part.path.pattern.polygon.polyline.radialgradient.rect.stop.style.switch.symbol.text.textpath.title.tref.tspan.view.vkern".split(".")), Li = J([
	"feBlend",
	"feColorMatrix",
	"feComponentTransfer",
	"feComposite",
	"feConvolveMatrix",
	"feDiffuseLighting",
	"feDisplacementMap",
	"feDistantLight",
	"feDropShadow",
	"feFlood",
	"feFuncA",
	"feFuncB",
	"feFuncG",
	"feFuncR",
	"feGaussianBlur",
	"feImage",
	"feMerge",
	"feMergeNode",
	"feMorphology",
	"feOffset",
	"fePointLight",
	"feSpecularLighting",
	"feSpotLight",
	"feTile",
	"feTurbulence"
]), Ri = J([
	"animate",
	"color-profile",
	"cursor",
	"discard",
	"font-face",
	"font-face-format",
	"font-face-name",
	"font-face-src",
	"font-face-uri",
	"foreignobject",
	"hatch",
	"hatchpath",
	"mesh",
	"meshgradient",
	"meshpatch",
	"meshrow",
	"missing-glyph",
	"script",
	"set",
	"solidcolor",
	"unknown",
	"use"
]), zi = J(/* @__PURE__ */ "math.menclose.merror.mfenced.mfrac.mglyph.mi.mlabeledtr.mmultiscripts.mn.mo.mover.mpadded.mphantom.mroot.mrow.ms.mspace.msqrt.mstyle.msub.msup.msubsup.mtable.mtd.mtext.mtr.munder.munderover.mprescripts".split(".")), Bi = J([
	"maction",
	"maligngroup",
	"malignmark",
	"mlongdiv",
	"mscarries",
	"mscarry",
	"msgroup",
	"mstack",
	"msline",
	"msrow",
	"semantics",
	"annotation",
	"annotation-xml",
	"mprescripts",
	"none"
]), Vi = J(["#text"]), Hi = J(/* @__PURE__ */ "accept.action.align.alt.autocapitalize.autocomplete.autopictureinpicture.autoplay.background.bgcolor.border.capture.cellpadding.cellspacing.checked.cite.class.clear.color.cols.colspan.command.commandfor.controls.controlslist.coords.crossorigin.datetime.decoding.default.dir.disabled.disablepictureinpicture.disableremoteplayback.download.draggable.enctype.enterkeyhint.exportparts.face.for.headers.height.hidden.high.href.hreflang.id.inert.inputmode.integrity.ismap.kind.label.lang.list.loading.loop.low.max.maxlength.media.method.min.minlength.multiple.muted.name.nonce.noshade.novalidate.nowrap.open.optimum.part.pattern.placeholder.playsinline.popover.popovertarget.popovertargetaction.poster.preload.pubdate.radiogroup.readonly.rel.required.rev.reversed.role.rows.rowspan.spellcheck.scope.selected.shape.size.sizes.slot.span.srclang.start.src.srcset.step.style.summary.tabindex.title.translate.type.usemap.valign.value.width.wrap.xmlns".split(".")), Ui = J(/* @__PURE__ */ "accent-height.accumulate.additive.alignment-baseline.amplitude.ascent.attributename.attributetype.azimuth.basefrequency.baseline-shift.begin.bias.by.class.clip.clippathunits.clip-path.clip-rule.color.color-interpolation.color-interpolation-filters.color-profile.color-rendering.cx.cy.d.dx.dy.diffuseconstant.direction.display.divisor.dominant-baseline.dur.edgemode.elevation.end.exponent.fill.fill-opacity.fill-rule.filter.filterunits.flood-color.flood-opacity.font-family.font-size.font-size-adjust.font-stretch.font-style.font-variant.font-weight.fx.fy.g1.g2.glyph-name.glyphref.gradientunits.gradienttransform.height.href.id.image-rendering.in.in2.intercept.k.k1.k2.k3.k4.kerning.keypoints.keysplines.keytimes.lang.lengthadjust.letter-spacing.kernelmatrix.kernelunitlength.lighting-color.local.marker-end.marker-mid.marker-start.markerheight.markerunits.markerwidth.maskcontentunits.maskunits.max.mask.mask-type.media.method.mode.min.name.numoctaves.offset.operator.opacity.order.orient.orientation.origin.overflow.paint-order.path.pathlength.patterncontentunits.patterntransform.patternunits.pointer-events.points.preservealpha.preserveaspectratio.primitiveunits.r.rx.ry.radius.refx.refy.repeatcount.repeatdur.restart.result.rotate.scale.seed.shape-rendering.slope.specularconstant.specularexponent.spreadmethod.startoffset.stddeviation.stitchtiles.stop-color.stop-opacity.stroke-dasharray.stroke-dashoffset.stroke-linecap.stroke-linejoin.stroke-miterlimit.stroke-opacity.stroke.stroke-width.style.surfacescale.systemlanguage.tabindex.tablevalues.targetx.targety.transform.transform-origin.text-anchor.text-decoration.text-orientation.text-rendering.textlength.type.u1.u2.unicode.values.vector-effect.viewbox.visibility.version.vert-adv-y.vert-origin-x.vert-origin-y.width.word-spacing.wrap.writing-mode.xchannelselector.ychannelselector.x.x1.x2.xmlns.y.y1.y2.z.zoomandpan".split(".")), Wi = J(/* @__PURE__ */ "accent.accentunder.align.bevelled.close.columnalign.columnlines.columnspacing.columnspan.denomalign.depth.dir.display.displaystyle.encoding.fence.frame.height.href.id.largeop.length.linethickness.lquote.lspace.mathbackground.mathcolor.mathsize.mathvariant.maxsize.minsize.movablelimits.notation.numalign.open.rowalign.rowlines.rowspacing.rowspan.rspace.rquote.scriptlevel.scriptminsize.scriptsizemultiplier.selection.separator.separators.stretchy.subscriptshift.supscriptshift.symmetric.voffset.width.xmlns".split(".")), Gi = J([
	"xlink:href",
	"xml:id",
	"xlink:title",
	"xml:space",
	"xmlns:xlink"
]), Ki = Y(/{{[\w\W]*|^[\w\W]*}}/g), qi = Y(/<%[\w\W]*|^[\w\W]*%>/g), Ji = Y(/\${[\w\W]*/g), Yi = Y(/^data-[\-\w.\u00B7-\uFFFF]+$/), Xi = Y(/^aria-[\-\w]+$/), Zi = Y(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i), Qi = Y(/^(?:\w+script|data):/i), $i = Y(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g), ea = Y(/^html$/i), ta = Y(/^[a-z][.\w]*(-[.\w]+)+$/i), na = Y(/<[/\w!]/g), ra = Y(/<[/\w]/g), ia = Y(/<\/no(script|embed|frames)/i), aa = Y(/\/>/i), $ = {
	element: 1,
	attribute: 2,
	text: 3,
	cdataSection: 4,
	entityReference: 5,
	entityNode: 6,
	processingInstruction: 7,
	comment: 8,
	document: 9,
	documentType: 10,
	documentFragment: 11,
	notation: 12
}, oa = J(Q({}, [
	"style",
	"script",
	"xmp",
	"iframe",
	"noembed",
	"noframes",
	"plaintext",
	"noscript"
])), sa = function() {
	return typeof window > "u" ? null : window;
}, ca = function(e, t) {
	if (typeof e != "object" || typeof e.createPolicy != "function") return null;
	let n = null, r = "data-tt-policy-suffix";
	t && t.hasAttribute(r) && (n = t.getAttribute(r));
	let i = "dompurify" + (n ? "#" + n : "");
	try {
		return e.createPolicy(i, {
			createHTML(e) {
				return e;
			},
			createScriptURL(e) {
				return e;
			}
		});
	} catch {
		return console.warn("TrustedTypes policy " + i + " could not be created."), null;
	}
}, la = function() {
	return {
		afterSanitizeAttributes: [],
		afterSanitizeElements: [],
		afterSanitizeShadowDOM: [],
		beforeSanitizeAttributes: [],
		beforeSanitizeElements: [],
		beforeSanitizeShadowDOM: [],
		uponSanitizeAttribute: [],
		uponSanitizeElement: [],
		uponSanitizeShadowNode: []
	};
}, ua = function(e, t, n, r) {
	return Ti(e, t) && di(e[t]) ? Q(r.base ? Ai(r.base) : {}, e[t], r.transform) : n;
}, da = function(e, t, n) {
	let r = Ti(e, t) ? e[t] : void 0;
	return r && typeof r == "object" ? Ai(r) : n();
};
function fa() {
	let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : sa(), t = (e) => fa(e);
	if (t.version = "3.4.17", t.removed = [], !e || !e.document || e.document.nodeType !== $.document || !e.Element) return t.isSupported = !1, t;
	let n = e.document, r = n, i = r.currentScript;
	e.DocumentFragment;
	let a = e.HTMLTemplateElement, o = e.Node, s = e.Element, c = e.NodeFilter;
	e.NamedNodeMap === void 0 && (e.NamedNodeMap || e.MozNamedAttrMap), e.HTMLFormElement;
	let l = e.DOMParser, u = e.trustedTypes, d = s.prototype, f = Mi(d, "cloneNode"), p = Mi(d, "remove"), m = Mi(d, "removeAttributeNode"), h = Mi(d, "nextSibling"), g = Mi(d, "childNodes"), _ = Mi(d, "parentNode"), v = Mi(d, "shadowRoot"), y = Mi(d, "attributes"), b = o && o.prototype ? Mi(o.prototype, "nodeType") : null, x = o && o.prototype ? Mi(o.prototype, "nodeName") : null, S = o && o.prototype ? Mi(o.prototype, "ownerDocument") : null, C = function(e) {
		return b ? b(e) : e.nodeType;
	}, ee = function(e) {
		return x ? x(e) : e.nodeName;
	}, te = Ni(d, "namespaceURI"), ne = function(e) {
		return te ? te(e) : e.namespaceURI;
	};
	if (typeof a == "function") {
		let e = n.createElement("template");
		e.content && e.content.ownerDocument && (n = e.content.ownerDocument);
	}
	let w, T = "", E, re = !1, ie = 0, ae = function() {
		if (ie > 0) throw Di("A configured TRUSTED_TYPES_POLICY callback (createHTML or createScriptURL) must not call DOMPurify.sanitize, as that causes infinite recursion. Do not pass a policy whose callbacks wrap DOMPurify as TRUSTED_TYPES_POLICY; see the \"DOMPurify and Trusted Types\" section of the README.");
	}, oe = function(e) {
		ae(), ie++;
		try {
			return w.createHTML(e);
		} finally {
			ie--;
		}
	}, se = function(e) {
		ae(), ie++;
		try {
			return w.createScriptURL(e);
		} finally {
			ie--;
		}
	}, D = function() {
		return re ||= (E = ca(u, i), !0), E;
	}, ce = n, le = ce.implementation, ue = ce.createNodeIterator, de = ce.createDocumentFragment, fe = ce.getElementsByTagName, pe = r.importNode, O = la();
	t.isSupported = typeof Xr == "function" && typeof _ == "function" && le && le.createHTMLDocument !== void 0;
	let me = Ki, he = qi, ge = Ji, _e = Yi, ve = Xi, k = Qi, ye = $i, be = ta, xe = Zi, A = null, j = Q({}, [
		...Fi,
		...Ii,
		...Li,
		...zi,
		...Vi
	]), M = null, Se = Q({}, [
		...Hi,
		...Ui,
		...Wi,
		...Gi
	]), Ce = Object.seal(ti(null, {
		tagNameCheck: {
			writable: !0,
			configurable: !1,
			enumerable: !0,
			value: null
		},
		attributeNameCheck: {
			writable: !0,
			configurable: !1,
			enumerable: !0,
			value: null
		},
		allowCustomizedBuiltInElements: {
			writable: !0,
			configurable: !1,
			enumerable: !0,
			value: !1
		}
	})), we = null, Te = null, Ee = Object.seal(ti(null, {
		tagCheck: {
			writable: !0,
			configurable: !1,
			enumerable: !0,
			value: null
		},
		attributeCheck: {
			writable: !0,
			configurable: !1,
			enumerable: !0,
			value: null
		}
	})), De = !0, N = !0, Oe = !1, P = !0, ke = !1, F = !0, Ae = !1, je = !1, Me = null, Ne = null, Pe = !1, Fe = !1, Ie = !1, Le = !1, Re = !0, ze = !1, Be = "user-content-", Ve = !0, He = !1, Ue = null, We = {}, Ge = null, I = Q({}, /* @__PURE__ */ "annotation-xml.audio.colgroup.desc.foreignobject.head.iframe.math.mi.mn.mo.ms.mtext.noembed.noframes.noscript.plaintext.script.selectedcontent.style.svg.template.thead.title.video.xmp".split(".")), Ke = null, L = Q({}, [
		"audio",
		"video",
		"img",
		"source",
		"image",
		"track"
	]), qe = null, R = Q({}, [
		"alt",
		"class",
		"for",
		"id",
		"label",
		"name",
		"pattern",
		"placeholder",
		"role",
		"summary",
		"title",
		"value",
		"style",
		"xmlns"
	]), z = "http://www.w3.org/1998/Math/MathML", B = "http://www.w3.org/2000/svg", Je = "http://www.w3.org/1999/xhtml", Ye = Je, Xe = !1, V = null, Ze = Q({}, [
		z,
		B,
		Je
	], gi), Qe = J([
		"mi",
		"mo",
		"mn",
		"ms",
		"mtext"
	]), $e = Q({}, Qe), H = J(["annotation-xml"]), U = Q({}, H), et = Q({}, [
		"title",
		"style",
		"font",
		"a",
		"script"
	]), tt = null, nt = ["application/xhtml+xml", "text/html"], W = null, rt = null, it = n.createElement("form"), at = function(e) {
		return e instanceof RegExp || e instanceof Function;
	}, ot = function() {
		let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
		if (rt && rt === e) return;
		e && typeof e == "object" || (e = {}), e = Ai(e), tt = nt.indexOf(e.PARSER_MEDIA_TYPE) === -1 ? "text/html" : e.PARSER_MEDIA_TYPE, W = tt === "application/xhtml+xml" ? gi : hi, A = ua(e, "ALLOWED_TAGS", j, { transform: W }), M = ua(e, "ALLOWED_ATTR", Se, { transform: W }), V = ua(e, "ALLOWED_NAMESPACES", Ze, { transform: gi }), qe = ua(e, "ADD_URI_SAFE_ATTR", R, {
			transform: W,
			base: R
		}), Ke = ua(e, "ADD_DATA_URI_TAGS", L, {
			transform: W,
			base: L
		}), Ge = ua(e, "FORBID_CONTENTS", I, { transform: W }), we = ua(e, "FORBID_TAGS", Ai({}), { transform: W }), Te = ua(e, "FORBID_ATTR", Ai({}), { transform: W }), We = Ti(e, "USE_PROFILES") ? e.USE_PROFILES && typeof e.USE_PROFILES == "object" ? Ai(e.USE_PROFILES) : e.USE_PROFILES : !1, De = e.ALLOW_ARIA_ATTR !== !1, N = e.ALLOW_DATA_ATTR !== !1, Oe = e.ALLOW_UNKNOWN_PROTOCOLS || !1, P = e.ALLOW_SELF_CLOSE_IN_ATTR !== !1, ke = e.SAFE_FOR_TEMPLATES || !1, F = e.SAFE_FOR_XML !== !1, Ae = e.WHOLE_DOCUMENT || !1, Fe = e.RETURN_DOM || !1, Ie = e.RETURN_DOM_FRAGMENT || !1, Le = e.RETURN_TRUSTED_TYPE || !1, Pe = e.FORCE_BODY || !1, Re = e.SANITIZE_DOM !== !1, ze = e.SANITIZE_NAMED_PROPS || !1, Ve = e.KEEP_CONTENT !== !1, He = e.IN_PLACE || !1, xe = Pi(e.ALLOWED_URI_REGEXP) ? e.ALLOWED_URI_REGEXP : Zi, Ye = typeof e.NAMESPACE == "string" ? e.NAMESPACE : Je, $e = da(e, "MATHML_TEXT_INTEGRATION_POINTS", () => Q({}, Qe)), U = da(e, "HTML_INTEGRATION_POINTS", () => Q({}, H));
		let t = da(e, "CUSTOM_ELEMENT_HANDLING", () => ti(null));
		if (Ce = ti(null), Ti(t, "tagNameCheck") && at(t.tagNameCheck) && (Ce.tagNameCheck = t.tagNameCheck), Ti(t, "attributeNameCheck") && at(t.attributeNameCheck) && (Ce.attributeNameCheck = t.attributeNameCheck), Ti(t, "allowCustomizedBuiltInElements") && typeof t.allowCustomizedBuiltInElements == "boolean" && (Ce.allowCustomizedBuiltInElements = t.allowCustomizedBuiltInElements), Y(Ce), ke && (N = !1), Ie && (Fe = !0), We && (A = Q({}, Vi), M = ti(null), We.html === !0 && (Q(A, Fi), Q(M, Hi)), We.svg === !0 && (Q(A, Ii), Q(M, Ui), Q(M, Gi)), We.svgFilters === !0 && (Q(A, Li), Q(M, Ui), Q(M, Gi)), We.mathMl === !0 && (Q(A, zi), Q(M, Wi), Q(M, Gi))), Ee.tagCheck = null, Ee.attributeCheck = null, Ti(e, "ADD_TAGS") && (typeof e.ADD_TAGS == "function" ? Ee.tagCheck = e.ADD_TAGS : di(e.ADD_TAGS) && (A === j && (A = Ai(A)), Q(A, e.ADD_TAGS, W))), Ti(e, "ADD_ATTR") && (typeof e.ADD_ATTR == "function" ? Ee.attributeCheck = e.ADD_ATTR : di(e.ADD_ATTR) && (M === Se && (M = Ai(M)), Q(M, e.ADD_ATTR, W))), Ti(e, "ADD_FORBID_CONTENTS") && di(e.ADD_FORBID_CONTENTS) && (Ge === I && (Ge = Ai(Ge)), Q(Ge, e.ADD_FORBID_CONTENTS, W)), Ve && (A["#text"] = !0), Ae && Q(A, [
			"html",
			"head",
			"body"
		]), A.table && (Q(A, ["tbody"]), delete we.tbody), e.TRUSTED_TYPES_POLICY) {
			if (typeof e.TRUSTED_TYPES_POLICY.createHTML != "function") throw Di("TRUSTED_TYPES_POLICY configuration option must provide a \"createHTML\" hook.");
			if (typeof e.TRUSTED_TYPES_POLICY.createScriptURL != "function") throw Di("TRUSTED_TYPES_POLICY configuration option must provide a \"createScriptURL\" hook.");
			let t = w;
			w = e.TRUSTED_TYPES_POLICY;
			try {
				T = oe("");
			} catch (e) {
				throw w = t, e;
			}
		} else e.TRUSTED_TYPES_POLICY === null ? (w = void 0, T = "") : (w === void 0 && (w = D()), w && typeof T == "string" && (T = oe("")));
		J && J(e), rt = e;
	}, st = Q({}, [
		...Ii,
		...Li,
		...Ri
	]), ct = Q({}, [...zi, ...Bi]), lt = function(e, t, n) {
		return t.namespaceURI === Je ? e === "svg" : t.namespaceURI === z ? e === "svg" && (n === "annotation-xml" || $e[n]) : !!st[e];
	}, ut = function(e, t, n) {
		return t.namespaceURI === Je ? e === "math" : t.namespaceURI === B ? e === "math" && U[n] : !!ct[e];
	}, dt = function(e, t, n) {
		return t.namespaceURI === B && !U[n] || t.namespaceURI === z && !$e[n] ? !1 : !ct[e] && (et[e] || !st[e]);
	}, ft = function(e) {
		let t = ne(e), n = hi(ee(e)), r = _(e), i, a;
		return r && C(r) === $.element ? (i = { namespaceURI: ne(r) }, a = hi(ee(r))) : (i = { namespaceURI: Ye }, a = "template"), V[t] ? t === B ? lt(n, i, a) : t === z ? ut(n, i, a) : t === Je ? dt(n, i, a) : !!(tt === "application/xhtml+xml" && V[t]) : !1;
	}, pt = function(e) {
		ci(t.removed, { element: e });
		try {
			_(e).removeChild(e);
		} catch {
			if (p(e), !_(e)) throw Di("a node selected for removal could not be detached from its tree and cannot be safely returned; refusing to sanitize in place");
		}
	}, mt = function(e, t, n) {
		try {
			m(e, t);
		} catch {
			try {
				e.removeAttribute(n);
			} catch {}
		}
	}, ht = function(e) {
		yt(e);
		let t = g(e);
		t && ai(li(t), (e) => {
			try {
				p(e);
			} catch {}
		});
		let n = C(e) === $.element ? y(e) : null;
		if (n) for (let t = n.length - 1; t >= 0; --t) {
			let r = n[t], i = r && r.name;
			typeof i == "string" && mt(e, r, i);
		}
	}, gt = function(e, n, r) {
		if (!r) try {
			r = n.getAttributeNode(e);
		} catch {
			r = null;
		}
		ci(t.removed, {
			attribute: r || null,
			from: n
		});
		try {
			r ? m(n, r) : n.removeAttribute(e);
		} catch {
			try {
				n.removeAttribute(e);
			} catch {}
		}
		if (e === "is") {
			if (Fe || Ie) try {
				pt(n);
			} catch {}
			else try {
				n.setAttribute(e, "");
			} catch {}
		}
	}, _t = function(e) {
		let t = y(e);
		if (t) for (let n = t.length - 1; n >= 0; --n) {
			let r = t[n], i = r && r.name;
			typeof i != "string" || M[W(i)] || mt(e, r, i);
		}
	}, vt = function(e, t) {
		let n = arguments.length > 2 && arguments[2] !== void 0 && arguments[2], r = [e];
		for (; r.length > 0;) {
			let e = r.pop();
			if (t(e) === !1) continue;
			if (n && C(e) === $.element) {
				let t = v(e);
				Pt(t) && r.push(t);
			}
			let i = g(e);
			if (i) for (let e = i.length - 1; e >= 0; --e) r.push(i[e]);
		}
	}, yt = function(e) {
		vt(e, (e) => {
			C(e) === $.element && _t(e);
		});
	}, bt = function(e) {
		let t = [];
		return vt(e, (e) => {
			t.push(e);
		}, !0), t;
	}, xt = function(e, t) {
		let n = fi();
		ai(bt(e), (e) => {
			C(e) === $.element && pi(n, e);
		}), ai(t, (e) => {
			C(e) === $.element && !mi(n, e) && _t(e);
		});
	}, St = function(e, n) {
		let r = !1;
		return ai(t.removed, (t) => {
			t.element && (r ||= t.element === e, yt(t.element));
		}), xt(e, n), r;
	}, Ct = function(e, t) {
		let n = Ue, r = null, i = () => (r || (r = fi(), ai(t, (e) => {
			pi(r, e);
		})), r);
		for (let t = 0;; t++) {
			let r = bt(e), a = [e], o = !1;
			if (ai(r, (e) => {
				C(e) === $.documentFragment ? ci(a, e) : !o && !mi(n, e) && (o = mi(i(), e));
			}), !o) return;
			if (t >= 8) throw Di("the tree kept changing during in-place sanitization; refusing to return it");
			ai(a, (t, n) => {
				wt(t, n > 0, e, i());
			});
		}
	}, wt = function(e, t, n, r) {
		let i = kt(e), a;
		for (; a = i.nextNode();) mi(r, a) && !mi(Ue, a) && (t && It(O.uponSanitizeShadowNode, a, null), Ht(a, n), Jt(a, n), Pt(a.content) && K(a.content));
	}, Tt = function(e) {
		Ue && pi(Ue, e);
	}, Et = function(e, t) {
		return F ? e === "patchsrc" || e === "for" && t !== "label" && t !== "output" : !1;
	}, Dt = function(e) {
		F && vt(e, (e) => {
			let t = C(e);
			if (t === $.processingInstruction || t === $.comment && X(ra, e.data)) {
				try {
					p(e);
				} catch {}
				return !1;
			}
			if (t === $.element) {
				let t = e, n = W(ee(e));
				try {
					t.hasAttribute && t.hasAttribute("patchsrc") && t.removeAttribute("patchsrc"), t.hasAttribute && t.hasAttribute("for") && Et("for", n) && t.removeAttribute("for");
				} catch {}
			}
			return !0;
		});
	}, Ot = function(e) {
		let t = null, r = null;
		if (Pe) e = "<remove></remove>" + e;
		else {
			let t = _i(e, /^[\r\n\t ]+/);
			r = t && t[0];
		}
		tt === "application/xhtml+xml" && Ye === Je && (e = "<html xmlns=\"http://www.w3.org/1999/xhtml\"><head></head><body>" + e + "</body></html>");
		let i = w ? oe(e) : e;
		if (Ye === Je) try {
			t = new l().parseFromString(i, tt);
		} catch {}
		if (!t || !t.documentElement) {
			t = le.createDocument(Ye, "template", null);
			try {
				t.documentElement.innerHTML = Xe ? T : i;
			} catch {}
		}
		let a = t.body || t.documentElement;
		return e && r && a.insertBefore(n.createTextNode(r), a.childNodes[0] || null), Ye === Je ? fe.call(t, Ae ? "html" : "body")[0] : Ae ? t.documentElement : a;
	}, kt = function(e) {
		let t = S ? S(e) : e.ownerDocument;
		return ue.call(t || e, e, c.SHOW_ELEMENT | c.SHOW_COMMENT | c.SHOW_TEXT | c.SHOW_PROCESSING_INSTRUCTION | c.SHOW_CDATA_SECTION, null);
	}, At = function(e) {
		return e = vi(e, me, " "), e = vi(e, he, " "), e = vi(e, ge, " "), e;
	}, jt = function(e) {
		Mt(e);
		let t = e.querySelectorAll?.call(e, "template");
		t && ai(t, (e) => {
			Pt(e.content) && jt(e.content);
		});
	}, Mt = function(e) {
		e.normalize();
		let t = S ? S(e) : e.ownerDocument, n = ue.call(t || e, e, c.SHOW_TEXT | c.SHOW_COMMENT | c.SHOW_CDATA_SECTION | c.SHOW_PROCESSING_INSTRUCTION, null), r = n.nextNode();
		for (; r;) r.data = At(r.data), r = n.nextNode();
	}, Nt = function(e) {
		let t = x ? x(e) : null;
		return typeof t != "string" || W(t) !== "form" ? !1 : typeof e.nodeName != "string" || typeof e.textContent != "string" || typeof e.removeChild != "function" || e.attributes !== y(e) || typeof e.removeAttribute != "function" || typeof e.removeAttributeNode != "function" || typeof e.getAttributeNode != "function" || typeof e.setAttribute != "function" || typeof e.namespaceURI != "string" || typeof e.insertBefore != "function" || typeof e.hasChildNodes != "function" || e.nodeType !== b(e) || e.childNodes !== g(e);
	}, Pt = function(e) {
		if (!b || typeof e != "object" || !e) return !1;
		try {
			return b(e) === $.documentFragment;
		} catch {
			return !1;
		}
	}, Ft = function(e) {
		if (!b || typeof e != "object" || !e) return !1;
		try {
			return typeof b(e) == "number";
		} catch {
			return !1;
		}
	};
	function It(e, n, r) {
		e.length !== 0 && ai(e, (e) => {
			e.call(t, n, r, rt);
		});
	}
	let Lt = function(e, t) {
		return !!(F && e.hasChildNodes() && !Ft(e.firstElementChild) && X(na, e.textContent) && X(na, e.innerHTML) || F && oa[t] && C(e) === $.element && ne(e) === Je && (Ft(e.firstElementChild) || typeof e.textContent == "string" && X(na, e.textContent)) || e.nodeType === $.processingInstruction || F && e.nodeType === $.comment && X(ra, e.data));
	}, Rt = function(e, t) {
		return e instanceof RegExp ? X(e, t) : e instanceof Function && !!e(t, ...[...arguments].slice(2));
	}, zt = function(e, t, n) {
		if (!we[t] && Gt(t) && Rt(Ce.tagNameCheck, t)) return !1;
		if (Ve && !Ge[t] && !Ge[hi(t)]) {
			let t = _(e), r = g(e);
			if (r && t) {
				let i = r.length;
				for (let a = i - 1; a >= 0; --a) {
					let i = e === n ? f(r[a], !0) : r[a];
					t.insertBefore(i, h(e));
				}
			}
		}
		return pt(e), !0;
	}, Bt = function(e, t, n, r) {
		return e.length === 0 ? t : t === n || t === r ? Ai(t) : t;
	}, Vt = function(e, t) {
		return e === t || _(e) !== null ? !1 : (He && yt(e), !0);
	}, Ht = function(e, n) {
		if (Tt(e), It(O.beforeSanitizeElements, e, null), Vt(e, n)) return !0;
		if (Nt(e)) return pt(e), !0;
		let r = W(ee(e));
		if (A = Bt(O.uponSanitizeElement, A, j, Me), It(O.uponSanitizeElement, e, {
			tagName: r,
			allowedTags: A
		}), Vt(e, n)) return !0;
		if (Lt(e, r)) return pt(e), !0;
		if (we[r] || !(Ee.tagCheck instanceof Function && Ee.tagCheck(r)) && !A[r]) {
			let t = zt(e, r, n);
			return t === !1 && (It(O.afterSanitizeElements, e, null), Vt(e, n)) ? !0 : t;
		}
		if (C(e) === $.element && !ft(e) || (r === "noscript" || r === "noembed" || r === "noframes") && X(ia, e.innerHTML)) return pt(e), !0;
		if (ke && e.nodeType === $.text) {
			let n = At(e.textContent);
			e.textContent !== n && (ci(t.removed, { element: e.cloneNode() }), e.textContent = n);
		}
		return It(O.afterSanitizeElements, e, null), Vt(e, n);
	}, Ut = function(e, t, r) {
		if (Te[t] || Et(t, e) || Re && (t === "id" || t === "name") && (r in n || r in it)) return !1;
		let i = M[t] || Ee.attributeCheck instanceof Function && Ee.attributeCheck(t, e);
		return N && X(_e, t) || De && X(ve, t) ? !0 : i ? qe[t] || X(xe, vi(r, ye, "")) || (t === "src" || t === "xlink:href" || t === "href") && e !== "script" && yi(r, "data:") === 0 && Ke[e] || Oe && !X(k, vi(r, ye, "")) ? !0 : !r : Gt(e) && Rt(Ce.tagNameCheck, e) && Rt(Ce.attributeNameCheck, t, e) || t === "is" && Ce.allowCustomizedBuiltInElements && Rt(Ce.tagNameCheck, r);
	}, Wt = Q({}, [
		"annotation-xml",
		"color-profile",
		"font-face",
		"font-face-format",
		"font-face-name",
		"font-face-src",
		"font-face-uri",
		"missing-glyph"
	]), Gt = function(e) {
		return !Wt[hi(e)] && X(be, e);
	}, Kt = function(e, t, n, r) {
		if (w && typeof u == "object" && typeof u.getAttributeType == "function" && !n) switch (u.getAttributeType(e, t)) {
			case "TrustedHTML": return oe(r);
			case "TrustedScriptURL": return se(r);
		}
		return r;
	}, qt = function(e, t, n, r) {
		try {
			return n ? e.setAttributeNS(n, t, r) : e.setAttribute(t, r), !Nt(e) || (pt(e), !1);
		} catch {
			return gt(t, e), !1;
		}
	}, G = function(e, t) {
		return F && X(/((--!?|])>)|<\/(style|script|title|xmp|textarea|noscript|iframe|noembed|noframes)/i, t) ? !0 : hi(e) === "attributename" && _i(t, "href") !== null;
	}, Jt = function(e, n) {
		if (It(O.beforeSanitizeAttributes, e, null), Vt(e, n)) return;
		let r = e.attributes;
		if (!r || Nt(e)) return;
		M = Bt(O.uponSanitizeAttribute, M, Se, Ne);
		let i = {
			attrName: "",
			attrValue: "",
			keepAttr: !0,
			allowedAttributes: M,
			forceKeepAttr: void 0
		}, a = r.length, o = W(e.nodeName);
		for (; a--;) {
			let n = r[a], s = n.name, c = n.namespaceURI, l = n.value, u = W(s), d = l, f = s === "value" ? d : bi(d), p = !1;
			i.attrName = u, i.attrValue = f, i.keepAttr = !0, i.forceKeepAttr = void 0, It(O.uponSanitizeAttribute, e, i), f = i.attrValue, ze && (u === "id" || u === "name") && yi(f, Be) !== 0 && (gt(s, e, n), f = Be + f, p = !0), G(s, f) ? gt(s, e, n) : i.forceKeepAttr || (i.keepAttr ? !P && X(aa, f) ? gt(s, e, n) : (ke && (f = At(f)), Ut(o, u, f) ? (f = Kt(o, u, c, f), f !== d && qt(e, s, c, f) && p && si(t.removed)) : gt(s, e, n)) : gt(s, e, n));
		}
		It(O.afterSanitizeAttributes, e, null), Vt(e, n);
	}, K = function(e) {
		let t = null, n = kt(e);
		for (It(O.beforeSanitizeShadowDOM, e, null); t = n.nextNode();) if (It(O.uponSanitizeShadowNode, t, null), Ht(t, e), Jt(t, e), Pt(t.content) && K(t.content), C(t) === $.element) {
			let e = v(t);
			Pt(e) && (Yt(e), K(e));
		}
		ke && Mt(e), It(O.afterSanitizeShadowDOM, e, null);
	}, Yt = function(e) {
		let t = [{
			node: e,
			shadow: null
		}];
		for (; t.length > 0;) {
			let e = t.pop();
			if (e.shadow) {
				K(e.shadow);
				continue;
			}
			let n = e.node, r = C(n) === $.element, i = g(n);
			if (i) for (let e = i.length - 1; e >= 0; --e) t.push({
				node: i[e],
				shadow: null
			});
			if (r) {
				let e = x ? x(n) : null;
				if (typeof e == "string" && W(e) === "template") {
					let e = n.content;
					Pt(e) && t.push({
						node: e,
						shadow: null
					});
				}
			}
			if (r) {
				let e = v(n);
				Pt(e) && t.push({
					node: null,
					shadow: e
				}, {
					node: e,
					shadow: null
				});
			}
		}
	};
	return t.sanitize = function(e) {
		let n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, i = null, a = null, o = null, s = null;
		if (Xe = !e, Xe && (e = "<!-->"), typeof e != "string" && !Ft(e) && (e = ji(e), typeof e != "string")) throw Di("dirty is not a string, aborting");
		if (!t.isSupported) return e;
		je ? (A = Me, M = Ne) : ot(n), (O.uponSanitizeElement.length > 0 || O.uponSanitizeAttribute.length > 0) && (A = Ai(A)), O.uponSanitizeAttribute.length > 0 && (M = Ai(M)), t.removed = [];
		let c = He && typeof e != "string" && Ft(e), l = [], u = Ue;
		if (c) {
			Dt(e);
			let t = ee(e);
			if (typeof t == "string") {
				let n = W(t);
				if (!A[n] || we[n]) throw ht(e), Di("root node is forbidden and cannot be sanitized in-place");
			}
			if (Nt(e)) throw ht(e), Di("root node is clobbered and cannot be sanitized in-place");
			l = bt(e), Ue = fi();
		} else if (Ft(e)) i = Ot("<!---->"), a = i.ownerDocument.importNode(e, !0), a.nodeType === $.element && a.nodeName === "BODY" || a.nodeName === "HTML" ? i = a : i.appendChild(a), Yt(i);
		else {
			if (!Fe && !ke && !Ae && e.indexOf("<") === -1) return w && Le ? oe(e) : e;
			if (i = Ot(e), !i) return Fe ? null : Le ? T : "";
		}
		i && Pe && pt(i.firstChild);
		let d = c ? e : i;
		try {
			c && Yt(e);
			let t = kt(d);
			for (; o = t.nextNode();) Ht(o, d), Jt(o, d), Pt(o.content) && K(o.content);
			c && Ct(e, l);
		} catch (t) {
			throw c && (ht(e), St(e, l)), t;
		} finally {
			Ue = u;
		}
		if (c) {
			if (St(e, l)) throw Di("a node selected for removal could not be safely returned; refusing to sanitize in place");
			return ke && jt(e), e;
		}
		if (Fe) {
			if (ke && jt(i), Ie) for (s = de.call(i.ownerDocument); i.firstChild;) s.appendChild(i.firstChild);
			else s = i;
			return (M.shadowroot || M.shadowrootmode) && (s = pe.call(r, s, !0)), s;
		}
		let f = Ae ? i.outerHTML : i.innerHTML;
		return Ae && A["!doctype"] && i.ownerDocument && i.ownerDocument.doctype && i.ownerDocument.doctype.name && X(ea, i.ownerDocument.doctype.name) && (f = "<!DOCTYPE " + i.ownerDocument.doctype.name + ">\n" + f), ke && (f = At(f)), w && Le ? oe(f) : f;
	}, t.setConfig = function() {
		let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
		ot(e), je = !0, Me = A, Ne = M;
	}, t.clearConfig = function() {
		rt = null, je = !1, Me = null, Ne = null, w = E, T = "";
	}, t.isValidAttribute = function(e, t, n) {
		rt || ot({});
		let r = W(e), i = W(t);
		return typeof n == "string" && (G(t, n) || !P && X(aa, n)) ? !1 : Ut(r, i, n);
	}, t.addHook = function(e, t) {
		typeof t == "function" && Ti(O, e) && ci(O[e], t);
	}, t.removeHook = function(e, t) {
		if (Ti(O, e)) {
			if (t !== void 0) {
				let n = oi(O[e], t);
				return n === -1 ? void 0 : ui(O[e], n, 1)[0];
			}
			return si(O[e]);
		}
	}, t.removeHooks = function(e) {
		Ti(O, e) && (O[e] = []);
	}, t.removeAllHooks = function() {
		O = la();
	}, t;
}
var pa = fa(), ma = new zr({
	gfm: !0,
	breaks: !0
}), ha = pa();
ha.addHook("afterSanitizeAttributes", (e) => {
	e.tagName === "A" && (e.setAttribute("target", "_blank"), e.setAttribute("rel", "noopener noreferrer"));
});
var ga = {
	USE_PROFILES: { html: !0 },
	FORBID_TAGS: [
		"style",
		"script",
		"iframe",
		"frame",
		"object",
		"embed",
		"form",
		"input",
		"button",
		"select",
		"textarea",
		"option",
		"link",
		"meta",
		"base"
	],
	FORBID_ATTR: ["style"]
};
function _a(e, t, n) {
	let r = t ? Object.assign([...t], { links: n ?? {} }) : ma.lexer(e);
	return ha.sanitize(ma.parser(r), ga);
}
var va = (e) => e.type === "code" && /^html\b/i.test((e.lang ?? "").trim());
function ya(e) {
	let t = ma.lexer(e), n = [], r = [], i = () => {
		r.length && n.push({ html: _a("", r, t.links) }), r = [];
	};
	for (let e of t) va(e) ? (i(), n.push({ page: e.text })) : r.push(e);
	return i(), n;
}
async function ba(e) {
	try {
		await navigator.clipboard.writeText(e);
		return;
	} catch {}
	let t = document.createElement("textarea");
	t.value = e, t.style.position = "fixed", t.style.opacity = "0", document.body.appendChild(t), t.select(), document.execCommand("copy"), t.remove();
}
var xa = /^(https?:|mailto:)/i;
function Sa({ html: e }) {
	let t = R(), { t: n } = I(), r = F(null);
	return ke(() => {
		let e = r.current;
		e && e.querySelectorAll("pre").forEach((e) => {
			if (e.parentElement?.classList.contains("md-code")) return;
			let t = document.createElement("div");
			t.className = "md-code";
			let r = document.createElement("div");
			r.className = "md-code-bar";
			let i = /language-(\S+)/.exec(e.querySelector("code")?.className ?? "")?.[1] ?? "", a = document.createElement("span");
			a.textContent = i;
			let o = document.createElement("button");
			o.type = "button", o.className = "md-copy", o.dataset.copy = "", o.textContent = n("md.copy"), r.append(a, o), e.replaceWith(t), t.append(r, e);
		});
	}, [e]), /* @__PURE__ */ L("div", {
		ref: r,
		class: "md",
		onClick: (e) => {
			let r = e.target, i = r.closest?.("[data-copy]");
			if (i) {
				ba(i.closest(".md-code")?.querySelector("pre")?.textContent ?? ""), i.textContent = n("md.copied"), setTimeout(() => {
					i.textContent = n("md.copy");
				}, 2e3);
				return;
			}
			let a = r.closest?.("a");
			if (!a) return;
			e.preventDefault();
			let o = a.getAttribute("href") ?? "";
			xa.test(o) && t.bridge.openLink(o);
		},
		dangerouslySetInnerHTML: { __html: e }
	});
}
function Ca({ code: e, lang: t }) {
	let { t: n } = I(), [r, i] = N(!1);
	return /* @__PURE__ */ L("div", {
		class: "md md-code",
		children: [/* @__PURE__ */ L("div", {
			class: "md-code-bar",
			children: [/* @__PURE__ */ L("span", { children: t }), /* @__PURE__ */ L("button", {
				type: "button",
				class: "md-copy",
				onClick: () => {
					ba(e), i(!0), setTimeout(() => i(!1), 2e3);
				},
				children: n(r ? "md.copied" : "md.copy")
			})]
		}), /* @__PURE__ */ L("pre", { children: /* @__PURE__ */ L("code", { children: e }) })]
	});
}
var wa = 0;
function Ta({ html: e }) {
	let t = R(), { t: n } = I(), r;
	try {
		r = t.bridge.frameUrl?.();
	} catch {
		r = void 0;
	}
	let [i, a] = N("preview"), o = Ae(() => `p${++wa}-${Math.random().toString(36).slice(2, 8)}`, []), s = F(null), [c, l] = N(120), u = F(!1), d = () => {
		let t = s.current?.contentWindow;
		t && !u.current && (u.current = !0, t.postMessage({
			bw: "html",
			id: o,
			html: e
		}, "*"));
	};
	if (ke(() => {
		if (!r) return;
		u.current = !1;
		let e = (e) => {
			let t = s.current, n = e.data;
			t && e.source === t.contentWindow && n && n.bw === "frame" && (n.ready && n.id == null ? d() : n.id === o && typeof n.height == "number" && l(Math.max(24, Math.min(n.height, 2e4))));
		};
		return window.addEventListener("message", e), () => window.removeEventListener("message", e);
	}, [
		r,
		o,
		e
	]), !r) return /* @__PURE__ */ L(Ca, {
		code: e,
		lang: "html"
	});
	let f = /<title[^>]*>([^<]*)<\/title>/i.exec(e)?.[1]?.trim() || void 0;
	return /* @__PURE__ */ L("div", {
		class: "md-page",
		children: [
			/* @__PURE__ */ L("div", {
				class: "md-page-bar",
				children: [/* @__PURE__ */ L("div", {
					class: "seg",
					role: "group",
					children: [/* @__PURE__ */ L("button", {
						type: "button",
						"aria-pressed": i === "preview",
						onClick: () => a("preview"),
						children: n("md.preview")
					}), /* @__PURE__ */ L("button", {
						type: "button",
						"aria-pressed": i === "code",
						onClick: () => a("code"),
						children: n("md.code")
					})]
				}), t.bridge.openPreview && /* @__PURE__ */ L("button", {
					type: "button",
					class: "link",
					onClick: () => void t.bridge.openPreview(e, f),
					children: n("md.openTab")
				})]
			}),
			/* @__PURE__ */ L("div", {
				class: "md-page-view",
				hidden: i !== "preview",
				style: { maxHeight: "600px" },
				children: /* @__PURE__ */ L("iframe", {
					ref: s,
					src: r,
					title: f ?? n("md.preview"),
					style: { height: `${c}px` },
					onLoad: d
				})
			}),
			i === "code" && /* @__PURE__ */ L(Ca, {
				code: e,
				lang: "html"
			})
		]
	});
}
function Ea({ text: e }) {
	return /* @__PURE__ */ L(C, { children: Ae(() => ya(e ?? ""), [e]).map((e, t) => "page" in e ? /* @__PURE__ */ L(Ta, { html: e.page }, `p${t}`) : /* @__PURE__ */ L(Sa, { html: e.html }, `h${t}`)) });
}
// ui/views/chat.tsx
var Da = (e) => e.surface === "panel" && typeof e.chatState == "function" ? e : void 0, Oa = { view: "chat" }, ka = (e) => e?.view === "chat", Aa = {
	openedAt: 0,
	local: [],
	subs: /* @__PURE__ */ new Set()
}, ja = () => Aa.subs.forEach((e) => e());
function Ma(e, t) {
	return `claude://${e === "chat" ? "claude.ai" : "code"}/new?q=${encodeURIComponent(t)}`;
}
function Na(e) {
	let t = document.createElement("a");
	t.href = e, t.rel = "noopener", document.body.appendChild(t), t.click(), t.remove();
}
function Pa(e) {
	let { t } = I(), n = Da(e.bridge), [r, i] = N({}), [, a] = N(0);
	P(() => {
		let e = () => a((e) => e + 1);
		return Aa.subs.add(e), () => {
			Aa.subs.delete(e);
		};
	}, []);
	let o = async () => {
		if (!n) return;
		let [e, t] = await Promise.all([n.chatState().catch(() => void 0), n.chatLog().catch(() => void 0)]);
		i({
			state: e,
			entries: t
		});
	};
	P(() => {
		if (!n) return;
		let e = !1;
		(async () => {
			let [t, r] = await Promise.all([n.chatState().catch(() => void 0), n.chatLog().catch(() => void 0)]);
			e || i({
				state: t,
				entries: r
			});
		})();
		let t = n.onEvent("chat.update", (e) => {
			e && typeof e == "object" && i((t) => ({
				state: e.state ?? t.state,
				entries: Array.isArray(e.entries) ? e.entries : t.entries
			}));
		});
		return () => {
			e = !0, t();
		};
	}, [n]);
	let s = r.state === "listening" || r.state === "working" || r.state === "connected";
	s && Aa.openedAt && (Aa.openedAt = 0);
	let c = !!Aa.openedAt, [l, u] = N(Date.now());
	P(() => {
		if (!c) return;
		let e = setInterval(() => {
			u(Date.now()), o();
		}, 2e3);
		return () => clearInterval(e);
	}, [c, n]);
	let d = r.state !== void 0;
	return {
		bridge: n,
		state: c ? "opening" : r.state ?? "none",
		known: d,
		entries: r.entries ?? Aa.local,
		nothingOpened: c && l - Aa.openedAt >= 1e4,
		canSend: s || !d,
		open(e) {
			Aa.openedAt = Date.now(), u(Aa.openedAt), Na(Ma(e, t("chat.prompt"))), ja();
		},
		copy: () => ba(t("chat.prompt")),
		async send(e, r) {
			if (!n) return;
			let i = await n.chatSend(e, r);
			i.fallback ? (Aa.local = [...Aa.local, {
				at: Date.now(),
				from: "you",
				text: e,
				mentions: r
			}], i.delivered || Aa.local.push({
				at: Date.now(),
				from: "event",
				text: t("chat.notDelivered"),
				warn: !0
			}), ja()) : await o();
		}
	};
}
function Fa({ kind: e, pulse: t }) {
	return /* @__PURE__ */ L("span", { class: `dot${e ? ` ${e}` : ""}${t ? " pulse" : ""}` });
}
function Ia({ chat: e, button: t }) {
	let { t: n } = I(), [r, i] = N(!1), a = n(r ? "chat.copied" : "chat.copyPrompt"), o = async () => {
		await e.copy(), i(!0), setTimeout(() => i(!1), 2e3);
	};
	return t ? /* @__PURE__ */ L("button", {
		class: "btn sm",
		onClick: o,
		children: a
	}) : /* @__PURE__ */ L("button", {
		class: "link",
		onClick: o,
		children: a
	});
}
var La = () => B.sparkle();
function Ra({ nav: e }) {
	let { t } = I(), n = Pa(e);
	if (!n.bridge) return null;
	let r = () => e.push(Oa), i = n.state;
	if (i === "listening" || i === "working" || i === "connected") {
		let e = t(i === "listening" ? "chat.liveListening" : i === "working" ? "chat.liveWorking" : "chat.liveConnected");
		return /* @__PURE__ */ L("div", {
			class: "strip live",
			role: "status",
			children: [
				/* @__PURE__ */ L(Fa, {
					kind: i === "working" ? "run" : "ok",
					pulse: i === "working"
				}),
				/* @__PURE__ */ L("span", {
					class: "strip-sub",
					children: e
				}),
				/* @__PURE__ */ L("button", {
					class: "btn sm primary",
					onClick: r,
					children: t("chat.chat")
				})
			]
		});
	}
	return i === "opening" ? /* @__PURE__ */ L("div", {
		class: "strip",
		role: "status",
		children: [
			/* @__PURE__ */ L("div", {
				class: "strip-top",
				children: [/* @__PURE__ */ L(Fa, {
					kind: "run",
					pulse: !0
				}), /* @__PURE__ */ L("span", {
					class: "strip-title",
					children: t("chat.waitingTitle")
				})]
			}),
			/* @__PURE__ */ L("ol", {
				class: "steps-ol",
				children: [
					/* @__PURE__ */ L("li", { children: t("chat.step1") }),
					/* @__PURE__ */ L("li", { children: [
						t("chat.step2a"),
						/* @__PURE__ */ L("b", { children: t("chat.step2b") }),
						t("chat.step2c")
					] }),
					/* @__PURE__ */ L("li", { children: t("chat.step3") })
				]
			}),
			/* @__PURE__ */ L("div", {
				class: "strip-sub",
				children: t("chat.warnNote")
			}),
			n.nothingOpened && /* @__PURE__ */ L("div", {
				class: "strip-sub strong",
				children: t("chat.nothingOpened")
			}),
			/* @__PURE__ */ L("div", {
				class: "strip-links",
				children: [/* @__PURE__ */ L("button", {
					class: "link",
					onClick: () => n.open("chat"),
					children: t("chat.openAgain")
				}), /* @__PURE__ */ L(Ia, { chat: n })]
			})
		]
	}) : /* @__PURE__ */ L("div", {
		class: "strip",
		children: [
			/* @__PURE__ */ L("div", {
				class: "strip-top",
				children: [/* @__PURE__ */ L(Fa, {}), /* @__PURE__ */ L("span", {
					class: "strip-title",
					children: t(i === "idle" ? "chat.idleTitle" : "chat.noneTitle")
				})]
			}),
			/* @__PURE__ */ L("div", {
				class: "strip-sub",
				children: t("chat.noneSub")
			}),
			/* @__PURE__ */ L("button", {
				class: "btn primary block",
				onClick: () => n.open("chat"),
				children: [La(), t("chat.use")]
			}),
			/* @__PURE__ */ L("div", {
				class: "strip-links",
				children: [
					/* @__PURE__ */ L("button", {
						class: "link",
						onClick: () => n.open("code"),
						children: t("chat.useCode")
					}),
					/* @__PURE__ */ L(Ia, { chat: n }),
					(i === "idle" || !n.known || n.entries.length > 0) && /* @__PURE__ */ L("button", {
						class: "link",
						onClick: r,
						children: t("chat.openChat")
					})
				]
			})
		]
	});
}
var za = "M8 2.5a5.5 5.5 0 1 1 0 11a5.5 5.5 0 1 1 0-11z";
function Ba(e) {
	return e.type === "workflow" ? ["M3 3h4v4H3zM9 9h4v4H9zM7 5h3.5a1.5 1.5 0 0 1 1.5 1.5V9"] : e.type === "tab" ? ["M3.5 3h9A1.5 1.5 0 0 1 14 4.5v7a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 11.5v-7A1.5 1.5 0 0 1 3.5 3zM2 6h12"] : e.status === "failure" ? [za, "M8 5v3.5M8 10.8v.1"] : [za, "M6.8 5.8 10 8l-3.2 2.2z"];
}
function Va({ m: e }) {
	return /* @__PURE__ */ L("svg", {
		width: "14",
		height: "14",
		viewBox: "0 0 16 16",
		fill: "none",
		stroke: "currentColor",
		"stroke-width": "1.6",
		"stroke-linecap": "round",
		"stroke-linejoin": "round",
		"aria-hidden": "true",
		class: e.type === "run" && e.status === "failure" ? "is-bad" : void 0,
		children: Ba(e).map((e) => /* @__PURE__ */ L("path", { d: e }))
	});
}
function Ha(e) {
	let t = "http://www.w3.org/2000/svg", n = document.createElementNS(t, "svg");
	for (let [e, t] of Object.entries({
		width: "12",
		height: "12",
		viewBox: "0 0 16 16",
		fill: "none",
		stroke: "currentColor",
		"stroke-width": "1.6",
		"stroke-linecap": "round",
		"stroke-linejoin": "round",
		"aria-hidden": "true"
	})) n.setAttribute(e, t);
	for (let r of Ba(e)) {
		let e = document.createElementNS(t, "path");
		e.setAttribute("d", r), n.appendChild(e);
	}
	return n;
}
function Ua({ m: e }) {
	return /* @__PURE__ */ L("span", {
		class: "mchip",
		title: e.url ?? e.name,
		children: [/* @__PURE__ */ L(Va, { m: e }), e.name]
	});
}
function Wa(e, t = []) {
	let n = [], r = /* @__PURE__ */ new Set(), i = 0, a = "";
	for (let o = 0; o < e.length;) {
		let s = -1;
		e[o] === "＠" && (s = i < t.length && e.startsWith("＠" + t[i].name, o) ? i : t.findIndex((t, n) => !r.has(n) && e.startsWith("＠" + t.name, o))), s >= 0 ? (a && n.push(a), a = "", n.push(/* @__PURE__ */ L(Ua, { m: t[s] })), r.add(s), s === i && (i += 1), o += 1 + t[s].name.length) : (a += e[o], o += 1);
	}
	return a && n.push(a), t.forEach((e, t) => {
		r.has(t) || n.push(" ", /* @__PURE__ */ L(Ua, { m: e }));
	}), n;
}
var Ga = (e) => e && [
	"running",
	"waiting_manual",
	"success",
	"failure",
	"stopped"
].includes(e) ? `status.${e}` : void 0;
function Ka(e, t) {
	if (e.type === "tab") return e.url?.replace(/^https?:\/\//, "");
	if (e.type === "run") {
		let n = Ga(e.status);
		return n ? t(n) : e.status;
	}
}
var qa = 5;
function Ja(e, t) {
	let n = t.toLowerCase(), r = (e = []) => e.filter((e) => !n || `${e.name} ${e.url ?? ""}`.toLowerCase().includes(n)).slice(0, qa);
	return {
		workflows: r(e?.workflows),
		runs: r(e?.runs),
		tabs: r(e?.tabs)
	};
}
function Ya(e) {
	let t = getSelection();
	if (!e || !t || !t.rangeCount || !t.isCollapsed) return null;
	let n = t.anchorNode;
	if (!n || n.nodeType !== Node.TEXT_NODE || !e.contains(n)) return null;
	let r = (n.textContent ?? "").slice(0, t.anchorOffset), i = /(?:^|[\s ])@([^\s @]{0,40})$/.exec(r);
	return i ? {
		node: n,
		start: t.anchorOffset - i[1].length - 1,
		end: t.anchorOffset,
		query: i[1]
	} : null;
}
function Xa({ enabled: e, chat: t }) {
	let { t: n } = I(), r = F(null), i = F(/* @__PURE__ */ new Map()), a = F(0), [o, s] = N(!0), [c, l] = N(!1), [u, d] = N(null), f = F(null), p = F(0), m = Ae(() => Ja(u?.cands, u?.query ?? ""), [u]), h = [
		...m.workflows,
		...m.runs,
		...m.tabs
	], g = () => {
		let e = "", t = [], n = (r) => {
			r.childNodes.forEach((r) => {
				if (r.nodeType === Node.TEXT_NODE) {
					e += r.textContent ?? "";
					return;
				}
				if (!(r instanceof HTMLElement)) return;
				let a = r.dataset.k;
				if (a) {
					let n = i.current.get(a);
					n && (e += `＠${n.name}`, t.push(n));
				} else r.tagName === "BR" ? e += "\n" : (r.tagName === "DIV" && e && !e.endsWith("\n") && (e += "\n"), n(r));
			});
		};
		return r.current && n(r.current), {
			text: e.replace(/ /g, " ").replace(/[ \t]+\n/g, "\n").trim(),
			mentions: t
		};
	}, _ = (e) => {
		let n = ++p.current;
		d((t) => ({
			query: e,
			cands: t?.cands,
			on: 0
		})), t.bridge?.mentions(e).catch(() => void 0).then((e) => {
			n === p.current && d((t) => t && {
				...t,
				cands: e ?? t.cands ?? {
					workflows: [],
					runs: [],
					tabs: []
				}
			});
		});
	}, v = () => {
		s(!g().text && !r.current?.querySelector("[data-k]"));
		let e = Ya(r.current), t = f.current;
		e || (f.current = null), e && !(t && t.node === e.node && t.start === e.start) ? _(e.query) : d(null);
	}, y = (e) => {
		let t = r.current;
		if (!t) return;
		let n = String(++a.current);
		i.current.set(n, e);
		let o = document.createElement("span");
		o.className = "mchip", o.contentEditable = "false", o.dataset.k = n, o.title = e.url ?? e.name, o.append(Ha(e), document.createTextNode(e.name));
		let c = document.createTextNode("\xA0"), l = Ya(t);
		if (l) {
			let e = l.node.splitText(l.start);
			e.textContent = (e.textContent ?? "").slice(l.end - l.start), e.before(o, c);
		} else t.append(o, c);
		let u = getSelection(), f = document.createRange();
		f.setStart(c, 1), f.collapse(!0), u?.removeAllRanges(), u?.addRange(f), d(null), s(!1), t.focus();
	}, b = () => {
		let t = r.current;
		if (!t || !e) return;
		t.focus();
		let n = getSelection();
		if (!n || !n.rangeCount || !t.contains(n.anchorNode)) {
			let e = document.createRange();
			e.selectNodeContents(t), e.collapse(!1), n?.removeAllRanges(), n?.addRange(e);
		}
		let i = getSelection()?.anchorNode, a = i?.nodeType === Node.TEXT_NODE ? (i.textContent ?? "").slice(0, getSelection().anchorOffset) : "";
		f.current = null, document.execCommand("insertText", !1, a && !/[\s ]$/.test(a) ? " @" : "@");
	}, x = async () => {
		let { text: n, mentions: a } = g();
		if (n && e && !c) {
			l(!0);
			try {
				await t.send(n, a), r.current && (r.current.textContent = ""), i.current.clear(), s(!0), d(null);
			} finally {
				l(!1);
			}
		}
	}, S = (e) => {
		if (!e.isComposing) {
			if (u) {
				if (e.key === "ArrowDown" || e.key === "ArrowUp") {
					e.preventDefault(), h.length && d({
						...u,
						on: (u.on + (e.key === "ArrowDown" ? 1 : h.length - 1)) % h.length
					});
					return;
				}
				if ((e.key === "Enter" || e.key === "Tab") && h.length) {
					e.preventDefault(), y(h[Math.min(u.on, h.length - 1)]);
					return;
				}
				if (e.key === "Escape") {
					e.preventDefault();
					let t = Ya(r.current);
					f.current = t ? {
						node: t.node,
						start: t.start
					} : null, d(null);
					return;
				}
			}
			e.key === "Enter" && !e.shiftKey ? (e.preventDefault(), x()) : e.key === "Enter" && (e.preventDefault(), document.execCommand("insertLineBreak"));
		}
	}, ee = (e) => {
		e.preventDefault(), document.execCommand("insertText", !1, e.clipboardData?.getData("text/plain") ?? "");
	}, te = (e, t, r) => t.length > 0 && /* @__PURE__ */ L(C, { children: [/* @__PURE__ */ L("div", {
		class: "pick-h",
		children: n(e)
	}), t.map((e, t) => /* @__PURE__ */ L("button", {
		class: `pick${u && u.on === r + t ? " on" : ""}`,
		role: "option",
		"aria-selected": u?.on === r + t,
		onMouseDown: (t) => {
			t.preventDefault(), y(e);
		},
		children: [/* @__PURE__ */ L(Va, { m: e }), /* @__PURE__ */ L("div", {
			class: "row-main",
			children: [/* @__PURE__ */ L("div", {
				class: "row-title",
				children: e.name
			}), Ka(e, n) && /* @__PURE__ */ L("div", {
				class: "row-sub",
				children: Ka(e, n)
			})]
		})]
	}))] });
	return /* @__PURE__ */ L("div", {
		class: "composer-wrap",
		children: [
			u && e && /* @__PURE__ */ L("div", {
				class: "picker",
				role: "listbox",
				"aria-label": n("chat.mention"),
				children: [
					te("chat.pickWorkflows", m.workflows, 0),
					te("chat.pickRuns", m.runs, m.workflows.length),
					te("chat.pickTabs", m.tabs, m.workflows.length + m.runs.length),
					!h.length && u.cands && /* @__PURE__ */ L("div", {
						class: "pick-none",
						children: n("chat.pickNone")
					})
				]
			}),
			/* @__PURE__ */ L("div", {
				class: "composer",
				children: [/* @__PURE__ */ L("div", {
					ref: r,
					class: `ced${o ? " is-empty" : ""}${e ? "" : " is-off"}`,
					contentEditable: e,
					role: "textbox",
					"aria-multiline": "true",
					"aria-disabled": !e,
					"aria-label": n(e ? "chat.ph" : "chat.phOff"),
					"data-ph": n(e ? "chat.ph" : "chat.phOff"),
					onInput: v,
					onKeyDown: S,
					onPaste: ee,
					onBlur: () => setTimeout(() => d(null), 150)
				}), /* @__PURE__ */ L("button", {
					class: "btn primary",
					disabled: !e || o || c,
					onClick: () => void x(),
					children: n("chat.send")
				})]
			}),
			/* @__PURE__ */ L("div", {
				class: "tools",
				children: /* @__PURE__ */ L("button", {
					class: `tool${u ? " on" : ""}`,
					disabled: !e,
					onMouseDown: (e) => e.preventDefault(),
					onClick: b,
					children: ["@ ", n("chat.mention")]
				})
			})
		]
	});
}
function Za(e, t) {
	let n = e.name ?? "";
	if (e.kind === "proposal") return e.state === "saved" ? {
		text: t("chat.cardSaved", { name: n }),
		dot: "ok"
	} : e.state === "applied" ? {
		text: t("chat.cardApplied", { name: n }),
		dot: "ok"
	} : e.state === "discarded" ? { text: t("chat.cardDiscarded", { name: n }) } : e.state === "expired" ? { text: t("chat.cardExpired", { name: n }) } : void 0;
	if (e.kind === "run") {
		if (e.status === "success") return {
			text: typeof e.items == "number" ? t("chat.cardRunOkItems", {
				name: n,
				n: e.items
			}) : t("chat.cardRunOk", { name: n }),
			dot: "ok"
		};
		if (e.status === "failure") return {
			text: t("chat.cardRunFailed", { name: n }),
			dot: "bad"
		};
		if (e.status === "stopped") return { text: t("chat.cardRunStopped", { name: n }) };
		let r = Ga(e.status);
		return { text: t("chat.cardRunOther", {
			name: n,
			status: r ? t(r) : e.status
		}) };
	}
}
function Qa({ e }) {
	let t = R(), { t: n } = I(), r = e.card;
	if (r.kind === "proposal" && r.pendingId && (!r.state || r.state === "pending")) return /* @__PURE__ */ L("div", {
		class: "card-mini",
		children: [
			/* @__PURE__ */ L("span", {
				class: "is-warn",
				children: B.alert()
			}),
			/* @__PURE__ */ L("div", {
				class: "row-main",
				children: [/* @__PURE__ */ L("div", {
					class: "row-title",
					children: n("chat.cardWaiting")
				}), /* @__PURE__ */ L("div", {
					class: "row-sub",
					children: r.name || e.text
				})]
			}),
			/* @__PURE__ */ L("button", {
				class: "btn sm primary",
				onClick: () => t.open("ui_proposal", { pendingId: r.pendingId }, "push"),
				children: n("panel.review")
			})
		]
	});
	let i = Za(r, n) ?? { text: e.text }, a = r.runId;
	return a ? /* @__PURE__ */ L("button", {
		class: "ev ev-link",
		onClick: () => t.open("show_run", { runId: a }, "push"),
		children: [/* @__PURE__ */ L(Fa, { kind: i.dot }), i.text]
	}) : /* @__PURE__ */ L("div", {
		class: "ev",
		children: [/* @__PURE__ */ L(Fa, { kind: i.dot }), i.text]
	});
}
var $a = (e) => /^(show|list)_/.test(e);
function eo({ v: e }) {
	let t = R(), { t: n } = I(), r = e.payload && "view" in e.payload ? e.payload : void 0;
	return !r && !$a(e.tool) ? null : /* @__PURE__ */ L("div", {
		class: "view-card",
		children: [/* @__PURE__ */ L(po, {
			bridge: t.bridge,
			initial: r,
			start: r ? void 0 : {
				tool: e.tool,
				args: e.args ?? {}
			}
		}), /* @__PURE__ */ L("div", {
			class: "view-card-foot",
			children: /* @__PURE__ */ L("button", {
				class: "link",
				onClick: () => r ? t.push(r) : t.open(e.tool, e.args ?? {}, "push"),
				children: n("chat.openView")
			})
		})]
	});
}
function to({ chat: e }) {
	let { t } = I(), n = F(null), r = e.entries, i = r.reduce((e, t, n) => t.from === "claude" ? n : e, -1), a = e.state === "working" ? r.findIndex((e, t) => t > i && e.from === "you") : -1, o = a < 0 ? -1 : r.reduce((e, t, n) => t.from === "you" ? n : e, -1), [s, c] = N(Date.now());
	P(() => {
		if (a < 0) return;
		let e = setInterval(() => c(Date.now()), 1e3);
		return () => clearInterval(e);
	}, [a]);
	let l = a >= 0 ? new Date(r[a].at).getTime() : 0;
	ke(() => {
		let e = n.current;
		e && (e.scrollTop = e.scrollHeight);
	}, [r.length, e.state]);
	let u = [];
	return r.forEach((e, n) => {
		e.from === "event" || e.card ? u.push(e.card ? /* @__PURE__ */ L(Qa, { e }) : /* @__PURE__ */ L("div", {
			class: `ev${e.warn ? " warn" : ""}`,
			children: [e.warn ? B.alert() : /* @__PURE__ */ L(Fa, {}), e.text]
		})) : e.view?.tool ? u.push(/* @__PURE__ */ L(eo, { v: e.view }, `view-${e.at}-${e.view.tool}-${JSON.stringify(e.view.args ?? {})}`)) : e.from === "you" ? u.push(/* @__PURE__ */ L("div", {
			class: "msg me",
			children: Wa(e.text, e.mentions)
		})) : u.push(/* @__PURE__ */ L("div", {
			class: "msg claude",
			children: /* @__PURE__ */ L(Ea, { text: e.text })
		})), n === a && u.push(/* @__PURE__ */ L("div", {
			class: "working",
			role: "status",
			children: [/* @__PURE__ */ L("span", {
				class: "typing",
				children: [
					/* @__PURE__ */ L("i", {}),
					/* @__PURE__ */ L("i", {}),
					/* @__PURE__ */ L("i", {})
				]
			}), t("chat.working", { s: Number.isFinite(l) ? Math.max(0, Math.round((s - l) / 1e3)) : 0 })]
		})), n === o && o > a && u.push(/* @__PURE__ */ L("div", {
			class: "ev",
			children: [/* @__PURE__ */ L(Fa, {}), t("chat.queued")]
		}));
	}), /* @__PURE__ */ L("div", {
		class: "log",
		ref: n,
		"aria-live": "polite",
		children: [
			r.length === 0 && /* @__PURE__ */ L("div", {
				class: "muted log-empty",
				children: t("chat.empty")
			}),
			u,
			e.known && !e.canSend && /* @__PURE__ */ L(no, { chat: e })
		]
	});
}
function no({ chat: e }) {
	let { t } = I(), n = e.state, r = t(n === "idle" ? "chat.stoppedTitle" : n === "opening" ? "chat.waitingTitle" : "chat.noneTitle"), i = n === "idle" ? t("chat.stoppedSub") : n === "opening" ? e.nothingOpened ? t("chat.nothingOpened") : `${t("chat.step2a")}${t("chat.step2b")}${t("chat.step2c")}` : t("chat.noneSub");
	return /* @__PURE__ */ L("div", {
		class: "banner",
		role: "status",
		children: [
			/* @__PURE__ */ L("div", {
				class: "banner-title",
				children: r
			}),
			/* @__PURE__ */ L("div", {
				class: "strip-sub",
				children: i
			}),
			/* @__PURE__ */ L("div", {
				class: "actions",
				children: [/* @__PURE__ */ L(Ia, {
					chat: e,
					button: !0
				}), /* @__PURE__ */ L("button", {
					class: "btn sm primary",
					onClick: () => e.open("chat"),
					children: t(n === "opening" ? "chat.openAgain" : "chat.use")
				})]
			})
		]
	});
}
function ro() {
	let e = R(), { t } = I(), n = Pa(e), r = F(null);
	if (ke(() => {
		let e = () => {
			let e = r.current;
			if (!e || !e.offsetParent) return;
			let t = e.getBoundingClientRect().top + window.scrollY;
			e.style.height = `${Math.max(320, window.innerHeight - t)}px`;
		};
		e();
		let t = new ResizeObserver(e);
		return r.current?.parentElement && t.observe(r.current.parentElement), window.addEventListener("resize", e), () => {
			t.disconnect(), window.removeEventListener("resize", e);
		};
	}, []), !n.bridge) return null;
	let i = n.state, a = i === "listening" ? /* @__PURE__ */ L("span", {
		class: "pill ok",
		children: [/* @__PURE__ */ L(Fa, { kind: "ok" }), t("chat.pillListening")]
	}) : i === "working" ? /* @__PURE__ */ L("span", {
		class: "pill run",
		children: [/* @__PURE__ */ L(Fa, {
			kind: "run",
			pulse: !0
		}), t("chat.pillWorking")]
	}) : i === "connected" ? /* @__PURE__ */ L("span", {
		class: "pill ok",
		children: [/* @__PURE__ */ L(Fa, { kind: "ok" }), t("chat.pillConnected")]
	}) : n.known ? /* @__PURE__ */ L("span", {
		class: "pill muted",
		children: [/* @__PURE__ */ L(Fa, {}), t("chat.pillOff")]
	}) : null;
	return /* @__PURE__ */ L("div", {
		class: "w chat",
		ref: r,
		children: [
			/* @__PURE__ */ L("div", {
				class: "hd",
				style: "align-items:center",
				children: [/* @__PURE__ */ L("div", {
					class: "hd-main",
					children: /* @__PURE__ */ L("h1", {
						class: "title",
						children: t("chat.title")
					})
				}), a]
			}),
			/* @__PURE__ */ L(to, { chat: n }),
			/* @__PURE__ */ L(Xa, {
				enabled: n.canSend,
				chat: n
			})
		]
	});
}
// ui/widget.tsx
function io({ arg: e, retry: t }) {
	let n = R(), { t: r } = I(), [i, a] = N(!1);
	return /* @__PURE__ */ L("div", {
		class: "w",
		children: [
			/* @__PURE__ */ L(H, {
				kind: "info",
				children: r(e === "workflows" ? "need.workflows" : "need.runs")
			}),
			/* @__PURE__ */ L("div", {
				class: "list",
				children: /* @__PURE__ */ L(zt, { onOpened: () => a(!0) })
			}),
			i && /* @__PURE__ */ L("div", {
				class: "actions",
				children: /* @__PURE__ */ L(U, {
					primary: !0,
					onClick: () => t ? n.open(t.tool, t.args, "replace") : n.bridge.sendMessage(r("need.message")),
					children: r("need.continue")
				})
			})
		]
	});
}
var ao = [
	"limit_steps",
	"limit_runs_day",
	"limit_runs_year",
	"limit_steps_day",
	"limit_steps_year",
	"limit_workflows"
];
function oo(e) {
	let { message: t, code: n, arg: r } = e, i = R(), { t: a } = I();
	return n === "account_needed" ? /* @__PURE__ */ L(io, { ...e }) : n === "not_running" ? /* @__PURE__ */ L("div", {
		class: "w",
		children: /* @__PURE__ */ L(Vt, { link: e.link })
	}) : /* @__PURE__ */ L("div", {
		class: "w",
		children: [/* @__PURE__ */ L(H, {
			kind: "bad",
			children: n ? a(`error.${n}`, { arg: r }) : t
		}), n && ao.includes(n) && /* @__PURE__ */ L("button", {
			class: "link",
			style: "align-self:flex-start",
			onClick: () => i.open("show_account", {}, "push"),
			children: a("br.seePlans")
		})]
	});
}
function so({ p: e }) {
	if (ka(e)) return /* @__PURE__ */ L(ro, {});
	switch (e.view) {
		case "setup": return /* @__PURE__ */ L(Ht, { ...e });
		case "library": return /* @__PURE__ */ L(it, { ...e });
		case "workflow": return /* @__PURE__ */ L(Dt, { ...e });
		case "import": return /* @__PURE__ */ L(at, { ...e });
		case "draft": return /* @__PURE__ */ L(ot, { ...e });
		case "runSetup": return /* @__PURE__ */ L(lt, { ...e });
		case "run": return /* @__PURE__ */ L(gt, { run: e.run });
		case "failure": return /* @__PURE__ */ L(_t, {
			run: e.run,
			inspecting: e.inspecting
		});
		case "change": return /* @__PURE__ */ L(Ot, { ...e });
		case "runs": return /* @__PURE__ */ L(bt, { ...e });
		case "stepRun": return /* @__PURE__ */ L(xt, { ...e });
		case "data": return /* @__PURE__ */ L(At, { ...e });
		case "history": return /* @__PURE__ */ L(Mt, { ...e });
		case "account": return /* @__PURE__ */ L(Pt, { ...e });
		case "error": return /* @__PURE__ */ L(oo, { ...e });
		default: return null;
	}
}
var co = 45e3, lo = 3e3;
function uo(e) {
	if (e && (e.view === "draft" || e.view === "change" || e.view === "import")) return e.pendingId;
}
function fo({ onShow: e }) {
	let { t } = I();
	return /* @__PURE__ */ L("div", {
		class: "w shown-line",
		children: [/* @__PURE__ */ L("span", {
			class: "shown-line-text",
			children: [/* @__PURE__ */ L("svg", {
				width: "16",
				height: "16",
				viewBox: "0 0 16 16",
				fill: "none",
				stroke: "currentColor",
				"stroke-width": "1.5",
				"stroke-linejoin": "round",
				"aria-hidden": "true",
				children: [/* @__PURE__ */ L("rect", {
					x: "2",
					y: "3",
					width: "12",
					height: "10",
					rx: "1.5"
				}), /* @__PURE__ */ L("path", { d: "M10 3v10" })]
			}), t("shown.line")]
		}), /* @__PURE__ */ L("button", {
			class: "btn sm",
			onClick: e,
			children: t("shown.showHere")
		})]
	});
}
function po({ bridge: e, start: t, top: n, initial: r }) {
	let i = F(+!!r), [a, o] = N(r ? [{
		key: 0,
		p: r
	}] : []), [s, c] = N(!1), [l, u] = N(), [d, f] = N(r?.lang ?? "auto"), [p, m] = N(0), h = F(0);
	h.current = p;
	let g = (e, t) => {
		e.lang && f(e.lang);
		let n = {
			key: i.current++,
			p: e
		};
		o((e) => t === "reset" ? [n] : t === "push" ? [...e, n] : [...e.slice(0, -1), n]);
	};
	P(() => {
		r || e.onPayload((e) => {
			u(void 0), c(e.shownIn === "panel"), g(e, "reset");
		});
	}, [e]);
	let _ = Ae(() => We(Ue(d, e.hostLocale()), e.hostName()), [d, e]), v = async (e) => {
		let t = !0, n = () => {
			t && (t = !1, m((e) => Math.max(0, e - 1)));
		};
		m((e) => e + 1);
		let r = setTimeout(n, co);
		try {
			return await e();
		} finally {
			clearTimeout(r), n();
		}
	}, y = Ae(() => ({
		bridge: e,
		langPref: d,
		push: (e) => g(e, "push"),
		replace: (e) => g(e, "replace"),
		back: () => o((e) => e.length > 1 ? e.slice(0, -1) : e),
		lock: v,
		open: (t, n = {}, r = "push") => v(async () => {
			u(void 0);
			try {
				let a = await e.call(t, n);
				if (!a.payload || !("view" in a.payload)) throw Error(a.text || "Unexpected response");
				if (a.payload.view === "error" && a.payload.code === "account_needed") {
					let e = {
						key: i.current++,
						p: {
							...a.payload,
							retry: {
								tool: t,
								args: n
							}
						}
					}, r = (e) => e?.view === "error" && e.code === "account_needed";
					o((t) => r(t[t.length - 1]?.p) ? [...t.slice(0, -1), e] : [...t, e]);
					return;
				}
				if (a.payload.view === "account" && a.payload.limit) {
					let e = {
						key: i.current++,
						p: {
							...a.payload,
							retry: {
								tool: t,
								args: n
							}
						}
					}, r = (e) => e?.view === "account" && !!e.limit;
					o((t) => r(t[t.length - 1]?.p) ? [...t.slice(0, -1), e] : [...t, e]);
					return;
				}
				g(a.payload, r);
			} catch (e) {
				u(e?.message ?? String(e));
			}
		}),
		async setLang(t) {
			f(t), await e.call("ui_set_language", { lang: t });
		}
	}), [e, d]), b = a[a.length - 1];
	P(() => {
		r || e.setCurrent?.(b?.p);
	}, [b?.key]), P(() => {
		t && y.open(t.tool, t.args ?? {}, "replace");
	}, []);
	let x = uo(b?.p), S = b?.key;
	P(() => {
		if (!x) return;
		let t = !1, n = !1, r = async () => {
			if (!(n || h.current > 0 || document.visibilityState === "hidden")) {
				n = !0;
				try {
					let n = await e.call("ui_proposal", { pendingId: x });
					if (t || h.current > 0 || !n.payload || !("view" in n.payload) || uo(n.payload) === x) return;
					let r = {
						key: i.current++,
						p: n.payload
					};
					o((e) => e[e.length - 1]?.key === S ? [...e.slice(0, -1), r] : e);
				} catch {} finally {
					n = !1;
				}
			}
		}, a = setInterval(r, lo), s = () => {
			document.visibilityState === "visible" && r();
		};
		document.addEventListener("visibilitychange", s);
		let c = e.onEvent?.("proposal.update", (e) => {
			e?.pendingId && e.pendingId !== x || r();
		});
		return () => {
			t = !0, clearInterval(a), document.removeEventListener("visibilitychange", s), c?.();
		};
	}, [
		x,
		S,
		e
	]);
	let C = {
		...y,
		canBack: a.length > 1
	};
	return /* @__PURE__ */ L(Ge.Provider, {
		value: _,
		children: /* @__PURE__ */ L(qe.Provider, {
			value: C,
			children: /* @__PURE__ */ L("div", {
				lang: _.lang,
				class: p ? "is-working" : void 0,
				inert: p > 0,
				"aria-busy": p > 0,
				children: [
					p > 0 && /* @__PURE__ */ L("div", {
						class: "working-bar",
						role: "progressbar",
						"aria-label": _.t("common.loading"),
						children: /* @__PURE__ */ L("i", {})
					}),
					n?.(C, b?.p),
					l && /* @__PURE__ */ L("div", {
						class: "w",
						style: "padding-bottom:0",
						children: /* @__PURE__ */ L(H, {
							kind: "bad",
							children: l
						})
					}),
					s && b ? /* @__PURE__ */ L(fo, { onShow: () => c(!1) }) : b ? a.map((e, t) => /* @__PURE__ */ L("div", {
						hidden: t !== a.length - 1,
						children: /* @__PURE__ */ L(so, { p: e.p })
					}, e.key)) : /* @__PURE__ */ L("div", {
						class: "w",
						"aria-busy": "true",
						"aria-label": _.t("common.loading"),
						children: [
							/* @__PURE__ */ L("div", {
								class: "skel",
								style: "width:55%;height:18px"
							}),
							/* @__PURE__ */ L("div", { class: "skel" }),
							/* @__PURE__ */ L("div", { class: "skel" })
						]
					})
				]
			})
		})
	});
}
// ui/panel.tsx
function mo(e) {
	if (!e) return {};
	let t = e, n = t.run ?? t.step;
	return {
		view: e.view,
		workflowId: t.workflowId ?? t.workflow?.id ?? n?.workflowId,
		runId: t.runId ?? n?.runId,
		pendingId: uo(e)
	};
}
var ho = class {
	runtime;
	tabs;
	storage;
	surface = "panel";
	current;
	context;
	contextTimer;
	constructor(e = chrome.runtime, t = chrome.tabs, n = chrome.storage) {
		this.runtime = e, this.tabs = t, this.storage = n;
	}
	async call(e, t = {}) {
		let n = await this.runtime.sendMessage({
			bw: "tools.call",
			name: e,
			args: t
		});
		if (!n?.ok) throw Error(n?.error ?? "Browser Workflow did not answer.");
		return {
			payload: n.result?.payload ?? {},
			text: n.result?.text ?? "",
			isError: !!n.result?.isError
		};
	}
	async sendMessage(e) {
		let t = this.context;
		this.context = void 0, clearTimeout(this.contextTimer);
		let n = {
			kind: "ask_claude",
			text: e,
			...mo(this.current),
			...t ? { context: t } : {}
		};
		return {
			delivered: !!(await this.runtime.sendMessage({
				bw: "user.action",
				action: n
			}).catch(() => void 0))?.delivered,
			text: e
		};
	}
	async updateContext(e) {
		this.context = e, clearTimeout(this.contextTimer), this.contextTimer = setTimeout(() => {
			if (this.context === void 0) return;
			let e = {
				kind: "context",
				text: this.context,
				silent: !0,
				...mo(this.current)
			};
			this.context = void 0, this.runtime.sendMessage({
				bw: "user.action",
				action: e
			}).catch(() => {});
		}, 50);
	}
	async openLink(e) {
		await this.tabs.create({ url: e });
	}
	async download(e, t, n) {
		let r = URL.createObjectURL(new Blob([n], { type: t })), i = document.createElement("a");
		i.href = r, i.download = e, document.body.appendChild(i), i.click(), i.remove(), setTimeout(() => URL.revokeObjectURL(r), 1e4);
	}
	frameUrl() {
		return this.runtime.getURL("sandbox/frame.html");
	}
	async openPreview(e, t) {
		let n = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
		await this.storage.session.set({ [`bw.preview.${n}`]: {
			html: e,
			...t ? { title: t } : {}
		} }), await this.tabs.create({ url: this.runtime.getURL(`preview/preview.html#${n}`) });
	}
	async ask(e) {
		try {
			return await this.runtime.sendMessage(e);
		} catch {
			return;
		}
	}
	async chatState() {
		let e = await this.ask({ bw: "chat.state" });
		return [
			"none",
			"listening",
			"working",
			"idle",
			"connected"
		].includes(e?.state) ? e.state : void 0;
	}
	async chatLog() {
		let e = await this.ask({ bw: "chat.log" });
		return Array.isArray(e?.entries) ? e.entries : void 0;
	}
	async mentions(e) {
		let t = await this.ask({
			bw: "chat.mentions",
			query: e
		});
		if (t && (Array.isArray(t.workflows) || Array.isArray(t.runs) || Array.isArray(t.tabs))) return {
			workflows: t.workflows ?? [],
			runs: t.runs ?? [],
			tabs: t.tabs ?? []
		};
	}
	async chatSend(e, t) {
		let n = await this.ask({
			bw: "chat.send",
			text: e,
			mentions: t
		});
		if (n && typeof n == "object" && "delivered" in n) return {
			delivered: !!n.delivered,
			fallback: !1
		};
		let r = {
			kind: "chat",
			text: e,
			...t.length ? { mentions: t } : {}
		};
		return {
			delivered: !!(await this.ask({
				bw: "user.action",
				action: r
			}))?.delivered,
			fallback: !0
		};
	}
	onPayload() {}
	hostLocale() {
		return navigator.language;
	}
	hostName() {
		return "Claude";
	}
	onEvent(e, t) {
		let n = (n) => {
			n?.bw === "event" && n.name === e && t(n.data);
		};
		return this.runtime.onMessage.addListener(n), () => this.runtime.onMessage.removeListener(n);
	}
	setCurrent(e) {
		this.current = e;
	}
};
function go({ nav: e, current: t }) {
	let { t: n } = I(), [r, i] = N([]);
	P(() => {
		let t = !1, n = async () => {
			try {
				let n = await e.bridge.call("ui_proposal", {});
				t || i(n.payload.proposals ?? []);
			} catch {}
		};
		n();
		let r = e.bridge.onEvent?.("proposal.update", () => void n()), a = setInterval(n, 3e4);
		return () => {
			t = !0, r?.(), clearInterval(a);
		};
	}, [e.bridge]);
	let a = t?.view === "library", o = uo(t), s = r.filter((e) => e.pendingId !== o);
	return /* @__PURE__ */ L("div", {
		class: "w panel-top",
		style: "padding-bottom:0",
		children: [
			/* @__PURE__ */ L("div", {
				style: "display:flex;justify-content:space-between;align-items:center",
				children: [a ? /* @__PURE__ */ L("span", {}) : /* @__PURE__ */ L("button", {
					class: "back",
					onClick: () => e.open("list_workflows", {}, "reset"),
					children: n("panel.home")
				}), t?.view !== "account" && /* @__PURE__ */ L("button", {
					class: "link",
					onClick: () => e.open("show_account", {}, "push"),
					children: n("panel.account")
				})]
			}),
			a && /* @__PURE__ */ L(Ra, { nav: e }),
			s.length > 0 && /* @__PURE__ */ L("div", {
				class: "note warn",
				role: "status",
				style: "align-items:center",
				children: [
					B.alert(),
					/* @__PURE__ */ L("div", {
						class: "row-main",
						children: [/* @__PURE__ */ L("div", {
							class: "row-title",
							children: n("panel.waiting")
						}), /* @__PURE__ */ L("div", {
							class: "row-sub",
							children: s.length === 1 ? s[0].name : n("panel.waitingSub", { n: s.length })
						})]
					}),
					/* @__PURE__ */ L("button", {
						class: "btn primary",
						onClick: () => e.open("ui_proposal", { pendingId: s[0].pendingId }, "push"),
						children: n("panel.review")
					})
				]
			})
		]
	});
}
function _o(e, t = new ho()) {
	ge(/* @__PURE__ */ L(po, {
		bridge: t,
		start: { tool: "list_workflows" },
		top: (e, t) => /* @__PURE__ */ L(go, {
			nav: e,
			current: t
		})
	}), e);
}
export { ho as PanelBridge, _o as mountPanel };
