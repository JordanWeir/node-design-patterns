function* twoWayGenerator() {
  const what = yield null;
  console.log(`hello ${what}`);
}

const twoWay = twoWayGenerator();
twoWay.next();
twoWay.throw(new Error());
