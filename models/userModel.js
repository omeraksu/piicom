const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({


  email: {
    type: String,
    required: [true,'Email is required.'],
    unique: true,
    match: [
      /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
      "Please Provide a Valid Email"
  ]
  },
  password: {
    type: String,
    required: [true,'Password is required.'],
    minlength: 6,
    
    
  },
  name: {
    type: String,
    required:[true,'Name is required.']
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
