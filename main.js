const { prefix, token } = require('./config.json');
const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
    console.log('Ready!');
});

client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'ping') {
        message.channel.send('Pong.');
    }
    else if (command === 'beep') {
        message.channel.send('Boop.');
    }
    else if (command === 'server') {
        message.channel.send(`
        Server name: ${message.guild.name}
        Total members: ${message.guild.memberCount}
        Server region: ${message.guild.region}
        I was created: ${message.guild.createdAt}`);
    }
    else if (command === 'user-info') {
        message.channel.send(`Your username: ${message.author.username}\nYour ID: ${message.author.id}`);
    }
    else if (command === 'args-info') {
        if (!args.length) {
            return message.channel.send(`You didn't provide any arguments, ${message.author}!`);
        }
        else if (args[0] === 'foo') {
            return message.channel.send('bar');
        }

        message.channel.send(`First argument: ${args[0]}`);
    }
    else if (command === 'punch') {
        if (!message.mentions.users.size) {
            return message.channel.send('You hit yourself out of confusion 👊👊👊');
        }
        const taggedUser = message.mentions.users.first();
        message.channel.send(`You punched ${taggedUser.username} 👊👊👊`);
    }
    else if (command === 'avatar') {
        if (!message.mentions.users.size) {
            return message.channel.send(`Your avatar: ${message.author.displayAvatarURL}`);
        }
        const avatarList = message.mentions.users.map(user => {
            return `${user.username}'s avatar: ${user.displayAvatarURL}`;
        });

        message.channel.send(avatarList);
    }
    else if (command === 'prune') {
        const amount = parseInt(args[0]);
        if (isNaN(amount)) {
            return message.reply('that doesn\'t seem to be a valid number.');
        }
        else if (amount < 1 || amount > 99) {
            return message.reply('you need to input a number between 1 and 99.');
        }
        message.channel.bulkDelete(amount + 1, true).catch(err => {
            console.error(err);
            message.channel.send('There was an  error trying to prune messages in this  channel!');
        });
    }
});
client.login(token);
