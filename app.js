require('dotenv').config();

const cors = require('cors');
const createError = require('http-errors');
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const path = require('path');
const YAML = require('yamljs');

const authRouter = require('./routes/auth.route');
const questionRouter = require('./routes/questions.route');
const userRouter = require('./routes/user.route');

const swaggerJsDocs = YAML.load('./middlewares/utils/api.yaml');
const swaggerUi = require('swagger-ui-express');

global.appRoot = path.resolve(__dirname);
global.appName = "Kwiz-API";

mongoose.connect(process.env.MONGO_ATLAS_URL, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(() => console.log(`[Database connection]: Connected correctly to MongoDB server for ${appName}..`))
  .catch(error => console.error(`Connection error to MongoDB Server. [Issue]: ${error}`));;

const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Accept", "application/json");
  res.header("Access-Control-Allow-Credentials", 'true');
  next();
});

app.use(cors());
app.use(morgan('dev'));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(express.json({ limit: "50mb" }));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerJsDocs));

app.get("/", (req, res) => { res.redirect('/api-docs') });
app.use('/auth', authRouter);
app.use('/quiz', questionRouter);
app.use('/user', userRouter);

app.use((req, res, next) => {
  next(createError(404, "This URL does not exist!"));
});

module.exports = app;
