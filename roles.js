module.exports = {
  updateRoles: function(command, client, message, request) {
    var url = "https://nozum.wdnsbn.com/api/groups.php";
    request({
      url: url,
      json: true
    }, function(error, response, body) {
      if(!error && response.statusCode === 200) {
        var channel = message.channel;
        var guilds = client.guilds.array();

        if(!guilds) {
          message.reply('No guilds were found.');
          return;
        }

        var guild = null;

        for(var i = 0; i < guilds.length; i++) {
          console.log('ID: ' + guilds[i].id);

          if(guilds[i].id == "302396345397018626") {
            guild = guilds[i];
          }
        }

        for(var i = 0; i < body.length; i++) {
          if(guild && guild.available) {
            guild.createRole({name:body[i].name, hoist:true, position:1});
          } else {
            message.reply('Sorry, the guild is not currently available.'); return;
          }
        }
      }
    })
  },
  updateMembers: function(command, client, message, request) {
    var url = "https://nozum.wdnsbn.com/api/member.php?member=" + command[1];
  }
}
