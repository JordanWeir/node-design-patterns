const iterateSeries = require("./iterate-series");

const timedLog = time => message => callback => {
  setTimeout(() => {
    // console.log(message);
    callback(null, message);
  }, time);
};

const asyncTask1 = timedLog(1000)("async1 Finished!");
const asyncTask2 = timedLog(2000)("async2 Finished!");
const asyncTask3 = timedLog(3000)("async3 Finished!");

const tasks = [asyncTask1, asyncTask2, asyncTask3];

iterateSeries(
  tasks,
  (err, message) => console.log("Task completed, message is: ", message),
  () => console.log("All Tasks Completed")
);
