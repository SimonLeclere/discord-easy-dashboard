const express = require('express');
const session = require('express-session');
const { readdir } = require('fs');
const path = require('path');

const { EventEmitter } = require('events');

class Dashboard extends EventEmitter {
    constructor(client, options) {
		super();

		if (!client) throw new Error('Client is a required parameter.');
        this.client = client;

		
        this.app = express();
        
        this.details = {
			name: options?.name || client.user.username || null,
            description: options?.description || null,
			serverUrl: options?.serverUrl || null
        };

		if(!client.isReady()) client.on('ready', () => this.details.name = this.details.name === null ? this.client.user.username : this.details.name)
		
		this._commands = [];
		this._settings = [];
        
        this.config = {
            baseUrl: options?.baseUrl || 'http://localhost',
            port: options?.port || 3000,
            secret: options?.secret,
            logRequests: options?.logRequests || false
        };
        
        if(!this.config.secret) console.warn('Without the client.secret parameter, some features of discord-easy-dashboard will be disabled, like Discord authentification or guild settings...');
        
        this._setup();
        this._loadRoutes();
        this._start();

    }
    
    _setup() {
		this.app.set('port', this.config.port || 3000);
        this.app.set('views', path.join(__dirname, 'views'));
		this.app.set('view engine', 'ejs');
		
        this.app.use(express.static(path.join(__dirname, 'public')));
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false }));
        
		if(this.config.logRequests) {
            const morgan = require('morgan');
            this.app.use(morgan('dev'));
        }
    
		this.app.use(session({
			secret: `discord-easy-dashboard-${Date.now()}${this.client.id}`,
			resave: false,
			saveUninitialized: false,
		}));

		this.app.use((req, res, next) => {
            res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
			res.setHeader('Access-Control-Allow-Origin', '*');
			res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
			res.setHeader('Access-Control-Allow-Credentials', true);

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
		readdir(path.join(__dirname, 'routes'), (err, files) => {
			if (err) return new Error(err);
			const routes = files.filter((c) => c.split('.').pop() === 'js');
			if (files.length === 0 || routes.length === 0) throw new Error('No routes was found!');
			for (let i = 0; i < routes.length; i++) {

				if(!this.config.secret && ['auth.js', 'manage.js', 'selector.js'].includes(routes[i])) continue;

				const route = require(`./routes/${routes[i]}`);
				this.app.use(route.name, new route.Router());
			}
		});
	}

    _start() {
		try {
			this.app.listen(this.app.get('port'));
			this.emit('ready');
		}
		catch (e) {
			throw new Error(e);
		}
	}

	registerCommand(name, description, usage) {
		this._commands.push({ name, description, usage });
	}

	addTextInput(name, description, validator, setter, getter) {
		this._settings.push({ name, description, type: 'text input', validator, set: setter, get: getter });
	}

	addBooleanInput(name, description, setter, getter) {
		this._settings.push({ name, description, type: 'boolean input', set: setter, get: getter });
	}

	addSelector(name, description, getSelectorEntries, setter, getter) {
		this._settings.push({ name, description, type: 'selector', getSelectorEntries, set: setter, get: getter });
	}

}

module.exports = Dashboard;
