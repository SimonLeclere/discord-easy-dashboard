const { Router } = require("express");
const CheckAuth = (req, res, next) =>
    req.session.user ? next() : res.status(401).redirect("/auth/login");
var name = "/commands";
const { Permissions } = require("discord.js");

const Commands = Router().get("/", [CheckAuth], function (req, res) {
    if (req.dashboardCommands.length === 0) return res.redirect("/");
    let file = req.dashboardConfig.theme["ahqcmd"] || "commands_list.ejs";

    if (req.dashboardConfig.mode[req.user.id] == "light") {
        file = req.dashboardConfig.theme["ahqcmdl"] || "commands_listl.ejs";
    }
    return await res.render(
        file,
        {
            bot: req.client,
            user: req.user,
            guilds: req.user.guilds.sort((a, b) =>
                a.name < b.name ? -1 : Number(a.name > b.name)
            ),
            is_logged: Boolean(req.session.user),
            Perms: Permissions,
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
        }
    );
})
.get("/:guildID", [CheckAuth], async (req, res) => {
    const guild = req.client.guilds.cache.get(req.params.guildID);
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
