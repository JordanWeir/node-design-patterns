// @ts-check

const request = require("request");
const fs = require("fs");
const mkdirp = require("mkdirp");
const path = require("path");
const utilities = require("./utilities");

function spider(url, nesting, callback) {
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

function spiderLinks(currentUrl, body, nesting, callback) {
  if (nesting === 0) {
    return process.nextTick(callback);
  }
  const links = utilities.getPageLinks(currentUrl, body);

  let completed = 0,
    hasErrors = false;

  function done(err) {
    if (err) {
      hasErrors = true;
      return callback(err);
    }
    if (++completed === links.length && !hasErrors) {
      return callback(null, "Downloads Successful");
    }
  }

  links.forEach(link => {
    spider(link, nesting - 1, done);
  });
}

function saveFile(filename, contents, callback) {
  mkdirp(path.dirname(filename), err => {
    if (err) {
      return callback(err);
    }
    fs.writeFile(filename, contents, callback);
  });
}

function download(url, filename, callback) {
  console.log(`Downloading - ${url}`);
  request(url, (err, response, body) => {
    if (err) {
      return callback(err);
    }
    saveFile(filename, body, err => {
      if (err) {
        return callback(err);
      }
      console.log("Downloaded and saved: ", url);
      callback(null, body, true);
    });
  });
}

spider("http://blog.cleancoder.com/", 1, (err, message) => {
  if (err) {
    console.log("An error occurred, error:", err);
  } else {
    console.log(message);
  }
});
