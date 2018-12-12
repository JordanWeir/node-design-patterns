module.exports = function asyncDivision(dividend, divisor, cb) {
  return new Promise((resolve, reject) => {
    process.nextTick(() => {
      const result = dividend / divisor;
      if (isNaN(result) || !Number.isFinite(result)) {
        const error = new Error("Invalid Operator");
        if (cb) {
          cb(error);
        }
        return reject(error);
      }

      if (cb) {
        cb(null, result);
      }
      resolve(result);
    });
  });
};
