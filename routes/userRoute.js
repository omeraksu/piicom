const express = require("express");
const User = require("../models/userModel");

const router = express.Router();

// TODO: express-validator, bcryptjs, jsonwebtoken eklenecek
// TODO: doğrulama şeyleri express-validator ile yapılacak ( min password length vs )

router.post("/signup", async (req, res) => {
  const { email, password, name, isAdmin } = req.body;

  try {
    let user = await User.findOne({
      email,
    });

    if (user) {
      return res.status(400).json({
        msg: "User Already Exists",
      });
    }

    // user defination
    user = new User({
      email,
      password,
      name,
      isAdmin,
    });

    // save
    await user.save();

    //response
    res
      .status(200)
      .send({ name: name, mail: email, password: password, isAdmin: isAdmin });

    //catch
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

    // response
    res.status(200).send({
      msg: "welcome to dark side",
      email: email,
      password: password,
    });

    // catch
  } catch (error) {
    res.send({ msg: error.message });
  }
});

module.exports = router;
