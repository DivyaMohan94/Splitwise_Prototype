/* eslint-disable camelcase */

"use strict";

const bcrypt = require('bcrypt');
const Users = require('../models/UserModel');

const handle_request = async (msg, callback) => {
  console.log("Inside signup");
  const res = {};

  Users.findOne({ emailID: msg.body.emailID }, (error, data) => {
    if (error) {
      res.writeHead(400, {
        'content-type': 'text/plain',
      });
      console.log('mongo error');
      callback(error, null);
    } else {
      console.log('Fetching user result');
      if (data) {
        console.log('user already has account');
        res.status = 400; res.data = "user already has account";
        callback(null, res);
      } else {
      // Hash the password and Insert user details
        console.log("inside hash");
        const saltRounds = 10;
        bcrypt.hash(msg.body.password, saltRounds, (hasherr, hash) => {
          if (hasherr) {
            console.log('cannot hash');
            res.status = 400; res.data = "Cannot hash password";
            callback(null, res);
          } else {
            const newUser = new Users({
              userName: msg.body.name,
              emailID: msg.body.emailID,
              password: hash,
              phoneNum: 'None',
              countryCode: null,
              currency: 'USD',
              timeZone: null,
              language: null,
              image: null,
            });

            newUser.save((insertErr, insertData) => {
              if (insertErr) {
                console.log('Cannot insert user details into db');
                res.status = 400; res.data = "Cannot insert user details into db";
                callback(null, res);
              } else {
                console.log('Inserted sucessfully');
                res.status = 200; res.data = insertData;
                callback(null, res);
              }
            });
          }
        });
      }
    }
  });
};

module.exports.handle_request = handle_request;
