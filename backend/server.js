const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = express();
const PORT = process.env.PORT || 3000;

//Config Bağlantısı

dotenv.config({
    path: "/config.env"
});




app.get('/', (req, res) => res.send('Pii Wellcome'))


// PORT AYARI
app.listen(PORT, () => {
    console.log("Server started  at http://localhost:3000");
});