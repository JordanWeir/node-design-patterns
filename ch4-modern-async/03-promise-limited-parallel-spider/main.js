// @ts-check

const async = require("async");
const utilities = require("./utilities");

const request = utilities.promisify(require("request"));
const mkdirp = utilities.promisify(require("mkdirp"));
const fs = require("fs");
const readFile = utilities.promisify(fs.readFile);
const writeFile = utilities.promisify(fs.writeFile);

const path = require("path");

const TaskQueue = require("./taskQueue");
const downloadQueue = new TaskQueue(2);

const spidering = new Map();
function spider(url, nesting, callback) {
  //if (spidering.has(url)) {
  // return process.nextTick(callback);
  //}
  // spidering.set(url, true);

  const filename = "downloads/" + utilities.urlToFilename(url);

  return readFile(filename, "utf8").then(
    body => spiderLinks(url, body, nesting),
    err => {
      if (err.code !== "ENOENT") {
        throw err;
      }

      return download(url, filename).then(body =>
        spiderLinks(url, body, nesting)
      );
    }
  );
}

function download(url, filename, callback) {
  console.log(`Downloading file: ${filename}`);
  let body;

  return request(url)
    .then(response => {
      body = response.body;
      return mkdirp(path.dirname(filename));
    })
    .then(() => writeFile(filename, body))
    .then(() => {
      console.log(`Download and saved: ${url}`);
      return body;
    });
}

function spiderLinks(currentUrl, body, nesting, callback) {
  if (nesting === 0) {
    return Promise.resolve();
  }

  const links = utilities.getPageLinks(currentUrl, body);
  if (links.length === 0) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    let completed = 0;
    let errored = false;
    links.forEach(link => {
      let task = () => {
        return spider(link, nesting - 1)
          .then(() => {
            if (++completed === links.length) {
              resolve();
            }
          })
          .catch(() => {
            if (!errored) {
              errored = true;
              reject();
            }
          });
      };
      downloadQueue.pushTask(task);
    });
  });
}

spider("http://blog.cleancoder.com/", 1)
  .then(() => console.log("Download Complete"))
  .catch(err => console.log(err));
