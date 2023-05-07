const mongoose = require("mongoose");

const dotenv = require('dotenv').config()

const dbURI = process.env.DBURL


mongoose.connect(dbURI);

// Extra

const db = mongoose.connection;

db.on("error", (err) => {
  console.log("ERROR IN MongoDB");
});

db.on("connected", (err) => {
  console.log("MongoDB IS CONNECTED ..");
});