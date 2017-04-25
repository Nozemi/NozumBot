const Discord   = require('discord.js');
const client    = new Discord.Client();
const settings  = require('./settings.json').general;
const database  = require('./settings.json').database;
const request   = require('request');
const nozum     = require('./nozum.js');
const logging   = require('./logging.js');

client.on('ready', () => {
  // When the bot is ready.
  logging.logBotStatus("Bot is ready.");

  if(updateInterval !== null) {
    clearInterval(updateInterval);
  }
  logging.logWarnings("User Sync Interval: " + settings.userSyncInterval);

  if(!database.dbhost || !database.dbuser || !database.dbpass || !database.dbname) {
    //console.log(getDateTime() + ": No database credentials.");
    logging.logWarnings("There is no database configurations in the settings.json file.");
  } else {
    var updateInterval = setInterval(function() {
      nozum.syncUsers(client);
    }, settings.userSyncInterval);
  }
});

client.on('reconnecting', () => {
  // Log the reconnects.
  console.log('Bot reconnected.');
  logging.logBotStatus("Bot reconnected.");
});

client.on('disconnect', () => {
  // Log the disconnects.
  console.log('Bot disconnected.');
  logging.logBotStatus("Bot disconnected.");
});

var prefix = settings.prefix;
client.on('message', message => {
  // Checks if the message sender is the bot itself. If it is, we don't want it to
  // respond to it's own messages.
  if(message.author.bot) return;

  // We're checking if the message starts with the prefix defined in the settings.json file.
  // If that is the case, we're checking what kind of command is run.
  if(message.content.startsWith(prefix)) {
    //console.log(getDateTime() + ": " + message.content + " | Author: " + message.author.username + " (" + message.author.id + ")");
    var command = message.content.split(" "); // We're splitting the command into separate words. Each word can be an argument.
    command[0] = command[0].replace('#', ''); // We'll be replacing the prefix with nothing, so we just have the command without the prefix.
    message.delete();

    logging.logCommands(message.author.username + " just tried " + settings.prefix + command[0]);

    // Will handle all the commands.
    switch(command[0]) {
      case 'ping':
        message.reply('pong!');
        break;
      case 'debuginfo':
        var guilds = client.guilds.array();
        var roles = guilds[0].roles.array();

        for(var i = 0; i < roles.length; i++) {
          message.author.sendMessage("Role Name: " + roles[i].name + "\n" + "Role ID: " + roles[i].id);
        }

        //message.reply(message.author.id);
        break;
      case 'update':
        if(!database.dbhost || !database.dbuser || !database.dbpass || !database.dbname) {
          message.reply("sorry, unable to update your account at this time.");
        } else {
          var guild = client.guilds.array()[0];
          var member = guild.member(message.author);

          if(command[1] && message.author.id === "119511624250949633") {
            member = guild.member(message.mentions.users.first());
          }

          nozum.updateUser(member, client, false);
        }
        break;
      case 'myId':
        message.member.sendMessage("Your ID is: " + message.member.id + ". Go to http://nozum.wdnsbn.com/ and change your Discord ID from your user CP.");
        break;
      case 'nick':
        var guild = client.guilds.array()[0];
        var member = guild.member(message.author);
        member.setNickname("Someone");
        break;
    }
  }
});

// Makes the bot login.
client.login(settings.token);
