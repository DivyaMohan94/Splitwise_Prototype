/* eslint-disable camelcase */

"use strict";

const mongoose = require('mongoose');
const GroupDetails = require('../models/GroupDetailsModel');

const handle_request = async (msg, callback) => {
  console.log("Inside create group");
  const groupID = mongoose.Types.ObjectId(msg.body.groupID);
  const { image } = msg.body;
  const res = {};
  const err = {};

  GroupDetails.updateOne(
    {
      _id: groupID,
    },
    {
      $set: {
        image,
      },
    },
    (updateErr, updatedData) => {
      if (updateErr) {
        err.status = 400; err.data = "cannot update group pic";
        console.log('err data', err);
        callback(null, err);
      } else {
        res.status = 200; res.data = updatedData;
        console.log('group name data', res);
        callback(null, res);
      }
    },
  );
};

module.exports.handle_request = handle_request;
