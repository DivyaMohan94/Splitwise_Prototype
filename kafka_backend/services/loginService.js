/* eslint-disable camelcase */

"use strict";

const bcrypt = require('bcrypt');
const Users = require('../models/UserModel');

const handle_request = async (msg, callback) => {
  console.log("Inside login");
  const res = {};

  // Login validation
  Users.findOne({ emailID: msg.body.emailID }, (error, data) => {
    if (error) {
      console.log('Filed to fetch data');
      callback(error, null);
    } else {
      console.log(msg.body.password);
      if (data === null || data.length === 0
          || !bcrypt.compareSync(msg.body.password, data.password)) {
        console.log('Invalid Credentials');
        res.status = 400; res.data = "Invalid login credentials";
        callback(null, res);
      } else {
        console.log('login successful');
        res.status = 200; res.data = data;
        callback(null, res);
      }
    }
  });
};

module.exports.handle_request = handle_request;
