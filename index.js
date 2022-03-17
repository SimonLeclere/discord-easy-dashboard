const express = require("express");
const session = require("express-session");
const favicon = require("serve-favicon");
const { existsSync, readdirSync } = require("fs");
const { join } = require("path");
const ejs = require("ejs");
const { EventEmitter } = require("events");
const {
    Permissions
} = require("discord.js");

class Dashboard extends EventEmitter {
    constructor(client, options) {
        super();

        if (+process.versions.node.split(".")[0] < 16)
            throw new Error("Discord-easy-dashboard only supports node-v16+");

        if (!client) throw new Error("Client is a required parameter.");
        this.client = client;

        this.app = express();

        this.details = {
            name: options?.name || client?.user?.username || null,
            description: options?.description || null,
            faviconPath: options?.faviconPath || null,
            serverUrl: options?.serverUrl || null,
            inviteUrl: options?.inviteUrl || `https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&redirect_uri=${options.baseUrl}/selector&response_type=code&scope=bot%20applications.commands%20identify`,
        };

        if (!client.isReady())
            client.on(
                "ready",
                () =>
                    (this.details.name =
                        this.details.name === null ? this.client.user.username : this.details.name)
            );

        this._commands = [];
        this._settings = [];
        this._mode = [];

        this.config = {
            baseUrl: options?.baseUrl || "http://localhost",
            port: options?.port || 3000,
            noPortIncallbackUrl: options?.noPortIncallbackUrl || false,
            secret: options?.secret,
            logRequests: options?.logRequests || false,
            injectCSS: options?.injectCSS || null,
            theme: options?.theme
                ? existsSync(join(__dirname, "themes", "dark"))
                    ? require(join(__dirname, "themes", "dark"))
                    : existsSync(join(__dirname, "themes", "dark"))
                    ? require(join(__dirname, "themes", "dark"))
                    : require(join(__dirname, "themes", "dark"))
                : require(join(__dirname, "themes", "dark")),
            mode: this._mode,
            session: options?.session || null,
            permissions: options?.permissions || [Permissions.FLAGS.ADMINISTRATOR]
        };

        if (!this.config.secret)
            console.warn(
                "Without the client.secret parameter, some features of discord-easy-dashboard will be disabled, like Discord authentification or guild settings..."
            );

        this._setup();
        this._checkRoutes();
        this._loadRoutes();
        this._start();
    }

    _setup() {
        this.app.set("port", this.config.port || 3000);
        this.app.set("views", join(__dirname, "themes", "dark"));
        this.app.set("view engine", "ejs");
        this.app.engine("ejs", async (path, data, cb) => {
            try {
                let html = await ejs.renderFile(path, data, { async: true });
                cb(null, html);
            } catch (e) {
                cb(e, "");
            }
        });
        if (this.details.faviconPath) this.app.use(favicon(this.details.faviconPath));
        this.app.use(express.static(join(__dirname, "public")));
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false }));

        if (this.config.logRequests) {
            const morgan = require("morgan");
            this.app.use(morgan("dev"));
        }

        if(this.config.session) {
            this.app.use(session(this.config.session));
        }
        else {
            this.app.use(
                session({
                    secret: `discord-easy-dashboard-${Date.now()}-${this.client.id}-${Math.random().toString(36)}`,
                    resave: false,
                    saveUninitialized: false,
                })
            );
        }

        this.app.use((req, res, next) => {
            res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type");
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
            res.setHeader("Access-Control-Allow-Credentials", true);

            req.user = req.session.user;
            req.dashboardConfig = this.config;
            req.dashboardDetails = this.details;
            req.dashboardCommands = this._commands;
            req.client = this.client;
            req.dashboardEmit = (...args) => this.emit(...args);
            req.dashboardSettings = this._settings;

            next();
        });
    }
    _loadRoutes() {
        const files = readdirSync(join(__dirname, "routes"));
        const routes = files.filter((c) => c.split(".").pop() === "js");
        if (files.length === 0 || routes.length === 0) throw new Error("No routes were found!");
        for (let i = 0; i < routes.length; i++) {
            if (
                (!this.config.secret &&
                    ["auth.js", "manage.js", "selector.js"].includes(routes[i])) ||
                routes[i] === "custom.js"
            )
                continue;
            const route = require(`./routes/${routes[i]}`);
            this.app.use(route.name, route.Router);
        }
        // Register 404 route for fallback
        const fallback = require("./routes/custom");
        this.app.use(fallback.name, fallback.Router);
    }
    _checkRoutes() {
        // Manual checking because the structure for 404 is weird
        if (!this.config.theme[404])
            console.warn(
                `No key found in the theme object for "404", falling back to the default one`
            );
        for (let routeFile of readdirSync(join(__dirname, "routes")).filter((e) =>
            e.endsWith(".js")
        )) {
            if (["auth.js", "custom.js"].includes(routeFile)) continue;
            const route = require(`./routes/${routeFile}`);
            let routeName;
            switch (route.name) {
                case "/":
                    routeName = "home";
                    break;
                case "/manage":
                    routeName = "guild";
                    break;
                case "/home":
                    routeName = "change";
                    break;
                default:
                    routeName = route.name.split("/")[1];
            }
            if (!this.config.theme[routeName])
                console.warn(
                    `No key found in the theme object for "${route.name}", falling back to the default one`
                );
        }
    }
    _start() {
        try {
            this.app.listen(this.app.get("port"));
            this.emit("ready");
        } catch (e) {
            throw new Error(e);
        }
    }

    registerCommand(name, description, usage, style) {
        this._commands.push({ 
            name, 
            description, 
            usage, 
            style: style
        });
    }

    addTextInput(name, description, validator, setter, getter) {
        this._settings.push({
            name,
            description,
            type: "text input",
            validator,
            set: setter,
            get: getter,
        });
    }

    addBooleanInput(name, description, setter, getter) {
        this._settings.push({ name, description, type: "boolean input", set: setter, get: getter });
    }
    
    addColorInput(name, description, setter, getter) {
        this._settings.push({ name, description, type: "color input", set: setter, get: getter });
    }

    addSelector(name, description, getSelectorEntries, setter, getter) {
        this._settings.push({
            name,
            description,
            type: "selector",
            getSelectorEntries,
            set: setter,
            get: getter,
        });
    }
}

module.exports = Dashboard;
