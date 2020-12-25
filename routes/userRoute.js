const express = require("express");
const { connection } = require("mongoose");
const getToken = require("../jwt");
const User = require("../models/userModel");
const router = express.Router();



// TODO: express-validator, bcryptjs, jsonwebtoken eklenecek
// TODO: doğrulama şeyleri express-validator ile yapılacak ( min password length vs )

router.post("/signup", async (req, res) => {
  const { email, password, name, isAdmin, created, profile_image } = req.body;

  try {
    let user = await User.findOne({
      email,
    });

    if (user) {
      return res.status(400).json({
        succes: false,
        msg: "User Already Exists",
      });
    }

    // user defination
    user = new User({
      email,
      password,
      name,
      isAdmin,
      created,
      profile_image
    });

    // save
    await user.save();

    //response status and user data
    res
      .status(200)
      .json({
        msg :"Registration Successful",
        succes: true,
        data: user,

      });

    //catch
  } catch (err) {
    res.status(401).send({
       msg: err.message
    });
  }
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({
      email,
      password,
    });

    if (!user)
      return res.status(400).json({
        message: "User Not Exist",
      });

    // response
    res.status(200).send({
      msg: "Login Succesfull",
      email: email,
      password: password,
      token:getToken(user)
      



    });


  } catch (error) {
  res.send({ msg: error.message });
}
});

    //users: update request //POST REQ ile çalışılacak
router.post('/forgetpass/:id',(req,res) =>{
  User.findByIdAndUpdate({_id:req.params.id},req.body).then(function(user){
    res.status(200).json({
      msg:"Updated Data Succesfull",
      data:user
      
    });
  });
});


//users:delete request
router.delete('/delete/:id',(req,res) =>{
  User.findByIdAndDelete({_id:req.params.id},req.body).then(function(user){
    res.status(200).json({
      msg:"Deleted Data Successful",
      data:user
    })
  });
});

module.exports = router;
