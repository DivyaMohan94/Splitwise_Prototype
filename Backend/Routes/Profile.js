/* eslint-disable no-undef */
const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const mongoose = require('mongoose');
const { checkAuth } = require("../Util/passport");
const Users = require('../Models/UserModel');
const awsImageUpload = require('../Util/awsImageUpload');

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

router.post("/upload-file", upload.single('image'), async (req, res) => {
  const msg = req.body;
  if (req.files) {
    console.log('inside multiple file upload');
    awsImageUpload.uploadFileToS3(req.files[0]);
  }
  let imageUrl = "";
  if (req.file) {
    try {
      console.log('inside single file upload');
      imageUrl = await awsImageUpload.uploadFileToS3(req.file);
      console.log(imageUrl.Location);
      res.end();
    } catch (error) {
      console.log(error);
    }
  }
});

// downloadfile

router.post("/getImage/:file(*)", async (req, res) => {
  console.log("Inside get pic");
  const { file } = req.params;
  console.log('checking file name:', file);
  if (file) {
    try {
      base64img = await awsImageUpload.downloadFromS3(file);
      // console.log('baseimg', base64img);
      res.writeHead(200, {
        "Content-type": "image/jpg",
      });
      res.end(base64img);
    } catch (error) {
      console.log(error);
    }
  }
});

module.exports = router;
