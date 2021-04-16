/* eslint-disable camelcase */

"use strict";

const mongoose = require('mongoose');
const GroupDetails = require('../models/GroupDetailsModel');
const Users = require('../models/UserModel');

const handle_request = async (msg, callback) => {
  console.log("Inside create group");
  const createdBy = mongoose.Types.ObjectId(msg.body.createdBy);
  const res = {};
  const err = {};

  GroupDetails.findOne({
    groupName: msg.body.groupName,
    createdBy,
  }, (error, data) => {
    if (error) {
      console.log("cannot query groups document", error);
      callback(error, null);
    } else {
      console.log('checking unique name');
      if (data) {
        console.log('Group name exists');
        err.status = 400; err.data = "Group name exists ";
        console.log('err data', err);
        callback(null, err);
      } else {
        const newGroup = new GroupDetails({
          groupName: msg.body.groupName,
          createdBy,
          image: msg.body.image,
        });

        newGroup.save((insertErr, insertData) => {
          if (insertErr) {
            err.status = 400;
            err.data = "Cannot insert group details into db";
            callback(err, null);
          } else {
            console.log('Group Created');
            const { userEmailList } = msg.body;
            console.log(userEmailList);

            Users.find({ emailID: { $in: userEmailList } }, (userErr, userData) => {
              if (userErr) {
                err.status = 400;
                err.data = "Cannot fetch Email IDs";
                callback(err, null);
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
                err.status = 400;
                err.data = "Cannot fetch owner details";
                callback(err, null);
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
                      err.status = 400;
                      err.data = "Cannot insert owner details";
                      callback(err, null);
                    } else {
                      console.log('successfully inserted owner data', ownrInsertData);
                    }
                  },
                );
              }
            });
            res.status = 200;
            res.data = insertData;
            callback(null, res);
          }
        });
      }
    }
  });
};

module.exports.handle_request = handle_request;
