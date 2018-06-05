module.exports = {
    name: 'prune',
    description: 'Remove 1-99 previous messages',
    cooldown: 5,
    guildOnly: true,
    modOnly: true,
    args: true,
    usage: '<number between 1-99>',
    execute(message, args) {
        const amount = parseInt(args[0]);
        if (isNaN(amount)) {
            return message.reply('that doesn\'t seem to be a valid number.');
        }
        else if (amount < 1 || amount > 99) {
            return message.reply('you need to input a number between 1 and 99.');
        }
        message.channel.bulkDelete(amount + 1, true).catch(err => {
            console.error(err);
            message.channel.send('There was an error trying to prune messages in this channel!');
        });
    },
};