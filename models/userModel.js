const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({


  email: {
    type: String,
    required: true,
    unique: true,
    match: [
      /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
      "Please Provide a Valid Email"
  ]
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select:false
  },
  name: {
    type: String,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  created: {
    type:Date,
    default:Date.now
  },
  profile_image:{
    type:String,
    default:"Default.jpg"
  }

});

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
