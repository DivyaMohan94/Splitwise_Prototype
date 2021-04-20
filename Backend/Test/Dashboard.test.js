const request = require('supertest')('http://localhost:3001');
const { describe, it } = require('mocha');

describe('GET /dashboard/userList', () => {
  it('should succesfully return user list', () => {
    request
      .get('/dashboard/userList')
      .query({ userId: 1 })
      .expect(200);
  });
});
