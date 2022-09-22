require('dotenv').config();

const cors = require('cors');
const createError = require('http-errors');
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const path = require('path');


global.appRoot = path.resolve(__dirname);
global.appName = "Kwiz-API";

mongoose.connect(process.env.MONGO_ATLAS_URL, {useUnifiedTopology: true, useNewUrlParser: true})
.then(() => console.log("successfully connected to database"))
.catch(error => console.log(`unable to connect to database. {Issue]: ${error}`));

const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.use(cors());
app.use(morgan('dev'));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(express.json({ limit: "50mb" }));

app.get("/", (req, res) => { res.json("hello world") });
app.use((req, res, next) => {
  next(createError(404, "This URL does not exist!"));
});

module.exports = app;
