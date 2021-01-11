const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const userSchema = new mongoose.Schema({


  email: {
    type: String,
    required: [true, 'Email is required.'],
    unique: true,
    match: [
      /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
      // "Please Provide a Valid Email"
    ]
  },
  password: {
    type: String,
    // required: [true, 'Password is required.'],
    minlength: 6,
    select: false


  },
  name: {
    type: String,
    required: [true, 'Name is required.']
  },
  role: {
    type: String,
    default: "user",
    enum: ["user", "admin"]
  },
  created: {
    type: Date,
    default: Date.now
  },
  profile_image: {
    type: String,
    default: "Default.jpg"
  },

  resetPasswordToken: {
    type: String
  },

  resetPasswordExpire: {
    type: Date
  }


});
//UserSchema Methods
userSchema.methods.generateJwtFromUser = function () {
  const { JWT_SECRET_KEY, JWT_EXPIRE } = process.env;
  const payload = {
    id: this.id,
    name: this.name
  };

  const token = jwt.sign(payload, JWT_SECRET_KEY, {
    expiresIn: JWT_EXPIRE
  })
  return token;
};

//Generate Password Token
userSchema.methods.getResetPasswordTokenFromUser = function () {
  const randomHexString = crypto.randomBytes(15).toString("hex");
  const {RESET_PASSWORD_EXPIRE}= process.env;
  const resetPasswordToken = crypto
    .createHash("SHA256")
    .update(randomHexString)
    .digest("hex");
  console.log(resetPasswordToken);

  this.resetPasswordToken = resetPasswordToken;
  this.resetPasswordExpire = Date.now() + parseInt(RESET_PASSWORD_EXPIRE)

  return resetPasswordToken;

};


// Password Hash
userSchema.pre("save", function (next) {
  // Parola Değişme
  if (!this.isModified("password")) {
    next();
  }

  bcrypt.genSalt(10, (err, salt) => {
    if (err) next(err);

    bcrypt.hash(this.password, salt, (err, hash) => {
      if (err) next(err);
      this.password = hash;
      next();
    })
  })

})

const userModel = mongoose.model("User", userSchema);

module.exports = userModel
