require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

const { MongoClient } = require("mongodb");
const url = process.env.MONGODB_URI;
const client = new MongoClient(url);
client
  .connect()
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

const api = require("./api.js");
api.setApp(app, client);

app.listen(5000, "0.0.0.0", () => {
  console.log("Server running on port 5000");
});