const asyncDivision = require("./asyncDivision");

asyncDivision(10, 2, (error, result) => {
  if (error) {
    return console.error(error);
  }
  console.log(result);
});

asyncDivision(10, 2)
  .then(val => {
    console.log("Value is: ", val);
  })
  .catch(err => {
    console.log("The error is: ", err);
  });
