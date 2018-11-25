// @ts-check

const request = require("request");
const fs = require("fs");
const mkdirp = require("mkdirp");
const path = require("path");
const utilities = require("./utilities");

function spider(url, callback) {
  const filename = "downloads/" + utilities.urlToFilename(url);
  fs.exists(filename, exists => {
    if (exists) {
      return callback(null, filename, false);
    }
    download(url, filename, err => {
      if (err) {
        return callback(err);
      }
      callback(null, filename, true);
    });
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

spider("http://blog.cleancoder.com/", (err, filename, downloadRequired) => {
  if (err) {
    console.log("An error occurred, error:", err);
  } else {
    console.log(
      "Download Successful -",
      filename,
      "and downloadRequired = ",
      downloadRequired
    );
  }
});
