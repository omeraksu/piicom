const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const connectDatabase = require("./database/connectDatabase");
const bodyParser = require("body-parser");
const userRoute = require("./routes/userRoute");
const router = require("./jwt");

//ENV Config
dotenv.config({
  path: "./config.env",
});

//MongoDb Connection
connectDatabase();

const PORT = process.env.PORT || 4000;
const jwt = process.env.JWT;
const app = express();

app.use(bodyParser.json());

app.get("/", (req, res) => res.json({ message: "working!" }));

app.use("/api/auth", userRoute);



// PORT Config
app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
