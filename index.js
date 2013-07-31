var browserify = require('browserify');
var Cache = require('waiting-cache');
var through = require('through');

module.exports = function (index, fn) {
  var cache = new Cache();

  var b = browserify(index);
  if (fn) fn(b);
  b.bundle(function (err, bundle) {
    cache.set('bundle', bundle);
  });

  return function (cached) {
    var tr = through();
    var b = browserify(index);
    if (fn) fn(b);

    if (cached) {
      cache.get('bundle', function (bundle) {
        if (bundle) return tr.end(bundle);
        cache.caching('bundle');
        b.bundle(function (err, bundle) {
          cache.set('bundle', bundle);
          if (err) tr.emit('error', err);
          else tr.end(bundle);
        });
      });
    } else {
      b.bundle({ debug: true }).pipe(tr);
    }

    return tr;
  }
};

