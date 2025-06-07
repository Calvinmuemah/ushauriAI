const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone_number: { 
    type: String, 
    required: true, 
    unique: true,
    match: [/^\+?[0-9]\d{1,14}$/, "Please enter a valid phone number"]
  },
  location: { type: Object, required: true },
  resetToken: { type: String, default: null },
  resetTokenExpiry: { type: Date, default: null }
});

module.exports = mongoose.model("User", UserSchema);