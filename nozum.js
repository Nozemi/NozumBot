const mysql     = require('mysql');
const database  = require('./settings.json').database;

module.exports = {
    updateUser: function(user) {
      var connection = mysql.createConnection({
        host      : database.host,
        user      : database.user,
        password  : database.pass,
        database  : database.name
      });

      connection.connect();

      connection.query("SELECT `U`.`username`, `G`.`discordId` FROM `" + database.pref + "users` `U` INNER JOIN `" + database.pref + "groups` `G` ON `G`.`id` = `U`.`group` WHERE `U`.`discordId` = '" + user.id + "'", function(error, results, fields) {
        if(error) {
          console.log(error); return;
        }

        if(!results) {
          return message.reply("Sorry, no user were found.");
        }

        var member = guild.member(user);

        if(member.owner) { return console.log("Can't manage owner account"); }

        var role = guild.roles.get(results[0].discordId);
        member.setNickname(results[0].username);
        member.addRole(role);

        message.reply("I successfully updated you.");
      });

      connection.end();
    },

    syncUsers: function(client) {
      var guild = client.guilds.first();
      var members = guild.members.array();

      for(var i = 0; i < members.length; i++) {
        //members[i].sendMessage("Hello there! I'm a bot, I'm going to be fucking annoying!");
        console.log("Updating: " + (members[i].nickname ? members[i].nickname : members[i].user.username));
        this.updateUser(members[i].user);
      }
      console.log("=============================");
    }
}
