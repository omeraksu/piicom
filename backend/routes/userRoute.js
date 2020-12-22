const express = require('express')
const User = require('../models/userModel')

const router = express.Router();

router.get("/createadmin",async(req,res) =>{
    try{
        const user =new User({
            name:'Eray',
            email:'eraykilic16@gmail.com',
            password:'123456',
            isAdmin:'true'
        });
        const newUser = await user.save();
        res.send(newUser);
    }
    catch(error) {
        res.send({msg:error.message});
    }
})

module.exports = router