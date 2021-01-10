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

const sendEmail = require("../helpers/libraries/sendEmail");
const router = express.Router();



//Profil
router.get("/profile", (req, res, next) => {
  res.json({
    success: true,
    data: {
      id: req.user.id,
      name: req.user.name,
    },
  });
});

// Kayıt Ol
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


// Giriş Yap
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
  asyncErrorWrapper, getAccessToRoute, (async (req, res, next) => {
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


// Forget Password

router.post("/forgotpass", asyncErrorWrapper(async (req, res, next) => {
  const resetEmail = req.body.email;

  const user = await User.findOne({ email: resetEmail });

  if (!user) {
    return next(new CustomError("There is no user with that email", 400));

  }
  const resetPasswordToken = user.getResetPasswordTokenFromUser();

  await user.save();

  const resetPasswordUrl = `http://localhost:5000/api/auth/resetpassword?resetPasswordToken=${resetPasswordToken}`;

  const emailTemplate = `
  <h3> Reset Your Password</h3>
  <p> This <a href = '${resetPasswordUrl}' target = '_blank'>link</a> will expire in 1 hour</p>
  `;

  try {
    await sendEmail({
      from: process.env.SMTP_USER,
      to: resetEmail,
      subject: "Reset Your Password",
      html: emailTemplate
    })
    return res.status(200).json({
      success: true,
      message: "Token Send To Your Email"
    })
  }
  catch (err) {
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined

    await user.save();

    return next(new customError("Email Could Not Be Sent", 500))
  }


}))

router.put("/resetpassword", asyncErrorWrapper(async (req, res, next) => {
// Query den Token getirilir ve Body den password alınır
  const { resetPasswordToken } = req.query;
  const { password } = req.body;

  // Eğer token yoksa veya hatalyısa fırlatılacak hata
  if (!resetPasswordToken) {
    return next(new CustomError("Please provide a valid token", 400));
  }

  //Tokeni bul reset pasword tokeni eşitle geçerlilik süreci anlık süreyi geçmişse hata.
  let user = await User.findOne({
    resetPasswordToken: resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  })
  if(!user){
    return next(new CustomError("Invalid Token or Session Expired",400));
  }

  // Bilgiler eşitlenir
  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  // Kaydedilir
  await user.save();

  return res.status(200)
    .json({
      success: true,
      message: "Reset Password Process Successful"
    })

}))
module.exports = router;
