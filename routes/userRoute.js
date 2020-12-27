const express = require("express");
const mongoose  = require("mongoose");
const getToken = require("../tools");
const isAdmin = require("../tools")
const User = require("../models/userModel");
const productModel = require("../models/productModel");
const isAuth = require('../tools');
const bcrypt = require('bcrypt');


const router = express.Router();



// TODO: express-validator,  jsonwebtoken eklenecek
// TODO: doğrulama şeyleri express-validator ile yapılacak ( min password length vs )

// AUTH

router.post("/signup", async (req, res) => {
  const { email, password, name, isAdmin, created, profile_image } = req.body;
  
//User Email Database Kontrolü
  try {
    let user = await User.findOne({
      email,
    });

    //Eğer Kullanıcı Db'de varsa Dönen Sonuç
    if (user) {
      return res.status(400).json({
        succes: false,
        msg: "User Already Exists",
      });

     
      
    }
     //Hash Password  
    const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password,salt);

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
        email:email,
        password:hashedPassword,
        name:name,
        isAdmin:isAdmin,
        created:created,
        profile_image:profile_image

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
      data:user,
      token:getToken(user)
      
    });
  } catch (error) {
  res.send({ msg: error.message });
}
});


router.post('/forgetpass', async (req,res) => {
  const {email} = req.body
  try {
      let user = await User.findOne({
        email
      })
      if(!user){
        res.status(400).send({
          msg: "Email is not Defined"
        })
      }
      res.status(200).send({
        msg: "Email is Defined",
        data: user
      })
  }
   catch(err){
     res.send({msg: err.message});
   }
})

    //users: update request //POST REQ ile çalışılacak
    router.put('/forgetpass/:id', async (req, res) => {
      const userId = req.params.id;
      const user = await User.findById(userId);
      if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.password = req.body.password || user.password;
        const updatedUser = await user.save();
        res.send({
          message:'Updated Data Succesfull',
          _id: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email,
          isAdmin: updatedUser.isAdmin,
          token: getToken(updatedUser),
        });
      } else {
        res.status(404).send({ message: 'User Not Found' });
      }
    });
   


//users:delete request
router.delete('/delete/:id',async(req,res)=>{
  const deletedUser =await User.findByIdAndDelete(req.params.id);
  if(deletedUser){
    await deletedUser.delete();
    res.send({message:"User Deleted"});
  }else{
    res.send('Error in Deletion.');
  }
});

// Tüm Kullanıcıları getirme

router.get("/",(req,res) =>{
    
  User.find({},(error,user)=>{
      if(error){
          res.send("Users is not Found");
      }
      else{
          res.json(user);
      }
  })
})

module.exports = router;





