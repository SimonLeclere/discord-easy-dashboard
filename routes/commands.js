const { Router } = require("express");
const CheckAuth = (req, res, next) =>
    req.session.user ? next() : res.status(401).redirect("/auth/login");
var name = "/commands";
const Commands = Router().get("/", [CheckAuth], function (req, res) {
    if (req.dashboardCommands.length === 0) return res.redirect("/");
    let file = req.dashboardConfig.theme["commands"] || "commands.ejs";

    if (req.dashboardConfig.mode[req.user.id] == "light") {
        file = req.dashboardConfig.theme["commandsl"] || "commandsl.ejs";
    }
    res.status(200).render(file, {
        bot: req.client,
        user: req.user,
        is_logged: Boolean(req.session.user),
        dashboardDetails: req.dashboardDetails,
        dashboardConfig: req.dashboardConfig,
        baseUrl: req.dashboardConfig.baseUrl,
        port: req.dashboardConfig.port,
        hasClientSecret: Boolean(req.dashboardConfig.secret),
        commands: req.dashboardCommands,
        mode: req.dashboardConfig.mode
    });
});
module.exports.Router = Commands;

module.exports.name = name;
