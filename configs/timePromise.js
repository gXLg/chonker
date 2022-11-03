class TimePromise extends Promise {

  constructor(callback, timeout){

    const status = {
      "resolved": false,
      "pending": true,
      "rejected": false,
      "timedout": false
    };

    let res, rej;

    super((resolve, reject) => {
      res = (...a) => {
        status.pending = false;
        status.resolved = true;
        resolve(...a)
      };
      rej = (...a) => {
        status.pending = false;
        status.rejected = true;
        reject(...a);
      };
      return callback(res, rej, status);
    });
    this.resolve = res;
    this.reject = rej;
    this.status = status;

    if(timeout !== undefined){
      this.timeout = setTimeout(() => {
        if(!this.status.pending) return;
        this.status.timedout = true;
        this.status.pending = false;
        this.resolve(null);
      }, timeout);
    }
  }
}

module.exports = TimePromise;