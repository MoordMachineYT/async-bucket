"use strict";

class Bucket {
  constructor(options = {}) {
    this.concurrency = options.concurrency || Infinity;
    this.jobs = [];
    this.pending = 0;
    this.cbs = [];
    this._done = this._done.bind(this);
  }
  get length() {
    return this.jobs.length + this.pending;
  }
  onDone(cb) {
    if(typeof cb === "function") {
      this.cbs.push(cb);
      this._run();
    }
  }
  _run() {
    if (this.pending === this.concurrency) {
      return;
    }
    if (this.jobs.length) {
      this.pending++;
      this.jobs.shift()(this._done);
      this._run();
    }
  
    if (this.pending === 0) {
      while (this.cbs.length !== 0) {
        process.nextTick(this.cbs.pop());
      }
    }
  }
  _done() {
    this.pending--;
    this._run();
  }
}

for(const method of ["push", "unshift", "splice"]) {
  Bucket.prototype[method] = function() {
    const res = Array.prototype[method].apply(this.jobs, arguments);
    this._run();
    return res;
  }
}

module.exports = Bucket;