const { Router } = require('express');

const Commands = Router().get('/*', function(req, res) {
	const path = req.baseUrl.split('/').pop();
	if (!req.dashboardConfig.theme[path]) {
		const file = req.dashboardConfig.theme['404'] || '404.ejs';
		return res.status(404).render(file, {
			bot: req.client,
			user: req.user,
			is_logged: Boolean(req.session.user),
			dashboardDetails: req.dashboardDetails,
			dashboardConfig: req.dashboardConfig,
			baseUrl: req.dashboardConfig.baseUrl,
			port: req.dashboardConfig.port,
			hasClientSecret: Boolean(req.dashboardConfig.secret),
			commands: req.dashboardCommands,
		});
	}
	res.status(200).render(req.dashboardConfig.theme[path], {
		bot: req.client,
		user: req.user,
		is_logged: Boolean(req.session.user),
		dashboardDetails: req.dashboardDetails,
		dashboardConfig: req.dashboardConfig,
		baseUrl: req.dashboardConfig.baseUrl,
		port: req.dashboardConfig.port,
		hasClientSecret: Boolean(req.dashboardConfig.secret),
		commands: req.dashboardCommands,
	});
});
module.exports.Router = Commands;

module.exports.name = '/*';
