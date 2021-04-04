const express = require("express");
const mysql = require("mysql");
const bcrypt = require("bcrypt");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const connection = require("./Connection.js");

const router = express.Router();

router.get("/", (req, res) => {
  connection.getConnection((err, conn) => {
    if (err) {
      console.error(`Database connection failed: ${err.stack}`);
      return;
    }
    console.log('Connected to database.');
    console.log("Inside get profile");
    console.log("Req Body : ", req.body);
    console.log(req.originalUrl.split("?")[1].split("=")[1]);
    const UserID = req.originalUrl.split("?")[1].split("=")[1];
    const check = `SELECT * FROM UserDetails WHERE UserID = ${mysql.escape(
      UserID,
    )}`; // req.session.user.UserID
    conn.query(check, (error, data) => {
      if (error) {
        res.writeHead(400, {
          "content-type": "text/plain",
        });
        res.end("Sql error");
      } else {
        console.log("Fetching sql result");
        console.log(data);
        res.writeHead(200, {
          "Content-type": "application/json",
        });
        res.end(JSON.stringify(data[0]));
        conn.release();
      }
    });
  });
});

// Update the profile page
router.put("/", (req, res) => {
  connection.getConnection((err, conn) => {
    if (err) {
      console.error(`Database connection failed: ${err.stack}`);
      return;
    }

    console.log('Connected to database.');
    console.log("Inside profile update");
    console.log("Req Body : ", req.body);
    let updateQuery = "";
    if (req.body.isPasswordChanged) {
    // hash the new password and update
      console.log("inside hash");
      const saltRounds = 10;
      bcrypt.hash(req.body.password, saltRounds, (hasherr, hash) => {
        if (hasherr) {
          console.log("cannot hash");
        } else {
          updateQuery = `UPDATE UserDetails SET UserName = ${mysql.escape(
            req.body.UserName,
          )},
        Password = ${hash},PhoneNum=${mysql.escape(req.body.PhoneNum)},
        CountryCode = ${mysql.escape(
    req.body.CountryCode,
  )},Currency=${mysql.escape(req.body.Currency)}, 
        Timezone = ${mysql.escape(req.body.Timezone)}, Language=${mysql.escape(
  req.body.Language,
)}, 
        Image=${mysql.escape(req.body.Image)} WHERE UserID = ${
  req.body.UserID
}`;
        }
      });
    } else {
      updateQuery = `UPDATE UserDetails SET UserName = ${mysql.escape(
        req.body.UserName,
      )},PhoneNum=${mysql.escape(req.body.PhoneNum)},
    CountryCode = ${mysql.escape(req.body.CountryCode)},Currency=${mysql.escape(
  req.body.Currency,
)}, 
    Timezone = ${mysql.escape(req.body.Timezone)}, Language=${mysql.escape(
  req.body.Language,
)}, 
    Image=${mysql.escape(req.body.Image)} WHERE UserID = ${req.body.UserID}`;
    }
    conn.query(updateQuery, (error, result) => {
      console.log(error);
      if (error) {
        res.writeHead(400, {
          "content-type": "text/plain",
        });
        res.end("Sql error");
      } else {
        console.log("Fetching sql result");
        console.log(result);
        res.writeHead(200, {
          "Content-type": "application/json",
        });
        res.end(JSON.stringify(result[0]));
      }
    });
  });
});

// Update Email ID
router.post("/Email", (req, res) => {
  connection.getConnection((err, conn) => {
    if (err) {
      console.log('Cannot connect to database');
      console.log(err);
      throw err;
    } else {
      console.log('Connection111 successful');
      console.log("Inside Email update");
      // check if email id is associated with any profiles
      console.log(req.body.Email);
      const validateQuery = `SELECT UserID FROM UserDetails WHERE Email =${mysql.escape(
        req.body.Email,
      )}`;
      conn.query(validateQuery, (error, result) => {
        if (error) {
          res.writeHead(400, {
            "content-type": "text/plain",
          });
          res.end("Sql error");
        } else {
          console.log("Inside checking email");
          if (result.length !== 0) {
            res.writeHead(400, {
              "content-type": "text/plain",
            });
            console.log("email already exists");
            res.end("Email exists");
          } else {
            const updateEmail = `UPDATE UserDetails SET Email =${mysql.escape(
              req.body.Email,
            )} WHERE UserID = ${mysql.escape(req.body.UserID)}`;
            conn.query(updateEmail, (updateErr, success) => {
              if (updateErr) {
                res.writeHead(400, {
                  "content-type": "text/plain",
                });
                res.end("Cannot update Email");
              } else {
                res.writeHead(200, {
                  "content-type": "text/plain",
                });
                console.log(success);
                res.end("Successfully updated Email");
                conn.release();
              }
            });
          }
        }
      });
    }
  });
});

// Storing documents/Images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./Routes/Images");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

// uploadfile

router.post("/upload-file", upload.array("photos", 5), (req, res) => {
  console.log("inside uploading");
  console.log("req.body", req.body);
  res.end();
});

// downloadfile

router.post("/getImage/:file(*)", (req, res) => {
  console.log("Inside get pic");
  const { file } = req.params;
  const filelocation = path.join(`${__dirname}/Images`, file);
  const img = fs.readFileSync(filelocation);
  const base64img = Buffer.from(img).toString("base64");
  res.writeHead(200, {
    "Content-type": "image/jpg",
  });
  res.end(base64img);
});

module.exports = router;
