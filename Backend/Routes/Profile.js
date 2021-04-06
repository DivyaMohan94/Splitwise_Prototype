const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const mongoose = require('mongoose');
const { checkAuth } = require("../Util/passport");
const Users = require('../Models/UserModel');

const router = express.Router();

router.get("/", checkAuth, (req, res) => {
  console.log("Inside get profile details");
  console.log("Req Body : ", req.body);
  const userID = mongoose.Types.ObjectId(req.query.userID);

  // Login validation
  Users.findOne({ _id: userID }, (error, data) => {
    if (error) {
      res.writeHead(400, {
        "content-type": "text/plain",
      });
      res.end("Cannot fetch profile details");
    } else {
      console.log('profile details', data);
      res.end(JSON.stringify(data));
    }
  });
});

// Update the profile page
router.put("/", checkAuth, (req, res) => {
  const userID = mongoose.Types.ObjectId(req.body.userID);
  Users.updateOne(
    {
      _id: userID,
    },
    {
      $set: {
        userName: req.body.userName,
        phoneNum: req.body.phoneNum,
        countryCode: req.body.countryCode,
        currency: req.body.currency,
        timeZone: req.body.timeZone,
        language: req.body.language,
        image: req.body.image,
      },
    },
    (error, data) => {
      if (error) {
        res.writeHead(400, {
          "content-type": "text/plain",
        });
        res.end("Cannot update user details");
      } else {
        console.log(data);
        // res.writeHead(200, {
        //   'Content-Type': 'application/json',
        // });
        res.end(JSON.stringify(data));
      }
    },
  );
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
