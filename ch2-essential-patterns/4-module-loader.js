function loadModule(filename, module, require) {
  const wrappedSrc = `(function(module, exports, require) {
        ${fs.readFileSync(filename, "utf8")}
    })(module, module.export, require);`;
  eval(wrappedSrc);
}

const require = moduleName => {
  console.log(`Require invoked for: ${moduleName}`);
  const id = require.resolve(moduleName);
  if (require.cache[id]) {
    return require.cache[id].exports;
  }

  // module metadata
  const module = {
    exports: {},
    id: id
  };

  // Update the cache
  require.cache[id] = module;

  // load the module
  loadModule(id, module, require);

  // return exported variables
  return module.exports;
};

require.cache = {};
require.resolve = moduleName => {
  /* resolve a full module id from the moduleName */
};
