const fs = require("fs");
const path = require("path");


// ==========================================
// LOG DIRECTORY
// ==========================================
const logDirectory = path.join(
  __dirname,
  "../logs"
);

// Create Logs Folder If Not Exists
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}


// ==========================================
// WRITE LOG FUNCTION
// ==========================================
const writeLog = (
  type,
  message
) => {
  const currentDate = new Date();

  const formattedDate =
    currentDate.toISOString();

  const logMessage = `[${formattedDate}] [${type.toUpperCase()}] ${message}\n`;

  const logFilePath = path.join(
    logDirectory,
    `${type}.log`
  );

  fs.appendFileSync(
    logFilePath,
    logMessage
  );

  console.log(logMessage);
};


// ==========================================
// LOGGER METHODS
// ==========================================
const logger = {
  info: (message) =>
    writeLog("info", message),

  error: (message) =>
    writeLog("error", message),

  warning: (message) =>
    writeLog("warning", message),

  success: (message) =>
    writeLog("success", message),
};

module.exports = logger;