const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDatabase = require("./database/connectDatabase");
const bodyParser = require('body-parser');
const userRoute = require('./routes/userRoute');
const router = require('./jwt')

//Config Bağlantısı
dotenv.config({
    path: "./config.env"
});



//MongoDb Parametrik Bağlantı 
connectDatabase();
const PORT = process.env.PORT;
const jwt = process.env.JWT;
const app = express();


app.use(bodyParser.json());

app.use("/api/users", userRoute);

app.get('/', (req, res) => res.json('Home Screen'));




// PORT AYARI
app.listen(PORT, () => {
    console.log("Server started at http://localhost:3000");
});