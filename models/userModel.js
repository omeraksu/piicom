const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

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
    required: [true, 'Password is required.'],
    minlength: 6,


  },
  name: {
    type: String,
    required: [true, 'Name is required.']
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  created: {
    type: Date,
    default: Date.now
  },
  profile_image: {
    type: String,
    default: "Default.jpg"
  }

});
// Password Hsh
userSchema.pre("save", function (next) {
// Parola Değişme
if(!this.isModified("password")){
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
