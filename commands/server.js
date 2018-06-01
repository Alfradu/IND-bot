module.exports = {
    name: 'server',
    description: 'Show server status',
    cooldown: 2,
    guildOnly: true,
    execute(message, args) {
        message.channel.send(`
        Server name: ${message.guild.name}
        Total members: ${message.guild.memberCount}
        Server region: ${message.guild.region}
        I was created: ${message.guild.createdAt}`);
    },
};