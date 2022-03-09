const { Router } = require("express");
const CheckAuth = (req, res, next) =>
    req.session.user ? next() : res.status(401).redirect("/auth/login");
let file = ""
const Change = Router().get("/", [CheckAuth], async (req, res) => {

    if (req.dashboardConfig.mode[req.user.id] == "light") {
        file = req.dashboardConfig.theme["home"] || "index.ejs";
    } else {
        req.dashboardConfig.mode[req.user.id] = "light";
    }
    res.redirect("/");
});

module.exports.Router = Change;

module.exports.name = "/change";