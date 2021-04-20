const fs = require('fs');
const AWS = require('aws-sdk');
const path = require("path");
const {
  awsBucket, awsAccessKey, awsSecretAccessKey, awsPermission,
} = require('./config');

const s3 = new AWS.S3({
  accessKeyId: awsAccessKey,
  secretAccessKey: awsSecretAccessKey,
});

const deleteFile = (file) => {
  fs.unlink(file.path, (err) => {
    if (err) {
      console.log(err);
    }
  });
};

function uploadFileToS3(file) {
  console.log('inside file uplod');
  console.log(file.path);
  const promise = new Promise((resolve, reject) => {
    const params = {
      Bucket: `${awsBucket}`,
      Key: file.originalname,
      ContentType: file.mimetype,
      Body: fs.createReadStream(file.path),
      ACL: awsPermission,
    };

    s3.upload(params, (s3Err, resp) => {
      if (s3Err) {
        console.log(s3Err);
        deleteFile(file);
        reject(s3Err);
      } else {
        imageUrl = resp.Location;
        deleteFile(file);
        resolve(resp);
      }
    });
  });
  return promise;
}

function downloadFromS3(fileName) {
  console.log('inside file download', fileName);
  // const fullPath = path.join(`https://cmpe273splitwise.s3.amazonaws.com/`, fileName);
  const promise = new Promise((resolve, reject) => {
    const params = {
      Bucket: `${awsBucket}`,
      Key: fileName,
    };

    let attachment;
    let file;

    s3.getObject(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        file = Buffer.from(data.Body, 'binary');
        attachment = file.toString('base64');
        console.log('data', data);
        console.log('file', file);
        resolve(attachment);
      }
    });
  });
  return promise;
}

module.exports = { uploadFileToS3, downloadFromS3 };
