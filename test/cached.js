var browserify = require('..');
var http = require('http');
var test = require('tape');

test('cached', function (t) {
  t.plan(1);
  var bundle = browserify(__dirname + '/fixtures/client.js');
  
  var start = Date.now();
  bundle().on('end', function () {
    var dur = Date.now() - start;
    var start2 = Date.now();
    bundle(true).on('end', function () {
      var dur2 = Date.now() - start2;
      console.log(dur2, dur)
      t.ok(dur2 < (dur / 10));
    });
  })
});
