const { Client, Intents } = require('discord.js');
const Dashboard = require('./index.js');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

client.prefix = '!'
client.supercool = true;
client.role = {
    name: 'null',
    id: 'null'
}

client.on('ready', () => {
    console.log(`${client.user.tag} is ready !`);
    client.dashboard = new Dashboard(client, {
        name: 'Beebop',
        description: 'A super cool multifonctionnal bot!',
        serverUrl: 'https://discord.gg/zmqyPu2qkc',
        baseUrl: 'http://localhost',
        port: 80,
        secret: '_2NmYLOsVd1wbgvJteyGq-N5zeSaDoJY',
        logRequests: true
    });
    client.dashboard.registerCommand('ping', 'Get the bot ping', '!ping');
    client.dashboard.registerCommand('say', 'echo !', '!say <text>');
    
    client.dashboard.addTextInput('Prefix', 'The prefix that is added to discord messages in order to invoke commands.', x => x.length < 10, (c, g, v) => c.prefix = v, (c, g) => c.prefix);
    client.dashboard.addBooleanInput('Automod', 'Enable the automatic message moderation', (c, g, v) => c.supercool = v, (c, g) => c.supercool);
    client.dashboard.addSelector('Role', 'Choose a role', (c, g) => Object.fromEntries(g.roles.cache.map(r => [r.id, r.name])), (c, g, v) => [c.role.name, c.role.id] = [g.roles.cache.get(v)?.name || null, v], (c, g) => [c.role.id, c.role.name]);
})

// client.dashboard.on('newUser', userData => console.log('New user connected!'));


client.on('messageCreate', message => {
    if (message.content.startsWith('!ping')) message.reply('Pong !');
    if (message.content.startsWith('!getprefix')) message.reply(client.prefix);
});

client.login('NzIwNzQ5NjI4OTE5Nzc1Mjgy.XuKgZg.DY9uj2jnAlUGzsWQglISZWg0Afs');