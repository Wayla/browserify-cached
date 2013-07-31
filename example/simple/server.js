// npm install levelup, d3, three

var browserify = require('../..');
var http = require('http');
var brfs = require('brfs');

var bundle = browserify(__dirname + '/client.js', function (b) {
  b.transform(brfs);
});

http.createServer(function (req, res) {
  if (req.url == '/slow.js') return bundle(false).pipe(res);
  if (req.url == '/fast.js') return bundle(true).pipe(res);
  res.end('oops');
}).listen(9000, function () {
  console.log('open http://localhost:9000/slow.js');
  console.log('     http://localhost:9000/fast.js');
});
