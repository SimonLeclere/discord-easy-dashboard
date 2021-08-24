const { Router } = require('express');

module.exports.Router = class Home extends Router {
	constructor() {
		super();
		this.get('/', function(req, res) {
			res.status(200).render('index.ejs', {
				bot: req.client,
				user: req.user,
				is_logged: Boolean(req.session.user),
				dashboardDetails: req.dashboardDetails,
				baseUrl: req.dashboardConfig.baseUrl,
                port: req.dashboardConfig.port,
				hasClientSecret: Boolean(req.dashboardConfig.secret),
				commands: req.dashboardCommands
			});
		});
	}
};

module.exports.name = '/';