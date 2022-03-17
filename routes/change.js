const { Router } = require("express");
const CheckAuth = (req, res, next) =>
    req.session.user ? next() : res.status(401).redirect("/auth/login");
let file = ""
const Change = Router().get("/", [CheckAuth], async (req, res) => {

    if (req.dashboardConfig.mode[req.user.id] == "light") {
        req.dashboardConfig.mode[req.user.id] = "dark";
        file = req.dashboardConfig.theme["home"] || "index.ejs";
    } else {
        file = req.dashboardConfig.theme["homel"] || "indexl.ejs";
        req.dashboardConfig.mode[req.user.id] = "light";
    }
    return res.status(401).redirect("/");
    // return await res.render(
    //     file,
    //     {
    //         bot: req.client,
    //         user: req.user,
    //         is_logged: Boolean(req.session.user),
    //         dashboardDetails: req.dashboardDetails,
    //         dashboardConfig: req.dashboardConfig,
    //         baseUrl: req.dashboardConfig.baseUrl,
    //         port: req.dashboardConfig.port,
    //         hasClientSecret: Boolean(req.dashboardConfig.secret),
    //         commands: req.dashboardCommands,
    //     },
    //     (err, html) => {
    //         if (err) {
    //             res.status(500).send(err.message);
    //             return console.error(err);
    //         }
    //         res.status(200).send(html);
    //     }
    // );
});

module.exports.Router = Change;

module.exports.name = "/home";
