/* Just for reading env variables */
require('dotenv').config();

/* Require discord.js and discord-easy-dashboard */
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const Dashboard = require('..');

/* create the discord client */
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

/* Initiate the Dashboard class and attach it to the discord client for easy access */
client.dashboard = new Dashboard(client, {
	name: 'ColorBot', // Bot's name
	description: 'A super cool bot with an online dashboard!', // Bot's description
	baseUrl: 'http://localhost', // Leave this if ur in local development
	port: 80,
	secret: process.env.DISCORD_SECRET, // client.secret -> accessible at https://discord.com/developers/applications (OAuth2 section),
	permissions: ['ManageGuild'], // permissions needed to access the dashboard
});

// register command test
client.dashboard.registerCommand('color', 'Get the color embed', '/color');

client.guildSecrets = {}; // We' ll store the secret of each server here

client.colors = {}; // We' ll store the colors of each server here

const setColor = (discordClient, guild, value) => (discordClient.colors[guild.id] = value); // Stores the color in the client.colors object
const getColor = (discordClient, guild) => discordClient.colors[guild.id] || '#ffffff'; // Get the color in the client.colors object or give the default one

client.dashboard.addColorInput('Color', 'The color of the embeds', setColor, getColor);


client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isChatInputCommand()) return;

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