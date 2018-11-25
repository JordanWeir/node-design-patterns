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
    finalCallback();
  }

  iterate(0);
};

module.exports = iterateSeries;
