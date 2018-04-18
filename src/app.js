const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

const mongodb = process.env.MONGO_URI || "mongodb://localhost:27017/mern";
mongoose.Promise = global.Promise;
mongoose.connect(mongodb);
mongoose.connection
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("MongoDB Error: ", err));

const app = express();

app.set("port", process.env.PORT || "3000");

const routes = require("./routes");
app.use(routes);

module.exports = app;
