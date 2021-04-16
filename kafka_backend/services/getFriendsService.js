/* eslint-disable camelcase */

"use strict";

const Users = require('../models/UserModel');

const handle_request = async (msg, callback) => {
  console.log("Service - get friends details: ");
  Users.find({}, { userName: 1, emailID: 1, _id: 1 }, (userErr, userData) => {
    if (userErr) {
      console.log("Unable to get friends details", userErr);
      callback(userErr, null);
    } else {
      console.log('callback', callback);
      callback(null, userData);
    }
  });
};

module.exports.handle_request = handle_request;
