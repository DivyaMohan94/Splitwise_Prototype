const express = require('express');
// const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// const Users = require('../Models/UserModel');
const { secret } = require('../Util/config');
const { auth } = require("../Util/passport");
const kafka = require('../kafka/client');

auth();

const router = express.Router();

router.post('/', (req, res) => {
  console.log('Inside signup');
  console.log('Req Body : ', req.body);

  kafka.make_request('signUp', req, (err, data) => {
    if (err) {
      res.writeHead(400, {
        "content-type": "text/plain",
      });
      res.end("mongo err");
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
      console.log('successfully signed in', payload);
      const token = jwt.sign(payload, secret, {
        expiresIn: 1008000,
      });
      const fullToken = `JWT ${token}`;
      res.status(200).json({ fullToken, payload });
    } else {
      console.log('Invalid data');
      res.writeHead(400, {
        "content-type": "text/plain",
      });
      res.end('Invalid data');
    }
  });
});

module.exports = router;
