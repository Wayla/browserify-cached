
# browserify-cached

A production cache for
[browserify](https://github.com/substack/node-browserify).

## Usage

```js
var browserify = require('browserify-cached');
var http = require('http');
var brfs = require('brfs');

// just get an untouched bundle
var bundle = browserify(__dirname + '/client.js');

// or modify it with custom transforms and other cool things
var bundle = browserify(__dirname + '/client.js', function (b) {
  b.transform(brfs);
});

http.createServer(function (req, res) {
  if (req.url == '/slow.js') return bundle(false).pipe(res);
  if (req.url == '/fast.js') return bundle(true).pipe(res);

  // usually you'd to something like this:
  if (req.url == '/bundle.js') {
    bundle(process.env.NODE_ENV == 'production').pipe(res);
    return;
  }

  res.end('oops');
}).listen(9000, function () {
  console.log('open http://localhost:9000/slow.js');
  console.log('     http://localhost:9000/fast.js');
  console.log('     http://localhost:9000/bundle.js');
});
```

## API

### var bundle = browserifyCached(entry[, fn])

Create a new `browserify-cached` instance with `entry` being the path to the
browser JavaScript entry point.

If you specify `fn` you can use that to modify the bundle before it will be
built.

### bundle(cached).pipe( ... )

Create a readable stream of your JavaScript bundle. If `cached` is true, it
will create and/or serve a cached version.

## TODO

* invalidate cache based on mtime

## Installation

With [npm](https://npmjs.org) do:

```
npm install browserify-cached
```

## License

(MIT)

Copyright (c) 2013 Julian Gruber &lt;julian@wayla.com&gt;

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.