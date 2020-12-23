const express = require('express');
const User = require('../models/userModel');


const router = express.Router();


router.post("/signin", async (req, res) => {
    try {
        const signinUser = await User.findOne({
            email: req.body.email,
            password: req.body.password
        });
        res.send({
            _id: signinUser.id,
            name: signinUser.name,
            email: signinUser.email,
            password: signinUser.password,
            token: getToken(signinUser)
        })
    }

    catch (error){
        res.status(401).send({ msg:error.message });
    }

});



router.get("/createadmin", async (req, res) => {
    try {
        const user =  new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            isAdmin: req.body.isAdmin
        });
        const newUser = await user.save();
        res.send(newUser);
    }
    catch (error) {
        res.send({ msg: error.message });
    }
})






module.exports = router