const { join } = require('path');

const BASE_PATH = '.';

module.exports = {
	home: join(__dirname, BASE_PATH, 'index.ejs'),
	guild: join(__dirname, BASE_PATH, 'guild.ejs'),
	selector: join(__dirname, BASE_PATH, 'selector.ejs'),
	commands: join(__dirname, BASE_PATH, 'commands.ejs'),
	404: join(__dirname, BASE_PATH, '404.ejs'),
};
