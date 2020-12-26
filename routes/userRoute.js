const express = require("express");
const { connection, Mongoose } = require("mongoose");
const getToken = require("../tools");
const User = require("../models/userModel");
const productModel = require("../models/productModel");
const router = express.Router();



// TODO: express-validator, bcryptjs, jsonwebtoken eklenecek
// TODO: doğrulama şeyleri express-validator ile yapılacak ( min password length vs )

// AUTH

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



module.exports = router;





// router.delete('/delete/:id',(req,res) =>{
//   User.findByIdAndDelete({_id:req.params.id},req.body).then(function(user){
//     res.status(200).json({
//       msg:"Deleted Data Successful",
//       data:user
//     })
//   });
// });



// router.delete('/delete/:id',async(req,res)=>{
//   const deletedUser =await User.findByIdAndDelete(req.params.id);
//   if(deletedUser){
//     await deletedUser.delete();
//     res.send({message:"User Deleted"});
//   }else{
//     res.send('Error in Deletion.');
//   }
// });
