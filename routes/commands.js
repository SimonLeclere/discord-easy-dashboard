const { Router } = require('express');

module.exports.Router = class Home extends Router {
	constructor() {
		super();
		this.get('/', function(req, res) {

            if(req.dashboardCommands.length === 0) return res.redirect('/');

			res.status(200).render('commands.ejs', {
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

module.exports.name = '/commands';