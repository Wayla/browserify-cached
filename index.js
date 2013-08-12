var browserify = require('browserify');
var Cache = require('waiting-cache');
var through = require('through');
var uglify = require('uglify-js');

module.exports = function (index, opts, fn) {
  if ('function' == typeof opts) {
    fn = opts;
    opts = {};
  }
  
  opts = opts || {};
  var cache = new Cache();
  
  function getBundle () {
    var b = browserify(index);
    if (fn) fn(b);
    return b;
  }

  return function (cached) {
    var tr = through();

    if (cached) {
      cache.get('bundle', function (bundle) {
        if (bundle) return tr.end(bundle);
        
        cache.caching('bundle');
        getBundle().bundle(function (err, bundle) {
          if (err) {
            cache.set('bundle', false);
            tr.emit('error', err);
            return;
          }
          
          if (opts.compress !== false) bundle = compress(bundle);
          cache.set('bundle', bundle);
          tr.end(bundle);
        });
      });
    } else {
      getBundle().bundle({
        debug: true,
        insertGlobals: true
      }).pipe(tr);
    }

    return tr;
  }
};

function compress (src) {
  var ast = uglify.parse(src, {});
  ast.figure_out_scope();
  var compressor = uglify.Compressor({
    warnings: false
  });
  var compressed = ast.transform(compressor);
  compressed.figure_out_scope();
  compressed.compute_char_frequency();
  compressed.mangle_names();
  return compressed.print_to_string();
}
