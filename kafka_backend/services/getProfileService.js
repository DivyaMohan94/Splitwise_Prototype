/* eslint-disable camelcase */

"use strict";

const mongoose = require('mongoose');
const Users = require('../models/UserModel');

const handle_request = async (msg, callback) => {
  console.log("Service - get user profile : ", msg);
  const userID = mongoose.Types.ObjectId(msg.query.userID);
  Users.findOne({ _id: userID }, (error, data) => {
    if (error) {
      console.log("Unable to get profile details", error);
      callback(error, null);
    } else {
      console.log('callback', callback);
      callback(null, data);
    }
  });
};

module.exports.handle_request = handle_request;
