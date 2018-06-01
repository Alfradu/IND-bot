module.exports = {
    name: 'punch',
    description: 'punch!',
    cooldown: 2,
    guildOnly: true,
    execute(message, args) {
        if (!message.mentions.users.size) {
            return message.channel.send('You hit yourself out of confusion 👊👊👊');
        }
        const taggedUser = message.mentions.users.first();
        message.channel.send(`You punched ${taggedUser.username} 👊👊👊`);
    },
};