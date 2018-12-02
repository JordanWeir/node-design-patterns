// @ts-check

const async = require("async");
const request = require("request");
const fs = require("fs");
const mkdirp = require("mkdirp");
const path = require("path");
const utilities = require("./utilities");

const spidering = new Map();
function spider(url, nesting, callback) {
  if (spidering.has(url)) {
    return process.nextTick(callback);
  }
  spidering.set(url, true);

  const filename = "downloads/" + utilities.urlToFilename(url);
  fs.readFile(filename, "utf8", (err, body) => {
    if (err) {
      if (err.code !== "ENOENT") {
        return callback(err);
      }

      return download(url, filename, (err, body) => {
        if (err) {
          return callback(err);
        }
        spiderLinks(url, body, nesting, callback);
      });
    }

    spiderLinks(url, body, nesting, callback);
  });
}

function download(url, filename, callback) {
  console.log(`Downlading file: ${filename}`);
  let body;

  async.series(
    [
      callback => {
        request(url, (err, response, resBody) => {
          if (err) {
            return callback(err);
          }
          body = resBody;
          callback();
        });
      },
      mkdirp.bind(null, path.dirname(filename)),
      callback => {
        fs.writeFile(filename, body, callback);
      }
    ],
    err => {
      if (err) {
        return callback(err);
      }
      console.log(`Downloaded and saved: ${url}`);
      callback(null, body);
    }
  );
}

function spiderLinks(currentUrl, body, nesting, callback) {
  if (nesting === 0) {
    return process.nextTick(callback);
  }

  const links = utilities.getPageLinks(currentUrl, body);
  if (links.length === 0) {
    return process.nextTick(callback);
  }

  async.eachSeries(
    links,
    (link, callback) => {
      spider(link, nesting - 1, callback);
    },
    callback
  );
}

spider("http://blog.cleancoder.com/", 1, (err, message) => {
  if (err) {
    console.log("An error occurred, error:", err);
  } else {
    console.log(message);
  }
});
