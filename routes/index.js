const { Router } = require("express");

const Home = Router().get("/", async (req, res) => {
    let file = req.dashboardConfig.theme["home"] || "index.ejs";
    if (req.user) {
        if (!(req.dashboardConfig.mode[req.user.id])) {
            (req.dashboardConfig.mode[req.user.id]) = "dark";
        }
        if (req.dashboardConfig.mode[req.user.id] == "light") {
            file = req.dashboardConfig.theme["homel"] || "indexl.ejs";
        }
    }
    return await res.render(
        file,
        {
            bot: req.client,
            user: req.user,
            is_logged: Boolean(req.session.user),
            dashboardDetails: req.dashboardDetails,
            dashboardConfig: req.dashboardConfig,
            baseUrl: req.dashboardConfig.baseUrl,
            port: req.dashboardConfig.port,
            hasClientSecret: Boolean(req.dashboardConfig.secret),
            commands: req.dashboardCommands,
        },
        (err, html) => {
            if (err) {
                res.status(500).send(err.message);
                return console.error(err);
            }
            res.status(200).send(html);
        }
    );
});

module.exports.Router = Home;

module.exports.name = "/";
