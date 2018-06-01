module.exports = {
    name: 'beep',
    description: 'beep!',
    cooldown: 1,
    execute(message, args) {
        message.channel.send('Boop.');
    },
};