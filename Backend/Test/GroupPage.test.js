const request = require('supertest')('http://localhost:3001');
const { describe, it } = require('mocha');

describe('PUT /group/acceptInvites', () => {
  it('should let user to accept group invite', () => {
    request
      .put('/group/acceptInvites')
      .send({ UserId: 3, GroupID: 1 })
      .expect(200);
  });
});
