System.register(['./index-legacy.e63eae30.js'], function (t, e) {
  'use strict'
  var n,
    a,
    c,
    d,
    u,
    r,
    s,
    i,
    o,
    l,
    f,
    _ = document.createElement('style')
  return (
    (_.innerHTML =
      '.base[data-v-fd669c5c]{width:100px;height:100px;background-image:url(/__dynamic_base__/assets/logo.03d6d6da.png)}.test[data-v-fd669c5c] :after{content:"1"}.about[data-v-fd669c5c]{width:100px;height:100px;background-image:url(/__dynamic_base__/assets/logo.03d6d6da.png)}.about2[data-v-fd669c5c]{width:100px;height:100px;background-image:url(/__dynamic_base__/assets/logo.03d6d6da.png)}\n'),
    document.head.appendChild(_),
    {
      setters: [
        function (t) {
          ;(n = t.e),
            (a = t.f),
            (c = t.o),
            (d = t.c),
            (u = t.a),
            (r = t.F),
            (s = t.p),
            (i = t.g),
            (o = t.b),
            (l = t.d),
            (f = t._)
        }
      ],
      execute: function () {
        var e = function (t) {
            return s('data-v-fd669c5c'), (t = t()), i(), t
          },
          _ = e(function () {
            return o('img', { src: l }, null, -1)
          }),
          g = e(function () {
            return o('div', { class: 'test' }, null, -1)
          }),
          b = e(function () {
            return o('div', { class: 'about' }, null, -1)
          }),
          p = e(function () {
            return o('div', { class: 'base' }, null, -1)
          })
        t(
          'default',
          f(
            n({
              __name: 'About',
              setup: function (t) {
                return (
                  a(function () {
                    document.querySelector('.test').innerHTML = 'test innerHTML="test"'
                  }),
                  function (t, e) {
                    return c(), d(r, null, [u(' About '), _, g, b, p], 64)
                  }
                )
              }
            }),
            [['__scopeId', 'data-v-fd669c5c']]
          )
        )
      }
    }
  )
})
