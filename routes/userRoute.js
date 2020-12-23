const express = require("express");
const User = require("../models/userModel");

const router = express.Router();

// TODO: express-validator, bcryptjs, jsonwebtoken eklenecek
// TODO: doğrulama şeyleri express-validator ile yapılacak ( min password length vs )

router.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({
      email,
    });

    if (user) {
      return res.status(400).json({
        msg: "User Already Exists",
      });
    }
    user = new User({
      email,
      password,
    });
    await user.save();
    res.status(200).send({ msg: "user create" });
  } catch (err) {
    res.status(401).send({ msg: err.message });
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
    res.status(200).send({ msg: "welcome to dark side" });
  } catch (error) {
    res.send({ msg: error.message });
  }
});

module.exports = router;
