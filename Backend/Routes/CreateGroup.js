const express = require('express');
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const mongoose = require('mongoose');
const Users = require('../Models/UserModel');
const GroupDetails = require('../Models/GroupDetailsModel');
const { checkAuth } = require("../Util/passport");
const kafka = require('../kafka/client');

const router = express.Router();

router.post("/", checkAuth, (req, res) => {
  console.log("Inside create group");
  console.log("Req Body : ", req.body);
  const createdBy = mongoose.Types.ObjectId(req.body.createdBy);

  GroupDetails.findOne({
    groupName: req.body.groupName,
    createdBy,
  }, (error, data) => {
    if (error) {
      res.writeHead(400, {
        'content-type': 'text/plain',
      });
      console.log('sql error');
      res.end('Sql error');
    } else {
      console.log('Fetching sql result');
      if (data) {
        console.log('Group name exists');
        res.writeHead(400, {
          'content-type': 'text/plain',
        });
        res.end('Group name exists');
      } else {
        const newGroup = new GroupDetails({
          groupName: req.body.groupName,
          createdBy,
          image: req.body.image,
        });

        newGroup.save((insertErr, insertData) => {
          if (insertErr) {
            console.log('Cannot insert group details into db', insertErr);
            res.write(400, {
              'context-type': 'text/plain',
            });
            res.end('Insert Error');
          } else {
            console.log('Group Created');
            const { userEmailList } = req.body;
            console.log(userEmailList);

            Users.find({ emailID: { $in: userEmailList } }, (userErr, userData) => {
              if (userErr) {
                console.log('Cannot fetch user details');
                res.writeHead(400, {
                  'context-type': 'text/plain',
                });
                res.end('Cannot fetch Email IDs');
              } else {
                userData.forEach((element) => {
                  console.log(element._id);
                  const memberObj = {
                    userID: element._id,
                    // userName: element.userName,
                    // emailID: element.emailID,
                    // currency: element.currency,
                    status: "pending",
                  };
                  GroupDetails.updateOne(
                    { _id: insertData._id },
                    {
                      $push: {
                        members: memberObj,
                      },
                    },
                    (memberErr, memberData) => {
                      if (memberErr) {
                        console.log(memberErr);
                      } else {
                        console.log(memberData);
                      }
                    },
                  ); // end of update
                });
              }
            });

            Users.findOne({ userID: createdBy }, (ownerErr, ownerData) => {
              if (ownerErr) {
                res.writeHead(400, {
                  'context-type': 'text/plain',
                });
                res.end('Cannot fetch owner details');
              } else {
                const ownerVal = {
                  userID: createdBy,
                  // userName: ownerData.userName,
                  // emailID: ownerData.emailID,
                  // currency: ownerData.currency,
                  status: "ok",
                };
                GroupDetails.updateOne(
                  { _id: insertData._id },
                  {
                    $push: {
                      members: ownerVal,
                    },
                  },
                  (ownrInsertErr, ownrInsertData) => {
                    if (ownrInsertErr) {
                      res.writeHead(400, {
                        'context-type': 'text/plain',
                      });
                      res.end('Cannot insert owner details');
                    } else {
                      console.log('successfully inserted owner data', ownrInsertData);
                    }
                  },
                );
              }
            });
            res.status(200).json(insertData);
          }
        });
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
