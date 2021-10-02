const { Router } = require("express");

const Home = Router().get("/", async (req, res) => {
    return await res.render(
        "index.ejs",
        {
            bot: req.client,
            user: req.user,
            is_logged: Boolean(req.session.user),
            dashboardDetails: req.dashboardDetails,
            baseUrl: req.dashboardConfig.baseUrl,
            port: req.dashboardConfig.port,
            hasClientSecret: Boolean(req.dashboardConfig.secret),
            commands: req.dashboardCommands,
        },
        (err, html) => res.status(200).send(html)
    );
});

module.exports.Router = Home;

module.exports.name = "/";
