# Storing cookies
discord-easy-dashboard now supports custom cookies storage !
It allows to store login informations, current settings, etc.
You have to choose your storage system and implement it. This is a guide to make it easier.

## Setting up

Here we will use Redis as a storage for cookies, but you can use any database you want

1. Setup the Redis server on your PC. [Click here](https://www.google.com/search?q=How+to+install+redis+%3F) for help

2. Install required dependencies using npm :
```bash
npm i redis connect-redis
```

3. Now you can setup the Redis client and session object

```js
const redis = require('redis');
const connectRedis = require('connect-redis');
const session = require('express-session');

const RedisStore = connectRedis(session)
const redisClient = redis.createClient({
    host: 'localhost',
    port: 6379
})

redisClient.on('error', function (err) {
    console.log('Could not establish a connection with redis. ' + err);
});

redisClient.on('connect', function (err) {
    console.log('Connected to redis successfully');
});

const sessionObject = {
    store: new RedisStore({ client: redisClient }),
    secret: `discord-easy-dashboard-${Date.now()}-${Math.random().toString(36)}`,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // if true only transmit cookie over https
        httpOnly: false, // if true prevent client side JS from reading the cookie 
        maxAge: 1000 * 60 * 10 // session max age in miliseconds
    }
};
```

4. Finally, you can use the session object in your dashboard

```js
client.dashboard = new Dashboard(client, {
	// Other options
    session: sessionObject,
});
```