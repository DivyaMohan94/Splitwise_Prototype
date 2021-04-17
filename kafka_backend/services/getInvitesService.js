/* eslint-disable camelcase */

"use strict";

const GroupDetails = require('../models/GroupDetailsModel');

const handle_request = async (msg, callback) => {
  console.log("Inside get invites");
  GroupDetails.find({
    members: { $elemMatch: { userID: msg.query.UserID, status: 'pending' } },
  }, (error, data) => {
    if (error) {
      console.log("mongo error");
      callback(error, null);
    } else {
      console.log("Fetching result", data);
      callback(null, data);
    }
  });
};

module.exports.handle_request = handle_request;
