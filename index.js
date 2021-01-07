require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const userRoute = require("./routes/userRoute");
const productRoute = require("./routes/productRoute");
const adminRoute = require("./routes/adminRoute");

const connectDatabase = require("./database/connectDatabase");
const customErrorHandler = require("./middlewares/error/customErrorHandler");

// MongoDb Connection
connectDatabase();

const PORT = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => res.json({ message: "lan kimsin amq!" }));

app.use("/api/auth", userRoute);
app.use("/api/products", productRoute);
app.use("/api/", adminRoute);

//Error Handler
app.use(customErrorHandler);

// PORT Config
app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
