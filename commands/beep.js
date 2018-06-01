module.exports = {
    name: 'beep',
    description: 'beep!',
    execute(message, args) {
        message.channel.send('Boop.');
    },
};