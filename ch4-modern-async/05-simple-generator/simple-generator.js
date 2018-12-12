function* fruitGenerator() {
  yield "apple";
  yield "oragen";
  return "watermelon";
}

const newFruitGenerator = fruitGenerator();
console.log(newFruitGenerator.next());
console.log(newFruitGenerator.next());
console.log(newFruitGenerator.next());
