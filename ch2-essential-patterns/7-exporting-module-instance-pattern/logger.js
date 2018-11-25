// Exports an instance of the logger. Because Require cache's modules, when it's required in another file, it *almost* always refers to the same instance.
// Note though that multiple instances of a module can be loaded by a project when dependencies have dependencies.
// If your npm dependencies are dependant on this module, then you can end up with multiple copies of this running, instead of a single version cached and used everywhere.

function Logger(name) {
  this.count = 0;
  this.name = name;
}

Logger.prototype.log = function(message) {
  this.count++;
  console.log(`[${this.name}]: ${message}`);
};

module.exports = new Logger("DEFAULT");

// We can also make availble the constructor itself, so that while a default instance is available globally, if there's a need to instantiate a new instance, it can be done.
module.exports.Logger = Logger;
