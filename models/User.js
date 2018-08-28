const Schema = require('mongoose').Schema
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
  username: String,
  email: String,
  password: String
})

userSchema.plugin(passportLocalMongoose, {usernameField:'email'})
module.exports = require('mongoose').model('User', userSchema)