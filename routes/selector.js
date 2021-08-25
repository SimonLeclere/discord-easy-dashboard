const { Router } = require('express');
const CheckAuth = (req, res, next) => (req.session.user ? next() : res.status(401).redirect('/auth/login'));
const { Permissions } = require('discord.js');

module.exports.Router = class Selector extends Router {
	constructor() {
		super();
		this.get('/', [CheckAuth], function(req, res) {

			res.status(200).render('selector.ejs', {
				bot: req.client,
				user: req.user,
				guilds: req.user.guilds.sort((a, b) => a.name < b.name ? - 1 : Number(a.name > b.name)),
				is_logged: Boolean(req.session.user),
                Perms: Permissions,
                path: req.path,
                baseUrl: req.dashboardConfig.baseUrl,
                port: req.dashboardConfig.port,
				dashboardDetails: req.dashboardDetails
			});
		});
	}
};

module.exports.name = '/selector';