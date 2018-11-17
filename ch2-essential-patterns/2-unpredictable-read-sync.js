// Example from the book, node design patterns.
// Shows how a function that is sometimes async and sometimes sync can behave unpredictably.

const fs = require("fs");
const cache = {};
function inconsistentRead(filename) {
  if (cache[filename]) {
    // This is syncronous
    return cache[filename];
  } else {
    // This is async
    cache[filename] = fs.readFileSync(filename, "utf8");
    return cache[filename];
  }
}

// Calling the function multiple times like this works.
console.log(inconsistentRead("./testfile.txt"));
console.log(inconsistentRead("./testfile.txt"));
console.log(inconsistentRead("./testfile.txt"));

// Lets try and use it in another function though.

// createFileReader takes a single file, and allows you to add event listeners that trigger with the file data when it's loaded.
function createFileReader(filename) {
  var data = inconsistentRead(filename);

  return {
    onDataReady: listener => listener(data)
  };
}

// This works because it's on the same tick of the event loop.
var reader1 = createFileReader("./testfile.txt");
reader1.onDataReady(console.log.bind(null, "First call result: "));
reader1.onDataReady(console.log.bind(null, "Second call result: "));

// What if we execute on the next tick?
// This still fires, because it adds the listeners before the reader finishes reading the file, and so is async.
setTimeout(() => {
  var reader2 = createFileReader("./testfile.txt");
  reader2.onDataReady(console.log.bind(null, "Reader2, First call result: "));
  reader2.onDataReady(console.log.bind(null, "Reader2, Second call result: "));
}, 0);

// What if we execute 1 second later?
// This doesn't fire, because the result is now cached, and the inconsistent read is operating syncronously.
// The onDataReady adds listeners to the array, but the array has already been parsed and executed on.
setTimeout(() => {
  var reader3 = createFileReader("./testfile.txt");
  reader3.onDataReady(console.log.bind(null, "Reader3, First call result: "));
  reader3.onDataReady(console.log.bind(null, "Reader3, Second call result: "));
}, 1000);
