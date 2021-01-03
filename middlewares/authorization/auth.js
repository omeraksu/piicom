const CustomError = require("../../helpers/errors/CustomError");
const jwt = require("jsonwebtoken");
const {isTokenIncluded,getAccessTokenFromHeader} = require("../../helpers/authorization/tokenHelpers");

// Token authorizationa dahil mi ?

const getAccessToRoute = (req,res,next) => {
    const{JWT_SECRET_KEY} = process.env;

    if(!isTokenIncluded(req)){

        return next(new CustomError("You are not authorized to access this route.",401))
    };
    

    // Header'a tokeni gönderme
    const accessToken= getAccessTokenFromHeader(req);

    jwt.verify(accessToken,JWT_SECRET_KEY,(err,decoced)=>{
        if(err){
            return next(new CustomError("You are not authorized to access this route.",401))
        }
        req.user = {
           id:decoced.id,
           name:decoced.name
        }
        
        
        next();
    })
}


module.exports = getAccessToRoute;