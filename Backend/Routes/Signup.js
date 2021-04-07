const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Users = require('../Models/UserModel');
const { secret } = require('../Util/config');
const { auth } = require("../Util/passport");

auth();

const router = express.Router();

router.post('/', (req, res) => {
  console.log('Inside signup');
  console.log('Req Body : ', req.body);

  Users.findOne({ emailID: req.body.emailID }, (error, data) => {
    if (error) {
      res.writeHead(400, {
        'content-type': 'text/plain',
      });
      console.log('sql error');
      res.end('Sql error');
    } else {
      console.log('Fetching sql result');
      if (data) {
        console.log('user already has account');
        res.writeHead(400, {
          'content-type': 'text/plain',
        });
        res.end('User already exists');
        console.log(res.body);
      } else {
      // Hash the password and Insert user details
        console.log("inside hash");
        const saltRounds = 10;
        bcrypt.hash(req.body.password, saltRounds, (hasherr, hash) => {
          if (hasherr) {
            res.writeHead(400, {
              'context-type': 'text/plain',
            });
            res.end('Cannot hash password');
            console.log('cannot hash');
          } else {
            const newUser = new Users({
              userName: req.body.name,
              emailID: req.body.emailID,
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
                res.write(200, {
                  'context-type': 'text/plain',
                });
                res.end('Insert Error');
              } else {
                console.log('Inserted sucessfully');
                console.log('insert data', insertData);
                const payload = {
                  _id: insertData._id,
                  userName: insertData.userName,
                  currency: insertData.currency,
                  emailID: insertData.emailID,
                  phoneNum: insertData.phoneNum,
                  countryCode: insertData.countryCode,
                  timeZone: insertData.timeZone,
                  createdAt: insertData.createdAt,
                  language: insertData.language,
                  image: insertData.image,
                };
                const token = jwt.sign(payload, secret, {
                  expiresIn: 1008000,
                });
                const fullToken = `JWT ${token}`;
                res.status(200).json({ fullToken, payload });
              }
            });
          }
        });
      }
    }
  });
});

module.exports = router;
