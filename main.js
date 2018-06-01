const { prefix, token } = require('./config.json');
const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
    console.log('Ready!');
});

client.login(token);

client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    const args = message.content.slice(prefix.length).split(' ');
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
});