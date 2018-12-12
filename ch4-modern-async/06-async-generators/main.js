const asyncFlow = require("./asyncFlow");
const fs = require("fs");
const path = require("path");

asyncFlow(function*(callback) {
  const fileName = path.basename(__filename);
  const myself = yield fs.readFile(fileName, "utf8", callback);
  yield fs.writeFile(`clone_of_${fileName}`, myself, callback);
  console.log("Clone created");
});
