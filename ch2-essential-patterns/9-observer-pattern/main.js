// EventEmitter used in a function that reads files and returns lines matching a regex.
// Note that the function returns a new instance of the EventEmitter, and that we then apply listeners immediately on use.
// Multiple listeners are applied, and they deal with different cases.  This would be significantly messier with callbacks.

// Error Propagation
// The convention when using EventEmitter is to propagate errors by emitting an event.
// Emitted a special event for errors, "error" in this case, and then handling errors by listening is the favored methodology.

const EventEmitter = require("events").EventEmitter;
const fs = require("fs");

function findPattern(files, regex) {
  const emitter = new EventEmitter();
  files.forEach(function(file) {
    fs.readFile(file, "utf8", (err, content) => {
      if (err) {
        return emitter.emit("error", err);
      }

      emitter.emit("fileread", file);
      let match;
      if ((match = content.match(regex))) {
        match.forEach(elem => emitter.emit("found", file, elem));
      }
    });
  });

  return emitter;
}

// We know the events themselves won't fire until the next tick of the event loop, as they are async, so we have time to add listeners.
// This wouldn't work if we were reading the files syncronously.
// If we did need it to work syncronously, we would have to register the listeners before the 'readFile' function was run inside the function.
findPattern(["fileA.txt", "fileB.json"], /hello \w+/g)
  .on("fileread", file => console.log(`${file} was read`))
  .on("found", (file, match) => console.log(`Matched ${match} in file ${file}`))
  .on("error", err => console.log(`Error emitted: ${err.message}`));
