const util = require('minecraft-server-util');
const Discord = require('discord.js');
const fs = require('fs');
const mcIp = "bsamemes.mcs.cx";
const token = fs.readFileSync("./minecraft_token.txt", "utf-8");
const client = new Discord.Client();

setInterval(function() {
    util.status(mcIp) // port is default 25565
    .then((response) => {
        console.log(response.onlinePlayers);
        players = response.onlinePlayers;
        if (players != 1) client.user.setActivity(` with ${players} players!`)
        else client.user.setActivity(` with ${players} player!`)

    })
}, 60000);

client.login(token);
