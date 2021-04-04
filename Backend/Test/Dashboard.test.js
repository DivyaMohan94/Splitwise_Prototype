const request = require('supertest')('http://localhost:3001');
const { describe, it } = require('mocha');

describe('GET /dashboard/userList', () => {
  it('should succesfully return user list', (done) => {
    request
      .get('/dashboard/userList')
      .query({ userId: 1 })
      .expect(200, [
        { UserID: 1, UserName: 'User1' },
        { UserID: 2, UserName: 'dummy' },
        { UserID: 3, UserName: 'divyamohan' }], done);
  });
});
