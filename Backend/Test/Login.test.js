const request = require('supertest')('http://localhost:3001');
const { describe, it } = require('mocha');

describe('POST /login', () => {
  it('should successfully login if user exists', () => {
    request
      .post('/login')
      .send({ emailID: 'divya@gmail.com', password: '12345678' })
      .expect(200);
  });

  it('should throw error if login details are not valid', () => {
    request
      .post('/login')
      .send({ emailID: 'IDontExist@gmail.com', password: '12345678' })
      .expect(400);
  });
});
