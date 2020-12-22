const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDatabase = require("./database/connectDatabase");
const userRoute = require('./routes/userRoute');


//Config Bağlantısı
dotenv.config({
    path: "./config/config.env"
});



//MongoDb Parametrik Bağlantı 
connectDatabase();
const PORT = process.env.PORT;
const app = express();



app.get('/', (req, res) => res.json('Home Screen'));

app.use("/api/users", userRoute);






// PORT AYARI
app.listen(PORT, () => {
    console.log("Server started at http://localhost:3000");
});