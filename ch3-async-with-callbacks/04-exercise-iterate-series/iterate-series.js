// The general structure of the iterate function is...
var iterateSeries = function(collection, iteratorCallback, finalCallback) {
  function iterate(index) {
    if (index === collection.length) {
      return finish();
    }
    const task = collection[index];
    task((err, data) => {
      iteratorCallback(err, data);
      iterate(index + 1);
    });
  }

  function finish() {
    // Run code at end of iteration.
    finalCallback();
  }

  iterate(0);
};

module.exports = iterateSeries;
