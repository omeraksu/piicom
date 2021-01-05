
const CustomError = require("../../helpers/errors/CustomError");
const asyncErrorWrapper = require("express-async-handler");
const User = require("../../models/userModel");
const jwt = require("jsonwebtoken");
const { isTokenIncluded, getAccessTokenFromHeader } = require("../../helpers/authorization/tokenHelpers");


// Token authorizationa dahil mi ?

const getAccessToRoute = (req, res, next) => {
    const { JWT_SECRET_KEY } = process.env;

    if (!isTokenIncluded(req)) {

        return next(new CustomError("You are not authorized to access this route.", 401))
    };


    // Header'a tokeni gönderme
    const accessToken = getAccessTokenFromHeader(req);

    jwt.verify(accessToken, JWT_SECRET_KEY, (err, decoced) => {
        if (err) {
            return next(new CustomError("You are not authorized to access this route.", 401))
        }
        req.user = {
            id: decoced.id,
            name: decoced.name
        }


        next();
    })
}

//Admin ise kontrolü

const getAdminAccess = asyncErrorWrapper(async (req, res, next) => {

    const {id} = req.user;
    const user = await User.findById(id);
    if(user.role !== "admin")
    {
        return next(new CustomError("Only Admins can Access This Route",403))
    }
    next();
})

module.exports = {getAccessToRoute,getAdminAccess}