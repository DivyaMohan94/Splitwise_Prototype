/* eslint-disable camelcase */

"use strict";

const mongoose = require('mongoose');
const Split = require('../models/Split');

const handle_request = async (msg, callback) => {
  console.log("Inside get filter activities");
  const userID = mongoose.Types.ObjectId(msg.query.userID);
  let groupID = 0;
  if (msg.query.groupID != 0) {
    groupID = mongoose.Types.ObjectId(msg.query.groupID);
  }
  console.log(groupID);

  if (groupID == 0) {
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
        console.log("Cannot fetch recent details");
        callback(error, null);
      } else {
        console.log('recent activity', data);
        callback(null, data);
      }
    });
  } else {
    Split.aggregate([
      {
        $match:
        {
          groupID,
        },
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
        console.log("Cannot fetch recent details");
        callback(error, null);
      } else {
        console.log('recent activity', data);
        callback(null, data);
      }
    });
  }
};

module.exports.handle_request = handle_request;
