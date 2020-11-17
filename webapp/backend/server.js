require('dotenv').config();
const http = require('http');
const debug = require("debug")("node-angular");

const app = require('./backend/app');
var db = require('./backend/db');

db.connect(db.MODE_PRODUCTION, function(err){
    if(err){
        console.log("Unable to connect to Mariadb");
        process.exit(1);
    }
    else{
        console.log("Mariadb Connected Successfully");
        db.getUsers((results) => {
            console.log("Retrieved Users successfully");
        }, (err) => {
            console.log(err);
        });
    }
});

const normalizePort = val => {
    var port = parseInt(val, 10);

    if (isNaN(port)){
        // named pip
        return val;
    }

    if (port >= 0)
    {
        // port number
        return port;
    }

    return false;
};

const onError = error => {
    if (error.syscall !== 'listen') {
        throw error;
    }

    const bind = typeof addr == "string" ? "pipe " + addr : "port " + port;

    switch(error.code) {
        case "EACCES":
            console.error(bind + " requires elevated privileges");
            process.exit(1);
            break;
        case "EADDRINUSE":
            console.error(bind + " is already in use");
            process.exit(1);
            break;
        default:
            throw error;
    };
};

const onListening = () => {
    const addr = server.address();
    const bind = typeof addr == "string" ? "pipe " + addr : "port " + port;

    debug("Listening on " + bind);
};

const port = normalizePort(process.env.PORT || "3000");

app.set('post', port);

const server = http.createServer(app);
server.on("error", onError);
server.on("listening", onListening);
server.listen(port);
