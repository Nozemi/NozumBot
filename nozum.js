const mysql     = require('mysql');
const database  = require('./settings.json').database;
const logging   = require('./logging.js');

module.exports = {
    updateUser: function(member, client, sync = true) {
      logging.logCommands("About to update user, " + member.displayName);

      var connection = mysql.createConnection({
        host      : database.dbhost,
        user      : database.dbuser,
        password  : database.dbpass,
        database  : database.dbname
      });

      connection.connect();

      connection.query("SELECT `U`.`username`, `G`.`discordId` FROM `" + database.dbpref + "users` `U` INNER JOIN `" + database.dbpref + "groups` `G` ON `G`.`id` = `U`.`group` WHERE `U`.`discordId` = '" + member.id + "'", function(error, results, fields) {
        if(error) {
          console.log(error); return;
        }

        var guild = client.guilds.array()[0];
        var roles = guild.roles;

        if(!results[0]) {
          if(!sync) {
            member.sendMessage("Sorry, you're not found in the database. Are you sure you added your ID? Do: #myId in the WDNSBN server to obtain your ID.");
          }
          logging.logCommands(member.nickname + " not found in the database.");
          member.removeRoles(roles);
          member.setNickname("");
          return;
        }
        member.removeRoles(roles);
        var role = guild.roles.get(results[0].discordId);

        setTimeout(function() {
          member.setNickname((results[0].username ? results[0].username : ""));
          member.addRole(role);
        }, 500);

        logging.logCommands("Successfully updated user, " + member.nickname);
        if(!sync) {
          member.sendMessage("I successfully updated you.");
        }
      });

      connection.end();
    },

    syncUsers: function(client) {
      var guild = client.guilds.first();
      var members = guild.members.array();

      for(var i = 0; i < members.length; i++) {
        //members[i].sendMessage("Hello there! I'm a bot, I'm going to be fucking annoying!");
        //console.log("Updating: " + (members[i].nickname ? members[i].nickname : members[i].user.username));
        this.updateUser(members[i], client);
      }
      console.log("=============================");
    }
}
