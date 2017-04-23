const Discord   = require('discord.js');
const client    = new Discord.Client();
const settings  = require('./settings.json').general;
const request   = require('request');
const nozum     = require('./nozum.js');

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
        var webUser = nozum.updateUser(command, client, message);
        break;
      case 'myId':
        message.member.sendMessage("Your ID is: " + message.member.id + ". Go to http://nozum.wdnsbn.com/ and change your Discord ID from your user CP.");
        break;
      case 'nick':
        var guild = client.guilds.array()[0];
        var member = guild.member(message.author);
        member.setNickname("Someone");
        break;
      case 'test':
        message.channel.sendMessage("", {embed: {
          color: 3447003,
          author: {
            name: message.author.username,
            icon_url: message.author.avatarURL
          },
          title: 'This is an embed',
          url: 'http://google.com',
          description: 'This is a test embed to showcase what they look like and what they can do. So if I were to add a lot of text, what would happen then?',
          fields: [
            {
              name: 'Fields',
              value: 'They can have different fields with small headlines.'
            },
            {
              name: 'Masked links',
              value: 'You can put [masked links](http://google.com) inside of rich embeds.'
            },
            {
              name: 'Markdown',
              value: 'You can put all the *usual* **__Markdown__** inside of them.'
            }
          ],
          timestamp: new Date(),
          footer: {
            icon_url: message.author.avatarURL,
            text: '© Example'
          }
        }});
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
