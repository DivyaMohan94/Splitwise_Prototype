const mongoose = require('mongoose');

const { Schema } = mongoose;

const usersSchema = new Schema({
  userName: { type: String, required: true },
  emailID: { type: String, required: true },
  password: { type: String, required: true },
  phoneNum: { type: String, required: true },
  countryCode: { type: String, default: null },
  currency: { type: String, required: true },
  timeZone: { type: String, default: null },
  createdAt: { type: Date, default: new Date() },
  language: { type: String, default: null },
  image: { type: String, default: null },
},
{
  versionKey: false,
});

const Users = mongoose.model('Users', usersSchema);
module.exports = Users;
