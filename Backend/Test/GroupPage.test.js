const request = require('supertest')('http://localhost:3001');
const { describe, it } = require('mocha');

describe('PUT /group/acceptInvites', () => {
  it('should let user to accept group invite', () => {
    request
      .put('/group/acceptInvites')
      .send({ UserId: "6063b3ad6f9cace810a27198", GroupID: "606b54abb7c3266070a642a4" })
      .expect(200);
  });
});
