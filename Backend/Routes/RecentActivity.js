const express = require('express');
const mongoose = require('mongoose');
const { checkAuth } = require("../Util/passport");
const Split = require('../Models/Split');
const GroupDetails = require('../Models/GroupDetailsModel');

const router = express.Router();

router.get("/", checkAuth, (req, res) => {
  console.log("Inside get recent activities");
  const userID = mongoose.Types.ObjectId(req.query.userID);
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
    { $sort: { updatedOn: 1 } },
  ],
  (error, data) => {
    if (error) {
      res.writeHead(400, {
        "content-type": "text/plain",
      });
      res.end("Cannot fetch recent details");
    } else {
      console.log('recent activity', data);
      res.end(JSON.stringify(data));
    }
  });
});

router.get("/filterGroup", checkAuth, (req, res) => {
  console.log("Inside get filter activities");
  const userID = mongoose.Types.ObjectId(req.query.userID);
  let groupID = 0;
  if (req.query.groupID != 0) {
    groupID = mongoose.Types.ObjectId(req.query.groupID);
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
      { $sort: { updatedOn: 1 } },
    ],
    (error, data) => {
      if (error) {
        res.writeHead(400, {
          "content-type": "text/plain",
        });
        res.end("Cannot fetch recent details");
      } else {
        console.log('recent activity', data);
        res.end(JSON.stringify(data));
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
      { $sort: { updatedOn: 1 } },
    ],
    (error, data) => {
      if (error) {
        res.writeHead(400, {
          "content-type": "text/plain",
        });
        res.end("Cannot fetch recent details");
      } else {
        console.log('recent activity', data);
        res.end(JSON.stringify(data));
      }
    });
  }
});

router.get("/groupsDropdown", checkAuth, (req, res) => {
  console.log("Inside get recent activities");
  const userID = mongoose.Types.ObjectId(req.query.userID);
  GroupDetails.find({
    members: { $elemMatch: { userID, status: 'ok' } },
  }, (error, data) => {
    if (error) {
      res.writeHead(400, {
        "content-type": "text/plain",
      });
      res.end("mongo error");
    } else {
      console.log("fetched groups dropdownresult", data);
      res.status(200).json(data);
    }
  });
});

module.exports = router;
