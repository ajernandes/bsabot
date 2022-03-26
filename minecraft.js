const Discord = require('discord.js');
const util = require('minecraft-server-util');
const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
const fs = require('fs');
const mcIp = "bsamemes.ggs.onl";
const token = fs.readFileSync("./minecraft_token.txt", "utf-8");

setInterval(function() {
    try {
      util.status(mcIp, { port: 25565, enableSRV: true, timeout: 5000, protocolVersion: 47 }) // These are the default options
      .then((response) => {
        console.log(response.onlinePlayers);
        players = response.onlinePlayers;
        if (players != 1) client.user.setActivity(` with ${players} players!`)
          else client.user.setActivity(` with ${players} player!`)
        })
    } catch (error) {
      console.error(error);
    }
  }, 300000);

client.login(token);
