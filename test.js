/* Just for reading env variables */
require('dotenv').config();

const theme = require('./themes/dark');

/* Require discord.js and discord-easy-dashboard */
const { Client, Intents } = require('discord.js');
const Dashboard = require('./');

/* create the discord client */
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });


/* Initiate the Dashboard class and attach it to the discord client for easy access */
client.dashboard = new Dashboard(client, {
	name: 'DashBot', // Bot's name
	description: 'A super cool bot with an online dashboard!', // Bot's description
	baseUrl: 'http://localhost', // Leave this if ur in local development
	port: 80,
	noPortIncallbackUrl: false, // set it to true if you want to use the callback url without port (like if you are using repl.it)
	secret: process.env.DISCORD_SECRET, // client.secret -> accessible at https://discord.com/developers/applications (OAuth2 section),
	theme: theme, // dark or light
	logRequests: true,
	permissions: 'MANAGE_GUILD', // permissions needed to access the dashboard
});

// register command test
client.dashboard.registerCommand('ping', 'Pong!', '!ping');

client.prefixes = {}; // We' ll store the prefixes of each server here

const validatePrefix = (prefix) => prefix.length <= 5; // Only accepts prefixes of up to 5 characters
const setPrefix = (discordClient, guild, value) => (discordClient.prefixes[guild.id] = value); // Stores the prefix in the client.prefixes object
const getPrefix = (discordClient, guild) => discordClient.prefixes[guild.id] || '!'; // Get the prefix in the client.prefixes object or give the default one

// Here we indicate to the module that we want the user to be able to set the prefix of his bot
client.dashboard.addTextInput(
	'Prefix',
	'The prefix that is added to discord messages in order to invoke commands.',
	validatePrefix,
	setPrefix,
	getPrefix,
);

client.colors = {}; // We' ll store the colors of each server here

const setColor = (discordClient, guild, value) => (discordClient.colors[guild.id] = value); // Stores the color in the client.colors object
const getColor = (discordClient, guild) => discordClient.colors[guild.id] || '#ffffff'; // Get the color in the client.colors object or give the default one

client.dashboard.addColorInput('Color', 'The color of the embeds', setColor, getColor);

client.isMegamind = {};

const setMegamind = (discordClient, guild, value) => (discordClient.isMegamind[guild.id] = value); // Stores the megamind in the client.isMegamind object
const getMegamind = (discordClient, guild) => discordClient.isMegamind[guild.id] || false; // Get the megamind in the client.isMegamind object or give the default one
client.dashboard.addBooleanInput('Megamind', 'The megamind', setMegamind, getMegamind);


client.adminRoles = {};

const getSelectorEntries = (client, guild) => guild.roles.cache.map(role => [role.id, role.name]);
const adminRoleSetter = (client, guild, value) => (client.adminRoles[guild.id] = value);
const adminRoleGetter = (client, guild) => {
	const roleID = client.adminRoles[guild.id];
	const roleName = guild.roles.cache.get(roleID)?.name
	return [roleID, roleName];
};
client.dashboard.addSelector('Admin role', 'The only role authorized to execute the /admin command', getSelectorEntries, adminRoleSetter, adminRoleGetter);

client.on('ready', () => console.log(`${client.user.tag} is ready !`)); // To know when the bot is launched
client.dashboard.on('ready', () => {
	console.log(`Dashboard launched on port ${client.dashboard.config.port} - ${client.dashboard.config.baseUrl}${client.dashboard.config.port === 80 ? '' : ':' + client.dashboard.config.port}`);
});

client.on('messageCreate', (message) => {
	const prefix = getPrefix(client, message.guild); // We reuse our function to gain in readability!

	if (message.content.startsWith(prefix + 'ping')) message.reply('Pong !'); // 🏓 :D

	if (message.content.startsWith(prefix + 'admin')) {
		const adminRole = message.guild.roles.cache.get(client.adminRoles[message.guild.id]);
		if (adminRole && message.member.roles.cache.has(adminRole.id)) {
			message.reply('You are authorized to execute the /admin command');
		} else {
			message.reply('You are not authorized to execute the /admin command');
		}
	}

	// send a red embed
	if (message.content.startsWith(prefix + 'color')) {
		message.channel.send({
			embeds: [{
				color: getColor(client, message.guild),
				title: 'Color embed',
				description: 'This is a color embed',
			}],
		});
	}

});

client.login(process.env.DISCORD_TOKEN); // Discord API login