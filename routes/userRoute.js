const express = require("express");
const { connection } = require("mongoose");

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
        succes: true,
        data: user

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
      msg: "welcome to dark side",
      email: email,
      password: password,



    });


  } catch (error) {
  res.send({ msg: error.message });
}
});

    //users:email update request
router.put('/forgetpass/:id',(req,res) =>{
  User.findByIdAndUpdate({_id:req.params.id},req.body).then(function(User){
    res.send(User);
  })
 
  
});
module.exports = router;
