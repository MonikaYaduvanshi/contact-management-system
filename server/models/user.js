const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: [true, "username is required"]},
    email : { type: String, required: true },
    password : {type: String, required: true}
})

const user = new mongoose.model("User", UserSchema);

module.exports = user;
