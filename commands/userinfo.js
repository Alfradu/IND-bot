module.exports = {
    name: 'user-info',
    description: 'Show user info',
    cooldown: 2,
    guildOnly: true,
    execute(message, args) {
        message.channel.send(`Your username: ${message.author.username}\nYour ID: ${message.author.id}`);
    },
};