const { Router } = require("express");
const CheckAuth = (req, res, next) =>
    req.session.user ? next() : res.status(401).redirect("/auth/login");

const Server = Router()
    .get("/:guildID", CheckAuth, async (req, res) => {
        const guild = req.client.guilds.cache.get(req.params.guildID);
        if (!guild) return res.redirect("/ahq_dash_error");

        const member = await guild.members.fetch(req.user.id);
        if (!member || !member.permissions.has(req.dashboardConfig.permissions)) return res.redirect("/ahq_dash_perms_error");
        let file = req.dashboardConfig.theme["guild"] || "guild.ejs";
        
        if (req.dashboardConfig.mode[req.user.id] == "light") {
            file = req.dashboardConfig.theme["guildl"] || "guildl.ejs";
        }
        return await res.render(
            file,
            {
                bot: req.client,
                user: req.user,
                is_logged: Boolean(req.session.user),
                guild,
                alert: null,
                errors: false,
                dashboardDetails: req.dashboardDetails,
                dashboardConfig: req.dashboardConfig,
                settings: req.dashboardSettings,
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
    .post("/:guildID", CheckAuth, async (req, res) => {
        const guild = req.client.guilds.cache.get(req.params.guildID);
        if (!guild) return res.redirect("/selector");

        const member = await guild.members.fetch(req.user.id);
        if (!member) return res.redirect("/selector");
        if (!member.permissions.has("ADMINISTRATOR")) return res.redirect("/selector");

        const errors = [];
        Object.keys(req.body).forEach((item) => {
            const setting = req.dashboardSettings.find((x) => x.name === item);
            if (!setting) return;

            if (setting.validator && !setting.validator(req.body[item])) return errors.push(item);

            if (setting.type === "boolean input") req.body[item] = Array.isArray(req.body[item]) ? true : false;

            setting.set(req.client, guild, req.body[item]);
        });
        let file = req.dashboardConfig.theme["guild"] || "guild.ejs";

        if (req.dashboardConfig.mode[req.user.id] == "light") {
            file = req.dashboardConfig.theme["guildl"] || "guildl.ejs";
        }
        return await res.render(
            file,
            {
                bot: req.client,
                user: req.user,
                is_logged: Boolean(req.session.user),
                guild,
                alert:
                    errors.length > 0
                        ? `The following items are invalid and have not been saved: ${errors.join(
                              ", "
                          )}.`
                        : "Your settings have been saved.",
                errors: errors.length > 0,
                dashboardDetails: req.dashboardDetails,
                dashboardConfig: req.dashboardConfig,
                settings: req.dashboardSettings,
            },
            (err, html) => res.status(200).send(html)
        );
    })
    .get("/", CheckAuth, (req, res) => {
        res.redirect("/selector");
    });

module.exports.Router = Server;

module.exports.name = "/manage";
