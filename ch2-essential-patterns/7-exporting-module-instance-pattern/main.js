const logger = require("./logger");

logger.log("This is an informational message");

var customLogger = new logger.Logger("Custom");

customLogger.log("This is a custom informational message");
