const Discord   = require('discord.js');
const client    = new Discord.Client();
const settings  = require('./settings.json').general;
const request   = require('request');

const roles     = require('./roles.js');

client.on('ready', () => {
  // When the bot is ready.
  console.log(getDateTime() + ': Bot is ready.');
});

client.on('reconnecting', () => {
  // Log the reconnects.
  console.log(getDateTime() + ': Bot reconnected.');
});

client.on('disconnect', () => {
  // Log the disconnects.
  console.log(getDateTime() + ': Bot disconnected.');
});

var prefix = settings.prefix;
client.on('message', message => {
  // Checks if the message sender is the bot itself. If it is, we don't want it to
  // respond to it's own messages.
  //if(message.author.bot) return;

  // We're checking if the message starts with the prefix defined in the settings.json file.
  // If that is the case, we're checking what kind of command is run.
  if(message.content.startsWith(prefix)) {
    console.log(getDateTime() + ": " + message.content + " | Author: " + message.author.username + " (" + message.author.id + ")");
    var command = message.content.split(" "); // We're splitting the command into separate words. Each word can be an argument.
    command[0] = command[0].replace('#', ''); // We'll be replacing the prefix with nothing, so we just have the command without the prefix.
    message.delete();

    // Will handle all the commands.
    switch(command[0]) {
      case 'ping':
        message.reply('pong!');
        break;
      case 'debuginfo':
        var guilds = client.guilds.array();
        var roles = guilds[0].roles.array();

        for(var i = 0; i < roles.length; i++) {
        //  message.author.sendMessage("Role Name: " + roles[i].name + "\n" + "Role ID: " + roles[i].id);
        }

        //message.reply(message.author.id);
        break;
      case 'update':
        var guild = client.guilds.array()[0];
        var role = guild.roles.get("305658909274800130");

        var memb = guild.member(message.author);

        memb.addRole(role);
        break;
    }
  }
});

// Makes the bot login.
client.login(settings.token);

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
