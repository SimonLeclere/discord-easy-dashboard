require('dotenv').config();

const { REST, Routes } = require('discord.js');

const commands = [
	{
		name: 'ping',
		description: 'Replies with Pong!',
	},
	{
		name: 'admin',
		description: 'Can only be used by users with the admin role chosen in the dashboard',
	},
	{
		name: 'color',
		description: 'Get an embed with the color chosen in the dashboard',
	},
	{
		name: 'secret',
		description: 'Get the secret of the guild',
	},
];

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
	try {
		console.log('Started refreshing application (/) commands.');

		await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });

		console.log('Successfully reloaded application (/) commands.');
	}
	catch (error) {
		console.error(error);
	}
})();