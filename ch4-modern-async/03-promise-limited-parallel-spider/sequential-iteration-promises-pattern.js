let tasks = [
  /* An array of tasks to execute */
];

let promise = Promise.resolve();

tasks.forEach(task => {
  promise = promise.then(() => {
    return task();
  });
});

promise.then(() => {
  // All tasks are now complete.
});

/*
 * Alternatively, you can use reduce for a more compact solutino.
 *
 */

let tasks = [
  /* An array of tasks to execute */
];

tasks.reduce((promiseList, task) => {
  return promiseList.then(() => task());
}, Promise.resolve());

promise.then(() => {
  // All tasks are now complete.
});
