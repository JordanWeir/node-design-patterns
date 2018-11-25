// The general structure of the iterate function is...
(function() {
  function iterate(index) {
    if (index === tasks.length) {
      return finish();
    }
    const task = tasks[index];
    task(() => {
      iterate(index + 1);
    });
  }

  function finish() {
    // Run code at end of iteration.
    console.log("All tasks have ran");
  }

  const timedLog = time => message => callback => {
    setTimeout(() => {
      console.log(message);
      callback();
    }, time);
  };

  const asyncTask1 = timedLog(1000)("async1 Finished!");
  const asyncTask2 = timedLog(2000)("async2 Finished!");
  const asyncTask3 = timedLog(3000)("async3 Finished!");

  const tasks = [asyncTask1, asyncTask2, asyncTask3];

  iterate(0);
})();
