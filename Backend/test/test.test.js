const chai = require('chai');
chai.use(require('chai-http'));
const { expect } = require('chai');
const { it } = require('mocha');
const app = require('../index');

const api_url = "http://localhost:3001";

it("Test Dashboard data", (done) => {
  chai
    .request(api_url)
    .get("/dashboard?userID=6063b3ad6f9cace810a27198")
    .set('Authorization', 'JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MDYzYjNhZDZmOWNhY2U4MTBhMjcxOTgiLCJ1c2VyTmFtZSI6ImRpdnlhIiwiY3VycmVuY3kiOiJHQlAiLCJlbWFpbElEIjoiZGl2eWFAZ21haWwuY29tIiwiaWF0IjoxNjE5MDM0NjA4LCJleHAiOjE2MjAwNDI2MDh9.xYaAFfESR275YDBUPHF7Ii1uj68089poYBm0_DiVh5M')
    .end((err, res) => {
      expect(res).to.have.status(200);
      done();
    });
});

it("Test Get All Friends Names", (done) => {
  chai
    .request(api_url)
    .get("/creategroup/getFriends?userID=6063b3ad6f9cace810a27198")
    .set('Authorization', 'JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MDYzYjNhZDZmOWNhY2U4MTBhMjcxOTgiLCJ1c2VyTmFtZSI6ImRpdnlhIiwiY3VycmVuY3kiOiJHQlAiLCJlbWFpbElEIjoiZGl2eWFAZ21haWwuY29tIiwiaWF0IjoxNjE5MDM0NjA4LCJleHAiOjE2MjAwNDI2MDh9.xYaAFfESR275YDBUPHF7Ii1uj68089poYBm0_DiVh5M')
    .end((err, res) => {
      expect(res).to.have.status(200);
      done();
    });
});

it("Test login", (done) => {
  chai
    .request(api_url)
    .post("/login")
    .send({ emailID: 'divya@gmail.com', password: '12345678' })
    .end((err, res) => {
      expect(res).to.have.status(200);
      done();
    });
});

it("Test sign up", (done) => {
  chai
    .request(api_url)
    .post("/signup")
    .send({ name: 'jerry', emailID: 'jerry@gmail.com', password: '12345678' })
    .end((err, res) => {
      expect(res).to.have.status(200);
      done();
    });
});

it("Test leave group", (done) => {
  chai
    .request(api_url)
    .put("/group/leaveGroup")
    .send({ userID: "6063b3ad6f9cace810a27198", groupID: "6078eece629a02f8c3687f49" })
    .set('Authorization', 'JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MDYzYjNhZDZmOWNhY2U4MTBhMjcxOTgiLCJ1c2VyTmFtZSI6ImRpdnlhIiwiY3VycmVuY3kiOiJHQlAiLCJlbWFpbElEIjoiZGl2eWFAZ21haWwuY29tIiwiaWF0IjoxNjE5MDM0NjA4LCJleHAiOjE2MjAwNDI2MDh9.xYaAFfESR275YDBUPHF7Ii1uj68089poYBm0_DiVh5M')
    .end((err, res) => {
      expect(res).to.have.status(200);
      done();
    });
});
