const express = require('express');
// const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// const Users = require('../Models/UserModel');
const { secret } = require('../Util/config');
const { auth } = require("../Util/passport");
const kafka = require('../kafka/client');

auth();

const router = express.Router();

router.post("/", (req, res) => {
  console.log("Inside login");

  kafka.make_request('login', req, (err, data) => {
    if (err) {
      res.writeHead(400, {
        "content-type": "text/plain",
      });
      res.end("Cannot fetch group details");
    } else if (data.status === 200) {
      const payload = {
        _id: data.data._id,
        userName: data.data.userName,
        currency: data.data.currency,
        emailID: data.data.emailID,
        phoneNum: data.data.phoneNum,
        countryCode: data.data.countryCode,
        timeZone: data.data.timeZone,
        createdAt: data.data.createdAt,
        language: data.data.language,
        image: data.data.image,
      };
      console.log('successfully logged in', payload);
      const token = jwt.sign(payload, secret, {
        expiresIn: 1008000,
      });
      const fullToken = `JWT ${token}`;
      res.status(200).json({ fullToken, payload });
    } else {
      console.log('Invalid Credentials');
      res.writeHead(400, {
        "content-type": "text/plain",
      });
      res.end('Invalid Credentials');
    }
  });

  // Login validation
  // Users.findOne({ emailID: req.body.emailID }, (error, data) => {
  //   if (error) {
  //     res.writeHead(400, {
  //       'content-type': 'text/plain',
  //     });
  //     res.end('Filed to fetch data');
  //   } else {
  //     console.log(req.body.password);
  //     if (data === null || data.length === 0
  //       || !bcrypt.compareSync(req.body.password, data.password)) {
  //       res.writeHead(401, {
  //         'Content-type': 'text/plain',
  //       });
  //       console.log('Invalid Credentials');
  //       res.end('Invalid Credentials');
  //     } else {
  //       const payload = {
  //         _id: data._id,
  //         userName: data.userName,
  //         currency: data.currency,
  //         emailID: data.emailID,
  //         phoneNum: data.phoneNum,
  //         countryCode: data.countryCode,
  //         timeZone: data.timeZone,
  //         createdAt: data.createdAt,
  //         language: data.language,
  //         image: data.image,
  //       };
  //       const token = jwt.sign(payload, secret, {
  //         expiresIn: 1008000,
  //       });
  //       const fullToken = `JWT ${token}`;
  //       res.status(200).json({ fullToken, payload });
  //       console.log('login successful');
  //     }
  //   }
  // });
});

module.exports = router;
