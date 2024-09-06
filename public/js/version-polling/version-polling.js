/*!
 * version-polling v1.1.7
 * (c) 2023 JoeshuTT
 * @license MIT
 */
!(function (t, e) {
  typeof exports === 'object' && typeof module !== 'undefined'
    ? e(exports)
    : typeof define === 'function' && define.amd
    ? define(['exports'], e)
    : e(
        ((t =
          typeof globalThis !== 'undefined'
            ? globalThis
            : t || self).VersionPolling = {})
      );
})(this, function (t) {
  function e(t, e, i) {
    return (
      (e = (function (t) {
        const e = (function (t, e) {
          if (typeof t !== 'object' || t === null) return t;
          const i = t[Symbol.toPrimitive];
          if (void 0 !== i) {
            const a = i.call(t, e || 'default');
            if (typeof a !== 'object') return a;
            throw new TypeError('@@toPrimitive must return a primitive value.');
          }
          return (e === 'string' ? String : Number)(t);
        })(t, 'string');
        return typeof e === 'symbol' ? e : String(e);
      })(e)) in t
        ? Object.defineProperty(t, e, {
            value: i,
            enumerable: !0,
            configurable: !0,
            writable: !0,
          })
        : (t[e] = i),
      t
    );
  }
  function i() {
    let t;
    let e;
    return (
      (self.onmessage = (i) => {
        const a = i.data.code;
        e = { ...e, ...i.data.data };
        const {
          htmlFileUrl: o,
          lastEtag: n,
          appETagKey: s,
          immediate: l,
          pollingInterval: r,
        } = e;
        const c = () => {
          fetch(o, { method: 'HEAD', cache: 'no-cache' }).then((t) => {
            const e = t.headers.get('etag');
            n !== e &&
              self.postMessage({ appETagKey: s, lastEtag: n, etag: e });
          });
        };
        a === 'pause'
          ? (clearInterval(t), (t = null))
          : (l && c(), (t = setInterval(c, r)));
      }),
      self
    );
  }
  let a;
  const o = {
    appETagKey: '__APP_ETAG__',
    pollingInterval: 3e5,
    immediate: !0,
    htmlFileUrl: `${location.origin}${location.pathname}`,
    silent: !1,
  };
  function n() {
    document.visibilityState === 'visible'
      ? a.postMessage({ code: 'resume' })
      : a.postMessage({ code: 'pause' });
  }
  class s {
    constructor(t) {
      e(this, 'options', void 0),
        e(this, 'appEtag', ''),
        (this.options = { ...o, ...t }),
        this.init();
    }

    async init() {
      const { htmlFileUrl: t } = this.options;
      const e = (
        await fetch(t, { method: 'HEAD', cache: 'no-cache' })
      ).headers.get('etag');
      (this.appEtag = e),
        localStorage.setItem(`${this.options.appETagKey}`, e),
        this.start();
    }

    start() {
      const {
        appETagKey: t,
        pollingInterval: e,
        immediate: o,
        htmlFileUrl: s,
        silent: l,
      } = this.options;
      l ||
        ((a = (function (t) {
          const e = new Blob([`(${t.toString()})()`]);
          const i = window.URL.createObjectURL(e);
          const a = new Worker(i);
          return window.URL.revokeObjectURL(i), a;
        })(i)),
        a.postMessage({
          code: 'start',
          data: {
            appETagKey: t,
            htmlFileUrl: s,
            pollingInterval: e,
            immediate: o,
            lastEtag: localStorage.getItem(`${t}`),
          },
        }),
        (a.onmessage = (t) => {
          const { lastEtag: e, etag: i } = t.data;
          let a;
          let o;
          ((this.appEtag = i), e !== i) &&
            (this.stop(),
            (a = (o = this.options).onUpdate) === null ||
              void 0 === a ||
              a.call(o, this));
        }),
        document.addEventListener('visibilitychange', n));
    }

    stop() {
      a && (a.terminate(), document.removeEventListener('visibilitychange', n));
    }

    onRefresh() {
      localStorage.setItem(`${this.options.appETagKey}`, this.appEtag),
        window.location.reload();
    }

    onCancel() {
      localStorage.removeItem(`${this.options.appETagKey}`);
    }
  }
  (t.VersionPolling = s),
    (t.createVersionPolling = function (t) {
      return new s(t);
    });
});
