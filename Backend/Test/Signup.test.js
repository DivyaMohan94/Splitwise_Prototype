const request = require('supertest')('http://localhost:3001');
const { describe, it } = require('mocha');

describe('POST /signup', () => {
  it('should successfully signup new user', () => {
    request
      .post('/signup')
      .send({ userName: "mochaTest", emailID: "sample@gmail.com", password: "12345678" })
      .expect(200);
  });

  it('should throw error if details are invalid', () => {
    request
      .post('/signup')
      .send({ userName: "mochaTest", emailID: "divya@gmail.com", password: "12345678" })
      .expect(400);
  });
});
