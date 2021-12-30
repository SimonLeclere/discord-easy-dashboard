# Getting started

The first step is to initialize the module.
You need to pass a Discord client as a parameter and an optional object containing the options.

```js
const Discord = require("discord.js");
const client = new Discord.Client();

// Requires Dashboard class from discord-easy-dashboard
const Dashboard = require("discord-easy-dashboard");

// Initialise it
const dashboard = new Dashboard(client)

// We now have a dashboard property to access everywhere!
client.dashboard = dashboard;
```

At this point, the module will start the server at `http://localhost:3000` (default url and port) but without a client secret, you will only have access to a home page for the moment. So let's see the different options you can use!

- options.name (string) : The name of the bot - Will be displayed on the home page. The default value is the bot nickname (obtained with client.user.username).
- options.description (string) : A description of the bot - Will be displayed on the home page. No default value.
- options.serverUrl (string) : An url to your bot support server - If specified, adds a button to access it on the dashboard. No default value.
- options.inviteUrl (string) : An url to your bot invite link - By default, the dashboard will try to generate an invite link for you with admin permissions.
- options.baseUrl (string) : The base url for the dashboard. Default to `localhost` for local developpment.
- options.port (number) : The port of the dashboard. Default to `3000`. Set it to `80` to access the dashboard without specifying the port.
- options.noPortIncallbackUrl (boolean) : If set to true, the callback url will not contain the port. Default to `false`. Use it if you are using repl.it or other services that do not support port in the callback url.
- options.secret (string) : The client secret of your bot, accessible at `https://discord.com/developers/applications` (OAuth2 section). If specified, enables authentication to Discord and activates the server selection and settings pages. No default value.
- options.logRequests (boolean) : Log or not each request made to the dashboard (for development purposes). Default value is false.
- options.injectCSS (string) : A CSS string to inject in the dashboard html. Default value is null.
- options.faviconPath (string) : A path to a favicon. Default value is null.
- options.theme (string) : Can be either `light` (default) or `dark` or a path to a theme folder, see [THEMING.md](THEMING.md) for further information.

## Important !! 

If you want to use authentication via Discord, you must not only specify the `client.secret` option but also add, on your discord developpers page, a valid redirection URL!

Example:

If your dashboard has the following settings: 
```js
{
    baseUrl: 'http://localhost',
    port: 3000,
}
```
You have to go to the page `https://discord.com/developers/applications`, in the section OAuth2 and add as a redirectURI `http://localhost:3000/auth/login`.

## Ready event

```js
client.dashboard.on('ready', () => {
    console.log(`Dashboard launched on port ${config.port} - ${config.baseUrl}${config.port === 80 ? '' : ':' + config.port}`);
});
```

## Command list page

To add a page listing the commands of your bot, you have to register at least one command with the `registerCommand` function. This one takes 3 parameters : the name of the command, a description of what it does and how to use it.

Example : `client.dashboard.registerCommand('ping', 'Get the bot ping', '!ping');`

If you use a command-handler, you can register all your commands using a loop:
```js
client.commands.forEach(command => {
    client.dashboard.registerCommand(command.name, command.description, command.usage);
})
```

## Server settings page

If you specify the `secret` parameter, the discord authentication and server selector page will appear.

⚠ Don't forget, on the discord developers page in the OAuth section, to add a redirection link in the form `baseUrl:port/auth/login` !

For the moment you can't change any of the settings... because there are none! You must first tell the module what settings you want users to be able to change. 

For this discord-easy-dashboard provides several methods:

- `addTextInput(name, description, validator, setter, getter)` - Adds a text input. The `validator` parameter is a function that takes the string the user entered as a parameter and returns `true` if it is valid and `false` otherwise. The `setter` and `getter` parameters are functions that take the discord client and the guild object (and the value entered by the user for `setter`) as parameters and save or read from the database.
- `addBooleanInput(name, description, setter, getter)` - Adds a switch that takes either the value `true` or `false`. The setter and getter parameters are similar to those detailed above.
- `addSelector(name, description, getSelectorEntries, setter, getter)` - Allows you to add a selector that takes the form of a dropdown menu. You can use it to ask the user to choose a role or a channel. The getSelectorEntries() function takes as parameters the discord client and the guild object and must return a list of couples [id, name]. The getter function should also return a couple [id, name].
- `addColorInput(name, description, setter, getter)` - Adds a color picker. The setter and getter parameters are similar to those detailed above.

Now with these few functions it is quite simple to create a basic dashboard. Let's see below an example that allows the user to choose a custom prefix for his server:

```js
/* Require discord.js and discord-easy-dashboard */
const { Client, Intents } = require('discord.js');
const Dashboard = require('discord-easy-dashboard');

/* create the discord client */
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

/* Initiate the Dashboard class and attach it to the discord client for easy access */
client.dashboard = new Dashboard(client, {
    name: 'DashBot', // Bot's name
    description: 'A super cool bot with an online dashboard!', // Bot's description
    baseUrl: 'http://localhost', // Leave this if ur in local development
    port: 80,
    noPortIncallbackUrl: false, // set it to true if you want to use the callback url without port (like if you are using repl.it)
    secret: 'cl13nt-s3cr3t', // client.secret -> accessible at https://discord.com/developers/applications (OAuth2 section)
});

client.prefixes = {}; // We' ll store the prefixes of each server here

const validatePrefix = prefix => prefix.length <= 5; // Only accepts prefixes of up to 5 characters
const setPrefix = (discordClient, guild, value) => discordClient.prefixes[guild.id] = value; // Stores the prefix in the client.prefixes object
const getPrefix = (discordClient, guild) => discordClient.prefixes[guild.id] || '!'; // Get the prefix in the client.prefixes object or give the default one

// Here we indicate to the module that we want the user to be able to set the prefix of his bot
client.dashboard.addTextInput('Prefix', 'The prefix that is added to discord messages in order to invoke commands.', validatePrefix, setPrefix, getPrefix);

client.on('ready', () => console.log(`${client.user.tag} is ready !`)); // To know when the bot is launched

client.on('messageCreate', message => {
    
    let prefix = getPrefix(client, message.guild); // We reuse our function to gain in readability!

    if (message.content.startsWith(prefix + 'ping')) message.reply('Pong !'); // 🏓 :D
});

client.login('Sup3r-s3cr3t-t0k3n'); // Discord API login
```

Make sure you read the comments to understand the example!

Results : ![prefix example](assets/prefix%20example.png)

## Customize the dashboard

You can easily change the colors, the background, ... of the dashboard by using the `injectCSS` option.

For example, to change the background colors of the dashboard, you can use the following code:

```js
client.dashboard = new Dashboard(client, {
    // other options
    injectCSS: `
	body {
		background-color: #FDE9E0;
	}`
})
```