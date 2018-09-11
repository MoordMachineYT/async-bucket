# Async-Bucket
A minimal library for throttling async concurrency. Rewrited version of [async-limiter](https://github.com/STRML/async-limiter).

## Example
Copied from [async-limiter](https://github.com/STRML/async-limiter).
```js
var Limiter = require('async-bucket');

var t = new Limiter({concurrency: 2});
var results = [];

// add jobs using the familiar Array API
t.push(function (cb) {
  results.push('two');
  cb();
});

t.push(
  function (cb) {
    results.push('four');
    cb();
  },
  function (cb) {
    results.push('five');
    cb();
  }
);

t.unshift(function (cb) {
  results.push('one');
  cb();
});

t.splice(2, 0, function (cb) {
  results.push('three');
  cb();
});

// Jobs run automatically. If you want a callback when all are done,
// call 'onDone()'.
t.onDone(function () {
  console.log('all done:', results)
});
```