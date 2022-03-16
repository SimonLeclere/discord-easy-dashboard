const { join } = require("path");

const BASE_PATH = ".";

module.exports = {
    home: join(__dirname, BASE_PATH, "index.ejs"),
    guild: join(__dirname, BASE_PATH, "guild.ejs"),
    selector: join(__dirname, BASE_PATH, "selector.ejs"),
    commands: join(__dirname, BASE_PATH, "commands.ejs"),
    404: join(__dirname, BASE_PATH, "404.ejs"),
    homel: join(__dirname, BASE_PATH, "indexl.ejs"),
    guildl: join(__dirname, BASE_PATH, "guildl.ejs"),
    selectorl: join(__dirname, BASE_PATH, "selectorl.ejs"),
    commandsl: join(__dirname, BASE_PATH, "commandsl.ejs"),
    405: join(__dirname, BASE_PATH, "404l.ejs"),
    change: join(__dirname, BASE_PATH, "index.ejs"),
    changel: join(__dirname, BASE_PATH, "indexl.ejs"),
    commands_list: join(__dirname, BASE_PATH, "commands_list.ejs"),
    commands_listl: join(__dirname, BASE_PATH, "commands_listl.ejs"),
};
