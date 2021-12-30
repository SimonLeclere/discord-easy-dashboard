/* Require discord.js and discord-easy-dashboard */
const { Client, Intents } = require("discord.js");
const Dashboard = require("./");

/* create the discord client */
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

/* Initiate the Dashboard class and attach it to the discord client for easy access */
client.dashboard = new Dashboard(client, {
    name: "DashBot", // Bot's name
    description: "A super cool bot with an online dashboard!", // Bot's description
    baseUrl: "http://localhost", // Leave this if ur in local development
    port: 80,
    noPortIncallbackUrl: false, // set it to true if you want to use the callback url without port (like if you are using repl.it)
    secret: "cl1nt-s3cr3t", // client.secret -> accessible at https://discord.com/developers/applications (OAuth2 section),
    theme: "light", // dark or light
    logRequests: true,
});

client.prefixes = {}; // We' ll store the prefixes of each server here

const validatePrefix = (prefix) => prefix.length <= 5; // Only accepts prefixes of up to 5 characters
const setPrefix = (discordClient, guild, value) => (discordClient.prefixes[guild.id] = value); // Stores the prefix in the client.prefixes object
const getPrefix = (discordClient, guild) => discordClient.prefixes[guild.id] || "!"; // Get the prefix in the client.prefixes object or give the default one

// Here we indicate to the module that we want the user to be able to set the prefix of his bot
client.dashboard.addTextInput(
    "Prefix",
    "The prefix that is added to discord messages in order to invoke commands.",
    validatePrefix,
    setPrefix,
    getPrefix
);

client.colors = {}; // We' ll store the colors of each server here

const setColor = (discordClient, guild, value) => (discordClient.colors[guild.id] = value); // Stores the color in the client.colors object
const getColor = (discordClient, guild) => discordClient.colors[guild.id] || "#ffffff"; // Get the color in the client.colors object or give the default one

client.dashboard.addColorInput('Color', 'The color of the embeds', setColor, getColor);

client.on("ready", () => console.log(`${client.user.tag} is ready !`)); // To know when the bot is launched

client.on("messageCreate", (message) => {
    let prefix = getPrefix(client, message.guild); // We reuse our function to gain in readability!

    if (message.content.startsWith(prefix + "ping")) message.reply("Pong !"); // 🏓 :D

    // send a red embed
    if (message.content.startsWith(prefix + "color")) {
        message.channel.send({
            embeds: [{
                color: getColor(client, message.guild),
                title: "Color embed",
                description: "This is a color embed",
            }],
        });
    }

});

client.login("sup3r-s3cr3t-t0k3n"); // Discord API login