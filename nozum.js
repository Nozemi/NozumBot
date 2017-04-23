const mysql     = require('mysql');
const database  = require('./settings.json').database;

module.exports = {
    updateUser: function(command, client, message) {
      var connection = mysql.createConnection({
        host      : database.host,
        user      : database.user,
        password  : database.pass,
        database  : database.name
      });

      connection.connect();

      connection.query("SELECT `U`.`username`, `G`.`discordId` FROM `" + database.pref + "users` `U` INNER JOIN `" + database.pref + "groups` `G` ON `G`.`id` = `U`.`group` WHERE `U`.`discordId` = '" + message.author.id + "'", function(error, results, fields) {
        if(error) {
          console.log(error); return;
        }

        if(!results) {
          return message.reply("Sorry, no user were found.");
        }

        var guild = client.guilds.array()[0];
        var user = guild.member(message.author);

        if(user.owner) { return console.log("Can't manage owner account"); }

        var role = guild.roles.get(results[0].discordId);
        user.setNickname(results[0].username);
        user.addRole(role);

        message.reply("I successfully updated you.");
      });

      connection.end();
    }
}
