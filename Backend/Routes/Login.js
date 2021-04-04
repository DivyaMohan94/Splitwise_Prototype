const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Users = require('../Models/UserModel');
const { secret } = require('../Util/config');
const { auth } = require("../Util/passport");

auth();

const router = express.Router();

router.post("/", (req, res) => {
  console.log("Inside login");
  console.log("Req Body : ", req.body);

  // Login validation
  Users.findOne({ emailID: req.body.emailID }, (error, data) => {
    if (error) {
      res.writeHead(400, {
        'content-type': 'text/plain',
      });
      res.end('Filed to fetch data');
    } else {
      console.log(req.body.password);
      if (data === null || data.length === 0
        || !bcrypt.compareSync(req.body.password, data.password)) {
        res.writeHead(401, {
          'Content-type': 'text/plain',
        });
        console.log('Invalid Credentials');
        res.end('Invalid Credentials');
      } else {
        const payload = {
          _id: data._id, userName: data.userName, currency: data.currency, emailID: data.emailID,
        };
        const token = jwt.sign(payload, secret, {
          expiresIn: 1008000,
        });
        res.status(200).json({ token, payload });
        console.log('login successful');
      }
    }
  });
});

module.exports = router;
