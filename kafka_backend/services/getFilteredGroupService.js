/* eslint-disable camelcase */

"use strict";

const mongoose = require('mongoose');
const Split = require('../models/Split');
const GroupDetails = require('../models/GroupDetailsModel');

const handle_request = async (msg, callback) => {
  console.log("Inside get filter activities");
  const userID = mongoose.Types.ObjectId(msg.query.userID);
  let groupID = 0;
  if (msg.query.groupID != 0) {
    groupID = mongoose.Types.ObjectId(msg.query.groupID);
  }
  console.log(groupID);

  if (groupID == 0) {
    let groupIDList = [];
    const finalList = [];

    GroupDetails.find({ "members.userID": userID }, { groupName: 1, _id: 0 }, (userErr, userData) => {
      if (userErr) {
        console.log("Unable to get friends details", userErr);
      } else {
        console.log('callback');
        groupIDList = userData;
        Object.values(groupIDList).map((item) => finalList.push(`${item.groupName}`));

        Split.aggregate([
          {
            $match:
            // { $or: [{ userID }, { oweToID: userID }] },
           { groupName: { $in: finalList } },
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
          { $sort: { updatedOn: -1, createdOn: -1 } },
        ],
        (error, data) => {
          if (error) {
            console.log("Cannot fetch recent details", error);
            callback(error, null);
          } else {
            callback(null, data);
          }
        });
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
      { $sort: { updatedOn: -1, createdOn: -1 } },
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
