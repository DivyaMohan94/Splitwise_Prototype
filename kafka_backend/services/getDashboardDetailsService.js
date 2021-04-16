/* eslint-disable camelcase */

"use strict";

const mongoose = require('mongoose');
const Split = require('../models/Split');

const handle_request = async (msg, callback) => {
  console.log("Inside get dashboard details");
  const toReceiveVal = [];
  const toGiveVal = [];
  const dashboardData = {
    toReceiveVal,
    toGiveVal,
  };
  const userID = mongoose.Types.ObjectId(msg.query.UserID);
  console.log('userID', msg.query.UserID);
  Split.aggregate([
    { $match: { oweToID: userID, paymentStatus: 'unpaid' } },
    {
      $group: {
        _id: null,
        total: {
          $sum: "$splitAmount",
        },
      },
    },
  ],
  (error, data) => {
    if (error) {
      console.log("Cannot fetch transaction details");
      callback(error, null);
    } else {
      if (data.length > 0) {
        console.log("Fetching result", JSON.stringify((data[0].total)));
        toReceiveVal.push(JSON.stringify((data[0].total)));
      }

      Split.aggregate([
        { $match: { userID, paymentStatus: 'unpaid' } },
        {
          $group: {
            _id: null,
            total: {
              $sum: "$splitAmount",
            },
          },
        },
      ],
      (toGiveError, toGiveData) => {
        if (toGiveError) {
          console.log("Cannot fetch transaction details");
          callback(toGiveError, null);
        } else {
          if (toGiveData.length > 0) {
            console.log("Fetching result", JSON.stringify((toGiveData)));
            toGiveVal.push(JSON.stringify((toGiveData[0].total)));
          }
          console.log('dashboard data', dashboardData);
          callback(null, dashboardData);
        }
      });
    }
  });
};

module.exports.handle_request = handle_request;
