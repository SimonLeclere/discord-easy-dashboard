const { Router } = require("express");
const CheckAuth = (req, res, next) =>
    req.session.user ? next() : res.status(401).redirect("/auth/login");
var name = "/commands";
const Commands = Router().get("/", [CheckAuth], function (req, res) {
    if (req.dashboardCommands.length === 0) return res.redirect("/");
    let file = req.dashboardConfig.theme["ahqcmd"] || "commands_list.ejs";

    if (req.dashboardConfig.mode[req.user.id] == "light") {
        file = req.dashboardConfig.theme["ahqcmdl"] || "commands_listl.ejs";
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
        mode: req.dashboardConfig.mode,
        guilds: req.user.guilds.sort((a, b) =>
        a.name < b.name ? -1 : Number(a.name > b.name)
        ),
    });
})
.get("/:guildID", [CheckAuth], async (req, res) => {
    const guild = req.client.guilds.cache.get(req.params.guildId);
    if (!guild) return res.status(405).redirect("/405_error");
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
        mode: req.dashboardConfig.mode,
        guild
    });

});
module.exports.Router = Commands;

module.exports.name = name;
