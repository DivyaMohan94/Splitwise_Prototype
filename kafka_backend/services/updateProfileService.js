/* eslint-disable camelcase */

"use strict";

const mongoose = require('mongoose');
const Users = require('../models/UserModel');

const handle_request = async (msg, callback) => {
  console.log("Service - update customer profile : ", msg);
  const userID = mongoose.Types.ObjectId(msg.body.userID);
  Users.updateOne(
    {
      _id: userID,
    },
    {
      $set: {
        userName: msg.body.userName,
        phoneNum: msg.body.phoneNum,
        countryCode: msg.body.countryCode,
        currency: msg.body.currency,
        timeZone: msg.body.timeZone,
        language: msg.body.language,
        image: msg.body.image,
      },
    },
    (error, data) => {
      if (error) {
        console.log("Unable to update profile", error);
        callback(error, null);
      } else {
        console.log('callbackkk', callback);
        callback(null, data);
      }
    },
  );
};

module.exports.handle_request = handle_request;
