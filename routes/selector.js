const { Router } = require('express');
const CheckAuth = (req, res, next) => req.session.user ? next() : res.status(401).redirect('/auth/login');

const Selector = Router().get('/', CheckAuth, async (req, res) => {
	const file = req.dashboardConfig.theme.selector || 'selector.ejs';

	return await res.render(
		file,
		{
			bot: req.client,
			user: req.user,
			guilds: req.user.guilds.sort((a, b) =>
				a.name < b.name ? -1 : Number(a.name > b.name),
			),
			is_logged: Boolean(req.session.user),
			deserializePermissions: req.deserializePermissions,
			path: req.path,
			baseUrl: req.dashboardConfig.baseUrl,
			port: req.dashboardConfig.port,
			dashboardDetails: req.dashboardDetails,
			dashboardConfig: req.dashboardConfig,
		},
		(err, html) => {
			if (err) {
				res.status(500).send(err.message);
				return console.error(err);
			}
			res.status(200).send(html);
		},
	);
});

module.exports.Router = Selector;

module.exports.name = '/selector';
