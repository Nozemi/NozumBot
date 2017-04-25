const fileSystem    = require('fs');
const logDirectory  = './logs';
const logStdout     = process.stdout;

module.exports = {
  logCommands: function(message) {
    // Logs commands done by members.
    processLog("commands", message);
  },
  logMessages: function(message) {
    // Logs messages sent by members.
    processLog("messages", message);
  },
  logWarnings: function(message) {
    // Warnings would be misconfigurations, and other useful stuff that should
    // be easily resolved by changing the config file, or installing necessary modules.
    processLog("warning", message);
  },
  logBotStatus: function(message) {
    // Logs whenever the bot disconnects, connects, reconnects, and is ready.
    processLog("status", message);
  }
}

// TODO: Fix the logging, so it logs to the files.
function processLog(type, message) {
  if(!fileSystem.existsSync(logDirectory)) {
    fileSystem.mkdirSync(logDirectory);
  }
  var logFile = logDirectory + "/";

  switch(type) {
    case 'status':
      logFile += "status.log";
      break;
    case 'warning':
      logFile += "warnings.log";
      break;
    case 'messages':
      logFile += "messages.log";
      break;
    case 'commands':
      logFile += "commands.log";
      break;
  }

  logFile = fileSystem.createWriteStream(logFile);
  logFile.write(getDateTime() + ": " + message + "\n");
  logStdout.write(getDateTime() + ": " + message + "\n");
}

function getDateTime() {

    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    return year + ":" + month + ":" + day + "-" + hour + ":" + min + ":" + sec;

}
