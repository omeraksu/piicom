const express = require("express");
const mongoose = require("mongoose");
const User = require("../models/userModel");
const productModel = require("../models/productModel");
const { sendJwtToClient } = require("../helpers/authorization/tokenHelpers");
const { getAccessToRoute } = require("../middlewares/authorization/auth");
const CustomError = require("../helpers/errors/CustomError");

const asyncErrorWrapper = require("express-async-handler");
const {
  valideUserInput,
  comparePassword,
} = require("../helpers/inputHelpers/inputHelpers");

const router = express.Router();

//Profil
router.get("/profile", getAccessToRoute, (req, res, next) => {
  res.json({
    success: true,
    data: {
      id: req.user.id,
      name: req.user.name,
    },
  });
});

router.post(
  "/signup",
  asyncErrorWrapper(async (req, res, next) => {
    const { email, password, name, role, created, profile_image } = req.body;

    //User Email Database Kontrolü
    let user = await User.findOne({
      email,
    });

    // user defination
    user = new User({
      email,
      password,
      name,
      role,
      created,
      profile_image,
    });

    // save
    await user.save();

    sendJwtToClient(user, res);
  })
);

router.post(
  "/signin",
  asyncErrorWrapper(async (req, res, next) => {
    const { email, password } = req.body;

    // Eğer Kullanıcı Email yada passsword girmez ise fırlatılacak hata
    if (!valideUserInput(email, password)) {
      return next(new CustomError("Please Check Your Inputs", 400));
    }

    // Eğer girilen parolayla db deki hashlenmiş password eşleşmez ise.
    const user = await User.findOne({ email }).select("+password");
    if (!comparePassword(password, user.password)) {
      return next(new CustomError("Please Check Your Credentials ", 400));
    }

    sendJwtToClient(user, res);
  })
);
// Kullanıcı Çıkış yaparken cookieyi çıkış yaptığı anda kaldırma
router.get("/logout", getAccessToRoute, async (req, res, next) => {
  const { NODE_ENV } = process.env;

  return res
    .status(200)
    .cookie({
      httpOnly: true,
      expires: new Date(Date.now()),
      secure: NODE_ENV === "development" ? false : true,
    })
    .json({
      success: true,
      message: "Logout Successfull",
    });
});

router.post(
  "/userUpdate/:id",
  asyncErrorWrapper(async (req, res, next) => {
    const userId = req.params.id;
    const user = await User.findById(userId);

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.password = req.body.password || user.password;
    user.profile_image = req.body.profile_image || user.profile_image;

    const updatedUser = await user.save();
    return res.status(200).send({
      message: "User Updated",
      data: updatedUser,
    });
  })
);

// Kullanıcı Email Şifre Sıfırlama

//users:delete request
router.delete(
  "/delete/:id",
  asyncErrorWrapper(async (req, res, next) => {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    await deletedUser.delete();
    res.send({ message: "User Deleted" });
  })
);

module.exports = router;
