const unidecode = require('unidecode');
const sql2 = require('sqlite3').verbose();
const sql = new sql2.Database('bsabotDB.sql');
const ms = require("ms");
const dateFormat = require("dateformat");
const Discord = require('discord.js');
const fs = require("fs");
const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });

const token = fs.readFileSync("./bsabot_token.txt");
const prefix = '.';

const serverID = "703350815494111243";
const modmail = "703350815548506121";
const modlog = "703350815548506117";
const minecraftInfo = "801948133730811935";
const welcome = "703350815884181518"
const annocReq = "703421921219575828";
const announcements = "703350815884181519";
const adminCatsChn = ["703350815548506114", "703350816416858185", "813966111905284116", "813953673432530964", "810035711339134976", "743990050001518602", "797624792995201044"];
const mcIp = "bsamemes.mcs.cx";
const invite = "https://discord.gg/cgz3tUP";

let text = fs.readFileSync("./bl_full.txt");
bl_full = text.split("\n")
let text = fs.readFileSync("./bl_less.txt");
bl_less = text.split("\n")

sql.run("CREATE TABLE IF NOT EXISTS userData (offendee TEXT, time TEXT, action TEXT, reason TEXT, author TEXT, duration TEXT, active TEXT)");


client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setPresence({
        status: 'online',
        activity: {
            name: 'Country Roads',
            type: 'LISTENING',
        }
    })
    
  });

client.on('message', msg => {
    if (msg.channel.id === annocReq && !msg.author.bot) {
        msg.react("✅");
        msg.react("❌");
        //msg.channel.send("Announcement awaiting approval!");
    }
    if (isSwear(msg) && !adminCatsChn.includes(msg.channel.parent.id) &&!adminCatsChn.includes(msg.channel.id) && !msg.author.bot) {
        msg.reply("Watch your language");
        logEvent(msg, 'Warned', `Swear filter: ${msg.content}`, null, true);
        msg.delete();
    }
    if (msg.content[0] === `${prefix}` && msg.guild != null) {
        message = msg.content.substring(1).split(' ');
        console.log(msg.content);
        switch (message[0].toLowerCase()) {
            case "help":
                if(msg.member.permissions.has("MANAGE_MESSAGES") || message.member.roles.find(r => r.name === "MC-Mod")) msg.reply('```Moderation Commands\n\n.say <message>\n.warn <user> [reason]\n.mute <user> [reason]\n.tempmute <user> <duration> [reason]\n.unmute <user> [reason]\n.kick <user> [reason]\n.ban <user> [reason]\n.tempban <user> <duration> [reason]\n.unban <user\'s id>\n.slowmode <duration>\n.clear <num of messages>\n.modmail <user> <message>\n\nMinecraft Commands\n\n.mcmute <user> [reason]\n.mcunmute <user> [reason]\n\nServer Commands\n\n.ip\n.invite```');
                else msg.reply('```.ip -- Minecraft Information\n.invite -- Gives you the server invite```');
                break;
            case "say":
                if (msg.content.split(' ')[1] === 'help' && msg.content.split(' ').length == 2) {
                    msg.reply('`Usage: .say <message>`');
                    return;
                }
                if(msg.member.permissions.has("ADMINISTRATOR")) {
                    msg.channel.send((msg.content.substring(4)));
                }
                break;
            case "warn":
                if(msg.member.permissions.has("MANAGE_ROLES")) {
                    if (msg.content.split(' ')[1] === 'help') {
                        msg.reply('`Usage: .warn <user> [reason]`');
                        return;
                    }
                    if (msg.mentions.users.first()) {
                        try {
                            let reason = msg.content.split(' ').slice(2).join(' ')
                            logEvent(msg, 'Warned', reason);
                        }
                        catch {
                            msg.reply("❌ I can't do that!");
                        }
                    }
                    else {
                        msg.reply("❌ User cannot be found");
                    }
                }
                else {
                    msg.reply("❌ You can't use that!");
                }
                break;
            case "mute":
                if(msg.member.permissions.has("MANAGE_ROLES")) {
                    if (msg.content.split(' ')[1] === 'help') {
                        msg.reply('`Usage: .mute <user> [reason]`');
                        return;
                    }
                    if (msg.mentions.users.first()) {
                        try {
                            console.log(message);
                            let reason = msg.content.split(' ').slice(2).join(' ')
                            let member = msg.mentions.users.first();
                            let role = msg.member.guild.roles.cache.find(role => role.name === "Muted");
                            if (role) msg.guild.members.cache.get(member.id).roles.add(role);
                            logEvent(msg, 'Muted', reason);
                        }
                        catch {
                            msg.reply("❌ I can't do that!");
                        }
                    }
                    else {
                        msg.reply("❌ User cannot be found");
                    }
                }
                else {
                    msg.reply("❌ You can't use that!");
                }
                break;
            case "mcmute":
                if(msg.member.permissions.has("MANAGE_ROLES") || msg.member.roles.cache.find(r => r.name === "MC-Mod")) {
                    if (msg.content.split(' ')[1] === 'help') {
                        msg.reply('`Usage: .mcmute <user> [reason]`');
                        return;
                    }
                    if (msg.mentions.users.first()) {
                        try {
                            console.log(message);
                            let reason = msg.content.split(' ').slice(2).join(' ')
                            let member = msg.mentions.users.first();
                            let role = msg.member.guild.roles.cache.find(role => role.name === "MC-Muted");
                            if (role) msg.guild.members.cache.get(member.id).roles.add(role);
                            logEvent(msg, 'MC Muted', reason);
                        }
                        catch {
                            msg.reply("❌ I can't do that!");
                        }
                    }
                    else {
                        msg.reply("❌ User cannot be found");
                    }
                }
                else {
                    msg.reply("❌ You can't use that!");
                }
                break;
            case "mcunmute":
                if(msg.member.permissions.has("MANAGE_ROLES") || msg.member.roles.cache.find(r => r.name === "MC-Mod")) {
                    if (msg.content.split(' ')[1] === 'help') {
                        msg.reply('`Usage: .mcunmute <user> [reason]`');
                        return;
                    }
                    if (msg.mentions.users.first()) {
                        try {
                            console.log(message);
                            let reason = msg.content.split(' ').slice(2).join(' ')
                            let member = msg.mentions.users.first();
                            let role = msg.member.guild.roles.cache.find(role => role.name === "MC-Muted");
                            if (role) msg.guild.members.cache.get(member.id).roles.remove(role);
                            logEvent(msg, 'MC Unmuted', reason);
                        }
                        catch {
                            msg.reply("❌ I can't do that!");
                        }
                    }
                    else {
                        msg.reply("❌ User cannot be found");
                    }
                }
                else {
                    msg.reply("❌ You can't use that!");
                }
                break;
            case "tempmute":
                if(msg.member.permissions.has("MANAGE_ROLES")) {
                    if (msg.content.split(' ')[1] === 'help') {
                        msg.reply('`Usage: .tempmute <user> <duration> [reason]`');
                        return;
                    }
                    if (msg.mentions.users.first()) {
                        let duration = msg.content.split(' ')[2];
                        
                        //console.log(duration);
                        if (/(\.*[0-9]+([ywdhms]|^mo$))+/i.test(duration)) {
                            var secDuration = 0;
                            var i;
                            try {
                                while (duration != "" || duration != '') {
                                    i = 0;
                                    //console.log(duration);
                                    //console.log(i);
                                    //console.log(/.*[0-9.]+/g.test(duration));
                                    while (/\.*[0-9]+/g.test(duration.charAt(i))) {
                                        i++;
                                    }
                                    //console.log(duration.charAt(i));
                                    //console.log(duration.substring(0,i))
                                    switch (duration.charAt(i)) {
                                        case 'y':
                                            secDuration += duration.substring(0,i) * 365 * 24 * 60 * 60 * 1000;
                                            break;
                                        case 'w':
                                            secDuration += duration.substring(0,i) * 7 * 24 * 60 * 60 * 1000;
                                            break;
                                        case 'd':
                                            secDuration += duration.substring(0,i) * 24 * 60 * 60 * 1000;
                                            break;
                                        case 'h':
                                            secDuration += duration.substring(0,i) * 60 * 60 * 1000;
                                            break;
                                        case 'm':
                                            console.log(duration.charAt(i + 1));
                                            if (duration.charAt(i + 1) != 'o') secDuration += duration.substring(0,i) * 60 * 1000;
                                            else {
                                                secDuration += duration.substring(0,i) * 30 * 24 * 60 * 60 * 1000;
                                                duration = duration.substring(1);
                                            }
                                            break;
                                        case 's':
                                            secDuration += duration.substring(0,i) * 1000;
                                            break;
                                        default:
                                            return;
                                            break;     
                                    }
                                    duration = duration.substring(i + 1);
                                }
                                console.log(secDuration);
                                console.log(message);
                                let reason = msg.content.split(' ').slice(3).join(' ')
                                let member = msg.mentions.users.first();
                                let role = msg.member.guild.roles.cache.find(role => role.name === "Muted");
                                if (role) msg.guild.members.cache.get(member.id).roles.add(role);
                                logEvent(msg, 'Temporarily Muted', reason, secDuration);
                            }
                            catch {
                                msg.reply("❌ I can't do that!");
                            }
                        }
                        else {
                            msg.reply("❌ Please enter a valid duration. (ex 1h30m)");
                        }
                    }
                    else {
                        msg.reply("❌ User cannot be found");
                    }  
                }
                else {
                    msg.reply("❌ You can't use that!");
                }
                break;
            case "unmute":
                if(msg.member.permissions.has("MANAGE_ROLES")) {
                    if (msg.content.split(' ')[1] === 'help') {
                        msg.reply('`Usage: .unmute <user> [reason]`');
                        return;
                    }
                    if (msg.mentions.users.first()) {
                        try {
                            console.log(message);
                            let reason = msg.content.split(' ').slice(2).join(' ')
                            let member = msg.mentions.users.first();
                            let role = msg.member.guild.roles.cache.find(role => role.name === "Muted");
                            if (role) msg.guild.members.cache.get(member.id).roles.remove(role);
                            logEvent(msg, 'Unmuted', reason);
                        }
                        catch {
                         msg.reply("❌ I can't do that!");
                        }
                    }
                    else {
                        msg.reply("❌ User cannot be found");
                    }
                }
                else {
                    msg.reply("❌ You can't use that!");
                }
                break;
            case "kick":
                if (msg.member.hasPermission("KICK_MEMBERS")) {
                    if (msg.content.split(' ')[1] === 'help') {
                        msg.reply('`Usage: .kick <user> [reason]`');
                        return;
                    }
                    if (msg.mentions.users.first()) {
                        if (msg.mentions.members.first().kickable && false) {
                            msg.reply("❌ I can't do that!");
                            return;
                        }
                        try {
                            let reason = msg.content.split(' ').slice(2).join(' ');
                            if (reason === "") {
                                DMreason = "violating server rules";
                            }
                            else {
                                DMreason = reason;
                            }
                            client.users.cache.get(msg.mentions.members.first().id).send(`You have been kicked from Scoutcord for ${DMreason}. You may rejoin whenever you like.`)
                                .then (v => { msg.mentions.members.first().kick({reason: `${DMreason}`})})
                                .then (v => { logEvent(msg, 'Kicked', reason)});
                        } 
                        catch {
                            msg.reply("❌ I can't do that!");
                        }
                    } 
                    else {
                        msg.reply("❌ User cannot be found");
                    }
                }
                else {
                    msg.reply("❌ You can't use that!");
                }
                break;
            case "ban":
                if (msg.member.hasPermission("BAN_MEMBERS")) {
                    if (msg.content.split(' ')[1] === 'help') {
                        msg.reply('`Usage: .ban <user> [reason]`');
                        return;
                    }
                    if (msg.mentions.users.first()) {
                        if (!msg.mentions.members.first().bannable) {
                            msg.reply("❌ I can't do that!");
                            return;
                        }
                        try {
                            let reason = msg.content.split(' ').slice(2).join(' ')
                            if (reason === "") {
                                DMreason = "violating server rules";
                            }
                            else {
                                DMreason = reason;
                            }
                            client.users.cache.get(msg.mentions.users.first().id).send(`You have been banned from Scoutcord for ${DMreason}.`)
                                .then (v => { msg.mentions.members.first().ban({reason: `${reason}`})})
                                .then (v => { logEvent(msg, 'Banned', reason)});
                        } 
                        catch{
                            msg.reply("❌ I can't do that!");
                        }
                    }
                    else {
                        msg.reply("❌ User cannot be found");
                    } 
                }
                else {
                    msg.reply("❌ You can't use that!");
                }
                break;
            case "tempban":
                if(msg.member.permissions.has("BAN_MEMBERS")) {
                    if (msg.content.split(' ')[1] === 'help') {
                        msg.reply('`Usage: .tempban <user> <duration> [reason]`');
                        return;
                    }
                    if (msg.mentions.users.first()) {
                        if(!msg.mentions.members.first().bannable) {
                            msg.reply("❌ I can't do that!");
                            return;
                        }
                        let duration = msg.content.split(' ')[2];
                        if (/(\.*[0-9]+([ywdhms]|^mo$))+/i.test(duration)) {
                            var secDuration = 0;
                            var i;
                            try {
                                while (duration != "" || duration != '') {
                                    i = 0;

                                    while (/\.*[0-9]+/g.test(duration.charAt(i))) {
                                        i++;
                                    }

                                    switch (duration.charAt(i)) {
                                        case 'y':
                                            secDuration += duration.substring(0,i) * 365 * 24 * 60 * 60 * 1000;
                                            break;
                                        case 'w':
                                            secDuration += duration.substring(0,i) * 7 * 24 * 60 * 60 * 1000;
                                            break;
                                        case 'd':
                                            secDuration += duration.substring(0,i) * 24 * 60 * 60 * 1000;
                                            break;
                                        case 'h':
                                            secDuration += duration.substring(0,i) * 60 * 60 * 1000;
                                            break;
                                        case 'm':
                                            console.log(duration.charAt(i + 1));
                                            if (duration.charAt(i + 1) != 'o') secDuration += duration.substring(0,i) * 60 * 1000;
                                            else {
                                                secDuration += duration.substring(0,i) * 30 * 24 * 60 * 60 * 1000;
                                                duration = duration.substring(1);
                                            }
                                            break;
                                        case 's':
                                            secDuration += duration.substring(0,i) * 1000;
                                            break;
                                        default:
                                            return;
                                            break;     
                                    }
                                    duration = duration.substring(i + 1);
                                }
                                console.log(secDuration);
                                console.log(message);
                                let reason = msg.content.split(' ').slice(3).join(' ')
                                if (reason === '') {
                                    DMreason = "violating server rules";
                                }
                                else {
                                    DMreason = reason;
                                }
                                client.users.cache.get(msg.mentions.users.first().id).send(`You have been temporarily banned from Scoutcord for ${ms(secDuration, { long: true })} for ${DMreason}.`)
                                    .then (v => { msg.mentions.members.first().ban({reason: `${reason}`})})
                                    .then (v => { logEvent(msg, 'Temporarily Banned', reason, secDuration)});
                            }
                            catch {
                                msg.reply("❌ I can't do that!");
                            }
                        }
                        else {
                            msg.reply("❌ Please enter a valid duration. (ex 1h30m)");
                        }
                    }
                    else {
                        msg.reply("❌ User cannot be found");
                    }  
                }
                else {
                    msg.reply("❌ You can't use that!");
                }
                break;
            case "unban": 
                if(msg.member.permissions.has("BAN_MEMBERS")) {
                    if (msg.content.split(' ')[1] === 'help') {
                        msg.reply('`Usage: .unban <user\'s id>`');
                        return;
                    }
                    console.log(message);
                    var param = msg.content.substring(7);
                        try {
                            msg.guild.members.unban(param);
                        }
                        catch {
                            msg.reply("❌ User cannot be found");
                        }
                    }
                else {
                    msg.reply("❌ You can't use that!");
                }
                break;
            case "slowmode": 
                if(msg.member.permissions.has("MANAGE_CHANNELS")) {
                    if (msg.content.split(' ')[1] === 'help') {
                        msg.reply('`Usage: .slowmode <duration>`');
                        return;
                    }
                    console.log(message);
                    var param = msg.content.substring(10);
                    if (param >>> 0 === parseFloat(param) && param <= 21600) {
                        try {
                            msg.channel.setRateLimitPerUser(param);
                            logEvent(msg, 'Set Slowmode', `${param} seconds`);
                        }
                        catch {
                            console.error(error);
                        }
                    }
                    else {
                        msg.reply("Please enter a valid number of seconds (0 - 21600).") 
                    }
                }
                else {
                    msg.reply("❌ You can't use that!");
                }
                break;
            case "clear":
                if(msg.member.permissions.has("MANAGE_MESSAGES")) {
                    if (msg.content.split(' ')[1] === 'help') {
                        msg.reply('`Usage: .clear <num of messages>`');
                        return;
                    }
                    console.log(message);
                    var param = msg.content.substring(6);
                    console.log(param)
                    if (param >>> 0 === parseFloat(param) && param <= 100) {
                        try {
                            msg.channel.bulkDelete(parseInt(param) + 1)
                            logEvent(msg, 'Cleared Messages', `${param} messages`);
                        }
                        catch {
                            console.error(error);
                        }
                    }
                    else {
                        msg.reply("Please enter a valid number of seconds (0 - 21600).") 
                    }
                }
                else {
                    msg.reply("❌ You can't use that!");
                }
                break;
            case "modmail":
                if(msg.member.permissions.has("MANAGE_MESSAGES")) {
                    if (msg.content.split(' ')[1] === 'help') {
                        msg.reply('`Usage: .modmail <user> <message>`');
                        return;
                    }
                    if (msg.mentions.users.first()) {
                        try {
                            let reason = msg.content.split(' ').slice(2).join(' ')
                            console.log(message);
                            client.users.cache.get(msg.mentions.members.first().id).send(`\`ModMail message from Scoutcord Leadership:\` \n ${reason}`)
                        }
                        catch{
                            msg.reply("❌ I can't do that!");
                        }
                    }
                    else {
                        msg.reply("❌ User cannot be found");
                    } 
                }
                else {
                    msg.reply("❌ You can't use that!");
                }
                break;
            case "uinfo":
                if(msg.member.permissions.has("ADMINISTRATOR")) {
                    msg.reply("This is still in development");
                    return;
                    if (msg.content.split(' ')[1] === 'help') {
                        msg.reply('`Usage: .uinfo <user>`');
                          return;
                    }
                    if (msg.mentions.users.first()) {
                        try {
                            var infoEmbed = new Discord.MessageEmbed()
                                .setColor('#ee38ff')
                                .setTitle(`${msg.mentions.members.first().displayName}'s Information`)
                            sql.each(`SELECT time,action,reason,duration FROM userData WHERE offendee = ${msg.mentions.users.first().id} LIMIT 25`, function(err, tabl) {
                                date = dateFormat(parseInt(tabl.time), "mmm-d-yy h:MM TT")
                                if (tabl.action != 'Temporarily Muted' || tabl.action != 'Temporarily banned') infoEmbed.addField(tabl.action, `${date}\n${tabl.reason}`, true)
                                else if (tabl.active) infoEmbed.addField(tabl.action, `${date}\n${tabl.reason}, ${ms(tabl.duration, { long: true })}, Active`, true)
                                else infoEmbed = infoEmbed.addField(tabl.action, `${date}\n${tabl.reason}, ${ms(tabl.duration, { long: true })}, Compleated`, true)
                                console.log(`${date} | ${tabl.action} | ${tabl.reason} | ${tabl.active} | ${tabl.duration}`)
                            });
                            msg.channel.send(infoEmbed);
                        }
                        catch {
                            console.error(error);
                        }
                    }
                    else {
                        msg.reply("❌ Please enter a vaild user!");
                    }
                }
                else {
                    msg.reply("❌ You can't use that!");
                }
                break;
            case "ip":
                msg.channel.send(`\`${mcIp}\` | Java\nCheck out more in <#${minecraftInfo}>`);
                break;
            case "invite":
                msg.channel.send(invite);
                break;
            default:
                console.log(`Unknown Command ${msg.content}`);
                break;
        }
    }
    else if (msg.guild === null && !msg.author.bot) {
        client.channels.fetch(modmail)
            .then(channel => {
                channel.send(`Message from <@${msg.author.id}> (${msg.author.id}): \n ${msg.content}`);
                //else channel.send(`Message from <@${msg.author.id}> (${msg.author.id}): \n ${msg.content}\n ${msg.attachments.url}`);
            });
    }
});

client.on('messageReactionAdd', (reaction, user) => {
    let msg = reaction.message, emoji = reaction.emoji;
    if (msg.channel.id === welcome && !user.bot && msg.channel.guild) {
        switch (emoji.name) {
            case "SeaScouts":
                role = msg.channel.guild.roles.cache.find(role => role.name === "Sea Scout");
                if (role) reaction.message.guild.member(user).roles.add(role);
                break;
            case "Venturing":
                role = msg.channel.guild.roles.cache.find(role => role.name === "Venturer");
                if (role) reaction.message.guild.member(user).roles.add(role);
                break;
            case "Exploring":
                role = msg.channel.guild.roles.cache.find(role => role.name === "Explorer");
                if (role) reaction.message.guild.member(user).roles.add(role);
                break;
            case "📣":
                role = msg.channel.guild.roles.cache.find(role => role.name == "Announcements");
                if (role) reaction.message.guild.member(user).roles.add(role);
                break;
            case "👶":
                role = msg.channel.guild.roles.cache.find(role => role.name === "Youth");
                if (role) reaction.message.guild.member(user).roles.add(role);
                break;
            case "🧑":
                role = msg.channel.guild.roles.cache.find(role => role.name === "Adult");
                if (role) reaction.message.guild.member(user).roles.add(role);
                break;
            case "diamond":
                role = msg.channel.guild.roles.cache.find(role => role.name === "MC-Announcements");
                if (role) reaction.message.guild.member(user).roles.add(role);
                break;
            default:
                role = msg.channel.guild.roles.cache.find(role => role.name === emoji.name);
                if (role) reaction.message.guild.member(user).roles.add(role);
                break;
        }
    }
    else if (msg.channel.id === annocReq && !user.bot && reaction.message.guild.member(user).hasPermission("ADMINISTRATOR") && emoji.name === "✅") {
        msg.channel.messages.fetch(msg.id)
            .then(message => {
                client.channels.fetch(announcements)
                    .then (chn => { 
                        chn.send(message.content); })
            .catch(console.error); });
    }
});

client.on('messageReactionRemove', (reaction, user) => {
    let msg = reaction.message, emoji = reaction.emoji;
    if (msg.channel.id === welcome && !user.bot && msg.channel.guild) {
        switch (emoji.name) {
            case "SeaScouts":
                role = msg.channel.guild.roles.cache.find(role => role.name === "Sea Scout");
                if (role) reaction.message.guild.member(user).roles.remove(role);
                break;
            case "Venturing":
                role = msg.channel.guild.roles.cache.find(role => role.name === "Venturer");
                if (role) reaction.message.guild.member(user).roles.remove(role);
                break;
            case "Exploring":
                role = msg.channel.guild.roles.cache.find(role => role.name === "Explorer");
                if (role) reaction.message.guild.member(user).roles.remove(role);
                break;
            case "📣":
                role = msg.channel.guild.roles.cache.find(role => role.name == "Announcements");
                if (role) reaction.message.guild.member(user).roles.remove(role);
                break;
            case "👶":
                role = msg.channel.guild.roles.cache.find(role => role.name === "Youth");
                if (role) reaction.message.guild.member(user).roles.remove(role);
                break;
            case "🧑":
                role = msg.channel.guild.roles.cache.find(role => role.name === "Adult");
                if (role) reaction.message.guild.member(user).roles.remove(role);
                break;
            case "diamond":
                role = msg.channel.guild.roles.cache.find(role => role.name === "MC-Announcements");
                if (role) reaction.message.guild.member(user).roles.remove(role);
                break;
            default:
                role = msg.channel.guild.roles.cache.find(role => role.name === emoji.name);
                if (role) reaction.message.guild.member(user).roles.remove(role);
                break;
        }
    }
});

client.on('guildMemberAdd', member => {
    sql.each("SELECT MAX(time),offendee,duration,active FROM userData WHERE (action = 'Temporarily Muted' OR action = 'Muted') AND active = 'true' GROUP BY offendee", function(err, tabl) {
        if (member.id == tabl.offendee) {
            guild = client.guilds.cache.get(serverID);
            role = guild.roles.cache.find(role => role.name === "Muted");
            if (role) guild.members.cache.get(tabl.offendee).roles.add(role);
        }
    });
});

client.login(token);

function logEvent(msg, action, reason = "unspecified", duration, isAuto = false, offendee) {
    if (reason === null || reason === "") reason = "unspecified";
    client.channels.fetch(modlog)
        .then(chn => {
            if (['Warned', 'Muted', 'MC Muted', 'Temporarily Muted', 'MC Unmuted', 'Unmuted', 'Kicked', 'Banned', 'Temporarily Banned', 'Unbanned'].includes(action)) {
                if (isAuto) {
                    if (!offendee) {
                        offendee = msg.author.id;
                    }
                    var author = 'BSAbot';
                }
                else {
                    offendee = msg.mentions.members.first().id;
                    var author = msg.author.tag;
                }
                sql.run("INSERT INTO userData (offendee, time, action, reason, author, duration, active) VALUES (?, ?, ?, ?, ?, ?, ?)", [offendee, Date.now(), action, reason, author, duration, 'true'])      
                var respEmbed = new Discord.MessageEmbed()
                    .setColor('#ee38ff')
                    .setTitle(`✅ User ${action}!`)
                if (action != 'Temporarily Muted' && action != 'Temporarily Banned') {
                    var logEmbed = new Discord.MessageEmbed()
                        .setColor('#ee38ff')
                        .setTitle(`User ${action}`)
                        .setDescription(`<@${offendee}> was ${action.toLowerCase()} by ${author}`)
                        .addField("Reason:", reason, true)
                }
                else {
                    var logEmbed = new Discord.MessageEmbed()
                        .setColor('#ee38ff')
                        .setTitle(`User ${action}`)
                        .setDescription(`<@${offendee}> was ${action.toLowerCase()} by ${author}`)
                        .addField("Reason:", reason, true)
                        .addField("Duration:", ms(duration, { long: true }));
                }
            }
            else if (['Set Slowmode','Cleared Messages'].includes(action)) {
                var logEmbed = new Discord.MessageEmbed()
                    .setColor('#ee38ff')
                    .setTitle(`${msg.author.tag}`)
                    .setDescription(`${action} (${reason})`)
                var respEmbed = new Discord.MessageEmbed()
                    .setColor('#ee38ff')
                    .setTitle(`✅ ${action} (${reason})`)
            }
            try{
                chn.send(logEmbed);
                if (action === 'Cleared Messages') {
                msg.channel.send(respEmbed)
                    .then(message => message.delete( { timeout : 3000 } ));
                }
                else msg.channel.send(respEmbed);
            }
            catch {}
        });          
}

function isSwear(msg) {
    result = false;
    message = msg.content.toLowerCase();
    message = message.replaceAll('ß','b');
    message = unidecode(message);
    message = message.replaceAll('1','i');
    message = message.replaceAll('3','e');
    message = message.replaceAll('4','a');
    message = message.replaceAll('q','g');
    message = message.replaceAll('0','o');
    message = message.replaceAll('$','s');
    message = message.replaceAll('EU','e');
    message = message.replaceAll('Y=','y');
    message = message.replaceAll('(c)','c');
    message = message.replaceAll('@','a');
    message = message.replaceAll('deg','o');
    message = message.replaceAll('C/','c');
    message = message.replaceAll('|','i');
    message = message.replaceAll('(r)[?]','r');
    message = message.replaceAll('ing','');
    message = message.replaceAll('-',' ');
    message = message.replaceAll(/[^a-z0-9'\- ]/gi, "");
    message = message.split(' ');
    console.log(message);
    if (msg.channel.nsfw) {
        if (message.some(r=> bl_less.includes(r))) {
            return true;
        }
    }
    else if (message.some(r=> bl_full.includes(r))) {
        return true;
    }
    else return false;
}

setInterval(function(){ 
    sql.each("SELECT MAX(time),offendee,duration,active FROM userData WHERE action = 'Temporarily Muted' AND active = 'true'  GROUP BY offendee", function(err, tabl) {
        if(tabl && (parseInt(tabl['MAX(time)']) + parseInt(tabl.duration) <= Date.now())) {
            try {
                guild = client.guilds.cache.get(serverID);
                role = guild.roles.cache.find(role => role.name === "Muted");
                if (role) guild.members.cache.get(tabl.offendee).roles.remove(role);
                sql.run(`UPDATE userData SET active = 'false' WHERE offendee = '${tabl.offendee}' AND active = 'true'`);
                logEvent(null, 'Unmuted', "Tempmute ended", null, true, tabl.offendee);
                console.log(`Unmuted ${tabl.offendee}`)
            }
            catch {
                console.log("Unmute failed");
            }
        }
    }); 
    sql.each("SELECT MAX(time),offendee,duration,active FROM userData WHERE action = 'Temporarily Banned' AND active = 'true' GROUP BY offendee", function(err, tabl) {
        if(tabl && (parseInt(tabl['MAX(time)']) + parseInt(tabl.duration) <= Date.now())) {
            try {
                guild = client.guilds.cache.get(serverID);
                guild.members.unban(tabl.offendee);
                sql.run(`UPDATE userData SET active = 'false' WHERE offendee = '${tabl.offendee}' AND active = 'true'`);
                logEvent(null, 'Unbanned', "Tempban ended", null, true, tabl.offendee);
                console.log(`Unbanning ${tabl.offendee}`)
            }
            catch {
                console.log("Unban failed");
            }
        }
    }); 
}, 1000);