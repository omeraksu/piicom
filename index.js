const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const connectDatabase = require("./database/connectDatabase");
const bodyParser = require("body-parser");
const userRoute = require("./routes/userRoute");
const productRoute = require("./routes/productRoute");
const adminRoute = require("./routes/adminRoute");

const customErrorHandler = require('./middlewares/error/customErrorHandler')






//ENV Config
dotenv.config({
  path: "./config.env",
});

//MongoDb Connection
connectDatabase();

const PORT = process.env.PORT || 3000;

const app = express();

app.use(bodyParser.json());




app.get("/", (req, res) => res.json({ message: "working!" }));

app.use("/api/auth",userRoute);
app.use("/api/products",productRoute);
app.use("/api/",adminRoute)


//Error Handler
app.use(customErrorHandler);


// PORT Config
app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
