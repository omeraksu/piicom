const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

const getToken = (user) => {
  return jwt.sign({
    _id:user._id,
    name:user.name,
    email:user.email,
    isAdmin:user.isAdmin
  }, process.env.JWT_SECRET,{
    expiresIn:'48h'
  })
 
}

const isAdmin =(req,res,next) =>{
  console.log(req.user);
  if(req.user && req.user.isAdmin){
    return next();
  }
  return res.status(401).send({message:'Admin Token is not Valid'});
}
module.exports =  getToken,isAdmin;
