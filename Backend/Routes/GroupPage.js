const express = require("express");
const mongoose = require('mongoose');
const { checkAuth } = require("../Util/passport");
const Transactions = require('../Models/TransactionModel');
const GroupDetails = require('../Models/GroupDetailsModel');
const Split = require('../Models/Split');
const kafka = require('../kafka/client');

const router = express.Router();

router.get("/getActiveGroups", checkAuth, (req, res) => {
  console.log("Inside get Active groups");
  kafka.make_request('getActiveGroups', req, (err, data) => {
    if (err) {
      res.writeHead(400, {
        "content-type": "text/plain",
      });
      res.end("Cannot fetch group details");
    } else {
      console.log('fetching group details');
      res.end(JSON.stringify(data));
    }
  });
});

router.get("/invites", checkAuth, (req, res) => {
  kafka.make_request('getInvites', req, (err, data) => {
    if (err) {
      res.writeHead(400, {
        "content-type": "text/plain",
      });
      res.end("Cannot fetch invites details");
    } else {
      console.log('fetching invites details');
      res.end(JSON.stringify(data));
    }
  });
});

router.put("/acceptInvites", checkAuth, (req, res) => {
  console.log("Inside accept invites");
  kafka.make_request('acceptInvites', req, (err, data) => {
    if (err) {
      res.writeHead(400, {
        "content-type": "text/plain",
      });
      res.end("Cannot accept invites");
    } else {
      console.log('Successfully accepted invite');
      res.end(JSON.stringify(data));
    }
  });
});

// Add expense - description, total amt, owner id, groupID, currency --> returns transaction id
router.post("/addexpense", checkAuth, (req, res) => {
  console.log("Inside add expense");
  kafka.make_request('addExpense', req, (err, data) => {
    if (err) {
      res.writeHead(400, {
        "content-type": "text/plain",
      });
      res.end("Cannot add expense");
    } else {
      console.log('Successfully added expense');
      res.end(JSON.stringify(data));
    }
  });
});

// Get All group transactions - need groupid
router.get("/AllTransaction", checkAuth, (req, res) => {
  console.log('Inside get all transactions');
  kafka.make_request('getAllTransactions', req, (err, data) => {
    if (err) {
      res.writeHead(400, {
        "content-type": "text/plain",
      });
      res.end("Cannot fetch transaction details");
    } else {
      console.log('transaction group details');
      res.end(JSON.stringify(data));
    }
  });
});

// Get individual transaction -- need transaction id
router.get("/Transaction", checkAuth, (req, res) => {
  console.log('Inside get transaction detail');
  kafka.make_request('getTransaction', req, (err, data) => {
    if (err) {
      res.writeHead(400, {
        "content-type": "text/plain",
      });
      res.end("Cannot fetch transaction details");
    } else {
      console.log('transaction details');
      res.end(JSON.stringify(data));
    }
  });
});

router.get("/getGroupDetails", checkAuth, (req, res) => {
  console.log('Inside get group details');
  kafka.make_request('getGroupDetails', req, (err, data) => {
    if (err) {
      res.writeHead(400, {
        "content-type": "text/plain",
      });
      res.end("Cannot fetch group details");
    } else {
      console.log('fetching group details');
      res.end(JSON.stringify(data));
    }
  });
});

router.get("/getDues", checkAuth, (req, res) => {
  console.log("Inside get due");
  kafka.make_request('getDues', req, (err, data) => {
    if (err) {
      res.writeHead(400, {
        "content-type": "text/plain",
      });
      res.end("Cannot fetch getDues details");
    } else {
      console.log('fetching getDues details');
      res.end(JSON.stringify(data));
    }
  });
});

router.put("/leaveGroup", checkAuth, (req, res) => {
  console.log("Inside leave group");
  kafka.make_request('leaveGroup', req, (err, data) => {
    if (err) {
      res.writeHead(400, {
        "content-type": "text/plain",
      });
      res.end("Cannot leave group");
    } else {
      console.log('leaving group');
      res.end(JSON.stringify(data));
    }
  });
});

router.post("/addNotes", checkAuth, (req, res) => {
  console.log("Inside add notes");
  kafka.make_request('addNotes', req, (err, data) => {
    if (err) {
      res.writeHead(400, {
        "content-type": "text/plain",
      });
      res.end("Cannot add notes");
    } else {
      console.log('Added notes successfully');
      res.end(JSON.stringify(data));
    }
  });
});

router.post("/deleteNotes", checkAuth, (req, res) => {
  console.log("Inside delete notes");
  kafka.make_request('deleteNotes', req, (err, data) => {
    if (err) {
      res.writeHead(400, {
        "content-type": "text/plain",
      });
      res.end("Cannot delete notes");
    } else {
      console.log('Deleted notes successfully');
      res.end(JSON.stringify(data));
    }
  });
});

// router.put("/changeImage", (req, res) => {
//   connection.getConnection((err, conn) => {
//     if (err) {
//       console.log('Cannot connect to database');
//       console.log(err);
//       throw err;
//     } else {
//       console.log('Connection111 successful');
//       console.log("Inside change image");
//       console.log("Req Body : ", req.body);
//       const { Image } = req.body;
//       const { GroupID } = req.body;

//       const imageUpdate = `UPDATE GroupDetails
//   SET Image = ${mysql.escape(Image)}
//   WHERE GroupID = ${mysql.escape(GroupID)}`;

//       console.log(imageUpdate);

//       conn.query(imageUpdate, (error, data) => {
//         if (error) {
//           res.writeHead(400, {
//             "content-type": "text/plain",
//           });
//           res.end("Sql error");
//         } else {
//           console.log(data);
//           res.writeHead(200, {
//             "Content-type": "application/json",
//           });
//           res.end(JSON.stringify(data));
//           conn.release();
//         }
//       });
//     }
//   });
// });

module.exports = router;
