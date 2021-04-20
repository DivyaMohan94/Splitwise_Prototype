const request = require('supertest')('http://localhost:3001');
const { describe, it } = require('mocha');

describe('POST /profile/Email', () => {
  it('should successfully update E-mail ID', () => {
    request
      .post('/profile/Email')
      .send({ userID: "6063b3ad6f9cace810a27198", phoneNum: "1234567890" })
      .expect(200);
  });

  // it('should throw error if user enters an e-mail ID that is already associated with another user', () => {
  //   request
  //     .post('/profile/Email')
  //     .send({ UserID: 10, Email: "divyamohan94@gmail.com" })
  //     .expect(400);
  // });
});
