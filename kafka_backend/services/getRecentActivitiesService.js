/* eslint-disable camelcase */

"use strict";

const mongoose = require('mongoose');
const Split = require('../models/Split');

const handle_request = async (msg, callback) => {
  console.log("Inside get recent activities");
  const userID = mongoose.Types.ObjectId(msg.query.userID);
  Split.aggregate([
    {
      $match:
        { $or: [{ userID }, { oweToID: userID }] },
    },
    {
      $lookup: {
        from: "users",
        localField: "userID",
        foreignField: "_id",
        as: "defaulter",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "oweToID",
        foreignField: "_id",
        as: "owner",
      },
    },
    { $sort: { updatedOn: -1 } },
  ],
  (error, data) => {
    if (error) {
      console.log("Cannot fetch recent details", error);
      callback(error, null);
    } else {
      console.log('callback', callback);
      callback(null, data);
    }
  });
};

module.exports.handle_request = handle_request;
