// In a substack pattern, you reassign exports to a function, and that's the only way the module is used.
// Beneficial because a single entry point makes it very clear how to use it.

module.exports = message => {
  console.log(`info: ${message}`);
};

// An extension of this is to add more specific, advanced, or niche use cases by using the exported function as a namespace.
module.exports.verbose = message => {
  console.log(`verbose: ${message}`);
};

// Creating APIS in this way puts the focus back on the Single Responsibility Principle.  The main functionality is covered by the primary function that's returned.
// Auxillary functionality is added to the function through that namespace.
