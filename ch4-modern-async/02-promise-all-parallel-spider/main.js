// @ts-check

const async = require("async");
const utilities = require("./utilities");

const request = utilities.promisify(require("request"));
const mkdirp = utilities.promisify(require("mkdirp"));
const fs = require("fs");
const readFile = utilities.promisify(fs.readFile);
const writeFile = utilities.promisify(fs.writeFile);

const path = require("path");

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
  let promise = Promise.resolve();
  if (nesting === 0) {
    return promise;
  }

  const links = utilities.getPageLinks(currentUrl, body);
  const promises = links.map(link => {
    spider(link, nesting - 1);
  });

  return Promise.all(promises);
}

spider("http://blog.cleancoder.com/", 1)
  .then(() => console.log("Download Complete"))
  .catch(err => console.log(err));
