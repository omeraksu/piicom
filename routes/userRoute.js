const express = require("express");
const mongoose  = require("mongoose");
const getToken = require("../tools");
const User = require("../models/userModel");
const productModel = require("../models/productModel");
const CustomError = require("../helpers/CustomError");
const asyncErrorWrapper = require("express-async-handler")
const bcrypt = require('bcrypt');



const router = express.Router();



// TODO: express-validator,  jsonwebtoken eklenecek
// TODO: doğrulama şeyleri express-validator ile yapılacak ( min password length vs )

// AUTH

router.post("/signup",asyncErrorWrapper( async (req, res,next) => {
  const { email, password, name, isAdmin, created, profile_image } = req.body;
  
//User Email Database Kontrolü
  
    let user = await User.findOne({
      email,
    });

  
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

   
}));

router.post("/signin",asyncErrorWrapper( async (req, res,next) => {
  const { email, password } = req.body;

  
    let user = await User.findOne({
      email,
      password,
     
    });

    // if (!user)
    //   return res.status(400).json({
    //     message: "User Not Exist",
    //   });

    // response
    res.status(200).send({
      msg: "Login Succesfull",
      succes: true,
      data:user,
        
      token:getToken(user)
      
    });

}));




    //users: update request //POST REQ ile çalışılacak
    router.put('/forgetpass/:id', asyncErrorWrapper(async (req, res,next) => {
      const userId = req.params.id;
      const user = await User.findById(userId);
      
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.password = req.body.password || user.password;
        user.profile_image =req.body.profile_image || user.profile_image;
     
        const updatedUser = await user.save();
        return res.status(200)
        .send({ message: 'User Updated',
         data: updatedUser,
         token: getToken(updatedUser)
       });
          
        
    
    }));
   


//users:delete request
router.delete('/delete/:id',asyncErrorWrapper(async(req,res,next)=>{
  const deletedUser =await User.findByIdAndDelete(req.params.id);
  
    await deletedUser.delete();
    res.send({message:"User Deleted"});
 
}));

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





