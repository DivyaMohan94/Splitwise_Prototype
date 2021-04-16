const express = require('express');
const multer = require("multer");
const path = require("path");
const fs = require("fs");
// const mongoose = require('mongoose');
// const Users = require('../Models/UserModel');
// const GroupDetails = require('../Models/GroupDetailsModel');
const { checkAuth } = require("../Util/passport");
const kafka = require('../kafka/client');

const router = express.Router();

router.post("/", checkAuth, (req, res) => {
  console.log("Inside create group");
  kafka.make_request('createGroup', req, (err, data) => {
    console.log('err data', err);
    if (err) {
      res.writeHead(400, {
        "content-type": "text/plain",
      });
      res.end("Cannot update user details");
    } else {
      console.log('checking status');
      if (data.status === 200) {
        console.log('successfully updated user details', data);
        res.status(200).json(data);
      } else {
        res.writeHead(400, {
          "content-type": "text/plain",
        });
        res.end("Cannot create group");
      }
    }
  });
});

router.get("/getFriends", checkAuth, (req, res) => {
  kafka.make_request('getFriends', req, (err, data) => {
    if (err) {
      console.log('Cannot fetch user details');
      res.writeHead(400, {
        'context-type': 'text/plain',
      });
      res.end('Cannot fetch Email IDs');
    } else {
      console.log(data);
      res.status(200).json({ data });
    }
  });
});

// Storing documents/Images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./Routes/Images");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

// uploadfile

router.post("/upload-file", upload.array("photos", 5), (req, res) => {
  console.log("inside uploading");
  console.log("req.body", req.body);
  res.end();
});

// downloadfile

router.post("/getImage/:file(*)", (req, res) => {
  console.log("Inside get pic");
  const { file } = req.params;
  const filelocation = path.join(`${__dirname}/Images`, file);
  const img = fs.readFileSync(filelocation);
  const base64img = Buffer.from(img).toString("base64");
  res.writeHead(200, {
    "Content-type": "image/jpg",
  });
  res.end(base64img);
});

module.exports = router;
