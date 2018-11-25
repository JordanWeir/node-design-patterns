// One common idea is the principle of small surface area.
// Expose primary functionality through a simple and easy to use means.
// Expose more complex and niche functionality as functions on a namespace.

// Quoting the pattern from the book...
// Create a function that accepts a callback and returns an EventEmitter, thus providing a clear and simple entry point for the main functionality, while emitting more fine grained events using EventEmitter

// Custom implementation not from book follows.
// I've modified the example 10 from this chapter in the following ways to match the above...
//  - files are now a paramater to instantiation, rather then added with addFile
//  - find now takes a callback, which will run a function on all the matches found when the function completes
//  - find is now run at the end of instantiation, and the eventEmitter is returned, allowing users to either act on the data in realtime via events, or act after all files are read, via the callback.

const EventEmitter = require("events").EventEmitter;
const fs = require("fs");

class FindPattern extends EventEmitter {
  constructor(regex, files, callback) {
    super();
    this.regex = regex;
    this.files = files;
    return this.find(callback);
  }

  find(callback) {
    const allMatches = [];
    let processedCount = 0;
    this.files.forEach(file => {
      fs.readFile(file, "utf8", (err, content) => {
        if (err) {
          processedCount++;
          return this.emit("error", err);
        }

        this.emit("fileread", file);

        let match = null;
        if ((match = content.match(this.regex))) {
          match.forEach(elem => {
            this.emit("found", file, elem);
            allMatches.push({ file, elem });
          });
        }
        processedCount++;
        if (this.files.length == processedCount) {
          callback(allMatches);
        }
      });
    });
    return this;
  }
}

const findPatternObject = new FindPattern(
  /hello \w+/g,
  [
    "fileA.txt",
    "fileB.json",
    "fileA.1.txt",
    "fileB.1.json",
    "fileA.2.txt",
    "fileB.2.json"
  ],
  matches =>
    console.log("Finished processing.  Found ", matches.length, " matches.")
)
  .on("fileread", file => console.log(`${file} was read`))
  .on("found", (file, match) => console.log(`Matched ${match} in file ${file}`))
  .on("error", err => console.log(`Error emitted: ${err.message}`));
