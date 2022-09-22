require('dotenv').config();

const path = require('path');
global.appRoot = path.resolve(__dirname);
global.appName = `School Management API`;

const app = require('./app');
const port = process.env.PORT || 4000;

app.listen(port, () => console.log(`[${appName}]: http://localhost:${port}`));