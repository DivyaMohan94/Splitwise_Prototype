/* eslint-disable camelcase */

"use strict";

const mongoose = require('mongoose');
const GroupDetails = require('../models/GroupDetailsModel');

const handle_request = async (msg, callback) => {
  console.log("Inside leave group");
  const userID = mongoose.Types.ObjectId(msg.body.userID);
  const groupID = mongoose.Types.ObjectId(msg.body.groupID);
  console.log(userID);
  console.log(groupID);
  GroupDetails.updateOne(
    {
      _id: groupID,
      "members.userID": userID,
    },
    {
      $set: {
        "members.$.status": 'pending',
      },
    },
    (error, data) => {
      if (error) {
        console.log("Cannot leave group");
        callback(error, null);
      } else {
        console.log("leaving group");
        callback(null, data);
      }
    },
  );
};

module.exports.handle_request = handle_request;
