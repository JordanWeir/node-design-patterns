// Example from the book, node design patterns.
// Shows how a function that is sometimes async and sometimes sync can behave unpredictably.

const fs = require("fs");
const cache = {};
function inconsistentRead(filename, callback) {
  if (cache[filename]) {
    // This is syncronous
    callback(cache[filename]);
  } else {
    // This is async
    fs.readFile(filename, "utf8", (err, data) => {
      cache[filename] = data;
      callback(data);
    });
  }
}

// Calling the function multiple times like this works.
inconsistentRead("./textfile.txt", console.log);
inconsistentRead("./textfile.txt", console.log);
inconsistentRead("./textfile.txt", console.log);

// Lets try and use it in another function though.

// createFileReader takes a single file, and allows you to add event listeners that trigger with the file data when it's loaded.
function createFileReader(filename) {
  const listeners = [];
  inconsistentRead(filename, value => {
    listeners.forEach(listener => listener(value));
  });

  return {
    onDataReady: listener => listeners.push(listener)
  };
}

// This works because it's on the same tick of the event loop.
var reader1 = createFileReader("./textfile.txt");
reader1.onDataReady(console.log.bind(null, "First call result: "));
reader1.onDataReady(console.log.bind(null, "Second call result: "));

// What if we execute on the next tick?
// This still fires, because it adds the listeners before the reader finishes reading the file, and so is async.
setTimeout(() => {
  var reader2 = createFileReader("./textfile.txt");
  reader2.onDataReady(console.log.bind(null, "Reader2, First call result: "));
  reader2.onDataReady(console.log.bind(null, "Reader2, Second call result: "));
}, 0);

// What if we execute 1 second later?
// This doesn't fire, because the result is now cached, and the inconsistent read is operating syncronously.
// The onDataReady adds listeners to the array, but the array has already been parsed and executed on.
setTimeout(() => {
  var reader3 = createFileReader("./textfile.txt");
  reader3.onDataReady(console.log.bind(null, "Reader3, First call result: "));
  reader3.onDataReady(console.log.bind(null, "Reader3, Second call result: "));
}, 1000);
