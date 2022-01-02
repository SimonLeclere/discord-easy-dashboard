# Theming
discord-easy-dashboard now supports themes !
You can use one included by default (`dark` or `light`) or make your own. This is a guide to make it easier.

## Setting up
1. Create a directory for your new theme: e.g. `my-awesome-theme`
2. Create an `index.js` file in your **directory root**, this will tell the package where to find the different pages:
```js
const { join } = require("path");

const BASE_PATH = ".";

module.exports = {
    home: join(__dirname, BASE_PATH, "index.ejs"),
    guild: join(__dirname, BASE_PATH, "guild.ejs"),
    selector: join(__dirname, BASE_PATH, "selector.ejs"),
    commands: join(__dirname, BASE_PATH, "commands.ejs"),
    404: join(__dirname, BASE_PATH, "404.ejs")
};
```
3. If you want to start from a template (recommanded), you can copy the following files to your **directory root**: [selector.ejs](https://github.com/SimonLeclere/discord-easy-dashboard/blob/master/views/selector.ejs), [commands.ejs](https://github.com/SimonLeclere/discord-easy-dashboard/blob/master/views/commands.ejs), [guild.ejs](https://github.com/SimonLeclere/discord-easy-dashboard/blob/master/views/guild.ejs), [index.ejs](https://github.com/SimonLeclere/discord-easy-dashboard/blob/master/views/index.ejs).
And these to a `partials` directory: [footer.ejs](https://github.com/SimonLeclere/discord-easy-dashboard/blob/master/views/partials/footer.ejs), [header.ejs](https://github.com/SimonLeclere/discord-easy-dashboard/blob/master/views/partials/header.ejs)

## Editing

You can use the following parameters being passed at render:
- bot: The client Object of the bot
- user: the user Object of the user logged (if logged in)
- is_logged: whether the user is logged in or not
- dashboardDetails: an Object containing details about the dashboard
- dashboardConfig: an Object containing the dashboard's config
- baseUrl: the base URL of the dashboard
- port: the port number of the dashboard
- hasClientSecret: whether the client's secret has been provided in the config or not
- commands: an Array of command Objects registered with `<dashboard>.registerCommand`

## Using your theme !

You can pass the theme folder path in the dashboard config Object:

```js
client.dashboard = new Dashboard(client, {
    theme: "path/to/your/folder"
});
```

## Adding new pages
Adding a new page is very easy !
All you have to do is create a new file and add a field to the exported Object in your `index.js` , e.g. :

`awesome.ejs`
```html
<h1>What an awesome page !</h1>
```

`index.js`
```js
const { join } = require("path");

const BASE_PATH = ".";

module.exports = {
    home: join(__dirname, BASE_PATH, "index.ejs"),
    guild: join(__dirname, BASE_PATH, "guild.ejs"),
    selector: join(__dirname, BASE_PATH, "selector.ejs"),
    commands: join(__dirname, BASE_PATH, "commands.ejs"),
    awesome: join(__dirname, BASE_PATH, "awesome.ejs") 
};
```

You can then access `/awesome` and see the page you just created !
