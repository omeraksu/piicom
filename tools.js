const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

const getToken = (user) => {
  return jwt.sign({
    _id:user._id,
    name:user.name,
    email:user.email,
    isAdmin:user.isAdmin
  }, process.env.JWT_SECRET,{
    expiresIn:'10m'
  })
 
}

const isAuth = (req,res,next) => {
  const token= req.headers.authorization;
  if(token){
    const onlyToken = token.slice(7,token.lenght);
    jwt.verify(onlyToken,config.JWT_SECRET,(err,decode)=>{
      if(err){
        return res.status(401).send({message:'Invalid Token'});
        }
        req.user=decode;
        next();
        return;
    });
  }else{
    return res.status(401).send({message:'Token is not supplied'});
  }
};


// session cookie
//Kullanıcı ve ürün operasyonlarında eğer Admin ise kural tanımlaması routerların içine isAdmin olarak yazılacak.
const isAdmin =(req,res,next) =>{
  console.log(req.user);
  if(req.user && req.user.isAdmin){
    return next();
  }
  return res.status(401).send({message:'Admin Token is not Valid'});
}
module.exports =  getToken,isAdmin,isAuth;
