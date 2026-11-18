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
function w(e, t) {
	this.props = e, this.context = t;
}
function T(e, t) {
	if (t == null) return e.__ ? T(e.__, e.__i + 1) : null;
	for (var n; t < e.__k.length; t++) if ((n = e.__k[t]) != null && n.__e != null) return n.__e;
	return typeof e.type == "function" ? T(e) : null;
}
function E(e) {
	if (e.__P && e.__d) {
		var n = e.__v, r = n.__e, i = [], a = [], o = y({}, n);
		o.__v = n.__v + 1, t.vnode && t.vnode(o), re(e.__P, o, n, e.__n, e.__P.namespaceURI, 32 & n.__u ? [r] : null, i, r ?? T(n), !!(32 & n.__u), a), o.__v = n.__v, o.__.__k[o.__i] = o, ae(i, o, a), n.__e = n.__ = null, o.__e != r && D(o);
	}
}
function D(e) {
	if ((e = e.__) != null && e.__c != null) return e.__e = e.__c.base = null, e.__k.some(function(t) {
		if (t != null && t.__e != null) return e.__e = e.__c.base = t.__e;
	}), D(e);
}
function O(e) {
	(!e.__d && (e.__d = !0) && r.push(e) && !k.__r++ || i != t.debounceRendering) && ((i = t.debounceRendering) || a)(k);
}
function k() {
	try {
		for (var e, t = 1; r.length;) r.length > t && r.sort(o), e = r.shift(), t = r.length, E(e);
	} finally {
		r.length = k.__r = 0;
	}
}
function ee(e, t, n, r, i, a, o, s, c, l, u) {
	var d, f, p, m, _, v, y = r && r.__k || g, b = t.length;
	for (c = A(n, t, y, c, b), d = 0; d < b; d++) (p = n.__k[d]) != null && (f = p.__i != -1 && y[p.__i] || h, p.__i = d, v = re(e, p, f, i, a, o, s, c, l, u), m = p.__e, p.ref && f.ref != p.ref && (f.ref && ce(f.ref, null, p), u.push(p.ref, p.__c || m, p)), _ == null && m != null && (_ = m), 4 & p.__u ? (c = te(p, c, e), f.__e && (f.__e = null)) : typeof p.type == "function" && v !== void 0 ? c = v : m && (c = m.nextSibling), p.__u &= -7);
	return n.__e = _, c;
}
function A(e, t, n, r, i) {
	var a, o, s, c, l, u = n.length, d = u, f = 0;
	for (e.__k = Array(i), a = 0; a < i; a++) (o = t[a]) != null && typeof o != "boolean" && typeof o != "function" ? (typeof o == "string" || typeof o == "number" || typeof o == "bigint" || o.constructor == String ? o = e.__k[a] = S(null, o, null, null, null) : v(o) ? o = e.__k[a] = S(C, { children: o }, null, null, null) : o.constructor === void 0 && o.__b > 0 ? o = e.__k[a] = S(o.type, o.props, o.key, o.ref ? o.ref : null, o.__v) : e.__k[a] = o, c = a + f, o.__ = e, o.__b = e.__b + 1, s = null, (l = o.__i = j(o, n, c, d)) != -1 && (d--, (s = n[l]) && (s.__u |= 2)), s == null || s.__v == null ? (l == -1 && (i > u ? f-- : i < u && f++), typeof o.type != "function" && (o.__u |= 4)) : l != c && (l == c - 1 ? f-- : l == c + 1 ? f++ : (l > c ? f-- : f++, o.__u |= 4))) : e.__k[a] = null;
	if (d) for (a = 0; a < u; a++) (s = n[a]) != null && !(2 & s.__u) && (s.__e == r && (r = T(s)), le(s, s));
	return r;
}
function te(e, t, n) {
	var r, i;
	if (typeof e.type == "function") {
		for (r = e.__k, i = 0; r && i < r.length; i++) r[i] && (r[i].__ = e, t = te(r[i], t, n));
		return t;
	}
	e.__e != t && (t && e.type && !t.parentNode && (t = T(e)), t = n.insertBefore(e.__e, t || null));
	do
		t &&= t.nextSibling;
	while (t != null && t.nodeType == 8);
	return t;
}
function j(e, t, n, r) {
	var i, a, o, s = e.key, c = e.type, l = t[n], u = l != null && !(2 & l.__u);
	if (l === null && s == null || u && s == l.key && c == l.type) return n;
	if (r > +!!u) {
		for (i = n - 1, a = n + 1; i >= 0 || a < t.length;) if ((l = t[o = i >= 0 ? i-- : a++]) != null && !(2 & l.__u) && s == l.key && c == l.type) return o;
	}
	return -1;
}
function M(e, t, n) {
	t[0] == "-" ? e.setProperty(t, n ?? "") : e[t] = n == null ? "" : typeof n != "number" || _.test(t) ? n : n + "px";
}
function N(e, t, n, r, i) {
	var a, o;
	n: if (t == "style") {
		if (typeof n == "string") e.style.cssText = n;
		else {
			if (typeof r == "string" && (e.style.cssText = r = ""), r) for (t in r) n && t in n || M(e.style, t, "");
			if (n) for (t in n) r && n[t] == r[t] || M(e.style, t, n[t]);
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
function ne(e) {
	return function(n) {
		if (this.l) {
			var r = this.l[n.type + e];
			if (n[c] == null) n[c] = d++;
			else if (n[c] < r[l]) return;
			return r(t.event ? t.event(n) : n);
		}
	};
}
function re(e, n, r, i, a, o, s, c, l, u) {
	var d, f, p, m, h, _, x, S, E, D, O, k, A, te, j, M, N = n.type;
	if (n.constructor !== void 0) return null;
	128 & r.__u && (l = !!(32 & r.__u), o = [c = n.__e = r.__e]), (d = t.__b) && d(n);
	n: if (typeof N == "function") {
		f = s.length;
		try {
			if (E = n.props, D = N.prototype && N.prototype.render, O = (d = N.contextType) && i[d.__c], k = d ? O ? O.props.value : d.__ : i, r.__c ? S = (p = n.__c = r.__c).__ = p.__E : (D ? n.__c = p = new N(E, k) : (n.__c = p = new w(E, k), p.constructor = N, p.render = ue), O && O.sub(p), p.state || (p.state = {}), p.__n = i, m = p.__d = !0, p.__h = [], p._sb = []), D && p.__s == null && (p.__s = p.state), D && N.getDerivedStateFromProps != null && (p.__s == p.state && (p.__s = y({}, p.__s)), y(p.__s, N.getDerivedStateFromProps(E, p.__s))), h = p.props, _ = p.state, p.__v = n, m) D && N.getDerivedStateFromProps == null && p.componentWillMount != null && p.componentWillMount(), D && p.componentDidMount != null && p.__h.push(p.componentDidMount);
			else {
				if (D && N.getDerivedStateFromProps == null && E !== h && p.componentWillReceiveProps != null && p.componentWillReceiveProps(E, k), n.__v == r.__v || !p.__e && p.shouldComponentUpdate != null && !1 === p.shouldComponentUpdate(E, p.__s, k)) {
					n.__v != r.__v && (p.props = E, p.state = p.__s, p.__d = !1), n.__e = r.__e, n.__k = r.__k, n.__k.some(function(e) {
						e && (e.__ = n);
					}), g.push.apply(p.__h, p._sb), p._sb = [], p.__h.length && s.push(p), c = T(r);
					break n;
				}
				p.componentWillUpdate != null && p.componentWillUpdate(E, p.__s, k), D && p.componentDidUpdate != null && p.__h.push(function() {
					p.componentDidUpdate(h, _, x);
				});
			}
			if (p.context = k, p.props = E, p.__P = e, p.__e = !1, A = t.__r, te = 0, D) p.state = p.__s, p.__d = !1, A && A(n), d = p.render(p.props, p.state, p.context), g.push.apply(p.__h, p._sb), p._sb = [];
			else do
				p.__d = !1, A && A(n), d = p.render(p.props, p.state, p.context), p.state = p.__s;
			while (p.__d && ++te < 25);
			p.state = p.__s, p.getChildContext != null && (i = y(y({}, i), p.getChildContext())), D && !m && p.getSnapshotBeforeUpdate != null && (x = p.getSnapshotBeforeUpdate(h, _)), j = d != null && d.type === C && d.key == null ? oe(d.props.children) : d, c = ee(e, v(j) ? j : [j], n, r, i, a, o, s, c, l, u), p.base = n.__e, n.__u &= -161, p.__h.length && s.push(p), S && (p.__E = p.__ = null);
		} catch (e) {
			if (s.length = f, n.__v = null, l || o != null) {
				if (e.then) {
					for (n.__u |= l ? 160 : 128; c && c.nodeType == 8 && c.nextSibling;) c = c.nextSibling;
					o != null && (o[o.indexOf(c)] = null), n.__e = c;
				} else if (o != null) for (M = o.length; M--;) b(o[M]);
			} else n.__e = r.__e;
			n.__k ??= r.__k || [], e.then || ie(n), t.__e(e, n, r);
		}
	} else o == null && n.__v == r.__v ? (n.__k = r.__k, n.__e = r.__e) : c = n.__e = se(r.__e, n, r, i, a, o, s, l, u);
	return (d = t.diffed) && d(n), 128 & n.__u ? void 0 : c;
}
function ie(e) {
	e && (e.__c && (e.__c.__e = !0), e.__k && e.__k.some(ie));
}
function ae(e, n, r) {
	for (var i = 0; i < r.length; i++) ce(r[i], r[++i], r[++i]);
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
function oe(e) {
	return typeof e != "object" || !e || e.__b > 0 ? e : v(e) ? e.map(oe) : e.constructor === void 0 ? y({}, e) : null;
}
function se(n, r, i, a, o, s, c, l, u) {
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
		for (d in x) g = x[d], d == "dangerouslySetInnerHTML" ? p = g : d == "children" || d in S || d == "value" && "defaultValue" in S || d == "checked" && "defaultChecked" in S || N(n, d, null, g, o);
		for (d in S) g = S[d], d == "children" ? m = g : d == "dangerouslySetInnerHTML" ? f = g : d == "value" ? _ = g : d == "checked" ? y = g : l && typeof g != "function" || x[d] === g || N(n, d, g, x[d], o);
		if (f) l || p && (f.__html == p.__html || f.__html == n.innerHTML) || (n.innerHTML = f.__html), r.__k = [];
		else if (p && (n.innerHTML = ""), ee(r.type == "template" ? n.content : n, v(m) ? m : [m], r, i, a, C == "foreignObject" ? "http://www.w3.org/1999/xhtml" : o, s, c, s ? s[0] : i.__k && T(i, 0), l, u), s != null) for (d = s.length; d--;) b(s[d]);
		l && C != "textarea" || (d = "value", C == "progress" && _ == null ? n.removeAttribute("value") : _ != null && (_ !== n[d] || C == "progress" && !_ || C == "option" && _ != x[d]) && N(n, d, _, x[d], o), d = "checked", y != null && y != n[d] && N(n, d, y, x[d], o));
	}
	return n;
}
function ce(e, n, r) {
	try {
		if (typeof e == "function") {
			var i = typeof e.__u == "function";
			i && e.__u(), i && n == null || (e.__u = e(n));
		} else e.current = n;
	} catch (e) {
		t.__e(e, r);
	}
}
function le(e, n, r) {
	var i, a;
	if (t.unmount && t.unmount(e), (i = e.ref) && (i.current && i.current != e.__e || ce(i, null, n)), (i = e.__c) != null) {
		if (i.componentWillUnmount) try {
			i.componentWillUnmount();
		} catch (e) {
			t.__e(e, n);
		}
		i.base = i.__P = i.__n = null;
	}
	if (i = e.__k) for (a = 0; a < i.length; a++) i[a] && le(i[a], n, r || typeof e.type != "function");
	r || b(e.__e), e.__c = e.__ = e.__e = void 0;
}
function ue(e, t, n) {
	return this.constructor(e, n);
}
function de(n, r, i) {
	var a, o, s, c;
	r == document && (r = document.documentElement), t.__ && t.__(n, r), o = (a = typeof i == "function") ? null : i && i.__k || r.__k, s = [], c = [], re(r, n = (!a && i || r).__k = x(C, null, [n]), o || h, h, r.namespaceURI, !a && i ? [i] : o ? null : r.firstChild ? e.call(r.childNodes) : null, s, !a && i ? i : o ? o.__e : r.firstChild, a, c), ae(s, n, c), n.props.children = null;
}
function fe(e) {
	function t(e) {
		var n, r;
		return this.getChildContext || (n = /* @__PURE__ */ new Set(), (r = {})[t.__c] = this, this.getChildContext = function() {
			return r;
		}, this.componentWillUnmount = function() {
			n = null;
		}, this.shouldComponentUpdate = function(e) {
			this.props.value != e.value && n.forEach(function(e) {
				e.__e = !0, O(e);
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
} }, n = 0, w.prototype.setState = function(e, t) {
	var n = this.__s != null && this.__s != this.state ? this.__s : this.__s = y({}, this.state);
	typeof e == "function" && (e = e(y({}, n), this.props)), e && y(n, e), e != null && this.__v && (t && this._sb.push(t), O(this));
}, w.prototype.forceUpdate = function(e) {
	this.__v && (this.__e = !0, e && this.__h.push(e), O(this));
}, w.prototype.render = C, r = [], a = typeof Promise == "function" ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout, o = function(e, t) {
	return e.__v.__b - t.__v.__b;
}, k.__r = 0, s = Math.random().toString(8), c = "__d" + s, l = "__a" + s, u = /(PointerCapture)$|Capture$/i, d = 0, f = ne(!1), p = ne(!0), m = 0;
// node_modules/preact/hooks/dist/hooks.module.js
var P, F, pe, me, he = 0, ge = [], I = t, _e = I.__b, ve = I.__r, ye = I.diffed, be = I.__c, xe = I.unmount, Se = I.__;
function L(e, t) {
	I.__h && I.__h(F, e, he || t), he = 0;
	var n = F.__H || (F.__H = {
		__: [],
		__h: []
	});
	return e >= n.__.length && n.__.push({}), n.__[e];
}
function R(e) {
	return he = 1, Ce(Ne, e);
}
function Ce(e, t, n) {
	var r = L(P++, 2);
	if (r.t = e, !r.__c && (r.__ = [n ? n(t) : Ne(void 0, t), function(e) {
		var t = r.__N ? r.__N[0] : r.__[0], n = r.t(t, e);
		t !== n && (r.__N = [n, r.__[1]], r.__c.setState({}));
	}], r.__c = F, !F.__f)) {
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
		F.__f = !0;
		var a = F.shouldComponentUpdate, o = F.componentWillUpdate;
		F.componentWillUpdate = function(e, t, n) {
			if (this.__e) {
				var r = a;
				a = void 0, i(e, t, n), a = r;
			}
			o && o.call(this, e, t, n);
		}, F.shouldComponentUpdate = i;
	}
	return r.__N || r.__;
}
function z(e, t) {
	var n = L(P++, 3);
	!I.__s && Me(n.__H, t) && (n.__ = e, n.u = t, F.__H.__h.push(n));
}
function we(e, t) {
	var n = L(P++, 4);
	!I.__s && Me(n.__H, t) && (n.__ = e, n.u = t, F.__h.push(n));
}
function B(e) {
	return he = 5, Te(function() {
		return { current: e };
	}, []);
}
function Te(e, t) {
	var n = L(P++, 7);
	return Me(n.__H, t) && (n.__ = e(), n.__H = t, n.__h = e), n.__;
}
function Ee(e) {
	var t = F.context[e.__c], n = L(P++, 9);
	return n.c = e, t ? (n.__ ?? (n.__ = !0, t.sub(F)), t.props.value) : e.__;
}
function De() {
	for (var e; e = ge.shift();) {
		var t = e.__H;
		if (e.__P && t) try {
			t.__h.some(Ae), t.__h.some(je), t.__h = [];
		} catch (n) {
			t.__h = [], I.__e(n, e.__v);
		}
	}
}
I.__b = function(e) {
	F = null, _e && _e(e);
}, I.__ = function(e, t) {
	e && t.__k && t.__k.__m && (e.__m = t.__k.__m), Se && Se(e, t);
}, I.__r = function(e) {
	ve && ve(e), P = 0;
	var t = (F = e.__c).__H;
	t && (pe === F ? (t.__h = [], F.__h = [], t.__.some(function(e) {
		e.__N && (e.__ = e.__N), e.u = e.__N = void 0;
	})) : (t.__h.some(Ae), t.__h.some(je), t.__h = [], P = 0)), pe = F;
}, I.diffed = function(e) {
	ye && ye(e);
	var t = e.__c;
	t && t.__H && (t.__H.__h.length && (ge.push(t) !== 1 && me === I.requestAnimationFrame || ((me = I.requestAnimationFrame) || ke)(De)), t.__H.__.some(function(e) {
		e.u &&= (e.__H = e.u, void 0);
	})), pe = F = null;
}, I.__c = function(e, t) {
	t.some(function(e) {
		try {
			e.__h.some(Ae), e.__h = e.__h.filter(function(e) {
				return !e.__ || je(e);
			});
		} catch (n) {
			t.some(function(e) {
				e.__h &&= [];
			}), t = [], I.__e(n, e.__v);
		}
	}), be && be(e, t);
}, I.unmount = function(e) {
	xe && xe(e);
	var t, n = e.__c;
	n && n.__H && (n.__H.__.some(function(e) {
		try {
			Ae(e);
		} catch (e) {
			t = e;
		}
	}), n.__H = void 0, t && I.__e(t, n.__v));
};
var Oe = typeof requestAnimationFrame == "function";
function ke(e) {
	var t, n = function() {
		clearTimeout(r), Oe && cancelAnimationFrame(t), setTimeout(e);
	}, r = setTimeout(n, 35);
	Oe && (t = requestAnimationFrame(n));
}
function Ae(e) {
	var t = F, n = e.__c;
	typeof n == "function" && (e.__c = void 0, n()), F = t;
}
function je(e) {
	var t = F;
	e.__c = e.__(), F = t;
}
function Me(e, t) {
	return !e || e.length !== t.length || t.some(function(t, n) {
		return t !== e[n];
	});
}
function Ne(e, t) {
	return typeof t == "function" ? t(e) : t;
}
// ui/i18n.ts
var Pe = {
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
	"chat.cardRunOther": "“{name}”: {status}"
}, Fe = {
	en: Pe,
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
		"chat.cardRunOther": "“{name}”: {status}"
	}
};
function Ie(e, t = "en") {
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
function Le(e, t = Ie(void 0, e).ai) {
	let n = Fe[e];
	return (e, r = {}) => (n[e] ?? Pe[e]).replace(/\{(\w+)(?:\|([^|}]*)\|([^}]*))?\}/g, (e, n, i, a) => {
		let o = n === "ai" && r.ai === void 0 ? t : r[n];
		return i === void 0 ? o === void 0 ? "" : String(o) : Number(o) === 1 ? i : a ?? "";
	});
}
function Re(e, t) {
	return e === "en" || e === "vi" ? e : (t || (typeof navigator < "u" ? navigator.language : "") || "en").toLowerCase().startsWith("vi") ? "vi" : "en";
}
function ze(e, t) {
	let n = Ie(t, e), r = Le(e, n.ai), i = new Intl.RelativeTimeFormat(e, {
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
var Be = fe(ze("en")), V = () => Ee(Be), Ve = 0;
Array.isArray;
function H(e, n, r, i, a, o) {
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
		__v: --Ve,
		__i: -1,
		__u: 0,
		__source: a,
		__self: o
	};
	if (typeof e == "function" && (s = e.defaultProps)) for (c in s) l[c] === void 0 && (l[c] = s[c]);
	return t.vnode && t.vnode(u), u;
}
// ui/components.tsx
var He = fe(null), U = () => Ee(He), W = (e, t = 16) => /* @__PURE__ */ H("svg", {
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
}), G = {
	check: () => W(/* @__PURE__ */ H("path", { d: "M3.5 8.5l3 3 6-7" })),
	x: () => W(/* @__PURE__ */ H("path", { d: "M4.5 4.5l7 7M11.5 4.5l-7 7" })),
	chevron: () => W(/* @__PURE__ */ H("path", { d: "M6 4l4 4-4 4" }), 14),
	more: () => W(/* @__PURE__ */ H("g", {
		fill: "currentColor",
		stroke: "none",
		children: [
			/* @__PURE__ */ H("circle", {
				cx: "3.5",
				cy: "8",
				r: "1.3"
			}),
			/* @__PURE__ */ H("circle", {
				cx: "8",
				cy: "8",
				r: "1.3"
			}),
			/* @__PURE__ */ H("circle", {
				cx: "12.5",
				cy: "8",
				r: "1.3"
			})
		]
	})),
	spinner: () => /* @__PURE__ */ H("svg", {
		class: "spin",
		width: "16",
		height: "16",
		viewBox: "0 0 16 16",
		fill: "none",
		stroke: "currentColor",
		"stroke-width": "1.8",
		"stroke-linecap": "round",
		"aria-hidden": "true",
		children: /* @__PURE__ */ H("path", { d: "M8 2a6 6 0 1 1-6 6" })
	}),
	pause: () => W(/* @__PURE__ */ H("path", { d: "M6 4v8M10 4v8" })),
	circle: () => W(/* @__PURE__ */ H("circle", {
		cx: "8",
		cy: "8",
		r: "4.5"
	})),
	skip: () => W(/* @__PURE__ */ H("path", { d: "M4 8h8" })),
	alert: () => W(/* @__PURE__ */ H(C, { children: [/* @__PURE__ */ H("path", { d: "M8 2.5l6 11H2z" }), /* @__PURE__ */ H("path", { d: "M8 7v2.5M8 11.6v.1" })] })),
	upload: () => W(/* @__PURE__ */ H("path", { d: "M8 11V3M4.5 6.5L8 3l3.5 3.5M3 13h10" })),
	play: () => W(/* @__PURE__ */ H("path", { d: "M5 3.5v9l7-4.5z" })),
	sparkle: () => W(/* @__PURE__ */ H("path", { d: "M8 2.5l1.3 3.2 3.2 1.3-3.2 1.3L8 11.5 6.7 8.3 3.5 7l3.2-1.3zM12.5 11l.6 1.4 1.4.6-1.4.6-.6 1.4-.6-1.4-1.4-.6 1.4-.6z" })),
	back: () => W(/* @__PURE__ */ H("path", { d: "M10 4L6 8l4 4" }), 14),
	navigate: () => W(/* @__PURE__ */ H(C, { children: [/* @__PURE__ */ H("circle", {
		cx: "8",
		cy: "8",
		r: "5.5"
	}), /* @__PURE__ */ H("path", { d: "M2.5 8h11M8 2.5c1.8 1.8 1.8 9.2 0 11M8 2.5c-1.8 1.8-1.8 9.2 0 11" })] })),
	executeXpathCommand: () => W(/* @__PURE__ */ H("path", { d: "M4 3l8 4.2-3.6 1.1L7 12z" })),
	javascript: () => W(/* @__PURE__ */ H("path", { d: "M6 4c-1.5 0-1.5 1-1.5 2S4 8 3 8c1 0 1.5 0 1.5 2s0 2 1.5 2M10 4c1.5 0 1.5 1 1.5 2s.5 2 1.5 2c-1 0-1.5 0-1.5 2s0 2-1.5 2" })),
	extractData: () => W(/* @__PURE__ */ H(C, { children: [/* @__PURE__ */ H("rect", {
		x: "2.5",
		y: "3",
		width: "11",
		height: "10",
		rx: "1.5"
	}), /* @__PURE__ */ H("path", { d: "M2.5 6.5h11M6.5 6.5V13" })] })),
	if: () => W(/* @__PURE__ */ H(C, { children: [
		/* @__PURE__ */ H("circle", {
			cx: "4",
			cy: "4",
			r: "1.5"
		}),
		/* @__PURE__ */ H("circle", {
			cx: "12",
			cy: "4",
			r: "1.5"
		}),
		/* @__PURE__ */ H("circle", {
			cx: "8",
			cy: "12.5",
			r: "1.5"
		}),
		/* @__PURE__ */ H("path", { d: "M8 11V8.5L4 5.5M8 8.5l4-3" })
	] })),
	switch: () => W(/* @__PURE__ */ H(C, { children: [/* @__PURE__ */ H("circle", {
		cx: "3.5",
		cy: "8",
		r: "1.5"
	}), /* @__PURE__ */ H("path", { d: "M5 8h2.5M7.5 8l5-4M7.5 8h5M7.5 8l5 4" })] })),
	delay: () => W(/* @__PURE__ */ H(C, { children: [/* @__PURE__ */ H("circle", {
		cx: "8",
		cy: "8",
		r: "5.5"
	}), /* @__PURE__ */ H("path", { d: "M8 5v3.2l2 1.3" })] })),
	download: () => W(/* @__PURE__ */ H("path", { d: "M8 3v7.5M4.5 7L8 10.5 11.5 7M3 13h10" })),
	manual: () => W(/* @__PURE__ */ H("path", { d: "M5.5 8V4.2a1 1 0 0 1 2 0V7.5M7.5 7V3.2a1 1 0 0 1 2 0V7.5M9.5 7.5V4.5a1 1 0 0 1 2 0V9c0 2.5-1.5 4.5-4 4.5-1.8 0-2.7-.8-3.7-2.3L2.6 8.7a1 1 0 0 1 1.6-1.1l1.3 1.4" }))
};
function Ue({ type: e }) {
	let { t } = V();
	return /* @__PURE__ */ H("span", {
		class: "st pending",
		title: t(`stepType.${e}`),
		children: G[e]()
	});
}
function We({ status: e }) {
	let { t } = V();
	return /* @__PURE__ */ H("span", {
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
function Ge({ status: e }) {
	let { t } = V();
	return /* @__PURE__ */ H("span", {
		class: `dot ${e === "success" ? "ok" : e === "failure" ? "bad" : e === "running" ? "run" : e === "waiting_manual" ? "warn" : ""}`,
		title: t(e ? `status.${e}` : "status.never")
	});
}
function K({ title: e, sub: t, right: n }) {
	let r = U(), { t: i } = V();
	return /* @__PURE__ */ H(C, { children: [r.canBack && /* @__PURE__ */ H("button", {
		class: "back",
		onClick: r.back,
		children: i("common.back")
	}), /* @__PURE__ */ H("div", {
		class: "hd",
		children: [/* @__PURE__ */ H("div", {
			class: "hd-main",
			children: [/* @__PURE__ */ H("h1", {
				class: "title",
				children: e
			}), t && /* @__PURE__ */ H("div", {
				class: "sub",
				children: t
			})]
		}), n]
	})] });
}
function q({ label: e, children: t, initial: n = !1 }) {
	let [r, i] = R(n);
	return /* @__PURE__ */ H(C, { children: [/* @__PURE__ */ H("button", {
		class: "disclosure",
		"aria-expanded": r,
		onClick: () => i(!r),
		children: [G.chevron(), e]
	}), r && t] });
}
function Ke({ items: e }) {
	let [t, n] = R(!1), { t: r } = V();
	return /* @__PURE__ */ H("div", {
		class: "menu",
		children: [/* @__PURE__ */ H("button", {
			class: "icon-btn",
			"aria-label": r("common.moreActions"),
			"aria-expanded": t,
			onClick: () => n(!t),
			children: G.more()
		}), t && /* @__PURE__ */ H("div", {
			class: "menu-pop",
			role: "menu",
			onMouseLeave: () => n(!1),
			children: e.map((e) => /* @__PURE__ */ H("button", {
				role: "menuitem",
				onClick: () => {
					n(!1), e.onClick();
				},
				children: e.label
			}))
		})]
	});
}
function qe({ runId: e, stepId: t, alt: n }) {
	let r = U(), { t: i } = V(), [a, o] = R(), [s, c] = R(!1);
	return z(() => {
		let n = !0;
		return o(void 0), r.bridge.call("ui_get_screenshot", {
			runId: e,
			stepId: t
		}).then((e) => {
			n && !e.isError && e.payload.dataUrl && o(e.payload.dataUrl);
		}).catch(() => {}), () => {
			n = !1;
		};
	}, [e, t]), a ? /* @__PURE__ */ H("button", {
		class: `shot${s ? " open" : ""}`,
		onClick: () => c(!s),
		"aria-label": i(s ? "fail.collapse" : "fail.expand"),
		children: /* @__PURE__ */ H("img", {
			src: a,
			alt: n
		})
	}) : null;
}
function J({ kind: e, children: t }) {
	let n = e === "ok" ? G.check() : e === "info" ? G.circle() : G.alert();
	return /* @__PURE__ */ H("div", {
		class: `note ${e}`,
		role: e === "bad" ? "alert" : "status",
		children: [n, /* @__PURE__ */ H("div", { children: t })]
	});
}
function Y({ onClick: e, children: t, primary: n, ghost: r, disabled: i, "aria-label": a }) {
	let o = U(), [s, c] = R(!1);
	return /* @__PURE__ */ H("button", {
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
		children: [s && G.spinner(), t]
	});
}
async function Je(e, t, n) {
	return n && await e.updateContext(n).catch(() => {}), await e.sendMessage(t) ?? void 0;
}
function Ye({ result: e, again: t }) {
	let { t: n } = V(), [r, i] = R(!1), a = t && /* @__PURE__ */ H(C, { children: [" ", /* @__PURE__ */ H("button", {
		class: "link",
		onClick: t,
		children: n("ask.again")
	})] });
	return e ? e.delivered ? /* @__PURE__ */ H(J, {
		kind: "info",
		children: [n("panel.sent"), a]
	}) : /* @__PURE__ */ H("div", {
		class: "note info",
		style: "flex-direction:column;align-items:stretch;gap:8px",
		children: [/* @__PURE__ */ H("div", { children: n("panel.noAi") }), /* @__PURE__ */ H("div", {
			style: "display:flex;gap:6px",
			children: [/* @__PURE__ */ H("input", {
				class: "input",
				readOnly: !0,
				value: e.text,
				onFocus: (e) => e.target.select(),
				"aria-label": n("panel.copy")
			}), /* @__PURE__ */ H("button", {
				class: "btn",
				onClick: async () => {
					try {
						await navigator.clipboard.writeText(e.text), i(!0);
					} catch {}
				},
				children: n(r ? "panel.copied" : "panel.copy")
			})]
		})]
	}) : /* @__PURE__ */ H(J, {
		kind: "info",
		children: [n("ask.sent"), a]
	});
}
function X({ message: e, context: t, placeholder: n, suggestions: r = [], label: i, allowEmpty: a = !1, heading: o }) {
	let s = U(), { t: c } = V(), [l, u] = R(""), [d, f] = R();
	if (d) return /* @__PURE__ */ H(Ye, {
		result: d.result,
		again: () => {
			u(""), f(void 0);
		}
	});
	let p = async () => {
		f({ result: await Je(s.bridge, e(l.trim()), t) });
	};
	return /* @__PURE__ */ H("div", {
		class: `ask${o ? " ask-view" : ""}`,
		children: [
			o && /* @__PURE__ */ H("div", {
				class: "ask-title",
				children: o
			}),
			r.length > 0 && !l && /* @__PURE__ */ H("div", {
				class: "chips",
				children: r.map((e) => /* @__PURE__ */ H("button", {
					class: "chip",
					onClick: () => u(e),
					children: e
				}))
			}),
			/* @__PURE__ */ H("div", {
				class: "ask-row",
				children: [/* @__PURE__ */ H("input", {
					class: "input",
					value: l,
					placeholder: n,
					"aria-label": n,
					onInput: (e) => u(e.target.value),
					onKeyDown: (e) => {
						e.key === "Enter" && (l.trim() || a) && p();
					}
				}), /* @__PURE__ */ H(Y, {
					primary: !o,
					disabled: !l.trim() && !a,
					onClick: p,
					children: [G.sparkle(), i ?? c("ask.button")]
				})]
			})
		]
	});
}
// ui/views/library.tsx
var Xe = 5;
function Ze() {
	let e = U(), { t } = V(), n = B(null), [r, i] = R();
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
		input: /* @__PURE__ */ H("input", {
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
function Qe({ workflows: e, query: t }) {
	let n = U(), { t: r, ago: i } = V(), [a, o] = R(!1), [s, c] = R(""), l = Ze(), u = n.bridge.surface === "panel", d = s.toLowerCase(), f = e.filter((e) => !d || `${e.name} ${e.host}`.toLowerCase().includes(d)), p = a ? f : f.slice(0, Xe);
	return /* @__PURE__ */ H("div", {
		class: "w",
		children: [
			/* @__PURE__ */ H(K, {
				title: r("lib.title"),
				sub: t ? r("lib.matching", { q: t }) : r("lib.saved", { n: e.length })
			}),
			e.length === 0 ? /* @__PURE__ */ H("div", {
				class: "empty",
				children: /* @__PURE__ */ H("div", { children: r(u ? "panel.empty" : "lib.empty") })
			}) : /* @__PURE__ */ H(C, { children: [e.length > Xe && /* @__PURE__ */ H("input", {
				class: "input",
				type: "search",
				placeholder: r("lib.filter"),
				value: s,
				onInput: (e) => c(e.target.value),
				"aria-label": r("lib.filter")
			}), /* @__PURE__ */ H("div", {
				class: "list",
				children: [
					p.map((e) => {
						let t = /* @__PURE__ */ H("button", {
							class: "row",
							style: u ? "flex:1;min-width:0" : void 0,
							onClick: () => n.open("show_workflow", { id: e.id }, "push"),
							children: [
								/* @__PURE__ */ H(Ge, { status: e.lastRun?.status }),
								/* @__PURE__ */ H("div", {
									class: "row-main",
									children: [/* @__PURE__ */ H("div", {
										class: "row-title",
										children: [e.name, e.example && /* @__PURE__ */ H("span", {
											class: "pill muted",
											style: "margin-left:6px",
											children: r("lib.example")
										})]
									}), /* @__PURE__ */ H("div", {
										class: "row-sub",
										children: [
											e.host || r("wf.hostFromInputs"),
											" · ",
											r("lib.steps", { n: e.stepCount })
										]
									})]
								}),
								/* @__PURE__ */ H("span", {
									class: "row-meta",
									children: e.lastRun ? `${e.lastRun.status ? `${r(`status.${e.lastRun.status}`)} · ` : ""}${i(e.lastRun.at)}` : r("lib.neverRun")
								})
							]
						});
						return u ? /* @__PURE__ */ H("div", {
							class: "row-wrap",
							style: "display:flex;align-items:center;gap:6px;padding-right:8px",
							children: [t, /* @__PURE__ */ H(Y, {
								onClick: () => n.open("run_workflow", {
									id: e.id,
									form: !0
								}, "push"),
								"aria-label": `${r("panel.run")} ${e.name}`,
								children: [G.play(), r("panel.run")]
							})]
						}) : t;
					}),
					!p.length && /* @__PURE__ */ H("div", {
						class: "row",
						children: /* @__PURE__ */ H("span", {
							class: "muted",
							children: r("lib.noMatch")
						})
					}),
					!a && f.length > Xe && /* @__PURE__ */ H("button", {
						class: "more",
						onClick: () => o(!0),
						children: r("common.showAll", { n: f.length })
					})
				]
			})] }),
			l.error && /* @__PURE__ */ H("div", {
				class: "field",
				children: /* @__PURE__ */ H("span", {
					class: "err",
					children: l.error
				})
			}),
			l.input,
			/* @__PURE__ */ H("div", {
				class: "actions",
				children: /* @__PURE__ */ H("button", {
					class: "btn primary",
					onClick: l.pick,
					children: [G.upload(), r("lib.import")]
				})
			})
		]
	});
}
// ui/views/importDraft.tsx
function $e({ preview: e, pendingId: t }) {
	let n = U(), { t: r } = V(), [i, a] = R(!1);
	if (i) return /* @__PURE__ */ H("div", {
		class: "w",
		children: /* @__PURE__ */ H(J, {
			kind: "info",
			children: r("imp.cancelled")
		})
	});
	let o = (e) => r(`imp.err.${e.code}`, { arg: e.arg });
	if (!e.ok) {
		let t = e.errors.slice(0, 3);
		return /* @__PURE__ */ H("div", {
			class: "w",
			children: [
				/* @__PURE__ */ H(K, {
					title: r("imp.cantTitle"),
					sub: e.fileName
				}),
				/* @__PURE__ */ H("div", {
					class: "list",
					children: [t.map((e) => /* @__PURE__ */ H("div", {
						class: "row",
						children: [/* @__PURE__ */ H("span", {
							class: "st bad",
							children: G.x()
						}), /* @__PURE__ */ H("div", {
							class: "row-main",
							children: [/* @__PURE__ */ H("div", {
								class: "row-title mono",
								children: e.path
							}), /* @__PURE__ */ H("div", {
								class: "row-sub",
								style: "white-space:normal",
								children: o(e)
							})]
						})]
					})), e.errors.length > 3 && /* @__PURE__ */ H("div", {
						class: "row",
						children: /* @__PURE__ */ H("span", {
							class: "muted",
							children: r("imp.more", { n: e.errors.length - 3 })
						})
					})]
				}),
				/* @__PURE__ */ H("div", {
					class: "actions",
					children: [/* @__PURE__ */ H("button", {
						class: "btn ghost",
						onClick: () => a(!0),
						children: r("common.cancel")
					}), /* @__PURE__ */ H(Y, {
						primary: !0,
						onClick: () => Je(n.bridge, r("msg.importFix", { file: e.fileName }), `The user's workflow file "${e.fileName}" failed validation:\n${e.errors.map((e) => `- ${e.path}: ${e.message}`).join("\n")}\nHelp fix the JSON (format: get_step_schema), then call import_workflow with the corrected content.`),
						children: [G.sparkle(), r("ask.fix")]
					})]
				})
			]
		});
	}
	let s = e.workflow;
	return /* @__PURE__ */ H("div", {
		class: "w",
		children: [
			/* @__PURE__ */ H(K, {
				title: r("imp.title", { name: s.name }),
				sub: e.fileName
			}),
			/* @__PURE__ */ H("div", {
				class: "list",
				children: [
					/* @__PURE__ */ H("div", {
						class: "row",
						children: /* @__PURE__ */ H("div", {
							class: "row-main",
							children: [/* @__PURE__ */ H("div", {
								class: "row-sub",
								children: r("imp.site")
							}), /* @__PURE__ */ H("div", {
								class: "row-title",
								children: s.host || r("wf.hostFromInputs")
							})]
						})
					}),
					/* @__PURE__ */ H("div", {
						class: "row",
						children: [/* @__PURE__ */ H("div", {
							class: "row-main",
							children: [/* @__PURE__ */ H("div", {
								class: "row-sub",
								children: r("imp.steps")
							}), /* @__PURE__ */ H("div", {
								class: "row-title",
								children: r("imp.allValid", { n: s.stepCount })
							})]
						}), /* @__PURE__ */ H("span", {
							class: "st ok",
							children: G.check()
						})]
					}),
					!!e.inputs?.length && /* @__PURE__ */ H("div", {
						class: "row",
						children: /* @__PURE__ */ H("div", {
							class: "row-main",
							children: [/* @__PURE__ */ H("div", {
								class: "row-sub",
								children: r("imp.asksFor")
							}), /* @__PURE__ */ H("div", {
								class: "row-title",
								children: e.inputs.join(", ")
							})]
						})
					})
				]
			}),
			e.existingVersion !== void 0 && /* @__PURE__ */ H(J, {
				kind: "warn",
				children: r("imp.exists", {
					id: s.id,
					v: e.existingVersion,
					next: e.existingVersion + 1
				})
			}),
			/* @__PURE__ */ H("div", {
				class: "actions",
				children: [/* @__PURE__ */ H("button", {
					class: "btn ghost",
					onClick: () => a(!0),
					children: r("common.cancel")
				}), /* @__PURE__ */ H(Y, {
					primary: !0,
					onClick: () => n.open("ui_confirm_import", { pendingId: t }, "replace"),
					children: r("imp.save")
				})]
			})
		]
	});
}
function et({ workflow: e, pendingId: t }) {
	let n = U(), { t: r } = V(), [i, a] = R(e.name);
	return /* @__PURE__ */ H("div", {
		class: "w",
		children: [
			/* @__PURE__ */ H(K, {
				title: e.name,
				sub: r("draft.sub", {
					host: e.host || r("wf.hostFromInputs"),
					n: e.steps.length
				})
			}),
			/* @__PURE__ */ H(vt, {
				steps: e.steps,
				limit: 5
			}),
			e.variables.length > 0 && /* @__PURE__ */ H("div", {
				class: "chips",
				children: [/* @__PURE__ */ H("span", {
					class: "muted",
					children: r("draft.inputs")
				}), e.variables.map((e) => /* @__PURE__ */ H("span", {
					class: "tag",
					children: [e.title, e.required ? " *" : ""]
				}))]
			}),
			/* @__PURE__ */ H(X, {
				heading: r("ask.draftTitle"),
				placeholder: r("ask.phDraft"),
				message: (e) => r("msg.editDraft", { text: e }),
				context: `The user wants to change the draft workflow "${e.name}" (${e.steps.length} steps) that you proposed with propose_workflow. It is not saved yet, so propose_change cannot be used on it. Answer with propose_workflow again, with the whole workflow changed as asked.`
			}, t),
			/* @__PURE__ */ H("div", {
				class: "field",
				children: [/* @__PURE__ */ H("label", {
					for: `name-${t}`,
					children: r("draft.name")
				}), /* @__PURE__ */ H("input", {
					id: `name-${t}`,
					class: "input",
					value: i,
					maxLength: 200,
					onInput: (e) => a(e.target.value)
				})]
			}),
			/* @__PURE__ */ H("div", {
				class: "actions",
				children: [/* @__PURE__ */ H(Y, {
					disabled: !i.trim(),
					onClick: () => n.open("ui_save_draft", {
						pendingId: t,
						name: i.trim()
					}, "replace"),
					children: r("draft.save")
				}), /* @__PURE__ */ H(Y, {
					primary: !0,
					onClick: () => n.open("ui_test_draft", { pendingId: t }, "push"),
					children: [G.play(), r("draft.testRun")]
				})]
			})
		]
	});
}
function tt({ draft: e, primary: t }) {
	let n = U(), { t: r } = V(), [i, a] = R(e.name);
	return /* @__PURE__ */ H("div", {
		class: "draft-save",
		children: [
			/* @__PURE__ */ H("div", {
				class: "muted",
				style: "font-size:12.5px",
				children: r("draft.saveHint")
			}),
			/* @__PURE__ */ H("div", {
				class: "field",
				children: [/* @__PURE__ */ H("label", {
					for: `save-${e.pendingId}`,
					children: r("draft.name")
				}), /* @__PURE__ */ H("input", {
					id: `save-${e.pendingId}`,
					class: "input",
					value: i,
					maxLength: 200,
					onInput: (e) => a(e.target.value)
				})]
			}),
			/* @__PURE__ */ H("div", {
				class: "actions",
				children: /* @__PURE__ */ H(Y, {
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
function nt(e, t) {
	let n = e.errorType ?? e.type, r = e.timeoutMs ? Math.round(e.timeoutMs / 1e3) : void 0;
	return n === "cant_get_web_element_xpath" && e.target ? t("err.notFound", {
		target: e.target,
		s: r
	}) : n === "timeout" && e.target === "run_limit" && e.timeoutMs ? t("err.runLimit", { m: Math.round(e.timeoutMs / 6e3) / 10 }) : n === "timeout" && r ? t("err.timeout", { s: r }) : e.reason ?? e.raw ?? "";
}
function rt({ workflow: e, draft: t }) {
	let n = U(), { t: r } = V(), [i, a] = R(Object.fromEntries(e.variables.map((e) => [e.name, e.default ?? (e.type !== "boolean" && "")]))), [o, s] = R(!1), c = e.variables.filter((e) => e.required), l = e.variables.filter((e) => !e.required), u = c.filter((e) => i[e.name] === "" || i[e.name] === void 0);
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
	let f = (e) => e.type === "boolean" ? /* @__PURE__ */ H("label", {
		class: "check",
		children: [/* @__PURE__ */ H("input", {
			type: "checkbox",
			checked: !!i[e.name],
			onChange: (t) => a({
				...i,
				[e.name]: t.target.checked
			})
		}), e.title]
	}) : /* @__PURE__ */ H("div", {
		class: "field",
		children: [
			/* @__PURE__ */ H("label", {
				for: `v-${e.name}`,
				children: [e.title, e.required ? "" : ` ${r("setupRun.optional")}`]
			}),
			/* @__PURE__ */ H("input", {
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
			o && e.required && u.includes(e) && /* @__PURE__ */ H("span", {
				class: "err",
				children: r("setupRun.required")
			})
		]
	});
	return /* @__PURE__ */ H("div", {
		class: "w",
		children: [
			/* @__PURE__ */ H(K, {
				title: r("setupRun.title", { name: e.name }),
				sub: t ? `${r("draft.testing")} · ${r("lib.steps", { n: e.steps.length })}` : r("setupRun.sub", {
					v: e.version,
					n: e.steps.length
				})
			}),
			/* @__PURE__ */ H("div", {
				class: "stack",
				children: [c.map(f), l.length > 0 && /* @__PURE__ */ H(q, {
					label: r("setupRun.more", { n: l.length }),
					initial: c.length === 0,
					children: /* @__PURE__ */ H("div", {
						class: "stack",
						children: l.map(f)
					})
				})]
			}),
			/* @__PURE__ */ H("div", {
				class: "actions",
				children: /* @__PURE__ */ H(Y, {
					primary: !0,
					onClick: d,
					children: [G.play(), r(t ? "draft.startTest" : "setupRun.start")]
				})
			}),
			t && /* @__PURE__ */ H(tt, { draft: {
				pendingId: t.pendingId,
				name: e.name
			} })
		]
	});
}
function it({ s: e, index: t, isStopAfter: n, runId: r }) {
	let i = U(), { t: a, dur: o } = V(), s = e.state === "ok" ? /* @__PURE__ */ H("span", {
		class: "st ok",
		children: G.check()
	}) : e.state === "failed" ? /* @__PURE__ */ H("span", {
		class: "st bad",
		children: G.x()
	}) : e.state === "running" ? /* @__PURE__ */ H("span", {
		class: "st run",
		children: G.spinner()
	}) : e.state === "waiting" ? /* @__PURE__ */ H("span", {
		class: "st warn",
		children: G.pause()
	}) : e.state === "skipped" ? /* @__PURE__ */ H("span", {
		class: "st pending",
		children: G.skip()
	}) : /* @__PURE__ */ H("span", {
		class: "st pending",
		children: G.circle()
	}), c = e.state === "pending" || e.state === "skipped" ? " is-pending" : e.state === "running" || e.state === "waiting" ? " is-active" : e.state === "failed" ? " is-failed" : "", l = e.state === "ok" || e.state === "failed", u = /* @__PURE__ */ H(C, { children: [
		/* @__PURE__ */ H("span", {
			class: "num",
			children: t + 1
		}),
		s,
		/* @__PURE__ */ H("div", {
			class: "row-main",
			children: /* @__PURE__ */ H("div", {
				class: "row-title",
				children: e.stepName
			})
		}),
		n && /* @__PURE__ */ H("span", {
			class: "tag",
			children: a("run.testStop")
		}),
		/* @__PURE__ */ H("span", {
			class: "row-meta",
			children: l ? o(e.durationMs) : ""
		}),
		l && /* @__PURE__ */ H("span", {
			class: "st pending",
			children: G.chevron()
		})
	] }), d = l ? /* @__PURE__ */ H("button", {
		class: `row${c}`,
		onClick: () => i.open("show_step", {
			runId: r,
			stepId: e.stepId
		}, "push"),
		children: u
	}) : /* @__PURE__ */ H("div", {
		class: `row${c}`,
		children: u
	});
	return e.download ? /* @__PURE__ */ H("div", {
		class: "row-wrap",
		children: [d, /* @__PURE__ */ H("div", {
			class: "row-expand",
			style: "padding-left:44px",
			children: /* @__PURE__ */ H(ot, {
				file: e.download,
				runId: r,
				stepId: e.stepId
			})
		})]
	}) : d;
}
function at(e) {
	if (e < 1024) return `${e} B`;
	let t = [
		"KB",
		"MB",
		"GB"
	], n = e / 1024, r = 0;
	for (; n >= 1024 && r < t.length - 1;) n /= 1024, r++;
	return `${n >= 10 ? Math.round(n) : Math.round(n * 10) / 10} ${t[r]}`;
}
function ot({ file: e, runId: t, stepId: n }) {
	let r = U(), { t: i } = V(), [a, o] = R(!1), s = [e.folder, e.fileName].filter(Boolean).join("/");
	if (!e.done) {
		let t = e.received ?? e.bytes, n = e.total ? Math.min(100, Math.round(t / e.total * 100)) : void 0;
		return /* @__PURE__ */ H("div", {
			class: "stack",
			style: "gap:4px;width:100%",
			children: [/* @__PURE__ */ H("div", {
				class: "row-sub",
				children: [
					i("dl.saving", { name: s }),
					" ",
					e.total ? `${at(t)} / ${at(e.total)}` : at(t)
				]
			}), /* @__PURE__ */ H("div", {
				class: "bar",
				children: n === void 0 ? /* @__PURE__ */ H("i", { style: { width: "30%" } }) : /* @__PURE__ */ H("i", { style: { width: `${n}%` } })
			})]
		});
	}
	return /* @__PURE__ */ H("div", {
		style: "display:flex;gap:8px;align-items:center;width:100%",
		children: [/* @__PURE__ */ H("div", {
			class: "row-main",
			children: [/* @__PURE__ */ H("div", {
				class: "row-title",
				title: s,
				children: i("dl.saved", { name: s })
			}), /* @__PURE__ */ H("div", {
				class: "row-sub",
				children: a ? i("dl.gone") : at(e.bytes)
			})]
		}), /* @__PURE__ */ H(Y, {
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
function st({ run: e }) {
	let t = e.steps.filter((e) => e.download);
	return t.length ? /* @__PURE__ */ H("div", {
		class: "list",
		children: t.map((t) => /* @__PURE__ */ H("div", {
			class: "row",
			children: /* @__PURE__ */ H(ot, {
				file: t.download,
				runId: e.runId,
				stepId: t.stepId
			})
		}))
	}) : null;
}
function ct(e, t) {
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
function lt({ run: e }) {
	let { t } = V();
	return /* @__PURE__ */ H(q, {
		label: t("run.steps", { n: e.steps.length }),
		children: /* @__PURE__ */ H("div", {
			class: "list",
			children: e.steps.map((t, n) => /* @__PURE__ */ H(it, {
				s: t,
				index: n,
				runId: e.runId,
				isStopAfter: t.stepId === e.stopAfterStepId
			}))
		})
	});
}
function ut({ run: e }) {
	let t = U(), { t: n, dur: r } = V(), [i, a] = R(e), [o, s] = R(!1), c = B(), l = B(e.status === "running" || e.status === "waiting_manual");
	z(() => a(e), [e]);
	let u = i.status === "running" || i.status === "waiting_manual", d = i.live?.url, f = B(i.status);
	if (f.current = i.status, z(() => {
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
	]), z(() => {
		if (u || !l.current || c.current === i.status) return;
		c.current = i.status;
		let e = i.failure;
		t.bridge.updateContext(e ? `Run ${i.runId} of ${i.workflowName} failed at step ${e.stepIndex + 1} "${e.stepName}": ${e.reason}` : `Run ${i.runId} of ${i.workflowName} finished: ${i.status}${i.result ? `, ${i.result.rows} rows` : ""}`).catch(() => {});
	}, [i.status]), i.status === "failure") return /* @__PURE__ */ H(dt, { run: i });
	let p = i.steps.filter((e) => e.state === "ok").length, m = i.stopAfterStepId ? i.steps.findIndex((e) => e.stepId === i.stopAfterStepId) + 1 : i.steps.length, h = i.steps.reduce((e, t) => e + (t.durationMs ?? 0), 0), g = () => i.draft ? t.open("ui_test_draft", {
		pendingId: i.draft.pendingId,
		variables: i.variables
	}, "replace") : t.open("run_workflow", {
		id: i.workflowId,
		variables: i.variables
	}, "replace"), _ = i.draft && /* @__PURE__ */ H(tt, {
		draft: i.draft,
		primary: i.status === "success"
	}, i.runId), v = t.canBack && /* @__PURE__ */ H("button", {
		class: "back",
		onClick: t.back,
		children: n("common.back")
	});
	if (i.status === "success") {
		let e = i.stopAfterStepId;
		return /* @__PURE__ */ H("div", {
			class: "w",
			children: [
				v,
				/* @__PURE__ */ H("div", {
					class: "result",
					children: [/* @__PURE__ */ H("span", {
						class: "big ok",
						children: G.check()
					}), /* @__PURE__ */ H("div", {
						class: "hd-main",
						children: [/* @__PURE__ */ H("div", {
							class: "title",
							children: e ? n("run.changeWorks", { n: m }) : n("run.done", { n: i.steps.length })
						}), /* @__PURE__ */ H("div", {
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
				/* @__PURE__ */ H(st, { run: i }),
				/* @__PURE__ */ H(lt, { run: i }),
				/* @__PURE__ */ H(X, {
					heading: n("ask.runTitle"),
					placeholder: n("ask.phRun"),
					message: (e) => n("msg.aboutRun", {
						runId: i.runId,
						text: e
					}),
					context: `The user is asking about run ${i.runId} of workflow "${i.workflowName}" (id ${i.workflowId}, v${i.version}), which finished OK${e ? " (a test that stopped after one step on purpose)" : ""}. Read it with get_run and get_run_data, and a step with get_step. If the workflow should change, answer with propose_change.`
				}, i.runId),
				/* @__PURE__ */ H("div", {
					class: "actions",
					children: e ? /* @__PURE__ */ H(Y, {
						primary: !0,
						onClick: g,
						children: [G.play(), n("run.runFull")]
					}) : /* @__PURE__ */ H(C, { children: [/* @__PURE__ */ H(Y, {
						ghost: !0,
						onClick: g,
						children: n(i.draft ? "draft.testAgain" : "run.runAgain")
					}), /* @__PURE__ */ H(Y, {
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
		return /* @__PURE__ */ H("div", {
			class: "w",
			children: [
				v,
				/* @__PURE__ */ H("div", {
					class: "result",
					children: [/* @__PURE__ */ H("span", {
						class: "big",
						style: "background:var(--bg-2);color:var(--fg-2)",
						children: G.skip()
					}), /* @__PURE__ */ H("div", {
						class: "hd-main",
						children: [/* @__PURE__ */ H("div", {
							class: "title",
							children: n("run.stoppedAt", { n: e + 1 })
						}), /* @__PURE__ */ H("div", {
							class: "sub",
							children: [
								i.workflowName,
								" ",
								i.version === 0 ? `· ${n("draft.testing")}` : `v${i.version}`
							]
						})]
					})]
				}),
				/* @__PURE__ */ H(lt, { run: i }),
				/* @__PURE__ */ H("div", {
					class: "actions",
					children: /* @__PURE__ */ H(Y, {
						primary: !i.draft,
						onClick: g,
						children: n(i.draft ? "draft.testAgain" : "run.runAgain")
					})
				}),
				_
			]
		});
	}
	let y = ct(i.steps, o), b = async (e) => {
		let n = await t.bridge.call(e, { runId: i.runId });
		"run" in n.payload && a(n.payload.run);
	};
	return /* @__PURE__ */ H("div", {
		class: "w",
		children: [
			/* @__PURE__ */ H(K, {
				title: i.workflowName,
				sub: /* @__PURE__ */ H(C, { children: [i.version === 0 ? n("draft.testing") : `v${i.version}`, i.stopAfterStepId ? ` · ${n("run.testing")}` : ""] }),
				right: /* @__PURE__ */ H(We, { status: i.status })
			}),
			/* @__PURE__ */ H("div", {
				class: "stack",
				style: "gap:6px",
				children: [/* @__PURE__ */ H("div", {
					class: "bar",
					children: /* @__PURE__ */ H("i", { style: { width: `${Math.round(p / m * 100)}%` } })
				}), /* @__PURE__ */ H("div", {
					class: "muted",
					children: n("run.progress", {
						done: p,
						total: m
					})
				})]
			}),
			i.manual && /* @__PURE__ */ H(J, {
				kind: "warn",
				children: n("run.manual", { instruction: i.manual.instruction })
			}),
			/* @__PURE__ */ H("div", {
				class: "list",
				children: [
					y[0]?.i > 0 && /* @__PURE__ */ H("div", {
						class: "row is-pending",
						children: [/* @__PURE__ */ H("span", { class: "num" }), /* @__PURE__ */ H("span", {
							class: "muted",
							children: n("run.earlier", { n: y[0].i })
						})]
					}),
					y.map(({ s: e, i: t }) => /* @__PURE__ */ H(it, {
						s: e,
						index: t,
						runId: i.runId,
						isStopAfter: e.stepId === i.stopAfterStepId
					})),
					!o && y.length < i.steps.length && /* @__PURE__ */ H("button", {
						class: "more",
						onClick: () => s(!0),
						children: n("common.showAll", { n: i.steps.length })
					})
				]
			}),
			/* @__PURE__ */ H("div", {
				class: "actions",
				children: i.manual ? /* @__PURE__ */ H(C, { children: [/* @__PURE__ */ H(Y, {
					ghost: !0,
					onClick: () => b("ui_stop_run"),
					children: n("run.stop")
				}), /* @__PURE__ */ H(Y, {
					primary: !0,
					onClick: () => b("ui_resume_manual"),
					children: n("run.resume")
				})] }) : /* @__PURE__ */ H(Y, {
					onClick: () => b("ui_stop_run"),
					children: n("run.stopRun")
				})
			}),
			_
		]
	});
}
function dt({ run: e, inspecting: t }) {
	let n = U(), { t: r } = V(), i = e.failure, a = nt(i, r), o = e.version === 0 ? `Test run ${e.runId} of the proposed workflow "${e.workflowName}" (id ${e.workflowId}, not saved yet) failed at step ${i.stepIndex + 1} [${i.stepId}] "${i.stepName}". Call get_failure("${e.runId}") for the error, screenshot and HTML, then answer with propose_workflow: the whole workflow, fixed (propose_change cannot be used, it is not saved).` : `Run ${e.runId} of workflow "${e.workflowName}" (id ${e.workflowId}, v${e.version}) failed at step ${i.stepIndex + 1} [${i.stepId}] "${i.stepName}". Call get_failure("${e.runId}") for the error, screenshot and HTML, then propose_change with runId "${e.runId}".`, s = () => e.draft ? n.open("ui_test_draft", {
		pendingId: e.draft.pendingId,
		variables: e.variables
	}, "replace") : n.open("run_workflow", {
		id: e.workflowId,
		variables: e.variables
	}, "replace"), c = i.errorType === "browser_unavailable";
	return /* @__PURE__ */ H("div", {
		class: "w",
		children: [
			/* @__PURE__ */ H(K, {
				title: r("fail.title", {
					n: i.stepIndex + 1,
					total: e.steps.length
				}),
				sub: `${e.workflowName} · ${e.version === 0 ? r("draft.testing") : `v${e.version}`}`,
				right: /* @__PURE__ */ H(We, { status: "failure" })
			}),
			/* @__PURE__ */ H("div", {
				class: "stack",
				style: "gap:4px",
				children: [/* @__PURE__ */ H("div", {
					class: "row-title",
					children: i.stepName
				}), /* @__PURE__ */ H("div", {
					style: "color:var(--bad);font-size:13px",
					children: a
				})]
			}),
			i.hasScreenshot && /* @__PURE__ */ H(qe, {
				runId: e.runId,
				stepId: i.stepId,
				alt: r("fail.shotAlt", { n: i.stepIndex + 1 })
			}),
			/* @__PURE__ */ H(lt, { run: e }),
			/* @__PURE__ */ H(q, {
				label: r("common.details"),
				children: [
					/* @__PURE__ */ H("dl", {
						class: "kv",
						children: [
							/* @__PURE__ */ H("dt", { children: r("fail.url") }),
							/* @__PURE__ */ H("dd", {
								class: "mono",
								children: i.url
							}),
							/* @__PURE__ */ H("dt", { children: r("fail.error") }),
							/* @__PURE__ */ H("dd", {
								class: "mono",
								children: i.errorType
							}),
							/* @__PURE__ */ H("dt", { children: r("fail.console") }),
							/* @__PURE__ */ H("dd", { children: i.consoleErrors.length ? i.consoleErrors.join("; ") : r("fail.noErrors") })
						]
					}),
					/* @__PURE__ */ H("pre", {
						class: "code",
						children: i.stack
					}),
					/* @__PURE__ */ H("pre", {
						class: "code",
						children: JSON.stringify(i.variables, null, 2)
					})
				]
			}),
			t ? /* @__PURE__ */ H(J, {
				kind: "info",
				children: r("fail.inspecting")
			}) : c ? /* @__PURE__ */ H("div", {
				class: "actions",
				children: /* @__PURE__ */ H(Y, {
					primary: !0,
					onClick: s,
					children: r(e.draft ? "draft.testAgain" : "run.runAgain")
				})
			}) : /* @__PURE__ */ H(C, { children: [/* @__PURE__ */ H(X, {
				label: r("ask.fix"),
				allowEmpty: !0,
				placeholder: r("ask.phFailed"),
				message: (t) => t ? `${r("msg.fixRun", { runId: e.runId })} ${t}` : r("msg.fixRun", { runId: e.runId }),
				context: o
			}, e.runId), /* @__PURE__ */ H("div", {
				class: "actions",
				children: /* @__PURE__ */ H(Y, {
					ghost: !0,
					onClick: s,
					children: r(e.draft ? "draft.testAgain" : "run.runAgain")
				})
			})] }),
			e.draft && /* @__PURE__ */ H(tt, { draft: e.draft }, e.runId)
		]
	});
}
// ui/views/runs.tsx
var ft = 5;
function pt({ runs: e }) {
	let t = U(), { t: n, ago: r, dur: i } = V(), [a, o] = R(!1);
	if (!e.length) return /* @__PURE__ */ H("div", {
		class: "empty",
		children: n("runs.none")
	});
	let s = a ? e : e.slice(0, ft), c = (e) => e.status === "success" ? e.testUntilStep ? n("runs.testPassed", { n: e.testUntilStep }) : n("runs.done", { n: e.stepCount }) : e.status === "failure" ? n("runs.failedAt", {
		n: e.atStep,
		name: e.atStepName
	}) : e.status === "stopped" ? n("runs.stoppedAt", { n: e.atStep }) : e.status === "waiting_manual" ? n("runs.waiting") : n("runs.runningAt", { n: e.atStep });
	return /* @__PURE__ */ H("div", {
		class: "list",
		children: [s.map((e) => /* @__PURE__ */ H("button", {
			class: "row",
			onClick: () => t.open("show_run", { runId: e.runId }, "push"),
			children: [
				/* @__PURE__ */ H(Ge, { status: e.status }),
				/* @__PURE__ */ H("div", {
					class: "row-main",
					children: [/* @__PURE__ */ H("div", {
						class: "row-title",
						children: c(e)
					}), /* @__PURE__ */ H("div", {
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
				/* @__PURE__ */ H("span", {
					class: "row-meta",
					children: i(e.durationMs)
				})
			]
		})), !a && e.length > ft && /* @__PURE__ */ H("button", {
			class: "more",
			onClick: () => o(!0),
			children: n("common.showAll", { n: e.length })
		})]
	});
}
function mt({ workflowName: e, runs: t }) {
	let { t: n } = V();
	return /* @__PURE__ */ H("div", {
		class: "w",
		children: [/* @__PURE__ */ H(K, {
			title: n("runs.title"),
			sub: e
		}), /* @__PURE__ */ H(pt, { runs: t })]
	});
}
function ht({ step: e }) {
	let { t, dur: n } = V(), r = e.state === "failed", i = e.error ? nt(e.error, t) : void 0, a = e.state === "ok" ? /* @__PURE__ */ H(We, { status: "success" }) : r ? /* @__PURE__ */ H(We, { status: "failure" }) : /* @__PURE__ */ H("span", {
		class: "pill muted",
		children: t(e.state === "skipped" ? "sr.skipped" : e.state === "waiting" ? "sr.waiting" : e.state === "running" ? "sr.running" : "sr.notReached")
	}), o = t(`stepType.${e.stepType}`);
	return /* @__PURE__ */ H("div", {
		class: "w",
		children: [
			/* @__PURE__ */ H(K, {
				title: `${e.stepIndex + 1}. ${e.stepName}`,
				sub: `${e.workflowName} · v${e.version} · ${e.runId}${e.durationMs === void 0 ? "" : ` · ${n(e.durationMs)}`}`,
				right: a
			}),
			/* @__PURE__ */ H("div", {
				class: "mono muted",
				style: "overflow-wrap:anywhere",
				children: [
					o,
					" · ",
					e.detail
				]
			}),
			i && /* @__PURE__ */ H("div", {
				style: "color:var(--bad);font-size:13px",
				children: i
			}),
			e.download && /* @__PURE__ */ H("div", {
				class: "list",
				children: /* @__PURE__ */ H("div", {
					class: "row",
					children: /* @__PURE__ */ H(ot, {
						file: e.download,
						runId: e.runId,
						stepId: e.stepId
					})
				})
			}),
			e.hasScreenshot && /* @__PURE__ */ H(qe, {
				runId: e.runId,
				stepId: e.stepId,
				alt: t("sr.alt", { n: e.stepIndex + 1 })
			}),
			e.output && /* @__PURE__ */ H(q, {
				label: t("common.output"),
				initial: e.stepType === "extractData",
				children: /* @__PURE__ */ H("pre", {
					class: "code",
					children: e.output
				})
			}),
			e.apiCalls && /* @__PURE__ */ H(q, {
				label: t("sr.requests", { n: e.apiCallCount ?? e.apiCalls.length }),
				children: /* @__PURE__ */ H("pre", {
					class: "code",
					children: e.apiCalls.map((e) => `${e.method} ${e.url}`).join("\n")
				})
			}),
			/* @__PURE__ */ H(q, {
				label: t("common.details"),
				children: [/* @__PURE__ */ H("dl", {
					class: "kv",
					children: [
						e.url && /* @__PURE__ */ H(C, { children: [/* @__PURE__ */ H("dt", { children: t("fail.url") }), /* @__PURE__ */ H("dd", {
							class: "mono",
							children: e.url
						})] }),
						/* @__PURE__ */ H("dt", { children: t("sr.stepId") }),
						/* @__PURE__ */ H("dd", {
							class: "mono",
							children: e.stepId
						})
					]
				}), /* @__PURE__ */ H("pre", {
					class: "code",
					children: JSON.stringify(e.variablesBefore, null, 2)
				})]
			}),
			e.state === "ok" || r ? /* @__PURE__ */ H(X, {
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
			}) : /* @__PURE__ */ H("div", {
				class: "muted",
				children: [
					G.circle(),
					" ",
					t("sr.didntRun")
				]
			})
		]
	});
}
// ui/views/workflow.tsx
var gt = 6, _t = {
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
function vt({ steps: e, limit: t = gt, workflow: n }) {
	let { t: r } = V(), [i, a] = R(), [o, s] = R(!1);
	return /* @__PURE__ */ H("div", {
		class: "list",
		children: [(o ? e : e.slice(0, t)).map((e, t) => {
			let o = r(`stepType.${e.stepType}`), s = e.detail.startsWith("waitFor") ? ["sug.stableSelector", "sug.waitLonger"] : _t[e.stepType];
			return /* @__PURE__ */ H("div", {
				class: "row-wrap",
				children: [/* @__PURE__ */ H("button", {
					class: "row",
					"aria-expanded": i === e.id,
					onClick: () => a(i === e.id ? void 0 : e.id),
					children: [
						/* @__PURE__ */ H("span", {
							class: "num",
							children: t + 1
						}),
						/* @__PURE__ */ H(Ue, { type: e.stepType }),
						/* @__PURE__ */ H("div", {
							class: "row-main",
							children: [/* @__PURE__ */ H("div", {
								class: "row-title",
								children: e.stepName
							}), /* @__PURE__ */ H("div", {
								class: "row-sub mono",
								children: e.detail
							})]
						})
					]
				}), i === e.id && /* @__PURE__ */ H("div", {
					class: "row-expand",
					children: [
						/* @__PURE__ */ H("div", { children: [
							/* @__PURE__ */ H("span", {
								class: "tag",
								children: o
							}),
							" ",
							/* @__PURE__ */ H("span", {
								class: "mono",
								children: e.id
							})
						] }),
						e.description && /* @__PURE__ */ H("div", { children: e.description }),
						e.code && /* @__PURE__ */ H("pre", {
							class: "code",
							children: e.code
						}),
						n && /* @__PURE__ */ H(X, {
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
		}), !o && e.length > t && /* @__PURE__ */ H("button", {
			class: "more",
			onClick: () => s(!0),
			children: r("common.showAll", { n: e.length })
		})]
	});
}
function yt(e, t) {
	return e.kind === "saved" ? t("wf.saved", { v: e.version }) : e.kind === "restored" ? t("wf.restored", {
		v: e.version,
		from: e.from
	}) : t("wf.discarded", { v: e.version });
}
async function bt(e, t, n) {
	let r = await e.bridge.call("get_workflow", { id: t }), i = r.text.indexOf("Full definition:\n");
	if (r.isError || i < 0) return;
	let a = r.text.slice(i + 17, r.text.lastIndexOf("}") + 1);
	await e.bridge.download(`${n.toLowerCase().replace(/\W+/g, "-") || t}.json`, "application/json", a);
}
function xt({ workflow: e, notice: t }) {
	let n = U(), { t: r } = V(), [i, a] = R("steps"), [o, s] = R();
	return z(() => {
		i !== "runs" || o || n.bridge.call("list_runs", { workflowId: e.id }).then((e) => {
			e.payload.view === "runs" && s(e.payload.runs);
		});
	}, [i]), /* @__PURE__ */ H("div", {
		class: "w",
		children: [
			/* @__PURE__ */ H(K, {
				title: e.name,
				sub: `${e.host || r("wf.hostFromInputs")} · v${e.version}`,
				right: /* @__PURE__ */ H(Ke, { items: [{
					label: r("wf.history"),
					onClick: () => n.open("show_history", { id: e.id }, "push")
				}, {
					label: r("wf.export"),
					onClick: () => bt(n, e.id, e.name)
				}] })
			}),
			t && /* @__PURE__ */ H(J, {
				kind: t.kind === "discarded" ? "info" : "ok",
				children: yt(t, r)
			}),
			/* @__PURE__ */ H("div", {
				class: "seg",
				role: "group",
				children: [/* @__PURE__ */ H("button", {
					"aria-pressed": i === "steps",
					onClick: () => a("steps"),
					children: r("wf.stepsTab", { n: e.steps.length })
				}), /* @__PURE__ */ H("button", {
					"aria-pressed": i === "runs",
					onClick: () => a("runs"),
					children: r("wf.runsTab")
				})]
			}),
			i === "steps" ? /* @__PURE__ */ H(vt, {
				steps: e.steps,
				workflow: e
			}) : o ? /* @__PURE__ */ H(pt, { runs: o }) : /* @__PURE__ */ H("div", {
				class: "stack",
				"aria-busy": "true",
				children: [/* @__PURE__ */ H("div", { class: "skel" }), /* @__PURE__ */ H("div", { class: "skel" })]
			}),
			/* @__PURE__ */ H(X, {
				heading: r("ask.wfTitle"),
				placeholder: r("ask.phWorkflow"),
				message: (t) => r("msg.editWorkflow", {
					id: e.id,
					text: t
				}),
				context: `The user wants to change workflow "${e.name}" (id ${e.id}, v${e.version}) as a whole, not one step. Read it with get_workflow, explore the site with the page_* inspector tools when the change needs new selectors or code, then answer with propose_change.`
			}, e.id),
			/* @__PURE__ */ H("div", {
				class: "actions",
				children: /* @__PURE__ */ H(Y, {
					primary: !0,
					onClick: () => n.open("run_workflow", {
						id: e.id,
						form: !0
					}, "push"),
					children: [G.play(), r("wf.run")]
				})
			})
		]
	});
}
// ui/views/misc.tsx
function St(e) {
	let t = U(), { t: n } = V(), [r, i] = R(!1);
	return r ? /* @__PURE__ */ H("div", {
		class: "w",
		children: /* @__PURE__ */ H(J, {
			kind: "info",
			children: n(e.isFix ? "chg.discardedFix" : "chg.discardedChange", {
				name: e.workflowName,
				v: e.fromVersion
			})
		})
	}) : /* @__PURE__ */ H("div", {
		class: "w",
		children: [
			/* @__PURE__ */ H(K, {
				title: n(e.isFix ? "chg.fixTitle" : "chg.changeTitle"),
				sub: `${e.workflowName} · v${e.fromVersion} → v${e.fromVersion + 1}`
			}),
			/* @__PURE__ */ H("div", {
				style: "font-size:13px",
				children: e.reason
			}),
			/* @__PURE__ */ H("div", {
				class: "list",
				children: e.changes.map((e) => /* @__PURE__ */ H("div", {
					class: "row-wrap",
					style: "padding:8px 10px;display:flex;flex-direction:column;gap:6px",
					children: [/* @__PURE__ */ H("div", {
						class: "row-title",
						children: [
							e.stepName,
							" ",
							/* @__PURE__ */ H("span", {
								class: "tag",
								children: n(`chg.${e.kind}`)
							})
						]
					}), /* @__PURE__ */ H("div", {
						class: "diff",
						children: [e.before && /* @__PURE__ */ H("div", {
							class: "del",
							"aria-label": n("chg.before"),
							children: e.before
						}), e.after && /* @__PURE__ */ H("div", {
							class: "add",
							"aria-label": n("chg.after"),
							children: e.after
						})]
					})]
				}))
			}),
			/* @__PURE__ */ H("div", {
				class: "actions",
				children: [/* @__PURE__ */ H(Y, {
					ghost: !0,
					onClick: async () => {
						await t.bridge.call("ui_discard_change", { pendingId: e.pendingId }), i(!0);
					},
					children: n("chg.discard")
				}), /* @__PURE__ */ H(Y, {
					primary: !0,
					onClick: () => t.open("ui_apply_change", { pendingId: e.pendingId }, "replace"),
					children: [G.play(), n("chg.apply")]
				})]
			})
		]
	});
}
function Ct(e, t) {
	let n = (e) => {
		let t = e == null ? "" : typeof e == "object" ? JSON.stringify(e) : String(e);
		return /[",\n]/.test(t) ? `"${t.replace(/"/g, "\"\"")}"` : t;
	};
	return [e.join(","), ...t.map((t) => e.map((e) => n(t[e])).join(","))].join("\n");
}
function wt(e) {
	let t = U(), { t: n } = V(), [r, i] = R(!1), a = e.columns.slice(0, 3), o = r ? e.rows : e.rows.slice(0, 5), s = e.workflowName.toLowerCase().replace(/\W+/g, "-");
	return /* @__PURE__ */ H("div", {
		class: "w",
		children: [
			/* @__PURE__ */ H(K, {
				title: n("data.items", { n: e.total }),
				sub: `${e.workflowName} · ${e.runId}`
			}),
			/* @__PURE__ */ H("div", {
				class: "tbl-wrap",
				children: /* @__PURE__ */ H("table", { children: [/* @__PURE__ */ H("thead", { children: /* @__PURE__ */ H("tr", { children: a.map((e) => /* @__PURE__ */ H("th", { children: e })) }) }), /* @__PURE__ */ H("tbody", { children: o.map((e) => /* @__PURE__ */ H("tr", { children: a.map((t) => /* @__PURE__ */ H("td", {
					title: String(e[t] ?? ""),
					children: String(e[t] ?? "")
				})) })) })] })
			}),
			e.rows.length > 5 && !r || e.columns.length > 3 ? /* @__PURE__ */ H("div", {
				class: "actions",
				style: "justify-content:flex-start",
				children: [e.rows.length > 5 && !r && /* @__PURE__ */ H("button", {
					class: "link",
					onClick: () => i(!0),
					children: n("common.showAll", { n: e.total })
				}), e.columns.length > 3 && /* @__PURE__ */ H("span", {
					class: "muted",
					children: n("data.extraCols", { n: e.columns.length - 3 })
				})]
			}) : null,
			/* @__PURE__ */ H("div", {
				class: "actions",
				children: [/* @__PURE__ */ H(Y, {
					ghost: !0,
					onClick: () => t.bridge.download(`${s}.json`, "application/json", JSON.stringify(e.rows, null, 2)),
					children: n("data.json")
				}), /* @__PURE__ */ H(Y, {
					primary: !0,
					onClick: () => t.bridge.download(`${s}.csv`, "text/csv", Ct(e.columns, e.rows)),
					children: n("data.csv")
				})]
			})
		]
	});
}
function Tt(e, t) {
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
function Et(e) {
	let t = U(), { t: n, ago: r } = V(), [i, a] = R(), [o, s] = R(!1), c = o ? e.versions : e.versions.slice(0, 5);
	return /* @__PURE__ */ H("div", {
		class: "w",
		children: [
			/* @__PURE__ */ H(K, {
				title: n("hist.title"),
				sub: e.workflowName
			}),
			/* @__PURE__ */ H("div", {
				class: "list",
				children: [c.map((o) => /* @__PURE__ */ H("div", {
					class: "row-wrap",
					children: [/* @__PURE__ */ H("button", {
						class: "row",
						disabled: o.current,
						"aria-expanded": i === o.version,
						onClick: () => a(i === o.version ? void 0 : o.version),
						children: [
							/* @__PURE__ */ H("span", {
								class: "tag",
								style: "flex:none",
								children: ["v", o.version]
							}),
							/* @__PURE__ */ H("div", {
								class: "row-main",
								children: [/* @__PURE__ */ H("div", {
									class: "row-title",
									children: Tt(o.event, n)
								}), /* @__PURE__ */ H("div", {
									class: "row-sub",
									children: [
										n(`hist.who.${o.author}`),
										" · ",
										r(o.at)
									]
								})]
							}),
							o.current ? /* @__PURE__ */ H("span", {
								class: "pill ok",
								children: n("hist.current")
							}) : /* @__PURE__ */ H("span", {
								class: "st pending",
								children: G.chevron()
							})
						]
					}), i === o.version && /* @__PURE__ */ H("div", {
						class: "row-expand",
						style: "padding-left:10px;align-items:flex-end",
						children: /* @__PURE__ */ H(Y, {
							primary: !0,
							onClick: () => t.open("ui_restore_version", {
								id: e.workflowId,
								version: o.version
							}, "replace"),
							children: n("hist.restore", { v: o.version })
						})
					})]
				})), !o && e.versions.length > 5 && /* @__PURE__ */ H("button", {
					class: "more",
					onClick: () => s(!0),
					children: n("common.showAll", { n: e.versions.length })
				})]
			}),
			e.versions.length === 1 && /* @__PURE__ */ H("div", {
				class: "muted",
				children: n("hist.onlyOne")
			})
		]
	});
}
function Dt({ compact: e = !1 }) {
	let t = U(), { t: n, lang: r } = V(), i = e ? ["en", "vi"] : [
		"auto",
		"en",
		"vi"
	], a = (n) => e ? r === n : t.langPref === n;
	return /* @__PURE__ */ H("div", {
		class: `seg${e ? " seg-sm" : ""}`,
		role: "group",
		"aria-label": n("lang.label"),
		children: i.map((r) => /* @__PURE__ */ H("button", {
			"aria-pressed": a(r),
			onClick: () => t.setLang(r),
			title: r === "auto" ? void 0 : n(`lang.${r}`),
			children: e ? r.toUpperCase() : n(`lang.${r}`)
		}))
	});
}
function Ot(e) {
	return e.account.page === void 0 ? /* @__PURE__ */ H(Mt, { ...e }) : /* @__PURE__ */ H(jt, { ...e });
}
function kt({ label: e, used: t, limit: n }) {
	return /* @__PURE__ */ H("div", {
		class: "meter",
		children: [/* @__PURE__ */ H("div", {
			class: "meter-top",
			children: [/* @__PURE__ */ H("span", { children: e }), /* @__PURE__ */ H("span", { children: n ? `${t} / ${n}` : t })]
		}), n > 0 && /* @__PURE__ */ H("div", {
			class: `bar${t / n > .9 ? " bad" : ""}`,
			children: /* @__PURE__ */ H("i", { style: { width: `${Math.min(100, t / n * 100)}%` } })
		})]
	});
}
function At({ a: e, limit: t, upgrade: n }) {
	let { t: r } = V(), i = e.usage, a = t.code.startsWith("limit_runs_") ? /* @__PURE__ */ H(kt, {
		label: r(`acct.runs.${i.period}`),
		used: i.runs,
		limit: i.runsLimit
	}) : t.code.startsWith("limit_steps_") && i.steps !== void 0 ? /* @__PURE__ */ H(kt, {
		label: r(`acct.steps.${i.period}`),
		used: i.steps,
		limit: i.stepsLimit ?? 0
	}) : t.code === "limit_workflows" ? /* @__PURE__ */ H(kt, {
		label: r("acct.workflows"),
		used: i.workflows,
		limit: i.workflowsLimit
	}) : null;
	return /* @__PURE__ */ H(C, { children: [/* @__PURE__ */ H(J, {
		kind: "warn",
		children: [r(`error.${t.code}`, { arg: t.arg ?? "" }), n ? ` ${r("acct.limitUpgrade")}` : ""]
	}), a && /* @__PURE__ */ H("div", {
		class: "stack",
		children: a
	})] });
}
function jt({ account: e, limit: t, retry: n }) {
	let r = U(), { t: i } = V(), a = e.plan === "paid", [o, s] = R(!1), c = async () => {
		let e = await r.bridge.call("ui_account_page");
		e.payload.url && await r.bridge.openLink(e.payload.url);
	};
	if (e.anonymous) return /* @__PURE__ */ H("div", {
		class: "w",
		children: [
			/* @__PURE__ */ H(K, {
				title: i("acct.title"),
				sub: i("acct.trying"),
				right: /* @__PURE__ */ H(Dt, { compact: !0 })
			}),
			t && /* @__PURE__ */ H(At, {
				a: e,
				limit: t,
				upgrade: !1
			}),
			/* @__PURE__ */ H("div", {
				class: "muted",
				children: i("acct.tryingHint")
			}),
			/* @__PURE__ */ H("div", {
				class: "actions",
				children: /* @__PURE__ */ H(Y, {
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
	return /* @__PURE__ */ H("div", {
		class: "w",
		children: [
			/* @__PURE__ */ H(K, {
				title: e.name || i("acct.title"),
				sub: a ? e.paidUntil ? i("acct.until", { date: e.paidUntil.slice(0, 10) }) : i("acct.planLife") : i("acct.planFree"),
				right: e.page ? /* @__PURE__ */ H("span", {
					class: `pill ${a ? "ok" : "muted"}`,
					children: i(a ? "acct.pro" : "acct.free")
				}) : /* @__PURE__ */ H(Dt, { compact: !0 })
			}),
			t && /* @__PURE__ */ H(At, {
				a: e,
				limit: t,
				upgrade: !!l
			}),
			t && n && o && /* @__PURE__ */ H("div", {
				class: "actions",
				children: /* @__PURE__ */ H(Y, {
					onClick: () => r.open(n.tool, n.args, "replace"),
					children: i("acct.tryAgain")
				})
			}),
			(l || e.page) && /* @__PURE__ */ H("div", {
				class: "actions",
				children: [l && e.page && /* @__PURE__ */ H("button", {
					class: "link",
					style: "margin-right:auto",
					onClick: c,
					children: i("acct.details")
				}), l ? /* @__PURE__ */ H(Y, {
					primary: !0,
					onClick: async () => {
						await r.bridge.openLink(e.links.upgrade), s(!0);
					},
					children: i("acct.upgrade")
				}) : /* @__PURE__ */ H(Y, {
					onClick: c,
					children: i("acct.details")
				})]
			})
		]
	});
}
function Mt({ account: e, limit: t, retry: n }) {
	let r = U(), { t: i } = V(), [a, o] = R(!1), s = (e.plan === "free" || e.paidUntil) && e.links?.upgrade, c = (e, t, n) => /* @__PURE__ */ H(kt, {
		label: e,
		used: t,
		limit: n
	}), l = i("acct.storage.computer"), u = e.storage.kind === "computer" ? e.storage : void 0;
	return /* @__PURE__ */ H("div", {
		class: "w",
		children: [
			/* @__PURE__ */ H(K, {
				title: i("acct.title"),
				sub: e.anonymous ? i("acct.anonymous") : [e.name, e.paidUntil ? i("acct.until", { date: e.paidUntil.slice(0, 10) }) : ""].filter(Boolean).join(" · ") || void 0,
				right: /* @__PURE__ */ H("span", {
					class: `pill ${e.plan === "paid" ? "ok" : "muted"}`,
					children: e.plan === "paid" ? i("acct.pro") : i("acct.free")
				})
			}),
			e.offline && /* @__PURE__ */ H(J, {
				kind: "warn",
				children: i("acct.offline")
			}),
			t && /* @__PURE__ */ H(At, {
				a: e,
				limit: t,
				upgrade: !!s
			}),
			t && n && a && /* @__PURE__ */ H("div", {
				class: "actions",
				children: /* @__PURE__ */ H(Y, {
					onClick: () => r.open(n.tool, n.args, "replace"),
					children: i("acct.tryAgain")
				})
			}),
			/* @__PURE__ */ H("div", {
				class: "stack",
				children: [
					c(i(`acct.runs.${e.usage.period}`), e.usage.runs, e.usage.runsLimit),
					e.usage.steps !== void 0 && c(i(`acct.steps.${e.usage.period}`), e.usage.steps, e.usage.stepsLimit ?? 0),
					c(i("acct.workflows"), e.usage.workflows, e.usage.workflowsLimit)
				]
			}),
			/* @__PURE__ */ H("div", {
				class: "list",
				children: [
					e.anonymous && /* @__PURE__ */ H(Nt, { refresh: !0 }),
					e.anonymous && e.name && /* @__PURE__ */ H("div", {
						class: "row",
						style: "flex-direction:column;align-items:stretch;gap:8px",
						children: [/* @__PURE__ */ H("div", {
							class: "row-main",
							children: /* @__PURE__ */ H("div", {
								class: "row-sub",
								style: "white-space:normal",
								children: i("acct.loginHint")
							})
						}), /* @__PURE__ */ H("div", { children: /* @__PURE__ */ H(Y, {
							onClick: () => r.open("ui_sign_in", {}, "replace"),
							children: i("acct.login")
						}) })]
					}),
					/* @__PURE__ */ H("div", {
						class: "row",
						children: /* @__PURE__ */ H("div", {
							class: "row-main",
							children: [
								/* @__PURE__ */ H("div", {
									class: "row-sub",
									children: i("acct.storedIn")
								}),
								/* @__PURE__ */ H("div", {
									class: "row-title",
									children: l
								}),
								e.retentionDays ? /* @__PURE__ */ H("div", {
									class: "row-sub",
									children: i("acct.retention", { n: e.retentionDays })
								}) : null,
								u ? /* @__PURE__ */ H("div", {
									class: "row-sub",
									style: "white-space:normal",
									children: i("acct.storage.computerNote")
								}) : null,
								u ? /* @__PURE__ */ H("div", {
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
					u?.warn && /* @__PURE__ */ H(J, {
						kind: "warn",
						children: i("acct.localWarn")
					})
				]
			}),
			/* @__PURE__ */ H("div", {
				class: "field",
				children: [/* @__PURE__ */ H("label", { children: i("lang.label") }), /* @__PURE__ */ H(Dt, {})]
			}),
			/* @__PURE__ */ H("div", {
				class: "actions",
				children: [!e.anonymous && e.name && /* @__PURE__ */ H("button", {
					class: "link",
					style: "margin-right:auto",
					onClick: () => r.open("ui_sign_out", {}, "replace"),
					children: i("acct.logout")
				}), s ? /* @__PURE__ */ H(Y, {
					primary: !0,
					onClick: async () => {
						await r.bridge.openLink(e.links.upgrade), o(!0);
					},
					children: i("acct.upgrade")
				}) : e.plan === "paid" && e.links?.manage ? /* @__PURE__ */ H(Y, {
					onClick: () => r.bridge.openLink(e.links.manage),
					children: i("acct.manage")
				}) : null]
			})
		]
	});
}
function Nt({ onOpened: e, refresh: t }) {
	let n = U(), { t: r } = V(), [i, a] = R(!1);
	return /* @__PURE__ */ H("div", {
		class: "row",
		style: "flex-direction:column;align-items:stretch;gap:8px",
		children: [/* @__PURE__ */ H("div", {
			class: "row-main",
			children: [/* @__PURE__ */ H("div", {
				class: "row-title",
				children: r("acct.createTitle")
			}), /* @__PURE__ */ H("div", {
				class: "row-sub",
				style: "white-space:normal",
				children: r(i ? "acct.createOpened" : "acct.createHint")
			})]
		}), /* @__PURE__ */ H("div", { children: [/* @__PURE__ */ H(Y, {
			primary: !i,
			onClick: async () => {
				let t = await n.bridge.call("ui_account_link");
				t.payload.url && (await n.bridge.openLink(t.payload.url), a(!0), e?.());
			},
			children: r(i ? "acct.createAgain" : "acct.create")
		}), i && t && /* @__PURE__ */ H(C, { children: [" ", /* @__PURE__ */ H(Y, {
			primary: !0,
			onClick: () => n.open("show_account", {}, "replace"),
			children: r("acct.createDone")
		})] })] })]
	});
}
// ui/views/setup.tsx
var Pt = "https://chromewebstore.google.com/search/Browser%20Workflow";
function Ft({ link: e, onReady: t }) {
	let n = U(), { t: r } = V();
	return /* @__PURE__ */ H(C, { children: [
		/* @__PURE__ */ H("div", {
			class: "stack",
			style: "gap:4px",
			children: [/* @__PURE__ */ H("div", {
				class: "row-title",
				children: r("setup.extTitle")
			}), /* @__PURE__ */ H("div", {
				class: "muted",
				children: r("setup.extNote")
			})]
		}),
		/* @__PURE__ */ H(J, {
			kind: "warn",
			children: r("setup.extOpen")
		}),
		/* @__PURE__ */ H("div", {
			class: "actions",
			children: [/* @__PURE__ */ H(Y, {
				ghost: !0,
				onClick: () => n.bridge.openLink(e || Pt),
				children: r("setup.extGet")
			}), /* @__PURE__ */ H(Y, {
				primary: !0,
				onClick: async () => {
					await n.open("setup", {}, "replace"), t?.();
				},
				children: r("setup.extCheck")
			})]
		})
	] });
}
function It(e) {
	let t = U(), { t: n } = V(), r = ["extension", "first"], i = e.step === "extension" ? "extension" : "first", a = r.indexOf(i), [o, s] = R(!1), [c, l] = R(!1), u = Ze();
	async function d() {
		await t.bridge.call("ui_finish_setup"), l(!0), await Je(t.bridge, n("msg.setupDone"), "The user finished setup in the widget. Go on with what they asked for. If they asked for nothing yet, call list_workflows and ask in one line which example to run first, or what they want to automate.").catch(() => {});
	}
	return c ? /* @__PURE__ */ H("div", {
		class: "w",
		children: /* @__PURE__ */ H(J, {
			kind: "ok",
			children: n("setup.ready")
		})
	}) : /* @__PURE__ */ H("div", {
		class: "w",
		children: [
			/* @__PURE__ */ H("div", {
				class: "hd",
				children: [/* @__PURE__ */ H("div", {
					class: "hd-main",
					children: [/* @__PURE__ */ H("h1", {
						class: "title",
						children: n("setup.title")
					}), /* @__PURE__ */ H("div", {
						class: "sub",
						children: n("setup.stepOf", {
							n: a + 1,
							total: r.length
						})
					})]
				}), /* @__PURE__ */ H(Dt, { compact: !0 })]
			}),
			/* @__PURE__ */ H("div", {
				class: "steps-dots",
				"aria-hidden": "true",
				children: r.map((e, t) => /* @__PURE__ */ H("i", { class: t <= a ? "on" : "" }, e))
			}),
			i === "extension" && /* @__PURE__ */ H(Ft, { link: e.link }),
			i === "first" && /* @__PURE__ */ H(C, { children: [
				/* @__PURE__ */ H(J, {
					kind: "ok",
					children: n("setup.extOk")
				}),
				/* @__PURE__ */ H("div", {
					class: "row-title",
					children: n("setup.firstTitle")
				}),
				/* @__PURE__ */ H("div", {
					class: "list",
					children: [
						/* @__PURE__ */ H("button", {
							class: "row",
							onClick: u.pick,
							children: [/* @__PURE__ */ H("span", {
								class: "st pending",
								children: G.upload()
							}), /* @__PURE__ */ H("div", {
								class: "row-main",
								children: [/* @__PURE__ */ H("div", {
									class: "row-title",
									children: n("setup.importFile")
								}), /* @__PURE__ */ H("div", {
									class: "row-sub",
									children: n("setup.importHint")
								})]
							})]
						}),
						/* @__PURE__ */ H("button", {
							class: "row",
							onClick: async () => {
								await t.bridge.call("ui_finish_setup"), await t.open("list_workflows", {}, "push");
							},
							children: [/* @__PURE__ */ H("span", {
								class: "st pending",
								children: G.play()
							}), /* @__PURE__ */ H("div", {
								class: "row-main",
								children: [/* @__PURE__ */ H("div", {
									class: "row-title",
									children: n("setup.example")
								}), /* @__PURE__ */ H("div", {
									class: "row-sub",
									children: n("setup.exampleHint")
								})]
							})]
						}),
						/* @__PURE__ */ H("button", {
							class: "row",
							"aria-expanded": o,
							onClick: () => s(!o),
							children: [/* @__PURE__ */ H("span", {
								class: "st pending",
								children: G.sparkle()
							}), /* @__PURE__ */ H("div", {
								class: "row-main",
								children: [/* @__PURE__ */ H("div", {
									class: "row-title",
									children: n("setup.describe")
								}), /* @__PURE__ */ H("div", {
									class: "row-sub",
									children: n("setup.describeHint")
								})]
							})]
						}),
						o && /* @__PURE__ */ H("div", {
							class: "row-expand",
							style: "padding-left:10px",
							children: /* @__PURE__ */ H(X, {
								placeholder: n("setup.describePh"),
								message: (e) => n("msg.describe", { text: e }),
								context: "The user wants a new browser workflow. Read get_step_schema, explore the site with the page_* tools, then show a draft with propose_workflow."
							})
						})
					]
				}),
				u.error && /* @__PURE__ */ H("span", {
					class: "err",
					children: u.error
				}),
				u.input,
				/* @__PURE__ */ H("div", {
					class: "actions",
					children: /* @__PURE__ */ H(Y, {
						primary: !0,
						onClick: d,
						children: n("setup.finish")
					})
				})
			] })
		]
	});
}
// ui/views/chat.tsx
var Lt = (e) => e.surface === "panel" && typeof e.chatState == "function" ? e : void 0, Rt = { view: "chat" }, zt = (e) => e?.view === "chat", Z = {
	openedAt: 0,
	local: [],
	subs: /* @__PURE__ */ new Set()
}, Bt = () => Z.subs.forEach((e) => e());
function Vt(e, t) {
	return `claude://${e === "chat" ? "claude.ai" : "code"}/new?q=${encodeURIComponent(t)}`;
}
function Ht(e) {
	let t = document.createElement("a");
	t.href = e, t.rel = "noopener", document.body.appendChild(t), t.click(), t.remove();
}
async function Ut(e) {
	try {
		await navigator.clipboard.writeText(e);
		return;
	} catch {}
	let t = document.createElement("textarea");
	t.value = e, t.style.position = "fixed", t.style.opacity = "0", document.body.appendChild(t), t.select(), document.execCommand("copy"), t.remove();
}
function Wt(e) {
	let { t } = V(), n = Lt(e.bridge), [r, i] = R({}), [, a] = R(0);
	z(() => {
		let e = () => a((e) => e + 1);
		return Z.subs.add(e), () => {
			Z.subs.delete(e);
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
	z(() => {
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
	s && Z.openedAt && (Z.openedAt = 0);
	let c = !!Z.openedAt, [l, u] = R(Date.now());
	z(() => {
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
		entries: r.entries ?? Z.local,
		nothingOpened: c && l - Z.openedAt >= 1e4,
		canSend: s || !d,
		open(e) {
			Z.openedAt = Date.now(), u(Z.openedAt), Ht(Vt(e, t("chat.prompt"))), Bt();
		},
		copy: () => Ut(t("chat.prompt")),
		async send(e, r) {
			if (!n) return;
			let i = await n.chatSend(e, r);
			i.fallback ? (Z.local = [...Z.local, {
				at: Date.now(),
				from: "you",
				text: e,
				mentions: r
			}], i.delivered || Z.local.push({
				at: Date.now(),
				from: "event",
				text: t("chat.notDelivered"),
				warn: !0
			}), Bt()) : await o();
		}
	};
}
function Q({ kind: e, pulse: t }) {
	return /* @__PURE__ */ H("span", { class: `dot${e ? ` ${e}` : ""}${t ? " pulse" : ""}` });
}
function Gt({ chat: e, button: t }) {
	let { t: n } = V(), [r, i] = R(!1), a = n(r ? "chat.copied" : "chat.copyPrompt"), o = async () => {
		await e.copy(), i(!0), setTimeout(() => i(!1), 2e3);
	};
	return t ? /* @__PURE__ */ H("button", {
		class: "btn sm",
		onClick: o,
		children: a
	}) : /* @__PURE__ */ H("button", {
		class: "link",
		onClick: o,
		children: a
	});
}
var Kt = () => G.sparkle();
function qt({ nav: e }) {
	let { t } = V(), n = Wt(e);
	if (!n.bridge) return null;
	let r = () => e.push(Rt), i = n.state;
	if (i === "listening" || i === "working" || i === "connected") {
		let e = t(i === "listening" ? "chat.liveListening" : i === "working" ? "chat.liveWorking" : "chat.liveConnected");
		return /* @__PURE__ */ H("div", {
			class: "strip live",
			role: "status",
			children: [
				/* @__PURE__ */ H(Q, {
					kind: i === "working" ? "run" : "ok",
					pulse: i === "working"
				}),
				/* @__PURE__ */ H("span", {
					class: "strip-sub",
					children: e
				}),
				/* @__PURE__ */ H("button", {
					class: "btn sm primary",
					onClick: r,
					children: t("chat.chat")
				})
			]
		});
	}
	return i === "opening" ? /* @__PURE__ */ H("div", {
		class: "strip",
		role: "status",
		children: [
			/* @__PURE__ */ H("div", {
				class: "strip-top",
				children: [/* @__PURE__ */ H(Q, {
					kind: "run",
					pulse: !0
				}), /* @__PURE__ */ H("span", {
					class: "strip-title",
					children: t("chat.waitingTitle")
				})]
			}),
			/* @__PURE__ */ H("ol", {
				class: "steps-ol",
				children: [
					/* @__PURE__ */ H("li", { children: t("chat.step1") }),
					/* @__PURE__ */ H("li", { children: [
						t("chat.step2a"),
						/* @__PURE__ */ H("b", { children: t("chat.step2b") }),
						t("chat.step2c")
					] }),
					/* @__PURE__ */ H("li", { children: t("chat.step3") })
				]
			}),
			/* @__PURE__ */ H("div", {
				class: "strip-sub",
				children: t("chat.warnNote")
			}),
			n.nothingOpened && /* @__PURE__ */ H("div", {
				class: "strip-sub strong",
				children: t("chat.nothingOpened")
			}),
			/* @__PURE__ */ H("div", {
				class: "strip-links",
				children: [/* @__PURE__ */ H("button", {
					class: "link",
					onClick: () => n.open("chat"),
					children: t("chat.openAgain")
				}), /* @__PURE__ */ H(Gt, { chat: n })]
			})
		]
	}) : /* @__PURE__ */ H("div", {
		class: "strip",
		children: [
			/* @__PURE__ */ H("div", {
				class: "strip-top",
				children: [/* @__PURE__ */ H(Q, {}), /* @__PURE__ */ H("span", {
					class: "strip-title",
					children: t(i === "idle" ? "chat.idleTitle" : "chat.noneTitle")
				})]
			}),
			/* @__PURE__ */ H("div", {
				class: "strip-sub",
				children: t("chat.noneSub")
			}),
			/* @__PURE__ */ H("button", {
				class: "btn primary block",
				onClick: () => n.open("chat"),
				children: [Kt(), t("chat.use")]
			}),
			/* @__PURE__ */ H("div", {
				class: "strip-links",
				children: [
					/* @__PURE__ */ H("button", {
						class: "link",
						onClick: () => n.open("code"),
						children: t("chat.useCode")
					}),
					/* @__PURE__ */ H(Gt, { chat: n }),
					(i === "idle" || !n.known || n.entries.length > 0) && /* @__PURE__ */ H("button", {
						class: "link",
						onClick: r,
						children: t("chat.openChat")
					})
				]
			})
		]
	});
}
var Jt = "M8 2.5a5.5 5.5 0 1 1 0 11a5.5 5.5 0 1 1 0-11z";
function Yt(e) {
	return e.type === "workflow" ? ["M3 3h4v4H3zM9 9h4v4H9zM7 5h3.5a1.5 1.5 0 0 1 1.5 1.5V9"] : e.type === "tab" ? ["M3.5 3h9A1.5 1.5 0 0 1 14 4.5v7a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 11.5v-7A1.5 1.5 0 0 1 3.5 3zM2 6h12"] : e.status === "failure" ? [Jt, "M8 5v3.5M8 10.8v.1"] : [Jt, "M6.8 5.8 10 8l-3.2 2.2z"];
}
function Xt({ m: e }) {
	return /* @__PURE__ */ H("svg", {
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
		children: Yt(e).map((e) => /* @__PURE__ */ H("path", { d: e }))
	});
}
function Zt(e) {
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
	for (let r of Yt(e)) {
		let e = document.createElementNS(t, "path");
		e.setAttribute("d", r), n.appendChild(e);
	}
	return n;
}
function Qt({ m: e }) {
	return /* @__PURE__ */ H("span", {
		class: "mchip",
		title: e.url ?? e.name,
		children: [/* @__PURE__ */ H(Xt, { m: e }), e.name]
	});
}
function $t(e, t = []) {
	let n = [], r = /* @__PURE__ */ new Set(), i = 0, a = "";
	for (let o = 0; o < e.length;) {
		let s = -1;
		e[o] === "＠" && (s = i < t.length && e.startsWith("＠" + t[i].name, o) ? i : t.findIndex((t, n) => !r.has(n) && e.startsWith("＠" + t.name, o))), s >= 0 ? (a && n.push(a), a = "", n.push(/* @__PURE__ */ H(Qt, { m: t[s] })), r.add(s), s === i && (i += 1), o += 1 + t[s].name.length) : (a += e[o], o += 1);
	}
	return a && n.push(a), t.forEach((e, t) => {
		r.has(t) || n.push(" ", /* @__PURE__ */ H(Qt, { m: e }));
	}), n;
}
var en = (e) => e && [
	"running",
	"waiting_manual",
	"success",
	"failure",
	"stopped"
].includes(e) ? `status.${e}` : void 0;
function tn(e, t) {
	if (e.type === "tab") return e.url?.replace(/^https?:\/\//, "");
	if (e.type === "run") {
		let n = en(e.status);
		return n ? t(n) : e.status;
	}
}
var nn = 5;
function rn(e, t) {
	let n = t.toLowerCase(), r = (e = []) => e.filter((e) => !n || `${e.name} ${e.url ?? ""}`.toLowerCase().includes(n)).slice(0, nn);
	return {
		workflows: r(e?.workflows),
		runs: r(e?.runs),
		tabs: r(e?.tabs)
	};
}
function an(e) {
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
function on({ enabled: e, chat: t }) {
	let { t: n } = V(), r = B(null), i = B(/* @__PURE__ */ new Map()), a = B(0), [o, s] = R(!0), [c, l] = R(!1), [u, d] = R(null), f = B(null), p = B(0), m = Te(() => rn(u?.cands, u?.query ?? ""), [u]), h = [
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
		let e = an(r.current), t = f.current;
		e || (f.current = null), e && !(t && t.node === e.node && t.start === e.start) ? _(e.query) : d(null);
	}, y = (e) => {
		let t = r.current;
		if (!t) return;
		let n = String(++a.current);
		i.current.set(n, e);
		let o = document.createElement("span");
		o.className = "mchip", o.contentEditable = "false", o.dataset.k = n, o.title = e.url ?? e.name, o.append(Zt(e), document.createTextNode(e.name));
		let c = document.createTextNode("\xA0"), l = an(t);
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
					let t = an(r.current);
					f.current = t ? {
						node: t.node,
						start: t.start
					} : null, d(null);
					return;
				}
			}
			e.key === "Enter" && !e.shiftKey ? (e.preventDefault(), x()) : e.key === "Enter" && (e.preventDefault(), document.execCommand("insertLineBreak"));
		}
	}, w = (e) => {
		e.preventDefault(), document.execCommand("insertText", !1, e.clipboardData?.getData("text/plain") ?? "");
	}, T = (e, t, r) => t.length > 0 && /* @__PURE__ */ H(C, { children: [/* @__PURE__ */ H("div", {
		class: "pick-h",
		children: n(e)
	}), t.map((e, t) => /* @__PURE__ */ H("button", {
		class: `pick${u && u.on === r + t ? " on" : ""}`,
		role: "option",
		"aria-selected": u?.on === r + t,
		onMouseDown: (t) => {
			t.preventDefault(), y(e);
		},
		children: [/* @__PURE__ */ H(Xt, { m: e }), /* @__PURE__ */ H("div", {
			class: "row-main",
			children: [/* @__PURE__ */ H("div", {
				class: "row-title",
				children: e.name
			}), tn(e, n) && /* @__PURE__ */ H("div", {
				class: "row-sub",
				children: tn(e, n)
			})]
		})]
	}))] });
	return /* @__PURE__ */ H("div", {
		class: "composer-wrap",
		children: [
			u && e && /* @__PURE__ */ H("div", {
				class: "picker",
				role: "listbox",
				"aria-label": n("chat.mention"),
				children: [
					T("chat.pickWorkflows", m.workflows, 0),
					T("chat.pickRuns", m.runs, m.workflows.length),
					T("chat.pickTabs", m.tabs, m.workflows.length + m.runs.length),
					!h.length && u.cands && /* @__PURE__ */ H("div", {
						class: "pick-none",
						children: n("chat.pickNone")
					})
				]
			}),
			/* @__PURE__ */ H("div", {
				class: "composer",
				children: [/* @__PURE__ */ H("div", {
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
					onPaste: w,
					onBlur: () => setTimeout(() => d(null), 150)
				}), /* @__PURE__ */ H("button", {
					class: "btn primary",
					disabled: !e || o || c,
					onClick: () => void x(),
					children: n("chat.send")
				})]
			}),
			/* @__PURE__ */ H("div", {
				class: "tools",
				children: /* @__PURE__ */ H("button", {
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
function sn(e, t) {
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
		let r = en(e.status);
		return { text: t("chat.cardRunOther", {
			name: n,
			status: r ? t(r) : e.status
		}) };
	}
}
function cn({ e }) {
	let t = U(), { t: n } = V(), r = e.card;
	if (r.kind === "proposal" && r.pendingId && (!r.state || r.state === "pending")) return /* @__PURE__ */ H("div", {
		class: "card-mini",
		children: [
			/* @__PURE__ */ H("span", {
				class: "is-warn",
				children: G.alert()
			}),
			/* @__PURE__ */ H("div", {
				class: "row-main",
				children: [/* @__PURE__ */ H("div", {
					class: "row-title",
					children: n("chat.cardWaiting")
				}), /* @__PURE__ */ H("div", {
					class: "row-sub",
					children: r.name || e.text
				})]
			}),
			/* @__PURE__ */ H("button", {
				class: "btn sm primary",
				onClick: () => t.open("ui_proposal", { pendingId: r.pendingId }, "push"),
				children: n("panel.review")
			})
		]
	});
	let i = sn(r, n) ?? { text: e.text }, a = r.runId;
	return a ? /* @__PURE__ */ H("button", {
		class: "ev ev-link",
		onClick: () => t.open("show_run", { runId: a }, "push"),
		children: [/* @__PURE__ */ H(Q, { kind: i.dot }), i.text]
	}) : /* @__PURE__ */ H("div", {
		class: "ev",
		children: [/* @__PURE__ */ H(Q, { kind: i.dot }), i.text]
	});
}
function ln({ chat: e }) {
	let { t } = V(), n = B(null), r = e.entries, i = r.reduce((e, t, n) => t.from === "claude" ? n : e, -1), a = e.state === "working" ? r.findIndex((e, t) => t > i && e.from === "you") : -1, o = a < 0 ? -1 : r.reduce((e, t, n) => t.from === "you" ? n : e, -1), [s, c] = R(Date.now());
	z(() => {
		if (a < 0) return;
		let e = setInterval(() => c(Date.now()), 1e3);
		return () => clearInterval(e);
	}, [a]);
	let l = a >= 0 ? new Date(r[a].at).getTime() : 0;
	we(() => {
		let e = n.current;
		e && (e.scrollTop = e.scrollHeight);
	}, [r.length, e.state]);
	let u = [];
	return r.forEach((e, n) => {
		let i = r[n - 1];
		if (e.from === "event" || e.card) u.push(e.card ? /* @__PURE__ */ H(cn, { e }) : /* @__PURE__ */ H("div", {
			class: `ev${e.warn ? " warn" : ""}`,
			children: [e.warn ? G.alert() : /* @__PURE__ */ H(Q, {}), e.text]
		}));
		else {
			let n = e.from === "you";
			(i?.from !== e.from || i?.card) && u.push(/* @__PURE__ */ H("div", {
				class: `who${n ? " me" : ""}`,
				children: t(n ? "chat.you" : "chat.claude")
			})), u.push(/* @__PURE__ */ H("div", {
				class: `msg ${n ? "me" : "claude"}`,
				children: n ? $t(e.text, e.mentions) : e.text
			}));
		}
		n === a && u.push(/* @__PURE__ */ H("div", {
			class: "working",
			role: "status",
			children: [/* @__PURE__ */ H("span", {
				class: "typing",
				children: [
					/* @__PURE__ */ H("i", {}),
					/* @__PURE__ */ H("i", {}),
					/* @__PURE__ */ H("i", {})
				]
			}), t("chat.working", { s: Number.isFinite(l) ? Math.max(0, Math.round((s - l) / 1e3)) : 0 })]
		})), n === o && o > a && u.push(/* @__PURE__ */ H("div", {
			class: "ev",
			children: [/* @__PURE__ */ H(Q, {}), t("chat.queued")]
		}));
	}), /* @__PURE__ */ H("div", {
		class: "log",
		ref: n,
		"aria-live": "polite",
		children: [
			r.length === 0 && /* @__PURE__ */ H("div", {
				class: "muted log-empty",
				children: t("chat.empty")
			}),
			u,
			e.known && !e.canSend && /* @__PURE__ */ H(un, { chat: e })
		]
	});
}
function un({ chat: e }) {
	let { t } = V(), n = e.state, r = t(n === "idle" ? "chat.stoppedTitle" : n === "opening" ? "chat.waitingTitle" : "chat.noneTitle"), i = n === "idle" ? t("chat.stoppedSub") : n === "opening" ? e.nothingOpened ? t("chat.nothingOpened") : `${t("chat.step2a")}${t("chat.step2b")}${t("chat.step2c")}` : t("chat.noneSub");
	return /* @__PURE__ */ H("div", {
		class: "banner",
		role: "status",
		children: [
			/* @__PURE__ */ H("div", {
				class: "banner-title",
				children: r
			}),
			/* @__PURE__ */ H("div", {
				class: "strip-sub",
				children: i
			}),
			/* @__PURE__ */ H("div", {
				class: "actions",
				children: [/* @__PURE__ */ H(Gt, {
					chat: e,
					button: !0
				}), /* @__PURE__ */ H("button", {
					class: "btn sm primary",
					onClick: () => e.open("chat"),
					children: t(n === "opening" ? "chat.openAgain" : "chat.use")
				})]
			})
		]
	});
}
function dn() {
	let e = U(), { t } = V(), n = Wt(e), r = B(null);
	if (we(() => {
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
	let i = n.state, a = i === "listening" ? /* @__PURE__ */ H("span", {
		class: "pill ok",
		children: [/* @__PURE__ */ H(Q, { kind: "ok" }), t("chat.pillListening")]
	}) : i === "working" ? /* @__PURE__ */ H("span", {
		class: "pill run",
		children: [/* @__PURE__ */ H(Q, {
			kind: "run",
			pulse: !0
		}), t("chat.pillWorking")]
	}) : i === "connected" ? /* @__PURE__ */ H("span", {
		class: "pill ok",
		children: [/* @__PURE__ */ H(Q, { kind: "ok" }), t("chat.pillConnected")]
	}) : n.known ? /* @__PURE__ */ H("span", {
		class: "pill muted",
		children: [/* @__PURE__ */ H(Q, {}), t("chat.pillOff")]
	}) : null;
	return /* @__PURE__ */ H("div", {
		class: "w chat",
		ref: r,
		children: [
			/* @__PURE__ */ H("div", {
				class: "hd",
				style: "align-items:center",
				children: [/* @__PURE__ */ H("div", {
					class: "hd-main",
					children: /* @__PURE__ */ H("h1", {
						class: "title",
						children: t("chat.title")
					})
				}), a]
			}),
			/* @__PURE__ */ H(ln, { chat: n }),
			/* @__PURE__ */ H(on, {
				enabled: n.canSend,
				chat: n
			})
		]
	});
}
// ui/widget.tsx
function fn({ arg: e, retry: t }) {
	let n = U(), { t: r } = V(), [i, a] = R(!1);
	return /* @__PURE__ */ H("div", {
		class: "w",
		children: [
			/* @__PURE__ */ H(J, {
				kind: "info",
				children: r(e === "workflows" ? "need.workflows" : "need.runs")
			}),
			/* @__PURE__ */ H("div", {
				class: "list",
				children: /* @__PURE__ */ H(Nt, { onOpened: () => a(!0) })
			}),
			i && /* @__PURE__ */ H("div", {
				class: "actions",
				children: /* @__PURE__ */ H(Y, {
					primary: !0,
					onClick: () => t ? n.open(t.tool, t.args, "replace") : n.bridge.sendMessage(r("need.message")),
					children: r("need.continue")
				})
			})
		]
	});
}
var pn = [
	"limit_steps",
	"limit_runs_day",
	"limit_runs_year",
	"limit_steps_day",
	"limit_steps_year",
	"limit_workflows"
];
function mn(e) {
	let { message: t, code: n, arg: r } = e, i = U(), { t: a } = V();
	return n === "account_needed" ? /* @__PURE__ */ H(fn, { ...e }) : n === "not_running" ? /* @__PURE__ */ H("div", {
		class: "w",
		children: /* @__PURE__ */ H(Ft, { link: e.link })
	}) : /* @__PURE__ */ H("div", {
		class: "w",
		children: [/* @__PURE__ */ H(J, {
			kind: "bad",
			children: n ? a(`error.${n}`, { arg: r }) : t
		}), n && pn.includes(n) && /* @__PURE__ */ H("button", {
			class: "link",
			style: "align-self:flex-start",
			onClick: () => i.open("show_account", {}, "push"),
			children: a("br.seePlans")
		})]
	});
}
function hn({ p: e }) {
	if (zt(e)) return /* @__PURE__ */ H(dn, {});
	switch (e.view) {
		case "setup": return /* @__PURE__ */ H(It, { ...e });
		case "library": return /* @__PURE__ */ H(Qe, { ...e });
		case "workflow": return /* @__PURE__ */ H(xt, { ...e });
		case "import": return /* @__PURE__ */ H($e, { ...e });
		case "draft": return /* @__PURE__ */ H(et, { ...e });
		case "runSetup": return /* @__PURE__ */ H(rt, { ...e });
		case "run": return /* @__PURE__ */ H(ut, { run: e.run });
		case "failure": return /* @__PURE__ */ H(dt, {
			run: e.run,
			inspecting: e.inspecting
		});
		case "change": return /* @__PURE__ */ H(St, { ...e });
		case "runs": return /* @__PURE__ */ H(mt, { ...e });
		case "stepRun": return /* @__PURE__ */ H(ht, { ...e });
		case "data": return /* @__PURE__ */ H(wt, { ...e });
		case "history": return /* @__PURE__ */ H(Et, { ...e });
		case "account": return /* @__PURE__ */ H(Ot, { ...e });
		case "error": return /* @__PURE__ */ H(mn, { ...e });
		default: return null;
	}
}
var gn = 45e3, _n = 3e3;
function $(e) {
	if (e && (e.view === "draft" || e.view === "change" || e.view === "import")) return e.pendingId;
}
function vn({ bridge: e, start: t, top: n }) {
	let [r, i] = R([]), a = B(0), [o, s] = R(), [c, l] = R("auto"), [u, d] = R(0), f = B(0);
	f.current = u;
	let p = (e, t) => {
		e.lang && l(e.lang);
		let n = {
			key: a.current++,
			p: e
		};
		i((e) => t === "reset" ? [n] : t === "push" ? [...e, n] : [...e.slice(0, -1), n]);
	};
	z(() => e.onPayload((e) => {
		s(void 0), p(e, "reset");
	}), [e]);
	let m = Te(() => ze(Re(c, e.hostLocale()), e.hostName()), [c, e]), h = async (e) => {
		let t = !0, n = () => {
			t && (t = !1, d((e) => Math.max(0, e - 1)));
		};
		d((e) => e + 1);
		let r = setTimeout(n, gn);
		try {
			return await e();
		} finally {
			clearTimeout(r), n();
		}
	}, g = Te(() => ({
		bridge: e,
		langPref: c,
		push: (e) => p(e, "push"),
		replace: (e) => p(e, "replace"),
		back: () => i((e) => e.length > 1 ? e.slice(0, -1) : e),
		lock: h,
		open: (t, n = {}, r = "push") => h(async () => {
			s(void 0);
			try {
				let o = await e.call(t, n);
				if (!o.payload || !("view" in o.payload)) throw Error(o.text || "Unexpected response");
				if (o.payload.view === "error" && o.payload.code === "account_needed") {
					let e = {
						key: a.current++,
						p: {
							...o.payload,
							retry: {
								tool: t,
								args: n
							}
						}
					}, r = (e) => e?.view === "error" && e.code === "account_needed";
					i((t) => r(t[t.length - 1]?.p) ? [...t.slice(0, -1), e] : [...t, e]);
					return;
				}
				if (o.payload.view === "account" && o.payload.limit) {
					let e = {
						key: a.current++,
						p: {
							...o.payload,
							retry: {
								tool: t,
								args: n
							}
						}
					}, r = (e) => e?.view === "account" && !!e.limit;
					i((t) => r(t[t.length - 1]?.p) ? [...t.slice(0, -1), e] : [...t, e]);
					return;
				}
				p(o.payload, r);
			} catch (e) {
				s(e?.message ?? String(e));
			}
		}),
		async setLang(t) {
			l(t), await e.call("ui_set_language", { lang: t });
		}
	}), [e, c]), _ = r[r.length - 1];
	z(() => e.setCurrent?.(_?.p), [_?.key]), z(() => {
		t && g.open(t.tool, t.args ?? {}, "replace");
	}, []);
	let v = $(_?.p), y = _?.key;
	z(() => {
		if (!v) return;
		let t = !1, n = !1, r = async () => {
			if (!(n || f.current > 0 || document.visibilityState === "hidden")) {
				n = !0;
				try {
					let n = await e.call("ui_proposal", { pendingId: v });
					if (t || f.current > 0 || !n.payload || !("view" in n.payload) || $(n.payload) === v) return;
					let r = {
						key: a.current++,
						p: n.payload
					};
					i((e) => e[e.length - 1]?.key === y ? [...e.slice(0, -1), r] : e);
				} catch {} finally {
					n = !1;
				}
			}
		}, o = setInterval(r, _n), s = () => {
			document.visibilityState === "visible" && r();
		};
		document.addEventListener("visibilitychange", s);
		let c = e.onEvent?.("proposal.update", (e) => {
			e?.pendingId && e.pendingId !== v || r();
		});
		return () => {
			t = !0, clearInterval(o), document.removeEventListener("visibilitychange", s), c?.();
		};
	}, [
		v,
		y,
		e
	]);
	let b = {
		...g,
		canBack: r.length > 1
	};
	return /* @__PURE__ */ H(Be.Provider, {
		value: m,
		children: /* @__PURE__ */ H(He.Provider, {
			value: b,
			children: /* @__PURE__ */ H("div", {
				lang: m.lang,
				class: u ? "is-working" : void 0,
				inert: u > 0,
				"aria-busy": u > 0,
				children: [
					u > 0 && /* @__PURE__ */ H("div", {
						class: "working-bar",
						role: "progressbar",
						"aria-label": m.t("common.loading"),
						children: /* @__PURE__ */ H("i", {})
					}),
					n?.(b, _?.p),
					o && /* @__PURE__ */ H("div", {
						class: "w",
						style: "padding-bottom:0",
						children: /* @__PURE__ */ H(J, {
							kind: "bad",
							children: o
						})
					}),
					_ ? r.map((e, t) => /* @__PURE__ */ H("div", {
						hidden: t !== r.length - 1,
						children: /* @__PURE__ */ H(hn, { p: e.p })
					}, e.key)) : /* @__PURE__ */ H("div", {
						class: "w",
						"aria-busy": "true",
						"aria-label": m.t("common.loading"),
						children: [
							/* @__PURE__ */ H("div", {
								class: "skel",
								style: "width:55%;height:18px"
							}),
							/* @__PURE__ */ H("div", { class: "skel" }),
							/* @__PURE__ */ H("div", { class: "skel" })
						]
					})
				]
			})
		})
	});
}
// ui/panel.tsx
function yn(e) {
	if (!e) return {};
	let t = e, n = t.run ?? t.step;
	return {
		view: e.view,
		workflowId: t.workflowId ?? t.workflow?.id ?? n?.workflowId,
		runId: t.runId ?? n?.runId,
		pendingId: $(e)
	};
}
var bn = class {
	runtime;
	tabs;
	surface = "panel";
	current;
	context;
	contextTimer;
	constructor(e = chrome.runtime, t = chrome.tabs) {
		this.runtime = e, this.tabs = t;
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
			...yn(this.current),
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
				...yn(this.current)
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
function xn({ nav: e, current: t }) {
	let { t: n } = V(), [r, i] = R([]);
	z(() => {
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
	let a = t?.view === "library", o = $(t), s = r.filter((e) => e.pendingId !== o);
	return /* @__PURE__ */ H("div", {
		class: "w panel-top",
		style: "padding-bottom:0",
		children: [
			/* @__PURE__ */ H("div", {
				style: "display:flex;justify-content:space-between;align-items:center",
				children: [a ? /* @__PURE__ */ H("span", {}) : /* @__PURE__ */ H("button", {
					class: "back",
					onClick: () => e.open("list_workflows", {}, "reset"),
					children: n("panel.home")
				}), t?.view !== "account" && /* @__PURE__ */ H("button", {
					class: "link",
					onClick: () => e.open("show_account", {}, "push"),
					children: n("panel.account")
				})]
			}),
			a && /* @__PURE__ */ H(qt, { nav: e }),
			s.length > 0 && /* @__PURE__ */ H("div", {
				class: "note warn",
				role: "status",
				style: "align-items:center",
				children: [
					G.alert(),
					/* @__PURE__ */ H("div", {
						class: "row-main",
						children: [/* @__PURE__ */ H("div", {
							class: "row-title",
							children: n("panel.waiting")
						}), /* @__PURE__ */ H("div", {
							class: "row-sub",
							children: s.length === 1 ? s[0].name : n("panel.waitingSub", { n: s.length })
						})]
					}),
					/* @__PURE__ */ H("button", {
						class: "btn primary",
						onClick: () => e.open("ui_proposal", { pendingId: s[0].pendingId }, "push"),
						children: n("panel.review")
					})
				]
			})
		]
	});
}
function Sn(e, t = new bn()) {
	de(/* @__PURE__ */ H(vn, {
		bridge: t,
		start: { tool: "list_workflows" },
		top: (e, t) => /* @__PURE__ */ H(xn, {
			nav: e,
			current: t
		})
	}), e);
}
export { bn as PanelBridge, Sn as mountPanel };
