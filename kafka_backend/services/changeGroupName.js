/* eslint-disable camelcase */

"use strict";

const mongoose = require('mongoose');
const GroupDetails = require('../models/GroupDetailsModel');

const handle_request = async (msg, callback) => {
  console.log("Inside create group");
  const createdBy = mongoose.Types.ObjectId(msg.body.createdBy);
  const groupID = mongoose.Types.ObjectId(msg.body.groupID);
  const { groupName } = msg.body;
  const res = {};
  const err = {};

  GroupDetails.findOne({
    groupName: { $regex: new RegExp(`^${groupName}`, 'i') },
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
        GroupDetails.updateOne(
          {
            _id: groupID,
          },
          {
            $set: {
              groupName,
            },
          },
          (updateErr, updatedData) => {
            if (updateErr) {
              err.status = 400; err.data = "cannot update group name";
              console.log('err data', err);
              callback(null, err);
            } else {
              res.status = 200; res.data = updatedData;
              console.log('group name data', res);
              callback(null, res);
            }
          },
        );
      }
    }
  });
};

module.exports.handle_request = handle_request;
