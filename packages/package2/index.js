const config = require('./config');

const PORT = (config && config.httpServer && config.httpServer.port) || 8123;
const path = require('path');
const Activity = require('package1');
const app = Activity();
app.static(path.join(__dirname, config.paths.static));
app.routesFolder(path.join(__dirname, config.paths.routes));
app.start(PORT);