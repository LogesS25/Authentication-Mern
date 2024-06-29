const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email:String,
    password:String,
    dateofbirth : Date,    
    work:String,
    age:Number,
    location:String,
    resetPasswordToken:String,
    resetPasswordExpires:Date,

});

const User = mongoose.model("User",UserSchema)

module.exports = User;