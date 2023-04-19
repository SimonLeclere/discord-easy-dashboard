/* Just for reading env variables */
require('dotenv').config();

// const { join } = require('path');

const theme = require('../themes/dark');

/* Require discord.js and discord-easy-dashboard */
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const Dashboard = require('..');

(async () => {

	const favicon = await fetch('https://i.ibb.co/L8sZqxX/favImg.png');
	const arrayBuffer = await favicon.arrayBuffer();
	const buffer = Buffer.from(arrayBuffer);

	/* create the discord client */
	const client = new Client({ intents: [GatewayIntentBits.Guilds] });

	/* Initiate the Dashboard class and attach it to the discord client for easy access */
	client.dashboard = new Dashboard(client, {
		name: 'DashBot', // Bot's name
		description: 'A super cool bot with an online dashboard!', // Bot's description
		baseUrl: 'http://localhost', // Leave this if ur in local development
		port: 80,
		noPortIncallbackUrl: false, // set it to true if you want to use the callback url without port (like if you are using repl.it)
		secret: process.env.DISCORD_SECRET, // client.secret -> accessible at https://discord.com/developers/applications (OAuth2 section),
		theme, // dark or light
		logRequests: true,
		permissions: ['ManageGuild'], // permissions needed to access the dashboard
		faviconPath: buffer, // path to the favicon
	});

	// register command test
	client.dashboard.registerCommand('ping', 'Pong!', '/ping');
	client.dashboard.registerCommand('color', 'Get the color embed', '/color');
	client.dashboard.registerCommand('admin', 'Can only be used by the admin role', '/admin');
	client.dashboard.registerCommand('secret', 'Get the secret of the guild', '/secret');

	client.guildSecrets = {}; // We' ll store the secret of each server here

	const validateSecret = (secret) => secret.length <= 100; // Only accepts secret of up to 100 characters
	const setSecret = (discordClient, guild, value) => (discordClient.guildSecrets[guild.id] = value); // Stores the secret in the client.guildSecrets object
	const getSecret = (discordClient, guild) => discordClient.guildSecrets[guild.id] || 'No secret for this guild'; // Get the secret in the client.guildSecrets object or give the default one

	// Here we indicate to the module that we want the user to be able to set the secret of the guild in the dashboard
	client.dashboard.addTextInput(
		'Secret',
		'The secret of the guild',
		validateSecret,
		setSecret,
		getSecret,
	);

	client.colors = {}; // We' ll store the colors of each server here

	const setColor = (discordClient, guild, value) => (discordClient.colors[guild.id] = value); // Stores the color in the client.colors object
	const getColor = (discordClient, guild) => discordClient.colors[guild.id] || '#ffffff'; // Get the color in the client.colors object or give the default one

	client.dashboard.addColorInput('Color', 'The color of the embeds', setColor, getColor);

	client.isMegamind = {};

	const setMegamind = (discordClient, guild, value) => discordClient.isMegamind[guild.id] = value; // Stores the megamind in the client.isMegamind object
	const getMegamind = (discordClient, guild) => discordClient.isMegamind[guild.id] || false; // Get the megamind in the client.isMegamind object or give the default one
	client.dashboard.addBooleanInput('Megamind', 'The megamind', setMegamind, getMegamind);

	client.adminRoles = {};

	const getSelectorEntries = (discordClient, guild) => guild.roles.cache.map(role => [role.id, role.name]);
	const adminRoleSetter = (discordClient, guild, value) => (client.adminRoles[guild.id] = value);
	const adminRoleGetter = (discordClient, guild) => {
		const roleID = client.adminRoles[guild.id];
		const roleName = guild.roles.cache.get(roleID) ? guild.roles.cache.get(roleID).name : null;
		return [roleID, roleName];
	};
	client.dashboard.addSelector('Admin role', 'The only role authorized to execute the /admin command', getSelectorEntries, adminRoleSetter, adminRoleGetter);


	client.on('ready', () => {
		console.log(`Logged in as ${client.user.tag}!`);
	});

	client.on('interactionCreate', async interaction => {
		if (!interaction.isChatInputCommand()) return;

		if (interaction.commandName === 'ping') {
			await interaction.reply('Pong!'); // 🏓 :D
		}

		if(interaction.commandName === 'secret') {
			await interaction.reply(`The secret of this guild is: ${getSecret(client, interaction.guild)}`);
		}

		if (interaction.commandName === 'admin') {
			const adminRole = interaction.guild.roles.cache.get(client.adminRoles[interaction.guild.id]);
			if (adminRole && interaction.member.roles.cache.has(adminRole.id)) {
				await interaction.reply('You are authorized to execute the /admin command');
			}
			else {
				await interaction.reply('You are not authorized to execute the /admin command');
			}
		}

		if(interaction.commandName === 'color') {

			const embed = new EmbedBuilder()
				.setColor(getColor(client, interaction.guild))
				.setTitle('Color embed')
				.setDescription('This is a color embed');

			await interaction.reply({
				embeds: [embed],
			});
		}
	});

	client.login(process.env.DISCORD_TOKEN);

})();
