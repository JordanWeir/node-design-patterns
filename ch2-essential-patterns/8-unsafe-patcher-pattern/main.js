const logger = require("./logger");
require("./patcher");

logger.log("This is an informational message");

var customLogger = new logger.Logger("Custom");

customLogger.log("This is a custom informational message");

// The logger module has no customMessage.  The patcher is monkey-patching the global object, adding that functionality.
// Patcher doesn't actually export anything at all.
// In general, this is a bad pattern. Modules shouldn't be modifying the global namespace, and this kind of side effect is dangerous.
logger.customMessage();
