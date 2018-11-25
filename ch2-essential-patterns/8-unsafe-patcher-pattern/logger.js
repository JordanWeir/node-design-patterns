// Exports an instance of the logger. Because Require cache's modules, when it's required in another file, it *almost* always refers to the same instance.
function Logger(name) {
  this.count = 0;
  this.name = name;
}

Logger.prototype.log = function(message) {
  this.count++;
  console.log(`[${this.name}]: ${message}`);
};

module.exports = new Logger("DEFAULT");
module.exports.Logger = Logger;
