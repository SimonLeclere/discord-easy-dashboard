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
3. If you want to start from a template (recommanded), you can copy the following files to your **directory root**: [selector.ejs](https://github.com/SimonLeclere/discord-easy-dashboard/blob/master/themes/light/selector.ejs), [commands.ejs](https://github.com/SimonLeclere/discord-easy-dashboard/blob/master/themes/light/commands.ejs), [guild.ejs](https://github.com/SimonLeclere/discord-easy-dashboard/blob/master/themes/light/), [index.ejs](https://github.com/SimonLeclere/discord-easy-dashboard/blob/master/themes/light/index.ejs).
And these to a `partials` directory: [footer.ejs](https://github.com/SimonLeclere/discord-easy-dashboard/blob/master/themes/light/partials/footer.ejs), [header.ejs](https://github.com/SimonLeclere/discord-easy-dashboard/blob/master/themes/light/partials/header.ejs)

## Editing

Each page is a simple EJS file that must start with
```ejs
<%- await include("partials/header", { bot, user, title: "Home", is_logged, dashboardDetails, dashboardConfig, hasClientSecret }) %>`
```

and end with : 
```ejs
<%- await include("partials/footer") %>
```

To include the headers and footer of the page (also customizable in the partials folder).

For each page, you have access to variables allowing you to include information dynamically (see files in routes/ folder to know their type):
- home.ejs : bot, user, is_logged, dashboardDetails, dashboardConfig, baseUrl, port, hasClientSecret, commands
- commands.ejs : bot, user, is_logged, dashboardDetails, dashboardConfig, baseUrl, port, hasClientSecret, commands
- guild.ejs : bot, user, is_logged, guild, alert, errors, dashboardDetails, dashboardConfig, settings
- selector.ejs : bot, user, guilds, is_logged, Perms, path, baseUrl, port, dashboardDetails, dashboardConfig

You can now use basic html combined with EJS templating features to create your own custom dashboard!

Reminder of the different EJS tags:

    <% 'Scriptlet' tag, for control-flow, no output
    <%_ ‘Whitespace Slurping’ Scriptlet tag, strips all whitespace before it
    <%= Outputs the value into the template (HTML escaped)
    <%- Outputs the unescaped value into the template
    <%# Comment tag, no execution, no output
    <%% Outputs a literal '<%'
    %> Plain ending tag
    -%> Trim-mode ('newline slurp') tag, trims following newline
    _%> ‘Whitespace Slurping’ ending tag, removes all whitespace after it


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
