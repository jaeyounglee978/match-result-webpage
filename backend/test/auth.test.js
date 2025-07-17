const chai = require('chai');
const expect = chai.expect;
const authMiddleware = require('../middleware/authMiddleware');

describe('Auth Middleware', () => {
  it('should return 401 if no token is provided', () => {
    const req = { headers: {} };
    const res = { status: function(s) { this.statusCode = s; return this; }, send: function() {} };
    const next = () => {};

    authMiddleware(req, res, next);
    expect(res.statusCode).to.equal(401);
  });

  it('should return 401 if token is invalid', () => {
    const req = { headers: { authorization: 'Bearer invalidtoken' } };
    const res = { status: function(s) { this.statusCode = s; return this; }, send: function() {} };
    const next = () => {};

    authMiddleware(req, res, next);
    expect(res.statusCode).to.equal(401);
  });
});