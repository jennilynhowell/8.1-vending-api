const request = require("supertest");
const assert = require("assert");
const app = require("./app");

// describe("GET /hello", function () {
//   it("should return successfully", function (done) {
//     request(app)
//       .get("/hello")
//       .expect(200)
//       .expect("Content-Type", "application/json; charset=utf-8")
//       .expect(function (res) {
//         assert.equal(res.body['hello'], "world");
//       })
//       .end(done);
//   })
// })

describe('GET, /api/customer/items', function() {
  it('should return successfully', function(done){
    request(app)
      .get('/api/customer/items')
      .expect(200)
      .expect('Content-Type', 'application/json; charset=utf-8');
      .end(done);
  })
});
