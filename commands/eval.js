function clean(text) {
    if (typeof (text) === 'string') {
      return text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203));
    }
    else {
        return text;
    }
}

module.exports = {
    name: 'eval',
    description: 'Evaluate message as a function',
    args: true,
    guildOnly: true,
    modOnly: true,
    execute(message, args) {
        try {
            const code = args.join(' ');
            let evaled = eval(code);
      
            if (typeof evaled !== 'string') {
              evaled = require('util').inspect(evaled);
            }
            message.channel.send(clean(evaled), { code:'xl' });
        }
        catch (err) {
            message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
        }

    },
};