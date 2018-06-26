const fs = require('fs');
const Discord = require('discord.js');
const { prefix, token } = require('./config.json');

const client = new Discord.Client({ autoReconnect: true });
client.commands = new Discord.Collection();
const cooldowns = new Discord.Collection();

const RssFeedEmitter = require('rss-feed-emitter');
const feeder = new RssFeedEmitter();
var currentTitle = '';

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.on('ready', () => {
    console.log('IND-Bot ready!');
});

client.on('error', err => {
    console.log(err.message);
});

client.on('disconnected', () => {
    feeder.destroy();
    console.log('*** crashed, hoping autoReconnect saves me ._. ***');
});

feeder.add({
    url: 'http://blog.humblebundle.com/rss',
    refresh: 2000,
});
feeder.add({
    url: 'https://www.gog.com/frontpage/rss',
    refresh: 2000,
});
feeder.add({
    url: 'https://store.steampowered.com/feeds/news.xml',
    refresh: 2000,
});

feeder.on('new-item', item => {
    
    const chan = client.channels.get('284694444907692032'); //  announcements channel
    console.log(`${item.title} -- ${item.date}`);

    if (!item.title == currentTitle && item.date.valueOf() > Date.now() - 600000) {
        console.log('-- item date and duplication checks out --');
        if (item.link.includes('blog.humblebundle.com') && item.categories.includes('humble free game') && !item.categories.includes('humble monthly')) {
            const embed = {
                'color': '15105570',
                'fields': [{
                    name: `${item.title}`,
                    value: `Get it here: ${item.permalink}`,
                }],
            };
            chan.send({ embed }).catch(console.error);
            console.log('-- item content checks out <HUMBLEBUNDLE> --');
        }
        else if (!item.link.includes('blog.humblebundle.com') && item.description.toLowerCase().includes('free') && !item.description.toLowerCase().includes('demo')) {
            const embed = {
                'color': '15105570',
                'fields': [{
                    name: `${item.title}`,
                    value: `Get it here: ${item.link}`,
                }],
            };
            chan.send({ embed }).catch(console.error);
            console.log('-- item title checks out <GOG OR STEAM> --');
        }
        currentTitle = item.title;
    }
});

client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();

//  check command name + potential aliases
    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
    if (!command) return;

//  check if guildOnly: true
    if (command.guildOnly && message.channel.type !== 'text') {
        return message.reply('I can\'t execute that command inside DMs!');
    }

//  check if admin or not
//  BE CAREFUL SO YOU ADD MODONLY ONLY WHERE YOU HAVE GUILDONLY TAGS
    if (command.modOnly == 'administrator' && !message.member.permissions.has('ADMINISTRATOR')) {
        return message.channel.send(`I can't let you do that, ${message.author}`);
    }

//  check if args: true and if args are provided
    if (command.args && !args.length) {
        let reply = `You didn't provide any arguments, ${message.author}!`;
//      check if usage is specified
        if (command.usage) {
            reply += `\nThe proper usage would be:\n \`${prefix}${command.name} ${command.usage}\``;
        }
        return message.channel.send(reply);
    }
// check cooldowns
    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection());
    }
    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;
    if (!timestamps.has(message.author.id)) {
        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    }
    else {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
        }

        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    }

//  run command
    try {
        command.execute(message, args);
    }
    catch (error) {
        console.error(error);
        message.reply('There was an error trying to execute that command!');
    }
});

client.login(token);
