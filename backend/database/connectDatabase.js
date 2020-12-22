const mongoose = require('mongoose');

const connectDatabase = () => {
    mongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useFindAndModify: false,
        useCreateIndex: true,
        useUnifiedTopology: true
    })
        .then(() => {
            console.log("MongoDb Connect Succesfull");
        })
        .catch(err => {
            console.error(err);
            console.log("MongoDb Connection is Failed");
        })
}
module.exports = connectDatabase