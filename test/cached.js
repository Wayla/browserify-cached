var browserify = require('..');
var http = require('http');
var test = require('tape');
var concat = require('concat-stream');

test('cached', function (t) {
  t.plan(1);
  var bundle = browserify(__dirname + '/fixtures/client.js');
  
  bundle().pipe(concat(function (dev) {
    bundle(true).pipe(concat(function (prod) {
      t.ok(dev > prod);
    }));
  }));
});
